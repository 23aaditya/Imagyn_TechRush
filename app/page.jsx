import { AuthProvider } from "@/lib/auth-context"
import { ItineraryProvider } from "@/lib/itinerary-context"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { TrendingDestinations } from "@/components/trending-destinations"
import { WhyTripNest } from "@/components/why-tripnest"
import { ExploreWorld } from "@/components/explore-world"
import { HowItWorks } from "@/components/how-it-works"
import { ItineraryBuilder } from "@/components/itinerary-builder"
import { PackageComparison } from "@/components/package-comparison"
import { BudgetCalculator } from "@/components/budget-calculator"
import { ExpenseTracker } from "@/components/expense-tracker"
import { AIChatWidget } from "@/components/ai-chat-widget"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"
import { AuthModal } from "@/components/auth-modal"

export default function Page() {
  return (
    <AuthProvider>
      <ItineraryProvider>
        <main className="relative min-h-screen bg-background text-foreground">
          <Navbar />
          <Hero />
          <TrendingDestinations />
          <WhyTripNest />
          <ExploreWorld />
          <HowItWorks />
          <ItineraryBuilder />
          <PackageComparison />
          <BudgetCalculator />
          <ExpenseTracker />
          <Testimonials />
          <FAQ />
          <FinalCTA />
          <Footer />
          <AIChatWidget />
          <AuthModal />
        </main>
      </ItineraryProvider>
    </AuthProvider>
  )
}