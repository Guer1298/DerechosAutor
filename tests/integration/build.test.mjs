import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile, readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildSite } from '../../tooling/build.mjs';
import { renderRoute } from '../../tooling/routes.mjs';
import { siteConfig } from '../../src/config/site.js';

async function workspace(t) {
  const root=await mkdtemp(path.join(tmpdir(),'autoria-test-'));
  t.after(()=>rm(root,{recursive:true,force:true}));
  return path.join(root,'dist');
}

test('Build reproducible elimina archivos obsoletos y no genera URLs ficticias',async t=>{
  const outputDir=await workspace(t);
  await buildSite({outputDir});
  if(process.platform!=='win32')assert.equal((await stat(outputDir)).mode & 0o555,0o555,'El servidor del hosting debe poder leer y recorrer la salida');
  const first=await readFile(path.join(outputDir,'build-manifest.json'),'utf8');
  await writeFile(path.join(outputDir,'obsoleto.html'),'anterior');
  await buildSite({outputDir});
  assert.equal(await readFile(path.join(outputDir,'build-manifest.json'),'utf8'),first);
  await assert.rejects(stat(path.join(outputDir,'obsoleto.html')),{code:'ENOENT'});
  await assert.rejects(stat(path.join(outputDir,'sitemap.xml')),{code:'ENOENT'});
});

test('Un fallo de render o configuración preserva la última versión completa',async t=>{
  const outputDir=await workspace(t);
  await buildSite({outputDir});
  const first=await readFile(path.join(outputDir,'index.html'),'utf8');
  let count=0;
  await assert.rejects(buildSite({outputDir,render:async(route,config)=>{
    if(++count===4)throw Error('Fallo simulado');return renderRoute(route,config);
  }}),/Fallo simulado/);
  assert.equal(await readFile(path.join(outputDir,'index.html'),'utf8'),first);
  await assert.rejects(buildSite({outputDir,config:{...siteConfig,origin:'no-es-url'}}));
  assert.equal(await readFile(path.join(outputDir,'index.html'),'utf8'),first);
});

test('Dominio confirmado genera canonical y sitemap; 404 queda fuera del índice',async t=>{
  const outputDir=await workspace(t);
  await buildSite({outputDir,config:{...siteConfig,origin:'https://example.com'}});
  const html=await readFile(path.join(outputDir,'temas/software-propiedad-intelectual.html'),'utf8');
  assert(html.includes('rel="canonical" href="https://example.com/temas/software-propiedad-intelectual.html"'));
  const xml=await readFile(path.join(outputDir,'sitemap.xml'),'utf8');
  assert.equal((xml.match(/<url>/g)||[]).length,27);
  assert(!xml.includes('404.html'));
});

test('Se evita que dos builds escriban simultáneamente la misma salida',async t=>{
  const outputDir=await workspace(t);
  let release,started;
  const gate=new Promise(resolve=>{release=resolve;});
  const ready=new Promise(resolve=>{started=resolve;});
  const first=buildSite({outputDir,render:async(route,config)=>{started();await gate;return renderRoute(route,config);}});
  await ready;
  await assert.rejects(buildSite({outputDir}),/generación en curso/);
  release();await first;
  assert((await stat(path.join(outputDir,'index.html'))).isFile());
});
