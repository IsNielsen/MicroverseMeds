import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function RootPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/home')
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: 'linear-gradient(135deg, var(--forest-50) 0%, var(--earth-50) 100%)',
      }}
    >
      <div className="text-center max-w-3xl">
        {/* Tree Icon */}
        <div className="text-9xl mb-8 animate-float-tree">🌳</div>

        {/* Heading */}
        <h1
          className="text-6xl font-bold mb-6"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--forest-700)',
          }}
        >
          Microverse Meds
        </h1>

        {/* Tagline */}
        <p
          className="text-2xl mb-8 font-semibold"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--forest-600)',
          }}
        >
          Grow your Life Tree with every medication you take
        </p>

        {/* Description */}
        <p
          className="text-lg mb-12 max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'var(--warm-gray-700)' }}
        >
          Track your medications, build healthy habits, and watch your personal
          tree evolve through the seasons as you maintain your wellness journey.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-5 justify-center flex-wrap mb-16">
          <Link
            href="/signup"
            className="btn-primary text-lg px-10 py-4"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="btn-secondary text-lg px-10 py-4"
          >
            Log In
          </Link>
        </div>

        {/* HIPAA Badge */}
        <div
          className="inline-flex items-center gap-3 glass-card px-6 py-3"
        >
          <span className="text-2xl">🔒</span>
          <div className="text-left">
            <p
              className="text-sm font-bold"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--forest-600)',
              }}
            >
              HIPAA-Compliant & Secure
            </p>
            <p
              className="text-xs"
              style={{ color: 'var(--warm-gray-600)' }}
            >
              Your health data is encrypted and protected
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
