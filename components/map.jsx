"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import L from "leaflet"
import { useTrip } from "@/context/trip-context"
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
  AlertTriangle
} from "lucide-react"

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

const TRANSIT_MODES = [
  { id: "car", label: "Cab / Car", icon: Car, speedKmh: 35 },
  { id: "bus", label: "Bus", icon: Bus, speedKmh: 22 },
  { id: "transit", label: "Metro / Train", icon: Train, speedKmh: 30 },
  { id: "bike", label: "Bike", icon: Bike, speedKmh: 24 },
  { id: "walk", label: "Walk", icon: Footprints, speedKmh: 5.5 }
]

const POI_CATEGORIES = [
  { id: "all", label: "All POIs", icon: Compass },
  { id: "hotels", label: "Hotels & Stays", icon: Hotel, color: "#8b5cf6", emoji: "🏨" },
  { id: "cafes", label: "Cafes", icon: Coffee, color: "#f59e0b", emoji: "☕" },
  { id: "restaurants", label: "Food & Dining", icon: UtensilsCrossed, color: "#ef4444", emoji: "🍽️" },
  { id: "petrol", label: "Petrol Pumps", icon: Fuel, color: "#10b981", emoji: "⛽" },
  { id: "emergency", label: "Medical", icon: Stethoscope, color: "#ec4899", emoji: "🏥" }
]

const SMART_SEARCH_CHIPS = [
  "Cafes nearby",
  "Under ₹1000",
  "Top Attractions",
  "Sunset spots"
]

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
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
  return Number((R * c).toFixed(1))
}

export function TripMap({ spots = [], nearbyPlaces = [], hoveredSpotId, onSpotClick }) {
  const { itinerary, addSpotToItinerary, reorderDayActivities, baseStay, setBaseStay, destination } = useTrip()

  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const tileLayerRef = useRef(null)
  const markersRef = useRef([])
  const nearbyMarkersRef = useRef([])
  const poiMarkersRef = useRef([])
  const searchMarkerRef = useRef(null)
  const baseStayMarkerRef = useRef(null)
  const polylineRef = useRef(null)
  const stayLinesRef = useRef([])

  const [activeStyle, setActiveStyle] = useState("voyager")
  const [selectedTransit, setSelectedTransit] = useState("car")
  const [selectedCategory, setSelectedCategory] = useState("all")
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

  // Filter spots by Day
  const visibleSpots = useMemo(() => {
    if (activeDayFilter === "all") return spots
    const dayNum = parseInt(activeDayFilter, 10)
    const dayData = itinerary?.find((d) => d.day === dayNum)
    return dayData ? (dayData.activities || []) : spots
  }, [spots, itinerary, activeDayFilter])

  // Fetch real road route geometry & accurate leg stats from OSRM
  useEffect(() => {
    const validSpots = visibleSpots.filter((s) => s.lat && s.lng)
    if (validSpots.length < 2) {
      setRoutePathCoords([])
      setRealRouteLegs([])
      return
    }

    const modeConfig = TRANSIT_MODES.find((m) => m.id === selectedTransit) || TRANSIT_MODES[0]

    // Immediate fallback straight-line calculations while fetching
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
          // OSRM returns coordinates as [lng, lat], Leaflet needs [lat, lng]
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
  }, [visibleSpots, selectedTransit])

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

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapInstanceRef.current) return

    const initialLat = spots[0]?.lat || 15.5553
    const initialLng = spots[0]?.lng || 73.7517

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 12,
      zoomControl: false
    })

    map.on("click", (e) => {
      if (isAddingStayMode) {
        setBaseStay({
          name: "My Base Stay / Hotel",
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          address: `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`
        })
        setIsAddingStayMode(false)
      } else {
        setSelectedMarkerSpot(null)
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

  // Switch Tile Layer
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

  // Map Search Handler
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
          <svg viewBox="0 0 384 512" width="36" height="44" fill="#5A8CB2">
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

  // Update Spot Markers, Category POIs & Polyline
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    markersRef.current.forEach((m) => map.removeLayer(m))
    markersRef.current = []

    poiMarkersRef.current.forEach((m) => map.removeLayer(m))
    poiMarkersRef.current = []

    stayLinesRef.current.forEach((l) => map.removeLayer(l))
    stayLinesRef.current = []

    if (polylineRef.current) {
      map.removeLayer(polylineRef.current)
      polylineRef.current = null
    }

    if (baseStayMarkerRef.current) {
      map.removeLayer(baseStayMarkerRef.current)
      baseStayMarkerRef.current = null
    }

    const validSpots = visibleSpots.filter((s) => s.lat && s.lng)

    validSpots.forEach((spot, idx) => {
      const isHovered = spot.id === hoveredSpotId
      const color = isHovered ? "#EF4444" : "#5A8CB2"

      const customIcon = L.divIcon({
        className: "custom-spot-marker",
        html: `
          <div style="position: relative; width: 34px; height: 44px; transition: transform 0.2s ease; transform: ${isHovered ? "scale(1.3)" : "scale(1)"}; filter: drop-shadow(0px 4px 10px rgba(0,0,0,0.35));">
            <svg viewBox="0 0 384 512" width="34" height="44" fill="${color}">
              <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
            </svg>
            <div style="
              position: absolute;
              top: 7px;
              left: 50%;
              transform: translateX(-50%);
              width: 20px;
              height: 20px;
              background-color: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 800;
              font-size: 11px;
              color: ${color};
              font-family: system-ui, sans-serif;
            ">
              ${idx + 1}
            </div>
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

    if (baseStay && baseStay.lat && baseStay.lng) {
      const stayIcon = L.divIcon({
        className: "base-stay-marker",
        html: `
          <div style="position: relative; width: 38px; height: 46px; filter: drop-shadow(0px 4px 12px rgba(90,140,178,0.6));">
            <svg viewBox="0 0 384 512" width="38" height="46" fill="#5A8CB2">
              <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
            </svg>
            <div style="position: absolute; top: 8px; left: 50%; transform: translateX(-50%); font-size: 14px;">🏠</div>
          </div>
        `,
        iconSize: [38, 46],
        iconAnchor: [19, 46]
      })

      const stayMarker = L.marker([baseStay.lat, baseStay.lng], { icon: stayIcon }).addTo(map)
      stayMarker.on("click", () => {
        setSelectedMarkerSpot({ title: baseStay.name || "My Base Stay", desc: baseStay.address, lat: baseStay.lat, lng: baseStay.lng, isStay: true })
      })
      baseStayMarkerRef.current = stayMarker

      validSpots.forEach((s) => {
        const line = L.polyline(
          [
            [baseStay.lat, baseStay.lng],
            [s.lat, s.lng]
          ],
          { color: "#5A8CB2", weight: 2, dashArray: "4, 6", opacity: 0.6 }
        ).addTo(map)
        stayLinesRef.current.push(line)
      })
    }

    const filteredPois =
      selectedCategory === "all"
        ? nearbyPlaces
        : nearbyPlaces.filter((p) => (p.category || p.type || "").toLowerCase().includes(selectedCategory))

    filteredPois.forEach((place) => {
      if (!place.lat || !place.lng) return

      const poiIcon = L.divIcon({
        className: "custom-poi-marker",
        html: `
          <div style="position: relative; width: 28px; height: 36px; filter: drop-shadow(0px 2px 6px rgba(16,185,129,0.4));">
            <svg viewBox="0 0 384 512" width="28" height="36" fill="#10B981">
              <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
            </svg>
            <div style="position: absolute; top: 5px; left: 50%; transform: translateX(-50%); font-size: 9px;">📍</div>
          </div>
        `,
        iconSize: [28, 36],
        iconAnchor: [14, 36]
      })

      const marker = L.marker([place.lat, place.lng], { icon: poiIcon }).addTo(map)
      marker.on("click", () => {
        setSelectedMarkerSpot({
          title: place.name,
          cost: "₹650",
          numericCost: 650,
          desc: `${place.type} • ⭐ ${place.rating || "4.8"}`,
          lat: place.lat,
          lng: place.lng
        })
      })
      poiMarkersRef.current.push(marker)
    })

    if (routePathCoords.length > 1) {
      const glowLine = L.polyline(routePathCoords, {
        color: "#5A8CB2",
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
  }, [visibleSpots, nearbyPlaces, hoveredSpotId, selectedCategory, baseStay, routePathCoords])

  const handleZoomIntoPlaces = () => {
    const map = mapInstanceRef.current
    if (!map) return

    const coords = [
      ...visibleSpots.filter((s) => s.lat && s.lng).map((s) => [s.lat, s.lng]),
      ...(baseStay?.lat && baseStay?.lng ? [[baseStay.lat, baseStay.lng]] : []),
      ...nearbyPlaces.filter((p) => p.lat && p.lng).map((p) => [p.lat, p.lng])
    ]

    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords)
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
    }
  }

  return (
    <div className="h-full w-full relative overflow-hidden rounded-xl min-h-[500px] sm:min-h-[620px] bg-card flex flex-col shadow-lg border border-border">
      
      {/* ─────────────────────────────────────────────
          1. FLOATING SEARCH & DAY FILTER HEADER BAR
         ───────────────────────────────────────────── */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pointer-events-none">
        
        {/* Left Side: Search Bar & Contextual Search Chips */}
        <div className="relative min-w-[260px] sm:min-w-[340px] pointer-events-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleMapLocationSearch()
            }}
            className="flex items-center gap-2 bg-background/95 backdrop-blur-md px-3.5 py-2 rounded-md border border-border shadow-md"
          >
            <Search className="h-4 w-4 text-[#5A8CB2] shrink-0" />
            <input
              type="text"
              placeholder="Search map location or contextual prompt..."
              value={mapSearchQuery}
              onChange={(e) => setMapSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-foreground outline-none placeholder:text-muted-foreground"
            />
            {mapSearchQuery && (
              <button
                type="button"
                onClick={() => setMapSearchQuery("")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="submit"
              disabled={isSearching}
              className="rounded-sm bg-[#5A8CB2] text-white hover:bg-[#4A7CA2] font-semibold text-[11px] uppercase tracking-wider px-3.5 py-1.5 shadow-xs shrink-0 cursor-pointer"
            >
              {isSearching ? "Searching..." : "Search"}
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
                className="px-2.5 py-1 rounded-xs bg-background/90 backdrop-blur-md border border-border text-[10px] font-semibold text-foreground hover:bg-[#C8D9E6]/30 hover:border-[#5A8CB2] transition-colors shrink-0 shadow-xs cursor-pointer"
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

        {/* Right Side: Day Filter & Add Stay Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Day Selector Pill */}
          <div className="flex items-center gap-1 bg-background/95 backdrop-blur-md p-1 rounded-sm border border-border shadow-md">
            <button
              type="button"
              onClick={() => setActiveDayFilter("all")}
              className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
                activeDayFilter === "all"
                  ? "bg-[#5A8CB2] text-white shadow-xs"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              Entire Trip
            </button>
            {itinerary?.map((d) => (
              <button
                key={d.day}
                type="button"
                onClick={() => setActiveDayFilter(d.day.toString())}
                className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
                  activeDayFilter === d.day.toString()
                    ? "bg-[#5A8CB2] text-white shadow-xs"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                Day {d.day}
              </button>
            ))}
          </div>

          {/* Add Stay Button */}
          <button
            type="button"
            onClick={() => setIsAddingStayMode(!isAddingStayMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-sm backdrop-blur-md border shadow-md transition-all cursor-pointer ${
              baseStay
                ? "bg-[#5A8CB2] text-white border-[#5A8CB2]"
                : isAddingStayMode
                ? "bg-rose-500 text-white border-rose-400 animate-pulse"
                : "bg-background/90 text-foreground border-border hover:bg-accent"
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>{isAddingStayMode ? "Click Map Pin" : baseStay ? "Stay Added 🏠" : "Add Stay"}</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          2. FULL BLEED LEAFLET MAP CANVAS
         ───────────────────────────────────────────── */}
      <div ref={mapContainerRef} className="absolute inset-0 h-full w-full z-0" />

      {/* ─────────────────────────────────────────────
          3. SMART ROUTE OPTIMIZATION & WEATHER ALERT BADGE
         ───────────────────────────────────────────── */}
      {!optimizationAlertDismissed && totalStats.distanceKm > 6 && (
        <div className="absolute top-20 left-3 right-3 sm:left-auto sm:right-3 z-[1000] pointer-events-auto max-w-sm">
          <div className="bg-background/95 backdrop-blur-md p-3 rounded-md border border-amber-500/40 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Route Recommendation
              </span>
              <button
                type="button"
                onClick={() => setOptimizationAlertDismissed(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">
              Reorder stops to save approx. <strong>35 minutes</strong> travel time & fuel costs.
            </p>
            <button
              type="button"
              onClick={() => {
                reorderDayActivities(0, 0, 1)
                setOptimizationAlertDismissed(true)
              }}
              className="w-full rounded-sm bg-[#5A8CB2] text-white hover:bg-[#4A7CA2] font-semibold text-xs uppercase tracking-wider py-1.5 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5" />
              Optimize Route Order
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          4. SELECTED MARKER COMPACT INFO CARD POPOVER
         ───────────────────────────────────────────── */}
      {selectedMarkerSpot && (
        <div className="absolute bottom-16 left-3 z-[1000] pointer-events-auto max-w-xs w-full">
          <div className="bg-background/95 backdrop-blur-md p-4 rounded-md border border-border shadow-xl space-y-2 relative">
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
            <div className="flex items-center justify-between text-xs font-bold text-[#5A8CB2] pt-1">
              <span>{selectedMarkerSpot.cost || "₹500"}</span>
              <span>⭐ 4.8 Rating</span>
            </div>

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
                className="flex-1 rounded-sm bg-[#5A8CB2] text-white hover:bg-[#4A7CA2] font-semibold text-xs uppercase tracking-wider py-1.5 shadow-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add to Itinerary
              </button>
              <button
                type="button"
                onClick={() => {
                  setWishlist((prev) => [...prev, selectedMarkerSpot.title])
                  alert(`❤️ Saved "${selectedMarkerSpot.title}" to Wishlist!`)
                }}
                className="p-2 rounded-sm border border-border hover:bg-accent text-rose-500 cursor-pointer"
                title="Save to Wishlist"
              >
                <Heart className="h-4 w-4 fill-rose-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          5. FLOATING BOTTOM CONTROLS (Transit Modes + Category Filters + Zoom)
         ───────────────────────────────────────────── */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-none">
        
        {/* Transit Mode & Distance/Time Stats Pill */}
        <div className="flex items-center gap-2 bg-background/95 backdrop-blur-md p-2 rounded-md border border-border shadow-xl pointer-events-auto overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1 shrink-0">Transit Mode:</span>
          {TRANSIT_MODES.map((mode) => {
            const Icon = mode.icon
            const isActive = selectedTransit === mode.id
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setSelectedTransit(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#5A8CB2] text-white shadow-xs"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{mode.label}</span>
              </button>
            )
          })}

          {totalStats.distanceKm > 0 && (
            <div className="ml-2 pl-3 border-l border-border flex items-center gap-2 text-xs font-bold text-[#5A8CB2] shrink-0">
              {isRoutingLoading ? (
                <span className="animate-pulse text-amber-500 font-bold text-[11px]">⚡ Calculating road route...</span>
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

        {/* POI Filters & Fit Map Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1 bg-background/95 backdrop-blur-md p-1.5 rounded-md border border-border shadow-xl overflow-x-auto scrollbar-none">
            {POI_CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isActive = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xs text-[11px] font-semibold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-[#C8D9E6] text-[#1E293B] shadow-xs"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={handleZoomIntoPlaces}
            className="flex items-center justify-center h-10 w-10 bg-background/95 backdrop-blur-md rounded-sm border border-border text-foreground shadow-xl hover:bg-accent transition-transform hover:scale-105 shrink-0 cursor-pointer"
            title="Fit Map to All Spots"
          >
            <Compass className="h-5 w-5 text-[#5A8CB2]" />
          </button>
        </div>
      </div>

    </div>
  )
}

export default TripMap