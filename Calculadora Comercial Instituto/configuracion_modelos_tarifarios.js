/* Planes tarifarios internos de Smart Instituto 2026. */
(function (global) {
  "use strict";

  var MODELOS = [
    {
      modelo_tarifario_id: "PORTAFOLIO_INSTITUCIONAL",
      activo: true,
      nombre_panel: "Tarifas generales",
      catalogo_global: "SMART_TARIFAS",
      aplicacion_nacional: false,
      utiliza_zona_tarifaria: true,
      predeterminado: true
    },
    {
      modelo_tarifario_id: "MODELO_MP_PAQUETES",
      activo: true,
      nombre_panel: "Tarifas MP",
      catalogo_global: "SMART_TARIFAS_MP",
      aplicacion_nacional: true,
      utiliza_zona_tarifaria: false,
      predeterminado: false
    },
    {
      modelo_tarifario_id: "MODELO_MP_NIVEL_A_NIVEL",
      activo: true,
      nombre_panel: "Tarifas nivel a nivel",
      catalogo_global: "SMART_TARIFAS_MP",
      aplicacion_nacional: true,
      utiliza_zona_tarifaria: false,
      predeterminado: false
    }
  ];

  function validar(modelos) {
    var errores = [];
    var ids = new Set();
    var predeterminados = 0;
    modelos.forEach(function (modelo, index) {
      ["modelo_tarifario_id", "nombre_panel", "catalogo_global"].forEach(function (campo) {
        if (!String(modelo[campo] || "").trim()) {
          errores.push("Modelo " + (index + 1) + ": campo obligatorio vacío (" + campo + ").");
        }
      });
      if (ids.has(modelo.modelo_tarifario_id)) {
        errores.push("Identificador de modelo duplicado: " + modelo.modelo_tarifario_id + ".");
      }
      ids.add(modelo.modelo_tarifario_id);
      if (modelo.predeterminado) {
        predeterminados += 1;
      }
    });
    if (modelos.length !== 3) {
      errores.push("Deben existir exactamente tres planes tarifarios.");
    }
    if (predeterminados !== 1 || !modelos.some(function (modelo) {
      return modelo.modelo_tarifario_id === "PORTAFOLIO_INSTITUCIONAL" && modelo.predeterminado;
    })) {
      errores.push("Tarifas generales debe ser el único plan tarifario predeterminado.");
    }
    return Object.freeze({ valida: errores.length === 0, errores: Object.freeze(errores) });
  }

  MODELOS.forEach(Object.freeze);
  global.SMART_MODELOS_TARIFARIOS = Object.freeze(MODELOS.slice());
  global.SMART_MODELOS_TARIFARIOS_VALIDACION = validar(global.SMART_MODELOS_TARIFARIOS);
})(typeof window !== "undefined" ? window : globalThis);
