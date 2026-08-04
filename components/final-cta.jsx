"use client"

import { motion } from "framer-motion"
import { ArrowRight, Compass, Plane, MapPin, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

import { useAuth } from "@/lib/auth-context"

const floaters = [
  { icon: Plane, pos: "left-[8%] top-[18%]", delay: 0, size: "h-10 w-10" },
  { icon: MapPin, pos: "right-[10%] top-[22%]", delay: 0.6, size: "h-9 w-9" },
  { icon: Compass, pos: "left-[14%] bottom-[16%]", delay: 1.1, size: "h-8 w-8" },
  { icon: Sparkles, pos: "right-[16%] bottom-[20%]", delay: 1.6, size: "h-7 w-7" },
]

export function FinalCTA() {
  const { requireAuth } = useAuth()

  const handlePlanMyTrip = () => {
    requireAuth(() => {
      const el = document.getElementById("itinerary")
      if (el) el.scrollIntoView({ behavior: "smooth" })
    }, "Sign in to plan your next trip adventure")
  }

  return (
    <section id="get-started" className="relative w-full overflow-hidden px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative isolate overflow-hidden rounded-[2.5rem] px-6 py-16 text-center shadow-2xl shadow-primary/20 sm:px-10 md:py-24"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 -z-20 bg-gradient-to-br from-primary via-primary to-[oklch(0.5_0.2_285)]" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/25 via-transparent to-white/10" />

          {/* Background illustration */}
          <img
            src="/images/world-map-dark.png"
            alt=""
            aria-hidden
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-15 mix-blend-overlay"
          />

          {/* Ambient glows */}
          <div className="pointer-events-none absolute -left-16 -top-16 -z-10 h-72 w-72 rounded-full bg-emerald/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 -z-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          {/* Floating icons */}
          {floaters.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + f.delay * 0.15 }}
                className={`pointer-events-none absolute hidden sm:block ${f.pos}`}
              >
                <motion.div
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: 4 + f.delay, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: f.delay }}
                  className={`flex ${f.size} items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-md`}
                >
                  <Icon className="h-1/2 w-1/2" aria-hidden />
                </motion.div>
              </motion.div>
            )
          })}

          {/* Content */}
          <div className="relative">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Join thousands of smart travelers
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-6 max-w-2xl text-balance font-heading text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Ready for Your Next Adventure?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-white/85"
            >
              Plan smarter, save time and travel confidently with TripNest.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Button
                onClick={handlePlanMyTrip}
                className="h-12 w-full rounded-2xl bg-white px-7 text-base font-semibold text-primary shadow-lg shadow-black/10 hover:bg-white/90 sm:w-auto"
              >
                Plan My Trip
                <ArrowRight className="ml-1 h-5 w-5" aria-hidden data-icon="inline-end" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const el = document.getElementById("destinations")
                  if (el) el.scrollIntoView({ behavior: "smooth" })
                }}
                className="h-12 w-full rounded-2xl border-white/40 bg-white/5 px-7 text-base font-semibold text-white backdrop-blur-md hover:bg-white/15 hover:text-white sm:w-auto"
              >
                Explore Destinations
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
