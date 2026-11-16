import { useState } from 'react'
import { useClinicalSafety } from '@/hooks/useClinicalSafety'
import { Activity, AlertTriangle, CheckCircle2, Clock, Check, Plus, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

const SYMPTOM_OPTIONS = [
  'Nausea', 'Vomiting', 'Diarrhoea', 'Abdominal Pain', 'Bloating',
  'Hives', 'Itching', 'Lip Swelling', 'Wheeze', 'Headache',
  'Fatigue', 'Dizziness', 'Flushing', 'Cramps', 'Rash'
]

export function SymptomLogPage() {
  const { symptoms, addSymptomLog } = useClinicalSafety()

  const [date, setDate] = useState('2026-11-16')
  const [time, setTime] = useState('13:45')
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Bloating'])
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe' | 'Critical'>('Mild')
  const [minutesAfterEating, setMinutesAfterEating] = useState('45')
  const [suspectedFood, setSuspectedFood] = useState('')
  const [actionTaken, setActionTaken] = useState('')
  const [notes, setNotes] = useState('')
  const [resolved, setResolved] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const toggleSymptom = (s: string) => {
    if (selectedSymptoms.includes(s)) {
      setSelectedSymptoms(selectedSymptoms.filter(item => item !== s))
    } else {
      setSelectedSymptoms([...selectedSymptoms, s])
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!suspectedFood.trim()) return

    addSymptomLog({
      date,
      time,
      symptoms: selectedSymptoms,
      severity,
      minutesAfterEating: Number(minutesAfterEating) || 0,
      suspectedFood,
      actionTaken: actionTaken || 'Monitored and rested',
      notes,
      suggestedEscalation: severity === 'Severe' || severity === 'Critical'
        ? 'Urgent medical attention recommended. Contact clinician immediately.'
        : 'Self-care — rest, hydrate, avoid suspected trigger, monitor vitals.',
      resolved,
    })

    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
    setSuspectedFood('')
    setActionTaken('')
    setNotes('')
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* ── Page Header (Matches PDF Page 8) ── */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#A67C52] block mb-1">
          REACTIONS
        </span>
        <h1 className="text-[28px] font-extrabold text-[#3B2A20] font-heading tracking-tight leading-tight">
          Symptom log
        </h1>
        <p className="text-[13px] text-[#7B5E4A] mt-0.5">
          Record reactions, onset timing and escalation so patterns can be discussed with your clinician.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* ── Left Column: Log a reaction (7 Cols - Matches PDF Page 8) ── */}
        <div className="md:col-span-7 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-[15px] font-bold text-[#3B2A20] font-heading">
              Log a reaction
            </h2>
            <p className="text-[11.5px] text-[#7B5E4A]">
              Track what happened, when, and how it was handled.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  DATE
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20]"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  TIME
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20]"
                />
              </div>
            </div>

            {/* Symptoms Chips (Matches PDF Page 8) */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-2">
                SYMPTOMS
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SYMPTOM_OPTIONS.map((sym) => {
                  const active = selectedSymptoms.includes(sym)
                  return (
                    <button
                      type="button"
                      key={sym}
                      onClick={() => toggleSymptom(sym)}
                      className={clsx(
                        'px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                        active
                          ? 'bg-[#8F3325] text-white font-bold shadow-2xs'
                          : 'bg-white border border-[#D1B89A] text-[#7B5E4A] hover:bg-[#F2E7D5]/40'
                      )}
                    >
                      {sym}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  SEVERITY
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] font-semibold"
                >
                  <option>Mild</option>
                  <option>Moderate</option>
                  <option>Severe</option>
                  <option>Critical</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  MINUTES AFTER EATING
                </label>
                <input
                  type="number"
                  value={minutesAfterEating}
                  onChange={(e) => setMinutesAfterEating(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                SUSPECTED FOOD
              </label>
              <input
                type="text"
                required
                placeholder="Peanut chutney at lunch"
                value={suspectedFood}
                onChange={(e) => setSuspectedFood(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20]"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                ACTION TAKEN
              </label>
              <input
                type="text"
                placeholder="Antihistamine, rested, called clinician"
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20]"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                NOTES
              </label>
              <textarea
                rows={2}
                placeholder="Add any context, environmental triggers, or symptoms timeline"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] resize-none"
              />
            </div>

            {/* Suggested Escalation Self-Care Box (Matches PDF Page 8) */}
            <div className="p-3 bg-white border border-[#D1B89A]/70 rounded-xl text-xs space-y-1">
              <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#A67C52] block">
                SUGGESTED ESCALATION — SELF CARE
              </span>
              <p className="text-[#7B5E4A] leading-relaxed">
                Rest, hydrate, and avoid the suspected food. Log the reaction and re-check ingredients. If throat tightens or breathing becomes labored, seek immediate emergency care.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="resolvedCheck"
                checked={resolved}
                onChange={(e) => setResolved(e.target.checked)}
                className="accent-[#7B5E4A] rounded"
              />
              <label htmlFor="resolvedCheck" className="text-xs text-[#3B2A20] font-semibold">
                Symptoms have resolved
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#7B5E4A] hover:bg-[#3B2A20] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Reaction Logged & Saved!</span>
                </>
              ) : (
                <span>Save reaction</span>
              )}
            </button>
          </form>
        </div>

        {/* ── Right Column: Reaction history (5 Cols - Matches PDF Page 8) ── */}
        <div className="md:col-span-5 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[15px] font-bold text-[#3B2A20] font-heading">
                Reaction history
              </h3>
              <span className="text-[10px] font-bold bg-[#F2E7D5] text-[#7B5E4A] px-2 py-0.5 rounded-full border border-[#D1B89A]">
                {symptoms.length} logged
              </span>
            </div>
            <p className="text-[11.5px] text-[#7B5E4A] mb-4">
              Historical reactions saved for clinician consultations.
            </p>

            <div className="space-y-3">
              {symptoms.map((s) => (
                <div key={s.id} className="p-3.5 bg-white border border-[#D1B89A]/60 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#3B2A20]">{s.suspectedFood}</span>
                    <span
                      className={clsx(
                        'text-[9px] font-black uppercase px-2 py-0.5 rounded-full',
                        s.severity === 'Mild' && 'bg-amber-100 text-amber-800 border border-amber-200',
                        s.severity === 'Moderate' && 'bg-orange-100 text-orange-800 border border-orange-200',
                        (s.severity === 'Severe' || s.severity === 'Critical') && 'bg-rose-100 text-rose-800 border border-rose-200'
                      )}
                    >
                      {s.severity}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {s.symptoms.map((sym) => (
                      <span key={sym} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FAF7F0] text-[#7B5E4A] border border-[#D1B89A]/40">
                        {sym}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-[#7B5E4A]">
                    <span className="font-bold text-[#3B2A20]">Action:</span> {s.actionTaken} ({s.minutesAfterEating} min after meal)
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-[#D1B89A]/30 text-[10px] text-[#A67C52]">
                    <span>{s.date} at {s.time}</span>
                    <span className={clsx("font-bold", s.resolved ? "text-emerald-700" : "text-amber-700")}>
                      {s.resolved ? '✓ Resolved' : '● Monitoring'}
                    </span>
                  </div>
                </div>
              ))}

              {symptoms.length === 0 && (
                <div className="py-12 text-center text-[#7B5E4A] text-xs">
                  No reactions logged. That is good news!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
