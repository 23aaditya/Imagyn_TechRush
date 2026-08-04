"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Bed,
  UtensilsCrossed,
  Bus,
  Ticket,
  ShoppingBag,
  ShieldAlert,
  Wallet,
  TrendingUp,
  ArrowLeft,
  Users,
  Calendar,
  Sparkles,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

const RADIUS = 80
const CIRCUM = 2 * Math.PI * RADIUS

export function BudgetCalculator({ isWorkspace = false, onBack, onOpenWorkspace }) {
  const [days, setDays] = useState(5)
  const [travelers, setTravelers] = useState(2)
  const [stayTier, setStayTier] = useState("Standard") // Economy | Standard | Luxury

  // Dynamic calculations based on parameters
  const stayMultiplier = stayTier === "Economy" ? 1800 : stayTier === "Standard" ? 3500 : 7500
  const foodPerDay = 1200 * travelers * days
  const stayTotal = stayMultiplier * days
  const transportTotal = 1500 * travelers + 800 * days
  const activitiesTotal = 1200 * travelers * days
  const shoppingTotal = 2500 * travelers
  const emergencyTotal = 1500 * days

  const TOTAL = stayTotal + foodPerDay + transportTotal + activitiesTotal + shoppingTotal + emergencyTotal
  const perPerson = Math.round(TOTAL / travelers)

  const segments = [
    { label: "Accommodation", value: stayTotal, color: "var(--color-primary)", icon: Bed },
    { label: "Food & Dining", value: foodPerDay, color: "var(--color-emerald)", icon: UtensilsCrossed },
    { label: "Transport", value: transportTotal, color: "oklch(0.7 0.15 230)", icon: Bus },
    { label: "Activities", value: activitiesTotal, color: "oklch(0.75 0.15 85)", icon: Ticket },
    { label: "Shopping", value: shoppingTotal, color: "oklch(0.68 0.16 300)", icon: ShoppingBag },
    { label: "Emergency Reserve", value: emergencyTotal, color: "oklch(0.62 0.02 257)", icon: ShieldAlert },
  ]

  let offsetAccum = 0

  return (
    <section id="budget" className={`relative w-full ${isWorkspace ? "min-h-screen bg-background pt-24 pb-20" : "bg-secondary/40 py-20 md:py-28"}`}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        
        {/* Workspace Top Bar */}
        {isWorkspace && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="rounded-xl border-border bg-background hover:bg-accent text-xs sm:text-sm"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to Overview
              </Button>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium text-foreground text-sm">Interactive Budget Workspace</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Wallet className="h-3.5 w-3.5" />
                Real-Time Calculator Active
              </span>
            </div>
          </div>
        )}

        {/* Section Title */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <Wallet className="h-3.5 w-3.5 text-emerald" aria-hidden />
            Smart Budget Estimator
          </span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {isWorkspace ? "Interactive Trip Budget Calculator" : "Plan Every Rupee With Confidence"}
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground leading-relaxed">
            TripNest breaks your trip cost into clear categories so you always know where your money goes.
          </p>
        </div>

        {/* Interactive Workspace Sliders Control (Only in Workspace Mode) */}
        {isWorkspace && (
          <div className="mb-10 grid gap-6 rounded-3xl border border-border bg-card p-6 shadow-md md:grid-cols-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trip Duration</label>
                <span className="text-sm font-bold text-primary">{days} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="14"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Travelers</label>
                <span className="text-sm font-bold text-primary">{travelers} People</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Stay Comfort</label>
              <div className="grid grid-cols-3 gap-1.5">
                {["Economy", "Standard", "Luxury"].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setStayTier(tier)}
                    className={`rounded-xl py-2 text-xs font-semibold transition-all ${
                      stayTier === tier
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Donut Chart & Segments Card */}
        <div className="grid items-center gap-10 rounded-3xl border border-border bg-card p-6 shadow-lg md:grid-cols-2 md:p-10">
          {/* Donut Chart */}
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
                    animate={{ strokeDashoffset: -offsetAccum }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                )
                offsetAccum += dash
                return circle
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total Estimated</span>
              <span className="font-heading text-3xl font-bold text-foreground md:text-4xl">₹{TOTAL.toLocaleString("en-IN")}</span>
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald/10 px-2.5 py-0.5 rounded-full">
                ₹{perPerson.toLocaleString("en-IN")} / person
              </span>
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="grid gap-3 sm:grid-cols-2">
            {segments.map((seg, i) => {
              const Icon = seg.icon
              const pct = Math.round((seg.value / TOTAL) * 100)
              return (
                <div
                  key={seg.label}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3 transition-all hover:border-primary/40"
                >
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `color-mix(in oklch, ${seg.color} 18%, transparent)`, color: seg.color }}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs font-medium text-muted-foreground">{seg.label}</span>
                      <span className="text-xs font-bold text-foreground">{pct}%</span>
                    </div>
                    <span className="font-heading text-sm font-semibold text-foreground">
                      ₹{seg.value.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Home Overview Action CTA */}
        {!isWorkspace && onOpenWorkspace && (
          <div className="mt-8 text-center">
            <Button
              onClick={onOpenWorkspace}
              className="rounded-2xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
            >
              Open Full Interactive Budget Workspace
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        )}

      </div>
    </section>
  )
}
