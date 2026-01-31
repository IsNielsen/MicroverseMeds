import { createClient } from '@/lib/supabase/server'
import { TreeCanvas } from '@/components/tree/TreeCanvas'
import { MedicationCard } from '@/components/doses/MedicationCard'
import { HPDisplay } from '@/components/shared/HPDisplay'
import { StreakBadge } from '@/components/shared/StreakBadge'
import { getDosesToNextStage } from '@/lib/gamification/tree'
import type { GrowthStage, Season } from '@/types/gamification'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { BottomNav } from '@/components/shared/BottomNav'


export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch today's medications
  const { data: medications } = await supabase
    .from('medications')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  // Calculate progress
  const dosesToNext = getDosesToNextStage(profile?.total_doses_logged || 0)

  // Get current season (defaulting to spring for now - can be calculated from profile.tree_season)
  // const season: Season = (profile?.tree_season as Season) || 'spring'

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header with seasonal gradient */}
      <header
        className="px-6 pt-6 pb-8"
        style={{
          // background: `linear-gradient(180deg, var(--${season}-accent)20 0%, transparent 100%)`,
          background: `linear-gradient(180deg, green-500 20 0%, transparent 100%)`,
        }}
      >
        {/* Stats Row */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <HPDisplay hp={profile?.health_points || 0} />
          <StreakBadge streak={profile?.current_streak || 0} />
        </div>
      </header>az

      {/* Tree Visual */}
      <section className="px-6 pb-8">
        <TreeCanvas
          growthStage={(profile?.tree_growth_stage as GrowthStage) || 1}
          totalDoses={profile?.total_doses_logged || 0}
          dosesToNext={dosesToNext}
          // season={season}
        />
      </section>

      {/* Today's Medications */}
      <section className="px-6 pt-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-2xl font-bold"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--forest-700)',
            }}
          >
            Today's Doses
          </h2>
          <Link
            href="/settings?tab=medications"
            className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
            style={{
              color: 'var(--forest-500)',
              fontFamily: 'var(--font-display)',
            }}
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            Add
          </Link>
        </div>

        {!medications || medications.length === 0 ? (
          <div
            className="cozy-card text-center py-12"
            style={{ backgroundColor: 'var(--forest-50)' }}
          >
            <div className="text-7xl mb-6 animate-float-tree">🌿</div>
            <h3
              className="text-2xl font-bold mb-3"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--forest-700)',
              }}
            >
              Start Your Journey
            </h3>
            <p
              className="text-base mb-8 max-w-sm mx-auto"
              style={{ color: 'var(--warm-gray-600)' }}
            >
              Add your first medication to begin growing your Life Tree
            </p>
            <Link
              href="/settings?tab=medications"
              className="btn-primary text-base px-8 py-3"
            >
              Add Medication
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map((med) => (
              <MedicationCard key={med.id} medication={med} />
            ))}
          </div>
        )}
      </section>
      <BottomNav />

    </div>
  )
}
