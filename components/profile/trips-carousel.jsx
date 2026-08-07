"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Calendar, Compass, ChevronLeft, ChevronRight, MapPin, CheckCircle2 } from "lucide-react"

export function TripsCarousel({ trips, activeTripId, onSelectTrip }) {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -300 : 300
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
    }
  }

  return (
    <div className="space-y-3">
      {/* Title & Nav Buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
            <Compass className="h-5 w-5 text-[#6B4423]" />
            Saved Trips
          </h3>
          <p className="text-xs text-muted-foreground">All your planned trips are saved here. Select any trip to view its day-wise itinerary.</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll("left")}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition-all shadow-sm"
            aria-label="Scroll trips left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition-all shadow-sm"
            aria-label="Scroll trips right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Trips Horizontal Carousel Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory scrollbar-none"
      >
        {trips.map((t) => {
          const isActive = t.id === activeTripId
          return (
            <motion.div
              key={t.id}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              onClick={() => onSelectTrip(t.id)}
              className={`shrink-0 w-[260px] sm:w-[290px] snap-center rounded-3xl border bg-card p-4 shadow-md transition-all cursor-pointer select-none ${
                isActive
                  ? "border-primary ring-2 ring-primary/20 shadow-xl shadow-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {/* Trip Cover Image */}
              <div className="relative h-32 w-full overflow-hidden rounded-2xl mb-3">
                <img
                  src={t.image}
                  alt={t.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {isActive && (
                  <span className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground shadow-md">
                    <CheckCircle2 className="h-3 w-3" />
                    Selected
                  </span>
                )}

                <div className="absolute bottom-2.5 left-2.5 text-white">
                  <span className="flex items-center gap-1 text-[10px] font-medium opacity-90">
                    <MapPin className="h-3 w-3 text-[#6B4423]" />
                    {t.location}
                  </span>
                  <h4 className="font-heading text-base font-bold leading-tight drop-shadow truncate max-w-[240px]">
                    {t.title}
                  </h4>
                </div>
              </div>

              {/* Trip Dates & Duration */}
              <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-2.5">
                <span className="flex items-center gap-1 text-[11px] truncate">
                  <Calendar className="h-3.5 w-3.5 text-[#6B4423] shrink-0" />
                  {t.dates}
                </span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-foreground shrink-0">
                  {t.totalDays} Days
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
