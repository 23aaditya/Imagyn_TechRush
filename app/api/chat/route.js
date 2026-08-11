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
    const { messages, userApiKey, tripState } = await request.json()

    // Determine API Key dynamically
    const apiKey = getEffectiveApiKey(userApiKey)

    if (!apiKey) {
      return NextResponse.json(
        { error: "NO_API_KEY", message: "Gemini API key is missing or not configured in .env.local." },
        { status: 400 }
      )
    }

    // Format current live trip state for Gemini context awareness
    let liveTripContextStr = "NO ACTIVE ITINERARY PLANNED YET."
    if (tripState && (tripState.destination || (tripState.itinerary && tripState.itinerary.length > 0))) {
      const dest = tripState.destination || "Unspecified"
      const days = tripState.days || 3
      const travelers = tripState.travelers || 2
      const stayTier = tripState.stayTier || "Standard"
      const targetBudget = tripState.targetBudget ? `₹${tripState.targetBudget.toLocaleString()}` : "Not set"
      
      let spotsSummary = ""
      if (tripState.itinerary && tripState.itinerary.length > 0) {
        spotsSummary = tripState.itinerary
          .map((day) => `Day ${day.day}: ${day.activities.map((a) => `"${a.title}" (Cost: ${a.cost || '₹0'}, Cat: ${a.category || 'Activities'}, Lat: ${a.lat || 'N/A'}, Lng: ${a.lng || 'N/A'})`).join("; ")}`)
          .join("\n")
      } else {
        spotsSummary = "No spots added yet."
      }

      liveTripContextStr = `ACTIVE DESTINATION: ${dest}
DURATION: ${days} Days | TRAVELERS: ${travelers} | STAY TIER: ${stayTier}
TARGET BUDGET: ${targetBudget}

CURRENT ITINERARY SPOTS & COORDINATES:
${spotsSummary}`
    }

    // Format Stay context for Gemini
    let stayContextStr = "NO STAY / HOTEL SET YET."
    if (tripState && tripState.activeStay) {
      const stay = tripState.activeStay
      stayContextStr = `ACTIVE STAY: "${stay.name || 'Hotel'}" at (${stay.lat || 'N/A'}, ${stay.lng || 'N/A'}) — ${stay.address || 'No address'}`
    }

    const systemInstruction = `You are Boots, the friendly monkey travel assistant from TripNest! 🐒
Your goal is to provide GPT-level descriptive, accurate, and deeply analytical travel advice, AND directly execute website commands for the user.

USER'S LIVE TRIP STATE & DATA NODES:
------------------------------------
${liveTripContextStr}

${stayContextStr}
------------------------------------

GUIDELINES FOR BOT RESPONSES:
1. ALWAYS start your response with a clear category header on line 1, e.g. **[Category: 🗓️ Day Plan]** or **[Category: ⚡ Website Command]** or **[Category: 📍 Map & Attractions]** or **[Category: 💰 Budget & Expenses Analysis]**.
2. When the user asks to PLAN a multi-day trip (e.g. "Plan a 3 day trip to Bali from Oct 1 to Oct 4 Luxury"), confirm warmly and output a preview card tag:
   [ACTION:plan_trip_preview:Destination:Days:Tier:StartDate:EndDate]
3. When the user asks to SHUFFLE, REORDER, or SWAP spots (e.g. "Swap day 1 spot 2 with day 2 spot 1"), output:
   [ACTION:swap_spots:Day1Num:Spot1Idx:Day2Num:Spot2Idx]
4. When the user asks for GOOD CAFES OR ATTRACTIONS near a specific landmark or spot (e.g. "cafes near Fort Aguada"), inspect the coordinates of the spot in the live trip state, recommend 3 specific real cafes/spots with pricing and photos, and include [ACTION:add_spot:DayNum:SpotName:CostAmount:Category:Lat:Lng] tags for 1-click addition.
5. When the user asks BUDGET OPTIMIZATION questions (e.g. "I think I am spending too much on food, how can I spend more on experiences without going over budget?"), analyze their live itinerary costs, category percentages, stay tier, target budget, and provide detailed step-by-step suggestions (including exact spot cost shifts or stay tier changes).
6. When user asks to ADD a spot, REMOVE a spot, CHANGE stay tier, SET budget, LOG expense, or SAVE trip, include the appropriate [ACTION:...] tag:
   - [ACTION:generate_trip:DestinationName:NumDays]
   - [ACTION:add_spot:DayNumber:SpotTitle:CostAmount:Category:Lat:Lng]
   - [ACTION:remove_spot:SpotTitle]
   - [ACTION:remove_day:DayNumber]
   - [ACTION:restore_day]
   - [ACTION:swap_days:Day1Num:Day2Num]
   - [ACTION:move_spot:SpotTitle:TargetDayNumber]
   - [ACTION:replace_spot:OldTitle:NewTitle:NewCost:Category]
   - [ACTION:undo]
   - [ACTION:set_tier:Economy|Standard|Luxury]
   - [ACTION:set_budget:Amount]
   - [ACTION:override_category_budget:Category:Amount]
   - [ACTION:add_expense:Description:Amount:Category:PaidBy]
   - [ACTION:save_trip]
   - [ACTION:navigate:itinerary|budget|expenses|explore|packages|profile]

7. GEOGRAPHIC INTELLIGENCE & MAP ACTIONS:
   When the user mentions their hotel/stay (e.g. "Set my stay to Hotel XYZ" or "I'm staying at Taj Vivanta"):
   [ACTION:set_stay:StayName:Latitude:Longitude:Address]

   When the user asks to FIND NEARBY places (e.g. "Show me cafes near my hotel", "Find restaurants nearby"):
   [ACTION:search_nearby:Category:RadiusInMeters]
   Categories: cafes, restaurants, attractions, hotels, activities, fuel, medical
   Default radius: 5000 (5km). Use 3000 for walking, 10000 for wider search.

   When the user asks to SWITCH map view:
   [ACTION:show_map_mode:discovery] or [ACTION:show_map_mode:itinerary]

   When the user asks to CHANGE discovery radius:
   [ACTION:set_discovery_radius:RadiusInMeters]

8. Be highly descriptive, energetic, engaging, and thorough in your answers.`

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
