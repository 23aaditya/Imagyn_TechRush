"use client"

import { motion } from "framer-motion"
import { Layers, Wallet, TrendingUp, Check, ShieldCheck, Sparkles, Compass, MapPin, Award } from "lucide-react"

export function AvailableFeatures() {
  const featuresList = [
    {
      id: "packages",
      title: "Package Decision Engine",
      tagline: "Transparent Side-by-Side Comparison",
      badge: "Available Feature • Decision Engine",
      icon: Layers,
      color: "#C98B55",
      description: "Compare travel packages side-by-side with dynamic Match Scores (0–100%), estimated actual trip costs, trip pace gauges, and honest trade-off analysis.",
      capabilities: [
        "Personal Match Score (0–100%)",
        "Estimated Total Trip Cost Breakdown",
        "Trip Pace (Relaxed vs Packed)",
        "Side-by-Side Category Matrix"
      ]
    },
    {
      id: "budget",
      title: "Smart Budget Allocator",
      tagline: "Destination-Aware Cost Breakdown",
      badge: "Available Feature • Budgeting",
      icon: Wallet,
      color: "#5A8CB2",
      description: "Distribute your trip budget across accommodation, food, transport, activities, shopping, and emergency buffers based on real regional pricing.",
      capabilities: [
        "Category Expenditure Caps",
        "Stay Tier Budget Tuning",
        "Estimated Out-of-Pocket Dining",
        "Real-Time Funds Breakdown"
      ]
    },
    {
      id: "expenses",
      title: "Real-Time Expense Tracker",
      tagline: "Live Spend Logs & Offline Travel Pass",
      badge: "Available Feature • Expense Tracker",
      icon: TrendingUp,
      color: "#10B981",
      description: "Log daily expenses live, compare actual spending against your planned itinerary budget, and generate zero-network offline travel summary passes.",
      capabilities: [
        "Live Spending vs Planned Target",
        "Category Spend Distribution",
        "Offline Printable Itinerary Pass",
        "Instant Currency Calculation"
      ]
    }
  ]

  return (
    <section className="relative w-full py-16 sm:py-24 bg-background text-foreground border-t border-border/60 select-none font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-[#C98B55] block">
            BUILT-IN TRIPNEST CAPABILITIES
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground uppercase leading-none">
            Available Core Features
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            Everything you need for seamless travel planning — integrated directly inside TripNest with zero third-party redirects.
          </p>
        </div>

        {/* Feature Showcase Grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
          {featuresList.map((item, index) => {
            const IconComponent = item.icon
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="rounded-3xl border border-border/80 bg-card text-card-foreground p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden transition-all hover:border-[#C98B55]/50 hover:shadow-2xl"
              >
                <div className="space-y-4">
                  {/* Top Badge */}
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-secondary text-muted-foreground border border-border">
                    <ShieldCheck className="h-3.5 w-3.5" style={{ color: item.color }} />
                    {item.badge}
                  </span>

                  {/* Icon & Title */}
                  <div className="space-y-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/60 border border-border">
                      <IconComponent className="h-6 w-6" style={{ color: item.color }} />
                    </div>
                    <h3 className="font-heading text-2xl font-extrabold text-foreground leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs font-bold text-[#C98B55]">
                      {item.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  {/* Capability Highlights */}
                  <div className="pt-2 space-y-2 border-t border-border/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Feature Capabilities
                    </span>
                    <ul className="space-y-1.5 text-xs text-foreground">
                      {item.capabilities.map((cap, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 shrink-0" style={{ color: item.color }} />
                          <span className="font-medium text-xs">{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 text-center text-[11px] font-bold text-muted-foreground border-t border-border/40">
                  ✓ Active & Available in Workspace
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
