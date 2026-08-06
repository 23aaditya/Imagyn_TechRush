"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Star, Clock, Wallet, ChevronLeft, ChevronRight, Sun, CloudSun, Snowflake } from "lucide-react"

const destinations = [
  {
    id: "goa",
    name: "Goa",
    country: "India",
    image: "/images/dest-goa.png",
    budget: "₹9,800",
    duration: "4–5 days",
    weather: { label: "31°C Sunny", icon: "sun" },
    rating: 4.8,
    tags: ["Beaches", "Nightlife"],
    description: "Golden palm-fringed coastlines, vibrant beach shacks, Portuguese heritage, and sunset cruises.",
  },
  {
    id: "jaipur",
    name: "Jaipur",
    country: "India",
    image: "/images/dest-jaipur.png",
    budget: "₹8,500",
    duration: "3–4 days",
    weather: { label: "29°C Clear", icon: "sun" },
    rating: 4.7,
    tags: ["Heritage", "Culture"],
    description: "The Royal Pink City with majestic hill forts, opulent grand palaces, and bustling artisan bazaars.",
  },
  {
    id: "kerala",
    name: "Kerala",
    country: "India",
    image: "/images/dest-kerala.png",
    budget: "₹12,500",
    duration: "5–6 days",
    weather: { label: "27°C Humid", icon: "cloud" },
    rating: 4.9,
    tags: ["Nature", "Backwaters"],
    description: "Emerald backwaters, luxury houseboats, aromatic spice plantations, and serene tea estates in Munnar.",
  },
  {
    id: "manali",
    name: "Manali",
    country: "India",
    image: "/images/dest-manali.png",
    budget: "₹11,000",
    duration: "4–5 days",
    weather: { label: "12°C Snowy", icon: "snow" },
    rating: 4.6,
    tags: ["Mountains", "Adventure"],
    description: "Snow-capped Himalayan valleys, Solang valley adventures, river rafting, and cozy mountain cafes.",
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    image: "/images/dest-bali.png",
    budget: "₹28,000",
    duration: "6–7 days",
    weather: { label: "30°C Tropical", icon: "sun" },
    rating: 4.9,
    tags: ["Beaches", "Island Relaxation"],
    description: "Tropical island paradise blending cliffside temples, terraced rice paddies, and beachfront villas.",
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    image: "/images/dest-santorini.png",
    budget: "₹45,000",
    duration: "5–6 days",
    weather: { label: "26°C Sunny", icon: "sun" },
    rating: 4.8,
    tags: ["Cliffside Stays", "Aegean Views"],
    description: "Iconic whitewashed cliffside villages with blue domes, volcanic sand beaches, and Aegean sunsets.",
  },
]

const weatherIcon = { sun: Sun, cloud: CloudSun, snow: Snowflake }

export function TrendingDestinations({ onNavigateView }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? destinations.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === destinations.length - 1 ? 0 : prev + 1))
  }

  const activeDest = destinations[currentIndex]
  const WeatherIcon = weatherIcon[activeDest.weather.icon]

  return (
    <section id="destinations" className="relative bg-background px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl"
          >
            🔥 Trending This Season
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-lg leading-relaxed text-pretty text-muted-foreground"
          >
            An overview of top destinations for your next journey.
          </motion.p>
        </div>

        {/* Large Sliding Showcase Gallery Carousel */}
        <div className="mt-12 relative rounded-3xl border border-border/80 bg-card p-4 sm:p-8 shadow-2xl overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Image Slide Display */}
            <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden rounded-2xl group cursor-pointer" onClick={() => onNavigateView?.("explore")}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeDest.image}
                  src={activeDest.image}
                  alt={`${activeDest.name}, ${activeDest.country}`}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Weather badge */}
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                <WeatherIcon className="h-4 w-4" />
                {activeDest.weather.label}
              </span>

              {/* Rating badge */}
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-background/90 px-3 py-1.5 text-xs font-bold text-foreground backdrop-blur-md">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {activeDest.rating}
              </span>

              {/* Bottom overlay text on image */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-medium text-white/80 uppercase tracking-widest">{activeDest.country}</p>
                <h3 className="font-heading text-3xl font-extrabold leading-tight">{activeDest.name}</h3>
              </div>
            </div>

            {/* Content Details Display */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Destination Spotlight</span>
                  <span className="text-xs font-medium text-muted-foreground">{currentIndex + 1} of {destinations.length}</span>
                </div>

                <h3 className="mt-2 font-heading text-3xl font-bold text-foreground">
                  {activeDest.name}, <span className="text-muted-foreground font-normal">{activeDest.country}</span>
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {activeDest.description}
                </p>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border bg-background p-3.5">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Wallet className="h-4 w-4 text-emerald" />
                      Est. Budget
                    </span>
                    <span className="mt-1 block font-heading text-lg font-bold text-foreground">
                      {activeDest.budget} <span className="text-xs font-normal text-muted-foreground">/ person</span>
                    </span>
                  </div>

                  <div className="rounded-2xl border border-border bg-background p-3.5">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Clock className="h-4 w-4 text-primary" />
                      Trip Length
                    </span>
                    <span className="mt-1 block font-heading text-lg font-bold text-foreground">
                      {activeDest.duration}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {activeDest.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between border-t border-border/60 pt-4">
                <div className="flex gap-1.5">
                  {destinations.map((d, idx) => (
                    <button
                      key={d.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous destination"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm hover:bg-accent transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next destination"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm hover:bg-accent transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
