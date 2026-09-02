(function () {
  "use strict";

  const locations = [
    { city: "Bogotá", count: 26, x: 55, y: 50, region: "Bogotá / Cundinamarca", status: "active", requiresValidation: false, zones: ["Sur", "Occidente", "Suba", "Central", "Norte"] },
    { city: "Soacha", count: 2, x: 52, y: 54, region: "Bogotá / Cundinamarca", status: "active", requiresValidation: false },
    { city: "Chía", count: 1, x: 57, y: 46, region: "Bogotá / Cundinamarca", status: "active", requiresValidation: false },
    { city: "Mosquera", count: 1, x: 49, y: 50, region: "Bogotá / Cundinamarca", status: "active", requiresValidation: false },
    { city: "Cajicá", count: 2, x: 60, y: 43, region: "Bogotá / Cundinamarca", status: "active", requiresValidation: false },
    { city: "Medellín", count: 9, x: 42, y: 30, region: "Antioquia", status: "active", requiresValidation: false, zones: ["Norte", "Occidente", "Centro", "Sur"] },
    { city: "Bello", count: 2, x: 42, y: 25, region: "Antioquia", status: "active", requiresValidation: false },
    { city: "Envigado", count: 1, x: 44, y: 34, region: "Antioquia", status: "active", requiresValidation: false },
    { city: "Itagüí", count: 2, x: 39, y: 35, region: "Antioquia", status: "active", requiresValidation: false },
    { city: "Rionegro", count: 1, x: 49, y: 31, region: "Antioquia", status: "active", requiresValidation: false },
    { city: "Sabaneta / Mayorca", count: 1, x: 45, y: 38, region: "Antioquia", status: "active", requiresValidation: true },
    { city: "Floridablanca", count: 2, x: 67, y: 35, region: "Santander", status: "active", requiresValidation: true },
    { city: "Bucaramanga", count: 1, x: 65, y: 32, region: "Santander", status: "active", requiresValidation: true },
    { city: "Piedecuesta", count: 1, x: 69, y: 39, region: "Santander", status: "active", requiresValidation: false },
    { city: "Manizales", count: 1, x: 45, y: 43, region: "Eje Cafetero", status: "active", requiresValidation: false },
    { city: "Pereira", count: 1, x: 42, y: 47, region: "Eje Cafetero", status: "active", requiresValidation: false },
    { city: "Armenia", count: 1, x: 44, y: 51, region: "Eje Cafetero", status: "active", requiresValidation: true },
    { city: "Ibagué", count: 1, x: 50, y: 55, region: "Regionales", status: "active", requiresValidation: false },
    { city: "Sincelejo", count: 1, x: 43, y: 16, region: "Regionales", status: "active", requiresValidation: false },
    { city: "Villavicencio", count: 1, x: 62, y: 58, region: "Regionales", status: "active", requiresValidation: false },
    { city: "Cali", count: 1, x: 35, y: 58, region: "Regionales", status: "active", requiresValidation: false },
    { city: "Barranquilla / Soledad", count: 1, x: 52, y: 6, region: "Regionales", status: "active", requiresValidation: true }
  ].map(Object.freeze);

  window.SMART_EXPERIENCE_LOCATIONS = Object.freeze({
    source: "SEDES SMART ORGANIZADAS.xlsx",
    sourceStatus: "CLASIFICACION_INICIAL_CON_VALIDACIONES_PENDIENTES",
    locations: Object.freeze(locations),
    international: Object.freeze([
      Object.freeze({ country: "Colombia", status: "consolidated" }),
      Object.freeze({ country: "Perú", status: "expanding" }),
      Object.freeze({ country: "Estados Unidos", status: "expanding" })
    ])
  });
})();
