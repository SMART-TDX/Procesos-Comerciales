/* Configuración comercial de adicionales del programa Smart Instituto 2026. */
(function (global) {
  "use strict";

  var FECHA_ACTUALIZACION = "2026-08-04";
  var TIPOS_PRECIO = Object.freeze([
    "PRECIO_FIJO",
    "PRECIO_POR_NIVEL",
    "PRECIO_POR_OPCION",
    "VALOR_EQUIVALENTE_CLASE"
  ]);

  function crearAdicional(configuracion) {
    return Object.freeze(Object.assign({
      adicional_id: "",
      nombre_interno: "",
      titulo_cliente: "",
      descripcion_cliente: "",
      activo: true,
      seleccionable_por_asesor: true,
      aplica_ingles: true,
      aplica_frances: true,
      aplica_contado: true,
      aplica_financiado: true,
      planes_aplicables: ["*"],
      niveles_aplicables: ["*"],
      sedes_aplicables: ["*"],
      condiciones_comerciales_aplicables: ["*"],
      tipo_precio: "PRECIO_FIJO",
      precio_publico_cop: null,
      precio_por_nivel_cop: null,
      duracion_clase_minutos: null,
      duracion_clase_horas: null,
      unidad_precio: "UNIDAD",
      etiqueta_valor_cliente: "Valor comercial",
      aclaracion_valor_cliente: "",
      requiere_opcion: false,
      opciones_autorizadas: [],
      obligatorio_para_programa: false,
      puede_comprarse_separadamente: true,
      puede_bonificarse: true,
      orden_visual: 0,
      fecha_actualizacion_precio: FECHA_ACTUALIZACION,
      fuente_interna_precio: "CONFIGURACION_COMERCIAL_APROBADA_2026-07-27",
      observacion_interna: "Valor comercial de referencia aprobado para la calculadora local."
    }, configuracion));
  }

  var adicionales = [
    crearAdicional({
      adicional_id: "MATERIAL_ACADEMICO_POR_NIVEL",
      nombre_interno: "Material académico por nivel",
      titulo_cliente: "Material académico de los niveles adquiridos",
      descripcion_cliente: "Material académico correspondiente a los niveles incluidos en el programa seleccionado.",
      aplica_ingles: true,
      aplica_frances: true,
      niveles_aplicables: [1, 2, 3, 4, 5],
      tipo_precio: "PRECIO_POR_NIVEL",
      precio_por_nivel_cop: 243000,
      unidad_precio: "NIVEL",
      etiqueta_valor_cliente: "Valor comercial",
      orden_visual: 10
    }),
    crearAdicional({
      adicional_id: "LINGUASKILL_CUATRO_HABILIDADES",
      nombre_interno: "Linguaskill cuatro habilidades",
      titulo_cliente: "Examen Linguaskill de cuatro habilidades",
      descripcion_cliente: "Examen Linguaskill en Reading, Listening, Writing y Speaking, sujeto a las condiciones académicas y de programación aplicables.",
      aplica_ingles: true,
      aplica_frances: false,
      tipo_precio: "PRECIO_FIJO",
      precio_publico_cop: 480000,
      unidad_precio: "EXAMEN",
      etiqueta_valor_cliente: "Valor independiente",
      orden_visual: 20
    }),
    crearAdicional({
      adicional_id: "CLUBES_CONVERSACION_ILIMITADOS",
      nombre_interno: "Clubes de conversación ilimitados",
      titulo_cliente: "Clubes de conversación ilimitados",
      descripcion_cliente: "Acceso ilimitado a clubes de conversación durante la vigencia del contrato, conforme a la programación y disponibilidad académica.",
      aplica_ingles: true,
      aplica_frances: true,
      tipo_precio: "VALOR_EQUIVALENTE_CLASE",
      duracion_clase_minutos: 90,
      duracion_clase_horas: 1.5,
      unidad_precio: "CLASE_REFERENCIA_90_MIN",
      etiqueta_valor_cliente: "Valor equivalente a una clase",
      aclaracion_valor_cliente: "Referencia calculada con base en una clase de 90 minutos y el valor por hora de lista del programa.",
      orden_visual: 30
    }),
    crearAdicional({
      adicional_id: "CURSO_CORTO",
      nombre_interno: "Curso corto de Inglés de Negocios",
      titulo_cliente: "Curso corto de Inglés de Negocios",
      descripcion_cliente: "Curso corto de Inglés de Negocios sujeto a la programación institucional.",
      aplica_ingles: true,
      aplica_frances: true,
      tipo_precio: "PRECIO_FIJO",
      precio_publico_cop: 999000,
      unidad_precio: "CURSO",
      etiqueta_valor_cliente: "Valor independiente",
      requiere_opcion: false,
      opciones_autorizadas: [],
      orden_visual: 40,
      observacion_interna: "Se utiliza la opción genérica autorizada. Las opciones futuras podrán heredar este precio o configurar uno diferente."
    })
  ];

  function precioEnteroONulo(value) {
    return value === null || (Number.isSafeInteger(value) && value >= 0);
  }

  function validarConfiguracion(items) {
    var errores = [];
    var alertas = [];
    var ids = new Set();
    var campos = [
      "adicional_id", "nombre_interno", "titulo_cliente", "descripcion_cliente",
      "activo", "seleccionable_por_asesor", "aplica_ingles", "aplica_frances",
      "aplica_contado", "aplica_financiado", "planes_aplicables", "niveles_aplicables",
      "sedes_aplicables", "condiciones_comerciales_aplicables", "tipo_precio",
      "precio_publico_cop", "precio_por_nivel_cop", "duracion_clase_minutos", "duracion_clase_horas",
      "unidad_precio", "etiqueta_valor_cliente", "aclaracion_valor_cliente",
      "requiere_opcion", "opciones_autorizadas", "obligatorio_para_programa",
      "puede_comprarse_separadamente", "puede_bonificarse", "orden_visual",
      "fecha_actualizacion_precio", "fuente_interna_precio", "observacion_interna"
    ];
    items.forEach(function (item, index) {
      var referencia = "Adicional " + (index + 1) + " (" + (item.adicional_id || "sin ID") + ")";
      campos.forEach(function (campo) {
        if (!Object.prototype.hasOwnProperty.call(item, campo) || item[campo] === undefined) {
          errores.push(referencia + ": falta " + campo + ".");
        }
      });
      if (!item.adicional_id || ids.has(item.adicional_id)) {
        errores.push(referencia + ": ID ausente o duplicado.");
      }
      ids.add(item.adicional_id);
      if (TIPOS_PRECIO.indexOf(item.tipo_precio) < 0) {
        errores.push(referencia + ": tipo de precio inválido.");
      }
      if (!precioEnteroONulo(item.precio_publico_cop) || !precioEnteroONulo(item.precio_por_nivel_cop)) {
        errores.push(referencia + ": los precios deben ser enteros COP no negativos o null.");
      }
      if (!Array.isArray(item.planes_aplicables) || !Array.isArray(item.niveles_aplicables) ||
          !Array.isArray(item.sedes_aplicables) || !Array.isArray(item.condiciones_comerciales_aplicables) ||
          !Array.isArray(item.opciones_autorizadas)) {
        errores.push(referencia + ": las reglas de aplicabilidad y opciones deben ser listas.");
      }
      var optionIds = new Set();
      (item.opciones_autorizadas || []).forEach(function (opcion, optionIndex) {
        var optionReference = referencia + ", opción " + (optionIndex + 1);
        ["opcion_id", "nombre_cliente", "descripcion", "activa", "precio_publico_cop",
          "idiomas_aplicables", "sedes_aplicables", "fecha_actualizacion"].forEach(function (campo) {
          if (!Object.prototype.hasOwnProperty.call(opcion, campo) || opcion[campo] === undefined) {
            errores.push(optionReference + ": falta " + campo + ".");
          }
        });
        if (!opcion.opcion_id || optionIds.has(opcion.opcion_id)) {
          errores.push(optionReference + ": ID ausente o duplicado dentro del adicional.");
        }
        optionIds.add(opcion.opcion_id);
        if (opcion.precio_publico_cop !== null &&
            (!Number.isSafeInteger(opcion.precio_publico_cop) || opcion.precio_publico_cop < 0)) {
          errores.push(optionReference + ": el precio debe ser null para heredar el valor general o un entero COP no negativo.");
        }
        if (!Array.isArray(opcion.idiomas_aplicables) || !Array.isArray(opcion.sedes_aplicables)) {
          errores.push(optionReference + ": idiomas y sedes aplicables deben ser listas.");
        }
      });
      if (item.tipo_precio === "PRECIO_FIJO" && !Number.isSafeInteger(item.precio_publico_cop)) {
        errores.push(referencia + ": el precio fijo autorizado debe ser un entero COP.");
      }
      if (item.tipo_precio === "PRECIO_POR_NIVEL" && !Number.isSafeInteger(item.precio_por_nivel_cop)) {
        errores.push(referencia + ": el precio por nivel autorizado debe ser un entero COP.");
      }
      if (item.tipo_precio === "PRECIO_POR_OPCION" && item.requiere_opcion &&
          !item.opciones_autorizadas.some(function (opcion) { return opcion.activa; })) {
        errores.push(referencia + ": se requiere al menos una opción activa autorizada.");
      }
      if (item.tipo_precio === "VALOR_EQUIVALENTE_CLASE" &&
          (item.duracion_clase_minutos !== 90 ||
           item.duracion_clase_horas !== 1.5)) {
        errores.push(referencia + ": la duración autorizada debe ser de 90 minutos o 1,5 horas.");
      }
    });
    if (items.length !== 4) {
      errores.push("Se esperaban exactamente 4 adicionales y se obtuvieron " + items.length + ".");
    }
    return Object.freeze({
      valida: errores.length === 0,
      errores: Object.freeze(errores.slice()),
      alertas: Object.freeze(alertas.slice()),
      resumen: Object.freeze({
        total: items.length,
        activos: items.filter(function (item) { return item.activo; }).length,
        preciosConfigurados: items.filter(function (item) {
          return (item.tipo_precio === "PRECIO_FIJO" && Number.isSafeInteger(item.precio_publico_cop)) ||
            (item.tipo_precio === "PRECIO_POR_NIVEL" && Number.isSafeInteger(item.precio_por_nivel_cop)) ||
            (item.tipo_precio === "VALOR_EQUIVALENTE_CLASE" && Number.isSafeInteger(item.duracion_clase_minutos)) ||
            (item.tipo_precio === "PRECIO_POR_OPCION" && item.opciones_autorizadas.some(function (opcion) {
              return opcion.activa && Number.isSafeInteger(opcion.precio_publico_cop);
            }));
        }).length
      })
    });
  }

  global.SMART_ADICIONALES_META = Object.freeze({
    version: "2026-08-04",
    fecha_actualizacion: FECHA_ACTUALIZACION,
    estados_permitidos: Object.freeze([
      "NO_SELECCIONADO", "ADICIONAL_CON_COSTO", "BONIFICADO_PROMOCION_VIGENTE",
      "BONIFICACION_VENCIDA", "BONIFICADO_POR_AUTORIZACION", "NO_APLICA", "INACTIVO"
    ]),
    tipos_precio: TIPOS_PRECIO
  });
  global.SMART_ADICIONALES = Object.freeze(adicionales.slice());
  global.SMART_ADICIONALES_VALIDACION = validarConfiguracion(global.SMART_ADICIONALES);
})(typeof window !== "undefined" ? window : globalThis);
