import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useClinicalSafety } from '@/hooks/useClinicalSafety'
import {
  Mail, Download, X
} from 'lucide-react'
import clsx from 'clsx'

function formatWhen(isoString: string): string {
  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return isoString
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday = date.toDateString() === yesterday.toDateString()

    const time = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })

    if (isToday) return `Today, ${time}`
    if (isYesterday) return `Yesterday, ${time}`
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + `, ${time}`
  } catch {
    return isoString
  }
}

function getDateStr(isoString: string): string {
  try {
    return new Date(isoString).toISOString().split('T')[0]
  } catch {
    return ''
  }
}

export function AuditTrailPage() {
  const { auditLogs } = useClinicalSafety()
  const { user } = useAuth()

  const today = new Date().toISOString().split('T')[0]
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]

  const [fromDate, setFromDate] = useState(weekAgo)
  const [toDate, setToDate] = useState(today)
  const [mealFilter, setMealFilter] = useState('All meals')
  const [safetyFilter, setSafetyFilter] = useState('All')
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailAddress, setEmailAddress] = useState(user?.email || '')

  const filteredLogs = auditLogs.filter(log => {
    if (mealFilter !== 'All meals' && log.meal !== mealFilter) return false
    if (safetyFilter === 'Safe only' && log.safety !== 'SAFE') return false
    if (safetyFilter === 'Flagged only' && log.safety !== 'FLAGGED') return false
    if (safetyFilter === 'Caution only' && log.safety !== 'CAUTION') return false

    const logDate = getDateStr(log.when)
    if (logDate && fromDate && logDate < fromDate) return false
    if (logDate && toDate && logDate > toDate) return false

    return true
  })

  const totalEntries = filteredLogs.length
  const totalCalories = filteredLogs.reduce((acc, l) => acc + l.calories, 0)
  const totalProtein = filteredLogs.reduce((acc, l) => acc + l.protein, 0)
  const avgKcal = totalEntries > 0 ? Math.round(totalCalories / totalEntries) : 0
  const avgProtein = totalEntries > 0 ? Math.round(totalProtein / totalEntries) : 0
  const flaggedCount = filteredLogs.filter(l => l.safety === 'FLAGGED').length

  const handleExportCSV = () => {
    const headers = ['ID', 'Food', 'Meal', 'Calories', 'Protein (g)', 'Safety Verdict', 'Safety Reason', 'Timestamp', 'Verified DB']
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.food}"`,
      l.meal,
      l.calories,
      l.protein,
      l.safety,
      `"${l.safetyReason || ''}"`,
      `"${l.when}"`,
      l.databaseSource,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `nutrimind_audit_trail_${fromDate}_to_${toDate}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSendWeeklyReport = (e: React.FormEvent) => {
    e.preventDefault()
    setEmailSent(true)
    setTimeout(() => {
      setEmailSent(false)
      setEmailModalOpen(false)
    }, 3000)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#A67C52] block mb-1">
            AUDIT TRAIL
          </span>
          <h1 className="text-[28px] font-extrabold text-[#3B2A20] font-heading tracking-tight leading-tight">
            Logs & audit trail
          </h1>
          <p className="text-[13px] text-[#7B5E4A] mt-0.5">
            Every logged item with its safety verdict. Filter by period, meal or status, then export for your clinician.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setEmailModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#7B5E4A] hover:bg-[#3B2A20] text-white text-[12.5px] font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Email my week</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl border border-[#D1B89A] bg-white hover:bg-[#F2E7D5]/40 text-[#7B5E4A] text-[12.5px] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl p-5 shadow-xs space-y-3">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block">
          Filters
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-[10.5px] font-bold text-[#7B5E4A] block mb-1">FROM</label>
            <input
              type="date"
              value={fromDate}
              max={today}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] font-medium focus:ring-1 focus:ring-[#7B5E4A]"
            />
          </div>
          <div>
            <label className="text-[10.5px] font-bold text-[#7B5E4A] block mb-1">TO</label>
            <input
              type="date"
              value={toDate}
              max={today}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] font-medium focus:ring-1 focus:ring-[#7B5E4A]"
            />
          </div>
          <div>
            <label className="text-[10.5px] font-bold text-[#7B5E4A] block mb-1">MEAL</label>
            <select
              value={mealFilter}
              onChange={(e) => setMealFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] font-medium focus:ring-1 focus:ring-[#7B5E4A]"
            >
              <option>All meals</option>
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
            </select>
          </div>
          <div>
            <label className="text-[10.5px] font-bold text-[#7B5E4A] block mb-1">SAFETY</label>
            <select
              value={safetyFilter}
              onChange={(e) => setSafetyFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#D1B89A]/80 rounded-xl text-xs text-[#3B2A20] font-medium focus:ring-1 focus:ring-[#7B5E4A]"
            >
              <option>All</option>
              <option>Safe only</option>
              <option>Caution only</option>
              <option>Flagged only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block">Entries</span>
          <p className="text-[24px] font-extrabold text-[#3B2A20] font-heading mt-1">{totalEntries}</p>
        </div>
        <div className="p-4 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block">Avg kcal / entry</span>
          <p className="text-[24px] font-extrabold text-[#3B2A20] font-heading mt-1">{avgKcal}</p>
        </div>
        <div className="p-4 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block">Avg protein / entry</span>
          <p className="text-[24px] font-extrabold text-[#7B5E4A] font-heading mt-1">{avgProtein} g</p>
        </div>
        <div className="p-4 bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52] block">Flagged</span>
          <p className={clsx("text-[24px] font-extrabold font-heading mt-1", flaggedCount > 0 ? "text-[#8F3325]" : "text-[#3B2A20]")}>{flaggedCount}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-[#3B2A20]">{filteredLogs.length} entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D1B89A]/60 text-[10px] font-extrabold uppercase tracking-wider text-[#A67C52]">
                <th className="py-2.5 px-3">Food</th>
                <th className="py-2.5 px-3">Meal</th>
                <th className="py-2.5 px-3">Calories</th>
                <th className="py-2.5 px-3">Protein</th>
                <th className="py-2.5 px-3">Safety</th>
                <th className="py-2.5 px-3">Source</th>
                <th className="py-2.5 px-3">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D1B89A]/30 text-[12.5px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/60 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-[#3B2A20]">
                    <div>{log.food}</div>
                    {log.safetyReason && (
                      <span className="text-[10.5px] font-normal text-[#7B5E4A] block mt-0.5">{log.safetyReason}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-[#7B5E4A] font-semibold">{log.meal}</td>
                  <td className="py-3.5 px-3 font-bold text-[#3B2A20]">{log.calories} kcal</td>
                  <td className="py-3.5 px-3 font-bold text-[#7B5E4A]">{log.protein}g</td>
                  <td className="py-3.5 px-3">
                    <span className={clsx(
                      'text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block',
                      log.safety === 'SAFE' && 'bg-emerald-100 text-emerald-800 border border-emerald-300',
                      log.safety === 'CAUTION' && 'bg-amber-100 text-amber-800 border border-amber-300',
                      log.safety === 'FLAGGED' && 'bg-rose-100 text-rose-800 border border-rose-300'
                    )}>
                      {log.safety}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-[11px] font-mono font-medium text-[#7B5E4A]">
                    {log.databaseSource} ({log.confidenceScore}%)
                  </td>
                  <td className="py-3.5 px-3 text-[11px] text-[#A67C52] font-semibold whitespace-nowrap">
                    {formatWhen(log.when)}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#7B5E4A] text-xs">
                    {auditLogs.length === 0
                      ? 'No audit entries yet. Use the Dashboard or AI Intelligence to analyze meals.'
                      : 'Nothing matches these filters. Try adjusting the date range or filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3B2A20]/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-[#D1B89A] rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#D1B89A]/40 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#7B5E4A]" />
                <h3 className="font-extrabold text-[16px] text-[#3B2A20] font-heading">Email Weekly Recap</h3>
              </div>
              <button onClick={() => setEmailModalOpen(false)} className="p-1 rounded-lg text-[#7B5E4A] hover:bg-[#FAF7F0] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendWeeklyReport} className="space-y-4">
              <p className="text-xs text-[#7B5E4A]">
                Send an audited summary of your intake, macro compliance, and safety flags.
              </p>
              <div>
                <label className="text-[11px] font-bold text-[#3B2A20] block mb-1">Recipient Email</label>
                <input
                  type="email"
                  required
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D1B89A] rounded-xl text-xs text-[#3B2A20] focus:ring-1 focus:ring-[#7B5E4A]"
                />
              </div>

              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#D1B89A]/50 space-y-1.5 text-[11px] text-[#7B5E4A]">
                <div className="flex justify-between font-bold text-[#3B2A20]">
                  <span>Period:</span>
                  <span>{fromDate} to {toDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Entries:</span>
                  <span>{filteredLogs.length} items</span>
                </div>
                <div className="flex justify-between">
                  <span>Flagged:</span>
                  <span className={flaggedCount > 0 ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}>
                    {flaggedCount > 0 ? `${flaggedCount} flagged` : 'All clear'}
                  </span>
                </div>
              </div>

              {emailSent ? (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold text-center">
                  Email service not configured yet. Use Export CSV instead.
                </div>
              ) : (
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEmailModalOpen(false)}
                    className="px-4 py-2 border border-[#D1B89A] rounded-xl text-xs font-bold text-[#7B5E4A] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#7B5E4A] hover:bg-[#3B2A20] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    Send Weekly Report
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
