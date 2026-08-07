"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const famousPlaces = [
  { src: "/images/hero-venice.jpg", alt: "Venice Grand Canal & Gondolas" },
  { src: "/images/hero-mexico.jpg", alt: "San Miguel de Allende Colonial Street" },
  { src: "/images/hero-swiss.jpg", alt: "Swiss Alpine Lake & Snow Peaks" },
  { src: "/images/hero-hawamahal.jpg", alt: "Hawa Mahal Palace of Winds Jaipur" },
  { src: "/images/hero-tajmahal.jpg", alt: "Taj Mahal Agra" },
]

export function HomeBackground() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % famousPlaces.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={famousPlaces[index].src}
          src={famousPlaces[index].src}
          alt={famousPlaces[index].alt}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 0.35, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="h-full w-full object-cover filter blur-[0.5px] dark:opacity-[0.25]"
        />
      </AnimatePresence>

      {/* Subtle overlay gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/25 to-background/70" />
    </div>
  )
}
