import { useState } from 'react'
import { useMealPlan } from '@/hooks/useMealPlan'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  CalendarDays, Flame, Clock, IndianRupee, RefreshCw, ArrowRightLeft,
  Sunrise, Sun, Cookie, Moon, ClipboardList, Sparkles, X,
} from 'lucide-react'

const MEAL_CONFIG: Record<string, { label: string; icon: typeof Sunrise; color: string; bg: string }> = {
  breakfast: { label: 'Breakfast', icon: Sunrise, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  lunch: { label: 'Lunch', icon: Sun, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  snack: { label: 'Snack', icon: Cookie, color: 'text-teal-400', bg: 'bg-teal-500/10' },
  dinner: { label: 'Dinner', icon: Moon, color: 'text-violet-400', bg: 'bg-violet-500/10' },
}

export function PlannerPage() {
  const { plan, loading, generatePlan, swapData, swapping, swapFood, clearSwap } = useMealPlan()
  const [swappingId, setSwappingId] = useState<string | null>(null)

  return (
    <div className="page-container animate-fade-in flex flex-col gap-7">
      {/* ═══════════ HEADER ═══════════ */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight leading-tight">Meal Planner</h1>
          <p className="text-[13px] text-text-muted mt-1.5">AI-generated meal plans within your budget and diet preferences.</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button onClick={() => generatePlan(1)} loading={loading}>
            <RefreshCw size={14} /> Generate Plan
          </Button>
        </div>
      </div>

      {/* ═══════════ EMPTY STATE ═══════════ */}
      {!plan && !loading && (
        <Card padding="xl">
          <div className="py-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mb-5">
              <ClipboardList size={26} className="text-text-dim" />
            </div>
            <h3 className="text-[18px] font-bold mb-2">No meal plan yet</h3>
            <p className="text-[13px] text-text-muted max-w-md mb-6 leading-relaxed">
              Generate a personalized daily meal plan based on your dietary preferences, budget, and nutrition targets.
            </p>
            <Button onClick={() => generatePlan(1)}>
              <Sparkles size={14} /> Generate your first plan
            </Button>
          </div>
        </Card>
      )}

      {/* ═══════════ ERROR ═══════════ */}
      {plan?.error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <Flame size={16} className="text-red-400 flex-shrink-0" />
          <p className="text-[13px] text-red-300">{plan.error}</p>
        </div>
      )}

      {/* ═══════════ PLAN CONTENT ═══════════ */}
      {plan?.meals && plan.meals.length > 0 && (
        <>
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Calories', value: plan.total_nutrition.calories, unit: 'kcal', color: '#F59E0B' },
              { label: 'Total Protein', value: `${plan.total_nutrition.protein}g`, unit: '', color: '#8B5CF6' },
              { label: 'Total Cost', value: `₹${plan.total_cost}`, unit: '', color: '#10B981' },
              { label: 'Budget', value: `₹${plan.budget}`, unit: '', color: '#3B82F6' },
            ].map(k => (
              <Card key={k.label} padding="lg" glow={k.color} hover>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-text-dim mb-2">{k.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-[28px] font-extrabold tabular-nums tracking-tighter" style={{ color: k.color }}>
                    {k.value}
                  </span>
                  {k.unit && <span className="text-[13px] text-text-dim">{k.unit}</span>}
                </div>
              </Card>
            ))}
          </div>

          {/* Budget Progress */}
          {plan.budget > 0 && (
            <div className="px-1">
              <div className="flex justify-between text-[13px] mb-2">
                <span className="text-text-secondary font-medium">Budget utilization</span>
                <span className="tabular-nums font-mono text-text-muted">
                  ₹{plan.total_cost} / ₹{plan.budget}
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min((plan.total_cost / plan.budget) * 100, 100)}%`,
                    backgroundColor: plan.total_cost <= plan.budget ? '#10B981' : '#EF4444',
                  }}
                />
              </div>
            </div>
          )}

          {/* Meal Cards */}
          <div className="flex flex-col gap-4">
            {['breakfast', 'lunch', 'snack', 'dinner'].map((type) => {
              const meal = plan.meals.find((m) => m.meal_type === type)
              if (!meal) return null
              const config = MEAL_CONFIG[type] || { label: type, icon: Sun, color: 'text-text-muted', bg: 'bg-surface-3' }
              const Icon = config.icon

              return (
                <Card key={type} padding="lg" hover>
                  <div className="flex items-start gap-4">
                    {/* Meal type indicator */}
                    <div className={`w-11 h-11 rounded-xl ${config.bg} border border-border flex items-center justify-center flex-shrink-0`}>
                      <Icon size={20} className={config.color} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-text-dim">{config.label}</span>
                      </div>
                      <h3 className="text-[16px] font-bold tracking-tight">{meal.food_name}</h3>
                      {meal.food_name_tamil && (
                        <p className="font-tamil text-[13px] text-text-muted mt-0.5">{meal.food_name_tamil}</p>
                      )}

                      {/* Meta info */}
                      <div className="flex items-center gap-4 mt-3 flex-wrap">
                        <div className="flex items-center gap-1.5 text-[12px]">
                          <Flame size={13} className="text-calories" />
                          <span className="text-text-secondary tabular-nums font-medium">{meal.nutrition?.calories || 0} kcal</span>
                        </div>
                        <span className="text-[12px] text-protein font-semibold tabular-nums">
                          {meal.nutrition?.protein || 0}g protein
                        </span>
                        <div className="flex items-center gap-1 text-[12px]">
                          <IndianRupee size={12} className="text-text-dim" />
                          <span className="text-text-secondary tabular-nums">{meal.estimated_cost}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[12px]">
                          <Clock size={12} className="text-text-dim" />
                          <span className="text-text-secondary tabular-nums">{meal.prep_time_min} min</span>
                        </div>
                      </div>

                      {/* Explanation */}
                      {meal.explanation && (
                        <p className="text-[12px] text-text-dim mt-3 leading-relaxed">
                          {meal.explanation}
                        </p>
                      )}
                    </div>

                    {/* Swap button */}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => { setSwappingId(meal.food_id); swapFood(meal.food_id, meal.quantity_g) }}
                      loading={swapping && swappingId === meal.food_id}
                      className="flex-shrink-0"
                    >
                      <ArrowRightLeft size={13} /> Swap
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {/* ═══════════ SWAP MODAL ═══════════ */}
      {swapData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={clearSwap}>
          <div
            className="bg-surface-1 border border-border rounded-2xl shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Modal header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-[18px] font-bold">Swap Alternatives</h3>
                  <p className="text-[13px] text-text-muted mt-1">
                    Replace <span className="text-text font-medium">{swapData.original.name}</span>
                  </p>
                </div>
                <button
                  onClick={clearSwap}
                  className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-text-dim hover:text-text hover:bg-surface-3 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Alternatives list */}
              <div className="flex flex-col gap-3">
                {swapData.alternatives.map((alt, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-surface-2 border border-border hover:border-text-dim/50 hover:bg-surface-3 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[14px] font-semibold">{alt.name}</h4>
                      <Badge variant="success">Match</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-[12px] mb-2">
                      <span className="text-text-secondary tabular-nums">{alt.nutrition?.calories || 0} kcal</span>
                      <span className="text-protein font-medium tabular-nums">{alt.nutrition?.protein || 0}g protein</span>
                      <span className="text-iron tabular-nums">{alt.nutrition?.iron || 0}mg iron</span>
                    </div>
                    {alt.explanation && (
                      <p className="text-[12px] text-text-dim leading-relaxed">{alt.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
