import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { calculateBMR, calculateTDEE, calculateMacroTargets } from '@/lib/nutrition'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { clsx } from 'clsx'

const DIET_TYPES = [
  { value: 'veg', label: 'Vegetarian' },
  { value: 'non-veg', label: 'Non-Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'eggetarian', label: 'Eggetarian' },
  { value: 'jain', label: 'Jain' },
]

const REGIONS = ['South Indian', 'North Indian', 'West Indian', 'East Indian', 'Mixed']

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
  { value: 'light', label: 'Light', desc: 'Exercise 1-3 days/week' },
  { value: 'moderate', label: 'Moderate', desc: 'Exercise 3-5 days/week' },
  { value: 'active', label: 'Active', desc: 'Exercise 6-7 days/week' },
  { value: 'very_active', label: 'Very Active', desc: 'Hard exercise daily' },
]

const COMMON_ALLERGENS = ['Peanut', 'Milk', 'Egg', 'Gluten', 'Soy', 'Tree nuts', 'Shellfish', 'Sesame']

export function OnboardingPage() {
  const navigate = useNavigate()
  const { createProfile, saveAllergies } = useProfile()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [dietType, setDietType] = useState('veg')
  const [region, setRegion] = useState('South Indian')
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([])
  const [activityLevel, setActivityLevel] = useState('moderate')
  const [budget, setBudget] = useState('200')
  const [cookingTime, setCookingTime] = useState('30')

  function toggleAllergen(a: string) {
    setSelectedAllergens((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const ageNum = parseInt(age)
      const heightNum = parseFloat(height)
      const weightNum = parseFloat(weight)

      const bmr = calculateBMR(weightNum, heightNum, ageNum)
      const tdee = calculateTDEE(bmr, activityLevel)
      const targets = calculateMacroTargets(tdee, weightNum)

      await createProfile(
        {
          full_name: name,
          age: ageNum,
          height_cm: heightNum,
          weight_kg: weightNum,
          activity_level: activityLevel as UserProfile['activity_level'],
          diet_type: dietType as UserProfile['diet_type'],
          region,
          budget_daily: parseFloat(budget),
          max_cooking_min: parseInt(cookingTime),
        },
        targets
      )

      if (selectedAllergens.length > 0) {
        await saveAllergies(selectedAllergens)
      }

      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="font-heading font-bold text-xl text-primary">NutriMind</span>
          </div>
          <h1 className="text-2xl font-heading font-bold">Let's set up your profile</h1>
          <p className="text-sm text-text-secondary mt-1">Step {step} of 3</p>
          <div className="flex gap-2 justify-center mt-3">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={clsx(
                  'h-1.5 w-12 rounded-full transition-colors',
                  s <= step ? 'bg-primary' : 'bg-border'
                )}
              />
            ))}
          </div>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-heading font-semibold">Basic Information</h2>
                <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
                <Input label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" required min="10" max="100" />
                <Input label="Height (cm)" type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="165" required min="100" max="250" />
                <Input label="Weight (kg)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="60" required min="20" max="300" />
                <Button type="button" onClick={() => setStep(2)} className="w-full" disabled={!name || !age || !height || !weight}>
                  Next
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-heading font-semibold">Diet & Preferences</h2>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Diet type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {DIET_TYPES.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setDietType(value)}
                        className={clsx(
                          'px-3 py-2 rounded-xl text-sm font-medium border transition-colors cursor-pointer',
                          dietType === value
                            ? 'bg-primary text-white border-primary'
                            : 'border-border text-text-secondary hover:bg-surface-2'
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Region</label>
                  <div className="flex flex-wrap gap-2">
                    {REGIONS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRegion(r)}
                        className={clsx(
                          'px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer',
                          region === r
                            ? 'bg-primary text-white border-primary'
                            : 'border-border text-text-secondary hover:bg-surface-2'
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Allergies (if any)</label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_ALLERGENS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleAllergen(a)}
                        className={clsx(
                          'px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer',
                          selectedAllergens.includes(a)
                            ? 'bg-danger text-white border-danger'
                            : 'border-border text-text-secondary hover:bg-surface-2'
                        )}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={() => setStep(1)} className="flex-1">Back</Button>
                  <Button type="button" onClick={() => setStep(3)} className="flex-1">Next</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-heading font-semibold">Goals & Constraints</h2>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Activity level</label>
                  <div className="flex flex-col gap-2">
                    {ACTIVITY_LEVELS.map(({ value, label, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setActivityLevel(value)}
                        className={clsx(
                          'w-full px-4 py-3 rounded-xl text-left border transition-colors cursor-pointer',
                          activityLevel === value
                            ? 'bg-primary text-white border-primary'
                            : 'border-border hover:bg-surface-2'
                        )}
                      >
                        <span className="text-sm font-medium">{label}</span>
                        <span className={clsx('block text-xs', activityLevel === value ? 'text-white/70' : 'text-text-muted')}>
                          {desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Daily food budget (₹)"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="200"
                  min="50"
                />
                <Input
                  label="Max cooking time (minutes)"
                  type="number"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  placeholder="30"
                  min="5"
                />

                {error && <p className="text-sm text-danger bg-red-500/15 p-3 rounded-lg">{error}</p>}

                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={() => setStep(2)} className="flex-1">Back</Button>
                  <Button type="submit" loading={loading} className="flex-1">Complete setup</Button>
                </div>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  )
}

type UserProfile = import('@/types/database').UserProfile
