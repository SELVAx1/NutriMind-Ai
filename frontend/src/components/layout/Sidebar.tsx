import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import {
  LayoutDashboard, BrainCircuit, Utensils, History, CalendarRange,
  TrendingUp, ShieldAlert, Activity, MessageSquareHeart, UserCheck,
  Sparkles, ShoppingBag, LogOut, Apple, Camera
} from 'lucide-react'
import clsx from 'clsx'

const NAV_SECTIONS = [
  {
    title: 'NUTRITION & SAFETY',
    items: [
      { name: 'Overview', to: '/dashboard', icon: LayoutDashboard },
      { name: 'AI Intelligence', to: '/intelligence', icon: BrainCircuit, badge: 'AI' },
      { name: 'Meal Log', to: '/food', icon: Utensils },
      { name: 'Scan Plate AI', to: '/food/analyze', icon: Camera, badge: 'VISION' },
      { name: 'Logs & Audit Trail', to: '/audit', icon: History },
      { name: 'Meal Plans', to: '/planner', icon: CalendarRange },
      { name: 'Progress', to: '/progress', icon: TrendingUp },
    ],
  },
  {
    title: 'CLINICAL & SAFETY GUARD',
    items: [
      { name: 'Safety & Allergy Auditor', to: '/safety', icon: ShieldAlert, badge: 'SAFETY' },
      { name: 'Symptom Log', to: '/symptoms', icon: Activity },
      { name: 'AI Coach', to: '/chat', icon: MessageSquareHeart },
      { name: 'Clinical Profile', to: '/profile', icon: UserCheck },
    ],
  },
  {
    title: 'ADVANCED INTELLIGENCE',
    items: [
      { name: 'NutriTwin & Simulator', to: '/nutritwin', icon: Sparkles, badge: 'TWIN' },
      { name: 'Smart Grocery', to: '/grocery', icon: ShoppingBag },
    ],
  },
]

export function Sidebar() {
  const { user, signOut } = useAuth()
  const { profile } = useProfile()
  const navigate = useNavigate()

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initial = displayName.charAt(0).toUpperCase() || 'U'
  const displayEmail = user?.email || 'Personal Account'

  const handleLogout = async () => {
    try {
      await signOut()
    } finally {
      navigate('/auth/login', { replace: true })
    }
  }

  return (
    <aside className="w-64 bg-white border-r border-[#D1B89A]/50 flex flex-col shrink-0 min-h-screen py-5 px-3.5 select-none">
      {/* Brand Header */}
      <div className="px-2 mb-6">
        <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7B5E4A] to-[#3B2A20] flex items-center justify-center text-white shadow-md shadow-[#7B5E4A]/30 group-hover:scale-105 transition-transform">
            <Apple className="w-5 h-5 text-[#F2E7D5] stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-extrabold text-[15px] tracking-tight text-[#3B2A20] flex items-center gap-1 font-heading">
              Nutri<span className="text-[#7B5E4A]">Mind</span> AI
            </h1>
            <p className="text-[9px] font-bold text-[#A67C52] tracking-wider uppercase">
              NUTRITION INTELLIGENCE
            </p>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links Grouped by Section */}
      <nav className="flex-1 space-y-4 overflow-y-auto pr-1">
        {NAV_SECTIONS.map((sec) => (
          <div key={sec.title} className="space-y-1">
            <div className="px-3 py-1 text-[9.5px] font-extrabold uppercase tracking-wider text-[#A67C52]/80">
              {sec.title}
            </div>
            {sec.items.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      'sidebar-item flex items-center justify-between px-3 py-2 rounded-xl text-[13.5px] font-semibold transition-all duration-150',
                      isActive
                        ? 'bg-[#7B5E4A] text-white shadow-sm shadow-[#7B5E4A]/25 font-bold'
                        : 'text-[#7B5E4A] hover:text-[#3B2A20] hover:bg-[#F2E7D5]/50'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={clsx(
                            'w-4 h-4 shrink-0 transition-colors',
                            isActive ? 'text-[#FAF7F0]' : 'text-[#7B5E4A]'
                          )}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={clsx(
                            'text-[9px] uppercase font-black px-1.5 py-0.5 rounded-full shrink-0',
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-[#F2E7D5] text-[#7B5E4A] border border-[#D1B89A]'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Clinical Guidance Footnote (Matches PDF sidebar bottom) */}
      <div className="mt-4 pt-3 border-t border-[#D1B89A]/30 px-2 text-[10px] leading-tight text-[#7B5E4A]/80">
        Guidance only — not a substitute for medical advice. Consult a clinician for personal care.
      </div>

      {/* Bottom User Card & Log Out */}
      <div className="mt-3 pt-3 border-t border-[#D1B89A]/40 space-y-2">
        <NavLink
          to="/profile"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-[#FAF7F0] border border-[#D1B89A]/50 hover:border-[#7B5E4A] transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7B5E4A] to-[#A67C52] text-[#FAF7F0] font-bold flex items-center justify-center text-xs shadow-inner shrink-0">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-bold text-[#3B2A20] truncate">
              {displayName}
            </p>
            <p className="text-[9.5px] text-[#7B5E4A] truncate">
              MEMBER • {displayEmail}
            </p>
          </div>
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-bold text-[#8F3325] hover:bg-[#FDF0EE] transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-[#8F3325]" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  )
}
