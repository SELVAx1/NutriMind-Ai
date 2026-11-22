import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useProfile } from '@/hooks/useProfile'
import {
  Apple, ArrowRight, ArrowLeft, Sparkles,
  User, Utensils, IndianRupee, ShieldCheck
} from 'lucide-react'

export function OnboardingPage() {
  const navigate = useNavigate()
  const { createProfile } = useProfile()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [fullName, setFullName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female')
  const [heightCm, setHeightCm] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [dietType, setDietType] = useState<string>('veg')
  const [region, setRegion] = useState('South India (Tamil Nadu)')
  const [activity, setActivity] = useState<string>('moderate')
  const [budget, setBudget] = useState(200)

  function validateStep1(): string | null {
    if (!fullName.trim()) return 'Please enter your name.'
    const ageNum = parseInt(age, 10)
    if (!age || isNaN(ageNum) || ageNum < 5 || ageNum > 120) return 'Please enter a valid age (5-120).'
    const h = parseFloat(heightCm)
    if (!heightCm || isNaN(h) || h < 50 || h > 300) return 'Please enter a valid height (50-300 cm).'
    const w = parseFloat(weightKg)
    if (!weightKg || isNaN(w) || w < 10 || w > 500) return 'Please enter a valid weight (10-500 kg).'
    return null
  }

  function handleStep1Next() {
    const err = validateStep1()
    if (err) { setError(err); return }
    setError('')
    setStep(2)
  }

  async function handleFinish() {
    setSaving(true)
    setError('')
    try {
      await createProfile({
        full_name: fullName.trim(),
        age: parseInt(age, 10),
        gender,
        height_cm: parseFloat(heightCm),
        weight_kg: parseFloat(weightKg),
        diet_type: dietType as any,
        region,
        activity_level: activity as any,
        budget_daily: budget,
        max_cooking_min: 30,
      })
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Failed to complete profile')
      setSaving(false)
    }
  }

  const preventScroll = (e: React.WheelEvent) => {
    (e.target as HTMLInputElement).blur()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-[#7B5E4A] to-[#3B2A20] flex items-center justify-center text-white shadow-lg shadow-[#7B5E4A]/30 mb-3">
            <Apple className="w-7 h-7 text-[#F2E7D5] stroke-[2.5]" />
          </div>
          <h1 className="text-[26px] font-extrabold text-[#3B2A20] font-heading">
            Welcome to Nutri<span className="text-[#7B5E4A]">Mind</span> AI
          </h1>
          <p className="text-[12px] text-[#7B5E4A] mt-1">
            Set up your nutrition profile in 3 quick steps
          </p>

          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  step === s
                    ? 'w-8 bg-[#7B5E4A]'
                    : step > s
                    ? 'w-2 bg-[#7B5E4A]/50'
                    : 'w-2 bg-[#D1B89A]'
                }`}
              />
            ))}
          </div>
        </div>

        <Card padding="lg" className="bg-white border-[#D1B89A] shadow-[0_20px_60px_rgba(59,42,32,0.08)]">
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-[#FDF0EE] text-[#8F3325] text-xs font-semibold">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-[#D1B89A]/40 pb-3 mb-4">
                <h2 className="text-[16px] font-bold text-[#3B2A20] flex items-center gap-2 font-heading">
                  <User className="w-4 h-4 text-[#7B5E4A]" />
                  Step 1: Your Biometrics
                </h2>
                <p className="text-[11.5px] text-[#7B5E4A]">Used to calculate your basal metabolic rate (Mifflin-St Jeor)</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#7B5E4A] uppercase mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl px-4 py-2.5 text-[14px] font-medium text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A]"
                  autoComplete="name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#7B5E4A] uppercase mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl px-3 py-2.5 text-[14px] font-medium text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A]"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#7B5E4A] uppercase mb-1">Age</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={age}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '')
                      if (v.length <= 3) setAge(v)
                    }}
                    placeholder="25"
                    className="w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl px-3 py-2.5 text-[14px] font-medium text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#7B5E4A] uppercase mb-1">Height (cm)</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={50}
                    max={300}
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    onWheel={preventScroll}
                    placeholder="165"
                    className="w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl px-3 py-2.5 text-[14px] font-medium text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#7B5E4A] uppercase mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={10}
                    max={500}
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    onWheel={preventScroll}
                    placeholder="60"
                    className="w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl px-3 py-2.5 text-[14px] font-medium text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button variant="primary" onClick={handleStep1Next}>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-[#D1B89A]/40 pb-3 mb-4">
                <h2 className="text-[16px] font-bold text-[#3B2A20] flex items-center gap-2 font-heading">
                  <Utensils className="w-4 h-4 text-[#7B5E4A]" />
                  Step 2: Dietary Habits & Region
                </h2>
                <p className="text-[11.5px] text-[#7B5E4A]">Tailors recommendations to your regional palate</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#7B5E4A] uppercase mb-1.5">Diet Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'veg', label: 'Vegetarian', desc: 'Lacto-vegetarian' },
                    { id: 'eggetarian', label: 'Eggetarian', desc: 'Veg + Eggs' },
                    { id: 'non-veg', label: 'Non-Vegetarian', desc: 'Chicken, Fish, Eggs' },
                    { id: 'jain', label: 'Jain Diet', desc: 'No root vegetables' },
                  ].map((d) => (
                    <button
                      type="button"
                      key={d.id}
                      onClick={() => setDietType(d.id)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        dietType === d.id
                          ? 'border-[#7B5E4A] bg-[#F2E7D5] text-[#3B2A20] font-bold shadow-2xs'
                          : 'border-[#D1B89A]/50 bg-[#FAF7F0] text-[#7B5E4A]'
                      }`}
                    >
                      <p className="text-[13px] font-bold font-heading">{d.label}</p>
                      <p className="text-[10px] text-[#7B5E4A]">{d.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#7B5E4A] uppercase mb-1">Region / Cuisine</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl px-3 py-2.5 text-[14px] font-medium text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A]"
                >
                  <option value="South India (Tamil Nadu)">South India (Tamil Nadu)</option>
                  <option value="South India (Kerala)">South India (Kerala)</option>
                  <option value="South India (Karnataka)">South India (Karnataka)</option>
                  <option value="North India">North India</option>
                  <option value="West India">West India (Gujarat / Maharashtra)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span>Back</span>
                </Button>
                <Button variant="primary" onClick={() => setStep(3)}>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-[#D1B89A]/40 pb-3 mb-4">
                <h2 className="text-[16px] font-bold text-[#3B2A20] flex items-center gap-2 font-heading">
                  <IndianRupee className="w-4 h-4 text-[#7B5E4A]" />
                  Step 3: Budget & Activity
                </h2>
                <p className="text-[11.5px] text-[#7B5E4A]">Ensures meal plans are affordable and energy-matched</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-bold text-[#7B5E4A] uppercase">Daily Food Budget</label>
                  <span className="text-[12px] font-bold text-[#7B5E4A]">₹{budget} / day</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={500}
                  step={10}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-[#7B5E4A]"
                />
                <div className="flex justify-between text-[10px] text-[#A67C52] font-semibold mt-1">
                  <span>₹50/day</span>
                  <span>₹250/day</span>
                  <span>₹500/day</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#7B5E4A] uppercase mb-1">Activity Level</label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl px-3 py-2.5 text-[14px] font-medium text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A]"
                >
                  <option value="sedentary">Sedentary (Desk Job)</option>
                  <option value="light">Lightly Active (1-3 days exercise)</option>
                  <option value="moderate">Moderately Active (Daily walks / workouts)</option>
                  <option value="active">Active (Heavy physical activity)</option>
                </select>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF7F0] border border-[#D1B89A] flex items-center gap-2 text-[12px] text-[#7B5E4A] font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#7B5E4A]" />
                <span>ICMR RDA targets will be calculated automatically from your profile.</span>
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="secondary" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span>Back</span>
                </Button>
                <Button variant="primary" loading={saving} onClick={handleFinish}>
                  <Sparkles className="w-4 h-4 mr-1" />
                  <span>Enter Dashboard</span>
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
