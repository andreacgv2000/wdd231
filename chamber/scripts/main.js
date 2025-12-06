// main.js - Chamber Directory Project

// ==============================
// Menu Toggle (ALL pages)
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu");
  const nav = document.querySelector("nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }
});

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





