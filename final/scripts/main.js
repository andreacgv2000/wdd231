document.addEventListener('DOMContentLoaded', async () => {

  /* =======================
     FOOTER DATA
  ======================= */
  const year = document.getElementById("year-2");
  if (year) year.textContent = new Date().getFullYear();

  const updated = document.getElementById("last-updated");
  if (updated) {
    const d = new Date(document.lastModified);
    updated.textContent = d.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  /* =======================
   NAV TOGGLE (HAMBURGER)
======================= */
const navBtn = document.getElementById('nav-toggle');
const nav = document.getElementById('primary-nav');

if (navBtn && nav) {
  navBtn.addEventListener('click', () => {
    const expanded = navBtn.getAttribute('aria-expanded') === 'true';
    navBtn.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });
}

  /* =======================
     MODAL
  ======================= */
  const modalRoot = document.getElementById('modal-root');
  let openModal = () => {};

  if (modalRoot) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.display = 'none';

    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modal-content">
          <button class="modal-close">&times;</button>
          <div class="modal-body"></div>
        </div>
      </div>
    `;
    modalRoot.appendChild(overlay);

    const modalBody = overlay.querySelector('.modal-body');
    const closeBtn = overlay.querySelector('.modal-close');

    openModal = html => {
      modalBody.innerHTML = html;
      overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', e => e.target === overlay && close());
    document.addEventListener('keydown', e => e.key === 'Escape' && close());
  }

  /* =======================
     FETCH SERVICES
  ======================= */
  let services = [];

  try {
    const res = await fetch('data/services.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Fetch failed');
    services = await res.json();
  } catch (err) {
    console.error(err);
    return;
  }

  localStorage.setItem('sv-services', JSON.stringify(services));

  /* =======================
     FEATURED (HOME)
  ======================= */
  const featured = document.getElementById('featured-list');
  if (featured) {
    services.slice(0, 3).forEach(s => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img src="${s.image}" alt="${s.title}" loading="lazy">
        <div class="card-body">
          <h3>${s.title}</h3>
          <p>${s.summary}</p>
          <button class="btn">View More</button>
        </div>
      `;
      card.querySelector('button').addEventListener('click', () => {
        openModal(`
          <h2>${s.title}</h2>
          <p>${s.summary}</p>
        `);
      });
      featured.appendChild(card);
    });
  }

  /* =======================
     SERVICES PAGE
  ======================= */
  const list = document.getElementById('services-list');
  const template = document.getElementById('service-card-template');

  if (list && template) {
    services.forEach(s => {
      const node = template.content.cloneNode(true);

      node.querySelector('.card-image').src = s.image;
      node.querySelector('.card-image').alt = s.title;
      node.querySelector('.card-title').textContent = s.title;
      node.querySelector('.card-desc').textContent = s.summary;
      node.querySelector('.card-meta').innerHTML = `
        <li>${s.location}</li>
        <li>${s.capacity_kw ?? 'N/A'}</li>
        <li>${s.tags.join(', ')}</li>
      `;

      node.querySelector('.view-more').addEventListener('click', () => {
        openModal(`
          <h2>${s.title}</h2>
          <p>${s.summary}</p>
        `);
      });

      list.appendChild(node);
    });
  }

  console.log(`✅ Loaded ${services.length} services`);
});
