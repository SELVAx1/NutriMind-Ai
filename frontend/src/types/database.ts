export interface UserProfile {
  id: string
  user_id: string
  full_name: string | null
  age: number | null
  height_cm: number | null
  weight_kg: number | null
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null
  diet_type: 'veg' | 'non-veg' | 'vegan' | 'jain' | 'eggetarian' | null
  region: string | null
  budget_daily: number | null
  max_cooking_min: number | null
  language_preference: string
  created_at: string
  updated_at: string
}

export interface NutritionTargets {
  id: string
  profile_id: string
  calories_kcal: number | null
  protein_g: number | null
  carbs_g: number | null
  fat_g: number | null
  fibre_g: number | null
  iron_mg: number | null
  calcium_mg: number | null
  vitamin_b12_mcg: number | null
  vitamin_c_mg: number | null
  vitamin_d_mcg: number | null
  potassium_mg: number | null
}

export interface FoodItem {
  id: string
  name: string
  name_tamil: string | null
  name_hindi: string | null
  category: string | null
  region: string | null
  source: 'IFCT' | 'USDA' | 'manual'
  is_common: boolean
  nutritional_values: NutritionalValues | null
}

export interface NutritionalValues {
  id: string
  food_item_id: string
  calories_per_100g: number | null
  protein_per_100g: number | null
  carbs_per_100g: number | null
  fat_per_100g: number | null
  fibre_per_100g: number | null
  sugar_per_100g: number | null
  sodium_mg: number | null
  calcium_mg: number | null
  iron_mg: number | null
  vitamin_a_mcg: number | null
  vitamin_b12_mcg: number | null
  vitamin_c_mg: number | null
  vitamin_d_mcg: number | null
  potassium_mg: number | null
}

export interface FoodLog {
  id: string
  user_id: string
  log_date: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  created_at: string
}

export interface FoodLogItem {
  id: string
  food_log_id: string
  food_item_id: string
  quantity_g: number
  confidence: number
  source: 'manual' | 'image' | 'voice'
  created_at: string
  food_items?: FoodItem
}

export interface FoodLogWithItems extends FoodLog {
  food_log_items: FoodLogItem[]
}

export interface DailyNutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
  fibre: number
  iron: number
  calcium: number
  vitamin_b12: number
}

export interface NutrientGap {
  nutrient: string
  current: number
  target: number
  unit: string
  percentage: number
  color: string
}
