(function () {
  "use strict";
  function numero(valor) { return typeof valor === "number" && Number.isFinite(valor) && valor >= 0; }
  function validarCatalogo(catalogo) {
    if (!catalogo || !catalogo.metadatos || !Array.isArray(catalogo.registros)) return ["El catálogo local no tiene la estructura esperada."];
    const errores = [], ids = new Set(), claves = new Set();
    catalogo.registros.forEach(function (r, i) {
      const ref = "Registro " + (i + 1);
      if (!r.id || ids.has(r.id)) errores.push(ref + ": identificador ausente o duplicado.");
      ids.add(r.id);
      if (!["SMART_FLEX", "SMART_ONLINE"].includes(r.linea)) errores.push(ref + ": línea no permitida.");
      if (r.linea === "SMART_FLEX" && (!r.nivelIngreso || !["MP", "SCORE"].includes(r.tipoTarifa))) errores.push(ref + ": nivel o tipo de tarifa ausente.");
      if (r.linea === "SMART_ONLINE" && (r.nivelIngreso || r.tipoTarifa)) errores.push(ref + ": dimensiones de Flex presentes en Online.");
      if (!r.planId || !r.plan || !r.condicion || !r.formaPago || !numero(r.valorTotal) || !Number.isInteger(r.cuotas)) errores.push(ref + ": dimensiones obligatorias inválidas.");
      const clave = [r.linea, r.nivelIngreso || "", r.tipoTarifa || "", r.planId, r.condicion, r.formaPago, r.cuotas].join("|");
      if (claves.has(clave)) errores.push(ref + ": combinación comercial duplicada.");
      claves.add(clave);
    });
    if (!catalogo.registros.length) errores.push("El catálogo no contiene tarifas publicables.");
    return errores;
  }
  window.SmartValidaciones = Object.freeze({ validarCatalogo: validarCatalogo, cotizacionUnica: function (r) { return Array.isArray(r) && r.length === 1; } });
})();
