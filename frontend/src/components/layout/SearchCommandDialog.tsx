import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import {
  Search, X, Utensils, Camera, CalendarRange, MessageSquareText,
  ShoppingBag, Sparkles, Settings, ArrowRight
} from 'lucide-react'

interface SearchCommandDialogProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchFood {
  id: string
  name: string
  name_tamil?: string
  category?: string
  nutritional_values?: { calories_per_100g: number; protein_per_100g: number } | null
}

const QUICK_ACTIONS = [
  { label: 'Overview Dashboard', desc: 'Intake balance and safety monitoring', icon: Utensils, to: '/dashboard' },
  { label: 'AI Intelligence Engine', desc: 'Describe meals & nutrient glossary', icon: Sparkles, to: '/intelligence' },
  { label: 'Meal Diary & Log', desc: 'Add food entries & calculate macros', icon: Utensils, to: '/food' },
  { label: 'Scan Food with AI', desc: 'Identify food & portions from photo', icon: Camera, to: '/food/analyze' },
  { label: 'Logs & Audit Trail', desc: 'Safety audit trail, CSV & weekly email recap', icon: Utensils, to: '/audit' },
  { label: 'Meal Plans & Swaps', desc: 'Budget & allergy constrained plans', icon: CalendarRange, to: '/planner' },
  { label: 'Progress & Measurements', desc: 'Weight, waist & energy tracking', icon: Sparkles, to: '/progress' },
  { label: 'Safety & Allergy Auditor', desc: 'Clinical allergen guard & drug interactions', icon: Sparkles, to: '/safety' },
  { label: 'Symptom Log', desc: 'Track food reactions & clinical escalation', icon: Sparkles, to: '/symptoms' },
  { label: 'AI Coach (Voice & Multilingual)', desc: 'Conversational assistant in Indian languages', icon: MessageSquareText, to: '/chat' },
  { label: 'NutriTwin & Recovery', desc: 'What-if simulator & NutriRescue cheat recovery', icon: Sparkles, to: '/nutritwin' },
  { label: 'Smart Grocery & Pantry', desc: 'Aisle checklist, expiry tracker & Fridge-to-Meal', icon: ShoppingBag, to: '/grocery' },
  { label: 'Nutritionist Dashboard', desc: 'Patient roster, plan approval & clinical reports', icon: Sparkles, to: '/nutritionist' },
  { label: 'Clinical Profile', desc: 'ICMR targets, regional cuisines & diet style', icon: Settings, to: '/profile' },
]

export function SearchCommandDialog({ isOpen, onClose }: SearchCommandDialogProps) {
  const [query, setQuery] = useState('')
  const [foodResults, setFoodResults] = useState<SearchFood[]>([])
  const [searching, setSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
      setFoodResults([])
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setFoodResults([])
      return
    }
    const timer = setTimeout(async () => {
      setSearching(true)
      const { data } = await supabase
        .from('food_items')
        .select('id, name, name_tamil, category, nutritional_values(calories_per_100g, protein_per_100g)')
        .ilike('name', `%${query}%`)
        .limit(10)
      setFoodResults((data as SearchFood[]) || [])
      setSearching(false)
    }, 250)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
        else {
          const btn = document.querySelector('[aria-label="Open search dialog"]') as HTMLElement
          if (btn) btn.click()
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const filteredActions = QUICK_ACTIONS.filter(
    a => a.label.toLowerCase().includes(query.toLowerCase()) ||
         a.desc.toLowerCase().includes(query.toLowerCase())
  )

  const filteredFoods = foodResults

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 bg-[#3B2A20]/40 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4"
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search food and navigation commands"
        className="w-full max-w-2xl rounded-3xl bg-white border border-[#D1B89A] shadow-[0_24px_70px_rgba(59,42,32,0.14)] overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Box */}
        <div className="flex items-center gap-3 px-6 py-4.5 border-b border-[#D1B89A]/40 bg-[#FAF7F0]">
          <Search size={20} className="text-[#7B5E4A] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Indian foods, macros, meal swaps..."
            className="flex-1 bg-transparent border-none outline-none text-[#3B2A20] text-[15px] font-medium placeholder:text-[#A67C52]/60"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 rounded-xl text-[#7B5E4A] hover:text-[#3B2A20] hover:bg-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#F2E7D5] border border-[#D1B89A] text-[#7B5E4A]">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 flex flex-col gap-4">
          {/* Quick Actions */}
          {filteredActions.length > 0 && (
            <div>
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#7B5E4A]">Quick Actions</p>
              <div className="flex flex-col gap-1">
                {filteredActions.map(action => {
                  const Icon = action.icon
                  return (
                    <button
                      key={action.to}
                      onClick={() => {
                        navigate(action.to)
                        onClose()
                      }}
                      className="flex items-center gap-3 p-3 rounded-2xl text-left hover:bg-[#FAF7F0] border border-transparent hover:border-[#D1B89A]/60 transition-all group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#F2E7D5] text-[#7B5E4A] flex items-center justify-center shrink-0 group-hover:bg-[#7B5E4A] group-hover:text-white transition-colors">
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-bold text-[#3B2A20] group-hover:text-[#7B5E4A] transition-colors">{action.label}</p>
                        <p className="text-[11.5px] text-[#7B5E4A] truncate">{action.desc}</p>
                      </div>
                      <ArrowRight size={14} className="text-[#7B5E4A] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* IFCT Foods from Database */}
          {filteredFoods.length > 0 && (
            <div>
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#7B5E4A]">IFCT 2017 Indian Dishes & Ingredients</p>
              <div className="flex flex-col gap-1">
                {filteredFoods.map(food => {
                  const nv = food.nutritional_values
                  const cal = nv ? Math.round(nv.calories_per_100g) : 0
                  const pro = nv ? `${Math.round(nv.protein_per_100g * 10) / 10}g` : '—'
                  return (
                    <button
                      key={food.id}
                      onClick={() => {
                        navigate('/food/log')
                        onClose()
                      }}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#FAF7F0] border border-transparent hover:border-[#D1B89A]/60 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#F2E7D5] text-base flex items-center justify-center">
                          🍲
                        </div>
                        <div>
                          <span className="text-[13px] font-bold text-[#3B2A20] group-hover:text-[#7B5E4A] transition-colors">{food.name}</span>
                          {food.name_tamil && <span className="font-tamil text-[11px] text-[#A67C52] ml-2 font-medium">{food.name_tamil}</span>}
                          {food.category && <span className="text-[11px] text-[#7B5E4A] ml-2 hidden sm:inline">· {food.category}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[12px] font-bold font-mono text-[#A67C52] tabular-nums">{cal} kcal/100g</span>
                        <span className="text-[12px] font-bold text-[#7B5E4A] tabular-nums">{pro} pro</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Searching indicator */}
          {searching && (
            <p className="text-center text-[11px] text-[#7B5E4A] py-4">Searching...</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#D1B89A]/40 bg-[#FAF7F0] flex items-center justify-between text-[11px] text-[#7B5E4A] px-6">
          <span>Search 40+ IFCT verified dishes & meal planner actions</span>
          <span className="font-mono text-[10px]">NutriMind AI</span>
        </div>
      </div>
    </div>
  )
}
