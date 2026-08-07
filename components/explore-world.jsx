"use client"

import { motion } from "framer-motion"
import { Map, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ExploreWorld({ onNavigateView }) {
  return (
    <section id="explore" className="relative isolate overflow-hidden bg-[#0D2B45] px-4 py-14 sm:px-6 lg:py-16">
      {/* Background Pinterest Image */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <img
          src="https://i.pinimg.com/1200x/de/00/0e/de000e524c7d9a6da6d1e383d42ab03a.jpg"
          alt="Explore World"
          className="h-full w-full object-cover opacity-45 filter brightness-[0.85] contrast-[1.05]"
        />
      </div>

      {/* Dark Vignette Overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#0D2B45]/80 via-[#0D2B45]/40 to-[#0D2B45]/90" />

      {/* Content */}
      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center space-y-4">
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-4xl font-extrabold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl"
        >
          Don&apos;t know where to travel?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-lg text-base sm:text-lg leading-relaxed text-pretty text-white/80 font-sans"
        >
          Explore destinations visually through interactive digital maps, animated routes, and location markers.
        </motion.p>

        {/* Action Button: "Explore" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="pt-4"
        >
          <Button
            size="lg"
            onClick={() => onNavigateView?.("explore")}
            className="h-14 rounded-full bg-white px-9 text-base font-bold text-neutral-900 shadow-2xl hover:bg-white/90 hover:scale-105 transition-all"
          >
            <Map className="mr-2 h-5 w-5 text-primary" />
            Explore Destinations
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
