import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const CITY_DATABASE = {
  lonavala: {
    name: "Lonavala & Khandala",
    state: "Maharashtra",
    placesCount: "6 to 9 top spots",
    estBudget: "₹4,500 - ₹8,500",
    bestTime: "July to March (Monsoons & Winter)",
    attractions: [
      "Tiger's Point (Tiger Leap viewpoint)",
      "Bhushi Dam & Waterfall cascades",
      "Karla & Bhaja Ancient Buddhist Caves",
      "Lion's Point Sunset View",
      "Pawna Lake camping & boating",
      "Rajmachi Fort & Valley view",
      "Sunil's Celebrity Wax Museum",
      "Duke's Nose Viewpoint"
    ],
    day1: "Tiger's Point, Bhushi Dam waterfalls, Karla Caves, and evening sunset at Lion's Point.",
    day2: "Pawna Lake boating & picnic, Rajmachi Fort viewpoint, and Lonavala Chikki shopping.",
    day3: "Sunil's Celebrity Wax Museum, Duke's Nose cliff viewpoint, and Khandala cafe lunch.",
    food: "Hot Vada Pav, Corn Bhajji at viewpoints, Chikki, and Walnut Fudge from Maganlal Chikki.",
    tip: "Rent a private cab or scooter at Lonavala railway station. Visit viewpoints early to beat weekend traffic from Mumbai & Pune."
  },
  agra: {
    name: "Agra",
    state: "Uttar Pradesh",
    placesCount: "5 to 7 heritage monuments",
    estBudget: "₹6,500 - ₹11,000",
    bestTime: "October to March",
    attractions: ["Taj Mahal", "Agra Fort", "Mehtab Bagh", "Fatehpur Sikri", "Baby Taj", "Sadar Bazaar"],
    day1: "Sunrise Taj Mahal visit, Agra Fort, and sunset at Mehtab Bagh.",
    day2: "Excursion to Fatehpur Sikri & Buland Darwaza, then Sadar Bazaar shopping.",
    day3: "Tomb of I'timād-ud-Daulah (Baby Taj), Akbar's Tomb at Sikandra, and Petha tasting tour.",
    food: "Agra Petha (Angoori & Kesar), Mughlai Biryani, Bedai with Aloo Sabzi.",
    tip: "Buy composite ticket for Taj Mahal & Agra Fort to save up to 20%."
  },
  jaipur: {
    name: "Jaipur",
    state: "Rajasthan",
    placesCount: "8 to 10 royal palaces & forts",
    estBudget: "₹8,500 - ₹15,000",
    bestTime: "October to March",
    attractions: ["Hawa Mahal", "Amer Fort", "City Palace", "Jantar Mantar", "Nahargarh Fort", "Chokhi Dhani", "Albert Hall Museum"],
    day1: "Hawa Mahal, City Palace, Jantar Mantar, and sunset at Nahargarh Fort.",
    day2: "Amer Fort & Sheesh Mahal, Panna Meena Stepwell, Jal Mahal, and Chokhi Dhani dinner.",
    day3: "Albert Hall State Museum, Jaigarh Fort (world's largest cannon), and Johari Bazaar shopping.",
    food: "Dal Baati Churma, Rawat Pyaz Kachori, Ghevar.",
    tip: "Purchase the Rajasthan state composite pass for ₹300 covering Amber Fort, Hawa Mahal & 6 other sites."
  },
  goa: {
    name: "Goa Coast",
    state: "Goa",
    placesCount: "8 to 12 beaches & heritage spots",
    estBudget: "₹12,000 - ₹22,000",
    bestTime: "November to February",
    attractions: ["Baga Beach", "Fort Aguada", "Dudhsagar Falls", "Fontainhas Latin Quarter", "Anjuna Flea Market"],
    day1: "North Goa beach watersports at Baga, Fort Aguada, and Tito's lane nightlife.",
    day2: "Fontainhas heritage walk in Panjim, Spice Plantation tour, and Miramar sunset.",
    day3: "South Goa heritage churches (Basilica of Bom Jesus) & Palolem Beach sunset.",
    food: "Goan Fish Curry Rice, Bebinca, Prawn Balchão.",
    tip: "Rent a scooter at ₹400/day for flexible travel between beaches."
  },
  kerala: {
    name: "Kerala Backwaters & Hills",
    state: "Kerala",
    placesCount: "6 to 8 serene locations",
    estBudget: "₹14,000 - ₹26,000",
    bestTime: "September to March",
    attractions: ["Alleppey Houseboats", "Munnar Tea Gardens", "Eravikulam National Park", "Marari Beach"],
    day1: "Alleppey backwaters houseboat cruise & local toddy shop lunch.",
    day2: "Munnar tea plantation walk, Tea Museum, and Kathakali cultural show.",
    day3: "Eravikulam National Park Nilgiri Tahr sighting and Marari peaceful beach sunset.",
    food: "Karimeen Pollichathu, Appam with Stew, Kerala Parotta.",
    tip: "Opt for daytime Shikara rides (₹400/hr) in Alleppey for budget savings over overnight houseboats."
  },
  manali: {
    name: "Manali",
    state: "Himachal Pradesh",
    placesCount: "6 to 8 mountain spots",
    estBudget: "₹10,500 - ₹18,000",
    bestTime: "October to June",
    attractions: ["Solang Valley", "Hadimba Temple", "Atal Tunnel & Sissu", "Old Manali Cafes", "Vashisht Hot Springs"],
    day1: "Hadimba Temple, Vashisht Hot Springs, Mall Road, and Old Manali cafe crawl.",
    day2: "Solang Valley adventure sports (paragliding/skiing) and Atal Tunnel visit.",
    day3: "Day excursion to Sissu Waterfall, Naggar Castle, and local Himachali Siddu tasting.",
    food: "Siddu (steamed bread), River Trout fish, Himalayan herbal tea.",
    tip: "Use HRTC electric buses for Solang & Atal Tunnel to avoid expensive private cab surcharges."
  },
  udaipur: {
    name: "Udaipur",
    state: "Rajasthan",
    placesCount: "6 to 8 lakeside attractions",
    estBudget: "₹9,500 - ₹17,000",
    bestTime: "September to March",
    attractions: ["City Palace", "Lake Pichola", "Jag Mandir", "Saheliyon Ki Bari", "Monsoon Palace"],
    day1: "City Palace tour, Lake Pichola boat ride, and Jagdish Temple.",
    day2: "Saheliyon Ki Bari, Bagore Ki Haveli cultural show, and sunset at Monsoon Palace.",
    day3: "Karni Mata Cable Car, Fateh Sagar Lake promenade, and Shilpgram artisan village.",
    food: "Dal Baati, Mirchi Bada, Kulhad Coffee.",
    tip: "Watch the sunset from Ambrai Ghat or public boat ferry for budget-friendly views."
  },
  coorg: {
    name: "Coorg (Kodagu)",
    state: "Karnataka",
    placesCount: "5 to 7 coffee estate spots",
    estBudget: "₹7,500 - ₹13,000",
    bestTime: "October to April",
    attractions: ["Abbey Falls", "Raja's Seat", "Namdroling Monastery (Golden Temple)", "Dubare Elephant Camp"],
    day1: "Golden Temple Bylakuppe, Dubare Elephant Camp, and Raja's Seat sunset.",
    day2: "Abbey Falls, Coffee Plantation estate tour, and Madikeri Fort.",
    day3: "Tadiandamol Peak viewpoint, Iruppu Waterfalls, and spice shopping.",
    food: "Pandi Curry (Coorgi Pork), Kadambuttu (steamed rice balls), Fresh Coffee.",
    tip: "Stay in a coffee plantation homestay for an authentic Kodava hospitality experience."
  },
  shimla: {
    name: "Shimla",
    state: "Himachal Pradesh",
    placesCount: "5 to 7 hill station spots",
    estBudget: "₹8,000 - ₹14,000",
    bestTime: "March to June & Dec to Jan",
    attractions: ["The Ridge & Mall Road", "Jakhoo Temple", "Kufri Snow World", "Christ Church"],
    day1: "The Ridge, Christ Church, Scandal Point, and Jakhoo Temple ropeway.",
    day2: "Day trip to Kufri for horse riding & snow sports, followed by Mall Road shopping.",
    day3: "Viceregal Lodge (Rashtrapati Nivas), Annandale Ground, and Mashobra nature walk.",
    food: "Himachali Dham, Chana Madra, Bakery items from Wake & Bake Cafe.",
    tip: "Walk along the pedestrian Mall Road; vehicles are restricted making it pleasant & safe."
  }
}

export async function POST(req) {
  try {
    const { message, itineraryContext } = await req.json()
    const msg = message || ""
    const msgLower = msg.toLowerCase().trim()

    // 1. Google Gemini API Integration
    const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (geminiKey && geminiKey.trim()) {
      const candidateModels = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-flash-latest"]
      
      for (const modelName of candidateModels) {
        try {
          const genAI = new GoogleGenerativeAI(geminiKey.trim())
          const model = genAI.getGenerativeModel({ model: modelName })

          const prompt = `You are TripNest AI, an expert travel guide and smart itinerary planner. Answer the user's question clearly in Markdown.
Always format currency in Indian Rupees (₹).
Context Destination: ${itineraryContext?.destination || "India"}.
Current Planned Budget: ₹${itineraryContext?.grandTotalBudget || 0}.

User Question: ${msg}`

          const result = await model.generateContent(prompt)
          const replyText = result.response.text()

          if (replyText && replyText.trim().length > 10) {
            return NextResponse.json({ reply: replyText, provider: "Google Gemini AI" })
          }
        } catch (geminiErr) {
          // If model quota or format error occurs, attempt next model or fallback
          console.warn(`Gemini model ${modelName} notice:`, geminiErr?.message || geminiErr)
        }
      }
    }

    // 2. Secondary Free AI Engine (Pollinations AI)
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 4500)

      const pollinationsRes = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are TripNest AI, an expert travel planner. Answer in Markdown, format budgets in Indian Rupees (₹), and be concise and helpful."
            },
            {
              role: "user",
              content: `Context Destination: ${itineraryContext?.destination || "India"}. User Question: ${msg}`
            }
          ],
          model: "openai"
        })
      })

      clearTimeout(timeoutId)

      if (pollinationsRes.ok) {
        const textReply = await pollinationsRes.text()
        if (textReply && textReply.trim().length > 15) {
          return NextResponse.json({ reply: textReply, provider: "TripNest AI Assistant" })
        }
      }
    } catch (e) {
      // Fallback to curated city database engine
    }

    // 3. Fallback: Curated City Database & Dynamic Engine
    let daysNum = 2
    const daysMatch = msgLower.match(/(\d+)\s*(day|days)/)
    if (daysMatch && daysMatch[1]) {
      daysNum = Number.parseInt(daysMatch[1])
    }

    let matchedCityKey = null
    for (const key of Object.keys(CITY_DATABASE)) {
      if (msgLower.includes(key)) {
        matchedCityKey = key
        break
      }
    }

    if (matchedCityKey) {
      const city = CITY_DATABASE[matchedCityKey]
      
      let itineraryDaysText = `• **Day 1**: ${city.day1}\n• **Day 2**: ${city.day2}`
      if (daysNum >= 3 && city.day3) {
        itineraryDaysText += `\n• **Day 3**: ${city.day3}`
      }
      if (daysNum >= 4) {
        itineraryDaysText += `\n• **Day 4+**: Buffer day for relaxed exploration, spa, shopping & departure.`
      }

      const reply = `📍 **Trip Plan & Sightseeing Guide for ${city.name} (${daysNum} Days)**:\n\n` +
        `✨ **How Many Places You Can Visit**: You can comfortably visit **${city.placesCount}** in ${daysNum} days without rushing.\n\n` +
        `🗓️ **Suggested ${daysNum}-Day Itinerary**:\n` +
        `${itineraryDaysText}\n\n` +
        `🏛️ **Must-Visit Attractions**: ${city.attractions.join(", ")}.\n\n` +
        `🍲 **Local Food Specialties**: ${city.food}\n\n` +
        `💰 **Estimated Budget**: ${city.estBudget} per person (${city.bestTime}).\n\n` +
        `💡 **Traveler Tip**: ${city.tip}`

      return NextResponse.json({ reply, provider: "TripNest Engine" })
    }

    // Dynamic fallback for unlisted locations
    let extractedLocationName = null
    const locPatterns = [/in\s+([a-zA-Z]+)/i, /for\s+([a-zA-Z]+)/i, /visit\s+([a-zA-Z]+)/i, /about\s+([a-zA-Z]+)/i]
    for (const pat of locPatterns) {
      const match = msg.match(pat)
      if (match && match[1] && match[1].length > 2) {
        const word = match[1].toLowerCase()
        if (!["the", "a", "an", "all", "days", "day", "places", "place", "many", "how", "best", "good", "trip"].includes(word)) {
          extractedLocationName = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase()
          break
        }
      }
    }

    const targetLoc = extractedLocationName || itineraryContext?.destination || "your destination"

    let dynamicItinerary = `• **Day 1**: Explore top historic monuments, central landmarks, and scenic viewpoints.\n` +
      `• **Day 2**: Visit lakes, natural trails, water sports, and local bazaars.`
    if (daysNum >= 3) {
      dynamicItinerary += `\n• **Day 3**: Discover hidden gems, traditional cultural shows, and sample regional food specialties.`
    }

    const reply = `📍 **Trip Plan & Sightseeing Guide for ${targetLoc} (${daysNum} Days)**:\n\n` +
      `✨ **How Many Places You Can Visit**: You can visit **5 to 8 major attractions** in ${targetLoc} over ${daysNum} days!\n\n` +
      `🗓️ **Recommended Schedule**:\n` +
      `${dynamicItinerary}\n\n` +
      `🍲 **Food & Dining**: Sample authentic regional street delicacies and popular local thalis.\n\n` +
      `💰 **Estimated Budget**: ₹6,000 - ₹12,000 per person.\n\n` +
      `💡 **Tip**: Hire a local cab or rental scooter for smooth travel between viewpoints.`

    return NextResponse.json({ reply, provider: "TripNest Engine" })
  } catch (error) {
    return NextResponse.json(
      { reply: "I am your AI Travel Assistant! Ask me any question about travel, destinations, budget, or itineraries!" },
      { status: 200 }
    )
  }
}
