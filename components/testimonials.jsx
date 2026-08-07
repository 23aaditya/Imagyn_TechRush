"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Quote, Plus, Trash2, X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

const initialUserReviews = [
  {
    id: 1,
    name: "Ananya Rao",
    trip: "Trip to Bali",
    location: "Bengaluru",
    rating: 5,
    quote: "TripNest made planning our Bali itinerary effortless. The budget breakdown kept us on target throughout our vacation!",
    isOwn: false,
    date: "2 weeks ago"
  },
  {
    id: 2,
    name: "Devika Menon",
    trip: "Family Trip to Kerala",
    location: "Kochi",
    rating: 5,
    quote: "The destination package comparison saved our family significant money. The map exploration feature is fantastic!",
    isOwn: false,
    date: "1 month ago"
  },
  {
    id: 3,
    name: "Rohan Kapoor",
    trip: "Backpacking Manali",
    location: "Delhi",
    rating: 5,
    quote: "The day-by-day itinerary planner gave us super accurate activity costs and local recommendations. Highly recommended!",
    isOwn: false,
    date: "3 weeks ago"
  }
]

export function Testimonials() {
  const [reviews, setReviews] = useState(initialUserReviews)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  // Form state
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [trip, setTrip] = useState("")
  const [rating, setRating] = useState(5)
  const [quote, setQuote] = useState("")

  // Load user reviews from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tripnest_user_reviews")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.length > 0) {
          setReviews([...parsed, ...initialUserReviews])
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const saveReviewsToStorage = (updatedReviews) => {
    const userOnly = updatedReviews.filter((r) => r.isOwn)
    try {
      localStorage.setItem("tripnest_user_reviews", JSON.stringify(userOnly))
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddReview = (e) => {
    e.preventDefault()
    if (!name || !quote || !trip) return

    const newRev = {
      id: Date.now(),
      name,
      trip,
      location: location || "India",
      rating: Number(rating),
      quote,
      isOwn: true,
      date: "Just now"
    }

    const updated = [newRev, ...reviews]
    setReviews(updated)
    saveReviewsToStorage(updated)

    // Reset
    setName("")
    setLocation("")
    setTrip("")
    setQuote("")
    setRating(5)
    setAddModalOpen(false)
  }

  const handleDeleteReview = (id) => {
    const updated = reviews.filter((r) => r.id !== id)
    setReviews(updated)
    saveReviewsToStorage(updated)
    setDeleteConfirmId(null)
  }

  return (
    <section id="testimonials" className="relative w-full overflow-hidden bg-[#0D2B45] py-20 md:py-28">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/4 top-0 -z-10 h-72 w-72 rounded-full bg-[#8DBFB7]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-[#5A7D9A]/20 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-white">
            Traveler Reviews & Experiences
          </h2>
          <p className="mt-3 text-pretty text-white/70 leading-relaxed">
            Read reviews from fellow travelers or share your own journey experience with the community.
          </p>

          <Button
            onClick={() => setAddModalOpen(true)}
            className="mt-6 rounded-2xl bg-[#8DBFB7] px-6 py-2.5 font-semibold text-[#0D2B45] shadow-lg shadow-[#8DBFB7]/25 hover:bg-[#8DBFB7]/90"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Your Review
          </Button>
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((t, i) => {
            const initials = t.name.substring(0, 2).toUpperCase()
            return (
              <motion.article
                key={t.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xl transition-all duration-300 hover:border-neutral-300 hover:shadow-2xl"
              >
                <Quote
                  className="absolute -right-2 -top-2 h-20 w-20 text-neutral-200/50"
                  aria-hidden
                  strokeWidth={1}
                />

                {/* Rating */}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 ${
                          s < t.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-neutral-200 text-neutral-200"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Delete Option for Own Review */}
                  {t.isOwn && (
                    <button
                      onClick={() => setDeleteConfirmId(t.id)}
                      className="rounded-full p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete your review"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Quote */}
                <p className="relative mt-4 text-sm leading-relaxed text-neutral-800 font-medium">{t.quote}</p>

                {/* Author Info */}
                <div className="relative mt-6 flex items-center gap-3 border-t border-neutral-200/80 pt-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0D2B45] text-sm font-bold text-white shadow-sm">
                    {initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                      {t.name}
                      {t.isOwn && (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                          You
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-neutral-500 font-medium">
                      {t.trip} · {t.location}
                    </p>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>

      </div>

      {/* Add Review Modal */}
      <AnimatePresence>
        {addModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl"
            >
              <button
                onClick={() => setAddModalOpen(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="font-heading text-xl font-bold text-foreground mb-4">Add Your Review</h3>

              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full rounded-xl border border-border bg-card p-2.5 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Trip Name / Destination</label>
                  <input
                    type="text"
                    required
                    value={trip}
                    onChange={(e) => setTrip(e.target.value)}
                    placeholder="e.g. Trip to Jaipur"
                    className="w-full rounded-xl border border-border bg-card p-2.5 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Your Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full rounded-xl border border-border bg-card p-2.5 text-sm text-foreground outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full rounded-xl border border-border bg-card p-2.5 text-sm text-foreground outline-none focus:border-primary"
                    >
                      <option value="5">5 Stars ★★★★★</option>
                      <option value="4">4 Stars ★★★★☆</option>
                      <option value="3">3 Stars ★★★☆☆</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Review</label>
                  <textarea
                    required
                    rows={3}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Share your travel experience with TripNest..."
                    className="w-full rounded-xl border border-border bg-card p-2.5 text-sm text-foreground outline-none focus:border-primary resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl bg-primary py-2.5 font-semibold text-primary-foreground"
                >
                  Submit Review
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-sm rounded-3xl border border-border bg-background p-6 shadow-2xl text-center"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-6 w-6" />
              </div>

              <h3 className="font-heading text-lg font-bold text-foreground">Delete Review?</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Are you sure you want to delete your review? This action cannot be undone.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDeleteReview(deleteConfirmId)}
                  className="flex-1 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  )
}
