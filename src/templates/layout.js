import { primaryNavigation } from '../config/routes.js';
import { storageKeys } from '../config/storage.js';
import { absolutePageUrl } from '../shared/urls.js';
import { contactLink, icon, e } from "./shared.js";
import { siteConfig } from "../config/site.js";
import { isContactAvailable, contactConfig } from "../config/contact.js";

function navLinks(current) {
  return primaryNavigation.map(({ path: href, label, id }) => `<a href="${href}" ${id === current ? 'aria-current="page"' : ""}>${label}</a>`).join("");
}
export function layout({ title, description, content, page, path = "index.html" }, config = siteConfig) {
  const depth = path.split("/").length - 1;
  // Un host puede servir este documento de error desde cualquier URL anidada.
  const base = page === "404" ? "/" : depth ? "../".repeat(depth) : "./";
  const canonical = absolutePageUrl(config.origin, path);
  return `<!DOCTYPE html>
<html lang="${e(config.language)}" data-theme-key="${storageKeys.theme}">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <base href="${base}">
  <title>${e(title)} · Autoría Colombia</title>
  <meta name="description" content="${e(description)}">
  <meta name="theme-color" content="#F8F6F1">
  ${page === "404" ? '<meta name="robots" content="noindex">' : ""}
  <meta property="og:type" content="${depth ? "article" : "website"}"><meta property="og:locale" content="es_CO">
  <meta property="og:title" content="${e(title)} · Autoría Colombia"><meta property="og:description" content="${e(description)}">
  ${canonical ? `<link rel="canonical" href="${e(canonical)}"><meta property="og:url" content="${e(canonical)}">` : ""}
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <script src="js/client/theme-init.js"></script>
  <link rel="stylesheet" href="css/tokens.css"><link rel="stylesheet" href="css/reset.css"><link rel="stylesheet" href="css/base.css"><link rel="stylesheet" href="css/layout.css"><link rel="stylesheet" href="css/components.css"><link rel="stylesheet" href="css/footer.css"><link rel="stylesheet" href="css/responsive.css"><link rel="stylesheet" href="css/accessibility.css">
</head>
<body data-page="${page}">
  <a class="skip-link" href="${path}#main-content">Saltar al contenido principal</a>
  <header class="site-header"><div class="container nav-wrap">
    <a class="brand" href="index.html" aria-label="Autoría Colombia, inicio"><span class="brand-word">autoría<span>.</span></span><span class="brand-country">COLOMBIA</span></a>
    <nav class="main-nav" aria-label="Navegación principal">${navLinks(page)}</nav>
    <div class="nav-actions"><a class="icon-button" href="buscar.html" aria-label="Buscar en Autoría">${icon("search")}</a>${contactLink("header-contact")}<button class="icon-button nav-toggle js-only" type="button" aria-label="Abrir menú" aria-controls="mobile-menu" aria-expanded="false">${icon("menu")}</button></div>
  </div><div class="mobile-menu" id="mobile-menu" hidden><nav class="container" aria-label="Menú móvil">${navLinks(page)}<a href="recursos.html">Recursos educativos</a>${contactLink()}<button class="theme-toggle text-link" type="button" aria-label="Cambiar a modo oscuro">${icon("moon")}<span>Modo oscuro</span></button></nav></div></header>
  <noscript><nav class="container no-js-nav" aria-label="Navegación compacta">${navLinks(page)}</nav></noscript>
  <main id="main-content" tabindex="-1">${content}</main>
  <footer class="site-footer"><div class="container"><div class="footer-top"><div class="footer-brand"><a class="brand" href="index.html"><span class="brand-word">autoría<span>.</span></span><span class="brand-country">COLOMBIA</span></a><p>Información jurídica para comprender<br>y proteger el valor de las creaciones.</p><span class="footer-signature">Conocimiento con propósito.</span></div>
  <div><h2>Explorar</h2><nav aria-label="Explorar"><a href="temas/fundamentos-derecho-autor.html">Derecho de autor</a><a href="temas/obras-protegidas.html">Obras protegidas</a><a href="temas/derechos-morales.html">Derechos de los autores</a><a href="temas/derechos-patrimoniales.html">Licencias y permisos</a><a href="temas/registro-de-obras.html">Registro de obras</a></nav></div>
  <div><h2>Biblioteca</h2><nav aria-label="Recursos"><a href="preguntas-frecuentes.html">Preguntas frecuentes</a><a href="glosario.html">Glosario</a><a href="recursos.html">Recursos educativos</a><a href="casos.html">Casos prácticos</a><a href="fuentes.html">Fuentes jurídicas</a></nav></div>
  <div><h2>Conversemos</h2><nav aria-label="Contacto e información">${contactLink()}${isContactAvailable() ? `<a href="tel:${contactConfig.phoneInternational}">${e(contactConfig.phoneDisplay || contactConfig.phoneInternational)}</a>` : '<span class="contact-pending">Contacto pendiente de publicación</span>'}<a href="acerca.html">Acerca de Autoría</a><a href="privacidad.html">Privacidad</a></nav></div></div>
  <div class="footer-bottom"><span>© ${config.copyrightYear} Autoría Colombia</span><p>Información educativa. No sustituye el asesoramiento jurídico individual.</p><button class="theme-toggle text-link js-only" type="button" aria-label="Cambiar a modo oscuro">${icon("moon")}<span>Modo oscuro</span></button></div></div></footer>
  <script type="module" src="js/client/app.js"></script>
</body></html>`;
}
