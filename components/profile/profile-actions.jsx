"use client"

import { Edit3, Compass, LogOut } from "lucide-react"

export function ProfileActions({ onEditProfile, onViewTrips, onLogout }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-xl transition-all">
      <h3 className="font-heading text-sm font-bold text-foreground border-b border-border/60 pb-2.5 mb-3">
        Quick Account Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Edit Profile */}
        <button
          onClick={onEditProfile}
          className="flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-background/80 p-3 font-semibold text-foreground hover:border-primary/50 hover:bg-accent transition-all shadow-sm"
        >
          <Edit3 className="h-4 w-4 text-[#6B4423]" />
          Edit Profile
        </button>

        {/* View Trips */}
        <button
          onClick={onViewTrips}
          className="flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-background/80 p-3 font-semibold text-foreground hover:border-emerald/50 hover:bg-accent transition-all shadow-sm"
        >
          <Compass className="h-4 w-4 text-emerald" />
          View All Trips
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 font-bold text-destructive hover:bg-destructive/20 transition-all shadow-sm"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
