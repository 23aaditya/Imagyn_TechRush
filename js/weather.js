/**
 * TripNest — Weather Widget & Suitability
 * Future React: WeatherWidget component
 */

const WEATHER_ICONS = {
  sunny: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
  rainy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 13v8M8 13v8M12 15v8M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>`,
  snowy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="8" y1="20" x2="8.01" y2="20"/><line x1="12" y1="18" x2="12.01" y2="18"/><line x1="12" y1="22" x2="12.01" y2="22"/><line x1="16" y1="16" x2="16.01" y2="16"/><line x1="16" y1="20" x2="16.01" y2="20"/></svg>`,
  mild: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20.25"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="8" y1="20" x2="8.01" y2="20"/><line x1="12" y1="18" x2="12.01" y2="18"/><line x1="12" y1="22" x2="12.01" y2="22"/></svg>`
};

const WEATHER_LABELS = {
  sunny: 'Sunny & Clear',
  rainy: 'Rainy',
  snowy: 'Snowy & Cold',
  mild: 'Mild & Pleasant'
};

/** Mock extended weather data keyed by destination id */
const MOCK_WEATHER = {
  'bali': { humidity: 75, wind: 12, feelsLike: 33 },
  'swiss-alps': { humidity: 65, wind: 20, feelsLike: -5 },
  'paris': { humidity: 60, wind: 15, feelsLike: 16 },
  'kyoto': { humidity: 55, wind: 8, feelsLike: 21 },
  'santorini': { humidity: 50, wind: 18, feelsLike: 30 },
  'dubai': { humidity: 40, wind: 10, feelsLike: 27 },
  'kerala': { humidity: 85, wind: 8, feelsLike: 31 },
  'new-york': { humidity: 55, wind: 22, feelsLike: 14 },
  'machu-picchu': { humidity: 70, wind: 5, feelsLike: 18 },
  'maldives': { humidity: 78, wind: 14, feelsLike: 32 },
  'rajasthan': { humidity: 30, wind: 8, feelsLike: 24 },
  'banff': { humidity: 45, wind: 12, feelsLike: 13 }
};

/**
 * Get suitability badges for a destination
 * @param {Object} dest
 * @returns {Array<{text: string, class: string}>}
 */
export function getSuitabilityBadge(dest) {
  const badges = [];

  if (dest.weather === 'sunny' || dest.weather === 'mild') {
    badges.push({ text: 'Great time to visit', class: 'badge-success' });
  } else if (dest.weather === 'rainy') {
    badges.push({ text: 'Pack rain gear', class: 'badge-warning' });
  } else if (dest.weather === 'snowy') {
    badges.push({ text: 'Winter conditions', class: 'badge-accent' });
  }

  if (dest.trafficLevel === 'high') {
    badges.push({ text: 'Crowded — book ahead', class: 'badge-warning' });
  } else if (dest.trafficLevel === 'low') {
    badges.push({ text: 'Off the beaten path', class: 'badge-success' });
  } else {
    badges.push({ text: 'Moderate crowds', class: 'badge-accent' });
  }

  return badges;
}

/**
 * Render weather widget into container
 * @param {HTMLElement} container
 * @param {Object} dest
 */
export function renderWeatherWidget(container, dest) {
  if (!container || !dest) return;

  const extra = MOCK_WEATHER[dest.id] || { humidity: 60, wind: 10, feelsLike: dest.tempC };
  const icon = WEATHER_ICONS[dest.weather] || WEATHER_ICONS.mild;
  const label = WEATHER_LABELS[dest.weather] || 'Current Conditions';

  container.innerHTML = `
    <div class="weather-widget">
      <div class="weather-icon">${icon}</div>
      <div class="weather-details">
        <h4>${dest.tempC}°C</h4>
        <p>${label}</p>
        <p class="text-muted" style="font-size: 0.8125rem; margin-top: 0.25rem;">
          Feels like ${extra.feelsLike}°C · Humidity ${extra.humidity}% · Wind ${extra.wind} km/h
        </p>
      </div>
    </div>
  `;
}

/**
 * Get weather summary string for comparison
 * @param {Object} dest
 * @returns {string}
 */
export function getWeatherSummary(dest) {
  return `${dest.tempC}°C, ${WEATHER_LABELS[dest.weather] || dest.weather}`;
}
