// js/main.js
import { fetchServices } from './api.js';
import { createModal } from './modal.js';
import { renderFeatured, renderList } from './render.js';

document.addEventListener('DOMContentLoaded', async () => {
  // set years
  document.getElementById('year')?.textContent = new Date().getFullYear();
  document.getElementById('year-2')?.textContent = new Date().getFullYear();
  document.getElementById('year-3')?.textContent = new Date().getFullYear();

  // nav toggle
  function wireNav(buttonId, navId) {
    const btn = document.getElementById(buttonId);
    const nav = document.getElementById(navId);
    if (!btn || !nav) return;
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      nav.style.display = expanded ? '' : 'block';
    });
  }
  wireNav('nav-toggle','primary-nav');
  wireNav('nav-toggle-2','primary-nav-2');
  wireNav('nav-toggle-3','primary-nav-3');

  // theme toggle via localStorage
  const themeBtn = document.getElementById('open-theme');
  if (themeBtn) {
    const theme = localStorage.getItem('sv-theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    themeBtn.addEventListener('click', ()=> {
      const cur = document.documentElement.getAttribute('data-theme') || 'light';
      const next = cur === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('sv-theme', next);
    });
  }

  const modal = createModal();

  // fetch and render data
  try {
    const services = await fetchServices(); // try...catch inside api
    // ensure we have at least 15 items
    if (!Array.isArray(services) || services.length < 15) {
      console.warn('Less than 15 items returned; check data/services.json');
    }

    // Featured (home)
    const featuredContainer = document.getElementById('featured-list');
    if (featuredContainer) renderFeatured(featuredContainer, services);

    // Services page list
    const listContainer = document.getElementById('services-list');
    if (listContainer) renderList(listContainer, services, modal);

    // Save a copy in localStorage to demonstrate persistence
    localStorage.setItem('sv-services-cache', JSON.stringify(services));

    // Example of using an array method (map -> create a list of tags)
    const allTags = [...new Set(services.flatMap(s => s.tags))];
    // optionally show tags in console
    console.info('Service tags:', allTags);

  } catch (err) {
    // show a friendly message in the UI if possible
    const listContainer = document.getElementById('services-list');
    if (listContainer) listContainer.innerHTML = '<p>Could not load services. Please try again later.</p>';
  }

  // Contact form: save draft to localStorage
  const saveBtn = document.getElementById('save-draft');
  const form = document.getElementById('contact-form');
  if (saveBtn && form) {
    saveBtn.addEventListener('click', () => {
      const fd = new FormData(form);
      const obj = Object.fromEntries(fd.entries());
      localStorage.setItem('sv-contact-draft', JSON.stringify(obj));
      alert('Draft saved locally');
    });
    // attempt to restore
    const draft = localStorage.getItem('sv-contact-draft');
    if (draft) {
      try {
        const data = JSON.parse(draft);
        for (const [k,v] of Object.entries(data)) {
          const el = form.elements[k];
          if (el) el.value = v;
        }
      } catch {}
    }
  }

});
