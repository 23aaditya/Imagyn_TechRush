"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sun,
  Coins,
  Navigation,
  Coffee,
  Camera,
  Moon,
  BookOpen
} from "lucide-react"

export function ItineraryCard({ day, isCenter, onSelect }) {
  return (
    <motion.div
      onClick={onSelect}
      initial={{ scale: 0.95, opacity: 0.75 }}
      animate={{
        scale: isCenter ? 1 : 0.95,
        opacity: isCenter ? 1 : 0.75,
        y: isCenter ? 0 : 6
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`shrink-0 w-[300px] sm:w-[360px] md:w-[400px] snap-center rounded-3xl border bg-card p-5 shadow-xl transition-all flex flex-col justify-between select-none cursor-pointer relative overflow-hidden ${
        isCenter
          ? "border-primary ring-2 ring-primary/20 shadow-2xl shadow-primary/10"
          : "border-border/80 hover:border-primary/40"
      }`}
    >
      <div>
        {/* Destination Image Banner with Day Stamp */}
        <div className="relative h-36 sm:h-40 w-full overflow-hidden rounded-2xl mb-4">
          <img
            src={day.image || "/images/dest-manali.png"}
            alt={day.title}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Day & Theme Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="flex h-8 w-14 items-center justify-center rounded-xl bg-primary text-xs font-heading font-extrabold text-primary-foreground shadow-lg">
              DAY 0{day.dayNum}
            </span>
            <span className="rounded-full bg-black/60 border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
              {day.theme || "Exploration"}
            </span>
          </div>

          {/* Location & Title */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <span className="flex items-center gap-1 text-[11px] font-medium opacity-90">
              <MapPin className="h-3 w-3 text-primary shrink-0" />
              {day.location}
            </span>
            <h4 className="font-heading text-lg font-bold leading-tight drop-shadow truncate">{day.title}</h4>
          </div>
        </div>

        {/* Morning, Afternoon, Evening Timeline Breakdown */}
        <div className="space-y-2.5 my-1">
          {/* Morning */}
          <div className="rounded-2xl border border-border/50 bg-background/60 p-2.5 transition-colors hover:bg-background">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-0.5">
              <span className="flex items-center gap-1">
                <Coffee className="h-3 w-3" />
                Morning Plan
              </span>
            </div>
            <p className="text-xs font-semibold text-foreground leading-snug">{day.morning}</p>
          </div>

          {/* Afternoon */}
          <div className="rounded-2xl border border-border/50 bg-background/60 p-2.5 transition-colors hover:bg-background">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">
              <span className="flex items-center gap-1">
                <Camera className="h-3 w-3" />
                Afternoon Plan
              </span>
            </div>
            <p className="text-xs font-semibold text-foreground leading-snug">{day.afternoon}</p>
          </div>

          {/* Evening */}
          <div className="rounded-2xl border border-border/50 bg-background/60 p-2.5 transition-colors hover:bg-background">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-purple-500 mb-0.5">
              <span className="flex items-center gap-1">
                <Moon className="h-3 w-3" />
                Evening Plan
              </span>
            </div>
            <p className="text-xs font-semibold text-foreground leading-snug">{day.evening}</p>
          </div>
        </div>
      </div>

      {/* Footer Metrics Strip */}
      <div className="mt-4 pt-3 border-t border-border/50 grid grid-cols-3 gap-2 text-[11px] text-center">
        <div className="rounded-xl bg-background/80 p-2 border border-border/40">
          <span className="flex items-center justify-center gap-1 text-[9px] font-semibold text-muted-foreground uppercase">
            <Coins className="h-3 w-3 text-emerald" />
            Expense
          </span>
          <span className="font-bold text-foreground block truncate">{day.budget}</span>
        </div>

        <div className="rounded-xl bg-background/80 p-2 border border-border/40">
          <span className="flex items-center justify-center gap-1 text-[9px] font-semibold text-muted-foreground uppercase">
            <Sun className="h-3 w-3 text-amber-500" />
            Weather
          </span>
          <span className="font-semibold text-foreground block truncate">{day.weather}</span>
        </div>

        <div className="rounded-xl bg-background/80 p-2 border border-border/40">
          <span className="flex items-center justify-center gap-1 text-[9px] font-semibold text-muted-foreground uppercase">
            <Navigation className="h-3 w-3 text-primary" />
            Distance
          </span>
          <span className="font-semibold text-foreground block truncate">{day.distance}</span>
        </div>
      </div>
    </motion.div>
  )
}

export function ItineraryCarousel({ activeTrip }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const scrollRef = useRef(null)

  if (!activeTrip || !activeTrip.daysData) return null

  const days = activeTrip.daysData.map((d, i) => ({
    ...d,
    theme: d.theme || ["Arrival", "Adventure", "Exploration", "Relaxation", "Culture"][i % 5],
    image: d.image || activeTrip.image || "/images/dest-manali.png"
  }))

  const scrollToDay = (index) => {
    setSelectedIndex(index)
    if (scrollRef.current) {
      const amount = index * 370
      scrollRef.current.scrollTo({ left: amount, behavior: "smooth" })
    }
  }

  const handlePrev = () => {
    const next = Math.max(0, selectedIndex - 1)
    scrollToDay(next)
  }

  const handleNext = () => {
    const next = Math.min(days.length - 1, selectedIndex + 1)
    scrollToDay(next)
  }

  return (
    <div className="space-y-4">
      {/* Title & Navigation Tabs Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Day-Wise Travel Itinerary Journal
          </h3>
          <p className="text-xs text-muted-foreground">Scrolling through daily activities for {activeTrip.title}.</p>
        </div>

        {/* Day Pills Navigation (Day 1 → Day 2 → Day 3) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {days.map((d, idx) => (
            <button
              key={d.dayNum}
              onClick={() => scrollToDay(idx)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                selectedIndex === idx
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "bg-background/80 border border-border/60 text-muted-foreground hover:bg-accent"
              }`}
            >
              Day {d.dayNum}
            </button>
          ))}
        </div>
      </div>

      {/* Carousel Container with Controls */}
      <div className="relative">
        
        {/* Left Chevron Button */}
        <button
          onClick={handlePrev}
          disabled={selectedIndex === 0}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-xl backdrop-blur-md disabled:opacity-30 hover:bg-primary hover:text-white transition-all"
          aria-label="Previous day itinerary card"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Right Chevron Button */}
        <button
          onClick={handleNext}
          disabled={selectedIndex === days.length - 1}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-xl backdrop-blur-md disabled:opacity-30 hover:bg-primary hover:text-white transition-all"
          aria-label="Next day itinerary card"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Scrollable Itinerary Journal Cards */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto py-2 px-1 snap-x snap-mandatory scrollbar-none"
        >
          {days.map((d, idx) => (
            <ItineraryCard
              key={d.dayNum}
              day={d}
              isCenter={selectedIndex === idx}
              onSelect={() => scrollToDay(idx)}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
