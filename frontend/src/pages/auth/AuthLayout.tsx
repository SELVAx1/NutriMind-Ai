import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4">
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-[0_2px_8px_rgba(16,185,129,0.3)]">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <span className="font-semibold text-[15px] tracking-tight">NutriMind</span>
          </Link>
          <p className="text-[12px] text-text-dim">AI-powered nutrition assistant</p>
        </div>
        {children}
      </div>
    </div>
  )
}
