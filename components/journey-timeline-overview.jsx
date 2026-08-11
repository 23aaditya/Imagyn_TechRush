"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useSpring, useInView, AnimatePresence } from "framer-motion"
import { ArrowRight, Map, Calendar, Wallet, PieChart, Receipt, CheckCircle, Clock, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EASE_TRAVEL } from "@/lib/motion"

// Changing Destination Photography Reel Data for Stage 01 EXPLORE
const EXPLORE_REEL = [
  { name: "GOA", country: "India", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&auto=format&fit=crop&q=80" },
  { name: "MANALI", country: "India", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&auto=format&fit=crop&q=80" },
  { name: "JAIPUR", country: "India", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop&q=80" },
  { name: "KERALA", country: "India", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop&q=80" },
  { name: "KASHMIR", country: "India", image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=1200&auto=format&fit=crop&q=80" },
  { name: "BALI", country: "Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80" },
]

function TimelineStage({ label, heading, descriptionLines, children, isEven, ctaButton }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: "-20% 0px -20% 0px" })

  return (
    <div ref={ref} className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center my-28 lg:my-40">
      {/* TEXT / STORY SIDE */}
      <div className={`pl-6 lg:pl-0 lg:col-span-5 ${isEven ? "lg:order-2 lg:text-left" : "lg:order-1 lg:text-right"} space-y-4`}>
        <div className="space-y-1">
          <span className="font-mono-tech text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-muted-foreground block">
            {label}
          </span>
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: isInView ? 1 : 0.6, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_TRAVEL }}
            className="font-serif-editorial text-3xl sm:text-5xl font-black text-foreground uppercase tracking-tight leading-[0.93] whitespace-pre-line"
          >
            {heading}
          </motion.h3>
        </div>

        {/* 3-4 Line Description Paragraph */}
        {descriptionLines && (
          <div className="font-sans text-xs sm:text-sm leading-relaxed text-muted-foreground font-medium space-y-1 max-w-md ml-auto">
            {descriptionLines.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        )}

        {ctaButton && (
          <div className="pt-2">
            {ctaButton}
          </div>
        )}
      </div>

      {/* VISUAL COMPOSITION SIDE */}
      <div className={`pl-12 lg:pl-0 lg:col-span-7 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: isInView ? 1 : 0.4, y: isInView ? 0 : 12, scale: isInView ? 1 : 0.98 }}
          transition={{ duration: 0.6, ease: EASE_TRAVEL }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}

export function JourneyTimelineOverview({ onNavigateView }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // State for Auto-Crossfading Destination Reel in Stage 01 EXPLORE
  const [reelIndex, setReelIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setReelIndex((prev) => (prev + 1) % EXPLORE_REEL.length)
    }, 4200)
    return () => clearInterval(timer)
  }, [])

  const currentDest = EXPLORE_REEL[reelIndex]

  return (
    <section ref={containerRef} className="relative bg-background px-4 py-24 sm:px-6 lg:py-36 overflow-hidden border-t border-border/60 select-none">
      <div className="mx-auto max-w-7xl relative">
        
        {/* SECTION INTRODUCTION */}
        <div className="mx-auto max-w-4xl text-center space-y-4 mb-24 sm:mb-32">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_TRAVEL }}
            className="font-serif-editorial text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground uppercase leading-[0.92]"
          >
            PLAN THE JOURNEY.<br />
            <span className="font-heading font-extrabold text-[#C98B55] italic lowercase">not just the</span><br />
            DESTINATION.
          </motion.h2>

          <p className="font-sans text-xs sm:text-sm text-muted-foreground font-medium max-w-md mx-auto tracking-wide">
            From discovering where to go to keeping track of every part of the journey.
          </p>
        </div>

        {/* CONTINUOUS VERTICAL ROUTE LINE (Positioned behind text, connecting start to end) */}
        <div className="absolute left-4 lg:left-1/2 top-84 bottom-56 -translate-x-1/2 w-[2px] bg-border/40 pointer-events-none z-0">
          <motion.div
            style={{ scaleY, transformOrigin: "top" }}
            className="w-full h-full bg-[#C98B55] shadow-xs"
          />
        </div>

        {/* ROUTE STARTING POINT MARKER */}
        <div className="relative flex justify-start lg:justify-center pl-10 lg:pl-0 mb-12 z-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C98B55]/50 bg-background px-4 py-1.5 font-mono-tech text-[11px] font-bold uppercase tracking-widest text-[#C98B55] shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-[#C98B55] animate-pulse" />
            <span>START OF JOURNEY</span>
          </div>
        </div>

        {/* 5-STAGE TIMELINE FLOW */}
        <div className="relative z-20">
          
          {/* STAGE 01 — EXPLORE */}
          <TimelineStage
            label="01 / EXPLORE"
            heading={`WHERE SHOULD\nWE GO?`}
            descriptionLines={[
              "Discover handpicked destinations tailored to your travel mood, budget, and style.",
              "Explore full spectrum locations across 42 countries with rich visual telemetry.",
              "Uncover local culture, hidden spots, and authentic travel possibilities before you plan.",
              "Find your next journey effortlessly before planning every single detail."
            ]}
            isEven={false}
            ctaButton={
              <Button
                onClick={() => onNavigateView?.("explore")}
                className="h-11 rounded-sm bg-foreground px-6 text-xs font-bold uppercase tracking-wider text-background shadow-md hover:bg-foreground/90 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Map className="h-4 w-4 text-[#C98B55]" />
                Explore Destinations
                <ArrowRight className="h-4 w-4" />
              </Button>
            }
          >
            <div className="space-y-3">
              {/* Changing Destination Photography Reel */}
              <div className="relative overflow-hidden rounded-sm border border-border/60 bg-muted aspect-[16/10] shadow-md">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentDest.name}
                    src={currentDest.image}
                    alt={currentDest.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: EASE_TRAVEL }}
                    className="absolute inset-0 h-full w-full object-cover filter brightness-[0.9] contrast-[1.05]"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Synchronized Location Overlay (Simple Sans-Serif Typography) */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentDest.name}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.4, ease: EASE_TRAVEL }}
                    >
                      <span className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-white block">
                        {currentDest.name}
                      </span>
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#C98B55] block">
                        {currentDest.country}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </TimelineStage>

          {/* STAGE 02 — PLAN (Uploaded Image 3: Planner) */}
          <TimelineStage
            label="02 / PLAN"
            heading={`TURN THE IDEA\nINTO A JOURNEY.`}
            descriptionLines={[
              "Turn your ideas into a structured, day-by-day travel schedule.",
              "Organize daily activities, time slots, and travel routes in one place.",
              "Visualize location distances, travel times, and essential trip checklists.",
              "Keep your whole itinerary structured, flexible, and completely stress-free."
            ]}
            isEven={true}
          >
            <div className="overflow-hidden rounded-md border border-border/70 bg-card shadow-md">
              <img
                src="/images/timeline/timeline-planner.png"
                alt="TripNest Itinerary Planner"
                className="w-full h-auto object-cover block"
              />
            </div>
          </TimelineStage>

          {/* STAGE 03 — BUDGET (Uploaded Image 2: Budget Calculator) */}
          <TimelineStage
            label="03 / BUDGET"
            heading={`WHAT WILL\nTHE JOURNEY COST?`}
            descriptionLines={[
              "Get full financial transparency across accommodation, travel, food, and activities.",
              "Customize trip duration, number of travelers, and stay comfort tiers in real-time.",
              "Analyze proportional cost breakdowns so you always know where every rupee goes.",
              "Plan with total confidence and zero unexpected expenses along the way."
            ]}
            isEven={false}
          >
            <div className="overflow-hidden rounded-md border border-border/70 bg-card shadow-md">
              <img
                src="/images/timeline/timeline-budget.png"
                alt="TripNest Budget Calculator"
                className="w-full h-auto object-cover block"
              />
            </div>
          </TimelineStage>

          {/* STAGE 04 — EXPENSES (Uploaded Image 1: Expense Tracker - 100% Clear, NO Bot Symbol) */}
          <TimelineStage
            label="04 / EXPENSES"
            heading={`WHERE DID\nTHE MONEY GO?`}
            descriptionLines={[
              "Track your real-world spending seamlessly throughout your entire journey.",
              "Compare actual day-by-day expenditure directly against your planned budget caps.",
              "Monitor category distributions from dining to entry passes automatically.",
              "Stay in total control of your travel funds with real-time balance insights."
            ]}
            isEven={true}
          >
            <div className="overflow-hidden rounded-md border border-border/70 bg-card shadow-md">
              <img
                src="/images/timeline/timeline-expenses.png"
                alt="TripNest Expense Tracker"
                className="w-full h-auto object-cover block"
              />
            </div>
          </TimelineStage>

          {/* STAGE 05 — PACKAGES */}
          <TimelineStage
            label="05 / PACKAGES"
            heading={`WHICH JOURNEY\nFEELS RIGHT?`}
            descriptionLines={[
              "Compare realistic, curated travel package spectrums side-by-side with full clarity.",
              "Review hotel comfort levels, included meals, and guided sightseeing highlights.",
              "Choose bespoke package options tailored to your pace with zero hidden fees.",
              "Find the perfect journey package with complete confidence."
            ]}
            isEven={false}
          >
            {/* Editorial Photo Spread (3 Destinations) */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
              
              <div className="space-y-2">
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-border/60 bg-muted">
                  <img
                    src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80"
                    alt="Goa Package"
                    className="h-full w-full object-cover filter brightness-[0.9]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <span className="font-sans text-base font-bold tracking-wide text-white block">GOA</span>
                    <span className="font-sans text-[11px] font-semibold text-amber-300 block">05 DAYS · ₹14,500</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-border/60 bg-muted">
                  <img
                    src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80"
                    alt="Manali Package"
                    className="h-full w-full object-cover filter brightness-[0.9]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <span className="font-sans text-base font-bold tracking-wide text-white block">MANALI</span>
                    <span className="font-sans text-[11px] font-semibold text-amber-300 block">05 DAYS · ₹18,900</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-border/60 bg-muted">
                  <img
                    src="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80"
                    alt="Jaipur Package"
                    className="h-full w-full object-cover filter brightness-[0.9]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <span className="font-sans text-base font-bold tracking-wide text-white block">JAIPUR</span>
                    <span className="font-sans text-[11px] font-semibold text-amber-300 block">04 DAYS · ₹12,200</span>
                  </div>
                </div>
              </div>

            </div>
          </TimelineStage>

        </div>

        {/* ROUTE ENDING POINT MARKER */}
        <div className="relative flex justify-start lg:justify-center pl-10 lg:pl-0 mt-12 mb-6 z-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C98B55]/50 bg-background px-4 py-1.5 font-mono-tech text-[11px] font-bold uppercase tracking-widest text-[#C98B55] shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-[#C98B55]" />
            <span>END OF JOURNEY</span>
          </div>
        </div>

        {/* FINAL CONCLUSION MOMENT */}
        <div className="relative pt-16 text-center space-y-4">
          <div className="space-y-2 pt-4">
            <h3 className="font-serif-editorial text-2xl sm:text-4xl font-black text-foreground uppercase tracking-tight">
              ONE JOURNEY.<br />
              <span className="font-heading font-extrabold text-[#C98B55] italic lowercase">five</span><br />
              MOMENTS.
            </h3>
            
            <p className="font-mono-tech text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-muted-foreground">
              EXPLORE. PLAN. BUDGET. EXPENSES. PACKAGES.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
