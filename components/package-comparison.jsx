"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  X,
  ArrowRightLeft,
  ChevronRight,
  Sparkles,
  Star,
  Plus,
  Eye,
  CheckCircle2,
  Calendar,
  MapPin,
  Car,
  Utensils,
  Sun,
  Palmtree,
  Mountain,
  Landmark,
  Trees,
  Users,
  Compass,
  Hotel,
  Award,
  AlertTriangle,
  Info,
  ShieldCheck,
  Clock,
  Zap,
  TrendingDown,
  Layers
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTrip } from "@/context/trip-context"
import { DoodleBackground } from "@/components/doodle-background"

/* ─────────────────────────────────────────────
   VACATION CATEGORIES CONFIG
   ───────────────────────────────────────────── */
const VACATION_CATEGORIES = [
  { id: "beach", name: "Beach & Relaxation", icon: Palmtree },
  { id: "adventure", name: "Adventure & Mountains", icon: Mountain },
  { id: "culture", name: "Culture & Heritage", icon: Landmark },
  { id: "nature", name: "Nature & Wellness", icon: Trees },
  { id: "food", name: "Food & Local Experiences", icon: Utensils },
  { id: "family", name: "Family Vacation", icon: Users }
]

/* ─────────────────────────────────────────────
   USER PRIORITIES CONFIG
   ───────────────────────────────────────────── */
const USER_PRIORITIES = [
  { id: "budget", label: "Budget", icon: "💰", tagline: "Prioritize lower cost & high value" },
  { id: "experiences", label: "Experiences", icon: "🏖", tagline: "Prioritize rich activities & sights" },
  { id: "relaxation", label: "Relaxation", icon: "🌿", tagline: "Prioritize free time & unhurried pace" },
  { id: "comfort", label: "Comfort", icon: "🏨", tagline: "Prioritize 4/5-Star stay & dining" },
  { id: "adventure", label: "Adventure", icon: "⚡", tagline: "Prioritize thrill & active exploration" }
]

/* ─────────────────────────────────────────────
   RICH PACKAGE DATASET (DATA-DRIVEN DECISION ENGINE)
   ───────────────────────────────────────────── */
const PACKAGE_DATA = {
  beach: [
    {
      id: "goa-escape",
      name: "Goa Explorer & Beach Escape",
      destination: "Goa",
      country: "India",
      image: "/images/dest-goa.png",
      duration: "5 Days / 4 Nights",
      durationDays: 5,
      price: "₹24,999",
      numericPrice: 24999,
      estimatedTotalCost: 30500,
      costBreakdown: { taxes: "₹2,500", localExpenses: "₹3,001" },
      rating: 4.8,
      reviewsCount: 142,
      reviewsBreakdown: { cleanliness: 4.8, transport: 4.7, stay: 4.8, value: 4.6, activities: 4.9 },
      accommodation: {
        category: "4-Star Beach Resort",
        rating: 4.7,
        location: "Vagator Cliff & Beach Side",
        distanceToHub: "300m to Vagator Beach",
        meals: "Breakfast & Dinner Included",
        hotelChanges: 1
      },
      experiences: {
        activitiesCount: 4,
        attractionsCount: 6,
        breakdown: { adventure: 75, nature: 85, culture: 70, food: 95, shopping: 80, nightlife: 85 },
        attractionsList: ["Baga & Calangute Beach", "Fort Aguada", "Fontainhas Latin Quarter", "Dudhsagar Waterfalls", "Anjuna Flea Market", "Mandovi River"],
        activitiesList: ["Parasailing & Jet Ski", "Mandovi Sunset Cruise", "Spice Plantation Feast & Elephant Tour", "Fontainhas Heritage Photo Walk"]
      },
      pace: {
        type: "relaxed",
        label: "Relaxed",
        icon: "🌿",
        actPerDay: 2,
        freeTimeHrs: 5,
        lateNight: false,
        desc: "2-3 activities/day • Generous free time for beach lounging"
      },
      convenience: {
        airportTransfers: "Private AC SUV Included",
        localTransport: "Dedicated AC Sedan",
        hotelChanges: 1,
        avgDailyTravelMins: 40,
        transportType: "Private AC"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Sunny Skies & Cool Sea Breeze",
        reason: "Optimal dry season window (Nov-Feb) with calm waters for watersports."
      },
      description: "Sun-drenched beaches, cliffside shacks, Portuguese heritage, and private watersports."
    },
    {
      id: "gokarna-getaway",
      name: "Gokarna Coastal Getaway",
      destination: "Gokarna",
      country: "Karnataka, India",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
      duration: "4 Days / 3 Nights",
      durationDays: 4,
      price: "₹18,500",
      numericPrice: 18500,
      estimatedTotalCost: 23200,
      costBreakdown: { taxes: "₹1,800", localExpenses: "₹2,900" },
      rating: 4.6,
      reviewsCount: 88,
      reviewsBreakdown: { cleanliness: 4.5, transport: 4.4, stay: 4.6, value: 4.8, activities: 4.5 },
      accommodation: {
        category: "Eco Heritage Beach Resort",
        rating: 4.5,
        location: "Kudle Beach",
        distanceToHub: "100m to Kudle Shore",
        meals: "All Meals Included (Farm-to-Table)",
        hotelChanges: 1
      },
      experiences: {
        activitiesCount: 5,
        attractionsCount: 5,
        breakdown: { adventure: 80, nature: 95, culture: 85, food: 75, shopping: 60, nightlife: 40 },
        attractionsList: ["Kudle Beach", "Om Beach", "Half Moon Beach", "Mahabaleshwar Temple", "Yana Caves"],
        activitiesList: ["5-Beach Coastal Trek", "Cliff Yoga & Meditation", "Sunset Boat Ride", "Temple Heritage Walk", "Bio-Luminescent Night Watch"]
      },
      pace: {
        type: "balanced",
        label: "Balanced",
        icon: "⚖️",
        actPerDay: 3,
        freeTimeHrs: 3.5,
        lateNight: false,
        desc: "3 activities/day • Balanced coastal trekking & beach relaxation"
      },
      convenience: {
        airportTransfers: "Shared AC Coach",
        localTransport: "Private AC Cab & Boat Transfer",
        hotelChanges: 1,
        avgDailyTravelMins: 55,
        transportType: "Semi-Private"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Pleasant & Tropical",
        reason: "Mild temperatures perfect for beach trekking and cliffside views."
      },
      description: "Pristine cliffside beaches, serene temple heritage, and guided coastal trekking."
    },
    {
      id: "andaman-luxury",
      name: "Andaman Island Paradise & Reefs",
      destination: "Andaman",
      country: "India",
      image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&auto=format&fit=crop&q=80",
      duration: "5 Days / 4 Nights",
      durationDays: 5,
      price: "₹34,500",
      numericPrice: 34500,
      estimatedTotalCost: 41000,
      costBreakdown: { taxes: "₹3,500", localExpenses: "₹3,000" },
      rating: 4.9,
      reviewsCount: 115,
      reviewsBreakdown: { cleanliness: 4.9, transport: 4.8, stay: 4.9, value: 4.7, activities: 4.9 },
      accommodation: {
        category: "5-Star Luxury Island Resort",
        rating: 4.9,
        location: "Radhanagar Beach, Havelock",
        distanceToHub: "Direct Private Beach Access",
        meals: "Full Board (Breakfast, Lunch & Dinner)",
        hotelChanges: 2
      },
      experiences: {
        activitiesCount: 6,
        attractionsCount: 7,
        breakdown: { adventure: 90, nature: 98, culture: 70, food: 85, shopping: 50, nightlife: 45 },
        attractionsList: ["Radhanagar Beach", "Elephant Beach", "Cellular Jail", "Chidiya Tapu", "Ross Island", "Kalapathar Beach", "Baratang Caves"],
        activitiesList: ["Scuba Diving with Certified Instructor", "Snorkeling at Elephant Beach", "Catamaran Cruise Transfer", "Light & Sound Show at Cellular Jail", "Sunset Glass Bottom Boat Ride"]
      },
      pace: {
        type: "packed",
        label: "Packed",
        icon: "⚡",
        actPerDay: 4,
        freeTimeHrs: 2,
        lateNight: true,
        desc: "4 activities/day • High-energy island hopping & marine adventures"
      },
      convenience: {
        airportTransfers: "Luxury Private Car & Express Ferry",
        localTransport: "Private AC Cab & Speedboat",
        hotelChanges: 2,
        avgDailyTravelMins: 60,
        transportType: "Private Luxury"
      },
      weatherSuitability: {
        status: "good",
        label: "Good",
        icon: "🌤",
        title: "Clear Waters & Ocean Sunshine",
        reason: "Great underwater visibility for scuba diving with occasional tropical showers."
      },
      description: "Turquoise lagoons, white sand beaches, scuba diving, and luxury island catamaran cruises."
    }
  ],
  adventure: [
    {
      id: "manali-snow",
      name: "Manali & Solang Valley Snow Explorer",
      destination: "Manali",
      country: "Himachal, India",
      image: "/images/dest-manali.png",
      duration: "5 Days / 4 Nights",
      durationDays: 5,
      price: "₹16,999",
      numericPrice: 16999,
      estimatedTotalCost: 21500,
      costBreakdown: { taxes: "₹1,700", localExpenses: "₹2,801" },
      rating: 4.7,
      reviewsCount: 165,
      reviewsBreakdown: { cleanliness: 4.6, transport: 4.7, stay: 4.6, value: 4.8, activities: 4.9 },
      accommodation: {
        category: "3-Star Mountain View Resort",
        rating: 4.6,
        location: "Old Manali Woods",
        distanceToHub: "1.2km to Mall Road",
        meals: "Breakfast & Dinner Included",
        hotelChanges: 1
      },
      experiences: {
        activitiesCount: 6,
        attractionsCount: 7,
        breakdown: { adventure: 95, nature: 90, culture: 75, food: 70, shopping: 65, nightlife: 50 },
        attractionsList: ["Solang Valley", "Atal Tunnel", "Sissu Waterfall", "Hadimba Temple", "Jogini Waterfalls", "Mall Road", "Vashisht Hot Springs"],
        activitiesList: ["Paragliding in Solang", "Snow Scooter Ride", "Jogini Waterfall Trek", "Atal Tunnel Lahaul Excursion", "Vashisht Thermal Bath"]
      },
      pace: {
        type: "packed",
        label: "Packed",
        icon: "⚡",
        actPerDay: 4,
        freeTimeHrs: 2,
        lateNight: false,
        desc: "4 activities/day • High thrill mountain adventures & snow sports"
      },
      convenience: {
        airportTransfers: "Volvo Sleeper Coach from Delhi + Private Cab",
        localTransport: "Private 4x4 Mountain SUV",
        hotelChanges: 1,
        avgDailyTravelMins: 50,
        transportType: "Private 4x4"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Snowy Peaks & Alpine Chill",
        reason: "Crisp winter weather with fresh snow in Solang Valley and Sissu."
      },
      description: "Paragliding in Solang, snow rides, Atal Tunnel adventure, and cozy fireside mountain stays."
    },
    {
      id: "leh-ladakh",
      name: "Leh Ladakh High Passes Odyssey",
      destination: "Ladakh",
      country: "India",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
      duration: "6 Days / 5 Nights",
      durationDays: 6,
      price: "₹28,500",
      numericPrice: 28500,
      estimatedTotalCost: 34000,
      costBreakdown: { taxes: "₹2,500", localExpenses: "₹3,000" },
      rating: 4.9,
      reviewsCount: 198,
      reviewsBreakdown: { cleanliness: 4.8, transport: 4.9, stay: 4.7, value: 4.9, activities: 5.0 },
      accommodation: {
        category: "Deluxe Himalayan Camps & Hotel",
        rating: 4.8,
        location: "Leh & Pangong Lake Tents",
        distanceToHub: "Direct Lakefront Campsite",
        meals: "All Meals Included",
        hotelChanges: 2
      },
      experiences: {
        activitiesCount: 7,
        attractionsCount: 8,
        breakdown: { adventure: 100, nature: 100, culture: 85, food: 65, shopping: 50, nightlife: 20 },
        attractionsList: ["Pangong Tso Lake", "Nubra Valley", "Khardung La Pass", "Magnetic Hill", "Shanti Stupa", "Diskit Monastery", "Confluence of Indus & Zanskar"],
        activitiesList: ["Khardungla 18,380ft Pass Crossing", "Double-Hump Camel Safari in Hunder", "Stargazing over Pangong Tso", "Rafting in Zanskar River", "Monastery Chanting Experience"]
      },
      pace: {
        type: "balanced",
        label: "Balanced",
        icon: "⚖️",
        actPerDay: 3,
        freeTimeHrs: 3,
        lateNight: false,
        desc: "3 activities/day • High mountain passes with mandatory acclimatization rest"
      },
      convenience: {
        airportTransfers: "Private Leh Airport Cab",
        localTransport: "Modified Oxygen-Equipped Scorpio/Innova",
        hotelChanges: 2,
        avgDailyTravelMins: 90,
        transportType: "Private 4x4"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Clear Azure Skies & High Sun",
        reason: "Peak summer season with accessible high passes and vibrant blue Pangong Lake."
      },
      description: "Highest motorable passes, Pangong Lake camping, Bactrian camel safaris, and raw Himalayan landscapes."
    },
    {
      id: "rishikesh-rafting",
      name: "Rishikesh White Water Rafting & Camps",
      destination: "Rishikesh",
      country: "Uttarakhand, India",
      image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80",
      duration: "4 Days / 3 Nights",
      durationDays: 4,
      price: "₹14,500",
      numericPrice: 14500,
      estimatedTotalCost: 18900,
      costBreakdown: { taxes: "₹1,400", localExpenses: "₹3,000" },
      rating: 4.8,
      reviewsCount: 140,
      reviewsBreakdown: { cleanliness: 4.7, transport: 4.6, stay: 4.8, value: 4.9, activities: 4.9 },
      accommodation: {
        category: "Riverside Eco Resort & Glamping Tents",
        rating: 4.7,
        location: "Shivpuri Ganges River Bank",
        distanceToHub: "Direct Ganges Bank Access",
        meals: "All Meals Included",
        hotelChanges: 1
      },
      experiences: {
        activitiesCount: 6,
        attractionsCount: 5,
        breakdown: { adventure: 98, nature: 90, culture: 80, food: 75, shopping: 60, nightlife: 30 },
        attractionsList: ["Laxman Jhula", "Ram Jhula", "Triveni Ghat", "Beatles Ashram", "Neer Garh Waterfalls"],
        activitiesList: ["16km White Water Ganges Rafting", "Bungee Jumping at Jumpin Heights", "Cliff Jumping & Body Surfing", "Evening Ganga Aarti at Triveni Ghat", "Waterfall Trekking & Zipline"]
      },
      pace: {
        type: "packed",
        label: "Packed",
        icon: "⚡",
        actPerDay: 4,
        freeTimeHrs: 2.5,
        lateNight: false,
        desc: "4 activities/day • Thrilling Ganges rafting & cliff adventure"
      },
      convenience: {
        airportTransfers: "Dehradun Airport / Haridwar Station Cab",
        localTransport: "Private Open Camper & AC Cab",
        hotelChanges: 1,
        avgDailyTravelMins: 35,
        transportType: "Private AC Cab"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Roaring Ganges & Sunny Valleys",
        reason: "Optimal water flow and crisp sunshine for white water rafting."
      },
      description: "Grade III/IV Ganges rafting, bungee jumping, Beatles Ashram heritage, and riverside bonfire camping."
    }
  ],
  culture: [
    {
      id: "jaipur-royal",
      name: "Jaipur Royal Heritage & Palaces",
      destination: "Jaipur",
      country: "Rajasthan, India",
      image: "/images/dest-jaipur.png",
      duration: "4 Days / 3 Nights",
      durationDays: 4,
      price: "₹19,800",
      numericPrice: 19800,
      estimatedTotalCost: 24500,
      costBreakdown: { taxes: "₹1,900", localExpenses: "₹2,800" },
      rating: 4.9,
      reviewsCount: 175,
      reviewsBreakdown: { cleanliness: 4.8, transport: 4.8, stay: 4.9, value: 4.7, activities: 4.9 },
      accommodation: {
        category: "4-Star Royal Haveli Heritage Hotel",
        rating: 4.9,
        location: "Bani Park Heritage Zone",
        distanceToHub: "1.5km to Pink City Bazaars",
        meals: "Breakfast & Royal Rajasthani Dinner",
        hotelChanges: 1
      },
      experiences: {
        activitiesCount: 5,
        attractionsCount: 7,
        breakdown: { adventure: 50, nature: 70, culture: 100, food: 90, shopping: 95, nightlife: 60 },
        attractionsList: ["Amer Fort", "Hawa Mahal", "City Palace", "Jantar Mantar", "Nahargarh Fort Sunset", "Johari Bazaar", "Albert Hall Museum"],
        activitiesList: ["Amer Fort Elephant / Jeep Rampart Safari", "Private City Palace Royal Quarters Tour", "Nahargarh Sunset Fort Dining", "Johari & Bapu Bazaar Artisan Walk", "Traditional Kathputli Puppet & Folk Dance Show"]
      },
      pace: {
        type: "balanced",
        label: "Balanced",
        icon: "⚖️",
        actPerDay: 3,
        freeTimeHrs: 3.5,
        lateNight: false,
        desc: "3 activities/day • Grand fort ramparts, royal palaces & bazaars"
      },
      convenience: {
        airportTransfers: "Private Royal Chauffeur Sedan",
        localTransport: "Dedicated AC Sedan",
        hotelChanges: 1,
        avgDailyTravelMins: 35,
        transportType: "Private AC"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Pleasant Desert Sunshine",
        reason: "Mild winter sun perfect for exploring open-air fort ramparts."
      },
      description: "Grand Amer Fort, honeycombed Hawa Mahal, authentic thali dining, and historic bazaars."
    },
    {
      id: "varanasi-spiritual",
      name: "Varanasi Ganges Spiritual Trail",
      destination: "Varanasi",
      country: "UP, India",
      image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80",
      duration: "3 Days / 2 Nights",
      durationDays: 3,
      price: "₹14,200",
      numericPrice: 14200,
      estimatedTotalCost: 18500,
      costBreakdown: { taxes: "₹1,400", localExpenses: "₹2,900" },
      rating: 4.8,
      reviewsCount: 130,
      reviewsBreakdown: { cleanliness: 4.5, transport: 4.7, stay: 4.8, value: 4.9, activities: 4.9 },
      accommodation: {
        category: "Riverside Heritage Haveli Hotel",
        rating: 4.8,
        location: "Dashashwamedh Ghat Bank",
        distanceToHub: "Direct Ganges Ghat Balcony",
        meals: "Breakfast & Sattvik Thali Included",
        hotelChanges: 1
      },
      experiences: {
        activitiesCount: 5,
        attractionsCount: 6,
        breakdown: { adventure: 40, nature: 65, culture: 100, food: 85, shopping: 70, nightlife: 30 },
        attractionsList: ["Dashashwamedh Ghat", "Manikarnika Ghat", "Kashi Vishwanath Temple", "Sarnath Buddhist Stupa", "Assi Ghat", "Banaras Hindu University"],
        activitiesList: ["Sunrise Wooden Boat Ganges Ride", "Evening Grand Ganga Aarti VIP Deck Access", "Sarnath Silk Weaving Village Tour", "Heritage Alley Street Food Walk", "Classical Sitar Music Evening Session"]
      },
      pace: {
        type: "relaxed",
        label: "Relaxed",
        icon: "🌿",
        actPerDay: 2,
        freeTimeHrs: 4.5,
        lateNight: false,
        desc: "2 activities/day • Serene ghat boat rides & ancient temple rituals"
      },
      convenience: {
        airportTransfers: "Private Varanasi Airport Cab",
        localTransport: "Private AC Cab & Electric Rickshaw",
        hotelChanges: 1,
        avgDailyTravelMins: 30,
        transportType: "Private AC"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Crisp Morning River Mist",
        reason: "Pleasant weather for sunrise boat rides and evening ghat ceremonies."
      },
      description: "Subah-e-Banaras boat rides, VIP Ganga Aarti deck seats, silk weavers, and Sarnath steles."
    },
    {
      id: "kyoto-temple",
      name: "Kyoto Shrines & Tea Culture Experience",
      destination: "Kyoto",
      country: "Japan",
      image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80",
      duration: "5 Days / 4 Nights",
      durationDays: 5,
      price: "₹88,000",
      numericPrice: 88000,
      estimatedTotalCost: 105000,
      costBreakdown: { taxes: "₹8,500", localExpenses: "₹8,500" },
      rating: 4.9,
      reviewsCount: 160,
      reviewsBreakdown: { cleanliness: 5.0, transport: 4.9, stay: 4.9, value: 4.6, activities: 5.0 },
      accommodation: {
        category: "Traditional Japanese Luxury Ryokan",
        rating: 4.9,
        location: "Gion Historic District",
        distanceToHub: "Heart of Gion Geisha Streets",
        meals: "Kaiseki Multi-Course Dinner & Breakfast",
        hotelChanges: 1
      },
      experiences: {
        activitiesCount: 6,
        attractionsCount: 8,
        breakdown: { adventure: 55, nature: 90, culture: 100, food: 95, shopping: 85, nightlife: 65 },
        attractionsList: ["Fushimi Inari Taisha", "Kinkaku-ji Golden Pavilion", "Arashiyama Bamboo Grove", "Kiyomizu-dera Temple", "Gion Geisha District", "Nijo Castle"],
        activitiesList: ["Kimono Rental & Photo Walk", "Traditional Tea Ceremony with Master", "Arashiyama Bamboo & Monkey Park Walk", "Private Zen Rock Garden Meditation", "Nishiki Market Culinary Feast"]
      },
      pace: {
        type: "balanced",
        label: "Balanced",
        icon: "⚖️",
        actPerDay: 3,
        freeTimeHrs: 4,
        lateNight: false,
        desc: "3 activities/day • Timeless Shinto torii gates, Zen gardens & Ryokan hot springs"
      },
      convenience: {
        airportTransfers: "Haruka Express Bullet Train Ticket",
        localTransport: "Kyoto Metro & Private Taxi Pass",
        hotelChanges: 1,
        avgDailyTravelMins: 40,
        transportType: "Bullet Train & Taxi"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Temperate Spring & Cherry Blossoms",
        reason: "Perfect weather for temple walking trails and bamboo garden strolls."
      },
      description: "Fushimi Inari thousand torii gates, Golden Pavilion, Matcha tea ceremonies, and Ryokan luxury."
    }
  ],
  nature: [
    {
      id: "munnar-tea",
      name: "Munnar Tea Estates & Backwaters",
      destination: "Munnar",
      country: "Kerala, India",
      image: "/images/dest-kerala.png",
      duration: "5 Days / 4 Nights",
      durationDays: 5,
      price: "₹22,400",
      numericPrice: 22400,
      estimatedTotalCost: 27800,
      costBreakdown: { taxes: "₹2,200", localExpenses: "₹3,200" },
      rating: 4.9,
      reviewsCount: 160,
      reviewsBreakdown: { cleanliness: 4.9, transport: 4.8, stay: 4.9, value: 4.8, activities: 4.9 },
      accommodation: {
        category: "4-Star Valley View Tea Estate Resort",
        rating: 4.9,
        location: "Pallivasal Estate Heights",
        distanceToHub: "Surrounded by Tea Gardens",
        meals: "Breakfast, High Tea & Dinner",
        hotelChanges: 2
      },
      experiences: {
        activitiesCount: 5,
        attractionsCount: 6,
        breakdown: { adventure: 65, nature: 100, culture: 75, food: 80, shopping: 65, nightlife: 20 },
        attractionsList: ["Eravikulam National Park", "Mattupetty Dam", "Tea Museum", "Alleppey Backwaters", "Marayoor Sandalwood Forest", "Anamudi Peak View"],
        activitiesList: ["Guided Tea Tasting & Plantation Walk", "Private Alleppey Houseboat Cruise", "Eravikulam Nilgiri Tahr Safari", "Spice Garden Aromatherapy Tour", "Kathakali Cultural Performance"]
      },
      pace: {
        type: "relaxed",
        label: "Relaxed",
        icon: "🌿",
        actPerDay: 2,
        freeTimeHrs: 5,
        lateNight: false,
        desc: "2-3 activities/day • Serene valley mist & backwater houseboat relaxation"
      },
      convenience: {
        airportTransfers: "Private Kochi Airport SUV Transfer",
        localTransport: "Dedicated AC SUV",
        hotelChanges: 2,
        avgDailyTravelMins: 45,
        transportType: "Private SUV"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Cool Mountain Breeze & Green Valleys",
        reason: "Crisp hill station weather with lush green tea plantations after monsoons."
      },
      description: "Rolling tea gardens, Alleppey houseboat luxury, spice tours, and mountain wildlife."
    },
    {
      id: "wayanad-forest",
      name: "Wayanad Rainforest & Treehouse Trail",
      destination: "Wayanad",
      country: "Kerala, India",
      image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&auto=format&fit=crop&q=80",
      duration: "4 Days / 3 Nights",
      durationDays: 4,
      price: "₹17,999",
      numericPrice: 17999,
      estimatedTotalCost: 22400,
      costBreakdown: { taxes: "₹1,800", localExpenses: "₹2,601" },
      rating: 4.7,
      reviewsCount: 110,
      reviewsBreakdown: { cleanliness: 4.7, transport: 4.6, stay: 4.8, value: 4.7, activities: 4.8 },
      accommodation: {
        category: "Luxury Jungle Canopy Treehouse Resort",
        rating: 4.8,
        location: "Vythiri Rainforest Preserve",
        distanceToHub: "Deep Inside Private Forest Reserve",
        meals: "All Meals & Herbal Drinks Included",
        hotelChanges: 1
      },
      experiences: {
        activitiesCount: 5,
        attractionsCount: 6,
        breakdown: { adventure: 80, nature: 100, culture: 70, food: 75, shopping: 55, nightlife: 15 },
        attractionsList: ["Edakkal Caves", "Banasura Sagar Dam", "Chembra Peak Heart Lake", "Kuruva Island", "Soochipara Waterfalls"],
        activitiesList: ["Jungle Canopy Treehouse Stay", "Chembra Heart-Shaped Lake Trek", "Edakkal Prehistoric Rock Carving Tour", "Bamboo Rafting in Kuruva Island", "Night Forest Jeep Safari"]
      },
      pace: {
        type: "balanced",
        label: "Balanced",
        icon: "⚖️",
        actPerDay: 3,
        freeTimeHrs: 4,
        lateNight: false,
        desc: "3 activities/day • Pristine canopy treehouse stay & lake trekking"
      },
      convenience: {
        airportTransfers: "Private Calicut Airport Cab",
        localTransport: "Dedicated 4x4 Forest Jeep",
        hotelChanges: 1,
        avgDailyTravelMins: 50,
        transportType: "Private 4x4"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Mist-Draped Canopy & Cool Waterfalls",
        reason: "Full waterfall water volume and pleasant mountain mist."
      },
      description: "Canopy treehouses, Chembra heart lake trekking, prehistoric Edakkal caves, and bamboo rafting."
    },
    {
      id: "coorg-coffee",
      name: "Coorg Coffee Hills & Waterfall Haven",
      destination: "Coorg",
      country: "Karnataka, India",
      image: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800&auto=format&fit=crop&q=80",
      duration: "4 Days / 3 Nights",
      durationDays: 4,
      price: "₹19,800",
      numericPrice: 19800,
      estimatedTotalCost: 24200,
      costBreakdown: { taxes: "₹1,900", localExpenses: "₹2,500" },
      rating: 4.8,
      reviewsCount: 135,
      reviewsBreakdown: { cleanliness: 4.8, transport: 4.7, stay: 4.9, value: 4.7, activities: 4.8 },
      accommodation: {
        category: "Coffee Estate Heritage Villa Resort",
        rating: 4.9,
        location: "Madikeri Hill Heights",
        distanceToHub: "Nestled in 30-Acre Plantation",
        meals: "Breakfast, Plantation Lunch & Dinner",
        hotelChanges: 1
      },
      experiences: {
        activitiesCount: 5,
        attractionsCount: 6,
        breakdown: { adventure: 70, nature: 98, culture: 75, food: 85, shopping: 70, nightlife: 25 },
        attractionsList: ["Abbey Falls", "Raja's Seat Sunset View", "Dubare Elephant Camp", "Bylakuppe Tibetan Golden Temple", "Mandalpatti Peak"],
        activitiesList: ["Coffee Roasting & Bean Harvesting Workshop", "Dubare Elephant Bathing & Feeding", "4x4 Off-Road Jeep Safari to Mandalpatti", "Bylakuppe Monastic Chanting Tour", "Abbey Falls Stream Trek"]
      },
      pace: {
        type: "relaxed",
        label: "Relaxed",
        icon: "🌿",
        actPerDay: 2,
        freeTimeHrs: 4.5,
        lateNight: false,
        desc: "2-3 activities/day • Coffee aroma, off-road peaks & elephant sanctuaries"
      },
      convenience: {
        airportTransfers: "Private Mangalore / Kannur Cab",
        localTransport: "Dedicated AC Cab & 4x4 Jeep",
        hotelChanges: 1,
        avgDailyTravelMins: 40,
        transportType: "Private AC"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Aromatic Hills & Mild Sunshine",
        reason: "Pleasant temperatures with fresh coffee harvesting season fragrance."
      },
      description: "Coffee estate villas, Dubare elephant bathing, Mandalpatti off-road jeep trails, and Abbey Falls."
    }
  ],
  food: [
    {
      id: "old-delhi-streetfood",
      name: "Old Delhi Culinary & Heritage Feast",
      destination: "Delhi",
      country: "India",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
      duration: "3 Days / 2 Nights",
      durationDays: 3,
      price: "₹12,500",
      numericPrice: 12500,
      estimatedTotalCost: 16200,
      costBreakdown: { taxes: "₹1,200", localExpenses: "₹2,500" },
      rating: 4.8,
      reviewsCount: 155,
      reviewsBreakdown: { cleanliness: 4.6, transport: 4.8, stay: 4.7, value: 4.9, activities: 5.0 },
      accommodation: {
        category: "4-Star Heritage City Hotel",
        rating: 4.7,
        location: "Connaught Place Hub",
        distanceToHub: "Direct Metro & Market Access",
        meals: "Breakfast & Guided Culinary Tasting Tours",
        hotelChanges: 1
      },
      experiences: {
        activitiesCount: 6,
        attractionsCount: 6,
        breakdown: { adventure: 50, nature: 40, culture: 95, food: 100, shopping: 90, nightlife: 70 },
        attractionsList: ["Chandni Chowk", "Jama Masjid", "Paranthe Wali Gali", "Spice Market (Khari Baoli)", "Humayun's Tomb", "Khan Market"],
        activitiesList: ["Guided Old Delhi Street Food Tasting (15+ Dishes)", "Khari Baoli Rooftop Spice Workshop", "Mughlai Kebab Masterclass & Dinner", "Heritage Rickshaw Culinary Tour", "Khan Market Artisan Dessert Walk"]
      },
      pace: {
        type: "balanced",
        label: "Balanced",
        icon: "⚖️",
        actPerDay: 3,
        freeTimeHrs: 3.5,
        lateNight: false,
        desc: "3 activities/day • Immersive street food tasting & spice markets"
      },
      convenience: {
        airportTransfers: "Private Delhi Airport Sedan",
        localTransport: "Dedicated AC Car & Rickshaw Pass",
        hotelChanges: 1,
        avgDailyTravelMins: 35,
        transportType: "Private AC"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Cool Winter Sunshine",
        reason: "Crisp winter weather perfect for hot paranthas and kebabs in Old Delhi."
      },
      description: "Chandni Chowk street food trails, Mughlai kebabs, Khari Baoli spice markets, and heritage Haveli dining."
    },
    {
      id: "amritsar-gourmet",
      name: "Amritsar Gourmet & Golden Temple Trail",
      destination: "Amritsar",
      country: "Punjab, India",
      image: "https://images.unsplash.com/photo-1588096344356-7881c0022f46?w=800&auto=format&fit=crop&q=80",
      duration: "3 Days / 2 Nights",
      durationDays: 3,
      price: "₹14,999",
      numericPrice: 14999,
      estimatedTotalCost: 18900,
      costBreakdown: { taxes: "₹1,400", localExpenses: "₹2,501" },
      rating: 4.9,
      reviewsCount: 180,
      reviewsBreakdown: { cleanliness: 4.9, transport: 4.8, stay: 4.9, value: 5.0, activities: 4.9 },
      accommodation: {
        category: "4-Star Heritage Boutique Hotel",
        rating: 4.9,
        location: "Golden Temple Heritage Plaza",
        distanceToHub: "500m to Golden Temple Plaza",
        meals: "Breakfast & Langar Seva Experience",
        hotelChanges: 1
      },
      experiences: {
        activitiesCount: 5,
        attractionsCount: 5,
        breakdown: { adventure: 45, nature: 50, culture: 100, food: 100, shopping: 85, nightlife: 40 },
        attractionsList: ["Golden Temple", "Jallianwala Bagh", "Wagah Border", "Lawrence Road Food Market", "Gobindgarh Fort"],
        activitiesList: ["Golden Temple Midnight Illumination Visit", "Community Kitchen (Langar Seva) Volunteering", "Amritsari Kulcha & Lassi Master Tasting", "Wagah Border Beating Retreat Flag Ceremony", "Heritage Haveli Punjabi Dinner"]
      },
      pace: {
        type: "relaxed",
        label: "Relaxed",
        icon: "🌿",
        actPerDay: 2,
        freeTimeHrs: 4,
        lateNight: false,
        desc: "2-3 activities/day • Golden Temple serenity, Amritsari kulchas & Wagah border"
      },
      convenience: {
        airportTransfers: "Private Amritsar Airport Cab",
        localTransport: "Dedicated AC Cab",
        hotelChanges: 1,
        avgDailyTravelMins: 30,
        transportType: "Private AC"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Pleasant & Breezy",
        reason: "Mild weather for strolling heritage plaza corridors and market lanes."
      },
      description: "Golden Temple spiritual solace, world-famous Amritsari kulcha tasting, and Wagah border ceremony."
    },
    {
      id: "hyderabad-biryani-tour",
      name: "Hyderabad Biryani & Nizam Royalty Feast",
      destination: "Hyderabad",
      country: "Telangana, India",
      image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80",
      duration: "4 Days / 3 Nights",
      durationDays: 4,
      price: "₹16,500",
      numericPrice: 16500,
      estimatedTotalCost: 20800,
      costBreakdown: { taxes: "₹1,600", localExpenses: "₹2,700" },
      rating: 4.7,
      reviewsCount: 125,
      reviewsBreakdown: { cleanliness: 4.7, transport: 4.7, stay: 4.7, value: 4.8, activities: 4.8 },
      accommodation: {
        category: "Heritage Nizam Royal Boutique Hotel",
        rating: 4.7,
        location: "Banjara Hills",
        distanceToHub: "10 mins to Charminar & Palaces",
        meals: "Breakfast & Royal Hyderabadi Dinners",
        hotelChanges: 1
      },
      experiences: {
        activitiesCount: 5,
        attractionsCount: 6,
        breakdown: { adventure: 45, nature: 50, culture: 95, food: 100, shopping: 85, nightlife: 65 },
        attractionsList: ["Charminar", "Golconda Fort", "Chowmahalla Palace", "Laad Bazaar", "Hussain Sagar Lake", "Ramoji Film City"],
        activitiesList: ["Authentic Dum Biryani Tasting at Iconic Kitchens", "Golconda Fort Light & Sound Show", "Chowmahalla Royal Palace Private Tour", "Laad Bazaar Bangles & Irani Chai Walk", "Haleeem & Royal Irani Bakery Tasting"]
      },
      pace: {
        type: "balanced",
        label: "Balanced",
        icon: "⚖️",
        actPerDay: 3,
        freeTimeHrs: 3.5,
        lateNight: false,
        desc: "3 activities/day • Nizam palace heritage, royal dum biryani & Irani chai"
      },
      convenience: {
        airportTransfers: "Private Rajiv Gandhi Airport Car",
        localTransport: "Dedicated AC Sedan",
        hotelChanges: 1,
        avgDailyTravelMins: 40,
        transportType: "Private AC"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Mild Winter Breeze",
        reason: "Great season for exploring Nizam forts and open-air food bazaars."
      },
      description: "Iconic Hyderabadi Dum Biryani tasting, Golconda Fort sound show, and Chowmahalla Palace luxury."
    }
  ],
  family: [
    {
      id: "udaipur-lake-palace",
      name: "Udaipur Royal Family Palace Escape",
      destination: "Udaipur",
      country: "Rajasthan, India",
      image: "https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=800&auto=format&fit=crop&q=80",
      duration: "4 Days / 3 Nights",
      durationDays: 4,
      price: "₹29,999",
      numericPrice: 29999,
      estimatedTotalCost: 36500,
      costBreakdown: { taxes: "₹3,000", localExpenses: "₹3,501" },
      rating: 4.9,
      reviewsCount: 190,
      reviewsBreakdown: { cleanliness: 5.0, transport: 4.8, stay: 5.0, value: 4.7, activities: 4.9 },
      accommodation: {
        category: "5-Star Lakefront Heritage Palace Resort",
        rating: 5.0,
        location: "Lake Pichola Shore",
        distanceToHub: "Direct Lake Pichola View",
        meals: "Full Breakfast & Sunset Family Dinner",
        hotelChanges: 1
      },
      experiences: {
        activitiesCount: 5,
        attractionsCount: 6,
        breakdown: { adventure: 50, nature: 85, culture: 98, food: 90, shopping: 80, nightlife: 40 },
        attractionsList: ["City Palace Udaipur", "Lake Pichola", "Jagmandir Island", "Saheliyon-ki-Bari", "Fateh Sagar Lake", "Bagore-ki-Haveli"],
        activitiesList: ["Private Family Boat Cruise on Lake Pichola", "City Palace Museum Audio-Guided Family Walk", "Dharohar Cultural Folk Dance Show at Bagore Haveli", "Saheliyon-ki-Bari Royal Fountains Walk", "Sunset Dining overlooking Lake Palace"]
      },
      pace: {
        type: "relaxed",
        label: "Relaxed",
        icon: "🌿",
        actPerDay: 2,
        freeTimeHrs: 4.5,
        lateNight: false,
        desc: "2 activities/day • Relaxed lake cruises & royal palace family strolling"
      },
      convenience: {
        airportTransfers: "Private SUV Airport Transfer",
        localTransport: "Dedicated AC SUV for Family",
        hotelChanges: 1,
        avgDailyTravelMins: 30,
        transportType: "Private AC SUV"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Golden Winter Lake Sunshine",
        reason: "Mild temperatures perfect for lake boat rides and palace gardens."
      },
      description: "Lake Pichola private boat cruises, City Palace, Bagore-ki-Haveli dance shows, and 5-star family luxury."
    },
    {
      id: "ooty-toy-train",
      name: "Ooty Toy Train & Nilgiri Hills Family Tour",
      destination: "Ooty",
      country: "Tamil Nadu, India",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
      duration: "4 Days / 3 Nights",
      durationDays: 4,
      price: "₹18,500",
      numericPrice: 18500,
      estimatedTotalCost: 23200,
      costBreakdown: { taxes: "₹1,800", localExpenses: "₹2,900" },
      rating: 4.7,
      reviewsCount: 140,
      reviewsBreakdown: { cleanliness: 4.7, transport: 4.6, stay: 4.8, value: 4.8, activities: 4.7 },
      accommodation: {
        category: "Colonial Pine Cottage Hill Resort",
        rating: 4.8,
        location: "Ooty Lake & Botanical Hill Side",
        distanceToHub: "1km to Ooty Lake",
        meals: "Breakfast & Dinner Included",
        hotelChanges: 1
      },
      experiences: {
        activitiesCount: 5,
        attractionsCount: 6,
        breakdown: { adventure: 60, nature: 95, culture: 75, food: 80, shopping: 70, nightlife: 20 },
        attractionsList: ["UNESCO Toy Train", "Ooty Lake", "Doddabetta Peak", "Botanical Gardens", "Tea Factory & Chocolate Museum", "Pykara Waterfalls"],
        activitiesList: ["UNESCO Heritage Toy Train Ride (Coonoor to Ooty)", "Ooty Lake Family Boating", "Doddabetta Telescope Peak View", "Homemade Chocolate Tasting & Factory Tour", "Pykara Lake Speedboat Ride"]
      },
      pace: {
        type: "relaxed",
        label: "Relaxed",
        icon: "🌿",
        actPerDay: 2,
        freeTimeHrs: 4,
        lateNight: false,
        desc: "2 activities/day • Toy train ride, chocolate factories & lake boating"
      },
      convenience: {
        airportTransfers: "Private Coimbatore Airport Cab",
        localTransport: "Dedicated AC Cab",
        hotelChanges: 1,
        avgDailyTravelMins: 45,
        transportType: "Private AC"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Refreshing Nilgiri Climate",
        reason: "Pleasant mountain temperatures ideal for kids and family outings."
      },
      description: "UNESCO Heritage Toy Train, Ooty lake family boating, chocolate factory tours, and botanical gardens."
    },
    {
      id: "singapore-family-fun",
      name: "Singapore Universal & Sentosa Family Wonderland",
      destination: "Singapore",
      country: "Singapore",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
      duration: "5 Days / 4 Nights",
      durationDays: 5,
      price: "₹72,000",
      numericPrice: 72000,
      estimatedTotalCost: 86000,
      costBreakdown: { taxes: "₹7,000", localExpenses: "₹7,000" },
      rating: 4.9,
      reviewsCount: 210,
      reviewsBreakdown: { cleanliness: 5.0, transport: 5.0, stay: 4.9, value: 4.7, activities: 5.0 },
      accommodation: {
        category: "4-Star Sentosa Family Resort & Spa",
        rating: 4.9,
        location: "Sentosa Island",
        distanceToHub: "Direct Shuttle to Universal Studios",
        meals: "Daily Buffet Breakfast Included",
        hotelChanges: 1
      },
      experiences: {
        activitiesCount: 6,
        attractionsCount: 8,
        breakdown: { adventure: 85, nature: 85, culture: 75, food: 90, shopping: 90, nightlife: 75 },
        attractionsList: ["Universal Studios Singapore", "Gardens by the Bay", "S.E.A. Aquarium", "Night Safari", "Marina Bay Sands SkyPark", "Jewel Changi Waterfall"],
        activitiesList: ["Full-Day Universal Studios Theme Park Pass", "Gardens by the Bay Supertree Light Show", "World's First Night Safari Tram Ride", "S.E.A. Aquarium Marine Discovery", "Sentosa Cable Car Ride"]
      },
      pace: {
        type: "balanced",
        label: "Balanced",
        icon: "⚖️",
        actPerDay: 3,
        freeTimeHrs: 3.5,
        lateNight: true,
        desc: "3 activities/day • Universal Studios, Night Safari & Gardens by the Bay"
      },
      convenience: {
        airportTransfers: "Private Changi Airport Transfer",
        localTransport: "EZ-Link MRT Pass & Private Shuttle",
        hotelChanges: 1,
        avgDailyTravelMins: 25,
        transportType: "Private Transfer & MRT"
      },
      weatherSuitability: {
        status: "excellent",
        label: "Excellent",
        icon: "☀",
        title: "Tropical Sunshine & Cool Attractions",
        reason: "Air-conditioned indoor marine parks, night safaris, and theme park fun."
      },
      description: "Universal Studios theme park, Night Safari, S.E.A. Aquarium, and Gardens by the Bay light shows."
    }
  ]
}

/* ─────────────────────────────────────────────
   ALGORITHMIC PERSONAL MATCH SCORE ENGINE
   ───────────────────────────────────────────── */
function calculatePersonalMatchScore(pkg, priority = "budget", userTargetBudget = 32000) {
  if (!pkg) return { score: 75, reasons: [], warnings: [] }

  let score = 75 // Base starting score
  const reasons = []
  const warnings = []

  // 1. Price vs Budget Check
  const priceDiff = userTargetBudget - pkg.numericPrice
  if (priceDiff >= 0) {
    score += 10
    reasons.push(`Within your target budget of ₹${(userTargetBudget / 1000).toFixed(0)}K`)
  } else {
    score -= Math.min(15, Math.abs(Math.round(priceDiff / 1000)))
    warnings.push(`Exceeds budget target by ₹${(Math.abs(priceDiff) / 1000).toFixed(1)}K`)
  }

  // 2. Rating & Value Check
  if (pkg.rating >= 4.7) {
    score += 8
    reasons.push(`Outstanding ${pkg.rating}★ rating from ${pkg.reviewsCount}+ travelers`)
  }

  // 3. Priority Specific Score Tuning
  if (priority === "budget") {
    if (pkg.numericPrice < 20000) {
      score += 12
      reasons.push("Highly economical package price under ₹20,000")
    } else if (pkg.numericPrice > 30000) {
      score -= 10
      warnings.push("Higher tier pricing compared to budget alternatives")
    }
    if (pkg.accommodation.meals.includes("All") || pkg.accommodation.meals.includes("Dinner")) {
      score += 5
      reasons.push("Meals included, reducing out-of-pocket dining costs")
    }
  } else if (priority === "experiences") {
    const actCount = pkg.experiences.activitiesCount + pkg.experiences.attractionsCount
    if (actCount >= 10) {
      score += 14
      reasons.push(`Packed with ${actCount} curated activities & top sight visits`)
    } else {
      score -= 5
      warnings.push("Fewer total activities compared to experience-heavy tours")
    }
  } else if (priority === "relaxation") {
    if (pkg.pace.type === "relaxed") {
      score += 15
      reasons.push(`Preferred relaxed pace (${pkg.pace.freeTimeHrs} hrs daily free time)`)
    } else if (pkg.pace.type === "packed") {
      score -= 12
      warnings.push("Busy schedule with 4+ activities/day and minimal free time")
    }
    if (pkg.accommodation.hotelChanges <= 1) {
      score += 5
      reasons.push("Single hotel stay — zero stressful room check-outs")
    } else {
      warnings.push("Requires multiple hotel changes during the trip")
    }
  } else if (priority === "comfort") {
    if (pkg.accommodation.category.includes("4-Star") || pkg.accommodation.category.includes("5-Star") || pkg.accommodation.category.includes("Luxury")) {
      score += 15
      reasons.push(`Includes premium ${pkg.accommodation.category}`)
    } else {
      score -= 8
      warnings.push("Standard/3-Star accommodation tier")
    }
    if (pkg.convenience.transportType.includes("Private")) {
      score += 6
      reasons.push("Includes private AC vehicle transfers throughout")
    }
  } else if (priority === "adventure") {
    if (pkg.experiences.breakdown.adventure >= 80) {
      score += 15
      reasons.push("High adventure score featuring watersports, treks & safaris")
    } else {
      score -= 10
      warnings.push("Leaning more towards passive leisure than high thrill")
    }
  }

  // Weather bonus
  if (pkg.weatherSuitability.status === "excellent") {
    score += 5
    reasons.push(pkg.weatherSuitability.reason)
  }

  const finalScore = Math.min(99, Math.max(55, Math.round(score)))

  return {
    score: finalScore,
    reasons,
    warnings
  }
}

/* ─────────────────────────────────────────────
   MAIN PACKAGE COMPARISON COMPONENT
   ───────────────────────────────────────────── */
export function PackageComparison({ onNavigateView, onSelectDestination, onOpenAuth }) {
  const { selectPackageAndBuildTrip, selectedPackage, customTargetBudget, totalBudget } = useTrip()

  const [activeCategory, setActiveCategory] = useState("beach")
  const [selectedForCompare, setSelectedForCompare] = useState(["goa-escape", "gokarna-getaway", "andaman-luxury"])
  const [userPriority, setUserPriority] = useState("relaxation")
  const userBudget = customTargetBudget || totalBudget || 32000

  const [viewingModalPkg, setViewingModalPkg] = useState(null)
  const [showingMatchDetailPkg, setShowingMatchDetailPkg] = useState(null)
  const [showFullMatrix, setShowFullMatrix] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // Combined Dataset
  const allPackages = useMemo(() => {
    return Object.values(PACKAGE_DATA).flat()
  }, [])

  const currentCategoryPackages = useMemo(() => {
    return PACKAGE_DATA[activeCategory] || PACKAGE_DATA.beach
  }, [activeCategory])

  // Packages currently selected for comparison
  const comparedPackagesList = useMemo(() => {
    return allPackages.filter((p) => selectedForCompare.includes(p.id))
  }, [allPackages, selectedForCompare])

  // Dynamic Decision Metrics Calculation
  const decisionData = useMemo(() => {
    if (comparedPackagesList.length === 0) return null

    const scored = comparedPackagesList.map((pkg) => {
      const match = calculatePersonalMatchScore(pkg, userPriority, userBudget)
      const valueScore = (pkg.rating * 20 + pkg.experiences.activitiesCount * 5) / (pkg.numericPrice / 1000)
      const expScore = pkg.experiences.activitiesCount * 10 + pkg.experiences.attractionsCount * 5 + (pkg.experiences.breakdown.adventure || 50)
      return { pkg, match, valueScore, expScore }
    })

    // Sort to find winners
    const bestForYouObj = [...scored].sort((a, b) => b.match.score - a.match.score)[0]
    const bestValueObj = [...scored].sort((a, b) => b.valueScore - a.valueScore)[0]
    const bestExperienceObj = [...scored].sort((a, b) => b.expScore - a.expScore)[0]

    const runnerUpObj = scored.find((s) => s.pkg.id !== bestForYouObj.pkg.id) || scored[1] || scored[0]

    // Formulate intelligent trade-off explanation
    let rationale = `Recommended because it matches your preferred ${userPriority} focus`
    if (bestForYouObj.match.reasons.length > 0) {
      rationale += `, ${bestForYouObj.match.reasons[0].toLowerCase()}`
      if (bestForYouObj.match.reasons[1]) {
        rationale += `, and ${bestForYouObj.match.reasons[1].toLowerCase()}`
      }
    }

    let tradeOff = ""
    if (runnerUpObj && runnerUpObj.pkg.id !== bestForYouObj.pkg.id) {
      if (runnerUpObj.pkg.numericPrice < bestForYouObj.pkg.numericPrice) {
        tradeOff = `Choose ${runnerUpObj.pkg.name} instead if saving ₹${(bestForYouObj.pkg.numericPrice - runnerUpObj.pkg.numericPrice).toLocaleString("en-IN")} is your primary goal.`
      } else if (runnerUpObj.pkg.experiences.activitiesCount > bestForYouObj.pkg.experiences.activitiesCount) {
        tradeOff = `Choose ${runnerUpObj.pkg.name} instead if you prefer more total activities (+${runnerUpObj.pkg.experiences.activitiesCount - bestForYouObj.pkg.experiences.activitiesCount} extra).`
      } else {
        tradeOff = `Choose ${runnerUpObj.pkg.name} instead if you prefer ${runnerUpObj.pkg.destination}'s unique regional spots.`
      }
    }

    return {
      scored,
      bestForYouId: bestForYouObj.pkg.id,
      bestValueId: bestValueObj.pkg.id,
      bestExperienceId: bestExperienceObj.pkg.id,
      recommendedPkg: bestForYouObj.pkg,
      recommendedMatch: bestForYouObj.match,
      runnerUpPkg: runnerUpObj ? runnerUpObj.pkg : null,
      rationale,
      tradeOff
    }
  }, [comparedPackagesList, userPriority, userBudget])

  const toggleCompare = (pkgId) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(pkgId)) {
        if (prev.length <= 1) return prev // Keep at least 1
        return prev.filter((id) => id !== pkgId)
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], pkgId]
      }
      return [...prev, pkgId]
    })
  }

  const handleAddToTrip = (pkg) => {
    selectPackageAndBuildTrip(pkg)
    setToastMessage(`✓ ${pkg.name} added to your personal itinerary!`)
    setTimeout(() => setToastMessage(null), 5000)
  }

  return (
    <section id="packages" className="relative w-full overflow-hidden min-h-screen py-12 sm:py-16 md:py-20 bg-background text-foreground select-none font-sans transition-colors duration-300">
      {/* Travel Doodles Background */}
      <DoodleBackground />
      
      {/* Background Cartographic Radial Pattern */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-background to-background pointer-events-none" />

      {/* Confirmation Toast Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl bg-emerald-600 text-white px-6 py-3.5 shadow-2xl border border-white/20 text-xs sm:text-sm font-semibold"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{toastMessage}</span>
            <Button
              size="sm"
              onClick={() => onNavigateView && onNavigateView("itinerary")}
              className="ml-2 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 font-extrabold text-xs px-3.5 py-1.5 shadow"
            >
              Open Planner →
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
        
        {/* 1. Header Title & Subtitle */}
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <h2 className="font-serif-editorial text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground uppercase leading-[0.95]">
            COMPARE LESS.<br />
            <span className="font-heading font-extrabold text-foreground italic lowercase">experience</span><br />
            MORE.
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto font-medium tracking-wide">
            Compare packages side-by-side and easily add them directly to your personal trip itinerary or saved trips.
          </p>
        </div>

        {/* 3. DECISION RECOMMENDATION CARD (The "Best For You" Answer) */}
        {decisionData && decisionData.recommendedPkg && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-sm border border-border bg-card shadow-sm overflow-hidden p-6 sm:p-8 space-y-6 relative"
          >
            <div className="absolute top-0 right-0 bg-[#8D5BB3] text-white border-b border-l border-[#8D5BB3] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-sm shadow-xs">
              Personalized Decision
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              {/* Left Summary */}
              <div className="space-y-3 flex-1">
                <span className="font-heading text-xs font-black uppercase tracking-wider text-[#8D5BB3] dark:text-white block">
                  BEST FOR YOU ({decisionData.recommendedMatch.score}% MATCH)
                </span>

                <h3 className="font-heading text-2xl sm:text-4xl font-extrabold text-black dark:text-white">
                  {decisionData.recommendedPkg.name}
                </h3>

                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed max-w-2xl font-medium border-l-2 border-[#8D5BB3] pl-3 py-0.5">
                  "{decisionData.rationale}"
                </p>

                {/* Key Highlight Metadata Line */}
                <div className="text-xs font-semibold text-muted-foreground pt-1 tracking-wide">
                  Est. Total Cost: <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹{decisionData.recommendedPkg.estimatedTotalCost.toLocaleString("en-IN")}</span> · {decisionData.recommendedPkg.pace.label} Pace · {decisionData.recommendedPkg.convenience.transportType}
                </div>
              </div>

              {/* Right CTA Block */}
              <div className="flex flex-col sm:flex-row md:flex-col items-center gap-3 shrink-0 w-full md:w-auto">
                <Button
                  onClick={() => handleAddToTrip(decisionData.recommendedPkg)}
                  className="w-full sm:w-auto rounded-sm bg-[#8D5BB3] hover:bg-[#7b4d9e] text-white border border-[#8D5BB3] font-bold text-xs uppercase tracking-wider px-5 py-2.5 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Select {decisionData.recommendedPkg.destination} Trip
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 4. SIDE-BY-SIDE PACKAGE COMPARISON CARDS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xs uppercase tracking-widest text-foreground font-extrabold">
              Comparing {comparedPackagesList.length} Packages Side-by-Side
            </h3>

            {/* Category Filter Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {VACATION_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id)
                    const catPkgs = PACKAGE_DATA[cat.id] || []
                    if (catPkgs.length > 0) {
                      setSelectedForCompare(catPkgs.slice(0, 3).map((p) => p.id))
                    }
                  }}
                  className={`rounded-sm px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-[#8D5BB3] text-white border-[#8D5BB3] shadow-xs"
                      : "bg-[#FFEEEE] text-[#4A154B] border-transparent hover:bg-[#fcdede]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Package Cards Grid */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {comparedPackagesList.map((pkg) => {
              const matchObj = calculatePersonalMatchScore(pkg, userPriority, userBudget)
              const isBestForYou = decisionData?.bestForYouId === pkg.id
              const isBestValue = decisionData?.bestValueId === pkg.id
              const isBestExp = decisionData?.bestExperienceId === pkg.id

              return (
                <div
                  key={pkg.id}
                  className={`group relative rounded-sm border bg-card text-card-foreground p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-all hover:border-[#5A8CB2] ${
                    isBestForYou ? "border-2 border-[#5A8CB2]" : "border-border"
                  }`}
                >
                  <div className="space-y-4">
                    
                    {/* Top Typography Badges */}
                    <div className="flex items-center justify-between gap-2 flex-wrap min-h-[24px]">
                      {isBestForYou ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F172A] dark:text-white">
                          BEST FOR YOU
                        </span>
                      ) : isBestValue ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                          BEST VALUE
                        </span>
                      ) : isBestExp ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                          BEST EXPERIENCE
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {pkg.destination}
                        </span>
                      )}

                      {/* Clickable Personal Match Score Badge */}
                      <button
                        onClick={() => setShowingMatchDetailPkg(pkg)}
                        className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] dark:text-white hover:underline cursor-pointer"
                        title="Click to view why this score matches you"
                      >
                        {matchObj.score}% MATCH
                      </button>
                    </div>

                    {/* Package Image & Hero Overlay */}
                    <div className="relative h-44 w-full rounded-sm overflow-hidden border border-border/80">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute top-3 left-3">
                        <span className="rounded-sm bg-black/70 backdrop-blur-md text-white font-heading font-semibold text-[10px] uppercase tracking-wider px-2.5 py-0.5 border border-white/20">
                          {pkg.duration}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h4 className="font-heading text-lg font-bold leading-tight drop-shadow-md truncate">
                          {pkg.name}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] opacity-90 mt-0.5 font-medium">
                          <span>⭐ {pkg.rating} ({pkg.reviewsCount} reviews)</span>
                          <span>{pkg.pace.label}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Estimated Actual Trip Cost */}
                    <div className="rounded-sm bg-secondary/40 p-3 border border-border/50 space-y-1">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[9.5px] uppercase tracking-widest text-muted-foreground font-bold block">Package Base Price</span>
                          <span className="font-heading text-2xl font-extrabold text-foreground">{pkg.price}</span>
                          <span className="text-[11px] text-muted-foreground font-medium"> / person</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9.5px] uppercase tracking-widest text-muted-foreground font-bold block">Est. Actual Trip Cost</span>
                          <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                            ₹{pkg.estimatedTotalCost.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Feature Highlights — Clean Typography */}
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="font-semibold text-foreground truncate">
                        {pkg.accommodation.category}
                      </div>

                      <div className="font-medium">
                        {pkg.experiences.activitiesCount} Activities · {pkg.experiences.attractionsCount} Sights
                      </div>

                      <div className="font-medium truncate">
                        {pkg.convenience.airportTransfers}
                      </div>
                    </div>

                  </div>

                  {/* Bottom Card Actions */}
                  <div className="mt-5 pt-3 border-t border-border/60 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingModalPkg(pkg)}
                        className="rounded-sm border-[#FFEEEE] bg-[#FFEEEE] hover:bg-[#fcdede] text-[#4A154B] font-bold text-xs cursor-pointer shadow-xs"
                      >
                        Details
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCompare(pkg.id)}
                        className={`rounded-sm font-bold text-xs transition-all cursor-pointer ${
                          selectedForCompare.includes(pkg.id)
                            ? "bg-[#FFEEEE] text-[#4A154B] border-[#FFEEEE]"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        Remove
                      </Button>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleAddToTrip(pkg)}
                      className="w-full rounded-sm font-bold text-xs uppercase tracking-wider py-2.5 flex items-center justify-center gap-1.5 cursor-pointer bg-[#8D5BB3] hover:bg-[#7b4d9e] text-white shadow-xs"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add to My Trip</span>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 5. PROGRESSIVE DISCLOSURE: VIEW FULL DETAILED COMPARISON MATRIX */}
        <div className="pt-4 text-center">
          <Button
            variant="outline"
            onClick={() => setShowFullMatrix(!showFullMatrix)}
            className="rounded-sm border-[#8D5BB3] bg-[#8D5BB3] hover:bg-[#7b4d9e] text-white font-bold text-xs sm:text-sm px-6 py-3 shadow-xs cursor-pointer inline-flex items-center justify-center gap-2"
          >
            {showFullMatrix ? "Hide Detailed Comparison Matrix" : "View Full Detailed Category Comparison Matrix"}
          </Button>
        </div>

        {showFullMatrix && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-sm border border-border bg-card shadow-lg text-card-foreground"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="p-4 font-heading text-xs font-extrabold uppercase tracking-widest text-muted-foreground w-1/4">
                      Comparison Category
                    </th>
                    {comparedPackagesList.map((pkg) => (
                      <th key={pkg.id} className="p-4 text-center border-l border-border w-1/4">
                        <span className="font-heading text-base font-extrabold text-foreground block truncate">{pkg.name}</span>
                        <span className="font-extrabold text-sm text-[#0F172A] dark:text-white block">{pkg.price}</span>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-border text-xs sm:text-sm">
                  {/* Category: Cost */}
                  <tr className="bg-secondary/20">
                    <td colSpan={comparedPackagesList.length + 1} className="p-3 font-heading font-black text-foreground uppercase text-[10px] tracking-widest">
                      A. COST & VALUE
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Package Base Price</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-extrabold text-foreground border-l border-border">{pkg.price}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Taxes & Mandatory Fees</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-medium border-l border-border">{pkg.costBreakdown.taxes}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Est. Additional Expenses</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-medium border-l border-border">{pkg.costBreakdown.localExpenses}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Est. Total Trip Expenditure</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-extrabold text-emerald-600 dark:text-emerald-400 border-l border-border">₹{pkg.estimatedTotalCost.toLocaleString("en-IN")}</td>
                    ))}
                  </tr>

                  {/* Category: Accommodation */}
                  <tr className="bg-secondary/20">
                    <td colSpan={comparedPackagesList.length + 1} className="p-3 font-heading font-black text-foreground uppercase text-[10px] tracking-widest">
                      B. ACCOMMODATION & MEALS
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Hotel Tier Category</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-bold text-foreground border-l border-border">{pkg.accommodation.category}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Location & Accessibility</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-medium border-l border-border">{pkg.accommodation.location} ({pkg.accommodation.distanceToHub})</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Meals Included</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-medium border-l border-border">{pkg.accommodation.meals}</td>
                    ))}
                  </tr>

                  {/* Category: Trip Pace */}
                  <tr className="bg-secondary/20">
                    <td colSpan={comparedPackagesList.length + 1} className="p-3 font-heading font-black text-foreground uppercase text-[10px] tracking-widest">
                      C. TRIP PACE & SCHEDULE
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Pace Classification</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-bold border-l border-border">{pkg.pace.label}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Activities per Day</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-medium border-l border-border">{pkg.pace.actPerDay} activities/day</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Average Daily Free Time</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-medium border-l border-border">{pkg.pace.freeTimeHrs} hours free time/day</td>
                    ))}
                  </tr>

                  {/* Category: Convenience */}
                  <tr className="bg-secondary/20">
                    <td colSpan={comparedPackagesList.length + 1} className="p-3 font-heading font-black text-foreground uppercase text-[10px] tracking-widest">
                      D. CONVENIENCE & LOGISTICS
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Airport Transfers</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-medium border-l border-border">{pkg.convenience.airportTransfers}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Local Transport Vehicle</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-medium border-l border-border">{pkg.convenience.localTransport}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted-foreground">Hotel Changes</td>
                    {comparedPackagesList.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center font-medium border-l border-border">{pkg.convenience.hotelChanges} Stay Location</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

      </div>

      {/* 6. PERSONAL MATCH SCORE BREAKDOWN DIALOG MODAL */}
      <AnimatePresence>
        {showingMatchDetailPkg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl bg-card border border-border text-card-foreground p-6 sm:p-8 shadow-2xl space-y-5"
            >
              <button
                onClick={() => setShowingMatchDetailPkg(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C98B55]">
                  Score Transparency Report
                </span>
                <h3 className="font-heading text-2xl font-extrabold flex items-center gap-2">
                  <span>{showingMatchDetailPkg.name}</span>
                  <span className="text-[#C98B55]">
                    ({calculatePersonalMatchScore(showingMatchDetailPkg, userPriority, userBudget).score}% Match)
                  </span>
                </h3>
              </div>

              {/* Reasons List */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Why this matches your {userPriority} preference ({calculatePersonalMatchScore(showingMatchDetailPkg, userPriority, userBudget).reasons.length})
                </h4>

                <ul className="space-y-2 text-xs text-foreground">
                  {calculatePersonalMatchScore(showingMatchDetailPkg, userPriority, userBudget).reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warnings List */}
              {calculatePersonalMatchScore(showingMatchDetailPkg, userPriority, userBudget).warnings.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" />
                    Potential Trade-offs to Consider
                  </h4>

                  <ul className="space-y-2 text-xs text-foreground">
                    {calculatePersonalMatchScore(showingMatchDetailPkg, userPriority, userBudget).warnings.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                        <span className="text-amber-500 font-bold">⚠</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                onClick={() => setShowingMatchDetailPkg(null)}
                className="w-full rounded-2xl bg-[#C98B55] text-white hover:bg-[#b07847] font-bold text-xs py-3 shadow-md cursor-pointer"
              >
                Close Breakdown
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. PACKAGE DETAILS MODAL */}
      <AnimatePresence>
        {viewingModalPkg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl rounded-3xl bg-card border border-border text-card-foreground p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setViewingModalPkg(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-2 border-b border-border pb-4">
                <span className="text-xs font-bold text-[#C98B55] bg-[#C98B55]/15 px-3 py-1 rounded-full border border-[#C98B55]/30 uppercase tracking-wider">
                  {viewingModalPkg.duration} • {viewingModalPkg.destination}
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
                  {viewingModalPkg.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {viewingModalPkg.description}
                </p>
              </div>

              <div className="relative h-52 w-full rounded-2xl overflow-hidden border border-border">
                <img src={viewingModalPkg.image} alt={viewingModalPkg.name} className="h-full w-full object-cover" />
              </div>

              <div className="space-y-2">
                <h4 className="font-heading text-xs font-extrabold uppercase tracking-widest text-[#C98B55]">
                  Included Attractions ({viewingModalPkg.experiences.attractionsList.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {viewingModalPkg.experiences.attractionsList.map((att, idx) => (
                    <span key={idx} className="rounded-xl bg-secondary border border-border px-3 py-1 text-xs font-semibold text-foreground">
                      📍 {att}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-heading text-xs font-extrabold uppercase tracking-widest text-[#C98B55]">
                  Included Curated Activities ({viewingModalPkg.experiences.activitiesList.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {viewingModalPkg.experiences.activitiesList.map((act, idx) => (
                    <span key={idx} className="rounded-xl bg-[#C98B55]/15 border border-[#C98B55]/30 px-3 py-1 text-xs font-semibold text-[#C98B55]">
                      ✨ {act}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Package Price</span>
                  <span className="font-heading text-2xl font-extrabold text-foreground">{viewingModalPkg.price}</span>
                </div>

                <Button
                  onClick={() => {
                    handleAddToTrip(viewingModalPkg)
                    setViewingModalPkg(null)
                  }}
                  className="rounded-2xl bg-[#C98B55] hover:bg-[#b07847] text-white font-extrabold text-xs sm:text-sm px-6 py-3 shadow-lg cursor-pointer"
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
