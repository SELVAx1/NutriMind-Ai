import { useState, useEffect } from 'react'
import { apiPost, apiGet } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ShoppingCart, Check, IndianRupee } from 'lucide-react'
import { clsx } from 'clsx'

interface GroceryItem {
  ingredient_name: string
  quantity_g: number
  estimated_cost: number
  category: string
  food_id?: string
  meal_count?: number
  in_pantry?: boolean
  id?: string
}

interface GroceryList {
  list_id: string
  items: GroceryItem[]
  total_cost: number
  error?: string
}

export function GroceryPage() {
  const [list, setList] = useState<GroceryList | null>(null)
  const [loading, setLoading] = useState(false)

  async function generateList() {
    setLoading(true)
    try {
      const result = await apiPost<GroceryList>('/api/grocery/generate', {})
      setList(result)
    } catch {
      setList({ list_id: '', items: [], total_cost: 0, error: 'Failed to generate. Make sure you have an active meal plan.' })
    } finally {
      setLoading(false)
    }
  }

  const grouped = list?.items.reduce<Record<string, GroceryItem[]>>((acc, item) => {
    const cat = item.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {}) || {}

  const checkedCount = list?.items.filter(i => i.in_pantry).length || 0

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-heading font-bold flex items-center gap-2">
            <ShoppingCart size={22} className="text-primary" />
            Grocery List
          </h1>
          <p className="text-sm text-text-secondary">Auto-generated from your meal plan.</p>
        </div>
        <Button onClick={generateList} loading={loading}>Generate from plan</Button>
      </div>

      {!list && !loading && (
        <Card padding="lg" className="text-center">
          <p className="text-3xl mb-3">🛒</p>
          <h3 className="font-heading font-semibold mb-1">No grocery list yet</h3>
          <p className="text-sm text-text-secondary mb-4">Generate a meal plan first, then create a grocery list from it.</p>
          <Button onClick={generateList}>Generate grocery list</Button>
        </Card>
      )}

      {list?.error && (
        <Card padding="md" className="bg-red-500/15 border-danger/20 mb-4">
          <p className="text-sm text-danger">{list.error}</p>
        </Card>
      )}

      {list?.items && list.items.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Card padding="sm" className="text-center">
              <p className="text-xs text-text-muted">Estimated Total</p>
              <p className="font-heading font-bold text-lg text-accent flex items-center justify-center gap-1">
                <IndianRupee size={16} />{list.total_cost}
              </p>
            </Card>
            <Card padding="sm" className="text-center">
              <p className="text-xs text-text-muted">Items</p>
              <p className="font-heading font-bold text-lg">
                {checkedCount} / {list.items.length} done
              </p>
            </Card>
          </div>

          <div className="flex flex-col gap-5">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-text-secondary mb-2">{category}</h3>
                <div className="flex flex-col gap-1">
                  {items.map((item, i) => (
                    <div
                      key={i}
                      className={clsx(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors',
                        item.in_pantry ? 'bg-emerald-500/15 opacity-60' : 'bg-surface-1 border border-border'
                      )}
                    >
                      <button
                        onClick={() => {
                          const updated = { ...list }
                          const idx = updated.items.findIndex(x => x.ingredient_name === item.ingredient_name)
                          if (idx >= 0) updated.items[idx].in_pantry = !updated.items[idx].in_pantry
                          setList({ ...updated })
                        }}
                        className={clsx(
                          'w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer',
                          item.in_pantry ? 'bg-success border-success' : 'border-border'
                        )}
                      >
                        {item.in_pantry && <Check size={12} className="text-white" />}
                      </button>
                      <span className={clsx('flex-1 text-sm', item.in_pantry && 'line-through text-text-muted')}>
                        {item.ingredient_name}
                      </span>
                      <span className="text-xs text-text-muted">{Math.round(item.quantity_g)}g</span>
                      <span className="text-xs font-medium text-accent">₹{item.estimated_cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
