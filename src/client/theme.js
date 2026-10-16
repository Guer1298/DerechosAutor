import { icon } from '../ui/icons.js';
import { storage } from './storage.js';
import { storageKeys } from '../config/storage.js';

export function initTheme() {
  const toggles = document.querySelectorAll('.theme-toggle');
  const update = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#152323' : '#f8f6f1');
    toggles.forEach(button => {
      button.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      button.innerHTML = `${icon(dark ? 'sun' : 'moon')}<span>${dark ? 'Modo claro' : 'Modo oscuro'}</span>`;
    });
  };
  toggles.forEach(button => button.addEventListener('click', () => {
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    storage.set(storageKeys.theme, document.documentElement.dataset.theme);
    update();
  }));
  update();
}
