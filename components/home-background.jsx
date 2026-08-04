"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const famousPlaces = [
  { src: "/images/hero-mountains.png", alt: "Misty mountain range" },
  { src: "/images/dest-santorini.png", alt: "Santorini cliffside Greece" },
  { src: "/images/dest-goa.png", alt: "Goa shoreline beach India" },
  { src: "/images/dest-bali.png", alt: "Bali tropical palm retreat" },
  { src: "/images/dest-jaipur.png", alt: "Jaipur royal pink city palace" },
  { src: "/images/dest-manali.png", alt: "Manali snow capped peaks" },
  { src: "/images/dest-kerala.png", alt: "Kerala backwaters & palm groves" },
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
          animate={{ opacity: 0.18, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="h-full w-full object-cover filter blur-[1px] dark:opacity-[0.14]"
        />
      </AnimatePresence>

      {/* Subtle overlay gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background/60" />
    </div>
  )
}
