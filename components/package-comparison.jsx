"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  X,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  Compass,
  DollarSign,
  Hotel,
  Sparkles,
  Star,
  Plus,
  Eye,
  CheckCircle2,
  ArrowRight,
  Calendar,
  MapPin,
  Car,
  Utensils,
  Sun,
  Palmtree,
  Mountain,
  Landmark,
  Trees,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTrip } from "@/context/trip-context"

// Vacation Categories Configuration (Emojis removed)
const VACATION_CATEGORIES = [
  { id: "beach", name: "Beach & Relaxation", icon: Palmtree },
  { id: "adventure", name: "Adventure & Mountains", icon: Mountain },
  { id: "culture", name: "Culture & Heritage", icon: Landmark },
  { id: "nature", name: "Nature & Wellness", icon: Trees },
  { id: "food", name: "Food & Local Experiences", icon: Utensils },
  { id: "family", name: "Family Vacation", icon: Users }
]

// Packages Database categorized by Vacation Type
const PACKAGE_DATA = {
  beach: [
    {
      id: "goa-escape",
      name: "Goa Explorer & Beach Escape",
      destination: "Goa",
      country: "India",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      duration: "3 Days / 2 Nights",
      durationDays: 3,
      price: "₹9,999",
      numericPrice: 9999,
      hotelCategory: "4-Star Beach Resort",
      meals: "Breakfast & Dinner Included",
      transport: "Private AC Sedan Included",
      attractionsCount: 5,
      activitiesCount: 3,
      rating: 4.8,
      description: "Sun-drenched beaches, cliffside shacks, Portuguese heritage, and watersports.",
      attractionsList: ["Baga & Calangute Beach", "Fort Aguada", "Fontainhas Latin Quarter", "Dudhsagar Waterfalls", "Anjuna Flea Market"],
      activitiesList: ["Parasailing & Jet Ski", "Mandovi Sunset Cruise", "Spice Plantation Buffet"]
    },
    {
      id: "gokarna-getaway",
      name: "Gokarna Coastal Getaway",
      destination: "Gokarna",
      country: "Karnataka, India",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
      duration: "3 Days / 2 Nights",
      durationDays: 3,
      price: "₹11,200",
      numericPrice: 11200,
      hotelCategory: "Heritage Beach Cottage",
      meals: "All Meals Included",
      transport: "Cab & Boat Transfer",
      attractionsCount: 4,
      activitiesCount: 4,
      rating: 4.9,
      description: "Pristine Om Beach, cliff treks, Mahabaleshwar Temple, and peaceful ocean sunsets.",
      attractionsList: ["Om Beach", "Half Moon Beach", "Kuddle Beach", "Mahabaleshwar Temple"],
      activitiesList: ["Five Beach Trek", "Cliffside Yoga Session", "Sunset Boat Ride", "Beach Stargazing Fire"]
    },
    {
      id: "andaman-experience",
      name: "Andaman Island Paradise",
      destination: "Andaman & Nicobar",
      country: "India",
      image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&auto=format&fit=crop&q=80",
      duration: "5 Days / 4 Nights",
      durationDays: 5,
      price: "₹24,500",
      numericPrice: 24500,
      hotelCategory: "5-Star Island Resort",
      meals: "Buffet Breakfast Included",
      transport: "Ferry & Private AC Cabs",
      attractionsCount: 7,
      activitiesCount: 5,
      rating: 4.9,
      description: "Radhanagar turquoise waters, coral reef snorkeling, and Cellular Jail light show.",
      attractionsList: ["Radhanagar Beach Havelock", "Elephant Beach", "Cellular Jail National Memorial", "Ross Island Ruins", "Neil Island Natural Bridge", "Chidiya Tapu Sunset", "Kala Pathar Beach"],
      activitiesList: ["Scuba Diving Trail", "Sea Walking", "Glass Bottom Boat Tour", "Coral Reef Snorkeling", "Light & Sound Heritage Show"]
    }
  ],
  adventure: [
    {
      id: "manali-adventure",
      name: "Manali High-Pass Adventure",
      destination: "Manali",
      country: "Himachal Pradesh, India",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80",
      duration: "4 Days / 3 Nights",
      durationDays: 4,
      price: "₹14,500",
      numericPrice: 14500,
      hotelCategory: "Mountain View Resort",
      meals: "Breakfast & Dinner Included",
      transport: "4x4 SUV Mountain Transport",
      attractionsCount: 6,
      activitiesCount: 4,
      rating: 4.9,
      description: "Snowy Solang Valley, Atal Tunnel engineering feat, pine treks, and Beas rafting.",
      attractionsList: ["Solang Valley", "Atal Tunnel Sissu", "Hadimba Cedar Temple", "Jogini Waterfalls", "Old Manali Cafe Trail", "Vashisht Hot Springs"],
      activitiesList: ["Solang Paragliding", "Beas River White Water Rafting", "Alpine Pine Forest Trek", "Quad Biking"]
    },
    {
      id: "himachal-explorer",
      name: "Himachal Valley Explorer",
      destination: "Shimla & Spiti",
      country: "Himachal Pradesh, India",
      image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80",
      duration: "5 Days / 4 Nights",
      durationDays: 5,
      price: "₹18,999",
      numericPrice: 18999,
      hotelCategory: "Alpine Boutique Hotel",
      meals: "All Meals Included",
      transport: "Private SUV Coach",
      attractionsCount: 8,
      activitiesCount: 5,
      rating: 4.8,
      description: "Colonial Shimla Ridge, Kufri slopes, Apple Orchards, and majestic mountain vistas.",
      attractionsList: ["The Ridge & Mall Road", "Jakhoo Hill Temple", "Kufri Adventure Park", "Chail Palace", "Narkanda Peak", "Hatu Peak Temple", "Viceregal Lodge", "Tara Devi Temple"],
      activitiesList: ["Heritage Toy Train Ride", "Horse Riding in Kufri", "Apple Orchard Camping", "Zip-line Trail", "Ice Skating"]
    },
    {
      id: "rishikesh-rafting",
      name: "Rishikesh Rafting & Camping",
      destination: "Rishikesh",
      country: "Uttarakhand, India",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
      duration: "3 Days / 2 Nights",
      durationDays: 3,
      price: "₹8,500",
      numericPrice: 8500,
      hotelCategory: "Luxury Riverside Eco-Camp",
      meals: "All Meals Included",
      transport: "Private Pick & Drop Shuttles",
      attractionsCount: 4,
      activitiesCount: 6,
      rating: 4.7,
      description: "Ganga white-water rapids, cliff jumping, Beatles Ashram, and evening Ganga Aarti.",
      attractionsList: ["Laxman Jhula & Ram Jhula", "Beatles Ashram", "Triveni Ghat", "Neer Garh Waterfall"],
      activitiesList: ["16km White Water Rafting", "Cliff Jumping", "Bungee Jumping", "Riverside Campfire & Music", "Sunrise Yoga Session", "Zipline across Ganga"]
    }
  ],
  culture: [
    {
      id: "jaipur-royal",
      name: "Royal Jaipur & Amber Heritage",
      destination: "Jaipur",
      country: "Rajasthan, India",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
      duration: "3 Days / 2 Nights",
      durationDays: 3,
      price: "₹10,499",
      numericPrice: 10499,
      hotelCategory: "Heritage Palace Haveli",
      meals: "Royal Breakfast & Dinner Included",
      transport: "Private AC Cab & Local Guide",
      attractionsCount: 6,
      activitiesCount: 3,
      rating: 4.8,
      description: "Amber Fort Sheesh Mahal, Hawa Mahal windows, Johari Bazaar shopping, and Chokhi Dhani.",
      attractionsList: ["Amber Fort Palace", "Hawa Mahal", "City Palace & Peacock Gate", "Jantar Mantar Sundial", "Nahargarh Fort", "Jal Mahal Lake View"],
      activitiesList: ["Chokhi Dhani Rajasthani Village Feast", "Bazaars Craft & Bandhani Tour", "Heritage Light & Sound Show"]
    },
    {
      id: "udaipur-romance",
      name: "Udaipur Romantic Palaces",
      destination: "Udaipur",
      country: "Rajasthan, India",
      image: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800&auto=format&fit=crop&q=80",
      duration: "4 Days / 3 Nights",
      durationDays: 4,
      price: "₹16,200",
      numericPrice: 16200,
      hotelCategory: "Lakefront Heritage Resort",
      meals: "Breakfast & Sunset Drinks Included",
      transport: "Private AC Sedan & Boat",
      attractionsCount: 5,
      activitiesCount: 4,
      rating: 4.9,
      description: "Sunset boat cruise on Lake Pichola, City Palace royal courtyard, and rooftop lake dining.",
      attractionsList: ["City Palace Complex", "Lake Pichola & Jagmandir", "Saheliyon Ki Bari", "Bagore Ki Haveli", "Sajjangarh Monsoon Palace"],
      activitiesList: ["Lake Pichola Sunset Boat Cruise", "Dharohar Folk Cultural Dance", "Rooftop Candlelight Lake Dining", "Vintage Car Museum Walk"]
    },
    {
      id: "varanasi-ghats",
      name: "Varanasi Spiritual & Heritage Trail",
      destination: "Varanasi",
      country: "Uttar Pradesh, India",
      image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80",
      duration: "3 Days / 2 Nights",
      durationDays: 3,
      price: "₹9,200",
      numericPrice: 9200,
      hotelCategory: "Boutique Heritage Hotel",
      meals: "Breakfast & Dinner Included",
      transport: "Private Cab & Boat Transfer",
      attractionsCount: 5,
      activitiesCount: 3,
      rating: 4.7,
      description: "Subah-e-Banaras sunrise boat ride, Dashashwamedh Ganga Aarti, and Sarnath stupas.",
      attractionsList: ["Dashashwamedh Ghat", "Kashi Vishwanath Temple", "Sarnath Deer Park & Stupa", "Assi Ghat", "Manikarnika Heritage Walk"],
      activitiesList: ["Sunrise Wooden Boat Cruise", "Grand Evening Ganga Aarti Ceremony", "Banarasi Silk Weaver Trail"]
    }
  ],
  nature: [
    {
      id: "kerala-backwaters",
      name: "Kerala Backwaters & Munnar Tea",
      destination: "Kerala",
      country: "India",
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80",
      duration: "4 Days / 3 Nights",
      durationDays: 4,
      price: "₹17,800",
      numericPrice: 17800,
      hotelCategory: "Deluxe Houseboat & Tea Resort",
      meals: "All Meals Included",
      transport: "Private AC Cab & Houseboat",
      attractionsCount: 6,
      activitiesCount: 4,
      rating: 4.9,
      description: "Overnight Alleppey houseboat, rolling Munnar tea gardens, and spice plantations.",
      attractionsList: ["Alleppey Backwaters", "Munnar Tea Estates", "Eravikulam National Park", "Fort Kochi Chinese Fishing Nets", "Mattupetty Dam", "Spice Gardens Thekkady"],
      activitiesList: ["Overnight Houseboat Stay & Feast", "Tea Processing Plantation Walk", "Ayurvedic Massage Session", "Kathakali Cultural Dance"]
    },
    {
      id: "coorg-coffee",
      name: "Coorg Coffee Trails & Wellness",
      destination: "Coorg",
      country: "Karnataka, India",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
      duration: "3 Days / 2 Nights",
      durationDays: 3,
      price: "₹12,800",
      numericPrice: 12800,
      hotelCategory: "Coffee Plantation Villa",
      meals: "Breakfast & Dinner Included",
      transport: "Private SUV Transport",
      attractionsCount: 4,
      activitiesCount: 3,
      rating: 4.8,
      description: "Mist-covered coffee estates, Abbey Falls, Namdroling Monastery, and organic dining.",
      attractionsList: ["Abbey Falls", "Raja's Seat Sunset View", "Namdroling Golden Temple Bylakuppe", "Dubare Elephant Camp"],
      activitiesList: ["Guided Coffee Tasting & Estate Trail", "Elephant Interaction Session", "Raja's Seat Musical Fountain"]
    },
    {
      id: "wayanad-rainforest",
      name: "Wayanad Rainforest & Safari",
      destination: "Wayanad",
      country: "Kerala, India",
      image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&auto=format&fit=crop&q=80",
      duration: "3 Days / 2 Nights",
      durationDays: 3,
      price: "₹11,500",
      numericPrice: 11500,
      hotelCategory: "Eco Lodge & Treehouse",
      meals: "Breakfast & Dinner Included",
      transport: "Private Cab & Jeep Safari",
      attractionsCount: 5,
      activitiesCount: 4,
      rating: 4.7,
      description: "Heart-shaped Chembra Lake trek, Edakkal caves, Banasura Sagar dam, and wildlife safari.",
      attractionsList: ["Chembra Peak & Heart Lake", "Edakkal Prehistoric Caves", "Banasura Sagar Dam", "Muthanga Wildlife Sanctuary", "Meenmutty Waterfalls"],
      activitiesList: ["Forest Jeep Safari", "Zip-line across Banasura Lake", "Bamboo Rafting", "Edakkal Cave Rock Petroglyphs Trail"]
    }
  ],
  food: [
    {
      id: "delhi-food-crawl",
      name: "Old Delhi Heritage & Street Food Crawl",
      destination: "Delhi",
      country: "India",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
      duration: "2 Days / 1 Night",
      durationDays: 2,
      price: "₹7,999",
      numericPrice: 7999,
      hotelCategory: "Boutique Heritage Hotel",
      meals: "All Food Crawls & Feast Included",
      transport: "Guided E-Rickshaw & Private AC Cab",
      attractionsCount: 6,
      activitiesCount: 3,
      rating: 4.8,
      description: "Chandni Chowk legendary paranthas, Karim's kebabs, Red Fort, and Khari Baoli spice market.",
      attractionsList: ["Chandni Chowk Food Lane", "Red Fort", "Jama Masjid & Karim's", "Khari Baoli Spice Market", "Humayun's Tomb", "Qutub Minar"],
      activitiesList: ["Curated 10-Stop Paranthe Wali Gali Food Trail", "Spice Market Roof Tasting", "E-Rickshaw Heritage Ride"]
    },
    {
      id: "amritsar-gourmet",
      name: "Amritsar Golden Temple & Culinary Trail",
      destination: "Amritsar",
      country: "Punjab, India",
      image: "https://images.unsplash.com/photo-1609949279531-cf48d64bed89?w=800&auto=format&fit=crop&q=80",
      duration: "3 Days / 2 Nights",
      durationDays: 3,
      price: "₹8,999",
      numericPrice: 8999,
      hotelCategory: "4-Star City Hotel",
      meals: "Dhaba Tastings & Langar Included",
      transport: "Private AC Cab",
      attractionsCount: 4,
      activitiesCount: 3,
      rating: 4.9,
      description: "Golden Temple serenity, Kesar da Dhaba Amritsari Kulcha, and Wagah Border parade.",
      attractionsList: ["Sri Harmandir Sahib (Golden Temple)", "Jallianwala Bagh Memorial", "Wagah Border Retreat", "Partition Museum"],
      activitiesList: ["Golden Temple Mega Kitchen Langar Service", "Kesar Da Dhaba Culinary Trail", "Wagah Border Beating Retreat Ceremony"]
    },
    {
      id: "pondicherry-gourmet",
      name: "Pondicherry French Gourmet & Beach",
      destination: "Pondicherry",
      country: "India",
      image: "https://images.unsplash.com/photo-1616843413587-9e3a37f7bbd8?w=800&auto=format&fit=crop&q=80",
      duration: "3 Days / 2 Nights",
      durationDays: 3,
      price: "₹13,400",
      numericPrice: 13400,
      hotelCategory: "French Colonial Guest House",
      meals: "Gourmet Breakfast & Bakery Tasting Included",
      transport: "Private AC Sedan & Vintage Scooters",
      attractionsCount: 5,
      activitiesCount: 3,
      rating: 4.8,
      description: "French Quarter yellow villas, wood-fired artisan bakeries, Promenade Beach, and Matrimandir.",
      attractionsList: ["White Town French Quarter", "Promenade Beach", "Auroville Matrimandir Dome", "Paradise Beach", "Sri Aurobindo Ashram"],
      activitiesList: ["French Bakery & Croissant Tasting Crawl", "Auroville Organic Cafe Tour", "Heritage Villa Cycling Trail"]
    }
  ],
  family: [
    {
      id: "ooty-family",
      name: "Ooty & Kodaikanal Family Retreat",
      destination: "Ooty",
      country: "Tamil Nadu, India",
      image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&auto=format&fit=crop&q=80",
      duration: "4 Days / 3 Nights",
      durationDays: 4,
      price: "₹15,999",
      numericPrice: 15999,
      hotelCategory: "Family Suite Resort",
      meals: "Breakfast & Dinner Included",
      transport: "Private AC Innova / Tempo",
      attractionsCount: 7,
      activitiesCount: 4,
      rating: 4.8,
      description: "Nilgiri Toy Train, Ooty Lake boating, Botanical Gardens, and Homemade Chocolate tasting.",
      attractionsList: ["Ooty Botanical Gardens", "Ooty Lake & Boating", "Doddabetta Peak", "Tea Factory & Chocolate Museum", "Pykara Waterfalls", "Rose Garden", "Pine Forest"],
      activitiesList: ["UNESCO Heritage Nilgiri Toy Train Ride", "Family Pedal Boating on Ooty Lake", "Homemade Chocolate Making Workshop", "Tea Plantation Walk"]
    },
    {
      id: "kashmir-family",
      name: "Kashmir Valley Family Magic",
      destination: "Srinagar & Gulmarg",
      country: "Jammu & Kashmir, India",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80",
      duration: "5 Days / 4 Nights",
      durationDays: 5,
      price: "₹22,999",
      numericPrice: 22999,
      hotelCategory: "Premium Houseboat & Resort",
      meals: "All Meals Included",
      transport: "Private AC SUV",
      attractionsCount: 8,
      activitiesCount: 5,
      rating: 4.9,
      description: "Dal Lake Shikara ride, Gulmarg Gondola snow ride, Pahalgam Betaab Valley, and Mughal Gardens.",
      attractionsList: ["Dal Lake Srinagar", "Gulmarg Snow Meadows", "Pahalgam Betaab Valley", "Shalimar Bagh Mughal Garden", "Nishat Bagh", "Chashme Shahi", "Aru Valley", "Sonamarg Glacier Point"],
      activitiesList: ["Sunset Shikara Ride on Dal Lake", "Gulmarg Gondola Cable Car Ride", "Ponies Ride in Betaab Valley", "Saffron Farm Visit & Kahwa Tasting", "Overnight Luxury Houseboat Stay"]
    },
    {
      id: "golden-triangle",
      name: "Golden Triangle Express (Delhi-Agra-Jaipur)",
      destination: "Delhi, Agra & Jaipur",
      country: "India",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
      duration: "5 Days / 4 Nights",
      durationDays: 5,
      price: "₹19,500",
      numericPrice: 19500,
      hotelCategory: "4-Star Family Hotels",
      meals: "Buffet Breakfast Included",
      transport: "Private AC Coach & Express Train",
      attractionsCount: 9,
      activitiesCount: 4,
      rating: 4.8,
      description: "Taj Mahal sunrise Wonder of World, Agra Fort, Jaipur Amber Fort, and Delhi monuments.",
      attractionsList: ["Taj Mahal Agra", "Agra Fort", "Amber Fort Jaipur", "Hawa Mahal", "Qutub Minar Delhi", "India Gate", "Fatehpur Sikri", "City Palace Jaipur", "Humayun's Tomb"],
      activitiesList: ["Sunrise Taj Mahal Guided Tour", "Marble Inlay Craft Workshop", "Vande Bharat Express Train Ride", "Jaipur Cultural Night"]
    }
  ]
}

export function PackageComparison({ onNavigateView, onSelectDestination, onOpenAuth }) {
  const { selectPackageAndBuildTrip, selectedPackage } = useTrip()

  const [activeCategory, setActiveCategory] = useState("beach")
  const [selectedForCompare, setSelectedForCompare] = useState(["goa-escape", "gokarna-getaway"])
  const [viewingPackageModal, setViewingPackageModal] = useState(null)
  const [compareMode, setCompareMode] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // Current Category Packages
  const currentCategoryPackages = useMemo(() => {
    return PACKAGE_DATA[activeCategory] || PACKAGE_DATA.beach
  }, [activeCategory])

  // Get packages selected for comparison
  const allPackages = useMemo(() => {
    return Object.values(PACKAGE_DATA).flat()
  }, [])

  const comparedPackagesList = useMemo(() => {
    return allPackages.filter((p) => selectedForCompare.includes(p.id))
  }, [allPackages, selectedForCompare])

  // Toggle package selection for comparison
  const toggleCompare = (pkgId) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(pkgId)) {
        return prev.filter((id) => id !== pkgId)
      }
      if (prev.length >= 3) {
        return [prev[0], prev[1], pkgId]
      }
      return [...prev, pkgId]
    })
  }

  // Handle Add to Trip
  const handleAddToTrip = (pkg) => {
    selectPackageAndBuildTrip(pkg)
    setToastMessage(`✓ ${pkg.name} added to your itinerary!`)
    setTimeout(() => {
      setToastMessage(null)
    }, 6000)
  }

  return (
    <section id="packages" className="relative w-full min-h-screen py-16 md:py-24 bg-[#0D2B45] text-white select-none font-sans">
      
      {/* Ambient Radial Gradient Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-[#0D2B45] to-[#0A2238] pointer-events-none" />

      {/* Confirmation Toast Bar */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl bg-emerald-500 text-white px-6 py-3.5 shadow-2xl border border-white/20 text-sm font-semibold"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>{toastMessage}</span>
            <Button
              size="sm"
              onClick={() => onNavigateView && onNavigateView("itinerary")}
              className="ml-2 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-xs px-3.5 py-1.5 shadow"
            >
              View My Itinerary →
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
        
        {/* 1. Header Section (Green badge removed as requested) */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase leading-none drop-shadow-lg">
            Find & Compare Packages
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Select your dream vacation style, compare packages side-by-side, and import seamlessly into your personal Itinerary.
          </p>
        </div>

        {/* 2. Vacation Category Selector (Emojis removed) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xs uppercase tracking-widest text-slate-400 font-bold">
              1. Select Vacation Category
            </h3>
            {selectedForCompare.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCompareMode(!compareMode)}
                className={`rounded-xl border-white/20 text-xs font-semibold px-4 transition-all ${
                  compareMode ? "bg-teal-500 text-slate-950 border-teal-400" : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                <ArrowRightLeft className="mr-1.5 h-3.5 w-3.5" />
                {compareMode ? "Back to Cards" : `Compare Selected (${selectedForCompare.length})`}
              </Button>
            )}
          </div>

          {/* Horizontal Scrollable Category Bar (Clean Icon + Text) */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-none">
            {VACATION_CATEGORIES.map((cat) => {
              const IconComp = cat.icon
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id)
                    setCompareMode(false)
                  }}
                  className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                    isActive
                      ? "bg-white text-slate-950 border-white shadow-xl scale-[1.02]"
                      : "bg-white/10 text-slate-300 border-white/10 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  <IconComp className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>{cat.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 3. Package Cards View */}
        {!compareMode && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xs uppercase tracking-widest text-slate-400 font-bold">
                2. Featured Packages — {VACATION_CATEGORIES.find((c) => c.id === activeCategory)?.name}
              </h3>
              <span className="text-xs text-slate-400 font-medium">Showing 3 curated packages</span>
            </div>

            {/* Package Cards Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {currentCategoryPackages.map((pkg) => {
                const isSelectedForCompare = selectedForCompare.includes(pkg.id)
                const isCurrentlyActiveTrip = selectedPackage?.id === pkg.id

                return (
                  <motion.div
                    key={pkg.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`group relative rounded-3xl border bg-white text-slate-900 p-6 shadow-2xl flex flex-col justify-between transition-all hover:border-teal-400 hover:shadow-teal-500/10 ${
                      isCurrentlyActiveTrip ? "ring-2 ring-teal-500 border-teal-500" : "border-white"
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Top Bar: Rating & Destination */}
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 uppercase tracking-wider">
                          <MapPin className="h-3 w-3 text-teal-600" />
                          {pkg.destination}
                        </span>

                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>{pkg.rating}</span>
                        </div>
                      </div>

                      {/* Image Banner */}
                      <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-slate-200">
                        <img
                          src={pkg.image}
                          alt={pkg.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="rounded-xl bg-slate-950/80 backdrop-blur-md text-white font-heading font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 border border-white/20">
                            {pkg.duration}
                          </span>
                        </div>

                        {isCurrentlyActiveTrip && (
                          <div className="absolute top-3 right-3">
                            <span className="rounded-xl bg-teal-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-3 py-1 shadow-md">
                              Active Trip
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1">
                        <h4 className="font-heading text-xl font-extrabold text-slate-900 leading-tight">
                          {pkg.name}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {pkg.description}
                        </p>
                      </div>

                      {/* Key Features Matrix Pill */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Hotel className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                          <span className="truncate font-semibold text-[11px]">{pkg.hotelCategory}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Utensils className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          <span className="truncate font-semibold text-[11px]">{pkg.meals.split(" ")[0]} Meals</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Car className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                          <span className="truncate font-semibold text-[11px]">{pkg.transport.split(" ")[0]} Transport</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Sparkles className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                          <span className="truncate font-semibold text-[11px]">{pkg.attractionsCount} Sights • {pkg.activitiesCount} Acts</span>
                        </div>
                      </div>

                      {/* Price Display (True Trip Cost removed) */}
                      <div className="flex items-baseline justify-between pt-1">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Package Price</span>
                          <span className="font-heading text-2xl font-extrabold text-slate-900">{pkg.price}</span>
                          <span className="text-[11px] text-slate-500 font-medium"> / person</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-5 space-y-2 pt-3 border-t border-slate-200">
                      <div className="grid grid-cols-2 gap-2">
                        {/* View Details */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewingPackageModal(pkg)}
                          className="rounded-xl border-slate-300 text-slate-800 hover:bg-slate-100 font-bold text-xs"
                        >
                          <Eye className="mr-1.5 h-3.5 w-3.5 text-slate-600" />
                          Details
                        </Button>

                        {/* Compare Toggle */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleCompare(pkg.id)}
                          className={`rounded-xl font-bold text-xs transition-all ${
                            isSelectedForCompare
                              ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
                              : "border-slate-300 text-slate-800 hover:bg-slate-100"
                          }`}
                        >
                          <ArrowRightLeft className="mr-1.5 h-3.5 w-3.5" />
                          {isSelectedForCompare ? "✓ Added" : "Compare"}
                        </Button>
                      </div>

                      {/* Add to My Trip CTA */}
                      <Button
                        size="sm"
                        onClick={() => handleAddToTrip(pkg)}
                        className="w-full rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs py-2.5 shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <Plus className="h-4 w-4" />
                        <span>+ Add to My Trip</span>
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* 4. Package Comparison View Matrix */}
        {(compareMode || selectedForCompare.length > 0) && (
          <div className="space-y-8 pt-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-heading text-2xl font-extrabold text-white uppercase">
                  Multi-Package Comparison Matrix
                </h3>
                <p className="text-xs text-slate-300">
                  Comparing {comparedPackagesList.length} packages side-by-side
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCompareMode(!compareMode)}
                  className="rounded-xl border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  {compareMode ? "Hide Matrix" : "Show Full Matrix"}
                </Button>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-hidden rounded-3xl border border-white/20 bg-white text-slate-900 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[750px] font-sans">
                  
                  {/* Table Header */}
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100">
                      <th className="p-5 font-heading text-xs font-extrabold uppercase tracking-widest text-slate-500 w-1/4">
                        Comparison Factor
                      </th>
                      {comparedPackagesList.map((pkg) => (
                        <th key={pkg.id} className="p-5 text-center border-l border-slate-200 w-1/4">
                          <div className="space-y-2">
                            <span className="font-heading text-lg font-extrabold text-slate-900 uppercase block">
                              {pkg.name}
                            </span>
                            <span className="font-heading text-xl font-extrabold text-teal-700 block">
                              {pkg.price}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => handleAddToTrip(pkg)}
                              className="rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-3 py-1 shadow"
                            >
                              + Add to Trip
                            </Button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                    
                    {/* Basic Comparison Factor Rows */}
                    <tr>
                      <td className="p-5 font-semibold text-slate-800">Destination & Country</td>
                      {comparedPackagesList.map((pkg) => (
                        <td key={pkg.id} className="p-5 text-center font-medium border-l border-slate-200">
                          {pkg.destination}, {pkg.country}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-5 font-semibold text-slate-800">Package Price</td>
                      {comparedPackagesList.map((pkg) => (
                        <td key={pkg.id} className="p-5 text-center font-extrabold text-teal-700 text-base border-l border-slate-200">
                          {pkg.price}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-5 font-semibold text-slate-800">Duration</td>
                      {comparedPackagesList.map((pkg) => (
                        <td key={pkg.id} className="p-5 text-center font-bold text-slate-900 border-l border-slate-200">
                          {pkg.duration}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-5 font-semibold text-slate-800">Accommodation</td>
                      {comparedPackagesList.map((pkg) => (
                        <td key={pkg.id} className="p-5 text-center font-medium border-l border-slate-200">
                          {pkg.hotelCategory}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-5 font-semibold text-slate-800">Meals Included</td>
                      {comparedPackagesList.map((pkg) => (
                        <td key={pkg.id} className="p-5 text-center font-medium border-l border-slate-200">
                          {pkg.meals}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-5 font-semibold text-slate-800">Transportation</td>
                      {comparedPackagesList.map((pkg) => (
                        <td key={pkg.id} className="p-5 text-center font-medium border-l border-slate-200">
                          {pkg.transport}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-5 font-semibold text-slate-800">Attractions Included</td>
                      {comparedPackagesList.map((pkg) => (
                        <td key={pkg.id} className="p-5 text-center border-l border-slate-200">
                          <div className="flex flex-wrap justify-center gap-1">
                            {pkg.attractionsList.map((att, i) => (
                              <span key={i} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-800 border border-slate-200">
                                {att}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-5 font-semibold text-slate-800">Activities Included</td>
                      {comparedPackagesList.map((pkg) => (
                        <td key={pkg.id} className="p-5 text-center border-l border-slate-200">
                          <div className="flex flex-wrap justify-center gap-1">
                            {pkg.activitiesList.map((act, i) => (
                              <span key={i} className="rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-900 border border-teal-200">
                                {act}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-5 font-semibold text-slate-800">User Rating</td>
                      {comparedPackagesList.map((pkg) => (
                        <td key={pkg.id} className="p-5 text-center font-bold text-amber-600 border-l border-slate-200 text-sm">
                          ⭐ {pkg.rating} / 5.0
                        </td>
                      ))}
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 5. Package Details Modal */}
      <AnimatePresence>
        {viewingPackageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl rounded-3xl bg-white text-slate-900 p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setViewingPackageModal(null)}
                className="absolute top-5 right-5 h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-3 border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 uppercase tracking-wider">
                  {viewingPackageModal.duration} • {viewingPackageModal.destination}
                </span>
                <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-900">
                  {viewingPackageModal.name}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {viewingPackageModal.description}
                </p>
              </div>

              {/* Image */}
              <div className="relative h-52 w-full rounded-2xl overflow-hidden border border-slate-200">
                <img
                  src={viewingPackageModal.image}
                  alt={viewingPackageModal.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Included Attractions List */}
              <div className="space-y-3">
                <h4 className="font-heading text-xs font-extrabold uppercase tracking-widest text-slate-500">
                  Included Attractions ({viewingPackageModal.attractionsList.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {viewingPackageModal.attractionsList.map((att, idx) => (
                    <span key={idx} className="rounded-xl bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-800">
                      📍 {att}
                    </span>
                  ))}
                </div>
              </div>

              {/* Included Activities List */}
              <div className="space-y-3">
                <h4 className="font-heading text-xs font-extrabold uppercase tracking-widest text-slate-500">
                  Included Curated Activities ({viewingPackageModal.activitiesList.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {viewingPackageModal.activitiesList.map((act, idx) => (
                    <span key={idx} className="rounded-xl bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-semibold text-teal-900">
                      ✨ {act}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Package Price</span>
                  <span className="font-heading text-2xl font-extrabold text-slate-900">{viewingPackageModal.price}</span>
                </div>

                <Button
                  onClick={() => {
                    handleAddToTrip(viewingPackageModal)
                    setViewingPackageModal(null)
                  }}
                  className="rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm px-6 py-3 shadow-lg"
                >
                  + Add to My Trip
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  )
}
