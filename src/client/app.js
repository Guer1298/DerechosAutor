import { initTheme } from './theme.js';
import { initNavigation, initHashNavigation, initLegacyRouting } from './navigation.js';

function initialize(name, init) {
  try { init(); } catch (error) { console.error(`No se pudo inicializar ${name}.`, error); }
}

initialize('el tema', initTheme);
initialize('la navegación', initNavigation);
initialize('los enlaces internos', initHashNavigation);
initialize('las rutas anteriores', initLegacyRouting);

const features = {
  buscar: () => import('./features/search.js').then(m => m.initSearch()),
  quiz: () => import('./features/quiz.js').then(m => m.initQuiz()),
  explorar: () => import('./features/guide.js').then(m => m.initGuide()),
  casos: () => import('./features/cases.js').then(m => m.initCases()),
  mitos: () => import('./features/myths.js').then(m => m.initMyths()),
  temas: () => import('./features/topics.js').then(m => m.initTopics()),
  privacidad: () => import('./features/privacy.js').then(m => m.initPrivacy())
};

const load = features[document.body.dataset.page] || (document.querySelector('.article-body')
  ? () => import('./features/article.js').then(m => m.initArticle()) : null);

if (load) load().catch(error => {
  console.error('No se pudo cargar el recurso interactivo.', error);
  const root = document.querySelector('#quiz, #guide, .search-area');
  if (root) {
    root.innerHTML = '<div class="educational-note" role="status"><p>No se pudo cargar este recurso. Puedes recargar la página o consultar los contenidos directamente.</p><a class="text-link" href="temas.html">Explorar todos los temas</a></div>';
  }
});
