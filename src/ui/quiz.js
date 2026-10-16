import { escapeHtml as e } from '../shared/text.js';
import { icon } from './icons.js';
import { buildQuizResults, getFeedbackCopy } from '../domain/quiz.js';

export function renderQuiz(quiz, state, quizzes) {
  const selected = quiz.id;
    const tabs = `<div class="filter-row" role="group" aria-label="Elegir cuestionario">${quizzes.map(q => `<button type="button" class="filter-button ${q.id === selected ? 'is-active' : ''}" data-quiz-picker="${q.id}" aria-pressed="${q.id === selected}">${e(q.title.replace('Cuestionario de ', '').replace('Cuestionario ', ''))}</button>`).join('')}</div>`;
    if (state.complete) {
      const result = buildQuizResults(quiz.questions, state.answers);
      return `${tabs}<h2 tabindex="-1" id="quiz-heading">Lo que te llevas de esta lectura.</h2><p>${getFeedbackCopy(result.percentage)}</p><div class="result-score">${result.score} / ${result.total}</div><p>Respuestas correctas</p>${quiz.questions.map((q, i) => `<article class="result-review"><span class="eyebrow">${state.answers[i] === q.answer ? '✓ CORRECTA' : 'POR REPASAR'} · PREGUNTA ${i + 1}</span><h3>${e(q.prompt)}</h3><p>Tu respuesta: ${e(q.options[state.answers[i]])}</p><p><strong>Respuesta correcta:</strong> ${e(q.options[q.answer])}</p><p>${e(q.feedback)}</p></article>`).join('')}<div class="page-actions"><button class="button button-primary" type="button" data-quiz-reset>Repetir cuestionario</button><a class="text-link" href="temas.html">Volver a las lecturas ${icon('arrow')}</a></div>`;
    } else {
      const q = quiz.questions[state.index];
      const answer = state.answers[state.index];
      return `${tabs}<div class="progress-track" role="progressbar" aria-label="Preguntas respondidas" aria-valuemin="0" aria-valuemax="${quiz.questions.length}" aria-valuenow="${state.answers.filter(a => a !== null).length}"><span style="width:${state.answers.filter(a => a !== null).length / quiz.questions.length * 100}%"></span></div><p class="step-meta">Pregunta ${state.index + 1} de ${quiz.questions.length}</p><h2 tabindex="-1" id="quiz-heading">${e(q.prompt)}</h2><div class="choice-list" role="group" aria-labelledby="quiz-heading">${q.options.map((o, i) => `<button class="choice-button" type="button" data-quiz-answer="${i}" aria-pressed="${answer === i}"><span class="choice-letter">${String.fromCharCode(65 + i)}</span>${e(o)}</button>`).join('')}</div><div id="quiz-feedback" aria-live="polite">${answer === null ? '' : `<div class="quiz-feedback"><strong>${answer === q.answer ? 'Respuesta correcta.' : 'Una idea para revisar.'}</strong><p>${e(q.feedback)}</p></div>`}</div><div class="page-actions"><button class="button button-secondary" type="button" data-quiz-prev ${state.index === 0 ? 'disabled' : ''}>Anterior</button><button class="button button-primary" type="button" data-quiz-next ${answer === null ? 'disabled' : ''}>${state.index === quiz.questions.length - 1 ? 'Ver resultado' : 'Siguiente'} ${icon('arrow')}</button></div>`;
    }

}

export function renderQuizFeedback(question, answer) {
  return `<div class="quiz-feedback"><strong>${answer === question.answer ? 'Respuesta correcta.' : 'Una idea para revisar.'}</strong><p>${e(question.feedback)}</p></div>`;
}
