/**
 * TripNest — Destinations Data, Filtering & Modal
 * Future React: DestinationsGrid, DestinationModal, useDestinations
 */

import { renderWeatherWidget, getSuitabilityBadge } from './weather.js';
import { initMapPlaceholder } from './map.js';

/** @type {Array<Object>} */
export const destinations = [
  {
    id: 'bali',
    name: 'Bali',
    location: 'Indonesia',
    type: 'beach',
    season: 'summer',
    weather: 'sunny',
    tempC: 30,
    budgetUSD: 950,
    lat: -8.4095,
    lng: 115.1889,
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80',
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80'
    ],
    description: 'Bali is a tropical paradise known for its forested volcanic mountains, iconic rice paddies, beaches, and coral reefs. The island offers a perfect blend of spiritual culture, adventure, and relaxation.',
    bestTime: 'April to October (Dry Season)',
    attractions: ['Ubud Monkey Forest', 'Tanah Lot Temple', 'Tegallalang Rice Terraces', 'Uluwatu Temple'],
    food: ['Nasi Goreng', 'Babi Guling', 'Satay Lilit', 'Lawar'],
    activities: ['Surfing in Kuta', 'Yoga in Ubud', 'Snorkeling', 'Temple hopping'],
    trafficLevel: 'moderate'
  },
  {
    id: 'swiss-alps',
    name: 'Swiss Alps',
    location: 'Switzerland',
    type: 'mountain',
    season: 'winter',
    weather: 'snowy',
    tempC: -2,
    budgetUSD: 2200,
    lat: 46.8182,
    lng: 8.2275,
    images: [
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1483728642387-6c3bddc390ce?w=800&q=80'
    ],
    description: 'The Swiss Alps offer breathtaking mountain scenery, world-class skiing, charming alpine villages, and pristine lakes. A dream destination for adventure seekers and nature lovers.',
    bestTime: 'December to March (Skiing) / June to September (Hiking)',
    attractions: ['Matterhorn', 'Jungfraujoch', 'Interlaken', 'Lake Geneva'],
    food: ['Fondue', 'Rösti', 'Swiss Chocolate', 'Alpine Macaroni'],
    activities: ['Skiing & Snowboarding', 'Mountain hiking', 'Paragliding', 'Scenic train rides'],
    trafficLevel: 'high'
  },
  {
    id: 'paris',
    name: 'Paris',
    location: 'France',
    type: 'city',
    season: 'spring',
    weather: 'mild',
    tempC: 18,
    budgetUSD: 1800,
    lat: 48.8566,
    lng: 2.3522,
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
      'https://images.unsplash.com/photo-1431274172761-fca41d094948?w=800&q=80'
    ],
    description: 'The City of Light captivates with its iconic landmarks, world-renowned art museums, charming cafés, and romantic atmosphere along the Seine River.',
    bestTime: 'April to June & September to October',
    attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Montmartre'],
    food: ['Croissants', 'Escargot', 'Crêpes', 'French Onion Soup'],
    activities: ['Museum tours', 'Seine river cruise', 'Shopping on Champs-Élysées', 'Wine tasting'],
    trafficLevel: 'high'
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    location: 'Japan',
    type: 'heritage',
    season: 'spring',
    weather: 'mild',
    tempC: 20,
    budgetUSD: 1600,
    lat: 35.0116,
    lng: 135.7681,
    images: [
      'https://images.unsplash.com/photo-1493976040374-85c8e9127841?w=800&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
      'https://images.unsplash.com/photo-1528360980567-793de8f7a4ef?w=800&q=80'
    ],
    description: 'Kyoto is Japan\'s cultural heart, home to over 1,600 Buddhist temples, 400 Shinto shrines, and stunning gardens. Experience traditional tea ceremonies and geisha districts.',
    bestTime: 'March to May (Cherry Blossoms) & October to November',
    attractions: ['Fushimi Inari Shrine', 'Kinkaku-ji', 'Arashiyama Bamboo Grove', 'Gion District'],
    food: ['Kaiseki Ryori', 'Matcha Tea', 'Yudofu', 'Obanzai'],
    activities: ['Temple visits', 'Tea ceremony', 'Kimono experience', 'Cherry blossom viewing'],
    trafficLevel: 'moderate'
  },
  {
    id: 'santorini',
    name: 'Santorini',
    location: 'Greece',
    type: 'beach',
    season: 'summer',
    weather: 'sunny',
    tempC: 28,
    budgetUSD: 1400,
    lat: 36.3932,
    lng: 25.4615,
    images: [
      'https://images.unsplash.com/photo-1570077188670-e3a8e69ad5d0?w=800&q=80',
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d325?w=800&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482357?w=800&q=80'
    ],
    description: 'Famous for its whitewashed buildings with blue domes perched on cliffs overlooking the Aegean Sea. Santorini offers stunning sunsets, volcanic beaches, and Mediterranean charm.',
    bestTime: 'May to October',
    attractions: ['Oia Village', 'Red Beach', 'Akrotiri Ruins', 'Fira Town'],
    food: ['Moussaka', 'Souvlaki', 'Fava Bean Dip', 'Baklava'],
    activities: ['Sunset watching', 'Wine tasting', 'Boat tours', 'Volcano hiking'],
    trafficLevel: 'high'
  },
  {
    id: 'dubai',
    name: 'Dubai',
    location: 'UAE',
    type: 'city',
    season: 'winter',
    weather: 'sunny',
    tempC: 25,
    budgetUSD: 2000,
    lat: 25.2048,
    lng: 55.2708,
    images: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
      'https://images.unsplash.com/photo-1582672060674-d280f770f692?w=800&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80'
    ],
    description: 'A futuristic metropolis blending ultramodern architecture with Arabian heritage. Dubai offers luxury shopping, desert safaris, and record-breaking attractions.',
    bestTime: 'November to March',
    attractions: ['Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall', 'Desert Safari'],
    food: ['Shawarma', 'Al Harees', 'Luqaimat', 'Machboos'],
    activities: ['Desert safari', 'Skydiving', 'Luxury shopping', 'Dhow cruise'],
    trafficLevel: 'moderate'
  },
  {
    id: 'kerala',
    name: 'Kerala',
    location: 'India',
    type: 'forest',
    season: 'monsoon',
    weather: 'rainy',
    tempC: 28,
    budgetUSD: 600,
    lat: 10.8505,
    lng: 76.2711,
    images: [
      'https://images.unsplash.com/photo-1602216052126-53d08b1403a2?w=800&q=80',
      'https://images.unsplash.com/photo-1593693397649-3694a293a5e9?w=800&q=80',
      'https://images.unsplash.com/photo-1580619305218-8423a1a1f4a6?w=800&q=80'
    ],
    description: 'Known as "God\'s Own Country," Kerala features serene backwaters, lush hill stations, spice plantations, and Ayurvedic wellness retreats along the Malabar Coast.',
    bestTime: 'September to March',
    attractions: ['Alleppey Backwaters', 'Munnar Tea Gardens', 'Fort Kochi', 'Wayanad Wildlife'],
    food: ['Appam & Stew', 'Fish Curry', 'Puttu', 'Sadya'],
    activities: ['Houseboat cruise', 'Ayurvedic spa', 'Wildlife safari', 'Tea plantation tour'],
    trafficLevel: 'low'
  },
  {
    id: 'new-york',
    name: 'New York',
    location: 'USA',
    type: 'city',
    season: 'spring',
    weather: 'mild',
    tempC: 16,
    budgetUSD: 1900,
    lat: 40.7128,
    lng: -74.006,
    images: [
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
      'https://images.unsplash.com/photo-1485871981521-5b1cc544bf49?w=800&q=80',
      'https://images.unsplash.com/photo-1534430480872-6a8a1936f70e?w=800&q=80'
    ],
    description: 'The city that never sleeps offers iconic skyline views, Broadway shows, diverse neighborhoods, world-class dining, and endless cultural experiences.',
    bestTime: 'April to June & September to November',
    attractions: ['Statue of Liberty', 'Central Park', 'Times Square', 'Brooklyn Bridge'],
    food: ['NY Pizza', 'Bagels', 'Cheesecake', 'Hot Dogs'],
    activities: ['Broadway show', 'Museum hopping', 'Central Park walk', 'Rooftop bars'],
    trafficLevel: 'high'
  },
  {
    id: 'machu-picchu',
    name: 'Machu Picchu',
    location: 'Peru',
    type: 'heritage',
    season: 'summer',
    weather: 'mild',
    tempC: 19,
    budgetUSD: 1200,
    lat: -13.1631,
    lng: -72.545,
    images: [
      'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80',
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80'
    ],
    description: 'The ancient Incan citadel set high in the Andes Mountains is one of the most iconic archaeological sites in the world, offering mystical ruins and breathtaking vistas.',
    bestTime: 'May to September (Dry Season)',
    attractions: ['Sun Gate', 'Temple of the Sun', 'Inca Bridge', 'Huayna Picchu'],
    food: ['Ceviche', 'Lomo Saltado', 'Quinoa Soup', 'Pisco Sour'],
    activities: ['Inca Trail hike', 'Ruins exploration', 'Alpaca encounters', 'Sacred Valley tour'],
    trafficLevel: 'moderate'
  },
  {
    id: 'maldives',
    name: 'Maldives',
    location: 'Maldives',
    type: 'beach',
    season: 'winter',
    weather: 'sunny',
    tempC: 29,
    budgetUSD: 2500,
    lat: 3.2028,
    lng: 73.2207,
    images: [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
      'https://images.unsplash.com/photo-1573843981267-be1999a37a56?w=800&q=80',
      'https://images.unsplash.com/photo-1559127326-66ed2d0a0362?w=800&q=80'
    ],
    description: 'A tropical nation of 26 atolls with overwater bungalows, crystal-clear turquoise lagoons, vibrant coral reefs, and unparalleled luxury resort experiences.',
    bestTime: 'November to April',
    attractions: ['Overwater Villas', 'Coral Reefs', 'Bioluminescent Beach', 'Male City'],
    food: ['Garudhiya', 'Mas Huni', 'Rihaakuru', 'Fresh Seafood'],
    activities: ['Snorkeling & Diving', 'Sunset cruise', 'Spa treatments', 'Dolphin watching'],
    trafficLevel: 'low'
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    location: 'India',
    type: 'heritage',
    season: 'winter',
    weather: 'sunny',
    tempC: 22,
    budgetUSD: 700,
    lat: 26.9124,
    lng: 75.7873,
    images: [
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
      'https://images.unsplash.com/photo-1599661046280-e1348828589d?w=800&q=80',
      'https://images.unsplash.com/photo-1609137144816-7d37b7a4a570?w=800&q=80'
    ],
    description: 'The Land of Kings features magnificent palaces, desert landscapes, vibrant festivals, and rich Rajputana culture across its historic cities and golden sand dunes.',
    bestTime: 'October to March',
    attractions: ['Amber Fort', 'Hawa Mahal', 'Jaisalmer Fort', 'Udaipur Lakes'],
    food: ['Dal Baati Churma', 'Laal Maas', 'Ghevar', 'Pyaaz Kachori'],
    activities: ['Desert camel safari', 'Palace tours', 'Folk dance shows', 'Hot air balloon ride'],
    trafficLevel: 'moderate'
  },
  {
    id: 'banff',
    name: 'Banff',
    location: 'Canada',
    type: 'mountain',
    season: 'summer',
    weather: 'mild',
    tempC: 15,
    budgetUSD: 1500,
    lat: 51.1784,
    lng: -115.5708,
    images: [
      'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622997272?w=800&q=80',
      'https://images.unsplash.com/photo-1519832976-5f993d0c9dd7?w=800&q=80'
    ],
    description: 'Nestled in the Canadian Rockies, Banff National Park offers turquoise lakes, snow-capped peaks, abundant wildlife, and world-class outdoor adventures.',
    bestTime: 'June to August & December to March',
    attractions: ['Lake Louise', 'Moraine Lake', 'Banff Gondola', 'Johnston Canyon'],
    food: ['Bison Burger', 'Maple Syrup Treats', 'Poutine', 'Alberta Beef'],
    activities: ['Lake canoeing', 'Wildlife spotting', 'Skiing', 'Hiking trails'],
    trafficLevel: 'moderate'
  }
];

const TYPE_LABELS = {
  beach: 'Beach',
  mountain: 'Mountain',
  city: 'City',
  heritage: 'Heritage',
  forest: 'Forest'
};

let activeTypeFilter = '';
let activeFilters = {
  search: '',
  weather: '',
  budget: '',
  season: ''
};

/**
 * Get destination by ID
 * @param {string} id
 * @returns {Object|undefined}
 */
export function getDestinationById(id) {
  return destinations.find(d => d.id === id);
}

/**
 * Format budget for display
 * @param {number} amount
 * @returns {string}
 */
export function formatBudget(amount) {
  return `$${amount.toLocaleString()}`;
}

/**
 * Get budget tier for filtering
 * @param {number} amount
 * @returns {string}
 */
function getBudgetTier(amount) {
  if (amount < 800) return 'low';
  if (amount <= 1500) return 'mid';
  return 'high';
}

/**
 * Filter destinations based on active filters
 * @returns {Array}
 */
export function filterDestinations() {
  return destinations.filter(dest => {
    const searchLower = activeFilters.search.toLowerCase();
    if (searchLower && !dest.name.toLowerCase().includes(searchLower) &&
        !dest.location.toLowerCase().includes(searchLower)) {
      return false;
    }
    if (activeFilters.weather && dest.weather !== activeFilters.weather) return false;
    if (activeFilters.budget && getBudgetTier(dest.budgetUSD) !== activeFilters.budget) return false;
    if (activeFilters.season && dest.season !== activeFilters.season) return false;
    if (activeTypeFilter && dest.type !== activeTypeFilter) return false;
    return true;
  });
}

/**
 * Render a single destination card
 * @param {Object} dest
 * @param {number} index
 * @returns {string}
 */
function renderCard(dest, index) {
  const delay = Math.min(index * 0.05, 0.4);
  return `
    <article class="dest-card card-animate" style="transition-delay: ${delay}s" data-id="${dest.id}">
      <div class="dest-card-image">
        <img src="${dest.images[0]}" alt="${dest.name}, ${dest.location}" loading="lazy">
        <span class="dest-card-type badge">${TYPE_LABELS[dest.type] || dest.type}</span>
        <span class="dest-card-temp">${dest.tempC}°C</span>
      </div>
      <div class="dest-card-body">
        <h3>${dest.name}</h3>
        <p class="dest-card-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${dest.location}
        </p>
        <div class="dest-card-meta">
          <span class="dest-card-budget">${formatBudget(dest.budgetUSD)}</span>
          <span class="badge badge-accent">${dest.weather}</span>
        </div>
        <button class="btn btn-primary btn-sm view-details-btn" data-id="${dest.id}">View Details</button>
      </div>
    </article>
  `;
}

/**
 * Render destination cards grid
 */
function renderGrid() {
  const grid = document.getElementById('destinations');
  if (!grid) return;

  const filtered = filterDestinations();

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <p>No destinations match your filters. Try adjusting your search criteria.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((dest, i) => renderCard(dest, i)).join('');

  requestAnimationFrame(() => {
    grid.querySelectorAll('.card-animate').forEach((card, i) => {
      setTimeout(() => card.classList.add('visible'), i * 50);
    });
  });

  grid.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.id));
  });
}

/**
 * Open destination detail modal
 * @param {string} id
 */
function openModal(id) {
  const dest = getDestinationById(id);
  if (!dest) return;

  const modal = document.getElementById('dest-modal');
  const body = document.getElementById('modal-body');
  const title = document.getElementById('modal-title');

  title.textContent = `${dest.name}, ${dest.location}`;

  const suitability = getSuitabilityBadge(dest);

  body.innerHTML = `
    <div class="modal-gallery">
      <img class="modal-gallery-main" id="modal-main-image" src="${dest.images[0]}" alt="${dest.name}">
    </div>
    <div class="modal-gallery-thumbs">
      ${dest.images.map((img, i) => `
        <img src="${img}" alt="${dest.name} view ${i + 1}" class="${i === 0 ? 'active' : ''}" data-full="${img}">
      `).join('')}
    </div>

    <p class="mt-2">${dest.description}</p>

    <div id="weather-container" class="mt-2"></div>

    <div class="suitability-badges">
      ${suitability.map(b => `<span class="badge ${b.class}">${b.text}</span>`).join('')}
    </div>

    <div class="modal-info-grid">
      <div class="modal-info-card">
        <h4>Best Time to Visit</h4>
        <p>${dest.bestTime}</p>
      </div>
      <div class="modal-info-card">
        <h4>Estimated Budget</h4>
        <p><strong class="text-primary">${formatBudget(dest.budgetUSD)}</strong> per person</p>
      </div>
      <div class="modal-info-card">
        <h4>Popular Attractions</h4>
        <ul class="modal-list">
          ${dest.attractions.map(a => `<li>${a}</li>`).join('')}
        </ul>
      </div>
      <div class="modal-info-card">
        <h4>Local Food</h4>
        <ul class="modal-list">
          ${dest.food.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>
      <div class="modal-info-card">
        <h4>Suggested Activities</h4>
        <ul class="modal-list">
          ${dest.activities.map(a => `<li>${a}</li>`).join('')}
        </ul>
      </div>
      <div class="modal-info-card">
        <h4>Location Map</h4>
        <div id="map-container"></div>
      </div>
    </div>
  `;

  renderWeatherWidget(document.getElementById('weather-container'), dest);
  initMapPlaceholder(document.getElementById('map-container'), dest.lat, dest.lng, dest.name);

  body.querySelectorAll('.modal-gallery-thumbs img').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.getElementById('modal-main-image').src = thumb.dataset.full;
      body.querySelectorAll('.modal-gallery-thumbs img').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  modal.showModal();
}

/**
 * Set search filter from hero form
 * @param {string} query
 */
export function setSearchFilter(query) {
  activeFilters.search = query;
  const searchInput = document.getElementById('filter-search');
  if (searchInput) searchInput.value = query;
  renderGrid();
}

/**
 * Initialize destinations module
 */
export function initDestinations() {
  const searchInput = document.getElementById('filter-search');
  const weatherSelect = document.getElementById('filter-weather');
  const budgetSelect = document.getElementById('filter-budget');
  const seasonSelect = document.getElementById('filter-season');
  const typeChips = document.getElementById('filter-type-chips');
  const modal = document.getElementById('dest-modal');
  const modalClose = document.getElementById('modal-close');

  searchInput?.addEventListener('input', (e) => {
    activeFilters.search = e.target.value;
    renderGrid();
  });

  weatherSelect?.addEventListener('change', (e) => {
    activeFilters.weather = e.target.value;
    renderGrid();
  });

  budgetSelect?.addEventListener('change', (e) => {
    activeFilters.budget = e.target.value;
    renderGrid();
  });

  seasonSelect?.addEventListener('change', (e) => {
    activeFilters.season = e.target.value;
    renderGrid();
  });

  typeChips?.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    typeChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeTypeFilter = chip.dataset.type;
    renderGrid();
  });

  modalClose?.addEventListener('click', () => modal.close());
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });

  renderGrid();
}
