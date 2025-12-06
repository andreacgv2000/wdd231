
// discover.js
// Script para discover.html
// - importa data desde data/discover.mjs
// - construye 8 cards (h2, figure img, address, p.description, button.learn)
// - maneja localStorage para mostrar mensaje de la última visita
// - asegura lazy loading en imágenes (loading="lazy")

import places from '../data/discover.mjs';

// Elementos del DOM
const discoverGrid = document.getElementById('discoverGrid');
const visitMessage = document.getElementById('visitMessage');
const visitText = document.getElementById('visitText');
const closeVisit = document.getElementById('closeVisit');

/**
 * Renderiza las tarjetas a partir del array importado.
 * Mantiene la estructura solicitada: h2, figure (img), address, p, button.
 */
function renderPlaces(items) {
  discoverGrid.innerHTML = ''; // limpiar
  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('data-id', item.id);
    card.setAttribute('tabindex', '0');

    card.innerHTML = `
      <h2>${escapeHtml(item.name)}</h2>
      <figure>
        <img src="images/${item.image}" alt="${escapeHtml(item.name)} photo" loading="lazy" width="300" height="200">
      </figure>
      <div class="card-body">
        <address>${escapeHtml(item.address)}</address>
        <p class="description">${escapeHtml(item.description)}</p>
        <button class="learn" aria-label="Learn more about ${escapeHtml(item.name)}">Learn more</button>
      </div>
    `;
    discoverGrid.appendChild(card);
  });
}

/**
 * Escape simple HTML to avoid inyecciones si los datos cambian.
 */
function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * LocalStorage: mostrar mensaje según última visita.
 * - si no hay lastVisit => "Welcome! Let us know if you have any questions."
 * - si diferencia < 1 día => "Back so soon! Awesome!"
 * - else => "You last visited n day(s) ago." (correct singular/plural)
 */
function handleVisitMessage() {
  const KEY = 'gc_last_visit';
  const now = Date.now();
  const last = localStorage.getItem(KEY);

  if (!last) {
    showVisit("Welcome! Let us know if you have any questions.");
  } else {
    const lastMs = Number(last);
    if (Number.isNaN(lastMs)) {
      showVisit("Welcome! Let us know if you have any questions.");
    } else {
      const msPerDay = 24 * 60 * 60 * 1000;
      const diffDays = Math.floor((now - lastMs) / msPerDay);

      if (diffDays < 1) {
        showVisit("Back so soon! Awesome!");
      } else if (diffDays === 1) {
        showVisit("You last visited 1 day ago.");
      } else {
        showVisit(`You last visited ${diffDays} days ago.`);
      }
    }
  }

  // Actualizamos last visit con la hora actual (en ms)
  localStorage.setItem(KEY, String(now));
}

function showVisit(message) {
  if (!visitMessage || !visitText) return;
  visitText.textContent = message;
  visitMessage.hidden = false;
}

/* Cerrar el banner con botón */
if (closeVisit) {
  closeVisit.addEventListener('click', () => {
    visitMessage.hidden = true;
  });
}

/* keyboard accessibility: close with Esc when focused inside */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !visitMessage.hidden) {
    visitMessage.hidden = true;
  }
});

/* Initialize page */
function init() {
  renderPlaces(places);
  handleVisitMessage();
  setupLearnButtons();
}

/* Add event listeners to 'Learn more' buttons (placeholder behaviour) */
function setupLearnButtons() {
  discoverGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.learn');
    if (!btn) return;
    const card = btn.closest('.card');
    const id = card?.dataset?.id;
    // Aquí puedes abrir un modal, ir a otra página o mostrar más detalles.
    // Para la tarea es suficiente con mostrar alert (o mejor, un dialogo accesible).
    window.alert(`More about: ${id}`);
  });

  // allow Enter/Space on card to activate the Learn more button for keyboard users
  discoverGrid.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.card')) {
      const btn = e.target.closest('.card').querySelector('.learn');
      if (btn) {
        btn.click();
      }
    }
  });
}

// Ejecutar init
init();
