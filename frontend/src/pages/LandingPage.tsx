import { Link } from 'react-router-dom'
import {
  Apple, ArrowRight, Sparkles, Camera,
  CalendarRange, RefreshCw, CheckCircle2
} from 'lucide-react'

export function LandingPage() {
  return (
    <div className="min-h-screen text-[#3B2A20]">
      {/* Navigation Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7B5E4A] to-[#3B2A20] flex items-center justify-center text-white shadow-md shadow-[#7B5E4A]/30 group-hover:scale-105 transition-transform">
            <Apple className="w-5 h-5 text-[#F2E7D5] stroke-[2.5]" />
          </div>
          <span className="brand-name text-[18px] font-extrabold tracking-tight text-[#3B2A20] font-heading">
            Nutri<span className="text-[#7B5E4A]">Mind</span> AI
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/auth/login"
            className="px-4 py-2 text-sm font-bold text-[#7B5E4A] hover:text-[#3B2A20] transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-2xl bg-[#7B5E4A] hover:bg-[#3B2A20] text-white text-sm font-bold shadow-md shadow-[#7B5E4A]/25 transition-all flex items-center gap-2"
          >
            <span>Live Demo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-16 text-center">
        {/* Verification Pill */}
        <div className="badge-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F2E7D5] border border-[#D1B89A] text-[11px] font-bold text-[#7B5E4A] mb-6 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#7B5E4A] animate-pulse" />
          <span>Built for Real Indian Food Habits • Verified by IFCT 2017 & ICMR-NIN RDA</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#3B2A20] leading-[1.15] mb-6 font-heading">
          Eat well, within your budget.{' '}
          <span className="text-[#7B5E4A]">Tailored for Indian plates.</span>
        </h1>

        {/* Hero Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#7B5E4A] leading-relaxed mb-8 font-body">
          Accurate, zero-hallucination nutrition tracking. Snap a plate photo, get budget-smart daily meal plans, swap ingredients with protein parity, and recover from meal deviations with NutriRescue.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
          <Link
            to="/auth/register"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#7B5E4A] hover:bg-[#3B2A20] text-white font-bold text-sm shadow-lg shadow-[#7B5E4A]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Start Tracking for Free</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-[#FAF7F0] text-[#3B2A20] font-bold text-sm border border-[#D1B89A] shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <span>⚡ Explore Live Demo Account</span>
          </Link>
        </div>

        {/* Badges Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[12px] font-semibold text-[#7B5E4A]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#7B5E4A]" />
            <span>₹0 Free Tier Forever</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#7B5E4A]" />
            <span>ICMR-NIN 2020 RDA Formulas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#7B5E4A]" />
            <span>English, Tamil & Hindi Names</span>
          </div>
        </div>
      </section>

      {/* Floating Interactive Live Preview Container */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="bg-white border border-[#D1B89A] rounded-[36px] shadow-[0_30px_90px_rgba(59,42,32,0.12)] p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-[#D1B89A]/30 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F2E7D5] text-[#7B5E4A] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="card-title text-[15px] font-bold text-[#3B2A20] font-heading">
                  Live Nutrition Intelligence Preview
                </h3>
                <p className="card-subtitle text-[11.5px] text-[#7B5E4A]">
                  Target: 2,100 kcal • ₹200/day Budget • South Indian Vegetarian
                </p>
              </div>
            </div>

            <div className="badge-pill flex items-center gap-2 bg-[#F2E7D5] px-3.5 py-1.5 rounded-full text-[11px] font-bold text-[#7B5E4A] border border-[#D1B89A]">
              <span className="w-2 h-2 rounded-full bg-[#7B5E4A]" />
              <span>78% of Daily Target Met</span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#D1B89A]/60">
              <p className="eyebrow-label text-[10px] font-bold text-[#7B5E4A] uppercase">Protein</p>
              <p className="stat-large text-[22px] font-extrabold text-[#3B2A20] mt-0.5 font-heading">78g <span className="text-xs text-[#7B5E4A] font-normal font-body">/ 90g</span></p>
              <div className="w-full bg-[#F2E7D5] h-1.5 rounded-full mt-2">
                <div className="bg-[#7B5E4A] h-1.5 rounded-full" style={{ width: '87%' }} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#D1B89A]/60">
              <p className="eyebrow-label text-[10px] font-bold text-[#7B5E4A] uppercase">Iron (Fe)</p>
              <p className="stat-large text-[22px] font-extrabold text-[#A67C52] mt-0.5 font-heading">14.2mg <span className="text-xs text-[#7B5E4A] font-normal font-body">/ 19mg</span></p>
              <div className="w-full bg-[#F2E7D5] h-1.5 rounded-full mt-2">
                <div className="bg-[#A67C52] h-1.5 rounded-full" style={{ width: '74%' }} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#D1B89A]/60">
              <p className="eyebrow-label text-[10px] font-bold text-[#7B5E4A] uppercase">Daily Spend</p>
              <p className="stat-large text-[22px] font-extrabold text-[#3B2A20] mt-0.5 font-heading">₹115 <span className="text-xs text-[#7B5E4A] font-normal font-body">/ ₹200</span></p>
              <div className="w-full bg-[#F2E7D5] h-1.5 rounded-full mt-2">
                <div className="bg-[#7B5E4A] h-1.5 rounded-full" style={{ width: '58%' }} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#D1B89A]/60">
              <p className="eyebrow-label text-[10px] font-bold text-[#7B5E4A] uppercase">Calcium</p>
              <p className="stat-large text-[22px] font-extrabold text-[#3B2A20] mt-0.5 font-heading">620mg <span className="text-xs text-[#7B5E4A] font-normal font-body">/ 800mg</span></p>
              <div className="w-full bg-[#F2E7D5] h-1.5 rounded-full mt-2">
                <div className="bg-[#A67C52] h-1.5 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </div>

          {/* NutriRescue Callout */}
          <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#D1B89A] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-[#7B5E4A] shrink-0" />
              <p className="card-subtitle text-[12px] text-[#3B2A20] font-medium">
                <span className="font-extrabold text-[#7B5E4A]">NutriRescue Activated:</span> Had Biryani for lunch? AI automatically adjusted dinner to Ragi Porridge + Sundal to balance daily calories and recover non-heme iron targets.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="text-[12px] font-extrabold text-[#7B5E4A] hover:underline shrink-0"
            >
              Open Full App →
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-[#3B2A20] font-heading">
            Engineered for Real Indian Lifestyles
          </h2>
          <p className="card-subtitle text-[13px] text-[#7B5E4A] mt-2">
            Most western trackers assume pre-packaged salads. NutriMind is custom-built for homemade rotis, sambars, dals, and regional variations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#D1B89A]/60 rounded-3xl p-6 shadow-sm hover:border-[#7B5E4A] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#F2E7D5] text-[#7B5E4A] flex items-center justify-center font-bold mb-4">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="card-title text-[16px] font-bold text-[#3B2A20] mb-2 font-heading">
              Gemini Vision AI Plate Recognition
            </h3>
            <p className="card-subtitle text-[12px] text-[#7B5E4A] leading-relaxed font-body">
              Zero manual calorie guessing. Snap a photo of mixed thalis, dosas, or curries. The multimodal model estimates portion size in grams and verifies against IFCT 2017 scientific data.
            </p>
          </div>

          <div className="bg-white border border-[#D1B89A]/60 rounded-3xl p-6 shadow-sm hover:border-[#7B5E4A] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#F2E7D5] text-[#7B5E4A] flex items-center justify-center font-bold mb-4">
              <CalendarRange className="w-6 h-6" />
            </div>
            <h3 className="card-title text-[16px] font-bold text-[#3B2A20] mb-2 font-heading">
              Budget & Time Constrained Meal Planner
            </h3>
            <p className="card-subtitle text-[12px] text-[#7B5E4A] leading-relaxed font-body">
              Generates affordable 4-meal daily plans tailored to your native regional palate (Tamil, Kerala, Karnataka, North Indian) while strictly respecting your daily spending ceiling.
            </p>
          </div>

          <div className="bg-white border border-[#D1B89A]/60 rounded-3xl p-6 shadow-sm hover:border-[#7B5E4A] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#F2E7D5] text-[#7B5E4A] flex items-center justify-center font-bold mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="card-title text-[16px] font-bold text-[#3B2A20] mb-2 font-heading">
              NutriTwin Predictive Simulator
            </h3>
            <p className="card-subtitle text-[12px] text-[#7B5E4A] leading-relaxed font-body">
              Test "What-If" diet changes before altering your pantry. Visualize 30-day glycemic variance, iron saturation, and budget savings before adopting new food habits.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#D1B89A]/40 bg-white py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7B5E4A]">
          <div className="flex items-center gap-2">
            <Apple className="w-4 h-4 text-[#7B5E4A]" />
            <span className="font-bold text-[#3B2A20]">NutriMind AI</span>
            <span>— Clinical Edition</span>
          </div>
          <p>© 2026 NutriMind AI. Built with ICMR-NIN & IFCT 2017 scientific references.</p>
        </div>
      </footer>
    </div>
  )
}
