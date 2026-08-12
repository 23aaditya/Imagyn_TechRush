import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Mail,
  Phone,
  Camera,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Lock,
  Globe,
  Compass,
  Star,
  Coins,
  Edit3,
  X,
  AlertCircle,
  Calendar,
  Briefcase,
  Luggage,
  Map as MapIcon,
  ChevronRight,
  Clock,
  Navigation,
  DollarSign,
  Tag,
  Share2,
  ExternalLink,
  ChevronDown,
  FileText,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTrip } from "@/context/trip-context"
import { DoodleBackground } from "@/components/doodle-background"

// Visited Places Dataset featuring Explore destination photos & full itineraries
const VISITED_PLACES_BADGES = [
  {
    id: "place-manali",
    name: "Manali",
    spotName: "Solang Valley & Snow Peaks",
    date: "Mar 2024",
    duration: "4 Days / 3 Nights",
    category: "Mountain & Snow Adventure",
    totalSpent: "₹24,500",
    vibe: "Snowy Peak & Paragliding",
    rating: "4.6 ⭐",
    borderColor: "border-teal-500/40",
    glowColor: "shadow-teal-500/20",
    tagColor: "text-teal-400 border-teal-500/30 bg-teal-500/10",
    image: "/images/dest-manali.png",
    description: "Nestled in the Himalayas of Himachal Pradesh, Manali offered breathtaking snow peaks, Atal Tunnel exploration, and adventure sports in Solang Valley.",
    itinerary: [
      {
        day: 1,
        title: "Mall Road Exploration & Hadimba Temple",
        spots: [
          { time: "09:30 AM", title: "Hadimba Devi Temple", desc: "Ancient 1553 cave temple amidst towering Dhungri Deodar forests.", cost: "₹50" },
          { time: "01:00 PM", title: "Cafe Hopping in Old Manali", desc: "Tasted wood-fired trout fish and apple cider at Cafe 1947.", cost: "₹850" },
          { time: "05:00 PM", title: "Vashisht Hot Springs", desc: "Sulfur mineral natural hot springs near Beas river banks.", cost: "Free" }
        ]
      },
      {
        day: 2,
        title: "Solang Valley Snow Sports & Ropeway",
        spots: [
          { time: "09:00 AM", title: "Solang Valley Ropeway Ride", desc: "Cable car ascent up to 9,000 ft altitude offering panoramic snow peak vistas.", cost: "₹700" },
          { time: "11:30 AM", title: "Tandem Paragliding", desc: "Soared over snow slope valleys with certified flight instructors.", cost: "₹3,200" },
          { time: "04:00 PM", title: "Zorbing & Quad Biking", desc: "High-adrenaline ATV quad trail through snow tracks.", cost: "₹1,100" }
        ]
      },
      {
        day: 3,
        title: "Atal Tunnel & Sissu Waterfall Trail",
        spots: [
          { time: "08:30 AM", title: "Atal Tunnel Drive (9.02 km)", desc: "World's longest highway tunnel above 10,000 ft connecting Manali to Lahaul Valley.", cost: "₹400" },
          { time: "11:00 AM", title: "Sissu Waterfall Hike", desc: "Majestic glacial waterfall cascade against barren Lahaul mountain terrain.", cost: "Free" },
          { time: "07:00 PM", title: "Bonfire & Local Himachali Dham Dinner", desc: "Traditional slow-cooked fermented SIDDU dumplings and local thali.", cost: "₹650" }
        ]
      },
      {
        day: 4,
        title: "Beas River Rafting & Souvenir Shopping",
        spots: [
          { time: "10:00 AM", title: "Kullu Beas White Water Rafting", desc: "Conquered Grade III rapids along 7 km stretch of icy Beas river.", cost: "₹1,200" },
          { time: "02:00 PM", title: "Himachal Handloom & Shawl Shopping", desc: "Bought authentic Kullu wool shawls and saffron at Himachal Emporium.", cost: "₹2,500" }
        ]
      }
    ]
  },
  {
    id: "place-goa",
    name: "Goa",
    spotName: "Palolem Beach & Palms",
    date: "Dec 2023",
    duration: "5 Days / 4 Nights",
    category: "Beach & Tropical Palms",
    totalSpent: "₹32,000",
    vibe: "Sunset Shacks & Watersports",
    rating: "4.8 ⭐",
    borderColor: "border-amber-500/40",
    glowColor: "shadow-amber-500/20",
    tagColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    image: "/images/dest-goa.png",
    description: "Sun-kissed beaches, golden sand coastlines, Portuguese colonial heritage churches, and energetic beach shacks along North and South Goa.",
    itinerary: [
      {
        day: 1,
        title: "Calangute & Baga Beach Arrival",
        spots: [
          { time: "11:00 AM", title: "Calangute Beach Watersports", desc: "Parasailing & Jet-Skiing along North Goa coastline.", cost: "₹1,800" },
          { time: "04:30 PM", title: "Curlies Shack Sunset Lounge", desc: "Chilled kingfisher beer & prawn balchão overlooking the Arabian Sea.", cost: "₹1,200" },
          { time: "09:00 PM", title: "Tito's Lane Night Walk", desc: "Iconic nightlife strip with live music and DJ performances.", cost: "₹1,500" }
        ]
      },
      {
        day: 2,
        title: "Old Goa Heritage & Latin Quarter",
        spots: [
          { time: "09:30 AM", title: "Basilica of Bom Jesus", desc: "UNESCO World Heritage 16th-century church housing St. Francis Xavier mortal remains.", cost: "Free" },
          { time: "01:00 PM", title: "Fontainhas Latin Quarter Stroll", desc: "Photowalk across vibrant yellow & blue Portuguese colonial heritage homes.", cost: "Free" },
          { time: "06:30 PM", title: "Mandovi River Sunset Cruise", desc: "1-hour catamaran boat ride with traditional Fugdi folk dance and music.", cost: "₹500" }
        ]
      },
      {
        day: 3,
        title: "Dudhsagar Waterfalls Jeep Safari",
        spots: [
          { time: "07:00 AM", title: "Bhagwan Mahavir Sanctuary Jeep Ride", desc: "Off-road jungle safari through Mollem National Park.", cost: "₹850" },
          { time: "10:30 AM", title: "Dudhsagar 4-Tier Milk Cascade", desc: "Swimming in freshwater pool at base of 310m towering waterfall.", cost: "Free" },
          { time: "02:00 PM", title: "Sahakari Spice Plantation Tour", desc: "Traditional Goan buffet lunch served on banana leaf with fresh cardamom spice tea.", cost: "₹600" }
        ]
      },
      {
        day: 4,
        title: "South Goa Serenity & Palolem Kayaking",
        spots: [
          { time: "09:00 AM", title: "Palolem Crescent Beach Kayaking", desc: "Paddled out to Monkey Island across calm turquoise sea waters.", cost: "₹400" },
          { time: "01:00 PM", title: "Agonda Beach Seafood Grill", desc: "Fresh butter garlic crabs and fish thali at Fisherman's Cove.", cost: "₹1,400" }
        ]
      }
    ]
  },
  {
    id: "place-jaipur",
    name: "Jaipur",
    spotName: "Hawa Mahal & Amber Palace",
    date: "Oct 2023",
    duration: "3 Days / 2 Nights",
    category: "Royal Pink Palace",
    totalSpent: "₹18,900",
    vibe: "Palaces, Forts & Markets",
    rating: "4.7 ⭐",
    borderColor: "border-pink-500/40",
    glowColor: "shadow-pink-500/20",
    tagColor: "text-pink-400 border-pink-500/30 bg-pink-500/10",
    image: "/images/dest-jaipur.png",
    description: "The Royal Pink City of Rajasthan, adorned with majestic sandstone forts, ornate palaces, Sheesh Mahal glasswork, and famous Rajasthani thali cuisine.",
    itinerary: [
      {
        day: 1,
        title: "Amer Fort & Sheesh Mahal Mirror Magic",
        spots: [
          { time: "09:00 AM", title: "Amer Fort Guided Tour", desc: "Majestic hilltop fort with Diwan-i-Aam, Sheesh Mahal mirror courtyard & Maota Lake.", cost: "₹500" },
          { time: "01:30 PM", title: "Panna Meena ka Kund Stepwell", desc: "Geometric 16th-century symmetrical staircases photowalk.", cost: "Free" },
          { time: "06:00 PM", title: "Nahargarh Fort Sunset Point", desc: "Stunning aerial evening view of pink lit Jaipur cityscape.", cost: "₹200" }
        ]
      },
      {
        day: 2,
        title: "Hawa Mahal, City Palace & Observatory",
        spots: [
          { time: "08:30 AM", title: "Hawa Mahal Morning Photowalk", desc: "Palace of Winds with 953 intricate honeycomb lattice windows.", cost: "₹100" },
          { time: "11:00 AM", title: "Jaipur City Palace Museum", desc: "Royal residence housing Maharaja's weapons, ceremonial costumes & Chandra Mahal.", cost: "₹700" },
          { time: "03:00 PM", title: "Jantar Mantar Astronomical Site", desc: "UNESCO astronomical observatory featuring world's largest stone sundial.", cost: "₹200" }
        ]
      },
      {
        day: 3,
        title: "Bapu Bazaar Shopping & Chokhi Dhani",
        spots: [
          { time: "11:00 AM", title: "Bapu & Johari Bazaar Handicrafts", desc: "Shopping for Mojris leather shoes, Jaipuri razai quilts & silver jewelry.", cost: "₹3,500" },
          { time: "07:00 PM", title: "Chokhi Dhani Ethnic Resort Experience", desc: "Puppet shows, folk music, camel rides & authentic Royal Rajasthani Thali.", cost: "₹1,200" }
        ]
      }
    ]
  },
  {
    id: "place-udaipur",
    name: "Udaipur",
    spotName: "Lake Pichola & Taj Palace",
    date: "Aug 2023",
    duration: "4 Days / 3 Nights",
    category: "Lakes & Royal Havelis",
    totalSpent: "₹28,400",
    vibe: "Lake Pichola & Royalty",
    rating: "4.9 ⭐",
    borderColor: "border-blue-500/40",
    glowColor: "shadow-blue-500/20",
    tagColor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    image: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f1c?w=800&auto=format&fit=crop&q=80",
    description: "The Venice of the East! Grand lakeside havelis, serene boat rides on Lake Pichola, Monsoon Palace hill sunsets, and royal Mewar heritage.",
    itinerary: [
      {
        day: 1,
        title: "City Palace & Lake Pichola Boat Ride",
        spots: [
          { time: "10:00 AM", title: "Udaipur City Palace Complex", desc: "Largest palace complex in Rajasthan with peacocks mosaic courtyards.", cost: "₹400" },
          { time: "04:30 PM", title: "Lake Pichola Sunset Boat Cruise", desc: "Cruised past Taj Lake Palace & Jagmandir Island palace during dusk.", cost: "₹800" },
          { time: "08:00 PM", title: "Udai Kothi Lakefront Dinner", desc: "Rooftop candlelit dining with direct view of illuminated City Palace.", cost: "₹1,600" }
        ]
      },
      {
        day: 2,
        title: "Saheliyon Ki Bari & Cultural Dance Show",
        spots: [
          { time: "09:30 AM", title: "Saheliyon Ki Bari Gardens", desc: "Royal marble fountains, lotus pools, and lush green elephant statues.", cost: "₹50" },
          { time: "02:00 PM", title: "Jagdish Temple Sculptures", desc: "1651 Indo-Aryan architecture carved temple in old city.", cost: "Free" },
          { time: "07:00 PM", title: "Dharohar Folk Dance at Bagore Ki Haveli", desc: "Enchanting 1-hour Rajasthani puppet & Chari dance by heritage artists.", cost: "₹150" }
        ]
      },
      {
        day: 3,
        title: "Monsoon Palace & Fateh Sagar Lakefront",
        spots: [
          { time: "04:00 PM", title: "Sajjangarh (Monsoon Palace)", desc: "Hilltop fortress providing panoramic sunset view over Aravalli mountains & Udaipur lakes.", cost: "₹300" },
          { time: "07:30 PM", title: "Fateh Sagar Lake Street Food Promenade", desc: "Tasted famous Kulhad coffee, pav bhaji & momos at Mumbai Bazzar stall.", cost: "₹350" }
        ]
      }
    ]
  },
  {
    id: "place-varanasi",
    name: "Varanasi",
    spotName: "Kashi Ghats & Ganga Aarti",
    date: "Jul 2023",
    duration: "3 Days / 2 Nights",
    category: "Spiritual Ghats & Diya",
    totalSpent: "₹14,200",
    vibe: "Ganga Aarti & Ghat Trails",
    rating: "4.8 ⭐",
    borderColor: "border-orange-500/40",
    glowColor: "shadow-orange-500/20",
    tagColor: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80",
    description: "One of the world's oldest living cities on the banks of sacred River Ganga. Experience mesmerising evening Ganga Aarti, sunrise boat rides, and narrow heritage alleys.",
    itinerary: [
      {
        day: 1,
        title: "Assi Ghat Sunrise & Evening Aarti",
        spots: [
          { time: "05:30 AM", title: "Subah-e-Banaras at Assi Ghat", desc: "Vedic morning chanting, classical raga music & sun salutation yoga on ghats.", cost: "Free" },
          { time: "11:00 AM", title: "Banarasi Silk Saree Weaving Alley", desc: "Witnessed centuries-old handloom weaving in Madanpura quarter.", cost: "Free" },
          { time: "06:30 PM", title: "Dashashwamedh Ghat Ganga Aarti", desc: "Grand spiritual multi-priest brass lamp ritual along River Ganges.", cost: "Free" }
        ]
      },
      {
        day: 2,
        title: "Kashi Vishwanath Corridor & Sarnath Trip",
        spots: [
          { time: "08:00 AM", title: "Kashi Vishwanath Temple Corridor", desc: "Darsan at sacred Jyotirlinga shrine near Manikarnika ghat.", cost: "Free" },
          { time: "01:30 PM", title: "Sarnath Deer Park & Dhamek Stupa", desc: "Historical Buddhist site where Lord Buddha delivered his first sermon.", cost: "₹200" },
          { time: "06:00 PM", title: "Blue Lassi & Malaiyyo Street Tasting", desc: "Sampled famous saffron pistachios thick curd lassi in clay cup.", cost: "₹180" }
        ]
      }
    ]
  },
  {
    id: "place-munnar",
    name: "Munnar",
    spotName: "KDHP Tea Gardens",
    date: "May 2023",
    duration: "4 Days / 3 Nights",
    category: "Green Tea Hills",
    totalSpent: "₹21,800",
    vibe: "Tea Gardens & Mist",
    rating: "4.8 ⭐",
    borderColor: "border-emerald-500/40",
    glowColor: "shadow-emerald-500/20",
    tagColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    image: "/images/dest-kerala.png",
    description: "Lush green rolling tea plantations of Western Ghats in Kerala, mist-covered valleys, endangered Nilgiri Tahr wildlife, and cascading waterfalls.",
    itinerary: [
      {
        day: 1,
        title: "Tea Plantations & Tata Tea Museum",
        spots: [
          { time: "10:00 AM", title: "KDHP Tea Estates Photowalk", desc: "Strolled through carpeted emerald green tea garden hills.", cost: "Free" },
          { time: "02:00 PM", title: "Tata Tea Processing Museum", desc: "Learned CTC tea fermentation and black tea leaf processing.", cost: "₹150" }
        ]
      },
      {
        day: 2,
        title: "Eravikulam National Park & Anamudi View",
        spots: [
          { time: "08:30 AM", title: "Eravikulam Sanctuary Safari", desc: "Spotted endangered Nilgiri Tahr mountain goats along Rajamalai peak.", cost: "₹300" },
          { time: "01:00 PM", title: "Anamudi Peak Vantage Point", desc: "Highest peak in South India (2,695m) view amidst heavy clouds.", cost: "Free" }
        ]
      },
      {
        day: 3,
        title: "Mattupetty Dam Boat Ride & Echo Point",
        spots: [
          { time: "10:00 AM", title: "Mattupetty Lake Speedboat", desc: "Thrilling boat ride across still mountain lake waters.", cost: "₹600" },
          { time: "02:30 PM", title: "Top Station Cloud Viewpoint", desc: "Panoramic border view where Kerala meets Tamil Nadu cloudline.", cost: "₹100" }
        ]
      }
    ]
  }
]

export function ProfileWorkspace({ onBack, user, onUserUpdate }) {
  const {
    savedTrips,
    markTripAsCompleted,
    deleteSavedTrip,
    setActiveReportTrip,
    setDestination,
    setStartDate,
    setEndDate,
    setDays,
    setItinerary,
    setSavedTripsModalOpen
  } = useTrip()

  // User Profile Form State matching reference photo
  const [profileData, setProfileData] = useState({
    name: "Manthan Agarwal",
    statusBadge: "Explorer",
    email: "manthanagarwal23@gmail.com",
    phone: "+91 98765 43210",
    location: "Pune, Maharashtra, India",
    joinedDate: "Joined May 2025",
    dob: "12 May 2003",
    gender: "Male",
    language: "English",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop&q=80"
  })

  // Sync profile data from user prop or localStorage on mount/update
  useEffect(() => {
    try {
      const activeUser = user || JSON.parse(localStorage.getItem("tripnest_user") || "null")
      if (activeUser) {
        setProfileData((prev) => ({
          ...prev,
          ...activeUser,
          name: activeUser.name || prev.name,
          email: activeUser.email || prev.email,
          phone: activeUser.phone || prev.phone,
          location: activeUser.location || prev.location,
          dob: activeUser.dob || prev.dob,
          gender: activeUser.gender || prev.gender,
          language: activeUser.language || prev.language,
          avatarUrl: activeUser.avatar || activeUser.avatarUrl || prev.avatarUrl,
        }))
      }
    } catch (e) {
      console.error(e)
    }
  }, [user])

  // Load a saved trip into active planner workspace
  const handleLoadTrip = (trip) => {
    if (trip.destination) setDestination(trip.destination)
    if (trip.startDate) setStartDate(trip.startDate)
    if (trip.endDate) setEndDate(trip.endDate)
    if (trip.days) setDays(trip.days)
    if (trip.itinerary) setItinerary(trip.itinerary)
    if (onBack) onBack()
  }

  // Selected visited badge modal state for displaying detailed itinerary
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [activeItineraryDay, setActiveItineraryDay] = useState(1)

  // Edit Profile modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({ ...profileData })

  const handleOpenEdit = () => {
    setEditForm({ ...profileData })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    setProfileData({ ...editForm })
    try {
      localStorage.setItem("tripnest_user", JSON.stringify(editForm))
    } catch (err) {
      console.error(err)
    }
    if (onUserUpdate) {
      onUserUpdate(editForm)
    }
    setIsEditModalOpen(false)
  }

  // Computed Trip Categorizations
  const completedTrips = savedTrips ? savedTrips.filter((t) => t.status === "completed") : []
  const pendingSavedTrips = savedTrips ? savedTrips.filter((t) => t.status !== "completed") : []

  return (
    <section className="relative w-full overflow-hidden min-h-screen bg-background dark:bg-[#11100E] text-foreground dark:text-[#F1ECE2] pt-24 pb-28">
      {/* Travel Doodles Background */}
      <DoodleBackground />
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6 space-y-8">
        
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="rounded-lg border border-border/60 bg-card hover:bg-accent text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back to Overview
            </Button>
            <span className="text-xs text-muted-foreground font-medium">/ My Profile</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              {profileData.statusBadge}
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            HEADER USER PROFILE CARD (MATCHING USER REFERENCE LAYOUT)
           ───────────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border/70 bg-card shadow-sm overflow-hidden text-foreground">
          
          {/* Cover Banner Image */}
          <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-neutral-900">
            <img
              src={profileData.coverUrl}
              alt="Profile Cover Mountain Peak"
              className="h-full w-full object-cover filter brightness-[0.9] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Edit Profile Button (Top Right of Cover) */}
            <button
              onClick={handleOpenEdit}
              className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-lg bg-white/95 px-3.5 py-1.5 text-xs font-bold text-neutral-900 shadow-md backdrop-blur-md transition-all hover:bg-white hover:scale-[1.02] cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5 text-neutral-700" />
              Edit Profile
            </button>
          </div>

          {/* Profile Details Container */}
          <div className="relative px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              
              {/* Left Column: Avatar & User Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                {/* Round Avatar Picture */}
                <div className="relative shrink-0 -mt-16 sm:-mt-20">
                  <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full border-4 border-card bg-card overflow-hidden shadow-xl">
                    <img
                      src={profileData.avatarUrl}
                      alt={profileData.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button
                    onClick={handleOpenEdit}
                    className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border text-foreground shadow-md hover:bg-accent transition-all cursor-pointer"
                    title="Change Avatar Photo"
                  >
                    <Camera className="h-4 w-4 text-emerald-500" />
                  </button>
                </div>

                {/* User Info Block */}
                <div className="space-y-2 pt-1 sm:pt-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                      {profileData.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <Navigation className="h-3 w-3 text-emerald-500" />
                      {profileData.statusBadge}
                    </span>
                  </div>

                  {/* Metadata Info List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-muted-foreground font-medium pt-0.5">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Mail className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="text-foreground/90 font-medium">{profileData.email}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="text-foreground/90 font-medium">{profileData.phone}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="text-foreground/90 font-medium">{profileData.location}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Calendar className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="text-foreground/90 font-medium">{profileData.joinedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: User Travel Stats Card */}
              <div className="rounded-xl border border-emerald-500/20 bg-[#F0FDF4] dark:bg-emerald-950/30 p-4 sm:p-5 w-full md:w-auto min-w-[290px] shrink-0">
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Trips Planned */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <MapIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-heading text-xl font-black text-emerald-700 dark:text-emerald-300 leading-none">
                        {(savedTrips ? savedTrips.length : 0) + 6}
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-900/70 dark:text-emerald-200/70 mt-0.5">Trips Planned</div>
                    </div>
                  </div>

                  {/* Places Visited */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <Luggage className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-heading text-xl font-black text-emerald-700 dark:text-emerald-300 leading-none">
                        {15 + completedTrips.length * 3}
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-900/70 dark:text-emerald-200/70 mt-0.5">Places Visited</div>
                    </div>
                  </div>

                  {/* Countries */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-heading text-xl font-black text-emerald-700 dark:text-emerald-300 leading-none">3</div>
                      <div className="text-[11px] font-semibold text-emerald-900/70 dark:text-emerald-200/70 mt-0.5">Countries</div>
                    </div>
                  </div>

                  {/* Completed Badges */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <Award className="h-5 w-5 fill-amber-400 text-amber-500" />
                    </div>
                    <div>
                      <div className="font-heading text-xl font-black text-emerald-700 dark:text-emerald-300 leading-none">
                        {6 + completedTrips.length}
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-900/70 dark:text-emerald-200/70 mt-0.5">Badges Earned</div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            MY SAVED TRIPS & ACTIVE ITINERARIES SECTION
           ───────────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-7 shadow-sm space-y-5">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
                  My Saved Trips
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Saved itineraries from your planner. Mark trips as completed to unlock profile badges!
                </p>
              </div>
            </div>

            <button
              onClick={() => setSavedTripsModalOpen(true)}
              className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer shrink-0"
            >
              Open Drawer <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Saved Trips List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {(!savedTrips || savedTrips.length === 0) ? (
              <div className="col-span-2 text-center py-8 space-y-2 border border-dashed border-border/60 rounded-xl">
                <Sparkles className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-xs font-bold text-foreground">No Saved Trips Yet</p>
                <p className="text-[11px] text-muted-foreground">Build an itinerary in the Planner workspace and click "Save Trip" to see it here.</p>
              </div>
            ) : (
              savedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="rounded-xl border border-border/80 bg-background/50 p-4 sm:p-5 shadow-xs space-y-3 hover:border-emerald-500/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-heading text-base font-extrabold text-foreground">
                          {trip.destination}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-sm border border-emerald-500/20">
                          {trip.days} Days Itinerary
                        </span>
                        {trip.status === "completed" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                            <Clock className="h-3 w-3 text-amber-500" />
                            Saved Trip
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-3 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {trip.startDate} → {trip.endDate}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          ₹{(trip.totalBudget || 18500).toLocaleString("en-IN")} Est.
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteSavedTrip(trip.id)}
                      className="text-muted-foreground hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete Saved Trip"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
                    {trip.status !== "completed" && (
                      <Button
                        size="sm"
                        onClick={() => markTripAsCompleted(trip.id)}
                        className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Complete Trip
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveReportTrip(trip)}
                      className="rounded-lg text-xs font-bold uppercase tracking-wider px-3 py-1.5 flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      View Pass
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleLoadTrip(trip)}
                      className="rounded-lg text-xs font-bold uppercase tracking-wider px-3 py-1.5 flex items-center gap-1 cursor-pointer text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                    >
                      Open Planner
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            POPULAR PLACES YOU'VE VISITED (EXPLORE DESTINATION BADGES)
           ───────────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-7 shadow-sm space-y-5">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
                  Popular Places You've Visited
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Featured destinations from your travel history. Touch any badge to open full itinerary details!
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedBadge(VISITED_PLACES_BADGES[0])}
              className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer shrink-0"
            >
              View All <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Destination Badges Grid using Explore Photos & Crest Styling */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 pt-1">
            {VISITED_PLACES_BADGES.map((place) => (
              <motion.div
                key={place.id}
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setSelectedBadge(place)
                  setActiveItineraryDay(1)
                }}
                className={`group relative flex flex-col items-center justify-between rounded-2xl border p-3 text-center cursor-pointer transition-all bg-card hover:shadow-xl ${place.borderColor} hover:${place.glowColor}`}
              >
                {/* Destination Photo Frame matching Explore Aesthetic */}
                <div className="relative flex h-36 w-full items-center justify-center rounded-xl overflow-hidden my-0.5 bg-neutral-900 shadow-md">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="h-full w-full object-cover filter contrast-[1.05] transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                  {/* Rating Tag (Top Right) */}
                  <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded-sm text-[8px] font-extrabold text-amber-300 border border-white/10 shadow-xs">
                    {place.rating}
                  </div>

                  {/* Top Place Name Badge Overlay */}
                  <div className="absolute top-2 left-2 text-left">
                    <span className="text-[9px] font-black uppercase tracking-wider text-white drop-shadow-md px-1.5 py-0.5 rounded-sm bg-black/50 border border-white/20">
                      {place.name}
                    </span>
                  </div>

                  {/* Bottom Tourist Spot Title inside Image */}
                  <div className="absolute bottom-2 inset-x-2 text-left z-10">
                    <span className="text-[9.5px] font-extrabold text-white drop-shadow-md truncate block">
                      📍 {place.spotName}
                    </span>
                  </div>
                </div>

                {/* Place Label & Visited Date */}
                <div className="mt-2.5 space-y-0.5 w-full">
                  <h3 className="font-heading text-sm font-extrabold text-foreground group-hover:text-emerald-500 transition-colors truncate">
                    {place.name}
                  </h3>
                  <p className="text-[11px] font-semibold text-muted-foreground">
                    Visited {place.date}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            ACCOUNT INFORMATION SECTION
           ───────────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-7 shadow-sm space-y-5">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <User className="h-4 w-4" />
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
                Account Information
              </h2>
            </div>

            <button
              onClick={handleOpenEdit}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Information
            </button>
          </div>

          {/* Information Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 pt-1">
            
            {/* Full Name */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                <User className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Full Name</span>
              </div>
              <p className="text-sm font-bold text-foreground">{profileData.name}</p>
            </div>

            {/* Email */}
            <div className="space-y-1 sm:col-span-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                <Mail className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Email</span>
              </div>
              <p className="text-sm font-bold text-foreground truncate">{profileData.email}</p>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Phone</span>
              </div>
              <p className="text-sm font-bold text-foreground">{profileData.phone}</p>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                <Calendar className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Date of Birth</span>
              </div>
              <p className="text-sm font-bold text-foreground">{profileData.dob}</p>
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                <User className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Gender</span>
              </div>
              <p className="text-sm font-bold text-foreground">{profileData.gender}</p>
            </div>

            {/* Preferred Language */}
            <div className="space-y-1 lg:col-span-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                <Globe className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Preferred Language</span>
              </div>
              <p className="text-sm font-bold text-foreground">{profileData.language}</p>
            </div>

          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          INTERACTIVE BADGE DETAIL & ITINERARY MODAL (TOUCH BADGE TO OPEN)
         ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBadge(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl text-foreground my-auto"
            >
              {/* Header Image with Crest Badge */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-neutral-900">
                <img
                  src={selectedBadge.image}
                  alt={selectedBadge.name}
                  className="h-full w-full object-cover filter brightness-[0.8] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-black/40 to-black/60" />

                {/* Close Button */}
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="absolute right-4 top-4 rounded-full bg-black/60 p-2 text-white/90 hover:bg-black hover:text-white transition-all border border-white/20 cursor-pointer z-20"
                  aria-label="Close details modal"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Badge Header Overlay */}
                <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between z-10">
                  <div className="space-y-1">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border ${selectedBadge.tagColor}`}>
                      <Sparkles className="h-3 w-3" /> Visited Badge · {selectedBadge.spotName}
                    </span>
                    <h2 className="font-heading text-2xl sm:text-4xl font-black text-white drop-shadow-md">
                      {selectedBadge.name} Itinerary
                    </h2>
                    <p className="text-xs text-white/90 font-semibold">
                      Visited in {selectedBadge.date} · {selectedBadge.duration}
                    </p>
                  </div>

                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[11px] uppercase tracking-wider text-white/80 font-bold">Total Expenses</span>
                    <span className="font-heading text-xl font-black text-emerald-400 drop-shadow-md">{selectedBadge.totalSpent}</span>
                  </div>
                </div>
              </div>

              {/* Modal Body Content */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                
                {/* Description & Key Highlights */}
                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Trip Summary & Overview</h3>
                  <p className="text-xs sm:text-sm text-foreground leading-relaxed font-sans font-medium">
                    {selectedBadge.description}
                  </p>
                </div>

                {/* Day Tabs Switcher */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Completed Day-by-Day Itinerary</h3>
                    <span className="text-xs text-emerald-500 font-extrabold">{selectedBadge.itinerary.length} Days Travel Logged</span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {selectedBadge.itinerary.map((dayItem) => (
                      <button
                        key={dayItem.day}
                        onClick={() => setActiveItineraryDay(dayItem.day)}
                        className={`rounded-lg px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border shrink-0 ${
                          activeItineraryDay === dayItem.day
                            ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                            : "bg-accent/50 border-border/60 text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                      >
                        Day {dayItem.day}
                      </button>
                    ))}
                  </div>

                  {/* Active Day Spots List */}
                  {selectedBadge.itinerary.map((dayItem) => {
                    if (dayItem.day !== activeItineraryDay) return null
                    return (
                      <div key={dayItem.day} className="space-y-3 animate-in fade-in duration-200 pt-1">
                        <h4 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
                          <Compass className="h-4 w-4 text-emerald-500" />
                          {dayItem.title}
                        </h4>

                        <div className="space-y-2.5">
                          {dayItem.spots.map((spot, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-border/60 bg-accent/30 p-3.5 space-y-1 transition-all hover:bg-accent/60"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                    <Clock className="h-3 w-3" /> {spot.time}
                                  </span>
                                  <h5 className="text-xs sm:text-sm font-extrabold text-foreground">{spot.title}</h5>
                                </div>
                                <span className="text-xs font-bold text-foreground/80">{spot.cost}</span>
                              </div>
                              <p className="text-xs text-muted-foreground pl-1 font-medium">{spot.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="border-t border-border/60 p-4 bg-accent/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-muted-foreground font-semibold">
                  Verified trip record logged in TripNest Passport
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedBadge(null)}
                    className="flex-1 sm:flex-none rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Close Details
                  </Button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          EDIT PROFILE MODAL
         ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 text-foreground"
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h3 className="font-heading text-lg font-extrabold text-foreground flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-emerald-500" /> Edit Profile Information
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-accent cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
                <div>
                  <label className="block mb-1 font-bold text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background p-2.5 text-xs font-semibold text-foreground outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-bold text-muted-foreground">Email</label>
                    <input
                      type="email"
                      required
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2.5 text-xs font-semibold text-foreground outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-muted-foreground">Phone</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2.5 text-xs font-semibold text-foreground outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block mb-1 font-bold text-muted-foreground">Date of Birth</label>
                    <input
                      type="text"
                      value={editForm.dob}
                      onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2.5 text-xs font-semibold text-foreground outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-muted-foreground">Gender</label>
                    <select
                      value={editForm.gender}
                      onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2.5 text-xs font-semibold text-foreground outline-none focus:border-emerald-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-muted-foreground">Language</label>
                    <input
                      type="text"
                      value={editForm.language}
                      onChange={(e) => setEditForm({ ...editForm, language: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2.5 text-xs font-semibold text-foreground outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-muted-foreground">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background p-2.5 text-xs font-semibold text-foreground outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-muted-foreground">Avatar Image URL</label>
                  <input
                    type="text"
                    value={editForm.avatarUrl}
                    onChange={(e) => setEditForm({ ...editForm, avatarUrl: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background p-2.5 text-xs font-semibold text-foreground outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditModalOpen(false)}
                    className="rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-bold cursor-pointer"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  )
}
