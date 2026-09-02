"use strict";

const fs = require("fs");
const vm = require("vm");

function leer(ruta) { return fs.readFileSync(ruta, "utf8"); }
function exigir(condicion, mensaje) { if (!condicion) throw new Error(mensaje); }

const contexto = { window: {}, Date: Date, Intl: Intl };
vm.createContext(contexto);
["js/tarifas.js", "js/config.js", "js/configuracion-comercial.js", "js/motor-comercial.js"].forEach(function (ruta) {
  vm.runInContext(leer(ruta), contexto, { filename: ruta });
});

const catalogo = contexto.window.SMART_TARIFAS;
const configuracion = contexto.window.SMART_COMMERCIAL_CONFIG;
const plantillaMensual = contexto.window.SMART_MONTHLY_CONFIG;
const motor = contexto.window.SmartMotorComercial;
const html = leer("index.html");
const app = leer("js/aplicacion.js");
const propuesta = leer("js/propuesta.js");
const impresion = leer("js/print.js");
const css = leer("css/estilos.css");
const cssPropuesta = leer("css/propuesta.css");
const cssImpresion = leer("css/impresion.css");

let comprobaciones = 0;
function comprobar(condicion, mensaje) { exigir(condicion, mensaje); comprobaciones += 1; }

comprobar(html.includes("SMART SALES HUB") && html.includes("Plataforma Comercial Inteligente"), "Identidad del Dashboard incompleta.");
comprobar(["Nueva Propuesta Comercial", "Buscar Propuesta", "Campaña Vigente", "Beneficios Comerciales", "Tarifas Oficiales", "Biblioteca Comercial"].every(function (texto) { return html.includes(texto); }), "Faltan accesos del Dashboard.");
comprobar(html.includes('id="progreso-barra"') && html.includes('id="resumen-total"'), "Wizard o resumen persistente incompleto.");
comprobar(app.includes('["linea", "duracion", "condicion", "pago", "beneficios", "resumen", "propuesta"]'), "Flujo Smart Online incorrecto.");
comprobar(app.includes('["linea", "nivel", "tipoTarifa", "plan", "condicion", "pago", "beneficios", "resumen", "propuesta"]'), "Flujo Smart Flex incorrecto.");
comprobar(["informacionGeneral", "metas", "novedadesDelMes", "campanas", "indicadores", "nuestroNorte", "erroresFrecuentes", "recursos", "documentos", "multimedia"].every(function (bloque) { return Object.prototype.hasOwnProperty.call(plantillaMensual, bloque); }), "Plantilla mensual incompleta.");
comprobar(!configuracion.campana.activa && motor.campanaVigente(configuracion, {}, new Date("2026-08-01")) === null, "Una campaña vacía no debe publicarse.");

const gruposOnline = new Map();
catalogo.registros.filter(function (r) { return r.linea === "SMART_ONLINE"; }).forEach(function (r) {
  const clave = [r.planId, r.condicion].join("|");
  if (!gruposOnline.has(clave)) gruposOnline.set(clave, new Set());
  gruposOnline.get(clave).add(r.formaPago);
});
comprobar(Array.from(gruposOnline.values()).every(function (formas) { return formas.has("CONTADO") && formas.has("FINANCIADO"); }), "La interfaz podría ocultar Pago Único o Financiado en Smart Online.");

const conteosScore = { A1: 5, A2: 4, B1: 3, B2: 2, C1: 1 };
comprobar(Object.keys(conteosScore).every(function (nivel) {
  return new Set(catalogo.registros.filter(function (r) { return r.tipoTarifa === "SCORE" && r.nivelIngreso === nivel; }).map(function (r) { return r.planId; })).size === conteosScore[nivel];
}), "Smart Flex Score no contiene todas las combinaciones oficiales.");

const planesVisibles = new Map();
let duplicadosVisibles = 0;
catalogo.registros.forEach(function (r) {
  const clave = [r.linea, r.tipoTarifa || "", r.nivelIngreso || "", r.plan.trim().toLocaleLowerCase("es")].join("|");
  if (!planesVisibles.has(clave)) planesVisibles.set(clave, new Set());
  planesVisibles.get(clave).add(r.planId);
});
planesVisibles.forEach(function (ids) { if (ids.size > 1) duplicadosVisibles += 1; });
comprobar(duplicadosVisibles === 0, "Existen planes duplicados visibles.");

const registroOnline = catalogo.registros.find(function (r) { return r.linea === "SMART_ONLINE"; });
const registroFlex = catalogo.registros.find(function (r) { return r.linea === "SMART_FLEX" && /^Plan 3 Niveles/i.test(r.plan) && r.niveles.includes("B1"); });
const registroFlexNoElegible = catalogo.registros.find(function (r) { return r.linea === "SMART_FLEX" && /^Plan 1 nivel/i.test(r.plan); });
const beneficiosOnline = motor.beneficiosDisponibles(configuracion, registroOnline);
const beneficiosFlex = motor.beneficiosDisponibles(configuracion, registroFlex);
comprobar(beneficiosOnline.some(function (b) { return b.tipo === "EXAMEN"; }), "Linguaskill no disponible en Smart Online.");
comprobar(!beneficiosOnline.some(function (b) { return b.tipo === "EBOOK"; }), "E-books no puede estar disponible en Smart Online.");
comprobar(!beneficiosOnline.some(function (b) { return b.tipo === "CURSO_CORTO"; }), "Los cursos cortos no pueden estar disponibles en Smart Online.");
comprobar(beneficiosFlex.some(function (b) { return b.tipo === "EXAMEN"; }) && beneficiosFlex.some(function (b) { return b.tipo === "EBOOK"; }), "Beneficios Smart Flex incompletos.");
comprobar(!motor.beneficiosDisponibles(configuracion, registroFlexNoElegible).some(function (b) { return b.tipo === "EXAMEN"; }), "Linguaskill aparece en un plan de un nivel.");
comprobar(JSON.stringify(beneficiosFlex.filter(function (b) { return b.tipo === "EBOOK"; }).map(function (b) { return b.nombre; })) === JSON.stringify(["Ninguno", "1 E-Book", "2 E-Books", "3 E-Books", "4 E-Books", "5 E-Books"]), "Opciones de E-Books incompletas o desordenadas.");
comprobar(JSON.stringify(beneficiosFlex.filter(function (b) { return b.tipo === "EBOOK"; }).map(function (b) { return b.nombrePresentacion; })) === JSON.stringify(["Sin E-Books", "1 E-Book", "2 E-Books", "3 E-Books", "4 E-Books", "5 E-Books"]), "Presentación de cantidades de E-Books incompleta.");
comprobar(beneficiosFlex.filter(function (b) { return b.tipo === "CURSO_CORTO"; }).length === 3, "Catálogo de cursos cortos incompleto.");
comprobar(beneficiosFlex.some(function (b) { return b.nombre === "Smart Business English"; }), "Nombre oficial de Smart Business English incorrecto.");
comprobar(JSON.stringify(beneficiosFlex.filter(function (b) { return b.tipo === "EXAMEN"; }).map(function (b) { return b.valorComercial; })) === JSON.stringify([170000, 304000, 456000]), "Valores comerciales de Linguaskill incorrectos.");
comprobar(JSON.stringify(beneficiosFlex.filter(function (b) { return b.tipo === "EBOOK" && !b.esNinguno; }).map(function (b) { return b.valorComercial; })) === JSON.stringify([152000, 304000, 456000, 608000, 760000]), "Valores comerciales de E-Books incorrectos.");
comprobar(JSON.stringify(beneficiosFlex.filter(function (b) { return b.tipo === "CURSO_CORTO"; }).map(function (b) { return b.valorComercial; })) === JSON.stringify([823800, 549200, 755400]), "Valores comerciales de cursos cortos incorrectos.");
const casoControl = ["ebooks-3", "curso-business", "linguaskill-4"].map(function (id) { return beneficiosFlex.find(function (b) { return b.id === id; }).valorComercial; });
comprobar(casoControl.reduce(function (total, valor) { return total + valor; }, 0) === 1735800, "El caso de control de beneficios no suma $1.735.800.");
const casoCierre = ["ebooks-5", "curso-chef", "linguaskill-2"].map(function (id) { return beneficiosFlex.find(function (b) { return b.id === id; }).valorComercial; });
const valorBeneficiosCierre = casoCierre.reduce(function (total, valor) { return total + valor; }, 0);
const tarifaCierre = catalogo.registros.find(function (r) { return r.linea === "SMART_FLEX" && r.valorFullPlan === 8224000 && r.valorTotal === 4523200 && r.formaPago === "FINANCIADO" && r.cuotas === 18; });
comprobar(valorBeneficiosCierre === 1613200, "El caso de cierre no suma $1.613.200.");
comprobar(Boolean(tarifaCierre) && tarifaCierre.valorFullPlan - tarifaCierre.valorTotal === 3700800, "El ahorro por descuento del caso de cierre no suma $3.700.800.");
comprobar(tarifaCierre.valorFullPlan - tarifaCierre.valorTotal + valorBeneficiosCierre === 5314000, "El ahorro total del caso de cierre no suma $5.314.000.");
comprobar(!beneficiosFlex.some(function (b) { return b.tipo === "CAMPANA"; }), "Una campaña sin diligenciar no debe mostrarse.");

let seleccion = motor.alternarSeleccion([], beneficiosFlex.find(function (b) { return b.id === "ebooks-1"; }), beneficiosFlex);
seleccion = motor.alternarSeleccion(seleccion, beneficiosFlex.find(function (b) { return b.id === "ebooks-5"; }), beneficiosFlex);
comprobar(!seleccion.includes("ebooks-1") && seleccion.includes("ebooks-5"), "Exclusividad de E-books incorrecta.");
seleccion = motor.alternarSeleccion(seleccion, beneficiosFlex.find(function (b) { return b.id === "ebooks-4"; }), beneficiosFlex);
comprobar(!seleccion.includes("ebooks-5") && seleccion.includes("ebooks-4"), "No fue posible seleccionar 4 E-Books.");
seleccion = motor.alternarSeleccion(seleccion, beneficiosFlex.find(function (b) { return b.id === "curso-business"; }), beneficiosFlex);
seleccion = motor.alternarSeleccion(seleccion, beneficiosFlex.find(function (b) { return b.id === "curso-chef"; }), beneficiosFlex);
comprobar(!seleccion.includes("curso-business") && seleccion.includes("curso-chef"), "Exclusividad de cursos cortos incorrecta.");
comprobar(app.includes("estado.beneficios.includes(b.id)") && !app.includes("b.esNinguno !== true") && app.includes("nombreBeneficio"), "Los beneficios seleccionados no llegan íntegros al resumen.");

const contextoCampana = { window: { SMART_MONTHLY_CONFIG: { informacionGeneral: { vigencia: { inicio: "2026-01-01", fin: "2026-12-31" } }, campanas: [{ estado: "ACTIVA", nombre: "Campaña QA", beneficio: "Beneficio QA", objetivo: "Validación", condiciones: [], argumentos: [], boton: { texto: "", destino: "" } }] } }, Date: Date, Intl: Intl };
vm.createContext(contextoCampana);
vm.runInContext(leer("js/configuracion-comercial.js"), contextoCampana, { filename: "js/configuracion-comercial.js" });
vm.runInContext(leer("js/motor-comercial.js"), contextoCampana, { filename: "js/motor-comercial.js" });
const beneficiosCampana = contextoCampana.window.SmartMotorComercial.beneficiosDisponibles(contextoCampana.window.SMART_COMMERCIAL_CONFIG, registroFlex);
comprobar(beneficiosCampana.some(function (b) { return b.tipo === "CAMPANA" && b.nombre === "Campaña QA" && b.descripcion === "Beneficio QA"; }), "La campaña seleccionable no conserva su contenido mensual.");
comprobar(beneficiosCampana.find(function (b) { return b.tipo === "CAMPANA"; }).valorComercial === null, "La campaña no debe tener valor económico fijo.");

comprobar(html.match(/class="propuesta-pagina /g).length === 1 && html.includes("Vista previa"), "La propuesta no quedó consolidada en una página.");
comprobar(html.includes("Beneficios incluidos en tu propuesta") && propuesta.includes("renderizarBeneficios") && propuesta.includes('new URL("print.html"') && impresion.includes("window.print()"), "Beneficios o impresión no integrados en la propuesta.");
comprobar(css.includes("@media (max-width: 1100px)") && css.includes("@media (max-width: 860px)") && css.includes("@media (max-width: 620px)"), "Responsive principal incompleto.");
comprobar(cssPropuesta.includes("@media print") && cssImpresion.includes("size: 8.5in 13in"), "Impresión Oficio incompleta.");
comprobar(cssImpresion.includes("@page { size: 8.5in 13in; margin: .3in; }") && !cssPropuesta.includes("@page") && !html.includes("Página 1") && !html.includes("Página 2") && !cssPropuesta.includes("propuesta-paginador"), "La propuesta conserva paginación visible o reglas de papel conflictivas.");
comprobar(["volver-dashboard", "cerrar-informacion", "informacion-accion", "ir-inicio", "nueva-cotizacion-global", "reiniciar", "confirmar-reinicio"].every(function (id) { return html.includes('id="' + id + '"') && app.includes('$("#' + id + '").addEventListener'); }), "Existen botones principales sin conexión a una acción.");
comprobar(![html, app, propuesta].some(function (texto) { return /fetch\(|https?:\/\/|localStorage/.test(texto); }) && propuesta.includes('sessionStorage.setItem("smart.propuesta.impresion"'), "Se detectó una dependencia prohibida o falta la transferencia temporal de impresión.");
comprobar(!app.includes("Flex Pack") && !app.includes("Modelo Actual") && !app.includes("Nivel a Nivel"), "La interfaz expone conceptos internos.");

console.log(JSON.stringify({ resultado: "APROBADO", comprobaciones: comprobaciones, tarifas: catalogo.registros.length, beneficiosOnline: beneficiosOnline.length, beneficiosFlex: beneficiosFlex.length, plantillaMensual: "lista", campanaPublicada: false }, null, 2));
