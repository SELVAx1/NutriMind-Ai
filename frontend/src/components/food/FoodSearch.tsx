import { useState } from 'react'
import { Search } from 'lucide-react'
import { useFoodSearch, useCommonFoods } from '@/hooks/useFood'
import type { FoodItem } from '@/types/database'
import { clsx } from 'clsx'

interface FoodSearchProps {
  onSelect: (food: FoodItem) => void
}

export function FoodSearch({ onSelect }: FoodSearchProps) {
  const [query, setQuery] = useState('')
  const { results, loading } = useFoodSearch(query)
  const { foods: commonFoods } = useCommonFoods()
  const [showDropdown, setShowDropdown] = useState(false)

  const displayItems = query.length >= 2 ? results : commonFoods.slice(0, 8)

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all">
        <Search size={18} className="text-text-muted flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowDropdown(true) }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search food... (idli, dosa, sambar)"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-text-muted"
        />
        {loading && (
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {showDropdown && displayItems.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-card rounded-xl border border-border shadow-lg max-h-64 overflow-y-auto">
          {query.length < 2 && (
            <div className="px-3 py-2 text-xs text-text-muted border-b border-border-light">Common foods</div>
          )}
          {displayItems.map((food) => (
            <button
              key={food.id}
              onClick={() => {
                onSelect(food)
                setQuery(food.name)
                setShowDropdown(false)
              }}
              className={clsx(
                'w-full px-3 py-2.5 text-left hover:bg-border-light transition-colors cursor-pointer',
                'flex items-center justify-between'
              )}
            >
              <div>
                <span className="text-sm font-medium">{food.name}</span>
                {food.name_tamil && (
                  <span className="font-tamil text-xs text-text-muted ml-2">{food.name_tamil}</span>
                )}
              </div>
              {food.nutritional_values && (
                <span className="text-xs text-text-muted">
                  {food.nutritional_values.calories_per_100g} kcal/100g
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
