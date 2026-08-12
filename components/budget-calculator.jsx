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
import { DoodleBackground } from "@/components/doodle-background"
import { PieChart } from "@/components/charts/pie-chart"
import { PieSlice } from "@/components/charts/pie-slice"
import { PieCenter } from "@/components/charts/pie-center"
import { PieLabels } from "@/components/charts/pie-labels"

const RADIUS = 100
const CIRCUM = 2 * Math.PI * RADIUS
const SVG_SIZE = 350
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

  // Curated Soft Pastel Color Palette
  const segments = [
    {
      id: "Accommodation",
      label: "Accommodation",
      value: categoryBudgets["Accommodation"] || Math.round(TOTAL * 0.30),
      color: "#B39DDB", // Soft Pastel Lavender
      icon: Bed
    },
    {
      id: "Food & Dining",
      label: "Food & Dining",
      value: categoryBudgets["Food & Dining"] || Math.round(TOTAL * 0.20),
      color: "#C5E1A5", // Soft Pastel Sage Green
      icon: UtensilsCrossed
    },
    {
      id: "Activities",
      label: "Activities",
      value: categoryBudgets["Activities"] || Math.round(TOTAL * 0.17),
      color: "#F48FB1", // Soft Pastel Rose Pink
      icon: Ticket
    },
    {
      id: "Shopping",
      label: "Shopping",
      value: categoryBudgets["Shopping"] || Math.round(TOTAL * 0.11),
      color: "#FFCC80", // Soft Pastel Warm Apricot
      icon: ShoppingBag
    },
    {
      id: "Emergency Reserve",
      label: "Emergency",
      value: categoryBudgets["Emergency Reserve"] || Math.round(TOTAL * 0.10),
      color: "#80CBC4", // Soft Pastel Mint Teal
      icon: ShieldAlert
    },
    {
      id: "Transport",
      label: "Transport",
      value: categoryBudgets["Transport"] || Math.round(TOTAL * 0.12),
      color: "#90CAF9", // Soft Pastel Sky Blue
      icon: Bus
    },
  ]

  let offsetAccum = 0

  const processedSegments = segments.map((seg) => {
    const fraction = TOTAL > 0 ? seg.value / TOTAL : 0
    const pct = Math.round(fraction * 100)
    const dash = fraction * CIRCUM
    const currentOffset = offsetAccum
    offsetAccum += dash

    // Mid-angle calculation starting from 12 o'clock (-90° / -PI/2) moving clockwise
    const startFraction = currentOffset / CIRCUM
    const midFraction = startFraction + fraction / 2
    const midAngleRotatedDeg = midFraction * 360 - 90
    const midAngleRad = (midAngleRotatedDeg * Math.PI) / 180

    // Inner Ring Percentage Coordinates (Radius = 100)
    const innerX = CENTER + RADIUS * Math.cos(midAngleRad)
    const innerY = CENTER + RADIUS * Math.sin(midAngleRad)

    // Outer Perimeter Category Label Coordinates (Radius = 142 for perfect 15px clearance around the donut slices)
    const outerX = CENTER + 142 * Math.cos(midAngleRad)
    const outerY = CENTER + 142 * Math.sin(midAngleRad)

    // Precise quadrant-aware text alignment parameters for tight, readable spacing next to its slice
    let textAnchor = "middle"
    if (outerX > CENTER + 20) textAnchor = "start"
    else if (outerX < CENTER - 20) textAnchor = "end"

    let dy = "0.35em"
    if (outerY < CENTER - 40) dy = "-0.2em"
    else if (outerY > CENTER + 40) dy = "0.75em"

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
      outerY,
      textAnchor,
      dy
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
    <section id="budget" className={`relative w-full overflow-hidden ${isWorkspace ? "min-h-screen bg-background dark:bg-[#11100E] text-[#2F3E4E] dark:text-[#F1ECE2] pt-24 pb-20" : "bg-secondary/40 py-20 md:py-28"}`}>
      {/* Travel Doodles Background */}
      <DoodleBackground />
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        
        {/* Workspace Top Bar */}
        {isWorkspace && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="rounded-sm border border-[#FFEEEE] bg-[#FFEEEE] hover:bg-[#fcdede] text-[#4A154B] text-xs sm:text-sm font-bold cursor-pointer transition-all shadow-xs"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4 text-[#4A154B]" />
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
          <div className="mb-10 w-full rounded-sm border border-[#f0c8c8] bg-[#fff0f0] p-5 sm:p-6 text-black shadow-sm select-none">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <span className="inline-block text-[11px] uppercase font-black text-white bg-[#8D5BB3] border border-[#8D5BB3] px-3 py-1 rounded-sm tracking-wider">
                  Selected Package Active
                </span>
                <h4 className="font-heading text-xl sm:text-2xl font-black text-black">{selectedPackage.name}</h4>
                <p className="text-xs text-[#7a3a3a] font-medium">
                  Base Package Price: <strong className="text-black">₹{packageBaseCost.toLocaleString("en-IN")}</strong> · Extra Attractions: <strong className="text-[#B45309]">+₹{additionalExpenses.toLocaleString("en-IN")}</strong>
                </p>
              </div>
              <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-[#f0c8c8] pt-3 sm:pt-0 sm:pl-8">
                <span className="text-[10px] uppercase font-bold text-[#7a3a3a] block tracking-wider">Total Est. Cost</span>
                <span className="font-heading text-2xl sm:text-3xl font-black text-black">₹{estimatedTotalTripCost.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Sliders Control */}
        {isWorkspace && (
          <div className="mb-10 grid gap-6 rounded-sm border border-border bg-card p-6 shadow-sm md:grid-cols-3">
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
                className="w-full accent-[#5B8DEF] cursor-pointer h-2 bg-muted rounded-none"
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
                className="w-full accent-[#5B8DEF] cursor-pointer h-2 bg-muted rounded-none"
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
                    className={`rounded-sm py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      stayTier === tier
                        ? "bg-[#8D5BB3] text-white border border-[#8D5BB3] shadow-sm scale-[1.02]"
                        : "bg-[#FFEEEE] text-[#4A154B] hover:bg-[#fcdede]"
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
        <div className="grid items-center gap-10 rounded-sm border border-border/80 bg-card p-6 shadow-lg md:grid-cols-12 md:p-10">
          
          {/* Main Donut Chart Container (Col-span 6) */}
          <div className="md:col-span-6 flex flex-col items-center justify-center relative py-2">
            <div className="relative flex h-[400px] w-full max-w-[400px] items-center justify-center overflow-visible">
              
              {/* @bklit/pie-chart Component */}
              <PieChart
                data={processedSegments.map((seg) => ({
                  id: seg.id,
                  label: seg.label,
                  value: seg.value,
                  color: seg.color,
                }))}
                innerRadius={68}
                hoverOffset={55}
                padAngle={0.03}
                cornerRadius={4}
                hoveredIndex={
                  hoveredCategory
                    ? processedSegments.findIndex((s) => s.id === hoveredCategory)
                    : null
                }
                onHoverChange={(index) => {
                  if (index !== null && index >= 0 && processedSegments[index]) {
                    setHoveredCategory(processedSegments[index].id)
                  } else {
                    setHoveredCategory(null)
                  }
                }}
                className="w-full h-full"
              >
                {processedSegments.map((seg, idx) => (
                  <PieSlice key={seg.id} index={idx} color={seg.color} />
                ))}

                {/* Exact Outer Category Labels Aligned to Slices */}
                <PieLabels
                  hoverColor="#513229"
                  labelRadiusOffset={20}
                  onHoverChange={(index) => {
                    if (index !== null && index >= 0 && processedSegments[index]) {
                      setHoveredCategory(processedSegments[index].id)
                    } else {
                      setHoveredCategory(null)
                    }
                  }}
                />

                <PieCenter>
                  {() => (
                    <div className="flex flex-col items-center justify-center text-center p-2">
                      <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        TOTAL ESTIMATED
                      </span>
                      <span className="font-heading text-xl sm:text-2xl font-extrabold text-[#0D2B45] dark:text-white leading-tight my-0.5">
                        ₹{TOTAL.toLocaleString("en-IN")}
                      </span>
                      <span className="mt-1 text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                        ₹{perPerson.toLocaleString("en-IN")} / person
                      </span>
                    </div>
                  )}
                </PieCenter>
              </PieChart>

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
                  className={`flex flex-col justify-between rounded-sm border p-4 transition-all duration-200 cursor-pointer ${
                    isHovered
                      ? "border-[#D4CEB8] shadow-md scale-[1.02] bg-[#F4F1E2] text-[#513229] dark:bg-[#2B2822] dark:text-[#F1ECE2] dark:border-[#423D33]"
                      : isOverridden
                      ? "border-primary/50 bg-primary/5"
                      : "border-border/80 bg-background hover:bg-[#F4F1E2] hover:border-[#D4CEB8] dark:hover:bg-[#2B2822] dark:hover:border-[#423D33]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm shadow-2xs"
                        style={{ backgroundColor: `${seg.color}20`, color: seg.color }}
                      >
                        <Icon className="h-4 w-4 stroke-[2.5]" aria-hidden />
                      </span>
                      <div>
                        <h4 className={`truncate text-sm sm:text-base font-extrabold transition-colors leading-snug ${isHovered ? "text-[#513229]" : "text-foreground"}`}>{seg.label}</h4>
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
                        className="w-full rounded-sm border border-primary bg-background px-2.5 py-1 text-xs font-bold text-foreground focus:outline-none"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSaveOverride(seg.label)}
                        className="rounded-sm text-[10px] font-bold px-2.5 py-1 bg-[#8D5BB3] text-white hover:bg-[#7b4d9e] border border-[#8D5BB3] cursor-pointer"
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
