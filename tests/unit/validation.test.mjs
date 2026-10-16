import test from 'node:test';
import assert from 'node:assert/strict';
import { content } from '../../src/content/index.js';
import { siteConfig } from '../../src/config/site.js';
import { contactConfig } from '../../src/config/contact.js';
import { createRoutes } from '../../tooling/routes.mjs';
import { validateSite, ValidationError } from '../../tooling/validation.mjs';
const options = () => ({content:structuredClone(content),config:{...siteConfig},contact:{...contactConfig},routes:createRoutes(content)});

test('Contenido y configuración actuales cumplen el contrato', () => {
  assert.doesNotThrow(() => validateSite(options()));
});

test('Relaciones rotas, IDs duplicados y respuestas inválidas se informan antes del build', () => {
  const data = options();
  data.content.articles[1].slug = data.content.articles[0].slug;
  data.content.articles[0].sourceIds.push('fuente-inexistente');
  data.content.faqs[0].slug = 'no-existe';
  data.content.quizzes[0].questions[0].answer = 99;
  assert.throws(() => validateSite(data),error => error instanceof ValidationError && error.issues.length>=4);
});

test('Se rechazan dominios, teléfonos confirmados y rutas de salida inválidos', () => {
  for (const origin of ['javascript:alert(1)','https://user:pass@example.com','https://example.com/path','https://example.com/?x=1']) {
    const data=options();data.config.origin=origin;assert.throws(()=>validateSite(data),ValidationError);
  }
  const data=options();data.contact.phoneInternational='pendiente';data.routes[0].path='../index.html';
  assert.throws(()=>validateSite(data),error=>error.issues.some(i=>i.includes('teléfono'))&&error.issues.some(i=>i.includes('insegura')));
});
