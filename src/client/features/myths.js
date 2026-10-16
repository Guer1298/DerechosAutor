export function initMyths() {
document.querySelectorAll('[data-myth]').forEach(card => {
  card.querySelectorAll('[data-myth-answer]').forEach(button => button.addEventListener('click', () => {
    card.querySelectorAll('[data-myth-answer]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    card.querySelector('.myth-feedback').textContent = button.dataset.mythAnswer === 'false' ? 'Correcto: es un mito.' : 'Es una idea frecuente, pero es un mito.';
    card.querySelector('details').open = true;
  }));
});

}
