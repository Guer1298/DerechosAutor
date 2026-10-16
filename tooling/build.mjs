import { hostingHeaders } from './headers.mjs';
import { mkdir, writeFile, cp, rm, mkdtemp, rename, stat, chmod } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { content } from '../src/content/index.js';
import { siteConfig } from '../src/config/site.js';
import { contactConfig } from '../src/config/contact.js';
import { absolutePageUrl } from '../src/shared/urls.js';
import { escapeHtml } from '../src/shared/text.js';
import { validateSite } from './validation.mjs';
import { createRoutes, renderRoute } from './routes.mjs';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));
export const defaultOutput = path.join(projectRoot, 'dist');

export async function buildSite({ outputDir = defaultOutput, config = siteConfig, render = renderRoute } = {}) {
  const output = path.resolve(outputDir);
  if (output === path.parse(output).root || output === projectRoot.replace(/\/$/, '') || ['src','public','tooling','tests','docs'].some(dir => output === path.join(projectRoot,dir) || output.startsWith(path.join(projectRoot,dir) + path.sep))) {
    throw new Error('El directorio de salida no puede reemplazar archivos fuente.');
  }
  const routes = createRoutes(content);
  validateSite({ content, config, contact: contactConfig, routes });
  await mkdir(path.dirname(output), { recursive: true });
  const lock = `${output}.lock`;
  try {
    await mkdir(lock);
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error(`Ya hay una generación en curso: ${lock}. Si el proceso fue interrumpido, revisa y elimina ese bloqueo.`);
    throw error;
  }
  let staging;
  let backup;
  let hasPrevious = false;
  try {
    await writeFile(path.join(lock, 'owner.json'), JSON.stringify({ pid: process.pid }));
    staging = await mkdtemp(path.join(path.dirname(output), `.${path.basename(output)}-stage-`));
    backup = `${staging}-previous`;
    const manifest = { schemaVersion: 1, generator: 'autoria-static', pages: [] };
    for (const route of routes) {
      const html = await render(route, config);
      const file = path.join(staging, route.path);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, html);
      manifest.pages.push({ path: route.path, sha256: createHash('sha256').update(html).digest('hex') });
    }
    await cp(path.join(projectRoot,'public'), staging, { recursive: true });
    await cp(path.join(projectRoot,'src/styles'), path.join(staging,'css'), { recursive: true });
    for (const dir of ['client','content','domain','config','shared','ui']) {
      await cp(path.join(projectRoot,'src',dir), path.join(staging,'js',dir), { recursive: true });
    }
    let robots = 'User-agent: *\nAllow: /\n';
    if (config.origin) {
      const urls = routes.filter(route => route.id !== '404').map(route => `<url><loc>${escapeHtml(absolutePageUrl(config.origin, route.path))}</loc></url>`).join('');
      await writeFile(path.join(staging,'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
      robots += `Sitemap: ${absolutePageUrl(config.origin, 'sitemap.xml')}\n`;
    }
    await writeFile(path.join(staging,'robots.txt'),robots);
    await writeFile(path.join(staging,'_headers'), hostingHeaders());
    await writeFile(path.join(staging,'build-manifest.json'),JSON.stringify(manifest,null,2) + '\n');
    // mkdtemp crea 0700; la salida publicada debe poder leerla el servidor del hosting.
    await chmod(staging,0o755);
    try { await stat(output); hasPrevious = true; } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (hasPrevious) await rename(output,backup);
    try { await rename(staging,output); }
    catch(error) { if (hasPrevious) await rename(backup,output); throw error; }
    if (hasPrevious) await rm(backup,{recursive:true,force:true});
    return { outputDir: output, pages: routes.length };
  } finally {
    if (staging) await rm(staging,{recursive:true,force:true});
    await rm(lock,{recursive:true,force:true});
  }
}
