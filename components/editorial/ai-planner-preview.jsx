"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Calendar, Wallet, Compass, CheckCircle2, ArrowRight, Sun, MapPin, Coffee, Camera, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"

const sampleGeneratedItineraries = {
  "Manali, Himachal": [
    { day: 1, title: "Arrival & Mall Road Walk", morning: "Hotel check-in & Hadimba Temple", afternoon: "Old Manali cafe exploration", evening: "Sunset walk at Clubhouse" },
    { day: 2, title: "Solang Valley Snow Adventure", morning: "Paragliding & Solang Ropeway", afternoon: "ATV Quad Bike Snow Ride", evening: "Himachali Thali Dinner" },
    { day: 3, title: "Rohtang Pass & Departure", morning: "High mountain drive to Rohtang", afternoon: "Glacier view walk & photography", evening: "Souvenir shopping & Volvo bus" }
  ],
  "Goa, India": [
    { day: 1, title: "North Goa Beach Hop", morning: "Artjuna Cafe organic breakfast", afternoon: "Fort Aguada Portuguese lighthouse", evening: "Sunset cocktails at Vagator cliff" },
    { day: 2, title: "Water Sports & River Cruise", morning: "Parasailing & Jet skiing cove", afternoon: "Fresh seafood shack lunch", evening: "Mandovi river sunset cruise" },
    { day: 3, title: "Fontainhas Latin Quarter", morning: "Portuguese heritage walk", afternoon: "Sahakari spice farm tour", evening: "Miramar beach evening stroll" }
  ],
  "Jaipur, Rajasthan": [
    { day: 1, title: "Pink City Fort Exploration", morning: "City Palace guided tour", afternoon: "Hawa Mahal & Johari Bazaar", evening: "Chokhi Dhani cultural dinner" },
    { day: 2, title: "Amer Fort & Sunset Heights", morning: "Amer Fort elephant/jeep ride", afternoon: "Jaigarh Fort cannon view", evening: "Nahargarh Fort sunset city view" },
    { day: 3, title: "Royal Gardens & Craft Markets", morning: "Jantar Mantar solar observatory", afternoon: "Local block print textile market", evening: "Departure from Jaipur" }
  ]
}

export function AiPlannerPreview({ onNavigateView }) {
  const [selectedDest, setSelectedDest] = useState("Manali, Himachal")
  const [isGenerating, setIsGenerating] = useState(false)

  const activeItinerary = sampleGeneratedItineraries[selectedDest] || sampleGeneratedItineraries["Manali, Himachal"]

  const handleSelectDest = (dest) => {
    setIsGenerating(true)
    setSelectedDest(dest)
    setTimeout(() => {
      setIsGenerating(false)
    }, 400)
  }

  return (
    <section className="py-20 bg-[#FAF7F2] border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive Input Controls */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#6B4423]">
              <Sparkles className="h-3.5 w-3.5" />
              Smart Travel Intelligence
            </span>

            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Preview AI Trip Generation
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Our AI engine dynamically balances travel routes, budget ranges, weather forecasts, and activity vibes in seconds.
            </p>

            {/* Quick Destination Switcher Pills */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-muted-foreground">Select Destination</label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(sampleGeneratedItineraries).map((d) => (
                  <button
                    key={d}
                    onClick={() => handleSelectDest(d)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                      selectedDest === d
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-[#F4F6F6] border border-border text-foreground hover:bg-accent"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated AI Settings Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
              <div className="rounded-2xl border border-border/60 bg-[#F4F6F6] p-3 text-center">
                <span className="text-[10px] font-semibold text-muted-foreground block uppercase">Duration</span>
                <span className="font-bold text-foreground block mt-0.5">3 Days</span>
              </div>

              <div className="rounded-2xl border border-border/60 bg-[#F4F6F6] p-3 text-center">
                <span className="text-[10px] font-semibold text-muted-foreground block uppercase">Budget Tier</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">Moderate</span>
              </div>

              <div className="rounded-2xl border border-border/60 bg-[#F4F6F6] p-3 text-center">
                <span className="text-[10px] font-semibold text-muted-foreground block uppercase">Vibe</span>
                <span className="font-bold text-[#6B4423] block mt-0.5">Balanced</span>
              </div>
            </div>

            <Button
              onClick={() => onNavigateView("itinerary")}
              className="w-full rounded-2xl bg-primary py-6 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/25 hover:bg-primary/90"
            >
              Generate Full Itinerary Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Right Column: Dynamic Itinerary Preview Card */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-[#F4F6F6] p-6 shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#6B4423]">Live Generated Plan</span>
                    <h3 className="font-heading text-lg font-bold text-foreground">{selectedDest}</h3>
                  </div>
                </div>

                <span className="rounded-full bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Ready in 0.4s
                </span>
              </div>

              {/* Day Cards */}
              <div className="space-y-3">
                {activeItinerary.map((dayItem) => (
                  <motion.div
                    key={dayItem.day}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-2xl border border-border/60 bg-[#FAF7F2]/80 p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-heading font-extrabold text-[#6B4423]">Day 0{dayItem.day}</span>
                      <span className="font-bold text-foreground">{dayItem.title}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                      <span className="truncate flex items-center gap-1">
                        <Coffee className="h-3 w-3 text-amber-500 shrink-0" />
                        {dayItem.morning}
                      </span>
                      <span className="truncate flex items-center gap-1">
                        <Camera className="h-3 w-3 text-[#6B4423] shrink-0" />
                        {dayItem.afternoon}
                      </span>
                      <span className="truncate flex items-center gap-1">
                        <Utensils className="h-3 w-3 text-emerald shrink-0" />
                        {dayItem.evening}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
