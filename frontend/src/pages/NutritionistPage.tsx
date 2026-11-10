import { useState, useEffect } from 'react'
import { apiGet, apiPost } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Stethoscope, Users, CheckCircle, AlertTriangle } from 'lucide-react'

interface ClientSummary {
  profile: Record<string, unknown>
  targets: Record<string, number> | null
  today_nutrition: Record<string, number>
  active_plan: Record<string, unknown> | null
  recent_feedback: Record<string, unknown>[]
}

export function NutritionistPage() {
  const [view, setView] = useState<'overview' | 'demo'>('overview')

  return (
    <div className="py-6">
      <h1 className="text-xl font-heading font-bold flex items-center gap-2 mb-1">
        <Stethoscope size={22} className="text-primary" />
        Nutritionist Dashboard
      </h1>
      <p className="text-sm text-text-secondary mb-6">Manage clients, review meal plans, and monitor nutrition progress.</p>

      <div className="flex gap-2 mb-6">
        <Button variant={view === 'overview' ? 'primary' : 'secondary'} size="sm" onClick={() => setView('overview')}>Overview</Button>
        <Button variant={view === 'demo' ? 'primary' : 'secondary'} size="sm" onClick={() => setView('demo')}>Demo Mode</Button>
      </div>

      {view === 'overview' && (
        <div className="space-y-4">
          <Card padding="lg" className="text-center">
            <Users size={40} className="text-text-muted mx-auto mb-3" />
            <h3 className="font-heading font-semibold mb-1">No clients assigned yet</h3>
            <p className="text-sm text-text-secondary mb-4">
              When clients are assigned to you, their profiles, meal plans, and nutrition data will appear here.
            </p>
            <p className="text-xs text-text-muted">
              Nutritionist accounts are role-gated. Contact an admin to set up client assignments.
            </p>
          </Card>

          <h2 className="text-base font-heading font-semibold">Features Available</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card padding="md">
              <h3 className="text-sm font-semibold mb-1">Client Profiles</h3>
              <p className="text-xs text-text-secondary">View dietary preferences, allergies, nutrition targets, and health context for each assigned client.</p>
            </Card>
            <Card padding="md">
              <h3 className="text-sm font-semibold mb-1">Intake Monitoring</h3>
              <p className="text-xs text-text-secondary">Track daily and weekly food intake, calorie/protein/iron progress against targets.</p>
            </Card>
            <Card padding="md">
              <h3 className="text-sm font-semibold mb-1">Meal Plan Review</h3>
              <p className="text-xs text-text-secondary">Review AI-generated meal plans, approve or suggest modifications before they reach the client.</p>
            </Card>
            <Card padding="md">
              <h3 className="text-sm font-semibold mb-1">Feedback & Progress</h3>
              <p className="text-xs text-text-secondary">See client feedback on meals, identify recurring issues, and track improvement over time.</p>
            </Card>
          </div>
        </div>
      )}

      {view === 'demo' && (
        <div className="space-y-4">
          <Card padding="md" className="border-l-4 border-l-accent">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-sm">Kaniska</h3>
                <p className="text-xs text-text-secondary">Vegetarian · South Indian · ₹200/day budget</p>
              </div>
              <Badge variant="vegan">Active</Badge>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs mt-3">
              <div><p className="font-heading font-bold">195</p><p className="text-text-muted">kcal today</p></div>
              <div><p className="font-heading font-bold text-protein">5.8g</p><p className="text-text-muted">protein</p></div>
              <div><p className="font-heading font-bold text-danger">1.2mg</p><p className="text-text-muted">iron</p></div>
              <div><p className="font-heading font-bold text-accent">₹25</p><p className="text-text-muted">spent</p></div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="secondary">View Details</Button>
              <Button size="sm" variant="secondary">Review Plan</Button>
            </div>
          </Card>

          <Card padding="md">
            <h3 className="text-sm font-semibold mb-2">Recent Client Feedback</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <AlertTriangle size={14} className="text-warning" />
                <span className="text-text-secondary">Kaniska: "Dosa takes too long in the morning" — <Badge variant="quick">time</Badge></span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle size={14} className="text-success" />
                <span className="text-text-secondary">Kaniska: Followed meal plan for 3 consecutive days</span>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <h3 className="text-sm font-semibold mb-2">Pending Approvals</h3>
            <div className="flex items-center justify-between p-3 rounded-xl bg-border-light">
              <div>
                <p className="text-sm font-medium">Weekly plan for Kaniska</p>
                <p className="text-xs text-text-muted">Generated Nov 10, 2026 · ₹980 estimated</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="primary">Approve</Button>
                <Button size="sm" variant="ghost">Modify</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
