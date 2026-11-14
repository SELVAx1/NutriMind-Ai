import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Utensils, CalendarRange, MessageSquareText,
  ShoppingBasket, BarChart3, Scan, Stethoscope, Settings, LogOut, ChevronRight
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { clsx } from 'clsx'

const mainNav = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: Utensils, label: 'Food Log', to: '/food' },
  { icon: CalendarRange, label: 'Meal Plan', to: '/planner' },
  { icon: MessageSquareText, label: 'AI Chat', to: '/chat' },
  { icon: ShoppingBasket, label: 'Grocery', to: '/grocery' },
  { icon: BarChart3, label: 'Analytics', to: '/nutritwin' },
  { icon: Scan, label: 'Scan Food', to: '/food/analyze' },
]

const secondaryNav = [
  { icon: Stethoscope, label: 'Nutritionist', to: '/nutritionist' },
  { icon: Settings, label: 'Settings', to: '/settings' },
]

function NavItem({ icon: Icon, label, to }: { icon: typeof LayoutDashboard; label: string; to: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 h-9 px-3 rounded-lg text-[13px] font-medium transition-all duration-150',
          isActive
            ? 'bg-primary/15 text-primary'
            : 'text-text-muted hover:text-text-secondary hover:bg-surface-2'
        )
      }
    >
      <Icon size={17} strokeWidth={1.8} />
      <span>{label}</span>
    </NavLink>
  )
}

export function Sidebar() {
  const { user, signOut } = useAuth()
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initial = name.charAt(0).toUpperCase()

  return (
    <aside className="app-sidebar">
      {/* Branding */}
      <div className="flex items-center justify-between h-14 px-5 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-[0_2px_8px_rgba(16,185,129,0.3)]">
            <span className="text-white text-[11px] font-bold">N</span>
          </div>
          <span className="font-semibold text-[15px] text-text tracking-tight">NutriMind</span>
        </div>
        <ChevronRight size={14} className="text-text-dim" />
      </div>

      {/* Primary navigation */}
      <div className="px-3 pt-4 pb-2">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-dim">Main</p>
        <nav className="flex flex-col gap-0.5">
          {mainNav.map(item => <NavItem key={item.to} {...item} />)}
        </nav>
      </div>

      {/* Secondary navigation */}
      <div className="px-3 py-2 mt-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-dim">Other</p>
        <nav className="flex flex-col gap-0.5">
          {secondaryNav.map(item => <NavItem key={item.to} {...item} />)}
        </nav>
      </div>

      {/* User section */}
      <div className="px-3 py-3 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-2.5 px-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center flex-shrink-0 border border-border">
            <span className="text-text-secondary text-xs font-semibold">{initial}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-text truncate">{name}</p>
            <p className="text-[10px] text-text-dim truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2.5 h-8 w-full px-3 rounded-lg text-[12px] font-medium text-text-dim hover:text-red-400 hover:bg-red-500/15 transition-all cursor-pointer"
        >
          <LogOut size={14} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}
