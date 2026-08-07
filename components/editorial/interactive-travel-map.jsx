"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Globe, Compass, Sun, ArrowRight, Plane, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const mapPins = [
  { id: "manali", name: "Manali", region: "Himachal, India", lat: "30%", lng: "45%", weather: "14°C Sunny", image: "/images/dest-manali.png", rating: "4.9", highlight: "Solang Valley Snow & Alpine Trails" },
  { id: "goa", name: "Goa", region: "India", lat: "55%", lng: "38%", weather: "28°C Tropical", image: "/images/dest-goa.png", rating: "4.85", highlight: "Vagator Sunset Cliffs & Beach Shacks" },
  { id: "jaipur", name: "Jaipur", region: "Rajasthan, India", lat: "40%", lng: "40%", weather: "24°C Warm", image: "/images/dest-jaipur.png", rating: "4.88", highlight: "Amer Fort & Hawa Mahal Palaces" },
  { id: "santorini", name: "Santorini", region: "Greece", lat: "35%", lng: "25%", weather: "22°C Breezy", image: "/images/dest-santorini.png", rating: "4.98", highlight: "Oia Caldera Walk & Aegean Sunset" },
  { id: "bali", name: "Bali", region: "Indonesia", lat: "65%", lng: "75%", weather: "29°C Warm", image: "/images/dest-bali.png", rating: "4.94", highlight: "Tegalalang Rice Terraces & Uluwatu" },
  { id: "kerala", name: "Kerala", region: "India", lat: "60%", lng: "42%", weather: "26°C Pleasant", image: "/images/dest-kerala.png", rating: "4.91", highlight: "Alleppey Houseboat Backwater Cruise" }
]

export function InteractiveTravelMap({ onNavigateView }) {
  const [selectedPin, setSelectedPin] = useState(mapPins[0])

  return (
    <section className="py-20 bg-[#FAF7F2] border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#6B4423]">
              <Globe className="h-3.5 w-3.5" />
              Interactive Route Map
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-foreground mt-2 tracking-tight">
              Explore Destinations on Map
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-xl">
              Click any destination pin across the global route map to explore live snapshots, weather forecasts, and key attractions.
            </p>
          </div>

          <Button
            onClick={() => onNavigateView("explore")}
            variant="outline"
            className="rounded-full border-foreground/20 bg-[#F4F6F6] text-xs font-bold text-foreground shadow-sm hover:bg-[#F4F6F6] hover:border-foreground/40 self-start md:self-auto"
          >
            Open World Explorer
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Map Container & Pin Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Map Visual (8 cols on lg) */}
          <div className="lg:col-span-8 relative h-[380px] sm:h-[440px] w-full overflow-hidden rounded-3xl border border-border bg-[#0F172A] p-4 shadow-2xl">
            {/* World Map Dark Graphic */}
            <img
              src="/images/world-map-dark.png"
              alt="World Map Graphic"
              className="h-full w-full object-cover opacity-40"
            />

            {/* SVG Flight Path Arcs */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 800 440">
              <motion.path
                d="M 200 150 Q 350 100 600 280"
                stroke="var(--color-primary)"
                strokeWidth="2"
                strokeDasharray="6 6"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </svg>

            {/* Clickable Map Pins */}
            {mapPins.map((pin) => {
              const isSelected = selectedPin.id === pin.id
              return (
                <button
                  key={pin.id}
                  onClick={() => setSelectedPin(pin)}
                  style={{ top: pin.lat, left: pin.lng }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all shadow-xl select-none z-10 ${
                    isSelected
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/30 scale-110 z-20"
                      : "bg-[#F4F6F6]/90 text-foreground hover:bg-[#F4F6F6] hover:scale-105"
                  }`}
                >
                  <MapPin className={`h-3.5 w-3.5 ${isSelected ? "text-white" : "text-[#6B4423]"}`} />
                  <span>{pin.name}</span>
                </button>
              )
            })}
          </div>

          {/* Active Pin City Snapshot Card (4 cols on lg) */}
          <div className="lg:col-span-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPin.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-3xl border border-border bg-[#F4F6F6] p-5 shadow-2xl space-y-4"
              >
                <div className="relative h-44 w-full overflow-hidden rounded-2xl">
                  <img src={selectedPin.image} alt={selectedPin.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-black/60 border border-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                    <Sun className="h-3 w-3 text-amber-400" />
                    {selectedPin.weather}
                  </div>

                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[10px] uppercase font-medium opacity-90">{selectedPin.region}</span>
                    <h3 className="font-heading text-xl font-bold leading-tight drop-shadow">{selectedPin.name}</h3>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Travel Rating</span>
                    <span className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {selectedPin.rating} / 5.0
                    </span>
                  </div>

                  <div className="rounded-xl bg-[#FAF7F2] p-3 border border-border/50">
                    <span className="text-[10px] font-bold uppercase text-[#6B4423] block mb-0.5">Top Attraction</span>
                    <span className="font-semibold text-foreground leading-snug block">{selectedPin.highlight}</span>
                  </div>
                </div>

                <Button
                  onClick={() => onNavigateView("itinerary")}
                  className="w-full rounded-2xl bg-primary py-5 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90"
                >
                  Plan {selectedPin.name} Route
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  )
}
