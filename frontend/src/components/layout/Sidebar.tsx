import { NavLink } from 'react-router-dom'
import { Home, CalendarDays, MessageCircle, ShoppingCart, Stethoscope, MoreHorizontal, LogOut, BarChart3 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { clsx } from 'clsx'

const navItems = [
  { icon: Home, label: 'Home', to: '/dashboard' },
  { icon: CalendarDays, label: 'Planner', to: '/planner' },
  { icon: MessageCircle, label: 'Chat', to: '/chat' },
  { icon: ShoppingCart, label: 'Grocery', to: '/grocery' },
  { icon: BarChart3, label: 'NutriTwin', to: '/nutritwin' },
  { icon: Stethoscope, label: 'Nutritionist', to: '/nutritionist' },
  { icon: MoreHorizontal, label: 'More', to: '/settings' },
]

export function Sidebar() {
  const { user, signOut } = useAuth()

  return (
    <aside className="app-sidebar">
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-base font-bold">N</span>
          </div>
          <span className="font-heading font-bold text-xl text-primary">NutriMind</span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 mt-2">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:bg-border-light hover:text-text'
              )
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-text truncate">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</p>
            <p className="text-xs text-text-muted truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-1 text-sm text-text-muted hover:text-danger transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
