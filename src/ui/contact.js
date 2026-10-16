import { contactConfig, isContactAvailable } from '../config/contact.js';
import { escapeHtml as e } from '../shared/text.js';
import { icon } from './icons.js';

export function contactLink(className = "text-link", label) {
  const ready = isContactAvailable();
  return `<a class="${className}" href="${ready ? `tel:${contactConfig.phoneInternational}` : "contacto.html"}">${icon("phone")}<span>${e(label || (ready ? "Hablar con un abogado" : "Contacto profesional"))}</span></a>`;
}
