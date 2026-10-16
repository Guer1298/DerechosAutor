import { pageHeading } from '../shared.js';

export function quizPage() {
  return `<div class="container page-shell">${pageHeading("Cuestionarios voluntarios", "Una pausa para<br><em>ponerlo en práctica.</em>", "Elige un tema, responde a tu ritmo y consulta la explicación de cada respuesta.")}<div id="quiz" class="interactive-panel js-only"></div><noscript><p>Los cuestionarios requieren JavaScript. <a href="casos.html">Lee los casos y sus explicaciones</a> sin herramientas interactivas.</p></noscript></div>`;
}
