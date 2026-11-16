import type { NutritionalValues } from '@/types/database'
import { calculateFoodNutrition } from '@/lib/nutrition'

export function NutritionPreview({
  nutritionalValues,
  quantityG,
}: {
  nutritionalValues: NutritionalValues
  quantityG: number
}) {
  const n = calculateFoodNutrition(nutritionalValues, quantityG)

  const items = [
    { label: 'Calories', val: `${n.calories} kcal`, color: 'text-[#3B2A20] bg-[#FAF7F0] border-[#D1B89A]' },
    { label: 'Protein', val: `${n.protein}g`, color: 'text-[#7B5E4A] bg-[#F2E7D5] border-[#D1B89A]' },
    { label: 'Carbs', val: `${n.carbs}g`, color: 'text-[#3B2A20] bg-[#FAF7F0] border-[#D1B89A]' },
    { label: 'Fat', val: `${n.fat}g`, color: 'text-[#A67C52] bg-[#FAF7F0] border-[#D1B89A]' },
    { label: 'Fibre', val: `${n.fibre}g`, color: 'text-[#7B5E4A] bg-[#F2E7D5] border-[#D1B89A]' },
    { label: 'Iron (Fe)', val: `${n.iron}mg`, color: 'text-[#3B2A20] bg-[#FAF7F0] border-[#D1B89A]' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 my-3">
      {items.map(item => (
        <div
          key={item.label}
          className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center ${item.color}`}
        >
          <span className="eyebrow-label text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          <span className="stat-small text-[18px] font-bold font-heading mt-0.5">{item.val}</span>
        </div>
      ))}
    </div>
  )
}
