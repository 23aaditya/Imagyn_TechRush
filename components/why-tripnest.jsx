"use client"

import { motion } from "framer-motion"
import {
  Globe2,
  Compass,
  BrainCircuit,
  Wallet,
  MapPin,
  LineChart,
  Sparkles,
  ListChecks,
  ChevronRight
} from "lucide-react"

const features = [
  {
    title: "Smart Destination Discovery",
    description: "Find your next escape with AI that matches places to your vibe, season, and budget.",
    icon: Globe2,
    accent: "primary",
    view: "explore"
  },
  {
    title: "Interactive Globe Exploration",
    description: "Spin the globe and explore destinations visually before you ever book a ticket.",
    icon: Compass,
    accent: "emerald",
    view: "explore"
  },
  {
    title: "AI Itinerary Builder",
    description: "Generate a day-by-day plan in seconds, tailored to your interests and pace.",
    icon: BrainCircuit,
    accent: "primary",
    view: "itinerary"
  },
  {
    title: "Smart Budget Calculator",
    description: "See a realistic cost breakdown for flights, stays, food, and activities upfront.",
    icon: Wallet,
    accent: "emerald",
    view: "budget"
  },
  {
    title: "Context-Aware Maps",
    description: "Maps that surface nearby gems, transit, and timing based on where you are.",
    icon: MapPin,
    accent: "primary",
    view: "explore"
  },
  {
    title: "Expense Tracker",
    description: "Log spending on the go and stay on budget throughout your entire trip.",
    icon: LineChart,
    accent: "emerald",
    view: "expenses"
  },
  {
    title: "AI Recommendations",
    description: "Get curated stays, food, and experiences chosen just for your travel style.",
    icon: Sparkles,
    accent: "primary",
    view: "itinerary"
  },
  {
    title: "Packing Checklist",
    description: "Auto-generated packing lists based on weather, activities, and trip length.",
    icon: ListChecks,
    accent: "emerald",
    view: "itinerary"
  },
]

export function WhyTripNest({ onNavigateView }) {
  return (
    <section id="features" className="relative bg-secondary/40 px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl"
          >
            Why TripNest?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-lg leading-relaxed text-pretty text-muted-foreground"
          >
            Everything you need to plan your perfect journey. Click any tool card below to launch its workspace.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => {
            const Icon = feature.icon
            const isPrimary = feature.accent === "primary"
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                onClick={() => onNavigateView?.(feature.view)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
              >
                {/* Gradient wash */}
                <div
                  className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 ${
                    isPrimary ? "bg-primary/25" : "bg-emerald/25"
                  }`}
                />

                {/* Icon */}
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${
                    isPrimary ? "bg-primary/10 text-primary" : "bg-emerald/10 text-emerald"
                  }`}
                >
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mt-5 font-heading text-lg font-bold leading-tight text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>

                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  <span>Launch Tool Workspace</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
