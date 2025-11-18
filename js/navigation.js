// navigation.js — controla el comportamiento del menú hamburguesa
const btnNav = document.getElementById('btnNav');
const nav = document.getElementById('primary-navigation');


btnNav.addEventListener('click', () => {
const expanded = btnNav.getAttribute('aria-expanded') === 'true' || false;
btnNav.setAttribute('aria-expanded', !expanded);
nav.style.display = expanded ? 'none' : 'block';
});


// Cerrar el menú al hacer clic en enlace (mejora accesibilidad)
nav.addEventListener('click', (e) => {
if(e.target.tagName === 'A'){
nav.style.display = 'none';
btnNav.setAttribute('aria-expanded', 'false');
}
});


// Manejo teclado: ESC para cerrar
document.addEventListener('keydown', (e)=>{
if(e.key === 'Escape'){
nav.style.display = 'none';
btnNav.setAttribute('aria-expanded', 'false');
}
});