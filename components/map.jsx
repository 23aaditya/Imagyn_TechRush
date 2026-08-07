"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import L from "leaflet"

// Map Auto-Bound Adjuster & Invalidate Size Trigger
function MapBoundsUpdater({ spots, nearbyPlaces, forceZoomTrigger }) {
  const map = useMap()

  // Invalidate Leaflet container size after animation finishes
  useEffect(() => {
    if (!mapContainerRef.current) return

    const initialCenter = spots.length > 0 && spots[0].lng && spots[0].lat
      ? [spots[0].lng, spots[0].lat]
      : [73.7517, 15.5553]

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[activeStyle],
      center: initialCenter,
      zoom: 12,
      pitch: 0,
      attributionControl: true
    })

    // Add Navigation Control (Zoom & Rotate)
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-left")

    mapRef.current = map

    const resizeObserver = new ResizeObserver(() => {
      map.resize()
    })
    resizeObserver.observe(mapContainerRef.current)

    // Interval resize timers to guarantee full rendering after Framer Motion layout transitions
    const t1 = setTimeout(() => map.resize(), 100)
    const t2 = setTimeout(() => map.resize(), 300)
    const t3 = setTimeout(() => map.resize(), 600)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      resizeObserver.disconnect()
      map.remove()
      mapRef.current = null
    }
  }, [])

  // 2. Change Style Layer
  useEffect(() => {
    if (mapRef.current && MAP_STYLES[activeStyle]) {
      mapRef.current.setStyle(MAP_STYLES[activeStyle])
    }
  }, [activeStyle])

  // 3. Update Spot Markers, Nearby Markers & GeoJSON Dashed Route Line
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Clear existing spot markers
    spotMarkersRef.current.forEach((m) => m.remove())
    spotMarkersRef.current = []

    // Clear existing nearby markers
    nearbyMarkersRef.current.forEach((m) => m.remove())
    nearbyMarkersRef.current = []

    const validSpots = spots.filter((s) => s.lat && s.lng)

    // Plot Numbered Teardrop Spot Markers
    validSpots.forEach((spot, idx) => {
      const isHovered = spot.id === hoveredSpotId
      const color = isHovered ? "#ec4899" : "#2563eb"
      const scale = isHovered ? "scale(1.25)" : "scale(1)"

      const el = document.createElement("div")
      el.className = "maplibre-spot-marker"
      el.style.cursor = "pointer"
      el.style.transition = "all 0.2s ease"
      el.style.transform = scale

      el.innerHTML = `
        <div style="position: relative; width: 36px; height: 46px; filter: drop-shadow(0px 4px 10px rgba(0,0,0,0.35));">
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
            ${idx + 1}
          </div>
        </div>
      `

      const popup = new maplibregl.Popup({ offset: [0, -38] }).setHTML(`
        <div style="font-family: sans-serif; padding: 4px; min-width: 170px;">
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
      `)

      el.addEventListener("click", () => {
        onSpotClick && onSpotClick(spot.id)
      })

      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([spot.lng, spot.lat])
        .setPopup(popup)
        .addTo(map)

      spotMarkersRef.current.push(marker)
    })

    // Plot Red Pins for Nearby Utility Places
    nearbyPlaces.forEach((place) => {
      if (!place.lat || !place.lng) return

      const el = document.createElement("div")
      el.className = "maplibre-nearby-marker"
      el.style.cursor = "pointer"
      el.innerHTML = `
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
      `

      const popup = new maplibregl.Popup({ offset: [0, -30] }).setHTML(`
        <div style="font-family: sans-serif; padding: 2px;">
          <strong style="color: #ef4444; font-size: 13px;">${place.name}</strong>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${place.type} • ${place.rating}</div>
        </div>
      `)

      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([place.lng, place.lat])
        .setPopup(popup)
        .addTo(map)

      nearbyMarkersRef.current.push(marker)
    })

    // Draw Dashed Blue Route Line (GeoJSON Source)
    const coordinates = validSpots.map((s) => [s.lng, s.lat])

    const drawRoute = () => {
      if (!map.isStyleLoaded()) return

      const routeData = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: coordinates
        }
      }

      if (map.getSource("trip-route")) {
        map.getSource("trip-route").setData(routeData)
      } else if (coordinates.length > 1) {
        map.addSource("trip-route", {
          type: "geojson",
          data: routeData
        })

        map.addLayer({
          id: "trip-route-line",
          type: "line",
          source: "trip-route",
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            "line-color": "#2563eb",
            "line-width": 4,
            "line-dasharray": [2, 2],
            "line-opacity": 0.85
          }
        })
      }
    }

    if (map.isStyleLoaded()) {
      drawRoute()
    } else {
      map.once("style.load", drawRoute)
    }

    // Auto Fit Bounds around active markers
    const boundsCoords = [
      ...coordinates,
      ...nearbyPlaces.filter((p) => p.lat && p.lng).map((p) => [p.lng, p.lat])
    ]

    if (boundsCoords.length > 1) {
      const bounds = boundsCoords.reduce(
        (b, coord) => b.extend(coord),
        new maplibregl.LngLatBounds(boundsCoords[0], boundsCoords[0])
      )
      map.fitBounds(bounds, { padding: 60, maxZoom: 14, duration: 800 })
    } else if (boundsCoords.length === 1) {
      map.flyTo({ center: boundsCoords[0], zoom: 13, duration: 800 })
    }
  }, [spots, nearbyPlaces, hoveredSpotId])

  // Trigger Bounds Fit on "Zoom into places" Click
  const handleZoomIntoPlaces = () => {
    const map = mapRef.current
    if (!map) return

    const coords = [
      ...spots.filter((s) => s.lat && s.lng).map((s) => [s.lng, s.lat]),
      ...nearbyPlaces.filter((p) => p.lat && p.lng).map((p) => [p.lng, p.lat])
    ]

    if (coords.length > 0) {
      const bounds = coords.reduce(
        (b, coord) => b.extend(coord),
        new maplibregl.LngLatBounds(coords[0], coords[0])
      )
      map.fitBounds(bounds, { padding: 60, maxZoom: 14, duration: 800 })
    }
  }

  return (
    <div className="h-full w-full relative overflow-hidden rounded-3xl min-h-[580px] border border-border/80 shadow-2xl bg-card">
      
      {/* MapLibre Container Div */}
      <div ref={mapContainerRef} className="absolute inset-0 h-full w-full" />

      {/* Top Right Floating Style Switcher */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-background/90 backdrop-blur-md p-1.5 rounded-xl border border-border/70 shadow-lg">
        {[
          { key: "voyager", label: "🗺️ Voyager HD" },
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

      {/* Bottom Left Floating "Zoom into places" Button */}
      <div className="absolute bottom-4 left-4 z-10">
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