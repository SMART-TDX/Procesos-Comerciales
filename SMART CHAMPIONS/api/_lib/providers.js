'use strict';

class AIProvider {
  constructor(name) { this.name = name || 'AIProvider'; }
  async generate() { throw new Error('PROVIDER_NOT_IMPLEMENTED'); }
  async classify() { throw new Error('PROVIDER_NOT_IMPLEMENTED'); }
  async reason() { throw new Error('PROVIDER_NOT_IMPLEMENTED'); }
  isEnabled() { return false; }
}

class DisabledRemoteProvider extends AIProvider {
  async generate() { throw new Error('REMOTE_AI_DISABLED'); }
  async classify() { throw new Error('REMOTE_AI_DISABLED'); }
  async reason() { throw new Error('REMOTE_AI_DISABLED'); }
}

class OpenAIProvider extends DisabledRemoteProvider {
  constructor() { super('OpenAIProvider'); }
}

class AlternativeProvider extends DisabledRemoteProvider {
  constructor() { super('AlternativeProvider'); }
}

class LocalFallbackProvider extends AIProvider {
  constructor() { super('LocalFallbackProvider'); }
  isEnabled() { return true; }

  async classify(input) {
    return { domains: input.domains, mode: 'LOCAL_TEXTUAL' };
  }

  async reason(input) {
    const facts = input.knowledge.filter((item) => item.type === 'FACT');
    return { primaryEvidence: facts[0] || input.knowledge[0] || null, supportingEvidence: facts.slice(1, 3) };
  }

  async generate(input) {
    if (input.compliance && input.compliance.matched) {
      return {
        understanding: `Ruta prioritaria: ${input.compliance.id}`,
        primaryResponse: input.compliance.response,
        alternatives: [],
        keyQuestion: input.compliance.id === 'DATA_ORIGIN' ? '¿También estás solicitando que no volvamos a contactarte?' : 'No realices preguntas comerciales adicionales.',
        nextMove: input.compliance.nextMove,
        objective: input.compliance.objective,
        alert: input.compliance.alert,
        confidence: 'ALTA',
      };
    }
    const domains = input.domains.map((item) => item.domain);
    const main = input.reasoning.primaryEvidence;
    const comparison = domains.includes('PRODUCT_ONLINE') && domains.includes('PRODUCT_FLEX');
    const exam = domains.includes('SMART_EXAMS');
    const location = domains.includes('SMART_LOCATIONS');
    const currentStudent = domains.includes('SMART_PROCESS_ROUTER');
    let response = 'Entiendo. Antes de recomendar una alternativa, confirmemos el objetivo y la condición que más influye en la decisión.';
    let question = '¿Qué es lo más importante que debemos resolver primero?';
    let nextMove = 'Completa el perfilamiento y utiliza únicamente información respaldada por las fuentes recuperadas.';
    if (comparison) {
      response = 'Smart Online y Smart Flex son alternativas virtuales con características diferentes. Para orientarte correctamente necesitamos saber cuánto acompañamiento en vivo y qué ritmo de estudio buscas.';
      question = '¿Prefieres avanzar principalmente a tu ritmo o contar con clases sincrónicas y acompañamiento más frecuente?';
    } else if (exam) {
      response = 'Antes de recomendar un examen debemos confirmar exactamente qué certificación, nivel o puntaje acepta la institución que lo solicita.';
      question = '¿Qué institución lo exige, qué examen acepta y para qué fecha lo necesitas?';
    } else if (location) {
      response = 'Para revisar una sede conveniente necesitamos confirmar desde dónde se desplaza normalmente y si le resulta mejor estudiar cerca de casa o del trabajo.';
      question = '¿Te conviene más estudiar cerca de tu casa o cerca de donde trabajas o estudias?';
    } else if (currentStudent) {
      response = 'Primero debemos identificar si se trata de una solicitud de estudiante actual y aplicar el proceso institucional correspondiente.';
      question = '¿Cuál es exactamente la solicitud o proceso que necesitas gestionar?';
    } else if (main && main.type === 'STRATEGY') {
      response = main.content;
    }
    return {
      understanding: `Se detectaron ${domains.join(', ')}. La respuesta utiliza recuperación textual local y no IA remota.`,
      primaryResponse: response,
      alternatives: [
        'Organicemos primero la necesidad principal y después revisamos la alternativa que realmente corresponda.',
        'Para no darte información imprecisa, validemos un dato clave antes de avanzar.',
      ],
      keyQuestion: question,
      nextMove,
      objective: currentStudent ? 'ENRUTAR AL PROCESO CORRECTO' : 'CALIFICAR Y CONDUCIR HACIA UNA CITA',
      alert: main ? '' : 'No se recuperó evidencia suficiente para afirmar condiciones institucionales específicas.',
      confidence: main ? 'MEDIA' : 'BAJA',
    };
  }
}

function getProvider() {
  const configured = String(process.env.JORGE_AI_PROVIDER || 'local').toLowerCase();
  if (configured === 'openai') return new OpenAIProvider();
  if (configured === 'alternative') return new AlternativeProvider();
  return new LocalFallbackProvider();
}

module.exports = { AIProvider, OpenAIProvider, AlternativeProvider, LocalFallbackProvider, getProvider };
