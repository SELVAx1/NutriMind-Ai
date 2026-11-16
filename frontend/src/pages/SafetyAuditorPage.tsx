import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useClinicalSafety } from '@/hooks/useClinicalSafety'
import {
  ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle,
  AlertCircle, Sparkles, Check, Plus, X
} from 'lucide-react'
import clsx from 'clsx'

const ALLERGY_OPTIONS = [
  'Peanut', 'Tree Nut', 'Dairy', 'Egg', 'Gluten', 'Shellfish',
  'Fish', 'Soy', 'Sesame', 'Mustard', 'Corn', 'Sulphite'
]

const INTOLERANCE_OPTIONS = [
  'Lactose', 'Fructose', 'Histamine', 'Gluten', 'Caffeine', 'Alcohol'
]

const DIET_RESTRICTIONS = [
  'Vegan', 'Vegetarian', 'Eggetarian', 'Jain', 'Halal', 'Kosher',
  'Keto', 'Low Sodium', 'Gluten Free', 'Dairy Free'
]

const MEDICAL_CONDITIONS = [
  'Type 2 Diabetes', 'Prediabetes', 'Hypertension', 'High Cholesterol',
  'PCOS', 'Hypothyroid', 'Ckd', 'Ibs', 'Fatty Liver', 'Gout', 'Anaemia'
]

const MEDICATIONS = [
  'Metformin', 'Warfarin', 'Statin', 'Levothyroxine', 'Insulin', 'Amlodipine'
]

const SUPPLEMENTS = [
  'Vitamin D', 'Vitamin B12', 'Iron', 'Calcium', 'Omega 3', 'Protein Powder', 'Multivitamin'
]

export function SafetyAuditorPage() {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('query') || ''

  const { profile, updateClinicalProfile, runSafetyAudit, addAuditLog } = useClinicalSafety()

  // Form State
  const [allergies, setAllergies] = useState<string[]>(profile.allergies || [])
  const [allergySeverity, setAllergySeverity] = useState<any>(profile.allergySeverity || 'Moderate')
  const [intolerances, setIntolerances] = useState<string[]>(profile.intolerances || [])
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(profile.dietaryRestrictions || [])
  const [medicalConditions, setMedicalConditions] = useState<string[]>(profile.medicalConditions || [])
  const [medications, setMedications] = useState<string[]>(profile.medications || [])
  const [supplements, setSupplements] = useState<string[]>(profile.supplements || [])
  const [pregnancyStatus, setPregnancyStatus] = useState(profile.pregnancyStatus || 'Not applicable')
  const [clinicianName, setClinicianName] = useState(profile.clinicianName || '')
  const [emergencyContact, setEmergencyContact] = useState(profile.emergencyContact || '')
  const [safetyNotes, setSafetyNotes] = useState(profile.safetyNotes || '')
  const [consentAcknowledged, setConsentAcknowledged] = useState<boolean>(profile.consentAcknowledged ?? true)

  const [customInput, setCustomInput] = useState('')
  const [customCategory, setCustomCategory] = useState<'allergy' | 'condition' | 'medication' | 'supplement' | null>(null)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Auditor Test Engine State
  const [testQuery, setTestQuery] = useState(initialQuery)
  const [auditing, setAuditing] = useState(false)
  const [auditResult, setAuditResult] = useState<any | null>(null)
  const [auditHistory, setAuditHistory] = useState<any[]>([
    {
      query: 'Peanut chikki with jaggery',
      verdict: 'FLAGGED',
      reason: 'Contains Peanuts: Trigger for recorded moderate peanut allergy.',
      time: 'Yesterday',
    },
    {
      query: 'Steamed Ragi Idli + Sambar',
      verdict: 'SAFE',
      reason: 'Zero allergen conflicts. Rich in bioavailable calcium.',
      time: '2 days ago',
    },
  ])

  useEffect(() => {
    if (initialQuery) {
      setTestQuery(initialQuery)
      executeAudit(initialQuery)
    }
  }, [initialQuery])

  const toggleItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item))
    } else {
      setList([...list, item])
    }
  }

  const handleAddCustom = (category: 'allergy' | 'condition' | 'medication' | 'supplement') => {
    if (!customInput.trim()) return
    if (category === 'allergy') setAllergies([...allergies, customInput.trim()])
    if (category === 'condition') setMedicalConditions([...medicalConditions, customInput.trim()])
    if (category === 'medication') setMedications([...medications, customInput.trim()])
    if (category === 'supplement') setSupplements([...supplements, customInput.trim()])
    setCustomInput('')
    setCustomCategory(null)
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateClinicalProfile({
      allergies,
      allergySeverity,
      intolerances,
      dietaryRestrictions,
      medicalConditions,
      medications,
      supplements,
      pregnancyStatus,
      clinicianName,
      emergencyContact,
      safetyNotes,
      consentAcknowledged,
    })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  const executeAudit = (query: string) => {
    if (!query.trim()) return
    setAuditing(true)
    setTimeout(() => {
      const res = runSafetyAudit(query)
      setAuditResult(res)
      setAuditHistory(prev => [
        {
          query,
          verdict: res.safetyVerdict,
          reason: res.flags[0] || res.cautions[0] || 'Verified clean against clinical profile.',
          time: 'Just now',
        },
        ...prev,
      ])
      setAuditing(false)
    }, 450)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* ── Page Header (Matches PDF Page 6) ── */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#A67C52] block mb-1">
          SAFETY FIRST
        </span>
        <h1 className="text-[28px] font-extrabold text-[#3B2A20] font-heading tracking-tight leading-tight">
          Safety & allergy auditor
        </h1>
        <p className="text-[13px] text-[#7B5E4A] mt-0.5">
          Record what must never reach your plate, then audit any food before eating it. Every AI suggestion in the app is filtered through this profile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Left Column: Clinical & allergen profile (7 Cols - Matches PDF Page 6 & 7) ── */}
        <div className="lg:col-span-7 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-[15px] font-bold text-[#3B2A20] font-heading">
              Clinical & allergen profile
            </h2>
            <p className="text-[11.5px] text-[#7B5E4A]">
              Only what you record here is used to filter food suggestions.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            {/* Allergies Chips */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-2">
                ALLERGIES
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ALLERGY_OPTIONS.map((a) => {
                  const active = allergies.includes(a)
                  return (
                    <button
                      type="button"
                      key={a}
                      onClick={() => toggleItem(allergies, setAllergies, a)}
                      className={clsx(
                        'px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                        active
                          ? 'bg-[#8F3325] text-white shadow-2xs font-bold'
                          : 'bg-white border border-[#D1B89A] text-[#7B5E4A] hover:bg-[#F2E7D5]/40'
                      )}
                    >
                      {a}
                    </button>
                  )
                })}
                {allergies.filter(a => !ALLERGY_OPTIONS.includes(a)).map(a => (
                  <span key={a} className="px-3 py-1 rounded-xl text-xs font-bold bg-[#8F3325] text-white flex items-center gap-1">
                    {a}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => toggleItem(allergies, setAllergies, a)} />
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => setCustomCategory('allergy')}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold border border-dashed border-[#A67C52] text-[#7B5E4A] hover:bg-white"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Allergy Severity */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                ALLERGY SEVERITY
              </label>
              <select
                value={allergySeverity}
                onChange={(e) => setAllergySeverity(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] font-semibold focus:ring-1 focus:ring-[#7B5E4A]"
              >
                <option>Mild</option>
                <option>Moderate</option>
                <option>Severe</option>
                <option>Anaphylactic</option>
              </select>
            </div>

            {/* Intolerances */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-2">
                INTOLERANCES
              </label>
              <div className="flex flex-wrap gap-1.5">
                {INTOLERANCE_OPTIONS.map((i) => {
                  const active = intolerances.includes(i)
                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => toggleItem(intolerances, setIntolerances, i)}
                      className={clsx(
                        'px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                        active
                          ? 'bg-[#7B5E4A] text-white shadow-2xs font-bold'
                          : 'bg-white border border-[#D1B89A] text-[#7B5E4A] hover:bg-[#F2E7D5]/40'
                      )}
                    >
                      {i}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Dietary Restrictions */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-2">
                DIETARY RESTRICTIONS
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DIET_RESTRICTIONS.map((r) => {
                  const active = dietaryRestrictions.includes(r)
                  return (
                    <button
                      type="button"
                      key={r}
                      onClick={() => toggleItem(dietaryRestrictions, setDietaryRestrictions, r)}
                      className={clsx(
                        'px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                        active
                          ? 'bg-[#3B2A20] text-white shadow-2xs font-bold'
                          : 'bg-white border border-[#D1B89A] text-[#7B5E4A] hover:bg-[#F2E7D5]/40'
                      )}
                    >
                      {r}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Medical Conditions */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-2">
                MEDICAL CONDITIONS
              </label>
              <div className="flex flex-wrap gap-1.5">
                {MEDICAL_CONDITIONS.map((c) => {
                  const active = medicalConditions.includes(c)
                  return (
                    <button
                      type="button"
                      key={c}
                      onClick={() => toggleItem(medicalConditions, setMedicalConditions, c)}
                      className={clsx(
                        'px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                        active
                          ? 'bg-[#A67C52] text-white shadow-2xs font-bold'
                          : 'bg-white border border-[#D1B89A] text-[#7B5E4A] hover:bg-[#F2E7D5]/40'
                      )}
                    >
                      {c}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Medications */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                MEDICATIONS
              </label>
              <p className="text-[10.5px] text-[#7B5E4A] mb-2">
                Used only to note general nutrient interactions.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {MEDICATIONS.map((m) => {
                  const active = medications.includes(m)
                  return (
                    <button
                      type="button"
                      key={m}
                      onClick={() => toggleItem(medications, setMedications, m)}
                      className={clsx(
                        'px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                        active
                          ? 'bg-[#7B5E4A] text-white shadow-2xs font-bold'
                          : 'bg-white border border-[#D1B89A] text-[#7B5E4A] hover:bg-[#F2E7D5]/40'
                      )}
                    >
                      {m}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Supplements */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-2">
                SUPPLEMENTS
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SUPPLEMENTS.map((s) => {
                  const active = supplements.includes(s)
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => toggleItem(supplements, setSupplements, s)}
                      className={clsx(
                        'px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                        active
                          ? 'bg-[#7B5E4A] text-white shadow-2xs font-bold'
                          : 'bg-white border border-[#D1B89A] text-[#7B5E4A] hover:bg-[#F2E7D5]/40'
                      )}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Pregnancy, Clinician, Emergency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  PREGNANCY STATUS
                </label>
                <select
                  value={pregnancyStatus}
                  onChange={(e) => setPregnancyStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20]"
                >
                  <option>Not applicable</option>
                  <option>First Trimester</option>
                  <option>Second Trimester</option>
                  <option>Third Trimester</option>
                  <option>Lactation / Postpartum</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                  CLINICIAN OR DIETITIAN
                </label>
                <input
                  type="text"
                  placeholder="Dr. Rao"
                  value={clinicianName}
                  onChange={(e) => setClinicianName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                EMERGENCY CONTACT
              </label>
              <input
                type="text"
                placeholder="Name • phone"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20]"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block mb-1">
                NOTES FOR THE SAFETY ENGINE
              </label>
              <textarea
                rows={2}
                placeholder="Anything a clinician told you to avoid"
                value={safetyNotes}
                onChange={(e) => setSafetyNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] resize-none"
              />
            </div>

            {/* Disclaimer Checkbox (Matches PDF Page 7) */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="consentCheck"
                checked={consentAcknowledged}
                onChange={(e) => setConsentAcknowledged(e.target.checked)}
                className="mt-0.5 accent-[#7B5E4A] rounded"
              />
              <label htmlFor="consentCheck" className="text-[10.5px] text-[#7B5E4A] leading-tight">
                I understand NutriMind AI gives general nutrition information, not medical advice, and that I must verify ingredients and check with my clinician for medical decisions.
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#7B5E4A] hover:bg-[#3B2A20] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Safety Profile Saved!</span>
                </>
              ) : (
                <span>Save safety profile</span>
              )}
            </button>
          </form>
        </div>

        {/* ── Right Column: Testing Engine & Audit History (5 Cols - Matches PDF Page 6) ── */}
        <div className="lg:col-span-5 space-y-5">
          {/* Safety & Allergy Auditor Testing Box */}
          <div className="bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-[14px] font-bold text-[#3B2A20] font-heading">
              Safety & allergy auditor
            </h3>
            <p className="text-[11.5px] text-[#7B5E4A]">
              Check any food, meal or supplement against your recorded profile before you eat it.
            </p>

            <textarea
              rows={3}
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="e.g. Peanut chikki with jaggery, or a whey protein shake after training"
              className="w-full p-3 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] focus:ring-1 focus:ring-[#7B5E4A] resize-none"
            />

            <button
              onClick={() => executeAudit(testQuery)}
              disabled={auditing || !testQuery.trim()}
              className="w-full py-2 bg-[#7B5E4A] hover:bg-[#3B2A20] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{auditing ? 'Auditing Ingredients...' : 'Run safety check'}</span>
            </button>

            {/* Audit Result Display */}
            {auditResult && (
              <div className="p-3.5 bg-white border border-[#D1B89A] rounded-xl space-y-2 text-xs animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#3B2A20]">Safety Verdict:</span>
                  <span
                    className={clsx(
                      'text-[10px] font-black uppercase px-2 py-0.5 rounded-md',
                      auditResult.safetyVerdict === 'SAFE' && 'bg-emerald-100 text-emerald-800',
                      auditResult.safetyVerdict === 'CAUTION' && 'bg-amber-100 text-amber-800',
                      auditResult.safetyVerdict === 'FLAGGED' && 'bg-rose-100 text-rose-800'
                    )}
                  >
                    {auditResult.safetyVerdict}
                  </span>
                </div>

                {auditResult.flags.map((f: string, idx: number) => (
                  <p key={idx} className="text-rose-800 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-200">
                    ⚠ {f}
                  </p>
                ))}

                {auditResult.cautions.map((c: string, idx: number) => (
                  <p key={idx} className="text-amber-800 font-semibold bg-amber-50 p-2 rounded-lg border border-amber-200">
                    ⚡ {c}
                  </p>
                ))}

                {auditResult.flags.length === 0 && auditResult.cautions.length === 0 && (
                  <p className="text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Clean. Verified zero allergen conflicts with your profile.</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Audit History (Matches PDF Page 6 bottom) */}
          <div className="bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl p-5 shadow-xs">
            <h3 className="text-[14px] font-bold text-[#3B2A20] font-heading mb-1">
              Audit history
            </h3>
            <p className="text-[11.5px] text-[#7B5E4A] mb-3">
              Every check is stored so you can show it to a clinician.
            </p>

            <div className="space-y-2">
              {auditHistory.map((h, i) => (
                <div key={i} className="p-3 bg-white rounded-xl border border-[#D1B89A]/50 text-xs flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#3B2A20]">{h.query}</span>
                    <span
                      className={clsx(
                        'text-[9px] font-black uppercase px-1.5 py-0.5 rounded',
                        h.verdict === 'SAFE' && 'bg-emerald-100 text-emerald-800',
                        h.verdict === 'FLAGGED' && 'bg-rose-100 text-rose-800',
                        h.verdict === 'CAUTION' && 'bg-amber-100 text-amber-800'
                      )}
                    >
                      {h.verdict}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7B5E4A]">{h.reason}</p>
                  <span className="text-[9.5px] text-[#A67C52] font-semibold">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
