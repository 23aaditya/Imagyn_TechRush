"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Mail,
  Phone,
  Camera,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Lock,
  Globe,
  Compass,
  Star,
  Coins,
  Edit3,
  X,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTrip } from "@/context/trip-context"

// Gamified Badges Dataset
const USER_BADGES = [
  {
    id: "badge-1",
    title: "Goa Trailblazer",
    category: "Destination Master",
    icon: "🌴",
    bgGradient: "from-amber-500 to-orange-600",
    desc: "Completed Goan coastal itinerary & beach shacks.",
    unlocked: true,
    date: "Aug 2026"
  },
  {
    id: "badge-2",
    title: "Island Hopper",
    category: "Tropical Explorer",
    icon: "🏝️",
    bgGradient: "from-blue-500 to-cyan-600",
    desc: "Explored Bali rice terraces & sea temples.",
    unlocked: true,
    date: "May 2025"
  },
  {
    id: "badge-3",
    title: "Alpine Explorer",
    category: "Mountain Conqueror",
    icon: "🏔️",
    bgGradient: "from-emerald-500 to-teal-600",
    desc: "Completed Solang Valley snow sports & Atal Tunnel trek.",
    unlocked: true,
    date: "Dec 2024"
  },
  {
    id: "badge-4",
    title: "Smart Budgeteer",
    category: "Financial Master",
    icon: "💰",
    bgGradient: "from-purple-500 to-indigo-600",
    desc: "Maintained expenses 15% under target planned budget.",
    unlocked: true,
    date: "Always Active"
  },
  {
    id: "badge-5",
    title: "Globe Trotter",
    category: "Milestone",
    icon: "🌐",
    bgGradient: "from-rose-500 to-pink-600",
    desc: "Complete 5 international or domestic vacations.",
    unlocked: false,
    progress: "3 / 5 Trips"
  },
  {
    id: "badge-6",
    title: "Luxury Nomad",
    category: "Vibe Master",
    icon: "👑",
    bgGradient: "from-amber-400 to-yellow-500",
    desc: "Logged 5-star cliffside resort & fine dining.",
    unlocked: true,
    date: "Jul 2025"
  }
]

// Passport Stamps
const PASSPORT_STAMPS = [
  { id: "stamp-1", city: "GOA", country: "INDIA", year: "2026", icon: "🌴", color: "border-amber-400 text-amber-500" },
  { id: "stamp-2", city: "BALI", country: "INDONESIA", year: "2025", icon: "🌺", color: "border-blue-400 text-blue-500" },
  { id: "stamp-3", city: "MANALI", country: "INDIA", year: "2024", icon: "❄️", color: "border-cyan-400 text-cyan-500" },
  { id: "stamp-4", city: "PARIS", country: "FRANCE", year: "2023", icon: "🗼", color: "border-rose-400 text-rose-500" }
]

export function ProfileWorkspace({ onBack }) {
  const { destination } = useTrip()

  // User Profile Form State
  const [username, setUsername] = useState("Aaditya Dixit")
  const [email, setEmail] = useState("aaditya.dixit@tripnest.com")
  const [phone, setPhone] = useState("+91 98765 43210")
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80")
  const [currency, setCurrency] = useState("INR (₹)")
  const [travelStyle, setTravelStyle] = useState("Balanced")

  // Editing state
  const [isEditing, setIsEditing] = useState(false)

  // Security Email/Phone Confirmation Modal State
  const [securityModalOpen, setSecurityModalOpen] = useState(false)
  const [pendingField, setPendingField] = useState(null) // 'email' | 'phone'
  const [pendingValue, setPendingValue] = useState("")

  // Quick preset avatar selection
  const AVATAR_PRESETS = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80"
  ]

  // Handle Save Details
  const handleSaveDetails = (e) => {
    e.preventDefault()
    setIsEditing(false)
  }

  // Handle Trigger Security Confirmation for Email/Phone
  const handleRequestContactChange = (type, currentVal) => {
    setPendingField(type)
    setPendingValue(currentVal)
    setSecurityModalOpen(true)
  }

  return (
    <section className="min-h-screen bg-background dark:bg-[#11100E] text-[#2F3E4E] dark:text-[#F1ECE2] pt-24 pb-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6 space-y-8">
        
        {/* Navigation Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="rounded-md border-border bg-background hover:bg-accent text-xs sm:text-sm cursor-pointer"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Overview
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold text-foreground text-sm">User Profile & Travel Passport</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-500 dark:text-amber-400 border border-amber-400/20">
              <Sparkles className="h-3.5 w-3.5" />
              Level 4 Explorer Status
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            PROFILE HEADER CARD
           ───────────────────────────────────────────── */}
        <div className="rounded-xl border border-[#0D2B45]/20 bg-[#0D2B45] text-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              {/* Profile Avatar with Photo Change Action */}
              <div className="relative group">
                <img
                  src={avatarUrl}
                  alt={username}
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl object-cover border-2 border-amber-400/80 shadow-md transition-transform group-hover:scale-105"
                />
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute bottom-0 right-0 p-1.5 rounded-md bg-amber-400 text-[#0D2B45] shadow-xs hover:scale-105 transition-transform cursor-pointer"
                  title="Change Profile Photo"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* User Details Display */}
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                    {username}
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    Verified Traveler
                  </span>
                </div>

                <p className="text-xs text-white/80 mt-1 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                  {email} · {phone}
                </p>

                <p className="text-xs text-white/60 mt-2 font-medium">
                  Member since 2024 · Active Itinerary: <span className="text-amber-400 font-bold">{destination || "Goa Getaway"}</span>
                </p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-md bg-amber-400 text-[#0D2B45] hover:bg-amber-300 font-bold text-xs uppercase tracking-wider px-4 py-2 shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Edit3 className="h-4 w-4" />
              {isEditing ? "Done Editing" : "Edit Profile Settings"}
            </Button>
          </div>

          {/* Preset Avatar Selector (When Editing) */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 pt-6 border-t border-white/10"
            >
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                Choose Preset Profile Avatar
              </p>
              <div className="flex items-center gap-3">
                {AVATAR_PRESETS.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAvatarUrl(url)}
                    className={`h-12 w-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      avatarUrl === url ? "border-amber-400 ring-2 ring-amber-400/30 scale-105" : "border-white/20 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt="Preset" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* ─────────────────────────────────────────────
            ACCOUNT SETTINGS FORM
           ───────────────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6">
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground">Account Credentials & Security</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Manage your personal credentials & registered notification channels</p>
            </div>
            <ShieldCheck className="h-6 w-6 text-amber-500" />
          </div>

          <form onSubmit={handleSaveDetails} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-3">
              
              {/* Username Field */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Display Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-md border border-border bg-background py-2 pl-10 pr-4 text-xs font-semibold text-foreground outline-none focus:border-[#0D2B45]"
                  />
                </div>
              </div>

              {/* Registered Email Field (Triggers Security Confirmation) */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Registered Email Address
                </label>
                <div className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-md border border-border bg-background py-2 pl-10 pr-4 text-xs font-semibold text-foreground outline-none focus:border-[#0D2B45]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRequestContactChange("email", email)}
                    className="rounded-md bg-[#0D2B45] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-2 hover:bg-[#12395b] shrink-0 cursor-pointer"
                    title="Send verification link to previous email"
                  >
                    Verify
                  </button>
                </div>
              </div>

              {/* Registered Phone Number (Triggers Security Confirmation) */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Registered Phone Number
                </label>
                <div className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-md border border-border bg-background py-2 pl-10 pr-4 text-xs font-semibold text-foreground outline-none focus:border-[#0D2B45]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRequestContactChange("phone", phone)}
                    className="rounded-md bg-[#0D2B45] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-2 hover:bg-[#12395b] shrink-0 cursor-pointer"
                    title="Send SMS verification code to previous phone"
                  >
                    Verify
                  </button>
                </div>
              </div>

            </div>

            {/* Preferences Selection */}
            <div className="pt-4 border-t border-border/60 grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Preferred Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-md border border-border bg-background p-2 text-xs font-semibold text-foreground outline-none focus:border-[#0D2B45]"
                >
                  <option value="INR (₹)">Indian Rupee (INR ₹)</option>
                  <option value="USD ($)">US Dollar (USD $)</option>
                  <option value="EUR (€)">Euro (EUR €)</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Preferred Travel Style
                </label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full rounded-md border border-border bg-background p-2 text-xs font-semibold text-foreground outline-none focus:border-[#0D2B45]"
                >
                  <option value="Balanced">Balanced Explorer</option>
                  <option value="Backpacker">Backpacker & Budget</option>
                  <option value="Luxury">Luxury & Comfort</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* ─────────────────────────────────────────────
            GAMIFIED BADGES & TRAVEL ACHIEVEMENTS
           ───────────────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Travel Achievements & Badges
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Unlocked based on your completed itineraries & expenditure milestones</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-400/10 px-2.5 py-0.5 rounded-sm border border-amber-400/20">
              5 of 6 Unlocked
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {USER_BADGES.map((b) => (
              <div
                key={b.id}
                className={`rounded-md border p-4 transition-all relative overflow-hidden ${
                  b.unlocked
                    ? "border-amber-400/30 bg-amber-400/5 shadow-xs"
                    : "border-border/60 bg-muted/40 opacity-60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br ${b.bgGradient} text-xl shadow-xs shrink-0`}>
                    {b.icon}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-foreground">{b.title}</h4>
                      {b.unlocked ? (
                        <CheckCircle2 className="h-4 w-4 text-amber-500" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-amber-500 block mt-0.5">{b.category}</span>
                    <p className="text-xs text-muted-foreground mt-1 leading-tight">{b.desc}</p>
                    <span className="mt-2 block text-[10px] font-bold text-muted-foreground">
                      {b.unlocked ? `Unlocked ${b.date}` : `Progress: ${b.progress}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            PASSPORT STAMP COLLECTION (Travel Memory Wall)
           ───────────────────────────────────────────── */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                Passport Stamp Memory Wall
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Visual passport stamps collected across your completed vacations</p>
            </div>
            <span className="text-xs font-bold text-foreground">4 Countries Visited</span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {PASSPORT_STAMPS.map((st) => (
              <div
                key={st.id}
                className={`flex flex-col items-center justify-center p-5 rounded-3xl border-2 border-dashed ${st.color} bg-background/80 shadow-sm text-center transform hover:rotate-1 transition-transform`}
              >
                <span className="text-3xl mb-2">{st.icon}</span>
                <span className="font-heading font-extrabold text-sm uppercase tracking-wider block">{st.city}</span>
                <span className="text-[10px] font-bold opacity-75">{st.country} • {st.year}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────
          SECURITY EMAIL / PHONE VERIFICATION DISPATCH MODAL
         ───────────────────────────────────────────── */}
      <AnimatePresence>
        {securityModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-neutral-200 bg-white text-neutral-900 shadow-2xl p-6 sm:p-8 text-center space-y-5"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-500 border border-amber-400/30">
                <ShieldCheck className="h-8 w-8" />
              </div>

              <div>
                <h3 className="font-heading text-xl font-extrabold text-[#0D2B45]">
                  Security Verification Sent
                </h3>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  For your security, a confirmation link has been dispatched to your <span className="font-bold text-[#0D2B45]">previous registered {pendingField}</span>.
                </p>
              </div>

              <div className="rounded-2xl bg-neutral-100 p-3 text-xs text-neutral-700 font-medium">
                Please check your inbox / messages at <span className="font-bold text-[#0D2B45]">{pendingValue}</span> to confirm this credential update.
              </div>

              <Button
                onClick={() => setSecurityModalOpen(false)}
                className="w-full rounded-2xl bg-[#0D2B45] text-white py-3 text-xs font-bold shadow-lg hover:bg-[#12395b]"
              >
                I Understand
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  )
}
