import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { FoodItem } from '@/types/database'

export function useFoodSearch(query: string) {
  const [results, setResults] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length < 2) { setResults([]); return }

    const timeout = setTimeout(async () => {
      setLoading(true)
      const { data } = await supabase
        .from('food_items')
        .select('*, nutritional_values(*)')
        .ilike('name', `%${query}%`)
        .limit(10)
      setResults((data as FoodItem[]) || [])
      setLoading(false)
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  return { results, loading }
}

export function useCommonFoods() {
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('food_items')
        .select('*, nutritional_values(*)')
        .eq('is_common', true)
        .order('name')
      setFoods((data as FoodItem[]) || [])
      setLoading(false)
    }
    fetch()
  }, [])

  return { foods, loading }
}
