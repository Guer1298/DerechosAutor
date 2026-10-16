import { articles } from '../../content/articles.js';
import { glossary as glossaryEntries } from '../../content/glossary.js';
import { articleHref } from '../../shared/urls.js';
import { glossaryId } from '../../shared/urls.js';
import { pageHeading, icon, e } from '../shared.js';

export function glossary() {
  const items = [...glossaryEntries].sort((a, b) => a.term.localeCompare(b.term, "es"));
  const letters = [...new Set(items.map(g => g.term[0]))];
  return `<div class="container page-shell">${pageHeading("Glosario jurídico", "Las palabras,<br><em>con claridad.</em>", "Un vocabulario esencial para leer, comprender y preguntar con más confianza.")}<nav class="alphabet-nav" aria-label="Índice alfabético">${letters.map(l => `<a href="glosario.html#letra-${l}">${l}</a>`).join("")}</nav><div class="glossary-list">${letters.map(l => `<section id="letra-${l}" class="glossary-group"><h2>${l}</h2><div>${items.filter(g => g.term[0] === l).map(g => { const m = articles.find(m => m.slug === g.articleSlug); return `<article id="${glossaryId(g.term)}"><h3>${e(g.term)}</h3><p>${e(g.definition)}</p><p class="glossary-example"><strong>Por ejemplo:</strong> ${e(g.example)}</p><p class="source-note">Relacionado con: ${g.related.map(e).join(", ")}.</p>${m ? `<a class="text-link" href="${articleHref(m.slug)}">${e(m.title)} ${icon("arrow")}</a>` : ""}</article>`; }).join("")}</div></section>`).join("")}</div></div>`;
}
