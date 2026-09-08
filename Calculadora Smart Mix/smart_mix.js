/* Reglas propias de Smart Mix. Importes y alternativas proceden del catálogo aprobado. */
(function (global) {
  "use strict";
  var CONDITIONS = Object.freeze(["PRECIO_AL_PUBLICO", "ALIANZA_MASIVA", "ALIANZA_EMPRESARIAL"]);
  function roundDivide(numerator, denominator) {
    if (!Number.isSafeInteger(numerator) || numerator < 0 || !Number.isSafeInteger(denominator) || denominator < 1) {
      throw new Error("Importe o divisor inválido.");
    }
    return Number((BigInt(numerator) * 2n + BigInt(denominator)) / (BigInt(denominator) * 2n));
  }
  function alternatives(tariff, catalog) {
    return (catalog || []).filter(function (item) {
      return item.plan_id === tariff.plan_id && item.condicion_id === tariff.condicion_id;
    }).sort(function (a, b) { return a.numero_pagos - b.numero_pagos; });
  }
  function flexibleTerm(tariff, initial, catalog) {
    var result = { valid: false, options: [], warning: "", error: "" };
    if (!tariff || !(catalog || []).includes(tariff)) {
      result.error = "Selecciona un plan oficial disponible.";
      return result;
    }
    if (tariff.numero_pagos === 1) { result.valid = true; return result; }
    if (!Number.isSafeInteger(initial) || initial < tariff.cuota_inicial_minima_cop) {
      result.error = "La cuota inicial propuesta no cumple las condiciones autorizadas para este plan.";
      return result;
    }
    var plans = alternatives(tariff, catalog);
    var shorter = plans.filter(function (plan) { return plan.numero_pagos < tariff.numero_pagos; });
    var previous = shorter[shorter.length - 1];
    if (previous && previous.valor_total_oficial_cop < tariff.valor_total_oficial_cop &&
        BigInt(initial) * 10n >= BigInt(previous.valor_total_oficial_cop) * 9n) {
      result.warning = initial >= previous.valor_total_oficial_cop
        ? "La cuota inicial propuesta alcanza o supera el valor de la alternativa oficial de menor plazo. Revisa esa alternativa antes de continuar; el plan seleccionado no se cambia automáticamente."
        : "La cuota inicial propuesta se acerca al valor de una alternativa oficial de menor plazo y menor precio. Conviene evaluarla; el plan seleccionado no se cambia automáticamente.";
      result.warningLevel = initial >= previous.valor_total_oficial_cop ? "strong" : "notice";
    }
    if (initial >= tariff.valor_total_oficial_cop) {
      result.error = "Revisa una alternativa oficial de contado para pagar el valor completo.";
      return result;
    }
    var longest = plans[plans.length - 1] === tariff;
    var compare = longest && previous && previous.numero_pagos > 1;
    var minimum = tariff.numero_pagos === 2 ? 1 : 2;
    var previousBalance = compare ? previous.valor_total_oficial_cop - initial : 0;
    for (var months = tariff.numero_pagos - 1; months >= minimum; months -= 1) {
      var monthly = roundDivide(tariff.valor_total_oficial_cop - initial, months);
      if (compare && (previousBalance <= 0 || monthly >= roundDivide(previousBalance, previous.numero_pagos - 1))) {
        continue;
      }
      result.options.push(months);
    }
    result.valid = result.options.length > 0;
    if (!result.valid) {
      result.error = "Con esta cuota inicial, evalúa el plan oficial de menor plazo. No hay mensualidades disponibles para mantener esta alternativa.";
    }
    return result;
  }
  function linguaskillEligible(tariff) {
    return Boolean(tariff && tariff.numero_modulos >= 2 &&
      tariff.modulos_incluidos.some(function (module) { return ["Flow", "Plus", "Pro"].includes(module); }));
  }
  function validateCatalog(catalog) {
    var errors = [];
    var keys = new Set();
    var packages = new Set();
    (catalog || []).forEach(function (item) {
      var key = [item.plan_id, item.condicion_id, item.numero_pagos].join("|");
      if (keys.has(key) || item.idioma_id !== "INGLES" || item.producto_id !== "SMART_MIX" || !CONDITIONS.includes(item.condicion_id)) {
        errors.push("Registro no autorizado o duplicado.");
      }
      keys.add(key);
      packages.add(item.plan_id);
      ["numero_pagos", "numero_modulos", "horas_academicas", "valor_full_oficial_cop", "valor_total_oficial_cop", "cuota_inicial_minima_cop"].forEach(function (field) {
        if (!Number.isSafeInteger(item[field]) || item[field] <= 0) { errors.push("Dato oficial inválido."); }
      });
      if (!Array.isArray(item.modulos_incluidos) || item.modulos_incluidos.length !== item.numero_modulos) { errors.push("Módulos inconsistentes."); }
    });
    if (packages.size !== 15 || keys.size !== 120) { errors.push("El catálogo oficial está incompleto."); }
    return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors), counts: { total: keys.size, combinaciones: packages.size } });
  }
  global.SMART_MIX_CORE = Object.freeze({ CONDITIONS: CONDITIONS, roundDivide: roundDivide,
    alternatives: alternatives, flexibleTerm: flexibleTerm, linguaskillEligible: linguaskillEligible,
    validateCatalog: validateCatalog });
})(typeof window !== "undefined" ? window : globalThis);
