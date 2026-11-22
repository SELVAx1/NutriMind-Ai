import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { apiPost, apiGet } from '@/lib/api'
import {
  Check, Copy, RefreshCw, ShoppingBag, Sparkles,
  AlertTriangle, Clock, Plus, Trash2
} from 'lucide-react'
import clsx from 'clsx'

interface GroceryItem {
  ingredient_name: string
  quantity_g: number
  estimated_cost: number
  category: string
}

interface GroceryList {
  list_id: string
  items: GroceryItem[]
  total_cost: number
}

interface PantryItem {
  id: string
  name: string
  quantity: string
  category: string
  daysLeft: number
}

export function GroceryPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'list' | 'pantry' | 'fridge'>('list')
  const [list, setList] = useState<GroceryList | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const [pantryItems, setPantryItems] = useState<PantryItem[]>([])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      try {
        const { data } = await supabase
          .from('pantry_items')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        if (data) {
          setPantryItems(data.map((r: any) => ({
            id: r.id,
            name: r.name,
            quantity: r.quantity || '',
            category: r.category || 'Pantry Item',
            daysLeft: r.days_left ?? 7,
          })))
        }
      } catch {
        try {
          const saved = localStorage.getItem('nutrimind_pantry')
          if (saved) setPantryItems(JSON.parse(saved))
        } catch {}
      }
    })()
  }, [user])

  const [newItemName, setNewItemName] = useState('')
  const [newItemQty, setNewItemQty] = useState('')
  const [newItemDays, setNewItemDays] = useState('7')

  // Fridge-to-Meal State
  const [selectedFridgeItems, setSelectedFridgeItems] = useState<string[]>([])
  const [generatingRecipe, setGeneratingRecipe] = useState(false)
  const [generatedRecipe, setGeneratedRecipe] = useState<any | null>(null)

  useEffect(() => {
    async function loadLatest() {
      try {
        const data = await apiGet<{ lists: any[] }>('/api/grocery/lists')
        if (data?.lists && data.lists.length > 0) {
          const latestId = data.lists[0].id
          const itemsData = await apiGet<GroceryList>(`/api/grocery/lists/${latestId}`)
          if (itemsData?.items && itemsData.items.length > 0) {
            setList(itemsData)
            return
          }
        }
        loadFallbackList()
      } catch {
        loadFallbackList()
      }
    }
    loadLatest()
  }, [])

  async function generateFreshList() {
    setLoading(true)
    try {
      const data = await apiPost<GroceryList>('/api/grocery/generate', {})
      if (data?.items && data.items.length > 0) {
        setList(data)
      } else {
        loadFallbackList()
      }
    } catch {
      loadFallbackList()
    } finally {
      setLoading(false)
    }
  }

  function loadFallbackList() {
    setList(null)
  }

  function toggleItem(name: string) {
    setCheckedItems(prev => ({ ...prev, [name]: !prev[name] }))
  }

  function copyAsText() {
    if (!list) return
    const text = list.items
      .map(i => `${checkedItems[i.ingredient_name] ? '☑' : '☐'} ${i.ingredient_name}: ${i.quantity_g}g (~₹${i.estimated_cost})`)
      .join('\n')
    navigator.clipboard.writeText(`🛒 NutriMind Smart Grocery List (Total: ₹${list.total_cost})\n\n${text}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleAddPantryItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemName.trim()) return
    const item: PantryItem = {
      id: 'p-' + Date.now(),
      name: newItemName.trim(),
      quantity: newItemQty.trim() || '1 pack',
      category: 'Pantry Item',
      daysLeft: Number(newItemDays) || 7,
    }
    setPantryItems([item, ...pantryItems])
    setNewItemName('')
    setNewItemQty('')
    setNewItemDays('7')

    if (user) {
      try {
        const { data } = await supabase.from('pantry_items').insert({
          user_id: user.id,
          name: item.name,
          quantity: item.quantity,
          category: item.category,
          days_left: item.daysLeft,
        }).select().single()
        if (data) {
          setPantryItems(prev => prev.map(p => p.id === item.id ? { ...p, id: data.id } : p))
        }
      } catch {}
    }
  }

  const handleDeletePantryItem = async (itemId: string) => {
    setPantryItems(prev => prev.filter(i => i.id !== itemId))
    if (user && !itemId.startsWith('p-')) {
      try {
        await supabase.from('pantry_items').delete().eq('id', itemId)
      } catch {}
    }
  }

  const toggleFridgeSelect = (name: string) => {
    if (selectedFridgeItems.includes(name)) {
      setSelectedFridgeItems(selectedFridgeItems.filter(i => i !== name))
    } else {
      setSelectedFridgeItems([...selectedFridgeItems, name])
    }
  }

  const handleGenerateFridgeRecipe = async () => {
    if (selectedFridgeItems.length === 0) return
    setGeneratingRecipe(true)
    try {
      const result = await apiPost<{ response: string }>('/api/chat/analyze', {
        message: `I have these ingredients in my fridge: ${selectedFridgeItems.join(', ')}. Suggest ONE healthy Indian recipe using these. Respond ONLY as JSON: {"name":"recipe name","prepTime":"X mins","calories":number,"protein":number,"carbs":number,"fat":number,"ironMg":number,"zeroWasteBonus":"what expiring items it uses","instructions":["step1","step2","step3"]}`,
      })
      let parsed = null
      try {
        let jsonStr = result.response
        if (jsonStr.includes('```json')) jsonStr = jsonStr.split('```json')[1].split('```')[0]
        else if (jsonStr.includes('```')) jsonStr = jsonStr.split('```')[1].split('```')[0]
        parsed = JSON.parse(jsonStr.trim())
      } catch {}
      if (parsed) {
        setGeneratedRecipe(parsed)
      } else {
        setGeneratedRecipe({
          name: `Recipe with ${selectedFridgeItems.slice(0, 2).join(' & ')}`,
          prepTime: '20 mins',
          calories: 0, protein: 0, carbs: 0, fat: 0, ironMg: 0,
          zeroWasteBonus: `Uses ${selectedFridgeItems.length} fridge ingredients`,
          instructions: ['Could not parse recipe — try asking the AI chat for a detailed recipe.'],
        })
      }
    } catch {
      setGeneratedRecipe({
        name: 'Recipe generation failed',
        prepTime: '—',
        calories: 0, protein: 0, carbs: 0, fat: 0, ironMg: 0,
        zeroWasteBonus: '',
        instructions: ['Check your backend connection and try again.'],
      })
    } finally {
      setGeneratingRecipe(false)
    }
  }

  const grouped = (list?.items || []).reduce<Record<string, GroceryItem[]>>((acc, item) => {
    const cat = item.category || 'Grains & Staples'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#A67C52] block mb-1">
            MODULE 8 • GROCERY INTELLIGENCE & PANTRY
          </span>
          <h1 className="text-[28px] font-extrabold text-[#3B2A20] font-heading tracking-tight">
            Smart Grocery & Fridge-to-Meal
          </h1>
          <p className="text-[13px] text-[#7B5E4A]">
            Auto-generate shopping lists, track ingredient expiry, and generate instant zero-waste recipes from your fridge.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'list' && (
            <>
            <button
              onClick={generateFreshList}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-[#7B5E4A] hover:bg-[#3B2A20] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Generating...' : 'Generate from Plan'}</span>
            </button>
            <button
              onClick={copyAsText}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#D1B89A] hover:bg-[#FAF7F0] text-[#7B5E4A] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Copy size={13} />
              <span>{copied ? 'Copied!' : 'Copy to WhatsApp'}</span>
            </button>
            </>
          )}
        </div>
      </div>

      {/* ── 3 Tab Switcher ── */}
      <div className="inline-flex p-1 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('list')}
          className={clsx(
            'px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
            activeTab === 'list' ? 'bg-[#7B5E4A] text-white shadow-2xs' : 'text-[#7B5E4A] hover:text-[#3B2A20]'
          )}
        >
          <ShoppingBag size={13} />
          <span>Smart Grocery List</span>
        </button>
        <button
          onClick={() => setActiveTab('pantry')}
          className={clsx(
            'px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
            activeTab === 'pantry' ? 'bg-[#7B5E4A] text-white shadow-2xs' : 'text-[#7B5E4A] hover:text-[#3B2A20]'
          )}
        >
          <Clock size={13} />
          <span>Pantry & Expiry Tracker</span>
        </button>
        <button
          onClick={() => setActiveTab('fridge')}
          className={clsx(
            'px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
            activeTab === 'fridge' ? 'bg-[#7B5E4A] text-white shadow-2xs' : 'text-[#7B5E4A] hover:text-[#3B2A20]'
          )}
        >
          <Sparkles size={13} />
          <span>Fridge-to-Meal Intelligence</span>
        </button>
      </div>

      {/* ── TAB 1: Smart Grocery List ── */}
      {activeTab === 'list' && (
        <div className="space-y-5">
          <div className="p-4 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#7B5E4A] text-white flex items-center justify-center shadow-xs">
                <ShoppingBag size={18} />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-[#3B2A20] font-heading">
                  Consolidated Weekly Staples Checklist
                </h3>
                <p className="text-[11.5px] text-[#7B5E4A]">
                  {list?.items?.length || 0} items extracted from meal plans & optimized to eliminate waste
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block">
                Estimated Total
              </span>
              <span className="text-[22px] font-extrabold text-[#3B2A20] font-heading">
                ₹{list?.total_cost || 0}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(grouped).map(([aisle, items]) => (
              <div key={aisle} className="p-4 bg-white border border-[#D1B89A]/60 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#D1B89A]/30">
                  <h3 className="text-[14px] font-bold text-[#3B2A20] font-heading">{aisle}</h3>
                  <span className="text-[10.5px] font-bold text-[#A67C52]">({items.length} items)</span>
                </div>

                <div className="space-y-1.5">
                  {items.map(item => {
                    const isChecked = !!checkedItems[item.ingredient_name]
                    return (
                      <div
                        key={item.ingredient_name}
                        onClick={() => toggleItem(item.ingredient_name)}
                        className={clsx(
                          'p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer',
                          isChecked ? 'bg-[#FAF7F0] border-[#D1B89A] opacity-60' : 'bg-white border-[#D1B89A]/40 hover:bg-[#FAF7F0]'
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={clsx(
                              'w-4 h-4 rounded-md border flex items-center justify-center',
                              isChecked ? 'bg-[#7B5E4A] border-[#7B5E4A] text-white' : 'border-[#D1B89A] bg-white'
                            )}
                          >
                            {isChecked && <Check size={11} strokeWidth={3} />}
                          </div>
                          <span className={clsx('text-xs font-semibold', isChecked ? 'line-through text-[#7B5E4A]' : 'text-[#3B2A20]')}>
                            {item.ingredient_name}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] font-mono">
                          <span className="text-[#7B5E4A]">{item.quantity_g}g</span>
                          <span className="font-bold text-[#3B2A20]">₹{item.estimated_cost}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: Pantry Inventory & Expiry Tracker ── */}
      {activeTab === 'pantry' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Add Item Form (4 cols) */}
          <div className="md:col-span-4 p-5 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl shadow-xs space-y-3.5">
            <h3 className="text-[14px] font-bold text-[#3B2A20] font-heading">
              Add to Pantry Inventory
            </h3>
            <p className="text-[11.5px] text-[#7B5E4A]">
              Log stored food to track shelf-life and prevent spoilage.
            </p>

            <form onSubmit={handleAddPantryItem} className="space-y-3">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paneer or Moong Dal"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A] rounded-xl text-xs text-[#3B2A20]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                    Quantity
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 500g"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D1B89A] rounded-xl text-xs text-[#3B2A20]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                    Days to Expiry
                  </label>
                  <input
                    type="number"
                    value={newItemDays}
                    onChange={(e) => setNewItemDays(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D1B89A] rounded-xl text-xs text-[#3B2A20]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#7B5E4A] hover:bg-[#3B2A20] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Item</span>
              </button>
            </form>
          </div>

          {/* Pantry List (8 cols) */}
          <div className="md:col-span-8 p-5 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#D1B89A]/40">
              <h3 className="text-[14px] font-bold text-[#3B2A20] font-heading">
                Current Inventory ({pantryItems.length} items)
              </h3>
              <span className="text-[10.5px] font-bold text-[#8F3325] flex items-center gap-1">
                <AlertTriangle size={13} />
                {pantryItems.filter(i => i.daysLeft <= 3).length} Expiring Soon
              </span>
            </div>

            <div className="space-y-2">
              {pantryItems.map(item => {
                const isUrgent = item.daysLeft <= 2
                const isWarning = item.daysLeft <= 4 && !isUrgent
                return (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-xl border border-[#D1B89A]/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#3B2A20]">{item.name}</span>
                      <span className="text-[11px] text-[#7B5E4A] ml-2">({item.quantity})</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={clsx(
                          'text-[10px] font-black uppercase px-2 py-0.5 rounded-full',
                          isUrgent && 'bg-rose-100 text-rose-800 border border-rose-300',
                          isWarning && 'bg-amber-100 text-amber-800 border border-amber-300',
                          !isUrgent && !isWarning && 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        )}
                      >
                        {item.daysLeft <= 0 ? 'Expired' : `${item.daysLeft} days left`}
                      </span>
                      <button
                        onClick={() => handleDeletePantryItem(item.id)}
                        className="text-[#D1B89A] hover:text-[#8F3325] p-1 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: Fridge-to-Meal Intelligence (Major Feature 4) ── */}
      {activeTab === 'fridge' && (
        <div className="space-y-6">
          <div className="p-5 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl shadow-xs space-y-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#A67C52] block mb-1">
                MAJOR FEATURE 4 • ZERO-WASTE CHEF
              </span>
              <h2 className="text-[16px] font-extrabold text-[#3B2A20] font-heading">
                Select ingredients you currently have in your fridge
              </h2>
              <p className="text-[12px] text-[#7B5E4A]">
                The AI combines your leftover groceries into a complete, balanced Indian dish that meets your macro target and prevents food waste.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {pantryItems.length === 0 && (
                <p className="text-[12px] text-[#7B5E4A] py-4">
                  No pantry items yet. Add items in the <button type="button" onClick={() => setActiveTab('pantry')} className="underline font-bold text-[#3B2A20] cursor-pointer">Pantry tab</button> first, then come back here to generate recipes.
                </p>
              )}
              {pantryItems.map(item => {
                const active = selectedFridgeItems.includes(item.name)
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleFridgeSelect(item.name)}
                    className={clsx(
                      'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                      active
                        ? 'bg-[#7B5E4A] text-white shadow-2xs'
                        : 'bg-white border border-[#D1B89A] text-[#7B5E4A] hover:bg-[#F2E7D5]/40'
                    )}
                  >
                    <span>{item.name}</span>
                    {item.daysLeft <= 3 && (
                      <span className="text-[9px] px-1 rounded bg-rose-200 text-rose-900 font-black">
                        Expiring!
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleGenerateFridgeRecipe}
                disabled={generatingRecipe || selectedFridgeItems.length === 0}
                className="px-5 py-2.5 bg-[#7B5E4A] hover:bg-[#3B2A20] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles size={14} />
                <span>{generatingRecipe ? 'Creating Zero-Waste Recipe...' : 'Generate Instant Meal from Fridge'}</span>
              </button>
            </div>
          </div>

          {/* Generated Recipe Card */}
          {generatedRecipe && (
            <div className="p-6 bg-white border border-[#D1B89A] rounded-3xl shadow-sm space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D1B89A]/40">
                <div>
                  <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider">
                    Zero-Waste AI Recipe Output
                  </span>
                  <h3 className="text-[18px] font-extrabold text-[#3B2A20] font-heading">
                    {generatedRecipe.name}
                  </h3>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                  {generatedRecipe.zeroWasteBonus}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                <div className="p-2.5 bg-[#FAF7F0] rounded-xl">
                  <span className="text-[10px] font-bold text-[#7B5E4A] uppercase">Calories</span>
                  <p className="text-[15px] font-extrabold text-[#3B2A20]">{generatedRecipe.calories} kcal</p>
                </div>
                <div className="p-2.5 bg-[#FAF7F0] rounded-xl">
                  <span className="text-[10px] font-bold text-[#7B5E4A] uppercase">Protein</span>
                  <p className="text-[15px] font-extrabold text-[#7B5E4A]">{generatedRecipe.protein}g</p>
                </div>
                <div className="p-2.5 bg-[#FAF7F0] rounded-xl">
                  <span className="text-[10px] font-bold text-[#7B5E4A] uppercase">Carbs</span>
                  <p className="text-[15px] font-extrabold text-[#3B2A20]">{generatedRecipe.carbs}g</p>
                </div>
                <div className="p-2.5 bg-[#FAF7F0] rounded-xl">
                  <span className="text-[10px] font-bold text-[#7B5E4A] uppercase">Fats</span>
                  <p className="text-[15px] font-extrabold text-[#3B2A20]">{generatedRecipe.fat}g</p>
                </div>
                <div className="p-2.5 bg-[#FAF7F0] rounded-xl">
                  <span className="text-[10px] font-bold text-[#7B5E4A] uppercase">Prep Time</span>
                  <p className="text-[15px] font-extrabold text-[#A67C52]">{generatedRecipe.prepTime}</p>
                </div>
              </div>

              <div>
                <h4 className="text-[13px] font-bold text-[#3B2A20] mb-2 font-heading">Cooking Instructions:</h4>
                <ol className="text-xs text-[#7B5E4A] space-y-2 list-decimal list-inside leading-relaxed">
                  {generatedRecipe.instructions.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
