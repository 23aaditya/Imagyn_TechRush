// Destination knowledge base for offline fallback & structured recommendations
export const DESTINATION_KNOWLEDGE = {
  kyoto: {
    name: "Kyoto, Japan",
    peakSeason: "March - April (Cherry Blossom) & October - November (Autumn Leaves)",
    peakMonths: ["March", "April", "October", "November"],
    offPeak: "June - August (Hot & Humid) & January - February (Cold)",
    crowdLevel: "Very High in Peak (95/100)",
    weatherSummary: "Mild spring/autumn, hot humid summer with rainy June.",
    dayPlans: {
      1: {
        theme: "Ancient Shrines & Bamboo Groves",
        morning: "Fushimi Inari Taisha (Arrive at 7:00 AM to beat peak crowds)",
        afternoon: "Kiyomizu-dera Temple & stroll down Sannenzaka slope",
        evening: "Gion District walking tour for traditional tea houses & geisha spots"
      }
    },
    proTips: [
      "Buy an ICOCA card for seamless transit on Kyoto buses & trains.",
      "Visit Fushimi Inari before 7:30 AM to experience the torii gates without heavy crowd bottlenecks.",
      "Reserve traditional Kaiseki dining at least 3 weeks in advance for peak season."
    ]
  },
  paris: {
    name: "Paris, France",
    peakSeason: "June - August (Summer Tourism) & December (Holiday Lights)",
    peakMonths: ["June", "July", "August", "December"],
    offPeak: "November - February (Cooler, damp, lower hotel rates)",
    crowdLevel: "High in Summer (90/100)",
    weatherSummary: "Pleasant spring/autumn, warm summer, mild rainy winter.",
    dayPlans: {
      1: {
        theme: "Iconic Landmarks & Seine River Cruise",
        morning: "Eiffel Tower summit & Trocadéro Gardens photo spot",
        afternoon: "Musée d'Orsay & stroll through Tuileries Garden",
        evening: "Sunset Seine River Cruise with dinner"
      }
    },
    proTips: [
      "Book Paris Museum Pass to skip ticket lines at over 50 locations.",
      "August is peak for tourists, but many local shops close for summer holidays.",
      "Take Metro Line 6 for the best scenic view of Eiffel Tower crossing the Seine."
    ]
  },
  bali: {
    name: "Bali, Indonesia",
    peakSeason: "July - August (Dry Season) & Mid-December to New Year",
    peakMonths: ["July", "August", "December"],
    offPeak: "October - March (Wet Season, quick tropical downpours)",
    crowdLevel: "High in Peak (85/100)",
    weatherSummary: "Tropical, 27°C - 31°C year-round. Dry from Apr-Oct.",
    dayPlans: {
      1: {
        theme: "Ubud Cultural Core & Rice Terraces",
        morning: "Tegallalang Rice Terraces & Sacred Monkey Forest Sanctuary",
        afternoon: "Ubud Art Market & Tirta Empul Holy Water Temple",
        evening: "Traditional Legong Dance Performance at Ubud Palace"
      }
    },
    proTips: [
      "Hire a private driver (approx $35-45/day) for hassle-free day trips.",
      "Shoulder season (April, May, September) offers dry weather with 30% lower villa prices.",
      "Always wear respectful temple attire (Sarong provided at entrance)."
    ]
  },
  tokyo: {
    name: "Tokyo, Japan",
    peakSeason: "March - April (Cherry Blossom) & September - November (Autumn)",
    peakMonths: ["March", "April", "September", "October", "November"],
    offPeak: "January - February & Rainy June",
    crowdLevel: "High (88/100)",
    weatherSummary: "Four distinct seasons, hot humid July-Aug, mild spring.",
    dayPlans: {
      1: {
        theme: "Futuristic Shinjuku & Youth Culture",
        morning: "Meiji Jingu Shrine & Harajuku Takeshita Street",
        afternoon: "Shibuya Crossing, Magnet rooftop & Shibuya Sky observatory",
        evening: "Shinjuku Omoide Yokocho (Memory Lane) izakaya hopping"
      }
    },
    proTips: [
      "Reserve teamLab Planets & Shibuya Sky tickets 30 days ahead.",
      "Suica/Pasmo digital card on Apple Wallet makes metro transit ultra fast.",
      "7-Eleven & Lawson offer chef-quality meals for budget travel days!"
    ]
  },
  iceland: {
    name: "Reykjavik & Golden Circle, Iceland",
    peakSeason: "June - August (Midnight Sun) & September - March (Northern Lights)",
    peakMonths: ["June", "July", "August", "September", "December", "February"],
    offPeak: "April & May (Shoulder season with shifting snow/rain)",
    crowdLevel: "Moderate to High in Summer (75/100)",
    weatherSummary: "Cool summers (12°C-15°C), cold winters (-2°C to 3°C).",
    dayPlans: {
      1: {
        theme: "Golden Circle Wonders",
        morning: "Thingvellir National Park (Tectonic Plates)",
        afternoon: "Strokkur Geysir & Gullfoss Waterfall",
        evening: "Geothermal bath at Secret Lagoon or Laugarvatn Fontana"
      }
    },
    proTips: [
      "Rent a 4x4 vehicle if traveling outside summer months.",
      "Pack windproof and waterproof outer layers regardless of season.",
      "Download Vedur & Aurora apps for real-time weather and Northern Lights alerts."
    ]
  }
}

// Extract location name dynamically from user query
function extractLocationName(prompt) {
  const words = prompt.replace(/[^\w\s]/gi, '').split(/\s+/)
  const stopWords = new Set(["suggest", "a", "day", "plan", "for", "in", "when", "is", "peak", "season", "the", "crowd", "weather", "best", "time", "to", "visit", "give", "me", "itinerary", "about", "what", "are", "top", "spots", "tips"])
  
  const potentialNames = words.filter(w => w.length > 2 && !stopWords.has(w.toLowerCase()))
  if (potentialNames.length > 0) {
    return potentialNames.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
  }
  return "Worldwide Destination"
}

// Generate smart fallback response based on user input for ANY global location
export function generateFallbackResponse(userPrompt) {
  const promptLower = userPrompt.toLowerCase()
  
  // Find matching pre-coded destination if available
  let matchedData = null
  for (const [key, data] of Object.entries(DESTINATION_KNOWLEDGE)) {
    if (promptLower.includes(key) || promptLower.includes(data.name.toLowerCase().split(',')[0])) {
      matchedData = data
      break
    }
  }

  const detectedLocation = matchedData ? matchedData.name : extractLocationName(userPrompt)

  // Case 1: Peak Season request
  if (promptLower.includes("peak") || promptLower.includes("season") || promptLower.includes("when to visit") || promptLower.includes("best time")) {
    if (matchedData) {
      return {
        text: `**[Category: ☀️ Peak Season & Weather]**\n\n` +
          `Here is the seasonal breakdown for **${matchedData.name}**:\n\n` +
          `• **Peak Season:** ${matchedData.peakSeason}\n` +
          `• **Off-Peak Months:** ${matchedData.offPeak}\n` +
          `• **Crowd Expectation:** ${matchedData.crowdLevel}\n` +
          `• **Weather Profile:** ${matchedData.weatherSummary}\n\n` +
          `**Pro Tip:** ${matchedData.proTips[1]}`,
        destinationCard: {
          title: matchedData.name,
          peakSeason: matchedData.peakSeason,
          crowdLevel: matchedData.crowdLevel,
          weatherSummary: matchedData.weatherSummary,
          tips: matchedData.proTips
        }
      }
    } else {
      return {
        text: `**[Category: ☀️ Peak Season & Weather]**\n\n` +
          `Here is the seasonal travel breakdown for **${detectedLocation}**:\n\n` +
          `• **Peak Season:** May - September (High tourism, pleasant weather, 100% hotel demand)\n` +
          `• **Shoulder Season:** April & October (20-30% lower prices, comfortable temperatures)\n` +
          `• **Off-Peak Season:** November - March (Budget rates, lowest crowd density)\n` +
          `• **Crowd Expectation:** High in Peak (80-90/100)\n\n` +
          `💡 **Pro Tip:** Enter your Gemini API key in the 🔑 header settings to get live AI season & weather forecasts for **${detectedLocation}**!`,
        destinationCard: {
          title: detectedLocation,
          peakSeason: "May - September (Peak) | Apr & Oct (Shoulder)",
          crowdLevel: "85/100 (High in Peak)",
          weatherSummary: "Varies by season; shoulder months offer ideal sightseeing weather.",
          tips: ["Book accommodation 6-8 weeks ahead", "Visit major landmarks before 9:00 AM"]
        }
      }
    }
  }

  // Case 2: Day Plan request
  if (promptLower.includes("day") || promptLower.includes("plan") || promptLower.includes("itinerary") || promptLower.includes("schedule")) {
    if (matchedData) {
      const plan = matchedData.dayPlans[1]
      return {
        text: `**[Category: 🗓️ Day Plan]**\n\n` +
          `Here is an optimized **Day 1 Itinerary** for **${matchedData.name}**:\n\n` +
          `🌅 **Morning:** ${plan.morning}\n\n` +
          `☀️ **Afternoon:** ${plan.afternoon}\n\n` +
          `🌙 **Evening:** ${plan.evening}\n\n` +
          `💡 **Peak Season Strategy:** Arrive early at morning spots to beat tour buses!`,
        dayPlanCard: {
          destination: matchedData.name,
          dayNumber: 1,
          theme: plan.theme,
          morning: plan.morning,
          afternoon: plan.afternoon,
          evening: plan.evening
        }
      }
    } else {
      return {
        text: `**[Category: 🗓️ Day Plan]**\n\n` +
          `Here is a custom **Day 1 Itinerary** for **${detectedLocation}**:\n\n` +
          `🌅 **Morning (8:00 AM - 11:30 AM):** Top historical landmark & central square walk before tour crowds arrive.\n\n` +
          `☀️ **Afternoon (12:30 PM - 4:30 PM):** Local museum, scenic viewpoint, and local marketplace lunch.\n\n` +
          `🌙 **Evening (6:00 PM - 9:30 PM):** Sunset rooftop view followed by traditional local dinner district.\n\n` +
          `💡 **Traveler Tip:** Save your Gemini API key in 🔑 settings for instant multi-day customized plans for **${detectedLocation}**!`,
        dayPlanCard: {
          destination: detectedLocation,
          dayNumber: 1,
          theme: `Exploring Highlights of ${detectedLocation}`,
          morning: "Historic landmarks & morning city center walking tour",
          afternoon: "Museum & scenic viewpoint with local food tasting",
          evening: "Sunset rooftop bar & traditional evening dining"
        }
      }
    }
  }

  // Case 3: Default response for any location
  return {
    text: `**[Category: 🌐 Worldwide Travel Intelligence]**\n\n` +
      `I can generate travel itineraries, peak season dates, and crowd advice for **${detectedLocation}** or any city worldwide!\n\n` +
      `• 🗓️ Ask: *"Suggest a day plan for ${detectedLocation}"*\n` +
      `• ☀️ Ask: *"When is peak season for ${detectedLocation}?"*\n` +
      `• 👥 Ask: *"How to avoid crowds in ${detectedLocation}?"*\n\n` +
      `💡 Make sure your Gemini API key is entered in [.env.local](file:///c:/projects/techrush/Imagyn_TechRush/.env.local) or the 🔑 header settings for AI responses for any destination!`,
  }
}
