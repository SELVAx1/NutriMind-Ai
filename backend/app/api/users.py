from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.middleware.supabase_auth import get_current_user
from app.db.supabase_client import get_supabase
from app.services.nutrition_engine import calculate_bmr, calculate_tdee, calculate_macro_targets

router = APIRouter(prefix="/api/users", tags=["users"])


class ProfileCreate(BaseModel):
    full_name: str | None = None
    age: int | None = None
    gender: str | None = None
    height_cm: float | None = None
    weight_kg: float | None = None
    activity_level: str | None = None
    diet_type: str | None = None
    region: str | None = None
    budget_daily: float | None = None
    max_cooking_min: int | None = None


@router.get("/profile")
async def get_profile(user=Depends(get_current_user)):
    sb = get_supabase()
    profile = await sb.table("user_profiles").select("*").eq("user_id", user["id"]).maybe_single().execute()

    if not profile.data:
        return {"profile": None, "targets": None}

    targets = await sb.table("user_nutrition_targets").select("*").eq("profile_id", profile.data["id"]).maybe_single().execute()

    return {"profile": profile.data, "targets": targets.data}


@router.post("/profile")
async def create_or_update_profile(req: ProfileCreate, user=Depends(get_current_user)):
    sb = get_supabase()

    existing = await sb.table("user_profiles").select("*").eq("user_id", user["id"]).maybe_single().execute()

    profile_data = req.model_dump(exclude_none=True)
    profile_data["user_id"] = user["id"]

    if existing.data:
        result = await sb.table("user_profiles").update(profile_data).eq("id", existing.data["id"]).execute()
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to update profile")
        profile = result.data[0] if isinstance(result.data, list) else result.data
        merged = {**existing.data, **profile}
    else:
        result = await sb.table("user_profiles").insert(profile_data).execute()
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create profile")
        profile = result.data[0] if isinstance(result.data, list) else result.data
        merged = profile

    weight = merged.get("weight_kg")
    height = merged.get("height_cm")
    age = merged.get("age")
    activity = merged.get("activity_level")
    gender = merged.get("gender", "male")

    if weight and height and age and activity:
        bmr = calculate_bmr(weight, height, age, gender)
        tdee = calculate_tdee(bmr, activity)
        targets = calculate_macro_targets(tdee, weight)
        targets["profile_id"] = profile["id"]

        existing_targets = await sb.table("user_nutrition_targets").select("id").eq("profile_id", profile["id"]).maybe_single().execute()

        if existing_targets.data:
            await sb.table("user_nutrition_targets").update(targets).eq("id", existing_targets.data["id"]).execute()
        else:
            await sb.table("user_nutrition_targets").insert(targets).execute()

    return {"profile": profile, "message": "Profile saved"}
