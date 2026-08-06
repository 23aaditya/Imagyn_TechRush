"use client"

export function Footer({ onNavigateView }) {
  return (
    <footer className="relative w-full border-t border-border/60 bg-card px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* TripNest Brand Emblem */}
        <button
          onClick={() => {
            onNavigateView?.("home")
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-emerald to-teal-500 text-white shadow-md shadow-primary/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
              <circle cx="12" cy="12" r="9" className="opacity-40" />
              <path d="M12 12C12 12 15 8.5 15 6.5C15 4.8 13.7 3.5 12 3.5C10.3 3.5 9 4.8 9 6.5C9 8.5 12 12 12 12Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
              <path d="M18.5 7.5L16 11.5L18 12.5L20 10.5L21.5 11L19.5 14L15.5 13L13 17L11.5 16.5L13 12L9.5 11L8 12.5L6.5 12L7.5 9.5L6.5 7L8 6.5L9.5 8L13 7L11.5 2.5L13 2L15.5 6L19.5 5L21.5 8L18.5 7.5Z" fill="currentColor" />
            </svg>
          </span>
          <span className="font-heading text-lg font-bold tracking-tight text-foreground">
            Trip<span className="text-primary">Nest</span>
          </span>
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
