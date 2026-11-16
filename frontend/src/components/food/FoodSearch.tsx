import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useFoodSearch } from '@/hooks/useFood'
import type { FoodItem } from '@/types/database'

export function FoodSearch({ onSelect }: { onSelect: (food: FoodItem) => void }) {
  const { query, setQuery, results, loading } = useFoodSearch()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search Indian dishes (e.g., Idli, Dosa, Ragi, Palak...)"
          className="w-full h-12 pl-11 pr-10 rounded-2xl bg-[#FAF7F0] border border-[#D1B89A] text-[14px] text-[#3B2A20] placeholder:text-[#A67C52]/60 focus:bg-white focus:border-[#7B5E4A] focus:ring-3 focus:ring-[#7B5E4A]/15 transition-all outline-none"
        />
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B5E4A]" />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-xl text-[#7B5E4A] hover:bg-white cursor-pointer"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {isOpen && (results.length > 0 || loading) && (
        <div className="absolute top-14 left-0 right-0 z-50 bg-white border border-[#D1B89A] rounded-3xl shadow-[0_20px_50px_rgba(59,42,32,0.12)] overflow-hidden max-h-72 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center text-[12px] font-semibold text-[#7B5E4A]">
              Searching IFCT 2017 database...
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="p-4 text-center text-[12px] text-[#7B5E4A]">
              No matching Indian foods found.
            </div>
          )}

          {!loading &&
            results.map(food => (
              <div
                key={food.id}
                onClick={() => {
                  onSelect(food)
                  setIsOpen(false)
                  setQuery('')
                }}
                className="p-3.5 hover:bg-[#FAF7F0] flex items-center justify-between cursor-pointer border-b border-[#D1B89A]/30 last:border-none transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#3B2A20]">{food.name}</span>
                    {food.name_tamil && (
                      <span className="font-tamil text-[11px] text-[#A67C52] font-semibold">
                        {food.name_tamil}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#7B5E4A] tracking-wider">
                    {food.category || 'Standard Food'}
                  </span>
                </div>

                {food.nutritional_values && (
                  <div className="text-right flex items-center gap-2 font-mono text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-[#FAF7F0] text-[#7B5E4A] border border-[#D1B89A]/60">
                      {food.nutritional_values.calories_per_100g} kcal
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#F2E7D5] text-[#3B2A20] font-bold border border-[#D1B89A]">
                      {food.nutritional_values.protein_per_100g}g pro
                    </span>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
