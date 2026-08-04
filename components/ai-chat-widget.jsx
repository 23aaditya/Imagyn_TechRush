"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, X, Send, Sparkles, Wallet, Compass, Globe, SlidersHorizontal, Lock } from "lucide-react"
import { useItinerary } from "@/lib/itinerary-context"
import { useAuth } from "@/lib/auth-context"

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "👋 Hi! I am your TripNest AI Companion. Ask me for general info on all destinations, travel tips, or budget breakdowns!"
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  const { selectedDestinationKey, grandTotalBudget, totalAttractionCost } = useItinerary()
  const { isLoggedIn, requireAuth, openAuthModal } = useAuth()

  const [activeProvider, setActiveProvider] = useState("Google Gemini AI")

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen])

  const handleOpenChat = () => {
    requireAuth(
      () => setIsOpen(true),
      "Please sign in to chat with the TripNest AI Travel Assistant and ask location questions"
    )
  }

  const handleSend = async (customText) => {
    if (!isLoggedIn) {
      openAuthModal("Please sign in to chat with the TripNest AI Travel Assistant", "login")
      return
    }

    const query = customText || input
    if (!query.trim() || loading) return

    const userMsg = { role: "user", text: query }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          itineraryContext: {
            destination: selectedDestinationKey,
            totalCost: totalAttractionCost,
            grandTotalBudget: grandTotalBudget
          }
        })
      })

      const data = await response.json()
      if (data.provider) {
        setActiveProvider(data.provider)
      }
      setMessages([...updatedMessages, { role: "assistant", text: data.reply }])
    } catch (err) {
      setMessages([
        ...updatedMessages,
        { role: "assistant", text: "I'm having trouble connecting right now, but feel free to ask about all travel destinations!" }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenChat}
            className="flex items-center gap-2.5 rounded-full bg-primary px-5 py-3.5 text-white shadow-xl shadow-primary/30 hover:bg-primary/90 focus:outline-none"
          >
            <div className="relative flex h-6 w-6 items-center justify-center">
              <Bot className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald"></span>
              </span>
            </div>
            <span className="font-heading text-sm font-semibold tracking-wide">AI Travel & Budget Bot</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Drawer Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-[540px] w-[350px] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl sm:w-[420px]"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-foreground">TripNest Gemini AI Companion</h4>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald"></span>
                    {activeProvider} Ready
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Prompt Pills for General Places & Advice */}
            <div className="flex items-center gap-2 overflow-x-auto border-b border-border/60 bg-background/50 p-2.5 text-xs">
              <button
                onClick={() => handleSend("Give me general information of all places")}
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                <Globe className="h-3 w-3" /> Info of All Places
              </button>
              <button
                onClick={() => handleSend("What are general budget saving tips for travel?")}
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1 font-medium text-emerald hover:bg-emerald/20 transition-colors"
              >
                <Wallet className="h-3 w-3" /> General Budget Tips
              </button>
              <button
                onClick={() => handleSend("Compare Goa, Kerala, Jaipur, and Manali")}
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition-colors"
              >
                <SlidersHorizontal className="h-3 w-3" /> Compare Places
              </button>
            </div>

            {/* Chat History Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs sm:text-sm">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 shadow-xs whitespace-pre-line leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-white font-medium"
                        : "bg-background border border-border text-foreground"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-background border border-border px-4 py-2.5 text-xs text-muted-foreground italic flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary animate-ping"></span>
                    TripNest AI is typing travel info...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="border-t border-border bg-background p-3 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about all places, budget tips, or compare locations..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 rounded-xl border border-border bg-secondary/40 px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-40 transition-all"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
