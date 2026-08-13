"use client"

export function Footer({ onNavigateView }) {
  return (
    <footer className="relative w-full border-t border-border/60 bg-card px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Official TripNest Imagyn Text Branding */}
        <button
          suppressHydrationWarning
          onClick={() => {
            onNavigateView?.("home")
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
          className="flex flex-col items-center text-center focus:outline-none group cursor-pointer font-button"
          aria-label="TripNest Homepage"
        >
          <span className="font-heading text-2xl font-extrabold tracking-tight leading-none">
            <span className="text-[#0075FF]">Trip</span>
            <span className="text-[#0B2545] dark:text-white">nest</span>
          </span>
          <span className="text-[9px] font-semibold text-muted-foreground tracking-[0.25em] lowercase mt-1">
            imagyn
          </span>
        </button>

        {/* Essential Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-muted-foreground">
          <button suppressHydrationWarning onClick={() => onNavigateView?.("home")} className="hover:text-primary transition-colors">
            Home
          </button>
          <span>•</span>
          <button suppressHydrationWarning onClick={() => onNavigateView?.("itinerary")} className="hover:text-primary transition-colors">
            Itinerary Planner
          </button>
          <span>•</span>
          <button suppressHydrationWarning onClick={() => onNavigateView?.("explore")} className="hover:text-primary transition-colors">
            Explore Maps
          </button>
          <span>•</span>
          <button suppressHydrationWarning onClick={() => onNavigateView?.("budget")} className="hover:text-primary transition-colors">
            Budget Planner
          </button>
          <span>•</span>
          <button suppressHydrationWarning onClick={() => onNavigateView?.("expenses")} className="hover:text-primary transition-colors">
            Expense Tracker
          </button>
          <span>•</span>
          <button suppressHydrationWarning onClick={() => onNavigateView?.("packages")} className="hover:text-primary transition-colors">
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
