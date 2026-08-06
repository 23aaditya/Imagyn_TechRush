"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plane, Search, Moon, Sun, Menu, X, User as UserIcon, LogOut, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Home Overview", view: "home" },
  { label: "AI Itinerary", view: "itinerary" },
  { label: "Explore", view: "explore" },
  { label: "Budget Planner", view: "budget" },
  { label: "Expense Tracker", view: "expenses" },
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
      className="fixed inset-x-0 top-0 z-40 px-4 pt-3 sm:px-6"
    >
      <nav
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border border-transparent px-4 py-3 transition-all duration-300 sm:px-6",
          scrolled || activeView !== "home"
            ? "border-border/60 bg-background/80 shadow-lg shadow-black/5 backdrop-blur-xl"
            : "bg-background/30 backdrop-blur-md",
        )}
      >
        {/* Logo */}
        <button
          onClick={() => handleNavClick("home")}
          className="flex items-center gap-2 text-left focus:outline-none"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
            <Plane className="h-5 w-5 -rotate-45" />
          </span>
          <span className="font-heading text-lg font-bold tracking-tight text-foreground">
            Trip<span className="text-primary">Nest</span>
          </span>
        </button>

        {/* Center links: Single-page view switchers */}
        <ul className="hidden items-center gap-1 xl:flex">
          {navLinks.map((link) => {
            const isActive = activeView === link.view
            return (
              <li key={link.view}>
                <button
                  onClick={() => handleNavClick(link.view)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-xs font-semibold transition-all",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {link.label}
                </button>
              </li>
            )
          })}
        </ul>

        {/* Right actions & User Profile / Auth */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* User Auth state */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 rounded-xl border border-border/60 bg-card p-1.5 pr-3 shadow-sm hover:border-primary/50 transition-all"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                  {user.initials || "U"}
                </span>
                <span className="hidden text-xs font-semibold text-foreground sm:inline-block max-w-[100px] truncate">
                  {user.name}
                </span>
              </button>

              <AnimatePresence>
                {userDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 rounded-2xl border border-border bg-card p-2 shadow-xl backdrop-blur-xl"
                  >
                    <div className="border-b border-border/60 px-3 py-2">
                      <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdown(false)
                        handleNavClick("itinerary")
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      My Saved Trips
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdown(false)
                        onLogout()
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10"
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
                variant="ghost"
                onClick={() => onOpenAuth("login")}
                className="hidden font-medium text-foreground hover:bg-accent sm:inline-flex text-xs sm:text-sm"
              >
                Sign In
              </Button>
              <Button
                onClick={() => onOpenAuth("signup")}
                className="rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 sm:text-sm"
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
            <div className="mt-2 flex gap-2 border-t border-border/60 pt-3">
              <Button
                variant="ghost"
                onClick={() => { setMobileOpen(false); onOpenAuth("login"); }}
                className="flex-1 text-foreground hover:bg-accent text-xs"
              >
                Sign In
              </Button>
              <Button
                onClick={() => { setMobileOpen(false); onOpenAuth("signup"); }}
                className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
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
