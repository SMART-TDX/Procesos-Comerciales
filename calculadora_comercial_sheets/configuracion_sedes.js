/* Catálogo controlado de sedes comerciales Smart Instituto 2026. */
(function (global) {
  "use strict";

  var FECHA_ACTUALIZACION = "2026-08-04";

  function normalizarNombre(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  }

  function crearSede(id, nombre, ciudad, departamento, grupo, zona, frances, alias, observacion) {
    return {
      sede_id: id,
      nombre_sede: nombre,
      nombre_normalizado: normalizarNombre(nombre),
      ciudad: ciudad,
      departamento: departamento,
      grupo_operativo: grupo,
      zona_tarifaria: zona,
      sede_activa: true,
      ingles_habilitado: true,
      frances_habilitado: Boolean(frances),
      alias: alias || [],
      observacion: observacion || "",
      fecha_actualizacion_disponibilidad: FECHA_ACTUALIZACION
    };
  }

  var sedes = [
    crearSede("CUND_BOSA", "Bosa", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", false),
    crearSede("CUND_CENTRO_MAYOR", "Centro Mayor", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", true),
    crearSede("CUND_CHAPINERO_B", "Chapinero B", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", true),
    crearSede("CUND_CHIA", "Chía", "Chía", "Cundinamarca", "BOGOTA_CUNDINAMARCA", "CUND_ANT", false),
    crearSede("CUND_CAJICA", "Cajicá", "Cajicá", "Cundinamarca", "BOGOTA_CUNDINAMARCA", "CUND_ANT", true),
    crearSede("CUND_FIESTA_SUBA_A", "Fiesta Suba A", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", false),
    crearSede("CUND_FIESTA_SUBA_B", "Fiesta Suba B", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", false),
    crearSede("CUND_FONTANAR", "Fontanar", "Chía", "Cundinamarca", "BOGOTA_CUNDINAMARCA", "CUND_ANT", true),
    crearSede("CUND_FONTIBON", "Fontibón", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", false),
    crearSede("CUND_HAYUELOS", "Hayuelos", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", false),
    crearSede("CUND_KENNEDY", "Kennedy", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", false),
    crearSede("CUND_MADELENA_A", "Madelena A", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", false),
    crearSede("CUND_MADELENA_B", "Madelena B", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", false),
    crearSede("CUND_MALL_PLAZA", "Mall Plaza", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", false),
    crearSede("CUND_MODELIA", "Modelia", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", true, ["Modelia B"]),
    crearSede("CUND_MOSQUERA", "Mosquera", "Mosquera", "Cundinamarca", "BOGOTA_CUNDINAMARCA", "CUND_ANT", true),
    crearSede("CUND_MULTIDRIVE", "Multidrive", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", true),
    crearSede("CUND_MULTIPLAZA", "Multiplaza", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", false),
    crearSede("CUND_NUESTRO_BOGOTA", "Nuestro Bogotá", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", true),
    crearSede("CUND_PALATINO", "Palatino", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", true),
    crearSede("CUND_PASEO_VILLA_RIO", "Paseo Villa del Río", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", false),
    crearSede("CUND_PLAZA_AMERICAS", "Plaza Américas", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", true, ["Plaza de las Américas"]),
    crearSede("CUND_PLAZA_CENTRAL", "Plaza Central", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", false),
    crearSede("CUND_RESTREPO", "Restrepo", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", true),
    crearSede("CUND_SAN_MARTIN", "San Martín", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", false),
    crearSede("CUND_SANTAFE", "Santafé", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", true),
    crearSede("CUND_SOACHA_A", "Soacha A", "Soacha", "Cundinamarca", "BOGOTA_CUNDINAMARCA", "CUND_ANT", false),
    crearSede("CUND_SOACHA_B", "Soacha B", "Soacha", "Cundinamarca", "BOGOTA_CUNDINAMARCA", "CUND_ANT", true),
    crearSede("CUND_SUBA_AL_PASO", "Suba al Paso", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", true),
    crearSede("CUND_TUNAL", "Tunal", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", false),
    crearSede("CUND_UNICENTRO_OCCIDENTE_A", "Unicentro de Occidente A", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", false),
    crearSede("CUND_UNICENTRO_OCCIDENTE_B", "Unicentro de Occidente B", "Bogotá D.C.", "Bogotá D.C.", "BOGOTA_CUNDINAMARCA", "CUND_ANT", true),

    crearSede("ANT_ARKADIA", "Arkadia", "Medellín", "Antioquia", "MEDELLIN_ANTIOQUIA", "CUND_ANT", false),
    crearSede("ANT_BELLO", "Bello", "Bello", "Antioquia", "MEDELLIN_ANTIOQUIA", "CUND_ANT", false),
    crearSede("ANT_CALASANZ", "Calasanz", "Medellín", "Antioquia", "MEDELLIN_ANTIOQUIA", "CUND_ANT", true),
    crearSede("ANT_CENTRO_MEDELLIN", "Centro Medellín", "Medellín", "Antioquia", "MEDELLIN_ANTIOQUIA", "CUND_ANT", false),
    crearSede("ANT_ENVIGADO", "Envigado", "Envigado", "Antioquia", "MEDELLIN_ANTIOQUIA", "CUND_ANT", true),
    crearSede("ANT_ITAGUI", "Itagüí", "Itagüí", "Antioquia", "MEDELLIN_ANTIOQUIA", "CUND_ANT", false),
    crearSede("ANT_LA_CENTRAL", "La Central", "Medellín", "Antioquia", "MEDELLIN_ANTIOQUIA", "CUND_ANT", false),
    crearSede("ANT_LAURELES", "Laureles", "Medellín", "Antioquia", "MEDELLIN_ANTIOQUIA", "CUND_ANT", false),
    crearSede("ANT_MALL_GRAN_VIA", "Mall Gran Vía", "Medellín", "Antioquia", "MEDELLIN_ANTIOQUIA", "CUND_ANT", false),
    crearSede("ANT_MALL_RIO_GRANDE_RIONEGRO", "Mall Río Grande - Rionegro", "Rionegro", "Antioquia", "MEDELLIN_ANTIOQUIA", "CUND_ANT", false),
    crearSede("ANT_MAYORCA", "Mayorca", "Sabaneta", "Antioquia", "MEDELLIN_ANTIOQUIA", "CUND_ANT", false),
    crearSede("ANT_SANTAFE_MEDELLIN", "Santafé Medellín", "Medellín", "Antioquia", "MEDELLIN_ANTIOQUIA", "CUND_ANT", false),
    crearSede("ANT_TIERRAGRO", "Tierragro", "Bello", "Antioquia", "MEDELLIN_ANTIOQUIA", "CUND_ANT", true, ["Tierragro Bello"]),

    crearSede("REG_PIEDECUESTA", "Piedecuesta", "Piedecuesta", "Santander", "SANTANDER", "REGIONALES", false),
    crearSede("REG_FLORIDABLANCA", "Floridablanca", "Floridablanca", "Santander", "SANTANDER", "REGIONALES", false),
    crearSede("REG_CABECERA", "Cabecera", "Bucaramanga", "Santander", "SANTANDER", "REGIONALES", true),
    crearSede("REG_VILLAVICENCIO", "Villavicencio", "Villavicencio", "Meta", "REGIONALES", "REGIONALES", true),
    crearSede("REG_IBAGUE", "Ibagué", "Ibagué", "Tolima", "REGIONALES", "REGIONALES", true),
    crearSede("REG_CALI", "Cali", "Cali", "Valle del Cauca", "REGIONALES", "REGIONALES", true),
    crearSede("REG_MANIZALES", "Manizales", "Manizales", "Caldas", "REGIONALES", "REGIONALES", false),
    crearSede("REG_CARNAVAL", "Carnaval", "Soledad", "Atlántico", "REGIONALES", "REGIONALES", false),
    crearSede("REG_PEREIRA", "Pereira", "Pereira", "Risaralda", "REGIONALES", "REGIONALES", true),
    crearSede("REG_GUACARI", "Guacarí", "Sincelejo", "Sucre", "REGIONALES", "REGIONALES", false),
    crearSede("REG_ARMENIA", "Armenia", "Armenia", "Quindío", "REGIONALES", "REGIONALES", false)
  ];

  function validarConfiguracion(items) {
    var errores = [];
    var ids = new Set();
    var nombres = new Map();
    var alias = new Map();

    items.forEach(function (sede, index) {
      var referencia = "Sede " + (index + 1) + " (" + (sede.sede_id || "sin ID") + ")";
      if (!sede.sede_id || ids.has(sede.sede_id)) {
        errores.push(referencia + ": identificador ausente o duplicado.");
      }
      ids.add(sede.sede_id);
      if (!sede.nombre_sede || !sede.nombre_normalizado || nombres.has(sede.nombre_normalizado)) {
        errores.push(referencia + ": nombre oficial ausente o duplicado.");
      }
      nombres.set(sede.nombre_normalizado, sede.sede_id);
      if (!["CUND_ANT", "REGIONALES"].includes(sede.zona_tarifaria)) {
        errores.push(referencia + ": zona tarifaria inválida.");
      }
      if (!sede.ciudad || !sede.departamento || !sede.grupo_operativo) {
        errores.push(referencia + ": ciudad, departamento o grupo operativo incompleto.");
      }
      if (!Array.isArray(sede.alias)) {
        errores.push(referencia + ": alias debe ser una lista.");
      }
    });

    items.forEach(function (sede) {
      sede.alias.forEach(function (value) {
        var normalized = normalizarNombre(value);
        if (!normalized || nombres.has(normalized) || alias.has(normalized)) {
          errores.push("Alias ambiguo o duplicado: " + value + ".");
        } else {
          alias.set(normalized, sede.sede_id);
        }
      });
    });

    var resumen = {
      total: items.length,
      activas: items.filter(function (sede) { return sede.sede_activa; }).length,
      cundAnt: items.filter(function (sede) { return sede.zona_tarifaria === "CUND_ANT"; }).length,
      regionales: items.filter(function (sede) { return sede.zona_tarifaria === "REGIONALES"; }).length,
      ingles: items.filter(function (sede) { return sede.ingles_habilitado; }).length,
      frances: items.filter(function (sede) { return sede.frances_habilitado; }).length
    };
    var esperados = { total: 56, activas: 56, cundAnt: 45, regionales: 11, ingles: 56, frances: 23 };
    Object.keys(esperados).forEach(function (key) {
      if (resumen[key] !== esperados[key]) {
        errores.push("Conteo inválido de " + key + ": esperado " + esperados[key] + ", obtenido " + resumen[key] + ".");
      }
    });

    return Object.freeze({
      valida: errores.length === 0,
      errores: Object.freeze(errores.slice()),
      resumen: Object.freeze(resumen)
    });
  }

  sedes.forEach(function (sede) {
    sede.alias = Object.freeze(sede.alias.slice());
    Object.freeze(sede);
  });

  var metadata = Object.freeze({
    version: "2026-08-04",
    fecha_actualizacion_disponibilidad: FECHA_ACTUALIZACION,
    total_sedes: 56,
    zonas: Object.freeze({ CUND_ANT: 45, REGIONALES: 11 }),
    idiomas_habilitados: Object.freeze({ INGLES: 56, FRANCES: 23 })
  });

  global.SMART_SEDES_META = metadata;
  global.SMART_SEDES = Object.freeze(sedes.slice());
  global.SMART_SEDES_VALIDACION = validarConfiguracion(global.SMART_SEDES);
  global.SMART_NORMALIZAR_SEDE = normalizarNombre;
})(typeof window !== "undefined" ? window : globalThis);
