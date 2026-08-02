"use client"

import { motion } from "framer-motion"
import { Star, Quote, MessageSquareHeart } from "lucide-react"


const testimonials = [
  {
    name: "Ananya Rao",
    trip: "Solo trip to Bali",
    location: "Bengaluru, India",
    initials: "AR",
    gradient: "from-primary to-[oklch(0.7_0.15_230)]",
    quote:
      "TripNest planned my entire Bali trip in one evening. The budget calculator kept me from overspending on the boat trip to Nusa Penida, and every recommendation actually matched my pace.",
  },
  {
    name: "Devika Menon",
    trip: "Family trip to Kerala",
    location: "Kochi, India",
    initials: "DM",
    gradient: "from-emerald to-[oklch(0.75_0.15_85)]",
    quote:
      "Comparing packages side by side saved us close to ₹14,000. The expense tracker made it easy to keep four family members honest about the shared trip budget.",
  },
  {
    name: "Rohan Kapoor",
    trip: "Backpacking through Manali",
    location: "Delhi, India",
    initials: "RK",
    gradient: "from-[oklch(0.68_0.16_300)] to-primary",
    quote:
      "The itinerary felt like it was built by someone who actually treks. Daily budgets, transport options, even the weather calls — all in one clean dashboard.",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="relative w-full overflow-hidden bg-secondary/40 py-20 md:py-28">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/4 top-0 -z-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-emerald/15 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <MessageSquareHeart className="h-3.5 w-3.5 text-emerald" aria-hidden />
            Loved by Travelers
          </span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Real Trips, Real Savings
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            Thousands of travelers plan smarter with TripNest. Here&apos;s what a few of them have to say.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-background/60 p-6 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10"
            >
              <Quote
                className="absolute -right-2 -top-2 h-20 w-20 text-foreground/[0.04] transition-colors duration-300 group-hover:text-primary/[0.08]"
                aria-hidden
                strokeWidth={1}
              />

              {/* Rating */}
              <div className="relative flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-[oklch(0.75_0.15_85)] text-[oklch(0.75_0.15_85)]" aria-hidden />
                ))}
              </div>

              {/* Quote */}
              <p className="relative mt-4 text-sm leading-relaxed text-foreground/90">{t.quote}</p>

              {/* Author */}
              <div className="relative mt-6 flex items-center gap-3 border-t border-border/60 pt-5">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white shadow-md ${t.gradient}`}
                >
                  {t.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {t.trip} · {t.location}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
