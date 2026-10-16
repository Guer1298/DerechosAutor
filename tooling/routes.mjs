import { pageDefinitions } from '../src/config/routes.js';
import { articleHref } from '../src/shared/urls.js';

export function createRoutes(content) {
  return [
    ...pageDefinitions,
    ...content.articles.map(article => ({
      id: article.slug, path: articleHref(article.slug), title: article.title,
      description: article.description, renderer: 'article', article
    }))
  ];
}

export async function renderRoute(route, config) {
  const { layout } = await import('../src/templates/layout.js');
  let render;
  if (['home', 'article'].includes(route.renderer)) {
    render = (await import(`../src/templates/${route.renderer}.js`))[route.renderer];
  } else {
    render = (await import(`../src/templates/pages/${route.renderer}.js`))[route.renderer];
  }
  return layout({ title: route.title, description: route.description, content: render(route.article), page: route.id, path: route.path }, config);
}
