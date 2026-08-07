"use client"

import { useState } from "react"
import { ArrowLeft, Globe, Sparkles, X, Save, User, Mail, MapPin, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Import Required Components
import { ProfileHeader } from "@/components/profile/profile-header"
import { TripsCarousel } from "@/components/profile/trips-carousel"
import { ItineraryCarousel } from "@/components/profile/itinerary-carousel"
import { ProfileActions } from "@/components/profile/profile-actions"

const sampleTrips = [
  {
    id: "manali-adventure",
    title: "Manali Mountain Adventure",
    location: "Himachal, India",
    dates: "Oct 12 – Oct 16, 2026",
    totalDays: 5,
    image: "/images/dest-manali.png",
    daysData: [
      {
        dayNum: 1,
        title: "Arrival & Local Exploration",
        location: "Mall Road & Old Manali",
        morning: "Hotel check-in & Hadimba Temple visit",
        afternoon: "City exploration & cafe hopping",
        evening: "Clubhouse sunset walk & street food",
        budget: "₹3,500",
        weather: "14°C Sunny",
        distance: "12 km • 45m"
      },
      {
        dayNum: 2,
        title: "Solang Valley Snow Sports",
        location: "Solang Valley",
        morning: "Paragliding & Solang Ropeway",
        afternoon: "ATV Ride & Snow Activity Park",
        evening: "Traditional Himachali Thali Dinner",
        budget: "₹5,200",
        weather: "10°C Clear",
        distance: "18 km • 1h"
      },
      {
        dayNum: 3,
        title: "Rohtang Pass & Glacier View",
        location: "Rohtang Pass Viewpoint",
        morning: "Scenic High-Mountain Drive",
        afternoon: "Glacier Photography & Snow Walk",
        evening: "Return to Mall Road for Shopping",
        budget: "₹4,800",
        weather: "8°C Cold",
        distance: "51 km • 2h"
      },
      {
        dayNum: 4,
        title: "Naggar Castle Heritage",
        location: "Naggar Village",
        morning: "Naggar Castle Exploration",
        afternoon: "Roerich Art Gallery & Cafe",
        evening: "Fresh Trout Fish Riverside Dinner",
        budget: "₹3,000",
        weather: "15°C Pleasant",
        distance: "21 km • 50m"
      },
      {
        dayNum: 5,
        title: "Jogini Waterfalls & Departure",
        location: "Vashisht",
        morning: "Jogini Waterfalls Trek",
        afternoon: "Vashisht Hot Springs & Souvenir Market",
        evening: "Overnight Volvo Bus Departure",
        budget: "₹2,500",
        weather: "16°C Clear",
        distance: "8 km • 30m"
      }
    ]
  },
  {
    id: "goa-vacation",
    title: "Goa Beach & Heritage Tour",
    location: "Goa, India",
    dates: "Nov 20 – Nov 25, 2026",
    totalDays: 4,
    image: "/images/dest-goa.png",
    daysData: [
      {
        dayNum: 1,
        title: "North Goa Beach Hop",
        location: "Baga & Anjuna",
        morning: "Artjuna Cafe Healthy Breakfast",
        afternoon: "Fort Aguada & Portuguese Lighthouse",
        evening: "Sunset Cocktails at Vagator Cliff",
        budget: "₹4,200",
        weather: "28°C Tropical",
        distance: "25 km • 45m"
      },
      {
        dayNum: 2,
        title: "Water Sports & Cruise",
        location: "Calangute",
        morning: "Parasailing & Jet Skiing Cove",
        afternoon: "Fresh Seafood Shack Lunch",
        evening: "Mandovi River Sunset Cruise",
        budget: "₹5,800",
        weather: "29°C Sunny",
        distance: "15 km • 30m"
      },
      {
        dayNum: 3,
        title: "Fontainhas Heritage Walk",
        location: "Panaji",
        morning: "Latin Quarter Heritage Walk",
        afternoon: "Sahakari Spice Farm Guided Thali",
        evening: "Miramar Beach Stroll",
        budget: "₹3,200",
        weather: "27°C Humid",
        distance: "18 km • 40m"
      },
      {
        dayNum: 4,
        title: "South Goa Serenity",
        location: "Palolem",
        morning: "Palolem Beach Kayaking",
        afternoon: "Butterfly Beach Island Boat",
        evening: "Airport Transfer & Departure",
        budget: "₹3,000",
        weather: "28°C Clear",
        distance: "60 km • 1.5h"
      }
    ]
  },
  {
    id: "rajasthan-heritage",
    title: "Rajasthan Royal Forts",
    location: "Rajasthan, India",
    dates: "Dec 05 – Dec 10, 2026",
    totalDays: 6,
    image: "/images/dest-jaipur.png",
    daysData: [
      {
        dayNum: 1,
        title: "Pink City Palace & Hawa Mahal",
        location: "Jaipur",
        morning: "City Palace Guided Museum Tour",
        afternoon: "Hawa Mahal & Johari Bazaar Walk",
        evening: "Chokhi Dhani Cultural Dinner",
        budget: "₹4,000",
        weather: "24°C Warm",
        distance: "10 km • 30m"
      },
      {
        dayNum: 2,
        title: "Amer Fort & Nahargarh Sunset",
        location: "Amer",
        morning: "Amer Fort Elephant/Jeep Ride",
        afternoon: "Jaigarh Fort Cannon & Palace",
        evening: "Nahargarh Fort Sunset City View",
        budget: "₹3,800",
        weather: "25°C Sunny",
        distance: "14 km • 35m"
      },
      {
        dayNum: 3,
        title: "Blue City Jodhpur Arrival",
        location: "Jodhpur",
        morning: "Train Ride to Jodhpur",
        afternoon: "Mehrangarh Fort Audio Tour",
        evening: "Jaswant Thada Marble Cenotaphs",
        budget: "₹4,500",
        weather: "26°C Clear",
        distance: "330 km • 5h"
      },
      {
        dayNum: 4,
        title: "Golden Desert Safari",
        location: "Jaisalmer",
        morning: "Drive to Sam Sand Dunes",
        afternoon: "Camel Safari & Dune Bashing",
        evening: "Desert Folk Dance & Camp Night",
        budget: "₹6,200",
        weather: "27°C Sunny",
        distance: "280 km • 4.5h"
      },
      {
        dayNum: 5,
        title: "Jaisalmer Fort Walk",
        location: "Jaisalmer",
        morning: "Living Fort Heritage Walk",
        afternoon: "Patwon Ki Haveli Architecture",
        evening: "Gadisar Lake Sunset Boating",
        budget: "₹3,500",
        weather: "25°C Clear",
        distance: "8 km • 20m"
      },
      {
        dayNum: 6,
        title: "Shopping & Departure",
        location: "Jaisalmer Market",
        morning: "Local Leather & Craft Shopping",
        afternoon: "Traditional Thali Lunch",
        evening: "Flight Departure",
        budget: "₹2,800",
        weather: "24°C Pleasant",
        distance: "12 km • 30m"
      }
    ]
  },
  {
    id: "kerala-backwaters",
    title: "Kerala Backwaters & Houseboat",
    location: "Kerala, India",
    dates: "Jan 15 – Jan 20, 2027",
    totalDays: 5,
    image: "/images/dest-kerala.png",
    daysData: [
      {
        dayNum: 1,
        title: "Kochi Fort & Heritage",
        location: "Fort Kochi",
        morning: "Chinese Fishing Nets & St Francis Church",
        afternoon: "Mattancherry Palace & Jew Town Market",
        evening: "Kathakali Cultural Dance Show",
        budget: "₹3,600",
        weather: "27°C Pleasant",
        distance: "15 km • 35m"
      },
      {
        dayNum: 2,
        title: "Munnar Tea Estate Hills",
        location: "Munnar",
        morning: "Drive up Western Ghats Tea Hills",
        afternoon: "Tea Museum & Tasting Session",
        evening: "Sunset over Mattupetty Dam",
        budget: "₹4,200",
        weather: "18°C Misty",
        distance: "130 km • 3.5h"
      },
      {
        dayNum: 3,
        title: "Alleppey Houseboat Cruise",
        location: "Alleppey",
        morning: "Board Deluxe Private Houseboat",
        afternoon: "Vembanad Lake Backwater Cruise",
        evening: "Traditional Karimeen Fish Curry Dinner",
        budget: "₹8,500",
        weather: "26°C Breezy",
        distance: "160 km • 4h"
      },
      {
        dayNum: 4,
        title: "Kumarakom Bird Sanctuary",
        location: "Kumarakom",
        morning: "Early Bird Watching Village Tour",
        afternoon: "Ayurvedic Massage & Spa Therapy",
        evening: "Village Canoe Ride",
        budget: "₹4,000",
        weather: "27°C Warm",
        distance: "30 km • 45m"
      },
      {
        dayNum: 5,
        title: "Marari Beach & Departure",
        location: "Marari",
        morning: "Relax at Serene Marari Beach",
        afternoon: "Fresh Coconut & Souvenir Shopping",
        evening: "Airport Transfer to Kochi",
        budget: "₹3,000",
        weather: "28°C Sunny",
        distance: "45 km • 1h"
      }
    ]
  }
]

export function ProfileWorkspace({ onBack, onNavigateView, user: currentUser, onLogout }) {
  const [trips] = useState(sampleTrips)
  const [activeTripId, setActiveTripId] = useState("manali-adventure")
  
  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "Hemangi Vijay Patil",
    email: currentUser?.email || "hemangi.patil@example.com",
    location: "Mumbai, India",
    bio: "Travel explorer who enjoys discovering new destinations and scenic mountain trails."
  })

  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0]

  const handleScrollToTrips = () => {
    const el = document.getElementById("trips-carousel-section")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    setIsEditingProfile(false)
  }

  return (
    <div className="min-h-screen bg-background pt-24 sm:pt-28 pb-28 flex flex-col">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col gap-6">
        
        {/* Navigation Sub-Header */}
        <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="rounded-xl border-border bg-background hover:bg-accent text-xs sm:text-sm shadow-sm"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Overview
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-foreground text-sm flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-[#6B4423]" />
              Traveler Profile Space
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald/20">
              <Sparkles className="h-3.5 w-3.5" />
              TripNest Member
            </span>
          </div>
        </div>

        {/* Dashboard 2-Column Grid Layout */}
        <div className="grid gap-6 lg:grid-cols-12 flex-1">
          
          {/* Left Column: User Info & Account Actions (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <ProfileHeader
              user={{
                ...currentUser,
                name: profileData.name,
                email: profileData.email,
                location: profileData.location,
                bio: profileData.bio
              }}
            />

            <ProfileActions
              onEditProfile={() => setIsEditingProfile(true)}
              onViewTrips={handleScrollToTrips}
              onLogout={onLogout}
            />
          </div>

          {/* Right Column: Day-Wise Itinerary Cards at TOP & Saved Trips at BOTTOM */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* 1. Day-Wise Itinerary Section (ABOVE) */}
            <div id="itinerary-carousel-section" className="scroll-mt-28">
              <ItineraryCarousel activeTrip={activeTrip} />
            </div>

            {/* 2. Saved Trips Section (DOWN AT BOTTOM) */}
            <div id="trips-carousel-section" className="scroll-mt-28">
              <TripsCarousel
                trips={trips}
                activeTripId={activeTripId}
                onSelectTrip={(id) => setActiveTripId(id)}
              />
            </div>
          </div>

        </div>

      </div>

      {/* Edit Profile Modal Dialog */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSaveProfile}
            className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-[#6B4423]" />
                Edit Profile Details
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Travel Bio</label>
              <textarea
                rows={2}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="w-full rounded-xl border border-border bg-background p-3 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditingProfile(false)}
                className="flex-1 rounded-xl border-border"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90"
              >
                <Save className="mr-1.5 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
