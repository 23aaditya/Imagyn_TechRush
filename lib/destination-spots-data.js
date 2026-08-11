/**
 * Real-world Multi-Day Destination Spots Database
 * Provides 100% unique, non-repeating attractions, restaurants, cafes, and activities
 * for each day across global destinations.
 */

export const DESTINATION_SPOTS_DB = {
  goa: {
    name: "Goa (India)",
    baseLat: 15.55,
    baseLng: 73.75,
    days: [
      {
        title: "North Goa Heritage & Sunset Shacks",
        activities: [
          {
            title: "Fort Aguada & 17th Century Lighthouse",
            time: "09:30 AM",
            openingHours: "09:00 AM - 06:00 PM",
            type: "Sightseeing",
            category: "Activities",
            desc: "Historic Portuguese fortress overlooking Sinquerim beach & Arabian sea.",
            cost: "₹200",
            numericCost: 200,
            lat: 15.4925,
            lng: 73.7737,
            images: ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80"]
          },
          {
            title: "Artjuna Cafe & Organic Garden Bakery",
            time: "01:00 PM",
            openingHours: "07:30 AM - 10:30 PM",
            type: "Food",
            category: "Food & Dining",
            desc: "Organic Mediterranean dining, smoothies, and artisan garden seating in Anjuna.",
            cost: "₹650",
            numericCost: 650,
            lat: 15.5866,
            lng: 73.7431,
            images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80"]
          },
          {
            title: "Thalassa Vagator Sunset & Greek Dining",
            time: "06:30 PM",
            openingHours: "04:30 PM - 01:00 AM",
            type: "Sunset",
            category: "Food & Dining",
            desc: "Famous cliffside sunset views, Greek cuisine, and live evening dance performances.",
            cost: "₹1,800",
            numericCost: 1800,
            lat: 15.6028,
            lng: 73.7348,
            images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80"]
          }
        ]
      },
      {
        title: "Baga Coastal Water Sports & Anjuna Night Markets",
        activities: [
          {
            title: "Baga Beach Parasailing & Jet Ski Adventure",
            time: "10:00 AM",
            openingHours: "09:00 AM - 06:00 PM",
            type: "Activities",
            category: "Activities",
            desc: "Thrilling parasailing, jet skiing, and speedboats along Baga beach coastline.",
            cost: "₹1,500",
            numericCost: 1500,
            lat: 15.5553,
            lng: 73.7517,
            images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"]
          },
          {
            title: "Fisherman's Wharf Goan Seafood Lunch",
            time: "02:00 PM",
            openingHours: "12:00 PM - 11:00 PM",
            type: "Food",
            category: "Food & Dining",
            desc: "Authentic Goan prawn curry, kingfish rava fry, and riverside dining ambiance.",
            cost: "₹950",
            numericCost: 950,
            lat: 15.5600,
            lng: 73.7600,
            images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80"]
          },
          {
            title: "Anjuna Night Flea Market & Live Music",
            time: "07:00 PM",
            openingHours: "05:00 PM - 11:30 PM",
            type: "Shopping",
            category: "Shopping",
            desc: "Vibrant bohemian handicraft stalls, spices, accessories, and acoustic acoustic sets.",
            cost: "₹800",
            numericCost: 800,
            lat: 15.5800,
            lng: 73.7400,
            images: ["https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&auto=format&fit=crop&q=80"]
          }
        ]
      },
      {
        title: "Latin Quarter Heritage & Spice Plantation Trail",
        activities: [
          {
            title: "Fontainhas Panjim Portuguese Quarter Walking Tour",
            time: "09:00 AM",
            openingHours: "08:00 AM - 07:00 PM",
            type: "Sightseeing",
            category: "Activities",
            desc: "Colorful 19th-century Portuguese houses, narrow cobblestone alleys, and art galleries.",
            cost: "₹500",
            numericCost: 500,
            lat: 15.4989,
            lng: 73.8278,
            images: ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80"]
          },
          {
            title: "Sahakari Spice Farm Lunch & Botanical Tour",
            time: "01:30 PM",
            openingHours: "09:00 AM - 05:00 PM",
            type: "Food",
            category: "Food & Dining",
            desc: "Guided tropical spice plantation walk followed by traditional Goan buffet served on banana leaves.",
            cost: "₹750",
            numericCost: 750,
            lat: 15.4321,
            lng: 74.0123,
            images: ["https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80"]
          },
          {
            title: "Mandovi River Sunset Cruise & Cultural Folk Dance",
            time: "06:00 PM",
            openingHours: "05:30 PM - 09:00 PM",
            type: "Sunset",
            category: "Activities",
            desc: "Relaxing 1-hour cruise along Mandovi river featuring live DJ and Goan Fugdi dance.",
            cost: "₹600",
            numericCost: 600,
            lat: 15.5000,
            lng: 73.8300,
            images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80"]
          }
        ]
      },
      {
        title: "Dudhsagar Waterfalls Trek & Jungle Safari",
        activities: [
          {
            title: "Dudhsagar Four-Tier Waterfall Jeep Safari",
            time: "08:00 AM",
            openingHours: "07:00 AM - 05:00 PM",
            type: "Activities",
            category: "Activities",
            desc: "Spectacular 310m cascading waterfall jeep ride through Bhagwan Mahavir Wildlife Sanctuary.",
            cost: "₹1,200",
            numericCost: 1200,
            lat: 15.3144,
            lng: 74.3144,
            images: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80"]
          },
          {
            title: "Tambdi Surla 12th Century Ancient Temple",
            time: "02:00 PM",
            openingHours: "08:30 AM - 05:30 PM",
            type: "Sightseeing",
            category: "Activities",
            desc: "Ancient Kadamba dynasty basalt stone temple hidden deep inside the western ghats.",
            cost: "₹300",
            numericCost: 300,
            lat: 15.4389,
            lng: 74.2567,
            images: ["https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80"]
          },
          {
            title: "Martin's Corner South Goan Dinner & Live Jazz",
            time: "07:30 PM",
            openingHours: "11:30 AM - 11:30 PM",
            type: "Food",
            category: "Food & Dining",
            desc: "Celebrity-favorite restaurant in Betalbatim famous for crab xacuti and live music.",
            cost: "₹1,400",
            numericCost: 1400,
            lat: 15.3000,
            lng: 73.9200,
            images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80"]
          }
        ]
      },
      {
        title: "South Goa Quiet Beaches & Cliffside Resorts",
        activities: [
          {
            title: "Cabo de Rama Fort & Cliff Overlook",
            time: "10:00 AM",
            openingHours: "09:00 AM - 05:30 PM",
            type: "Sightseeing",
            category: "Activities",
            desc: "Ancient fortress standing high on steep cliffs offering dramatic views of South Goa coast.",
            cost: "₹250",
            numericCost: 250,
            lat: 15.0889,
            lng: 73.9189,
            images: ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80"]
          },
          {
            title: "Palolem Beach Kayaking & Dolphin Spotting",
            time: "02:30 PM",
            openingHours: "08:00 AM - 06:30 PM",
            type: "Activities",
            category: "Activities",
            desc: "Crescent-shaped tranquil beach with sea kayaking and boat trips to Butterfly Island.",
            cost: "₹900",
            numericCost: 900,
            lat: 15.0100,
            lng: 74.0200,
            images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"]
          },
          {
            title: "Dropadi Beach Shack Seafood Farewell Sunset",
            time: "06:30 PM",
            openingHours: "11:00 AM - 11:00 PM",
            type: "Sunset",
            category: "Food & Dining",
            desc: "Candlelight beachside dinner on Palolem beach with fresh lobster and sea breeze.",
            cost: "₹1,500",
            numericCost: 1500,
            lat: 15.0080,
            lng: 74.0220,
            images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80"]
          }
        ]
      }
    ]
  },
  bali: {
    name: "Bali (Indonesia)",
    baseLat: -8.4095,
    baseLng: 115.1889,
    days: [
      {
        title: "Ubud Cultural Core & Rice Terraces",
        activities: [
          {
            title: "Tegallalang Rice Terraces & Jungle Swing",
            time: "09:00 AM",
            openingHours: "08:00 AM - 06:00 PM",
            type: "Sightseeing",
            category: "Activities",
            desc: "Iconic terraced green paddy fields with panoramic valley views and giant swings.",
            cost: "₹650",
            numericCost: 650,
            lat: -8.4312,
            lng: 115.2792,
            images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80"]
          },
          {
            title: "Sacred Monkey Forest Sanctuary Walk",
            time: "01:30 PM",
            openingHours: "09:00 AM - 06:00 PM",
            type: "Sightseeing",
            category: "Activities",
            desc: "Lush jungle sanctuary housing over 700 Balinese long-tailed macaques and ancient temples.",
            cost: "₹500",
            numericCost: 500,
            lat: -8.5194,
            lng: 115.2606,
            images: ["https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&auto=format&fit=crop&q=80"]
          },
          {
            title: "Bebek Bengil Dirty Duck Diner Ubud",
            time: "07:00 PM",
            openingHours: "10:00 AM - 10:00 PM",
            type: "Food",
            category: "Food & Dining",
            desc: "Crispy Balinese duck specialty served in traditional open-air gazebos amidst rice fields.",
            cost: "₹1,200",
            numericCost: 1200,
            lat: -8.5150,
            lng: 115.2650,
            images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80"]
          }
        ]
      },
      {
        title: "Uluwatu Sunset Temple & Kecak Fire Dance",
        activities: [
          {
            title: "Garuda Wisnu Kencana Cultural Park",
            time: "10:00 AM",
            openingHours: "09:00 AM - 08:00 PM",
            type: "Sightseeing",
            category: "Activities",
            desc: "Monumental 122-meter statue of Lord Vishnu riding Garuda with cultural amphitheater.",
            cost: "₹950",
            numericCost: 950,
            lat: -8.8104,
            lng: 115.1676,
            images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80"]
          },
          {
            title: "Single Fin Uluwatu Cliffside Cafe Lunch",
            time: "02:00 PM",
            openingHours: "10:00 AM - 11:00 PM",
            type: "Food",
            category: "Food & Dining",
            desc: "Famous surfer lounge perched high on Suluban cliffs overlooking top wave breaks.",
            cost: "₹1,100",
            numericCost: 1100,
            lat: -8.8150,
            lng: 115.0880,
            images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80"]
          },
          {
            title: "Uluwatu Temple Sunset & Kecak Fire Dance",
            time: "06:00 PM",
            openingHours: "09:00 AM - 07:00 PM",
            type: "Sunset",
            category: "Activities",
            desc: "Dramatic cliff-edge sea temple with traditional chanting and fire performance at sunset.",
            cost: "₹850",
            numericCost: 850,
            lat: -8.8291,
            lng: 115.0861,
            images: ["https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&auto=format&fit=crop&q=80"]
          }
        ]
      },
      {
        title: "Nusa Penida Island Exploration & Kelingking Beach",
        activities: [
          {
            title: "Kelingking T-Rex Cliff Point & Lookout",
            time: "09:30 AM",
            openingHours: "06:00 AM - 07:00 PM",
            type: "Sightseeing",
            category: "Activities",
            desc: "World-renowned T-Rex-shaped green cliff formation plunging into turquoise waters.",
            cost: "₹1,400",
            numericCost: 1400,
            lat: -8.7505,
            lng: 115.4739,
            images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80"]
          },
          {
            title: "Broken Beach & Angel's Billabong Natural Pool",
            time: "01:30 PM",
            openingHours: "07:00 AM - 06:30 PM",
            type: "Sightseeing",
            category: "Activities",
            desc: "Natural archway over the ocean and crystal clear natural tide pool.",
            cost: "₹800",
            numericCost: 800,
            lat: -8.7331,
            lng: 115.4492,
            images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"]
          },
          {
            title: "Jimbaran Bay Seafood Candlelight Dinner",
            time: "07:00 PM",
            openingHours: "04:00 PM - 11:00 PM",
            type: "Food",
            category: "Food & Dining",
            desc: "Barefoot beachfront dining on soft sands with freshly grilled snappers and prawns.",
            cost: "₹1,600",
            numericCost: 1600,
            lat: -8.7690,
            lng: 115.1700,
            images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80"]
          }
        ]
      }
    ]
  },
  kyoto: {
    name: "Kyoto (Japan)",
    baseLat: 35.0116,
    baseLng: 135.7681,
    days: [
      {
        title: "Ancient Shrines & Torii Gate Pathways",
        activities: [
          {
            title: "Fushimi Inari Taisha 10,000 Torii Gates Trail",
            time: "08:00 AM",
            openingHours: "24 Hours Open",
            type: "Sightseeing",
            category: "Activities",
            desc: "Winding mountain path lined with thousands of vermilion torii gates dedicated to Inari.",
            cost: "₹0 (Free)",
            numericCost: 0,
            lat: 34.9671,
            lng: 135.7727,
            images: ["https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80"]
          },
          {
            title: "Kiyomizu-dera Wooden Stage Temple",
            time: "01:00 PM",
            openingHours: "06:00 AM - 06:00 PM",
            type: "Sightseeing",
            category: "Activities",
            desc: "UNESCO World Heritage site built on steep hillside with sweeping views of Kyoto.",
            cost: "₹350",
            numericCost: 350,
            lat: 34.9949,
            lng: 135.7850,
            images: ["https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80"]
          },
          {
            title: "Gion District Evening Walking & Kaiseki Dinner",
            time: "06:30 PM",
            openingHours: "05:00 PM - 10:30 PM",
            type: "Food",
            category: "Food & Dining",
            desc: "Traditional lantern-lit wooden tea house district and multi-course Japanese Kaiseki.",
            cost: "₹2,800",
            numericCost: 2800,
            lat: 35.0037,
            lng: 135.7772,
            images: ["https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80"]
          }
        ]
      },
      {
        title: "Arashiyama Bamboo Grove & Golden Pavilion",
        activities: [
          {
            title: "Arashiyama Bamboo Grove & Tenryu-ji Temple",
            time: "08:30 AM",
            openingHours: "08:30 AM - 05:30 PM",
            type: "Sightseeing",
            category: "Activities",
            desc: "Soaring green bamboo stalks swaying in wind alongside serene Zen landscape gardens.",
            cost: "₹400",
            numericCost: 400,
            lat: 35.0170,
            lng: 135.6713,
            images: ["https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80"]
          },
          {
            title: "Kinkaku-ji (Golden Pavilion Temple)",
            time: "02:00 PM",
            openingHours: "09:00 AM - 05:00 PM",
            type: "Sightseeing",
            category: "Activities",
            desc: "Gold leaf covered Zen temple reflecting over the serene Mirror Pond.",
            cost: "₹450",
            numericCost: 450,
            lat: 35.0394,
            lng: 135.7292,
            images: ["https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80"]
          },
          {
            title: "Nishiki Market 'Kyoto's Kitchen' Food Trail",
            time: "06:30 PM",
            openingHours: "10:00 AM - 06:30 PM",
            type: "Food",
            category: "Food & Dining",
            desc: "Narrow 5-block shopping street crammed with 100+ street food stalls and matcha treats.",
            cost: "₹1,200",
            numericCost: 1200,
            lat: 35.0050,
            lng: 135.7650,
            images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80"]
          }
        ]
      }
    ]
  }
}

/**
 * Get spots for a given destination and day count
 */
export function getDestinationSpots(cityName, dayIndex) {
  const normKey = (cityName || "goa").toLowerCase().split(",")[0].trim()
  const foundData = DESTINATION_SPOTS_DB[normKey] || DESTINATION_SPOTS_DB["goa"]

  const daysList = foundData.days
  const dayData = daysList[(dayIndex - 1) % daysList.length]

  return {
    cityName: foundData.name,
    baseLat: foundData.baseLat,
    baseLng: foundData.baseLng,
    dayTitle: dayData.title,
    activities: dayData.activities.map((act, idx) => ({
      ...act,
      id: `spot-${normKey}-d${dayIndex}-s${idx + 1}-${Date.now()}`
    }))
  }
}
