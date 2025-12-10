document.addEventListener('DOMContentLoaded', async () => {

  /* =======================
     YEAR
  ======================= */
  const year2 = document.getElementById('year-2');
  if (year2) year2.textContent = new Date().getFullYear();


  /* =======================
     NAV TOGGLE
  ======================= */
  const navBtn = document.getElementById('nav-toggle-2');
  const nav = document.getElementById('primary-nav-2');

  if (navBtn && nav) {
    navBtn.addEventListener('click', () => {
      const expanded = navBtn.getAttribute('aria-expanded') === 'true';
      navBtn.setAttribute('aria-expanded', String(!expanded));
      nav.style.display = expanded ? '' : 'block';
    });
  }


  /* =======================
     MODAL
  ======================= */
  const modalRoot = document.getElementById('modal-root');

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.display = 'none';

  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-content">
        <button class="modal-close" aria-label="Close modal">&times;</button>
        <div class="modal-body"></div>
      </div>
    </div>
  `;

  modalRoot.appendChild(overlay);

  const modalBody = overlay.querySelector('.modal-body');
  const closeBtn = overlay.querySelector('.modal-close');

  function openModal(html) {
    modalBody.innerHTML = html;
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });


  /* =======================
     FETCH SERVICES (REQUIRED)
  ======================= */
  let services = [];

  try {
    const response = await fetch('data/services.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Fetch failed');
    services = await response.json();
  } catch (error) {
    const list = document.getElementById('services-list');
    if (list) list.innerHTML = '<p>Unable to load services at this time.</p>';
    return;
  }


  /* =======================
     LOCAL STORAGE
  ======================= */
  localStorage.setItem('sv-services', JSON.stringify(services));


  /* =======================
     RENDER SERVICES
  ======================= */
  const container = document.getElementById('services-list');
  const template = document.getElementById('service-card-template');

  if (!container || !template) return;

  container.innerHTML = '';

  services.forEach(service => {
    const card = template.content.cloneNode(true);

    const img = card.querySelector('.card-image');
    img.src = service.image;
    img.alt = service.title;

    card.querySelector('.card-title').textContent = service.title;
    card.querySelector('.card-desc').textContent = service.summary;

    const meta = card.querySelector('.card-meta');
    meta.innerHTML = `
      <li><strong>Location:</strong> ${service.location}</li>
      <li><strong>Capacity:</strong> ${service.capacity_kw ?? 'N/A'}</li>
      <li><strong>Tags:</strong> ${service.tags.join(', ')}</li>
    `;

    const button = card.querySelector('.view-more');
    button.addEventListener('click', () => {
      openModal(`
        <h2>${service.title}</h2>
        <p>${service.summary}</p>
        <ul>
          <li><strong>ID:</strong> ${service.id}</li>
          <li><strong>Location:</strong> ${service.location}</li>
          <li><strong>Capacity:</strong> ${service.capacity_kw ?? 'N/A'}</li>
          <li><strong>Tags:</strong> ${service.tags.join(', ')}</li>
        </ul>
      `);
    });

    container.appendChild(card);
  });

  console.info(`✅ ${services.length} services loaded successfully`);
});
