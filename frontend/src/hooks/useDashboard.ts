import { useProfile } from './useProfile'
import { useTodaysLogs } from './useFoodLog'
import { calculateFoodNutrition, sumDailyNutrition, calculateGaps } from '@/lib/nutrition'
import type { DailyNutrition, NutrientGap } from '@/types/database'

interface DashboardData {
  loading: boolean
  hasProfile: boolean
  name: string
  budgetDaily: number
  budgetSpent: number
  dailyNutrition: DailyNutrition
  targets: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fibre: number
  }
  gaps: NutrientGap[]
  todaysMeals: {
    id: string
    name: string
    nameTamil?: string
    calories: number
    protein: number
    mealType: string
    quantity: number
  }[]
  nextMeal: string
}

export function useDashboard(): DashboardData {
  const { profile, targets, loading: profileLoading } = useProfile()
  const { logs, loading: logsLoading } = useTodaysLogs()

  const loading = profileLoading || logsLoading

  const allItems: { id: string; name: string; nameTamil?: string; calories: number; protein: number; mealType: string; quantity: number; nutrition: DailyNutrition; cost: number }[] = []

  for (const log of logs) {
    for (const item of log.food_log_items) {
      const food = item.food_items
      if (!food?.nutritional_values) continue
      const n = calculateFoodNutrition(food.nutritional_values, item.quantity_g)
      allItems.push({
        id: item.id,
        name: food.name,
        nameTamil: food.name_tamil || undefined,
        calories: n.calories,
        protein: n.protein,
        mealType: log.meal_type,
        quantity: item.quantity_g,
        nutrition: n,
        cost: 0,
      })
    }
  }

  const dailyNutrition = sumDailyNutrition(allItems)

  const gaps = targets ? calculateGaps(dailyNutrition, targets) : []

  const loggedMealTypes = new Set(logs.map((l) => l.meal_type))
  const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack']
  const nextMeal = mealOrder.find((m) => !loggedMealTypes.has(m)) || 'snack'

  return {
    loading,
    hasProfile: !!profile,
    name: profile?.full_name || 'there',
    budgetDaily: profile?.budget_daily || 200,
    budgetSpent: 0,
    dailyNutrition,
    targets: {
      calories: targets?.calories_kcal || 2100,
      protein: targets?.protein_g || 60,
      carbs: targets?.carbs_g || 250,
      fat: targets?.fat_g || 55,
      fibre: targets?.fibre_g || 30,
    },
    gaps,
    todaysMeals: allItems.map(({ id, name, nameTamil, calories, protein, mealType, quantity }) => ({
      id, name, nameTamil, calories, protein, mealType, quantity,
    })),
    nextMeal,
  }
}
