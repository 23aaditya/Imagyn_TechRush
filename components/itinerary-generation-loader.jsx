"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function ItineraryGenerationLoader({ destination = "Goa", days = 3 }) {
  const [stage, setStage] = useState(0) // 0: Finding, 1: Optimizing, 2: Building, 3: Balancing

  useEffect(() => {
    // 0.00s - 1.00s: Stage 0 (Finding)
    // 1.00s - 1.50s: Stage 1 (Optimizing)
    // 1.50s - 2.50s: Stage 2 (Building)
    // 2.50s+: Stage 3 (Balancing)
    const t1 = setTimeout(() => setStage(1), 1000)
    const t2 = setTimeout(() => setStage(2), 1600)
    const t3 = setTimeout(() => setStage(3), 2500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  const stages = [
    { label: `Finding the best destinations in ${destination}` },
    { label: "Optimizing your travel route" },
    { label: `Building your ${days}-day activity itinerary` },
    { label: "Balancing your trip budget & schedule" }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xl overflow-hidden select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: -10 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg text-center space-y-8 relative z-10 text-white"
      >
        {/* Ambient Soft Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[500px] rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        {/* Header Title */}
        <div className="space-y-2 relative z-10">
          <h3 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
            Planning Your {destination} Journey
          </h3>
          <p className="text-sm text-neutral-300 font-medium max-w-md mx-auto">
            Crafting a personalized {days}-day itinerary tailored to your preferences.
          </p>
        </div>

        {/* Animated Travel Route SVG Line */}
        <div className="relative max-w-md mx-auto py-2 z-10">
          <svg viewBox="0 0 340 90" fill="none" className="w-full h-auto overflow-visible">
            {/* Background Dashed Path */}
            <path
              d="M 30,65 Q 120,10 170,45 T 310,25"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="3"
              strokeDasharray="6 6"
            />

            {/* Animated Draw Line */}
            <motion.path
              d="M 30,65 Q 120,10 170,45 T 310,25"
              stroke="#38BDF8"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: stage >= 3 ? 1 : (stage + 1) * 0.28 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            />

            {/* Node 1 - Origin */}
            <g transform="translate(30, 65)">
              <circle r="8" className="fill-sky-400" />
              <circle r="14" className="stroke-sky-400 stroke-2 fill-none opacity-40 animate-ping" />
            </g>

            {/* Node 2 - Midpoint */}
            <g transform="translate(170, 45)">
              <circle r="7" className={stage >= 1 ? "fill-sky-400" : "fill-white/20 stroke-white/40 stroke-2"} />
            </g>

            {/* Node 3 - Destination */}
            <g transform="translate(310, 25)">
              <circle r="9" className={stage >= 3 ? "fill-emerald-400" : "fill-white/20 stroke-white/40 stroke-2"} />
            </g>
          </svg>
        </div>

        {/* Single Line Active Rolling Text Slide (No Box Shapes, White Text with Rolling Symbol) */}
        <div className="py-2 flex items-center justify-center relative z-10 min-h-[48px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-3 text-white text-base sm:text-lg font-medium tracking-wide drop-shadow-md"
            >
              <span className="h-5 w-5 rounded-full border-2 border-sky-400 border-t-transparent animate-spin inline-block shrink-0" />
              <span>{stages[stage]?.label}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
