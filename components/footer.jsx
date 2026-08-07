"use client"

export function Footer({ onNavigateView }) {
  return (
    <footer className="relative w-full border-t border-border/60 bg-card px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Official TripNest Imagyn Logo */}
        <button
          onClick={() => {
            onNavigateView?.("home")
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <img
            src="/images/tripnest-logo.png"
            alt="TripNest Imagyn"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </button>

        {/* Essential Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-muted-foreground">
          <button onClick={() => onNavigateView?.("home")} className="hover:text-primary transition-colors">
            Home
          </button>
          <span>•</span>
          <button onClick={() => onNavigateView?.("itinerary")} className="hover:text-primary transition-colors">
            Itinerary Planner
          </button>
          <span>•</span>
          <button onClick={() => onNavigateView?.("explore")} className="hover:text-primary transition-colors">
            Explore Maps
          </button>
          <span>•</span>
          <button onClick={() => onNavigateView?.("budget")} className="hover:text-primary transition-colors">
            Budget Planner
          </button>
          <span>•</span>
          <button onClick={() => onNavigateView?.("expenses")} className="hover:text-primary transition-colors">
            Expense Tracker
          </button>
          <span>•</span>
          <button onClick={() => onNavigateView?.("packages")} className="hover:text-primary transition-colors">
            Packages
          </button>
        </div>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground text-center sm:text-right">
          © 2026 TripNest. Made for Travelers.
        </p>

      </div>
    </footer>
  )
}
