from fastapi import APIRouter, Depends
from app.middleware.supabase_auth import get_current_user
from app.db.supabase_client import get_supabase
from app.services.nutrition_engine import calculate_food_nutrition
import logging

logger = logging.getLogger("nutrimind.nutritionist")

router = APIRouter(prefix="/api/nutritionist", tags=["nutritionist"])


@router.get("/clients")
async def list_clients(user=Depends(get_current_user)):
    sb = get_supabase()
    assignments = sb.table("client_assignments").select("*, user_profiles(*)").eq("nutritionist_id", user["id"]).eq("status", "active").execute()
    return {"clients": assignments.data or []}


@router.get("/clients/{client_id}/summary")
async def get_client_summary(client_id: str, user=Depends(get_current_user)):
    sb = get_supabase()

    profile = sb.table("user_profiles").select("*").eq("user_id", client_id).execute()
    if not profile.data:
        return {"error": "Client not found"}

    profile_data = profile.data[0] if isinstance(profile.data, list) else profile.data

    targets = None
    if profile_data.get("id"):
        t = sb.table("user_nutrition_targets").select("*").eq("profile_id", profile_data["id"]).execute()
        targets = t.data[0] if t.data else None

    from datetime import date
    today = date.today().isoformat()
    logs = sb.table("food_logs").select("*, food_log_items(*, food_items(*, nutritional_values(*)))").eq("user_id", client_id).eq("log_date", today).execute()

    daily_nutrition = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0, "iron": 0}
    for log in (logs.data or []):
        for item in log.get("food_log_items", []):
            nv = item.get("food_items", {}).get("nutritional_values")
            if nv:
                n = calculate_food_nutrition(nv, item["quantity_g"])
                for k in daily_nutrition:
                    daily_nutrition[k] += n.get(k, 0)

    plans = sb.table("meal_plans").select("*").eq("user_id", client_id).eq("status", "active").order("created_at", desc=True).limit(1).execute()

    feedback = sb.table("user_feedback").select("*").eq("user_id", client_id).order("created_at", desc=True).limit(5).execute()

    return {
        "profile": profile_data,
        "targets": targets,
        "today_nutrition": daily_nutrition,
        "active_plan": plans.data[0] if plans.data else None,
        "recent_feedback": feedback.data or [],
    }


@router.post("/approve/{plan_id}")
async def approve_plan(plan_id: str, user=Depends(get_current_user)):
    sb = get_supabase()
    sb.table("recommendation_approvals").insert({
        "meal_plan_id": plan_id,
        "nutritionist_id": user["id"],
        "status": "approved",
    }).execute()
    return {"status": "approved", "plan_id": plan_id}
