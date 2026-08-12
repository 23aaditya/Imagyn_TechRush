"use client"

import { useState, useEffect } from "react"
import { TripProvider, useTrip } from "@/context/trip-context"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { TrendingDestinations } from "@/components/trending-destinations"
import { PackageComparison } from "@/components/package-comparison"
import { BudgetCalculator } from "@/components/budget-calculator"
import { ExpenseTracker } from "@/components/expense-tracker"
import { JourneyTimelineOverview } from "@/components/journey-timeline-overview"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"
import { AuthModal } from "@/components/auth-modal"
import { ItineraryPlanner } from "@/components/itinerary-planner"
import { ExploreWorkspace } from "@/components/explore-workspace"
import { ProfileWorkspace } from "@/components/profile-workspace"
import { HomeBackground } from "@/components/home-background"
import { AiChatbot } from "@/components/ai-chatbot"
import { SavedTripsModal } from "@/components/saved-trips-modal"
import { JourneyLine } from "@/components/motion/journey-line"
import { HorizonTransition } from "@/components/motion/horizon-transition"

function MainApp() {
  const { destination, setDestination, days, generateTripItinerary } = useTrip()
  const [activeView, setActiveView] = useState("home") // 'home' | 'itinerary' | 'explore' | 'destinations' | 'budget' | 'expenses' | 'packages'
  const [user, setUser] = useState(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authInitialTab, setAuthInitialTab] = useState("login")
  const [pendingView, setPendingView] = useState(null)
  const [pendingDestination, setPendingDestination] = useState(null)
  const [isNavigatingLine, setIsNavigatingLine] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("tripnest_user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Guarded View Transition: Require auth for profile/saved features, allow free exploration for planner
  const handleViewChange = (view, destName) => {
    setIsNavigatingLine(true)
    setTimeout(() => setIsNavigatingLine(false), 700)

    if (destName) {
      setDestination(destName)
      generateTripItinerary(destName, days || 3)
    }
    if (view === "profile" && !user) {
      setPendingView(view)
      if (destName) setPendingDestination(destName)
      setAuthInitialTab("login")
      setAuthModalOpen(true)
      return
    }
    setActiveView(view)
  }

  const handleSelectDestination = (destName, numDays) => {
    setIsNavigatingLine(true)
    setTimeout(() => setIsNavigatingLine(false), 700)

    const targetDest = destName || destination || "Goa (India)"
    const targetDays = numDays || days || 3
    setDestination(targetDest)
    generateTripItinerary(targetDest, targetDays)
    setActiveView("itinerary")
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    try {
      localStorage.setItem("tripnest_user", JSON.stringify(userData))
    } catch (e) {
      console.error(e)
    }
    if (pendingDestination) {
      setDestination(pendingDestination)
      setPendingDestination(null)
    }
    // Navigate directly to Overview page on login
    setActiveView("home")
    setPendingView(null)
  }

  const handleLogout = () => {
    setUser(null)
    setActiveView("home")
    setPendingView(null)
    setPendingDestination(null)
    try {
      localStorage.removeItem("tripnest_user")
    } catch (e) {
      console.error(e)
    }
  }

  const openAuth = (tab = "login") => {
    setAuthInitialTab(tab)
    setAuthModalOpen(true)
  }

  return (
    <main className={`relative min-h-screen ${activeView === "home" ? "bg-background" : "bg-background dark:bg-[#11100E] text-foreground dark:text-[#F1ECE2]"}`} suppressHydrationWarning>
      {/* Signature Journey Line Transition */}
      <JourneyLine isNavigating={isNavigatingLine} triggerKey={activeView} />

      {/* Dynamic low-opacity travel background */}
      {activeView === "home" && <HomeBackground />}

      {/* Top Fixed Header Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={handleViewChange}
        user={user}
        onLogout={handleLogout}
        onOpenAuth={openAuth}
      />

      {/* Auth Dialog Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false)
          setPendingView(null)
          setPendingDestination(null)
        }}
        onAuthSuccess={handleAuthSuccess}
        initialTab={authInitialTab}
      />

      {/* Dynamic View Router */}
      {activeView === "home" && (
        <div className="relative z-10 animate-in fade-in duration-300">
          <Hero onStartPlanning={(view, targetDest) => handleSelectDestination(targetDest || destination || "Goa (India)")} />
          <TrendingDestinations onNavigateView={handleViewChange} onSelectDestination={handleSelectDestination} />
          <JourneyTimelineOverview onNavigateView={handleViewChange} />
          <Testimonials />
          <FAQ />
          <FinalCTA onNavigateView={handleViewChange} />
          <Footer onNavigateView={handleViewChange} />
        </div>
      )}

      {/* Dedicated Workspace: Itinerary Planner */}
      {activeView === "itinerary" && (
        <div className="relative z-10 animate-in fade-in duration-300">
          <ItineraryPlanner
            onBack={() => handleViewChange("home")}
            onNavigateView={handleViewChange}
          />
        </div>
      )}

      {/* Dedicated Workspace: World Explorer */}
      {activeView === "explore" && (
        <div className="relative z-10 animate-in fade-in duration-300">
          <ExploreWorkspace
            onBack={() => handleViewChange("home")}
            onSelectDestination={handleSelectDestination}
            onNavigateView={handleViewChange}
          />
        </div>
      )}

      {/* Dedicated Workspace: Budget Calculator */}
      {activeView === "budget" && (
        <div className="relative z-10 animate-in fade-in duration-300">
          <BudgetCalculator
            isWorkspace={true}
            onBack={() => handleViewChange("home")}
          />
        </div>
      )}

      {/* Dedicated Workspace: Expense Tracker */}
      {activeView === "expenses" && (
        <div className="relative z-10 animate-in fade-in duration-300">
          <ExpenseTracker
            isWorkspace={true}
            onBack={() => handleViewChange("home")}
          />
        </div>
      )}

      {/* Dedicated Workspace: Packages Comparison */}
      {activeView === "packages" && (
        <div className="relative z-10 animate-in fade-in duration-300 pt-20">
          <PackageComparison onNavigateView={handleViewChange} onSelectDestination={handleSelectDestination} onOpenAuth={openAuth} />
        </div>
      )}

      {/* Dedicated Workspace: User Profile & Passport */}
      {activeView === "profile" && (
        <div className="relative z-10 animate-in fade-in duration-300">
          <ProfileWorkspace onBack={() => handleViewChange("home")} />
        </div>
      )}

      {/* Saved Trips & Offline Summary Report Modal */}
      <SavedTripsModal onSelectDestination={handleSelectDestination} />

      {/* Floating AI Travel Concierge Assistant */}
      <AiChatbot currentView={activeView} onNavigate={handleViewChange} />
    </main>
  )
}

export default function Page() {
  return (
    <TripProvider>
      <MainApp />
    </TripProvider>
  )
}