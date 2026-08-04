"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Wallet, PiggyBank, TrendingUp, CalendarDays, BarChart3, Plus, Lock } from "lucide-react"
import { useItinerary } from "@/lib/itinerary-context"
import { useAuth } from "@/lib/auth-context"

export function ExpenseTracker() {
  const {
    grandTotalBudget,
    totalSpent,
    remainingBudget,
    userLoggedExpenses,
    addExpense
  } = useItinerary()

  const { requireAuth } = useAuth()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [label, setLabel] = useState("")
  const [category, setCategory] = useState("Food & Dining")
  const [amount, setAmount] = useState("")

  const handleOpenModal = () => {
    requireAuth(
      () => setIsModalOpen(true),
      "Please sign in to log live trip expenses and keep track of your budget ledger"
    )
  }

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!label.trim() || !amount) return
    addExpense({
      label,
      category,
      amount: Number.parseFloat(amount) || 0
    })
    setLabel("")
    setAmount("")
    setIsModalOpen(false)
  }

  const percentLeft = grandTotalBudget > 0 ? Math.round((remainingBudget / grandTotalBudget) * 100) : 0

  const stats = [
    { label: "Total Spent", value: `₹${totalSpent.toLocaleString("en-IN")}`, delta: "Live tracking", icon: Wallet, tone: "primary" },
    { label: "Remaining Budget", value: `₹${remainingBudget.toLocaleString("en-IN")}`, delta: `${percentLeft}% budget remaining`, icon: PiggyBank, tone: "emerald" },
    { label: "Planned Total", value: `₹${grandTotalBudget.toLocaleString("en-IN")}`, delta: "Based on itinerary", icon: TrendingUp, tone: "primary" },
    { label: "Logged Entries", value: `${userLoggedExpenses.length} items`, delta: "In trip ledger", icon: CalendarDays, tone: "emerald" },
  ]

  return (
    <section id="tracker" className="relative w-full py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <BarChart3 className="h-3.5 w-3.5 text-emerald" aria-hidden />
            Smart Expense Tracker
          </span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-foreground">
            Track Spending As You Travel
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            Real-time comparison between your planned itinerary budget and actual trip expenses.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-lg md:p-8">
          {/* Header Action */}
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-foreground">Live Trip Ledger</h3>
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-emerald/90 transition-all"
            >
              <Plus className="h-4 w-4" />
              Log New Expense
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              const isEmerald = stat.tone === "emerald"
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <span
                    className={
                      isEmerald
                        ? "inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald/15 text-emerald"
                        : "inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/12 text-primary"
                    }
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <p className="mt-3 text-xs font-medium text-muted-foreground">{stat.label}</p>
                  <p className="mt-0.5 font-heading text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.delta}</p>
                </motion.div>
              )
            })}
          </div>

          {/* Recent Logged Expenses Table */}
          <div className="mt-8 rounded-2xl border border-border bg-background p-5">
            <h4 className="mb-4 font-heading text-sm font-semibold text-foreground">Recent Expenses Logged</h4>
            <div className="space-y-3">
              {userLoggedExpenses.map((exp) => (
                <div key={exp.id} className="flex items-center justify-between border-b border-border/50 pb-2.5 last:border-b-0 last:pb-0 text-xs sm:text-sm">
                  <div>
                    <span className="font-semibold text-foreground">{exp.label}</span>
                    <span className="ml-2 text-xs text-muted-foreground">({exp.category})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-bold text-foreground">₹{exp.amount.toLocaleString("en-IN")}</span>
                    <span className="block text-[10px] text-muted-foreground">{exp.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Log Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <h3 className="font-heading text-lg font-bold text-foreground">Log Travel Expense</h3>
            <p className="text-xs text-muted-foreground mt-1">Record a real spending entry to update your remaining budget.</p>

            <form onSubmit={handleAddExpense} className="mt-4 space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-muted-foreground">Expense Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Taxi fare to Fort"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block font-medium text-muted-foreground">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="Accommodation">Accommodation</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Transport">Transport</option>
                  <option value="Attractions & Entry">Attractions & Entry</option>
                  <option value="Shopping & Misc">Shopping & Misc</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-muted-foreground">Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 850"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald px-4 py-2 text-xs font-semibold text-white hover:bg-emerald/90"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
