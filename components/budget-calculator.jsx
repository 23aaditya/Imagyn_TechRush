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
  ArrowLeft,
  Edit3,
  RotateCcw,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTrip } from "@/context/trip-context"
import { DoodleBackground } from "@/components/doodle-background"

const RADIUS = 80
const CIRCUM = 2 * Math.PI * RADIUS

export function BudgetCalculator({ isWorkspace = false, onBack, onOpenWorkspace }) {
  const {
    days,
    setDays,
    travelers,
    setTravelers,
    stayTier,
    setStayTier,
    setCustomTargetBudget,
    categoryBudgets,
    totalBudget,
    budgetOverrides,
    setBudgetCategoryOverride,
    resetBudgetCategoryOverride,
    selectedPackage,
    packageBaseCost,
    additionalExpenses,
    estimatedTotalTripCost
  } = useTrip()

  const [editingCategory, setEditingCategory] = useState(null)
  const [editValue, setEditValue] = useState("")

  const TOTAL = totalBudget || 1
  const perPerson = Math.round(TOTAL / travelers)

  const segments = [
    { label: "Accommodation", value: categoryBudgets["Accommodation"] || 0, color: "var(--color-primary)", icon: Bed },
    { label: "Food & Dining", value: categoryBudgets["Food & Dining"] || 0, color: "var(--color-emerald)", icon: UtensilsCrossed },
    { label: "Transport", value: categoryBudgets["Transport"] || 0, color: "oklch(0.7 0.15 230)", icon: Bus },
    { label: "Activities", value: categoryBudgets["Activities"] || 0, color: "oklch(0.75 0.15 85)", icon: Ticket },
    { label: "Shopping", value: categoryBudgets["Shopping"] || 0, color: "oklch(0.68 0.16 300)", icon: ShoppingBag },
    { label: "Emergency Reserve", value: categoryBudgets["Emergency Reserve"] || 0, color: "oklch(0.62 0.02 257)", icon: ShieldAlert },
  ]

  let offsetAccum = 0

  const handleSaveOverride = (catLabel) => {
    if (editValue && !isNaN(Number(editValue))) {
      setBudgetCategoryOverride(catLabel, Number(editValue))
    }
    setEditingCategory(null)
    setEditValue("")
  }

  return (
    <section id="budget" className={`relative w-full ${isWorkspace ? "min-h-screen bg-background dark:bg-[#11100E] text-[#2F3E4E] dark:text-[#F1ECE2] pt-24 pb-20" : "bg-secondary/40 py-20 md:py-28"}`}>
      {/* Travel Doodles Background */}
      <DoodleBackground />

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        
        {/* Workspace Top Bar */}
        {isWorkspace && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="rounded-md border-border bg-background hover:bg-accent text-xs sm:text-sm cursor-pointer"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to Overview
              </Button>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium text-foreground text-sm">Interactive Budget Workspace</span>
            </div>
          </div>
        )}

        {/* 100% EDGE-TO-EDGE HORIZONTAL RECTANGULAR VIDEO HERO BANNER */}
        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-12 overflow-hidden h-[240px] sm:h-[300px] lg:h-[360px] flex items-center justify-center border-y border-border/40 select-none shadow-2xl bg-black">
          {/* Autoplay Loop Muted YouTube Background Video */}
          <iframe
            src="https://www.youtube.com/embed/gVQo-F8TVuk?autoplay=1&mute=1&controls=0&loop=1&playlist=gVQo-F8TVuk&playsinline=1&modestbranding=1&rel=0&disablekb=1&iv_load_policy=3"
            title="TripNest Budget Header Video"
            className="absolute inset-0 w-full h-[140%] -top-[20%] object-cover pointer-events-none scale-125 opacity-75"
            allow="autoplay; encrypted-media"
          />

          {/* Translucent Dark Gradient Overlay for Maximum Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />

          {/* White Font BUDGET Title & Subtitle Overlay */}
          <div className="relative z-10 text-center px-4 max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-[#5B8DEF] block mb-2"
            >
              FINANCIAL TRAVEL ARCHITECT
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif-editorial text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase tracking-wider leading-none drop-shadow-2xl"
            >
              BUDGET
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-sans text-xs sm:text-sm font-semibold text-white/90 uppercase tracking-widest mt-3 drop-shadow-md"
            >
              Transparent Realistic Cost Allocation & Category Breakdown
            </motion.p>
          </div>
        </div>

        {/* Selected Package Callout Banner */}
        {selectedPackage && (
          <div className="mx-auto mb-10 max-w-4xl rounded-xl border border-teal-500/30 bg-[#0D2B45] p-5 md:p-6 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-teal-300 tracking-wider block">
                Selected Package Active
              </span>
              <h4 className="font-heading text-xl font-bold">{selectedPackage.name}</h4>
              <p className="text-xs text-slate-300">
                Base Package Price: <strong className="text-white">₹{packageBaseCost.toLocaleString("en-IN")}</strong> · Extra Attractions: <strong className="text-amber-400">+₹{additionalExpenses.toLocaleString("en-IN")}</strong>
              </p>
            </div>
            <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-white/20 pt-3 sm:pt-0 sm:pl-6">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Est. Cost</span>
              <span className="font-heading text-2xl font-bold text-teal-300">₹{estimatedTotalTripCost.toLocaleString("en-IN")}</span>
            </div>
          </div>
        )}

        {/* Interactive Workspace Sliders Control (Only in Workspace Mode) */}
        {isWorkspace && (
          <div className="mb-10 grid gap-6 rounded-xl border border-border bg-card p-6 shadow-xs md:grid-cols-3">
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
                    onClick={() => {
                      setStayTier(tier)
                      setCustomTargetBudget(null)
                    }}
                    className={`rounded-sm py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      stayTier === tier
                        ? "bg-primary text-primary-foreground shadow-xs"
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
        <div className="grid items-center gap-10 rounded-xl border border-border bg-card p-6 shadow-xs md:grid-cols-2 md:p-10">
          {/* Donut Chart */}
          <div className="relative mx-auto flex h-64 w-64 items-center justify-center md:h-80 md:w-80">
            <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
              <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="var(--color-muted)" strokeWidth="18" />
              {segments.map((seg) => {
                const fraction = TOTAL > 0 ? seg.value / TOTAL : 0
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
              <span className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                ₹{perPerson.toLocaleString("en-IN")} / person
              </span>
            </div>
          </div>

          {/* Breakdown Items with Manual Override Triggers */}
          <div className="grid gap-3 sm:grid-cols-2">
            {segments.map((seg) => {
              const Icon = seg.icon
              const pct = TOTAL > 0 ? Math.round((seg.value / TOTAL) * 100) : 0
              const isOverridden = budgetOverrides[seg.label] !== undefined

              return (
                <div
                  key={seg.label}
                  className={`flex flex-col justify-between rounded-md border p-3.5 transition-all ${
                    isOverridden
                      ? "border-primary/50 bg-primary/5"
                      : "border-border bg-background hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `color-mix(in oklch, ${seg.color} 18%, transparent)`, color: seg.color }}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="truncate text-xs font-semibold text-foreground">{seg.label}</span>
                    </div>
                    <span className="text-[11px] font-bold text-muted-foreground">{pct}%</span>
                  </div>

                  {editingCategory === seg.label ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder={`₹${seg.value}`}
                        className="w-full rounded-xl border border-primary bg-background px-2.5 py-1 text-xs font-bold text-foreground focus:outline-none"
                        autoFocus
                      />
                      <Button
                        size="xs"
                        onClick={() => handleSaveOverride(seg.label)}
                        className="rounded-lg text-[10px] font-bold px-2 py-1 bg-primary text-primary-foreground"
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
                      <span className="font-heading text-sm font-bold text-foreground">
                        ₹{seg.value.toLocaleString("en-IN")}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        {isOverridden && (
                          <button
                            onClick={() => resetBudgetCategoryOverride(seg.label)}
                            title="Reset to auto-calculated budget"
                            className="text-muted-foreground hover:text-foreground p-1"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingCategory(seg.label)
                            setEditValue(String(seg.value))
                          }}
                          title="Override budget manually"
                          className="text-muted-foreground hover:text-primary p-1"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {isOverridden && (
                    <span className="mt-1 text-[9px] font-semibold text-primary uppercase tracking-wider">
                      Manual Override Active
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
