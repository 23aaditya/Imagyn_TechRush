"use client"

import { motion } from "framer-motion"
import { Plane, ArrowRight } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Button } from "@/components/ui/button"

const columns = [
  {
    title: "Product",
    links: ["Features", "Smart Planner", "Budget Calculator"],
  },
  {
    title: "Explore",
    links: ["Destinations", "Packages", "Travel Guides"],
  },
  {
    title: "Resources",
    links: ["Blog", "Help Center", "FAQs"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact"],
  },
  {
    title: "Support",
    links: ["Help", "Privacy", "Terms"],
  },
]

const socials = [
  { icon: FaInstagram, label: "Instagram" },
  { icon: FaTwitter, label: "Twitter" },
  { icon: FaFacebook, label: "Facebook" },
  { icon: FaYoutube, label: "YouTube" },
]

export function Footer() {
  return (
    <footer className="relative w-full border-t border-border/60 bg-secondary/40 px-4 pt-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 pb-14 sm:grid-cols-3 lg:grid-cols-[1.4fr_repeat(5,1fr)] lg:gap-x-8">
          {/* Brand + newsletter */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <a href="#home" className="flex items-center gap-2.5 group">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary via-indigo-600 to-sky-400 text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
                <Plane className="h-5 w-5 -rotate-45" aria-hidden />
              </span>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-extrabold tracking-tight text-foreground flex items-center gap-0.5">
                  Trip<span className="text-primary">Nest</span>
                  <span className="h-2 w-2 rounded-full bg-emerald inline-block ml-0.5"></span>
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground -mt-1">
                  AI Travel Planner
                </span>
              </div>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Plan your dream trip smarter, faster and stress-free — destinations, budgets, and itineraries in one
              place.
            </p>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Stay in the loop</p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-3 flex items-center gap-2 rounded-2xl border border-border/70 bg-background/70 p-1.5 shadow-sm backdrop-blur-md focus-within:border-primary/40"
              >
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  aria-label="Email address"
                  className="w-full min-w-0 flex-1 bg-transparent px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <Button
                  type="submit"
                  size="icon"
                  aria-label="Subscribe"
                  className="h-8 w-8 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </form>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-4 border-t border-border/60 py-6 sm:flex-row sm:justify-between">
          <p className="text-center text-sm text-muted-foreground sm:text-left">
            © 2026 TripNest. Made with{" "}
            <span className="text-primary" aria-hidden>
              ❤️
            </span>{" "}
            for Travelers.
          </p>

          <div className="flex items-center gap-2">
            {socials.map((s) => {
              const Icon = s.icon
              return (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
