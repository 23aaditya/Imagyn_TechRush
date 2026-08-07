"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function FinalCTA({ onNavigateView }) {
  return (
    <section id="get-started" className="relative w-full overflow-hidden select-none py-24 sm:py-32 md:py-36 border-t border-border/40">
      {/* Background Image - Full Edge-to-Edge Banner */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/final-cta-bg.jpg"
          alt="Tropical emerald island lagoon destination"
          className="h-full w-full object-cover object-center filter brightness-[0.85] contrast-[1.05]"
        />
        {/* Light Opacity Overlay for Text Legibility and Subtle Premium Feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/40 to-black/35 backdrop-blur-[1px]" />
      </div>

      {/* Centered Content Container */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-5"
        >
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-amber-300 block"
          >
            YOUR ESCAPE AWAITS
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-md"
          >
            Ready for Your Next Adventure?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-base sm:text-lg leading-relaxed text-white/90 font-normal drop-shadow-sm max-w-xl mx-auto"
          >
            Plan quietly, save time, and travel confidently with TripNest.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => onNavigateView?.("itinerary")}
              className="inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 text-base font-bold text-neutral-900 shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/95 focus:outline-none"
            >
              Plan My Trip Now
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
