const SMART_TIME_CONFIG = Object.freeze({
  asistenciaSpreadsheetId: "1cyfz2XAo2sX9mPFmhRxr1W1NqXyCrVsuMHFtEP5sNlk",
  asistenciaSheetName: "Asistencia comercial",
  personasSpreadsheetId: "1JbSlRH8aGPTdY7NJ9QMk7x6S_U9SXkm9oAv6tGZArSs",
  personasSheetName: "Hoja 1",
  cacheFileName: "SMART_TIME_DATOS_PUBLICACION.js",
  cacheFileProperty: "SMART_TIME_CACHE_FILE_ID"
});

function doGet() {
  let contenido = obtenerContenidoPublicado_();
  return ContentService
    .createTextOutput(contenido)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function instalarActualizacionAutomatica() {
  ScriptApp.getProjectTriggers()
    .filter(trigger => trigger.getHandlerFunction() === "actualizarDatosSmartTime")
    .forEach(trigger => ScriptApp.deleteTrigger(trigger));

  ScriptApp.newTrigger("actualizarDatosSmartTime")
    .timeBased()
    .everyHours(1)
    .create();

  actualizarDatosSmartTime();
}

function actualizarDatosSmartTime() {
  const datos = construirDatos_();
  const contenido = "window.SMART_TIME_DB=" + serializarSeguro_(datos) + ";";
  const archivo = obtenerArchivoCache_();
  archivo.setContent(contenido);
  PropertiesService.getScriptProperties().setProperty(
    SMART_TIME_CONFIG.cacheFileProperty,
    archivo.getId()
  );
  return {
    personas: datos.people.length,
    fechas: datos.dates.length,
    gruposMarcaciones: Object.keys(datos.marks).length,
    actualizado: datos.updatedAt
  };
}

function construirDatos_() {
  const personasSheet = SpreadsheetApp
    .openById(SMART_TIME_CONFIG.personasSpreadsheetId)
    .getSheetByName(SMART_TIME_CONFIG.personasSheetName);
  const asistenciaSheet = SpreadsheetApp
    .openById(SMART_TIME_CONFIG.asistenciaSpreadsheetId)
    .getSheetByName(SMART_TIME_CONFIG.asistenciaSheetName);

  if (!personasSheet || !asistenciaSheet) {
    throw new Error("No se encontraron las pestañas configuradas.");
  }

  const personasRows = personasSheet.getDataRange().getDisplayValues();
  const asistenciaRows = asistenciaSheet.getDataRange().getDisplayValues();

  const people = personasRows.slice(1).map(row => ({
    id: limpiarId_(row[1]),
    name: limpiarTexto_(row[2]),
    role: limpiarTexto_(row[3]),
    boss: limpiarId_(row[6]),
    bossName: limpiarTexto_(row[7]),
    director: limpiarTexto_(row[12]),
    area: limpiarTexto_(row[5]),
    status: limpiarTexto_(row[0]).toUpperCase(),
    start: normalizarFecha_(row[10]),
    end: normalizarFecha_(row[11])
  })).filter(persona => persona.id && persona.name);

  const marks = {};
  const dates = new Set();
  const idsRegistro = new Set();

  asistenciaRows.slice(1).forEach(row => {
    const idRegistro = limpiarTexto_(row[0]);
    const personaId = limpiarId_(row[1]);
    const fecha = normalizarFecha_(row[6]);
    const segundos = horaASegundos_(row[7]);
    const tipo = limpiarTexto_(row[8]);

    if (!personaId || !fecha || segundos === null || !tipo) return;
    if (idRegistro && idsRegistro.has(idRegistro)) return;
    if (idRegistro) idsRegistro.add(idRegistro);

    const llave = personaId + "|" + fecha;
    if (!marks[llave]) marks[llave] = [];
    marks[llave].push([
      tipo,
      segundos,
      limpiarTexto_(row[5]),
      limpiarTexto_(row[10])
    ]);
    dates.add(fecha);
  });

  Object.keys(marks).forEach(llave => {
    marks[llave].sort((a, b) => a[1] - b[1]);
  });

  people.sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));

  return {
    people: people,
    marks: marks,
    dates: Array.from(dates).sort(),
    updatedAt: Utilities.formatDate(new Date(), "America/Bogota", "yyyy-MM-dd'T'HH:mm:ssXXX")
  };
}

function obtenerContenidoPublicado_() {
  const propiedades = PropertiesService.getScriptProperties();
  const fileId = propiedades.getProperty(SMART_TIME_CONFIG.cacheFileProperty);

  if (!fileId) {
    actualizarDatosSmartTime();
  }

  const idActual = propiedades.getProperty(SMART_TIME_CONFIG.cacheFileProperty);
  return DriveApp.getFileById(idActual).getBlob().getDataAsString("UTF-8");
}

function obtenerArchivoCache_() {
  const propiedades = PropertiesService.getScriptProperties();
  const fileId = propiedades.getProperty(SMART_TIME_CONFIG.cacheFileProperty);

  if (fileId) {
    try {
      return DriveApp.getFileById(fileId);
    } catch (error) {
      propiedades.deleteProperty(SMART_TIME_CONFIG.cacheFileProperty);
    }
  }

  return DriveApp.createFile(
    SMART_TIME_CONFIG.cacheFileName,
    "window.SMART_TIME_DB=null;",
    MimeType.JAVASCRIPT
  );
}

function limpiarTexto_(valor) {
  return String(valor == null ? "" : valor).trim();
}

function limpiarId_(valor) {
  return limpiarTexto_(valor).replace(/\.0+$/, "").replace(/\s+/g, "");
}

function normalizarFecha_(valor) {
  const texto = limpiarTexto_(valor);
  if (!texto) return null;

  let match = texto.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (match) return fechaIso_(match[1], match[2], match[3]);

  match = texto.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
  if (match) return fechaIso_(match[3], match[2], match[1]);

  const fecha = new Date(texto);
  if (!Number.isNaN(fecha.getTime())) {
    return Utilities.formatDate(fecha, "America/Bogota", "yyyy-MM-dd");
  }
  return null;
}

function fechaIso_(year, month, day) {
  return String(year).padStart(4, "0") + "-" +
    String(month).padStart(2, "0") + "-" +
    String(day).padStart(2, "0");
}

function horaASegundos_(valor) {
  const texto = limpiarTexto_(valor);
  if (!texto) return null;

  const match = texto.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(a\.?\s*m\.?|p\.?\s*m\.?)?$/i);
  if (!match) return null;

  let horas = Number(match[1]);
  const minutos = Number(match[2]);
  const segundos = Number(match[3] || 0);
  const periodo = (match[4] || "").toLowerCase().replace(/[.\s]/g, "");

  if (periodo === "pm" && horas < 12) horas += 12;
  if (periodo === "am" && horas === 12) horas = 0;
  if (horas > 23 || minutos > 59 || segundos > 59) return null;

  return horas * 3600 + minutos * 60 + segundos;
}

function serializarSeguro_(valor) {
  return JSON.stringify(valor)
    .replace(/<\//g, "<\\/")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
