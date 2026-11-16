import { useState } from 'react'
import { apiPost } from '@/lib/api'

export interface MealRecommendation {
  meal_type: string
  food_id: string
  food_name: string
  food_name_tamil?: string
  quantity_g: number
  prep_time_min: number
  estimated_cost: number
  explanation: string
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fibre: number
    iron: number
    calcium: number
  }
}

export interface MealPlanResponse {
  plan_id: string
  day: number
  meals: MealRecommendation[]
  daily_totals: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fibre: number
    iron: number
    calcium: number
    cost: number
    cooking_time_min: number
  }
  budget_limit: number
  target_calories: number
  target_protein: number
}

export interface SwapAlternative {
  name: string
  name_tamil?: string
  calories: number
  protein: number
  cost: number
  prep_time_min: number
  reason: string
}

export interface SwapResponse {
  original: { name: string; calories: number; protein: number; cost: number }
  alternatives: SwapAlternative[]
}

export function useMealPlan() {
  const [plan, setPlan] = useState<MealPlanResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [swapData, setSwapData] = useState<SwapResponse | null>(null)
  const [swapping, setSwapping] = useState(false)

  async function generatePlan(day = 1) {
    setLoading(true)
    setError(null)
    try {
      const data = await apiPost<any>('/api/meals/plan', { days: day })
      if (data && data.meals && data.meals.length > 0) {
        const normalizedPlan: MealPlanResponse = {
          plan_id: data.plan_id || 'plan-' + Date.now(),
          day: data.day || day,
          meals: data.meals,
          daily_totals: data.daily_totals || {
            calories: Math.round(data.total_nutrition?.calories || 0),
            protein: Math.round(data.total_nutrition?.protein || 0),
            carbs: Math.round(data.total_nutrition?.carbs || 0),
            fat: Math.round(data.total_nutrition?.fat || 0),
            fibre: Math.round(data.total_nutrition?.fibre || 0),
            iron: Math.round(data.total_nutrition?.iron || 0),
            calcium: Math.round(data.total_nutrition?.calcium || 0),
            cost: data.total_cost || 0,
            cooking_time_min: data.meals.reduce((sum: number, m: any) => sum + (m.prep_time_min || 0), 0)
          },
          budget_limit: data.budget || data.budget_limit || 200,
          target_calories: data.target_calories || 2000,
          target_protein: data.target_protein || 60
        }
        setPlan(normalizedPlan)
      } else {
        setError('Could not generate a meal plan. Make sure the backend is running and your profile is set up.')
      }
    } catch {
      setError('Failed to connect to the meal planning service. Please start the backend server.')
    } finally {
      setLoading(false)
    }
  }

  async function swapFood(foodId: string, quantityG: number) {
    setSwapping(true)
    try {
      const data = await apiPost<any>('/api/meals/swap', {
        food_item_id: foodId,
        quantity_g: quantityG,
      })
      if (data && data.alternatives && data.alternatives.length > 0) {
        const origNutrition = data.original?.nutrition || {}
        const normalizedSwap: SwapResponse = {
          original: {
            name: data.original?.name || 'Current Dish',
            calories: origNutrition.calories || data.original?.calories || 0,
            protein: origNutrition.protein || data.original?.protein || 0,
            cost: data.original?.cost || 0,
          },
          alternatives: data.alternatives.map((alt: any) => ({
            name: alt.name,
            name_tamil: alt.name_tamil,
            calories: Math.round(alt.calories ?? alt.nutrition?.calories ?? 0),
            protein: Math.round(alt.protein ?? alt.nutrition?.protein ?? 0),
            cost: alt.cost ?? alt.estimated_cost ?? 0,
            prep_time_min: alt.prep_time_min ?? 15,
            reason: alt.reason || alt.explanation || 'Nutritionally comparable alternative.'
          }))
        }
        setSwapData(normalizedSwap)
      } else {
        setError('No alternatives found for this food.')
      }
    } catch {
      setError('Failed to find swap alternatives. Please check your backend connection.')
    } finally {
      setSwapping(false)
    }
  }

  function clearSwap() {
    setSwapData(null)
  }

  return { plan, setPlan, loading, error, generatePlan, swapData, swapping, swapFood, clearSwap }
}
