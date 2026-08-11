"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mic,
  MicOff,
  Radio,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Zap,
  Key,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { GeminiLiveClient } from "@/lib/gemini-live-client"
import { parseAndExecuteBotActions } from "@/lib/bot-action-executor"

const GEMINI_VOICES = [
  { id: "Puck", label: "Puck (Energetic Male)", gender: "Male" },
  { id: "Kore", label: "Kore (Warm Female)", gender: "Female" },
  { id: "Fenrir", label: "Fenrir (Deep Male)", gender: "Male" },
  { id: "Aoede", label: "Aoede (Expressive Female)", gender: "Female" },
  { id: "Charon", label: "Charon (Calm Male)", gender: "Male" },
]

export function GeminiLiveAudioModal({ isOpen, onClose, tripContext, onNavigate, apiKey: propApiKey }) {
  const [selectedVoice, setSelectedVoice] = useState("Puck")
  const [liveState, setLiveState] = useState("idle") // idle | connecting | connected | listening | speaking | interrupted | error
  const [isFallback, setIsFallback] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volumes, setVolumes] = useState({ micVolume: 0, modelVolume: 0 })
  const [liveTranscript, setLiveTranscript] = useState("")
  const [transcriptHistory, setTranscriptHistory] = useState([])
  const [executedActions, setExecutedActions] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [customKeyInput, setCustomKeyInput] = useState("")
  const [showKeyInput, setShowKeyInput] = useState(false)

  const clientRef = useRef(null)
  const transcriptEndRef = useRef(null)

  const effectiveKey = customKeyInput.trim() || propApiKey

  const getSystemInstruction = () => {
    let tripInfo = "No active trip."
    if (tripContext) {
      tripInfo = `Destination: ${tripContext.destination || "Not set"}, Days: ${tripContext.days || 3}, Stay Tier: ${tripContext.stayTier || "Standard"}, Target Budget: ₹${tripContext.customTargetBudget || tripContext.totalBudget || 50000}`
    }
    return `You are Boots, the energetic monkey travel assistant from TripNest! 🐒
You are engaged in a real-time native audio conversation with the user.
Keep answers concise, upbeat, engaging, and friendly.

USER'S CURRENT TRIP STATE:
${tripInfo}

WEBSITE COMMANDS:
You can execute website actions while speaking by outputting action tags:
- To add a spot: [ACTION:add_spot:DayNum:SpotTitle:CostAmount:Category]
- To remove spot: [ACTION:remove_spot:SpotTitle]
- To set stay tier: [ACTION:set_tier:Economy|Standard|Luxury]
- To set budget: [ACTION:set_budget:Amount]
- To change view: [ACTION:navigate:itinerary|budget|expenses|explore|packages|profile]
`
  }

  const startClient = (keyToUse) => {
    if (clientRef.current) {
      clientRef.current.disconnect()
    }

    const client = new GeminiLiveClient({
      apiKey: keyToUse,
      voice: selectedVoice,
      systemInstruction: getSystemInstruction(),
      tripContext,
      onStateChange: (state, meta) => {
        setLiveState(state)
        if (meta && typeof meta.isFallback === "boolean") {
          setIsFallback(meta.isFallback)
        }
      },
      onVolumeChange: ({ micVolume, modelVolume }) => {
        setVolumes({ micVolume, modelVolume })
      },
      onTranscript: ({ text, fullText, isUser, isFinal }) => {
        setLiveTranscript(fullText)
        if (isFinal && fullText.trim()) {
          setTranscriptHistory((prev) => [
            ...prev,
            { text: fullText, isUser, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
          ])
        }
      },
      onAction: (actionChunk) => {
        if (tripContext) {
          const { executedActions: newActions } = parseAndExecuteBotActions(actionChunk, tripContext, onNavigate)
          if (newActions && newActions.length > 0) {
            setExecutedActions((prev) => [...newSet(prev, newActions)])
          }
        }
      },
      onError: (err) => {
        setErrorMessage(err)
      },
    })

    clientRef.current = client
    client.connect()
  }

  useEffect(() => {
    if (isOpen) {
      startClient(effectiveKey)
    } else {
      if (clientRef.current) {
        clientRef.current.disconnect()
        clientRef.current = null
      }
      setLiveState("idle")
      setIsFallback(false)
      setLiveTranscript("")
      setExecutedActions([])
      setErrorMessage(null)
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect()
        clientRef.current = null
      }
    }
  }, [isOpen])

  const newSet = (existing, incoming) => {
    const combined = [...existing]
    incoming.forEach((act) => {
      if (!combined.includes(act)) combined.push(act)
    })
    return combined
  }

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [liveTranscript, transcriptHistory])

  const handleVoiceChange = (voiceId) => {
    setSelectedVoice(voiceId)
    if (clientRef.current) {
      clientRef.current.updateVoice(voiceId)
    }
  }

  const handleToggleMute = () => {
    if (clientRef.current) {
      const muted = clientRef.current.toggleMute()
      setIsMuted(muted)
    }
  }

  const handleSaveCustomKey = (e) => {
    e.preventDefault()
    if (customKeyInput.trim()) {
      try {
        localStorage.setItem("tripnest_gemini_key", customKeyInput.trim())
      } catch (e) {}
      setShowKeyInput(false)
      startClient(customKeyInput.trim())
    }
  }

  if (!isOpen) return null

  const activeVol = Math.max(volumes.micVolume, volumes.modelVolume)
  const orbScale = 1 + activeVol * 0.4

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-amber-500/30 bg-slate-950 text-slate-100 shadow-2xl shadow-amber-500/10 flex flex-col"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-gradient-to-r from-amber-500/15 via-slate-900 to-indigo-500/15 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40">
                <Radio className="h-5 w-5 text-amber-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-base font-extrabold text-white flex items-center gap-1.5">
                    Gemini Live Native Audio
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    2.5 Flash
                  </span>
                </div>
                <p className="text-xs text-slate-400">Bidirectional Real-Time Voice Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowKeyInput(!showKeyInput)}
                title="Gemini API Key Settings"
                className="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-800 hover:text-amber-400"
              >
                <Key className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Key Input Bar Collapsible */}
          {showKeyInput && (
            <form onSubmit={handleSaveCustomKey} className="flex items-center gap-2 p-3 bg-slate-900 border-b border-slate-800">
              <Input
                type="password"
                value={customKeyInput}
                onChange={(e) => setCustomKeyInput(e.target.value)}
                placeholder="Paste your AIza... Gemini API Key here"
                className="h-9 text-xs bg-slate-950 border-slate-700 text-slate-200"
              />
              <Button type="submit" size="sm" className="h-9 text-xs bg-amber-500 text-slate-950 font-bold hover:bg-amber-400">
                Connect
              </Button>
            </form>
          )}

          {/* Mode Banner if in Fallback */}
          {isFallback && (
            <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-[11px] text-amber-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                Active: Native Voice Engine (Speech + Gemini AI)
              </span>
              <button
                type="button"
                onClick={() => setShowKeyInput(true)}
                className="underline hover:text-amber-200 font-semibold"
              >
                Set AI Studio Key
              </button>
            </div>
          )}

          {/* Core Interactive Visualizer Area */}
          <div className="relative flex flex-col items-center justify-center py-8 px-6 bg-radial from-amber-500/10 via-slate-950 to-slate-950">
            {/* Animated Audio Orb */}
            <div className="relative flex items-center justify-center my-4">
              <motion.div
                animate={{
                  scale: liveState === "speaking" ? [1, 1.3, 1] : orbScale,
                  opacity: liveState === "speaking" ? [0.4, 0.8, 0.4] : 0.4 + activeVol * 0.5,
                }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                className={cn(
                  "absolute h-40 w-40 rounded-full blur-xl transition-colors duration-300",
                  liveState === "speaking"
                    ? "bg-amber-400/40"
                    : liveState === "listening"
                    ? "bg-emerald-400/40"
                    : "bg-slate-700/30"
                )}
              />

              <motion.div
                animate={{ scale: orbScale }}
                className={cn(
                  "relative z-10 flex h-28 w-28 items-center justify-center rounded-full border-4 shadow-2xl overflow-hidden transition-all duration-300",
                  liveState === "speaking"
                    ? "border-amber-400 shadow-amber-500/50"
                    : liveState === "listening"
                    ? "border-emerald-400 shadow-emerald-500/50"
                    : "border-slate-700 shadow-slate-900"
                )}
              >
                <img
                  src="/boots-avatar.jpg"
                  alt="Boots AI"
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </div>

            {/* Live Audio Frequency Spectrum Bars */}
            <div className="flex items-center gap-1.5 h-8 my-2">
              {[0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 0.3].map((factor, idx) => {
                const barHeight = Math.max(8, activeVol * 32 * factor)
                return (
                  <motion.div
                    key={idx}
                    animate={{ height: `${barHeight}px` }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={cn(
                      "w-1.5 rounded-full transition-colors",
                      liveState === "speaking"
                        ? "bg-amber-400"
                        : liveState === "listening"
                        ? "bg-emerald-400"
                        : "bg-slate-700"
                    )}
                  />
                )
              })}
            </div>

            {/* Connection Status Badge */}
            <div className="mt-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold border transition-all",
                  liveState === "speaking"
                    ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                    : liveState === "listening"
                    ? "bg-emerald-400/20 text-emerald-300 border-emerald-400/40"
                    : liveState === "connecting"
                    ? "bg-sky-400/20 text-sky-300 border-sky-400/40"
                    : isMuted
                    ? "bg-red-400/20 text-red-300 border-red-400/40"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                )}
              >
                {liveState === "connecting" && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                {liveState === "listening" && <Mic className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />}
                {liveState === "speaking" && <Volume2 className="h-3.5 w-3.5 text-amber-400 animate-bounce" />}
                {isMuted && <MicOff className="h-3.5 w-3.5 text-red-400" />}

                {liveState === "connecting" && "Connecting to Gemini Live..."}
                {liveState === "listening" && (isMuted ? "Microphone Muted" : isFallback ? "Listening (Native Voice Mode)..." : "Listening (Speak Now)...")}
                {liveState === "speaking" && "Boots is Speaking..."}
                {liveState === "interrupted" && "Voice Interrupted"}
                {liveState === "error" && (errorMessage || "Connection Error")}
                {liveState === "idle" && "Disconnected"}
              </span>
            </div>
          </div>

          {/* Voice Selector Bar */}
          <div className="flex items-center justify-between border-t border-b border-slate-800 bg-slate-900/60 px-6 py-2.5">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-amber-400" />
              Gemini Voice:
            </span>
            <select
              value={selectedVoice}
              onChange={(e) => handleVoiceChange(e.target.value)}
              className="bg-slate-950 text-xs font-semibold text-amber-300 border border-amber-500/30 rounded-xl px-3 py-1 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {GEMINI_VOICES.map((v) => (
                <option key={v.id} value={v.id} className="bg-slate-950 text-slate-200">
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          {/* Live Executed Action Badges Box */}
          {executedActions.length > 0 && (
            <div className="px-6 py-2.5 bg-emerald-950/30 border-b border-emerald-500/30">
              <div className="text-[11px] font-extrabold uppercase text-emerald-400 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Live Executed Website Actions
              </div>
              <div className="space-y-1">
                {executedActions.map((act, idx) => (
                  <div key={idx} className="text-xs text-emerald-200 font-medium">
                    {act}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Closed Captions Live Text Box */}
          <div className="p-4 bg-slate-950/90 h-32 overflow-y-auto font-sans text-xs space-y-2 border-b border-slate-800 scrollbar-thin scrollbar-thumb-slate-800">
            {transcriptHistory.length === 0 && !liveTranscript && (
              <p className="text-slate-500 italic text-center py-4">
                Talk to Boots! Speech and real-time transcripts will stream here.
              </p>
            )}
            {transcriptHistory.map((item, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-500 font-mono">
                  {item.isUser ? "You" : "Boots"} • {item.timestamp}
                </span>
                <p className={item.isUser ? "text-slate-300" : "text-amber-300 font-medium"}>
                  {item.text}
                </p>
              </div>
            ))}
            {liveTranscript && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-amber-400/80 font-mono animate-pulse">Boots (Live)...</span>
                <p className="text-amber-200 font-medium leading-relaxed">{liveTranscript}</p>
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>

          {/* Bottom Action Controls */}
          <div className="flex items-center justify-between p-4 bg-slate-900/80">
            <Button
              type="button"
              variant={isMuted ? "destructive" : "secondary"}
              onClick={handleToggleMute}
              className="rounded-2xl gap-2 font-bold text-xs px-4 py-2"
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {isMuted ? "Unmute Mic" : "Mute Mic"}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  startClient(effectiveKey)
                }}
                className="rounded-2xl border-slate-700 text-slate-300 hover:bg-slate-800 text-xs py-2"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Reconnect
              </Button>

              <Button
                type="button"
                onClick={onClose}
                className="rounded-2xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-extrabold text-xs px-5 py-2 shadow-lg"
              >
                Done
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
