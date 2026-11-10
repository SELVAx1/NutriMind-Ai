from app.ai.factory import generate_text
from app.db.supabase_client import get_supabase
import json
import logging

logger = logging.getLogger("nutrimind.feedback")

CLASSIFY_PROMPT = """Classify this meal feedback into exactly one category:
- "taste" — doesn't like the food
- "time" — takes too long to cook
- "budget" — too expensive
- "health" — health concern
- "general" — other feedback

Respond with ONLY the category name."""


async def process_feedback(user_id: str, feedback_text: str, target_type: str = "meal", target_id: str | None = None) -> dict:
    sb = get_supabase()

    try:
        category = await generate_text(feedback_text, system=CLASSIFY_PROMPT, fast=True)
        category = category.strip().lower().strip('"').strip("'")
        if category not in ("taste", "time", "budget", "health", "general"):
            category = "general"
    except Exception:
        category = "general"

    sb.table("user_feedback").insert({
        "user_id": user_id,
        "target_type": target_type,
        "target_id": target_id,
        "feedback_text": feedback_text,
        "feedback_category": category,
    }).execute()

    profile = sb.table("user_profiles").select("*").eq("user_id", user_id).execute()
    profile_data = profile.data[0] if profile.data else None

    preference_update = None
    if profile_data:
        profile_id = profile_data["id"]

        if category == "time":
            current_time = profile_data.get("max_cooking_min", 30)
            new_time = max(10, current_time - 5)
            sb.table("user_profiles").update({"max_cooking_min": new_time}).eq("id", profile_id).execute()
            preference_update = f"Reduced max cooking time to {new_time} minutes"

        elif category == "budget":
            sb.table("dietary_preferences").insert({
                "profile_id": profile_id,
                "preference_key": "budget_priority",
                "preference_value": "high",
            }).execute()
            preference_update = "Prioritizing budget-friendly options"

        elif category == "taste":
            sb.table("dietary_preferences").insert({
                "profile_id": profile_id,
                "preference_key": "disliked_food",
                "preference_value": feedback_text[:100],
            }).execute()
            preference_update = "Noted food preference"

    return {
        "category": category,
        "feedback_text": feedback_text,
        "preference_update": preference_update,
        "message": f"Thanks for the feedback! Classified as '{category}'. {preference_update or 'Noted for future recommendations.'}",
    }
