import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, LogIn } from 'lucide-react'

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await signIn(email, password)
      if (res?.error) {
        setError(res.error)
        return
      }
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` }
      })
      if (error) {
        setError(error.message || 'Google sign-in failed. Please try again.')
      }
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* ── Top Icon & Title (Matches PDF Page 1) ── */}
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#7B5E4A] text-white flex items-center justify-center mb-3 shadow-md shadow-[#7B5E4A]/30">
          <LogIn className="w-6 h-6 stroke-[2.5]" />
        </div>
        <h2 className="login-title text-[30px] font-extrabold text-[#3B2A20] font-heading tracking-tight">
          Welcome back
        </h2>
        <p className="card-subtitle text-[12.5px] text-[#7B5E4A] mt-0.5">
          Log in to your account
        </p>
      </div>

      {/* Continue with Google (Matches PDF Page 1) */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full py-2.5 px-4 rounded-xl border border-[#D1B89A] bg-white hover:bg-[#FAF7F0] text-xs font-bold text-[#3B2A20] flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* OR Divider (Matches PDF Page 1) */}
      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-[#D1B89A]/50"></div>
        <span className="flex-shrink mx-3 text-[10px] font-black uppercase text-[#A67C52] tracking-wider">
          OR
        </span>
        <div className="flex-grow border-t border-[#D1B89A]/50"></div>
      </div>

      {error && (
        <div className="p-3 rounded-2xl bg-[#FDF0EE] border border-[#F3C3BC] text-[#8F3325] text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Email"
          type="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
        />

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-[#7B5E4A]">Password</span>
            <button
              type="button"
              onClick={async () => {
                if (!email.trim()) { setError('Enter your email address first, then click Forgot password.'); return }
                try {
                  await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/auth/login` })
                  setError('')
                  alert('Password reset link sent to your email.')
                } catch { setError('Could not send reset link. Try again.') }
              }}
              className="text-[11px] text-[#A67C52] hover:text-[#3B2A20] hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <Input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full justify-center"
          loading={loading}
        >
          Log in
        </Button>
      </form>

      <div className="text-center pt-2 border-t border-[#D1B89A]/30">
        <p className="card-subtitle text-[12px] text-[#7B5E4A]">
          Don't have an account?{' '}
          <Link
            to="/auth/register"
            className="text-[#3B2A20] font-bold hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
