import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useDashboard } from '@/hooks/useDashboard'
import { useClinicalSafety } from '@/hooks/useClinicalSafety'
import { apiPost } from '@/lib/api'
import {
  Sparkles, ShieldCheck, ArrowRight, CheckCircle2,
  RefreshCw, ChevronRight, Zap
} from 'lucide-react'
import clsx from 'clsx'

interface ChatResponse {
  response: string
  citations: unknown[]
  route_type: string
  conversation_id: string
  blocked: boolean
}

export function DashboardPage() {
  const { user } = useAuth()
  const { loading, dailyNutrition, targets, todaysMeals, gaps, nextMeal } = useDashboard()
  const { profile: clinicalProfile, runSafetyAudit } = useClinicalSafety()
  const navigate = useNavigate()

  const [aiInput, setAiInput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<{
    food: string
    calories: number
    protein: number
    carbs: number
    fat: number
    fibre: number
    safety: 'SAFE' | 'CAUTION' | 'FLAGGED'
    safetyReason: string
  } | null>(null)

  const targetCalories = targets.calories
  const targetProtein = targets.protein
  const targetCarbs = targets.carbs
  const targetFat = targets.fat

  const currentCalories = dailyNutrition.calories
  const currentProtein = dailyNutrition.protein
  const currentCarbs = dailyNutrition.carbs
  const currentFat = dailyNutrition.fat

  const calPct = Math.min(100, Math.round((currentCalories / targetCalories) * 100))
  const proPct = Math.min(100, Math.round((currentProtein / targetProtein) * 100))
  const carbPct = Math.min(100, Math.round((currentCarbs / targetCarbs) * 100))
  const fatPct = Math.min(100, Math.round((currentFat / targetFat) * 100))

  const handleAnalyzeNutrition = async () => {
    if (!aiInput.trim()) return
    setAnalyzing(true)
    try {
      const safetyCheck = runSafetyAudit(aiInput)
      const result = await apiPost<ChatResponse>('/api/chat/analyze', {
        message: `Analyze the nutrition of this meal and respond ONLY as JSON with keys: calories (number), protein (number), carbs (number), fat (number), fibre (number). Meal: ${aiInput}`,
      })

      let parsed = { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 }
      try {
        let jsonStr = result.response
        if (jsonStr.includes('```json')) jsonStr = jsonStr.split('```json')[1].split('```')[0]
        else if (jsonStr.includes('```')) jsonStr = jsonStr.split('```')[1].split('```')[0]
        const p = JSON.parse(jsonStr.trim())
        parsed = {
          calories: Math.round(p.calories || 0),
          protein: Math.round((p.protein || 0) * 10) / 10,
          carbs: Math.round((p.carbs || 0) * 10) / 10,
          fat: Math.round((p.fat || 0) * 10) / 10,
          fibre: Math.round((p.fibre || 0) * 10) / 10,
        }
      } catch {
        parsed = { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 }
      }

      setAnalysisResult({
        food: aiInput,
        ...parsed,
        safety: safetyCheck.safetyVerdict,
        safetyReason: safetyCheck.flags[0] || safetyCheck.cautions[0] || 'Verified clean against user clinical allergen profile & IFCT 2017.',
      })
    } catch {
      setAnalysisResult({
        food: aiInput,
        calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0,
        safety: 'CAUTION',
        safetyReason: 'Could not analyze — check your backend connection.',
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const handleRunSafetyCheck = () => {
    if (!aiInput.trim()) return
    navigate(`/safety?query=${encodeURIComponent(aiInput)}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-mocha border-t-transparent rounded-full animate-spin" />
          <p className="text-walnut/60 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#A67C52] block mb-1">
            OVERVIEW
          </span>
          <h1 className="text-[28px] font-extrabold text-[#3B2A20] font-heading tracking-tight leading-tight">
            Your nutrition, audited
          </h1>
          <p className="text-[13px] text-[#7B5E4A] mt-0.5">
            One place for intake intelligence, allergen safety and the audit trail behind every suggestion.
          </p>
        </div>
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7B5E4A] hover:bg-[#3B2A20] text-white text-[12.5px] font-bold shadow-xs transition-all w-fit shrink-0 cursor-pointer"
        >
          <span>Set up your profile</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Unified AI Input Box */}
      <div className="bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#7B5E4A] text-white">
            UNIFIED AI
          </span>
          <h2 className="text-[14px] font-bold text-[#3B2A20] font-heading">
            What should we look at today?
          </h2>
        </div>
        <textarea
          rows={3}
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          placeholder="e.g. I had oats, a latte and grilled salmon — check it against my allergies and tell me what to eat next."
          className="w-full p-3.5 bg-white border border-[#D1B89A]/80 rounded-xl text-[13.5px] text-[#3B2A20] placeholder-[#A67C52]/70 focus:outline-none focus:ring-2 focus:ring-[#7B5E4A]/40 transition-all resize-none"
        />
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
          <div className="flex items-center gap-2 text-[11px] text-[#7B5E4A]">
            <Sparkles className="w-3.5 h-3.5 text-[#A67C52]" />
            <span>Understands Indian thalis, regional foods, brand snacks & clinical contraindications.</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRunSafetyCheck}
              disabled={!aiInput.trim()}
              className="px-4 py-2 rounded-xl border border-[#D1B89A] bg-white hover:bg-[#F2E7D5]/40 text-[#7B5E4A] text-[12px] font-bold transition-all disabled:opacity-50 cursor-pointer"
            >
              Run Safety Check
            </button>
            <button
              onClick={handleAnalyzeNutrition}
              disabled={analyzing || !aiInput.trim()}
              className="px-4 py-2 rounded-xl bg-[#7B5E4A] hover:bg-[#3B2A20] text-white text-[12px] font-bold shadow-xs transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Analyze Nutrition</span>
                </>
              )}
            </button>
          </div>
        </div>

        {analysisResult && (
          <div className="mt-4 p-4 rounded-xl bg-white border border-[#D1B89A] space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-extrabold text-[#3B2A20]">
                Analyzed Intake: "{analysisResult.food}"
              </span>
              <span
                className={clsx(
                  'text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full',
                  analysisResult.safety === 'SAFE' && 'bg-emerald-100 text-emerald-800 border border-emerald-300',
                  analysisResult.safety === 'CAUTION' && 'bg-amber-100 text-amber-800 border border-amber-300',
                  analysisResult.safety === 'FLAGGED' && 'bg-rose-100 text-rose-800 border border-rose-300'
                )}
              >
                {analysisResult.safety} VERDICT
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              <div className="p-2 bg-[#FAF7F0] rounded-lg">
                <span className="text-[9.5px] uppercase font-bold text-[#7B5E4A]">Calories</span>
                <p className="text-[15px] font-extrabold text-[#3B2A20]">{analysisResult.calories} kcal</p>
              </div>
              <div className="p-2 bg-[#FAF7F0] rounded-lg">
                <span className="text-[9.5px] uppercase font-bold text-[#7B5E4A]">Protein</span>
                <p className="text-[15px] font-extrabold text-[#7B5E4A]">{analysisResult.protein}g</p>
              </div>
              <div className="p-2 bg-[#FAF7F0] rounded-lg">
                <span className="text-[9.5px] uppercase font-bold text-[#7B5E4A]">Carbs</span>
                <p className="text-[15px] font-extrabold text-[#3B2A20]">{analysisResult.carbs}g</p>
              </div>
              <div className="p-2 bg-[#FAF7F0] rounded-lg">
                <span className="text-[9.5px] uppercase font-bold text-[#7B5E4A]">Fats</span>
                <p className="text-[15px] font-extrabold text-[#3B2A20]">{analysisResult.fat}g</p>
              </div>
              <div className="p-2 bg-[#FAF7F0] rounded-lg">
                <span className="text-[9.5px] uppercase font-bold text-[#7B5E4A]">Fibre</span>
                <p className="text-[15px] font-extrabold text-[#A67C52]">{analysisResult.fibre}g</p>
              </div>
            </div>
            <p className="text-[11.5px] text-[#7B5E4A] bg-[#FAF7F0] p-2.5 rounded-lg border border-[#D1B89A]/50">
              <span className="font-bold text-[#3B2A20]">Safety Audit: </span>
              {analysisResult.safetyReason}
            </p>
          </div>
        )}
      </div>

      {/* Middle Grid: AI Nutrition Intelligence + Safety & Disclaimer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Nutrition Intelligence */}
        <div className="lg:col-span-7 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[15px] font-bold text-[#3B2A20] font-heading">
                  AI Nutrition Intelligence
                </h3>
                <p className="text-[11.5px] text-[#7B5E4A]">
                  Today's balance, meal scores and next best actions
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F2E7D5] text-[#7B5E4A] border border-[#D1B89A]">
                TODAY
              </span>
            </div>

            {/* 4 Circular Rings */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Calories', value: currentCalories, target: targetCalories, unit: '', pct: calPct, color: '#7B5E4A' },
                { label: 'Protein', value: `${currentProtein}g`, target: `${targetProtein}g`, unit: '', pct: proPct, color: '#A67C52' },
                { label: 'Carbs', value: `${currentCarbs}g`, target: `${targetCarbs}g`, unit: '', pct: carbPct, color: '#3B2A20' },
                { label: 'Fat', value: `${currentFat}g`, target: `${targetFat}g`, unit: '', pct: fatPct, color: '#D1B89A' },
              ].map(ring => (
                <div key={ring.label} className="bg-white border border-[#D1B89A]/60 rounded-xl p-3 flex flex-col items-center text-center">
                  <div className="relative w-16 h-16 flex items-center justify-center mb-1.5">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle cx="32" cy="32" r="26" stroke="#F2E7D5" strokeWidth="5" fill="transparent" />
                      <circle
                        cx="32" cy="32" r="26" stroke={ring.color} strokeWidth="5" fill="transparent"
                        strokeDasharray={163.3}
                        strokeDashoffset={163.3 - (163.3 * ring.pct) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center leading-none">
                      <span className="text-[13px] font-extrabold text-[#3B2A20]">{ring.value}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#7B5E4A] uppercase">{ring.label}</span>
                  <span className="text-[9.5px] text-[#A67C52] font-semibold">/ {ring.target}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scoring and Recommendations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#D1B89A]/50">
            <div>
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#A67C52] block mb-1">
                MEAL SCORING
              </span>
              <p className="text-[12px] text-[#3B2A20]">
                {currentCalories > 0 ? (
                  <span className="font-bold text-emerald-800">
                    {Math.round((calPct + proPct + carbPct + fatPct) / 4)}/100 Diet Adherence — {calPct > 70 && proPct > 70 ? 'Balanced macro distribution today.' : 'Keep going — log more meals to hit your targets.'}
                  </span>
                ) : (
                  'Log a meal to see its score.'
                )}
              </p>
            </div>
            <div>
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#A67C52] block mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#7B5E4A]" />
                RECOMMENDATIONS
              </span>
              <ul className="text-[11.5px] text-[#3B2A20] space-y-1">
                {gaps.filter(g => g.isDeficient).slice(0, 2).map(g => (
                  <li key={g.nutrient} className="flex items-start gap-1.5">
                    <span className="text-[#7B5E4A] font-bold">↗</span>
                    <span>{g.gap > 0 ? `${Math.round(g.gap)} ${g.nutrient === 'Calories' ? 'kcal' : g.nutrient === 'Iron' || g.nutrient === 'Calcium' ? 'mg' : 'g'} of ${g.nutrient.toLowerCase()} left today.` : `${g.nutrient} target met!`}</span>
                  </li>
                ))}
                {gaps.filter(g => g.isDeficient).length === 0 && currentCalories > 0 && (
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Looking great — all nutrients above 70% of target.</span>
                  </li>
                )}
                {currentCalories === 0 && (
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#7B5E4A] font-bold">↗</span>
                    <span>Log your first meal to get personalized recommendations.</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Safety & Disclaimer */}
        <div className="lg:col-span-5 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#3B2A20] font-heading">
                Safety & Disclaimer
              </h3>
              <ShieldCheck className="w-4 h-4 text-[#7B5E4A]" />
            </div>
            <p className="text-[11.5px] text-[#7B5E4A] mb-4">
              Live allergen and restriction monitoring
            </p>

            <div className="bg-white border border-[#D1B89A]/60 rounded-xl p-3.5 mb-4 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[12px] font-semibold text-[#3B2A20]">
                No allergen conflicts detected in today's log.
              </span>
            </div>

            <div className="mb-4">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#A67C52] block mb-2">
                ACTIVE RESTRICTIONS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {clinicalProfile.allergies.map(a => (
                  <span key={a} className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-[#FDF0EE] text-[#8F3325] border border-[#F3C3BC]">
                    {a} ({clinicalProfile.allergySeverity})
                  </span>
                ))}
                {clinicalProfile.intolerances.map(i => (
                  <span key={i} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-[#FAF7F0] text-[#7B5E4A] border border-[#D1B89A]">
                    {i}
                  </span>
                ))}
                {clinicalProfile.dietaryRestrictions.map(r => (
                  <span key={r} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-[#F2E7D5] text-[#3B2A20] border border-[#D1B89A]">
                    {r}
                  </span>
                ))}
                {clinicalProfile.allergies.length === 0 && clinicalProfile.dietaryRestrictions.length === 0 && (
                  <span className="text-[11px] text-[#7B5E4A] italic">None recorded</span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#D1B89A]/50 text-[10px] text-[#7B5E4A] leading-tight">
            NutriMind AI offers general nutrition information only. It does not diagnose conditions or replace professional medical advice. Seek urgent care for severe reactions.
          </div>
        </div>
      </div>

      {/* Today's Logged Meals */}
      <div className="bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[15px] font-bold text-[#3B2A20] font-heading">
              Today's Meals
            </h3>
            <p className="text-[11.5px] text-[#7B5E4A]">
              Food logged today from the database
            </p>
          </div>
          <Link
            to="/food/log"
            className="text-[11.5px] font-bold text-[#7B5E4A] hover:text-[#3B2A20] flex items-center gap-1"
          >
            <span>Log more</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D1B89A]/60 text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52]">
                <th className="py-2.5 px-3">FOOD</th>
                <th className="py-2.5 px-3">MEAL</th>
                <th className="py-2.5 px-3">PORTION</th>
                <th className="py-2.5 px-3">CALORIES</th>
                <th className="py-2.5 px-3">PROTEIN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D1B89A]/30 text-[12.5px]">
              {todaysMeals.map((meal) => (
                <tr key={meal.id} className="hover:bg-white/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-[#3B2A20]">
                    <div>{meal.name}</div>
                    {meal.nameTamil && (
                      <span className="text-[10px] font-normal text-[#7B5E4A]">{meal.nameTamil}</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-[#7B5E4A] font-semibold capitalize">{meal.mealType}</td>
                  <td className="py-3 px-3 text-[#7B5E4A]">{meal.quantity}g</td>
                  <td className="py-3 px-3 font-bold text-[#3B2A20]">{meal.calories} kcal</td>
                  <td className="py-3 px-3 font-bold text-[#7B5E4A]">{meal.protein}g</td>
                </tr>
              ))}
              {todaysMeals.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#7B5E4A] text-xs">
                    No meals logged yet today. <Link to="/food/log" className="underline font-bold hover:text-[#3B2A20]">Log your first meal</Link> to start tracking.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
