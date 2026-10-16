import { pageHeading } from '../shared.js';

export function guidePage() {
  return `<div class="container page-shell">${pageHeading("Explorador de situaciones", "Encuentra tu<br><em>punto de partida.</em>", "Selecciona una situación para descubrir conceptos y lecturas. Esta herramienta orienta la búsqueda de información; no emite un diagnóstico jurídico.")}<div id="guide" class="interactive-panel js-only"></div><noscript><p>El explorador requiere JavaScript. <a href="temas.html">Explora directamente todos los temas.</a></p></noscript><p class="source-note">Tus selecciones se utilizan solo en esta página y no se envían a un servidor.</p></div>`;
}
