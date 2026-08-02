"use client"

import { motion } from "framer-motion"
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
  { label: "Mountains", icon: Mountain },
  { label: "Beaches", icon: Palmtree },
  { label: "Heritage", icon: Landmark },
  { label: "Nature", icon: TreePine },
  { label: "Backpacking", icon: Backpack },
  { label: "Luxury", icon: Sparkles },
]

const floatingCards = [
  { icon: CloudSun, title: "Weather", subtitle: "28°C · Sunny", accent: "emerald", pos: "left-0 top-2", delay: 0 },
  { icon: Wallet, title: "Budget", subtitle: "$1,240 planned", accent: "primary", pos: "right-2 top-24", delay: 0.4 },
  { icon: Hotel, title: "Hotels", subtitle: "320+ nearby", accent: "primary", pos: "left-6 top-48", delay: 0.8 },
  { icon: MapIcon, title: "Interactive Maps", subtitle: "12 stops mapped", accent: "emerald", pos: "right-0 top-72", delay: 1.2 },
  { icon: PlaneTakeoff, title: "Flights", subtitle: "From $89", accent: "primary", pos: "left-16 bottom-2", delay: 1.6 },
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
  return (
    <section id="home" className="relative isolate min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/hero-mountains.png"
          alt="Misty mountain range at golden hour"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/15 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/45 to-background/5" />
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
            <Button className="mt-3 h-12 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90">
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
