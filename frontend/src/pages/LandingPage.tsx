import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Leaf, Camera, Brain, ShoppingBasket, MessageSquareText, BarChart3, ArrowRight } from 'lucide-react'

const features = [
  { icon: Camera, title: 'Food Recognition', desc: 'Upload a photo — AI identifies Indian foods and calculates nutrition instantly.', color: 'text-amber-400 bg-amber-500/15' },
  { icon: Brain, title: 'AI Meal Planning', desc: 'Constrained plans within your budget, dietary preferences and cooking time.', color: 'text-primary bg-primary/15' },
  { icon: MessageSquareText, title: 'RAG Chatbot', desc: 'Cited answers grounded in ICMR-NIN and WHO nutrition guidelines.', color: 'text-violet-400 bg-violet-500/15' },
  { icon: ShoppingBasket, title: 'Smart Grocery', desc: 'Auto-generated shopping lists with aggregated quantities and costs.', color: 'text-blue-400 bg-blue-500/15' },
  { icon: BarChart3, title: 'NutriTwin Analytics', desc: 'Track patterns, detect deficiencies and simulate diet changes.', color: 'text-red-400 bg-red-500/15' },
  { icon: Leaf, title: 'Indian Food Focus', desc: 'Built for regional cuisines with 40+ foods from IFCT 2017 data.', color: 'text-teal-400 bg-teal-500/15' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-0">
      <header className="flex items-center justify-between h-16 px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-[0_2px_8px_rgba(16,185,129,0.3)]">
            <span className="text-white text-[11px] font-bold">N</span>
          </div>
          <span className="font-semibold text-[15px] tracking-tight">NutriMind</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/register"><Button size="sm">Get started <ArrowRight size={14} /></Button></Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8">
        <section className="pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold mb-6">
            <Leaf size={12} /> AI-Powered Nutrition for India
          </div>
          <h1 className="text-[40px] md:text-[52px] font-extrabold leading-[1.1] tracking-tight max-w-3xl mx-auto">
            Nutrition that fits your plate{' '}
            <span className="text-primary">and your wallet</span>
          </h1>
          <p className="text-[15px] text-text-secondary mt-5 max-w-lg mx-auto leading-relaxed">
            Intelligent meal planning, food recognition, and evidence-backed nutrition tracking — built for Indian food habits and affordability.
          </p>
          <div className="flex justify-center gap-3 mt-10">
            <Link to="/register"><Button size="lg">Start for free <ArrowRight size={16} /></Button></Link>
            <Link to="/login"><Button variant="secondary" size="lg">Sign in</Button></Link>
          </div>
          <p className="text-[11px] text-text-dim mt-4">Free forever. No credit card required.</p>
        </section>

        <section className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-surface-1 rounded-xl border border-border p-6 hover:border-text-dim/40 hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all group">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${color}`}>
                <Icon size={20} />
              </div>
              <h3 className="text-[14px] font-semibold mb-1.5">{title}</h3>
              <p className="text-[12px] text-text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </section>

        <section className="py-10 text-center border-t border-border">
          <p className="text-[11px] text-text-dim">Powered by Groq, Google AI, Supabase, and Indian Food Composition Tables (IFCT 2017).</p>
        </section>
      </main>
    </div>
  )
}
