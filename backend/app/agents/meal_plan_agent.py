import json
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


async def generate_meal_plan(user_id: str, days: int = 1) -> dict:
    sb = get_supabase()

    profile = sb.table("user_profiles").select("*").eq("user_id", user_id).execute()
    profile_data = profile.data[0] if profile.data else {}

    targets = None
    if profile_data.get("id"):
        t = sb.table("user_nutrition_targets").select("*").eq("profile_id", profile_data["id"]).execute()
        targets = t.data[0] if t.data else None

    foods = get_common_foods()

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

    prompt = f"""Generate a daily meal plan for this user:

Diet: {profile_data.get('diet_type', 'veg')}
Region: {profile_data.get('region', 'South Indian')}
Budget: ₹{profile_data.get('budget_daily', 200)}/day
Max cooking time: {profile_data.get('max_cooking_min', 30)} min per meal
Calorie target: {targets.get('calories_kcal', 2000) if targets else 2000} kcal
Protein target: {targets.get('protein_g', 60) if targets else 60} g

Available foods (use ONLY these IDs):
{json.dumps(food_list, indent=2)}

Generate a balanced plan with 4 meals (breakfast, lunch, snack, dinner)."""

    try:
        response = await generate_text(prompt, system=PLAN_SYSTEM)

        json_str = response
        if "```json" in json_str:
            json_str = json_str.split("```json")[1].split("```")[0]
        elif "```" in json_str:
            json_str = json_str.split("```")[1].split("```")[0]

        plan_data = json.loads(json_str.strip())
        meals = plan_data.get("meals", [])

        today = date.today()
        plan = sb.table("meal_plans").insert({
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
            food = get_food_by_id(meal.get("food_id", ""))
            if not food:
                continue

            quantity = meal.get("quantity_g", 150)
            nv = food.get("nutritional_values", {})
            nutrition = calculate_food_nutrition(nv, quantity) if nv else {}

            cost = meal.get("estimated_cost", 20)
            total_cost += cost

            for k in total_nutrition:
                total_nutrition[k] += nutrition.get(k, 0)

            sb.table("meal_plan_items").insert({
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
