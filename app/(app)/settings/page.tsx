import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, LogOut } from 'lucide-react'
import { redirect } from 'next/navigation'
import { BottomNav } from '@/components/shared/BottomNav'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: medications } = await supabase
    .from('medications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </header>

      <div className="p-4 space-y-6">
        {/* Account Section */}
        <section className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Account</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Username</p>
              <p className="font-semibold text-gray-800">{profile?.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-gray-800">{profile?.email || 'Not set'}</p>
            </div>
          </div>

          <form action="/api/auth/logout" method="POST" className="mt-4">
            <button
              type="submit"
              className="w-full bg-red-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
          </form>
        </section>

        {/* Medications Section */}
        <section className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">My Medications</h2>
            <Link
              href="/settings/add-medication"
              className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-600 transition flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add
            </Link>
          </div>

          {!medications || medications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">💊</div>
              <p className="text-gray-600 mb-4">No medications added yet</p>
              <Link
                href="/settings/add-medication"
                className="inline-block bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition"
              >
                Add Your First Medication
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="p-4 border border-gray-200 rounded-xl flex items-center justify-between"
                  style={{ borderLeft: `4px solid ${med.color}` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{med.icon}</div>
                    <div>
                      <p className="font-semibold text-gray-800">{med.nickname}</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {med.frequency.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/settings/edit-medication/${med.id}`}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Privacy & Legal */}
        <section className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Privacy & Legal
          </h2>
          <div className="space-y-3">
            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-sm font-semibold text-green-800 mb-1">
                🔒 HIPAA-Safe Design
              </p>
              <p className="text-xs text-gray-600">
                Your medication data is encrypted end-to-end. We never share your
                health information with third parties.
              </p>
            </div>
            <Link
              href="/privacy"
              className="block text-sm text-gray-600 hover:text-green-600"
            >
              Privacy Policy →
            </Link>
            <Link
              href="/terms"
              className="block text-sm text-gray-600 hover:text-green-600"
            >
              Terms of Service →
            </Link>
          </div>
        </section>
      </div>
      <BottomNav />

    </div>
  )
}
