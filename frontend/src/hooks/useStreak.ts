import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export function useStreak() {
  const { user } = useAuth()
  const [streak, setStreak] = useState(0)
  const [loggedToday, setLoggedToday] = useState(false)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      try {
        const { data } = await supabase
          .from('food_logs')
          .select('log_date')
          .eq('user_id', user.id)
          .order('log_date', { ascending: false })
          .limit(60)

        if (!data || data.length === 0) {
          setStreak(0)
          setLoggedToday(false)
          return
        }

        const uniqueDates = [...new Set(data.map(d => d.log_date))].sort().reverse()
        const today = new Date().toISOString().split('T')[0]

        setLoggedToday(uniqueDates[0] === today)

        let count = 0
        const startDate = new Date(today)

        for (let i = 0; i < 60; i++) {
          const checkDate = new Date(startDate)
          checkDate.setDate(checkDate.getDate() - i)
          const dateStr = checkDate.toISOString().split('T')[0]

          if (uniqueDates.includes(dateStr)) {
            count++
          } else if (i === 0) {
            continue
          } else {
            break
          }
        }

        setStreak(count)
      } catch {
        setStreak(0)
      }
    })()
  }, [user])

  return { streak, loggedToday }
}
