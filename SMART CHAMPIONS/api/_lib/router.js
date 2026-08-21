'use strict';

const { normalize } = require('./text');

const ROUTES = Object.freeze({
  SMART_COMPLIANCE: ['no me llamen', 'no me vuelvan a llamar', 'no vuelvan a llamar', 'no llamar', 'no contacten', 'borren mis datos', 'eliminar mis datos', 'privacidad', 'de donde sacaron', 'origen de mis datos'],
  SMART_PROCESS_ROUTER: ['ya soy estudiante', 'ya es estudiante', 'soy estudiante', 'estudiante actual', 'servicio al cliente', 'sac', 'contrato', 'cofae', 'cambio de beneficiario', 'actualizacion de costos'],
  SMART_EXAMS: ['b2', 'graduarme', 'graduacion', 'examen', 'certificacion', 'certificar', 'linguaskill', 'ielts', 'toefl', 'internacional'],
  SMART_LOCATIONS: ['sede', 'suba', 'chapinero', 'bosa', 'kennedy', 'soacha', 'vivo en', 'vive en', 'trabajo en', 'trabaja en', 'direccion', 'cerca'],
  PRODUCT_ONLINE: ['smart online', 'online', 'autonomo', 'plataforma 24 7', 'frances'],
  PRODUCT_FLEX: ['smart flex', 'flex', 'sincronica', 'semipersonalizada'],
  PRODUCT_INSTITUTE: ['presencial', 'instituto', 'sede', 'salon', 'frances'],
  SMART_OBJECTIONS: ['caro', 'precio', 'cuesta', 'dinero', 'economico', 'tiempo', 'otra academia', 'otra institucion', 'pensarlo', 'no me interesa', 'solo precios'],
  SMART_CONVERSATION: ['que digo', 'como respondo', 'argumento', 'llamada', 'agendar', 'cita'],
  TMK_PLAYBOOK: ['telemercadeo', 'perfilamiento', 'seguimiento', 'llamada', 'cita', 'agenda', 'sale a las'],
  SMART_CORE: ['diferencia smart', 'diferencia a smart', 'por que smart', 'otras instituciones', 'otras academias'],
  DYNAMIC_COMMERCIAL: ['tarifa', 'promocion', 'campana', 'descuento', 'precio'],
});

function detectDomains(query) {
  const text = normalize(query);
  const scores = [];
  Object.keys(ROUTES).forEach((domain) => {
    const matches = ROUTES[domain].filter((phrase) => text.includes(normalize(phrase)));
    if (matches.length) scores.push({ domain, score: matches.length, matches });
  });
  if (/online.*flex|flex.*online/.test(text)) {
    ['PRODUCT_ONLINE', 'PRODUCT_FLEX'].forEach((domain) => {
      if (!scores.some((item) => item.domain === domain)) scores.push({ domain, score: 3, matches: ['comparación explícita'] });
    });
  }
  if (/otra (academia|institucion)/.test(text)) {
    ['SMART_OBJECTIONS', 'SMART_CONVERSATION'].forEach((domain) => {
      if (!scores.some((item) => item.domain === domain)) scores.push({ domain, score: 2, matches: ['competencia'] });
    });
  }
  if (scores.some((item) => item.domain === 'SMART_CORE')) {
    ['PRODUCT_INSTITUTE', 'PRODUCT_ONLINE', 'PRODUCT_FLEX'].forEach((domain) => {
      if (!scores.some((item) => item.domain === domain)) scores.push({ domain, score: 1, matches: ['diferenciadores documentados'] });
    });
  }
  if (!scores.length) scores.push({ domain: 'SMART_CONVERSATION', score: 1, matches: ['ruta general segura'] });
  return scores.sort((a, b) => b.score - a.score || a.domain.localeCompare(b.domain));
}

module.exports = { ROUTES, detectDomains };
