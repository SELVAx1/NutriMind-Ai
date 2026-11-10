import base64
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from app.middleware.supabase_auth import get_current_user
from app.services.food_service import search_food, get_food_by_id, log_food_entry
from app.services.nutrition_engine import calculate_food_nutrition
from app.agents.food_recognition_agent import analyze_food_image as run_food_analysis
from datetime import date

router = APIRouter(prefix="/api/food", tags=["food"])


@router.get("/search")
async def search(q: str = Query(default="", min_length=1), user=Depends(get_current_user)):
    results = search_food(q)
    return {"results": results, "count": len(results)}


@router.get("/{food_id}")
async def get_food(food_id: str, user=Depends(get_current_user)):
    food = get_food_by_id(food_id)
    if not food:
        return {"error": "Food not found"}, 404
    return food


class LogFoodRequest(BaseModel):
    meal_type: str
    food_item_id: str
    quantity_g: float
    log_date: str | None = None


@router.post("/log")
async def log_food(req: LogFoodRequest, user=Depends(get_current_user)):
    log_date = req.log_date or date.today().isoformat()
    item = log_food_entry(user["id"], log_date, req.meal_type, req.food_item_id, req.quantity_g)

    food = get_food_by_id(req.food_item_id)
    nutrition = None
    if food and food.get("nutritional_values"):
        nutrition = calculate_food_nutrition(food["nutritional_values"], req.quantity_g)

    return {"item": item, "nutrition": nutrition}


class AnalyzeRequest(BaseModel):
    image_base64: str


@router.post("/analyze")
async def analyze_food_image_endpoint(req: AnalyzeRequest, user=Depends(get_current_user)):
    image_bytes = base64.b64decode(req.image_base64)
    result = await run_food_analysis(image_bytes)
    return result
