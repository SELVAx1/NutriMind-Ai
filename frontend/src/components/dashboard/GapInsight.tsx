interface GapInsightProps { nutrient: string; current: number; target: number; unit: string; color?: string }

export function GapInsight({ nutrient, current, target, unit, color = '#EF4444' }: GapInsightProps) {
  const p = target > 0 ? Math.min((current / target) * 100, 100) : 0
  return (
    <div>
      <div className="flex justify-between text-[12px] mb-1.5">
        <span className="text-text-secondary font-medium">{nutrient}</span>
        <span className="tabular-nums font-mono text-text-muted" style={{ color }}>{current} / {target} {unit}</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-3 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}
