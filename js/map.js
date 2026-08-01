/**
 * TripNest — Map Placeholder
 * Future React: MapPlaceholder → MapView with Leaflet/Google Maps
 */

/**
 * Initialize a styled map placeholder
 * @param {HTMLElement} container
 * @param {number} lat
 * @param {number} lng
 * @param {string} name
 */
export function initMapPlaceholder(container, lat, lng, name) {
  if (!container) return;

  // Future integration point:
  // import L from 'leaflet';
  // const map = L.map(container).setView([lat, lng], 10);
  // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  // L.marker([lat, lng]).addTo(map).bindPopup(name);

  container.innerHTML = `
    <div class="map-placeholder">
      <div class="map-grid" aria-hidden="true"></div>
      <div class="map-pin">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <p><strong>${name}</strong></p>
        <p class="map-coords">${lat.toFixed(4)}°, ${lng.toFixed(4)}°</p>
        <p class="map-coords" style="margin-top: 0.5rem; font-style: italic;">Map integration coming soon</p>
      </div>
    </div>
  `;
}
