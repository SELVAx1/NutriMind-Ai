ACTIVITY_MULTIPLIERS = {
    "sedentary": 1.2,
    "light": 1.375,
    "moderate": 1.55,
    "active": 1.725,
    "very_active": 1.9,
}


def calculate_bmr(weight_kg: float, height_cm: float, age: int) -> float:
    return 10 * weight_kg + 6.25 * height_cm - 5 * age - 78


def calculate_tdee(bmr: float, activity_level: str) -> int:
    multiplier = ACTIVITY_MULTIPLIERS.get(activity_level, 1.55)
    return round(bmr * multiplier)


def calculate_macro_targets(tdee: int, weight_kg: float) -> dict:
    protein = round(weight_kg * 1.0)
    fat_calories = tdee * 0.25
    fat = round(fat_calories / 9)
    protein_calories = protein * 4
    carbs = round((tdee - protein_calories - fat_calories) / 4)

    return {
        "calories_kcal": tdee,
        "protein_g": protein,
        "carbs_g": carbs,
        "fat_g": fat,
        "fibre_g": 30,
        "iron_mg": 18,
        "calcium_mg": 600,
        "vitamin_b12_mcg": 2.4,
        "vitamin_c_mg": 65,
        "vitamin_d_mcg": 15,
        "potassium_mg": 3500,
    }


def calculate_food_nutrition(nutrition_per_100g: dict, quantity_g: float) -> dict:
    factor = quantity_g / 100
    return {
        "calories": round((nutrition_per_100g.get("calories_per_100g") or 0) * factor),
        "protein": round((nutrition_per_100g.get("protein_per_100g") or 0) * factor, 1),
        "carbs": round((nutrition_per_100g.get("carbs_per_100g") or 0) * factor, 1),
        "fat": round((nutrition_per_100g.get("fat_per_100g") or 0) * factor, 1),
        "fibre": round((nutrition_per_100g.get("fibre_per_100g") or 0) * factor, 1),
        "iron": round((nutrition_per_100g.get("iron_mg") or 0) * factor, 1),
        "calcium": round((nutrition_per_100g.get("calcium_mg") or 0) * factor, 1),
        "vitamin_b12": round((nutrition_per_100g.get("vitamin_b12_mcg") or 0) * factor, 2),
    }
