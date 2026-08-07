"use client"

import { motion } from "framer-motion"

// Dense 19-Polaroid Scattered Wall Dataset — More Random Scatter Layout
const polaroidCards = [
  { id: "goa", name: "Goa, India", vibe: "Sun, Sand & Serenity", rating: "4.8 ⭐", image: "/images/dest-goa.png", style: { top: "2%", left: "1%", rotate: -8, zIndex: 10 } },
  { id: "manali", name: "Manali, India", vibe: "Snowy Escapes", rating: "4.6 ⭐", image: "/images/dest-manali.png", style: { top: "0%", left: "22%", rotate: 5, zIndex: 20 } },
  { id: "shimla", name: "Shimla, India", vibe: "Colonial Pine Ridge", rating: "4.6 ⭐", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1000&auto=format&fit=crop&q=80", style: { top: "5%", left: "44%", rotate: -3, zIndex: 15 } },
  { id: "munnar", name: "Munnar, India", vibe: "Rolling Tea Estates", rating: "4.8 ⭐", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&auto=format&fit=crop&q=80", style: { top: "1%", left: "66%", rotate: 7, zIndex: 25 } },
  { id: "reykjavik", name: "Reykjavik, Iceland", vibe: "Nordic Charm", rating: "4.7 ⭐", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80", style: { top: "3%", right: "1%", rotate: -5, zIndex: 12 } },
  
  { id: "alleppey", name: "Alleppey, India", vibe: "Backwater Bliss", rating: "4.9 ⭐", image: "/images/dest-kerala.png", style: { top: "24%", left: "3%", rotate: 6, zIndex: 30 } },
  { id: "santorini", name: "Santorini, Greece", vibe: "White Aegean Domes", rating: "4.8 ⭐", image: "/images/dest-santorini.png", style: { top: "22%", left: "26%", rotate: -9, zIndex: 35 } },
  { id: "bali", name: "Bali, Indonesia", vibe: "Island of the Gods", rating: "4.9 ⭐", image: "/images/dest-bali.png", style: { top: "26%", left: "48%", rotate: 4, zIndex: 28 } },
  { id: "jaipur", name: "Jaipur, India", vibe: "Royal Heritage", rating: "4.7 ⭐", image: "/images/dest-jaipur.png", style: { top: "20%", right: "5%", rotate: -6, zIndex: 22 } },

  { id: "lake-louise", name: "Lake Louise, Canada", vibe: "Emerald Serenity", rating: "4.8 ⭐", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=80", style: { top: "46%", left: "0%", rotate: 3, zIndex: 18 } },
  { id: "queenstown", name: "Queenstown, NZ", vibe: "Adventure Awaits", rating: "4.8 ⭐", image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=500&auto=format&fit=crop&q=80", style: { top: "44%", left: "20%", rotate: -7, zIndex: 40 } },
  { id: "maldives", name: "Maldives", vibe: "Turquoise Bungalows", rating: "4.6 ⭐", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=80", style: { top: "48%", left: "42%", rotate: 5, zIndex: 32 } },
  { id: "jaisalmer", name: "Jaisalmer, India", vibe: "The Golden City", rating: "4.9 ⭐", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&auto=format&fit=crop&q=80", style: { top: "42%", left: "62%", rotate: -8, zIndex: 38 } },
  { id: "darjeeling", name: "Darjeeling, India", vibe: "Tea & Tranquility", rating: "4.9 ⭐", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=500&auto=format&fit=crop&q=80", style: { top: "46%", right: "2%", rotate: 6, zIndex: 26 } },

  { id: "paris", name: "Paris, France", vibe: "City of Love", rating: "4.7 ⭐", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500&auto=format&fit=crop&q=80", style: { top: "68%", left: "2%", rotate: -4, zIndex: 42 } },
  { id: "kyoto", name: "Kyoto, Japan", vibe: "Timeless Temples", rating: "4.8 ⭐", image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500&auto=format&fit=crop&q=80", style: { top: "66%", left: "24%", rotate: 8, zIndex: 45 } },
  { id: "banff", name: "Banff, Canada", vibe: "Ice Mountain Magic", rating: "4.9 ⭐", image: "https://images.unsplash.com/photo-1603201667141-5a2d4c673378?w=500&auto=format&fit=crop&q=80", style: { top: "70%", left: "46%", rotate: -6, zIndex: 36 } },
  { id: "agra", name: "Agra, India", vibe: "Timeless Wonder", rating: "4.9 ⭐", image: "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=500&auto=format&fit=crop&q=80", style: { top: "64%", left: "66%", rotate: 4, zIndex: 44 } },
  { id: "singapore", name: "Singapore", vibe: "City of Possibility", rating: "4.6 ⭐", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80", style: { top: "68%", right: "1%", rotate: -7, zIndex: 34 } }
]

export function TrendingDestinations() {
  return (
    <section id="destinations" className="relative bg-neutral-100 dark:bg-neutral-950 px-4 py-20 sm:px-6 lg:py-28 border-t border-border/60 overflow-hidden select-none">
      <div className="mx-auto max-w-7xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT SIDE: Dense Organic Scattered Polaroid Wall */}
          <div className="lg:col-span-7 relative h-[620px] sm:h-[680px] w-full">
            
            {/* Soft Ambient Radial Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-emerald/10 to-transparent rounded-full blur-3xl -z-10" />

            {/* Randomly Scattered Polaroid Canvas (Static layout, zero animations/transitions) */}
            <div className="relative h-full w-full">
              {polaroidCards.map((card) => (
                <div
                  key={card.id}
                  className="absolute w-28 sm:w-36 bg-white dark:bg-neutral-900 p-1.5 pb-3 shadow-[0_12px_30px_rgba(0,0,0,0.2)] rounded-sm border border-neutral-200 dark:border-neutral-800 cursor-default"
                  style={{
                    top: card.style.top,
                    left: card.style.left,
                    right: card.style.right,
                    zIndex: card.style.zIndex,
                    transform: `rotate(${card.style.rotate}deg)`,
                  }}
                >
                  {/* Polaroid Image */}
                  <div className="relative h-20 sm:h-24 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 rounded-xs">
                    <img
                      src={card.image}
                      alt={card.name}
                      className="h-full w-full object-cover filter contrast-[1.05]"
                    />
                    <div className="absolute top-0.5 right-0.5 bg-black/60 backdrop-blur-md px-1 py-0.5 rounded-full text-[7px] font-bold text-white">
                      {card.rating}
                    </div>
                  </div>

                  {/* Polaroid Caption */}
                  <div className="mt-1.5 px-0.5 text-left">
                    <h4 className="font-heading text-[9px] sm:text-[10px] font-extrabold text-neutral-900 dark:text-white truncate flex items-center gap-0.5">
                      <span className="text-rose-500">📍</span> {card.name}
                    </h4>
                    <p className="text-[7.5px] sm:text-[8.5px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate font-sans">
                      {card.vibe}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT SIDE: Editorial Text & Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-7 text-left"
          >
            
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

            {/* Feature Highlights — No Numbering, Staggered Transitions */}
            <div className="space-y-4 pt-2">
              {[
                {
                  emoji: "✦",
                  title: "Handpicked Escape Collections",
                  desc: "105+ hand-curated destinations across tropical coastlines, snowy alpine valleys, and royal palace forts."
                },
                {
                  emoji: "◈",
                  title: "Transparent Realistic Trip Budgets",
                  desc: "Clear stay, dining, and transport estimates calculated upfront so you plan without price surprises."
                },
                {
                  emoji: "❖",
                  title: "Dynamic Itinerary Optimization",
                  desc: "Drag, reorder, and schedule spots with live distance routes, opening hours, and travel timing."
                }
              ].map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-border/70 bg-card/80 shadow-sm hover:border-primary/40 transition-colors"
                >
                  <span className="font-heading text-xl text-primary shrink-0 leading-none mt-0.5">
                    {feat.emoji}
                  </span>
                  <div>
                    <h4 className="font-heading text-sm font-extrabold text-foreground uppercase tracking-wider">
                      {feat.title}
                    </h4>
                    <p className="font-sans text-xs text-muted-foreground mt-1 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  )
}
