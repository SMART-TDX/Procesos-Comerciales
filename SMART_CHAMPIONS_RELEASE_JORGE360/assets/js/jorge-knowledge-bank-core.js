(function (global) {
  'use strict';

  const STOP = new Set(['a','al','con','de','del','el','en','es','la','las','lo','los','me','mi','no','para','por','que','se','su','un','una','y']);
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9ñ\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const terms = (value) => normalize(value).split(' ').filter((word) => word.length > 2 && !STOP.has(word));
  const sourceOf = (record) => ({ documento: record.Documento, ubicacion: record.Ubicacion, fuente: record.Fuente });

  function createBank(name, domains, options) {
    const config = options || {};
    const records = ((global.JORGE_KNOWLEDGE_BASE || {}).records || []).filter((record) => domains.includes(record.Dominio));
    const indexed = records.map((record) => ({ record, haystack: normalize([record.Titulo, record.Contenido, record.Resumen, record.Subdominio, record.Producto].join(' ')) }));
    function search(query, limit) {
      const queryTerms = terms(query);
      return indexed.map((entry) => {
        let score = 0;
        queryTerms.forEach((term) => { if (entry.haystack.includes(term)) score += term.length + 4; });
        if (normalize(query) && entry.haystack.includes(normalize(query))) score += 50;
        return { record: entry.record, score };
      }).filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score || b.record.Prioridad - a.record.Prioridad).slice(0, limit || 5);
    }
    return Object.freeze({ name, domains: domains.slice(), records, search, sourceOf, normalize, config });
  }

  global.JorgeKnowledgeBankCore = Object.freeze({ createBank, normalize, terms, sourceOf });
})(typeof window !== 'undefined' ? window : globalThis);
