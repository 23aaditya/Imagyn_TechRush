"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Wallet, PieChart, Building, Utensils, Compass, Car, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BudgetVisualization({ onNavigateView }) {
  const [totalBudget, setTotalBudget] = useState(35000)

  const categories = [
    { label: "Accommodation & Stay", percent: 40, color: "bg-primary text-primary", icon: Building },
    { label: "Dining & Local Cuisine", percent: 25, color: "bg-emerald text-emerald-600 dark:text-emerald-400", icon: Utensils },
    { label: "Experiences & Activities", percent: 20, color: "bg-amber-500 text-amber-500", icon: Compass },
    { label: "Transfers & Transit", percent: 15, color: "bg-purple-500 text-purple-500", icon: Car }
  ]

  return (
    <section className="py-20 bg-[#FAF7F2] border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Title & Interactive Slider */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#6B4423]">
              <PieChart className="h-3.5 w-3.5" />
              Smart Budget Intelligence
            </span>

            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Budget Planner Visualization
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Visualize exact expense allocations across accommodation, dining, experiences, and transit before booking.
            </p>

            {/* Interactive Slider Box */}
            <div className="rounded-3xl border border-border bg-[#F4F6F6] p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-muted-foreground">Trip Budget Goal</span>
                <span className="font-heading text-2xl font-extrabold text-[#6B4423]">
                  ₹{totalBudget.toLocaleString()}
                </span>
              </div>

              <input
                type="range"
                min="15000"
                max="150000"
                step="5000"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
              />

              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
                <span>₹15,000 (Budget)</span>
                <span>₹1,50,000 (Luxury)</span>
              </div>
            </div>

            <Button
              onClick={() => onNavigateView("budget")}
              className="rounded-full bg-primary px-7 py-6 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/25 hover:bg-primary/90"
            >
              Open Full Budget Planner
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Right Column: Category Allocation Visual Chart */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-border bg-[#F4F6F6] p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-[#6B4423]" />
                  Estimated Spend Allocation
                </h3>
                <span className="rounded-full bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Optimized
                </span>
              </div>

              {/* Progress Stack Bar */}
              <div className="h-4 w-full overflow-hidden rounded-full flex bg-muted">
                {categories.map((c) => (
                  <div
                    key={c.label}
                    style={{ width: `${c.percent}%` }}
                    className={`${c.color.split(" ")[0]} h-full transition-all duration-500`}
                    title={`${c.label}: ${c.percent}%`}
                  />
                ))}
              </div>

              {/* Category Items breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((c) => {
                  const IconComp = c.icon
                  const amount = Math.round((totalBudget * c.percent) / 100)
                  return (
                    <div key={c.label} className="rounded-2xl border border-border/60 bg-[#FAF7F2] p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.color.split(" ")[0]} text-white shadow-sm`}>
                          <IconComp className="h-4.5 w-4.5" />
                        </span>
                        <div>
                          <span className="text-xs font-bold text-foreground block">{c.label}</span>
                          <span className="text-[10px] text-muted-foreground">{c.percent}% allocation</span>
                        </div>
                      </div>

                      <span className="font-heading text-sm font-extrabold text-foreground">
                        ₹{amount.toLocaleString()}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Smart Savings Tip Banner */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-emerald shrink-0" />
                <span>
                  <strong>Smart Tip:</strong> Booking midweek flights & boutique homestays saves up to <strong>18%</strong> on total stay allocation.
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
