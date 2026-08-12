"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function PlannerTransitionLoader({ onComplete }) {
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      const tReduced = setTimeout(() => {
        if (onComplete) onComplete()
      }, 700)
      return () => clearTimeout(tReduced)
    }

    // Sequence timing matching Generate Itinerary motion language:
    // 0.0s: Globe appears & starts 3D rotation
    // 0.4s: Text "Plan your journey." reveals underneath
    // 2.2s: Transition completes & uncovers Planner
    const tText = setTimeout(() => setShowText(true), 400)
    const tEnd = setTimeout(() => {
      if (onComplete) onComplete()
    }, 2200)

    return () => {
      clearTimeout(tText)
      clearTimeout(tEnd)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl overflow-hidden select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: -10 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg text-center space-y-6 relative z-10 text-white"
      >
        {/* Ambient Soft Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[500px] rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Main Visual: Premium 3D Rotating White World Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center"
          >
            {/* Atmosphere Glow Aura */}
            <div className="absolute inset-0 rounded-full bg-white/10 blur-md animate-pulse pointer-events-none" />

            {/* Outer Tilted Orbit Ring */}
            <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              <ellipse
                cx="60"
                cy="60"
                rx="70"
                ry="22"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1.2"
                strokeDasharray="5 4"
                fill="none"
                transform="rotate(-23.5 60 60)"
              />
              <circle cx="10" cy="40" r="3.5" fill="white" className="drop-shadow-sm" />
            </svg>

            {/* Main 3D Rotating Globe SVG */}
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-2xl z-10">
              <defs>
                {/* Spherical 3D Volume Gradient */}
                <radialGradient id="globeVolume" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
                  <stop offset="50%" stopColor="rgba(255, 255, 255, 0.08)" />
                  <stop offset="100%" stopColor="rgba(0, 0, 0, 0.7)" />
                </radialGradient>

                {/* Spherical Clip Path */}
                <clipPath id="sphereClip">
                  <circle cx="50" cy="50" r="44" />
                </clipPath>
              </defs>

              {/* Sphere Outer Border */}
              <circle cx="50" cy="50" r="44" stroke="white" strokeWidth="2" fill="none" />

              {/* Clipped Rotating World Elements */}
              <g clipPath="url(#sphereClip)">
                {/* Sphere Deep Ocean Backing */}
                <circle cx="50" cy="50" r="44" fill="#090E17" />

                {/* Continuously Rotating Continents & Meridians Group */}
                <motion.g
                  animate={{ x: [-100, 0] }}
                  transition={{ repeat: Infinity, duration: 4.2, ease: "linear" }}
                  className="fill-white stroke-white"
                >
                  {/* World Map Continents pattern repeated 2x for seamless looping */}
                  {[0, 100].map((offsetX) => (
                    <g key={offsetX} transform={`translate(${offsetX}, 0)`}>
                      {/* North America */}
                      <path d="M 12 25 Q 18 20 28 24 T 35 32 T 25 42 T 15 35 Z" fill="white" opacity="0.85" />
                      {/* South America */}
                      <path d="M 28 46 Q 34 48 32 65 T 24 72 T 22 55 Z" fill="white" opacity="0.85" />
                      {/* Europe & Africa */}
                      <path d="M 48 20 Q 58 18 64 26 T 55 35 Z" fill="white" opacity="0.85" />
                      <path d="M 46 38 Q 62 36 60 62 T 50 70 T 44 50 Z" fill="white" opacity="0.85" />
                      {/* Asia */}
                      <path d="M 66 18 Q 85 15 90 32 T 75 42 T 65 30 Z" fill="white" opacity="0.85" />
                      {/* Australia */}
                      <path d="M 78 58 Q 88 56 86 68 T 76 66 Z" fill="white" opacity="0.85" />

                      {/* Latitude Grid Lines */}
                      <line x1="0" y1="20" x2="100" y2="20" stroke="white" strokeWidth="0.8" opacity="0.3" strokeDasharray="2 2" />
                      <line x1="0" y1="35" x2="100" y2="35" stroke="white" strokeWidth="0.8" opacity="0.4" />
                      <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="1.2" opacity="0.6" />
                      <line x1="0" y1="65" x2="100" y2="65" stroke="white" strokeWidth="0.8" opacity="0.4" />
                      <line x1="0" y1="80" x2="100" y2="80" stroke="white" strokeWidth="0.8" opacity="0.3" strokeDasharray="2 2" />
                    </g>
                  ))}
                </motion.g>

                {/* Curved 3D Meridian Overlays */}
                <ellipse cx="50" cy="50" rx="16" ry="44" stroke="white" strokeWidth="1" fill="none" opacity="0.5" />
                <ellipse cx="50" cy="50" rx="32" ry="44" stroke="white" strokeWidth="1" fill="none" opacity="0.35" />
                <line x1="50" y1="6" x2="50" y2="94" stroke="white" strokeWidth="1.2" opacity="0.6" />

                {/* 3D Glass Volume Gradient Overlay */}
                <circle cx="50" cy="50" r="44" fill="url(#globeVolume)" />
              </g>

              {/* Top Specular Highlight Arc */}
              <path d="M 22 18 Q 50 8 78 18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
            </svg>
          </motion.div>

          {/* Text revealed underneath globe (NO text above globe) */}
          <div className="min-h-[32px] flex items-center justify-center">
            <AnimatePresence>
              {showText && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-white text-lg sm:text-xl font-medium tracking-wide drop-shadow-md text-center"
                >
                  Plan your journey.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
