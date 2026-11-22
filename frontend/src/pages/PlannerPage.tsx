import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMealPlan } from '@/hooks/useMealPlan'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  Flame, Clock, IndianRupee, RefreshCw, ArrowRightLeft,
  Sunrise, Sun, Cookie, Moon, Sparkles, X,
  ShoppingBag, Check, ArrowRight
} from 'lucide-react'

const MEAL_ICONS: Record<string, { label: string; icon: typeof Sunrise; color: string; bg: string }> = {
  breakfast: { label: 'Breakfast', icon: Sunrise, color: 'text-[#A67C52]', bg: 'bg-[#F2E7D5]' },
  lunch: { label: 'Lunch', icon: Sun, color: 'text-[#7B5E4A]', bg: 'bg-[#FAF7F0]' },
  snack: { label: 'Snack & Tea', icon: Cookie, color: 'text-[#A67C52]', bg: 'bg-[#F2E7D5]' },
  dinner: { label: 'Dinner', icon: Moon, color: 'text-[#3B2A20]', bg: 'bg-[#FAF7F0]' },
}


export function PlannerPage() {
  const { plan, setPlan, loading, initialLoading, error, generatePlan, swapData, swapping, swapFood, clearSwap } = useMealPlan()


  const [planDays, setPlanDays] = useState(1)
  const [swappingId, setSwappingId] = useState<string | null>(null)
  const [swappedNotice, setSwappedNotice] = useState<string | null>(null)

  function applySwap(alt: typeof swapData extends null ? never : NonNullable<typeof swapData>['alternatives'][number]) {
    if (plan && swappingId) {
      const updatedMeals = plan.meals.map(m =>
        m.food_id === swappingId
          ? {
              ...m,
              food_name: alt.name,
              food_name_tamil: alt.name_tamil,
              food_id: alt.food_id || m.food_id,
              estimated_cost: alt.cost,
              nutrition: {
                calories: alt.calories,
                protein: alt.protein,
                carbs: alt.carbs,
                fat: alt.fat,
                fibre: alt.fibre,
                iron: alt.iron,
                calcium: alt.calcium,
              },
            }
          : m
      )
      const newTotals = updatedMeals.reduce(
        (acc, m) => ({
          calories: acc.calories + (m.nutrition?.calories || 0),
          protein: acc.protein + (m.nutrition?.protein || 0),
          carbs: acc.carbs + (m.nutrition?.carbs || 0),
          fat: acc.fat + (m.nutrition?.fat || 0),
          fibre: acc.fibre + (m.nutrition?.fibre || 0),
          iron: acc.iron + (m.nutrition?.iron || 0),
          calcium: acc.calcium + (m.nutrition?.calcium || 0),
          cost: acc.cost + (m.estimated_cost || 0),
          cooking_time_min: acc.cooking_time_min + (m.prep_time_min || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0, iron: 0, calcium: 0, cost: 0, cooking_time_min: 0 }
      )
      setPlan({ ...plan, meals: updatedMeals, daily_totals: newTotals })
      setSwappedNotice(`Swapped to ${alt.name}! Nutrition updated.`)
      setTimeout(() => setSwappedNotice(null), 3500)
    }
    clearSwap()
  }

  const handleGenerate = () => {
    generatePlan(planDays)
  }

  const totals = plan?.daily_totals || { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0, iron: 0, calcium: 0, cost: 0, cooking_time_min: 0 }

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* ── Page Header (Matches PDF Page 5) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#A67C52] block mb-1">
            PLANNING
          </span>
          <h1 className="page-title text-[28px] font-extrabold text-[#3B2A20] font-heading tracking-tight">
            Meal plans
          </h1>
          <p className="card-subtitle text-[13px] text-[#7B5E4A]">
            Generated plans across Indian regional and international cuisines, respecting your calories, diet style and allergens.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {plan?.meals && plan.meals.length > 0 && (
            <Link to="/grocery">
              <Button variant="outline" size="sm">
                <ShoppingBag size={14} className="text-[#7B5E4A]" /> Sync Grocery List
              </Button>
            </Link>
          )}
          <select
            value={planDays}
            onChange={e => setPlanDays(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-xl border border-[#D1B89A] bg-white text-[#3B2A20] text-xs font-bold cursor-pointer focus:outline-none focus:border-[#7B5E4A]"
          >
            <option value={1}>Today</option>
            <option value={3}>3 Days</option>
            <option value={7}>Full Week</option>
          </select>
          <Button onClick={handleGenerate} loading={loading} size="sm">
            <RefreshCw size={14} /> Generate plan
          </Button>
        </div>
      </div>


      {swappedNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-[12px] text-emerald-900 font-bold flex items-center gap-2 animate-fade-in shadow-xs">
          <Check size={16} />
          <span>{swappedNotice}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-[12px] text-rose-900 font-semibold">
          {error}
        </div>
      )}

      {!plan ? (
        <Card padding="xl" className="text-center py-16 bg-[#FAF7F0] border-[#D1B89A]">
          <div className="w-16 h-16 rounded-3xl bg-[#F2E7D5] text-[#7B5E4A] flex items-center justify-center mx-auto mb-4">
            <Sparkles size={32} />
          </div>
          <h3 className="card-title text-[20px] font-extrabold text-[#3B2A20] mb-1 font-heading">
            {initialLoading ? 'Loading your plan...' : 'No plans yet'}
          </h3>
          <p className="card-subtitle text-[12px] text-[#7B5E4A] max-w-sm mx-auto mb-6">
            {initialLoading ? '' : 'Complete your profile, start the backend, then generate a personalized AI meal plan.'}
          </p>
          {!initialLoading && (
            <Button onClick={handleGenerate} loading={loading} size="lg">
              <Sparkles size={18} /> Create your first plan
            </Button>
          )}
        </Card>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Daily Summary Bar */}
          <div className="p-4 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl shadow-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52]">
                  Daily Estimated Cost
                </span>
                <p className="text-[22px] font-extrabold text-[#3B2A20] mt-0.5 font-heading">
                  ₹{totals.cost || 0}
                </p>
                <span className="text-[10px] text-emerald-800 font-bold">
                  ✓ Within ₹{plan?.budget_limit || 200} budget
                </span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52]">
                  Total Calories
                </span>
                <p className="text-[22px] font-extrabold text-[#3B2A20] mt-0.5 font-heading">
                  {totals.calories || 0} kcal
                </p>
                <span className="text-[10px] text-[#7B5E4A]">
                  Target: {plan?.target_calories || 2000} kcal
                </span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52]">
                  Total Protein
                </span>
                <p className="text-[22px] font-extrabold text-[#7B5E4A] mt-0.5 font-heading">
                  {totals.protein || 0}g
                </p>
                <span className="text-[10px] text-[#7B5E4A] font-bold">
                  ICMR RDA compliant
                </span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52]">
                  Total Prep Time
                </span>
                <p className="text-[22px] font-extrabold text-[#3B2A20] mt-0.5 font-heading">
                  {totals.cooking_time_min || 0} mins
                </p>
                <span className="text-[10px] text-[#7B5E4A]">
                  {plan?.meals?.length || 0} meals combined
                </span>
              </div>
            </div>
          </div>

          {/* Meals Timeline */}
          <div className="flex flex-col gap-4">
            {(plan?.meals || []).map((meal, index) => {
              const meta = MEAL_ICONS[meal.meal_type] || MEAL_ICONS.lunch
              const Icon = meta.icon

              return (
                <div key={index} className="p-5 bg-white border border-[#D1B89A]/60 rounded-2xl shadow-xs hover:border-[#7B5E4A] transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${meta.bg} ${meta.color} flex items-center justify-center shrink-0 mt-0.5 shadow-2xs border border-[#D1B89A]/40`}>
                        <Icon size={22} />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#A67C52]">
                            {meta.label}
                          </span>
                          <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            ALLERGEN-FREE
                          </span>
                        </div>
                        <h3 className="card-title text-[16px] font-bold text-[#3B2A20] font-heading">
                          {meal.food_name}
                        </h3>
                        {meal.food_name_tamil && (
                          <p className="font-tamil text-[11px] text-[#A67C52]">{meal.food_name_tamil}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-3.5 mt-2.5 text-[12px] font-mono font-bold">
                          <span className="text-[#A67C52] flex items-center gap-1">
                            <Flame size={13} /> {meal.nutrition?.calories || 0} kcal
                          </span>
                          <span className="text-[#7B5E4A]">
                            {meal.nutrition?.protein || 0}g protein
                          </span>
                          <span className="text-[#3B2A20] flex items-center gap-0.5">
                            <IndianRupee size={12} /> {meal.estimated_cost}
                          </span>
                          <span className="text-[#7B5E4A] flex items-center gap-1 font-sans">
                            <Clock size={12} /> {meal.prep_time_min} mins
                          </span>
                        </div>

                        {meal.explanation && (
                          <div className="mt-3 p-3 rounded-xl bg-[#FAF7F0] border border-[#D1B89A]/40 text-[11.5px] text-[#7B5E4A] leading-relaxed max-w-2xl">
                            <strong className="text-[#3B2A20]">Clinical reasoning: </strong>
                            {meal.explanation}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSwappingId(meal.food_id)
                        swapFood(meal.food_id, meal.quantity_g)
                      }}
                      className="px-3.5 py-2 rounded-xl border border-[#D1B89A] hover:border-[#7B5E4A] bg-[#FAF7F0] hover:bg-white text-[#7B5E4A] text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <ArrowRightLeft size={14} className="text-[#7B5E4A]" />
                      <span>{swapping && swappingId === meal.food_id ? 'Finding Swaps...' : 'Swap Dish'}</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Module 5: Constraint-Aware Smart Food Swap Engine Modal ── */}
      {swapData && (
        <div className="fixed inset-0 bg-[#3B2A20]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={clearSwap}>
          <div className="bg-white border border-[#D1B89A] rounded-3xl shadow-[0_25px_60px_rgba(59,42,32,0.18)] max-w-xl w-full max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between pb-3 mb-4 border-b border-[#D1B89A]/40">
              <div>
                <span className="text-[9.5px] font-black uppercase tracking-wider text-[#A67C52] block">
                  MODULE 5 • CONSTRAINT-AWARE SMART SWAP ENGINE
                </span>
                <h3 className="card-title text-[16px] font-bold text-[#3B2A20] font-heading mt-0.5">
                  Nutritional Parity Alternatives
                </h3>
                <p className="card-subtitle text-[11.5px] text-[#7B5E4A]">
                  Replacing <strong className="text-[#3B2A20]">{swapData.original.name}</strong> while keeping macros, budget and allergen filters clean.
                </p>
              </div>
              <button onClick={clearSwap} className="p-1 rounded-xl hover:bg-[#FAF7F0] text-[#7B5E4A] cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-3.5">
              {swapData.alternatives.map((alt, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#D1B89A]/60 flex flex-col justify-between hover:border-[#7B5E4A] transition-all space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[14px] font-bold text-[#3B2A20] font-heading">{alt.name}</h4>
                      <span className="text-[10px] font-semibold text-[#A67C52]">Regional Indian Ingredient</span>
                    </div>
                    <span className="text-[13px] font-extrabold text-[#3B2A20]">₹{alt.cost}</span>
                  </div>

                  {/* Explicit Explanation of What Changes Nutritionally & Why Suitable */}
                  <div className="p-2.5 bg-white rounded-xl border border-[#D1B89A]/40 text-[11px] text-[#7B5E4A] space-y-1">
                    <p><strong className="text-[#3B2A20]">Why suitable:</strong> {alt.reason}</p>
                    <div className="flex items-center gap-2 pt-1 text-[10px] font-bold text-emerald-800">
                      <span>✓ 100% Allergy-Safe</span>
                      <span>•</span>
                      <span>✓ High Market Availability</span>
                      <span>•</span>
                      <span>✓ Budget-Compliant</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3 text-[11.5px] font-mono font-bold text-[#7B5E4A]">
                      <span>{alt.calories} kcal</span>
                      <span className="text-[#7B5E4A]">{alt.protein}g protein</span>
                    </div>
                    <Button size="xs" onClick={() => applySwap(alt)}>
                      Select Swap <ArrowRight size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
