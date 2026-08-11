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
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[0.95] drop-shadow-md"
          >
            PLAN LESS.<br />
            <span className="font-heading font-extrabold text-white italic lowercase">travel</span><br />
            MORE.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-xs sm:text-sm leading-relaxed text-white/90 font-medium tracking-wide drop-shadow-sm max-w-xl mx-auto"
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
              className="inline-flex items-center gap-2 rounded-sm bg-white px-8 py-3 text-xs font-bold uppercase tracking-wider text-neutral-900 shadow-md transition-all hover:bg-white/90 focus:outline-none cursor-pointer"
            >
              Plan My Trip Now
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
