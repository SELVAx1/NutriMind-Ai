import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { UserProfile, NutritionTargets } from '@/types/database'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [targets, setTargets] = useState<NutritionTargets | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    fetchProfile()
  }, [user])

  async function fetchProfile() {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    setProfile(data)

    if (data) {
      const { data: targetData } = await supabase
        .from('user_nutrition_targets')
        .select('*')
        .eq('profile_id', data.id)
        .maybeSingle()
      setTargets(targetData)
    }
    setLoading(false)
  }

  async function createProfile(profileData: Partial<UserProfile>, targetData: Partial<NutritionTargets>) {
    if (!user) throw new Error('Not authenticated')

    const { data: newProfile, error: profileError } = await supabase
      .from('user_profiles')
      .insert({ ...profileData, user_id: user.id })
      .select()
      .single()

    if (profileError) throw profileError

    const { data: newTargets, error: targetError } = await supabase
      .from('user_nutrition_targets')
      .insert({ ...targetData, profile_id: newProfile.id })
      .select()
      .single()

    if (targetError) throw targetError

    setProfile(newProfile)
    setTargets(newTargets)
    return { profile: newProfile, targets: newTargets }
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    if (!profile) throw new Error('No profile')
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', profile.id)
      .select()
      .single()
    if (error) throw error
    setProfile(data)
    return data
  }

  async function saveAllergies(allergens: string[]) {
    if (!profile) throw new Error('No profile')
    await supabase.from('allergies').delete().eq('profile_id', profile.id)
    if (allergens.length > 0) {
      await supabase.from('allergies').insert(
        allergens.map((a) => ({ profile_id: profile.id, allergen: a }))
      )
    }
  }

  return { profile, targets, loading, createProfile, updateProfile, saveAllergies, refetch: fetchProfile }
}
