MEDICAL_EMERGENCY_KEYWORDS = [
    "heart attack", "stroke", "choking", "anaphylaxis",
    "can't breathe", "chest pain", "emergency",
]

DIAGNOSIS_PATTERNS = [
    "do i have", "am i deficient", "diagnose",
    "is this a sign of", "do i suffer from",
]

UNSAFE_DIET_PATTERNS = [
    "500 calorie diet", "zero carb", "water fast",
    "extreme weight loss", "starvation",
]


def check_safety(text: str) -> dict | None:
    lower = text.lower()

    for kw in MEDICAL_EMERGENCY_KEYWORDS:
        if kw in lower:
            return {
                "blocked": True,
                "reason": "medical_emergency",
                "message": "This sounds like a medical emergency. Please contact emergency services or a healthcare provider immediately.",
            }

    for pattern in DIAGNOSIS_PATTERNS:
        if pattern in lower:
            return {
                "blocked": True,
                "reason": "diagnosis_attempt",
                "message": "I can track dietary intake, but I cannot diagnose medical conditions. Please consult a healthcare professional.",
            }

    for pattern in UNSAFE_DIET_PATTERNS:
        if pattern in lower:
            return {
                "blocked": True,
                "reason": "unsafe_diet",
                "message": "This diet pattern could be harmful. I can suggest balanced alternatives that meet your goals safely.",
            }

    return None
