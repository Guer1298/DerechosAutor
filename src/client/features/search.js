import { articles } from '../../content/articles.js';
import { faqs } from '../../content/faqs.js';
import { glossary } from '../../content/glossary.js';
import { cases } from '../../content/cases.js';
import { createSearchIndex, searchContent, searchTypes } from '../../domain/search.js';
import { renderSearchResults } from '../../ui/search.js';

export function initSearch() {
  const input = document.querySelector('#search-input');
  if (!input) return;
  const index = createSearchIndex({ articles, faqs, glossary, cases });
  const params = new URLSearchParams(location.search);
  input.value = params.get('q') || '';
  let type = searchTypes.includes(params.get('tipo')) ? params.get('tipo') : 'todos';
  let timer;
  const update = () => {
    const results = searchContent(index, input.value, type);
    document.querySelector('#search-results').innerHTML = renderSearchResults(results, input.value);
    document.querySelector('#search-status').textContent = `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'}${input.value.trim() ? ` para “${input.value.trim()}”` : ' para explorar'}`;
    document.querySelectorAll('[data-search-type]').forEach(button => {
      button.classList.toggle('is-active', button.dataset.searchType === type);
      button.setAttribute('aria-pressed', String(button.dataset.searchType === type));
    });
    const url = new URL(location.href);
    input.value ? url.searchParams.set('q', input.value) : url.searchParams.delete('q');
    type === 'todos' ? url.searchParams.delete('tipo') : url.searchParams.set('tipo', type);
    history.replaceState(null, '', url);
  };
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(update, 160); });
  document.querySelector('.search-form').addEventListener('submit', event => { event.preventDefault(); clearTimeout(timer); update(); });
  document.querySelectorAll('[data-search-type]').forEach(button => button.addEventListener('click', () => { clearTimeout(timer); type = button.dataset.searchType; update(); }));
  update();
}
