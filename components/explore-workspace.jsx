"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Search,
  MapPin,
  Compass,
  Sun,
  CloudSun,
  Star,
  Calendar,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Globe,
  Filter,
  Users,
  Clock,
  Coins,
  Utensils,
  Hotel,
  Ticket,
  HeartHandshake
} from "lucide-react"
import { Button } from "@/components/ui/button"

const popularDestinations = [
  {
    id: "kerala",
    name: "Kerala",
    subtitle: "Backwaters & Tea",
    country: "India",
    temp: "27°C",
    image: "/images/dest-kerala.png",
    rating: 4.9,
    ageGroup: "All Ages (Families & Couples)",
    vibe: "Serene & Tropical Backwaters",
    bestTime: "Sep – Mar",
    startingBudget: "From ₹12,500",
    attractions: 32,
    hotels: 48,
    foodSpots: 28,
    itineraryIdeas: 15,
    description: "Serene emerald backwaters, lush tea estates in Munnar, Ayurvedic wellness retreats, and quiet cliffside beaches."
  },
  {
    id: "goa",
    name: "Goa",
    subtitle: "Beaches & Shacks",
    country: "India",
    temp: "31°C",
    image: "/images/dest-goa.png",
    rating: 4.8,
    ageGroup: "18 – 40 Yrs (Friends & Couples)",
    vibe: "Sun, Surf & Nightlife",
    bestTime: "Nov – Feb",
    startingBudget: "From ₹9,800",
    attractions: 24,
    hotels: 65,
    foodSpots: 42,
    itineraryIdeas: 12,
    description: "Sun-drenched golden beaches, vibrant night markets, Portuguese heritage quarters, and fresh seafood shacks."
  },
  {
    id: "jaipur",
    name: "Jaipur",
    subtitle: "Heritage & Forts",
    country: "India",
    temp: "26°C",
    image: "/images/dest-jaipur.png",
    rating: 4.7,
    ageGroup: "All Ages (Culture Lovers)",
    vibe: "Royal & Historic Palaces",
    bestTime: "Oct – Mar",
    startingBudget: "From ₹8,500",
    attractions: 19,
    hotels: 38,
    foodSpots: 31,
    itineraryIdeas: 10,
    description: "The Royal Pink City with majestic hill forts, opulent grand palaces, bustling bazaars, and rich Rajput heritage."
  },
  {
    id: "manali",
    name: "Manali",
    subtitle: "Mountains & Snow",
    country: "India",
    temp: "14°C",
    image: "/images/dest-manali.png",
    rating: 4.6,
    ageGroup: "16 – 45 Yrs (Adventurers & Couples)",
    vibe: "Snow Thrills & Pine Valleys",
    bestTime: "Oct – May",
    startingBudget: "From ₹11,000",
    attractions: 22,
    hotels: 40,
    foodSpots: 25,
    itineraryIdeas: 14,
    description: "High Himalayan adventure haven offering snow sports in Solang Valley, pine trails, river rafting, and cozy cafes."
  },
  {
    id: "bali",
    name: "Bali",
    subtitle: "Island Relaxation",
    country: "Indonesia",
    temp: "29°C",
    image: "/images/dest-bali.png",
    rating: 4.9,
    ageGroup: "20 – 50 Yrs (Honeymooners & Seekers)",
    vibe: "Spiritual & Tropical Retreat",
    bestTime: "Apr – Oct",
    startingBudget: "From ₹28,000",
    attractions: 45,
    hotels: 80,
    foodSpots: 55,
    itineraryIdeas: 20,
    description: "Tropical island paradise blending sacred cliffside temples, terraced rice paddies, surfing beaches, and jungle villas."
  },
  {
    id: "santorini",
    name: "Santorini",
    subtitle: "Luxury Cliffside",
    country: "Greece",
    temp: "24°C",
    image: "/images/dest-santorini.png",
    rating: 4.9,
    ageGroup: "22 – 55 Yrs (Couples & Luxury)",
    vibe: "Romantic Aegean Sunsets",
    bestTime: "May – Oct",
    startingBudget: "From ₹45,000",
    attractions: 18,
    hotels: 52,
    foodSpots: 36,
    itineraryIdeas: 11,
    description: "Iconic whitewashed cliff villages with blue domes, volcanic sand beaches, wine tasting, and breathtaking sunsets."
  },
  {
    id: "switzerland",
    name: "Switzerland",
    subtitle: "Alpine Adventure",
    country: "Switzerland",
    temp: "10°C",
    image: "/images/hero-mountains.png",
    rating: 4.8,
    ageGroup: "All Ages (Scenic & Nature)",
    vibe: "Glacier Lakes & Snow Peaks",
    bestTime: "Jun – Sep & Dec – Mar",
    startingBudget: "From ₹65,000",
    attractions: 35,
    hotels: 60,
    foodSpots: 40,
    itineraryIdeas: 18,
    description: "Pristine Alpine landscapes, panoramic train journeys, crystal clear glacier lakes, and world-class ski slopes."
  }
]

export function ExploreWorkspace({ onBack, onSelectDestination }) {
  const [hoveredDest, setHoveredDest] = useState(popularDestinations[0])
  const [searchQuery, setSearchQuery] = useState("")
  const scrollRef = useRef(null)

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -280 : 280
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
    }
  }

  const filtered = popularDestinations.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vibe.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="rounded-xl border-border bg-background hover:bg-accent text-xs sm:text-sm"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Overview
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-foreground text-sm">Interactive Destination Explorer</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Globe className="h-3.5 w-3.5" />
              Circular Destination Discovery Active
            </span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Explore the World <span className="font-serif italic text-emerald-600 dark:text-emerald-400 font-normal">Your Way</span>
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-2xl">
            Hover over any destination circle to preview target age, vibe, best season, and key attraction details.
          </p>
        </div>

        {/* Popular Destinations Circular Carousel Section */}
        <div className="mb-12 rounded-3xl border border-border/80 bg-gradient-to-b from-card/80 to-card p-6 shadow-xl backdrop-blur-xl">
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              Popular Destinations
            </h2>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll("left")}
                aria-label="Scroll left"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-all hover:bg-accent"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleScroll("right")}
                aria-label="Scroll right"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-all hover:bg-accent"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Circular Cards Horizontal Scroll Row */}
          <div
            ref={scrollRef}
            className="flex items-center gap-6 overflow-x-auto pb-4 pt-2 scrollbar-none px-2"
            style={{ scrollbarWidth: "none" }}
          >
            {filtered.map((item) => {
              const isSelected = hoveredDest?.id === item.id
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredDest(item)}
                  onClick={() => setHoveredDest(item)}
                  className="flex flex-col items-center shrink-0 cursor-pointer group transition-all"
                >
                  {/* Circular Avatar Card with Ring */}
                  <div className="relative">
                    <motion.div
                      animate={{
                        scale: isSelected ? 1.12 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className={`relative h-28 w-28 sm:h-36 sm:w-36 rounded-full p-1.5 transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-tr from-emerald-500 via-teal-400 to-primary shadow-xl shadow-emerald-500/25 ring-4 ring-emerald-500/30"
                          : "bg-border/60 hover:bg-primary/50"
                      }`}
                    >
                      <div className="h-full w-full overflow-hidden rounded-full relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      </div>
                    </motion.div>

                    {/* Weather badge top right of circle */}
                    <span className="absolute top-0 right-0 flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-md border border-white/30">
                      <CloudSun className="h-3 w-3" />
                      {item.temp}
                    </span>
                  </div>

                  {/* Title underneath circle */}
                  <div className="mt-3 text-center">
                    <h3 className={`font-heading text-base font-bold transition-colors ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Floating Hover Details Panel */}
          <AnimatePresence mode="wait">
            {hoveredDest && (
              <motion.div
                key={hoveredDest.id}
                initial={{ opacity: 0, y: 15, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="mt-6 mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border/80 bg-background/95 p-6 shadow-2xl backdrop-blur-2xl"
              >
                {/* Header */}
                <div className="text-center border-b border-border/60 pb-4 mb-5">
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald/10 px-3 py-1 rounded-full mb-2">
                    Explore {hoveredDest.name}
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-foreground">
                    {hoveredDest.name} — {hoveredDest.subtitle}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed">
                    {hoveredDest.description}
                  </p>
                </div>

                {/* Key Details Grid: Target Age, Vibe, Best Time, Starting Budget */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {/* Age Group */}
                  <div className="rounded-2xl border border-border bg-card p-3 text-center">
                    <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Users className="h-4 w-4" />
                    </div>
                    <span className="block text-[10px] font-semibold uppercase text-muted-foreground">Appropriate Age</span>
                    <span className="mt-0.5 block text-xs font-bold text-foreground truncate">{hoveredDest.ageGroup}</span>
                  </div>

                  {/* Vibe */}
                  <div className="rounded-2xl border border-border bg-card p-3 text-center">
                    <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-emerald/10 text-emerald-600 dark:text-emerald-400">
                      <HeartHandshake className="h-4 w-4" />
                    </div>
                    <span className="block text-[10px] font-semibold uppercase text-muted-foreground">Vibe & Atmosphere</span>
                    <span className="mt-0.5 block text-xs font-bold text-foreground truncate">{hoveredDest.vibe}</span>
                  </div>

                  {/* Best Time */}
                  <div className="rounded-2xl border border-border bg-card p-3 text-center">
                    <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <Clock className="h-4 w-4" />
                    </div>
                    <span className="block text-[10px] font-semibold uppercase text-muted-foreground">Best Season</span>
                    <span className="mt-0.5 block text-xs font-bold text-foreground truncate">{hoveredDest.bestTime}</span>
                  </div>

                  {/* Starting Budget */}
                  <div className="rounded-2xl border border-border bg-card p-3 text-center">
                    <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Coins className="h-4 w-4" />
                    </div>
                    <span className="block text-[10px] font-semibold uppercase text-muted-foreground">Est. Starting Cost</span>
                    <span className="mt-0.5 block text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate">{hoveredDest.startingBudget}</span>
                  </div>
                </div>

                {/* Attractions & Experiences Stats */}
                <div className="flex flex-wrap items-center justify-around gap-4 rounded-2xl bg-secondary/60 p-3 mb-6 text-center text-xs">
                  <div>
                    <span className="font-bold text-foreground block text-sm">{hoveredDest.attractions}</span>
                    <span className="text-muted-foreground text-[11px]">Attractions</span>
                  </div>
                  <div className="h-6 w-px bg-border" />
                  <div>
                    <span className="font-bold text-foreground block text-sm">{hoveredDest.hotels}</span>
                    <span className="text-muted-foreground text-[11px]">Hotels & Stays</span>
                  </div>
                  <div className="h-6 w-px bg-border" />
                  <div>
                    <span className="font-bold text-foreground block text-sm">{hoveredDest.foodSpots}</span>
                    <span className="text-muted-foreground text-[11px]">Food & Drinks</span>
                  </div>
                  <div className="h-6 w-px bg-border" />
                  <div>
                    <span className="font-bold text-foreground block text-sm">{hoveredDest.itineraryIdeas}</span>
                    <span className="text-muted-foreground text-[11px]">Itinerary Plans</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="text-center">
                  <Button
                    onClick={() => onSelectDestination(hoveredDest.name)}
                    className="rounded-2xl bg-emerald-600 px-8 py-3 font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition-all"
                  >
                    Explore {hoveredDest.name}
                    <ChevronRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  )
}
