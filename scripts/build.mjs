import { siteConfig } from '../src/config/site.js';
import { buildSite } from '../tooling/build.mjs';

try {
  const result = await buildSite({ config: { ...siteConfig, origin: process.env.SITE_ORIGIN ?? siteConfig.origin } });
  console.log(`${result.pages} páginas generadas en ${result.outputDir}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
