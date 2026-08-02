"use client"

import { motion } from "framer-motion"
import { Bed, UtensilsCrossed, Bus, Ticket, ShoppingBag, ShieldAlert, Wallet, TrendingUp } from "lucide-react"

const TOTAL = 45000

const segments = [
  { label: "Accommodation", value: 15000, color: "var(--color-primary)", icon: Bed },
  { label: "Food", value: 8000, color: "var(--color-emerald)", icon: UtensilsCrossed },
  { label: "Transport", value: 7000, color: "oklch(0.7 0.15 230)", icon: Bus },
  { label: "Activities", value: 6500, color: "oklch(0.75 0.15 85)", icon: Ticket },
  { label: "Shopping", value: 5000, color: "oklch(0.68 0.16 300)", icon: ShoppingBag },
  { label: "Emergency", value: 3500, color: "oklch(0.62 0.02 257)", icon: ShieldAlert },
]

const RADIUS = 80
const CIRCUM = 2 * Math.PI * RADIUS

export function BudgetCalculator() {
  let offsetAccum = 0

  return (
    <section id="budget" className="relative w-full bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <Wallet className="h-3.5 w-3.5 text-emerald" aria-hidden />
            Smart Budget Calculator
          </span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Plan Every Rupee With Confidence
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            TripNest breaks your trip cost into clear categories so you always know where your money goes.
          </p>
        </div>

        <div className="grid items-center gap-10 rounded-3xl border border-border bg-card p-6 shadow-lg md:grid-cols-2 md:p-10">
          {/* Donut */}
          <div className="relative mx-auto flex h-64 w-64 items-center justify-center md:h-80 md:w-80">
            <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
              <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="var(--color-muted)" strokeWidth="18" />
              {segments.map((seg) => {
                const fraction = seg.value / TOTAL
                const dash = fraction * CIRCUM
                const circle = (
                  <motion.circle
                    key={seg.label}
                    cx="100"
                    cy="100"
                    r={RADIUS}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${CIRCUM - dash}`}
                    initial={{ strokeDashoffset: CIRCUM }}
                    whileInView={{ strokeDashoffset: -offsetAccum }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  />
                )
                offsetAccum += dash
                return circle
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total Budget</span>
              <span className="font-heading text-3xl font-bold text-foreground md:text-4xl">₹45,000</span>
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald">
                <TrendingUp className="h-3 w-3" aria-hidden />
                Optimized
              </span>
            </div>

            {/* Floating update labels */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 6 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="absolute -left-6 top-6 hidden sm:block"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/90 px-3 py-2 shadow-lg shadow-black/5 backdrop-blur-md"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald/15 text-emerald">
                  <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="text-xs font-semibold text-foreground">₹1,200 saved</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: -6 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="absolute -right-4 bottom-8 hidden sm:block"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.3 }}
                className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/90 px-3 py-2 shadow-lg shadow-black/5 backdrop-blur-md"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Wallet className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="text-xs font-semibold text-foreground">Updated just now</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Breakdown cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            {segments.map((seg, i) => {
              const Icon = seg.icon
              const pct = Math.round((seg.value / TOTAL) * 100)
              return (
                <motion.div
                  key={seg.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3"
                >
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `color-mix(in oklch, ${seg.color} 18%, transparent)`, color: seg.color }}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-foreground">{seg.label}</span>
                      <span className="text-xs text-muted-foreground">{pct}%</span>
                    </div>
                    <span className="font-heading text-sm font-semibold text-foreground">
                      ₹{seg.value.toLocaleString("en-IN")}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
