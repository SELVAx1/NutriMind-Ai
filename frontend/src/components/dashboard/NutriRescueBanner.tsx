import { AlertTriangle, ChevronRight } from 'lucide-react'

interface NutriRescueBannerProps {
  message: string
  detail?: string
  onClick?: () => void
}

export function NutriRescueBanner({ message, detail, onClick }: NutriRescueBannerProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20 text-left hover:bg-accent/15 transition-colors cursor-pointer"
    >
      <AlertTriangle size={20} className="text-accent flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text">{message}</p>
        {detail && <p className="text-xs text-text-secondary mt-0.5">{detail}</p>}
      </div>
      <ChevronRight size={18} className="text-text-muted flex-shrink-0" />
    </button>
  )
}
