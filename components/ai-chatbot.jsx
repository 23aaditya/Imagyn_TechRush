"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Key,
  Calendar,
  Sun,
  Users,
  AlertCircle,
  RefreshCw,
  Maximize2,
  Minimize2,
  Compass,
  Utensils,
  Wallet,
  MapPin,
  CheckCircle2,
  Mic,
  Radio,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { generateFallbackResponse, DESTINATION_KNOWLEDGE } from "@/lib/ai-travel-knowledge"
import { useTrip } from "@/context/trip-context"
import { parseAndExecuteBotActions } from "@/lib/bot-action-executor"
import { GeminiLiveAudioModal } from "@/components/gemini-live-audio-modal"

// Categorized Prompt Chips for organized browsing
const PROMPT_CATEGORIES = [
  { id: "all", label: "🌟 All" },
  { id: "websitecontrol", label: "⚡ Website Control" },
  { id: "dayplans", label: "🗓️ Day Plans" },
  { id: "peakseason", label: "☀️ Peak Season" },
  { id: "crowds", label: "👥 Crowd Control" },
  { id: "budgetfood", label: "💰 Budget & Food" },
]

const CATEGORIZED_PROMPTS = {
  websitecontrol: [
    { label: "💰 Set Budget to ₹50,000", prompt: "Set my target trip budget to ₹50,000" },
    { label: "🏨 Switch to Luxury Tier", prompt: "Switch my stay tier to Luxury" },
    { label: "👥 4 Travelers, 5 Days", prompt: "Set travelers to 4 and trip duration to 5 days" },
    { label: "🧾 Log ₹1,200 Dinner Expense", prompt: "Log ₹1,200 paid by Rahul for Dinner in Food & Dining" },
    { label: "💾 Save Trip to Passport", prompt: "Save my current trip to passport and open saved trips" },
  ],
  dayplans: [
    { label: "🗓️ Kyoto 3-Day Plan", prompt: "Suggest a detailed 3-day itinerary for Kyoto with morning, afternoon, and evening timing." },
    { label: "📍 Paris Day 1 Highlights", prompt: "Suggest a day 1 itinerary for Paris covering major landmarks, Seine river, and sunset spots." },
    { label: "⛩️ Tokyo Tech & Culture Day", prompt: "Suggest a 1-day itinerary for Tokyo combining Asakusa, teamLab Planets, and Shinjuku." },
  ],
  peakseason: [
    { label: "☀️ Bali Peak Season & Weather", prompt: "When is peak season for Bali? Detail dry vs wet season, crowd levels, and weather." },
    { label: "🌸 Kyoto Cherry Blossom Timing", prompt: "What are peak dates for Kyoto Cherry Blossom season and best low-crowd viewing spots?" },
    { label: "❄️ Iceland Northern Lights vs Sun", prompt: "Best season for Iceland Northern Lights vs Summer Midnight Sun? Include crowd ratings." },
  ],
  crowds: [
    { label: "🎟️ Paris Skip-Line Tips", prompt: "Give me skip-the-line and crowd avoidance strategies for Paris museums and Eiffel Tower." },
    { label: "⏰ Kyoto Low-Crowd Timings", prompt: "What are the best early morning hours to visit top Kyoto temples without tour buses?" },
    { label: "🏖️ Bali Hidden Quiet Spots", prompt: "Recommend less crowded beaches and tranquil day trip spots in Bali away from Kuta." },
  ],
  budgetfood: [
    { label: "🍜 Tokyo Street Food Guide", prompt: "What are the top budget street food areas in Tokyo (like Tsukiji, Omoide Yokocho)?" },
    { label: "💶 Paris Low-Budget Hacks", prompt: "Give me budget tips for Paris including museum pass, metro passes, and cheap bistros." },
    { label: "🏡 Bali Off-Peak Villa Savings", prompt: "When are villa prices cheapest in Bali and best shoulder season months for deals?" },
  ],
}

export function AiChatbot({ currentView, onNavigate, user, onOpenAuth }) {
  const tripContext = useTrip()
  const { itinerary, addSpotToItinerary, removeSpotByName, reorderDayActivities, generateTripItinerary, destination, setDestination, setStartDate, setEndDate, setDays } = tripContext;

  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLiveAudioOpen, setIsLiveAudioOpen] = useState(false)
  const [isRecordingMic, setIsRecordingMic] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")
  const recognitionRef = useRef(null)

  const toggleMicRecording = () => {
    if (isRecordingMic) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop() } catch (e) {}
      }
      setIsRecordingMic(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsLiveAudioOpen(true)
      return
    }

    try {
      const rec = new SpeechRecognition()
      rec.continuous = false
      rec.interimResults = true
      rec.lang = "en-US"

      rec.onstart = () => {
        setIsRecordingMic(true)
      }

      rec.onresult = (e) => {
        let transcript = ""
        for (let i = e.resultIndex; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript
        }
        if (transcript) {
          setInputMessage(transcript)
        }
      }

      rec.onerror = (e) => {
        console.warn("Mic recording error:", e.error)
        setIsRecordingMic(false)
      }

      rec.onend = () => {
        setIsRecordingMic(false)
      }

      recognitionRef.current = rec
      rec.start()
    } catch (e) {
      console.error("Failed to start mic recording:", e)
      setIsRecordingMic(false)
      setIsLiveAudioOpen(true)
    }
  }
  
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi! I'm **Boots**, your AI Travel Assistant! 🐒\n\nAsk me about **day-by-day itineraries**, **peak seasons**, **crowd levels**, or **weather tips** for any location worldwide!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])

  const chatEndRef = useRef(null)

  // Load API Key from localStorage or process.env on mount
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem("tripnest_gemini_key")
      if (savedKey) {
        setApiKey(savedKey)
      } else if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        setApiKey(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen, isLoading])

  const handleSaveApiKey = (e) => {
    e.preventDefault()
    try {
      localStorage.setItem("tripnest_gemini_key", apiKey.trim())
      setShowSettings(false)
    } catch (e) {
      console.error(e)
    }
  }

  const handleSendMessage = async (textToSend) => {
    if (!user) {
      if (onOpenAuth) onOpenAuth("login")
      return
    }
    const messageText = textToSend || inputMessage
    if (!messageText.trim() || isLoading) return

    const userMsg = {
      id: Date.now().toString(),
      role: "user",
      content: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInputMessage("")
    setIsLoading(true)

    const lowerText = messageText.toLowerCase()

    // Check if user is requesting Boots to GENERATE / PLAN A MULTI-DAY TRIP ITINERARY
    const isMultiDayIntent = ["plan", "create itinerary", "build itinerary", "make plan", "generate itinerary", "trip for", "days trip", "day trip"].some((kw) => lowerText.includes(kw))
    if (isMultiDayIntent && (lowerText.includes("trip") || lowerText.includes("itinerary") || lowerText.includes("plan") || lowerText.includes("days"))) {
      let targetDest = destination || "Goa (India)"

      // Parse days count (e.g. 3 days, 5 day)
      let numDays = 3
      const daysMatch = lowerText.match(/(\d+)\s*days?/)
      if (daysMatch && daysMatch[1]) {
        numDays = parseInt(daysMatch[1], 10)
      }

      // Parse date range if present (e.g., "from 3 October to 5 October")
      const dateRangeRegex = /(\d{1,2})\s*(january|february|march|april|may|june|july|august|september|october|november|december)\s*to\s*(\d{1,2})\s*(january|february|march|april|may|june|july|august|september|october|november|december)/i;
      const dateMatch = lowerText.match(dateRangeRegex);
      if (dateMatch) {
        const monthMap = {
          january: "01", february: "02", march: "03", april: "04", may: "05", june: "06",
          july: "07", august: "08", september: "09", october: "10", november: "11", december: "12"
        };
        const startDay = dateMatch[1].padStart(2, "0");
        const startMonth = monthMap[dateMatch[2].toLowerCase()];
        const endDay = dateMatch[3].padStart(2, "0");
        const endMonth = monthMap[dateMatch[4].toLowerCase()];
        const year = new Date().getFullYear();
        const startISO = `${year}-${startMonth}-${startDay}`;
        const endISO = `${year}-${endMonth}-${endDay}`;
        // Update context dates
        setStartDate?.(startISO);
        setEndDate?.(endISO);
        // Compute number of days inclusive
        const startDt = new Date(startISO);
        const endDt = new Date(endISO);
        const diff = (endDt - startDt) / (1000 * 60 * 60 * 24);
        if (!isNaN(diff) && diff >= 0) {
          const calculatedDays = Math.round(diff) + 1;
          setDays(calculatedDays);
          numDays = calculatedDays;
        }
      }

      // Parse destination name
      const destMatch = messageText.match(/(?:for|to|in)\s+([A-Za-z\s]+?)(?:\s+and|\s+trip|\s+for|\s+days?|$)/i)
      if (destMatch && destMatch[1] && destMatch[1].trim().length >= 2) {
        targetDest = destMatch[1].trim().replace(/\b(?:the|a|an)\b/gi, "").trim()
        targetDest = targetDest.charAt(0).toUpperCase() + targetDest.slice(1)
      }

      generateTripItinerary(targetDest, numDays)
      onNavigate?.("itinerary")

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `🎉 **Created a ${numDays}-Day Custom Itinerary for ${targetDest}!**\n\nI have populated your Itinerary Planner and synchronized your live route map. Click below to view your full day-by-day plan! [ACTION:navigate:itinerary:${targetDest}]`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
      setIsLoading(false)
      return
    }

    // Check if user is requesting to CHANGE TARGET TRIP BUDGET
    const isBudgetChangeIntent = (lowerText.includes("budget") || lowerText.includes("cost limit") || lowerText.includes("target budget")) && (lowerText.includes("set") || lowerText.includes("change") || lowerText.includes("update") || lowerText.includes("make") || lowerText.includes("to") || lowerText.includes("limit"))
    if (isBudgetChangeIntent) {
      const amountMatch = lowerText.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|thousand)?/i)
      if (amountMatch && amountMatch[1]) {
        let amount = parseInt(amountMatch[1].replace(/,/g, ""), 10)
        if (lowerText.includes("k") && amount < 1000) amount *= 1000
        if (amount > 0 && tripContext.setCustomTargetBudget) {
          tripContext.setCustomTargetBudget(amount)
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: `💰 **Target Trip Budget updated to ₹${amount.toLocaleString()}!**\n\nYour category allocations and financial summaries have been synchronized. [ACTION:navigate:budget]`,
              executedActions: [`💰 Target Budget set to ₹${amount.toLocaleString()}`],
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ])
          setIsLoading(false)
          return
        }
      }
    }

    // Check if user is requesting to LOG AN EXPENSE
    const isExpenseLogIntent = (lowerText.includes("log") || lowerText.includes("record") || lowerText.includes("add")) && (lowerText.includes("expense") || lowerText.includes("paid") || lowerText.includes("spent"))
    if (isExpenseLogIntent) {
      const amountMatch = lowerText.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|thousand)?/i)
      let amount = amountMatch && amountMatch[1] ? parseInt(amountMatch[1].replace(/,/g, ""), 10) : 500
      if (lowerText.includes("k") && amount < 1000) amount *= 1000

      let paidBy = "Rahul"
      const paidMatch = messageText.match(/paid\s+by\s+([A-Za-z]+)/i) || messageText.match(/by\s+([A-Za-z]+)/i)
      if (paidMatch && paidMatch[1]) paidBy = paidMatch[1].trim()

      let cat = "Food & Dining"
      if (lowerText.includes("transport") || lowerText.includes("cab") || lowerText.includes("taxi") || lowerText.includes("flight") || lowerText.includes("train")) cat = "Transport"
      else if (lowerText.includes("hotel") || lowerText.includes("stay") || lowerText.includes("resort") || lowerText.includes("villa")) cat = "Accommodation"
      else if (lowerText.includes("activity") || lowerText.includes("ticket") || lowerText.includes("tour") || lowerText.includes("park")) cat = "Activities"
      else if (lowerText.includes("shopping") || lowerText.includes("souvenir") || lowerText.includes("clothes")) cat = "Shopping"

      let title = "Expense"
      const titleMatch = messageText.match(/(?:for|on)\s+([A-Za-z\s]+?)(?:\s+in|\s+paid|\s+by|\s+amount|\s+rs|\s+₹|$)/i)
      if (titleMatch && titleMatch[1]) title = titleMatch[1].trim()
      else if (cat) title = `${cat} Expense`

      if (tripContext.addActualExpense) {
        tripContext.addActualExpense({
          title,
          description: title,
          amount,
          category: cat,
          paidBy,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
        })

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: `🧾 **Logged Expense:** "${title}" (₹${amount.toLocaleString()}) paid by **${paidBy}** in **${cat}**!\n\nYour Expense Tracker balances have been refreshed. [ACTION:navigate:expenses]`,
            executedActions: [`🧾 Logged ₹${amount.toLocaleString()} for ${title} paid by ${paidBy}`],
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ])
        setIsLoading(false)
        return
      }
    }

    // Check if user is requesting to CHANGE STAY TIER
    const isTierChangeIntent = lowerText.includes("tier") || lowerText.includes("luxury") || lowerText.includes("economy") || lowerText.includes("standard") || lowerText.includes("budget tier")
    if (isTierChangeIntent && (lowerText.includes("set") || lowerText.includes("switch") || lowerText.includes("change") || lowerText.includes("to"))) {
      let tier = "Standard"
      if (lowerText.includes("luxury") || lowerText.includes("5 star") || lowerText.includes("premium")) tier = "Luxury"
      else if (lowerText.includes("economy") || lowerText.includes("budget") || lowerText.includes("cheap")) tier = "Economy"

      if (tripContext.setStayTier) {
        tripContext.setStayTier(tier)
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: `🏨 **Stay Tier updated to ${tier}!**\n\nAccommodation costs and estimated trip totals have been updated. [ACTION:navigate:budget]`,
            executedActions: [`🏨 Stay Tier changed to ${tier}`],
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ])
        setIsLoading(false)
        return
      }
    }

    // Check if user is requesting navigation linking
    const isNavIntent = ["go to", "open", "show", "take me to", "navigate", "switch to", "view"].some((kw) => lowerText.includes(kw)) || lowerText.includes("workspace") || lowerText.includes("workplace")
    if (isNavIntent) {
      let targetView = null
      let viewName = ""
      if (lowerText.includes("budget")) {
        targetView = "budget"
        viewName = "Budget Calculator Workspace"
      } else if (lowerText.includes("expense")) {
        targetView = "expenses"
        viewName = "Expense Tracker Workspace"
      } else if (lowerText.includes("explore") || lowerText.includes("world")) {
        targetView = "explore"
        viewName = "Explore World Workspace"
      } else if (lowerText.includes("package")) {
        targetView = "packages"
        viewName = "Package Comparison Workspace"
      } else if (lowerText.includes("profile") || lowerText.includes("passport")) {
        targetView = "profile"
        viewName = "User Profile & Passport Workspace"
      } else {
        // Default "open workplace/workspace/planner/itinerary" to Itinerary Planner Workspace
        targetView = "itinerary"
        viewName = "Itinerary Planner Workspace"
      }

      if (targetView) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: `**[Category: 🚀 Quick Action]**\n\nSure! Click below to jump directly to **${viewName}**:\n[ACTION:navigate:${targetView}]`,
            executedActions: [`🚀 Switched view to ${targetView.toUpperCase()}`],
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ])
        onNavigate?.(targetView)
        setIsLoading(false)
        return
      }
    }

    // Check if user is requesting Boots to REMOVE a location or DAY from the itinerary
    const isRemoveIntent = ["remove", "delete", "drop", "take out", "cancel", "erase"].some((kw) => lowerText.includes(kw))
    if (isRemoveIntent) {
      // Check if user is asking to remove a DAY (e.g. "remove day 2", "delete day 3", "remove this day")
      const isDayRemove = lowerText.includes("day") || lowerText.includes("this day")
      if (isDayRemove && !lowerText.includes("spot") && !lowerText.includes("place") && !lowerText.includes("attraction")) {
        const dayMatch = lowerText.match(/day\s*(\d+)/i)
        const dayNum = dayMatch && dayMatch[1] ? parseInt(dayMatch[1], 10) : (itinerary?.length || 1)

        if (tripContext.removeDayFromItinerary) {
          const wasRemoved = tripContext.removeDayFromItinerary(dayNum)
          const actionReply = wasRemoved
            ? `🗑️ **Removed Day ${dayNum}** from your Itinerary Planner! Remaining days have been renumbered and live route map synchronized. [ACTION:navigate:itinerary]`
            : `⚠️ Couldn't find **Day ${dayNum}** in your current itinerary.`

          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: actionReply,
              executedActions: wasRemoved ? [`🗑️ Removed Day ${dayNum} from itinerary planner`] : [],
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ])
          setIsLoading(false)
          return
        }
      }

      let spotName = messageText
        .replace(/can\s+you\s+/i, "")
        .replace(/(?:please\s+)?(?:remove|delete|drop|take out|cancel|erase)\s+/i, "")
        .replace(/\s+(?:from|in|into|on)\s+(?:the\s+)?(?:plan|itinerary|trip|schedule).*/i, "")
        .replace(/\s+(?:on|from)\s+day\s*\d+.*/i, "")
        .replace(/["']/g, "")
        .trim()

      if (spotName && spotName.length >= 2) {
        const wasRemoved = removeSpotByName(spotName)
        let actionReply = ""
        if (wasRemoved) {
          actionReply = `🗑️ **Removed "${spotName}"** from your Itinerary Planner! Your live route map has been updated. [ACTION:navigate:itinerary]`
        } else {
          actionReply = `⚠️ Couldn't find **"${spotName}"** in your current itinerary. Please check the spot title in the planner!`
        }

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: actionReply,
            isLocationAction: true,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ])
        setIsLoading(false)
        return
      }
    }

    // Check if user is requesting OFFBEAT PLACES / RECOMMENDATIONS
    const isOffbeatIntent = ["suggest", "recommend", "offbeat", "hidden gems", "places to visit", "top spots", "things to do"].some((kw) => lowerText.includes(kw))
    if (isOffbeatIntent && !lowerText.includes("remove") && !lowerText.includes("delete")) {
      let targetLoc = destination || "Goa"
      const locMatch = messageText.match(/(?:in|near|around|for)\s+([A-Za-z\s]+?)(?:\s+place|\s+spots|\s+gems|\s+trip|$)/i)
      if (locMatch && locMatch[1] && locMatch[1].trim().length >= 2) {
        targetLoc = locMatch[1].trim()
      }

      const offbeatSpots = [
        { title: `Chorao Island & Salim Ali Bird Sanctuary`, loc: targetLoc, type: "Nature & Sanctuary", cost: "₹450", desc: `Tranquil mangrove kayaking & rare migratory bird watching.` },
        { title: `Harvalem Waterfall & Rock-Cut Caves`, loc: targetLoc, type: "Hidden Waterfall", cost: "₹350", desc: `Scenic 6th-century ancient cave complex & lush cascading falls.` },
        { title: `Netravali Bubble Lake & Spice Plantation`, loc: targetLoc, type: "Eco-Trail & Spice", cost: "₹750", desc: `Mysterious bubbling natural freshwater lake surrounded by spice groves.` }
      ]

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `🌟 **Top Offbeat Places in ${targetLoc}:**\n\nHere are 3 unique hidden gems away from crowd bottlenecks. Click **"➕ Add to Itinerary"** below any spot to schedule it directly!`,
          suggestedSpots: offbeatSpots,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
      setIsLoading(false)
      return
    }

    // Check if user is requesting Boots to ADD a location or DAY to the planner
    const isAddIntent = ["add", "put", "include", "insert", "schedule", "place"].some((kw) => lowerText.includes(kw))

    if (isAddIntent) {
      // Check if user is asking to add a DAY (e.g. "add day", "add a day", "add it again", "add another day", "put it back", "add it")
      const isDayAdd = (lowerText.includes("day") || lowerText.includes("it again") || lowerText.includes("another day") || lowerText.includes("put it back") || lowerText.includes("add it")) && !lowerText.includes("spot") && !lowerText.includes("place") && !lowerText.includes("attraction")
      if (isDayAdd) {
        let restored = false
        if (tripContext.lastRemovedDayState && tripContext.restoreLastRemovedDay) {
          restored = tripContext.restoreLastRemovedDay()
        } else if (tripContext.addDayToItinerary) {
          tripContext.addDayToItinerary()
        }

        const msgText = restored
          ? `↩️ **Restored your removed Day** back to its exact original position! Live route map and budget synchronized. [ACTION:navigate:itinerary]`
          : `➕ **Added Day ${(itinerary?.length || 0) + 1}** to your Itinerary Planner! Live route map and budget synchronized. [ACTION:navigate:itinerary]`

        const actionText = restored
          ? `↩️ Restored removed Day back to its exact original position`
          : `➕ Added Day ${(itinerary?.length || 0) + 1} to itinerary planner`

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: msgText,
            executedActions: [actionText],
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ])
        setIsLoading(false)
        return
      }

      let spotName = messageText
        .replace(/can\s+you\s+/i, "")
        .replace(/(?:please\s+)?(?:add|put|include|insert|schedule|place)\s+/i, "")
        .replace(/\s+(?:to|in|into|on)\s+(?:the\s+)?(?:plan|itinerary|trip|schedule).*/i, "")
        .replace(/\s+(?:on|to)\s+day\s*\d+.*/i, "")
        .replace(/\s+at\s+\d+.*$/i, "")
        .replace(/["']/g, "")
        .trim()

      if (spotName && spotName.length >= 2) {
        let targetDayIdx = 0
        const dayMatch = lowerText.match(/day\s*(\d+)/)
        if (dayMatch && dayMatch[1]) {
          targetDayIdx = Math.max(0, parseInt(dayMatch[1], 10) - 1)
        }

        let specifiedTime = null
        const timeMatch = lowerText.match(/(?:at\s+)?(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i)
        if (timeMatch) {
          specifiedTime = timeMatch[1].toUpperCase()
        } else if (lowerText.includes("morning")) {
          specifiedTime = "09:30 AM"
        } else if (lowerText.includes("afternoon")) {
          specifiedTime = "01:30 PM"
        } else if (lowerText.includes("evening") || lowerText.includes("sunset") || lowerText.includes("night")) {
          specifiedTime = "06:30 PM"
        }

        const allSpots = (itinerary || []).flatMap((d) => d.activities || [])
        const existingSpot = allSpots.find(
          (s) => s.title.toLowerCase().includes(spotName.toLowerCase()) || spotName.toLowerCase().includes(s.title.toLowerCase())
        )

        let actionReply = ""
        if (existingSpot) {
          actionReply = `⚠️ **"${existingSpot.title}"** is already in your itinerary on Day ${existingSpot.day || 1}! Each location is kept unique without duplicates.`
        } else {
          addSpotToItinerary(targetDayIdx, {
            title: spotName,
            time: specifiedTime,
            desc: `Added via Boots AI for ${destination || "your trip"}.`,
            cost: "₹750",
            numericCost: 750
          })
          actionReply = `✅ **Added "${spotName}"** to **Day ${targetDayIdx + 1}** ${specifiedTime ? `at ${specifiedTime}` : ""} in your Itinerary Planner! [ACTION:navigate:itinerary]`
        }

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: actionReply,
            isLocationAction: true,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ])
        setIsLoading(false)
        return
      }
    }

    const updatedHistory = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }))

    try {
      // 1. Attempt Gemini API Call via Next.js backend API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedHistory,
          userApiKey: apiKey || undefined,
          tripState: {
            destination: tripContext.destination,
            startDate: tripContext.startDate,
            endDate: tripContext.endDate,
            days: tripContext.days,
            travelers: tripContext.travelers,
            stayTier: tripContext.stayTier,
            targetBudget: tripContext.customTargetBudget || tripContext.totalBudget,
            itinerary: tripContext.itinerary,
            loggedExpenses: tripContext.actualExpenses,
            activeStay: tripContext.activeStay || null
          }
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const { cleanText, executedActions, planPreview } = parseAndExecuteBotActions(data.text, tripContext, onNavigate)
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: cleanText,
            executedActions,
            planPreviewCard: planPreview,
            isGemini: true,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ])
      } else {
        // Fallback to local intelligence engine if API fails or no key
        const fallback = generateFallbackResponse(messageText)
        const { cleanText, executedActions, planPreview } = parseAndExecuteBotActions(fallback.text, tripContext, onNavigate)
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: cleanText,
            executedActions,
            planPreviewCard: planPreview,
            isFallback: true,
            destinationCard: fallback.destinationCard,
            dayPlanCard: fallback.dayPlanCard,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ])
      }
    } catch (err) {
      // Offline fallback
      const fallback = generateFallbackResponse(messageText)
      const { cleanText, executedActions, planPreview } = parseAndExecuteBotActions(fallback.text, tripContext, onNavigate)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: cleanText,
          executedActions,
          planPreviewCard: planPreview,
          isFallback: true,
          destinationCard: fallback.destinationCard,
          dayPlanCard: fallback.dayPlanCard,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Filter chips by active category
  const displayedChips =
    activeCategory === "all"
      ? Object.values(CATEGORIZED_PROMPTS).flat()
      : CATEGORIZED_PROMPTS[activeCategory] || []

  // Parse markdown formatting, headings, category tags, and clean bullet lists
  const renderFormattedText = (text) => {
    if (!text) return null
    const lines = text.split("\n")

    return lines.map((line, idx) => {
      let cleanLine = line.trim()
      if (!cleanLine) return <div key={idx} className="h-1.5" />

      // Check for ACTION linking tags e.g. [ACTION:navigate:itinerary:Goa]
      if (cleanLine.includes("[ACTION:navigate:")) {
        const actionMatch = cleanLine.match(/\[ACTION:navigate:([^:\]]+)(?::([^\]]+))?\]/)
        if (actionMatch) {
          const targetView = actionMatch[1] // 'itinerary' | 'budget' | 'expenses' | 'explore' | 'packages' | 'profile'
          const targetDest = actionMatch[2] // optional destination

          const viewLabels = {
            itinerary: `🚀 Open Planner ${targetDest ? `for ${targetDest}` : ""}`,
            budget: "💰 Open Budget Calculator",
            expenses: "📊 Open Expense Tracker",
            explore: `🌍 Explore ${targetDest || "World Destinations"}`,
            packages: "📦 Compare Tour Packages",
            profile: "👤 View Profile & Passport"
          }

          const btnText = viewLabels[targetView] || `Open ${targetView}`

          return (
            <div key={idx} className="mt-2.5 mb-1">
              <Button
                size="sm"
                onClick={() => {
                  if (targetDest) {
                    setDestination(targetDest)
                  }
                  onNavigate?.(targetView)
                  setIsOpen(false)
                }}
                className="w-full rounded-2xl bg-amber-400 text-[#0D2B45] hover:bg-amber-300 font-extrabold text-xs py-2 shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <Compass className="h-4 w-4" />
                {btnText}
              </Button>
            </div>
          )
        }
      }

      // Check for Category Badge header (e.g. **[Category: ...]** or [Category: ...])
      if (cleanLine.includes("[Category:") || cleanLine.includes("Category:")) {
        const match = cleanLine.match(/\[Category:\s*(.*?)\]/) || cleanLine.match(/Category:\s*(.*)/)
        const catLabel = match ? match[1].replace(/\*\*/g, "").trim() : cleanLine
        return (
          <div key={idx} className="mb-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary/20 to-indigo-500/20 border border-primary/30 px-3 py-1 text-[11px] font-bold text-primary shadow-2xs">
              <Sparkles className="h-3 w-3" />
              {catLabel}
            </span>
          </div>
        )
      }

      // Check for headings (### Heading, ## Heading, # Heading)
      if (cleanLine.startsWith("#")) {
        const level = cleanLine.match(/^#+/)?.[0].length || 1
        const titleText = cleanLine.replace(/^#+\s*/, "").replace(/\*\*/g, "")
        return (
          <h4 key={idx} className="font-heading font-bold text-foreground text-xs sm:text-sm mt-2 mb-1">
            {titleText}
          </h4>
        )
      }

      // Handle Bullet Points (strip leading bullet characters to prevent double bullets)
      const isBullet = /^[•\-\*]\s+/.test(cleanLine)
      if (isBullet) {
        cleanLine = cleanLine.replace(/^[•\-\*]\s+/, "")
      }

      // Parse bold **text**
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g)
      const lineContent = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          )
        }
        return part
      })

      if (isBullet) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs sm:text-sm my-0.5 leading-relaxed text-card-foreground">
            {lineContent}
          </li>
        )
      }

      return (
        <p key={idx} className="text-xs sm:text-sm leading-relaxed my-0.5 text-card-foreground">
          {lineContent}
        </p>
      )
    })
  }

  return (
    <>
      {/* Floating Concierge Trigger Button at Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="hidden sm:flex items-center gap-2.5 rounded-full border border-border/80 bg-background/95 px-4 py-2 shadow-xl backdrop-blur-xl cursor-pointer hover:border-primary/50 transition-all group"
              onClick={() => setIsOpen(true)}
            >
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-foreground leading-tight font-heading">Boots Concierge</span>
                <span className="text-[10px] font-medium text-muted-foreground">Ask about your trip</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isOpen && (
            <motion.button
              type="button"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-background border border-border/80 shadow-2xl transition-all hover:border-primary/60 focus:outline-none overflow-hidden cursor-pointer shrink-0"
              aria-label="Open Boots Personal Travel Concierge"
            >
              <img
                src="/boots-avatar.jpg"
                alt="Boots"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute bottom-1 right-1 flex h-3 w-3">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-background" />
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Main Concierge Workspace Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "fixed z-50 flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-background/95 shadow-2xl backdrop-blur-2xl transition-all duration-300",
              isExpanded
                ? "bottom-4 right-2 left-2 sm:right-4 sm:left-auto sm:w-[680px] sm:h-[90vh]"
                : "bottom-4 sm:bottom-6 right-2 sm:right-6 w-[calc(100vw-16px)] sm:w-[450px] h-[620px] max-h-[88vh]"
            )}
          >
            {/* Concierge Header Bar */}
            <div className="flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden border border-border/60 shadow-xs">
                  <img
                    src="/boots-avatar.jpg"
                    alt="Boots Avatar"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold text-foreground flex items-center gap-1.5 leading-none">
                    Boots
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                    Personal Travel Concierge
                  </p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-1">

                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Minimize Window" : "Expand Window"}
                  className="hidden sm:inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                >
                  {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Empty State Concierge Welcome */}
              {messages.length === 0 && (
                <div className="py-8 px-2 text-center space-y-6 flex flex-col items-center justify-center">
                  <div className="h-14 w-14 rounded-full overflow-hidden border border-border shadow-sm p-0.5 bg-background">
                    <img src="/boots-avatar.jpg" alt="Boots" className="h-full w-full object-cover rounded-full" />
                  </div>
                  <div className="space-y-1 max-w-xs">
                    <h4 className="font-heading text-base font-bold text-foreground">
                      TripNest Concierge
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      I understand your itinerary, destination spots, budget, and live routes. Ask me anything about your trip.
                    </p>
                  </div>

                  <div className="w-full max-w-sm space-y-2 pt-2 text-left">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block px-1">
                      Suggested prompts
                    </span>
                    {[
                      "Plan a balanced first day for my trip",
                      "Recommend top places to visit near my hotel",
                      "Keep tomorrow's spend under ₹2,000"
                    ].map((promptText, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          setInputMessage(promptText)
                        }}
                        className="w-full text-left p-3 rounded-2xl border border-border/60 bg-card hover:bg-accent/60 text-xs font-medium text-foreground transition-all cursor-pointer flex items-center justify-between group shadow-2xs font-button"
                      >
                        <span>{promptText}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Conversational Stream */}
              {messages.map((msg) => {
                const isAssistant = msg.role === "assistant"
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3 text-sm",
                      isAssistant ? "justify-start" : "justify-end"
                    )}
                  >
                    {isAssistant && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full overflow-hidden border border-border/60 shadow-2xs mt-0.5">
                        <img
                          src="/boots-avatar.jpg"
                          alt="Boots"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <div className={cn("flex flex-col gap-1 max-w-[85%]", isAssistant ? "items-start" : "items-end")}>
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 shadow-2xs",
                          isAssistant
                            ? "bg-card border border-border/60 text-card-foreground rounded-tl-xs"
                            : "bg-[#8d5bb3] text-white rounded-tr-xs"
                        )}
                      >
                        {renderFormattedText(msg.content)}

                        {/* Live Action Badges */}
                        {msg.executedActions && msg.executedActions.length > 0 && (
                          <div className="mt-2.5 p-2.5 rounded-xl bg-accent/50 border border-border/60 text-xs space-y-1">
                            <div className="font-semibold flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                              <span>Trip Updated</span>
                            </div>
                            {msg.executedActions.map((act, aIdx) => (
                              <div key={aIdx} className="text-[11px] leading-snug text-muted-foreground font-medium">
                                {act.replace(/^[^\w\d]+/, "")}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Plan Itinerary Preview Card */}
                        {msg.planPreviewCard && (
                          <div className="mt-3 rounded-2xl border border-border/80 bg-background/80 p-3.5 space-y-2.5 shadow-sm">
                            <div className="flex items-center justify-between border-b border-border/60 pb-2">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                  Trip Plan Request
                                </span>
                                <h4 className="font-heading font-bold text-sm text-foreground">
                                  {msg.planPreviewCard.days}-Day {msg.planPreviewCard.tier} Trip to {msg.planPreviewCard.destination}
                                </h4>
                              </div>
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-accent text-foreground">
                                {msg.planPreviewCard.tier}
                              </span>
                            </div>
                            <Button
                              type="button"
                              onClick={() => {
                                generateTripItinerary(msg.planPreviewCard.destination, msg.planPreviewCard.days)
                                if (tripContext.setStayTier) {
                                  tripContext.setStayTier(msg.planPreviewCard.tier)
                                }
                                onNavigate?.("itinerary")
                              }}
                              className="w-full rounded-xl bg-[#8d5bb3] text-white hover:bg-[#7a4aa0] font-semibold text-xs py-2 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all font-button"
                            >
                              <Calendar className="h-4 w-4" />
                              Plan Itinerary & Sync Map
                            </Button>
                          </div>
                        )}

                        {msg.destinationCard && (
                          <div className="mt-3 rounded-xl border border-border/60 bg-background/80 p-3 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-foreground">{msg.destinationCard.title}</span>
                              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                                {msg.destinationCard.crowdLevel}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              <strong>Peak Season:</strong> {msg.destinationCard.peakSeason}
                            </p>
                          </div>
                        )}

                        {/* Day Plan Timeline Card */}
                        {msg.dayPlanCard && (
                          <div className="mt-3 rounded-xl border border-border/60 bg-accent/30 p-3 space-y-2">
                            <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                              <span className="font-bold text-xs text-foreground flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-[#8d5bb3]" />
                                Day {msg.dayPlanCard.dayNumber}: {msg.dayPlanCard.theme}
                              </span>
                            </div>
                            <div className="space-y-1 text-xs text-muted-foreground">
                              <p>🌅 <strong>Morning:</strong> {msg.dayPlanCard.morning}</p>
                              <p>☀️ <strong>Afternoon:</strong> {msg.dayPlanCard.afternoon}</p>
                              <p>🌙 <strong>Evening:</strong> {msg.dayPlanCard.evening}</p>
                            </div>
                          </div>
                        )}

                        {/* Suggested Spots Cards */}
                        {msg.suggestedSpots && (
                          <div className="mt-3 space-y-2">
                            {msg.suggestedSpots.map((spot, idx) => (
                              <div key={idx} className="p-3 rounded-2xl border border-border/60 bg-background shadow-2xs space-y-1 text-left">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-xs text-foreground">{spot.title}</span>
                                  <span className="text-[10px] font-semibold text-muted-foreground bg-accent px-2 py-0.5 rounded-md">
                                    {spot.cost}
                                  </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground">{spot.desc}</p>
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => {
                                    addSpotToItinerary(0, {
                                      title: spot.title,
                                      time: "02:30 PM",
                                      desc: spot.desc,
                                      cost: spot.cost,
                                      numericCost: parseInt(spot.cost.replace(/[^\d]/g, ""), 10) || 500
                                    })
                                    onNavigate?.("itinerary")
                                  }}
                                  className="mt-1 w-full rounded-xl bg-[#8d5bb3] text-white hover:bg-[#7a4aa0] font-semibold text-[11px] py-1 shadow-2xs flex items-center justify-center gap-1 cursor-pointer font-button"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                  Add to Itinerary (Day 1)
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Location Action CTA Button */}
                        {msg.isLocationAction && (
                          <Button
                            size="sm"
                            onClick={() => {
                              onNavigate?.("itinerary")
                              setIsOpen(false)
                            }}
                            className="mt-2.5 w-full rounded-xl bg-[#8d5bb3] text-white text-xs font-semibold py-1.5 shadow-2xs flex items-center justify-center gap-1.5 font-button"
                          >
                            <Compass className="h-3.5 w-3.5" />
                            Open Itinerary Workspace
                          </Button>
                        )}
                      </div>

                      <span className="text-[10px] text-muted-foreground px-1">
                        {msg.timestamp}
                      </span>
                    </div>

                    {!isAssistant && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-muted-foreground mt-0.5">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </motion.div>
                )
              })}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground py-2 font-medium">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8d5bb3]/15 text-[#8d5bb3] animate-spin">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </div>
                  <span>Boots is checking your itinerary...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Composer Bar */}
            <div className="border-t border-border/60 bg-card/90 p-3 backdrop-blur-md shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="relative flex items-center gap-2"
              >
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={isRecordingMic ? "Listening to your voice..." : "Ask Boots about your trip..."}
                  disabled={isLoading}
                  className={cn(
                    "h-11 rounded-2xl bg-background pl-4 pr-20 text-xs sm:text-sm border-border/70 focus-visible:ring-[#8d5bb3]/30 font-button transition-all",
                    isRecordingMic && "border-rose-500 ring-2 ring-rose-500/20 bg-rose-500/5 text-rose-600 dark:text-rose-400 font-semibold"
                  )}
                />
                <div className="absolute right-1.5 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={toggleMicRecording}
                    title={isRecordingMic ? "Stop Recording" : "Speak Message"}
                    className={cn(
                      "h-8 w-8 flex items-center justify-center rounded-xl transition-all cursor-pointer",
                      isRecordingMic
                        ? "bg-rose-500 text-white animate-pulse"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Mic className="h-4 w-4" />
                  </button>

                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="h-8 w-8 flex items-center justify-center rounded-xl bg-[#8d5bb3] text-white hover:bg-[#7a4aa0] disabled:opacity-40 transition-all cursor-pointer font-button shadow-xs"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gemini 2.5 Flash Native Audio Multimodal Live Modal */}
      <GeminiLiveAudioModal
        isOpen={isLiveAudioOpen}
        onClose={() => setIsLiveAudioOpen(false)}
        tripContext={tripContext}
        onNavigate={onNavigate}
        apiKey={apiKey}
      />
    </>
  )
}
