"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Utensils, Ticket, Hotel, Car, ShoppingBag } from "lucide-react"

/* ─────────────────────────────────────────────
   EXPENSE TRACKER ENTRANCE ANIMATION
   Concept: A travel ledger sheet that builds row-by-row,
   with a purple scanner sweep, then a total tallies up.
   Total runtime: 2000ms
   ───────────────────────────────────────────── */
const ENTRIES = [
  { icon: Utensils,    label: "Food & Dining",   amount: "₹850",   color: "#f97316" },
  { icon: Ticket,      label: "Entry Tickets",    amount: "₹400",   color: "#8b5cf6" },
  { icon: Hotel,       label: "Accommodation",    amount: "₹3,500", color: "#06b6d4" },
  { icon: Car,         label: "Transport",        amount: "₹1,200", color: "#10b981" },
  { icon: ShoppingBag, label: "Shopping",         amount: "₹650",   color: "#ec4899" },
]

const STAGGER_MS = 270
const SCAN_DELAY = 80
const DONE_MS    = 2000

export function ExpenseEntranceLoader({ onComplete }) {
  const [visibleRows, setVisibleRows] = useState(0)
  const [scanDone, setScanDone]       = useState(false)

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const t = setTimeout(() => onComplete?.(), 600)
      return () => clearTimeout(t)
    }

    const timers = ENTRIES.map((_, i) =>
      setTimeout(() => setVisibleRows(i + 1), SCAN_DELAY + i * STAGGER_MS)
    )

    const tScan = setTimeout(
      () => setScanDone(true),
      SCAN_DELAY + ENTRIES.length * STAGGER_MS + 120
    )

    const tDone = setTimeout(() => onComplete?.(), DONE_MS)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(tScan)
      clearTimeout(tDone)
    }
  }, [onComplete])

  const total = ENTRIES.reduce(
    (sum, e) => sum + parseInt(e.amount.replace(/[^0-9]/g, ""), 10),
    0
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/88 backdrop-blur-xl select-none"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-72 w-72 rounded-full bg-[#8E5AB5]/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm mx-4 z-10"
      >
        {/* Ledger card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl shadow-2xl overflow-hidden">

          {/* Header strip */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.04]">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              Trip Ledger
            </span>
            <span className="text-[10px] font-mono font-bold text-[#8E5AB5]">
              {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </div>

          {/* Rows */}
          <div className="px-5 py-4 relative">
            {/* Scanning line — sweeps downward as rows appear */}
            <AnimatePresence>
              {visibleRows > 0 && !scanDone && (
                <motion.div
                  key="scan"
                  initial={{ top: "0%" }}
                  animate={{ top: `${(visibleRows / ENTRIES.length) * 100}%` }}
                  transition={{ type: "tween", ease: "linear", duration: STAGGER_MS / 1000 }}
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8E5AB5] to-transparent pointer-events-none z-10"
                />
              )}
            </AnimatePresence>

            <div className="space-y-0">
              {ENTRIES.map((entry, i) => {
                const Icon = entry.icon
                const isVisible = i < visibleRows
                return (
                  <motion.div
                    key={entry.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${entry.color}22`, border: `1px solid ${entry.color}44` }}
                      >
                        <Icon className="h-3.5 w-3.5" style={{ color: entry.color }} />
                      </div>
                      <span className="text-xs font-medium text-white/80">{entry.label}</span>
                    </div>
                    <span className="text-xs font-bold font-mono text-white">{entry.amount}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Total row — appears after all entries */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: visibleRows >= ENTRIES.length ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between px-5 py-3.5 border-t border-white/10 bg-white/[0.04]"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-white/40">Total</span>
            <span className="font-mono font-extrabold text-sm text-[#8E5AB5]">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </motion.div>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{
            opacity: visibleRows >= ENTRIES.length ? 1 : 0,
            y: visibleRows >= ENTRIES.length ? 0 : 6,
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 text-center text-sm font-medium text-white/50 tracking-wide"
        >
          Know where every rupee goes.
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
