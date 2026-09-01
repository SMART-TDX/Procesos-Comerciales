(function () {
  "use strict";

  const STORAGE_KEY = "smartSalesExperience:v1:session";

  function isSafeSession(value) {
    return Boolean(value && value.version === 1 && value.prospect && value.recommendation && value.preclose && value.commercialSelection);
  }

  function save(state) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.warn("No fue posible conservar la sesión temporal.", error);
      return false;
    }
  }

  function restore() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!isSafeSession(parsed)) {
        clear();
        return null;
      }
      return parsed;
    } catch (error) {
      console.warn("La sesión temporal no pudo recuperarse y será descartada.", error);
      clear();
      return null;
    }
  }

  function clear() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("No fue posible limpiar la sesión temporal.", error);
    }
  }

  window.SmartExperienceSession = Object.freeze({ STORAGE_KEY, save, restore, clear });
})();
