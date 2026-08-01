/**
 * TripNest — Budget Calculator
 * Future React: BudgetCalculator + useBudget hook
 */

const CATEGORIES = [
  { id: 'transport', label: 'Transportation', color: '#0D9488' },
  { id: 'accommodation', label: 'Accommodation', color: '#6366F1' },
  { id: 'food', label: 'Food & Dining', color: '#F59E0B' },
  { id: 'activities', label: 'Activities', color: '#EC4899' },
  { id: 'shopping', label: 'Shopping', color: '#8B5CF6' },
  { id: 'misc', label: 'Miscellaneous', color: '#64748B' }
];

/**
 * Parse and validate a numeric input value
 * @param {string|number} value
 * @returns {number}
 */
function parseAmount(value) {
  const num = parseFloat(value);
  if (isNaN(num) || num < 0) return 0;
  return Math.round(num * 100) / 100;
}

/**
 * Read all budget input values
 * @returns {Object}
 */
function readValues() {
  const values = {};
  CATEGORIES.forEach(cat => {
    const input = document.getElementById(`budget-${cat.id}`);
    values[cat.id] = parseAmount(input?.value || 0);
    if (input && input.value !== String(values[cat.id])) {
      input.value = values[cat.id];
    }
  });
  return values;
}

/**
 * Update budget display
 */
function updateBudget() {
  const values = readValues();
  const total = Object.values(values).reduce((sum, v) => sum + v, 0);

  const totalEl = document.getElementById('budget-total-amount');
  if (totalEl) totalEl.textContent = `$${total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

  const chartEl = document.getElementById('budget-chart');
  if (chartEl) {
    if (total === 0) {
      chartEl.innerHTML = '';
    } else {
      chartEl.innerHTML = CATEGORIES
        .filter(cat => values[cat.id] > 0)
        .map(cat => {
          const pct = (values[cat.id] / total) * 100;
          return `<div class="budget-chart-segment" style="width: ${pct}%; background: ${cat.color}" title="${cat.label}: $${values[cat.id]}"></div>`;
        })
        .join('');
    }
  }

  const breakdownEl = document.getElementById('budget-breakdown');
  if (breakdownEl) {
    breakdownEl.innerHTML = CATEGORIES.map(cat => `
      <div class="budget-breakdown-item">
        <span class="budget-dot" style="background: ${cat.color}"></span>
        <span>${cat.label}</span>
        <strong>$${values[cat.id].toLocaleString()}</strong>
      </div>
    `).join('');
  }
}

/**
 * Initialize budget calculator
 */
export function initBudget() {
  document.querySelectorAll('.budget-input').forEach(input => {
    input.addEventListener('input', updateBudget);
    input.addEventListener('blur', () => {
      input.value = parseAmount(input.value);
      updateBudget();
    });
  });

  updateBudget();
}
