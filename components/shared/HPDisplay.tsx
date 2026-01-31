'use client'

import { motion } from 'framer-motion'

interface HPDisplayProps {
  hp: number
  className?: string
}

export function HPDisplay({ hp, className = '' }: HPDisplayProps) {
  return (
    <motion.div
      className={`glass-card px-6 py-3 flex items-center gap-3 animate-pulse-glow ${className}`}
      style={{
        background: 'linear-gradient(135deg, var(--forest-500) 0%, var(--forest-600) 100%)',
        color: 'white',
      }}
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      key={hp} // Re-animate when HP changes
    >
      <motion.span
        className="text-3xl"
        animate={{ rotate: [0, 15, -10, 0] }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        🍃
      </motion.span>
      <div className="flex flex-col items-start">
        <div
          className="text-xs font-bold uppercase tracking-widest opacity-90"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Health Points
        </div>
        <div
          className="text-3xl font-bold leading-none"
          style={{ fontFamily: 'var(--font-accent)' }}
        >
          {hp.toLocaleString()}
        </div>
      </div>
    </motion.div>
  )
}
