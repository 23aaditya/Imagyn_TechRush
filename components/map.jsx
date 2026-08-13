"use client"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import L from "leaflet"
import { useTrip } from "@/context/trip-context"
import {
  fetchNearbyPOIs,
  calculateDistanceKm,
  estimateTransportCost,
  getAllTransportEstimates,
  getDistanceRing,
  CATEGORY_META,
  PROXIMITY_RINGS
} from "@/lib/geo-engine"
import {
  Search,
  MapPin,
  Navigation,
  Car,
  Bus,
  Train,
  Bike,
  Footprints,
  Hotel,
  Coffee,
  UtensilsCrossed,
  Fuel,
  Stethoscope,
  Home,
  X,
  Layers,
  Sparkles,
  Maximize2,
  Compass,
  Heart,
  CloudSun,
  Zap,
  Clock,
  Coins,
  Plus,
  Check,
  TrendingUp,
  AlertTriangle,
  Eye,
  Route,
  SlidersHorizontal,
  ChevronRight,
  Loader2,
  LocateFixed,
  Building2,
  Landmark,
  Theater,
  Star,
  Trash2
} from "lucide-react"

// ─── Tile Layer Configurations ──────────────────────────────────────────
const TILE_LAYERS = {
  voyager: {
    name: "Voyager",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
  },
  streets: {
    name: "Streets",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  satellite: {
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri'
  }
}

// ─── Transit Mode Configurations ────────────────────────────────────────
const TRANSIT_MODES = [
  { id: "car", label: "Cab / Car", icon: Car, speedKmh: 35 },
  { id: "bus", label: "Bus", icon: Bus, speedKmh: 22 },
  { id: "transit", label: "Metro / Train", icon: Train, speedKmh: 30 },
  { id: "bike", label: "Bike", icon: Bike, speedKmh: 24 },
  { id: "walk", label: "Walk", icon: Footprints, speedKmh: 5.5 }
]

// ─── Curated Unique Photos by Category ───────────────────────────────
const DISCOVERY_CATEGORY_PHOTOS = {
  cafes: [
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&auto=format&fit=crop&q=80"
  ],
  restaurants: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=80"
  ],
  attractions: [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80"
  ],
  hotels: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80"
  ]
}

function getCategoryPhoto(place) {
  if (!place) return "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80"
  if (place.img) return place.img
  if (place.images && place.images.length > 0) return place.images[0]
  const cat = place.category || "cafes"
  const photoList = DISCOVERY_CATEGORY_PHOTOS[cat] || DISCOVERY_CATEGORY_PHOTOS.cafes
  const nameStr = place.name || place.title || ""
  let hash = 0
  for (let i = 0; i < nameStr.length; i++) hash += nameStr.charCodeAt(i)
  return photoList[Math.abs(hash) % photoList.length]
}

// ─── Proximity Distance Rings ───────────────────────────────────────────
const DISCOVERY_CATEGORIES = [
  { id: "cafes", label: "Cafes", icon: Coffee, color: "#f59e0b", emoji: "☕" },
  { id: "restaurants", label: "Restaurants", icon: UtensilsCrossed, color: "#ef4444", emoji: "🍽️" },
  { id: "attractions", label: "Attractions", icon: Landmark, color: "#E60023", emoji: "🏛️" },
  { id: "hotels", label: "Hotels", icon: Hotel, color: "#6366f1", emoji: "🏨" },
  { id: "activities", label: "Activities", icon: Theater, color: "#10b981", emoji: "🎭" },
  { id: "fuel", label: "Fuel", icon: Fuel, color: "#14b8a6", emoji: "⛽" },
  { id: "medical", label: "Medical", icon: Stethoscope, color: "#ec4899", emoji: "🏥" }
]

// ─── Smart Search Chips ──────────────────────────────────────────────────
const SMART_SEARCH_CHIPS = ["Hotels", "Cafes", "Beach", "Restaurants", "Attractions"]

// ─── Day Color Palette (for Itinerary Mode route lines) ─────────────────
const DAY_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"]

export function TripMap({ spots = [], nearbyPlaces = [], hoveredSpotId, onSpotClick }) {
  const {
    itinerary,
    addSpotToItinerary,
    reorderDayActivities,
    activeStay,
    setActiveStay,
    baseStay,
    setBaseStay,
    destination,
    mapMode,
    setMapMode,
    discoveredPlaces,
    setDiscoveredPlaces,
    discoveryRadius,
    setDiscoveryRadius,
    activeDiscoveryCategory,
    setActiveDiscoveryCategory,
    addDiscoveredPlaceToItinerary
  } = useTrip()

  // ─── Refs ───────────────────────────────────────────────────────────────
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const tileLayerRef = useRef(null)
  const markersRef = useRef([])
  const nearbyMarkersRef = useRef([])
  const poiMarkersRef = useRef([])
  const discoveryMarkersRef = useRef([])
  const searchMarkerRef = useRef(null)
  const stayMarkerRef = useRef(null)
  const polylineRef = useRef(null)
  const stayLinesRef = useRef([])
  const proximityRingsRef = useRef([])
  const discoveryFetchRef = useRef(null)
  const routeAnimTimerRef = useRef(null)

  // ─── State ──────────────────────────────────────────────────────────────
  const [activeStyle, setActiveStyle] = useState("voyager")
  const [selectedTransit, setSelectedTransit] = useState("car")
  const [activeDayFilter, setActiveDayFilter] = useState("all")
  const [mapSearchQuery, setMapSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [showResultsDropdown, setShowResultsDropdown] = useState(false)
  const [isAddingStayMode, setIsAddingStayMode] = useState(false)
  const [wishlist, setWishlist] = useState([])
  const [selectedMarkerSpot, setSelectedMarkerSpot] = useState(null)
  const [optimizationAlertDismissed, setOptimizationAlertDismissed] = useState(false)
  const [routePathCoords, setRoutePathCoords] = useState([])
  const [realRouteLegs, setRealRouteLegs] = useState([])
  const [isRoutingLoading, setIsRoutingLoading] = useState(false)
  const [isDiscoveryLoading, setIsDiscoveryLoading] = useState(false)
  const [discoveryPanelOpen, setDiscoveryPanelOpen] = useState(true)
  const [selectedDiscoveryPlace, setSelectedDiscoveryPlace] = useState(null)
  const [addToDayIndex, setAddToDayIndex] = useState(0)
  const [searchedLocation, setSearchedLocation] = useState(null)

  // ─── Computed: Active discovered places for the selected category ──────
  const activeDiscoveredPlaces = useMemo(() => {
    return discoveredPlaces?.[activeDiscoveryCategory] || []
  }, [discoveredPlaces, activeDiscoveryCategory])

  // ─── Filter spots by Day ──────────────────────────────────────────────
  const visibleSpots = useMemo(() => {
    if (activeDayFilter === "all") return spots
    const dayNum = parseInt(activeDayFilter, 10)
    const dayData = itinerary?.find((d) => d.day === dayNum)
    return dayData ? (dayData.activities || []) : spots
  }, [spots, itinerary, activeDayFilter])

  // ─── Fetch OSRM route (Itinerary Mode only) ──────────────────────────
  useEffect(() => {
    if (mapMode !== "itinerary") return

    const validSpots = visibleSpots.filter((s) => s.lat && s.lng)
    if (validSpots.length < 2) {
      setRoutePathCoords([])
      setRealRouteLegs([])
      return
    }

    const modeConfig = TRANSIT_MODES.find((m) => m.id === selectedTransit) || TRANSIT_MODES[0]

    // Immediate fallback straight-line calculations
    const fallbackLegs = []
    for (let i = 0; i < validSpots.length - 1; i++) {
      const from = validSpots[i]
      const to = validSpots[i + 1]
      const dist = calculateDistanceKm(from.lat, from.lng, to.lat, to.lng)
      const durationMins = Math.max(2, Math.round((dist / modeConfig.speedKmh) * 60))
      fallbackLegs.push({
        from: from.title,
        to: to.title,
        distanceKm: dist,
        durationMins,
        traffic: dist > 5 ? "🔴 Heavy" : dist > 2 ? "🟡 Moderate" : "🟢 Low",
        mode: modeConfig.label
      })
    }
    setRoutePathCoords(validSpots.map((s) => [s.lat, s.lng]))
    setRealRouteLegs(fallbackLegs)

    let isCancelled = false
    setIsRoutingLoading(true)

    const profile = selectedTransit === "bike" ? "biking" : selectedTransit === "walk" ? "foot" : "driving"
    const coordsStr = validSpots.map((s) => `${s.lng},${s.lat}`).join(";")
    const osrmUrl = `https://router.project-osrm.org/route/v1/${profile}/${coordsStr}?overview=full&geometries=geojson`

    fetch(osrmUrl)
      .then((res) => res.json())
      .then((data) => {
        if (isCancelled) return
        if (data.code === "Ok" && data.routes && data.routes[0]) {
          const route = data.routes[0]
          const roadCoords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng])
          setRoutePathCoords(roadCoords)

          if (route.legs && route.legs.length === validSpots.length - 1) {
            const realLegs = route.legs.map((leg, i) => {
              const distKm = Number((leg.distance / 1000).toFixed(1))
              const durationMins = Math.max(1, Math.round(leg.duration / 60))
              return {
                from: validSpots[i].title,
                to: validSpots[i + 1].title,
                distanceKm: distKm,
                durationMins,
                traffic: durationMins > 30 ? "🔴 Heavy" : durationMins > 15 ? "🟡 Moderate" : "🟢 Low",
                mode: modeConfig.label
              }
            })
            setRealRouteLegs(realLegs)
          }
        }
      })
      .catch((err) => {
        console.warn("OSRM routing fetch failed, falling back to straight-line:", err)
      })
      .finally(() => {
        if (!isCancelled) setIsRoutingLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [visibleSpots, selectedTransit, mapMode])

  // ─── Total route stats ────────────────────────────────────────────────
  const totalStats = useMemo(() => {
    const totalKm = realRouteLegs.reduce((sum, leg) => sum + leg.distanceKm, 0)
    const totalMins = realRouteLegs.reduce((sum, leg) => sum + leg.durationMins, 0)
    const hrs = Math.floor(totalMins / 60)
    const mins = totalMins % 60
    return {
      distanceKm: Number(totalKm.toFixed(1)),
      durationText: hrs > 0 ? `${hrs}h ${mins}m` : `${mins} mins`
    }
  }, [realRouteLegs])

  // ─── Fetch Nearby POIs when Stay or Category changes (Discovery Mode) ─
  const fetchDiscoveryPOIs = useCallback(async () => {
    const stay = activeStay
    if (!stay?.lat || !stay?.lng) return

    setIsDiscoveryLoading(true)
    try {
      const places = await fetchNearbyPOIs(stay.lat, stay.lng, activeDiscoveryCategory, discoveryRadius)
      setDiscoveredPlaces(activeDiscoveryCategory, places)
    } catch (err) {
      console.error("Discovery fetch failed:", err)
    } finally {
      setIsDiscoveryLoading(false)
    }
  }, [activeStay, activeDiscoveryCategory, discoveryRadius, setDiscoveredPlaces])

  useEffect(() => {
    if (mapMode !== "discovery") return
    if (!activeStay?.lat || !activeStay?.lng) return

    // Debounce the fetch
    if (discoveryFetchRef.current) clearTimeout(discoveryFetchRef.current)
    discoveryFetchRef.current = setTimeout(() => {
      fetchDiscoveryPOIs()
    }, 400)

    return () => {
      if (discoveryFetchRef.current) clearTimeout(discoveryFetchRef.current)
    }
  }, [activeStay, activeDiscoveryCategory, discoveryRadius, mapMode, fetchDiscoveryPOIs])

  // Ref to avoid stale closure in Leaflet map click listener
  const isAddingStayModeRef = useRef(isAddingStayMode)
  useEffect(() => {
    isAddingStayModeRef.current = isAddingStayMode
    const mapContainer = mapContainerRef.current
    if (mapContainer) {
      if (isAddingStayMode) {
        mapContainer.style.cursor = "crosshair"
      } else {
        mapContainer.style.cursor = ""
      }
    }
  }, [isAddingStayMode])

  // ─── Initialize Leaflet Map ───────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapInstanceRef.current) return

    const initialLat = activeStay?.lat || spots[0]?.lat || 15.5553
    const initialLng = activeStay?.lng || spots[0]?.lng || 73.7517

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: false
    })

    map.on("click", (e) => {
      if (isAddingStayModeRef.current) {
        const lat = e.latlng.lat
        const lng = e.latlng.lng
        
        // Immediately set initial stay state
        setActiveStay({
          name: "Pinned Stay / Hotel",
          lat,
          lng,
          address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
        })
        setIsAddingStayMode(false)

        // Reverse geocode to fetch real location/hotel name
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          .then((res) => res.json())
          .then((data) => {
            if (data && data.display_name) {
              const placeName = data.name || data.display_name.split(",")[0] || "Selected Stay"
              setActiveStay({
                name: placeName,
                lat,
                lng,
                address: data.display_name
              })
            }
          })
          .catch((err) => console.warn("Reverse geocoding failed:", err))
      } else {
        setSelectedMarkerSpot(null)
        setSelectedDiscoveryPlace(null)
      }
    })

    const tileConfig = TILE_LAYERS[activeStyle] || TILE_LAYERS.voyager
    const layer = L.tileLayer(tileConfig.url, {
      maxZoom: 19,
      attribution: tileConfig.attribution
    }).addTo(map)

    tileLayerRef.current = layer
    mapInstanceRef.current = map

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize()
    })
    resizeObserver.observe(mapContainerRef.current)

    const t1 = setTimeout(() => map.invalidateSize(), 200)
    return () => {
      clearTimeout(t1)
      resizeObserver.disconnect()
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // ─── Switch Tile Layer ────────────────────────────────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current)
    }

    const tileConfig = TILE_LAYERS[activeStyle] || TILE_LAYERS.voyager
    const layer = L.tileLayer(tileConfig.url, {
      maxZoom: 19,
      attribution: tileConfig.attribution
    }).addTo(map)

    tileLayerRef.current = layer
  }, [activeStyle])

  // ─── Map Search Handler ───────────────────────────────────────────────
  const handleMapLocationSearch = async (queryToSearch) => {
    const q = queryToSearch || mapSearchQuery
    if (!q.trim()) return
    setIsSearching(true)
    setShowResultsDropdown(false)

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q.trim())}&limit=5`
      )
      if (res.ok) {
        const data = await res.json()
        setSearchResults(data)
        if (data.length > 0) {
          setShowResultsDropdown(true)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectSearchResult = (result) => {
    const map = mapInstanceRef.current
    if (!map) return

    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)
    const placeName = result.display_name.split(",")[0]

    setShowResultsDropdown(false)

    if (searchMarkerRef.current) {
      map.removeLayer(searchMarkerRef.current)
    }

    const searchIcon = L.divIcon({
      className: "search-result-marker",
      html: `
        <div style="position: relative; width: 36px; height: 44px; filter: drop-shadow(0px 4px 10px rgba(90,140,178,0.6));">
          <svg viewBox="0 0 384 512" width="36" height="44" fill="#5B8DEF">
            <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
          </svg>
          <div style="position: absolute; top: 8px; left: 50%; transform: translateX(-50%); font-size: 14px;">🔍</div>
        </div>
      `,
      iconSize: [36, 44],
      iconAnchor: [18, 44]
    })

    const marker = L.marker([lat, lng], { icon: searchIcon }).addTo(map)
    searchMarkerRef.current = marker

    setSearchedLocation({
      title: placeName,
      fullAddress: result.display_name,
      lat,
      lng
    })

    setSelectedMarkerSpot({
      title: placeName,
      cost: "₹500",
      numericCost: 500,
      desc: result.display_name,
      lat,
      lng,
      isSearchedLocation: true
    })

    map.flyTo([lat, lng], 14, { duration: 1.2 })
  }

  const handleClearSearchedLocation = () => {
    const map = mapInstanceRef.current
    if (searchMarkerRef.current && map) {
      try {
        map.removeLayer(searchMarkerRef.current)
      } catch (e) {
        console.warn(e)
      }
      searchMarkerRef.current = null
    }
    setSearchedLocation(null)
    setMapSearchQuery("")
    setSearchResults([])
    setShowResultsDropdown(false)
    if (selectedMarkerSpot?.isSearchedLocation) {
      setSelectedMarkerSpot(null)
    }
  }

  // ─── Render Map Layers (Markers, Routes, Rings) ───────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    if (routeAnimTimerRef.current) {
      clearInterval(routeAnimTimerRef.current)
      routeAnimTimerRef.current = null
    }

    // Clear existing layers
    markersRef.current.forEach((m) => map.removeLayer(m))
    markersRef.current = []
    poiMarkersRef.current.forEach((m) => map.removeLayer(m))
    poiMarkersRef.current = []
    discoveryMarkersRef.current.forEach((m) => map.removeLayer(m))
    discoveryMarkersRef.current = []
    stayLinesRef.current.forEach((l) => map.removeLayer(l))
    stayLinesRef.current = []
    proximityRingsRef.current.forEach((r) => map.removeLayer(r))
    proximityRingsRef.current = []

    if (polylineRef.current) {
      map.removeLayer(polylineRef.current)
      polylineRef.current = null
    }
    if (stayMarkerRef.current) {
      map.removeLayer(stayMarkerRef.current)
      stayMarkerRef.current = null
    }

    // ── Stay Anchor Marker (Red Pin Theme) ───────────────────────────────
    if (activeStay && activeStay.lat && activeStay.lng) {
      const stayIcon = L.divIcon({
        className: "stay-anchor-marker",
        html: `
          <div style="position: relative; width: 44px; height: 52px; filter: drop-shadow(0px 6px 14px rgba(239,68,68,0.5));">
            <svg viewBox="0 0 384 512" width="44" height="52" fill="#EF4444">
              <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
            </svg>
            <div style="position: absolute; top: 12px; left: 50%; transform: translateX(-50%); width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
            <div style="
              position: absolute; top: -4px; left: 50%; transform: translateX(-50%);
              width: 52px; height: 52px; border-radius: 50%;
              border: 2px solid rgba(239,68,68,0.4);
              animation: stayPulse 2s ease-in-out infinite;
            "></div>
          </div>
        `,
        iconSize: [44, 52],
        iconAnchor: [22, 52]
      })

      const stayMarker = L.marker([activeStay.lat, activeStay.lng], { icon: stayIcon, zIndexOffset: 1000 }).addTo(map)
      stayMarker.on("click", () => {
        setSelectedMarkerSpot({
          title: activeStay.name || "My Base Stay",
          desc: activeStay.address || `${activeStay.lat.toFixed(4)}, ${activeStay.lng.toFixed(4)}`,
          lat: activeStay.lat,
          lng: activeStay.lng,
          isStay: true
        })
      })
      stayMarkerRef.current = stayMarker
    }

    // ══════════════════════════════════════════════════════════════════════
    // DISCOVERY MODE RENDERING
    // ══════════════════════════════════════════════════════════════════════
    if (mapMode === "discovery" && activeStay?.lat && activeStay?.lng) {
      // ── Proximity Rings ──────────────────────────────────────────────
      const maxRingKm = discoveryRadius / 1000
      PROXIMITY_RINGS.forEach((ring) => {
        if (ring.radiusKm <= maxRingKm) {
          const circle = L.circle([activeStay.lat, activeStay.lng], {
            radius: ring.radiusKm * 1000,
            color: "#8E5AB5",
            fillColor: "#8E5AB5",
            fillOpacity: ring.opacity * 0.5,
            weight: 1,
            dashArray: "6, 4",
            interactive: false
          }).addTo(map)
          proximityRingsRef.current.push(circle)
        }
      })

      // ── Discovery POI Markers (Plain White Button Format, No Yellow Border!) ──
      const catMeta = CATEGORY_META[activeDiscoveryCategory] || { emoji: "📍", color: "#8E5AB5" }
      activeDiscoveredPlaces.forEach((place, idx) => {
        if (!place.lat || !place.lng) return

        const isSelected = selectedDiscoveryPlace?.id === place.id

        const poiIcon = L.divIcon({
          className: "discovery-poi-marker",
          html: `
            <div style="
              display: inline-flex; align-items: center; gap: 6px;
              background: #ffffff; border: ${isSelected ? '2px solid #8E5AB5' : '1px solid #e5e5e5'};
              padding: 5px 12px; border-radius: 12px;
              box-shadow: ${isSelected ? '0 4px 16px rgba(142,90,181,0.3)' : '0 2px 8px rgba(0,0,0,0.08)'};
              font-family: 'Instrument Sans', system-ui, sans-serif;
              transform: ${isSelected ? 'scale(1.08)' : 'scale(1)'};
              transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
              white-space: nowrap; cursor: pointer;
            ">
              <span style="font-size: 13px; line-height: 1;">${catMeta.emoji}</span>
              <span style="font-size: 11px; font-weight: 500; color: #100B12; max-width: 120px; overflow: hidden; text-overflow: ellipsis;">${place.name}</span>
            </div>
          `,
          iconSize: [130, 34],
          iconAnchor: [20, 17]
        })

        const marker = L.marker([place.lat, place.lng], { icon: poiIcon }).addTo(map)
        marker.on("click", () => {
          setSelectedDiscoveryPlace(place)
          setSelectedMarkerSpot(null)
        })
        discoveryMarkersRef.current.push(marker)
      })

      // ── Dashed lines from Stay to discovered places ──────────────────
      activeDiscoveredPlaces.slice(0, 8).forEach((place) => {
        if (!place.lat || !place.lng) return
        const line = L.polyline(
          [[activeStay.lat, activeStay.lng], [place.lat, place.lng]],
          { color: catMeta.color, weight: 1.5, dashArray: "4, 6", opacity: 0.35, interactive: false }
        ).addTo(map)
        stayLinesRef.current.push(line)
      })
    }

    // ══════════════════════════════════════════════════════════════════════
    // ITINERARY MODE RENDERING
    // ══════════════════════════════════════════════════════════════════════
    if (mapMode === "itinerary") {
      const validSpots = visibleSpots.filter((s) => s.lat && s.lng)

      // ── Numbered Spot Markers ────────────────────────────────────────
      validSpots.forEach((spot, idx) => {
        const isHovered = spot.id === hoveredSpotId
        // Color code by day if showing all days
        let markerColor = "#00356B"
        if (activeDayFilter === "all" && itinerary) {
          for (let d = 0; d < itinerary.length; d++) {
            if (itinerary[d].activities?.some((a) => a.id === spot.id)) {
              markerColor = DAY_COLORS[d % DAY_COLORS.length]
              break
            }
          }
        }
        if (isHovered) markerColor = "#EF4444"

        const customIcon = L.divIcon({
          className: "custom-spot-marker",
          html: `
            <div style="
              display: inline-flex; align-items: center; gap: 6px;
              background: #00356B; border: 2px solid white;
              padding: 4px 10px; border-radius: 20px;
              box-shadow: 0 4px 14px rgba(0,53,107,0.4);
              color: white; font-family: 'Instrument Sans', system-ui, sans-serif;
              transform: ${isHovered ? 'scale(1.15)' : 'scale(1)'};
              transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
              white-space: nowrap; cursor: pointer;
            ">
              <span style="
                width: 18px; height: 18px; border-radius: 50%;
                background: white; color: #00356B; font-weight: 800;
                font-size: 10px; display: flex; align-items: center; justify-content: center;
              ">${idx + 1}</span>
              <span style="font-size: 11px; font-weight: 600; max-width: 110px; overflow: hidden; text-overflow: ellipsis;">${spot.title}</span>
            </div>
          `,
          iconSize: [140, 32],
          iconAnchor: [20, 16]
        })

        const marker = L.marker([spot.lat, spot.lng], { icon: customIcon }).addTo(map)
        marker.on("click", () => {
          setSelectedMarkerSpot(spot)
          onSpotClick && onSpotClick(spot.id)
        })
        markersRef.current.push(marker)
      })

      // ── Stay-to-First/Last-Stop Connectors ───────────────────────────
      if (activeStay?.lat && activeStay?.lng && validSpots.length > 0) {
        const firstSpot = validSpots[0]
        const lastSpot = validSpots[validSpots.length - 1]

        // Stay → First stop
        const lineToFirst = L.polyline(
          [[activeStay.lat, activeStay.lng], [firstSpot.lat, firstSpot.lng]],
          { color: "#5B8DEF", weight: 2.5, dashArray: "6, 8", opacity: 0.5 }
        ).addTo(map)
        stayLinesRef.current.push(lineToFirst)

        // Last stop → Stay
        const lineFromLast = L.polyline(
          [[lastSpot.lat, lastSpot.lng], [activeStay.lat, activeStay.lng]],
          { color: "#5B8DEF", weight: 2.5, dashArray: "6, 8", opacity: 0.5 }
        ).addTo(map)
        stayLinesRef.current.push(lineFromLast)
      }

      // ── OSRM Route Polyline (Progressive Route Draw & Morphing Animation) ──
      const validCoords = (routePathCoords || []).filter(
        (pt) => Array.isArray(pt) && pt.length >= 2 && typeof pt[0] === "number" && typeof pt[1] === "number" && !isNaN(pt[0]) && !isNaN(pt[1])
      )

      if (validCoords.length > 1) {
        const isReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

        if (isReducedMotion) {
          try {
            const glowLine = L.polyline(validCoords, { color: "#8493A5", weight: 8, opacity: 0.3, lineCap: "round", lineJoin: "round" })
            const mainLine = L.polyline(validCoords, { color: "#2563EB", weight: 4, opacity: 0.9, lineCap: "round", lineJoin: "round" })
            const group = L.layerGroup([glowLine, mainLine]).addTo(map)
            polylineRef.current = group
          } catch (err) {
            console.warn("Failed to render static polyline:", err)
          }
        } else {
          let currentStep = 0
          const totalSteps = 20
          routeAnimTimerRef.current = setInterval(() => {
            const currentMap = mapInstanceRef.current
            if (!currentMap) {
              if (routeAnimTimerRef.current) {
                clearInterval(routeAnimTimerRef.current)
                routeAnimTimerRef.current = null
              }
              return
            }

            currentStep++
            const progress = currentStep / totalSteps
            const sliceCount = Math.max(2, Math.floor(validCoords.length * progress))
            const sliceCoords = validCoords.slice(0, sliceCount)

            if (sliceCoords.length >= 2) {
              try {
                if (polylineRef.current && currentMap.hasLayer && currentMap.hasLayer(polylineRef.current)) {
                  currentMap.removeLayer(polylineRef.current)
                }

                const glowLine = L.polyline(sliceCoords, { color: "#8493A5", weight: 8, opacity: 0.3, lineCap: "round", lineJoin: "round" })
                const mainLine = L.polyline(sliceCoords, { color: "#2563EB", weight: 4, opacity: 0.9, lineCap: "round", lineJoin: "round" })
                const group = L.layerGroup([glowLine, mainLine]).addTo(currentMap)
                polylineRef.current = group
              } catch (err) {
                console.warn("Polyline draw step exception:", err)
              }
            }

            if (currentStep >= totalSteps) {
              if (routeAnimTimerRef.current) {
                clearInterval(routeAnimTimerRef.current)
                routeAnimTimerRef.current = null
              }
            }
          }, 20)
        }
      }

      return () => {
        if (routeAnimTimerRef.current) {
          clearInterval(routeAnimTimerRef.current)
          routeAnimTimerRef.current = null
        }
      }
    }
  }, [visibleSpots, nearbyPlaces, hoveredSpotId, activeStay, routePathCoords, mapMode, activeDiscoveredPlaces, activeDiscoveryCategory, selectedDiscoveryPlace, activeDayFilter, itinerary, discoveryRadius])

  // ─── Smoothly focus map when hoveredSpotId or selectedMarkerSpot changes ─
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return
    const targetSpot = visibleSpots.find((s) => s.id === hoveredSpotId) || selectedMarkerSpot
    if (targetSpot && targetSpot.lat && targetSpot.lng) {
      map.flyTo([targetSpot.lat, targetSpot.lng], Math.max(map.getZoom(), 14), {
        duration: 0.8,
        easeLinearity: 0.25
      })
    }
  }, [hoveredSpotId, selectedMarkerSpot, visibleSpots])

  // ─── Fit map to content ───────────────────────────────────────────────
  const handleZoomIntoPlaces = () => {
    const map = mapInstanceRef.current
    if (!map) return

    const coords = [
      ...visibleSpots.filter((s) => s.lat && s.lng).map((s) => [s.lat, s.lng]),
      ...(activeStay?.lat && activeStay?.lng ? [[activeStay.lat, activeStay.lng]] : []),
      ...(mapMode === "discovery" ? activeDiscoveredPlaces.filter((p) => p.lat && p.lng).map((p) => [p.lat, p.lng]) : []),
      ...nearbyPlaces.filter((p) => p.lat && p.lng).map((p) => [p.lat, p.lng])
    ]

    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords)
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
    }
  }

  // ─── Center on Stay ───────────────────────────────────────────────────
  const handleCenterOnStay = () => {
    const map = mapInstanceRef.current
    if (!map || !activeStay?.lat) return
    map.flyTo([activeStay.lat, activeStay.lng], 14, { duration: 1 })
  }

  // ─── Handle adding discovered place to itinerary ──────────────────────
  const handleAddDiscoveredPlace = (place) => {
    addDiscoveredPlaceToItinerary(place, addToDayIndex)
    setSelectedDiscoveryPlace(null)
  }

  return (
    <div className="h-full w-full relative overflow-hidden rounded-none min-h-[500px] sm:min-h-[620px] bg-white flex flex-col border border-neutral-200">

      {/* ─── CSS for Animations ──────────────────────────────────────── */}
      <style>{`
        @keyframes stayPulse {
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.6; }
          50% { transform: translateX(-50%) scale(1.5); opacity: 0; }
        }
      `}</style>

      {/* ═════════════════════════════════════════════════════════════════
          1. TOP HEADER BAR — Search + Mode Toggle + Day Filter + Stay
         ═════════════════════════════════════════════════════════════════ */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-2.5 pointer-events-none">

        {/* Left: Search Bar & Smart Search Chips */}
        <div className="relative min-w-[260px] sm:min-w-[340px] pointer-events-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleMapLocationSearch()
            }}
            className="flex items-center gap-2 bg-background/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-border shadow-md"
          >
            <Search className="h-4 w-4 text-[#5B8DEF] shrink-0" />
            <input
              type="text"
              placeholder="Search location..."
              value={mapSearchQuery}
              onChange={(e) => setMapSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-foreground outline-none placeholder:text-muted-foreground"
            />
            {mapSearchQuery && (
              <button type="button" onClick={handleClearSearchedLocation} className="text-muted-foreground hover:text-rose-500" title="Remove Searched Location">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="submit"
              disabled={isSearching}
              className="rounded-xl bg-[#8d5bb3] text-white hover:bg-[#7a4aa0] font-medium text-[11px] uppercase tracking-wider px-4 py-1.5 shrink-0 cursor-pointer shadow-sm font-button"
            >
              {isSearching ? "..." : "Search"}
            </button>
          </form>

          {/* Searched Location Active Pin Badge */}
          {searchedLocation && (
            <div className="mt-2 flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#8d5bb3] text-white shadow-lg text-xs font-medium backdrop-blur-md border border-white/20">
              <span className="flex items-center gap-1.5 min-w-0 font-button">
                <span className="text-amber-300 font-bold">🔍 Pin:</span>
                <span className="font-semibold truncate max-w-[180px] sm:max-w-[220px]">{searchedLocation.title}</span>
              </span>
              <button
                type="button"
                onClick={handleClearSearchedLocation}
                className="flex items-center gap-1 bg-rose-500 hover:bg-rose-600 text-white px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all shrink-0 cursor-pointer shadow-xs font-button"
                title="Remove Searched Location Pin"
              >
                <Trash2 className="h-3 w-3" />
                Remove Pin ✕
              </button>
            </div>
          )}
          {/* Autocomplete Dropdown */}
          {showResultsDropdown && searchResults.length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-background/95 backdrop-blur-md rounded-xl border border-border shadow-xl overflow-hidden z-50 max-h-64 overflow-y-auto p-2 space-y-1.5">
              {searchResults.map((res, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-accent text-xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => handleSelectSearchResult(res)}
                    className="flex items-start gap-2 text-left flex-1 min-w-0 font-medium text-foreground cursor-pointer"
                  >
                    <MapPin className="h-4 w-4 text-[#8d5bb3] dark:text-[#86B3E6] shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{res.display_name}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const lat = parseFloat(res.lat)
                      const lng = parseFloat(res.lon)
                      const placeName = res.display_name.split(",")[0]
                      setActiveStay({ name: placeName, address: res.display_name, lat, lng })
                      setShowResultsDropdown(false)
                      mapInstanceRef.current?.flyTo([lat, lng], 14, { duration: 1.2 })
                    }}
                    className="rounded-lg bg-[#8d5bb3] text-white hover:bg-[#7a4aa0] text-[10px] font-medium px-2.5 py-1 shrink-0 cursor-pointer font-button shadow-xs"
                  >
                    Set as Stay
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Mode Toggle + Day Filter + Stay Button */}
        <div className="flex items-center gap-2 pointer-events-auto flex-wrap">

          {/* Mode Toggle Pill */}
          <div className="flex items-center bg-background/95 backdrop-blur-md p-1 rounded-xl border border-border shadow-xl">
            <button
              type="button"
              onClick={() => setMapMode("discovery")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-medium rounded-xl transition-all font-button ${
                mapMode === "discovery"
                  ? "bg-[#8d5bb3] text-white shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Discover
            </button>
            <button
              type="button"
              onClick={() => setMapMode("itinerary")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-medium rounded-xl transition-all font-button ${
                mapMode === "itinerary"
                  ? "bg-[#8d5bb3] text-white shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Route className="h-3.5 w-3.5" />
              Route
            </button>
          </div>

          {/* Day Selector (Itinerary Mode only) */}
          {mapMode === "itinerary" && (
            <div className="flex items-center gap-1 bg-background/95 backdrop-blur-md p-1 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setActiveDayFilter("all")}
                className={`px-3 py-1 text-[11px] font-medium rounded-xl transition-all font-button ${
                  activeDayFilter === "all"
                    ? "bg-[#8d5bb3] text-white shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                All
              </button>
              {itinerary?.map((d) => (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => setActiveDayFilter(d.day.toString())}
                  className={`px-3 py-1 text-[11px] font-medium rounded-xl transition-all font-button ${
                    activeDayFilter === d.day.toString()
                      ? "bg-[#8d5bb3] text-white shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  D{d.day}
                </button>
              ))}
            </div>
          )}

          {/* Add / Change Stay Button */}
          <button
            type="button"
            onClick={() => setIsAddingStayMode(!isAddingStayMode)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-xl backdrop-blur-md border transition-all cursor-pointer font-button ${
              isAddingStayMode
                ? "bg-rose-500 text-white border-rose-400 animate-pulse"
                : activeStay
                ? "bg-[#8d5bb3] text-white border-[#8d5bb3] shadow-sm"
                : "bg-background/90 text-foreground border-border hover:bg-accent"
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>{isAddingStayMode ? "Click Map to Set Stay" : activeStay ? "Change Stay ✓" : "Set Stay"}</span>
          </button>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          2. DISCOVERY CATEGORY TABS BAR (Positioned to the right of side panel)
         ═════════════════════════════════════════════════════════════════ */}
      {mapMode === "discovery" && (
        <div className={`absolute top-16 z-30 pointer-events-none transition-all duration-200 ${
          discoveryPanelOpen ? "left-76 sm:left-84 right-3" : "left-3 right-3"
        }`}>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pointer-events-auto py-1">
            {DISCOVERY_CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isActive = activeDiscoveryCategory === cat.id
              const count = discoveredPlaces?.[cat.id]?.length || 0
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveDiscoveryCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all shrink-0 cursor-pointer backdrop-blur-md border shadow-md font-button ${
                    isActive
                      ? "text-white shadow-md scale-105"
                      : "bg-white/95 text-neutral-700 border-neutral-200 hover:bg-white hover:text-neutral-900"
                  }`}
                  style={isActive ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.label}</span>
                  {count > 0 && (
                    <span className={`ml-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white/25 text-white" : "bg-neutral-100 text-neutral-800"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          3. MAIN MAP BODY — FLEX CONTAINER WITH LEFT DISCOVERY PANEL
         ═════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 h-full w-full relative overflow-hidden pt-16">
        {/* Discovery Side Panel (Left Side Outside Map) */}
        {discoveryPanelOpen && mapMode === "discovery" && (
          <div className="w-72 sm:w-80 h-full border-r border-border bg-white flex flex-col shrink-0 z-20 overflow-hidden shadow-md">
            {/* Search Radius & Top-Right Close Button Header */}
            <div className="p-3 border-b border-border bg-white">
              <div className="flex items-center justify-between mb-1.5 font-button">
                <span className="text-xs font-semibold text-foreground">Search Radius</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#E60023] font-semibold text-xs font-button">{(discoveryRadius / 1000).toFixed(0)} km</span>
                  <button
                    type="button"
                    onClick={() => setDiscoveryPanelOpen(false)}
                    className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer transition-colors"
                    title="Close Map Sidebar"
                    aria-label="Close Map Sidebar"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <input
                type="range"
                min={1000}
                max={15000}
                step={500}
                value={discoveryRadius}
                onChange={(e) => setDiscoveryRadius(parseInt(e.target.value, 10))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #E60023 ${((discoveryRadius - 1000) / 14000) * 100}%, #e5e7eb ${((discoveryRadius - 1000) / 14000) * 100}%)`
                }}
              />
            </div>

            {/* Places List (All icons removed per instructions) */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-none bg-white">
              {isDiscoveryLoading ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin text-[#E60023] mb-2" />
                  <span className="text-xs font-medium font-button">Discovering nearby places...</span>
                </div>
              ) : activeDiscoveredPlaces.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <span className="text-xs font-medium font-button">No places found</span>
                  <span className="text-[10px] mt-1 font-button text-muted-foreground">Try increasing the radius</span>
                </div>
              ) : (
                <>
                  {activeDiscoveredPlaces.map((place) => {
                    const isSelected = selectedDiscoveryPlace?.id === place.id
                    return (
                      <button
                        key={place.id}
                        type="button"
                        onClick={() => {
                          setSelectedDiscoveryPlace(place)
                          const map = mapInstanceRef.current
                          if (map) map.flyTo([place.lat, place.lng], 16, { duration: 0.8 })
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#E60023]/10 border-[#E60023] border"
                            : "hover:bg-accent border border-transparent"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-foreground line-clamp-1 font-button">{place.name}</p>
                            <div className="flex items-center gap-2 mt-1 font-button">
                              <span className="text-[10px] font-medium text-muted-foreground">
                                {place.distanceKm.toFixed(1)} km
                              </span>
                              <span className="text-[10px] font-medium text-muted-foreground">
                                ~₹{place.estimatedCabCost} cab
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-1" />
                        </div>
                      </button>
                    )
                  })}
                  {/* Bottom item with NO location icon */}
                  <div className="w-full text-left p-2.5 rounded-xl border border-transparent text-[11px] font-semibold text-foreground flex items-center justify-between font-button mt-1">
                    <span>Neugi Nagar {activeDiscoveredPlaces.length} {DISCOVERY_CATEGORIES.find((c) => c.id === activeDiscoveryCategory)?.label || "Places"} found</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Leaflet Map Canvas */}
        <div ref={mapContainerRef} className="flex-1 h-full relative z-0" />
      </div>

      {/* Collapsed panel toggle */}
      {activeStay && !discoveryPanelOpen && mapMode === "discovery" && (
        <button
          type="button"
          onClick={() => setDiscoveryPanelOpen(true)}
          className="absolute top-28 left-3 z-[1000] pointer-events-auto bg-background/95 backdrop-blur-md p-2.5 rounded-lg border border-border hover:bg-accent transition-colors"
        >
          <Sparkles className="h-4 w-4 text-[#E60023]" />
        </button>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          4. SELECTED DISCOVERY PLACE DETAIL CARD (WITH THUMBNAIL IMAGE)
         ═════════════════════════════════════════════════════════════════ */}
      {selectedDiscoveryPlace && mapMode === "discovery" && (
        <div className="absolute bottom-16 left-3 z-[1000] pointer-events-auto max-w-sm w-full font-button">
          <div className="bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-2xl space-y-2.5 relative text-[#100B12]">
            <button
              type="button"
              onClick={() => setSelectedDiscoveryPlace(null)}
              className="absolute top-3 right-3 z-10 rounded-full bg-white/80 p-1 text-neutral-600 hover:text-black shadow-xs cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Place Thumbnail Photo */}
            <div className="relative h-32 w-full rounded-xl overflow-hidden bg-neutral-100">
              <img
                src={getCategoryPhoto(selectedDiscoveryPlace)}
                alt={selectedDiscoveryPlace.name}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-2 left-2 rounded-full bg-black/60 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-medium text-white">
                {selectedDiscoveryPlace.categoryLabel || "Place Highlight"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-[#100B12] line-clamp-1 font-button">{selectedDiscoveryPlace.name}</h4>
                <p className="text-xs text-neutral-500 font-normal mt-0.5">
                  {selectedDiscoveryPlace.distanceKm?.toFixed(1)} km away • 4.8 ⭐ Rating
                </p>
              </div>
            </div>

            {/* Brief Concise Description */}
            <p className="text-xs text-neutral-600 font-normal leading-relaxed">
              {selectedDiscoveryPlace.cuisine ? `Specialty food & dining highlight.` : selectedDiscoveryPlace.address ? `Curated travel spot at ${selectedDiscoveryPlace.address}.` : `Popular local spot for dining, culture, and exploration.`}
            </p>

            {/* Transport Estimates */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
              {getAllTransportEstimates(selectedDiscoveryPlace.distanceKm).filter(t => t.mode !== "bus").map((t) => (
                <div key={t.mode} className="flex items-center gap-1 bg-neutral-100 px-2 py-1 rounded-lg shrink-0 text-[11px]">
                  <span className="font-normal text-neutral-700">{t.label}</span>
                  <span className="font-medium text-[#100B12]">₹{t.cost}</span>
                  <span className="text-neutral-500 text-[10px]">{t.duration}</span>
                </div>
              ))}
            </div>

            {/* Add to Itinerary */}
            <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
              <select
                value={addToDayIndex}
                onChange={(e) => setAddToDayIndex(parseInt(e.target.value, 10))}
                className="text-xs font-normal bg-neutral-100 rounded-xl px-2.5 py-2 border-none outline-none w-20 text-center font-button text-[#100B12] cursor-pointer"
              >
                {itinerary?.length > 0 ? (
                  itinerary.map((d, i) => (
                    <option key={d.day} value={i}>Day {d.day}</option>
                  ))
                ) : (
                  <option value={0}>Day 1</option>
                )}
              </select>
              <button
                type="button"
                onClick={() => handleAddDiscoveredPlace(selectedDiscoveryPlace)}
                className="flex-1 rounded-xl bg-[#DDD0EA] text-[#100B12] hover:bg-[#C8B8DD] font-normal text-xs py-2 flex items-center justify-center gap-1.5 cursor-pointer transition-all font-button border-none"
              >
                <Plus className="h-3.5 w-3.5" />
                Add to Itinerary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          5. SELECTED ITINERARY SPOT INFO CARD (WITH THUMBNAIL IMAGE)
         ═════════════════════════════════════════════════════════════════ */}
      {selectedMarkerSpot && !selectedDiscoveryPlace && (
        <div className="absolute bottom-16 left-3 z-[1000] pointer-events-auto max-w-sm w-full font-button">
          <div className="bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-2xl space-y-2.5 relative text-[#100B12]">
            <button
              type="button"
              onClick={() => setSelectedMarkerSpot(null)}
              className="absolute top-3 right-3 z-10 rounded-full bg-white/80 p-1 text-neutral-600 hover:text-black shadow-xs cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Spot Photo */}
            <div className="relative h-32 w-full rounded-xl overflow-hidden bg-neutral-100">
              <img
                src={selectedMarkerSpot.images?.[0] || selectedMarkerSpot.img || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"}
                alt={selectedMarkerSpot.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-[#100B12] line-clamp-1">{selectedMarkerSpot.title}</h4>
              <span className="text-xs font-medium text-[#100B12] bg-[#DDD0EA] px-2 py-0.5 rounded-full shrink-0">
                {selectedMarkerSpot.cost || "₹500"}
              </span>
            </div>
            <p className="text-xs text-neutral-600 font-normal line-clamp-2">{selectedMarkerSpot.desc || "Popular highlight on map"}</p>
            <div className="flex items-center justify-between text-xs font-medium text-[#E60023] pt-1">
              <span>{selectedMarkerSpot.cost || "₹500"}</span>
              <span>⭐ 4.8 Rating</span>
            </div>

            {!selectedMarkerSpot.isStay && (
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    addSpotToItinerary(0, {
                      title: selectedMarkerSpot.title,
                      time: "03:00 PM",
                      desc: selectedMarkerSpot.desc || "Added from map marker",
                      cost: selectedMarkerSpot.cost || "₹500",
                      numericCost: selectedMarkerSpot.numericCost || 500,
                      lat: selectedMarkerSpot.lat,
                      lng: selectedMarkerSpot.lng
                    })
                    setSelectedMarkerSpot(null)
                  }}
                  className="flex-1 rounded-xl bg-[#E60023] text-white hover:bg-[#C8001E] font-medium text-xs py-1.5 flex items-center justify-center gap-1 cursor-pointer font-button"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add to Itinerary
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWishlist((prev) => [...prev, selectedMarkerSpot.title])
                  }}
                  className="p-2 rounded-xl border border-border hover:bg-accent text-rose-500 cursor-pointer"
                  title="Save to Wishlist"
                >
                  <Heart className="h-4 w-4 fill-rose-500" />
                </button>
                {selectedMarkerSpot.isSearchedLocation && (
                  <button
                    type="button"
                    onClick={handleClearSearchedLocation}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium text-xs cursor-pointer font-button transition-colors"
                    title="Remove searched pin from map"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove Pin
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          6. BOTTOM CONTROLS — Transit + Stats (Itinerary) / Center + Fit (Both)
         ═════════════════════════════════════════════════════════════════ */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-none">

        {/* Route Stats (Itinerary Mode) */}
        {mapMode === "itinerary" && totalStats.distanceKm > 0 && (
          <div className="flex items-center gap-2 bg-background/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-border shadow-2xl pointer-events-auto shrink-0 font-button">
            {isRoutingLoading ? (
              <span className="animate-pulse text-amber-500 font-medium text-[11px]">⚡ Calculating route...</span>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-[#5B8DEF]">
                <span>📍 {totalStats.distanceKm} km</span>
                <span>•</span>
                <span>⏱️ {totalStats.durationText}</span>
              </div>
            )}
          </div>
        )}

        {/* Discovery Mode Bottom Info */}
        {mapMode === "discovery" && activeStay && (
          <div className="flex items-center gap-2 bg-background/95 backdrop-blur-md p-2 rounded-2xl border border-border pointer-events-auto">
            <LocateFixed className="h-3.5 w-3.5 text-[#5B8DEF] shrink-0" />
            <span className="text-[11px] font-medium text-foreground line-clamp-1">
              {activeStay.name || "Your Stay"}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {activeDiscoveredPlaces.length} {DISCOVERY_CATEGORIES.find((c) => c.id === activeDiscoveryCategory)?.label || "places"} found
            </span>
          </div>
        )}

        {/* Right: Utility Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {activeStay && (
            <button
              type="button"
              onClick={handleCenterOnStay}
              className="flex items-center justify-center h-10 w-10 bg-background/95 backdrop-blur-md rounded-2xl border border-border text-foreground hover:bg-accent transition-transform hover:scale-105 shrink-0 cursor-pointer"
              title="Center on Stay"
            >
              <LocateFixed className="h-5 w-5 text-[#5B8DEF]" />
            </button>
          )}
          <button
            type="button"
            onClick={handleZoomIntoPlaces}
            className="flex items-center justify-center h-10 w-10 bg-background/95 backdrop-blur-md rounded-2xl border border-border text-foreground hover:bg-accent transition-transform hover:scale-105 shrink-0 cursor-pointer"
            title="Fit Map to All"
          >
            <Compass className="h-5 w-5 text-[#5B8DEF]" />
          </button>
        </div>
      </div>

    </div>
  )
}

export default TripMap