"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  X,
  ArrowRightLeft,
  ChevronRight,
  Sparkles,
  Star,
  Plus,
  Eye,
  CheckCircle2,
  Calendar,
  MapPin,
  Car,
  Utensils,
  Sun,
  Palmtree,
  Mountain,
  Landmark,
  Trees,
  Users,
  Compass,
  DollarSign,
  Hotel,
  Award,
  AlertTriangle,
  Info,
  ShieldCheck,
  Clock,
  Zap,
  TrendingDown,
  Layers
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTrip } from "@/context/trip-context"

/* ─────────────────────────────────────────────
   VACATION CATEGORIES CONFIG
   ───────────────────────────────────────────── */
const VACATION_CATEGORIES = [
  { id: "beach", name: "Beach & Relaxation", icon: Palmtree },
  { id: "adventure", name: "Adventure & Mountains", icon: Mountain },
  { id: "culture", name: "Culture & Heritage", icon: Landmark },
  { id: "nature", name: "Nature & Wellness", icon: Trees },
  { id: "food", name: "Food & Local Experiences", icon: Utensils },
  { id: "family", name: "Family Vacation", icon: Users }
]

/* ─────────────────────────────────────────────
   USER PRIORITIES CONFIG
   ───────────────────────────────────────────── */
const USER_PRIORITIES = [
  { id: "budget", label: "Budget", icon: "💰", tagline: "Prioritize lower cost & high value" },
  { id: "experiences", label: "Experiences", icon: "🏖", tagline: "Prioritize rich activities & sights" },
  { id: "relaxation", label: "Relaxation", icon: "🌿", tagline: "Prioritize free time & unhurried pace" },
  { id: "comfort", label: "Comfort", icon: "🏨", tagline: "Prioritize 4/5-Star stay & dining" },
  { id: "adventure", label: "Adventure", icon: "⚡", tagline: "Prioritize thrill & active exploration" }
]

/* ─────────────────────────────────────────────
   RICH PACKAGE DATASET (DATA-DRIVEN DECISION ENGINE)
   ───────────────────────────────────────────── */
const PACKAGE_DATA = {
  beach: [
    {
      id: "goa-escape",
      name: "Goa Explorer & Beach Escape",
      destination: "Goa",
      country: "India",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      duration: "5 Days / 4 Nights",
      durationDays: 5,
      price: "₹24,999",
      numericPrice: 24999,
      estimatedTotalCost: 30500,
      costBreakdown: { taxes: "₹2,500", localExpenses: "₹3,001" },
      rating: 4.8,
      reviewsCount: 142,
      reviewsBreakdown: { cleanliness: 4.8, transport: 4.7, stay: 4.8, value: 4.6, activities: 4.9 },
      accommodation: {
        category: "4-Star Beach Resort",
        rating: 4.7,
        location: "Vagator Cliff & Beach Side",
        distanceToHub: "300m to Vagator Beach",
        meals: "Breakfast & Dinner Included",
        hotelChanges: 1
      },
      experiences: {
        activitiesCount: 4,
        attractionsCount: 6,
        breakdown: { adventure: 75, nature: 85, culture: 70, food: 95, shopping: 80, nightlife: 85 },
        attractionsList: ["Baga & Calangute Beach", "Fort Aguada", "Fontainhas Latin Quarter", "Dudhsagar Waterfalls", "Anjuna Flea Market", "Mandovi River"],
        activitiesList: ["Parasailing & Jet Ski", "Mandovi Sunset Cruise", "Spice Plantation Feast & Elephant Tour", "Fontainhas Heritage Photo Walk"]
      },
      pace: {
        type: "relaxed",
        label: "Relaxed",
        icon: "🌿",
        actPerDay: 2,
        freeTimeHrs: 5,
        lateNight: false,
        desc: "2-3 activities/day • Generous free time for beach lounging"
      },
      convenience: {
        airportTransfers: "Private AC SUV Included",
        localTransport: "Dedicated AC Sedan",
        hotelChanges: 1,
        avgDailyTravelMins: 40,
        transportType: "Private AC"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Sunny Skies & Cool Sea Breeze",
        reason: "Optimal dry season window (Nov-Feb) with calm waters for watersports."
      },
      description: "Sun-drenched beaches, cliffside shacks, Portuguese heritage, and private watersports."
    },
    {
      id: "gokarna-getaway",
      name: "Gokarna Coastal Getaway",
      destination: "Gokarna",
      country: "Karnataka, India",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
      duration: "4 Days / 3 Nights",
      durationDays: 4,
      price: "₹18,500",
      numericPrice: 18500,
      estimatedTotalCost: 23200,
      costBreakdown: { taxes: "₹1,800", localExpenses: "₹2,900" },
      rating: 4.6,
      reviewsCount: 88,
      reviewsBreakdown: { cleanliness: 4.5, transport: 4.4, stay: 4.6, value: 4.8, activities: 4.5 },
      accommodation: {
        category: "Eco Heritage Beach Resort",
        rating: 4.5,
        location: "Kudle Beach",
        distanceToHub: "100m to Kudle Shore",
        meals: "All Meals Included (Farm-to-Table)",
        hotelChanges: 1
      },
      experiences: {
        activitiesCount: 5,
        attractionsCount: 5,
        breakdown: { adventure: 80, nature: 95, culture: 85, food: 75, shopping: 60, nightlife: 40 },
        attractionsList: ["Kudle Beach", "Om Beach", "Half Moon Beach", "Mahabaleshwar Temple", "Yana Caves"],
        activitiesList: ["5-Beach Coastal Trek", "Cliff Yoga & Meditation", "Sunset Boat Ride", "Temple Heritage Walk", "Bio-Luminescent Night Watch"]
      },
      pace: {
        type: "balanced",
        label: "Balanced",
        icon: "⚖️",
        actPerDay: 3,
        freeTimeHrs: 3.5,
        lateNight: false,
        desc: "3 activities/day • Balanced coastal trekking & beach relaxation"
      },
      convenience: {
        airportTransfers: "Shared AC Coach",
        localTransport: "Private AC Cab & Boat Transfer",
        hotelChanges: 1,
        avgDailyTravelMins: 55,
        transportType: "Semi-Private"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Pleasant & Tropical",
        reason: "Mild temperatures perfect for beach trekking and cliffside views."
      },
      description: "Pristine cliffside beaches, serene temple heritage, and guided coastal trekking."
    },
    {
      id: "andaman-luxury",
      name: "Andaman Island Paradise & Reefs",
      destination: "Andaman",
      country: "India",
      image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&auto=format&fit=crop&q=80",
      duration: "5 Days / 4 Nights",
      durationDays: 5,
      price: "₹34,500",
      numericPrice: 34500,
      estimatedTotalCost: 41000,
      costBreakdown: { taxes: "₹3,500", localExpenses: "₹3,000" },
      rating: 4.9,
      reviewsCount: 115,
      reviewsBreakdown: { cleanliness: 4.9, transport: 4.8, stay: 4.9, value: 4.7, activities: 4.9 },
      accommodation: {
        category: "5-Star Luxury Island Resort",
        rating: 4.9,
        location: "Radhanagar Beach, Havelock",
        distanceToHub: "Direct Private Beach Access",
        meals: "Full Board (Breakfast, Lunch & Dinner)",
        hotelChanges: 2
      },
      experiences: {
        activitiesCount: 6,
        attractionsCount: 7,
        breakdown: { adventure: 90, nature: 98, culture: 70, food: 85, shopping: 50, nightlife: 45 },
        attractionsList: ["Radhanagar Beach", "Elephant Beach", "Cellular Jail", "Chidiya Tapu", "Ross Island", "Kalapathar Beach", "Baratang Caves"],
        activitiesList: ["Scuba Diving with Certified Instructor", "Snorkeling at Elephant Beach", "Catamaran Cruise Transfer", "Light & Sound Show at Cellular Jail", "Sunset Glass Bottom Boat Ride"]
      },
      pace: {
        type: "packed",
        label: "Packed",
        icon: "⚡",
        actPerDay: 4,
        freeTimeHrs: 2,
        lateNight: true,
        desc: "4 activities/day • High-energy island hopping & marine adventures"
      },
      convenience: {
        airportTransfers: "Luxury Private Car & Express Ferry",
        localTransport: "Private AC Cab & Speedboat",
        hotelChanges: 2,
        avgDailyTravelMins: 60,
        transportType: "Private Luxury"
      },
      weatherSuitability: {
        status: "good",
        label: "Good",
        icon: "🌤",
        title: "Clear Waters & Ocean Sunshine",
        reason: "Great underwater visibility for scuba diving with occasional tropical showers."
      },
      description: "Turquoise lagoons, white sand beaches, scuba diving, and luxury island catamaran cruises."
    }
  ],
  adventure: [
    {
      id: "manali-snow",
      name: "Manali & Solang Valley Snow Explorer",
      destination: "Manali",
      country: "Himachal, India",
      image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80",
      duration: "5 Days / 4 Nights",
      durationDays: 5,
      price: "₹16,999",
      numericPrice: 16999,
      estimatedTotalCost: 21500,
      costBreakdown: { taxes: "₹1,700", localExpenses: "₹2,801" },
      rating: 4.7,
      reviewsCount: 165,
      reviewsBreakdown: { cleanliness: 4.6, transport: 4.7, stay: 4.6, value: 4.8, activities: 4.9 },
      accommodation: {
        category: "3-Star Mountain View Resort",
        rating: 4.6,
        location: "Old Manali Woods",
        distanceToHub: "1.2km to Mall Road",
        meals: "Breakfast & Dinner Included",
        hotelChanges: 1
      },
      experiences: {
        activitiesCount: 6,
        attractionsCount: 7,
        breakdown: { adventure: 95, nature: 90, culture: 75, food: 70, shopping: 65, nightlife: 50 },
        attractionsList: ["Solang Valley", "Atal Tunnel", "Sissu Waterfall", "Hadimba Temple", "Jogini Waterfalls", "Mall Road", "Vashisht Hot Springs"],
        activitiesList: ["Paragliding in Solang", "Snow Scooter Ride", "Jogini Waterfall Trek", "Atal Tunnel Lahaul Excursion", "Vashisht Thermal Bath"]
      },
      pace: {
        type: "packed",
        label: "Packed",
        icon: "⚡",
        actPerDay: 4,
        freeTimeHrs: 2,
        lateNight: false,
        desc: "4 activities/day • High thrill mountain adventures & snow sports"
      },
      convenience: {
        airportTransfers: "Volvo Sleeper Coach from Delhi + Private Cab",
        localTransport: "Private 4x4 Mountain SUV",
        hotelChanges: 1,
        avgDailyTravelMins: 50,
        transportType: "Private 4x4"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Snowy Peaks & Alpine Chill",
        reason: "Crisp winter weather with fresh snow in Solang Valley and Sissu."
      },
      description: "Paragliding in Solang, snow rides, Atal Tunnel adventure, and cozy fireside mountain stays."
    },
    {
      id: "leh-ladakh",
      name: "Leh Ladakh High Passes Odyssey",
      destination: "Ladakh",
      country: "India",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
      duration: "6 Days / 5 Nights",
      durationDays: 6,
      price: "₹28,500",
      numericPrice: 28500,
      estimatedTotalCost: 34000,
      costBreakdown: { taxes: "₹2,500", localExpenses: "₹3,000" },
      rating: 4.9,
      reviewsCount: 198,
      reviewsBreakdown: { cleanliness: 4.8, transport: 4.9, stay: 4.7, value: 4.9, activities: 5.0 },
      accommodation: {
        category: "Deluxe Himalayan Camps & Hotel",
        rating: 4.8,
        location: "Leh & Pangong Lake Tents",
        distanceToHub: "Direct Lakefront Campsite",
        meals: "All Meals Included",
        hotelChanges: 2
      },
      experiences: {
        activitiesCount: 7,
        attractionsCount: 8,
        breakdown: { adventure: 100, nature: 100, culture: 85, food: 65, shopping: 50, nightlife: 20 },
        attractionsList: ["Pangong Tso Lake", "Nubra Valley", "Khardung La Pass", "Magnetic Hill", "Shanti Stupa", "Diskit Monastery", "Confluence of Indus & Zanskar"],
        activitiesList: ["Khardungla 18,380ft Pass Crossing", "Double-Hump Camel Safari in Hunder", "Stargazing over Pangong Tso", "Rafting in Zanskar River", "Monastery Chanting Experience"]
      },
      pace: {
        type: "balanced",
        label: "Balanced",
        icon: "⚖️",
        actPerDay: 3,
        freeTimeHrs: 3,
        lateNight: false,
        desc: "3 activities/day • High mountain passes with mandatory acclimatization rest"
      },
      convenience: {
        airportTransfers: "Private Leh Airport Cab",
        localTransport: "Modified Oxygen-Equipped Scorpio/Innova",
        hotelChanges: 2,
        avgDailyTravelMins: 90,
        transportType: "Private 4x4"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Clear Azure Skies & High Sun",
        reason: "Peak summer season with accessible high passes and vibrant blue Pangong Lake."
      },
      description: "Highest motorable passes, Pangong Lake camping, Bactrian camel safaris, and raw Himalayan landscapes."
    }
  ]
}

/* ─────────────────────────────────────────────
   ALGORITHMIC PERSONAL MATCH SCORE ENGINE
   ───────────────────────────────────────────── */
function calculatePersonalMatchScore(pkg, priority = "budget", userTargetBudget = 32000) {
  if (!pkg) return { score: 75, reasons: [], warnings: [] }

  let score = 75 // Base starting score
  const reasons = []
  const warnings = []

  // 1. Price vs Budget Check
  const priceDiff = userTargetBudget - pkg.numericPrice
  if (priceDiff >= 0) {
    score += 10
    reasons.push(`Within your target budget of ₹${(userTargetBudget / 1000).toFixed(0)}K`)
  } else {
    score -= Math.min(15, Math.abs(Math.round(priceDiff / 1000)))
    warnings.push(`Exceeds budget target by ₹${(Math.abs(priceDiff) / 1000).toFixed(1)}K`)
  }

  // 2. Rating & Value Check
  if (pkg.rating >= 4.7) {
    score += 8
    reasons.push(`Outstanding ${pkg.rating}★ rating from ${pkg.reviewsCount}+ travelers`)
  }

  // 3. Priority Specific Score Tuning
  if (priority === "budget") {
    if (pkg.numericPrice < 20000) {
      score += 12
      reasons.push("Highly economical package price under ₹20,000")
    } else if (pkg.numericPrice > 30000) {
      score -= 10
      warnings.push("Higher tier pricing compared to budget alternatives")
    }
    if (pkg.accommodation.meals.includes("All") || pkg.accommodation.meals.includes("Dinner")) {
      score += 5
      reasons.push("Meals included, reducing out-of-pocket dining costs")
    }
  } else if (priority === "experiences") {
    const actCount = pkg.experiences.activitiesCount + pkg.experiences.attractionsCount
    if (actCount >= 10) {
      score += 14
      reasons.push(`Packed with ${actCount} curated activities & top sight visits`)
    } else {
      score -= 5
      warnings.push("Fewer total activities compared to experience-heavy tours")
    }
  } else if (priority === "relaxation") {
    if (pkg.pace.type === "relaxed") {
      score += 15
      reasons.push(`Preferred relaxed pace (${pkg.pace.freeTimeHrs} hrs daily free time)`)
    } else if (pkg.pace.type === "packed") {
      score -= 12
      warnings.push("Busy schedule with 4+ activities/day and minimal free time")
    }
    if (pkg.accommodation.hotelChanges <= 1) {
      score += 5
      reasons.push("Single hotel stay — zero stressful room check-outs")
    } else {
      warnings.push("Requires multiple hotel changes during the trip")
    }
  } else if (priority === "comfort") {
    if (pkg.accommodation.category.includes("4-Star") || pkg.accommodation.category.includes("5-Star") || pkg.accommodation.category.includes("Luxury")) {
      score += 15
      reasons.push(`Includes premium ${pkg.accommodation.category}`)
    } else {
      score -= 8
      warnings.push("Standard/3-Star accommodation tier")
    }
    if (pkg.convenience.transportType.includes("Private")) {
      score += 6
      reasons.push("Includes private AC vehicle transfers throughout")
    }
  } else if (priority === "adventure") {
    if (pkg.experiences.breakdown.adventure >= 80) {
      score += 15
      reasons.push("High adventure score featuring watersports, treks & safaris")
    } else {
      score -= 10
      warnings.push("Leaning more towards passive leisure than high thrill")
    }
  }

  // Weather bonus
  if (pkg.weatherSuitability.status === "excellent") {
    score += 5
    reasons.push(pkg.weatherSuitability.reason)
  }

  const finalScore = Math.min(99, Math.max(55, Math.round(score)))

  return {
    score: finalScore,
    reasons,
    warnings
  }
}

/* ─────────────────────────────────────────────
   MAIN PACKAGE COMPARISON COMPONENT
   ───────────────────────────────────────────── */
export function PackageComparison({ onNavigateView, onSelectDestination, onOpenAuth }) {
  const { selectPackageAndBuildTrip, selectedPackage } = useTrip()

  const [activeCategory, setActiveCategory] = useState("beach")
  const [selectedForCompare, setSelectedForCompare] = useState(["goa-escape", "gokarna-getaway"])
  const [userPriority, setUserPriority] = useState("relaxation")
  const [userBudget] = useState(32000)

  const [viewingModalPkg, setViewingModalPkg] = useState(null)
  const [showingMatchDetailPkg, setShowingMatchDetailPkg] = useState(null)
  const [showFullMatrix, setShowFullMatrix] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // Combined Dataset
  const allPackages = useMemo(() => {
    return Object.values(PACKAGE_DATA).flat()
  }, [])

  const currentCategoryPackages = useMemo(() => {
    return PACKAGE_DATA[activeCategory] || PACKAGE_DATA.beach
  }, [activeCategory])

  // Packages currently selected for comparison
  const comparedPackagesList = useMemo(() => {
    return allPackages.filter((p) => selectedForCompare.includes(p.id))
  }, [allPackages, selectedForCompare])

  // Dynamic Decision Metrics Calculation
  const decisionData = useMemo(() => {
    if (comparedPackagesList.length === 0) return null

    const scored = comparedPackagesList.map((pkg) => {
      const match = calculatePersonalMatchScore(pkg, userPriority, userBudget)
      const valueScore = (pkg.rating * 20 + pkg.experiences.activitiesCount * 5) / (pkg.numericPrice / 1000)
      const expScore = pkg.experiences.activitiesCount * 10 + pkg.experiences.attractionsCount * 5 + (pkg.experiences.breakdown.adventure || 50)
      return { pkg, match, valueScore, expScore }
    })

    // Sort to find winners
    const bestForYouObj = [...scored].sort((a, b) => b.match.score - a.match.score)[0]
    const bestValueObj = [...scored].sort((a, b) => b.valueScore - a.valueScore)[0]
    const bestExperienceObj = [...scored].sort((a, b) => b.expScore - a.expScore)[0]

    const runnerUpObj = scored.find((s) => s.pkg.id !== bestForYouObj.pkg.id) || scored[1] || scored[0]

    // Formulate intelligent trade-off explanation
    let rationale = `Recommended because it matches your preferred ${userPriority} focus`
    if (bestForYouObj.match.reasons.length > 0) {
      rationale += `, ${bestForYouObj.match.reasons[0].toLowerCase()}`
      if (bestForYouObj.match.reasons[1]) {
        rationale += `, and ${bestForYouObj.match.reasons[1].toLowerCase()}`
      }
    }

    let tradeOff = ""
    if (runnerUpObj && runnerUpObj.pkg.id !== bestForYouObj.pkg.id) {
      if (runnerUpObj.pkg.numericPrice < bestForYouObj.pkg.numericPrice) {
        tradeOff = `Choose ${runnerUpObj.pkg.name} instead if saving ₹${(bestForYouObj.pkg.numericPrice - runnerUpObj.pkg.numericPrice).toLocaleString("en-IN")} is your primary goal.`
      } else if (runnerUpObj.pkg.experiences.activitiesCount > bestForYouObj.pkg.experiences.activitiesCount) {
        tradeOff = `Choose ${runnerUpObj.pkg.name} instead if you prefer more total activities (+${runnerUpObj.pkg.experiences.activitiesCount - bestForYouObj.pkg.experiences.activitiesCount} extra).`
      } else {
        tradeOff = `Choose ${runnerUpObj.pkg.name} instead if you prefer ${runnerUpObj.pkg.destination}'s unique regional spots.`
      }
    }

    return {
      scored,
      bestForYouId: bestForYouObj.pkg.id,
      bestValueId: bestValueObj.pkg.id,
      bestExperienceId: bestExperienceObj.pkg.id,
      recommendedPkg: bestForYouObj.pkg,
      recommendedMatch: bestForYouObj.match,
      runnerUpPkg: runnerUpObj ? runnerUpObj.pkg : null,
      rationale,
      tradeOff
    }
  }, [comparedPackagesList, userPriority, userBudget])

  const toggleCompare = (pkgId) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(pkgId)) {
        if (prev.length <= 1) return prev // Keep at least 1
        return prev.filter((id) => id !== pkgId)
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], pkgId]
      }
      return [...prev, pkgId]
    })
  }

  const handleAddToTrip = (pkg) => {
    selectPackageAndBuildTrip(pkg)
    setToastMessage(`✓ ${pkg.name} added to your personal itinerary!`)
    setTimeout(() => setToastMessage(null), 5000)
  }

  return (
    <section id="packages" className="relative w-full min-h-screen py-12 sm:py-16 md:py-20 bg-background text-foreground select-none font-sans transition-colors duration-300">
      
      {/* Background Cartographic Radial Pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-background to-background pointer-events-none" />

      {/* Confirmation Toast Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl bg-emerald-600 text-white px-6 py-3.5 shadow-2xl border border-white/20 text-xs sm:text-sm font-semibold"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{toastMessage}</span>
            <Button
              size="sm"
              onClick={() => onNavigateView && onNavigateView("itinerary")}
              className="ml-2 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 font-extrabold text-xs px-3.5 py-1.5 shadow"
            >
              Open Planner →
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
        
        {/* 1. Header Title & Subtitle */}
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <h2 className="font-serif-editorial text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground uppercase leading-[0.95]">
            COMPARE LESS.<br />
            <span className="font-heading font-extrabold text-[#C98B55] italic lowercase">experience</span><br />
            MORE.
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto font-medium tracking-wide">
            Compare packages side-by-side and easily add them directly to your personal trip itinerary or saved trips.
          </p>
        </div>

        {/* 3. DECISION RECOMMENDATION CARD (The "Best For You" Answer) */}
        {decisionData && decisionData.recommendedPkg && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl border border-[#C98B55]/40 bg-card shadow-sm overflow-hidden p-6 sm:p-8 space-y-6 relative"
          >
            <div className="absolute top-0 right-0 bg-[#C98B55] text-white text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-bl-md shadow-xs">
              Personalized Decision
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              {/* Left Summary */}
              <div className="space-y-3 flex-1">
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#C98B55] block">
                  BEST FOR YOU ({decisionData.recommendedMatch.score}% MATCH)
                </span>

                <h3 className="font-heading text-2xl sm:text-4xl font-extrabold text-foreground">
                  {decisionData.recommendedPkg.name}
                </h3>

                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed max-w-2xl font-medium border-l-2 border-[#C98B55] pl-3 py-0.5">
                  "{decisionData.rationale}"
                </p>

                {/* Key Highlight Metadata Line */}
                <div className="text-xs font-semibold text-muted-foreground pt-1 tracking-wide">
                  Est. Total Cost: <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹{decisionData.recommendedPkg.estimatedTotalCost.toLocaleString("en-IN")}</span> · {decisionData.recommendedPkg.pace.label} Pace · {decisionData.recommendedPkg.convenience.transportType}
                </div>
              </div>

              {/* Right CTA Block */}
              <div className="flex flex-col sm:flex-row md:flex-col items-center gap-3 shrink-0 w-full md:w-auto">
                <Button
                  onClick={() => handleAddToTrip(decisionData.recommendedPkg)}
                  className="w-full sm:w-auto rounded-sm bg-[#C98B55] hover:bg-[#b07847] text-white font-semibold text-xs uppercase tracking-wider px-5 py-2.5 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Select {decisionData.recommendedPkg.destination} Trip
                </Button>

                <button
                  onClick={() => setShowingMatchDetailPkg(decisionData.recommendedPkg)}
                  className="text-xs font-bold text-[#C98B55] hover:underline cursor-pointer"
                >
                  Why {decisionData.recommendedMatch.score}% Match? (View Breakdown)
                </button>
              </div>
            </div>

            {/* Trade-Off Callout Note */}
            {decisionData.tradeOff && (
              <div className="rounded-md bg-secondary/60 border border-border p-3 text-xs text-muted-foreground">
                <strong className="text-foreground">Honest Trade-off: </strong>
                {decisionData.tradeOff}
              </div>
            )}
          </motion.div>
        )}

        {/* 4. SIDE-BY-SIDE PACKAGE COMPARISON CARDS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xs uppercase tracking-widest text-[#C98B55] font-extrabold">
              Comparing {comparedPackagesList.length} Packages Side-by-Side
            </h3>

            {/* Category Filter Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {VACATION_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id)
                    const catPkgs = PACKAGE_DATA[cat.id] || []
                    if (catPkgs.length >= 2) {
                      setSelectedForCompare([catPkgs[0].id, catPkgs[1].id])
                    }
                  }}
                  className={`rounded-sm px-3 py-1.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-[#C98B55] text-white border-[#C98B55]"
                      : "bg-card text-muted-foreground border-border hover:bg-secondary"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Package Cards Grid */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {comparedPackagesList.map((pkg) => {
              const matchObj = calculatePersonalMatchScore(pkg, userPriority, userBudget)
              const isBestForYou = decisionData?.bestForYouId === pkg.id
              const isBestValue = decisionData?.bestValueId === pkg.id
              const isBestExp = decisionData?.bestExperienceId === pkg.id

              return (
                <div
                  key={pkg.id}
                  className={`group relative rounded-xl border bg-card text-card-foreground p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-all hover:border-[#C98B55] ${
                    isBestForYou ? "border-2 border-[#C98B55]" : "border-border"
                  }`}
                >
                  <div className="space-y-4">
                    
                    {/* Top Typography Badges */}
                    <div className="flex items-center justify-between gap-2 flex-wrap min-h-[24px]">
                      {isBestForYou ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#C98B55]">
                          BEST FOR YOU
                        </span>
                      ) : isBestValue ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                          BEST VALUE
                        </span>
                      ) : isBestExp ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                          BEST EXPERIENCE
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {pkg.destination}
                        </span>
                      )}

                      {/* Clickable Personal Match Score Badge */}
                      <button
                        onClick={() => setShowingMatchDetailPkg(pkg)}
                        className="text-[11px] font-bold uppercase tracking-wider text-[#C98B55] hover:underline cursor-pointer"
                        title="Click to view why this score matches you"
                      >
                        {matchObj.score}% MATCH
                      </button>
                    </div>

                    {/* Package Image & Hero Overlay */}
                    <div className="relative h-44 w-full rounded-lg overflow-hidden border border-border/80">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute top-3 left-3">
                        <span className="rounded-xs bg-black/70 backdrop-blur-md text-white font-heading font-semibold text-[10px] uppercase tracking-wider px-2.5 py-0.5 border border-white/20">
                          {pkg.duration}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h4 className="font-heading text-lg font-bold leading-tight drop-shadow-md truncate">
                          {pkg.name}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] opacity-90 mt-0.5 font-medium">
                          <span>⭐ {pkg.rating} ({pkg.reviewsCount} reviews)</span>
                          <span>{pkg.pace.label}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Estimated Actual Trip Cost */}
                    <div className="rounded-md bg-secondary/40 p-3 border border-border/50 space-y-1">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[9.5px] uppercase tracking-widest text-muted-foreground font-bold block">Package Base Price</span>
                          <span className="font-heading text-2xl font-extrabold text-foreground">{pkg.price}</span>
                          <span className="text-[11px] text-muted-foreground font-medium"> / person</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9.5px] uppercase tracking-widest text-muted-foreground font-bold block">Est. Actual Trip Cost</span>
                          <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                            ₹{pkg.estimatedTotalCost.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Feature Highlights — Clean Typography */}
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="font-semibold text-foreground truncate">
                        {pkg.accommodation.category}
                      </div>

                      <div className="font-medium">
                        {pkg.experiences.activitiesCount} Activities · {pkg.experiences.attractionsCount} Sights
                      </div>

                      <div className="font-medium truncate">
                        {pkg.convenience.airportTransfers}
                      </div>
                    </div>

                  </div>

                  {/* Bottom Card Actions */}
                  <div className="mt-5 pt-3 border-t border-border/60 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingModalPkg(pkg)}
                        className="rounded-sm border-border hover:bg-secondary font-semibold text-xs cursor-pointer"
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        Details
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCompare(pkg.id)}
                        className={`rounded-sm font-semibold text-xs transition-all cursor-pointer ${
                          selectedForCompare.includes(pkg.id)
                            ? "bg-secondary border-border text-foreground"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        <X className="mr-1 h-3.5 w-3.5" />
                        Remove
                      </Button>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleAddToTrip(pkg)}
                      className={`w-full rounded-sm font-semibold text-xs uppercase tracking-wider py-2 flex items-center justify-center gap-1.5 cursor-pointer ${
                        isBestForYou
                          ? "bg-[#C98B55] hover:bg-[#b07847] text-white"
                          : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                      <span>+ Add to My Trip</span>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 5. PROGRESSIVE DISCLOSURE: VIEW FULL DETAILED COMPARISON MATRIX */}
        <div className="pt-4 text-center">
          <Button
            variant="outline"
            onClick={() => setShowFullMatrix(!showFullMatrix)}
            className="rounded-sm border-border bg-card hover:bg-secondary text-foreground font-bold text-xs sm:text-sm px-6 py-3 shadow-sm cursor-pointer inline-flex items-center gap-2"
          >
            <Layers className="h-4 w-4 text-[#C98B55]" />
            {showFullMatrix ? "Hide Detailed Comparison Matrix" : "View Full Detailed Category Comparison Matrix"}
            <ChevronRight className={`h-4 w-4 transition-transform ${showFullMatrix ? "rotate-90" : ""}`} />
          </Button>
        </div>

        {showFullMatrix && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl text-card-foreground"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="p-4 font-heading text-xs font-extrabold uppercase tracking-widest text-muted-foreground w-1/4">
                      Comparison Category
                    </th>
                    {comparedPackagesList.map((pkg) => (
                      <th key={pkg.id} className="p-4 text-center border-l border-border w-1/4">
                        <span className="font-heading text-base font-extrabold text-foreground block truncate">{pkg.name}</span>
                        <span className="font-extrabold text-sm text-[#C98B55] block">{pkg.price}</span>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-border text-xs sm:text-sm">
                  {/* Category: Cost */}
                  <tr className="bg-secondary/20">
                    <td colSpan={comparedPackagesList.length + 1} className="p-3 font-heading font-extrabold text-[#C98B55] uppercase text-[10px] tracking-widest">
                      💰 A. COST & VALUE
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Package Base Price</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-extrabold text-foreground border-l border-border">{pkg.price}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Taxes & Mandatory Fees</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-medium border-l border-border">{pkg.costBreakdown.taxes}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Est. Additional Expenses</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-medium border-l border-border">{pkg.costBreakdown.localExpenses}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Est. Total Trip Expenditure</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-extrabold text-emerald-600 dark:text-emerald-400 border-l border-border">₹{pkg.estimatedTotalCost.toLocaleString("en-IN")}</td>
                    ))}
                  </tr>

                  {/* Category: Accommodation */}
                  <tr className="bg-secondary/20">
                    <td colSpan={comparedPackagesList.length + 1} className="p-3 font-heading font-extrabold text-[#C98B55] uppercase text-[10px] tracking-widest">
                      🏨 B. ACCOMMODATION & MEALS
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Hotel Tier Category</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-bold text-foreground border-l border-border">{pkg.accommodation.category}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Location & Accessibility</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-medium border-l border-border">{pkg.accommodation.location} ({pkg.accommodation.distanceToHub})</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Meals Included</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-medium border-l border-border">{pkg.accommodation.meals}</td>
                    ))}
                  </tr>

                  {/* Category: Trip Pace */}
                  <tr className="bg-secondary/20">
                    <td colSpan={comparedPackagesList.length + 1} className="p-3 font-heading font-extrabold text-[#C98B55] uppercase text-[10px] tracking-widest">
                      🌿 C. TRIP PACE & SCHEDULE
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Pace Classification</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-bold border-l border-border">{pkg.pace.icon} {pkg.pace.label}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Activities per Day</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-medium border-l border-border">{pkg.pace.actPerDay} activities/day</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Average Daily Free Time</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-medium border-l border-border">{pkg.pace.freeTimeHrs} hours free time/day</td>
                    ))}
                  </tr>

                  {/* Category: Convenience */}
                  <tr className="bg-secondary/20">
                    <td colSpan={comparedPackagesList.length + 1} className="p-3 font-heading font-extrabold text-[#C98B55] uppercase text-[10px] tracking-widest">
                      🚗 D. CONVENIENCE & LOGISTICS
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Airport Transfers</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-medium border-l border-border">{pkg.convenience.airportTransfers}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Local Transport Vehicle</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-medium border-l border-border">{pkg.convenience.localTransport}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Hotel Changes</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-medium border-l border-border">{pkg.convenience.hotelChanges} Stay Location</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

      </div>

      {/* 6. PERSONAL MATCH SCORE BREAKDOWN DIALOG MODAL */}
      <AnimatePresence>
        {showingMatchDetailPkg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl bg-card border border-border text-card-foreground p-6 sm:p-8 shadow-2xl space-y-5"
            >
              <button
                onClick={() => setShowingMatchDetailPkg(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C98B55]">
                  Score Transparency Report
                </span>
                <h3 className="font-heading text-2xl font-extrabold flex items-center gap-2">
                  <span>{showingMatchDetailPkg.name}</span>
                  <span className="text-[#C98B55]">
                    ({calculatePersonalMatchScore(showingMatchDetailPkg, userPriority, userBudget).score}% Match)
                  </span>
                </h3>
              </div>

              {/* Reasons List */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Why this matches your {userPriority} preference ({calculatePersonalMatchScore(showingMatchDetailPkg, userPriority, userBudget).reasons.length})
                </h4>

                <ul className="space-y-2 text-xs text-foreground">
                  {calculatePersonalMatchScore(showingMatchDetailPkg, userPriority, userBudget).reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warnings List */}
              {calculatePersonalMatchScore(showingMatchDetailPkg, userPriority, userBudget).warnings.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" />
                    Potential Trade-offs to Consider
                  </h4>

                  <ul className="space-y-2 text-xs text-foreground">
                    {calculatePersonalMatchScore(showingMatchDetailPkg, userPriority, userBudget).warnings.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                        <span className="text-amber-500 font-bold">⚠</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                onClick={() => setShowingMatchDetailPkg(null)}
                className="w-full rounded-2xl bg-[#C98B55] text-white hover:bg-[#b07847] font-bold text-xs py-3 shadow-md cursor-pointer"
              >
                Close Breakdown
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. PACKAGE DETAILS MODAL */}
      <AnimatePresence>
        {viewingModalPkg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl rounded-3xl bg-card border border-border text-card-foreground p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setViewingModalPkg(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-2 border-b border-border pb-4">
                <span className="text-xs font-bold text-[#C98B55] bg-[#C98B55]/15 px-3 py-1 rounded-full border border-[#C98B55]/30 uppercase tracking-wider">
                  {viewingModalPkg.duration} • {viewingModalPkg.destination}
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
                  {viewingModalPkg.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {viewingModalPkg.description}
                </p>
              </div>

              <div className="relative h-52 w-full rounded-2xl overflow-hidden border border-border">
                <img src={viewingModalPkg.image} alt={viewingModalPkg.name} className="h-full w-full object-cover" />
              </div>

              <div className="space-y-2">
                <h4 className="font-heading text-xs font-extrabold uppercase tracking-widest text-[#C98B55]">
                  Included Attractions ({viewingModalPkg.experiences.attractionsList.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {viewingModalPkg.experiences.attractionsList.map((att, idx) => (
                    <span key={idx} className="rounded-xl bg-secondary border border-border px-3 py-1 text-xs font-semibold text-foreground">
                      📍 {att}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-heading text-xs font-extrabold uppercase tracking-widest text-[#C98B55]">
                  Included Curated Activities ({viewingModalPkg.experiences.activitiesList.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {viewingModalPkg.experiences.activitiesList.map((act, idx) => (
                    <span key={idx} className="rounded-xl bg-[#C98B55]/15 border border-[#C98B55]/30 px-3 py-1 text-xs font-semibold text-[#C98B55]">
                      ✨ {act}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Package Price</span>
                  <span className="font-heading text-2xl font-extrabold text-foreground">{viewingModalPkg.price}</span>
                </div>

                <Button
                  onClick={() => {
                    handleAddToTrip(viewingModalPkg)
                    setViewingModalPkg(null)
                  }}
                  className="rounded-2xl bg-[#C98B55] hover:bg-[#b07847] text-white font-extrabold text-xs sm:text-sm px-6 py-3 shadow-lg cursor-pointer"
                >
                  + Add to My Trip
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  )
}
