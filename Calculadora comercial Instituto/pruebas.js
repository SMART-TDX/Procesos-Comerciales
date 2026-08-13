"use strict";

/*
 * Pruebas reproducibles de la calculadora.
 * Ejecución: node pruebas.js
 * No modifica los Excel ni requiere paquetes externos.
 */

var fs = require("fs");
var path = require("path");
require("./configuracion_sedes.js");
require("./configuracion_jefes_ventas.js");
require("./configuracion_adicionales.js");
require("./configuracion_campanas_adicionales.js");
require("./configuracion_modelos_tarifarios.js");
require("./tarifas.js");
require("./tarifas_modelo_mp.js");
require("./aplicacion.js");

var tarifas = global.SMART_TARIFAS;
var tarifasMP = global.SMART_TARIFAS_MP;
var modelosTarifarios = global.SMART_MODELOS_TARIFARIOS;
var sedes = global.SMART_SEDES;
var validacionSedes = global.SMART_SEDES_VALIDACION;
var jefesVentas = global.SMART_JEFES_VENTAS;
var validacionJefesVentas = global.SMART_JEFES_VENTAS_VALIDACION;
var adicionales = global.SMART_ADICIONALES;
var validacionAdicionales = global.SMART_ADICIONALES_VALIDACION;
var campanasAdicionales = global.SMART_CAMPANAS_ADICIONALES;
var validacionCampanas = global.SMART_CAMPANAS_ADICIONALES_VALIDACION;
var core = global.SMART_APP_CORE;
var passed = 0;
var failed = 0;
var failures = [];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Aserción incumplida");
  }
}

function assertThrows(action, message) {
  var thrown = false;
  try {
    action();
  } catch (error) {
    thrown = true;
  }
  assert(thrown, message || "Se esperaba que la operación fallara");
}

function equal(actual, expected, message) {
  if (actual !== expected) {
    throw new Error((message || "Valores distintos") + ": esperado " + JSON.stringify(expected) + ", obtenido " + JSON.stringify(actual));
  }
}

function deepEqual(actual, expected, message) {
  equal(JSON.stringify(actual), JSON.stringify(expected), message);
}

function test(name, operation) {
  try {
    operation();
    passed += 1;
    console.log("OK  " + name);
  } catch (error) {
    failed += 1;
    failures.push({ name: name, error: error.message });
    console.error("FALLO  " + name + " — " + error.message);
  }
}

function findTariff(key, languageId) {
  var language = languageId || (String(key[1]).indexOf("FRA_INST_") === 0 ? "FRANCES" : "INGLES");
  return tarifas.find(function (tariff) {
    return tariff.idioma_id === language && tariff.zona_id === key[0] &&
      tariff.plan_id === key[1] &&
      tariff.condicion_id === key[2] &&
      tariff.numero_pagos === key[3];
  });
}

function findMPTariff(modelId, languageId, planId, conditionId, paymentCount) {
  return tarifasMP.find(function (tariff) {
    return tariff.modelo_tarifario_id === modelId && tariff.idioma_id === languageId &&
      tariff.plan_id === planId && tariff.condicion_id === conditionId &&
      tariff.numero_pagos === paymentCount;
  });
}

function standardPlan(tariff, initialCop) {
  return core.buildPaymentPlan(tariff, {
    initialCop: initialCop,
    enrollmentDate: "2026-01-01",
    accreditationDate: "2026-01-01",
    firstMonthlyDate: "2026-02-01"
  });
}

var requiredFields = [
  "idioma_id", "idioma_nombre", "producto_id", "zona_id", "zona_tarifaria", "plan_id", "nombre_plan_original", "nombre_plan_interfaz",
  "numero_niveles", "niveles_incluidos", "horas_academicas", "condicion_id",
  "condicion_comercial", "numero_pagos", "porcentaje_descuento_raw_excel",
  "porcentaje_descuento_exacto", "valor_full_raw_excel", "valor_full_oficial_cop",
  "cuota_inicial_raw_excel", "cuota_inicial_minima_cop",
  "cuota_mensual_referencia_raw_excel", "cuota_mensual_referencia_cop",
  "valor_total_raw_excel", "valor_total_oficial_cop", "valor_por_hora_raw_excel",
  "valor_por_hora_mostrado_cop", "maxima_intensidad_mensual_raw",
  "maxima_intensidad_mensual_mostrada", "archivo_origen", "hoja_origen", "fila_origen"
];

function additionalContext(overrides) {
  return Object.assign({
    languageId: "INGLES",
    planId: "ING_INST_A1_A2_B1_B2",
    numberOfLevels: 4,
    fullListCop: 2425000,
    academicHours: 162,
    siteId: "CUND_MODELIA",
    conditionId: "PRECIO_AL_PUBLICO",
    paymentCount: 24
  }, overrides || {});
}

function shareMessageData(overrides) {
  return Object.assign({
    clientName: "Ana María",
    advisorName: "Luis Pérez",
    languageId: "INGLES",
    siteName: "Cajicá",
    programName: "Plan de 3 niveles – A1, A2 y B1 (502 horas)",
    levelsIncluded: ["A1", "A2", "B1"],
    academicHours: 502,
    numberOfPayments: 20,
    initialCop: 500000,
    remainingPayments: 19,
    regularMonthlyCop: 200000,
    lastMonthlyCop: 199999,
    firstMonthlyDateText: "3 de septiembre de 2026",
    accreditationDateText: "4 de agosto de 2026",
    totalContractCop: 4299999,
    savingsCop: 1200000,
    discountText: "21,83 %",
    additionals: [],
    additionalsTotalCop: 0,
    quoteExpired: false,
    benefitsExpired: false,
    expirationDate: "6 de agosto de 2026",
    expirationTime: "5:22 p. m.",
    reference: "SMART-20260804-1722-ABC",
    contextId: "SEGUIMIENTO_GENERAL"
  }, overrides || {});
}

test("catálogo con 750 tarifas", function () {
  equal(tarifas.length, 750);
  assert(core.validateTariffCatalog(tarifas).valid);
});

test("catálogo MP contiene 452 tarifas válidas y conserva 1.202 disponibles", function () {
  equal(tarifasMP.length, 452);
  assert(core.validateMPTariffCatalog(tarifasMP).valid);
  equal(tarifas.length + tarifasMP.length, 1202);
});

test("conteos MP por modalidad e idioma coinciden exactamente", function () {
  var validation = core.validateMPTariffCatalog(tarifasMP);
  deepEqual(validation.counts, {
    total: 452,
    integral: 256,
    etapas: 196,
    ingles: 276,
    frances: 176,
    integralIngles: 160,
    integralFrances: 96,
    etapasIngles: 116,
    etapasFrances: 80
  });
  equal(validation.zeroContinuities, 2);
});

test("las tres estrategias están activas y Portafolio institucional es predeterminada", function () {
  equal(modelosTarifarios.length, 3);
  assert(global.SMART_MODELOS_TARIFARIOS_VALIDACION.valida);
  deepEqual(modelosTarifarios.map(function (item) { return item.modelo_tarifario_id; }), [
    "PORTAFOLIO_INSTITUCIONAL", "MODELO_MP_PAQUETES", "MODELO_MP_NIVEL_A_NIVEL"
  ]);
  equal(modelosTarifarios.filter(function (item) { return item.predeterminado; })[0].modelo_tarifario_id, "PORTAFOLIO_INSTITUCIONAL");
});

test("MP es nacional, usa cuatro condiciones y Francés nunca contiene C1", function () {
  assert(tarifasMP.every(function (item) { return item.aplicacion_nacional && item.zona_id === "NACIONAL"; }));
  deepEqual(Array.from(new Set(tarifasMP.map(function (item) { return item.condicion_id; }))), [
    "PRECIO_AL_PUBLICO", "ALIANZA_MASIVA", "ALIANZA_EMPRESARIAL", "COLABORADOR"
  ]);
  assert(tarifasMP.filter(function (item) { return item.idioma_id === "FRANCES"; }).every(function (item) {
    return item.niveles_incluidos.indexOf("C1") < 0;
  }));
});

test("Programa por etapas incorpora ruta y nivel en todas sus claves", function () {
  var etapas = tarifasMP.filter(function (item) { return item.modelo_tarifario_id === "MODELO_MP_NIVEL_A_NIVEL"; });
  assert(etapas.every(function (item) {
    return item.plan_id.indexOf("INICIO_" + item.ruta_inicio + "_NIVEL_" + item.nivel_contratado) >= 0;
  }));
  var b1A1 = findMPTariff("MODELO_MP_NIVEL_A_NIVEL", "INGLES", "MP_ETAPAS_INICIO_A1_NIVEL_B1", "PRECIO_AL_PUBLICO", 1);
  var b1A2 = findMPTariff("MODELO_MP_NIVEL_A_NIVEL", "INGLES", "MP_ETAPAS_INICIO_A2_NIVEL_B1", "PRECIO_AL_PUBLICO", 1);
  assert(b1A1 && b1A2 && b1A1.plan_id !== b1A2.plan_id);
});

test("los únicos contratos MP de $0 son continuidades C1 autorizadas", function () {
  var zero = tarifasMP.filter(function (item) { return item.valor_total_oficial_cop === 0; });
  equal(zero.length, 2);
  assert(zero.every(function (item) {
    return item.idioma_id === "INGLES" && item.ruta_inicio === "A1" && item.nivel_contratado === "C1" &&
      item.numero_pagos === 1 && item.porcentaje_descuento_exacto === "1" &&
      item.tipo_beneficio_continuidad === "RENOVACION_NIVEL_BONIFICADO";
  }));
});

test("las 452 tarifas MP producen calendarios exactos con la cuota mínima", function () {
  tarifasMP.forEach(function (tariff, index) {
    var plan = standardPlan(tariff, tariff.numero_pagos === 1 ? tariff.valor_total_oficial_cop : tariff.cuota_inicial_minima_cop);
    assert(plan.valid, "Plan MP inválido en índice " + index + ": " + plan.errors.join(" "));
    equal(plan.rows.length, tariff.numero_pagos, "Número de pagos MP en índice " + index);
    equal(plan.sumPaymentsCop, tariff.valor_total_oficial_cop, "Total MP en índice " + index);
    equal(plan.differenceCop, 0, "Diferencia MP en índice " + index);
    equal(plan.rows[plan.rows.length - 1].balanceAfterCop, 0, "Saldo MP en índice " + index);
  });
});

test("rutas por etapas tienen 15 trayectorias inglesas y 10 francesas sin totales informativos", function () {
  var etapas = tarifasMP.filter(function (item) { return item.modelo_tarifario_id === "MODELO_MP_NIVEL_A_NIVEL"; });
  equal(new Set(etapas.filter(function (item) { return item.idioma_id === "INGLES"; }).map(function (item) { return item.plan_id; })).size, 15);
  equal(new Set(etapas.filter(function (item) { return item.idioma_id === "FRANCES"; }).map(function (item) { return item.plan_id; })).size, 10);
  assert(etapas.every(function (item) {
    return !/TOTAL\s+(CONTADO|FINANCIADO)/i.test(item.nombre_plan_original);
  }));
});

test("cantidades obligatorias por idioma y zona", function () {
  var counts = tarifas.reduce(function (result, item) {
    var key = item.idioma_id + "|" + item.zona_id;
    result[key] = (result[key] || 0) + 1;
    return result;
  }, {});
  deepEqual(counts, {
    "INGLES|REGIONALES": 245,
    "INGLES|CUND_ANT": 245,
    "FRANCES|REGIONALES": 130,
    "FRANCES|CUND_ANT": 130
  });
});

test("15 planes de Inglés, 10 de Francés y cinco condiciones", function () {
  equal(new Set(tarifas.filter(function (item) { return item.idioma_id === "INGLES"; }).map(function (item) { return item.plan_id; })).size, 15);
  equal(new Set(tarifas.filter(function (item) { return item.idioma_id === "FRANCES"; }).map(function (item) { return item.plan_id; })).size, 10);
  deepEqual(Array.from(new Set(tarifas.map(function (item) { return item.condicion_id; }))), [
    "PRECIO_AL_PUBLICO", "ALIANZA_MASIVA", "ALIANZA_EMPRESARIAL", "PREVENTA_ESPECIAL", "COLABORADOR"
  ]);
});

test("todos los registros tienen la estructura normalizada completa", function () {
  tarifas.forEach(function (item, index) {
    requiredFields.forEach(function (field) {
      assert(Object.prototype.hasOwnProperty.call(item, field), "Falta " + field + " en índice " + index);
    });
  });
});

test("se usan exclusivamente las cuatro matrices autorizadas", function () {
  var sources = Array.from(new Set(tarifas.map(function (item) {
    return item.archivo_origen + "|" + item.hoja_origen;
  })));
  deepEqual(sources, [
    "Tarifas Regionales - 2026 V3.xlsx|Tarifas Ing Regionales",
    "Tarifas Cundinamarca y Antioquia - 2026 V3.xlsx|Tarifas Ing Cund y Ant",
    "Tarifas Regionales - 2026 V3.xlsx|Tarifas Fran Regionales",
    "Tarifas Cundinamarca y Antioquia - 2026 V3.xlsx|Tarifas Fran Cund y Ant"
  ]);
});

test("los únicos números de pagos son alternativas oficiales", function () {
  var options = Array.from(new Set(tarifas.map(function (item) { return item.numero_pagos; }))).sort(function (a, b) { return a - b; });
  deepEqual(options, [1, 2, 3, 4, 5, 6, 12, 14, 18, 20, 24, 26]);
  [1, 6, 14, 20, 26].forEach(function (number) {
    assert(options.indexOf(number) >= 0, "No aparece la opción confirmada " + number);
  });
});

test("cada combinación zona-plan-condición conserva solo sus pagos oficiales", function () {
  var expectedEnglish = {
    1: [1, 6],
    2: [1, 2, 14],
    3: [1, 3, 12, 20],
    4: [1, 4, 12, 18, 24],
    5: [1, 5, 12, 18, 26]
  };
  var expectedFrench = {
    1: [1, 6],
    2: [1, 2, 14],
    3: [1, 3, 20],
    4: [1, 4, 24]
  };
  var groups = new Map();
  tarifas.forEach(function (item) {
    var key = [item.idioma_id, item.zona_id, item.plan_id, item.condicion_id].join("|");
    if (!groups.has(key)) {
      groups.set(key, { language: item.idioma_id, levels: item.numero_niveles, payments: [] });
    }
    groups.get(key).payments.push(item.numero_pagos);
  });
  equal(groups.size, 250);
  groups.forEach(function (group, key) {
    var expected = group.language === "FRANCES" ? expectedFrench : expectedEnglish;
    deepEqual(group.payments, expected[group.levels], "Pagos incorrectos en " + key);
  });
});

test("catálogo controlado contiene exactamente 56 sedes válidas con Cajicá", function () {
  assert(validacionSedes.valida, (validacionSedes.errores || []).join(" "));
  deepEqual(validacionSedes.resumen, {
    total: 56,
    activas: 56,
    cundAnt: 45,
    regionales: 11,
    ingles: 56,
    frances: 23
  });
  equal(new Set(sedes.map(function (site) { return site.sede_id; })).size, 56);
  equal(new Set(sedes.map(function (site) { return site.nombre_normalizado; })).size, 56);
  var cajica = sedes.find(function (site) { return site.sede_id === "CUND_CAJICA"; });
  assert(cajica && cajica.nombre_sede === "Cajicá");
  equal(cajica.zona_tarifaria, "CUND_ANT");
  assert(cajica.sede_activa && cajica.ingles_habilitado && cajica.frances_habilitado);
  equal(sedes.filter(function (site) { return site.nombre_normalizado === "cajica"; }).length, 1);
});

test("configuración central contiene los cuatro valores comerciales definitivos", function () {
  assert(validacionAdicionales.valida, (validacionAdicionales.errores || []).join(" "));
  equal(adicionales.length, 4);
  equal(validacionAdicionales.resumen.preciosConfigurados, 4);
  deepEqual(validacionAdicionales.alertas, []);
  deepEqual(adicionales.map(function (item) { return item.adicional_id; }), [
    "MATERIAL_ACADEMICO_POR_NIVEL",
    "LINGUASKILL_CUATRO_HABILIDADES",
    "CLUBES_CONVERSACION_ILIMITADOS",
    "CURSO_CORTO"
  ]);
  var material = adicionales[0];
  var linguaskill = adicionales[1];
  var clubs = adicionales[2];
  var course = adicionales[3];
  equal(material.tipo_precio, "PRECIO_POR_NIVEL");
  equal(material.precio_por_nivel_cop, 243000);
  equal(material.unidad_precio, "NIVEL");
  equal(linguaskill.tipo_precio, "PRECIO_FIJO");
  equal(linguaskill.precio_publico_cop, 480000);
  equal(clubs.tipo_precio, "VALOR_EQUIVALENTE_CLASE");
  equal(clubs.duracion_clase_minutos, 90);
  equal(clubs.duracion_clase_horas, 1.5);
  equal(course.tipo_precio, "PRECIO_FIJO");
  equal(course.precio_publico_cop, 999000);
  equal(course.titulo_cliente, "Curso corto de Inglés de Negocios");
  equal(course.requiere_opcion, false);
  deepEqual(course.opciones_autorizadas, []);
});

test("campaña inicial está activa, sincronizada y dura 48 horas", function () {
  assert(validacionCampanas.valida, (validacionCampanas.errores || []).join(" "));
  equal(campanasAdicionales.length, 1);
  var campaign = campanasAdicionales[0];
  assert(campaign.activa);
  equal(campaign.vigencia_bonificacion_horas, 48);
  equal(campaign.sincronizar_con_vigencia_cotizacion, true);
  deepEqual(campaign.seleccionados_por_defecto, []);
  assert(core.campaignApplies(campaign, additionalContext(), "2026-07-17T12:00:00.000Z"));
});

test("aplicabilidad respeta idioma, plan, forma de pago y opciones autorizadas", function () {
  var campaign = campanasAdicionales[0];
  var material = adicionales.find(function (item) { return item.adicional_id === "MATERIAL_ACADEMICO_POR_NIVEL"; });
  var linguaskill = adicionales.find(function (item) { return item.adicional_id === "LINGUASKILL_CUATRO_HABILIDADES"; });
  var course = adicionales.find(function (item) { return item.adicional_id === "CURSO_CORTO"; });
  assert(core.additionalIsApplicable(material, campaign, additionalContext(), "2026-07-17T12:00:00.000Z"));
  assert(core.additionalIsApplicable(linguaskill, campaign, additionalContext({ paymentCount: 1 }), "2026-07-17T12:00:00.000Z"));
  assert(!core.additionalIsApplicable(linguaskill, campaign, additionalContext({ languageId: "FRANCES", planId: "FRA_INST_A1" }), "2026-07-17T12:00:00.000Z"));
  assert(core.additionalIsApplicable(course, campaign, additionalContext(), "2026-07-17T12:00:00.000Z"));
});

test("material académico calcula exactamente uno, tres y cinco niveles a $243.000", function () {
  var material = adicionales[0];
  equal(core.calculateAdditionalCommercialValue(material, additionalContext({ numberOfLevels: 1 })).valueCop, 243000);
  equal(core.calculateAdditionalCommercialValue(material, additionalContext({ numberOfLevels: 3 })).valueCop, 729000);
  equal(core.calculateAdditionalCommercialValue(material, additionalContext({ numberOfLevels: 5 })).valueCop, 1215000);
});

test("Linguaskill y curso corto conservan sus precios fijos autorizados", function () {
  equal(core.calculateAdditionalCommercialValue(adicionales[1], additionalContext()).valueCop, 480000);
  equal(core.calculateAdditionalCommercialValue(adicionales[3], additionalContext()).valueCop, 999000);
});

test("opciones futuras de curso corto heredan o sustituyen solo precios configurados", function () {
  var generic = adicionales[3];
  var configured = Object.assign({}, generic, {
    requiere_opcion: true,
    opciones_autorizadas: [
      { opcion_id: "HEREDA", nombre_cliente: "Curso base", activa: true, precio_publico_cop: null, idiomas_aplicables: ["*"], sedes_aplicables: ["*"] },
      { opcion_id: "ESPECIAL", nombre_cliente: "Curso especial", activa: true, precio_publico_cop: 950000, idiomas_aplicables: ["*"], sedes_aplicables: ["*"] }
    ]
  });
  equal(core.calculateAdditionalCommercialValue(configured, additionalContext(), "HEREDA").valueCop, 999000);
  equal(core.calculateAdditionalCommercialValue(configured, additionalContext(), "ESPECIAL").valueCop, 950000);
});

test("clubes equivalen a 90 minutos del valor por hora de lista con redondeo exacto", function () {
  var clubs = adicionales[2];
  var value = core.calculateAdditionalCommercialValue(clubs, additionalContext({
    fullListCop: 2425000,
    academicHours: 162
  }));
  assert(value.configured);
  equal(value.valueCop, 22454);
  equal(value.quantity, 1);
  equal(value.valueLabel, "Valor equivalente a una clase");
});

test("clubes aplica medio peso hacia arriba sin coma flotante monetaria", function () {
  var clubs = adicionales[2];
  var value = core.calculateAdditionalCommercialValue(clubs, additionalContext({
    fullListCop: 3,
    academicHours: 9
  }));
  equal(value.valueCop, 1);
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  assert(/classValueNumerator = context\.fullListCop \* additional\.duracion_clase_minutos/.test(app));
  assert(/roundDivideCOP\(classValueNumerator, classValueDenominator\)/.test(app));
  assert(!/context\.fullListCop\s*\/\s*context\.academicHours\s*\*\s*1\.5/.test(app));
});

test("clubes no cambia entre condiciones con igual valor full y horas", function () {
  var publicTariff = findTariff(["REGIONALES", "ING_INST_A1", "PRECIO_AL_PUBLICO", 6]);
  var collaboratorTariff = findTariff(["REGIONALES", "ING_INST_A1", "COLABORADOR", 6]);
  equal(publicTariff.valor_full_oficial_cop, collaboratorTariff.valor_full_oficial_cop);
  equal(publicTariff.horas_academicas, collaboratorTariff.horas_academicas);
  var clubs = adicionales[2];
  var publicValue = core.calculateAdditionalCommercialValue(clubs, additionalContext({
    conditionId: publicTariff.condicion_id,
    fullListCop: publicTariff.valor_full_oficial_cop,
    academicHours: publicTariff.horas_academicas
  })).valueCop;
  var collaboratorValue = core.calculateAdditionalCommercialValue(clubs, additionalContext({
    conditionId: collaboratorTariff.condicion_id,
    fullListCop: collaboratorTariff.valor_full_oficial_cop,
    academicHours: collaboratorTariff.horas_academicas
  })).valueCop;
  equal(publicValue, collaboratorValue);
  equal(publicValue, 22454);
});

test("la suma comercial incluye exclusivamente los adicionales seleccionados", function () {
  var context = additionalContext({ numberOfLevels: 3 });
  var material = core.calculateAdditionalCommercialValue(adicionales[0], context);
  var linguaskill = core.calculateAdditionalCommercialValue(adicionales[1], context);
  var clubs = core.calculateAdditionalCommercialValue(adicionales[2], context);
  var course = core.calculateAdditionalCommercialValue(adicionales[3], context);
  equal(core.sumAdditionalCommercialValues([material, clubs]), 751454);
  equal(core.sumAdditionalCommercialValues([material, linguaskill, clubs, course]), 2230454);
  equal(core.sumAdditionalCommercialValues([]), 0);
});

test("paquete completo puede reunir cuatro adicionales cuando todos están autorizados", function () {
  var campaign = campanasAdicionales[0];
  var context = additionalContext();
  var applicable = adicionales.filter(function (item) {
    return core.additionalIsApplicable(item, campaign, context, "2026-07-17T12:00:00.000Z");
  });
  equal(applicable.length, 4);
  equal(new Set().size, 0);
  equal(new Set([applicable[0].adicional_id]).size, 1);
  equal(new Set(applicable.map(function (item) { return item.adicional_id; })).size, 4);
});

test("seleccionar adicionales no interviene en el cálculo contractual", function () {
  var tariff = findTariff(["CUND_ANT", "ING_INST_A1_A2", "ALIANZA_EMPRESARIAL", 14]);
  var baseline = standardPlan(tariff, tariff.cuota_inicial_minima_cop);
  var configuredAdditional = Object.assign({}, adicionales[0], { precio_por_nivel_cop: 99999 });
  var commercialValue = core.calculateAdditionalCommercialValue(configuredAdditional, additionalContext({ numberOfLevels: 2 })).valueCop;
  var afterSelection = standardPlan(tariff, tariff.cuota_inicial_minima_cop);
  assert(commercialValue > 0);
  equal(afterSelection.sumPaymentsCop, baseline.sumPaymentsCop);
  equal(afterSelection.regularMonthlyCop, baseline.regularMonthlyCop);
  equal(afterSelection.lastMonthlyCop, baseline.lastMonthlyCop);
  equal(afterSelection.differenceCop, 0);
});

test("todos los estados comerciales de adicionales están implementados", function () {
  equal(core.resolveAdditionalStatus({ active: false }), "INACTIVO");
  equal(core.resolveAdditionalStatus({ active: true, applicable: false }), "NO_APLICA");
  equal(core.resolveAdditionalStatus({ active: true, applicable: true, withCost: true }), "ADICIONAL_CON_COSTO");
  equal(core.resolveAdditionalStatus({ active: true, applicable: true, selected: false }), "NO_SELECCIONADO");
  equal(core.resolveAdditionalStatus({ active: true, applicable: true, selected: true, quoteStatus: "VIGENTE", deadline: "2026-07-19T12:00:00.000Z", now: "2026-07-18T12:00:00.000Z" }), "BONIFICADO_PROMOCION_VIGENTE");
  equal(core.resolveAdditionalStatus({ active: true, applicable: true, selected: true, authorized: true, quoteStatus: "VIGENTE", deadline: "2026-07-19T12:00:00.000Z", now: "2026-07-18T12:00:00.000Z" }), "BONIFICADO_POR_AUTORIZACION");
  equal(core.resolveAdditionalStatus({ active: true, applicable: true, selected: true, quoteStatus: "VENCIDA", deadline: "2026-07-18T12:00:00.000Z", now: "2026-07-18T12:00:00.000Z" }), "BONIFICACION_VENCIDA");
});

test("vigencia bonificada se sincroniza o calcula campañas futuras de 24 horas", function () {
  var generated = "2026-07-17T12:00:00.000Z";
  var quoteExpiry = "2026-07-19T12:00:00.000Z";
  equal(core.calculateBonusDeadline(campanasAdicionales[0], generated, quoteExpiry), quoteExpiry);
  var campaign24 = Object.assign({}, campanasAdicionales[0], {
    sincronizar_con_vigencia_cotizacion: false,
    vigencia_bonificacion_horas: 24
  });
  equal(core.calculateBonusDeadline(campaign24, generated, quoteExpiry), "2026-07-18T12:00:00.000Z");
});

test("autorización excepcional exige datos completos, adicional aplicable y fecha futura", function () {
  var valid = {
    authorizerName: "Dirección Comercial",
    authorizerRole: "Directora",
    reason: "Caso validado",
    authorizationReference: "AUT-001",
    additionalIds: ["MATERIAL_ACADEMICO_POR_NIVEL"],
    newDeadline: "2026-07-20T12:00:00.000Z"
  };
  assert(core.validateExceptionalAuthorization(valid, ["MATERIAL_ACADEMICO_POR_NIVEL"], "2026-07-17T12:00:00.000Z").valid);
  assert(!core.validateExceptionalAuthorization({}, [], "2026-07-17T12:00:00.000Z").valid);
  assert(!core.validateExceptionalAuthorization(Object.assign({}, valid, { newDeadline: "2026-07-16T12:00:00.000Z" }), ["MATERIAL_ACADEMICO_POR_NIVEL"], "2026-07-17T12:00:00.000Z").valid);
  assert(!core.validateExceptionalAuthorization(Object.assign({}, valid, { additionalIds: ["LINGUASKILL_CUATRO_HABILIDADES"] }), ["MATERIAL_ACADEMICO_POR_NIVEL"], "2026-07-17T12:00:00.000Z").valid);
});

test("IDs y nombres sensibles no colisionan", function () {
  [
    ["CUND_SANTAFE", "Santafé"],
    ["ANT_SANTAFE_MEDELLIN", "Santafé Medellín"],
    ["CUND_UNICENTRO_OCCIDENTE_A", "Unicentro de Occidente A"],
    ["CUND_UNICENTRO_OCCIDENTE_B", "Unicentro de Occidente B"]
  ].forEach(function (expected) {
    var site = sedes.find(function (item) { return item.sede_id === expected[0]; });
    assert(site, "Falta " + expected[0]);
    equal(site.nombre_sede, expected[1]);
  });
});

test("alias históricos resuelven a nombres oficiales sin ambigüedad", function () {
  var aliasMap = {};
  sedes.forEach(function (site) {
    site.alias.forEach(function (alias) {
      var normalized = global.SMART_NORMALIZAR_SEDE(alias);
      assert(!aliasMap[normalized], "Alias duplicado " + alias);
      aliasMap[normalized] = site.nombre_sede;
    });
  });
  equal(aliasMap[global.SMART_NORMALIZAR_SEDE("Modelia B")], "Modelia");
  equal(aliasMap[global.SMART_NORMALIZAR_SEDE("Tierragro Bello")], "Tierragro");
  equal(aliasMap[global.SMART_NORMALIZAR_SEDE("Plaza de las Américas")], "Plaza Américas");
});

test("la sede asigna automáticamente la zona correcta", function () {
  equal(core.resolveCommercialContext("INGLES", "CUND_BOSA", sedes).zone, "CUND_ANT");
  equal(core.resolveCommercialContext("INGLES", "CUND_CAJICA", sedes).zone, "CUND_ANT");
  equal(core.resolveCommercialContext("INGLES", "ANT_ENVIGADO", sedes).zone, "CUND_ANT");
  equal(core.resolveCommercialContext("INGLES", "REG_CALI", sedes).zone, "REGIONALES");
});

test("Inglés está disponible en las 56 sedes activas", function () {
  sedes.forEach(function (site) {
    assert(core.resolveCommercialContext("INGLES", site.sede_id, sedes).valid, site.nombre_sede);
  });
});

test("Francés aplica exclusivamente la disponibilidad de 23 sedes", function () {
  ["CUND_UNICENTRO_OCCIDENTE_B", "CUND_MODELIA", "CUND_CAJICA", "ANT_TIERRAGRO", "REG_CABECERA"].forEach(function (id) {
    assert(core.resolveCommercialContext("FRANCES", id, sedes).valid, "Debe permitir " + id);
  });
  ["CUND_UNICENTRO_OCCIDENTE_A", "CUND_BOSA"].forEach(function (id) {
    var context = core.resolveCommercialContext("FRANCES", id, sedes);
    assert(!context.valid, "Debe bloquear " + id);
    equal(context.error, core.FRENCH_UNAVAILABLE_MESSAGE);
  });
  assert(core.resolveCommercialContext("INGLES", "CUND_UNICENTRO_OCCIDENTE_A", sedes).valid);
});

test("Cajicá reutiliza tarifas CUND_ANT y los dos modelos MP nacionales", function () {
  var contextEnglish = core.resolveCommercialContext("INGLES", "CUND_CAJICA", sedes);
  var contextFrench = core.resolveCommercialContext("FRANCES", "CUND_CAJICA", sedes);
  assert(contextEnglish.valid && contextFrench.valid);
  equal(contextEnglish.zone, "CUND_ANT");
  equal(contextFrench.zone, "CUND_ANT");
  assert(tarifas.some(function (item) { return item.idioma_id === "INGLES" && item.zona_id === "CUND_ANT"; }));
  var frenchCundAnt = tarifas.filter(function (item) { return item.idioma_id === "FRANCES" && item.zona_id === "CUND_ANT"; });
  assert(frenchCundAnt.length > 0);
  assert(frenchCundAnt.every(function (item) { return item.niveles_incluidos.indexOf("C1") < 0; }));
  ["MODELO_MP_PAQUETES", "MODELO_MP_NIVEL_A_NIVEL"].forEach(function (modelId) {
    var records = tarifasMP.filter(function (item) { return item.modelo_tarifario_id === modelId; });
    assert(records.length > 0 && records.every(function (item) { return item.aplicacion_nacional && item.zona_id === "NACIONAL"; }));
  });
  var cash = findTariff(["CUND_ANT", "FRA_INST_A1", "PRECIO_AL_PUBLICO", 1]);
  var financed = findTariff(["CUND_ANT", "FRA_INST_A1", "PRECIO_AL_PUBLICO", 6]);
  assert(standardPlan(cash, cash.valor_total_oficial_cop).valid);
  assert(standardPlan(financed, financed.cuota_inicial_minima_cop).valid);
  equal(sedes.filter(function (site) { return !site.frances_habilitado; }).length, 33);
  equal(tarifas.length, 750);
  equal(tarifasMP.length, 452);
});

test("las 750 claves únicas incluyen idioma", function () {
  var keys = tarifas.map(function (item) {
    return [item.idioma_id, item.zona_id, item.plan_id, item.condicion_id, item.numero_pagos].join("|");
  });
  equal(new Set(keys).size, 750);
});

test("Francés integra 10 planes hasta B2 y nunca muestra C1", function () {
  var french = tarifas.filter(function (item) { return item.idioma_id === "FRANCES"; });
  equal(new Set(french.map(function (item) { return item.plan_id; })).size, 10);
  assert(french.every(function (item) { return item.niveles_incluidos.indexOf("C1") < 0; }));
});

test("todos los valores operativos monetarios son enteros COP seguros", function () {
  var integerFields = [
    "valor_full_oficial_cop", "cuota_inicial_minima_cop", "cuota_mensual_referencia_cop",
    "valor_total_oficial_cop", "valor_por_hora_mostrado_cop"
  ];
  tarifas.forEach(function (item) {
    integerFields.forEach(function (field) {
      assert(Number.isSafeInteger(item[field]), field + " no es entero en " + item.zona_id + " / fila " + item.fila_origen);
    });
  });
});

test("auditoría de totales decimales coincide con el inventario aprobado", function () {
  function classify(language, zone) {
    var result = { nonInteger: 0, halfPeso: 0, artifact: 0 };
    tarifas.filter(function (item) { return item.idioma_id === language && item.zona_id === zone; }).forEach(function (item) {
      var raw = item.valor_total_raw_excel;
      var value = Number(raw);
      if (!Number.isInteger(value)) {
        result.nonInteger += 1;
        var distance = Math.abs(value - Math.round(value));
        if (Math.abs(distance - 0.5) < 1e-9) {
          result.halfPeso += 1;
        } else if (distance < 1e-6) {
          result.artifact += 1;
        }
      }
    });
    return result;
  }
  deepEqual(classify("INGLES", "REGIONALES"), { nonInteger: 43, halfPeso: 32, artifact: 11 });
  deepEqual(classify("INGLES", "CUND_ANT"), { nonInteger: 33, halfPeso: 22, artifact: 11 });
});

test("medios pesos suben y artefactos cercanos vuelven al entero visual", function () {
  var half = tarifas.find(function (item) { return /\.5$/.test(item.valor_total_raw_excel); });
  var artifact = tarifas.find(function (item) {
    var value = Number(item.valor_total_raw_excel);
    return !Number.isInteger(value) && Math.abs(value - Math.round(value)) < 1e-6;
  });
  assert(half, "No se encontró medio peso");
  assert(artifact, "No se encontró artefacto");
  equal(half.valor_total_oficial_cop, Math.floor(Number(half.valor_total_raw_excel)) + 1);
  equal(artifact.valor_total_oficial_cop, Math.round(Number(artifact.valor_total_raw_excel)));
});

test("porcentajes exactos mantienen dos o más decimales visibles", function () {
  equal(core.formatPercentExact("0.1925"), "19,25 %");
  equal(core.formatPercentExact("0.4965"), "49,65 %");
  equal(core.formatPercentExact("0.536"), "53,60 %");
  equal(core.formatPercentExact("0.2"), "20,00 %");
});

test("pago de contado genera una sola fila y ningún saldo", function () {
  var tariff = findTariff(["REGIONALES", "ING_INST_A1", "PRECIO_AL_PUBLICO", 1]);
  var plan = standardPlan(tariff, tariff.valor_total_oficial_cop);
  assert(plan.valid);
  equal(plan.rows.length, 1);
  equal(plan.rows[0].concept, "Pago único");
  equal(plan.rows[0].dueDate, "2026-01-01");
  equal(plan.rows[0].valueCop, tariff.valor_total_oficial_cop);
  equal(plan.rows[0].balanceAfterCop, 0);
  equal(plan.pendingBalanceCop, 0);
  equal(plan.remainingPayments, 0);
});

test("plan decimal concilia y ajusta la última cuota", function () {
  var tariff = findTariff(["REGIONALES", "ING_INST_A1", "ALIANZA_MASIVA", 6]);
  var plan = standardPlan(tariff, tariff.cuota_inicial_minima_cop);
  assert(plan.valid);
  equal(tariff.valor_total_raw_excel, "2188562.5");
  equal(tariff.valor_total_oficial_cop, 2188563);
  equal(plan.initialCop, 364760);
  equal(plan.regularMonthlyCop, 364761);
  equal(plan.lastMonthlyCop, 364759);
  equal(plan.sumPaymentsCop, 2188563);
  equal(plan.differenceCop, 0);
});

test("una cuota inicial mayor reduce el saldo y conserva el total", function () {
  var tariff = findTariff(["CUND_ANT", "ING_INST_A1_A2_B1", "COLABORADOR", 20]);
  var baseline = standardPlan(tariff, tariff.cuota_inicial_minima_cop);
  var increased = standardPlan(tariff, tariff.cuota_inicial_minima_cop + 500000);
  assert(baseline.valid && increased.valid);
  equal(increased.additionalInitialCop, 500000);
  equal(increased.pendingBalanceCop, baseline.pendingBalanceCop - 500000);
  assert(increased.regularMonthlyCop < baseline.regularMonthlyCop);
  equal(increased.sumPaymentsCop, tariff.valor_total_oficial_cop);
});

test("rechaza cuota inicial inferior, superior y no entera", function () {
  var tariff = findTariff(["CUND_ANT", "ING_INST_A1_A2", "PRECIO_AL_PUBLICO", 14]);
  assert(!standardPlan(tariff, tariff.cuota_inicial_minima_cop - 1).valid);
  assert(!standardPlan(tariff, tariff.valor_total_oficial_cop + 1).valid);
  assert(!standardPlan(tariff, tariff.cuota_inicial_minima_cop + 0.5).valid);
});

test("la última cuota absorbe diferencias positivas y negativas", function () {
  var base = { numero_pagos: 7, cuota_inicial_minima_cop: 100, valor_total_oficial_cop: 1001 };
  var positive = standardPlan(base, 100);
  var negative = standardPlan(Object.assign({}, base, { valor_total_oficial_cop: 1004 }), 100);
  assert(positive.valid && negative.valid);
  equal(positive.regularMonthlyCop, 150);
  equal(positive.lastMonthlyCop, 151);
  equal(negative.regularMonthlyCop, 151);
  equal(negative.lastMonthlyCop, 149);
  equal(positive.differenceCop, 0);
  equal(negative.differenceCop, 0);
});

test("las 750 tarifas producen calendarios exactos con la cuota mínima", function () {
  tarifas.forEach(function (tariff) {
    var plan = standardPlan(tariff, tariff.numero_pagos === 1 ? tariff.valor_total_oficial_cop : tariff.cuota_inicial_minima_cop);
    assert(plan.valid, "Plan inválido: " + [tariff.zona_id, tariff.plan_id, tariff.condicion_id, tariff.numero_pagos].join("|"));
    equal(plan.rows.length, tariff.numero_pagos);
    equal(plan.sumPaymentsCop, tariff.valor_total_oficial_cop);
    equal(plan.differenceCop, 0);
    equal(plan.rows[plan.rows.length - 1].balanceAfterCop, 0);
    plan.rows.forEach(function (row) {
      assert(Number.isSafeInteger(row.valueCop));
      assert(Number.isSafeInteger(row.balanceAfterCop));
      assert(row.valueCop >= 0 && row.balanceAfterCop >= 0);
    });
  });
});

test("Francés concilia contado, 6, 14, 20 y 24 pagos", function () {
  [
    ["FRA_INST_A1", 1],
    ["FRA_INST_A1", 6],
    ["FRA_INST_A1_A2", 14],
    ["FRA_INST_A1_A2_B1", 20],
    ["FRA_INST_A1_A2_B1_B2", 24]
  ].forEach(function (choice) {
    var tariff = findTariff(["REGIONALES", choice[0], "PRECIO_AL_PUBLICO", choice[1]], "FRANCES");
    assert(tariff, "Falta tarifa francesa " + choice.join(" / "));
    var initial = tariff.numero_pagos === 1 ? tariff.valor_total_oficial_cop : tariff.cuota_inicial_minima_cop;
    var plan = standardPlan(tariff, initial);
    assert(plan.valid, "Plan francés inválido " + choice.join(" / "));
    equal(plan.rows.length, choice[1]);
    equal(plan.rows[plan.rows.length - 1].balanceAfterCop, 0);
    equal(plan.sumPaymentsCop, tariff.valor_total_oficial_cop);
    equal(plan.differenceCop, 0);
  });
});

test("Francés acepta cuota inicial superior y ajusta la última cuota", function () {
  var tariff = findTariff(["CUND_ANT", "FRA_INST_A1_A2_B1_B2", "ALIANZA_EMPRESARIAL", 24], "FRANCES");
  var baseline = standardPlan(tariff, tariff.cuota_inicial_minima_cop);
  var increased = standardPlan(tariff, tariff.cuota_inicial_minima_cop + 321987);
  assert(baseline.valid && increased.valid);
  equal(increased.additionalInitialCop, 321987);
  assert(increased.regularMonthlyCop < baseline.regularMonthlyCop);
  equal(increased.rows.length, 24);
  equal(increased.rows[increased.rows.length - 1].balanceAfterCop, 0);
  equal(increased.differenceCop, 0);
});

test("límites de primera mensualidad: 30 y 40 sí; 29 y 41 no", function () {
  equal(core.daysBetweenISO("2026-01-01", core.addDaysISO("2026-01-01", 30)), 30);
  assert(core.validateFirstMonthlyDate("2026-01-01", "2026-01-31"));
  assert(core.validateFirstMonthlyDate("2026-01-01", "2026-02-10"));
  assert(!core.validateFirstMonthlyDate("2026-01-01", "2026-01-30"));
  assert(!core.validateFirstMonthlyDate("2026-01-01", "2026-02-11"));
});

test("el calendario financiado usa la acreditación y no la matrícula como fecha base", function () {
  var tariff = findTariff(["REGIONALES", "ING_INST_A1", "PRECIO_AL_PUBLICO", 6]);
  var day30 = core.buildPaymentPlan(tariff, {
    initialCop: tariff.cuota_inicial_minima_cop,
    enrollmentDate: "2026-01-01",
    accreditationDate: "2026-01-10",
    firstMonthlyDate: "2026-02-09"
  });
  assert(day30.valid, (day30.errors || []).join(" "));
  equal(day30.rows[0].dueDate, "2026-01-10");
  equal(day30.rows[1].dueDate, "2026-02-09");
  var day40 = core.buildPaymentPlan(tariff, {
    initialCop: tariff.cuota_inicial_minima_cop,
    enrollmentDate: "2026-01-01",
    accreditationDate: "2026-01-10",
    firstMonthlyDate: "2026-02-19"
  });
  assert(day40.valid);
  assert(!core.buildPaymentPlan(tariff, {
    initialCop: tariff.cuota_inicial_minima_cop,
    enrollmentDate: "2026-01-01",
    accreditationDate: "2026-01-10",
    firstMonthlyDate: "2026-02-08"
  }).valid);
  assert(!core.buildPaymentPlan(tariff, {
    initialCop: tariff.cuota_inicial_minima_cop,
    enrollmentDate: "2026-01-01",
    accreditationDate: "2026-01-10",
    firstMonthlyDate: "2026-02-20"
  }).valid);
});

test("pago de contado muestra una sola fila en la fecha estimada de confirmación", function () {
  var tariff = findTariff(["REGIONALES", "ING_INST_A1", "PRECIO_AL_PUBLICO", 1]);
  var plan = core.buildPaymentPlan(tariff, {
    initialCop: tariff.valor_total_oficial_cop,
    enrollmentDate: "2026-01-01",
    accreditationDate: "2026-01-05",
    firstMonthlyDate: ""
  });
  assert(plan.valid);
  equal(plan.rows.length, 1);
  equal(plan.rows[0].dueDate, "2026-01-05");
  equal(plan.rows[0].valueCop, tariff.valor_total_oficial_cop);
  equal(plan.pendingBalanceCop, 0);
  equal(plan.differenceCop, 0);
});

test("anclas 28, 29, 30 y 31 retoman el día original", function () {
  deepEqual([0, 1, 2].map(function (offset) { return core.addMonthsAnchored("2026-01-28", offset); }), ["2026-01-28", "2026-02-28", "2026-03-28"]);
  deepEqual([0, 1, 2].map(function (offset) { return core.addMonthsAnchored("2026-01-29", offset); }), ["2026-01-29", "2026-02-28", "2026-03-29"]);
  deepEqual([0, 1, 2].map(function (offset) { return core.addMonthsAnchored("2026-01-30", offset); }), ["2026-01-30", "2026-02-28", "2026-03-30"]);
  deepEqual([0, 1, 2, 3].map(function (offset) { return core.addMonthsAnchored("2026-01-31", offset); }), ["2026-01-31", "2026-02-28", "2026-03-31", "2026-04-30"]);
});

test("año bisiesto y cambio de año conservan la regla mensual", function () {
  deepEqual([0, 1, 2].map(function (offset) { return core.addMonthsAnchored("2028-01-31", offset); }), ["2028-01-31", "2028-02-29", "2028-03-31"]);
  deepEqual([0, 1, 2].map(function (offset) { return core.addMonthsAnchored("2026-12-31", offset); }), ["2026-12-31", "2027-01-31", "2027-02-28"]);
});

test("vigencia exacta de 48 horas y estado modificada", function () {
  var generated = "2026-07-16T20:00:00.000Z";
  var expires = "2026-07-18T20:00:00.000Z";
  equal(core.quoteStatus(null, null, false, generated), "BORRADOR");
  equal(core.quoteStatus(generated, expires, false, "2026-07-18T19:59:59.999Z"), "VIGENTE");
  equal(core.quoteStatus(generated, expires, false, expires), "VENCIDA");
  equal(core.quoteStatus(generated, expires, false, "2026-07-19T00:00:00.000Z"), "VENCIDA");
  equal(core.quoteStatus(generated, expires, true, generated), "MODIFICADA");
});

test("la referencia usa fecha y hora de Bogotá", function () {
  var reference = core.createQuoteReference(new Date("2026-07-16T22:30:00.000Z"));
  assert(/^SMART-20260716-1730-[0-9A-F]{4}$/.test(reference), reference);
});

var expectedTariffs = [
  { key: ["REGIONALES", "ING_INST_A1", "PRECIO_AL_PUBLICO", 1], discount: "0.2", fullRaw: "2425000", full: 2425000, initialRaw: "1940000", initial: 1940000, refRaw: "0", ref: 0, totalRaw: "1940000", total: 1940000, hourRaw: "11975.308641975309", hour: 11975, intensityRaw: "162", intensity: 162, row: 5 },
  { key: ["CUND_ANT", "ING_INST_A2", "ALIANZA_MASIVA", 6], discount: "0.05", fullRaw: "2425000", full: 2425000, initialRaw: "383958.33333333331", initial: 383958, refRaw: "383958.33333333337", ref: 383958, totalRaw: "2303750", total: 2303750, hourRaw: "14220.679012345679", hour: 14221, intensityRaw: "27", intensity: 27, row: 8 },
  { key: ["REGIONALES", "ING_INST_B1", "ALIANZA_EMPRESARIAL", 6], discount: "0.145", fullRaw: "2669000", full: 2669000, initialRaw: "380332.5", initial: 380333, refRaw: "380332.5", ref: 380333, totalRaw: "2281995", total: 2281995, hourRaw: "12820.196629213484", hour: 12820, intensityRaw: "27", intensity: 27, row: 10 },
  { key: ["CUND_ANT", "ING_INST_B2", "PREVENTA_ESPECIAL", 1], discount: "0.2775", fullRaw: "3032000", full: 3032000, initialRaw: "2190620", initial: 2190620, refRaw: "0", ref: 0, totalRaw: "2190620", total: 2190620, hourRaw: "10844.653465346535", hour: 10845, intensityRaw: "202", intensity: 202, row: 11 },
  { key: ["REGIONALES", "ING_INST_C1", "COLABORADOR", 6], discount: "0.24", fullRaw: "3032000", full: 3032000, initialRaw: "384053.33333333331", initial: 384053, refRaw: "384053.33333333337", ref: 384053, totalRaw: "2304320", total: 2304320, hourRaw: "11407.524752475247", hour: 11408, intensityRaw: "27", intensity: 27, row: 14 },
  { key: ["CUND_ANT", "ING_INST_A1_A2", "PRECIO_AL_PUBLICO", 14], discount: "0.05", fullRaw: "4850000", full: 4850000, initialRaw: "329107.14285714284", initial: 329107, refRaw: "329107.14285714284", ref: 329107, totalRaw: "4607500", total: 4607500, hourRaw: "14220.679012345679", hour: 14221, intensityRaw: "23.142857142857142", intensity: 23, row: 17 },
  { key: ["REGIONALES", "ING_INST_A2_B1", "ALIANZA_MASIVA", 2], discount: "0.335", fullRaw: "5094000", full: 5094000, initialRaw: "1693755", initial: 1693755, refRaw: "1693755", ref: 1693755, totalRaw: "3387510", total: 3387510, hourRaw: "9963.2647058823532", hour: 9963, intensityRaw: "170", intensity: 170, row: 19 },
  { key: ["CUND_ANT", "ING_INST_B1_B2", "ALIANZA_EMPRESARIAL", 14], discount: "0.145", fullRaw: "5701000", full: 5701000, initialRaw: "348168.21428571426", initial: 348168, refRaw: "348168.21428571426", ref: 348168, totalRaw: "4874355", total: 4874355, hourRaw: "12827.25", hour: 12827, intensityRaw: "27.142857142857142", intensity: 27, row: 23 },
  { key: ["REGIONALES", "ING_INST_B2_C1", "PREVENTA_ESPECIAL", 2], discount: "0.405", fullRaw: "6064000", full: 6064000, initialRaw: "1804040", initial: 1804040, refRaw: "1804040", ref: 1804040, totalRaw: "3608080", total: 3608080, hourRaw: "8930.8910891089108", hour: 8931, intensityRaw: "202", intensity: 202, row: 25 },
  { key: ["CUND_ANT", "ING_INST_A1_A2_B1", "COLABORADOR", 20], discount: "0.36", fullRaw: "7519000", full: 7519000, initialRaw: "240608", initial: 240608, refRaw: "240608", ref: 240608, totalRaw: "4812160", total: 4812160, hourRaw: "9585.9760956175305", hour: 9586, intensityRaw: "25.1", intensity: 25, row: 30 },
  { key: ["REGIONALES", "ING_INST_A2_B1_B2", "PRECIO_AL_PUBLICO", 12], discount: "0.35", fullRaw: "8126000", full: 8126000, initialRaw: "440158.33333333331", initial: 440158, refRaw: "440158.33333333337", ref: 440158, totalRaw: "5281900", total: 5281900, hourRaw: "9745.20295202952", hour: 9745, intensityRaw: "45.166666666666664", intensity: 45, row: 33 },
  { key: ["CUND_ANT", "ING_INST_B1_B2_C1", "ALIANZA_MASIVA", 3], discount: "0.43", fullRaw: "8733000", full: 8733000, initialRaw: "1659270", initial: 1659270, refRaw: "1659270", ref: 1659270, totalRaw: "4977810", total: 4977810, hourRaw: "8552.9381443298971", hour: 8553, intensityRaw: "194", intensity: 194, row: 36 },
  { key: ["REGIONALES", "ING_INST_A1_A2_B1_B2", "ALIANZA_EMPRESARIAL", 24], discount: "0.415", fullRaw: "10551000", full: 10551000, initialRaw: "257180.625", initial: 257181, refRaw: "257180.625", ref: 257181, totalRaw: "6172335", total: 6172335, hourRaw: "8767.521306818182", hour: 8768, intensityRaw: "29.333333333333332", intensity: 29, row: 43 },
  { key: ["CUND_ANT", "ING_INST_A2_B1_B2_C1", "PREVENTA_ESPECIAL", 18], discount: "0.4475", fullRaw: "11158000", full: 11158000, initialRaw: "342488.61111111112", initial: 342489, refRaw: "342488.61111111112", ref: 342489, totalRaw: "6164795", total: 6164795, hourRaw: "8286.0147849462373", hour: 8286, intensityRaw: "41.333333333333336", intensity: 41, row: 47 },
  { key: ["REGIONALES", "ING_INST_A1_A2_B1_B2_C1", "COLABORADOR", 26], discount: "0.576", fullRaw: "13583000", full: 13583000, initialRaw: "221507.38461538462", initial: 221507, refRaw: "221507.3846153846", ref: 221507, totalRaw: "5759192", total: 5759192, hourRaw: "6356.7240618101541", hour: 6357, intensityRaw: "34.846153846153847", intensity: 35, row: 53 }
];

test("15 casos tarifarios coinciden campo por campo con las celdas fuente", function () {
  expectedTariffs.forEach(function (expected, index) {
    var actual = findTariff(expected.key);
    assert(actual, "No existe caso " + (index + 1));
    equal(actual.porcentaje_descuento_exacto, expected.discount, "Descuento caso " + (index + 1));
    equal(actual.valor_full_raw_excel, expected.fullRaw, "Full raw caso " + (index + 1));
    equal(actual.valor_full_oficial_cop, expected.full, "Full COP caso " + (index + 1));
    equal(actual.cuota_inicial_raw_excel, expected.initialRaw, "Inicial raw caso " + (index + 1));
    equal(actual.cuota_inicial_minima_cop, expected.initial, "Inicial COP caso " + (index + 1));
    equal(actual.cuota_mensual_referencia_raw_excel, expected.refRaw, "Cuota raw caso " + (index + 1));
    equal(actual.cuota_mensual_referencia_cop, expected.ref, "Cuota COP caso " + (index + 1));
    equal(actual.valor_total_raw_excel, expected.totalRaw, "Total raw caso " + (index + 1));
    equal(actual.valor_total_oficial_cop, expected.total, "Total COP caso " + (index + 1));
    equal(actual.valor_por_hora_raw_excel, expected.hourRaw, "Hora raw caso " + (index + 1));
    equal(actual.valor_por_hora_mostrado_cop, expected.hour, "Hora COP caso " + (index + 1));
    equal(actual.maxima_intensidad_mensual_raw, expected.intensityRaw, "Intensidad raw caso " + (index + 1));
    equal(actual.maxima_intensidad_mensual_mostrada, expected.intensity, "Intensidad mostrada caso " + (index + 1));
    equal(actual.fila_origen, expected.row, "Fila caso " + (index + 1));
  });
});

test("la aplicación conserva su arquitectura estática y registra solo por el canal autorizado", function () {
  var root = __dirname;
  var files = ["index.html", "estilos.css", "aplicacion.js", "tarifas.js", "tarifas_modelo_mp.js", "configuracion_sedes.js", "configuracion_jefes_ventas.js", "configuracion_adicionales.js", "configuracion_campanas_adicionales.js", "configuracion_modelos_tarifarios.js", "configuracion_registro.js"];
  var contents = files.map(function (file) { return fs.readFileSync(path.join(root, file), "utf8"); }).join("\n");
  var remoteUrls = contents.match(/https?:\/\/[^\s"']+/gi) || [];
  remoteUrls.forEach(function (url) {
    assert(/^https:\/\/(mail\.google\.com\/mail\/|web\.whatsapp\.com\/send|script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec|smart-tdx\.github\.io\/Procesos-Comerciales\/Calculadora%20comercial%20Instituto\/|cdnjs\.cloudflare\.com\/ajax\/libs\/html2pdf\.js\/0\.14\.0\/html2pdf\.bundle\.min\.js|unpkg\.com\/html2pdf\.js@0\.14\.0\/dist\/html2pdf\.bundle\.min\.js)/i.test(url), "Se encontró una URL remota no autorizada: " + url);
  });
  assert(!/\bfetch\s*\(/i.test(contents), "Se encontró fetch");
  assert(!/localStorage|sessionStorage|indexedDB/i.test(contents), "Se encontró persistencia local");
  assert(/<script src="configuracion_sedes\.js"><\/script>\s*<script src="configuracion_jefes_ventas\.js"><\/script>\s*<script src="configuracion_adicionales\.js"><\/script>\s*<script src="configuracion_campanas_adicionales\.js"><\/script>\s*<script src="configuracion_modelos_tarifarios\.js"><\/script>\s*<script src="tarifas\.js"><\/script>\s*<script src="tarifas_modelo_mp\.js"><\/script>\s*<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/html2pdf\.js\/0\.14\.0\/html2pdf\.bundle\.min\.js"[\s\S]*?<\/script>\s*<script src="configuracion_registro\.js"><\/script>\s*<script src="aplicacion\.js"><\/script>/i.test(fs.readFileSync(path.join(root, "index.html"), "utf8")), "Orden de scripts incorrecto");
  assert(/navigator\.sendBeacon\(endpoint, body\)/.test(contents), "Falta el canal autorizado de registro");
});

test("Descargar PDF genera el archivo directamente sin abrir about blank ni el diálogo de impresión", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  assert(/async function downloadPreparedDocumentAsPdf\(session, fileName\)/.test(app));
  assert(/global\.html2pdf\(\)\.set\([\s\S]*?\.from\(session\.root\)\.save\(\)/.test(app));
  assert(/embedded && !saveAsPdf \? global\.open\("about:blank", "_blank"\) : null/.test(app));
  assert(/if \(saveAsPdf\) \{\s*continuePrinting\(\);\s*return;\s*\}/.test(app));
  assert(/cdnjs\.cloudflare\.com\/ajax\/libs\/html2pdf\.js\/0\.14\.0\/html2pdf\.bundle\.min\.js/.test(html));
  assert(/unpkg\.com\/html2pdf\.js@0\.14\.0\/dist\/html2pdf\.bundle\.min\.js/.test(html));
});

test("extractor MP audita, valida y publica atómicamente sin tocar tarifas.js", function () {
  var extractor = fs.readFileSync(path.join(__dirname, "extractor_modelo_mp.py"), "utf8");
  assert(/Tarifas Modelo Prueba Julio 2026 - v3\.xlsx/.test(extractor));
  assert(/from decimal import Decimal/.test(extractor));
  assert(/externalLink/.test(extractor) && /defined_names/.test(extractor));
  assert(/if len\(records\) != 452/.test(extractor));
  assert(/temporary\.write_text/.test(extractor));
  assert(/os\.replace\(temporary, CATALOG\)/.test(extractor));
  assert(/tarifas_modelo_mp_/.test(extractor));
  assert(!/CATALOG\s*=.*tarifas\.js/.test(extractor), "El extractor MP no debe reemplazar tarifas.js");
});

test("selector de estrategia es interno y no expone términos técnicos al cliente", function () {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var css = fs.readFileSync(path.join(__dirname, "estilos.css"), "utf8");
  var models = fs.readFileSync(path.join(__dirname, "configuracion_modelos_tarifarios.js"), "utf8");
  assert(/id="estrategia"/.test(html));
  assert(html.indexOf("Plan tarifario") >= 0);
  ["Tarifas generales", "Tarifas MP", "Tarifas nivel a nivel"].forEach(function (name) {
    assert(models.indexOf(name) >= 0, "Falta nombre comercial " + name);
  });
  var client = html.slice(html.indexOf('<section id="client-view"'), html.indexOf('<section id="print-document"'));
  ["Modelo MP", "Piloto", "Experimental", "Tarifa nueva", "Excel", "Estrategia tarifaria"].forEach(function (term) {
    assert(client.toLowerCase().indexOf(term.toLowerCase()) < 0, "Término técnico expuesto al cliente: " + term);
  });
  assert(/handleStrategyChange/.test(app) && /quote\.status = "MODIFICADA"/.test(app));
});

test("MP reutiliza conciliación financiera para contado, financiado y continuidad $0", function () {
  var cash = findMPTariff("MODELO_MP_PAQUETES", "INGLES", "MP_INTEGRAL_A1_A2", "PRECIO_AL_PUBLICO", 1);
  var financed = findMPTariff("MODELO_MP_PAQUETES", "INGLES", "MP_INTEGRAL_A1_A2", "PRECIO_AL_PUBLICO", 8);
  var zero = findMPTariff("MODELO_MP_NIVEL_A_NIVEL", "INGLES", "MP_ETAPAS_INICIO_A1_NIVEL_C1", "ALIANZA_EMPRESARIAL", 1);
  [cash, financed, zero].forEach(function (tariff) { assert(tariff, "Falta tarifa MP de prueba"); });
  var cashPlan = standardPlan(cash, cash.valor_total_oficial_cop);
  var financedPlan = standardPlan(financed, financed.cuota_inicial_minima_cop);
  var zeroPlan = standardPlan(zero, 0);
  [cashPlan, financedPlan, zeroPlan].forEach(function (plan) {
    assert(plan.valid);
    equal(plan.differenceCop, 0);
    equal(plan.rows[plan.rows.length - 1].balanceAfterCop, 0);
  });
  equal(zeroPlan.sumPaymentsCop, 0);
});

test("extractor parametrizado protege la actualización de 750 tarifas", function () {
  var extractor = fs.readFileSync(path.join(__dirname, "extractor_tarifas.py"), "utf8");
  equal((extractor.match(/"idioma_id": "INGLES"/g) || []).length, 2);
  equal((extractor.match(/"idioma_id": "FRANCES"/g) || []).length, 2);
  assert(/def build_records\(source/.test(extractor));
  assert(/from decimal import Decimal/.test(extractor));
  assert(/if len\(records\) != 750/.test(extractor));
  assert(/def safe_write_javascript/.test(extractor));
  assert(/respaldos/.test(extractor));
  assert(/def compare_records/.test(extractor));
  assert(/def update_validation_report/.test(extractor));
  assert(/REPORTE_ERROR_EXTRACCION_TARIFAS\.md/.test(extractor));
  var safeWrite = extractor.slice(extractor.indexOf("def safe_write_javascript"), extractor.indexOf("def main"));
  assert(safeWrite.indexOf("shutil.copy2") < safeWrite.indexOf("differences = compare_records"), "El respaldo debe preceder a la comparación");
  assert(safeWrite.indexOf("differences = compare_records") < safeWrite.indexOf("temporary.replace(output)"), "La comparación debe preceder al reemplazo");
});

test("interfaz UTF-8, adaptable y preparada para impresión A4", function () {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  var css = fs.readFileSync(path.join(__dirname, "estilos.css"), "utf8");
  assert(html.indexOf("Cotización") >= 0 && html.indexOf("Inglés") >= 0 && html.indexOf("Francés") >= 0, "Texto UTF-8 ilegible");
  assert(html.indexOf("CotizaciÃ") < 0, "Se detectó texto con codificación dañada");
  assert(/<meta charset="UTF-8">/.test(html));
  ["index.html", "aplicacion.js", "estilos.css", "configuracion_adicionales.js", "configuracion_campanas_adicionales.js", "configuracion_modelos_tarifarios.js", "configuracion_sedes.js"].forEach(function (file) {
    var text = fs.readFileSync(path.join(__dirname, file), "utf8");
    assert(text.indexOf("\uFFFD") < 0, "Carácter de reemplazo UTF-8 en " + file);
  });
  assert(/name="viewport"/i.test(html));
  assert(/@media \(max-width: 1050px\)/.test(css));
  assert(/@media \(max-width: 760px\)/.test(css));
  assert(/@media \(max-width: 460px\)/.test(css));
  assert(/@page[\s\S]*size:\s*A4/i.test(css));
  assert(/@media print/.test(css));
  assert(/\.phone-control\s*\{[\s\S]*?grid-template-columns:\s*minmax\(185px, 0\.48fr\) minmax\(130px, 0\.52fr\)/.test(css));
  assert(/class="field client-email-field"[\s\S]*?class="contact-control-label">Dirección de correo</.test(html));
  assert(/\.phone-subfield > span,[\s\S]*?\.contact-control-label\s*\{[\s\S]*?font-size:\s*0\.72rem/.test(css));
  assert(/@media \(max-width: 760px\)[\s\S]*?\.phone-control\s*\{[\s\S]*?grid-template-columns:\s*1fr/.test(css));
});

test("acciones de compartir, copiar WhatsApp, imprimir y PDF respetan su estado", function () {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  var css = fs.readFileSync(path.join(__dirname, "estilos.css"), "utf8");
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  ["btn-compartir", "btn-whatsapp", "btn-imprimir", "btn-pdf", "btn-client-compartir", "btn-client-whatsapp", "btn-client-print"].forEach(function (id) {
    assert(html.indexOf("id=\"" + id + "\"") >= 0, "Falta " + id);
  });
  assert(/document\.querySelectorAll\("\.generated-action"\)/.test(app));
  assert(/button\.disabled = quote\.status !== "VIGENTE"/.test(app));
  assert(/document\.querySelectorAll\("\.share-action"\)/.test(app));
  assert(/function ensureShareableQuote\(\)/.test(app));
  assert(/quote\.status === "VIGENTE" \|\| quote\.status === "VENCIDA"/.test(app));
  assert(/global\.print\(\)/.test(app));
  var dock = html.slice(html.indexOf('<div class="dock-buttons">'), html.indexOf("</div>", html.indexOf('<div class="dock-buttons">')));
  ["btn-compartir", "btn-whatsapp", "btn-pdf", "btn-imprimir"].reduce(function (previous, id) {
    var position = dock.indexOf('id="' + id + '"');
    assert(position > previous, "Orden incorrecto: " + id);
    return position;
  }, -1);
  assert(/id="btn-imprimir" class="button button-neutral generated-action"/.test(html));
  assert(/\.dock-buttons\s*\{[\s\S]*?grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/.test(css));
  assert(/@media \(max-width: 880px\)[\s\S]*?repeat\(2, minmax\(0, 1fr\)\)/.test(css));
  assert(/@media \(max-width: 460px\)[\s\S]*?\.dock-buttons\s*\{[\s\S]*?grid-template-columns:\s*1fr/.test(css));
});

test("vista previa de WhatsApp contiene contexto, estado, mensaje y PDF", function () {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  var css = fs.readFileSync(path.join(__dirname, "estilos.css"), "utf8");
  [
    "share-dialog", "share-context", "share-message-preview", "share-message-length",
    "share-preview-client", "share-preview-language", "share-preview-payment", "share-preview-validity",
    "share-pdf-status", "btn-copiar-mensaje-manual", "btn-compartir-dialog", "btn-descargar-pdf-compartir"
  ].forEach(function (id) {
    assert(html.indexOf('id="' + id + '"') >= 0, "Falta " + id);
  });
  equal((html.match(/<option value="(?:SEGUIMIENTO_GENERAL|LO_VA_A_PENSAR|CONSULTA_PAREJA_FAMILIA|REVISA_PRESUPUESTO|COMPARA_ALTERNATIVAS|LISTO_PARA_AVANZAR)"/g) || []).length, 6);
  assert(/<pre id="share-message-preview"[^>]*role="textbox"[^>]*aria-readonly="true"/.test(html));
  assert(/id="share-dialog" class="share-dialog no-print"/.test(html));
  assert(/\.share-dialog-body\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/.test(css));
  assert(/\.share-message-preview\s*\{[\s\S]*?max-width:\s*100%[\s\S]*?overflow:\s*auto/.test(css));
  assert(/\.share-pdf-status span\s*\{[\s\S]*?overflow-wrap:\s*anywhere/.test(css));
  var actions = html.slice(html.indexOf('<div class="share-dialog-actions">'), html.indexOf("</div>", html.indexOf('<div class="share-dialog-actions">')));
  equal((actions.match(/<button/g) || []).length, 2);
  assert(actions.indexOf("Descargar PDF") >= 0 && actions.indexOf("Enviar por WhatsApp") >= 0);
  assert(html.indexOf("Usa esta opción únicamente si WhatsApp no carga el mensaje automáticamente.") >= 0);
  ["Descargar PDF primero", "Continuar a WhatsApp", "Copiar mensaje para WhatsApp"].forEach(function (copy) {
    assert(html.indexOf(copy) < 0, "Acción obsoleta: " + copy);
  });
  assert(/\.share-dialog-actions\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/.test(css));
});

test("mensaje financiado adapta correctamente Inglés y Francés", function () {
  var english = core.buildWhatsAppMessage(shareMessageData({ languageId: "INGLES" }));
  var french = core.buildWhatsAppMessage(shareMessageData({ languageId: "FRANCES" }));
  assert(english.indexOf("aprendizaje del inglés") >= 0);
  assert(english.indexOf("aprender inglés") >= 0);
  assert(english.indexOf("francés") < 0);
  assert(french.indexOf("aprendizaje del francés") >= 0);
  assert(french.indexOf("aprender francés") >= 0);
  assert(french.indexOf("inglés") < 0);
  [english, french].forEach(function (message) {
    assert(message.indexOf("*Para iniciar pagas:*") >= 0);
    assert(message.indexOf("19 mensualidades de *$200.000*") >= 0);
    assert(message.indexOf("Última cuota ajustada: $199.999") >= 0);
    assert(message.indexOf("*Valor final de la cotización*") >= 0);
  });
});

test("mensaje de contado omite todos los conceptos de financiación", function () {
  ["INGLES", "FRANCES"].forEach(function (languageId) {
    var message = core.buildWhatsAppMessage(shareMessageData({
      languageId: languageId,
      numberOfPayments: 1,
      totalContractCop: 2999000
    }));
    assert(message.indexOf(core.SMART_EMOJIS.pago + " *Pago único*") >= 0);
    assert(message.indexOf("*Valor final de la cotización:*") >= 0);
    assert(message.indexOf("*$2.999.000*") >= 0);
    assert(message.indexOf("Fecha estimada de confirmación del pago:") >= 0);
    ["Para iniciar pagas", "mensualidades", "Primera mensualidad", "Última cuota", "Y después", "Saldo financiado"].forEach(function (forbidden) {
      assert(message.indexOf(forbidden) < 0, "Contado contiene " + forbidden);
    });
    equal((message.match(/\$2\.999\.000/g) || []).length, 1);
  });
});

test("mensaje muestra únicamente los adicionales seleccionados y su total separado", function () {
  var none = core.buildWhatsAppMessage(shareMessageData());
  assert(none.indexOf("Adicionales bonificados") < 0);
  assert(none.indexOf("Valor comercial de los adicionales") < 0);
  var one = core.buildWhatsAppMessage(shareMessageData({
    additionals: [{ title: "Material académico de 3 niveles" }],
    additionalsTotalCop: 729000
  }));
  assert(one.indexOf(core.SMART_EMOJIS.aprobado + " Material académico de 3 niveles") >= 0);
  assert(one.indexOf("*$729.000*") >= 0);
  var four = core.buildWhatsAppMessage(shareMessageData({
    additionals: [
      { title: "Material académico de 3 niveles" },
      { title: "Examen Linguaskill de cuatro habilidades" },
      { title: "Clubes de conversación ilimitados" },
      { title: "Curso corto de Inglés de Negocios" }
    ],
    additionalsTotalCop: 2185000
  }));
  equal((four.match(/^✅ /gm) || []).length, 4);
  assert(four.indexOf("Estos adicionales no modifican el valor final de la cotización.") >= 0);
  equal((four.match(/Valor final de la cotización/g) || []).length, 1);
});

test("los seis contextos producen un único CTA autorizado", function () {
  var expected = {
    SEGUIMIENTO_GENERAL: "Quiero empezar",
    LO_VA_A_PENSAR: "Quiero empezar",
    CONSULTA_PAREJA_FAMILIA: "Queremos avanzar",
    REVISA_PRESUPUESTO: "Revisemos mi plan",
    COMPARA_ALTERNATIVAS: "Quiero empezar",
    LISTO_PARA_AVANZAR: "Listo para matricularme"
  };
  equal(core.SHARE_CONTEXTS.length, 6);
  core.SHARE_CONTEXTS.forEach(function (context) {
    var message = core.buildWhatsAppMessage(shareMessageData({ contextId: context.id }));
    var diagnostics = core.whatsAppMessageDiagnostics(message);
    equal(diagnostics.ctaOccurrences, 1, "CTA para " + context.id);
    assert(message.indexOf(expected[context.id]) >= 0, "Respuesta incorrecta para " + context.id);
    assert(message.trim().split("\n").slice(-1)[0].indexOf(expected[context.id]) >= 0, "El CTA no quedó al final para " + context.id);
  });
});

test("cotización vencida y beneficios vencidos usan cierres seguros", function () {
  var expired = core.buildWhatsAppMessage(shareMessageData({ quoteExpired: true, additionals: [{ title: "Material académico" }] }));
  assert(expired.indexOf("Las condiciones de esta propuesta ya finalizaron.") >= 0);
  assert(expired.indexOf("Actualizar propuesta") >= 0);
  assert(expired.indexOf("Tu meta de aprender") < 0);
  assert(expired.indexOf("Adicionales bonificados") < 0);
  assert(expired.indexOf("Quiero empezar") < 0);
  equal(core.whatsAppMessageDiagnostics(expired).ctaOccurrences, 1);

  var bonusesExpired = core.buildWhatsAppMessage(shareMessageData({
    benefitsExpired: true,
    additionals: [{ title: "Material académico de 3 niveles" }]
  }));
  assert(bonusesExpired.indexOf("Bonificaciones por validar") >= 0);
  assert(bonusesExpired.indexOf("debemos validar nuevamente la disponibilidad") >= 0);
  assert(bonusesExpired.indexOf("Validar beneficios") >= 0);
  assert(bonusesExpired.indexOf("✓ Material") < 0);
  equal(core.whatsAppMessageDiagnostics(bonusesExpired).ctaOccurrences, 1);
});

test("mensajes son texto plano, comercial y de longitud controlada", function () {
  var lengths = [];
  ["INGLES", "FRANCES"].forEach(function (languageId) {
    [1, 20].forEach(function (payments) {
      core.SHARE_CONTEXTS.forEach(function (context) {
        var message = core.buildWhatsAppMessage(shareMessageData({
          languageId: languageId,
          numberOfPayments: payments,
          contextId: context.id,
          additionals: [
            { title: "Material académico de 3 niveles" },
            { title: "Examen Linguaskill de cuatro habilidades" },
            { title: "Clubes de conversación ilimitados" },
            { title: "Curso corto complementario" }
          ],
          additionalsTotalCop: 2185000
        }));
        var diagnostics = core.whatsAppMessageDiagnostics(message);
        lengths.push(diagnostics.characterCount);
        assert(!diagnostics.hasTechnicalTerms);
        assert(diagnostics.emojiCount >= 5 && diagnostics.emojiCount <= 12);
        assert(diagnostics.normalizedNFC && !diagnostics.hasReplacementCharacter);
        assert(message.indexOf("<") < 0 && message.indexOf(">") < 0);
        assert(!/Saldo después|Zona tarifaria|Modelo MP|archivo Excel|CUND_ANT|REGIONALES/i.test(message));
        assert(message.indexOf("p. m..") < 0 && message.indexOf("a. m..") < 0);
      });
    });
  });
  var average = lengths.reduce(function (sum, value) { return sum + value; }, 0) / lengths.length;
  assert(average < 1500, "Promedio demasiado largo: " + average);
});

test("nombre del PDF incluye cliente, idioma y referencia sin caracteres inválidos", function () {
  equal(
    core.buildPdfFileName({ clientName: "Ana María / Pérez", languageId: "FRANCES", reference: "SMART:2026/ABC" }),
    "Cotizacion_Smart_Ana_Maria_Perez_Frances_SMART_2026_ABC.pdf"
  );
  equal(
    core.buildPdfFileName({ clientName: "José  Peña", languageId: "INGLES", reference: "SMART-001" }),
    "Cotizacion_Smart_Jose_Pena_Ingles_SMART_001.pdf"
  );
  assert(core.buildPdfFileName({}).indexOf("Modelo_MP") < 0);
});

test("celular colombiano se normaliza y abre el chat exacto de WhatsApp", function () {
  ["3001234567", "300 123 4567", "+57 300 123 4567", "57 300 123 4567", "0057 300 123 4567"].forEach(function (phone) {
    equal(core.normalizeClientPhone(phone, "CO"), "573001234567");
  });
  ["", "1234567", "571001234567", "30012345678"].forEach(function (phone) {
    equal(core.normalizeClientPhone(phone, "CO"), "");
  });
  var url = core.buildWhatsAppUrl("+57 300 123 4567", "Hola Ana & Luis");
  var parsedUrl = new URL(url);
  equal(parsedUrl.origin + parsedUrl.pathname, "https://web.whatsapp.com/send");
  equal(parsedUrl.searchParams.get("phone"), "573001234567");
  equal(parsedUrl.searchParams.get("text"), "Hola Ana & Luis");
  equal(core.formatClientPhone("573001234567", "CO"), "+57 300 123 4567");
});

test("catálogo internacional contiene 21 países y Otro país con claves ISO", function () {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  equal(core.PHONE_COUNTRIES.length, 22);
  var expected = ["CO", "US", "CA", "MX", "PE", "EC", "AR", "CL", "VE", "BR", "BO", "PY", "UY", "PA", "CR", "GT", "SV", "HN", "NI", "DO", "PR", "OTHER"];
  deepEqual(core.PHONE_COUNTRIES.map(function (country) { return country.iso; }), expected);
  expected.forEach(function (iso) {
    assert(html.indexOf('<option value="' + iso + '"') >= 0, "Falta país " + iso);
  });
  assert(/<option value="CO" selected>Colombia \(\+57\)<\/option>/.test(html));
  assert(html.indexOf("🇨🇴") < 0 && html.indexOf("🇺🇸") < 0);
});

test("números internacionales usan E.164 básico sin duplicar indicativos", function () {
  var cases = [
    ["987654321", "PE", "51987654321"],
    ["+51 987 654 321", "PE", "51987654321"],
    ["593987654321", "EC", "593987654321"],
    ["1123456789", "AR", "541123456789"],
    ["912345678", "CL", "56912345678"],
    ["5512345678", "MX", "525512345678"],
    ["51234567", "GT", "50251234567"],
    ["81234567", "NI", "50581234567"],
    ["2025550123", "US", "12025550123"],
    ["14165550123", "CA", "14165550123"],
    ["61234567", "PA", "50761234567"],
    ["4121234567", "VE", "584121234567"],
    ["11987654321", "BR", "5511987654321"]
  ];
  cases.forEach(function (item) {
    equal(core.normalizeClientPhone(item[0], item[1]), item[2], item[1]);
  });
  equal(core.normalizeClientPhone("+34 612 345 678", "OTHER", "+34"), "34612345678");
  equal(core.normalizeClientPhone("34612345678", "OTHER", "34"), "34612345678");
  ["+34", "44", "+33", "+971"].forEach(function (dial) { assert(core.normalizeManualDialCode(dial)); });
  ["", "+", "00", "+000", "+12345", "+3 4", "+A4"].forEach(function (dial) { equal(core.normalizeManualDialCode(dial), ""); });
  equal(core.normalizeClientPhone("+51 987 654 321", "CO"), "");
});

test("mensaje y enlace de WhatsApp conservan emojis, símbolos y acentos en NFC", function () {
  var allowedSymbols = Array.from(new Set(Object.keys(core.WHATSAPP_EMOJIS).map(function (key) { return core.WHATSAPP_EMOJIS[key]; }).filter(Boolean)));
  deepEqual(allowedSymbols.sort(), ["👋", "📚", "💳", "💰", "🎁", "⏳", "🙌", "✅"].sort());
  var message = ("Prueba • ✓ áéíóú ñ\nInglés y Francés").normalize("NFD");
  var integrity = core.validateWhatsAppMessageIntegrity(message);
  assert(integrity.valid && integrity.normalized === message.normalize("NFC"));
  var urlResult = core.construirUrlWhatsAppWeb("573001234567", integrity.normalized);
  equal(urlResult.numero, "573001234567");
  equal(urlResult.mensajeRecuperado, integrity.normalized);
  equal(new URL(urlResult.url).searchParams.get("text"), integrity.normalized);
  assert(!core.validateWhatsAppMessageIntegrity("Texto con \uFFFD").valid);
  assert(!core.validateWhatsAppMessageIntegrity("Texto con \\uFFFD literal").valid);
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var whatsAppUrlSource = app.slice(app.indexOf("function construirUrlWhatsAppWeb"), app.indexOf("function validateExceptionalAuthorization"));
  assert(app.indexOf('.normalize("NFC")') >= 0);
  assert(/url\.searchParams\.set\("text", mensaje\)/.test(app));
  equal((whatsAppUrlSource.match(/encodeURIComponent\(/g) || []).length, 0);
  assert(/searchParams\.set\("text"/.test(app));
  assert(!/\bescape\(|\bunescape\(|\bbtoa\(|\batob\(|decodeURIComponent\(|TextEncoder|TextDecoder/.test(whatsAppUrlSource));
  assert(!/\[\^\\x00-\\x7F\]|\[\^\\u0000-\\uFFFF\]|\[\\uD800-\\uDFFF\]/.test(whatsAppUrlSource));
});

test("prueba mínima Unicode conserva los ocho emojis y rechaza surrogates rotos", function () {
  const mensajePrueba = [
    `Hola, Rodolfo ${core.SMART_EMOJIS.saludo}`,
    `${core.SMART_EMOJIS.programa} *Tu programa*`,
    `${core.SMART_EMOJIS.pago} *Tu plan de pago*`,
    `${core.SMART_EMOJIS.dinero} *Valor final de la cotización*`,
    `${core.SMART_EMOJIS.beneficios} *Beneficios*`,
    `${core.SMART_EMOJIS.vigencia} Vigencia`,
    `${core.SMART_EMOJIS.cierre} Quiero empezar`,
    `${core.SMART_EMOJIS.aprobado} Aprobado`
  ].join("\n");
  const pruebaUrl = core.construirUrlWhatsApp("573112890232", mensajePrueba);
  equal(pruebaUrl.mensajeRecuperado, mensajePrueba);
  assert(!pruebaUrl.mensajeRecuperado.includes("\uFFFD"));
  const esperados = ["U+1F44B", "U+1F4DA", "U+1F4B3", "U+1F4B0", "U+1F381", "U+23F3", "U+1F64C", "U+2705"];
  const antes = core.obtenerDiagnosticoCodePoints(mensajePrueba).map(function (item) { return item.codePoint; });
  const despues = core.obtenerDiagnosticoCodePoints(pruebaUrl.mensajeRecuperado).map(function (item) { return item.codePoint; });
  esperados.forEach(function (codePoint) {
    assert(antes.indexOf(codePoint) >= 0 && despues.indexOf(codePoint) >= 0, "Falta " + codePoint);
  });
  deepEqual(antes, despues);
  assert(core.encontrarSurrogadoInvalido("A👋B").valido);
  assert(!core.encontrarSurrogadoInvalido("A\uD83DB").valido);
  assert(!core.encontrarSurrogadoInvalido("A\uDC4BB").valido);
  assertThrows(function () { core.validarMensajeUnicode("A\uD83DB"); });
  assertThrows(function () { core.validarMensajeUnicode("A\uDC4BB"); });
  equal(core.truncarPorCodePoints("A👋B", 2), "A👋");
});

test("WhatsApp Web directo evita wa.me y conserva la ida y vuelta Unicode", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var sample = "Hola, Rodolfo " + core.SMART_EMOJIS.saludo;
  var result = core.construirUrlWhatsAppWeb("573112890232", sample);
  var parsed = new URL(result.url);
  equal(parsed.origin + parsed.pathname, "https://web.whatsapp.com/send");
  equal(parsed.searchParams.get("phone"), "573112890232");
  equal(parsed.searchParams.get("text"), sample);
  equal(result.mensajeRecuperado, sample);
  assert(!result.mensajeRecuperado.includes("\uFFFD"));
  assert(!/https:\/\/wa\.me\//.test(app));
  assert(!/api\.whatsapp\.com/.test(app));
  assert(/global\.open\(resultado\.url, "_blank", "noopener,noreferrer"\)/.test(app));
});

test("vista previa, copia y envío de WhatsApp reutilizan una única fuente de texto", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  assert(/function construirMensajeWhatsApp\(cotizacion, contexto\)/.test(app));
  assert(/var preparedWhatsAppMessage = ""/.test(app));
  assert(/function preparedWhatsAppMessageFor\(data, rebuild\)/.test(app));
  assert(/renderSharePreview\(\)[\s\S]*?preparedWhatsAppMessageFor\(data, true\)/.test(app));
  assert(/copyShareFromPreview\(\)[\s\S]*?preparedWhatsAppMessageFor\(data, false\)/.test(app));
  assert(/shareCurrentQuote\(\)[\s\S]*?preparedWhatsAppMessageFor\(data, false\)/.test(app));
  assert(/share-message-preview"\]\.textContent = message/.test(app));
  equal((app.match(/function construirMensajeWhatsApp\(/g) || []).length, 1);
});

test("modal ofrece solo WhatsApp y correo, con WhatsApp predeterminado", function () {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  ["share-channel-whatsapp", "share-channel-email"].forEach(function (id) {
    assert(html.indexOf('id="' + id + '"') >= 0, "Falta " + id);
  });
  equal((html.match(/name="share-channel"/g) || []).length, 2);
  assert(/id="share-channel-whatsapp"[^>]*checked/.test(html));
  ["Envío rápido al celular del cliente.", "Envío formal al correo del cliente."].forEach(function (copy) {
    assert(html.indexOf(copy) >= 0);
  });
  assert(html.indexOf("Canal de envío") > html.indexOf('id="share-dialog"'));
  assert(/shareChannelId = "WHATSAPP"/.test(app));
  assert(html.indexOf("Enviar por WhatsApp") >= 0);
  assert(html.indexOf("WhatsApp y correo") < 0 && app.indexOf('"BOTH"') < 0);
  assert(html.indexOf("share-channel-both") < 0 && app.indexOf("bothWhatsAppPrepared") < 0);
});

test("correo valida dirección, prepara asunto y completa Gmail sin envío automático", function () {
  assert(core.isValidOptionalEmail("cliente@example.com"));
  assert(!core.isValidOptionalEmail("cliente@"));
  var data = shareMessageData({ clientName: "Juanita González", clientEmail: "juanita@example.com" });
  var subject = core.buildEmailSubject(data);
  var body = core.buildEmailBody(data);
  equal(subject, "Cotización personalizada Smart – Inglés – Juanita González");
  assert(body.indexOf("Hola, Juanita González:") === 0);
  assert(body.indexOf("Sede: Cajicá") >= 0);
  assert(body.indexOf("avanzar en tu aprendizaje del inglés") >= 0);
  assert(body.indexOf("Cuota inicial:\n$500.000") >= 0);
  assert(body.indexOf("Luego:\n19 mensualidades de $200.000") >= 0);
  assert(body.indexOf("Valor final de la cotización:\n$4.299.999") >= 0);
  assert(body.indexOf("Cordialmente,\nLuis Pérez\nEquipo comercial\nAcademia de Idiomas Smart") >= 0);
  assert(body.indexOf("Referencia de cotización: SMART-20260804-1722-ABC") >= 0);
  assert(!/Condición comercial|Plan tarifario|Modelo MP|Ruta interna|archivo_origen|CUND_ANT/i.test(body));
  var gmailUrl = new URL(core.buildGmailComposeUrl(data.clientEmail, subject, body));
  equal(gmailUrl.hostname, "mail.google.com");
  equal(gmailUrl.searchParams.get("to"), "juanita@example.com");
  equal(gmailUrl.searchParams.get("su"), subject);
  equal(gmailUrl.searchParams.get("body"), body);
  equal(core.buildGmailComposeUrl("correo-invalido", subject, body), "");
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  assert(app.indexOf("Ingresa el correo electrónico del cliente para preparar el envío.") >= 0);
  assert(app.indexOf("Verifica el correo electrónico del cliente.") >= 0);
  assert(!/Gmail API|OAuth|sendMessage|drafts\.create|fetch\s*\(/i.test(app));
});

test("Gmail confirma la cuenta activa y prepara identidad corporativa futura", function () {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  deepEqual(core.corporateEmailIdentity(""), { status: "LOCAL_MANUAL", email: "", valid: true });
  deepEqual(core.corporateEmailIdentity("asesor@smartidiomas.edu.co"), { status: "CORPORATE_VALID", email: "asesor@smartidiomas.edu.co", valid: true });
  assert(!core.corporateEmailIdentity("asesor@gmail.com").valid);
  assert(!core.corporateEmailIdentity("asesor@smartidiomas.edu.co.ejemplo.com").valid);
  ["Verifica que Gmail esté abierto con tu cuenta corporativa @smartidiomas.edu.co. Adjunta el PDF antes de enviar.", "Continuar a Gmail", "Cancelar"].forEach(function (copy) {
    assert(html.indexOf(copy) >= 0, "Falta advertencia Gmail: " + copy);
  });
  var gmailModal = html.slice(html.indexOf('<dialog id="gmail-account-dialog"'), html.indexOf("</dialog>", html.indexOf('<dialog id="gmail-account-dialog"')));
  equal((gmailModal.match(/Verifica que Gmail esté abierto con tu cuenta corporativa @smartidiomas\.edu\.co/g) || []).length, 1);
  assert(gmailModal.indexOf("gmail-account-message") < 0);
  assert(app.indexOf("SMART_AUTH_USER_EMAIL") >= 0);
  assert(app.indexOf("Debes ingresar con una cuenta corporativa de Smart para preparar el correo.") >= 0);
  assert(app.indexOf("Cuenta corporativa identificada: ") < 0);
});

test("correo adapta idioma, contado, financiación, beneficios y seis contextos", function () {
  var french = core.buildEmailBody(shareMessageData({ languageId: "FRANCES" }));
  assert(french.indexOf("aprendizaje del francés") >= 0);
  assert(french.indexOf("aprender francés") >= 0);
  assert(french.indexOf("aprendizaje del inglés") < 0);
  var cash = core.buildEmailBody(shareMessageData({ numberOfPayments: 1, totalContractCop: 2999000 }));
  assert(cash.indexOf("Pago único:\n$2.999.000") >= 0);
  assert(cash.indexOf("mensualidades") < 0);
  var benefits = core.buildEmailBody(shareMessageData({
    additionals: [{ title: "Material académico de 3 niveles", valueConfigured: true, valueCop: 729000, valueLabel: "Valor comercial" }],
    additionalsTotalCop: 729000
  }));
  assert(benefits.indexOf("BENEFICIOS") >= 0);
  assert(benefits.indexOf("Valor comercial: $729.000") >= 0);
  assert(benefits.indexOf("Los adicionales bonificados no modifican el valor final de la cotización.") >= 0);
  core.SHARE_CONTEXTS.forEach(function (context) {
    var body = core.buildEmailBody(shareMessageData({ contextId: context.id }));
    assert(body.indexOf("Referencia de cotización:") >= 0, "Referencia ausente para " + context.id);
    assert(body.indexOf("Cordialmente,") >= 0, "Firma ausente para " + context.id);
    assert(body.indexOf("p. m..") < 0 && body.indexOf("a. m..") < 0, "Puntuación duplicada para " + context.id);
  });
  assert(core.buildEmailBody(shareMessageData({ contextId: "LISTO_PARA_AVANZAR" })).indexOf("Cuando estés listo, respóndeme este correo y te acompañaré con la formalización.") >= 0);
});

test("WhatsApp y correo omiten datos de contacto y conservan Cajicá como sede comercial", function () {
  var data = shareMessageData({ clientPhoneNormalized: "573001234567", clientEmail: "ana@example.com", siteName: "Cajicá" });
  var whatsapp = core.buildWhatsAppMessage(data);
  var email = core.buildEmailBody(data);
  assert(whatsapp.indexOf("Sede: Cajicá") >= 0);
  assert(email.indexOf("Sede: Cajicá") >= 0);
  assert(whatsapp.indexOf("573001234567") < 0 && whatsapp.indexOf("ana@example.com") < 0);
});

test("los canales son independientes y conservan el recordatorio manual del PDF", function () {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  assert(app.indexOf('shareChannelId = ["WHATSAPP", "EMAIL"].indexOf(channel)') >= 0);
  assert(html.indexOf("btn-preparar-correo-dialog") < 0);
  assert(app.indexOf("bothWhatsAppPrepared") < 0 && app.indexOf('shareChannelId === "BOTH"') < 0);
  assert(app.indexOf("WhatsApp Web se abrió. Verifica que el mensaje aparezca antes de enviarlo.") >= 0);
  assert(app.indexOf("Adjunta manualmente el PDF de la cotización antes de enviar el correo.") >= 0);
  assert(!/mensaje fue enviado|correo fue enviado|PDF fue adjuntado/i.test(app));
  assert(!/Promise\.all\([\s\S]{0,200}global\.open/.test(app));
});

test("detección de Web Share distingue texto, archivo y flujo manual", function () {
  deepEqual(core.detectShareCapabilities({}, null), {
    canShareText: false,
    canShareFiles: false,
    pdfMode: "PDF_MANUAL_DESDE_IMPRESION"
  });
  var textOnly = core.detectShareCapabilities({ share: function () {}, canShare: function () { return false; } }, { name: "cotizacion.pdf" });
  assert(textOnly.canShareText && !textOnly.canShareFiles);
  var withFile = core.detectShareCapabilities({ share: function () {}, canShare: function (payload) { return payload.files.length === 1; } }, { name: "cotizacion.pdf" });
  assert(withFile.canShareText && withFile.canShareFiles && withFile.pdfMode === "ARCHIVO_COMPARTIBLE");
});

test("compartir abre WhatsApp Web una vez y deja la copia como contingencia manual", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  assert(/btn-compartir-dialog[\s\S]*shareCurrentQuote/.test(app));
  assert(/if \(shareInProgress\)/.test(app));
  assert(/now - lastWhatsAppOpenAttemptAt < 2500/.test(app));
  assert(/lastWhatsAppOpenAttemptAt = now/.test(app));
  assert(/construirUrlWhatsAppWeb\(numero, mensajeWhatsAppFinal\)/.test(app));
  assert(/buildGmailComposeUrl\(emailValidation\.email, subject, body, manager \? manager\.correo : ""\)/.test(app));
  assert(/global\.open\(resultado\.url, "_blank", "noopener,noreferrer"\)/.test(app));
  assert(/global\.open\(gmailUrl, "_blank"\)/.test(app));
  assert(/async function copiarMensajeSinLeer\(texto\)/.test(app));
  assert(!/navigator\.clipboard\.readText/.test(app));
  assert(/navigator\.clipboard\.writeText\(mensaje\)/.test(app));
  assert(/textarea\.setSelectionRange\(0, textarea\.value\.length\)/.test(app));
  assert(/document\.execCommand\("copy"\)/.test(app));
  var shareSource = app.slice(app.indexOf("async function shareCurrentQuote"), app.indexOf("function closeWhatsAppFollowup"));
  assert(!/copiarMensajeSinLeer|writeText|execCommand/.test(shareSource));
  var copySource = app.slice(app.indexOf("async function copyShareFromPreview"), app.indexOf("function prepareEmailShareStep"));
  assert(!/global\.open\(/.test(copySource));
  assert(app.indexOf("Mensaje copiado. Pégalo en WhatsApp.") >= 0);
  assert(app.indexOf("Adjunta manualmente el PDF") >= 0);
  assert(!/localStorage|sessionStorage|indexedDB|fetch\s*\(/i.test(app));
});

test("descarga PDF conserva impresión aprobada y propone nombre identificable", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  assert(/function printProposal\(saveAsPdf, suggestedFileName\)/.test(app));
  assert(/document\.title = session\.pdfFileName\.replace/.test(app));
  assert(/document\.title = sessionBeingCleaned\.documentTitleBeforePrint/.test(app));
  assert(/nombreArchivoPdfSugerido/.test(app));
  assert(/printProposal\(true, buildPdfFileName\(data\)\)/.test(app));
  assert(/global\.print\(\)/.test(app));
});

test("interfaz progresiva respeta Idioma, Sede, Estrategia, Programa, Condición y Pago", function () {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  var language = html.indexOf("id=\"idioma\"");
  var site = html.indexOf("id=\"sede\"");
  var strategy = html.indexOf("id=\"estrategia\"");
  var zone = html.indexOf("id=\"zone-information\"");
  var plan = html.indexOf("id=\"plan\"");
  var condition = html.indexOf("id=\"condicion\"");
  var payment = html.indexOf("id=\"numero-pagos\"");
  assert(language >= 0 && language < site && site < strategy && strategy < zone && zone < plan && plan < condition && condition < payment);
  assert(/<select id="sede"/.test(html));
  assert(/id="zona" type="hidden"/.test(html));
  assert(/id="zone-information"[^>]*hidden/.test(html));
  assert(!/<input id="sede"/.test(html));
});

test("al iniciar solo Idioma participa en el formulario progresivo", function () {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  assert(/id="progressive-field-language"[^>]*data-progressive-step="1"/.test(html));
  [2, 3, 4, 5, 6].forEach(function (step) {
    assert(new RegExp('data-progressive-step="' + step + '"[^>]*hidden').test(html), "Paso inicial no oculto: " + step);
  });
  assert(/<option value="" selected disabled>Selecciona un idioma<\/option>/.test(html));
  assert(/elements\.idioma\.value = ""/.test(app));
  assert(/function updateProgressiveForm\(focusStep\)/.test(app));
});

test("el formulario progresivo limpia dependencias y enfoca el paso siguiente", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var languageHandler = app.slice(app.indexOf("function handleLanguageChange"), app.indexOf("function handleSiteChange"));
  var siteHandler = app.slice(app.indexOf("function handleSiteChange"), app.indexOf("function handlePlanChange"));
  assert(/populateSites\(""\)/.test(languageHandler));
  assert(/populateTariffModels\(""\)/.test(languageHandler));
  assert(/resetDependentTariffSelectors\(\)/.test(languageHandler));
  assert(/updateProgressiveForm\(2\)/.test(languageHandler));
  assert(/populateTariffModels\(""\)/.test(siteHandler));
  assert(/updateProgressiveForm\(context\.valid \? 3 : null\)/.test(siteHandler));
  assert(/focusSelect\.focus\(\)/.test(app));
});

test("el selector progresivo muestra solo sedes habilitadas por idioma", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var sitesPopulation = app.slice(app.indexOf("function populateSites"), app.indexOf("var progressiveFocusTimer"));
  assert(/language === "INGLES" && site\.ingles_habilitado/.test(sitesPopulation));
  assert(/language === "FRANCES" && site\.frances_habilitado/.test(sitesPopulation));
  assert(sitesPopulation.indexOf("No habilitada para francés") < 0);
});

test("la disponibilidad se valida centralmente antes de las salidas", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  assert(/function findSelectedTariff\(\)[\s\S]*?currentCommercialContext/.test(app));
  assert(/function generateQuote\(\)[\s\S]*?ensureCommercialAvailability\(true\)/.test(app));
  assert(/function ensureCurrentQuote\(\)[\s\S]*?ensureCommercialAvailability\(true\)/.test(app));
  assert(/function showClientView\(\)[\s\S]*?ensureCommercialAvailability\(true\)/.test(app));
  assert(/async function preparePrintDocument\(session\)[\s\S]*?ensureCurrentQuote\(\)/.test(app));
  assert(/function copySummary\(forWhatsApp\)[\s\S]*?ensureCurrentQuote\(\)/.test(app));
});

test("resumen comercial identifica dinámicamente idioma y sede", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  assert(app.indexOf('"SMART – COTIZACIÓN PERSONALIZADA"') >= 0);
  assert(/currentLanguageName\(\)\.toUpperCase\(\) \+ " INSTITUTO"/.test(app));
  assert(/"Sede: " \+ currentSiteName\(\)/.test(app));
});

test("interfaz separa adicionales, ahorro académico y contrato", function () {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  assert(/id="advisor-additional-section"/.test(html));
  assert(/id="client-additionals-section"[^>]*hidden/.test(html));
  assert(html.indexOf("ADICIONALES BONIFICADOS POR MATRÍCULA OPORTUNA") >= 0);
  assert(html.indexOf("Valor final de la cotización") >= 0);
  assert(html.indexOf("Valor comercial de adicionales bonificados") >= 0);
  assert(/snapshots\.length === 0/.test(app));
  assert(/totalConfigured = sumAdditionalCommercialValues\(activeValues\)/.test(app));
  assert(!/ahorro[^\n]*activeValues|activeValues[^\n]*ahorro/i.test(app), "Los adicionales no deben mezclarse con el ahorro académico");
});

test("orden visual del cliente sigue la nueva jerarquía comercial", function () {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var order = [
    "class=\"client-program\"",
    "class=\"client-payment-summary\"",
    "class=\"client-price-grid\"",
    "id=\"client-additionals-section\"",
    "id=\"client-additionals-total-section\"",
    "class=\"client-schedule\""
  ].map(function (marker) { return html.indexOf(marker); });
  order.forEach(function (position) { assert(position >= 0); });
  order.slice(1).forEach(function (position, index) {
    assert(position > order[index], "Orden comercial incorrecto");
  });
  assert(app.indexOf('"HOY PAGAS"') >= 0);
  assert(html.indexOf("Y LUEGO") >= 0);
  assert(html.indexOf("PAGO ÚNICO") >= 0);
  assert(/class="client-price-card client-contract-total finance-only"/.test(html));
  assert(!/<section class="client-contract-total/.test(html), "El total contractual no debe ser un bloque duplicado");
});

test("jerarquía económica elimina el gran fondo rojo del total contractual", function () {
  var css = fs.readFileSync(path.join(__dirname, "estilos.css"), "utf8");
  var totalRule = css.slice(css.indexOf(".total-hero {"), css.indexOf(".payment-highlight {"));
  assert(/background:\s*#f7f8fa/.test(totalRule));
  assert(/border-left:\s*5px solid var\(--smart-red\)/.test(totalRule));
  assert(!/background:\s*var\(--smart-red\)/.test(totalRule));
  assert(/text-decoration:\s*line-through var\(--smart-red\)/.test(css));
  assert(/\.savings[\s\S]*?background:\s*var\(--success-soft\)/.test(css));
});

test("precios de adicionales no están hardcodeados en aplicacion.js", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  var css = fs.readFileSync(path.join(__dirname, "estilos.css"), "utf8");
  [243000, 480000, 999000].forEach(function (value) {
    assert(!new RegExp("\\b" + value + "\\b").test(app), "Precio hardcodeado en aplicacion.js: " + value);
    assert(!new RegExp("\\b" + value + "\\b").test(html), "Precio hardcodeado en index.html: " + value);
    assert(!new RegExp("\\b" + value + "\\b").test(css), "Precio hardcodeado en estilos.css: " + value);
  });
  assert(/global\.SMART_ADICIONALES/.test(app));
  assert(/global\.SMART_CAMPANAS_ADICIONALES/.test(app));
});

test("no existe ninguna alerta visual ni texto de precio incompleto", function () {
  var content = ["index.html", "aplicacion.js", "estilos.css"].map(function (file) {
    return fs.readFileSync(path.join(__dirname, file), "utf8");
  }).join("\n");
  ["precio pendiente", "valor pendiente", "sin precio configurado", "alerta administrativa", "configuración incompleta", "additional-admin-alert", "additional-pending-price"].forEach(function (text) {
    assert(content.toLowerCase().indexOf(text) < 0, "Se encontró texto no permitido: " + text);
  });
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var catalogValidation = app.slice(app.indexOf("function showCatalogValidation"), app.indexOf("function ensureCommercialAvailability"));
  assert(/global\.SMART_CONFIG_DIAGNOSTICS/.test(app));
  assert(!/visibleErrors = visibleErrors\.concat\(additionalValidation/.test(catalogValidation));
  assert(!/visibleErrors = visibleErrors\.concat\(campaignValidation/.test(catalogValidation));
});

test("cliente, impresión y WhatsApp usan las etiquetas comerciales de cada adicional", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  assert(/value\.textContent = snapshot\.valueLabel \+ ": " \+ formatCOP\(snapshot\.valueCop\)/.test(app));
  assert(/lines\.push\("  " \+ additional\.valueLabel \+ ": " \+ formatCOP\(additional\.valueCop\)\)/.test(app));
  assert(/"#client-view #client-additionals-section"/.test(app));
  assert(/"#client-view #client-additionals-total-section"/.test(app));
  assert(app.indexOf("Estos adicionales no modifican el valor final de la cotización.") >= 0);
  assert(app.indexOf("Valor referencial calculado con base en una clase de 90 minutos") < 0, "La aclaración debe provenir de configuracion_adicionales.js");
});

test("selección permite ninguno, uno, varios y paquete aplicable sin opciones libres", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  assert(/selectedAdditionalIds = new Set\(\)/.test(app));
  assert(/selectedAdditionalIds\.add\(additional\.adicional_id\)/.test(app));
  assert(/selectedAdditionalIds\.delete\(checkbox\.dataset\.additionalId\)/.test(app));
  assert(/applicableAdditionals\(\)\.forEach[\s\S]*?selectedAdditionalIds\.add/.test(app));
  assert(/id="paquete-completo-adicionales"/.test(html));
  assert(/select\.add\(new Option\("Selecciona una opción autorizada"/.test(app));
  assert(app.indexOf("prompt(") < 0, "No debe existir captura libre de cursos");
});

test("la interfaz elimina por completo la inclusión excepcional visible", function () {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var visibleSource = (html + "\n" + app).toLowerCase();
  assert(visibleSource.indexOf("solicitar inclusión excepcional") < 0);
  assert(visibleSource.indexOf("btn-solicitar-autorizacion") < 0);
  assert(visibleSource.indexOf("authorization-dialog") < 0);
  assert(visibleSource.indexOf("openauthorizationdialog") < 0);
  assert(visibleSource.indexOf("saveexceptionalauthorization") < 0);
});

test("las cuatro tarjetas del asesor comparten una única estructura vertical", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var css = fs.readFileSync(path.join(__dirname, "estilos.css"), "utf8");
  assert(/copy\.className = "additional-option-copy"/.test(app));
  assert(/copy\.appendChild\(description\)[\s\S]*?copy\.appendChild\(valueText\)/.test(app));
  assert(/copy\.appendChild\(selectedStatus\)/.test(app));
  assert(/copy\.appendChild\(referenceNote\)/.test(app));
  assert(/label\.appendChild\(checkbox\)[\s\S]*?label\.appendChild\(copy\)/.test(app));
  assert(/\.additional-option-card\s*\{[\s\S]*?display:\s*block/.test(css));
  assert(/\.additional-option-label\s*\{[\s\S]*?grid-template-columns:\s*auto minmax\(0, 1fr\)/.test(css));
  assert(!/\.additional-option-card\s*\{[\s\S]{0,160}?justify-content:\s*space-between/.test(css));
});

test("Clubes usa la misma composición y la nota discreta aprobada", function () {
  var clubs = adicionales.find(function (item) { return item.adicional_id === "CLUBES_CONVERSACION_ILIMITADOS"; });
  var config = fs.readFileSync(path.join(__dirname, "configuracion_adicionales.js"), "utf8");
  var css = fs.readFileSync(path.join(__dirname, "estilos.css"), "utf8");
  equal(clubs.descripcion_cliente, "Acceso ilimitado a clubes de conversación durante la vigencia del contrato, conforme a la programación y disponibilidad académica.");
  equal(clubs.aclaracion_valor_cliente, "Referencia calculada con base en una clase de 90 minutos y el valor por hora de lista del programa.");
  assert(config.indexOf("VALOR_EQUIVALENTE_CLASE") >= 0);
  assert(/\.additional-reference-note\s*\{[\s\S]*?font-size:\s*0\.72rem/.test(css));
  assert(/\.print-sheet \.client-additional-reference-note\s*\{[\s\S]*?color:\s*#626670/.test(css));
});

test("cambio de fechas marca la propuesta modificada y exige regenerarla", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  ["fecha-acreditacion-pago-inicial-estimada", "fecha-primera-cuota"].forEach(function (id) {
    var expression = new RegExp("elements\\[\\\"" + id + "\\\"\\]\\.addEventListener\\(\\\"change\\\"[\\s\\S]{0,260}?markModified\\(\\)");
    assert(expression.test(app), "La fecha " + id + " no invalida la cotización");
  });
  assert(/elements\["fecha-matricula"\]\.addEventListener\("change", handleEnrollmentChange\)/.test(app));
  assert(/function handleEnrollmentChange\(\)[\s\S]*?markModified\(\)/.test(app));
  assert(/quote\.status = "MODIFICADA"/.test(app));
  assert(/quote\.reference = null/.test(app));
});

test("cliente, impresión y WhatsApp identifican el plan como proyectado", function () {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  assert(html.indexOf("PLAN DE PAGOS PROYECTADO") >= 0);
  assert(/PROJECTED_PAYMENT_DISCLAIMER/.test(app));
  assert(/PROJECTED_PAYMENT_DISCLAIMER_SHORT/.test(app));
  assert(/headingTitle\.textContent = groupIndex === 0 \? "Plan de pagos proyectado"/.test(app));
  assert(/Fecha estimada de confirmación del pago inicial/.test(app));
  assert(/Las fechas del plan son proyectadas/.test(app));
});

test("vencimiento de bonificaciones muestra el texto aprobado y bloquea salidas", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  assert(app.indexOf("La vigencia de estas bonificaciones finalizó") >= 0);
  assert(/bonusExpired = \(quote\.additionalSnapshot \|\| \[\]\)\.some/.test(app));
  assert(/quoteExpired \|\| bonusExpired/.test(app));
  assert(/promotionExpired && selectedAdditionalIds\.size/.test(app));
  assert(app.indexOf("Las bonificaciones vencidas no se reinician automáticamente.") >= 0);
  assert(/quote\.status === "VENCIDA"/.test(app));
  assert(/button\.disabled = quote\.status !== "VIGENTE"/.test(app));
  assert(/function ensureCurrentQuote\(\)[\s\S]*?quote\.status !== "VIGENTE"/.test(app));
});

test("WhatsApp y resumen contienen solo adicionales seleccionados y su aclaración contractual", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var summaryStart = app.indexOf("function quoteSummary");
  var summaryEnd = app.indexOf("function fallbackCopy", summaryStart);
  var summary = app.slice(summaryStart, summaryEnd);
  assert(/quote\.additionalSnapshot\.forEach/.test(summary));
  assert(summary.indexOf("Valor comercial de adicionales bonificados:") >= 0);
  assert(summary.indexOf("Estos adicionales no modifican el valor final de la cotización.") >= 0);
  assert(summary.toLowerCase().indexOf("autorización") < 0);
  assert(summary.toLowerCase().indexOf("alerta") < 0);
});

test("la impresión prioriza el resumen económico antes de los adicionales", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var priorityStart = app.indexOf("PRINT_PRIORITY_SUMMARY_SELECTORS");
  var postBonusesStart = app.indexOf("PRINT_POST_BONUSES_SELECTORS");
  var priority = app.slice(priorityStart, postBonusesStart);
  assert(priority.indexOf(".client-header") < priority.indexOf(".client-program"));
  assert(priority.indexOf(".client-program") < priority.indexOf(".client-payment-summary"));
  assert(priority.indexOf(".client-payment-summary") < priority.indexOf(".client-price-grid"));
  assert(postBonusesStart > priorityStart);
  assert(/printBonusFirstPageOptions\(pageCount\)/.test(app));
  assert(/createPrintBonusesBlock\(bonusFirstPageCount, remainingBonusCards[\s\S]*?appendPrintPostBonuses\(sheet\)/.test(app));
});

test("la impresión impide cuotas antes de los adicionales cuando estos pasan a otra página", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  assert(core.printDistributionRespectsSectionOrder([0, 13, 13], 2, 4));
  assert(core.printDistributionRespectsSectionOrder([9, 9], 4, 4));
  assert(!core.printDistributionRespectsSectionOrder([2, 12, 12], 2, 4));
  assert(core.printDistributionRespectsSectionOrder([3, 12], 0, 0));
  assert(!core.printDistributionRespectsSectionOrder([0, 15], 0, 0), "Sin beneficios el calendario debe comenzar en la primera página");
  equal(core.printDistributionBalancePenalty([0, 13, 13]), 0, "La página de resumen sin calendario no altera el equilibrio de las páginas con pagos");
  assert(/!printDistributionRespectsSectionOrder\(distribution, bonusFirstPageCount, totalBonusCards\)[\s\S]*?return \[\]/.test(app));
  assert(/var options = \[totalCards\]/.test(app));
  assert(/options\.push\(0\)/.test(app));
  assert(!/totalCards === 4 && count < 2/.test(app), "No debe omitir combinaciones de tarjetas completas");
  assert(app.indexOf("No fue posible organizar correctamente la cotización. Reintenta la impresión.") >= 0);
});

test("la secuencia semántica de impresión es explícita e inmutable", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var sequenceStart = app.indexOf("PRINT_SEMANTIC_SEQUENCE");
  var sequenceEnd = app.indexOf("PRINT_BLOCK_TOKEN_BY_SELECTOR", sequenceStart);
  var sequence = app.slice(sequenceStart, sequenceEnd);
  [
    "HEADER", "CLIENT", "PROGRAM", "PAYMENT_HIGHLIGHT", "ECONOMIC_SUMMARY",
    "BONUSES", "BONUSES_TOTAL", "MONTHLY_REDUCTION_MESSAGE", "PAYMENT_CALENDAR",
    "FINAL_TOTAL", "VALIDITY", "LEGAL_NOTES"
  ].reduce(function (previous, token) {
    var index = sequence.indexOf('"' + token + '"');
    assert(index > previous, "Orden inválido para " + token);
    return index;
  }, -1);
  assert(/validatePrintSemanticOrder\(session\)/.test(app));
  assert(/bonusesBeforeCalendar/.test(app));
  assert(/rowsContinuous/.test(app));
  assert(/totalOnlyAfterLastPayment/.test(app));
});

test("cada impresión usa una sesión nueva y una limpieza central idempotente", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var identifiers = [1, 2, 3].map(function (counter) {
    return core.createPrintSessionIdentifier(1785261600000, counter);
  });
  equal(new Set(identifiers).size, 3);
  assert(/function cleanupPrintSession\(reason\)/.test(app));
  assert(/document\.querySelectorAll\("\[data-print-root\], \.print-measure-root, \.print-pages-temporary"\)/.test(app));
  assert(/function createFreshPrintSession\(\)[\s\S]*?cleanupPrintSession\("antes_de_nueva_sesion"\)/.test(app));
  assert(/root\.dataset\.printRoot = ""/.test(app));
  assert(/isPrinting = true/.test(app));
  assert(/isPrinting = false/.test(app));
  assert(/global\.addEventListener\("afterprint"[\s\S]*?cleanupPrintSession\("afterprint"\)/.test(app));
  assert(/finally[\s\S]*?schedulePrintCleanupFallback\(session\.id\)/.test(app));
  assert(app.indexOf('global.addEventListener("beforeprint"') < 0, "No debe existir preparación asíncrona competidora en beforeprint");
});

test("la impresión bloquea una salida sin valor contractual completo", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var css = fs.readFileSync(path.join(__dirname, "estilos.css"), "utf8");
  assert(/contractValue\.textContent\.trim\(\) === expectedContractValue/.test(app));
  assert(/if \(hasOverflow \|\| !contractVisible\)/.test(app));
  assert(app.indexOf("No fue posible generar correctamente el resumen económico. Reintenta la impresión.") >= 0);
  assert(/\.print-sheet \.client-contract-total[\s\S]*?page-break-inside:\s*avoid/.test(css));
});

test("diagnósticos de impresión incluyen páginas, alturas, bloques y valor contractual", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  ["sesionImpresionId", "numeroImpresionConsecutiva", "temporalesEncontradosAntes", "temporalesEliminadosAntes", "temporalesEncontradosAlFinalizar", "temporalesEliminadosAlFinalizar", "paginas", "filasPorPagina", "alturaUtilizadaMm", "espacioLibreMm", "porcentajeLibre", "porcentajeLibrePrimeraPagina", "beneficiosPorPagina", "bloquesIncluidos", "ordenBloques", "paginaInicioCalendario", "paginaAdicionales", "primeraFilaCalendario", "ultimaFilaCalendario", "paginaValorContractual", "valorContractualVisible", "limpiezaCompletada", "isPrintingAlFinalizar"].forEach(function (field) {
    assert(new RegExp("\\b" + field + "\\s*:").test(app), "Falta diagnóstico " + field);
  });
});

test("valor contractual se valida dentro de la sesión definitiva sin IDs duplicados", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var css = fs.readFileSync(path.join(__dirname, "estilos.css"), "utf8");
  assert(/stripPrintCloneIdentifiers/.test(app));
  assert(/session\.root\.querySelector\('\[data-print-role="contract-total-block"\]'\)/.test(app));
  assert(/contractBlock\.dataset\.printRole = "contract-total-block"/.test(app));
  assert(/data\.printRole = "contract-total-title"|dataset\.printRole = "contract-total-title"/.test(app));
  assert(/data\.printRole = "contract-total-value"|dataset\.printRole = "contract-total-value"/.test(app));
  assert(/getBoundingClientRect\(\)/.test(app));
  assert(/getComputedStyle\(block\)/.test(app));
  assert(/\.print-document\.is-measuring[\s\S]*?left:\s*-100000px[\s\S]*?display:\s*block/.test(css));
  assert(!/\.print-document\.is-measuring[\s\S]*?visibility:\s*hidden/.test(css));
});

test("regresión Modelia cinco niveles veintiséis pagos conserva cuotas y adicionales", function () {
  var tariff = findTariff(["CUND_ANT", "ING_INST_A1_A2_B1_B2_C1", "PRECIO_AL_PUBLICO", 26], "INGLES");
  assert(tariff, "No se encontró la tarifa de cinco niveles y 26 pagos");
  var plan = standardPlan(tariff, 600000);
  assert(plan.valid, "La cuota inicial de la regresión debe ser válida");
  equal(plan.rows.length, 26);
  plan.rows.forEach(function (row, index) { equal(row.number, index + 1); });
  equal(plan.rows[25].balanceAfterCop, 0);
  equal(plan.differenceCop, 0);
  var context = additionalContext({
    planId: tariff.plan_id,
    numberOfLevels: tariff.numero_niveles,
    fullListCop: tariff.valor_full_oficial_cop,
    academicHours: tariff.horas_academicas,
    conditionId: tariff.condicion_id,
    paymentCount: tariff.numero_pagos
  });
  var values = adicionales.map(function (additional) {
    return core.calculateAdditionalCommercialValue(additional, context, "");
  });
  equal(values.length, 4);
  assert(values.every(function (value) { return value.configured && value.valueCop > 0; }));
  var orderedCandidates = core.generatePrintDistributions(26, 3).filter(function (distribution) {
    return core.printDistributionRespectsSectionOrder(distribution, 2, 4);
  });
  assert(orderedCandidates.length > 0);
  assert(orderedCandidates.every(function (distribution) { return distribution[0] === 0; }));
  assert(orderedCandidates.some(function (distribution) { return Math.abs(distribution[1] - distribution[2]) <= 3; }));
});

test("regresión Inglés tres niveles veinte pagos con cuatro adicionales", function () {
  var tariff = findTariff(["REGIONALES", "ING_INST_A1_A2_B1", "PRECIO_AL_PUBLICO", 20], "INGLES");
  assert(tariff, "No se encontró la tarifa de regresión");
  var plan = standardPlan(tariff, 500000);
  assert(plan.valid);
  equal(plan.rows.length, 20);
  equal(plan.rows[plan.rows.length - 1].balanceAfterCop, 0);
  equal(plan.differenceCop, 0);
  var context = additionalContext({
    planId: tariff.plan_id,
    numberOfLevels: tariff.numero_niveles,
    fullListCop: tariff.valor_full_oficial_cop,
    academicHours: tariff.horas_academicas,
    conditionId: tariff.condicion_id,
    paymentCount: tariff.numero_pagos
  });
  var values = adicionales.map(function (additional) {
    return core.calculateAdditionalCommercialValue(additional, context, "");
  });
  equal(values.length, 4);
  assert(values.every(function (value) { return value.configured && value.valueCop > 0; }));
  equal(tariff.valor_total_oficial_cop, plan.sumPaymentsCop);
  assert(core.generatePrintDistributions(20, 3).length > 0, "No existen candidatos de tres páginas");
});

test("impresión admite distribuciones dinámicas para todos los planes requeridos", function () {
  [1, 6, 12, 14, 18, 20, 24, 26].forEach(function (paymentCount) {
    var tariff = tarifas.find(function (item) { return item.numero_pagos === paymentCount; });
    assert(tariff, "No existe tarifa de " + paymentCount + " pagos");
    var plan = standardPlan(tariff, tariff.numero_pagos === 1 ? tariff.valor_total_oficial_cop : tariff.cuota_inicial_minima_cop);
    assert(plan.valid);
    deepEqual(core.generatePrintDistributions(paymentCount, 1), [[paymentCount]]);
    var pageCount = paymentCount >= 6 ? 2 : 1;
    core.generatePrintDistributions(paymentCount, pageCount).forEach(function (distribution) {
      equal(distribution.reduce(function (sum, count) { return sum + count; }, 0), paymentCount);
      distribution.forEach(function (count, index) {
        assert(count >= 3 || paymentCount < 3 || (index === 0 && count === 0), "Bloque con título huérfano");
      });
    });
    equal(plan.rows[plan.rows.length - 1].balanceAfterCop, 0);
    equal(plan.differenceCop, 0);
  });
});

test("impresión francesa conserva 1, 6, 14, 20 y 24 pagos completos", function () {
  [
    ["FRA_INST_A1", 1],
    ["FRA_INST_A1", 6],
    ["FRA_INST_A1_A2", 14],
    ["FRA_INST_A1_A2_B1", 20],
    ["FRA_INST_A1_A2_B1_B2", 24]
  ].forEach(function (choice) {
    var tariff = findTariff(["CUND_ANT", choice[0], "PREVENTA_ESPECIAL", choice[1]], "FRANCES");
    var initial = tariff.numero_pagos === 1 ? tariff.valor_total_oficial_cop : tariff.cuota_inicial_minima_cop;
    var plan = standardPlan(tariff, initial);
    assert(plan.valid);
    equal(plan.rows.length, choice[1]);
    equal(plan.rows[plan.rows.length - 1].balanceAfterCop, 0);
    equal(plan.differenceCop, 0);
    assert(core.generatePrintDistributions(choice[1], choice[1] <= 6 ? 1 : 2).length > 0);
  });
});

test("6 pagos tienen candidato de una página y 18 pagos pueden reequilibrarse", function () {
  deepEqual(core.generatePrintDistributions(6, 1), [[6]]);
  var distributions18 = core.generatePrintDistributions(18, 2);
  assert(distributions18.some(function (distribution) { return distribution[0] === 9 && distribution[1] === 9; }));
  assert(distributions18.some(function (distribution) { return distribution[0] > 4; }), "No existen alternativas que aprovechen la primera página");
});

test("18 pagos rechazan distribuciones extremas cuando existen alternativas equilibradas", function () {
  [[9, 9], [8, 10], [10, 8]].forEach(function (distribution) {
    equal(core.printDistributionBalancePenalty(distribution), 0, "Debe aceptar " + distribution.join("+"));
  });
  [[3, 15], [4, 14], [2, 16], [15, 3]].forEach(function (distribution) {
    assert(core.printDistributionBalancePenalty(distribution) > 0, "Debe penalizar " + distribution.join("+"));
  });
});

test("paginación usa medición real y no capacidades fijas", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  assert(/getBoundingClientRect\(\)/.test(app));
  assert(/sheet\.scrollHeight > sheet\.clientHeight/.test(app));
  assert(/document\.fonts && document\.fonts\.ready/.test(app));
  assert(/\.then\(waitForNextPrintFrame\)/.test(app));
  assert(/safetyReserveMm:\s*5/.test(app));
  assert(/rowHeightsMm/.test(app));
  assert(/closingHeightMm/.test(app));
  assert(/rebalanceMeasuredCandidate/.test(app));
  assert(/await measurePrintDistribution\(session, proposal, current\.bonusFirstPageCount\)/.test(app));
  assert(/candidateDiagnostics/.test(app));
  assert(/rememberPrintCandidate/.test(app));
  assert(/maximumFirstPageBonuses/.test(app));
  assert(/emptyPercent/.test(app));
  assert(/intermediateEmpty/.test(app));
  assert(/metric\.emptyRatio - 0\.30/.test(app));
  assert(/finalMovableEmpty/.test(app));
  assert(/occupationDifference/.test(app));
  assert(/generatePrintDistributions/.test(app));
  assert(/pruneEmptyPrintNodes\(container, session\)/.test(app));
  assert(/root\.querySelectorAll\("\[hidden\]"\)/.test(app));
  assert(/totalCards === 0[\s\S]*?distribution\[0\] > 0/.test(app));
  assert(app.indexOf("Se eligió la distribución medida con menor número de páginas y mejor aprovechamiento global") >= 0);
  assert(app.indexOf("finalPrintPageCapacity") < 0);
  assert(app.indexOf("splitPaymentRowsForPrint") < 0);
});

test("documento de impresión usa A4 sin márgenes y margen interno propio", function () {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  var css = fs.readFileSync(path.join(__dirname, "estilos.css"), "utf8");
  assert(/id="print-document"/.test(html));
  assert(/@page\s*\{[\s\S]*?size:\s*A4 portrait;[\s\S]*?margin:\s*0;/i.test(css));
  assert(/\.print-sheet\s*\{[\s\S]*?width:\s*210mm;[\s\S]*?height:\s*297mm;[\s\S]*?padding:\s*9mm 9\.5mm;/i.test(css));
  assert(/\.print-schedule-page\s*\{[\s\S]*?padding:\s*9mm 9\.5mm;/i.test(css));
  assert(/page-break-after:\s*always/.test(css));
  assert(/page-break-inside:\s*avoid/.test(css));
  assert(/print-color-adjust:\s*exact/.test(css));
});

test("diagnóstico registra puntuaciones, ocupación, beneficios y distribución elegida", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  [
    "porcentajeUtilizado", "beneficiosUbicadosPorPagina", "distribucionesCandidatasEvaluadas",
    "cantidadDistribucionesCandidatasEvaluadas", "distribucionSeleccionada",
    "razonesEspacioVacioSuperiorAlLimite", "valorContractualVisible", "limpiezaCompletada",
    "cantidadBeneficios", "bloquesOmitidosPorEstarVacios", "desbordamientosDetectados", "paginaInicioCalendario"
  ].forEach(function (field) {
    assert(app.indexOf(field) >= 0, "Falta diagnóstico: " + field);
  });
  assert(/puntuacion:\s*overflow \? null/.test(app));
  assert(/diagnostic\.estado = "SELECCIONADA"/.test(app));
});

test("transición progresiva es accesible, adaptable y respeta movimiento reducido", function () {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  var css = fs.readFileSync(path.join(__dirname, "estilos.css"), "utf8");
  assert(/id="progressive-step-indicator"/.test(html));
  assert(/aria-live="polite"/.test(html));
  assert(/\.progressive-field\.is-entering/.test(css));
  assert(/@media \(prefers-reduced-motion: reduce\)/.test(css));
  assert(/@media \(max-width: 760px\)[\s\S]*?\.progressive-zone-information/.test(css));
});

test("aviso previo contiene toda la configuración oficial", function () {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  [
    "Papel:</strong> A4",
    "Orientación:</strong> Vertical",
    "Márgenes:</strong> Ninguno",
    "Escala:</strong> 100 % o Predeterminada",
    "Páginas por hoja:</strong> 1",
    "Encabezados y pies de página:</strong> Desactivados",
    "Gráficos de fondo:</strong> Activados",
    "Continuar e imprimir",
    "Cancelar",
    "file:///"
  ].forEach(function (text) {
    assert(html.indexOf(text) >= 0, "Falta indicación: " + text);
  });
});

test("total y cierre se generan solo después del último bloque", function () {
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var scheduleStart = app.indexOf("function createPrintSchedule");
  var scheduleEnd = app.indexOf("function createPrintClosingCluster");
  var scheduleCode = app.slice(scheduleStart, scheduleEnd);
  assert(scheduleStart >= 0 && scheduleEnd > scheduleStart, "No se localizaron las funciones de impresión");
  assert(scheduleCode.indexOf("tfoot") < 0, "La tabla exclusiva no debe usar un pie repetible");
  assert(/if \(pageIndex === totalPages - 1\)[\s\S]*?createPrintClosingCluster/.test(app), "El cierre no está condicionado al último bloque");
  assert(/print-schedule-table thead[\s\S]*?display:\s*table-header-group/.test(fs.readFileSync(path.join(__dirname, "estilos.css"), "utf8")), "El encabezado de columnas no está configurado para repetición");
});

test("la puntuación no duplica el punto de a. m. o p. m.", function () {
  equal(core.ensureFinalPeriod("Válida hasta las 5:30 p. m."), "Válida hasta las 5:30 p. m.");
  equal(core.ensureFinalPeriod("Válida hasta las 8:15 a. m."), "Válida hasta las 8:15 a. m.");
  equal(core.ensureFinalPeriod("Válida durante 48 horas"), "Válida durante 48 horas.");
});

test("catálogo de jefes contiene veinte registros válidos y el correo confirmado de Jhon Fredi", function () {
  equal(jefesVentas.length, 20);
  assert(validacionJefesVentas.valida, (validacionJefesVentas.errores || []).join(" "));
  equal(validacionJefesVentas.resumen.correosUnicos, 20);
  var jhon = jefesVentas.find(function (item) { return item.nombre === "Jhon Fredi Castellanos López"; });
  assert(jhon);
  equal(jhon.correo, "jhon.castellanos@smartidiomas.edu.co");
  assert(jefesVentas.every(function (item) {
    return item.id && item.nombre && item.grupo && item.activo && item.estado_validacion === "CONFIRMADO" &&
      Array.isArray(item.sedes_o_regiones) && /^[^\s@]+@smartidiomas\.edu\.co$/i.test(item.correo);
  }));
});

test("fecha de matrícula habilita solo hoy y los dos días siguientes en Bogotá", function () {
  var generated = new Date("2026-08-06T02:39:00.000Z");
  deepEqual(core.enabledEnrollmentDates(generated), ["2026-08-05", "2026-08-06", "2026-08-07"]);
  assert(!core.isEnabledEnrollmentDate("2026-08-04", generated));
  assert(core.isEnabledEnrollmentDate("2026-08-05", generated));
  assert(core.isEnabledEnrollmentDate("2026-08-06", generated));
  assert(core.isEnabledEnrollmentDate("2026-08-07", generated));
  assert(!core.isEnabledEnrollmentDate("2026-08-08", generated));
});

test("vencimiento usa fin del día seleccionado sin superar cuarenta y ocho horas", function () {
  var generated = new Date("2026-08-06T02:39:00.000Z");
  equal(core.calculateQuoteExpiration(generated, "2026-08-05").toISOString(), "2026-08-06T04:59:59.000Z");
  equal(core.calculateQuoteExpiration(generated, "2026-08-06").toISOString(), "2026-08-07T04:59:59.000Z");
  equal(core.calculateQuoteExpiration(generated, "2026-08-07").toISOString(), "2026-08-08T02:39:00.000Z");
  assert(core.calculateQuoteExpiration(generated, "2026-08-08") === null);
  ["2026-08-05", "2026-08-06", "2026-08-07"].forEach(function (date) {
    assert(core.calculateQuoteExpiration(generated, date).getTime() - generated.getTime() <= 48 * 3600000);
  });
});

test("cuota negociada conserva mínimo interno sin exponerlo y exige contado cuando iguala el total", function () {
  var tariff = findTariff(["CUND_ANT", "ING_INST_A1_A2_B1", "PRECIO_AL_PUBLICO", 20]);
  var below = standardPlan(tariff, tariff.cuota_inicial_minima_cop - 1);
  assert(!below.valid);
  equal(below.errors[0], "El valor ingresado no cumple las condiciones autorizadas para esta alternativa de pago. Revisa la cuota inicial propuesta.");
  assert(below.errors[0].indexOf(String(tariff.cuota_inicial_minima_cop)) < 0);
  var equalTotal = standardPlan(tariff, tariff.valor_total_oficial_cop);
  assert(!equalTotal.valid && equalTotal.errors[0].indexOf("contado autorizada") >= 0);
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  assert(html.indexOf("Cuota inicial mínima") < 0 && html.indexOf("btn-restablecer-cuota") < 0);
  assert(/function handlePaymentChange\(\)[\s\S]*?synchronizeTariff\(true\)/.test(app));
  assert(/if \(resetInitial\) \{\s*setMoneyInput\(""\)/.test(app));
  assert(app.indexOf("Con una cuota inicial de ") >= 0);
  assert(app.indexOf("Al aumentar tu cuota inicial") < 0);
});

test("jefe se selecciona por regional, es obligatorio y Gmail conserva BCC", function () {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  var css = fs.readFileSync(path.join(__dirname, "estilos.css"), "utf8");
  assert(/id="jefe-ventas-regional"/.test(html) && /id="jefe-ventas"/.test(html));
  assert(!/id="jefe-ventas-buscar"/.test(html));
  assert(/new Option\(manager\.nombre, manager\.id\)/.test(app));
  assert(!/new Option\(manager\.nombre\s*\+[^\n]*manager\.correo/.test(app));
  assert(!/gmail-bcc-email|btn-copiar-correo-jefe/.test(html));
  assert(!/copySelectedManagerEmail|elements\["gmail-bcc-email"\]/.test(app));
  assert(/function ensureShareableQuote\(\)[\s\S]*?validateSalesManagerForSharing\(true\)/.test(app));
  assert(/manager\.grupo === selectedGroup/.test(app) && /localeCompare/.test(app));
  assert(/function selectedSalesManager\(\)[\s\S]*?manager\.grupo === selectedGroup/.test(app));
  assert(/jefe-ventas-regional"\]\.addEventListener\("change"[\s\S]*?populateSalesManagers\(""\)/.test(app));
  assert(/function salesManagerHasValidEmail\(manager\)/.test(app));
  assert(app.indexOf("No fue posible preparar el respaldo porque el jefe seleccionado no tiene un correo válido configurado.") >= 0);
  ["Bogotá / Cundinamarca", "Medellín / Antioquia", "Santander", "Barranquilla", "Cali", "Ibagué", "Manizales", "Pereira / Armenia", "Villavicencio", "Sincelejo"].forEach(function (label) {
    assert(app.indexOf(label) >= 0, "Falta agrupación comercial: " + label);
  });
  assert(app.indexOf('MANIZALES_PEREIRA: "Manizales / Pereira"') < 0);
  assert(app.indexOf('PEREIRA: "Pereira"') < 0);
  var groups = jefesVentas.reduce(function (result, manager) {
    result[manager.grupo] = (result[manager.grupo] || 0) + 1;
    return result;
  }, {});
  equal(Object.keys(groups).length, 10);
  equal(groups.CUNDINAMARCA, 8);
  equal(groups.MEDELLIN, 4);
  equal(groups.MANIZALES, 1);
  equal(groups.PEREIRA_ARMENIA, 1);
  var ena = jefesVentas.find(function (manager) { return manager.nombre === "Ena Lucía Mahecha"; });
  var david = jefesVentas.find(function (manager) { return manager.nombre === "David Tamayo"; });
  equal(ena.grupo, "MANIZALES");
  equal(ena.correo, "ena.mahecha@smartidiomas.edu.co");
  equal(david.grupo, "PEREIRA_ARMENIA");
  equal(david.correo, "brayan.tamayo@smartidiomas.edu.co");
  assert(/\.sales-manager-controls\s*\{[\s\S]*?grid-template-columns:\s*1fr/.test(css));
  assert(app.indexOf("Se preparará una copia oculta para ") >= 0);
  assert(/"Se preparará una copia oculta para " \+ manager\.nombre \+ "\."/.test(app));
  var url = new URL(core.buildGmailComposeUrl("cliente@correo.com", "Asunto", "Cuerpo", "jhon.castellanos@smartidiomas.edu.co"));
  equal(url.searchParams.get("to"), "cliente@correo.com");
  equal(url.searchParams.get("bcc"), "jhon.castellanos@smartidiomas.edu.co");
  equal(new URL(core.buildGmailComposeUrl("cliente@correo.com", "Asunto", "Cuerpo", ena.correo)).searchParams.get("bcc"), ena.correo);
  equal(new URL(core.buildGmailComposeUrl("cliente@correo.com", "Asunto", "Cuerpo", david.correo)).searchParams.get("bcc"), david.correo);
  var data = shareMessageData({ managerName: "Jhon Fredi Castellanos López", managerEmail: "jhon.castellanos@smartidiomas.edu.co" });
  assert(core.buildWhatsAppMessage(data).indexOf("Jhon Fredi") < 0);
  assert(core.buildEmailBody(data).indexOf("Jhon Fredi") < 0);
  assert(core.buildWhatsAppMessage(data).indexOf(data.managerEmail) < 0);
  assert(core.buildEmailBody(data).indexOf(data.managerEmail) < 0);
});

test("matrícula absorbe la vigencia y la interfaz conserva solo tres fechas", function () {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  equal((html.match(/type="date"/g) || []).length, 3);
  assert(/<span>Fecha de matrícula<\/span>/.test(html));
  assert(!/fecha-vigencia-cotizacion|Fecha de vigencia de la cotización/.test(html));
  assert(!/fecha-vigencia-cotizacion|validityDate|refreshValidityCalendar|validateValidityDate/.test(app));
  assert(/calculateQuoteExpiration\(now, elements\["fecha-matricula"\]\.value\)/.test(app));
  assert(/quote\.enrollmentDate = elements\["fecha-matricula"\]\.value/.test(app));
});

test("respaldo posterior a WhatsApp usa estados de sesión y correo interno autorizado", function () {
  var data = Object.assign(shareMessageData(), {
    managerName: "Jhon Fredi Castellanos López",
    managerEmail: "jhon.castellanos@smartidiomas.edu.co",
    clientPhoneFormatted: "+57 300 123 4567",
    clientEmail: "cliente@correo.com",
    languageName: "Inglés",
    expirationText: "7 de agosto de 2026, 9:39 p. m."
  });
  equal(core.buildManagerBackupSubject(data), "Respaldo de cotización Smart – SMART-20260804-1722-ABC – Ana María");
  var body = core.buildManagerBackupBody(data);
  ["Jhon Fredi Castellanos López", "WhatsApp", "Cuota inicial acordada:", "Referencia:", "Academia de Idiomas Smart"].forEach(function (text) {
    assert(body.indexOf(text) >= 0, "Falta en respaldo: " + text);
  });
  ["Plan tarifario interno", "Archivo de origen", "Fila de origen", "Diagnósticos"].forEach(function (text) {
    assert(body.indexOf(text) < 0, "Dato técnico expuesto: " + text);
  });
  var managerUrl = new URL(core.buildGmailComposeUrl(data.managerEmail, "Respaldo", body));
  equal(managerUrl.searchParams.get("to"), data.managerEmail);
  var app = fs.readFileSync(path.join(__dirname, "aplicacion.js"), "utf8");
  ["NO_PREPARADO", "WHATSAPP_ABIERTO", "CLIENTE_CONFIRMADO_ENVIADO", "RESPALDO_JEFE_PREPARADO", "RESPALDO_JEFE_CONFIRMADO_MANUALMENTE"].forEach(function (state) {
    assert(app.indexOf(state) >= 0, "Falta estado " + state);
  });
  assert(app.indexOf("No abrir Gmail") < 0 || app.indexOf("confirmWhatsAppDelivered") >= 0);
  assert(!/localStorage|sessionStorage|indexedDB|fetch\s*\(/i.test(app));
});

console.log("\nResultado: " + passed + " pruebas aprobadas, " + failed + " fallidas.");
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
}
