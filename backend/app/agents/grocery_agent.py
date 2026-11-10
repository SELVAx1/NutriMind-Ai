from app.services.food_service import get_food_by_id
from app.db.supabase_client import get_supabase
import logging

logger = logging.getLogger("nutrimind.grocery")

CATEGORY_MAP = {
    "staple": "Grains & Staples",
    "rice": "Grains & Staples",
    "breakfast": "Breakfast Items",
    "curry": "Dal & Curries",
    "side": "Vegetables & Sides",
    "snack": "Snacks & Protein",
    "protein": "Snacks & Protein",
    "dairy": "Dairy",
    "fruit": "Fruits",
    "condiment": "Condiments & Spices",
    "beverage": "Beverages",
    "soup": "Dal & Curries",
}


async def generate_grocery_list(user_id: str, plan_id: str | None = None) -> dict:
    sb = get_supabase()

    if plan_id:
        items_result = sb.table("meal_plan_items").select("*, food_items(*)").eq("meal_plan_id", plan_id).execute()
    else:
        plans = sb.table("meal_plans").select("id").eq("user_id", user_id).eq("status", "active").order("created_at", desc=True).limit(1).execute()
        if not plans.data:
            return {"error": "No active meal plan found", "items": [], "total_cost": 0}
        plan_id = plans.data[0]["id"]
        items_result = sb.table("meal_plan_items").select("*, food_items(*)").eq("meal_plan_id", plan_id).execute()

    if not items_result.data:
        return {"error": "No items in meal plan", "items": [], "total_cost": 0}

    aggregated: dict[str, dict] = {}
    for item in items_result.data:
        food = item.get("food_items", {})
        if not food:
            continue

        food_name = food.get("name", "Unknown")
        category = food.get("category", "other")

        if food_name in aggregated:
            aggregated[food_name]["quantity_g"] += item.get("quantity_g", 0)
            aggregated[food_name]["estimated_cost"] += item.get("estimated_cost", 0)
            aggregated[food_name]["meal_count"] += 1
        else:
            aggregated[food_name] = {
                "ingredient_name": food_name,
                "quantity_g": item.get("quantity_g", 0),
                "estimated_cost": item.get("estimated_cost", 0),
                "category": CATEGORY_MAP.get(category, "Other"),
                "food_id": food.get("id"),
                "meal_count": 1,
            }

    grocery_items = sorted(aggregated.values(), key=lambda x: x["category"])
    total_cost = sum(item["estimated_cost"] for item in grocery_items)

    grocery_list = sb.table("grocery_lists").insert({
        "meal_plan_id": plan_id,
        "user_id": user_id,
        "total_estimated_cost": total_cost,
        "status": "pending",
    }).execute()
    list_id = grocery_list.data[0]["id"] if isinstance(grocery_list.data, list) else grocery_list.data["id"]

    for item in grocery_items:
        sb.table("grocery_items").insert({
            "grocery_list_id": list_id,
            "ingredient_name": item["ingredient_name"],
            "quantity": item["quantity_g"],
            "unit": "g",
            "estimated_cost": item["estimated_cost"],
            "in_pantry": False,
        }).execute()

    return {
        "list_id": list_id,
        "plan_id": plan_id,
        "items": grocery_items,
        "total_cost": total_cost,
    }
