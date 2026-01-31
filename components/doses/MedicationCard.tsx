'use client'

import { useState } from 'react'
import { logDose } from '@/app/(app)/home/actions'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface MedicationCardProps {
  medication: {
    id: string
    nickname: string
    icon: string | null
    color: string | null
    frequency: string
  }
}

export function MedicationCard({ medication }: MedicationCardProps) {
  const [loading, setLoading] = useState(false)
  const [logged, setLogged] = useState(false)

  async function handleLogDose() {
    setLoading(true)

    try {
      const result = await logDose(medication.id)

      if (result.error) {
        toast.error(result.error)
        return
      }

      setLogged(true)
      toast.success(`+${result.hpEarned} HP! 🍃`, {
        description: result.treeGrew ? '🌳 Your tree grew!' : undefined,
      })

      // Reset after animation
      setTimeout(() => setLogged(false), 3000)
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to log dose')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="cozy-card flex items-center justify-between relative overflow-hidden"
      style={{
        borderLeftWidth: '6px',
        borderLeftColor: medication.color ?? '#4d9961',
      }}
      animate={logged ? { scale: [1, 1.03, 1] } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -2 }}
    >
      {/* Success overlay */}
      {logged && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(77, 153, 97, 0.1) 0%, rgba(77, 153, 97, 0.05) 100%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      <div className="flex items-center gap-4 flex-1 min-w-0 relative z-10">
        {/* Large circular colored icon */}
        <motion.div
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
          style={{ backgroundColor: medication.color ?? '#4d9961' }}
          animate={logged ? { rotate: [0, 15, -10, 0], scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-3xl">{medication.icon ?? '💊'}</span>
        </motion.div>

        {/* Medication info */}
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-lg truncate"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--warm-gray-900)',
            }}
          >
            {medication.nickname}
          </h3>
          <p
            className="text-sm capitalize"
            style={{ color: 'var(--warm-gray-500)' }}
          >
            {medication.frequency.replace('_', ' ')}
          </p>
        </div>
      </div>

      {/* Log Dose Button */}
      <motion.button
        onClick={handleLogDose}
        disabled={loading || logged}
        className={`relative z-10 btn-primary flex-shrink-0 ${
          logged || loading ? 'opacity-60 cursor-not-allowed' : ''
        }`}
        whileHover={!logged && !loading ? { y: -2 } : {}}
        whileTap={!logged && !loading ? { scale: 0.98 } : {}}
      >
        {logged ? (
          <span className="flex items-center gap-2">
            <span className="text-lg">✓</span>
            <span>Logged</span>
          </span>
        ) : loading ? (
          <span className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              ⏳
            </motion.span>
            <span>Logging...</span>
          </span>
        ) : (
          'Log Dose'
        )}
      </motion.button>
    </motion.div>
  )
}
