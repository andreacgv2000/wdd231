// date.js — dinamiza el año de copyright y lastModified
// Año actual
document.addEventListener('DOMContentLoaded', () => {
const y = new Date().getFullYear();
const elYear = document.getElementById('copyrightYear');
if(elYear) elYear.textContent = y;


// lastModified
const lm = document.lastModified;
const lmEl = document.getElementById('lastModified');
if(lmEl) lmEl.textContent = `Última modificación: ${lm}`;
});