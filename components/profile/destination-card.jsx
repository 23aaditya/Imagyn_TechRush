"use client"

import { useRef, useState } from "react"
import { Bookmark, Heart, ChevronLeft, ChevronRight, MapPin } from "lucide-react"

export function DestinationCard({ destination, onToggleSave }) {
  const [saved, setSaved] = useState(true)

  const handleBookmark = () => {
    setSaved(!saved)
    onToggleSave?.(destination.id, !saved)
  }

  return (
    <div className="shrink-0 w-[220px] sm:w-[250px] snap-center rounded-3xl border border-border bg-[#2A4B5F] text-[#FFFFFF] p-3.5 shadow-md transition-all hover:border-primary/40 group">
      <div className="relative h-28 w-full overflow-hidden rounded-2xl mb-2.5">
        <img
          src={destination.image}
          alt={destination.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <button
          onClick={handleBookmark}
          className={`absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 backdrop-blur-md transition-transform active:scale-95 ${
            saved ? "bg-primary text-white" : "bg-black/30 text-white hover:bg-black/50"
          }`}
          aria-label="Save destination"
        >
          <Bookmark className="h-3.5 w-3.5 fill-current" />
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h4 className="font-heading text-sm font-bold text-[#FFFFFF] truncate">{destination.name}</h4>
          <span className="text-[10px] font-semibold text-[#FFFFFF]/75">{destination.country}</span>
        </div>
        <p className="mt-1 text-[11px] text-[#FFFFFF]/85 line-clamp-2 leading-relaxed">
          {destination.description}
        </p>
      </div>
    </div>
  )
}

export function SavedDestinationsCarousel({ destinations = [] }) {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -250 : 250
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-sm font-bold text-foreground flex items-center gap-1.5">
            <Bookmark className="h-4 w-4 text-amber-500" />
            Saved Destinations
          </h3>
          <p className="text-[11px] text-muted-foreground">Bookmarked places for your future itineraries.</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll("left")}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 pt-0.5 snap-x snap-mandatory scrollbar-none"
      >
        {destinations.map((d) => (
          <DestinationCard key={d.id} destination={d} />
        ))}
      </div>
    </div>
  )
}
