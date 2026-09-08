(function (global) {
  "use strict";

  var VIGENCIA_COTIZACION_HORAS = 48;
  var TIME_ZONE = "America/Bogota";
  var DISCLAIMER = "Los valores, descuentos y beneficios están sujetos a validación, disponibilidad y formalización dentro del periodo de vigencia de esta cotización.";
  var PROJECTED_PAYMENT_DISCLAIMER = "Las fechas de este plan de pagos son estimadas y se calculan con base en la fecha proyectada de confirmación del pago inicial. Si la matrícula o la confirmación efectiva del pago ocurre en una fecha diferente, el calendario será recalculado y podrán variar las fechas de vencimiento. El plan definitivo será el formalizado en los documentos contractuales.";
  var PROJECTED_PAYMENT_DISCLAIMER_SHORT = "Las fechas del plan son proyectadas y podrán recalcularse si cambia la fecha efectiva de confirmación del pago inicial.";
  var SHARE_CONTEXTS = Object.freeze([
    Object.freeze({ id: "SEGUIMIENTO_GENERAL", label: "Seguimiento general" }),
    Object.freeze({ id: "LO_VA_A_PENSAR", label: "El cliente lo va a pensar" }),
    Object.freeze({ id: "CONSULTA_PAREJA_FAMILIA", label: "Lo consultará con pareja o familia" }),
    Object.freeze({ id: "REVISA_PRESUPUESTO", label: "Revisará su presupuesto" }),
    Object.freeze({ id: "COMPARA_ALTERNATIVAS", label: "Está comparando alternativas" }),
    Object.freeze({ id: "LISTO_PARA_AVANZAR", label: "Está listo para avanzar" })
  ]);
  var DEFAULT_SHARE_CONTEXT = "SEGUIMIENTO_GENERAL";
  var WHATSAPP_RESPONSE_OPTIONS = Object.freeze([
    "Quiero empezar", "Queremos avanzar", "Revisemos mi plan", "Listo para matricularme",
    "Actualizar propuesta", "Validar beneficios"
  ]);
  const SMART_EMOJIS = Object.freeze({
    saludo: String.fromCodePoint(0x1F44B),
    programa: String.fromCodePoint(0x1F4DA),
    pago: String.fromCodePoint(0x1F4B3),
    dinero: String.fromCodePoint(0x1F4B0),
    beneficios: String.fromCodePoint(0x1F381),
    vigencia: String.fromCodePoint(0x23F3),
    cierre: String.fromCodePoint(0x1F64C),
    aprobado: String.fromCodePoint(0x2705)
  });
  var WHATSAPP_EMOJIS = SMART_EMOJIS;
  var PHONE_COUNTRIES = Object.freeze([
    Object.freeze({ iso: "CO", name: "Colombia", dialCode: "57" }),
    Object.freeze({ iso: "US", name: "Estados Unidos", dialCode: "1" }),
    Object.freeze({ iso: "CA", name: "Canadá", dialCode: "1" }),
    Object.freeze({ iso: "MX", name: "México", dialCode: "52" }),
    Object.freeze({ iso: "PE", name: "Perú", dialCode: "51" }),
    Object.freeze({ iso: "EC", name: "Ecuador", dialCode: "593" }),
    Object.freeze({ iso: "AR", name: "Argentina", dialCode: "54" }),
    Object.freeze({ iso: "CL", name: "Chile", dialCode: "56" }),
    Object.freeze({ iso: "VE", name: "Venezuela", dialCode: "58" }),
    Object.freeze({ iso: "BR", name: "Brasil", dialCode: "55" }),
    Object.freeze({ iso: "BO", name: "Bolivia", dialCode: "591" }),
    Object.freeze({ iso: "PY", name: "Paraguay", dialCode: "595" }),
    Object.freeze({ iso: "UY", name: "Uruguay", dialCode: "598" }),
    Object.freeze({ iso: "PA", name: "Panamá", dialCode: "507" }),
    Object.freeze({ iso: "CR", name: "Costa Rica", dialCode: "506" }),
    Object.freeze({ iso: "GT", name: "Guatemala", dialCode: "502" }),
    Object.freeze({ iso: "SV", name: "El Salvador", dialCode: "503" }),
    Object.freeze({ iso: "HN", name: "Honduras", dialCode: "504" }),
    Object.freeze({ iso: "NI", name: "Nicaragua", dialCode: "505" }),
    Object.freeze({ iso: "DO", name: "República Dominicana", dialCode: "1" }),
    Object.freeze({ iso: "PR", name: "Puerto Rico", dialCode: "1" }),
    Object.freeze({ iso: "OTHER", name: "Otro país", dialCode: "" })
  ]);
  var currencyFormatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  var integerFormatter = new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 0
  });

  function formatCOP(value) {
    var number = Number(value);
    if (!Number.isSafeInteger(number)) {
      return "$0";
    }
    return currencyFormatter.format(number).replace(/\s/g, "");
  }

  function formatInteger(value) {
    return integerFormatter.format(Number(value) || 0);
  }

  function formatPercentExact(decimalText) {
    var source = String(decimalText == null ? "0" : decimalText).trim().replace(",", ".");
    var negative = source.charAt(0) === "-";
    if (negative) {
      source = source.slice(1);
    }
    var parts = source.split(".");
    var whole = parts[0] || "0";
    var fraction = parts[1] || "";
    var digits = (whole + fraction).replace(/^0+(?=\d)/, "") || "0";
    var scale = fraction.length - 2;
    if (scale < 0) {
      digits += "0".repeat(-scale);
      scale = 0;
    }
    var raw = BigInt(digits).toString();
    if (scale > 0) {
      raw = raw.padStart(scale + 1, "0");
    }
    var integerPart = scale > 0 ? raw.slice(0, -scale) : raw;
    var decimalPart = scale > 0 ? raw.slice(-scale) : "";
    decimalPart = decimalPart.padEnd(2, "0");
    while (decimalPart.length > 2 && decimalPart.endsWith("0")) {
      decimalPart = decimalPart.slice(0, -1);
    }
    return (negative ? "-" : "") + integerPart + "," + decimalPart + " %";
  }

  function parseCOPInput(value) {
    var digits = String(value == null ? "" : value).replace(/[^\d]/g, "");
    if (!digits) {
      return null;
    }
    var parsed = Number(digits);
    return Number.isSafeInteger(parsed) ? parsed : null;
  }

  function roundDivideCOP(numerator, denominator) {
    if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || numerator < 0 || denominator <= 0) {
      throw new Error("División monetaria inválida.");
    }
    var n = BigInt(numerator);
    var d = BigInt(denominator);
    return Number(((n * 2n) + d) / (d * 2n));
  }

  function parseISODate(isoDate) {
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(isoDate || ""));
    if (!match) {
      return null;
    }
    return {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3])
    };
  }

  function isoFromUTCDate(date) {
    return [
      String(date.getUTCFullYear()).padStart(4, "0"),
      String(date.getUTCMonth() + 1).padStart(2, "0"),
      String(date.getUTCDate()).padStart(2, "0")
    ].join("-");
  }

  function addDaysISO(isoDate, days) {
    var parsed = parseISODate(isoDate);
    if (!parsed) {
      return "";
    }
    var date = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day));
    date.setUTCDate(date.getUTCDate() + Number(days));
    return isoFromUTCDate(date);
  }

  function daysBetweenISO(startISO, endISO) {
    var start = parseISODate(startISO);
    var end = parseISODate(endISO);
    if (!start || !end) {
      return null;
    }
    var startMs = Date.UTC(start.year, start.month - 1, start.day);
    var endMs = Date.UTC(end.year, end.month - 1, end.day);
    return Math.round((endMs - startMs) / 86400000);
  }

  function daysInMonthUTC(year, monthOneBased) {
    return new Date(Date.UTC(year, monthOneBased, 0)).getUTCDate();
  }

  function addMonthsAnchored(firstMonthlyISO, offset) {
    var parsed = parseISODate(firstMonthlyISO);
    if (!parsed) {
      return "";
    }
    var zeroBasedMonth = parsed.month - 1 + Number(offset);
    var targetYear = parsed.year + Math.floor(zeroBasedMonth / 12);
    var targetMonthZero = ((zeroBasedMonth % 12) + 12) % 12;
    var targetDay = Math.min(parsed.day, daysInMonthUTC(targetYear, targetMonthZero + 1));
    return [
      String(targetYear).padStart(4, "0"),
      String(targetMonthZero + 1).padStart(2, "0"),
      String(targetDay).padStart(2, "0")
    ].join("-");
  }

  function firstMonthlyRange(enrollmentISO) {
    return {
      min: addDaysISO(enrollmentISO, 30),
      max: addDaysISO(enrollmentISO, 40)
    };
  }

  function validateFirstMonthlyDate(enrollmentISO, firstMonthlyISO) {
    var difference = daysBetweenISO(enrollmentISO, firstMonthlyISO);
    return difference !== null && difference >= 30 && difference <= 40;
  }

  function formatDateLong(isoDate) {
    var parsed = parseISODate(isoDate);
    if (!parsed) {
      return "—";
    }
    var date = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day));
    return new Intl.DateTimeFormat("es-CO", {
      timeZone: "UTC",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  }

  function formatBogotaDateTime(value) {
    if (!value) {
      return "—";
    }
    return new Intl.DateTimeFormat("es-CO", {
      timeZone: TIME_ZONE,
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).format(new Date(value));
  }

  function todayBogotaISO(now) {
    var parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(now || new Date());
    var map = {};
    parts.forEach(function (item) {
      map[item.type] = item.value;
    });
    return map.year + "-" + map.month + "-" + map.day;
  }

  function enabledEnrollmentDates(now) {
    var today = todayBogotaISO(now instanceof Date ? now : new Date(now || Date.now()));
    return [today, addDaysISO(today, 1), addDaysISO(today, 2)];
  }

  function isEnabledEnrollmentDate(isoDate, now) {
    return enabledEnrollmentDates(now).indexOf(String(isoDate || "")) >= 0;
  }

  function initialPaymentDateRange(now) {
    var today = todayBogotaISO(now instanceof Date ? now : new Date(now || Date.now()));
    return { min: today, max: addDaysISO(today, 30) };
  }

  function validateInitialPaymentDate(isoDate, now) {
    var range = initialPaymentDateRange(now);
    return Boolean(parseISODate(isoDate) && isoDate >= range.min && isoDate <= range.max);
  }

  function calculateQuoteExpiration(generatedAt, selectedEnrollmentDateISO) {
    var generated = generatedAt instanceof Date ? generatedAt : new Date(generatedAt);
    if (Number.isNaN(generated.getTime()) || !isEnabledEnrollmentDate(selectedEnrollmentDateISO, generated)) {
      return null;
    }
    var selectedEndOfDay = new Date(String(selectedEnrollmentDateISO) + "T23:59:59.000-05:00");
    var maximum = new Date(generated.getTime() + (VIGENCIA_COTIZACION_HORAS * 3600000));
    return new Date(Math.min(selectedEndOfDay.getTime(), maximum.getTime()));
  }

  function createQuoteReference(now) {
    var date = now instanceof Date ? now : new Date(now);
    var parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(date);
    var map = {};
    parts.forEach(function (item) {
      map[item.type] = item.value;
    });
    var randomBytes = new Uint8Array(2);
    if (global.crypto && typeof global.crypto.getRandomValues === "function") {
      global.crypto.getRandomValues(randomBytes);
    } else {
      randomBytes[0] = Math.floor(Math.random() * 256);
      randomBytes[1] = Math.floor(Math.random() * 256);
    }
    var code = Array.from(randomBytes).map(function (value) {
      return value.toString(16).padStart(2, "0");
    }).join("").toUpperCase();
    return "SMART-" + map.year + map.month + map.day + "-" + map.hour + map.minute + "-" + code;
  }

  function buildPaymentPlan(tariff, options) {
    var result = {
      valid: false,
      errors: [],
      rows: [],
      totalCop: tariff ? tariff.valor_total_oficial_cop : 0,
      initialCop: 0,
      additionalInitialCop: 0,
      pendingBalanceCop: 0,
      remainingPayments: 0,
      regularMonthlyCop: 0,
      lastMonthlyCop: 0,
      sumPaymentsCop: 0,
      differenceCop: 0
    };
    if (!tariff) {
      result.errors.push("No se encontró una tarifa oficial para la combinación seleccionada.");
      return result;
    }
    var enrollmentDate = options && options.enrollmentDate;
    var accreditationDate = options && (options.accreditationDate || options.initialPaymentDate);
    var firstMonthlyDate = options && options.firstMonthlyDate;
    if (!parseISODate(enrollmentDate)) {
      result.errors.push("Selecciona una fecha de matrícula válida.");
      return result;
    }
    if (!validateInitialPaymentDate(accreditationDate, options && options.now)) {
      result.errors.push("La confirmación estimada del pago inicial debe estar entre hoy y los próximos 30 días calendario.");
      return result;
    }

    if (tariff.numero_pagos === 1) {
      result.initialCop = tariff.valor_total_oficial_cop;
      result.rows = [{
        number: 1,
        concept: "Pago único",
        dueDate: accreditationDate,
        valueCop: tariff.valor_total_oficial_cop,
        balanceAfterCop: 0
      }];
      result.sumPaymentsCop = tariff.valor_total_oficial_cop;
      result.valid = true;
      return result;
    }

    var proposedInitial = options ? options.initialCop : null;
    if (!Number.isSafeInteger(proposedInitial)) {
      result.errors.push("Ingresa una cuota inicial propuesta en pesos enteros.");
      return result;
    }
    if (proposedInitial < tariff.cuota_inicial_minima_cop) {
      result.errors.push("El valor ingresado no cumple las condiciones autorizadas para esta alternativa de pago. Revisa la cuota inicial propuesta.");
      return result;
    }
    if (proposedInitial > tariff.valor_total_oficial_cop) {
      result.errors.push("La cuota inicial no puede superar el valor final de la cotización.");
      return result;
    }
    if (proposedInitial === tariff.valor_total_oficial_cop) {
      result.errors.push("Para pagar el valor completo, selecciona la alternativa de contado autorizada.");
      return result;
    }
    if (!validateFirstMonthlyDate(accreditationDate, firstMonthlyDate)) {
      result.errors.push("La primera cuota mensual debe estar entre 30 y 40 días calendario después de la fecha estimada de confirmación del pago inicial.");
      return result;
    }

    var flex = global.SMART_MIX_CORE.flexibleTerm(tariff, proposedInitial, options.catalog || global.SMART_TARIFAS_MIX);
    var remaining = options.monthlyCount === undefined ? tariff.numero_pagos - 1 : Number(options.monthlyCount);
    if (!flex.valid || !flex.options.includes(remaining)) {
      result.errors.push(flex.error || "Selecciona una cantidad de mensualidades disponible para la cuota inicial propuesta.");
      return result;
    }
    var balance = tariff.valor_total_oficial_cop - proposedInitial;
    var regular = roundDivideCOP(balance, remaining);
    var last = balance - (regular * (remaining - 1));
    if (last < 0) {
      regular = Math.floor(balance / remaining);
      last = balance - (regular * (remaining - 1));
    }
    var runningBalance = tariff.valor_total_oficial_cop;
    var rows = [];
    runningBalance -= proposedInitial;
    rows.push({
      number: 1,
      concept: "Cuota inicial",
      dueDate: accreditationDate,
      valueCop: proposedInitial,
      balanceAfterCop: runningBalance
    });
    for (var index = 0; index < remaining; index += 1) {
      var isLast = index === remaining - 1;
      var paymentValue = isLast ? last : regular;
      runningBalance -= paymentValue;
      rows.push({
        number: index + 2,
        concept: isLast && last !== regular ? "Última cuota ajustada" : "Cuota mensual " + (index + 1),
        dueDate: addMonthsAnchored(firstMonthlyDate, index),
        valueCop: paymentValue,
        balanceAfterCop: runningBalance
      });
    }
    var sum = rows.reduce(function (total, row) {
      return total + row.valueCop;
    }, 0);
    result.valid = runningBalance === 0 && sum === tariff.valor_total_oficial_cop;
    result.rows = rows;
    result.initialCop = proposedInitial;
    result.additionalInitialCop = proposedInitial - tariff.cuota_inicial_minima_cop;
    result.pendingBalanceCop = balance;
    result.remainingPayments = remaining;
    result.regularMonthlyCop = regular;
    result.lastMonthlyCop = last;
    result.sumPaymentsCop = sum;
    result.differenceCop = tariff.valor_total_oficial_cop - sum;
    if (!result.valid) {
      result.errors.push("El plan de pagos no concilia exactamente con el valor total oficial.");
    }
    return result;
  }

  function quoteStatus(generatedAt, expiresAt, modified, now) {
    if (modified) {
      return "MODIFICADA";
    }
    if (!generatedAt || !expiresAt) {
      return "EN_PREPARACION";
    }
    return new Date(now || Date.now()).getTime() >= new Date(expiresAt).getTime() ? "VENCIDA" : "VIGENTE";
  }

  function ensureFinalPeriod(value) {
    var text = String(value == null ? "" : value).trim();
    return !text || /[.!?]$/.test(text) ? text : text + ".";
  }

  function generatePrintDistributions(totalRows, pageCount) {
    if (!Number.isSafeInteger(totalRows) || totalRows < 1 || !Number.isSafeInteger(pageCount) || pageCount < 1) {
      return [];
    }
    if (pageCount === 1) {
      return [[totalRows]];
    }
    var results = [];
    function visit(pageIndex, remaining, current) {
      if (pageIndex === pageCount - 1) {
        if (remaining >= 3 || (totalRows < 3 && remaining > 0)) {
          results.push(current.concat(remaining));
        }
        return;
      }
      var pagesAfter = pageCount - pageIndex - 1;
      var maximum = remaining - (pagesAfter * 3);
      var candidates = [];
      if (pageIndex === 0) {
        candidates.push(0);
      }
      for (var rows = 3; rows <= maximum; rows += 1) {
        candidates.push(rows);
      }
      candidates.forEach(function (rows) {
        visit(pageIndex + 1, remaining - rows, current.concat(rows));
      });
    }
    visit(0, totalRows, []);
    return results;
  }

  function printDistributionBalancePenalty(distribution) {
    if (!Array.isArray(distribution) || distribution.length < 2) {
      return 0;
    }
    var calendarPages = distribution.filter(function (count) {
      return count > 0;
    });
    return calendarPages.reduce(function (penalty, count, index) {
      if (index === calendarPages.length - 1) {
        return penalty;
      }
      var nextCount = calendarPages[index + 1];
      var difference = Math.abs(count - nextCount);
      return penalty + (difference > 3 ? difference - 3 : 0);
    }, 0);
  }

  function printDistributionRespectsSectionOrder(distribution, bonusFirstPageCount, totalBonusCards) {
    if (!Array.isArray(distribution) || !distribution.length) {
      return false;
    }
    var firstPageCount = Math.max(0, Number(bonusFirstPageCount || 0));
    var totalCards = Math.max(0, Number(totalBonusCards || 0));
    if (totalCards === 0) {
      return distribution[0] > 0;
    }
    if (firstPageCount >= totalCards) {
      return true;
    }
    return distribution[0] === 0;
  }

  function createPrintSessionIdentifier(timestamp, counter) {
    return "PRINT-" + Number(timestamp).toString(36).toUpperCase() + "-" + String(counter).padStart(3, "0");
  }


  function resolveCommercialContext(languageId, siteId, catalog) {
    var site = (catalog || []).find(function(s) { return s.sede_id === siteId && s.sede_activa; }) || null;
    return { valid: Boolean(site), site: site, error: site ? "" : "Selecciona una sede comercial." };
  }

  function validateTariffCatalog(items) { return global.SMART_MIX_CORE.validateCatalog(items); }


  function ruleMatches(list, value) {
    return Array.isArray(list) && (list.indexOf("*") >= 0 || list.indexOf(value) >= 0);
  }

  function campaignIsActive(campaign, now) {
    if (!campaign || !campaign.activa) {
      return false;
    }
    var currentDate = todayBogotaISO(now ? new Date(now) : new Date());
    return (!campaign.fecha_inicio || currentDate >= campaign.fecha_inicio) &&
      (!campaign.fecha_fin || currentDate <= campaign.fecha_fin);
  }

  function campaignApplies(campaign, context, now) {
    if (!campaignIsActive(campaign, now) || !context) {
      return false;
    }
    var paymentMode = context.paymentCount === 1 ? "CONTADO" : "FINANCIADO";
    return ruleMatches(campaign.idiomas_aplicables, context.languageId) &&
      ruleMatches(campaign.planes_aplicables, context.planId) &&
      ruleMatches(campaign.sedes_aplicables, context.siteId) &&
      ruleMatches(campaign.condiciones_comerciales_aplicables, context.conditionId) &&
      ruleMatches(campaign.formas_pago_aplicables, paymentMode);
  }

  function authorizedAdditionalOptions(additional, context) {
    if (!additional || !additional.requiere_opcion) {
      return [];
    }
    return (additional.opciones_autorizadas || []).filter(function (option) {
      return option.activa && ruleMatches(option.idiomas_aplicables, context.languageId) &&
        ruleMatches(option.sedes_aplicables, context.siteId);
    });
  }

  function additionalIsApplicable(additional, campaign, context, now) {
    if (!additional || !additional.activo || !additional.puede_bonificarse || !additional.seleccionable_por_asesor ||
        !campaignApplies(campaign, context, now) ||
        campaign.adicionales_bonificables.indexOf(additional.adicional_id) < 0) {
      return false;
    }
    if (context.languageId !== "INGLES" || !additional.aplica_ingles) {
      return false;
    }
    if (additional.adicional_id === "LINGUASKILL_CUATRO_HABILIDADES" &&
        !(context.numberOfModules >= 2 && (context.modules || []).some(function(m) { return ["Flow","Plus","Pro"].includes(m); }))) { return false; }
    if ((context.paymentCount === 1 && !additional.aplica_contado) ||
        (context.paymentCount > 1 && !additional.aplica_financiado)) {
      return false;
    }
    if (!ruleMatches(additional.planes_aplicables, context.planId) ||
        !ruleMatches(additional.modulos_aplicables, context.numberOfModules) ||
        !ruleMatches(additional.sedes_aplicables, context.siteId) ||
        !ruleMatches(additional.condiciones_comerciales_aplicables, context.conditionId)) {
      return false;
    }
    return !additional.requiere_opcion || authorizedAdditionalOptions(additional, context).length > 0;
  }

  function calculateAdditionalCommercialValue(additional, context, optionId) {
    var result = {
      configured: false,
      valueCop: null,
      unitValueCop: null,
      quantity: 0,
      option: null,
      valueLabel: additional ? additional.etiqueta_valor_cliente : "Valor comercial",
      referenceNote: additional ? additional.aclaracion_valor_cliente : ""
    };
    if (!additional || !context) {
      return result;
    }
    if (additional.tipo_precio === "PRECIO_FIJO" && Number.isSafeInteger(additional.precio_publico_cop)) {
      var fixedOption = additional.requiere_opcion ? authorizedAdditionalOptions(additional, context).find(function (item) {
        return item.opcion_id === optionId;
      }) || null : null;
      result.configured = true;
      result.valueCop = fixedOption && Number.isSafeInteger(fixedOption.precio_publico_cop)
        ? fixedOption.precio_publico_cop
        : additional.precio_publico_cop;
      result.unitValueCop = result.valueCop;
      result.quantity = 1;
      result.option = fixedOption;
    } else if (additional.tipo_precio === "PRECIO_POR_MODULO" &&
        Number.isSafeInteger(additional.precio_por_modulo_cop) && Number.isSafeInteger(context.numberOfModules)) {
      result.configured = true;
      result.unitValueCop = additional.precio_por_modulo_cop;
      result.quantity = context.numberOfModules;
      result.valueCop = additional.precio_por_modulo_cop * context.numberOfModules;
    } else if (additional.tipo_precio === "VALOR_EQUIVALENTE_CLASE" &&
        Number.isSafeInteger(context.fullListCop) && Number.isSafeInteger(context.academicHours) &&
        Number.isSafeInteger(additional.duracion_clase_minutos) && context.fullListCop > 0 &&
        context.academicHours > 0 && additional.duracion_clase_minutos > 0) {
      var classValueNumerator = context.fullListCop * additional.duracion_clase_minutos;
      var classValueDenominator = context.academicHours * 60;
      if (Number.isSafeInteger(classValueNumerator) && Number.isSafeInteger(classValueDenominator)) {
        result.configured = true;
        result.valueCop = roundDivideCOP(classValueNumerator, classValueDenominator);
        result.unitValueCop = result.valueCop;
        result.quantity = 1;
      }
    } else if (additional.tipo_precio === "PRECIO_POR_OPCION") {
      var option = authorizedAdditionalOptions(additional, context).find(function (item) {
        return item.opcion_id === optionId;
      }) || null;
      if (option && Number.isSafeInteger(option.precio_publico_cop)) {
        result.configured = true;
        result.valueCop = option.precio_publico_cop;
        result.unitValueCop = option.precio_publico_cop;
        result.quantity = 1;
        result.option = option;
      }
    }
    return result;
  }

  function sumAdditionalCommercialValues(items) {
    return (Array.isArray(items) ? items : []).reduce(function (total, item) {
      var value = item && item.valueConfigured === false ? null : item && item.valueCop;
      return total + (Number.isSafeInteger(value) && value > 0 ? value : 0);
    }, 0);
  }

  function calculateBonusDeadline(campaign, generatedAt, quoteExpiresAt, exceptionalDeadline) {
    if (exceptionalDeadline) {
      return new Date(exceptionalDeadline).toISOString();
    }
    if (!campaign || !generatedAt) {
      return null;
    }
    if (campaign.sincronizar_con_vigencia_cotizacion && quoteExpiresAt) {
      return quoteExpiresAt;
    }
    return new Date(new Date(generatedAt).getTime() + (campaign.vigencia_bonificacion_horas * 3600000)).toISOString();
  }

  function resolveAdditionalStatus(options) {
    var data = options || {};
    if (!data.active) {
      return "INACTIVO";
    }
    if (!data.applicable) {
      return "NO_APLICA";
    }
    if (data.withCost) {
      return "ADICIONAL_CON_COSTO";
    }
    if (!data.selected) {
      return "NO_SELECCIONADO";
    }
    var deadlineExpired = data.deadline && new Date(data.now || Date.now()).getTime() >= new Date(data.deadline).getTime();
    if (data.quoteStatus === "VENCIDA" || deadlineExpired) {
      return "BONIFICACION_VENCIDA";
    }
    return data.authorized ? "BONIFICADO_POR_AUTORIZACION" : "BONIFICADO_PROMOCION_VIGENTE";
  }

  function shareLanguageCopy() {
    return { languageName:"inglés", objectiveText:"avanzar en tu aprendizaje del inglés", emotionalText:"Avanza en inglés con la flexibilidad presencial y virtual de Smart Mix." };
  }

  function normalizeShareContext(contextId) {
    var selected = SHARE_CONTEXTS.find(function (item) {
      return item.id === contextId;
    });
    return selected ? selected.id : DEFAULT_SHARE_CONTEXT;
  }

  function shareContextLabel(contextId) {
    var normalized = normalizeShareContext(contextId);
    return SHARE_CONTEXTS.find(function (item) {
      return item.id === normalized;
    }).label;
  }

  function shareContextClosing(contextId, isCash, data) {
    var context = normalizeShareContext(contextId);
    if (context === "LO_VA_A_PENSAR") {
      return [
        "Revísala con calma y piensa cómo este programa puede ayudarte a alcanzar el objetivo que conversamos.",
        "*Si al revisarla sientes que es el momento de comenzar, respóndeme “Quiero empezar” y te acompaño con el proceso* " + SMART_EMOJIS.cierre
      ];
    }
    if (context === "CONSULTA_PAREJA_FAMILIA") {
      return [
        "Compártela con tu pareja o con las personas que te acompañan en esta decisión, para que puedan revisar juntos el programa, la forma de pago y los beneficios.",
        "*Cuando la hayan revisado, respóndeme “Queremos avanzar” y con gusto los acompaño con el proceso* " + SMART_EMOJIS.cierre
      ];
    }
    if (context === "REVISA_PRESUPUESTO") {
      return [
        "Revisa con calma cómo se ajusta esta alternativa a tu presupuesto.",
        "*Si quieres avanzar o necesitas que revisemos nuevamente la forma de pago, respóndeme “Revisemos mi plan” y te ayudo a validar la alternativa más adecuada* " + SMART_EMOJIS.cierre
      ];
    }
    if (context === "COMPARA_ALTERNATIVAS") {
      return [
        "Al comparar tu propuesta, ten en cuenta el programa completo, las horas académicas, la forma de pago y los beneficios incluidos.",
        "*Si consideras que Smart es la alternativa adecuada para alcanzar tu objetivo, respóndeme “Quiero empezar” y te acompaño con la formalización* " + SMART_EMOJIS.cierre
      ];
    }
    if (context === "LISTO_PARA_AVANZAR") {
      return isCash ? [
        "Puedes formalizar tu matrícula con un único pago de " + formatCOP(data.totalContractCop) + ".",
        "*Respóndeme “Listo para matricularme” y te acompaño con el proceso* " + SMART_EMOJIS.cierre
      ] : [
        "Con un pago inicial de " + formatCOP(data.initialCop) + " puedes comenzar tu proceso.",
        "*Respóndeme “Listo para matricularme” y te acompaño con la formalización* " + SMART_EMOJIS.cierre
      ];
    }
    return [
      "Revisa la propuesta con calma y compártela con quien te acompañe en esta decisión.",
      "*Si sientes que este es el momento para comenzar, respóndeme “Quiero empezar” y te acompaño para dejar todo listo* " + SMART_EMOJIS.cierre
    ];
  }

  function compactMessageLines(lines) {
    var result = [];
    (lines || []).forEach(function (line) {
      var value = String(line == null ? "" : line).trim();
      if (!value && (!result.length || result[result.length - 1] === "")) {
        return;
      }
      result.push(value);
    });
    while (result.length && result[result.length - 1] === "") {
      result.pop();
    }
    return result.join("\n");
  }

  function finalizeWhatsAppMessage(lines) {
    return validarMensajeUnicode(compactMessageLines(lines));
  }

  function construirMensajeWhatsApp(cotizacion, contexto) {
    var data = cotizacion || {};
    var lines = [
      SMART_EMOJIS.saludo + " *Hola, " + (data.clientName || "Cliente") + ".*", "",
      "Soy " + (data.advisorName || "tu asesor") + ", de la Academia de Idiomas Smart.",
      "Es un gusto acompañarte en tu aprendizaje de inglés. Esta es la propuesta que preparamos para ti:", "",
      SMART_EMOJIS.programa + " *TU EXPERIENCIA SMART MIX*",
      "*Módulos:* " + data.programName,
      "*Horas académicas:* " + data.academicHours,
      "*Sede:* " + data.siteName,
      "Clases presenciales, virtuales o alternando ambas según tu preferencia.", "",
      data.isCash ? "*TU INVERSIÓN DE CONTADO*" : "*TU PLAN DE PAGO*",
      "*Condición comercial:* " + data.conditionName,
      "*Plan oficial:* " + (data.isCash ? "contado." : data.officialPayments + " pagos máximos, incluida la cuota inicial.")
    ];
    if (data.isCash) {
      lines.push("*Valor de contado:* " + formatCOP(data.totalContractCop));
    } else {
      lines.push("*Cuota inicial propuesta:* " + formatCOP(data.initialCop),
        "*" + data.remainingPayments + " mensualidades de aproximadamente " + formatCOP(data.regularMonthlyCop) + ".*",
        "*Última mensualidad:* " + formatCOP(data.lastMonthlyCop),
        "*Primera mensualidad:* " + data.firstMonthlyDateText);
    }
    lines.push("*Valor final del servicio:* " + formatCOP(data.totalContractCop));
    if ((data.additionals || []).length) {
      lines.push("", "*BENEFICIOS QUE ACOMPAÑAN TU PROPUESTA*");
      data.additionals.forEach(function (benefit) {
        lines.push("- " + benefit.title + ": " + formatCOP(benefit.valueCop));
      });
      lines.push("*Valor económico total de beneficios:* " + formatCOP(data.additionalsTotalCop),
        "Un valor adicional para ti, separado del precio del servicio.");
    }
    if (data.observation) { lines.push("", "*Observación de tu asesor:* " + data.observation); }
    lines.push("", SMART_EMOJIS.vigencia + " *PROPUESTA VIGENTE HASTA*",
      data.expirationText + ".", "Podemos avanzar con estas condiciones dentro de la vigencia indicada.", "");
    lines = lines.concat(shareContextClosing(contexto || data.contextId, data.isCash, data));
    lines.push("", "Estoy aquí para resolver tus dudas y acompañarte en el siguiente paso.", "Referencia: " + data.reference);
    return finalizeWhatsAppMessage(lines);
  }

  function emailContextClosing(contextId, isCash, data) {
    var context = normalizeShareContext(contextId);
    if (context === "LO_VA_A_PENSAR") {
      return [
        "Puedes revisar la propuesta con calma y valorar cómo este programa puede ayudarte a alcanzar el objetivo que conversamos.",
        "Cuando decidas avanzar, responde este correo y te acompañaré con el proceso de matrícula."
      ];
    }
    if (context === "CONSULTA_PAREJA_FAMILIA") {
      return [
        "Puedes compartir esta propuesta con las personas que te acompañan en la decisión para revisar juntos el programa, la forma de pago y los beneficios.",
        "Cuando la hayan revisado, responde este correo y con gusto los acompañaré con el proceso."
      ];
    }
    if (context === "REVISA_PRESUPUESTO") {
      return [
        "Te invito a revisar cómo se ajusta esta alternativa a tu presupuesto.",
        "Si deseas avanzar o revisar nuevamente la forma de pago, responde este correo y te ayudaré a validar la alternativa más adecuada."
      ];
    }
    if (context === "COMPARA_ALTERNATIVAS") {
      return [
        "Al comparar tu propuesta, ten en cuenta el programa, las horas académicas, la forma de pago y los beneficios seleccionados.",
        "Si consideras que Smart es la alternativa adecuada, responde este correo y te acompañaré con la formalización."
      ];
    }
    if (context === "LISTO_PARA_AVANZAR") {
      return [
        isCash
          ? "Puedes formalizar tu matrícula con un pago único de " + formatCOP(data.totalContractCop) + "."
          : "Puedes iniciar tu proceso con un pago inicial de " + formatCOP(data.initialCop) + ".",
        "Cuando estés listo, respóndeme este correo y te acompañaré con la formalización."
      ];
    }
    return [
      "Te invito a revisar la propuesta con calma y compartirla con quien te acompañe en esta decisión.",
      "Cuando hayas revisado la propuesta, puedes responder este correo o escribirnos para continuar con el proceso."
    ];
  }

  function commercialShareLines(data) {
    var lines = ["Módulos: " + data.programName + " · " + data.academicHours + " horas.",
      "Clases presenciales, virtuales o alternando ambas según tu preferencia.",
      "Sede: " + data.siteName, "Condición comercial: " + data.conditionName,
      "Plan oficial: " + (data.officialPayments === 1 ? "contado" : data.officialPayments + " pagos máximos") + "."];
    if (data.isCash) { lines.push("Pago único: " + formatCOP(data.totalContractCop) + "."); }
    else {
      lines.push("Cuota inicial propuesta: " + formatCOP(data.initialCop) + ".",
        data.remainingPayments + " mensualidades de aproximadamente " + formatCOP(data.regularMonthlyCop) + ".",
        "Última mensualidad: " + formatCOP(data.lastMonthlyCop) + ".",
        "Primera mensualidad: " + data.firstMonthlyDateText + ".");
    }
    lines.push("Valor final del servicio: " + formatCOP(data.totalContractCop) + ".");
    if ((data.additionals || []).length) {
      lines.push("Beneficios incluidos:");
      data.additionals.forEach(function(b) { lines.push("• " + b.title + ": " + formatCOP(b.valueCop)); });
      lines.push("Valor económico total de beneficios: " + formatCOP(data.additionalsTotalCop) + ".",
        "Estos beneficios son valor adicional; no se restan al precio del servicio.");
    }
    if (data.observation) { lines.push("Observación: " + data.observation); }
    return lines;
  }

  function buildEmailSubject(data) { return "Cotización Smart Mix — " + String((data || {}).clientName || "Cliente"); }

  function buildEmailBody(input) {
    var data = input || {};
    return ["Hola, " + (data.clientName || "Cliente") + ".", "", "Te comparto tu propuesta personalizada de SMART MIX.",
      commercialShareLines(data).join("\n"), "", "Vigente hasta: " + data.expirationText + ".",
      "Referencia: " + data.reference, "", emailContextClosing(data.contextId, data.isCash, data).join("\n"),
      "", "Cordialmente,", data.advisorName || "Equipo Smart", "SMART MIX"].join("\n");
  }

  function buildGmailComposeUrl(email, subject, body, bcc) {
    var recipient = String(email || "").trim();
    if (!isValidOptionalEmail(recipient) || !recipient) {
      return "";
    }
    var bccEmail = String(bcc || "").trim();
    if (bccEmail && !isValidOptionalEmail(bccEmail)) {
      return "";
    }
    return "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(recipient) +
      (bccEmail ? "&bcc=" + encodeURIComponent(bccEmail) : "") +
      "&su=" + encodeURIComponent(String(subject || "")) +
      "&body=" + encodeURIComponent(String(body || ""));
  }

  function buildManagerBackupSubject(data) { return "Respaldo Smart Mix — " + data.clientName + " — " + data.reference; }

  function buildManagerBackupBody(data) {
    return ["Respaldo de cotización SMART MIX", "Cliente: " + data.clientName, "Asesor: " + data.advisorName,
      "Sede: " + data.siteName, "Referencia: " + data.reference, "", commercialShareLines(data).join("\n"),
      "Vigente hasta: " + data.expirationText + ".", "", "Adjuntar el PDF de la propuesta. El envío al cliente fue confirmado manualmente por el asesor."].join("\n");
  }

  function corporateEmailIdentity(authenticatedEmail) {
    var email = String(authenticatedEmail || "").trim();
    if (!email) {
      return { status: "LOCAL_MANUAL", email: "", valid: true };
    }
    var valid = /^[^\s@]+@smartidiomas\.edu\.co$/i.test(email);
    return {
      status: valid ? "CORPORATE_VALID" : "CORPORATE_INVALID",
      email: email,
      valid: valid
    };
  }

  function obtenerCorreoCorporativoAutenticado() {
    return corporateEmailIdentity(global.SMART_AUTH_USER_EMAIL);
  }

  function encontrarSurrogadoInvalido(texto) {
    for (let i = 0; i < texto.length; i += 1) {
      const codigo = texto.charCodeAt(i);

      if (codigo >= 0xD800 && codigo <= 0xDBFF) {
        const siguiente = texto.charCodeAt(i + 1);

        if (!(siguiente >= 0xDC00 && siguiente <= 0xDFFF)) {
          return {
            valido: false,
            indice: i,
            tipo: "HIGH_SURROGATE_SIN_PAREJA"
          };
        }

        i += 1;
        continue;
      }

      if (codigo >= 0xDC00 && codigo <= 0xDFFF) {
        return {
          valido: false,
          indice: i,
          tipo: "LOW_SURROGATE_SIN_PAREJA"
        };
      }
    }

    return {
      valido: true,
      indice: -1,
      tipo: null
    };
  }

  function validarMensajeUnicode(texto) {
    if (typeof texto !== "string") {
      throw new TypeError("El mensaje de WhatsApp debe ser texto.");
    }

    if (texto.includes("\uFFFD") || texto.includes("\\uFFFD")) {
      throw new Error("El mensaje contiene el carácter de reemplazo Unicode U+FFFD.");
    }

    const validacion = encontrarSurrogadoInvalido(texto);

    if (!validacion.valido) {
      throw new Error("El mensaje contiene un surrogate inválido en el índice " + validacion.indice + ": " + validacion.tipo + ".");
    }

    return texto.normalize("NFC");
  }

  function truncarPorCodePoints(texto, limite) {
    const caracteres = Array.from(String(texto || ""));
    if (caracteres.length <= limite) {
      return String(texto || "");
    }
    return caracteres.slice(0, limite).join("");
  }

  function obtenerDiagnosticoCodePoints(texto) {
    return Array.from(String(texto || "")).map(function (caracter, indice) {
      return {
        indice: indice,
        caracter: caracter,
        codePoint: "U+" + caracter.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")
      };
    });
  }

  function whatsAppMessageDiagnostics(message) {
    var original = String(message || "");
    var text = original.normalize("NFC");
    var safeSymbols = Array.from(new Set(Object.keys(SMART_EMOJIS).map(function (key) {
      return SMART_EMOJIS[key];
    }).filter(Boolean)));
    var emojiCount = safeSymbols.reduce(function (total, symbol) {
      return total + text.split(symbol).length - 1;
    }, 0);
    var ctaOccurrences = WHATSAPP_RESPONSE_OPTIONS.reduce(function (total, response) {
      var escaped = response.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return total + (text.match(new RegExp(escaped, "g")) || []).length;
    }, 0);
    return {
      characterCount: Array.from(text).length,
      emojiCount: emojiCount,
      ctaOccurrences: ctaOccurrences,
      normalizedNFC: text === original,
      hasReplacementCharacter: text.indexOf("\uFFFD") >= 0 || text.indexOf("\\uFFFD") >= 0,
      surrogateValidation: encontrarSurrogadoInvalido(text),
      codePoints: obtenerDiagnosticoCodePoints(text),
      nonAsciiCodePoints: obtenerDiagnosticoCodePoints(text).filter(function (item) {
        return item.caracter.codePointAt(0) > 0x7F;
      }),
      hasTechnicalTerms: /archivo_origen|hoja_origen|fila_origen|cuota_inicial_minima_cop|plan_id|condicion_id/i.test(text)
    };
  }

  function validateWhatsAppMessageIntegrity(message) {
    var normalized = "";
    var validationError = null;
    try {
      normalized = validarMensajeUnicode(message);
    } catch (error) {
      normalized = typeof message === "string" ? message : "";
      validationError = error;
    }
    var diagnostics = whatsAppMessageDiagnostics(normalized);
    return {
      valid: Boolean(normalized.trim()) && !validationError && !diagnostics.hasReplacementCharacter && diagnostics.surrogateValidation.valido,
      normalized: normalized,
      diagnostics: diagnostics,
      error: validationError ? validationError.message : ""
    };
  }

  function registrarDiagnosticoWhatsApp(input) {
    var data = input || {};
    var built = typeof data.mensajeConstruido === "string" ? data.mensajeConstruido : "";
    var normalized = typeof data.mensajeNormalizado === "string"
      ? data.mensajeNormalizado
      : (built ? built.normalize("NFC") : "");
    var recovered = typeof data.mensajeRecuperado === "string" ? data.mensajeRecuperado : "";
    var surrogateValidation = encontrarSurrogadoInvalido(normalized);
    var hasReplacement = normalized.indexOf("\uFFFD") >= 0 || recovered.indexOf("\uFFFD") >= 0;
    var diagnostics = Object.freeze({
      mensajeConstruido: built,
      mensajeNormalizado: normalized,
      validacionSurrogatePairs: Object.freeze(surrogateValidation),
      contieneU_FFFD: hasReplacement,
      codePointsNoASCII: Object.freeze(obtenerDiagnosticoCodePoints(normalized).filter(function (item) {
        return item.caracter.codePointAt(0) > 0x7F;
      }).map(function (item) { return Object.freeze(item); })),
      urlFinal: String(data.urlFinal || ""),
      mensajeRecuperado: recovered,
      igualdadIdaVuelta: Boolean(recovered && recovered === normalized),
      metodoUtilizado: data.metodoUtilizado === "CLIPBOARD_FALLBACK" ? "CLIPBOARD_FALLBACK" : "PREFILL_URL",
      archivoYFuncionDano: String(data.archivoYFuncionDano || (hasReplacement ? "aplicacion.js::registrarDiagnosticoWhatsApp" : "NINGUNO_EN_APLICACION")),
      resultadoWhatsAppWeb: String(data.resultadoWhatsAppWeb || "PENDIENTE_VERIFICACION_EXTERNA"),
      portapapelesCopiado: Boolean(data.portapapelesCopiado),
      portapapelesVerificado: data.portapapelesVerificado === true ? true : (data.portapapelesVerificado === false ? false : null),
      fechaHoraPrueba: String(data.fechaHoraPrueba || new Date().toISOString())
    });
    global.SMART_LAST_WHATSAPP_DIAGNOSTICS = diagnostics;
    return diagnostics;
  }

  function sanitizePdfFilePart(value, fallback) {
    var normalized = String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    normalized = normalized.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "").replace(/_+/g, "_");
    return normalized.slice(0, 70) || fallback;
  }

  function buildPdfFileName(data) {
    var input = data || {};
    return "Cotizacion_Smart_Mix_" + sanitizePdfFilePart(input.clientName,"Cliente") + "_" + sanitizePdfFilePart(input.reference,"Sin_referencia") + ".pdf";
  }

  function detectShareCapabilities(navigatorLike, pdfFile) {
    var api = navigatorLike || {};
    var canShareText = typeof api.share === "function";
    var canShareFiles = false;
    if (canShareText && pdfFile && typeof api.canShare === "function") {
      try {
        canShareFiles = Boolean(api.canShare({ files: [pdfFile] }));
      } catch (error) {
        canShareFiles = false;
      }
    }
    return {
      canShareText: canShareText,
      canShareFiles: canShareFiles,
      pdfMode: canShareFiles ? "ARCHIVO_COMPARTIBLE" : "PDF_MANUAL_DESDE_IMPRESION"
    };
  }

  function normalizeManualDialCode(value) {
    var text = String(value || "").trim();
    if (!/^\+?[1-9]\d{0,3}$/.test(text)) {
      return "";
    }
    var digits = text.replace("+", "");
    return digits === "00" ? "" : digits;
  }

  function phoneCountryConfiguration(countryIsoOrDial, customDialCode) {
    var key = String(countryIsoOrDial || "CO").trim().toUpperCase();
    var configured = PHONE_COUNTRIES.find(function (country) { return country.iso === key; });
    if (configured) {
      return {
        iso: configured.iso,
        name: configured.name,
        dialCode: configured.iso === "OTHER" ? normalizeManualDialCode(customDialCode) : configured.dialCode
      };
    }
    var legacyDialCode = normalizeManualDialCode(key);
    return legacyDialCode ? { iso: legacyDialCode === "57" ? "CO" : "OTHER", name: "", dialCode: legacyDialCode } : null;
  }

  function normalizeClientPhoneDetailed(value, countryIsoOrDial, customDialCode) {
    var raw = String(value || "").trim();
    var country = phoneCountryConfiguration(countryIsoOrDial, customDialCode);
    if (!raw) {
      return { valid: false, empty: true, normalized: "", reason: "EMPTY", country: country };
    }
    if (!country || !country.dialCode) {
      return { valid: false, empty: false, normalized: "", reason: "INVALID_DIAL_CODE", country: country };
    }
    var explicitlyInternational = raw.charAt(0) === "+" || /^00/.test(raw.replace(/[^\d+]/g, ""));
    var digits = raw.replace(/\D/g, "");
    if (digits.indexOf("00") === 0) {
      digits = digits.slice(2);
      explicitlyInternational = true;
    }
    if (!digits) {
      return { valid: false, empty: false, normalized: "", reason: "NO_DIGITS", country: country };
    }

    if (country.iso === "CO" || country.dialCode === "57" && String(countryIsoOrDial || "").trim() === "57") {
      if (digits.indexOf("57") === 0 && digits.length === 12) {
        digits = digits.slice(2);
      } else if (explicitlyInternational && digits.indexOf("57") !== 0) {
        return { valid: false, empty: false, normalized: "", reason: "COUNTRY_MISMATCH", country: country };
      }
      if (!/^3\d{9}$/.test(digits)) {
        return { valid: false, empty: false, normalized: "", reason: "INVALID_CO_MOBILE", country: country };
      }
      return { valid: true, empty: false, normalized: "57" + digits, reason: "VALID", country: country };
    }

    if (explicitlyInternational && digits.indexOf(country.dialCode) !== 0) {
      return { valid: false, empty: false, normalized: "", reason: "COUNTRY_MISMATCH", country: country };
    }
    var alreadyInternational = explicitlyInternational;
    if (!alreadyInternational && digits.indexOf(country.dialCode) === 0) {
      alreadyInternational = country.dialCode === "1"
        ? digits.length === 11
        : digits.length - country.dialCode.length >= 6;
    }
    var normalized = alreadyInternational ? digits : country.dialCode + digits;
    if (normalized.indexOf(country.dialCode) !== 0 || !/^\d{6,15}$/.test(normalized)) {
      return { valid: false, empty: false, normalized: "", reason: "INVALID_E164_LENGTH", country: country };
    }
    return { valid: true, empty: false, normalized: normalized, reason: "VALID_BASIC_E164", country: country };
  }

  function normalizeClientPhone(value, countryIsoOrDial, customDialCode) {
    return normalizeClientPhoneDetailed(value, countryIsoOrDial, customDialCode).normalized;
  }

  function groupReadablePhoneDigits(nationalNumber) {
    var digits = String(nationalNumber || "");
    if (digits.length === 10) {
      return digits.slice(0, 3) + " " + digits.slice(3, 6) + " " + digits.slice(6);
    }
    if (digits.length === 9) {
      return digits.slice(0, 3) + " " + digits.slice(3, 6) + " " + digits.slice(6);
    }
    if (digits.length === 8) {
      return digits.slice(0, 4) + " " + digits.slice(4);
    }
    return digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
  }

  function formatClientPhone(value, countryIsoOrDial, customDialCode) {
    var country = phoneCountryConfiguration(countryIsoOrDial || (String(value || "").indexOf("57") === 0 ? "CO" : "OTHER"), customDialCode);
    var normalized = String(value || "").replace(/\D/g, "");
    if (!country || !country.dialCode || normalized.indexOf(country.dialCode) !== 0) {
      return normalized ? "+" + normalized : "";
    }
    return "+" + country.dialCode + " " + groupReadablePhoneDigits(normalized.slice(country.dialCode.length));
  }

  function isValidOptionalEmail(value) {
    var email = String(value || "").trim();
    return !email || (email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email));
  }

  function clientProgramDisplayName(tariff) { return tariff ? tariff.modulos_incluidos.join(" + ") : "Smart Mix"; }

  function construirUrlWhatsAppWeb(numeroWhatsApp, mensajeOriginal) {
    const numero = String(numeroWhatsApp).replace(/\D/g, "");
    const mensaje = validarMensajeUnicode(mensajeOriginal);

    if (!numero || !/^\d{6,15}$/.test(numero)) {
      throw new Error("No existe un número válido para WhatsApp.");
    }

    const url = new URL("https://web.whatsapp.com/send");
    url.searchParams.set("phone", numero);
    url.searchParams.set("text", mensaje);
    const urlFinal = url.toString();
    const urlComprobacion = new URL(urlFinal);
    const telefonoRecuperado = urlComprobacion.searchParams.get("phone");
    const mensajeRecuperado = urlComprobacion.searchParams.get("text");

    if (telefonoRecuperado !== numero) {
      throw new Error("El teléfono no supera la validación de ida y vuelta.");
    }

    if (mensajeRecuperado !== mensaje) {
      throw new Error("El mensaje no supera la validación de ida y vuelta.");
    }

    validarMensajeUnicode(mensajeRecuperado);

    return {
      url: urlFinal,
      numero: numero,
      mensaje: mensaje,
      mensajeRecuperado: mensajeRecuperado
    };
  }

  function construirUrlWhatsApp(numeroWhatsApp, mensajeOriginal) {
    return construirUrlWhatsAppWeb(numeroWhatsApp, mensajeOriginal);
  }

  function buildWhatsAppUrl(phone, message) {
    try {
      return construirUrlWhatsAppWeb(phone, message).url;
    } catch (error) {
      return "";
    }
  }

  function validateExceptionalAuthorization(authorization, applicableIds, now) {
    var data = authorization || {};
    var errors = [];
    [
      ["authorizerName", "nombre de quien autoriza"],
      ["authorizerRole", "cargo o rol"],
      ["reason", "motivo"],
      ["authorizationReference", "referencia de autorización"],
      ["newDeadline", "nueva fecha límite"]
    ].forEach(function (field) {
      if (!String(data[field[0]] || "").trim()) {
        errors.push("Completa " + field[1] + ".");
      }
    });
    var selected = Array.isArray(data.additionalIds) ? data.additionalIds : [];
    if (!selected.length) {
      errors.push("Selecciona al menos un adicional autorizado.");
    }
    selected.forEach(function (id) {
      if ((applicableIds || []).indexOf(id) < 0) {
        errors.push("El adicional " + id + " no es aplicable a la selección comercial actual.");
      }
    });
    if (data.newDeadline && (!Number.isFinite(new Date(data.newDeadline).getTime()) ||
        new Date(data.newDeadline).getTime() <= new Date(now || Date.now()).getTime())) {
      errors.push("La nueva fecha límite debe ser futura.");
    }
    return { valid: errors.length === 0, errors: errors };
  }

  var CORE = {
    VIGENCIA_COTIZACION_HORAS: VIGENCIA_COTIZACION_HORAS,
    TIME_ZONE: TIME_ZONE,
    DISCLAIMER: DISCLAIMER,
    formatCOP: formatCOP,
    formatPercentExact: formatPercentExact,
    parseCOPInput: parseCOPInput,
    roundDivideCOP: roundDivideCOP,
    addDaysISO: addDaysISO,
    daysBetweenISO: daysBetweenISO,
    addMonthsAnchored: addMonthsAnchored,
    initialPaymentDateRange: initialPaymentDateRange,
    validateInitialPaymentDate: validateInitialPaymentDate,
    firstMonthlyRange: firstMonthlyRange,
    validateFirstMonthlyDate: validateFirstMonthlyDate,
    formatDateLong: formatDateLong,
    todayBogotaISO: todayBogotaISO,
    enabledEnrollmentDates: enabledEnrollmentDates,
    isEnabledEnrollmentDate: isEnabledEnrollmentDate,
    calculateQuoteExpiration: calculateQuoteExpiration,
    createQuoteReference: createQuoteReference,
    buildPaymentPlan: buildPaymentPlan,
    quoteStatus: quoteStatus,
    ensureFinalPeriod: ensureFinalPeriod,
    generatePrintDistributions: generatePrintDistributions,
    printDistributionBalancePenalty: printDistributionBalancePenalty,
    printDistributionRespectsSectionOrder: printDistributionRespectsSectionOrder,
    createPrintSessionIdentifier: createPrintSessionIdentifier,
    resolveCommercialContext: resolveCommercialContext,
    validateTariffCatalog: validateTariffCatalog,
    PROJECTED_PAYMENT_DISCLAIMER: PROJECTED_PAYMENT_DISCLAIMER,
    PROJECTED_PAYMENT_DISCLAIMER_SHORT: PROJECTED_PAYMENT_DISCLAIMER_SHORT,
    ruleMatches: ruleMatches,
    campaignIsActive: campaignIsActive,
    campaignApplies: campaignApplies,
    authorizedAdditionalOptions: authorizedAdditionalOptions,
    additionalIsApplicable: additionalIsApplicable,
    calculateAdditionalCommercialValue: calculateAdditionalCommercialValue,
    sumAdditionalCommercialValues: sumAdditionalCommercialValues,
    calculateBonusDeadline: calculateBonusDeadline,
    resolveAdditionalStatus: resolveAdditionalStatus,
    validateExceptionalAuthorization: validateExceptionalAuthorization,
    SHARE_CONTEXTS: SHARE_CONTEXTS,
    DEFAULT_SHARE_CONTEXT: DEFAULT_SHARE_CONTEXT,
    WHATSAPP_RESPONSE_OPTIONS: WHATSAPP_RESPONSE_OPTIONS,
    SMART_EMOJIS: SMART_EMOJIS,
    WHATSAPP_EMOJIS: WHATSAPP_EMOJIS,
    PHONE_COUNTRIES: PHONE_COUNTRIES,
    shareLanguageCopy: shareLanguageCopy,
    normalizeShareContext: normalizeShareContext,
    shareContextLabel: shareContextLabel,
    construirMensajeWhatsApp: construirMensajeWhatsApp,
    buildWhatsAppMessage: construirMensajeWhatsApp,
    emailContextClosing: emailContextClosing,
    buildEmailSubject: buildEmailSubject,
    buildEmailBody: buildEmailBody,
    buildGmailComposeUrl: buildGmailComposeUrl,
    buildManagerBackupSubject: buildManagerBackupSubject,
    buildManagerBackupBody: buildManagerBackupBody,
    corporateEmailIdentity: corporateEmailIdentity,
    encontrarSurrogadoInvalido: encontrarSurrogadoInvalido,
    validarMensajeUnicode: validarMensajeUnicode,
    truncarPorCodePoints: truncarPorCodePoints,
    obtenerDiagnosticoCodePoints: obtenerDiagnosticoCodePoints,
    registrarDiagnosticoWhatsApp: registrarDiagnosticoWhatsApp,
    whatsAppMessageDiagnostics: whatsAppMessageDiagnostics,
    validateWhatsAppMessageIntegrity: validateWhatsAppMessageIntegrity,
    sanitizePdfFilePart: sanitizePdfFilePart,
    buildPdfFileName: buildPdfFileName,
    detectShareCapabilities: detectShareCapabilities,
    normalizeManualDialCode: normalizeManualDialCode,
    phoneCountryConfiguration: phoneCountryConfiguration,
    normalizeClientPhoneDetailed: normalizeClientPhoneDetailed,
    normalizeClientPhone: normalizeClientPhone,
    formatClientPhone: formatClientPhone,
    isValidOptionalEmail: isValidOptionalEmail,
    clientProgramDisplayName: clientProgramDisplayName,
    construirUrlWhatsAppWeb: construirUrlWhatsAppWeb,
    construirUrlWhatsApp: construirUrlWhatsApp,
    buildWhatsAppUrl: buildWhatsAppUrl,
    copiarMensajeSinLeer: copiarMensajeSinLeer
  };
  global.SMART_APP_CORE = Object.freeze(CORE);

  if (typeof document === "undefined") {
    return;
  }

  var mixTariffs = global.SMART_TARIFAS_MIX || [];
  var tariffMeta = global.SMART_MIX_META || {};
  var sites = global.SMART_SEDES || [];
  var siteMeta = global.SMART_SEDES_META || {};
  var siteValidation = global.SMART_SEDES_VALIDACION || { valida: false, errores: ["No se cargó el catálogo controlado de sedes."] };
  var additionals = global.SMART_ADICIONALES || [];
  var additionalMeta = global.SMART_ADICIONALES_META || {};
  var additionalValidation = global.SMART_ADICIONALES_VALIDACION || { valida: false, errores: ["No se cargó la configuración de adicionales."], alertas: [] };
  var additionalCampaigns = global.SMART_CAMPANAS_ADICIONALES || [];
  var campaignValidation = global.SMART_CAMPANAS_ADICIONALES_VALIDACION || { valida: false, errores: ["No se cargó la configuración de campañas de adicionales."] };
  var salesManagers = global.SMART_JEFES_VENTAS || [];
  var salesManagerMeta = global.SMART_JEFES_VENTAS_META || {};
  var salesManagerValidation = global.SMART_JEFES_VENTAS_VALIDACION || { valida: false, errores: ["No se cargó la configuración de jefes de ventas."] };
  var tariffValidation = validateTariffCatalog(mixTariffs);
  var catalogsReady = Boolean(siteValidation.valida && tariffValidation.valid && additionalValidation.valida && campaignValidation.valida);
  global.SMART_CONFIG_DIAGNOSTICS = Object.freeze({ producto:"SMART MIX", sedes:siteValidation, tarifas:tariffValidation, adicionales:additionalValidation, campanas:campaignValidation, jefesVentas:salesManagerValidation, configuracionValida:catalogsReady });
  var currentTariff = null;
  var currentCalculation = null;
  var selectedAdditionalIds = new Set();
  var selectedAdditionalOptions = {};
  var exceptionalAuthorization = null;
  var promotionExpired = false;
  var initializing = true;
  var quote = {
    status: "EN_PREPARACION",
    generatedAt: null,
    expiresAt: null,
    reference: null,
    campaignId: null,
    bonusDeadline: null,
    additionalSnapshot: [],
    additionalSignature: "",
    tariffTrace: null,
    enrollmentDate: "",
    salesManagerId: "", negotiationSignature: ""
  };
  var shareContextId = DEFAULT_SHARE_CONTEXT;
  var shareChannelId = "WHATSAPP";
  var shareInProgress = false;
  var preparedWhatsAppMessage = "";
  var whatsappBackupState = "NO_PREPARADO";
  var whatsappOpenedAt = 0;
  var whatsappWindow = null;
  var lastWhatsAppUrl = "";
  var lastWhatsAppOpenAttemptAt = 0;
  // Invalida continuaciones asíncronas de la cotización anterior sin descargar catálogos.
  var quoteSessionVersion = 0;
  var initialQuotePresentation = [];

  function byId(id) {
    return document.getElementById(id);
  }

  var elements = {};

  function collectElements() {
    [
      "cliente", "cliente-pais", "cliente-celular", "cliente-indicativo-otro-row", "cliente-indicativo-otro",
      "cliente-celular-error", "cliente-correo", "cliente-correo-error",
      "asesor", "jefe-ventas-regional", "jefe-ventas", "jefe-ventas-ayuda", "jefe-ventas-error",
      "sede", "observacion", "plan", "condicion",
      "initial-payment-date-error", "numero-pagos", "cuota-propuesta", "mensualidades-deseadas", "shorter-plan-warning", "fecha-matricula", "fecha-acreditacion-pago-inicial-estimada",
      "fecha-primera-cuota", "matricula-fecha-visible", "matricula-fecha-ayuda",
      "matricula-fecha-error", "vigencia-estimada", "finance-empty-help", "first-date-range", "validation-alert",
      "config-validation-alert",
      "commercial-message", "advisor-payment-rows", "client-payment-rows",
      "client-commercial-message", "client-observation-section", "client-expired-alert", "client-contact-details",
      "quote-state-banner", "toast",
      "advisor-view", "client-view", "print-document", "print-guidance-dialog", "gmail-account-dialog",
      "gmail-account-detail",
      "advisor-additional-section", "advisor-additional-options",
      "additional-campaign-status", "paquete-completo-adicionales", "advisor-additional-summary",
      "client-additionals-section", "client-additionals-list", "client-additionals-deadline",
      "client-additionals-expired", "client-additionals-total-section", "client-last-payment-note",
      "progressive-step-indicator", "progressive-completed-choices", "progressive-step-help",
      "share-dialog", "share-context", "share-message-preview", "share-message-length",
      "share-preview-client", "share-preview-language", "share-preview-payment", "share-preview-validity",
      "share-pdf-status", "share-pdf-status-text", "share-channel-note", "share-channel-note-text",
      "share-manual-copy-help", "share-whatsapp-fallback",
      "share-email-fallback", "share-email-subject-row", "share-email-subject", "share-message-label",
      "share-message-format", "share-privacy-note",
      "share-channel-whatsapp", "share-channel-email", "share-manager-notice",
      "gmail-bcc-fallback", "gmail-bcc-message",
      "whatsapp-followup-dialog", "manager-backup-step", "whatsapp-delivery-status",
      "manager-backup-description", "manager-backup-fallback", "manager-backup-status"
    ].forEach(function (id) {
      elements[id] = byId(id);
    });
  }

  function setBoundText(name, value) {
    document.querySelectorAll("[data-bind=\"" + name + "\"]").forEach(function (node) {
      node.textContent = value;
    });
  }

  function setContactFieldError(input, errorNode, message) {
    var text = String(message || "");
    input.setAttribute("aria-invalid", String(Boolean(text)));
    errorNode.textContent = text;
    errorNode.hidden = !text;
  }

  function normalizedClientPhone() {
    return normalizeClientPhone(
      elements["cliente-celular"].value,
      elements["cliente-pais"].value,
      elements["cliente-indicativo-otro"].value
    );
  }

  function validateClientPhone(requiredForWhatsApp) {
    var hasValue = Boolean(elements["cliente-celular"].value.trim());
    var result = normalizeClientPhoneDetailed(
      elements["cliente-celular"].value,
      elements["cliente-pais"].value,
      elements["cliente-indicativo-otro"].value
    );
    var normalized = result.normalized;
    var message = "";
    if ((requiredForWhatsApp || hasValue) && !normalized) {
      if (elements["cliente-pais"].value === "CO") {
        message = "Ingresa un celular colombiano válido de 10 dígitos.";
      } else if (result.reason === "INVALID_DIAL_CODE") {
        message = "Ingresa un indicativo internacional válido de 1 a 4 dígitos.";
      } else {
        message = "Verifica que el número incluya el código de área o prefijo móvil requerido por el país seleccionado.";
      }
    }
    setContactFieldError(elements["cliente-celular"], elements["cliente-celular-error"], message);
    elements["cliente-indicativo-otro"].setAttribute("aria-invalid", String(Boolean(message && elements["cliente-pais"].value === "OTHER")));
    return { valid: !message, normalized: normalized, reason: result.reason, message: message };
  }

  function updateOtherCountryDialVisibility() {
    var isOther = elements["cliente-pais"].value === "OTHER";
    elements["cliente-indicativo-otro-row"].hidden = !isOther;
    if (!isOther) {
      elements["cliente-indicativo-otro"].value = "";
      elements["cliente-indicativo-otro"].setAttribute("aria-invalid", "false");
    }
  }

  function validateClientEmail() {
    var valid = isValidOptionalEmail(elements["cliente-correo"].value);
    setContactFieldError(
      elements["cliente-correo"],
      elements["cliente-correo-error"],
      valid ? "" : "Ingresa un correo electrónico válido o deja el campo vacío."
    );
    return valid;
  }

  function renderClientContactDetails() {
    var details = [];
    var phone = normalizedClientPhone();
    var email = elements["cliente-correo"].value.trim();
    if (phone) {
      details.push(formatClientPhone(phone, elements["cliente-pais"].value, elements["cliente-indicativo-otro"].value));
    }
    if (email && isValidOptionalEmail(email)) {
      details.push(email);
    }
    elements["client-contact-details"].textContent = details.join(" · ");
    elements["client-contact-details"].hidden = details.length === 0;
  }

  function setMoneyInput(value) {
    elements["cuota-propuesta"].value = value === "" || value === null || value === undefined
      ? ""
      : formatInteger(value);
  }

  function uniqueBy(items, key) {
    var seen = new Set();
    return items.filter(function (item) {
      var value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }

  function replaceOptions(select, items, valueKey, labelKey, preferred, placeholder) {
    var previous = preferred == null ? select.value : preferred;
    select.innerHTML = "";
    if (placeholder) {
      var placeholderOption = new Option(placeholder, "");
      placeholderOption.disabled = true;
      select.add(placeholderOption);
    }
    items.forEach(function (item) {
      select.add(new Option(item[labelKey], item[valueKey]));
    });
    var values = items.map(function (item) {
      return String(item[valueKey]);
    });
    select.value = values.indexOf(String(previous)) >= 0 ? String(previous) : "";
  }

  function currentLanguageId() { return "INGLES"; }

  function currentLanguageName() { return "Inglés"; }



  function currentTariffCatalog() { return mixTariffs; }

  function tariffMatchesCurrentSelection(item, context) { return Boolean(context && context.valid && item.producto_id === "SMART_MIX"); }


  function selectedSite() {
    return sites.find(function (site) {
      return site.sede_id === elements.sede.value;
    }) || null;
  }

  function updateManagerRequirement() {
    var valid = Boolean(salesManagerValidation.valida && salesManagerHasValidEmail(selectedSalesManager()));
    byId("btn-generar").disabled = !catalogsReady || !valid;
    byId("btn-generar").setAttribute("aria-disabled", String(byId("btn-generar").disabled));
    byId("generation-manager-help").hidden = valid;
    document.querySelectorAll(".generated-action, .share-action").forEach(function(button) {
      button.disabled = !valid || quote.status !== "VIGENTE";
      button.setAttribute("aria-disabled", String(button.disabled));
    });
  }

  function selectedSalesManager() {
    var selectedGroup = elements["jefe-ventas-regional"].value;
    return salesManagers.find(function (manager) {
      return manager.id === elements["jefe-ventas"].value && manager.activo && (manager.grupos || [manager.grupo]).includes(selectedGroup);
    }) || null;
  }

  function salesManagerHasValidEmail(manager) {
    var email = manager ? String(manager.correo || "").trim() : "";
    return Boolean(manager && manager.activo && email && isValidOptionalEmail(email));
  }

  var SALES_MANAGER_GROUP_LABELS = Object.freeze({
    CUNDINAMARCA: "Bogotá / Cundinamarca",
    MEDELLIN: "Medellín / Antioquia",
    SANTANDER: "Santander",
    BARRANQUILLA: "Barranquilla",
    CALI: "Cali",
    IBAGUE: "Ibagué",
    MANIZALES: "Manizales",
    PEREIRA_ARMENIA: "Pereira / Armenia",
    VILLAVICENCIO: "Villavicencio",
    SINCELEJO: "Sincelejo"
  });
  var SALES_MANAGER_GROUP_ORDER = Object.freeze([
    "CUNDINAMARCA", "MEDELLIN", "SANTANDER", "BARRANQUILLA", "CALI",
    "IBAGUE", "MANIZALES", "PEREIRA_ARMENIA", "VILLAVICENCIO", "SINCELEJO"
  ]);

  function salesManagerGroupLabel(group) {
    if (SALES_MANAGER_GROUP_LABELS[group]) {
      return SALES_MANAGER_GROUP_LABELS[group];
    }
    return String(group || "").toLowerCase().split("_").map(function (part) {
      return part ? part.charAt(0).toUpperCase() + part.slice(1) : "";
    }).join(" ");
  }

  function activeSalesManagerGroups() {
    var groups = Array.from(new Set(salesManagers.filter(function (manager) {
      return manager.activo && manager.grupo;
    }).flatMap(function (manager) {
      return manager.grupos || [manager.grupo];
    })));
    return groups.sort(function (left, right) {
      var leftIndex = SALES_MANAGER_GROUP_ORDER.indexOf(left);
      var rightIndex = SALES_MANAGER_GROUP_ORDER.indexOf(right);
      if (leftIndex < 0) { leftIndex = SALES_MANAGER_GROUP_ORDER.length; }
      if (rightIndex < 0) { rightIndex = SALES_MANAGER_GROUP_ORDER.length; }
      return leftIndex - rightIndex || salesManagerGroupLabel(left).localeCompare(salesManagerGroupLabel(right), "es");
    });
  }

  function populateSalesManagerRegions(preferred) {
    var select = elements["jefe-ventas-regional"];
    var previous = preferred == null ? select.value : preferred;
    var groups = activeSalesManagerGroups();
    select.innerHTML = "";
    select.add(new Option("Selecciona regional o ciudad", ""));
    groups.forEach(function (group) {
      select.add(new Option(salesManagerGroupLabel(group), group));
    });
    select.value = groups.indexOf(previous) >= 0 ? previous : "";
    select.disabled = !salesManagerValidation.valida;
  }

  function populateSalesManagers(preferred) {
    var select = elements["jefe-ventas"];
    var previous = preferred == null ? select.value : preferred;
    var selectedGroup = elements["jefe-ventas-regional"].value;
    var ordered = salesManagers.filter(function (manager) {
      return manager.activo && (manager.grupos || [manager.grupo]).includes(selectedGroup);
    }).sort(function (left, right) {
      return left.nombre.localeCompare(right.nombre, "es");
    });
    select.innerHTML = "";
    select.add(new Option(selectedGroup ? "Selecciona un jefe de ventas" : "Selecciona primero la regional o ciudad", ""));
    ordered.forEach(function (manager) {
      select.add(new Option((manager.nombres_por_grupo || {})[selectedGroup] || manager.nombre, manager.id));
    });
    select.value = ordered.some(function (manager) { return manager.id === previous; }) ? previous : "";
    select.disabled = !salesManagerValidation.valida || !selectedGroup;
    elements["jefe-ventas-error"].hidden = true;
    elements["jefe-ventas-error"].textContent = "";
  }

  function validateSalesManagerForSharing(showMessage) {
    var manager = selectedSalesManager();
    var message = "";
    if (!salesManagerValidation.valida) {
      message = "La configuración interna de jefes de ventas no está disponible.";
    } else if (!elements["jefe-ventas-regional"].value) {
      message = "Selecciona el jefe de ventas responsable para continuar.";
    } else if (!manager) {
      message = "Selecciona el jefe de ventas responsable para continuar.";
    } else if (!salesManagerHasValidEmail(manager)) {
      message = "No fue posible preparar el respaldo porque el jefe seleccionado no tiene un correo válido configurado.";
    }
    elements["jefe-ventas-error"].textContent = message;
    elements["jefe-ventas-error"].hidden = !message;
    elements["jefe-ventas"].setAttribute("aria-invalid", String(Boolean(message)));
    if (message && showMessage !== false) {
      showToast(message);
      (elements["jefe-ventas-regional"].value ? elements["jefe-ventas"] : elements["jefe-ventas-regional"]).focus();
    }
    updateManagerRequirement();
    return message ? null : manager;
  }




  function currentCommercialContext() {
    return resolveCommercialContext(currentLanguageId(), elements.sede.value, sites);
  }

  function populateSites(preferred) {
    replaceOptions(elements.sede, sites.filter(function(s) { return s.sede_activa; }), "sede_id", "nombre_sede", preferred || "", "Selecciona una sede");
    return currentCommercialContext();
  }

  var progressiveFocusTimer = null;
  var PROGRESSIVE_FIELD_IDS = {1:"progressive-field-site",2:"progressive-field-condition",3:"progressive-field-plan",4:"progressive-field-payment"};

  function selectedOptionLabel(select) {
    if (!select || !select.value || select.selectedIndex < 0) {
      return "";
    }
    return select.options[select.selectedIndex].textContent.trim();
  }

  function setProgressiveFieldState(step, visible, enabled) {
    var field = byId(PROGRESSIVE_FIELD_IDS[step]);
    if (!field) {
      return;
    }
    var wasHidden = field.hidden;
    var select = field.querySelector("select");
    field.hidden = !visible;
    field.setAttribute("aria-hidden", String(!visible));
    if (select) {
      select.disabled = !visible || !enabled;
      if (!visible) {
        select.value = "";
      }
    }
    if (visible && wasHidden) {
      field.classList.remove("is-entering");
      global.requestAnimationFrame(function () {
        field.classList.add("is-entering");
        global.setTimeout(function () { field.classList.remove("is-entering"); }, 220);
      });
    }
  }

  function renderProgressiveChoiceSummaries() {
    elements["progressive-completed-choices"].replaceChildren();
    [elements.sede, elements.condicion, elements.plan, elements["numero-pagos"]].map(selectedOptionLabel).filter(Boolean).forEach(function(label) {
      var summary = document.createElement("span"); summary.className = "progressive-choice-summary"; summary.textContent = label;
      elements["progressive-completed-choices"].appendChild(summary);
    });
  }


  function updateProgressiveForm(focusStep) {
    var site = Boolean(selectedSite()), condition = Boolean(elements.condicion.value), plan = Boolean(elements.plan.value), payment = Boolean(elements["numero-pagos"].value);
    setProgressiveFieldState(1, true, siteValidation.valida);
    setProgressiveFieldState(2, site, true);
    setProgressiveFieldState(3, site && condition, true);
    setProgressiveFieldState(4, site && condition && plan, true);
    var step = !site ? 1 : (!condition ? 2 : (!plan ? 3 : 4));
    elements["progressive-step-indicator"].textContent = "Paso " + step + " de 4" + (payment ? " · Selección completa" : "");
    elements["progressive-step-help"].textContent = elements["numero-pagos"].value ? "Selección completa. Continúa con la negociación, los beneficios y las fechas." : ["Selecciona la sede donde se gestionará la matrícula.","Selecciona la condición comercial.","Selecciona los módulos que deseas cotizar.","Selecciona el plan oficial de pago."][step-1];
    renderProgressiveChoiceSummaries();
    global.clearTimeout(progressiveFocusTimer);
    if (focusStep) {
      var field = byId(PROGRESSIVE_FIELD_IDS[focusStep]);
      var select = field && !field.hidden ? field.querySelector("select") : null;
      if (select && !select.disabled) { progressiveFocusTimer = global.setTimeout(function(){ select.focus(); },90); }
    }
  }

  function populatePlans(preferred) {
    var items = uniqueBy(mixTariffs.filter(function(t){return t.condicion_id === elements.condicion.value;}), "plan_id");
    replaceOptions(elements.plan, items, "plan_id", "nombre_plan_interfaz", preferred || "", "Selecciona los módulos");
    elements.plan.disabled = !elements.condicion.value;
  }

  function populateConditions(preferred) {
    var items = uniqueBy(mixTariffs, "condicion_id");
    replaceOptions(elements.condicion, items, "condicion_id", "condicion_comercial", preferred || "", "Selecciona una condición");
    elements.condicion.disabled = !selectedSite();
  }

  function paymentOptionLabel(number) {
    return number === 1
      ? "Pago de contado"
      : number + " pagos — 1 inicial + " + (number - 1) + " mensuales";
  }

  function populatePaymentOptions(preferred) {
    var context = currentCommercialContext();
    var options = currentTariffCatalog().filter(function (item) {
      return tariffMatchesCurrentSelection(item, context) &&
        item.plan_id === elements.plan.value &&
        item.condicion_id === elements.condicion.value;
    }).map(function (item) {
      return { value: item.numero_pagos, label: paymentOptionLabel(item.numero_pagos) };
    });
    replaceOptions(elements["numero-pagos"], options, "value", "label", preferred, "Selecciona una forma de pago");
    elements["numero-pagos"].disabled = !elements.condicion.value;
  }

  function findSelectedTariff() {
    var context = currentCommercialContext();
    if (!catalogsReady || !context.valid) {
      return null;
    }
    var paymentCount = Number(elements["numero-pagos"].value);
    return currentTariffCatalog().find(function (item) {
      return tariffMatchesCurrentSelection(item, context) &&
        item.plan_id === elements.plan.value &&
        item.condicion_id === elements.condicion.value &&
        item.numero_pagos === paymentCount;
    }) || null;
  }

  function activeAdditionalCampaign() {
    return additionalCampaigns.find(function (campaign) {
      return campaignIsActive(campaign);
    }) || null;
  }

  function currentAdditionalContext() {
    var tariff = currentTariff || findSelectedTariff();
    if (!tariff) {
      return null;
    }
    return {
      languageId: tariff.idioma_id,
      planId: tariff.plan_id,
      numberOfModules: tariff.numero_modulos,
      modules: tariff.modulos_incluidos,
      fullListCop: tariff.valor_full_oficial_cop,
      academicHours: tariff.horas_academicas,
      siteId: elements.sede.value,
      conditionId: tariff.condicion_id,
      paymentCount: tariff.numero_pagos
    };
  }

  function applicableAdditionals() {
    var campaign = activeAdditionalCampaign();
    var context = currentAdditionalContext();
    if (!campaign || !context) {
      return [];
    }
    return additionals.filter(function (additional) {
      return additionalIsApplicable(additional, campaign, context);
    }).sort(function (left, right) {
      return left.orden_visual - right.orden_visual;
    });
  }

  function additionalDisplayTitle(additional, context) {
    if (additional.adicional_id === "MATERIAL_ACADEMICO_POR_MODULO" && context) {
      return "Material académico de " + context.numberOfModules + (context.numberOfModules === 1 ? " módulo" : " módulos");
    }
    return additional.titulo_cliente;
  }

  function clearExceptionalAuthorization() {
    exceptionalAuthorization = null;
  }

  function clearAdditionalSelection(clearAuthorization) {
    selectedAdditionalIds.clear();
    selectedAdditionalOptions = {};
    if (clearAuthorization !== false) {
      clearExceptionalAuthorization();
    }
  }

  function currentAdditionalSignature() {
    var applicableIds = new Set(applicableAdditionals().map(function (item) { return item.adicional_id; }));
    var selections = Array.from(selectedAdditionalIds).filter(function (id) {
      return applicableIds.has(id);
    }).sort().map(function (id) {
      return [id, selectedAdditionalOptions[id] || ""];
    });
    var authorization = exceptionalAuthorization ? {
      additionalIds: exceptionalAuthorization.additionalIds.slice().sort(),
      authorizerName: exceptionalAuthorization.authorizerName,
      authorizerRole: exceptionalAuthorization.authorizerRole,
      reason: exceptionalAuthorization.reason,
      authorizationReference: exceptionalAuthorization.authorizationReference,
      newDeadline: exceptionalAuthorization.newDeadline,
      internalObservation: exceptionalAuthorization.internalObservation
    } : null;
    return JSON.stringify({ selections: selections, authorization: authorization });
  }

  function createAdditionalSnapshot(generatedAt, expiresAt) {
    var campaign = activeAdditionalCampaign();
    var context = currentAdditionalContext();
    var authorizedIds = exceptionalAuthorization ? exceptionalAuthorization.additionalIds : [];
    return applicableAdditionals().filter(function (additional) {
      return selectedAdditionalIds.has(additional.adicional_id);
    }).map(function (additional) {
      var authorized = authorizedIds.indexOf(additional.adicional_id) >= 0;
      var deadline = calculateBonusDeadline(
        campaign,
        generatedAt,
        expiresAt,
        authorized && exceptionalAuthorization ? exceptionalAuthorization.newDeadline : null
      );
      var optionId = selectedAdditionalOptions[additional.adicional_id] || "";
      var commercialValue = calculateAdditionalCommercialValue(additional, context, optionId);
      return Object.freeze({
        adicional_id: additional.adicional_id,
        titulo_cliente: additionalDisplayTitle(additional, context),
        descripcion_cliente: additional.descripcion_cliente,
        optionId: optionId,
        optionName: commercialValue.option ? commercialValue.option.nombre_cliente : "",
        valueConfigured: commercialValue.configured,
        valueCop: commercialValue.configured ? commercialValue.valueCop : null,
        unitValueCop: commercialValue.configured ? commercialValue.unitValueCop : null,
        quantity: commercialValue.quantity,
        valueLabel: commercialValue.valueLabel,
        referenceNote: commercialValue.referenceNote,
        authorized: authorized,
        deadline: deadline,
        state: resolveAdditionalStatus({
          active: additional.activo,
          applicable: true,
          selected: true,
          authorized: authorized,
          quoteStatus: "VIGENTE",
          deadline: deadline,
          now: generatedAt
        })
      });
    });
  }

  function bonusDeadlineParts(value) {
    if (!value) {
      return { date: "—", time: "—" };
    }
    var date = new Date(value);
    return {
      date: new Intl.DateTimeFormat("es-CO", {
        timeZone: TIME_ZONE,
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(date),
      time: new Intl.DateTimeFormat("es-CO", {
        timeZone: TIME_ZONE,
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }).format(date)
    };
  }

  function bonusDeadlineMessage(deadline, wording, ending) {
    var parts = bonusDeadlineParts(deadline);
    return (wording || "Formaliza tu matrícula") + " antes del " + parts.date + " a las " + parts.time +
      (ending || " para conservar estos adicionales bonificados.");
  }

  function renderAdvisorAdditionals() {
    if (!elements["advisor-additional-options"]) {
      return;
    }
    var campaign = activeAdditionalCampaign();
    var context = currentAdditionalContext();
    var applicable = applicableAdditionals();
    var applicableIds = new Set(applicable.map(function (item) { return item.adicional_id; }));
    Array.from(selectedAdditionalIds).forEach(function (id) {
      if (!applicableIds.has(id)) {
        selectedAdditionalIds.delete(id);
        delete selectedAdditionalOptions[id];
      }
    });
    elements["advisor-additional-section"].hidden = !campaign || !context;
    elements["advisor-additional-options"].innerHTML = "";
    elements["additional-campaign-status"].textContent = campaign && context
      ? (promotionExpired
        ? "La bonificación anterior venció. Desmarca los adicionales vencidos antes de generar una nueva propuesta."
        : campaign.nombre_campana + (campaign.sincronizar_con_vigencia_cotizacion
          ? " · Vigencia asociada a la fecha de matrícula"
          : " · Vigencia promocional: " + campaign.vigencia_bonificacion_horas + " horas desde la generación"))
      : "Completa programa, condición y forma de pago para consultar adicionales aplicables.";

    applicable.forEach(function (additional) {
      var card = document.createElement("div");
      card.className = "additional-option-card";
      var label = document.createElement("label");
      label.className = "additional-option-label";
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.additionalId = additional.adicional_id;
      checkbox.checked = selectedAdditionalIds.has(additional.adicional_id);
      var copy = document.createElement("span");
      copy.className = "additional-option-copy";
      var title = document.createElement("strong");
      title.className = "additional-option-title";
      title.textContent = additionalDisplayTitle(additional, context);
      var description = document.createElement("small");
      description.className = "additional-option-description";
      description.textContent = additional.descripcion_cliente;
      copy.appendChild(title);
      copy.appendChild(description);

      var value = calculateAdditionalCommercialValue(additional, context, selectedAdditionalOptions[additional.adicional_id]);
      var valueText = document.createElement("p");
      valueText.className = "additional-configured-price";
      if (value.configured) {
        valueText.textContent = value.valueLabel + ": " + formatCOP(value.valueCop);
        copy.appendChild(valueText);
      }

      if (checkbox.checked) {
        var selectedStatus = document.createElement("strong");
        selectedStatus.className = "additional-selection-status";
        selectedStatus.textContent = "Bonificado en esta propuesta";
        copy.appendChild(selectedStatus);
      }

      if (value.referenceNote) {
        var referenceNote = document.createElement("small");
        referenceNote.className = "additional-reference-note";
        referenceNote.textContent = value.referenceNote;
        copy.appendChild(referenceNote);
      }

      if (additional.requiere_opcion) {
        var options = authorizedAdditionalOptions(additional, context);
        var select = document.createElement("select");
        select.className = "quote-input additional-option-select";
        select.dataset.additionalOptionFor = additional.adicional_id;
        select.add(new Option("Selecciona una opción autorizada", ""));
        options.forEach(function (option) {
          select.add(new Option(option.nombre_cliente, option.opcion_id));
        });
        select.value = selectedAdditionalOptions[additional.adicional_id] || "";
        copy.appendChild(select);
      }
      label.appendChild(checkbox);
      label.appendChild(copy);
      card.classList.toggle("is-selected", checkbox.checked);
      card.appendChild(label);
      elements["advisor-additional-options"].appendChild(card);
    });

    elements["paquete-completo-adicionales"].disabled = !campaign || !campaign.paquete_completo_autorizado || !applicable.length;
    elements["paquete-completo-adicionales"].checked = applicable.length > 0 && applicable.every(function (additional) {
      return selectedAdditionalIds.has(additional.adicional_id);
    });
    var selectedValues = applicable.filter(function (additional) {
      return selectedAdditionalIds.has(additional.adicional_id);
    }).map(function (additional) {
      return calculateAdditionalCommercialValue(additional, context, selectedAdditionalOptions[additional.adicional_id]);
    });
    var selectedTotal = sumAdditionalCommercialValues(selectedValues);
    elements["advisor-additional-summary"].textContent = selectedAdditionalIds.size
      ? selectedAdditionalIds.size + (selectedAdditionalIds.size === 1 ? " adicional bonificado seleccionado" : " adicionales bonificados seleccionados") +
        " · Valor económico total de beneficios: " + formatCOP(selectedTotal)
      : "Sin adicionales seleccionados";
  }

  function renderClientAdditionals() {
    if (!elements["client-additionals-section"]) {
      return;
    }
    var snapshots = quote.additionalSnapshot || [];
    elements["client-additionals-section"].hidden = snapshots.length === 0;
    elements["client-additionals-list"].innerHTML = "";
    if (!snapshots.length) {
      elements["client-additionals-total-section"].hidden = true;
      return;
    }
    var activeValues = [];
    var activeBonuses = 0;
    snapshots.forEach(function (snapshot) {
      var state = resolveAdditionalStatus({
        active: true,
        applicable: true,
        selected: true,
        authorized: snapshot.authorized,
        quoteStatus: quote.status,
        deadline: snapshot.deadline
      });
      var card = document.createElement("article");
      card.className = "client-additional-card " + (state === "BONIFICACION_VENCIDA" ? "is-expired" : "is-bonified");
      var icon = document.createElement("span");
      icon.className = "additional-check-icon";
      icon.textContent = state === "BONIFICACION_VENCIDA" ? "!" : "✓";
      var copy = document.createElement("div");
      var title = document.createElement("h4");
      title.textContent = snapshot.titulo_cliente;
      var description = document.createElement("p");
      description.textContent = snapshot.descripcion_cliente;
      copy.appendChild(title);
      if (snapshot.optionName) {
        var option = document.createElement("strong");
        option.className = "client-additional-option";
        option.textContent = snapshot.optionName;
        copy.appendChild(option);
      }
      copy.appendChild(description);
      if (snapshot.valueConfigured) {
        var value = document.createElement("p");
        value.className = "client-additional-value";
        value.textContent = snapshot.valueLabel + ": " + formatCOP(snapshot.valueCop);
        copy.appendChild(value);
      }
      var status = document.createElement("strong");
      status.className = "client-additional-status";
      status.textContent = state === "BONIFICACION_VENCIDA" ? "Bonificación vencida" : "Bonificado en esta propuesta";
      copy.appendChild(status);
      if (snapshot.referenceNote) {
        var reference = document.createElement("small");
        reference.className = "client-additional-reference-note";
        reference.textContent = snapshot.referenceNote;
        copy.appendChild(reference);
      }
      card.appendChild(icon);
      card.appendChild(copy);
      elements["client-additionals-list"].appendChild(card);
      if (state !== "BONIFICACION_VENCIDA") {
        activeBonuses += 1;
        if (snapshot.valueConfigured) {
          activeValues.push(snapshot);
        }
      }
    });
    var deadline = snapshots.map(function (item) { return item.deadline; }).filter(Boolean).sort()[0] || quote.bonusDeadline;
    elements["client-additionals-deadline"].hidden = activeBonuses === 0;
    elements["client-additionals-deadline"].textContent = activeBonuses
      ? bonusDeadlineMessage(deadline, "Formaliza tu matrícula", " para conservar estas bonificaciones.")
      : "";
    elements["client-additionals-expired"].hidden = activeBonuses > 0;
    elements["client-additionals-expired"].textContent = activeBonuses === 0
      ? "La vigencia de estas bonificaciones finalizó. Los adicionales no se incluirán automáticamente y podrán adquirirse por separado según sus tarifas vigentes."
      : "";
    var totalConfigured = sumAdditionalCommercialValues(activeValues);
    elements["client-additionals-total-section"].hidden = totalConfigured === 0 || activeBonuses === 0;
    setBoundText("valor-adicionales-bonificados", formatCOP(totalConfigured));
  }

  function renderAdditionalSections() {
    renderAdvisorAdditionals();
    renderClientAdditionals();
  }

  function refreshInitialPaymentCalendar(options) {
    var settings = options || {};
    var input = elements["fecha-acreditacion-pago-inicial-estimada"];
    var range = initialPaymentDateRange(settings.now);
    input.min = range.min;
    input.max = range.max;
    var valid = validateInitialPaymentDate(input.value, settings.now);
    var message = valid ? "" : "La confirmación estimada del pago inicial debe estar entre hoy y los próximos 30 días calendario.";
    input.setCustomValidity(message);
    setContactFieldError(input, elements["initial-payment-date-error"], message);
    if (!valid && settings.markModified !== false) { markModified(); }
    return valid;
  }

  function updateDateRange(resetDate) {
    refreshInitialPaymentCalendar();
    var accreditationDate = elements["fecha-acreditacion-pago-inicial-estimada"].value;
    var range = firstMonthlyRange(accreditationDate);
    elements["fecha-primera-cuota"].min = range.min;
    elements["fecha-primera-cuota"].max = range.max;
    elements["first-date-range"].textContent = range.min && range.max
      ? "Rango permitido: " + formatDateLong(range.min) + " a " + formatDateLong(range.max) + "."
      : "Selecciona primero la fecha estimada de confirmación del pago inicial.";
    if (resetDate || !validateFirstMonthlyDate(accreditationDate, elements["fecha-primera-cuota"].value)) {
      elements["fecha-primera-cuota"].value = range.min;
    }
  }

  function setPaymentModeVisibility(isCash) {
    document.body.classList.toggle("cash-payment-mode", isCash);
    document.querySelectorAll(".cash-only").forEach(function (node) {
      node.hidden = !isCash;
    });
    document.querySelectorAll(".finance-only").forEach(function (node) {
      node.hidden = isCash;
    });
  }

  function renderProductLabels() { setBoundText("producto-titulo", "Smart Mix · 2026"); setBoundText("idioma-nombre","Inglés"); document.title = "Calculadora Comercial Smart — Smart Mix 2026"; }

  function currentSiteName() {
    var site = selectedSite();
    return site ? site.nombre_sede : "";
  }

  function renderCatalogUpdateLabel() { setBoundText("tarifas-actualizadas","Tarifas Smart Mix · " + tariffMeta.version); }

  function clearEnrollmentDateError() {
    elements["matricula-fecha-error"].textContent = "";
    elements["matricula-fecha-error"].hidden = true;
    elements["fecha-matricula"].setAttribute("aria-invalid", "false");
  }

  function setEnrollmentDateError(message) {
    elements["matricula-fecha-error"].textContent = message;
    elements["matricula-fecha-error"].hidden = !message;
    elements["fecha-matricula"].setAttribute("aria-invalid", String(Boolean(message)));
  }

  function refreshEnrollmentCalendar(options) {
    var settings = options || {};
    refreshInitialPaymentCalendar(settings);
    var now = settings.now instanceof Date ? settings.now : new Date(settings.now || Date.now());
    var enabled = enabledEnrollmentDates(now);
    var input = elements["fecha-matricula"];
    input.min = enabled[0];
    input.max = enabled[2];
    var previous = input.value;
    var valid = isEnabledEnrollmentDate(previous, now);
    if (previous && !valid) {
      input.value = "";
      setEnrollmentDateError("Selecciona hoy, mañana o pasado mañana como fecha de matrícula.");
      if (settings.markModified !== false) {
        markModified();
      }
    } else if (!settings.keepError) {
      clearEnrollmentDateError();
    }
    var selected = input.value;
    elements["matricula-fecha-visible"].textContent = selected
      ? "Matrícula seleccionada: " + formatDateLong(selected)
      : "Selecciona la fecha de matrícula";
    var estimated = selected ? calculateQuoteExpiration(now, selected) : null;
    elements["vigencia-estimada"].textContent = estimated
      ? ensureFinalPeriod("Si generas la cotización ahora, estará vigente hasta el " + formatBogotaDateTime(estimated))
      : "";
    return Boolean(selected && isEnabledEnrollmentDate(selected, now));
  }

  function validateEnrollmentDate(showMessage, now) {
    var valid = refreshEnrollmentCalendar({ now: now || new Date(), markModified: true, keepError: true });
    if (!valid) {
      var message = "Selecciona hoy, mañana o pasado mañana como fecha de matrícula.";
      setEnrollmentDateError(message);
      if (showMessage !== false) {
        showToast(message);
        elements["fecha-matricula"].focus();
      }
    } else {
      clearEnrollmentDateError();
    }
    return valid;
  }


  function clearCalculatedProposal() {
    currentTariff = null;
    currentCalculation = null;
    elements["mensualidades-deseadas"].replaceChildren();
    elements["mensualidades-deseadas"].disabled = true;
    elements["shorter-plan-warning"].textContent = "";
    elements["shorter-plan-warning"].hidden = true;
    setBoundText("plan-nombre", "Selecciona un programa");
    setBoundText("modulos", "—");
    setBoundText("horas", "—");
    setBoundText("condicion", "—");
    setBoundText("valor-lista", "$0");
    setBoundText("descuento", "0,00 %");
    setBoundText("ahorro", "$0");
    setBoundText("valor-total", "$0");
    setBoundText("pago-unico", "$0");
    setBoundText("cuota-propuesta", "—");
    setBoundText("primer-pago", "—");
    setBoundText("saldo", "—");
    setBoundText("mensualidades", "—");
    setBoundText("mensualidad", "—");
    setBoundText("ultima-cuota", "—");
    setBoundText("valor-hora", "$0");
    setBoundText("intensidad", "0");
    setBoundText("numero-pagos-resumen", "—");
    setBoundText("forma-pago", "Selecciona una forma de pago");
    setBoundText("sede", currentSiteName() || "—");
    elements["advisor-payment-rows"].innerHTML = "";
    elements["client-payment-rows"].innerHTML = "";
    elements["commercial-message"].hidden = true;
    elements["client-commercial-message"].hidden = true;
    setMoneyInput("");
    elements["finance-empty-help"].hidden = false;
    setPaymentModeVisibility(false);
    renderAdditionalSections();
  }

  function showCatalogValidation() {
    elements["config-validation-alert"].hidden = catalogsReady;
    elements["config-validation-alert"].textContent = catalogsReady ? "" : "La configuración comercial local requiere revisión.";
    byId("btn-generar").disabled = !catalogsReady || !salesManagerHasValidEmail(selectedSalesManager()); byId("btn-vista-cliente").disabled = !catalogsReady;
  }

  function ensureCommercialAvailability(showMessage) {
    if (!catalogsReady) {
      if (showMessage !== false) {
        showValidation("No es posible generar la cotización en este momento.");
        showToast("La configuración comercial no se encuentra disponible.");
      }
      return null;
    }
    var context = currentCommercialContext();
    if (!context.valid) {
      if (showMessage !== false) {
        showValidation(context.error);
        showToast(context.error);
      }
      return null;
    }
    return context;
  }

  function synchronizeTariff(resetInitial) {
    currentTariff = findSelectedTariff();
    if (!currentTariff) {
      clearCalculatedProposal();
      return;
    }
    if (resetInitial) {
      elements["mensualidades-deseadas"].value = "";
      setMoneyInput("");
    }
    var isCash = currentTariff.numero_pagos === 1;
    setPaymentModeVisibility(isCash);
    if (!isCash) {
      updateDateRange(false);
    }
    calculateAndRender();
  }

  function showValidation(messages) {
    var list = Array.isArray(messages) ? messages.filter(Boolean) : [messages].filter(Boolean);
    elements["validation-alert"].hidden = list.length === 0;
    elements["validation-alert"].textContent = list.join(" ");
  }

  function updateFlexibleOptions() {
    var input = elements["mensualidades-deseadas"];
    var previous = input.value, hadOptions = input.options.length > 1;
    var flex = global.SMART_MIX_CORE.flexibleTerm(currentTariff, parseCOPInput(elements["cuota-propuesta"].value), mixTariffs);
    var options = flex.options.map(function(n) { return {id:n,label:n + (n === 1 ? " mensualidad" : " mensualidades")}; });
    replaceOptions(input, options, "id", "label", previous || (!hadOptions && options.length ? String(options[0].id) : ""), "Selecciona las mensualidades");
    input.disabled = !flex.valid || currentTariff.numero_pagos === 1;
    elements["shorter-plan-warning"].textContent = flex.warning;
    elements["shorter-plan-warning"].hidden = !flex.warning;
    elements["shorter-plan-warning"].classList.toggle("strong-warning", flex.warningLevel === "strong");
  }

  function calculateAndRender() {
    refreshInitialPaymentCalendar();
    if (!ensureCommercialAvailability(false)) {
      var context = currentCommercialContext();
      showValidation(catalogsReady ? context.error : "No es posible calcular porque los catálogos locales no son válidos.");
      clearCalculatedProposal();
      return false;
    }
    currentTariff = findSelectedTariff();
    if (!currentTariff) {
      showValidation("Completa plan, condición comercial y forma de pago con las alternativas oficiales.");
      clearCalculatedProposal();
      return false;
    }
    var isCash = currentTariff.numero_pagos === 1;
    updateFlexibleOptions();
    var proposedText = elements["cuota-propuesta"].value.trim();
    if (!isCash && !proposedText) {
      currentCalculation = null;
      showValidation([]);
      elements["finance-empty-help"].hidden = false;
      renderProposal();
      return false;
    }
    elements["finance-empty-help"].hidden = true;
    var negotiation = global.SMART_MIX_CORE.flexibleTerm(currentTariff, parseCOPInput(proposedText), mixTariffs);
    if (!isCash && !negotiation.valid) {
      currentCalculation = null; showValidation(negotiation.error); renderProposal(); return false;
    }
    currentCalculation = buildPaymentPlan(currentTariff, {
      initialCop: isCash
        ? currentTariff.valor_total_oficial_cop
        : parseCOPInput(proposedText),
      enrollmentDate: elements["fecha-matricula"].value,
      accreditationDate: elements["fecha-acreditacion-pago-inicial-estimada"].value,
      firstMonthlyDate: elements["fecha-primera-cuota"].value,
      monthlyCount: Number(elements["mensualidades-deseadas"].value)
    });
    showValidation(currentCalculation.errors);
    renderProposal();
    return currentCalculation.valid;
  }

  function renderPaymentRows(target, rows, compact) {
    if (!target) {
      return;
    }
    target.innerHTML = "";
    rows.forEach(function (row) {
      var tr = document.createElement("tr");
      if (compact) {
        tr.innerHTML = "<td>" + row.number + "</td><td>" + formatDateLong(row.dueDate) + "</td><td class=\"numeric\">" + formatCOP(row.valueCop) + "</td>";
      } else {
        tr.innerHTML = "<td>" + row.number + "</td><td>" + row.concept + "</td><td>" + formatDateLong(row.dueDate) + "</td><td class=\"numeric\">" + formatCOP(row.valueCop) + "</td><td class=\"numeric\">" + formatCOP(row.balanceAfterCop) + "</td>";
      }
      target.appendChild(tr);
    });
  }

  function commercialMessage() {
    if (!currentTariff || currentTariff.numero_pagos === 1) { return ""; }
    var initial = parseCOPInput(elements["cuota-propuesta"].value), months = Number(elements["mensualidades-deseadas"].value);
    var flex = global.SMART_MIX_CORE.flexibleTerm(currentTariff, initial, mixTariffs);
    if (!flex.valid || !flex.options.includes(months)) { return ""; }
    return "Con una cuota inicial de " + formatCOP(initial) + " y " + months + " mensualidades, cada mensualidad queda aproximadamente en " + formatCOP(roundDivideCOP(currentTariff.valor_total_oficial_cop - initial, months)) + ". La última mensualidad ajusta la diferencia para completar el valor exacto.";
  }

  function renderProposal() {
    if (!currentTariff) {
      return;
    }
    renderProductLabels();
    var calculation = currentCalculation || {};
    var isCash = currentTariff.numero_pagos === 1;
    var calculationValid = Boolean(currentCalculation && currentCalculation.valid);
    var initial = isCash
      ? currentTariff.valor_total_oficial_cop
      : (calculationValid ? calculation.initialCop : null);
    var savings = currentTariff.valor_full_oficial_cop - currentTariff.valor_total_oficial_cop;
    var levelsText = currentTariff.modulos_incluidos.join(", ");
    var formText = isCash
      ? "Pago de contado"
      : (calculationValid ? currentCalculation.rows.length + " pagos: 1 cuota inicial + " + calculation.remainingPayments + " mensualidades" : "Define la cuota inicial y las mensualidades");
    var paymentDate = elements["fecha-acreditacion-pago-inicial-estimada"].value;
    var message = commercialMessage();

    setBoundText("plan-nombre", clientProgramDisplayName(currentTariff));
    setBoundText("modulos", levelsText);
    setBoundText("horas", formatInteger(currentTariff.horas_academicas));
    setBoundText("condicion", currentTariff.condicion_comercial);
    setBoundText("valor-lista", formatCOP(currentTariff.valor_full_oficial_cop));
    setBoundText("descuento", formatPercentExact(currentTariff.porcentaje_descuento_exacto));
    setBoundText("ahorro", formatCOP(savings));
    setBoundText("valor-total", formatCOP(currentTariff.valor_total_oficial_cop));
    setBoundText("pago-unico", formatCOP(currentTariff.valor_total_oficial_cop));
    setBoundText("cuota-propuesta", initial === null ? "—" : formatCOP(initial));
    setBoundText("etiqueta-primer-pago", isCash ? "PAGO ÚNICO" : "HOY PAGAS");
    setBoundText("detalle-primer-pago", isCash ? "Valor total de la propuesta de contado." : "Cuota inicial");
    setBoundText("primer-pago", initial === null ? "—" : formatCOP(initial));
    setBoundText("saldo", calculationValid ? formatCOP(calculation.pendingBalanceCop) : "—");
    setBoundText("mensualidades", isCash ? "0" : (calculationValid ? String(calculation.remainingPayments) : "—"));
    setBoundText("mensualidad", calculationValid ? formatCOP(calculation.regularMonthlyCop) : "—");
    setBoundText("mensualidades-resumen", isCash ? "" : (calculationValid ? calculation.remainingPayments + " cuotas mensuales de" : "Mensualidades por calcular"));
    setBoundText("ultima-cuota", calculationValid ? formatCOP(calculation.lastMonthlyCop) : "—");
    setBoundText("valor-hora", formatCOP(currentTariff.valor_por_hora_mostrado_cop));
    setBoundText("intensidad", formatInteger(currentTariff.maxima_intensidad_mensual_mostrada));
    setBoundText("numero-pagos-resumen", currentCalculation && currentCalculation.valid ? currentCalculation.rows.length + (currentCalculation.rows.length === 1 ? " pago" : " pagos") : "—");
    setBoundText("forma-pago", formText);
    setBoundText("plan-oficial", paymentOptionLabel(currentTariff.numero_pagos));
    setBoundText("fecha-primer-pago", formatDateLong(paymentDate));
    setBoundText("fecha-matricula-estimada", formatDateLong(elements["fecha-matricula"].value));
    setBoundText("fecha-acreditacion-pago-inicial", formatDateLong(elements["fecha-acreditacion-pago-inicial-estimada"].value));
    setBoundText("fecha-primera-cuota", isCash ? "No aplica" : formatDateLong(elements["fecha-primera-cuota"].value));
    setBoundText("plan-proyectado-aclaracion", PROJECTED_PAYMENT_DISCLAIMER);
    setBoundText("cliente", elements.cliente.value.trim() || "Cliente");
    renderClientContactDetails();
    setBoundText("asesor", elements.asesor.value.trim() || "—");
    setBoundText("idioma-nombre", currentTariff.idioma_nombre || currentLanguageName());
    setBoundText("sede", currentSiteName() || "—");
    setBoundText("observacion", elements.observacion.value.trim());
    setBoundText("suma-pagos", calculationValid ? formatCOP(calculation.sumPaymentsCop) : "—");
    setBoundText("diferencia", calculationValid ? formatCOP(calculation.differenceCop) : "—");

    elements["commercial-message"].hidden = !message;
    elements["commercial-message"].textContent = message;
    elements["client-commercial-message"].hidden = !message;
    elements["client-commercial-message"].textContent = message;
    elements["client-observation-section"].hidden = !elements.observacion.value.trim();
    elements["client-last-payment-note"].hidden = isCash || !calculationValid || calculation.lastMonthlyCop === calculation.regularMonthlyCop;
    elements["client-last-payment-note"].textContent = elements["client-last-payment-note"].hidden
      ? ""
      : "Última cuota ajustada: " + formatCOP(calculation.lastMonthlyCop) + ".";
    renderPaymentRows(elements["advisor-payment-rows"], calculationValid ? calculation.rows : [], true);
    renderPaymentRows(elements["client-payment-rows"], calculationValid ? calculation.rows : [], false);
    renderAdditionalSections();
    renderQuoteState();
  }

  function refreshExpiration() {
    var quoteExpired = quote.expiresAt && Date.now() >= new Date(quote.expiresAt).getTime();
    var bonusExpired = (quote.additionalSnapshot || []).some(function (additional) {
      return additional.deadline && Date.now() >= new Date(additional.deadline).getTime();
    });
    if (quote.status === "VIGENTE" && (quoteExpired || bonusExpired)) {
      promotionExpired = promotionExpired || bonusExpired;
      quote.status = "VENCIDA";
      renderQuoteState();
    }
  }

  function renderQuoteState() {
    refreshExpiration();
    setBoundText("estado-cotizacion", quote.status);
    setBoundText("referencia", quote.reference || "Pendiente de generación");
    setBoundText("referencia-corta", quote.reference || "Sin referencia");
    setBoundText("generada-en", quote.generatedAt ? "Generada el " + formatBogotaDateTime(quote.generatedAt) : "Aún no generada");

    var title = "Cotización en preparación";
    var detail = "Configura la propuesta y genera la cotización para activar su vigencia.";
    var validity = "Genera la cotización para activar la vigencia determinada por la fecha de matrícula.";
    var bannerClass = "state-banner state-draft";
    if (quote.status === "VIGENTE") {
      title = "Cotización vigente";
      detail = "Lista para presentar, imprimir o compartir.";
      validity = ensureFinalPeriod("Cotización personalizada válida hasta el " + formatBogotaDateTime(quote.expiresAt));
      bannerClass = "state-banner state-valid";
    } else if (quote.status === "MODIFICADA") {
      title = "Cotización modificada";
      detail = "Los datos cambiaron. Debes generar nuevamente la cotización para asignar una nueva vigencia.";
      validity = "Cotización modificada. Genera nuevamente para activar una nueva vigencia.";
      bannerClass = "state-banner state-modified";
    } else if (quote.status === "VENCIDA") {
      title = "Cotización vencida";
      detail = "Esta cotización ya no se encuentra vigente. Genera una nueva propuesta para validar las condiciones disponibles.";
      validity = detail;
      bannerClass = "state-banner state-expired";
    }
    setBoundText("estado-titulo", title);
    setBoundText("estado-detalle", detail);
    setBoundText("vigencia", validity);
    elements["quote-state-banner"].className = bannerClass;
    elements["client-expired-alert"].hidden = quote.status !== "VENCIDA";
    document.querySelectorAll(".generated-action").forEach(function (button) {
      button.disabled = quote.status !== "VIGENTE";
    });
    updateShareControls();
    updateManagerRequirement();
    renderClientAdditionals();
    if (elements["share-dialog"] && elements["share-dialog"].open && quote.reference) {
      renderSharePreview();
    }
  }

  function markModified() {
    if (initializing) {
      return;
    }
    preparedWhatsAppMessage = "";
    if (quote.status === "VIGENTE" || quote.status === "VENCIDA") {
      quote.status = "MODIFICADA";
      quote.generatedAt = null;
      quote.expiresAt = null;
      quote.reference = null;
      quote.campaignId = null;
      quote.bonusDeadline = null;
      quote.additionalSnapshot = [];
      quote.additionalSignature = "";
      quote.tariffTrace = null;
      quote.enrollmentDate = "";
      quote.salesManagerId = "";
    }
    renderQuoteState();
  }

  function resetDependentTariffSelectors() {
    clearAdditionalSelection(); populateConditions(""); populatePlans(""); populatePaymentOptions(""); clearCalculatedProposal();
  }



  function handleSiteChange() { markModified(); resetDependentTariffSelectors(); showValidation([]); updateProgressiveForm(2); }

  function handlePlanChange() { markModified(); clearAdditionalSelection(); populatePaymentOptions(""); clearCalculatedProposal(); updateProgressiveForm(4); }

  function handleConditionChange() { markModified(); clearAdditionalSelection(); populatePlans(""); populatePaymentOptions(""); clearCalculatedProposal(); updateProgressiveForm(3); }

  function handlePaymentChange() {
    markModified();
    clearAdditionalSelection();
    synchronizeTariff(true);
    updateProgressiveForm();
  }

  function handleSalesManagerChange() {
    markModified();
    validateSalesManagerForSharing(false);
  }

  function handleEnrollmentChange() {
    markModified();
    refreshEnrollmentCalendar({ markModified: false });
    calculateAndRender();
  }

  function handleMoneyInput() {
    markModified();
    calculateAndRender();
  }

  function normalizeMoneyField() {
    var parsed = parseCOPInput(elements["cuota-propuesta"].value);
    if (parsed !== null) {
      setMoneyInput(parsed);
    }
    calculateAndRender();
  }

  function handleAdditionalOptionsChange(event) {
    var checkbox = event.target.closest("input[data-additional-id]");
    var optionSelect = event.target.closest("select[data-additional-option-for]");
    if (!checkbox && !optionSelect) {
      return;
    }
    clearExceptionalAuthorization();
    markModified();
    if (checkbox) {
      if (checkbox.checked) {
        selectedAdditionalIds.add(checkbox.dataset.additionalId);
      } else {
        selectedAdditionalIds.delete(checkbox.dataset.additionalId);
        delete selectedAdditionalOptions[checkbox.dataset.additionalId];
      }
    }
    if (optionSelect) {
      selectedAdditionalOptions[optionSelect.dataset.additionalOptionFor] = optionSelect.value;
    }
    renderAdditionalSections();
  }

  function handleFullPackageChange() {
    clearExceptionalAuthorization();
    markModified();
    if (elements["paquete-completo-adicionales"].checked) {
      applicableAdditionals().forEach(function (additional) {
        selectedAdditionalIds.add(additional.adicional_id);
      });
    } else {
      clearAdditionalSelection(false);
    }
    renderAdditionalSections();
  }

  function generateQuote() {
    if (!validateSalesManagerForSharing(true)) { showValidation("Selecciona el jefe de ventas responsable para continuar."); return; }
    if (!ensureCommercialAvailability(true)) {
      return;
    }
    if (!calculateAndRender()) {
      showToast("Corrige las validaciones antes de generar la cotización.");
      return;
    }
    var phoneValidation = validateClientPhone(false);
    var emailValid = validateClientEmail();
    if (!phoneValidation.valid || !emailValid) {
      showValidation(!phoneValidation.valid
        ? "Revisa el número de celular del cliente antes de generar la cotización."
        : "Revisa el correo electrónico del cliente antes de generar la cotización.");
      (!phoneValidation.valid ? elements["cliente-celular"] : elements["cliente-correo"]).focus();
      showToast("Corrige los datos de contacto diligenciados.");
      return;
    }
    var missing = [];
    if (!elements.cliente.value.trim()) {
      missing.push("nombre del cliente");
    }
    if (!elements.asesor.value.trim()) {
      missing.push("nombre del asesor");
    }
    if (!elements.sede.value.trim()) {
      missing.push("sede");
    }
    if (missing.length) {
      showValidation("Completa " + missing.join(", ") + " antes de generar la cotización.");
      showToast("Faltan datos de la propuesta.");
      return;
    }
    var applicable = applicableAdditionals();
    var optionErrors = applicable.filter(function (additional) {
      return selectedAdditionalIds.has(additional.adicional_id) && additional.requiere_opcion &&
        !selectedAdditionalOptions[additional.adicional_id];
    }).map(function (additional) {
      return "Selecciona una opción autorizada para " + additional.titulo_cliente + ".";
    });
    if (optionErrors.length) {
      showValidation(optionErrors);
      showToast("Completa la configuración de los adicionales seleccionados.");
      return;
    }
    if (promotionExpired && selectedAdditionalIds.size) {
      showValidation("La bonificación promocional anterior venció. Desmarca los adicionales vencidos antes de generar una nueva propuesta.");
      showToast("Las bonificaciones vencidas no se reinician automáticamente.");
      return;
    }
    var now = new Date();
    if (!validateEnrollmentDate(true, now)) {
      showValidation("Selecciona hoy, mañana o pasado mañana como fecha de matrícula.");
      return;
    }
    var calculatedExpiration = calculateQuoteExpiration(now, elements["fecha-matricula"].value);
    if (!calculatedExpiration) {
      showValidation("Selecciona hoy, mañana o pasado mañana como fecha de matrícula.");
      return;
    }
    quote.generatedAt = now.toISOString();
    quote.expiresAt = calculatedExpiration.toISOString();
    quote.enrollmentDate = elements["fecha-matricula"].value;
    quote.salesManagerId = elements["jefe-ventas"].value || "";
    quote.reference = createQuoteReference(now);
    var campaign = activeAdditionalCampaign();
    quote.campaignId = campaign ? campaign.campana_id : null;
    quote.additionalSnapshot = createAdditionalSnapshot(quote.generatedAt, quote.expiresAt);
    quote.additionalSignature = currentAdditionalSignature();
    quote.tariffTrace = null;
    quote.negotiationSignature = currentNegotiationSignature();
    quote.bonusDeadline = quote.additionalSnapshot.map(function (additional) {
      return additional.deadline;
    }).filter(Boolean).sort()[0] || null;
    promotionExpired = false;
    quote.status = "VIGENTE";
    preparedWhatsAppMessage = "";
    showValidation([]);
    renderProposal();
    showToast(ensureFinalPeriod("Cotización generada. Vigente hasta el " + formatBogotaDateTime(quote.expiresAt)));
  }

  function currentNegotiationSignature() {
    return JSON.stringify(["cliente","cliente-pais","cliente-indicativo-otro","cliente-celular","cliente-correo","asesor","observacion","sede","condicion","plan","numero-pagos","cuota-propuesta","mensualidades-deseadas","fecha-matricula","fecha-acreditacion-pago-inicial-estimada","fecha-primera-cuota"].map(function(id){ return elements[id].value; }));
  }

  function ensureCurrentQuote() {
    if (!validateSalesManagerForSharing(true)) { return false; }
    if (!refreshInitialPaymentCalendar()) { showToast(elements["initial-payment-date-error"].textContent); return false; }
    if (!ensureCommercialAvailability(true)) {
      return false;
    }
    var selectedTariff = findSelectedTariff();
    if (!currentTariff || selectedTariff !== currentTariff || !currentCalculation || !currentCalculation.valid ||
        quote.additionalSignature !== currentAdditionalSignature() ||
        quote.negotiationSignature !== currentNegotiationSignature() ||
        quote.enrollmentDate !== elements["fecha-matricula"].value ||
        quote.salesManagerId !== (elements["jefe-ventas"].value || "")) {
      quote.status = "MODIFICADA";
      quote.generatedAt = null;
      quote.expiresAt = null;
      quote.reference = null;
      quote.campaignId = null;
      quote.bonusDeadline = null;
      quote.additionalSnapshot = [];
      quote.additionalSignature = "";
      quote.tariffTrace = null;
      quote.enrollmentDate = "";
      quote.salesManagerId = "";
      preparedWhatsAppMessage = "";
      renderQuoteState();
      showToast("La selección comercial cambió. Genera nuevamente la cotización.");
      return false;
    }
    refreshExpiration();
    if (quote.status !== "VIGENTE") {
      showToast("Debes generar nuevamente una cotización vigente para usar esta función.");
      return false;
    }
    return true;
  }

  function showClientView() {
    if (!ensureCommercialAvailability(true) || !calculateAndRender()) {
      return;
    }
    elements["advisor-view"].hidden = true;
    elements["client-view"].hidden = false;
    document.body.classList.add("client-mode");
    global.scrollTo(0, 0);
  }

  function showAdvisorView() {
    elements["client-view"].hidden = true;
    elements["advisor-view"].hidden = false;
    document.body.classList.remove("client-mode");
    global.scrollTo(0, 0);
  }

  function currentWhatsAppMessageData(contextId) {
    var now = Date.now();
    var quoteExpired = Boolean(quote.expiresAt && now >= new Date(quote.expiresAt).getTime());
    var snapshots = Array.isArray(quote.additionalSnapshot) ? quote.additionalSnapshot : [];
    var benefitsExpired = !quoteExpired && snapshots.some(function (additional) {
      return additional.deadline && now >= new Date(additional.deadline).getTime();
    });
    var configuredTotal = sumAdditionalCommercialValues(snapshots.filter(function (additional) {
      return additional.valueConfigured;
    }));
    var deadline = snapshots.length && !benefitsExpired ? (quote.bonusDeadline || quote.expiresAt) : quote.expiresAt;
    var deadlineParts = bonusDeadlineParts(deadline);
    var isCash = currentTariff && currentTariff.numero_pagos === 1;
    var manager = selectedSalesManager();
    var formattedPhone = normalizedClientPhone();
    return {
      contextId: normalizeShareContext(contextId),
      clientName: elements.cliente.value.trim(),
      advisorName: elements.asesor.value.trim(),
      clientPhoneNormalized: formattedPhone,
      clientPhoneFormatted: formattedPhone
        ? formatClientPhone(formattedPhone, elements["cliente-pais"].value, elements["cliente-indicativo-otro"].value)
        : "No registrado",
      clientEmail: elements["cliente-correo"].value.trim(),
      languageId: currentLanguageId(),
      languageName: currentLanguageName(),
      managerId: manager ? manager.id : "",
      managerName: manager ? manager.nombre : "",
      managerEmail: manager ? manager.correo : "",
      siteName: currentSiteName(),
      programName: clientProgramDisplayName(currentTariff),
      modulesIncluded: currentTariff ? currentTariff.modulos_incluidos : [],
      academicHours: currentTariff ? currentTariff.horas_academicas : 0,
      numberOfPayments: currentCalculation ? currentCalculation.rows.length : 0,
      officialPayments: currentTariff ? currentTariff.numero_pagos : 0,
      conditionName: currentTariff ? currentTariff.condicion_comercial : "",
      observation: elements.observacion.value.trim(),
      initialCop: currentCalculation ? currentCalculation.initialCop : 0,
      remainingPayments: currentCalculation ? currentCalculation.remainingPayments : 0,
      regularMonthlyCop: currentCalculation ? currentCalculation.regularMonthlyCop : 0,
      lastMonthlyCop: currentCalculation ? currentCalculation.lastMonthlyCop : 0,
      firstMonthlyDateText: formatDateLong(elements["fecha-primera-cuota"].value),
      accreditationDateText: formatDateLong(elements["fecha-acreditacion-pago-inicial-estimada"].value),
      totalContractCop: currentTariff ? currentTariff.valor_total_oficial_cop : 0,
      savingsCop: currentTariff ? currentTariff.valor_full_oficial_cop - currentTariff.valor_total_oficial_cop : 0,
      discountText: currentTariff ? formatPercentExact(currentTariff.porcentaje_descuento_exacto) : "0,00 %",
      additionals: snapshots.map(function (additional) {
        return {
          title: additional.titulo_cliente,
          optionName: additional.optionName || "",
          valueConfigured: additional.valueConfigured,
          valueCop: additional.valueCop,
          valueLabel: additional.valueLabel || "Valor comercial"
        };
      }),
      additionalsTotalCop: configuredTotal,
      quoteStatus: quote.status,
      quoteExpired: quoteExpired,
      benefitsExpired: benefitsExpired,
      expirationDate: deadlineParts.date,
      expirationTime: deadlineParts.time,
      expirationText: formatBogotaDateTime(quote.expiresAt),
      reference: quote.reference || "",
      isCash: isCash,
      paymentLabel: isCash ? "Pago de contado" : "Financiación · " + (currentCalculation ? currentCalculation.rows.length : 0) + " pagos acordados"
    };
  }

  function ensureShareableQuote() {
    if (!refreshInitialPaymentCalendar()) { showToast(elements["initial-payment-date-error"].textContent); return false; }
    if (!ensureCommercialAvailability(true)) {
      return false;
    }
    var selectedTariff = findSelectedTariff();
    if (!currentTariff || selectedTariff !== currentTariff || !currentCalculation || !currentCalculation.valid ||
        quote.additionalSignature !== currentAdditionalSignature() ||
        quote.negotiationSignature !== currentNegotiationSignature() ||
        quote.enrollmentDate !== elements["fecha-matricula"].value ||
        quote.salesManagerId !== (elements["jefe-ventas"].value || "")) {
      markModified();
      showToast("La selección comercial cambió. Genera nuevamente la cotización antes de compartir.");
      return false;
    }
    refreshExpiration();
    if (!quote.reference || !quote.generatedAt || !quote.expiresAt || quote.status !== "VIGENTE") {
      showToast(quote.status === "VENCIDA"
        ? "Esta cotización ya no se encuentra vigente. Genera una nueva propuesta para validar las condiciones disponibles."
        : "Genera una cotización antes de preparar el mensaje.");
      return false;
    }
    if (!validateSalesManagerForSharing(true)) {
      return false;
    }
    return true;
  }

  function updateShareControls() {
    var enabled = Boolean(quote.reference && quote.generatedAt && quote.expiresAt && quote.status === "VIGENTE");
    enabled = Boolean(enabled && salesManagerValidation.valida && selectedSalesManager());
    document.querySelectorAll(".share-action").forEach(function (button) {
      button.disabled = !enabled;
      button.setAttribute("aria-disabled", String(button.disabled));
    });
  }

  function updateShareDiagnostics(data, message, capability, action, result, channel) {
    var diagnostics = whatsAppMessageDiagnostics(message);
    var corporateIdentity = obtenerCorreoCorporativoAutenticado();
    global.SMART_LAST_SHARE_DIAGNOSTICS = Object.freeze({
      canal: channel || shareChannelId,
      contexto: data.contextId,
      idioma: data.languageId,
      formaPago: data.isCash ? "CONTADO" : "FINANCIADO",
      cotizacionVencida: data.quoteExpired,
      beneficiosVencidos: data.benefitsExpired,
      caracteres: diagnostics.characterCount,
      emoticones: diagnostics.emojiCount,
      unicodeNormalizadoNFC: diagnostics.normalizedNFC,
      contieneCaracterReemplazo: diagnostics.hasReplacementCharacter,
      cantidadCTA: diagnostics.ctaOccurrences,
      contieneTerminosTecnicos: diagnostics.hasTechnicalTerms,
      nombrePdfSugerido: buildPdfFileName(data),
      compartirTextoDisponible: capability.canShareText,
      compartirArchivoDisponible: capability.canShareFiles,
      modoPdf: capability.pdfMode,
      identidadCorreo: corporateIdentity.status,
      correoCorporativoIdentificado: corporateIdentity.valid ? corporateIdentity.email : "",
      accion: action || "VISTA_PREVIA",
      resultado: result || "PREPARADA"
    });
  }

  function validateClientEmailForShare() {
    var email = elements["cliente-correo"].value.trim();
    var message = "";
    if (!email) {
      message = "Ingresa el correo electrónico del cliente para preparar el envío.";
    } else if (!isValidOptionalEmail(email)) {
      message = "Verifica el correo electrónico del cliente.";
    }
    setContactFieldError(elements["cliente-correo"], elements["cliente-correo-error"], message);
    return { valid: !message, email: email, message: message };
  }

  function setShareChannel(channel) {
    shareChannelId = ["WHATSAPP", "EMAIL"].indexOf(channel) >= 0 ? channel : "WHATSAPP";
    elements["share-channel-whatsapp"].checked = shareChannelId === "WHATSAPP";
    elements["share-channel-email"].checked = shareChannelId === "EMAIL";
    elements["share-whatsapp-fallback"].hidden = true;
    elements["share-email-fallback"].hidden = true;
    byId("btn-copiar-mensaje-manual").textContent = shareChannelId === "EMAIL"
      ? "Copiar correo"
      : "Copiar mensaje manualmente";
    elements["share-channel-note-text"].textContent = shareChannelId === "EMAIL"
      ? "Adjunta manualmente el PDF de la cotización antes de enviar el correo."
      : "Adjunta manualmente el PDF de la cotización antes de enviar.";
    elements["share-manual-copy-help"].textContent = shareChannelId === "EMAIL"
      ? "Usa esta opción si necesitas copiar el contenido del correo."
      : "Usa esta opción únicamente si WhatsApp no carga el mensaje automáticamente.";
    byId("btn-descargar-pdf-compartir").textContent = "Descargar PDF";
    byId("btn-compartir-dialog").textContent = shareChannelId === "EMAIL"
      ? "Preparar correo en Gmail"
      : "Enviar por WhatsApp";
  }

  function preparedWhatsAppMessageFor(data, rebuild) {
    if (rebuild || !preparedWhatsAppMessage) {
      preparedWhatsAppMessage = construirMensajeWhatsApp(data, data.contextId);
    }
    return preparedWhatsAppMessage;
  }

  function renderSharePreview() {
    if (!currentTariff || !currentCalculation) {
      return;
    }
    var data = currentWhatsAppMessageData(shareContextId);
    var emailMode = shareChannelId === "EMAIL";
    var subject = buildEmailSubject(data);
    var message = emailMode ? buildEmailBody(data) : preparedWhatsAppMessageFor(data, true);
    var capability = detectShareCapabilities(navigator, null);
    var pdfAvailable = quote.status === "VIGENTE" && !data.quoteExpired && !data.benefitsExpired;
    elements["share-preview-client"].textContent = data.clientName || "—";
    elements["share-preview-language"].textContent = "Smart Mix · Inglés";
    elements["share-preview-payment"].textContent = data.paymentLabel;
    elements["share-preview-validity"].textContent = data.quoteExpired
      ? "Cotización vencida"
      : (data.benefitsExpired ? "Cotización vigente · Bonificaciones por validar" : "Cotización vigente");
    elements["share-context"].value = data.contextId;
    elements["share-email-subject-row"].hidden = !emailMode;
    elements["share-email-subject"].textContent = subject;
    elements["share-message-label"].textContent = emailMode
      ? "Vista previa del correo"
      : "Vista previa del mensaje para WhatsApp";
    elements["share-message-format"].textContent = emailMode
      ? "Texto preparado para un borrador en Gmail."
      : "Texto plano compatible con WhatsApp.";
    elements["share-message-preview"].textContent = message;
    elements["share-message-length"].textContent = String(message.length);
    var manager = selectedSalesManager();
    elements["share-manager-notice"].textContent = manager
      ? (emailMode
        ? "Se preparará una copia oculta para " + manager.nombre + "."
        : "El respaldo para " + manager.nombre + " se prepara únicamente después de que confirmes manualmente el envío por WhatsApp.")
      : "Selecciona el jefe de ventas para habilitar las acciones de compartir.";
    elements["share-pdf-status"].classList.toggle("is-unavailable", !pdfAvailable);
    elements["share-pdf-status-text"].textContent = pdfAvailable
      ? "Disponible para descargar como “" + buildPdfFileName(data) + "”. El archivo se adjunta manualmente si el dispositivo no permite compartirlo."
      : "No disponible para esta propuesta. Genera nuevamente una cotización vigente antes de descargar el PDF.";
    byId("btn-descargar-pdf-compartir").disabled = !pdfAvailable;
    elements["share-whatsapp-fallback"].hidden = true;
    elements["share-email-fallback"].hidden = true;
    setShareChannel(shareChannelId);
    updateShareDiagnostics(data, message, capability, "VISTA_PREVIA", "PREPARADA", shareChannelId);
  }

  function openSharePreview() {
    if (!ensureShareableQuote()) {
      return;
    }
    setShareChannel("WHATSAPP");
    renderSharePreview();
    if (typeof elements["share-dialog"].showModal === "function") {
      elements["share-dialog"].showModal();
    } else {
      elements["share-dialog"].setAttribute("open", "");
    }
  }

  function closeSharePreview() {
    elements["share-whatsapp-fallback"].hidden = true;
    elements["share-email-fallback"].hidden = true;
    if (typeof elements["share-dialog"].close === "function") {
      elements["share-dialog"].close();
    } else {
      elements["share-dialog"].removeAttribute("open");
    }
  }

  async function copyShareFromPreview() {
    if (!ensureShareableQuote()) {
      return;
    }
    var operationVersion = quoteSessionVersion;
    var data = currentWhatsAppMessageData(shareContextId);
    var emailMode = shareChannelId === "EMAIL";
    var message = emailMode
      ? buildEmailSubject(data) + "\n\n" + buildEmailBody(data)
      : preparedWhatsAppMessageFor(data, false);
    var capability = detectShareCapabilities(navigator, null);
    if (emailMode) {
      var emailCopied = await copyTextValue(message);
      if (operationVersion !== quoteSessionVersion) { return; }
      showToast(emailCopied ? "Correo copiado." : "No fue posible copiar automáticamente.");
      updateShareDiagnostics(data, message, capability, "COPIAR_CORREO", emailCopied ? "COPIADO" : "NO_COPIADO", shareChannelId);
      return;
    }

    try {
      const mensajeWhatsAppFinal = validarMensajeUnicode(message);
      var copyResult = await copiarMensajeSinLeer(mensajeWhatsAppFinal);
      if (operationVersion !== quoteSessionVersion) { return; }
      registrarDiagnosticoWhatsApp({
        mensajeConstruido: mensajeWhatsAppFinal,
        mensajeNormalizado: mensajeWhatsAppFinal,
        mensajeRecuperado: mensajeWhatsAppFinal,
        metodoUtilizado: "CLIPBOARD_FALLBACK",
        archivoYFuncionDano: "NINGUNO_EN_APLICACION",
        resultadoWhatsAppWeb: "NO_APLICA_SOLO_COPIA",
        portapapelesCopiado: copyResult.copiado,
        portapapelesVerificado: null
      });
      updateShareDiagnostics(data, mensajeWhatsAppFinal, capability, "COPIAR_MENSAJE", copyResult.copiado ? "COPIADO" : "NO_COPIADO", "WHATSAPP");
      showToast(copyResult.copiado
        ? "Mensaje copiado. Pégalo en WhatsApp."
        : "No fue posible copiar automáticamente. Selecciona el texto desde la vista previa.");
    } catch (error) {
      if (operationVersion !== quoteSessionVersion) { return; }
      updateShareDiagnostics(data, message, capability, "COPIAR_MENSAJE", "UNICODE_INVALIDO", "WHATSAPP");
      showToast("El mensaje contiene Unicode inválido y no se copiará. Regenera la cotización.");
    }
  }

  function prepareEmailShareStep() {
    if (!ensureShareableQuote()) {
      return;
    }
    if (!elements.cliente.value.trim()) {
      showToast("Ingresa el nombre del cliente antes de compartir la cotización.");
      elements.cliente.focus();
      return;
    }
    var emailValidation = validateClientEmailForShare();
    if (!emailValidation.valid) {
      showToast(emailValidation.message);
      elements["cliente-correo"].focus();
      return;
    }
    var data = currentWhatsAppMessageData(shareContextId);
    var message = buildEmailBody(data);
    if (!message.trim()) {
      showToast("No fue posible preparar el contenido. Genera nuevamente la cotización.");
      return;
    }
    var identity = obtenerCorreoCorporativoAutenticado();
    if (!identity.valid) {
      showToast("Debes ingresar con una cuenta corporativa de Smart para preparar el correo.");
      updateShareDiagnostics(data, message, detectShareCapabilities(navigator, null), "PREPARAR_CORREO", "DOMINIO_CORPORATIVO_INVALIDO", "EMAIL");
      return;
    }
    requestGmailAccountConfirmation();
  }

  function abrirWhatsApp(numero, cotizacion, contexto, mensajeExistente, diagnosticoAdicional) {
    const mensajeWhatsAppFinal = mensajeExistente === undefined || mensajeExistente === null
      ? construirMensajeWhatsApp(cotizacion, contexto)
      : validarMensajeUnicode(mensajeExistente);
    const resultado = construirUrlWhatsAppWeb(numero, mensajeWhatsAppFinal);
    const extra = diagnosticoAdicional || {};

    registrarDiagnosticoWhatsApp({
      mensajeConstruido: mensajeWhatsAppFinal,
      mensajeNormalizado: resultado.mensaje,
      mensajeRecuperado: resultado.mensajeRecuperado,
      urlFinal: resultado.url,
      metodoUtilizado: "PREFILL_URL",
      archivoYFuncionDano: "NINGUNO_EN_APLICACION",
      resultadoWhatsAppWeb: extra.resultadoWhatsAppWeb || "PENDIENTE_VERIFICACION_EXTERNA",
      portapapelesCopiado: extra.portapapelesCopiado,
      portapapelesVerificado: extra.portapapelesVerificado
    });

    var ventana = null;
    var reutilizada = false;
    if (whatsappWindow && !whatsappWindow.closed && lastWhatsAppUrl === resultado.url) {
      whatsappWindow.focus();
      ventana = whatsappWindow;
      reutilizada = true;
    } else {
      ventana = global.open(resultado.url, "_blank", "noopener,noreferrer");
      if (ventana) {
        whatsappWindow = ventana;
        lastWhatsAppUrl = resultado.url;
      }
    }
    return {
      ventana: ventana,
      reutilizada: reutilizada,
      url: resultado.url,
      mensajeOriginal: resultado.mensaje,
      mensajeRecuperado: resultado.mensajeRecuperado
    };
  }

  async function shareCurrentQuote() {
    if (shareInProgress) {
      return;
    }
    if (!ensureShareableQuote()) {
      return;
    }
    if (!elements.cliente.value.trim()) {
      showToast("Ingresa el nombre del cliente antes de compartir la cotización.");
      elements.cliente.focus();
      return;
    }
    var phoneValidation = validateClientPhone(true);
    if (!phoneValidation.valid) {
      showToast(phoneValidation.message);
      elements["cliente-celular"].focus();
      return;
    }
    var now = Date.now();
    if (now - lastWhatsAppOpenAttemptAt < 2500) {
      showToast("WhatsApp Web ya se está preparando. Evita pulsar el botón varias veces.");
      return;
    }
    lastWhatsAppOpenAttemptAt = now;
    shareInProgress = true;
    byId("btn-compartir-dialog").disabled = true;
    byId("btn-compartir-dialog").textContent = "Preparando WhatsApp…";
    var data = currentWhatsAppMessageData(shareContextId);
    var capability = detectShareCapabilities(navigator, null);
    try {
      const mensajeWhatsAppFinal = validarMensajeUnicode(preparedWhatsAppMessageFor(data, false));
      const opening = abrirWhatsApp(
        phoneValidation.normalized,
        data,
        data.contextId,
        mensajeWhatsAppFinal,
        {
          resultadoWhatsAppWeb: "URL_DIRECTA_ABIERTA; COMPOSITOR_PENDIENTE_DE_VERIFICACION",
          portapapelesCopiado: false,
          portapapelesVerificado: null
        }
      );

      if (opening.ventana) {
        whatsappBackupState = "WHATSAPP_ABIERTO";
        whatsappOpenedAt = Date.now();
      }
      elements["share-whatsapp-fallback"].href = opening.url;
      elements["share-whatsapp-fallback"].hidden = Boolean(opening.ventana);
      updateShareDiagnostics(
        data,
        mensajeWhatsAppFinal,
        capability,
        "COMPARTIR_WHATSAPP",
        opening.reutilizada ? "PESTANA_REUTILIZADA" : (opening.ventana ? "WHATSAPP_WEB_ABIERTO" : "PESTANA_BLOQUEADA"),
        "WHATSAPP"
      );
      showToast(opening.ventana
        ? "WhatsApp Web se abrió. Verifica que el mensaje aparezca antes de enviarlo. Adjunta manualmente el PDF de la cotización."
        : "El navegador bloqueó la pestaña. Usa «Abrir WhatsApp Web» y verifica el mensaje antes de enviarlo.");
    } catch (error) {
      var originalMessage = preparedWhatsAppMessageFor(data, false);
      registrarDiagnosticoWhatsApp({
        mensajeConstruido: originalMessage,
        mensajeNormalizado: originalMessage,
        urlFinal: "",
        metodoUtilizado: "CLIPBOARD_FALLBACK",
        archivoYFuncionDano: "aplicacion.js::shareCurrentQuote",
        resultadoWhatsAppWeb: "NO_ABIERTO_POR_ERROR_UNICODE_O_URL",
        portapapelesCopiado: false,
        portapapelesVerificado: null
      });
      updateShareDiagnostics(data, originalMessage, capability, "COMPARTIR_WHATSAPP", "NO_ABIERTO_POR_ERROR", "WHATSAPP");
      elements["share-whatsapp-fallback"].hidden = true;
      showToast("No se abrirá WhatsApp con texto dañado. Usa «Copiar mensaje manualmente» como contingencia.");
    } finally {
      shareInProgress = false;
      byId("btn-compartir-dialog").disabled = false;
      byId("btn-compartir-dialog").textContent = "Enviar por WhatsApp";
    }
  }

  function closeWhatsAppFollowup() {
    if (typeof elements["whatsapp-followup-dialog"].close === "function") {
      elements["whatsapp-followup-dialog"].close();
    } else {
      elements["whatsapp-followup-dialog"].removeAttribute("open");
    }
  }

  function maybeShowWhatsAppFollowup() {
    if (whatsappBackupState !== "WHATSAPP_ABIERTO" || Date.now() - whatsappOpenedAt < 750 ||
        elements["whatsapp-followup-dialog"].open) {
      return;
    }
    if (elements["share-dialog"].open) {
      closeSharePreview();
    }
    byId("whatsapp-confirm-actions").hidden = false;
    elements["manager-backup-step"].hidden = true;
    elements["manager-backup-status"].textContent = "";
    if (typeof elements["whatsapp-followup-dialog"].showModal === "function") {
      elements["whatsapp-followup-dialog"].showModal();
    } else {
      elements["whatsapp-followup-dialog"].setAttribute("open", "");
    }
  }

  function confirmWhatsAppDelivered() {
    var manager = validateSalesManagerForSharing(true);
    if (!manager) {
      return;
    }
    whatsappBackupState = "CLIENTE_CONFIRMADO_ENVIADO";
    byId("whatsapp-confirm-actions").hidden = true;
    elements["manager-backup-step"].hidden = false;
    elements["whatsapp-delivery-status"].textContent = "Cotización enviada";
    elements["manager-backup-description"].textContent = "Ahora puedes preparar en Gmail el respaldo interno dirigido a " + manager.nombre + ". Adjunta manualmente el mismo PDF antes de enviarlo.";
    elements["manager-backup-fallback"].hidden = true;
    byId("btn-confirmar-respaldo-jefe").hidden = true;
    elements["manager-backup-status"].textContent = "La aplicación no envía ni verifica correos automáticamente.";
  }

  async function prepareManagerBackup() {
    if (whatsappBackupState !== "CLIENTE_CONFIRMADO_ENVIADO" &&
        whatsappBackupState !== "RESPALDO_JEFE_PREPARADO") {
      return;
    }
    var manager = validateSalesManagerForSharing(true);
    if (!manager || !quote.reference) {
      return;
    }
    var operationVersion = quoteSessionVersion;
    var data = currentWhatsAppMessageData(shareContextId);
    var subject = buildManagerBackupSubject(data);
    var body = buildManagerBackupBody(data);
    var gmailUrl = buildGmailComposeUrl(manager.correo, subject, body);
    var copyOperation = copyTextValue("Para: " + manager.correo + "\nAsunto: " + subject + "\n\n" + body);
    var opened = global.open(gmailUrl, "_blank");
    if (opened) {
      try { opened.opener = null; } catch (ignore) {}
    }
    var copied = await copyOperation;
    if (operationVersion !== quoteSessionVersion) { return; }
    whatsappBackupState = "RESPALDO_JEFE_PREPARADO";
    elements["manager-backup-fallback"].href = gmailUrl;
    elements["manager-backup-fallback"].hidden = Boolean(opened);
    byId("btn-confirmar-respaldo-jefe").hidden = false;
    elements["manager-backup-status"].textContent = opened
      ? "Borrador preparado en Gmail. Adjunta manualmente el PDF, revisa el destinatario y envía cuando corresponda."
      : (copied
        ? "El respaldo quedó copiado. Usa «Abrir Gmail», adjunta manualmente el PDF y revisa antes de enviar."
        : "Usa «Abrir Gmail» y prepara manualmente el respaldo con el PDF.");
    global.SMART_LAST_MANAGER_BACKUP_DIAGNOSTICS = Object.freeze({
      estado: whatsappBackupState,
      referencia: quote.reference,
      jefeId: manager.id,
      correoJefe: manager.correo,
      gmailAbierto: Boolean(opened),
      respaldoCopiado: Boolean(copied),
      envioAutomatico: false
    });
  }

  function confirmManagerBackupManually() {
    if (whatsappBackupState !== "RESPALDO_JEFE_PREPARADO") {
      return;
    }
    whatsappBackupState = "RESPALDO_JEFE_CONFIRMADO_MANUALMENTE";
    elements["manager-backup-status"].textContent = "Respaldo enviado al jefe · Confirmación manual. La aplicación local no verifica el envío real.";
    byId("btn-confirmar-respaldo-jefe").disabled = true;
  }

  function closeGmailAccountConfirmation() {
    if (typeof elements["gmail-account-dialog"].close === "function") {
      elements["gmail-account-dialog"].close();
    } else {
      elements["gmail-account-dialog"].removeAttribute("open");
    }
  }

  function requestGmailAccountConfirmation() {
    var identity = obtenerCorreoCorporativoAutenticado();
    if (!identity.valid) {
      showToast("Debes ingresar con una cuenta corporativa de Smart para preparar el correo.");
      return false;
    }
    elements["gmail-account-detail"].textContent = "Verifica que Gmail esté abierto con tu cuenta corporativa @smartidiomas.edu.co. Adjunta el PDF antes de enviar.";
    var manager = selectedSalesManager();
    elements["gmail-bcc-fallback"].hidden = !manager;
    elements["gmail-bcc-message"].textContent = manager
      ? "Se preparará una copia oculta para " + manager.nombre + "."
      : "";
    if (typeof elements["gmail-account-dialog"].showModal === "function") {
      elements["gmail-account-dialog"].showModal();
    } else {
      elements["gmail-account-dialog"].setAttribute("open", "");
    }
    return true;
  }

  async function prepareEmailInGmail(accountConfirmed) {
    if (shareInProgress || !ensureShareableQuote()) {
      return;
    }
    var corporateIdentity = obtenerCorreoCorporativoAutenticado();
    if (!corporateIdentity.valid) {
      showToast("Debes ingresar con una cuenta corporativa de Smart para preparar el correo.");
      return;
    }
    if (!accountConfirmed) {
      requestGmailAccountConfirmation();
      return;
    }
    if (!elements.cliente.value.trim()) {
      showToast("Ingresa el nombre del cliente antes de compartir la cotización.");
      elements.cliente.focus();
      return;
    }
    var emailValidation = validateClientEmailForShare();
    if (!emailValidation.valid) {
      showToast(emailValidation.message);
      elements["cliente-correo"].focus();
      return;
    }
    var operationVersion = quoteSessionVersion;
    shareInProgress = true;
    byId("btn-compartir-dialog").disabled = true;
    var data = currentWhatsAppMessageData(shareContextId);
    var manager = selectedSalesManager();
    var subject = buildEmailSubject(data);
    var body = buildEmailBody(data);
    var backup = "Asunto: " + subject + "\n\n" + body;
    var gmailUrl = buildGmailComposeUrl(emailValidation.email, subject, body, manager ? manager.correo : "");
    var capability = detectShareCapabilities(navigator, null);
    try {
      var copyOperation = copyTextValue(backup);
      var opened = global.open(gmailUrl, "_blank");
      if (opened) {
        try { opened.opener = null; } catch (ignore) {}
      }
      var copied = await copyOperation;
      if (operationVersion !== quoteSessionVersion) { return; }
      elements["share-email-fallback"].href = gmailUrl;
      elements["share-email-fallback"].hidden = Boolean(opened);
      updateShareDiagnostics(data, body, capability, "PREPARAR_CORREO", opened ? "GMAIL_ABIERTO" : "PESTANA_BLOQUEADA", shareChannelId);
      showToast(opened
          ? "El correo quedó preparado en Gmail. Adjunta manualmente el PDF antes de enviarlo."
          : (copied
            ? "El correo quedó copiado. Usa el enlace Abrir Gmail y adjunta manualmente el PDF."
            : "Usa el enlace Abrir Gmail y revisa el contenido antes de enviarlo."));
    } catch (error) {
      if (operationVersion !== quoteSessionVersion) { return; }
      var fallbackCopied = await copyTextValue(backup);
      if (operationVersion !== quoteSessionVersion) { return; }
      elements["share-email-fallback"].href = gmailUrl;
      elements["share-email-fallback"].hidden = false;
      updateShareDiagnostics(data, body, capability, "PREPARAR_CORREO", fallbackCopied ? "FALLBACK_COPIADO" : "FALLBACK_FALLIDO", shareChannelId);
      showToast(fallbackCopied
        ? "El correo quedó copiado. Usa el enlace Abrir Gmail y adjunta manualmente el PDF."
        : "No fue posible abrir Gmail ni copiar el correo automáticamente.");
    } finally {
      if (operationVersion === quoteSessionVersion) {
        shareInProgress = false;
        byId("btn-compartir-dialog").disabled = false;
      }
    }
  }

  function continueToGmail() {
    closeGmailAccountConfirmation();
    prepareEmailInGmail(true);
  }

  function downloadPdfFromShare() {
    if (!ensureCurrentQuote()) {
      return;
    }
    var data = currentWhatsAppMessageData(shareContextId);
    printProposal(true, buildPdfFileName(data));
  }

  function quoteSummary(forWhatsApp) {
    var data = currentWhatsAppMessageData(shareContextId);
    return forWhatsApp ? construirMensajeWhatsApp(data, shareContextId) : buildEmailBody(data);
  }

  function fallbackCopy(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.setAttribute("aria-hidden", "true");
    Object.assign(textarea.style, {
      position: "fixed",
      left: "-9999px",
      top: "0",
      opacity: "0"
    });
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    var success = false;
    try {
      success = document.execCommand("copy");
    } finally {
      textarea.remove();
    }
    return success;
  }

  function copyTextValue(text) {
    var operationVersion = quoteSessionVersion;
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      return navigator.clipboard.writeText(text).then(function () {
        return true;
      }).catch(function () {
        if (operationVersion !== quoteSessionVersion) { return false; }
        return fallbackCopy(text);
      });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  async function copiarMensajeSinLeer(texto) {
    var operationVersion = quoteSessionVersion;
    const mensaje = validarMensajeUnicode(texto);
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      try {
        await navigator.clipboard.writeText(mensaje);
        return {
          copiado: true,
          metodo: "CLIPBOARD_WRITE_TEXT"
        };
      } catch (writeError) {
        // Continúa con el fallback local sin leer el portapapeles.
      }
    }

    if (operationVersion !== quoteSessionVersion) {
      return { copiado: false, metodo: "COTIZACION_DESCARTADA" };
    }
    var copied = fallbackCopy(mensaje);
    return {
      copiado: copied,
      metodo: copied ? "EXEC_COMMAND_COPY" : "NO_DISPONIBLE"
    };
  }

  function copyText(text, successMessage) {
    var operationVersion = quoteSessionVersion;
    return copyTextValue(text).then(function (copied) {
      if (operationVersion !== quoteSessionVersion) { return false; }
      showToast(copied ? successMessage : "No fue posible copiar automáticamente.");
      return copied;
    });
  }

  function copySummary(forWhatsApp) {
    if (forWhatsApp ? !ensureShareableQuote() : !ensureCurrentQuote()) {
      return;
    }
    return copyText(
      quoteSummary(forWhatsApp),
      forWhatsApp ? "Mensaje copiado." : "Resumen de la cotización copiado."
    );
  }

  function stripPrintCloneIdentifiers(node) {
    if (!node) {
      return node;
    }
    if (node.id) {
      node.removeAttribute("id");
    }
    node.querySelectorAll("[id]").forEach(function (child) {
      child.removeAttribute("id");
    });
    return node;
  }

  function recordOmittedEmptyPrintBlock(session, node, fallbackName) {
    if (!session || !session.omittedEmptyBlocks) {
      return;
    }
    var name = fallbackName || (node && (node.dataset.printBlock || node.className)) || "bloque_opcional";
    session.omittedEmptyBlocks.add(String(name).trim() || "bloque_opcional");
  }

  function pruneEmptyPrintNodes(root, session) {
    if (!root) {
      return [];
    }
    var removed = [];
    Array.from(root.querySelectorAll("[hidden]")).forEach(function (node) {
      recordOmittedEmptyPrintBlock(session, node, "oculto_sin_aplicacion");
      removed.push(node);
      node.remove();
    });
    [
      ".client-contact-details",
      ".client-observation",
      ".client-commercial-message",
      ".client-additionals-total",
      ".print-legal-notes"
    ].forEach(function (selector) {
      Array.from(root.querySelectorAll(selector)).forEach(function (node) {
        if (!node.textContent.trim() && !node.querySelector("img, table, .client-additional-card")) {
          recordOmittedEmptyPrintBlock(session, node, selector);
          removed.push(node);
          node.remove();
        }
      });
    });
    Array.from(root.querySelectorAll(".client-additionals, .print-additionals-part")).forEach(function (node) {
      if (!node.querySelector(".client-additional-card")) {
        recordOmittedEmptyPrintBlock(session, node, "beneficios_vacios");
        removed.push(node);
        node.remove();
      }
    });
    if (printBonusCards().length === 0) {
      Array.from(root.querySelectorAll(".client-additionals-total")).forEach(function (node) {
        recordOmittedEmptyPrintBlock(session, node, "total_beneficios_en_cero");
        removed.push(node);
        node.remove();
      });
    }
    return removed;
  }

  function clonePrintBlock(selector) {
    var source = document.querySelector(selector);
    return source && !source.hidden ? stripPrintCloneIdentifiers(source.cloneNode(true)) : null;
  }

  function createPrintSheet(className) {
    var sheet = document.createElement("section");
    sheet.className = "print-sheet " + className;
    return sheet;
  }

  var PRINT_PRIORITY_SUMMARY_SELECTORS = [
      "#client-view .client-header",
      "#client-view .client-greeting",
      "#client-view .client-program",
      "#client-view .client-payment-summary",
      "#client-view .client-price-grid"
    ];

  var PRINT_POST_BONUSES_SELECTORS = [
      "#client-view #client-additionals-total-section",
      "#client-view #client-commercial-message"
    ];

  var PRINT_SEMANTIC_SEQUENCE = [
    "HEADER",
    "CLIENT",
    "PROGRAM",
    "PAYMENT_HIGHLIGHT",
    "ECONOMIC_SUMMARY",
    "BONUSES",
    "BONUSES_TOTAL",
    "MONTHLY_REDUCTION_MESSAGE",
    "PAYMENT_CALENDAR",
    "FINAL_TOTAL",
    "VALIDITY",
    "LEGAL_NOTES"
  ];

  var PRINT_BLOCK_TOKEN_BY_SELECTOR = {
    "#client-view .client-header": "HEADER",
    "#client-view .client-greeting": "CLIENT",
    "#client-view .client-program": "PROGRAM",
    "#client-view .client-payment-summary": "PAYMENT_HIGHLIGHT",
    "#client-view .client-price-grid": "ECONOMIC_SUMMARY",
    "#client-view #client-additionals-total-section": "BONUSES_TOTAL",
    "#client-view #client-commercial-message": "MONTHLY_REDUCTION_MESSAGE"
  };

  var PRINT_CONTROL_IDS = ["btn-imprimir", "btn-pdf", "btn-client-print", "btn-continuar-impresion"];
  var isPrinting = false;
  var printSessionCounter = 0;
  var activePrintSession = null;
  var printCleanupFallbackTimer = null;
  var printLaunchTimer = null;

  function appendPrintBlocks(sheet, selectors) {
    selectors.forEach(function (selector) {
      var block = clonePrintBlock(selector);
      if (block) {
        block.dataset.printBlock = PRINT_BLOCK_TOKEN_BY_SELECTOR[selector] || "UNCLASSIFIED";
        if (block.dataset.printBlock === "ECONOMIC_SUMMARY") {
          var contractBlock = block.querySelector(".client-contract-total");
          var contractTitle = contractBlock ? contractBlock.querySelector("span") : null;
          var contractValue = contractBlock ? contractBlock.querySelector("strong") : null;
          if (contractBlock) {
            contractBlock.dataset.printRole = "contract-total-block";
          }
          if (contractTitle) {
            contractTitle.dataset.printRole = "contract-total-title";
          }
          if (contractValue) {
            contractValue.dataset.printRole = "contract-total-value";
          }
        }
        sheet.appendChild(block);
      }
    });
  }

  function appendPrintPrioritySummary(sheet) {
    appendPrintBlocks(sheet, PRINT_PRIORITY_SUMMARY_SELECTORS);
  }

  function appendPrintPostBonuses(sheet) {
    appendPrintBlocks(sheet, PRINT_POST_BONUSES_SELECTORS);
  }

  function printBonusCards() {
    var source = document.querySelector("#client-view #client-additionals-section");
    if (!source || source.hidden) {
      return [];
    }
    return Array.from(source.querySelectorAll(".client-additional-card"));
  }

  function printBonusFirstPageOptions(pageCount) {
    var totalCards = printBonusCards().length;
    if (!totalCards) {
      return [0];
    }
    if (pageCount === 1) {
      return [totalCards];
    }
    var options = [totalCards];
    for (var count = totalCards - 1; count >= 1; count -= 1) {
      options.push(count);
    }
    options.push(0);
    return Array.from(new Set(options));
  }

  function printBonusDistribution(pageCount, totalCards, firstPageCount) {
    var distribution = new Array(pageCount).fill(0);
    if (!distribution.length) {
      return distribution;
    }
    distribution[0] = Math.max(0, Number(firstPageCount || 0));
    if (totalCards > distribution[0] && pageCount > 1) {
      distribution[1] = totalCards - distribution[0];
    }
    return distribution;
  }

  function createPrintBonusesBlock(startIndex, count, continued, isFinalPart) {
    var source = document.querySelector("#client-view #client-additionals-section");
    var cards = printBonusCards();
    if (!source || source.hidden || count <= 0 || startIndex >= cards.length) {
      return null;
    }
    var section = document.createElement("section");
    section.className = "client-additionals print-additionals-part" + (continued ? " is-continuation" : "");
    section.dataset.printBlock = "BONUSES";
    section.dataset.printBonusCount = String(count);

    var heading = source.querySelector(".client-section-heading");
    if (heading) {
      var headingClone = stripPrintCloneIdentifiers(heading.cloneNode(true));
      var title = headingClone.querySelector("h3");
      if (continued && title) {
        title.textContent = "ADICIONALES BONIFICADOS · CONTINUACIÓN";
      }
      section.appendChild(headingClone);
    }
    if (!continued) {
      [".client-additionals-deadline", ".client-additionals-expired"].forEach(function (selector) {
        var node = source.querySelector(selector);
        if (node && !node.hidden) {
          section.appendChild(stripPrintCloneIdentifiers(node.cloneNode(true)));
        }
      });
    }
    var list = document.createElement("div");
    list.className = "client-additionals-list";
    cards.slice(startIndex, startIndex + count).forEach(function (card) {
      list.appendChild(stripPrintCloneIdentifiers(card.cloneNode(true)));
    });
    section.appendChild(list);
    if (isFinalPart) {
      var caveat = source.querySelector(".client-additionals-caveat");
      if (caveat) {
        section.appendChild(stripPrintCloneIdentifiers(caveat.cloneNode(true)));
      }
    }
    return section;
  }

  function createPrintContinuationHeader(pageNumber, totalPages) {
    var header = document.createElement("header");
    header.className = "print-continuation-header";
    header.dataset.printRole = "continuation-header";
    var logo = document.createElement("img");
    logo.src = "logo-smart.png";
    logo.alt = "Academia de Idiomas Smart";
    var reference = document.createElement("div");
    reference.className = "print-continuation-reference";
    var label = document.createElement("span");
    label.textContent = "Cotización " + pageNumber + " de " + totalPages;
    var value = document.createElement("strong");
    value.textContent = quote.reference || "Sin referencia";
    reference.appendChild(label);
    reference.appendChild(value);
    header.appendChild(logo);
    header.appendChild(reference);
    return header;
  }

  function createPrintCell(tagName, textValue, className) {
    var cell = document.createElement(tagName);
    cell.textContent = textValue;
    if (className) {
      cell.className = className;
    }
    return cell;
  }

  function createPrintSchedule(rows, groupIndex, totalGroups, totalRows) {
    var section = document.createElement("section");
    section.className = "print-schedule-card";
    section.dataset.printBlock = "PAYMENT_CALENDAR";
    var heading = document.createElement("div");
    heading.className = "print-schedule-heading";
    var title = document.createElement("div");
    var kicker = document.createElement("span");
    kicker.textContent = "Calendario estimado";
    var headingTitle = document.createElement("h3");
    headingTitle.textContent = groupIndex === 0 ? "Plan de pagos proyectado" : "Plan de pagos proyectado · Continuación";
    title.appendChild(kicker);
    title.appendChild(headingTitle);
    var firstPayment = rows.length ? rows[0].number : 0;
    var lastPayment = rows.length ? rows[rows.length - 1].number : 0;
    var range = document.createElement("small");
    range.textContent = "Pagos " + firstPayment + "–" + lastPayment + " de " + totalRows;
    heading.appendChild(title);
    heading.appendChild(range);

    var table = document.createElement("table");
    table.className = "print-schedule-table";
    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    ["N.º", "Concepto", "Fecha de vencimiento", "Valor", "Saldo después del pago"].forEach(function (label, index) {
      headerRow.appendChild(createPrintCell("th", label, index >= 3 ? "numeric" : ""));
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    var tbody = document.createElement("tbody");
    rows.forEach(function (row) {
      var tr = document.createElement("tr");
      tr.dataset.printRowNumber = String(row.number);
      tr.appendChild(createPrintCell("td", row.number));
      tr.appendChild(createPrintCell("td", row.concept));
      tr.appendChild(createPrintCell("td", formatDateLong(row.dueDate)));
      tr.appendChild(createPrintCell("td", formatCOP(row.valueCop), "numeric"));
      tr.appendChild(createPrintCell("td", formatCOP(row.balanceAfterCop), "numeric"));
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    section.appendChild(heading);
    section.appendChild(table);
    if (groupIndex === 0) {
      var projectedNote = document.createElement("p");
      projectedNote.className = "print-projected-payment-note";
      projectedNote.textContent = PROJECTED_PAYMENT_DISCLAIMER;
      section.appendChild(projectedNote);
    }
    section.dataset.printGroup = String(groupIndex + 1);
    section.dataset.printGroups = String(totalGroups);
    return section;
  }

  function createPrintClosingCluster() {
    var cluster = document.createElement("section");
    cluster.className = "print-closing-cluster";
    var total = document.createElement("div");
    total.className = "print-plan-total";
    total.dataset.printBlock = "FINAL_TOTAL";
    var totalValue = document.createElement("div");
    var totalLabel = document.createElement("span");
    totalLabel.textContent = "Total del plan";
    var totalStrong = document.createElement("strong");
    totalStrong.textContent = formatCOP(currentCalculation.sumPaymentsCop);
    totalValue.appendChild(totalLabel);
    totalValue.appendChild(totalStrong);
    var differenceValue = document.createElement("div");
    differenceValue.className = "print-plan-difference";
    var differenceLabel = document.createElement("span");
    differenceLabel.textContent = "Diferencia";
    var differenceStrong = document.createElement("strong");
    differenceStrong.textContent = formatCOP(currentCalculation.differenceCop);
    differenceValue.appendChild(differenceLabel);
    differenceValue.appendChild(differenceStrong);
    total.appendChild(totalValue);
    total.appendChild(differenceValue);
    cluster.appendChild(total);

    var footer = clonePrintBlock("#client-view .client-footer");
    if (footer) {
      var validity = footer.querySelector(".validity-box");
      if (validity) {
        validity.dataset.printBlock = "VALIDITY";
        cluster.appendChild(validity);
      }
      var legal = document.createElement("div");
      legal.className = "print-legal-notes";
      legal.dataset.printBlock = "LEGAL_NOTES";
      if (elements.observacion.value.trim()) {
        var observation = clonePrintBlock("#client-observation-section");
        if (observation) {
          observation.hidden = false;
          legal.appendChild(observation);
        }
      }
      Array.from(footer.children).forEach(function (child) {
        if (!child.classList.contains("validity-box")) {
          legal.appendChild(child);
        }
      });
      cluster.appendChild(legal);
    }
    return cluster;
  }

  function renderPrintDistribution(session, layout) {
    if (layout.flowPages) { return renderFlowPages(session, layout.flowPages); }
    var container = session.root;
    var rows = currentCalculation.rows;
    var distribution = Array.isArray(layout) ? layout : layout.distribution;
    var totalBonusCards = printBonusCards().length;
    var bonusFirstPageCount = Array.isArray(layout) ? totalBonusCards : Number(layout.bonusFirstPageCount || 0);
    bonusFirstPageCount = Math.max(0, Math.min(totalBonusCards, bonusFirstPageCount));
    var remainingBonusCards = totalBonusCards - bonusFirstPageCount;
    var totalPages = distribution.length;
    var totalGroups = distribution.filter(function (count) { return count > 0; }).length;
    var cursor = 0;
    var groupIndex = 0;
    container.innerHTML = "";

    if (totalBonusCards === 0) {
      recordOmittedEmptyPrintBlock(session, null, "beneficios_vacios");
      recordOmittedEmptyPrintBlock(session, null, "total_beneficios_en_cero");
    }
    if (!elements.observacion.value.trim()) {
      recordOmittedEmptyPrintBlock(session, null, "observacion_vacia");
    }
    if (elements["client-contact-details"].hidden || !elements["client-contact-details"].textContent.trim()) {
      recordOmittedEmptyPrintBlock(session, null, "datos_contacto_vacios");
    }
    if (elements["client-commercial-message"].hidden || !elements["client-commercial-message"].textContent.trim()) {
      recordOmittedEmptyPrintBlock(session, null, "mensaje_opcional_vacio");
    }

    if ((remainingBonusCards > 0 && totalPages < 2) ||
        !printDistributionRespectsSectionOrder(distribution, bonusFirstPageCount, totalBonusCards)) {
      return [];
    }

    var summarySheet = createPrintSheet("print-summary-page");
    if (totalPages === 1) {
      summarySheet.classList.add("print-single-page");
    }
    summarySheet.dataset.printPage = "1";
    appendPrintPrioritySummary(summarySheet);
    if (bonusFirstPageCount > 0) {
      summarySheet.appendChild(createPrintBonusesBlock(0, bonusFirstPageCount, false, remainingBonusCards === 0));
    }
    if (remainingBonusCards === 0) {
      appendPrintPostBonuses(summarySheet);
    }
    if (distribution[0] > 0) {
      var firstRows = rows.slice(cursor, cursor + distribution[0]);
      summarySheet.appendChild(createPrintSchedule(firstRows, groupIndex, totalGroups, rows.length));
      cursor += distribution[0];
      groupIndex += 1;
    }
    if (totalPages === 1) {
      summarySheet.appendChild(createPrintClosingCluster());
    }
    container.appendChild(summarySheet);

    for (var pageIndex = 1; pageIndex < totalPages; pageIndex += 1) {
      var count = distribution[pageIndex];
      var group = rows.slice(cursor, cursor + count);
      var sheet = createPrintSheet("print-schedule-page");
      sheet.dataset.printPage = String(pageIndex + 1);
      sheet.appendChild(createPrintContinuationHeader(pageIndex + 1, totalPages));
      if (pageIndex === 1 && remainingBonusCards > 0) {
        sheet.appendChild(createPrintBonusesBlock(bonusFirstPageCount, remainingBonusCards, bonusFirstPageCount > 0, true));
        appendPrintPostBonuses(sheet);
      }
      if (count > 0) {
        sheet.appendChild(createPrintSchedule(group, groupIndex, totalGroups, rows.length));
        cursor += count;
        groupIndex += 1;
      }
      if (pageIndex === totalPages - 1) {
        sheet.appendChild(createPrintClosingCluster());
      }
      container.appendChild(sheet);
    }
    pruneEmptyPrintNodes(container, session);
    return Array.from(container.querySelectorAll(".print-sheet"));
  }

  function setPrintControlsDisabled(disabled) {
    PRINT_CONTROL_IDS.forEach(function (id) {
      var button = byId(id);
      if (!button) {
        return;
      }
      button.disabled = disabled || (button.classList.contains("generated-action") && quote.status !== "VIGENTE");
      button.setAttribute("aria-disabled", String(button.disabled));
    });
  }

  function removeTemporaryPrintNodes() {
    var nodes = Array.from(document.querySelectorAll("[data-print-root], .print-measure-root, .print-pages-temporary"));
    var deleted = 0;
    nodes.forEach(function (node) {
      if (node.isConnected) {
        node.remove();
        deleted += 1;
      }
    });
    return { found: nodes.length, deleted: deleted };
  }

  function updateLastPrintDiagnostics(values) {
    var previous = global.SMART_LAST_PRINT_DIAGNOSTICS || {};
    global.SMART_LAST_PRINT_DIAGNOSTICS = Object.freeze(Object.assign({}, previous, values));
  }

  function cleanupPrintSession(reason) {
    var sessionBeingCleaned = activePrintSession;
    if (printLaunchTimer) {
      global.clearTimeout(printLaunchTimer);
      printLaunchTimer = null;
    }
    if (printCleanupFallbackTimer) {
      global.clearTimeout(printCleanupFallbackTimer);
      printCleanupFallbackTimer = null;
    }
    var removed = removeTemporaryPrintNodes();
    var host = elements["print-document"];
    if (host) {
      host.innerHTML = "";
      host.classList.remove("is-measuring", "print-active");
      host.setAttribute("aria-hidden", "true");
      Array.from(Object.keys(host.dataset)).forEach(function (name) {
        if (name !== "lastDiagnostics") {
          delete host.dataset[name];
        }
      });
    }
    document.body.classList.remove("print-session-active");
    if (sessionBeingCleaned && sessionBeingCleaned.documentTitleBeforePrint) {
      document.title = sessionBeingCleaned.documentTitleBeforePrint;
    }
    if (sessionBeingCleaned) {
      sessionBeingCleaned.root.textContent = "";
      sessionBeingCleaned.candidateDiagnostics = [];
      sessionBeingCleaned.omittedEmptyBlocks.clear();
      sessionBeingCleaned.documentTitleBeforePrint = "";
      sessionBeingCleaned.pdfFileName = "";
    }
    activePrintSession = null;
    isPrinting = false;
    pendingPrintSaveAsPdf = false;
    pendingPrintFileName = "";
    setPrintControlsDisabled(false);
    if (global.SMART_LAST_PRINT_DIAGNOSTICS) {
      updateLastPrintDiagnostics({
        temporalesEncontradosAlFinalizar: removed.found,
        temporalesEliminadosAlFinalizar: removed.deleted,
        limpiezaCompletada: true,
        motivoLimpieza: reason || "finalizada",
        isPrintingAlFinalizar: false
      });
      if (host) {
        host.dataset.lastDiagnostics = JSON.stringify(global.SMART_LAST_PRINT_DIAGNOSTICS);
      }
    }
    return removed;
  }

  function createFreshPrintSession() {
    var removedBefore = cleanupPrintSession("antes_de_nueva_sesion");
    global.SMART_LAST_PRINT_DIAGNOSTICS = null;
    delete elements["print-document"].dataset.lastDiagnostics;
    printSessionCounter += 1;
    var sessionId = createPrintSessionIdentifier(Date.now(), printSessionCounter);
    var root = document.createElement("div");
    root.className = "print-session-root print-measure-root";
    root.dataset.printRoot = "";
    root.dataset.printSessionId = sessionId;
    elements["print-document"].appendChild(root);
    elements["print-document"].classList.add("is-measuring", "print-active");
    elements["print-document"].setAttribute("aria-hidden", "true");
    document.body.classList.add("print-session-active");
    isPrinting = true;
    setPrintControlsDisabled(true);
    activePrintSession = {
      id: sessionId,
      sequenceNumber: printSessionCounter,
      root: root,
      temporariesFoundBefore: removedBefore.found,
      temporariesDeletedBefore: removedBefore.deleted,
      candidateDiagnostics: [],
      omittedEmptyBlocks: new Set()
    };
    return activePrintSession;
  }

  function schedulePrintCleanupFallback(sessionId) {
    if (printCleanupFallbackTimer) {
      global.clearTimeout(printCleanupFallbackTimer);
    }
    printCleanupFallbackTimer = global.setTimeout(function () {
      if (activePrintSession && activePrintSession.id === sessionId) {
        cleanupPrintSession("reserva_despues_de_window_print");
      }
    }, 2500);
  }

  function measurePrintSheet(sheet) {
    var computed = global.getComputedStyle(sheet);
    var paddingTop = parseFloat(computed.paddingTop) || 0;
    var paddingBottom = parseFloat(computed.paddingBottom) || 0;
    var rect = sheet.getBoundingClientRect();
    var pixelsPerMillimeter = rect.height / 297;
    var safetyReserve = pixelsPerMillimeter * 0.5;
    var contentTop = rect.top + paddingTop;
    var innerBottom = rect.bottom - paddingBottom - safetyReserve;
    var children = Array.from(sheet.children);
    var contentBottom = children.reduce(function (maximum, child) {
      return Math.max(maximum, child.getBoundingClientRect().bottom);
    }, contentTop);
    var usableHeight = Math.max(1, innerBottom - contentTop);
    var usedHeight = Math.max(0, contentBottom - contentTop);
    var freeHeight = Math.max(0, usableHeight - usedHeight);
    var emptyRatio = Math.max(0, Math.min(1, (usableHeight - usedHeight) / usableHeight));
    var rowHeights = Array.from(sheet.querySelectorAll(".print-schedule-table tbody tr")).map(function (row) {
      return row.getBoundingClientRect().height;
    });
    var closing = sheet.querySelector(".print-closing-cluster");
    var contractBlock = sheet.querySelector('[data-print-role="contract-total-block"]');
    var contractRect = contractBlock ? contractBlock.getBoundingClientRect() : null;
    var contractTitle = contractBlock ? contractBlock.querySelector('[data-print-role="contract-total-title"]') : null;
    var contractValue = contractBlock ? contractBlock.querySelector('[data-print-role="contract-total-value"]') : null;
    var contractStyle = contractBlock ? global.getComputedStyle(contractBlock) : null;
    var contractTitleStyle = contractTitle ? global.getComputedStyle(contractTitle) : null;
    var contractValueStyle = contractValue ? global.getComputedStyle(contractValue) : null;
    var contractValueRect = contractValue ? contractValue.getBoundingClientRect() : null;
    var expectedContractValue = currentTariff ? formatCOP(currentTariff.valor_total_oficial_cop) : "";
    var contractPresent = Boolean(contractBlock && contractTitle && contractValue && contractRect && contractRect.width > 0 && contractRect.height > 0);
    var contractVisible = Boolean(contractPresent && contractValueRect && contractTitle.textContent.trim() &&
      contractStyle.display !== "none" && contractStyle.visibility !== "hidden" &&
      contractTitleStyle.display !== "none" && contractTitleStyle.visibility !== "hidden" &&
      contractValueStyle.display !== "none" && contractValueStyle.visibility !== "hidden" &&
      contractRect.top >= contentTop - 0.75 && contractRect.bottom <= innerBottom + 0.75 &&
      contractValueRect.top >= contractRect.top - 0.75 && contractValueRect.bottom <= contractRect.bottom + 0.75 &&
      contractValue.textContent.trim() === expectedContractValue);
    var blocksIncluded = children.filter(function (child) {
      var childRect = child.getBoundingClientRect();
      return childRect.width > 0 && childRect.height > 0;
    }).map(function (child) {
      if (child.classList.contains("client-header")) { return "encabezado"; }
      if (child.classList.contains("client-greeting")) { return "cliente"; }
      if (child.classList.contains("client-program")) { return "programa"; }
      if (child.classList.contains("client-price-grid")) { return "resumen_economico"; }
      if (child.classList.contains("client-payment-summary")) { return "plan_pago"; }
      if (child.classList.contains("client-additionals")) { return "adicionales"; }
      if (child.classList.contains("client-additionals-total")) { return "total_adicionales"; }
      if (child.classList.contains("client-commercial-message")) { return "mensaje_comercial"; }
      if (child.classList.contains("print-continuation-header")) { return "identificacion_continuacion"; }
      if (child.classList.contains("print-schedule-card")) { return "calendario"; }
      if (child.classList.contains("print-closing-cluster")) { return "cierre"; }
      return "bloque";
    });
    return {
      overflow: contentBottom > innerBottom + 0.75 || sheet.scrollHeight > sheet.clientHeight + 1,
      usableHeight: usableHeight,
      usedHeight: usedHeight,
      freeHeight: freeHeight,
      emptyRatio: emptyRatio,
      emptyPercent: Math.round(emptyRatio * 100),
      usableHeightMm: Math.round((usableHeight / pixelsPerMillimeter) * 10) / 10,
      usedHeightMm: Math.round((usedHeight / pixelsPerMillimeter) * 10) / 10,
      freeHeightMm: Math.round((freeHeight / pixelsPerMillimeter) * 10) / 10,
      overflowHeightMm: Math.round((Math.max(0, usedHeight - usableHeight) / pixelsPerMillimeter) * 10) / 10,
      rowHeightsMm: rowHeights.map(function (height) {
        return Math.round((height / pixelsPerMillimeter) * 10) / 10;
      }),
      closingHeightMm: closing ? Math.round((closing.getBoundingClientRect().height / pixelsPerMillimeter) * 10) / 10 : 0,
      bonusCards: sheet.querySelectorAll(".client-additional-card").length,
      bonusTitles: Array.from(sheet.querySelectorAll(".client-additional-card h4")).map(function (title) {
        return title.textContent.trim();
      }),
      blocksIncluded: blocksIncluded,
      contractPresent: contractPresent,
      contractVisible: contractVisible,
      contractTitlePresent: Boolean(contractTitle && contractTitle.textContent.trim()),
      safetyReserveMm: 0.5,
      usedPercent: Math.round((1 - emptyRatio) * 100)
    };
  }

  function waitForNextPrintFrame() {
    return new Promise(function (resolve) {
      if (typeof global.requestAnimationFrame === "function") {
        global.requestAnimationFrame(resolve);
      } else {
        global.setTimeout(resolve, 0);
      }
    });
  }

  function waitForStablePrintLayout(session) {
    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    return Promise.resolve(fontsReady).then(function () {
      requireActivePrintSession(session);
      global.getComputedStyle(session.root).width;
      session.root.scrollHeight;
      return waitForNextPrintFrame();
    }).then(waitForNextPrintFrame);
  }

  function requireActivePrintSession(session) {
    if (activePrintSession !== session) {
      throw new Error("La sesión de impresión fue descartada.");
    }
  }

  async function measurePrintDistribution(session, distribution, bonusFirstPageCount) {
    requireActivePrintSession(session);
    var totalBonusCards = printBonusCards().length;
    var layout = {
      distribution: distribution.slice(),
      bonusFirstPageCount: Number(bonusFirstPageCount || 0),
      totalBonusCards: totalBonusCards
    };
    if (!printDistributionRespectsSectionOrder(layout.distribution, layout.bonusFirstPageCount, totalBonusCards)) {
      return null;
    }
    var sheets = renderPrintDistribution(session, layout);
    await waitForStablePrintLayout(session);
    requireActivePrintSession(session);
    return {
      distribution: distribution.slice(),
      bonusFirstPageCount: layout.bonusFirstPageCount,
      totalBonusCards: totalBonusCards,
      metrics: sheets.map(measurePrintSheet)
    };
  }

  function scoreMeasuredDistribution(candidate) {
    var maximumEmpty = candidate.metrics.reduce(function (maximum, metric) {
      return Math.max(maximum, metric.emptyRatio);
    }, 0);
    var averageEmpty = candidate.metrics.reduce(function (sum, metric) {
      return sum + metric.emptyRatio;
    }, 0) / candidate.metrics.length;
    var variance = candidate.metrics.reduce(function (sum, metric) {
      var difference = metric.emptyRatio - averageEmpty;
      return sum + (difference * difference);
    }, 0) / candidate.metrics.length;
    var intermediateEmpty = candidate.metrics.slice(1, -1).reduce(function (sum, metric) {
      return sum + Math.max(0, metric.emptyRatio - 0.30);
    }, 0);
    var finalEmpty = candidate.metrics[candidate.metrics.length - 1].emptyRatio;
    var firstPageRows = candidate.distribution[0];
    var remainingBonuses = candidate.totalBonusCards - candidate.bonusFirstPageCount;
    var firstPageMovableEmpty = remainingBonuses > 0
      ? Math.max(0, candidate.metrics[0].emptyRatio - 0.25)
      : 0;
    var deferredCalendarPenalty = remainingBonuses === 0 && firstPageRows === 0 && candidate.metrics.length > 1
      ? Math.max(0, candidate.metrics[0].emptyRatio - 0.08)
      : 0;
    var balancePenalty = printDistributionBalancePenalty(candidate.distribution);
    var occupationDifference = candidate.metrics.reduce(function (sum, metric, index) {
      if (index === candidate.metrics.length - 1) {
        return sum;
      }
      var difference = Math.abs((1 - metric.emptyRatio) - (1 - candidate.metrics[index + 1].emptyRatio));
      return sum + Math.max(0, difference - 0.30);
    }, 0);
    var finalMovableEmpty = candidate.metrics.length > 1 &&
      candidate.distribution[candidate.distribution.length - 2] > 3
      ? Math.max(0, finalEmpty - 0.45)
      : 0;
    var totalEmpty = candidate.metrics.reduce(function (sum, metric) { return sum + metric.emptyRatio; }, 0);
    return (balancePenalty * 14000) + (firstPageMovableEmpty * 18000) + (deferredCalendarPenalty * 20000) +
      (intermediateEmpty * 12000) + (finalMovableEmpty * 9000) +
      (occupationDifference * 7000) + (remainingBonuses * 2500) +
      (maximumEmpty * 1200) + (totalEmpty * 900) + (variance * 1000) - (firstPageRows * 0.2);
  }

  function rememberPrintCandidate(session, candidate, state) {
    if (!session || !candidate) {
      return;
    }
    var overflow = candidate.metrics.some(function (metric) { return metric.overflow; });
    session.candidateDiagnostics.push({
      paginas: candidate.distribution.length,
      filasPorPagina: candidate.distribution.slice(),
      beneficiosPrimeraPagina: candidate.bonusFirstPageCount,
      beneficiosPorPagina: printBonusDistribution(candidate.distribution.length, candidate.totalBonusCards, candidate.bonusFirstPageCount),
      porcentajeUtilizado: candidate.metrics.map(function (metric) { return metric.usedPercent; }),
      porcentajeLibre: candidate.metrics.map(function (metric) { return metric.emptyPercent; }),
      alturaUtilizadaMm: candidate.metrics.map(function (metric) { return metric.usedHeightMm; }),
      excesoVerticalMm: candidate.metrics.map(function (metric) { return metric.overflowHeightMm; }),
      desbordamiento: overflow,
      puntuacion: overflow ? null : Math.round(scoreMeasuredDistribution(candidate) * 100) / 100,
      estado: state || (overflow ? "DESCARTADA_POR_DESBORDAMIENTO" : "VALIDA")
    });
  }

  async function rebalanceMeasuredCandidate(session, candidate) {
    var current = candidate;
    var reason = "";
    for (var pageIndex = 0; pageIndex < current.distribution.length - 1; pageIndex += 1) {
      if (current.distribution[pageIndex] === 0) {
        continue;
      }
      while (current.distribution[pageIndex + 1] - current.distribution[pageIndex] > 3) {
        var proposal = current.distribution.slice();
        proposal[pageIndex] += 1;
        proposal[pageIndex + 1] -= 1;
        if (proposal[pageIndex + 1] < 3) {
          break;
        }
        if (!printDistributionRespectsSectionOrder(proposal, current.bonusFirstPageCount, current.totalBonusCards)) {
          reason = "La secuencia comercial impide colocar pagos antes de los adicionales bonificados.";
          break;
        }
        var measured = await measurePrintDistribution(session, proposal, current.bonusFirstPageCount);
        requireActivePrintSession(session);
        rememberPrintCandidate(session, measured, "REEQUILIBRIO_MEDIDO");
        if (measured.metrics.some(function (metric) { return metric.overflow; })) {
          reason = "Mover otra fila a la página anterior provocaría desbordamiento real con la reserva de 5 mm.";
          break;
        }
        measured.score = scoreMeasuredDistribution(measured);
        current = measured;
      }
    }
    if (printDistributionBalancePenalty(current.distribution) > 0 && !reason) {
      reason = "No existe otra distribución medida sin desbordamiento; la última página necesita espacio adicional para el bloque final.";
    }
    current.score = scoreMeasuredDistribution(current);
    current.imbalanceReason = reason;
    return current;
  }

  function renderFlowPages(session, pages) {
    session.root.textContent = "";
    var calendarGroups = pages.filter(function(page) { return page.some(function(unit) { return unit.type === "row"; }); }).length;
    var calendarIndex = 0;
    return pages.map(function(units, index) {
      var sheet = createPrintSheet(index ? "print-schedule-page" : "print-summary-page");
      if (pages.length === 1 && pages.preserveSinglePageLayout) { sheet.classList.add("print-single-page"); }
      sheet.dataset.printPage = String(index + 1);
      if (index) { sheet.appendChild(createPrintContinuationHeader(index + 1, pages.length)); }
      for (var i = 0; i < units.length;) {
        var unit = units[i];
        if (unit.type === "row") {
          var rows = [];
          while (i < units.length && units[i].type === "row") { rows.push(units[i++].row); }
          sheet.appendChild(createPrintSchedule(rows, calendarIndex++, calendarGroups, currentCalculation.rows.length));
        } else if (unit.type === "bonus") {
          var start = unit.index, count = 0;
          while (i < units.length && units[i].type === "bonus") { count++; i++; }
          sheet.appendChild(createPrintBonusesBlock(start, count, start > 0, start + count === printBonusCards().length));
        } else { sheet.appendChild(unit.node.cloneNode(true)); i++; }
      }
      if (!index) {
        var reference = sheet.querySelector(".client-reference");
        if (reference) {
          var counter = document.createElement("span");
          counter.textContent = "Cotización 1 de " + pages.length;
          reference.appendChild(counter);
        }
      }
      session.root.appendChild(sheet);
      return sheet;
    });
  }

  async function measureFlowPages(session, pages) {
    requireActivePrintSession(session);
    var sheets = renderFlowPages(session, pages);
    await waitForStablePrintLayout(session);
    requireActivePrintSession(session);
    return sheets.map(measurePrintSheet);
  }

  async function chooseMeasuredPrintDistribution(session) {
    var units = [], scratch = document.createElement("div");
    function addSelectors(selectors) {
      scratch.textContent = "";
      appendPrintBlocks(scratch, selectors);
      pruneEmptyPrintNodes(scratch, session);
      Array.from(scratch.children).forEach(function(node) { units.push({type: node.dataset.printBlock, node: node}); });
    }
    addSelectors(PRINT_PRIORITY_SUMMARY_SELECTORS);
    printBonusCards().forEach(function(card, index) { units.push({type:"bonus", index:index}); });
    addSelectors(PRINT_POST_BONUSES_SELECTORS);
    currentCalculation.rows.forEach(function(row) { units.push({type:"row", row:row}); });
    units.push({type:"closing", node:createPrintClosingCluster()});
    // Conservar el diseño de una hoja ya existente cuando toda la propuesta cabe.
    // No se modifican sus estilos ni se escala el documento para forzarlo a caber.
    var singlePage = [units.slice()];
    singlePage.preserveSinglePageLayout = true;
    var singleMetrics = await measureFlowPages(session, singlePage);
    if (!singleMetrics[0].overflow) {
      return {flowPages:singlePage, distribution:[currentCalculation.rows.length], metrics:singleMetrics,
        totalBonusCards:printBonusCards().length, bonusFirstPageCount:printBonusCards().length,
        score:0, imbalanceReason:"", breakReasons:[], transfers:[], measurements:1,
        selectionReason:"La propuesta completa cabe en el diseño de una hoja preexistente, sin cambios de tipografía ni escala."};
    }
    var pages = [[]], measurements = 0, transfers = [], breaks = [];
    for (var i = 0; i < units.length; i++) {
      var unit = units[i], page = pages[pages.length - 1];
      page.push(unit);
      var metrics = await measureFlowPages(session, pages); measurements++;
      if (metrics[metrics.length - 1].overflow) {
        page.pop();
        if (!page.length) { throw new Error("Un bloque indivisible excede el área útil A4. Revisa la extensión de la observación."); }
        pages.push([unit]);
        metrics = await measureFlowPages(session, pages); measurements++;
        if (metrics.some(function(metric) { return metric.overflow; })) {
          throw new Error("Un bloque indivisible excede el área útil A4. Revisa la extensión de la observación.");
        }
      }
    }
    // Revalidar cada frontera con la numeración y los encabezados definitivos.
    // No se busca igualar cantidades de filas: se mueve todo lo que aún quepa.
    for (var p = 0; p < pages.length - 1; p++) {
      while (pages[p + 1] && pages[p + 1].length) {
        var next = pages[p + 1].shift();
        pages[p].push(next);
        var removedPage = !pages[p + 1].length;
        if (removedPage) { pages.splice(p + 1, 1); }
        var trial = await measureFlowPages(session, pages); measurements++;
        if (trial.some(function(metric) { return metric.overflow; })) {
          pages[p].pop();
          if (removedPage) { pages.splice(p + 1, 0, []); }
          pages[p + 1].unshift(next);
          var restored = await measureFlowPages(session, pages); measurements++;
          breaks.push({pagina:p + 1, siguientePagina:p + 2, bloque:next.type,
            fila:next.type === "row" ? next.row.number : null,
            motivo:"El siguiente bloque o fila completa excede la altura útil medida.",
            espacioLibreMm:restored[p].freeHeightMm, excesoAlIntentarMm:trial[p].overflowHeightMm});
          break;
        }
        transfers.push({desde:p + 2, hacia:p + 1, bloque:next.type, fila:next.type === "row" ? next.row.number : null});
      }
    }
    var finalMetrics = await measureFlowPages(session, pages);
    return {flowPages:pages, distribution:pages.map(function(page) {return page.filter(function(u){return u.type === "row";}).length;}),
      metrics:finalMetrics, totalBonusCards:printBonusCards().length,
      bonusFirstPageCount:finalMetrics[0].bonusCards, score:0, imbalanceReason:"",
      breakReasons:breaks, transfers:transfers, measurements:measurements,
      selectionReason:"Colocación secuencial por altura DOM real, fila a fila, seguida de comprobación de cada frontera; sin igualar cantidades ni reservar el cierre en páginas intermedias."};
  }

  function explainPrintWhitespace(selected, metrics) {
    if (selected.flowPages) {
      return selected.breakReasons.map(function(reason) { return "Página " + reason.pagina + ": " + reason.motivo; })
        .concat(["Última página: espacio restante después del cierre íntegro, sin contenido posterior que trasladar."]);
    }
    var reasons = [];
    if (selected.bonusFirstPageCount < selected.totalBonusCards) {
      reasons.push("Página 1: se probaron " + selected.totalBonusCards + " tarjetas completas; la alternativa excedió la altura útil medida y se conservó " + selected.bonusFirstPageCount + " sin dividir ninguna tarjeta.");
    }
    return reasons.concat(metrics.map(function (metric, index) {
      var limit = index === 0 ? 25 : (index === metrics.length - 1 ? 45 : 30);
      if (metric.emptyPercent <= limit) {
        return null;
      }
      if (index === 0 && selected.bonusFirstPageCount < selected.totalBonusCards) {
        return "Página 1: la siguiente tarjeta completa desbordó en las alternativas medidas; no se dividió el beneficio.";
      }
      if (index === metrics.length - 1) {
        return "Página " + (index + 1) + ": el cierre contractual permanece unido y las alternativas con más filas en esta página no mejoraron la puntuación sin afectar otra página.";
      }
      return "Página " + (index + 1) + ": mover otra fila o bloque completo desde la página siguiente produjo desbordamiento o una distribución global con peor puntuación.";
    }).filter(Boolean));
  }

  function printPageNumberForNode(root, node) {
    if (!node) {
      return null;
    }
    var sheet = node.closest(".print-sheet");
    var sheets = Array.from(root.querySelectorAll(".print-sheet"));
    var index = sheets.indexOf(sheet);
    return index >= 0 ? index + 1 : null;
  }

  function validatePrintSemanticOrder(session) {
    var blocks = Array.from(session.root.querySelectorAll("[data-print-block]"));
    var order = blocks.map(function (block) {
      return block.dataset.printBlock;
    });
    var previousIndex = -1;
    var orderValid = order.every(function (token) {
      var index = PRINT_SEMANTIC_SEQUENCE.indexOf(token);
      if (index < 0 || index < previousIndex) {
        return false;
      }
      previousIndex = index;
      return true;
    });
    var rowNumbers = Array.from(session.root.querySelectorAll("[data-print-row-number]")).map(function (row) {
      return Number(row.dataset.printRowNumber);
    });
    var expectedRows = currentCalculation.rows.map(function (row) { return row.number; });
    var rowsContinuous = rowNumbers.length === expectedRows.length && rowNumbers.every(function (number, index) {
      return number === expectedRows[index];
    });
    var bonusBlocks = Array.from(session.root.querySelectorAll('[data-print-block="BONUSES"]'));
    var bonusBlock = bonusBlocks.length ? bonusBlocks[0] : null;
    var firstCalendar = session.root.querySelector('[data-print-block="PAYMENT_CALENDAR"]');
    var calendars = Array.from(session.root.querySelectorAll('[data-print-block="PAYMENT_CALENDAR"]'));
    var lastCalendar = calendars.length ? calendars[calendars.length - 1] : null;
    var finalBlock = session.root.querySelector('[data-print-block="FINAL_TOTAL"]');
    var bonusesBeforeCalendar = !bonusBlocks.length || (firstCalendar && bonusBlocks.every(function (block) {
      return Boolean(block.compareDocumentPosition(firstCalendar) & Node.DOCUMENT_POSITION_FOLLOWING);
    }));
    var totalOnlyAfterLastPayment = Boolean(lastCalendar && finalBlock && (lastCalendar.compareDocumentPosition(finalBlock) & Node.DOCUMENT_POSITION_FOLLOWING));
    return {
      valid: orderValid && rowsContinuous && bonusesBeforeCalendar && totalOnlyAfterLastPayment,
      order: order,
      rowsContinuous: rowsContinuous,
      bonusesBeforeCalendar: bonusesBeforeCalendar,
      totalOnlyAfterLastPayment: totalOnlyAfterLastPayment,
      calendarStartPage: printPageNumberForNode(session.root, firstCalendar),
      bonusPage: printPageNumberForNode(session.root, bonusBlock),
      bonusPages: bonusBlocks.map(function (block) { return printPageNumberForNode(session.root, block); }),
      firstRow: rowNumbers.length ? rowNumbers[0] : null,
      lastRow: rowNumbers.length ? rowNumbers[rowNumbers.length - 1] : null
    };
  }

  function validatePrintContract(session, metrics) {
    var required = currentTariff.numero_pagos > 1;
    if (!required) {
      return { required: false, pageIndex: -1, visible: true };
    }
    var block = session.root.querySelector('[data-print-role="contract-total-block"]');
    var title = block ? block.querySelector('[data-print-role="contract-total-title"]') : null;
    var value = block ? block.querySelector('[data-print-role="contract-total-value"]') : null;
    session.contractTotalBlock = block;
    session.contractTotalTitle = title;
    session.contractTotalValue = value;
    var pageNumber = printPageNumberForNode(session.root, block);
    var pageIndex = pageNumber == null ? -1 : pageNumber - 1;
    var blockRect = block ? block.getBoundingClientRect() : null;
    var valueRect = value ? value.getBoundingClientRect() : null;
    var blockStyle = block ? global.getComputedStyle(block) : null;
    var titleStyle = title ? global.getComputedStyle(title) : null;
    var valueStyle = value ? global.getComputedStyle(value) : null;
    var expectedValue = formatCOP(currentTariff.valor_total_oficial_cop);
    var metric = pageIndex >= 0 ? metrics[pageIndex] : null;
    var visible = Boolean(block && title && value && metric && metric.contractVisible &&
      title.textContent.trim() && value.textContent.trim() === expectedValue &&
      blockRect.width > 0 && blockRect.height > 0 && valueRect.width > 0 && valueRect.height > 0 &&
      blockStyle.display !== "none" && blockStyle.visibility !== "hidden" &&
      titleStyle.display !== "none" && titleStyle.visibility !== "hidden" &&
      valueStyle.display !== "none" && valueStyle.visibility !== "hidden");
    return { required: true, pageIndex: pageIndex, visible: visible };
  }

  var printPreparationError = "";

  async function preparePrintDocument(session) {
    var container = session.root;
    printPreparationError = "";
    if (!ensureCurrentQuote()) {
      return false;
    }
    var selected = await chooseMeasuredPrintDistribution(session);
    requireActivePrintSession(session);
    if (!selected) {
      printPreparationError = "No fue posible generar correctamente el resumen económico. Reintenta la impresión.";
      return false;
    }
    var finalSheets = renderPrintDistribution(session, selected);
    container.classList.remove("print-measure-root");
    container.classList.add("print-pages-temporary");
    await waitForStablePrintLayout(session);
    requireActivePrintSession(session);
    var finalMetrics = finalSheets.map(measurePrintSheet);
    var hasOverflow = finalMetrics.some(function (metric) { return metric.overflow; });
    var whitespaceReasons = explainPrintWhitespace(selected, finalMetrics);
    var selectedBonusDistribution = finalMetrics.map(function(metric) { return metric.bonusCards; });
    var contractValidation = validatePrintContract(session, finalMetrics);
    var semanticValidation = validatePrintSemanticOrder(session);
    var contractPageIndex = contractValidation.pageIndex;
    var contractVisible = contractValidation.visible;
    container.dataset.printPages = String(selected.distribution.length);
    container.dataset.printDistribution = selected.distribution.join(",");
    container.dataset.printEmptyPercentages = finalMetrics.map(function (metric) {
      return metric.emptyPercent;
    }).join(",");
    container.dataset.printUsedHeightsMm = finalMetrics.map(function (metric) {
      return metric.usedHeightMm;
    }).join(",");
    container.dataset.printFreeHeightsMm = finalMetrics.map(function (metric) {
      return metric.freeHeightMm;
    }).join(",");
    container.dataset.printRowHeightsMm = finalMetrics.map(function (metric) {
      return metric.rowHeightsMm.join("|");
    }).join(";");
    container.dataset.printClosingHeightsMm = finalMetrics.map(function (metric) {
      return metric.closingHeightMm;
    }).join(",");
    container.dataset.printBalanceReason = selected.imbalanceReason || "";
    container.dataset.printOrphanTitles = "false";
    container.dataset.printTotalOnlyFinal = String(semanticValidation.totalOnlyAfterLastPayment);
    container.dataset.printBlocksIncluded = finalMetrics.map(function (metric) {
      return metric.blocksIncluded.join("|");
    }).join(";");
    container.dataset.printContractPage = contractPageIndex >= 0 ? String(contractPageIndex + 1) : "";
    container.dataset.printContractVisible = String(contractVisible);
    container.dataset.printSemanticOrder = String(semanticValidation.valid);
    container.dataset.printCalendarStartPage = String(semanticValidation.calendarStartPage || "");
    container.dataset.printBonusPage = String(semanticValidation.bonusPage || "");
    container.dataset.printBonusDistribution = finalMetrics.map(function (metric) {
      return metric.bonusCards;
    }).join(",");
    container.dataset.printCandidatesEvaluated = String(session.candidateDiagnostics.length);
    container.dataset.printOmittedEmptyBlocks = Array.from(session.omittedEmptyBlocks || []).join("|");
    container.dataset.printSelectedScore = String(Math.round(selected.score * 100) / 100);
    container.dataset.printFirstRow = String(semanticValidation.firstRow || "");
    container.dataset.printLastRow = String(semanticValidation.lastRow || "");
    global.SMART_LAST_PRINT_DIAGNOSTICS = Object.freeze({
      sesionImpresionId: session.id,
      numeroImpresionConsecutiva: session.sequenceNumber,
      temporalesEncontradosAntes: session.temporariesFoundBefore,
      temporalesEliminadosAntes: session.temporariesDeletedBefore,
      numeroPagos: currentCalculation.rows.length,
      cantidadTotalPagos: currentCalculation.rows.length,
      cantidadBeneficios: selected.totalBonusCards,
      paginas: selected.distribution.length,
      alturaUtilMm: finalMetrics.map(function(metric) { return metric.usableHeightMm; }),
      motivosSaltosPagina: selected.breakReasons || [],
      bloquesTrasladadosRebalanceo: selected.transfers || [],
      fronterasVerificadas: (selected.breakReasons || []).length,
      medicionesDOM: selected.measurements || 0,
      filasPorPagina: selected.distribution.slice(),
      alturaUtilizadaMm: finalMetrics.map(function (metric) { return metric.usedHeightMm; }),
      espacioLibreMm: finalMetrics.map(function (metric) { return metric.freeHeightMm; }),
      porcentajeUtilizado: finalMetrics.map(function (metric) { return metric.usedPercent; }),
      porcentajeLibre: finalMetrics.map(function (metric) { return metric.emptyPercent; }),
      porcentajeLibrePrimeraPagina: finalMetrics.length ? finalMetrics[0].emptyPercent : 0,
      bloquesIncluidos: finalMetrics.map(function (metric) { return metric.blocksIncluded.slice(); }),
      beneficiosPorPagina: finalMetrics.map(function (metric) { return metric.bonusCards; }),
      beneficiosUbicadosPorPagina: finalMetrics.map(function (metric) { return metric.bonusTitles.slice(); }),
      bloquesOmitidosPorEstarVacios: Array.from(session.omittedEmptyBlocks || []),
      alturaBloqueFinalMm: finalMetrics.map(function (metric) { return metric.closingHeightMm; }),
      ordenBloques: semanticValidation.order.slice(),
      ordenSemanticoValido: semanticValidation.valid,
      paginaInicioCalendario: semanticValidation.calendarStartPage,
      paginaAdicionales: semanticValidation.bonusPage,
      paginasAdicionales: semanticValidation.bonusPages.slice(),
      primeraFilaCalendario: semanticValidation.firstRow,
      ultimaFilaCalendario: semanticValidation.lastRow,
      filasContinuas: semanticValidation.rowsContinuous,
      adicionalesAntesDelCalendario: semanticValidation.bonusesBeforeCalendar,
      totalSoloDespuesDelUltimoPago: semanticValidation.totalOnlyAfterLastPayment,
      paginaValorContractual: contractPageIndex >= 0 ? contractPageIndex + 1 : null,
      valorContractualVisible: contractVisible,
      reservaSeguridadMm: 0.5,
      desbordamientosDetectados: finalMetrics.map(function (metric, index) {
        return metric.overflow ? index + 1 : null;
      }).filter(Boolean),
      razonDesequilibrio: selected.imbalanceReason || "",
      distribucionesCandidatasEvaluadas: session.candidateDiagnostics.slice(),
      cantidadDistribucionesCandidatasEvaluadas: session.candidateDiagnostics.length,
      distribucionSeleccionada: {
        paginas: selected.distribution.length,
        filasPorPagina: selected.distribution.slice(),
        beneficiosPorPagina: selectedBonusDistribution,
        puntuacion: Math.round(selected.score * 100) / 100,
        razonSeleccion: selected.selectionReason
      },
      razonesEspacioVacioSuperiorAlLimite: whitespaceReasons,
      limpiezaCompletada: false,
      isPrintingAlFinalizar: true
    });
    elements["print-document"].dataset.lastDiagnostics = JSON.stringify(global.SMART_LAST_PRINT_DIAGNOSTICS);
    if (!semanticValidation.valid) {
      printPreparationError = "No fue posible organizar correctamente la cotización. Reintenta la impresión.";
      return false;
    }
    if (hasOverflow || !contractVisible) {
      printPreparationError = "No fue posible generar correctamente el resumen económico. Reintenta la impresión.";
      return false;
    }
    elements["print-document"].classList.remove("is-measuring");
    elements["print-document"].setAttribute("aria-hidden", "false");
    return true;
  }

  var pendingPrintSaveAsPdf = false;
  var pendingPrintFileName = "";

  function closePrintGuidance() {
    if (typeof elements["print-guidance-dialog"].close === "function") {
      elements["print-guidance-dialog"].close();
    } else {
      elements["print-guidance-dialog"].removeAttribute("open");
    }
  }

  function cancelPrintGuidance() {
    pendingPrintSaveAsPdf = false;
    pendingPrintFileName = "";
    closePrintGuidance();
    if (!isPrinting) {
      setPrintControlsDisabled(false);
    }
  }

  async function continuePrinting() {
    if (isPrinting) {
      showToast("Ya existe una impresión en preparación. Espera a que finalice.");
      return;
    }
    var saveAsPdf = pendingPrintSaveAsPdf;
    var requestedPdfFileName = pendingPrintFileName;
    closePrintGuidance();
    showClientView();
    var session = createFreshPrintSession();
    try {
      if (!await preparePrintDocument(session)) {
        if (activePrintSession !== session) { return; }
        var preparationMessage = printPreparationError || "No fue posible generar correctamente el resumen económico. Reintenta la impresión.";
        cleanupPrintSession("preparacion_fallida");
        showToast(preparationMessage);
        return;
      }
    } catch (error) {
      if (activePrintSession !== session) { return; }
      cleanupPrintSession("excepcion_de_preparacion");
      showToast("No fue posible generar correctamente el resumen económico. Reintenta la impresión.");
      return;
    }
    if (activePrintSession !== session) { return; }
    if (!ensureCurrentQuote()) { cleanupPrintSession("cotizacion_modificada_durante_preparacion"); return; }
    if (saveAsPdf) {
      session.documentTitleBeforePrint = document.title;
      session.pdfFileName = requestedPdfFileName || buildPdfFileName(currentWhatsAppMessageData(shareContextId));
      document.title = session.pdfFileName.replace(/\.pdf$/i, "");
      updateLastPrintDiagnostics({ destinoPdfPreparado: true });
      showToast("En Destino selecciona “Guardar como PDF” y conserva la configuración indicada.");
    }
    printLaunchTimer = global.setTimeout(function () {
      printLaunchTimer = null;
      if (!activePrintSession || activePrintSession.id !== session.id) {
        return;
      }
      try {
        if (!ensureCurrentQuote()) { cleanupPrintSession("cotizacion_modificada_antes_de_imprimir"); return; }
        global.print();
      } catch (error) {
        showToast("No fue posible abrir el diálogo de impresión. Reintenta la impresión.");
      } finally {
        if (activePrintSession && activePrintSession.id === session.id) {
          schedulePrintCleanupFallback(session.id);
        }
      }
    }, 150);
  }

  function printProposal(saveAsPdf, suggestedFileName) {
    if (isPrinting) {
      showToast("Ya existe una impresión en preparación. Espera a que finalice.");
      return;
    }
    if (!ensureCurrentQuote()) {
      return;
    }
    if (elements["print-guidance-dialog"].open) {
      return;
    }
    pendingPrintSaveAsPdf = Boolean(saveAsPdf);
    pendingPrintFileName = saveAsPdf
      ? (suggestedFileName || buildPdfFileName(currentWhatsAppMessageData(shareContextId)))
      : "";
    if (typeof elements["print-guidance-dialog"].showModal === "function") {
      elements["print-guidance-dialog"].showModal();
    } else {
      elements["print-guidance-dialog"].setAttribute("open", "");
    }
  }

  function newQuote() {
    quoteSessionVersion += 1;
    closeSharePreview();
    closeGmailAccountConfirmation();
    closeWhatsAppFollowup();
    closePrintGuidance();
    cleanupPrintSession("nueva_cotizacion");
    printPreparationError = "";
    printSessionCounter = 0;
    shareInProgress = false;
    [
      "SMART_LAST_WHATSAPP_DIAGNOSTICS", "SMART_LAST_SHARE_DIAGNOSTICS",
      "SMART_LAST_MANAGER_BACKUP_DIAGNOSTICS", "SMART_LAST_PRINT_DIAGNOSTICS"
    ].forEach(function (name) { delete global[name]; });
    delete elements["print-document"].dataset.lastDiagnostics;
    // Solo contiene la presentación inicial, capturada antes de ingresar datos personales.
    initialQuotePresentation.forEach(function (initial) {
      initial.node.textContent = initial.text;
      initial.node.hidden = initial.hidden;
      if (initial.disabled !== undefined) { initial.node.disabled = initial.disabled; }
    });
    ["share-whatsapp-fallback", "share-email-fallback", "manager-backup-fallback"].forEach(function (id) {
      elements[id].setAttribute("href", "#");
      elements[id].hidden = true;
    });
    elements["share-email-subject-row"].hidden = true;
    elements["gmail-bcc-fallback"].hidden = true;
    elements["manager-backup-step"].hidden = true;
    byId("whatsapp-confirm-actions").hidden = false;
    elements["share-pdf-status"].classList.remove("is-unavailable");
    elements["client-observation-section"].hidden = true;
    elements["cliente-indicativo-otro"].setAttribute("aria-invalid", "false");
    elements["jefe-ventas"].setAttribute("aria-invalid", "false");
    setShareChannel("WHATSAPP");
    quote = {
      status: "EN_PREPARACION",
      generatedAt: null,
      expiresAt: null,
      reference: null,
      campaignId: null,
      bonusDeadline: null,
      additionalSnapshot: [],
      additionalSignature: "",
      tariffTrace: null,
      enrollmentDate: "",
      salesManagerId: "", negotiationSignature: ""
    };
    promotionExpired = false;
    shareContextId = DEFAULT_SHARE_CONTEXT;
    shareChannelId = "WHATSAPP";
    preparedWhatsAppMessage = "";
    whatsappBackupState = "NO_PREPARADO";
    whatsappOpenedAt = 0;
    whatsappWindow = null;
    lastWhatsAppUrl = "";
    lastWhatsAppOpenAttemptAt = 0;
    byId("btn-confirmar-respaldo-jefe").disabled = false;
    elements["share-context"].value = DEFAULT_SHARE_CONTEXT;
    if (elements["share-dialog"].open) {
      closeSharePreview();
    }
    elements.cliente.value = "";
    elements["cliente-pais"].value = "CO";
    elements["cliente-indicativo-otro"].value = "";
    updateOtherCountryDialVisibility();
    elements["cliente-celular"].value = "";
    elements["cliente-correo"].value = "";
    setContactFieldError(elements["cliente-celular"], elements["cliente-celular-error"], "");
    setContactFieldError(elements["cliente-correo"], elements["cliente-correo-error"], "");
    elements.asesor.value = "";
    elements["jefe-ventas-regional"].value = "";
    populateSalesManagerRegions("");
    populateSalesManagers("");
    elements.observacion.value = "";
    renderProductLabels();
    populateSites("");
    resetDependentTariffSelectors();
    var today = todayBogotaISO();
    elements["fecha-matricula"].value = "";
    elements["fecha-acreditacion-pago-inicial-estimada"].value = today;
    refreshEnrollmentCalendar({ markModified: false });
    updateDateRange(true);
    renderCatalogUpdateLabel();
    updateProgressiveForm();
    renderQuoteState();
    showAdvisorView();
    showValidation([]);
    showToast("Nueva cotización lista. Los datos personales anteriores fueron eliminados.");
  }

  var toastTimer = null;
  function showToast(message) {
    global.clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.hidden = false;
    toastTimer = global.setTimeout(function () {
      elements.toast.hidden = true;
    }, 3600);
  }

  function bindEvents() {
    elements.sede.addEventListener("change", handleSiteChange);
    elements.plan.addEventListener("change", handlePlanChange);
    elements.condicion.addEventListener("change", handleConditionChange);
    elements["numero-pagos"].addEventListener("change", handlePaymentChange);
    elements["jefe-ventas-regional"].addEventListener("change", function () {
      markModified();
      populateSalesManagers("");
      validateSalesManagerForSharing(false);
    });
    elements["jefe-ventas"].addEventListener("change", handleSalesManagerChange);
    elements["cuota-propuesta"].addEventListener("input", handleMoneyInput);
    elements["cuota-propuesta"].addEventListener("blur", normalizeMoneyField);
    elements["mensualidades-deseadas"].addEventListener("change", function(){markModified(); calculateAndRender();});
    elements["fecha-matricula"].addEventListener("change", handleEnrollmentChange);
    elements["fecha-matricula"].addEventListener("focus", function () {
      refreshEnrollmentCalendar({ markModified: true });
    });
    elements["fecha-acreditacion-pago-inicial-estimada"].addEventListener("change", function () {
      markModified();
      updateDateRange(true);
      calculateAndRender();
    });
    elements["fecha-primera-cuota"].addEventListener("change", function () {
      markModified();
      calculateAndRender();
    });
    [elements.cliente, elements["cliente-celular"], elements["cliente-indicativo-otro"], elements["cliente-correo"], elements.asesor, elements.observacion].forEach(function (input) {
      input.addEventListener("input", function () {
        markModified();
        renderProposal();
      });
    });
    elements["cliente-pais"].addEventListener("change", function () {
      markModified();
      updateOtherCountryDialVisibility();
      validateClientPhone(false);
      renderProposal();
    });
    elements["cliente-indicativo-otro"].addEventListener("input", function () {
      setContactFieldError(elements["cliente-celular"], elements["cliente-celular-error"], "");
      elements["cliente-indicativo-otro"].setAttribute("aria-invalid", "false");
    });
    elements["cliente-indicativo-otro"].addEventListener("blur", function () { validateClientPhone(false); });
    elements["cliente-celular"].addEventListener("input", function () {
      setContactFieldError(elements["cliente-celular"], elements["cliente-celular-error"], "");
    });
    elements["cliente-celular"].addEventListener("blur", function () { validateClientPhone(false); });
    elements["cliente-correo"].addEventListener("input", function () {
      setContactFieldError(elements["cliente-correo"], elements["cliente-correo-error"], "");
    });
    elements["cliente-correo"].addEventListener("blur", validateClientEmail);
    elements["advisor-additional-options"].addEventListener("change", handleAdditionalOptionsChange);
    elements["paquete-completo-adicionales"].addEventListener("change", handleFullPackageChange);

    byId("btn-actualizar").addEventListener("click", function () {
      if (calculateAndRender()) {
        showToast("Cálculo actualizado correctamente.");
      }
    });
    byId("btn-generar").addEventListener("click", generateQuote);
    byId("btn-vista-cliente").addEventListener("click", showClientView);
    byId("btn-volver").addEventListener("click", showAdvisorView);
    byId("btn-nueva").addEventListener("click", newQuote);
    byId("btn-compartir").addEventListener("click", openSharePreview);
    byId("btn-whatsapp").addEventListener("click", openSharePreview);
    byId("btn-client-compartir").addEventListener("click", openSharePreview);
    byId("btn-client-whatsapp").addEventListener("click", openSharePreview);
    byId("btn-imprimir").addEventListener("click", function () { printProposal(false); });
    byId("btn-pdf").addEventListener("click", function () { printProposal(true); });
    byId("btn-client-print").addEventListener("click", function () { printProposal(true); });
    byId("btn-cerrar-compartir").addEventListener("click", closeSharePreview);
    byId("btn-copiar-mensaje-manual").addEventListener("click", copyShareFromPreview);
    byId("btn-compartir-dialog").addEventListener("click", function () {
      if (shareChannelId === "EMAIL") {
        prepareEmailShareStep();
      } else {
        shareCurrentQuote();
      }
    });
    byId("btn-descargar-pdf-compartir").addEventListener("click", downloadPdfFromShare);
    elements["share-context"].addEventListener("change", function () {
      shareContextId = normalizeShareContext(elements["share-context"].value);
      renderSharePreview();
    });
    document.querySelectorAll('input[name="share-channel"]').forEach(function (input) {
      input.addEventListener("change", function () {
        setShareChannel(input.value);
        renderSharePreview();
      });
    });
    byId("btn-continuar-gmail").addEventListener("click", continueToGmail);
    byId("btn-cancelar-gmail").addEventListener("click", closeGmailAccountConfirmation);
    elements["gmail-account-dialog"].addEventListener("click", function (event) {
      if (event.target === elements["gmail-account-dialog"]) {
        closeGmailAccountConfirmation();
      }
    });
    byId("btn-whatsapp-todavia-no").addEventListener("click", closeWhatsAppFollowup);
    byId("btn-whatsapp-confirmado").addEventListener("click", confirmWhatsAppDelivered);
    byId("btn-preparar-respaldo-jefe").addEventListener("click", prepareManagerBackup);
    byId("btn-confirmar-respaldo-jefe").addEventListener("click", confirmManagerBackupManually);
    elements["manager-backup-fallback"].addEventListener("click", function () {
      whatsappBackupState = "RESPALDO_JEFE_PREPARADO";
    });
    elements["share-whatsapp-fallback"].addEventListener("click", function () {
      whatsappBackupState = "WHATSAPP_ABIERTO";
      whatsappOpenedAt = Date.now();
    });
    elements["whatsapp-followup-dialog"].addEventListener("click", function (event) {
      if (event.target === elements["whatsapp-followup-dialog"]) {
        closeWhatsAppFollowup();
      }
    });
    byId("btn-continuar-impresion").addEventListener("click", continuePrinting);
    byId("btn-cancelar-impresion").addEventListener("click", cancelPrintGuidance);
    elements["print-guidance-dialog"].addEventListener("click", function (event) {
      if (event.target === elements["print-guidance-dialog"]) {
        cancelPrintGuidance();
      }
    });
    elements["share-dialog"].addEventListener("click", function (event) {
      if (event.target === elements["share-dialog"]) {
        closeSharePreview();
      }
    });
    global.addEventListener("afterprint", function () {
      cleanupPrintSession("afterprint");
    });
    global.addEventListener("focus", function () {
      refreshEnrollmentCalendar({ markModified: true });
      maybeShowWhatsAppFollowup();
    });
  }

  function init() {
    collectElements();
    var today = todayBogotaISO();
    elements["fecha-matricula"].value = "";
    elements["fecha-acreditacion-pago-inicial-estimada"].value = today;
    elements["cliente-pais"].value = "CO";
    updateOtherCountryDialVisibility();
    populateSalesManagerRegions("");
    populateSalesManagers("");
    renderProductLabels();
    populateSites("");
    resetDependentTariffSelectors();
    renderCatalogUpdateLabel();
    updateProgressiveForm();
    var siteDate = String(siteMeta.fecha_actualizacion_disponibilidad || "").split("-");
    setBoundText("sedes-actualizadas", "Configuración de sedes actualizada el: " + (siteDate.length === 3 ? siteDate.reverse().join("/") : "sin fecha"));
    updateDateRange(true);
    refreshEnrollmentCalendar({ markModified: false });
    bindEvents();
    showCatalogValidation();
    renderAdditionalSections();
    initializing = false;
    renderQuoteState();
    var presentationIds = [
      "commercial-message", "client-commercial-message", "client-contact-details",
      "client-additionals-deadline", "client-additionals-expired", "client-last-payment-note",
      "share-preview-client", "share-preview-language", "share-preview-payment", "share-preview-validity",
      "share-message-preview", "share-message-length", "share-email-subject", "share-message-label",
      "share-message-format", "share-manager-notice", "share-pdf-status-text", "gmail-account-detail",
      "gmail-bcc-message", "whatsapp-delivery-status", "manager-backup-description", "manager-backup-status",
      "btn-compartir-dialog", "btn-confirmar-respaldo-jefe", "btn-descargar-pdf-compartir"
    ];
    initialQuotePresentation = Array.from(new Set(
      Array.from(document.querySelectorAll("[data-bind]")).concat(presentationIds.map(byId))
    )).filter(Boolean).map(function (node) {
      return { node: node, text: node.textContent, hidden: node.hidden, disabled: node.disabled };
    });
    global.setInterval(function () {
      refreshExpiration();
      refreshEnrollmentCalendar({ markModified: true });
    }, 30000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(typeof window !== "undefined" ? window : globalThis);
