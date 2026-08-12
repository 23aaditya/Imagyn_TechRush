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
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  Film
} from "lucide-react"
import { Button } from "@/components/ui/button"

const heroBackgrounds = [
  { src: "/images/hero-venice.jpg", alt: "Grand Canal and gondolas in Venice, Italy" },
  { src: "/images/hero-mexico.jpg", alt: "Vibrant historic colonial street in San Miguel de Allende, Mexico" },
  { src: "/images/hero-swiss.jpg", alt: "Serene Alpine lake and snow-capped mountain peaks in Switzerland" },
  { src: "/images/hero-hawamahal.jpg", alt: "Iconic Palace of Winds Hawa Mahal in Jaipur, Rajasthan" },
  { src: "/images/hero-tajmahal.jpg", alt: "Majestic Taj Mahal reflecting pool in Agra, India" },
]

// High-Resolution Editorial Travel Videos (Plays sequentially one after another)
const HERO_TRAVEL_VIDEOS = [
  {
    id: "cloudinary-video-1",
    title: "Tropical Paradise Lagoon",
    url: "https://res.cloudinary.com/dowusjxd4/video/upload/v1786104548/15058719_2560_1440_30fps_stgxzv.mp4"
  },
  {
    id: "cloudinary-video-2",
    title: "Mountain Horizon & Scenic Heights",
    url: "https://res.cloudinary.com/dowusjxd4/video/upload/v1786104542/5937512-uhd_3840_2160_25fps_hnfdea.mp4"
  },
  {
    id: "cloudinary-video-3",
    title: "Alpine Valley & Emerald Nature",
    url: "https://res.cloudinary.com/dowusjxd4/video/upload/v1786104443/20716609-uhd_3840_2160_30fps_x44ztv.mp4"
  },
  {
    id: "cloudinary-video-4",
    title: "Coastal Sunset & Golden Shores",
    url: "https://res.cloudinary.com/dowusjxd4/video/upload/v1786104407/8747385-uhd_4096_2160_30fps_sijvgc.mp4"
  },
  {
    id: "cloudinary-video-5",
    title: "Wanderlust Horizons & Serene Waters",
    url: "https://res.cloudinary.com/dowusjxd4/video/upload/v1786104324/39912-360_o5piy4.mp4"
  }
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

  // Video Playlist State (Zero-Gap Instant Playback Engine)
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0)
  const videoRefs = useRef([])

  // Instantly play active video when currentVideoIdx updates and preload all videos
  useEffect(() => {
    videoRefs.current.forEach((vEl, idx) => {
      if (!vEl) return
      if (idx === currentVideoIdx) {
        vEl.currentTime = 0
        const playPromise = vEl.play()
        if (playPromise !== undefined) {
          playPromise.catch((e) => console.log("Auto-play error:", e))
        }
      } else {
        vEl.pause()
      }
    })
  }, [currentVideoIdx])

  // Search autocomplete state
  const [query, setQuery] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const dropdownRef = useRef(null)

  // Single Range Calendar state
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [dateError, setDateError] = useState("")
  const [tripDuration, setTripDuration] = useState(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(7) // August (0-indexed)
  const [calendarYear, setCalendarYear] = useState(2026)
  const calendarRef = useRef(null)

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

  // Handle outside click for search dropdown and range calendar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false)
      }
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setIsCalendarOpen(false)
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

  const handleVideoEnded = () => {
    setCurrentVideoIdx((prev) => (prev + 1) % HERO_TRAVEL_VIDEOS.length)
  }

  const handleScrollDownToSearch = () => {
    const searchSection = document.getElementById("search-video-hero")
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: "smooth" })
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
    }
  }

  const filteredDestinations = query.trim()
    ? allDestinations.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
    : []

  const trendingDestinations = allDestinations.filter((d) => d.type === "trending")
  const popularDestinations = allDestinations.filter((d) => d.type === "popular")

  return (
    <>
      {/* 1. TOP HERO SECTION (Full 100vh) */}
      <section id="home" className="relative min-h-screen w-full overflow-hidden select-none flex flex-col justify-center items-center py-16 px-4">
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

          {/* Minimal dark overlay */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Slide indicators */}
          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
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

        {/* Hero Title & Subtext & Start Planning Button Grouped Together */}
        <div className="relative z-10 mx-auto max-w-5xl text-center space-y-5 pt-12">
          <motion.h1
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="font-serif-editorial text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.93] tracking-tight text-white drop-shadow-lg uppercase"
          >
            Journeys,<br />
            <span className="font-heading font-extrabold italic text-white lowercase">quietly</span><br />
            well-planned.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-white/90 drop-shadow-sm font-medium tracking-wide"
          >
            Explore handpicked destinations, compare realistic travel packages, and craft bespoke itineraries tailored to your pace.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="show"
            className="pt-2"
          >
            <button
              onClick={handleScrollDownToSearch}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-900 shadow-md transition-all hover:bg-white/90 focus:outline-none cursor-pointer font-button"
            >
              Start Planning
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </button>
          </motion.div>
        </div>

        {/* 1cm White Line at the very bottom of Landing Page */}
        <div className="absolute bottom-0 inset-x-0 h-3 sm:h-3.5 bg-white shadow-xs z-20" />
      </section>

      {/* 2. FULL SCREEN VIDEO SEARCH HERO SECTION (Appears smoothly on scroll down) */}
      <section id="search-video-hero" className="relative min-h-screen w-full overflow-hidden select-none flex flex-col items-center justify-center py-12 px-4 sm:px-6 space-y-6">
        
        {/* Fullscreen Video Background Playlist (Zero-Gap Instant Switch) */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          {HERO_TRAVEL_VIDEOS.map((vid, idx) => {
            const isActive = idx === currentVideoIdx
            return (
              <video
                key={vid.id}
                ref={(el) => (videoRefs.current[idx] = el)}
                src={vid.url}
                preload="auto"
                muted
                playsInline
                onEnded={handleVideoEnded}
                onError={handleVideoEnded}
                className={`absolute inset-0 h-full w-full object-cover filter brightness-[0.85] contrast-[1.08] transition-opacity duration-300 ${
                  isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
              />
            )
          })}
          {/* Minimal Dark Overlay for High Contrast Text */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/75 z-20 pointer-events-none" />
        </div>

        {/* Section Header Prompt (Tight spacing to dialogue box) */}
        <div className="relative z-20 mx-auto max-w-4xl text-center space-y-3">
          <h2 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[0.93] drop-shadow-md">
            WHERE SHOULD<br />
            <span className="font-heading font-extrabold text-white italic lowercase">we go?</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-white/80 max-w-lg mx-auto font-medium tracking-wide">
            Select your destination, travel dates, and budget to generate your day-by-day plan.
          </p>
        </div>

        {/* Interactive Search Dialogue Box (Glassmorphism Container Design) */}
        <div className="relative z-20 mx-auto w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-lg border border-white/30 bg-white/10 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl text-white"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 text-left">
              
              {/* 1. Destination Search Input with Auto-complete */}
              <div className="relative md:col-span-2" ref={dropdownRef}>
                <label className="flex cursor-text items-center gap-3 rounded-md border border-white/30 bg-white/15 backdrop-blur-xl px-4 py-3 transition-all focus-within:border-white hover:bg-white/20 shadow-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-white/20 text-white backdrop-blur-md">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Where To?</span>
                    <input
                      type="text"
                      value={query}
                      onFocus={() => setIsDropdownOpen(true)}
                      onChange={(e) => {
                        setQuery(e.target.value)
                        setIsDropdownOpen(true)
                      }}
                      placeholder="e.g. Jaipur, Goa, Manali..."
                      className="w-full bg-transparent text-sm font-semibold text-white placeholder:text-white/50 focus:outline-none"
                    />
                  </span>
                </label>

                {/* Dropdown Suggestions */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-md border border-white/25 bg-black/85 p-3 shadow-2xl backdrop-blur-2xl text-white"
                    >
                      {/* Search Matches */}
                      {query.trim() !== "" && (
                        <div className="mb-2">
                          <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60">
                            Suggestions for &quot;{query}&quot;
                          </p>
                          {filteredDestinations.length > 0 ? (
                            filteredDestinations.map((dest) => (
                              <button
                                key={dest.name}
                                onClick={() => handleSelectDestination(dest.name)}
                                className="flex w-full items-center justify-between rounded-xs px-3 py-2 text-left text-xs font-semibold text-white transition-colors hover:bg-white/15 cursor-pointer"
                              >
                                <span className="flex items-center gap-2">
                                  <MapPin className="h-3.5 w-3.5 text-amber-400" />
                                  {dest.name}
                                </span>
                                <span className="text-[10px] text-white/60">{dest.region}</span>
                              </button>
                            ))
                          ) : (
                            <p className="px-3 py-2 text-xs text-white/60">No matching destinations found.</p>
                          )}
                        </div>
                      )}

                      {/* Recently Searched */}
                      {recentSearches.length > 0 && query.trim() === "" && (
                        <div className="mb-3 border-b border-white/15 pb-2">
                          <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60">
                            Recently Searched
                          </p>
                          <div className="flex flex-wrap gap-1.5 px-2 pt-1">
                            {recentSearches.map((item) => (
                              <button
                                key={item}
                                onClick={() => handleSelectDestination(item)}
                                className="rounded-xs bg-white/10 px-3 py-1 text-xs font-medium text-white hover:bg-white/20 transition-colors cursor-pointer"
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Trending Suggestions */}
                      {query.trim() === "" && (
                        <div className="mb-3 border-b border-white/15 pb-2">
                          <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60">
                            Trending Destinations
                          </p>
                          {trendingDestinations.map((dest) => (
                            <button
                              key={dest.name}
                              onClick={() => handleSelectDestination(dest.name)}
                              className="flex w-full items-center justify-between rounded-xs px-3 py-1.5 text-left text-xs font-medium text-white transition-colors hover:bg-white/15 cursor-pointer"
                            >
                              <span className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-amber-500" />
                                {dest.name}
                              </span>
                              <span className="text-[10px] text-white/60">{dest.region}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Popular Suggestions */}
                      {query.trim() === "" && (
                        <div>
                          <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60">
                            Popular Choices
                          </p>
                          {popularDestinations.slice(0, 4).map((dest) => (
                            <button
                              key={dest.name}
                              onClick={() => handleSelectDestination(dest.name)}
                              className="flex w-full items-center justify-between rounded-xs px-3 py-1.5 text-left text-xs font-medium text-white transition-colors hover:bg-white/15 cursor-pointer"
                            >
                              <span className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-sky-400" />
                                {dest.name}
                              </span>
                              <span className="text-[10px] text-white/60">{dest.region}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Single Range Calendar Input & Dropdown */}
              <div className="md:col-span-2 relative" ref={calendarRef}>
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="w-full h-full flex flex-col justify-center text-left rounded-md border border-white/30 bg-white/15 backdrop-blur-xl px-3.5 py-2.5 transition-all hover:bg-white/20 shadow-sm cursor-pointer"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 flex items-center justify-between">
                    <span>Travel Dates</span>
                    <Calendar className="h-3.5 w-3.5 text-white/70" />
                  </span>
                  <div className="text-xs font-semibold text-white mt-0.5 truncate">
                    {fromDate && toDate ? (
                      <span>
                        {new Date(fromDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {new Date(toDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        {tripDuration ? ` (${tripDuration} Days)` : ""}
                      </span>
                    ) : fromDate ? (
                      <span>{new Date(fromDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} → Select End Date</span>
                    ) : (
                      <span className="text-white/60">dd-mm-yyyy → dd-mm-yyyy</span>
                    )}
                  </div>
                </button>

                {/* Range Calendar Modal Dropdown */}
                <AnimatePresence>
                  {isCalendarOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-neutral-200 bg-white p-4 shadow-2xl text-neutral-900 select-none min-w-[280px]"
                    >
                      {/* Month Header Navigation */}
                      <div className="flex items-center justify-between mb-3 border-b border-neutral-200 pb-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (calendarMonth === 0) {
                              setCalendarMonth(11)
                              setCalendarYear((prev) => prev - 1)
                            } else {
                              setCalendarMonth((prev) => prev - 1)
                            }
                          }}
                          className="p-1 rounded-md hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                          {new Date(calendarYear, calendarMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (calendarMonth === 11) {
                              setCalendarMonth(0)
                              setCalendarYear((prev) => prev + 1)
                            } else {
                              setCalendarMonth((prev) => prev + 1)
                            }
                          }}
                          className="p-1 rounded-md hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Day Name Labels */}
                      <div className="grid grid-cols-7 text-center text-[10px] font-bold text-neutral-400 mb-2">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                          <span key={d}>{d}</span>
                        ))}
                      </div>

                      {/* Days Grid */}
                      <div className="grid grid-cols-7 gap-y-1">
                        {/* Empty padding cells for first day of month */}
                        {Array.from({ length: new Date(calendarYear, calendarMonth, 1).getDay() }).map((_, i) => (
                          <div key={`pad-${i}`} />
                        ))}

                        {/* Month Days */}
                        {Array.from({ length: new Date(calendarYear, calendarMonth + 1, 0).getDate() }, (_, i) => i + 1).map((dayNum) => {
                          const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`
                          const isStart = dateStr === fromDate
                          const isEnd = dateStr === toDate
                          const inRange = fromDate && toDate && dateStr > fromDate && dateStr < toDate

                          return (
                            <button
                              key={dayNum}
                              type="button"
                              onClick={() => {
                                if (!fromDate || (fromDate && toDate)) {
                                  setFromDate(dateStr)
                                  setToDate("")
                                } else {
                                  if (dateStr < fromDate) {
                                    setFromDate(dateStr)
                                    setToDate("")
                                  } else {
                                    setToDate(dateStr)
                                  }
                                }
                              }}
                              className={`py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                                isStart && isEnd
                                  ? "bg-neutral-900 text-white font-black rounded-md shadow-sm"
                                  : isStart
                                  ? "bg-neutral-900 text-white font-black rounded-l-md shadow-sm"
                                  : isEnd
                                  ? "bg-neutral-900 text-white font-black rounded-r-md shadow-sm"
                                  : inRange
                                  ? "bg-neutral-100 text-neutral-900 font-bold"
                                  : "hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 rounded-md"
                              }`}
                            >
                              {dayNum}
                            </button>
                          )
                        })}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between border-t border-neutral-200 pt-2.5 mt-3">
                        <button
                          type="button"
                          onClick={() => {
                            setFromDate("")
                            setToDate("")
                          }}
                          className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCalendarOpen(false)}
                          className="rounded-md bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-bold px-3.5 py-1.5 cursor-pointer transition-colors shadow-xs"
                        >
                          Done
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. Budget Picker in INR */}
              <div className="md:col-span-2">
                <label className="flex cursor-pointer flex-col justify-center rounded-md border border-white/30 bg-white/15 backdrop-blur-xl px-3.5 py-2.5 transition-all focus-within:border-white hover:bg-white/20 shadow-sm">
                  <span className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white/80">
                    <span>Budget (₹)</span>
                    {selectedBudget === "Custom" && (
                      <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">Custom</span>
                    )}
                  </span>

                  {selectedBudget === "Custom" ? (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs font-bold text-amber-400">₹</span>
                      <input
                        type="number"
                        placeholder="e.g. 25000"
                        value={customBudgetInput}
                        onChange={(e) => setCustomBudgetInput(e.target.value)}
                        className="w-full bg-transparent text-xs font-bold text-white focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedBudget("Any budget")}
                        className="text-[10px] text-white/60 hover:text-white underline cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  ) : (
                    <select
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      className="w-full cursor-pointer bg-transparent text-xs font-semibold text-white focus:outline-none"
                    >
                      <option value="Any budget" className="bg-neutral-900 text-white">Any Budget</option>
                      <option value="Under ₹5,000" className="bg-neutral-900 text-white">Under ₹5,000</option>
                      <option value="₹5,000 – ₹15,000" className="bg-neutral-900 text-white">₹5,000 – ₹15,000</option>
                      <option value="₹15,000 – ₹35,000" className="bg-neutral-900 text-white">₹15,000 – ₹35,000</option>
                      <option value="₹35,000+" className="bg-neutral-900 text-white">₹35,000+</option>
                      <option value="Custom" className="bg-neutral-900 font-bold text-amber-400">Enter Custom Budget (₹)...</option>
                    </select>
                  )}
                </label>
              </div>

              {/* 4. Travel Type */}
              <div className="md:col-span-2">
                <label className="flex cursor-pointer flex-col justify-center rounded-md border border-white/20 bg-white/10 px-3.5 py-2.5 transition-colors focus-within:border-white hover:bg-white/15">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                    Travel Type
                  </span>
                  <select className="w-full cursor-pointer bg-transparent text-xs font-semibold text-white focus:outline-none">
                    <option className="bg-neutral-900 text-white">Any Type</option>
                    <option className="bg-neutral-900 text-white">Solo</option>
                    <option className="bg-neutral-900 text-white">Couple</option>
                    <option className="bg-neutral-900 text-white">Family</option>
                    <option className="bg-neutral-900 text-white">Friends</option>
                  </select>
                </label>
              </div>

            </div>

            {/* Validation & Duration Display */}
            {dateError && (
              <div className="mt-3 flex items-center gap-2 rounded-sm bg-rose-500/20 border border-rose-500/30 p-2.5 text-xs text-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{dateError}</span>
              </div>
            )}

            {tripDuration && !dateError && (
              <div className="mt-3 flex items-center gap-2 rounded-sm bg-emerald-500/20 border border-emerald-500/30 p-2.5 text-xs font-semibold text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Trip Duration Calculated: {tripDuration} {tripDuration === 1 ? "Day" : "Days"}</span>
              </div>
            )}

            {/* Submit CTA */}
            <Button
              onClick={() => {
                const targetDest = query.trim()
                onStartPlanning?.("itinerary", targetDest)
              }}
              className="mt-5 h-11 w-full rounded-xl bg-white text-neutral-900 text-xs font-semibold uppercase tracking-wider shadow-sm hover:bg-white/90 transition-all cursor-pointer font-button"
            >
              <Search className="mr-1.5 h-4 w-4 text-[#00356B]" />
              Plan Itinerary
            </Button>
          </motion.div>
        </div>

      </section>
    </>
  )
}
