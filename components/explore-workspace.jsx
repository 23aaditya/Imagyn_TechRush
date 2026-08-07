"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import destinationsData from "@/destinations_105.json"

/* ─────────────────────────────────────────────
   105 DESTINATIONS (DYNAMICAL IMPORT FROM JSON)
   ───────────────────────────────────────────── */
const allDestinations = destinationsData.map((d, index) => ({
  ...d,
  id: `${d.id || d.name.toLowerCase().replace(/\s+/g, '-')}-${index}`
}))

/* ─────────────────────────────────────────────
   FILTER CATEGORIES & OPTIONS
   ───────────────────────────────────────────── */
const filterCategories = [
  {
    key: "weather", label: "Weather", icon: "☀️",
    options: ["Summers", "Winters", "Monsoon"],
    color: "#F59E0B", bgTint: "rgba(245,158,11,0.06)"
  },
  {
    key: "company", label: "Company", icon: "👥",
    options: ["Friends", "Family", "Solo"],
    color: "#3B82F6", bgTint: "rgba(59,130,246,0.06)"
  },
  {
    key: "mood", label: "Mood", icon: "🎭",
    options: ["Party", "Relax", "Adventure"],
    color: "#A855F7", bgTint: "rgba(168,85,247,0.06)"
  },
  {
    key: "budget", label: "Budget", icon: "💰",
    options: ["Economy", "Luxury"],
    color: "#10B981", bgTint: "rgba(16,185,129,0.06)"
  },
  {
    key: "type", label: "Type", icon: "🏔️",
    options: ["Mountains", "Beach", "Road Trips"],
    color: "#14B8A6", bgTint: "rgba(20,184,166,0.06)"
  },
]

/* ─────────────────────────────────────────────
   PETAL INFO CONFIG
   ───────────────────────────────────────────── */
const petalConfig = [
  { key: "minDays", label: "Duration", angle: -90, distance: 148 },
  { key: "mood", label: "Vibe", angle: -30, distance: 154 },
  { key: "specialty", label: "Highlight", angle: 30, distance: 154 },
  { key: "weather", label: "Best Season", angle: 90, distance: 148 },
  { key: "budget", label: "Budget", angle: 150, distance: 154 },
  { key: "company", label: "Ideal For", angle: 210, distance: 154 },
]

/* ─────────────────────────────────────────────
   ROW DEFINITIONS
   ───────────────────────────────────────────── */
const rowConfig = [
  { key: "trending", label: "Trending Picks", icon: <TrendingUp className="h-4 w-4" /> },
  { key: "hidden", label: "Hidden Gems", icon: <Gem className="h-4 w-4" /> },
  { key: "escapes", label: "International Escapes", icon: <Plane className="h-4 w-4" /> },
]

/* ─────────────────────────────────────────────
   SCROLLABLE ROW COMPONENT
   ───────────────────────────────────────────── */
function DestinationRow({ destinations, label, icon, hoveredId, setHoveredId, onCardClick }) {
  const scrollRef = useRef(null)
  const handleScroll = (dir) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === "left" ? -380 : 380, behavior: "smooth" })
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3 px-2">
        <h3 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            {icon}
          </span>
          {label}
          <span className="ml-2 text-xs font-normal text-muted-foreground">({destinations.length})</span>
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={() => handleScroll("left")} aria-label="Scroll left"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md transition-all hover:bg-emerald-500 hover:text-white hover:scale-105">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => handleScroll("right")} aria-label="Scroll right"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md transition-all hover:bg-emerald-500 hover:text-white hover:scale-105">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div ref={scrollRef}
        className="flex items-start gap-8 overflow-x-auto overflow-y-visible pt-4 pb-6 px-4 explore-scrollbar-hide"
        style={{ scrollbarWidth: "none" }}>
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
      <AnimatePresence mode="wait">
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
                className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-2xl min-w-[80px] px-3 py-2 backdrop-blur-2xl text-center"
                style={{
                  boxShadow: `0 12px 30px rgba(0,0,0,0.18), 0 0 0 1px ${item.color || "#10B981"}30`,
                }}
              >
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block leading-none">
                  {petal.label}
                </span>
                <span className="text-xs font-extrabold text-[#0D2B45] mt-1 whitespace-nowrap max-w-[85px] truncate block leading-tight">
                  {getPetalValue(petal.key)}
                </span>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Arch Shaped Image Card */}
      <motion.div
        animate={{ scale: isHovered ? 1.08 : 1, y: isHovered ? -6 : 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="relative"
      >
        <div
          className="h-64 w-48 sm:h-72 sm:w-52 rounded-t-[999px] rounded-b-2xl p-[4px] transition-all duration-500 shadow-xl relative"
          style={{
            background: isHovered
              ? `linear-gradient(135deg, ${item.color || "#10B981"}, ${item.color || "#10B981"}99, ${item.color || "#10B981"}44)`
              : "var(--border)",
            boxShadow: isHovered
              ? `0 15px 45px ${(item.color || "#10B981")}50, 0 0 75px ${(item.color || "#10B981")}25`
              : "0 8px 28px rgba(0,0,0,0.1)",
          }}
        >
          <div className="h-full w-full overflow-hidden rounded-t-[999px] rounded-b-xl relative bg-neutral-900">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          {/* Temperature badge */}
          <span
            className="absolute top-2 right-2 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold text-white shadow-xl border border-white/40 z-10"
            style={{ background: item.color || "#10B981" }}
          >
            <CloudSun className="h-3.5 w-3.5" />
            {item.temp || "25°C"}
          </span>
        </div>
      </motion.div>

      {/* Name & Subtitle Below the Shape */}
      <div className="mt-3 text-center relative z-10">
        <h4
          className="font-heading text-base sm:text-lg font-extrabold transition-colors"
          style={{ color: isHovered ? (item.color || "#10B981") : "var(--foreground)" }}
        >
          {item.name}
        </h4>
        <p className="text-xs text-muted-foreground font-medium mt-0.5">{item.subtitle}</p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   DETAIL PANEL
   ───────────────────────────────────────────── */
function DetailPanel({ destination, position, onClose, onExplore }) {
  const isRight = position === "right"

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={onClose} />

      {/* Panel */}
      <motion.div
        initial={{ x: isRight ? 450 : -450, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: isRight ? 450 : -450, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className={`relative z-10 w-full max-w-md mx-4 ${isRight ? "ml-auto mr-8" : "ml-8 mr-auto"}`}
      >
        <div className="rounded-3xl border border-border/80 bg-background/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* Image Banner */}
          <div className="relative h-48 overflow-hidden">
            <img src={destination.image} alt={destination.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            
            {/* Working Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onClose()
              }}
              aria-label="Close detail panel"
              className="absolute top-3 right-3 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black/90 hover:scale-110 active:scale-95 cursor-pointer border border-white/20 shadow-xl"
            >
              <X className="h-5 w-5 stroke-[2.5]" />
            </button>

            <div className="absolute bottom-3 left-4">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full mb-1"
                style={{ background: `${destination.color || "#10B981"}30`, color: destination.color || "#10B981" }}>
                {destination.country}
              </span>
              <h3 className="font-heading text-2xl font-bold text-foreground">{destination.name}</h3>
              <p className="text-sm text-muted-foreground">{destination.subtitle}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-xs text-muted-foreground leading-relaxed mb-5">{destination.description}</p>

            {/* Key Details Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {[
                { icon: <Users className="h-4 w-4" />, label: "Age Group", value: destination.ageGroup || "All Ages", color: "var(--primary)" },
                { icon: <HeartHandshake className="h-4 w-4" />, label: "Vibe", value: destination.vibe || "Culture", color: destination.color || "#10B981" },
                { icon: <Clock className="h-4 w-4" />, label: "Best Season", value: destination.bestTime || "All Year", color: "#F59E0B" },
                { icon: <Coins className="h-4 w-4" />, label: "Budget", value: destination.startingBudget || "₹8,500", color: "#10B981" },
              ].map((detail, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-3 text-center">
                  <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: `${detail.color}15`, color: detail.color }}>
                    {detail.icon}
                  </div>
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{detail.label}</span>
                  <span className="mt-0.5 block text-xs font-extrabold text-foreground truncate">{detail.value}</span>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-around rounded-xl bg-secondary/60 p-3 mb-5 text-center">
              {[
                { value: destination.attractions || 25, label: "Attractions" },
                { value: destination.hotels || 40, label: "Hotels" },
                { value: destination.foodSpots || 30, label: "Food" },
                { value: destination.itineraryIdeas || 12, label: "Itineraries" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="font-extrabold text-foreground text-sm">{stat.value}</span>
                  <span className="text-muted-foreground text-[10px] font-medium">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Button onClick={() => onExplore(destination.name)}
              className="w-full rounded-xl py-3 font-bold text-white shadow-xl transition hover:opacity-95"
              style={{ background: destination.color || "#10B981", boxShadow: `0 8px 24px ${destination.color || "#10B981"}35` }}>
              Explore {destination.name}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
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
  const [expandedCategory, setExpandedCategory] = useState(null)
  const autoCloseTimerRef = useRef(null)

  const toggleFilter = (key, value) => {
    setActiveFilters(prev => {
      const next = { ...prev }
      if (next[key] === value) {
        delete next[key]
      } else {
        next[key] = value
      }
      return next
    })
  }

  const handleCategoryClick = (catKey) => {
    setExpandedCategory(expandedCategory === catKey ? null : catKey)
  }

  const activeCount = Object.keys(activeFilters).length

  useEffect(() => {
    if (isOpen) {
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current)
      autoCloseTimerRef.current = setTimeout(() => {
        setIsOpen(false)
        setExpandedCategory(null)
      }, 4000)
    }
    return () => {
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current)
    }
  }, [isOpen, activeFilters, expandedCategory])

  const fanAngles = [-88, -66, -44, -22, 0]

  return (
    <div className="fixed bottom-8 left-8 sm:bottom-10 sm:left-10 z-40">
      <AnimatePresence>
        {isOpen && (
          <>
            {filterCategories.map((cat, i) => {
              const angleDeg = fanAngles[i]
              const rad = (angleDeg * Math.PI) / 180
              const distance = 150
              const x = Math.cos(rad) * distance
              const y = Math.sin(rad) * distance
              const isExpanded = expandedCategory === cat.key

              return (
                <motion.div
                  key={cat.key}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{ opacity: 1, x, y, scale: 1 }}
                  exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.8, delay: i * 0.04 }}
                  className="absolute bottom-0 left-0"
                  style={{ zIndex: isExpanded ? 60 : 50 }}
                >
                  <AnimatePresence>
                    {isExpanded && cat.options.map((opt, j) => {
                      const offsetAngle = (j - (cat.options.length - 1) / 2) * 38
                      const subRad = ((angleDeg + offsetAngle) * Math.PI) / 180
                      const subDist = 72
                      const sx = Math.cos(subRad) * subDist
                      const sy = Math.sin(subRad) * subDist
                      const isActive = activeFilters[cat.key] === opt

                      return (
                        <motion.button
                          key={opt}
                          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                          animate={{ opacity: 1, x: sx, y: sy, scale: 1 }}
                          exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                          transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.7, delay: j * 0.05 }}
                          onClick={(e) => { e.stopPropagation(); toggleFilter(cat.key, opt) }}
                          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-extrabold border-2 whitespace-nowrap transition-all duration-200 ${
                            isActive
                              ? "text-white scale-110 shadow-xl"
                              : "text-gray-800 bg-white/95 hover:scale-105 shadow-md"
                          }`}
                          style={{
                            borderColor: isActive ? cat.color : "rgba(200,200,220,0.5)",
                            background: isActive ? `linear-gradient(135deg, ${cat.color}, ${cat.color}dd)` : "rgba(255, 255, 255, 0.95)",
                            boxShadow: isActive ? `0 6px 20px ${cat.color}45` : "0 4px 14px rgba(0,0,0,0.1)",
                          }}
                        >
                          {opt}
                        </motion.button>
                      )
                    })}
                  </AnimatePresence>

                  <button
                    onClick={() => handleCategoryClick(cat.key)}
                    className="flex flex-col items-center justify-center rounded-t-[999px] rounded-b-md h-[58px] w-[46px] border-2 shadow-2xl transition-all duration-300 hover:scale-110 bg-white/95"
                    style={{
                      borderColor: activeFilters[cat.key] ? cat.color : "rgba(200,200,220,0.6)",
                      background: activeFilters[cat.key]
                        ? `linear-gradient(135deg, ${cat.color}, ${cat.color}cc)`
                        : "rgba(255, 255, 255, 0.95)",
                      boxShadow: activeFilters[cat.key]
                        ? `0 6px 24px ${cat.color}40`
                        : "0 6px 20px rgba(0,0,0,0.12)",
                      color: activeFilters[cat.key] ? "white" : "#444",
                    }}
                  >
                    <span className="text-sm leading-none">{cat.icon}</span>
                    <span className="text-[9px] font-black mt-0.5" style={{ color: activeFilters[cat.key] ? "white" : cat.color }}>{cat.label}</span>
                  </button>
                </motion.div>
              )
            })}
          </>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => { setIsOpen(!isOpen); setExpandedCategory(null) }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative flex items-center justify-center gap-2.5 rounded-t-[999px] rounded-b-2xl px-7 py-3.5 shadow-2xl border border-white/30 transition-all cursor-pointer bg-[#0D2B45] text-white hover:bg-[#0D2B45]/90"
        style={{
          boxShadow: "0 15px 35px rgba(13,43,69,0.5), 0 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        <SlidersHorizontal className={`h-4.5 w-4.5 text-white transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />
        <span className="font-heading text-xs font-extrabold uppercase tracking-widest text-white">
          {isOpen ? "Close" : "Customize"}
        </span>

        {activeCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-white shadow-md ring-2 ring-white ml-0.5">
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
      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
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
          className="inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-bold shadow-sm transition hover:shadow-md hover:scale-105"
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
        className="text-xs font-bold text-destructive hover:underline ml-1"
      >
        Clear all
      </button>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   MAIN EXPLORE WORKSPACE COMPONENT
   ───────────────────────────────────────────── */
export function ExploreWorkspace({ onBack, onSelectDestination }) {
  const [hoveredId, setHoveredId] = useState(null)
  const [activeFilters, setActiveFilters] = useState({})
  const [selectedDest, setSelectedDest] = useState(null)
  const [panelPosition, setPanelPosition] = useState("right")

  const filteredDestinations = allDestinations.filter(dest => {
    return Object.entries(activeFilters).every(([key, value]) => dest[key] === value)
  })

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
    <div className="min-h-screen bg-background pt-24 pb-32 relative">
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
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onBack}
              className="rounded-xl border-border bg-background hover:bg-accent text-xs sm:text-sm font-semibold">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Overview
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-foreground text-sm">Interactive Destination Explorer</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Globe className="h-3.5 w-3.5" />
            {filteredDestinations.length} Destinations
          </span>
        </div>

        {/* Section Heading */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Explore the World{" "}
            <span className="font-serif italic text-emerald-600 dark:text-emerald-400 font-normal">Your Way</span>
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-2xl font-medium">
            Hover to discover quick info petals • Click to see full details • Filter using Customize below
          </p>
        </div>

        {/* Active Filter Pills */}
        <FilterPills activeFilters={activeFilters} setActiveFilters={setActiveFilters} />

        {/* Destinations Grid */}
        <div className="rounded-3xl border border-border/80 bg-gradient-to-b from-card/80 to-card p-6 shadow-xl backdrop-blur-xl overflow-visible">
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
