import { fileURLToPath } from 'node:url';
import { createStaticServer, listen, parsePort } from '../tooling/server.mjs';

try {
  const port = parsePort(process.env.PORT || '8000');
  const server = await createStaticServer({ root: fileURLToPath(new URL('../dist/', import.meta.url)) });
  const address = await listen(server,port);
  console.log(`Autoría Colombia · http://127.0.0.1:${address.port}`);
  for (const signal of ['SIGINT','SIGTERM']) process.once(signal,() => { server.close(); server.closeAllConnections(); });
} catch (error) {
  console.error(error.code === 'ENOENT' ? 'No existe dist/. Ejecuta npm run build.'
    : error.code === 'EADDRINUSE' ? 'El puerto está ocupado. Usa PORT=8080 npm start.' : error.message);
  process.exitCode = 1;
}
