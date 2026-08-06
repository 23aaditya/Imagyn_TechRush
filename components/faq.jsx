"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, HelpCircle } from "lucide-react"


const faqs = [
  {
    question: "How does TripNest generate itineraries?",
    answer:
      "TripNest looks at your destination, dates, budget, and travel style, then assembles a day-by-day plan that balances sightseeing, rest, and travel time. It draws on real pricing and popularity data so the plan stays realistic, not just aspirational.",
  },
  {
    question: "Can I customize my itinerary?",
    answer:
      "Yes. Every stop, activity, and time slot can be edited, reordered, or swapped out. You can also lock in must-see places and let TripNest fill the rest of the schedule around them.",
  },
  {
    question: "How does budget calculation work?",
    answer:
      "TripNest breaks your total budget into accommodation, food, transport, activities, shopping, and an emergency buffer, based on real costs at your destination. As you adjust your trip, the breakdown updates so you always know where your money is going.",
  },
  {
    question: "Can I compare travel packages?",
    answer:
      "Yes. TripNest places its own recommended package side by side with offers from traditional travel agencies, comparing price, hotel quality, meals, transport, and sightseeing so you can see exactly what you're getting for what you pay.",
  },
  {
    question: "Will AI recommendations be available?",
    answer:
      "AI-curated recommendations for stays, food, and experiences are on the roadmap and rolling out progressively, tuned to your travel style so suggestions feel personal rather than generic.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="relative w-full py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <HelpCircle className="h-3.5 w-3.5 text-emerald" aria-hidden />
            Got Questions?
          </span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            Everything you need to know about planning your trip with TripNest.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`overflow-hidden rounded-2xl border bg-background/60 shadow-sm backdrop-blur-xl transition-colors duration-300 ${
                  isOpen ? "border-primary/30 shadow-lg shadow-primary/5" : "border-border/60"
                }`}
              >
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                >
                  <span
                    className={`text-sm font-semibold sm:text-base ${
                      isOpen ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isOpen ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
