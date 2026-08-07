"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Compass, Wallet, CheckSquare, X, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function QuickActions({ onNavigateView }) {
  const [checklistOpen, setChecklistOpen] = useState(false)
  const [items, setItems] = useState([
    { id: 1, text: "Passport & Identity Docs", checked: true },
    { id: 2, text: "Camera & Extra Memory Cards", checked: true },
    { id: 3, text: "Thermal Jackets & Gloves for Manali", checked: false },
    { id: 4, text: "Emergency First Aid & Altitude Meds", checked: false },
    { id: 5, text: "Power Bank & Universal Adapters", checked: true }
  ])

  const toggleCheck = (id) => {
    setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
  }

  return (
    <>
      {/* Floating Travel Assistant Panel */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 sm:gap-2 rounded-full border border-border/80 bg-card/90 p-2 shadow-2xl backdrop-blur-2xl"
      >
        <button
          onClick={() => onNavigateView("itinerary")}
          className="flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create New Trip</span>
          <span className="sm:hidden">New Trip</span>
        </button>

        <button
          onClick={() => onNavigateView("itinerary")}
          className="flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-all"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#6B4423]" />
          <span className="hidden sm:inline">Continue Planning</span>
          <span className="sm:hidden">Plan</span>
        </button>

        <button
          onClick={() => onNavigateView("expenses")}
          className="flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-all"
        >
          <Wallet className="h-3.5 w-3.5 text-emerald" />
          <span className="hidden sm:inline">Track Expenses</span>
          <span className="sm:hidden">Expenses</span>
        </button>

        <button
          onClick={() => setChecklistOpen(true)}
          className="flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-all"
        >
          <CheckSquare className="h-3.5 w-3.5 text-amber-500" />
          <span className="hidden sm:inline">Packing List</span>
          <span className="sm:hidden">Checklist</span>
        </button>
      </motion.div>

      {/* Packing Checklist Modal */}
      <AnimatePresence>
        {checklistOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-[#6B4423]" />
                  Trip Packing Checklist
                </h3>
                <button
                  onClick={() => setChecklistOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="flex w-full items-center justify-between rounded-xl border border-border/50 bg-background/60 p-3 text-left transition-all hover:bg-accent"
                  >
                    <span className={`text-xs font-semibold ${item.checked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {item.text}
                    </span>
                    <div className={`flex h-5 w-5 items-center justify-center rounded-lg border ${
                      item.checked ? "bg-emerald text-white border-emerald" : "border-border bg-background"
                    }`}>
                      {item.checked && <Check className="h-3.5 w-3.5" />}
                    </div>
                  </button>
                ))}
              </div>

              <Button
                onClick={() => setChecklistOpen(false)}
                className="w-full rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                Close Checklist
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
