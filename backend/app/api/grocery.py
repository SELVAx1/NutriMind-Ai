from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.middleware.supabase_auth import get_current_user
from app.agents.grocery_agent import generate_grocery_list
from app.db.supabase_client import get_supabase

router = APIRouter(prefix="/api/grocery", tags=["grocery"])


class GroceryRequest(BaseModel):
    plan_id: str | None = None


@router.post("/generate")
async def create_grocery_list(req: GroceryRequest, user=Depends(get_current_user)):
    result = await generate_grocery_list(user["id"], req.plan_id)
    return result


@router.get("/lists")
async def list_grocery_lists(user=Depends(get_current_user)):
    sb = get_supabase()
    lists = sb.table("grocery_lists").select("*").eq("user_id", user["id"]).order("created_at", desc=True).limit(10).execute()
    return {"lists": lists.data or []}


@router.get("/lists/{list_id}")
async def get_grocery_list(list_id: str, user=Depends(get_current_user)):
    sb = get_supabase()
    items = sb.table("grocery_items").select("*").eq("grocery_list_id", list_id).execute()
    return {"list_id": list_id, "items": items.data or []}


@router.patch("/items/{item_id}")
async def toggle_grocery_item(item_id: str, user=Depends(get_current_user)):
    sb = get_supabase()
    item = sb.table("grocery_items").select("in_pantry").eq("id", item_id).execute()
    if item.data:
        current = item.data[0]["in_pantry"] if isinstance(item.data, list) else item.data["in_pantry"]
        sb.table("grocery_items").update({"in_pantry": not current}).eq("id", item_id).execute()
        return {"in_pantry": not current}
    return {"error": "Item not found"}
