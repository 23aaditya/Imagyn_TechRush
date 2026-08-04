"use client"

import { useEffect, useState, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  MapPin,
  Calendar,
  Wallet,
  Compass,
  Search,
  CloudSun,
  Hotel,
  Map as MapIcon,
  PlaneTakeoff,
  ChevronDown,
  Mountain,
  Palmtree,
  Landmark,
  TreePine,
  Backpack,
  Sparkles,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useItinerary, PRESET_PLACES_LIST } from "@/lib/itinerary-context"
import { useAuth } from "@/lib/auth-context"

const chips = [
  { label: "Mountains", icon: Mountain },
  { label: "Beaches", icon: Palmtree },
  { label: "Heritage", icon: Landmark },
  { label: "Nature", icon: TreePine },
  { label: "Backpacking", icon: Backpack },
  { label: "Luxury", icon: Sparkles },
]

const floatingCards = [
  { icon: CloudSun, title: "Weather", subtitle: "28°C · Sunny", accent: "emerald", pos: "left-0 top-2", delay: 0 },
  { icon: Wallet, title: "Budget", subtitle: "₹12,400 planned", accent: "primary", pos: "right-2 top-24", delay: 0.4 },
  { icon: Hotel, title: "Hotels", subtitle: "320+ nearby", accent: "primary", pos: "left-6 top-48", delay: 0.8 },
  { icon: MapIcon, title: "Interactive Maps", subtitle: "12 stops mapped", accent: "emerald", pos: "right-0 top-72", delay: 1.2 },
  { icon: PlaneTakeoff, title: "Flights", subtitle: "From ₹2,499", accent: "primary", pos: "left-16 bottom-2", delay: 1.6 },
]

const heroBackgrounds = [
  { src: "/images/hero-mountains.png", alt: "Misty mountain range at golden hour" },
  { src: "/images/dest-goa.png", alt: "Sunny palm-lined beach shoreline in Goa" },
  { src: "/images/dest-bali.png", alt: "Tropical palm-fringed beach in Bali" },
  { src: "/images/dest-jaipur.png", alt: "Warm, sunlit city escape in Jaipur" },
  { src: "/images/dest-santorini.png", alt: "Whitewashed cliffside coastal town in Santorini" },
  { src: "/images/dest-manali.png", alt: "Snow-capped adventure mountains in Manali" },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
}

export function Hero() {
  const [activeSlide, setActiveSlide] = useState(0)
  const {
    setDestination,
    selectedDestinationKey,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    travelDatesSpan
  } = useItinerary()

  const { isLoggedIn, openAuthModal } = useAuth()

  const [destinationInput, setDestinationInput] = useState("")
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroBackgrounds.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsAutocompleteOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Autocomplete matching logic
  const filteredSuggestions = PRESET_PLACES_LIST.filter((place) => {
    if (!destinationInput.trim()) return true
    return place.toLowerCase().includes(destinationInput.toLowerCase().trim())
  })

  const handleSelectPlace = (placeName) => {
    setDestinationInput(placeName)
    setDestination(placeName)
    setIsAutocompleteOpen(false)
  }

  const handleStartPlanning = () => {
    if (destinationInput.trim()) {
      setDestination(destinationInput.trim())
    }
    if (!isLoggedIn) {
      openAuthModal("Sign in to generate and edit your custom AI travel itinerary", "login")
      return
    }
    const el = document.getElementById("itinerary")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="home" className="relative isolate min-h-screen w-full overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-slate-100">
        <AnimatePresence>
          <motion.div
            key={heroBackgrounds[activeSlide].src}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.09 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.6, ease: "easeInOut" },
              scale: { duration: 6, ease: "linear" },
            }}
            className="absolute inset-0"
          >
            <img
              src={heroBackgrounds[activeSlide].src || "/placeholder.svg"}
              alt={heroBackgrounds[activeSlide].alt}
              className="h-full w-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/15 via-transparent to-emerald-400/15 mix-blend-soft-light" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-background/20 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/92 via-background/50 to-background/10" />

        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {heroBackgrounds.map((bg, i) => (
            <span
              key={bg.src}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === activeSlide ? "w-6 bg-primary" : "w-1.5 bg-foreground/25"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-20 pt-32 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-40">
        {/* Left column */}
        <div className="max-w-2xl">
          <motion.span
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-1.5 text-sm font-medium text-foreground backdrop-blur-md"
          >
            <Compass className="h-4 w-4 text-emerald" />
            Smart itineraries, powered by AI
          </motion.span>

          <motion.h1
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="mt-5 font-heading text-4xl font-bold leading-[1.05] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl"
          >
            Plan Your Dream Trip{" "}
            <span className="text-primary">Smarter</span>, Faster &{" "}
            <span className="text-emerald">Stress-Free.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground"
          >
            Discover destinations, compare travel packages, generate intelligent
            itineraries, calculate travel budgets and explore the world visually.
          </motion.p>

          {/* Search card with Autocomplete & Travel Dates Span */}
          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="show"
            className="mt-8 rounded-3xl border border-border/60 bg-background/70 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-5"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Destination Search Box with Autocomplete */}
              <div className="relative" ref={dropdownRef}>
                <label className="flex cursor-text items-center gap-3 rounded-2xl border border-border/60 bg-background/60 px-3.5 py-2.5 transition-colors focus-within:border-primary/50">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-xs font-medium text-muted-foreground">Destination</span>
                    <input
                      type="text"
                      placeholder="Type a city (e.g. Agra, Jaipur, Goa...)"
                      value={destinationInput}
                      onFocus={() => setIsAutocompleteOpen(true)}
                      onChange={(e) => {
                        setDestinationInput(e.target.value)
                        setIsAutocompleteOpen(true)
                      }}
                      className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                  </span>
                </label>

                {/* Autocomplete Popup List */}
                <AnimatePresence>
                  {isAutocompleteOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute left-0 top-full z-50 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-border bg-card p-2 shadow-2xl backdrop-blur-xl"
                    >
                      <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Matching Destinations ({filteredSuggestions.length})
                      </p>
                      {filteredSuggestions.length === 0 ? (
                        <div
                          onClick={() => handleSelectPlace(destinationInput)}
                          className="cursor-pointer rounded-xl px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10"
                        >
                          Use custom destination: "<strong>{destinationInput}</strong>"
                        </div>
                      ) : (
                        filteredSuggestions.map((place) => (
                          <button
                            key={place}
                            type="button"
                            onClick={() => handleSelectPlace(place)}
                            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold text-foreground hover:bg-primary/15 hover:text-primary transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 text-emerald" />
                              {place}
                            </span>
                            {selectedDestinationKey.toLowerCase() === place.toLowerCase() && (
                              <Check className="h-3.5 w-3.5 text-primary" />
                            )}
                          </button>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Travel Dates Range Field */}
              <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/60 px-3.5 py-2.5 transition-colors focus-within:border-primary/50">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
                  <Calendar className="h-4 w-4" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-xs font-medium text-muted-foreground">Travel Dates Span</span>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="rounded-lg border border-border/60 bg-background/80 px-2 py-1 text-[11px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                    />
                    <span className="text-muted-foreground font-medium">to</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="rounded-lg border border-border/60 bg-background/80 px-2 py-1 text-[11px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <SearchField icon={Wallet} label="Budget">
                <SelectField
                  options={["Any budget", "Under ₹15,000", "₹15,000 – ₹35,000", "₹35,000 – ₹75,000", "₹75,000+"]}
                />
              </SearchField>
              <SearchField icon={Compass} label="Travel Type">
                <SelectField options={["Any type", "Solo", "Couple", "Family", "Friends", "Business"]} />
              </SearchField>
            </div>

            {/* Travel Date Span Display Badge */}
            <div className="mt-3 flex items-center justify-between px-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                🗓️ Active Span: <strong className="text-foreground font-semibold">{travelDatesSpan}</strong>
              </span>
              <span className="text-emerald font-medium">Synced with Itinerary Builder</span>
            </div>

            <Button
              onClick={handleStartPlanning}
              className="mt-3 h-12 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-xl shadow-primary/30 ring-1 ring-primary/20 hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/40"
            >
              <Search className="mr-1 h-5 w-5" />
              Start Planning
            </Button>
          </motion.div>

          {/* Chips */}
          <motion.div
            variants={fadeUp}
            custom={4}
            initial="hidden"
            animate="show"
            className="mt-6 flex flex-wrap gap-2.5"
          >
            {chips.map((chip) => {
              const ChipIcon = chip.icon
              return (
                <button
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-background/80"
                >
                  <ChipIcon className="h-4 w-4 text-emerald" aria-hidden />
                  {chip.label}
                </button>
              )
            })}
          </motion.div>
        </div>

        {/* Right column: floating cards */}
        <div className="relative hidden h-[480px] lg:block">
          {floatingCards.map((card) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 + card.delay * 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`absolute ${card.pos}`}
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, delay: card.delay, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="flex w-52 items-center gap-3 rounded-2xl border border-border/60 bg-background/70 p-3.5 shadow-xl shadow-black/10 backdrop-blur-xl"
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      card.accent === "emerald"
                        ? "bg-emerald/15 text-emerald"
                        : "bg-primary/15 text-primary"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{card.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{card.subtitle}</p>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SearchField({ icon: Icon, label, children }) {
  return (
    <label className="flex cursor-text items-center gap-3 rounded-2xl border border-border/60 bg-background/60 px-3.5 py-2.5 transition-colors focus-within:border-primary/50">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {children}
      </span>
    </label>
  )
}

function SelectField({ options }) {
  return (
    <span className="relative flex items-center">
      <select className="w-full cursor-pointer appearance-none bg-transparent pr-5 text-sm font-medium text-foreground focus:outline-none">
        {options.map((opt) => (
          <option key={opt} className="bg-background text-foreground">
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-muted-foreground" />
    </span>
  )
}
