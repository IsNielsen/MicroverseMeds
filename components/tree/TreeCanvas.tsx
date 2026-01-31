'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { GrowthStage, Season } from '@/types/gamification'

interface TreeCanvasProps {
  growthStage: GrowthStage
  dosesToNext: number
  season?: Season
}

// Seasonal gradient backgrounds
const seasonalBackgrounds = {
  spring: 'from-spring-accent/20 via-transparent to-transparent',
  summer: 'from-summer-accent/20 via-transparent to-transparent',
  fall: 'from-fall-accent/20 via-transparent to-transparent',
  winter: 'from-winter-accent/20 via-transparent to-transparent',
}

export function TreeCanvas({
  growthStage,
  dosesToNext,
  season = 'spring',
}: TreeCanvasProps) {
  const [isGrowing, setIsGrowing] = useState(false)
  const [prevStage, setPrevStage] = useState(growthStage)

  useEffect(() => {
    if (growthStage > prevStage) {
      setIsGrowing(true)
      setTimeout(() => setIsGrowing(false), 2000)
      setPrevStage(growthStage)
    }
  }, [growthStage, prevStage])

  const bgGradient = seasonalBackgrounds[season]

  return (
    <div className="relative w-full mx-auto">
      {/* Canvas container with seasonal gradient background */}
      <div className="relative w-full aspect-square max-h-[500px] overflow-hidden rounded-3xl">
        {/* Seasonal gradient background */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${bgGradient}`}
          style={{
            background: `radial-gradient(ellipse at top, var(--${season}-accent)15 0%, transparent 60%)`,
          }}
        />

        {/* Floating sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-[15%] right-[20%] w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--amber-400)' }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.4, 0.8],
              y: [0, -10, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-[25%] left-[15%] w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--forest-400)' }}
            animate={{
              opacity: [0.4, 0.9, 0.4],
              scale: [0.7, 1.3, 0.7],
              y: [0, -15, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />
          <motion.div
            className="absolute top-[40%] right-[25%] w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: 'var(--amber-300)' }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [0.9, 1.5, 0.9],
              y: [0, -12, 0],
            }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div
            className="absolute bottom-[30%] left-[30%] w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: 'var(--forest-300)' }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [0.8, 1.4, 0.8],
              y: [0, -8, 0],
            }}
            transition={{ duration: 3.2, repeat: Infinity, delay: 1.5 }}
          />
        </div>

        {/* The Tree - PNG with floating animation */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-8"
          animate={
            isGrowing
              ? {
                  scale: [1, 1.12, 1],
                  y: [0, -20, 0],
                }
              : undefined
          }
          transition={isGrowing ? { duration: 2, ease: "easeOut" } : undefined}
        >
          <motion.div
            className="relative w-full h-full flex items-center justify-center"
            animate={{
              y: [0, -12, 0],
              rotate: [0, 1, -0.5, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 0.7, 1],
            }}
          >
            <Image
              src={`/trees/${growthStage}.png`}
              alt={`Growth Stage ${growthStage}`}
              width={400}
              height={400}
              className=" w-auto object-contain drop-shadow-2xl"
              priority
              style={{
                filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.15))',
              }}
            />
          </motion.div>
        </motion.div>

        {/* Growth Celebration Modal */}
        <AnimatePresence>
          {isGrowing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
              className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-3xl z-10"
            >
              <motion.div
                className="glass-card p-8 text-center max-w-xs"
                initial={{ y: 30, rotate: -5 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 200,
                }}
              >
                <motion.p
                  className="text-7xl mb-4"
                  animate={{
                    rotate: [0, 15, -10, 10, -5, 0],
                    scale: [1, 1.2, 1.15, 1.1, 1],
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  🌳
                </motion.p>
                <h3
                  className="text-3xl font-bold mb-2"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--forest-600)',
                  }}
                >
                  Tree Grew!
                </h3>
                <p
                  className="text-base"
                  style={{ color: 'var(--warm-gray-600)' }}
                >
                  Now at <span className="font-semibold" style={{ color: 'var(--forest-500)' }}>Stage {growthStage}</span>
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-4 text-center">
        <p
          className="text-sm font-semibold"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--warm-gray-700)',
          }}
        >
          Next growth in {dosesToNext} {dosesToNext === 1 ? 'dose' : 'doses'}
        </p>
      </div>
    </div>
  )
}
