"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Wallet,
  PiggyBank,
  TrendingUp,
  ArrowLeft,
  Plus,
  Trash2,
  Receipt,
  CheckCircle2,
  Clock,
  Sparkles,
  Utensils,
  Hotel,
  Compass,
  Car,
  Fuel,
  Ticket,
  ShoppingBag,
  BarChart3,
  Calendar,
  X,
  Layers,
  Info,
  Users,
  UserPlus,
  ArrowRightLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTrip } from "@/context/trip-context"
import { DoodleBackground } from "@/components/doodle-background"


// Category Bags Configuration for Low-Resistance Quick Logging
const CATEGORY_BAGS = [
  {
    id: "Food & Dining",
    label: "Food & Dining",
    shortLabel: "Food",
    icon: Utensils,
    color: "#F59E0B",
    bgGradient: "from-amber-500 to-orange-600",
    lightBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
  },
  {
    id: "Accommodation",
    label: "Accommodation",
    shortLabel: "Stay",
    icon: Hotel,
    color: "#3B82F6",
    bgGradient: "from-blue-500 to-indigo-600",
    lightBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
  },
  {
    id: "Activities",
    label: "Experience & Activities",
    shortLabel: "Experience",
    icon: Compass,
    color: "#10B981",
    bgGradient: "from-emerald-500 to-teal-600",
    lightBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
  },
  {
    id: "Rental Vehicle",
    label: "Rental Vehicle",
    shortLabel: "Vehicle",
    icon: Car,
    color: "#8B5CF6",
    bgGradient: "from-purple-500 to-violet-600",
    lightBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
  },
  {
    id: "Fuel",
    label: "Fuel & Gas",
    shortLabel: "Fuel",
    icon: Fuel,
    color: "#EF4444",
    bgGradient: "from-rose-500 to-red-600",
    lightBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
  },
  {
    id: "Tickets & Entry",
    label: "Tickets & Entry Passes",
    shortLabel: "Tickets",
    icon: Ticket,
    color: "#06B6D4",
    bgGradient: "from-cyan-500 to-sky-600",
    lightBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20"
  },
  {
    id: "Shopping",
    label: "Shopping & Souvenirs",
    shortLabel: "Shopping",
    icon: ShoppingBag,
    color: "#EC4899",
    bgGradient: "from-pink-500 to-rose-600",
    lightBg: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20"
  },
  {
    id: "Other",
    label: "Other Miscellaneous",
    shortLabel: "Other",
    icon: Layers,
    color: "#64748B",
    bgGradient: "from-slate-500 to-slate-700",
    lightBg: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
  }
]

// Past Trips Benchmark Data for Profile 2 Comparison
const PAST_TRIPS_BENCHMARKS = [
  {
    id: "trip-1",
    name: "Manali Snow Escapes 2025",
    days: 5,
    budget: 45000,
    spent: 41200,
    categories: {
      "Food & Dining": 8500,
      "Accommodation": 16000,
      "Rental Vehicle": 5500,
      "Fuel": 2200,
      "Activities": 6000,
      "Tickets & Entry": 1500,
      "Shopping": 1500
    }
  },
  {
    id: "trip-2",
    name: "Bali Tropical Island 2024",
    days: 6,
    budget: 75000,
    spent: 68400,
    categories: {
      "Food & Dining": 14200,
      "Accommodation": 28000,
      "Rental Vehicle": 7800,
      "Fuel": 1400,
      "Activities": 11000,
      "Tickets & Entry": 3200,
      "Shopping": 2800
    }
  },
  {
    id: "trip-3",
    name: "Kerala Backwaters 2024",
    days: 4,
    budget: 32000,
    spent: 29800,
    categories: {
      "Food & Dining": 6200,
      "Accommodation": 13500,
      "Rental Vehicle": 3800,
      "Fuel": 1100,
      "Activities": 3500,
      "Tickets & Entry": 700,
      "Shopping": 1000
    }
  }
]

export function ExpenseTracker({ isWorkspace = false, onBack }) {
  const {
    destination,
    totalBudget,
    totalSpent: liveContextSpent,
    remainingBudget,
    budgetDifference,
    plannedExpenses,
    actualExpenses,
    actualCategorySpent,
    addActualExpense,
    toggleExpensePaid,
    deleteActualExpense,
    itinerary,
    allItinerarySpots,
    categoryBudgets,
    days: tripDaysCount,
    travelers,
    groupMembers,
    setGroupMembers,
    updateExpensePayer
  } = useTrip()

  // Subtle changing background photos (low opacity)
  const UPLOADED_TRAVEL_BACKGROUNDS = [
    "/images/cultural/culture-indian-mosaic.jpg",
    "/images/cultural/culture-warli.jpg",
    "/images/cultural/culture-balinese.jpg"
  ]
  const [bgImgIdx, setBgImgIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setBgImgIdx((prev) => (prev + 1) % UPLOADED_TRAVEL_BACKGROUNDS.length)
    }, 4200)
    return () => clearInterval(timer)
  }, [])


  // Profile Selector: 'current' | 'person-wise' | 'past'
  const [activeProfile, setActiveProfile] = useState("current")

  // Log Feed Tab: 'actual' | 'planned'
  const [activeLogTab, setActiveLogTab] = useState("actual")

  // Day filter selection for day-wise graph & log list
  const [selectedDayFilter, setSelectedDayFilter] = useState("All")

  // Quick Add Modal state
  const [quickModalOpen, setQuickModalOpen] = useState(false)
  const [selectedBag, setSelectedBag] = useState(null)
  const [quickAmount, setQuickAmount] = useState("")
  const [quickComment, setQuickComment] = useState("")
  const [quickDay, setQuickDay] = useState(null)

  // Person-Wise State
  const members = groupMembers && groupMembers.length > 0 ? groupMembers : ["Aaditya", "Rohan", "Priya"]
  const [newMemberName, setNewMemberName] = useState("")
  const [showAddMemberInput, setShowAddMemberInput] = useState(false)
  const [quickPayer, setQuickPayer] = useState(members[0] || "Aaditya")

  // Dynamically fetched days directly from current itinerary
  const availableDays = (itinerary && itinerary.length > 0)
    ? itinerary.map((d) => ({
        dayNumber: d.day,
        dayLabel: `Day ${d.day}`,
        dateStr: d.date ? d.date : `Day ${d.day}`,
        activities: d.activities || []
      }))
    : Array.from({ length: tripDaysCount || 3 }, (_, i) => ({
        dayNumber: i + 1,
        dayLabel: `Day ${i + 1}`,
        dateStr: `Day ${i + 1}`,
        activities: []
      }))

  // Initial fallback actual logs (linked directly to initial Goa itinerary spots if actualExpenses is empty)
  const displayActualExpenses = useMemo(() => {
    const raw = actualExpenses.length > 0 ? actualExpenses : [
      { id: 101, title: "Artjuna Cafe Breakfast & Smoothies", category: "Food & Dining", amount: 950, isPaid: true, day: "Day 1", date: "Aug 15", paidBy: "Aaditya" },
      { id: 102, title: "Fort Aguada Entrance & Museum", category: "Tickets & Entry", amount: 400, isPaid: true, day: "Day 1", date: "Aug 15", paidBy: "Rohan" },
      { id: 103, title: "Thalassa Cliffside Greek Dinner", category: "Food & Dining", amount: 3250, isPaid: true, day: "Day 1", date: "Aug 15", paidBy: "Rohan" },
      { id: 104, title: "Baga & Calangute Water Sports", category: "Activities", amount: 3600, isPaid: true, day: "Day 2", date: "Aug 16", paidBy: "Aaditya" },
      { id: 105, title: "Fisherman's Wharf Seafood", category: "Food & Dining", amount: 1900, isPaid: true, day: "Day 2", date: "Aug 16", paidBy: "Aaditya" },
      { id: 106, title: "Anjuna Flea Market Souvenirs", category: "Shopping", amount: 3000, isPaid: true, day: "Day 3", date: "Aug 17", paidBy: "Rohan" }
    ]

    const maxDays = tripDaysCount || 3
    return raw
      .filter((exp) => {
        const dNum = parseInt(String(exp.day).replace(/[^\d]/g, ""), 10)
        return !dNum || isNaN(dNum) || dNum <= maxDays
      })
      .map((exp) => ({
        ...exp,
        paidBy: exp.paidBy && members.includes(exp.paidBy) ? exp.paidBy : (members[0] || "Aaditya")
      }))
  }, [actualExpenses, tripDaysCount, members])

  // Person-Wise Calculations
  const memberPaidTotals = useMemo(() => {
    const res = {}
    members.forEach((m) => (res[m] = 0))
    displayActualExpenses.forEach((exp) => {
      const payer = exp.paidBy && members.includes(exp.paidBy) ? exp.paidBy : members[0]
      res[payer] = (res[payer] || 0) + exp.amount
    })
    return res
  }, [members, displayActualExpenses])

  const totalGroupSpent = useMemo(() => {
    return Object.values(memberPaidTotals).reduce((a, b) => a + b, 0)
  }, [memberPaidTotals])

  const fairSharePerPerson = useMemo(() => {
    return members.length > 0 ? Math.round(totalGroupSpent / members.length) : 0
  }, [totalGroupSpent, members])

  const memberNetBalances = useMemo(() => {
    const res = {}
    members.forEach((m) => {
      res[m] = (memberPaidTotals[m] || 0) - fairSharePerPerson
    })
    return res
  }, [members, memberPaidTotals, fairSharePerPerson])

  // Calculated Pairwise Settlement Transactions ("Who Owes Whom")
  const settlements = useMemo(() => {
    const creditors = []
    const debtors = []

    Object.entries(memberNetBalances).forEach(([name, bal]) => {
      if (bal > 10) creditors.push({ name, amount: bal })
      else if (bal < -10) debtors.push({ name, amount: -bal })
    })

    const list = []
    let cIdx = 0
    let dIdx = 0

    while (cIdx < creditors.length && dIdx < debtors.length) {
      const creditor = creditors[cIdx]
      const debtor = debtors[dIdx]
      const payAmt = Math.min(creditor.amount, debtor.amount)

      if (payAmt > 0) {
        list.push({
          id: `settle-${debtor.name}-${creditor.name}-${Math.round(payAmt)}`,
          from: debtor.name,
          to: creditor.name,
          amount: Math.round(payAmt)
        })
      }

      creditor.amount -= payAmt
      debtor.amount -= payAmt

      if (creditor.amount <= 5) cIdx++
      if (debtor.amount <= 5) dIdx++
    }

    return list
  }, [memberNetBalances])

  // Actual Total Spent calculation
  const calculatedActualSpent = displayActualExpenses.reduce((s, e) => s + e.amount, 0)
  const totalSpent = liveContextSpent > 0 ? liveContextSpent : calculatedActualSpent
  const pctSpent = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 45

  // 100% LINKED DAY-WISE SPEND (Connects Itinerary Day Activities & Accommodation to Actual Spent)
  const dayWiseAnalytics = availableDays.map((dObj) => {
    // 1. Planned Day Cost = Activities in this itinerary day * travelers + (Accommodation budget / total days)
    const dayActivitiesSum = dObj.activities.reduce((sum, act) => {
      const numCost = act.numericCost || parseInt(String(act.cost || "500").replace(/[^\d]/g, "")) || 500
      return sum + (numCost * (travelers || 2))
    }, 0)

    const dailyStayShare = Math.round((categoryBudgets["Accommodation"] || 7500) / (tripDaysCount || 3))
    const plannedDayTotal = dayActivitiesSum + dailyStayShare

    // 2. Actual Spent for this day from logged actual expenses
    const actualDaySpent = displayActualExpenses
      .filter((e) => e.day === dObj.dayLabel || e.day === `Day ${dObj.dayNumber}`)
      .reduce((s, e) => s + e.amount, 0)

    return {
      dayLabel: dObj.dayLabel,
      dateStr: dObj.dateStr,
      planned: plannedDayTotal > 0 ? plannedDayTotal : Math.round(totalBudget / (tripDaysCount || 3)),
      spent: actualDaySpent,
      spotCount: dObj.activities.length
    }
  })

  // Filtered actual logs based on day filter
  const filteredLogs = selectedDayFilter === "All"
    ? displayActualExpenses
    : displayActualExpenses.filter((e) => e.day === selectedDayFilter)

  // Handle Quick Add Submit
  const handleQuickAddSubmit = (e) => {
    e.preventDefault()
    if (!selectedBag || !quickAmount || !quickDay) return

    addActualExpense({
      title: quickComment.trim() || `${selectedBag.label} Expense`,
      category: selectedBag.id,
      amount: Number(quickAmount),
      isPaid: true,
      day: quickDay,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      paidBy: quickPayer || members[0] || "Aaditya"
    })

    setQuickModalOpen(false)
    setQuickDay(null)
    setSelectedBag(null)
    setQuickAmount("")
    setQuickComment("")
  }

  return (
    <section id="tracker" className={`relative w-full overflow-hidden ${isWorkspace ? "min-h-screen bg-background dark:bg-[#11100E] text-[#2F3E4E] dark:text-[#F1ECE2] pt-24 pb-28" : "py-20 md:py-28 bg-background"}`}>

      {/* Travel Doodles Background */}
      <DoodleBackground />

      {/* Subtle Auto-Changing Low-Opacity Photo Background Reel */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.img
            key={UPLOADED_TRAVEL_BACKGROUNDS[bgImgIdx]}
            src={UPLOADED_TRAVEL_BACKGROUNDS[bgImgIdx]}
            alt="Subtle travel background"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 0.16, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="h-full w-full object-cover filter brightness-95"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-background/70 backdrop-blur-xs" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        
        {/* Workspace Top Navigation Bar */}
        {isWorkspace && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="rounded-sm border-border bg-background hover:bg-accent text-xs sm:text-sm cursor-pointer"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to Overview
              </Button>
              <span className="text-muted-foreground">/</span>
              <span className="font-semibold text-foreground text-sm">Trip Expense Tracker</span>
            </div>
          </div>
        )}

        {/* Clean Luxury Header Title */}
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-foreground">
            {destination ? `${destination} Expense Intelligence` : "Trip Expense & Budget Intelligence"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Real-time expenditure tracking synchronized directly with your itinerary days & budget plan.
          </p>
        </div>

        {/* View Switcher Bar (Current Trip vs Person-Wise Split vs Past Trips) */}
        <div className="mb-6 flex items-center justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-1 rounded-md bg-secondary/50 p-1 border border-border">
            <button
              onClick={() => setActiveProfile("current")}
              className={`rounded-sm px-3.5 sm:px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeProfile === "current"
                  ? "bg-[#0D2B45] text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Current Trip Tracker
            </button>
            <button
              onClick={() => setActiveProfile("person-wise")}
              className={`rounded-sm px-3.5 sm:px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeProfile === "person-wise"
                  ? "bg-[#0D2B45] text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Person-Wise Group Split</span>
            </button>
            <button
              onClick={() => setActiveProfile("past")}
              className={`rounded-sm px-3.5 sm:px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeProfile === "past"
                  ? "bg-[#0D2B45] text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Past Trips Comparison
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            MAIN PROFILE CONTENT PANEL
           ───────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          
          {/* PROFILE 1: CURRENT TRIP ANALYTICS */}
          {activeProfile === "current" ? (
            <motion.div
              key="profile-current"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Simplified 3-Stat Metric Cards */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Planned Budget</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Wallet className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <p className="font-heading text-2xl sm:text-3xl font-bold text-foreground">₹{totalBudget.toLocaleString("en-IN")}</p>
                  <p className="text-[11px] text-muted-foreground font-medium">Derived from Itinerary Plan</p>
                </div>

                <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Actual Spent</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-400/15 text-amber-600 dark:text-amber-400">
                      <TrendingUp className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <p className="font-heading text-2xl sm:text-3xl font-bold text-foreground">₹{totalSpent.toLocaleString("en-IN")}</p>
                  <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">{pctSpent}% of budget logged</p>
                </div>

                <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Remaining Balance</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <PiggyBank className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <p className={`font-heading text-2xl sm:text-3xl font-bold ${remainingBudget >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
                    ₹{remainingBudget.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] font-semibold text-muted-foreground">
                    {remainingBudget >= 0 ? "Available travel funds" : "Over budget limit"}
                  </p>
                </div>
              </div>

              {/* GRAPHS ROW: Planned vs Used Gauge & Day-Wise Expenditure Comparison */}
              <div className="grid gap-6 lg:grid-cols-12">
                
                {/* Graph 1: Planned vs Used Gauge & Category Breakdown */}
                <div className="lg:col-span-6 rounded-xl border border-border bg-card p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-heading text-lg font-bold text-foreground">Budget Planned vs. Used</h4>
                      <p className="text-xs text-muted-foreground">Overall allocation breakdown</p>
                    </div>
                    <span className="rounded-md bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 border border-amber-400/20">
                      {pctSpent}% Used
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="h-3 w-full rounded-md bg-muted overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pctSpent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-md bg-[#0D2B45]"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-2 font-semibold">
                    <span>Spent: ₹{totalSpent.toLocaleString("en-IN")}</span>
                    <span>Budget: ₹{totalBudget.toLocaleString("en-IN")}</span>
                  </div>

                  {/* Category Spend Distribution (Directly linked to categoryBudgets & actualCategorySpent) */}
                  <div className="mt-6 space-y-3 pt-4 border-t border-border/60">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category Expenditure Distribution</h5>
                    {CATEGORY_BAGS.map((bag) => {
                      const plannedCatAmt = categoryBudgets[bag.id] || categoryBudgets[bag.label] || 4000
                      const actualCatAmt = actualCategorySpent[bag.id] || (displayActualExpenses.filter(e => e.category === bag.id || e.category === bag.shortLabel).reduce((s, e) => s + e.amount, 0))
                      const pct = plannedCatAmt > 0 ? Math.min(100, Math.round((actualCatAmt / plannedCatAmt) * 100)) : 0
                      const IconComp = bag.icon

                      return (
                        <div key={bag.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <div className="flex items-center gap-2">
                              <span className={`p-1 rounded-md ${bag.lightBg}`}>
                                <IconComp className="h-3.5 w-3.5" />
                              </span>
                              <span className="text-foreground">{bag.label}</span>
                            </div>
                            <span className="text-foreground font-bold">
                              ₹{actualCatAmt.toLocaleString("en-IN")} <span className="text-muted-foreground text-[10px]">/ ₹{plannedCatAmt.toLocaleString("en-IN")}</span>
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: bag.color }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Graph 2: Day-Wise Expenditure Comparison (100% LINKED TO ITINERARY DAYS & SPOTS) */}
                <div className="lg:col-span-6 rounded-3xl border border-border bg-card p-6 shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-heading text-lg font-bold text-foreground">Day-Wise Expenditure Comparison</h4>
                        <p className="text-xs text-muted-foreground">Actual spent vs. planned itinerary day cost</p>
                      </div>
                      <span className="text-xs font-bold text-primary flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {availableDays.length} Days Itinerary
                      </span>
                    </div>

                    {/* Vertical Bar Graph Comparing Planned vs Actual per Day */}
                    <div className="h-56 w-full mt-4 flex items-end justify-around gap-3 pt-6 pb-2 px-2 border-b border-border">
                      {dayWiseAnalytics.map((dItem) => {
                        const maxVal = Math.max(...dayWiseAnalytics.map(d => Math.max(d.spent, d.planned)), 8000)
                        const spentHeightPct = Math.round((dItem.spent / maxVal) * 100)
                        const plannedHeightPct = Math.round((dItem.planned / maxVal) * 100)
                        const isOver = dItem.spent > dItem.planned

                        return (
                          <div key={dItem.dayLabel} className="flex flex-col items-center flex-1 h-full justify-end group">
                            <div className="text-[10px] font-extrabold text-foreground mb-1 text-center">
                              ₹{dItem.spent.toLocaleString("en-IN")}
                            </div>
                            
                            {/* Dual Bars (Planned vs Actual) */}
                            <div className="w-full flex items-end justify-center gap-1.5 h-full max-h-[140px]">
                              {/* Planned Bar */}
                              <div
                                style={{ height: `${plannedHeightPct}%` }}
                                className="w-3 sm:w-4 rounded-t-lg bg-muted-foreground/30 transition-all group-hover:bg-muted-foreground/50"
                                title={`Planned ${dItem.dayLabel}: ₹${dItem.planned.toLocaleString("en-IN")}`}
                              />
                              {/* Actual Spent Bar */}
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${spentHeightPct}%` }}
                                transition={{ duration: 0.7 }}
                                className={`w-5 sm:w-7 rounded-t-xl transition-all ${
                                  isOver ? "bg-amber-400 shadow-md shadow-amber-400/30" : "bg-[#0D2B45] shadow-md shadow-[#0D2B45]/30"
                                }`}
                                title={`Actual Spent ${dItem.dayLabel}: ₹${dItem.spent.toLocaleString("en-IN")}`}
                              />
                            </div>

                            <span className="mt-2 text-xs font-bold text-foreground">{dItem.dayLabel}</span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Bar Legend */}
                    <div className="mt-4 flex items-center justify-center gap-6 text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-[#0D2B45]" />
                        <span>Actual Spent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-muted-foreground/30" />
                        <span>Itinerary Planned Cap</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-amber-400" />
                        <span>Exceeded Planned</span>
                      </div>
                    </div>
                  </div>

                  {/* Contextual Intelligence Insight */}
                  <div className="mt-6 rounded-2xl bg-[#0D2B45]/5 border border-[#0D2B45]/15 p-3.5 flex items-center gap-3">
                    <Info className="h-5 w-5 text-[#0D2B45] shrink-0" />
                    <p className="text-xs text-foreground font-medium leading-relaxed">
                      Expenditure data is synced with your {destination || "current"} itinerary activities. Day 1 includes hotel stay & cliffside dining.
                    </p>
                  </div>

                </div>
              </div>

              {/* Synchronized Expense Logs Feed */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <h4 className="font-heading text-lg font-bold text-foreground">Live Expense Entries & Planned Spots</h4>
                    <p className="text-xs text-muted-foreground">Switch between actual logged entries and AI itinerary planned spots</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Log Type Switcher */}
                    <div className="flex items-center gap-1 rounded-2xl bg-muted p-1 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setActiveLogTab("actual")}
                        className={`rounded-xl px-3 py-1.5 transition-all ${
                          activeLogTab === "actual" ? "bg-white text-neutral-900 shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Actual ({filteredLogs.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveLogTab("planned")}
                        className={`rounded-xl px-3 py-1.5 transition-all ${
                          activeLogTab === "planned" ? "bg-white text-neutral-900 shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Planned Itinerary ({plannedExpenses.length})
                      </button>
                    </div>

                    {/* Day Filter Pills */}
                    <div className="hidden sm:flex items-center gap-1 rounded-2xl bg-muted p-1">
                      <button
                        onClick={() => setSelectedDayFilter("All")}
                        className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all ${
                          selectedDayFilter === "All" ? "bg-[#0D2B45] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        All
                      </button>
                      {availableDays.map((d) => (
                        <button
                          key={d.dayLabel}
                          onClick={() => setSelectedDayFilter(d.dayLabel)}
                          className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all ${
                            selectedDayFilter === d.dayLabel ? "bg-[#0D2B45] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {d.dayLabel}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Log List Display */}
                {activeLogTab === "actual" ? (
                  <div className="space-y-3">
                    {filteredLogs.map((log) => {
                      const matchedBag = CATEGORY_BAGS.find(b => b.id === log.category || b.label === log.category || b.shortLabel === log.category) || CATEGORY_BAGS[0]
                      const IconComp = matchedBag.icon
                      return (
                        <div
                          key={log.id}
                          className="flex items-center justify-between rounded-2xl border border-border/80 bg-background p-4 shadow-sm transition-all hover:border-[#0D2B45]/40 hover:shadow-md"
                        >
                          <div className="flex items-center gap-3.5">
                            <button
                              type="button"
                              onClick={() => toggleExpensePaid(log.id)}
                              title="Toggle Paid Status"
                              className="hover:scale-110 transition-transform"
                            >
                              <CheckCircle2 className={`h-5 w-5 ${log.isPaid ? "fill-amber-400 text-white" : "text-muted-foreground opacity-30"}`} />
                            </button>

                            <div className={`p-2.5 rounded-xl ${matchedBag.lightBg}`}>
                              <IconComp className="h-4 w-4" />
                            </div>

                            <div>
                              <h5 className="font-bold text-sm text-foreground">{log.title}</h5>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                <span className="font-semibold text-foreground">{log.category}</span>
                                <span>• {log.day}</span>
                                <span>• {log.date}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 flex-wrap justify-between sm:justify-end">
                            <div className="flex items-center gap-1.5 text-xs">
                              <span className="text-muted-foreground font-medium text-[11px]">Paid by:</span>
                              <select
                                value={log.paidBy && members.includes(log.paidBy) ? log.paidBy : members[0]}
                                onChange={(e) => updateExpensePayer(log.id, e.target.value)}
                                className="rounded-xl border border-border bg-card px-2 py-1 text-xs font-bold text-foreground outline-none focus:border-primary cursor-pointer shadow-xs"
                              >
                                {members.map((m) => (
                                  <option key={m} value={m}>
                                    👤 {m}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <span className="font-extrabold text-base text-foreground">₹{log.amount.toLocaleString("en-IN")}</span>
                            <button
                              type="button"
                              onClick={() => deleteActualExpense(log.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors p-1"
                              aria-label="Delete entry"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {plannedExpenses.map((planItem) => (
                      <div
                        key={planItem.id}
                        className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-sm"
                      >
                        <div className="flex items-center gap-3.5">
                          <Clock className="h-5 w-5 text-primary shrink-0" />
                          <div>
                            <h5 className="font-bold text-sm text-foreground">{planItem.title}</h5>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{planItem.category}</span>
                              <span>• {planItem.day}</span>
                            </div>
                          </div>
                        </div>
                        <span className="font-bold text-sm text-primary">₹{planItem.amount.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>

            </motion.div>
          ) : activeProfile === "person-wise" ? (
            
            /* PROFILE: PERSON-WISE GROUP SPLIT & DEBT SETTLEMENT */
            <motion.div
              key="profile-person-wise"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Person-Wise Top Financial Overview Banner */}
              <div className="rounded-sm border border-[#f0c8c8] bg-[#fff0f0] text-black p-6 shadow-sm relative overflow-hidden select-none">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#7a3a3a] block">
                      Group Expense Splitting & Debt Settlement
                    </span>
                    <h3 className="font-heading text-2xl sm:text-3xl font-black text-black">
                      Person-Wise Expense Breakdown
                    </h3>
                    <p className="text-xs text-[#7a3a3a] max-w-xl leading-relaxed font-medium">
                      Document who paid for what across your trip. Automatically computes net balances and minimal debt settlement payments among travelers.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 border-t md:border-t-0 md:border-l border-[#f0c8c8] pt-4 md:pt-0 md:pl-6 shrink-0">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#7a3a3a] block tracking-wider">Total Group Expenses</span>
                      <span className="font-heading text-2xl sm:text-3xl font-black text-black">₹{totalGroupSpent.toLocaleString("en-IN")}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#7a3a3a] block tracking-wider">Fair Share / Person</span>
                      <span className="font-heading text-2xl sm:text-3xl font-black text-black">₹{fairSharePerPerson.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Group Members Manager & Individual Balances */}
              <div className="rounded-sm border border-border bg-card p-6 shadow-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                  <div>
                    <h4 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Travelers & Group Balances ({members.length} People)
                    </h4>
                    <p className="text-xs text-muted-foreground">Individual paid amounts vs. fair share</p>
                  </div>

                  {/* Add Group Member Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (!newMemberName.trim()) return
                      const clean = newMemberName.trim()
                      if (!members.includes(clean)) {
                        setGroupMembers([...members, clean])
                      }
                      setNewMemberName("")
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Add traveler name..."
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="rounded-sm border border-border bg-background px-3.5 py-1.5 text-xs text-foreground outline-none focus:border-primary w-44"
                    />
                    <Button type="submit" size="sm" className="rounded-sm bg-primary text-white text-xs font-bold px-3">
                      <UserPlus className="h-3.5 w-3.5 mr-1" />
                      Add
                    </Button>
                  </form>
                </div>

                {/* Group Member Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {members.map((member, idx) => {
                    const paid = memberPaidTotals[member] || 0
                    const net = memberNetBalances[member] || 0
                    const colors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"]
                    const colorBg = colors[idx % colors.length]

                    return (
                      <div key={member} className="rounded-sm border border-border bg-background p-4 shadow-sm space-y-3 relative group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`h-9 w-9 rounded-sm ${colorBg} text-white font-extrabold text-xs flex items-center justify-center shadow`}>
                              {member.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h5 className="font-bold text-sm text-foreground">{member}</h5>
                              <span className="text-[10px] text-muted-foreground font-medium">Traveler #{idx + 1}</span>
                            </div>
                          </div>

                          {members.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setGroupMembers(members.filter((m) => m !== member))}
                              className="text-muted-foreground hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                              title="Remove member"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-1.5 text-xs pt-1">
                          <div className="flex justify-between font-medium">
                            <span className="text-muted-foreground">Total Paid:</span>
                            <strong className="text-foreground font-extrabold">₹{paid.toLocaleString("en-IN")}</strong>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span className="text-muted-foreground">Fair Share:</span>
                            <span className="text-muted-foreground">₹{fairSharePerPerson.toLocaleString("en-IN")}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Net Balance</span>
                          {net > 5 ? (
                            <span className="rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs px-2.5 py-0.5 border border-emerald-500/20">
                              +₹{net.toLocaleString("en-IN")} (Gets Back)
                            </span>
                          ) : net < -5 ? (
                            <span className="rounded-sm bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold text-xs px-2.5 py-0.5 border border-rose-500/20">
                              -₹{Math.abs(net).toLocaleString("en-IN")} (Owes Group)
                            </span>
                          ) : (
                            <span className="rounded-sm bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-2.5 py-0.5">
                              Settled Up ✨
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Debt Settlement Matrix ("Who Owes Whom") */}
              <div className="rounded-sm border border-border bg-card p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <h4 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                      <ArrowRightLeft className="h-5 w-5 text-amber-500" />
                      Settlement Summary ("Who Owes Whom")
                    </h4>
                    <p className="text-xs text-muted-foreground">Optimal minimum transactions to settle all group debts</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-sm border border-emerald-500/20">
                    {settlements.length} Pending Transfers
                  </span>
                </div>

                {settlements.length === 0 ? (
                  <div className="rounded-sm border border-dashed border-border p-8 text-center space-y-2">
                    <div className="h-10 w-10 rounded-sm bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h5 className="font-bold text-sm text-foreground">Everyone is Settled Up!</h5>
                    <p className="text-xs text-muted-foreground">All travelers have contributed their exact fair share. No debts pending.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {settlements.map((settle) => (
                      <div key={settle.id} className="rounded-sm border border-border bg-background p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 font-button">
                          <div>
                            <div className="text-xs font-normal text-foreground flex items-center gap-1.5 font-button">
                              <span className="text-rose-600 dark:text-rose-400 font-normal">{settle.from}</span>
                              <span>→ pays →</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-normal">{settle.to}</span>
                            </div>
                            <span className="text-xs text-muted-foreground font-normal">To equalize trip expenses</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-heading text-lg font-extrabold text-foreground block">
                            ₹{settle.amount.toLocaleString("en-IN")}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              addActualExpense({
                                title: `Settlement: ${settle.from} paid ${settle.to}`,
                                category: "Other",
                                amount: settle.amount,
                                isPaid: true,
                                day: "Settlement",
                                date: "Just now",
                                paidBy: settle.from
                              })
                            }}
                            className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                          >
                            Mark Paid & Settle
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Person-Wise Expense Entries List with Inline Payer Change */}
              <div className="rounded-sm border border-border bg-card p-6 shadow-md space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
                  <div>
                    <h4 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                      <Receipt className="h-5 w-5 text-primary" />
                      Person-Wise Expense Log ({displayActualExpenses.length} Entries)
                    </h4>
                    <p className="text-xs text-muted-foreground">Assigned payers & split breakdown for each expense</p>
                  </div>

                  <Button
                    onClick={() => setQuickModalOpen(true)}
                    className="rounded-sm bg-[#5A8CB2] text-white hover:bg-[#4A7CA2] font-bold text-xs px-4 py-2 shadow cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    Log Person Expense
                  </Button>
                </div>

                <div className="space-y-3">
                  {displayActualExpenses.map((exp) => {
                    const currentPayer = exp.paidBy && members.includes(exp.paidBy) ? exp.paidBy : members[0]
                    const perPersonSplit = Math.round(exp.amount / (members.length || 1))

                    return (
                      <div key={exp.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-sm border border-border/80 bg-background p-4 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-sm bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                            <Receipt className="h-4 w-4" />
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-foreground">{exp.title}</h5>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <span className="font-semibold text-foreground">{exp.category}</span>
                              <span>• {exp.day}</span>
                              <span className="text-[10px] font-bold bg-secondary px-2 py-0.5 rounded-sm text-black dark:text-black">
                                Split {members.length} ways (₹{perPersonSplit.toLocaleString("en-IN")}/person)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 flex-wrap justify-between sm:justify-end">
                          {/* Payer Dropdown */}
                          <div className="flex items-center gap-1.5 text-xs font-button">
                            <span className="text-muted-foreground font-normal text-[11px]">Paid by:</span>
                            <select
                              value={currentPayer}
                              onChange={(e) => updateExpensePayer(exp.id, e.target.value)}
                              className="rounded-xl border border-[#B9A6C9]/40 bg-card px-2.5 py-1 text-xs font-normal text-foreground outline-none focus:border-[#8E5AB5] cursor-pointer font-button shadow-xs"
                            >
                              {members.map((m) => (
                                <option key={m} value={m}>
                                  Paid by {m}
                                </option>
                              ))}
                            </select>
                          </div>

                          <span className="font-extrabold text-base text-foreground shrink-0">
                            ₹{exp.amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            
            /* PROFILE 2: PAST TRIPS COMPARISON */
            <motion.div
              key="profile-past"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Profile 2 Header Comparison Summary */}
              <div className="rounded-3xl border border-[#f0c8c8] bg-[#fff0f0] text-black p-6 shadow-xl relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#f0c8c8] text-[#7a3a3a] border border-[#f0b8b8]">
                      Multi-Trip Comparison
                    </span>
                    <h3 className="font-heading text-2xl font-bold mt-2 text-black">Historical Expenditure Benchmarks</h3>
                    <p className="text-xs text-[#7a3a3a] mt-1 max-w-xl">
                      Comparing total budget and category expenditure across your current {destination || "trip"} and past journeys.
                    </p>
                  </div>
                </div>
              </div>

              {/* Multi-Trip Spend Table */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-md overflow-hidden">
                <h4 className="font-heading text-lg font-bold text-foreground mb-4">Trip-by-Trip Spend Breakdown</h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/50 text-xs uppercase font-bold text-muted-foreground">
                        <th className="py-3 px-4">Trip Name</th>
                        <th className="py-3 px-4">Duration</th>
                        <th className="py-3 px-4">Planned Budget</th>
                        <th className="py-3 px-4">Actual Spent</th>
                        <th className="py-3 px-4">Daily Average</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {/* Current Trip Row */}
                      <tr className="bg-amber-400/5 font-bold">
                        <td className="py-3.5 px-4 flex items-center gap-2.5">
                          <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                          <span className="text-foreground">{destination ? `${destination} (Current)` : "Current Trip"}</span>
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">{tripDaysCount || 3} Days</td>
                        <td className="py-3.5 px-4 font-semibold">₹{totalBudget.toLocaleString("en-IN")}</td>
                        <td className="py-3.5 px-4 font-extrabold text-foreground">₹{totalSpent.toLocaleString("en-IN")}</td>
                        <td className="py-3.5 px-4 font-semibold text-primary">₹{Math.round(totalSpent / (tripDaysCount || 3)).toLocaleString("en-IN")} / day</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center rounded-full bg-amber-400/10 px-2.5 py-0.5 text-xs font-bold text-amber-500 dark:text-amber-400">
                            Active Trip
                          </span>
                        </td>
                      </tr>

                      {PAST_TRIPS_BENCHMARKS.map((t) => (
                        <tr key={t.id} className="hover:bg-muted/30">
                          <td className="py-3.5 px-4 font-semibold text-foreground">{t.name}</td>
                          <td className="py-3.5 px-4 text-muted-foreground">{t.days} Days</td>
                          <td className="py-3.5 px-4 font-semibold">₹{t.budget.toLocaleString("en-IN")}</td>
                          <td className="py-3.5 px-4 font-extrabold text-foreground">₹{t.spent.toLocaleString("en-IN")}</td>
                          <td className="py-3.5 px-4 font-semibold text-primary">₹{Math.round(t.spent / t.days).toLocaleString("en-IN")} / day</td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
                              Past Vacation
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* ─────────────────────────────────────────────
          FLOATING QUICK ADD [ + ] BUTTON (Bottom-Left Corner)
         ───────────────────────────────────────────── */}
      {/* FLOATING QUICK ADD [ + ] BUTTON (White with Lavender Border & Purple +) */}
      {isWorkspace && (
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setQuickModalOpen(true)}
          className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#8E5AB5] shadow-2xl border-2 border-[#B9A6C9] hover:bg-[#FAF8FC] hover:border-[#8E5AB5] transition-all cursor-pointer font-button"
          aria-label="Add New Expense"
          title="Quick Add Expense"
        >
          <span className="text-3xl font-normal leading-none text-[#8E5AB5]">+</span>
        </motion.button>
      )}

      {/* ─────────────────────────────────────────────
          DYNAMIC STEP EXPENSE MODAL (WHITE & LAVENDER THEME, NO SVGS, INSTRUMENT SANS)
         ───────────────────────────────────────────── */}
      <AnimatePresence>
        {quickModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-20 pb-6 bg-black/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="relative w-full max-w-xl max-h-[82vh] overflow-y-auto rounded-2xl border border-[#B9A6C9]/40 bg-white text-[#100B12] shadow-2xl p-5 sm:p-6 text-left select-none font-button"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#B9A6C9]/30 pb-3 mb-4">
                <div>
                  <h3 className="font-heading text-lg font-normal text-[#100B12]">
                    Add New Expense
                  </h3>
                  <p className="text-xs text-[#8E5AB5] mt-0.5 font-normal">
                    {!quickDay ? "Step 1: Select Day from Itinerary" : !selectedBag ? `${quickDay} • Step 2: Select Category` : `${quickDay} • ${selectedBag.shortLabel} • Step 3: Enter Amount`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setQuickModalOpen(false)
                    setQuickDay(null)
                    setSelectedBag(null)
                  }}
                  aria-label="Close modal"
                  className="rounded-lg p-1.5 text-[#100B12]/60 hover:bg-[#DDD0EA]/50 hover:text-[#100B12] transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Progress Steps Header Pills (Lavender & White Theme) */}
              <div className="flex items-center gap-1.5 mb-4 text-[11px] font-normal">
                <span className={`px-2.5 py-1 rounded-lg transition-colors ${!quickDay ? "bg-[#8E5AB5] text-white" : "bg-[#DDD0EA] text-[#100B12]"}`}>
                  1. {quickDay || "Select Day"}
                </span>
                <span className="text-[#B9A6C9]">•</span>
                <span className={`px-2.5 py-1 rounded-lg transition-colors ${quickDay && !selectedBag ? "bg-[#8E5AB5] text-white" : selectedBag ? "bg-[#DDD0EA] text-[#100B12]" : "bg-neutral-100 text-neutral-400"}`}>
                  2. {selectedBag?.shortLabel || "Select Type"}
                </span>
                <span className="text-[#B9A6C9]">•</span>
                <span className={`px-2.5 py-1 rounded-lg transition-colors ${selectedBag ? "bg-[#8E5AB5] text-white" : "bg-neutral-100 text-neutral-400"}`}>
                  3. Amount
                </span>
              </div>

              {/* Modal Content - STEP 1: SELECT DAY FROM ITINERARY */}
              {!quickDay ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-normal uppercase tracking-wider text-[#8E5AB5]">
                      Select Itinerary Day ({availableDays.length} Days Planned)
                    </p>
                    <span className="text-[10px] text-[#8E5AB5] bg-[#DDD0EA]/50 px-2 py-0.5 rounded-lg font-normal border border-[#B9A6C9]/40">
                      Synced from Itinerary
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {availableDays.map((dObj) => (
                      <button
                        key={dObj.dayLabel}
                        onClick={() => setQuickDay(dObj.dayLabel)}
                        className="group flex flex-col items-start justify-between rounded-xl border border-[#B9A6C9]/40 bg-[#DDD0EA]/30 p-3.5 transition-all hover:bg-[#DDD0EA] hover:border-[#8E5AB5] active:scale-98 text-left cursor-pointer font-button"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-normal text-[#8E5AB5] uppercase tracking-wider">
                            {dObj.dayLabel}
                          </span>
                          <span className="text-[10px] font-normal text-[#100B12]/60 uppercase tracking-wider">
                            {dObj.dateStr}
                          </span>
                        </div>
                        <div className="mt-2.5">
                          <span className="text-xs font-normal text-[#100B12] block">
                            {dObj.activities.length > 0 ? `${dObj.activities.length} Itinerary Spots` : "Planned Day"}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : !selectedBag ? (
                /* STEP 2: SELECT CATEGORY BAG / TYPE */
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-[#DDD0EA]/40 border border-[#B9A6C9]/30 p-2 rounded-xl">
                    <span className="text-xs font-normal text-[#100B12]">Selected: {quickDay}</span>
                    <button
                      onClick={() => setQuickDay(null)}
                      className="text-xs font-normal text-[#8E5AB5] hover:underline cursor-pointer"
                    >
                      Change Day
                    </button>
                  </div>

                  <p className="text-xs font-normal uppercase tracking-wider text-[#8E5AB5]">
                    Select Category Type
                  </p>

                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {CATEGORY_BAGS.map((bag) => (
                      <button
                        key={bag.id}
                        onClick={() => setSelectedBag(bag)}
                        className="group flex flex-col items-center justify-center rounded-xl border border-[#B9A6C9]/40 bg-[#DDD0EA]/30 py-3.5 px-3 transition-all hover:bg-[#DDD0EA] hover:border-[#8E5AB5] active:scale-98 text-center cursor-pointer font-button"
                      >
                        <span className="text-xs font-normal text-[#100B12] leading-tight">
                          {bag.shortLabel}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* STEP 3: ENTER AMOUNT & OPTIONAL COMMENTS */
                <form onSubmit={handleQuickAddSubmit} className="space-y-3">
                  
                  {/* Category Fast Switcher Grid */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-normal uppercase tracking-wider text-[#8E5AB5]">
                        Category Type (Tap to Switch)
                      </label>
                      <span className="text-[11px] font-normal text-[#100B12] bg-[#DDD0EA]/50 px-2 py-0.5 rounded-lg border border-[#B9A6C9]/30">
                        {quickDay}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                      {CATEGORY_BAGS.map((bag) => {
                        const isSelected = selectedBag.id === bag.id
                        return (
                          <button
                            key={bag.id}
                            type="button"
                            onClick={() => setSelectedBag(bag)}
                            title={bag.label}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer text-center font-button ${
                              isSelected
                                ? "border-[#8E5AB5] bg-[#8E5AB5] text-white shadow-sm"
                                : "border-[#B9A6C9]/40 bg-[#DDD0EA]/30 hover:bg-[#DDD0EA] text-[#100B12]"
                            }`}
                          >
                            <span className="text-[10px] truncate w-full block font-normal">
                              {bag.shortLabel}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Highlighted Selected Category Bar */}
                  <div className="flex items-center justify-between rounded-xl bg-[#DDD0EA]/40 border border-[#B9A6C9]/40 p-2.5">
                    <div>
                      <span className="text-xs font-normal text-[#100B12] block">{selectedBag.label}</span>
                      <span className="text-[10px] font-normal text-[#8E5AB5]">Active Category Selected</span>
                    </div>
                  </div>

                  {/* Paid By Selection & Amount Input Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-normal uppercase tracking-wider text-[#8E5AB5]">
                          Paid By Traveler *
                        </label>
                        {!showAddMemberInput && (
                          <button
                            type="button"
                            onClick={() => setShowAddMemberInput(true)}
                            className="text-[11px] font-normal text-[#8E5AB5] hover:underline cursor-pointer font-button"
                          >
                            + Add Person
                          </button>
                        )}
                      </div>

                      {showAddMemberInput ? (
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Person name..."
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            className="w-full rounded-xl border border-[#B9A6C9]/50 bg-white px-3 py-1.5 text-xs font-normal text-[#100B12] outline-none focus:border-[#8E5AB5] font-button"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!newMemberName.trim()) return
                              const clean = newMemberName.trim()
                              if (!members.includes(clean)) {
                                setGroupMembers([...members, clean])
                              }
                              setQuickPayer(clean)
                              setNewMemberName("")
                              setShowAddMemberInput(false)
                            }}
                            className="rounded-xl bg-[#8E5AB5] text-white px-3 py-1.5 text-xs font-normal hover:bg-[#7A4A9E] cursor-pointer font-button shrink-0"
                          >
                            Add
                          </button>
                        </div>
                      ) : (
                        <select
                          value={quickPayer || members[0] || "Aaditya"}
                          onChange={(e) => setQuickPayer(e.target.value)}
                          className="w-full rounded-xl border border-[#B9A6C9]/50 bg-white px-3 py-2 text-xs font-normal text-[#100B12] outline-none focus:border-[#8E5AB5] cursor-pointer font-button"
                        >
                          {members.map((m) => (
                            <option key={m} value={m}>
                              Paid by {m}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-normal uppercase tracking-wider text-[#8E5AB5]">
                        Amount Spent (₹) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-normal text-[#100B12]/60">₹</span>
                        <input
                          type="number"
                          required
                          autoFocus
                          placeholder="e.g. 450"
                          value={quickAmount}
                          onChange={(e) => setQuickAmount(e.target.value)}
                          className="w-full rounded-xl border border-[#B9A6C9]/50 bg-white py-2 pl-7 pr-3 text-sm font-normal text-[#100B12] outline-none focus:border-[#8E5AB5]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Optional Comment / Note Box */}
                  <div>
                    <label className="mb-1 block text-xs font-normal uppercase tracking-wider text-[#8E5AB5]">
                      Comments / Item Note (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dinner at Martin's Corner"
                      value={quickComment}
                      onChange={(e) => setQuickComment(e.target.value)}
                      className="w-full rounded-xl border border-[#B9A6C9]/50 bg-white p-2.5 text-xs text-[#100B12] outline-none focus:border-[#8E5AB5]"
                    />
                  </div>

                  {/* Submit Action */}
                  <div className="pt-1 flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedBag(null)}
                      className="w-1/3 rounded-xl border border-[#B9A6C9]/50 bg-[#DDD0EA]/40 hover:bg-[#DDD0EA] py-2.5 text-xs font-normal text-[#100B12] cursor-pointer font-button"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 rounded-xl bg-[#8E5AB5] hover:bg-[#7A4A9E] py-2.5 text-xs font-normal text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer font-button"
                    >
                      Save Expense
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  )
}
