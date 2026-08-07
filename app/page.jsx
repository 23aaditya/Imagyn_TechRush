"use client"

import { useState, useEffect } from "react"
import { TripProvider, useTrip } from "@/context/trip-context"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { TrendingDestinations } from "@/components/trending-destinations"
import { WhyTripNest } from "@/components/why-tripnest"
import { ExploreWorld } from "@/components/explore-world"
import { HowItWorks } from "@/components/how-it-works"
import { PackageComparison } from "@/components/package-comparison"
import { BudgetCalculator } from "@/components/budget-calculator"
import { ExpenseTracker } from "@/components/expense-tracker"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"
import { AuthModal } from "@/components/auth-modal"
import { ItineraryPlanner } from "@/components/itinerary-planner"
import { ExploreWorkspace } from "@/components/explore-workspace"
import { HomeBackground } from "@/components/home-background"
import { AiChatbot } from "@/components/ai-chatbot"

function MainApp() {
  const { destination, setDestination } = useTrip()
  const [activeView, setActiveView] = useState("home") // 'home' | 'itinerary' | 'explore' | 'destinations' | 'budget' | 'expenses' | 'packages'
  const [user, setUser] = useState(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authInitialTab, setAuthInitialTab] = useState("login")
  const [pendingView, setPendingView] = useState(null)
  const [pendingDestination, setPendingDestination] = useState(null)

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

  // Guarded View Transition: Require auth for non-home features
  const handleViewChange = (view, destName) => {
    if (destName) {
      setDestination(destName)
    }
    if (view !== "home" && !user) {
      setPendingView(view)
      if (destName) setPendingDestination(destName)
      setAuthInitialTab("login")
      setAuthModalOpen(true)
      return
    }
    setActiveView(view)
  }

  const handleSelectDestination = (destName) => {
    if (destName) {
      setDestination(destName)
    }
    handleViewChange("itinerary", destName)
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
    // Always jump straight to Overview (Itinerary Planner) workspace after login/signup
    setActiveView("itinerary")
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
    <main className={`relative min-h-screen ${activeView === "home" ? "bg-background" : "bg-[#F4F6F6] text-[#2F3E4E]"}`}>
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
          <Hero onStartPlanning={(view) => handleViewChange(view || "itinerary")} />
          <TrendingDestinations onNavigateView={handleViewChange} onSelectDestination={handleSelectDestination} />
          <WhyTripNest onNavigateView={handleViewChange} />
          <ExploreWorld onNavigateView={handleViewChange} onSelectDestination={handleSelectDestination} />
          <HowItWorks onNavigateView={handleViewChange} />
          <PackageComparison onNavigateView={handleViewChange} onSelectDestination={handleSelectDestination} onOpenAuth={openAuth} />
          <BudgetCalculator
            isWorkspace={false}
            onOpenWorkspace={() => handleViewChange("budget")}
          />
          <ExpenseTracker
            isWorkspace={false}
            onOpenWorkspace={() => handleViewChange("expenses")}
          />
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