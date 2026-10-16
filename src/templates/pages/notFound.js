import { pageHeading, icon } from '../shared.js';

export function notFound() {
  return `<div class="container page-shell">${pageHeading("404 · Página no encontrada", "Sigamos<br><em>explorando.</em>", "No encontramos esta página. La biblioteca sigue abierta.")}<div class="page-actions"><a class="button button-primary" href="index.html">Volver al inicio ${icon("arrow")}</a><a class="text-link" href="temas.html">Ver todos los temas ${icon("arrow")}</a></div></div>`;
}
