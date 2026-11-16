export interface UserProfile {
  id: string
  user_id: string
  full_name: string | null
  age: number | null
  height_cm: number | null
  weight_kg: number | null
  gender: 'male' | 'female' | 'other' | null
  diet_type: 'veg' | 'non-veg' | 'vegan' | 'eggetarian' | 'jain' | null
  region: string | null
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null
  budget_daily: number | null
  max_cooking_min: number | null
  created_at?: string
  updated_at?: string
}

export interface NutritionTargets {
  id: string
  user_id: string
  calories_kcal: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fibre_g: number
  iron_mg: number
  calcium_mg: number
  vitamin_b12_mcg: number
  vitamin_c_mg: number
  vitamin_d_mcg: number
  potassium_mg: number
}

export interface NutritionalValues {
  id: string
  food_item_id: string
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
  fibre_per_100g: number
  iron_mg: number
  calcium_mg: number
  vitamin_b12_mcg: number
  vitamin_c_mg: number
  potassium_mg: number
}

export interface FoodItem {
  id: string
  name: string
  name_tamil: string | null
  name_hindi: string | null
  category: string
  is_veg: boolean
  is_jain: boolean
  typical_portion_g: number
  estimated_cost_inr: number
  nutritional_values?: NutritionalValues
}

export interface FoodLogItem {
  id: string
  food_log_id: string
  food_item_id: string
  quantity_g: number
  food_items?: FoodItem
}

export interface FoodLog {
  id: string
  user_id: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  log_date: string
  food_log_items: FoodLogItem[]
  created_at?: string
}

export interface DailyNutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
  fibre: number
  iron: number
  calcium: number
  vitamin_b12?: number
}

export interface NutrientGap {
  nutrient: string
  actual: number
  target: number
  gap: number
  percentMet: number
  isDeficient: boolean
  message?: string
}

/* ── Allergen & Clinical Safety Types (Module 1, 5, 11) ── */
export interface ClinicalAllergenProfile {
  allergies: string[]
  allergySeverity: 'Mild' | 'Moderate' | 'Severe' | 'Anaphylactic'
  intolerances: string[]
  dietaryRestrictions: string[]
  medicalConditions: string[]
  medications: string[]
  supplements: string[]
  pregnancyStatus: string
  clinicianName: string
  emergencyContact: string
  safetyNotes: string
  consentAcknowledged: boolean
}

/* ── Symptom Log Entry (PDF Page 8) ── */
export interface SymptomLogEntry {
  id: string
  date: string
  time: string
  symptoms: string[]
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical'
  minutesAfterEating: number
  suspectedFood: string
  actionTaken: string
  notes: string
  suggestedEscalation: string
  resolved: boolean
  createdAt: string
}

/* ── Audit Trail Entry (PDF Page 4) ── */
export interface AuditLogEntry {
  id: string
  food: string
  meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
  calories: number
  protein: number
  safety: 'SAFE' | 'CAUTION' | 'FLAGGED'
  safetyReason?: string
  when: string
  databaseSource: 'IFCT 2017' | 'ICMR-NIN' | 'USDA' | 'Clinical Rules'
  confidenceScore: number
}

/* ── Anthropometrics & Progress (PDF Page 5) ── */
export interface ProgressMeasurement {
  id: string
  date: string
  weightKg: number
  waistCm: number
  bodyFatPct: number
  energyRating: number
  notes: string
}

/* ── Smart Grocery & Pantry (Module 8 & Fridge-to-Meal) ── */
export interface SmartGroceryItem {
  id: string
  name: string
  category: string
  quantity: string
  estimatedCostINR: number
  purchased: boolean
  ingredientSubstitution?: string
}

export interface PantryItem {
  id: string
  name: string
  category: string
  quantity: string
  expiryDays: number
  isExpiringSoon: boolean
}

/* ── Nutritionist Client Profile (Module 12) ── */
export interface NutritionistClient {
  id: string
  name: string
  avatar: string
  email: string
  age: number
  goal: string
  status: 'Active' | 'Review Needed' | 'Compliant' | 'Flagged'
  adherenceRate: number
  avgCalories: number
  avgProtein: number
  activeAllergies: string[]
  recentFeedback: string
  lastCheckIn: string
}
