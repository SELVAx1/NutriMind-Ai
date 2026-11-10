from app.ai.factory import generate_text
from app.agents.knowledge_agent import handle_rag_query
from app.middleware.safety import check_safety
from app.db.supabase_client import get_supabase
from app.services.nutrition_engine import calculate_food_nutrition
import json
import logging

logger = logging.getLogger("nutrimind.orchestrator")

INTENT_SYSTEM = """You are an intent classifier for a nutrition assistant. Classify the user message into exactly one category:
- "rag" — evidence-based nutrition question (why is X important, what foods have Y, guidelines)
- "personal" — question about the user's own data (how much did I eat, am I on track, my intake)
- "general" — casual greeting, thanks, or off-topic chat
- "action" — request to do something (suggest a meal, generate a plan, swap a food)

Respond with ONLY the category name, nothing else."""


async def classify_intent(message: str) -> str:
    try:
        result = await generate_text(message, system=INTENT_SYSTEM, fast=True)
        intent = result.strip().lower().strip('"').strip("'")
        if intent in ("rag", "personal", "general", "action"):
            return intent
    except Exception as e:
        logger.error("Intent classification failed: %s", e)
    return "general"


async def process_message(user_id: str, message: str, conversation_id: str | None = None) -> dict:
    safety = check_safety(message)
    if safety:
        return {
            "response": safety["message"],
            "citations": [],
            "route_type": "safety",
            "blocked": True,
        }

    intent = await classify_intent(message)
    logger.info("Intent: %s for message: '%s'", intent, message[:60])

    if intent == "rag":
        return await handle_rag_query(user_id, message)

    if intent == "personal":
        return await handle_personal_query(user_id, message)

    if intent == "action":
        return await handle_action(user_id, message)

    return await handle_general_chat(message)


async def handle_personal_query(user_id: str, message: str) -> dict:
    sb = get_supabase()

    profile = sb.table("user_profiles").select("*").eq("user_id", user_id).maybe_single().execute()
    targets = None
    if profile.data:
        t = sb.table("user_nutrition_targets").select("*").eq("profile_id", profile.data["id"]).maybe_single().execute()
        targets = t.data

    today = __import__("datetime").date.today().isoformat()
    logs = sb.table("food_logs").select("*, food_log_items(*, food_items(*, nutritional_values(*)))").eq("user_id", user_id).eq("log_date", today).execute()

    meals_today = []
    daily_nutrition = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0, "iron": 0}

    for log in (logs.data or []):
        for item in log.get("food_log_items", []):
            food = item.get("food_items", {})
            nv = food.get("nutritional_values")
            if nv:
                n = calculate_food_nutrition(nv, item["quantity_g"])
                for k in daily_nutrition:
                    daily_nutrition[k] += n.get(k, 0)
                meals_today.append({"name": food.get("name", "Unknown"), "quantity": item["quantity_g"]})

    from app.rag.context_builder import build_personal_context
    context = build_personal_context(
        message,
        {"daily_nutrition": daily_nutrition, "targets": targets, "meals_today": meals_today},
        profile.data,
    )

    response = await generate_text(context)

    return {
        "response": response,
        "citations": [],
        "route_type": "personal",
    }


async def handle_action(user_id: str, message: str) -> dict:
    lower = message.lower()

    if any(w in lower for w in ["ate", "had", "eaten", "instead", "deviated", "skipped", "biryani", "outside"]):
        from app.agents.rescue_agent import rescue_meal
        food_name = message.split("ate")[-1].strip().split("instead")[0].strip().strip('"').strip("'") if "ate" in lower else message
        result = await rescue_meal(user_id, food_name)
        summary = result.get("summary", "Recovery plan generated.")
        revised = result.get("revised_dinner", {})
        response = f"{summary}\n\nSuggested dinner: {revised.get('food_name', 'a balanced meal')} ({revised.get('quantity_g', 200)}g)\n{revised.get('explanation', '')}"
        return {"response": response, "citations": [], "route_type": "action"}

    if any(w in lower for w in ["plan", "suggest", "recommend", "meal plan", "what should i eat"]):
        from app.agents.meal_plan_agent import generate_meal_plan
        result = await generate_meal_plan(user_id, days=1)
        if result.get("meals"):
            meals_text = "\n".join([
                f"- **{m['meal_type'].title()}**: {m['food_name']} ({m['quantity_g']}g) — {m.get('explanation', '')}"
                for m in result["meals"]
            ])
            response = f"Here's your meal plan for today (₹{result.get('total_cost', 0)} total):\n\n{meals_text}"
        else:
            response = "I couldn't generate a plan right now. Try again or check your profile settings."
        return {"response": response, "citations": [], "route_type": "action"}

    if any(w in lower for w in ["swap", "replace", "alternative", "instead of"]):
        response = "To swap a food, go to the Meal Planner page and click the 'Swap' button on any meal. I'll find alternatives that match your diet and budget."
        return {"response": response, "citations": [], "route_type": "action"}

    response = "I can help with meal planning, food swaps, and recovery from plan deviations. Try:\n- 'Generate a meal plan for today'\n- 'I ate biryani instead of dal rice'\n- 'Suggest a high-protein dinner'"
    return {"response": response, "citations": [], "route_type": "action"}


async def handle_general_chat(message: str) -> dict:
    system = "You are NutriMind AI, a friendly nutrition assistant for Indian food. Keep responses brief, warm, and helpful. If the user asks a nutrition question, provide a concise answer."

    response = await generate_text(message, system=system)

    return {
        "response": response,
        "citations": [],
        "route_type": "general",
    }
