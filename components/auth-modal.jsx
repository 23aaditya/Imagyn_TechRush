"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Lock, User, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AuthModal({ isOpen, onClose, onAuthSuccess, initialTab = "login" }) {
  const [tab, setTab] = useState(initialTab) // 'login' | 'signup'
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate auth API call
    setTimeout(() => {
      setIsLoading(false)
      const mockUser = {
        name: name.trim() || email.split("@")[0] || "Traveler",
        email: email || "traveler@tripnest.com",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || email || 'Traveler'}`,
        initials: (name || email || "TR").substring(0, 2).toUpperCase()
      }
      setSuccessMsg(tab === "login" ? "Welcome back!" : "Account created successfully!")
      setTimeout(() => {
        onAuthSuccess(mockUser)
        setSuccessMsg("")
        onClose()
      }, 900)
    }, 600)
  }

  const handleQuickLogin = (provider) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      const mockUser = {
        name: `${provider} Traveler`,
        email: `user@${provider.toLowerCase()}.com`,
        initials: provider.substring(0, 2).toUpperCase()
      }
      setSuccessMsg(`Authenticated with ${provider}!`)
      setTimeout(() => {
        onAuthSuccess(mockUser)
        setSuccessMsg("")
        onClose()
      }, 800)
    }, 500)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-border/80 bg-background/95 p-6 shadow-2xl backdrop-blur-2xl sm:p-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              {tab === "login" ? "Welcome back to TripNest" : "Create your TripNest account"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {tab === "login"
                ? "Sign in to access your saved itineraries and budgets"
                : "Join thousands of travelers planning smarter trips"}
            </p>
          </div>

          {/* Success banner */}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center gap-2 rounded-xl bg-emerald/15 p-3 text-sm font-medium text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* Tabs switch */}
          <div className="mb-6 flex rounded-xl bg-muted p-1">
            <button
              onClick={() => { setTab("login"); setSuccessMsg("") }}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all sm:text-sm ${
                tab === "login"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab("signup"); setSuccessMsg("") }}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all sm:text-sm ${
                tab === "signup"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "signup" && (
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {tab === "login" && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  Remember me
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="font-medium text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-xl bg-primary py-2.5 font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/35"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {tab === "login" ? "Sign In" : "Get Started Free"}
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Social Quick Login */}
          <div className="mt-6 border-t border-border/60 pt-4">
            <p className="mb-3 text-center text-xs text-muted-foreground">Or continue with</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickLogin("Google")}
                className="rounded-xl border-border bg-background hover:bg-muted text-xs"
              >
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickLogin("GitHub")}
                className="rounded-xl border-border bg-background hover:bg-muted text-xs"
              >
                GitHub
              </Button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald" />
            <span>256-bit encrypted secure authentication</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
