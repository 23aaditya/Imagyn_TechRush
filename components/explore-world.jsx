"use client"

import { motion } from "framer-motion"
import { Map, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Pin positions over the world-map backdrop
const pins = [
  { top: "34%", left: "22%", delay: 0 },
  { top: "30%", left: "48%", delay: 0.6 },
  { top: "42%", left: "70%", delay: 1.1 },
  { top: "58%", left: "32%", delay: 0.3 },
  { top: "62%", left: "82%", delay: 0.9 },
  { top: "26%", left: "82%", delay: 1.4 },
]

// Floating landmark bubbles
const landmarks = [
  { src: "/images/dest-santorini.png", label: "Santorini", top: "12%", left: "6%", delay: 0 },
  { src: "/images/dest-jaipur.png", label: "Jaipur", top: "20%", right: "8%", delay: 0.4 },
  { src: "/images/dest-bali.png", label: "Bali", bottom: "16%", left: "10%", delay: 0.8 },
  { src: "/images/dest-manali.png", label: "Manali", bottom: "12%", right: "9%", delay: 1.2 },
]

export function ExploreWorld({ onNavigateView, onSelectDestination }) {
  return (
    <section id="explore" className="relative isolate overflow-hidden bg-[oklch(0.17_0.02_257)] px-4 py-24 sm:px-6 lg:py-32">
      {/* World map backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <img
          src="/images/world-map-dark.png"
          alt=""
          aria-hidden
          className="h-full w-full max-w-6xl object-contain opacity-60"
        />
        {/* Glowing pins layered over the map */}
        <div className="absolute inset-0 mx-auto max-w-6xl">
          {pins.map((pin, i) => (
            <span
              key={i}
              className="absolute"
              style={{ top: pin.top, left: pin.left }}
            >
              <motion.span
                className="absolute -inset-3 rounded-full bg-emerald/40"
                animate={{ scale: [1, 2.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.4, delay: pin.delay, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
              />
              <span className="relative block h-2.5 w-2.5 rounded-full bg-emerald shadow-[0_0_12px_2px_var(--color-emerald)]" />
            </span>
          ))}
        </div>
      </div>

      {/* Floating landmark bubbles */}
      <div className="absolute inset-0 z-10 pointer-events-none max-w-7xl mx-auto hidden md:block">
        {landmarks.map((lm, i) => (
          <motion.button
            key={lm.label}
            type="button"
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectDestination?.(lm.label)}
            style={{
              top: lm.top,
              left: lm.left,
              right: lm.right,
              bottom: lm.bottom
            }}
            className="absolute pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/20 bg-black/60 p-1.5 pr-4 backdrop-blur-xl shadow-2xl transition-all cursor-pointer group"
          >
            <div className="h-10 w-10 overflow-hidden rounded-full border border-white/30">
              <img src={lm.src} alt={lm.label} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Explore</span>
              <span className="block text-xs font-extrabold text-white">{lm.label}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Dark vignette for text contrast */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(0.17_0.02_257)]/70 via-[oklch(0.17_0.02_257)]/40 to-[oklch(0.17_0.02_257)]/85" />

      {/* Content */}
      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl"
        >
          Don&apos;t know where to travel?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 max-w-lg text-lg leading-relaxed text-pretty text-white/70"
        >
          Explore destinations visually through interactive digital maps, animated routes, and location markers.
        </motion.p>

        {/* Action button: "Explore" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Button
            size="lg"
            onClick={() => onNavigateView?.("explore")}
            className="mt-9 h-14 rounded-2xl bg-emerald px-8 text-base font-bold text-emerald-foreground shadow-lg shadow-emerald/25 transition-transform hover:-translate-y-0.5 hover:bg-emerald/90"
          >
            <Map className="mr-2 h-5 w-5" />
            Explore
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
