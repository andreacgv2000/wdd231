// main.js - Chamber Directory Project

// Elementos del DOM
const directoryEl = document.getElementById('directory');
const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

/**
 * Cargar miembros desde JSON
 */
async function getMembers() {
    try {
        const response = await fetch('data/members.json'); // Carga el JSON
        const members = await response.json();             // Convierte a objeto JS
        renderGrid(members);                               // Vista Grid por defecto
        setupViewButtons(members);                        // Configura toggle Grid/List
    } catch (err) {
        console.error("Error loading members:", err);
        directoryEl.textContent = "Failed to load members.";
    }
}

/**
 * Renderizar miembros en Grid
 */
function renderGrid(members) {
    directoryEl.innerHTML = "";
    directoryEl.className = "directory grid-view";
    members.forEach(m => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="images/${m.image}" alt="${m.name} logo">
            <h3><a href="${m.website}" target="_blank" rel="noopener">${m.name}</a></h3>
            <p class="meta">${m.address} · ${m.phone}</p>
        `;
        directoryEl.appendChild(card);
    });
}

/**
 * Renderizar miembros en List
 */
function renderList(members) {
    directoryEl.innerHTML = "";
    directoryEl.className = "directory list-view";
    members.forEach(m => {
        const row = document.createElement('div');
        row.className = 'card';
        row.style.display = 'flex';
        row.style.flexDirection = 'row';
        row.style.alignItems = 'center';
        row.style.gap = '1rem';

        const img = document.createElement('img');
        img.src = `images/${m.image}`;
        img.alt = `${m.name} logo`;
        img.style.width = '96px';
        img.style.height = '64px';
        row.appendChild(img);

        const info = document.createElement('div');
        info.innerHTML = `
            <h3><a href="${m.website}" target="_blank" rel="noopener">${m.name}</a></h3>
            <p class="meta">${m.address} · ${m.phone}</p>
        `;
        row.appendChild(info);

        directoryEl.appendChild(row);
    });
}

/**
 * Configurar botones de vista Grid/List
 */
function setupViewButtons(members) {
    gridBtn.addEventListener('click', () => {
        gridBtn.classList.add('active');
        gridBtn.setAttribute('aria-pressed', 'true');
        listBtn.classList.remove('active');
        listBtn.setAttribute('aria-pressed', 'false');
        renderGrid(members);
    });

    listBtn.addEventListener('click', () => {
        listBtn.classList.add('active');
        listBtn.setAttribute('aria-pressed', 'true');
        gridBtn.classList.remove('active');
        gridBtn.setAttribute('aria-pressed', 'false');
        renderList(members);
    });
}

/**
 * Configurar fechas dinámicas en el footer
 */
function setFooterDates() {
    document.getElementById('year').textContent = new Date().getFullYear();
    document.getElementById('lastModified').textContent = document.lastModified;
}

/**
 * Configurar menú responsive
 */
function setupMenuToggle() {
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
    });
}

/**
 * Configurar atajos de teclado (g = grid, l = list)
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'g') gridBtn.click();
        if (e.key === 'l') listBtn.click();
    });
}

/**
 * Inicializar toda la página
 */
function init() {
    getMembers();
    setFooterDates();
    setupMenuToggle();
    setupKeyboardShortcuts();
}

// Ejecutar inicialización
init();







// --- Home Page: Spotlights aleatorios (Gold/Silver) ---
async function showSpotlights() {
    try {
        const response = await fetch('data/members.json');
        const members = await response.json();
        const filtered = members.filter(m => m.level === 1 || m.level === 2);
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0,3);

        const spotlightsEl = document.getElementById('spotlights');
        if (!spotlightsEl) return;

        spotlightsEl.innerHTML = '';
        selected.forEach(m => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="images/${m.image}" alt="${m.name} logo">
                <h3><a href="${m.website}" target="_blank" rel="noopener">${m.name}</a></h3>
                <p class="meta">${m.address} · ${m.phone}</p>
            `;
            spotlightsEl.appendChild(card);
        });
    } catch (err) {
        console.error("Error loading spotlights:", err);
    }
}

/// --- Seleccionar elementos del DOM ---
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

// --- Configuración de la API ---
const apiKey = '313afd51d908d61f0d2f693b86573714'; 
const lat = 14.6349;               // Latitud de Guatemala
const lon = -90.5069;              // Longitud de Guatemala
const units = 'metric';            // "imperial" para °F
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

// --- Función para obtener datos de la API ---
async function apiFetch() {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(data); // Para depuración
      displayResults(data);
    } else {
      throw Error(await response.text());
    }
  } catch (error) {
    console.error("Error fetching weather:", error);
    currentTemp.textContent = 'N/A';
    captionDesc.textContent = 'Unable to load weather';
  }
}

// --- Función para mostrar resultados en el HTML ---
function displayResults(data) {
  // Temperatura
  const temp = Math.round(data.main.temp);
  currentTemp.innerHTML = `${temp}&deg;C`;

  // Ícono del clima
  const iconCode = data.weather[0].icon; // por ejemplo: "10d"
  const iconSrc = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIcon.setAttribute('src', iconSrc);
  weatherIcon.setAttribute('alt', data.weather[0].description);

  // Descripción
  captionDesc.textContent = data.weather[0].description;
}

// --- Ejecutar la función ---
apiFetch();


// --- Ejecutar en Home Page ---
if (document.getElementById('spotlights')) {
    showSpotlights();
    loadWeather();
}






// ===== Mobile menu toggle (añadir al final de scripts/main.js) =====
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle'); // tu botón
  const mainNav = document.getElementById('mainNav');       // el nav

  if (!menuToggle || !mainNav) {
    // Si no existen elementos, no hacemos nada (evita errores)
    // Puedes ver en consola si algo falta
    // console.log('menuToggle or mainNav missing', menuToggle, mainNav);
    return;
  }

  // Asegura estado inicial correcto
  menuToggle.setAttribute('aria-expanded', 'false');

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Cerrar nav si se hace click fuera (mejora UX)
  document.addEventListener('click', (e) => {
    if (!mainNav.classList.contains('open')) return;
    // si el click no fue sobre el nav ni sobre el botón, cerrar
    if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus();
    }
  });
});












// AUTOFILL TIMESTAMP
const timestampField = document.getElementById("timestamp");
if (timestampField) {
timestampField.value = new Date().toLocaleString();
}


// MODAL FUNCTIONALITY
const cards = document.querySelectorAll('.card');
const modals = document.querySelectorAll('.modal');
const closes = document.querySelectorAll('.close');


cards.forEach(card => {
card.addEventListener('click', () => {
document.getElementById(card.dataset.modal).style.display = "block";
});
});


closes.forEach(close => {
close.addEventListener('click', () => {
close.parentElement.parentElement.style.display = "none";
});
});


window.addEventListener('click', e => {
if (e.target.classList.contains('modal')) {
e.target.style.display = "none";
}
});









// discover.js
// Script para discover.html
// - importa data desde data/discover.mjs
// - construye 8 cards (h2, figure img, address, p.description, button.learn)
// - maneja localStorage para mostrar mensaje de la última visita
// - asegura lazy loading en imágenes (loading="lazy")

import places from '../data/members.json';

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
