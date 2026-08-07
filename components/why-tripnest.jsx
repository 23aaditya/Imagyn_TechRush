"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const features = [
  {
    id: 1,
    title: "Destination Discovery",
    tagline: "Find Your Perfect Vibe",
    desc: "Discover handpicked spots matching your mood, budget, and travel dreams effortlessly.",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&auto=format&fit=crop&q=80",
    badge: "01 / Discovery"
  },
  {
    id: 2,
    title: "Smart Package Comparison",
    tagline: "Transparent Side-by-Side Analysis",
    desc: "Weigh stays, transport, dining costs, and activity value before making any booking.",
    img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80",
    badge: "02 / Comparison"
  },
  {
    id: 3,
    title: "AI-Powered Itinerary Builder",
    tagline: "Bespoke Routes & Timings",
    desc: "Your journey, day-by-day, optimized with opening hours, route distances, and rest spots.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80",
    badge: "03 / Itineraries"
  },
  {
    id: 4,
    title: "Realistic Budget Calculator",
    tagline: "Know Your Costs Upfront",
    desc: "Up-to-date regional expenditure breakdowns for accommodation, meals, and local transit.",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
    badge: "04 / Budgeting"
  },
  {
    id: 5,
    title: "Context-Aware Local Maps",
    tagline: "Landmarks to Hidden Gems",
    desc: "Everything around you—from iconic views to secret eateries—right when you need it.",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
    badge: "05 / Navigation"
  },
  {
    id: 6,
    title: "Live Expense Tracker",
    tagline: "Stay Stress-Free On the Go",
    desc: "Log daily spending live in your local currency and track remaining travel funds in real time.",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80",
    badge: "06 / Expense Tracking"
  }
]

export function WhyTripNest() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto slide every 6 seconds
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [isPaused])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length)
  }

  // Get previous, current, and next indices
  const prevIndex = (currentIndex - 1 + features.length) % features.length
  const nextIndex = (currentIndex + 1) % features.length

  return (
    <section id="features" className="relative bg-background px-4 py-20 sm:px-6 lg:py-28 border-t border-border/60 overflow-hidden select-none">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 space-y-3">
          <span className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400 block">
            THE TRIPNEST PHILOSOPHY
          </span>

          <h2 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.06]">
            Why TripNest?
          </h2>

          <p className="font-sans text-base sm:text-lg leading-relaxed text-muted-foreground font-normal max-w-xl mx-auto">
            Curated for discerning travelers — replacing chaotic planning with quiet precision, bespoke routes, and effortless elegance.
          </p>
        </div>

        {/* 3-Card Focused Slide Show Showcase (Fully Automatic) */}
        <div 
          className="relative min-h-[460px] sm:min-h-[520px] w-full flex items-center justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Cards Stage Container */}
          <div className="relative w-full max-w-5xl h-[420px] sm:h-[480px] flex items-center justify-center">
            
            {features.map((feat, idx) => {
              let position = "hidden"
              if (idx === currentIndex) position = "center"
              else if (idx === prevIndex) position = "left"
              else if (idx === nextIndex) position = "right"

              if (position === "hidden") return null

              const isCenter = position === "center"
              const isLeft = position === "left"

              return (
                <motion.div
                  key={feat.id}
                  layout
                  initial={{ 
                    opacity: 0, 
                    scale: 0.7, 
                    x: isLeft ? "-90%" : isCenter ? "0%" : "90%" 
                  }}
                  animate={{
                    opacity: isCenter ? 1 : 0.55,
                    scale: isCenter ? 1 : 0.7,
                    x: isLeft ? "-60%" : isCenter ? "0%" : "60%",
                    zIndex: isCenter ? 30 : 10,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  onClick={() => {
                    if (isLeft) handlePrev()
                    if (!isCenter && !isLeft) handleNext()
                  }}
                  className={`absolute top-0 w-[85%] sm:w-[580px] h-full rounded-3xl overflow-hidden border border-border/80 bg-card shadow-2xl transition-shadow duration-500 cursor-pointer ${
                    isCenter ? "shadow-[0_25px_60px_rgba(0,0,0,0.35)] pointer-events-auto" : "filter brightness-[0.8] hover:brightness-[0.95]"
                  }`}
                >
                  {/* Card High-Impact Travel Image */}
                  <div className="relative h-full w-full overflow-hidden">
                    <img
                      src={feat.img}
                      alt={feat.title}
                      className="h-full w-full object-cover filter brightness-[0.75] contrast-[1.08] transition-transform duration-1000"
                    />

                    {/* Gradient Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                    {/* Top Pill Badge */}
                    <div className="absolute top-5 left-6 z-10">
                      <span className="font-heading text-xs font-bold uppercase tracking-widest text-amber-300 bg-black/60 border border-amber-400/30 px-3.5 py-1.5 rounded-full backdrop-blur-md">
                        {feat.badge}
                      </span>
                    </div>

                    {/* Bottom Editorial Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-left space-y-2 z-10">
                      <span className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-wider text-amber-400 block">
                        {feat.tagline}
                      </span>

                      <h3 className="font-heading text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                        {feat.title}
                      </h3>

                      <p className="font-sans text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl font-normal pt-1">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}

          </div>
        </div>

        {/* Carousel Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {features.map((feat, i) => (
            <button
              key={feat.id}
              onClick={() => setCurrentIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                i === currentIndex ? "w-8 bg-amber-500" : "w-2.5 bg-neutral-300 dark:bg-neutral-700 hover:bg-amber-400"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
