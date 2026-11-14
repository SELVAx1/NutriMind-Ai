import { useState, useEffect } from 'react'
import { apiGet, apiPost } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, FlaskConical } from 'lucide-react'
import { clsx } from 'clsx'

interface DailyData {
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fibre: number
  iron: number
  meals: number
}

interface Pattern {
  type: string
  nutrient: string
  avg?: number
  target?: number
  message: string
}

interface WeeklyData {
  daily: DailyData[]
  patterns: Pattern[]
  targets: Record<string, number> | null
  days_tracked: number
}

interface WhatIfResult {
  original: { name: string; name_tamil?: string; nutrition_per_serving: Record<string, number> }
  replacement: { name: string; name_tamil?: string; nutrition_per_serving: Record<string, number> }
  days: number
  daily_delta: Record<string, number>
  total_delta: Record<string, number>
  disclaimer: string
  error?: string
}

export function NutriTwinPage() {
  const [weekly, setWeekly] = useState<WeeklyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [whatIfResult, setWhatIfResult] = useState<WhatIfResult | null>(null)
  const [simulating, setSimulating] = useState(false)
  const [replaceFood, setReplaceFood] = useState('Rice')
  const [withFood, setWithFood] = useState('Ragi porridge')
  const [simDays, setSimDays] = useState(30)

  useEffect(() => {
    apiGet<WeeklyData>('/api/analytics/weekly')
      .then(setWeekly)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function runSimulation() {
    setSimulating(true)
    try {
      const result = await apiPost<WhatIfResult>('/api/analytics/what-if', {
        replace_food: replaceFood,
        with_food: withFood,
        quantity_g: 200,
        days: simDays,
      })
      setWhatIfResult(result)
    } catch {
      setWhatIfResult(null)
    } finally {
      setSimulating(false)
    }
  }

  if (loading) return <div className="py-12 text-center text-text-muted">Loading analytics...</div>

  return (
    <div className="py-6">
      <h1 className="text-xl font-heading font-bold flex items-center gap-2 mb-1">
        <BarChart3 size={22} className="text-primary" />
        NutriTwin Analytics
      </h1>
      <p className="text-sm text-text-secondary mb-6">Your digital nutrition twin — patterns, trends, and what-if simulations.</p>

      {/* Weekly Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card padding="sm" className="text-center">
          <p className="text-xs text-text-muted">Days Tracked</p>
          <p className="font-heading font-bold text-2xl">{weekly?.days_tracked || 0}</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-xs text-text-muted">Avg Calories</p>
          <p className="font-heading font-bold text-2xl">
            {weekly?.daily.length ? Math.round(weekly.daily.reduce((s, d) => s + d.calories, 0) / weekly.daily.length) : 0}
          </p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-xs text-text-muted">Avg Protein</p>
          <p className="font-heading font-bold text-2xl text-protein">
            {weekly?.daily.length ? Math.round(weekly.daily.reduce((s, d) => s + d.protein, 0) / weekly.daily.length * 10) / 10 : 0}g
          </p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-xs text-text-muted">Avg Iron</p>
          <p className="font-heading font-bold text-2xl text-danger">
            {weekly?.daily.length ? Math.round(weekly.daily.reduce((s, d) => s + d.iron, 0) / weekly.daily.length * 10) / 10 : 0}mg
          </p>
        </Card>
      </div>

      {/* Patterns */}
      {weekly?.patterns && weekly.patterns.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-heading font-semibold mb-3">Detected Patterns</h2>
          <div className="flex flex-col gap-2">
            {weekly.patterns.map((p, i) => (
              <Card key={i} padding="sm" className="flex items-start gap-3">
                {p.type === 'low' ? (
                  <TrendingDown size={20} className="text-danger flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={20} className="text-warning flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium">{p.nutrient}</p>
                  <p className="text-xs text-text-secondary">{p.message}</p>
                  {p.avg !== undefined && p.target !== undefined && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden max-w-32">
                        <div className="h-full rounded-full bg-danger" style={{ width: `${Math.min((p.avg / p.target) * 100, 100)}%` }} />
                      </div>
                      <span className="text-xs text-text-muted tabular-nums">{p.avg} / {p.target}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Daily Trend */}
      {weekly?.daily && weekly.daily.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-heading font-semibold mb-3">Daily Intake</h2>
          <div className="flex flex-col gap-1">
            {weekly.daily.map((d) => (
              <Card key={d.date} padding="sm" className="flex items-center gap-3">
                <span className="text-xs text-text-muted w-20">{new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                <div className="flex-1 flex items-center gap-4 text-xs">
                  <span className="tabular-nums font-medium">{d.calories} kcal</span>
                  <span className="text-protein tabular-nums">{d.protein}g pro</span>
                  <span className="text-fibre tabular-nums">{d.fibre}g fib</span>
                  <span className="text-danger tabular-nums">{d.iron}mg Fe</span>
                </div>
                <span className="text-xs text-text-muted">{d.meals} meals</span>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* What-If Simulator */}
      <Card padding="lg">
        <h2 className="text-base font-heading font-semibold flex items-center gap-2 mb-1">
          <FlaskConical size={18} className="text-primary" />
          What-If Simulator
        </h2>
        <p className="text-xs text-text-secondary mb-4">Simulate diet changes over time using real nutritional data.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <Input label="Replace" value={replaceFood} onChange={(e) => setReplaceFood(e.target.value)} placeholder="Rice" />
          <Input label="With" value={withFood} onChange={(e) => setWithFood(e.target.value)} placeholder="Ragi porridge" />
          <Input label="Days" type="number" value={String(simDays)} onChange={(e) => setSimDays(Number(e.target.value))} min="7" max="90" />
        </div>

        <Button onClick={runSimulation} loading={simulating} size="sm">
          <FlaskConical size={14} /> Run simulation
        </Button>

        {whatIfResult && !whatIfResult.error && (
          <div className="mt-4 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Card padding="sm" className="bg-red-500/15/50">
                <p className="text-xs text-text-muted mb-1">Current: {whatIfResult.original.name}</p>
                <p className="text-sm font-medium">{whatIfResult.original.nutrition_per_serving.calories} kcal · {whatIfResult.original.nutrition_per_serving.protein}g protein</p>
              </Card>
              <Card padding="sm" className="bg-emerald-500/15">
                <p className="text-xs text-text-muted mb-1">Replace with: {whatIfResult.replacement.name}</p>
                <p className="text-sm font-medium">{whatIfResult.replacement.nutrition_per_serving.calories} kcal · {whatIfResult.replacement.nutrition_per_serving.protein}g protein</p>
              </Card>
            </div>

            <Card padding="sm">
              <p className="text-sm font-semibold mb-2">{whatIfResult.days}-Day Impact</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {Object.entries(whatIfResult.total_delta).map(([k, v]) => (
                  <div key={k}>
                    <p className={clsx('font-heading font-bold text-sm tabular-nums', v > 0 ? 'text-success' : v < 0 ? 'text-danger' : 'text-text-muted')}>
                      {v > 0 ? '+' : ''}{v}
                    </p>
                    <p className="text-[10px] text-text-muted">{k}</p>
                  </div>
                ))}
              </div>
            </Card>

            <p className="text-[10px] text-text-muted italic">{whatIfResult.disclaimer}</p>
          </div>
        )}

        {whatIfResult?.error && (
          <p className="mt-3 text-sm text-danger">{whatIfResult.error}</p>
        )}
      </Card>
    </div>
  )
}
