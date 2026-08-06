"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import L from "leaflet"

// Map Auto-Bound Adjuster & Invalidate Size Trigger
function MapBoundsUpdater({ spots, nearbyPlaces, forceZoomTrigger }) {
  const map = useMap()

  // Invalidate Leaflet container size after animation finishes
  useEffect(() => {
    if (!map) return

    const invalidate = () => map.invalidateSize()
    invalidate()

    // Delayed invalidates to catch Framer Motion container transitions
    const t1 = setTimeout(invalidate, 100)
    const t2 = setTimeout(invalidate, 300)
    const t3 = setTimeout(invalidate, 600)

    const coords = []
    spots?.forEach((s) => {
      if (s.lat && s.lng) coords.push([s.lat, s.lng])
    })
    nearbyPlaces?.forEach((p) => {
      if (p.lat && p.lng) coords.push([p.lat, p.lng])
    })

    if (coords.length > 1) {
      const bounds = L.latLngBounds(coords)
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
    } else if (coords.length === 1) {
      map.setView(coords[0], 13)
    }

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [spots, nearbyPlaces, forceZoomTrigger, map])

  return null
}

// Google / Apple Travel Style Blue Teardrop Marker Icon
const createGoogleStyleSpotIcon = (index, isHovered) => {
  const color = isHovered ? "#ec4899" : "#2563eb"
  const scale = isHovered ? "scale(1.25)" : "scale(1)"
  const zIndex = isHovered ? "999" : "100"

  return L.divIcon({
    className: "google-spot-marker",
    html: `
      <div style="
        position: relative;
        width: 36px;
        height: 46px;
        transform: ${scale};
        transition: transform 0.25s ease;
        z-index: ${zIndex};
        filter: drop-shadow(0px 4px 10px rgba(0,0,0,0.35));
      ">
        <svg viewBox="0 0 384 512" width="36" height="46" fill="${color}">
          <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
        </svg>
        <div style="
          position: absolute;
          top: 8px;
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
          font-family: sans-serif;
        ">
          ${index + 1}
        </div>
      </div>
    `,
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -42]
  })
}

// Red Pulsing Utility Pin Marker Icon for Nearby Places
const createNearbyIcon = () => {
  return L.divIcon({
    className: "google-nearby-marker",
    html: `
      <div style="position: relative; width: 28px; height: 36px; filter: drop-shadow(0px 2px 5px rgba(239,68,68,0.4));">
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
}

export default function TripMap({ spots = [], nearbyPlaces = [], hoveredSpotId = null, onSpotClick = null }) {
  const [tileLayerType, setTileLayerType] = useState("voyager") // 'voyager' | 'satellite' | 'streets'
  const [zoomTrigger, setZoomTrigger] = useState(0)

  // Default Center if no spots
  const defaultCenter = spots.length > 0 && spots[0].lat && spots[0].lng
    ? [spots[0].lat, spots[0].lng]
    : [15.5553, 73.7517]

  const spotCoords = spots
    .filter((s) => s.lat && s.lng)
    .map((s) => [s.lat, s.lng])

  // Premium Crisp High-DPI Vector Tile Layers
  const tileUrls = {
    voyager: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    streets: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  }

  return (
    <div className="h-full w-full relative overflow-hidden rounded-2xl min-h-[520px]">
      
      {/* Top Right Floating Map Style Controls */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-1.5 bg-background/90 backdrop-blur-md p-1.5 rounded-xl border border-border/70 shadow-lg">
        {[
          { key: "voyager", label: "🗺️ Voyager HD" },
          { key: "satellite", label: "🛰️ Satellite" },
          { key: "streets", label: "🌐 Streets" }
        ].map((layer) => (
          <button
            key={layer.key}
            type="button"
            onClick={() => setTileLayerType(layer.key)}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
              tileLayerType === layer.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {layer.label}
          </button>
        ))}
      </div>

      {/* Bottom Left Floating "Zoom into places" Pill Button */}
      <div className="absolute bottom-4 left-4 z-[400]">
        <button
          type="button"
          onClick={() => setZoomTrigger((prev) => prev + 1)}
          className="flex items-center gap-2 bg-background/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-border/80 text-xs font-bold text-foreground shadow-xl hover:bg-accent transition-all transform hover:scale-105"
        >
          <span>🔍</span>
          <span>Zoom into places</span>
        </button>
      </div>

      {/* Main Leaflet Map Container */}
      <MapContainer
        center={defaultCenter}
        zoom={12}
        zoomControl={true}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", minHeight: "600px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={tileUrls[tileLayerType]}
          maxZoom={19}
        />

        {/* Dynamic Bounds Auto-Fitter & Size Invalidator */}
        <MapBoundsUpdater spots={spots} nearbyPlaces={nearbyPlaces} forceZoomTrigger={zoomTrigger} />

        {/* Plot Active Day Spot Markers */}
        {spots.map((spot, idx) => {
          if (!spot.lat || !spot.lng) return null
          const isHovered = spot.id === hoveredSpotId
          return (
            <Marker
              key={spot.id || idx}
              position={[spot.lat, spot.lng]}
              icon={createGoogleStyleSpotIcon(idx, isHovered)}
              eventHandlers={{
                click: () => onSpotClick && onSpotClick(spot.id)
              }}
            >
              <Popup>
                <div style={{ fontFamily: "sans-serif", padding: "4px", minWidth: "170px" }}>
                  <div style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>
                    #{idx + 1} {spot.title}
                  </div>
                  <div style={{ fontSize: "12px", color: "#2563eb", fontWeight: "700", marginTop: "2px" }}>
                    Price: {spot.cost}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                    🕒 {spot.time} ({spot.openingHours || "09:00 AM - 07:00 PM"})
                  </div>
                  {spot.desc && (
                    <p style={{ fontSize: "11px", color: "#475569", marginTop: "4px", lineHeight: "1.3" }}>
                      {spot.desc}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}

        {/* Plot Dashed Blue Route Polyline */}
        {spotCoords.length > 1 && (
          <Polyline
            positions={spotCoords}
            pathOptions={{
              color: "#2563eb",
              weight: 4,
              dashArray: "8, 8",
              opacity: 0.85
            }}
          />
        )}

        {/* Plot Nearby Red Utility Pin Markers */}
        {nearbyPlaces.map((place, pIdx) => {
          if (!place.lat || !place.lng) return null
          return (
            <Marker
              key={`nearby-${pIdx}`}
              position={[place.lat, place.lng]}
              icon={createNearbyIcon()}
            >
              <Popup>
                <div style={{ fontFamily: "sans-serif", padding: "2px" }}>
                  <strong style={{ color: "#ef4444", fontSize: "13px" }}>{place.name}</strong>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                    {place.type} • {place.rating}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}

      </MapContainer>
    </div>
  )
}