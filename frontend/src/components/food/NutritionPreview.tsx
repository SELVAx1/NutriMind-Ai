import { calculateFoodNutrition } from '@/lib/nutrition'
import type { NutritionalValues } from '@/types/database'
import { Card } from '@/components/ui/Card'

interface NutritionPreviewProps {
  nutritionalValues: NutritionalValues
  quantityG: number
}

export function NutritionPreview({ nutritionalValues, quantityG }: NutritionPreviewProps) {
  const n = calculateFoodNutrition(nutritionalValues, quantityG)

  const items = [
    { label: 'Calories', value: `${n.calories} kcal`, color: 'var(--color-text)' },
    { label: 'Protein', value: `${n.protein} g`, color: 'var(--color-protein)' },
    { label: 'Carbs', value: `${n.carbs} g`, color: 'var(--color-carbs)' },
    { label: 'Fat', value: `${n.fat} g`, color: 'var(--color-fat)' },
    { label: 'Fibre', value: `${n.fibre} g`, color: 'var(--color-fibre)' },
    { label: 'Iron', value: `${n.iron} mg`, color: 'var(--color-danger)' },
  ]

  return (
    <Card padding="sm" className="bg-border-light/50">
      <p className="text-xs text-text-muted mb-2">Nutrition for {quantityG}g</p>
      <div className="grid grid-cols-3 gap-2">
        {items.map(({ label, value, color }) => (
          <div key={label} className="text-center">
            <div className="font-heading font-bold text-sm tabular-nums" style={{ color }}>{value}</div>
            <div className="text-[10px] text-text-muted">{label}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
