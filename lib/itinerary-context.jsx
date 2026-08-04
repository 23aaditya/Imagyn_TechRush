"use client"

import React, { createContext, useContext, useState, useMemo } from "react"

export const PRESET_PLACES_LIST = [
  "Agra",
  "Ahmedabad",
  "Alleppey",
  "Amritsar",
  "Bali",
  "Bengaluru",
  "Goa",
  "Gangtok",
  "Gulmarg",
  "Jaipur",
  "Jaisalmer",
  "Jodhpur",
  "Kerala",
  "Ladakh",
  "Manali",
  "Mumbai",
  "Munnar",
  "Mysore",
  "New Delhi",
  "Rishikesh",
  "Santorini",
  "Shimla",
  "Udaipur",
  "Varanasi"
]

const DESTINATION_TEMPLATES = {
  Agra: {
    name: "Agra, Uttar Pradesh",
    tagline: "Home of the Taj Mahal & Mughal Heritage",
    baseHotelPerNight: 2800,
    baseDailyFood: 1200,
    baseTransport: 900,
    days: {
      1: [
        {
          id: "ag-1",
          name: "Taj Mahal Sunrise Visit",
          category: "Must Visit",
          visitTime: "06:00 AM - 09:30 AM",
          cost: 250,
          coords: [27.1751, 78.0421],
          notes: "Visit early at sunrise to beat the crowd and enjoy soft lighting.",
          type: "Monument"
        },
        {
          id: "ag-2",
          name: "Agra Fort (Red Fort)",
          category: "Must Visit",
          visitTime: "11:00 AM - 01:30 PM",
          cost: 300,
          coords: [27.1795, 78.0211],
          notes: "Massive 16th-century red sandstone fortress of Mughal Emperors.",
          type: "Heritage"
        },
        {
          id: "ag-3",
          name: "Mehtab Bagh Sunset Taj View",
          category: "Hidden Gem",
          visitTime: "05:00 PM - 06:30 PM",
          cost: 50,
          coords: [27.18, 78.043],
          notes: "Charbagh garden complex across Yamuna River with uninterrupted Taj view.",
          type: "Photography"
        }
      ],
      2: [
        {
          id: "ag-4",
          name: "Fatehpur Sikri Day Trip",
          category: "Must Visit",
          visitTime: "09:30 AM - 01:30 PM",
          cost: 350,
          coords: [27.0945, 77.6679],
          notes: "Emperor Akbar's abandoned red sandstone capital & Buland Darwaza.",
          type: "Architecture"
        },
        {
          id: "ag-5",
          name: "Tomb of I'timād-ud-Daulah (Baby Taj)",
          category: "Recommended",
          visitTime: "03:00 PM - 04:30 PM",
          cost: 110,
          coords: [27.1928, 78.0313],
          notes: "Intricate marble inlay work known as the draft for Taj Mahal.",
          type: "Heritage"
        },
        {
          id: "ag-6",
          name: "Petha Tasting at Sadar Bazaar",
          category: "Hidden Gem",
          visitTime: "06:00 PM - 08:00 PM",
          cost: 300,
          coords: [27.16, 78.01],
          notes: "Try authentic Agra petha varieties (Angoori, Kesar, Paan petha).",
          type: "Food & Shopping"
        }
      ]
    }
  },
  Jaipur: {
    name: "Jaipur, Rajasthan",
    tagline: "The Royal Pink City",
    baseHotelPerNight: 3500,
    baseDailyFood: 1500,
    baseTransport: 1200,
    days: {
      1: [
        {
          id: "j-1",
          name: "Hawa Mahal (Palace of Winds)",
          category: "Must Visit",
          visitTime: "09:00 AM - 10:30 AM",
          cost: 200,
          coords: [26.9239, 75.8267],
          notes: "Visit early morning for best lighting and photography.",
          type: "Sightseeing"
        },
        {
          id: "j-2",
          name: "City Palace & Armoury Museum",
          category: "Must Visit",
          visitTime: "11:00 AM - 01:30 PM",
          cost: 300,
          coords: [26.9258, 75.8237],
          notes: "Explore Chandra Mahal and the peacock courtyard.",
          type: "Heritage"
        },
        {
          id: "j-3",
          name: "Jantar Mantar Astronomical Observatory",
          category: "Recommended",
          visitTime: "02:30 PM - 04:00 PM",
          cost: 200,
          coords: [26.9247, 75.8246],
          notes: "UNESCO World Heritage site with giant sundials.",
          type: "Science & History"
        },
        {
          id: "j-4",
          name: "Tattoo Cafe & Wind View Rooftop",
          category: "Hidden Gem",
          visitTime: "05:00 PM - 06:30 PM",
          cost: 350,
          coords: [26.9241, 75.8269],
          notes: "Perfect panoramic view of Hawa Mahal at sunset.",
          type: "Dining & View"
        }
      ],
      2: [
        {
          id: "j-5",
          name: "Amer Fort & Sheesh Mahal",
          category: "Must Visit",
          visitTime: "09:00 AM - 01:00 PM",
          cost: 500,
          coords: [26.9855, 75.8513],
          notes: "Iconic hilltop fort. Audio guides recommended.",
          type: "Architecture"
        },
        {
          id: "j-6",
          name: "Panna Meena ka Kund (Geometric Stepwell)",
          category: "Hidden Gem",
          visitTime: "01:30 PM - 02:30 PM",
          cost: 0,
          coords: [26.987, 75.853],
          notes: "Symmetrical stepwell just 5 mins from Amer Fort.",
          type: "Photography"
        },
        {
          id: "j-7",
          name: "Jal Mahal Viewpoint",
          category: "Recommended",
          visitTime: "04:30 PM - 05:30 PM",
          cost: 0,
          coords: [26.9534, 75.8462],
          notes: "Water palace floating on Man Sagar Lake.",
          type: "Scenic"
        },
        {
          id: "j-8",
          name: "Chokhi Dhani Ethnic Resort & Dinner",
          category: "Recommended",
          visitTime: "07:00 PM - 10:00 PM",
          cost: 1100,
          coords: [26.767, 75.834],
          notes: "Authentic Rajasthani thali and folk dance performances.",
          type: "Culture & Dining"
        }
      ],
      3: [
        {
          id: "j-9",
          name: "Nahargarh Fort Sunset Viewpoint",
          category: "Must Visit",
          visitTime: "04:00 PM - 07:00 PM",
          cost: 200,
          coords: [26.9374, 75.8155],
          notes: "Best panoramic sunset over the entire pink city.",
          type: "Viewpoint"
        },
        {
          id: "j-10",
          name: "Albert Hall State Museum",
          category: "Recommended",
          visitTime: "11:00 AM - 01:00 PM",
          cost: 150,
          coords: [26.9116, 75.8195],
          notes: "Indo-Saracenic architecture illuminated at night.",
          type: "Museum"
        },
        {
          id: "j-11",
          name: "Johari Bazaar Local Handicrafts Market",
          category: "Hidden Gem",
          visitTime: "01:30 PM - 03:30 PM",
          cost: 500,
          coords: [26.92, 75.825],
          notes: "Traditional block print textiles and blue pottery.",
          type: "Shopping"
        }
      ]
    }
  },
  Goa: {
    name: "Goa Coast",
    tagline: "Beaches, Forts & Portuguese Heritage",
    baseHotelPerNight: 4500,
    baseDailyFood: 2000,
    baseTransport: 1500,
    days: {
      1: [
        {
          id: "g-1",
          name: "Baga Beach Water Sports",
          category: "Must Visit",
          visitTime: "09:30 AM - 01:00 PM",
          cost: 1500,
          coords: [15.5553, 73.7517],
          notes: "Parasailing, banana ride, and jet-skiing.",
          type: "Adventure"
        },
        {
          id: "g-2",
          name: "Fort Aguada & Lighthouse",
          category: "Recommended",
          visitTime: "03:30 PM - 05:30 PM",
          cost: 50,
          coords: [15.4926, 73.7737],
          notes: "17th-century Portuguese fortress overlooking Arabian sea.",
          type: "Heritage"
        },
        {
          id: "g-3",
          name: "Thalassa Greek Restaurant Sunset",
          category: "Hidden Gem",
          visitTime: "06:30 PM - 09:30 PM",
          cost: 1200,
          coords: [15.602, 73.738],
          notes: "Cliffside restaurant with Greek dining & sunset views.",
          type: "Dining"
        }
      ],
      2: [
        {
          id: "g-4",
          name: "Dudhsagar Waterfalls Jeep Safari",
          category: "Must Visit",
          visitTime: "07:00 AM - 02:00 PM",
          cost: 1800,
          coords: [15.3144, 74.3143],
          notes: "Four-tiered waterfall through Bhagwan Mahavir Sanctuary.",
          type: "Nature"
        },
        {
          id: "g-5",
          name: "Tropical Spice Plantation Tour",
          category: "Recommended",
          visitTime: "02:30 PM - 04:30 PM",
          cost: 600,
          coords: [15.405, 74.02],
          notes: "Traditional Goan lunch served on banana leaf.",
          type: "Culinary"
        },
        {
          id: "g-6",
          name: "Fontainhas Latin Quarter Walk",
          category: "Hidden Gem",
          visitTime: "05:30 PM - 07:30 PM",
          cost: 0,
          coords: [15.4975, 73.8344],
          notes: "Colorful Portuguese architecture and heritage cafes.",
          type: "Walk"
        }
      ]
    }
  },
  Kerala: {
    name: "Kerala Backwaters",
    tagline: "God's Own Country",
    baseHotelPerNight: 5000,
    baseDailyFood: 1800,
    baseTransport: 1400,
    days: {
      1: [
        {
          id: "k-1",
          name: "Alleppey Backwater Houseboat Cruise",
          category: "Must Visit",
          visitTime: "11:30 AM - 05:00 PM",
          cost: 4500,
          coords: [9.4981, 76.3388],
          notes: "Private houseboat ride through palm-fringed canals.",
          type: "Scenic"
        },
        {
          id: "k-2",
          name: "Marari Peaceful Beach Sunset",
          category: "Recommended",
          visitTime: "05:30 PM - 07:00 PM",
          cost: 0,
          coords: [9.6, 76.2833],
          notes: "Quiet coconut grove beach away from crowds.",
          type: "Relaxation"
        },
        {
          id: "k-3",
          name: "Local Toddy Shop & Karimeen Fry",
          category: "Hidden Gem",
          visitTime: "07:30 PM - 09:00 PM",
          cost: 600,
          coords: [9.51, 76.35],
          notes: "Authentic spicy Pearl Spot fish curry experience.",
          type: "Dining"
        }
      ],
      2: [
        {
          id: "k-4",
          name: "Munnar Tea Plantation & Factory",
          category: "Must Visit",
          visitTime: "09:00 AM - 01:00 PM",
          cost: 250,
          coords: [10.0889, 77.0597],
          notes: "Lush green rolling hills and fresh tea tasting.",
          type: "Nature"
        },
        {
          id: "k-5",
          name: "Eravikulam National Park",
          category: "Recommended",
          visitTime: "02:00 PM - 04:30 PM",
          cost: 400,
          coords: [10.2, 77.0833],
          notes: "Home to endangered Nilgiri Tahr mountain goats.",
          type: "Wildlife"
        }
      ]
    }
  },
  Manali: {
    name: "Manali, Himachal Pradesh",
    tagline: "Snow Peaks & Mountain Adventures",
    baseHotelPerNight: 3200,
    baseDailyFood: 1400,
    baseTransport: 1100,
    days: {
      1: [
        {
          id: "m-1",
          name: "Solang Valley Snow Sports & Paragliding",
          category: "Must Visit",
          visitTime: "09:00 AM - 02:00 PM",
          cost: 1500,
          coords: [32.3167, 77.15],
          notes: "High-altitude adventure sports, quad biking, & cable car.",
          type: "Adventure"
        },
        {
          id: "m-2",
          name: "Hadimba Ancient Temple",
          category: "Recommended",
          visitTime: "03:30 PM - 05:00 PM",
          cost: 50,
          coords: [32.2475, 77.1803],
          notes: "400-year-old wooden temple surrounded by giant Deodar forest.",
          type: "Heritage"
        },
        {
          id: "m-3",
          name: "Old Manali Cafe Crawl & Siddu Tasting",
          category: "Hidden Gem",
          visitTime: "06:00 PM - 09:00 PM",
          cost: 500,
          coords: [32.254, 77.185],
          notes: "Bohemian cafes with acoustic music and traditional Himachali steamed bread.",
          type: "Dining"
        }
      ]
    }
  },
  Lonavala: {
    name: "Lonavala & Khandala",
    tagline: "Misty Valleys, Forts & Waterfall Cascades",
    baseHotelPerNight: 3000,
    baseDailyFood: 1300,
    baseTransport: 1000,
    days: {
      1: [
        {
          id: "lon-1",
          name: "Tiger's Point (Tiger Leap Viewpoint)",
          category: "Must Visit",
          visitTime: "08:30 AM - 11:00 AM",
          cost: 50,
          coords: [18.75, 73.40],
          notes: "Clifftop edge with panoramic views of the Western Ghats cliff drop.",
          type: "Viewpoint & Nature"
        },
        {
          id: "lon-2",
          name: "Bhushi Dam Waterfall Cascades",
          category: "Must Visit",
          visitTime: "11:30 AM - 02:00 PM",
          cost: 100,
          coords: [18.73, 73.41],
          notes: "Step water cascades. Enjoy hot Vada Pav & Corn Bhajji at stalls.",
          type: "Waterfall & Fun"
        },
        {
          id: "lon-3",
          name: "Lion's Point Sunset View",
          category: "Hidden Gem",
          visitTime: "05:00 PM - 07:00 PM",
          cost: 0,
          coords: [18.74, 73.41],
          notes: "Dramatic sunset over deep valleys and surrounding mist.",
          type: "Sunset View"
        }
      ],
      2: [
        {
          id: "lon-4",
          name: "Pawna Lake Boating & Waterside Picnic",
          category: "Must Visit",
          visitTime: "10:00 AM - 02:30 PM",
          cost: 600,
          coords: [18.68, 73.48],
          notes: "Serene lakeside views, motorboating, and speed boating.",
          type: "Lakeside & Adventure"
        },
        {
          id: "lon-5",
          name: "Karla & Bhaja Ancient Buddhist Caves",
          category: "Recommended",
          visitTime: "03:30 PM - 05:30 PM",
          cost: 150,
          coords: [18.78, 73.47],
          notes: "2nd century BC rock-cut Buddhist caves & Ekvira Devi Temple.",
          type: "Heritage & History"
        },
        {
          id: "lon-6",
          name: "Maganlal Chikki & Fudge Shopping",
          category: "Must Visit",
          visitTime: "06:30 PM - 08:30 PM",
          cost: 400,
          coords: [18.75, 73.40],
          notes: "Buy world-famous Walnut Fudge and fresh Chikki varieties.",
          type: "Food & Shopping"
        }
      ],
      3: [
        {
          id: "lon-7",
          name: "Rajmachi Fort Valley Trek & Viewpoint",
          category: "Must Visit",
          visitTime: "08:00 AM - 01:00 PM",
          cost: 200,
          coords: [18.83, 73.40],
          notes: "Historical twin forts of Shrivardhan and Manaranjan.",
          type: "Trekking & Fort"
        },
        {
          id: "lon-8",
          name: "Sunil's Celebrity Wax Museum",
          category: "Recommended",
          visitTime: "02:30 PM - 04:30 PM",
          cost: 250,
          coords: [18.75, 73.41],
          notes: "Life-sized wax figures of global celebrities and national icons.",
          type: "Entertainment"
        },
        {
          id: "lon-9",
          name: "Duke's Nose Viewpoint & Khandala Sunset",
          category: "Hidden Gem",
          visitTime: "05:00 PM - 07:00 PM",
          cost: 0,
          coords: [18.76, 73.37],
          notes: "Distinct cliff shaping named after Duke of Wellington.",
          type: "Nature & Sunset"
        }
      ]
    }
  }
}

// Fallback dynamic generator for any place not in template
function buildDynamicTemplate(placeName) {
  const cleanName = placeName.trim()
  const capitalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
  return {
    name: `${capitalized} Exploration`,
    tagline: "Personalized Smart Destination Plan",
    baseHotelPerNight: 3000,
    baseDailyFood: 1400,
    baseTransport: 1000,
    days: {
      1: [
        {
          id: `dyn-1-${Date.now()}`,
          name: `${capitalized} Iconic Landmark & City Tour`,
          category: "Must Visit",
          visitTime: "09:30 AM - 01:00 PM",
          cost: 350,
          coords: [25.0, 77.0],
          notes: `Explore the primary historic center and famous viewpoints of ${capitalized}.`,
          type: "Heritage & Sightseeing"
        },
        {
          id: `dyn-2-${Date.now()}`,
          name: `${capitalized} Local Heritage Walk & Museum`,
          category: "Recommended",
          visitTime: "02:30 PM - 05:00 PM",
          cost: 200,
          coords: [25.01, 77.01],
          notes: `Guided walk through traditional craft markets and cultural spots.`,
          type: "Culture"
        },
        {
          id: `dyn-3-${Date.now()}`,
          name: `${capitalized} Secret Viewpoint & Local Dining`,
          category: "Hidden Gem",
          visitTime: "06:00 PM - 08:30 PM",
          cost: 450,
          coords: [25.02, 77.02],
          notes: `Scenic evening spot with authentic local delicacies.`,
          type: "Hidden Gem & Dining"
        }
      ],
      2: [
        {
          id: `dyn-4-${Date.now()}`,
          name: `${capitalized} Nature Trail & Panoramic View`,
          category: "Must Visit",
          visitTime: "09:00 AM - 01:00 PM",
          cost: 150,
          coords: [25.03, 77.03],
          notes: "Morning scenic excursion and nature walk.",
          type: "Nature"
        },
        {
          id: `dyn-5-${Date.now()}`,
          name: `${capitalized} Souvenir & Craft Bazaar`,
          category: "Recommended",
          visitTime: "03:00 PM - 06:00 PM",
          cost: 500,
          coords: [25.04, 77.04],
          notes: "Shop for local specialties and handcrafted artifacts.",
          type: "Shopping"
        }
      ]
    }
  }
}

function formatDateToShort(dateStr) {
  if (!dateStr) return ""
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
  } catch {
    return dateStr
  }
}

const ItineraryContext = createContext(null)

export function ItineraryProvider({ children }) {
  const [selectedDestinationKey, setSelectedDestinationKey] = useState("Agra")
  const [activeDay, setActiveDay] = useState(1)
  const [customDaysData, setCustomDaysData] = useState({})
  
  // Date Range State
  const [startDate, setStartDate] = useState("2026-08-10")
  const [endDate, setEndDate] = useState("2026-08-13")

  const [userLoggedExpenses, setUserLoggedExpenses] = useState([
    { id: "e1", label: "Hotel Advance Booking", category: "Accommodation", amount: 8500, date: "Yesterday" },
    { id: "e2", label: "Taj Mahal Entry Ticket", category: "Attractions & Entry", amount: 250, date: "Today" },
    { id: "e3", label: "Lunch at Pinch of Spice", category: "Food & Dining", amount: 950, date: "Today" },
  ])

  const travelDatesSpan = useMemo(() => {
    if (!startDate || !endDate) return "Aug 10 - Aug 13, 2026"
    const startFmt = formatDateToShort(startDate)
    const endFmt = formatDateToShort(endDate)
    return `${startFmt} – ${endFmt}`
  }, [startDate, endDate])

  const template = useMemo(() => {
    if (DESTINATION_TEMPLATES[selectedDestinationKey]) {
      return DESTINATION_TEMPLATES[selectedDestinationKey]
    }
    return buildDynamicTemplate(selectedDestinationKey)
  }, [selectedDestinationKey])

  const days = useMemo(() => {
    return customDaysData[selectedDestinationKey] || template.days
  }, [customDaysData, selectedDestinationKey, template])

  const currentDayAttractions = days[activeDay] || []

  const totalAttractionCost = useMemo(() => {
    let sum = 0
    Object.values(days).forEach((attrList) => {
      attrList.forEach((item) => {
        sum += item.cost || 0
      })
    })
    return sum
  }, [days])

  const totalDaysCount = Object.keys(days).length
  const estimatedAccommodationCost = template.baseHotelPerNight * totalDaysCount
  const estimatedFoodCost = template.baseDailyFood * totalDaysCount
  const estimatedTransportCost = template.baseTransport * totalDaysCount
  
  const grandTotalBudget = estimatedAccommodationCost + estimatedFoodCost + estimatedTransportCost + totalAttractionCost

  const totalSpent = useMemo(() => {
    return userLoggedExpenses.reduce((acc, curr) => acc + curr.amount, 0)
  }, [userLoggedExpenses])

  const remainingBudget = Math.max(0, grandTotalBudget - totalSpent)

  const setDestination = (destKey) => {
    if (destKey && destKey.trim()) {
      const normalized = destKey.trim()
      const match = PRESET_PLACES_LIST.find((p) => p.toLowerCase() === normalized.toLowerCase())
      const finalName = match || (normalized.charAt(0).toUpperCase() + normalized.slice(1))
      setSelectedDestinationKey(finalName)
      setActiveDay(1)
    }
  }

  // Extend Date by + Sign (Add Day)
  const addDay = () => {
    const currentDays = { ...days }
    const nextDayNum = Object.keys(currentDays).length + 1
    
    currentDays[nextDayNum] = [
      {
        id: `dyn-day-${nextDayNum}-${Date.now()}`,
        name: `${selectedDestinationKey} Day ${nextDayNum} Excursion & Hidden Spots`,
        category: "Must Visit",
        visitTime: "10:00 AM - 01:30 PM",
        cost: 300,
        coords: [25.0, 77.0],
        notes: `Exploration of scenic spots, local markets, and cultural landmarks on Day ${nextDayNum}.`,
        type: "Sightseeing"
      },
      {
        id: `dyn-day-${nextDayNum}-2-${Date.now()}`,
        name: `${selectedDestinationKey} Evening Sunset & Dinner`,
        category: "Recommended",
        visitTime: "05:30 PM - 08:30 PM",
        cost: 500,
        coords: [25.01, 77.01],
        notes: `Relaxing sunset viewpoint and traditional regional dining.`,
        type: "Dining & View"
      }
    ]

    setCustomDaysData((prev) => ({
      ...prev,
      [selectedDestinationKey]: currentDays
    }))

    // Automatically extend endDate by +1 Day!
    if (endDate) {
      try {
        const d = new Date(endDate)
        d.setDate(d.getDate() + 1)
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, "0")
        const day = String(d.getDate()).padStart(2, "0")
        setEndDate(`${year}-${month}-${day}`)
      } catch (e) {
        // ignore date parse errors
      }
    }

    setActiveDay(nextDayNum)
  }

  const removeDay = (dayNumToRemove) => {
    const currentDays = { ...days }
    const dayKeys = Object.keys(currentDays).map(Number)
    if (dayKeys.length <= 1) return // Keep at least 1 day

    delete currentDays[dayNumToRemove]
    
    // Re-index remaining days
    const reindexedDays = {}
    let newIdx = 1
    Object.keys(currentDays).sort((a,b) => Number(a) - Number(b)).forEach((key) => {
      reindexedDays[newIdx] = currentDays[key]
      newIdx++
    })

    setCustomDaysData((prev) => ({
      ...prev,
      [selectedDestinationKey]: reindexedDays
    }))

    setActiveDay((prev) => Math.min(prev, Object.keys(reindexedDays).length))
  }

  const addAttraction = (dayNum, newAttraction) => {
    const currentDays = { ...days }
    const list = currentDays[dayNum] ? [...currentDays[dayNum]] : []
    const newItem = {
      id: `custom-${Date.now()}`,
      cost: 0,
      category: "Recommended",
      visitTime: "Flex time",
      coords: [27.0, 78.0],
      ...newAttraction
    }
    list.push(newItem)
    currentDays[dayNum] = list
    setCustomDaysData((prev) => ({
      ...prev,
      [selectedDestinationKey]: currentDays
    }))
  }

  const removeAttraction = (dayNum, itemId) => {
    const currentDays = { ...days }
    if (currentDays[dayNum]) {
      currentDays[dayNum] = currentDays[dayNum].filter((item) => item.id !== itemId)
      setCustomDaysData((prev) => ({
        ...prev,
        [selectedDestinationKey]: currentDays
      }))
    }
  }

  const moveAttraction = (dayNum, index, direction) => {
    const currentDays = { ...days }
    const list = [...(currentDays[dayNum] || [])]
    const targetIndex = index + direction
    if (targetIndex >= 0 && targetIndex < list.length) {
      const temp = list[index]
      list[index] = list[targetIndex]
      list[targetIndex] = temp
      currentDays[dayNum] = list
      setCustomDaysData((prev) => ({
        ...prev,
        [selectedDestinationKey]: currentDays
      }))
    }
  }

  const addExpense = (expense) => {
    setUserLoggedExpenses((prev) => [
      {
        id: `exp-${Date.now()}`,
        date: "Just now",
        ...expense
      },
      ...prev
    ])
  }

  return (
    <ItineraryContext.Provider
      value={{
        presetPlaces: PRESET_PLACES_LIST,
        destinations: Object.keys(DESTINATION_TEMPLATES),
        selectedDestinationKey,
        setDestination,
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        travelDatesSpan,
        destinationMeta: template,
        activeDay,
        setActiveDay,
        days,
        currentDayAttractions,
        totalAttractionCost,
        grandTotalBudget,
        estimatedAccommodationCost,
        estimatedFoodCost,
        estimatedTransportCost,
        totalSpent,
        remainingBudget,
        userLoggedExpenses,
        addDay,
        removeDay,
        addAttraction,
        removeAttraction,
        moveAttraction,
        addExpense
      }}
    >
      {children}
    </ItineraryContext.Provider>
  )
}

export function useItinerary() {
  const ctx = useContext(ItineraryContext)
  if (!ctx) {
    throw new Error("useItinerary must be used within an ItineraryProvider")
  }
  return ctx
}
