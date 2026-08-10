"use client"

import { createContext, useContext, useState, useEffect, useMemo } from "react"

// Initial default preset spots for Goa / Bali fallback
const defaultTemplates = [
  {
    id: "default-1",
    time: "09:00 AM",
    openingHours: "08:00 AM - 10:00 PM",
    type: "Food",
    category: "Food & Dining",
    title: "Artjuna Cafe Anjuna",
    desc: "Organic smoothies and bakery.",
    cost: "₹450",
    numericCost: 450,
    lat: 15.5866,
    lng: 73.7431,
    isPopular: true
  },
  {
    id: "default-2",
    time: "01:30 PM",
    openingHours: "09:30 AM - 06:00 PM",
    type: "Sightseeing",
    category: "Activities",
    title: "Fort Aguada Lighthouse",
    desc: "17th-century Portuguese fortress view.",
    cost: "₹200",
    numericCost: 200,
    lat: 15.4925,
    lng: 73.7737,
    isPopular: true
  },
  {
    id: "default-3",
    time: "06:00 PM",
    openingHours: "05:00 PM - 01:00 AM",
    type: "Sunset",
    category: "Food & Dining",
    title: "Thalassa Vagator Sunset",
    desc: "Cliffside Greek vibe dining.",
    cost: "₹1,200",
    numericCost: 1200,
    lat: 15.6028,
    lng: 73.7348,
    isPopular: true
  }
]

const initialItinerary = [
  { day: 1, date: "Aug 15", activities: [...defaultTemplates] },
  {
    day: 2,
    date: "Aug 16",
    activities: [
      {
        id: "default-4",
        time: "10:00 AM",
        openingHours: "10:00 AM - 07:00 PM",
        type: "Relaxation",
        category: "Activities",
        title: "Baga & Calangute Water Sports",
        desc: "Parasailing, jet ski, and beach fun.",
        cost: "₹1,800",
        numericCost: 1800,
        lat: 15.5553,
        lng: 73.7517,
        isPopular: true
      },
      {
        id: "default-5",
        time: "02:00 PM",
        openingHours: "12:00 PM - 11:00 PM",
        type: "Food",
        category: "Food & Dining",
        title: "Fisherman's Wharf Seafood",
        desc: "Authentic Goan curry & fresh catches.",
        cost: "₹950",
        numericCost: 950,
        lat: 15.5600,
        lng: 73.7600
      }
    ]
  },
  {
    day: 3,
    date: "Aug 17",
    activities: [
      {
        id: "default-6",
        time: "11:00 AM",
        openingHours: "10:00 AM - 08:00 PM",
        type: "Sightseeing",
        category: "Shopping",
        title: "Anjuna Flea Market & Souvenirs",
        desc: "Handcrafted accessories and beachwear.",
        cost: "₹1,500",
        numericCost: 1500,
        lat: 15.5800,
        lng: 73.7400
      }
    ]
  }
]

const TripContext = createContext(null)

export function TripProvider({ children }) {
  // Shared Core Trip Parameters
  const [destination, setDestination] = useState("")
  const [startDate, setStartDate] = useState("2026-08-15")
  const [endDate, setEndDate] = useState("2026-08-17")
  const [days, setDays] = useState(3)
  const [travelers, setTravelers] = useState(2)
  const [stayTier, setStayTier] = useState("Standard") // Economy | Standard | Luxury
  const [customTargetBudget, setCustomTargetBudget] = useState(null) // Custom entered budget amount in INR (₹)

  // Centralized Selected Package State
  const [selectedPackage, setSelectedPackage] = useState(null)

  // Load selected package from localStorage on mount
  useEffect(() => {
    try {
      const savedPkg = localStorage.getItem("tripnest_selected_package")
      if (savedPkg) {
        setSelectedPackage(JSON.parse(savedPkg))
      }
    } catch (e) {
      console.error("Failed to load saved package:", e)
    }
  }, [])

  // Centralized Itinerary State
  const [itinerary, setItinerary] = useState([])

  // BASE STAY / BASE HOTEL STATE
  const [baseStay, setBaseStay] = useState(null)

  // SAVED TRIPS & OFFLINE REPORT STATE
  const [savedTrips, setSavedTrips] = useState([])
  const [savedTripsModalOpen, setSavedTripsModalOpen] = useState(false)
  const [activeReportTrip, setActiveReportTrip] = useState(null)

  // Load saved trips from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("tripnest_saved_trips")
      if (stored) {
        setSavedTrips(JSON.parse(stored))
      } else {
        // Fallback default saved trip for quick demo
        const defaultSaved = [
          {
            id: "trip-goa-demo",
            destination: "Goa (India)",
            startDate: "2026-08-15",
            endDate: "2026-08-17",
            days: 3,
            travelers: 2,
            stayTier: "Standard",
            totalBudget: 18500,
            itinerary: initialItinerary,
            createdAt: "Aug 15, 2026"
          }
        ]
        setSavedTrips(defaultSaved)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Manual Category Budget Overrides (User can override in Budget Planner)
  const [budgetOverrides, setBudgetOverrides] = useState({})

  // Actual Expenses Log (User logs/marks as paid in Expense Tracker)
  const [actualExpenses, setActualExpenses] = useState([])

  // Extract all itinerary spots helper
  const allItinerarySpots = useMemo(() => {
    if (!itinerary) return []
    const spots = []
    itinerary.forEach((dayPlan) => {
      if (dayPlan.activities) {
        dayPlan.activities.forEach((act) => {
          spots.push({
            ...act,
            day: dayPlan.day,
            date: dayPlan.date
          })
        })
      }
    })
    return spots
  }, [itinerary])

  // Raw baseline category costs before target budget scaling
  const rawCategoryCosts = useMemo(() => {
    const tierLower = String(stayTier || "").toLowerCase()
    const isBudgetTier = tierLower.includes("econom") || tierLower.includes("budg") || tierLower.includes("backpack")
    const isStandardTier = tierLower.includes("stand") || tierLower.includes("moder")

    // 1. Accommodation: Multiplier based on stayTier * days
    const stayMultiplier = isBudgetTier ? 1500 : isStandardTier ? 3500 : 7500
    const calculatedStay = stayMultiplier * days

    // 2. Food & Dining: Itinerary food spots + baseline food per day
    const itineraryFoodSum = allItinerarySpots
      .filter((s) => s.category === "Food & Dining" || s.type === "Food")
      .reduce((sum, s) => sum + (s.numericCost || parseInt(String(s.cost).replace(/[^\d]/g, "")) || 0), 0)
    const baseFoodRate = isBudgetTier ? 600 : isStandardTier ? 1200 : 2500
    const calculatedFood = Math.max(baseFoodRate * travelers * days, itineraryFoodSum * travelers)

    // 3. Transport: Itinerary transport spots + baseline transit
    const itineraryTransportSum = allItinerarySpots
      .filter((s) => s.category === "Transport" || s.type === "Transport")
      .reduce((sum, s) => sum + (s.numericCost || parseInt(String(s.cost).replace(/[^\d]/g, "")) || 0), 0)
    const baseTransitRate = isBudgetTier ? (600 * travelers + 400 * days) : isStandardTier ? (1200 * travelers + 600 * days) : (2500 * travelers + 1500 * days)
    const calculatedTransport = baseTransitRate + itineraryTransportSum

    // 4. Activities: Sum of activity costs from itinerary
    const itineraryActivitiesSum = allItinerarySpots
      .filter((s) => s.category === "Activities" || s.type === "Sightseeing" || s.type === "Relaxation" || s.type === "Sunset" || s.type === "Show")
      .reduce((sum, s) => sum + (s.numericCost || parseInt(String(s.cost).replace(/[^\d]/g, "")) || 0), 0)
    const baseActivityRate = isBudgetTier ? 500 : isStandardTier ? 1000 : 2200
    const calculatedActivities = Math.max(baseActivityRate * travelers * days, itineraryActivitiesSum * travelers)

    // 5. Shopping: Itinerary shopping spots + baseline
    const itineraryShoppingSum = allItinerarySpots
      .filter((s) => s.category === "Shopping" || s.type === "Shopping")
      .reduce((sum, s) => sum + (s.numericCost || parseInt(String(s.cost).replace(/[^\d]/g, "")) || 0), 0)
    const baseShopRate = isBudgetTier ? 1000 : isStandardTier ? 2000 : 4500
    const calculatedShopping = Math.max(baseShopRate * travelers, itineraryShoppingSum * travelers)

    // 6. Emergency Reserve
    const baseEmergencyRate = isBudgetTier ? 800 : isStandardTier ? 1200 : 2500
    const calculatedEmergency = baseEmergencyRate * days

    return {
      "Accommodation": budgetOverrides["Accommodation"] ?? calculatedStay,
      "Food & Dining": budgetOverrides["Food & Dining"] ?? calculatedFood,
      "Transport": budgetOverrides["Transport"] ?? calculatedTransport,
      "Activities": budgetOverrides["Activities"] ?? calculatedActivities,
      "Shopping": budgetOverrides["Shopping"] ?? calculatedShopping,
      "Emergency Reserve": budgetOverrides["Emergency Reserve"] ?? calculatedEmergency
    }
  }, [allItinerarySpots, days, travelers, stayTier, budgetOverrides])

  const rawTotal = useMemo(() => {
    return Object.values(rawCategoryCosts).reduce((sum, val) => sum + val, 0)
  }, [rawCategoryCosts])

  // Category Budgets: Proportionally scaled if customTargetBudget is set, ensuring category sum matches totalBudget
  const categoryBudgets = useMemo(() => {
    if (customTargetBudget && !isNaN(customTargetBudget) && customTargetBudget > 0 && rawTotal > 0) {
      const scaleFactor = customTargetBudget / rawTotal
      return {
        "Accommodation": Math.round((rawCategoryCosts["Accommodation"] || 0) * scaleFactor),
        "Food & Dining": Math.round((rawCategoryCosts["Food & Dining"] || 0) * scaleFactor),
        "Transport": Math.round((rawCategoryCosts["Transport"] || 0) * scaleFactor),
        "Activities": Math.round((rawCategoryCosts["Activities"] || 0) * scaleFactor),
        "Shopping": Math.round((rawCategoryCosts["Shopping"] || 0) * scaleFactor),
        "Emergency Reserve": Math.round((rawCategoryCosts["Emergency Reserve"] || 0) * scaleFactor)
      }
    }
    return rawCategoryCosts
  }, [rawCategoryCosts, customTargetBudget, rawTotal])

  // Total Budget: Always equals exact sum of category budgets
  const totalBudget = useMemo(() => {
    return Object.values(categoryBudgets).reduce((sum, val) => sum + val, 0)
  }, [categoryBudgets])

  // Auto-imported Planned Expenses derived from Itinerary activities & baseline costs
  const plannedExpenses = useMemo(() => {
    const list = []
    
    // Add Hotel Stay
    list.push({
      id: "plan-hotel",
      title: `${stayTier} Accommodation (${days} Nights)`,
      category: "Accommodation",
      amount: categoryBudgets["Accommodation"],
      day: "All Days",
      date: "Trip Duration",
      isPlanned: true
    })

    // Add Itinerary Activities
    allItinerarySpots.forEach((spot) => {
      const numCost = spot.numericCost || parseInt(String(spot.cost).replace(/[^\d]/g, "")) || 500
      list.push({
        id: `plan-spot-${spot.id}`,
        spotId: spot.id,
        title: spot.title,
        category: spot.category || (spot.type === "Food" ? "Food & Dining" : spot.type === "Shopping" ? "Shopping" : "Activities"),
        amount: numCost * travelers,
        day: `Day ${spot.day}`,
        date: spot.date || `Day ${spot.day}`,
        isPlanned: true
      })
    })

    return list
  }, [allItinerarySpots, days, stayTier, categoryBudgets, travelers])

  // Actual Spending calculations
  const totalSpent = useMemo(() => {
    return actualExpenses.reduce((sum, item) => sum + item.amount, 0)
  }, [actualExpenses])

  const remainingBudget = useMemo(() => {
    return Math.max(0, totalBudget - totalSpent)
  }, [totalBudget, totalSpent])

  const budgetDifference = useMemo(() => {
    return totalBudget - totalSpent
  }, [totalBudget, totalSpent])

  // Category-wise spent breakdown
  const actualCategorySpent = useMemo(() => {
    return actualExpenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount
      return acc
    }, {})
  }, [actualExpenses])

  // Handlers for Two-Way Synchronization

  // 1. Update Itinerary
  const updateItinerary = (newItinerary) => {
    setItinerary(newItinerary)
  }

  // 2. Add Spot to Itinerary (Prevents duplicates & initializes days if needed)
  const addSpotToItinerary = (dayIndex = 0, spot) => {
    let targetDayIdx = Math.max(0, Number(dayIndex) || 0)

    setItinerary((prev) => {
      const updated = prev && Array.isArray(prev) ? [...prev] : []

      // Check if spot title already exists in any day
      const spotTitleLower = (spot.title || "").trim().toLowerCase()
      if (spotTitleLower) {
        const alreadyExists = updated.some((d) =>
          d.activities?.some((act) => act.title.toLowerCase() === spotTitleLower)
        )
        if (alreadyExists) {
          console.warn("Spot already exists in itinerary:", spot.title)
          return prev
        }
      }

      // If itinerary is empty or target dayIndex doesn't exist, create days up to targetDayIdx
      if (updated.length <= targetDayIdx) {
        const daysToCreate = Math.max(targetDayIdx + 1, updated.length === 0 ? 3 : targetDayIdx + 1)
        for (let i = updated.length; i < daysToCreate; i++) {
          updated.push({
            day: i + 1,
            date: `Day ${i + 1}`,
            title: `Day ${i + 1}: ${destination || "City"} Exploration & Culture`,
            activities: []
          })
        }
      }

      const currentDayObj = updated[targetDayIdx] || updated[0]
      const existingActs = currentDayObj.activities || []

      // Smart time calculation based on position or spot.time
      let assignedTime = spot.time
      if (!assignedTime) {
        if (existingActs.length === 0) assignedTime = "09:00 AM"
        else if (existingActs.length === 1) assignedTime = "01:30 PM"
        else if (existingActs.length === 2) assignedTime = "06:00 PM"
        else assignedTime = "08:30 PM"
      }

      const numCost = spot.numericCost || parseInt(String(spot.cost || "500").replace(/[^\d]/g, "")) || 500
      const formattedSpot = {
        id: spot.id || `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        time: assignedTime,
        openingHours: spot.openingHours || "08:00 AM - 08:00 PM",
        type: spot.type || (existingActs.length === 0 ? "Sightseeing" : existingActs.length === 1 ? "Food" : "Sunset"),
        category: spot.category || (spot.type === "Food" ? "Food & Dining" : "Activities"),
        title: spot.title || "New Spot",
        desc: spot.desc || `Added attraction for trip itinerary.`,
        cost: typeof spot.cost === "string" ? spot.cost : `₹${numCost.toLocaleString("en-IN")}`,
        numericCost: numCost,
        lat: spot.lat || 15.55 + (Math.random() - 0.5) * 0.05,
        lng: spot.lng || 73.75 + (Math.random() - 0.5) * 0.05,
        images: spot.images || [
          spot.img || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"
        ]
      }

      updated[targetDayIdx] = {
        ...currentDayObj,
        activities: [...existingActs, formattedSpot]
      }

      return updated
    })
  }

  // 3. Remove Spot from Itinerary
  const removeSpotFromItinerary = (dayIndex, spotIndex) => {
    setItinerary((prev) => {
      if (!prev) return prev
      const updated = [...prev]
      if (!updated[dayIndex]) return prev
      const activities = [...updated[dayIndex].activities]
      activities.splice(spotIndex, 1)
      updated[dayIndex] = {
        ...updated[dayIndex],
        activities
      }
      return updated
    })
  }

  // Remove spot by matching title/name
  const removeSpotByName = (spotName) => {
    if (!spotName) return false
    let removed = false

    setItinerary((prev) => {
      if (!prev) return prev
      const lowerQuery = spotName.toLowerCase().trim()
      return prev.map((dayPlan) => {
        const remaining = (dayPlan.activities || []).filter((act) => {
          const titleLower = (act.title || "").toLowerCase()
          const match = titleLower.includes(lowerQuery) || lowerQuery.includes(titleLower)
          if (match) removed = true
          return !match
        })
        return {
          ...dayPlan,
          activities: remaining
        }
      })
    })

    return removed
  }

  // Reorder spots in a specific day's itinerary
  const reorderDayActivities = (dayIndex, fromIndex, toIndex) => {
    setItinerary((prev) => {
      if (!prev || !prev[dayIndex]) return prev
      const updated = [...prev]
      const activities = [...updated[dayIndex].activities]
      if (fromIndex < 0 || fromIndex >= activities.length || toIndex < 0 || toIndex >= activities.length) {
        return prev
      }
      const [movedItem] = activities.splice(fromIndex, 1)
      activities.splice(toIndex, 0, movedItem)
      updated[dayIndex] = {
        ...updated[dayIndex],
        activities
      }
      return updated
    })
  }

  // Generate Full Multi-Day Itinerary and Populate State Globally
  const generateTripItinerary = (cityName, totalDays = 3, startStr = "2026-08-15") => {
    const destName = cityName || destination || "Goa (India)"
    const numDays = Number(totalDays) || 3

    setDestination(destName)
    setDays(numDays)

    const baseLat = 15.55
    const baseLng = 73.75
    const img = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"

    const generated = []
    for (let d = 1; d <= numDays; d++) {
      const currentDate = new Date(startStr)
      currentDate.setDate(currentDate.getDate() + (d - 1))
      const dateFormatted = currentDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
      })

      generated.push({
        day: d,
        title: d === 1 ? `Arrival & Historic Highlights of ${destName}` : d === 2 ? `Cultural Exploration & Local Cuisines` : d === 3 ? `Scenic Panoramas & Sunset Relaxation` : `Day ${d} Local Discoveries`,
        date: dateFormatted,
        activities: [
          {
            id: `spot-${destName.toLowerCase()}-d${d}-s1-${Date.now()}`,
            time: "09:30 AM",
            openingHours: "08:30 AM - 06:00 PM",
            type: "Sightseeing",
            category: "Activities",
            title: `${destName} Heritage & Landmark Tour - Day ${d}`,
            desc: `Explore top iconic landmarks, culture, and architecture in ${destName}.`,
            cost: "₹750",
            numericCost: 750,
            lat: baseLat + (d * 0.015) + 0.005,
            lng: baseLng + (d * 0.01) + 0.005,
            images: [img]
          },
          {
            id: `spot-${destName.toLowerCase()}-d${d}-s2-${Date.now()}`,
            time: "01:30 PM",
            openingHours: "11:30 AM - 11:00 PM",
            type: "Food",
            category: "Food & Dining",
            title: `Authentic ${destName} Culinary & Tasting Trail`,
            desc: `Savor regional delicacies, street food markets, and top rated eateries.`,
            cost: "₹950",
            numericCost: 950,
            lat: baseLat - (d * 0.01) + 0.01,
            lng: baseLng + (d * 0.015) - 0.005,
            images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80"]
          },
          {
            id: `spot-${destName.toLowerCase()}-d${d}-s3-${Date.now()}`,
            time: "06:00 PM",
            openingHours: "04:30 PM - 09:30 PM",
            type: "Sunset",
            category: "Activities",
            title: `${destName} Golden Hour Promenade & Sunset Viewpoint`,
            desc: `Scenic evening views and relaxing stroll at ${destName}.`,
            cost: "₹450",
            numericCost: 450,
            lat: baseLat + (d * 0.005) - 0.015,
            lng: baseLng - (d * 0.01) + 0.02,
            images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80"]
          }
        ]
      })
    }

    setItinerary(generated)
    return generated
  }

  // 4. Update Spot Cost in Itinerary
  const updateSpotCostInItinerary = (dayIndex, spotIndex, newNumericCost) => {
    setItinerary((prev) => {
      if (!prev) return prev
      const updated = [...prev]
      if (!updated[dayIndex]) return prev
      const activities = [...updated[dayIndex].activities]
      if (!activities[spotIndex]) return prev

      activities[spotIndex] = {
        ...activities[spotIndex],
        numericCost: Number(newNumericCost),
        cost: `₹${Number(newNumericCost).toLocaleString("en-IN")}`
      }
      updated[dayIndex] = {
        ...updated[dayIndex],
        activities
      }
      return updated
    })
  }

  // 5. Budget Manual Override
  const setBudgetCategoryOverride = (categoryName, amount) => {
    setBudgetOverrides((prev) => ({
      ...prev,
      [categoryName]: Number(amount)
    }))
  }

  // Reset category override
  const resetBudgetCategoryOverride = (categoryName) => {
    setBudgetOverrides((prev) => {
      const copy = { ...prev }
      delete copy[categoryName]
      return copy
    })
  }

  // Package Cost and Additional Expenses Calculation
  const packageBaseCost = useMemo(() => {
    if (!selectedPackage) return 0
    return selectedPackage.numericPrice || parseInt(String(selectedPackage.price).replace(/[^\d]/g, "")) || 0
  }, [selectedPackage])

  const additionalExpenses = useMemo(() => {
    if (!selectedPackage) return 0
    return allItinerarySpots
      .filter((s) => !s.isFromPackage)
      .reduce((sum, s) => sum + (s.numericCost || parseInt(String(s.cost).replace(/[^\d]/g, "")) || 0), 0)
  }, [allItinerarySpots, selectedPackage])

  const estimatedTotalTripCost = useMemo(() => {
    if (selectedPackage) {
      return packageBaseCost + additionalExpenses
    }
    return totalBudget
  }, [selectedPackage, packageBaseCost, additionalExpenses, totalBudget])

  // Select Package and Auto-Generate Day-Wise Itinerary
  const selectPackageAndBuildTrip = (pkg) => {
    if (!pkg) return
    setSelectedPackage(pkg)
    try {
      localStorage.setItem("tripnest_selected_package", JSON.stringify(pkg))
    } catch (e) {
      console.error(e)
    }

    if (pkg.destination) {
      setDestination(pkg.destination)
    }
    const totalDays = pkg.durationDays || pkg.days || 3
    setDays(totalDays)

    let newItinerary = []

    if (pkg.dayWiseItinerary && Array.isArray(pkg.dayWiseItinerary) && pkg.dayWiseItinerary.length > 0) {
      newItinerary = pkg.dayWiseItinerary.map((d, dIdx) => ({
        day: dIdx + 1,
        date: d.date || `Day ${dIdx + 1}`,
        title: d.title || `Day ${dIdx + 1}: ${pkg.name || pkg.destination}`,
        activities: (d.activities || []).map((act, aIdx) => ({
          id: act.id || `pkg-${pkg.id || 'custom'}-d${dIdx + 1}-a${aIdx + 1}`,
          time: act.time || (aIdx === 0 ? "09:00 AM" : aIdx === 1 ? "01:30 PM" : "06:00 PM"),
          openingHours: act.openingHours || "08:00 AM - 08:00 PM",
          type: act.type || (aIdx === 0 ? "Sightseeing" : aIdx === 1 ? "Activities" : "Food"),
          category: act.category || "Package Attraction",
          title: act.title,
          desc: act.desc || `Included in ${pkg.name}`,
          cost: act.cost || "Included in Package",
          numericCost: act.isExtra ? (act.numericCost || parseInt(String(act.cost).replace(/[^\d]/g, "")) || 0) : 0,
          isFromPackage: true,
          lat: act.lat || (15.5 + dIdx * 0.02),
          lng: act.lng || (73.7 + aIdx * 0.02),
          images: act.images || [pkg.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"]
        }))
      }))
    } else {
      // Generate standard day-wise itinerary using package attractions and activities
      const attractions = pkg.attractionsList || pkg.attractions || ["Popular Sightseeing Spot", "Heritage Landmark", "Scenic Viewpoint"]
      const activities = pkg.activitiesList || pkg.activities || ["Water Activity / Trek", "Local Cultural Trail", "Sunset Cruise"]
      const img = pkg.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"

      for (let d = 1; d <= totalDays; d++) {
        let dayActivities = []

        if (d === 1) {
          dayActivities = [
            {
              id: `pkg-${pkg.id}-d1-a1`,
              time: "09:30 AM",
              openingHours: "08:00 AM - 08:00 PM",
              type: "Sightseeing",
              category: "Accommodation",
              title: `Arrival & Hotel Check-in (${pkg.hotelCategory || "Resort"})`,
              desc: `Private transport pick-up & check-in at your ${pkg.hotelCategory || "hotel"}.`,
              cost: "Included in Package",
              numericCost: 0,
              isFromPackage: true,
              images: [img]
            },
            {
              id: `pkg-${pkg.id}-d1-a2`,
              time: "02:00 PM",
              openingHours: "09:00 AM - 06:30 PM",
              type: "Sightseeing",
              category: "Activities",
              title: typeof attractions[0] === "string" ? attractions[0] : attractions[0]?.name || `${pkg.destination} Primary Attraction`,
              desc: `Explore ${typeof attractions[0] === "string" ? attractions[0] : attractions[0]?.name || "the top attraction"} included in your package.`,
              cost: "Included in Package",
              numericCost: 0,
              isFromPackage: true,
              images: [img]
            },
            {
              id: `pkg-${pkg.id}-d1-a3`,
              time: "07:30 PM",
              openingHours: "07:00 PM - 11:00 PM",
              type: "Food",
              category: "Food & Dining",
              title: `Welcome Dinner (${pkg.meals || "Included Meals"})`,
              desc: `Enjoy delicious regional dining included in your package plan.`,
              cost: "Included in Package",
              numericCost: 0,
              isFromPackage: true,
              images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80"]
            }
          ]
        } else if (d === 2) {
          dayActivities = [
            {
              id: `pkg-${pkg.id}-d2-a1`,
              time: "09:00 AM",
              openingHours: "08:00 AM - 06:00 PM",
              type: "Sightseeing",
              category: "Activities",
              title: typeof attractions[1] === "string" ? attractions[1] : attractions[1]?.name || `${pkg.destination} Heritage Sight`,
              desc: `Morning sightseeing tour included in package itinerary.`,
              cost: "Included in Package",
              numericCost: 0,
              isFromPackage: true,
              images: [img]
            },
            {
              id: `pkg-${pkg.id}-d2-a2`,
              time: "01:30 PM",
              openingHours: "10:00 AM - 07:00 PM",
              type: "Activities",
              category: "Activities",
              title: typeof activities[0] === "string" ? activities[0] : activities[0]?.name || `${pkg.destination} Water Sports / Adventure`,
              desc: `Curated package activity experience with all gear included.`,
              cost: "Included in Package",
              numericCost: 0,
              isFromPackage: true,
              images: [img]
            },
            {
              id: `pkg-${pkg.id}-d2-a3`,
              time: "06:00 PM",
              openingHours: "05:00 PM - 09:00 PM",
              type: "Sunset",
              category: "Activities",
              title: typeof attractions[2] === "string" ? attractions[2] : attractions[2]?.name || `${pkg.destination} Sunset Point`,
              desc: `Relaxing sunset experience and evening leisure.`,
              cost: "Included in Package",
              numericCost: 0,
              isFromPackage: true,
              images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80"]
            }
          ]
        } else {
          dayActivities = [
            {
              id: `pkg-${pkg.id}-d${d}-a1`,
              time: "10:00 AM",
              openingHours: "09:00 AM - 08:00 PM",
              type: "Sightseeing",
              category: "Shopping",
              title: typeof attractions[3] === "string" ? attractions[3] : attractions[3]?.name || `${pkg.destination} Heritage Market`,
              desc: `Guided local market visit and souvenir shopping.`,
              cost: "Included in Package",
              numericCost: 0,
              isFromPackage: true,
              images: [img]
            },
            {
              id: `pkg-${pkg.id}-d${d}-a2`,
              time: "02:00 PM",
              openingHours: "12:00 PM - 05:00 PM",
              type: "Food",
              category: "Food & Dining",
              title: `Local Culinary Experience & Departure Transport`,
              desc: `Final local meal and scheduled transfer to airport/station.`,
              cost: "Included in Package",
              numericCost: 0,
              isFromPackage: true,
              images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80"]
            }
          ]
        }

        newItinerary.push({
          day: d,
          date: `Day ${d}`,
          title: `Day ${d}: ${pkg.name} — ${d === 1 ? "Arrival & Highlights" : d === 2 ? "Adventure & Culture" : "Exploration & Departure"}`,
          activities: dayActivities
        })
      }
    }

    setItinerary(newItinerary)
  }

  const clearSelectedPackage = () => {
    setSelectedPackage(null)
    try {
      localStorage.removeItem("tripnest_selected_package")
    } catch (e) {
      console.error(e)
    }
  }

  const addActualExpense = (expense) => {
    const newEntry = {
      id: Date.now(),
      title: expense.title,
      category: expense.category || "Food & Dining",
      amount: Number(expense.amount),
      isPaid: expense.isPaid ?? true,
      day: expense.day || "Today",
      date: expense.date || "Just now"
    }
    setActualExpenses((prev) => [newEntry, ...prev])
  }

  const toggleExpensePaid = (id) => {
    setActualExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPaid: !item.isPaid } : item))
    )
  }

  const updateExpenseAmount = (id, newAmount) => {
    setActualExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, amount: Number(newAmount) } : item))
    )
  }

  const deleteActualExpense = (id) => {
    setActualExpenses((prev) => prev.filter((item) => item.id !== id))
  }

  // Save Trip & Delete Trip Handlers
  const saveCurrentTrip = () => {
    const destName = destination || "Goa (India)"
    const newTrip = {
      id: `trip-${Date.now()}`,
      destination: destName,
      startDate: startDate || "2026-08-15",
      endDate: endDate || "2026-08-17",
      days: days || 3,
      travelers: travelers || 2,
      stayTier: stayTier || "Standard",
      totalBudget: totalBudget || 18500,
      itinerary: itinerary && itinerary.length > 0 ? itinerary : initialItinerary,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }

    setSavedTrips((prev) => {
      const filtered = prev.filter((t) => t.destination.toLowerCase() !== destName.toLowerCase())
      const updated = [newTrip, ...filtered]
      try {
        localStorage.setItem("tripnest_saved_trips", JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })

    setActiveReportTrip(newTrip)
    return newTrip
  }

  const deleteSavedTrip = (id) => {
    setSavedTrips((prev) => {
      const updated = prev.filter((t) => t.id !== id)
      try {
        localStorage.setItem("tripnest_saved_trips", JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })
    if (activeReportTrip && activeReportTrip.id === id) {
      setActiveReportTrip(null)
    }
  }

  // Comparison Packages State
  const [comparisonPackages, setComparisonPackages] = useState([])

  const addPackageToCompare = (pkg) => {
    if (!pkg) return
    setComparisonPackages((prev) => {
      const exists = prev.some((p) => p.id === pkg.id || p.provider === pkg.provider)
      if (exists) {
        return prev.map((p) => (p.provider === pkg.provider ? pkg : p))
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], pkg]
      }
      return [...prev, pkg]
    })
  }

  const value = {
    destination,
    setDestination,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    days,
    setDays,
    travelers,
    setTravelers,
    stayTier,
    setStayTier,
    customTargetBudget,
    setCustomTargetBudget,

    selectedPackage,
    setSelectedPackage,
    selectPackageAndBuildTrip,
    clearSelectedPackage,
    packageBaseCost,
    additionalExpenses,
    estimatedTotalTripCost,

    comparisonPackages,
    setComparisonPackages,
    addPackageToCompare,

    itinerary,
    setItinerary,
    generateTripItinerary,
    allItinerarySpots,
    updateItinerary,
    addSpotToItinerary,
    removeSpotFromItinerary,
    removeSpotByName,
    reorderDayActivities,
    updateSpotCostInItinerary,

    baseStay,
    setBaseStay,

    savedTrips,
    setSavedTrips,
    savedTripsModalOpen,
    setSavedTripsModalOpen,
    activeReportTrip,
    setActiveReportTrip,
    saveCurrentTrip,
    deleteSavedTrip,

    budgetOverrides,
    setBudgetCategoryOverride,
    resetBudgetCategoryOverride,
    categoryBudgets,
    totalBudget,

    plannedExpenses,
    actualExpenses,
    totalSpent,
    remainingBudget,
    budgetDifference,
    actualCategorySpent,
    addActualExpense,
    toggleExpensePaid,
    updateExpenseAmount,
    deleteActualExpense
  }

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export function useTrip() {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error("useTrip must be used within a TripProvider")
  }
  return context
}
