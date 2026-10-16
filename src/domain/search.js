import { normalizeText } from '../shared/text.js';
import { articleHref, glossaryId } from '../shared/urls.js';
export const searchTypes = ['todos', 'artículo', 'pregunta', 'glosario', 'caso'];

export function createSearchIndex({ articles, faqs, glossary, cases }) {
  const items = [
    ...articles.map(a => ({ type: 'artículo', title: a.title, description: a.description, category: a.category, tags: a.tags, body: a.content.join(' '), href: articleHref(a.slug) })),
    ...faqs.map(f => ({ type: 'pregunta', title: f.question, description: f.answer, category: f.category, tags: f.tags, href: `preguntas-frecuentes.html#${f.id}` })),
    ...glossary.map(g => ({ type: 'glosario', title: g.term, description: g.definition, category: 'Glosario', tags: g.related, href: `glosario.html#${glossaryId(g.term)}` })),
    ...cases.map(c => ({ type: 'caso', title: c.title, description: c.situation, category: 'Casos', tags: c.legalPoints, href: `casos.html#${c.id}` }))
  ];
  return items.map(item => ({ ...item,
    searchTitle: normalizeText(item.title),
    searchText: normalizeText([item.title, item.description, item.body || '', ...item.tags].join(' '))
  }));
}

export function searchContent(index, query = '', type = 'todos') {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);
  const score = item => terms.reduce((sum, term) => sum + (item.searchTitle.includes(term) ? 3 : 0), 0);
  return index.filter(item => (type === 'todos' || item.type === type) && terms.every(term => item.searchText.includes(term)))
    .sort((a, b) => score(b) - score(a));
}
