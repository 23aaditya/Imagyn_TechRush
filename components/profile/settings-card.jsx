"use client"

import { useState } from "react"
import { Settings, Edit3, Bell, Sun, Moon, Lock, LogOut, Check } from "lucide-react"

export function SettingsCard({ onEditProfile, onLogout }) {
  const [notifications, setNotifications] = useState(true)
  const [isDark, setIsDark] = useState(false)
  const [privacyModal, setPrivacyModal] = useState(false)

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle("dark", next)
      return next
    })
  }

  return (
    <div className="rounded-3xl border border-border/80 bg-card/95 p-5 shadow-xl backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-[#6B4423]">
          <Settings className="h-4 w-4" />
        </span>
        <h3 className="font-heading text-base font-bold text-foreground">Account Settings</h3>
      </div>

      <div className="space-y-2 text-xs">
        {/* Edit Profile */}
        <button
          onClick={onEditProfile}
          className="flex w-full items-center justify-between rounded-2xl border border-border/50 bg-background/60 p-3 transition-all hover:bg-accent hover:border-primary/40 text-foreground font-semibold"
        >
          <span className="flex items-center gap-2.5">
            <Edit3 className="h-4 w-4 text-[#6B4423]" />
            Edit Profile Details
          </span>
          <span className="text-[10px] text-muted-foreground">Modify Info</span>
        </button>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/60 p-3">
          <span className="flex items-center gap-2.5 font-semibold text-foreground">
            <Bell className="h-4 w-4 text-emerald" />
            Trip Notifications
          </span>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              notifications ? "bg-emerald" : "bg-muted"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#F4F6F6] shadow-md ring-0 transition duration-200 ease-in-out ${
                notifications ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/60 p-3">
          <span className="flex items-center gap-2.5 font-semibold text-foreground">
            {isDark ? <Moon className="h-4 w-4 text-purple-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
            Color Mode
          </span>
          <button
            onClick={toggleTheme}
            className="rounded-xl border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground hover:bg-accent transition-all"
          >
            {isDark ? "Dark Theme" : "Light Theme"}
          </button>
        </div>

        {/* Privacy Settings */}
        <button
          onClick={() => setPrivacyModal(!privacyModal)}
          className="flex w-full items-center justify-between rounded-2xl border border-border/50 bg-background/60 p-3 transition-all hover:bg-accent hover:border-primary/40 text-foreground font-semibold"
        >
          <span className="flex items-center gap-2.5">
            <Lock className="h-4 w-4 text-amber-500" />
            Privacy & Security
          </span>
          <span className="text-[10px] text-muted-foreground">Protected</span>
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex w-full items-center justify-between rounded-2xl border border-destructive/30 bg-destructive/10 p-3 transition-all hover:bg-destructive/20 text-destructive font-bold"
        >
          <span className="flex items-center gap-2.5">
            <LogOut className="h-4 w-4" />
            Sign Out
          </span>
          <span className="text-[10px] uppercase font-bold opacity-80">Exit</span>
        </button>
      </div>

      {privacyModal && (
        <div className="mt-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
          <span className="font-bold block mb-1">Privacy Guarantee</span>
          Your travel itineraries and personal expense data are encrypted locally and never shared with third parties.
        </div>
      )}
    </div>
  )
}
