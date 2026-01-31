'use client'

import { useEffect, useRef } from 'react'

interface GlobalAudioPlayerProps {
  src: string
  volume?: number
}

export function GlobalAudioPlayer({ src, volume = 0.5 }: GlobalAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume

    const tryPlay = async () => {
      try {
        await audio.play()
        startedRef.current = true
      } catch {
        // Autoplay may be blocked until user interaction.
      }
    }

    const resumeOnInteraction = () => {
      if (!startedRef.current) {
        void tryPlay()
      }
    }

    void tryPlay()

    window.addEventListener('pointerdown', resumeOnInteraction, { passive: true })
    window.addEventListener('keydown', resumeOnInteraction)

    return () => {
      window.removeEventListener('pointerdown', resumeOnInteraction)
      window.removeEventListener('keydown', resumeOnInteraction)
    }
  }, [src, volume])

  return (
    <audio ref={audioRef} src={src} autoPlay loop preload="auto" />
  )
}
