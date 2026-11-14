import { AlertTriangle, ChevronRight } from 'lucide-react'

interface NutriRescueBannerProps { message: string; detail?: string; onClick?: () => void }

export function NutriRescueBanner({ message, detail, onClick }: NutriRescueBannerProps) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 p-4 rounded-xl bg-amber-500/15 border border-amber-500/20 text-left hover:bg-amber-500/15 transition-all cursor-pointer">
      <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
        <AlertTriangle size={17} className="text-amber-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-text">{message}</p>
        {detail && <p className="text-[10px] text-text-muted mt-0.5">{detail}</p>}
      </div>
      <ChevronRight size={14} className="text-text-dim flex-shrink-0" />
    </button>
  )
}
