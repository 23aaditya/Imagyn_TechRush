"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Calendar, Compass, ChevronLeft, ChevronRight, Stamp, MapPin } from "lucide-react"

export function TravelStampCard({ trip, isActive, onSelect }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(trip)}
      className={`shrink-0 w-[260px] sm:w-[290px] snap-center rounded-3xl border bg-[#2A4B5F] text-[#FFFFFF] p-4 shadow-lg transition-all cursor-pointer relative overflow-hidden select-none ${
        isActive ? "border-primary ring-2 ring-primary/20 shadow-xl" : "border-border hover:border-primary/50"
      }`}
    >
      {/* Passport Visa Stamp Edge Frame Effect */}
      <div className="absolute top-3 right-3 z-10 rounded-lg border-2 border-emerald-500/40 bg-emerald/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-emerald-400 rotate-6 shadow-sm">
        STAMPED 2026
      </div>

      {/* Hero Image */}
      <div className="relative h-36 w-full overflow-hidden rounded-2xl mb-3">
        <img
          src={trip.image}
          alt={trip.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute bottom-2.5 left-2.5 text-white">
          <span className="flex items-center gap-1 text-[10px] font-medium opacity-90">
            <MapPin className="h-3 w-3 text-[#FFFFFF]" />
            {trip.location}
          </span>
          <h4 className="font-heading text-lg font-bold leading-tight drop-shadow">{trip.title}</h4>
        </div>
      </div>

      {/* Journal Entry Content */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between text-[#FFFFFF]/75 border-b border-[#FFFFFF]/20 pb-2">
          <span className="flex items-center gap-1 text-[11px]">
            <Calendar className="h-3.5 w-3.5 text-[#FFFFFF]" />
            {trip.dates}
          </span>
          <span className="rounded-full bg-[#FFFFFF]/20 px-2 py-0.5 text-[10px] font-semibold text-[#FFFFFF]">
            {trip.totalDays} Days
          </span>
        </div>

        <p className="text-[11px] text-[#FFFFFF]/90 line-clamp-2 leading-relaxed italic">
          &quot;{trip.summary || "Explored scenic mountain roads, local artisan markets, and riverside trails."}&quot;
        </p>

        <div className="pt-2 flex items-center justify-between">
          <span className="font-bold text-[#FFFFFF] text-xs">{trip.budget}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFFFFF]/80 transition-colors">
            {isActive ? "Viewing Journey →" : "Open Stamp →"}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export function TravelCollection({ trips, activeTripId, onSelectTrip }) {
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
          <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
            <Stamp className="h-5 w-5 text-[#6B4423]" />
            Travel Collection & Journal Stamps
          </h3>
          <p className="text-xs text-muted-foreground">Select any passport trip stamp to flip through its travel diary.</p>
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
        className="flex gap-4 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory scrollbar-none"
      >
        {trips.map((t) => (
          <TravelStampCard
            key={t.id}
            trip={t}
            isActive={t.id === activeTripId}
            onSelect={onSelectTrip}
          />
        ))}
      </div>
    </div>
  )
}
