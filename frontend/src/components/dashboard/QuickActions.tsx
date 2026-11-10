import { UtensilsCrossed, ShoppingCart, FlaskConical } from 'lucide-react'
import { Card } from '@/components/ui/Card'

const actions = [
  { icon: UtensilsCrossed, label: 'Log a meal', href: '/food' },
  { icon: ShoppingCart, label: 'Open grocery', href: '/grocery' },
  { icon: FlaskConical, label: 'Run a what-if', href: '/nutritwin' },
]

export function QuickActions() {
  return (
    <Card padding="sm">
      <span className="text-sm font-semibold mb-2 block">Quick actions</span>
      <div className="space-y-1">
        {actions.map(({ icon: Icon, label, href }) => (
          <a
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-border-light transition-colors text-sm text-text-secondary"
          >
            <Icon size={18} />
            {label}
          </a>
        ))}
      </div>
    </Card>
  )
}
