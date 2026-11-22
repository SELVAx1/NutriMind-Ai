import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, User } from 'lucide-react'

export function RegisterPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await signUp(email, password)
      if (res?.error) {
        setError(res.error)
        return
      }
      navigate('/onboarding')
    } catch (err: any) {
      setError(err?.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="login-title text-[30px] font-extrabold text-[#3B2A20] font-heading">Create Account</h2>
        <p className="card-subtitle text-[12px] text-[#7B5E4A] mt-0.5">
          Join NutriMind AI for personalized regional nutrition
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-2xl bg-[#FDF0EE] border border-[#F3C3BC] text-[#8F3325] text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          required
          placeholder="Your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          icon={<User className="w-4 h-4" />}
        />

        <Input
          label="Email Address"
          type="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
        />

        <Input
          label="Password"
          type="password"
          required
          placeholder="Minimum 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full justify-center"
          loading={loading}
        >
          Start Free
        </Button>
      </form>

      <div className="text-center pt-2 border-t border-[#D1B89A]/30">
        <p className="card-subtitle text-[12px] text-[#7B5E4A]">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="text-[#3B2A20] font-bold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
