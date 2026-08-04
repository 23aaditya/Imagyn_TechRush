"use client"

import { motion } from "framer-motion"
import { Search, Package, Sparkles, Calculator, PlaneTakeoff, ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Discover Destinations",
    description: "Browse trending spots tailored to your season and style.",
    icon: Search,
    accent: "primary",
    view: "explore"
  },
  {
    number: "02",
    title: "Compare Packages",
    description: "Weigh stays, flights, and activities side by side.",
    icon: Package,
    accent: "emerald",
    view: "packages"
  },
  {
    number: "03",
    title: "Generate Smart Itinerary",
    description: "Let AI craft a day-by-day plan in seconds.",
    icon: Sparkles,
    accent: "primary",
    view: "itinerary"
  },
  {
    number: "04",
    title: "Calculate Budget",
    description: "Get a clear, realistic breakdown of every cost.",
    icon: Calculator,
    accent: "emerald",
    view: "budget"
  },
  {
    number: "05",
    title: "Track Expenses",
    description: "Log spending live and stay stress-free.",
    icon: PlaneTakeoff,
    accent: "primary",
    view: "expenses"
  },
]

export function HowItWorks({ onNavigateView }) {
  return (
    <section id="how-it-works" className="relative bg-background px-4 py-20 sm:px-6 lg:py-28">
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
            How TripNest Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-lg leading-relaxed text-pretty text-muted-foreground"
          >
            From daydream to departure in five simple steps. Click any step to launch that feature workspace.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative mt-16">
          {/* Connecting line (desktop) */}
          <div className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />

          <ol className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon
              const isPrimary = step.accent === "primary"
              return (
                <motion.li
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => onNavigateView?.(step.view)}
                  className="relative flex cursor-pointer flex-col items-center text-center group"
                >
                  {/* Icon node */}
                  <div className="relative z-10 transition-transform group-hover:scale-110">
                    <div
                      className={`flex h-[72px] w-[72px] items-center justify-center rounded-2xl shadow-lg ${
                        isPrimary
                          ? "bg-primary text-primary-foreground shadow-primary/25"
                          : "bg-emerald text-emerald-foreground shadow-emerald/25"
                      }`}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                    <span
                      className={`absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-card text-xs font-bold ${
                        isPrimary ? "text-primary" : "text-emerald"
                      }`}
                    >
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-5 font-heading text-lg font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>

                  {/* Mobile connector arrow */}
                  {i < steps.length - 1 && (
                    <ArrowRight className="mt-6 h-5 w-5 rotate-90 text-border sm:hidden" aria-hidden />
                  )}
                </motion.li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
