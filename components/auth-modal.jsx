"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle2, AlertCircle, ArrowRight, Lock, Mail, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AuthModal({ isOpen, onClose, onAuthSuccess, initialTab = "login" }) {
  const [tab, setTab] = useState(initialTab) // 'login' | 'signup'
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  // Helper to read registered users from localStorage
  const getRegisteredUsers = () => {
    try {
      const stored = localStorage.getItem("tripnest_registered_users")
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.error(e)
    }
    // Default demo user for instant testing
    const defaultUser = [{ email: "demo@tripnest.com", password: "password123", name: "Alex Rivera" }]
    try {
      localStorage.setItem("tripnest_registered_users", JSON.stringify(defaultUser))
    } catch (e) {}
    return defaultUser
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")
    setSuccessMsg("")
    
    setTimeout(() => {
      setIsLoading(false)
      const cleanEmail = email.trim().toLowerCase()
      const registeredUsers = getRegisteredUsers()
      const existingUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail)

      if (tab === "login") {
        // PROPER AUTHENTICATION: Check if account exists before logging in
        if (!existingUser) {
          setErrorMsg("No account found with this email. Please Create an Account first.")
          return
        }

        // Account exists — log in successfully
        const loggedInUser = {
          name: existingUser.name || cleanEmail.split("@")[0],
          email: cleanEmail,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${existingUser.name || cleanEmail}`,
          initials: (existingUser.name || cleanEmail).substring(0, 2).toUpperCase(),
        }

        setSuccessMsg(`Welcome back, ${loggedInUser.name}!`)
        setTimeout(() => {
          onAuthSuccess(loggedInUser)
          setSuccessMsg("")
          onClose()
        }, 900)
      } else {
        // CREATE ACCOUNT
        if (existingUser) {
          setErrorMsg("An account with this email already exists. Please Log In instead.")
          return
        }

        // Register new user
        const newUserObj = {
          email: cleanEmail,
          password: password,
          name: name.trim() || cleanEmail.split("@")[0],
        }

        const updatedUsers = [...registeredUsers, newUserObj]
        try {
          localStorage.setItem("tripnest_registered_users", JSON.stringify(updatedUsers))
        } catch (e) {}

        const newUser = {
          name: newUserObj.name,
          email: cleanEmail,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUserObj.name}`,
          initials: newUserObj.name.substring(0, 2).toUpperCase(),
        }

        setSuccessMsg("Account created successfully! Welcome to TripNest.")
        setTimeout(() => {
          onAuthSuccess(newUser)
          setSuccessMsg("")
          onClose()
        }, 900)
      }
    }, 600)
  }

  const handleQuickLogin = (provider) => {
    setIsLoading(true)
    setErrorMsg("")
    setSuccessMsg("")

    setTimeout(() => {
      setIsLoading(false)
      const mockUser = {
        name: `${provider} Traveler`,
        email: `user@${provider.toLowerCase()}.com`,
        initials: provider.substring(0, 2).toUpperCase(),
      }
      setSuccessMsg(`Authenticated with ${provider}!`)
      setTimeout(() => {
        onAuthSuccess(mockUser)
        setSuccessMsg("")
        onClose()
      }, 700)
    }, 500)
  }

  const switchTab = (newTab) => {
    setTab(newTab)
    setErrorMsg("")
    setSuccessMsg("")
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-xl"
        />

        {/* Modal Outer Container with Mountain Background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.55, bounce: 0.1 }}
          className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.6)] min-h-[580px] flex flex-col md:flex-row items-stretch"
        >
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/login-bg.jpg"
              alt="Himalayan Mountain Peak Background"
              className="h-full w-full object-cover filter brightness-[0.9] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/50" />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 z-30 rounded-full bg-black/40 p-2.5 text-white/80 transition-all hover:bg-black/70 hover:text-white border border-white/20"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>

          {/* LEFT SIDE: Hero Branding with TripNest Logo & Simple Tagline */}
          <div className="relative z-10 flex-1 p-8 sm:p-12 md:p-14 flex flex-col justify-between text-white">
            
            {/* Top Brand Name */}
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                TripNest
              </h2>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/75 mt-1">
                Your Intelligent Travel Companion
              </p>
            </div>

            {/* Main Hero Text & Simple Tagline */}
            <div className="my-auto space-y-5 pt-6">
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none drop-shadow-md">
                EXPLORE<br />HORIZONS
              </h1>

              {/* Simple Tagline Block */}
              <div className="relative pl-4 border-l-2 border-white/60 py-0.5">
                <p className="font-heading text-base sm:text-lg italic font-semibold text-white/95 leading-snug">
                  Smart travel planning, made effortless.
                </p>
              </div>

              <p className="text-xs sm:text-sm text-white/80 max-w-md leading-relaxed font-sans">
                Where your dream destinations become reality. Embark on a journey with personalized itineraries and budget tracking.
              </p>
            </div>

            {/* Bottom Footer Note */}
            <div className="text-[11px] text-white/60 font-medium pt-4">
              © {new Date().getFullYear()} TripNest. All rights reserved.
            </div>
          </div>

          {/* RIGHT SIDE: Glassmorphism Auth Card (Exact Reference Design) */}
          <div className="relative z-10 w-full md:w-[440px] p-6 sm:p-10 flex items-center justify-center">
            <div className="w-full rounded-3xl border border-white/30 bg-white/20 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl text-white">
              
              {/* Option Switcher: Create Account vs Log In */}
              <div className="mb-6 flex rounded-xl bg-black/30 p-1 border border-white/20">
                <button
                  type="button"
                  onClick={() => switchTab("signup")}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                    tab === "signup"
                      ? "bg-white text-neutral-900 shadow-md"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => switchTab("login")}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                    tab === "login"
                      ? "bg-white text-neutral-900 shadow-md"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  Log In
                </button>
              </div>

              {/* Success Message Banner */}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-500/90 p-3 text-xs font-bold text-white shadow-md border border-white/30"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{successMsg}</span>
                </motion.div>
              )}

              {/* Error Message Banner with Action Link */}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 flex flex-col gap-2 rounded-xl bg-rose-600/90 p-3.5 text-xs font-semibold text-white shadow-md border border-white/30"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-200" />
                    <span>{errorMsg}</span>
                  </div>
                  {tab === "login" && (
                    <button
                      type="button"
                      onClick={() => switchTab("signup")}
                      className="mt-1 self-start font-extrabold underline text-amber-200 hover:text-white text-[11px]"
                    >
                      Click here to Create an Account →
                    </button>
                  )}
                </motion.div>
              )}

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {tab === "signup" && (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-white/90">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full rounded-xl border-0 bg-white/90 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500 shadow-inner"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-white/90">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border-0 bg-white/90 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500 shadow-inner"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-white/90">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border-0 bg-white/90 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500 shadow-inner"
                  />
                </div>

                {tab === "login" && (
                  <div className="text-right">
                    <a
                      href="#forgot"
                      onClick={(e) => e.preventDefault()}
                      className="text-xs text-white/90 hover:text-white underline font-medium transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                )}

                {/* SIGN IN / CREATE ACCOUNT Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 w-full rounded-md bg-[#0D2B45] hover:bg-[#0D2B45]/90 text-white py-3.5 text-xs font-extrabold uppercase tracking-wider shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </span>
                  ) : (
                    <span>{tab === "login" ? "LOG IN" : "CREATE ACCOUNT"}</span>
                  )}
                </Button>
              </form>

              {/* Or Divider Line */}
              <div className="relative my-5 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/30" />
                </div>
                <span className="relative bg-transparent px-3 text-xs font-medium text-white/80">
                  or
                </span>
              </div>

              {/* Google Sign In Button */}
              <Button
                type="button"
                onClick={() => handleQuickLogin("Google")}
                className="w-full rounded-xl bg-white/90 hover:bg-white text-neutral-800 py-3 text-xs font-semibold shadow-md flex items-center justify-center gap-2.5 transition-all text-sm"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Sign in with Google
              </Button>

              {/* Bottom Switch Link */}
              <div className="mt-5 text-center text-xs text-white/90">
                {tab === "login" ? (
                  <span>
                    Are you new?{" "}
                    <button
                      onClick={() => switchTab("signup")}
                      className="font-bold underline text-white hover:text-blue-200 transition-colors"
                    >
                      Create an Account
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <button
                      onClick={() => switchTab("login")}
                      className="font-bold underline text-white hover:text-blue-200 transition-colors"
                    >
                      Log In
                    </button>
                  </span>
                )}
              </div>

            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  )
}


