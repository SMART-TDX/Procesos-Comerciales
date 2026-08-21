'use strict';

const { normalize } = require('./text');

function freshContext(caseId) {
  return { caseId: Number(caseId) || 1, language: '', city: '', residence: '', workplace: '', modality: '', product: '', availability: '', need: '', motivation: '', objections: [], decisionMaker: '', preferences: [], discardedAlternatives: [], emotionalState: '', nextStep: '' };
}

function safeContext(input) {
  const source = input && typeof input === 'object' ? input : {};
  const context = freshContext(source.caseId);
  Object.keys(context).forEach((key) => {
    if (key === 'caseId') return;
    if (Array.isArray(context[key])) context[key] = Array.isArray(source[key]) ? source[key].map(String).slice(0, 12) : [];
    else context[key] = String(source[key] || '').slice(0, 120);
  });
  return context;
}

function updateContext(current, query) {
  const context = safeContext(current);
  const text = normalize(query);
  if (/\bfrances\b/.test(text)) context.language = 'Francés';
  else if (/\bingles\b/.test(text)) context.language = 'Inglés';
  if (/\bpresencial\b/.test(text)) context.modality = 'Presencial';
  if (/\bvirtual|online\b/.test(text)) context.modality = context.modality ? 'Por definir entre presencial y virtual' : 'Virtual';
  if (/smart online/.test(text)) context.product = 'Smart Online';
  else if (/smart flex/.test(text)) context.product = 'Smart Flex';
  else if (/\binstituto\b|\bpresencial\b/.test(text)) context.product = 'Instituto';
  const cityMatch = text.match(/\b(?:vivo|vive|ciudad) en ([a-z ]{3,30})(?:,| y |\.|$)/);
  if (cityMatch) context.residence = cityMatch[1].trim();
  const workMatch = text.match(/\b(?:trabajo|trabaja) en ([a-z ]{3,30})(?:,| y |\.|$)/);
  if (workMatch) context.workplace = workMatch[1].trim();
  if (/caro|precio|dinero|economico/.test(text) && !context.objections.includes('precio')) context.objections.push('precio');
  if (/tiempo|horario|sale a las|ocupad/.test(text) && !context.objections.includes('tiempo')) context.objections.push('tiempo');
  if (/otra academia|otra institucion/.test(text) && !context.objections.includes('competencia')) context.objections.push('competencia');
  return context;
}

module.exports = { freshContext, safeContext, updateContext };
