import json
import re
from app.ai.factory import generate_text
from app.services.food_service import get_common_foods, get_food_by_id
from app.services.nutrition_engine import calculate_food_nutrition
from app.db.supabase_client import get_supabase
from datetime import date, timedelta
import logging

logger = logging.getLogger("nutrimind.meal_plan")

PLAN_SYSTEM = """You are NutriMind AI's meal planning engine. Generate a structured daily meal plan using ONLY the foods from the provided list.

Rules:
- Use ONLY food IDs from the provided list. Do not invent foods.
- Respect the user's diet type (veg/non-veg/vegan).
- Stay within the daily budget.
- Keep prep time under the user's max cooking time per meal.
- Balance nutrition across meals to approach daily targets.
- For each meal, explain WHY you chose it in one sentence.

Respond with ONLY valid JSON:
{
  "meals": [
    {"meal_type": "breakfast", "food_id": "uuid", "food_name": "Idli", "quantity_g": 200, "estimated_cost": 25, "prep_time_min": 10, "explanation": "Idli provides easily digestible carbs and protein to start the day, and fits your budget."},
    {"meal_type": "lunch", "food_id": "uuid", "food_name": "...", ...},
    {"meal_type": "snack", "food_id": "uuid", "food_name": "...", ...},
    {"meal_type": "dinner", "food_id": "uuid", "food_name": "...", ...}
  ]
}"""


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

    food_list = []
    for f in foods:
        nv = f.get("nutritional_values")
        if not nv:
            continue
        food_list.append({
            "id": f["id"],
            "name": f["name"],
            "name_tamil": f.get("name_tamil", ""),
            "category": f.get("category", ""),
            "calories_per_100g": nv.get("calories_per_100g", 0),
            "protein_per_100g": nv.get("protein_per_100g", 0),
            "iron_mg_per_100g": nv.get("iron_mg", 0),
        })

    already_eaten_text = ""
    if eaten_foods:
        already_eaten_text = f"\n\nAlready eaten today: {', '.join(eaten_foods)}\nCalories consumed: {consumed['calories']} kcal, Protein consumed: {consumed['protein']}g"

    prompt = f"""Generate a meal plan for the REMAINING meals today: {', '.join(remaining_meals)}.

Diet: {profile_data.get('diet_type', 'veg')}
Region: {profile_data.get('region', 'South Indian')}
Budget: ₹{profile_data.get('budget_daily', 200)}/day
Max cooking time: {profile_data.get('max_cooking_min', 30)} min per meal
REMAINING calorie target: {remaining_cal} kcal (out of {target_cal} total)
REMAINING protein target: {remaining_pro}g (out of {target_pro}g total){already_eaten_text}

Available foods (use ONLY these IDs):
{json.dumps(food_list, indent=2)}

Generate ONLY these meals: {', '.join(remaining_meals)}. Balance nutrition to meet the remaining targets."""

    try:
        response = await generate_text(prompt, system=PLAN_SYSTEM)

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
