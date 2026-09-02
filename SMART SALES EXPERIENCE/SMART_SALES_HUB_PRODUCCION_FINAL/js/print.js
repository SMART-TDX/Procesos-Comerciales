(function () {
  "use strict";

  const contenedor = document.querySelector("#documento-impresion");
  const boton = document.querySelector("#imprimir-documento");

  function recibirDocumento() {
    try {
      const guardado = window.sessionStorage.getItem("smart.propuesta.impresion");
      if (guardado) {
        window.sessionStorage.removeItem("smart.propuesta.impresion");
        return guardado;
      }
    } catch (error) {
      /* El fragmento de URL mantiene compatibilidad con apertura local. */
    }
    const fragmento = window.location.hash.slice(1);
    if (fragmento.indexOf("documento=") === 0) {
      try { return decodeURIComponent(fragmento.slice("documento=".length)); } catch (error) { return ""; }
    }
    try {
      if (!window.opener || !window.opener.SmartPropuesta) return "";
      return window.opener.SmartPropuesta.obtenerDocumentoImpresion();
    } catch (error) {
      return "";
    }
  }

  function cargar() {
    const documento = recibirDocumento();
    if (!documento) {
      contenedor.innerHTML = '<p class="estado-impresion estado-impresion--error">No fue posible recuperar la propuesta. Regresa a Smart Sales Hub y vuelve a seleccionar “Imprimir / Guardar como PDF”.</p>';
      boton.disabled = true;
      return;
    }
    contenedor.innerHTML = documento;
    const pagina = contenedor.querySelector(".propuesta-pagina");
    if (pagina) {
      const cuotasDeclaradas = Number(pagina.dataset.cuotas || 0);
      const cuotasRenderizadas = pagina.querySelectorAll(".documento-amortizacion tbody tr").length;
      const cuotas = cuotasDeclaradas || cuotasRenderizadas;
      if (cuotas > 0 && cuotas < 18) {
        const tablas = pagina.querySelectorAll(".documento-amortizacion__grid table");
        if (tablas.length > 1) {
          const cuerpoPrincipal = tablas[0].querySelector("tbody");
          Array.from(tablas).slice(1).forEach(function (tabla) {
            Array.from(tabla.querySelectorAll("tbody tr")).forEach(function (fila) { cuerpoPrincipal.appendChild(fila); });
            tabla.remove();
          });
          pagina.querySelector(".documento-amortizacion__grid").classList.remove("documento-amortizacion__grid--doble");
        }
      }
      pagina.classList.add("print-page");
      if (!pagina.dataset.printDensity) pagina.dataset.printDensity = pagina.classList.contains("pago-unico") ? "low" : cuotas >= 18 ? "high" : "medium";
      pagina.classList.remove("densidad-baja", "densidad-media", "densidad-alta", "density-low", "density-medium", "density-high", "pdf-compact", "pdf-dense");
      pagina.classList.add("density-" + pagina.dataset.printDensity);
      if (pagina.classList.contains("pago-unico")) {
        pagina.querySelectorAll(".documento-amortizacion, .documento-plan, .payment-schedule, .amortization, .installments, .payment-table, .payment-grid")
          .forEach(function (bloque) { bloque.remove(); });
      }
    }
    const nombreDeclarado = pagina && pagina.dataset.nombreArchivo;
    const nombreCliente = pagina && pagina.querySelector("#propuesta-contacto-cliente-nombre, #propuesta-cliente");
    const nombreNormalizado = String(nombreCliente ? nombreCliente.textContent : "Cliente")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "Cliente";
    const nombreBase = nombreDeclarado || ("Propuesta_Comercial_Smart_" + nombreNormalizado + ".pdf");
    document.title = /\.pdf$/i.test(nombreBase) ? nombreBase : nombreBase + ".pdf";
  }

  boton.addEventListener("click", function () { window.print(); });
  cargar();
})();
