"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Globe,
  Sparkles,
  CloudSun,
  Users,
  HeartHandshake,
  Clock,
  Coins,
  Ticket,
  Hotel,
  Utensils,
  Mountain,
  Palmtree,
  Car,
  Sun,
  Snowflake,
  CloudRain,
  PartyPopper,
  Sofa,
  Compass,
  Wallet,
  Crown,
  X,
  SlidersHorizontal,
  Calendar,
  Star,
  MapPin,
  Thermometer,
  Heart,
  TrendingUp,
  Gem,
  Plane,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"

/* ─────────────────────────────────────────────
   105 DESTINATIONS WITH FULL FILTER METADATA
   ───────────────────────────────────────────── */
const allDestinations = [
  {
    "id": "kerala",
    "name": "Kerala",
    "subtitle": "Backwaters & Tea",
    "country": "India",
    "temp": "27\u00b0C",
    "image": "/images/dest-kerala.png",
    "rating": 4.9,
    "ageGroup": "All Ages",
    "vibe": "Serene Backwaters",
    "bestTime": "Sep \u2013 Mar",
    "startingBudget": "From \u20b912,500",
    "attractions": 32,
    "hotels": 48,
    "foodSpots": 28,
    "itineraryIdeas": 15,
    "description": "Emerald backwaters, lush tea estates in Munnar, Ayurvedic wellness, and quiet cliffside beaches.",
    "weather": "Monsoon",
    "company": "Family",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 5,
    "specialty": "Backwaters & Ayurveda",
    "color": "#10B981",
    "row": "trending"
  },
  {
    "id": "goa",
    "name": "Goa",
    "subtitle": "Beaches & Shacks",
    "country": "India",
    "temp": "31\u00b0C",
    "image": "/images/dest-goa.png",
    "rating": 4.8,
    "ageGroup": "18 \u2013 40 Yrs",
    "vibe": "Sun, Surf & Nightlife",
    "bestTime": "Nov \u2013 Feb",
    "startingBudget": "From \u20b99,800",
    "attractions": 24,
    "hotels": 65,
    "foodSpots": 42,
    "itineraryIdeas": 12,
    "description": "Sun-drenched golden beaches, vibrant night markets, Portuguese heritage quarters, and seafood.",
    "weather": "Winters",
    "company": "Friends",
    "mood": "Party",
    "budget": "Economy",
    "type": "Beach",
    "minDays": 4,
    "specialty": "Nightlife & Beaches",
    "color": "#F59E0B",
    "row": "trending"
  },
  {
    "id": "jaipur",
    "name": "Jaipur",
    "subtitle": "Heritage & Forts",
    "country": "India",
    "temp": "26\u00b0C",
    "image": "/images/dest-jaipur.png",
    "rating": 4.7,
    "ageGroup": "All Ages",
    "vibe": "Royal & Historic",
    "bestTime": "Oct \u2013 Mar",
    "startingBudget": "From \u20b98,500",
    "attractions": 19,
    "hotels": 38,
    "foodSpots": 31,
    "itineraryIdeas": 10,
    "description": "The Royal Pink City with majestic hill forts, opulent grand palaces, bustling bazaars.",
    "weather": "Winters",
    "company": "Family",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 3,
    "specialty": "Forts & Palaces",
    "color": "#EC4899",
    "row": "trending"
  },
  {
    "id": "manali",
    "name": "Manali",
    "subtitle": "Mountains & Snow",
    "country": "India",
    "temp": "14\u00b0C",
    "image": "/images/dest-manali.png",
    "rating": 4.6,
    "ageGroup": "16 \u2013 45 Yrs",
    "vibe": "Snow Thrills & Pines",
    "bestTime": "Oct \u2013 May",
    "startingBudget": "From \u20b911,000",
    "attractions": 22,
    "hotels": 40,
    "foodSpots": 25,
    "itineraryIdeas": 14,
    "description": "Himalayan adventure haven offering snow sports in Solang, pine trails, river rafting.",
    "weather": "Winters",
    "company": "Friends",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 5,
    "specialty": "Snow & Adventure",
    "color": "#3B82F6",
    "row": "trending"
  },
  {
    "id": "bali",
    "name": "Bali",
    "subtitle": "Island Relaxation",
    "country": "Indonesia",
    "temp": "29\u00b0C",
    "image": "/images/dest-bali.png",
    "rating": 4.9,
    "ageGroup": "20 \u2013 50 Yrs",
    "vibe": "Spiritual & Tropical",
    "bestTime": "Apr \u2013 Oct",
    "startingBudget": "From \u20b928,000",
    "attractions": 45,
    "hotels": 80,
    "foodSpots": 55,
    "itineraryIdeas": 20,
    "description": "Tropical island paradise blending sacred cliffside temples, terraced rice paddies, surfing beaches.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Relax",
    "budget": "Luxury",
    "type": "Beach",
    "minDays": 6,
    "specialty": "Temples & Rice Terraces",
    "color": "#14B8A6",
    "row": "trending"
  },
  {
    "id": "santorini",
    "name": "Santorini",
    "subtitle": "Luxury Cliffside",
    "country": "Greece",
    "temp": "24\u00b0C",
    "image": "/images/dest-santorini.png",
    "rating": 4.9,
    "ageGroup": "22 \u2013 55 Yrs",
    "vibe": "Romantic Aegean Sunsets",
    "bestTime": "May \u2013 Oct",
    "startingBudget": "From \u20b945,000",
    "attractions": 18,
    "hotels": 52,
    "foodSpots": 36,
    "itineraryIdeas": 11,
    "description": "Iconic whitewashed cliff villages with blue domes, volcanic sand beaches, wine tasting.",
    "weather": "Summers",
    "company": "Family",
    "mood": "Relax",
    "budget": "Luxury",
    "type": "Beach",
    "minDays": 5,
    "specialty": "Sunsets & Blue Domes",
    "color": "#6366F1",
    "row": "trending"
  },
  {
    "id": "switzerland",
    "name": "Switzerland",
    "subtitle": "Alpine Adventure",
    "country": "Switzerland",
    "temp": "10\u00b0C",
    "image": "/images/hero-mountains.png",
    "rating": 4.8,
    "ageGroup": "All Ages",
    "vibe": "Glacier Lakes & Snow Peaks",
    "bestTime": "Jun \u2013 Sep",
    "startingBudget": "From \u20b965,000",
    "attractions": 35,
    "hotels": 60,
    "foodSpots": 40,
    "itineraryIdeas": 18,
    "description": "Pristine Alpine landscapes, panoramic train journeys, glacier lakes, and ski slopes.",
    "weather": "Winters",
    "company": "Family",
    "mood": "Adventure",
    "budget": "Luxury",
    "type": "Mountains",
    "minDays": 7,
    "specialty": "Alps & Glaciers",
    "color": "#0EA5E9",
    "row": "trending"
  },
  {
    "id": "maldives",
    "name": "Maldives",
    "subtitle": "Overwater Bliss",
    "country": "Maldives",
    "temp": "30\u00b0C",
    "image": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&auto=format&fit=crop&q=80",
    "rating": 4.9,
    "ageGroup": "20 \u2013 55 Yrs",
    "vibe": "Luxury Overwater",
    "bestTime": "Nov \u2013 Apr",
    "startingBudget": "From \u20b955,000",
    "attractions": 12,
    "hotels": 45,
    "foodSpots": 20,
    "itineraryIdeas": 8,
    "description": "Turquoise lagoons, white sandbanks, luxury overwater villas, and vibrant coral reefs.",
    "weather": "Summers",
    "company": "Solo",
    "mood": "Relax",
    "budget": "Luxury",
    "type": "Beach",
    "minDays": 5,
    "specialty": "Overwater Villas",
    "color": "#06B6D4",
    "row": "trending"
  },
  {
    "id": "ladakh",
    "name": "Ladakh",
    "subtitle": "High Desert",
    "country": "India",
    "temp": "8\u00b0C",
    "image": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "18 \u2013 45 Yrs",
    "vibe": "Rugged Mountain Desert",
    "bestTime": "Jun \u2013 Sep",
    "startingBudget": "From \u20b915,000",
    "attractions": 28,
    "hotels": 30,
    "foodSpots": 18,
    "itineraryIdeas": 16,
    "description": "Otherworldly barren landscapes, dramatic mountain passes, ancient Buddhist monasteries.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 7,
    "specialty": "Pangong Lake",
    "color": "#8B5CF6",
    "row": "trending"
  },
  {
    "id": "rishikesh",
    "name": "Rishikesh",
    "subtitle": "Spiritual Rapids",
    "country": "India",
    "temp": "25\u00b0C",
    "image": "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=600&auto=format&fit=crop&q=80",
    "rating": 4.5,
    "ageGroup": "18 \u2013 40 Yrs",
    "vibe": "Yoga & Rafting",
    "bestTime": "Sep \u2013 Nov",
    "startingBudget": "From \u20b95,500",
    "attractions": 15,
    "hotels": 35,
    "foodSpots": 22,
    "itineraryIdeas": 9,
    "description": "Ganges-side yoga capital with thrilling white-water rafting, bungee jumping, cliff ashrams.",
    "weather": "Monsoon",
    "company": "Solo",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 3,
    "specialty": "Rafting & Yoga",
    "color": "#F97316",
    "row": "trending"
  },
  {
    "id": "tokyo",
    "name": "Tokyo",
    "subtitle": "Neon & Tech",
    "country": "Japan",
    "temp": "17\u00b0C",
    "image": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80",
    "rating": 4.9,
    "ageGroup": "All Ages",
    "vibe": "Futuristic Metropolis",
    "bestTime": "Mar \u2013 May",
    "startingBudget": "From \u20b958,000",
    "attractions": 60,
    "hotels": 95,
    "foodSpots": 85,
    "itineraryIdeas": 28,
    "description": "Bustling Shibuya Crossing, historic Senso-ji temple, Michelin dining, and anime districts.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Party",
    "budget": "Luxury",
    "type": "Road Trips",
    "minDays": 6,
    "specialty": "Shibuya & Anime",
    "color": "#E11D48",
    "row": "trending"
  },
  {
    "id": "amsterdam",
    "name": "Amsterdam",
    "subtitle": "Canals & Culture",
    "country": "Netherlands",
    "temp": "15\u00b0C",
    "image": "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=600&auto=format&fit=crop&q=80",
    "rating": 4.7,
    "ageGroup": "18 \u2013 45 Yrs",
    "vibe": "Canal Charm & Cycling",
    "bestTime": "Apr \u2013 Sep",
    "startingBudget": "From \u20b948,000",
    "attractions": 30,
    "hotels": 50,
    "foodSpots": 45,
    "itineraryIdeas": 14,
    "description": "Historic canal houses, Van Gogh museum, bicycle culture, and picturesque flower markets.",
    "weather": "Summers",
    "company": "Solo",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 4,
    "specialty": "Canals & Bicycles",
    "color": "#F59E0B",
    "row": "trending"
  },
  {
    "id": "rome",
    "name": "Rome",
    "subtitle": "Colosseum & History",
    "country": "Italy",
    "temp": "22\u00b0C",
    "image": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "All Ages",
    "vibe": "Eternal City Wonders",
    "bestTime": "Apr \u2013 Oct",
    "startingBudget": "From \u20b952,000",
    "attractions": 40,
    "hotels": 70,
    "foodSpots": 60,
    "itineraryIdeas": 18,
    "description": "Ancient Colosseum ruins, Roman Forum, Trevi Fountain gelato walks, and Vatican art.",
    "weather": "Summers",
    "company": "Family",
    "mood": "Relax",
    "budget": "Luxury",
    "type": "Road Trips",
    "minDays": 5,
    "specialty": "Colosseum & Gelato",
    "color": "#D97706",
    "row": "trending"
  },
  {
    "id": "singapore",
    "name": "Singapore",
    "subtitle": "Garden Metropolis",
    "country": "Singapore",
    "temp": "30\u00b0C",
    "image": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "All Ages",
    "vibe": "Futuristic Gardens",
    "bestTime": "Year round",
    "startingBudget": "From \u20b935,000",
    "attractions": 35,
    "hotels": 65,
    "foodSpots": 50,
    "itineraryIdeas": 15,
    "description": "Gardens by the Bay supertrees, Marina Bay Sands pool, Sentosa Island, hawker centers.",
    "weather": "Summers",
    "company": "Family",
    "mood": "Party",
    "budget": "Luxury",
    "type": "Road Trips",
    "minDays": 4,
    "specialty": "Supertrees & Hawker",
    "color": "#10B981",
    "row": "trending"
  },
  {
    "id": "barcelona",
    "name": "Barcelona",
    "subtitle": "Gaudi & Beaches",
    "country": "Spain",
    "temp": "23\u00b0C",
    "image": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&auto=format&fit=crop&q=80",
    "rating": 4.7,
    "ageGroup": "18 \u2013 45 Yrs",
    "vibe": "Gothic Architecture",
    "bestTime": "May \u2013 Oct",
    "startingBudget": "From \u20b946,000",
    "attractions": 32,
    "hotels": 58,
    "foodSpots": 48,
    "itineraryIdeas": 16,
    "description": "Sagrada Familia cathedral, Park Guell mosaics, tapas bars, and Mediterranean beach vibes.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Party",
    "budget": "Economy",
    "type": "Beach",
    "minDays": 5,
    "specialty": "Sagrada Familia",
    "color": "#EF4444",
    "row": "trending"
  },
  {
    "id": "darjeeling",
    "name": "Darjeeling",
    "subtitle": "Tea & Himalayas",
    "country": "India",
    "temp": "15\u00b0C",
    "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
    "rating": 4.6,
    "ageGroup": "All Ages",
    "vibe": "Misty Tea Slopes",
    "bestTime": "Oct \u2013 May",
    "startingBudget": "From \u20b98,000",
    "attractions": 18,
    "hotels": 30,
    "foodSpots": 22,
    "itineraryIdeas": 9,
    "description": "Kanchenjunga sunrise views, heritage toy train, tea garden strolls, and Tibetan monasteries.",
    "weather": "Winters",
    "company": "Family",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 4,
    "specialty": "Kanchenjunga Sunrise",
    "color": "#16A34A",
    "row": "trending"
  },
  {
    "id": "munnar",
    "name": "Munnar",
    "subtitle": "Lush Tea Valleys",
    "country": "India",
    "temp": "19\u00b0C",
    "image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "All Ages",
    "vibe": "Misty Emerald Slopes",
    "bestTime": "Sep \u2013 Mar",
    "startingBudget": "From \u20b97,500",
    "attractions": 16,
    "hotels": 28,
    "foodSpots": 20,
    "itineraryIdeas": 8,
    "description": "Rolling tea plantations, Anamudi peak views, misty waterfalls, and spice-scented air.",
    "weather": "Monsoon",
    "company": "Family",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 3,
    "specialty": "Tea Estates",
    "color": "#059669",
    "row": "trending"
  },
  {
    "id": "srinagar",
    "name": "Srinagar",
    "subtitle": "Shikaras & Valleys",
    "country": "India",
    "temp": "16\u00b0C",
    "image": "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=600&auto=format&fit=crop&q=80",
    "rating": 4.9,
    "ageGroup": "All Ages",
    "vibe": "Heaven on Earth",
    "bestTime": "Apr \u2013 Oct",
    "startingBudget": "From \u20b912,000",
    "attractions": 25,
    "hotels": 42,
    "foodSpots": 30,
    "itineraryIdeas": 14,
    "description": "Dal Lake shikara rides, houseboats, Mughal gardens in bloom, and snow-capped mountain backdrop.",
    "weather": "Winters",
    "company": "Family",
    "mood": "Relax",
    "budget": "Luxury",
    "type": "Mountains",
    "minDays": 5,
    "specialty": "Dal Lake Houseboats",
    "color": "#3B82F6",
    "row": "trending"
  },
  {
    "id": "pondicherry",
    "name": "Pondicherry",
    "subtitle": "French Riviera",
    "country": "India",
    "temp": "29\u00b0C",
    "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80",
    "rating": 4.5,
    "ageGroup": "18 \u2013 40 Yrs",
    "vibe": "French Colonial",
    "bestTime": "Oct \u2013 Mar",
    "startingBudget": "From \u20b96,500",
    "attractions": 14,
    "hotels": 32,
    "foodSpots": 26,
    "itineraryIdeas": 7,
    "description": "Yellow colonial French quarter streets, Promenade beach, Auroville spiritual dome, bakeries.",
    "weather": "Winters",
    "company": "Solo",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Beach",
    "minDays": 3,
    "specialty": "French Quarter & Auroville",
    "color": "#F59E0B",
    "row": "trending"
  },
  {
    "id": "kasol",
    "name": "Kasol",
    "subtitle": "Parvati Valley",
    "country": "India",
    "temp": "13\u00b0C",
    "image": "https://images.unsplash.com/photo-1617122245350-a92c10b42f2b?w=600&auto=format&fit=crop&q=80",
    "rating": 4.6,
    "ageGroup": "18 \u2013 35 Yrs",
    "vibe": "Hippy Mountain Vibe",
    "bestTime": "Apr \u2013 Nov",
    "startingBudget": "From \u20b95,000",
    "attractions": 12,
    "hotels": 25,
    "foodSpots": 20,
    "itineraryIdeas": 8,
    "description": "Pine-forested Parvati river valley, Kheerganga trekking, Israeli cafes, and starry nights.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 4,
    "specialty": "Trekking & River",
    "color": "#8B5CF6",
    "row": "trending"
  },
  {
    "id": "varkala",
    "name": "Varkala",
    "subtitle": "Cliffside Beaches",
    "country": "India",
    "temp": "28\u00b0C",
    "image": "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600&auto=format&fit=crop&q=80",
    "rating": 4.7,
    "ageGroup": "18 \u2013 40 Yrs",
    "vibe": "Red Cliffs & Ocean",
    "bestTime": "Oct \u2013 Mar",
    "startingBudget": "From \u20b97,000",
    "attractions": 12,
    "hotels": 28,
    "foodSpots": 24,
    "itineraryIdeas": 6,
    "description": "Dramatic red cliffs overlooking Arabian ocean, sunset juice bars, surfing, yoga retreats.",
    "weather": "Monsoon",
    "company": "Solo",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Beach",
    "minDays": 3,
    "specialty": "Red Cliffs & Surfing",
    "color": "#06B6D4",
    "row": "trending"
  },
  {
    "id": "spiti",
    "name": "Spiti Valley",
    "subtitle": "Barren High Lands",
    "country": "India",
    "temp": "6\u00b0C",
    "image": "https://images.unsplash.com/photo-1596707328906-8d197df32a89?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "18 \u2013 45 Yrs",
    "vibe": "Monasteries & Cold Desert",
    "bestTime": "Jun \u2013 Sep",
    "startingBudget": "From \u20b914,000",
    "attractions": 20,
    "hotels": 18,
    "foodSpots": 12,
    "itineraryIdeas": 10,
    "description": "Key Monastery perched high, Chandratal lake, world's highest post office, starry skies.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 6,
    "specialty": "Chandratal & Key Monastery",
    "color": "#6366F1",
    "row": "trending"
  },
  {
    "id": "jaisalmer",
    "name": "Jaisalmer",
    "subtitle": "Golden Desert Fort",
    "country": "India",
    "temp": "27\u00b0C",
    "image": "https://images.unsplash.com/photo-1576487194920-5c62fa36bc88?w=600&auto=format&fit=crop&q=80",
    "rating": 4.7,
    "ageGroup": "All Ages",
    "vibe": "Thar Dunes & Forts",
    "bestTime": "Oct \u2013 Mar",
    "startingBudget": "From \u20b99,000",
    "attractions": 18,
    "hotels": 30,
    "foodSpots": 22,
    "itineraryIdeas": 9,
    "description": "Living fort carved in yellow sandstone, Sam sand dune camel safaris, desert camping.",
    "weather": "Winters",
    "company": "Family",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 4,
    "specialty": "Desert Camping & Fort",
    "color": "#D97706",
    "row": "trending"
  },
  {
    "id": "nainital",
    "name": "Nainital",
    "subtitle": "Lake City",
    "country": "India",
    "temp": "15\u00b0C",
    "image": "https://images.unsplash.com/photo-1589553468543-a98fa69143a0?w=600&auto=format&fit=crop&q=80",
    "rating": 4.4,
    "ageGroup": "All Ages",
    "vibe": "Boating & Hills",
    "bestTime": "Mar \u2013 Jun",
    "startingBudget": "From \u20b96,000",
    "attractions": 14,
    "hotels": 35,
    "foodSpots": 20,
    "itineraryIdeas": 7,
    "description": "Eye-shaped Naini lake boating, ropeway views, Mall road shopping, and Naina peak treks.",
    "weather": "Summers",
    "company": "Family",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 3,
    "specialty": "Lake Boating",
    "color": "#0284C7",
    "row": "trending"
  },
  {
    "id": "wayanad",
    "name": "Wayanad",
    "subtitle": "Caves & Forests",
    "country": "India",
    "temp": "23\u00b0C",
    "image": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&auto=format&fit=crop&q=80",
    "rating": 4.6,
    "ageGroup": "All Ages",
    "vibe": "Wild Greenery",
    "bestTime": "Oct \u2013 May",
    "startingBudget": "From \u20b98,000",
    "attractions": 16,
    "hotels": 26,
    "foodSpots": 18,
    "itineraryIdeas": 8,
    "description": "Edakkal cave petroglyphs, Banasura Sagar dam, spice plantations, and treehouses.",
    "weather": "Monsoon",
    "company": "Family",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 3,
    "specialty": "Treehouses & Caves",
    "color": "#15803D",
    "row": "trending"
  },
  {
    "id": "mahabaleshwar",
    "name": "Mahabaleshwar",
    "subtitle": "Strawberry Hills",
    "country": "India",
    "temp": "20\u00b0C",
    "image": "https://images.unsplash.com/photo-1627894083067-72b843260388?w=600&auto=format&fit=crop&q=80",
    "rating": 4.5,
    "ageGroup": "All Ages",
    "vibe": "Valleys & Farms",
    "bestTime": "Oct \u2013 Jun",
    "startingBudget": "From \u20b95,500",
    "attractions": 15,
    "hotels": 30,
    "foodSpots": 22,
    "itineraryIdeas": 7,
    "description": "Fresh strawberry farms, Arthur's seat viewpoint, Venna lake boating, and mist.",
    "weather": "Monsoon",
    "company": "Family",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 3,
    "specialty": "Strawberry Farms",
    "color": "#EC4899",
    "row": "trending"
  },
  {
    "id": "gokarna",
    "name": "Gokarna",
    "subtitle": "Om Beach & Peace",
    "country": "India",
    "temp": "29\u00b0C",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    "rating": 4.6,
    "ageGroup": "18 \u2013 35 Yrs",
    "vibe": "Uncrowded Beaches",
    "bestTime": "Oct \u2013 Mar",
    "startingBudget": "From \u20b95,500",
    "attractions": 11,
    "hotels": 22,
    "foodSpots": 18,
    "itineraryIdeas": 6,
    "description": "Serene Om beach trek, Kudle beach sunsets, temple town spirituality, seaside shacks.",
    "weather": "Winters",
    "company": "Solo",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Beach",
    "minDays": 3,
    "specialty": "Om Beach Trek",
    "color": "#0EA5E9",
    "row": "trending"
  },
  {
    "id": "coonoor",
    "name": "Coonoor",
    "subtitle": "Heritage Tea Hills",
    "country": "India",
    "temp": "18\u00b0C",
    "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    "rating": 4.5,
    "ageGroup": "All Ages",
    "vibe": "Colonial Tea Estate",
    "bestTime": "Oct \u2013 Mar",
    "startingBudget": "From \u20b96,000",
    "attractions": 10,
    "hotels": 20,
    "foodSpots": 14,
    "itineraryIdeas": 5,
    "description": "Sim's Park botanical beauty, Dolphin's nose vantage point, toy train ride through tea.",
    "weather": "Monsoon",
    "company": "Family",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 3,
    "specialty": "Sim's Park & Tea",
    "color": "#16A34A",
    "row": "trending"
  },
  {
    "id": "mussoorie",
    "name": "Mussoorie",
    "subtitle": "Queen of Hills",
    "country": "India",
    "temp": "16\u00b0C",
    "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    "rating": 4.5,
    "ageGroup": "All Ages",
    "vibe": "Colonial Hill Vista",
    "bestTime": "Apr \u2013 Jun",
    "startingBudget": "From \u20b97,000",
    "attractions": 14,
    "hotels": 32,
    "foodSpots": 24,
    "itineraryIdeas": 7,
    "description": "Kempty Falls dip, Gun Hill cable car, Camel's back road walks, and Doon valley views.",
    "weather": "Summers",
    "company": "Family",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 3,
    "specialty": "Gun Hill & Kempty",
    "color": "#7C3AED",
    "row": "trending"
  },
  {
    "id": "alleppey",
    "name": "Alleppey",
    "subtitle": "Houseboat Haven",
    "country": "India",
    "temp": "28\u00b0C",
    "image": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "All Ages",
    "vibe": "Venice of the East",
    "bestTime": "Sep \u2013 Mar",
    "startingBudget": "From \u20b910,000",
    "attractions": 15,
    "hotels": 30,
    "foodSpots": 20,
    "itineraryIdeas": 8,
    "description": "Overnight luxury houseboat cruises, paddy fields, village canal kayaking, seafood feast.",
    "weather": "Monsoon",
    "company": "Family",
    "mood": "Relax",
    "budget": "Luxury",
    "type": "Road Trips",
    "minDays": 3,
    "specialty": "Houseboats & Canals",
    "color": "#10B981",
    "row": "trending"
  },
  {
    "id": "alleppey_beach",
    "name": "Kovalam",
    "subtitle": "Lighthouse Beach",
    "country": "India",
    "temp": "30\u00b0C",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    "rating": 4.6,
    "ageGroup": "All Ages",
    "vibe": "Crescent Beaches",
    "bestTime": "Sep \u2013 Mar",
    "startingBudget": "From \u20b98,000",
    "attractions": 12,
    "hotels": 28,
    "foodSpots": 22,
    "itineraryIdeas": 6,
    "description": "Striped lighthouse hilltop view, crescent golden sands, Ayurvedic massages, surfing.",
    "weather": "Summers",
    "company": "Family",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Beach",
    "minDays": 3,
    "specialty": "Lighthouse & Massage",
    "color": "#F59E0B",
    "row": "trending"
  },
  {
    "id": "hampi",
    "name": "Hampi",
    "subtitle": "Boulder Ruins",
    "country": "India",
    "temp": "29\u00b0C",
    "image": "https://images.unsplash.com/photo-1600100397608-f010e423b971?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "18 \u2013 45 Yrs",
    "vibe": "Vijayanagara Empire",
    "bestTime": "Oct \u2013 Feb",
    "startingBudget": "From \u20b96,000",
    "attractions": 25,
    "hotels": 24,
    "foodSpots": 20,
    "itineraryIdeas": 10,
    "description": "UNESCO boulder-strewn landscape, ancient Stone Chariot, Virupaksha temple, coracle boat.",
    "weather": "Winters",
    "company": "Solo",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 4,
    "specialty": "Ruins & Coracle",
    "color": "#D97706",
    "row": "trending"
  },
  {
    "id": "khajjiar",
    "name": "Khajjiar",
    "subtitle": "Mini Switzerland",
    "country": "India",
    "temp": "14\u00b0C",
    "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    "rating": 4.5,
    "ageGroup": "All Ages",
    "vibe": "Cedar Meadows",
    "bestTime": "Mar \u2013 Jun",
    "startingBudget": "From \u20b97,500",
    "attractions": 10,
    "hotels": 18,
    "foodSpots": 14,
    "itineraryIdeas": 5,
    "description": "Grassy plateau surrounded by dense deodar forests, lake zorbing, horse riding.",
    "weather": "Summers",
    "company": "Family",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 3,
    "specialty": "Meadows & Deodar",
    "color": "#15803D",
    "row": "trending"
  },
  {
    "id": "lonavala",
    "name": "Lonavala",
    "subtitle": "Chikki & Forts",
    "country": "India",
    "temp": "22\u00b0C",
    "image": "https://images.unsplash.com/photo-1627894083067-72b843260388?w=600&auto=format&fit=crop&q=80",
    "rating": 4.3,
    "ageGroup": "All Ages",
    "vibe": "Monsoon Waterfalls",
    "bestTime": "Jul \u2013 Sep",
    "startingBudget": "From \u20b94,500",
    "attractions": 14,
    "hotels": 30,
    "foodSpots": 25,
    "itineraryIdeas": 6,
    "description": "Tiger's Leap cliff edge, Karla caves, chikki tasting, and gushing monsoon waterfalls.",
    "weather": "Monsoon",
    "company": "Friends",
    "mood": "Road Trips",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 2,
    "specialty": "Tiger Point & Chikki",
    "color": "#84CC16",
    "row": "trending"
  },
  {
    "id": "pachmarhi",
    "name": "Pachmarhi",
    "subtitle": "Satpura Queen",
    "country": "India",
    "temp": "21\u00b0C",
    "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    "rating": 4.4,
    "ageGroup": "All Ages",
    "vibe": "Caves & Waterfalls",
    "bestTime": "Oct \u2013 Jun",
    "startingBudget": "From \u20b96,500",
    "attractions": 14,
    "hotels": 22,
    "foodSpots": 16,
    "itineraryIdeas": 6,
    "description": "Bee Falls, Pandav caves, Dhoopgarh sunset peak, Satpura tiger reserve jungle safaris.",
    "weather": "Winters",
    "company": "Family",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 3,
    "specialty": "Bee Falls & Safaris",
    "color": "#059669",
    "row": "trending"
  },
  {
    "id": "udaipur",
    "name": "Udaipur",
    "subtitle": "City of Lakes",
    "country": "India",
    "temp": "28\u00b0C",
    "image": "/images/dest-jaipur.png",
    "rating": 4.7,
    "ageGroup": "All Ages",
    "vibe": "Regal Lakeside Romance",
    "bestTime": "Oct \u2013 Mar",
    "startingBudget": "From \u20b99,000",
    "attractions": 20,
    "hotels": 42,
    "foodSpots": 28,
    "itineraryIdeas": 10,
    "description": "Magnificent lakeside palaces, rooftop dining, vibrant bazaars, and Aravalli Hills.",
    "weather": "Winters",
    "company": "Family",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 3,
    "specialty": "Lake Palaces",
    "color": "#E11D48",
    "row": "hidden"
  },
  {
    "id": "shimla",
    "name": "Shimla",
    "subtitle": "Colonial Hill Town",
    "country": "India",
    "temp": "12\u00b0C",
    "image": "/images/dest-manali.png",
    "rating": 4.4,
    "ageGroup": "All Ages",
    "vibe": "Heritage & Hill Station",
    "bestTime": "Mar \u2013 Jun",
    "startingBudget": "From \u20b97,500",
    "attractions": 16,
    "hotels": 32,
    "foodSpots": 20,
    "itineraryIdeas": 8,
    "description": "British-era colonial charm, toy-train rides, Christ Church, and snow-dusted Mall Road.",
    "weather": "Winters",
    "company": "Family",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 3,
    "specialty": "Toy Train & Mall Road",
    "color": "#84CC16",
    "row": "hidden"
  },
  {
    "id": "coorg",
    "name": "Coorg",
    "subtitle": "Coffee Highlands",
    "country": "India",
    "temp": "22\u00b0C",
    "image": "/images/dest-kerala.png",
    "rating": 4.6,
    "ageGroup": "All Ages",
    "vibe": "Misty Coffee Farms",
    "bestTime": "Oct \u2013 Mar",
    "startingBudget": "From \u20b96,800",
    "attractions": 14,
    "hotels": 28,
    "foodSpots": 16,
    "itineraryIdeas": 7,
    "description": "Misty coffee plantations, cascading Abbey Falls, spice walks, homestay charm.",
    "weather": "Monsoon",
    "company": "Family",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 3,
    "specialty": "Coffee Plantations",
    "color": "#78716C",
    "row": "hidden"
  },
  {
    "id": "dubai",
    "name": "Dubai",
    "subtitle": "Luxury Metropolis",
    "country": "UAE",
    "temp": "35\u00b0C",
    "image": "/images/dest-santorini.png",
    "rating": 4.7,
    "ageGroup": "18 \u2013 50 Yrs",
    "vibe": "Futuristic Luxury",
    "bestTime": "Nov \u2013 Mar",
    "startingBudget": "From \u20b940,000",
    "attractions": 38,
    "hotels": 70,
    "foodSpots": 50,
    "itineraryIdeas": 14,
    "description": "Futuristic skyline with Burj Khalifa, gold souks, desert safaris, indoor ski slopes.",
    "weather": "Winters",
    "company": "Friends",
    "mood": "Party",
    "budget": "Luxury",
    "type": "Road Trips",
    "minDays": 5,
    "specialty": "Burj Khalifa & Safari",
    "color": "#D97706",
    "row": "hidden"
  },
  {
    "id": "thailand",
    "name": "Thailand",
    "subtitle": "Tropical Wonders",
    "country": "Thailand",
    "temp": "32\u00b0C",
    "image": "/images/dest-bali.png",
    "rating": 4.7,
    "ageGroup": "18 \u2013 45 Yrs",
    "vibe": "Temples & Nightlife",
    "bestTime": "Nov \u2013 Feb",
    "startingBudget": "From \u20b922,000",
    "attractions": 40,
    "hotels": 75,
    "foodSpots": 60,
    "itineraryIdeas": 16,
    "description": "Ornate temple spires, Phi Phi island turquoise bays, floating markets, street food.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Party",
    "budget": "Economy",
    "type": "Beach",
    "minDays": 6,
    "specialty": "Street Food & Temples",
    "color": "#EF4444",
    "row": "hidden"
  },
  {
    "id": "vietnam",
    "name": "Vietnam",
    "subtitle": "Heritage Trail",
    "country": "Vietnam",
    "temp": "28\u00b0C",
    "image": "/images/dest-goa.png",
    "rating": 4.6,
    "ageGroup": "18 \u2013 50 Yrs",
    "vibe": "Limestone Bays",
    "bestTime": "Feb \u2013 May",
    "startingBudget": "From \u20b920,000",
    "attractions": 35,
    "hotels": 55,
    "foodSpots": 45,
    "itineraryIdeas": 12,
    "description": "Ha Long Bay emerald waters, Hoi An lanterns, Hanoi streets, pho stalls, motorbike trips.",
    "weather": "Summers",
    "company": "Solo",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 7,
    "specialty": "Ha Long Bay & Pho",
    "color": "#22C55E",
    "row": "hidden"
  },
  {
    "id": "paris",
    "name": "Paris",
    "subtitle": "City of Lights",
    "country": "France",
    "temp": "18\u00b0C",
    "image": "/images/dest-santorini.png",
    "rating": 4.8,
    "ageGroup": "All Ages",
    "vibe": "Romance & Art",
    "bestTime": "Apr \u2013 Jun",
    "startingBudget": "From \u20b960,000",
    "attractions": 50,
    "hotels": 85,
    "foodSpots": 70,
    "itineraryIdeas": 22,
    "description": "Eiffel Tower, Louvre masterpieces, Seine cafes, Montmartre art studios, patisseries.",
    "weather": "Summers",
    "company": "Family",
    "mood": "Relax",
    "budget": "Luxury",
    "type": "Road Trips",
    "minDays": 5,
    "specialty": "Eiffel Tower & Louvre",
    "color": "#A855F7",
    "row": "hidden"
  },
  {
    "id": "iceland",
    "name": "Iceland",
    "subtitle": "Fire & Ice",
    "country": "Iceland",
    "temp": "5\u00b0C",
    "image": "/images/hero-mountains.png",
    "rating": 4.8,
    "ageGroup": "20 \u2013 55 Yrs",
    "vibe": "Northern Lights",
    "bestTime": "Jun \u2013 Aug",
    "startingBudget": "From \u20b975,000",
    "attractions": 25,
    "hotels": 35,
    "foodSpots": 20,
    "itineraryIdeas": 10,
    "description": "Geysers, glaciers, volcanic black beaches, northern lights, and Blue Lagoon.",
    "weather": "Summers",
    "company": "Solo",
    "mood": "Adventure",
    "budget": "Luxury",
    "type": "Mountains",
    "minDays": 7,
    "specialty": "Northern Lights",
    "color": "#0284C7",
    "row": "hidden"
  },
  {
    "id": "newzealand",
    "name": "New Zealand",
    "subtitle": "Middle Earth",
    "country": "New Zealand",
    "temp": "15\u00b0C",
    "image": "/images/hero-mountains.png",
    "rating": 4.9,
    "ageGroup": "18 \u2013 55 Yrs",
    "vibe": "Epic Landscapes",
    "bestTime": "Dec \u2013 Mar",
    "startingBudget": "From \u20b980,000",
    "attractions": 42,
    "hotels": 55,
    "foodSpots": 35,
    "itineraryIdeas": 18,
    "description": "Milford Sound fjords, Hobbiton film sets, bungee jumping birthplace, alpine lakes.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Adventure",
    "budget": "Luxury",
    "type": "Mountains",
    "minDays": 10,
    "specialty": "Fjords & Hobbiton",
    "color": "#059669",
    "row": "hidden"
  },
  {
    "id": "ziro",
    "name": "Ziro Valley",
    "subtitle": "Pine & Paddy",
    "country": "India",
    "temp": "16\u00b0C",
    "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "18 \u2013 40 Yrs",
    "vibe": "Apatani Tribe & Music",
    "bestTime": "Sep \u2013 Nov",
    "startingBudget": "From \u20b99,500",
    "attractions": 12,
    "hotels": 15,
    "foodSpots": 10,
    "itineraryIdeas": 6,
    "description": "UNESCO Apatani tribal culture, rolling rice paddies, annual outdoor music festival.",
    "weather": "Winters",
    "company": "Solo",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 4,
    "specialty": "Ziro Music Fest",
    "color": "#65A30D",
    "row": "hidden"
  },
  {
    "id": "tirthan",
    "name": "Tirthan Valley",
    "subtitle": "Trout & Valleys",
    "country": "India",
    "temp": "14\u00b0C",
    "image": "https://images.unsplash.com/photo-1617122245350-a92c10b42f2b?w=600&auto=format&fit=crop&q=80",
    "rating": 4.7,
    "ageGroup": "18 \u2013 40 Yrs",
    "vibe": "Unspoiled Himalayas",
    "bestTime": "Mar \u2013 Jun",
    "startingBudget": "From \u20b97,000",
    "attractions": 11,
    "hotels": 16,
    "foodSpots": 12,
    "itineraryIdeas": 5,
    "description": "Great Himalayan National Park gateway, trout fishing, riverside homestays, pine air.",
    "weather": "Summers",
    "company": "Solo",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 4,
    "specialty": "Trout Fishing & Treks",
    "color": "#16A34A",
    "row": "hidden"
  },
  {
    "id": "gurez",
    "name": "Gurez Valley",
    "subtitle": "Dard Tribe Border",
    "country": "India",
    "temp": "11\u00b0C",
    "image": "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=600&auto=format&fit=crop&q=80",
    "rating": 4.9,
    "ageGroup": "20 \u2013 45 Yrs",
    "vibe": "Untapped Offbeat",
    "bestTime": "Jun \u2013 Sep",
    "startingBudget": "From \u20b912,000",
    "attractions": 10,
    "hotels": 12,
    "foodSpots": 8,
    "itineraryIdeas": 5,
    "description": "Pyramid-shaped Habba Khatoon peak, Kishanganga river, log houses, ultimate peace.",
    "weather": "Summers",
    "company": "Solo",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 4,
    "specialty": "Offbeat Kashmir Valley",
    "color": "#0284C7",
    "row": "hidden"
  },
  {
    "id": "chopta",
    "name": "Chopta",
    "subtitle": "Mini Switzerland of UK",
    "country": "India",
    "temp": "12\u00b0C",
    "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "16 \u2013 40 Yrs",
    "vibe": "Tungnath & Chandrashila",
    "bestTime": "Apr \u2013 Nov",
    "startingBudget": "From \u20b96,500",
    "attractions": 10,
    "hotels": 15,
    "foodSpots": 10,
    "itineraryIdeas": 6,
    "description": "World's highest Shiva temple trek at Tungnath, 360-degree snow peak summit views.",
    "weather": "Winters",
    "company": "Friends",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 3,
    "specialty": "Tungnath Temple Trek",
    "color": "#7C3AED",
    "row": "hidden"
  },
  {
    "id": "varkala_gem",
    "name": "St Mary Island",
    "subtitle": "Basalt Formations",
    "country": "India",
    "temp": "29\u00b0C",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    "rating": 4.6,
    "ageGroup": "All Ages",
    "vibe": "Hexagonal Rocks",
    "bestTime": "Oct \u2013 Mar",
    "startingBudget": "From \u20b95,000",
    "attractions": 8,
    "hotels": 14,
    "foodSpots": 10,
    "itineraryIdeas": 4,
    "description": "Unique hexagonal basaltic rock geological formations in Karnataka ocean island.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Beach",
    "minDays": 2,
    "specialty": "Basalt Rocks",
    "color": "#06B6D4",
    "row": "hidden"
  },
  {
    "id": "dhanushkodi",
    "name": "Dhanushkodi",
    "subtitle": "Ghost Town Trail",
    "country": "India",
    "temp": "28\u00b0C",
    "image": "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600&auto=format&fit=crop&q=80",
    "rating": 4.7,
    "ageGroup": "All Ages",
    "vibe": "Ruins Where Oceans Meet",
    "bestTime": "Oct \u2013 Apr",
    "startingBudget": "From \u20b96,000",
    "attractions": 9,
    "hotels": 12,
    "foodSpots": 10,
    "itineraryIdeas": 4,
    "description": "Submerged city ruins, Ram Setu origin point, where Bay of Bengal meets Indian Ocean.",
    "weather": "Winters",
    "company": "Solo",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Beach",
    "minDays": 2,
    "specialty": "Ram Setu & Ocean Edge",
    "color": "#F59E0B",
    "row": "hidden"
  },
  {
    "id": "orcha",
    "name": "Orchha",
    "subtitle": "Palaces on Betwa",
    "country": "India",
    "temp": "26\u00b0C",
    "image": "https://images.unsplash.com/photo-1600100397608-f010e423b971?w=600&auto=format&fit=crop&q=80",
    "rating": 4.6,
    "ageGroup": "All Ages",
    "vibe": "Medieval Bundela Forts",
    "bestTime": "Oct \u2013 Mar",
    "startingBudget": "From \u20b95,500",
    "attractions": 14,
    "hotels": 18,
    "foodSpots": 15,
    "itineraryIdeas": 6,
    "description": "Jahangir Mahal grandeur, cenotaphs along Betwa river, tranquil heritage away from crowds.",
    "weather": "Winters",
    "company": "Family",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 3,
    "specialty": "Betwa Cenotaphs",
    "color": "#D97706",
    "row": "hidden"
  },
  {
    "id": "majuli",
    "name": "Majuli",
    "subtitle": "River Island",
    "country": "India",
    "temp": "24\u00b0C",
    "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
    "rating": 4.7,
    "ageGroup": "All Ages",
    "vibe": "World's Largest River Isle",
    "bestTime": "Oct \u2013 Mar",
    "startingBudget": "From \u20b97,000",
    "attractions": 12,
    "hotels": 14,
    "foodSpots": 10,
    "itineraryIdeas": 5,
    "description": "Assam's Brahmaputra river island, Neo-Vaishnavite Satras, pottery, mask making.",
    "weather": "Winters",
    "company": "Solo",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 3,
    "specialty": "Satras & Mask Making",
    "color": "#16A34A",
    "row": "hidden"
  },
  {
    "id": "chitrakote",
    "name": "Chitrakote",
    "subtitle": "Niagara of India",
    "country": "India",
    "temp": "25\u00b0C",
    "image": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&auto=format&fit=crop&q=80",
    "rating": 4.6,
    "ageGroup": "All Ages",
    "vibe": "Horseshoe Waterfall",
    "bestTime": "Jul \u2013 Oct",
    "startingBudget": "From \u20b96,000",
    "attractions": 8,
    "hotels": 12,
    "foodSpots": 10,
    "itineraryIdeas": 4,
    "description": "Widest waterfall in India on Indravati river, glowing sunsets, boat rides to spray.",
    "weather": "Monsoon",
    "company": "Family",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 2,
    "specialty": "Wide Falls Spray",
    "color": "#0284C7",
    "row": "hidden"
  },
  {
    "id": "bundhi",
    "name": "Bundi",
    "subtitle": "Blue Stepwells",
    "country": "India",
    "temp": "27\u00b0C",
    "image": "https://images.unsplash.com/photo-1576487194920-5c62fa36bc88?w=600&auto=format&fit=crop&q=80",
    "rating": 4.5,
    "ageGroup": "All Ages",
    "vibe": "Stepwells & Murals",
    "bestTime": "Oct \u2013 Mar",
    "startingBudget": "From \u20b95,000",
    "attractions": 15,
    "hotels": 16,
    "foodSpots": 14,
    "itineraryIdeas": 5,
    "description": "Taragarh fort, ornate stepwells (baoris), blue painted houses, miniature paintings.",
    "weather": "Winters",
    "company": "Solo",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 2,
    "specialty": "Stepwells & Murals",
    "color": "#EC4899",
    "row": "hidden"
  },
  {
    "id": "tawang",
    "name": "Tawang",
    "subtitle": "Monastery in Clouds",
    "country": "India",
    "temp": "10\u00b0C",
    "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
    "rating": 4.9,
    "ageGroup": "18 \u2013 45 Yrs",
    "vibe": "India's Largest Monastery",
    "bestTime": "Sep \u2013 Apr",
    "startingBudget": "From \u20b914,000",
    "attractions": 18,
    "hotels": 20,
    "foodSpots": 12,
    "itineraryIdeas": 8,
    "description": "400-year-old Tawang monastery, Sela pass frozen lake, Madhuri lake, snow peaks.",
    "weather": "Winters",
    "company": "Friends",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 5,
    "specialty": "Sela Pass & Monastery",
    "color": "#8B5CF6",
    "row": "hidden"
  },
  {
    "id": "kumbhalgarh",
    "name": "Kumbhalgarh",
    "subtitle": "Great Wall of India",
    "country": "India",
    "temp": "24\u00b0C",
    "image": "https://images.unsplash.com/photo-1576487194920-5c62fa36bc88?w=600&auto=format&fit=crop&q=80",
    "rating": 4.7,
    "ageGroup": "All Ages",
    "vibe": "36km Fortified Wall",
    "bestTime": "Oct \u2013 Mar",
    "startingBudget": "From \u20b97,500",
    "attractions": 12,
    "hotels": 22,
    "foodSpots": 16,
    "itineraryIdeas": 5,
    "description": "Second longest continuous wall in the world, Badal Mahal, sound and light show.",
    "weather": "Winters",
    "company": "Family",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 2,
    "specialty": "Great Wall of India",
    "color": "#D97706",
    "row": "hidden"
  },
  {
    "id": "tarkarli",
    "name": "Tarkarli",
    "subtitle": "Clear Scuba Waters",
    "country": "India",
    "temp": "30\u00b0C",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    "rating": 4.6,
    "ageGroup": "16 \u2013 40 Yrs",
    "vibe": "Malvan Coral Scuba",
    "bestTime": "Oct \u2013 Mar",
    "startingBudget": "From \u20b97,000",
    "attractions": 10,
    "hotels": 20,
    "foodSpots": 18,
    "itineraryIdeas": 5,
    "description": "Pristine white sand, transparent waters, Sindhudurg sea fort, scuba diving.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Beach",
    "minDays": 3,
    "specialty": "Scuba & Sea Fort",
    "color": "#06B6D4",
    "row": "hidden"
  },
  {
    "id": "kalpa",
    "name": "Kalpa",
    "subtitle": "Apple Orchards",
    "country": "India",
    "temp": "9\u00b0C",
    "image": "https://images.unsplash.com/photo-1596707328906-8d197df32a89?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "All Ages",
    "vibe": "Kinnaur Kailash View",
    "bestTime": "Apr \u2013 Oct",
    "startingBudget": "From \u20b99,000",
    "attractions": 10,
    "hotels": 15,
    "foodSpots": 10,
    "itineraryIdeas": 5,
    "description": "Direct views of sacred Kinnaur Kailash peak, golden apple orchards, Suicide Point cliff.",
    "weather": "Summers",
    "company": "Solo",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 4,
    "specialty": "Kinnaur Kailash View",
    "color": "#16A34A",
    "row": "hidden"
  },
  {
    "id": "munsiari",
    "name": "Munsiyari",
    "subtitle": "Panchachuli Peaks",
    "country": "India",
    "temp": "11\u00b0C",
    "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "18 \u2013 45 Yrs",
    "vibe": "Gateway to Johar",
    "bestTime": "Mar \u2013 Nov",
    "startingBudget": "From \u20b98,500",
    "attractions": 12,
    "hotels": 14,
    "foodSpots": 10,
    "itineraryIdeas": 6,
    "description": "Closer views of 5 Panchachuli snow peaks, Johar valley treks, rare Himalayan herbs.",
    "weather": "Winters",
    "company": "Solo",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 4,
    "specialty": "Panchachuli Peaks",
    "color": "#3B82F6",
    "row": "hidden"
  },
  {
    "id": "pelling",
    "name": "Pelling",
    "subtitle": "Skywalk & Monasteries",
    "country": "India",
    "temp": "14\u00b0C",
    "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
    "rating": 4.7,
    "ageGroup": "All Ages",
    "vibe": "Sikkim Glass Skywalk",
    "bestTime": "Oct \u2013 May",
    "startingBudget": "From \u20b99,000",
    "attractions": 14,
    "hotels": 22,
    "foodSpots": 15,
    "itineraryIdeas": 6,
    "description": "India's first glass skywalk, Pemayangtse monastery, Rabdentse ruins, waterfall trails.",
    "weather": "Winters",
    "company": "Family",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 3,
    "specialty": "Glass Skywalk",
    "color": "#10B981",
    "row": "hidden"
  },
  {
    "id": "gokarna_trek",
    "name": "Gokarna Beach Trek",
    "subtitle": "Cliffside Trails",
    "country": "India",
    "temp": "28\u00b0C",
    "image": "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600&auto=format&fit=crop&q=80",
    "rating": 4.7,
    "ageGroup": "18 \u2013 35 Yrs",
    "vibe": "5-Beach Coast Trek",
    "bestTime": "Oct \u2013 Mar",
    "startingBudget": "From \u20b94,500",
    "attractions": 9,
    "hotels": 15,
    "foodSpots": 12,
    "itineraryIdeas": 4,
    "description": "Trek across Kudle, Om, Half Moon, and Paradise beaches over coastal rocks.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Beach",
    "minDays": 2,
    "specialty": "5-Beach Coast Trek",
    "color": "#0EA5E9",
    "row": "hidden"
  },
  {
    "id": "mandawa",
    "name": "Mandawa",
    "subtitle": "Open Air Art Gallery",
    "country": "India",
    "temp": "25\u00b0C",
    "image": "https://images.unsplash.com/photo-1576487194920-5c62fa36bc88?w=600&auto=format&fit=crop&q=80",
    "rating": 4.5,
    "ageGroup": "All Ages",
    "vibe": "Frescoed Havelis",
    "bestTime": "Oct \u2013 Mar",
    "startingBudget": "From \u20b96,500",
    "attractions": 14,
    "hotels": 18,
    "foodSpots": 14,
    "itineraryIdeas": 5,
    "description": "Ornately painted Shekhawati havelis, heritage stays, Rajasthani royal culture.",
    "weather": "Winters",
    "company": "Family",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 2,
    "specialty": "Fresco Havelis",
    "color": "#EC4899",
    "row": "hidden"
  },
  {
    "id": "champhai",
    "name": "Champhai",
    "subtitle": "Rice Bowl of Mizoram",
    "country": "India",
    "temp": "19\u00b0C",
    "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
    "rating": 4.6,
    "ageGroup": "18 \u2013 45 Yrs",
    "vibe": "Vineyards & Border",
    "bestTime": "Oct \u2013 Apr",
    "startingBudget": "From \u20b98,000",
    "attractions": 10,
    "hotels": 12,
    "foodSpots": 8,
    "itineraryIdeas": 4,
    "description": "Mizoram grape vineyards, Rih Dil heart-shaped lake, serene Indo-Myanmar border hills.",
    "weather": "Winters",
    "company": "Solo",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 3,
    "specialty": "Heart Shaped Lake",
    "color": "#15803D",
    "row": "hidden"
  },
  {
    "id": "lonar",
    "name": "Lonar Crater",
    "subtitle": "Meteorite Lake",
    "country": "India",
    "temp": "27\u00b0C",
    "image": "https://images.unsplash.com/photo-1627894083067-72b843260388?w=600&auto=format&fit=crop&q=80",
    "rating": 4.6,
    "ageGroup": "All Ages",
    "vibe": "50,000 Yr Meteor Impact",
    "bestTime": "Nov \u2013 Mar",
    "startingBudget": "From \u20b94,500",
    "attractions": 8,
    "hotels": 12,
    "foodSpots": 10,
    "itineraryIdeas": 3,
    "description": "World's only hyper-velocity impact crater lake in basaltic rock, ancient temples.",
    "weather": "Winters",
    "company": "Solo",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 2,
    "specialty": "Meteor Crater",
    "color": "#78716C",
    "row": "hidden"
  },
  {
    "id": "shoja",
    "name": "Shoja",
    "subtitle": "Wooden Village",
    "country": "India",
    "temp": "13\u00b0C",
    "image": "https://images.unsplash.com/photo-1617122245350-a92c10b42f2b?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "18 \u2013 40 Yrs",
    "vibe": "Jalori Pass & Lake",
    "bestTime": "Apr \u2013 Nov",
    "startingBudget": "From \u20b96,000",
    "attractions": 9,
    "hotels": 14,
    "foodSpots": 10,
    "itineraryIdeas": 4,
    "description": "Quiet Himachali wooden houses, Serolsar lake trek through oak forests, Jalori pass.",
    "weather": "Summers",
    "company": "Solo",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 3,
    "specialty": "Jalori Pass & Lake",
    "color": "#16A34A",
    "row": "hidden"
  },
  {
    "id": "daringbadi",
    "name": "Daringbadi",
    "subtitle": "Kashmir of Odisha",
    "country": "India",
    "temp": "18\u00b0C",
    "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    "rating": 4.4,
    "ageGroup": "All Ages",
    "vibe": "Pine Forests & Coffee",
    "bestTime": "Oct \u2013 Mar",
    "startingBudget": "From \u20b95,500",
    "attractions": 10,
    "hotels": 16,
    "foodSpots": 12,
    "itineraryIdeas": 4,
    "description": "Odisha's only snow-frost winter town, pine valleys, coffee garden, Midubanda falls.",
    "weather": "Winters",
    "company": "Family",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 3,
    "specialty": "Pine Valleys & Coffee",
    "color": "#059669",
    "row": "hidden"
  },
  {
    "id": "tranquebar",
    "name": "Tharangambadi",
    "subtitle": "Danish Fort Town",
    "country": "India",
    "temp": "29\u00b0C",
    "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80",
    "rating": 4.5,
    "ageGroup": "All Ages",
    "vibe": "Singing Waves & Fort",
    "bestTime": "Oct \u2013 Mar",
    "startingBudget": "From \u20b96,000",
    "attractions": 8,
    "hotels": 12,
    "foodSpots": 10,
    "itineraryIdeas": 3,
    "description": "17th-century Dansborg Danish fort right on beach edge, quiet Tamil Nadu coastline.",
    "weather": "Summers",
    "company": "Solo",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Beach",
    "minDays": 2,
    "specialty": "Danish Sea Fort",
    "color": "#D97706",
    "row": "hidden"
  },
  {
    "id": "lambasingi",
    "name": "Lambasingi",
    "subtitle": "Kashmir of Andhra",
    "country": "India",
    "temp": "15\u00b0C",
    "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    "rating": 4.4,
    "ageGroup": "All Ages",
    "vibe": "Zero Degree Frost",
    "bestTime": "Nov \u2013 Jan",
    "startingBudget": "From \u20b94,500",
    "attractions": 8,
    "hotels": 14,
    "foodSpots": 10,
    "itineraryIdeas": 3,
    "description": "Andhra Pradesh's coldest hill station, apple and pepper plantations, misty mornings.",
    "weather": "Winters",
    "company": "Friends",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 2,
    "specialty": "Frost Hills",
    "color": "#84CC16",
    "row": "hidden"
  },
  {
    "id": "gokarna_halfmoon",
    "name": "Half Moon Bay",
    "subtitle": "Hidden Cove",
    "country": "India",
    "temp": "28\u00b0C",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    "rating": 4.7,
    "ageGroup": "18 \u2013 35 Yrs",
    "vibe": "Secluded Beach",
    "bestTime": "Oct \u2013 Mar",
    "startingBudget": "From \u20b94,000",
    "attractions": 6,
    "hotels": 10,
    "foodSpots": 8,
    "itineraryIdeas": 3,
    "description": "Accessible only by boat or cliff hike, serene crescent sand, hammock relaxation.",
    "weather": "Summers",
    "company": "Solo",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Beach",
    "minDays": 2,
    "specialty": "Cliff Hike & Hammocks",
    "color": "#06B6D4",
    "row": "hidden"
  },
  {
    "id": "patnitop",
    "name": "Patnitop",
    "subtitle": "Meadows & Pines",
    "country": "India",
    "temp": "12\u00b0C",
    "image": "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=600&auto=format&fit=crop&q=80",
    "rating": 4.5,
    "ageGroup": "All Ages",
    "vibe": "Pine Meadows & Skyview",
    "bestTime": "Year round",
    "startingBudget": "From \u20b97,000",
    "attractions": 12,
    "hotels": 20,
    "foodSpots": 15,
    "itineraryIdeas": 4,
    "description": "Chenani ropeway ride, pine forest walks, winter paragliding, snow sledding.",
    "weather": "Winters",
    "company": "Family",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 3,
    "specialty": "Ropeway & Pines",
    "color": "#3B82F6",
    "row": "hidden"
  },
  {
    "id": "andaman",
    "name": "Andaman",
    "subtitle": "Coral Paradise",
    "country": "India",
    "temp": "28\u00b0C",
    "image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80",
    "rating": 4.7,
    "ageGroup": "All Ages",
    "vibe": "Pristine Coral Beaches",
    "bestTime": "Nov \u2013 May",
    "startingBudget": "From \u20b918,000",
    "attractions": 20,
    "hotels": 30,
    "foodSpots": 18,
    "itineraryIdeas": 9,
    "description": "Coral reefs, Radhanagar's turquoise waters, cellular jail history, scuba diving.",
    "weather": "Winters",
    "company": "Friends",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Beach",
    "minDays": 5,
    "specialty": "Scuba & Coral Reefs",
    "color": "#0891B2",
    "row": "trending"
  },
  {
    "id": "ooty",
    "name": "Ooty",
    "subtitle": "Queen of Hills",
    "country": "India",
    "temp": "16\u00b0C",
    "image": "https://images.unsplash.com/photo-1596707328906-8d197df32a89?w=600&auto=format&fit=crop&q=80",
    "rating": 4.4,
    "ageGroup": "All Ages",
    "vibe": "Tea Gardens & Misty Hills",
    "bestTime": "Oct \u2013 Jun",
    "startingBudget": "From \u20b95,000",
    "attractions": 12,
    "hotels": 25,
    "foodSpots": 14,
    "itineraryIdeas": 6,
    "description": "Nilgiri tea gardens, toy train rides, botanical gardens, and crisp mountain air.",
    "weather": "Monsoon",
    "company": "Family",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 3,
    "specialty": "Nilgiri Tea & Toy Train",
    "color": "#65A30D",
    "row": "hidden"
  },
  {
    "id": "meghalaya",
    "name": "Meghalaya",
    "subtitle": "Cloud Kingdom",
    "country": "India",
    "temp": "20\u00b0C",
    "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
    "rating": 4.7,
    "ageGroup": "18 \u2013 45 Yrs",
    "vibe": "Living Root Bridges",
    "bestTime": "Oct \u2013 May",
    "startingBudget": "From \u20b910,000",
    "attractions": 18,
    "hotels": 22,
    "foodSpots": 15,
    "itineraryIdeas": 8,
    "description": "Living root bridges of Cherrapunji, cleanest village, limestone caves.",
    "weather": "Monsoon",
    "company": "Friends",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 5,
    "specialty": "Living Root Bridges",
    "color": "#16A34A",
    "row": "hidden"
  },
  {
    "id": "srilanka",
    "name": "Sri Lanka",
    "subtitle": "Emerald Isle",
    "country": "Sri Lanka",
    "temp": "27\u00b0C",
    "image": "https://images.unsplash.com/photo-1546708973-b339540b5162?w=600&auto=format&fit=crop&q=80",
    "rating": 4.6,
    "ageGroup": "All Ages",
    "vibe": "Tea Trails & Temples",
    "bestTime": "Dec \u2013 Mar",
    "startingBudget": "From \u20b918,000",
    "attractions": 30,
    "hotels": 40,
    "foodSpots": 32,
    "itineraryIdeas": 12,
    "description": "Sigiriya rock fortress, Ella's nine-arch bridge, whale watching, spice feasts.",
    "weather": "Winters",
    "company": "Family",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Beach",
    "minDays": 6,
    "specialty": "Sigiriya & Ella",
    "color": "#D946EF",
    "row": "escapes"
  },
  {
    "id": "japan",
    "name": "Japan",
    "subtitle": "Cherry & Neon",
    "country": "Japan",
    "temp": "18\u00b0C",
    "image": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80",
    "rating": 4.9,
    "ageGroup": "All Ages",
    "vibe": "Tradition Meets Tech",
    "bestTime": "Mar \u2013 May",
    "startingBudget": "From \u20b955,000",
    "attractions": 55,
    "hotels": 90,
    "foodSpots": 80,
    "itineraryIdeas": 25,
    "description": "Cherry blossom gardens of Kyoto, Shibuya crossing, shrines, bullet trains, sushi.",
    "weather": "Summers",
    "company": "Solo",
    "mood": "Relax",
    "budget": "Luxury",
    "type": "Road Trips",
    "minDays": 8,
    "specialty": "Cherry Blossoms & Sushi",
    "color": "#F43F5E",
    "row": "escapes"
  },
  {
    "id": "morocco",
    "name": "Morocco",
    "subtitle": "Desert Mystique",
    "country": "Morocco",
    "temp": "22\u00b0C",
    "image": "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&auto=format&fit=crop&q=80",
    "rating": 4.5,
    "ageGroup": "18 \u2013 50 Yrs",
    "vibe": "Medinas & Sahara Dunes",
    "bestTime": "Mar \u2013 May",
    "startingBudget": "From \u20b930,000",
    "attractions": 22,
    "hotels": 38,
    "foodSpots": 28,
    "itineraryIdeas": 10,
    "description": "Marrakech medina maze, Sahara desert camps under stars, Chefchaouen blue streets.",
    "weather": "Winters",
    "company": "Solo",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 6,
    "specialty": "Sahara & Medinas",
    "color": "#CA8A04",
    "row": "escapes"
  },
  {
    "id": "phuket",
    "name": "Phuket",
    "subtitle": "Thai Paradise",
    "country": "Thailand",
    "temp": "31\u00b0C",
    "image": "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&auto=format&fit=crop&q=80",
    "rating": 4.6,
    "ageGroup": "18 \u2013 40 Yrs",
    "vibe": "Island Hopping & Parties",
    "bestTime": "Nov \u2013 Apr",
    "startingBudget": "From \u20b920,000",
    "attractions": 22,
    "hotels": 55,
    "foodSpots": 38,
    "itineraryIdeas": 10,
    "description": "Limestone karst islands, Patong Beach nightlife, Phi Phi snorkeling, pad thai.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Party",
    "budget": "Economy",
    "type": "Beach",
    "minDays": 5,
    "specialty": "Phi Phi Islands",
    "color": "#FB923C",
    "row": "escapes"
  },
  {
    "id": "leh",
    "name": "Leh",
    "subtitle": "Moonland Roads",
    "country": "India",
    "temp": "6\u00b0C",
    "image": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "18 \u2013 45 Yrs",
    "vibe": "Road Trips & Monasteries",
    "bestTime": "Jun \u2013 Sep",
    "startingBudget": "From \u20b914,000",
    "attractions": 24,
    "hotels": 28,
    "foodSpots": 15,
    "itineraryIdeas": 12,
    "description": "Legendary Khardung La pass, magnetic hill, Thiksey monastery, Nubra sand dunes.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 7,
    "specialty": "Khardung La & Nubra",
    "color": "#7C3AED",
    "row": "trending"
  },
  {
    "id": "mauritius",
    "name": "Mauritius",
    "subtitle": "Tropical Jewel",
    "country": "Mauritius",
    "temp": "26\u00b0C",
    "image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80",
    "rating": 4.7,
    "ageGroup": "20 \u2013 55 Yrs",
    "vibe": "Lagoons & Resorts",
    "bestTime": "May \u2013 Dec",
    "startingBudget": "From \u20b945,000",
    "attractions": 18,
    "hotels": 40,
    "foodSpots": 22,
    "itineraryIdeas": 9,
    "description": "Underwater waterfall illusion, Chamarel 7-colored earth, Le Morne, lagoons.",
    "weather": "Summers",
    "company": "Family",
    "mood": "Relax",
    "budget": "Luxury",
    "type": "Beach",
    "minDays": 6,
    "specialty": "Underwater Waterfall",
    "color": "#2DD4BF",
    "row": "escapes"
  },
  {
    "id": "london",
    "name": "London",
    "subtitle": "Big Ben & Royal",
    "country": "UK",
    "temp": "14\u00b0C",
    "image": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "All Ages",
    "vibe": "Historic Royal Metropolis",
    "bestTime": "May \u2013 Sep",
    "startingBudget": "From \u20b962,000",
    "attractions": 48,
    "hotels": 88,
    "foodSpots": 75,
    "itineraryIdeas": 20,
    "description": "Big Ben, Tower Bridge, West End musicals, British Museum, Hyde Park strolls.",
    "weather": "Summers",
    "company": "Family",
    "mood": "Relax",
    "budget": "Luxury",
    "type": "Road Trips",
    "minDays": 6,
    "specialty": "Big Ben & West End",
    "color": "#2563EB",
    "row": "escapes"
  },
  {
    "id": "newyork",
    "name": "New York",
    "subtitle": "Manhattan Skyline",
    "country": "USA",
    "temp": "19\u00b0C",
    "image": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&auto=format&fit=crop&q=80",
    "rating": 4.9,
    "ageGroup": "All Ages",
    "vibe": "The City That Never Sleeps",
    "bestTime": "Apr \u2013 Jun",
    "startingBudget": "From \u20b975,000",
    "attractions": 65,
    "hotels": 120,
    "foodSpots": 95,
    "itineraryIdeas": 24,
    "description": "Times Square neon lights, Central Park carriage, Broadway shows, Statue of Liberty.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Party",
    "budget": "Luxury",
    "type": "Road Trips",
    "minDays": 6,
    "specialty": "Times Square & Broadway",
    "color": "#7C3AED",
    "row": "escapes"
  },
  {
    "id": "sydney",
    "name": "Sydney",
    "subtitle": "Opera House & Harbor",
    "country": "Australia",
    "temp": "23\u00b0C",
    "image": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "All Ages",
    "vibe": "Harbor Views & Surfing",
    "bestTime": "Sep \u2013 Nov",
    "startingBudget": "From \u20b968,000",
    "attractions": 38,
    "hotels": 65,
    "foodSpots": 52,
    "itineraryIdeas": 16,
    "description": "Iconic Sydney Opera House sails, Harbor Bridge climb, Bondi Beach surfing.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Adventure",
    "budget": "Luxury",
    "type": "Beach",
    "minDays": 7,
    "specialty": "Opera House & Bondi",
    "color": "#0284C7",
    "row": "escapes"
  },
  {
    "id": "cairo",
    "name": "Cairo",
    "subtitle": "Pyramids & Nile",
    "country": "Egypt",
    "temp": "29\u00b0C",
    "image": "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=600&auto=format&fit=crop&q=80",
    "rating": 4.7,
    "ageGroup": "All Ages",
    "vibe": "Ancient Pharaoh Empire",
    "bestTime": "Oct \u2013 Apr",
    "startingBudget": "From \u20b935,000",
    "attractions": 30,
    "hotels": 48,
    "foodSpots": 35,
    "itineraryIdeas": 12,
    "description": "Great Pyramids of Giza, Sphinx, Nile felucca cruise, Khan el-Khalili bazaar.",
    "weather": "Winters",
    "company": "Family",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 5,
    "specialty": "Pyramids & Nile Cruise",
    "color": "#D97706",
    "row": "escapes"
  },
  {
    "id": "istanbul",
    "name": "Istanbul",
    "subtitle": "Bosphorus & Spices",
    "country": "Turkey",
    "temp": "20\u00b0C",
    "image": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "All Ages",
    "vibe": "Where East Meets West",
    "bestTime": "Apr \u2013 May",
    "startingBudget": "From \u20b938,000",
    "attractions": 42,
    "hotels": 62,
    "foodSpots": 50,
    "itineraryIdeas": 15,
    "description": "Hagia Sophia, Blue Mosque, Grand Bazaar spice shopping, Bosphorus sunset boat.",
    "weather": "Winters",
    "company": "Family",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 5,
    "specialty": "Hagia Sophia & Spices",
    "color": "#E11D48",
    "row": "escapes"
  },
  {
    "id": "cappadocia",
    "name": "Cappadocia",
    "subtitle": "Hot Air Balloons",
    "country": "Turkey",
    "temp": "18\u00b0C",
    "image": "https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?w=600&auto=format&fit=crop&q=80",
    "rating": 4.9,
    "ageGroup": "18 \u2013 50 Yrs",
    "vibe": "Fairy Chimney Caves",
    "bestTime": "Apr \u2013 Jun",
    "startingBudget": "From \u20b942,000",
    "attractions": 20,
    "hotels": 35,
    "foodSpots": 25,
    "itineraryIdeas": 8,
    "description": "Sunrise hot air balloon flight over fairy chimneys, cave hotel stays, underground cities.",
    "weather": "Summers",
    "company": "Solo",
    "mood": "Adventure",
    "budget": "Luxury",
    "type": "Road Trips",
    "minDays": 4,
    "specialty": "Hot Air Balloons & Caves",
    "color": "#F59E0B",
    "row": "escapes"
  },
  {
    "id": "prague",
    "name": "Prague",
    "subtitle": "Gothic Spires",
    "country": "Czech Republic",
    "temp": "16\u00b0C",
    "image": "https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&auto=format&fit=crop&q=80",
    "rating": 4.7,
    "ageGroup": "18 \u2013 45 Yrs",
    "vibe": "Fairytale Castle City",
    "bestTime": "May \u2013 Sep",
    "startingBudget": "From \u20b944,000",
    "attractions": 32,
    "hotels": 45,
    "foodSpots": 40,
    "itineraryIdeas": 12,
    "description": "Charles Bridge sunrise, Astronomical Clock, Prague Castle, Bohemian beer cellars.",
    "weather": "Summers",
    "company": "Solo",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 4,
    "specialty": "Charles Bridge & Castle",
    "color": "#9333EA",
    "row": "escapes"
  },
  {
    "id": "vienna",
    "name": "Vienna",
    "subtitle": "Palaces & Classical",
    "country": "Austria",
    "temp": "17\u00b0C",
    "image": "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "All Ages",
    "vibe": "Imperial Music Capital",
    "bestTime": "Apr \u2013 Oct",
    "startingBudget": "From \u20b952,000",
    "attractions": 35,
    "hotels": 50,
    "foodSpots": 42,
    "itineraryIdeas": 14,
    "description": "Sch\u00f6nbrunn Palace gardens, opera house concerts, Viennese coffee houses, Sachertorte.",
    "weather": "Summers",
    "company": "Family",
    "mood": "Relax",
    "budget": "Luxury",
    "type": "Road Trips",
    "minDays": 4,
    "specialty": "Sch\u00f6nbrunn & Opera",
    "color": "#0EA5E9",
    "row": "escapes"
  },
  {
    "id": "dubrovnik",
    "name": "Dubrovnik",
    "subtitle": "Pearl of Adriatic",
    "country": "Croatia",
    "temp": "24\u00b0C",
    "image": "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "18 \u2013 50 Yrs",
    "vibe": "Medieval Walled City",
    "bestTime": "May \u2013 Oct",
    "startingBudget": "From \u20b948,000",
    "attractions": 22,
    "hotels": 38,
    "foodSpots": 30,
    "itineraryIdeas": 9,
    "description": "Walking 16th-century stone city walls, Game of Thrones filming spots, Adriatic sea kayaking.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Adventure",
    "budget": "Luxury",
    "type": "Beach",
    "minDays": 4,
    "specialty": "Medieval Walls & Kayak",
    "color": "#0284C7",
    "row": "escapes"
  },
  {
    "id": "banff",
    "name": "Banff",
    "subtitle": "Rocky Mountain Lakes",
    "country": "Canada",
    "temp": "8\u00b0C",
    "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    "rating": 4.9,
    "ageGroup": "All Ages",
    "vibe": "Turquoise Alpine Water",
    "bestTime": "Jun \u2013 Aug",
    "startingBudget": "From \u20b972,000",
    "attractions": 28,
    "hotels": 35,
    "foodSpots": 24,
    "itineraryIdeas": 12,
    "description": "Lake Louise emerald waters, Moraine lake canoe, Rocky Mountain wildlife, hot springs.",
    "weather": "Summers",
    "company": "Family",
    "mood": "Adventure",
    "budget": "Luxury",
    "type": "Mountains",
    "minDays": 6,
    "specialty": "Lake Louise & Canoeing",
    "color": "#059669",
    "row": "escapes"
  },
  {
    "id": "queenstown",
    "name": "Queenstown",
    "subtitle": "Adventure Capital",
    "country": "New Zealand",
    "temp": "14\u00b0C",
    "image": "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600&auto=format&fit=crop&q=80",
    "rating": 4.9,
    "ageGroup": "18 \u2013 45 Yrs",
    "vibe": "Extreme Thrills",
    "bestTime": "Year round",
    "startingBudget": "From \u20b978,000",
    "attractions": 35,
    "hotels": 45,
    "foodSpots": 30,
    "itineraryIdeas": 14,
    "description": "Bungee jumping over Shotover canyon, Lake Wakatipu cruise, Remarkables ski fields.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Adventure",
    "budget": "Luxury",
    "type": "Mountains",
    "minDays": 7,
    "specialty": "Bungee & Canyon Jet",
    "color": "#16A34A",
    "row": "escapes"
  },
  {
    "id": "seoul",
    "name": "Seoul",
    "subtitle": "K-Pop & Palaces",
    "country": "South Korea",
    "temp": "18\u00b0C",
    "image": "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "All Ages",
    "vibe": "K-Culture Metropolis",
    "bestTime": "Mar \u2013 May",
    "startingBudget": "From \u20b942,000",
    "attractions": 45,
    "hotels": 70,
    "foodSpots": 65,
    "itineraryIdeas": 18,
    "description": "Gyeongbokgung Palace hanbok walk, Myeongdong street food, K-pop shopping, Namsan tower.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Party",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 5,
    "specialty": "Hanbok Walk & K-Food",
    "color": "#EC4899",
    "row": "trending"
  },
  {
    "id": "kathmandu",
    "name": "Kathmandu",
    "subtitle": "Himalayan Temples",
    "country": "Nepal",
    "temp": "19\u00b0C",
    "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
    "rating": 4.6,
    "ageGroup": "All Ages",
    "vibe": "Stupas & Treks",
    "bestTime": "Oct \u2013 Dec",
    "startingBudget": "From \u20b912,000",
    "attractions": 25,
    "hotels": 35,
    "foodSpots": 30,
    "itineraryIdeas": 10,
    "description": "Boudhanath Stupa eyes, Pashupatinath temple, Everest flight tour, Thamel backpacker hub.",
    "weather": "Winters",
    "company": "Solo",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 4,
    "specialty": "Stupas & Everest Flight",
    "color": "#F59E0B",
    "row": "escapes"
  },
  {
    "id": "pokhara",
    "name": "Pokhara",
    "subtitle": "Phewa Lake & Annapurna",
    "country": "Nepal",
    "temp": "20\u00b0C",
    "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "16 \u2013 45 Yrs",
    "vibe": "Paragliding Haven",
    "bestTime": "Sep \u2013 Nov",
    "startingBudget": "From \u20b914,000",
    "attractions": 20,
    "hotels": 30,
    "foodSpots": 24,
    "itineraryIdeas": 9,
    "description": "Phewa lake boating, Sarangkot sunrise paragliding, Annapurna base camp trek base.",
    "weather": "Summers",
    "company": "Solo",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 5,
    "specialty": "Paragliding & Lakes",
    "color": "#10B981",
    "row": "escapes"
  },
  {
    "id": "bhutan",
    "name": "Thimphu & Paro",
    "subtitle": "Tiger's Nest Monks",
    "country": "Bhutan",
    "temp": "15\u00b0C",
    "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
    "rating": 4.9,
    "ageGroup": "All Ages",
    "vibe": "Gross National Happiness",
    "bestTime": "Mar \u2013 May",
    "startingBudget": "From \u20b935,000",
    "attractions": 22,
    "hotels": 28,
    "foodSpots": 20,
    "itineraryIdeas": 10,
    "description": "Tiger's Nest cliffside monastery trek, prayer wheel Dzongs, carbon-negative air.",
    "weather": "Winters",
    "company": "Family",
    "mood": "Relax",
    "budget": "Luxury",
    "type": "Mountains",
    "minDays": 6,
    "specialty": "Tiger's Nest Cliff Trek",
    "color": "#E11D48",
    "row": "escapes"
  },
  {
    "id": "krabi",
    "name": "Krabi",
    "subtitle": "Railay Cliff Beaches",
    "country": "Thailand",
    "temp": "30\u00b0C",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    "rating": 4.7,
    "ageGroup": "18 \u2013 40 Yrs",
    "vibe": "Karst Rock Climbing",
    "bestTime": "Nov \u2013 Apr",
    "startingBudget": "From \u20b922,000",
    "attractions": 18,
    "hotels": 40,
    "foodSpots": 30,
    "itineraryIdeas": 8,
    "description": "Railay beach limestone rock climbing, Emerald Pool jungle dip, 4-island boat tour.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Beach",
    "minDays": 4,
    "specialty": "Railay Beach Climbing",
    "color": "#06B6D4",
    "row": "escapes"
  },
  {
    "id": "chiangmai",
    "name": "Chiang Mai",
    "subtitle": "Lanna Lanterns",
    "country": "Thailand",
    "temp": "26\u00b0C",
    "image": "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&auto=format&fit=crop&q=80",
    "rating": 4.7,
    "ageGroup": "All Ages",
    "vibe": "Misty Temple Mountains",
    "bestTime": "Nov \u2013 Feb",
    "startingBudget": "From \u20b920,000",
    "attractions": 30,
    "hotels": 45,
    "foodSpots": 40,
    "itineraryIdeas": 10,
    "description": "Doi Suthep mountain temple, ethical elephant sanctuary, Yi Peng floating sky lanterns.",
    "weather": "Winters",
    "company": "Solo",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Mountains",
    "minDays": 4,
    "specialty": "Elephant Sanctuary & Lanterns",
    "color": "#7C3AED",
    "row": "escapes"
  },
  {
    "id": "interlaken",
    "name": "Interlaken",
    "subtitle": "Paragliding Alps",
    "country": "Switzerland",
    "temp": "12\u00b0C",
    "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    "rating": 4.9,
    "ageGroup": "18 \u2013 50 Yrs",
    "vibe": "Twin Lake Alpine Base",
    "bestTime": "May \u2013 Sep",
    "startingBudget": "From \u20b970,000",
    "attractions": 25,
    "hotels": 40,
    "foodSpots": 28,
    "itineraryIdeas": 12,
    "description": "Tandem paragliding over Thun & Brienz lakes, Jungfraujoch Top of Europe train trip.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Adventure",
    "budget": "Luxury",
    "type": "Mountains",
    "minDays": 5,
    "specialty": "Jungfraujoch & Paragliding",
    "color": "#0284C7",
    "row": "escapes"
  },
  {
    "id": "lucerne",
    "name": "Lucerne",
    "subtitle": "Chapel Bridge",
    "country": "Switzerland",
    "temp": "13\u00b0C",
    "image": "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "All Ages",
    "vibe": "Wooden Covered Bridge",
    "bestTime": "May \u2013 Oct",
    "startingBudget": "From \u20b964,000",
    "attractions": 20,
    "hotels": 32,
    "foodSpots": 25,
    "itineraryIdeas": 8,
    "description": "14th-century wooden Chapel Bridge, Mt Pilatus steepest cogwheel railway, lake steamboats.",
    "weather": "Summers",
    "company": "Family",
    "mood": "Relax",
    "budget": "Luxury",
    "type": "Mountains",
    "minDays": 3,
    "specialty": "Chapel Bridge & Pilatus",
    "color": "#2563EB",
    "row": "escapes"
  },
  {
    "id": "nara",
    "name": "Nara",
    "subtitle": "Sacred Deer Park",
    "country": "Japan",
    "temp": "17\u00b0C",
    "image": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "All Ages",
    "vibe": "Bow-to-Deer Ancient Park",
    "bestTime": "Mar \u2013 May",
    "startingBudget": "From \u20b948,000",
    "attractions": 18,
    "hotels": 25,
    "foodSpots": 20,
    "itineraryIdeas": 6,
    "description": "Friendly free-roaming sacred deer, giant Todai-ji wooden Buddha, bronze lantern walks.",
    "weather": "Summers",
    "company": "Family",
    "mood": "Relax",
    "budget": "Luxury",
    "type": "Road Trips",
    "minDays": 2,
    "specialty": "Sacred Bowing Deer",
    "color": "#15803D",
    "row": "escapes"
  },
  {
    "id": "kyoto",
    "name": "Kyoto",
    "subtitle": "Golden Pavilion & Bamboo",
    "country": "Japan",
    "temp": "18\u00b0C",
    "image": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80",
    "rating": 4.9,
    "ageGroup": "All Ages",
    "vibe": "Geisha Shrines & Bamboo",
    "bestTime": "Mar \u2013 May",
    "startingBudget": "From \u20b955,000",
    "attractions": 40,
    "hotels": 60,
    "foodSpots": 50,
    "itineraryIdeas": 16,
    "description": "Fushimi Inari 10,000 vermilion Torii gates, Arashiyama bamboo grove, traditional tea ceremonies.",
    "weather": "Summers",
    "company": "Solo",
    "mood": "Relax",
    "budget": "Luxury",
    "type": "Road Trips",
    "minDays": 5,
    "specialty": "Torii Gates & Bamboo",
    "color": "#D97706",
    "row": "escapes"
  },
  {
    "id": "hanoi",
    "name": "Hanoi",
    "subtitle": "Old Quarter Coffee",
    "country": "Vietnam",
    "temp": "25\u00b0C",
    "image": "https://images.unsplash.com/photo-1509030450996-93f2e3d87058?w=600&auto=format&fit=crop&q=80",
    "rating": 4.7,
    "ageGroup": "18 \u2013 45 Yrs",
    "vibe": "Train Street & Egg Coffee",
    "bestTime": "Feb \u2013 Apr",
    "startingBudget": "From \u20b918,000",
    "attractions": 28,
    "hotels": 42,
    "foodSpots": 38,
    "itineraryIdeas": 10,
    "description": "Famous train passing inches from cafes, egg coffee tasting, Hoan Kiem lake mornings.",
    "weather": "Summers",
    "company": "Solo",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 3,
    "specialty": "Train Street & Egg Coffee",
    "color": "#E11D48",
    "row": "escapes"
  },
  {
    "id": "hoian",
    "name": "Hoi An",
    "subtitle": "Lantern City",
    "country": "Vietnam",
    "temp": "27\u00b0C",
    "image": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "All Ages",
    "vibe": "Night River Glow",
    "bestTime": "Feb \u2013 Jul",
    "startingBudget": "From \u20b920,000",
    "attractions": 22,
    "hotels": 35,
    "foodSpots": 30,
    "itineraryIdeas": 8,
    "description": "Thousands of glowing silk lanterns on Thu Bon river, Japanese covered bridge, tailor suits.",
    "weather": "Summers",
    "company": "Family",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Road Trips",
    "minDays": 3,
    "specialty": "Silk Lantern River",
    "color": "#F59E0B",
    "row": "escapes"
  },
  {
    "id": "boracay",
    "name": "Boracay",
    "subtitle": "Powder Sand Beach",
    "country": "Philippines",
    "temp": "30\u00b0C",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    "rating": 4.8,
    "ageGroup": "18 \u2013 40 Yrs",
    "vibe": "White Beach Sunset",
    "bestTime": "Nov \u2013 Apr",
    "startingBudget": "From \u20b928,000",
    "attractions": 15,
    "hotels": 38,
    "foodSpots": 28,
    "itineraryIdeas": 8,
    "description": "4km flour-soft White Beach, paraw sailing at golden hour, crystal kayaking, fire dancing.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Party",
    "budget": "Economy",
    "type": "Beach",
    "minDays": 4,
    "specialty": "Powder White Beach",
    "color": "#0EA5E9",
    "row": "escapes"
  },
  {
    "id": "el nido",
    "name": "El Nido",
    "subtitle": "Secret Lagoons",
    "country": "Philippines",
    "temp": "29\u00b0C",
    "image": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&auto=format&fit=crop&q=80",
    "rating": 4.9,
    "ageGroup": "18 \u2013 45 Yrs",
    "vibe": "Hidden Kayak Caves",
    "bestTime": "Nov \u2013 May",
    "startingBudget": "From \u20b932,000",
    "attractions": 20,
    "hotels": 32,
    "foodSpots": 22,
    "itineraryIdeas": 9,
    "description": "Kayaking into hidden limestone lagoons, Big Lagoon cliffs, Nacpan 4km coconut beach.",
    "weather": "Summers",
    "company": "Friends",
    "mood": "Adventure",
    "budget": "Economy",
    "type": "Beach",
    "minDays": 5,
    "specialty": "Secret Lagoons & Kayak",
    "color": "#14B8A6",
    "row": "escapes"
  },
  {
    "id": "langkawi",
    "name": "Langkawi",
    "subtitle": "Cable Car & Sky Bridge",
    "country": "Malaysia",
    "temp": "31\u00b0C",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    "rating": 4.6,
    "ageGroup": "All Ages",
    "vibe": "Duty Free Island",
    "bestTime": "Nov \u2013 Apr",
    "startingBudget": "From \u20b924,000",
    "attractions": 20,
    "hotels": 40,
    "foodSpots": 30,
    "itineraryIdeas": 8,
    "description": "Curved Sky Bridge above rainforest canopy, mangrove eagle feeding, Cenang beach.",
    "weather": "Summers",
    "company": "Family",
    "mood": "Relax",
    "budget": "Economy",
    "type": "Beach",
    "minDays": 4,
    "specialty": "Sky Bridge & Mangrove",
    "color": "#10B981",
    "row": "escapes"
  }
]

/* ─────────────────────────────────────────────
   FILTER CATEGORIES & OPTIONS
   ───────────────────────────────────────────── */
const filterCategories = [
  {
    key: "weather", label: "Weather", icon: "☀️",
    options: ["Summers", "Winters", "Monsoon"],
    color: "#F59E0B", bgTint: "rgba(245,158,11,0.06)"
  },
  {
    key: "company", label: "Company", icon: "👥",
    options: ["Friends", "Family", "Solo"],
    color: "#3B82F6", bgTint: "rgba(59,130,246,0.06)"
  },
  {
    key: "mood", label: "Mood", icon: "🎭",
    options: ["Party", "Relax", "Adventure"],
    color: "#A855F7", bgTint: "rgba(168,85,247,0.06)"
  },
  {
    key: "budget", label: "Budget", icon: "💰",
    options: ["Economy", "Luxury"],
    color: "#10B981", bgTint: "rgba(16,185,129,0.06)"
  },
  {
    key: "type", label: "Type", icon: "🏔️",
    options: ["Mountains", "Beach", "Road Trips"],
    color: "#14B8A6", bgTint: "rgba(20,184,166,0.06)"
  },
]

/* ─────────────────────────────────────────────
   PETAL INFO CONFIG: 6 petals around the card
   ───────────────────────────────────────────── */
const petalConfig = [
  { key: "minDays", label: "Min Days", icon: "🗓️", angle: -90, distance: 98 },
  { key: "mood", label: "Mood", icon: "🎭", angle: -30, distance: 104 },
  { key: "specialty", label: "Specialty", icon: "⭐", angle: 30, distance: 104 },
  { key: "weather", label: "Season", icon: "🌤️", angle: 90, distance: 98 },
  { key: "budget", label: "Budget", icon: "💰", angle: 150, distance: 104 },
  { key: "company", label: "Company", icon: "👥", angle: 210, distance: 104 },
]

/* ─────────────────────────────────────────────
   ROW DEFINITIONS
   ───────────────────────────────────────────── */
const rowConfig = [
  { key: "trending", label: "Trending Picks", icon: <TrendingUp className="h-4 w-4" /> },
  { key: "hidden", label: "Hidden Gems", icon: <Gem className="h-4 w-4" /> },
  { key: "escapes", label: "International Escapes", icon: <Plane className="h-4 w-4" /> },
]

/* ─────────────────────────────────────────────
   SCROLLABLE ROW COMPONENT
   ───────────────────────────────────────────── */
function DestinationRow({ destinations, label, icon, hoveredId, setHoveredId, onCardClick }) {
  const scrollRef = useRef(null)
  const handleScroll = (dir) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === "left" ? -350 : 350, behavior: "smooth" })
  }

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-foreground">
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            {icon}
          </span>
          {label}
          <span className="ml-2 text-xs font-normal text-muted-foreground">({destinations.length})</span>
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={() => handleScroll("left")} aria-label="Scroll left"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md transition-all hover:bg-emerald-500 hover:text-white hover:scale-105">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => handleScroll("right")} aria-label="Scroll right"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md transition-all hover:bg-emerald-500 hover:text-white hover:scale-105">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={scrollRef}
        className="flex items-start gap-10 overflow-x-auto overflow-y-visible pt-20 pb-16 px-24 explore-scrollbar-hide"
        style={{ scrollbarWidth: "none" }}>
        {destinations.map((item) => (
          <CircularCard
            key={item.id}
            item={item}
            isHovered={hoveredId === item.id}
            onHover={() => setHoveredId(item.id)}
            onLeave={() => setHoveredId(null)}
            onClick={(e) => onCardClick(item, e)}
          />
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   CIRCULAR CARD WITH PETAL POP-OUT
   ───────────────────────────────────────────── */
function CircularCard({ item, isHovered, onHover, onLeave, onClick }) {
  const getPetalValue = (key) => {
    if (key === "minDays") return `${item.minDays} Days`
    return item[key] || ""
  }

  return (
    <div
      className="relative flex flex-col items-center shrink-0 cursor-pointer group"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ zIndex: isHovered ? 30 : 1 }}
    >
      {/* Petal Bubbles — animate out smoothly on hover */}
      <AnimatePresence mode="wait">
        {isHovered && petalConfig.map((petal, i) => {
          const rad = (petal.angle * Math.PI) / 180
          const x = Math.cos(rad) * petal.distance
          const y = Math.sin(rad) * petal.distance
          return (
            <motion.div
              key={petal.key}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.2 }}
              animate={{ opacity: 1, x, y: y - 10, scale: 1 }}
              exit={{ opacity: 0, x: x * 0.4, y: (y - 10) * 0.4, scale: 0.2 }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 18,
                mass: 0.7,
                delay: i * 0.05,
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40"
            >
              <div
                className="flex flex-col items-center justify-center rounded-full border-2 bg-white/95 shadow-2xl min-w-[68px] min-h-[68px] px-2.5 py-2 backdrop-blur-xl"
                style={{
                  borderColor: item.color,
                  boxShadow: `0 8px 26px ${item.color}35, 0 2px 10px rgba(0,0,0,0.12)`,
                }}
              >
                <span className="text-base leading-none">{petal.icon}</span>
                <span className="text-[10px] font-black text-gray-900 mt-1 whitespace-nowrap max-w-[62px] truncate">
                  {getPetalValue(petal.key)}
                </span>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Larger Circular Image Card */}
      <motion.div
        animate={{ scale: isHovered ? 1.18 : 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="relative"
      >
        <div
          className="h-32 w-32 sm:h-36 sm:w-36 rounded-full p-[4px] transition-all duration-300"
          style={{
            background: isHovered
              ? `linear-gradient(135deg, ${item.color}, ${item.color}88, ${item.color}44)`
              : "var(--border)",
            boxShadow: isHovered ? `0 0 35px ${item.color}45, 0 0 70px ${item.color}20` : "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <div className="h-full w-full overflow-hidden rounded-full relative">
            <img src={item.image} alt={item.name}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>

        {/* Temperature badge */}
        <span className="absolute -top-1.5 -right-1.5 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-extrabold text-white shadow-lg border border-white/30"
          style={{ background: item.color }}>
          <CloudSun className="h-3 w-3" />
          {item.temp}
        </span>
      </motion.div>

      {/* Name & Subtitle */}
      <div className="mt-3 text-center relative z-10">
        <h4 className="font-heading text-sm sm:text-base font-extrabold transition-colors"
          style={{ color: isHovered ? item.color : "var(--foreground)" }}>
          {item.name}
        </h4>
        <p className="text-xs text-muted-foreground font-medium mt-0.5">{item.subtitle}</p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   DETAIL PANEL (CONTEXTUAL LEFT/RIGHT)
   ───────────────────────────────────────────── */
function DetailPanel({ destination, position, onClose, onExplore }) {
  const isRight = position === "right"

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={onClose} />

      {/* Panel */}
      <motion.div
        initial={{ x: isRight ? 450 : -450, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: isRight ? 450 : -450, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className={`relative z-10 w-full max-w-md mx-4 ${isRight ? "ml-auto mr-8" : "ml-8 mr-auto"}`}
      >
        <div className="rounded-3xl border border-border/80 bg-background/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* Image Banner */}
          <div className="relative h-48 overflow-hidden">
            <img src={destination.image} alt={destination.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            
            {/* Working Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onClose()
              }}
              aria-label="Close detail panel"
              className="absolute top-3 right-3 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black/90 hover:scale-110 active:scale-95 cursor-pointer border border-white/20 shadow-xl"
            >
              <X className="h-5 w-5 stroke-[2.5]" />
            </button>

            <div className="absolute bottom-3 left-4">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full mb-1"
                style={{ background: `${destination.color}30`, color: destination.color }}>
                {destination.country}
              </span>
              <h3 className="font-heading text-2xl font-bold text-foreground">{destination.name}</h3>
              <p className="text-sm text-muted-foreground">{destination.subtitle}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-xs text-muted-foreground leading-relaxed mb-5">{destination.description}</p>

            {/* Key Details Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {[
                { icon: <Users className="h-4 w-4" />, label: "Age Group", value: destination.ageGroup, color: "var(--primary)" },
                { icon: <HeartHandshake className="h-4 w-4" />, label: "Vibe", value: destination.vibe, color: destination.color },
                { icon: <Clock className="h-4 w-4" />, label: "Best Season", value: destination.bestTime, color: "#F59E0B" },
                { icon: <Coins className="h-4 w-4" />, label: "Budget", value: destination.startingBudget, color: "#10B981" },
              ].map((detail, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-3 text-center">
                  <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: `${detail.color}15`, color: detail.color }}>
                    {detail.icon}
                  </div>
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{detail.label}</span>
                  <span className="mt-0.5 block text-xs font-extrabold text-foreground truncate">{detail.value}</span>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-around rounded-xl bg-secondary/60 p-3 mb-5 text-center">
              {[
                { value: destination.attractions, label: "Attractions" },
                { value: destination.hotels, label: "Hotels" },
                { value: destination.foodSpots, label: "Food" },
                { value: destination.itineraryIdeas, label: "Itineraries" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="font-extrabold text-foreground text-sm">{stat.value}</span>
                  <span className="text-muted-foreground text-[10px] font-medium">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {[
                { label: destination.weather, emoji: "☀️" },
                { label: destination.mood, emoji: "🎭" },
                { label: destination.company, emoji: "👥" },
                { label: destination.budget, emoji: "💰" },
                { label: destination.type, emoji: "🏔️" },
                { label: `${destination.minDays} Days min`, emoji: "🗓️" },
              ].map((tag, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground bg-accent/40">
                  <span className="text-xs">{tag.emoji}</span> {tag.label}
                </span>
              ))}
            </div>

            {/* CTA */}
            <Button onClick={() => onExplore(destination.name)}
              className="w-full rounded-xl py-3 font-bold text-white shadow-xl transition hover:opacity-95"
              style={{ background: destination.color, boxShadow: `0 8px 24px ${destination.color}35` }}>
              Explore {destination.name}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   CUSTOMIZE WHEEL (BOTTOM-LEFT 90° FAN ARC)
   ───────────────────────────────────────────── */
function CustomizeWheel({ activeFilters, setActiveFilters }) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState(null)
  const autoCloseTimerRef = useRef(null)

  const toggleFilter = (key, value) => {
    setActiveFilters(prev => {
      const next = { ...prev }
      if (next[key] === value) {
        delete next[key]
      } else {
        next[key] = value
      }
      return next
    })
  }

  const handleCategoryClick = (catKey) => {
    setExpandedCategory(expandedCategory === catKey ? null : catKey)
  }

  const activeCount = Object.keys(activeFilters).length

  // Auto-close wheel 4s after interaction or filter select
  useEffect(() => {
    if (isOpen) {
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current)
      autoCloseTimerRef.current = setTimeout(() => {
        setIsOpen(false)
        setExpandedCategory(null)
      }, 4000)
    }
    return () => {
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current)
    }
  }, [isOpen, activeFilters, expandedCategory])

  // 90-degree quadrant arc from straight up (-88°) to straight right (0°) with increased distance to prevent overlap
  const fanAngles = [-88, -66, -44, -22, 0]

  return (
    <div className="fixed bottom-8 left-8 sm:bottom-10 sm:left-10 z-40">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Category fan petals blooming in 90° arc */}
            {filterCategories.map((cat, i) => {
              const angleDeg = fanAngles[i]
              const rad = (angleDeg * Math.PI) / 180
              const distance = 150
              const x = Math.cos(rad) * distance
              const y = Math.sin(rad) * distance
              const isExpanded = expandedCategory === cat.key

              return (
                <motion.div
                  key={cat.key}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{ opacity: 1, x, y, scale: 1 }}
                  exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.8, delay: i * 0.04 }}
                  className="absolute bottom-0 left-0"
                  style={{ zIndex: isExpanded ? 60 : 50 }}
                >
                  {/* Sub-option bubbles */}
                  <AnimatePresence>
                    {isExpanded && cat.options.map((opt, j) => {
                      const offsetAngle = (j - (cat.options.length - 1) / 2) * 38
                      const subRad = ((angleDeg + offsetAngle) * Math.PI) / 180
                      const subDist = 72
                      const sx = Math.cos(subRad) * subDist
                      const sy = Math.sin(subRad) * subDist
                      const isActive = activeFilters[cat.key] === opt

                      return (
                        <motion.button
                          key={opt}
                          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                          animate={{ opacity: 1, x: sx, y: sy, scale: 1 }}
                          exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                          transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.7, delay: j * 0.05 }}
                          onClick={(e) => { e.stopPropagation(); toggleFilter(cat.key, opt) }}
                          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-extrabold border-2 whitespace-nowrap transition-all duration-200 ${
                            isActive
                              ? "text-white scale-110 shadow-xl"
                              : "text-gray-800 bg-white/95 hover:scale-105 shadow-md"
                          }`}
                          style={{
                            borderColor: isActive ? cat.color : "rgba(200,200,220,0.5)",
                            background: isActive ? `linear-gradient(135deg, ${cat.color}, ${cat.color}dd)` : "rgba(255, 255, 255, 0.95)",
                            boxShadow: isActive ? `0 6px 20px ${cat.color}45` : "0 4px 14px rgba(0,0,0,0.1)",
                          }}
                        >
                          {opt}
                        </motion.button>
                      )
                    })}
                  </AnimatePresence>

                  {/* Category petal button */}
                  <button
                    onClick={() => handleCategoryClick(cat.key)}
                    className="flex flex-col items-center justify-center rounded-full h-[54px] w-[54px] border-2 shadow-2xl transition-all duration-300 hover:scale-110 bg-white/95"
                    style={{
                      borderColor: activeFilters[cat.key] ? cat.color : "rgba(200,200,220,0.6)",
                      background: activeFilters[cat.key]
                        ? `linear-gradient(135deg, ${cat.color}, ${cat.color}cc)`
                        : "rgba(255, 255, 255, 0.95)",
                      boxShadow: activeFilters[cat.key]
                        ? `0 6px 24px ${cat.color}40`
                        : "0 6px 20px rgba(0,0,0,0.12)",
                      color: activeFilters[cat.key] ? "white" : "#444",
                    }}
                  >
                    <span className="text-base leading-none">{cat.icon}</span>
                    <span className="text-[9px] font-black mt-0.5" style={{ color: activeFilters[cat.key] ? "white" : cat.color }}>{cat.label}</span>
                  </button>
                </motion.div>
              )
            })}
          </>
        )}
      </AnimatePresence>

      {/* Main Customize Normal Floating Button */}
      <motion.button
        type="button"
        onClick={() => { setIsOpen(!isOpen); setExpandedCategory(null) }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative flex items-center justify-center gap-2 rounded-full px-5 py-3.5 shadow-2xl border-2 transition-all cursor-pointer"
        style={{
          background: isOpen
            ? "linear-gradient(135deg, #10B981, #059669)"
            : "linear-gradient(135deg, #10B981, #14B8A6)",
          borderColor: "rgba(255,255,255,0.4)",
          boxShadow: "0 10px 30px rgba(16,185,129,0.35), 0 2px 10px rgba(0,0,0,0.12)",
        }}
      >
        <SlidersHorizontal className={`h-5 w-5 text-white transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />
        <span className="text-xs font-extrabold text-white tracking-wide">
          {isOpen ? "Close" : "Customize"}
        </span>

        {/* Active filter badge */}
        {activeCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-md ring-2 ring-white ml-0.5">
            {activeCount}
          </span>
        )}
      </motion.button>
    </div>
  )
}

/* ─────────────────────────────────────────────
   FILTER PILLS BAR
   ───────────────────────────────────────────── */
function FilterPills({ activeFilters, setActiveFilters }) {
  const entries = Object.entries(activeFilters)
  if (entries.length === 0) return null

  const getCatColor = (key) => filterCategories.find(c => c.key === key)?.color || "#888"

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2 mb-6"
    >
      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
        <Filter className="h-3.5 w-3.5" /> Active Filters:
      </span>
      {entries.map(([key, value]) => (
        <motion.button
          key={key}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          onClick={() => {
            setActiveFilters(prev => {
              const next = { ...prev }
              delete next[key]
              return next
            })
          }}
          className="inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-bold shadow-sm transition hover:shadow-md hover:scale-105"
          style={{
            borderColor: getCatColor(key),
            color: getCatColor(key),
            background: `${getCatColor(key)}12`,
          }}
        >
          {filterCategories.find(c => c.key === key)?.icon} {value}
          <X className="h-3.5 w-3.5 ml-0.5 opacity-70" />
        </motion.button>
      ))}
      <button
        onClick={() => setActiveFilters({})}
        className="text-xs font-bold text-destructive hover:underline ml-1"
      >
        Clear all
      </button>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   MAIN EXPLORE WORKSPACE COMPONENT
   ───────────────────────────────────────────── */
export function ExploreWorkspace({ onBack, onSelectDestination }) {
  const [hoveredId, setHoveredId] = useState(null)
  const [activeFilters, setActiveFilters] = useState({})
  const [selectedDest, setSelectedDest] = useState(null)
  const [panelPosition, setPanelPosition] = useState("right")

  // Filter destinations based on active filters (AND logic)
  const filteredDestinations = allDestinations.filter(dest => {
    return Object.entries(activeFilters).every(([key, value]) => dest[key] === value)
  })

  // Get background tint color from active filters
  const getOverlayTint = () => {
    const keys = Object.keys(activeFilters)
    if (keys.length === 0) return "transparent"
    const lastKey = keys[keys.length - 1]
    return filterCategories.find(c => c.key === lastKey)?.bgTint || "transparent"
  }

  // Handle card click — determine panel position based on click position
  const handleCardClick = useCallback((dest, e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cardCenterX = rect.left + rect.width / 2
    const viewportMid = window.innerWidth / 2
    setPanelPosition(cardCenterX < viewportMid ? "right" : "left")
    setSelectedDest(dest)
  }, [])

  // Group by row for display
  const hasFilters = Object.keys(activeFilters).length > 0
  const trendingDests = filteredDestinations.filter(d => d.row === "trending")
  const hiddenDests = filteredDestinations.filter(d => d.row === "hidden")
  const escapeDests = filteredDestinations.filter(d => d.row === "escapes")

  return (
    <div className="min-h-screen bg-background pt-24 pb-32 relative">
      {/* Filter Background Overlay */}
      <AnimatePresence>
        {hasFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: getOverlayTint() }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Navigation Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onBack}
              className="rounded-xl border-border bg-background hover:bg-accent text-xs sm:text-sm font-semibold">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Overview
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-foreground text-sm">Interactive Destination Explorer</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Globe className="h-3.5 w-3.5" />
            {filteredDestinations.length} Destinations
          </span>
        </div>

        {/* Section Heading */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Explore the World{" "}
            <span className="font-serif italic text-emerald-600 dark:text-emerald-400 font-normal">Your Way</span>
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-2xl font-medium">
            Hover to discover quick info petals • Click to see full details • Click Dora Backpack below to filter
          </p>
        </div>

        {/* Active Filter Pills */}
        <FilterPills activeFilters={activeFilters} setActiveFilters={setActiveFilters} />

        {/* Destinations Grid */}
        <div className="rounded-3xl border border-border/80 bg-gradient-to-b from-card/80 to-card p-6 shadow-xl backdrop-blur-xl overflow-visible">
          {filteredDestinations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Globe className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="font-heading text-lg font-bold text-foreground mb-1">No destinations match</h3>
              <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters</p>
              <Button variant="outline" onClick={() => setActiveFilters({})} className="rounded-xl font-bold">
                Clear All Filters
              </Button>
            </motion.div>
          ) : hasFilters ? (
            /* When filtered: show in a scrollable left-aligned row */
            <DestinationRow
              destinations={filteredDestinations}
              label="Filtered Results"
              icon={<Filter className="h-4 w-4" />}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              onCardClick={handleCardClick}
            />
          ) : (
            /* Default: 3 rows */
            <>
              {rowConfig.map(row => {
                const rowDests = row.key === "trending" ? trendingDests
                  : row.key === "hidden" ? hiddenDests
                  : escapeDests
                if (rowDests.length === 0) return null
                return (
                  <DestinationRow
                    key={row.key}
                    destinations={rowDests}
                    label={row.label}
                    icon={row.icon}
                    hoveredId={hoveredId}
                    setHoveredId={setHoveredId}
                    onCardClick={handleCardClick}
                  />
                )
              })}
            </>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedDest && (
          <DetailPanel
            destination={selectedDest}
            position={panelPosition}
            onClose={() => setSelectedDest(null)}
            onExplore={(name) => {
              setSelectedDest(null)
              onSelectDestination(name)
            }}
          />
        )}
      </AnimatePresence>

      {/* Customize Wheel */}
      <CustomizeWheel activeFilters={activeFilters} setActiveFilters={setActiveFilters} />
    </div>
  )
}
