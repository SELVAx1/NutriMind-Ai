import { Card } from '@/components/ui/Card'

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="py-8">
      <Card padding="lg" className="text-center">
        <h2 className="text-xl font-heading font-bold mb-2">{title}</h2>
        <p className="text-sm text-text-secondary">This page is coming in Phase 2.</p>
      </Card>
    </div>
  )
}
