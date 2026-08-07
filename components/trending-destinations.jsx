"use client"

import { motion } from "framer-motion"

// Dense 19-Polaroid Scattered Wall Dataset (Matching Reference Image)
const polaroidCards = [
  { id: "goa", name: "Goa, India", vibe: "Sun, Sand & Serenity", rating: "4.8 ⭐", image: "/images/dest-goa.png", rotation: "-rotate-6", pos: "top-0 left-0 z-10" },
  { id: "manali", name: "Manali, India", vibe: "Snowy Escapes", rating: "4.6 ⭐", image: "/images/dest-manali.png", rotation: "rotate-6", pos: "top-2 left-28 sm:left-36 z-20" },
  { id: "shimla", name: "Shimla, India", vibe: "Colonial Pine Ridge", rating: "4.6 ⭐", image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=500&auto=format&fit=crop&q=80", rotation: "-rotate-3", pos: "top-0 left-56 sm:left-68 z-10" },
  { id: "munnar", name: "Munnar, India", vibe: "Rolling Tea Estates", rating: "4.8 ⭐", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&auto=format&fit=crop&q=80", rotation: "rotate-8", pos: "top-2 right-12 sm:right-20 z-20" },
  { id: "reykjavik", name: "Reykjavik, Iceland", vibe: "Nordic Charm", rating: "4.7 ⭐", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80", rotation: "-rotate-5", pos: "top-0 right-0 z-10" },
  
  { id: "alleppey", name: "Alleppey, India", vibe: "Backwater Bliss", rating: "4.9 ⭐", image: "/images/dest-kerala.png", rotation: "rotate-4", pos: "top-32 left-0 z-30" },
  { id: "santorini", name: "Santorini, Greece", vibe: "White Aegean Domes", rating: "4.8 ⭐", image: "/images/dest-santorini.png", rotation: "-rotate-7", pos: "top-28 left-24 sm:left-32 z-40" },
  { id: "bali", name: "Bali, Indonesia", vibe: "Island of the Gods", rating: "4.9 ⭐", image: "/images/dest-bali.png", rotation: "rotate-5", pos: "top-32 left-52 sm:left-64 z-30" },
  { id: "jaipur", name: "Jaipur, India", vibe: "Royal Heritage", rating: "4.7 ⭐", image: "/images/dest-jaipur.png", rotation: "-rotate-4", pos: "top-32 right-16 sm:right-24 z-20" },

  { id: "lake-louise", name: "Lake Louise, Canada", vibe: "Emerald Serenity", rating: "4.8 ⭐", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=80", rotation: "rotate-6", pos: "top-64 left-0 z-30" },
  { id: "queenstown", name: "Queenstown, NZ", vibe: "Adventure Awaits", rating: "4.8 ⭐", image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=500&auto=format&fit=crop&q=80", rotation: "-rotate-5", pos: "top-60 left-24 sm:left-32 z-40" },
  { id: "maldives", name: "Maldives", vibe: "Turquoise Bungalows", rating: "4.6 ⭐", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=80", rotation: "rotate-3", pos: "top-64 left-52 sm:left-64 z-30" },
  { id: "jaisalmer", name: "Jaisalmer, India", vibe: "The Golden City", rating: "4.9 ⭐", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&auto=format&fit=crop&q=80", rotation: "-rotate-8", pos: "top-60 right-20 sm:right-28 z-40" },
  { id: "darjeeling", name: "Darjeeling, India", vibe: "Tea & Tranquility", rating: "4.9 ⭐", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=500&auto=format&fit=crop&q=80", rotation: "rotate-5", pos: "top-64 right-0 z-30" },

  { id: "paris", name: "Paris, France", vibe: "City of Love", rating: "4.7 ⭐", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500&auto=format&fit=crop&q=80", rotation: "-rotate-4", pos: "top-[380px] left-0 z-40" },
  { id: "kyoto", name: "Kyoto, Japan", vibe: "Timeless Temples", rating: "4.8 ⭐", image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500&auto=format&fit=crop&q=80", rotation: "rotate-6", pos: "top-[380px] left-24 sm:left-32 z-50" },
  { id: "banff", name: "Banff, Canada", vibe: "Ice Mountain Magic", rating: "4.9 ⭐", image: "https://images.unsplash.com/photo-1603201667141-5a2d4c673378?w=500&auto=format&fit=crop&q=80", rotation: "-rotate-5", pos: "top-[380px] left-52 sm:left-64 z-40" },
  { id: "agra", name: "Agra, India", vibe: "Timeless Wonder", rating: "4.9 ⭐", image: "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=500&auto=format&fit=crop&q=80", rotation: "rotate-4", pos: "top-[380px] right-20 sm:right-28 z-50" },
  { id: "singapore", name: "Singapore", vibe: "City of Possibility", rating: "4.6 ⭐", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80", rotation: "-rotate-6", pos: "top-[380px] right-0 z-40" }
]

export function TrendingDestinations({ onNavigateView, onSelectDestination }) {
  return (
    <section id="destinations" className="relative bg-neutral-100 dark:bg-neutral-950 px-4 py-20 sm:px-6 lg:py-28 border-t border-border/60 overflow-hidden select-none">
      <div className="mx-auto max-w-7xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT SIDE: Dense 19-Polaroid Organic Scattered Wall (Exact Match to Reference Screenshot) */}
          <div className="lg:col-span-7 relative h-[560px] sm:h-[600px] w-full">
            
            {/* Soft Ambient Radial Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-emerald/10 to-transparent rounded-full blur-3xl -z-10" />

            {/* Dense Organic Polaroid Canvas */}
            <div className="relative h-full w-full">
              {polaroidCards.map((card, idx) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.03 }}
                  onClick={() => {
                    const cityName = card.name.split(",")[0].trim()
                    if (onSelectDestination) {
                      onSelectDestination(cityName)
                    } else if (onNavigateView) {
                      onNavigateView("itinerary", cityName)
                    }
                  }}
                  className={`absolute ${card.pos} ${card.rotation} w-32 sm:w-40 bg-white dark:bg-neutral-900 p-2 pb-3.5 shadow-[0_15px_35px_rgba(0,0,0,0.22)] rounded-sm border border-neutral-200 dark:border-neutral-800 transform hover:scale-115 hover:z-50 transition-all duration-300 cursor-pointer group`}
                >
                  {/* Polaroid Image Container */}
                  <div className="relative h-24 sm:h-28 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 rounded-xs">
                    <img
                      src={card.image}
                      alt={card.name}
                      className="h-full w-full object-cover filter contrast-[1.05] group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-full text-[8.5px] font-bold text-white">
                      {card.rating}
                    </div>
                  </div>

                  {/* Polaroid Frame Footer Caption */}
                  <div className="mt-2 px-0.5 text-left">
                    <h4 className="font-heading text-[10px] sm:text-[11px] font-extrabold text-neutral-900 dark:text-white truncate flex items-center gap-1">
                      <span className="text-rose-500">📍</span> {card.name}
                    </h4>
                    <p className="text-[8.5px] sm:text-[9.5px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate font-sans">
                      {card.vibe}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

          {/* RIGHT SIDE: High-Impact Editorial Text & Features */}
          <div className="lg:col-span-5 space-y-7 text-left">
            
            <div className="space-y-3">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-primary block">
                EXPLORE PLACES WITH TRIPNEST
              </span>

              <h2 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.08]">
                Trending This Season
              </h2>
            </div>

            <p className="font-sans text-base sm:text-lg leading-relaxed text-muted-foreground font-normal">
              Find which place calls you, plan your itinerary, and just Pack your Bags!
            </p>

            {/* Exciting High-Impact Feature Breakdown (No SVGs) */}
            <div className="space-y-4 pt-2">
              {[
                {
                  number: "01",
                  title: "Handpicked Escape Collections",
                  desc: "105+ hand-curated destinations across tropical coastlines, snowy alpine valleys, and royal palace forts."
                },
                {
                  number: "02",
                  title: "Transparent Realistic Trip Budgets",
                  desc: "Clear stay, dining, and transport estimates calculated upfront so you plan without price surprises."
                },
                {
                  number: "03",
                  title: "Dynamic Itinerary Optimization",
                  desc: "Drag, reorder, and schedule spots with live distance routes, opening hours, and travel timing."
                }
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-border/70 bg-card/80 shadow-sm hover:border-primary/40 transition-colors">
                  <span className="font-heading text-xl font-extrabold text-primary shrink-0 leading-none mt-0.5">
                    {feat.number}
                  </span>
                  <div>
                    <h4 className="font-heading text-sm font-extrabold text-foreground uppercase tracking-wider">
                      {feat.title}
                    </h4>
                    <p className="font-sans text-xs text-muted-foreground mt-1 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
