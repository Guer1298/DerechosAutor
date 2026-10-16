export function createGuideState() {
  return { index: 0, selections: {}, complete: false };
}

export function transitionGuide(flow, state, action) {
  const step = flow[state.index];
  switch (action.type) {
    case 'choose':
      if (!step.options.some(option => option.value === action.value)) throw new RangeError('Opción desconocida.');
      return { ...state, selections: { ...state.selections, [step.id]: action.value } };
    case 'next':
      if (!state.selections[step.id]) return state;
      return state.index < flow.length - 1 ? { ...state, index: state.index + 1 } : { ...state, complete: true };
    case 'previous':
      return { ...state, index: Math.max(0, state.index - 1), complete: false };
    case 'reset':
      return createGuideState();
    default:
      throw new Error(`Acción de explorador desconocida: ${action.type}`);
  }
}

export const guideArticleGroups = {
  proteger: ['obras-protegidas', 'autoria-titularidad', 'derechos-morales'],
  usar: ['derechos-patrimoniales', 'limites-y-excepciones', 'derecho-autor-internet'],
  registrar: ['registro-de-obras', 'obras-protegidas'],
  entender: ['fundamentos-derecho-autor', 'derechos-morales', 'derechos-patrimoniales']
};

export function recommendedReadings(selections, articles) {
  const ids = new Set(guideArticleGroups[selections.objetivo] || guideArticleGroups.entender);
  if (selections.tipo === 'software') ids.add('software-propiedad-intelectual');
  if (['musica', 'video'].includes(selections.tipo)) ids.add('derechos-conexos');
  if (selections.contexto === 'hay_licencia') ids.add('derechos-patrimoniales');
  if (selections.contexto === 'hay_modificacion') ids.add('derechos-morales');
  if (selections.contexto === 'quieres_registrar') ids.add('registro-de-obras');
  return [...ids].map(id => articles.find(article => article.slug === id));
}
