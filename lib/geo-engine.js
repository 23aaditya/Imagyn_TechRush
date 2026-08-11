/**
 * Geographic Engine — Stay-Centric Proximity Service
 * 
 * Core utility for the Map Intelligence Layer.
 * Provides real nearby POI discovery via Overpass API (OpenStreetMap),
 * Haversine distance calculations, transport cost estimation, and
 * result caching with debouncing.
 */

// ─── Haversine Distance ────────────────────────────────────────────────
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Number((R * c).toFixed(2))
}

// ─── Distance Ring Label ────────────────────────────────────────────────
export function getDistanceRing(distanceKm) {
  if (distanceKm < 0.5) return { label: "Walking", emoji: "🚶", color: "#22c55e" }
  if (distanceKm < 1) return { label: "Short walk", emoji: "🚶", color: "#22c55e" }
  if (distanceKm < 3) return { label: "Short ride", emoji: "🛺", color: "#3b82f6" }
  if (distanceKm < 10) return { label: "Drive", emoji: "🚗", color: "#f59e0b" }
  return { label: "Far", emoji: "🚗", color: "#ef4444" }
}

// ─── Transport Cost Estimation (India-calibrated, INR) ──────────────────
const TRANSPORT_RATES = {
  cab: { perKm: 15, baseFare: 50, label: "Cab / Car" },
  auto: { perKm: 10, baseFare: 30, label: "Auto Rickshaw" },
  bus: { perKm: 2, baseFare: 10, label: "Bus" },
  walk: { perKm: 0, baseFare: 0, label: "Walk" },
  bike: { perKm: 5, baseFare: 20, label: "Bike Taxi" }
}

export function estimateTransportCost(distanceKm, mode = "cab") {
  const rate = TRANSPORT_RATES[mode] || TRANSPORT_RATES.cab
  if (mode === "walk") return 0
  const cost = rate.baseFare + (distanceKm * rate.perKm)
  return Math.round(cost)
}

export function getAllTransportEstimates(distanceKm) {
  return Object.entries(TRANSPORT_RATES).map(([mode, rate]) => ({
    mode,
    label: rate.label,
    cost: mode === "walk" ? 0 : Math.round(rate.baseFare + (distanceKm * rate.perKm)),
    duration: mode === "walk"
      ? `${Math.round((distanceKm / 5) * 60)} min`
      : mode === "bike"
      ? `${Math.round((distanceKm / 20) * 60)} min`
      : mode === "auto"
      ? `${Math.round((distanceKm / 18) * 60)} min`
      : mode === "bus"
      ? `${Math.round((distanceKm / 15) * 60)} min`
      : `${Math.round((distanceKm / 30) * 60)} min`
  }))
}

// ─── Sort by Proximity ────────────────────────────────────────────────
export function sortByProximity(places, anchorLat, anchorLng) {
  if (!places || !anchorLat || !anchorLng) return places || []
  return [...places]
    .map((p) => ({
      ...p,
      distanceKm: calculateDistanceKm(anchorLat, anchorLng, p.lat, p.lng)
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
}

// ─── Overpass API Category Mapping ──────────────────────────────────────
const OVERPASS_CATEGORY_QUERIES = {
  cafes: `node["amenity"="cafe"](around:{radius},{lat},{lng});`,
  restaurants: `node["amenity"="restaurant"](around:{radius},{lat},{lng});`,
  attractions: `(
    node["tourism"="attraction"](around:{radius},{lat},{lng});
    node["tourism"="museum"](around:{radius},{lat},{lng});
    node["tourism"="viewpoint"](around:{radius},{lat},{lng});
    node["historic"](around:{radius},{lat},{lng});
  );`,
  hotels: `(
    node["tourism"="hotel"](around:{radius},{lat},{lng});
    node["tourism"="guest_house"](around:{radius},{lat},{lng});
    node["tourism"="hostel"](around:{radius},{lat},{lng});
  );`,
  activities: `(
    node["leisure"="park"](around:{radius},{lat},{lng});
    node["leisure"="water_park"](around:{radius},{lat},{lng});
    node["leisure"="beach_resort"](around:{radius},{lat},{lng});
    node["sport"](around:{radius},{lat},{lng});
    node["natural"="beach"](around:{radius},{lat},{lng});
  );`,
  fuel: `node["amenity"="fuel"](around:{radius},{lat},{lng});`,
  medical: `(
    node["amenity"="hospital"](around:{radius},{lat},{lng});
    node["amenity"="pharmacy"](around:{radius},{lat},{lng});
    node["amenity"="clinic"](around:{radius},{lat},{lng});
  );`
}

const CATEGORY_META = {
  cafes: { emoji: "☕", color: "#f59e0b", label: "Cafe" },
  restaurants: { emoji: "🍽️", color: "#ef4444", label: "Restaurant" },
  attractions: { emoji: "🏛️", color: "#8b5cf6", label: "Attraction" },
  hotels: { emoji: "🏨", color: "#6366f1", label: "Hotel" },
  activities: { emoji: "🎭", color: "#10b981", label: "Activity" },
  fuel: { emoji: "⛽", color: "#14b8a6", label: "Fuel Station" },
  medical: { emoji: "🏥", color: "#ec4899", label: "Medical" }
}

export { CATEGORY_META }

// ─── Result Cache ────────────────────────────────────────────────────────
const poiCache = new Map()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

function getCacheKey(lat, lng, category, radius) {
  // Round coords to 3 decimal places for cache grouping (~111m precision)
  return `${lat.toFixed(3)}_${lng.toFixed(3)}_${category}_${radius}`
}

function getCachedResult(key) {
  const entry = poiCache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    poiCache.delete(key)
    return null
  }
  return entry.data
}

function setCachedResult(key, data) {
  poiCache.set(key, { data, timestamp: Date.now() })
  // Evict old entries if cache grows too large
  if (poiCache.size > 50) {
    const oldestKey = poiCache.keys().next().value
    poiCache.delete(oldestKey)
  }
}

// ─── Fetch Nearby POIs via Overpass API ──────────────────────────────────
export async function fetchNearbyPOIs(lat, lng, category = "cafes", radiusMeters = 5000) {
  if (!lat || !lng) return []

  const cacheKey = getCacheKey(lat, lng, category, radiusMeters)
  const cached = getCachedResult(cacheKey)
  if (cached) return cached

  const queryTemplate = OVERPASS_CATEGORY_QUERIES[category]
  if (!queryTemplate) return []

  const query = queryTemplate
    .replace(/{lat}/g, lat.toString())
    .replace(/{lng}/g, lng.toString())
    .replace(/{radius}/g, radiusMeters.toString())

  const overpassQuery = `[out:json][timeout:15];${query}out body 25;`

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(overpassQuery)}`
    })

    if (!res.ok) {
      console.warn(`Overpass API returned ${res.status} for ${category}`)
      return []
    }

    const data = await res.json()
    const meta = CATEGORY_META[category] || { emoji: "📍", color: "#6b7280", label: category }

    const places = (data.elements || [])
      .filter((el) => el.lat && el.lon && el.tags?.name)
      .map((el) => {
        const dist = calculateDistanceKm(lat, lng, el.lat, el.lon)
        const ring = getDistanceRing(dist)
        return {
          id: `overpass-${el.id}`,
          name: el.tags.name,
          lat: el.lat,
          lng: el.lon,
          category: category,
          categoryLabel: meta.label,
          emoji: meta.emoji,
          color: meta.color,
          distanceKm: dist,
          distanceRing: ring,
          estimatedCabCost: estimateTransportCost(dist, "cab"),
          estimatedAutoCost: estimateTransportCost(dist, "auto"),
          rating: el.tags["stars"] || el.tags["rating"] || null,
          cuisine: el.tags["cuisine"] || null,
          phone: el.tags["phone"] || el.tags["contact:phone"] || null,
          website: el.tags["website"] || el.tags["contact:website"] || null,
          openingHours: el.tags["opening_hours"] || null,
          address: el.tags["addr:full"] || el.tags["addr:street"]
            ? `${el.tags["addr:street"] || ""} ${el.tags["addr:housenumber"] || ""}`.trim()
            : null
        }
      })
      .sort((a, b) => a.distanceKm - b.distanceKm)

    setCachedResult(cacheKey, places)
    return places
  } catch (err) {
    console.error(`Overpass fetch failed for ${category}:`, err)
    return []
  }
}

// ─── Fetch All Categories in Parallel ────────────────────────────────────
export async function fetchAllNearbyCategories(lat, lng, radiusMeters = 5000, categories = ["cafes", "restaurants", "attractions", "hotels", "activities"]) {
  const results = {}
  const promises = categories.map(async (cat) => {
    const places = await fetchNearbyPOIs(lat, lng, cat, radiusMeters)
    results[cat] = places
  })
  await Promise.allSettled(promises)
  return results
}

// ─── Debounce Utility ────────────────────────────────────────────────────
export function createDebouncedFetcher(delayMs = 500) {
  let timeoutId = null
  return function debouncedFetch(fetchFn) {
    return new Promise((resolve) => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(async () => {
        const result = await fetchFn()
        resolve(result)
      }, delayMs)
    })
  }
}

// ─── Proximity Rings Configuration ──────────────────────────────────────
export const PROXIMITY_RINGS = [
  { radiusKm: 1, color: "#22c55e", opacity: 0.08, label: "1 km" },
  { radiusKm: 3, color: "#3b82f6", opacity: 0.06, label: "3 km" },
  { radiusKm: 5, color: "#f59e0b", opacity: 0.04, label: "5 km" },
  { radiusKm: 10, color: "#ef4444", opacity: 0.03, label: "10 km" }
]
