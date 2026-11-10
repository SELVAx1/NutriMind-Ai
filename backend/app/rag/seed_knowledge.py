"""
Run once to seed the RAG knowledge base with nutrition facts.
Usage: cd backend && python -m app.rag.seed_knowledge
"""
import asyncio
from app.rag.ingest import ingest_document

NUTRITION_KNOWLEDGE = [
    {
        "title": "Iron Requirements and Sources (ICMR-NIN)",
        "source": "ICMR-NIN Dietary Guidelines 2020",
        "content": """Iron is an essential mineral required for oxygen transport in the blood. The ICMR Recommended Dietary Allowance for iron is 17-21 mg per day for adult women and 17 mg per day for adult men. Iron deficiency is the most common nutritional deficiency in India, particularly among women and children.

Vegetarian sources of iron (non-heme iron): Ragi (finger millet) contains 3.9 mg per 100g and is one of the richest plant-based sources. Sundal made from chickpeas provides 2.1 mg per 100g. Rajma (kidney beans) provides 2.5 mg per 100g. Green leafy vegetables like palak (spinach) contain 2.5 mg per 100g. Groundnuts contain 4.6 mg per 100g. Sprouted moong provides 1.8 mg per 100g.

Non-vegetarian sources of iron (heme iron): Eggs provide 1.2 mg per 100g. Liver and organ meats are the richest sources but are not commonly consumed.

To improve iron absorption, consume iron-rich foods with vitamin C sources like lemon, amla, or tomato. Avoid tea or coffee immediately after meals as tannins inhibit iron absorption. Cooking in iron vessels can also increase iron content of food.""",
    },
    {
        "title": "Protein Requirements (ICMR-NIN)",
        "source": "ICMR-NIN Dietary Guidelines 2020",
        "content": """Protein is essential for growth, repair, and maintenance of body tissues. The ICMR recommends 0.8-1.0 g of protein per kg body weight per day for adults. For a 60 kg person, this is 48-60 g per day.

Affordable vegetarian protein sources in India: Dal (toor/moong/masoor) provides 7-8 g per 100g when cooked. Sundal (chickpea) provides 8.9 g per 100g. Soy chunks are the most protein-dense vegetarian food at 52 g per 100g and are very affordable. Paneer provides 18 g per 100g but is more expensive. Curd provides 3.5 g per 100g. Groundnuts provide 25.8 g per 100g.

Non-vegetarian protein sources: Eggs are one of the most affordable protein sources at 13 g per 100g. Chicken provides approximately 25 g per 100g.

Protein quality: Combining cereals (rice, wheat) with pulses (dal, sundal) provides complete protein with all essential amino acids. This is the traditional Indian food combination — rice and dal, idli and sambar, roti and rajma.""",
    },
    {
        "title": "Dietary Fibre Recommendations",
        "source": "ICMR-NIN Dietary Guidelines 2020",
        "content": """Dietary fibre is important for digestive health, blood sugar regulation, and cholesterol management. The ICMR recommends 30 g of fibre per day for adults. Most Indians consume only 15-20 g per day, which is below the recommended level.

High-fibre Indian foods: Ragi porridge provides 3.6 g per 100g. Sundal (chickpea) is an excellent source with 7.6 g per 100g. Rajma provides 5 g per 100g. Whole wheat chapati provides 3 g per 100g compared to refined flour which has less than 1 g. Green vegetables like beans (poriyal) provide 3 g per 100g. Soy chunks provide 13 g per 100g.

To increase fibre intake: Replace white rice with brown rice or millet at least once a day. Include one portion of sundal or sprouted moong daily. Choose whole wheat chapati over refined flour. Include more vegetables as side dishes (poriyal, kootu). Start the day with ragi porridge instead of refined cereal.""",
    },
    {
        "title": "Vitamin B12 for Vegetarians",
        "source": "ICMR-NIN Dietary Guidelines 2020",
        "content": """Vitamin B12 is essential for nerve function and red blood cell formation. The ICMR RDA for B12 is 2.4 mcg per day. B12 deficiency is very common among vegetarians in India because the vitamin is primarily found in animal-derived foods.

Vegetarian sources of B12: Milk provides 0.5 mcg per 100g. Curd provides 0.5 mcg per 100g. Paneer provides 0.2 mcg per 100g. Buttermilk provides 0.2 mcg per 100g. These dairy sources alone may not meet the daily requirement.

For strict vegetarians and vegans: Fortified foods are the most reliable source. Some plant milks and breakfast cereals are fortified with B12. A B12 supplement may be necessary — consult a healthcare provider.

Important: Do not self-diagnose B12 deficiency. If you experience symptoms like fatigue, weakness, or numbness, consult a doctor for proper testing and treatment.""",
    },
    {
        "title": "Calcium and Bone Health",
        "source": "ICMR-NIN Dietary Guidelines 2020",
        "content": """Calcium is essential for strong bones and teeth, muscle function, and nerve signaling. The ICMR recommends 600 mg of calcium per day for adults (800 mg during pregnancy and lactation).

Calcium-rich Indian foods: Ragi (finger millet) is one of the richest plant sources at 344 mg per 100g — a bowl of ragi porridge provides significant calcium. Milk provides 120 mg per 100g. Curd provides 120 mg per 100g. Palak paneer combines two calcium-rich foods (spinach at 200 mg/100g and paneer at 180 mg/100g). Sesame seeds (til) provide 975 mg per 100g. Buttermilk provides 116 mg per 100g.

Affordable calcium strategy: Include ragi in at least one meal (porridge, dosa, or roti). Have a glass of buttermilk daily. Include curd with lunch. These three affordable foods can meet most of the daily calcium requirement.""",
    },
    {
        "title": "Budget-Friendly Nutrition in India",
        "source": "NutriMind AI — Indian Food Economics",
        "content": """Eating nutritiously on a tight budget is possible with smart food choices. The key is choosing foods that provide maximum nutrition per rupee.

Most cost-effective protein sources (per gram of protein): Soy chunks are the cheapest protein source at approximately ₹1 per 10g protein. Moong dal provides good protein at ₹2-3 per 10g protein. Groundnuts provide protein plus healthy fats at reasonable cost. Eggs are the cheapest animal protein.

Budget meal examples (under ₹100 per day): Breakfast: Idli with sambar (₹20-25) provides carbs, protein, and iron. Lunch: Rice with dal and a seasonal vegetable (₹30-35) provides complete protein. Snack: Sundal or sprouted moong (₹10-15) adds protein and fibre. Dinner: Chapati with dal and curd (₹25-30) balances the day.

Money-saving tips: Buy seasonal vegetables — they are cheaper and fresher. Buy pulses and grains in bulk. Sprout moong at home instead of buying ready-made snacks. Use buttermilk instead of expensive protein drinks.""",
    },
    {
        "title": "South Indian Food Nutrition Overview",
        "source": "Indian Food Composition Tables (IFCT 2017)",
        "content": """South Indian cuisine is naturally well-balanced when prepared traditionally. Key nutritional characteristics:

Idli and dosa: The fermentation process increases bioavailability of iron and B vitamins. Idli provides 130 kcal and 3.9 g protein per 100g. The rice-urad dal combination provides complementary amino acids.

Sambar: A nutritious accompaniment made with toor dal and vegetables. Provides 65 kcal, 2.8 g protein, and 1.2 mg iron per 100g. The combination of dal with tamarind and vegetables creates a nutrient-dense preparation.

Pongal: Ven pongal provides 150 kcal per 100g with a good balance of carbs and protein from rice and moong dal.

Rasam: A light, hydrating soup rich in vitamin C from tomatoes and tamarind. Only 28 kcal per 100g, making it ideal for those watching calories.

Regional variations: The same dish may have different nutritional values depending on oil quantity, ingredients, and preparation method. A restaurant dosa may have significantly more oil than a home-prepared one.""",
    },
    {
        "title": "Daily Calorie Requirements (ICMR)",
        "source": "ICMR-NIN Dietary Guidelines 2020",
        "content": """The daily calorie requirement depends on age, gender, weight, and activity level. ICMR provides the following general guidelines:

Sedentary adult male (60 kg): approximately 2000-2200 kcal per day.
Moderately active adult male: approximately 2400-2800 kcal per day.
Sedentary adult female (55 kg): approximately 1700-1900 kcal per day.
Moderately active adult female: approximately 2100-2400 kcal per day.

For more precise calculation, the Mifflin-St Jeor equation can be used: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161 (female) or + 5 (male). Multiply BMR by activity factor to get Total Daily Energy Expenditure (TDEE).

Important: These are estimates for recorded dietary intake tracking. Individual requirements vary based on metabolism, health conditions, and specific goals. Calorie counting should be used as a guide, not an absolute target. Consult a healthcare professional for personalized recommendations.""",
    },
]


async def seed_knowledge_base():
    print("Seeding RAG knowledge base...")
    for doc in NUTRITION_KNOWLEDGE:
        try:
            doc_id = await ingest_document(
                title=doc["title"],
                source=doc["source"],
                content=doc["content"],
                doc_type="guideline",
            )
            print(f"  OK: {doc['title']} (id: {doc_id})")
        except Exception as e:
            print(f"  FAIL: {doc['title']}: {e}")
    print("Done!")


if __name__ == "__main__":
    asyncio.run(seed_knowledge_base())
