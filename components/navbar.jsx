"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Sun, Menu, X, Sparkles, LogOut, User } from "lucide-react"
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle("dark", next)
      return next
    })
  }

  const handleNavClick = (view) => {
    setActiveView(view)
    setMobileOpen(false)
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
      <nav className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
        {/* Official TripNest Imagyn Logo */}
        <button
          onClick={() => handleNavClick("home")}
          className="flex items-center text-left focus:outline-none group py-0.5 bg-transparent border-none cursor-pointer"
          aria-label="TripNest Homepage"
        >
          <div className="rounded-md bg-white/20 backdrop-blur-md px-3 py-1.5 border border-white/30 shadow-sm transition-opacity hover:bg-white/30">
            <img
              src="/tripnest-logo.png"
              alt="TripNest Imagyn"
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </div>
        </button>

        {/* Center links */}
        <ul className="hidden items-center gap-1 xl:flex">
          {navLinks.map((link) => {
            const isActive = activeView === link.view
            const isTransparentHome = activeView === "home" && !scrolled
            return (
              <li key={link.view} className="relative overflow-visible">
                <button
                  onClick={() => handleNavClick(link.view)}
                  className={cn(
                    "relative rounded-sm px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer",
                    isActive
                      ? "bg-[#5A8CB2]/40 backdrop-blur-md border border-[#5A8CB2]/60 text-white shadow-sm"
                      : isTransparentHome
                      ? "text-white/90 hover:bg-white/15 hover:text-white"
                      : "text-[#1E293B]/80 hover:bg-[#5A8CB2]/15 hover:text-[#1E293B] dark:text-[#F1ECE2]/80 dark:hover:bg-[#C98B55]/15 dark:hover:text-[#F1ECE2]"
                  )}
                >
                  {link.label}
                </button>
              </li>
            )
          })}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Dark / Light Toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
            className={cn(
              "hover:bg-[#5A8CB2]/15 dark:hover:bg-[#C98B55]/20 rounded-sm",
              activeView === "home" && !scrolled ? "text-white hover:text-white" : "text-[#1E293B] dark:text-[#F1ECE2] hover:text-[#1E293B] dark:hover:text-[#F1ECE2]"
            )}
          >
            {isDark ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* User Profile / Auth Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 rounded-sm border border-[#5A8CB2]/30 bg-[#5A8CB2]/10 px-2.5 py-1.5 hover:border-[#5A8CB2]/60 transition-all text-[#1E293B] dark:text-[#F1ECE2] dark:border-[#C98B55]/30 dark:bg-[#C98B55]/10 cursor-pointer"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-xs bg-[#5A8CB2] text-xs font-bold text-white dark:bg-[#C98B55] dark:text-[#11100E]">
                  {user.initials || "U"}
                </span>
                <span className="hidden text-xs font-semibold text-[#1E293B] dark:text-[#F1ECE2] sm:inline-block max-w-[100px] truncate">
                  {user.name}
                </span>
              </button>

              <AnimatePresence>
                {userDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-card p-2 shadow-lg backdrop-blur-2xl z-50 text-foreground"
                  >
                    <div className="border-b border-border/40 px-3 py-2">
                      <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                    
                    {/* Profile Option Above Saved Trips */}
                    <button
                      onClick={() => {
                        setUserDropdown(false)
                        handleNavClick("profile")
                      }}
                      className="flex w-full items-center gap-2 rounded-xs px-3 py-2 text-xs font-bold text-foreground hover:bg-accent transition-colors cursor-pointer"
                    >
                      <User className="h-3.5 w-3.5 text-[#5A8CB2] dark:text-[#C98B55]" />
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
                  "flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer",
                  activeView === "home" && !scrolled
                    ? "border-white/30 bg-white/15 text-white hover:bg-white/25"
                    : "border-[#5A8CB2]/30 bg-[#5A8CB2]/10 text-[#1E293B] dark:text-[#F1ECE2] dark:border-[#C98B55]/30 dark:bg-[#C98B55]/10 hover:bg-[#5A8CB2]/20"
                )}
                title="User Profile & Passport"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </button>

              <Button
                onClick={() => onOpenAuth("signup")}
                className="rounded-full bg-[#5B8DEF] text-[#0F172A] text-xs font-bold uppercase tracking-wider hover:bg-[#487AE0] shadow-md shadow-[#5B8DEF]/25 sm:text-xs px-5 py-2 transition-all cursor-pointer"
              >
                Get Started
              </Button>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="text-foreground xl:hidden rounded-sm"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-2 max-w-7xl rounded-md border border-border/60 bg-background/95 p-3 shadow-lg backdrop-blur-xl xl:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.view}>
                <button
                  onClick={() => handleNavClick(link.view)}
                  className={cn(
                    "block w-full rounded-sm px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider transition-colors",
                    activeView === link.view
                      ? "bg-primary/10 font-bold text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
          {!user && (
            <div className="mt-2 border-t border-border/60 pt-3">
              <Button
                onClick={() => { setMobileOpen(false); onOpenAuth("signup"); }}
                className="w-full rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 text-xs uppercase tracking-wider py-2 font-semibold"
              >
                Get Started
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </motion.header>
  )
}
