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

// --- Home Page: Weather usando OpenWeatherMap API ---
async function loadWeather() {
    const apiKey = 'TU_API_KEY';
    const city = 'Guatemala';
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
        const data = await res.json();

        const weatherEl = document.getElementById('weather');
        if (!weatherEl) return;

        const current = data.list[0];
        const forecast = data.list.filter((_,i)=>i%8===0).slice(0,3); // 3 días

        let html = `<p>Current: ${current.main.temp}°C, ${current.weather[0].description}</p>`;
        html += '<ul>';
        forecast.forEach(f => {
            const date = new Date(f.dt*1000).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
            html += `<li>${date}: ${f.main.temp}°C</li>`;
        });
        html += '</ul>';
        weatherEl.innerHTML = html;
    } catch(err) {
        console.error("Weather load error:", err);
    }
}

// --- Ejecutar en Home Page ---
if (document.getElementById('spotlights')) {
    showSpotlights();
    loadWeather();
}


