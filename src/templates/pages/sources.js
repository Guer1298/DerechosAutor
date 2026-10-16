import { legalSources } from '../../content/sources.js';
import { pageHeading, e, sourceLink } from '../shared.js';

export function sources() {
  return `<div class="container page-shell">${pageHeading("Fuentes jurídicas", "La claridad tiene<br><em>fundamento.</em>", "Consulta la normativa y las entidades que sirven de referencia para los contenidos de Autoría Colombia.")}<div class="source-list">${legalSources.map((s, i) => `<article class="source-item"><span class="topic-index">${String(i + 1).padStart(2, "0")}</span><div><span class="eyebrow">${s.label}</span><h2>${e(s.title)}</h2><p>${e(s.description)}</p>${sourceLink(s, "Consultar fuente")}</div></article>`).join("")}</div><div class="educational-note"><strong>Lee siempre la fuente y su contexto.</strong><p>Los enlaces conducen a sitios de terceros. Consulta sus notas de vigencia, modificaciones y ámbito de aplicación. Una selección de fuentes no reemplaza una revisión jurídica profesional.</p></div></div>`;
}
