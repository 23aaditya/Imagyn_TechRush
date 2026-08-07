"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, MapPin, Sun, Coins, Navigation, Coffee, Camera, Moon, BookOpen } from "lucide-react"

const daysData = [
  {
    dayNum: 1,
    title: "Arrival & Local Exploration",
    theme: "Arrival",
    location: "Mall Road & Old Manali",
    image: "/images/dest-manali.png",
    morning: "Hotel check-in & Hadimba Temple visit",
    afternoon: "City exploration & cafe hopping",
    evening: "Clubhouse sunset walk & street food",
    budget: "₹3,500",
    weather: "14°C Sunny",
    distance: "12 km • 45m"
  },
  {
    dayNum: 2,
    title: "Solang Valley Snow Sports",
    theme: "Adventure",
    location: "Solang Valley",
    image: "/images/hero-mountains.png",
    morning: "Paragliding & Solang Ropeway",
    afternoon: "ATV Ride & Snow Activity Park",
    evening: "Traditional Himachali Thali Dinner",
    budget: "₹5,200",
    weather: "10°C Clear",
    distance: "18 km • 1h"
  },
  {
    dayNum: 3,
    title: "Rohtang Pass Glacier Drive",
    theme: "Exploration",
    location: "Rohtang Viewpoint",
    image: "/images/dest-manali.png",
    morning: "Scenic High-Mountain Drive",
    afternoon: "Glacier Photography & Snow Walk",
    evening: "Return to Mall Road for Shopping",
    budget: "₹4,800",
    weather: "8°C Cold",
    distance: "51 km • 2h"
  },
  {
    dayNum: 4,
    title: "Naggar Castle Heritage",
    theme: "Relaxation",
    location: "Naggar Village",
    image: "/images/dest-jaipur.png",
    morning: "Naggar Castle Exploration",
    afternoon: "Roerich Art Gallery & Cafe",
    evening: "Fresh Trout Fish Riverside Dinner",
    budget: "₹3,000",
    weather: "15°C Pleasant",
    distance: "21 km • 50m"
  },
  {
    dayNum: 5,
    title: "Jogini Waterfalls & Departure",
    theme: "Culture",
    location: "Vashisht",
    image: "/images/dest-goa.png",
    morning: "Jogini Waterfalls Trek",
    afternoon: "Vashisht Hot Springs & Souvenir Market",
    evening: "Overnight Volvo Bus Departure",
    budget: "₹2,500",
    weather: "16°C Clear",
    distance: "8 km • 30m"
  }
]

export function DaywiseItineraryCarousel({ onNavigateView }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const scrollRef = useRef(null)

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
    const next = Math.min(daysData.length - 1, selectedIndex + 1)
    scrollToDay(next)
  }

  return (
    <section className="py-20 bg-[#FAF7F2] border-t border-border/50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#6B4423]">
              <BookOpen className="h-3.5 w-3.5" />
              Journal-Style Day Pages
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-foreground mt-2 tracking-tight">
              Day-Wise Itinerary Cards
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-xl">
              Immerse yourself in daily schedules, estimated costs, and activity highlights for your destination.
            </p>
          </div>

          {/* Day Number Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {daysData.map((d, idx) => (
              <button
                key={d.dayNum}
                onClick={() => scrollToDay(idx)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  selectedIndex === idx
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : "bg-[#F4F6F6] border border-border/60 text-muted-foreground hover:bg-accent"
                }`}
              >
                Day {d.dayNum}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel View Container */}
        <div className="relative">
          
          <button
            onClick={handlePrev}
            disabled={selectedIndex === 0}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-[#F4F6F6] text-foreground shadow-xl disabled:opacity-30 hover:bg-primary hover:text-white transition-all"
            aria-label="Previous day page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={handleNext}
            disabled={selectedIndex === daysData.length - 1}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-[#F4F6F6] text-foreground shadow-xl disabled:opacity-30 hover:bg-primary hover:text-white transition-all"
            aria-label="Next day page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto py-4 px-1 snap-x snap-mandatory scrollbar-none"
          >
            {daysData.map((day, idx) => {
              const isCenter = selectedIndex === idx
              return (
                <motion.div
                  key={day.dayNum}
                  onClick={() => scrollToDay(idx)}
                  animate={{
                    scale: isCenter ? 1 : 0.95,
                    opacity: isCenter ? 1 : 0.75,
                    y: isCenter ? 0 : 8
                  }}
                  transition={{ duration: 0.4 }}
                  className={`shrink-0 w-[300px] sm:w-[360px] md:w-[390px] snap-center rounded-3xl border bg-[#F4F6F6] p-5 shadow-xl transition-all cursor-pointer relative overflow-hidden ${
                    isCenter ? "border-primary ring-2 ring-primary/20 shadow-2xl" : "border-border/80 hover:border-primary/40"
                  }`}
                >
                  <div className="relative h-40 w-full overflow-hidden rounded-2xl mb-4">
                    <img src={day.image} alt={day.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="flex h-8 w-14 items-center justify-center rounded-xl bg-primary text-xs font-heading font-extrabold text-primary-foreground shadow-lg">
                        DAY 0{day.dayNum}
                      </span>
                      <span className="rounded-full bg-black/60 border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                        {day.theme}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="flex items-center gap-1 text-[11px] font-medium opacity-90">
                        <MapPin className="h-3 w-3 text-[#6B4423] shrink-0" />
                        {day.location}
                      </span>
                      <h4 className="font-heading text-lg font-bold leading-tight drop-shadow truncate">{day.title}</h4>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="rounded-xl bg-[#FAF7F2] p-2.5 border border-border/50">
                      <span className="font-bold text-amber-500 text-[10px] uppercase block mb-0.5">Morning</span>
                      <span className="font-semibold text-foreground">{day.morning}</span>
                    </div>

                    <div className="rounded-xl bg-[#FAF7F2] p-2.5 border border-border/50">
                      <span className="font-bold text-[#6B4423] text-[10px] uppercase block mb-0.5">Afternoon</span>
                      <span className="font-semibold text-foreground">{day.afternoon}</span>
                    </div>

                    <div className="rounded-xl bg-[#FAF7F2] p-2.5 border border-border/50">
                      <span className="font-bold text-emerald-600 text-[10px] uppercase block mb-0.5">Evening</span>
                      <span className="font-semibold text-foreground">{day.evening}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/50 grid grid-cols-3 gap-2 text-[11px] text-center">
                    <div className="rounded-xl bg-[#FAF7F2] p-2 border border-border/40">
                      <span className="text-[9px] uppercase text-muted-foreground block font-bold">Expense</span>
                      <span className="font-bold text-foreground block">{day.budget}</span>
                    </div>

                    <div className="rounded-xl bg-[#FAF7F2] p-2 border border-border/40">
                      <span className="text-[9px] uppercase text-muted-foreground block font-bold">Weather</span>
                      <span className="font-semibold text-foreground block">{day.weather}</span>
                    </div>

                    <div className="rounded-xl bg-[#FAF7F2] p-2 border border-border/40">
                      <span className="text-[9px] uppercase text-muted-foreground block font-bold">Distance</span>
                      <span className="font-semibold text-foreground block">{day.distance}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

        </div>

      </div>
    </section>
  )
}
