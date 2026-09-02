(function () {
  "use strict";

  function fechaLocal(valor) {
    if (!valor) return null;
    const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
    if (!partes) return null;
    return new Date(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]), 12, 0, 0);
  }

  function coincide(lista, valor) {
    return !Array.isArray(lista) || lista.length === 0 || lista.includes(valor);
  }

  function cantidadNivelesContratados(contexto) {
    const coincidencia = /plan(?:\s+completo)?\s+(\d+)\s+nivel/i.exec(contexto.plan || "");
    return coincidencia ? Number(coincidencia[1]) : Array.isArray(contexto.niveles) ? contexto.niveles.length : 0;
  }

  function cantidadModulosOnline(contexto) {
    const plan = contexto.plan || "";
    const modulos = plan.match(/(?:b[aá]sico|intermedio|intemerdio|avanzado)\s*\d/gi) || [];
    return new Set(modulos.map(function (modulo) { return modulo.toLocaleLowerCase("es"); })).size;
  }

  function cumpleReglas(activo, contexto) {
    const reglas = activo.reglas || {};
    if (!coincide(reglas.lineas, contexto.linea)) return false;
    if (!coincide(reglas.tiposTarifa, contexto.tipoTarifa)) return false;
    if (!coincide(reglas.nivelesIngreso, contexto.nivelIngreso)) return false;
    if (!coincide(reglas.planes, contexto.planId)) return false;
    if (!coincide(reglas.condiciones, contexto.condicion)) return false;
    if (!coincide(reglas.formasPago, contexto.formaPago)) return false;
    if (Number.isFinite(reglas.cuotasMinimas) && contexto.cuotas < reglas.cuotasMinimas) return false;
    if (Number.isFinite(reglas.cuotasMaximas) && contexto.cuotas > reglas.cuotasMaximas) return false;
    if (contexto.linea === "SMART_FLEX") {
      if (Number.isFinite(reglas.nivelesMinimosFlex) && cantidadNivelesContratados(contexto) < reglas.nivelesMinimosFlex) return false;
      if (Array.isArray(reglas.nivelesIncluidosFlex) && reglas.nivelesIncluidosFlex.length && !reglas.nivelesIncluidosFlex.some(function (nivel) { return Array.isArray(contexto.niveles) && contexto.niveles.includes(nivel); })) return false;
    }
    if (contexto.linea === "SMART_ONLINE") {
      if (Number.isFinite(reglas.modulosMinimosOnline) && cantidadModulosOnline(contexto) < reglas.modulosMinimosOnline) return false;
      if (reglas.requiereIntermedioOnline === true && !/(?:intermedio|intemerdio)/i.test(contexto.plan || "")) return false;
    }
    return true;
  }

  function beneficiosDisponibles(configuracion, contexto) {
    if (!configuracion || !Array.isArray(configuracion.beneficios) || !contexto) return [];
    const campana = campanaVigente(configuracion, contexto);
    return configuracion.beneficios.filter(function (activo) {
      if (activo.tipo === "CAMPANA" && (!campana || !campana.beneficioIds.includes(activo.id))) return false;
      if (contexto.linea === "SMART_FLEX" && activo.tipo === "EBOOK") {
        if (activo.esNinguno) return false;
        const cantidad = Number(String(activo.id || "").replace("ebooks-", ""));
        if (!Number.isFinite(cantidad) || cantidad < 1 || cantidad > cantidadNivelesContratados(contexto)) return false;
      }
      return activo.activa === true && activo.aprobada === true && cumpleReglas(activo, contexto);
    });
  }

  function campanaVigente(configuracion, contexto, ahora) {
    if (!configuracion || !configuracion.campana) return null;
    const campana = configuracion.campana;
    if (campana.activa !== true || campana.aprobada !== true) return null;
    const hoy = ahora instanceof Date ? ahora : new Date();
    const inicio = fechaLocal(campana.inicio);
    const fin = fechaLocal(campana.fin);
    if ((inicio && hoy < inicio) || (fin && hoy > fin)) return null;
    if (campana.reglas && !cumpleReglas({ reglas: campana.reglas }, contexto || {})) return null;
    return campana;
  }

  function reconciliarSeleccion(seleccionados, disponibles) {
    const permitidos = new Set(disponibles.map(function (activo) { return activo.id; }));
    return (seleccionados || []).filter(function (id) { return permitidos.has(id); });
  }

  function alternarSeleccion(seleccionados, activo, disponibles) {
    const actuales = reconciliarSeleccion(seleccionados, disponibles);
    if (!disponibles.some(function (item) { return item.id === activo.id; })) return actuales;
    if (actuales.includes(activo.id)) return actuales.filter(function (id) { return id !== activo.id; });
    if (activo.seleccion === "EXCLUSIVA_TIPO") {
      const idsTipo = new Set(disponibles.filter(function (item) { return item.tipo === activo.tipo; }).map(function (item) { return item.id; }));
      return actuales.filter(function (id) { return !idsTipo.has(id); }).concat(activo.id);
    }
    return actuales.concat(activo.id);
  }

  window.SmartMotorComercial = Object.freeze({
    beneficiosDisponibles: beneficiosDisponibles,
    campanaVigente: campanaVigente,
    reconciliarSeleccion: reconciliarSeleccion,
    alternarSeleccion: alternarSeleccion
  });
})();
