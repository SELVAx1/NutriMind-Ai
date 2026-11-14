import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Stethoscope, Users, CheckCircle, AlertTriangle, Eye, ClipboardCheck,
  Activity, MessageSquare, UserCheck, BarChart3, FileText, ShieldCheck,
} from 'lucide-react'

export function NutritionistPage() {
  const [view, setView] = useState<'overview' | 'demo'>('overview')

  return (
    <div className="page-container animate-fade-in flex flex-col gap-7">
      {/* ═══════════ HEADER ═══════════ */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight leading-tight">Nutritionist Dashboard</h1>
          <p className="text-[13px] text-text-muted mt-1.5">Manage clients, review meal plans, and monitor nutrition progress.</p>
        </div>
        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
          <Stethoscope size={20} className="text-primary" />
        </div>
      </div>

      {/* ═══════════ TABS ═══════════ */}
      <div className="flex gap-1 p-1 rounded-lg bg-surface-2 border border-border w-fit">
        {(['overview', 'demo'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setView(tab)}
            className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-all cursor-pointer capitalize ${
              view === tab
                ? 'bg-surface-4 text-text shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab === 'overview' ? 'Overview' : 'Demo Mode'}
          </button>
        ))}
      </div>

      {/* ═══════════ OVERVIEW TAB ═══════════ */}
      {view === 'overview' && (
        <div className="flex flex-col gap-6">
          {/* Empty State */}
          <Card padding="xl">
            <div className="py-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mb-5">
                <Users size={26} className="text-text-dim" />
              </div>
              <h3 className="text-[18px] font-bold mb-2">No clients assigned yet</h3>
              <p className="text-[13px] text-text-muted max-w-md mb-2 leading-relaxed">
                When clients are assigned to you, their profiles, meal plans, and nutrition data will appear here.
              </p>
              <p className="text-[12px] text-text-dim max-w-sm">
                Nutritionist accounts are role-gated. Contact an admin to set up client assignments.
              </p>
            </div>
          </Card>

          {/* Features Grid */}
          <div>
            <h2 className="text-[16px] font-bold mb-4">Features Available</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: UserCheck, label: 'Client Profiles', desc: 'View dietary preferences, allergies, nutrition targets, and health context for each assigned client.', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { icon: Activity, label: 'Intake Monitoring', desc: 'Track daily and weekly food intake, calorie/protein/iron progress against targets.', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { icon: ClipboardCheck, label: 'Meal Plan Review', desc: 'Review AI-generated meal plans, approve or suggest modifications before they reach the client.', color: 'text-violet-400', bg: 'bg-violet-500/10' },
                { icon: BarChart3, label: 'Feedback & Progress', desc: 'See client feedback on meals, identify recurring issues, and track improvement over time.', color: 'text-amber-400', bg: 'bg-amber-500/10' },
              ].map(f => (
                <Card key={f.label} padding="lg" hover>
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-lg ${f.bg} border border-border flex items-center justify-center flex-shrink-0`}>
                      <f.icon size={18} className={f.color} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[14px] font-semibold mb-1">{f.label}</h3>
                      <p className="text-[12px] text-text-muted leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ DEMO TAB ═══════════ */}
      {view === 'demo' && (
        <div className="flex flex-col gap-6">
          {/* Demo banner */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <ShieldCheck size={16} className="text-amber-400 flex-shrink-0" />
            <p className="text-[12px] text-amber-300/90">Demo mode — sample data shown for preview purposes only.</p>
          </div>

          {/* Client Card */}
          <Card padding="lg" glow="#F59E0B">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/25 flex items-center justify-center">
                  <span className="text-[18px] font-bold text-amber-400">K</span>
                </div>
                <div>
                  <h3 className="text-[16px] font-bold">Kaniska</h3>
                  <p className="text-[12px] text-text-muted mt-0.5">Vegetarian · South Indian · ₹200/day budget</p>
                </div>
              </div>
              <Badge variant="success" size="md">Active</Badge>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Calories', value: '195', unit: 'kcal', color: '#F59E0B' },
                { label: 'Protein', value: '5.8', unit: 'g', color: '#8B5CF6' },
                { label: 'Iron', value: '1.2', unit: 'mg', color: '#EF4444' },
                { label: 'Spent', value: '₹25', unit: 'today', color: '#10B981' },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl bg-surface-2 border border-border text-center">
                  <p className="text-[11px] text-text-dim uppercase tracking-wider font-medium mb-1">{s.label}</p>
                  <p className="text-[20px] font-extrabold tabular-nums" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[11px] text-text-dim">{s.unit}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" size="sm"><Eye size={14} /> View Details</Button>
              <Button variant="secondary" size="sm"><FileText size={14} /> Review Plan</Button>
            </div>
          </Card>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Recent Feedback */}
            <Card padding="lg">
              <h3 className="text-[14px] font-bold mb-4 flex items-center gap-2">
                <MessageSquare size={15} className="text-text-dim" /> Recent Feedback
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-2 border border-border">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle size={14} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[13px] text-text-secondary leading-relaxed">
                      "Dosa takes too long in the morning"
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] text-text-dim">Kaniska</span>
                      <Badge variant="quick">time</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-2 border border-border">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={14} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[13px] text-text-secondary leading-relaxed">
                      Followed meal plan for 3 consecutive days
                    </p>
                    <span className="text-[11px] text-text-dim mt-1 inline-block">Kaniska · Achievement</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pending Approvals */}
            <Card padding="lg">
              <h3 className="text-[14px] font-bold mb-4 flex items-center gap-2">
                <ClipboardCheck size={15} className="text-text-dim" /> Pending Approvals
              </h3>
              <div className="p-4 rounded-xl bg-surface-2 border border-border">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-semibold">Weekly plan for Kaniska</p>
                    <p className="text-[12px] text-text-muted mt-1">Generated Nov 10, 2026</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[11px] text-text-dim font-mono tabular-nums">₹980 estimated</span>
                      <Badge variant="budget">7 days</Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button size="sm">Approve</Button>
                    <Button size="sm" variant="ghost">Modify</Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
