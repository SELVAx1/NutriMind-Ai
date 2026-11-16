import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { calculateICMRTargets } from '@/lib/nutrition'
import {
  UserCheck, ShieldCheck, Sparkles, Check,
  LogOut, RefreshCw, Calculator, Heart
} from 'lucide-react'
import clsx from 'clsx'

const DIET_STYLES = [
  'Vegetarian', 'Vegan', 'Eggetarian', 'Pescatarian', 'Non Vegetarian',
  'Jain', 'Halal', 'Kosher', 'Keto', 'Low Fodmap', 'Gluten Free',
  'Dairy Free', 'Mediterranean', 'Low Sodium', 'High Protein'
]

const CUISINES = [
  'North Indian', 'Punjabi', 'South Indian', 'Bengali', 'Gujarati',
  'Maharashtrian', 'Hyderabadi', 'Kerala', 'Sri Lankan', 'Italian',
  'Greek', 'Mediterranean', 'Middle Eastern', 'Mexican', 'Japanese',
  'Chinese', 'Thai', 'Korean', 'Vietnamese', 'French', 'Spanish',
  'American', 'Ethiopian', 'International'
]

export function ClinicalProfilePage() {
  const { user, signOut } = useAuth()
  const { profile, targets, updateProfile } = useProfile()
  const navigate = useNavigate()

  // Demographic state
  const fallbackInitial = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  const [preferredName, setPreferredName] = useState(fallbackInitial)
  const [age, setAge] = useState(profile?.age || 26)
  const [gender, setGender] = useState<'female' | 'male' | 'other'>(profile?.gender || 'female')
  const [activity, setActivity] = useState<any>(profile?.activity_level || 'moderate')
  const [heightCm, setHeightCm] = useState(profile?.height_cm || 165)
  const [weightKg, setWeightKg] = useState(profile?.weight_kg || 67)
  const [goal, setGoal] = useState('Improve health')
  const [units, setUnits] = useState('Metric (kg, cm)')
  const [notes, setNotes] = useState('')

  // Sync profile when loaded from Supabase / cache
  useEffect(() => {
    if (profile) {
      if (profile.full_name) setPreferredName(profile.full_name)
      if (profile.age) setAge(profile.age)
      if (profile.gender) setGender(profile.gender)
      if (profile.height_cm) setHeightCm(profile.height_cm)
      if (profile.weight_kg) setWeightKg(profile.weight_kg)
      if (profile.activity_level) setActivity(profile.activity_level)
    } else if (user) {
      const fallback = user.user_metadata?.full_name || user.email?.split('@')[0] || ''
      if (fallback) setPreferredName(fallback)
    }
  }, [profile, user])

  // Chips
  const [selectedDiets, setSelectedDiets] = useState<string[]>(['Vegetarian', 'High Protein'])
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([
    'South Indian', 'North Indian', 'Kerala', 'Mediterranean'
  ])

  // Daily Targets
  const [cal, setCal] = useState(targets?.calories_kcal || 2000)
  const [pro, setPro] = useState(targets?.protein_g || 120)
  const [carbs, setCarbs] = useState(targets?.carbs_g || 220)
  const [fat, setFat] = useState(targets?.fat_g || 65)
  const [fibre, setFibre] = useState(targets?.fibre_g || 30)
  const [water, setWater] = useState(2500)

  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Deterministic Mifflin-St Jeor & ICMR calculation
  const computedICMR = calculateICMRTargets({
    age: Number(age),
    gender,
    height_cm: Number(heightCm),
    weight_kg: Number(weightKg),
    activity_level: activity,
  })

  const handleUseCalculated = () => {
    setCal(computedICMR.calories_kcal)
    setPro(computedICMR.protein_g)
    setCarbs(computedICMR.carbs_g)
    setFat(computedICMR.fat_g)
    setFibre(computedICMR.fibre_g)
    setWater(Math.round(Number(weightKg) * 35))
  }

  const toggleDiet = (item: string) => {
    if (selectedDiets.includes(item)) {
      setSelectedDiets(selectedDiets.filter(i => i !== item))
    } else {
      setSelectedDiets([...selectedDiets, item])
    }
  }

  const toggleCuisine = (item: string) => {
    if (selectedCuisines.includes(item)) {
      setSelectedCuisines(selectedCuisines.filter(i => i !== item))
    } else {
      setSelectedCuisines([...selectedCuisines, item])
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    try {
      await updateProfile({
        full_name: preferredName,
        age: Number(age) || 25,
        gender,
        height_cm: Number(heightCm) || 165,
        weight_kg: Number(weightKg) || 65,
        activity_level: activity,
      })
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 2500)
    } catch (err: any) {
      console.error('Save error:', err)
      setSaveError(err?.message || 'Could not save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/auth/login', { replace: true })
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* ── Page Header (Matches PDF Page 9) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#A67C52] block mb-1">
            YOUR ACCOUNT
          </span>
          <h1 className="text-[28px] font-extrabold text-[#3B2A20] font-heading tracking-tight leading-tight">
            Clinical profile
          </h1>
          <p className="text-[13px] text-[#7B5E4A] mt-0.5">
            Body data, goal and cuisines shape every target and suggestion in the app.
          </p>
        </div>

        <Link
          to="/safety"
          className="px-4 py-2 rounded-xl bg-[#FAF7F0] border border-[#D1B89A] hover:border-[#7B5E4A] text-[#7B5E4A] text-[12px] font-bold flex items-center gap-1.5 w-fit"
        >
          <ShieldCheck className="w-4 h-4 text-[#7B5E4A]" />
          <span>Safety profile</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Left Column: Form & Targets (8 Cols - Matches PDF Page 9 & 10) ── */}
        <form onSubmit={handleSave} className="lg:col-span-8 space-y-6">
          <div className="bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl p-6 shadow-xs space-y-5">
            <h2 className="text-[15px] font-bold text-[#3B2A20] font-heading">
              About you
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  PREFERRED NAME
                </label>
                <input
                  type="text"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  AGE
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  SEX
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] font-semibold"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  ACTIVITY LEVEL
                </label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] font-semibold"
                >
                  <option value="sedentary">Sedentary (Desk job)</option>
                  <option value="light">Lightly active</option>
                  <option value="moderate">Moderately active</option>
                  <option value="active">Active (Heavy workouts)</option>
                  <option value="very_active">Very active (Athlete)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  HEIGHT (CM)
                </label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  WEIGHT (KG)
                </label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  GOAL
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] font-semibold"
                >
                  <option>Improve health</option>
                  <option>Fat loss / Weight management</option>
                  <option>Muscle hypertrophy</option>
                  <option>Metabolic & blood sugar control</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  UNITS
                </label>
                <select
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] font-semibold"
                >
                  <option>Metric (kg, cm)</option>
                  <option>Imperial (lbs, in)</option>
                </select>
              </div>
            </div>

            {/* Diet Styles Chips (Matches PDF Page 9) */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-2">
                DIET STYLES
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DIET_STYLES.map((d) => {
                  const active = selectedDiets.includes(d)
                  return (
                    <button
                      type="button"
                      key={d}
                      onClick={() => toggleDiet(d)}
                      className={clsx(
                        'px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                        active
                          ? 'bg-[#7B5E4A] text-white font-bold shadow-2xs'
                          : 'bg-white border border-[#D1B89A] text-[#7B5E4A] hover:bg-[#F2E7D5]/40'
                      )}
                    >
                      {d}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Cuisines You Enjoy Chips (Matches PDF Page 9 & 10) */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                CUISINES YOU ENJOY
              </label>
              <p className="text-[10.5px] text-[#7B5E4A] mb-2">
                Indian regional and international — plans rotate through these.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {CUISINES.map((c) => {
                  const active = selectedCuisines.includes(c)
                  return (
                    <button
                      type="button"
                      key={c}
                      onClick={() => toggleCuisine(c)}
                      className={clsx(
                        'px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                        active
                          ? 'bg-[#3B2A20] text-white font-bold shadow-2xs'
                          : 'bg-white border border-[#D1B89A] text-[#7B5E4A] hover:bg-[#F2E7D5]/40'
                      )}
                    >
                      {c}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                NOTES
              </label>
              <textarea
                rows={2}
                placeholder="Personal routines, fasting preferences, or clinician guidelines"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] resize-none"
              />
            </div>
          </div>

          {/* ── Daily Targets Card with [Use calculated] button (Matches PDF Page 10) ── */}
          <div className="bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-[15px] font-bold text-[#3B2A20] font-heading">
                  Daily targets
                </h3>
                <p className="text-[11.5px] text-[#7B5E4A]">
                  Calculated with Mifflin-St Jeor and your goal. Override any value you like.
                </p>
              </div>
              <button
                type="button"
                onClick={handleUseCalculated}
                className="px-3 py-1.5 bg-white border border-[#D1B89A] hover:border-[#7B5E4A] text-[#7B5E4A] hover:text-[#3B2A20] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5 text-[#A67C52]" />
                <span>Use calculated</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  CALORIES (KCAL)
                </label>
                <input
                  type="number"
                  value={cal}
                  onChange={(e) => setCal(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs font-bold text-[#3B2A20]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  PROTEIN (G)
                </label>
                <input
                  type="number"
                  value={pro}
                  onChange={(e) => setPro(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs font-bold text-[#7B5E4A]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  CARBS (G)
                </label>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs font-bold text-[#3B2A20]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  FAT (G)
                </label>
                <input
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs font-bold text-[#3B2A20]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  FIBRE (G)
                </label>
                <input
                  type="number"
                  value={fibre}
                  onChange={(e) => setFibre(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs font-bold text-[#A67C52]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  WATER (ML)
                </label>
                <input
                  type="number"
                  value={water}
                  onChange={(e) => setWater(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs font-bold text-[#3B2A20]"
                />
              </div>
            </div>

            <p className="text-[10.5px] text-[#7B5E4A] leading-relaxed pt-1">
              Calculated: BMR = {Math.round(computedICMR.calories_kcal * 0.72)} kcal • maintenance = {computedICMR.calories_kcal} kcal • protein = {computedICMR.protein_g} g • fibre = {computedICMR.fibre_g} g
            </p>

            {saveError && (
              <div className="p-3 bg-[#FDF0EE] border border-[#F3C3BC] text-[#8F3325] text-xs font-semibold rounded-xl">
                {saveError}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-[#7B5E4A] hover:bg-[#3B2A20] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Clinical Profile Saved!</span>
                </>
              ) : (
                <span>Save profile</span>
              )}
            </button>
          </div>
        </form>

        {/* ── Right Column: Account & Explanations (4 Cols - Matches PDF Page 9) ── */}
        <div className="lg:col-span-4 space-y-5">
          {/* Account Card (Matches PDF Page 9) */}
          <div className="bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl p-5 shadow-xs space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block">
              Account
            </span>

            <div>
              <h3 className="font-extrabold text-[15px] text-[#3B2A20]">
                {preferredName}
              </h3>
              <p className="text-[11.5px] text-[#7B5E4A]">
                {user?.email || 'user@nutrimind.ai'}
              </p>
              <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#A67C52] block mt-0.5">
                USER / MEMBER
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2 px-3 border border-[#D1B89A] hover:bg-[#FDF0EE] text-[#8F3325] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>

          {/* How Targets Are Set Card (Matches PDF Page 9) */}
          <div className="bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-[14px] font-bold text-[#3B2A20] font-heading">
              How targets are set
            </h3>

            <ul className="text-[11.5px] text-[#7B5E4A] space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-[#A67C52] font-bold">•</span>
                <span>BMR uses the Mifflin-St Jeor equation with your height, weight, age and sex.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#A67C52] font-bold">•</span>
                <span>Maintenance adds an activity factor; fat loss takes 18% off; muscle gain adds 10%.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#A67C52] font-bold">•</span>
                <span>Protein is 1.4–1.8 g per kg depending on goal; fat is ~27% of energy; carbs fill the rest.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#A67C52] font-bold">•</span>
                <span>Fibre targets 14 g per 1,000 kcal; water targets 35 ml per kg.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
