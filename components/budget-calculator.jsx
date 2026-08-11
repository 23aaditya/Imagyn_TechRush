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
  Sparkles,
  IndianRupee,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTrip } from "@/context/trip-context"

const RADIUS = 110
const CIRCUM = 2 * Math.PI * RADIUS
const SVG_SIZE = 380
const CENTER = SVG_SIZE / 2

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
  const [hoveredCategory, setHoveredCategory] = useState(null)

  const TOTAL = totalBudget || 35500
  const perPerson = Math.round(TOTAL / Math.max(1, travelers))

  // Exact 6 categories matching the reference chart order and colors 1-to-1
  const segments = [
    {
      id: "Accommodation",
      label: "Accommodation",
      value: categoryBudgets["Accommodation"] || Math.round(TOTAL * 0.30),
      color: "#14B8A6", // Cyan Teal
      icon: Bed
    },
    {
      id: "Food & Dining",
      label: "Food & Dining",
      value: categoryBudgets["Food & Dining"] || Math.round(TOTAL * 0.20),
      color: "#8B5CF6", // Deep Purple
      icon: UtensilsCrossed
    },
    {
      id: "Activities",
      label: "Activities",
      value: categoryBudgets["Activities"] || Math.round(TOTAL * 0.17),
      color: "#84CC16", // Lime Green
      icon: Ticket
    },
    {
      id: "Shopping",
      label: "Shopping",
      value: categoryBudgets["Shopping"] || Math.round(TOTAL * 0.11),
      color: "#10B981", // Mint Emerald
      icon: ShoppingBag
    },
    {
      id: "Emergency Reserve",
      label: "Emergency",
      value: categoryBudgets["Emergency Reserve"] || Math.round(TOTAL * 0.10),
      color: "#EC4899", // Hot Pink
      icon: ShieldAlert
    },
    {
      id: "Transport",
      label: "Transport",
      value: categoryBudgets["Transport"] || Math.round(TOTAL * 0.12),
      color: "#F97316", // Warm Amber Orange
      icon: Bus
    },
  ]

  // Calculate mathematically exact stroke offsets and mid-angle positions in screen coordinates
  let offsetAccum = 0

  const processedSegments = segments.map((seg) => {
    const fraction = TOTAL > 0 ? seg.value / TOTAL : 0
    const pct = Math.round(fraction * 100)
    const dash = fraction * CIRCUM
    const currentOffset = offsetAccum
    offsetAccum += dash

    // Mid-angle calculation in standard unrotated screen space (where -90° is 12 o'clock)
    const startFraction = (currentOffset) / CIRCUM
    const midFraction = startFraction + fraction / 2
    const midAngleRotatedDeg = midFraction * 360 - 90
    const midAngleRad = (midAngleRotatedDeg * Math.PI) / 180

    // Inner Ring Percentage Coordinates (Radius = 110, dead-center in stroke)
    const innerX = CENTER + RADIUS * Math.cos(midAngleRad)
    const innerY = CENTER + RADIUS * Math.sin(midAngleRad)

    // Outer Perimeter Category Label Coordinates (Radius = 154)
    const outerX = CENTER + 154 * Math.cos(midAngleRad)
    const outerY = CENTER + 154 * Math.sin(midAngleRad)

    return {
      ...seg,
      pct,
      fraction,
      dash,
      currentOffset,
      midAngleRotatedDeg,
      innerX,
      innerY,
      outerX,
      outerY
    }
  })

  const handleSaveOverride = (catLabel) => {
    if (editValue && !isNaN(Number(editValue))) {
      setBudgetCategoryOverride(catLabel, Number(editValue))
    }
    setEditingCategory(null)
    setEditValue("")
  }

  return (
    <section id="budget" className={`relative w-full ${isWorkspace ? "min-h-screen bg-background dark:bg-[#0B1528] text-[#2F3E4E] dark:text-[#F1ECE2] pt-24 pb-20" : "bg-secondary/40 py-20 md:py-28"}`}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        
        {/* Workspace Top Bar */}
        {isWorkspace && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="rounded-xl border-border bg-background hover:bg-accent text-xs sm:text-sm cursor-pointer"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to Overview
              </Button>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium text-foreground text-sm">Interactive Budget Workspace</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/20">
                <Sparkles className="h-3.5 w-3.5" />
                Live Synced with AI Itinerary & Expenses
              </span>
            </div>
          </div>
        )}

        {/* Section Title */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-foreground">
            {isWorkspace ? "Trip Budget Breakdown" : "Plan Every Rupee With Confidence"}
          </h2>
        </div>

        {/* Selected Package Callout Banner */}
        {selectedPackage && (
          <div className="mx-auto mb-8 max-w-4xl rounded-2xl border border-teal-500/30 bg-[#0D2B45] p-5 md:p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

        {/* Interactive Sliders Control */}
        {isWorkspace && (
          <div className="mb-10 grid gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm md:grid-cols-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Trip Duration</label>
                <span className="text-sm font-bold text-primary">{days} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="14"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer h-2 bg-muted rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Travelers</label>
                <span className="text-sm font-bold text-primary">{travelers} People</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer h-2 bg-muted rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Stay Comfort</label>
              <div className="grid grid-cols-3 gap-2">
                {["Economy", "Standard", "Luxury"].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => {
                      setStayTier(tier)
                      setCustomTargetBudget(null)
                    }}
                    className={`rounded-xl py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      stayTier === tier
                        ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
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

        {/* Dynamic Elevated Donut Chart & Breakdown Grid Container */}
        <div className="grid items-center gap-10 rounded-3xl border border-border/80 bg-card p-6 shadow-lg md:grid-cols-12 md:p-10">
          
          {/* Main Donut Chart Container (Col-span 6) */}
          <div className="md:col-span-6 flex flex-col items-center justify-center relative py-4">
            <div className="relative flex h-[360px] w-[360px] items-center justify-center">
              
              {/* SVG Donut Ring */}
              <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} className="h-full w-full overflow-visible">
                {/* SVG Rotated Group for Ring Drawing starting at 12 o'clock */}
                <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
                  {/* Track background */}
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    fill="none"
                    stroke="currentColor"
                    className="text-muted/20"
                    strokeWidth="48"
                  />

                  {/* Donut Slices */}
                  {processedSegments.map((seg) => {
                    const isHovered = hoveredCategory === seg.id
                    return (
                      <motion.circle
                        key={seg.id}
                        cx={CENTER}
                        cy={CENTER}
                        r={RADIUS}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth={isHovered ? 54 : 48}
                        strokeDasharray={`${Math.max(0, seg.dash - 2.5)} ${CIRCUM - Math.max(0, seg.dash - 2.5)}`}
                        initial={{ strokeDashoffset: CIRCUM }}
                        animate={{ strokeDashoffset: -seg.currentOffset }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        onMouseEnter={() => setHoveredCategory(seg.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        className="cursor-pointer transition-all duration-200 hover:opacity-90"
                      />
                    )
                  })}
                </g>

                {/* Inner Ring Percentage Typography (Dead-center in stroke, 100% matched) */}
                {processedSegments.map((seg) => {
                  if (seg.pct < 3) return null
                  return (
                    <text
                      key={`pct-${seg.id}`}
                      x={seg.innerX}
                      y={seg.innerY}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-white font-extrabold font-sans pointer-events-none"
                      style={{
                        fontSize: "15px",
                        fontWeight: 800,
                        filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.6))"
                      }}
                    >
                      {seg.pct}%
                    </text>
                  )
                })}

                {/* Outer Perimeter Category Label Badges (100% aligned with exact slice center) */}
                {processedSegments.map((seg) => {
                  return (
                    <text
                      key={`outer-${seg.id}`}
                      x={seg.outerX}
                      y={seg.outerY}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-foreground font-extrabold text-[12px] tracking-tight font-sans pointer-events-none"
                      style={{
                        fontSize: "12px",
                        fontWeight: 800,
                        filter: "drop-shadow(0px 1px 1px rgba(255,255,255,0.8))"
                      }}
                    >
                      {seg.label}
                    </text>
                  )
                })}
              </svg>

              {/* Central Elevated White Badge (Exact Match to User's Design) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex h-36 w-36 sm:h-40 sm:w-40 flex-col items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 border-4 border-white dark:border-slate-800 shadow-2xl shadow-slate-900/10 p-2 text-center pointer-events-auto transition-transform hover:scale-105">
                  
                  {/* Circular Rupee Coin Badge */}
                  <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 shadow-2xs">
                    <IndianRupee className="h-3 w-3 stroke-[2.5]" />
                  </div>

                  {/* Title */}
                  <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    TOTAL ESTIMATED
                  </span>

                  {/* Main Rupee Amount */}
                  <span className="font-heading text-xl sm:text-2xl font-extrabold text-[#0D2B45] dark:text-white leading-tight my-0.5">
                    ₹{TOTAL.toLocaleString("en-IN")}
                  </span>

                  {/* Per Person Pill Badge */}
                  <span className="mt-0.5 inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    ₹{perPerson.toLocaleString("en-IN")} / person
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Category Breakdown Cards (Col-span 6) */}
          <div className="md:col-span-6 grid gap-3 sm:grid-cols-2">
            {processedSegments.map((seg) => {
              const Icon = seg.icon
              const isOverridden = budgetOverrides[seg.label] !== undefined
              const isHovered = hoveredCategory === seg.id

              return (
                <div
                  key={seg.label}
                  onMouseEnter={() => setHoveredCategory(seg.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`flex flex-col justify-between rounded-2xl border p-4 transition-all duration-200 ${
                    isHovered
                      ? "border-primary shadow-md scale-[1.02] bg-accent/40"
                      : isOverridden
                      ? "border-primary/50 bg-primary/5"
                      : "border-border/80 bg-background hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-2xs"
                        style={{ backgroundColor: `${seg.color}25`, color: seg.color }}
                      >
                        <Icon className="h-4 w-4 stroke-[2.5]" aria-hidden />
                      </span>
                      <div>
                        <h4 className="truncate text-xs font-bold text-foreground leading-snug">{seg.label}</h4>
                        <span className="text-[10px] font-extrabold" style={{ color: seg.color }}>
                          {seg.pct}% Allocation
                        </span>
                      </div>
                    </div>
                  </div>

                  {editingCategory === seg.label ? (
                    <div className="flex items-center gap-1.5 mt-2">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder={`₹${seg.value}`}
                        className="w-full rounded-xl border border-primary bg-background px-2.5 py-1 text-xs font-bold text-foreground focus:outline-none"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSaveOverride(seg.label)}
                        className="rounded-lg text-[10px] font-bold px-2.5 py-1 bg-primary text-primary-foreground"
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40 mt-1">
                      <span className="font-heading text-base font-extrabold text-foreground">
                        ₹{seg.value.toLocaleString("en-IN")}
                      </span>

                      <div className="flex items-center gap-1">
                        {isOverridden && (
                          <button
                            onClick={() => resetBudgetCategoryOverride(seg.label)}
                            title="Reset to auto-calculated budget"
                            className="text-muted-foreground hover:text-foreground p-1"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
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
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {isOverridden && (
                    <span className="mt-1 text-[9px] font-bold text-primary uppercase tracking-wider">
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
