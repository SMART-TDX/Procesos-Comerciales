'use strict';

const assert = require('assert');
global.JORGE_KNOWLEDGE_BASE = require('../knowledge/jorge-knowledge-base.json');
require('../assets/js/jorge-local-expert-knowledge.js');
const engine = require('../assets/js/jorge-local-expert.js');

const groups = [
  ['NO_CONTACTO', ['No me vuelvan a llamar', 'No me contacten más', 'Paren de llamarme', 'No quiero más llamadas', 'Dejen de llamarme']],
  ['ELIMINACION_DATOS', ['Borren mis datos', 'Quiero borrar mis datos', 'Retiren mis datos', 'Sáquenme de la base', 'Eliminen mi información']],
  ['ORIGEN_DEL_DATO', ['¿De dónde sacaron mi número?', '¿Cómo consiguieron mi teléfono?', 'Quiero saber el origen de mis datos', 'Yo no autoricé esto', '¿Quién les dio mi número?']],
  ['NO_DEJO_DATOS', ['Jamás dejé mis datos', 'Nunca llené formulario', 'Yo no me registré', 'No recuerdo dejar datos', 'No di mis datos']],
  ['MOLESTIA', ['Estoy cansado de que llamen', 'Estoy mamado de tantas llamadas', 'Me fastidian las llamadas', 'Llaman demasiado', 'Han llamado muchas veces']],
  ['PRECIO', ['Está muy caro', 'No tengo plata', 'Se sale de mi presupuesto', '¿Cuánto cuesta?', 'No puedo pagarlo', 'Solo quiero precios', '¿Manejan cuotas?', 'Otra opción está costosa']],
  ['TIEMPO', ['No tengo tiempo', 'Ando muy ocupado', 'Trabajo mucho', 'No saco tiempo', 'Mi agenda está llena']],
  ['HORARIOS', ['Los horarios no me sirven', '¿Qué horarios tienen?', 'Necesito clases de noche', '¿En qué franja estudian?', 'Solo después del trabajo']],
  ['FIN_DE_SEMANA', ['Solo puedo sábados', 'Necesito fin de semana', 'Únicamente el domingo', '¿Tienen clases los sábados?', 'Puedo estudiar sábados']],
  ['UBICACION', ['Vivo en Suba', 'Me queda muy lejos', 'Estoy en el barrio Kennedy', '¿Qué queda cerca?', 'Vive en Chapinero']],
  ['SEDES', ['¿Qué sedes tienen?', 'Necesito la dirección de una sede', '¿Dónde están ubicados?', '¿Cuál sede me sirve?', 'Busco un punto de atención']],
  ['VIRTUAL', ['Quiero virtual', 'Necesito estudiar desde casa', 'Busco algo por internet', 'No puedo desplazarme', 'Prefiero modalidad remota']],
  ['PRESENCIAL', ['Quiero presencial', 'Prefiero ir a una sede', 'Busco clases en salón', 'Quiero clases cara a cara', 'Deseo conocer las instalaciones']],
  ['SMART_ONLINE', ['Quiero Smart Online', 'Busco el curso online', 'Prefiero avanzar a mi ritmo', '¿Cómo funciona Online?', 'Me interesa la plataforma online']],
  ['SMART_FLEX', ['Quiero Smart Flex', 'Me interesa Flex', 'Necesito clases sincrónicas', 'Busco profesor en vivo virtual', '¿Cómo funciona Smart Flex?']],
  ['CERTIFICACION', ['Necesito certificar mi nivel', 'Busco una certificación', 'Quiero acreditar el idioma', 'Necesito un certificado internacional', 'Debo certificar B2']],
  ['EXAMEN_INTERNACIONAL', ['Necesito un examen internacional', 'Quiero presentar Linguaskill', '¿Tienen IELTS?', 'Necesito TOEFL', 'Busco una prueba internacional']],
  ['GRADUACION', ['Necesito B2 para graduarme', 'Es requisito para mi grado', 'Lo necesito antes de graduarme', 'La universidad exige B2', 'Es para poder graduar']],
  ['DIFERENCIADORES', ['¿Qué diferencia a Smart?', '¿Por qué Smart?', '¿Qué tienen diferente?', '¿Qué ventajas ofrecen?', '¿Por qué debería escucharlos?']],
  ['YA_ESTUDIA', ['Ya estudio en otra academia', 'Ya está estudiando', 'Tengo un curso con otra institución', 'Ya empecé en otro lado', 'Actualmente estudio idiomas']],
  ['OTRA_ACADEMIA', ['Otra academia es más barata', 'Otro instituto cobra menos', 'Me ofrecen algo más económico', 'En otro lado sale más barato', 'La competencia tiene menor precio']],
  ['NO_INTERESA', ['No me interesa', 'No estoy interesado', 'Ya no quiero', 'No necesito estudiar', 'No me llama la atención']],
  ['LO_PENSARA', ['Lo voy a pensar', 'Quiero pensarlo', 'Debo analizarlo', 'Después miro', 'Más adelante reviso']],
  ['ESTUDIANTE_ACTUAL', ['Ya soy estudiante de Smart', 'Soy estudiante actual', 'Ya está matriculado', 'Tengo contrato con Smart', 'Estudio actualmente en Smart']],
  ['FRANCES', ['Quiero francés', 'Deseo aprender francés', 'Busco un curso de francés', 'Me interesa frances', 'Necesito estudiar francés']],
];

const cases = groups.flatMap(([expected, queries]) => queries.map((query) => ({ expected, query })));
let passed = 0;
const failures = [];
cases.forEach((test) => {
  const intents = engine.detectIntents(test.query).map((item) => item.id);
  if (intents.includes(test.expected)) passed += 1;
  else failures.push({ query: test.query, expected: test.expected, actual: intents });
});

const critical = cases.filter((item) => ['NO_CONTACTO', 'ELIMINACION_DATOS', 'ORIGEN_DEL_DATO', 'NO_DEJO_DATOS', 'MOLESTIA'].includes(item.expected));
const criticalPassed = critical.filter((test) => engine.detectIntents(test.query).some((item) => item.id === test.expected)).length;

engine.reset();
const multi = engine.analyze('Vivo en Suba, trabajo en Chapinero, salgo a las 7, quiero inglés presencial pero me parece caro.');
['UBICACION', 'TRABAJO', 'DISPONIBILIDAD', 'PRESENCIAL', 'PRECIO'].forEach((id) => assert.ok(multi.intents.some((item) => item.id === id), `Multidominio sin ${id}`));

engine.reset(); engine.analyze('Vivo en Suba y quiero inglés presencial.'); engine.analyze('Trabajo en Chapinero y salgo a las 6.');
const memory = engine.getContext(); assert.ok(memory.residence); assert.ok(memory.workplace); assert.strictEqual(memory.language, 'Inglés'); assert.strictEqual(memory.modality, 'Presencial');
const oldCase = memory.caseId; const cleared = engine.reset(); assert.ok(cleared.caseId > oldCase); assert.strictEqual(cleared.residence, ''); assert.strictEqual(cleared.turns.length, 0);

engine.reset(); const first = engine.analyze('Está muy caro.').response; const second = engine.analyze('Sigue diciendo que está muy caro.').response; assert.notStrictEqual(first, second);
assert.strictEqual(engine.remoteAI, false); assert.ok(engine.taxonomySize >= 45); assert.ok(engine.expressionCount >= 250); assert.ok(engine.knowledgeCount >= 200);

const accuracy = passed / cases.length;
console.log(JSON.stringify({ status: failures.length ? 'FAIL' : 'PASS', total: cases.length, passed, failed: failures.length, accuracy: Math.round(accuracy * 10000) / 100, critical: { total: critical.length, passed: criticalPassed }, taxonomy: engine.taxonomySize, expressions: engine.expressionCount, knowledge: engine.knowledgeCount, multiIntents: multi.intents.map((item) => item.id), failures }, null, 2));
if (accuracy < 0.95 || criticalPassed !== critical.length) process.exitCode = 1;
