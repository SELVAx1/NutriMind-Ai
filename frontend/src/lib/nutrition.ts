import type { NutritionalValues, DailyNutrition, NutrientGap, NutritionTargets } from '@/types/database'

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

export function calculateBMR(weightKg: number, heightCm: number, age: number): number {
  // Mifflin-St Jeor (gender-neutral midpoint: averaging male +5 and female -161)
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 78
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
      vitamin_b12: Math.round((acc.vitamin_b12 + nutrition.vitamin_b12) * 100) / 100,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0, iron: 0, calcium: 0, vitamin_b12: 0 }
  )
}

export function calculateGaps(daily: DailyNutrition, targets: NutritionTargets): NutrientGap[] {
  const gaps: NutrientGap[] = []

  const checks: [string, number, number | null, string, string][] = [
    ['Iron', daily.iron, targets.iron_mg, 'mg', 'var(--color-danger)'],
    ['Vitamin B12', daily.vitamin_b12, targets.vitamin_b12_mcg, 'mcg', 'var(--color-warning)'],
    ['Calcium', daily.calcium, targets.calcium_mg, 'mg', 'var(--color-protein)'],
    ['Fibre', daily.fibre, targets.fibre_g, 'g', 'var(--color-fibre)'],
    ['Protein', daily.protein, targets.protein_g, 'g', 'var(--color-protein)'],
  ]

  for (const [nutrient, current, target, unit, color] of checks) {
    if (target && target > 0) {
      const pct = (current / target) * 100
      if (pct < 80) {
        gaps.push({ nutrient, current, target, unit, percentage: pct, color })
      }
    }
  }

  return gaps.sort((a, b) => a.percentage - b.percentage)
}
