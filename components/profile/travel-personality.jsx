"use client"

import { Sparkles, Compass, Camera, Mountain, Wallet, Waves, ArrowRight } from "lucide-react"

export function TravelPersonality() {
  const preferences = [
    { label: "Mountain & Altitude Expeditions", score: 88, icon: Mountain, color: "from-primary to-teal-500" },
    { label: "Photography & Cultural Heritage", score: 92, icon: Camera, color: "from-amber-500 to-orange-500" },
    { label: "Budget-Conscious & Value Stays", score: 75, icon: Wallet, color: "from-emerald-500 to-teal-600" },
    { label: "Beach & Coastal Retreats", score: 60, icon: Waves, color: "from-blue-500 to-cyan-500" }
  ]

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-xl transition-all">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">AI Travel Insights</span>
            <h3 className="font-heading text-lg font-bold text-foreground">Your Travel Personality</h3>
          </div>
        </div>

        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          Adventure Explorer
        </span>
      </div>

      {/* Visual Preference Gauges */}
      <div className="space-y-3 mb-4">
        {preferences.map((p) => {
          const IconComp = p.icon
          return (
            <div key={p.label} className="rounded-2xl border border-border/50 bg-background/60 p-3">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-2 text-foreground">
                  <IconComp className="h-3.5 w-3.5 text-primary" />
                  {p.label}
                </span>
                <span className="font-bold text-primary">{p.score}% Match</span>
              </div>

              {/* Progress Track */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  style={{ width: `${p.score}%` }}
                  className={`h-full rounded-full bg-gradient-to-r ${p.color} transition-all duration-700`}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* AI Next Destination Recommendation Banner */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed flex items-center justify-between gap-3">
        <div>
          <span className="font-bold block text-foreground">AI Recommendation:</span>
          Based on your preference for mountain photography and budget stays, your next recommended destination is <strong className="text-emerald-600 dark:text-emerald-400">Ladakh or Spiti Valley!</strong>
        </div>
        <Compass className="h-6 w-6 text-emerald shrink-0" />
      </div>
    </div>
  )
}
