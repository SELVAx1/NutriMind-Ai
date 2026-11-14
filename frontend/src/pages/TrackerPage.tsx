import { useTodaysLogs } from '@/hooks/useFoodLog'
import { useProfile } from '@/hooks/useProfile'
import { calculateFoodNutrition, sumDailyNutrition } from '@/lib/nutrition'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Trash2, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { DailyNutrition } from '@/types/database'

const MEAL_ORDER = ['breakfast', 'lunch', 'dinner', 'snack'] as const
const MEAL_LABELS: Record<string, string> = { breakfast: '🌅 Breakfast', lunch: '☀️ Lunch', dinner: '🌙 Dinner', snack: '🍪 Snack' }

export function TrackerPage() {
  const { logs, loading, deleteLogItem } = useTodaysLogs()
  const { targets } = useProfile()

  const allItems: { id: string; name: string; nameTamil?: string; quantity: number; nutrition: DailyNutrition; mealType: string }[] = []

  for (const log of logs) {
    for (const item of log.food_log_items) {
      const food = item.food_items
      if (!food?.nutritional_values) continue
      allItems.push({
        id: item.id,
        name: food.name,
        nameTamil: food.name_tamil || undefined,
        quantity: item.quantity_g,
        nutrition: calculateFoodNutrition(food.nutritional_values, item.quantity_g),
        mealType: log.meal_type,
      })
    }
  }

  const totals = sumDailyNutrition(allItems)

  const progressBars = [
    { label: 'Calories', current: totals.calories, target: targets?.calories_kcal || 2100, unit: 'kcal', color: 'var(--color-text)' },
    { label: 'Protein', current: totals.protein, target: targets?.protein_g || 60, unit: 'g', color: 'var(--color-protein)' },
    { label: 'Carbs', current: totals.carbs, target: targets?.carbs_g || 250, unit: 'g', color: 'var(--color-carbs)' },
    { label: 'Fat', current: totals.fat, target: targets?.fat_g || 55, unit: 'g', color: 'var(--color-fat)' },
    { label: 'Fibre', current: totals.fibre, target: targets?.fibre_g || 30, unit: 'g', color: 'var(--color-fibre)' },
  ]

  if (loading) {
    return <div className="py-12 text-center text-text-muted">Loading today's meals...</div>
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-heading font-bold">Today's Nutrition</h1>
          <p className="text-sm text-text-secondary">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <Link to="/food">
          <Button size="sm"><Plus size={16} /> Log a meal</Button>
        </Link>
      </div>

      <Card padding="md" className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Daily Progress</h3>
        <div className="flex flex-col gap-3">
          {progressBars.map(({ label, current, target, unit, color }) => (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text-secondary">{label}</span>
                <span className="font-heading font-bold tabular-nums">
                  {current} / {target} {unit}
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min((current / target) * 100, 100)}%`, backgroundColor: color }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {allItems.length === 0 ? (
        <Card padding="lg" className="text-center">
          <p className="text-3xl mb-3">🍽️</p>
          <h3 className="font-heading font-semibold mb-1">No meals logged today</h3>
          <p className="text-sm text-text-secondary mb-4">Start by logging what you ate.</p>
          <Link to="/food"><Button>Log your first meal</Button></Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {MEAL_ORDER.map((mealType) => {
            const mealItems = allItems.filter((i) => i.mealType === mealType)
            if (mealItems.length === 0) return null
            return (
              <div key={mealType}>
                <h3 className="text-sm font-semibold mb-2">{MEAL_LABELS[mealType]}</h3>
                <div className="flex flex-col gap-2">
                  {mealItems.map((item) => (
                    <Card key={item.id} padding="sm" className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center text-lg">🍛</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        {item.nameTamil && <p className="font-tamil text-xs text-text-muted truncate">{item.nameTamil}</p>}
                        <p className="text-xs text-text-muted">{item.quantity}g · {item.nutrition.calories} kcal · {item.nutrition.protein}g protein</p>
                      </div>
                      <button
                        onClick={() => deleteLogItem(item.id)}
                        className="p-2 rounded-lg hover:bg-red-500/15 text-text-muted hover:text-danger transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
