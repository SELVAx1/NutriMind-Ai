import { Card } from '@/components/ui/Card'

interface StatCardProps { label: string; value: string; subtext?: string; color?: string }

export function StatCard({ label, value, subtext, color }: StatCardProps) {
  return (
    <Card padding="sm" hover>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-text-dim">{label}</span>
      <p className="text-xl font-bold mt-1 tabular-nums" style={{ color }}>{value}</p>
      {subtext && <span className="text-[10px] text-text-dim">{subtext}</span>}
    </Card>
  )
}
