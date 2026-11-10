import json
from app.ai.factory import generate_text
from app.services.food_service import get_food_by_id, search_food, get_common_foods
from app.services.nutrition_engine import calculate_food_nutrition
from app.db.supabase_client import get_supabase
import logging

logger = logging.getLogger("nutrimind.swap")


async def find_alternatives(user_id: str, food_item_id: str, quantity_g: float = 150) -> dict:
    sb = get_supabase()

    original = get_food_by_id(food_item_id)
    if not original:
        return {"error": "Food item not found", "alternatives": []}

    profile = sb.table("user_profiles").select("*").eq("user_id", user_id).execute()
    profile_data = profile.data[0] if profile.data else {}

    original_nv = original.get("nutritional_values", {})
    original_nutrition = calculate_food_nutrition(original_nv, quantity_g) if original_nv else {}

    all_foods = get_common_foods()
    candidates = [
        f for f in all_foods
        if f["id"] != food_item_id and f.get("nutritional_values")
    ]

    if profile_data.get("diet_type") == "veg":
        candidates = [f for f in candidates if f.get("category") != "protein" or f.get("name") != "Egg (boiled)"]

    scored = []
    for f in candidates:
        nv = f["nutritional_values"]
        n = calculate_food_nutrition(nv, quantity_g)
        protein_diff = abs(n.get("protein", 0) - original_nutrition.get("protein", 0))
        calorie_diff = abs(n.get("calories", 0) - original_nutrition.get("calories", 0))
        score = protein_diff * 2 + calorie_diff * 0.01
        scored.append({"food": f, "nutrition": n, "score": score})

    scored.sort(key=lambda x: x["score"])
    top_3 = scored[:3]

    alternatives_text = ""
    for i, alt in enumerate(top_3):
        f = alt["food"]
        n = alt["nutrition"]
        alternatives_text += f"\n{i+1}. {f['name']} ({quantity_g}g): {n.get('calories',0)} kcal, {n.get('protein',0)}g protein, {n.get('iron',0)}mg iron"

    prompt = f"""The user wants to swap "{original['name']}" ({quantity_g}g, {original_nutrition.get('calories',0)} kcal, {original_nutrition.get('protein',0)}g protein).

Their diet: {profile_data.get('diet_type', 'veg')}, budget: ₹{profile_data.get('budget_daily', 200)}/day.

Top alternatives:{alternatives_text}

For each alternative, write ONE sentence explaining why it's a good swap. Focus on nutrition, affordability, and the user's diet.
Respond as JSON: {{"explanations": ["reason 1", "reason 2", "reason 3"]}}"""

    explanations = ["Good nutritional match.", "Good nutritional match.", "Good nutritional match."]
    try:
        resp = await generate_text(prompt)
        json_str = resp
        if "```json" in json_str:
            json_str = json_str.split("```json")[1].split("```")[0]
        elif "```" in json_str:
            json_str = json_str.split("```")[1].split("```")[0]
        parsed = json.loads(json_str.strip())
        explanations = parsed.get("explanations", explanations)
    except Exception as e:
        logger.warning("Swap explanation generation failed: %s", e)

    result_alternatives = []
    for i, alt in enumerate(top_3):
        f = alt["food"]
        n = alt["nutrition"]
        result_alternatives.append({
            "food_id": f["id"],
            "name": f["name"],
            "name_tamil": f.get("name_tamil"),
            "category": f.get("category"),
            "nutrition": n,
            "explanation": explanations[i] if i < len(explanations) else "",
        })

    return {
        "original": {
            "food_id": original["id"],
            "name": original["name"],
            "name_tamil": original.get("name_tamil"),
            "nutrition": original_nutrition,
        },
        "alternatives": result_alternatives,
        "quantity_g": quantity_g,
    }
