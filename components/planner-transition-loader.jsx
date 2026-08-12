"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

/* ─────────────────────────────────────────────
   PLANNER TRANSITION LOADER
   Clean minimal text loader (Globe graphic removed per user directive).
   ───────────────────────────────────────────── */
export function PlannerTransitionLoader({ onComplete }) {
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      const tReduced = setTimeout(() => {
        if (onComplete) onComplete()
      }, 500)
      return () => clearTimeout(tReduced)
    }

    const tText = setTimeout(() => setShowText(true), 200)
    const tEnd = setTimeout(() => {
      if (onComplete) onComplete()
    }, 1400)

    return () => {
      clearTimeout(tText)
      clearTimeout(tEnd)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-hidden select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm text-center space-y-4 relative z-10 text-white font-button bg-neutral-900/90 p-6 rounded-2xl border border-white/10 shadow-2xl"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 text-[#DDD0EA] animate-spin" />

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-medium text-white font-button">
              Preparing your itinerary...
            </h3>
            <p className="text-xs text-neutral-400 font-normal">
              Syncing routes, stay anchors, and local highlights
            </p>
          </div>

          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="h-full bg-[#DDD0EA]"
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
