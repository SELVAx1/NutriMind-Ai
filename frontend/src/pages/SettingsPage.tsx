import { useState, useEffect, type FormEvent } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Settings, User, Shield, Bell, LogOut } from 'lucide-react'
import { clsx } from 'clsx'

const DIET_TYPES = ['veg', 'non-veg', 'vegan', 'eggetarian', 'jain']
const REGIONS = ['South Indian', 'North Indian', 'West Indian', 'East Indian', 'Mixed']
const ACTIVITY_LEVELS = ['sedentary', 'light', 'moderate', 'active', 'very_active']

export function SettingsPage() {
  const { user, signOut } = useAuth()
  const { profile, targets, loading, updateProfile } = useProfile()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [dietType, setDietType] = useState('veg')
  const [region, setRegion] = useState('South Indian')
  const [activity, setActivity] = useState('moderate')
  const [budget, setBudget] = useState('200')
  const [cookingTime, setCookingTime] = useState('30')

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '')
      setAge(String(profile.age || ''))
      setHeight(String(profile.height_cm || ''))
      setWeight(String(profile.weight_kg || ''))
      setDietType(profile.diet_type || 'veg')
      setRegion(profile.region || 'South Indian')
      setActivity(profile.activity_level || 'moderate')
      setBudget(String(profile.budget_daily || '200'))
      setCookingTime(String(profile.max_cooking_min || '30'))
    }
  }, [profile])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    try {
      await updateProfile({
        full_name: name,
        age: parseInt(age),
        height_cm: parseFloat(height),
        weight_kg: parseFloat(weight),
        diet_type: dietType as any,
        region,
        activity_level: activity as any,
        budget_daily: parseFloat(budget),
        max_cooking_min: parseInt(cookingTime),
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {}
    setSaving(false)
  }

  if (loading) return <div className="py-12 text-center text-text-muted">Loading settings...</div>

  return (
    <div className="py-6 max-w-2xl">
      <h1 className="text-xl font-heading font-bold flex items-center gap-2 mb-6">
        <Settings size={22} className="text-primary" />
        Settings
      </h1>

      <div className="space-y-6">
        {/* Account */}
        <Card padding="lg">
          <h2 className="text-base font-heading font-semibold flex items-center gap-2 mb-4">
            <User size={18} /> Account
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-border-light">
              <span className="text-text-secondary">Email</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border-light">
              <span className="text-text-secondary">Member since</span>
              <span className="font-medium">{user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN') : '—'}</span>
            </div>
          </div>
        </Card>

        {/* Profile */}
        <Card padding="lg">
          <h2 className="text-base font-heading font-semibold mb-4">Nutrition Profile</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
              <Input label="Height (cm)" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
              <Input label="Weight (kg)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Diet type</label>
              <div className="flex flex-wrap gap-2">
                {DIET_TYPES.map((d) => (
                  <button key={d} type="button" onClick={() => setDietType(d)}
                    className={clsx('px-3 py-1.5 rounded-full text-xs border transition-colors cursor-pointer capitalize', dietType === d ? 'bg-primary text-white border-primary' : 'border-border text-text-secondary')}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Region</label>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((r) => (
                  <button key={r} type="button" onClick={() => setRegion(r)}
                    className={clsx('px-3 py-1.5 rounded-full text-xs border transition-colors cursor-pointer', region === r ? 'bg-primary text-white border-primary' : 'border-border text-text-secondary')}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Activity level</label>
              <div className="flex flex-wrap gap-2">
                {ACTIVITY_LEVELS.map((a) => (
                  <button key={a} type="button" onClick={() => setActivity(a)}
                    className={clsx('px-3 py-1.5 rounded-full text-xs border transition-colors cursor-pointer capitalize', activity === a ? 'bg-primary text-white border-primary' : 'border-border text-text-secondary')}>
                    {a.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input label="Daily budget (₹)" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />
              <Input label="Max cooking time (min)" type="number" value={cookingTime} onChange={(e) => setCookingTime(e.target.value)} />
            </div>

            {success && <p className="text-sm text-success">Profile updated successfully!</p>}

            <Button type="submit" loading={saving}>Save changes</Button>
          </form>
        </Card>

        {/* Nutrition Targets */}
        {targets && (
          <Card padding="lg">
            <h2 className="text-base font-heading font-semibold mb-4">Current Nutrition Targets</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-border-light text-center">
                <p className="font-heading font-bold text-lg">{targets.calories_kcal}</p>
                <p className="text-xs text-text-muted">kcal/day</p>
              </div>
              <div className="p-3 rounded-xl bg-border-light text-center">
                <p className="font-heading font-bold text-lg text-protein">{targets.protein_g}g</p>
                <p className="text-xs text-text-muted">protein</p>
              </div>
              <div className="p-3 rounded-xl bg-border-light text-center">
                <p className="font-heading font-bold text-lg text-carbs">{targets.carbs_g}g</p>
                <p className="text-xs text-text-muted">carbs</p>
              </div>
              <div className="p-3 rounded-xl bg-border-light text-center">
                <p className="font-heading font-bold text-lg text-fat">{targets.fat_g}g</p>
                <p className="text-xs text-text-muted">fat</p>
              </div>
              <div className="p-3 rounded-xl bg-border-light text-center">
                <p className="font-heading font-bold text-lg text-fibre">{targets.fibre_g}g</p>
                <p className="text-xs text-text-muted">fibre</p>
              </div>
              <div className="p-3 rounded-xl bg-border-light text-center">
                <p className="font-heading font-bold text-lg text-danger">{targets.iron_mg}mg</p>
                <p className="text-xs text-text-muted">iron</p>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-3">Targets are auto-calculated from your profile using ICMR guidelines. Update your profile above to recalculate.</p>
          </Card>
        )}

        {/* Privacy & Safety */}
        <Card padding="lg">
          <h2 className="text-base font-heading font-semibold flex items-center gap-2 mb-3">
            <Shield size={18} /> Privacy & Safety
          </h2>
          <ul className="text-sm text-text-secondary space-y-2">
            <li>Your data is stored securely in Supabase with row-level security.</li>
            <li>NutriMind does not diagnose diseases or prescribe medication.</li>
            <li>Food image analysis requires your explicit consent.</li>
            <li>You can delete your account and all data at any time.</li>
          </ul>
        </Card>

        {/* Sign Out */}
        <Button variant="danger" onClick={signOut} className="w-full">
          <LogOut size={16} /> Sign out
        </Button>
      </div>
    </div>
  )
}
