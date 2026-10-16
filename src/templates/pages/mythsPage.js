import { myths } from '../../content/myths.js';
import { articleHref } from '../../shared/urls.js';
import { pageHeading, icon, e } from '../shared.js';

export function mythsPage() {
  return `<div class="container page-shell">${pageHeading("Mitos y realidades", "Pongamos las ideas<br><em>en su lugar.</em>", "Cuatro creencias frecuentes que merecen una segunda mirada.")}<div class="myth-list">${myths.map((m, i) => `<article class="myth-item" data-myth="${i}"><span class="eyebrow">AFIRMACIÓN ${i + 1}</span><h2>“${e(m.claim)}”</h2><div class="page-actions js-only"><button class="button button-secondary" type="button" data-myth-answer="true" aria-pressed="false">Verdadero</button><button class="button button-secondary" type="button" data-myth-answer="false" aria-pressed="false">Falso</button><span class="myth-feedback" role="status"></span></div><details><summary>Conocer la respuesta</summary><p><strong>Falso.</strong> ${e(m.explanation)}</p><a class="text-link" href="${articleHref(m.slug)}">Profundizar en el tema ${icon("arrow")}</a></details></article>`).join("")}</div></div>`;
}
