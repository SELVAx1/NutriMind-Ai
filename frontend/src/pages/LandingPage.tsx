import { Link } from 'react-router-dom'
import {
  Apple, ArrowRight, Camera, CalendarRange, MessageSquareText,
  ShieldCheck, Sparkles, RefreshCw, Search, Leaf, CheckCircle2,
  Utensils, BarChart3, Globe
} from 'lucide-react'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#3B2A20]">
      {/* Nav */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#3B2A20] flex items-center justify-center">
            <Apple className="w-[18px] h-[18px] text-[#F2E7D5] stroke-[2.5]" />
          </div>
          <span className="text-[17px] font-extrabold tracking-tight font-heading">
            NutriMind AI
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/auth/login"
            className="px-4 py-2 text-[13px] font-bold text-[#7B5E4A] hover:text-[#3B2A20] transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/auth/register"
            className="px-5 py-2.5 rounded-xl bg-[#3B2A20] hover:bg-[#7B5E4A] text-white text-[13px] font-bold transition-colors"
          >
            Get started free
          </Link>
        </div>
      </header>

      {/* Hero — left aligned */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#FAF7F0] border border-[#E8DCC8] text-[12px] font-semibold text-[#7B5E4A] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Verified by IFCT 2017 and ICMR-NIN dietary guidelines
          </div>

          <h1 className="text-[44px] sm:text-[56px] font-extrabold tracking-tight leading-[1.08] mb-5 font-heading">
            Indian nutrition tracking that actually understands your plate.
          </h1>

          <p className="text-[17px] text-[#7B5E4A] leading-relaxed mb-8 max-w-xl">
            Log idlis not oatmeal. Get meal plans within your budget. Snap a photo and know the macros. Every number comes from Indian food composition data, never from the AI guessing.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-10">
            <Link
              to="/auth/register"
              className="px-6 py-3 rounded-xl bg-[#3B2A20] hover:bg-[#7B5E4A] text-white font-bold text-[14px] transition-colors flex items-center gap-2"
            >
              Start tracking for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/auth/login"
              className="px-6 py-3 rounded-xl bg-[#FAF7F0] hover:bg-[#F2E7D5] text-[#3B2A20] font-bold text-[14px] border border-[#E8DCC8] transition-colors"
            >
              Sign in to your account
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-[12.5px] text-[#A67C52] font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% free, no credit card
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              40+ verified Indian foods
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Tamil, Hindi and English
            </span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#FAFAF8] border-y border-[#E8DCC8]/60">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-[28px] font-extrabold font-heading mb-3">How NutriMind works</h2>
          <p className="text-[15px] text-[#7B5E4A] mb-12 max-w-lg">
            Three steps from signing up to a fully tracked nutrition day with personalized ICMR targets.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#3B2A20] text-white flex items-center justify-center text-[14px] font-extrabold mb-4">1</div>
              <h3 className="text-[16px] font-bold font-heading mb-2">Set up your profile</h3>
              <p className="text-[13.5px] text-[#7B5E4A] leading-relaxed">
                Enter your age, weight, height, diet type and budget. NutriMind calculates your BMR, TDEE, and ICMR macro targets automatically.
              </p>
            </div>

            <div>
              <div className="w-10 h-10 rounded-lg bg-[#3B2A20] text-white flex items-center justify-center text-[14px] font-extrabold mb-4">2</div>
              <h3 className="text-[16px] font-bold font-heading mb-2">Log meals from the Indian database</h3>
              <p className="text-[13.5px] text-[#7B5E4A] leading-relaxed">
                Search from 40+ verified foods with IFCT 2017 data, or snap a plate photo and let Gemini Vision identify the dishes and portions.
              </p>
            </div>

            <div>
              <div className="w-10 h-10 rounded-lg bg-[#3B2A20] text-white flex items-center justify-center text-[14px] font-extrabold mb-4">3</div>
              <h3 className="text-[16px] font-bold font-heading mb-2">Get AI plans, swaps and insights</h3>
              <p className="text-[13.5px] text-[#7B5E4A] leading-relaxed">
                Generate budget-constrained meal plans, swap foods with protein parity, ask the RAG chatbot nutrition questions backed by ICMR evidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-[28px] font-extrabold font-heading mb-3">Built for Indian food, not western diets</h2>
        <p className="text-[15px] text-[#7B5E4A] mb-12 max-w-lg">
          Most trackers assume packaged salads and protein bars. NutriMind knows sambar, ragi porridge, and sundal.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: Camera,
              title: 'AI plate recognition',
              desc: 'Photograph your thali and Gemini Vision identifies each dish, estimates portions in grams, and looks up nutrition from the IFCT database.',
            },
            {
              icon: CalendarRange,
              title: 'Budget meal planner',
              desc: 'Generates 4-meal daily plans within your daily spend limit, respecting your diet type, cooking time, and regional cuisine.',
            },
            {
              icon: RefreshCw,
              title: 'NutriRescue recovery',
              desc: 'Ate biryani instead of dal rice? NutriRescue recalculates your remaining targets and suggests a compensating dinner.',
            },
            {
              icon: MessageSquareText,
              title: 'Evidence-backed AI chat',
              desc: 'Ask nutrition questions and get answers with inline citations from ICMR and WHO guidelines via RAG retrieval.',
            },
            {
              icon: Sparkles,
              title: 'What-if simulator',
              desc: 'Test food swaps before committing. See how replacing rice with ragi for 30 days affects your iron, protein, and budget.',
            },
            {
              icon: ShieldCheck,
              title: 'Clinical safety guard',
              desc: 'Logs your allergies, medications, and conditions. Every food suggestion is screened for allergen conflicts and drug interactions.',
            },
            {
              icon: Search,
              title: 'Smart food swap',
              desc: 'Click swap on any meal and get 3 alternatives matched by protein, cost, and diet compatibility with explanations.',
            },
            {
              icon: Utensils,
              title: 'Grocery intelligence',
              desc: 'Auto-generates a shopping list from your meal plan. Aggregates quantities, estimates cost, and groups by aisle.',
            },
            {
              icon: Globe,
              title: 'Multilingual support',
              desc: 'Food names in English, Tamil, and Hindi. Chat with the AI coach in 6 Indian languages including Telugu, Kannada, and Bengali.',
            },
          ].map(f => (
            <div key={f.title} className="p-5 rounded-2xl border border-[#E8DCC8] hover:border-[#D1B89A] transition-colors">
              <f.icon className="w-5 h-5 text-[#7B5E4A] mb-3" />
              <h3 className="text-[14.5px] font-bold font-heading mb-1.5">{f.title}</h3>
              <p className="text-[13px] text-[#7B5E4A] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack / trust */}
      <section className="bg-[#FAFAF8] border-y border-[#E8DCC8]/60">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-[20px] font-extrabold font-heading mb-8 text-center">What powers NutriMind</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {[
              { label: 'React 19', sub: 'Frontend' },
              { label: 'FastAPI', sub: 'Backend' },
              { label: 'Supabase', sub: 'Auth & Database' },
              { label: 'Groq + Qwen', sub: 'Primary LLM' },
              { label: 'Gemini Flash', sub: 'Vision & Embeddings' },
              { label: 'pgvector', sub: 'RAG Retrieval' },
            ].map(t => (
              <div key={t.label} className="p-4 rounded-xl bg-white border border-[#E8DCC8]">
                <p className="text-[14px] font-bold text-[#3B2A20]">{t.label}</p>
                <p className="text-[11.5px] text-[#A67C52] mt-0.5">{t.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data sources */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[22px] font-extrabold font-heading mb-3">
            Numbers you can trust
          </h2>
          <p className="text-[14px] text-[#7B5E4A] leading-relaxed mb-8">
            Every calorie, protein gram, and iron milligram in NutriMind comes from deterministic calculation against peer-reviewed Indian food composition data. The AI generates plans and explanations, never the nutrition numbers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[13px] font-semibold text-[#7B5E4A]">
            <span className="px-4 py-2 rounded-lg bg-[#FAF7F0] border border-[#E8DCC8]">IFCT 2017 (NIN Hyderabad)</span>
            <span className="px-4 py-2 rounded-lg bg-[#FAF7F0] border border-[#E8DCC8]">ICMR-NIN RDA 2020</span>
            <span className="px-4 py-2 rounded-lg bg-[#FAF7F0] border border-[#E8DCC8]">WHO Nutrition Guidelines</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-[#3B2A20] rounded-2xl px-8 py-12 sm:py-14 text-center">
          <h2 className="text-[26px] sm:text-[32px] font-extrabold text-white font-heading mb-3">
            Start eating better today
          </h2>
          <p className="text-[14px] text-[#D1B89A] mb-8 max-w-md mx-auto">
            Free forever. No credit card. Set up your profile in under 2 minutes and get your first personalized meal plan.
          </p>
          <Link
            to="/auth/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-[#FAF7F0] text-[#3B2A20] font-bold text-[14px] transition-colors"
          >
            Create your free account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8DCC8]/60 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#A67C52]">
          <div className="flex items-center gap-2">
            <Apple className="w-3.5 h-3.5" />
            <span className="font-bold text-[#3B2A20]">NutriMind AI</span>
          </div>
          <p>Built with ICMR-NIN and IFCT 2017 scientific data. Not a substitute for medical advice.</p>
        </div>
      </footer>
    </div>
  )
}
