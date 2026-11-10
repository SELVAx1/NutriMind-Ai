def build_rag_context(
    query: str,
    chunks: list[dict],
    user_profile: dict | None = None,
    conversation_history: list[dict] | None = None,
) -> str:
    parts = []

    parts.append("You are NutriMind AI, an evidence-based nutrition assistant focused on Indian food.")
    parts.append("Answer using ONLY the provided evidence. Cite your sources inline.")
    parts.append("If the evidence doesn't cover the question, say so clearly — do not make up information.")
    parts.append("Use simple language. Be specific about foods, quantities, and nutrients.")
    parts.append("")

    if user_profile:
        profile_info = []
        if user_profile.get("diet_type"):
            profile_info.append(f"Diet: {user_profile['diet_type']}")
        if user_profile.get("region"):
            profile_info.append(f"Region: {user_profile['region']}")
        if user_profile.get("budget_daily"):
            profile_info.append(f"Budget: ₹{user_profile['budget_daily']}/day")
        if profile_info:
            parts.append(f"User context: {', '.join(profile_info)}")
            parts.append("")

    if chunks:
        parts.append("=== EVIDENCE FROM KNOWLEDGE BASE ===")
        for i, chunk in enumerate(chunks, 1):
            source = chunk.get("metadata", {}).get("source", "Unknown")
            title = chunk.get("metadata", {}).get("title", "")
            parts.append(f"[Source {i}: {source} — {title}]")
            parts.append(chunk.get("content", ""))
            parts.append("")
        parts.append("=== END EVIDENCE ===")
        parts.append("")

    if conversation_history:
        parts.append("Recent conversation:")
        for msg in conversation_history[-4:]:
            role = msg.get("role", "user")
            parts.append(f"{role}: {msg.get('content', '')[:200]}")
        parts.append("")

    parts.append(f"User question: {query}")

    return "\n".join(parts)


def build_personal_context(query: str, user_data: dict, user_profile: dict | None = None) -> str:
    parts = []
    parts.append("You are NutriMind AI. Answer based on the user's actual nutrition data below.")
    parts.append("Be specific with numbers. Use the data provided — do not make up values.")
    parts.append("")

    if user_profile:
        parts.append(f"User: {user_profile.get('full_name', 'User')}")
        parts.append(f"Diet: {user_profile.get('diet_type', 'not specified')}")
        parts.append("")

    if user_data.get("daily_nutrition"):
        n = user_data["daily_nutrition"]
        parts.append("Today's intake:")
        parts.append(f"  Calories: {n.get('calories', 0)} kcal")
        parts.append(f"  Protein: {n.get('protein', 0)} g")
        parts.append(f"  Carbs: {n.get('carbs', 0)} g")
        parts.append(f"  Fat: {n.get('fat', 0)} g")
        parts.append(f"  Iron: {n.get('iron', 0)} mg")
        parts.append("")

    if user_data.get("targets"):
        t = user_data["targets"]
        parts.append("Daily targets:")
        parts.append(f"  Calories: {t.get('calories_kcal', 0)} kcal")
        parts.append(f"  Protein: {t.get('protein_g', 0)} g")
        parts.append("")

    if user_data.get("meals_today"):
        parts.append("Meals logged today:")
        for meal in user_data["meals_today"]:
            parts.append(f"  - {meal.get('name', 'Unknown')} ({meal.get('quantity', 0)}g)")
        parts.append("")

    parts.append(f"User question: {query}")
    return "\n".join(parts)
