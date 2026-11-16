import type { NutritionalValues, DailyNutrition, NutrientGap, NutritionTargets } from '@/types/database'

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

export function calculateBMR(weightKg: number, heightCm: number, age: number, gender: string = 'male'): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return gender === 'male' ? base + 5 : base - 161
}

export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55
  return Math.round(bmr * multiplier)
}

export function calculateMacroTargets(tdee: number, weightKg: number) {
  const protein = Math.round(weightKg * 1.0)
  const fatCalories = tdee * 0.25
  const fat = Math.round(fatCalories / 9)
  const proteinCalories = protein * 4
  const carbs = Math.round((tdee - proteinCalories - fatCalories) / 4)

  return {
    calories_kcal: tdee,
    protein_g: protein,
    carbs_g: carbs,
    fat_g: fat,
    fibre_g: 30,
    iron_mg: 18,
    calcium_mg: 600,
    vitamin_b12_mcg: 2.4,
    vitamin_c_mg: 65,
    vitamin_d_mcg: 15,
    potassium_mg: 3500,
  }
}

export function calculateICMRTargets({
  age,
  gender,
  height_cm,
  weight_kg,
  activity_level,
}: {
  age: number
  gender?: string | null
  height_cm: number
  weight_kg: number
  activity_level: string
}) {
  const bmr = calculateBMR(weight_kg, height_cm, age, gender || 'male')
  const tdee = calculateTDEE(bmr, activity_level)
  return calculateMacroTargets(tdee, weight_kg)
}

export function calculateFoodNutrition(nv: NutritionalValues, quantityG: number): DailyNutrition {
  const factor = quantityG / 100
  return {
    calories: Math.round((nv.calories_per_100g || 0) * factor),
    protein: Math.round((nv.protein_per_100g || 0) * factor * 10) / 10,
    carbs: Math.round((nv.carbs_per_100g || 0) * factor * 10) / 10,
    fat: Math.round((nv.fat_per_100g || 0) * factor * 10) / 10,
    fibre: Math.round((nv.fibre_per_100g || 0) * factor * 10) / 10,
    iron: Math.round((nv.iron_mg || 0) * factor * 10) / 10,
    calcium: Math.round((nv.calcium_mg || 0) * factor * 10) / 10,
    vitamin_b12: Math.round((nv.vitamin_b12_mcg || 0) * factor * 100) / 100,
  }
}

export function sumDailyNutrition(items: { nutrition: DailyNutrition }[]): DailyNutrition {
  return items.reduce<DailyNutrition>(
    (acc, { nutrition }) => ({
      calories: acc.calories + nutrition.calories,
      protein: Math.round((acc.protein + nutrition.protein) * 10) / 10,
      carbs: Math.round((acc.carbs + nutrition.carbs) * 10) / 10,
      fat: Math.round((acc.fat + nutrition.fat) * 10) / 10,
      fibre: Math.round((acc.fibre + nutrition.fibre) * 10) / 10,
      iron: Math.round((acc.iron + nutrition.iron) * 10) / 10,
      calcium: Math.round((acc.calcium + nutrition.calcium) * 10) / 10,
      vitamin_b12: Math.round(((acc.vitamin_b12 || 0) + (nutrition.vitamin_b12 || 0)) * 100) / 100,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0, iron: 0, calcium: 0, vitamin_b12: 0 }
  )
}

export function calculateGaps(actual: DailyNutrition, target: NutritionTargets | { calories: number; protein: number; carbs: number; fat: number; fibre: number; iron?: number; calcium?: number }): NutrientGap[] {
  const t = target as any
  const metrics: { key: keyof DailyNutrition; targetKey: string; name: string }[] = [
    { key: 'calories', targetKey: 'calories_kcal', name: 'Calories' },
    { key: 'protein', targetKey: 'protein_g', name: 'Protein' },
    { key: 'carbs', targetKey: 'carbs_g', name: 'Carbs' },
    { key: 'fat', targetKey: 'fat_g', name: 'Fat' },
    { key: 'fibre', targetKey: 'fibre_g', name: 'Fibre' },
    { key: 'iron', targetKey: 'iron_mg', name: 'Iron' },
    { key: 'calcium', targetKey: 'calcium_mg', name: 'Calcium' },
  ]

  return metrics.map(({ key, targetKey, name }) => {
    const act = (actual[key] as number) || 0
    const tgt = (t[targetKey] || t[key.toLowerCase()] || 1) as number
    const percentMet = Math.round((act / tgt) * 100)
    return {
      nutrient: name,
      actual: act,
      target: tgt,
      gap: Math.max(0, tgt - act),
      percentMet,
      isDeficient: percentMet < 70,
    }
  })
}
