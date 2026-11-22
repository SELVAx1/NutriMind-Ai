import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
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

export function useFrequentFoods() {
  const { user } = useAuth()
  const [foods, setFoods] = useState<FoodItem[]>([])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      try {
        const { data: logItems } = await supabase
          .from('food_log_items')
          .select('food_item_id, food_items(*, nutritional_values(*))')
          .order('created_at', { ascending: false })
          .limit(100)

        if (!logItems) return

        const countMap = new Map<string, { food: FoodItem; count: number }>()
        for (const item of logItems) {
          const food = (item as any).food_items as FoodItem | null
          if (!food) continue
          const existing = countMap.get(food.id)
          if (existing) {
            existing.count++
          } else {
            countMap.set(food.id, { food, count: 1 })
          }
        }

        const sorted = [...countMap.values()]
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
          .map(e => e.food)

        setFoods(sorted)
      } catch {}
    })()
  }, [user])

  return { foods }
}

export function useFoodSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)

    const timer = setTimeout(async () => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const { data } = await supabase
          .from('food_items')
          .select('*, nutritional_values(*)')
          .or(`name.ilike.%${trimmed}%,name_tamil.ilike.%${trimmed}%,name_hindi.ilike.%${trimmed}%,category.ilike.%${trimmed}%`)
          .limit(15)

        if (!controller.signal.aborted) {
          setResults((data as FoodItem[]) || [])
          setLoading(false)
        }
      } catch {
        if (!controller.signal.aborted) {
          setResults([])
          setLoading(false)
        }
      }
    }, 200)

    return () => {
      clearTimeout(timer)
      abortRef.current?.abort()
    }
  }, [query])

  return { query, setQuery, results, loading }
}
