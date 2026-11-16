import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ivory">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-mocha border-t-transparent rounded-full animate-spin" />
          <p className="text-walnut/60 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  return <Outlet />
}
