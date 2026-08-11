"use client"

import { motion } from "framer-motion"
import { EASE_TRAVEL, DURATION_CONTENT } from "@/lib/motion"

export function CoordinateReveal({ coordinates, destinationName, children, className = "" }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* 1. Coordinates Reveal */}
      {coordinates && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_TRAVEL, delay: 0 }}
          className="font-mono-tech text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#C98B55] block"
        >
          {coordinates}
        </motion.div>
      )}

      {/* 2. Destination Name Reveal */}
      {destinationName && (
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_TRAVEL, delay: 0.25 }}
          className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground uppercase tracking-wider leading-none"
        >
          {destinationName}
        </motion.h2>
      )}

      {/* 3. Image / Content Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION_CONTENT, ease: EASE_TRAVEL, delay: 0.45 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
