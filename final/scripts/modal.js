// js/modal.js
export function createModal() {
  const root = document.getElementById('modal-root');
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-hidden="true" tabindex="-1">
      <div class="modal-content">
        <button class="modal-close" aria-label="Close modal">&times;</button>
        <div class="modal-body"></div>
      </div>
    </div>
  `;
  root.appendChild(overlay);

  const modal = overlay.querySelector('.modal');
  const closeBtn = overlay.querySelector('.modal-close');
  const body = overlay.querySelector('.modal-body');

  function open(contentHtml) {
    body.innerHTML = contentHtml;
    modal.setAttribute('aria-hidden','false');
    overlay.style.display = 'block';
    modal.focus();
    document.body.style.overflow = 'hidden';
  }
  function close() {
    modal.setAttribute('aria-hidden','true');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e)=> { if (e.target === overlay) close();});
  document.addEventListener('keydown', (e)=> { if (e.key === 'Escape') close(); });

  // init hidden
  overlay.style.display = 'none';
  return { open, close, body, modal };
}
