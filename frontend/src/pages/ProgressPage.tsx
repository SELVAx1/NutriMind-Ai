import { useState, useEffect } from 'react'
import { useClinicalSafety } from '@/hooks/useClinicalSafety'
import { useProfile } from '@/hooks/useProfile'
import { apiGet } from '@/lib/api'
import { Check, Mail, Info } from 'lucide-react'

interface WeeklyDay {
  date: string
  calories: number
  protein: number
}

export function ProgressPage() {
  const { measurements, addMeasurement } = useClinicalSafety()
  const { targets } = useProfile()
  const [weeklyData, setWeeklyData] = useState<WeeklyDay[]>([])

  useEffect(() => {
    apiGet<{ daily: WeeklyDay[]; targets: any }>('/api/analytics/weekly')
      .then(res => { if (res?.daily) setWeeklyData(res.daily) })
      .catch(() => {})
  }, [])

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [weightKg, setWeightKg] = useState('')
  const [waistCm, setWaistCm] = useState('')
  const [bodyFatPct, setBodyFatPct] = useState('')
  const [energyRating, setEnergyRating] = useState(4)
  const [notes, setNotes] = useState('')
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleTriggerEmail = () => {
    setEmailSent(true)
    setTimeout(() => setEmailSent(false), 4000)
  }

  // Calculations
  const latestMeas = measurements[0]
  const oldestMeas = measurements[measurements.length - 1]
  const currentWeight = latestMeas ? `${latestMeas.weightKg} kg` : '—'
  const weightDiff = latestMeas && oldestMeas && measurements.length > 1 ? (latestMeas.weightKg - oldestMeas.weightKg).toFixed(1) : '0'
  const changeText = Number(weightDiff) <= 0 ? `${weightDiff} kg` : `+${weightDiff} kg`

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!weightKg) return
    addMeasurement({
      date,
      weightKg: Number(weightKg),
      waistCm: Number(waistCm) || 0,
      bodyFatPct: Number(bodyFatPct) || 0,
      energyRating: Number(energyRating),
      notes,
    })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
    setNotes('')
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* ── Page Header (Matches PDF Page 5) ── */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#A67C52] block mb-1">
          TRENDS
        </span>
        <h1 className="text-[28px] font-extrabold text-[#3B2A20] font-heading tracking-tight leading-tight">
          Progress
        </h1>
        <p className="text-[13px] text-[#7B5E4A] mt-0.5">
          Weight, waist and energy alongside your energy intake — the numbers that actually move.
        </p>
      </div>

      {/* ── 4 Top Metrics Cards (Matches PDF Page 5) ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block">
            CURRENT WEIGHT
          </span>
          <p className="text-[24px] font-extrabold text-[#3B2A20] font-heading mt-1">
            {currentWeight}
          </p>
        </div>

        <div className="p-4 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block">
            CHANGE
          </span>
          <p className="text-[24px] font-extrabold text-emerald-800 font-heading mt-1">
            {changeText}
          </p>
        </div>

        <div className="p-4 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block">
            AVG INTAKE ({weeklyData.length}D)
          </span>
          <p className="text-[24px] font-extrabold text-[#7B5E4A] font-heading mt-1">
            {weeklyData.length > 0 ? Math.round(weeklyData.reduce((a, d) => a + d.calories, 0) / weeklyData.length).toLocaleString() : '—'} kcal
          </p>
        </div>

        <div className="p-4 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block">
            TARGET
          </span>
          <p className="text-[24px] font-extrabold text-[#3B2A20] font-heading mt-1">
            {targets?.calories_kcal ? targets.calories_kcal.toLocaleString() : '2,000'} kcal
          </p>
        </div>
      </div>

      {/* ── Charts Grid (Matches PDF Page 5) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Weight Trend Chart */}
        <div className="p-5 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl">
          <h3 className="text-[14px] font-bold text-[#3B2A20] font-heading">
            Weight trend
          </h3>
          <p className="text-[11.5px] text-[#7B5E4A] mb-4">
            Latest readings, oldest to newest
          </p>

          <div className="h-44 flex items-end justify-between gap-4 px-3 pt-6 pb-2 border-b border-[#D1B89A]/50 bg-white rounded-xl">
            {measurements.length === 0 && (
              <p className="text-xs text-[#7B5E4A] m-auto">No measurements yet. Add one below.</p>
            )}
            {measurements.slice().reverse().map((m) => {
              const weights = measurements.map(x => x.weightKg).filter(w => w > 0)
              const minW = weights.length > 0 ? Math.min(...weights) - 2 : 0
              const maxW = weights.length > 0 ? Math.max(...weights) + 2 : 100
              const range = maxW - minW || 1
              const heightPct = Math.max(20, Math.min(95, ((m.weightKg - minW) / range) * 70 + 20))
              return (
                <div key={m.id} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] font-extrabold text-[#7B5E4A] group-hover:scale-110 transition-transform">
                    {m.weightKg}k
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-[28px] bg-gradient-to-t from-[#7B5E4A] to-[#A67C52] rounded-t-lg transition-all group-hover:brightness-110"
                  />
                  <span className="text-[9px] font-bold text-[#A67C52] whitespace-nowrap mt-1">
                    {m.date.slice(5)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Daily Energy Intake Chart */}
        <div className="p-5 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl">
          <h3 className="text-[14px] font-bold text-[#3B2A20] font-heading">
            Daily energy intake
          </h3>
          <p className="text-[11.5px] text-[#7B5E4A] mb-4">
            Last {weeklyData.length || 7} days against your target ({targets?.calories_kcal || 2000} kcal)
          </p>

          <div className="h-44 flex items-end justify-between gap-2 px-3 pt-6 pb-2 border-b border-[#D1B89A]/50 bg-white rounded-xl relative">
            <div className="absolute top-[35%] inset-x-2 border-b-2 border-dashed border-[#A67C52]/50 flex justify-end pr-2">
              <span className="text-[8.5px] font-bold text-[#A67C52] -translate-y-3">Target {targets?.calories_kcal || 2000}</span>
            </div>

            {weeklyData.length > 0 ? weeklyData.slice(-7).map((d) => {
              const maxCal = Math.max(targets?.calories_kcal || 2000, ...weeklyData.map(w => w.calories)) * 1.1
              const h = Math.max(5, Math.round((d.calories / maxCal) * 100))
              const dayLabel = new Date(d.date).toLocaleDateString('en', { weekday: 'short' })
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end z-10 group">
                  <span className="text-[9.5px] font-bold text-[#3B2A20]">{d.calories}</span>
                  <div
                    style={{ height: `${h}%` }}
                    className="w-full max-w-[22px] bg-[#D1B89A] group-hover:bg-[#7B5E4A] rounded-t-md transition-colors"
                  />
                  <span className="text-[9px] font-bold text-[#7B5E4A] mt-1">{dayLabel}</span>
                </div>
              )
            }) : (
              <div className="flex-1 flex items-center justify-center text-[11px] text-[#7B5E4A] italic">
                Log meals to see your energy chart
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Module 7: Weekly Recap Engine & Email Dispatcher ── */}
      <div className="p-5 bg-white border border-[#D1B89A] rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#D1B89A] flex items-center justify-center text-[#7B5E4A] flex-shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#A67C52]">
                MODULE 7 • WEEKLY RECAP ENGINE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[9.5px] font-bold border border-emerald-200">
                Automated Digest
              </span>
            </div>
            <h3 className="text-[15px] font-bold text-[#3B2A20] font-heading mt-0.5">
              Weekly & Monthly Clinical Intake Reports
            </h3>
            <p className="text-[12px] text-[#7B5E4A]">
              Synthesizes adherence trends, micronutrient gap closures, and personalized nutritionist guidance into an email digest.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleTriggerEmail}
            disabled={emailSent}
            className="px-4 py-2.5 rounded-xl bg-[#7B5E4A] hover:bg-[#3B2A20] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {emailSent ? (
              <>
                <Info className="w-4 h-4 text-amber-300" />
                <span>Email service not configured yet</span>
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>Trigger Weekly Report Email</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Log a Measurement & History (Matches PDF Page 5 & 6) ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Form: Log a measurement (5 Cols) */}
        <div className="md:col-span-5 p-5 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl shadow-xs">
          <h3 className="text-[14px] font-bold text-[#3B2A20] font-heading">
            Log a measurement
          </h3>
          <p className="text-[11.5px] text-[#7B5E4A] mb-4">
            Trend weight beats single readings — log weekly.
          </p>

          <form onSubmit={handleSave} className="space-y-3.5">
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                DATE
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] focus:ring-1 focus:ring-[#7B5E4A]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  WEIGHT (KG)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] font-semibold focus:ring-1 focus:ring-[#7B5E4A]"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  WAIST (CM)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={waistCm}
                  onChange={(e) => setWaistCm(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] font-semibold focus:ring-1 focus:ring-[#7B5E4A]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                BODY FAT (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={bodyFatPct}
                onChange={(e) => setBodyFatPct(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] font-semibold focus:ring-1 focus:ring-[#7B5E4A]"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] mb-1">
                <span>ENERGY TODAY (1–5)</span>
                <span className="text-[#3B2A20] font-bold">{energyRating} / 5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={energyRating}
                onChange={(e) => setEnergyRating(Number(e.target.value))}
                className="w-full accent-[#7B5E4A]"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                NOTES
              </label>
              <input
                type="text"
                placeholder="Sleep, training, cycle phase"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] focus:ring-1 focus:ring-[#7B5E4A]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#7B5E4A] hover:bg-[#3B2A20] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Measurement Saved!</span>
                </>
              ) : (
                <span>Save measurement</span>
              )}
            </button>
          </form>
        </div>

        {/* Right List: Measurement history (7 Cols) */}
        <div className="md:col-span-7 p-5 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl shadow-xs">
          <h3 className="text-[14px] font-bold text-[#3B2A20] font-heading mb-3">
            Measurement history
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#D1B89A]/60 text-[9.5px] font-extrabold uppercase tracking-wider text-[#A67C52]">
                  <th className="py-2 px-2">DATE</th>
                  <th className="py-2 px-2">WEIGHT</th>
                  <th className="py-2 px-2">WAIST</th>
                  <th className="py-2 px-2">BODY FAT</th>
                  <th className="py-2 px-2">ENERGY</th>
                  <th className="py-2 px-2">NOTES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D1B89A]/30">
                {measurements.map((m) => (
                  <tr key={m.id} className="hover:bg-white/60 transition-colors">
                    <td className="py-2.5 px-2 font-mono text-[11px] text-[#A67C52]">{m.date}</td>
                    <td className="py-2.5 px-2 font-bold text-[#3B2A20]">{m.weightKg} kg</td>
                    <td className="py-2.5 px-2 text-[#7B5E4A]">{m.waistCm ? `${m.waistCm} cm` : '—'}</td>
                    <td className="py-2.5 px-2 text-[#7B5E4A]">{m.bodyFatPct ? `${m.bodyFatPct}%` : '—'}</td>
                    <td className="py-2.5 px-2 font-bold text-[#7B5E4A]">{m.energyRating} / 5</td>
                    <td className="py-2.5 px-2 text-[11px] text-[#7B5E4A] line-clamp-1">{m.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
