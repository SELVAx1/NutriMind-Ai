import { useState, useEffect, type FormEvent } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Settings, User, Shield, LogOut, Mail, CalendarDays,
  Target, Scale, Ruler, Timer, Wallet, Check,
} from 'lucide-react'
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

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center animate-pulse-subtle">
          <Settings size={20} className="text-primary" />
        </div>
        <p className="text-[13px] text-text-muted">Loading settings...</p>
      </div>
    </div>
  )

  return (
    <div className="page-container animate-fade-in flex flex-col gap-7 max-w-3xl">
      {/* ═══════════ HEADER ═══════════ */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight leading-tight">Settings</h1>
          <p className="text-[13px] text-text-muted mt-1.5">Manage your account, nutrition profile, and preferences.</p>
        </div>
        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
          <Settings size={20} className="text-primary" />
        </div>
      </div>

      {/* ═══════════ ACCOUNT ═══════════ */}
      <Card padding="lg">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-surface-3 border border-border flex items-center justify-center">
            <User size={18} className="text-text-dim" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold">Account</h2>
            <p className="text-[12px] text-text-dim">Your sign-in details</p>
          </div>
        </div>
        <div className="flex flex-col gap-0">
          <div className="flex items-center justify-between py-3.5 border-b border-border">
            <div className="flex items-center gap-2.5">
              <Mail size={14} className="text-text-dim" />
              <span className="text-[13px] text-text-secondary">Email</span>
            </div>
            <span className="text-[13px] font-medium font-mono">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-2.5">
              <CalendarDays size={14} className="text-text-dim" />
              <span className="text-[13px] text-text-secondary">Member since</span>
            </div>
            <span className="text-[13px] font-medium">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
            </span>
          </div>
        </div>
      </Card>

      {/* ═══════════ NUTRITION PROFILE ═══════════ */}
      <Card padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-border flex items-center justify-center">
            <Target size={18} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold">Nutrition Profile</h2>
            <p className="text-[12px] text-text-dim">Used to calculate your daily targets (ICMR guidelines)</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          {/* Basic Info */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest text-text-dim mb-3">Basic Info</p>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
          </div>

          {/* Body Measurements */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest text-text-dim mb-3">Body Measurements</p>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Height (cm)" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
              <Input label="Weight (kg)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
          </div>

          {/* Diet Type */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest text-text-dim mb-3">Diet Type</p>
            <div className="flex flex-wrap gap-2">
              {DIET_TYPES.map((d) => (
                <button key={d} type="button" onClick={() => setDietType(d)}
                  className={clsx(
                    'px-3.5 py-2 rounded-lg text-[13px] font-medium border transition-all cursor-pointer capitalize',
                    dietType === d
                      ? 'bg-primary/15 text-primary border-primary/30'
                      : 'bg-surface-2 border-border text-text-secondary hover:bg-surface-3 hover:border-text-dim/50'
                  )}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Region */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest text-text-dim mb-3">Region</p>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <button key={r} type="button" onClick={() => setRegion(r)}
                  className={clsx(
                    'px-3.5 py-2 rounded-lg text-[13px] font-medium border transition-all cursor-pointer',
                    region === r
                      ? 'bg-primary/15 text-primary border-primary/30'
                      : 'bg-surface-2 border-border text-text-secondary hover:bg-surface-3 hover:border-text-dim/50'
                  )}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest text-text-dim mb-3">Activity Level</p>
            <div className="flex flex-wrap gap-2">
              {ACTIVITY_LEVELS.map((a) => (
                <button key={a} type="button" onClick={() => setActivity(a)}
                  className={clsx(
                    'px-3.5 py-2 rounded-lg text-[13px] font-medium border transition-all cursor-pointer capitalize',
                    activity === a
                      ? 'bg-primary/15 text-primary border-primary/30'
                      : 'bg-surface-2 border-border text-text-secondary hover:bg-surface-3 hover:border-text-dim/50'
                  )}>
                  {a.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Budget & Cooking */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest text-text-dim mb-3">Preferences</p>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Daily budget (₹)" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />
              <Input label="Max cooking time (min)" type="number" value={cookingTime} onChange={(e) => setCookingTime(e.target.value)} />
            </div>
          </div>

          {/* Success Toast */}
          {success && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Check size={15} className="text-emerald-400" />
              <p className="text-[13px] text-emerald-400 font-medium">Profile updated successfully!</p>
            </div>
          )}

          <Button type="submit" loading={saving} className="w-full">Save changes</Button>
        </form>
      </Card>

      {/* ═══════════ NUTRITION TARGETS ═══════════ */}
      {targets && (
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-border flex items-center justify-center">
              <Scale size={18} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold">Current Nutrition Targets</h2>
              <p className="text-[12px] text-text-dim">Auto-calculated from your profile using ICMR guidelines</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Calories', value: targets.calories_kcal, unit: 'kcal/day', color: '#F59E0B' },
              { label: 'Protein', value: `${targets.protein_g}g`, unit: 'per day', color: '#8B5CF6' },
              { label: 'Carbs', value: `${targets.carbs_g}g`, unit: 'per day', color: '#3B82F6' },
              { label: 'Fat', value: `${targets.fat_g}g`, unit: 'per day', color: '#EF4444' },
              { label: 'Fibre', value: `${targets.fibre_g}g`, unit: 'per day', color: '#14B8A6' },
              { label: 'Iron', value: `${targets.iron_mg}mg`, unit: 'per day', color: '#F97316' },
            ].map(t => (
              <div key={t.label} className="p-4 rounded-xl bg-surface-2 border border-border text-center">
                <p className="text-[11px] text-text-dim uppercase tracking-wider font-medium mb-1.5">{t.label}</p>
                <p className="text-[24px] font-extrabold tabular-nums leading-none" style={{ color: t.color }}>{t.value}</p>
                <p className="text-[11px] text-text-dim mt-1">{t.unit}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ═══════════ PRIVACY ═══════════ */}
      <Card padding="lg">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-border flex items-center justify-center">
            <Shield size={18} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold">Privacy & Safety</h2>
            <p className="text-[12px] text-text-dim">How we protect your data</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {[
            'Your data is stored securely in Supabase with row-level security.',
            'NutriMind does not diagnose diseases or prescribe medication.',
            'Food image analysis requires your explicit consent.',
            'You can delete your account and all data at any time.',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface-2 border border-border">
              <Check size={14} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="text-[13px] text-text-secondary leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* ═══════════ SIGN OUT ═══════════ */}
      <div className="pt-2 pb-4">
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[13px] font-medium text-red-400 bg-red-500/8 border border-red-500/15 hover:bg-red-500/15 transition-all cursor-pointer"
        >
          <LogOut size={15} /> Sign out of NutriMind
        </button>
      </div>
    </div>
  )
}
