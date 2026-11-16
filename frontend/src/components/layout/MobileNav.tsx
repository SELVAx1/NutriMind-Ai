import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import {
  LayoutDashboard, BrainCircuit, Utensils, History, CalendarRange,
  TrendingUp, ShieldAlert, Activity, MessageSquareHeart, UserCheck,
  Sparkles, ShoppingBag, Stethoscope, LogOut, Apple, Camera, X
} from 'lucide-react'
import clsx from 'clsx'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

const NAV_ITEMS = [
  { name: 'Overview', to: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Intelligence', to: '/intelligence', icon: BrainCircuit, badge: 'AI' },
  { name: 'Meal Log', to: '/food', icon: Utensils },
  { name: 'Scan Plate AI', to: '/food/analyze', icon: Camera, badge: 'VISION' },
  { name: 'Logs & Audit Trail', to: '/audit', icon: History },
  { name: 'Meal Plans', to: '/planner', icon: CalendarRange },
  { name: 'Progress', to: '/progress', icon: TrendingUp },
  { name: 'Safety & Allergy Auditor', to: '/safety', icon: ShieldAlert, badge: 'SAFETY' },
  { name: 'Symptom Log', to: '/symptoms', icon: Activity },
  { name: 'AI Coach', to: '/chat', icon: MessageSquareHeart },
  { name: 'Clinical Profile', to: '/profile', icon: UserCheck },
  { name: 'NutriTwin & Simulator', to: '/nutritwin', icon: Sparkles },
  { name: 'Smart Grocery', to: '/grocery', icon: ShoppingBag },
]

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { user, signOut } = useAuth()
  const { profile } = useProfile()
  const navigate = useNavigate()

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const displayEmail = user?.email || 'Personal Account'

  const handleLogout = async () => {
    onClose()
    try {
      await signOut()
    } finally {
      navigate('/auth/login', { replace: true })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#3B2A20]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl p-5 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
        <div>
          <div className="flex items-center justify-between pb-4 mb-3 border-b border-[#D1B89A]/40">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#7B5E4A] to-[#3B2A20] flex items-center justify-center text-white shadow-md shadow-[#7B5E4A]/30">
                <Apple className="w-5 h-5 text-[#F2E7D5]" />
              </div>
              <span className="font-extrabold text-[15px] text-[#3B2A20] font-heading">
                Nutri<span className="text-[#7B5E4A]">Mind</span> AI
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#7B5E4A] hover:bg-[#F2E7D5]/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-semibold transition-colors',
                      isActive
                        ? 'bg-[#7B5E4A] text-white shadow-sm font-bold'
                        : 'text-[#7B5E4A] hover:text-[#3B2A20] hover:bg-[#F2E7D5]/50'
                    )
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F2E7D5] text-[#7B5E4A] border border-[#D1B89A]">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="pt-3 border-t border-[#D1B89A]/40 space-y-2">
          <div className="px-3 py-2 bg-[#FAF7F0] rounded-xl border border-[#D1B89A]/50">
            <p className="text-[11.5px] font-bold text-[#3B2A20]">{displayName}</p>
            <p className="text-[9.5px] text-[#7B5E4A]">{displayEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-bold text-[#8F3325] hover:bg-[#FDF0EE] rounded-xl cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-[#8F3325]" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
