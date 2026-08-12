"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function BudgetEntranceLoader({ onComplete }) {
  const [stage, setStage] = useState(0) // 0: Setting up, 1: Allocating, 2: Optimizing, 3: Complete
  const [piggyPulse, setPiggyPulse] = useState(false)
  const [activeCoinIndex, setActiveCoinIndex] = useState(-1)
  const [ripples, setRipples] = useState([])

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete()
      }, 1000)
      return () => clearTimeout(timer)
    }

    // Stage progression timers matching Generate Itinerary animation pacing
    const t1 = setTimeout(() => setStage(1), 900)
    const t2 = setTimeout(() => setStage(2), 1700)
    const t3 = setTimeout(() => setStage(3), 2500)
    const tEnd = setTimeout(() => {
      if (onComplete) onComplete()
    }, 3200)

    // Staggered Coin Entry Timers (Coins 0 through 4)
    const coinTimers = [
      setTimeout(() => triggerCoinEntry(0), 500),
      setTimeout(() => triggerCoinEntry(1), 950),
      setTimeout(() => triggerCoinEntry(2), 1400),
      setTimeout(() => triggerCoinEntry(3), 1850),
      setTimeout(() => triggerCoinEntry(4), 2300),
    ]

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(tEnd)
      coinTimers.forEach(clearTimeout)
    }
  }, [onComplete])

  const triggerCoinEntry = (index) => {
    setActiveCoinIndex(index)
    // Coin lands in slot ~300ms after launch -> trigger piggy micro-bounce & glow ripple
    setTimeout(() => {
      setPiggyPulse(true)
      setRipples((prev) => [...prev, { id: Date.now() }])
      setTimeout(() => setPiggyPulse(false), 180)
    }, 320)
  }

  const stages = [
    { label: "Setting up your trip budget..." },
    { label: "Allocating stay, dining & experience funds..." },
    { label: "Optimizing your travel savings..." },
    { label: "Build your budget before you build your journey." },
  ]

  // Staggered coin trajectories ending at slot (x: 160, y: 86)
  const coinsConfig = [
    { startX: 110, startY: 10, delay: 0.5 },
    { startX: 210, startY: 5, delay: 0.95 },
    { startX: 130, startY: -15, delay: 1.4 },
    { startX: 190, startY: -10, delay: 1.85 },
    { startX: 160, startY: -25, delay: 2.3 },
  ]

  return (
    <div
      onClick={() => onComplete && onComplete()}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xl overflow-hidden select-none cursor-pointer"
      title="Click anywhere to skip intro"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: -10 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg text-center space-y-7 relative z-10 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Soft Emerald/Sky Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[500px] rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        {/* Header Title & Subtitle */}
        <div className="space-y-2 relative z-10">
          <h3 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
            Plan Every Penny. Travel Without Compromise.
          </h3>
          <p className="text-sm text-neutral-300 font-medium max-w-md mx-auto">
            Build your budget before you build your journey.
          </p>
        </div>

        {/* Piggy Bank & Coin Entrance Viewport */}
        <div className="relative max-w-sm mx-auto py-2 z-10 h-52 flex items-center justify-center">
          {/* Slot Impact Glow Ripples */}
          {ripples.map((rip) => (
            <motion.div
              key={rip.id}
              initial={{ opacity: 0.8, scale: 0.3 }}
              animate={{ opacity: 0, scale: 2.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute top-[82px] left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-emerald-400 bg-emerald-400/20 pointer-events-none"
            />
          ))}

          {/* Staggered Coins Animation Layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {coinsConfig.map((c, i) => {
              const isActive = activeCoinIndex >= i
              return (
                <AnimatePresence key={i}>
                  {isActive && (
                    <motion.div
                      initial={{
                        x: c.startX,
                        y: c.startY,
                        opacity: 0,
                        scale: 0.8,
                        rotate: -20 + i * 10,
                      }}
                      animate={{
                        x: 160 - 18, // Center coin on slot (x: 160)
                        y: 84, // Slot height target
                        opacity: [0, 1, 1, 0],
                        scale: [0.9, 1, 0.7, 0.2],
                        rotate: 0,
                      }}
                      transition={{
                        duration: 0.45,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                      className="absolute top-0 left-0 w-9 h-9"
                    >
                      {/* Premium Gold/Emerald Travel Coin */}
                      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full drop-shadow-md">
                        <circle cx="20" cy="20" r="18" fill="url(#coinGrad)" stroke="#FCD34D" strokeWidth="2" />
                        <circle cx="20" cy="20" r="14" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 2" fill="none" />
                        <text x="20" y="25" textAnchor="middle" fill="#78350F" fontSize="15" fontWeight="bold" fontFamily="sans-serif">
                          ₹
                        </text>
                        <defs>
                          <linearGradient id="coinGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#FDE68A" />
                            <stop offset="50%" stopColor="#F59E0B" />
                            <stop offset="100%" stopColor="#D97706" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              )
            })}
          </div>

          {/* Premium Piggy Bank SVG Container */}
          <motion.div
            animate={{
              y: [0, -4, 0],
              scale: piggyPulse ? 1.04 : 1,
            }}
            transition={{
              y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
              scale: { duration: 0.15, ease: "easeOut" },
            }}
            className="relative z-10 w-48 h-48 flex items-center justify-center drop-shadow-2xl"
          >
            <svg viewBox="0 0 320 240" fill="none" className="w-full h-full">
              <defs>
                {/* Metallic Glassmorphic Piggy Gradient */}
                <linearGradient id="piggyBody" x1="40" y1="30" x2="280" y2="210" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="40%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>

                <linearGradient id="piggyEarGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#0369A1" />
                </linearGradient>

                <linearGradient id="accentGlow" x1="0" y1="0" x2="320" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="50%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#818CF8" />
                </linearGradient>

                <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.6)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
              </defs>

              {/* Ground Shadow */}
              <ellipse cx="160" cy="215" rx="90" ry="12" fill="url(#shadowGrad)" />

              {/* Piggy Back Ear */}
              <path d="M 105 55 Q 90 25 115 35 Z" fill="url(#piggyEarGrad)" opacity="0.8" />

              {/* Piggy Main Body */}
              <path
                d="M 80 130 
                   C 50 110 50 75 90 65 
                   C 130 45 200 45 240 70 
                   C 270 90 275 130 250 160 
                   C 230 185 180 195 130 190 
                   C 95 185 70 160 80 130 Z"
                fill="url(#piggyBody)"
                stroke="url(#accentGlow)"
                strokeWidth="3.5"
              />

              {/* Front Ear */}
              <path d="M 125 50 Q 115 15 145 30 Z" fill="url(#piggyEarGrad)" stroke="#38BDF8" strokeWidth="1.5" />

              {/* Cute Snout */}
              <ellipse cx="78" cy="125" rx="16" ry="13" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="73" cy="125" r="3.5" fill="#38BDF8" />
              <circle cx="83" cy="125" r="3.5" fill="#38BDF8" />

              {/* Minimal Sophisticated Eye */}
              <circle cx="118" cy="92" r="5" fill="#F8FAFC" />
              <circle cx="116" cy="91" r="2.5" fill="#0F172A" />

              {/* Minimal Legs */}
              <rect x="105" y="180" width="16" height="24" rx="8" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
              <rect x="200" y="180" width="16" height="24" rx="8" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />

              {/* Little Curly Tail */}
              <path d="M 255 135 Q 275 130 270 145 T 260 140" fill="none" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />

              {/* Coin Slot at Top Center */}
              <rect x="142" y="55" width="36" height="7" rx="3.5" fill="#090D16" stroke="#34D399" strokeWidth="2" />

              {/* Body Shiny Glass Highlight Arc */}
              <path d="M 110 75 Q 165 58 220 78" fill="none" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>

        {/* Single Line Active Rolling Text Slide */}
        <div className="py-2 flex items-center justify-center relative z-10 min-h-[48px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-3 text-white text-base sm:text-lg font-medium tracking-wide drop-shadow-md"
            >
              {stage < 3 && (
                <span className="h-5 w-5 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin inline-block shrink-0" />
              )}
              <span>{stages[stage]?.label}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Skip hint */}
        <p className="text-[11px] text-neutral-400 opacity-60">Click anywhere to skip</p>
      </motion.div>
    </div>
  )
}
