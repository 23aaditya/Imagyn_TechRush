"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Wallet,
  PiggyBank,
  TrendingUp,
  CalendarDays,
  BarChart3,
  ArrowLeft,
  Plus,
  Trash2,
  Receipt,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

const initialLogs = [
  { id: 1, title: "Artjuna Cafe Breakfast", category: "Food & Dining", amount: 450, date: "Today" },
  { id: 2, title: "Fort Aguada Entry Ticket", category: "Activities", amount: 200, date: "Today" },
  { id: 3, title: "Scooter Rental (2 Days)", category: "Transport", amount: 1200, date: "Yesterday" },
  { id: 4, title: "Beachside Shack Hotel Stay", category: "Accommodation", amount: 6500, date: "2 days ago" },
]

export function ExpenseTracker({ isWorkspace = false, onBack, onOpenWorkspace }) {
  const [logs, setLogs] = useState(initialLogs)
  const [budgetGoal, setBudgetGoal] = useState(25000)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Food & Dining")
  const [amount, setAmount] = useState("")

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!title || !amount) return
    const newLog = {
      id: Date.now(),
      title,
      category,
      amount: Number(amount),
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

  // Category totals breakdown
  const catBreakdown = logs.reduce((acc, l) => {
    acc[l.category] = (acc[l.category] || 0) + l.amount
    return acc
  }, {})

  const weekly = [
    { day: "Mon", value: 62 },
    { day: "Tue", value: 40 },
    { day: "Wed", value: 88 },
    { day: "Thu", value: 55 },
    { day: "Fri", value: 100 },
    { day: "Sat", value: 74 },
    { day: "Sun", value: 48 },
  ]

  return (
    <section id="tracker" className={`relative w-full ${isWorkspace ? "min-h-screen bg-background pt-24 pb-20" : "py-20 md:py-28"}`}>
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
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <BarChart3 className="h-3.5 w-3.5 text-emerald" aria-hidden />
            Live Expense Tracker
          </span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {isWorkspace ? "Live Trip Expense Workspace" : "Track Spending As You Travel"}
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground leading-relaxed">
            Log expenses on the go, stay under budget, and analyze spending patterns in real-time.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Wallet className="h-4 w-4" />
            </span>
            <p className="mt-3 text-xs font-medium text-muted-foreground">Total Spent</p>
            <p className="mt-0.5 font-heading text-xl font-bold text-foreground">₹{totalSpent.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{logs.length} logged items</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald/15 text-emerald-600 dark:text-emerald-400">
              <PiggyBank className="h-4 w-4" />
            </span>
            <p className="mt-3 text-xs font-medium text-muted-foreground">Remaining Budget</p>
            <p className="mt-0.5 font-heading text-xl font-bold text-emerald-600 dark:text-emerald-400">₹{remaining.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{pctRemaining}% budget left</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <TrendingUp className="h-4 w-4" />
            </span>
            <p className="mt-3 text-xs font-medium text-muted-foreground">Target Trip Budget</p>
            <p className="mt-0.5 font-heading text-xl font-bold text-foreground">₹{budgetGoal.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-xs text-muted-foreground">Limit configured</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald/15 text-emerald-600 dark:text-emerald-400">
              <CalendarDays className="h-4 w-4" />
            </span>
            <p className="mt-3 text-xs font-medium text-muted-foreground">Avg per Item</p>
            <p className="mt-0.5 font-heading text-xl font-bold text-foreground">
              ₹{logs.length ? Math.round(totalSpent / logs.length).toLocaleString("en-IN") : 0}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Calculated live</p>
          </div>
        </div>

        {/* Interactive Workspace Logging Form & Logs List */}
        {isWorkspace ? (
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
        ) : (
          /* Preview Mode Chart */
          <div className="rounded-3xl border border-border bg-card p-6 shadow-lg md:p-8">
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="rounded-2xl border border-border bg-background p-5 lg:col-span-3">
                <h3 className="font-heading text-sm font-semibold text-foreground mb-4">Weekly Spending Trend</h3>
                <div className="flex h-44 items-end justify-between gap-2 sm:gap-4">
                  {weekly.map((d, i) => (
                    <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex w-full flex-1 items-end">
                        <div
                          style={{ height: `${d.value}%` }}
                          className="w-full rounded-t-md bg-gradient-to-t from-primary/70 to-primary"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-5 lg:col-span-2">
                <h3 className="mb-4 font-heading text-sm font-semibold text-foreground">Spending Breakdown</h3>
                <div className="space-y-4">
                  {Object.entries(catBreakdown).map(([catName, amt]) => {
                    const pct = Math.round((amt / totalSpent) * 100) || 0
                    return (
                      <div key={catName}>
                        <div className="mb-1.5 flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">{catName}</span>
                          <span className="text-muted-foreground">₹{amt.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div style={{ width: `${pct}%` }} className="h-full rounded-full bg-emerald" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {onOpenWorkspace && (
              <div className="mt-8 text-center border-t border-border/60 pt-6">
                <Button
                  onClick={onOpenWorkspace}
                  className="rounded-2xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
                >
                  Launch Full Expense Tracker Workspace
                  <ChevronRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  )
}
