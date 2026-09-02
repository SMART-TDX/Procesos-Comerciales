'use strict';

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOP_WORDS = new Set('a al algo ante como con cual de del desde donde el ella en entre es esta este hay la las lo los me mi no o para pero por que se si sin sobre su sus te tiene un una y ya'.split(' '));

function tokens(value) {
  return normalize(value).split(' ').filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function sanitizeInput(value) {
  return String(value || '')
    .replace(/\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g, '[CORREO_OMITIDO]')
    .replace(/(?<!\d)(?:\+?57\s*)?3\d{2}(?:[\s.-]*\d){7}(?!\d)/g, '[TELEFONO_OMITIDO]')
    .replace(/\b(?:CC|CE|TI|NIT)\s*[:#-]?\s*\d{5,12}\b/gi, '[DOCUMENTO_OMITIDO]')
    .replace(/\b\d{7,12}\b/g, '[IDENTIFICADOR_OMITIDO]')
    .trim()
    .slice(0, 2000);
}

module.exports = { normalize, tokens, sanitizeInput };
