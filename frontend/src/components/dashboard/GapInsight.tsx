import { Info } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface GapInsightProps {
  nutrient: string
  current: number
  target: number
  unit: string
  color?: string
}

export function GapInsight({ nutrient, current, target, unit, color = 'var(--color-protein)' }: GapInsightProps) {
  const percentage = Math.min((current / target) * 100, 100)

  return (
    <Card padding="sm">
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-semibold">Gap insight</span>
        <Info size={16} className="text-text-muted" />
      </div>
      <p className="text-sm text-text-secondary mb-2">
        {nutrient} may be below target.
      </p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-border-light overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>
        <span className="text-sm font-heading font-bold tabular-nums whitespace-nowrap">
          {current} / {target} {unit}
        </span>
      </div>
    </Card>
  )
}
