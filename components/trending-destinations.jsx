"use client"

import { motion } from "framer-motion"
import { Compass, ShieldCheck, Sparkles, MapPin } from "lucide-react"

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

export function TrendingDestinations({ onNavigateView, onSelectDestination }) {
  return (
    <section id="destinations" className="relative bg-neutral-100 dark:bg-neutral-950 px-4 py-20 sm:px-6 lg:py-28 border-t border-border/60 overflow-hidden select-none">
      <div className="mx-auto max-w-7xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT SIDE: Continuous Auto-Drift Wave & Expandable Polaroid Collage */}
          <div className="lg:col-span-7 relative h-[620px] sm:h-[680px] w-full">
            
            {/* Soft Ambient Radial Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#5B8DEF]/15 via-[#5B8DEF]/5 to-transparent rounded-full blur-3xl -z-10" />

            {/* Randomly Scattered Animated Polaroid Canvas */}
            <div className="relative h-full w-full">
              {polaroidCards.map((card, idx) => {
                const baseRotate = card.style.rotate
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    animate={{
                      y: [0, -9, 0, 9, 0],
                      x: [0, 5, 0, -5, 0],
                      rotate: [baseRotate, baseRotate + 2.5, baseRotate - 2.5, baseRotate]
                    }}
                    transition={{
                      y: { duration: 4.8 + (idx % 4) * 0.9, repeat: Infinity, ease: "easeInOut", delay: (idx % 5) * 0.2 },
                      x: { duration: 5.5 + (idx % 3) * 1.2, repeat: Infinity, ease: "easeInOut", delay: (idx % 4) * 0.3 },
                      rotate: { duration: 6.2 + (idx % 5) * 0.8, repeat: Infinity, ease: "easeInOut" }
                    }}
                    whileHover={{
                      scale: 1.25,
                      rotate: 0,
                      zIndex: 80,
                      transition: { duration: 0.25, ease: "easeOut" }
                    }}
                    onClick={() => onSelectDestination && onSelectDestination(card.name, 3)}
                    className="absolute w-28 sm:w-36 bg-white dark:bg-neutral-900 p-1.5 pb-3 shadow-[0_10px_25px_rgba(0,0,0,0.18)] hover:shadow-[0_20px_45px_rgba(91,141,239,0.35)] rounded-md border border-neutral-200 dark:border-neutral-800 cursor-pointer transition-shadow"
                    style={{
                      top: card.style.top,
                      left: card.style.left,
                      right: card.style.right,
                      zIndex: card.style.zIndex,
                    }}
                  >
                    {/* Polaroid Image */}
                    <div className="relative h-20 sm:h-24 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 rounded-xs">
                      <img
                        src={card.image}
                        alt={card.name}
                        className="h-full w-full object-cover filter contrast-[1.05] transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute top-0.5 right-0.5 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded-xs text-[7.5px] font-extrabold text-white shadow-xs">
                        {card.rating}
                      </div>
                    </div>

                    {/* Polaroid Caption */}
                    <div className="mt-1.5 px-0.5 text-left">
                      <h4 className="font-heading text-[9px] sm:text-[10px] font-bold text-neutral-900 dark:text-white truncate flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5 text-[#5B8DEF] shrink-0" />
                        <span>{card.name}</span>
                      </h4>
                      <p className="text-[7.5px] sm:text-[8.5px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate font-sans">
                        {card.vibe}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
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
              <span className="font-heading text-xs font-extrabold uppercase tracking-widest text-[#5B8DEF] block">
                EXPLORE PLACES WITH TRIPNEST
              </span>

              <h2 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.08]">
                Trending This Season
              </h2>
            </div>

            <p className="font-sans text-base sm:text-lg leading-relaxed text-muted-foreground font-normal">
              Find which place calls you, plan your itinerary, and just Pack your Bags!
            </p>

            {/* Feature Highlights — Interactive Expandable Cards */}
            <div className="space-y-3 pt-2">
              {[
                {
                  title: "Handpicked Escape Collections",
                  desc: "105+ hand-curated destinations across tropical coastlines, snowy alpine valleys, and royal palace forts.",
                  icon: Compass
                },
                {
                  title: "Transparent Realistic Trip Budgets",
                  desc: "Clear stay, dining, and transport estimates calculated upfront so you plan without price surprises.",
                  icon: ShieldCheck
                },
                {
                  title: "Dynamic Itinerary Optimization",
                  desc: "Drag, reorder, and schedule spots with live distance routes, opening hours, and travel timing.",
                  icon: Sparkles
                }
              ].map((feat, i) => {
                const IconComponent = feat.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.025, x: 6 }}
                    transition={{ duration: 0.35, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative p-4 rounded-xl border border-border/80 bg-card/80 hover:bg-card hover:border-[#5B8DEF] shadow-xs hover:shadow-md hover:shadow-[#5B8DEF]/15 transition-all cursor-pointer overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#5B8DEF] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#5B8DEF]/10 text-[#5B8DEF] group-hover:bg-[#5B8DEF] group-hover:text-[#0F172A] transition-colors shrink-0">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-heading text-xs font-extrabold text-foreground uppercase tracking-wider group-hover:text-[#5B8DEF] transition-colors">
                          {feat.title}
                        </h4>
                        <p className="font-sans text-xs text-muted-foreground mt-1 leading-relaxed font-medium">
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  )
}
