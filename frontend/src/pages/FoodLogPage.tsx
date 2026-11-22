import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FoodSearch } from '@/components/food/FoodSearch'
import { NutritionPreview } from '@/components/food/NutritionPreview'
import { useTodaysLogs } from '@/hooks/useFoodLog'
import { useClinicalSafety } from '@/hooks/useClinicalSafety'
import { calculateFoodNutrition } from '@/lib/nutrition'
import type { FoodItem, NutritionalValues } from '@/types/database'
import { Check, Utensils, Scale, ArrowLeft, Camera, Plus, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

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
  const { addAuditLog, runSafetyAudit } = useClinicalSafety()
  const [mealType, setMealType] = useState('breakfast')
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [quantity, setQuantity] = useState(150)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Custom food creation state
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customCalories, setCustomCalories] = useState('')
  const [customProtein, setCustomProtein] = useState('')
  const [customCarbs, setCustomCarbs] = useState('')
  const [customFat, setCustomFat] = useState('')
  const [creatingCustom, setCreatingCustom] = useState(false)

  function handleCreateCustomPrompt(name: string) {
    setCustomName(name)
    setShowCustomForm(true)
  }

  async function handleCreateCustomFood(e: FormEvent) {
    e.preventDefault()
    if (!customName.trim()) return
    setCreatingCustom(true)
    setError('')

    try {
      const { data: foodData, error: foodErr } = await supabase
        .from('food_items')
        .insert({
          name: customName.trim(),
          category: 'Custom',
          source: 'manual',
          is_common: false,
        })
        .select()
        .single()

      if (foodErr || !foodData) throw foodErr || new Error('Failed to create food')

      const cal = parseFloat(customCalories) || 0
      const pro = parseFloat(customProtein) || 0
      const carb = parseFloat(customCarbs) || 0
      const fat = parseFloat(customFat) || 0

      if (cal > 0 || pro > 0 || carb > 0 || fat > 0) {
        await supabase.from('nutritional_values').insert({
          food_item_id: foodData.id,
          calories_per_100g: cal,
          protein_per_100g: pro,
          carbs_per_100g: carb,
          fat_per_100g: fat,
          fibre_per_100g: 0,
          iron_mg: 0,
          calcium_mg: 0,
          vitamin_b12_mcg: 0,
          vitamin_c_mg: 0,
          potassium_mg: 0,
        })
      }

      const nv: NutritionalValues = {
        id: '',
        food_item_id: foodData.id,
        calories_per_100g: cal,
        protein_per_100g: pro,
        carbs_per_100g: carb,
        fat_per_100g: fat,
        fibre_per_100g: 0,
        iron_mg: 0,
        calcium_mg: 0,
        vitamin_b12_mcg: 0,
        vitamin_c_mg: 0,
        potassium_mg: 0,
      }

      setSelectedFood({
        ...foodData,
        nutritional_values: nv,
      } as FoodItem)

      setShowCustomForm(false)
      setCustomName('')
      setCustomCalories('')
      setCustomProtein('')
      setCustomCarbs('')
      setCustomFat('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create custom food')
    } finally {
      setCreatingCustom(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!selectedFood) return
    setLoading(true)
    setError('')

    try {
      await logFood(mealType, selectedFood.id, quantity)

      if (selectedFood.nutritional_values) {
        const n = calculateFoodNutrition(selectedFood.nutritional_values, quantity)
        const safety = runSafetyAudit(selectedFood.name)
        const mealLabel = MEAL_TYPES.find(m => m.value === mealType)?.label || 'Lunch'
        addAuditLog({
          food: selectedFood.name,
          meal: mealLabel as any,
          calories: n.calories,
          protein: n.protein,
          safety: safety.safetyVerdict,
          safetyReason: safety.flags[0] || safety.cautions[0] || 'Clean match with clinical profile.',
          when: new Date().toISOString(),
          databaseSource: 'IFCT 2017',
          confidenceScore: safety.confidenceScore,
        })
      }

      setSuccess(true)
      setTimeout(() => navigate('/food'), 1200)
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
        <h2 className="text-[28px] font-extrabold text-[#3B2A20] mb-1 font-heading">Meal Logged</h2>
        <p className="text-[14px] text-[#7B5E4A]">
          <span className="font-bold text-[#3B2A20]">{selectedFood?.name}</span> ({quantity}g) recorded.
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
            to="/food"
            className="p-2.5 rounded-2xl bg-[#FAF7F0] border border-[#D1B89A] hover:bg-[#F2E7D5] text-[#7B5E4A] hover:text-[#3B2A20] transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-[28px] font-extrabold text-[#3B2A20] font-heading">Record Food Intake</h1>
            <p className="text-[11.5px] text-[#7B5E4A]">Search the database or add custom foods</p>
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
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7B5E4A] mb-3">
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

        {/* Food Search */}
        <Card padding="md" className="bg-white border-[#D1B89A]/60">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7B5E4A] mb-2.5">
            Search Food or Dish
          </label>
          <FoodSearch onSelect={setSelectedFood} onCreateCustom={handleCreateCustomPrompt} />

          {selectedFood && (
            <div className="mt-4 p-4 rounded-2xl bg-[#FAF7F0] border border-[#D1B89A] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🍛</span>
                <div>
                  <h4 className="text-[15px] font-bold text-[#3B2A20] font-heading">{selectedFood.name}</h4>
                  {selectedFood.name_tamil && (
                    <span className="text-[11px] text-[#A67C52]">{selectedFood.name_tamil}</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFood(null)}
                className="p-1.5 rounded-lg text-[#7B5E4A] hover:bg-white hover:text-rose-600 cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </Card>

        {/* Custom Food Creation Form */}
        {showCustomForm && (
          <Card padding="md" className="bg-white border-[#7B5E4A]/40 border-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Plus size={16} className="text-[#7B5E4A]" />
                <h3 className="text-[14px] font-bold text-[#3B2A20] font-heading">Add Custom Food</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="p-1 rounded-lg text-[#7B5E4A] hover:bg-[#FAF7F0] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-[#7B5E4A] uppercase mb-1">Food Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  className="w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-xl px-3 py-2.5 text-[13px] text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A]"
                />
              </div>
              <p className="text-[10px] text-[#7B5E4A]">Nutrition per 100g (optional — leave blank if unknown)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#7B5E4A] uppercase mb-1">Calories</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={customCalories}
                    onChange={e => setCustomCalories(e.target.value)}
                    placeholder="kcal"
                    className="w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-xl px-3 py-2 text-[13px] text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A] placeholder:text-[#A67C52]/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#7B5E4A] uppercase mb-1">Protein (g)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={customProtein}
                    onChange={e => setCustomProtein(e.target.value)}
                    placeholder="g"
                    className="w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-xl px-3 py-2 text-[13px] text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A] placeholder:text-[#A67C52]/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#7B5E4A] uppercase mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={customCarbs}
                    onChange={e => setCustomCarbs(e.target.value)}
                    placeholder="g"
                    className="w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-xl px-3 py-2 text-[13px] text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A] placeholder:text-[#A67C52]/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#7B5E4A] uppercase mb-1">Fat (g)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={customFat}
                    onChange={e => setCustomFat(e.target.value)}
                    placeholder="g"
                    className="w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-xl px-3 py-2 text-[13px] text-[#3B2A20] focus:outline-none focus:border-[#7B5E4A] placeholder:text-[#A67C52]/50"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleCreateCustomFood}
                disabled={!customName.trim() || creatingCustom}
                className="w-full py-2.5 rounded-xl bg-[#7B5E4A] hover:bg-[#3B2A20] text-white text-[13px] font-bold transition-colors disabled:opacity-50 cursor-pointer"
              >
                {creatingCustom ? 'Creating...' : 'Create & Select'}
              </button>
            </div>
          </Card>
        )}

        {/* Portion Selector */}
        {selectedFood && (
          <Card padding="md" className="bg-white border-[#D1B89A]/60">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#7B5E4A] flex items-center gap-1.5">
                <Scale size={14} className="text-[#7B5E4A]" /> Portion Size
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={10}
                  max={2000}
                  step={10}
                  value={quantity}
                  onChange={e => {
                    const v = parseInt(e.target.value, 10)
                    if (!isNaN(v) && v > 0) setQuantity(v)
                  }}
                  className="w-20 text-right font-mono text-base font-black text-[#3B2A20] bg-[#FAF7F0] border border-[#D1B89A] rounded-lg px-2 py-1 focus:outline-none focus:border-[#7B5E4A]"
                />
                <span className="text-xs text-[#7B5E4A]">grams</span>
              </div>
            </div>

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

            <input
              type="range"
              min="10"
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

        {/* Submit */}
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
