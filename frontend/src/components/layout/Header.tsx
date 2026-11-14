import { Bell, Search } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export function Header() {
  const { user } = useAuth()
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'
  const initial = name.charAt(0).toUpperCase()

  return (
    <header className="flex items-center justify-between h-14 px-6 md:px-7 lg:px-8 border-b border-border bg-surface-0/80 backdrop-blur-sm sticky top-0 z-30">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
          <span className="text-white text-[11px] font-bold">N</span>
        </div>
        <span className="font-semibold text-sm">NutriMind</span>
      </div>

      {/* Spacer on desktop (page title goes in page content) */}
      <div className="hidden md:block" />

      {/* Global search */}
      <div className="hidden md:flex flex-1 max-w-lg mx-6">
        <button className="flex items-center w-full gap-2.5 h-9 px-3.5 rounded-lg bg-surface-2 border border-border text-text-muted text-[13px] hover:border-text-dim/60 hover:bg-surface-3 transition-all cursor-pointer">
          <Search size={15} strokeWidth={1.8} />
          <span className="flex-1 text-left">Search meals, nutrients, foods...</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-surface-1 border border-border font-mono text-text-dim">⌘K</kbd>
        </button>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 rounded-lg bg-surface-2 border border-border flex items-center justify-center hover:bg-surface-3 hover:border-text-dim/50 transition-all cursor-pointer">
          <Bell size={16} strokeWidth={1.8} className="text-text-muted" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary" />
        </button>
        <div className="w-9 h-9 rounded-lg bg-surface-3 border border-border flex items-center justify-center">
          <span className="text-text-secondary text-xs font-semibold">{initial}</span>
        </div>
      </div>
    </header>
  )
}
