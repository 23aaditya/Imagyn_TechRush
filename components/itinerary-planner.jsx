"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Compass,
  Clock,
  Coins,
  Bookmark,
  Sun,
  Camera,
  Coffee,
  Filter,
  Globe,
  Search,
  Trash2,
  MoveUp,
  MoveDown,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
  Hotel,
  UtensilsCrossed,
  Fuel,
  Stethoscope,
  Bot,
  Send,
  SlidersHorizontal,
  Star,
  Layers,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import destinationsData from "@/destinations_105.json"

// Expanded Preset Coordinates & Spot Data for Major Cities
const citySpotTemplates = {
  "Goa": [
    { title: "Artjuna Cafe Anjuna", type: "Food", cost: "₹450", open: "08:00 AM - 10:00 PM", desc: "Organic smoothies and bakery.", lat: 15.5866, lng: 73.7431, img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=80" },
    { title: "Fort Aguada Lighthouse", type: "Sightseeing", cost: "₹200", open: "09:30 AM - 06:00 PM", desc: "17th-century Portuguese fortress view.", lat: 15.4925, lng: 73.7737, isPopular: true, img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&auto=format&fit=crop&q=80" },
    { title: "Baga & Calangute Water Sports", type: "Relaxation", cost: "₹1,800", open: "10:00 AM - 07:00 PM", desc: "Parasailing, banana boat, jet ski.", lat: 15.5553, lng: 73.7517, isPopular: true, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80" },
    { title: "Thalassa Vagator Sunset", type: "Sunset", cost: "₹1,200", open: "05:00 PM - 01:00 AM", desc: "Cliffside Greek vibe dining.", lat: 15.6028, lng: 73.7348, isPopular: true, img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80" },
    { title: "Latin Quarter Fontainhas Walk", type: "Culture", cost: "₹300", open: "09:00 AM - 06:30 PM", desc: "Pastel Portuguese heritage homes.", lat: 15.4989, lng: 73.8278, img: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=500&auto=format&fit=crop&q=80" }
  ],
  "Bali": [
    { title: "Tegalalang Rice Terraces", type: "Nature", cost: "₹1,200", open: "07:00 AM - 06:00 PM", desc: "Lush terraced views & jungle swing.", lat: -8.4312, lng: 115.2809, isPopular: true, img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&auto=format&fit=crop&q=80" },
    { title: "Ubud Monkey Forest", type: "Culture", cost: "₹650", open: "09:00 AM - 06:00 PM", desc: "Ancient mossy temple ruins.", lat: -8.5194, lng: 115.2606, isPopular: true, img: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=500&auto=format&fit=crop&q=80" },
    { title: "Uluwatu Cliffside Kecak Dance", type: "Show", cost: "₹1,400", open: "05:00 PM - 07:30 PM", desc: "Hypnotic ocean sunset fire dance.", lat: -8.8291, lng: 115.0849, isPopular: true, img: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=500&auto=format&fit=crop&q=80" }
  ],
  "Kerala": [
    { title: "Alleppey Houseboat Backwater Cruise", type: "Cruise", cost: "₹3,500", open: "08:00 AM - 06:00 PM", desc: "Serene lagoon navigation with fresh seafood.", lat: 9.4981, lng: 76.3388, isPopular: true, img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&auto=format&fit=crop&q=80" },
    { title: "Munnar Tea Gardens Tour", type: "Nature", cost: "₹500", open: "09:00 AM - 05:00 PM", desc: "Rolling green misty hills & tea processing.", lat: 10.0889, lng: 77.0595, img: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=500&auto=format&fit=crop&q=80" },
    { title: "Varkala Cliff Beach Sunset", type: "Sunset", cost: "₹400", open: "04:00 PM - 10:00 PM", desc: "Red sandstone cliffs over Arabian sea.", lat: 8.7379, lng: 76.7163, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80" }
  ],
  "Jaipur": [
    { title: "Amber Fort & Elephant Ride", type: "Sightseeing", cost: "₹600", open: "08:00 AM - 05:30 PM", desc: "Hilltop sandstone fortress & mirror palace.", lat: 26.9855, lng: 75.8513, isPopular: true, img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&auto=format&fit=crop&q=80" },
    { title: "Hawa Mahal Window View", type: "Culture", cost: "₹200", open: "09:00 AM - 05:00 PM", desc: "Pink honeycomb facade with 953 windows.", lat: 26.9239, lng: 75.8267, img: "https://images.unsplash.com/photo-1603201667141-5a2d4c673378?w=500&auto=format&fit=crop&q=80" },
    { title: "Nahargarh Fort Sunset Point", type: "Sunset", cost: "₹300", open: "10:00 AM - 10:00 PM", desc: "Panoramic Pink City view at dusk.", lat: 26.9378, lng: 75.8155, isPopular: true, img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&auto=format&fit=crop&q=80" }
  ],
  "Manali": [
    { title: "Solang Valley Snow Sports", type: "Adventure", cost: "₹2,200", open: "09:00 AM - 05:00 PM", desc: "Zorbing, paragliding, and skiing slopes.", lat: 32.3166, lng: 77.1575, isPopular: true, img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=500&auto=format&fit=crop&q=80" },
    { title: "Hadimba Temple Cedar Grove", type: "Culture", cost: "₹100", open: "08:00 AM - 06:00 PM", desc: "16th century wooden pagoda temple.", lat: 32.2483, lng: 77.1806, img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&auto=format&fit=crop&q=80" },
    { title: "Old Manali Cafe Hop", type: "Food", cost: "₹800", open: "11:00 AM - 11:00 PM", desc: "Vibrant bohemian live music cafes.", lat: 32.2570, lng: 77.1830, img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80" }
  ]
}

// Simulated Nearby Places for Map Filters
const nearbyPlacesData = {
  hotels: [
    { name: "Taj Exotica Resort & Spa", type: "Hotel", lat: 15.5700, lng: 73.7500, rating: "4.9 ⭐" },
    { name: "Alila Diwa Oceanfront", type: "Resort", lat: 15.5000, lng: 73.7800, rating: "4.8 ⭐" }
  ],
  cafes: [
    { name: "Eva Cafe Anjuna", type: "Cafe", lat: 15.5900, lng: 73.7400, rating: "4.7 ⭐" },
    { name: "Baba Au Rhum Bakery", type: "Bakery", lat: 15.5750, lng: 73.7550, rating: "4.6 ⭐" }
  ],
  restaurants: [
    { name: "Fisherman's Wharf", type: "Seafood", lat: 15.5600, lng: 73.7600, rating: "4.8 ⭐" },
    { name: "Gunpowder Assagao", type: "South Indian", lat: 15.5950, lng: 73.7650, rating: "4.7 ⭐" }
  ],
  petrol_pumps: [
    { name: "Indian Oil Fuel Station Anjuna", type: "Fuel", lat: 15.5800, lng: 73.7480, rating: "4.5 ⭐" },
    { name: "HP Petrol Pump Mapusa", type: "Fuel", lat: 15.5950, lng: 73.8100, rating: "4.4 ⭐" }
  ],
  medicals: [
    { name: "Apollo Pharmacy Baga", type: "Pharmacy", lat: 15.5560, lng: 73.7530, rating: "4.9 ⭐" },
    { name: "Goa Medicos 24x7", type: "Hospital", lat: 15.5000, lng: 73.8200, rating: "4.8 ⭐" }
  ]
}

export function ItineraryPlanner({ onBack, onNavigateView }) {
  // Main Workspace State
  const [destination, setDestination] = useState("Goa")
  const [startDate, setStartDate] = useState("2026-08-15")
  const [endDate, setEndDate] = useState("2026-08-17")
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [days, setDays] = useState(3)
  const [travelStyle, setTravelStyle] = useState("Balanced")
  const [budgetTier, setBudgetTier] = useState("Moderate")
  const [isGenerating, setIsGenerating] = useState(false)
  const [itinerary, setItinerary] = useState([])
  const [activeDayIndex, setActiveDayIndex] = useState(0)
  const [saved, setSaved] = useState(false)

  // Hover image index map per spot ID
  const [spotImageIndices, setSpotImageIndices] = useState({})
  const hoverTimersRef = useRef({})

  // Map & Preference state
  const [isMapVisible, setIsMapVisible] = useState(false)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [nearbyCategory, setNearbyCategory] = useState(null)
  const mapContainerRef = useRef(null)
  const leafletMapRef = useRef(null)
  const mapMarkersRef = useRef([])

  // Search & Auto-Suggest State
  const [searchQuery, setSearchQuery] = useState("")
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [miniGoogleOpen, setMiniGoogleOpen] = useState(false)
  const [miniGoogleResults, setMiniGoogleResults] = useState([])

  // Bot State
  const [botOpen, setBotOpen] = useState(false)
  const [botMessages, setBotMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm your AI Itinerary Copilot. Tell me to add/remove spots or click 'Audit Schedule' for smart suggestions!"
    }
  ])
  const [botInput, setBotInput] = useState("")
  const [botSuggestion, setBotSuggestion] = useState(null)

  // Auto-calculate Days from Date Range
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.max(0, end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      if (diffDays > 0 && diffDays <= 14) {
        setDays(diffDays)
      }
    }
  }, [startDate, endDate])

  // Build Itinerary Helper
  const buildItineraryData = (cityName, totalDays, startStr) => {
    // Find matching city templates or fallback to generic
    const cleanKey = Object.keys(citySpotTemplates).find((k) =>
      cityName.toLowerCase().includes(k.toLowerCase())
    ) || "Goa"
    const templates = citySpotTemplates[cleanKey] || citySpotTemplates["Goa"]

    const generated = []
    for (let d = 1; d <= totalDays; d++) {
      const currentDate = new Date(startStr || startDate)
      currentDate.setDate(currentDate.getDate() + (d - 1))
      const dateFormatted = currentDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
      })

      const dayActivities = templates.slice((d - 1) % templates.length, ((d - 1) % templates.length) + 3).map((spot, i) => ({
        id: `${cleanKey.toLowerCase()}-${d}-${i}-${Date.now()}`,
        time: i === 0 ? "09:00 AM" : i === 1 ? "01:30 PM" : "06:00 PM",
        openingHours: spot.open || "08:00 AM - 08:00 PM",
        type: spot.type || "Sightseeing",
        title: spot.title,
        desc: spot.desc,
        cost: spot.cost,
        lat: spot.lat + (Math.random() - 0.5) * 0.02,
        lng: spot.lng + (Math.random() - 0.5) * 0.02,
        isPopular: spot.isPopular || false,
        distanceToNext: i < 2 ? `${(3 + i * 2.5).toFixed(1)} km • ${10 + i * 8} mins travel` : undefined,
        images: [
          spot.img,
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&auto=format&fit=crop&q=80"
        ]
      }))

      generated.push({
        day: d,
        date: dateFormatted,
        title: `Day ${d}: ${cityName} Exploration & Culture`,
        activities: dayActivities
      })
    }
    return generated
  }

  // Initial Itinerary Load
  useEffect(() => {
    const initialPlan = buildItineraryData("Goa", 3, "2026-08-15")
    setItinerary(initialPlan)
    checkWeekendOptimization(initialPlan)
  }, [])

  // Handle Search Input Change -> Auto Suggestions from 105 Destinations
  const handleSearchInputChange = (val) => {
    setSearchQuery(val)
    if (!val.trim()) {
      setSearchSuggestions([])
      setShowSearchDropdown(false)
      return
    }

    const query = val.toLowerCase()
    const matches = destinationsData
      .filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.subtitle?.toLowerCase().includes(query) ||
          item.country?.toLowerCase().includes(query) ||
          item.vibe?.toLowerCase().includes(query)
      )
      .slice(0, 5)

    setSearchSuggestions(matches)
    setShowSearchDropdown(true)
  }

  // Select Destination from Search Suggestion
  const handleSelectSearchDestination = (dest) => {
    setDestination(dest.name)
    setSearchQuery("")
    setShowSearchDropdown(false)
    setIsGenerating(true)

    setTimeout(() => {
      setIsGenerating(false)
      const newPlan = buildItineraryData(dest.name, days, startDate)
      setItinerary(newPlan)
      setActiveDayIndex(0)
      checkWeekendOptimization(newPlan)
    }, 500)
  }

  // Hover image slider logic
  const handleSpotMouseEnter = (spotId, imageCount) => {
    if (hoverTimersRef.current[spotId]) clearInterval(hoverTimersRef.current[spotId])
    hoverTimersRef.current[spotId] = setInterval(() => {
      setSpotImageIndices((prev) => ({
        ...prev,
        [spotId]: ((prev[spotId] || 0) + 1) % imageCount
      }))
    }, 900)
  }

  const handleSpotMouseLeave = (spotId) => {
    if (hoverTimersRef.current[spotId]) {
      clearInterval(hoverTimersRef.current[spotId])
      delete hoverTimersRef.current[spotId]
    }
  }

  // Generate Itinerary Action
  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      const newPlan = buildItineraryData(destination, days, startDate)
      setItinerary(newPlan)
      setActiveDayIndex(0)
      setPreferencesOpen(false)
      checkWeekendOptimization(newPlan)
    }, 600)
  }

  // Weekend Schedule Optimization Audit
  const checkWeekendOptimization = (currentItinerary) => {
    for (const dayPlan of currentItinerary) {
      const isWeekend = dayPlan.date.includes("Sat") || dayPlan.date.includes("Sun")
      if (isWeekend) {
        const popularSpot = dayPlan.activities.find((a) => a.isPopular)
        if (popularSpot) {
          setBotSuggestion({
            day: dayPlan.day,
            date: dayPlan.date,
            spotTitle: popularSpot.title,
            reason: `${popularSpot.title} is on ${dayPlan.date} (Weekend). High crowd expected!`
          })
          return
        }
      }
    }
    setBotSuggestion(null)
  }

  // Leaflet Map Rendering Effect
  useEffect(() => {
    if (!isMapVisible || !mapContainerRef.current) return

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link")
      link.id = "leaflet-css"
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)
    }

    const initMap = () => {
      if (!window.L) return

      if (!leafletMapRef.current) {
        const map = window.L.map(mapContainerRef.current).setView([15.55, 73.75], 11)
        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map)
        leafletMapRef.current = map
      }

      const map = leafletMapRef.current
      map.invalidateSize()

      mapMarkersRef.current.forEach((m) => map.removeLayer(m))
      mapMarkersRef.current = []

      const currentDay = itinerary[activeDayIndex]
      if (!currentDay || !currentDay.activities.length) return

      const coords = []
      currentDay.activities.forEach((act, idx) => {
        if (act.lat && act.lng) {
          coords.push([act.lat, act.lng])

          const customHtml = `
            <div class="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-lg border-2 border-white transform hover:scale-110 transition-transform">
              ${idx + 1}
            </div>
          `
          const customIcon = window.L.divIcon({
            html: customHtml,
            className: "custom-leaflet-marker",
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          })

          const marker = window.L.marker([act.lat, act.lng], { icon: customIcon }).addTo(map)
          marker.bindPopup(`
            <div style="font-family: sans-serif; padding: 4px;">
              <strong style="font-size: 13px; color: #0f172a;">#${idx + 1} ${act.title}</strong>
              <p style="margin: 4px 0; font-size: 11px; color: #64748b;">🕒 ${act.time}</p>
              <p style="margin: 0; font-size: 11px; color: #10b981; font-weight: 600;">Price: ${act.cost}</p>
            </div>
          `)
          mapMarkersRef.current.push(marker)
        }
      })

      // Nearby pins
      if (nearbyCategory && nearbyPlacesData[nearbyCategory]) {
        nearbyPlacesData[nearbyCategory].forEach((p) => {
          const redIconHtml = `
            <div class="flex items-center justify-center h-6 w-6 rounded-full bg-rose-500 text-white font-bold text-[10px] shadow-md border-2 border-white animate-pulse">
              📍
            </div>
          `
          const redIcon = window.L.divIcon({
            html: redIconHtml,
            className: "nearby-leaflet-marker",
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })
          const nearMarker = window.L.marker([p.lat, p.lng], { icon: redIcon }).addTo(map)
          nearMarker.bindPopup(`
            <div style="font-family: sans-serif; padding: 4px;">
              <strong style="color: #e11d48;">${p.name}</strong>
              <p style="margin: 2px 0; font-size: 11px;">${p.type} • ${p.rating}</p>
            </div>
          `)
          mapMarkersRef.current.push(nearMarker)
        })
      }

      if (coords.length > 1) {
        const polyline = window.L.polyline(coords, {
          color: "#3b82f6",
          weight: 4,
          dashArray: "8, 8",
          opacity: 0.85
        }).addTo(map)
        mapMarkersRef.current.push(polyline)
        map.fitBounds(polyline.getBounds(), { padding: [40, 40] })
      } else if (coords.length === 1) {
        map.setView(coords[0], 12)
      }
    }

    if (!window.L) {
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = initMap
      document.body.appendChild(script)
    } else {
      initMap()
    }
  }, [isMapVisible, activeDayIndex, itinerary, nearbyCategory])

  // Reorder Spot
  const moveSpot = (dayIdx, spotIdx, dir) => {
    const updated = [...itinerary]
    const list = [...updated[dayIdx].activities]
    const target = spotIdx + dir
    if (target >= 0 && target < list.length) {
      const temp = list[spotIdx]
      list[spotIdx] = list[target]
      list[target] = temp
      updated[dayIdx].activities = list
      setItinerary(updated)
    }
  }

  // Remove Spot
  const removeSpot = (dayIdx, spotIdx) => {
    const updated = [...itinerary]
    updated[dayIdx].activities.splice(spotIdx, 1)
    setItinerary(updated)
  }

  // Mini Google Search Submission
  const handleGoogleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setShowSearchDropdown(false)
    setMiniGoogleOpen(true)
    setMiniGoogleResults([
      {
        title: `${searchQuery} - Top Travel Spot & Reviews`,
        url: `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`,
        snippet: `Explore opening hours, entry prices, reviews, local tips, and photos for ${searchQuery}.`,
        rating: "4.8 ⭐ (1,840 reviews)",
        img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&auto=format&fit=crop&q=80"
      },
      {
        title: `Best Guided Experiences in ${searchQuery}`,
        url: `https://www.google.com/search?q=${encodeURIComponent(searchQuery + " tour")}`,
        snippet: `Verified local tours, skip-the-line passes, and sightseeing routes for ${searchQuery}.`,
        rating: "4.9 ⭐ (920 reviews)",
        img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&auto=format&fit=crop&q=80"
      }
    ])
  }

  // Add Searched Spot
  const addSearchedPlaceToItinerary = (placeName) => {
    const updated = [...itinerary]
    const current = updated[activeDayIndex] || updated[0]
    if (!current) return

    current.activities.push({
      id: `custom-${Date.now()}`,
      time: "04:00 PM",
      openingHours: "09:00 AM - 07:00 PM",
      type: "Spot",
      title: placeName,
      desc: `Added via Search for ${destination}. High traveler rating spot.`,
      cost: "₹500",
      lat: 15.54 + Math.random() * 0.04,
      lng: 73.75 + Math.random() * 0.04,
      isPopular: false,
      images: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&auto=format&fit=crop&q=80"
      ]
    })
    setItinerary(updated)
    setMiniGoogleOpen(false)
    setSearchQuery("")
  }

  // Bot Submission Handler
  const handleBotSubmit = (e) => {
    e.preventDefault()
    if (!botInput.trim()) return

    const input = botInput
    setBotMessages((prev) => [...prev, { sender: "user", text: input }])
    setBotInput("")

    setTimeout(() => {
      let reply = "Updated itinerary based on your request!"
      const lower = input.toLowerCase()

      if (lower.includes("add")) {
        const spotName = input.replace(/add/i, "").replace(/to day \d+/i, "").trim() || "Attraction"
        addSearchedPlaceToItinerary(spotName)
        reply = `✅ Added "${spotName}" to Day ${activeDayIndex + 1}.`
      } else if (lower.includes("remove") || lower.includes("delete")) {
        if (itinerary[activeDayIndex]?.activities.length) {
          const name = itinerary[activeDayIndex].activities[0].title
          removeSpot(activeDayIndex, 0)
          reply = `🗑️ Removed "${name}" from Day ${activeDayIndex + 1}.`
        }
      } else if (lower.includes("weekend") || lower.includes("audit") || lower.includes("suggest")) {
        reply = botSuggestion
          ? `💡 Suggestion: Move ${botSuggestion.spotTitle} on Day ${botSuggestion.day} to a weekday for shorter queues!`
          : "✅ Your current schedule is well balanced!"
      }

      setBotMessages((prev) => [...prev, { sender: "bot", text: reply }])
    }, 400)
  }

  const applyWeekendOptimization = () => {
    if (!botSuggestion) return
    const updated = [...itinerary]
    const targetIdx = botSuggestion.day - 1
    if (updated[targetIdx] && updated[0]) {
      const spot = updated[targetIdx].activities.find((a) => a.title === botSuggestion.spotTitle)
      if (spot) {
        updated[targetIdx].activities = updated[targetIdx].activities.filter((a) => a.title !== botSuggestion.spotTitle)
        updated[0].activities.push(spot)
        setItinerary(updated)
        setBotSuggestion(null)
        setBotMessages((prev) => [
          ...prev,
          { sender: "bot", text: `✨ Shifted ${spot.title} to Day 1 (Weekday) to avoid weekend rushes!` }
        ])
      }
    }
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 relative overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Navigation Top Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="rounded-xl border-border bg-background hover:bg-accent text-xs sm:text-sm"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Overview
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-foreground text-sm">Itinerary Planner Workspace</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBotOpen(!botOpen)}
              className="rounded-full border-primary/40 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary animate-pulse" />
              AI Copilot Assistant
            </Button>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Calendar className="h-3.5 w-3.5" />
              Itinerary Engine Active
            </span>
          </div>
        </div>

        {/* Title Header & Live Search Bar with Auto-Suggestions (Req 2) */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Design Your Personalized Itinerary
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              Search popular destinations, pick calendar dates, drag to reorder spots & view live map routes.
            </p>
          </div>

          {/* Search Bar with Live Auto-Suggestions from 105 Destinations (Req 2) */}
          <div className="relative min-w-[290px] sm:min-w-[360px]">
            <form onSubmit={handleGoogleSearchSubmit} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search popular destinations (e.g., Bali, Kyoto)..."
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                className="w-full rounded-2xl border border-border bg-card pl-10 pr-24 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-xl bg-primary text-[11px] font-semibold px-3 py-1 text-primary-foreground shadow"
              >
                Search
              </Button>
            </form>

            {/* Live Auto-Suggestions Dropdown on Search (Req 2) */}
            {showSearchDropdown && searchSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-border bg-card shadow-2xl p-2 space-y-1 max-h-72 overflow-y-auto"
              >
                <div className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Popular Destination Matches ({searchSuggestions.length})
                </div>
                {searchSuggestions.map((dest) => (
                  <div
                    key={dest.id}
                    onClick={() => handleSelectSearchDestination(dest)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="h-10 w-10 rounded-lg object-cover border"
                      />
                      <div>
                        <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          {dest.name}
                          <span className="text-[10px] font-medium text-muted-foreground">({dest.country})</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{dest.subtitle} • {dest.vibe}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                        {dest.startingBudget}
                      </span>
                      <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5 justify-end">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {dest.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Smart Weekend Optimization Alert Banner (Req 3) */}
        {botSuggestion && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex flex-wrap items-center justify-between gap-3 text-amber-700 dark:text-amber-300 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
              <div className="text-xs">
                <span className="font-bold">Smart Weekend Alert:</span> {botSuggestion.reason}
              </div>
            </div>
            <Button
              size="sm"
              onClick={applyWeekendOptimization}
              className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 shadow"
            >
              Shift to Weekday
            </Button>
          </motion.div>
        )}

        {/* Main Grid: Form Controls + Swipeable Itinerary Timeline */}
        <div className="grid gap-8 lg:grid-cols-12 mb-16">

          {/* Left Panel: Map View OR Preferences Form */}
          {isMapVisible ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-6 flex flex-col space-y-4"
            >
              <div className="rounded-3xl border border-border bg-card p-4 shadow-xl flex flex-col h-[580px] relative overflow-hidden">
                
                {/* Map Filter Chips (Req 7) */}
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 z-10 bg-background/80 backdrop-blur-md p-2.5 rounded-2xl border border-border/60">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Filter className="h-3.5 w-3.5 text-primary" />
                    See Nearby:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { key: "hotels", label: "Hotels", icon: Hotel },
                      { key: "cafes", label: "Cafes", icon: Coffee },
                      { key: "restaurants", label: "Restaurants", icon: UtensilsCrossed },
                      { key: "petrol_pumps", label: "Fuel", icon: Fuel },
                      { key: "medicals", label: "Medicals", icon: Stethoscope }
                    ].map((cat) => {
                      const IconC = cat.icon
                      const isActive = nearbyCategory === cat.key
                      return (
                        <button
                          key={cat.key}
                          type="button"
                          onClick={() => setNearbyCategory(isActive ? null : cat.key)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-colors border ${
                            isActive
                              ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                              : "bg-card border-border text-muted-foreground hover:bg-accent"
                          }`}
                        >
                          <IconC className="h-3 w-3" />
                          {cat.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Leaflet Map */}
                <div ref={mapContainerRef} className="flex-1 w-full rounded-2xl overflow-hidden shadow-inner z-0" />
              </div>
            </motion.div>
          ) : (
            <div className="lg:col-span-4">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary" />
                    Trip Parameters
                  </h3>
                  <span className="text-xs text-muted-foreground">Config</span>
                </div>

                {/* Destination Dropdown */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Select Destination
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value)
                      handleGenerate()
                    }}
                    className="w-full rounded-xl border border-border bg-background p-3 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {destinationsData.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.country})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Calendar Range Selection (Req 1) */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Travel Dates ({days} Days)
                  </label>
                  <div
                    onClick={() => setCalendarOpen(!calendarOpen)}
                    className="flex items-center justify-between rounded-xl border border-border bg-background p-3 text-xs font-semibold text-foreground cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      {startDate} → {endDate}
                    </span>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {days} Days
                    </span>
                  </div>

                  {calendarOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 p-4 rounded-2xl border border-border bg-background shadow-xl space-y-3"
                    >
                      <div className="flex justify-between items-center text-xs font-bold text-foreground">
                        <span>Calendar Range Picker</span>
                        <Button variant="ghost" size="sm" onClick={() => setCalendarOpen(false)} className="h-6 w-6 p-0">
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-muted-foreground uppercase font-semibold">Start Date</span>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-border bg-card p-2 text-xs text-foreground outline-none"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-foreground uppercase font-semibold">End Date</span>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-border bg-card p-2 text-xs text-foreground outline-none"
                          />
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => {
                          setCalendarOpen(false)
                          handleGenerate()
                        }}
                        className="w-full rounded-xl bg-primary text-xs font-semibold text-primary-foreground py-1.5"
                      >
                        Confirm Range
                      </Button>
                    </motion.div>
                  )}
                </div>

                {/* Travel Style */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Pace & Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Relaxed", "Balanced", "Packed"].map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setTravelStyle(style)}
                        className={`rounded-xl border p-2.5 text-xs font-medium transition-all ${
                          travelStyle === style
                            ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                            : "border-border text-muted-foreground hover:border-border/80"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Tier */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Budget Tier
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Backpacker", tier: "Budget" },
                      { label: "Standard", tier: "Moderate" },
                      { label: "Luxury", tier: "Luxury" }
                    ].map((b) => (
                      <button
                        key={b.tier}
                        type="button"
                        onClick={() => setBudgetTier(b.tier)}
                        className={`rounded-xl border p-2.5 text-xs font-medium transition-all ${
                          budgetTier === b.tier
                            ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                            : "border-border text-muted-foreground hover:border-border/80"
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Updating Schedule...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Generate Itinerary
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Right Column: Swipeable Itinerary Timeline (Req 1, 5, 6) */}
          <div className={`${isMapVisible ? "lg:col-span-6" : "lg:col-span-8"} space-y-6`}>

            {/* Trip Meta Card */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card p-5 shadow-md">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <MapPin className="h-4 w-4" />
                  {destination}
                </div>
                <h2 className="mt-1 text-xl sm:text-2xl font-bold font-heading text-foreground">
                  {days}-Day {travelStyle} Itinerary
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSaved(!saved)}
                  className={`rounded-xl ${saved ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : ""}`}
                >
                  <Bookmark className="mr-1.5 h-4 w-4" />
                  {saved ? "Saved" : "Save Trip"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigateView("budget")}
                  className="rounded-xl border-border hover:bg-accent"
                >
                  <Coins className="mr-1.5 h-4 w-4" />
                  Budget
                </Button>
              </div>
            </div>

            {/* Swipe Helper Banner & Day Tabs (Req 1) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {itinerary.map((dayPlan, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveDayIndex(idx)}
                      className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 ${
                        activeDayIndex === idx
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-secondary text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      Day {dayPlan.day}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={activeDayIndex === 0}
                    onClick={() => setActiveDayIndex((prev) => Math.max(0, prev - 1))}
                    className="rounded-xl h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={activeDayIndex === itinerary.length - 1}
                    onClick={() => setActiveDayIndex((prev) => Math.min(itinerary.length - 1, prev + 1))}
                    className="rounded-xl h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-[11px] text-center font-medium text-muted-foreground bg-accent/40 rounded-full py-1 px-3 flex items-center justify-center gap-1.5">
                <span>👈 Swipe card left or right on mobile/desktop to switch days 👉</span>
              </div>
            </div>

            {/* Swipeable Day Card Container (Req 1) */}
            <AnimatePresence mode="wait">
              {itinerary[activeDayIndex] && (
                <motion.div
                  key={activeDayIndex}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, info) => {
                    if (info.offset.x < -60 && activeDayIndex < itinerary.length - 1) {
                      setActiveDayIndex(activeDayIndex + 1)
                    } else if (info.offset.x > 60 && activeDayIndex > 0) {
                      setActiveDayIndex(activeDayIndex - 1)
                    }
                  }}
                  className="rounded-3xl border border-border bg-card p-6 shadow-md cursor-grab active:cursor-grabbing select-none"
                >
                  {/* Day Header */}
                  <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow">
                        D{itinerary[activeDayIndex].day}
                      </span>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-foreground">
                          Day {itinerary[activeDayIndex].day}: {itinerary[activeDayIndex].title}
                        </h3>
                        <span className="text-xs text-muted-foreground font-medium">
                          📅 {itinerary[activeDayIndex].date}
                        </span>
                      </div>
                    </div>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {itinerary[activeDayIndex].activities.length} Spots
                    </span>
                  </div>

                  {/* Spot Cards with Drag Handles, Timings & Hover Gallery (Req 1, 5) */}
                  <div className="space-y-6">
                    {itinerary[activeDayIndex].activities.map((act, idx) => {
                      const spotImages = act.images || [
                        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80"
                      ]
                      const activeImgIdx = spotImageIndices[act.id] || 0

                      return (
                        <div key={act.id || idx} className="relative">
                          
                          {/* Spot Card Box */}
                          <div
                            onMouseEnter={() => handleSpotMouseEnter(act.id, spotImages.length)}
                            onMouseLeave={() => handleSpotMouseLeave(act.id)}
                            className="group relative flex flex-col sm:flex-row items-stretch justify-between gap-4 rounded-2xl border border-border/70 bg-background/80 p-4 transition-all hover:border-primary/50 hover:bg-background hover:shadow-lg"
                          >
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              {/* Drag Reorder Handles (Req 1) */}
                              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                <button
                                  type="button"
                                  onClick={() => moveSpot(activeDayIndex, idx, -1)}
                                  disabled={idx === 0}
                                  className="hover:text-primary disabled:opacity-30 p-0.5"
                                >
                                  <MoveUp className="h-3.5 w-3.5" />
                                </button>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                                  {idx + 1}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => moveSpot(activeDayIndex, idx, 1)}
                                  disabled={idx === itinerary[activeDayIndex].activities.length - 1}
                                  className="hover:text-primary disabled:opacity-30 p-0.5"
                                >
                                  <MoveDown className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <h4 className="font-heading text-base font-semibold text-foreground">
                                    {act.title}
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => removeSpot(activeDayIndex, idx)}
                                    className="text-muted-foreground hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>

                                <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                  {act.desc}
                                </p>

                                {/* Timings & Operating Hours (Req 1) */}
                                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1 font-medium text-foreground">
                                    <Clock className="h-3.5 w-3.5 text-primary" />
                                    {act.time}
                                  </span>
                                  <span>•</span>
                                  <span className="text-[11px] font-medium text-muted-foreground">
                                    Open: {act.openingHours || "09:00 AM - 07:00 PM"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Right Side: Price Tag & Sliding Hover Gallery (Req 1) */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                              <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                {act.cost}
                              </span>

                              {/* Rectangular Hover Gallery (Req 1) */}
                              <div className="relative h-20 w-32 rounded-xl overflow-hidden border border-border shadow-sm group-hover:scale-105 transition-transform">
                                <img
                                  src={spotImages[activeImgIdx]}
                                  alt={act.title}
                                  className="h-full w-full object-cover transition-all duration-500"
                                />
                                {spotImages.length > 1 && (
                                  <div className="absolute bottom-1 right-1 flex gap-0.5 bg-black/60 px-1 py-0.5 rounded-full">
                                    {spotImages.map((_, imgI) => (
                                      <div
                                        key={imgI}
                                        className={`h-1 w-1 rounded-full ${
                                          activeImgIdx === imgI ? "bg-white" : "bg-white/40"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>

                          {/* Connecting Blue Line with Distance to Next Spot (Req 5) */}
                          {idx < itinerary[activeDayIndex].activities.length - 1 && (
                            <div className="my-2 ml-auto mr-12 flex items-center justify-end gap-2 pr-2">
                              <div className="h-6 w-0.5 bg-blue-500/60" />
                              <div className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                                📍 {act.distanceToNext || "3.5 km • 12 mins travel"}
                              </div>
                            </div>
                          )}

                        </div>
                      )
                    })}
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

        {/* BOTTOM SECTION: Popular Destinations Showcase (Req 2 feedback: Moved to Bottom) */}
        <div className="mt-16 border-t border-border/60 pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Compass className="h-4 w-4" />
                Explore Global Destinations
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mt-1">
                More Popular Places You Can Travel To
              </h3>
            </div>
            <span className="text-xs text-muted-foreground">Showing 105+ Handpicked Destinations</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {destinationsData.slice(0, 12).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setDestination(item.name)
                  const newPlan = buildItineraryData(item.name, days, startDate)
                  setItinerary(newPlan)
                  setActiveDayIndex(0)
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className="group flex flex-col rounded-2xl border border-border bg-card p-3 shadow-sm hover:border-primary/50 hover:shadow-md transition-all text-left cursor-pointer"
              >
                <div className="relative h-28 w-full rounded-xl overflow-hidden mb-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-semibold text-white flex items-center gap-0.5">
                    <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                    {item.rating}
                  </div>
                </div>
                <h4 className="font-heading text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                  {item.name}
                </h4>
                <span className="text-[10px] text-muted-foreground truncate">{item.subtitle}</span>
                <span className="mt-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {item.startingBudget}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Floating Bottom-Right Globe Icon Button (Req 4) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <Button
          onClick={() => {
            setIsMapVisible(!isMapVisible)
            if (!isMapVisible) setPreferencesOpen(false)
          }}
          className="rounded-full h-14 w-14 bg-primary text-primary-foreground shadow-2xl hover:scale-105 transition-transform flex items-center justify-center border-2 border-background"
        >
          <Globe className="h-7 w-7 animate-spin-slow" />
        </Button>

        {isMapVisible && (
          <Button
            onClick={() => setPreferencesOpen(!preferencesOpen)}
            className="rounded-full bg-card border border-border text-foreground text-xs font-bold px-4 py-3 shadow-xl hover:bg-accent"
          >
            <SlidersHorizontal className="mr-1.5 h-4 w-4 text-primary" />
            Plan Itinerary
          </Button>
        )}
      </div>

      {/* Mini Google Search Popup Modal (Req 2) */}
      {miniGoogleOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold font-heading text-primary">Google</span>
                <span className="text-xs text-muted-foreground">Search Results</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMiniGoogleOpen(false)}
                className="h-8 w-8 p-0 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {miniGoogleResults.map((res, i) => (
                <div key={i} className="rounded-2xl border border-border/60 p-4 bg-background/60 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-muted-foreground truncate block">{res.url}</span>
                      <h4 className="font-heading text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
                        {res.title}
                      </h4>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 shrink-0">{res.rating}</span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{res.snippet}</p>

                  <div className="pt-2 flex items-center justify-between">
                    <img src={res.img} alt="Thumbnail" className="h-12 w-20 object-cover rounded-lg border" />
                    <Button
                      size="sm"
                      onClick={() => addSearchedPlaceToItinerary(searchQuery)}
                      className="rounded-xl bg-primary text-xs font-semibold text-primary-foreground px-3 py-1"
                    >
                      + Add to Day {activeDayIndex + 1}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* AI Copilot Drawer (Req 3) */}
      {botOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-3xl border border-border bg-card shadow-2xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span className="font-bold text-xs text-foreground">AI Itinerary Copilot</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBotOpen(false)}
              className="h-6 w-6 p-0 rounded-full"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="h-52 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin text-xs">
            {botMessages.map((m, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-2xl ${
                  m.sender === "user"
                    ? "bg-primary text-primary-foreground ml-auto max-w-[85%]"
                    : "bg-secondary text-foreground mr-auto max-w-[85%]"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleBotSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Add Baga Beach to Day 1..."
              value={botInput}
              onChange={(e) => setBotInput(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
            />
            <Button type="submit" size="sm" className="rounded-xl bg-primary text-primary-foreground px-3">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </motion.div>
      )}

    </div>
  )
}
