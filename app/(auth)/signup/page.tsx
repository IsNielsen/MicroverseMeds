'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      // Create auth user (profile will be auto-created by database trigger)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create user')

      toast.success('Account created! Welcome to Microverse Meds 🌱')
      router.push('/home')
      router.refresh()
    } catch (error: unknown) {
      console.error('Signup error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: 'linear-gradient(135deg, var(--forest-50) 0%, var(--earth-50) 100%)',
      }}
    >
      <div className="glass-card p-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-7xl mb-5 animate-float-tree">🌱</div>
          <h1
            className="text-4xl font-bold mb-3"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--forest-700)',
            }}
          >
            Start Your Journey
          </h1>
          <p style={{ color: 'var(--warm-gray-600)' }}>
            Grow your Life Tree with every dose
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold mb-2"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--warm-gray-700)',
              }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setEmail(e.target.value + "@micro.med")
              }}
              required
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_]+"
              className="input-field"
              placeholder="gardener42"
            />
            <p
              className="text-xs mt-1"
              style={{ color: 'var(--warm-gray-500)' }}
            >
              Letters, numbers, and underscores only
            </p>
          </div>

          {/* <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold mb-2"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--warm-gray-700)',
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
              placeholder="you@example.com"
            />
          </div> */}

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-2"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--warm-gray-700)',
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="input-field"
              placeholder="••••••••"
            />
            <p
              className="text-xs mt-1"
              style={{ color: 'var(--warm-gray-500)' }}
            >
              At least 8 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold mb-2"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--warm-gray-700)',
              }}
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-lg mt-6"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div
              className="w-full border-t"
              style={{ borderColor: 'var(--warm-gray-300)' }}
            ></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span
              className="px-4 bg-white"
              style={{ color: 'var(--warm-gray-500)' }}
            >
              Already have an account?
            </span>
          </div>
        </div>

        {/* Login Link */}
        <Link
          href="/login"
          className="btn-secondary w-full py-4 text-lg block text-center"
        >
          Log In
        </Link>

        {/* Privacy Notice */}
        <div
          className="mt-8 p-5 rounded-2xl"
          style={{ backgroundColor: 'var(--forest-50)' }}
        >
          <p
            className="text-xs leading-relaxed"
            style={{ color: 'var(--warm-gray-700)' }}
          >
            <strong style={{ color: 'var(--forest-600)' }}>Privacy First:</strong> Your medication data is encrypted end-to-end.
            We are HIPAA-compliant and never share your health information.
          </p>
        </div>
      </div>
    </div>
  )
}
