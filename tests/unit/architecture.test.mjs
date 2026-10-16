import test from 'node:test';
import assert from 'node:assert/strict';
import {readdir,readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../src/',import.meta.url));
async function files(dir){const result=[];for(const entry of await readdir(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())result.push(...await files(full));else if(full.endsWith('.js'))result.push(full);}return result;}

test('Dominio independiente del DOM y separación entre cliente y plantillas',async()=>{
  for(const file of await files(root)){
    const text=await readFile(file,'utf8');
    const relative=path.relative(root,file);
    if(relative.startsWith('domain/'))assert(!/\b(document|window|localStorage)\b/.test(text),relative);
    for(const [,specifier]of text.matchAll(/(?:\bfrom\s*|\bimport\s*\()\s*['"]([^'"]+)['"]/g)){
      const target=path.relative(root,path.resolve(path.dirname(file),specifier));
      if(relative.startsWith('domain/'))assert(!/^(client|ui|templates)\//.test(target),`${relative} -> ${target}`);
      if(relative.startsWith('client/'))assert(!/^(templates|\.\.)\//.test(target),`${relative} -> ${target}`);
      if(relative.startsWith('templates/'))assert(!target.startsWith('client/'),`${relative} -> ${target}`);
    }
  }
});

test('Arranque del navegador no importa colecciones de contenido de forma anticipada',async()=>{
  const seen=new Set();
  async function visit(file){
    if(seen.has(file))return;seen.add(file);
    assert(!file.includes('/content/'),file);
    const source=await readFile(file,'utf8');
    for(const [,specifier]of source.matchAll(/^import\s+[^;]+?from\s+['"]([^'"]+)['"]/gm))await visit(path.resolve(path.dirname(file),specifier));
  }
  await visit(path.join(root,'client/app.js'));
});
