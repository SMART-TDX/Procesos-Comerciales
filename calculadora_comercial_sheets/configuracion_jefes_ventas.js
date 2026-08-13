/* Catálogo local y controlado de jefes de ventas Smart Instituto 2026. */
(function (global) {
  "use strict";

  var FECHA_ACTUALIZACION = "2026-08-06";

  function crearJefe(id, nombre, correo, grupo, sedesORegiones) {
    return Object.freeze({
      id: id,
      nombre: nombre,
      correo: correo,
      grupo: grupo,
      sedes_o_regiones: Object.freeze((sedesORegiones || []).slice()),
      activo: true,
      estado_validacion: "CONFIRMADO"
    });
  }

  var jefes = Object.freeze([
    crearJefe("CUND_JOSE_BARRERA", "José Alejandro Barrera Alcaraz", "aalcaraz@smartidiomas.edu.co", "CUNDINAMARCA", ["BOGOTA_CUNDINAMARCA"]),
    crearJefe("CUND_JAIR_MORENO", "Jair Moreno Triana", "j.moreno@smartidiomas.edu.co", "CUNDINAMARCA", ["BOGOTA_CUNDINAMARCA"]),
    crearJefe("CUND_YEISY_CASTELLANOS", "Yeisy Milena Castellanos", "y.castellanos@smartidiomas.edu.co", "CUNDINAMARCA", ["BOGOTA_CUNDINAMARCA"]),
    crearJefe("CUND_SERGIO_RAMOS", "Sergio Stevan Ramos Machuca", "s.ramos@smartidiomas.edu.co", "CUNDINAMARCA", ["BOGOTA_CUNDINAMARCA"]),
    crearJefe("CUND_JAIR_ALCOCER", "Jair Armando Alcocer Barbosa", "jalcocer@smartidiomas.edu.co", "CUNDINAMARCA", ["BOGOTA_CUNDINAMARCA"]),
    crearJefe("CUND_ROSS_SANABRIA", "Ross Nary Sanabria González", "r.sanabria@smartidiomas.edu.co", "CUNDINAMARCA", ["BOGOTA_CUNDINAMARCA"]),
    crearJefe("CUND_RODOLFO_RODRIGUEZ", "Rodolfo Rodríguez Hernández", "rodolfo.hernandez@smartidiomas.edu.co", "CUNDINAMARCA", ["BOGOTA_CUNDINAMARCA"]),
    crearJefe("CUND_JHON_CASTELLANOS", "Jhon Fredi Castellanos López", "jhon.castellanos@smartidiomas.edu.co", "CUNDINAMARCA", ["BOGOTA_CUNDINAMARCA"]),
    crearJefe("REG_BARRANQUILLA_DAVID_SOLANO", "David Mauricio Solano", "david.solano@smartidiomas.edu.co", "BARRANQUILLA", ["REG_CARNAVAL", "BARRANQUILLA"]),
    crearJefe("REG_CALI_ALICIA_VELASQUEZ", "Alicia Velázquez Rojas", "alicia.velasquez@smartidiomas.edu.co", "CALI", ["REG_CALI", "CALI"]),
    crearJefe("REG_IBAGUE_ELIANA_NARVAEZ", "Eliana Narváez Martínez", "enarvaez@smartidiomas.edu.co", "IBAGUE", ["REG_IBAGUE", "IBAGUE"]),
    crearJefe("REG_EJE_ENA_MAHECHA", "Ena Lucía Mahecha", "ena.mahecha@smartidiomas.edu.co", "MANIZALES", ["REG_MANIZALES", "MANIZALES"]),
    crearJefe("REG_PEREIRA_DAVID_TAMAYO", "David Tamayo", "brayan.tamayo@smartidiomas.edu.co", "PEREIRA_ARMENIA", ["REG_PEREIRA", "REG_ARMENIA", "PEREIRA", "ARMENIA"]),
    crearJefe("ANT_JOSE_CHAVEZ", "José Reinaldo Chávez", "j.chavez@smartidiomas.edu.co", "MEDELLIN", ["MEDELLIN_ANTIOQUIA"]),
    crearJefe("ANT_EDYS_MANAURE", "Edys Leonardo Manaure Romero", "emanaure@smartidiomas.edu.co", "MEDELLIN", ["MEDELLIN_ANTIOQUIA"]),
    crearJefe("ANT_JUAN_GIL", "Juan Manuel Gil Taborda", "mtaborda@smartidiomas.edu.co", "MEDELLIN", ["MEDELLIN_ANTIOQUIA"]),
    crearJefe("ANT_VICTOR_GONZALEZ", "Víctor Manuel González", "gonzalez.victor@smartidiomas.edu.co", "MEDELLIN", ["MEDELLIN_ANTIOQUIA"]),
    crearJefe("REG_SANTANDER_EDWIN_ALARCON", "Edwin Andrés Alarcón Mantilla", "edwin.alarcon@smartidiomas.edu.co", "SANTANDER", ["SANTANDER"]),
    crearJefe("REG_VILLAVICENCIO_MIGUEL_ALFONSO", "Miguel Ángel Alfonso", "m.alfonso@smartidiomas.edu.co", "VILLAVICENCIO", ["REG_VILLAVICENCIO", "VILLAVICENCIO"]),
    crearJefe("REG_SINCELEJO_JESUS_RUIZ", "Jesús David Ruiz Garrido", "jesus.ruiz@smartidiomas.edu.co", "SINCELEJO", ["REG_GUACARI", "SINCELEJO"])
  ]);

  function validarConfiguracion(items) {
    var errores = [];
    var ids = new Set();
    var correos = new Set();
    items.forEach(function (jefe, index) {
      var referencia = "Jefe " + (index + 1);
      var correoNormalizado = String(jefe.correo || "").trim().toLowerCase();
      if (!jefe.id || ids.has(jefe.id)) {
        errores.push(referencia + ": ID vacío o duplicado.");
      }
      ids.add(jefe.id);
      if (!jefe.nombre || !correoNormalizado || !jefe.grupo || !Array.isArray(jefe.sedes_o_regiones)) {
        errores.push(referencia + ": campos obligatorios incompletos.");
      }
      if (!/^[^\s@]+@smartidiomas\.edu\.co$/i.test(correoNormalizado)) {
        errores.push(referencia + ": formato de correo inválido.");
      }
      if (correos.has(correoNormalizado)) {
        errores.push(referencia + ": correo duplicado.");
      }
      correos.add(correoNormalizado);
    });
    if (items.length !== 20) {
      errores.push("Se esperaban 20 jefes de ventas y se encontraron " + items.length + ".");
    }
    return Object.freeze({
      valida: errores.length === 0,
      errores: Object.freeze(errores.slice()),
      resumen: Object.freeze({
        total: items.length,
        activos: items.filter(function (jefe) { return jefe.activo; }).length,
        correosUnicos: correos.size
      })
    });
  }

  global.SMART_JEFES_VENTAS_META = Object.freeze({
    version: "2026-08-06",
    fecha_actualizacion: FECHA_ACTUALIZACION,
    total: 20
  });
  global.SMART_JEFES_VENTAS = jefes;
  global.SMART_JEFES_VENTAS_VALIDACION = validarConfiguracion(jefes);
})(typeof window !== "undefined" ? window : globalThis);
