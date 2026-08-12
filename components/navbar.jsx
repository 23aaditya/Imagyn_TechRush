"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Sun, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTrip } from "@/context/trip-context"

const navLinks = [
  { label: "Overview", view: "home" },
  { label: "Explore", view: "explore" },
  { label: "Planner", view: "itinerary" },
  { label: "Budget", view: "budget" },
  { label: "Expenses", view: "expenses" },
  { label: "Packages", view: "packages" },
]

export function Navbar({ activeView = "home", setActiveView, user, onLogout, onOpenAuth }) {
  const { setSavedTripsModalOpen } = useTrip()
  const [scrolled, setScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isLightBg, setIsLightBg] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
    const onScroll = () => {
      setScrolled(window.scrollY > 16)

      // In dark mode, always keep text white for high contrast
      if (document.documentElement.classList.contains("dark")) {
        setIsLightBg(false)
        return
      }

      // Check section element under navbar
      const el = document.elementFromPoint(window.innerWidth / 2, 35)
      if (el) {
        const section = el.closest("section, footer, div[id]")
        if (section) {
          const secId = section.id
          // Dark sections: home, search-video-hero, final-cta
          const isDarkSec = secId === "home" || secId === "search-video-hero" || secId === "final-cta"
          setIsLightBg(!isDarkSec)
          return
        }
      }

      // Fallback scroll position check if on home view:
      if (activeView === "home") {
        setIsLightBg(window.scrollY > 1400)
      } else {
        setIsLightBg(true)
      }
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [activeView])

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle("dark", next)
      if (next) setIsLightBg(false)
      return next
    })
  }

  const handleNavClick = (view) => {
    setActiveView(view)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 bg-transparent border-none text-foreground"
      )}
    >
      <nav className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6 py-3">
        {/* Official TripNest Imagyn Logo */}
        <button
          onClick={() => handleNavClick("home")}
          className="flex items-center text-left focus:outline-none group py-0.5 bg-transparent border-none cursor-pointer shrink-0"
          aria-label="TripNest Homepage"
        >
          <div className={cn(
            "rounded-md px-3 py-1.5 border shadow-sm transition-all backdrop-blur-md",
            isLightBg
              ? "bg-neutral-900/10 border-neutral-900/20 hover:bg-neutral-900/20"
              : "bg-white/20 border-white/30 hover:bg-white/30"
          )}>
            <img
              src="/tripnest-logo.png"
              alt="TripNest Imagyn"
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </div>
        </button>

        {/* Top Navbar Menu Links (Clean underline for active view, no blue background) */}
        <ul className="flex items-center gap-1 sm:gap-2.5 overflow-x-auto scrollbar-none py-1">
          {navLinks.map((link) => {
            const isActive = activeView === link.view
            return (
              <li key={link.view} className="shrink-0">
                <button
                  onClick={() => handleNavClick(link.view)}
                  className={cn(
                    "relative px-2.5 sm:px-3.5 py-1 text-[11px] sm:text-xs font-extrabold tracking-wider uppercase transition-all cursor-pointer border-b-2",
                    isLightBg
                      ? isActive
                        ? "text-neutral-900 border-neutral-900 font-black"
                        : "text-neutral-600 border-transparent hover:text-neutral-900 hover:border-neutral-400"
                      : isActive
                        ? "text-white border-white font-black"
                        : "text-white/80 border-transparent hover:text-white hover:border-white/40"
                  )}
                >
                  {link.label}
                </button>
              </li>
            )
          })}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Dark / Light Toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
            className={cn(
              "rounded-full transition-colors cursor-pointer",
              isLightBg
                ? "text-neutral-900 hover:bg-neutral-200/70"
                : "text-white hover:bg-white/20 hover:text-white"
            )}
          >
            {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* User Profile / Auth Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-2.5 py-1.5 transition-all cursor-pointer",
                  isLightBg
                    ? "border-neutral-900/20 bg-neutral-900/10 text-neutral-900 hover:bg-neutral-900/20"
                    : "border-white/30 bg-white/15 text-white hover:bg-white/25"
                )}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8D5BB3] text-[10px] font-bold text-white">
                  {user.initials || "U"}
                </span>
                <span className="hidden text-xs font-bold sm:inline-block max-w-[90px] truncate">
                  {user.name}
                </span>
              </button>

              <AnimatePresence>
                {userDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card p-2 shadow-lg backdrop-blur-2xl z-50 text-foreground"
                  >
                    <div className="border-b border-border/40 px-3 py-2">
                      <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setUserDropdown(false)
                        handleNavClick("profile")
                      }}
                      className="flex w-full items-center gap-2 rounded-xs px-3 py-2 text-xs font-bold text-foreground hover:bg-accent transition-colors cursor-pointer"
                    >
                      <User className="h-3.5 w-3.5 text-[#8D5BB3]" />
                      Profile & Passport
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdown(false)
                        setSavedTripsModalOpen(true)
                      }}
                      className="flex w-full items-center gap-2 rounded-xs px-3 py-2 text-xs font-medium text-foreground hover:bg-accent cursor-pointer"
                    >
                      My Saved Trips
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdown(false)
                        onLogout()
                      }}
                      className="flex w-full items-center gap-2 rounded-xs px-3 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => handleNavClick("profile")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold tracking-wide uppercase transition-all cursor-pointer",
                  isLightBg
                    ? "border-neutral-900/20 bg-neutral-900/10 text-neutral-900 hover:bg-neutral-900/20"
                    : "border-white/30 bg-white/15 text-white hover:bg-white/25"
                )}
                title="User Profile & Passport"
              >
                <User className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Profile</span>
              </button>

              <Button
                onClick={() => onOpenAuth("signup")}
                className="rounded-full bg-[#8D5BB3] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#7b4d9e] shadow-md shadow-[#8D5BB3]/25 sm:text-xs px-4 sm:px-5 py-2 transition-all cursor-pointer"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </nav>
    </motion.header>
  )
}
