"use client"

import { motion } from "framer-motion"

const oldMoneyFeatures = [
  {
    num: "I",
    title: "Destination Discovery",
    desc: "Find the perfect destination that matches your mood, budget, and travel dreams."
  },
  {
    num: "II",
    title: "Smart Destination Comparison",
    desc: "Explore the world naturally with smart comparisons designed for effortless discovery."
  },
  {
    num: "III",
    title: "Custom Itinerary Builder",
    desc: "Your journey, perfectly planned with AI-powered itineraries tailored just for you."
  },
  {
    num: "IV",
    title: "Trip Budget Calculator",
    desc: "Know your travel costs before you book and explore with complete confidence."
  },
  {
    num: "V",
    title: "Context-Aware Maps",
    desc: "Everything around you—from landmarks to local favorites—exactly when you need it."
  },
  {
    num: "VI",
    title: "Live Expense Tracker",
    desc: "Track every rupee effortlessly and stay on budget throughout your adventure."
  },
  {
    num: "VII",
    title: "Curated Recommendations",
    desc: "Handpicked experiences that turn every trip into an unforgettable story."
  },
  {
    num: "VIII",
    title: "Smart Packing Checklist",
    desc: "Never forget the essentials with intelligent packing tailored to your journey."
  }
]

// 8 Bigger Interlocking Honeycomb Hexagons with Punchline Overlays
const honeycombTiles = [
  {
    id: "disc",
    punchline: "Find Your Vibe",
    title: "Discovery",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    offset: "translate-x-0"
  },
  {
    id: "comp",
    punchline: "Compare Places",
    title: "Comparison",
    img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
    offset: "translate-x-0"
  },
  {
    id: "itin",
    punchline: "Bespoke Routes",
    title: "Itineraries",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80",
    offset: "translate-x-0"
  },
  {
    id: "budg",
    punchline: "Know Your Cost",
    title: "Budgeting",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    offset: "-mt-10 sm:-mt-14 translate-x-1/2"
  },
  {
    id: "maps",
    punchline: "Explore Nearby",
    title: "Context Maps",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
    offset: "-mt-10 sm:-mt-14 translate-x-1/2"
  },
  {
    id: "exps",
    punchline: "Track Every Rupee",
    title: "Expenses",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80",
    offset: "-mt-10 sm:-mt-14 translate-x-1/2"
  },
  {
    id: "recs",
    punchline: "Handpicked Stays",
    title: "Curated Recommendations",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
    offset: "-mt-10 sm:-mt-14 translate-x-0"
  },
  {
    id: "pack",
    punchline: "Pack Essentials",
    title: "Smart Packing",
    img: "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=800&auto=format&fit=crop&q=80",
    offset: "-mt-10 sm:-mt-14 translate-x-0"
  }
]

export function WhyTripNest() {
  return (
    <section id="features" className="relative bg-background px-4 py-20 sm:px-6 lg:py-28 border-t border-border/60 overflow-hidden select-none">
      <div className="mx-auto max-w-7xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE: Rich Old Money Vibe Editorial Text */}
          <div className="lg:col-span-6 space-y-8 text-left">
            
            <div className="space-y-3">
              <span className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400 block">
                THE TRIPNEST PHILOSOPHY
              </span>

              <h2 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.06]">
                Why TripNest?
              </h2>

              <p className="font-sans text-base sm:text-lg leading-relaxed text-muted-foreground font-normal max-w-xl">
                Curated for discerning travelers — TripNest replaces chaotic planning with quiet precision, bespoke routes, and effortless elegance.
              </p>
            </div>

            {/* Old Money Roman Numeral Feature Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 border-t border-border/60 pt-6">
              {oldMoneyFeatures.map((feat) => (
                <div key={feat.num} className="space-y-1 group">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-xs font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                      {feat.num}.
                    </span>
                    <h3 className="font-heading text-sm font-extrabold text-foreground tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {feat.title}
                    </h3>
                  </div>
                  <p className="font-sans text-xs text-muted-foreground leading-relaxed font-normal pl-4">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT SIDE: Unified Interlocking Honeycomb Structure (Bigger Hexagons + Punchline Overlays) */}
          <div className="lg:col-span-6 relative flex justify-center items-center py-6">
            
            {/* Ambient Gold Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/15 via-amber-300/5 to-transparent rounded-full blur-3xl -z-10" />

            {/* Tight Interlocking Honeycomb Structure */}
            <div className="flex flex-col items-center justify-center -space-y-12 sm:-space-y-16">
              
              {/* Row 1: 3 Hexagons */}
              <div className="flex items-center justify-center -space-x-3 sm:-space-x-5">
                {honeycombTiles.slice(0, 3).map((tile, i) => (
                  <motion.div
                    key={tile.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="group relative w-36 h-40 sm:w-48 sm:h-52 overflow-hidden shadow-2xl bg-neutral-900 transition-transform duration-500 hover:scale-110 hover:z-50 cursor-default"
                    style={{
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                    }}
                  >
                    <img
                      src={tile.img}
                      alt={tile.title}
                      className="h-full w-full object-cover filter brightness-[0.75] contrast-[1.1] group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Dark Glass Overlay for Punchline Feature Text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-4 flex flex-col justify-end text-center">
                      <span className="font-heading text-[11px] sm:text-xs font-extrabold text-amber-400 tracking-wider uppercase mb-0.5">
                        {tile.punchline}
                      </span>
                      <span className="font-heading text-[9px] sm:text-[10px] text-white/80 font-semibold tracking-tight">
                        {tile.title}
                      </span>
                    </div>

                    <div 
                      className="absolute inset-0 border border-amber-500/30 pointer-events-none group-hover:border-amber-400/80 transition-colors"
                      style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Row 2: 3 Hexagons (Interlocked Staggered Offset) */}
              <div className="flex items-center justify-center -space-x-3 sm:-space-x-5">
                {honeycombTiles.slice(3, 6).map((tile, i) => (
                  <motion.div
                    key={tile.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (i + 3) * 0.06 }}
                    className="group relative w-36 h-40 sm:w-48 sm:h-52 overflow-hidden shadow-2xl bg-neutral-900 transition-transform duration-500 hover:scale-110 hover:z-50 cursor-default"
                    style={{
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                    }}
                  >
                    <img
                      src={tile.img}
                      alt={tile.title}
                      className="h-full w-full object-cover filter brightness-[0.75] contrast-[1.1] group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Dark Glass Overlay for Punchline Feature Text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-4 flex flex-col justify-end text-center">
                      <span className="font-heading text-[11px] sm:text-xs font-extrabold text-amber-400 tracking-wider uppercase mb-0.5">
                        {tile.punchline}
                      </span>
                      <span className="font-heading text-[9px] sm:text-[10px] text-white/80 font-semibold tracking-tight">
                        {tile.title}
                      </span>
                    </div>

                    <div 
                      className="absolute inset-0 border border-amber-500/30 pointer-events-none group-hover:border-amber-400/80 transition-colors"
                      style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Row 3: 2 Hexagons (Centered Under Row 2) */}
              <div className="flex items-center justify-center -space-x-3 sm:-space-x-5">
                {honeycombTiles.slice(6, 8).map((tile, i) => (
                  <motion.div
                    key={tile.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (i + 6) * 0.06 }}
                    className="group relative w-36 h-40 sm:w-48 sm:h-52 overflow-hidden shadow-2xl bg-neutral-900 transition-transform duration-500 hover:scale-110 hover:z-50 cursor-default"
                    style={{
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                    }}
                  >
                    <img
                      src={tile.img}
                      alt={tile.title}
                      className="h-full w-full object-cover filter brightness-[0.75] contrast-[1.1] group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Dark Glass Overlay for Punchline Feature Text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-4 flex flex-col justify-end text-center">
                      <span className="font-heading text-[11px] sm:text-xs font-extrabold text-amber-400 tracking-wider uppercase mb-0.5">
                        {tile.punchline}
                      </span>
                      <span className="font-heading text-[9px] sm:text-[10px] text-white/80 font-semibold tracking-tight">
                        {tile.title}
                      </span>
                    </div>

                    <div 
                      className="absolute inset-0 border border-amber-500/30 pointer-events-none group-hover:border-amber-400/80 transition-colors"
                      style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                    />
                  </motion.div>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
