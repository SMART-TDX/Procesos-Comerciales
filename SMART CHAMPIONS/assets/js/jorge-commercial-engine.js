(function (global) {
  'use strict';

  const STOP_WORDS = new Set(['a', 'al', 'algo', 'con', 'de', 'del', 'el', 'en', 'es', 'esta', 'este', 'la', 'las', 'lo', 'los', 'me', 'mi', 'no', 'para', 'pero', 'por', 'que', 'se', 'si', 'su', 'un', 'una', 'y', 'ya']);

  function normalizeText(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9ñ\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeTmkInput(value) {
    if (global.TMK_INPUT_NORMALIZER && typeof global.TMK_INPUT_NORMALIZER.normalizeInput === 'function') {
      return global.TMK_INPUT_NORMALIZER.normalizeInput(value);
    }
    return { original: String(value || '').trim(), normalized: normalizeText(value), hadReportingPrefix: false };
  }

  function tokens(value) {
    return normalizeText(value).split(' ').filter((token) => token.length > 1 && !STOP_WORDS.has(token));
  }

  function unique(values) {
    return Array.from(new Set(values));
  }

  function phraseScore(text, expression) {
    const normalizedExpression = normalizeText(expression);
    if (!normalizedExpression) return 0;
    if (text === normalizedExpression) return 120 + normalizedExpression.length;
    if (text.includes(normalizedExpression)) return 90 + normalizedExpression.split(' ').length * 5;
    const expressionTokens = tokens(normalizedExpression);
    if (!expressionTokens.length) return 0;
    const textTokens = new Set(tokens(text));
    const matches = expressionTokens.filter((token) => textTokens.has(token)).length;
    const coverage = matches / expressionTokens.length;
    if (expressionTokens.length >= 2 && coverage === 1) return 72;
    if (expressionTokens.length >= 3 && coverage >= 0.67) return 54;
    return 0;
  }

  function cloneMemory(memory) {
    return JSON.parse(JSON.stringify(memory));
  }

  function createMemory() {
    return {
      turnos: [],
      familiasDetectadas: [],
      subfamiliasDetectadas: [],
      causasDescartadas: [],
      causasConfirmadas: [],
      preguntasRealizadas: [],
      argumentosUtilizados: [],
      objecionesSuperadas: [],
      objecionesPendientes: [],
      modalidad: null,
      ubicacion: [],
      disponibilidad: [],
      producto: null,
      necesidad: null,
      motivacion: null,
      decisor: null,
      citaPropuesta: false,
      persuasionDetenida: false
    };
  }

  function markContext(memory, normalized) {
    if (/\bpresencial\b/.test(normalized)) memory.modalidad = 'PRESENCIAL';
    if (/\bvirtual\b|\bonline\b|\bmeet\b/.test(normalized)) memory.modalidad = 'VIRTUAL';
    if (/\bsmart flex\b|\bflex\b/.test(normalized)) memory.producto = 'SMART_FLEX';
    if (/\bsmart online\b/.test(normalized)) memory.producto = 'SMART_ONLINE';
    if (/\bsuba\b/.test(normalized)) memory.ubicacion.push('Suba');
    if (/\bchapinero\b/.test(normalized)) memory.ubicacion.push('Chapinero');
    if (/despues de las? \d+|hasta las? \d+|sabado|domingo|fin de semana|noche|mañana|tarde/.test(normalized)) memory.disponibilidad.push(normalized);
    if (/esposa|esposo|pareja/.test(normalized)) memory.decisor = 'PAREJA';
    if (/padre|madre|mama|papa|papas|padres|acudiente/.test(normalized)) memory.decisor = 'PADRE_MADRE_ACUDIENTE';
    memory.ubicacion = unique(memory.ubicacion);
    memory.disponibilidad = unique(memory.disponibilidad);
  }

  function inferCauses(record, normalized, previousFamilies) {
    const causes = [];
    if (/otra academia|otro instituto|compar/.test(normalized)) causes.push('COMPARACION');
    if (/barat|cobra menos|cuesta menos/.test(normalized)) causes.push('PRECIO_COMPETENCIA');
    if (/presupuesto|no me alcanza|no tengo plata|no tengo dinero|ando corto|pelad/.test(normalized)) causes.push('PRESUPUESTO');
    if (/descuento|promocion|promoción/.test(normalized)) causes.push('DESCUENTO');
    if (/trabajo|ocupad|agenda/.test(normalized)) causes.push('JORNADA');
    if (/sabado|domingo|fin de semana|noche|despues de|hasta las/.test(normalized)) causes.push('HORARIO');
    if (/lejos|desplaz/.test(normalized)) causes.push('DESPLAZAMIENTO');
    if (/no aprendi|no aprendí|mala experiencia|perdi dinero|perdí dinero/.test(normalized)) causes.push('EXPERIENCIA_PREVIA');
    if (/esposa|esposo|pareja|padres|mama|papa/.test(normalized)) causes.push('DECISOR');
    if (/quiero aprender|si quiero|sí quiero|me interesa aprender/.test(normalized)) causes.push('INTERES_CONFIRMADO');
    if (previousFamilies.includes('PRECIO_PRESUPUESTO') && record.familia === 'COMPETENCIA') causes.push('PRECIO_COMPETENCIA');
    return unique(causes);
  }

  function detectRecords(text, bank) {
    const input = normalizeTmkInput(text);
    const normalized = normalizeText(input.normalized);
    const matches = [];
    bank.records.forEach((record) => {
      let score = 0;
      const expressions = [];
      record.expresiones.forEach((expression) => {
        const current = phraseScore(normalized, expression);
        if (current > score) score = current;
        if (current > 0) expressions.push(expression);
      });
      if (score > 0) matches.push({ record, score: score + record.prioridad, expressions });
    });
    if (global.TMK_INPUT_NORMALIZER && typeof global.TMK_INPUT_NORMALIZER.inferSignals === 'function') {
      const signalToRecord = {
        NO_CONTACTO: 'PRIVACIDAD_NO_CONTACTO', ORIGEN_DATO: 'PRIVACIDAD_ORIGEN', MOLESTIA_LLAMADAS: 'PRIVACIDAD_MOLESTIA',
        DESCONFIANZA: 'DESCONFIANZA_GENERAL', EXPERIENCIA: 'DESCONFIANZA_MALA_EXPERIENCIA', MODALIDAD_INDEFINIDA: 'MODALIDAD_INDEFINIDA',
        DINERO: 'PRECIO_GENERAL', TIEMPO: 'TIEMPO_GENERAL', HORARIO: 'HORARIO_RESTRINGIDO', UBICACION: 'UBICACION_DISTANCIA',
        COMPETENCIA: 'COMPETENCIA_COMPARACION', CERTIFICACION: 'EXAMEN_REQUISITO', INFORMACION: 'INFORMACION_WHATSAPP',
        DECISION: 'APLAZAMIENTO_PENSAR', INTERES: 'INTERES_CONFIRMADO', DUDA_GENERAL: 'PERFILAMIENTO_INDECISO'
      };
      global.TMK_INPUT_NORMALIZER.inferSignals(input).forEach((signal) => {
        const id = signalToRecord[signal.signal];
        if (!id || matches.some((match) => match.record.id === id)) return;
        const record = bank.records.find((candidate) => candidate.id === id);
        if (record) matches.push({ record, score: record.prioridad + 58, expressions: [`SEÑAL:${signal.signal}`] });
      });
    }
    matches.sort((a, b) => b.score - a.score || b.record.prioridad - a.record.prioridad);
    if (!matches.length) return [];
    const top = matches[0].score;
    return matches.filter((match, index) => index < 6 && (match.score >= top - 42 || match.record.familia === 'CUMPLIMIENTO'));
  }

  function chooseUnused(items, used, fallback) {
    if (!items || !items.length) return fallback || null;
    const found = items.find((entry) => !used.includes(entry.contenido));
    return found || items[0];
  }

  function supportArguments(record, memory) {
    const usableOfficial = record.argumentosOficiales.filter((entry) => !String(entry.condiciones || '').startsWith('NO_USAR'));
    const official = chooseUnused(usableOfficial, memory.argumentosUtilizados);
    const complement = chooseUnused(record.argumentosComplementarios, memory.argumentosUtilizados);
    if (record.esCumplimiento) return complement || official;
    return official || complement;
  }

  function nextQuestion(record, memory, probableCauses) {
    if (record.detienePersuasion) return null;
    const unanswered = record.preguntasDescubrimiento.find((entry) => !memory.preguntasRealizadas.includes(entry.contenido));
    if (unanswered && (record.causasPosibles.length > 1 || probableCauses.length === 0)) return unanswered;
    return chooseUnused(record.preguntasControl, memory.preguntasRealizadas);
  }

  function processTurn(text, memory, bank) {
    const state = memory ? cloneMemory(memory) : createMemory();
    const input = normalizeTmkInput(text);
    const normalized = normalizeText(input.normalized);
    const matches = detectRecords(text, bank);
    const previousFamilies = state.familiasDetectadas.slice();
    markContext(state, normalized);

    if (!matches.length) {
      const fallbackSignals = global.TMK_INPUT_NORMALIZER && global.TMK_INPUT_NORMALIZER.inferSignals ? global.TMK_INPUT_NORMALIZER.inferSignals(input) : [];
      const fallbackQuestion = fallbackSignals.some((signal) => signal.family === 'MODALIDAD')
        ? '¿Prefiere estudiar desde casa o le interesa asistir a una sede?'
        : fallbackSignals.some((signal) => signal.family === 'CONFIANZA')
          ? '¿Qué es lo que le genera mayor duda: la metodología, la modalidad, el acompañamiento o la institución?'
          : '¿Qué fue lo que inicialmente le llamó la atención cuando solicitó información?';
      state.turnos.push({ cliente: text, entradaNormalizada: input.normalized, detectado: [], resultado: 'REQUIERE_ACLARACION' });
      return {
        entradaOriginal: input.original,
        entradaNormalizada: input.normalized,
        tipoSituacion: 'CONSULTA_POR_ACLARAR',
        familiaDetectada: fallbackSignals.map((signal) => signal.family),
        subfamiliaDetectada: [],
        posiblesCausas: fallbackSignals.map((signal) => signal.signal),
        preguntaRecomendada: { contenido: fallbackQuestion, origen: 'COMPLEMENTO_JORGE' },
        respuestaPrincipal: { contenido: 'Perfecto, antes de orientarlo quiero identificar mejor qué necesita.', origen: 'COMPLEMENTO_JORGE' },
        siInsiste: null,
        puenteCita: null,
        fuentesUtilizadas: [],
        memoria: state,
        coincidencias: []
      };
    }

    const primary = matches[0].record;
    const detectedFamilies = unique(matches.map((match) => match.record.familia));
    const detectedSubfamilies = unique(matches.map((match) => match.record.subfamilia));
    state.familiasDetectadas = unique(state.familiasDetectadas.concat(detectedFamilies));
    state.subfamiliasDetectadas = unique(state.subfamiliasDetectadas.concat(detectedSubfamilies));
    const probableCauses = inferCauses(primary, normalized, previousFamilies);
    state.causasConfirmadas = unique(state.causasConfirmadas.concat(probableCauses));
    state.objecionesPendientes = unique(state.objecionesPendientes.concat(detectedFamilies.filter((family) => !['CUMPLIMIENTO', 'ENRUTAMIENTO', 'EXAMENES'].includes(family))));

    if (primary.detienePersuasion) state.persuasionDetenida = true;
    const question = nextQuestion(primary, state, probableCauses);
    const principal = supportArguments(primary, state);
    const insist = chooseUnused(primary.siInsiste, state.argumentosUtilizados);
    const bridge = primary.detienePersuasion ? null : chooseUnused(primary.puentesCita, state.argumentosUtilizados);

    if (question) state.preguntasRealizadas.push(question.contenido);
    if (principal) state.argumentosUtilizados.push(principal.contenido);
    if (bridge) state.citaPropuesta = true;
    state.preguntasRealizadas = unique(state.preguntasRealizadas);
    state.argumentosUtilizados = unique(state.argumentosUtilizados);
    state.turnos.push({
      cliente: text,
      entradaNormalizada: input.normalized,
      detectado: detectedSubfamilies,
      causas: probableCauses,
      pregunta: question ? question.contenido : null,
      argumento: principal ? principal.contenido : null
    });

    return {
      entradaOriginal: input.original,
      entradaNormalizada: input.normalized,
      tipoSituacion: primary.tipoSituacion,
      familiaDetectada: detectedFamilies,
      subfamiliaDetectada: detectedSubfamilies,
      posiblesCausas: probableCauses.length ? probableCauses : primary.posiblesSignificados,
      preguntaRecomendada: question,
      respuestaPrincipal: principal,
      siInsiste: insist,
      puenteCita: bridge,
      cierreCita: primary.detienePersuasion ? null : chooseUnused(primary.cierresCita, state.argumentosUtilizados),
      fuentesUtilizadas: primary.fuentes,
      requiereValidacion: primary.requiereValidacion,
      detienePersuasion: primary.detienePersuasion,
      memoria: state,
      coincidencias: matches.map((match) => ({ id: match.record.id, familia: match.record.familia, subfamilia: match.record.subfamilia, score: match.score }))
    };
  }

  function wordSimilarity(a, b) {
    const left = new Set(tokens(a));
    const right = new Set(tokens(b));
    if (!left.size || !right.size) return 0;
    let intersection = 0;
    left.forEach((token) => { if (right.has(token)) intersection += 1; });
    return intersection / new Set([...left, ...right]).size;
  }

  function auditBank(bank) {
    const errors = [];
    const ids = new Set();
    bank.records.forEach((record) => {
      if (ids.has(record.id)) errors.push({ type: 'DUPLICATE_ID', id: record.id });
      ids.add(record.id);
      const required = ['id', 'familia', 'subfamilia', 'tipoSituacion', 'expresiones', 'posiblesSignificados', 'causasPosibles', 'preguntasDescubrimiento', 'argumentosOficiales', 'argumentosComplementarios', 'siInsiste', 'preguntasControl', 'puentesCita', 'cierresCita', 'queEvitar', 'fuentes', 'esContenidoOficial', 'requiereValidacion', 'esCumplimiento', 'detienePersuasion', 'dominiosApoyo'];
      required.forEach((field) => { if (!(field in record)) errors.push({ type: 'MISSING_FIELD', id: record.id, field }); });
    });

    const principals = [];
    bank.records.forEach((record) => {
      const argument = record.argumentosOficiales[0] || record.argumentosComplementarios[0];
      if (argument) principals.push({ id: record.id, family: record.familia, content: argument.contenido });
    });
    for (let i = 0; i < principals.length; i += 1) {
      for (let j = i + 1; j < principals.length; j += 1) {
        if (principals[i].family === principals[j].family) continue;
        const exact = normalizeText(principals[i].content) === normalizeText(principals[j].content);
        const similarity = wordSimilarity(principals[i].content, principals[j].content);
        if (exact || similarity >= 0.78) errors.push({ type: 'REPEATED_RESPONSE', left: principals[i].id, right: principals[j].id, similarity });
      }
    }
    return { ok: errors.length === 0, errors, records: bank.records.length };
  }

  global.JorgeCommercialEngine = Object.freeze({
    normalizeText,
    normalizeTmkInput,
    createMemory,
    detectRecords,
    processTurn,
    auditBank,
    wordSimilarity
  });
})(typeof window !== 'undefined' ? window : globalThis);
