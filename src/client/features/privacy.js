import { storage } from '../storage.js';

export function initPrivacy() {
  const button = document.querySelector('#clear-local-data');
  const status = document.querySelector('#privacy-status');
  if (!button || !status) return;
  button.addEventListener('click', () => {
    status.textContent = storage.clearPreferences()
      ? 'Se borraron las preferencias y el progreso guardados en este navegador. El tema actual se conserva hasta que salgas de la página.'
      : 'El navegador no permite acceder al almacenamiento. Puedes revisar sus ajustes de privacidad.';
  });
}
