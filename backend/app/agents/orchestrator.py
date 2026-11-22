from datetime import date
from app.ai.factory import generate_text
from app.agents.knowledge_agent import handle_rag_query
from app.middleware.safety import check_safety
from app.db.supabase_client import get_supabase
from app.services.nutrition_engine import calculate_food_nutrition
import re
import logging

logger = logging.getLogger("nutrimind.orchestrator")

INTENT_SYSTEM = """You are an intent classifier for a nutrition assistant. Classify the user message into exactly one category:
- "rag" — evidence-based nutrition question (why is X important, what foods have Y, guidelines)
- "personal" — question about the user's own data (how much did I eat, am I on track, my intake)
- "general" — casual greeting, thanks, or off-topic chat
- "action" — request to do something (suggest a meal, generate a plan, swap a food)

Ignore any language instructions like [Respond in Hindi] — classify based on the actual question content only.
Respond with ONLY the category name, nothing else."""

LANG_PATTERN = re.compile(r'\[IMPORTANT:.*?respond.*?in\s+(\w+)\s+language.*?\]\s*', re.IGNORECASE)


def extract_language_instruction(message: str) -> tuple[str, str | None]:
    match = LANG_PATTERN.search(message)
    if match:
        lang = match.group(1)
        clean_message = LANG_PATTERN.sub('', message).strip()
        return clean_message, lang
    if message.startswith('[Respond in '):
        end = message.find(']')
        if end > 0:
            lang_part = message[12:end].strip()
            lang = lang_part.split('(')[0].strip().split(')')[0].strip()
            clean_message = message[end+1:].strip()
            return clean_message, lang
    return message, None


def build_lang_system_suffix(lang: str | None) -> str:
    if not lang or lang.lower() == 'english':
        return ''
    return f'\n\nIMPORTANT: You MUST respond entirely in {lang}. Every word of your response must be in {lang}.'


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
    clean_message, lang = extract_language_instruction(message)

    safety = check_safety(clean_message)
    if safety:
        return {
            "response": safety["message"],
            "citations": [],
            "route_type": "safety",
            "blocked": True,
        }

    intent = await classify_intent(clean_message)
    logger.info("Intent: %s for message: '%s'", intent, clean_message[:60])

    if intent == "rag":
        result = await handle_rag_query(user_id, clean_message, lang=lang)
        return result

    if intent == "personal":
        return await handle_personal_query(user_id, clean_message, lang=lang)

    if intent == "action":
        return await handle_action(user_id, clean_message, lang=lang)

    return await handle_general_chat(clean_message, lang=lang)


async def handle_personal_query(user_id: str, message: str, lang: str | None = None) -> dict:
    sb = get_supabase()

    profile = await sb.table("user_profiles").select("*").eq("user_id", user_id).maybe_single().execute()
    targets = None
    if profile.data:
        t = await sb.table("user_nutrition_targets").select("*").eq("profile_id", profile.data["id"]).maybe_single().execute()
        targets = t.data

    today = date.today().isoformat()
    logs = await sb.table("food_logs").select("*, food_log_items(*, food_items(*, nutritional_values(*)))").eq("user_id", user_id).eq("log_date", today).execute()

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

    lang_suffix = build_lang_system_suffix(lang)
    response = await generate_text(
        context,
        system=f"You are NutriMind AI, a nutrition assistant for Indian food.{lang_suffix}" if lang_suffix else None
    )

    return {
        "response": response,
        "citations": [],
        "route_type": "personal",
    }


async def handle_action(user_id: str, message: str, lang: str | None = None) -> dict:
    action_prompt = f"""Classify this action request into one category. Respond with ONLY the category:
- "rescue" — user ate something different from plan, deviated, had unplanned food
- "plan" — user wants meal suggestions, a plan, recommendations for what to eat
- "swap" — user wants to replace or swap a specific food
- "other" — anything else

Message: {message}"""

    try:
        action_type = await generate_text(action_prompt, system="Respond with only the category name.", fast=True)
        action_type = action_type.strip().lower().strip('"').strip("'")
    except Exception:
        action_type = "other"

    lang_suffix = build_lang_system_suffix(lang)

    if action_type == "rescue":
        from app.agents.rescue_agent import rescue_meal
        result = await rescue_meal(user_id, message)
        summary = result.get("summary", "Recovery plan generated.")
        revised = result.get("revised_dinner", {})
        response = f"{summary}\n\nSuggested dinner: {revised.get('food_name', 'a balanced meal')} ({revised.get('quantity_g', 200)}g)\n{revised.get('explanation', '')}"
        if lang_suffix:
            response = await generate_text(
                f"Translate the following nutrition advice to {lang}. Keep all numbers and food names intact:\n\n{response}",
                system=f"You are a translator. Respond only with the translation in {lang}.",
            )
        return {"response": response, "citations": [], "route_type": "action"}

    if action_type == "plan":
        from app.agents.meal_plan_agent import generate_meal_plan
        result = await generate_meal_plan(user_id, days=1)
        if result.get("meals"):
            meals_text = "\n".join([
                f"- **{m['meal_type'].title()}**: {m['food_name']} ({m['quantity_g']}g) — {m.get('explanation', '')}"
                for m in result["meals"]
            ])
            response = f"Here's your meal plan for today (₹{result.get('total_cost', 0)} total):\n\n{meals_text}"
            if lang_suffix:
                response = await generate_text(
                    f"Translate the following meal plan to {lang}. Keep all numbers, food names, and formatting intact:\n\n{response}",
                    system=f"You are a translator. Respond only with the translation in {lang}.",
                )
        else:
            response = "I couldn't generate a plan right now. Try again or check your profile settings."
        return {"response": response, "citations": [], "route_type": "action"}

    if action_type == "swap":
        response = "To swap a food, go to the Meal Planner page and click the 'Swap' button on any meal. I'll find alternatives that match your diet and budget."
        return {"response": response, "citations": [], "route_type": "action"}

    response = "I can help with meal planning, food swaps, and recovery from plan deviations. Try asking me to generate a meal plan, or tell me what you ate differently."
    return {"response": response, "citations": [], "route_type": "action"}


async def handle_general_chat(message: str, lang: str | None = None) -> dict:
    lang_suffix = build_lang_system_suffix(lang)
    system = f"You are NutriMind AI, a friendly nutrition assistant for Indian food. Keep responses brief, warm, and helpful. If the user asks a nutrition question, provide a concise answer.{lang_suffix}"

    response = await generate_text(message, system=system)

    return {
        "response": response,
        "citations": [],
        "route_type": "general",
    }
