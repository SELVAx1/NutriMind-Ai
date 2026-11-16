import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FoodSearch } from '@/components/food/FoodSearch'
import { NutritionPreview } from '@/components/food/NutritionPreview'
import { useTodaysLogs } from '@/hooks/useFoodLog'
import type { FoodItem } from '@/types/database'
import { Check, Utensils, Scale, ArrowLeft, Camera } from 'lucide-react'

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙' },
  { value: 'snack', label: 'Snack & Tea', emoji: '🍪' },
]

const PORTION_PRESETS = [50, 100, 150, 200, 250, 300]

export function FoodLogPage() {
  const navigate = useNavigate()
  const { logFood } = useTodaysLogs()
  const [mealType, setMealType] = useState('breakfast')
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [quantity, setQuantity] = useState(150)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!selectedFood) return
    setLoading(true)
    setError('')

    try {
      await logFood(mealType, selectedFood.id, quantity)
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log food')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="py-20 text-center animate-fade-in max-w-md mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-[#F2E7D5] border border-[#D1B89A] flex items-center justify-center mx-auto mb-4 text-[#7B5E4A]">
          <Check size={36} strokeWidth={3} />
        </div>
        <h2 className="page-title text-[28px] font-extrabold text-[#3B2A20] mb-1 font-heading">Meal Logged!</h2>
        <p className="card-subtitle text-[14px] text-[#7B5E4A]">
          <span className="font-bold text-[#3B2A20]">{selectedFood?.name}</span> ({quantity}g) recorded into your food diary.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#D1B89A]/40">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2.5 rounded-2xl bg-[#FAF7F0] border border-[#D1B89A] hover:bg-[#F2E7D5] text-[#7B5E4A] hover:text-[#3B2A20] transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="page-title text-[28px] font-extrabold text-[#3B2A20] font-heading">Record Food Intake</h1>
            <p className="card-subtitle text-[11.5px] text-[#7B5E4A]">Select meal type and portion from the verified IFCT Indian database</p>
          </div>
        </div>
        <Link to="/food/analyze">
          <Button variant="secondary" size="sm">
            <Camera size={14} className="text-[#7B5E4A]" /> Scan Photo
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Meal Type Selector */}
        <Card padding="md" className="bg-white border-[#D1B89A]/60">
          <label className="eyebrow-label block text-[10px] font-bold uppercase tracking-wider text-[#7B5E4A] mb-3">
            Select Meal
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {MEAL_TYPES.map(({ value, label, emoji }) => {
              const active = mealType === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMealType(value)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#7B5E4A] text-white border-[#7B5E4A] shadow-md shadow-[#7B5E4A]/25'
                      : 'border-[#D1B89A]/50 bg-[#FAF7F0] text-[#7B5E4A] hover:bg-[#F2E7D5]'
                  }`}
                >
                  <span className="text-lg">{emoji}</span>
                  <span>{label}</span>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Food Search Autocomplete */}
        <Card padding="md" className="bg-white border-[#D1B89A]/60">
          <label className="eyebrow-label block text-[10px] font-bold uppercase tracking-wider text-[#7B5E4A] mb-2.5">
            Search Food or Dish
          </label>
          <FoodSearch onSelect={setSelectedFood} />

          {selectedFood && (
            <div className="mt-4 p-4 rounded-2xl bg-[#FAF7F0] border border-[#D1B89A] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🍛</span>
                <div>
                  <h4 className="card-title text-[15px] font-bold text-[#3B2A20] font-heading">{selectedFood.name}</h4>
                  {selectedFood.name_tamil && (
                    <span className="font-tamil text-[11px] text-[#A67C52]">{selectedFood.name_tamil}</span>
                  )}
                </div>
              </div>
              <span className="badge-pill text-[10.5px] font-bold px-2.5 py-1 rounded-xl bg-[#F2E7D5] text-[#7B5E4A] border border-[#D1B89A]">
                Selected
              </span>
            </div>
          )}
        </Card>

        {/* Portion Selector */}
        {selectedFood && (
          <Card padding="md" className="bg-white border-[#D1B89A]/60">
            <div className="flex items-center justify-between mb-3">
              <label className="eyebrow-label text-[10px] font-bold uppercase tracking-wider text-[#7B5E4A] flex items-center gap-1.5">
                <Scale size={14} className="text-[#7B5E4A]" /> Portion Size
              </label>
              <div className="font-mono text-base font-black text-[#3B2A20]">
                <span>{quantity}</span>
                <span className="text-xs text-[#7B5E4A] font-normal ml-1">grams</span>
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 mb-4">
              {PORTION_PRESETS.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setQuantity(preset)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono border transition-all cursor-pointer ${
                    quantity === preset
                      ? 'bg-[#7B5E4A] text-white border-[#7B5E4A] shadow-xs'
                      : 'border-[#D1B89A]/50 bg-[#FAF7F0] text-[#7B5E4A] hover:bg-[#F2E7D5]'
                  }`}
                >
                  {preset}g
                </button>
              ))}
            </div>

            {/* Slider */}
            <input
              type="range"
              min="20"
              max="600"
              step="10"
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-[#F2E7D5] accent-[#7B5E4A] cursor-pointer"
            />
          </Card>
        )}

        {/* Live Nutrition Preview */}
        {selectedFood?.nutritional_values && (
          <NutritionPreview
            nutritionalValues={selectedFood.nutritional_values}
            quantityG={quantity}
          />
        )}

        {error && (
          <div className="p-3.5 rounded-2xl bg-[#FDF0EE] border border-[#F3C3BC] text-xs text-[#8F3325] font-bold">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!selectedFood}
          loading={loading}
          size="lg"
          className="w-full mt-2"
        >
          <Utensils size={18} /> Confirm & Log Meal
        </Button>
      </form>
    </div>
  )
}
