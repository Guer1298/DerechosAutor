import { escapeHtml as e } from '../shared/text.js';
import { icon } from './icons.js';

export function renderSearchResults(results, query) {
  if (!results.length) {
    return `<div class="search-empty"><h2>No encontramos “${e(query)}”.</h2><p>Prueba con menos palabras, cambia el filtro o explora el índice.</p><a class="text-link" href="temas.html">Ver todos los temas ${icon('arrow')}</a></div>`;

  }
  return results.map(r => `<article class="search-result"><span class="eyebrow">${e(r.type)} · ${e(r.category)}</span><h2><a href="${e(r.href)}">${e(r.title)}</a></h2><p>${e(r.description)}</p><a class="text-link" href="${e(r.href)}">Leer ${e(r.type)} ${icon('arrow')}</a></article>`).join('');

}
