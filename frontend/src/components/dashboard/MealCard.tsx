import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Clock, Flame, IndianRupee } from 'lucide-react'

interface MealCardProps {
  name: string
  nameTamil?: string
  calories: number
  protein: number
  cost: number
  prepTime: number
  tags: string[]
  imageUrl?: string
  onSwap?: () => void
}

export function MealCard({
  name,
  nameTamil,
  calories,
  protein,
  cost,
  prepTime,
  tags,
  imageUrl,
  onSwap,
}: MealCardProps) {
  return (
    <Card padding="sm" className="flex gap-4">
      <div className="w-24 h-24 rounded-xl bg-border-light flex-shrink-0 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">🍛</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-semibold text-base truncate">{name}</h3>
        {nameTamil && (
          <p className="font-tamil text-sm text-text-secondary truncate">{nameTamil}</p>
        )}
        <div className="flex items-center gap-3 mt-1.5 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <Flame size={13} /> {calories} kcal
          </span>
          <span className="flex items-center gap-1 text-protein font-medium">
            {protein}g protein
          </span>
          <span className="flex items-center gap-1">
            <IndianRupee size={12} />{cost}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} /> {prepTime} min
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant={
                tag === 'Vegan' || tag === 'Vegetarian' ? 'vegan' :
                tag === 'High protein' ? 'protein' :
                tag === 'Budget friendly' ? 'budget' :
                tag === 'Quick' ? 'quick' : 'default'
              }
            >
              {tag}
            </Badge>
          ))}
          {onSwap && (
            <Button variant="secondary" size="sm" onClick={onSwap}>
              Swap
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
