// js/render.js
export function renderFeatured(container, services) {
  // pick first 3 for featured
  const featured = services.slice(0,3);
  featured.forEach(s => {
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <img class="card-image" src="${s.image}" loading="lazy" alt="${s.title}">
      <div class="card-body">
        <h3 class="card-title">${s.title}</h3>
        <p class="card-desc">${s.summary}</p>
        <ul class="card-meta">
          <li>${s.location}</li>
          <li>${s.capacity_kw ? s.capacity_kw + ' kW':''}</li>
        </ul>
        <div class="card-actions">
          <button class="btn view-more" data-id="${s.id}">View More</button>
        </div>
      </div>
    `;
    container.appendChild(el);
  });
}

export function renderList(container, services, modal) {
  container.innerHTML = '';
  services.forEach(s => {
    const node = document.getElementById('service-card-template').content.cloneNode(true);
    const img = node.querySelector('.card-image');
    img.src = s.image;
    img.alt = s.title;
    node.querySelector('.card-title').textContent = s.title;
    node.querySelector('.card-desc').textContent = s.summary;
    const meta = node.querySelector('.card-meta');
    meta.innerHTML = `<li>${s.location}</li><li>${s.capacity_kw ? s.capacity_kw + ' kW': '—'}</li><li>${s.tags.join(', ')}</li>`;
    const btn = node.querySelector('.view-more');
    btn.addEventListener('click', ()=> {
      const html = `
        <h2>${s.title}</h2>
        <p>${s.summary}</p>
        <ul>
          <li><strong>Location:</strong> ${s.location}</li>
          <li><strong>Capacity:</strong> ${s.capacity_kw ? s.capacity_kw + ' kW' : 'N/A'}</li>
          <li><strong>ID:</strong> ${s.id}</li>
          <li><strong>Tags:</strong> ${s.tags.join(', ')}</li>
        </ul>
      `;
      modal.open(html);
    });
    container.appendChild(node);
  });
}
