import json
import re
from app.ai.factory import generate_text
from app.services.food_service import get_common_foods, get_food_by_id
from app.services.nutrition_engine import calculate_food_nutrition
from app.db.supabase_client import get_supabase
from datetime import date, timedelta
import logging

logger = logging.getLogger("nutrimind.meal_plan")

PLAN_SYSTEM = """You are NutriMind AI's meal planner. Use ONLY food IDs from the list. Respond with ONLY valid JSON:
{"meals":[{"meal_type":"breakfast","food_id":"<id from list>","food_name":"Idli","quantity_g":200,"estimated_cost":25,"prep_time_min":10,"explanation":"High carb, light protein to start the day."}]}
Rules: use real IDs from provided list; respect diet type; stay within budget; one sentence explanation per meal."""


def extract_json(text: str) -> str:
    cleaned = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL)
    if "```json" in cleaned:
        return cleaned.split("```json")[1].split("```")[0]
    if "```" in cleaned:
        return cleaned.split("```")[1].split("```")[0]
    return cleaned


async def generate_meal_plan(user_id: str, days: int = 1) -> dict:
    sb = get_supabase()

    profile = await sb.table("user_profiles").select("*").eq("user_id", user_id).maybe_single().execute()
    profile_data = profile.data or {}

    targets = None
    if profile_data.get("id"):
        t = await sb.table("user_nutrition_targets").select("*").eq("profile_id", profile_data["id"]).maybe_single().execute()
        targets = t.data

    today = date.today().isoformat()
    logs = await sb.table("food_logs").select("*, food_log_items(*, food_items(*, nutritional_values(*)))").eq("user_id", user_id).eq("log_date", today).execute()

    consumed = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0, "iron": 0}
    logged_meals = set()
    eaten_foods = []

    for log in (logs.data or []):
        logged_meals.add(log["meal_type"])
        for item in log.get("food_log_items", []):
            food = item.get("food_items", {})
            nv = food.get("nutritional_values")
            if nv:
                n = calculate_food_nutrition(nv, item["quantity_g"])
                for k in consumed:
                    consumed[k] += n.get(k, 0)
                eaten_foods.append(f"{food.get('name', 'Unknown')} ({item['quantity_g']}g)")

    all_meal_types = ["breakfast", "lunch", "snack", "dinner"]
    remaining_meals = [m for m in all_meal_types if m not in logged_meals]

    if not remaining_meals:
        return {"error": "All meals for today are already logged!", "meals": []}

    target_cal = targets.get("calories_kcal", 2000) if targets else 2000
    target_pro = targets.get("protein_g", 60) if targets else 60
    remaining_cal = max(0, target_cal - consumed["calories"])
    remaining_pro = max(0, target_pro - consumed["protein"])

    foods = await get_common_foods()

    # Build compact food list — limit to 25 items to stay within token limits
    food_list = []
    for f in foods[:25]:
        nv = f.get("nutritional_values")
        if not nv:
            continue
        food_list.append({
            "id": f["id"],
            "n": f["name"],
            "nt": f.get("name_tamil", ""),
            "cat": f.get("category", ""),
            "cal": round(nv.get("calories_per_100g", 0), 1),
            "pro": round(nv.get("protein_per_100g", 0), 1),
            "fe": round(nv.get("iron_mg", 0), 1),
        })

    already_eaten_text = ""
    if eaten_foods:
        already_eaten_text = f"\nAlready eaten: {', '.join(eaten_foods[:5])}. Consumed: {consumed['calories']} kcal, {consumed['protein']}g protein."

    # Compact JSON — no indent to minimise tokens
    foods_json = json.dumps(food_list, separators=(',', ':'))

    prompt = f"""Generate a meal plan for: {', '.join(remaining_meals)}.
Diet:{profile_data.get('diet_type','veg')} Region:{profile_data.get('region','South Indian')} Budget:Rs{profile_data.get('budget_daily',200)}/day CookTime:{profile_data.get('max_cooking_min',30)}min
Remaining targets: {remaining_cal}kcal {remaining_pro}g protein (of {target_cal}kcal {target_pro}g total){already_eaten_text}
Fields: id=food_id, n=name, nt=tamil_name, cat=category, cal=cal/100g, pro=protein/100g
Foods: {foods_json}
Generate ONLY meals: {', '.join(remaining_meals)}."""

    try:
        response = await generate_text(prompt, system=PLAN_SYSTEM, json_mode=True)

        json_str = extract_json(response)
        plan_data = json.loads(json_str.strip())
        meals = plan_data.get("meals", [])

        today = date.today()
        plan = await sb.table("meal_plans").insert({
            "user_id": user_id,
            "start_date": today.isoformat(),
            "end_date": (today + timedelta(days=days - 1)).isoformat(),
            "status": "active",
        }).execute()
        plan_id = plan.data[0]["id"] if isinstance(plan.data, list) else plan.data["id"]

        enriched_meals = []
        total_cost = 0
        total_nutrition = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fibre": 0, "iron": 0}

        for meal in meals:
            food = await get_food_by_id(meal.get("food_id", ""))
            if not food:
                continue

            quantity = meal.get("quantity_g", 150)
            nv = food.get("nutritional_values", {})
            nutrition = calculate_food_nutrition(nv, quantity) if nv else {}

            cost = meal.get("estimated_cost", 20)
            total_cost += cost

            for k in total_nutrition:
                total_nutrition[k] += nutrition.get(k, 0)

            await sb.table("meal_plan_items").insert({
                "meal_plan_id": plan_id,
                "food_item_id": food["id"],
                "plan_date": today.isoformat(),
                "meal_type": meal.get("meal_type", "lunch"),
                "quantity_g": quantity,
                "estimated_cost": cost,
                "prep_time_min": meal.get("prep_time_min", 15),
                "explanation": meal.get("explanation", ""),
            }).execute()

            enriched_meals.append({
                "meal_type": meal.get("meal_type"),
                "food_name": food.get("name"),
                "food_name_tamil": food.get("name_tamil"),
                "food_id": food["id"],
                "quantity_g": quantity,
                "estimated_cost": cost,
                "prep_time_min": meal.get("prep_time_min", 15),
                "explanation": meal.get("explanation", ""),
                "nutrition": nutrition,
            })

        return {
            "plan_id": plan_id,
            "meals": enriched_meals,
            "total_cost": total_cost,
            "total_nutrition": total_nutrition,
            "budget": profile_data.get("budget_daily", 200),
        }

    except Exception as e:
        logger.error("Meal plan generation failed: %s", e)
        return {"error": str(e), "meals": []}
