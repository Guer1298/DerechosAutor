import { securityHeaders } from './headers.mjs';
import http from 'node:http';
import path from 'node:path';
import { readFile, realpath, stat } from 'node:fs/promises';

const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.json': 'application/json; charset=utf-8'
};

export function parsePort(value = '8000') {
  if (!/^\d+$/.test(String(value))) throw new Error('PORT debe ser un número entre 0 y 65535.');
  const port = Number(value);
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('PORT debe estar entre 0 y 65535.');
  return port;
}

function within(root, file) {
  const relative = path.relative(root, file);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

export async function createStaticServer({ root, logger = console }) {
  const directory = await realpath(root);
  return http.createServer(async (req, res) => {
    const send = (status, body = '', type = 'text/plain; charset=utf-8', extra = {}) => {
      res.writeHead(status, { 'Content-Type': type, 'Content-Length': Buffer.byteLength(body),
        'Cache-Control': 'no-cache', ...securityHeaders, ...extra });
      res.end(req.method === 'HEAD' ? undefined : body);
    };
    if (!['GET','HEAD'].includes(req.method)) { send(405,'Método no permitido',undefined,{Allow:'GET, HEAD'}); return; }
    let pathname;
    try { pathname = decodeURIComponent(req.url.split('?')[0]); }
    catch { send(400,'URL inválida'); return; }
    if (!pathname.startsWith('/') || /[\0\\]/.test(pathname)) { send(400,'URL inválida'); return; }
    if (pathname.split('/').some(segment => segment.startsWith('.'))) { send(403,'Acceso no permitido'); return; }
    try {
      let file = path.resolve(directory, `.${pathname}`);
      if (!within(directory, file)) { send(403,'Acceso no permitido'); return; }
      file = await realpath(file);
      if (!within(directory, file)) { send(403,'Acceso no permitido'); return; }
      if ((await stat(file)).isDirectory()) {
        if (!pathname.endsWith('/')) { send(308,'',undefined,{Location: `${pathname}/${req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''}`}); return; }
        file = await realpath(path.join(file,'index.html'));
        if (!within(directory, file)) { send(403,'Acceso no permitido'); return; }
      }
      const body = await readFile(file);
      send(200,body,types[path.extname(file)] || 'application/octet-stream');
    } catch (error) {
      if (!['ENOENT','ENOTDIR'].includes(error.code)) {
        logger.error('Error al servir un archivo:',error);
        send(500,'No se pudo procesar la solicitud');
        return;
      }
      const html = await readFile(path.join(directory,'404.html'),'utf8').catch(() => 'Página no encontrada');
      send(404,html.replace(/<base href="[^"]*">/,'<base href="/">'),'text/html; charset=utf-8');
    }
  });
}

export function listen(server, port, host = '127.0.0.1') {
  return new Promise((resolve,reject) => {
    server.once('error',reject);
    server.listen(port,host,() => { server.off('error',reject); resolve(server.address()); });
  });
}
