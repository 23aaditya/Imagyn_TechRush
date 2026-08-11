"use client"

import { motion, AnimatePresence } from "framer-motion"
import { EASE_TRAVEL } from "@/lib/motion"

export function JourneyLine({ isNavigating, triggerKey }) {
  return (
    <AnimatePresence mode="wait">
      {isNavigating && (
        <motion.div
          key={triggerKey || "journey-line"}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-[2px] overflow-hidden"
        >
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 2">
            <motion.path
              d="M 0 1 L 1000 1"
              stroke="var(--color-primary, #C98B55)"
              strokeWidth="2"
              strokeDasharray="1000"
              initial={{ strokeDashoffset: 1000 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.65, ease: EASE_TRAVEL }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
