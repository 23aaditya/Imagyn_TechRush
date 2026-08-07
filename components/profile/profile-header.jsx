"use client"

import { motion } from "framer-motion"
import {
  User,
  Mail,
  MapPin,
  Sparkles,
  Compass,
  ShieldCheck,
  Globe,
  Award,
  Calendar,
  Navigation,
  Heart,
  Plane,
  Camera,
  Mountain,
  Utensils,
  Landmark
} from "lucide-react"

export function ProfileHeader({ user }) {
  const name = user?.name || "Hemangi Vijay Patil"
  const email = user?.email || "hemangi.patil@example.com"
  const location = user?.location || "Mumbai, India"
  const bio = user?.bio || "Passionate travel explorer who loves discovering alpine mountain trails, coastal coves, and rich cultural heritage."
  const initials = user?.initials || name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()

  const travelerStats = [
    { label: "Trips Completed", value: "8 Trips", icon: Compass, color: "text-[#6B4423] bg-primary/10" },
    { label: "Cities Visited", value: "14 Cities", icon: MapPin, color: "text-emerald-600 dark:text-emerald-400 bg-emerald/10" },
    { label: "Distance Covered", value: "12,450 km", icon: Navigation, color: "text-amber-500 bg-amber-500/10" }
  ]

  const preferences = [
    { label: "Mountain Trekking", icon: Mountain },
    { label: "Landscape Photography", icon: Camera },
    { label: "Local Food Exploration", icon: Utensils },
    { label: "Heritage Forts", icon: Landmark }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card/95 to-primary/5 p-6 shadow-xl backdrop-blur-xl space-y-5"
    >
      {/* Background Subtle Travel Glow */}
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      {/* Main Info Top Section */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
        
        {/* Avatar with Glow Ring */}
        <div className="relative shrink-0">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-teal-500 to-emerald text-2xl font-extrabold text-white shadow-xl shadow-primary/25 border-2 border-white/20">
            {initials}
          </div>
          <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald text-white shadow-md border-2 border-background">
            <ShieldCheck className="h-4 w-4" />
          </span>
        </div>

        {/* Profile Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl truncate">
              {name}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400 backdrop-blur-md">
              <Award className="h-3.5 w-3.5" />
              Level 5 Master Wanderer
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-[#6B4423] shrink-0" />
              {email}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-emerald shrink-0" />
              {location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              Passport ID: <strong className="text-foreground">TN-984210-IN</strong>
            </span>
          </div>

          <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
            {bio}
          </p>
        </div>

      </div>

      {/* Quick Statistics Row */}
      <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-border/60">
        {travelerStats.map((s, idx) => {
          const IconComp = s.icon
          return (
            <div key={idx} className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-background/60 p-2.5 text-center">
              <span className={`flex h-7 w-7 items-center justify-center rounded-lg mb-1 ${s.color}`}>
                <IconComp className="h-3.5 w-3.5" />
              </span>
              <span className="font-heading text-sm font-extrabold text-foreground leading-none">{s.value}</span>
              <span className="text-[10px] font-medium text-muted-foreground mt-1 truncate">{s.label}</span>
            </div>
          )
        })}
      </div>

      {/* Travel Preferences & Details */}
      <div className="pt-2 border-t border-border/60">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Travel Style & Preferences
        </span>
        <div className="flex flex-wrap gap-1.5">
          {preferences.map((p) => {
            const IconComp = p.icon
            return (
              <span
                key={p.label}
                className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground transition-all hover:border-primary/40 select-none"
              >
                <IconComp className="h-3.5 w-3.5 text-primary" />
                {p.label}
              </span>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
