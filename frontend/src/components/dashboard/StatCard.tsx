import { Card } from '@/components/ui/Card'

interface StatCardProps {
  label: string
  value: string
  subtext?: string
  color?: string
}

export function StatCard({ label, value, subtext, color }: StatCardProps) {
  return (
    <Card padding="sm" className="flex flex-col gap-0.5">
      <span className="text-xs text-text-muted">{label}</span>
      <span className="font-heading text-xl font-bold tabular-nums" style={{ color }}>
        {value}
      </span>
      {subtext && <span className="text-xs text-text-secondary">{subtext}</span>}
    </Card>
  )
}
