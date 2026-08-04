"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Compass,
  Info,
  ArrowRight,
  CalendarDays,
  Lock
} from "lucide-react"
import { useItinerary } from "@/lib/itinerary-context"
import { useAuth } from "@/lib/auth-context"

export function ItineraryBuilder() {
  const {
    selectedDestinationKey,
    setDestination,
    destinationMeta,
    activeDay,
    setActiveDay,
    days,
    currentDayAttractions,
    grandTotalBudget,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    travelDatesSpan,
    addDay,
    removeDay,
    addAttraction,
    removeAttraction,
    moveAttraction
  } = useItinerary()

  const { isLoggedIn, requireAuth, openAuthModal } = useAuth()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newCategory, setNewCategory] = useState("Recommended")
  const [newCost, setNewCost] = useState("")
  const [newTime, setNewTime] = useState("02:00 PM - 04:00 PM")
  const [newNotes, setNewNotes] = useState("")

  const popularTabList = ["Agra", "Jaipur", "Goa", "Kerala", "Manali", "Udaipur", "Shimla"]
  const displayTabs = [...new Set([...popularTabList, selectedDestinationKey])]

  const handleOpenAddModal = () => {
    requireAuth(
      () => setIsAddModalOpen(true),
      "Please sign in to add custom activities to your itinerary"
    )
  }

  const handleAddDay = () => {
    requireAuth(
      addDay,
      "Please sign in to extend trip days and build multi-day itineraries"
    )
  }

  const handleRemoveAttraction = (dayNum, itemId) => {
    requireAuth(
      () => removeAttraction(dayNum, itemId),
      "Please sign in to edit and remove itinerary activities"
    )
  }

  const handleMoveAttraction = (dayNum, index, direction) => {
    requireAuth(
      () => moveAttraction(dayNum, index, direction),
      "Please sign in to reorder itinerary activities"
    )
  }

  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    addAttraction(activeDay, {
      name: newTitle,
      category: newCategory,
      cost: Number.parseInt(newCost) || 0,
      visitTime: newTime || "Flexible",
      notes: newNotes || "Custom attraction added to plan."
    })
    setNewTitle("")
    setNewCost("")
    setNewNotes("")
    setIsAddModalOpen(false)
  }

  const categoryBadgeStyles = {
    "Must Visit": "bg-emerald/15 text-emerald border-emerald/30",
    Recommended: "bg-primary/15 text-primary border-primary/30",
    "Hidden Gem": "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30"
  }

  const mustVisitCount = currentDayAttractions.filter((a) => a.category === "Must Visit").length
  const hiddenGemsCount = currentDayAttractions.filter((a) => a.category === "Hidden Gem").length
  const recommendedCount = currentDayAttractions.filter((a) => a.category === "Recommended").length

  return (
    <section id="itinerary" className="relative w-full py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Compass className="h-3.5 w-3.5 text-primary" aria-hidden />
            Intelligent Smart Itinerary Builder
          </span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            Auto-Generated & Completely Customizable
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground leading-relaxed">
            Select or search any destination to generate an instant draft schedule with <span className="font-semibold text-emerald">Must Visit</span> landmarks, <span className="font-semibold text-primary">Recommended</span> spots, and <span className="font-semibold text-purple-500">Hidden Gems</span>.
          </p>

          {/* Quick Destination Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {displayTabs.map((destKey) => {
              const isSelected = selectedDestinationKey.toLowerCase() === destKey.toLowerCase()
              return (
                <button
                  key={destKey}
                  onClick={() => setDestination(destKey)}
                  className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    isSelected
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {destKey}
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Card Container */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl md:p-8">

          {/* Unauthenticated Login Notice */}
          {!isLoggedIn && (
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-xs">
              <div className="flex items-center gap-2.5 text-foreground font-medium">
                <Lock className="h-4 w-4 text-primary shrink-0" />
                <span>
                  Log in to customize activities, add custom trip days, reorder stops, and save your trip plan.
                </span>
              </div>
              <button
                onClick={() => openAuthModal("Sign in to edit custom itineraries and add places", "login")}
                className="shrink-0 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all"
              >
                Sign In to Customize
              </button>
            </div>
          )}

          {/* Top Bar: Active Destination info, Travel Dates Span badge & Day navigation */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between pb-6 border-b border-border">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-heading text-2xl font-bold text-foreground">{destinationMeta.name}</h3>
                <span className="rounded-full bg-emerald/10 px-3 py-0.5 text-xs font-medium text-emerald">
                  {destinationMeta.tagline}
                </span>
                
                {/* Prominent Travel Dates Span Badge */}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <CalendarDays className="h-3.5 w-3.5 text-primary" />
                  Travel Dates: <strong>{travelDatesSpan}</strong>
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>Total Planned Days: <strong>{Object.keys(days).length} Days</strong></span>
                <span>•</span>
                <span className="font-medium text-foreground">Est. Total Budget: <strong>₹{grandTotalBudget.toLocaleString("en-IN")}</strong></span>
                <span>•</span>
                <div className="inline-flex items-center gap-1">
                  <span>Dates:</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      if (!isLoggedIn) {
                        openAuthModal("Sign in to modify your travel dates", "login")
                      } else {
                        setStartDate(e.target.value)
                      }
                    }}
                    className="rounded-md border border-border bg-background px-1.5 py-0.5 text-[11px] font-semibold text-foreground focus:outline-none cursor-pointer"
                  />
                  <span>to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      if (!isLoggedIn) {
                        openAuthModal("Sign in to modify your travel dates", "login")
                      } else {
                        setEndDate(e.target.value)
                      }
                    }}
                    className="rounded-md border border-border bg-background px-1.5 py-0.5 text-[11px] font-semibold text-foreground focus:outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Day Selector Buttons + '+' Extend Date Button */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {Object.keys(days).map((dayNumStr) => {
                const dayNum = Number.parseInt(dayNumStr)
                const isActive = activeDay === dayNum
                return (
                  <button
                    key={dayNum}
                    onClick={() => setActiveDay(dayNum)}
                    className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-primary/15 text-primary border border-primary/30"
                        : "border border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    Day {dayNum}
                  </button>
                )
              })}

              {/* Extend Date Button with '+' Sign */}
              <button
                onClick={handleAddDay}
                title="Extend Trip (+1 Day)"
                className="flex items-center gap-1.5 rounded-2xl border border-dashed border-primary bg-primary/10 px-4 py-2 text-sm font-bold text-primary shadow-sm transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>Add Day</span>
              </button>
            </div>
          </div>

          {/* Stats pills for active day */}
          <div className="my-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-border bg-background p-3.5">
              <span className="text-xs text-muted-foreground">Total Places</span>
              <p className="mt-0.5 font-heading text-lg font-bold text-foreground">{currentDayAttractions.length}</p>
            </div>
            <div className="rounded-2xl border border-emerald/20 bg-emerald/5 p-3.5">
              <span className="text-xs text-emerald font-medium">Must Visit</span>
              <p className="mt-0.5 font-heading text-lg font-bold text-emerald">{mustVisitCount}</p>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3.5">
              <span className="text-xs text-primary font-medium">Recommended</span>
              <p className="mt-0.5 font-heading text-lg font-bold text-primary">{recommendedCount}</p>
            </div>
            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-3.5">
              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Hidden Gems</span>
              <p className="mt-0.5 font-heading text-lg font-bold text-purple-600 dark:text-purple-400">{hiddenGemsCount}</p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="mb-6 flex items-center justify-between">
            <h4 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
              <span>Day {activeDay} Schedule</span>
              <span className="text-xs font-normal text-muted-foreground">({currentDayAttractions.length} activities)</span>
            </h4>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-primary/90 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Activity
            </button>
          </div>

          {/* Attractions List */}
          {currentDayAttractions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <Info className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <p className="mt-2 font-medium text-foreground">No activities scheduled for Day {activeDay}.</p>
              <p className="text-xs text-muted-foreground mt-1">Click "Add Activity" to start building your day.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {currentDayAttractions.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group relative flex flex-col gap-4 rounded-2xl border border-border/80 bg-background p-4 sm:p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="flex flex-col items-center justify-center pt-1 text-muted-foreground/60">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveAttraction(activeDay, index, -1)}
                          className="hover:text-foreground disabled:opacity-20 transition-colors"
                          title="Move up"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <span className="text-[10px] font-mono text-muted-foreground/80">{index + 1}</span>
                        <button
                          disabled={index === currentDayAttractions.length - 1}
                          onClick={() => handleMoveAttraction(activeDay, index, 1)}
                          className="hover:text-foreground disabled:opacity-20 transition-colors"
                          title="Move down"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h5 className="font-heading text-base font-semibold text-foreground">{item.name}</h5>
                          <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${categoryBadgeStyles[item.category] || categoryBadgeStyles.Recommended}`}>
                            {item.category}
                          </span>
                        </div>
                        {item.notes && (
                          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.notes}</p>
                        )}
                        <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            {item.visitTime}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-emerald" />
                            {item.type || "Sightseeing"}
                          </span>
                          <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                            Ticket: ₹{item.cost ? item.cost.toLocaleString("en-IN") : "Free"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-border/50 pt-3 md:border-t-0 md:pt-0">
                      <button
                        onClick={() => handleRemoveAttraction(activeDay, item.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Sync Notice Footer */}
          <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <span>Itinerary dynamically synchronizes with <strong>Budget Calculator</strong> and <strong>Interactive Map</strong>.</span>
            </div>
            <a href="#budget" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
              View Updated Budget <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Add Custom Activity Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl"
            >
              <h3 className="font-heading text-xl font-bold text-foreground">Add Custom Activity</h3>
              <p className="text-xs text-muted-foreground mt-1">Add a new place or custom note to Day {activeDay}.</p>

              <form onSubmit={handleAddSubmit} className="mt-5 space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground">Place / Activity Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Taj Mahal Sunrise Photo Walk"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground">Category Tag</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="Must Visit">Must Visit</option>
                      <option value="Recommended">Recommended</option>
                      <option value="Hidden Gem">Hidden Gem</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground">Est. Cost (₹)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newCost}
                      onChange={(e) => setNewCost(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground">Visit Timing</label>
                  <input
                    type="text"
                    placeholder="e.g. 05:00 PM - 07:00 PM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground">Notes / Tips</label>
                  <textarea
                    rows={2}
                    placeholder="Any tips, ticket notes, or clothing advice..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white hover:bg-primary/90"
                  >
                    Save Activity
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
