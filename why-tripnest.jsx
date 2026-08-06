"use client"

import { motion } from "framer-motion"
import {
  Globe2,
  Compass,
  Calendar,
  Wallet,
  MapPin,
  LineChart,
  Sparkles,
  ListChecks,
} from "lucide-react"

const features = [
  {
    title: "Destination Discovery",
    description: "Find your next escape tailored to your style, season preference, and travel budget.",
    icon: Globe2,
    accent: "primary",
    view: "explore"
  },
  {
    title: "Interactive Globe & Maps",
    description: "Explore destinations visually and trace travel routes before you ever book a ticket.",
    icon: Compass,
    accent: "emerald",
    view: "explore"
  },
  {
    title: "Custom Itinerary Builder",
    description: "Generate an organized day-by-day travel plan in seconds, tailored to your pace.",
    icon: Calendar,
    accent: "primary",
    view: "itinerary"
  },
  {
    title: "Trip Budget Calculator",
    description: "See a realistic cost breakdown for stay options, transport, food, and activities upfront.",
    icon: Wallet,
    accent: "emerald",
    view: "budget"
  },
  {
    title: "Context-Aware Maps",
    description: "Maps that surface nearby attractions, local dining, and transit options seamlessly.",
    icon: MapPin,
    accent: "primary",
    view: "explore"
  },
  {
    title: "Live Expense Tracker",
    description: "Log daily trip spending on the go and keep your travel budget completely on track.",
    icon: LineChart,
    accent: "emerald",
    view: "expenses"
  },
  {
    title: "Curated Recommendations",
    description: "Get handpicked stays, authentic local food spots, and experiences for your travel style.",
    icon: Sparkles,
    accent: "primary",
    view: "itinerary"
  },
  {
    title: "Smart Packing Checklist",
    description: "Auto-generated packing lists based on local weather, planned activities, and trip length.",
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
            Everything you need to plan your perfect journey with ease and confidence.
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
                whileHover={{ y: -4 }}
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
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
