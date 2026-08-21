'use strict';

const assert = require('assert');
const { processJorgeRequest } = require('../api/_lib/orchestrator');
const { detectDomains } = require('../api/_lib/router');
const { sanitizeInput } = require('../api/_lib/text');
const { database } = require('../api/_lib/knowledge');

const cases = [
  { query: '¿Qué diferencia Online y Flex?', domains: ['PRODUCT_ONLINE', 'PRODUCT_FLEX'] },
  { query: 'Necesito B2 para graduarme.', domains: ['SMART_EXAMS'] },
  { query: 'Vivo en Suba.', domains: ['SMART_LOCATIONS'] },
  { query: 'No me vuelvan a llamar.', domains: ['SMART_COMPLIANCE'], compliance: 'NO_CONTACT' },
  { query: 'Ya estudio en otra academia.', domains: ['SMART_OBJECTIONS', 'SMART_CONVERSATION'] },
  { query: '¿Qué diferencia a Smart de otras instituciones?', domains: ['SMART_CORE'] },
  { query: 'Quiero estudiar francés.', domains: ['PRODUCT_INSTITUTE', 'PRODUCT_ONLINE'] },
  { query: 'Necesito un examen internacional.', domains: ['SMART_EXAMS'] },
  { query: '¿Qué hago si ya es estudiante?', domains: ['SMART_PROCESS_ROUTER'] },
  { query: 'Solo quiere precios.', domains: ['SMART_OBJECTIONS', 'DYNAMIC_COMMERCIAL'] },
];

async function run() {
  assert.strictEqual(database.remoteAI, false);
  assert.ok(database.records.length >= 200);
  const results = [];
  for (const testCase of cases) {
    const result = await processJorgeRequest({ query: testCase.query, context: { caseId: 1 } });
    const detected = result.meta.domains.map((item) => item.domain);
    testCase.domains.forEach((domain) => assert.ok(detected.includes(domain), `${testCase.query}: falta ${domain}`));
    if (testCase.compliance) assert.strictEqual(result.meta.compliance.id, testCase.compliance);
    assert.strictEqual(result.meta.remoteAI, false);
    assert.strictEqual(result.meta.provider, 'LocalFallbackProvider');
    assert.ok(result.contract.primaryResponse);
    assert.ok(result.contract.sources.length || result.meta.compliance.matched);
    results.push({ query: testCase.query, domains: detected, sources: result.contract.sources.map((source) => `${source.document} · ${source.location}`), knowledge: result.meta.knowledge.slice(0, 3).map((item) => item.content), result: result.contract.confidence });
  }

  const multiQuery = 'Vive en Suba, trabaja en Chapinero, sale a las 6, quiere inglés presencial, le parece caro y otra academia le ofrece algo más económico.';
  const multi = await processJorgeRequest({ query: multiQuery, context: { caseId: 2 } });
  const multiDomains = multi.meta.domains.map((item) => item.domain);
  ['SMART_LOCATIONS', 'PRODUCT_INSTITUTE', 'SMART_OBJECTIONS', 'TMK_PLAYBOOK'].forEach((domain) => assert.ok(multiDomains.includes(domain), `multi-dominio: falta ${domain}`));
  assert.ok(multi.meta.knowledge.length > 0);

  const protectedText = sanitizeInput('Soy Ana Pérez, mi correo es ana@example.com y mi teléfono es 3001234567.');
  assert.ok(!protectedText.includes('ana@example.com'));
  assert.ok(!protectedText.includes('3001234567'));

  console.log(JSON.stringify({ status: 'PASS', cases: results, multi: { query: multiQuery, intentions: multiDomains, domains: multiDomains, sources: multi.contract.sources, facts: multi.meta.knowledge.filter((item) => item.type === 'FACT').slice(0, 5), strategies: multi.meta.knowledge.filter((item) => item.type === 'STRATEGY').slice(0, 5) }, records: database.records.length, domainCounts: database.domainCounts }, null, 2));
}

run().catch((error) => { console.error(error.stack || error); process.exitCode = 1; });
