"use client"

import { useEffect, useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"

const chips = [
  { label: "Mountains", icon: Mountain, view: "explore" },
  { label: "Beaches", icon: Palmtree, view: "explore" },
  { label: "Heritage", icon: Landmark, view: "explore" },
  { label: "Nature", icon: TreePine, view: "explore" },
  { label: "Backpacking", icon: Backpack, view: "itinerary" },
  { label: "Luxury", icon: Sparkles, view: "packages" },
]

const floatingCards = [
  { icon: CloudSun, title: "Weather", subtitle: "28°C · Sunny", accent: "emerald", pos: "left-0 top-2", delay: 0, view: "explore" },
  { icon: Wallet, title: "Budget", subtitle: "$1,240 planned", accent: "primary", pos: "right-2 top-24", delay: 0.4, view: "budget" },
  { icon: Hotel, title: "Hotels", subtitle: "320+ nearby", accent: "primary", pos: "left-6 top-48", delay: 0.8, view: "explore" },
  { icon: MapIcon, title: "Interactive Maps", subtitle: "12 stops mapped", accent: "emerald", pos: "right-0 top-72", delay: 1.2, view: "explore" },
  { icon: PlaneTakeoff, title: "Expense Tracker", subtitle: "Live logs active", accent: "primary", pos: "left-16 bottom-2", delay: 1.6, view: "expenses" },
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

export function Hero({ onStartPlanning }) {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroBackgrounds.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="home" className="relative min-h-[92vh] w-full overflow-hidden">
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
            className="h-full w-full object-cover"
          />
        </AnimatePresence>

        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

        {/* Slide indicators */}
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

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-20 pt-32 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-40">
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

          {/* Search card */}
          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="show"
            className="mt-8 rounded-3xl border border-border/60 bg-background/70 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-5"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <SearchField icon={MapPin} label="Destination">
                <input
                  type="text"
                  placeholder="Where to?"
                  className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </SearchField>
              <SearchField icon={Calendar} label="Travel Dates">
                <input
                  type="text"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = "text"
                  }}
                  placeholder="Add dates"
                  className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </SearchField>
              <SearchField icon={Wallet} label="Budget">
                <SelectField
                  options={["Any budget", "Under $500", "$500 – $1,500", "$1,500 – $3,000", "$3,000+"]}
                />
              </SearchField>
              <SearchField icon={Compass} label="Travel Type">
                <SelectField options={["Any type", "Solo", "Couple", "Family", "Friends", "Business"]} />
              </SearchField>
            </div>
            <Button
              onClick={() => onStartPlanning?.("itinerary")}
              className="mt-3 h-12 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-xl shadow-primary/30 ring-1 ring-primary/20 hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/40"
            >
              <Search className="mr-1 h-5 w-5" />
              Generate Smart Itinerary
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
                  onClick={() => onStartPlanning?.(chip.view)}
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
                className={`absolute ${card.pos} cursor-pointer`}
                onClick={() => onStartPlanning?.(card.view)}
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, delay: card.delay, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="flex w-52 items-center gap-3 rounded-2xl border border-border/60 bg-background/70 p-3.5 shadow-xl shadow-black/10 backdrop-blur-xl hover:border-primary/50 transition-all"
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
