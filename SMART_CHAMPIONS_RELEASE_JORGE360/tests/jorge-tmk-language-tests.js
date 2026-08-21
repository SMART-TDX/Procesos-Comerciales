'use strict';

global.window = global;
require('../assets/js/jorge-tmk-input-normalizer.js');
require('../assets/js/jorge-commercial-bank.js');
require('../assets/js/jorge-commercial-engine.js');

const normalizer = global.TMK_INPUT_NORMALIZER;
const bank = global.JORGE_COMMERCIAL_BANK;
const engine = global.JorgeCommercialEngine;
let passed = 0;
const failures = [];
const results = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const cases = [
  ['me dice que no tiene plata', 'no tiene plata', 'PRECIO_PRESUPUESTO', 'PRECIO_GENERAL'],
  ['me dice que no está seguro de nosotros', 'no esta seguro de nosotros', 'CONFIANZA', 'NO_CONFIA'],
  ['me dice que no sabe qué modalidad estudiar', 'no sabe que modalidad estudiar', 'MODALIDAD', 'MODALIDAD_INDEFINIDA'],
  ['me dice que lo va a pensar', 'lo va a pensar', 'APLAZAMIENTO', 'PENSARLO'],
  ['me dice que ya estudia en otra academia', 'ya estudia en otra academia', 'YA_ESTUDIA', 'OTRA_ACADEMIA'],
  ['me dice que otra academia está más barata', 'otra academia esta mas barata', 'COMPETENCIA', 'MAS_BARATA'],
  ['me dice que no tiene tiempo', 'no tiene tiempo', 'TIEMPO', 'SIN_TIEMPO'],
  ['me dice que trabaja hasta las 7', 'trabaja hasta las 7', 'HORARIOS', 'FRANJA_RESTRINGIDA'],
  ['me dice que vive lejos', 'vive lejos', 'UBICACION', 'DISTANCIA'],
  ['me dice que solo puede sábados', 'solo puede sabados', 'HORARIOS', 'FIN_DE_SEMANA'],
  ['me dice que quiere virtual', 'quiere virtual', 'MODALIDAD', 'PREFIERE_VIRTUAL'],
  ['me dice que no le gusta virtual', 'no le gusta virtual', 'MODALIDAD', 'PREFIERE_PRESENCIAL'],
  ['me dice que solo quiere precios', 'solo quiere precios', 'PRECIO_PRESUPUESTO', 'PRECIO_GENERAL'],
  ['me dice que le mande todo por WhatsApp', 'le mande todo por whatsapp', 'INFORMACION', 'WHATSAPP'],
  ['me dice que nunca dejó sus datos', 'nunca dejo sus datos', 'CUMPLIMIENTO', 'ORIGEN_DATO'],
  ['me dice que está cansado de que lo llamen', 'esta cansado de que lo llamen', 'CUMPLIMIENTO', 'MOLESTIA_LLAMADAS'],
  ['me dice que no quiere que lo llamemos más', 'no quiere que lo llamemos mas', 'CUMPLIMIENTO', 'NO_CONTACTO'],
  ['me dice que no sabe si Smart sea buena', 'no sabe si smart sea buena', 'CONFIANZA', 'NO_CONFIA'],
  ['me dice que no sabe qué hacer', 'no sabe que hacer', 'PERFILAMIENTO', 'NO_SABE'],
  ['me dice que quiere aprender pero no sabe por dónde empezar', 'quiere aprender pero no sabe por donde empezar', 'PERFILAMIENTO', 'NO_SABE']
];

cases.forEach(([original, expectedNormalized, family, subfamily], index) => {
  try {
    const input = normalizer.normalizeInput(original);
    const response = engine.processTurn(original, engine.createMemory(), bank);
    assert(input.normalized === expectedNormalized, `Normalización: ${input.normalized}`);
    assert(response.entradaNormalizada === expectedNormalized, 'El motor no expuso la entrada normalizada');
    assert(response.familiaDetectada.includes(family), `Falta familia ${family}: ${response.familiaDetectada.join(',')}`);
    assert(response.subfamiliaDetectada.includes(subfamily), `Falta subfamilia ${subfamily}: ${response.subfamiliaDetectada.join(',')}`);
    assert(response.respuestaPrincipal && response.respuestaPrincipal.contenido, 'Falta respuesta');
    if (!response.detienePersuasion) assert(response.preguntaRecomendada && response.preguntaRecomendada.contenido, 'Falta pregunta');
    results.push({
      prueba: index + 1,
      entradaOriginal: original,
      entradaNormalizada: input.normalized,
      familia: response.familiaDetectada,
      subfamilia: response.subfamiliaDetectada,
      preguntaRecomendada: response.preguntaRecomendada ? response.preguntaRecomendada.contenido : 'NO APLICA: ruta de cumplimiento',
      respuesta: response.respuestaPrincipal.contenido,
      siguientePaso: response.detienePersuasion ? 'DETENER PERSUASIÓN Y APLICAR PROCEDIMIENTO' : (response.puenteCita ? response.puenteCita.contenido : 'CONTINUAR PERFILAMIENTO')
    });
    passed += 1;
  } catch (error) {
    failures.push({ prueba: index + 1, original, error: error.message });
  }
});

let memory = engine.createMemory();
const chain = [
  'me dice que no está seguro de nosotros',
  'dice que tuvo una mala experiencia con otra academia',
  'pero sí quiere aprender inglés',
  'me pregunta por qué Smart sería diferente'
];
chain.forEach((turn) => { memory = engine.processTurn(turn, memory, bank).memoria; });

const multiturn = {
  turnos: memory.turnos.length,
  desconfianza: memory.subfamiliasDetectadas.includes('NO_CONFIA'),
  malaExperiencia: memory.subfamiliasDetectadas.includes('MALA_EXPERIENCIA'),
  interes: memory.familiasDetectadas.includes('INTERES'),
  diferenciadores: memory.familiasDetectadas.includes('DIFERENCIADORES'),
  memoria: memory.familiasDetectadas
};

const trustFallback = engine.processTurn('me comenta que tiene dudas sobre la institución', engine.createMemory(), bank);
const emptyFallback = engine.processTurn('me dice que eso no le cuadra', engine.createMemory(), bank);
const fallback = {
  confianzaInferida: trustFallback.familiaDetectada.includes('CONFIANZA'),
  respuestaCalida: emptyFallback.respuestaPrincipal && emptyFallback.respuestaPrincipal.contenido === 'Perfecto, antes de orientarlo quiero identificar mejor qué necesita.',
  preguntaDisponible: !!(emptyFallback.preguntaRecomendada && emptyFallback.preguntaRecomendada.contenido)
};

try {
  assert(multiturn.turnos === 4, 'No conservó los cuatro turnos');
  assert(multiturn.desconfianza, 'No conservó desconfianza');
  assert(multiturn.malaExperiencia, 'No conservó mala experiencia');
  assert(multiturn.interes, 'No conservó interés');
  assert(multiturn.diferenciadores, 'No conservó diferenciadores');
  assert(fallback.confianzaInferida, 'El fallback no infirió confianza');
  assert(fallback.respuestaCalida, 'El fallback final conserva el bloque frío');
  assert(fallback.preguntaDisponible, 'El fallback final no ofrece una pregunta útil');
} catch (error) {
  failures.push({ prueba: 'MULTITURNO', error: error.message });
}

console.log(JSON.stringify({ passed, total: 20, multiturn, fallback, failures, results }, null, 2));
if (passed !== 20 || failures.length) process.exit(1);
