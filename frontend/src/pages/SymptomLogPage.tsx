import { useState } from 'react'
import { useClinicalSafety } from '@/hooks/useClinicalSafety'
import { Check } from 'lucide-react'
import clsx from 'clsx'

const COMMON_SYMPTOMS = [
  'Bloating', 'Nausea', 'Stomach Pain', 'Diarrhoea', 'Headache',
  'Skin Rash', 'Itching', 'Fatigue', 'Dizziness', 'Vomiting',
]

export function SymptomLogPage() {
  const { symptoms, addSymptomLog } = useClinicalSafety()

  const [food, setFood] = useState('')
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [minutesAfter, setMinutesAfter] = useState('30')
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Mild')
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!food.trim() || selectedSymptoms.length === 0) return

    addSymptomLog({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      symptoms: selectedSymptoms,
      severity,
      minutesAfterEating: Number(minutesAfter) || 0,
      suspectedFood: food.trim(),
      actionTaken: '',
      notes: notes.trim(),
      suggestedEscalation: '',
      resolved: false,
    })

    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    setFood('')
    setSelectedSymptoms([])
    setMinutesAfter('30')
    setSeverity('Mild')
    setNotes('')
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div>
        <h1 className="text-[28px] font-extrabold text-[#3B2A20] font-heading tracking-tight">
          Food reactions
        </h1>
        <p className="text-[13px] text-[#7B5E4A] mt-0.5">
          Track which foods cause reactions. This builds your personal sensitivity record over time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Log form */}
        <form onSubmit={handleSave} className="md:col-span-7 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl p-6 space-y-5">
          <h2 className="text-[15px] font-bold text-[#3B2A20] font-heading">
            Log a reaction
          </h2>

          <div>
            <label className="text-[11px] font-bold text-[#7B5E4A] block mb-1.5">What did you eat?</label>
            <input
              type="text"
              required
              value={food}
              onChange={(e) => setFood(e.target.value)}
              placeholder="e.g. Paneer butter masala, Peanut chutney"
              className="w-full px-3.5 py-2.5 bg-white border border-[#D1B89A]/80 rounded-xl text-[13px] text-[#3B2A20] placeholder-[#A67C52]/60 focus:ring-1 focus:ring-[#7B5E4A] outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#7B5E4A] block mb-1.5">How did you feel?</label>
            <div className="flex flex-wrap gap-2">
              {COMMON_SYMPTOMS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSymptom(s)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer border',
                    selectedSymptoms.includes(s)
                      ? 'bg-[#7B5E4A] text-white border-[#7B5E4A]'
                      : 'bg-white text-[#7B5E4A] border-[#D1B89A] hover:border-[#7B5E4A]'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-[#7B5E4A] block mb-1.5">How soon after eating?</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={minutesAfter}
                  onChange={(e) => setMinutesAfter(e.target.value)}
                  className="w-20 px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-[13px] text-[#3B2A20] focus:ring-1 focus:ring-[#7B5E4A] outline-none"
                />
                <span className="text-[12px] text-[#7B5E4A]">minutes</span>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#7B5E4A] block mb-1.5">How bad?</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-[13px] text-[#3B2A20] focus:ring-1 focus:ring-[#7B5E4A] outline-none"
              >
                <option value="Mild">Mild — uncomfortable</option>
                <option value="Moderate">Moderate — noticeable</option>
                <option value="Severe">Severe — needed help</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#7B5E4A] block mb-1.5">Anything else to note? <span className="font-normal">(optional)</span></label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Happened after eating out, might be the oil"
              className="w-full px-3.5 py-2.5 bg-white border border-[#D1B89A]/80 rounded-xl text-[13px] text-[#3B2A20] placeholder-[#A67C52]/60 focus:ring-1 focus:ring-[#7B5E4A] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!food.trim() || selectedSymptoms.length === 0}
            className="w-full py-2.5 bg-[#7B5E4A] hover:bg-[#3B2A20] text-white text-[13px] font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved</span>
              </>
            ) : (
              <span>Log this reaction</span>
            )}
          </button>
        </form>

        {/* History */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[#3B2A20] font-heading">Your reaction history</h2>
            <span className="text-[11px] font-bold text-[#7B5E4A] bg-[#F2E7D5] px-2 py-0.5 rounded-full border border-[#D1B89A]">
              {symptoms.length} logged
            </span>
          </div>

          {symptoms.length === 0 ? (
            <div className="bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl p-8 text-center">
              <p className="text-[12px] text-[#7B5E4A]">No reactions logged yet. When you feel off after eating, log it here to build your sensitivity record.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {symptoms.map((s) => (
                <div key={s.id} className="p-4 bg-[#FAF7F0] border border-[#D1B89A] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#3B2A20]">{s.suspectedFood}</span>
                    <span className={clsx(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full',
                      s.severity === 'Mild' && 'bg-amber-100 text-amber-800 border border-amber-200',
                      s.severity === 'Moderate' && 'bg-orange-100 text-orange-800 border border-orange-200',
                      s.severity === 'Severe' && 'bg-rose-100 text-rose-800 border border-rose-200',
                    )}>
                      {s.severity}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {s.symptoms.map(sym => (
                      <span key={sym} className="text-[10.5px] font-semibold px-2 py-0.5 rounded bg-white text-[#7B5E4A] border border-[#D1B89A]/40">
                        {sym}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#A67C52]">
                    <span>{s.minutesAfterEating > 0 ? `${s.minutesAfterEating} min after eating` : 'Shortly after eating'}</span>
                    <span>{s.date}</span>
                  </div>

                  {s.notes && (
                    <p className="text-[11px] text-[#7B5E4A] italic">{s.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
