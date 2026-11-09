/* Reglas propias de Smart Mix. Importes y alternativas proceden del catálogo aprobado. */
(function (global) {
  "use strict";
  var CONDITIONS = Object.freeze(["PRECIO_AL_PUBLICO", "ALIANZA_MASIVA", "ALIANZA_EMPRESARIAL", "COLABORADOR"]);
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
  function minimumInitial(tariff, payments) {
    if (!tariff || !Number.isSafeInteger(payments) || payments < 2 || payments > tariff.numero_pagos) { return null; }
    return Number((BigInt(tariff.valor_total_oficial_cop) + BigInt(payments) - 1n) / BigInt(payments));
  }
  function flexibleTerm(tariff, initial, catalog) {
    var result = { valid: false, options: [], warning: "", error: "" };
    if (!tariff || !(catalog || []).includes(tariff)) { result.error = "Selecciona un plan oficial disponible."; return result; }
    if (tariff.numero_pagos === 1) { result.valid = true; return result; }
    for (var months = tariff.numero_pagos - 1; months >= 1; months -= 1) { result.options.push(months); }
    result.valid = Number.isSafeInteger(initial) && initial >= minimumInitial(tariff, tariff.numero_pagos) && initial < tariff.valor_total_oficial_cop;
    if (!result.valid) { result.error = "La cuota inicial debe cumplir el mínimo del plazo elegido y ser menor que el valor financiado."; }
    return result;
  }
  // Proyección condicional: nunca registra pagos como realizados ni altera el calendario financiado.
  function earlyPayment(tariff, calculation, days, catalog) {
    var result = { valid: false, error: "" };
    if (!tariff || tariff.numero_pagos === 1 || !calculation || !calculation.valid) { result.error = "Primero configura un acuerdo financiado válido."; return result; }
    if (![30,60].includes(days)) { result.error = "Selecciona un plazo de 30 o 60 días para Pronto Pago."; return result; }
    if (days === 60 && calculation.initialCop < 700000) { result.error = "La opción de 60 días requiere una cuota inicial de $700.000 o más."; return result; }
    var cash = alternatives(tariff, catalog).find(function(t) { return t.numero_pagos === 1; });
    if (!cash) { result.error = "No se encontró el precio de contado correspondiente."; return result; }
    if (calculation.initialCop > cash.valor_total_oficial_cop) { result.error = "Para ofrecer Pronto Pago, la cuota inicial no puede superar el precio de contado. Revisa el acuerdo antes de activar el beneficio."; return result; }
    var base = calculation.rows[0].dueDate;
    var date = new Date(base + "T12:00:00Z"); date.setUTCDate(date.getUTCDate() + days);
    var deadline = date.toISOString().slice(0,10), balance = cash.valor_total_oficial_cop - calculation.initialCop;
    var projections = [], completed = balance === 0 ? base : null;
    // Solo 60 días descuenta mensualidades proyectadas. A 30 días se completa el saldo directamente.
    (days === 60 ? calculation.rows.slice(1) : []).forEach(function(row) {
      if (row.dueDate > deadline || balance <= 0) { return; }
      var amount = Math.min(balance, row.valueCop); balance -= amount;
      projections.push({ date: row.dueDate, normalCop: row.valueCop, amountCop: amount, balanceCop: balance, completes: balance === 0 });
      if (balance === 0) { completed = row.dueDate; }
    });
    return { valid: true, days: days, baseDate: base, deadline: deadline, initialCop: calculation.initialCop,
      cashCop: cash.valor_total_oficial_cop, initialBalanceCop: cash.valor_total_oficial_cop - calculation.initialCop,
      projections: projections, remainingCop: balance, completionDate: completed,
      projectedTotalCop: calculation.initialCop + projections.reduce(function(sum,p) { return sum + p.amountCop; },0) + balance };
  }
  // La conciliación es compartida por el calendario y la referencia de negociación.
  function monthlyAgreement(balance, months) {
    var regular = roundDivide(balance, months);
    var last = balance - regular * (months - 1);
    if (last < 0) { regular = Math.floor(balance / months); last = balance - regular * (months - 1); }
    return { regular: regular, last: last, required: Math.max(regular, last) };
  }
  function negotiationOptions(tariff, initial, capacity, catalog) {
    var flex = flexibleTerm(tariff, initial, catalog);
    var hasCapacity = Number.isSafeInteger(capacity) && capacity > 0;
    var options = (flex.valid ? flex.options : []).map(function(months) {
      var amounts = monthlyAgreement(tariff.valor_total_oficial_cop - initial, months);
      return { months: months, payments: months + 1, monthly: amounts.regular,
        last: amounts.last, required: amounts.required, initialMinimum: minimumInitial(tariff, months + 1),
        initialValid: initial >= minimumInitial(tariff, months + 1),
        fits: hasCapacity ? initial >= minimumInitial(tariff, months + 1) && amounts.required <= capacity : null };
    });
    var viable = options.filter(function(option) { return option.fits; }).sort(function(a,b) { return a.months - b.months; });
    var lowest = options.slice().sort(function(a,b) { return a.required - b.required || a.months - b.months; });
    return { options: options, recommended: viable[0] || null, lowest: lowest[0] || null, hasCapacity: hasCapacity };
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
    if (packages.size !== 15 || keys.size !== 120 || CONDITIONS.some(function(condition) {
      var records = (catalog || []).filter(function(item) { return item.condicion_id === condition; });
      return records.length !== 30 || new Set(records.map(function(item) { return item.plan_id; })).size !== 15;
    })) { errors.push("El catálogo oficial está incompleto."); }
    return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors), counts: { total: keys.size, combinaciones: packages.size } });
  }
  global.SMART_MIX_CORE = Object.freeze({ CONDITIONS: CONDITIONS, roundDivide: roundDivide,
    minimumInitial: minimumInitial, earlyPayment: earlyPayment, alternatives: alternatives, flexibleTerm: flexibleTerm, monthlyAgreement: monthlyAgreement,
    negotiationOptions: negotiationOptions, linguaskillEligible: linguaskillEligible,
    validateCatalog: validateCatalog });
})(typeof window !== "undefined" ? window : globalThis);
