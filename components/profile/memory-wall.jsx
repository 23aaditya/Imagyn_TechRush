"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, MapPin, Heart, Bookmark, X, Sparkles, Pin } from "lucide-react"

const memorySnapshots = [
  {
    id: "solang-paragliding",
    title: "Solang Valley Paragliding",
    location: "Manali, Himachal",
    date: "Oct 2026",
    note: "Soaring 8,000 ft over misty pine forests in Solang Valley. The panoramic mountain view was breathtaking!",
    image: "/images/dest-manali.png",
    likes: 24,
    tag: "Mountain Adventure"
  },
  {
    id: "vagator-sunset",
    title: "Vagator Cliffside Sunset",
    location: "Vagator, Goa",
    date: "Nov 2026",
    note: "Golden hour hues over the Arabian Sea with chilled coconut water at Thalassa cliff edge.",
    image: "/images/dest-goa.png",
    likes: 38,
    tag: "Beach Sunset"
  },
  {
    id: "amber-fort",
    title: "Amber Fort Royal Reflection",
    location: "Jaipur, Rajasthan",
    date: "Dec 2026",
    note: "16th-century yellow sandstone arches reflecting in Maota Lake during golden hour.",
    image: "/images/dest-jaipur.png",
    likes: 19,
    tag: "Royal Architecture"
  },
  {
    id: "santorini-caldera",
    title: "Oia Sunset Caldera Walk",
    location: "Santorini, Greece",
    date: "Wishlist",
    note: "Whitewashed houses with blue domes overlooking the Aegean volcanic sea.",
    image: "/images/dest-santorini.png",
    likes: 45,
    tag: "Dream Bucketlist"
  }
]

export function MemoryWall() {
  const [selectedMemory, setSelectedMemory] = useState(null)

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
            <Camera className="h-5 w-5 text-amber-500" />
            Travel Memory Scrapbook Wall
          </h3>
          <p className="text-xs text-muted-foreground">Personal snapshots, journal entries, and saved destination moments.</p>
        </div>
        <span className="rounded-full bg-amber-500/10 px-3 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
          42 Saved Memories
        </span>
      </div>

      {/* Organic Scrapbook Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {memorySnapshots.map((item, idx) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.03, rotate: idx % 2 === 0 ? 1 : -1 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedMemory(item)}
            className="group relative cursor-pointer rounded-2xl border border-border/80 bg-card p-2.5 shadow-md backdrop-blur-md select-none transition-all hover:border-primary/50"
          >
            {/* Scrapbook Pin Graphic */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 text-[#6B4423]">
              <Pin className="h-4 w-4 fill-current drop-shadow" />
            </div>

            {/* Photo Card */}
            <div className="relative h-28 sm:h-32 w-full overflow-hidden rounded-xl mb-2">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white drop-shadow">
                {item.date}
              </span>
            </div>

            {/* Caption */}
            <div>
              <h4 className="font-heading text-xs font-bold text-foreground truncate">{item.title}</h4>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <MapPin className="h-3 w-3 text-[#6B4423]" />
                {item.location}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Memory Detail Modal Popup */}
      <AnimatePresence>
        {selectedMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4"
            >
              <button
                onClick={() => setSelectedMemory(null)}
                className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative h-56 w-full overflow-hidden rounded-2xl">
                <img src={selectedMemory.image} alt={selectedMemory.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="rounded-full bg-primary/80 px-2.5 py-0.5 text-[10px] font-bold">
                    {selectedMemory.tag}
                  </span>
                  <h3 className="font-heading text-xl font-bold mt-1">{selectedMemory.title}</h3>
                  <span className="text-xs opacity-90">{selectedMemory.location} • {selectedMemory.date}</span>
                </div>
              </div>

              <div className="rounded-2xl bg-background/80 p-4 border border-border/60 text-xs leading-relaxed italic text-foreground">
                &quot;{selectedMemory.note}&quot;
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
