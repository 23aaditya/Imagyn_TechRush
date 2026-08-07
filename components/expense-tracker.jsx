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
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTrip } from "@/context/trip-context"

export function ExpenseTracker({ isWorkspace = false, onBack, onOpenWorkspace }) {
  const {
    totalBudget,
    totalSpent,
    remainingBudget,
    budgetDifference,
    plannedExpenses,
    actualExpenses,
    addActualExpense,
    toggleExpensePaid,
    deleteActualExpense
  } = useTrip()

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Food & Dining")
  const [amount, setAmount] = useState("")
  const [activeTab, setActiveTab] = useState("actual") // 'actual' | 'planned'

  const handleAddExpenseSubmit = (e) => {
    e.preventDefault()
    if (!title || !amount) return
    addActualExpense({
      title,
      category,
      amount: Number(amount),
      isPaid: true
    })
    setTitle("")
    setAmount("")
  }

  const pctSpent = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0

  // Category breakdown from actual expenses
  const catBreakdown = actualExpenses.reduce((acc, l) => {
    acc[l.category] = (acc[l.category] || 0) + l.amount
    return acc
  }, {})

  return (
    <section id="tracker" className={`relative w-full ${isWorkspace ? "min-h-screen bg-[#F4F6F6] text-[#2F3E4E] pt-24 pb-20" : "py-20 md:py-28 bg-background"}`}>
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
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                ⚡ Live Synced with AI Itinerary & Budget Planner
              </span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-foreground">
            {isWorkspace ? "Live Expense & Budget Tracker" : "Track Every Expense In Real Time"}
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground leading-relaxed">
            Auto-imports planned expenses from your AI Itinerary and recalculates remaining budget instantly.
          </p>
        </div>

        {/* 4 Summary Cards */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Planned Budget</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Wallet className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 font-heading text-3xl font-bold text-foreground">₹{totalBudget.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-xs text-muted-foreground">Derived from Budget Planner</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actual Spent</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald/10 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 font-heading text-3xl font-bold text-foreground">₹{totalSpent.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{pctSpent}% of total budget used</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Remaining Budget</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <PiggyBank className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 font-heading text-3xl font-bold text-emerald-600 dark:text-emerald-400">₹{remainingBudget.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-xs text-muted-foreground">Safe spending margin</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Budget Variance</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                <Receipt className="h-5 w-5" />
              </span>
            </div>
            <p className={`mt-3 font-heading text-3xl font-bold ${budgetDifference >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
              {budgetDifference >= 0 ? `+₹${budgetDifference.toLocaleString("en-IN")}` : `-₹${Math.abs(budgetDifference).toLocaleString("en-IN")}`}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{budgetDifference >= 0 ? "Under budget goal" : "Exceeded budget!"}</p>
          </div>
        </div>

        {/* Progress Bar & Category Analytics */}
        <div className="mb-12 rounded-3xl border border-border bg-card p-6 shadow-md md:p-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-foreground">Overall Budget Allocation Usage</span>
            <span className="text-xs font-semibold text-primary">{pctSpent}% Used</span>
          </div>

          <div className="h-3.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-emerald transition-all duration-600 rounded-full"
              style={{ width: `${pctSpent}%` }}
            />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {Object.entries(catBreakdown).map(([cat, amt]) => {
              const catBudgetPct = totalSpent > 0 ? Math.round((amt / totalSpent) * 100) : 0
              return (
                <div key={cat} className="rounded-2xl border border-border/60 bg-background p-3.5">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-foreground">{cat}</span>
                    <span className="font-bold text-primary">₹{amt.toLocaleString("en-IN")} ({catBudgetPct}%)</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mt-1">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${catBudgetPct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Workspace Logging Form & Synchronized Expense Logs */}
        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* Form to Log New Actual Expense */}
          <div className="lg:col-span-5">
            <form onSubmit={handleAddExpenseSubmit} className="rounded-3xl border border-border bg-card p-6 shadow-md space-y-4">
              <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Log Actual Expense
              </h3>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Title / Expense Item</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beach Shack Dinner"
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
                  <option value="Emergency Reserve">Emergency Reserve</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Amount Spent (₹)</label>
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

          {/* Logs & Planned Expenses Switcher */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("actual")}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                    activeTab === "actual"
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  Actual Expenses ({actualExpenses.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("planned")}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                    activeTab === "planned"
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  Planned from AI Itinerary ({plannedExpenses.length})
                </button>
              </div>
            </div>

            {activeTab === "actual" ? (
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {actualExpenses.length > 0 ? (
                  actualExpenses.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/40"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleExpensePaid(log.id)}
                          title="Toggle Paid Status"
                          className="text-emerald-600 dark:text-emerald-400 hover:scale-110 transition-transform"
                        >
                          <CheckCircle2 className={`h-5 w-5 ${log.isPaid ? "fill-emerald-500/20 text-emerald-600" : "opacity-30"}`} />
                        </button>
                        <div>
                          <h4 className="font-semibold text-sm text-foreground">{log.title}</h4>
                          <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                            <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold">{log.category}</span>
                            <span>• {log.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm text-foreground">₹{log.amount.toLocaleString("en-IN")}</span>
                        <button
                          type="button"
                          onClick={() => deleteActualExpense(log.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          aria-label="Delete entry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-xs rounded-2xl border border-dashed border-border">
                    No actual expenses logged yet. Add your first expense using the form.
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {plannedExpenses.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-primary shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
                        <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                          <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{item.category}</span>
                          <span>• {item.day}</span>
                        </div>
                      </div>
                    </div>

                    <span className="font-bold text-sm text-primary">₹{item.amount.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  )
}
