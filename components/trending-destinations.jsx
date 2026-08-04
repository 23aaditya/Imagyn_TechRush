"use client"

import { motion } from "framer-motion"
import { MapPin, Star, Clock, Wallet, ArrowRight, CloudSun, Snowflake, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useItinerary } from "@/lib/itinerary-context"

const destinations = [
  {
    name: "Goa",
    country: "India",
    image: "/images/dest-goa.png",
    budget: "₹12,500",
    duration: "4–5 days",
    weather: { label: "31°C Sunny", icon: "sun" },
    rating: 4.8,
    tags: ["Beaches", "Nightlife"],
  },
  {
    name: "Jaipur",
    country: "India",
    image: "/images/dest-jaipur.png",
    budget: "₹9,800",
    duration: "3–4 days",
    weather: { label: "29°C Clear", icon: "sun" },
    rating: 4.7,
    tags: ["Heritage", "Culture"],
  },
  {
    name: "Kerala",
    country: "India",
    image: "/images/dest-kerala.png",
    budget: "₹16,500",
    duration: "5–6 days",
    weather: { label: "27°C Humid", icon: "cloud" },
    rating: 4.9,
    tags: ["Nature", "Backwaters"],
  },
  {
    name: "Manali",
    country: "India",
    image: "/images/dest-manali.png",
    budget: "₹11,500",
    duration: "4–5 days",
    weather: { label: "12°C Snowy", icon: "snow" },
    rating: 4.6,
    tags: ["Mountains", "Adventure"],
  },
  {
    name: "Bali",
    country: "Indonesia",
    image: "/images/dest-bali.png",
    budget: "₹45,000",
    duration: "6–7 days",
    weather: { label: "30°C Tropical", icon: "sun" },
    rating: 4.9,
    tags: ["Beaches", "Luxury"],
  },
  {
    name: "Santorini",
    country: "Greece",
    image: "/images/dest-santorini.png",
    budget: "₹75,000",
    duration: "5–6 days",
    weather: { label: "26°C Sunny", icon: "sun" },
    rating: 4.8,
    tags: ["Luxury", "Romance"],
  },
]

const weatherIcon = { sun: Sun, cloud: CloudSun, snow: Snowflake }

export function TrendingDestinations() {
  const { setDestination } = useItinerary()

  const handleExplore = (destName) => {
    setDestination(destName)
    const el = document.getElementById("itinerary")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="destinations" className="relative bg-background px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl"
          >
            <span aria-hidden>🔥 </span>Trending This Season
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-lg leading-relaxed text-pretty text-muted-foreground"
          >
            Discover destinations based on seasonal weather & budget.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest, i) => {
            const WeatherIcon = weatherIcon[dest.weather.icon]
            return (
              <motion.article
                key={dest.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8 }}
                className="group overflow-hidden rounded-3xl border border-border/70 bg-card shadow-lg shadow-black/5 transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/10"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={dest.image || "/placeholder.svg"}
                    alt={`${dest.name}, ${dest.country}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                    <WeatherIcon className="h-3.5 w-3.5" />
                    {dest.weather.label}
                  </span>

                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-bold text-foreground backdrop-blur-md">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {dest.rating}
                  </span>

                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-heading text-xl font-bold leading-tight drop-shadow-sm">{dest.name}</h3>
                    <p className="flex items-center gap-1 text-sm text-white/85">
                      <MapPin className="h-3.5 w-3.5" />
                      {dest.country}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Wallet className="h-4 w-4 text-primary" />
                      <span className="font-bold">{dest.budget}</span>
                      <span className="text-muted-foreground">/ person</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-emerald" />
                      {dest.duration}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {dest.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleExplore(dest.name)}
                    variant="outline"
                    className="mt-5 h-11 w-full rounded-2xl border-border font-semibold text-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    Explore & Build Itinerary
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
