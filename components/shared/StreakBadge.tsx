'use client'

import { motion } from 'framer-motion'

interface StreakBadgeProps {
  streak: number
  className?: string
}

export function StreakBadge({ streak, className = '' }: StreakBadgeProps) {
  return (
    <motion.div
      className={`glass-card px-5 py-2.5 inline-flex items-center gap-2.5 animate-pulse-glow-gold ${className}`}
      style={{
        background: 'linear-gradient(135deg, var(--amber-400) 0%, var(--amber-500) 100%)',
        color: 'var(--amber-900)',
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <motion.span
        className="text-2xl"
        animate={{
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeInOut"
        }}
      >
        🔥
      </motion.span>
      <div className="flex flex-col items-start">
        <div
          className="text-[10px] font-bold uppercase tracking-wider opacity-80"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Streak
        </div>
        <div
          className="text-lg font-bold leading-none"
          style={{ fontFamily: 'var(--font-accent)' }}
        >
          {streak} {streak === 1 ? 'Day' : 'Days'}
        </div>
      </div>
    </motion.div>
  )
}
