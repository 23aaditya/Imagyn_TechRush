"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function BudgetEntranceLoader({ onComplete }) {
  const [stage, setStage] = useState(0) // 0: Setting up, 1: Allocating, 2: Optimizing, 3: Complete

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete()
      }, 1000)
      return () => clearTimeout(timer)
    }

    // Stage progression timers matching Generate Itinerary loader pacing
    const t1 = setTimeout(() => setStage(1), 900)
    const t2 = setTimeout(() => setStage(2), 1700)
    const t3 = setTimeout(() => setStage(3), 2500)
    const tEnd = setTimeout(() => {
      if (onComplete) onComplete()
    }, 3200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(tEnd)
    }
  }, [onComplete])

  const stages = [
    { label: "Setting up your trip budget..." },
    { label: "Allocating stay, dining & experience funds..." },
    { label: "Optimizing your travel savings..." },
    { label: "Build your budget before you build your journey." },
  ]

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
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[500px] rounded-full bg-slate-400/10 blur-3xl pointer-events-none" />

        {/* Single Line Active Rolling Planning Text Slide */}
        <div className="py-4 flex items-center justify-center relative z-10 min-h-[56px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-3 text-white text-lg sm:text-xl font-medium tracking-wide drop-shadow-md"
            >
              {stage < 3 && (
                <span className="h-5 w-5 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin inline-block shrink-0" />
              )}
              <span>{stages[stage]?.label}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
