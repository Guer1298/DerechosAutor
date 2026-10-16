import { contactLink } from '../ui/contact.js';
export { contactLink };
import { icon } from "../ui/icons.js";
import { contactConfig, isContactAvailable } from "../config/contact.js";
import { escapeHtml as e } from "../shared/text.js";
import { articleHref } from '../shared/urls.js';
import { faqs } from '../content/faqs.js';
export { icon, e, articleHref };

export function contactCta() {
  return `<section class="contact-band"><div class="container contact-band__inner"><div><p class="eyebrow">De la información a la orientación</p><h2>Cada creación tiene una historia.<br><em>Tu situación también.</em></h2><p>Comprender los conceptos es el primer paso. Para estudiar las circunstancias de tu caso, busca orientación profesional.</p></div><div class="contact-band__action">${contactLink("button button-light") }<span class="fine-print">${isContactAvailable() ? e(contactConfig.phoneDisplay || contactConfig.phoneInternational) : "Información de contacto próximamente"}</span></div></div></section>`;
}
export function pageHeading(eyebrow, title, intro = "", extra = "") {
  return `<div class="page-heading"><nav class="breadcrumbs" aria-label="Ruta de navegación"><a href="index.html">Inicio</a><span aria-hidden="true">/</span><span>${e(eyebrow)}</span></nav><p class="eyebrow">${eyebrow}</p><h1>${title}</h1>${intro ? `<p class="lead">${intro}</p>` : ""}${extra}</div>`;
}
export function sourceLink(source, label) {
  return `<a class="text-link" href="${e(source.url)}" target="_blank" rel="noopener noreferrer">${e(label || source.title)}${icon("external")}<span class="sr-only"> (abre en otra pestaña)</span></a>`;
}
export function faqList(items = faqs, openFirst = false) {
  return `<div class="faq-list">${items.map((f, i) => `<details id="${f.id}" ${openFirst && i === 0 ? "open" : ""}><summary><span>${e(f.question)}</span><span class="faq-plus" aria-hidden="true"></span></summary><div class="faq-answer"><p>${e(f.answer)}</p><a class="text-link" href="${articleHref(f.slug)}">Leer la explicación completa ${icon("arrow")}</a></div></details>`).join("")}</div>`;
}
