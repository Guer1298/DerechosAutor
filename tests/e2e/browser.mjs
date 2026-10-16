import { createRequire } from 'node:module';
import { mkdir, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { contactConfig } from '../../src/config/contact.js';
import assert from 'node:assert/strict';
const require = createRequire(path.join(process.env.QA_MODULES || path.resolve('node_modules'), '../package.json'));
const { chromium } = require('playwright');
const axeSource = await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
let browser;
try {
browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const origin = process.env.QA_ORIGIN || 'http://127.0.0.1:8000';
const errors = [], violations = [], overflows = [], checks = [], resourceErrors = [], policyViolations = [];
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', colorScheme: 'light' });
await context.addInitScript(() => {
  window.__policyViolations = [];
  document.addEventListener('securitypolicyviolation', event => window.__policyViolations.push({ directive: event.effectiveDirective, blockedURI: event.blockedURI }));
});
const page = await context.newPage();
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.url().startsWith(origin) && response.status() >= 400) resourceErrors.push({ url: response.url(), status: response.status() }); });
page.on('requestfailed', request => { if (request.failure()?.errorText !== 'net::ERR_ABORTED') resourceErrors.push({ url: request.url(), error: request.failure()?.errorText }); });
const visit = async route => {
  const previous = await page.evaluate(() => window.__policyViolations || []);
  if (previous.length) policyViolations.push({ route: page.url(), violations: previous });
  const r = await page.goto(`${origin}/${route}`); assert.equal(r.status(), 200, route); await page.waitForTimeout(80);
};
const rootPages = (await readdir('dist')).filter(f => f.endsWith('.html') && f !== '404.html');
const articlePages = (await readdir('dist/temas')).filter(f => f.endsWith('.html')).map(f => `temas/${f}`);
await mkdir('artifacts', {recursive: true});
for (const route of [...rootPages, ...articlePages]) {
  await visit(route);
  assert.equal(await page.locator('h1').count(), 1, route);
  await page.evaluate(axeSource);
  const result = await page.evaluate(async () => (await axe.run(document, {runOnly: {type: 'tag', values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
  if (result.length) violations.push({route, theme:'light',result});
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({width,height:900});
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth + 1);
    if (overflow) overflows.push({route,width});
  }
  await page.setViewportSize({width:1440,height:1000});
  console.log('Revisada:',route);
}
const requests=[];page.on('request',r=>requests.push(r.url()));
await visit('index.html');
assert(!requests.some(url=>url.includes('/content/')));checks.push('Portada sin descarga de colecciones de contenido');
await page.screenshot({path:'artifacts/home-desktop.png',fullPage:true});
await page.screenshot({path:'artifacts/desktop-viewport.png'});
await page.locator('.footer-bottom .theme-toggle').click();
await page.reload();
assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
for(const route of ['index.html','temas/software-propiedad-intelectual.html','contacto.html','buscar.html','cuestionarios.html']){
  await visit(route);await page.evaluate(axeSource);
  const result=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
  if(result.length)violations.push({route,theme:'dark',result});
}
await writeFile('artifacts/accessibility-report.json', JSON.stringify({errors,overflows,violations},null,2));
await visit('temas/software-propiedad-intelectual.html');await page.screenshot({path:'artifacts/article-dark.png',fullPage:true});
await page.locator('.footer-bottom .theme-toggle').click();checks.push('Tema oscuro persistente y cambio a claro');
await visit('buscar.html');await page.locator('#search-input').fill('FOTOGRAFIA');await page.waitForTimeout(250);assert(await page.locator('.search-result').count()>0);
await page.locator('[data-search-type="pregunta"]').click();assert(await page.locator('.search-result').count()>0);
await page.locator('.search-result h2 a').first().click();assert(await page.locator('details[open]').count()>0);
await visit('buscar.html');await page.locator('#search-input').fill('<img src=x onerror=alert(1)>');await page.waitForTimeout(250);assert.equal(await page.locator('#search-results img').count(),0);assert(await page.locator('.search-empty').isVisible());
checks.push('Búsqueda sin tildes, filtros, anclas FAQ y escape de HTML');
await visit('temas.html');await page.locator('[data-topic-filter="Tecnología"]').click();assert.equal(await page.locator('.topic-row:visible').count(),1);checks.push('Filtro de temas');
await visit('explorar.html');
for (const value of ['usar','software','hay_licencia']) {await page.locator(`[data-guide-choice="${value}"]`).click();await page.locator('[data-guide-next]').click();}
assert(await page.locator('.guide-reading-list a[href*="software"]').isVisible());
await page.locator('[data-guide-restart]').click();assert(await page.locator('[data-guide-choice="usar"]').isVisible());checks.push('Explorador, recomendaciones y reinicio');
await visit('cuestionarios.html');await page.locator('[data-quiz-answer="1"]').click();await page.locator('[data-quiz-next]').click();
await page.locator('[data-quiz-answer="0"]').click();await page.locator('[data-quiz-prev]').click();assert.equal(await page.locator('[data-quiz-answer="1"]').getAttribute('aria-pressed'),'true');
await page.locator('[data-quiz-answer="0"]').click();await page.locator('[data-quiz-next]').click();await page.reload();assert.equal(await page.locator('[data-quiz-answer="0"]').getAttribute('aria-pressed'),'true');
for(let i=0;i<20 && await page.locator('[data-quiz-next]').count();i++){await page.locator('[data-quiz-answer="0"]').click();await page.locator('[data-quiz-next]').click();}
assert(await page.locator('.result-score').isVisible());await page.locator('[data-quiz-reset]').click();assert(await page.locator('[data-quiz-prev]').isDisabled());checks.push('Cuestionario: avanzar, retroceder, corregir, persistir, finalizar y reiniciar');
await visit('casos.html');await page.locator('[data-case-answer="0"]').first().click();assert(await page.locator('.case-explanation[open]').count()>0);checks.push('Casos prácticos');
await visit('mitos.html');await page.locator('[data-myth-answer="false"]').first().click();assert.match(await page.locator('.myth-feedback').first().textContent(),/Correcto/);checks.push('Mitos y realidades');
await visit('index.html#/modulo/software-propiedad-intelectual');await page.waitForURL('**/temas/software-propiedad-intelectual.html');checks.push('Compatibilidad con enlaces antiguos');
await visit('contacto.html');assert(await page.locator(`a[href="tel:${contactConfig.phoneInternational}"]`).count()>=3);assert(await page.getByRole('link',{name:'Llamar ahora'}).isVisible());checks.push('Teléfono autorizado en contacto, cabecera, móvil y pie');
await page.setViewportSize({width:390,height:844});await visit('index.html');await page.screenshot({path:'artifacts/home-mobile.png',fullPage:true});await page.screenshot({path:'artifacts/mobile-viewport.png'});
await page.locator('.nav-toggle').focus();await page.keyboard.press('Enter');assert(await page.locator('#mobile-menu').isVisible());await page.keyboard.press('Escape');assert(await page.locator('#mobile-menu').isHidden());assert(await page.locator('.nav-toggle').evaluate(e=>e===document.activeElement));checks.push('Menú móvil con teclado, Escape y retorno del foco');
await visit('privacidad.html');await page.locator('#clear-local-data').click();assert.equal(await page.evaluate(()=>localStorage.getItem('autor-colombia-quiz-progress')),null);checks.push('Borrado de progreso local');
const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const np=await nojs.newPage();
await np.goto(`${origin}/temas/software-propiedad-intelectual.html`);assert(await np.locator('#concepto').isVisible());assert(await np.locator('#fundamento').isVisible());assert(await np.locator('.no-js-nav').isVisible());
await np.goto(`${origin}/preguntas-frecuentes.html`);await np.locator('summary').nth(1).click();assert(await np.locator('details').nth(1).getAttribute('open')!==null);checks.push('Lectura, navegación móvil y FAQ sin JavaScript');
await nojs.close();await browser.close();
const report={date:new Date().toISOString(),pages:rootPages.length+articlePages.length,viewports:[1440,768,390,320],errors,resourceErrors,policyViolations,overflows,violations,checks};
await writeFile('artifacts/browser-report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
assert.equal(errors.length,0,'Errores de JavaScript');assert.equal(overflows.length,0,'Desbordamientos');assert.equal(violations.length,0,'Hallazgos axe');
assert.equal(resourceErrors.length,0,'Recursos fallidos');assert.equal(policyViolations.length,0,'Violaciones de la política CSP');

} finally { await browser?.close(); }
