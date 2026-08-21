(function (global) {
  'use strict';

  const phaseOneActive = Boolean(global.JORGE_PHASE1_ACTIVE);

  const knowledge = global.JORGE_KNOWLEDGE || { records: [] };
  const state = { lastIntent: null, lastCategory: null, lastRoute: null, turns: [], activeIntents: [], signals: {} };
  const stopWords = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'que', 'de', 'del', 'me', 'mi', 'se', 'y', 'o', 'a', 'por', 'para', 'con', 'dice', 'cliente']);

  function normalize(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function tokens(value) {
    return normalize(value).split(' ').filter((token) => token.length > 2 && !stopWords.has(token)).map(stem);
  }

  function stem(token) {
    const equivalents = {
      precios: 'precio', presio: 'precio', presios: 'precio', costos: 'costo', valores: 'valor', tarifas: 'tarifa',
      sabados: 'sabado', horarios: 'horario', sedes: 'sede', llamadas: 'llamada', estudios: 'estudio',
      virtuales: 'virtual', presenciales: 'presencial', papas: 'padre', padres: 'padre', plata: 'dinero'
    };
    if (equivalents[token]) return equivalents[token];
    if (token.length > 7 && token.endsWith('ando')) return token.slice(0, -4);
    if (token.length > 7 && token.endsWith('iendo')) return token.slice(0, -5);
    if (token.length > 6 && token.endsWith('es')) return token.slice(0, -2);
    if (token.length > 5 && token.endsWith('s')) return token.slice(0, -1);
    return token;
  }

  function distance(a, b) {
    const row = Array.from({ length: b.length + 1 }, (_, index) => index);
    for (let i = 1; i <= a.length; i += 1) {
      let previous = row[0];
      row[0] = i;
      for (let j = 1; j <= b.length; j += 1) {
        const current = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
        previous = current;
      }
    }
    return row[b.length];
  }

  function fuzzyTokenMatch(left, right) {
    if (left === right) return 1;
    const limit = Math.max(left.length, right.length) >= 7 ? 2 : 1;
    return distance(left, right) <= limit ? 0.72 : 0;
  }

  function scoreRecord(query, record) {
    const clean = normalize(query);
    const queryTokens = tokens(clean);
    let score = 0;
    let bestTrigger = '';
    record.triggers.forEach((trigger) => {
      const cleanTrigger = normalize(trigger);
      let candidate = 0;
      if (clean === cleanTrigger) candidate += 120;
      else if (clean.includes(cleanTrigger)) candidate += 82 + cleanTrigger.length;
      else if (cleanTrigger.includes(clean) && clean.length >= 5) candidate += 42 + clean.length;
      const triggerTokens = tokens(cleanTrigger);
      triggerTokens.forEach((triggerToken) => {
        const match = queryTokens.reduce((best, queryToken) => Math.max(best, fuzzyTokenMatch(queryToken, triggerToken)), 0);
        candidate += match * (triggerToken.length >= 7 ? 8 : 5);
      });
      if (candidate > score) {
        score = candidate;
        bestTrigger = trigger;
      }
    });
    if (state.lastCategory === record.category && clean.split(' ').length <= 7) score += 4;
    return { record, score, bestTrigger };
  }

  function explicitRoute(query) {
    const clean = normalize(query);
    if (/no (me )?(llamen|contacten)|no volver a llamar|eliminar mis datos/.test(clean)) return 'NONE';
    if (/presencial|sede|en persona/.test(clean) && !/no (quiero|puedo|me sirve).*presencial/.test(clean)) return 'PRESENCIAL';
    if (/meet|videollamada|virtual|desde casa|no (quiero|puedo|me sirve).*presencial/.test(clean)) return 'GOOGLE_MEET';
    if (/telefono|telefonica|llamada/.test(clean)) return 'TELEFONICA';
    return null;
  }

  function updateSignals(query) {
    const clean = normalize(query);
    if (/molesto|bravo|cansado|mamado|incomodo/.test(clean)) state.signals.emotion = 'MOLESTIA';
    if (/no me llamen|no vuelva[n]? a llamar|no me contacten|dejen de llamar/.test(clean)) state.signals.noContact = true;
    if (/virtual|meet|internet|desde casa/.test(clean)) state.signals.modality = 'GOOGLE_MEET';
    if (/presencial|sede|en persona/.test(clean) && !/no .*presencial|no quiere .*sede/.test(clean)) state.signals.modality = 'PRESENCIAL';
    if (/telefono|telefonica|llamada/.test(clean)) state.signals.modality = 'TELEFONICA';
    if (/sabado|noche|manana|tarde|horario|disponibilidad/.test(clean)) state.signals.availability = true;
    if (/precio|presio|valor|costo|tarifa|plata|dinero|presupuesto|caro/.test(clean)) state.signals.budget = true;
    if (/otra academia|otra institucion|ya estudia|ya estoy estudiando/.test(clean)) state.signals.currentInstitution = true;
    if (/interesado|quiere conocer|quiere estudiar/.test(clean)) state.signals.interest = true;
    const city = clean.match(/\b(bogota|medellin|cali|barranquilla|bucaramanga|cartagena|pereira|manizales|armenia|ibague|cucuta)\b/);
    if (city) state.signals.city = city[1];
  }

  function profileFor(intent) {
    const profiles = knowledge.profiles || {};
    return profiles[intent] || profiles.default || { why: '', actions: [] };
  }

  function nextStepFor(intent, route) {
    const steps = {
      'data-origin': 'No discutas ni afirmes el origen del dato. Registra la inquietud y valida el procedimiento interno.',
      'privacy-authorization': 'Registra la inquietud y aplica el procedimiento institucional de privacidad y autorización.',
      'contact-fatigue': 'Reconoce la molestia y confirma si solicita finalizar o no volver a ser contactado.',
      'do-not-contact': 'Finaliza con respeto y aplica el procedimiento institucional de no contacto.',
      'personal-situation': 'Da espacio y pregunta si desea acordar un seguimiento; no presiones una cita.',
      'competitor': 'Comprende qué valora y busca una necesidad no cubierta antes de proponer una asesoría.',
      'open-situation': 'Profundiza con una pregunta abierta y valida cualquier dato factual en la fuente oficial.'
    };
    return steps[intent] || ({ PRESENCIAL: 'Si existe interés, propón primero una cita presencial.', GOOGLE_MEET: 'Respeta la preferencia y orienta la asesoría por Google Meet.', TELEFONICA: 'Acordar una asesoría telefónica en un horario concreto.', NONE: 'Comprende y aplica el procedimiento correspondiente antes de continuar.' }[route]);
  }

  function openSituationResult() {
    const profile = profileFor('default');
    return {
      status: 'ANSWER', intent: 'open-situation', category: 'SITUACIÓN ABIERTA', label: 'Situación abierta',
      responses: [
        { style: 'NATURAL', text: 'Entiendo. Para orientarte bien, cuéntame qué es lo que más le preocupa al cliente en este momento.' },
        { style: 'CONSULTIVA', text: 'Gracias por contármelo. Antes de responder de fondo, valida qué necesita aclarar o qué espera que hagamos.' }
      ],
      questions: ['¿Qué es lo que más te preocupa en este momento?', '¿Hay algo específico que todavía no tengas claro?', '¿Qué esperas que hagamos después de esta conversación?'],
      route: 'NONE', contextLabels: state.activeIntents.map((id) => (knowledge.records.find((item) => item.id === id) || {}).label).filter(Boolean),
      source: 'TMK_COMPLEMENTARY', matrixSource: null, why: profile.why, actions: profile.actions,
      nextStep: nextStepFor('open-situation', 'NONE')
    };
  }

  function analyze(query) {
    const clean = normalize(query);
    if (!clean) return { status: 'EMPTY', message: 'Cuéntame qué te está diciendo el cliente.' };
    updateSignals(clean);
    const ranked = knowledge.records.map((record) => scoreRecord(clean, record)).sort((a, b) => b.score - a.score);
    const winner = ranked[0];
    if (!winner || winner.score < 11) {
      state.turns.push({ query, intent: null });
      state.turns = state.turns.slice(-8);
      return openSituationResult();
    }
    const record = winner.record;
    const route = explicitRoute(clean) || record.route;
    if (record.id === 'do-not-contact' || record.id === 'not-interested') state.activeIntents = [];
    const relatedRecords = ranked.filter((match) => match.score >= 20 && match.score >= winner.score * 0.55).slice(0, 3).map((match) => match.record);
    relatedRecords.forEach((item) => { if (!state.activeIntents.includes(item.id)) state.activeIntents.push(item.id); });
    if (!state.activeIntents.includes(record.id)) state.activeIntents.push(record.id);
    state.activeIntents = state.activeIntents.slice(-4);
    state.lastIntent = record.id;
    state.lastCategory = record.category;
    state.lastRoute = route;
    state.turns.push({ query, intent: record.id });
    state.turns = state.turns.slice(-8);
    const contextRecords = state.activeIntents.map((id) => knowledge.records.find((item) => item.id === id)).filter(Boolean);
    const combinedQuestions = contextRecords.slice().reverse().flatMap((item) => item.questions).filter((item, index, all) => all.indexOf(item) === index).slice(0, 3);
    const profile = profileFor(record.id);
    return {
      status: 'ANSWER', intent: record.id, category: record.category, label: record.label,
      responses: record.responses, questions: combinedQuestions, route,
      contextLabels: contextRecords.map((item) => item.label),
      source: record.source, matrixSource: record.matrixSource, matchedTrigger: winner.bestTrigger,
      why: profile.why, actions: profile.actions, nextStep: nextStepFor(record.id, route)
    };
  }

  function resultForId(id) {
    const record = knowledge.records.find((item) => item.id === id);
    if (!record) return null;
    state.lastIntent = record.id;
    state.lastCategory = record.category;
    state.lastRoute = record.route;
    return { status: 'ANSWER', intent: record.id, category: record.category, label: record.label, responses: record.responses, questions: record.questions, route: record.route, source: record.source, matrixSource: record.matrixSource };
  }

  function reset() {
    state.lastIntent = null; state.lastCategory = null; state.lastRoute = null; state.turns = []; state.activeIntents = []; state.signals = {};
  }

  function safe(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  const routeLabels = { PRESENCIAL: 'Agenda una cita presencial', GOOGLE_MEET: 'Agenda una asesoría por Google Meet', TELEFONICA: 'Agenda una asesoría telefónica', NONE: 'Finaliza y registra la gestión' };

  function render(result) {
    const panel = document.getElementById('jorge-result');
    const shell = document.querySelector('.jorge-shell');
    if (!panel || !shell) return;
    if (result.status === 'EMPTY') return;
    shell.classList.add('has-result');
    if (result.status === 'CLARIFY') {
      panel.innerHTML = '<div class="jorge-clarify"><span>CUÉNTAME UN POCO MÁS</span><h2>' + safe(result.message) + '</h2></div>';
      return;
    }
    const responses = result.responses.map((item, index) => '<article class="jorge-answer"><header><span>OPCIÓN ' + String(index + 1).padStart(2, '0') + ' · ' + safe(item.style) + '</span><button type="button" data-copy="' + safe(item.text) + '" aria-label="Copiar respuesta">Copiar</button></header><blockquote>“' + safe(item.text) + '”</blockquote></article>').join('');
    const questions = result.questions.map((item) => '<button type="button" data-copy="' + safe(item) + '">“' + safe(item) + '”</button>').join('');
    const actions = (result.actions || []).map((item) => '<button type="button" data-context-query="' + safe(item[1]) + '">' + safe(item[0]) + '</button>').join('');
    const context = result.contextLabels && result.contextLabels.length > 1 ? '<div class="jorge-context"><span>CONTEXTO DE ESTA CONVERSACIÓN</span><strong>' + result.contextLabels.map(safe).join(' · ') + '</strong></div>' : '';
    const why = result.why ? '<aside class="jorge-why"><span>¿POR QUÉ FUNCIONA?</span><p>' + safe(result.why) + '</p></aside>' : '';
    const actionBlock = actions ? '<section class="jorge-actions"><h3>ACCIONES CONTEXTUALES</h3><div>' + actions + '</div></section>' : '';
    panel.innerHTML = context + '<div class="jorge-result-head"><span>JORGE TE RECOMIENDA</span><h2>Elige la respuesta que suene más natural para tu llamada.</h2></div>' + why + '<section><h3>PUEDES DECIR</h3><div class="jorge-answer-grid">' + responses + '</div></section><section class="jorge-followup"><h3>¿CÓMO PUEDES CONTINUAR?</h3><div>' + questions + '</div></section><section class="jorge-route"><span>SIGUIENTE PASO</span><strong>' + safe(result.nextStep || routeLabels[result.route] || routeLabels.PRESENCIAL) + '</strong></section>' + actionBlock + '<footer>Orientación para gestión TMK</footer>';
  }

  function submit(query) {
    const input = document.getElementById('jorge-query');
    if (input && query != null) input.value = query;
    const value = query == null && input ? input.value : query;
    render(analyze(value));
  }

  function init() {
    const form = document.getElementById('jorge-form');
    if (!form) return;
    form.addEventListener('submit', (event) => { event.preventDefault(); submit(); });
    document.addEventListener('click', (event) => {
      const query = event.target.closest('[data-query]');
      const contextQuery = event.target.closest('[data-context-query]');
      const copy = event.target.closest('[data-copy]');
      if (query) submit(query.dataset.query);
      if (contextQuery) submit(contextQuery.dataset.contextQuery);
      if (copy && navigator.clipboard) navigator.clipboard.writeText(copy.dataset.copy).then(() => { copy.textContent = 'Copiado'; setTimeout(() => { copy.textContent = 'Copiar'; }, 1200); });
    });
    document.getElementById('jorge-reset').addEventListener('click', () => { reset(); form.reset(); document.querySelector('.jorge-shell').classList.remove('has-result'); document.getElementById('jorge-result').innerHTML = ''; document.getElementById('jorge-query').focus(); });
  }

  const legacyEngine = Object.freeze({ analyze, resultForId, reset, records: knowledge.records, state });
  global.JORGE_LEGACY_ENGINE = legacyEngine;
  if (!phaseOneActive) global.JORGE_ENGINE = legacyEngine;
  if (!phaseOneActive) global.JORGE_AI_ARCHITECTURE = Object.freeze({ mode: 'LOCAL_ONLY', futureMode: 'REQUIRES_EXPLICIT_CONFIGURATION', sendsPersonalData: false, apiKeys: [] });
  if (!phaseOneActive && typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', init);
})(typeof window !== 'undefined' ? window : globalThis);
