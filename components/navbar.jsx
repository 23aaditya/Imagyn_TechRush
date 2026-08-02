"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plane, Search, Moon, Sun, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
            <Plane className="h-5 w-5 -rotate-45" />
          </span>
          <span className="font-heading text-lg font-bold tracking-tight text-foreground">
            Trip<span className="text-primary">Nest</span>
          </span>
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
          <Button
            variant="ghost"
            className="hidden font-medium text-foreground hover:bg-accent sm:inline-flex"
          >
            Login
          </Button>
          <Button className="hidden rounded-xl bg-primary font-medium text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 sm:inline-flex">
            Get Started
          </Button>
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
            <Button variant="ghost" className="flex-1 text-foreground hover:bg-accent">
              Login
            </Button>
            <Button className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
