'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success('Welcome back!')
      router.push('/home')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to login')
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
          <div className="text-7xl mb-5 animate-float-tree">🌳</div>
          <h1
            className="text-4xl font-bold mb-3"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--forest-700)',
            }}
          >
            Welcome Back
          </h1>
          <p style={{ color: 'var(--warm-gray-600)' }}>
            Your Life Tree is waiting for you
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
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
          </div>

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
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-lg mt-6"
          >
            {loading ? 'Logging in...' : 'Log In'}
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
              New to Microverse Meds?
            </span>
          </div>
        </div>

        {/* Sign Up Link */}
        <Link
          href="/signup"
          className="btn-secondary w-full py-4 text-lg block text-center"
        >
          Create Account
        </Link>

        {/* Privacy Notice */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <span className="text-lg">🔒</span>
          <p
            className="text-xs"
            style={{ color: 'var(--warm-gray-600)' }}
          >
            HIPAA-compliant • Your data is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  )
}
