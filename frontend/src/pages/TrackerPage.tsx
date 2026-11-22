import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTodaysLogs } from '@/hooks/useFoodLog'
import { useProfile } from '@/hooks/useProfile'
import { useCommonFoods, useFrequentFoods } from '@/hooks/useFood'
import { useClinicalSafety } from '@/hooks/useClinicalSafety'
import { calculateFoodNutrition, sumDailyNutrition } from '@/lib/nutrition'
import { Plus, Camera, Trash2, X, Pencil, Check } from 'lucide-react'
import { TrackerSkeleton } from '@/components/ui/Skeleton'
import type { DailyNutrition, FoodItem } from '@/types/database'

export function TrackerPage() {
  const { targets } = useProfile()
  const { logs, loading, logFood, updateLogItemQuantity, deleteLogItem } = useTodaysLogs()
  const { foods: commonFoods } = useCommonFoods()
  const { foods: frequentFoods } = useFrequentFoods()
  const { addAuditLog, runSafetyAudit } = useClinicalSafety()

  const [modalOpen, setModalOpen] = useState(false)
  const [targetMealSlot, setTargetMealSlot] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast')
  const [addingFood, setAddingFood] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editQuantity, setEditQuantity] = useState(0)

  const targetCalories = targets?.calories_kcal || 2000
  const targetProtein = targets?.protein_g || 60
  const targetCarbs = targets?.carbs_g || 250
  const targetFat = targets?.fat_g || 55

  const allItems: { id: string; name: string; nameTamil?: string; calories: number; protein: number; carbs: number; fat: number; mealType: string; quantity: number; nutrition: DailyNutrition }[] = []
  for (const log of logs) {
    for (const item of log.food_log_items) {
      const food = item.food_items
      if (!food?.nutritional_values) continue
      const n = calculateFoodNutrition(food.nutritional_values, item.quantity_g)
      allItems.push({
        id: item.id,
        name: food.name,
        nameTamil: food.name_tamil || undefined,
        calories: n.calories,
        protein: n.protein,
        carbs: n.carbs,
        fat: n.fat,
        mealType: log.meal_type,
        quantity: item.quantity_g,
        nutrition: n,
      })
    }
  }

  const dailyNutrition = sumDailyNutrition(allItems)
  const currentCalories = dailyNutrition.calories
  const currentProtein = dailyNutrition.protein
  const currentCarbs = dailyNutrition.carbs
  const currentFat = dailyNutrition.fat

  const calPct = targetCalories > 0 ? Math.min(100, Math.round((currentCalories / targetCalories) * 100)) : 0
  const proPct = targetProtein > 0 ? Math.min(100, Math.round((currentProtein / targetProtein) * 100)) : 0
  const carbPct = targetCarbs > 0 ? Math.min(100, Math.round((currentCarbs / targetCarbs) * 100)) : 0
  const fatPct = targetFat > 0 ? Math.min(100, Math.round((currentFat / targetFat) * 100)) : 0

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  const mealSlots: ('breakfast' | 'lunch' | 'dinner' | 'snack')[] = ['breakfast', 'lunch', 'dinner', 'snack']
  const mealLabels: Record<string, string> = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' }

  const handleOpenAddModal = (slot: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setTargetMealSlot(slot)
    setModalOpen(true)
  }

  const handleQuickAddFood = async (food: FoodItem) => {
    setAddingFood(true)
    try {
      await logFood(targetMealSlot, food.id, 150)

      if (food.nutritional_values) {
        const n = calculateFoodNutrition(food.nutritional_values, 150)
        const safety = runSafetyAudit(food.name)
        addAuditLog({
          food: food.name,
          meal: mealLabels[targetMealSlot] as any,
          calories: n.calories,
          protein: n.protein,
          safety: safety.safetyVerdict,
          safetyReason: safety.flags[0] || safety.cautions[0] || 'Clean match with clinical profile.',
          when: new Date().toISOString(),
          databaseSource: 'IFCT 2017',
          confidenceScore: safety.confidenceScore,
        })
      }

      setModalOpen(false)
    } catch (err) {
      console.error('Failed to log food:', err)
    } finally {
      setAddingFood(false)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteLogItem(itemId)
    } catch (err) {
      console.error('Failed to delete item:', err)
    }
  }

  const handleStartEdit = (itemId: string, currentQty: number) => {
    setEditingItemId(itemId)
    setEditQuantity(currentQty)
  }

  const handleSaveEdit = async (itemId: string) => {
    if (editQuantity < 1) return
    try {
      await updateLogItemQuantity(itemId, editQuantity)
    } catch (err) {
      console.error('Failed to update quantity:', err)
    }
    setEditingItemId(null)
  }

  if (loading) {
    return <TrackerSkeleton />
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#A67C52] block mb-1">
            FOOD DIARY
          </span>
          <h1 className="text-[28px] font-extrabold text-[#3B2A20] font-heading tracking-tight leading-tight">
            Meal log
          </h1>
          <p className="text-[13px] text-[#7B5E4A] mt-0.5">
            Log meals from the database, search, or add custom foods.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#FAF7F0] border border-[#D1B89A] px-3 py-1.5 rounded-xl">
            <span className="text-xs font-mono font-bold text-[#3B2A20]">{dateStr}</span>
          </div>
          <Link
            to="/food/log"
            className="px-3 py-1.5 rounded-xl bg-[#7B5E4A] hover:bg-[#3B2A20] text-white text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Plus size={14} /> Log Food
          </Link>
        </div>
      </div>

      {/* 4 Circular Stat Rings */}
      <div className="bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[12px] font-bold text-[#3B2A20]">Today</span>
          <span className="text-[11px] font-semibold text-[#7B5E4A]">
            {currentCalories} / {targetCalories} kcal
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Calories', value: currentCalories, target: targetCalories, unit: '', pct: calPct, color: '#7B5E4A' },
            { label: 'Protein', value: `${currentProtein}g`, target: `${targetProtein}g`, unit: '', pct: proPct, color: '#A67C52' },
            { label: 'Carbs', value: `${currentCarbs}g`, target: `${targetCarbs}g`, unit: '', pct: carbPct, color: '#3B2A20' },
            { label: 'Fat', value: `${currentFat}g`, target: `${targetFat}g`, unit: '', pct: fatPct, color: '#D1B89A' },
          ].map(ring => (
            <div key={ring.label} className="bg-white border border-[#D1B89A]/60 rounded-xl p-3.5 flex flex-col items-center text-center">
              <div className="relative w-16 h-16 flex items-center justify-center mb-1.5">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="26" stroke="#F2E7D5" strokeWidth="5" fill="transparent" />
                  <circle
                    cx="32" cy="32" r="26" stroke={ring.color} strokeWidth="5" fill="transparent"
                    strokeDasharray={163.3}
                    strokeDashoffset={163.3 - (163.3 * ring.pct) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center leading-none">
                  <span className="text-[13px] font-extrabold text-[#3B2A20]">{ring.value}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#7B5E4A] uppercase">{ring.label}</span>
              <span className="text-[9.5px] text-[#A67C52] font-semibold">/ {ring.target}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Meal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mealSlots.map((slot) => {
          const slotItems = allItems.filter(i => i.mealType === slot)
          const slotCals = slotItems.reduce((acc, i) => acc + i.calories, 0)
          const slotPro = slotItems.reduce((acc, i) => acc + i.protein, 0)

          return (
            <div key={slot} className="p-4 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#D1B89A]/40">
                <div>
                  <h3 className="text-[14px] font-bold text-[#3B2A20] font-heading">{mealLabels[slot]}</h3>
                  <span className="text-[10.5px] text-[#7B5E4A] font-semibold">
                    {slotCals} kcal &middot; {Math.round(slotPro * 10) / 10}g protein
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/food/analyze"
                    className="p-1.5 rounded-lg border border-[#D1B89A] bg-white hover:bg-[#F2E7D5] text-[#7B5E4A] transition-colors"
                    title="Scan food photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleOpenAddModal(slot)}
                    className="px-2.5 py-1 bg-white border border-[#D1B89A] hover:border-[#7B5E4A] hover:bg-[#7B5E4A] hover:text-white text-[#7B5E4A] text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {slotItems.length === 0 ? (
                <p className="text-[11.5px] text-[#7B5E4A] py-2 italic">Nothing logged yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {slotItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-white rounded-xl border border-[#D1B89A]/50 flex items-center justify-between text-xs"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#3B2A20] truncate">{item.name}</p>
                        {item.nameTamil && <span className="text-[9px] text-[#A67C52]">{item.nameTamil}</span>}
                        {editingItemId === item.id ? (
                          <div className="flex items-center gap-1.5 mt-1">
                            <input
                              type="number"
                              min={1}
                              max={2000}
                              value={editQuantity}
                              onChange={e => setEditQuantity(parseInt(e.target.value, 10) || 0)}
                              className="w-16 px-1.5 py-0.5 border border-[#D1B89A] rounded text-[11px] font-mono text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A]"
                              autoFocus
                              onKeyDown={e => { if (e.key === 'Enter') handleSaveEdit(item.id) }}
                            />
                            <span className="text-[10px] text-[#7B5E4A]">g</span>
                            <button
                              onClick={() => handleSaveEdit(item.id)}
                              className="p-0.5 rounded text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setEditingItemId(null)}
                              className="p-0.5 rounded text-[#7B5E4A] hover:bg-[#FAF7F0] cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#7B5E4A] block">
                            {item.quantity}g &middot; {item.calories} kcal &middot; {item.protein}g protein
                          </span>
                        )}
                      </div>
                      {editingItemId !== item.id && (
                        <div className="flex items-center gap-0.5 shrink-0 ml-2">
                          <button
                            onClick={() => handleStartEdit(item.id, item.quantity)}
                            className="p-1 rounded-lg text-[#A67C52] hover:text-[#3B2A20] hover:bg-[#FAF7F0] transition-colors cursor-pointer"
                            title="Edit portion"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 rounded-lg text-[#A67C52] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add Food Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3B2A20]/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-[#D1B89A] rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D1B89A]/40 mb-4">
              <div>
                <h3 className="font-extrabold text-[16px] text-[#3B2A20] font-heading">
                  Log Food for {mealLabels[targetMealSlot]}
                </h3>
                <p className="text-xs text-[#7B5E4A]">
                  Pick from the database or <Link to="/food/log" onClick={() => setModalOpen(false)} className="underline font-bold hover:text-[#3B2A20]">search & add custom foods</Link>.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-[#7B5E4A] hover:bg-[#FAF7F0] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {frequentFoods.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7B5E4A] block">
                    YOUR FREQUENT FOODS
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {frequentFoods.map((f) => {
                      const nv = f.nutritional_values
                      const cals = nv ? Math.round(nv.calories_per_100g * 1.5) : 0
                      const pro = nv ? Math.round(nv.protein_per_100g * 1.5 * 10) / 10 : 0
                      return (
                        <button
                          key={`freq-${f.id}`}
                          onClick={() => handleQuickAddFood(f)}
                          disabled={addingFood}
                          className="p-2.5 rounded-xl border-2 border-[#7B5E4A]/30 bg-[#F2E7D5] hover:bg-white hover:border-[#7B5E4A] transition-all text-left cursor-pointer flex flex-col justify-between disabled:opacity-50"
                        >
                          <span className="font-bold text-[12px] text-[#3B2A20] line-clamp-1">{f.name}</span>
                          {f.name_tamil && <span className="text-[10px] text-[#A67C52]">{f.name_tamil}</span>}
                          <span className="text-[10px] font-semibold text-[#7B5E4A] mt-1">
                            ~{cals} kcal &middot; {pro}g protein (150g)
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block">
                ALL FOODS ({commonFoods.length} items)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {commonFoods.map((f) => {
                  const nv = f.nutritional_values
                  const cals = nv ? Math.round(nv.calories_per_100g * 1.5) : 0
                  const pro = nv ? Math.round(nv.protein_per_100g * 1.5 * 10) / 10 : 0
                  return (
                    <button
                      key={f.id}
                      onClick={() => handleQuickAddFood(f)}
                      disabled={addingFood}
                      className="p-2.5 rounded-xl border border-[#D1B89A]/60 bg-[#FAF7F0] hover:bg-white hover:border-[#7B5E4A] transition-all text-left cursor-pointer flex flex-col justify-between disabled:opacity-50"
                    >
                      <span className="font-bold text-[12px] text-[#3B2A20] line-clamp-1">{f.name}</span>
                      {f.name_tamil && <span className="text-[10px] text-[#A67C52]">{f.name_tamil}</span>}
                      <span className="text-[10px] font-semibold text-[#7B5E4A] mt-1">
                        ~{cals} kcal &middot; {pro}g protein (150g)
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="pt-3 border-t border-[#D1B89A]/40 mt-4">
                <Link
                  to="/food/log"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#7B5E4A] hover:bg-[#3B2A20] text-white text-[12px] font-bold shadow-xs transition-all"
                  onClick={() => setModalOpen(false)}
                >
                  Search full database with portion control
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
