"use client"

import { Calendar, Users, Wallet, ChevronLeft, ChevronRight, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef } from "react"

export function TripPlanCard({ trip, isActive, onOpenTrip }) {
  const statusColors = {
    Upcoming: "bg-primary/10 text-[#6B4423] border-primary/20",
    Completed: "bg-emerald/10 text-emerald-600 dark:text-emerald-400 border-emerald/20",
    Draft: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
  }

  return (
    <div
      className={`shrink-0 w-[260px] sm:w-[290px] snap-center rounded-3xl border bg-card p-4 shadow-md transition-all ${
        isActive ? "border-primary ring-2 ring-primary/20 shadow-lg" : "border-border hover:border-primary/40"
      }`}
    >
      {/* Image & Status Badge */}
      <div className="relative h-32 w-full overflow-hidden rounded-2xl mb-3">
        <img src={trip.image} alt={trip.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <span
          className={`absolute top-2.5 right-2.5 rounded-full border px-2 py-0.5 text-[10px] font-bold backdrop-blur-md ${
            statusColors[trip.status] || "bg-muted text-muted-foreground"
          }`}
        >
          {trip.status}
        </span>
        <div className="absolute bottom-2.5 left-2.5 text-white">
          <span className="block font-heading text-base font-bold leading-tight drop-shadow">{trip.title}</span>
          <span className="block text-[11px] opacity-90">{trip.location}</span>
        </div>
      </div>

      {/* Details List */}
      <div className="space-y-1.5 text-xs mb-4">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="flex items-center gap-1 text-[11px]">
            <Calendar className="h-3 w-3 text-[#6B4423]" />
            Dates
          </span>
          <span className="font-semibold text-foreground truncate max-w-[140px] text-right">{trip.dates}</span>
        </div>

        <div className="flex items-center justify-between text-muted-foreground">
          <span className="flex items-center gap-1 text-[11px]">
            <Users className="h-3 w-3 text-emerald" />
            Travelers & Duration
          </span>
          <span className="font-semibold text-foreground">{trip.travelers} Ppl • {trip.totalDays} Days</span>
        </div>

        <div className="flex items-center justify-between text-muted-foreground">
          <span className="flex items-center gap-1 text-[11px]">
            <Wallet className="h-3 w-3 text-amber-500" />
            Budget
          </span>
          <span className="font-bold text-[#6B4423]">{trip.budget}</span>
        </div>
      </div>

      {/* Open Trip Button */}
      <Button
        onClick={() => onOpenTrip(trip)}
        variant={isActive ? "default" : "outline"}
        size="sm"
        className={`w-full rounded-xl text-xs font-semibold ${
          isActive ? "bg-primary text-primary-foreground" : "border-border hover:bg-accent"
        }`}
      >
        <Compass className="mr-1.5 h-3.5 w-3.5" />
        {isActive ? "Active Trip" : "Open Trip"}
      </Button>
    </div>
  )
}

export function TripPlansCarousel({ trips, activeTripId, onSelectTrip }) {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -300 : 300
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-bold text-foreground">My Trip Plans</h3>
          <p className="text-xs text-muted-foreground">Select any trip to view its detailed day-wise itinerary.</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll("left")}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 pt-1 snap-x snap-mandatory scrollbar-none"
      >
        {trips.map((t) => (
          <TripPlanCard
            key={t.id}
            trip={t}
            isActive={t.id === activeTripId}
            onOpenTrip={onSelectTrip}
          />
        ))}
      </div>
    </div>
  )
}
