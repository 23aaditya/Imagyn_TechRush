"use client"

import { useEffect, useState, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  MapPin,
  Calendar,
  Wallet,
  Compass,
  Search,
  ChevronDown,
  Clock,
  Flame,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"

const heroBackgrounds = [
  { src: "/images/hero-mountains.png", alt: "Misty mountain range at golden hour" },
  { src: "/images/dest-goa.png", alt: "Sunny palm-lined beach shoreline in Goa" },
  { src: "/images/dest-bali.png", alt: "Tropical palm-fringed beach in Bali" },
  { src: "/images/dest-jaipur.png", alt: "Warm, sunlit city escape in Jaipur" },
  { src: "/images/dest-santorini.png", alt: "Whitewashed cliffside coastal town in Santorini" },
  { src: "/images/dest-manali.png", alt: "Snow-capped adventure mountains in Manali" },
]

const allDestinations = [
  { name: "Jaipur", region: "Rajasthan, India", type: "popular" },
  { name: "Jaisalmer", region: "Rajasthan, India", type: "trending" },
  { name: "Jammu", region: "Jammu & Kashmir, India", type: "trending" },
  { name: "Goa", region: "India", type: "popular" },
  { name: "Kerala", region: "India", type: "popular" },
  { name: "Manali", region: "Himachal, India", type: "trending" },
  { name: "Udaipur", region: "Rajasthan, India", type: "popular" },
  { name: "Shimla", region: "Himachal, India", type: "trending" },
  { name: "Bali", region: "Indonesia", type: "popular" },
  { name: "Santorini", region: "Greece", type: "trending" },
  { name: "Lonavala", region: "Maharashtra, India", type: "popular" },
  { name: "Munnar", region: "Kerala, India", type: "trending" }
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
}

export function Hero({ onStartPlanning }) {
  const [activeSlide, setActiveSlide] = useState(0)

  // Search autocomplete state
  const [query, setQuery] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const dropdownRef = useRef(null)

  // Date range picker state
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [dateError, setDateError] = useState("")
  const [tripDuration, setTripDuration] = useState(null)

  // Budget state
  const [selectedBudget, setSelectedBudget] = useState("Any budget")
  const [customBudgetInput, setCustomBudgetInput] = useState("")

  // Load recent searches on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tripnest_recent_searches")
      if (saved) setRecentSearches(JSON.parse(saved))
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Auto rotate background hero slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroBackgrounds.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  // Handle outside click for search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle Date Range validation & Duration calculation
  useEffect(() => {
    if (fromDate && toDate) {
      const start = new Date(fromDate)
      const end = new Date(toDate)
      if (end < start) {
        setDateError("End date cannot be before start date")
        setTripDuration(null)
      } else {
        setDateError("")
        const diffTime = Math.abs(end - start)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
        setTripDuration(diffDays)
      }
    } else {
      setDateError("")
      setTripDuration(null)
    }
  }, [fromDate, toDate])

  const handleSelectDestination = (destName) => {
    setQuery(destName)
    setIsDropdownOpen(false)

    // Save to recent searches
    const updated = [destName, ...recentSearches.filter((s) => s !== destName)].slice(0, 4)
    setRecentSearches(updated)
    try {
      localStorage.setItem("tripnest_recent_searches", JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
  }

  const filteredDestinations = query.trim()
    ? allDestinations.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
    : []

  const trendingDestinations = allDestinations.filter((d) => d.type === "trending")
  const popularDestinations = allDestinations.filter((d) => d.type === "popular")

  return (
    <section id="home" className="relative min-h-[88vh] w-full overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={heroBackgrounds[activeSlide].src}
            src={heroBackgrounds[activeSlide].src}
            alt={heroBackgrounds[activeSlide].alt}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="h-full w-full object-cover filter brightness-[0.92] contrast-[1.05]"
          />
        </AnimatePresence>

        {/* Minimal dark overlay to ensure high contrast without white corner washes */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {heroBackgrounds.map((bg, i) => (
            <span
              key={bg.src}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === activeSlide ? "w-6 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-12 pt-28 sm:px-6 lg:pt-32">
        <div className="mx-auto text-center">
          
          <motion.span
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/85 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-foreground backdrop-blur-md"
          >
            <Compass className="h-3.5 w-3.5 text-emerald" />
            Curated Editorial Journeys
          </motion.span>

          <motion.h1
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="mt-5 font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-balance text-white drop-shadow-md sm:text-6xl lg:text-7xl"
          >
            Journeys, Quietly Well-Planned.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-pretty text-white/90 drop-shadow-sm font-normal"
          >
            Explore handpicked destinations, compare realistic travel packages, and craft bespoke itineraries tailored to your pace.
          </motion.p>

          {/* Enhanced Search Card ("Where To?") */}
          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="show"
            className="mt-8 mx-auto max-w-3xl rounded-3xl border border-border/80 bg-background/80 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-6"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 text-left">
              
              {/* Destination Search Input with Auto-complete Dropdown */}
              <div className="relative md:col-span-2" ref={dropdownRef}>
                <label className="flex cursor-text items-center gap-3 rounded-2xl border border-border/60 bg-background/80 px-3.5 py-2.5 transition-colors focus-within:border-primary">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[11px] font-semibold uppercase text-muted-foreground">Where To?</span>
                    <input
                      type="text"
                      value={query}
                      onFocus={() => setIsDropdownOpen(true)}
                      onChange={(e) => {
                        setQuery(e.target.value)
                        setIsDropdownOpen(true)
                      }}
                      placeholder="e.g. Jaipur, Goa, Manali..."
                      className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                  </span>
                </label>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-border bg-card p-3 shadow-2xl backdrop-blur-2xl"
                    >
                      {/* Search Matches */}
                      {query.trim() !== "" && (
                        <div className="mb-2">
                          <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Suggestions for &quot;{query}&quot;
                          </p>
                          {filteredDestinations.length > 0 ? (
                            filteredDestinations.map((dest) => (
                              <button
                                key={dest.name}
                                onClick={() => handleSelectDestination(dest.name)}
                                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold text-foreground transition-colors hover:bg-accent"
                              >
                                <span className="flex items-center gap-2">
                                  <MapPin className="h-3.5 w-3.5 text-primary" />
                                  {dest.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground">{dest.region}</span>
                              </button>
                            ))
                          ) : (
                            <p className="px-3 py-2 text-xs text-muted-foreground">No matching destinations found.</p>
                          )}
                        </div>
                      )}

                      {/* Recently Searched */}
                      {recentSearches.length > 0 && query.trim() === "" && (
                        <div className="mb-3 border-b border-border/60 pb-2">
                          <p className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            <Clock className="h-3 w-3 text-emerald" />
                            Recently Searched
                          </p>
                          <div className="flex flex-wrap gap-1.5 px-2 pt-1">
                            {recentSearches.map((item) => (
                              <button
                                key={item}
                                onClick={() => handleSelectDestination(item)}
                                className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-foreground hover:bg-primary/20 transition-colors"
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Trending Suggestions */}
                      {query.trim() === "" && (
                        <div className="mb-3 border-b border-border/60 pb-2">
                          <p className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            <Flame className="h-3 w-3 text-amber-500" />
                            Trending Destinations
                          </p>
                          {trendingDestinations.map((dest) => (
                            <button
                              key={dest.name}
                              onClick={() => handleSelectDestination(dest.name)}
                              className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left text-xs font-medium text-foreground transition-colors hover:bg-accent"
                            >
                              <span className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-amber-500" />
                                {dest.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground">{dest.region}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Popular Suggestions */}
                      {query.trim() === "" && (
                        <div>
                          <p className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            <Sparkles className="h-3 w-3 text-primary" />
                            Popular Choices
                          </p>
                          {popularDestinations.slice(0, 4).map((dest) => (
                            <button
                              key={dest.name}
                              onClick={() => handleSelectDestination(dest.name)}
                              className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left text-xs font-medium text-foreground transition-colors hover:bg-accent"
                            >
                              <span className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-primary" />
                                {dest.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground">{dest.region}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Date Range Picker (From Date & To Date) */}
              <div className="md:col-span-2 grid grid-cols-2 gap-2">
                <label className="flex cursor-pointer flex-col justify-center rounded-2xl border border-border/60 bg-background/80 px-3 py-2 transition-colors focus-within:border-primary">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground">From Date</span>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-foreground focus:outline-none"
                  />
                </label>

                <label className="flex cursor-pointer flex-col justify-center rounded-2xl border border-border/60 bg-background/80 px-3 py-2 transition-colors focus-within:border-primary">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground">To Date</span>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-foreground focus:outline-none"
                  />
                </label>
              </div>

              {/* Budget Picker in INR */}
              <div className="md:col-span-2">
                <label className="flex cursor-pointer flex-col justify-center rounded-2xl border border-border/60 bg-background/80 px-3 py-2 transition-colors focus-within:border-primary">
                  <span className="flex items-center justify-between text-[10px] font-semibold uppercase text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Wallet className="h-3 w-3 text-emerald" />
                      Budget (₹)
                    </span>
                    {selectedBudget === "Custom" && (
                      <span className="text-[9px] font-bold text-primary">Enter Amount</span>
                    )}
                  </span>

                  {selectedBudget === "Custom" ? (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs font-bold text-primary">₹</span>
                      <input
                        type="number"
                        placeholder="e.g. 25000"
                        value={customBudgetInput}
                        onChange={(e) => setCustomBudgetInput(e.target.value)}
                        className="w-full bg-transparent text-xs font-bold text-foreground focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedBudget("Any budget")}
                        className="text-[10px] text-muted-foreground hover:text-foreground underline"
                      >
                        Reset
                      </button>
                    </div>
                  ) : (
                    <select
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      className="w-full cursor-pointer bg-transparent text-xs font-semibold text-foreground focus:outline-none"
                    >
                      <option value="Any budget" className="bg-background text-foreground">Any Budget</option>
                      <option value="Under ₹5,000" className="bg-background text-foreground">Under ₹5,000</option>
                      <option value="₹5,000 – ₹15,000" className="bg-background text-foreground">₹5,000 – ₹15,000</option>
                      <option value="₹15,000 – ₹35,000" className="bg-background text-foreground">₹15,000 – ₹35,000</option>
                      <option value="₹35,000+" className="bg-background text-foreground">₹35,000+</option>
                      <option value="Custom" className="bg-background font-bold text-primary">✏️ Enter Custom Budget (₹)...</option>
                    </select>
                  )}
                </label>
              </div>

              {/* Travel Type */}
              <div className="md:col-span-2">
                <label className="flex cursor-pointer flex-col justify-center rounded-2xl border border-border/60 bg-background/80 px-3 py-2 transition-colors focus-within:border-primary">
                  <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-muted-foreground">
                    <Compass className="h-3 w-3 text-primary" />
                    Travel Type
                  </span>
                  <select className="w-full cursor-pointer bg-transparent text-xs font-semibold text-foreground focus:outline-none">
                    <option className="bg-background text-foreground">Any Type</option>
                    <option className="bg-background text-foreground">Solo</option>
                    <option className="bg-background text-foreground">Couple</option>
                    <option className="bg-background text-foreground">Family</option>
                    <option className="bg-background text-foreground">Friends</option>
                  </select>
                </label>
              </div>

            </div>

            {/* Validation & Duration Display */}
            {dateError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-destructive/10 p-2.5 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{dateError}</span>
              </div>
            )}

            {tripDuration && !dateError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald/10 p-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Trip Duration Calculated: {tripDuration} {tripDuration === 1 ? "Day" : "Days"}</span>
              </div>
            )}

            {/* Submit CTA */}
            <Button
              onClick={() => onStartPlanning?.("itinerary")}
              className="mt-4 h-12 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-xl shadow-primary/30 hover:bg-primary/90"
            >
              <Search className="mr-1.5 h-5 w-5" />
              Plan Itinerary
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
