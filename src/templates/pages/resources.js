import { pageHeading, icon } from '../shared.js';

export function resources() {
  const items = [["atlas.html", "Atlas del derecho de autor", "Observa cómo se conectan los conceptos de la biblioteca."], ["casos.html", "Casos prácticos", "Analiza situaciones cotidianas y consulta su explicación."], ["glosario.html", "Glosario jurídico", "Veinte términos esenciales explicados con ejemplos."], ["explorar.html", "Explorador de situaciones", "Encuentra lecturas según lo que quieres hacer."], ["cuestionarios.html", "Cuestionarios voluntarios", "Pon a prueba lo aprendido, sin registros ni requisitos."], ["mitos.html", "Mitos y realidades", "Revisa ideas frecuentes sobre las creaciones y sus derechos."]];
  return `<div class="container page-shell">${pageHeading("Recursos educativos", "Aprende a<br><em>tu manera.</em>", "Profundiza con ejemplos, conecta ideas o prueba tus conocimientos. Todos los recursos son opcionales.")}<div class="resource-grid resource-grid--full">${items.map(([href, title, copy], i) => `<a href="${href}"><span class="resource-number">RECURSO ${String(i + 1).padStart(2, "0")}</span><h2>${title}</h2><p>${copy}</p>${icon("arrow")}</a>`).join("")}</div></div>`;
}
