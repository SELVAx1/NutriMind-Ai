from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from app.middleware.supabase_auth import get_current_user
from app.db.supabase_client import get_supabase
from app.services.nutrition_engine import calculate_food_nutrition
from app.services.food_service import search_food
from datetime import date, timedelta
import logging

logger = logging.getLogger("nutrimind.analytics")

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/weekly")
async def get_weekly_summary(user=Depends(get_current_user)):
    sb = get_supabase()
    today = date.today()
    week_ago = (today - timedelta(days=7)).isoformat()

    logs = sb.table("food_logs").select(
        "*, food_log_items(*, food_items(*, nutritional_values(*)))"
    ).eq("user_id", user["id"]).order("log_date").execute()

    daily_data = {}
    for log in (logs.data or []):
        day = log["log_date"]
        if day not in daily_data:
            daily_data[day] = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fibre": 0, "iron": 0, "calcium": 0, "vitamin_b12": 0, "meals": 0}

        for item in log.get("food_log_items", []):
            nv = item.get("food_items", {}).get("nutritional_values")
            if nv:
                n = calculate_food_nutrition(nv, item["quantity_g"])
                for k in ["calories", "protein", "carbs", "fat", "fibre", "iron", "calcium"]:
                    daily_data[day][k] += n.get(k, 0)
                daily_data[day]["vitamin_b12"] += n.get("vitamin_b12", 0)
                daily_data[day]["meals"] += 1

    profile = sb.table("user_profiles").select("*").eq("user_id", user["id"]).execute()
    profile_data = profile.data[0] if profile.data else {}

    targets = None
    if profile_data.get("id"):
        t = sb.table("user_nutrition_targets").select("*").eq("profile_id", profile_data["id"]).execute()
        targets = t.data[0] if t.data else None

    days_list = sorted(daily_data.items(), key=lambda x: x[0])

    patterns = []
    if len(days_list) >= 3:
        avg_protein = sum(d["protein"] for _, d in days_list) / len(days_list)
        avg_iron = sum(d["iron"] for _, d in days_list) / len(days_list)
        avg_calories = sum(d["calories"] for _, d in days_list) / len(days_list)

        if targets:
            if avg_protein < (targets.get("protein_g", 60) * 0.7):
                patterns.append({"type": "low", "nutrient": "Protein", "avg": round(avg_protein, 1), "target": targets.get("protein_g", 60), "message": "Your average protein intake is consistently below target."})
            if avg_iron < (targets.get("iron_mg", 18) * 0.6):
                patterns.append({"type": "low", "nutrient": "Iron", "avg": round(avg_iron, 1), "target": targets.get("iron_mg", 18), "message": "Your dietary iron intake may be below the reference target."})
            if avg_calories < (targets.get("calories_kcal", 2000) * 0.6):
                patterns.append({"type": "low", "nutrient": "Calories", "avg": round(avg_calories), "target": targets.get("calories_kcal", 2000), "message": "You may be eating fewer calories than recommended."})

        breakfast_count = sum(1 for log in (logs.data or []) if log["meal_type"] == "breakfast")
        if breakfast_count < len(days_list) * 0.5:
            patterns.append({"type": "habit", "nutrient": "Breakfast", "message": "You skip breakfast frequently. Consider quick options like idli or ragi porridge."})

    return {
        "daily": [{"date": d, **data} for d, data in days_list],
        "patterns": patterns,
        "targets": targets,
        "days_tracked": len(days_list),
    }


class WhatIfRequest(BaseModel):
    replace_food: str
    with_food: str
    quantity_g: float = 200
    days: int = 30


@router.post("/what-if")
async def what_if_simulation(req: WhatIfRequest, user=Depends(get_current_user)):
    original_matches = search_food(req.replace_food, limit=1)
    replacement_matches = search_food(req.with_food, limit=1)

    if not original_matches or not replacement_matches:
        return {"error": "Could not find one or both foods in the database."}

    original = original_matches[0]
    replacement = replacement_matches[0]

    orig_nv = original.get("nutritional_values", {})
    repl_nv = replacement.get("nutritional_values", {})

    if not orig_nv or not repl_nv:
        return {"error": "Nutritional data unavailable for one or both foods."}

    orig_n = calculate_food_nutrition(orig_nv, req.quantity_g)
    repl_n = calculate_food_nutrition(repl_nv, req.quantity_g)

    daily_delta = {k: round(repl_n.get(k, 0) - orig_n.get(k, 0), 1) for k in orig_n}
    total_delta = {k: round(v * req.days, 1) for k, v in daily_delta.items()}

    return {
        "original": {"name": original["name"], "name_tamil": original.get("name_tamil"), "nutrition_per_serving": orig_n},
        "replacement": {"name": replacement["name"], "name_tamil": replacement.get("name_tamil"), "nutrition_per_serving": repl_n},
        "quantity_g": req.quantity_g,
        "days": req.days,
        "daily_delta": daily_delta,
        "total_delta": total_delta,
        "disclaimer": "This is an estimate based on recorded dietary intake. It does not predict weight or medical outcomes.",
    }
