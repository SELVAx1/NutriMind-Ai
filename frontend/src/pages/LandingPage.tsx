import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Leaf, Camera, Brain, ShoppingCart, MessageCircle, BarChart3 } from 'lucide-react'

const features = [
  { icon: Camera, title: 'Food Recognition', desc: 'Upload a photo and get instant nutrition breakdown' },
  { icon: Brain, title: 'AI Meal Planning', desc: 'Personalized plans within your budget and diet' },
  { icon: MessageCircle, title: 'Nutrition Chatbot', desc: 'Ask questions, get evidence-backed answers' },
  { icon: ShoppingCart, title: 'Smart Grocery', desc: 'Auto-generated lists with cost estimates' },
  { icon: BarChart3, title: 'NutriTwin', desc: 'Track patterns and simulate diet changes' },
  { icon: Leaf, title: 'Regional Foods', desc: 'Built for Indian cuisine — idli to ragi kali' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-bold">N</span>
          </div>
          <span className="font-heading font-bold text-xl text-primary">NutriMind</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        <section className="py-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-text leading-tight max-w-3xl mx-auto">
            Nutrition that fits your plate and your wallet.
          </h1>
          <p className="text-lg text-text-secondary mt-5 max-w-xl mx-auto">
            AI-powered meal planning, food recognition, and nutrition tracking — built for Indian food habits, affordability, and your dietary goals.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link to="/register">
              <Button size="lg">Start for free</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">Sign in</Button>
            </Link>
          </div>
        </section>

        <section className="py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card rounded-2xl border border-border p-6">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-base mb-1">{title}</h3>
                <p className="text-sm text-text-secondary">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 text-center">
          <p className="text-sm text-text-muted">
            Powered by Groq, Google AI, and verified Indian food databases.
            Free to use. No credit card required.
          </p>
        </section>
      </main>
    </div>
  )
}
