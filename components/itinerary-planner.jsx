"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Sparkles,
  MapPin,
  Calendar,
  Compass,
  Clock,
  Coins,
  Share2,
  Download,
  Bookmark,
  CheckCircle,
  Sun,
  Utensils,
  Camera,
  Coffee,
  Bed,
  Car,
  ChevronRight,
  Filter,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"

const sampleDestinations = ["Goa, India", "Bali, Indonesia", "Manali, Himachal", "Jaipur, Rajasthan", "Santorini, Greece", "Kerala Backwaters"]

const presetItineraries = {
  "Goa, India": [
    {
      day: 1,
      title: "North Goa Beach Hop & Sunsets",
      activities: [
        { time: "09:00 AM", type: "Food", title: "Breakfast at Artjuna Cafe, Anjuna", desc: "Healthy smoothie bowls and fresh organic coffee", cost: "₹450", icon: Coffee },
        { time: "11:30 AM", type: "Sightseeing", title: "Explore Fort Aguada & Lighthouse", desc: "17th-century Portuguese fortress overlooking Arabian sea", cost: "₹200", icon: Camera },
        { time: "02:30 PM", type: "Relaxation", title: "Baga & Calangute Water Sports", desc: "Parasailing, banana boat ride and jet skiing", cost: "₹1,800", icon: Sun },
        { time: "06:30 PM", type: "Sunset", title: "Sunset Cocktails at Thalassa", desc: "Greek vibes on Vagator cliff edge", cost: "₹1,200", icon: Utensils }
      ]
    },
    {
      day: 2,
      title: "Heritage Fontainhas & Spice Plantation",
      activities: [
        { time: "09:30 AM", type: "Culture", title: "Latin Quarter (Fontainhas) Walking Tour", desc: "Pastel colored Portuguese heritage houses & art galleries", cost: "₹300", icon: MapPin },
        { time: "01:00 PM", type: "Experience", title: "Sahakari Spice Farm Lunch", desc: "Traditional Goan thali & guided botanical tour", cost: "₹800", icon: Utensils },
        { time: "05:00 PM", type: "Cruise", title: "Mandovi River Sunset Cruise", desc: "Live folk dance, DJ and scenic views", cost: "₹650", icon: Compass }
      ]
    },
    {
      day: 3,
      title: "South Goa Serenity & Beach Shacks",
      activities: [
        { time: "10:00 AM", type: "Nature", title: "Dudhsagar Waterfalls Trek", desc: "Four-tiered waterfall adventure in Bhagwan Mahaveer Sanctuary", cost: "₹1,500", icon: Camera },
        { time: "04:00 PM", type: "Relax", title: "Palolem Beach Kayaking", desc: "Calm turquoise waters & Butterfly beach island", cost: "₹500", icon: Sun }
      ]
    }
  ],
  "Bali, Indonesia": [
    {
      day: 1,
      title: "Ubud Cultural Heart & Rice Terraces",
      activities: [
        { time: "08:30 AM", type: "Nature", title: "Tegalalang Rice Terraces & Swing", desc: "Lush green terraced views and giant jungle swing", cost: "$15", icon: Camera },
        { time: "11:30 AM", type: "Culture", title: "Sacred Monkey Forest Sanctuary", desc: "Walk among ancient temple ruins and gray macaques", cost: "$8", icon: MapPin },
        { time: "02:00 PM", type: "Food", title: "Organic Lunch at Bebek Tepi Sawah", desc: "Crispy duck with traditional sambal sauces", cost: "$22", icon: Utensils }
      ]
    },
    {
      day: 2,
      title: "Uluwatu Sunset & Kecak Fire Dance",
      activities: [
        { time: "10:00 AM", type: "Beach", title: "Padang Padang Beach Surfing", desc: "Famous white sand cove with world-class waves", cost: "$20", icon: Sun },
        { time: "05:30 PM", type: "Show", title: "Uluwatu Cliffside Temple & Kecak Dance", desc: "Sunset performance against ocean backdrop", cost: "$18", icon: Compass }
      ]
    }
  ]
}

export function ItineraryPlanner({ onBack, onNavigateView }) {
  const [destination, setDestination] = useState("Goa, India")
  const [days, setDays] = useState(3)
  const [travelStyle, setTravelStyle] = useState("Balanced")
  const [budgetTier, setBudgetTier] = useState("Moderate")
  const [isGenerating, setIsGenerating] = useState(false)
  const [itinerary, setItinerary] = useState(presetItineraries["Goa, India"])
  const [saved, setSaved] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      const data = presetItineraries[destination] || presetItineraries["Goa, India"]
      setItinerary(data)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Top Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="rounded-xl border-border bg-background hover:bg-accent text-xs sm:text-sm"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Overview
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-foreground text-sm">AI Itinerary Generator</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              AI Engine v4.2 Ready
            </span>
          </div>
        </div>

        {/* Header Title */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Design Your Personalized Itinerary
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-2xl">
            Customize your trip parameters and generate an optimized day-by-day travel schedule with activity timings, cost estimates, and local recommendations.
          </p>
        </div>

        {/* Main Grid: Form Controls + Itinerary Output */}
        <div className="grid gap-8 lg:grid-cols-12">

          {/* Left Column: Interactive Generator Form Controls */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-6 sticky top-28">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  Trip Preferences
                </h3>
                <span className="text-xs text-muted-foreground">Smart Parameters</span>
              </div>

              {/* Destination Selector */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Destination
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {sampleDestinations.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Trip Duration */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Duration (Days)
                  </label>
                  <span className="text-sm font-bold text-primary">{days} Days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              {/* Travel Style */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Pace & Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Relaxed", "Balanced", "Packed"].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setTravelStyle(style)}
                      className={`rounded-xl border p-2.5 text-xs font-medium transition-all ${
                        travelStyle === style
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                          : "border-border text-muted-foreground hover:border-border/80"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Tier */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Budget Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Backpacker", tier: "Budget" },
                    { label: "Standard", tier: "Moderate" },
                    { label: "Luxury", tier: "Luxury" }
                  ].map((b) => (
                    <button
                      key={b.tier}
                      type="button"
                      onClick={() => setBudgetTier(b.tier)}
                      className={`rounded-xl border p-2.5 text-xs font-medium transition-all ${
                        budgetTier === b.tier
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                          : "border-border text-muted-foreground hover:border-border/80"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Action */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Generating Schedule...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Generate AI Itinerary
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Right Column: Generated Timeline Breakdown */}
          <div className="lg:col-span-8 space-y-6">

            {/* Trip Meta Card */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-md">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <MapPin className="h-4 w-4" />
                  {destination}
                </div>
                <h2 className="mt-1 text-2xl font-bold font-heading text-foreground">
                  {days}-Day {travelStyle} Itinerary
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSaved(!saved)}
                  className={`rounded-xl ${saved ? "bg-emerald/10 text-emerald-600 border-emerald/30" : ""}`}
                >
                  <Bookmark className="mr-1.5 h-4 w-4" />
                  {saved ? "Saved" : "Save Trip"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigateView("budget")}
                  className="rounded-xl border-border hover:bg-accent"
                >
                  <Coins className="mr-1.5 h-4 w-4" />
                  Check Budget
                </Button>
              </div>
            </div>

            {/* Days Breakdown */}
            <div className="space-y-6">
              {itinerary.map((dayPlan) => (
                <motion.div
                  key={dayPlan.day}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-border bg-card p-6 shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                        D{dayPlan.day}
                      </span>
                      <h3 className="font-heading text-lg font-bold text-foreground">
                        Day {dayPlan.day}: {dayPlan.title}
                      </h3>
                    </div>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                      {dayPlan.activities.length} Activities
                    </span>
                  </div>

                  <div className="space-y-4">
                    {dayPlan.activities.map((act, idx) => {
                      const IconComp = act.icon || MapPin
                      return (
                        <div
                          key={idx}
                          className="group relative flex items-start gap-4 rounded-2xl border border-border/50 bg-background/60 p-4 transition-all hover:border-primary/40 hover:bg-background"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <IconComp className="h-5 w-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h4 className="font-heading text-base font-semibold text-foreground">
                                {act.title}
                              </h4>
                              <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400 bg-emerald/10 px-2.5 py-0.5 rounded-full">
                                {act.cost}
                              </span>
                            </div>

                            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                              {act.desc}
                            </p>

                            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1 font-medium text-foreground">
                                <Clock className="h-3.5 w-3.5 text-primary" />
                                {act.time}
                              </span>
                              <span>•</span>
                              <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase">
                                {act.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
