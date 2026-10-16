import { legacyAliases, pageDefinitions } from '../config/routes.js';
import { articleHref } from '../shared/urls.js';
export const legacyRoutes = Object.fromEntries(Object.entries(legacyAliases).map(([alias, id]) => [alias, pageDefinitions.find(p => p.id === id).path]));

export function resolveLegacyRoute(hash, articles = []) {
  if (!hash.startsWith('#/')) return null;
  const route = hash.slice(2);
  if (route.startsWith('modulo/')) {
    const slug = route.slice(7);
    return articles.some(article => article.slug === slug) ? articleHref(slug) : '404.html';
  }
  return legacyRoutes[route] || '404.html';
}
