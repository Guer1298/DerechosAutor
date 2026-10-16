import { articles } from '../../content/articles.js';
import { articleHref } from '../../shared/urls.js';
import { readingMinutes } from '../../domain/articles.js';
import { pageHeading, contactCta, icon, e } from '../shared.js';

export function topics() {
  const categories = [...new Set(articles.map(m => m.category))];
  return `<div class="container page-shell">${pageHeading("El índice de la biblioteca", "Comprender empieza<br><em>por explorar.</em>", "Doce lecturas para conocer el derecho de autor en Colombia. Empieza por los fundamentos o encuentra el tema que necesitas.")}<div class="topic-toolbar"><span>12 TEMAS · ACCESO LIBRE</span><a class="text-link" href="atlas.html">Explorar el atlas ${icon("arrow")}</a></div><div class="filter-row js-only" role="group" aria-label="Filtrar temas por categoría"><button class="filter-button is-active" type="button" data-topic-filter="todos" aria-pressed="true">Todos</button>${categories.map(c => `<button class="filter-button" type="button" data-topic-filter="${c}" aria-pressed="false">${c}</button>`).join("")}</div><p id="topic-count" class="sr-only" role="status"></p><div class="topic-list">${articles.map((m, i) => `<article class="topic-row" data-topic-category="${m.category}"><span class="topic-index">${String(i + 1).padStart(2, "0")}</span><div><span class="eyebrow">${m.category}</span><h2><a href="${articleHref(m.slug)}">${e(m.title)}</a></h2><p>${e(m.description)}</p></div><div class="topic-row__action"><span>${readingMinutes(m)} min de lectura</span><a class="round-link" href="${articleHref(m.slug)}" aria-label="Leer ${e(m.title)}">${icon("arrow")}</a></div></article>`).join("")}</div></div>${contactCta()}`;
}
