import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { SearchCommandDialog } from '@/components/layout/SearchCommandDialog'
import { NotificationsPopover } from '@/components/layout/NotificationsPopover'
import {
  Search, ShieldCheck, Bell, Menu, Plus, Calendar
} from 'lucide-react'

interface HeaderProps {
  onToggleMobileMenu?: () => void
}

export function Header({ onToggleMobileMenu }: HeaderProps) {
  const { user } = useAuth()
  const { profile } = useProfile()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U'

  return (
    <header className="h-16 px-5 lg:px-8 border-b border-[#D1B89A]/40 bg-white flex items-center justify-between gap-4 shrink-0">
      {/* Mobile Menu Button */}
      <button
        onClick={onToggleMobileMenu}
        className="lg:hidden p-2 rounded-xl bg-[#FAF7F0] border border-[#D1B89A] text-[#3B2A20] hover:bg-[#F2E7D5]"
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Pill Search Bar (Matches PDF: "Search foods, logs, or ask a question...") */}
      <div className="flex-1 max-w-xl">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-[#FAF7F0] border border-[#D1B89A]/80 text-left hover:border-[#7B5E4A] hover:bg-white transition-all group shadow-2xs cursor-pointer"
        >
          <div className="flex items-center gap-2.5 text-[13px] text-[#7B5E4A]">
            <Search className="w-4 h-4 text-[#A67C52] group-hover:text-[#3B2A20] transition-colors" />
            <span className="truncate">Search foods, logs, or ask a question...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-medium text-[#7B5E4A] bg-[#F2E7D5] border border-[#D1B89A] px-2 py-0.5 rounded-md">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Action Badges and Profile (Matches PDF Top Bar) */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Safety-First Verified Badge (Matches PDF top bar right side) */}
        <Link
          to="/safety"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FAF7F0] border border-[#D1B89A] text-[10.5px] font-bold text-[#7B5E4A] hover:border-[#7B5E4A] transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#7B5E4A]" />
          <span className="tracking-wider">SAFETY-FIRST</span>
        </Link>

        {/* Date chip */}
        <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F2E7D5]/70 text-[11px] font-semibold text-[#7B5E4A]">
          <Calendar className="w-3.5 h-3.5 text-[#7B5E4A]" />
          <span>{todayDateStr}</span>
        </div>

        {/* Quick Log Meal */}
        <button
          onClick={() => navigate('/food')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#7B5E4A] hover:bg-[#3B2A20] text-white text-[11px] font-bold shadow-2xs transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Meal</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-xl bg-[#FAF7F0] border border-[#D1B89A]/80 text-[#7B5E4A] hover:text-[#3B2A20] hover:bg-[#F2E7D5] transition-all cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
          <NotificationsPopover isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        {/* User Pill */}
        <Link
          to="/profile"
          className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#FAF7F0] border border-[#D1B89A] hover:border-[#7B5E4A] transition-colors group"
        >
          <div className="w-7 h-7 rounded-full bg-[#3B2A20] text-[#F2E7D5] font-bold text-[11px] flex items-center justify-center">
            {initials}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[11.5px] font-bold text-[#3B2A20] leading-none">
              {displayName}
            </p>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#A67C52]">
              MEMBER
            </span>
          </div>
        </Link>
      </div>

      <SearchCommandDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
