import { Outlet, Link } from 'react-router-dom'
import { Apple, ShieldCheck, Sparkles } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <Link to="/" className="flex items-center gap-2.5 group mb-3">
            <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-[#7B5E4A] to-[#3B2A20] flex items-center justify-center text-white shadow-lg shadow-[#7B5E4A]/30 group-hover:scale-105 transition-transform">
              <Apple className="w-6 h-6 text-[#F2E7D5] stroke-[2.5]" />
            </div>
          </Link>
          <h1 className="brand-name text-[22px] font-extrabold text-[#3B2A20] font-heading">
            Nutri<span className="text-[#7B5E4A]">Mind</span> AI
          </h1>
          <p className="card-subtitle text-[12px] text-[#7B5E4A] mt-1 font-medium font-body">
            Intelligent Indian Nutrition & Bioavailability Engine
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-white border border-[#D1B89A] rounded-[32px] p-6 sm:p-8 shadow-[0_20px_60px_rgba(59,42,32,0.08)]">
          <Outlet />
        </div>

        {/* Trust Badges Footer */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-[#7B5E4A] font-semibold">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#7B5E4A]" />
            <span>IFCT 2017 Verified</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#A67C52]" />
            <span>ICMR-NIN RDA 2020</span>
          </div>
        </div>
      </div>
    </div>
  )
}
