import json
from app.ai.factory import analyze_image
from app.services.food_service import search_food
from app.services.nutrition_engine import calculate_food_nutrition
import logging

logger = logging.getLogger("nutrimind.food_recognition")

VISION_PROMPT = """Analyze this food photograph and identify all food items visible.

For each food item, provide:
1. name: common English name (use Indian food names like idli, dosa, sambar, rasam, pongal, chapati, dal, biryani, etc.)
2. name_tamil: Tamil name if it's a South Indian food (optional)
3. estimated_portion_grams: estimated portion size in grams
4. confidence: your confidence level as a decimal (0.0 to 1.0)

Focus on Indian foods. If you see multiple dishes, list each separately.
If the image is blurry or unclear, set confidence below 0.5 and mention this.

Respond ONLY with valid JSON in this format:
{
  "items": [
    {"name": "Idli", "name_tamil": "இட்லி", "estimated_portion_grams": 150, "confidence": 0.85},
    {"name": "Sambar", "name_tamil": "சாம்பார்", "estimated_portion_grams": 100, "confidence": 0.8}
  ],
  "overall_confidence": 0.82,
  "notes": "Clear image of a South Indian breakfast plate"
}"""


async def analyze_food_image(image_bytes: bytes) -> dict:
    try:
        raw_response = await analyze_image(image_bytes, VISION_PROMPT)

        json_str = raw_response
        if "```json" in json_str:
            json_str = json_str.split("```json")[1].split("```")[0]
        elif "```" in json_str:
            json_str = json_str.split("```")[1].split("```")[0]

        result = json.loads(json_str.strip())
        items = result.get("items", [])

        enriched_items = []
        for item in items:
            food_name = item.get("name", "")
            db_matches = search_food(food_name, limit=3)

            matched_food = None
            nutrition = None
            if db_matches:
                matched_food = db_matches[0]
                if matched_food.get("nutritional_values"):
                    portion = item.get("estimated_portion_grams", 100)
                    nutrition = calculate_food_nutrition(matched_food["nutritional_values"], portion)

            enriched_items.append({
                "name": food_name,
                "name_tamil": item.get("name_tamil"),
                "estimated_portion_grams": item.get("estimated_portion_grams", 100),
                "confidence": item.get("confidence", 0.5),
                "matched_food": {
                    "id": matched_food["id"],
                    "name": matched_food["name"],
                    "name_tamil": matched_food.get("name_tamil"),
                } if matched_food else None,
                "nutrition": nutrition,
                "db_alternatives": [{"id": f["id"], "name": f["name"]} for f in db_matches[:3]] if db_matches else [],
            })

        return {
            "items": enriched_items,
            "overall_confidence": result.get("overall_confidence", 0.5),
            "notes": result.get("notes", ""),
        }

    except json.JSONDecodeError:
        logger.error("Failed to parse vision response as JSON")
        return {
            "items": [],
            "overall_confidence": 0,
            "notes": "Could not analyze this image. Please try a clearer photo.",
            "error": "parse_failed",
        }
    except Exception as e:
        logger.error("Food recognition failed: %s", e)
        return {
            "items": [],
            "overall_confidence": 0,
            "notes": f"Analysis failed: {str(e)}",
            "error": "analysis_failed",
        }
