"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CoordinateReveal } from "@/components/motion/coordinate-reveal"
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Globe,
  Users,
  HeartHandshake,
  Clock,
  Coins,
  Ticket,
  Hotel,
  Utensils,
  Mountain,
  Palmtree,
  Car,
  Sun,
  Snowflake,
  CloudRain,
  CloudSun,
  PartyPopper,
  Sofa,
  Compass,
  Wallet,
  Crown,
  X,
  SlidersHorizontal,
  TrendingUp,
  Gem,
  Plane,
  Filter,
  Sparkles,
  ExternalLink,
  ArrowRightLeft,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTrip } from "@/context/trip-context"
import { DoodleBackground } from "@/components/doodle-background"
import destinationsData from "@/destinations_105.json"

/* ─────────────────────────────────────────────
   105 DESTINATIONS (DYNAMICAL IMPORT FROM JSON)
   ───────────────────────────────────────────── */
const allDestinations = destinationsData

/* ─────────────────────────────────────────────
   FILTER CATEGORIES & OPTIONS (PROFESSIONAL THEME, NO EMOJIS)
   ───────────────────────────────────────────── */
const filterCategories = [
  {
    key: "mood", label: "Mood",
    options: ["Relax", "Adventure", "Party", "Road Trips"],
    color: "#8E5AB5"
  },
  {
    key: "bestTime", label: "Best Season",
    options: ["Nov – Feb", "Oct – Mar", "Mar – Jun", "Jun – Sep", "Year round"],
    color: "#8E5AB5"
  },
  {
    key: "company", label: "Ideal For",
    options: ["Friends", "Family", "Solo"],
    color: "#8E5AB5"
  },
  {
    key: "budget", label: "Budget Tier",
    options: ["Economy", "Luxury"],
    color: "#8E5AB5"
  },
  {
    key: "type", label: "Destination Type",
    options: ["Mountains", "Beach", "Road Trips"],
    color: "#8E5AB5"
  },
]

/* ─────────────────────────────────────────────
   PETAL INFO CONFIG (THEME TYPOGRAPHY & COMPACT RADIAL DISTANCE)
   ───────────────────────────────────────────── */
const petalConfig = [
  { key: "minDays", label: "Duration", angle: -90, distance: 112 },
  { key: "mood", label: "Vibe", angle: -32, distance: 115 },
  { key: "specialty", label: "Highlight", angle: 32, distance: 115 },
  { key: "weather", label: "Best Season", angle: 90, distance: 112 },
  { key: "budget", label: "Budget", angle: 148, distance: 115 },
  { key: "company", label: "Ideal For", angle: 212, distance: 115 },
]

/* ─────────────────────────────────────────────
   ROW DEFINITIONS (NO SVG ICONS)
   ───────────────────────────────────────────── */
const rowConfig = [
  { key: "trending", label: "Trending Picks" },
  { key: "hidden", label: "Hidden Gems" },
  { key: "escapes", label: "International Escapes" },
]

/* ─────────────────────────────────────────────
   SCROLLABLE ROW COMPONENT (AUTO-SHIFT RIGHT-TO-LEFT & REDUCED SPACING)
   ───────────────────────────────────────────── */
function DestinationRow({ destinations, label, hoveredId, setHoveredId, onCardClick }) {
  const scrollRef = useRef(null)
  const [isRowHovered, setIsRowHovered] = useState(false)
  const [isManualScrolling, setIsManualScrolling] = useState(false)
  const manualScrollTimer = useRef(null)

  // Smooth continuous right-to-left auto-shifting (pauses on hover or manual scroll)
  useEffect(() => {
    if (isRowHovered || isManualScrolling) return
    const interval = setInterval(() => {
      if (!scrollRef.current) return
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      if (scrollLeft + clientWidth >= scrollWidth - 5) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        scrollRef.current.scrollBy({ left: 1, behavior: "auto" })
      }
    }, 35)
    return () => clearInterval(interval)
  }, [isRowHovered, isManualScrolling])

  const handleScroll = (dir) => {
    if (!scrollRef.current) return
    // Pause auto-scroll during and briefly after manual scroll
    setIsManualScrolling(true)
    if (manualScrollTimer.current) clearTimeout(manualScrollTimer.current)
    scrollRef.current.scrollBy({ left: dir === "left" ? -380 : 380, behavior: "smooth" })
    manualScrollTimer.current = setTimeout(() => setIsManualScrolling(false), 900)
  }

  return (
    <div className="mb-4">
      {/* Row Title Header */}
      <div className="flex items-center justify-between mb-1 px-2">
        <h3 className="font-heading text-xl sm:text-2xl font-medium tracking-tight text-foreground">
          {label}
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background/90 text-foreground shadow-xs transition-colors hover:bg-[#DDD0EA] hover:text-[#100B12] cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background/90 text-foreground shadow-xs transition-colors hover:bg-[#DDD0EA] hover:text-[#100B12] cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Reduced Vertical Padding Container */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsRowHovered(true)}
        onMouseLeave={() => setIsRowHovered(false)}
        className="flex items-start gap-6 overflow-x-auto py-6 px-6 explore-scrollbar-hide select-none"
        style={{ scrollbarWidth: "none" }}
      >
        {destinations.map((item) => (
          <ArchCard
            key={item.id}
            item={item}
            isHovered={hoveredId === item.id}
            onHover={() => setHoveredId(item.id)}
            onLeave={() => setHoveredId(null)}
            onClick={(e) => onCardClick(item, e)}
          />
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   ARCH CARD WITH PETAL POP-OUT
   ───────────────────────────────────────────── */
function ArchCard({ item, isHovered, onHover, onLeave, onClick }) {
  const getPetalValue = (key) => {
    if (key === "minDays") return `${item.minDays || 3} Days`
    return item[key] || ""
  }

  return (
    <div
      className="relative flex flex-col items-center shrink-0 cursor-pointer group"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ zIndex: isHovered ? 40 : 1 }}
    >
      {/* Petal Bubbles */}
      <AnimatePresence>
        {isHovered && petalConfig.map((petal, i) => {
          const rad = (petal.angle * Math.PI) / 180
          const x = Math.cos(rad) * petal.distance
          const y = Math.sin(rad) * petal.distance
          return (
            <motion.div
              key={petal.key}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
              animate={{ opacity: 1, x, y: y - 5, scale: 1 }}
              exit={{ opacity: 0, x: x * 0.4, y: (y - 5) * 0.4, scale: 0.3 }}
              transition={{
                type: "spring",
                stiffness: 190,
                damping: 20,
                mass: 0.75,
                delay: i * 0.04,
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
            >
              <div
                className="flex flex-col items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-md min-w-[85px] px-3 py-1.5 backdrop-blur-xl text-center"
              >
                <span className="font-heading text-[9px] font-medium text-[#8E5AB5] uppercase tracking-widest block leading-none">
                  {petal.label}
                </span>
                <span className="font-sans text-xs font-normal text-foreground mt-0.5 whitespace-nowrap max-w-[90px] truncate block leading-tight">
                  {getPetalValue(petal.key)}
                </span>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Arch Shaped Image Card */}
      <motion.div
        animate={{ scale: isHovered ? 1.05 : 1, y: isHovered ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="relative"
      >
        <div
          className="h-64 w-48 sm:h-72 sm:w-52 rounded-t-[999px] rounded-b-lg p-[3px] transition-all duration-300 shadow-xs relative"
          style={{
            background: isHovered
              ? `linear-gradient(135deg, ${item.color || "#10B981"}, ${item.color || "#10B981"}99)`
              : "var(--border)",
          }}
        >
          <div className="h-full w-full overflow-hidden rounded-t-[999px] rounded-b-md relative bg-neutral-900">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          {/* Temperature badge */}
          <span
            className="absolute top-2 right-2 flex items-center gap-1 rounded-xs px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white shadow-xs border border-white/30 z-10"
            style={{ background: item.color || "#10B981" }}
          >
            {item.temp || "25°C"}
          </span>
        </div>
      </motion.div>

      {/* Name & Subtitle Below the Shape */}
      <div className="mt-3 text-center relative z-10">
        <h4
          className="font-heading text-base sm:text-lg font-normal transition-colors"
          style={{ color: isHovered ? (item.color || "#10B981") : "var(--foreground)" }}
        >
          {item.name}
        </h4>
        <p className="text-xs text-muted-foreground font-normal mt-0.5">{item.subtitle}</p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   DETAIL PANEL
   ───────────────────────────────────────────── */
function DetailPanel({ destination, position, onClose, onExplore, onNavigateView }) {
  const [showPackagesView, setShowPackagesView] = useState(false)
  const { addPackageToCompare } = useTrip()

  const companyPackages = [
    {
      id: `${destination.name.toLowerCase().replace(/\s+/g, '-')}-mmt`,
      provider: "MakeMyTrip",
      name: `${destination.name} Grand Escape & Resort Stay`,
      destination: destination.name,
      country: destination.country || "India",
      duration: "4 Days / 3 Nights",
      price: "₹14,999",
      numericPrice: 14999,
      rating: "4.8 ★",
      highlights: "Resort Stay, Airport Transfers, Daily Breakfast & Sightseeing",
      url: "https://www.makemytrip.com/holidays-india/",
      hotelCategory: "4-Star Beach/City Resort",
      meals: "Breakfast & Sightseeing Included",
      transport: "Private AC Cab & Airport Transfer"
    },
    {
      id: `${destination.name.toLowerCase().replace(/\s+/g, '-')}-veena`,
      provider: "Veena World",
      name: `${destination.name} Heritage & Family Signature Tour`,
      destination: destination.name,
      country: destination.country || "India",
      duration: "5 Days / 4 Nights",
      price: "₹18,500",
      numericPrice: 18500,
      rating: "4.9 ★",
      highlights: "All-inclusive meals, Guided Heritage Walks, Private Cab",
      url: "https://www.veenaworld.com/",
      hotelCategory: "Heritage & Family Resort",
      meals: "All Meals Included",
      transport: "Dedicated Private SUV"
    },
    {
      id: `${destination.name.toLowerCase().replace(/\s+/g, '-')}-kesari`,
      provider: "Kesari Tours",
      name: `${destination.name} Luxury Panorama & Sunset Special`,
      destination: destination.name,
      country: destination.country || "India",
      duration: "6 Days / 5 Nights",
      price: "₹22,900",
      numericPrice: 22900,
      rating: "4.8 ★",
      highlights: "5-Star Hotel Stay, Sunset Cruise, Gourmet Dining",
      url: "https://www.kesari.in/",
      hotelCategory: "5-Star Luxury Resort",
      meals: "Gourmet Breakfast & Dinner",
      transport: "Private Luxury SUV & Sunset Cruise"
    },
    {
      id: `${destination.name.toLowerCase().replace(/\s+/g, '-')}-sotc`,
      provider: "SOTC Holidays",
      name: `${destination.name} Adventure & Coastal Trail`,
      destination: destination.name,
      country: destination.country || "India",
      duration: "4 Days / 3 Nights",
      price: "₹16,400",
      numericPrice: 16400,
      rating: "4.7 ★",
      highlights: "Attraction Tickets, Speedboat Activity, Beachside Resort",
      url: "https://www.sotc.in/",
      hotelCategory: "Coastal Beach Resort",
      meals: "Breakfast & Entry Tickets Included",
      transport: "Speedboat & AC Cab"
    },
    {
      id: `${destination.name.toLowerCase().replace(/\s+/g, '-')}-thomascook`,
      provider: "Thomas Cook",
      name: `${destination.name} Royal Experience & Food Trail`,
      destination: destination.name,
      country: destination.country || "India",
      duration: "5 Days / 4 Nights",
      price: "₹24,500",
      numericPrice: 24500,
      rating: "4.9 ★",
      highlights: "Boutique Villa Stay, Culinary Tasting Tour, Personal Escort",
      url: "https://www.thomascook.in/",
      hotelCategory: "Boutique Heritage Villa",
      meals: "Culinary Tasting & All Breakfasts",
      transport: "Personal Chauffeur Escort"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-lg ${
          position === "left" ? "md:mr-auto md:ml-12" : "md:ml-auto md:mr-12"
        }`}
      >
        {/* Header Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={destination.image}
            alt={destination.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close detail panel"
            className="absolute top-3 right-3 z-50 flex h-8 w-8 items-center justify-center rounded-md bg-black/60 text-white backdrop-blur-md transition hover:bg-black/90 cursor-pointer border border-white/20 shadow-xs"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 left-4 right-4">
            <CoordinateReveal
              coordinates={`15°28′N 73°49′E · ${destination.country?.toUpperCase() || "INDIA"}`}
              destinationName={destination.name}
            >
              <p className="text-xs font-normal text-white/90 drop-shadow">{destination.subtitle}</p>
            </CoordinateReveal>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {!showPackagesView ? (
            <>
              <p className="text-xs text-muted-foreground leading-relaxed mb-5">{destination.description}</p>

              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {[
                  { icon: <Users className="h-4 w-4" />, label: "Age Group", value: destination.ageGroup || "All Ages", color: "var(--primary)" },
                  { icon: <HeartHandshake className="h-4 w-4" />, label: "Vibe", value: destination.vibe || "Culture", color: destination.color || "#10B981" },
                  { icon: <Clock className="h-4 w-4" />, label: "Best Season", value: destination.bestTime || "All Year", color: "#F59E0B" },
                  { icon: <Coins className="h-4 w-4" />, label: "Budget", value: destination.startingBudget || "₹8,500", color: "#10B981" },
                ].map((detail, i) => (
                  <div key={i} className="rounded-md border border-border bg-card p-2.5 text-center">
                    <span className="block text-[9px] font-normal uppercase tracking-wider text-muted-foreground">{detail.label}</span>
                    <span className="mt-0.5 block text-xs font-normal text-foreground truncate">{detail.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2.5">
                <Button
                  onClick={() => onExplore(destination.name)}
                  className="w-full rounded-xl py-2.5 text-xs font-medium uppercase tracking-wider text-white shadow-md transition bg-[#8d5bb3] hover:bg-[#7a4aa0] cursor-pointer font-button"
                >
                  <Sparkles className="mr-1.5 h-4 w-4 text-amber-300" />
                  Customize Itinerary directly in Planner
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h4 className="font-heading text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Ticket className="h-4 w-4 text-[#8E5AB5]" />
                  Verified Packages for {destination.name}
                </h4>
                <span className="text-[10px] font-normal text-[#8E5AB5] bg-[#DDD0EA]/60 px-2 py-0.5 rounded-full">
                  5 Top Companies
                </span>
              </div>

              <div className="space-y-3">
                {companyPackages.map((pkg, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      addPackageToCompare(pkg)
                      onClose()
                      onNavigateView?.("packages")
                    }}
                    className="p-3.5 rounded-lg border border-border bg-background hover:border-[#8E5AB5]/50 hover:shadow-md transition-all space-y-2 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-white bg-[#8E5AB5] px-2.5 py-0.5 rounded-md">
                        {pkg.provider}
                      </span>
                      <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        {pkg.price} / person
                      </span>
                    </div>
                    <h5 className="font-normal text-xs text-foreground group-hover:text-[#8E5AB5] transition-colors">{pkg.name}</h5>
                    <p className="text-[10px] text-muted-foreground">{pkg.highlights}</p>
                    
                    <div className="flex items-center justify-between text-[10px] font-normal text-muted-foreground pt-1 border-t border-border/40">
                      <span>⏱️ {pkg.duration}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            addPackageToCompare(pkg)
                            onClose()
                            onNavigateView?.("packages")
                          }}
                          className="rounded-lg bg-[#8E5AB5] hover:bg-[#7A4A9E] text-white text-[10px] font-medium px-3 py-1 flex items-center gap-1 cursor-pointer h-7 shadow-sm"
                        >
                          <Sparkles className="h-3 w-3 text-amber-300" />
                          View Package Details
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            addPackageToCompare(pkg)
                            onClose()
                            onNavigateView?.("packages")
                          }}
                          className="rounded-lg border-[#8E5AB5]/40 text-[#8E5AB5] hover:bg-[#8E5AB5]/10 text-[10px] font-normal px-2 py-0.5 flex items-center gap-1 cursor-pointer h-7"
                        >
                          <ArrowRightLeft className="h-3 w-3" />
                          Compare
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPackagesView(false)}
                  className="rounded-lg border-border text-xs font-normal px-4 py-2 hover:bg-accent cursor-pointer"
                >
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  Back
                </Button>
                <Button
                  size="sm"
                  onClick={() => onExplore(destination.name)}
                  className="rounded-xl bg-[#8d5bb3] text-white text-xs font-medium px-4 py-2 hover:bg-[#7a4aa0] cursor-pointer shadow-md font-button"
                >
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  Customize Itinerary
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   CUSTOMIZE WHEEL
   ───────────────────────────────────────────── */
function CustomizeWheel({ activeFilters, setActiveFilters }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategoryKey, setSelectedCategoryKey] = useState(null)

  const toggleFilter = (key, value) => {
    setActiveFilters((prev) => {
      const next = { ...prev }
      if (next[key] === value) {
        delete next[key]
      } else {
        next[key] = value
      }
      return next
    })
  }

  const activeCount = Object.keys(activeFilters).length
  const selectedCatObj = filterCategories.find((c) => c.key === selectedCategoryKey)

  return (
    <div className="fixed bottom-8 left-8 sm:bottom-10 sm:left-10 z-40">
      {/* LUXURY LAVENDER GLASS PANEL FILTER POPUP */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-16 left-0 z-50 w-[320px] sm:w-[360px] max-h-[440px] overflow-y-auto rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xl text-[#100B12] select-none"
          >
            {!selectedCategoryKey ? (
              /* LEVEL 1: CATEGORY SELECTION LIST */
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-[#8E5AB5]" />
                    <span className="font-heading text-xs font-medium uppercase tracking-wider text-[#100B12]">
                      Filter Destinations
                    </span>
                  </div>
                  {activeCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveFilters({})}
                      className="text-[11px] font-normal text-[#8E5AB5] hover:underline cursor-pointer font-button"
                    >
                      Clear All ({activeCount})
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {filterCategories.map((cat) => {
                    const activeVal = activeFilters[cat.key]
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => setSelectedCategoryKey(cat.key)}
                        className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-all cursor-pointer font-button ${
                          activeVal
                            ? "bg-[#8E5AB5] text-white border border-[#9560BC] shadow-md"
                            : "bg-[#DDD0EA]/50 hover:bg-[#DDD0EA] text-[#100B12] border border-[#B9A6C9]/40"
                        }`}
                      >
                        <div>
                          <div className={`text-[10px] font-medium uppercase tracking-wider ${activeVal ? "text-white/80" : "text-[#8E5AB5]"}`}>
                            {cat.label}
                          </div>
                          <div className="text-xs font-normal mt-0.5">
                            {activeVal || "All Options"}
                          </div>
                        </div>
                        <ChevronRight className={`h-4 w-4 shrink-0 ml-2 ${activeVal ? "text-white/70" : "text-[#8E5AB5]/60"}`} />
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              /* LEVEL 2: SPECIFIC CATEGORY OPTIONS LIST */
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCategoryKey(null)}
                    className="rounded-xl bg-[#DDD0EA] text-[#100B12] hover:bg-[#C8B8DD] px-3 py-1 text-xs font-medium tracking-wider uppercase flex items-center gap-1.5 cursor-pointer font-button shadow-xs"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </button>
                  <span className="text-xs font-medium text-[#8E5AB5]">
                    {selectedCatObj?.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 max-h-[320px] overflow-y-auto pr-1">
                  {selectedCatObj?.options.map((opt) => {
                    const isActive = activeFilters[selectedCatObj.key] === opt
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleFilter(selectedCatObj.key, opt)}
                        className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-normal transition-all cursor-pointer font-button ${
                          isActive
                            ? "bg-[#8E5AB5] text-white border border-[#9560BC] shadow-md"
                            : "bg-[#DDD0EA]/50 hover:bg-[#DDD0EA] text-[#100B12] border border-[#B9A6C9]/40"
                        }`}
                      >
                        <span>{opt}</span>
                        {isActive && <CheckCircle2 className="h-4 w-4 text-white shrink-0 ml-2" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* RECTANGULAR LAVENDER CUSTOMIZE TRIGGER BUTTON WITH SLIGHT CURVES */}
      <motion.button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen)
          if (isOpen) setSelectedCategoryKey(null)
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="relative flex items-center justify-center gap-2.5 rounded-lg px-5 py-3 shadow-xl transition-all cursor-pointer bg-[#DDD0EA] text-[#100B12] hover:bg-[#C8B8DD] font-button font-medium text-xs uppercase tracking-wider border border-[#B9A6C9]"
      >
        <SlidersHorizontal className={`h-4 w-4 text-[#100B12] transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />
        <span>{isOpen ? "Close Filters" : "Customize"}</span>

        {activeCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8E5AB5] text-[10px] font-medium text-white shadow-xs">
            {activeCount}
          </span>
        )}
      </motion.button>
    </div>
  )
}

/* ─────────────────────────────────────────────
   FILTER PILLS BAR
   ───────────────────────────────────────────── */
function FilterPills({ activeFilters, setActiveFilters }) {
  const entries = Object.entries(activeFilters)
  if (entries.length === 0) return null

  const getCatColor = (key) => filterCategories.find(c => c.key === key)?.color || "#888"

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2 mb-6"
    >
      <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
        <Filter className="h-3.5 w-3.5" /> Active Filters:
      </span>
      {entries.map(([key, value]) => (
        <motion.button
          key={key}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          onClick={() => {
            setActiveFilters(prev => {
              const next = { ...prev }
              delete next[key]
              return next
            })
          }}
          className="inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-normal shadow-sm transition hover:shadow-md hover:scale-105"
          style={{
            borderColor: getCatColor(key),
            color: getCatColor(key),
            background: `${getCatColor(key)}12`,
          }}
        >
          {filterCategories.find(c => c.key === key)?.icon} {value}
          <X className="h-3.5 w-3.5 ml-0.5 opacity-70" />
        </motion.button>
      ))}
      <button
        onClick={() => setActiveFilters({})}
        className="text-xs font-normal text-destructive hover:underline ml-1"
      >
        Clear all
      </button>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   DYNAMIC CULTURAL BACKGROUND DIRECTORY
   ───────────────────────────────────────────── */
const CULTURAL_BACKGROUNDS = {
  india: {
    image: "/images/cultural/culture-indian-mosaic.jpg",
    title: "Indian Folk Mosaic & Rajasthani Heritage",
    subtitle: "Sacred Palaces, Truck Art & Architectural Spectrum",
    coordinates: "26°55′N 75°49′E · JAIPUR · INDIA"
  },
  goa: {
    image: "/images/cultural/culture-warli.jpg",
    title: "Warli Tribal & Coastal Heritage",
    subtitle: "Traditional Folk Motifs, Palms & Sun-Drenched Culture",
    coordinates: "15°29′N 73°49′E · GOA · INDIA"
  },
  indonesia: {
    image: "/images/cultural/culture-balinese.jpg",
    title: "Wayang Balinese Mythological Art",
    subtitle: "Mossy Temples, Terraces & Island Mysticism",
    coordinates: "8°20′S 115°09′E · BALI · INDONESIA"
  },
  japan: {
    image: "/images/cultural/culture-balinese.jpg",
    title: "Traditional Japanese Zen Sanctuary",
    subtitle: "Pagodas, Cherry Gardens & Ancient Temples",
    coordinates: "35°01′N 135°46′E · KYOTO · JAPAN"
  },
  france: {
    image: "/images/cultural/culture-indian-mosaic.jpg",
    title: "Parisian Urban Elegance",
    subtitle: "Boulevards, Cafés & French Architectural Heritage",
    coordinates: "48°51′N 2°21′E · PARIS · FRANCE"
  },
  italy: {
    image: "/images/cultural/culture-indian-mosaic.jpg",
    title: "Roman Classical Heritage",
    subtitle: "Historic Cobblestone Streets & Renaissance Identity",
    coordinates: "41°54′N 12°29′E · ROME · ITALY"
  },
  greece: {
    image: "/images/cultural/culture-warli.jpg",
    title: "Cycladic Aegean Architecture",
    subtitle: "White-and-Blue Mediterranean Atmosphere",
    coordinates: "36°23′N 25°26′E · SANTORINI · GREECE"
  },
  egypt: {
    image: "/images/cultural/culture-warli.jpg",
    title: "Ancient Nile & Nubian Heritage",
    subtitle: "Pyramids, Monuments & Warm Desert Culture",
    coordinates: "29°58′N 31°07′E · CAIRO · EGYPT"
  },
  default: {
    image: "/images/cultural/culture-indian-mosaic.jpg",
    title: "Global Cultural Gateway",
    subtitle: "Immersive Architectural Spectrum Across 42 Countries",
    coordinates: "WORLD ATLAS · DISCOVER CULTURES"
  }
}

/* ─────────────────────────────────────────────
   MAIN EXPLORE WORKSPACE COMPONENT
   ───────────────────────────────────────────── */
export function ExploreWorkspace({ onBack, onSelectDestination, onNavigateView }) {
  const [hoveredId, setHoveredId] = useState(null)
  const [activeFilters, setActiveFilters] = useState({})
  const [selectedDest, setSelectedDest] = useState(null)
  const [panelPosition, setPanelPosition] = useState("right")

  const filteredDestinations = allDestinations.filter(dest => {
    return Object.entries(activeFilters).every(([key, value]) => {
      if (key === "bestTime") {
        // Season-range matching: check if any months overlap
        const destVal = (dest.bestTime || "").toLowerCase()
        const filterVal = value.toLowerCase()
        if (filterVal === "year round") return destVal.includes("year")
        // Extract the start month abbreviation from the filter value
        const filterStart = filterVal.split("–")[0].trim().substring(0, 3)
        return destVal.includes(filterStart)
      }
      return dest[key] === value
    })
  })

  // Auto-Changing Cultural Background Reel across uploaded photos
  const UPLOADED_CULTURAL_IMAGES = [
    "/images/cultural/culture-indian-mosaic.jpg",
    "/images/cultural/culture-warli.jpg",
    "/images/cultural/culture-balinese.jpg"
  ]
  const [autoImageIdx, setAutoImageIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setAutoImageIdx((prev) => (prev + 1) % UPLOADED_CULTURAL_IMAGES.length)
    }, 3800)
    return () => clearInterval(timer)
  }, [])

  // Determine active culture background dynamically using uploaded photos
  const activeDest = selectedDest || allDestinations.find(d => d.id === hoveredId)
  const getCultureBackground = () => {
    if (!activeDest) return CULTURAL_BACKGROUNDS.default
    const country = (activeDest.country || "").toLowerCase()
    const name = (activeDest.name || "").toLowerCase()

    if (name.includes("goa") || country.includes("goa")) return CULTURAL_BACKGROUNDS.goa
    if (name.includes("jaipur") || country.includes("jaipur") || country.includes("india")) return CULTURAL_BACKGROUNDS.india
    if (country.includes("italy") || name.includes("rome") || name.includes("venice")) return CULTURAL_BACKGROUNDS.italy
    if (country.includes("japan") || name.includes("kyoto") || name.includes("tokyo")) return CULTURAL_BACKGROUNDS.japan
    if (country.includes("france") || name.includes("paris")) return CULTURAL_BACKGROUNDS.france
    if (country.includes("greece") || name.includes("santorini")) return CULTURAL_BACKGROUNDS.greece
    if (country.includes("egypt") || name.includes("cairo")) return CULTURAL_BACKGROUNDS.egypt
    if (country.includes("indonesia") || name.includes("bali")) return CULTURAL_BACKGROUNDS.indonesia

    return CULTURAL_BACKGROUNDS.default
  }

  const activeBg = getCultureBackground()
  const activeDisplayImage = activeDest ? activeBg.image : UPLOADED_CULTURAL_IMAGES[autoImageIdx]

  const getOverlayTint = () => {
    const keys = Object.keys(activeFilters)
    if (keys.length === 0) return "transparent"
    const lastKey = keys[keys.length - 1]
    return filterCategories.find(c => c.key === lastKey)?.bgTint || "transparent"
  }

  const handleCardClick = useCallback((dest, e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cardCenterX = rect.left + rect.width / 2
    const viewportMid = window.innerWidth / 2
    setPanelPosition(cardCenterX < viewportMid ? "right" : "left")
    setSelectedDest(dest)
  }, [])

  const hasFilters = Object.keys(activeFilters).length > 0
  const trendingDests = filteredDestinations.filter(d => d.row === "trending" || !d.row)
  const hiddenDests = filteredDestinations.filter(d => d.row === "hidden")
  const escapeDests = filteredDestinations.filter(d => d.row === "escapes")

  return (
    <div className="min-h-screen bg-background pt-24 pb-32 relative overflow-x-hidden">
      {/* Travel Doodles Background */}
      <DoodleBackground />

      {/* Filter Background Overlay */}
      <AnimatePresence>
        {hasFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: getOverlayTint() }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Navigation Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onBack}
              className="rounded-xl border-border bg-background hover:bg-accent text-xs sm:text-sm font-semibold">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Overview
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-foreground text-sm">Interactive Destination Explorer</span>
          </div>
        </div>

        {/* 100% EDGE-TO-EDGE FULL-BLEED CULTURAL BACKGROUND HERO */}
        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-8 overflow-hidden min-h-[220px] sm:min-h-[260px] flex items-center justify-center border-y border-border/40 select-none">
          {/* Dynamic Auto-Changing Cultural Background Image with 800ms Crossfade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDisplayImage}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 0.52, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-0 z-0"
            >
              <img
                src={activeDisplayImage}
                alt="TripNest Cultural Explorer"
                className="h-full w-full object-cover filter brightness-[0.98] contrast-[1.05]"
              />
            </motion.div>
          </AnimatePresence>

          {/* Light Atmospheric Gradient Overlays for Clear Visibility & Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/45 to-background/80 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30 z-10 pointer-events-none" />

          {/* Integrated Heading Content */}
          <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-center md:text-left space-y-2">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl uppercase leading-[0.95] drop-shadow-xs">
              Explore the World Your Way
            </h1>

            <p className="text-xs sm:text-sm text-foreground/80 max-w-2xl font-semibold tracking-wide drop-shadow-xs">
              Hover to discover quick info petals • Click to see full details • Filter using Customize below
            </p>
          </div>
        </div>

        {/* Active Filter Pills */}
        <FilterPills activeFilters={activeFilters} setActiveFilters={setActiveFilters} />

        {/* Destinations Grid (Free-Floating Cards without Restricting White Canvas Box) */}
        <div className="py-4 space-y-4 overflow-visible">
          {filteredDestinations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Globe className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="font-heading text-lg font-bold text-foreground mb-1">No destinations match</h3>
              <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters</p>
              <Button variant="outline" onClick={() => setActiveFilters({})} className="rounded-xl font-bold">
                Clear All Filters
              </Button>
            </motion.div>
          ) : hasFilters ? (
            <DestinationRow
              destinations={filteredDestinations}
              label="Filtered Results"
              icon={<Filter className="h-4 w-4" />}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              onCardClick={handleCardClick}
            />
          ) : (
            <>
              {rowConfig.map(row => {
                const rowDests = row.key === "trending" ? (trendingDests.length > 0 ? trendingDests : filteredDestinations.slice(0, 35))
                  : row.key === "hidden" ? (hiddenDests.length > 0 ? hiddenDests : filteredDestinations.slice(35, 70))
                  : (escapeDests.length > 0 ? escapeDests : filteredDestinations.slice(70, 105))
                if (rowDests.length === 0) return null
                return (
                  <DestinationRow
                    key={row.key}
                    destinations={rowDests}
                    label={row.label}
                    icon={row.icon}
                    hoveredId={hoveredId}
                    setHoveredId={setHoveredId}
                    onCardClick={handleCardClick}
                  />
                )
              })}
            </>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedDest && (
          <DetailPanel
            destination={selectedDest}
            position={panelPosition}
            onClose={() => setSelectedDest(null)}
            onExplore={(name) => {
              setSelectedDest(null)
              onSelectDestination(name)
            }}
          />
        )}
      </AnimatePresence>

      {/* Customize Wheel */}
      <CustomizeWheel activeFilters={activeFilters} setActiveFilters={setActiveFilters} />
    </div>
  )
}
