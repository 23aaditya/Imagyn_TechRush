"use client"

import { CheckCircle2, Circle, Clock, Check } from "lucide-react"

export function ProgressTracker({ totalDays = 5, completedDays = 2, currentDayIndex = 2 }) {
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1)
  const pct = Math.round((completedDays / totalDays) * 100)

  return (
    <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-md backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <div>
            <h4 className="font-heading text-sm font-bold text-foreground">Trip Progress Timeline</h4>
            <span className="text-[11px] text-muted-foreground">Track day-by-day status for this itinerary</span>
          </div>
        </div>

        <span className="rounded-full bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          Completed {completedDays} of {totalDays} Days ({pct}%)
        </span>
      </div>

      {/* Steps Timeline Line */}
      <div className="relative flex items-center justify-between gap-1 pt-2 overflow-x-auto pb-1 scrollbar-none">
        {daysArray.map((dayNum, idx) => {
          const isCompleted = dayNum <= completedDays
          const isCurrent = dayNum === completedDays + 1
          const isUpcoming = dayNum > completedDays + 1

          return (
            <div key={dayNum} className="flex-1 min-w-[70px] flex flex-col items-center group relative">
              {/* Connector Bar */}
              {idx < totalDays - 1 && (
                <div
                  className={`absolute top-3.5 left-1/2 w-full h-0.5 z-0 ${
                    dayNum <= completedDays ? "bg-emerald" : "bg-border"
                  }`}
                />
              )}

              {/* Node Icon */}
              <div
                className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all shadow-sm ${
                  isCompleted
                    ? "bg-emerald text-white"
                    : isCurrent
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : dayNum}
              </div>

              {/* Label */}
              <div className="mt-1.5 text-center">
                <span className="block text-[11px] font-bold text-foreground">Day {dayNum}</span>
                <span
                  className={`block text-[9px] font-semibold uppercase tracking-wider ${
                    isCompleted
                      ? "text-emerald-600 dark:text-emerald-400"
                      : isCurrent
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {isCompleted ? "Completed" : isCurrent ? "Active" : "Upcoming"}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
