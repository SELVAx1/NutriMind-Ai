from app.db.supabase_client import get_supabase


async def search_food(query: str, limit: int = 15) -> list[dict]:
    sb = get_supabase()
    safe_query = query.replace("%", "").replace("_", "").strip()
    if not safe_query:
        return []

    result = await sb.table("food_items").select("*, nutritional_values(*)").or_(
        f"name.ilike.%{safe_query}%,name_tamil.ilike.%{safe_query}%,name_hindi.ilike.%{safe_query}%,category.ilike.%{safe_query}%"
    ).limit(limit).execute()

    foods = result.data or []

    if len(foods) < limit:
        try:
            syn_result = await sb.table("food_synonyms").select("food_item_id").ilike("synonym", f"%{safe_query}%").limit(5).execute()
            if syn_result.data:
                existing_ids = {f["id"] for f in foods}
                for syn in syn_result.data:
                    fid = syn["food_item_id"]
                    if fid not in existing_ids:
                        food = await get_food_by_id(fid)
                        if food:
                            foods.append(food)
                            existing_ids.add(fid)
        except Exception:
            pass

    return foods[:limit]


async def get_food_by_id(food_id: str) -> dict | None:
    sb = get_supabase()
    result = await sb.table("food_items").select("*, nutritional_values(*)").eq("id", food_id).maybe_single().execute()
    return result.data


async def get_common_foods() -> list[dict]:
    sb = get_supabase()
    result = await sb.table("food_items").select("*, nutritional_values(*)").eq("is_common", True).order("name").execute()
    return result.data or []


async def get_seasonal_foods(season: str) -> list[dict]:
    sb = get_supabase()
    result = await sb.table("seasonal_foods").select("*").eq("season", season).execute()
    return result.data or []


async def log_food_entry(user_id: str, log_date: str, meal_type: str, food_item_id: str, quantity_g: float) -> dict:
    sb = get_supabase()

    existing = await sb.table("food_logs").select("id").eq("user_id", user_id).eq("log_date", log_date).eq("meal_type", meal_type).maybe_single().execute()

    if existing.data:
        log_id = existing.data["id"]
    else:
        new_log = await sb.table("food_logs").insert({"user_id": user_id, "log_date": log_date, "meal_type": meal_type}).execute()
        log_data = new_log.data
        if isinstance(log_data, list) and log_data:
            log_id = log_data[0]["id"]
        elif isinstance(log_data, dict):
            log_id = log_data.get("id")
        else:
            raise ValueError("Failed to create food log entry")

    item = await sb.table("food_log_items").insert({
        "food_log_id": log_id,
        "food_item_id": food_item_id,
        "quantity_g": quantity_g,
        "source": "manual",
    }).execute()

    item_data = item.data
    if isinstance(item_data, list) and item_data:
        return item_data[0]
    elif isinstance(item_data, dict):
        return item_data
    return {"id": "unknown", "food_log_id": log_id, "food_item_id": food_item_id}
