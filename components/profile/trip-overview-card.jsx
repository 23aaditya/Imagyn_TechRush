"use client"

import { Calendar, Users, Wallet, Sun, Compass, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TripOverviewCard({ activeTrip, onViewItinerary }) {
  if (!activeTrip) return null

  const pct = Math.round((activeTrip.completedDays / activeTrip.totalDays) * 100)

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xl transition-all">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row gap-5 items-stretch">
        
        {/* Destination Cover Image Card */}
        <div className="relative h-44 md:h-auto md:w-52 shrink-0 overflow-hidden rounded-2xl">
          <img
            src={activeTrip.image || "/images/dest-manali.png"}
            alt={activeTrip.title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <span className="absolute top-3 left-3 rounded-full bg-emerald px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md">
            Active Trip
          </span>
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <span className="block text-xs font-semibold opacity-90">{activeTrip.location}</span>
            <span className="block font-heading text-lg font-bold leading-tight truncate">{activeTrip.title}</span>
          </div>
        </div>

        {/* Content & Details */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          
          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border/60 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B4423]">Current Trip Overview</span>
              <h3 className="font-heading text-xl font-extrabold text-foreground">{activeTrip.title}</h3>
            </div>
            
            {/* Weather Badge */}
            <div className="flex items-center gap-1.5 rounded-xl bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Sun className="h-3.5 w-3.5" />
              <span>{activeTrip.weather || "14°C, Crisp Sunny"}</span>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-border/50 bg-background/60 p-2.5">
              <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase">
                <Calendar className="h-3 w-3 text-[#6B4423]" />
                Travel Dates
              </span>
              <span className="mt-0.5 block font-semibold text-foreground truncate">{activeTrip.dates}</span>
            </div>

            <div className="rounded-xl border border-border/50 bg-background/60 p-2.5">
              <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase">
                <Users className="h-3 w-3 text-emerald" />
                Travelers
              </span>
              <span className="mt-0.5 block font-semibold text-foreground">{activeTrip.travelers} People</span>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-xl border border-border/50 bg-background/60 p-2.5">
              <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase">
                <Wallet className="h-3 w-3 text-amber-500" />
                Estimated Budget
              </span>
              <span className="mt-0.5 block font-bold text-[#6B4423]">{activeTrip.budget}</span>
            </div>
          </div>

          {/* Progress Bar & CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald" />
                  Trip Progress
                </span>
                <span className="text-foreground">{activeTrip.completedDays} of {activeTrip.totalDays} Days ({pct}%)</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div style={{ width: `${pct}%` }} className="h-full rounded-full bg-gradient-to-r from-primary to-emerald transition-all duration-500" />
              </div>
            </div>

            <Button
              onClick={onViewItinerary}
              className="rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/90 shrink-0"
            >
              View Itinerary
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>

        </div>

      </div>
    </div>
  )
}
