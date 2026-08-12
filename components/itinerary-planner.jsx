"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import dynamic from "next/dynamic"
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
  Plus,
  CheckSquare,
  FileText,
  Check,
  GripVertical,
  Wallet
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTrip } from "@/context/trip-context"
import destinationsData from "@/destinations_105.json"

// Dynamic import of Leaflet Map component with SSR disabled
const TripMap = dynamic(() => import("./map").then((mod) => mod.default || mod.TripMap || mod), { ssr: false })

// Destination Attractions Database for Related Attractions
const destinationAttractionsDB = {
  "Goa": [
    { name: "Mandovi Beach & Watersports", cost: "₹2,000", rating: "4.8 ⭐", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80", desc: "Parasailing, jet skiing & sunset beach shacks." },
    { name: "Fort Aguada & Lighthouse", cost: "₹200", rating: "4.7 ⭐", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&auto=format&fit=crop&q=80", desc: "17th-century Portuguese fortress battlements." },
    { name: "Dudhsagar Waterfalls Trek", cost: "₹1,500", rating: "4.9 ⭐", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=80", desc: "4-tiered milky cascade inside sanctuary." },
    { name: "Fontainhas Heritage Walk", cost: "₹300", rating: "4.8 ⭐", img: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=500&auto=format&fit=crop&q=80", desc: "Pastel Portuguese villas & art galleries." }
  ],
  "Bali": [
    { name: "Tegalalang Rice Terraces & Swing", cost: "₹1,200", rating: "4.9 ⭐", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&auto=format&fit=crop&q=80", desc: "Lush terraced views & jungle swings." },
    { name: "Uluwatu Cliff Temple & Kecak Dance", cost: "₹1,400", rating: "4.8 ⭐", img: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=500&auto=format&fit=crop&q=80", desc: "Sunset performance against ocean waves." },
    { name: "Sacred Ubud Monkey Forest", cost: "₹650", rating: "4.7 ⭐", img: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=500&auto=format&fit=crop&q=80", desc: "Mossy ancient temple ruins & macaques." }
  ],
  "Jaipur": [
    { name: "Amber Fort & Sheesh Mahal", cost: "₹500", rating: "4.9 ⭐", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&auto=format&fit=crop&q=80", desc: "Grand hilltop fortress with mirror palace & elephant rides." },
    { name: "Hawa Mahal (Palace of Winds)", cost: "₹200", rating: "4.8 ⭐", img: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=500&auto=format&fit=crop&q=80", desc: "Honeycomb pink sandstone facade with 953 ornate windows." },
    { name: "City Palace & Peacock Courtyard", cost: "₹700", rating: "4.8 ⭐", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&auto=format&fit=crop&q=80", desc: "Royal residence featuring courtyards, museums, and armor." },
    { name: "Nahargarh Fort Sunset View", cost: "₹200", rating: "4.9 ⭐", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&auto=format&fit=crop&q=80", desc: "Panoramic sunset vistas over the Pink City skyline." }
  ]
}

// Preset Spots Data for Itinerary Generation
// Preset Spots Data for Itinerary Generation (Rich pool of unique attractions)
const citySpotTemplates = {
  "Goa": [
    { title: "Artjuna Cafe Anjuna", type: "Food", cost: "₹450", open: "08:00 AM - 10:00 PM", desc: "Organic smoothies, wood-fired pizza & serene courtyard bakery.", lat: 15.5866, lng: 73.7431, img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80" },
    { title: "Fort Aguada Lighthouse", type: "Sightseeing", cost: "₹200", open: "09:30 AM - 06:00 PM", desc: "17th-century Portuguese ocean fortress battlements & lighthouse.", lat: 15.4925, lng: 73.7737, isPopular: true, img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80" },
    { title: "Baga & Calangute Water Sports", type: "Relaxation", cost: "₹1,800", open: "10:00 AM - 07:00 PM", desc: "Parasailing, jet skis, banana boats & lively beach shacks.", lat: 15.5553, lng: 73.7517, isPopular: true, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80" },
    { title: "Thalassa Vagator Sunset", type: "Sunset", cost: "₹1,200", open: "05:00 PM - 01:00 AM", desc: "Cliffside Greek vibe dining overlooking Vagator beach sunset.", lat: 15.6028, lng: 73.7348, isPopular: true, img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80" },
    { title: "Fontainhas Latin Quarter Walk", type: "Culture", cost: "₹350", open: "08:00 AM - 07:00 PM", desc: "Pastel-colored Portuguese villas, heritage art galleries & bakeries.", lat: 15.4989, lng: 73.8322, isPopular: true, img: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&auto=format&fit=crop&q=80" },
    { title: "Dudhsagar Waterfalls & Jungle Jeep Trail", type: "Nature", cost: "₹1,600", open: "06:00 AM - 05:00 PM", desc: "4-tiered majestic cascade inside Bhagwan Mahavir Wildlife Sanctuary.", lat: 15.3144, lng: 74.3143, isPopular: true, img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80" },
    { title: "Anjuna Flea Market & Souvenir Bazaar", type: "Shopping", cost: "₹800", open: "09:00 AM - 08:00 PM", desc: "Handcrafted bohemian accessories, beachwear & spice stalls.", lat: 15.5800, lng: 73.7400, img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80" },
    { title: "Chapora Fort Cliff Viewpoint", type: "Sunset", cost: "₹100", open: "09:00 AM - 06:30 PM", desc: "Panoramic scenic coastal fortress views across Chapora river.", lat: 15.6056, lng: 73.7369, img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80" },
    { title: "Basilica of Bom Jesus Old Goa", type: "Culture", cost: "₹150", open: "09:00 AM - 06:30 PM", desc: "UNESCO World Heritage 16th-century baroque cathedral.", lat: 15.5009, lng: 73.9116, img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80" },
    { title: "Fisherman's Wharf Sal River Dining", type: "Food", cost: "₹950", open: "12:00 PM - 11:00 PM", desc: "Authentic Goan crab curry & fresh catches by the river.", lat: 15.5600, lng: 73.7600, img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80" },
    { title: "Palolem Beach Kayaking & Silent Disco", type: "Relaxation", cost: "₹1,100", open: "07:00 AM - 11:00 PM", desc: "Crescent-shaped serene beach kayaking & evening headphone party.", lat: 15.0100, lng: 74.0200, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80" },
    { title: "Sahakari Spice Farm Tour & Buffet Lunch", type: "Culture", cost: "₹600", open: "09:00 AM - 04:00 PM", desc: "Organic spice plantations tour with authentic traditional feast.", lat: 15.4200, lng: 74.0100, img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80" }
  ],
  "Bali": [
    { title: "Tegalalang Rice Terraces", type: "Nature", cost: "₹1,200", open: "07:00 AM - 06:00 PM", desc: "Lush terraced views & high jungle swing.", lat: -8.4312, lng: 115.2809, isPopular: true, img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80" },
    { title: "Sacred Ubud Monkey Forest", type: "Culture", cost: "₹650", open: "09:00 AM - 06:00 PM", desc: "Ancient mossy temple ruins and macaques.", lat: -8.5194, lng: 115.2606, isPopular: true, img: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&auto=format&fit=crop&q=80" },
    { title: "Uluwatu Cliff Temple & Kecak Dance", type: "Show", cost: "₹1,400", open: "05:00 PM - 07:30 PM", desc: "Hypnotic ocean sunset fire dance performance.", lat: -8.8291, lng: 115.0849, isPopular: true, img: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&auto=format&fit=crop&q=80" },
    { title: "Tanah Lot Sea Temple Sunset", type: "Sunset", cost: "₹850", open: "07:00 AM - 07:00 PM", desc: "Offshore rock formation sea temple with breaking waves.", lat: -8.6212, lng: 115.0868, isPopular: true, img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80" },
    { title: "Mount Batur Sunrise Trek", type: "Nature", cost: "₹2,200", open: "03:30 AM - 10:00 AM", desc: "Early morning crater trek with cloud inversion views.", lat: -8.2422, lng: 115.3756, img: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&auto=format&fit=crop&q=80" },
    { title: "Seminyak Beach Lounge & Cocktails", type: "Food", cost: "₹1,600", open: "11:00 AM - 01:00 AM", desc: "Sunset beanbags, live DJs & organic smoothie bowls.", lat: -8.6892, lng: 115.1581, img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80" },
    { title: "Campuhan Ridge Walk Ubud", type: "Relaxation", cost: "₹300", open: "06:00 AM - 06:30 PM", desc: "Scenic lush valley ridge walking trail.", lat: -8.5034, lng: 115.2546, img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80" },
    { title: "Tirta Empul Holy Water Temple", type: "Culture", cost: "₹500", open: "08:00 AM - 06:00 PM", desc: "Balinese Hindu water temple purification springs.", lat: -8.4152, lng: 115.3155, img: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&auto=format&fit=crop&q=80" },
    { title: "Jimbaran Bay Candlelight Seafood", type: "Food", cost: "₹1,800", open: "05:30 PM - 11:00 PM", desc: "Oceanfront grilled snapper dining under night stars.", lat: -8.7712, lng: 115.1689, img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80" }
  ],
  "Jaipur": [
    { title: "Amber Fort & Sheesh Mahal", type: "Sightseeing", cost: "₹500", open: "08:00 AM - 05:30 PM", desc: "Grand hilltop fortress with mirror palace & elephant rides.", lat: 26.9855, lng: 75.8513, isPopular: true, img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80" },
    { title: "Hawa Mahal (Palace of Winds)", type: "Culture", cost: "₹200", open: "09:00 AM - 05:00 PM", desc: "Honeycomb pink sandstone facade with 953 ornate windows.", lat: 26.9239, lng: 75.8267, isPopular: true, img: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=80" },
    { title: "Laxmi Mishthan Bhandar (LMB) Feast", type: "Food", cost: "₹650", open: "08:00 AM - 10:30 PM", desc: "Famous authentic Ghewar, Pyaz Kachori, and Rajasthani sweets.", lat: 26.9220, lng: 75.8250, img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80" },
    { title: "City Palace & Pritam Niwas Chowk", type: "Sightseeing", cost: "₹700", open: "09:30 AM - 05:00 PM", desc: "Royal residence featuring peacock gate courtyards & museum.", lat: 26.9258, lng: 75.8237, isPopular: true, img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80" },
    { title: "Nahargarh Fort Sunset & Padao Lounge", type: "Sunset", cost: "₹200", open: "10:00 AM - 10:00 PM", desc: "Panoramic sunset vistas over the Pink City skyline.", lat: 26.9378, lng: 75.8156, isPopular: true, img: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=80" },
    { title: "Jantar Mantar UNESCO Observatory", type: "Culture", cost: "₹300", open: "09:00 AM - 04:30 PM", desc: "18th-century astronomical instruments & world's largest sundial.", lat: 26.9248, lng: 75.8246, img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80" },
    { title: "Johari Bazaar & Bapu Bazaar Walk", type: "Shopping", cost: "₹1,200", open: "10:30 AM - 09:00 PM", desc: "Traditional Kundan jewelry, Bandhani sarees, Mojris & crafts.", lat: 26.9200, lng: 75.8230, img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80" },
    { title: "Jal Mahal Lake View Walk", type: "Relaxation", cost: "₹100", open: "06:00 AM - 09:00 PM", desc: "Palace floating in Man Sagar Lake surrounded by Aravalli hills.", lat: 26.9534, lng: 75.8462, img: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=80" },
    { title: "Chokhi Dhani Ethnic Resort & Dinner", type: "Food", cost: "₹1,100", open: "05:00 PM - 11:00 PM", desc: "Folk dances, puppet shows, camel rides & authentic Royal Thali.", lat: 26.7725, lng: 75.8340, isPopular: true, img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80" },
    { title: "Patrika Gate Colorful Photo Stop", type: "Culture", cost: "₹50", open: "06:00 AM - 09:00 PM", desc: "Vibrant architectural pavilion painted with Rajasthan history murals.", lat: 26.8378, lng: 75.8055, img: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=80" }
  ],
  "Kerala": [
    { title: "Alleppey Houseboat Backwater Cruise", type: "Relaxation", cost: "₹2,500", open: "08:00 AM - 06:00 PM", desc: "Glide through tranquil palm-fringed backwaters & canals.", lat: 9.4981, lng: 76.3388, isPopular: true, img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80" },
    { title: "Munnar Tea Gardens & Tata Museum", type: "Nature", cost: "₹350", open: "09:00 AM - 05:00 PM", desc: "Rolling emerald hill estates & tea processing heritage.", lat: 10.0889, lng: 77.0595, isPopular: true, img: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&auto=format&fit=crop&q=80" },
    { title: "Fort Kochi Chinese Fishing Nets & Heritage", type: "Culture", cost: "₹150", open: "07:00 AM - 07:00 PM", desc: "Colonial Dutch villas, spice warehouses & cantilevered nets.", lat: 9.9656, lng: 76.2421, isPopular: true, img: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&auto=format&fit=crop&q=80" },
    { title: "Varkala Cliff Sunset & Beach Shacks", type: "Sunset", cost: "₹600", open: "06:00 AM - 10:00 PM", desc: "Dramatic red cliffs overlooking Arabian Sea waves.", lat: 8.7379, lng: 76.7163, isPopular: true, img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80" }
  ],
  "Manali": [
    { title: "Solang Valley Snow Sports & Zip Line", type: "Nature", cost: "₹1,800", open: "09:00 AM - 05:00 PM", desc: "Paragliding, snow zorbing, quad biking & valley views.", lat: 32.3166, lng: 77.1578, isPopular: true, img: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=600&auto=format&fit=crop&q=80" },
    { title: "Hadimba Temple Cedar Forest Walk", type: "Culture", cost: "₹100", open: "08:00 AM - 06:00 PM", desc: "Pagoda-style wooden shrine nestled inside giant Dhungri pines.", lat: 32.2483, lng: 77.1802, isPopular: true, img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80" },
    { title: "Old Manali Cafe Trail & Live Music", type: "Food", cost: "₹750", open: "10:00 AM - 11:00 PM", desc: "Cozy riverside cafes, trout delicacies & bohemian acoustic vibes.", lat: 32.2530, lng: 77.1830, isPopular: true, img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80" },
    { title: "Atal Tunnel & Sissu Valley Drive", type: "Sightseeing", cost: "₹1,500", open: "06:00 AM - 06:00 PM", desc: "9km high-altitude engineering marvel connecting to Lahaul waterfalls.", lat: 32.3550, lng: 77.1320, isPopular: true, img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80" }
  ]
}

// Coordinate map lookup for destinations
const cityCoords = {
  "Goa": { lat: 15.55, lng: 73.75 },
  "Bali": { lat: -8.43, lng: 115.28 },
  "Kerala": { lat: 9.93, lng: 76.26 },
  "Jaipur": { lat: 26.91, lng: 75.78 },
  "Manali": { lat: 32.24, lng: 77.18 },
  "Santorini": { lat: 36.39, lng: 25.46 },
  "Switzerland": { lat: 46.52, lng: 7.98 },
  "Maldives": { lat: 3.20, lng: 73.22 },
  "Ladakh": { lat: 34.15, lng: 77.57 },
  "Rishikesh": { lat: 30.08, lng: 78.26 },
  "Tokyo": { lat: 35.67, lng: 139.65 },
  "Amsterdam": { lat: 52.36, lng: 4.90 },
  "Rome": { lat: 41.90, lng: 12.49 },
  "Singapore": { lat: 1.35, lng: 103.81 },
  "Barcelona": { lat: 41.38, lng: 2.17 },
  "Paris": { lat: 48.85, lng: 2.35 },
  "Iceland": { lat: 64.14, lng: -21.94 },
  "New Zealand": { lat: -45.03, lng: 168.66 },
  "Shimla": { lat: 31.10, lng: 77.17 },
  "Udaipur": { lat: 24.58, lng: 73.68 },
  "Dubai": { lat: 25.20, lng: 55.27 },
  "Thailand": { lat: 7.88, lng: 98.39 },
  "Vietnam": { lat: 20.97, lng: 107.04 },
}

// Build Itinerary Helper (Guarantees NO repeating places across days)
const buildItineraryData = (cityName, totalDays, startStr) => {
  const matchedDest = destinationsData.find(d =>
    d.name.toLowerCase() === cityName.toLowerCase() ||
    cityName.toLowerCase().includes(d.name.toLowerCase()) ||
    d.name.toLowerCase().includes(cityName.toLowerCase())
  )

  const cleanKey = Object.keys(citySpotTemplates).find((k) =>
    cityName.toLowerCase().includes(k.toLowerCase())
  )
  let availableSpotsPool = cleanKey ? [...citySpotTemplates[cleanKey]] : []

  const destInfo = matchedDest || {
    name: cityName.charAt(0).toUpperCase() + cityName.slice(1),
    country: "India",
    startingBudget: "₹850",
    vibe: "Historic & Cultural",
    type: "Sightseeing",
    description: `Historic landmarks, culture, food, and scenic highlights of ${cityName}.`,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"
  }

  if (availableSpotsPool.length === 0) {
    const baseLat = cityCoords[destInfo.name]?.lat || cityCoords[cityName]?.lat || (destInfo.country === "India" ? 20.0 : 35.0)
    const baseLng = cityCoords[destInfo.name]?.lng || cityCoords[cityName]?.lng || (destInfo.country === "India" ? 78.0 : 10.0)
    const img = destInfo.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"

    availableSpotsPool = [
      { title: `${destInfo.name} Historic Old Town & Heritage Tour`, type: "Sightseeing", cost: destInfo.startingBudget || "₹850", open: "08:30 AM - 06:00 PM", desc: `Explore historic landmarks, heritage architecture, and famous highlights of ${destInfo.name}.`, lat: baseLat + 0.01, lng: baseLng + 0.01, isPopular: true, img: img },
      { title: `${destInfo.specialty || destInfo.vibe || "Local Heritage"} Experience`, type: destInfo.type === "Beach" ? "Relaxation" : destInfo.type === "Mountains" ? "Nature" : "Culture", cost: "₹1,200", open: "09:00 AM - 07:00 PM", desc: `Immerse in ${destInfo.name}'s signature vibe: ${destInfo.description}`, lat: baseLat - 0.01, lng: baseLng + 0.02, isPopular: true, img: img },
      { title: `Authentic ${destInfo.name} Food & Dining Trail`, type: "Food", cost: "₹750", open: "12:00 PM - 11:00 PM", desc: `Savor authentic local cuisines, food markets, and popular restaurants in ${destInfo.name}.`, lat: baseLat + 0.02, lng: baseLng - 0.01, isPopular: false, img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80" },
      { title: `${destInfo.name} Golden Hour Sunset Viewpoint`, type: "Sunset", cost: "₹400", open: "04:30 PM - 08:30 PM", desc: `Enjoy scenic panoramic views and evening strolls at ${destInfo.subtitle || destInfo.name}.`, lat: baseLat - 0.02, lng: baseLng - 0.02, isPopular: true, img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80" },
      { title: `${destInfo.name} Artisan Market & Souvenir Bazaar`, type: "Shopping", cost: "₹900", open: "10:00 AM - 09:00 PM", desc: "Discover handcrafted arts, textiles, souvenirs, and local treats.", lat: baseLat + 0.03, lng: baseLng + 0.01, isPopular: false, img: img },
      { title: `${destInfo.name} Panoramic Hillside Viewpoint Trek`, type: "Nature", cost: "₹500", open: "06:00 AM - 06:00 PM", desc: `Breathtaking sunrise and valley views across ${destInfo.name}.`, lat: baseLat - 0.03, lng: baseLng + 0.03, isPopular: true, img: img },
      { title: `${destInfo.name} Scenic Promenade & Central Square Walk`, type: "Relaxation", cost: "₹350", open: "07:00 AM - 10:00 PM", desc: "Relaxing promenade walk with street musicians and open-air cafes.", lat: baseLat + 0.015, lng: baseLng - 0.025, isPopular: false, img: img },
      { title: `${destInfo.name} Night Market & Evening Street Food Lounge`, type: "Food", cost: "₹1,100", open: "06:00 PM - 01:00 AM", desc: "Bustling night market with local culinary popups and vibrant atmosphere.", lat: baseLat - 0.015, lng: baseLng - 0.015, isPopular: true, img: img },
      { title: `${destInfo.name} Botanical Gardens & Eco Park Trail`, type: "Nature", cost: "₹450", open: "08:00 AM - 06:00 PM", desc: "Sprawling lush gardens featuring rare flora and tranquil paths.", lat: baseLat + 0.025, lng: baseLng - 0.03, isPopular: false, img: img },
      { title: `${destInfo.name} Cultural Museum & Fine Art Gallery`, type: "Culture", cost: "₹600", open: "09:30 AM - 05:30 PM", desc: "Vibrant exhibits celebrating regional history and heritage collections.", lat: baseLat - 0.025, lng: baseLng + 0.015, isPopular: true, img: img },
      { title: `${destInfo.name} Waterfront Sunset Cruise & Lounge`, type: "Sunset", cost: "₹1,500", open: "05:00 PM - 09:00 PM", desc: "Relaxing evening boat ride with music and scenic shoreline views.", lat: baseLat + 0.005, lng: baseLng - 0.035, isPopular: true, img: img },
      { title: `${destInfo.name} Heritage Craft Workshop & Bakery`, type: "Food", cost: "₹500", open: "08:00 AM - 08:00 PM", desc: "Traditional artisan baking and local sweet treats tasting session.", lat: baseLat - 0.005, lng: baseLng + 0.025, isPopular: false, img: img }
    ]
  }

  const usedTitles = new Set()
  const generated = []
  let poolIndex = 0

  for (let d = 1; d <= totalDays; d++) {
    const currentDate = new Date(startStr || startDate)
    currentDate.setDate(currentDate.getDate() + (d - 1))
    const dateFormatted = currentDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    })

    const dayActivities = []

    for (let i = 0; i < 3; i++) {
      let candidateSpot = null
      while (poolIndex < availableSpotsPool.length) {
        const spot = availableSpotsPool[poolIndex]
        poolIndex++
        if (!usedTitles.has(spot.title.toLowerCase())) {
          candidateSpot = spot
          break
        }
      }

      if (!candidateSpot) {
        const slotType = i === 0 ? "Morning Heritage Sight" : i === 1 ? "Afternoon Culinary & Craft Trail" : "Evening Sunset Spot"
        const genericTitle = `${cityName} Day ${d} ${slotType}`
        candidateSpot = {
          title: genericTitle,
          type: i === 0 ? "Sightseeing" : i === 1 ? "Food" : "Sunset",
          cost: i === 0 ? "₹600" : i === 1 ? "₹850" : "₹1,100",
          open: i === 0 ? "08:00 AM - 01:00 PM" : i === 1 ? "01:00 PM - 05:00 PM" : "05:00 PM - 11:00 PM",
          desc: `Curated ${slotType.toLowerCase()} spot in ${cityName}.`,
          lat: (cityCoords[cityName]?.lat || 15.55) + (Math.random() - 0.5) * 0.05,
          lng: (cityCoords[cityName]?.lng || 73.75) + (Math.random() - 0.5) * 0.05,
          img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"
        }
      }

      usedTitles.add(candidateSpot.title.toLowerCase())

      dayActivities.push({
        id: `${cityName.toLowerCase().replace(/\s+/g, '-')}-d${d}-s${i + 1}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        time: i === 0 ? "09:00 AM" : i === 1 ? "01:30 PM" : "06:00 PM",
        openingHours: candidateSpot.open || "08:00 AM - 08:00 PM",
        type: candidateSpot.type || "Sightseeing",
        title: candidateSpot.title,
        desc: candidateSpot.desc,
        cost: candidateSpot.cost,
        numericCost: parseInt(String(candidateSpot.cost).replace(/[^\d]/g, "")) || 600,
        lat: candidateSpot.lat,
        lng: candidateSpot.lng,
        isPopular: candidateSpot.isPopular || false,
        distanceToNext: i < 2 ? `${(3 + i * 2.5).toFixed(1)} km • ${10 + i * 8} mins travel` : undefined,
        images: [
          candidateSpot.img || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80"
        ]
      })
    }

    generated.push({
      day: d,
      date: dateFormatted,
      title: `Day ${d}: ${cityName} Exploration & Culture`,
      activities: dayActivities
    })
  }
  return generated
}

export function ItineraryPlanner({ onBack, onNavigateView }) {
  // Centralized Trip Context
  const {
    destination,
    setDestination,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    days,
    setDays,
    travelers,
    setTravelers,
    stayTier,
    setStayTier,
    customTargetBudget,
    setCustomTargetBudget,
    selectedPackage,
    packageBaseCost,
    additionalExpenses,
    estimatedTotalTripCost,
    clearSelectedPackage,
    itinerary,
    setItinerary,
    addSpotToItinerary,
    removeSpotFromItinerary,
    reorderDayActivities,
    updateSpotCostInItinerary,
    saveCurrentTrip
  } = useTrip()

  // Main Workspace State
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [travelStyle, setTravelStyle] = useState("Balanced")
  const [budgetTier, setBudgetTier] = useState("Moderate") // Moderate | Budget | Luxury | Custom
  const [customBudgetVal, setCustomBudgetVal] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeSpotDetail, setActiveSpotDetail] = useState(null)

  // Destination Planning Option State (Plan via Explore vs Add Customized Location Directly)
  const [destPlanningMode, setDestPlanningMode] = useState("explore") // 'explore' | 'custom'
  const [customDestInput, setCustomDestInput] = useState(destination || "")
  const [customSuggestions, setCustomSuggestions] = useState([])
  const [showCustomSuggestions, setShowCustomSuggestions] = useState(false)

  useEffect(() => {
    if (destination) {
      setCustomDestInput(destination)
    }
  }, [destination])

  const [activeDayIndex, setActiveDayIndex] = useState(0)
  const [saved, setSaved] = useState(false)

  // Option Bar (Preferences Panel) Visibility State: Default to hidden when itinerary exists
  const [showPreferences, setShowPreferences] = useState(!itinerary || itinerary.length === 0)

  // Derived Itinerary Financial Calculations for Live Budget & Expense Display
  const totalActivitiesExpense = useMemo(() => {
    if (!itinerary || !Array.isArray(itinerary)) return 0
    return itinerary.reduce((sum, day) => {
      if (!day.activities) return sum
      return sum + day.activities.reduce((dSum, act) => {
        const costNum = act.numericCost || parseInt(String(act.cost || "0").replace(/[^\d]/g, "")) || 0
        return dSum + costNum
      }, 0)
    }, 0)
  }, [itinerary])

  const categoryExpenseBreakdown = useMemo(() => {
    if (!itinerary || !Array.isArray(itinerary)) return {}
    const res = {}
    itinerary.forEach((day) => {
      (day.activities || []).forEach((act) => {
        const cat = act.category || (act.type === "Food" ? "Food & Dining" : act.type === "Shopping" ? "Shopping" : "Activities")
        const costNum = act.numericCost || parseInt(String(act.cost || "0").replace(/[^\d]/g, "")) || 0
        res[cat] = (res[cat] || 0) + costNum
      })
    })
    return res
  }, [itinerary])

  const totalSpotsCount = useMemo(() => {
    if (!itinerary || !Array.isArray(itinerary)) return 0
    return itinerary.reduce((sum, day) => sum + (day.activities?.length || 0), 0)
  }, [itinerary])

  // Sleek Add Custom Spot Modal State
  const [addSpotModalOpen, setAddSpotModalOpen] = useState(false)
  const [targetDayForCustomSpot, setTargetDayForCustomSpot] = useState(0)
  const [customSpotForm, setCustomSpotForm] = useState({
    title: "",
    type: "Sightseeing",
    category: "Activities",
    time: "02:30 PM",
    cost: "500",
    desc: "",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"
  })

  const handleAddCustomSpotSubmit = (e) => {
    e.preventDefault()
    if (!customSpotForm.title.trim()) return

    const numCost = parseInt(String(customSpotForm.cost).replace(/[^\d]/g, "")) || 500
    addSpotToItinerary(targetDayForCustomSpot, {
      title: customSpotForm.title.trim(),
      type: customSpotForm.type,
      category: customSpotForm.category || (customSpotForm.type === "Food" ? "Food & Dining" : "Activities"),
      time: customSpotForm.time || "02:30 PM",
      desc: customSpotForm.desc.trim() || `Custom added spot in ${destination || "your trip"}.`,
      cost: `₹${numCost.toLocaleString("en-IN")}`,
      numericCost: numCost,
      img: customSpotForm.img
    })

    setAddSpotModalOpen(false)
    setCustomSpotForm({
      title: "",
      type: "Sightseeing",
      category: "Activities",
      time: "02:30 PM",
      cost: "500",
      desc: "",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"
    })
  }

  // Bi-directional hover/click state
  const [hoveredSpotId, setHoveredSpotId] = useState(null)
  const spotRefs = useRef({})

  // Hover image index map per spot ID
  const [spotImageIndices, setSpotImageIndices] = useState({})
  const hoverTimersRef = useRef({})

  // MAP ACTIVATION STATE (Globe button toggles Map Mode on LEFT side)
  const [isMapVisible, setIsMapVisible] = useState(false)
  const [nearbyCategory, setNearbyCategory] = useState(null)

  // Search & Auto-Suggest & Mini Google Tab Widget State
  const [searchQuery, setSearchQuery] = useState("")
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [miniGoogleOpen, setMiniGoogleOpen] = useState(false)
  const [miniGoogleTabQuery, setMiniGoogleTabQuery] = useState("")
  const [activeGoogleTabUrl, setActiveGoogleTabUrl] = useState("https://www.google.com/search?q=top+attractions+in+goa&igu=1")

  // ITINERARY CHECKLIST STATE (Destination-Aware Presets)
  const [checklistOpen, setChecklistOpen] = useState(false)
  const [newChecklistItem, setNewChecklistItem] = useState("")
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, text: "Sunscreen SPF 50 & Beach Lotion 🧴", checked: false, category: "Goa Presets" },
    { id: 2, text: "Polarized Sunglasses & Beach Hat 👒", checked: true, category: "Goa Presets" },
    { id: 3, text: "Waterproof Phone Pouch & Flip Flops 🩴", checked: false, category: "Goa Presets" },
    { id: 4, text: "Passport / Government ID Proof 🪪", checked: true, category: "Essential Documents" },
    { id: 5, text: "10,000mAh Power Bank & Fast Charger ⚡", checked: true, category: "Electronics" },
    { id: 6, text: "Emergency Cash & Driving License 💳", checked: false, category: "Essential Documents" }
  ])

  // PERSONAL NOTES SCRATCHPAD STATE
  const [notesOpen, setNotesOpen] = useState(false)
  const [notesView, setNotesView] = useState("list") // "list" | "add"
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteText, setNewNoteText] = useState("")
  const [personalNotes, setPersonalNotes] = useState([
    { id: 101, title: "Scooter Rental Agency Contact", text: "Rahul Scooter Rental Anjuna: +91 98221 54321. Deposit ₹1000 + Driving License.", date: "Aug 14" },
    { id: 102, title: "Thalassa Sunset Table Reservation", text: "Booked cliffside table for Day 1 at 06:15 PM under name Aaditya.", date: "Aug 15" }
  ])

  // Drag and Drop Spot Reordering State
  const [draggedSpotIdx, setDraggedSpotIdx] = useState(null)
  const [dragOverSpotIdx, setDragOverSpotIdx] = useState(null)

  // Bot State
  const [botOpen, setBotOpen] = useState(false)
  const [botMessages, setBotMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm your AI Itinerary Copilot. Tell me to add, remove, or modify spots!"
    }
  ])
  const [botInput, setBotInput] = useState("")

  // Synchronize itinerary & load destination-aware checklist presets
  useEffect(() => {
    if (destination) {
      if (!itinerary || itinerary.length === 0) {
        const newPlan = buildItineraryData(destination, days, startDate)
        setItinerary(newPlan)
        setActiveDayIndex(0)
      }

      // Load destination-specific checklist items
      const destLower = destination.toLowerCase()
      let presets = []
      if (destLower.includes("goa") || destLower.includes("bali") || destLower.includes("maldives") || destLower.includes("kerala") || destLower.includes("thailand")) {
        presets = [
          { id: Date.now() + 1, text: "Sunscreen SPF 50 & Beach Lotion 🧴", checked: false, category: `${destination} Coastal` },
          { id: Date.now() + 2, text: "Polarized Sunglasses & Wide Straw Hat 👒", checked: true, category: `${destination} Coastal` },
          { id: Date.now() + 3, text: "Waterproof Phone Pouch & Flip Flops 🩴", checked: false, category: `${destination} Coastal` }
        ]
      } else if (destLower.includes("manali") || destLower.includes("ladakh") || destLower.includes("shimla") || destLower.includes("switzerland")) {
        presets = [
          { id: Date.now() + 1, text: "Heavy Puffer Jacket & Thermal Innerwear 🧥", checked: false, category: `${destination} Alpine` },
          { id: Date.now() + 2, text: "Waterproof Snow Boots & Woolen Socks 🥾", checked: true, category: `${destination} Alpine` },
          { id: Date.now() + 3, text: "Woolen Beanie, Gloves & Cold Lip Balm 🧤", checked: false, category: `${destination} Alpine` }
        ]
      } else {
        presets = [
          { id: Date.now() + 1, text: "Comfortable Heritage Walking Shoes 👟", checked: false, category: `${destination} Culture` },
          { id: Date.now() + 2, text: "Universal Power Adapter & Camera 📷", checked: true, category: `${destination} Culture` },
          { id: Date.now() + 3, text: "City Transit Card & Museum Passes 🎟️", checked: false, category: `${destination} Culture` }
        ]
      }

      setChecklistItems([
        ...presets,
        { id: Date.now() + 4, text: "Government ID / Passport Copies 🪪", checked: true, category: "Essentials" },
        { id: Date.now() + 5, text: "10,000mAh Power Bank & Charger ⚡", checked: true, category: "Electronics" },
        { id: Date.now() + 6, text: "Emergency Cash & Driving License 💳", checked: false, category: "Essentials" }
      ])
    } else {
      setItinerary([])
    }
  }, [destination])

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
      setShowPreferences(false)
    }, 500)
  }

  // Hover image slider logic
  const handleSpotMouseEnter = (spotId, imageCount) => {
    setHoveredSpotId(spotId)
    if (hoverTimersRef.current[spotId]) clearInterval(hoverTimersRef.current[spotId])
    hoverTimersRef.current[spotId] = setInterval(() => {
      setSpotImageIndices((prev) => ({
        ...prev,
        [spotId]: ((prev[spotId] || 0) + 1) % imageCount
      }))
    }, 900)
  }

  const handleSpotMouseLeave = (spotId) => {
    setHoveredSpotId(null)
    if (hoverTimersRef.current[spotId]) {
      clearInterval(hoverTimersRef.current[spotId])
      delete hoverTimersRef.current[spotId]
    }
  }

  // Handle Map Marker Click -> Scroll to Card
  const handleMapSpotClick = (spotId) => {
    if (spotRefs.current[spotId]) {
      spotRefs.current[spotId].scrollIntoView({ behavior: "smooth", block: "center" })
      setHoveredSpotId(spotId)
    }
  }

  // Generate Itinerary Action
  const handleGenerate = (destOverride) => {
    const targetDest = destOverride || (destPlanningMode === "custom" ? customDestInput.trim() : destination) || destination || "Goa"
    if (!targetDest) return

    setDestination(targetDest)
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      const newPlan = buildItineraryData(targetDest, days, startDate)
      setItinerary(newPlan)
      setActiveDayIndex(0)
      setShowPreferences(false)
    }, 600)
  }

  // Reorder Spot
  const moveSpot = (dayIdx, spotIdx, dir) => {
    if (!itinerary) return
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
    removeSpotFromItinerary(dayIdx, spotIdx)
  }

  // Direct Search Submission -> Generate Itinerary for Searched Destination
  const handleGoogleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    const queryClean = searchQuery.trim()
    const matched = destinationsData.find(
      (d) =>
        d.name.toLowerCase() === queryClean.toLowerCase() ||
        queryClean.toLowerCase().includes(d.name.toLowerCase()) ||
        d.name.toLowerCase().includes(queryClean.toLowerCase())
    )

    const targetDestinationName = matched ? matched.name : (queryClean.charAt(0).toUpperCase() + queryClean.slice(1))

    setDestination(targetDestinationName)
    setSearchQuery("")
    setShowSearchDropdown(false)
    setIsGenerating(true)

    setTimeout(() => {
      setIsGenerating(false)
      const newPlan = buildItineraryData(targetDestinationName, days, startDate)
      setItinerary(newPlan)
      setActiveDayIndex(0)
      setShowPreferences(false)
    }, 500)
  }

  // Add Searched Spot
  const addSearchedPlaceToItinerary = (placeName) => {
    addSpotToItinerary(activeDayIndex, {
      title: placeName,
      desc: `Added for ${destination}. High traveler rating.`,
      cost: "₹650",
      numericCost: 650
    })
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

      if (lower.includes("add") || lower.includes("put") || lower.includes("include") || lower.includes("place")) {
        let spotName = input
          .replace(/can\s+you\s+/i, "")
          .replace(/(?:please\s+)?(?:add|put|include|insert|schedule|place)\s+/i, "")
          .replace(/\s+(?:to|in|into|on)\s+(?:the\s+)?(?:plan|itinerary|trip|schedule).*/i, "")
          .replace(/\s+(?:on|to)\s+day\s*\d+.*/i, "")
          .replace(/["']/g, "")
          .trim() || "Attraction"

        let targetDayIdx = activeDayIndex
        const dayMatch = lower.match(/day\s*(\d+)/)
        if (dayMatch && dayMatch[1]) {
          targetDayIdx = Math.max(0, parseInt(dayMatch[1], 10) - 1)
        }

        const allSpots = (itinerary || []).flatMap((d) => d.activities || [])
        const existingSpot = allSpots.find(
          (s) => s.title.toLowerCase().includes(spotName.toLowerCase()) || spotName.toLowerCase().includes(s.title.toLowerCase())
        )

        if (existingSpot) {
          reply = `⚠️ "${existingSpot.title}" is already included in your itinerary on Day ${existingSpot.day || 1}!`
        } else {
          addSpotToItinerary(targetDayIdx, {
            title: spotName,
            desc: `Added via AI Copilot for ${destination || "your trip"}.`,
            cost: "₹650",
            numericCost: 650
          })
          reply = `✅ Added "${spotName}" to Day ${targetDayIdx + 1}!`
        }
      } else if (lower.includes("remove") || lower.includes("delete")) {
        if (itinerary && itinerary[activeDayIndex]?.activities.length) {
          const name = itinerary[activeDayIndex].activities[0].title
          removeSpot(activeDayIndex, 0)
          reply = `🗑️ Removed "${name}" from Day ${activeDayIndex + 1}.`
        }
      } else {
        reply = `I can help add or remove places! Try: "Add Eiffel Tower to Day 2"`
      }

      setBotMessages((prev) => [...prev, { sender: "bot", text: reply }])
    }, 400)
  }

  // Related Attractions for current destination (Dynamically populated for ALL 105 places)
  const getAttractionsForDestination = (destName) => {
    if (!destName) return []
    const cleanKey = Object.keys(destinationAttractionsDB).find((k) =>
      destName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(destName.toLowerCase())
    )
    if (cleanKey && destinationAttractionsDB[cleanKey]) {
      return destinationAttractionsDB[cleanKey]
    }

    const matched = destinationsData.find(d =>
      d.name.toLowerCase() === destName.toLowerCase() ||
      destName.toLowerCase().includes(d.name.toLowerCase()) ||
      d.name.toLowerCase().includes(destName.toLowerCase())
    )

    const name = matched?.name || destName
    const img = matched?.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80"
    const budget = matched?.startingBudget || "₹850"
    const rating = matched?.rating ? `${matched.rating} ⭐` : "4.8 ⭐"

    return [
      { name: `${name} Historic City Center & Heritage Walk`, cost: budget, rating: rating, img: img, desc: `Explore famous architectural landmarks, historic quarters, and cultural highlights of ${name}.` },
      { name: `${name} Scenic Viewpoint & Golden Sunset`, cost: "₹350", rating: "4.9 ⭐", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80", desc: `Panoramic scenic views, evening strolls and photo stops across ${name}.` },
      { name: `${name} Authentic Local Culinary & Street Food Trail`, cost: "₹650", rating: "4.8 ⭐", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=80", desc: `Savor authentic regional dishes, food markets, and top-rated restaurants in ${name}.` },
      { name: `${name} Artisan Bazaar & Cultural Crafts Walk`, cost: "₹500", rating: "4.7 ⭐", img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=500&auto=format&fit=crop&q=80", desc: `Bustling local markets featuring handcrafted arts, textiles, souvenirs, and local treats.` }
    ]
  }

  const currentAttractions = getAttractionsForDestination(destination)

  // Active Spots for Map
  const activeSpots = itinerary && itinerary[activeDayIndex] ? itinerary[activeDayIndex].activities : []
  const activeNearbyPlaces = nearbyCategory && nearbyPlacesData[nearbyCategory] ? nearbyPlacesData[nearbyCategory] : []

  return (
    <div
      className="min-h-screen text-[#2F3E4E] dark:text-[#F1ECE2] pt-24 pb-20 relative overflow-x-hidden bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(248, 246, 242, 0.86), rgba(248, 246, 242, 0.92)), url('/itinerary-bg.jpg')`
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Navigation Top Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="rounded-xl border-border bg-background hover:bg-accent text-xs sm:text-sm cursor-pointer font-button"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Overview
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-foreground text-sm">Itinerary Planner Workspace</span>
          </div>

          <div className="flex items-center gap-2">
            {itinerary && itinerary.length > 0 && (
              <Button
                size="sm"
                onClick={() => setShowPreferences((prev) => !prev)}
                className="rounded-xl bg-[#00356B] text-white hover:bg-[#002852] text-xs font-medium px-4 py-2 flex items-center gap-1.5 cursor-pointer transition-all shadow-md font-button"
              >
                <SlidersHorizontal className="h-4 w-4 text-white" />
                <span>{showPreferences ? "Hide Trip Options" : "Edit Trip Options"}</span>
              </Button>
            )}
            <Button
              onClick={() => {
                saveCurrentTrip()
                setSaved(true)
                setTimeout(() => setSaved(false), 3000)
              }}
              className="rounded-xl bg-[#00356B] text-white hover:bg-[#002852] font-medium text-xs uppercase tracking-wider px-5 py-2.5 shadow-md shadow-[#00356B]/30 flex items-center gap-2 cursor-pointer transition-all font-button"
            >
              <Bookmark className="h-4 w-4 text-white" />
              {saved ? "Saved! Opening Report Pass..." : "Save Trip & Offline Pass"}
            </Button>
          </div>
        </div>

        {/* Title Header & Single Streamlined Search Bar */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-muted text-foreground font-semibold text-[11px] px-3.5 py-1.5 uppercase tracking-wider border border-border">
              <Sparkles className="h-3.5 w-3.5 text-foreground" />
              <span>TOTAL {days || 3} DAY ITINERARY TO {(destination || "GOA").toUpperCase()}</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              Design Your Personalized Trip
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl font-medium">
              Drag to reorder spots, sync with live map, optimize routes & add custom spots.
            </p>
          </div>

          {/* Single Streamlined Search Bar */}
          <div className="relative min-w-[300px] sm:min-w-[400px]">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!searchQuery.trim()) return
                const query = encodeURIComponent(searchQuery.trim())
                setActiveGoogleTabUrl(`https://www.google.com/search?q=${query}&igu=1`)
                setMiniGoogleTabQuery(searchQuery.trim())
                setShowSearchDropdown(false)
                setMiniGoogleOpen(true)
              }}
              className="relative flex items-center"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search any location or spot live..."
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                className="w-full rounded-xl border-2 border-[#00356B]/40 bg-[#00356B]/10 pl-11 pr-28 py-3 text-xs font-medium text-foreground outline-none focus:ring-2 focus:ring-[#00356B]/40 font-button"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1.5 rounded-xl bg-[#00356B] text-white hover:bg-[#002852] text-xs font-medium px-5 py-2 shadow-sm font-button"
              >
                Search
              </Button>
            </form>
          </div>
        </div>

        {/* Dynamic Left/Right Split Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT SIDE (4 OR 6 COLS): Interactive Map (When Globe Clicked) OR Trip Preferences Form */}
          <AnimatePresence mode="wait">
            {isMapVisible ? (
              /* MAP APPEARS ON THE LEFT SIDE WHEN GLOBE CLICKED */
              <motion.div
                key="map-view"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-6 flex flex-col space-y-3 sticky top-24"
              >
                <div className="rounded-none border border-border/80 bg-card flex flex-col h-[520px] relative overflow-hidden">
                  <TripMap
                    spots={activeSpots}
                    nearbyPlaces={activeNearbyPlaces}
                    hoveredSpotId={hoveredSpotId}
                    onSpotClick={handleMapSpotClick}
                  />
                </div>
              </motion.div>
            ) : (showPreferences || !itinerary || itinerary.length === 0) ? (
              /* TRIP PREFERENCES PANEL ON THE LEFT */
              <motion.div
                key="pref-view"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
                className="lg:col-span-4 rounded-3xl border border-border bg-card p-6 shadow-xl space-y-6 sticky top-24"
              >
                <div className="border-b border-border/80 pb-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#00356B] dark:text-[#86B3E6]" />
                      Trip Preferences
                    </h3>
                    <span className="text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50 px-2.5 py-0.5 rounded-xl flex items-center gap-1">
                      📍 {destination || "Goa"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Customize your destination, travel dates and stay tier.
                  </p>
                </div>

                {/* PLANNING OPTION */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    PLANNING OPTION
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setDestPlanningMode("explore")}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 font-button ${
                        destPlanningMode === "explore"
                          ? "border-[#00356B] bg-[#00356B]/15 text-[#00356B] dark:text-[#86B3E6] font-medium shadow-xs"
                          : "border-border text-muted-foreground hover:border-border/80"
                      }`}
                    >
                      <Compass className="h-4 w-4 text-[#00356B] dark:text-[#86B3E6]" />
                      <span>Plan via Explore</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDestPlanningMode("custom")}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 font-button ${
                        destPlanningMode === "custom"
                          ? "border-[#00356B] bg-[#00356B]/15 text-[#00356B] dark:text-[#86B3E6] font-medium shadow-xs"
                          : "border-border text-muted-foreground hover:border-border/80"
                      }`}
                    >
                      <MapPin className="h-4 w-4 text-[#00356B] dark:text-[#86B3E6]" />
                      <span>Direct Custom Location</span>
                    </button>
                  </div>
                </div>

                {/* 02 DESTINATION SELECTOR */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Select Destination
                  </label>
                  {destPlanningMode === "explore" ? (
                    <div className="relative">
                      <select
                        value={destination || ""}
                        onChange={(e) => {
                          if (e.target.value === "__EXPLORE_ALL__") {
                            onNavigateView && onNavigateView("explore")
                          } else {
                            setDestination(e.target.value)
                            setCustomDestInput(e.target.value)
                          }
                        }}
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium text-foreground outline-none focus:border-[#00356B] cursor-pointer appearance-none font-button"
                      >
                        <option value="" disabled>-- Select Destination --</option>
                        {destinationsData.map((d) => (
                          <option key={d.id || d.name} value={d.name}>
                            📍 {d.name} ({d.country}) — {d.vibe || d.type}
                          </option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none rotate-90" />
                    </div>
                  ) : (
                    <div className="relative flex items-center">
                      <MapPin className="absolute left-3.5 h-4 w-4 text-[#00356B] shrink-0" />
                      <input
                        type="text"
                        placeholder="Enter city or location..."
                        value={customDestInput}
                        onChange={(e) => {
                          setCustomDestInput(e.target.value)
                          if (e.target.value.trim()) {
                            setDestination(e.target.value.trim())
                          }
                        }}
                        className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2.5 text-xs font-medium text-foreground outline-none focus:border-[#00356B] font-button"
                      />
                    </div>
                  )}
                </div>

                {/* 03 DATES & DURATION */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Travel Dates
                  </label>
                  <button
                    type="button"
                    onClick={() => setCalendarOpen(!calendarOpen)}
                    className="w-full flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-xs font-medium text-foreground shadow-sm hover:border-[#00356B] transition-all cursor-pointer font-button"
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar className="h-4 w-4 text-[#00356B] dark:text-[#86B3E6]" />
                      <span>{startDate} → {endDate} ({days} {days === 1 ? "Day" : "Days"})</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${calendarOpen ? "rotate-90" : ""}`} />
                  </button>

                  {/* Calendar Modal */}
                  {calendarOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="rounded-2xl border border-border bg-card p-4 shadow-xl space-y-3 mt-2"
                    >
                      <div className="flex items-center justify-between border-b border-border/80 pb-2">
                        <span className="text-xs font-semibold text-foreground">Select Travel Dates</span>
                        <Button size="sm" onClick={() => setCalendarOpen(false)} className="rounded-xl bg-[#00356B] text-xs font-medium text-white px-3 py-1 font-button">Set</Button>
                      </div>
                      <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-muted-foreground">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                          <span key={d}>{d}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((dayNum) => {
                          const startDayNum = parseInt(startDate.split("-")[2], 10) || 15
                          const endDayNum = parseInt(endDate.split("-")[2], 10) || 17
                          const isStart = dayNum === startDayNum
                          const isEnd = dayNum === endDayNum
                          const isInRange = dayNum > startDayNum && dayNum < endDayNum

                          return (
                            <button
                              key={dayNum}
                              type="button"
                              onClick={() => {
                                if (dayNum < startDayNum) {
                                  setStartDate(`2026-08-${String(dayNum).padStart(2, "0")}`)
                                  setDays(Math.max(1, endDayNum - dayNum + 1))
                                } else {
                                  setEndDate(`2026-08-${String(dayNum).padStart(2, "0")}`)
                                  setDays(Math.max(1, dayNum - startDayNum + 1))
                                }
                              }}
                              className={`py-1.5 text-xs font-medium transition-all font-button ${
                                isStart || isEnd
                                  ? "bg-[#00356B] text-white rounded-lg font-medium shadow-md scale-105"
                                  : isInRange
                                    ? "bg-[#00356B]/15 text-[#00356B] dark:text-[#86B3E6] font-medium rounded-sm border-y border-[#00356B]/30"
                                    : "hover:bg-accent text-foreground rounded-lg"
                              }`}
                            >
                              {dayNum}
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 04 PACE */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Travel Pace & Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Relaxed", "Balanced", "Packed"].map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setTravelStyle(style)}
                        className={`rounded-xl border p-2.5 text-xs font-medium transition-all cursor-pointer font-button ${
                          travelStyle === style
                            ? "border-[#00356B] bg-[#00356B]/15 text-[#00356B] dark:text-[#86B3E6] font-medium shadow-sm"
                            : "border-border text-muted-foreground hover:border-border/80"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 05 BUDGET TIER */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
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
                        onClick={() => {
                          setBudgetTier(b.tier)
                          setStayTier(b.tier)
                        }}
                        className={`rounded-xl border py-2.5 px-1 text-center text-xs font-medium transition-all cursor-pointer font-button ${
                          budgetTier === b.tier
                            ? "border-[#00356B] bg-[#00356B]/15 text-[#00356B] dark:text-[#86B3E6] font-medium shadow-sm"
                            : "border-border text-muted-foreground hover:border-border/80"
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* GENERATE ITINERARY BUTTON */}
                <Button
                  onClick={() => handleGenerate()}
                  disabled={isGenerating}
                  className="w-full rounded-xl bg-[#00356B] py-3.5 font-medium text-white hover:bg-[#002852] shadow-md shadow-[#00356B]/30 disabled:opacity-50 cursor-pointer transition-all font-button"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Generating Schedule...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Generate Itinerary
                    </span>
                  )}
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* RIGHT SIDE / MAIN TIMELINE: Itinerary Cards & Live Budget Overview */}
          <div className={`${isMapVisible ? "lg:col-span-6" : (showPreferences || !itinerary || itinerary.length === 0) ? "lg:col-span-8" : "lg:col-span-12"} space-y-6`}>

            {!itinerary || itinerary.length === 0 || !destination ? (
              <div className="rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center space-y-4 flex flex-col items-center justify-center min-h-[420px]">
                <div className="h-16 w-16 rounded-full bg-[#00356B]/15 text-[#00356B] dark:text-[#86B3E6] flex items-center justify-center">
                  <Compass className="h-8 w-8 animate-pulse" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {destination ? `Ready to Build Your ${destination} Itinerary` : "No Destination Selected"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {destination
                    ? `Select preferences on the left, then click "Generate Itinerary".`
                    : "Select a destination from the dropdown on the left or search for a location to create your personalized itinerary."}
                </p>
                {destination && (
                  <Button
                    onClick={() => handleGenerate()}
                    className="rounded-xl bg-[#00356B] px-6 py-2.5 font-medium text-white shadow-md hover:bg-[#002852] font-button"
                  >
                    Generate {destination} Itinerary
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">

                {/* Generated Itinerary Top Card */}
                <div className="rounded-3xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-[#00356B] dark:text-[#86B3E6] uppercase tracking-wider flex items-center gap-1.5 font-button">
                      <MapPin className="h-3.5 w-3.5 text-[#00356B] dark:text-[#86B3E6]" />
                      <span>{(destination || "GOA").toUpperCase()}</span>
                    </div>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                      {days}-Day {travelStyle || "Balanced"} Itinerary
                    </h2>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        saveCurrentTrip()
                        setSaved(true)
                        setTimeout(() => setSaved(false), 3000)
                      }}
                      className="rounded-xl border border-[#00356B] bg-[#00356B]/15 text-[#00356B] dark:text-[#86B3E6] hover:bg-[#00356B]/25 text-xs font-medium px-4 py-2 flex items-center gap-1.5 cursor-pointer transition-all font-button"
                    >
                      <Bookmark className="h-4 w-4 text-[#00356B] dark:text-[#86B3E6]" />
                      <span>{saved ? "Saved!" : "Save Trip"}</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onNavigateView("budget")}
                      className="rounded-xl border border-[#00356B] bg-[#00356B]/15 text-[#00356B] dark:text-[#86B3E6] hover:bg-[#00356B]/25 text-xs font-medium px-4 py-2 flex items-center gap-1.5 cursor-pointer transition-all font-button"
                    >
                      <Wallet className="h-4 w-4 text-[#00356B] dark:text-[#86B3E6]" />
                      <span>Budget</span>
                    </Button>
                  </div>
                </div>

                {/* Main Itinerary Container: Horizontal Top Day Tabs & Selected Day Details Card */}
                <div className="flex flex-col gap-4 w-full">

                  {/* Horizontal Top Day Tabs */}
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none w-full z-10">
                    {itinerary.map((dayPlan, idx) => {
                      const isActive = activeDayIndex === idx
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveDayIndex(idx)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all cursor-pointer text-left font-button shrink-0 ${
                            isActive
                              ? "bg-[#00356B] text-white font-medium shadow-md shadow-[#00356B]/25"
                              : "bg-[#00356B]/10 border border-[#00356B]/30 text-[#00356B] dark:text-[#86B3E6] hover:bg-[#00356B]/20"
                          }`}
                        >
                          <div>
                            <div className="text-[9px] uppercase tracking-wider opacity-80 font-medium">DAY {dayPlan.day}</div>
                            <div className="text-xs font-semibold">{dayPlan.date || `Day ${dayPlan.day}`}</div>
                          </div>
                          <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-medium ${
                            isActive ? "bg-amber-400 text-neutral-900 shadow-2xs" : "bg-muted text-muted-foreground"
                          }`}>
                            {dayPlan.activities?.length || 0}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Selected Day Details Card */}
                  <div className="w-full rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
                    {/* Day Header */}
                    <div className="flex items-center justify-between border-b border-border/80 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#00356B] text-white flex items-center justify-center font-medium text-sm shrink-0 shadow-sm">
                          D{itinerary[activeDayIndex]?.day || activeDayIndex + 1}
                        </div>
                        <div>
                          <h3 className="font-heading text-lg font-bold text-foreground">
                            {itinerary[activeDayIndex]?.title || `Day ${activeDayIndex + 1}: Exploration`}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold mt-0.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{itinerary[activeDayIndex]?.date || `Sat, Aug ${15 + activeDayIndex}`}</span>
                          </div>
                        </div>
                      </div>

                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                        {itinerary[activeDayIndex]?.activities?.length || 0} Spots
                      </span>
                    </div>

                    {/* Day Activities Stream with Distance Connectors */}
                    <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
                      {itinerary[activeDayIndex]?.activities.map((act, idx) => {
                        const spotImages = act.images || [
                          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"
                        ]
                        const distToNext = idx === 0 ? "5.5 km • 18 mins travel" : "3.0 km • 10 mins travel"

                        return (
                          <div key={act.id || idx} className="space-y-3">
                            {/* Distance Connector Pill */}
                            {idx > 0 && (
                              <div className="flex items-center justify-start ml-10 my-1">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#27A84D] text-white text-[11px] font-medium px-3 py-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{act.distanceToNext || distToNext}</span>
                                </span>
                              </div>
                            )}

                            {/* Spot Card Row */}
                            <div
                              draggable={true}
                              onDragStart={(e) => {
                                setDraggedSpotIdx(idx)
                                e.dataTransfer.setData("text/plain", idx.toString())
                                e.dataTransfer.effectAllowed = "move"
                              }}
                              onDragOver={(e) => {
                                e.preventDefault()
                                e.dataTransfer.dropEffect = "move"
                                if (dragOverSpotIdx !== idx) setDragOverSpotIdx(idx)
                              }}
                              onDragLeave={() => {
                                if (dragOverSpotIdx === idx) setDragOverSpotIdx(null)
                              }}
                              onDrop={(e) => {
                                e.preventDefault()
                                const fromIdx = parseInt(e.dataTransfer.getData("text/plain"), 10)
                                setDraggedSpotIdx(null)
                                setDragOverSpotIdx(null)
                                if (!isNaN(fromIdx) && fromIdx !== idx) {
                                  reorderDayActivities(activeDayIndex, fromIdx, idx)
                                }
                              }}
                              onDragEnd={() => {
                                setDraggedSpotIdx(null)
                                setDragOverSpotIdx(null)
                              }}
                              className={`group relative rounded-2xl border p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all cursor-grab active:cursor-grabbing ${
                                draggedSpotIdx === idx
                                  ? "opacity-30 border-dashed border-[#00356B] bg-[#00356B]/5 scale-[0.98]"
                                  : dragOverSpotIdx === idx
                                  ? "border-2 border-[#00356B] bg-[#00356B]/10 shadow-lg scale-[1.01]"
                                  : "border-border bg-background/60 hover:shadow-sm"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <GripVertical className="h-4 w-4 text-muted-foreground/60 cursor-grab shrink-0 opacity-60 group-hover:opacity-100" />
                                
                                {/* Spot Coin Avatar */}
                                <div
                                  onClick={() => setActiveSpotDetail({ ...act, dayIndex: activeDayIndex, spotIndex: idx })}
                                  className="h-11 w-11 rounded-full overflow-hidden border-2 border-[#27A84D] shrink-0 cursor-pointer hover:scale-105 transition-transform"
                                  title="Click to view place photos & info"
                                >
                                  <img src={spotImages[0]} alt={act.title} className="h-full w-full object-cover" />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-heading text-sm font-semibold text-foreground truncate">
                                      {act.title}
                                    </h4>
                                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-medium text-[11px] px-2.5 py-0.5 shrink-0">
                                      {act.cost}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-semibold mt-0.5">
                                    <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                                    <span>{act.time}</span>
                                    <span>•</span>
                                    <span>Open: {act.openingHours || "10:00 AM - 07:00 PM"}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                                <button
                                  type="button"
                                  onClick={() => setActiveSpotDetail({ ...act, dayIndex: activeDayIndex, spotIndex: idx })}
                                  className="rounded-xl border border-[#00356B] bg-[#00356B]/15 text-[#00356B] dark:text-[#86B3E6] hover:bg-[#00356B] hover:text-white px-3.5 py-1 text-xs font-medium transition-all flex items-center gap-1 cursor-pointer shadow-xs font-button"
                                >
                                  <Globe className="h-3 w-3" />
                                  <span>More Info</span>
                                </button>

                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => idx > 0 && reorderDayActivities(activeDayIndex, idx, idx - 1)}
                                  className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                                  title="Move Up"
                                >
                                  <MoveUp className="h-3.5 w-3.5" />
                                </button>

                                <button
                                  type="button"
                                  disabled={idx === (itinerary[activeDayIndex]?.activities?.length || 1) - 1}
                                  onClick={() => idx < (itinerary[activeDayIndex]?.activities?.length || 1) - 1 && reorderDayActivities(activeDayIndex, idx, idx + 1)}
                                  className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                                  title="Move Down"
                                >
                                  <MoveDown className="h-3.5 w-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => removeSpot(activeDayIndex, idx)}
                                  className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                                  title="Remove Spot"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Add Custom Spot & Add Day Actions */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
                      <Button
                        type="button"
                        onClick={() => {
                          setTargetDayForCustomSpot(activeDayIndex)
                          setCustomSpotForm({
                            title: "",
                            type: "Sightseeing",
                            category: "Activities",
                            time: "02:30 PM",
                            cost: "500",
                            desc: "",
                            img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"
                          })
                          setAddSpotModalOpen(true)
                        }}
                        className="rounded-xl bg-[#00356B] text-white hover:bg-[#002852] font-medium text-xs px-5 py-2.5 shadow-md shadow-[#00356B]/25 flex items-center gap-1.5 cursor-pointer font-button"
                      >
                        <Plus className="h-4 w-4" />
                        Add Custom Spot to Day {activeDayIndex + 1}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const nextDayNum = (itinerary?.length || days || 3) + 1
                          setDays(nextDayNum)
                          setItinerary((prev) => [
                            ...(prev || []),
                            {
                              day: nextDayNum,
                              title: `Day ${nextDayNum} Local Explorations`,
                              date: `Aug ${15 + nextDayNum - 1}`,
                              activities: [
                                {
                                  id: `spot-extra-d${nextDayNum}-s1-${Date.now()}`,
                                  time: "10:00 AM",
                                  openingHours: "09:00 AM - 06:00 PM",
                                  type: "Sightseeing",
                                  category: "Activities",
                                  title: `${destination || "Trip"} Day ${nextDayNum} Highlight`,
                                  desc: `Curated local attraction for Day ${nextDayNum}.`,
                                  cost: "₹650",
                                  numericCost: 650,
                                  lat: 15.55 + nextDayNum * 0.01,
                                  lng: 73.75 + nextDayNum * 0.01,
                                  images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"]
                                }
                              ]
                            }
                          ])
                          setActiveDayIndex(nextDayNum - 1)
                        }}
                        className="rounded-xl border border-border text-foreground hover:bg-accent font-medium text-xs px-4 py-2.5 flex items-center gap-1.5 cursor-pointer font-button"
                      >
                        <Plus className="h-4 w-4 text-[#5A8CB2]" />
                        Add Extra Day (Day {(itinerary?.length || days || 3) + 1})
                      </Button>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

        {/* BOTTOM SECTION: Popular Attractions for Current Destination */}
        {destination && currentAttractions.length > 0 && (
          <div className="mt-16 border-t border-border/60 pt-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
                  <Compass className="h-4 w-4" />
                  Popular Attractions in {destination}
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mt-1">
                  Top Rated Spots to Visit in {destination}
                </h3>
              </div>
              <span className="text-xs text-muted-foreground">Showing top places in {destination}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {currentAttractions.map((spot, idx) => (
                <div
                  key={idx}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm hover:border-primary/50 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Coin-Shaped Circular Image Avatar */}
                    <div className="relative h-14 w-14 shrink-0 rounded-full border-2 border-[#5A8CB2] shadow-md overflow-hidden group-hover:scale-105 transition-transform bg-muted">
                      <img
                        src={spot.img}
                        alt={spot.name || spot.title}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-amber-500 text-white text-[9px] font-black flex items-center justify-center border border-white shadow-xs">
                        ★
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-heading text-xs font-semibold text-foreground truncate">
                          {spot.name || spot.title}
                        </h4>
                        <span className="text-xs font-semibold text-emerald-600 shrink-0">
                          {spot.cost}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-amber-500 font-medium mt-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{spot.rating || "4.8 ⭐"}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                        {spot.desc}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => addSpotToItinerary(activeDayIndex, {
                      title: spot.name || spot.title,
                      cost: spot.cost,
                      numericCost: parseInt(String(spot.cost).replace(/[^\d]/g, "")) || 500,
                      desc: spot.desc,
                      img: spot.img
                    })}
                    className="rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-[11px] font-medium py-1.5 px-3 shrink-0 transition-colors cursor-pointer font-button"
                  >
                    + Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Floating Tools Dock (Primary Yale Blue Theme) */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => setIsMapVisible(!isMapVisible)}
          className="rounded-xl bg-[#00356B] text-white hover:bg-[#002852] font-medium text-xs px-4 py-2.5 shadow-md hover:shadow-lg transition-all flex items-center cursor-pointer font-button"
        >
          <span>{!isMapVisible ? "Interactive Map" : "Show Planner"}</span>
        </button>

        <button
          type="button"
          onClick={() => setChecklistOpen(true)}
          className="rounded-xl bg-[#00356B] text-white hover:bg-[#002852] font-medium text-xs px-4 py-2.5 shadow-md hover:shadow-lg transition-all flex items-center cursor-pointer font-button"
        >
          <span>Packing Checklist</span>
        </button>

        <button
          type="button"
          onClick={() => { setNotesOpen(true); setNotesView("list") }}
          className="rounded-xl bg-[#00356B] text-white hover:bg-[#002852] font-medium text-xs px-4 py-2.5 shadow-md hover:shadow-lg transition-all flex items-center cursor-pointer font-button"
        >
          <span>Travel Notes</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────
          ITINERARY CHECKLIST (Draggable & Non-Blocking Floating Window)
         ───────────────────────────────────────────── */}
      <AnimatePresence>
        {checklistOpen && (
          <div className="fixed bottom-6 left-6 z-[2000] pointer-events-none flex items-end justify-start">
            <motion.div
              drag
              dragMomentum={false}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-2xl p-6 sm:p-7 space-y-4 cursor-grab active:cursor-grabbing"
            >
              {/* Drag Handle Bar */}
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3 select-none">
                <div>
                  <div className="text-[10px] font-medium text-neutral-400 mb-0.5 flex items-center gap-1">
                    <span>⠿ Drag to move checklist</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#0D2B45]">
                    Itinerary & Packing Checklist
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5 font-medium">
                    Auto-tuned for <span className="font-semibold text-[#0D2B45]">{destination || "Trip"}</span>
                  </p>
                </div>
                <button
                  onClick={() => setChecklistOpen(false)}
                  className="rounded-xl p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Add Custom Item Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!newChecklistItem.trim()) return
                  setChecklistItems([
                    ...checklistItems,
                    { id: Date.now(), text: newChecklistItem.trim(), checked: false, category: "Custom Items" }
                  ])
                  setNewChecklistItem("")
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder={`Add new packing item for ${destination || "trip"}...`}
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-900 outline-none focus:border-[#0D2B45] focus:bg-white"
                />
                <Button type="submit" className="rounded-xl bg-[#00356B] text-white px-4 py-2.5 text-xs font-medium hover:bg-[#002852] font-button">
                  <Plus className="h-4 w-4" />
                </Button>
              </form>

              {/* Checklist Items List */}
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {checklistItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setChecklistItems(
                        checklistItems.map((i) => (i.id === item.id ? { ...i, checked: !i.checked } : i))
                      )
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${item.checked
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900 opacity-75"
                        : "bg-neutral-50/80 border-neutral-200 text-neutral-900 hover:bg-white hover:shadow-md"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-5 w-5 rounded-lg border flex items-center justify-center transition-colors ${item.checked ? "bg-emerald-500 border-emerald-500 text-white" : "border-neutral-300 bg-white"
                        }`}>
                        {item.checked && <Check className="h-3.5 w-3.5" />}
                      </div>
                      <div>
                        <span className={`text-xs font-medium block ${item.checked ? "line-through" : ""}`}>
                          {item.text}
                        </span>
                        <span className="text-[9px] font-medium text-neutral-400">{item.category}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setChecklistItems(checklistItems.filter((i) => i.id !== item.id))
                      }}
                      className="text-neutral-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────
          PERSONAL NOTES (Draggable & Non-Blocking Floating Window)
         ───────────────────────────────────────────── */}
      <AnimatePresence>
        {notesOpen && (
          <div className="fixed bottom-6 right-6 z-[2000] pointer-events-none flex items-end justify-end">
            <motion.div
              drag
              dragMomentum={false}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-2xl cursor-grab active:cursor-grabbing"
            >
              {/* Destination Photo Banner Header (Drag Handle) */}
              <div className="relative h-40 w-full overflow-hidden select-none">
                <img
                  src={
                    destinationAttractionsDB[destination]?.[0]?.img ||
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"
                  }
                  alt={destination || "Travel destination"}
                  className="h-full w-full object-cover pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute top-2.5 left-3 text-[10px] font-medium text-white/80 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                  <span>⠿ Drag to move</span>
                </div>
                <div className="absolute bottom-4 left-5 right-5">
                  <p className="text-white text-lg font-heading font-bold drop-shadow-md">
                    Pen it Down Before You Forget
                  </p>
                  <p className="text-white/80 text-[11px] font-medium mt-0.5">
                    {destination || "Your Trip"} • {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>
                <button
                  onClick={() => setNotesOpen(false)}
                  className="absolute top-3 right-3 rounded-xl p-1.5 bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {notesView === "list" ? (
                /* ──── LIST VIEW ──── */
                <div className="p-6 sm:p-8 space-y-5">
                  {/* Add Note Button (Primary Theme) */}
                  <button
                    type="button"
                    onClick={() => setNotesView("add")}
                    className="w-full rounded-xl bg-[#00356B] text-white hover:bg-[#002852] font-medium text-xs py-3 transition-all cursor-pointer font-button flex items-center justify-center gap-2 shadow-md"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Note
                  </button>

                  {/* Notes List */}
                  <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                    {personalNotes.length === 0 ? (
                      <div className="text-center py-8 text-neutral-400">
                        <p className="text-xs font-medium">No notes yet</p>
                        <p className="text-[10px] mt-1">Tap "Add New Note" to start journaling</p>
                      </div>
                    ) : (
                      personalNotes.map((note) => (
                        <div key={note.id} className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1.5 hover:bg-white hover:shadow-sm transition-all">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-xs text-[#0D2B45]">{note.title}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-neutral-400 font-medium">{note.date}</span>
                              <button
                                type="button"
                                onClick={() => setPersonalNotes(personalNotes.filter((n) => n.id !== note.id))}
                                className="text-neutral-400 hover:text-rose-500 p-0.5 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-neutral-600 leading-relaxed">{note.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                /* ──── ADD NOTE VIEW ──── */
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (!newNoteTitle.trim()) return
                    setPersonalNotes([
                      {
                        id: Date.now(),
                        title: newNoteTitle.trim(),
                        text: newNoteText.trim() || "No extra note content.",
                        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      },
                      ...personalNotes
                    ])
                    setNewNoteTitle("")
                    setNewNoteText("")
                    setNotesView("list")
                  }}
                  className="p-6 sm:p-8 space-y-4"
                >
                  <input
                    type="text"
                    placeholder="Note Title (e.g. Driver Phone Number...)"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs font-medium text-neutral-900 outline-none focus:border-[#00356B] focus:bg-white transition-colors"
                  />
                  <textarea
                    placeholder="Note Details / References..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-800 outline-none focus:border-[#00356B] focus:bg-white transition-colors resize-none"
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setNotesView("list")}
                      className="flex-1 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100 py-2.5 text-xs font-medium transition-all cursor-pointer font-button"
                    >
                      Cancel
                    </button>
                    <Button type="submit" className="flex-1 rounded-xl bg-[#00356B] text-white py-2.5 text-xs font-medium hover:bg-[#002852] shadow-sm font-button">
                      Save Note
                    </Button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────
          MINIATURE SQUARE GOOGLE SEARCH TAB WIDGET (Active & Non-Blocking)
         ───────────────────────────────────────────── */}
      <AnimatePresence>
        {miniGoogleOpen && (
          <div className="fixed top-24 right-6 z-40 w-full max-w-xl h-[560px] pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full h-full rounded-xl border-2 border-[#0D2B45]/20 bg-white text-neutral-900 shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Web Search Tab Bar Header */}
              <div className="flex items-center justify-between bg-[#00356B] text-white px-5 py-3 border-b border-[#002852]">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-medium text-sm text-white">
                    Web Search
                  </span>
                </div>
                <button
                  onClick={() => setMiniGoogleOpen(false)}
                  className="rounded-xl p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mini Google URL & Search Input Bar */}
              <div className="bg-neutral-100 p-3 border-b border-neutral-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (!miniGoogleTabQuery.trim()) return
                    const query = encodeURIComponent(miniGoogleTabQuery.trim())
                    setActiveGoogleTabUrl(`https://www.google.com/search?q=${query}&igu=1`)
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Type anything to search Google live..."
                      value={miniGoogleTabQuery}
                      onChange={(e) => setMiniGoogleTabQuery(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 bg-white pl-9 pr-3 py-2 text-xs font-semibold text-neutral-900 outline-none focus:border-[#0D2B45] focus:ring-2 focus:ring-[#0D2B45]/10"
                    />
                  </div>
                  <Button type="submit" size="sm" className="rounded-xl bg-[#00356B] text-white text-xs font-medium px-4 py-2 hover:bg-[#002852] font-button shadow-xs">
                    Search
                  </Button>
                </form>
              </div>

              {/* Square Miniature Google Iframe / Web Frame View */}
              <div className="flex-1 w-full bg-white relative">
                <iframe
                  src={activeGoogleTabUrl}
                  title="Google Search Tab"
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>

              {/* Bottom Quick Search Suggestions */}
              <div className="bg-neutral-50 px-4 py-2 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500 font-semibold">
                <span>Quick Google Searches:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setMiniGoogleTabQuery(`best spots in ${destination || "goa"}`)
                      setActiveGoogleTabUrl(`https://www.google.com/search?q=best+spots+in+${encodeURIComponent(destination || "goa")}&igu=1`)
                    }}
                    className="text-[#0D2B45] font-medium hover:underline"
                  >
                    Places in {destination || "Goa"}
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => {
                      setMiniGoogleTabQuery(`best food in ${destination || "goa"}`)
                      setActiveGoogleTabUrl(`https://www.google.com/search?q=best+food+in+${encodeURIComponent(destination || "goa")}&igu=1`)
                    }}
                    className="text-[#0D2B45] font-medium hover:underline"
                  >
                    Top Foods
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Copilot Drawer */}
      {botOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-3xl border border-border bg-card shadow-2xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span className="font-medium text-xs text-foreground">AI Itinerary Copilot</span>
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
                className={`p-2.5 rounded-2xl ${m.sender === "user"
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

      {/* Sleek Modern Add Custom Spot Modal */}
      <AnimatePresence>
        {addSpotModalOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl bg-[#5A8CB2]/15 text-[#5A8CB2] flex items-center justify-center font-medium">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground">Add Custom Attraction</h3>
                    <p className="text-xs text-muted-foreground">Add a custom spot to Day {targetDayForCustomSpot + 1}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAddSpotModalOpen(false)}
                  className="rounded-xl p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleAddCustomSpotSubmit} className="space-y-4">
                {/* Spot Title */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Spot / Place Name *
                  </label>
                  <div className="relative flex items-center">
                    <MapPin className="absolute left-3.5 h-4 w-4 text-[#5A8CB2]" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cafe Chocolatti, Aguada Fort View..."
                      value={customSpotForm.title}
                      onChange={(e) => setCustomSpotForm({ ...customSpotForm, title: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-xs font-medium text-foreground outline-none focus:border-[#5A8CB2]"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Type & Time Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Category / Type
                    </label>
                    <select
                      value={customSpotForm.type}
                      onChange={(e) => {
                        const val = e.target.value
                        const cat = val === "Food" ? "Food & Dining" : val === "Shopping" ? "Shopping" : "Activities"
                        setCustomSpotForm({ ...customSpotForm, type: val, category: cat })
                      }}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium text-foreground outline-none focus:border-[#5A8CB2] cursor-pointer"
                    >
                      <option value="Sightseeing">🏛️ Sightseeing</option>
                      <option value="Food">🍽️ Food & Dining</option>
                      <option value="Relaxation">🏖️ Relaxation & Beach</option>
                      <option value="Sunset">🌅 Sunset Spot</option>
                      <option value="Shopping">🛍️ Shopping & Bazaar</option>
                      <option value="Culture">🎭 Culture & Heritage</option>
                      <option value="Show">🎪 Show & Event</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Scheduled Time
                    </label>
                    <select
                      value={customSpotForm.time}
                      onChange={(e) => setCustomSpotForm({ ...customSpotForm, time: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium text-foreground outline-none focus:border-[#5A8CB2] cursor-pointer"
                    >
                      <option value="09:00 AM">🌅 09:00 AM (Morning)</option>
                      <option value="11:30 AM">☀️ 11:30 AM (Late Morning)</option>
                      <option value="01:30 PM">🍽️ 01:30 PM (Afternoon)</option>
                      <option value="04:30 PM">🌇 04:30 PM (Late Afternoon)</option>
                      <option value="06:00 PM">🌅 06:00 PM (Sunset)</option>
                      <option value="08:30 PM">🌙 08:30 PM (Night)</option>
                    </select>
                  </div>
                </div>

                {/* Cost & Image Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Estimated Cost (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      value={customSpotForm.cost}
                      onChange={(e) => setCustomSpotForm({ ...customSpotForm, cost: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium text-foreground outline-none focus:border-[#5A8CB2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Cover Photo Vibe
                    </label>
                    <select
                      value={customSpotForm.img}
                      onChange={(e) => setCustomSpotForm({ ...customSpotForm, img: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium text-foreground outline-none focus:border-[#5A8CB2] cursor-pointer"
                    >
                      <option value="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80">🏖️ Beach & Ocean</option>
                      <option value="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80">☕ Cafe & Dining</option>
                      <option value="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80">🏰 Heritage & Fort</option>
                      <option value="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80">🌅 Sunset & Views</option>
                      <option value="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80">🛍️ Market & Bazaar</option>
                      <option value="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80">🌿 Waterfall & Nature</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Description / Special Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Try wood-fired pizza and watch sunset from cliffside."
                    value={customSpotForm.desc}
                    onChange={(e) => setCustomSpotForm({ ...customSpotForm, desc: e.target.value })}
                    className="w-full rounded-2xl border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground outline-none focus:border-[#5A8CB2] resize-none"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddSpotModalOpen(false)}
                    className="rounded-xl border-border hover:bg-accent text-xs font-medium px-4 py-2 cursor-pointer font-button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-xl bg-[#5A8CB2] text-white hover:bg-[#4A7CA2] font-medium text-xs px-5 py-2 shadow-md cursor-pointer flex items-center gap-1.5 font-button"
                  >
                    <Plus className="h-4 w-4" />
                    Add to Itinerary
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Google Maps Style Place Information & Photo Modal */}
      <AnimatePresence>
        {activeSpotDetail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl space-y-0"
            >
              {/* Google Maps Style Header Bar */}
              <div className="flex items-center justify-between bg-[#1E293B] text-white px-5 py-3 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-300">
                    Google Maps Place Information
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSpotDetail(null)}
                  className="rounded-xl bg-white/10 p-1 text-slate-300 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Cover Image & Rating Header */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                <img
                  src={activeSpotDetail.images?.[0] || activeSpotDetail.img || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"}
                  alt={activeSpotDetail.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                <div className="absolute bottom-3 left-5 right-5 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                      {activeSpotDetail.category || "Sightseeing"}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-medium text-amber-400 bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>4.8 (1,280 reviews)</span>
                    </div>
                  </div>

                  <h3 className="font-heading text-2xl font-bold leading-tight text-white">
                    {activeSpotDetail.title}
                  </h3>
                </div>
              </div>

              {/* Google Maps Style Quick Actions Bar */}
              <div className="bg-muted/40 border-b border-border px-5 py-2.5 flex items-center justify-between gap-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => {
                    const query = encodeURIComponent(`${activeSpotDetail.title} ${destination || ""}`)
                    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank")
                  }}
                  className="rounded-xl bg-[#5A8CB2] text-white hover:bg-[#4A7CA2] font-medium text-xs px-3.5 py-1.5 shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0 font-button"
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>Open Directions</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const query = encodeURIComponent(`photos of ${activeSpotDetail.title} ${destination || ""}`)
                    window.open(`https://www.google.com/search?tbm=isch&q=${query}`, "_blank")
                  }}
                  className="rounded-xl border border-border bg-background hover:bg-accent text-foreground font-medium text-xs px-3.5 py-1.5 shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 font-button"
                >
                  <Camera className="h-3.5 w-3.5 text-primary" />
                  <span>Google Photos</span>
                </button>

                <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shrink-0">
                  Est. {activeSpotDetail.cost}
                </span>
              </div>

              {/* Spot Details Body */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-border/70 bg-background p-3 space-y-1">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground block">
                      Scheduled & Hours
                    </span>
                    <p className="font-medium text-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {activeSpotDetail.time}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      Open: {activeSpotDetail.openingHours || "08:00 AM - 08:00 PM"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/70 bg-background p-3 space-y-1">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground block">
                      Location & Vibe
                    </span>
                    <p className="font-medium text-foreground flex items-center gap-1 truncate">
                      <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      {destination || "Goa"}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      Verified Place Highlight
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
                    About Place / Overview
                  </span>
                  <p className="text-xs leading-relaxed text-card-foreground font-medium">
                    {activeSpotDetail.desc || `Popular destination landmark and curated experience for your trip in ${destination || "Goa"}.`}
                  </p>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      removeSpot(activeSpotDetail.dayIndex, activeSpotDetail.spotIndex)
                      setActiveSpotDetail(null)
                    }}
                    className="rounded-xl border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-medium px-3.5 py-1.5 cursor-pointer font-button"
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Remove from Day
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setActiveSpotDetail(null)}
                    className="rounded-xl bg-secondary text-secondary-foreground hover:bg-accent font-medium text-xs px-5 py-1.5 cursor-pointer font-button"
                  >
                    Close Card
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

