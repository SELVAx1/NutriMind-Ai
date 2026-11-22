-- ============================================================
-- FOOD SYNONYMS (for better search)
-- ============================================================
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Thayir Sadam', 'ta' FROM food_items WHERE name = 'Curd rice';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Chawal', 'hi' FROM food_items WHERE name = 'Cooked rice';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Bhaat', 'hi' FROM food_items WHERE name = 'Cooked rice';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Sadam', 'ta' FROM food_items WHERE name = 'Cooked rice';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Phulka', 'hi' FROM food_items WHERE name = 'Chapati';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Toor Dal', 'en' FROM food_items WHERE name = 'Dal (toor)';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Arhar Dal', 'hi' FROM food_items WHERE name = 'Dal (toor)';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Paruppu', 'ta' FROM food_items WHERE name = 'Dal (toor)';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Dahi', 'hi' FROM food_items WHERE name = 'Curd (plain)';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Thayir', 'ta' FROM food_items WHERE name = 'Curd (plain)';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Yogurt', 'en' FROM food_items WHERE name = 'Curd (plain)';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Muttai', 'ta' FROM food_items WHERE name = 'Egg (boiled)';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Anda', 'hi' FROM food_items WHERE name = 'Egg (boiled)';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Kela', 'hi' FROM food_items WHERE name = 'Banana';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Vazhaipazham', 'ta' FROM food_items WHERE name = 'Banana';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Mor', 'ta' FROM food_items WHERE name = 'Buttermilk';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Chaas', 'hi' FROM food_items WHERE name = 'Buttermilk';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Paal', 'ta' FROM food_items WHERE name = 'Milk (whole)';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Doodh', 'hi' FROM food_items WHERE name = 'Milk (whole)';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Elumichai Sadam', 'ta' FROM food_items WHERE name = 'Lemon rice';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Puliyodharai', 'ta' FROM food_items WHERE name = 'Tamarind rice';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Biriyani', 'ta' FROM food_items WHERE name = 'Biryani (veg)';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Nachni', 'hi' FROM food_items WHERE name = 'Ragi porridge';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Finger Millet', 'en' FROM food_items WHERE name = 'Ragi porridge';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Groundnut', 'en' FROM food_items WHERE name = 'Masala peanuts';
INSERT INTO food_synonyms (food_item_id, synonym, language) SELECT id, 'Moongphali', 'hi' FROM food_items WHERE name = 'Groundnut';

-- ============================================================
-- ALLERGEN CROSS-REACTIVITY DATA
-- ============================================================
INSERT INTO allergen_cross_reactions (primary_allergen, cross_reactive_allergen, risk_level, notes) VALUES
('Peanut', 'Soy', 'moderate', 'Both are legumes. 5% of peanut-allergic individuals react to soy.'),
('Peanut', 'Lentils', 'moderate', 'Cross-reactivity with other legumes including dal.'),
('Peanut', 'Chickpea', 'moderate', 'Chana and sundal may trigger reactions in peanut-allergic individuals.'),
('Peanut', 'Green peas', 'low', 'Mild cross-reactivity reported in some cases.'),
('Tree Nut', 'Coconut', 'low', 'FDA classifies coconut as tree nut but allergy cross-reactivity is rare.'),
('Tree Nut', 'Sesame', 'moderate', 'Shared protein structures; common co-allergy.'),
('Shellfish', 'Dust mites', 'moderate', 'Tropomyosin protein is shared. Cooking does not eliminate.'),
('Shellfish', 'Cockroach', 'moderate', 'Same tropomyosin cross-reactivity.'),
('Dairy', 'Goat milk', 'high', 'Over 90% of cow milk allergic individuals also react to goat milk.'),
('Dairy', 'Buffalo milk', 'high', 'Very similar casein proteins.'),
('Wheat', 'Barley', 'high', 'Shared gluten-like proteins (hordeins in barley).'),
('Wheat', 'Rye', 'high', 'Secalins in rye cross-react with wheat gluten.'),
('Fish', 'Other fish species', 'high', 'Parvalbumin is conserved across most fish species.'),
('Egg', 'Chicken meat', 'low', 'Bird-egg syndrome is rare but documented.'),
('Soy', 'Peanut', 'moderate', 'Bidirectional cross-reactivity between legumes.');

-- ============================================================
-- HIDDEN ALLERGENS IN COMMON INDIAN FOODS
-- ============================================================
INSERT INTO food_allergen_map (food_name_pattern, allergen, is_hidden, notes) VALUES
('naan', 'Dairy', true, 'Traditional naan contains yogurt in the dough.'),
('naan', 'Gluten', false, 'Made from wheat flour (maida).'),
('kulcha', 'Dairy', true, 'Contains yogurt and sometimes butter in dough.'),
('bhatura', 'Dairy', true, 'Often contains curd in the dough for fermentation.'),
('paneer', 'Dairy', false, 'Made from milk; contains casein and whey.'),
('ghee', 'Dairy', true, 'Clarified butter; may contain trace casein. Most lactose-intolerant can tolerate.'),
('lassi', 'Dairy', false, 'Made from yogurt.'),
('payasam', 'Dairy', false, 'Made with milk. May also contain nuts.'),
('halwa', 'Dairy', true, 'Contains ghee. Sooji halwa also uses milk.'),
('kheer', 'Dairy', false, 'Milk-based dessert.'),
('gulab jamun', 'Dairy', true, 'Made from khoya (reduced milk solids).'),
('rasgulla', 'Dairy', true, 'Made from chenna (cottage cheese).'),
('korma', 'Dairy', true, 'Often contains cream, yogurt, or cashew paste.'),
('butter chicken', 'Dairy', true, 'Contains butter, cream, and sometimes yogurt.'),
('matar paneer', 'Dairy', false, 'Contains paneer (cottage cheese).'),
('pickle', 'Mustard', true, 'Many Indian pickles use mustard oil or mustard seeds.'),
('achaar', 'Mustard', true, 'Traditional pickles contain mustard oil.'),
('papad', 'Gluten', true, 'Some papads contain wheat flour.'),
('soy sauce', 'Soy', false, 'Pure soy product.'),
('soy sauce', 'Gluten', true, 'Most soy sauces contain wheat.'),
('bread', 'Gluten', false, 'Made from wheat flour.'),
('bread', 'Dairy', true, 'Many breads contain milk powder or butter.'),
('maggi', 'Gluten', false, 'Wheat-based noodles.'),
('maggi', 'Soy', true, 'Contains soy protein in seasoning.'),
('chocolate', 'Dairy', true, 'Most milk and dark chocolates contain milk solids.'),
('chocolate', 'Soy', true, 'Many chocolates contain soy lecithin.'),
('biscuit', 'Gluten', false, 'Wheat-based.'),
('biscuit', 'Dairy', true, 'Most biscuits contain butter or milk powder.'),
('cake', 'Egg', true, 'Most cakes contain eggs unless specified eggless.'),
('cake', 'Gluten', false, 'Wheat flour based.'),
('ice cream', 'Dairy', false, 'Milk-based.'),
('ice cream', 'Egg', true, 'Many ice creams contain egg yolk as emulsifier.');

-- ============================================================
-- EXPANDED DRUG-NUTRIENT INTERACTIONS
-- ============================================================
INSERT INTO drug_nutrient_interactions (drug_name, nutrient_or_food, interaction_type, severity, description, recommendation) VALUES
('Warfarin', 'Vitamin K (green leafy vegetables)', 'caution', 'severe', 'Vitamin K counteracts warfarin anticoagulant effect. Spinach, palak, keerai, fenugreek leaves are very high in Vitamin K.', 'Maintain consistent Vitamin K intake daily. Do not suddenly increase or decrease green vegetable consumption.'),
('Warfarin', 'Cranberry juice', 'avoid', 'moderate', 'Cranberry can enhance warfarin effect, increasing bleeding risk.', 'Avoid or limit cranberry juice consumption.'),
('Warfarin', 'Ginger', 'caution', 'moderate', 'Ginger may enhance anticoagulant effect.', 'Limit medicinal doses of ginger. Culinary amounts in cooking are generally safe.'),
('Warfarin', 'Turmeric (high dose)', 'caution', 'moderate', 'Curcumin in high doses may enhance anticoagulant effect.', 'Normal culinary use of turmeric is safe. Avoid curcumin supplements.'),
('Metformin', 'Alcohol', 'avoid', 'severe', 'Alcohol + Metformin significantly increases risk of lactic acidosis, a life-threatening condition.', 'Avoid alcohol completely or limit to rare, small amounts.'),
('Metformin', 'Vitamin B12', 'monitor', 'moderate', 'Long-term Metformin use reduces B12 absorption by 10-30%.', 'Get B12 levels tested annually. Consider supplementation if deficient.'),
('Levothyroxine', 'Soy products', 'timing', 'moderate', 'Soy interferes with Levothyroxine absorption.', 'Take Levothyroxine 4 hours before or after consuming soy products.'),
('Levothyroxine', 'Calcium-rich foods', 'timing', 'moderate', 'Calcium binds with Levothyroxine reducing absorption.', 'Take medication 4 hours before or after calcium-rich foods (milk, curd, paneer, ragi).'),
('Levothyroxine', 'Iron supplements', 'timing', 'moderate', 'Iron reduces Levothyroxine absorption.', 'Separate Levothyroxine and iron by at least 4 hours.'),
('Levothyroxine', 'Coffee', 'timing', 'mild', 'Coffee can reduce absorption if taken simultaneously.', 'Wait 60 minutes after taking Levothyroxine before drinking coffee.'),
('Statins (Atorvastatin)', 'Grapefruit', 'avoid', 'severe', 'Grapefruit inhibits CYP3A4 enzyme, increasing statin blood levels and risk of muscle damage.', 'Avoid grapefruit and grapefruit juice entirely.'),
('Statins (Atorvastatin)', 'Alcohol', 'caution', 'moderate', 'Alcohol increases risk of liver damage when combined with statins.', 'Limit alcohol consumption. Get liver function tests regularly.'),
('ACE Inhibitors', 'Potassium-rich foods', 'caution', 'moderate', 'ACE inhibitors raise potassium levels. Excess potassium can cause dangerous heart rhythms.', 'Monitor potassium intake. Limit banana, coconut water, and rajma if potassium levels are elevated.'),
('Amlodipine', 'Grapefruit', 'caution', 'moderate', 'Grapefruit may increase amlodipine levels.', 'Avoid large quantities of grapefruit.'),
('NSAIDs (Ibuprofen)', 'Alcohol', 'avoid', 'moderate', 'Increased risk of stomach bleeding.', 'Avoid alcohol while taking NSAIDs.'),
('NSAIDs (Ibuprofen)', 'Sodium', 'caution', 'mild', 'NSAIDs cause sodium and water retention, worsening hypertension.', 'Reduce salt intake while on NSAIDs.'),
('Antacids', 'Iron-rich foods', 'timing', 'moderate', 'Antacids reduce stomach acid needed for iron absorption.', 'Take iron-rich meals 2 hours before or after antacids.'),
('Antibiotics (Tetracycline)', 'Dairy', 'avoid', 'moderate', 'Calcium in dairy binds to tetracycline, preventing absorption.', 'Avoid dairy products 2 hours before and after taking tetracycline.'),
('Antibiotics (Ciprofloxacin)', 'Dairy', 'timing', 'moderate', 'Calcium reduces ciprofloxacin absorption.', 'Take ciprofloxacin 2 hours before or 6 hours after dairy.'),
('MAOIs', 'Fermented foods', 'avoid', 'severe', 'Tyramine in fermented foods (aged cheese, fermented pickles, idli batter) can cause hypertensive crisis with MAOIs.', 'Strictly avoid aged/fermented foods while on MAOIs.'),
('Insulin', 'Alcohol', 'caution', 'severe', 'Alcohol can cause unpredictable blood sugar drops when combined with insulin.', 'If drinking, always eat carbohydrates with alcohol. Monitor blood sugar frequently.'),
('Lithium', 'Sodium', 'monitor', 'moderate', 'Changes in sodium intake affect lithium levels. Low sodium increases lithium toxicity.', 'Maintain consistent sodium intake. Stay well hydrated.'),
('Digoxin', 'High-fibre foods', 'timing', 'mild', 'Fibre can reduce digoxin absorption.', 'Take digoxin 2 hours before high-fibre meals.');

-- ============================================================
-- SEASONAL FOOD DATA
-- ============================================================
INSERT INTO seasonal_foods (food_name, season, peak_months, region, notes) VALUES
('Mango', 'summer', 'April-June', 'All India', 'Peak season. Alphonso (Maharashtra), Banganapalli (AP), Neelam (TN).'),
('Watermelon', 'summer', 'March-June', 'All India', 'Best for hydration in summer heat.'),
('Tender coconut', 'summer', 'March-July', 'South India', 'Natural electrolyte replacement.'),
('Sugarcane juice', 'summer', 'February-May', 'All India', 'Cooling and energy-rich.'),
('Buttermilk', 'summer', 'All year but essential in summer', 'All India', 'Probiotics + hydration + electrolytes.'),
('Raw mango', 'summer', 'March-May', 'All India', 'Used for aam panna, pachadi. Rich in Vitamin C.'),
('Cucumber', 'summer', 'March-June', 'All India', '95% water content, excellent for hydration.'),
('Spinach (Palak)', 'winter', 'November-February', 'All India', 'Peak nutrition and availability in winter.'),
('Methi leaves (Fenugreek)', 'winter', 'November-February', 'All India', 'Rich in iron. Best in winter for thepla, paratha, subzi.'),
('Green peas', 'winter', 'November-February', 'North India', 'Fresh peas are sweeter and more nutritious than frozen.'),
('Cauliflower', 'winter', 'October-February', 'All India', 'Peak season. Gobi paratha, aloo gobi.'),
('Carrot', 'winter', 'October-February', 'All India', 'Rich in beta-carotene. Gajar halwa season.'),
('Beetroot', 'winter', 'October-February', 'All India', 'Rich in iron and nitrates. Good for blood pressure.'),
('Radish', 'winter', 'October-February', 'North India', 'Mooli paratha season. Good for digestion.'),
('Sarson (Mustard greens)', 'winter', 'December-February', 'North India', 'Sarson ka saag — rich in calcium, iron, vitamins.'),
('Bajra (Pearl millet)', 'winter', 'October-February', 'North/West India', 'Warming grain. Bajra roti with ghee is a winter staple.'),
('Amla (Indian gooseberry)', 'winter', 'October-January', 'All India', 'Richest source of Vitamin C. 20x more than orange.'),
('Drumstick (Moringa)', 'monsoon', 'July-September', 'South India', 'Highly nutritious. Rich in calcium and iron.'),
('Okra (Bhindi)', 'monsoon', 'June-September', 'All India', 'Peak availability. Vendakkai, bhindi masala.'),
('Brinjal (Eggplant)', 'monsoon', 'June-September', 'All India', 'Baingan bharta, vangi bath season.'),
('Turmeric (fresh)', 'monsoon', 'July-September', 'South India', 'Fresh turmeric is more potent than dried.'),
('Ginger (fresh)', 'monsoon', 'July-October', 'All India', 'Immunity booster. Essential for monsoon chai.'),
('Jackfruit', 'summer', 'April-July', 'South/East India', 'Raw jackfruit for curry, ripe for dessert.'),
('Guava', 'winter', 'October-February', 'All India', 'Richest affordable source of Vitamin C (228mg/100g).'),
('Pomegranate', 'winter', 'October-February', 'All India', 'Rich in antioxidants and iron.'),
('Papaya', 'all_year', 'All year', 'All India', 'Available year-round. Rich in Vitamin A and digestive enzymes.'),
('Banana', 'all_year', 'All year', 'All India', 'Year-round availability. Affordable potassium source.'),
('Tomato', 'winter', 'November-February', 'All India', 'Peak season — cheapest and most nutritious in winter.'),
('Sweet potato', 'winter', 'October-February', 'All India', 'Rich in beta-carotene. Excellent alternative to potato.'),
('Ragi (Finger millet)', 'all_year', 'All year (harvested Aug-Oct)', 'South India', 'Staple millet. Richest plant calcium source.');
