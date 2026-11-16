import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-[80px] font-extrabold text-[#D1B89A] font-heading leading-none mb-2">
          404
        </div>
        <h1 className="text-2xl font-extrabold text-[#3B2A20] font-heading mb-2">
          Page not found
        </h1>
        <p className="text-sm text-[#7B5E4A] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7B5E4A] hover:bg-[#3B2A20] text-white text-sm font-bold rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#D1B89A] bg-white hover:bg-[#FAF7F0] text-[#7B5E4A] text-sm font-bold rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}
