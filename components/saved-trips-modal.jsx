"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Trash2,
  X,
  Printer,
  Download,
  Share2,
  ShieldAlert,
  Coins,
  CheckCircle2,
  FileText,
  ExternalLink,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTrip } from "@/context/trip-context"

export function SavedTripsModal({ onSelectDestination }) {
  const {
    savedTrips,
    savedTripsModalOpen,
    setSavedTripsModalOpen,
    activeReportTrip,
    setActiveReportTrip,
    deleteSavedTrip,
    setDestination,
    setStartDate,
    setEndDate,
    setDays,
    setItinerary
  } = useTrip()

  // Load a saved trip into active workspace
  const handleLoadTrip = (trip) => {
    if (trip.destination) setDestination(trip.destination)
    if (trip.startDate) setStartDate(trip.startDate)
    if (trip.endDate) setEndDate(trip.endDate)
    if (trip.days) setDays(trip.days)
    if (trip.itinerary) setItinerary(trip.itinerary)
    setSavedTripsModalOpen(false)
    if (onSelectDestination) {
      onSelectDestination(trip.destination)
    }
  }

  // Handle Print / PDF Download
  const handlePrintReport = () => {
    window.print()
  }

  return (
    <>
      {/* ─────────────────────────────────────────────
          1. MY SAVED TRIPS DRAWER / LIST MODAL
         ───────────────────────────────────────────── */}
      <AnimatePresence>
        {savedTripsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-neutral-200 bg-white text-neutral-900 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4 shrink-0">
                <div>
                  <h3 className="font-heading text-2xl font-extrabold text-[#0D2B45] flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-amber-500" />
                    My Saved Trips & Offline Itineraries
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                    Access your saved itineraries, open offline summary reports, or load into planner
                  </p>
                </div>
                <button
                  onClick={() => setSavedTripsModalOpen(false)}
                  className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Saved Trips Grid */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {savedTrips.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Sparkles className="h-12 w-12 text-neutral-300 mx-auto" />
                    <p className="text-sm font-bold text-neutral-700">No Saved Trips Found</p>
                    <p className="text-xs text-neutral-400">Save your active itinerary to view offline reports here anytime.</p>
                  </div>
                ) : (
                  savedTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5 shadow-sm hover:border-[#0D2B45]/40 hover:bg-white transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading text-lg font-extrabold text-[#0D2B45]">
                              {trip.destination}
                            </span>
                            <span className="rounded-full bg-amber-400/20 text-amber-600 text-[10px] font-extrabold px-2.5 py-0.5 border border-amber-400/30">
                              {trip.days} Days Itinerary
                            </span>
                          </div>

                          <p className="text-xs text-neutral-500 mt-1 flex items-center gap-3 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                              {trip.startDate} → {trip.endDate}
                            </span>
                            <span>•</span>
                            <span className="text-emerald-600 font-bold">
                              ₹{(trip.totalBudget || 18500).toLocaleString("en-IN")} Est.
                            </span>
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteSavedTrip(trip.id)}
                          className="text-neutral-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete Saved Trip"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-200/80">
                        <Button
                          size="sm"
                          onClick={() => setActiveReportTrip(trip)}
                          className="rounded-xl bg-amber-400 text-[#0D2B45] hover:bg-amber-300 font-extrabold text-xs px-4 py-2 shadow flex items-center gap-1.5"
                        >
                          <FileText className="h-4 w-4" />
                          View Offline Report Pass
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLoadTrip(trip)}
                          className="rounded-xl border-neutral-300 text-[#0D2B45] text-xs font-bold px-4 py-2 hover:bg-neutral-100 flex items-center gap-1.5"
                        >
                          Open in Planner
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────
          2. OFFLINE TRAVEL SUMMARY & PRINTABLE SCREENSHOT PASS MODAL
         ───────────────────────────────────────────── */}
      <AnimatePresence>
        {activeReportTrip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl border-2 border-[#0D2B45]/20 bg-white text-neutral-900 shadow-2xl p-6 sm:p-8 space-y-6 my-auto print:shadow-none print:border-none print:w-full print:max-w-none print:rounded-none"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-[#0D2B45] flex items-center justify-center text-amber-400 font-extrabold text-lg shadow-md">
                    TN
                  </div>
                  <div>
                    <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0D2B45]">
                      OFFLINE TRAVEL SUMMARY REPORT
                    </h2>
                    <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                      TripNest Official Itinerary Pass • Save / Take Screenshot for Zero-Network Areas
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                  <Button
                    size="sm"
                    onClick={handlePrintReport}
                    className="rounded-xl bg-[#0D2B45] text-white text-xs font-bold px-3.5 py-2 hover:bg-[#12395b] shadow flex items-center gap-1.5"
                  >
                    <Printer className="h-4 w-4" />
                    Print / Save PDF
                  </Button>
                  <button
                    onClick={() => setActiveReportTrip(null)}
                    className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Trip Key Details Card */}
              <div className="rounded-2xl bg-[#0D2B45] text-white p-5 shadow-lg grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Destination</span>
                  <span className="font-heading font-extrabold text-base sm:text-lg text-white block truncate">
                    {activeReportTrip.destination}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Travel Dates</span>
                  <span className="font-bold text-xs sm:text-sm text-white block">
                    {activeReportTrip.startDate} → {activeReportTrip.endDate}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Duration</span>
                  <span className="font-bold text-xs sm:text-sm text-white block">
                    {activeReportTrip.days} Days ({activeReportTrip.travelers || 2} Travelers)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Est. Budget</span>
                  <span className="font-extrabold text-sm sm:text-base text-amber-300 block">
                    ₹{(activeReportTrip.totalBudget || 18500).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Day-by-Day Summary Schedule Table */}
              <div className="space-y-4">
                <h3 className="font-heading text-base font-extrabold text-[#0D2B45] uppercase tracking-wider flex items-center gap-2 border-b pb-2">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  Day-by-Day Offline Itinerary Schedule
                </h3>

                <div className="space-y-3">
                  {(activeReportTrip.itinerary || []).map((dayPlan, dIdx) => (
                    <div key={dIdx} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
                      <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
                        <span className="font-heading text-xs font-extrabold text-[#0D2B45] uppercase tracking-wider">
                          Day {dayPlan.day || dIdx + 1} ({dayPlan.date || `Day ${dIdx + 1}`})
                        </span>
                        <span className="text-[10px] font-bold text-neutral-500">
                          {(dayPlan.activities || []).length} Attractions Scheduled
                        </span>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        {(dayPlan.activities || []).map((act, aIdx) => (
                          <div key={aIdx} className="p-2.5 rounded-xl bg-white border border-neutral-200/80 shadow-xs flex items-start gap-2.5">
                            <span className="text-xs font-bold text-amber-600 shrink-0 mt-0.5">
                              {act.time || "09:00 AM"}
                            </span>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-xs text-neutral-900 truncate">
                                {act.title || act.name}
                              </h4>
                              <p className="text-[10px] text-neutral-500 line-clamp-1">{act.desc}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-extrabold text-[#0D2B45] bg-neutral-100 px-2 py-0.5 rounded-md">
                                  {act.category || act.type || "Sightseeing"}
                                </span>
                                <span className="text-[9px] font-bold text-emerald-600">
                                  {act.cost || "₹350"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Essential Offline Guidelines & Checklist */}
              <div className="rounded-2xl bg-amber-400/10 border border-amber-400/30 p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-600 font-extrabold text-xs uppercase tracking-wider">
                  <ShieldAlert className="h-4 w-4" />
                  Essential Offline Travel Tips & Checklist
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold text-neutral-800">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Download Google Offline Map</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Carry Govt ID / Driving License</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Keep Emergency Local Cash</span>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="text-center pt-2 text-[10px] font-bold text-neutral-400 border-t">
                Generated by TripNest Imagyn • Save to Gallery / Print for offline reference
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
