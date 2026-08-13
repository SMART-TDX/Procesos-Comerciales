/* Campañas de bonificación de adicionales Smart Instituto 2026. */
(function (global) {
  "use strict";

  var campanas = [Object.freeze({
    campana_id: "MATRICULA_OPORTUNA_48H",
    nombre_campana: "Bonificación por matrícula oportuna",
    activa: true,
    fecha_inicio: null,
    fecha_fin: null,
    vigencia_bonificacion_horas: 48,
    sincronizar_con_vigencia_cotizacion: true,
    adicionales_bonificables: Object.freeze([
      "MATERIAL_ACADEMICO_POR_NIVEL",
      "LINGUASKILL_CUATRO_HABILIDADES",
      "CLUBES_CONVERSACION_ILIMITADOS",
      "CURSO_CORTO"
    ]),
    seleccionados_por_defecto: Object.freeze([]),
    permite_seleccion_asesor: true,
    paquete_completo_autorizado: true,
    idiomas_aplicables: Object.freeze(["INGLES", "FRANCES"]),
    planes_aplicables: Object.freeze(["*"]),
    sedes_aplicables: Object.freeze(["*"]),
    condiciones_comerciales_aplicables: Object.freeze(["*"]),
    formas_pago_aplicables: Object.freeze(["*"]),
    requiere_autorizacion: false,
    fecha_actualizacion: "2026-07-17",
    observacion_interna: "Campaña local sincronizada con la vigencia de 48 horas de la cotización. No selecciona beneficios automáticamente."
  })];

  function validarCampanas(items, adicionales) {
    var errores = [];
    var ids = new Set();
    var adicionalesIds = new Set((adicionales || []).map(function (item) { return item.adicional_id; }));
    var campos = [
      "campana_id", "nombre_campana", "activa", "fecha_inicio", "fecha_fin",
      "vigencia_bonificacion_horas", "sincronizar_con_vigencia_cotizacion",
      "adicionales_bonificables", "seleccionados_por_defecto", "permite_seleccion_asesor",
      "paquete_completo_autorizado", "idiomas_aplicables", "planes_aplicables",
      "sedes_aplicables", "condiciones_comerciales_aplicables", "formas_pago_aplicables",
      "requiere_autorizacion", "fecha_actualizacion", "observacion_interna"
    ];
    items.forEach(function (item, index) {
      var referencia = "Campaña " + (index + 1) + " (" + (item.campana_id || "sin ID") + ")";
      campos.forEach(function (campo) {
        if (!Object.prototype.hasOwnProperty.call(item, campo) || item[campo] === undefined) {
          errores.push(referencia + ": falta " + campo + ".");
        }
      });
      if (!item.campana_id || ids.has(item.campana_id)) {
        errores.push(referencia + ": ID ausente o duplicado.");
      }
      ids.add(item.campana_id);
      if (!Number.isSafeInteger(item.vigencia_bonificacion_horas) || item.vigencia_bonificacion_horas <= 0) {
        errores.push(referencia + ": vigencia en horas inválida.");
      }
      item.adicionales_bonificables.forEach(function (id) {
        if (!adicionalesIds.has(id)) {
          errores.push(referencia + ": adicional no configurado " + id + ".");
        }
      });
      item.seleccionados_por_defecto.forEach(function (id) {
        if (item.adicionales_bonificables.indexOf(id) < 0) {
          errores.push(referencia + ": selección predeterminada no autorizada " + id + ".");
        }
      });
    });
    return Object.freeze({
      valida: errores.length === 0,
      errores: Object.freeze(errores.slice()),
      resumen: Object.freeze({
        total: items.length,
        activas: items.filter(function (item) { return item.activa; }).length,
        vigenciaInicialHoras: items.length ? items[0].vigencia_bonificacion_horas : 0
      })
    });
  }

  global.SMART_CAMPANAS_ADICIONALES_META = Object.freeze({
    version: "2026-07-17",
    fecha_actualizacion: "2026-07-17"
  });
  global.SMART_CAMPANAS_ADICIONALES = Object.freeze(campanas.slice());
  global.SMART_CAMPANAS_ADICIONALES_VALIDACION = validarCampanas(
    global.SMART_CAMPANAS_ADICIONALES,
    global.SMART_ADICIONALES || []
  );
})(typeof window !== "undefined" ? window : globalThis);
