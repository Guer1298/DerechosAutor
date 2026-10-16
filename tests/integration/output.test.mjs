import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { content } from '../../src/content/index.js';
import { contactConfig } from '../../src/config/contact.js';

const root=fileURLToPath(new URL('../../dist/',import.meta.url));
async function filesIn(dir) {
  const files=[];
  for(const entry of await readdir(dir,{withFileTypes:true})) {
    const file=path.join(dir,entry.name);
    if(entry.isDirectory())files.push(...await filesIn(file));else files.push(file);
  }
  return files;
}
const all=await filesIn(root);
const pages=new Map(await Promise.all(all.filter(f=>f.endsWith('.html')).map(async file=>[file,await readFile(file,'utf8')])));

test('28 páginas con títulos e IDs únicos y artículos completos sin JavaScript',()=>{
  assert.equal(pages.size,28);
  const titles=new Set();
  for(const [file,html]of pages){
    assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,file);
    const title=html.match(/<title>(.*?)<\/title>/)[1];
    assert(!titles.has(title),title);titles.add(title);
    assert.match(html,/<html lang="es-CO"/);
    assert.match(html,/name="description" content="[^"]{30,}"/);
    assert(!html.includes('undefined'),file);
    const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(new Set(ids).size,ids.length,file);
  }
  assert.equal(content.articles.length,12);
  assert.equal(content.glossary.length,20);
  for(const article of content.articles){
    const html=pages.get(path.join(root,`temas/${article.slug}.html`));
    assert(html.includes(article.title));
    for(const id of ['concepto','resumen','ejemplo','fundamento','preguntas'])assert(html.includes(`id="${id}"`));
  }
});

test('Todos los enlaces locales, anclas, recursos e imports del navegador existen',async()=>{
  for(const [file,html]of pages){
    const baseHref=html.match(/<base href="([^"]+)"/)[1];
    const documentUrl=new URL(path.relative(root,file), 'https://autoria.test/');
    const base=new URL(baseHref,documentUrl);
    for(const [,attr]of html.matchAll(/(?:href|src)="([^"]+)"/g)){
      if(/^(https?:|tel:|mailto:|data:)/.test(attr))continue;
      const url=new URL(attr.replaceAll('&amp;','&'),base);
      const target=path.join(root,decodeURIComponent(url.pathname));
      assert((await stat(target)).isFile()||attr===baseHref,`${attr} en ${file}`);
      if(url.hash&&target.endsWith('.html'))assert(pages.get(target)?.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),attr);
    }
  }
  for(const file of all.filter(f=>f.endsWith('.js'))){
    const text=await readFile(file,'utf8');
    for(const [,specifier]of text.matchAll(/(?:\bfrom\s*|\bimport\s*\()\s*['"]([^'"]+)['"]/g)){
      assert(specifier.startsWith('.'),`Import externo no permitido: ${specifier}`);
      assert((await stat(path.resolve(path.dirname(file),specifier))).isFile(),`${specifier} en ${file}`);
    }
  }
});

test('Teléfono autorizado presente en cabecera, móvil, artículos, contacto y pie',()=>{
  assert.equal(contactConfig.phoneInternational,'+573122062892');
  for(const html of pages.values()){
    const phones=[...html.matchAll(/href="tel:([^"]+)"/g)].map(m=>m[1]);
    assert(phones.length>=3);
    assert(phones.every(phone=>phone===contactConfig.phoneInternational));
    assert(!html.includes('Datos de contacto pendientes'));
    assert(!html.includes('Contacto pendiente de publicación'));
  }
  const contact=pages.get(path.join(root,'contacto.html'));
  assert(contact.includes('+57 3122062892'));
  assert(contact.includes('Llamar ahora'));
  assert(!contact.includes('Especialidad confirmada'));
});

test('Entrega contiene cabeceras de seguridad y excluye plantillas, pruebas y código de build',async()=>{
  const headers=await readFile(path.join(root,'_headers'),'utf8');
  assert(headers.includes("script-src 'self'"));
  assert(headers.includes('X-Content-Type-Options: nosniff'));
  const errorPage=pages.get(path.join(root,'404.html'));
  assert(errorPage.includes('<base href="/">'),'El 404 debe resolver recursos desde rutas anidadas en cualquier hosting');
  for(const file of all)assert(!/\/(?:templates|tooling|tests|docs)\//.test(file),file);
});
