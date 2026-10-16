import { quizzes } from '../../content/quizzes.js';
import { createQuizState, transitionQuiz, loadQuizProgress, serializeQuizProgress } from '../../domain/quiz.js';
import { renderQuiz, renderQuizFeedback } from '../../ui/quiz.js';
import { storage } from '../storage.js';
import { storageKeys } from '../../config/storage.js';

export function initQuiz() {
  const root = document.querySelector('#quiz');
  if (!root) return;
  const progress = loadQuizProgress(storage.get(storageKeys.quiz), quizzes);
  let selected = quizzes[0].id;
  const currentQuiz = () => quizzes.find(quiz => quiz.id === selected);
  const render = (focus = false) => {
    progress[selected] ||= createQuizState(currentQuiz());
    root.innerHTML = renderQuiz(currentQuiz(), progress[selected], quizzes);
    if (focus) root.querySelector('#quiz-heading')?.focus();
  };
  root.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.quizPicker) {
      if (!quizzes.some(quiz => quiz.id === button.dataset.quizPicker)) return;
      selected = button.dataset.quizPicker;
      render(true);
      return;
    }
    const action = button.hasAttribute('data-quiz-answer') ? { type: 'answer', answer: Number(button.dataset.quizAnswer) }
      : button.hasAttribute('data-quiz-next') ? { type: 'next' }
        : button.hasAttribute('data-quiz-prev') ? { type: 'previous' }
          : button.hasAttribute('data-quiz-reset') ? { type: 'reset' } : null;
    if (!action) return;
    const quiz = currentQuiz();
    const state = progress[selected] = transitionQuiz(quiz, progress[selected], action);
    storage.set(storageKeys.quiz, serializeQuizProgress(progress, quizzes));
    if (action.type !== 'answer') { render(true); return; }
    // Conservar el botón enfocado y la región viva mientras cambia la respuesta.
    root.querySelectorAll('[data-quiz-answer]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.quizAnswer) === action.answer)));
    root.querySelector('[data-quiz-next]').disabled = false;
    root.querySelector('#quiz-feedback').innerHTML = renderQuizFeedback(quiz.questions[state.index], action.answer);
    const count = state.answers.filter(answer => answer !== null).length;
    root.querySelector('[role="progressbar"]').setAttribute('aria-valuenow', count);
    root.querySelector('.progress-track > span').style.width = `${count / quiz.questions.length * 100}%`;
  });
  render();
}
