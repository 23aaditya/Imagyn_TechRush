"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Sun, Menu, X, Sparkles, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Overview", view: "home" },
  { label: "Planner", view: "itinerary" },
  { label: "Explore", view: "explore" },
  { label: "Budget", view: "budget" },
  { label: "Expenses", view: "expenses" },
  { label: "Packages", view: "packages" },
]

export function Navbar({ activeView = "home", setActiveView, user, onLogout, onOpenAuth }) {
  const [scrolled, setScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)

  useEffect(() => {
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
        "fixed inset-x-0 top-0 z-50 w-full transition-all duration-300",
        activeView === "home"
          ? scrolled
            ? "bg-[#0D2B45]/90 backdrop-blur-xl border-b border-white/10 text-white shadow-lg"
            : "bg-gradient-to-b from-black/85 via-black/40 to-transparent text-white border-none shadow-none"
          : "bg-[#0D2B45] text-white border-b border-white/10 shadow-md"
      )}
    >
      <nav className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 py-3.5">
        {/* Official TripNest Imagyn Logo */}
        <button
          onClick={() => handleNavClick("home")}
          className="flex items-center text-left focus:outline-none group py-1 bg-transparent border-none"
          aria-label="TripNest Homepage"
        >
          <img
            src="/images/tripnest-logo.png"
            alt="TripNest Imagyn"
            className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105 mix-blend-screen filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]"
          />
        </button>

        {/* Center links */}
        <ul className="hidden items-center gap-1.5 xl:flex">
          {navLinks.map((link) => {
            const isActive = activeView === link.view
            return (
              <li key={link.view}>
                <button
                  onClick={() => handleNavClick(link.view)}
                  className={cn(
                    "rounded-md px-3.5 py-2 text-xs font-bold transition-all",
                    isActive
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-white/80 hover:bg-white/15 hover:text-white",
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
            className="text-white/80 hover:text-white hover:bg-white/15"
          >
            {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-white" />}
          </Button>

          {/* User Profile / Auth Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-2.5 py-1.5 shadow-sm hover:border-white/40 transition-all text-white"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-white text-xs font-bold text-[#0D2B45]">
                  {user.initials || "U"}
                </span>
                <span className="hidden text-xs font-semibold text-white sm:inline-block max-w-[100px] truncate">
                  {user.name}
                </span>
              </button>

              <AnimatePresence>
                {userDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 rounded-md border border-white/20 bg-neutral-900/95 p-2 shadow-2xl backdrop-blur-2xl z-50 text-white"
                  >
                    <div className="border-b border-white/15 px-3 py-2">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-white/60 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdown(false)
                        handleNavClick("itinerary")
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-white/80 hover:bg-white/15 hover:text-white"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      My Saved Trips
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdown(false)
                        onLogout()
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/20"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                onClick={() => onOpenAuth("signup")}
                className="rounded-md bg-white text-[#0D2B45] text-xs font-extrabold hover:bg-white/90 sm:text-sm px-5 py-2 shadow-md transition-all"
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
            className="text-foreground xl:hidden"
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
          className="mx-auto mt-2 max-w-7xl rounded-2xl border border-border/60 bg-background/95 p-3 shadow-xl backdrop-blur-xl xl:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.view}>
                <button
                  onClick={() => handleNavClick(link.view)}
                  className={cn(
                    "block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
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
                className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-sm py-2 font-semibold shadow-md"
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
