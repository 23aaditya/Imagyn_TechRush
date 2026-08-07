"use client"

import { motion } from "framer-motion"
import { Plane, Calendar, Sun, Wallet, Users, ArrowRight, MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"

export function JourneyTimeline({ activeTrip, onViewItinerary }) {
  const routeNodes = [
    { city: "Pune", code: "PNQ", label: "Origin Port" },
    { city: "Delhi", code: "DEL", label: "Layover Transit" },
    { city: "Manali", code: "KUU", label: "Final Destination" }
  ]

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xl transition-all">
      {/* Flight Arc Graphic Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-[#6B4423]">
            <Compass className="h-5 w-5" />
          </span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B4423]">Current Active Journey</span>
            <h3 className="font-heading text-xl font-extrabold text-foreground">{activeTrip?.title || "Manali Mountain Adventure"}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Sun className="h-4 w-4" />
          <span>{activeTrip?.weather || "14°C, Crisp Sunny"}</span>
        </div>
      </div>

      {/* Animated Flight Path Travel Route: Pune -> Delhi -> Manali */}
      <div className="relative my-6 rounded-2xl border border-border/60 bg-background/80 p-5 backdrop-blur-md">
        
        {/* Animated Flight Path Line */}
        <div className="relative flex items-center justify-between">
          
          {/* Connector Line */}
          <div className="absolute left-6 right-6 top-5 h-0.5 bg-border z-0">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-teal-500 to-emerald"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Plane Icon Traveling Along Line */}
          <motion.div
            className="absolute top-2 z-10 text-[#6B4423]"
            initial={{ left: "10%" }}
            animate={{ left: "85%" }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-md shadow-primary/40">
              <Plane className="h-3.5 w-3.5 rotate-90" />
            </div>
          </motion.div>

          {/* Route Nodes */}
          {routeNodes.map((node, i) => (
            <div key={node.city} className="relative z-10 flex flex-col items-center text-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-heading text-xs font-extrabold shadow-sm ${
                  i === routeNodes.length - 1
                    ? "bg-emerald text-white ring-4 ring-emerald/20"
                    : i === 0
                    ? "bg-primary text-white"
                    : "bg-card border-2 border-border text-foreground"
                }`}
              >
                {node.code}
              </div>
              <span className="mt-2 font-heading text-sm font-bold text-foreground">{node.city}</span>
              <span className="text-[10px] text-muted-foreground font-medium">{node.label}</span>
            </div>
          ))}

        </div>
      </div>

      {/* Trip Details & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="grid grid-cols-3 gap-3 text-xs flex-1">
          <div className="rounded-xl border border-border/50 bg-background/60 p-2.5">
            <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase">
              <Calendar className="h-3 w-3 text-[#6B4423]" />
              Dates
            </span>
            <span className="mt-0.5 block font-semibold text-foreground truncate">{activeTrip?.dates || "Oct 12 – Oct 16"}</span>
          </div>

          <div className="rounded-xl border border-border/50 bg-background/60 p-2.5">
            <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase">
              <Users className="h-3 w-3 text-emerald" />
              Travelers
            </span>
            <span className="mt-0.5 block font-semibold text-foreground">{activeTrip?.travelers || 2} People</span>
          </div>

          <div className="rounded-xl border border-border/50 bg-background/60 p-2.5">
            <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase">
              <Wallet className="h-3 w-3 text-amber-500" />
              Budget
            </span>
            <span className="mt-0.5 block font-bold text-[#6B4423]">{activeTrip?.budget || "₹25,000"}</span>
          </div>
        </div>

        <Button
          onClick={onViewItinerary}
          className="rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/90 shrink-0"
        >
          View Journey Details
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </div>

    </div>
  )
}
