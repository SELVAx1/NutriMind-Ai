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

Sedentary adult male (60 kg): approximately 2000-2200 kcal per day. Moderately active adult male: approximately 2400-2800 kcal per day. Sedentary adult female (55 kg): approximately 1700-1900 kcal per day. Moderately active adult female: approximately 2100-2400 kcal per day.

For more precise calculation, the Mifflin-St Jeor equation can be used: BMR = 10 x weight(kg) + 6.25 x height(cm) - 5 x age - 161 (female) or + 5 (male). Multiply BMR by activity factor to get Total Daily Energy Expenditure (TDEE).

Important: These are estimates for recorded dietary intake tracking. Individual requirements vary based on metabolism, health conditions, and specific goals.""",
    },
    # ── NEW ARTICLES (9-25) ──
    {
        "title": "Diabetes Management Through Indian Diet",
        "source": "ICMR Guidelines for Management of Type 2 Diabetes 2018",
        "content": """Type 2 diabetes is a growing epidemic in India, affecting over 77 million adults. Diet is the most important modifiable factor in diabetes management.

Glycemic Index principles for Indian foods: Low GI foods (GI < 55) are preferred: whole dals (moong, toor, masoor), most vegetables, curd, buttermilk, nuts, and millets (ragi, bajra, jowar). Medium GI foods (55-70): whole wheat chapati, brown rice, idli, dosa. High GI foods (> 70) to limit: white rice, white bread, potatoes, watermelon, jaggery, sugar.

Meal planning for diabetes: Divide meals into 4-5 small portions instead of 3 large ones. Always pair carbohydrates with protein or fat to slow glucose release. Example: rice with dal and a vegetable, not rice alone. Replace white rice with millets at least once daily. Include bitter gourd (karela) which has been shown to have hypoglycemic properties.

Foods to limit: Refined sugar and sweets (gulab jamun, jalebi, halwa). Fruit juices (eat whole fruits instead). White rice in large portions. Maida-based foods (naan, bhatura, samosa).

Important: NutriMind provides dietary guidance only. Diabetes management requires medical supervision. Never adjust medication based on dietary changes without consulting your doctor.""",
    },
    {
        "title": "PCOS and Nutrition Guidelines",
        "source": "ICMR-NIN & Endocrine Society Guidelines",
        "content": """Polycystic Ovary Syndrome (PCOS) affects 1 in 5 Indian women. Diet modifications can significantly improve symptoms including insulin resistance, weight management, and hormonal balance.

Key nutritional principles for PCOS: Focus on low glycemic index foods to manage insulin resistance. Increase protein intake to 1.2-1.5 g/kg body weight to improve satiety. Include anti-inflammatory foods: turmeric (haldi), ginger (adrak), green leafy vegetables. Increase omega-3 fatty acids from flaxseeds, walnuts, and fish.

Beneficial Indian foods for PCOS: Methi (fenugreek) seeds — soak overnight, consume in morning — shown to improve insulin sensitivity. Cinnamon (dalchini) may help regulate menstrual cycles. Spearmint tea may help reduce androgens. Ragi and bajra instead of rice reduce glycemic load. Sprouts and sundal provide plant-based protein with low GI.

Foods to avoid with PCOS: Processed and packaged foods high in trans fats. Sugary beverages and desserts. Excessive dairy (may worsen hormonal imbalance in some women). Refined carbohydrates.

Important: PCOS management should be under medical supervision. Dietary changes alone may not be sufficient.""",
    },
    {
        "title": "Pregnancy Nutrition — Trimester Guide",
        "source": "ICMR-NIN Dietary Guidelines 2020",
        "content": """Pregnancy increases nutritional requirements significantly. Proper nutrition is critical for fetal development and maternal health.

First trimester (weeks 1-12): Calorie needs increase by about 85 kcal/day. Focus on folic acid (400-800 mcg/day) from green leafy vegetables, fortified foods, or supplements as prescribed. Iron requirements increase — include ragi, greens, and sprouted moong. Morning sickness tip: eat small, frequent meals. Ginger tea and dry crackers may help.

Second trimester (weeks 13-26): Calorie needs increase by 300 kcal/day. Protein needs increase to 78 g/day. Calcium needs increase to 1200 mg/day — include ragi porridge, milk, curd, and sesame. Include DHA-rich foods (walnuts, flaxseeds) for fetal brain development.

Third trimester (weeks 27-40): Calorie needs increase by 500 kcal/day. Iron needs are highest — 35 mg/day. Continue high protein and calcium intake. Include fibre-rich foods to prevent constipation.

Specific Indian foods for pregnancy: Ragi (calcium + iron), dates (iron + fibre), almonds (protein + healthy fats), curd rice (easy to digest), buttermilk (calcium + probiotics). Avoid: raw papaya, excessive caffeine, unpasteurized dairy, raw sprouts.""",
    },
    {
        "title": "Child Nutrition — 6 months to 12 years",
        "source": "ICMR-NIN Dietary Guidelines for Children",
        "content": """Child nutrition in India is critical as malnutrition affects over 35% of children under 5. Proper complementary feeding from 6 months is essential.

6-8 months: Start with single-grain porridge — ragi kanji, rice kanji. Introduce mashed dal, mashed banana, boiled and mashed potato. Feed 2-3 times a day, 2-3 tablespoons each time.

9-12 months: Introduce idli (soft, easy to chew), curd rice, khichdi with vegetables. Mashed chapati with dal. Introduce egg yolk. Feed 3-4 times a day.

1-3 years: Regular family foods in smaller portions. Needs 1000-1200 kcal/day. Include milk/curd daily (300-500 ml). Avoid honey for children under 1 year.

4-6 years: 1200-1500 kcal/day. Protein needs: 15-20 g/day. Include diverse foods from all food groups daily.

7-12 years: 1500-2000 kcal/day. Growth spurt period — increase protein to 25-40 g/day. Iron is critical especially for girls approaching puberty.

Common deficiencies in Indian children: Iron deficiency anaemia — include jaggery, green leafy vegetables, and ragi. Vitamin A deficiency — include orange/yellow vegetables (carrot, pumpkin, mango). Zinc deficiency — include whole grains, nuts, and seeds.""",
    },
    {
        "title": "Sports Nutrition for Indian Athletes",
        "source": "Sports Authority of India Nutrition Guidelines",
        "content": """Athletes and regular exercisers have increased nutritional needs. Indian vegetarian athletes can meet all requirements with proper planning.

Protein needs for athletes: Endurance athletes: 1.2-1.4 g/kg/day. Strength/power athletes: 1.6-2.0 g/kg/day. For a 70 kg strength athlete: 112-140 g protein per day. Vegetarian strategy: combine soy chunks (52g protein/100g), paneer (18g/100g), dal (7g/100g), eggs (13g/100g), and milk (3.2g/100g) across meals.

Pre-workout nutrition (1-2 hours before): Light, easily digestible carbs — banana, idli, bread with jam, oats. Avoid heavy, high-fat meals that slow digestion.

Post-workout nutrition (within 30-60 minutes): Protein + carbs in 1:3 ratio. Examples: banana milkshake with protein powder, curd rice, paneer sandwich, egg with bread. Budget option: sattu drink (roasted chana flour with water and jaggery) provides 6g protein per glass.

Hydration for Indian climate: Drink 500 ml water 2 hours before exercise. During exercise: 150-250 ml every 15-20 minutes. Post exercise: buttermilk or nimbu pani with salt for electrolyte replacement. Tender coconut water is an excellent natural isotonic drink.""",
    },
    {
        "title": "North Indian Food Nutrition Overview",
        "source": "Indian Food Composition Tables (IFCT 2017)",
        "content": """North Indian cuisine is characterized by wheat-based staples, dairy products, and rich gravies. Understanding nutritional profiles helps make healthier choices.

Wheat-based staples: Chapati/roti (240-260 kcal per 100g) provides more protein (7.5-8g) and fibre (3-3.5g) than rice. Paratha (250-290 kcal) has more fat due to ghee/oil used in preparation. Naan (290 kcal) contains refined flour (maida) — less nutritious than whole wheat roti.

Dairy strengths: North Indian diet naturally includes more dairy: paneer (265 kcal, 18g protein, 208mg calcium per 100g), lassi, curd, buttermilk. This provides better calcium and B12 intake compared to other regional diets.

Common nutritional pitfalls: Heavy use of ghee and oil in gravies increases calorie density significantly. A restaurant-style dal makhani can have 2-3x more fat than home-cooked version. Tandoori preparations are healthier than deep-fried (pakora, samosa, kachori).

Healthy North Indian meal example: Roti (2) + dal (1 bowl) + mixed vegetable curry + curd + salad = approximately 600-700 kcal with good macro balance. Compared to: Paratha (2) + butter chicken + naan + gulab jamun = 1200+ kcal with excess fat.""",
    },
    {
        "title": "Vitamin D Deficiency in India",
        "source": "ICMR-NIN & Indian Journal of Endocrinology",
        "content": """Despite abundant sunlight, Vitamin D deficiency affects 70-90% of the Indian population. This is due to limited sun exposure (indoor lifestyles, pollution, dark skin), low dietary intake, and traditional clothing that covers most skin.

ICMR RDA for Vitamin D: 400-600 IU per day for adults. 600-800 IU for elderly and pregnant women.

Food sources of Vitamin D: Very few Indian foods naturally contain Vitamin D. Egg yolk provides approximately 2 mcg (80 IU) per egg. Fatty fish provides 5-15 mcg per 100g. Fortified milk may provide 1-2 mcg per glass. Mushrooms exposed to sunlight can provide some Vitamin D.

Sun exposure recommendations: 15-20 minutes of direct sunlight on arms and face, between 11 AM and 2 PM, at least 3-4 times per week. Dark-skinned individuals need longer exposure. Sunscreen blocks Vitamin D synthesis.

Role of Vitamin D: Calcium absorption (even with adequate calcium intake, Vitamin D deficiency prevents proper absorption). Bone health, immune function, and mood regulation. Low Vitamin D is linked to increased risk of diabetes, heart disease, and autoimmune conditions.

Important: Get your Vitamin D levels tested (25-hydroxy Vitamin D blood test). If deficient, supplementation under medical guidance is usually necessary as diet alone rarely provides adequate amounts.""",
    },
    {
        "title": "Antinutrients in Indian Foods — Phytates, Tannins, and Oxalates",
        "source": "IFCT 2017 & Journal of Food Science and Technology",
        "content": """Indian traditional cooking methods have evolved to reduce antinutrients — compounds that interfere with mineral absorption. Understanding these helps maximize nutrition from plant-based diets.

Phytates (found in whole grains, legumes, nuts): Phytic acid binds iron, zinc, and calcium, reducing their absorption by 50-80%. Traditional Indian solution: soaking (dal, rice overnight), sprouting (moong, chana), and fermentation (idli/dosa batter, curd). Fermented foods like idli have 50-75% lower phytate content than unfermented rice.

Tannins (found in tea, coffee, some legumes): Tannins can reduce iron absorption by 60-70%. The Indian habit of drinking tea immediately after meals significantly reduces iron absorption. Solution: Wait 1-2 hours after meals before drinking tea or coffee. Adding lemon to tea reduces tannin-iron binding.

Oxalates (found in spinach, beetroot, sweet potato, amaranth): Oxalic acid binds calcium, making it unavailable. Spinach has high calcium (200mg/100g) but only 5% is absorbable due to oxalates. Solution: Blanching or boiling reduces oxalates by 30-87%. Pair high-oxalate foods with calcium-rich foods to compensate.

Practical tips: Soak dal for 6-8 hours before cooking. Sprout moong and chana for 24-48 hours. Let idli/dosa batter ferment fully (12-16 hours). Cook greens rather than eating raw. Add lemon/amla to iron-rich meals.""",
    },
    {
        "title": "Hypertension and Sodium Management in Indian Diet",
        "source": "ICMR-NIN & WHO Guidelines",
        "content": """Hypertension affects over 30% of Indian adults. The Indian diet can be very high in sodium due to pickles, papad, processed foods, and excess salt in cooking.

WHO recommendation: Less than 5 g salt (2000 mg sodium) per day. Average Indian intake: 8-11 g salt per day — nearly double the recommendation.

High sodium Indian foods to limit: Pickles (achaar) — 5000+ mg sodium per 100g. Papad — 1500+ mg sodium per 100g. Packaged snacks (chips, mixture, murukku). Ready-made masalas and curry pastes. Maggi noodles — 1100 mg sodium per serving.

DASH diet Indian adaptation: Increase potassium-rich foods: banana (358 mg/100g), tender coconut water (250 mg/200ml), rajma (350 mg/100g), potato (421 mg/100g). Include more fresh vegetables and fruits. Use herbs and spices (jeera, haldi, adrak, curry leaves) for flavor instead of salt.

Practical steps: Reduce salt gradually — taste buds adapt in 2-3 weeks. Use lemon juice as a salt substitute. Avoid adding salt at the table. Choose fresh foods over packaged. Limit restaurant meals (typically use 2-3x more salt than home cooking).""",
    },
    {
        "title": "Gut Health and Probiotics in Indian Diet",
        "source": "Indian Journal of Medical Research & WHO",
        "content": """India has a rich tradition of fermented foods that naturally support gut health. A healthy gut microbiome is linked to better immunity, mental health, and nutrient absorption.

Natural Indian probiotics: Curd (dahi) — contains Lactobacillus and Bifidobacterium strains. Buttermilk (chaas/mor) — easier to digest than milk, excellent probiotic. Idli and dosa batter — fermentation produces beneficial bacteria. Kanji (fermented carrot/beetroot drink) — traditional North Indian probiotic. Pickles (naturally fermented, not vinegar-based) — contain live cultures.

Prebiotic foods (feed good bacteria): Onion, garlic, banana, whole grains, legumes (dal, chana). Resistant starch in cooled rice (curd rice is excellent — the cooling process creates resistant starch that feeds gut bacteria).

Gut health tips: Have curd or buttermilk with at least one meal daily. Include fermented foods in your diet regularly. Eat diverse plant foods — variety feeds different bacterial strains. Limit processed foods and artificial sweeteners which harm gut bacteria.

Connection to nutrition absorption: A healthy gut absorbs iron, calcium, and B12 more efficiently. This is especially important for vegetarians who rely on plant-based iron sources with lower bioavailability.""",
    },
    {
        "title": "Weight Management — Indian Approach",
        "source": "ICMR-NIN Dietary Guidelines 2020",
        "content": """India faces a dual burden of undernutrition and overweight/obesity. Approximately 40% of urban Indian adults are overweight. Sustainable weight management requires dietary changes, not crash diets.

Calorie deficit for weight loss: A moderate deficit of 500 kcal/day from TDEE leads to approximately 0.5 kg weight loss per week. For a sedentary woman with TDEE of 1800 kcal, target 1300 kcal/day. Never go below 1200 kcal/day without medical supervision.

Protein-first strategy: Increase protein to 1.2-1.5 g/kg body weight during weight loss to preserve muscle. High-satiety Indian foods: dal, paneer, eggs, soy chunks, curd. Protein leverage hypothesis: the body drives eating until protein needs are met — so low-protein meals lead to overeating.

Practical Indian weight loss meals: Breakfast: 2 idli + sambar (300 kcal, 10g protein) instead of poori bhaji (500+ kcal). Lunch: Ragi mudde + sambar + greens (400 kcal) instead of rice + curry (600+ kcal). Dinner: Moong dal khichdi + curd (350 kcal) instead of paratha + sabzi (500+ kcal).

Common mistakes: Skipping meals (slows metabolism and leads to overeating). Zero-oil cooking (some fat is needed for vitamin absorption). Excessive fruit juice (high sugar, no fibre). Relying on "diet" packaged foods.""",
    },
    {
        "title": "Anaemia in Indian Women — Causes and Dietary Solutions",
        "source": "ICMR-NIN & National Family Health Survey (NFHS-5)",
        "content": """Anaemia affects 57% of Indian women aged 15-49 (NFHS-5). Iron deficiency anaemia is the most common type, caused by inadequate dietary iron, poor absorption, and menstrual blood loss.

ICMR iron RDA for women: 21 mg per day (menstruating women). 35 mg per day (pregnant women). 21 mg per day (lactating women).

Iron-rich meal plan for anaemia prevention: Morning: Ragi porridge with jaggery (ragi: 3.9mg iron/100g, jaggery: 11mg iron/100g). Lunch: Rice + palak dal + amla chutney (spinach: 2.5mg iron, amla boosts absorption). Evening: Sundal with lemon juice (chickpea: 2.1mg iron, vitamin C enhances absorption). Dinner: Bajra roti + greens curry (bajra: 6mg iron/100g).

Iron absorption enhancers: Vitamin C (amla, lemon, tomato, guava) — can increase iron absorption by 2-6x. Fermented foods (idli, dosa) — fermentation reduces phytates. Sprouting increases iron bioavailability by 30-50%.

Iron absorption inhibitors to avoid with meals: Tea and coffee (tannins block iron). Calcium supplements (take separately from iron-rich meals). Excess fibre (phytates in bran).

Important: Dietary changes alone may take 3-6 months to improve haemoglobin levels. If Hb is below 7 g/dL, medical treatment is necessary alongside dietary changes.""",
    },
    {
        "title": "Healthy Fats and Cooking Oils in Indian Kitchen",
        "source": "ICMR-NIN & FSSAI Guidelines",
        "content": """The choice of cooking oil significantly impacts health. ICMR recommends limiting visible fat/oil intake to 20-30 g per day (approximately 4-6 teaspoons). Most Indians consume 30-50 g per day.

Indian cooking oils compared: Groundnut oil — balanced fatty acid profile, good for frying, widely used in South and West India. Mustard oil — rich in omega-3 (ALA), traditional in North and East India, has anti-inflammatory properties. Coconut oil — high in saturated fat (82%) but contains MCTs, traditional in Kerala. Sesame oil (gingelly/til oil) — rich in antioxidants, excellent for South Indian cooking. Rice bran oil — high smoke point, good for deep frying. Olive oil — excellent for cold use (salads, drizzling), but expensive for Indian cooking.

FSSAI recommendation: Rotate between 2-3 different oils for balanced fatty acid intake. No single oil provides the ideal ratio of SFA:MUFA:PUFA.

Ghee: 1-2 teaspoons of ghee per day is acceptable for most adults. Ghee is rich in fat-soluble vitamins (A, D, E, K) and butyric acid (good for gut health). Avoid excessive ghee in dal, rice, and roti.

Reducing oil in cooking: Use non-stick cookware. Steam or pressure-cook before tempering (tadka). Use curd-based gravies instead of oil-based. Air fry instead of deep frying for snacks. One serving of fried food (pakora, vada) per week maximum.""",
    },
    {
        "title": "Seasonal Eating in India — Ayurvedic and Nutritional Perspective",
        "source": "IFCT 2017 & Traditional Indian Dietary Wisdom",
        "content": """Traditional Indian eating follows seasonal patterns that align with nutritional science. Eating seasonally ensures fresher produce, better nutrition, and lower cost.

Summer foods (March-June): Cooling foods — buttermilk, tender coconut water, cucumber, watermelon, raw mango (aam panna). High hydration priority — minimum 3-4 liters of fluid per day. Light meals — curd rice, salads, nimbu pani. Avoid heavy, fried foods that increase body heat.

Monsoon foods (July-September): Immunity-boosting foods — turmeric milk, ginger tea, garlic, pepper. Warm soups — rasam, tomato shorba. Avoid raw salads and cut fruits from outside (contamination risk). Freshly cooked, warm food preferred. Include haldi, tulsi, and honey for immunity.

Winter foods (October-February): Warming, calorie-dense foods — bajra roti, makki ki roti, sarson ka saag. Dry fruits and nuts — almonds, walnuts, dates (provide warmth and essential fats). Root vegetables — sweet potato, carrot, beetroot are at peak nutrition. Jaggery-based sweets — provide iron and warmth. Ghee intake can be slightly higher in winter.

Seasonal vegetables availability: Summer: bottle gourd, ridge gourd, snake gourd, bitter gourd, mango. Monsoon: leafy greens (spinach, fenugreek, amaranth), okra, brinjal. Winter: cauliflower, peas, carrots, beetroot, radish, tomatoes, methi leaves.""",
    },
    {
        "title": "Thyroid Diet — Indian Foods for Hypothyroidism",
        "source": "Indian Journal of Endocrinology & Metabolism",
        "content": """Hypothyroidism affects approximately 11% of Indians. While medication (Levothyroxine) is the primary treatment, diet plays a supporting role.

Foods beneficial for thyroid health: Iodine sources — iodized salt (most important), seafood, dairy, eggs. Selenium sources — Brazil nuts, eggs, sunflower seeds, mushrooms. Zinc sources — pumpkin seeds, chickpeas, cashews, whole grains.

Goitrogenic foods (may interfere with thyroid function in excess): Cruciferous vegetables raw — cabbage, cauliflower, broccoli, radish. Soy products in excess. Millet (including ragi) in very large quantities. Note: Cooking significantly reduces goitrogenic activity. Moderate consumption of cooked cruciferous vegetables is safe.

Meal timing with Levothyroxine: Take medication on empty stomach, 30-60 minutes before breakfast. Avoid calcium-rich foods (milk, curd), iron supplements, and soy within 4 hours of medication. Coffee should be consumed 60 minutes after medication.

Practical tips: Use iodized salt (not rock salt for all cooking). Cook cruciferous vegetables before eating. Don't overconsume soy products. Ensure adequate selenium and zinc through diet.""",
    },
    {
        "title": "Cholesterol and Heart Health — Indian Diet",
        "source": "ICMR-NIN & Indian Heart Association",
        "content": """Cardiovascular disease is the leading cause of death in India. South Asians have a genetic predisposition to heart disease, making dietary management crucial.

Heart-protective Indian foods: Oats and barley (beta-glucan lowers LDL cholesterol). Walnuts and almonds (5-6 per day). Flaxseeds (ground) — richest vegetarian source of omega-3. Garlic — shown to reduce total cholesterol by 10-15%. Methi (fenugreek) seeds — reduce LDL cholesterol. Soluble fibre from dal, rajma, chana.

Foods that raise bad cholesterol: Coconut cream/milk in excess. Ghee and butter in large quantities. Deep fried foods (pakora, poori, samosa, vada). Red meat and processed meat. Full-fat dairy in excess. Trans fats in vanaspati (hydrogenated oil) and bakery products.

Omega-3 fatty acid sources for vegetarians: Flaxseeds (2 tablespoons/day provide adequate ALA). Walnuts (4-5 per day). Chia seeds. Mustard oil (contains ALA).

ICMR recommendations: Limit saturated fat to less than 7% of total calories. Increase soluble fibre to 10-25 g per day. Include 2 servings of omega-3 rich foods daily. Limit dietary cholesterol to 200 mg per day for those with heart disease.""",
    },
    {
        "title": "Food Safety and Hygiene in India",
        "source": "FSSAI & WHO Food Safety Guidelines",
        "content": """Food safety is a major concern in India with over 100 million cases of foodborne illness annually. Proper food handling prevents contamination and nutrient loss.

Safe food handling principles: Wash all fruits and vegetables thoroughly under running water. Cook food to adequate temperatures — meat should reach 74 degrees C internal temperature. Refrigerate cooked food within 2 hours. Don't keep cooked food at room temperature for more than 4 hours (especially in Indian summer).

Street food safety: Choose vendors with high turnover (food is fresher). Avoid cut fruits and salads from street vendors. Freshly cooked hot food (dosa, idli from the griddle) is safer than pre-made food. Carry your own water bottle.

Common Indian food safety concerns: Pesticide residues in fruits and vegetables — soak in salt water or vinegar solution for 15 minutes. Adulteration — buy from trusted sources. Aflatoxins in groundnuts and spices — discard moldy or discolored items. Excess lead in turmeric — buy from certified brands.

Nutrient preservation in cooking: Use minimal water when boiling vegetables (or use the water in dal/sambar). Don't overcook vegetables — retains more vitamins. Add tomato/lemon after cooking to preserve Vitamin C. Pressure cooking retains more nutrients than open-pot boiling.""",
    },
    {
        "title": "Zinc Deficiency and Indian Diet",
        "source": "ICMR-NIN Dietary Guidelines 2020",
        "content": """Zinc is essential for immunity, wound healing, taste perception, and reproductive health. The ICMR RDA for zinc is 12 mg/day for men and 10 mg/day for women. Zinc deficiency affects approximately 25% of the Indian population.

Zinc-rich Indian foods: Pumpkin seeds — 7.8 mg per 100g (best plant source). Sesame seeds (til) — 7.8 mg per 100g. Groundnuts — 3.3 mg per 100g. Cashews — 5.8 mg per 100g. Whole wheat — 2.9 mg per 100g. Chickpeas (chana) — 2.5 mg per 100g. Rajma — 2.8 mg per 100g. Eggs — 1.3 mg per 100g.

Zinc absorption: Phytates in whole grains and legumes reduce zinc absorption by 15-50%. Soaking, sprouting, and fermentation reduce phytates. Animal-based zinc (from eggs, meat) is more bioavailable than plant-based zinc. Vitamin C and citric acid enhance zinc absorption.

Signs of zinc deficiency: Frequent infections, slow wound healing, loss of taste or appetite, hair loss, skin problems. Important: These symptoms overlap with many conditions — consult a healthcare professional for proper diagnosis.""",
    },
    {
        "title": "Potassium — The Forgotten Mineral",
        "source": "ICMR-NIN & WHO",
        "content": """Potassium is critical for heart function, blood pressure regulation, and muscle contraction. WHO recommends at least 3510 mg per day. Most Indians consume only 1500-2500 mg per day.

High-potassium Indian foods: Tender coconut water — 250 mg per 200ml. Banana — 358 mg per 100g. Rajma (kidney beans) — 350 mg per 100g cooked. Potato — 421 mg per 100g. Soy chunks — 1800 mg per 100g (highest). Sweet potato — 337 mg per 100g. Buttermilk — 150 mg per 200ml. Black chana — 870 mg per 100g dry.

Potassium-sodium balance: Increasing potassium intake while reducing sodium helps lower blood pressure. The ideal potassium:sodium ratio is at least 2:1. Traditional Indian meals with dal, vegetables, and curd naturally provide good potassium. Processed and packaged foods are low in potassium and high in sodium.

Practical tips: Eat a banana daily (affordable potassium boost). Include dal with every main meal. Have tender coconut water 2-3 times per week. Choose whole foods over processed snacks.""",
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
