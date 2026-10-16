export function initTopics() {
const filters = document.querySelectorAll('[data-topic-filter]');
filters.forEach(button => button.addEventListener('click', () => {
  let count = 0;
  filters.forEach(b => { b.classList.toggle('is-active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  document.querySelectorAll('[data-topic-category]').forEach(row => {
    row.hidden = button.dataset.topicFilter !== 'todos' && row.dataset.topicCategory !== button.dataset.topicFilter;
    if (!row.hidden) count++;
  });
  document.querySelector('#topic-count').textContent = `${count} temas disponibles`;
}));


}
