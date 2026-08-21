'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const sandbox = { console, setTimeout, clearTimeout };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
['assets/js/jorge-knowledge.js', 'assets/js/jorge-phase1-knowledge.js', 'assets/js/jorge-phase1.js', 'assets/js/jorge.js'].forEach((file) => {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox, { filename: file });
});

const engine = sandbox.JORGE_ENGINE;
const results = [];
function hasIntent(result, id) { return result.intents.some((intent) => intent.id === id); }
function test(name, query, verify) {
  engine.reset();
  const result = engine.analyze(query);
  let ok = false; let detail = '';
  try { ok = Boolean(verify(result)); detail = ok ? 'OK' : JSON.stringify({ intents: result.intents.map((item) => item.id), objective: result.objective, compliance: result.compliance, context: result.contextSummary }); }
  catch (error) { detail = error.message; }
  results.push({ name, query, ok, detail });
}

test('01 Presupuesto coloquial', 'No tengo plata.', (r) => hasIntent(r, 'budget') && /precio|promociones|descuentos/i.test(r.avoid));
test('02 Precio alto', 'Está muy caro.', (r) => hasIntent(r, 'budget'));
test('03 Solo precios', 'Solo quiero precios.', (r) => hasIntent(r, 'budget'));
test('04 Tiempo', 'No tengo tiempo.', (r) => hasIntent(r, 'time'));
test('05 Lo va a pensar', 'Lo voy a pensar.', (r) => hasIntent(r, 'think'));
test('06 Otra academia', 'Ya estoy estudiando en otra academia.', (r) => hasIntent(r, 'already-studying'));
test('07 Diferenciadores', '¿Qué diferencia a Smart?', (r) => hasIntent(r, 'smart-differentiators') && r.sources.length > 0);
test('08 Origen de datos', 'Nunca dejé mis datos.', (r) => hasIntent(r, 'data-origin') && r.compliance === true && r.route === 'NONE');
test('09 Fatiga de contacto', 'Estoy cansado de que me llamen.', (r) => hasIntent(r, 'contact-fatigue') && r.compliance === true);
test('10 No contacto', 'No me llamen más.', (r) => hasIntent(r, 'do-not-contact') && r.compliance === true && /NO AGENDAR/.test(r.objective));
test('11 Certificación B2', 'Necesito B2 para graduarme.', (r) => hasIntent(r, 'exam-certification') && /institución|examen/i.test(r.question));
test('12 Comparación modalidad', 'No sé si estudiar virtual o presencial.', (r) => hasIntent(r, 'virtual') && hasIntent(r, 'presential'));
test('13 Dos ubicaciones', 'Vivo en Suba pero trabajo en Chapinero.', (r) => r.context.residence === 'suba' && r.context.workplace === 'chapinero');
test('14 Presencial y disponibilidad', 'Quiero presencial pero salgo a las 6.', (r) => r.context.modality === 'PRESENCIAL' && /6:00/.test(r.context.availability));
test('15 Multiintención transversal', 'Quiero inglés, vivo en Suba, trabajo en Chapinero, salgo a las 6, no tengo mucho presupuesto y me preocupa que quede lejos.', (r) => ['language', 'location', 'time', 'budget'].every((id) => hasIntent(r, id)) && r.context.residence === 'suba' && r.context.workplace === 'chapinero' && /varias barreras/i.test(r.title));
test('16 Error ortográfico', 'No tngo plta y sta mui presiozo.', (r) => hasIntent(r, 'budget'));
test('17 Colombianismo', 'Ando corto de plata y eso me queda lejísimos.', (r) => hasIntent(r, 'budget') && hasIntent(r, 'location'));
test('18 Frase incompleta', 'Caro y lejos.', (r) => hasIntent(r, 'budget') && hasIntent(r, 'location'));
test('19 Dos objeciones', 'No tengo tiempo y tampoco presupuesto.', (r) => hasIntent(r, 'time') && hasIntent(r, 'budget'));

engine.reset();
engine.analyze('Vive en Suba.');
engine.analyze('Pero trabaja en Chapinero.');
engine.analyze('Sale a las 6.');
engine.analyze('Quiere presencial.');
const memory = engine.analyze('Pero dice que le queda lejos.');
results.push({ name: '20 Memoria de cinco turnos', query: 'Secuencia acumulada', ok: memory.context.residence === 'suba' && memory.context.workplace === 'chapinero' && memory.context.availability === 'DESPUÉS DE LAS 6:00' && memory.context.modality === 'PRESENCIAL' && hasIntent(memory, 'location'), detail: JSON.stringify(memory.contextSummary) });

engine.reset();
const firstCase = engine.getContext().caseId;
engine.analyze('Vive en Suba.');
engine.reset();
const cleanCase = engine.getContext();
results.push({ name: '21 Nuevo caso elimina contexto', query: 'Reset', ok: cleanCase.caseId > firstCase && cleanCase.turns.length === 0 && cleanCase.locations.length === 0, detail: JSON.stringify(cleanCase) });
results.push({ name: '22 Motor anterior disponible', query: 'Fallback', ok: Boolean(sandbox.JORGE_LEGACY_ENGINE && sandbox.JORGE_LEGACY_ENGINE.analyze), detail: sandbox.JORGE_LEGACY_ENGINE ? 'Disponible' : 'Ausente' });
results.push({ name: '23 Sin persistencia ni credenciales', query: 'Arquitectura', ok: sandbox.JORGE_AI_ARCHITECTURE.persistsSession === false && sandbox.JORGE_AI_ARCHITECTURE.apiKeys.length === 0 && sandbox.JORGE_AI_ARCHITECTURE.sendsPersonalData === false, detail: JSON.stringify(sandbox.JORGE_AI_ARCHITECTURE) });

const failed = results.filter((item) => !item.ok);
console.log(JSON.stringify({ total: results.length, passed: results.length - failed.length, failed: failed.length, results }, null, 2));
process.exitCode = failed.length ? 1 : 0;
