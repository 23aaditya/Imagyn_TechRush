"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Utensils, Ticket, Hotel, Car, CheckCircle2 } from "lucide-react"

/* ─────────────────────────────────────────────
   EXPENSE TRACKER ENTRANCE ANIMATION (PURE MONOCHROME WHITE & BLACK)
   Concept: Different types of travel bills (Food, Ticket, Hotel, Taxi)
   floating in, getting logged, and exiting smoothly.
   ───────────────────────────────────────────── */
export function ExpenseEntranceLoader({ onComplete }) {
  const [activeBillIdx, setActiveBillIdx] = useState(0)
  const [showText, setShowText] = useState(false)

  const bills = [
    { id: 1, type: "Food & Dining", title: "Cafe & Breakfast Bill", amount: "₹850", icon: Utensils, tag: "Food Bill" },
    { id: 2, type: "Tickets & Entry", title: "Fort Entrance & Tour Pass", amount: "₹400", icon: Ticket, tag: "Ticket Pass" },
    { id: 3, type: "Accommodation", title: "Resort & Stay Invoice", amount: "₹3,500", icon: Hotel, tag: "Hotel Stay" },
    { id: 4, type: "Transport & Fuel", title: "Taxi & Cab Fare", amount: "₹1,200", icon: Car, tag: "Taxi Fare" }
  ]

  useEffect(() => {
    // Reduced motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      const tReduced = setTimeout(() => {
        if (onComplete) onComplete()
      }, 700)
      return () => clearTimeout(tReduced)
    }

    const t1 = setTimeout(() => setActiveBillIdx(1), 400)
    const t2 = setTimeout(() => setActiveBillIdx(2), 800)
    const t3 = setTimeout(() => setActiveBillIdx(3), 1200)
    const tText = setTimeout(() => setShowText(true), 1100)

    const tEnd = setTimeout(() => {
      if (onComplete) onComplete()
    }, 1950)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(tText)
      clearTimeout(tEnd)
    }
  }, [onComplete])

  const currentBill = bills[activeBillIdx] || bills[0]
  const IconComp = currentBill.icon

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl overflow-hidden select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
        className="w-full max-w-md text-center flex flex-col items-center justify-center space-y-7 relative z-10 text-white font-button"
      >
        {/* Ambient Soft White Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        {/* Floating Bills Container (Bills Come & Go Sequentially) */}
        <div className="relative w-72 h-44 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBill.id}
              initial={{ opacity: 0, y: 25, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: -25, scale: 0.9, rotate: 2 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="w-64 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-2xl text-left relative overflow-hidden"
            >
              {/* Top Bill Badge Header */}
              <div className="flex items-center justify-between border-b border-white/15 pb-2 mb-3">
                <span className="text-[10px] font-normal uppercase tracking-widest text-white/80">
                  {currentBill.tag}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-white/80 font-normal">
                  <CheckCircle2 className="h-3 w-3 text-white" /> Logged
                </span>
              </div>

              {/* Bill Details */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 border border-white/25 text-white">
                    <IconComp className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-normal text-white">{currentBill.title}</h4>
                    <span className="text-[10px] font-normal text-white/70">{currentBill.type}</span>
                  </div>
                </div>
                <span className="text-sm font-normal text-white">{currentBill.amount}</span>
              </div>

              {/* Bottom Subtle Dotted Receipt Line */}
              <div className="mt-3 pt-2 border-t border-dashed border-white/15 flex items-center justify-between text-[9px] text-white/60">
                <span>Verified Entry</span>
                <span>TripNest Sync</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Text Reveal ("Know where every rupee goes.") */}
        <div className="min-h-[28px] flex items-center justify-center">
          <AnimatePresence>
            {showText && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="font-button text-sm sm:text-base font-medium tracking-wide text-white drop-shadow-sm"
              >
                Know where every rupee goes.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
