import { Utensils, ShoppingBasket, FlaskConical, Scan } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Link } from 'react-router-dom'

const actions = [
  { icon: Utensils, label: 'Log meal', to: '/food', color: 'text-emerald-400' },
  { icon: Scan, label: 'Scan food', to: '/food/analyze', color: 'text-amber-400' },
  { icon: ShoppingBasket, label: 'Grocery', to: '/grocery', color: 'text-blue-400' },
  { icon: FlaskConical, label: 'What-if', to: '/nutritwin', color: 'text-teal-400' },
]

export function QuickActions() {
  return (
    <Card padding="md">
      <h3 className="text-[13px] font-semibold mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map(({ icon: Icon, label, to, color }) => (
          <Link key={to} to={to} className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-2 border border-border hover:border-text-dim/40 hover:bg-surface-3 transition-all">
            <Icon size={16} className={color} />
            <span className="text-[12px] font-medium text-text-secondary">{label}</span>
          </Link>
        ))}
      </div>
    </Card>
  )
}
