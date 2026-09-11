/* Directorio nacional reutilizado; sin zonas ni restricciones del producto anterior. */
(function(global) {
"use strict";
var sites = [
  {
    "sede_id": "CUND_BOSA",
    "nombre_sede": "Bosa",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_CENTRO_MAYOR",
    "nombre_sede": "Centro Mayor",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_CHAPINERO_B",
    "nombre_sede": "Chapinero B",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_CHIA",
    "nombre_sede": "Chía",
    "ciudad": "Chía",
    "departamento": "Cundinamarca",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_CAJICA",
    "nombre_sede": "Cajicá",
    "ciudad": "Cajicá",
    "departamento": "Cundinamarca",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_FIESTA_SUBA_A",
    "nombre_sede": "Fiesta Suba A",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_FIESTA_SUBA_B",
    "nombre_sede": "Fiesta Suba B",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_FONTANAR",
    "nombre_sede": "Fontanar",
    "ciudad": "Chía",
    "departamento": "Cundinamarca",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_FONTIBON",
    "nombre_sede": "Fontibón",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_HAYUELOS",
    "nombre_sede": "Hayuelos",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_KENNEDY",
    "nombre_sede": "Kennedy",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_MADELENA_A",
    "nombre_sede": "Madelena A",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_MADELENA_B",
    "nombre_sede": "Madelena B",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_MALL_PLAZA",
    "nombre_sede": "Mall Plaza",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_MODELIA",
    "nombre_sede": "Modelia",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_MOSQUERA",
    "nombre_sede": "Mosquera",
    "ciudad": "Mosquera",
    "departamento": "Cundinamarca",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_MULTIDRIVE",
    "nombre_sede": "Multidrive",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_MULTIPLAZA",
    "nombre_sede": "Multiplaza",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_NUESTRO_BOGOTA",
    "nombre_sede": "Nuestro Bogotá",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_PALATINO",
    "nombre_sede": "Palatino",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_PASEO_VILLA_RIO",
    "nombre_sede": "Paseo Villa del Río",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_PLAZA_AMERICAS",
    "nombre_sede": "Plaza Américas",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_PLAZA_CENTRAL",
    "nombre_sede": "Plaza Central",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_RESTREPO",
    "nombre_sede": "Restrepo",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_SAN_MARTIN",
    "nombre_sede": "San Martín",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_SANTAFE",
    "nombre_sede": "Santafé",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_SOACHA_A",
    "nombre_sede": "Soacha A",
    "ciudad": "Soacha",
    "departamento": "Cundinamarca",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_SOACHA_B",
    "nombre_sede": "Soacha B",
    "ciudad": "Soacha",
    "departamento": "Cundinamarca",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_SUBA_AL_PASO",
    "nombre_sede": "Suba al Paso",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_TUNAL",
    "nombre_sede": "Tunal",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_UNICENTRO_OCCIDENTE_A",
    "nombre_sede": "Unicentro de Occidente A",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "CUND_UNICENTRO_OCCIDENTE_B",
    "nombre_sede": "Unicentro de Occidente B",
    "ciudad": "Bogotá D.C.",
    "departamento": "Bogotá D.C.",
    "grupo_operativo": "BOGOTA_CUNDINAMARCA",
    "sede_activa": true
  },
  {
    "sede_id": "ANT_ARKADIA",
    "nombre_sede": "Arkadia",
    "ciudad": "Medellín",
    "departamento": "Antioquia",
    "grupo_operativo": "MEDELLIN_ANTIOQUIA",
    "sede_activa": true
  },
  {
    "sede_id": "ANT_BELLO",
    "nombre_sede": "Bello",
    "ciudad": "Bello",
    "departamento": "Antioquia",
    "grupo_operativo": "MEDELLIN_ANTIOQUIA",
    "sede_activa": true
  },
  {
    "sede_id": "ANT_CALASANZ",
    "nombre_sede": "Calasanz",
    "ciudad": "Medellín",
    "departamento": "Antioquia",
    "grupo_operativo": "MEDELLIN_ANTIOQUIA",
    "sede_activa": true
  },
  {
    "sede_id": "ANT_CENTRO_MEDELLIN",
    "nombre_sede": "Centro Medellín",
    "ciudad": "Medellín",
    "departamento": "Antioquia",
    "grupo_operativo": "MEDELLIN_ANTIOQUIA",
    "sede_activa": true
  },
  {
    "sede_id": "ANT_ENVIGADO",
    "nombre_sede": "Envigado",
    "ciudad": "Envigado",
    "departamento": "Antioquia",
    "grupo_operativo": "MEDELLIN_ANTIOQUIA",
    "sede_activa": true
  },
  {
    "sede_id": "ANT_ITAGUI",
    "nombre_sede": "Itagüí",
    "ciudad": "Itagüí",
    "departamento": "Antioquia",
    "grupo_operativo": "MEDELLIN_ANTIOQUIA",
    "sede_activa": true
  },
  {
    "sede_id": "ANT_LA_CENTRAL",
    "nombre_sede": "La Central",
    "ciudad": "Medellín",
    "departamento": "Antioquia",
    "grupo_operativo": "MEDELLIN_ANTIOQUIA",
    "sede_activa": true
  },
  {
    "sede_id": "ANT_LAURELES",
    "nombre_sede": "Laureles",
    "ciudad": "Medellín",
    "departamento": "Antioquia",
    "grupo_operativo": "MEDELLIN_ANTIOQUIA",
    "sede_activa": true
  },
  {
    "sede_id": "ANT_MALL_GRAN_VIA",
    "nombre_sede": "Mall Gran Vía",
    "ciudad": "Medellín",
    "departamento": "Antioquia",
    "grupo_operativo": "MEDELLIN_ANTIOQUIA",
    "sede_activa": true
  },
  {
    "sede_id": "ANT_MALL_RIO_GRANDE_RIONEGRO",
    "nombre_sede": "Mall Río Grande - Rionegro",
    "ciudad": "Rionegro",
    "departamento": "Antioquia",
    "grupo_operativo": "MEDELLIN_ANTIOQUIA",
    "sede_activa": true
  },
  {
    "sede_id": "ANT_MAYORCA",
    "nombre_sede": "Mayorca",
    "ciudad": "Sabaneta",
    "departamento": "Antioquia",
    "grupo_operativo": "MEDELLIN_ANTIOQUIA",
    "sede_activa": true
  },
  {
    "sede_id": "ANT_SANTAFE_MEDELLIN",
    "nombre_sede": "Santafé Medellín",
    "ciudad": "Medellín",
    "departamento": "Antioquia",
    "grupo_operativo": "MEDELLIN_ANTIOQUIA",
    "sede_activa": false
  },
  {
    "sede_id": "ANT_TIERRAGRO",
    "nombre_sede": "Tierragro",
    "ciudad": "Bello",
    "departamento": "Antioquia",
    "grupo_operativo": "MEDELLIN_ANTIOQUIA",
    "sede_activa": true
  },
  {
    "sede_id": "REG_PIEDECUESTA",
    "nombre_sede": "Piedecuesta",
    "ciudad": "Piedecuesta",
    "departamento": "Santander",
    "grupo_operativo": "SANTANDER",
    "sede_activa": true
  },
  {
    "sede_id": "REG_FLORIDABLANCA",
    "nombre_sede": "Floridablanca",
    "ciudad": "Floridablanca",
    "departamento": "Santander",
    "grupo_operativo": "SANTANDER",
    "sede_activa": true
  },
  {
    "sede_id": "REG_CABECERA",
    "nombre_sede": "Cabecera",
    "ciudad": "Bucaramanga",
    "departamento": "Santander",
    "grupo_operativo": "SANTANDER",
    "sede_activa": true
  },
  {
    "sede_id": "REG_VILLAVICENCIO",
    "nombre_sede": "Villavicencio",
    "ciudad": "Villavicencio",
    "departamento": "Meta",
    "grupo_operativo": "REGIONALES",
    "sede_activa": true
  },
  {
    "sede_id": "REG_IBAGUE",
    "nombre_sede": "Ibagué",
    "ciudad": "Ibagué",
    "departamento": "Tolima",
    "grupo_operativo": "REGIONALES",
    "sede_activa": true
  },
  {
    "sede_id": "REG_CALI",
    "nombre_sede": "Cali",
    "ciudad": "Cali",
    "departamento": "Valle del Cauca",
    "grupo_operativo": "REGIONALES",
    "sede_activa": true
  },
  {
    "sede_id": "REG_MANIZALES",
    "nombre_sede": "Manizales",
    "ciudad": "Manizales",
    "departamento": "Caldas",
    "grupo_operativo": "REGIONALES",
    "sede_activa": true
  },
  {
    "sede_id": "REG_CARNAVAL",
    "nombre_sede": "Carnaval",
    "ciudad": "Soledad",
    "departamento": "Atlántico",
    "grupo_operativo": "REGIONALES",
    "sede_activa": true
  },
  {
    "sede_id": "REG_PEREIRA",
    "nombre_sede": "Pereira",
    "ciudad": "Pereira",
    "departamento": "Risaralda",
    "grupo_operativo": "REGIONALES",
    "sede_activa": true
  },
  {
    "sede_id": "REG_GUACARI",
    "nombre_sede": "Guacarí",
    "ciudad": "Sincelejo",
    "departamento": "Sucre",
    "grupo_operativo": "REGIONALES",
    "sede_activa": true
  },
  {
    "sede_id": "REG_ARMENIA",
    "nombre_sede": "Armenia",
    "ciudad": "Armenia",
    "departamento": "Quindío",
    "grupo_operativo": "REGIONALES",
    "sede_activa": true
  }
];
// Filtro de presentación, independiente de las reglas comerciales.
var groupLabels = {
  BOGOTA_CUNDINAMARCA: "Bogotá / Cundinamarca", MEDELLIN_ANTIOQUIA: "Medellín / Antioquia",
  SANTANDER: "Bucaramanga / Santander", REG_ARMENIA: "Armenia", REG_CARNAVAL: "Barranquilla",
  REG_CALI: "Cali", REG_GUACARI: "Sincelejo", REG_IBAGUE: "Ibagué", REG_MANIZALES: "Manizales",
  REG_PEREIRA: "Pereira", REG_VILLAVICENCIO: "Villavicencio"
};
var collator = new Intl.Collator("es", { numeric: true, sensitivity: "base" });
var groups = [];
sites.filter(function(site) { return site.sede_activa; }).forEach(function(site) {
  var id = site.grupo_operativo === "REGIONALES" ? site.sede_id : site.grupo_operativo;
  var group = groups.find(function(item) { return item.id === id; });
  if (!group) { group = { id: id, nombre: groupLabels[id] || site.ciudad || site.nombre_sede, sedes: [] }; groups.push(group); }
  group.sedes.push(site.sede_id);
});
groups.sort(function(a,b) { return collator.compare(a.nombre,b.nombre); });
groups.forEach(function(group) {
  group.sedes.sort(function(a,b) { return collator.compare(sites.find(function(s) {return s.sede_id === a;}).nombre_sede, sites.find(function(s) {return s.sede_id === b;}).nombre_sede); });
  Object.freeze(group.sedes); Object.freeze(group);
});
global.SMART_MIX_SITE_GROUPS = Object.freeze(groups);
global.SMART_MIX_SITE_LABELS = Object.freeze({ ANT_TIERRAGRO: "Tierragro Bello" });
sites.forEach(Object.freeze);
global.SMART_SEDES = Object.freeze(sites);
global.SMART_SEDES_META = Object.freeze({version:"2026-09-10",fecha_actualizacion_disponibilidad:"2026-09-10",total_sedes:sites.length});
var ids = new Set(sites.map(function(s){return s.sede_id;}));
global.SMART_SEDES_VALIDACION = Object.freeze({valida:sites.length===56 && ids.size===sites.length,errores:[],resumen:{total:sites.length,activas:sites.filter(function(s){return s.sede_activa;}).length}});
})(typeof window !== "undefined" ? window : globalThis);

/* Configuración comercial de adicionales del programa Smart Mix 2026. */
(function (global) {
  "use strict";

  var FECHA_ACTUALIZACION = "2026-09-05";
  var TIPOS_PRECIO = Object.freeze([
    "PRECIO_FIJO",
    "PRECIO_POR_MODULO",
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
      aplica_contado: true,
      aplica_financiado: true,
      planes_aplicables: ["*"],
      modulos_aplicables: ["*"],
      sedes_aplicables: ["*"],
      condiciones_comerciales_aplicables: ["*"],
      tipo_precio: "PRECIO_FIJO",
      precio_publico_cop: null,
      precio_por_modulo_cop: null,
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
      fuente_interna_precio: "SOLICITUD_SMART_MIX_2026",
      observacion_interna: "Valor comercial de referencia aprobado para la calculadora local."
    }, configuracion));
  }

  var adicionales = [
    crearAdicional({
      adicional_id: "MATERIAL_ACADEMICO_POR_MODULO",
      nombre_interno: "Material académico por módulo",
      titulo_cliente: "Material académico de los módulos adquiridos",
      descripcion_cliente: "Material académico correspondiente a los módulos incluidos en el programa seleccionado.",
      aplica_ingles: true,
      modulos_aplicables: [1, 2, 3, 4, 5],
      tipo_precio: "PRECIO_POR_MODULO",
      precio_por_modulo_cop: 243000,
      unidad_precio: "MODULO",
      etiqueta_valor_cliente: "Valor comercial",
      orden_visual: 10
    }),
    crearAdicional({
      adicional_id: "LINGUASKILL_CUATRO_HABILIDADES",
      nombre_interno: "Linguaskill cuatro habilidades",
      titulo_cliente: "Examen Linguaskill de cuatro habilidades",
      descripcion_cliente: "Examen Linguaskill en Reading, Listening, Writing y Speaking, sujeto a las condiciones académicas y de programación aplicables.",
      aplica_ingles: true,
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
      descripcion_cliente: "Curso corto de Inglés de Negocios sujeto a la programación del programa.",
      aplica_ingles: true,
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
        "activo", "seleccionable_por_asesor", "aplica_ingles",
      "aplica_contado", "aplica_financiado", "planes_aplicables", "modulos_aplicables",
      "sedes_aplicables", "condiciones_comerciales_aplicables", "tipo_precio",
      "precio_publico_cop", "precio_por_modulo_cop", "duracion_clase_minutos", "duracion_clase_horas",
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
      if (!precioEnteroONulo(item.precio_publico_cop) || !precioEnteroONulo(item.precio_por_modulo_cop)) {
        errores.push(referencia + ": los precios deben ser enteros COP no negativos o null.");
      }
      if (!Array.isArray(item.planes_aplicables) || !Array.isArray(item.modulos_aplicables) ||
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
      if (item.tipo_precio === "PRECIO_POR_MODULO" && !Number.isSafeInteger(item.precio_por_modulo_cop)) {
        errores.push(referencia + ": el precio por módulo autorizado debe ser un entero COP.");
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
            (item.tipo_precio === "PRECIO_POR_MODULO" && Number.isSafeInteger(item.precio_por_modulo_cop)) ||
            (item.tipo_precio === "VALOR_EQUIVALENTE_CLASE" && Number.isSafeInteger(item.duracion_clase_minutos)) ||
            (item.tipo_precio === "PRECIO_POR_OPCION" && item.opciones_autorizadas.some(function (opcion) {
              return opcion.activa && Number.isSafeInteger(opcion.precio_publico_cop);
            }));
        }).length
      })
    });
  }

  global.SMART_ADICIONALES_META = Object.freeze({
    version: "2026-09-05",
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

/* Campañas de bonificación de adicionales Smart Mix 2026. */
(function (global) {
  "use strict";

  var campanas = [Object.freeze({
    campana_id: "BENEFICIOS_SMART_MIX",
    nombre_campana: "Bonificación por matrícula oportuna",
    activa: true,
    fecha_inicio: null,
    fecha_fin: null,
    vigencia_bonificacion_horas: 48,
    sincronizar_con_vigencia_cotizacion: true,
    adicionales_bonificables: Object.freeze([
      "MATERIAL_ACADEMICO_POR_MODULO",
      "LINGUASKILL_CUATRO_HABILIDADES",
      "CLUBES_CONVERSACION_ILIMITADOS",
      "CURSO_CORTO"
    ]),
    seleccionados_por_defecto: Object.freeze([]),
    permite_seleccion_asesor: true,
    paquete_completo_autorizado: true,
    idiomas_aplicables: Object.freeze(["INGLES"]),
    planes_aplicables: Object.freeze(["*"]),
    sedes_aplicables: Object.freeze(["*"]),
    condiciones_comerciales_aplicables: Object.freeze(["*"]),
    formas_pago_aplicables: Object.freeze(["*"]),
    requiere_autorizacion: false,
    fecha_actualizacion: "2026-09-05",
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
    version: "2026-09-05",
    fecha_actualizacion: "2026-09-05"
  });
  global.SMART_CAMPANAS_ADICIONALES = Object.freeze(campanas.slice());
  global.SMART_CAMPANAS_ADICIONALES_VALIDACION = validarCampanas(
    global.SMART_CAMPANAS_ADICIONALES,
    global.SMART_ADICIONALES || []
  );
})(typeof window !== "undefined" ? window : globalThis);
