import { useAuth } from '@/contexts/AuthContext'
import { useDashboard } from '@/hooks/useDashboard'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Link, Navigate } from 'react-router-dom'
import { Plus, Calendar, TrendingUp, Zap, ArrowRight, Utensils, Scan, ShoppingBasket, FlaskConical } from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, Tooltip } from 'recharts'

/* ── KPI Card ── */
function KpiCard({ label, value, unit, target, color }: {
  label: string; value: number; unit: string; target: number; color: string
}) {
  const pct = target > 0 ? Math.min((value / target) * 100, 100) : 0
  return (
    <Card padding="lg" glow={color} hover>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] font-semibold uppercase tracking-widest text-text-muted">{label}</span>
        <span className="text-[11px] font-mono font-medium rounded-md px-2 py-0.5 bg-surface-2 text-text-dim">{Math.round(pct)}%</span>
      </div>
      <div className="mb-1">
        <span className="text-[40px] font-extrabold leading-none tracking-tighter tabular-nums" style={{ color }}>
          {value.toLocaleString()}
        </span>
        <span className="text-[16px] text-text-dim ml-1.5">{unit}</span>
      </div>
      <p className="text-[12px] text-text-dim mb-5">of {target.toLocaleString()} {unit} daily target</p>
      <div className="h-2 rounded-full bg-surface-3 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </Card>
  )
}

const WEEK_DATA = [
  { d: 'Mon', v: 60 }, { d: 'Tue', v: 42 }, { d: 'Wed', v: 75 },
  { d: 'Thu', v: 50 }, { d: 'Fri', v: 68 }, { d: 'Sat', v: 38 }, { d: 'Sun', v: 55 },
]

export function DashboardPage() {
  const { user } = useAuth()
  const d = useDashboard()

  if (d.loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center animate-pulse-subtle">
          <Zap size={20} className="text-primary" />
        </div>
        <p className="text-[13px] text-text-muted">Loading dashboard...</p>
      </div>
    </div>
  )

  if (!d.hasProfile) return <Navigate to="/onboarding" replace />

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const name = user?.user_metadata?.full_name || d.name
  const pctCal = d.targets.calories > 0 ? (d.dailyNutrition.calories / d.targets.calories) * 100 : 0

  const pieData = [
    { name: 'Protein', value: d.dailyNutrition.protein || 1, color: '#8B5CF6' },
    { name: 'Carbs', value: d.dailyNutrition.carbs || 1, color: '#3B82F6' },
    { name: 'Fat', value: d.dailyNutrition.fat || 1, color: '#EF4444' },
  ]

  return (
    <div className="animate-fade-in flex flex-col gap-7">
      {/* ═══════════ HEADER ═══════════ */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[30px] font-extrabold tracking-tight leading-tight">{greeting}, {name}</h1>
          <div className="flex items-center gap-2 mt-2 text-[13px] text-text-muted">
            <Calendar size={14} className="text-text-dim" />
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="text-surface-4">·</span>
            <span>Next: <span className="text-text-secondary font-medium">{d.nextMeal}</span></span>
            <span className="text-surface-4">·</span>
            <span>Budget: <span className="text-primary font-semibold">₹{d.budgetDaily}/day</span></span>
          </div>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <Link to="/tracker"><Button variant="secondary" size="sm">View Tracker</Button></Link>
          <Link to="/food"><Button size="sm"><Plus size={14} /> Log Meal</Button></Link>
        </div>
      </div>

      {/* ═══════════ KPI CARDS ═══════════ */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        <KpiCard label="Calories" value={d.dailyNutrition.calories} unit="kcal" target={d.targets.calories} color="#F59E0B" />
        <KpiCard label="Protein" value={d.dailyNutrition.protein} unit="g" target={d.targets.protein} color="#8B5CF6" />
        <KpiCard label="Carbs" value={d.dailyNutrition.carbs} unit="g" target={d.targets.carbs} color="#3B82F6" />
        <KpiCard label="Fat" value={d.dailyNutrition.fat} unit="g" target={d.targets.fat} color="#EF4444" />
      </div>

      {/* ═══════════ MAIN GRID ═══════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ── LEFT: Nutrition + Chart + Meals (2/3) ── */}
        <div className="xl:col-span-2 flex flex-col gap-5">

          {/* Daily Nutrition Overview */}
          <Card padding="xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[18px] font-bold">Daily Nutrition</h2>
                <p className="text-[13px] text-text-muted mt-0.5">{Math.round(pctCal)}% of your daily goal completed</p>
              </div>
              <span className="text-[12px] font-mono text-text-dim bg-surface-2 border border-border px-3 py-1 rounded-lg">
                {d.dailyNutrition.calories} / {d.targets.calories} kcal
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
              {/* Donut chart — 2 cols */}
              <div className="md:col-span-2 flex flex-col items-center">
                <div className="w-[200px] h-[200px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[28px] font-extrabold text-text tabular-nums">{Math.round(pctCal)}<span className="text-[16px] text-text-dim">%</span></span>
                    <span className="text-[11px] text-text-dim">completed</span>
                  </div>
                </div>
                <div className="flex gap-5 mt-4">
                  {pieData.map(p => (
                    <div key={p.name} className="flex items-center gap-1.5 text-[11px] text-text-muted">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />{p.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Micro-nutrient bars — 3 cols */}
              <div className="md:col-span-3 flex flex-col gap-5">
                {[
                  { label: 'Fibre', val: d.dailyNutrition.fibre, target: d.targets.fibre, unit: 'g', color: '#14B8A6' },
                  { label: 'Iron', val: d.dailyNutrition.iron, target: 18, unit: 'mg', color: '#F97316' },
                  { label: 'Vitamin B12', val: d.dailyNutrition.vitamin_b12, target: 2.4, unit: 'mcg', color: '#8B5CF6' },
                  { label: 'Calcium', val: d.dailyNutrition.calcium, target: 600, unit: 'mg', color: '#06B6D4' },
                ].map(m => {
                  const p = m.target > 0 ? Math.min((m.val / m.target) * 100, 100) : 0
                  return (
                    <div key={m.label}>
                      <div className="flex justify-between text-[13px] mb-2">
                        <span className="text-text-secondary font-medium">{m.label}</span>
                        <span className="tabular-nums font-mono text-text-muted">{m.val} / {m.target} {m.unit}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-surface-3 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(p, 2)}%`, backgroundColor: m.color }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>

          {/* Weekly Trend */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[16px] font-bold flex items-center gap-2">
                <TrendingUp size={17} className="text-primary" /> Weekly Trend
              </h2>
              <span className="text-[11px] text-text-dim font-medium bg-surface-2 border border-border px-2.5 py-1 rounded-lg">Last 7 days</span>
            </div>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={WEEK_DATA}>
                  <defs>
                    <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: '#52525B', fontSize: 12 }} dy={8} />
                  <Tooltip
                    contentStyle={{ background: '#1C1C22', border: '1px solid #2D2D35', borderRadius: 10, fontSize: 12, color: '#FAFAFA', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
                    labelStyle={{ color: '#A1A1AA', marginBottom: 4 }}
                    cursor={{ stroke: '#10B981', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2.5} fill="url(#aGrad)" dot={{ r: 0 }} activeDot={{ r: 5, fill: '#10B981', strokeWidth: 2, stroke: '#0A0A0C' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Today's Meals */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[16px] font-bold">Today's Meals</h2>
              <Link to="/tracker" className="text-[12px] text-primary font-medium hover:text-primary-light flex items-center gap-1 transition-colors">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {d.todaysMeals.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {d.todaysMeals.map(meal => (
                  <div key={meal.id} className="p-4 rounded-xl bg-surface-2 border border-border hover:border-text-dim/50 transition-all cursor-pointer group">
                    <div className="h-20 rounded-lg bg-surface-3 flex items-center justify-center text-2xl mb-3 group-hover:bg-surface-4 transition-colors">🍛</div>
                    <p className="text-[13px] font-semibold truncate">{meal.name}</p>
                    {meal.nameTamil && <p className="font-tamil text-[11px] text-text-dim truncate mt-0.5">{meal.nameTamil}</p>}
                    <div className="flex justify-between mt-3 text-[11px]">
                      <span className="text-text-muted tabular-nums">{meal.calories} kcal</span>
                      <span className="text-violet-400 font-semibold tabular-nums">{meal.protein}g pro</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-14 border-2 border-dashed border-border rounded-xl">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mx-auto mb-4">
                    <Utensils size={24} className="text-text-dim" />
                  </div>
                  <h3 className="text-[16px] font-semibold mb-1.5">No meals logged today</h3>
                  <p className="text-[13px] text-text-muted mb-6 max-w-xs mx-auto">Start tracking your food intake to see nutrition progress and get personalized insights.</p>
                  <Link to="/food"><Button><Plus size={14} /> Log your first meal</Button></Link>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ── RIGHT PANEL (1/3) ── */}
        <div className="flex flex-col gap-5">
          {/* Daily Score */}
          <Card padding="lg" className="bg-gradient-to-br from-emerald-600/15 via-surface-1 to-surface-1 border-emerald-500/25">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">Daily Score</p>
            <p className="text-[56px] font-extrabold tracking-tighter text-primary leading-none tabular-nums">
              {Math.round(pctCal)}<span className="text-[24px] font-bold">%</span>
            </p>
            <p className="text-[13px] text-text-muted mt-2">of daily nutrition targets completed</p>
            <div className="mt-5 h-2 rounded-full bg-surface-3 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all duration-1000" style={{ width: `${Math.min(pctCal, 100)}%` }} />
            </div>
          </Card>

          {/* Nutrition Gaps */}
          {d.gaps.length > 0 && (
            <Card padding="lg">
              <h3 className="text-[14px] font-bold mb-5 flex items-center gap-2">
                <Zap size={15} className="text-amber-400" /> Nutrition Gaps
              </h3>
              <div className="flex flex-col gap-5">
                {d.gaps.slice(0, 4).map(gap => {
                  const p = gap.target > 0 ? Math.min((gap.current / gap.target) * 100, 100) : 0
                  return (
                    <div key={gap.nutrient}>
                      <div className="flex justify-between text-[13px] mb-2">
                        <span className="text-text-secondary font-medium">{gap.nutrient}</span>
                        <span className="tabular-nums font-mono" style={{ color: gap.color }}>{gap.current} / {gap.target} {gap.unit}</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-3 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(p, 2)}%`, backgroundColor: gap.color }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card padding="lg">
            <h3 className="text-[14px] font-bold mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-2.5">
              {[
                { icon: Utensils, label: 'Log a meal', desc: 'Track your food intake', to: '/food', color: 'text-emerald-400' },
                { icon: Scan, label: 'Scan food', desc: 'AI-powered recognition', to: '/food/analyze', color: 'text-amber-400' },
                { icon: ShoppingBasket, label: 'Grocery list', desc: 'From your meal plan', to: '/grocery', color: 'text-blue-400' },
                { icon: FlaskConical, label: 'What-if analysis', desc: 'Simulate diet changes', to: '/nutritwin', color: 'text-teal-400' },
              ].map(a => (
                <Link key={a.to} to={a.to}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl bg-surface-2 border border-border hover:border-text-dim/50 hover:bg-surface-3 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-surface-3 border border-border flex items-center justify-center flex-shrink-0">
                    <a.icon size={18} className={a.color} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-text">{a.label}</p>
                    <p className="text-[11px] text-text-dim">{a.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* AI Insight */}
          <Card padding="lg" className="border-primary/20">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Zap size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-text mb-1">AI Insight</p>
                <p className="text-[12px] text-text-muted leading-relaxed">
                  {d.gaps.length > 0
                    ? `Your ${d.gaps[0].nutrient.toLowerCase()} intake is below the recommended target. Consider adding iron-rich foods like ragi, sundal, or sprouted moong to your meals.`
                    : 'Log more meals to receive personalized nutrition insights and recommendations from NutriMind AI.'}
                </p>
                <Link to="/chat" className="text-[12px] text-primary font-semibold mt-3 inline-flex items-center gap-1 hover:text-primary-light transition-colors">
                  Get recommendations <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
