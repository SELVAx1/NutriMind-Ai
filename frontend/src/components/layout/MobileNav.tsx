import { NavLink } from 'react-router-dom'
import { Home, CalendarDays, Camera, ShoppingCart, MoreHorizontal } from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  { icon: Home, label: 'Home', to: '/dashboard' },
  { icon: CalendarDays, label: 'Planner', to: '/planner' },
  { icon: Camera, label: 'Scan', to: '/food', center: true },
  { icon: ShoppingCart, label: 'Grocery', to: '/grocery' },
  { icon: MoreHorizontal, label: 'More', to: '/settings' },
]

export function MobileNav() {
  return (
    <nav className="app-mobile-nav fixed bottom-0 left-0 right-0 bg-surface-1 border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map(({ icon: Icon, label, to, center }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors py-1 px-3',
                center ? '' : isActive ? 'text-primary' : 'text-text-muted'
              )
            }
          >
            {center ? (
              <div className="w-12 h-12 -mt-5 rounded-full bg-accent flex items-center justify-center shadow-lg">
                <Icon size={22} className="text-white" />
              </div>
            ) : (
              <Icon size={22} />
            )}
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
