"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Sun, LogOut, User, Bell, AlertTriangle, ShieldAlert, X, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTrip } from "@/context/trip-context"
import { ALERT_SEVERITY } from "@/lib/alert-engine"

const navLinks = [
  { label: "Overview", view: "home" },
  { label: "Explore", view: "explore" },
  { label: "Planner", view: "itinerary" },
  { label: "Budget", view: "budget" },
  { label: "Expenses", view: "expenses" },
  { label: "Packages", view: "packages" },
]

export function Navbar({ activeView = "home", setActiveView, user, onLogout, onOpenAuth }) {
  const {
    setSavedTripsModalOpen,
    alerts,
    unreadAlertCount,
    dismissAlert,
    notificationPermission,
    requestNotifications
  } = useTrip()
  const [scrolled, setScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isLightBg, setIsLightBg] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const [isAlertCenterOpen, setIsAlertCenterOpen] = useState(false)

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
      <nav className="container-responsive flex items-center justify-between gap-1.5 sm:gap-4 py-2.5 sm:py-3">
        {/* Official TripNest Imagyn Logo */}
        <button
          onClick={() => handleNavClick("home")}
          className="flex items-center text-left focus:outline-none group py-0.5 bg-transparent border-none cursor-pointer shrink-0"
          aria-label="TripNest Homepage"
        >
          <img
            src="/tripnest-logo.png"
            alt="TripNest by Imagyn"
            className="h-6 sm:h-8 w-auto object-contain transition-transform group-hover:scale-105"
          />
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
                    "relative px-2.5 sm:px-3.5 py-1 text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer border-b-2 font-button",
                    isLightBg
                      ? isActive
                        ? "text-neutral-900 border-neutral-900 font-bold"
                        : "text-neutral-600 border-transparent hover:text-neutral-900 hover:border-neutral-400"
                      : isActive
                        ? "text-white border-white font-bold"
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
          {/* Crowd & Safety Alert Center Bell Button */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Trip Alerts"
            onClick={() => setIsAlertCenterOpen(true)}
            className={cn(
              "relative rounded-xl transition-colors cursor-pointer",
              isLightBg
                ? "text-neutral-900 hover:bg-neutral-200/70"
                : "text-white hover:bg-white/20 hover:text-white"
            )}
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            {unreadAlertCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
            )}
          </Button>

          {/* Dark / Light Toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
            className={cn(
              "rounded-xl transition-colors cursor-pointer",
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
                  "flex items-center gap-2 rounded-xl border px-2.5 py-1.5 transition-all cursor-pointer font-button",
                  isLightBg
                    ? "border-neutral-900/20 bg-neutral-900/10 text-neutral-900 hover:bg-neutral-900/20"
                    : "border-white/30 bg-white/15 text-white hover:bg-white/25"
                )}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00356B] text-[10px] font-semibold text-white">
                  {user.initials || "U"}
                </span>
                <span className="hidden text-xs font-semibold sm:inline-block max-w-[90px] truncate">
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
                      <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setUserDropdown(false)
                        handleNavClick("profile")
                      }}
                      className="flex w-full items-center gap-2 rounded-xs px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer font-button"
                    >
                      <User className="h-3.5 w-3.5 text-[#00356B] dark:text-[#86B3E6]" />
                      Profile & Passport
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdown(false)
                        setSavedTripsModalOpen(true)
                      }}
                      className="flex w-full items-center gap-2 rounded-xs px-3 py-2 text-xs font-medium text-foreground hover:bg-accent cursor-pointer font-button"
                    >
                      My Saved Trips
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdown(false)
                        onLogout()
                      }}
                      className="flex w-full items-center gap-2 rounded-xs px-3 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/10 cursor-pointer font-button"
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
                  "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer font-button",
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
                className="rounded-xl bg-[#00356B] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#002852] shadow-md shadow-[#00356B]/25 sm:text-xs px-4 sm:px-5 py-2 transition-all cursor-pointer font-button"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Alert Center Slide-Over Drawer Modal */}
      <AnimatePresence>
        {isAlertCenterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md h-full bg-background border-l border-border/80 shadow-2xl flex flex-col overflow-hidden text-foreground"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/60 bg-muted/20">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-[#00356B]" />
                  <h3 className="font-heading font-bold text-base text-foreground">
                    TripNest Alert Center
                  </h3>
                  {unreadAlertCount > 0 && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      {unreadAlertCount} Active
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsAlertCenterOpen(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Push Permission Prompt */}
              {notificationPermission !== "granted" && (
                <div className="p-3.5 mx-4 mt-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-amber-800 dark:text-amber-200">Background Alerts</span>
                    <p className="text-[11px] text-muted-foreground">Get notified when site is closed</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={requestNotifications}
                    className="rounded-xl bg-amber-600 text-white hover:bg-amber-700 text-xs font-semibold px-3 py-1 font-button shadow-xs"
                  >
                    Enable
                  </Button>
                </div>
              )}

              {/* Alerts List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {alerts.map((alt) => {
                  const severityMeta = ALERT_SEVERITY[alt.severity] || ALERT_SEVERITY[1]
                  return (
                    <div
                      key={alt.id}
                      className={cn(
                        "p-4 rounded-2xl border space-y-2.5 transition-all text-left shadow-2xs",
                        severityMeta.bg,
                        severityMeta.border
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn("text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border", severityMeta.color, severityMeta.border)}>
                          {severityMeta.label}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-medium">
                          {alt.timestamp}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-heading font-bold text-sm text-foreground">
                          {alt.placeName} — {alt.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {alt.message}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-background/80 border border-border/50 text-xs text-foreground space-y-1">
                        <div className="font-semibold text-[11px] text-[#00356B]">
                          Recommended Action:
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {alt.recommendation}
                        </p>
                        {alt.peakHours && (
                          <p className="text-[11px] text-muted-foreground pt-0.5">
                            <strong>Peak Period:</strong> {alt.peakHours}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[11px] text-muted-foreground">
                        <span>Source: {alt.source}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAlertCenterOpen(false)
                            if (setActiveView) setActiveView("itinerary")
                            window.dispatchEvent(
                              new CustomEvent("tripnest-focus-spot", {
                                detail: { spotTitle: alt.affectedSpotTitle || alt.placeName }
                              })
                            )
                          }}
                          className="font-semibold text-[#00356B] hover:underline cursor-pointer font-button"
                        >
                          Focus in Itinerary →
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
