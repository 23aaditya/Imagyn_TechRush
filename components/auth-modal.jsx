"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Lock, Mail, User, KeyRound, Sparkles, ArrowRight, ShieldCheck, Zap, CheckCircle2, AtSign, ShieldAlert } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    redirectReason,
    login,
    signup
  } = useAuth()

  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // Generate username suggestions dynamically based on name or email
  const suggestions = useMemo(() => {
    const source = (name || email.split("@")[0] || "traveler").toLowerCase().replace(/[^a-z0-9]/g, "")
    if (!source) return []
    return [
      `${source}_2026`,
      `${source}.explorer`,
      `real_${source}`,
      `${source}_nomad`
    ]
  }, [name, email])

  // Calculate password strength score (0 to 4)
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "bg-muted", percent: 0 }
    
    let score = 0
    if (password.length >= 6) score += 1
    if (password.length >= 9) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1

    switch (score) {
      case 1:
        return { score: 1, label: "Weak - Add numbers or length", color: "bg-red-500", percent: 25 }
      case 2:
        return { score: 2, label: "Fair - Add uppercase or symbols", color: "bg-amber-500", percent: 50 }
      case 3:
        return { score: 3, label: "Good - Almost strong!", color: "bg-sky-500", percent: 75 }
      case 4:
        return { score: 4, label: "Strong 💪 - Ready to go!", color: "bg-emerald", percent: 100 }
      default:
        return { score: 0, label: "Too Short", color: "bg-rose-600", percent: 10 }
    }
  }, [password])

  if (!isAuthModalOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)

    setTimeout(() => {
      if (authModalMode === "login") {
        login(email, password, name || username)
      } else {
        signup(name || username || "Traveler", email, password)
      }
      setLoading(false)
      setName("")
      setUsername("")
      setEmail("")
      setPassword("")
    }, 400)
  }

  const handleDemoLogin = () => {
    setLoading(true)
    setTimeout(() => {
      login("alex.traveler@tripnest.ai", "demo123", "Alex Morgan")
      setLoading(false)
    }, 300)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-2xl md:p-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary via-indigo-600 to-sky-400 text-white shadow-lg shadow-primary/30">
              <Lock className="h-7 w-7" />
            </div>
            <h3 className="mt-4 font-heading text-2xl font-bold tracking-tight text-foreground">
              {authModalMode === "login" ? "Welcome Back to TripNest" : "Create Your TripNest Account"}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {authModalMode === "login"
                ? "Sign in to access AI itineraries, budget tools, and chat assistant."
                : "Unlock full AI travel features, custom itineraries, and expense tracking."}
            </p>
          </div>

          {/* Feature Gating Reason Notification Banner */}
          {redirectReason && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-start gap-2.5 rounded-2xl border border-primary/30 bg-primary/10 p-3.5 text-xs text-primary"
            >
              <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Authentication Required</span>
                <span className="text-muted-foreground">{redirectReason}</span>
              </div>
            </motion.div>
          )}

          {/* Quick 1-Click Demo Login */}
          <div className="mt-5">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald/40 bg-emerald/10 px-4 py-3 text-xs font-semibold text-emerald hover:bg-emerald/20 transition-all shadow-xs group"
            >
              <Zap className="h-4 w-4 fill-emerald text-emerald group-hover:scale-110 transition-transform" />
              <span>1-Click Demo Guest Login (Instant Access)</span>
            </button>
          </div>

          <div className="relative my-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/80"></div>
            </div>
            <span className="relative bg-card px-3 text-[11px] font-semibold uppercase text-muted-foreground">
              or standard sign in
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 rounded-xl bg-secondary/60 p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => setAuthModalMode("login")}
              className={`rounded-lg py-2 transition-all ${
                authModalMode === "login"
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthModalMode("signup")}
              className={`rounded-lg py-2 transition-all ${
                authModalMode === "signup"
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 text-xs sm:text-sm">
            {authModalMode === "signup" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground">Full Name</label>
                  <div className="relative mt-1">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        if (!username) {
                          const autoHandle = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "")
                          if (autoHandle) setUsername(`${autoHandle}_2026`)
                        }
                      }}
                      className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                {/* Username with Availability Indicator & Suggestions */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-muted-foreground">Username</label>
                    {username && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald">
                        <CheckCircle2 className="h-3 w-3" /> Available
                      </span>
                    )}
                  </div>
                  <div className="relative mt-1">
                    <AtSign className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      placeholder="alex_morgan26"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-xs"
                    />
                  </div>

                  {/* Available Username Suggestion Chips */}
                  {suggestions.length > 0 && (
                    <div className="mt-2">
                      <span className="text-[10px] font-medium text-muted-foreground block mb-1">⚡ Click to select available username:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {suggestions.map((sug) => (
                          <button
                            key={sug}
                            type="button"
                            onClick={() => setUsername(sug)}
                            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-mono transition-all ${
                              username === sug
                                ? "border-emerald bg-emerald/15 text-emerald font-semibold"
                                : "border-border/80 bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                            }`}
                          >
                            @{sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-muted-foreground">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground">Password</label>
              <div className="relative mt-1">
                <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Password Strength Indicator Bar */}
              {password && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground font-medium">Strength:</span>
                    <span className="font-semibold text-foreground">{passwordStrength.label}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.percent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
            >
              {loading ? (
                "Processing..."
              ) : authModalMode === "login" ? (
                <span className="flex items-center gap-1.5">
                  Sign In <ArrowRight className="h-4 w-4" />
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  Create Account <Sparkles className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Footer toggle note */}
          <div className="mt-5 text-center text-xs text-muted-foreground">
            {authModalMode === "login" ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthModalMode("signup")}
                  className="font-semibold text-primary hover:underline"
                >
                  Sign up now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthModalMode("login")}
                  className="font-semibold text-primary hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
