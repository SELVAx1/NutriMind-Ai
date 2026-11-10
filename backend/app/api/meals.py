from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.middleware.supabase_auth import get_current_user
from app.agents.meal_plan_agent import generate_meal_plan
from app.agents.swap_agent import find_alternatives
from app.agents.rescue_agent import rescue_meal
import logging

logger = logging.getLogger("nutrimind.meals")

router = APIRouter(prefix="/api/meals", tags=["meals"])


class PlanRequest(BaseModel):
    days: int = 1


@router.post("/plan")
async def create_meal_plan(req: PlanRequest, user=Depends(get_current_user)):
    try:
        result = await generate_meal_plan(user["id"], req.days)
        return result
    except Exception as e:
        logger.error("Meal plan error: %s", e)
        return {"error": str(e), "meals": []}


class SwapRequest(BaseModel):
    food_item_id: str
    quantity_g: float = 150


@router.post("/swap")
async def swap_food(req: SwapRequest, user=Depends(get_current_user)):
    try:
        result = await find_alternatives(user["id"], req.food_item_id, req.quantity_g)
        return result
    except Exception as e:
        logger.error("Swap error: %s", e)
        return {"error": str(e), "alternatives": []}


class RescueRequest(BaseModel):
    actual_food: str
    meal_type: str = "lunch"


@router.post("/rescue")
async def rescue(req: RescueRequest, user=Depends(get_current_user)):
    try:
        result = await rescue_meal(user["id"], req.actual_food, req.meal_type)
        return result
    except Exception as e:
        logger.error("Rescue error: %s", e)
        return {"error": str(e), "summary": "Could not generate recovery plan."}


@router.get("/plans")
async def list_plans(user=Depends(get_current_user)):
    from app.db.supabase_client import get_supabase
    sb = get_supabase()
    plans = sb.table("meal_plans").select("*").eq("user_id", user["id"]).order("created_at", desc=True).limit(10).execute()
    return {"plans": plans.data or []}


@router.get("/plans/{plan_id}")
async def get_plan(plan_id: str, user=Depends(get_current_user)):
    from app.db.supabase_client import get_supabase
    sb = get_supabase()
    items = sb.table("meal_plan_items").select("*, food_items(*)").eq("meal_plan_id", plan_id).order("meal_type").execute()
    return {"plan_id": plan_id, "items": items.data or []}
