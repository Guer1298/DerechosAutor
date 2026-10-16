// Registro único de páginas públicas. Sus rutas se conservan entre refactorizaciones.
export const pageDefinitions = [
  {
    "id": "home",
    "path": "index.html",
    "title": "Tus ideas tienen valor",
    "description": "Comprende el derecho de autor en Colombia con explicaciones claras, ejemplos cotidianos y fuentes jurídicas consultables.",
    "renderer": "home"
  },
  {
    "id": "temas",
    "path": "temas.html",
    "title": "Biblioteca de temas",
    "description": "Doce artículos sobre derecho de autor colombiano: obras, autoría, derechos, registro, Internet, software e inteligencia artificial.",
    "renderer": "topics"
  },
  {
    "id": "faq",
    "path": "preguntas-frecuentes.html",
    "title": "Preguntas frecuentes",
    "description": "Respuestas claras a preguntas sobre protección de obras, registro, licencias, software e inteligencia artificial.",
    "renderer": "faqPage"
  },
  {
    "id": "contacto",
    "path": "contacto.html",
    "title": "Hablemos de tus derechos",
    "description": "Consulta la disponibilidad del contacto profesional y cómo preparar tus preguntas sobre derecho de autor.",
    "renderer": "contactPage"
  },
  {
    "id": "recursos",
    "path": "recursos.html",
    "title": "Recursos educativos",
    "description": "Explora casos, glosario, atlas, mitos y cuestionarios opcionales para comprender el derecho de autor.",
    "renderer": "resources"
  },
  {
    "id": "glosario",
    "path": "glosario.html",
    "title": "Glosario jurídico",
    "description": "Veinte conceptos clave de derecho de autor explicados con definiciones, ejemplos y lecturas relacionadas.",
    "renderer": "glossary"
  },
  {
    "id": "fuentes",
    "path": "fuentes.html",
    "title": "Fuentes jurídicas",
    "description": "Consulta normativa colombiana, la Decisión Andina 351, la DNDA y fuentes oficiales sobre derecho de autor.",
    "renderer": "sources"
  },
  {
    "id": "atlas",
    "path": "atlas.html",
    "title": "Atlas del derecho de autor",
    "description": "Un mapa accesible para conectar los conceptos de creación, autoría, protección y utilización de obras.",
    "renderer": "atlas"
  },
  {
    "id": "casos",
    "path": "casos.html",
    "title": "Casos prácticos",
    "description": "Analiza situaciones ilustrativas de fotografía, educación, software y música con explicaciones jurídicas generales.",
    "renderer": "cases"
  },
  {
    "id": "mitos",
    "path": "mitos.html",
    "title": "Mitos y realidades",
    "description": "Revisa cuatro creencias frecuentes sobre las obras, la atribución, el registro y el contenido en Internet.",
    "renderer": "mythsPage"
  },
  {
    "id": "buscar",
    "path": "buscar.html",
    "title": "Buscar en la biblioteca",
    "description": "Encuentra artículos, preguntas frecuentes, términos y casos de derecho de autor colombiano.",
    "renderer": "searchPage"
  },
  {
    "id": "explorar",
    "path": "explorar.html",
    "title": "Explorador de situaciones",
    "description": "Encuentra lecturas relacionadas con una creación propia, el uso de obras ajenas o el registro.",
    "renderer": "guidePage"
  },
  {
    "id": "quiz",
    "path": "cuestionarios.html",
    "title": "Cuestionarios voluntarios",
    "description": "Pon a prueba tus conocimientos con cuestionarios opcionales y explicaciones para cada respuesta.",
    "renderer": "quizPage"
  },
  {
    "id": "acerca",
    "path": "acerca.html",
    "title": "Acerca de Autoría Colombia",
    "description": "Conoce el propósito y los principios editoriales de esta biblioteca independiente de derecho de autor.",
    "renderer": "about"
  },
  {
    "id": "privacidad",
    "path": "privacidad.html",
    "title": "Privacidad",
    "description": "Conoce cómo se procesan las búsquedas y se guardan las preferencias locales en esta plataforma.",
    "renderer": "privacy"
  },
  {
    "id": "404",
    "path": "404.html",
    "title": "Página no encontrada",
    "description": "Vuelve al índice de Autoría Colombia y explora la biblioteca jurídica.",
    "renderer": "notFound"
  }
];

export const primaryNavigation = [
  { path: 'index.html', label: 'Inicio', id: 'home' },
  { path: 'temas/fundamentos-derecho-autor.html', label: 'Derecho de autor', id: 'fundamentos-derecho-autor' },
  { path: 'temas.html', label: 'Temas', id: 'temas' },
  { path: 'preguntas-frecuentes.html', label: 'Preguntas frecuentes', id: 'faq' },
  { path: 'contacto.html', label: 'Contacto', id: 'contacto' }
];

export const legacyAliases = { home:'home', aprender:'temas', buscar:'buscar', resolver:'explorar', casos:'casos', glosario:'glosario', fuentes:'fuentes', acerca:'acerca', quiz:'quiz', contacto:'contacto', faq:'faq', atlas:'atlas', recursos:'recursos' };
