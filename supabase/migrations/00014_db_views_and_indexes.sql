-- Daily nutrition summary view for fast dashboard queries
CREATE OR REPLACE VIEW daily_nutrition_summary AS
SELECT
  fl.user_id,
  fl.log_date,
  fl.meal_type,
  COUNT(fli.id) AS item_count,
  COALESCE(SUM(ROUND(nv.calories_per_100g * fli.quantity_g / 100)), 0) AS calories,
  COALESCE(SUM(ROUND(nv.protein_per_100g * fli.quantity_g / 100 * 10) / 10), 0) AS protein,
  COALESCE(SUM(ROUND(nv.carbs_per_100g * fli.quantity_g / 100 * 10) / 10), 0) AS carbs,
  COALESCE(SUM(ROUND(nv.fat_per_100g * fli.quantity_g / 100 * 10) / 10), 0) AS fat,
  COALESCE(SUM(ROUND(nv.fibre_per_100g * fli.quantity_g / 100 * 10) / 10), 0) AS fibre,
  COALESCE(SUM(ROUND(nv.iron_mg * fli.quantity_g / 100 * 10) / 10), 0) AS iron,
  COALESCE(SUM(ROUND(nv.calcium_mg * fli.quantity_g / 100 * 10) / 10), 0) AS calcium
FROM food_logs fl
JOIN food_log_items fli ON fli.food_log_id = fl.id
JOIN food_items fi ON fi.id = fli.food_item_id
LEFT JOIN nutritional_values nv ON nv.food_item_id = fi.id
GROUP BY fl.user_id, fl.log_date, fl.meal_type;

-- Food synonyms table for better search
CREATE TABLE IF NOT EXISTS food_synonyms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_item_id uuid REFERENCES food_items(id) ON DELETE CASCADE NOT NULL,
  synonym text NOT NULL,
  language text DEFAULT 'en'
);

CREATE INDEX IF NOT EXISTS idx_food_synonyms_text ON food_synonyms(synonym);
CREATE INDEX IF NOT EXISTS idx_food_synonyms_food ON food_synonyms(food_item_id);

-- Additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_food_logs_date ON food_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_food_logs_user_date ON food_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_food_log_items_log ON food_log_items(food_log_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_convo ON chat_messages(conversation_id);

-- Trigram extension for fuzzy search (must come before the gin index)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_food_items_name_trgm ON food_items USING gin (name gin_trgm_ops);

-- Allergen cross-reactivity table
CREATE TABLE IF NOT EXISTS allergen_cross_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_allergen text NOT NULL,
  cross_reactive_allergen text NOT NULL,
  risk_level text CHECK (risk_level IN ('low', 'moderate', 'high')) DEFAULT 'moderate',
  notes text
);

-- Hidden allergens in foods
CREATE TABLE IF NOT EXISTS food_allergen_map (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_item_id uuid REFERENCES food_items(id) ON DELETE CASCADE,
  food_name_pattern text,
  allergen text NOT NULL,
  is_hidden boolean DEFAULT true,
  notes text
);

CREATE INDEX IF NOT EXISTS idx_food_allergen_map_food ON food_allergen_map(food_item_id);
CREATE INDEX IF NOT EXISTS idx_food_allergen_map_pattern ON food_allergen_map(food_name_pattern);

-- Drug-nutrient interactions expanded table
CREATE TABLE IF NOT EXISTS drug_nutrient_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_name text NOT NULL,
  nutrient_or_food text NOT NULL,
  interaction_type text CHECK (interaction_type IN ('avoid', 'caution', 'timing', 'monitor')) DEFAULT 'caution',
  severity text CHECK (severity IN ('mild', 'moderate', 'severe')) DEFAULT 'moderate',
  description text NOT NULL,
  recommendation text
);

-- Seasonal food availability
CREATE TABLE IF NOT EXISTS seasonal_foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_item_id uuid REFERENCES food_items(id) ON DELETE CASCADE,
  food_name text NOT NULL,
  season text CHECK (season IN ('summer', 'monsoon', 'winter', 'all_year')) NOT NULL,
  peak_months text,
  region text DEFAULT 'All India',
  notes text
);

CREATE INDEX IF NOT EXISTS idx_seasonal_foods_season ON seasonal_foods(season);
