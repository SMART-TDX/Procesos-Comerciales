'use strict';

const { sanitizeInput } = require('./text');
const { detectDomains } = require('./router');
const { retrieve } = require('./retriever');
const { evaluateCompliance } = require('./compliance');
const { updateContext } = require('./session');
const { getProvider, LocalFallbackProvider } = require('./providers');

function uniqueSources(knowledge) {
  const seen = new Set();
  return knowledge.map((item) => item.source).filter((source) => {
    const key = `${source.document}|${source.location}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function validateFacts(response, knowledge, compliance) {
  if (compliance.matched) return { valid: true, reasons: ['Regla determinística aplicada'] };
  if (!knowledge.length && response.confidence !== 'BAJA') return { valid: false, reasons: ['No existe evidencia recuperada'] };
  return { valid: true, reasons: ['Respuesta conservadora', 'No contiene tarifas ni promociones generadas'] };
}

function toDisplay(contract, meta) {
  return {
    status: 'ANSWER',
    happening: contract.understanding,
    response: contract.primaryResponse,
    alternatives: contract.alternatives,
    alternativeStyles: ['CONSULTIVA', 'DIRECTA'],
    question: contract.keyQuestion,
    next: contract.nextMove,
    objective: contract.objective,
    avoid: contract.alert,
    confidence: contract.confidence,
    sources: contract.sources.map((source) => ({ title: source.document, status: source.status, location: source.location })),
    context: meta.context,
    contextSummary: Object.entries(meta.context).filter(([key, value]) => key !== 'caseId' && (Array.isArray(value) ? value.length : value)).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`),
    intents: meta.domains.map((item) => ({ id: item.domain, label: item.domain, score: item.score * 20, reason: item.matches.join(', ') })),
    domains: meta.domains.map((item) => item.domain),
    known: meta.knowledge.slice(0, 4).map((item) => item.content.slice(0, 160)),
    missing: contract.confidence === 'BAJA' ? ['Información suficiente para una recomendación institucional'] : [],
    provenance: meta.compliance.matched ? 'RUTA_DE_CUMPLIMIENTO' : 'RAG_TEXTUAL_LOCAL',
  };
}

async function processJorgeRequest(payload) {
  const started = Date.now();
  const query = sanitizeInput(payload && payload.query);
  if (!query) throw Object.assign(new Error('QUERY_REQUIRED'), { statusCode: 400 });
  const compliance = evaluateCompliance(query);
  let domains = detectDomains(query);
  if (compliance.matched) domains = [{ domain: 'SMART_COMPLIANCE', score: 10, matches: [compliance.id] }];
  const context = updateContext(payload && payload.context, query);
  const knowledge = retrieve(query, domains, { limit: compliance.matched ? 5 : 8 });
  let provider = getProvider();
  if (!provider.isEnabled()) provider = new LocalFallbackProvider();
  const classification = await provider.classify({ query, domains, context });
  const reasoning = await provider.reason({ query, domains, context, knowledge, compliance });
  let contract = await provider.generate({ query, domains, context, knowledge, compliance, classification, reasoning });
  contract = Object.assign({ understanding: '', primaryResponse: '', alternatives: [], keyQuestion: '', nextMove: '', objective: '', alert: '', sources: [], confidence: 'BAJA' }, contract);
  contract.sources = uniqueSources(knowledge);
  const validation = validateFacts(contract, knowledge, compliance);
  if (!validation.valid) {
    contract.primaryResponse = 'No tengo evidencia suficiente para afirmar una condición institucional. Valida el caso con el responsable antes de informar al prospecto.';
    contract.alert = validation.reasons.join('. ');
    contract.confidence = 'BAJA';
  }
  const meta = { provider: provider.name, remoteAI: false, compliance, domains, knowledge, context, validation, latencyMs: Date.now() - started };
  return { contract, meta: Object.assign({}, meta, { knowledge: knowledge.map((item) => ({ domain: item.domain, type: item.type, content: item.content, source: item.source, score: item.score })) }), display: toDisplay(contract, meta) };
}

module.exports = { processJorgeRequest, validateFacts, toDisplay };
