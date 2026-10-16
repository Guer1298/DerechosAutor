export function sourcesFor(article, sources) {
  const byId = new Map(sources.map(source => [source.id, source]));
  return article.sourceIds.map(id => {
    const source = byId.get(id);
    if (!source) throw new Error(`Fuente desconocida: ${id} en ${article.slug}`);
    return source;
  });
}

export function readingMinutes(article) {
  const text = [article.description, ...article.content, article.example, article.misconception,
    article.summary, ...(article.objectives || [])].join(' ');
  return Math.max(2, Math.ceil(text.split(/\s+/).length / 180));
}
