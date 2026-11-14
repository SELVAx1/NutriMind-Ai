import { calculateFoodNutrition } from '@/lib/nutrition'
import type { NutritionalValues } from '@/types/database'
import { Card } from '@/components/ui/Card'

interface NutritionPreviewProps { nutritionalValues: NutritionalValues; quantityG: number }

export function NutritionPreview({ nutritionalValues, quantityG }: NutritionPreviewProps) {
  const n = calculateFoodNutrition(nutritionalValues, quantityG)
  const items = [
    { label: 'Calories', value: `${n.calories} kcal`, color: '#F59E0B' },
    { label: 'Protein', value: `${n.protein} g`, color: '#8B5CF6' },
    { label: 'Carbs', value: `${n.carbs} g`, color: '#3B82F6' },
    { label: 'Fat', value: `${n.fat} g`, color: '#EF4444' },
    { label: 'Fibre', value: `${n.fibre} g`, color: '#14B8A6' },
    { label: 'Iron', value: `${n.iron} mg`, color: '#F97316' },
  ]

  return (
    <Card padding="sm" className="bg-surface-2">
      <p className="text-[11px] text-text-muted mb-2.5 font-medium">Nutrition for {quantityG}g</p>
      <div className="grid grid-cols-3 gap-3">
        {items.map(({ label, value, color }) => (
          <div key={label} className="text-center">
            <div className="text-[13px] font-bold tabular-nums" style={{ color }}>{value}</div>
            <div className="text-[10px] text-text-dim">{label}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
