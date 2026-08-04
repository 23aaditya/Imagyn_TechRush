"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

const STORAGE_KEY = "tripnest_auth_user"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState("login") // 'login' | 'signup'
  const [redirectReason, setRedirectReason] = useState("")

  // Load saved session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch (e) {
      console.error("Failed to parse user session", e)
    }
  }, [])

  const saveUserSession = (userData) => {
    setUser(userData)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    } catch (e) {
      console.error("Failed to save user session", e)
    }
  }

  const login = (email, password, name = "") => {
    const formattedName = name.trim() || email.split("@")[0] || "Explorer"
    const capitalized = formattedName.charAt(0).toUpperCase() + formattedName.slice(1)
    const userData = {
      email,
      name: capitalized,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(capitalized)}`,
      memberSince: "Aug 2026"
    }
    saveUserSession(userData)
    setIsAuthModalOpen(false)
    setRedirectReason("")
    return userData
  }

  const signup = (name, email, password) => {
    return login(email, password, name)
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error("Failed to clear user session", e)
    }
  }

  const openAuthModal = (reason = "", mode = "login") => {
    setRedirectReason(reason)
    setAuthModalMode(mode)
    setIsAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
    setRedirectReason("")
  }

  /**
   * Helper to wrap protected actions.
   * If logged in -> executes action().
   * If logged out -> opens Auth Modal with specified reason string.
   */
  const requireAuth = (actionCallback, reason = "Please sign in to access this feature") => {
    if (user) {
      actionCallback()
    } else {
      openAuthModal(reason)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        redirectReason,
        login,
        signup,
        logout,
        openAuthModal,
        closeAuthModal,
        requireAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
