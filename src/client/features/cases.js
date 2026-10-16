import { cases } from '../../content/cases.js';
export function initCases() {
  document.querySelectorAll('[data-case]').forEach(card => {
    const item = cases.find(c => c.id === card.dataset.case);
    card.querySelectorAll('[data-case-answer]').forEach(button => button.addEventListener('click', () => {
      card.querySelectorAll('[data-case-answer]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      card.querySelector('.case-feedback').textContent = Number(button.dataset.caseAnswer) === item.answer ? 'Respuesta correcta. Consulta el análisis para conocer los matices.' : 'Hay más factores por considerar. Consulta el análisis del caso.';
      card.querySelector('details').open = true;
    }));
  });
}
