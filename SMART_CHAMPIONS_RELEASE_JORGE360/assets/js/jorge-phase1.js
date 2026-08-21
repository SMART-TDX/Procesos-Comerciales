(function (global) {
  'use strict';

  global.JORGE_PHASE1_ACTIVE = true;
  const base = global.JORGE_KNOWLEDGE || { records: [] };
  const phase = global.JORGE_PHASE1_KNOWLEDGE || { concepts: {}, compliance: {}, factualPolicies: {}, sources: {} };
  const stopWords = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'que', 'de', 'del', 'me', 'mi', 'se', 'su', 'sus', 'y', 'o', 'a', 'por', 'para', 'con', 'dice', 'dijo', 'cliente', 'pero', 'ademas', 'no']);
  const places = ['suba', 'chapinero', 'salitre', 'kennedy', 'soacha', 'bogota', 'medellin', 'cali', 'barranquilla', 'bucaramanga', 'cartagena', 'pereira', 'manizales', 'armenia', 'ibague', 'cucuta'];
  const freshContext = () => ({ caseId: 1, turns: [], intents: [], locations: [], residence: null, workplace: null, language: null, modality: null, availability: null, need: null, motivation: null, objections: [], emotion: null, compliance: null, stage: 'DESCUBRIMIENTO' });
  let context = freshContext();

  function normalize(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function stem(token) {
    const map = { presio: 'precio', presios: 'precio', precios: 'precio', valores: 'valor', costos: 'costo', tarifas: 'tarifa', horarios: 'horario', sedes: 'sede', llamadas: 'llamada', birtual: 'virtual', virtal: 'virtual', precensial: 'presencial', presensial: 'presencial', tienpo: 'tiempo', travajo: 'trabajo', franses: 'frances', inges: 'ingles', informasion: 'informacion', lejisimos: 'lejos', lejisimo: 'lejos' };
    if (map[token]) return map[token];
    if (token.length > 7 && token.endsWith('ando')) return token.slice(0, -4);
    if (token.length > 7 && token.endsWith('iendo')) return token.slice(0, -5);
    if (token.length > 6 && token.endsWith('es')) return token.slice(0, -2);
    if (token.length > 5 && token.endsWith('s')) return token.slice(0, -1);
    return token;
  }
  function tokens(value) { return normalize(value).split(' ').filter((token) => token.length > 1 && !stopWords.has(token)).map(stem); }
  function distance(a, b) {
    const row = Array.from({ length: b.length + 1 }, (_, index) => index);
    for (let i = 1; i <= a.length; i += 1) {
      let previous = row[0]; row[0] = i;
      for (let j = 1; j <= b.length; j += 1) { const current = row[j]; row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1)); previous = current; }
    }
    return row[b.length];
  }
  function similarity(a, b) {
    if (a === b) return 1;
    if (a.length > 3 && (a.includes(b) || b.includes(a))) return 0.82;
    const max = Math.max(a.length, b.length); const score = max ? 1 - distance(a, b) / max : 0;
    return score >= 0.72 ? score : 0;
  }
  function conceptScores(query) {
    const clean = normalize(query); const queryTokens = tokens(clean); const scores = {};
    Object.keys(phase.concepts || {}).forEach((concept) => {
      scores[concept] = phase.concepts[concept].reduce((total, expression) => {
        const phrase = normalize(expression);
        if (phrase.includes(' ') && clean.includes(phrase)) return total + 8;
        return total + tokens(phrase).reduce((sum, expressionToken) => sum + queryTokens.reduce((best, queryToken) => Math.max(best, similarity(queryToken, expressionToken)), 0), 0);
      }, 0);
    });
    return scores;
  }
  function scoreRecord(query, record) {
    const clean = normalize(query); const queryTokens = tokens(clean); let best = 0;
    (record.triggers || []).forEach((trigger) => {
      const phrase = normalize(trigger); let score = clean === phrase ? 30 : clean.includes(phrase) && phrase.length >= 5 ? 15 : 0;
      tokens(phrase).forEach((triggerToken) => { score += queryTokens.reduce((top, queryToken) => Math.max(top, similarity(queryToken, triggerToken)), 0) * 2; });
      best = Math.max(best, score);
    });
    return best;
  }
  function detectIntents(query, scores) {
    const clean = normalize(query);
    const intents = [];
    const add = (id, score, reason) => {
      if (score <= 0 || intents.some((item) => item.id === id)) return;
      const record = base.records.find((item) => item.id === id);
      intents.push({ id, score, reason, label: record ? record.label : id, record: record || null });
    };
    const noContactPattern = /(?:no (?:me|lo|la)? ?(?:(?:vuelvan|volvamos) a )?(?:llamar|llamen|contactar|contacten|escribir|escriban)|borren|borremos|eliminen|eliminar|saquenme|saqueme).*(?:datos|numero|base)?|(?:datos|numero).*(?:borren|eliminen)|no autorizo llamadas/;
    const dataPattern = /(?:nunca|jamas|no) (?:deje|dejo|di|dio|pedi|pidio|solicite|solicito).*(?:datos|informacion)|de donde (?:sacaron|sacamos|tienen|tenemos).*(?:numero|datos)|quien (?:les )?(?:dio|dio).*(?:numero|telefono)|por que (?:tienen|tiene).*(?:datos|numero)|no autorice|nunca autorice/;
    const fatiguePattern = /(?:mamado|cansado|aburrido|bravo|molesto|no joda|no jodan|otra vez ustedes).*(?:llam|contact|ustedes)?|(?:llaman|llamaron|llamando|llamadas).*(?:mucho|varias|cansado|aburrido)/;
    if (noContactPattern.test(clean)) add('do-not-contact', 100, 'COMPLIANCE');
    else if (scores.noContact >= 7) add('do-not-contact', 100, 'COMPLIANCE');
    if (dataPattern.test(clean)) add(/autorice|autorizo/.test(clean) ? 'privacy-authorization' : 'data-origin', 94, 'COMPLIANCE');
    else if (scores.dataOrigin >= 7) add('data-origin', 92, 'COMPLIANCE');
    if (fatiguePattern.test(clean)) add('contact-fatigue', 88, 'EMOTION');
    if (scores.exam >= 1) add('exam-certification', 76, 'FACTUAL');
    if (scores.budget >= 1 || /(?:luca|bolsillo|quebrado|cotizando)/.test(clean)) add('budget', 65 + scores.budget, 'OBJECTION');
    if (scores.time >= 1 || /(?:ahorita no puedo|entre semana imposible|despues de las|solo (?:los )?sabados)/.test(clean)) add('time', 64 + scores.time, 'OBJECTION');
    if (scores.location >= 1 || /quinta porra|no (?:tengo )?como ir/.test(clean)) add('location', 63 + scores.location, 'CONTEXT');
    if (scores.presential >= 1) add('presential', 58 + scores.presential, 'PREFERENCE');
    if (scores.virtual >= 1) add('virtual', 58 + scores.virtual, 'PREFERENCE');
    if (scores.think >= 1) add('think', 58 + scores.think, 'OBJECTION');
    if (scores.competitor >= 2) add('already-studying', 55 + scores.competitor, 'CONTEXT');
    if (scores.differentiator >= 2) add('smart-differentiators', 70 + scores.differentiator, 'FACTUAL');
    if (scores.information >= 1 || /solo estoy mirando|quiero averiguar|estoy cotizando|quiero comparar/.test(clean)) add('information', 54 + scores.information, 'REQUEST');
    if (scores.language >= 1) add('language', 50 + scores.language, 'CONTEXT');
    if (scores.callback >= 3 || /ahorita no puedo|llameme despues|no puede hablar/.test(clean)) add('callback', 72 + scores.callback, 'FOLLOWUP');
    base.records.map((record) => ({ record, score: scoreRecord(query, record) })).sort((a, b) => b.score - a.score).filter((item) => item.score >= 8).slice(0, 5).forEach((item) => add(item.record.id, item.score, 'MATRIX'));
    return intents.sort((a, b) => b.score - a.score).slice(0, 6);
  }
  function updateContext(query, intents) {
    const clean = normalize(query);
    places.filter((place) => new RegExp('\\b' + place + '\\b').test(clean)).forEach((place) => { if (!context.locations.includes(place)) context.locations.push(place); });
    const residence = clean.match(/(?:vive|vivo|reside|casa)(?:\s+en)?\s+(suba|chapinero|salitre|kennedy|soacha|bogota|medellin|cali)/);
    const workplace = clean.match(/(?:trabaja|trabajo|oficina)(?:\s+en|\s+por)?\s+(suba|chapinero|salitre|kennedy|soacha|bogota|medellin|cali|la 72|72)/);
    if (residence) context.residence = residence[1]; if (workplace) context.workplace = workplace[1];
    if (/ingles|inges/.test(clean)) context.language = 'INGLÉS'; if (/frances|franses/.test(clean)) context.language = 'FRANCÉS';
    if (/presencial|presensial|precensial/.test(clean) && !/no (quiere|quiero|puede|puedo).*presencial/.test(clean)) context.modality = 'PRESENCIAL';
    if (/virtual|birtual|virtal|online|meet|desde (?:la )?casa|no (?:se )?(?:puede )?desplazar|no quiero desplazarme|no puedo ir|no puede ir/.test(clean)) context.modality = 'VIRTUAL';
    const wordsToHour = { seis: '6', siete: '7', ocho: '8', nueve: '9' };
    const hour = clean.match(/(?:salgo|sale|despues de|a las|como a las)\s+(\d{1,2}|seis|siete|ocho|nueve)(?::(\d{2}))?/);
    if (hour) { const value = wordsToHour[hour[1]] || hour[1]; context.availability = 'DESPUÉS DE LAS ' + value + (hour[2] ? ':' + hour[2] : ':00'); }
    if (/sabado|fin de semana/.test(clean)) context.availability = 'SÁBADOS / FIN DE SEMANA';
    if (/b2|certificar|graduar|examen/.test(clean)) context.need = 'CERTIFICACIÓN / EXAMEN POR PERFILAR';
    if (/universidad|graduar/.test(clean)) context.motivation = 'REQUISITO ACADÉMICO';
    if (/molesto|cansado|mamado|bravo|aburrido|no joda/.test(clean) && /llam|contact|ustedes/.test(clean)) context.emotion = 'MOLESTIA';
    if (intents.some((item) => item.id === 'do-not-contact')) context.compliance = 'NO_CONTACTO'; else if (intents.some((item) => ['data-origin', 'privacy-authorization', 'contact-fatigue'].includes(item.id))) context.compliance = 'REVISAR_CONTACTABILIDAD';
    intents.forEach((intent) => { if (!context.intents.includes(intent.id)) context.intents.push(intent.id); if (['budget', 'time', 'think', 'location', 'already-studying'].includes(intent.id) && !context.objections.includes(intent.id)) context.objections.push(intent.id); });
    context.intents = context.intents.slice(-10); context.objections = context.objections.slice(-6); context.turns.push({ query, intents: intents.map((item) => item.id) }); context.turns = context.turns.slice(-20);
  }
  function title(value) { return String(value || '').charAt(0).toUpperCase() + String(value || '').slice(1); }
  function contextSummary() {
    const values = [];
    if (context.residence) values.push('Vive: ' + title(context.residence)); if (context.workplace) values.push('Trabaja: ' + title(context.workplace));
    if (!context.residence && !context.workplace && context.locations.length) values.push('Ubicación: ' + context.locations.map(title).join(', '));
    if (context.language) values.push(context.language); if (context.modality) values.push(context.modality); if (context.availability) values.push(context.availability); if (context.need) values.push(context.need); if (context.emotion) values.push(context.emotion);
    return values;
  }
  function routeFor(intents) {
    if (context.compliance) return 'NONE'; if (context.modality === 'PRESENCIAL') return 'PRESENCIAL'; if (context.modality === 'VIRTUAL') return 'GOOGLE_MEET'; if (intents.some((item) => item.id === 'callback')) return 'TELEFONICA'; return 'PRESENCIAL';
  }
  function objective(route) { return ({ PRESENCIAL: 'AGENDAR CITA PRESENCIAL', GOOGLE_MEET: 'AGENDAR CITA VIRTUAL / MEET', TELEFONICA: 'AGENDAR CITA TELEFÓNICA', NONE: 'APLICAR EL PROCESO CORRECTO' }[route]); }
  function nextStep(intent, route) {
    const steps = { budget: 'Identifica necesidad, modalidad y disponibilidad; deja el valor aplicable para la asesoría con fuente vigente.', time: 'Aterriza un día y una franja concreta; si desplazarse no es viable, evalúa Meet.', think: 'Descubre qué necesita revisar antes de acordar un seguimiento o una asesoría.', 'already-studying': 'Explora qué valora y si existe una necesidad no cubierta, sin atacar a otra institución.', information: 'Perfila idioma, objetivo y modalidad antes de enviar información general.', location: 'Define si le conviene estudiar cerca de casa o del trabajo; consulta sedes vigentes antes de nombrarlas.' };
    return steps[intent] || ({ PRESENCIAL: 'Propón primero una cita presencial si las condiciones reales lo permiten.', GOOGLE_MEET: 'Propón una asesoría por Google Meet y confirma día y hora.', TELEFONICA: 'Acordar una asesoría telefónica en un horario concreto.', NONE: 'Aplica el procedimiento correspondiente antes de continuar.' }[route]);
  }
  function sourceDetails(ids) { return (ids || []).map((id) => phase.sources[id]).filter(Boolean); }
  function useStrategy(name, overrides) {
    const strategy = phase.domainStrategies && phase.domainStrategies[name];
    if (!strategy) return null;
    return Object.assign({}, strategy, overrides || {}, {
      alternatives: (strategy.alternatives || []).slice(),
      alternativeStyles: (strategy.alternativeStyles || []).slice(),
      sourceIds: (strategy.sourceIds || []).slice()
    });
  }
  function reasonByDomain(clean, intents) {
    const ids = intents.map((item) => item.id);
    const has = (id) => ids.includes(id) || context.intents.includes(id);
    if (/mala experiencia|le fue mal|tuvo problemas|no funciono/.test(clean) && /academia|institucion|curso|estudio/.test(clean)) return useStrategy('priorBadExperience', { known: ['Experiencia previa negativa'], missing: ['Qué ocurrió', 'Qué esperaba', 'Qué necesita diferente'], domains: ['OBJECIONES', 'PORTAFOLIO'] });
    if (/otra (?:academia|institucion).*(?:barata|economica|menor precio)|(?:barata|economica).*(?:otra academia|otra institucion)/.test(clean)) return useStrategy('competitorPrice', { known: ['Compara con otra institución', 'Precio como criterio'], missing: ['Qué compara', 'Qué valora'], domains: ['COMPETENCIA', 'OBJECIONES'] });
    if (/ya (?:esta )?estudiando|estudia en otra|ya se matriculo|ya consiguio donde|esta haciendo un curso/.test(clean) || has('already-studying')) return useStrategy('alreadyStudying', { known: ['Ya estudia o tomó acción'], missing: ['Nivel de satisfacción', 'Necesidad no cubierta'], domains: ['OBJECIONES', 'PORTAFOLIO'] });
    if (has('exam-certification')) return useStrategy('exams', { known: context.need ? [context.need] : ['Interés en certificación o examen'], missing: ['Institución', 'Examen aceptado', 'Puntaje o nivel', 'Fecha límite'], domains: ['EXÁMENES', 'PROCESOS'] });
    if (has('smart-differentiators')) return useStrategy('differentiators', { known: ['Solicita diferencias verificables'], missing: ['Qué criterio valora', 'Qué modalidad necesita'], domains: ['PORTAFOLIO', 'PRODUCTOS'] });
    if (/no quiere (?:hablar|cita).*(?:asesor|ejecutivo)|solo (?:quiere|quiero).*(?:precio|cuanto vale).*(?:no quiere|sin).*(?:asesor|cita)/.test(clean)) return useStrategy('priceOnly', { known: ['Busca precio', 'Rechaza asesoría por ahora'], missing: ['Modalidad', 'Idioma', 'Objetivo'], domains: ['OBJECIONES', 'PRECIO'] });
    if ((has('virtual') || /virtual/.test(clean) || context.modality === 'VIRTUAL') && /no (?:se )?(?:puede )?desplazar|no quiero desplazarme|desde (?:la )?casa|solo (?:puede )?virtual|no puede ir|no quiere ir/.test(clean)) return useStrategy('virtual', { known: ['Prefiere virtual', 'No desea o no puede desplazarse'], missing: ['Autonomía o clases en vivo', 'Objetivo', 'Disponibilidad'], domains: ['SMART ONLINE', 'SMART FLEX'] });
    if ((has('time') || context.objections.includes('time')) && (has('budget') || context.objections.includes('budget')) && !context.residence && !context.workplace) return useStrategy('timeAndBudget', { known: ['Interés en aprender', 'Barrera de tiempo', 'Barrera de presupuesto'], missing: ['Disponibilidad real', 'Modalidad viable'], domains: ['OBJECIONES', 'AGENDAMIENTO'] });
    if (has('location') && !has('budget') && !has('time')) return useStrategy('location', { known: contextSummary(), missing: ['Punto prioritario: casa o trabajo', 'Idioma o servicio', 'Horario'], domains: ['SEDES'] });
    return null;
  }
  function transverse(intents) {
    const ids = intents.map((item) => item.id); const hasLocation = ids.includes('location') || context.locations.length > 1 || context.residence || context.workplace; const hasTime = ids.includes('time') || Boolean(context.availability); const hasBudget = ids.includes('budget') || context.objections.includes('budget'); const hasModality = ids.includes('presential') || ids.includes('virtual') || Boolean(context.modality);
    if (!(hasLocation && (hasTime || hasBudget || hasModality))) return null;
    const barriers = [hasLocation && 'desplazamiento', hasTime && 'disponibilidad', hasBudget && 'inversión'].filter(Boolean);
    return { title: 'Situación con varias barreras', happening: 'Hay que trabajar ' + barriers.join(', ') + '. ' + (contextSummary().length ? 'Ya sabemos: ' + contextSummary().join(' · ') + '.' : ''), response: 'Entiendo. Antes de descartar una alternativa, revisemos qué le resulta realmente viable según su recorrido y disponibilidad.', alternatives: ['Organicemos primero dónde y cuándo podría estudiar; después revisamos con el ejecutivo la alternativa que corresponda.', hasBudget ? 'Primero encontremos una opción compatible con su realidad y luego validamos la inversión aplicable, sin prometer valores.' : 'Definamos el punto y el horario más convenientes antes de recomendar una ruta.'], question: context.residence && context.workplace ? '¿Le quedaría más cómodo estudiar cerca de su casa o aprovechar la salida del trabajo?' : '¿Desde qué lugar se desplazaría normalmente y en qué horario podría estudiar?', next: 'Define el punto de referencia y la disponibilidad. Conserva las demás barreras para trabajarlas después del perfilamiento.', objective: objective(routeFor(intents)), avoid: 'No inventes distancias, horarios, sedes, tarifas ni promociones.', sourceIds: ['MATRIX'], factual: true };
  }
  function recordResult(record, intents) {
    if (!record) return { title: 'Situación abierta', happening: 'La situación todavía no tiene suficiente detalle para elegir una barrera principal.', response: 'Entiendo. Para ayudarte a avanzar, cuéntame qué es lo que más le preocupa al cliente en este momento.', alternatives: ['Valida primero qué necesita aclarar y qué espera de la conversación.'], question: '¿Qué es lo que más le impide avanzar ahora?', next: 'Profundiza con una pregunta abierta antes de ofrecer información institucional.', objective: 'ENTENDER Y PERFILAR', avoid: 'No completes datos institucionales que no estén soportados.', sourceIds: [], factual: false };
    const profile = base.profiles && (base.profiles[record.id] || base.profiles.default);
    return { title: record.label, happening: profile && profile.why ? profile.why : 'Jorge identificó una situación que requiere perfilamiento.', response: record.responses[0] ? record.responses[0].text : 'Profundiza antes de responder.', alternatives: record.responses.slice(1, 3).map((item) => item.text), question: record.questions[0] || '¿Qué necesita aclarar primero?', next: nextStep(record.id, routeFor(intents)), objective: objective(routeFor(intents)), avoid: record.id === 'budget' ? 'No inventes precios, promociones ni descuentos.' : 'No afirmes hechos institucionales sin una fuente aprobada.', sourceIds: record.source === 'MATRIX' ? ['MATRIX'] : [], factual: record.source === 'MATRIX' };
  }
  function analyze(query) {
    const clean = normalize(query); if (!clean) return { status: 'EMPTY', message: 'Cuéntame qué está pasando con tu cliente.' };
    const intents = detectIntents(clean, conceptScores(clean)); updateContext(query, intents);
    let raw; let compliance = false;
    if (intents.some((item) => item.id === 'do-not-contact')) { raw = phase.compliance.noContact; compliance = true; }
    else if (intents.some((item) => item.id === 'contact-fatigue')) { raw = phase.compliance.fatigue; compliance = true; }
    else if (intents.some((item) => ['data-origin', 'privacy-authorization'].includes(item.id))) { raw = phase.compliance.dataOrigin; compliance = true; }
    else {
      const unsupportedPattern = /(?:cuanto cuesta exactamente|promocion.*hoy|descuento|garantizan|garantia|cuantos meses exactamente|horario exacto|exactamente a \d+ minutos|disponibilidad exacta)/;
      const refusesAppointment = /no quiere cita|no quiero cita/.test(clean);
      const wantsWhatsApp = /whatsapp|escriba|escribale/.test(clean) && /no puede hablar|no puedo hablar|ahora no|ahorita no/.test(clean);
      const migrationNeed = /irse del pais|emigrar|migracion/.test(clean);
      const operatorOverloaded = /demasiadas cosas|no se que responder/.test(clean);
      if (unsupportedPattern.test(clean)) raw = phase.factualPolicies.unsupported;
      else if (refusesAppointment) raw = { title: 'Solicita precio sin aceptar cita', happening: 'El prospecto quiere información puntual y todavía no autoriza una cita.', response: 'Entiendo. Para darte información correcta, primero dime qué programa y modalidad estás revisando.', alternatives: ['Te comparto únicamente información validada; no quiero darte un valor que no corresponda.', 'Primero identifiquemos qué necesitas y luego decides si deseas hablar con un ejecutivo.'], question: '¿Buscas inglés o francés y prefieres presencial o virtual?', next: 'Perfila sin presionar. Entrega solo información validada y pide permiso antes de proponer otro contacto.', objective: 'PERFILAR SIN FORZAR UNA CITA', avoid: 'No inventes precios ni insistas en agendar.', sourceIds: ['MATRIX'], factual: true };
      else if (wantsWhatsApp) raw = { title: 'Solicita continuar por WhatsApp', happening: 'Ahora no puede hablar y propone otro canal.', response: 'Claro, respeto tu tiempo. Te escribiré para confirmar qué información necesitas y cuándo podemos retomarla.', alternatives: ['Sin problema. Dejemos acordado por WhatsApp el mejor momento para continuar.'], question: '¿Qué horario te funciona para retomar la conversación?', next: 'Respeta el canal solicitado y acuerda un momento concreto; no envíes información no validada.', objective: 'ACORDAR UN SEGUIMIENTO ÚTIL', avoid: 'No conviertas el mensaje en una asesoría comercial completa.', sourceIds: [], factual: false };
      else if (migrationNeed) raw = { title: 'Objetivo de idioma relacionado con migración', happening: 'Existe una motivación clara, pero falta identificar si necesita programa, preparación o examen.', response: 'Entiendo. Para orientarlo bien, primero confirmemos qué requisito de idioma tiene para su proceso y en qué fecha lo necesita.', alternatives: ['No elijamos un programa todavía; primero identifiquemos el requisito exacto.', 'Un ejecutivo puede revisar su objetivo y ayudarle a definir la ruta correcta.'], question: '¿Le exigen un nivel, certificado o examen específico y para cuándo?', next: 'Perfila requisito, fecha, nivel actual y disponibilidad; después agenda con el ejecutivo.', objective: 'PROGRAMAR UNA ASESORÍA BIEN PERFILADA', avoid: 'No asumas qué programa o examen necesita.', sourceIds: ['MATRIX'], factual: true };
      else if (operatorOverloaded) raw = { title: 'La conversación necesita orden', happening: 'La telemercaderista necesita priorizar una pregunta antes de seguir respondiendo.', response: 'No intentes responder todo a la vez. Valida primero cuál es la duda más importante del cliente.', alternatives: ['Organicemos la conversación: necesidad, disponibilidad y luego siguiente paso.', 'Pídele que elija qué necesita aclarar primero.'], question: '¿Cuál es la primera pregunta concreta que te hizo?', next: 'Aclara una necesidad a la vez y consulta la fuente correspondiente antes de responder.', objective: 'RECUPERAR EL CONTROL DE LA CONVERSACIÓN', avoid: 'No improvises respuestas ni satures al prospecto.', sourceIds: [], factual: false };
      else raw = reasonByDomain(clean, intents) || transverse(intents) || (intents.some((item) => item.id === 'virtual') && intents.some((item) => item.id === 'presential') ? phase.factualPolicies.modality : recordResult(intents.map((item) => item.record).find(Boolean), intents));
    }
    const result = Object.assign({ status: 'ANSWER', intents: intents.map((item) => ({ id: item.id, label: item.label, score: Math.round(item.score), reason: item.reason })), context: JSON.parse(JSON.stringify(context)), contextSummary: contextSummary(), route: routeFor(intents), confidence: intents.length ? (intents[0].score >= 75 ? 'ALTA' : intents[0].score >= 35 ? 'MEDIA' : 'BAJA') : 'BAJA', sources: sourceDetails(raw.sourceIds), provenance: raw.factual || (raw.sourceIds && raw.sourceIds.length) ? 'HECHO_Y_ESTRATEGIA' : 'ESTRATEGIA_CONVERSACIONAL' }, raw);
    if (compliance) { result.happening = raw.title + '. Esta situación tiene prioridad sobre cualquier argumento comercial.'; result.compliance = true; result.confidence = 'ALTA'; result.provenance = 'RUTA_DE_CUMPLIMIENTO'; }
    return result;
  }
  function reset() { const next = context.caseId + 1; context = freshContext(); context.caseId = next; if (global.JORGE_LEGACY_ENGINE && global.JORGE_LEGACY_ENGINE.reset) global.JORGE_LEGACY_ENGINE.reset(); return context; }
  function getContext() { return JSON.parse(JSON.stringify(context)); }
  function safe(value) { return String(value == null ? '' : value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }
  function render(result) {
    const panel = document.getElementById('jorge-result'); const shell = document.querySelector('.jorge-shell'); if (!panel || !shell || result.status === 'EMPTY') return; shell.classList.add('has-result');
    const alternatives = (result.alternatives || []).slice(0, 2).map((text, index) => '<article><span>' + safe((result.alternativeStyles || [])[index] || ('ALTERNATIVA ' + (index + 1))) + '</span><p>“' + safe(text) + '”</p><button type="button" data-copy="' + safe(text) + '">Copiar</button></article>').join('');
    const contextItems = (result.contextSummary || []).map((item) => '<li>' + safe(item) + '</li>').join(''); const badges = (result.intents || []).slice(0, 5).map((item) => '<span>' + safe(item.label) + '</span>').join(''); const sources = (result.sources || []).map((item) => '<li><strong>' + safe(item.title) + '</strong><small>' + safe(item.status) + '</small></li>').join('');
    const sourceBlock = sources ? '<section><h3>FUENTES UTILIZADAS</h3><ul class="jorge-sources">' + sources + '</ul></section>' : '<section><h3>ALCANCE DE LA RESPUESTA</h3><p>Esta orientación es estrategia conversacional. No contiene precios, promociones, sedes, horarios ni condiciones institucionales nuevas.</p></section>';
    const reasoning = '<section><h3>RAZONAMIENTO DEL CASO</h3><p><strong>Sabemos:</strong> ' + safe((result.known || result.contextSummary || []).join(' · ') || 'Información inicial') + '</p><p><strong>Falta descubrir:</strong> ' + safe((result.missing || []).join(' · ') || 'La barrera principal') + '</p><p><strong>Dominios consultados:</strong> ' + safe((result.domains || []).join(' · ') || 'Matriz TMK') + '</p></section>';
    panel.innerHTML = '<div class="jorge-casebar"><div><span>CASO ' + safe(result.context.caseId) + ' · COINCIDENCIA ' + safe(result.confidence) + '</span><div>' + badges + '</div></div>' + (contextItems ? '<ul>' + contextItems + '</ul>' : '') + '</div><div class="jorge-situation"><span>QUÉ ESTÁ PASANDO</span><p>' + safe(result.happening) + '</p></div><section class="jorge-primary-answer"><h3>QUÉ PUEDES DECIR</h3><blockquote>“' + safe(result.response) + '”</blockquote><button type="button" data-copy="' + safe(result.response) + '">Copiar respuesta</button></section>' + (alternatives ? '<section class="jorge-alternatives"><h3>OTRAS FORMAS DE DECIRLO</h3><div>' + alternatives + '</div></section>' : '') + '<section class="jorge-question"><h3>PREGUNTA CLAVE</h3><button type="button" data-copy="' + safe(result.question) + '">“' + safe(result.question) + '”</button></section><section class="jorge-next"><div><span>SIGUIENTE MOVIMIENTO</span><strong>' + safe(result.next) + '</strong></div><div><span>OBJETIVO</span><strong>' + safe(result.objective) + '</strong></div></section>' + (result.avoid ? '<section class="jorge-operational-alert"><h3>ALERTA / EVITA</h3><p>' + safe(result.avoid) + '</p></section>' : '') + '<details class="jorge-strategy"><summary>Ver estrategia completa</summary><div>' + reasoning + sourceBlock + '</div></details><footer>Jorge orienta la gestión TMK. El ejecutivo comercial realiza la asesoría y la venta.</footer>';
  }
  async function submit(query) { const input = document.getElementById('jorge-query'); if (input && query != null) input.value = query; const value = query == null && input ? input.value : query; let result = null; if (global.JORGE_INTELLIGENCE_CLIENT) result = await global.JORGE_INTELLIGENCE_CLIENT.ask(value, getContext()); if (!result) result = analyze(value); else if (result.context) context = Object.assign(freshContext(), result.context); render(result); const panel = document.getElementById('jorge-result'); if (panel && panel.scrollIntoView) panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); if (input) input.value = ''; return result; }
  function init() {
    const form = document.getElementById('jorge-form'); if (!form) return; form.addEventListener('submit', (event) => { event.preventDefault(); submit(); });
    document.addEventListener('click', (event) => { const query = event.target.closest('[data-query]'); const copy = event.target.closest('[data-copy]'); if (query) submit(query.dataset.query); if (copy && navigator.clipboard) navigator.clipboard.writeText(copy.dataset.copy).then(() => { const original = copy.textContent; copy.textContent = 'Copiado'; setTimeout(() => { copy.textContent = original; }, 1200); }); });
    const resetButton = document.getElementById('jorge-reset'); if (resetButton) resetButton.addEventListener('click', () => { const cleanContext = reset(); if (global.JORGE_INTELLIGENCE_CLIENT) global.JORGE_INTELLIGENCE_CLIENT.reset(cleanContext.caseId); form.reset(); document.querySelector('.jorge-shell').classList.remove('has-result'); document.getElementById('jorge-result').innerHTML = ''; document.getElementById('jorge-query').focus(); });
  }
  global.JORGE_ENGINE = Object.freeze({ analyze, reset, getContext, normalize, conceptScores, detectIntents, version: 'PHASE_1_1.0.0' });
  global.JORGE_AI_ARCHITECTURE = Object.freeze({ mode: 'SERVER_RAG_WITH_LOCAL_FALLBACK', endpoint: '/api/jorge', retrieval: 'APPROVED_SOURCES_ONLY', sendsPersonalData: false, persistsSession: false, remoteAI: false, apiKeys: [] });
  if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', init);
})(typeof window !== 'undefined' ? window : globalThis);
