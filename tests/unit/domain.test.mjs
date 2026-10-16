import test from 'node:test';
import assert from 'node:assert/strict';
import { content } from '../../src/content/index.js';
import { guideFlow } from '../../src/content/guide.js';
import { createSearchIndex, searchContent } from '../../src/domain/search.js';
import { renderSearchResults } from '../../src/ui/search.js';
import { createQuizState, transitionQuiz, buildQuizResults, loadQuizProgress, serializeQuizProgress } from '../../src/domain/quiz.js';
import { createGuideState, transitionGuide, recommendedReadings } from '../../src/domain/guide.js';
import { resolveLegacyRoute, legacyRoutes } from '../../src/domain/routing.js';
import { isContactAvailable } from '../../src/config/contact.js';
import { createStorage } from '../../src/client/storage.js';
import { storageKeys } from '../../src/config/storage.js';
import { createBuildQueue } from '../../tooling/build-queue.mjs';
const index = createSearchIndex(content);

test('Búsqueda por palabras, sin tildes, con categorías y anclas exactas', () => {
  assert(searchContent(index,'FOTOGRAFIA').length > 0);
  assert(searchContent(index,'codigo','artículo').some(r => r.title.includes('Software')));
  assert(searchContent(index,'','glosario').every(r => r.type === 'glosario'));
  assert.equal(searchContent(index,'','pregunta').length,content.faqs.length);
  assert(searchContent(index,'licencia','pregunta').every(r => r.href.startsWith('preguntas-frecuentes.html#')));
  assert.equal(searchContent(index,'zqxyinexistente').length,0);
  const html = renderSearchResults([], '<img src=x onerror="alert(1)">');
  assert(!html.includes('<img'));
  assert(html.includes('&lt;img'));
});

test('Rutas anteriores preservadas, rutas desconocidas y anclas nativas', () => {
  for (const article of content.articles) assert.equal(resolveLegacyRoute(`#/modulo/${article.slug}`,content.articles),`temas/${article.slug}.html`);
  for (const [old,current] of Object.entries(legacyRoutes)) assert.equal(resolveLegacyRoute(`#/${old}`),current);
  assert.equal(resolveLegacyRoute('#/modulo/no-existe',content.articles),'404.html');
  assert.equal(resolveLegacyRoute('#ejemplo'),null);
});

test('Cuestionario impide avanzar sin responder, conserva respuestas y no muta estados anteriores', () => {
  const quiz = content.quizzes[0];
  const initial = createQuizState(quiz);
  assert.deepEqual(transitionQuiz(quiz,initial,{type:'next'}),initial);
  const answered = transitionQuiz(quiz,initial,{type:'answer',answer:1});
  assert.equal(initial.answers[0],null);
  assert.equal(answered.answers[0],1);
  let state = transitionQuiz(quiz,answered,{type:'next'});
  state = transitionQuiz(quiz,state,{type:'previous'});
  assert.equal(state.index,0);
  assert.equal(state.answers[0],1);
  for (let i=0;i<quiz.questions.length;i++) {
    state = transitionQuiz(quiz,state,{type:'answer',answer:quiz.questions[i].answer});
    state = transitionQuiz(quiz,state,{type:'next'});
  }
  assert(state.complete);
  assert.equal(buildQuizResults(quiz.questions,state.answers).percentage,100);
  assert.deepEqual(transitionQuiz(quiz,state,{type:'reset'}),initial);
  assert.throws(() => transitionQuiz(quiz,initial,{type:'answer',answer:99}),RangeError);
});

test('Persistencia tolera datos corruptos y descarta respuestas cuando cambia el cuestionario', () => {
  const quiz = content.quizzes[0];
  assert.deepEqual(loadQuizProgress('broken',content.quizzes),{});
  assert.deepEqual(loadQuizProgress('null',content.quizzes),{});
  const invalid = loadQuizProgress(JSON.stringify({[quiz.id]:{answers:[999,0,-1],index:99,complete:true}}),content.quizzes)[quiz.id];
  assert.equal(invalid.answers[0],null);
  assert.equal(invalid.answers[1],0);
  assert.equal(invalid.index,quiz.questions.length-1);
  assert.equal(invalid.complete,false);
  const state = transitionQuiz(quiz,createQuizState(quiz),{type:'answer',answer:0});
  const serialized = serializeQuizProgress({[quiz.id]:state},content.quizzes);
  assert.deepEqual(loadQuizProgress(serialized,content.quizzes)[quiz.id],state);
  const changed = structuredClone(content.quizzes);
  changed[0].questions[0].prompt += ' nueva versión';
  assert.equal(loadQuizProgress(serialized,changed)[quiz.id],undefined);
});

test('Explorador completa pasos válidos, conserva la selección al volver y reinicia', () => {
  let state = createGuideState();
  assert.deepEqual(transitionGuide(guideFlow,state,{type:'next'}),state);
  for (const value of ['usar','software','hay_modificacion']) {
    state = transitionGuide(guideFlow,state,{type:'choose',value});
    state = transitionGuide(guideFlow,state,{type:'next'});
  }
  assert(state.complete);
  const slugs = recommendedReadings(state.selections,content.articles).map(a => a.slug);
  assert(slugs.includes('software-propiedad-intelectual'));
  assert(slugs.includes('derechos-morales'));
  assert(slugs.includes('limites-y-excepciones'));
  assert.deepEqual(transitionGuide(guideFlow,state,{type:'reset'}),createGuideState());
  assert.throws(() => transitionGuide(guideFlow,createGuideState(),{type:'choose',value:'desconocida'}));
});

test('Validación del teléfono y estado pendiente', () => {
  assert(isContactAvailable({status:'verified',phoneInternational:'+573122062892'}));
  assert(!isContactAvailable({status:'pending',phoneInternational:'+573122062892'}));
  assert(!isContactAvailable({status:'verified',phoneInternational:'+57NUMERO_REAL'}));
  assert(!isContactAvailable({status:'verified',phoneInternational:'312 2062892'}));
});

test('Almacenamiento bloqueado no rompe la aplicación y el borrado se limita a las claves propias', () => {
  const blocked = createStorage(() => {throw Error('Bloqueado');});
  assert.equal(blocked.get('x'),null);
  assert.equal(blocked.set('x','v'),false);
  assert.equal(blocked.clearPreferences(),false);
  const values = new Map([['otro-sitio','conservar'], ...Object.values(storageKeys).map(key => [key,'valor'])]);
  const store = createStorage(() => ({getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}));
  assert(store.clearPreferences());
  assert.deepEqual([...values],[['otro-sitio','conservar']]);
});

test('Reconstrucciones concurrentes se serializan y agrupan', async () => {
  let release;
  let calls = 0;
  let active = 0;
  let maxActive = 0;
  const gate = new Promise(resolve => { release=resolve; });
  const queue = createBuildQueue(async () => { calls++; active++; maxActive=Math.max(maxActive,active); if(calls===1)await gate; active--; });
  const first = queue();
  queue();queue();
  release();
  await first;
  assert.equal(calls,2);
  assert.equal(maxActive,1);
});
