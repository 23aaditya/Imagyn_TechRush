import { initBudget } from './budget.js';
import { initDestinations, setSearchFilter } from './destinations.js';

const panel = document.getElementById('feature-panel');
const closeBtn = document.getElementById('feature-panel-close');
const navButtons = document.querySelectorAll('.nav-link[data-panel]');
const mobileNav = document.getElementById('mobile-nav');
const overlay = document.getElementById('mobile-overlay');
const hamburger = document.getElementById('hamburger');
const themeToggle = document.getElementById('theme-toggle');
const aiTripForm = document.getElementById('ai-trip-form');
const plannerPreview = document.getElementById('planner-preview');
const interestChips = document.querySelectorAll('.interest-chip');
const authTabs = document.querySelectorAll('.auth-tab');
const authForm = document.getElementById('auth-form');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authMessage = document.getElementById('auth-message');
const logoutBtn = document.getElementById('logout-btn');
const signInBtn = document.getElementById('sign-in-btn');
const getStartedBtn = document.getElementById('get-started-btn');
const appShell = document.getElementById('app-shell');
const authScreen = document.getElementById('auth-screen');
const workspaceOfferCards = document.querySelectorAll('.workspace-offer-card');
const featureSections = Array.from(document.querySelectorAll('main > section[id]')).filter(section => section.id !== 'home' && section.id !== 'auth-screen');
const heroSection = document.getElementById('home');
const heroAuthButtons = document.querySelectorAll('[data-auth-action]');
const assistantFab = document.getElementById('assistant-fab');
const assistantPanel = document.getElementById('assistant-panel');
const assistantClose = document.getElementById('assistant-close');

const SECTION_ID_MAP = {
  home: 'home',
  discover: 'explore',
  explore: 'explore',
  destinations: 'explore',
  planner: 'itinerary',
  trip: 'itinerary',
  itinerary: 'itinerary',
  budget: 'budget',
  tracker: 'tracker',
  packing: 'packing',
  compare: 'compare',
  contact: 'contact',
  assistant: 'assistant'
};

let authMode = 'login';
const USERS_KEY = 'tripnest-users';
const ACTIVE_USER_KEY = 'tripnest-active-user';

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setAuthMessage(message, isError = false) {
  if (!authMessage) return;
  authMessage.textContent = message;
  authMessage.style.color = isError ? 'var(--color-danger)' : 'var(--color-success)';
}

function setAuthMode(mode) {
  authMode = mode;
  const isSignup = mode === 'signup';
  document.querySelectorAll('.signup-field').forEach(field => {
    field.style.display = isSignup ? 'flex' : 'none';
  });
  authTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.authMode === mode));
  authSubmitBtn.textContent = isSignup ? 'Create Account' : 'Login to TripNest';
}

function toggleAppState(isAuthenticated) {
  document.body.classList.toggle('authenticated', isAuthenticated);
  appShell?.setAttribute('aria-hidden', String(!isAuthenticated));
  authScreen?.setAttribute('aria-hidden', String(isAuthenticated));

  if (isAuthenticated) {
    appShell?.classList.add('active');
    authScreen?.classList.add('hidden');
    authScreen?.style.setProperty('display', 'none');
    appShell?.style.setProperty('display', 'block');
    heroSection?.style.setProperty('display', 'none');
    featureSections.forEach(section => section.style.setProperty('display', 'none'));
  } else {
    appShell?.classList.remove('active');
    authScreen?.classList.remove('hidden');
    authScreen?.style.setProperty('display', 'none');
    appShell?.style.setProperty('display', 'none');
    heroSection?.style.setProperty('display', 'flex');
    featureSections.forEach(section => section.style.setProperty('display', 'none'));
  }
}

function showWorkspace() {
  toggleAppState(true);
  setActiveNav('home');
}

function showLanding() {
  toggleAppState(false);
  setAuthMode('login');
  setAuthMessage('');
}

function openAuthScreen(mode = 'login') {
  toggleAppState(false);
  setAuthMode(mode);
  setAuthMessage('');
  heroSection?.style.setProperty('display', 'none');
  authScreen?.style.setProperty('display', 'block');
  featureSections.forEach(section => section.style.setProperty('display', 'none'));
  authScreen?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function persistActiveUser(user) {
  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
}

function readActiveUser() {
  try {
    return JSON.parse(localStorage.getItem(ACTIVE_USER_KEY) || 'null');
  } catch {
    return null;
  }
}

function setActiveNav(panelName) {
  document.querySelectorAll('.nav-link[data-panel]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.panel === panelName);
  });
}

function toggleAssistantPanel(forceOpen = false) {
  const shouldOpen = forceOpen || !assistantPanel?.classList.contains('active');
  assistantPanel?.classList.toggle('active', shouldOpen);
  assistantPanel?.setAttribute('aria-hidden', String(!shouldOpen));
}

function closeMobileNav() {
  mobileNav?.classList.remove('active');
  overlay?.classList.remove('active');
  hamburger?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
}

function closePanel() {
  panel?.classList.remove('active');
  panel?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('panel-open');
  setActiveNav('home');
}

function openPanel(panelName) {
  const sectionId = SECTION_ID_MAP[panelName] || 'home';
  const sourceSection = document.getElementById(sectionId);

  if (!panel || !sourceSection) return;

  const clone = sourceSection.cloneNode(true);
  clone.classList.add('feature-panel-section');
  const sidebarMarkup = Array.from(document.querySelectorAll('.nav-link[data-panel]')).map((btn) => {
    const isActive = btn.dataset.panel === panelName;
    return `<button type="button" class="nav-link ${isActive ? 'active' : ''}" data-panel="${btn.dataset.panel}">${btn.textContent.trim()}</button>`;
  }).join('');

  panel.innerHTML = `
    <div class="feature-panel-shell">
      <aside class="feature-panel-sidebar">
        ${sidebarMarkup}
      </aside>
      <div class="feature-panel-content">
        <div class="feature-panel-header">
          <button type="button" class="btn btn-ghost" id="feature-panel-close">Close</button>
        </div>
        ${clone.outerHTML}
      </div>
    </div>
  `;

  const newCloseBtn = panel.querySelector('#feature-panel-close');
  newCloseBtn?.addEventListener('click', closePanel);

  panel.querySelectorAll('.feature-panel-sidebar .nav-link[data-panel]').forEach((button) => {
    button.addEventListener('click', () => openPanel(button.dataset.panel));
  });

  panel.classList.add('active');
  panel.setAttribute('aria-hidden', 'false');
  document.body.classList.add('panel-open');
  closeMobileNav();
  setActiveNav(panelName);
}

navButtons.forEach(button => {
  button.addEventListener('click', () => {
    const { panel } = button.dataset;

    if (panel === 'assistant') {
      toggleAssistantPanel(true);
      return;
    }

    if (!document.body.classList.contains('authenticated')) {
      setAuthMessage('Please login or sign up to access TripNest workspace.', true);
      return;
    }
    openPanel(panel);
  });
});

workspaceOfferCards.forEach(card => {
  card.addEventListener('click', () => openPanel(card.dataset.panel));
});

closeBtn?.addEventListener('click', closePanel);

hamburger?.addEventListener('click', () => {
  const isOpen = mobileNav?.classList.contains('active');
  mobileNav?.classList.toggle('active', !isOpen);
  overlay?.classList.toggle('active', !isOpen);
  hamburger.setAttribute('aria-expanded', String(!isOpen));
  document.body.classList.toggle('nav-open', !isOpen);
});

overlay?.addEventListener('click', closeMobileNav);

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nextTheme);
});

aiTripForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!document.body.classList.contains('authenticated')) {
    setAuthMessage('Create your account to save and personalize your AI trip plan.', true);
    openAuthScreen('signup');
    return;
  }

  const destination = document.getElementById('ai-destination')?.value?.trim() || 'your destination';
  const days = document.getElementById('ai-days')?.value?.trim() || '1';
  const budget = document.getElementById('ai-budget')?.value?.trim() || 'your budget';
  const style = document.getElementById('ai-style')?.value?.trim() || 'custom';
  const selectedInterests = Array.from(document.querySelectorAll('.interest-chip.active')).map(chip => chip.dataset.interest).join(', ');

  if (plannerPreview) {
    plannerPreview.textContent = `AI draft prepared for ${destination}: a ${days}-day ${style.toLowerCase()} itinerary tuned for ${selectedInterests || 'your interests'} with a target budget of ${budget}.`;
  }

  setSearchFilter(destination);
  openPanel('itinerary');
});

interestChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chip.classList.toggle('active');
  });
});

signInBtn?.addEventListener('click', () => openAuthScreen('login'));
getStartedBtn?.addEventListener('click', () => openAuthScreen('signup'));

heroAuthButtons.forEach(button => {
  button.addEventListener('click', () => openAuthScreen(button.dataset.authAction));
});

authTabs.forEach(tab => {
  tab.addEventListener('click', () => setAuthMode(tab.dataset.authMode));
});

authForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.getElementById('user-email')?.value?.trim() || '';
  const password = document.getElementById('user-password')?.value?.trim() || '';
  const users = readUsers();

  if (!email || !password) {
    setAuthMessage('Email and password are required.', true);
    return;
  }

  if (authMode === 'signup') {
    const name = document.getElementById('user-name')?.value?.trim() || '';
    const location = document.getElementById('user-location')?.value?.trim() || '';
    const travelStyle = document.getElementById('travel-style')?.value || '';

    if (!name) {
      setAuthMessage('Please enter your full name to create your account.', true);
      return;
    }

    const existing = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setAuthMessage('An account already exists with this email. Please login instead.', true);
      setAuthMode('login');
      return;
    }

    const newUser = { name, email, password, location, travelStyle };
    users.push(newUser);
    writeUsers(users);
    persistActiveUser(newUser);
    setAuthMessage('Account created successfully. Welcome to TripNest.');
    showWorkspace();
    return;
  }

  const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
  if (!existingUser) {
    setAuthMessage('No matching account found. Please sign up first.', true);
    return;
  }

  persistActiveUser(existingUser);
  setAuthMessage('Login successful. Redirecting to your workspace...');
  showWorkspace();
});

logoutBtn?.addEventListener('click', () => {
  localStorage.removeItem(ACTIVE_USER_KEY);
  showLanding();
});

const activeUser = readActiveUser();
if (activeUser) {
  showWorkspace();
} else {
  showLanding();
}

initDestinations();
initBudget();
