import base64
from fastapi import APIRouter, Depends, Query, HTTPException
from pydantic import BaseModel, Field
from app.middleware.supabase_auth import get_current_user
from app.services.food_service import search_food, get_food_by_id, log_food_entry
from app.services.nutrition_engine import calculate_food_nutrition
from app.agents.food_recognition_agent import analyze_food_image as run_food_analysis
from datetime import date

router = APIRouter(prefix="/api/food", tags=["food"])


@router.get("/search")
async def search(q: str = Query(default="", min_length=1), user=Depends(get_current_user)):
    results = await search_food(q)
    return {"results": results, "count": len(results)}


@router.get("/{food_id}")
async def get_food(food_id: str, user=Depends(get_current_user)):
    food = await get_food_by_id(food_id)
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    return food


class LogFoodRequest(BaseModel):
    meal_type: str
    food_item_id: str
    quantity_g: float
    log_date: str | None = None


@router.post("/log")
async def log_food(req: LogFoodRequest, user=Depends(get_current_user)):
    log_date = req.log_date or date.today().isoformat()
    item = await log_food_entry(user["id"], log_date, req.meal_type, req.food_item_id, req.quantity_g)

    food = await get_food_by_id(req.food_item_id)
    nutrition = None
    if food and food.get("nutritional_values"):
        nutrition = calculate_food_nutrition(food["nutritional_values"], req.quantity_g)

    return {"item": item, "nutrition": nutrition}


class AnalyzeRequest(BaseModel):
    image_base64: str = Field(..., max_length=15_000_000)


@router.post("/analyze")
async def analyze_food_image_endpoint(req: AnalyzeRequest, user=Depends(get_current_user)):
    try:
        raw_b64 = req.image_base64
        if "," in raw_b64:
            raw_b64 = raw_b64.split(",", 1)[1]
        image_bytes = base64.b64decode(raw_b64)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid base64 image data")
    result = await run_food_analysis(image_bytes)
    return result
