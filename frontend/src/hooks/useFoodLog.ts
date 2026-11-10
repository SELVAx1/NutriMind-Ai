import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { FoodLogWithItems } from '@/types/database'

export function useTodaysLogs() {
  const { user } = useAuth()
  const [logs, setLogs] = useState<FoodLogWithItems[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchLogs() {
    if (!user) return
    setLoading(true)
    const today = new Date().toISOString().split('T')[0]

    const { data } = await supabase
      .from('food_logs')
      .select('*, food_log_items(*, food_items(*, nutritional_values(*)))')
      .eq('user_id', user.id)
      .eq('log_date', today)
      .order('created_at', { ascending: true })

    setLogs((data as FoodLogWithItems[]) || [])
    setLoading(false)
  }

  useEffect(() => { fetchLogs() }, [user])

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

    if (!existingLog) {
      const { data: newLog, error } = await supabase
        .from('food_logs')
        .insert({ user_id: user.id, log_date: today, meal_type: mealType })
        .select()
        .single()
      if (error) throw error
      existingLog = newLog
    }

    const { error: itemError } = await supabase
      .from('food_log_items')
      .insert({
        food_log_id: existingLog.id,
        food_item_id: foodItemId,
        quantity_g: quantityG,
        source: 'manual',
      })

    if (itemError) throw itemError
    await fetchLogs()
  }

  async function deleteLogItem(itemId: string) {
    await supabase.from('food_log_items').delete().eq('id', itemId)
    await fetchLogs()
  }

  return { logs, loading, logFood, deleteLogItem, refetch: fetchLogs }
}
