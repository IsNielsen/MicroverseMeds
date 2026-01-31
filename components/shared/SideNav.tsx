'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Leaf, Trophy, Users, Settings, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const navItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/microverse', icon: Leaf, label: 'Microverse' },
  { href: '/quiz-quest', icon: Trophy, label: 'Quiz' },
  { href: '/med-friend', icon: Users, label: 'Friends' },
  { href: '/settings', icon: Settings, label: 'Settings'},
]

export function SideNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Hamburger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-3 rounded-xl glass-card"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(77, 153, 97, 0.1)',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="w-6 h-6" style={{ color: 'var(--forest-600)' }} strokeWidth={2.5} />
        ) : (
          <Menu className="w-6 h-6" style={{ color: 'var(--forest-600)' }} strokeWidth={2.5} />
        )}
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Side Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-72 z-40 glass-card"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              borderRight: '1px solid rgba(77, 153, 97, 0.1)',
              boxShadow: '4px 0 24px rgba(0, 0, 0, 0.12)',
            }}
          >
            <div className="flex flex-col h-full pt-20 pb-8 px-6">
              {/* App Title */}
              <div className="mb-8">
                <h1
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--forest-700)',
                  }}
                >
                  Microverse Meds
                </h1>
                <p
                  className="text-sm mt-1"
                  style={{ color: 'var(--warm-gray-500)' }}
                >
                  Grow your Life Tree
                </p>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname.startsWith(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative group"
                      style={{
                        backgroundColor: isActive ? 'var(--forest-50)' : 'transparent',
                      }}
                    >
                      <Icon
                        className="w-6 h-6 transition-colors"
                        style={{
                          color: isActive ? 'var(--forest-600)' : 'var(--warm-gray-400)',
                        }}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      <span
                        className="text-base transition-all"
                        style={{
                          color: isActive ? 'var(--forest-700)' : 'var(--warm-gray-600)',
                          fontWeight: isActive ? 600 : 400,
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {item.label}
                      </span>

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute left-0 top-1/2 w-1 h-8 rounded-r-full"
                          style={{ backgroundColor: 'var(--forest-500)', transform: 'translateY(-50%)' }}
                          layoutId="sideActiveIndicator"
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}

                      {/* Hover effect */}
                      {!isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ backgroundColor: 'var(--forest-50)' }}
                        />
                      )}
                    </Link>
                  )
                })}
              </div>

              {/* Footer */}
              <div
                className="pt-6 mt-6 text-xs text-center"
                style={{
                  borderTop: '1px solid rgba(77, 153, 97, 0.1)',
                  color: 'var(--warm-gray-400)',
                }}
              >
                <p>Version 1.0.0</p>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
