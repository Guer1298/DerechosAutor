import { faqs } from '../../content/faqs.js';
import { pageHeading, contactCta, faqList } from '../shared.js';

export function faqPage() {
  return `<div class="container page-shell">${pageHeading("Preguntas frecuentes", "Una buena pregunta.<br><em>Un punto de partida.</em>", "Respuestas breves para orientarte y lecturas completas para entender el contexto.")}<div class="reading-width">${faqList(faqs, true)}</div></div>${contactCta()}`;
}
