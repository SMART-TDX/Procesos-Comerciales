"use strict";
const fs = require("fs"), vm = require("vm"), path = require("path");
const raiz = path.resolve(__dirname, "..");
const contexto = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(raiz, "js", "tarifas.js"), "utf8"), contexto);
vm.runInNewContext(fs.readFileSync(path.join(raiz, "js", "plan-pagos.js"), "utf8"), contexto);
const catalogo = contexto.window.SMART_TARIFAS, motor = contexto.window.SmartPlanPagos;
function afirmar(condicion, mensaje) { if (!condicion) throw new Error(mensaje); }

afirmar(motor.diferenciaDias("2026-07-30", "2026-08-29") === 30, "Límite de 30 días incorrecto.");
afirmar(motor.diferenciaDias("2026-07-30", "2026-09-08") === 40, "Límite de 40 días incorrecto.");
afirmar(Boolean(motor.validarSegundaFecha("2026-07-30", "2026-08-28")), "Se aceptaron 29 días.");
afirmar(Boolean(motor.validarSegundaFecha("2026-07-30", "2026-09-09")), "Se aceptaron 41 días.");
afirmar(motor.fechaMensual("2027-01-30", 1) === "2027-02-28", "Mes corto no usa el último día.");
afirmar(motor.fechaMensual("2028-01-30", 1) === "2028-02-29", "Año bisiesto incorrecto.");
afirmar(motor.fechaMensual("2026-08-30", 1) === "2026-09-30" && motor.fechaMensual("2026-08-30", 2) === "2026-10-30", "No se conservó el día mensual.");

let casos = 0;
catalogo.registros.filter(r => r.formaPago === "FINANCIADO").forEach(r => {
  const minimo = Math.ceil(r.cuotaInicial);
  const iniciales = new Set([minimo, Math.min(r.valorTotal, minimo + Math.floor((r.valorTotal - minimo) / 2)), r.valorTotal]);
  let cuotaBase = null;
  iniciales.forEach(inicial => {
    const plan = motor.generarPlanPagos(r.valorTotal, inicial, r.cuotas, "2026-07-30", "2026-08-29");
    afirmar(plan.reduce((s, p) => s + motor.aCentavos(p.valor), 0) === motor.aCentavos(r.valorTotal), "Suma inexacta: " + r.id);
    afirmar(plan[0].valor === inicial, "Primera cuota alterada: " + r.id);
    afirmar(inicial === r.valorTotal ? plan.length === 1 : plan.length === r.cuotas, "Cantidad de pagos incorrecta: " + r.id);
    if (inicial === minimo && plan.length > 1) cuotaBase = plan[1].valor;
    if (inicial > minimo && inicial < r.valorTotal && plan.length > 1) afirmar(plan[1].valor <= cuotaBase, "El aumento inicial no redujo las cuotas: " + r.id);
    casos += 1;
  });
});
afirmar(catalogo.registros.filter(r => r.linea === "SMART_ONLINE").every(r => !r.nivelIngreso && !r.tipoTarifa && !r.horas), "Smart Online expone dimensiones incorrectas.");
afirmar(new Set(catalogo.registros.filter(r => r.linea === "SMART_FLEX").map(r => r.tipoTarifa)).size === 2, "Score/MP incompletos.");
afirmar(catalogo.registros.filter(r => r.tipoTarifa === "MP").every(r => r.condicion !== "Preventa"), "MP contiene Preventa.");
const especiales = catalogo.registros.filter(r => r.formaPago === "FINANCIADO" && !Number.isInteger(r.valorTotal));
afirmar(especiales.length === 3, "Cantidad inesperada de totales con centavos.");
especiales.forEach(r => {
  const plan = motor.generarPlanPagos(r.valorTotal, Math.ceil(r.cuotaInicial), r.cuotas, "2026-07-30", "2026-08-29");
  afirmar(plan.reduce((s, p) => s + motor.aCentavos(p.valor), 0) === motor.aCentavos(r.valorTotal), "Caso especial no reconcilia: " + r.id);
  afirmar(!Number.isInteger(plan.at(-1).valor), "Los centavos no quedaron en la cuota final: " + r.id);
  afirmar(plan.at(-1).tipo.includes("ajuste de cierre"), "Caso especial sin etiqueta de ajuste: " + r.id);
});
const caso20 = catalogo.registros.find(r => r.formaPago === "FINANCIADO" && r.cuotas === 20);
afirmar(Boolean(caso20), "No existe un caso oficial financiado a 20 cuotas.");
const plan20 = motor.generarPlanPagos(caso20.valorTotal, Math.ceil(caso20.cuotaInicial), caso20.cuotas, "2026-07-30", "2026-08-29");
afirmar(plan20.length === 20, "El caso de 20 cuotas no conserva su cantidad oficial.");
afirmar(plan20.reduce((s, p) => s + motor.aCentavos(p.valor), 0) === motor.aCentavos(caso20.valorTotal), "El caso de 20 cuotas no reconcilia.");
console.log(JSON.stringify({ resultado: "APROBADO", tarifas_financiadas: catalogo.registros.filter(r => r.formaPago === "FINANCIADO").length, planes_verificados: casos, caso_20_cuotas: caso20.id, casos_especiales_con_centavos: especiales.length, sumas_inexactas: 0 }, null, 2));
