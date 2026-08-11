"use client"

import { motion } from "framer-motion"
import { EASE_TRAVEL, DURATION_SIGNATURE } from "@/lib/motion"

export function HorizonTransition({ imageSrc, label, className = "" }) {
  return (
    <div className={`relative w-full h-32 sm:h-44 overflow-hidden select-none my-12 ${className}`}>
      {/* Background Horizon Photography */}
      <motion.div
        initial={{ scale: 1.08, opacity: 0.7 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: DURATION_SIGNATURE, ease: EASE_TRAVEL }}
        className="absolute inset-0 h-full w-full"
      >
        <img
          src={imageSrc || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80"}
          alt="Horizon Line"
          className="h-full w-full object-cover object-center filter brightness-[0.7] contrast-[1.05]"
        />
        {/* Top & Bottom Vignette Blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
      </motion.div>

      {/* Center Micro Telemetry Label */}
      {label && (
        <div className="relative z-10 h-full w-full flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE_TRAVEL, delay: 0.2 }}
            className="font-mono-tech text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] text-white/90 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-sm border border-white/20 shadow-sm"
          >
            {label}
          </motion.span>
        </div>
      )}
    </div>
  )
}
