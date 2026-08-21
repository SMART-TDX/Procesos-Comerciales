(function (global) {
  'use strict';

  global.JORGE_LOCAL_EXPERT_ACTIVE = true;
  const spec = global.JORGE_LOCAL_EXPERT_KNOWLEDGE || { intents: [], corrections: {}, explore: [] };
  const kb = global.JORGE_KNOWLEDGE_BASE || { records: [], domainCounts: {} };
  const usage = Object.create(null);

  function freshContext(caseId) {
    return { caseId: Number(caseId) || 1, turns: [], language: '', product: '', city: '', residence: '', workplace: '', modality: '', availability: '', schedule: '', motivation: '', objective: '', level: '', certification: '', university: '', objections: [], competitor: '', alreadyStudies: false, preferences: [], barriers: [], discarded: [], askedQuestions: [], answers: [], proposedAppointment: '', state: 'DESCUBRIMIENTO', strategiesUsed: [] };
  }
  let context = freshContext(1);

  function normalize(value) {
    let text = String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    text = text.replace(/[^a-z0-9\s:]/g, ' ').replace(/\s+/g, ' ').trim();
    return text.split(' ').map((word) => spec.corrections[word] || word).join(' ');
  }

  function stem(word) {
    return word.replace(/(amientos|imientos|aciones|mente|ando|iendo|ados|idos|es|os|as|ar|er|ir|s)$/i, '');
  }

  function editDistance(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    const row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i += 1) {
      let previous = row[0]; row[0] = i;
      for (let j = 1; j <= b.length; j += 1) {
        const saved = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
        previous = saved;
      }
    }
    return row[b.length];
  }

  function phraseScore(text, expression) {
    const target = normalize(expression);
    if (!target) return 0;
    if (text.includes(target)) return target.includes(' ') ? 14 + target.split(' ').length * 2 : 8;
    const words = text.split(' '); const targets = target.split(' ');
    let matches = 0;
    targets.forEach((wanted) => {
      if (words.some((word) => stem(word) === stem(wanted) || (wanted.length >= 5 && editDistance(word, wanted) <= 1))) matches += 1;
    });
    return matches === targets.length ? 6 + matches : matches * 1.5;
  }

  function detectIntents(query) {
    const text = normalize(query);
    const results = spec.intents.map((definition) => {
      const expressionScores = definition.expressions.map((expression) => ({ expression, score: phraseScore(text, expression) })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score);
      const score = expressionScores.slice(0, 3).reduce((sum, item, index) => sum + item.score / (index + 1), 0) + definition.priority / 100;
      return { id: definition.id, domain: definition.domain, score: Math.round(score * 10) / 10, reason: expressionScores.slice(0, 2).map((item) => item.expression).join(' · ') };
    }).filter((item) => item.score >= 5).sort((a, b) => b.score - a.score);
    if (!results.length) return [{ id: 'OTRO', domain: 'SMART_CONVERSATION', score: 1, reason: 'Sin cobertura específica' }];
    return results.slice(0, 9);
  }

  const locationNames = Array.from(new Set((kb.records || []).filter((r) => r.Dominio === 'SMART_LOCATIONS').map((r) => String(r.Contenido || '').split('|')[0].trim()).filter((name) => name.length > 2 && name.length < 45)));
  function extractEntities(query) {
    const text = normalize(query); const entities = { locations: [], language: '', level: '', modality: '', products: [], time: '', weekday: '' };
    locationNames.forEach((name) => { if (text.includes(normalize(name))) entities.locations.push(name); });
    entities.locations = Array.from(new Set(entities.locations)).slice(0, 6);
    if (/\bfrances\b/.test(text)) entities.language = 'Francés'; else if (/\bingles\b/.test(text)) entities.language = 'Inglés';
    const level = text.match(/\b(a1|a2|b1|b2|c1)\b/); if (level) entities.level = level[1].toUpperCase();
    if (/\bpresencial\b/.test(text)) entities.modality = 'Presencial';
    if (/\bvirtual|online|desde casa\b/.test(text)) entities.modality = entities.modality ? 'Por definir' : 'Virtual';
    if (/smart online|\bonline\b/.test(text)) entities.products.push('Smart Online');
    if (/smart flex|\bflex\b/.test(text)) entities.products.push('Smart Flex');
    if (/\binstituto\b|\bpresencial\b/.test(text)) entities.products.push('Instituto');
    const time = text.match(/(?:salgo|puedo|despues de|a las)\s*(?:a las\s*)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/); if (time) entities.time = `${time[1]}${time[2] ? ':' + time[2] : ':00'}${time[3] ? ' ' + time[3].toUpperCase() : ''}`;
    if (/sabado/.test(text)) entities.weekday = 'Sábado'; else if (/domingo/.test(text)) entities.weekday = 'Domingo';
    return entities;
  }

  function updateContext(query, intents, entities) {
    const text = normalize(query); context.turns.push({ query: String(query), intents: intents.map((i) => i.id) }); context.turns = context.turns.slice(-12);
    if (entities.language) context.language = entities.language;
    if (entities.level) context.level = entities.level;
    if (entities.modality) context.modality = entities.modality;
    if (entities.products.length === 1) context.product = entities.products[0];
    if (entities.time) context.availability = entities.time;
    if (entities.weekday) context.schedule = entities.weekday;
    const residence = text.match(/(?:vivo|vive) en ([a-z ]{3,35}?)(?= trabajo en| trabaja en| y | pero |$)/); if (residence) context.residence = residence[1].trim();
    const workplace = text.match(/(?:trabajo|trabaja) en ([a-z ]{3,35}?)(?= salgo| sale| y | pero |$)/); if (workplace) context.workplace = workplace[1].trim();
    if (entities.locations.length && !context.residence) context.residence = entities.locations[0];
    if (intents.some((i) => i.id === 'YA_ESTUDIA')) context.alreadyStudies = true;
    if (intents.some((i) => i.id === 'COMPETENCIA' || i.id === 'OTRA_ACADEMIA')) context.competitor = 'Otra institución';
    const objections = intents.filter((i) => ['PRECIO', 'TIEMPO', 'HORARIOS', 'NO_INTERESA', 'LO_PENSARA', 'COMPETENCIA', 'OTRA_ACADEMIA', 'EXPERIENCIA_PREVIA'].includes(i.id)).map((i) => i.id);
    context.objections = Array.from(new Set(context.objections.concat(objections)));
    context.barriers = context.objections.slice();
    if (/trabajo|empleo/.test(text)) context.motivation = context.motivation || 'Trabajo';
    if (/viajar/.test(text)) context.motivation = 'Viaje';
    if (/graduar|universidad/.test(text)) context.objective = 'Requisito académico';
    return context;
  }

  function isCompliance(id) { return ['NO_CONTACTO', 'ELIMINACION_DATOS', 'ORIGEN_DEL_DATO', 'NO_DEJO_DATOS', 'MOLESTIA', 'PRIVACIDAD'].includes(id); }
  const PRIMARY_ORDER = ['NO_CONTACTO', 'ELIMINACION_DATOS', 'PRIVACIDAD', 'ORIGEN_DEL_DATO', 'NO_DEJO_DATOS', 'MOLESTIA', 'ESTUDIANTE_ACTUAL', 'SAC', 'EXAMEN_INTERNACIONAL', 'REQUISITO_UNIVERSITARIO', 'GRADUACION', 'CERTIFICACION', 'SEDES', 'UBICACION', 'YA_ESTUDIA', 'OTRA_ACADEMIA', 'COMPETENCIA', 'DIFERENCIADORES', 'SMART_ONLINE', 'SMART_FLEX', 'VIRTUAL', 'PRESENCIAL', 'PRECIO', 'TIEMPO', 'HORARIOS', 'NO_INTERESA', 'LO_PENSARA', 'NO_DECIDE', 'FRANCES', 'INGLES', 'CONSULTA_GENERAL', 'OTRO'];
  function selectPrimary(intents) { for (const id of PRIMARY_ORDER) { const found = intents.find((item) => item.id === id); if (found) return found; } return intents[0]; }

  function getKnowledge(intents, query, limit) {
    const domains = new Set(intents.map((item) => item.domain)); const words = normalize(query).split(' ').filter((w) => w.length > 3);
    return (kb.records || []).filter((r) => domains.has(r.Dominio)).map((record) => {
      const text = normalize(`${record.Titulo} ${record.Contenido} ${record.Subdominio}`); let score = Number(record.Prioridad || 0) / 25 + 12;
      words.forEach((word) => { if (text.includes(word)) score += 4; });
      if (record.Estado === 'VIGENTE') score += 2;
      return { record, score };
    }).sort((a, b) => b.score - a.score).slice(0, limit || 8).map((item) => item.record);
  }

  const strategies = {
    NO_CONTACTO: { say: ['Entiendo y lamento la molestia. Voy a registrar tu solicitud para que se gestione por el procedimiento correspondiente.'], alt: ['Comprendo. Finalizaré la gestión sin insistir.', 'Gracias por indicarlo. Respetaremos tu solicitud y aplicaremos la ruta correspondiente.'], question: 'No realices preguntas comerciales adicionales.', next: 'Finaliza respetuosamente y registra la solicitud de no contacto.', objective: 'CUMPLIMIENTO · NO AGENDAR', alert: 'No argumentes, no insistas y no programes seguimiento.' },
    ELIMINACION_DATOS: { say: ['Entiendo tu solicitud. Debe registrarse y gestionarse mediante el procedimiento institucional de protección de datos.'], alt: ['Gracias por informarlo. Voy a finalizar la gestión comercial y aplicar la ruta de eliminación.', 'Comprendo. No continuaré con argumentos comerciales.'], question: 'No solicites información adicional que no sea indispensable para registrar la solicitud.', next: 'Finaliza la gestión y aplica el proceso institucional de eliminación.', objective: 'PROTECCIÓN DE DATOS · NO AGENDAR', alert: 'No continúes con recuperación comercial.' },
    ORIGEN_DEL_DATO: { say: ['Entiendo tu inquietud. No quiero darte información incorrecta sobre el origen del registro; voy a solicitar que se valide por el procedimiento interno.'], alt: ['Es válido que preguntes. Registraré la inquietud para que el origen sea validado correctamente.', 'No voy a especular sobre el origen del dato; lo correcto es verificarlo.'], question: '¿También estás solicitando que no volvamos a contactarte?', next: 'Aclara si existe no contacto y registra la inquietud sin especular.', objective: 'VALIDAR Y RESPETAR LA DECISIÓN', alert: 'No afirmes de dónde salió el dato sin soporte verificable.' },
    NO_DEJO_DATOS: { say: ['Entiendo. Si no reconoces haber dejado tus datos, no voy a asumir cómo se obtuvo el registro; debe validarse internamente.'], alt: ['Gracias por decirlo. Lo correcto es revisar el origen antes de continuar.', 'Comprendo la inquietud y no voy a darte una explicación sin soporte.'], question: '¿Deseas que validemos el origen o estás solicitando además no volver a ser contactado?', next: 'Define si es consulta de origen o no contacto y aplica la ruta correspondiente.', objective: 'ACLARAR LA SOLICITUD · CUMPLIMIENTO', alert: 'No conviertas la situación en una objeción comercial.' },
    MOLESTIA: { say: ['Lamento que la frecuencia del contacto haya sido incómoda. Antes de continuar, quiero confirmar qué deseas que hagamos.'], alt: ['Entiendo la molestia. No voy a insistir; confirmemos cómo quieres proceder.', 'Gracias por decirlo. Lo primero es respetar tu decisión.'], question: '¿Deseas finalizar esta llamada o solicitar que no volvamos a contactarte?', next: 'Si solicita no contacto, detén inmediatamente la gestión comercial.', objective: 'ACLARAR Y RESPETAR LA DECISIÓN', alert: 'No intentes recuperar la cita mientras exista una solicitud de no contacto.' },
    ESTUDIANTE_ACTUAL: { say: ['Como ya eres estudiante, primero debemos identificar tu solicitud y orientarte al proceso institucional correspondiente.'], alt: ['Este caso debe manejarse como atención a estudiante actual, no como una venta nueva.', 'Permíteme ubicar el proceso correcto para no darte una orientación equivocada.'], question: '¿Cuál es exactamente la solicitud que necesitas gestionar?', next: 'Clasifica la solicitud y utiliza la ruta oficial de SAC.', objective: 'ENRUTAR AL PROCESO CORRECTO', alert: 'No prometas resolver desde Telemercadeo un proceso de Servicio al Cliente.' },
    PRECIO: { say: ['Claro, el valor es importante. Para que la comparación sea útil necesitamos confirmar modalidad, objetivo y lo que realmente esperas del programa.'], alt: ['Puedo ayudarte a perfilar la alternativa adecuada; el valor exacto debe revisarse en la asesoría con la condición vigente.', 'Antes de comparar solo cifras, revisemos si las opciones responden a la misma necesidad.'], question: 'Además del precio, ¿qué es indispensable para ti: modalidad, horario, acompañamiento o metodología?', next: 'Identifica el criterio principal y conduce a asesoría sin prometer tarifas.', objective: 'GENERAR VALOR Y CALIFICAR LA CITA', alert: 'No inventes precios, promociones, descuentos ni cuotas.' },
    TIEMPO: { say: ['La falta de tiempo es una barrera real. Busquemos primero una franja que puedas sostener de verdad.'], alt: ['No necesitas prometer una disponibilidad imposible; identifiquemos qué espacio sí podrías reservar.', 'Antes de descartar el proyecto, revisemos si existe una modalidad compatible con tu rutina.'], question: '¿Qué día o franja podrías reservar de forma realista para estudiar?', next: 'Confirma disponibilidad y modalidad; después evalúa la cita más viable.', objective: 'CONSTRUIR VIABILIDAD PARA LA CITA', alert: 'No presiones ni prometas horarios no confirmados.' },
    UBICACION: { say: ['Para recomendar una sede conveniente necesito considerar desde dónde te desplazas y si te sirve más estudiar cerca de casa o del trabajo.'], alt: ['Podemos revisar ambos puntos de referencia sin inventar distancias.', 'La sede adecuada depende también del idioma, horario y servicio disponible.'], question: context.residence && context.workplace ? '¿Te conviene más estudiar cerca de tu casa o aprovechar la salida del trabajo?' : '¿Desde qué barrio te desplazas y te conviene más casa o trabajo?', next: 'Consulta la base oficial de sedes y valida servicio antes de proponer la cita.', objective: 'PERFILAR CITA PRESENCIAL', alert: 'No inventes tiempos de desplazamiento ni disponibilidad.' },
    SEDES: { say: ['Puedo ayudarte a ubicar opciones en la base oficial de sedes. Necesito confirmar ciudad, sector, idioma y punto de desplazamiento.'], alt: ['Revisemos la sede desde información oficial, no solo por cercanía aparente.', 'Podemos comparar casa y trabajo como puntos de referencia.'], question: '¿En qué ciudad y sector estás, y te movilizas desde casa o trabajo?', next: 'Filtra sedes y valida producto disponible.', objective: 'PROPONER LA CITA PRESENCIAL MÁS CONVENIENTE', alert: 'No afirmes distancia ni tiempo de viaje.' },
    CERTIFICACION: { say: ['Antes de recomendar una ruta debemos confirmar qué certificación, nivel o puntaje acepta la institución que la solicita.'], alt: ['Puede necesitar examen, preparación o ambos; primero validemos el requisito.', 'No asumamos qué examen sirve: confirmemos exactamente lo que exige la institución.'], question: '¿Qué institución lo solicita, qué examen acepta, qué nivel o puntaje exige y para cuándo?', next: 'Completa el requisito y utiliza la ruta oficial de exámenes.', objective: 'ENRUTAR CORRECTAMENTE', alert: 'No garantices aceptación, resultado ni certificación sin soporte.' },
    SMART_ONLINE: { say: ['Smart Online es una ruta virtual orientada al avance mediante plataforma. Para saber si encaja, confirmemos cuánto acompañamiento esperas y qué ritmo puedes sostener.'], alt: ['Si priorizas autonomía, revisemos si Online corresponde a tu forma de aprender.', 'Antes de elegir, comparemos tu disponibilidad y necesidad de acompañamiento.'], question: '¿Buscas principalmente avanzar a tu ritmo o necesitas clases en vivo más frecuentes?', next: 'Si requiere mayor acompañamiento sincrónico, compara con Smart Flex.', objective: 'PERFILAR LA RUTA VIRTUAL Y AGENDAR', alert: 'No mezcles características de Online y Flex.' },
    SMART_FLEX: { say: ['Smart Flex combina trabajo digital con clases sincrónicas. Confirmemos si esa dinámica responde a lo que esperas.'], alt: ['Si valoras acompañamiento en vivo, revisemos tu disponibilidad para clases sincrónicas.', 'Flex y Online no son iguales; la decisión depende del ritmo y acompañamiento que necesitas.'], question: '¿Qué tan importante es para ti tener clases en vivo y una dinámica más acompañada?', next: 'Valida disponibilidad y conduce a cita virtual.', objective: 'PERFILAR SMART FLEX Y AGENDAR', alert: 'No atribuyas a Flex características exclusivas de Online.' },
    VIRTUAL: { say: ['Tenemos rutas virtuales diferentes. Para orientarte necesitamos saber si priorizas autonomía o clases en vivo más estructuradas.'], alt: ['Virtual no significa una sola opción; comparemos tu forma de aprender.', 'Podemos perfilar Online o Flex según acompañamiento y disponibilidad.'], question: '¿Prefieres avanzar principalmente a tu ritmo o contar con clases sincrónicas frecuentes?', next: 'Define Online o Flex y propone cita virtual.', objective: 'AGENDAR CITA VIRTUAL CALIFICADA', alert: 'No elijas el producto sin completar el perfilamiento.' },
    PRESENCIAL: { say: ['Perfecto, si prefieres presencial revisemos ciudad, sector, idioma y horario para ubicar una sede viable.'], alt: ['La cita presencial es prioritaria cuando corresponde a tu preferencia y recorrido.', 'Busquemos una opción basada en tus puntos reales de desplazamiento.'], question: '¿Te conviene más una sede cerca de casa, del trabajo o del lugar donde estudias?', next: 'Consulta sedes y propone una cita presencial confirmada.', objective: 'AGENDAR CITA PRESENCIAL CALIFICADA', alert: 'No inventes disponibilidad de sede.' },
    YA_ESTUDIA: { say: ['Qué bueno que ya estés trabajando en tu objetivo. Lo importante es saber si la experiencia actual cumple lo que esperabas.'], alt: ['No busco que cambies sin razón; quisiera entender si existe una necesidad no cubierta.', 'Podemos comparar desde tus prioridades, sin hablar negativamente de la otra institución.'], question: '¿Qué mejorarías de tu experiencia actual: horario, metodología, acompañamiento, modalidad o avance?', next: 'Si identifica una necesidad real, conecta un diferenciador Smart respaldado y pide permiso para agendar.', objective: 'IDENTIFICAR UNA OPORTUNIDAD REAL', alert: 'No desacredites al competidor.' },
    OTRA_ACADEMIA: { say: ['Es válido comparar. Para hacerlo bien, revisemos si ambas alternativas responden a la misma modalidad, acompañamiento y objetivo.'], alt: ['El precio es una parte; también importa que la alternativa encaje con tu necesidad.', 'No voy a hablar negativamente de la otra institución; comparemos lo que tú necesitas.'], question: 'Además del precio, ¿qué criterio no estarías dispuesto a sacrificar?', next: 'Relaciona ese criterio con un diferenciador documentado y propone asesoría.', objective: 'COMPARAR CON VALOR Y CALIFICAR LA CITA', alert: 'No inventes información de terceros.' },
    DIFERENCIADORES: { say: ['Smart cuenta con alternativas presenciales y virtuales diferenciadas. La ventaja relevante depende de lo que tú necesites resolver.'], alt: ['No existe una misma respuesta para todos; conectemos tu prioridad con un atributo documentado.', 'Podemos revisar modalidad, acompañamiento y metodología sin hacer afirmaciones de superioridad.'], question: '¿Qué es lo más importante para ti: flexibilidad, acompañamiento, metodología o modalidad?', next: 'Recupera únicamente diferenciadores soportados y conduce a asesoría.', objective: 'GENERAR INTERÉS CON HECHOS VERIFICABLES', alert: 'No digas “somos mejores” ni inventes ventajas.' },
    FRANCES: { say: ['Tenemos información institucional para francés. Antes de recomendar una ruta, confirmemos modalidad, nivel actual y objetivo.'], alt: ['Cuéntame si empiezas desde cero o ya tienes conocimientos.', 'La recomendación cambia según tu objetivo y disponibilidad.'], question: '¿Empiezas desde cero y buscas presencial o virtual?', next: 'Perfila nivel, modalidad y ciudad; luego propone la cita correspondiente.', objective: 'CALIFICAR INTERÉS EN FRANCÉS', alert: 'No prometas niveles o disponibilidad sin validar la fuente.' },
    NO_INTERESA: { say: ['Gracias por ser directo. Para no insistir sin sentido, quisiera entender si no te interesa aprender el idioma o si la alternativa presentada no encaja.'], alt: ['Puede ser falta de prioridad o una propuesta que no corresponde; diferenciemos ambas.', 'No voy a presionarte. Solo quiero confirmar qué parte no te resulta relevante.'], question: '¿No es una prioridad en este momento o hubo algo de la propuesta que no encajó?', next: 'Si no existe necesidad, finaliza; si hay una barrera concreta, trabaja solo esa barrera.', objective: 'CALIFICAR SIN PRESIONAR', alert: 'No confundas desinterés con solicitud de no contacto.' },
    LO_PENSARA: { say: ['Claro. Para que puedas pensarlo con claridad, identifiquemos qué duda falta resolver.'], alt: ['Muchas veces “pensarlo” significa que falta información específica.', 'No necesito presionarte; sí quisiera saber qué aspecto quieres revisar.'], question: '¿Qué necesitas tener claro para tomar una decisión: modalidad, horario, inversión o metodología?', next: 'Resuelve una duda concreta y propone una cita solo si aporta valor.', objective: 'DESCUBRIR LA DUDA REAL', alert: 'No repitas argumentos ya utilizados.' },
    OTRO: { say: ['Quiero orientarte con precisión, pero todavía falta identificar la situación principal.'], alt: ['Cuéntame la frase exacta del prospecto y el contexto inmediato.', 'Puedo ayudarte mejor si indicas qué ocurrió justo antes.'], question: '¿Qué dijo exactamente el prospecto y qué información ya conoces del caso?', next: 'Solicita una sola aclaración útil y vuelve a analizar.', objective: 'ACLARAR SIN INVENTAR', alert: 'No presentes hechos institucionales con confianza baja.' }
  };

  function strategyFor(primary) {
    if (['EXAMEN_INTERNACIONAL', 'REQUISITO_UNIVERSITARIO', 'GRADUACION'].includes(primary.id)) return strategies.CERTIFICACION;
    if (primary.id === 'COMPETENCIA') return strategies.OTRA_ACADEMIA;
    if (primary.id === 'HORARIOS' || primary.id === 'DISPONIBILIDAD' || primary.id === 'FIN_DE_SEMANA') return strategies.TIEMPO;
    if (primary.id === 'SMART_FLEX') return strategies.SMART_FLEX;
    if (primary.id === 'SMART_ONLINE') return strategies.SMART_ONLINE;
    if (primary.id === 'SEDES') return strategies.SEDES;
    return strategies[primary.id] || strategies.OTRO;
  }

  function choose(list, key) {
    const values = list || []; if (!values.length) return '';
    const previous = usage[key] == null ? -1 : usage[key]; const next = (previous + 1) % values.length; usage[key] = next; return values[next];
  }

  function confidenceFor(intents, knowledge) {
    if (intents.some((i) => isCompliance(i.id))) return 'ALTA';
    if (intents[0].id === 'OTRO') return 'BAJA';
    if (intents[0].score >= 15 && knowledge.length) return 'ALTA';
    return knowledge.length ? 'MEDIA' : 'BAJA';
  }

  function analyze(query) {
    if (!String(query || '').trim()) return { status: 'EMPTY' };
    const intents = detectIntents(query); const entities = extractEntities(query); updateContext(query, intents, entities);
    const primary = selectPrimary(intents); const strategy = strategyFor(primary); const knowledge = getKnowledge(intents, query, 10); const confidence = confidenceFor(intents, knowledge);
    const formulations = strategy.say.concat(strategy.alt || []); const response = choose(formulations, `${context.caseId}:${primary.id}:say`); const alternatives = formulations.filter((text) => text !== response).slice(0, 2);
    context.strategiesUsed.push(primary.id); context.strategiesUsed = context.strategiesUsed.slice(-10);
    if (strategy.question && !context.askedQuestions.includes(strategy.question)) context.askedQuestions.push(strategy.question);
    return {
      status: 'ANSWER', primaryIntent: primary.id, intents, entities, confidence,
      happening: isCompliance(primary.id) ? `${primary.id.replace(/_/g, ' ')} tiene prioridad absoluta sobre la gestión comercial.` : `La barrera principal es ${primary.id.replace(/_/g, ' ')}${intents.length > 1 ? '; también se detectó ' + intents.slice(1, 4).map((i) => i.id.replace(/_/g, ' ')).join(', ') : ''}.`,
      response, alternatives, alternativeStyles: ['EMPÁTICA', 'CONSULTIVA'], question: strategy.question, next: strategy.next, objective: strategy.objective, avoid: strategy.alert,
      context: JSON.parse(JSON.stringify(context)), contextSummary: contextSummary(), domains: Array.from(new Set(intents.map((i) => i.domain))),
      known: knownItems(entities), missing: missingItems(primary), sources: knowledge.slice(0, 6).map((r) => ({ title: r.Documento, status: r.Estado, location: r.Ubicacion, knowledgeId: r.KnowledgeID })),
      knowledge: knowledge.slice(0, 6), provenance: 'SISTEMA_EXPERTO_LOCAL', compliance: isCompliance(primary.id)
    };
  }

  function contextSummary() {
    const items = [];
    if (context.language) items.push(`Idioma: ${context.language}`); if (context.product) items.push(`Producto: ${context.product}`); if (context.residence) items.push(`Casa: ${context.residence}`); if (context.workplace) items.push(`Trabajo: ${context.workplace}`); if (context.modality) items.push(`Modalidad: ${context.modality}`); if (context.availability) items.push(`Disponibilidad: ${context.availability}`); if (context.schedule) items.push(`Día: ${context.schedule}`); if (context.level) items.push(`Nivel: ${context.level}`); return items;
  }
  function knownItems(entities) { return contextSummary().concat(entities.locations.map((v) => `Ubicación detectada: ${v}`)).slice(0, 8); }
  function missingItems(primary) {
    const missing = [];
    if (['UBICACION', 'SEDES', 'PRESENCIAL'].includes(primary.id) && !context.city) missing.push('Ciudad');
    if (['VIRTUAL', 'SMART_ONLINE', 'SMART_FLEX'].includes(primary.id) && !context.availability) missing.push('Disponibilidad');
    if (['CERTIFICACION', 'EXAMEN_INTERNACIONAL', 'REQUISITO_UNIVERSITARIO', 'GRADUACION'].includes(primary.id) && !context.university) missing.push('Institución y examen aceptado');
    if (primary.id === 'PRECIO' && !context.modality) missing.push('Modalidad');
    return missing.slice(0, 3);
  }

  function reset() { const id = context.caseId + 1; context = freshContext(id); Object.keys(usage).forEach((key) => delete usage[key]); return JSON.parse(JSON.stringify(context)); }
  function getContext() { return JSON.parse(JSON.stringify(context)); }
  function explore(domainIds, query) {
    if (query) return analyze(query);
    const domains = new Set(domainIds || []); return (kb.records || []).filter((r) => domains.has(r.Dominio) && r.Estado === 'VIGENTE' && !(r.Dominio === 'SMART_LOCATIONS' && /^administrativo/i.test(r.Contenido))).sort((a, b) => b.Prioridad - a.Prioridad).slice(0, 18);
  }

  function safe(value) { return String(value == null ? '' : value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }
  function render(result) {
    const panel = document.getElementById('jorge-result'); const shell = document.querySelector('.jorge-shell'); if (!panel || !shell || result.status === 'EMPTY') return;
    shell.classList.add('has-result');
    const badges = result.intents.slice(0, 5).map((i) => `<span>${safe(i.id.replace(/_/g, ' '))}</span>`).join('');
    const alternatives = result.alternatives.map((text, i) => `<article><span>${safe(result.alternativeStyles[i])}</span><p>“${safe(text)}”</p><button type="button" data-copy="${safe(text)}">Copiar</button></article>`).join('');
    const sources = result.sources.map((s) => `<li><strong>${safe(s.title)}</strong><small>${safe(s.location)} · ${safe(s.status)}</small></li>`).join('');
    panel.innerHTML = `<div class="jorge-casebar"><div><span>CASO ${safe(result.context.caseId)} · CONFIANZA ${safe(result.confidence)}</span><div>${badges}</div></div>${result.contextSummary.length ? `<ul>${result.contextSummary.map((i) => `<li>${safe(i)}</li>`).join('')}</ul>` : ''}</div><section class="jorge-primary-answer"><h3>QUÉ PUEDES DECIR</h3><blockquote>“${safe(result.response)}”</blockquote><button type="button" data-copy="${safe(result.response)}">Copiar respuesta</button></section><section class="jorge-alternatives"><h3>OTRAS FORMAS</h3><div>${alternatives}</div></section><section class="jorge-question"><h3>PREGUNTA CLAVE</h3><button type="button" data-copy="${safe(result.question)}">“${safe(result.question)}”</button></section><section class="jorge-next"><div><span>SIGUIENTE MOVIMIENTO</span><strong>${safe(result.next)}</strong></div><div><span>OBJETIVO</span><strong>${safe(result.objective)}</strong></div></section>${result.avoid ? `<section class="jorge-operational-alert"><h3>QUÉ NO HACER</h3><p>${safe(result.avoid)}</p></section>` : ''}<details class="jorge-strategy"><summary>Ver más</summary><div><section><h3>LECTURA DEL CASO</h3><p>${safe(result.happening)}</p><p><strong>Sabemos:</strong> ${safe(result.known.join(' · ') || 'Información inicial')}</p><p><strong>Falta:</strong> ${safe(result.missing.join(' · ') || 'Ningún dato crítico')}</p></section>${sources ? `<section><h3>FUENTES</h3><ul class="jorge-sources">${sources}</ul></section>` : ''}</div></details><footer>Jorge orienta la gestión TMK. El ejecutivo comercial realiza la asesoría y la venta.</footer>`;
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderExplore(records, label) {
    const panel = document.getElementById('jorge-explore-results'); if (!panel) return;
    panel.innerHTML = `<h3>${safe(label)}</h3><div class="jorge-knowledge-cards">${records.map((r) => `<article><span>${safe(r.Producto)}</span><h4>${safe(r.Titulo)}</h4><p>${safe(r.Resumen || r.Contenido)}</p><small>${safe(r.Documento)} · ${safe(r.Ubicacion)}</small></article>`).join('')}</div>`;
  }

  function init() {
    const form = document.getElementById('jorge-form'); if (!form) return;
    form.addEventListener('submit', (event) => { event.preventDefault(); const input = document.getElementById('jorge-query'); const result = analyze(input.value); render(result); input.value = ''; });
    document.addEventListener('click', (event) => {
      const queryButton = event.target.closest('[data-query]'); const copy = event.target.closest('[data-copy]'); const mode = event.target.closest('[data-jorge-mode]'); const exploreButton = event.target.closest('[data-explore]');
      if (queryButton) render(analyze(queryButton.dataset.query));
      if (copy && navigator.clipboard) navigator.clipboard.writeText(copy.dataset.copy);
      if (mode) { document.querySelectorAll('[data-jorge-mode]').forEach((b) => b.classList.toggle('active', b === mode)); document.querySelectorAll('[data-jorge-panel]').forEach((p) => p.hidden = p.dataset.jorgePanel !== mode.dataset.jorgeMode); }
      if (exploreButton) { const item = spec.explore.find((x) => x.id === exploreButton.dataset.explore); if (item && item.query) render(analyze(item.query)); else if (item) renderExplore(explore(item.domains), item.label); }
    });
    const resetButton = document.getElementById('jorge-reset'); if (resetButton) resetButton.addEventListener('click', () => { reset(); form.reset(); document.querySelector('.jorge-shell').classList.remove('has-result'); document.getElementById('jorge-result').innerHTML = ''; document.getElementById('jorge-explore-results').innerHTML = ''; });
  }

  const api = Object.freeze({ analyze, detectIntents, extractEntities, normalize, reset, getContext, explore, taxonomySize: spec.intents.length, expressionCount: spec.intents.reduce((sum, i) => sum + i.expressions.length, 0), knowledgeCount: (kb.records || []).length, version: 'LOCAL_EXPERT_1.0.0', remoteAI: false });
  global.JORGE_LOCAL_EXPERT = api; global.JORGE_ENGINE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', init);
})(typeof window !== 'undefined' ? window : globalThis);
