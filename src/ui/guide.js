import { guideFlow, guideResults } from '../content/guide.js';
import { articles } from '../content/articles.js';
import { articleHref } from '../shared/urls.js';
import { recommendedReadings } from '../domain/guide.js';
import { escapeHtml as e } from '../shared/text.js';
import { icon } from './icons.js';
import { contactConfig, isContactAvailable } from '../config/contact.js';

export function renderGuide({ index, selections, complete }) {
    if (complete) {
      const result = guideResults[selections.objetivo] || guideResults.entender;
      const labels = guideFlow.map(step => step.options.find(o => o.value === selections[step.id])?.label).filter(Boolean);
      return `<div class="guide-result"><p class="eyebrow">TU RUTA DE LECTURA</p><h2 id="guide-heading" tabindex="-1">${e(result.title)}</h2><p>${e(result.summary)}</p><p class="source-note">Tus selecciones: ${labels.map(e).join(" · ")}</p><h3>Conceptos para empezar</h3><ul>${result.concepts.map(c => `<li>${e(c)}</li>`).join("")}</ul><h3>Un ejemplo</h3><p>${e(result.example)}</p><h3>Aspectos que puedes revisar</h3><ol>${result.steps.map(s => `<li>${e(s)}</li>`).join("")}</ol><h3>Lecturas relacionadas</h3><ul class="guide-reading-list">${recommendedReadings(selections, articles).map(m => `<li><a href="${articleHref(m.slug)}">${e(m.title)} ${icon("arrow")}</a></li>`).join("")}</ul><div class="page-actions"><a class="text-link" href="fuentes.html">Consultar fuentes oficiales ${icon("external")}</a><a class="text-link" href="${isContactAvailable() ? `tel:${contactConfig.phoneInternational}` : "contacto.html"}">${icon("phone")}${isContactAvailable() ? "Hablar con un abogado" : "Contacto profesional"}</a></div><p class="source-note">Esta selección recomienda contenidos; no determina si un uso está autorizado ni resuelve una controversia.</p><button class="button button-secondary" style="margin-top:24px" type="button" data-guide-restart>Explorar otra situación</button></div>`;
    } else {
      const step = guideFlow[index];
      return `<div class="progress-track" role="progressbar" aria-label="Paso del explorador" aria-valuemin="0" aria-valuemax="${guideFlow.length}" aria-valuenow="${index + 1}"><span style="width:${(index + 1) / guideFlow.length * 100}%"></span></div><p class="step-meta">Paso ${index + 1} de ${guideFlow.length}</p><h2 id="guide-heading" tabindex="-1">${e(step.question)}</h2><div class="choice-list" role="group" aria-labelledby="guide-heading">${step.options.map((o, i) => `<button class="choice-button" type="button" data-guide-choice="${o.value}" aria-pressed="${selections[step.id] === o.value}"><span class="choice-letter">${String.fromCharCode(65 + i)}</span>${e(o.label)}</button>`).join("")}</div><div class="page-actions"><button class="button button-secondary" type="button" data-guide-back ${index === 0 ? "disabled" : ""}>Anterior</button><button class="button button-primary" type="button" data-guide-next ${selections[step.id] ? "" : "disabled"}>${index === guideFlow.length - 1 ? "Ver lecturas recomendadas" : "Continuar"} ${icon("arrow")}</button></div>`;
    }

}
