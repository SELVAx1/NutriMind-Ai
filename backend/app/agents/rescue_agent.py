from app.ai.factory import generate_text
from app.services.food_service import search_food, get_common_foods
from app.services.nutrition_engine import calculate_food_nutrition
from app.db.supabase_client import get_supabase
from datetime import date
import json
import logging

logger = logging.getLogger("nutrimind.rescue")


async def rescue_meal(user_id: str, actual_food_name: str, meal_type: str = "lunch") -> dict:
    sb = get_supabase()

    profile = sb.table("user_profiles").select("*").eq("user_id", user_id).execute()
    profile_data = profile.data[0] if profile.data else {}

    targets = None
    if profile_data.get("id"):
        t = sb.table("user_nutrition_targets").select("*").eq("profile_id", profile_data["id"]).execute()
        targets = t.data[0] if t.data else None

    today = date.today().isoformat()
    logs = sb.table("food_logs").select("*, food_log_items(*, food_items(*, nutritional_values(*)))").eq("user_id", user_id).eq("log_date", today).execute()

    consumed = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0, "iron": 0}
    for log in (logs.data or []):
        for item in log.get("food_log_items", []):
            nv = item.get("food_items", {}).get("nutritional_values")
            if nv:
                n = calculate_food_nutrition(nv, item["quantity_g"])
                for k in consumed:
                    consumed[k] += n.get(k, 0)

    actual_matches = search_food(actual_food_name, limit=1)
    actual_food = actual_matches[0] if actual_matches else None
    actual_nutrition = {}
    if actual_food and actual_food.get("nutritional_values"):
        actual_nutrition = calculate_food_nutrition(actual_food["nutritional_values"], 200)

    remaining = {}
    if targets:
        remaining = {
            "calories": max(0, (targets.get("calories_kcal", 2000)) - consumed["calories"] - actual_nutrition.get("calories", 0)),
            "protein": max(0, (targets.get("protein_g", 60)) - consumed["protein"] - actual_nutrition.get("protein", 0)),
        }

    common_foods = get_common_foods()
    food_options = [{"name": f["name"], "id": f["id"]} for f in common_foods[:20]]

    prompt = f"""The user was supposed to eat a planned meal for {meal_type}, but ate "{actual_food_name}" instead.

Current consumed today: {consumed['calories']} kcal, {consumed['protein']}g protein
The actual meal adds: {actual_nutrition.get('calories', '?')} kcal, {actual_nutrition.get('protein', '?')}g protein
Remaining targets: ~{remaining.get('calories', '?')} kcal, ~{remaining.get('protein', '?')}g protein

Diet: {profile_data.get('diet_type', 'veg')}, Budget: ₹{profile_data.get('budget_daily', 200)}/day

Suggest a revised dinner that helps meet the remaining targets. Pick from: {json.dumps([f['name'] for f in food_options[:15]])}

Respond as JSON:
{{"revised_meal": {{"food_name": "...", "quantity_g": 200, "explanation": "..."}}, "summary": "..."}}"""

    try:
        resp = await generate_text(prompt, system="You are NutriRescue, a meal recovery agent. Help users recover from meal deviations with practical suggestions.")
        json_str = resp
        if "```json" in json_str:
            json_str = json_str.split("```json")[1].split("```")[0]
        elif "```" in json_str:
            json_str = json_str.split("```")[1].split("```")[0]

        result = json.loads(json_str.strip())

        revised = result.get("revised_meal", {})
        revised_food = search_food(revised.get("food_name", ""), limit=1)
        revised_nutrition = {}
        if revised_food and revised_food[0].get("nutritional_values"):
            revised_nutrition = calculate_food_nutrition(revised_food[0]["nutritional_values"], revised.get("quantity_g", 200))

        return {
            "actual_meal": {
                "name": actual_food_name,
                "nutrition": actual_nutrition,
                "matched_food": {"id": actual_food["id"], "name": actual_food["name"]} if actual_food else None,
            },
            "consumed_so_far": consumed,
            "remaining_targets": remaining,
            "revised_dinner": {
                "food_name": revised.get("food_name", ""),
                "food_id": revised_food[0]["id"] if revised_food else None,
                "quantity_g": revised.get("quantity_g", 200),
                "nutrition": revised_nutrition,
                "explanation": revised.get("explanation", ""),
            },
            "summary": result.get("summary", "Your dinner has been adjusted to compensate."),
        }

    except Exception as e:
        logger.error("NutriRescue failed: %s", e)
        return {"error": str(e), "summary": "Could not generate a recovery plan."}
