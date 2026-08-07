"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"

const TILE_LAYERS = {
  voyager: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
  },
  streets: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }
}

export function TripMap({ spots = [], nearbyPlaces = [], hoveredSpotId, onSpotClick }) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const tileLayerRef = useRef(null)
  const markersRef = useRef([])
  const nearbyMarkersRef = useRef([])
  const polylineRef = useRef(null)

  const [activeStyle, setActiveStyle] = useState("voyager")

  // Initialize Leaflet Map once
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

    // Add Zoom Control to Top-Left
    L.control.zoom({ position: "topleft" }).addTo(map)

    // Add Initial Tile Layer
    const tileConfig = TILE_LAYERS[activeStyle] || TILE_LAYERS.voyager
    const layer = L.tileLayer(tileConfig.url, {
      maxZoom: 19,
      attribution: tileConfig.attribution
    }).addTo(map)

    tileLayerRef.current = layer
    mapInstanceRef.current = map

    // Resize observer to handle container size changes smoothly
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize()
    })
    resizeObserver.observe(mapContainerRef.current)

    // Delayed invalidateSize calls after Framer Motion animations
    const t1 = setTimeout(() => map.invalidateSize(), 200)
    const t2 = setTimeout(() => map.invalidateSize(), 500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
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

  // Update Spot Markers, Nearby Markers & Polyline
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Clear previous spot markers
    markersRef.current.forEach((m) => map.removeLayer(m))
    markersRef.current = []

    // Clear previous nearby markers
    nearbyMarkersRef.current.forEach((m) => map.removeLayer(m))
    nearbyMarkersRef.current = []

    // Clear previous polyline
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current)
      polylineRef.current = null
    }

    const validSpots = spots.filter((s) => s.lat && s.lng)

    // Create Custom Numbered DivIcons for Spots
    validSpots.forEach((spot, idx) => {
      const isHovered = spot.id === hoveredSpotId
      const color = isHovered ? "#ec4899" : "#2563eb"

      const customIcon = L.divIcon({
        className: "custom-spot-marker",
        html: `
          <div style="position: relative; width: 34px; height: 44px; transition: transform 0.2s ease; transform: ${isHovered ? "scale(1.25)" : "scale(1)"}; filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.35));">
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
        iconAnchor: [17, 44],
        popupAnchor: [0, -40]
      })

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 170px;">
          <div style="font-size: 14px; font-weight: 800; color: #0f172a;">
            #${idx + 1} ${spot.title}
          </div>
          <div style="font-size: 12px; color: #2563eb; font-weight: 700; margin-top: 2px;">
            Price: ${spot.cost}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            🕒 ${spot.time} (${spot.openingHours || "09:00 AM - 07:00 PM"})
          </div>
          ${spot.desc ? `<p style="font-size: 11px; color: #475569; margin-top: 4px; line-height: 1.3;">${spot.desc}</p>` : ""}
        </div>
      `

      const marker = L.marker([spot.lat, spot.lng], { icon: customIcon })
        .bindPopup(popupContent)
        .addTo(map)

      marker.on("click", () => {
        onSpotClick && onSpotClick(spot.id)
      })

      markersRef.current.push(marker)
    })

    // Create Red Pins for Nearby Utility Places
    nearbyPlaces.forEach((place) => {
      if (!place.lat || !place.lng) return

      const nearbyIcon = L.divIcon({
        className: "custom-nearby-marker",
        html: `
          <div style="position: relative; width: 28px; height: 36px; filter: drop-shadow(0px 2px 6px rgba(239,68,68,0.4));">
            <svg viewBox="0 0 384 512" width="28" height="36" fill="#ef4444">
              <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
            </svg>
            <div style="
              position: absolute;
              top: 5px;
              left: 50%;
              transform: translateX(-50%);
              width: 14px;
              height: 14px;
              background-color: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 8px;
            ">
              📍
            </div>
          </div>
        `,
        iconSize: [28, 36],
        iconAnchor: [14, 36],
        popupAnchor: [0, -32]
      })

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; padding: 2px;">
          <strong style="color: #ef4444; font-size: 13px;">${place.name}</strong>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${place.type} • ${place.rating}</div>
        </div>
      `

      const marker = L.marker([place.lat, place.lng], { icon: nearbyIcon })
        .bindPopup(popupContent)
        .addTo(map)

      nearbyMarkersRef.current.push(marker)
    })

    // Draw Dashed Blue Route Line
    const latLngs = validSpots.map((s) => [s.lat, s.lng])
    if (latLngs.length > 1) {
      const polyline = L.polyline(latLngs, {
        color: "#2563eb",
        weight: 4,
        dashArray: "6, 8",
        opacity: 0.85
      }).addTo(map)

      polylineRef.current = polyline
    }

    // Auto-fit bounds
    const allCoords = [
      ...latLngs,
      ...nearbyPlaces.filter((p) => p.lat && p.lng).map((p) => [p.lat, p.lng])
    ]

    if (allCoords.length > 1) {
      const bounds = L.latLngBounds(allCoords)
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
    } else if (allCoords.length === 1) {
      map.flyTo(allCoords[0], 13, { duration: 1 })
    }

    map.invalidateSize()
  }, [spots, nearbyPlaces, hoveredSpotId])

  // Reset / Zoom into places
  const handleZoomIntoPlaces = () => {
    const map = mapInstanceRef.current
    if (!map) return

    const coords = [
      ...spots.filter((s) => s.lat && s.lng).map((s) => [s.lat, s.lng]),
      ...nearbyPlaces.filter((p) => p.lat && p.lng).map((p) => [p.lat, p.lng])
    ]

    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords)
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
    }
  }

  return (
    <div className="h-full w-full relative overflow-hidden rounded-3xl min-h-[580px] border border-border/80 shadow-2xl bg-card">
      {/* Leaflet Map Div Container */}
      <div ref={mapContainerRef} className="absolute inset-0 h-full w-full z-0" />

      {/* Top Right Floating Layer Switcher */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 bg-background/90 backdrop-blur-md p-1.5 rounded-xl border border-border/70 shadow-lg">
        {[
          { key: "voyager", label: "🗺️ Voyager" },
          { key: "streets", label: "🌐 Streets" },
          { key: "satellite", label: "🛰️ Satellite" }
        ].map((style) => (
          <button
            key={style.key}
            type="button"
            onClick={() => setActiveStyle(style.key)}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
              activeStyle === style.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {style.label}
          </button>
        ))}
      </div>

      {/* Bottom Left Floating Zoom Button */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <button
          type="button"
          onClick={handleZoomIntoPlaces}
          className="flex items-center gap-2 bg-background/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-border/80 text-xs font-bold text-foreground shadow-xl hover:bg-accent transition-all transform hover:scale-105"
        >
          <span>🔍</span>
          <span>Zoom into places</span>
        </button>
      </div>
    </div>
  )
}

export default TripMap