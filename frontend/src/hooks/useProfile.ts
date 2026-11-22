import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { apiPost, apiGet } from '@/lib/api'
import type { UserProfile, NutritionTargets } from '@/types/database'

export function useProfile() {
  const { user } = useAuth()
  const storageKey = user ? `nutrimind_profile_${user.id}` : null
  const targetsKey = user ? `nutrimind_targets_${user.id}` : null

  const [profile, setProfile] = useState<UserProfile | null>(() => {
    if (!user) return null
    try {
      const cached = localStorage.getItem(`nutrimind_profile_${user.id}`)
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  const [targets, setTargets] = useState<NutritionTargets | null>(() => {
    if (!user) return null
    try {
      const cached = localStorage.getItem(`nutrimind_targets_${user.id}`)
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  const [loading, setLoading] = useState(!profile)

  const loadProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setTargets(null)
      setLoading(false)
      return
    }

    try {
      // 1. Load from Supabase user_profiles
      const { data: pData, error: pError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!pError && pData) {
        setProfile(prev => {
          const merged = { ...prev, ...pData }
          if (storageKey) localStorage.setItem(storageKey, JSON.stringify(merged))
          return merged
        })

        // 2. Load targets from user_nutrition_targets using profile_id
        const { data: tData } = await supabase
          .from('user_nutrition_targets')
          .select('*')
          .eq('profile_id', pData.id)
          .maybeSingle()

        if (tData) {
          setTargets(tData)
          if (targetsKey) localStorage.setItem(targetsKey, JSON.stringify(tData))
        }
      } else {
        // If no row in Supabase yet, check backend API (/api/users/profile)
        try {
          const res = await apiGet<{ profile: UserProfile | null; targets: NutritionTargets | null }>('/api/users/profile')
          if (res?.profile) {
            setProfile(res.profile)
            if (storageKey) localStorage.setItem(storageKey, JSON.stringify(res.profile))
          }
          if (res?.targets) {
            setTargets(res.targets)
            if (targetsKey) localStorage.setItem(targetsKey, JSON.stringify(res.targets))
          }
        } catch {}
      }
    } catch (err) {
      console.warn('Error loading profile:', err)
    } finally {
      setLoading(false)
    }
  }, [user, storageKey, targetsKey])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  async function updateProfile(data: Partial<UserProfile>) {
    if (!user) throw new Error('Not authenticated')

    const payload = { ...data, user_id: user.id }
    let savedProfile: UserProfile | null = null

    // Backend API handles upsert + BMR/TDEE/macro calculation
    try {
      const res = await apiPost<{ profile: UserProfile; targets?: NutritionTargets }>('/api/users/profile', payload)
      if (res?.profile) {
        savedProfile = res.profile
      }
      if (res?.targets) {
        setTargets(res.targets)
        if (targetsKey) localStorage.setItem(targetsKey, JSON.stringify(res.targets))
      }
    } catch (e) {
      // Fallback: direct Supabase upsert if backend is down
      try {
        const { data: upserted, error } = await supabase
          .from('user_profiles')
          .upsert(payload, { onConflict: 'user_id' })
          .select()
          .single()
        if (!error && upserted) savedProfile = upserted
      } catch {
        console.warn('Both backend and Supabase writes failed:', e)
      }
    }

    if (!savedProfile) {
      savedProfile = {
        id: profile?.id || 'local-' + Date.now(),
        user_id: user.id,
        ...profile,
        ...data,
      } as UserProfile
    }

    setProfile(savedProfile)
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(savedProfile))
    return savedProfile
  }

  async function createProfile(data: Partial<UserProfile>) {
    return updateProfile(data)
  }

  async function saveAllergies(allergens: string[]) {
    if (!user) throw new Error('Not authenticated')
    if (profile?.id) {
      try {
        await supabase.from('allergies').delete().eq('profile_id', profile.id)
        if (allergens.length > 0) {
          const rows = allergens.map(a => ({ profile_id: profile.id, allergen: a, severity: 'moderate' }))
          await supabase.from('allergies').insert(rows)
        }
      } catch (e) {
        console.warn('Could not sync allergies table:', e)
      }
    }
  }

  return { profile, targets, loading, createProfile, updateProfile, saveAllergies, reloadProfile: loadProfile }
}
