import { Bell, Search } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export function Header() {
  const { user } = useAuth()
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <header className="flex items-center justify-between py-5">
      <div className="md:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <span className="font-heading font-bold text-primary">NutriMind</span>
        </div>
      </div>

      <div className="hidden md:block">
        <h1 className="text-2xl font-heading font-bold">
          {greeting}, {name}!
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-sm text-text-muted min-w-[240px]">
          <Search size={16} />
          <span>Search meals, nutrients...</span>
        </div>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-border-light transition-colors cursor-pointer">
          <Bell size={20} className="text-text-secondary" />
        </button>
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <span className="text-white text-sm font-bold">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  )
}
