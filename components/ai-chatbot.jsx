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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { generateFallbackResponse, DESTINATION_KNOWLEDGE } from "@/lib/ai-travel-knowledge"
import { useTrip } from "@/context/trip-context"
import { parseAndExecuteBotActions } from "@/lib/bot-action-executor"

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

export function AiChatbot({ currentView, onNavigate }) {
  const tripContext = useTrip()
  const { itinerary, addSpotToItinerary, removeSpotByName, reorderDayActivities, generateTripItinerary, destination, setDestination } = tripContext

  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")
  
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

    // Check if user is requesting navigation linking
    const isNavIntent = ["go to", "open", "show", "take me to", "navigate", "switch to", "view"].some((kw) => lowerText.includes(kw))
    if (isNavIntent) {
      let targetView = null
      let viewName = ""
      if (lowerText.includes("budget")) {
        targetView = "budget"
        viewName = "Budget Calculator"
      } else if (lowerText.includes("expense")) {
        targetView = "expenses"
        viewName = "Expense Tracker"
      } else if (lowerText.includes("planner") || lowerText.includes("itinerary")) {
        targetView = "itinerary"
        viewName = "Itinerary Planner Workspace"
      } else if (lowerText.includes("explore") || lowerText.includes("world")) {
        targetView = "explore"
        viewName = "Explore World"
      } else if (lowerText.includes("package")) {
        targetView = "packages"
        viewName = "Package Comparison"
      } else if (lowerText.includes("profile") || lowerText.includes("passport")) {
        targetView = "profile"
        viewName = "User Profile & Passport"
      }

      if (targetView) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: `**[Category: 🚀 Quick Action]**\n\nSure! Click below to jump directly to **${viewName}**:\n[ACTION:navigate:${targetView}]`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ])
        setIsLoading(false)
        return
      }
    }

    // Check if user is requesting Boots to REMOVE a location from the itinerary
    const isRemoveIntent = ["remove", "delete", "drop", "take out", "cancel", "erase"].some((kw) => lowerText.includes(kw))
    if (isRemoveIntent) {
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

    // Check if user is requesting Boots to ADD a location to the planner
    const isAddIntent = ["add", "put", "include", "insert", "schedule", "place"].some((kw) => lowerText.includes(kw))

    if (isAddIntent) {
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
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const { cleanText, executedActions } = parseAndExecuteBotActions(data.text, tripContext, onNavigate)
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: cleanText,
            executedActions,
            isGemini: true,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ])
      } else {
        // Fallback to local intelligence engine if API fails or no key
        const fallback = generateFallbackResponse(messageText)
        const { cleanText, executedActions } = parseAndExecuteBotActions(fallback.text, tripContext, onNavigate)
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: cleanText,
            executedActions,
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
      const { cleanText, executedActions } = parseAndExecuteBotActions(fallback.text, tripContext, onNavigate)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: cleanText,
          executedActions,
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
      {/* Floating Trigger Button at Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="hidden sm:flex items-center gap-2 rounded-2xl border border-primary/40 bg-card/95 px-3.5 py-2 shadow-2xl backdrop-blur-xl cursor-pointer hover:border-primary transition-colors"
              onClick={() => setIsOpen(true)}
            >
              <Sparkles className="h-4 w-4 text-amber-500 animate-spin" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground leading-none">Ask AI Boots</span>
                <span className="text-[10px] font-semibold text-primary">Live Travel Planning Help</span>
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
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="group relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-background border-[3px] border-primary/50 shadow-2xl shadow-primary/40 transition-all hover:shadow-primary/60 focus:outline-none overflow-hidden"
              aria-label="Open Boots AI Assistant"
            >
              {/* Outer pulsing ring */}
              <span className="absolute -inset-2 rounded-full bg-primary/25 animate-ping opacity-75" />

              <img
                src="/boots-avatar.jpg"
                alt="Boots AI Chatbot"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              {/* Status indicator dot */}
              <span className="absolute top-1 right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-background" />
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Main Chatbot Modal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "fixed z-50 flex flex-col overflow-hidden rounded-3xl border-2 border-primary/40 bg-background/95 shadow-2xl shadow-primary/20 backdrop-blur-2xl transition-all duration-300",
              isExpanded
                ? "bottom-4 right-4 top-4 left-4 sm:left-auto sm:w-[680px] sm:h-[90vh]"
                : "bottom-6 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[450px] h-[620px] max-h-[88vh]"
            )}
          >
            {/* Vibrant Header Bar */}
            <div className="flex items-center justify-between border-b border-primary/30 bg-gradient-to-r from-primary/15 via-card to-emerald-500/10 px-4 py-3.5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl overflow-hidden border-2 border-primary/40 shadow-lg shadow-primary/20">
                  <img
                    src="/boots-avatar.jpg"
                    alt="Boots Logo"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
                    Boots
                    <span className="text-[10px] font-normal text-muted-foreground bg-primary/10 px-2 py-0.5 rounded-full text-primary">
                      AI Chatbot
                    </span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Your Personal Travel Assistant
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Minimize Window" : "Expand Window"}
                  className="hidden sm:inline-flex h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Category Selector Tab Bar */}
            <div className="flex items-center gap-1 border-b border-border/40 bg-muted/30 px-3 py-1.5 overflow-x-auto scrollbar-none">
              {PROMPT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all",
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden border border-primary/30 shadow-xs mt-0.5">
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
                          "rounded-2xl px-4 py-3 shadow-sm",
                          isAssistant
                            ? "bg-card border border-border/60 text-card-foreground rounded-tl-sm"
                            : "bg-primary text-primary-foreground rounded-tr-sm"
                        )}
                      >
                        {renderFormattedText(msg.content)}

                        {/* Live Action Badges */}
                        {msg.executedActions && msg.executedActions.length > 0 && (
                          <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-950/20 dark:bg-emerald-950/50 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs space-y-1 shadow-2xs">
                            <div className="font-extrabold flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border-b border-emerald-500/20 pb-1">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                              Executed Website Action
                            </div>
                            {msg.executedActions.map((act, aIdx) => (
                              <div key={aIdx} className="text-[11px] leading-snug font-medium">
                                {act}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Special Destination Card if available */}
                        {msg.destinationCard && (
                          <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-primary">{msg.destinationCard.title}</span>
                              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                                {msg.destinationCard.crowdLevel}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              <strong>Peak Season:</strong> {msg.destinationCard.peakSeason}
                            </p>
                          </div>
                        )}

                        {/* Day Plan Timeline Card if available */}
                        {msg.dayPlanCard && (
                          <div className="mt-3 rounded-xl border border-border bg-accent/30 p-3 space-y-2">
                            <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                              <span className="font-bold text-xs text-foreground flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-primary" />
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

                        {/* Interactive Suggested Offbeat Spot Cards */}
                        {msg.suggestedSpots && (
                          <div className="mt-3 space-y-2">
                            {msg.suggestedSpots.map((spot, idx) => (
                              <div key={idx} className="p-3 rounded-2xl border border-primary/20 bg-background/90 shadow-sm space-y-1 text-left">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-xs text-foreground">{spot.title}</span>
                                  <span className="text-[10px] font-extrabold text-[#5A8CB2] bg-[#C8D9E6]/30 px-2 py-0.5 rounded-md">
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
                                  className="mt-1 w-full rounded-xl bg-[#5A8CB2] text-white hover:bg-[#4A7CA2] font-bold text-[11px] py-1 shadow-sm flex items-center justify-center gap-1 cursor-pointer"
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
                            className="mt-2.5 w-full rounded-xl bg-primary text-xs font-semibold text-primary-foreground py-1 shadow flex items-center justify-center gap-1.5"
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
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground mt-0.5">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </motion.div>
                )
              })}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary animate-spin">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </div>
                  Analyzing travel categories & peak season intel...
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Workspace Linking Chips Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto px-3 py-2 bg-card/90 border-t border-border/40 scrollbar-none text-[11px] font-bold">
              <span className="text-[10px] text-muted-foreground uppercase font-extrabold shrink-0 mr-1">Quick Links:</span>
              {[
                { label: "🗺️ Planner", view: "itinerary" },
                { label: "💰 Budget", view: "budget" },
                { label: "📊 Expenses", view: "expenses" },
                { label: "🌍 Explore", view: "explore" },
                { label: "📦 Packages", view: "packages" },
                { label: "👤 Profile", view: "profile" },
              ].map((lk) => (
                <button
                  key={lk.view}
                  onClick={() => {
                    onNavigate?.(lk.view)
                    setIsOpen(false)
                  }}
                  className="shrink-0 rounded-full bg-primary/10 border border-primary/20 hover:bg-amber-400 hover:text-[#0D2B45] hover:border-amber-400 px-2.5 py-1 text-primary text-[10px] font-bold transition-all cursor-pointer shadow-xs"
                >
                  {lk.label}
                </button>
              ))}
            </div>

            {/* Input Form Bar */}
            <div className="border-t border-border/60 bg-card/80 p-3 backdrop-blur-md">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex items-center gap-2"
              >
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about day plans, peak season, crowds..."
                  disabled={isLoading}
                  className="h-10 rounded-xl bg-background text-xs sm:text-sm border-border/80 focus-visible:ring-primary"
                />
                <Button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="h-10 w-10 shrink-0 rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
