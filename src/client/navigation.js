import { icon } from '../ui/icons.js';

export function initNavigation() {
  const menu = document.querySelector('#mobile-menu');
  const toggle = document.querySelector('.nav-toggle');
  if (!menu || !toggle) return;
  const close = (restore = false) => {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    toggle.innerHTML = icon('menu');
    if (restore) toggle.focus();
  };
  toggle.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    toggle.innerHTML = icon(open ? 'close' : 'menu');
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) close(true); });
  document.addEventListener('click', event => { if (!menu.hidden && !event.target.closest('.site-header')) close(); });
  matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) close(); });
}

export function initHashNavigation() {
  const reveal = () => {
    if (!location.hash || location.hash.startsWith('#/')) return;
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (target?.tagName === 'DETAILS') target.open = true;
    if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant', block: 'start' }));
  };
  window.addEventListener('hashchange', reveal);
  reveal();
}

export function initLegacyRouting() {
  const redirect = async () => {
    const hash = location.hash;
    if (!hash.startsWith('#/')) return;
    const { resolveLegacyRoute } = await import('../domain/routing.js');
    const { articles } = hash.startsWith('#/modulo/') ? await import('../content/articles.js') : { articles: [] };
    if (location.hash !== hash) return; // No sobrescribir una navegación más reciente.
    location.replace(new URL(resolveLegacyRoute(hash, articles), document.baseURI));
  };
  const run = () => redirect().catch(error => console.error('No se pudo resolver la ruta antigua.', error));
  window.addEventListener('hashchange', run);
  run();
}
