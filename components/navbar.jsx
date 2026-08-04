"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plane, Search, Moon, Sun, Menu, X, LogOut, User, Sparkles, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Explore", href: "#explore" },
  { label: "Destinations", href: "#destinations" },
  { label: "Packages", href: "#packages" },
  { label: "Itinerary", href: "#itinerary" },
  { label: "Budget Planner", href: "#budget" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const { user, isLoggedIn, logout, openAuthModal } = useAuth()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle("dark", next)
      return next
    })
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6"
    >
      <nav
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border border-transparent px-4 py-3 transition-all duration-300 sm:px-6",
          scrolled
            ? "border-border/60 bg-background/70 shadow-lg shadow-black/5 backdrop-blur-xl"
            : "bg-background/20 backdrop-blur-md",
        )}
      >
        {/* Premium Brand Logo */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary via-indigo-600 to-sky-400 text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
            <Plane className="h-5 w-5 -rotate-45" />
          </span>
          <div className="flex flex-col">
            <span className="font-heading text-xl font-extrabold tracking-tight text-foreground flex items-center gap-0.5">
              Trip<span className="text-primary">Nest</span>
              <span className="h-2 w-2 rounded-full bg-emerald inline-block ml-0.5 animate-pulse"></span>
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground -mt-1">
              AI Travel Planner
            </span>
          </div>
        </a>

        {/* Center links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Auth State Button / Profile Dropdown */}
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 p-1.5 pr-3 text-xs font-semibold text-foreground hover:bg-primary/20 transition-all"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary text-white font-heading font-bold text-xs overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    user?.name?.charAt(0) || "U"
                  )}
                </div>
                <span className="hidden sm:inline font-heading font-bold">{user?.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-3 shadow-2xl backdrop-blur-xl z-50 text-xs"
                  >
                    <div className="border-b border-border/60 pb-2.5 mb-2 px-1">
                      <p className="font-heading font-bold text-foreground text-sm">{user?.name}</p>
                      <p className="text-muted-foreground text-[11px] truncate">{user?.email}</p>
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald/15 px-2 py-0.5 text-[10px] font-semibold text-emerald">
                        <Sparkles className="h-3 w-3" /> Pro Explorer
                      </span>
                    </div>

                    <a
                      href="#itinerary"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-2.5 py-2 font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                      <User className="h-4 w-4 text-primary" /> My AI Itineraries
                    </a>

                    <button
                      onClick={() => {
                        logout()
                        setUserDropdownOpen(false)
                      }}
                      className="mt-1 flex w-full items-center gap-2 rounded-xl px-2.5 py-2 font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => openAuthModal("Sign in to access custom itineraries & saved trips", "login")}
                className="hidden font-medium text-foreground hover:bg-accent sm:inline-flex"
              >
                Login
              </Button>
              <Button
                onClick={() => openAuthModal("Create an account to save itineraries and chat with AI", "signup")}
                className="hidden rounded-xl bg-primary font-medium text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 sm:inline-flex"
              >
                Get Started
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="text-foreground lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-2 max-w-7xl rounded-2xl border border-border/60 bg-background/90 p-3 shadow-lg backdrop-blur-xl lg:hidden"
        >
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2 border-t border-border/60 pt-3">
            {isLoggedIn ? (
              <Button
                variant="outline"
                onClick={() => {
                  logout()
                  setMobileOpen(false)
                }}
                className="flex-1 text-destructive hover:bg-destructive/10"
              >
                Logout ({user?.name})
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    openAuthModal("Sign in to your account", "login")
                    setMobileOpen(false)
                  }}
                  className="flex-1 text-foreground hover:bg-accent"
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    openAuthModal("Create account to unlock all features", "signup")
                    setMobileOpen(false)
                  }}
                  className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
