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
Your goal is to provide clear, actionable advice on travel plans, peak seasons, crowd levels, weather conditions, and day-by-day itineraries for ANY location worldwide, AND directly execute website commands for the user.

Guidelines:
1. You MUST answer queries for ANY destination globally.
2. Always start your response with a clear category header on line 1, e.g. **[Category: 🗓️ Day Plan]** or **[Category: ⚡ Website Command]** or **[Category: ☀️ Peak Season & Weather]** or **[Category: 💰 Budget & Expenses]**.
3. You have FULL OPERATIONAL CONTROL over the website. Whenever the user requests an action, include the appropriate [ACTION:...] tag in your response:

NAVIGATION COMMANDS:
- Open view: [ACTION:navigate:itinerary] or [ACTION:navigate:budget] or [ACTION:navigate:expenses] or [ACTION:navigate:explore] or [ACTION:navigate:packages] or [ACTION:navigate:profile]

TRIP & ITINERARY COMMANDS:
- Build/Generate trip: [ACTION:generate_trip:DestinationName:NumDays] (e.g. [ACTION:generate_trip:Manali:4])
- Add spot to itinerary: [ACTION:add_spot:DayNumber:SpotTitle:CostAmount:Category] (e.g. [ACTION:add_spot:2:Baga Beach:500:Activities])
- Remove spot: [ACTION:remove_spot:SpotTitle] (e.g. [ACTION:remove_spot:Fort Aguada])
- Set stay tier: [ACTION:set_tier:Economy] or [ACTION:set_tier:Standard] or [ACTION:set_tier:Luxury]
- Set travelers: [ACTION:set_travelers:4]
- Set days: [ACTION:set_days:5]

BUDGET & EXPENSES COMMANDS:
- Set target trip budget: [ACTION:set_budget:50000]
- Set category budget allocation: [ACTION:override_category_budget:Food:10000]
- Add actual expense: [ACTION:add_expense:Description:Amount:Category:PaidBy] (e.g. [ACTION:add_expense:Seafood Dinner:1500:Food & Dining:Rahul])
- Add group member: [ACTION:add_group_member:Rahul]

SAVED TRIPS & PACKAGES COMMANDS:
- Save trip to passport: [ACTION:save_trip]
- Open saved trips/passports modal: [ACTION:open_saved_trips]
- Add package to compare: [ACTION:compare_package:pkg_id:Provider:Name:Price]

4. Be enthusiastic, energetic, and practical. Use bullet points and clear formatting.`

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
