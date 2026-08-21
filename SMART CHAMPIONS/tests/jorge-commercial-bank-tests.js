'use strict';

global.window = global;
require('../assets/js/jorge-tmk-input-normalizer.js');
require('../assets/js/jorge-commercial-bank.js');
require('../assets/js/jorge-commercial-engine.js');

const bank = global.JORGE_COMMERCIAL_BANK;
const engine = global.JorgeCommercialEngine;
let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed += 1;
  } catch (error) {
    failed += 1;
    failures.push({ name, message: error.message });
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function run(text, memory) {
  return engine.processTurn(text, memory || engine.createMemory(), bank);
}

function includesFamily(result, family) {
  return result.familiaDetectada.includes(family);
}

const unitCases = [
  ['Está muy caro', 'PRECIO_PRESUPUESTO'], ['Está carísimo', 'PRECIO_PRESUPUESTO'],
  ['No tengo plata', 'PRECIO_PRESUPUESTO'], ['Ando corto', 'PRECIO_PRESUPUESTO'],
  ['Se sale del presupuesto', 'PRECIO_PRESUPUESTO'], ['Solo dígame el valor', 'PRECIO_PRESUPUESTO'],
  ['Estoy mirando otra academia', 'COMPETENCIA'], ['Quiero comparar', 'COMPETENCIA'],
  ['Otra academia cuesta menos', 'COMPETENCIA'], ['Allá es más barato', 'COMPETENCIA'],
  ['No tengo tiempo', 'TIEMPO'], ['Trabajo todo el día', 'TIEMPO'],
  ['Solo puedo de noche', 'HORARIOS'], ['Después de las seis', 'HORARIOS'],
  ['Solo puedo sábados', 'HORARIOS'], ['Solo fines de semana', 'HORARIOS'],
  ['Me queda muy lejos', 'UBICACION'], ['No quiero desplazarme', 'UBICACION'],
  ['Quiero virtual', 'MODALIDAD'], ['Quiero estudiar virtual', 'MODALIDAD'],
  ['Quiero presencial', 'MODALIDAD'], ['No me gustan las clases virtuales', 'MODALIDAD'],
  ['Quiero un programa híbrido', 'MODALIDAD'], ['Mezclar presencial y virtual', 'MODALIDAD'],
  ['Lo voy a pensar', 'APLAZAMIENTO'], ['Quiero empezar después', 'APLAZAMIENTO'],
  ['Tengo que hablar con mi esposa', 'DECISOR'], ['Mi esposo decide', 'DECISOR'],
  ['Mis papás pagan', 'DECISOR'], ['Es menor de edad', 'DECISOR'],
  ['No me interesa', 'INTERES'], ['Ya no quiero', 'INTERES'],
  ['Mándeme todo por WhatsApp', 'INFORMACION'], ['Solo quiero información', 'INFORMACION'],
  ['Ya estudio en otra academia', 'YA_ESTUDIA'], ['Ya estoy estudiando inglés', 'YA_ESTUDIA'],
  ['Aprendo por mi cuenta', 'YA_ESTUDIA'], ['Uso una aplicación', 'YA_ESTUDIA'],
  ['Tuve una mala experiencia', 'CONFIANZA'], ['Ya estudié y no aprendí', 'CONFIANZA'],
  ['No confío en academias', 'CONFIANZA'], ['Todas las academias son iguales', 'CONFIANZA'],
  ['No quiero hablar con un asesor', 'CANAL'], ['No puedo hablar ahora', 'CANAL'],
  ['No sé cuál elegir', 'PERFILAMIENTO'], ['Apenas estoy mirando', 'PERFILAMIENTO'],
  ['Estoy desempleado', 'SITUACION_ECONOMICA'], ['No tengo trabajo', 'SITUACION_ECONOMICA'],
  ['Mi universidad me pide B2', 'EXAMENES'], ['No sé qué examen presentar', 'EXAMENES']
];

unitCases.forEach(([text, family], index) => {
  test(`UNIT_${String(index + 1).padStart(2, '0')}`, () => {
    const result = run(text);
    assert(includesFamily(result, family), `${text}: esperaba ${family}, obtuvo ${result.familiaDetectada.join(',')}`);
    assert(result.respuestaPrincipal, 'Debe producir respuesta principal');
  });
});

const multiCases = [
  ['Trabajo hasta las 7 y vivo lejos', ['HORARIOS', 'UBICACION']],
  ['No tengo tiempo y me queda lejos', ['TIEMPO', 'UBICACION']],
  ['Está caro y otra academia cobra menos', ['PRECIO_PRESUPUESTO', 'COMPETENCIA']],
  ['Solo puedo sábados y quiero presencial', ['HORARIOS', 'MODALIDAD']],
  ['Quiero virtual pero no tengo tiempo', ['MODALIDAD', 'TIEMPO']],
  ['Ya estudio en otra academia pero no me gustan los horarios', ['YA_ESTUDIA', 'HORARIOS']],
  ['No tengo plata y estoy desempleado', ['PRECIO_PRESUPUESTO', 'SITUACION_ECONOMICA']],
  ['Lo voy a pensar y debo hablar con mi esposa', ['APLAZAMIENTO', 'DECISOR']],
  ['Mándeme información, ahora no puedo hablar', ['INFORMACION', 'CANAL']],
  ['Vivo lejos y quiero virtual', ['UBICACION', 'MODALIDAD']],
  ['No confío en academias porque ya estudié y no aprendí', ['CONFIANZA']],
  ['Solo quiero el precio y estoy comparando', ['PRECIO_PRESUPUESTO', 'COMPETENCIA']],
  ['Quiero presencial y solo puedo de noche', ['MODALIDAD', 'HORARIOS']],
  ['Otra academia es más barata y quiero pensarlo', ['COMPETENCIA', 'APLAZAMIENTO']],
  ['Ya estudio inglés pero quiero presentar un examen', ['YA_ESTUDIA', 'EXAMENES']],
  ['Estoy desempleada y no tengo presupuesto', ['SITUACION_ECONOMICA', 'PRECIO_PRESUPUESTO']],
  ['No me interesa y no puedo hablar ahora', ['INTERES', 'CANAL']],
  ['Uso una aplicación y quiero presencial', ['YA_ESTUDIA', 'MODALIDAD']],
  ['Me queda lejos y solo puedo sábados', ['UBICACION', 'HORARIOS']],
  ['No sé cuál elegir y quiero virtual', ['PERFILAMIENTO', 'MODALIDAD']]
];

multiCases.forEach(([text, families], index) => {
  test(`MULTI_${String(index + 1).padStart(2, '0')}`, () => {
    const result = run(text);
    families.forEach((family) => assert(includesFamily(result, family), `${text}: falta ${family}`));
  });
});

const conversations = [
  { turns: ['Está muy caro', 'Otra academia me cobra menos', 'Allá puedo estudiar los sábados', 'Pero quiero presencial'], expected: ['PRECIO_PRESUPUESTO', 'COMPETENCIA', 'HORARIOS', 'MODALIDAD'] },
  { turns: ['No tengo tiempo', 'Trabajo hasta las 7', 'Vivo bastante lejos', 'Pero sí quiero aprender'], expected: ['TIEMPO', 'HORARIOS', 'UBICACION'] },
  { turns: ['Ya estudio en otra academia', 'No me gustan los horarios', 'Me gustaría presencial'], expected: ['YA_ESTUDIA', 'HORARIOS', 'MODALIDAD'] },
  { turns: ['Lo voy a pensar', 'Tengo que hablar con mi esposa'], expected: ['APLAZAMIENTO', 'DECISOR'] },
  { turns: ['Mándeme todo por WhatsApp', 'No puedo hablar ahora'], expected: ['INFORMACION', 'CANAL'] },
  { turns: ['No tengo plata', 'Estoy desempleado'], expected: ['PRECIO_PRESUPUESTO', 'SITUACION_ECONOMICA'] },
  { turns: ['Tuve una mala experiencia', 'Estudié y no aprendí'], expected: ['CONFIANZA'] },
  { turns: ['Quiero virtual', 'Prefiero profesor en vivo'], expected: ['MODALIDAD'] },
  { turns: ['Vivo lejos', 'Solo puedo sábados', 'Quiero presencial'], expected: ['UBICACION', 'HORARIOS', 'MODALIDAD'] },
  { turns: ['No sé qué quiero', 'Quiero aprender inglés', 'Prefiero presencial'], expected: ['PERFILAMIENTO', 'MODALIDAD'] }
];

conversations.forEach((conversation, index) => {
  test(`CONVERSATION_${String(index + 1).padStart(2, '0')}`, () => {
    let memory = engine.createMemory();
    conversation.turns.forEach((turn) => { memory = run(turn, memory).memoria; });
    conversation.expected.forEach((family) => assert(memory.familiasDetectadas.includes(family), `Memoria no conserva ${family}`));
    assert(memory.turnos.length === conversation.turns.length, 'Cantidad de turnos incorrecta');
    assert(new Set(memory.preguntasRealizadas).size === memory.preguntasRealizadas.length, 'Repitió preguntas');
    assert(new Set(memory.argumentosUtilizados).size === memory.argumentosUtilizados.length, 'Repitió argumentos');
  });
});

const complianceCases = [
  ['Yo nunca dejé mis datos', 'ORIGEN_DATO', true],
  ['¿De dónde sacaron mi número?', 'ORIGEN_DATO', true],
  ['Yo no pedí información', 'ORIGEN_DATO', true],
  ['No me vuelvan a llamar', 'NO_CONTACTO', true],
  ['No quiero que me contacten', 'NO_CONTACTO', true],
  ['Bórrenme de la base', 'NO_CONTACTO', true],
  ['Estoy cansado de que me llamen', 'MOLESTIA_LLAMADAS', true],
  ['Ya soy estudiante de Smart', 'ESTUDIANTE_ACTUAL', true],
  ['Necesito servicio al cliente', 'ESTUDIANTE_ACTUAL', true],
  ['Tengo un problema con mi contrato', 'ESTUDIANTE_ACTUAL', true]
];

complianceCases.forEach(([text, subfamily, stop], index) => {
  test(`COMPLIANCE_${String(index + 1).padStart(2, '0')}`, () => {
    const result = run(text);
    assert(result.subfamiliaDetectada.includes(subfamily), `${text}: esperaba ${subfamily}`);
    assert(result.detienePersuasion === stop, `${text}: detienePersuasion incorrecto`);
    assert(result.puenteCita === null, `${text}: no debe llevar a cita`);
  });
});

const audit = engine.auditBank(bank);
const metrics = {
  records: bank.records.length,
  families: new Set(bank.records.map((record) => record.familia)).size,
  subfamilies: new Set(bank.records.map((record) => record.subfamilia)).size,
  expressions: bank.records.reduce((sum, record) => sum + record.expresiones.length, 0),
  officialArguments: bank.records.reduce((sum, record) => sum + record.argumentosOficiales.length, 0),
  complements: bank.records.reduce((sum, record) => sum + record.argumentosComplementarios.length + record.siInsiste.filter((entry) => entry.origen === 'COMPLEMENTO_JORGE').length, 0),
  discoveryQuestions: bank.records.reduce((sum, record) => sum + record.preguntasDescubrimiento.length + record.preguntasControl.length, 0),
  appointmentBridges: bank.records.reduce((sum, record) => sum + record.puentesCita.length, 0),
  complianceRecords: bank.records.filter((record) => record.esCumplimiento).length,
  repeatedResponses: audit.errors.filter((error) => error.type === 'REPEATED_RESPONSE').length
};

const result = {
  requiredTests: 90,
  passed,
  failed,
  bankAudit: audit,
  metrics,
  failures
};

console.log(JSON.stringify(result, null, 2));
if (failed || !audit.ok || passed < 90) process.exit(1);
