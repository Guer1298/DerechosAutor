import { articles } from '../../content/articles.js';
import { articleHref } from '../../shared/urls.js';
import { pageHeading, icon, e } from '../shared.js';

export function atlas() {
  const groups = [["La creación", ["fundamentos-derecho-autor", "obras-protegidas", "autoria-titularidad"]], ["Los derechos", ["derechos-morales", "derechos-patrimoniales", "derechos-conexos"]], ["El ejercicio", ["registro-de-obras", "limites-y-excepciones", "plagio-e-infracciones"]], ["El entorno digital", ["derecho-autor-internet", "software-propiedad-intelectual", "ia-y-autoria"]]];
  return `<div class="container page-shell">${pageHeading("Atlas del derecho de autor", "Todo está<br><em>conectado.</em>", "De la creación a su uso: un mapa para encontrar tu camino por la biblioteca. Cada concepto abre su lectura.")}<div class="atlas-map"><a class="atlas-root" href="${articleHref("fundamentos-derecho-autor")}">${icon("book")}<span>Derecho de autor<small>La expresión de la creatividad humana</small></span></a><div class="atlas-branches">${groups.map(([label, indices], i) => `<section><p class="eyebrow">0${i + 1}</p><h2>${label}</h2><ul>${indices.map(n => `<li><a href="${articleHref(articles.find(a => a.slug === n).slug)}">${e(articles.find(a => a.slug === n).title)}${icon("arrow")}</a></li>`).join("")}</ul></section>`).join("")}</div></div><p class="source-note">Este mapa también es una lista estructurada, navegable con teclado y lectores de pantalla. <a href="temas.html">Ver el índice completo de temas.</a></p></div>`;
}
