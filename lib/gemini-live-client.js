/**
 * Gemini Multimodal Live API Client & Hybrid Voice Engine
 * Supports real-time bidirectional WebSocket native audio (Gemini 2.0/2.5 Flash Bidi)
 * and seamless automatic Web Speech API fallback if WebSocket connection is restricted or key invalid.
 */

export class GeminiLiveClient {
  constructor({ apiKey, voice = "Puck", systemInstruction = "", tripContext = null, onStateChange, onVolumeChange, onTranscript, onAction, onError }) {
    this.apiKey = apiKey
    this.voice = voice || "Puck"
    this.systemInstruction = systemInstruction
    this.tripContext = tripContext
    
    // Callbacks
    this.onStateChange = onStateChange || (() => {})
    this.onVolumeChange = onVolumeChange || (() => {})
    this.onTranscript = onTranscript || (() => {})
    this.onAction = onAction || (() => {})
    this.onError = onError || (() => {})

    // Audio & Socket States
    this.ws = null
    this.audioContext = null
    this.micStream = null
    this.micProcessor = null
    this.micSource = null
    this.isMuted = false
    this.isConnected = false
    this.isFallbackMode = false
    this.state = "idle" // idle | connecting | connected | listening | speaking | interrupted | error | fallback

    // Audio Playback Queue
    this.isPlayingAudio = false
    this.nextStartTime = 0
    this.currentTextBuffer = ""

    // Web Speech Fallback references
    this.speechRecognition = null
    this.speechSynthUtterance = null
    this.animFrameId = null
  }

  updateVoice(newVoice) {
    this.voice = newVoice
    if (this.isConnected && !this.isFallbackMode) {
      this.disconnect()
      this.connect()
    }
  }

  setState(newState) {
    this.state = newState
    this.onStateChange(newState, { isFallback: this.isFallbackMode })
  }

  async connect() {
    if (this.ws || (this.isConnected && !this.isFallbackMode)) return
    this.setState("connecting")

    try {
      // 1. Resolve API Key if missing or default placeholder
      if (!this.apiKey || this.apiKey === "YOUR_GEMINI_API_KEY_HERE") {
        try {
          const res = await fetch("/api/gemini-live-config")
          if (res.ok) {
            const data = await res.json()
            if (data.apiKey) {
              this.apiKey = data.apiKey
            }
          }
        } catch (e) {
          console.error("Failed to fetch live config:", e)
        }
      }

      // Check if key is a valid Google AI Studio key format (starts with AIzaSy)
      const isValidKeyFormat =
        this.apiKey &&
        this.apiKey.length > 20 &&
        this.apiKey.startsWith("AIzaSy") &&
        this.apiKey !== "YOUR_GEMINI_API_KEY_HERE"

      if (!isValidKeyFormat) {
        console.warn("Gemini API key is missing or not a Google AI Studio key (starts with AIzaSy). Activating Web Speech Native Voice Mode.")
        this.startWebSpeechFallback("Using Native Voice Engine (Gemini AI Chat)")
        return
      }

      // Primary WebSocket Endpoint for Gemini Multimodal Live API
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${this.apiKey}`

      this.ws = new WebSocket(wsUrl)
      let connectionTimeout = setTimeout(() => {
        if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
          console.warn("Gemini Live WebSocket connection timed out. Falling back to Native Speech.")
          try { this.ws.close() } catch (e) {}
          this.startWebSpeechFallback("WebSocket timed out — using Native Voice Engine")
        }
      }, 5000)

      this.ws.onopen = () => {
        clearTimeout(connectionTimeout)
        console.log("⚡ Gemini Live WebSocket Connected Successfully")
        this.isConnected = true
        this.isFallbackMode = false
        this.setState("connected")

        const modelName = "models/gemini-2.0-flash-exp"

        const setupPayload = {
          setup: {
            model: modelName,
            generationConfig: {
              responseModalities: ["AUDIO", "TEXT"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: this.voice,
                  },
                },
              },
            },
            systemInstruction: {
              parts: [{ text: this.systemInstruction || "You are Boots, the energetic monkey AI travel assistant! 🐒 Answer conversationally and execute actions when requested." }],
            },
          },
        }

        this.ws.send(JSON.stringify(setupPayload))
        this.startMicrophone()
        this.setState("listening")
      }

      this.ws.onmessage = async (event) => {
        try {
          let data = event.data
          if (data instanceof Blob) {
            data = await data.text()
          }

          const response = JSON.parse(data)
          this.handleServerMessage(response)
        } catch (e) {
          console.error("Error parsing Gemini WebSocket message:", e)
        }
      }

      this.ws.onerror = (err) => {
        clearTimeout(connectionTimeout)
        console.error("Gemini WebSocket Error:", err)
        if (!this.isFallbackMode) {
          this.startWebSpeechFallback("Gemini Live WebSocket error — using Native Voice Engine")
        }
      }

      this.ws.onclose = (evt) => {
        clearTimeout(connectionTimeout)
        console.log(`Gemini WebSocket Connection Closed (code: ${evt.code}, reason: ${evt.reason})`)
        if (this.isFallbackMode) return

        this.stopMicrophone()
        this.stopAudioPlayback()
        this.ws = null
        this.startWebSpeechFallback("Gemini Live WebSocket closed — using Native Voice Engine")
      }
    } catch (err) {
      console.error("Gemini Live Connect Failed:", err)
      this.startWebSpeechFallback(err.message || "Failed to connect to Gemini Live — using Native Voice Engine")
    }
  }

  handleServerMessage(response) {
    if (response.serverContent) {
      const { modelTurn, turnComplete, interrupted } = response.serverContent

      if (interrupted) {
        this.stopAudioPlayback()
        this.setState("interrupted")
        setTimeout(() => this.setState("listening"), 800)
        return
      }

      if (modelTurn && modelTurn.parts) {
        this.setState("speaking")

        for (const part of modelTurn.parts) {
          if (part.text) {
            this.currentTextBuffer += part.text
            this.onTranscript({ text: part.text, fullText: this.currentTextBuffer, isUser: false, isFinal: !!turnComplete })

            if (part.text.includes("[ACTION:")) {
              this.onAction(part.text)
            }
          }

          if (part.inlineData && part.inlineData.mimeType.includes("audio/pcm")) {
            this.playPcmAudioChunk(part.inlineData.data)
          }
        }
      }

      if (turnComplete) {
        this.currentTextBuffer = ""
        setTimeout(() => {
          if (!this.isPlayingAudio) {
            this.setState("listening")
          }
        }, 500)
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // WEB SPEECH API NATIVE VOICE FALLBACK ENGINE
  // ═══════════════════════════════════════════════════════════════

  startWebSpeechFallback(reasonNotice) {
    if (this.isFallbackMode && this.isConnected) {
      this.setState("listening")
      return
    }

    this.isFallbackMode = true
    this.isConnected = true
    this.setState("listening")

    if (reasonNotice) {
      this.onError(reasonNotice)
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.warn("Speech Recognition is not supported in this browser.")
      return
    }

    try {
      if (this.speechRecognition) {
        try { this.speechRecognition.stop() } catch (e) {}
      }

      this.speechRecognition = new SpeechRecognition()
      this.speechRecognition.continuous = true
      this.speechRecognition.interimResults = true
      this.speechRecognition.lang = "en-US"

      this.speechRecognition.onstart = () => {
        this.setState("listening")
      }

      this.speechRecognition.onresult = (event) => {
        if (this.isMuted) return

        let interimTranscript = ""
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }

        const currentText = finalTranscript || interimTranscript
        if (currentText) {
          this.onVolumeChange({ micVolume: 0.6, modelVolume: 0 })
          this.onTranscript({ text: currentText, fullText: currentText, isUser: true, isFinal: !!finalTranscript })
        }

        if (finalTranscript.trim()) {
          this.handleFallbackUserSpeech(finalTranscript.trim())
        }
      }

      this.speechRecognition.onerror = (event) => {
        if (event.error !== "no-speech" && event.error !== "aborted") {
          console.warn("Speech Recognition Warning:", event.error)
        }
      }

      this.speechRecognition.onend = () => {
        if (this.isConnected && this.isFallbackMode && !this.isPlayingAudio) {
          try {
            this.speechRecognition.start()
          } catch (e) {}
        }
      }

      this.speechRecognition.start()
    } catch (e) {
      console.warn("Speech Recognition start note:", e)
    }
  }

  async handleFallbackUserSpeech(userQuery) {
    if (this.state === "speaking") {
      window.speechSynthesis?.cancel()
    }

    this.setState("speaking")
    this.onTranscript({ text: "...", fullText: "", isUser: false, isFinal: false })

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userQuery }],
          userApiKey: this.apiKey || undefined,
          tripState: this.tripContext || null
        }),
      })

      let botText = ""
      if (res.ok) {
        const data = await res.json()
        botText = data.text || ""
      }

      if (!botText) {
        const { generateFallbackResponse } = await import("@/lib/ai-travel-knowledge")
        const fallback = generateFallbackResponse(userQuery)
        botText = fallback.text || `Got it! Created trip plan for ${userQuery}`
      }

      this.onTranscript({ text: botText, fullText: botText, isUser: false, isFinal: true })

      if (botText.includes("[ACTION:")) {
        this.onAction(botText)
      }

      const cleanVoiceText = botText.replace(/\[ACTION:[^\]]+\]/g, "").replace(/\*\*/g, "").replace(/#/g, "").trim()
      this.speakTextFallback(cleanVoiceText)
    } catch (err) {
      console.error("Fallback voice API error:", err)
      this.speakTextFallback("I heard you! Let's check your itinerary options.")
    }
  }

  speakTextFallback(text) {
    if (!window.speechSynthesis) {
      this.setState("listening")
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.05
    utterance.pitch = 1.0

    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find((v) => v.name.includes("Google") || v.name.includes("Natural") || v.lang.startsWith("en"))
    if (preferredVoice) utterance.voice = preferredVoice

    const startVisualizer = () => {
      this.isPlayingAudio = true
      let toggle = false
      if (this.animFrameId) clearInterval(this.animFrameId)
      this.animFrameId = setInterval(() => {
        toggle = !toggle
        this.onVolumeChange({ micVolume: 0, modelVolume: toggle ? 0.8 : 0.4 })
      }, 150)
    }

    utterance.onstart = () => {
      this.setState("speaking")
      startVisualizer()
    }

    utterance.onend = () => {
      if (this.animFrameId) clearInterval(this.animFrameId)
      this.isPlayingAudio = false
      this.onVolumeChange({ micVolume: 0, modelVolume: 0 })
      this.setState("listening")
    }

    utterance.onerror = () => {
      if (this.animFrameId) clearInterval(this.animFrameId)
      this.isPlayingAudio = false
      this.setState("listening")
    }

    window.speechSynthesis.speak(utterance)
  }

  // ═══════════════════════════════════════════════════════════════
  // MICROPHONE & PCM PLAYBACK (Direct Gemini WebSocket Mode)
  // ═══════════════════════════════════════════════════════════════

  async startMicrophone() {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 })
      }

      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume()
      }

      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      const source = this.audioContext.createMediaStreamSource(this.micStream)
      this.micSource = source

      const bufferSize = 2048
      const processor = this.audioContext.createScriptProcessor(bufferSize, 1, 1)
      this.micProcessor = processor

      processor.onaudioprocess = (e) => {
        if (this.isMuted || !this.ws || this.ws.readyState !== WebSocket.OPEN) return

        const inputData = e.inputBuffer.getChannelData(0)
        
        let sum = 0
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i]
        }
        const rms = Math.sqrt(sum / inputData.length)
        this.onVolumeChange({ micVolume: Math.min(1, rms * 5), modelVolume: 0 })

        const pcm16 = new Int16Array(inputData.length)
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]))
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff
        }

        const uint8 = new Uint8Array(pcm16.buffer)
        let binary = ""
        for (let i = 0; i < uint8.byteLength; i++) {
          binary += String.fromCharCode(uint8[i])
        }
        const base64Audio = btoa(binary)

        const realtimeInputPayload = {
          realtimeInput: {
            mediaChunks: [
              {
                mimeType: "audio/pcm;rate=16000",
                data: base64Audio,
              },
            ],
          },
        }

        this.ws.send(JSON.stringify(realtimeInputPayload))
      }

      source.connect(processor)
      processor.connect(this.audioContext.destination)
    } catch (err) {
      console.error("Failed to access microphone for Gemini Live:", err)
      this.onError("Microphone permission denied or not supported.")
    }
  }

  stopMicrophone() {
    if (this.micProcessor) {
      this.micProcessor.disconnect()
      this.micProcessor = null
    }
    if (this.micSource) {
      this.micSource.disconnect()
      this.micSource = null
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach((t) => t.stop())
      this.micStream = null
    }
  }

  playPcmAudioChunk(base64Data) {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      }

      const binaryStr = atob(base64Data)
      const len = binaryStr.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i)
      }

      const int16 = new Int16Array(bytes.buffer)
      const float32 = new Float32Array(int16.length)

      let sum = 0
      for (let i = 0; i < int16.length; i++) {
        const val = int16[i] / 32768.0
        float32[i] = val
        sum += val * val
      }

      const modelVolume = Math.min(1, Math.sqrt(sum / int16.length) * 4)
      this.onVolumeChange({ micVolume: 0, modelVolume })

      const sampleRate = 24000
      const audioBuffer = this.audioContext.createBuffer(1, float32.length, sampleRate)
      audioBuffer.getChannelData(0).set(float32)

      const source = this.audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(this.audioContext.destination)

      const currentTime = this.audioContext.currentTime
      const startTime = Math.max(currentTime, this.nextStartTime)
      source.start(startTime)

      this.nextStartTime = startTime + audioBuffer.duration
      this.isPlayingAudio = true

      source.onended = () => {
        if (this.audioContext.currentTime >= this.nextStartTime - 0.05) {
          this.isPlayingAudio = false
          if (this.state === "speaking") {
            this.setState("listening")
          }
        }
      }
    } catch (e) {
      console.error("Error playing Gemini PCM audio chunk:", e)
    }
  }

  stopAudioPlayback() {
    this.nextStartTime = 0
    this.isPlayingAudio = false
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    if (this.animFrameId) {
      clearInterval(this.animFrameId)
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    return this.isMuted
  }

  disconnect() {
    this.stopMicrophone()
    this.stopAudioPlayback()

    if (this.speechRecognition) {
      try {
        this.speechRecognition.stop()
      } catch (e) {}
      this.speechRecognition = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    if (this.audioContext) {
      this.audioContext.close().catch(() => {})
      this.audioContext = null
    }

    this.isConnected = false
    this.isFallbackMode = false
    this.setState("idle")
  }
}
