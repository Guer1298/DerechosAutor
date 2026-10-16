import { guideFlow } from '../../content/guide.js';
import { createGuideState, transitionGuide } from '../../domain/guide.js';
import { renderGuide } from '../../ui/guide.js';

export function initGuide() {
  const root = document.querySelector('#guide');
  if (!root) return;
  let state = createGuideState();
  const render = (focus = false) => {
    root.innerHTML = renderGuide(state);
    if (focus) root.querySelector('#guide-heading')?.focus();
  };
  root.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset.guideChoice ? { type: 'choose', value: button.dataset.guideChoice }
      : button.hasAttribute('data-guide-next') ? { type: 'next' }
        : button.hasAttribute('data-guide-back') ? { type: 'previous' }
          : button.hasAttribute('data-guide-restart') ? { type: 'reset' } : null;
    if (!action) return;
    state = transitionGuide(guideFlow, state, action);
    if (action.type !== 'choose') { render(true); return; }
    root.querySelectorAll('[data-guide-choice]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    root.querySelector('[data-guide-next]').disabled = false;
  });
  render();
}
