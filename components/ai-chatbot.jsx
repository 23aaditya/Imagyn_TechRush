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

// Categorized Prompt Chips for organized browsing
const PROMPT_CATEGORIES = [
  { id: "all", label: "🌟 All" },
  { id: "dayplans", label: "🗓️ Day Plans" },
  { id: "peakseason", label: "☀️ Peak Season" },
  { id: "crowds", label: "👥 Crowd Control" },
  { id: "budgetfood", label: "💰 Budget & Food" },
]

const CATEGORIZED_PROMPTS = {
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
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.text,
            isGemini: true,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ])
      } else {
        // Fallback to local intelligence engine if API fails or no key
        const fallback = generateFallbackResponse(messageText)
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: fallback.text,
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
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: fallback.text,
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
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              type="button"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="group relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-background border-4 border-primary shadow-2xl shadow-primary/40 hover:shadow-primary/60 ring-4 ring-primary/25 focus:outline-none overflow-hidden transition-all duration-300 z-50"
              aria-label="Open Concierge Assistant"
            >
              {/* Outer pulsing ambient ring */}
              <span className="absolute -inset-1 rounded-full bg-primary/40 animate-ping opacity-75" />

              <img
                src="/boots-avatar.jpg"
                alt="Concierge Chatbot"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* High-visibility active status badge */}
              <span className="absolute top-1 right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-md" />
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
              "fixed z-50 flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-background/95 shadow-2xl shadow-black/20 backdrop-blur-2xl transition-all duration-300",
              isExpanded
                ? "bottom-4 right-4 top-4 left-4 sm:left-auto sm:w-[680px] sm:h-[90vh]"
                : "bottom-6 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[440px] h-[600px] max-h-[85vh]"
            )}
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between border-b border-border/60 bg-card/60 px-4 py-3.5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden border border-primary/30 shadow-md">
                  <img
                    src="/boots-avatar.jpg"
                    alt="Boots Logo"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-foreground flex items-center gap-1.5">
                    Boots
                    <span className="text-[10px] font-semibold text-muted-foreground bg-primary/10 px-2 py-0.5 rounded-full text-primary">
                      Concierge
                    </span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Personal Travel Concierge
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
