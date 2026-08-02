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

export default function Page() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <TrendingDestinations />
      <WhyTripNest />
      <ExploreWorld />
      <HowItWorks />
      <PackageComparison />
      <BudgetCalculator />
      <ExpenseTracker />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  )
}