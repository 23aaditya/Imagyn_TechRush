"use client"

import { motion } from "framer-motion"
import { Wallet, PiggyBank, TrendingUp, CalendarDays, BarChart3 } from "lucide-react"

const stats = [
  { label: "Total Spent", value: "₹31,200", delta: "+₹2,400 this week", icon: Wallet, tone: "primary" },
  { label: "Remaining Budget", value: "₹13,800", delta: "31% left", icon: PiggyBank, tone: "emerald" },
  { label: "Highest Category", value: "Hotels", delta: "₹14,500 spent", icon: TrendingUp, tone: "primary" },
  { label: "Daily Average", value: "₹4,457", delta: "over 7 days", icon: CalendarDays, tone: "emerald" },
]

const weekly = [
  { day: "Mon", value: 62 },
  { day: "Tue", value: 40 },
  { day: "Wed", value: 88 },
  { day: "Thu", value: 55 },
  { day: "Fri", value: 100 },
  { day: "Sat", value: 74 },
  { day: "Sun", value: 48 },
]

const categories = [
  { label: "Accommodation", pct: 46, amount: "₹14,500" },
  { label: "Food & Dining", pct: 24, amount: "₹7,600" },
  { label: "Transport", pct: 18, amount: "₹5,600" },
  { label: "Activities", pct: 12, amount: "₹3,500" },
]

export function ExpenseTracker() {
  return (
    <section id="tracker" className="relative w-full py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <BarChart3 className="h-3.5 w-3.5 text-emerald" aria-hidden />
            Live Expense Tracker
          </span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Track Spending As You Travel
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            A real-time dashboard that keeps your trip on budget with clear analytics and daily insights.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-lg md:p-8">
          {/* Stat cards */}
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

          <div className="mt-6 grid gap-6 lg:grid-cols-5">
            {/* Bar chart */}
            <div className="rounded-2xl border border-border bg-background p-5 lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-sm font-semibold text-foreground">Weekly Spending</h3>
                <span className="text-xs text-muted-foreground">Last 7 days</span>
              </div>
              <div className="flex h-44 items-end justify-between gap-2 sm:gap-4">
                {weekly.map((d, i) => (
                  <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex w-full flex-1 items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${d.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.07, ease: "easeOut" }}
                        className="w-full rounded-t-md bg-gradient-to-t from-primary/70 to-primary"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category progress */}
            <div className="rounded-2xl border border-border bg-background p-5 lg:col-span-2">
              <h3 className="mb-4 font-heading text-sm font-semibold text-foreground">Spending by Category</h3>
              <ul className="space-y-4">
                {categories.map((c, i) => (
                  <li key={c.label}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{c.label}</span>
                      <span className="text-muted-foreground">{c.amount}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${c.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
                        className="h-full rounded-full bg-emerald"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
