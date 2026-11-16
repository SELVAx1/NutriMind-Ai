from app.db.supabase_client import get_supabase


async def search_food(query: str, limit: int = 10) -> list[dict]:
    sb = get_supabase()
    safe_query = query.replace("%", "").replace("_", "").strip()
    if not safe_query:
        return []
    result = await sb.table("food_items").select("*, nutritional_values(*)").ilike("name", f"%{safe_query}%").limit(limit).execute()
    return result.data or []


async def get_food_by_id(food_id: str) -> dict | None:
    sb = get_supabase()
    result = await sb.table("food_items").select("*, nutritional_values(*)").eq("id", food_id).maybe_single().execute()
    return result.data


async def get_common_foods() -> list[dict]:
    sb = get_supabase()
    result = await sb.table("food_items").select("*, nutritional_values(*)").eq("is_common", True).order("name").execute()
    return result.data or []


async def log_food_entry(user_id: str, log_date: str, meal_type: str, food_item_id: str, quantity_g: float) -> dict:
    sb = get_supabase()

    existing = await sb.table("food_logs").select("id").eq("user_id", user_id).eq("log_date", log_date).eq("meal_type", meal_type).maybe_single().execute()

    if existing.data:
        log_id = existing.data["id"]
    else:
        new_log = await sb.table("food_logs").insert({"user_id": user_id, "log_date": log_date, "meal_type": meal_type}).execute()
        log_id = new_log.data[0]["id"]

    item = await sb.table("food_log_items").insert({
        "food_log_id": log_id,
        "food_item_id": food_item_id,
        "quantity_g": quantity_g,
        "source": "manual",
    }).execute()

    return item.data[0]
