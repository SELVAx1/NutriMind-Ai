import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FoodSearch } from '@/components/food/FoodSearch'
import { NutritionPreview } from '@/components/food/NutritionPreview'
import { useTodaysLogs } from '@/hooks/useFoodLog'
import type { FoodItem } from '@/types/database'
import { clsx } from 'clsx'
import { Check } from 'lucide-react'

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙' },
  { value: 'snack', label: 'Snack', emoji: '🍪' },
]

const PORTION_PRESETS = [
  { label: '50g', value: 50 },
  { label: '100g', value: 100 },
  { label: '150g', value: 150 },
  { label: '200g', value: 200 },
  { label: '250g', value: 250 },
  { label: '300g', value: 300 },
]

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
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log food')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-success" />
        </div>
        <h2 className="text-xl font-heading font-bold mb-1">Meal logged!</h2>
        <p className="text-sm text-text-secondary">
          {selectedFood?.name} — {quantity}g added to {mealType}
        </p>
      </div>
    )
  }

  return (
    <div className="py-6 max-w-xl mx-auto">
      <h1 className="text-xl font-heading font-bold mb-1">Log a meal</h1>
      <p className="text-sm text-text-secondary mb-6">Search for food, set the quantity, and log it.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Meal type</label>
          <div className="grid grid-cols-4 gap-2">
            {MEAL_TYPES.map(({ value, label, emoji }) => (
              <button
                key={value}
                type="button"
                onClick={() => setMealType(value)}
                className={clsx(
                  'flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer',
                  mealType === value
                    ? 'bg-primary text-white border-primary'
                    : 'border-border text-text-secondary hover:bg-surface-2'
                )}
              >
                <span className="text-lg">{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">What did you eat?</label>
          <FoodSearch onSelect={setSelectedFood} />
        </div>

        {selectedFood && (
          <>
            <Card padding="sm" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center text-xl">🍛</div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{selectedFood.name}</p>
                {selectedFood.name_tamil && (
                  <p className="font-tamil text-xs text-text-muted">{selectedFood.name_tamil}</p>
                )}
              </div>
              <span className="text-xs text-text-muted">
                {selectedFood.nutritional_values?.calories_per_100g} kcal/100g
              </span>
            </Card>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Quantity: <span className="font-heading font-bold text-text">{quantity}g</span>
              </label>
              <input
                type="range"
                min={25}
                max={500}
                step={25}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {PORTION_PRESETS.map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setQuantity(value)}
                    className={clsx(
                      'px-3 py-1 rounded-full text-xs border transition-colors cursor-pointer',
                      quantity === value
                        ? 'bg-primary text-white border-primary'
                        : 'border-border text-text-secondary hover:bg-surface-2'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {selectedFood.nutritional_values && (
              <NutritionPreview nutritionalValues={selectedFood.nutritional_values} quantityG={quantity} />
            )}
          </>
        )}

        {error && <p className="text-sm text-danger bg-red-500/15 p-3 rounded-lg">{error}</p>}

        <Button type="submit" loading={loading} disabled={!selectedFood} className="w-full">
          Log {selectedFood?.name || 'food'} — {quantity}g
        </Button>
      </form>
    </div>
  )
}
