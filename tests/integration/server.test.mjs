import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { createStaticServer, listen, parsePort } from '../../tooling/server.mjs';

test('Servidor HTTP: GET, HEAD, 404, métodos, rutas inválidas y enlaces fuera del sitio',async t=>{
  const temp=await mkdtemp(path.join(tmpdir(),'autoria-http-'));
  const root=path.join(temp,'public');
  await mkdir(root);
  await writeFile(path.join(root,'index.html'),'<h1>Autoría</h1>');
  await writeFile(path.join(root,'404.html'),'<base href="./"><h1>No encontrada</h1>');
  await writeFile(path.join(temp,'fuera.txt'),'Contenido que no debe servirse');
  await symlink(path.join(temp,'fuera.txt'),path.join(root,'enlace.txt'));
  const server=await createStaticServer({root});
  t.after(async()=>{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await rm(temp,{recursive:true,force:true});});
  const address=await listen(server,0);
  const base=`http://127.0.0.1:${address.port}`;
  const get=await fetch(base);
  assert.equal(get.status,200);
  assert.match(get.headers.get('content-type'),/text\/html/);
  assert.match(get.headers.get('content-security-policy'),/script-src 'self'/);
  const head=await fetch(base,{method:'HEAD'});
  assert.equal(await head.text(),'');assert(Number(head.headers.get('content-length'))>0);
  const missing=await fetch(`${base}/desconocida/ruta`);
  assert.equal(missing.status,404);assert((await missing.text()).includes('<base href="/">'));
  const head404=await fetch(`${base}/no-existe`,{method:'HEAD'});assert.equal(await head404.text(),'');
  assert.equal((await fetch(base,{method:'POST'})).status,405);
  assert.equal((await fetch(`${base}/%GG`)).status,400);
  assert.equal((await fetch(`${base}/..%2ffuera.txt`)).status,403);
  assert.equal((await fetch(`${base}/enlace.txt`)).status,403);
});

test('Puerto válido, puerto efímero y entradas inválidas',()=>{
  assert.equal(parsePort('0'),0);assert.equal(parsePort('8080'),8080);
  for(const value of ['abc','-1','65536','80.5'])assert.throws(()=>parsePort(value));
});
