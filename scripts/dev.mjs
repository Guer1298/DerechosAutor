import { watch } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createStaticServer, listen, parsePort } from '../tooling/server.mjs';
import { createBuildQueue } from '../tooling/build-queue.mjs';

const root = fileURLToPath(new URL('../',import.meta.url));
let child;
let timer;
let server;
const watchers = [];
const build = () => new Promise((resolve,reject) => {
  // Un proceso nuevo evita la caché de módulos ESM al editar contenido o plantillas.
  child = spawn(process.execPath,['scripts/build.mjs'],{cwd:root,stdio:'inherit'});
  child.once('error',reject);
  child.once('exit',code => code === 0 ? resolve() : reject(new Error('La generación falló; se conserva la versión anterior.')));
});
try {
  await build();
  server = await createStaticServer({root:path.join(root,'dist')});
  const address = await listen(server,parsePort(process.env.PORT || '8000'));
  const requestBuild = createBuildQueue(build,error => console.error(error.message));
  for (const directory of ['src','public','tooling']) {
    const watcher = watch(path.join(root,directory),{recursive:true},() => {
      clearTimeout(timer);
      timer = setTimeout(requestBuild,150);
    });
    watcher.on('error',error => console.error('No se pudo observar un cambio:',error.message));
    watchers.push(watcher);
  }
  console.log(`Autoría Colombia · http://127.0.0.1:${address.port}`);
  console.log('Reconstrucción automática activa. Recarga el navegador después de guardar.');
  for (const signal of ['SIGINT','SIGTERM']) process.once(signal,() => {
    clearTimeout(timer);
    watchers.forEach(watcher => watcher.close());
    child?.kill();
    server.close();
    server.closeAllConnections();
  });
} catch (error) {
  console.error(error.code === 'EADDRINUSE' ? 'Puerto ocupado. Usa PORT=8080 npm run dev.' : error.message);
  process.exitCode = 1;
}
