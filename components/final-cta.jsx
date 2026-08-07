"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function FinalCTA({ onNavigateView }) {
  return (
    <section id="get-started" className="relative w-full overflow-hidden select-none py-20 sm:py-28 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative isolate overflow-hidden rounded-[2.5rem] px-6 py-20 text-center shadow-2xl min-h-[440px] flex items-center justify-center"
        >
          {/* Reference Image 2 Background (Emerald Lagoon & Island Karst Rocks) */}
          <div className="absolute inset-0 -z-20 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1600&auto=format&fit=crop&q=80"
              alt="Tropical Emerald Lagoon & Karst Island"
              className="h-full w-full object-cover filter brightness-[0.85] contrast-[1.08] transition-transform duration-1000 hover:scale-105"
            />
          </div>

          {/* Dark Overlay Gradient for High Contrast */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />

          {/* Content */}
          <div className="relative max-w-2xl mx-auto space-y-5">
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
              className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg"
            >
              Ready for Your Next Adventure?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-base sm:text-lg leading-relaxed text-white/90 font-normal drop-shadow-md"
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
          </div>
        </motion.div>
      </div>
    </section>
  )
}
