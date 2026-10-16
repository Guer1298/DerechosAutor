export function createQuizState(quiz) {
  return { answers: quiz.questions.map(() => null), index: 0, complete: false };
}

export function transitionQuiz(quiz, state, action) {
  switch (action.type) {
    case 'answer': {
      const question = quiz.questions[state.index];
      if (!Number.isInteger(action.answer) || action.answer < 0 || action.answer >= question.options.length) {
        throw new RangeError('La respuesta no pertenece a esta pregunta.');
      }
      const answers = [...state.answers];
      answers[state.index] = action.answer;
      return { ...state, answers, complete: false };
    }
    case 'next':
      if (state.answers[state.index] === null) return state;
      if (state.index < quiz.questions.length - 1) return { ...state, index: state.index + 1 };
      return { ...state, complete: state.answers.every(answer => answer !== null) };
    case 'previous':
      return { ...state, index: Math.max(0, state.index - 1), complete: false };
    case 'reset':
      return createQuizState(quiz);
    default:
      throw new Error(`Acción de cuestionario desconocida: ${action.type}`);
  }
}

export function buildQuizResults(questions, answers) {
  const score = questions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0);
  return { score, total: questions.length, percentage: questions.length ? Math.round(score / questions.length * 100) : 0 };
}

export function getFeedbackCopy(percentage) {
  return percentage >= 80 ? 'Comprendes los conceptos principales. Sigue explorando sus matices.'
    : percentage >= 50 ? 'Ya tienes una base. Revisa las explicaciones para afianzar lo aprendido.'
      : 'Cada respuesta es un punto de partida. Revisa las explicaciones y vuelve cuando quieras.';
}

export function quizRevision(quiz) {
  // Una revisión estable invalida respuestas si cambia el contenido del cuestionario.
  const text = JSON.stringify(quiz.questions);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(16);
}

export function loadQuizProgress(raw, quizzes) {
  let data;
  try { data = JSON.parse(raw || '{}'); } catch { return {}; }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
  const result = {};
  for (const quiz of quizzes) {
    const record = data[quiz.id];
    if (!record || !Array.isArray(record.answers)) continue;
    if (record.revision && record.revision !== quizRevision(quiz)) continue;
    const answers = quiz.questions.map((q, i) => Number.isInteger(record.answers[i]) && record.answers[i] >= 0 && record.answers[i] < q.options.length ? record.answers[i] : null);
    result[quiz.id] = {
      answers,
      index: Math.max(0, Math.min(Number.isInteger(record.index) ? record.index : 0, quiz.questions.length - 1)),
      complete: record.complete === true && answers.every(answer => answer !== null)
    };
  }
  return result;
}

export function serializeQuizProgress(progress, quizzes) {
  return JSON.stringify(Object.fromEntries(quizzes.filter(quiz => progress[quiz.id]).map(quiz => [
    quiz.id, { ...progress[quiz.id], revision: quizRevision(quiz) }
  ])));
}
