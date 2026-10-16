export const articleHref = slug => `temas/${slug}.html`;
export const glossaryId = term => `termino-${term.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().replaceAll(' ', '-')}`;

export function absolutePageUrl(origin, pagePath) {
  return origin ? new URL(pagePath, `${origin.replace(/\/$/, '')}/`).href : '';
}
