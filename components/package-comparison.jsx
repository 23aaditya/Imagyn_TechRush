"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  X,
  ArrowRightLeft,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Compass,
  DollarSign,
  Hotel,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"

// High-Quality French Luxury Hotel / Nike Editorial Travel Video Playlist
const CINEMATIC_VIDEOS = [
  {
    title: "Côte d'Azur French Riviera Villa",
    location: "Monaco & Nice, France",
    url: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-resort-and-the-ocean-43282-large.mp4"
  },
  {
    title: "Chamonix Alpine Heights & Pine Mist",
    location: "French Alps, France",
    url: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-snow-capped-mountains-43265-large.mp4"
  },
  {
    title: "St. Tropez Private Beach & Yacht Haven",
    location: "Provence-Alpes-Côte d'Azur",
    url: "https://assets.mixkit.co/videos/preview/mixkit-resort-swimming-pool-and-palm-trees-43283-large.mp4"
  },
  {
    title: "Parisian Golden Hour & Seine Waters",
    location: "Paris, France",
    url: "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-coastal-city-at-sunset-43279-large.mp4"
  }
]

const destinationPackages = {
  "Lonavala": {
    country: "Maharashtra, India",
    vibe: "Monsoon Mist & HillForts",
    rating: "4.7 ⭐",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=700&auto=format&fit=crop&q=80",
    budget: { total: "₹15,000", numericTotal: 15000, transport: "₹3,500", food: "₹4,000", activities: "₹2,500", stay: "₹5,000" },
    stay: { fiveStar: true, threeStar: true, hostel: true, budgetStay: true },
    experience: {
      activities: ["Fort trekking", "Waterfall viewing", "Karla Caves", "Chikki tasting"],
      bestSeason: "Monsoon & Winter (Jul – Feb)",
      duration: "2–3 Days",
      crowdLevel: "Moderate (High Weekends)",
      idealTraveler: "Weekend Explorers & Couples",
      valueScore: 92
    }
  },
  "Manali": {
    country: "Himachal Pradesh, India",
    vibe: "Snowy Peaks & Alpine Valleys",
    rating: "4.9 ⭐",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=700&auto=format&fit=crop&q=80",
    budget: { total: "₹25,000", numericTotal: 25000, transport: "₹7,500", food: "₹6,000", activities: "₹4,500", stay: "₹7,000" },
    stay: { fiveStar: true, threeStar: true, hostel: true, budgetStay: true },
    experience: {
      activities: ["Snow sports", "Solang paragliding", "Beas river rafting", "Old Manali cafes"],
      bestSeason: "Oct – May (Snow Season)",
      duration: "4–5 Days",
      crowdLevel: "High (Peak Season)",
      idealTraveler: "Adventurers & Honeymooners",
      valueScore: 96
    }
  },
  "Goa": {
    country: "Goa, India",
    vibe: "Sun, Sand & Portuguese Heritage",
    rating: "4.8 ⭐",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&auto=format&fit=crop&q=80",
    budget: { total: "₹22,000", numericTotal: 22000, transport: "₹5,500", food: "₹6,500", activities: "₹4,000", stay: "₹6,000" },
    stay: { fiveStar: true, threeStar: true, hostel: true, budgetStay: true },
    experience: {
      activities: ["Baga water sports", "Cliffside shacks", "Sunset cruise", "Latin Quarter walk"],
      bestSeason: "Nov – Feb (Beach Season)",
      duration: "4–5 Days",
      crowdLevel: "High",
      idealTraveler: "Friends & Nightlife Enthusiasts",
      valueScore: 94
    }
  },
  "Kerala": {
    country: "Kerala, India",
    vibe: "Emerald Backwaters & Tea Gardens",
    rating: "4.9 ⭐",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700&auto=format&fit=crop&q=80",
    budget: { total: "₹28,000", numericTotal: 28000, transport: "₹6,000", food: "₹7,000", activities: "₹5,000", stay: "₹10,000" },
    stay: { fiveStar: true, threeStar: true, hostel: false, budgetStay: true },
    experience: {
      activities: ["Houseboat cruise", "Tea estate walk", "Spice plantation", "Ayurvedic spa"],
      bestSeason: "Sep – Mar",
      duration: "5–6 Days",
      crowdLevel: "Moderate",
      idealTraveler: "Families & Honeymooners",
      valueScore: 95
    }
  },
  "Jaipur": {
    country: "Rajasthan, India",
    vibe: "Palaces, Forts & Royal Culture",
    rating: "4.8 ⭐",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=700&auto=format&fit=crop&q=80",
    budget: { total: "₹18,000", numericTotal: 18000, transport: "₹4,500", food: "₹5,000", activities: "₹3,500", stay: "₹5,000" },
    stay: { fiveStar: true, threeStar: true, hostel: true, budgetStay: true },
    experience: {
      activities: ["Amber Fort light show", "Hawa Mahal view", "Johari Bazaar shopping", "Heritage dining"],
      bestSeason: "Oct – Mar",
      duration: "3–4 Days",
      crowdLevel: "Moderate to High",
      idealTraveler: "Culture & History Lovers",
      valueScore: 91
    }
  },
  "Udaipur": {
    country: "Rajasthan, India",
    vibe: "Romantic Lakes & City Palaces",
    rating: "4.9 ⭐",
    image: "https://images.unsplash.com/photo-1603201667141-5a2d4c673378?w=700&auto=format&fit=crop&q=80",
    budget: { total: "₹24,000", numericTotal: 24000, transport: "₹5,000", food: "₹6,000", activities: "₹4,000", stay: "₹9,000" },
    stay: { fiveStar: true, threeStar: true, hostel: true, budgetStay: true },
    experience: {
      activities: ["Lake Pichola boat cruise", "City Palace tour", "Rooftop lake view dining", "Dharohar dance"],
      bestSeason: "Oct – Mar",
      duration: "3–4 Days",
      crowdLevel: "Moderate",
      idealTraveler: "Romantic Couples & Luxury Travelers",
      valueScore: 93
    }
  }
}

const availableDestinations = Object.keys(destinationPackages)

export function PackageComparison({ onNavigateView, onSelectDestination }) {
  const [destA, setDestA] = useState("Lonavala")
  const [destB, setDestB] = useState("Manali")
  const [activeTab, setActiveTab] = useState("all")
  
  // Cinematic Video Carousel State
  const [videoIndex, setVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef(null)

  // Auto-transition videos every 15 seconds
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setVideoIndex((prev) => (prev + 1) % CINEMATIC_VIDEOS.length)
    }, 15000)
    return () => clearInterval(timer)
  }, [isPlaying])

  const pkgA = destinationPackages[destA]
  const pkgB = destinationPackages[destB]

  const swapDestinations = () => {
    setDestA(destB)
    setDestB(destA)
  }

  const isCheaper = pkgA.budget.numericTotal < pkgB.budget.numericTotal

  return (
    <section id="packages" className="relative w-full min-h-screen py-20 md:py-28 bg-neutral-950 text-white overflow-hidden select-none font-sans">
      
      {/* 1. FRENCH LUXURY / NIKE EDITORIAL VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={videoIndex}
            initial={{ opacity: 0, scale: 1.0 }}
            animate={{ opacity: 1, scale: 1.04 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full"
          >
            <video
              ref={videoRef}
              src={CINEMATIC_VIDEOS[videoIndex].url}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover filter brightness-100 contrast-105 saturate-[1.25] opacity-100"
            />
          </motion.div>
        </AnimatePresence>

        {/* ELEGANT MINIMALIST OVERLAYS (Lightened for +50% Background Opacity) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/45 z-10" />
      </div>

      {/* 2. MAIN EDITORIAL CONTENT */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 md:px-6 space-y-12">
        
        {/* Editorial Top Sub-Bar */}
        <div className="flex items-center justify-between border-b border-white/15 pb-4">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
            <span className="font-heading text-xs font-bold uppercase tracking-widest text-white/90">
              {CINEMATIC_VIDEOS[videoIndex].title} • {CINEMATIC_VIDEOS[videoIndex].location}
            </span>
          </div>

          <span className="font-heading text-xs font-extrabold uppercase tracking-widest text-white/60">
            Editorial Collection 2026
          </span>
        </div>

        {/* Main Nike-Style Bold Header */}
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl uppercase text-white leading-none drop-shadow-2xl"
          >
            Compare Packages
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-sans text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow"
          >
            Realistic trip costs, luxury stay choices, and travel experiences side-by-side.
          </motion.p>
        </div>

        {/* 3. FORMAL EDITORIAL DESTINATION COMPARISON CARDS */}
        <div className="grid gap-6 md:grid-cols-12 items-center">
          
          {/* Destination A Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-5 rounded-2xl border border-white/20 bg-black/60 backdrop-blur-2xl p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-heading text-[11px] font-extrabold uppercase tracking-widest text-white/70">
                DESTINATION A
              </span>
              <span className="font-sans text-xs font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                {pkgA.rating}
              </span>
            </div>

            <select
              value={destA}
              onChange={(e) => setDestA(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-neutral-900 p-3.5 font-heading text-xl font-extrabold text-white uppercase outline-none focus:border-white cursor-pointer shadow-inner"
            >
              {availableDestinations.map((d) => (
                <option key={`a-${d}`} value={d} disabled={d === destB} className="bg-neutral-950 text-white font-sans text-base">
                  {d} — {destinationPackages[d].country}
                </option>
              ))}
            </select>

            <div className="relative h-48 w-full rounded-xl overflow-hidden border border-white/15">
              <img
                src={pkgA.image}
                alt={destA}
                className="h-full w-full object-cover filter brightness-[0.9]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-5 flex flex-col justify-end">
                <span className="font-sans text-xs font-semibold text-white/80 uppercase tracking-wider">{pkgA.vibe}</span>
                <h3 className="font-heading text-2xl font-extrabold text-white uppercase">{destA}</h3>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
              <div>
                <span className="font-heading text-[10px] uppercase tracking-widest font-bold text-white/60 block">Est. Cost</span>
                <span className="font-heading text-2xl font-extrabold text-white">{pkgA.budget.total}</span>
              </div>
              <Button
                size="sm"
                onClick={() => onSelectDestination ? onSelectDestination(destA) : onNavigateView("itinerary", destA)}
                className="rounded-lg bg-white hover:bg-white/90 text-black font-heading font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 shadow-lg"
              >
                Plan {destA}
              </Button>
            </div>
          </motion.div>

          {/* Swap Divider Button */}
          <div className="md:col-span-2 flex flex-col items-center justify-center py-2">
            <button
              type="button"
              onClick={swapDestinations}
              className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white hover:text-black transition-all"
              title="Swap Destinations"
            >
              <ArrowRightLeft className="h-5 w-5 text-white group-hover:text-black transition-colors" />
            </button>
            <span className="mt-2 font-heading text-[10px] font-extrabold text-white/60 tracking-widest uppercase">VS</span>
          </div>

          {/* Destination B Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-5 rounded-2xl border border-white/20 bg-black/60 backdrop-blur-2xl p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-heading text-[11px] font-extrabold uppercase tracking-widest text-white/70">
                DESTINATION B
              </span>
              <span className="font-sans text-xs font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                {pkgB.rating}
              </span>
            </div>

            <select
              value={destB}
              onChange={(e) => setDestB(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-neutral-900 p-3.5 font-heading text-xl font-extrabold text-white uppercase outline-none focus:border-white cursor-pointer shadow-inner"
            >
              {availableDestinations.map((d) => (
                <option key={`b-${d}`} value={d} disabled={d === destA} className="bg-neutral-950 text-white font-sans text-base">
                  {d} — {destinationPackages[d].country}
                </option>
              ))}
            </select>

            <div className="relative h-48 w-full rounded-xl overflow-hidden border border-white/15">
              <img
                src={pkgB.image}
                alt={destB}
                className="h-full w-full object-cover filter brightness-[0.9]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-5 flex flex-col justify-end">
                <span className="font-sans text-xs font-semibold text-white/80 uppercase tracking-wider">{pkgB.vibe}</span>
                <h3 className="font-heading text-2xl font-extrabold text-white uppercase">{destB}</h3>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
              <div>
                <span className="font-heading text-[10px] uppercase tracking-widest font-bold text-white/60 block">Est. Cost</span>
                <span className="font-heading text-2xl font-extrabold text-white">{pkgB.budget.total}</span>
              </div>
              <Button
                size="sm"
                onClick={() => onSelectDestination ? onSelectDestination(destB) : onNavigateView("itinerary", destB)}
                className="rounded-lg bg-white hover:bg-white/90 text-black font-heading font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 shadow-lg"
              >
                Plan {destB}
              </Button>
            </div>
          </motion.div>

        </div>

        {/* 4. FORMAL LUXURY COMPARISON MATRIX TABLE */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-white/15 pb-4">
            {[
              { id: "all", label: "Overview Matrix", icon: Compass },
              { id: "cost", label: "Cost Breakdown", icon: DollarSign },
              { id: "stay", label: "Accommodations", icon: Hotel },
              { id: "experience", label: "Travel Experience", icon: Sparkles }
            ].map((tab) => {
              const IconComp = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-heading text-xs font-extrabold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-white text-black shadow-lg shadow-white/10"
                      : "bg-white/5 border border-white/15 text-white/70 hover:bg-white/15"
                  }`}
                >
                  <IconComp className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/20 bg-black/60 backdrop-blur-2xl shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px] font-sans">
                
                <thead>
                  <tr className="border-b border-white/15 bg-white/5">
                    <th className="p-5 font-heading text-xs font-extrabold uppercase tracking-widest text-white/60 w-1/3">Factor</th>
                    <th className="p-5 font-heading text-xl font-extrabold text-white w-1/3 text-center uppercase border-l border-white/10">
                      {destA} {isCheaper && <span className="ml-2 inline-block text-[10px] bg-white/10 text-white border border-white/20 px-2 py-0.5 rounded-full font-sans font-bold">Best Value</span>}
                    </th>
                    <th className="p-5 font-heading text-xl font-extrabold text-white w-1/3 text-center uppercase border-l border-white/10">
                      {destB} {!isCheaper && <span className="ml-2 inline-block text-[10px] bg-white/10 text-white border border-white/20 px-2 py-0.5 rounded-full font-sans font-bold">Best Value</span>}
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10 text-sm">
                  
                  {/* SECTION: BUDGET */}
                  {(activeTab === "all" || activeTab === "cost") && (
                    <>
                      <tr className="bg-white/5">
                        <td colSpan={3} className="px-5 py-3 font-heading font-extrabold uppercase tracking-widest text-xs text-white/80 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" /> Cost & Budget
                        </td>
                      </tr>

                      <tr>
                        <td className="p-5 font-semibold text-white">Total Estimated Trip Cost</td>
                        <td className="p-5 font-heading font-extrabold text-white text-center text-xl border-l border-white/10">{pkgA.budget.total}</td>
                        <td className="p-5 font-heading font-extrabold text-white text-center text-xl border-l border-white/10">{pkgB.budget.total}</td>
                      </tr>
                      <tr>
                        <td className="p-5 font-medium text-white/70">Transport Expense</td>
                        <td className="p-5 text-white/90 text-center font-medium border-l border-white/10">{pkgA.budget.transport}</td>
                        <td className="p-5 text-white/90 text-center font-medium border-l border-white/10">{pkgB.budget.transport}</td>
                      </tr>
                      <tr>
                        <td className="p-5 font-medium text-white/70">Food & Dining Expense</td>
                        <td className="p-5 text-white/90 text-center font-medium border-l border-white/10">{pkgA.budget.food}</td>
                        <td className="p-5 text-white/90 text-center font-medium border-l border-white/10">{pkgB.budget.food}</td>
                      </tr>
                      <tr>
                        <td className="p-5 font-medium text-white/70">Activity & Sightseeing Expense</td>
                        <td className="p-5 text-white/90 text-center font-medium border-l border-white/10">{pkgA.budget.activities}</td>
                        <td className="p-5 text-white/90 text-center font-medium border-l border-white/10">{pkgB.budget.activities}</td>
                      </tr>
                    </>
                  )}

                  {/* SECTION: ACCOMMODATION */}
                  {(activeTab === "all" || activeTab === "stay") && (
                    <>
                      <tr className="bg-white/5">
                        <td colSpan={3} className="px-5 py-3 font-heading font-extrabold uppercase tracking-widest text-xs text-white/80 flex items-center gap-2">
                          <Hotel className="h-4 w-4" /> Stay Options
                        </td>
                      </tr>

                      <tr>
                        <td className="p-5 font-medium text-white/70">5-Star Luxury Resorts</td>
                        <td className="p-5 text-center border-l border-white/10">{renderBool(pkgA.stay.fiveStar)}</td>
                        <td className="p-5 text-center border-l border-white/10">{renderBool(pkgB.stay.fiveStar)}</td>
                      </tr>
                      <tr>
                        <td className="p-5 font-medium text-white/70">3-Star Standard Hotels</td>
                        <td className="p-5 text-center border-l border-white/10">{renderBool(pkgA.stay.threeStar)}</td>
                        <td className="p-5 text-center border-l border-white/10">{renderBool(pkgB.stay.threeStar)}</td>
                      </tr>
                      <tr>
                        <td className="p-5 font-medium text-white/70">Hostels & Backpacker Stays</td>
                        <td className="p-5 text-center border-l border-white/10">{renderBool(pkgA.stay.hostel)}</td>
                        <td className="p-5 text-center border-l border-white/10">{renderBool(pkgB.stay.hostel)}</td>
                      </tr>
                    </>
                  )}

                  {/* SECTION: EXPERIENCE */}
                  {(activeTab === "all" || activeTab === "experience") && (
                    <>
                      <tr className="bg-white/5">
                        <td colSpan={3} className="px-5 py-3 font-heading font-extrabold uppercase tracking-widest text-xs text-white/80 flex items-center gap-2">
                          <Sparkles className="h-4 w-4" /> Travel Highlights
                        </td>
                      </tr>

                      <tr>
                        <td className="p-5 font-medium text-white/70">Key Activities</td>
                        <td className="p-5 text-center border-l border-white/10">
                          <div className="flex flex-wrap justify-center gap-1.5">
                            {pkgA.experience.activities.map((act, idx) => (
                              <span key={idx} className="rounded-md bg-white/10 border border-white/15 px-2.5 py-0.5 text-xs font-semibold text-white">
                                {act}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-5 text-center border-l border-white/10">
                          <div className="flex flex-wrap justify-center gap-1.5">
                            {pkgB.experience.activities.map((act, idx) => (
                              <span key={idx} className="rounded-md bg-white/10 border border-white/15 px-2.5 py-0.5 text-xs font-semibold text-white">
                                {act}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-5 font-medium text-white/70">Best Season</td>
                        <td className="p-5 text-xs font-semibold text-white text-center border-l border-white/10">{pkgA.experience.bestSeason}</td>
                        <td className="p-5 text-xs font-semibold text-white text-center border-l border-white/10">{pkgB.experience.bestSeason}</td>
                      </tr>
                      <tr>
                        <td className="p-5 font-medium text-white/70">Ideal Duration</td>
                        <td className="p-5 text-xs font-bold text-white text-center border-l border-white/10">{pkgA.experience.duration}</td>
                        <td className="p-5 text-xs font-bold text-white text-center border-l border-white/10">{pkgB.experience.duration}</td>
                      </tr>
                      <tr>
                        <td className="p-5 font-medium text-white/70">Ideal Traveler Type</td>
                        <td className="p-5 text-xs font-bold text-white text-center border-l border-white/10">{pkgA.experience.idealTraveler}</td>
                        <td className="p-5 text-xs font-bold text-white text-center border-l border-white/10">{pkgB.experience.idealTraveler}</td>
                      </tr>
                    </>
                  )}

                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 5. BOTTOM ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Button
            onClick={() => onSelectDestination ? onSelectDestination(destA) : onNavigateView("itinerary", destA)}
            className="w-full sm:w-auto rounded-xl bg-white hover:bg-white/90 px-10 py-4 font-heading font-extrabold text-sm uppercase tracking-wider text-black shadow-2xl transition-transform hover:scale-105"
          >
            Create {destA} Itinerary
          </Button>
          <Button
            onClick={() => onSelectDestination ? onSelectDestination(destB) : onNavigateView("itinerary", destB)}
            className="w-full sm:w-auto rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-10 py-4 font-heading font-extrabold text-sm uppercase tracking-wider text-white backdrop-blur-md shadow-2xl transition-transform hover:scale-105"
          >
            Create {destB} Itinerary
          </Button>
        </div>

      </div>

    </section>
  )
}

function renderBool(val) {
  return val ? (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white font-bold border border-white/30">
      <Check className="h-3.5 w-3.5" />
    </span>
  ) : (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-white/30">
      <X className="h-3.5 w-3.5" />
    </span>
  )
}
