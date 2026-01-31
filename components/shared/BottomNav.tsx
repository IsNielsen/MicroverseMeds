'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Leaf, Trophy, Users, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/microverse', icon: Leaf, label: 'Microverse' },
  { href: '/quiz-quest', icon: Trophy, label: 'Quiz' },
  { href: '/med-friend', icon: Users, label: 'Friends' },
  { href: '/settings', icon: Settings, label: 'Settings'},
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 z-50 w-full glass-card"
      style={{
        borderTop: '1px solid rgba(77, 153, 97, 0.1)',
        boxShadow: '0 -2px 16px rgba(0, 0, 0, 0.08)',
        borderRadius: '0',
      }}
    >
      <div className="flex items-center justify-around h-20 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center py-2 px-1 relative"
            >
              <motion.div
                className="flex flex-col items-center gap-1"
                animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Icon
                  className="w-7 h-7 transition-colors"
                  style={{
                    color: isActive ? 'var(--forest-600)' : 'var(--warm-gray-400)',
                  }}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className="text-[10px] transition-all"
                  style={{
                    color: isActive ? 'var(--forest-600)' : 'var(--warm-gray-500)',
                    fontWeight: isActive ? 600 : 400,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {item.label}
                </span>
              </motion.div>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-1/2 w-1 h-1 rounded-full"
                  style={{ backgroundColor: 'var(--forest-500)' }}
                  layoutId="activeIndicator"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
