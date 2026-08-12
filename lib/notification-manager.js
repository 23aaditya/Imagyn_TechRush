/**
 * TripNest Background Web Push & Notification Manager
 * Deep links browser notifications back to itinerary spots
 */

const NOTIFIED_ALERTS_KEY = "tripnest_notified_alerts_v1"

function getNotifiedAlertIds() {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(NOTIFIED_ALERTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

function recordNotifiedAlertId(id) {
  if (typeof window === "undefined") return
  try {
    const current = getNotifiedAlertIds()
    if (!current.includes(id)) {
      localStorage.setItem(NOTIFIED_ALERTS_KEY, JSON.stringify([...current, id]))
    }
  } catch (e) {}
}

export async function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported"
  }

  if (Notification.permission === "granted") {
    return "granted"
  }

  try {
    const perm = await Notification.requestPermission()
    return perm
  } catch (err) {
    console.warn("Notification permission request failed:", err)
    return "denied"
  }
}

export function sendTripNotification(alert, spotTitle = "") {
  if (typeof window === "undefined" || !("Notification" in window)) return
  if (Notification.permission !== "granted") return

  // Deduplicate
  const notifiedIds = getNotifiedAlertIds()
  if (notifiedIds.includes(alert.id)) return

  recordNotifiedAlertId(alert.id)

  const title = alert.severity >= 4 ? `🚨 Safety Alert: ${alert.placeName}` : `⚠ ${alert.title}`
  const options = {
    body: `${alert.message} — ${alert.recommendation}`,
    icon: "/tripnest-logo.png",
    badge: "/icon-dark-32x32.png",
    tag: alert.id,
    data: {
      alertId: alert.id,
      spotTitle: spotTitle || alert.affectedSpotTitle || alert.placeName
    }
  }

  try {
    const notif = new Notification(title, options)
    notif.onclick = function (event) {
      event.preventDefault()
      window.focus()
      // Dispatch deep-link custom event to focus itinerary spot
      const targetSpot = alert.affectedSpotTitle || spotTitle || alert.placeName
      window.dispatchEvent(new CustomEvent("tripnest-focus-spot", { detail: { spotTitle: targetSpot } }))
      notif.close()
    }
  } catch (e) {
    console.warn("Could not dispatch browser notification:", e)
  }
}
