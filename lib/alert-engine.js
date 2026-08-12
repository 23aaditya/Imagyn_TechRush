/**
 * TripNest Crowd & Safety Alert Engine
 * 6-Tier Severity Model & Itinerary Conflict Detection
 */

export const ALERT_SEVERITY = {
  0: { level: 0, key: "NORMAL", label: "Normal", color: "text-muted-foreground", bg: "bg-muted", border: "border-border" },
  1: { level: 1, key: "BUSY", label: "Busier than Usual", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  2: { level: 2, key: "HIGH_CROWD", label: "High Crowd Expected", color: "text-amber-800 dark:text-amber-200", bg: "bg-amber-500/15", border: "border-amber-500/30" },
  3: { level: 3, key: "EXTREME_CROWD", label: "Extreme Crowd Density", color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-500/15", border: "border-orange-500/30" },
  4: { level: 4, key: "DISRUPTION", label: "Travel Disruption", color: "text-rose-700 dark:text-rose-300", bg: "bg-rose-500/15", border: "border-rose-500/30" },
  5: { level: 5, key: "SAFETY", label: "Travel Safety Alert", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-600/20", border: "border-rose-600/40" },
}

export const INITIAL_TRAVEL_ALERTS = [
  {
    id: "alert-baga-crowd",
    type: "crowd",
    severity: 2,
    placeName: "Baga & Calangute Water Sports",
    destination: "Goa",
    title: "High Crowd Expected During Sunset",
    message: "High visitor volume reported near Baga beach shacks and watersports counter.",
    recommendation: "Consider visiting 45–60 minutes earlier or arrive after 7:30 PM.",
    peakHours: "05:30 PM – 07:30 PM",
    timestamp: "Updated 15 mins ago",
    source: "Goa Coastal Crowd Intel",
    status: "active",
    affectedSpotTitle: "Baga & Calangute Water Sports"
  },
  {
    id: "alert-calangute-flooding",
    type: "safety",
    severity: 4,
    placeName: "Calangute Access Road",
    destination: "Goa",
    title: "Heavy High Tide & Access Caution",
    message: "High ocean tide and surface water logging reported near northern access road.",
    recommendation: "Exercise caution. Use main arterial road or consider alternate timing.",
    peakHours: "04:00 PM – 06:30 PM",
    timestamp: "Updated 30 mins ago",
    source: "Goa Maritime Safety & Traffic Division",
    status: "active",
    affectedSpotTitle: "Calangute Market"
  },
  {
    id: "alert-uluwatu-tide",
    type: "weather",
    severity: 3,
    placeName: "Uluwatu Cliff Temple",
    destination: "Bali",
    title: "High Ocean Swell & Cliff Trail Caution",
    message: "Strong ocean waves and wet steps along the lower cliff vantage walk.",
    recommendation: "Remain on upper terrace viewing area during evening Kecak dance.",
    peakHours: "05:00 PM – 07:00 PM",
    timestamp: "Updated 1 hour ago",
    source: "Bali Maritime Meteorological Office",
    status: "active",
    affectedSpotTitle: "Uluwatu Cliff Temple & Kecak Dance"
  },
  {
    id: "alert-tegalalang-busy",
    type: "crowd",
    severity: 1,
    placeName: "Tegalalang Rice Terraces",
    destination: "Bali",
    title: "Busier than Usual Near Jungle Swings",
    message: "Moderate tour bus arrivals expected between mid-morning and early afternoon.",
    recommendation: "Early morning visit (before 09:30 AM) offers serene photography.",
    peakHours: "10:30 AM – 02:00 PM",
    timestamp: "Updated 2 hours ago",
    source: "Ubud Tourism Board",
    status: "active",
    affectedSpotTitle: "Tegalalang Rice Terraces"
  }
]

/**
 * Match active alerts with user's itinerary items
 */
export function checkItineraryAlertConflicts(itinerary = [], destination = "", customAlerts = INITIAL_TRAVEL_ALERTS) {
  if (!itinerary || itinerary.length === 0) return []

  const matchedConflicts = []

  itinerary.forEach((dayPlan, dayIndex) => {
    if (!dayPlan.activities) return

    dayPlan.activities.forEach((activity) => {
      const actTitle = (activity.title || activity.name || "").toLowerCase()

      const matchingAlert = customAlerts.find((alt) => {
        if (alt.status === "resolved") return false

        const alertPlace = (alt.affectedSpotTitle || alt.placeName || "").toLowerCase()
        const isDestMatch = !destination || alt.destination.toLowerCase() === destination.toLowerCase()

        return isDestMatch && (actTitle.includes(alertPlace) || alertPlace.includes(actTitle))
      })

      if (matchingAlert) {
        matchedConflicts.push({
          dayIndex,
          dayNumber: dayPlan.day || dayIndex + 1,
          spotId: activity.id,
          spotTitle: activity.title || activity.name,
          spotTime: activity.time || "Scheduled",
          alert: matchingAlert,
          overlapWarning: `Your planned visit (${activity.time || "Scheduled"}) overlaps with active alert: ${matchingAlert.title}`
        })
      }
    })
  })

  return matchedConflicts
}
