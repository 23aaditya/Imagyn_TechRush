"use client"

import { motion } from "framer-motion"

const stickySteps = [
  {
    number: "01",
    title: "Discover Destinations",
    description: "Browse trending seasonal escapes, hidden spots, & travel vibes tailored for you.",
    color: "bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-100 border-amber-300/60 dark:border-amber-700/50",
    rotation: "-rotate-2"
  },
  {
    number: "02",
    title: "Compare Packages",
    description: "Weigh stays, transit options, and activity values side by side for total clarity.",
    color: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-100 border-emerald-300/60 dark:border-emerald-700/50",
    rotation: "rotate-3"
  },
  {
    number: "03",
    title: "Generate Itinerary",
    description: "Craft a realistic day-by-day plan tuned to your pace, rest stops, & budget.",
    color: "bg-sky-100 dark:bg-sky-950/80 text-sky-950 dark:text-sky-100 border-sky-300/60 dark:border-sky-700/50",
    rotation: "-rotate-3"
  },
  {
    number: "04",
    title: "Calculate Budget",
    description: "Get a clear, honest breakdown of your accommodation, meal, and travel costs.",
    color: "bg-rose-100 dark:bg-rose-950/80 text-rose-950 dark:text-rose-100 border-rose-300/60 dark:border-rose-700/50",
    rotation: "rotate-2"
  },
  {
    number: "05",
    title: "Track Expenses",
    description: "Log daily spending live and keep your journey completely stress-free.",
    color: "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-950 dark:text-indigo-100 border-indigo-300/60 dark:border-indigo-700/50",
    rotation: "-rotate-1"
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-background px-4 py-20 sm:px-6 lg:py-28 select-none border-t border-border/60 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-xs font-bold uppercase tracking-widest text-primary block"
          >
            SIMPLE FIVE-STEP PROCESS
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            How TripNest Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg leading-relaxed text-muted-foreground font-sans max-w-xl mx-auto"
          >
            From daydream to departure in five simple steps — planned with quiet precision.
          </motion.p>
        </div>

        {/* Sticky Notes Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {stickySteps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 60, scale: 0.9, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ 
                duration: 0.6, 
                delay: i * 0.1, 
                type: "spring", 
                stiffness: 110, 
                damping: 14 
              }}
              whileHover={{ 
                y: -10, 
                scale: 1.05, 
                rotate: 0,
                zIndex: 30,
                transition: { duration: 0.25 }
              }}
              className={`relative flex flex-col justify-between p-6 rounded-xl border ${step.color} ${step.rotation} shadow-xl shadow-black/10 cursor-default group transition-shadow duration-300 min-h-[220px]`}
            >
              {/* Sticky Tape Header Strip */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/40 dark:bg-white/10 backdrop-blur-sm border border-white/40 rounded-xs shadow-xs" />

              {/* Number Pin Header */}
              <div className="flex items-center justify-between border-b border-current/15 pb-3">
                <span className="font-heading text-2xl font-black opacity-80">
                  #{step.number}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                  Step Note
                </span>
              </div>

              {/* Sticky Content */}
              <div className="py-4 space-y-2 text-left">
                <h3 className="font-heading text-base font-extrabold tracking-tight leading-snug">
                  {step.title}
                </h3>
                <p className="font-sans text-xs opacity-85 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Subtle Footer */}
              <div className="pt-2 text-left">
                <span className="text-[9px] font-semibold uppercase tracking-wider opacity-50 block">
                  TripNest Feature Highlight
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
