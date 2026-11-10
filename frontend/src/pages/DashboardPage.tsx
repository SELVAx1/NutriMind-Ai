import { useAuth } from '@/contexts/AuthContext'
import { useDashboard } from '@/hooks/useDashboard'
import { PlateRing } from '@/components/dashboard/PlateRing'
import { StatCard } from '@/components/dashboard/StatCard'
import { GapInsight } from '@/components/dashboard/GapInsight'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Link, Navigate } from 'react-router-dom'
import { Plus } from 'lucide-react'

export function DashboardPage() {
  const { user } = useAuth()
  const dashboard = useDashboard()

  if (dashboard.loading) {
    return <div className="py-12 text-center text-text-muted">Loading your dashboard...</div>
  }

  if (!dashboard.hasProfile) {
    return <Navigate to="/onboarding" replace />
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const name = user?.user_metadata?.full_name || dashboard.name

  return (
    <div className="pb-8">
      <div className="mb-6 md:hidden">
        <h1 className="text-xl font-heading font-bold">{greeting}, {name}!</h1>
        <p className="text-sm text-text-secondary">
          Your next meal is {dashboard.nextMeal}. Budget:{' '}
          <span className="font-heading font-bold text-accent">₹{dashboard.budgetDaily}</span>/day
        </p>
      </div>

      <p className="hidden md:block text-sm text-text-secondary mb-6">
        Your next meal is {dashboard.nextMeal}. Daily budget:{' '}
        <span className="font-heading font-bold text-accent">₹{dashboard.budgetDaily}</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {dashboard.todaysMeals.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-heading font-semibold">Today's meals</h2>
                <div className="flex items-center gap-2">
                  <Link to="/tracker" className="text-sm text-primary font-medium hover:underline">
                    View tracker →
                  </Link>
                  <Link to="/food">
                    <Button size="sm" variant="secondary"><Plus size={14} /> Log</Button>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {dashboard.todaysMeals.map((meal) => (
                  <Card key={meal.id} padding="sm">
                    <div className="h-16 bg-border-light rounded-lg flex items-center justify-center text-2xl mb-2">🍛</div>
                    <p className="text-xs font-medium truncate">{meal.name}</p>
                    {meal.nameTamil && (
                      <p className="font-tamil text-[10px] text-text-muted truncate">{meal.nameTamil}</p>
                    )}
                    <p className="text-[10px] text-text-muted mt-0.5">
                      {meal.quantity}g · {meal.calories} kcal · {meal.protein}g protein
                    </p>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card padding="lg" className="text-center">
              <p className="text-3xl mb-3">🍽️</p>
              <h3 className="font-heading font-semibold mb-1">No meals logged today</h3>
              <p className="text-sm text-text-secondary mb-4">Log what you ate to see your nutrition progress.</p>
              <Link to="/food"><Button>Log your first meal</Button></Link>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-2xl border border-border p-5 flex flex-col items-center">
            <div className="relative">
              <PlateRing
                current={dashboard.dailyNutrition.protein}
                target={dashboard.targets.protein}
                label="protein"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Energy so far"
              value={`${dashboard.dailyNutrition.calories.toLocaleString()} kcal`}
            />
            <StatCard
              label="Target"
              value={`${dashboard.targets.calories.toLocaleString()} kcal`}
              color="var(--color-primary)"
            />
            <StatCard
              label="Fibre"
              value={`${dashboard.dailyNutrition.fibre} g of ${dashboard.targets.fibre} g`}
              color="var(--color-fibre)"
            />
            <StatCard
              label="Fat"
              value={`${dashboard.dailyNutrition.fat} g of ${dashboard.targets.fat} g`}
              color="var(--color-fat)"
            />
          </div>

          {dashboard.gaps.length > 0 && (
            <>
              {dashboard.gaps.slice(0, 2).map((gap) => (
                <GapInsight key={gap.nutrient} {...gap} />
              ))}
            </>
          )}

          <QuickActions />
        </div>
      </div>
    </div>
  )
}
