import { useState } from 'react'
import { Search } from 'lucide-react'
import { useFoodSearch, useCommonFoods } from '@/hooks/useFood'
import type { FoodItem } from '@/types/database'

interface FoodSearchProps { onSelect: (food: FoodItem) => void }

export function FoodSearch({ onSelect }: FoodSearchProps) {
  const [query, setQuery] = useState('')
  const { results, loading } = useFoodSearch(query)
  const { foods: commonFoods } = useCommonFoods()
  const [showDropdown, setShowDropdown] = useState(false)
  const displayItems = query.length >= 2 ? results : commonFoods.slice(0, 8)

  return (
    <div className="relative">
      <div className="flex items-center gap-2.5 h-10 px-4 rounded-lg bg-surface-2 border border-border focus-within:ring-2 focus-within:ring-ring focus-within:border-primary/50 transition-all">
        <Search size={16} className="text-text-dim flex-shrink-0" />
        <input type="text" value={query}
          onChange={e => { setQuery(e.target.value); setShowDropdown(true) }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search food... (idli, dosa, sambar)"
          className="flex-1 bg-transparent outline-none text-[13px] text-text placeholder:text-text-dim" />
        {loading && <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
      </div>
      {showDropdown && displayItems.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-surface-1 rounded-lg border border-border shadow-[0_8px_24px_rgba(0,0,0,0.5)] max-h-60 overflow-y-auto">
          {query.length < 2 && <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-text-dim border-b border-border">Common foods</div>}
          {displayItems.map(food => (
            <button key={food.id}
              onClick={() => { onSelect(food); setQuery(food.name); setShowDropdown(false) }}
              className="w-full px-3 py-2.5 text-left hover:bg-surface-2 transition-colors cursor-pointer flex items-center justify-between">
              <div>
                <span className="text-[13px] font-medium text-text">{food.name}</span>
                {food.name_tamil && <span className="font-tamil text-[11px] text-text-dim ml-2">{food.name_tamil}</span>}
              </div>
              {food.nutritional_values && <span className="text-[10px] text-text-dim font-mono tabular-nums">{food.nutritional_values.calories_per_100g} kcal/100g</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
