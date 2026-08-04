"use client"

import { motion } from "framer-motion"
import { Bed, UtensilsCrossed, Bus, Ticket, ShoppingBag, ShieldAlert, Wallet, TrendingUp, Sparkles } from "lucide-react"
import { useItinerary } from "@/lib/itinerary-context"

const RADIUS = 80
const CIRCUM = 2 * Math.PI * RADIUS

export function BudgetCalculator() {
  const {
    selectedDestinationKey,
    estimatedAccommodationCost,
    estimatedFoodCost,
    estimatedTransportCost,
    totalAttractionCost,
    grandTotalBudget
  } = useItinerary()

  const shoppingCost = 4000
  const emergencyCost = 2500
  const total = estimatedAccommodationCost + estimatedFoodCost + estimatedTransportCost + totalAttractionCost + shoppingCost + emergencyCost

  const segments = [
    { label: "Accommodation", value: estimatedAccommodationCost, color: "var(--color-primary)", icon: Bed },
    { label: "Food & Dining", value: estimatedFoodCost, color: "var(--color-emerald)", icon: UtensilsCrossed },
    { label: "Transport", value: estimatedTransportCost, color: "oklch(0.7 0.15 230)", icon: Bus },
    { label: "Attractions", value: totalAttractionCost, color: "oklch(0.75 0.15 85)", icon: Ticket },
    { label: "Shopping", value: shoppingCost, color: "oklch(0.68 0.16 300)", icon: ShoppingBag },
    { label: "Emergency", value: emergencyCost, color: "oklch(0.62 0.02 257)", icon: ShieldAlert },
  ]

  let offsetAccum = 0

  return (
    <section id="budget" className="relative w-full bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <Wallet className="h-3.5 w-3.5 text-emerald" aria-hidden />
            Smart Budget Calculator
          </span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-foreground">
            Plan Every Rupee With Confidence
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            Live auto-calculated breakdown for <strong className="text-foreground">{selectedDestinationKey}</strong> based on your active itinerary choices.
          </p>
        </div>

        <div className="grid items-center gap-10 rounded-3xl border border-border bg-card p-6 shadow-lg md:grid-cols-2 md:p-10">
          {/* Donut Chart */}
          <div className="relative mx-auto flex h-64 w-64 items-center justify-center md:h-80 md:w-80">
            <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
              <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="var(--color-muted)" strokeWidth="18" />
              {segments.map((seg) => {
                const fraction = total > 0 ? seg.value / total : 0
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
                    animate={{ strokeDashoffset: -offsetAccum }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                )
                offsetAccum += dash
                return circle
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Est. Total Budget</span>
              <span className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                ₹{total.toLocaleString("en-IN")}
              </span>
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald">
                <TrendingUp className="h-3 w-3" aria-hidden />
                Live Dynamic Sync
              </span>
            </div>

            {/* Floating updates */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute -left-6 top-6 hidden sm:block"
            >
              <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/90 px-3 py-2 shadow-lg backdrop-blur-md">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald/15 text-emerald">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="text-xs font-semibold text-foreground">₹{totalAttractionCost.toLocaleString("en-IN")} Activities</span>
              </div>
            </motion.div>
          </div>

          {/* Breakdown Segment Cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            {segments.map((seg, i) => {
              const Icon = seg.icon
              const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0
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
