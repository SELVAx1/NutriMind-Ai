import { useState } from 'react'
import { useMealPlan } from '@/hooks/useMealPlan'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CalendarDays, Flame, Clock, IndianRupee, RefreshCw, ArrowRightLeft } from 'lucide-react'
import { clsx } from 'clsx'

const MEAL_LABELS: Record<string, { label: string; emoji: string }> = {
  breakfast: { label: 'Breakfast', emoji: '🌅' },
  lunch: { label: 'Lunch', emoji: '☀️' },
  snack: { label: 'Snack', emoji: '🍪' },
  dinner: { label: 'Dinner', emoji: '🌙' },
}

export function PlannerPage() {
  const { plan, loading, generatePlan, swapData, swapping, swapFood, clearSwap } = useMealPlan()
  const [swappingId, setSwappingId] = useState<string | null>(null)

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-heading font-bold flex items-center gap-2">
            <CalendarDays size={22} className="text-primary" />
            Meal Planner
          </h1>
          <p className="text-sm text-text-secondary">AI-generated meal plans within your budget and diet.</p>
        </div>
        <Button onClick={() => generatePlan(1)} loading={loading}>
          <RefreshCw size={16} /> Generate Plan
        </Button>
      </div>

      {!plan && !loading && (
        <Card padding="lg" className="text-center">
          <p className="text-3xl mb-3">📋</p>
          <h3 className="font-heading font-semibold mb-1">No meal plan yet</h3>
          <p className="text-sm text-text-secondary mb-4">Click "Generate Plan" to create a personalized daily meal plan.</p>
          <Button onClick={() => generatePlan(1)}>Generate your first plan</Button>
        </Card>
      )}

      {plan?.error && (
        <Card padding="md" className="bg-red-50 border-danger/20 mb-4">
          <p className="text-sm text-danger">{plan.error}</p>
        </Card>
      )}

      {plan?.meals && plan.meals.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <Card padding="sm" className="text-center">
              <p className="text-xs text-text-muted">Total Calories</p>
              <p className="font-heading font-bold text-lg">{plan.total_nutrition.calories} kcal</p>
            </Card>
            <Card padding="sm" className="text-center">
              <p className="text-xs text-text-muted">Total Protein</p>
              <p className="font-heading font-bold text-lg text-protein">{plan.total_nutrition.protein}g</p>
            </Card>
            <Card padding="sm" className="text-center">
              <p className="text-xs text-text-muted">Total Cost</p>
              <p className="font-heading font-bold text-lg text-accent">₹{plan.total_cost}</p>
            </Card>
            <Card padding="sm" className="text-center">
              <p className="text-xs text-text-muted">Budget</p>
              <p className="font-heading font-bold text-lg text-primary">₹{plan.budget}</p>
            </Card>
          </div>

          <div className="space-y-4">
            {['breakfast', 'lunch', 'snack', 'dinner'].map((type) => {
              const meal = plan.meals.find((m) => m.meal_type === type)
              if (!meal) return null
              const info = MEAL_LABELS[type] || { label: type, emoji: '🍽️' }

              return (
                <Card key={type} padding="md">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">{info.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-text-muted uppercase font-medium">{info.label}</span>
                      </div>
                      <h3 className="font-heading font-semibold text-base">{meal.food_name}</h3>
                      {meal.food_name_tamil && (
                        <p className="font-tamil text-sm text-text-secondary">{meal.food_name_tamil}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary flex-wrap">
                        <span className="flex items-center gap-1"><Flame size={13} /> {meal.nutrition?.calories || 0} kcal</span>
                        <span className="text-protein font-medium">{meal.nutrition?.protein || 0}g protein</span>
                        <span className="flex items-center gap-1"><IndianRupee size={12} />{meal.estimated_cost}</span>
                        <span className="flex items-center gap-1"><Clock size={13} /> {meal.prep_time_min} min</span>
                      </div>
                      {meal.explanation && (
                        <p className="text-xs text-text-muted mt-2 italic">Why: {meal.explanation}</p>
                      )}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => { setSwappingId(meal.food_id); swapFood(meal.food_id, meal.quantity_g) }}
                      loading={swapping && swappingId === meal.food_id}
                    >
                      <ArrowRightLeft size={14} /> Swap
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {swapData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={clearSwap}>
          <Card padding="lg" className="max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-heading font-bold text-lg mb-1">Swap Alternatives</h3>
            <p className="text-sm text-text-secondary mb-4">
              Replace <strong>{swapData.original.name}</strong> with one of these:
            </p>
            <div className="space-y-3">
              {swapData.alternatives.map((alt, i) => (
                <div key={i} className="p-3 rounded-xl border border-border hover:bg-border-light transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm">{alt.name}</h4>
                    <Badge variant="vegan">Match</Badge>
                  </div>
                  <div className="flex gap-3 text-xs text-text-secondary mb-2">
                    <span>{alt.nutrition?.calories || 0} kcal</span>
                    <span className="text-protein">{alt.nutrition?.protein || 0}g protein</span>
                    <span>{alt.nutrition?.iron || 0}mg iron</span>
                  </div>
                  <p className="text-xs text-text-muted italic">{alt.explanation}</p>
                </div>
              ))}
            </div>
            <Button variant="ghost" onClick={clearSwap} className="w-full mt-4">Close</Button>
          </Card>
        </div>
      )}
    </div>
  )
}
