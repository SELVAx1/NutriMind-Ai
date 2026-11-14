import { Badge } from '@/components/ui/Badge'
import { Clock, Flame, IndianRupee, ArrowRightLeft } from 'lucide-react'

interface MealCardProps {
  name: string; nameTamil?: string; calories: number; protein: number
  cost: number; prepTime: number; tags: string[]; imageUrl?: string; onSwap?: () => void
}

export function MealCard({ name, nameTamil, calories, protein, cost, prepTime, tags, onSwap }: MealCardProps) {
  return (
    <div className="flex gap-4 items-center p-4 rounded-xl bg-surface-1 border border-border hover:border-text-dim/40 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
      <div className="w-14 h-14 rounded-lg bg-surface-3 flex items-center justify-center text-xl flex-shrink-0">🍛</div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold truncate">{name}</p>
        {nameTamil && <p className="font-tamil text-[11px] text-text-dim truncate">{nameTamil}</p>}
        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-text-muted">
          <span className="flex items-center gap-1"><Flame size={11} className="text-amber-400" />{calories}</span>
          <span className="text-violet-400 font-semibold">{protein}g</span>
          <span className="flex items-center gap-0.5"><IndianRupee size={10} />{cost}</span>
          <span className="flex items-center gap-1"><Clock size={11} />{prepTime}m</span>
        </div>
        {tags.length > 0 && (
          <div className="flex gap-1 mt-1.5">
            {tags.slice(0, 3).map(t => <Badge key={t} variant={
              t === 'Vegan' || t === 'Vegetarian' ? 'vegan' : t === 'High protein' ? 'protein' : t === 'Budget friendly' ? 'budget' : t === 'Quick' ? 'quick' : 'default'
            }>{t}</Badge>)}
          </div>
        )}
      </div>
      {onSwap && (
        <button onClick={onSwap} className="w-8 h-8 rounded-lg bg-surface-2 border border-border text-text-dim hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer flex items-center justify-center flex-shrink-0">
          <ArrowRightLeft size={13} />
        </button>
      )}
    </div>
  )
}
