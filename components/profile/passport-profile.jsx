"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Compass, MapPin, Camera, Award, Sparkles, User, Globe } from "lucide-react"

export function PassportProfile({ user }) {
  const stats = [
    { label: "Trips Completed", value: "8", icon: Compass, color: "text-primary bg-primary/10" },
    { label: "Places Explored", value: "14 Cities", icon: MapPin, color: "text-emerald-600 dark:text-emerald-400 bg-emerald/10" },
    { label: "Travel Memories", value: "42 Moments", icon: Camera, color: "text-amber-500 bg-amber-500/10" }
  ]

  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card/95 to-primary/5 p-6 shadow-2xl backdrop-blur-xl">
      
      {/* Animated SVG Flight Route Map Background */}
      <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden">
        <svg className="h-full w-full" viewBox="0 0 800 400" fill="none">
          {/* World Grid Lines */}
          <path d="M0 100 Q 400 50 800 100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-primary" />
          <path d="M0 200 Q 400 150 800 200" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-primary" />
          <path d="M0 300 Q 400 250 800 300" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-primary" />
          
          {/* Route Arc */}
          <motion.path
            d="M 50 300 Q 250 50 750 250"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeDasharray="6 6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Passport Identity Card Left Side */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          
          {/* Avatar with Passport Stamp Frame */}
          <div className="relative shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-teal-500 to-emerald text-2xl font-bold text-white shadow-xl shadow-primary/25 border-2 border-white/20">
              {user?.initials || (user?.name ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "HP")}
            </div>
            
            {/* Stamp Badge */}
            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald text-white shadow-md border-2 border-background">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
                {user?.name || "Hemangi Vijay Patil"}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400 backdrop-blur-md">
                <Award className="h-3.5 w-3.5" />
                Level 5 Elite Wanderer
              </span>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-primary" />
                Passport No: <strong className="text-foreground">TN-892401-IN</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-emerald" />
                Home Port: <strong className="text-foreground">Mumbai, India</strong>
              </span>
            </div>

            <p className="mt-2 text-xs text-muted-foreground max-w-md leading-relaxed">
              &quot;Travel explorer who enjoys discovering new destinations, alpine mountain trails, and coastal heritage coves.&quot;
            </p>
          </div>

        </div>

        {/* Passport Quick Metrics Right Side */}
        <div className="grid grid-cols-3 gap-3 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-border/60 pt-4 lg:pt-0 lg:pl-6">
          {stats.map((s, idx) => {
            const IconComp = s.icon
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-background/70 p-3 text-center transition-all hover:border-primary/40 backdrop-blur-md"
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl mb-1.5 ${s.color}`}>
                  <IconComp className="h-4 w-4" />
                </span>
                <span className="font-heading text-lg font-extrabold text-foreground leading-none">{s.value}</span>
                <span className="text-[10px] font-medium text-muted-foreground mt-1 truncate">{s.label}</span>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
