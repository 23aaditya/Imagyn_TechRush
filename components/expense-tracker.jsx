"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Wallet,
  PiggyBank,
  TrendingUp,
  ArrowLeft,
  Plus,
  Trash2,
  Receipt,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"

const initialLogs = [
  { id: 1, title: "Artjuna Cafe Breakfast", category: "Food & Dining", amount: 500, day: "Mon", date: "Monday" },
  { id: 2, title: "Fort Aguada Entry & Scooter Fuel", category: "Transport", amount: 1200, day: "Tue", date: "Tuesday" },
  { id: 3, title: "Beachside Shack Dinner", category: "Food & Dining", amount: 700, day: "Wed", date: "Wednesday" },
  { id: 4, title: "Water Sports & Parasailing", category: "Activities", amount: 2200, day: "Thu", date: "Thursday" },
  { id: 5, title: "Hotel Stay Booking", category: "Accommodation", amount: 4500, day: "Fri", date: "Friday" },
  { id: 6, title: "Night Market Souvenirs", category: "Shopping", amount: 1800, day: "Sat", date: "Saturday" },
  { id: 7, title: "Airport Cab Ride", category: "Transport", amount: 900, day: "Sun", date: "Sunday" },
]

export function ExpenseTracker({ isWorkspace = false, onBack, onOpenWorkspace }) {
  const [logs, setLogs] = useState(initialLogs)
  const [budgetGoal, setBudgetGoal] = useState(25000)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Food & Dining")
  const [amount, setAmount] = useState("")
  const [hoveredDay, setHoveredDay] = useState(null)

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!title || !amount) return
    const newLog = {
      id: Date.now(),
      title,
      category,
      amount: Number(amount),
      day: "Today",
      date: "Just now"
    }
    setLogs([newLog, ...logs])
    setTitle("")
    setAmount("")
  }

  const handleDeleteLog = (id) => {
    setLogs(logs.filter((l) => l.id !== id))
  }

  const totalSpent = logs.reduce((sum, item) => sum + item.amount, 0)
  const remaining = Math.max(0, budgetGoal - totalSpent)
  const pctRemaining = Math.round((remaining / budgetGoal) * 100)

  // Category breakdown
  const catBreakdown = logs.reduce((acc, l) => {
    acc[l.category] = (acc[l.category] || 0) + l.amount
    return acc
  }, {})

  // Weekly daily breakdown calculation
  const daysList = [
    { day: "Mon", full: "Monday" },
    { day: "Tue", full: "Tuesday" },
    { day: "Wed", full: "Wednesday" },
    { day: "Thu", full: "Thursday" },
    { day: "Fri", full: "Friday" },
    { day: "Sat", full: "Saturday" },
    { day: "Sun", full: "Sunday" }
  ]

  const weeklyData = daysList.map((d) => {
    const dayTotal = logs
      .filter((l) => l.day === d.day || l.date === d.full)
      .reduce((sum, item) => sum + item.amount, 0)
    return {
      day: d.day,
      full: d.full,
      amount: dayTotal
    }
  })

  const maxDaily = Math.max(...weeklyData.map((d) => d.amount), 1000)
  const highestDay = weeklyData.reduce((prev, current) => (current.amount > prev.amount ? current : prev), weeklyData[0])

  return (
    <section id="tracker" className={`relative w-full ${isWorkspace ? "min-h-screen bg-background pt-24 pb-20" : "py-20 md:py-28 bg-background"}`}>
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
              <span className="font-medium text-foreground text-sm">Trip Expense Tracker</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Receipt className="h-3.5 w-3.5" />
                Live Log Sync
              </span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-foreground">
            {isWorkspace ? "Live Trip Expense Workspace" : "Track Spending As You Travel"}
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground leading-relaxed">
            Log expenses on the go, stay under budget, and analyze spending patterns in real-time.
          </p>
        </div>

        {/* Stat Cards (3 Cards - Average Per Item removed as requested) */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Wallet className="h-5 w-5" />
            </span>
            <p className="mt-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Spent</p>
            <p className="mt-1 font-heading text-2xl font-bold text-foreground">₹{totalSpent.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{logs.length} items logged</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald/15 text-emerald-600 dark:text-emerald-400">
              <PiggyBank className="h-5 w-5" />
            </span>
            <p className="mt-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Remaining Budget</p>
            <p className="mt-1 font-heading text-2xl font-bold text-emerald-600 dark:text-emerald-400">₹{remaining.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{pctRemaining}% of budget remaining</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <TrendingUp className="h-5 w-5" />
            </span>
            <p className="mt-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Target Budget Goal</p>
            <p className="mt-1 font-heading text-2xl font-bold text-foreground">₹{budgetGoal.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-xs text-muted-foreground">Configured limit</p>
          </div>
        </div>

        {/* Meaningful Weekly Spending Trends Graph & Breakdown */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-lg md:p-8 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-border/60 pb-4">
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground">Weekly Spending Trends & Analysis</h3>
              <p className="text-xs text-muted-foreground">Understand your spending habits over time and pinpoint peak expense days.</p>
            </div>

            {highestDay.amount > 0 && (
              <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Info className="h-4 w-4" />
                <span>Peak Expense Day: {highestDay.full} (₹{highestDay.amount.toLocaleString("en-IN")})</span>
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-5 items-end">
            
            {/* Graph Columns with Tooltips & Real Rupee Values */}
            <div className="rounded-2xl border border-border bg-background p-5 lg:col-span-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Daily Amount (₹)</span>
                <span>Max: ₹{maxDaily.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex h-52 items-end justify-between gap-2 sm:gap-3 pt-6">
                {weeklyData.map((d) => {
                  const heightPct = Math.max(8, Math.round((d.amount / maxDaily) * 100))
                  const isSelected = hoveredDay?.day === d.day
                  return (
                    <div
                      key={d.day}
                      onMouseEnter={() => setHoveredDay(d)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className="relative flex flex-1 flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                    >
                      {/* Tooltip on Hover */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute -top-10 z-20 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-[11px] font-bold text-background shadow-md"
                          >
                            ₹{d.amount.toLocaleString("en-IN")}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="w-full flex-1 flex items-end">
                        <div
                          style={{ height: `${heightPct}%` }}
                          className={`w-full rounded-t-lg transition-all duration-300 ${
                            d.day === highestDay.day
                              ? "bg-gradient-to-t from-primary/80 to-primary shadow-md shadow-primary/30"
                              : "bg-gradient-to-t from-emerald/60 to-emerald"
                          }`}
                        />
                      </div>

                      <div className="text-center">
                        <span className="block text-xs font-bold text-foreground">{d.day}</span>
                        <span className="block text-[10px] text-muted-foreground font-medium">₹{d.amount}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="rounded-2xl border border-border bg-background p-5 lg:col-span-2 space-y-4">
              <h4 className="font-heading text-sm font-bold text-foreground">Expense Categories</h4>
              <div className="space-y-3">
                {Object.entries(catBreakdown).map(([catName, amt]) => {
                  const pct = Math.round((amt / (totalSpent || 1)) * 100)
                  return (
                    <div key={catName}>
                      <div className="mb-1 flex items-center justify-between text-xs font-semibold">
                        <span className="text-foreground">{catName}</span>
                        <span className="text-muted-foreground">₹{amt.toLocaleString("en-IN")} ({pct}%)</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div style={{ width: `${pct}%` }} className="h-full rounded-full bg-emerald" />
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground leading-relaxed">
                💡 <span className="font-semibold text-foreground">Spending Insight:</span> Tracking daily category expenses helps prevent overspending on activities and dining early in your trip.
              </div>
            </div>

          </div>
        </div>

        {/* Interactive Workspace Logging Form & Logs List (Only in Workspace mode) */}
        {isWorkspace && (
          <div className="grid gap-8 lg:grid-cols-12">
            
            {/* Form to Add Expense */}
            <div className="lg:col-span-5">
              <form onSubmit={handleAddExpense} className="rounded-3xl border border-border bg-card p-6 shadow-md space-y-4">
                <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                  <Plus className="h-4 w-4 text-primary" />
                  Log New Expense
                </h3>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Title / Item</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dinner at Shack"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Transport">Transport</option>
                    <option value="Activities">Activities</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Misc">Misc</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1200"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl bg-primary py-2.5 font-semibold text-primary-foreground shadow-md hover:bg-primary/90"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add Expense Entry
                </Button>
              </form>
            </div>

            {/* Log History */}
            <div className="lg:col-span-7 space-y-3">
              <h3 className="font-heading text-lg font-bold text-foreground">Expense Log History</h3>
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/40"
                  >
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">{log.title}</h4>
                      <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                        <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold">{log.category}</span>
                        <span>• {log.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-foreground">₹{log.amount.toLocaleString("en-IN")}</span>
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        aria-label="Delete entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  )
}
