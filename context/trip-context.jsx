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

  // Centralized Itinerary State
  const [itinerary, setItinerary] = useState([])

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

  // 6. Expense Tracker Handlers
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

    itinerary,
    setItinerary,
    allItinerarySpots,
    updateItinerary,
    addSpotToItinerary,
    removeSpotFromItinerary,
    updateSpotCostInItinerary,

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
