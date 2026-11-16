import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { FoodItem } from '@/types/database'

export function useCommonFoods() {
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('food_items')
      .select('*, nutritional_values(*)')
      .limit(50)
      .then(({ data }) => {
        setFoods((data as FoodItem[]) || [])
        setLoading(false)
      })
  }, [])

  return { foods, loading }
}

export function useFoodSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      const { data } = await supabase
        .from('food_items')
        .select('*, nutritional_values(*)')
        .or(`name.ilike.%${query}%,name_tamil.ilike.%${query}%`)
        .limit(15)

      setResults((data as FoodItem[]) || [])
      setLoading(false)
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  return { query, setQuery, results, loading }
}
