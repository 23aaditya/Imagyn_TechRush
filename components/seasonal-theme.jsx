"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"

export function SeasonalTheme({ season = "winter" }) {
  // Generate deterministic particles for smooth performance
  const particles = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.7 + 2) % 100}%`,
      size: (i % 5) + 3,
      duration: (i % 4) * 2 + 5,
      delay: (i % 7) * 0.4,
      drift: ((i % 3) - 1) * 30,
    }))
  }, [])

  if (!season) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {/* Winter Theme ❄️ */}
      {season === "winter" && (
        <>
          <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay dark:bg-cyan-900/10" />
          <div className="absolute inset-0">
            {particles.map((p) => (
              <motion.div
                key={`snowflake-${p.id}`}
                initial={{ y: -20, x: 0, opacity: 0 }}
                animate={{
                  y: ["0vh", "105vh"],
                  x: [0, p.drift, 0],
                  opacity: [0, 0.8, 0.8, 0],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: p.delay,
                  ease: "linear",
                }}
                style={{
                  left: p.left,
                  width: `${p.size + 2}px`,
                  height: `${p.size + 2}px`,
                }}
                className="absolute rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] backdrop-blur-sm"
              />
            ))}
          </div>
        </>
      )}

      {/* Summer Theme ☀️ */}
      {season === "summer" && (
        <>
          <div className="absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-amber-400/10 blur-3xl dark:bg-amber-500/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
          <div className="absolute inset-0">
            {particles.slice(0, 18).map((p) => (
              <motion.div
                key={`sunray-${p.id}`}
                initial={{ y: "100vh", opacity: 0, scale: 0.5 }}
                animate={{
                  y: ["100vh", "-10vh"],
                  x: [0, p.drift * 1.5, 0],
                  opacity: [0, 0.6, 0.2, 0],
                  scale: [0.5, 1.2, 0.8],
                }}
                transition={{
                  duration: p.duration + 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: p.delay,
                  ease: "easeInOut",
                }}
                style={{
                  left: p.left,
                  width: `${p.size * 2}px`,
                  height: `${p.size * 2}px`,
                }}
                className="absolute rounded-full bg-gradient-to-t from-amber-300 to-yellow-100 opacity-60 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
              />
            ))}
          </div>
        </>
      )}

      {/* Autumn Theme 🍂 */}
      {season === "autumn" && (
        <>
          <div className="absolute inset-0 bg-orange-500/5 mix-blend-overlay dark:bg-amber-950/15" />
          <div className="absolute inset-0">
            {particles.map((p) => (
              <motion.div
                key={`leaf-${p.id}`}
                initial={{ y: -20, rotate: 0, opacity: 0 }}
                animate={{
                  y: ["0vh", "105vh"],
                  x: [0, p.drift * 2, -p.drift],
                  rotate: [0, 360, 720],
                  opacity: [0, 0.85, 0.85, 0],
                }}
                transition={{
                  duration: p.duration + 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: p.delay,
                  ease: "easeInOut",
                }}
                style={{ left: p.left }}
                className="absolute text-amber-600 dark:text-amber-400"
              >
                <svg
                  width={p.size * 3 + 6}
                  height={p.size * 3 + 6}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="opacity-75 drop-shadow-sm"
                >
                  <path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 2 6.5 5 8 1.5.5 3 0 4-1 1 1 2.5 1.5 4 1 3-1.5 5-4.5 5-8 0-5.5-4.5-10-10-10zm0 18c-4.4 0-8-3.6-8-8 0-3.3 2-6.2 5-7.4v13.4c-1-.2-2-.9-2-2 0-.6.4-1 1-1s1 .4 1 1c0 1.7 1.3 3 3 3z" />
                </svg>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Monsoon Theme 🌧️ */}
      {season === "monsoon" && (
        <>
          <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-950/20" />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-800/15 via-slate-700/5 to-transparent" />
          <div className="absolute inset-0">
            {particles.concat(particles).map((p, idx) => (
              <motion.div
                key={`rain-${idx}`}
                initial={{ y: -40, opacity: 0 }}
                animate={{
                  y: ["0vh", "105vh"],
                  x: [0, -15],
                  opacity: [0, 0.7, 0.7, 0],
                }}
                transition={{
                  duration: p.duration * 0.4 + 1.2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: (idx % 10) * 0.2,
                  ease: "linear",
                }}
                style={{
                  left: `${(idx * 3.5 + 1) % 100}%`,
                  width: "1.5px",
                  height: `${p.size * 4 + 12}px`,
                }}
                className="absolute bg-gradient-to-b from-transparent via-cyan-400 to-blue-500 opacity-70"
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
