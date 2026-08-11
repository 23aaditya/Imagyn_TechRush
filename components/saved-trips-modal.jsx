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
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-neutral-200 dark:border-white/15 bg-white dark:bg-[#181613] text-neutral-900 dark:text-[#F1ECE2] shadow-xl p-6 sm:p-8 space-y-6 max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4 shrink-0">
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#1E293B] dark:text-[#F1ECE2] flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#5A8CB2] dark:text-[#C98B55]" />
                    My Saved Trips & Offline Itineraries
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-[#A9A092] mt-0.5 font-medium">
                    Access your saved itineraries, open offline summary reports, or load into planner
                  </p>
                </div>
                <button
                  onClick={() => setSavedTripsModalOpen(false)}
                  className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Saved Trips Grid */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {savedTrips.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Sparkles className="h-10 w-10 text-neutral-300 dark:text-neutral-700 mx-auto" />
                    <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">No Saved Trips Found</p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">Save your active itinerary to view offline reports here anytime.</p>
                  </div>
                ) : (
                  savedTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="rounded-md border border-neutral-200 dark:border-white/15 bg-slate-50/80 dark:bg-[#211E19]/80 p-4 sm:p-5 shadow-xs hover:border-[#5A8CB2]/40 hover:bg-white dark:hover:bg-[#181613] transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading text-base font-bold text-[#1E293B] dark:text-[#F1ECE2]">
                              {trip.destination}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A8CB2] dark:text-[#C98B55] bg-[#5A8CB2]/10 dark:bg-[#C98B55]/10 px-2 py-0.5 rounded-sm border border-[#5A8CB2]/20 dark:border-[#C98B55]/20">
                              {trip.days} Days Itinerary
                            </span>
                          </div>

                          <p className="text-xs text-neutral-500 dark:text-[#A9A092] mt-1 flex items-center gap-3 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500" />
                              {trip.startDate} → {trip.endDate}
                            </span>
                            <span>•</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              ₹{(trip.totalBudget || 18500).toLocaleString("en-IN")} Est.
                            </span>
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteSavedTrip(trip.id)}
                          className="text-neutral-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Delete Saved Trip"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-200/80 dark:border-white/10">
                        <Button
                          size="sm"
                          onClick={() => setActiveReportTrip(trip)}
                          className="rounded-sm bg-[#5A8CB2] dark:bg-[#C98B55] text-white dark:text-[#11100E] hover:bg-[#4A7CA2] dark:hover:bg-[#b07847] font-semibold text-xs uppercase tracking-wider px-4 py-2 shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="h-4 w-4" />
                          View Offline Report Pass
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLoadTrip(trip)}
                          className="rounded-sm border-neutral-300 dark:border-white/20 text-[#1E293B] dark:text-[#F1ECE2] text-xs font-semibold uppercase tracking-wider px-4 py-2 hover:bg-neutral-100 dark:hover:bg-white/10 flex items-center gap-1.5 cursor-pointer"
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
              className="relative w-full max-w-3xl overflow-hidden rounded-xl border border-[#5A8CB2]/30 dark:border-[#C98B55]/30 bg-white dark:bg-[#181613] text-neutral-900 dark:text-[#F1ECE2] shadow-xl p-6 sm:p-8 space-y-6 my-auto print:shadow-none print:border-none print:w-full print:max-w-none print:rounded-none"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b-2 border-neutral-200 dark:border-white/15 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-[#5A8CB2] dark:bg-[#C98B55] flex items-center justify-center text-white dark:text-[#11100E] font-extrabold text-lg shadow-md">
                    TN
                  </div>
                  <div>
                    <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#1E293B] dark:text-[#F1ECE2]">
                      OFFLINE TRAVEL SUMMARY REPORT
                    </h2>
                    <p className="text-[11px] font-bold text-[#5A8CB2] dark:text-[#C98B55] uppercase tracking-wider">
                      TripNest Official Itinerary Pass • Save / Take Screenshot for Zero-Network Areas
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                  <Button
                    size="sm"
                    onClick={handlePrintReport}
                    className="rounded-sm bg-[#5A8CB2] dark:bg-[#C98B55] text-white dark:text-[#11100E] text-xs font-semibold uppercase tracking-wider px-3.5 py-2 hover:bg-[#4A7CA2] dark:hover:bg-[#b07847] shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Print / Export PDF
                  </Button>
                  <button
                    onClick={() => setActiveReportTrip(null)}
                    className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Trip Overview Pass Badge */}
              <div className="rounded-2xl bg-[#5A8CB2] dark:bg-[#C98B55] text-white dark:text-[#11100E] p-5 shadow-lg grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-[#C8D9E6] dark:text-[#11100E]/70 uppercase tracking-wider block">Destination</span>
                  <span className="font-heading text-base font-extrabold block truncate">{activeReportTrip.destination}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#C8D9E6] dark:text-[#11100E]/70 uppercase tracking-wider block">Travel Dates</span>
                  <span className="font-bold text-xs block">{activeReportTrip.startDate} - {activeReportTrip.endDate}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#C8D9E6] dark:text-[#11100E]/70 uppercase tracking-wider block">Duration</span>
                  <span className="font-bold text-xs block">{activeReportTrip.days} Days Itinerary</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#C8D9E6] dark:text-[#11100E]/70 uppercase tracking-wider block">Est. Budget</span>
                  <span className="font-extrabold text-sm block">₹{(activeReportTrip.totalBudget || 18500).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Day-by-Day Summary Schedule Table */}
              <div className="space-y-4">
                <h3 className="font-heading text-base font-extrabold text-[#1E293B] dark:text-[#F1ECE2] uppercase tracking-wider flex items-center gap-2 border-b dark:border-white/15 pb-2">
                  <Calendar className="h-4 w-4 text-[#5A8CB2] dark:text-[#C98B55]" />
                  Day-by-Day Offline Itinerary Schedule
                </h3>

                <div className="space-y-3">
                  {(activeReportTrip.itinerary || []).map((dayPlan, dIdx) => (
                    <div key={dIdx} className="rounded-2xl border border-neutral-200 dark:border-white/15 bg-slate-50/80 dark:bg-[#211E19]/80 p-4 space-y-2">
                      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-1.5">
                        <span className="font-heading text-xs font-extrabold text-[#1E293B] dark:text-[#F1ECE2] uppercase tracking-wider">
                          Day {dayPlan.day || dIdx + 1} ({dayPlan.date || `Day ${dIdx + 1}`})
                        </span>
                        <span className="text-[10px] font-bold text-neutral-500 dark:text-[#A9A092]">
                          {(dayPlan.activities || []).length} Attractions Scheduled
                        </span>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        {(dayPlan.activities || []).map((act, aIdx) => (
                          <div key={aIdx} className="p-2.5 rounded-xl bg-white dark:bg-[#181613] border border-neutral-200/80 dark:border-white/10 shadow-xs flex items-start gap-2.5">
                            <span className="text-xs font-bold text-[#5A8CB2] dark:text-[#C98B55] shrink-0 mt-0.5">
                              {act.time || "09:00 AM"}
                            </span>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-xs text-neutral-900 dark:text-[#F1ECE2] truncate">
                                {act.title || act.name}
                              </h4>
                              <p className="text-[10px] text-neutral-500 dark:text-[#A9A092] line-clamp-1">{act.desc}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-extrabold text-[#1E293B] dark:text-[#F1ECE2] bg-[#C8D9E6]/40 dark:bg-[#C98B55]/20 px-2 py-0.5 rounded-md">
                                  {act.category || act.type || "Sightseeing"}
                                </span>
                                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
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
