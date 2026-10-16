import { isContactAvailable } from '../src/config/contact.js';
import { glossaryId } from '../src/shared/urls.js';

export class ValidationError extends Error {
  constructor(issues) {
    super(`No se puede generar el sitio:\n${issues.map(issue => `- ${issue}`).join('\n')}`);
    this.name = 'ValidationError';
    this.issues = issues;
  }
}

export function validateSite({ content, config, contact, routes }) {
  const issues = [];
  const check = (condition, message) => { if (!condition) issues.push(message); };
  const string = value => typeof value === 'string' && value.trim().length > 0;
  const list = (value, label) => {
    if (!Array.isArray(value)) { issues.push(`${label} debe ser una lista.`); return []; }
    return value;
  };
  const records = (value, label) => list(value, label).filter((item, index) => {
    const valid = item !== null && typeof item === 'object' && !Array.isArray(item);
    check(valid, `${label}[${index}] debe ser un objeto.`);
    return valid;
  });
  const unique = (items, field, label) => {
    const seen = new Set();
    for (const item of items) {
      const value = String(item[field]);
      check(!seen.has(value), `${label}: ${field} duplicado (${value}).`);
      seen.add(value);
    }
  };
  const articles = records(content.articles, 'Artículos');
  const sources = records(content.legalSources, 'Fuentes');
  const faqs = records(content.faqs, 'Preguntas');
  const glossary = records(content.glossary, 'Glosario');
  const cases = records(content.cases, 'Casos');
  const quizzes = records(content.quizzes, 'Cuestionarios');
  check(articles.length > 0, 'La biblioteca debe tener artículos.');
  const slugs = new Set(articles.map(a => a.slug));
  const sourceIds = new Set(sources.map(s => s.id));
  for (const [items, field, label] of [[articles,'slug','Artículos'], [articles,'id','Artículos'], [sources,'id','Fuentes'], [faqs,'id','Preguntas'], [cases,'id','Casos'], [quizzes,'id','Cuestionarios']]) unique(items,field,label);
  for (const article of articles) {
    check(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug), `Slug de artículo inválido: ${article.slug}.`);
    for (const field of ['title','description','category','example','misconception','summary','reviewStatus']) check(string(article[field]), `${article.slug}: falta ${field}.`);
    for (const field of ['content','objectives','concepts','tags']) {
      const values = list(article[field], `${article.slug}.${field}`);
      check(values.length > 0 && values.every(string), `${article.slug}.${field} debe contener texto.`);
    }
    const ids = list(article.sourceIds, `${article.slug}.sourceIds`);
    check(ids.length > 0, `${article.slug}: debe tener fuentes.`);
    for (const id of ids) check(sourceIds.has(id), `${article.slug}: fuente inexistente ${id}.`);
    for (const slug of list(article.relatedArticleSlugs, `${article.slug}.relatedArticleSlugs`)) check(slugs.has(slug) && slug !== article.slug, `${article.slug}: artículo relacionado inválido ${slug}.`);
  }
  for (const source of sources) {
    check(string(source.id) && string(source.title) && string(source.description), 'Fuente incompleta.');
    try { check(['http:', 'https:'].includes(new URL(source.url).protocol), `Protocolo de fuente inválido: ${source.id}.`); }
    catch { issues.push(`URL de fuente inválida: ${source.id}.`); }
  }
  for (const faq of faqs) {
    check(string(faq.id) && string(faq.question) && string(faq.answer), `Pregunta incompleta: ${faq.id}.`);
    check(slugs.has(faq.slug), `Pregunta ${faq.id}: artículo inexistente ${faq.slug}.`);
    check(list(faq.tags, `${faq.id}.tags`).every(string), `Etiquetas inválidas: ${faq.id}.`);
  }
  const glossaryIds = new Set();
  for (const entry of glossary) {
    check(string(entry.term) && string(entry.definition) && string(entry.example), 'Término de glosario incompleto.');
    check(slugs.has(entry.articleSlug), `Glosario ${entry.term}: artículo inexistente.`);
    if (string(entry.term)) {
      const id = glossaryId(entry.term);
      check(!glossaryIds.has(id), `Ancla de glosario duplicada: ${id}.`);
      glossaryIds.add(id);
    }
  }
  const questions = (items, label) => {
    for (const item of items) {
      const options = list(item.options, `${label}.options`);
      check(options.length >= 2 && options.every(string), `${label}: opciones incompletas.`);
      check(Number.isInteger(item.answer) && item.answer >= 0 && item.answer < options.length, `${label}: respuesta fuera de rango.`);
    }
  };
  questions(cases, 'Casos');
  check(quizzes.length > 0, 'Debe existir al menos un cuestionario.');
  for (const quiz of quizzes) {
    const entries = records(quiz.questions, `${quiz.id}.questions`);
    check(entries.length > 0, `Cuestionario vacío: ${quiz.id}.`);
    questions(entries, quiz.id);
    entries.forEach(q => check(string(q.prompt) && string(q.feedback), `${quiz.id}: pregunta o explicación vacía.`));
  }
  for (const myth of records(content.myths, 'Mitos')) check(slugs.has(myth.slug), `Mito: artículo inexistente ${myth.slug}.`);
  check(string(config.name) && /^[a-z]{2}(?:-[A-Z]{2})?$/.test(config.language), 'Nombre o idioma del sitio inválidos.');
  check(Number.isInteger(config.copyrightYear) && config.copyrightYear >= 2000, 'Año editorial inválido.');
  if (config.origin) {
    try {
      const url = new URL(config.origin);
      check(['http:', 'https:'].includes(url.protocol) && !url.username && !url.password && !url.search && !url.hash && url.pathname === '/', 'origin debe ser un dominio HTTP(S) sin credenciales, rutas, consulta ni fragmento.');
    } catch { issues.push('origin no es una URL válida.'); }
  }
  check(['pending', 'verified'].includes(contact.status), 'Estado del contacto desconocido.');
  check(contact.status !== 'verified' || isContactAvailable(contact), 'El contacto confirmado requiere un teléfono internacional válido.');
  unique(routes, 'path', 'Rutas');
  unique(routes, 'id', 'Rutas');
  for (const route of routes) {
    check(/^(?:[a-z0-9-]+\/)*[a-z0-9-]+\.html$/.test(route.path), `Ruta de salida insegura: ${route.path}.`);
    check(string(route.title) && string(route.description), `Metadatos incompletos: ${route.path}.`);
  }
  if (issues.length) throw new ValidationError(issues);
}
