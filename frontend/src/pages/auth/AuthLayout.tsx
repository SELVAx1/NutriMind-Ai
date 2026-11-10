import type { ReactNode } from 'react'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white text-xl font-bold">N</span>
            </div>
            <span className="font-heading font-bold text-2xl text-primary">NutriMind</span>
          </div>
          <p className="text-sm text-text-secondary">Eat well, within your budget.</p>
        </div>
        {children}
      </div>
    </div>
  )
}
