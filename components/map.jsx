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
  Star
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

// ─── Discovery Category Tabs ────────────────────────────────────────────
const DISCOVERY_CATEGORIES = [
  { id: "cafes", label: "Cafes", icon: Coffee, color: "#f59e0b", emoji: "☕" },
  { id: "restaurants", label: "Restaurants", icon: UtensilsCrossed, color: "#ef4444", emoji: "🍽️" },
  { id: "attractions", label: "Attractions", icon: Landmark, color: "#8b5cf6", emoji: "🏛️" },
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
          <svg viewBox="0 0 384 512" width="36" height="44" fill="#27A84D">
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

    setSelectedMarkerSpot({
      title: placeName,
      cost: "₹500",
      numericCost: 500,
      desc: result.display_name,
      lat,
      lng
    })

    map.flyTo([lat, lng], 14, { duration: 1.2 })
  }

  // ─── Render Map Layers (Markers, Routes, Rings) ───────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

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

    // ── Stay Anchor Marker (Both Modes) ───────────────────────────────
    if (activeStay && activeStay.lat && activeStay.lng) {
      const stayIcon = L.divIcon({
        className: "stay-anchor-marker",
        html: `
          <div style="position: relative; width: 48px; height: 56px; filter: drop-shadow(0px 6px 16px rgba(90,140,178,0.7));">
            <svg viewBox="0 0 384 512" width="48" height="56" fill="#27A84D">
              <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
            </svg>
            <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); font-size: 20px;">🏠</div>
            <div style="
              position: absolute; top: -6px; left: 50%; transform: translateX(-50%);
              width: 56px; height: 56px; border-radius: 50%;
              border: 2px solid rgba(90,140,178,0.4);
              animation: stayPulse 2s ease-in-out infinite;
            "></div>
          </div>
        `,
        iconSize: [48, 56],
        iconAnchor: [24, 56]
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
            color: ring.color,
            fillColor: ring.color,
            fillOpacity: ring.opacity,
            weight: 1,
            dashArray: "6, 4",
            interactive: false
          }).addTo(map)
          proximityRingsRef.current.push(circle)
        }
      })

      // ── Discovery POI Markers ────────────────────────────────────────
      const catMeta = CATEGORY_META[activeDiscoveryCategory] || { emoji: "📍", color: "#6b7280" }
      activeDiscoveredPlaces.forEach((place, idx) => {
        if (!place.lat || !place.lng) return

        const isSelected = selectedDiscoveryPlace?.id === place.id
        const markerColor = isSelected ? "#1e293b" : catMeta.color

        const poiIcon = L.divIcon({
          className: "discovery-poi-marker",
          html: `
            <div style="
              position: relative; width: ${isSelected ? 38 : 30}px; height: ${isSelected ? 46 : 38}px;
              filter: drop-shadow(0px 3px 8px ${markerColor}66);
              transition: all 0.2s ease;
              transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
            ">
              <svg viewBox="0 0 384 512" width="${isSelected ? 38 : 30}" height="${isSelected ? 46 : 38}" fill="${markerColor}">
                <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
              </svg>
              <div style="position: absolute; top: ${isSelected ? 7 : 5}px; left: 50%; transform: translateX(-50%); font-size: ${isSelected ? 14 : 11}px;">${catMeta.emoji}</div>
            </div>
          `,
          iconSize: [isSelected ? 38 : 30, isSelected ? 46 : 38],
          iconAnchor: [isSelected ? 19 : 15, isSelected ? 46 : 38]
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
        let markerColor = "#27A84D"
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
            <div style="position: relative; width: 34px; height: 44px; transition: transform 0.2s ease; transform: ${isHovered ? "scale(1.3)" : "scale(1)"}; filter: drop-shadow(0px 4px 10px rgba(0,0,0,0.35));">
              <svg viewBox="0 0 384 512" width="34" height="44" fill="${markerColor}">
                <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
              </svg>
              <div style="
                position: absolute; top: 7px; left: 50%; transform: translateX(-50%);
                width: 20px; height: 20px; background-color: white;
                border-radius: 50%; display: flex; align-items: center; justify-content: center;
                font-weight: 800; font-size: 11px; color: ${markerColor}; font-family: system-ui, sans-serif;
              ">${idx + 1}</div>
            </div>
          `,
          iconSize: [34, 44],
          iconAnchor: [17, 44]
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
          { color: "#27A84D", weight: 2.5, dashArray: "6, 8", opacity: 0.5 }
        ).addTo(map)
        stayLinesRef.current.push(lineToFirst)

        // Last stop → Stay
        const lineFromLast = L.polyline(
          [[lastSpot.lat, lastSpot.lng], [activeStay.lat, activeStay.lng]],
          { color: "#27A84D", weight: 2.5, dashArray: "6, 8", opacity: 0.5 }
        ).addTo(map)
        stayLinesRef.current.push(lineFromLast)
      }

      // ── OSRM Route Polyline ──────────────────────────────────────────
      if (routePathCoords.length > 1) {
        const glowLine = L.polyline(routePathCoords, {
          color: "#8493A5",
          weight: 8,
          opacity: 0.3,
          lineCap: "round",
          lineJoin: "round"
        })

        const mainLine = L.polyline(routePathCoords, {
          color: "#2563EB",
          weight: 4,
          opacity: 0.9,
          lineCap: "round",
          lineJoin: "round"
        })

        const group = L.layerGroup([glowLine, mainLine]).addTo(map)
        polylineRef.current = group
      }
    }
  }, [visibleSpots, nearbyPlaces, hoveredSpotId, activeStay, routePathCoords, mapMode, activeDiscoveredPlaces, activeDiscoveryCategory, selectedDiscoveryPlace, activeDayFilter, itinerary, discoveryRadius])

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
    <div className="h-full w-full relative overflow-hidden rounded-3xl min-h-[500px] sm:min-h-[620px] bg-card flex flex-col shadow-2xl border border-border">

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
            className="flex items-center gap-2 bg-background/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-border shadow-md"
          >
            <Search className="h-4 w-4 text-[#F5A623] shrink-0" />
            <input
              type="text"
              placeholder="Search location..."
              value={mapSearchQuery}
              onChange={(e) => setMapSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-foreground outline-none placeholder:text-muted-foreground"
            />
            {mapSearchQuery && (
              <button type="button" onClick={() => setMapSearchQuery("")} className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="submit"
              disabled={isSearching}
              className="rounded-xl bg-[#F5A623] text-white hover:bg-[#D98E19] font-semibold text-[11px] uppercase tracking-wider px-3.5 py-1.5 shrink-0 cursor-pointer"
            >
              {isSearching ? "..." : "Search"}
            </button>
          </form>

          {/* Contextual Search Chips */}
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto scrollbar-none">
            {SMART_SEARCH_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setMapSearchQuery(chip)
                  handleMapLocationSearch(chip)
                }}
                className="px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-md border border-border text-[10px] font-semibold text-foreground hover:bg-[#C8D9E6]/30 hover:border-[#5A8CB2] transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
          {/* Autocomplete Dropdown */}
          {showResultsDropdown && searchResults.length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-background/95 backdrop-blur-md rounded-md border border-border shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto p-1.5 space-y-1">
              {searchResults.map((res, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectSearchResult(res)}
                  className="flex items-start gap-2 w-full text-left p-2 rounded-xs hover:bg-accent text-xs font-semibold text-foreground transition-colors cursor-pointer"
                >
                  <MapPin className="h-4 w-4 text-[#5A8CB2] shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{res.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Mode Toggle + Day Filter + Stay Button */}
        <div className="flex items-center gap-2 pointer-events-auto flex-wrap">

          {/* Mode Toggle Pill */}
          <div className="flex items-center bg-background/95 backdrop-blur-md p-1 rounded-full border border-border shadow-xl">
            <button
              type="button"
              onClick={() => setMapMode("discovery")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-extrabold rounded-full transition-all ${
                mapMode === "discovery"
                  ? "bg-[#27A84D] text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Discover
            </button>
            <button
              type="button"
              onClick={() => setMapMode("itinerary")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-extrabold rounded-full transition-all ${
                mapMode === "itinerary"
                  ? "bg-[#27A84D] text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Route className="h-3.5 w-3.5" />
              Route
            </button>
          </div>

          {/* Day Selector (Itinerary Mode only) */}
          {mapMode === "itinerary" && (
            <div className="flex items-center gap-1 bg-background/95 backdrop-blur-md p-1 rounded-full border border-border">
              <button
                type="button"
                onClick={() => setActiveDayFilter("all")}
                className={`px-2.5 py-1 text-[11px] font-extrabold rounded-full transition-all ${
                  activeDayFilter === "all"
                    ? "bg-[#27A84D] text-white"
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
                  className={`px-2.5 py-1 text-[11px] font-extrabold rounded-full transition-all ${
                    activeDayFilter === d.day.toString()
                      ? "bg-[#27A84D] text-white"
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
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full backdrop-blur-md border transition-all cursor-pointer ${
              isAddingStayMode
                ? "bg-rose-500 text-white border-rose-400 animate-pulse"
                : activeStay
                ? "bg-[#27A84D] text-white border-[#27A84D]"
                : "bg-background/90 text-foreground border-border hover:bg-accent"
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>{isAddingStayMode ? "Click Map to Set Stay" : activeStay ? "Change Stay ✓" : "Set Stay"}</span>
          </button>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          2. LEAFLET MAP CANVAS (Full Bleed)
         ═════════════════════════════════════════════════════════════════ */}
      <div ref={mapContainerRef} className="absolute inset-0 h-full w-full z-0" />

      {/* ═════════════════════════════════════════════════════════════════
          3. DISCOVERY MODE — Category Tabs + Discovery Panel
         ═════════════════════════════════════════════════════════════════ */}
      {mapMode === "discovery" && (
        <>
          {/* Category Tabs */}
          <div className="absolute top-16 left-3 right-3 z-[1000] pointer-events-none">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pointer-events-auto">
              {DISCOVERY_CATEGORIES.map((cat) => {
                const Icon = cat.icon
                const isActive = activeDiscoveryCategory === cat.id
                const count = discoveredPlaces?.[cat.id]?.length || 0
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveDiscoveryCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[11px] font-bold transition-all shrink-0 cursor-pointer backdrop-blur-md border shadow-lg ${
                      isActive
                        ? "text-white shadow-md"
                        : "bg-background/90 text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                    }`}
                    style={isActive ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{cat.label}</span>
                    {count > 0 && (
                      <span className={`ml-0.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        isActive ? "bg-white/25" : "bg-accent"
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Discovery Side Panel */}
          {activeStay && discoveryPanelOpen && (
            <div className="absolute top-28 left-3 bottom-16 z-[1000] pointer-events-auto w-72 max-w-[calc(100%-24px)]">
              <div className="bg-background/95 backdrop-blur-md rounded-2xl border border-border h-full flex flex-col overflow-hidden">
                {/* Panel Header */}
                <div className="p-3 border-b border-border flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                      {isDiscoveryLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#E60023]" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5 text-[#E60023]" />
                      )}
                      {DISCOVERY_CATEGORIES.find((c) => c.id === activeDiscoveryCategory)?.label || "Nearby"} near Stay
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                      📍 {activeStay.name || "Your Hotel"} • {(discoveryRadius / 1000).toFixed(0)}km radius
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDiscoveryPanelOpen(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Radius Slider */}
                <div className="px-3 py-2 border-b border-border">
                  <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground mb-1">
                    <span>Search Radius</span>
                    <span className="text-[#E60023] font-extrabold">{(discoveryRadius / 1000).toFixed(0)} km</span>
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

                {/* Places List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-none">
                  {isDiscoveryLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin text-[#E60023] mb-2" />
                      <span className="text-xs font-bold">Discovering nearby places...</span>
                    </div>
                  ) : activeDiscoveredPlaces.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <MapPin className="h-6 w-6 mb-2 opacity-40" />
                      <span className="text-xs font-bold">No places found</span>
                      <span className="text-[10px] mt-1">Try increasing the radius</span>
                    </div>
                  ) : (
                    activeDiscoveredPlaces.map((place) => {
                      const ring = getDistanceRing(place.distanceKm)
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
                          className={`w-full text-left p-2.5 rounded-xl transition-all ${
                            isSelected
                              ? "bg-[#E60023]/10 border-[#E60023] border"
                              : "hover:bg-accent border border-transparent"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-extrabold text-foreground line-clamp-1">{place.name}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${ring.color}20`, color: ring.color }}>
                                  {ring.emoji} {place.distanceKm.toFixed(1)} km
                                </span>
                                <span className="text-[9px] font-bold text-muted-foreground">
                                  ~₹{place.estimatedCabCost} cab
                                </span>
                              </div>
                              {place.cuisine && (
                                <p className="text-[9px] text-muted-foreground mt-0.5 line-clamp-1">🍴 {place.cuisine}</p>
                              )}
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-1" />
                          </div>
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Collapsed panel toggle */}
          {activeStay && !discoveryPanelOpen && (
            <button
              type="button"
              onClick={() => setDiscoveryPanelOpen(true)}
              className="absolute top-28 left-3 z-[1000] pointer-events-auto bg-background/95 backdrop-blur-md p-2.5 rounded-2xl border border-border hover:bg-accent transition-colors"
            >
              <Sparkles className="h-4 w-4 text-[#E60023]" />
            </button>
          )}

          {/* No Stay Warning */}
          {!activeStay && (
            <div className="absolute top-16 left-3 right-3 z-[1000] pointer-events-auto">
              <div className="bg-background/95 backdrop-blur-md p-3.5 rounded-2xl border border-amber-500/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <div>
                    <span className="text-xs font-extrabold block">Set your Stay to discover nearby places</span>
                    <span className="text-[10px] text-muted-foreground">Click anywhere on the map to pin your hotel</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingStayMode(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shrink-0 cursor-pointer transition-colors"
                >
                  📍 Pin Stay
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          4. SELECTED DISCOVERY PLACE DETAIL CARD
         ═════════════════════════════════════════════════════════════════ */}
      {selectedDiscoveryPlace && mapMode === "discovery" && (
        <div className="absolute bottom-16 left-3 z-[1000] pointer-events-auto max-w-xs w-full">
          <div className="bg-background/95 backdrop-blur-md p-4 rounded-2xl border border-border space-y-2.5 relative">
            <button
              type="button"
              onClick={() => setSelectedDiscoveryPlace(null)}
              className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                   style={{ backgroundColor: CATEGORY_META[selectedDiscoveryPlace.category]?.color || "#E60023" }}>
                {CATEGORY_META[selectedDiscoveryPlace.category]?.emoji || "📍"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-foreground line-clamp-1">{selectedDiscoveryPlace.name}</p>
                <p className="text-[10px] text-muted-foreground line-clamp-1">
                  {selectedDiscoveryPlace.categoryLabel} • {selectedDiscoveryPlace.distanceKm?.toFixed(1)} km from stay
                </p>
              </div>
            </div>

            {/* Transport Estimates */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              {getAllTransportEstimates(selectedDiscoveryPlace.distanceKm).filter(t => t.mode !== "bus").map((t) => (
                <div key={t.mode} className="flex items-center gap-1 bg-accent/50 px-2 py-1 rounded-lg shrink-0">
                  <span className="text-[9px] font-bold text-foreground">{t.label}</span>
                  <span className="text-[9px] font-extrabold text-[#E60023]">₹{t.cost}</span>
                  <span className="text-[9px] text-muted-foreground">{t.duration}</span>
                </div>
              ))}
            </div>

            {/* Meta Info */}
            {(selectedDiscoveryPlace.cuisine || selectedDiscoveryPlace.openingHours || selectedDiscoveryPlace.address) && (
              <div className="space-y-1">
                {selectedDiscoveryPlace.cuisine && (
                  <p className="text-[10px] text-muted-foreground">🍴 Cuisine: {selectedDiscoveryPlace.cuisine}</p>
                )}
                {selectedDiscoveryPlace.openingHours && (
                  <p className="text-[10px] text-muted-foreground">🕐 {selectedDiscoveryPlace.openingHours}</p>
                )}
                {selectedDiscoveryPlace.address && (
                  <p className="text-[10px] text-muted-foreground line-clamp-1">📍 {selectedDiscoveryPlace.address}</p>
                )}
              </div>
            )}

            {/* Add to Itinerary */}
            <div className="flex items-center gap-2 pt-1">
              <select
                value={addToDayIndex}
                onChange={(e) => setAddToDayIndex(parseInt(e.target.value, 10))}
                className="text-xs font-bold bg-accent rounded-xl px-2.5 py-1.5 border border-border outline-none"
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
                className="flex-1 rounded-xl bg-[#27A84D] text-white hover:bg-[#1F8A3E] font-bold text-xs py-1.5 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add to Itinerary
              </button>
              <button
                type="button"
                onClick={() => {
                  setWishlist((prev) => [...prev, selectedDiscoveryPlace.name])
                }}
                className="p-2 rounded-xl border border-border hover:bg-accent text-rose-500 cursor-pointer"
                title="Save to Wishlist"
              >
                <Heart className="h-4 w-4 fill-rose-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          5. SELECTED ITINERARY SPOT INFO CARD (Itinerary Mode)
         ═════════════════════════════════════════════════════════════════ */}
      {selectedMarkerSpot && !selectedDiscoveryPlace && (
        <div className="absolute bottom-16 left-3 z-[1000] pointer-events-auto max-w-xs w-full">
          <div className="bg-background/95 backdrop-blur-md p-4 rounded-2xl border border-border space-y-2 relative">
            <button
              type="button"
              onClick={() => setSelectedMarkerSpot(null)}
              className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">{selectedMarkerSpot.title}</span>
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-2">{selectedMarkerSpot.desc || "Popular highlight on map"}</p>
            <div className="flex items-center justify-between text-xs font-bold text-[#E60023] pt-1">
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
                  className="flex-1 rounded-xl bg-[#E60023] text-white hover:bg-[#C8001E] font-bold text-xs py-1.5 flex items-center justify-center gap-1 cursor-pointer"
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
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          6. BOTTOM CONTROLS — Transit + Stats (Itinerary) / Center + Fit (Both)
         ═════════════════════════════════════════════════════════════════ */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-none">

        {/* Transit Mode & Stats (Itinerary Mode) */}
        {mapMode === "itinerary" && (
          <div className="flex items-center gap-2 bg-background/95 backdrop-blur-md p-2 rounded-2xl border border-border shadow-2xl pointer-events-auto overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground px-1 shrink-0">Transit:</span>
            {TRANSIT_MODES.map((mode) => {
              const Icon = mode.icon
              const isActive = selectedTransit === mode.id
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSelectedTransit(mode.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-[#27A84D] text-white"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{mode.label}</span>
                </button>
              )
            })}

            {totalStats.distanceKm > 0 && (
              <div className="ml-2 pl-3 border-l border-border flex items-center gap-2 text-xs font-extrabold text-[#27A84D] shrink-0">
                {isRoutingLoading ? (
                  <span className="animate-pulse text-amber-500 font-bold text-[11px]">⚡ Calculating...</span>
                ) : (
                  <>
                    <span>📍 {totalStats.distanceKm} km</span>
                    <span>•</span>
                    <span>⏱️ {totalStats.durationText}</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Discovery Mode Bottom Info */}
        {mapMode === "discovery" && activeStay && (
          <div className="flex items-center gap-2 bg-background/95 backdrop-blur-md p-2 rounded-2xl border border-border pointer-events-auto">
            <LocateFixed className="h-3.5 w-3.5 text-[#27A84D] shrink-0" />
            <span className="text-[11px] font-bold text-foreground line-clamp-1">
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
              <LocateFixed className="h-5 w-5 text-[#27A84D]" />
            </button>
          )}
          <button
            type="button"
            onClick={handleZoomIntoPlaces}
            className="flex items-center justify-center h-10 w-10 bg-background/95 backdrop-blur-md rounded-2xl border border-border text-foreground hover:bg-accent transition-transform hover:scale-105 shrink-0 cursor-pointer"
            title="Fit Map to All"
          >
            <Compass className="h-5 w-5 text-[#27A84D]" />
          </button>
        </div>
      </div>

    </div>
  )
}

export default TripMap