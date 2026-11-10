import { useState } from 'react'
import { apiPost, apiGet } from '@/lib/api'

interface MealPlanItem {
  meal_type: string
  food_name: string
  food_name_tamil?: string
  food_id: string
  quantity_g: number
  estimated_cost: number
  prep_time_min: number
  explanation: string
  nutrition: { calories: number; protein: number; carbs: number; fat: number }
}

interface MealPlanResult {
  plan_id: string
  meals: MealPlanItem[]
  total_cost: number
  total_nutrition: { calories: number; protein: number; carbs: number; fat: number }
  budget: number
  error?: string
}

interface SwapResult {
  original: { food_id: string; name: string; nutrition: Record<string, number> }
  alternatives: {
    food_id: string; name: string; name_tamil?: string
    nutrition: Record<string, number>; explanation: string
  }[]
}

export function useMealPlan() {
  const [plan, setPlan] = useState<MealPlanResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [swapData, setSwapData] = useState<SwapResult | null>(null)
  const [swapping, setSwapping] = useState(false)

  async function generatePlan(days: number = 1) {
    setLoading(true)
    try {
      const result = await apiPost<MealPlanResult>('/api/meals/plan', { days })
      setPlan(result)
    } catch {
      setPlan({ plan_id: '', meals: [], total_cost: 0, total_nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 }, budget: 200, error: 'Failed to generate plan' })
    } finally {
      setLoading(false)
    }
  }

  async function swapFood(foodItemId: string, quantityG: number = 150) {
    setSwapping(true)
    try {
      const result = await apiPost<SwapResult>('/api/meals/swap', { food_item_id: foodItemId, quantity_g: quantityG })
      setSwapData(result)
    } catch {
      setSwapData(null)
    } finally {
      setSwapping(false)
    }
  }

  return { plan, loading, generatePlan, swapData, swapping, swapFood, clearSwap: () => setSwapData(null) }
}
