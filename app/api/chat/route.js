import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

function getEffectiveApiKey(userApiKey) {
  if (userApiKey && userApiKey.trim() && userApiKey !== "YOUR_GEMINI_API_KEY_HERE") {
    return userApiKey.trim()
  }

  const envKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (envKey && envKey.trim() && envKey !== "YOUR_GEMINI_API_KEY_HERE") {
    return envKey.trim()
  }

  // Try reading .env.local dynamically from disk
  try {
    const envPath = path.join(process.cwd(), ".env.local")
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8")
      const match = content.match(/GEMINI_API_KEY\s*=\s*(.*)/) || content.match(/NEXT_PUBLIC_GEMINI_API_KEY\s*=\s*(.*)/)
      if (match && match[1]) {
        const key = match[1].trim().replace(/^["']|["']$/g, "")
        if (key && key !== "YOUR_GEMINI_API_KEY_HERE") {
          return key
        }
      }
    }
  } catch (e) {
    console.error("Error reading .env.local dynamically:", e)
  }

  return null
}

export async function POST(request) {
  try {
    const { messages, userApiKey } = await request.json()

    // Determine API Key dynamically
    const apiKey = getEffectiveApiKey(userApiKey)

    if (!apiKey) {
      return NextResponse.json(
        { error: "NO_API_KEY", message: "Gemini API key is missing or not configured in .env.local." },
        { status: 400 }
      )
    }

    const systemInstruction = `You are Boots, the friendly monkey travel assistant from TripNest! 🐒
Your goal is to provide clear, actionable advice on travel plans, peak seasons, crowd levels, weather conditions, and day-by-day itineraries for ANY location, city, country, or landmark worldwide.

Guidelines:
1. You MUST answer queries for ANY destination globally (cities, islands, mountain regions, historical sites, countries).
2. Always start your response with a clear category header on line 1, e.g. **[Category: 🗓️ Day Plan]** or **[Category: ☀️ Peak Season & Weather]** or **[Category: 👥 Crowd Control]** or **[Category: 💰 Budget & Food]**.
3. For Day Plans, clearly structure with Morning, Afternoon, Evening suggestions and estimated timing.
4. For Peak Season & Weather, highlight high season months, shoulder season savings, weather warnings, and crowd levels (out of 100).
5. Be friendly, energetic, and practical. Use bullet points and emoji formatting to make responses easy to read.
6. Keep answers concise yet highly informative.`

    // Format chat history for Gemini REST API (v1beta generateContent)
    const formattedContents = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }))

    // Primary & Fallback models
    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash"
    ]

    let responseData = null
    let lastError = null

    for (const model of modelsToTry) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: systemInstruction }],
              },
              contents: formattedContents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000,
              },
            }),
          }
        )

        if (res.ok) {
          responseData = await res.json()
          break
        } else {
          const errJson = await res.json().catch(() => ({}))
          lastError = errJson.error?.message || `HTTP ${res.status} on ${model}`
        }
      } catch (err) {
        lastError = err.message
      }
    }

    if (!responseData || !responseData.candidates?.[0]?.content?.parts?.[0]?.text) {
      return NextResponse.json(
        {
          error: "GEMINI_API_ERROR",
          message: lastError || "Failed to generate content from Gemini API.",
        },
        { status: 500 }
      )
    }

    const aiText = responseData.candidates[0].content.parts[0].text

    return NextResponse.json({ text: aiText })
  } catch (error) {
    console.error("Gemini API Chat Route Error:", error)
    return NextResponse.json(
      { error: "SERVER_ERROR", message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
