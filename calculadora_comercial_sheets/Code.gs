const SPREADSHEET_ID = "1PSJyCgifPq1wH6w1VilQZz2lc_BBxhhx1oGUWoFQZ6g";
const SHEET_NAME = "Cotizaciones";

const HEADERS = Object.freeze([
  "ID_COTIZACION", "FECHA_GENERACION", "HORA_GENERACION",
  "FECHA_VENCIMIENTO", "HORA_VENCIMIENTO",
  "NOMBRE_CLIENTE", "CELULAR_CLIENTE", "CORREO_CLIENTE",
  "NOMBRE_COMERCIAL", "CORREO_COMERCIAL", "NOMBRE_JEFE_VENTAS",
  "CORREO_JEFE_VENTAS", "SEDE", "IDIOMA", "PLAN_TARIFARIO",
  "MODALIDAD", "PROGRAMA", "PORCENTAJE_DESCUENTO", "VALOR_DESCUENTO",
  "VALOR_FINAL_CONTRATO", "FORMA_PAGO", "VALOR_CUOTA_INICIAL",
  "SALDO_FINANCIAR", "NUMERO_CUOTAS", "VALOR_CUOTAS_POSTERIORES",
  "VALOR_ULTIMA_CUOTA", "FECHA_PRIMERA_CUOTA", "BENEFICIOS",
  "ESTADO", "FECHA_MATRICULA", "VERSION_MODELO",
  "FECHA_REGISTRO", "HORA_REGISTRO"
]);

function doGet() {
  return jsonResponse_({ ok: true, service: "registro-cotizaciones-smart" });
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const payload = JSON.parse((event && event.postData && event.postData.contents) || "{}");
    validatePayload_(payload);

    const sheet = ensureSheet_();
    const existing = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1)
      .createTextFinder(String(payload.id_cotizacion))
      .matchEntireCell(true)
      .findNext();

    if (existing) {
      return jsonResponse_({ ok: true, duplicate: true, id: payload.id_cotizacion });
    }

    const row = HEADERS.map(function (header) {
      return safeCell_(valueForHeader_(header, payload));
    });
    sheet.appendRow(row);
    return jsonResponse_({ ok: true, duplicate: false, id: payload.id_cotizacion });
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return jsonResponse_({ ok: false, error: String(error && error.message || error) });
  } finally {
    lock.releaseLock();
  }
}

function setupSheet() {
  return ensureSheet_().getName();
}

function ensureSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }
  if (sheet.getMaxColumns() < HEADERS.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), HEADERS.length - sheet.getMaxColumns());
  }
  const current = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (current.join("|") !== HEADERS.join("|")) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setBackground("#7f171c")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setWrap(true);
  return sheet;
}

function validatePayload_(payload) {
  ["id_cotizacion", "fecha_generacion", "fecha_vencimiento", "nombre_cliente",
    "nombre_comercial", "sede", "idioma", "programa", "forma_pago"]
    .forEach(function (field) {
      if (!String(payload[field] == null ? "" : payload[field]).trim()) {
        throw new Error("Campo requerido ausente: " + field);
      }
    });
  if (!/^SM[A-Z0-9-]{6,80}$/i.test(String(payload.id_cotizacion))) {
    throw new Error("Referencia de cotización inválida.");
  }
  if (JSON.stringify(payload).length > 50000) {
    throw new Error("Solicitud demasiado grande.");
  }
}

function valueForHeader_(header, payload) {
  const timestampFields = {
    FECHA_GENERACION: ["fecha_generacion", "yyyy-MM-dd"],
    HORA_GENERACION: ["fecha_generacion", "HH:mm:ss"],
    FECHA_VENCIMIENTO: ["fecha_vencimiento", "yyyy-MM-dd"],
    HORA_VENCIMIENTO: ["fecha_vencimiento", "HH:mm:ss"],
    FECHA_REGISTRO: ["fecha_registro", "yyyy-MM-dd"],
    HORA_REGISTRO: ["fecha_registro", "HH:mm:ss"]
  };
  if (timestampFields[header]) {
    return formatTimestamp_(payload[timestampFields[header][0]], timestampFields[header][1]);
  }
  const map = {
    ID_COTIZACION: "id_cotizacion", NOMBRE_CLIENTE: "nombre_cliente",
    CELULAR_CLIENTE: "celular_cliente", CORREO_CLIENTE: "correo_cliente",
    NOMBRE_COMERCIAL: "nombre_comercial", CORREO_COMERCIAL: "correo_comercial",
    NOMBRE_JEFE_VENTAS: "nombre_jefe_ventas", CORREO_JEFE_VENTAS: "correo_jefe_ventas",
    SEDE: "sede", IDIOMA: "idioma", PLAN_TARIFARIO: "plan_tarifario",
    MODALIDAD: "modalidad", PROGRAMA: "programa",
    PORCENTAJE_DESCUENTO: "porcentaje_descuento", VALOR_DESCUENTO: "valor_descuento",
    VALOR_FINAL_CONTRATO: "valor_final_contrato", FORMA_PAGO: "forma_pago",
    VALOR_CUOTA_INICIAL: "valor_cuota_inicial", SALDO_FINANCIAR: "saldo_financiar",
    NUMERO_CUOTAS: "numero_cuotas", VALOR_CUOTAS_POSTERIORES: "valor_cuotas_posteriores",
    VALOR_ULTIMA_CUOTA: "valor_ultima_cuota", FECHA_PRIMERA_CUOTA: "fecha_primera_cuota",
    BENEFICIOS: "beneficios", ESTADO: "estado", FECHA_MATRICULA: "fecha_matricula",
    VERSION_MODELO: "version_modelo"
  };
  const value = payload[map[header]];
  return header === "BENEFICIOS" && typeof value !== "string" ? JSON.stringify(value || []) : (value == null ? "" : value);
}

function formatTimestamp_(value, pattern) {
  const date = new Date(value);
  if (!value || isNaN(date.getTime())) return "";
  return Utilities.formatDate(date, "America/Bogota", pattern);
}

function safeCell_(value) {
  if (typeof value !== "string") return value;
  return /^[=+@]/.test(value) ? "'" + value : value;
}

function jsonResponse_(body) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
