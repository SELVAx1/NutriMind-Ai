import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { FoodLog, FoodLogItem, FoodItem } from '@/types/database'

export type FoodLogWithItems = FoodLog & {
  food_log_items: (FoodLogItem & { food_items: FoodItem })[]
}

export function useTodaysLogs() {
  const { user } = useAuth()
  const [logs, setLogs] = useState<FoodLogWithItems[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLogs = useCallback(async () => {
    if (!user) {
      setLogs([])
      setLoading(false)
      return
    }

    const today = new Date().toISOString().split('T')[0]

    const { data } = await supabase
      .from('food_logs')
      .select('*, food_log_items(*, food_items(*, nutritional_values(*)))')
      .eq('user_id', user.id)
      .eq('log_date', today)
      .order('created_at', { ascending: true })

    setLogs((data as FoodLogWithItems[]) || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  async function logFood(mealType: string, foodItemId: string, quantityG: number) {
    if (!user) throw new Error('Not authenticated')
    const today = new Date().toISOString().split('T')[0]

    let { data: existingLog } = await supabase
      .from('food_logs')
      .select('id')
      .eq('user_id', user.id)
      .eq('log_date', today)
      .eq('meal_type', mealType)
      .maybeSingle()

    let logId = existingLog?.id

    if (!logId) {
      const { data: newLog, error } = await supabase
        .from('food_logs')
        .insert({ user_id: user.id, log_date: today, meal_type: mealType })
        .select()
        .single()
      if (error || !newLog) throw error || new Error('Failed to create meal log')
      logId = newLog.id
    }

    const { error: itemError } = await supabase.from('food_log_items').insert({
      food_log_id: logId,
      food_item_id: foodItemId,
      quantity_g: quantityG,
    })

    if (itemError) throw itemError
    await fetchLogs()
  }

  async function updateLogItemQuantity(itemId: string, quantityG: number) {
    if (!user) throw new Error('Not authenticated')
    const { error } = await supabase
      .from('food_log_items')
      .update({ quantity_g: quantityG })
      .eq('id', itemId)
    if (error) throw error
    await fetchLogs()
  }

  async function deleteLogItem(itemId: string) {
    await supabase.from('food_log_items').delete().eq('id', itemId)
    await fetchLogs()
  }

  return { logs, loading, logFood, updateLogItemQuantity, deleteLogItem, refetch: fetchLogs }
}
