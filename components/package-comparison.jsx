"use client"

import { motion } from "framer-motion"
import { Check, X, Star, Sparkles } from "lucide-react"

const providers = ["TripNest", "Travel Agency A", "Travel Agency B"]

const rows = [
  { label: "Price", values: ["₹38,000", "₹52,000", "₹47,500"] },
  { label: "Hotel", values: ["4★ Boutique Stay", "3★ Standard", "4★ Chain Hotel"] },
  { label: "Meals", values: [true, true, false] },
  { label: "Transport", values: ["Private Cab", "Shared Coach", "Shared Cab"] },
  { label: "Sightseeing", values: ["12 Spots", "8 Spots", "9 Spots"] },
  { label: "Rating", values: ["4.9", "4.2", "4.4"] },
]

function CellValue({ value }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald/15 text-emerald">
        <Check className="h-4 w-4" aria-hidden />
        <span className="sr-only">Included</span>
      </span>
    ) : (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <X className="h-4 w-4" aria-hidden />
        <span className="sr-only">Not included</span>
      </span>
    )
  }
  return <span>{value}</span>
}

export function PackageComparison({ onNavigateView, onOpenAuth }) {
  return (
    <section id="packages" className="relative w-full py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-emerald" aria-hidden />
            Transparent Pricing
          </span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Compare Packages in Seconds
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            See exactly what you get. TripNest bundles more value at a lower price than traditional travel agencies.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {providers.map((provider, col) => {
            const isFeatured = col === 0
            return (
              <motion.div
                key={provider}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: col * 0.1 }}
                className={
                  isFeatured
                    ? "relative rounded-3xl border-2 border-primary bg-card p-6 shadow-xl shadow-primary/10 md:-mt-4 md:mb-4"
                    : "relative rounded-3xl border border-border bg-card p-6 shadow-sm"
                }
              >
                {isFeatured && (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
                    <Star className="h-3.5 w-3.5 fill-current" aria-hidden />
                    Recommended
                  </span>
                )}

                <div className="mb-6 text-center">
                  <h3
                    className={
                      isFeatured
                        ? "font-heading text-xl font-bold text-primary"
                        : "font-heading text-xl font-bold text-foreground"
                    }
                  >
                    {provider}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {isFeatured ? "Smart, all-in-one plan" : "Traditional package"}
                  </p>
                </div>

                <ul className="space-y-4">
                  {rows.map((row) => (
                    <li key={row.label} className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span
                        className={
                          isFeatured
                            ? "text-right font-semibold text-foreground"
                            : "text-right font-medium text-foreground"
                        }
                      >
                        <CellValue value={row.values[col]} />
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    if (isFeatured) {
                      onNavigateView?.("itinerary")
                    } else {
                      onOpenAuth?.("signup")
                    }
                  }}
                  className={
                    isFeatured
                      ? "mt-8 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                      : "mt-8 w-full rounded-xl border border-border bg-background py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                  }
                >
                  {isFeatured ? "Launch AI Plan Generator" : "Sign Up For Offer"}
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
