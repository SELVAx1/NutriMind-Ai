from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.middleware.supabase_auth import get_current_user
from app.db.supabase_client import get_supabase
from app.services.nutrition_engine import calculate_bmr, calculate_tdee, calculate_macro_targets

router = APIRouter(prefix="/api/users", tags=["users"])


class ProfileCreate(BaseModel):
    full_name: str | None = None
    age: int | None = None
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
    profile = sb.table("user_profiles").select("*").eq("user_id", user["id"]).maybe_single().execute()

    if not profile.data:
        return {"profile": None, "targets": None}

    targets = sb.table("user_nutrition_targets").select("*").eq("profile_id", profile.data["id"]).maybe_single().execute()

    return {"profile": profile.data, "targets": targets.data}


@router.post("/profile")
async def create_or_update_profile(req: ProfileCreate, user=Depends(get_current_user)):
    sb = get_supabase()

    existing = sb.table("user_profiles").select("id").eq("user_id", user["id"]).maybe_single().execute()

    profile_data = req.model_dump(exclude_none=True)
    profile_data["user_id"] = user["id"]

    if existing.data:
        result = sb.table("user_profiles").update(profile_data).eq("id", existing.data["id"]).execute()
        profile = result.data[0]
    else:
        result = sb.table("user_profiles").insert(profile_data).execute()
        profile = result.data[0]

    if req.weight_kg and req.height_cm and req.age and req.activity_level:
        bmr = calculate_bmr(req.weight_kg, req.height_cm, req.age)
        tdee = calculate_tdee(bmr, req.activity_level)
        targets = calculate_macro_targets(tdee, req.weight_kg)
        targets["profile_id"] = profile["id"]

        existing_targets = sb.table("user_nutrition_targets").select("id").eq("profile_id", profile["id"]).maybe_single().execute()

        if existing_targets.data:
            sb.table("user_nutrition_targets").update(targets).eq("id", existing_targets.data["id"]).execute()
        else:
            sb.table("user_nutrition_targets").insert(targets).execute()

    return {"profile": profile, "message": "Profile saved"}
