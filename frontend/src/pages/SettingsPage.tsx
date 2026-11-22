import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { calculateICMRTargets } from '@/lib/nutrition'
import {
  User, Sparkles, ShieldCheck, Check,
  Utensils, LogOut, Sun, Moon, Monitor
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

function AppearanceCard() {
  const { theme, setTheme } = useTheme()
  const options = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ]

  return (
    <Card padding="lg" className="bg-white border-[#D1B89A]/60">
      <h2 className="text-[15px] font-bold text-[#3B2A20] mb-4 flex items-center gap-2 font-heading">
        <Sun className="w-5 h-5 text-[#7B5E4A]" />
        Appearance
      </h2>
      <div className="flex gap-2">
        {options.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              theme === value
                ? 'bg-[#7B5E4A] text-white border-[#7B5E4A] shadow-xs'
                : 'bg-[#FAF7F0] border-[#D1B89A] text-[#7B5E4A] hover:bg-[#F2E7D5]'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
    </Card>
  )
}

export function SettingsPage() {
  const { user, signOut } = useAuth()
  const { profile, updateProfile } = useProfile()
  const navigate = useNavigate()
  const fallbackName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  const [fullName, setFullName] = useState(fallbackName)
  const [age, setAge] = useState(profile?.age || 26)
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(profile?.gender || 'female')
  const [heightCm, setHeightCm] = useState(profile?.height_cm || 162)
  const [weightKg, setWeightKg] = useState(profile?.weight_kg || 58)
  const [dietType, setDietType] = useState<any>(profile?.diet_type || 'veg')
  const [region, setRegion] = useState(profile?.region || 'South India (Tamil Nadu)')
  const [activity, setActivity] = useState<any>(profile?.activity_level || 'moderate')
  const [budget, setBudget] = useState(profile?.budget_daily || 200)
  const [maxCookingMin, setMaxCookingMin] = useState(profile?.max_cooking_min || 30)

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Computed ICMR targets based on current form values
  const computed = calculateICMRTargets({
    age,
    gender,
    height_cm: heightCm,
    weight_kg: weightKg,
    activity_level: activity,
  })

  useEffect(() => {
    if (profile) {
      if (profile.full_name) setFullName(profile.full_name)
      if (profile.age) setAge(profile.age)
      if (profile.gender) setGender(profile.gender)
      if (profile.height_cm) setHeightCm(profile.height_cm)
      if (profile.weight_kg) setWeightKg(profile.weight_kg)
      if (profile.diet_type) setDietType(profile.diet_type)
      if (profile.region) setRegion(profile.region)
      if (profile.activity_level) setActivity(profile.activity_level)
      if (profile.budget_daily) setBudget(profile.budget_daily)
      if (profile.max_cooking_min) setMaxCookingMin(profile.max_cooking_min)
    } else if (user) {
      const fallback = user.user_metadata?.full_name || user.email?.split('@')[0] || ''
      if (fallback && !fullName) setFullName(fallback)
    }
  }, [profile, user])

  async function handleSave() {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      await updateProfile({
        full_name: fullName,
        age: Number(age),
        gender,
        height_cm: Number(heightCm),
        weight_kg: Number(weightKg),
        diet_type: dietType,
        region,
        activity_level: activity,
        budget_daily: Number(budget),
        max_cooking_min: Number(maxCookingMin),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err?.message || 'Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    try {
      await signOut()
    } finally {
      navigate('/auth/login', { replace: true })
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white border border-[#D1B89A]/60 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7B5E4A]" />
            <span className="eyebrow-label text-[10px] font-bold text-[#7B5E4A] uppercase tracking-wider">
              Profile & Clinical Targets
            </span>
          </div>
          <h1 className="page-title text-[28px] font-extrabold text-[#3B2A20] font-heading">
            Nutrition Profile & ICMR RDA
          </h1>
          <p className="card-subtitle text-[12px] text-[#7B5E4A]">
            Deterministic energy requirement calculated via Mifflin-St Jeor & ICMR 2020 Indian adult guidelines.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleSave}
          loading={saving}
          className="shrink-0"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Saved!</span>
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-[#F2E7D5] border border-[#D1B89A] text-[#7B5E4A] text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Profile and scientific nutrition targets updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-[#FDF0EE] border border-[#F3C3BC] text-[#8F3325] text-xs font-bold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Biometrics Card */}
          <Card padding="lg" className="bg-white border-[#D1B89A]/60">
            <h2 className="card-title text-[15px] font-bold text-[#3B2A20] mb-4 flex items-center gap-2 font-heading">
              <User className="w-5 h-5 text-[#7B5E4A]" />
              Personal & Biometric Data
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="eyebrow-label block text-[10px] font-bold text-[#7B5E4A] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl px-4 py-2.5 text-[14px] font-medium text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A]"
                />
              </div>

              <div>
                <label className="eyebrow-label block text-[10px] font-bold text-[#7B5E4A] uppercase tracking-wider mb-1.5">
                  Biological Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl px-4 py-2.5 text-[14px] font-medium text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A]"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="eyebrow-label block text-[10px] font-bold text-[#7B5E4A] uppercase tracking-wider mb-1.5">
                  Age (years)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  className="w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl px-4 py-2.5 text-[14px] font-medium text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A]"
                />
              </div>

              <div>
                <label className="eyebrow-label block text-[10px] font-bold text-[#7B5E4A] uppercase tracking-wider mb-1.5">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  className="w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl px-4 py-2.5 text-[14px] font-medium text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A]"
                />
              </div>

              <div>
                <label className="eyebrow-label block text-[10px] font-bold text-[#7B5E4A] uppercase tracking-wider mb-1.5">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  className="w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl px-4 py-2.5 text-[14px] font-medium text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A]"
                />
              </div>

              <div>
                <label className="eyebrow-label block text-[10px] font-bold text-[#7B5E4A] uppercase tracking-wider mb-1.5">
                  Daily Physical Activity
                </label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value as any)}
                  className="w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl px-4 py-2.5 text-[14px] font-medium text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A]"
                >
                  <option value="sedentary">Sedentary (Desk Job)</option>
                  <option value="light">Lightly Active (1-3 days exercise)</option>
                  <option value="moderate">Moderately Active (Daily walks / workouts)</option>
                  <option value="active">Active (Heavy physical activity)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Diet Preferences Card */}
          <Card padding="lg" className="bg-white border-[#D1B89A]/60">
            <h2 className="card-title text-[15px] font-bold text-[#3B2A20] mb-4 flex items-center gap-2 font-heading">
              <Utensils className="w-5 h-5 text-[#7B5E4A]" />
              Dietary Restrictions & Budget
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="eyebrow-label block text-[10px] font-bold text-[#7B5E4A] uppercase tracking-wider mb-1.5">
                  Diet Type
                </label>
                <select
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value as any)}
                  className="w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl px-4 py-2.5 text-[14px] font-medium text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A]"
                >
                  <option value="veg">Vegetarian (Lacto-Veg)</option>
                  <option value="eggetarian">Eggetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="vegan">Pure Vegan</option>
                  <option value="jain">Jain (No Root Veg)</option>
                </select>
              </div>

              <div>
                <label className="eyebrow-label block text-[10px] font-bold text-[#7B5E4A] uppercase tracking-wider mb-1.5">
                  Region & Cuisine Palette
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl px-4 py-2.5 text-[14px] font-medium text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A]"
                >
                  <option value="South India (Tamil Nadu)">South India (Tamil Nadu / Millets)</option>
                  <option value="South India (Kerala)">South India (Kerala)</option>
                  <option value="South India (Karnataka)">South India (Karnataka / Ragi)</option>
                  <option value="North India">North India (Roti / Dals)</option>
                  <option value="East India">East India (Bengal / Odisha)</option>
                  <option value="West India">West India (Gujarat / Maharashtra)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="eyebrow-label block text-[10px] font-bold text-[#7B5E4A] uppercase tracking-wider">
                    Daily Food Budget
                  </label>
                  <span className="text-[12px] font-bold text-[#7B5E4A]">₹{budget} / day</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={600}
                  step={10}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-[#7B5E4A]"
                />
                <div className="flex justify-between text-[10px] text-[#A67C52] font-semibold mt-1">
                  <span>₹50/day</span>
                  <span>₹300/day</span>
                  <span>₹600/day</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="eyebrow-label block text-[10px] font-bold text-[#7B5E4A] uppercase tracking-wider">
                    Max Prep Time
                  </label>
                  <span className="text-[12px] font-bold text-[#7B5E4A]">{maxCookingMin} minutes</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  step={5}
                  value={maxCookingMin}
                  onChange={(e) => setMaxCookingMin(Number(e.target.value))}
                  className="w-full accent-[#7B5E4A]"
                />
                <div className="flex justify-between text-[10px] text-[#A67C52] font-semibold mt-1">
                  <span>10 min</span>
                  <span>45 min</span>
                  <span>90 min</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Appearance */}
          <AppearanceCard />

          {/* Account & Session */}
          <Card padding="lg" className="border-[#D1B89A]/50 bg-white">
            <h3 className="card-title text-[15px] font-bold text-[#3B2A20] mb-1 font-heading">
              Account & Session
            </h3>
            <p className="card-subtitle text-[12px] text-[#7B5E4A] mb-4">
              Signed in as <span className="font-bold text-[#3B2A20]">{user?.email || 'Your Account'}</span>
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              className="text-[#8F3325] border-[#F3C3BC] hover:bg-[#FDF0EE]"
            >
              <LogOut className="w-4 h-4 mr-2 text-[#8F3325]" />
              Sign Out of NutriMind AI
            </Button>
          </Card>
        </div>

        {/* Right Col: Live ICMR Target Card */}
        <div>
          <Card padding="lg" className="bg-[#FAF7F0] border-[#D1B89A] sticky top-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#A67C52]" />
              <h3 className="section-label text-[10px] font-bold uppercase tracking-wider text-[#7B5E4A]">
                Deterministic ICMR 2020 RDA
              </h3>
            </div>
            <p className="card-subtitle text-[11.5px] text-[#7B5E4A] mb-4">
              Calculated dynamically via Mifflin-St Jeor equation and Indian Council of Medical Research reference tables.
            </p>

            <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#D1B89A]/50">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-[#D1B89A]/30">
                <span className="text-[#7B5E4A] font-semibold">Calories Target</span>
                <span className="font-extrabold text-[#3B2A20] text-sm font-heading">{computed.calories_kcal} kcal</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-[#D1B89A]/30">
                <span className="text-[#7B5E4A] font-semibold">Protein (ICMR 0.83g/kg)</span>
                <span className="font-extrabold text-[#7B5E4A] font-heading">{computed.protein_g} g</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-[#D1B89A]/30">
                <span className="text-[#7B5E4A] font-semibold">Carbohydrates</span>
                <span className="font-extrabold text-[#3B2A20] font-heading">{computed.carbs_g} g</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-[#D1B89A]/30">
                <span className="text-[#7B5E4A] font-semibold">Dietary Fats</span>
                <span className="font-extrabold text-[#3B2A20] font-heading">{computed.fat_g} g</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-[#D1B89A]/30">
                <span className="text-[#7B5E4A] font-semibold">Dietary Fibre</span>
                <span className="font-extrabold text-[#3B2A20] font-heading">{computed.fibre_g} g</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-[#D1B89A]/30">
                <span className="text-[#7B5E4A] font-semibold">Iron (Fe)</span>
                <span className="font-extrabold text-[#A67C52] font-heading">{computed.iron_mg} mg</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#7B5E4A] font-semibold">Calcium (Ca)</span>
                <span className="font-extrabold text-[#3B2A20] font-heading">{computed.calcium_mg} mg</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[10.5px] text-[#7B5E4A] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>National Institute of Nutrition (NIN) Validated</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
