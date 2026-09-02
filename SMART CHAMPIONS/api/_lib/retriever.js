'use strict';

const { activeRecords, sourceFor } = require('./knowledge');
const { normalize, tokens } = require('./text');

function retrieve(query, routedDomains, options) {
  const selectedDomains = new Set(routedDomains.map((item) => item.domain));
  const queryTokens = new Set(tokens(query));
  const limit = Math.max(1, Math.min(Number(options && options.limit) || 8, 15));
  const ranked = activeRecords()
    .map((record) => {
      const searchable = normalize([record.Titulo, record.Contenido, record.Subdominio, record.Producto].join(' '));
      const recordTokens = new Set(tokens(searchable));
      let overlap = 0;
      queryTokens.forEach((token) => { if (recordTokens.has(token)) overlap += 1; });
      const domainBonus = selectedDomains.has(record.Dominio) ? 16 : 0;
      const phraseBonus = searchable.includes(normalize(query)) ? 8 : 0;
      const priorityBonus = Number(record.Prioridad || 0) / 25;
      return { record, score: overlap * 5 + domainBonus + phraseBonus + priorityBonus };
    })
    .filter((item) => item.score > 4 && selectedDomains.has(item.record.Dominio))
    .sort((a, b) => b.score - a.score || b.record.Prioridad - a.record.Prioridad);
  const selected = [];
  routedDomains.forEach((route) => {
    ranked.filter((item) => item.record.Dominio === route.domain).slice(0, 2).forEach((item) => {
      if (!selected.includes(item) && selected.length < limit) selected.push(item);
    });
  });
  ranked.forEach((item) => { if (!selected.includes(item) && selected.length < limit) selected.push(item); });
  return selected.map((item) => ({
      score: Math.round(item.score * 100) / 100,
      domain: item.record.Dominio,
      subdomain: item.record.Subdominio,
      type: item.record.Tipo,
      content: item.record.Contenido,
      source: sourceFor(item.record),
    }));
}

module.exports = { retrieve };
