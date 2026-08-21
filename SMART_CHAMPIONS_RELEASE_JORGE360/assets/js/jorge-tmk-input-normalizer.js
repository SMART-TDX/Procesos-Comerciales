(function (global) {
  'use strict';

  function plain(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[“”"']/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const reportingPrefixes = [
    /^(?:el cliente|la cliente)\s+(?:me\s+)?(?:dice|comenta|cuenta|indica|manifiesta)\s+que\s+/i,
    /^(?:la senora|el senor)\s+(?:me\s+)?(?:dice|comenta|cuenta|indica|manifiesta)\s+que\s+/i,
    /^(?:el|ella)\s+(?:me\s+)?(?:dice|comenta|cuenta|indica|manifiesta)\s+que\s+/i,
    /^me\s+(?:dice|comenta|cuenta|indica|manifiesta)\s+que\s+/i,
    /^me\s+esta\s+diciendo\s+que\s+/i,
    /^me\s+pregunta\s+/i,
    /^(?:dice|comenta|cuenta|indica|manifiesta)\s+que\s+/i
  ];

  function normalizeInput(value) {
    const original = String(value || '').trim();
    let normalized = plain(original);
    let changed = true;
    while (changed) {
      changed = false;
      reportingPrefixes.forEach((pattern) => {
        const next = normalized.replace(pattern, '').trim();
        if (next !== normalized) {
          normalized = next;
          changed = true;
        }
      });
    }
    return Object.freeze({ original, normalized, hadReportingPrefix: plain(original) !== normalized });
  }

  const signalRules = Object.freeze([
    { family: 'CUMPLIMIENTO', signal: 'NO_CONTACTO', pattern: /no (?:quiere|quiero) que .*?(?:llam|contact)|no .*?(?:llamemos|contactemos) mas|borren|eliminen .*datos/ },
    { family: 'CUMPLIMIENTO', signal: 'ORIGEN_DATO', pattern: /nunca .*dej.*datos|no .*dej.*datos|de donde .*numero|quien .*informacion|yo no pedi/ },
    { family: 'CUMPLIMIENTO', signal: 'MOLESTIA_LLAMADAS', pattern: /cansad.*llam|molest.*llam|llaman demasiado|llaman mucho/ },
    { family: 'CONFIANZA', signal: 'DESCONFIANZA', pattern: /no .*segur|no confi|no .*creer|desconf|no .*convenc|no conozco smart|he escuchado cosas|no se si .*buen|no se si .*funcion|duda|incertid/ },
    { family: 'MODALIDAD', signal: 'MODALIDAD_INDEFINIDA', pattern: /no sabe .*modalidad|no se .*modalidad|cual modalidad|que modalidad|presencial o virtual|quiere virtual|prefiere virtual|quiere presencial|prefiere presencial/ },
    { family: 'PRECIO_PRESUPUESTO', signal: 'DINERO', pattern: /plata|dinero|presupuesto|car[oa]|costos?|precios?|valor|no .*alcanza|no .*da/ },
    { family: 'TIEMPO', signal: 'TIEMPO', pattern: /no .*tiempo|trabaj.*todo el dia|ocupad|agenda/ },
    { family: 'HORARIOS', signal: 'HORARIO', pattern: /horario|sabado|domingo|fin de semana|noche|hasta las|despues de las/ },
    { family: 'UBICACION', signal: 'UBICACION', pattern: /vive .*lejos|queda .*lejos|distancia|desplaz|ubicacion|sede/ },
    { family: 'COMPETENCIA', signal: 'COMPETENCIA', pattern: /otra academia|otro instituto|competencia|comparando|mas barata|cobra menos/ },
    { family: 'CONFIANZA', signal: 'EXPERIENCIA', pattern: /mala experiencia|no aprend|perdi dinero|abandono/ },
    { family: 'EXAMENES', signal: 'CERTIFICACION', pattern: /certific|examen|b2|graduar|universidad/ },
    { family: 'INFORMACION', signal: 'INFORMACION', pattern: /informacion|whatsapp|solo .*mirando|averiguando/ },
    { family: 'APLAZAMIENTO', signal: 'DECISION', pattern: /pensar|revisar primero|decidir|mas adelante/ },
    { family: 'INTERES', signal: 'INTERES', pattern: /quiere aprender|me interesa|le interesa|llamo la atencion/ },
    { family: 'PERFILAMIENTO', signal: 'DUDA_GENERAL', pattern: /no sabe que hacer|no se que hacer|no sabe por donde|no se por donde|no sabe cual|no se cual/ }
  ]);

  function inferSignals(value) {
    const normalized = typeof value === 'string' ? normalizeInput(value).normalized : String(value && value.normalized || '');
    return signalRules.filter((rule) => rule.pattern.test(normalized)).map((rule) => ({ family: rule.family, signal: rule.signal }));
  }

  global.TMK_INPUT_NORMALIZER = Object.freeze({
    version: '1.0.0-lab',
    normalizeInput,
    inferSignals
  });
})(typeof window !== 'undefined' ? window : globalThis);
