'use strict';

const assert = require('assert');
const handler = require('../api/jorge');

function invoke(method, body) {
  return new Promise((resolve, reject) => {
    const headers = {};
    const response = {
      statusCode: 200,
      setHeader(name, value) { headers[name] = value; },
      status(code) { this.statusCode = code; return this; },
      json(value) { resolve({ statusCode: this.statusCode, headers, body: value }); },
      end() { resolve({ statusCode: this.statusCode, headers, body: null }); },
    };
    Promise.resolve(handler({ method, body }, response)).catch(reject);
  });
}

async function run() {
  const health = await invoke('GET');
  assert.strictEqual(health.statusCode, 200);
  assert.strictEqual(health.body.remoteAI, false);
  assert.strictEqual(health.body.provider, 'LocalFallbackProvider');

  const answer = await invoke('POST', { query: 'Necesito B2 para graduarme.', context: { caseId: 4 } });
  assert.strictEqual(answer.statusCode, 200);
  assert.ok(answer.body.contract.primaryResponse);
  assert.ok(answer.body.contract.sources.length);
  assert.strictEqual(answer.body.meta.remoteAI, false);

  const noContact = await invoke('POST', { query: 'No me vuelvan a llamar.', context: { caseId: 5 } });
  assert.strictEqual(noContact.body.meta.compliance.id, 'NO_CONTACT');
  assert.strictEqual(noContact.body.contract.objective, 'RESPETAR LA SOLICITUD · NO AGENDAR');

  const empty = await invoke('POST', { query: '' });
  assert.strictEqual(empty.statusCode, 400);
  console.log(JSON.stringify({ status: 'PASS', tests: 4, records: health.body.records }, null, 2));
}

run().catch((error) => { console.error(error.stack || error); process.exitCode = 1; });
