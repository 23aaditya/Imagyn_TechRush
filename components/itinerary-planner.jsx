"use client"

import { useState, useEffect, useRef } from "react"
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
  Plus
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
    itinerary,
    setItinerary,
    addSpotToItinerary,
    removeSpotFromItinerary,
    updateSpotCostInItinerary
  } = useTrip()

  // Main Workspace State
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [travelStyle, setTravelStyle] = useState("Balanced")
  const [budgetTier, setBudgetTier] = useState("Moderate") // Moderate | Budget | Luxury | Custom
  const [customBudgetVal, setCustomBudgetVal] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const [activeDayIndex, setActiveDayIndex] = useState(0)
  const [saved, setSaved] = useState(false)

  // Bi-directional hover/click state
  const [hoveredSpotId, setHoveredSpotId] = useState(null)
  const spotRefs = useRef({})

  // Hover image index map per spot ID
  const [spotImageIndices, setSpotImageIndices] = useState({})
  const hoverTimersRef = useRef({})

  // MAP ACTIVATION STATE (Globe button toggles Map Mode on LEFT side)
  const [isMapVisible, setIsMapVisible] = useState(false)
  const [nearbyCategory, setNearbyCategory] = useState(null)

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
      text: "👋 Hi! I'm your AI Itinerary Copilot. Tell me to add, remove, or modify spots!"
    }
  ])
  const [botInput, setBotInput] = useState("")

  // Synchronize itinerary whenever destination changes
  useEffect(() => {
    if (destination) {
      const isAlreadyMatching = itinerary && itinerary.length > 0 && itinerary[0]?.title?.toLowerCase().includes(destination.toLowerCase())
      if (!isAlreadyMatching) {
        const newPlan = buildItineraryData(destination, days, startDate)
        setItinerary(newPlan)
        setActiveDayIndex(0)
      }
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
  const handleGenerate = () => {
    if (!destination) return
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      const newPlan = buildItineraryData(destination, days, startDate)
      setItinerary(newPlan)
      setActiveDayIndex(0)
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
    <div className="min-h-screen bg-[#F4F6F6] text-[#2F3E4E] pt-24 pb-20 relative overflow-x-hidden">
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


        </div>

        {/* Title Header & Live Search Bar */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Design Your Personalized Itinerary
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              Select preferences, reorder spots, view synchronized live map routes & explore nearby places.
            </p>
          </div>

          {/* Search Bar with Mini Google Integration (Req 2) */}
          <div className="relative min-w-[290px] sm:min-w-[360px]">
            <form onSubmit={handleGoogleSearchSubmit} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search more places with Google..."
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

            {/* Live Search Suggestions Dropdown */}
            {showSearchDropdown && searchSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-border bg-card shadow-2xl p-2 space-y-1 max-h-72 overflow-y-auto"
              >
                <div className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Destination Suggestions ({searchSuggestions.length})
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
                        <span className="text-[10px] text-muted-foreground">{dest.subtitle}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {dest.startingBudget}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* MAIN WORKSPACE GRID: Left Side (Trip Preference OR Map) + Right Side (Itinerary Timeline) */}
        <div className="grid gap-8 lg:grid-cols-12 mb-16 items-start">

          {/* LEFT SIDE (4 OR 6 COLS): Interactive Map (When Globe Clicked) OR Trip Preferences Form */}
          <AnimatePresence mode="wait">
            {isMapVisible ? (
              /* MAP APPEARS ON THE LEFT SIDE WHEN GLOBE CLICKED (User Prompt Request) */
              <motion.div
                key="map-view"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
                className="lg:col-span-6 flex flex-col space-y-3 sticky top-24"
              >
                <div className="rounded-3xl border border-border bg-card p-4 shadow-xl flex flex-col h-[620px] relative overflow-hidden">
                  
                  {/* Compact "See Nearby" Toolbar (Hotels, Cafes, Restaurants, Petrol, Medicals) */}
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2 z-10 bg-background/90 backdrop-blur-md p-2.5 rounded-2xl border border-border/60">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Filter className="h-3.5 w-3.5 text-primary" />
                      See Nearby:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { key: "hotels", label: "Hotels", icon: Hotel },
                        { key: "cafes", label: "Cafes", icon: Coffee },
                        { key: "restaurants", label: "Restaurants", icon: UtensilsCrossed },
                        { key: "petrol_pumps", label: "Petrol Pumps", icon: Fuel },
                        { key: "medicals", label: "Medical Stores", icon: Stethoscope }
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

                  {/* Leaflet Map Component */}
                  <div className="flex-1 w-full rounded-2xl overflow-hidden shadow-inner z-0">
                    <TripMap
                      spots={activeSpots}
                      nearbyPlaces={activeNearbyPlaces}
                      hoveredSpotId={hoveredSpotId}
                      onSpotClick={handleMapSpotClick}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              /* TRIP PREFERENCE PANEL ON THE LEFT (Default State) */
              <motion.div
                key="pref-view"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
                className="lg:col-span-4"
              >
                <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-border/60 pb-4">
                    <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                      <Filter className="h-4 w-4 text-primary" />
                      Trip Preferences
                    </h3>
                    <span className="text-xs text-muted-foreground">Parameters</span>
                  </div>

                  {/* Destination Dropdown */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Select Destination
                    </label>
                    <select
                      value={destination}
                      onChange={(e) => {
                        const val = e.target.value
                        setDestination(val)
                        if (!val) setItinerary([])
                      }}
                      className="w-full rounded-xl border border-border bg-background p-3 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                      <option value="">-- Select a Destination --</option>
                      {destinationsData.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name} ({d.country})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Calendar Date Range Picker */}
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
                          <span>Select Date Range</span>
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
                          onClick={() => setCalendarOpen(false)}
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
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Budget Tier
                      </label>
                      {budgetTier === "Custom" && (
                        <span className="text-[10px] font-bold text-primary">Custom Enter Mode</span>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { label: "Backpacker", tier: "Budget" },
                        { label: "Standard", tier: "Moderate" },
                        { label: "Luxury", tier: "Luxury" },
                        { label: "Custom ₹", tier: "Custom" }
                      ].map((b) => (
                        <button
                          key={b.tier}
                          type="button"
                          onClick={() => {
                            setBudgetTier(b.tier)
                            if (b.tier !== "Custom") {
                              setStayTier(b.tier)
                              setCustomTargetBudget(null)
                            }
                          }}
                          className={`rounded-xl border py-2 px-1 text-center text-xs font-medium transition-all ${
                            budgetTier === b.tier
                              ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                              : "border-border text-muted-foreground hover:border-border/80"
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>

                    {/* Custom Budget Enter Input Box */}
                    {budgetTier === "Custom" && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 rounded-2xl border border-primary bg-primary/5 p-3"
                      >
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                          Enter Target Budget (₹)
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-primary">₹</span>
                          <input
                            type="number"
                            placeholder="e.g. 25000"
                            value={customBudgetVal}
                            onChange={(e) => {
                              setCustomBudgetVal(e.target.value)
                              if (e.target.value) {
                                setCustomTargetBudget(Number(e.target.value))
                              }
                            }}
                            className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground outline-none focus:border-primary"
                            autoFocus
                          />
                        </div>
                        <p className="mt-1.5 text-[10px] text-muted-foreground">
                          Budget Planner & Expense Tracker will automatically align with this limit.
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !destination}
                    className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Generating Schedule...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Generate Itinerary
                      </span>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* RIGHT SIDE (6 OR 8 COLS): Itinerary Cards Timeline */}
          <div className={`${isMapVisible ? "lg:col-span-6" : "lg:col-span-8"} space-y-6`}>

            {!itinerary || itinerary.length === 0 || !destination ? (
              <div className="rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center space-y-4 flex flex-col items-center justify-center min-h-[420px]">
                <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
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
                    onClick={handleGenerate}
                    className="rounded-xl bg-primary px-6 py-2.5 font-semibold text-primary-foreground shadow-md"
                  >
                    Generate {destination} Itinerary
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Trip Meta Header Card */}
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

                {/* Day Navigation Tabs & Arrow Controls (Req 1, 6) */}
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

                {/* Side-by-Side Day Card Slider */}
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

                      {/* Spot Cards List with Vertical Blue Connector Line */}
                      <div className="space-y-6">
                        {itinerary[activeDayIndex].activities.map((act, idx) => {
                          const spotImages = act.images || [
                            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"
                          ]
                          const activeImgIdx = spotImageIndices[act.id] || 0
                          const isHovered = hoveredSpotId === act.id

                          return (
                            <div
                              key={act.id || idx}
                              ref={(el) => (spotRefs.current[act.id] = el)}
                              className="relative"
                            >
                              {/* Spot Card Box */}
                              <div
                                onMouseEnter={() => handleSpotMouseEnter(act.id, spotImages.length)}
                                onMouseLeave={() => handleSpotMouseLeave(act.id)}
                                className={`group relative flex flex-col sm:flex-row items-stretch justify-between gap-4 rounded-2xl border p-4 transition-all ${
                                  isHovered
                                    ? "border-primary bg-primary/5 shadow-xl scale-[1.01]"
                                    : "border-border/70 bg-background/80 hover:border-primary/50 hover:bg-background hover:shadow-lg"
                                }`}
                              >
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                  {/* Drag Reorder Handles */}
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
                                      {/* Spot Title Immediately Followed by Price */}
                                      <h4 className="font-heading text-base font-semibold text-foreground flex items-center gap-2 flex-wrap">
                                        <span>{act.title}</span>
                                        <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                                          {act.cost}
                                        </span>
                                      </h4>

                                      <button
                                        type="button"
                                        onClick={() => removeSpot(activeDayIndex, idx)}
                                        className="text-muted-foreground hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>

                                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                      {act.desc}
                                    </p>

                                    {/* Operating Hours & Timings */}
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

                                {/* Right Side: Larger Rectangular Hover Gallery */}
                                <div className="shrink-0 self-center">
                                  <div className="relative h-28 w-44 rounded-xl overflow-hidden border border-border shadow-sm group-hover:scale-105 transition-transform">
                                    <img
                                      src={spotImages[activeImgIdx]}
                                      alt={act.title}
                                      className="h-full w-full object-cover transition-all duration-500"
                                    />
                                    {spotImages.length > 1 && (
                                      <div className="absolute bottom-1 right-1 flex gap-1 bg-black/60 px-1.5 py-0.5 rounded-full">
                                        {spotImages.map((_, imgI) => (
                                          <div
                                            key={imgI}
                                            className={`h-1.5 w-1.5 rounded-full ${
                                              activeImgIdx === imgI ? "bg-white" : "bg-white/40"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>

                              </div>

                              {/* VERTICAL BLUE BAR CONNECTING CONSECUTIVE SPOT CARDS ON LEFT EDGE (Matching Drawing) */}
                              {idx < itinerary[activeDayIndex].activities.length - 1 && (
                                <div className="relative my-2.5 ml-5 flex items-center gap-3 pl-1">
                                  {/* Vertical Blue Line on Left */}
                                  <div className="w-1.5 h-10 bg-blue-600 rounded-full shadow-sm shrink-0" />
                                  
                                  {/* Travel Distance & Time Badge */}
                                  <div className="rounded-full bg-blue-600 text-white px-3 py-1 text-[11px] font-bold shadow-md border-2 border-background flex items-center gap-1.5">
                                    <span>📍</span>
                                    <span>{act.distanceToNext || "3.0 km • 10 mins travel"}</span>
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
              </>
            )}

          </div>

        </div>

        {/* BOTTOM SECTION: Popular Attractions for Current Destination */}
        {destination && currentAttractions.length > 0 && (
          <div className="mt-16 border-t border-border/60 pt-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <Compass className="h-4 w-4" />
                  Popular Attractions in {destination}
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mt-1">
                  Top Rated Spots to Visit in {destination}
                </h3>
              </div>
              <span className="text-xs text-muted-foreground">Showing top places in {destination}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentAttractions.map((spot, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-3 shadow-sm hover:border-primary/50 hover:shadow-md transition-all text-left"
                >
                  <div className="relative h-32 w-full rounded-xl overflow-hidden mb-2">
                    <img
                      src={spot.img}
                      alt={spot.name || spot.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-semibold text-white flex items-center gap-0.5">
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                      {spot.rating || "4.8 ⭐"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-1">
                    <h4 className="font-heading text-xs font-bold text-foreground truncate">
                      {spot.name || spot.title}
                    </h4>
                    <span className="text-xs font-bold text-emerald-600 shrink-0">
                      {spot.cost}
                    </span>
                  </div>

                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">
                    {spot.desc}
                  </p>

                  <Button
                    size="sm"
                    onClick={() => addSearchedPlaceToItinerary(spot.name || spot.title)}
                    className="mt-3 w-full rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-[11px] font-semibold py-1 transition-colors"
                  >
                    + Add to Itinerary
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* FLOATING CORNER GLOBE BUTTON / PLAN ITINERARY TOGGLE (In Bottom-Left Corner) */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
        {!isMapVisible ? (
          <Button
            onClick={() => setIsMapVisible(true)}
            className="rounded-full h-14 w-14 bg-blue-600 text-white shadow-2xl hover:scale-110 transition-transform flex items-center justify-center border-2 border-background animate-bounce-slow"
            title="Open Interactive Map"
          >
            <Globe className="h-7 w-7" />
          </Button>
        ) : (
          <Button
            onClick={() => setIsMapVisible(false)}
            className="rounded-full bg-card border border-border text-foreground text-xs font-bold px-5 py-3 shadow-2xl hover:bg-accent flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            Plan Itinerary Mode
          </Button>
        )}
      </div>

      {/* Mini Google Search Popup Modal */}
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
