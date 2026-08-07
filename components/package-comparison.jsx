"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, X, ArrowRightLeft } from "lucide-react"

const destinationPackages = {
  "Lonavala": {
    budget: { total: "₹15,000", transport: "₹3,500", food: "₹4,000", activities: "₹2,500" },
    stay: { fiveStar: true, threeStar: true, hostel: true, budgetStay: true },
    experience: {
      activities: "Fort trekking, Waterfall view, Caves, Chikki sampling",
      bestSeason: "Monsoon & Winter (Jul – Feb)",
      duration: "2–3 Days",
      crowdLevel: "Moderate (High on Weekends)",
      idealTraveler: "Weekend Explorers & Couples"
    }
  },
  "Manali": {
    budget: { total: "₹25,000", transport: "₹7,500", food: "₹6,000", activities: "₹4,500" },
    stay: { fiveStar: true, threeStar: true, hostel: true, budgetStay: true },
    experience: {
      activities: "Snow sports, Solang paragliding, Rafting, Cafe hopping",
      bestSeason: "Oct – May (Snow Season)",
      duration: "4–5 Days",
      crowdLevel: "High (Peak Season)",
      idealTraveler: "Adventurers & Honeymooners"
    }
  },
  "Goa": {
    budget: { total: "₹22,000", transport: "₹5,500", food: "₹6,500", activities: "₹4,000" },
    stay: { fiveStar: true, threeStar: true, hostel: true, budgetStay: true },
    experience: {
      activities: "Water sports, Beach shacks, Sunset cruise, Heritage walk",
      bestSeason: "Nov – Feb (Beach Season)",
      duration: "4–5 Days",
      crowdLevel: "High",
      idealTraveler: "Friends & Nightlife Lovers"
    }
  },
  "Kerala": {
    budget: { total: "₹28,000", transport: "₹6,000", food: "₹7,000", activities: "₹5,000" },
    stay: { fiveStar: true, threeStar: true, hostel: false, budgetStay: true },
    experience: {
      activities: "Houseboat cruise, Tea estate walk, Spice farm, Ayurveda",
      bestSeason: "Sep – Mar",
      duration: "5–6 Days",
      crowdLevel: "Moderate",
      idealTraveler: "Families & Couples"
    }
  },
  "Jaipur": {
    budget: { total: "₹18,000", transport: "₹4,500", food: "₹5,000", activities: "₹3,500" },
    stay: { fiveStar: true, threeStar: true, hostel: true, budgetStay: true },
    experience: {
      activities: "Amer fort light show, Palace tour, Bazaar shopping, Cooking class",
      bestSeason: "Oct – Mar",
      duration: "3–4 Days",
      crowdLevel: "Moderate to High",
      idealTraveler: "Culture & History Lovers"
    }
  },
  "Udaipur": {
    budget: { total: "₹24,000", transport: "₹5,000", food: "₹6,000", activities: "₹4,000" },
    stay: { fiveStar: true, threeStar: true, hostel: true, budgetStay: true },
    experience: {
      activities: "Lake Pichola boat ride, City Palace, Sunset dining, Cultural dance",
      bestSeason: "Oct – Mar",
      duration: "3–4 Days",
      crowdLevel: "Moderate",
      idealTraveler: "Romantic Couples & Royalty Seekers"
    }
  }
}

const availableDestinations = Object.keys(destinationPackages)

export function PackageComparison({ onNavigateView }) {
  const [destA, setDestA] = useState("Lonavala")
  const [destB, setDestB] = useState("Manali")

  const pkgA = destinationPackages[destA]
  const pkgB = destinationPackages[destB]

  return (
    <section id="packages" className="relative w-full py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-foreground">
            Compare Destination Packages
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground leading-relaxed">
            Select any two destinations to compare realistic trip costs, stay choices, and travel experiences side by side.
          </p>
        </div>

        {/* Destination Selectors Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4 rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-lg">
          
          <div className="flex-1 w-full text-center">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">First Destination</label>
            <select
              value={destA}
              onChange={(e) => setDestA(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background p-3 text-base font-bold text-primary outline-none focus:ring-2 focus:ring-primary/20 text-center cursor-pointer"
            >
              {availableDestinations.map((d) => (
                <option key={`a-${d}`} value={d} disabled={d === destB}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ArrowRightLeft className="h-5 w-5" />
          </div>

          <div className="flex-1 w-full text-center">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Second Destination</label>
            <select
              value={destB}
              onChange={(e) => setDestB(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background p-3 text-base font-bold text-emerald outline-none focus:ring-2 focus:ring-emerald/20 text-center cursor-pointer"
            >
              {availableDestinations.map((d) => (
                <option key={`b-${d}`} value={d} disabled={d === destA}>
                  {d}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Interactive Side-by-Side Comparison Matrix Table */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-4 sm:p-5 font-heading text-sm font-bold text-foreground w-1/3">Factor</th>
                  <th className="p-4 sm:p-5 font-heading text-lg font-extrabold text-primary w-1/3 text-center">{destA}</th>
                  <th className="p-4 sm:p-5 font-heading text-lg font-extrabold text-emerald-600 dark:text-emerald-400 w-1/3 text-center">{destB}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60 text-sm">
                
                {/* Section Header: Budget */}
                <tr className="bg-secondary/40">
                  <td colSpan={3} className="px-5 py-2.5 font-bold uppercase tracking-wider text-xs text-muted-foreground">
                    💰 Budget & Cost Breakdown
                  </td>
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-foreground">Total Estimated Cost</td>
                  <td className="p-4 font-bold text-primary text-center text-base">{pkgA.budget.total}</td>
                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400 text-center text-base">{pkgB.budget.total}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-muted-foreground">Transport Expense</td>
                  <td className="p-4 text-foreground text-center font-medium">{pkgA.budget.transport}</td>
                  <td className="p-4 text-foreground text-center font-medium">{pkgB.budget.transport}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-muted-foreground">Food & Dining Expense</td>
                  <td className="p-4 text-foreground text-center font-medium">{pkgA.budget.food}</td>
                  <td className="p-4 text-foreground text-center font-medium">{pkgB.budget.food}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-muted-foreground">Activity & Sightseeing Expense</td>
                  <td className="p-4 text-foreground text-center font-medium">{pkgA.budget.activities}</td>
                  <td className="p-4 text-foreground text-center font-medium">{pkgB.budget.activities}</td>
                </tr>



                {/* Section Header: Experience */}
                <tr className="bg-secondary/40">
                  <td colSpan={3} className="px-5 py-2.5 font-bold uppercase tracking-wider text-xs text-muted-foreground">
                    ✨ Travel Experience & Highlights
                  </td>
                </tr>

                <tr>
                  <td className="p-4 font-medium text-muted-foreground">Key Activities</td>
                  <td className="p-4 text-xs font-medium text-foreground text-center">{pkgA.experience.activities}</td>
                  <td className="p-4 text-xs font-medium text-foreground text-center">{pkgB.experience.activities}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-muted-foreground">Best Season</td>
                  <td className="p-4 text-xs font-semibold text-foreground text-center">{pkgA.experience.bestSeason}</td>
                  <td className="p-4 text-xs font-semibold text-foreground text-center">{pkgB.experience.bestSeason}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-muted-foreground">Ideal Trip Duration</td>
                  <td className="p-4 text-xs font-semibold text-foreground text-center">{pkgA.experience.duration}</td>
                  <td className="p-4 text-xs font-semibold text-foreground text-center">{pkgB.experience.duration}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-muted-foreground">Crowd Level</td>
                  <td className="p-4 text-xs text-foreground text-center">{pkgA.experience.crowdLevel}</td>
                  <td className="p-4 text-xs text-foreground text-center">{pkgB.experience.crowdLevel}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-muted-foreground">Ideal Traveler Type</td>
                  <td className="p-4 text-xs font-bold text-primary text-center">{pkgA.experience.idealTraveler}</td>
                  <td className="p-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 text-center">{pkgB.experience.idealTraveler}</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  )
}

function renderBool(val) {
  return val ? (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald/15 text-emerald font-bold">
      <Check className="h-4 w-4" />
    </span>
  ) : (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <X className="h-4 w-4" />
    </span>
  )
}
