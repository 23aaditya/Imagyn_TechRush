"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mountain, Waves, Landmark, HeartHandshake, UtensilsCrossed, Compass, Star, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const moods = [
  { id: "alpine", name: "Alpine Treks", icon: Mountain, desc: "High mountain peaks, pine valleys & glacier drives" },
  { id: "coastal", name: "Coastal Coves", icon: Waves, desc: "Palm-lined beaches, cliffside sunsets & turquoise waters" },
  { id: "heritage", name: "Cultural Forts", icon: Landmark, desc: "Royal sandstone palaces, living forts & ancient ruins" },
  { id: "wellness", name: "Wellness Retreats", icon: HeartHandshake, desc: "Ayurvedic retreats, tea garden hills & serene lakes" },
  { id: "culinary", name: "Culinary Expeditions", icon: UtensilsCrossed, desc: "Local food trails, seafood shacks & organic farm thalis" }
]

const moodDestinations = {
  alpine: [
    { title: "Manali Alpine Sanctuary", location: "Himachal, India", rating: "4.9", price: "₹18,500", image: "/images/dest-manali.png", tag: "High Altitude" },
    { title: "Swiss Alps & Paro Valley", location: "Switzerland & Bhutan", rating: "4.95", price: "₹65,000", image: "/images/hero-mountains.png", tag: "Snow & Glaciers" }
  ],
  coastal: [
    { title: "Goa Beach & Cliff Coves", location: "Goa, India", rating: "4.85", price: "₹22,000", image: "/images/dest-goa.png", tag: "Beach Sunset" },
    { title: "Santorini Caldera Walk", location: "Santorini, Greece", rating: "4.98", price: "₹85,000", image: "/images/dest-santorini.png", tag: "Aegean Sea" }
  ],
  heritage: [
    { title: "Jaipur Royal Pink City", location: "Rajasthan, India", rating: "4.88", price: "₹24,500", image: "/images/dest-jaipur.png", tag: "Royal Architecture" },
    { title: "Jaisalmer Golden Fort", location: "Desert, Rajasthan", rating: "4.92", price: "₹28,000", image: "/images/dest-jaipur.png", tag: "Desert Safari" }
  ],
  wellness: [
    { title: "Kerala Backwaters & Tea Hills", location: "Kerala, India", rating: "4.91", price: "₹26,000", image: "/images/hero-mountains.png", tag: "Ayurvedic Spa" },
    { title: "Ubud Bamboo Sanctuaries", location: "Bali, Indonesia", rating: "4.94", price: "₹38,000", image: "/images/dest-bali.png", tag: "Jungle Sanctuary" }
  ],
  culinary: [
    { title: "Fontainhas Food & Spice Trail", location: "Goa & Kerala", rating: "4.89", price: "₹19,500", image: "/images/dest-goa.png", tag: "Seafood & Spices" },
    { title: "Ubud Organic Farm Dining", location: "Bali, Indonesia", rating: "4.93", price: "₹34,000", image: "/images/dest-bali.png", tag: "Artisan Kitchens" }
  ]
}

export function TravelMoodSelector({ onNavigateView }) {
  const [activeMood, setActiveMood] = useState("alpine")

  const activeDestinations = moodDestinations[activeMood] || moodDestinations.alpine

  return (
    <section className="py-20 bg-[#FAF7F2] border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#6B4423]">
              <Compass className="h-3.5 w-3.5" />
              Curated Mood Experiences
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-foreground mt-2 tracking-tight">
              Select Your Travel Mood
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-xl">
              Every traveler feels a different calling. Choose your current travel mood to uncover handpicked journeys.
            </p>
          </div>

          <Button
            onClick={() => onNavigateView("explore")}
            variant="outline"
            className="rounded-full border-foreground/20 bg-[#F4F6F6] text-xs font-bold text-foreground shadow-sm hover:bg-[#F4F6F6] hover:border-foreground/40 self-start md:self-auto"
          >
            Explore All Vibe Collections
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Mood Selector Buttons Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-10">
          {moods.map((m) => {
            const IconComp = m.icon
            const isActive = activeMood === m.id
            return (
              <button
                key={m.id}
                onClick={() => setActiveMood(m.id)}
                className={`flex flex-col items-center justify-center rounded-3xl border p-4 text-center transition-all select-none ${
                  isActive
                    ? "border-primary bg-[#F4F6F6] ring-2 ring-primary/20 shadow-xl shadow-primary/10 scale-105"
                    : "border-border/60 bg-[#F4F6F6]/70 hover:border-primary/40 hover:bg-[#F4F6F6]"
                }`}
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-2xl mb-2 ${
                  isActive ? "bg-primary text-primary-foreground" : "bg-primary/10 text-[#6B4423]"
                }`}>
                  <IconComp className="h-5 w-5" />
                </span>
                <span className="font-heading text-sm font-bold text-foreground">{m.name}</span>
                <span className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{m.desc}</span>
              </button>
            )
          })}
        </div>

        {/* Dynamic Mood Destinations Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMood}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {activeDestinations.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onNavigateView("itinerary")}
                className="group relative overflow-hidden rounded-3xl border border-border/80 bg-[#2A4B5F] text-[#FFFFFF] p-4 shadow-xl transition-all hover:shadow-2xl hover:border-primary/50 cursor-pointer flex flex-col sm:flex-row gap-4"
              >
                {/* Image Box */}
                <div className="relative h-48 sm:h-auto sm:w-5/12 overflow-hidden rounded-2xl shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-black/60 border border-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                    {item.tag}
                  </span>
                </div>

                {/* Info Box */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#FFFFFF]/75 mb-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#FFFFFF]" />
                        {item.location}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {item.rating}
                      </span>
                    </div>

                    <h3 className="font-heading text-xl font-bold text-[#FFFFFF] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#FFFFFF]/85 mt-2 leading-relaxed">
                      Custom tailored itinerary with handpicked hotels, private transfers, and local experience passes.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#FFFFFF]/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-[#FFFFFF]/75">Starting from</span>
                      <span className="font-heading text-lg font-extrabold text-[#FFFFFF] block leading-none">{item.price}</span>
                    </div>

                    <Button size="sm" className="rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-md">
                      Plan This Vibe
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
