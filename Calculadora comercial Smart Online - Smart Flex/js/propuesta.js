(function () {
  "use strict";

  const dialogo = document.querySelector("#propuesta-dialog");
  const formulario = document.querySelector("#formulario-propuesta");
  const formatoMoneda = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 2 });
  const formatoPorcentaje = new Intl.NumberFormat("es-CO", { style: "percent", maximumFractionDigits: 2 });
  const formatoFecha = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" });
  const beneficioOnline = "Aprende a tu ritmo con acceso flexible, recursos digitales y acompañamiento Smart.";
  const beneficioFlex = "Avanza de forma progresiva con formación en vivo, acompañamiento y metodología Smart.";
  let cotizacion = null;

  function elemento(selector) { return document.querySelector(selector); }
  function texto(selector, valor) { elemento(selector).textContent = valor || ""; }
  function fechaLegible(valor) {
    const fecha = window.SmartPlanPagos.fechaDesdeIso(valor);
    return fecha ? formatoFecha.format(fecha) : "";
  }
  function agregarDato(contenedor, etiqueta, valor) {
    if (valor === null || valor === undefined || valor === "") return;
    const grupo = document.createElement("div"), dt = document.createElement("dt"), dd = document.createElement("dd");
    dt.textContent = etiqueta; dd.textContent = valor; grupo.append(dt, dd); contenedor.appendChild(grupo);
  }
  function valorCampo(nombre, respaldo) {
    const control = formulario.elements[nombre];
    return control && control.value.trim() ? control.value.trim() : respaldo;
  }
  function buildPdfFilename(nombre) {
    const limpio = String(nombre || "Cliente")
      .trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[\\/:*?"<>|]+/g, " ")
      .replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "Cliente";
    return "Propuesta_Comercial_Smart_" + limpio + ".pdf";
  }
  function beneficiosPresentables(proposal) {
    return (Array.isArray(proposal && proposal.beneficios) ? proposal.beneficios : []).filter(function (beneficio) {
      return beneficio && beneficio.esNinguno !== true;
    });
  }
  function getPrintDensity(proposal) {
    const registro = proposal && proposal.registro ? proposal.registro : {};
    const installments = registro.formaPago === "FINANCIADO" ? Number(registro.cuotas || (proposal.planPagos || []).length || 0) : 0;
    const benefitCount = beneficiosPresentables(proposal).length;
    const featureCount = registro.linea === "SMART_FLEX" ? 8 : 7;
    if (registro.formaPago !== "FINANCIADO") return "low";
    const contentWeight = installments + benefitCount * 2 + Math.max(0, featureCount - 7);
    return contentWeight >= 18 ? "high" : "medium";
  }
  function aplicarDensidadImpresion(pagina, proposal) {
    const density = getPrintDensity(proposal);
    pagina.classList.add("print-page");
    pagina.classList.remove("densidad-baja", "densidad-media", "densidad-alta", "density-low", "density-medium", "density-high", "pdf-compact", "pdf-dense");
    pagina.classList.add("density-" + density);
    pagina.dataset.printDensity = density;
  }
  function valorComercialBeneficios(beneficios) {
    return (Array.isArray(beneficios) ? beneficios : []).reduce(function (total, beneficio) {
      return total + (Number.isFinite(beneficio.valorComercial) ? beneficio.valorComercial : 0);
    }, 0);
  }
  function crearNodo(etiqueta, clase) {
    const nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    return nodo;
  }
  function iconoBeneficio(beneficio) {
    return beneficio.tipo === "EXAMEN" ? "certificado" : beneficio.tipo === "EBOOK" ? "libro" : beneficio.tipo === "CURSO_CORTO" ? "formacion" : "regalo";
  }
  function crearIconoLineal(tipo) {
    const svg = document.createElementNS("http:" + "//www.w3.org/2000/svg", "svg");
    const trazos = {
      certificado: '<path d="M7 3h10v11H7zM9.5 7h5M9.5 10h5M10 14l-1 7 3-2 3 2-1-7"/>',
      libro: '<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H12v17H7.5A3.5 3.5 0 0 0 4 22zM20 5.5A3.5 3.5 0 0 0 16.5 2H12v17h4.5A3.5 3.5 0 0 1 20 22z"/>',
      formacion: '<path d="m3 9 9-5 9 5-9 5zM7 12v5c3 2 7 2 10 0v-5M21 9v6"/>',
      regalo: '<path d="M4 10h16v11H4zM2 7h20v3H2zM12 7v14M12 7H8.5a2.5 2.5 0 1 1 2.2-3.7L12 7Zm0 0h3.5a2.5 2.5 0 1 0-2.2-3.7L12 7Z"/>',
      check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16.5 8.5"/>',
      ahorro: '<path d="M4 18V9m6 9V5m6 13v-7m4 7V3M2 21h20"/><path d="m4 8 5-4 6 5 5-6"/>',
      inversion: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M7 15h4"/>',
      pago: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/>',
      telefono: '<path d="M7.2 3.5 10 8 7.8 10.2c1.2 2.5 3.5 4.8 6 6l2.2-2.2 4.5 2.8-1.4 3.3c-.4.9-1.4 1.4-2.4 1.2C9.5 19.7 4.3 14.5 2.9 7.3c-.2-1 .3-2 1.2-2.4z"/>',
      docente: '<circle cx="9" cy="7" r="3"/><path d="M3 20c0-4 2-7 6-7s6 3 6 7M15 6h6v9h-4"/>',
      cambridge: '<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H12v17H7.5A3.5 3.5 0 0 0 4 22zM20 5.5A3.5 3.5 0 0 0 16.5 2H12v17h4.5A3.5 3.5 0 0 1 20 22z"/>',
      reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      medalla: '<circle cx="12" cy="9" r="5"/><path d="m8.5 13-1 8 4.5-2 4.5 2-1-8"/>',
      comunidad: '<circle cx="8" cy="9" r="3"/><circle cx="17" cy="8" r="2.5"/><path d="M2.5 20c.5-4 2.5-6 5.5-6s5 2 5.5 6M14 14c3 0 5 2 5.5 5"/>',
      constancia: '<path d="M6 3h12v13H6zM9 7h6M9 10h6M10 16l-1 5 3-2 3 2-1-5"/>',
      grupo: '<circle cx="12" cy="7" r="3"/><circle cx="5" cy="10" r="2"/><circle cx="19" cy="10" r="2"/><path d="M6 21c.3-5 2.3-8 6-8s5.7 3 6 8M1 20c.2-3 1.5-5 4-5M23 20c-.2-3-1.5-5-4-5"/>',
      laptop: '<rect x="4" y="4" width="16" height="12" rx="1"/><path d="M2 20h20M9 20l1-4h4l1 4"/>'
    };
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.6");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.classList.add("documento-beneficio-icono");
    svg.innerHTML = trazos[tipo] || trazos.regalo;
    return svg;
  }
  function nombrePlanEjecutivo(registro) {
    const plan = String(registro.plan || "").replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
    return plan || (registro.linea === "SMART_ONLINE" ? registro.meses + " meses" : "Plan Smart");
  }
  function presentacionBeneficio(beneficio) {
    const nombre = beneficio.nombrePresentacion || beneficio.nombre;
    if (beneficio.tipo === "EXAMEN") {
      const habilidades = /\d+\s+habilidad(?:es)?/i.exec(nombre);
      return { nombre: "LINGUASKILL", detalle: habilidades ? habilidades[0] : "Certificación" };
    }
    if (beneficio.tipo === "EBOOK") {
      const cantidad = /\d+/.exec(nombre);
      return { nombre: "E-BOOKS", detalle: cantidad ? cantidad[0] + (cantidad[0] === "1" ? " unidad" : " unidades") : "Sin unidades" };
    }
    if (beneficio.tipo === "CURSO_CORTO") return { nombre: nombre.toUpperCase(), detalle: "Curso corto" };
    return { nombre: nombre.toUpperCase(), detalle: "Beneficio vigente" };
  }

  function cantidadNivelesContratados(registro) {
    const coincidencia = /plan(?:\s+completo)?\s+(\d+)\s+nivel/i.exec(registro.plan || "");
    return coincidencia ? Number(coincidencia[1]) : Array.isArray(registro.niveles) ? registro.niveles.length : 0;
  }

  function configurarLogo() {
    const identidad = window.SMART_COMMERCIAL_CONFIG && window.SMART_COMMERCIAL_CONFIG.identidad;
    if (!identidad || identidad.logoDisponible !== true) return;
    const imagen = new Image();
    imagen.onload = function () {
      document.querySelectorAll(".documento-logo").forEach(function (logo) { logo.src = identidad.logoRuta; logo.style.display = "block"; });
      document.querySelectorAll(".documento-marca-fallback").forEach(function (fallback) { fallback.remove(); });
    };
    imagen.onerror = function () {
      document.querySelectorAll(".documento-logo").forEach(function (logo) { logo.removeAttribute("src"); logo.style.display = "none"; });
    };
    imagen.src = identidad.logoRuta;
  }

  function renderizarPrograma(datosCotizacion) {
    const registro = datosCotizacion.registro;
    texto("#propuesta-programa", registro.linea === "SMART_FLEX" ? "Smart Flex" : "Smart Online");
    texto("#propuesta-plan", nombrePlanEjecutivo(registro));
    texto("#propuesta-beneficio", registro.linea === "SMART_FLEX" ? beneficioFlex : beneficioOnline);
    const datos = elemento("#propuesta-datos-programa"); datos.innerHTML = "";
    if (registro.linea === "SMART_FLEX") {
      agregarDato(datos, "Modalidad comercial", registro.tipoTarifa === "SCORE" ? "Score" : "MP");
      agregarDato(datos, "Nivel de ingreso", registro.nivelIngreso);
      agregarDato(datos, "Niveles incluidos", registro.niveles.join(" · "));
      agregarDato(datos, "Horas de formación", registro.horas + " horas");
    } else {
      agregarDato(datos, "Acceso a plataforma", registro.meses + " meses");
    }
    const campana = (datosCotizacion.beneficios || []).find(function (beneficio) { return beneficio.tipo === "CAMPANA"; });
    let indicador = elemento("#propuesta-campana");
    if (!indicador) {
      indicador = crearNodo("p", "documento-campana");
      indicador.id = "propuesta-campana";
      elemento(".documento-programa").appendChild(indicador);
    }
    indicador.hidden = !campana;
    indicador.textContent = campana ? "Campaña vigente: " + (campana.nombrePresentacion || campana.nombre) : "";
  }

  function renderizarBeneficios(datos) {
    const contenedor = elemento("#propuesta-beneficios-seleccionados");
    const bloque = elemento("#propuesta-beneficios-bloque");
    contenedor.innerHTML = "";
    const beneficios = beneficiosPresentables(datos);
    bloque.hidden = beneficios.length === 0;
    beneficios.forEach(function (beneficio) {
      const tarjeta = document.createElement("div"), icono = crearIconoLineal(iconoBeneficio(beneficio)), contenido = crearNodo("div"), nombre = document.createElement("strong"), detalle = crearNodo("span", "documento-beneficio-detalle");
      const presentacion = presentacionBeneficio(beneficio);
      nombre.textContent = presentacion.nombre; detalle.textContent = presentacion.detalle;
      contenido.append(nombre, detalle);
      if (Number.isFinite(beneficio.valorComercial)) {
        const valor = crearNodo("em", "documento-beneficio-valor");
        valor.textContent = "Valor comercial " + formatoMoneda.format(beneficio.valorComercial);
        contenido.appendChild(valor);
      }
      tarjeta.append(icono, contenido);
      contenedor.appendChild(tarjeta);
    });
    let total = elemento("#propuesta-total-beneficios");
    if (!total) {
      total = crearNodo("div", "documento-beneficios-total");
      total.id = "propuesta-total-beneficios";
      bloque.appendChild(total);
    }
    const valorCuantificado = valorComercialBeneficios(beneficios);
    total.innerHTML = "";
    const cantidad = crearNodo("span"); cantidad.textContent = beneficios.length + (beneficios.length === 1 ? " BENEFICIO SELECCIONADO" : " BENEFICIOS SELECCIONADOS");
    total.appendChild(cantidad);
    if (valorCuantificado > 0) {
      const etiqueta = crearNodo("span"); etiqueta.textContent = "VALOR COMERCIAL TOTAL DE TUS BENEFICIOS";
      const valor = crearNodo("strong"); valor.textContent = formatoMoneda.format(valorCuantificado);
      total.append(etiqueta, valor);
    }
  }

  function renderizarInversion(datos) {
    const registro = datos.registro;
    const valorLista = Number.isFinite(datos.valorListaOficial) ? datos.valorListaOficial : registro.valorFullPlan;
    texto("#propuesta-valor-lista", Number.isFinite(valorLista) ? formatoMoneda.format(valorLista) : "No aplica");
    texto("#propuesta-descuento", registro.descuento === null ? "No aplica" : formatoPorcentaje.format(registro.descuento));
    texto("#propuesta-ahorro", Number.isFinite(datos.ahorro) && datos.ahorro >= 0 ? formatoMoneda.format(datos.ahorro) : "No aplica");
    elemento("#propuesta-ahorro").previousElementSibling.textContent = "Ahorro por descuento";
    texto("#propuesta-valor-final", formatoMoneda.format(registro.valorTotal));
    const detalle = elemento(".documento-inversion__detalle");
    let beneficios = elemento("#propuesta-valor-beneficios-fila");
    if (!beneficios) {
      beneficios = crearNodo("div"); beneficios.id = "propuesta-valor-beneficios-fila";
      const etiqueta = crearNodo("span"); etiqueta.textContent = "Beneficios incluidos";
      const valor = crearNodo("strong"); valor.id = "propuesta-valor-beneficios";
      beneficios.append(etiqueta, valor); detalle.appendChild(beneficios);
    }
    const valorBeneficios = valorComercialBeneficios(datos.beneficios);
    beneficios.hidden = valorBeneficios <= 0;
    texto("#propuesta-valor-beneficios", valorBeneficios > 0 ? formatoMoneda.format(valorBeneficios) : "");
    let recibido = elemento("#propuesta-valor-recibido-fila");
    if (!recibido) {
      recibido = crearNodo("div", "documento-valor-recibido"); recibido.id = "propuesta-valor-recibido-fila";
      const etiqueta = crearNodo("span"); etiqueta.textContent = "Valor total recibido";
      const valor = crearNodo("strong"); valor.id = "propuesta-valor-recibido";
      recibido.append(etiqueta, valor); detalle.appendChild(recibido);
    }
    const ahorroDescuento = Number.isFinite(datos.ahorro) ? datos.ahorro : 0;
    recibido.querySelector("span").textContent = "Tu ahorro total";
    texto("#propuesta-valor-recibido", formatoMoneda.format(ahorroDescuento + valorBeneficios));
    if (!recibido.querySelector(".documento-economia-icono")) {
      const iconoAhorro = crearIconoLineal("ahorro"); iconoAhorro.classList.add("documento-economia-icono"); recibido.prepend(iconoAhorro);
    }
    const inversionFinal = elemento(".documento-inversion__final");
    if (!inversionFinal.querySelector(".documento-economia-icono")) {
      const iconoInversion = crearIconoLineal("inversion"); iconoInversion.classList.add("documento-economia-icono"); inversionFinal.prepend(iconoInversion);
    }
    const bloquePago = elemento(".documento-pago-resumen > div:first-child");
    if (bloquePago && !bloquePago.querySelector(".documento-pago-icono")) {
      const iconoPago = crearIconoLineal("pago"); iconoPago.classList.add("documento-pago-icono"); bloquePago.prepend(iconoPago);
    }
    texto("#propuesta-forma-pago", registro.formaPago === "CONTADO" ? "Pago único" : "Financiado");
    const resumen = elemento("#propuesta-resumen-pago"); resumen.innerHTML = "";
    if (registro.formaPago === "CONTADO") {
      agregarDato(resumen, "Valor del pago", formatoMoneda.format(registro.valorTotal));
      agregarDato(resumen, "Fecha", fechaLegible(datos.fechaPago));
    } else {
      agregarDato(resumen, "Cuotas", String(registro.cuotas));
      agregarDato(resumen, "Pago inicial", formatoMoneda.format(datos.primeraCuota));
      if (datos.planPagos.length > 1) agregarDato(resumen, "Próximo pago", formatoMoneda.format(datos.planPagos[1].valor) + " · " + fechaLegible(datos.planPagos[1].fecha));
    }
  }

  function renderizarIndicadores(datos) {
    let seccion = elemento("#propuesta-indicadores");
    if (seccion) seccion.remove();
  }

  function renderizarPagos(datos) {
    const registro = datos.registro, contenedor = elemento("#propuesta-pagos"); contenedor.innerHTML = "";
    texto("#propuesta-total-control", formatoMoneda.format(registro.valorTotal));
    if (registro.formaPago === "CONTADO") {
      texto("#propuesta-titulo-pagos", "Detalle del pago único");
      const unico = document.createElement("div"); unico.className = "documento-pago-unico";
      const fecha = document.createElement("span"), valor = document.createElement("strong"); fecha.textContent = "Fecha de pago · " + fechaLegible(datos.fechaPago); valor.textContent = formatoMoneda.format(registro.valorTotal); unico.append(fecha, valor); contenedor.appendChild(unico); elemento(".documento-plan").hidden = true; renderizarAmortizacion(datos); return;
    }
    texto("#propuesta-titulo-pagos", "Resumen del plan de pagos");
    const plan = datos.planPagos, primera = plan[0], segunda = plan[1], ultima = plan[plan.length - 1];
    function item(etiqueta, valor, destacado) {
      const tarjeta = document.createElement("div"), nombre = document.createElement("span"), dato = document.createElement("strong");
      if (destacado) tarjeta.className = "documento-pago-resumen__total";
      nombre.textContent = etiqueta; dato.textContent = valor; tarjeta.append(nombre, dato); contenedor.appendChild(tarjeta);
    }
    item("Primera cuota y fecha", formatoMoneda.format(primera.valor) + " · " + fechaLegible(primera.fecha));
    item("Número de cuotas", String(registro.cuotas));
    item("Cuotas posteriores", segunda ? formatoMoneda.format(segunda.valor) : "No aplica");
    item("Segunda fecha de pago", segunda ? fechaLegible(segunda.fecha) : "No aplica");
    item("Día habitual de pago", segunda ? "Día " + window.SmartPlanPagos.fechaDesdeIso(segunda.fecha).getDate() + " de cada mes" : "No aplica");
    item("Última cuota y fecha", formatoMoneda.format(ultima.valor) + " · " + fechaLegible(ultima.fecha) + (ultima.tipo && ultima.tipo.indexOf("ajuste de cierre") !== -1 ? " · Ajuste de cierre" : ""));
    item("Valor total", formatoMoneda.format(registro.valorTotal), true);
    elemento(".documento-plan").hidden = true;
    renderizarAmortizacion(datos);
  }

  function renderizarAmortizacion(datos) {
    let seccion = elemento("#propuesta-amortizacion-seccion");
    if (!seccion) {
      seccion = crearNodo("section", "documento-amortizacion"); seccion.id = "propuesta-amortizacion-seccion";
      const titulo = crearNodo("h2"); titulo.textContent = "Plan completo de pagos";
      const cuadricula = crearNodo("div", "documento-amortizacion__grid"); cuadricula.id = "propuesta-amortizacion";
      const total = crearNodo("div", "documento-amortizacion__total"); total.innerHTML = '<span>Total pagado</span><strong id="propuesta-amortizacion-total"></strong>';
      seccion.append(titulo, cuadricula, total); elemento(".documento-plan").insertAdjacentElement("afterend", seccion);
    }
    seccion.hidden = datos.registro.formaPago !== "FINANCIADO";
    const cuadricula = elemento("#propuesta-amortizacion"); cuadricula.innerHTML = "";
    const cantidadColumnas = datos.planPagos.length >= 18 ? 2 : 1;
    cuadricula.classList.toggle("documento-amortizacion__grid--doble", cantidadColumnas === 2);
    const tamanoBloque = Math.ceil(datos.planPagos.length / cantidadColumnas);
    Array.from({ length: cantidadColumnas }).forEach(function (_, columna) {
      const tabla = document.createElement("table");
      tabla.innerHTML = '<thead><tr><th scope="col">Cuota</th><th scope="col">Fecha</th><th scope="col">Valor</th></tr></thead><tbody></tbody>';
      const cuerpo = tabla.querySelector("tbody");
      datos.planPagos.slice(columna * tamanoBloque, (columna + 1) * tamanoBloque).forEach(function (cuota, indiceLocal) {
        const indice = columna * tamanoBloque + indiceLocal;
        const fila = document.createElement("tr"), numero = document.createElement("th"), fecha = document.createElement("td"), valor = document.createElement("td");
        if (indice === 0) fila.classList.add("documento-amortizacion__primera");
        if (indice === datos.planPagos.length - 1) fila.classList.add("documento-amortizacion__ultima");
        numero.scope = "row";
        numero.textContent = indice === 0 ? "Primera cuota" : indice === datos.planPagos.length - 1 ? "Cuota final" + (cuota.tipo && cuota.tipo.indexOf("ajuste de cierre") !== -1 ? " — ajuste" : "") : "Cuota " + cuota.numero;
        fecha.textContent = fechaLegible(cuota.fecha); valor.textContent = formatoMoneda.format(cuota.valor); fila.append(numero, fecha, valor); cuerpo.appendChild(fila);
      });
      cuadricula.appendChild(tabla);
    });
    texto("#propuesta-amortizacion-total", formatoMoneda.format(datos.registro.valorTotal));
  }

  function renderizarCierreInstitucional(datos) {
    let seccion = elemento("#propuesta-incluye");
    if (!seccion) {
      seccion = crearNodo("section", "documento-incluye"); seccion.id = "propuesta-incluye";
      seccion.append(crearNodo("h2"), document.createElement("ul"));
      elemento(".documento-cierre").insertAdjacentElement("beforebegin", seccion);
      const firma = crearNodo("p", "documento-firma"); firma.textContent = "SMART · Understand the World."; elemento(".documento-cierre").appendChild(firma);
    }
    const online = datos.registro.linea === "SMART_ONLINE";
    seccion.querySelector("h2").textContent = online ? "Tu experiencia Smart Online incluye" : "Tu experiencia Smart Flex incluye";
    const caracteristicas = online ? [
      "Salas virtuales interactivas", "Interacción con otros estudiantes", "Grabación de clases", "Evaluación de pronunciación", "Clases grupales de explicación", "App de autoestudio", "Acompañamiento constante por parte del docente"
    ] : [
      "Clases en vivo con docentes calificados", "Contenido interactivo digital de Cambridge English", "Clases en vivo de 120 minutos", "Preparación para examen internacional Linguaskill", "SmartZone: espacios socioculturales de práctica", "Constancia de asistencia", "Grupos de máximo 8 estudiantes", "Sesiones de autoestudio en plataforma"
    ];
    const lista = seccion.querySelector("ul"); lista.innerHTML = "";
    const iconosOnline = ["laptop", "comunidad", "reloj", "docente", "grupo", "laptop", "docente"];
    const iconosFlex = ["docente", "cambridge", "reloj", "medalla", "comunidad", "constancia", "grupo", "laptop"];
    const iconos = online ? iconosOnline : iconosFlex;
    caracteristicas.forEach(function (item, indice) {
      const li = document.createElement("li"), icono = crearIconoLineal(iconos[indice] || "check"), textoItem = crearNodo("span");
      icono.classList.add("documento-caracteristica-icono"); textoItem.textContent = item; li.append(icono, textoItem); lista.appendChild(li);
    });
  }

  function renderizarDetalles(datos) {
    const registro = datos.registro, detalles = elemento("#propuesta-detalles"); detalles.innerHTML = "";
    agregarDato(detalles, "Condición comercial", registro.condicion);
    agregarDato(detalles, "Fecha de inicio", fechaLegible(datos.fechaPago));
  }

  function renderizarContactos() {
    let franja = elemento("#propuesta-contactos");
    if (!franja) {
      franja = crearNodo("section", "documento-contactos"); franja.id = "propuesta-contactos";
      ["cliente", "ejecutivo"].forEach(function (tipo) {
        const bloque = crearNodo("article", "documento-contacto"), etiqueta = crearNodo("span"), nombre = crearNodo("strong");
        etiqueta.textContent = tipo === "cliente" ? "CLIENTE" : "EJECUTIVO DE CUENTA";
        nombre.id = "propuesta-contacto-" + tipo + "-nombre";
        bloque.append(etiqueta, nombre); franja.appendChild(bloque);
      });
      elemento(".documento-bienvenida").insertAdjacentElement("beforebegin", franja);
    }
    texto("#propuesta-contacto-cliente-nombre", valorCampo("clienteNombre", "Nombre del cliente"));
    texto("#propuesta-contacto-ejecutivo-nombre", valorCampo("asesorNombre", "Nombre del Ejecutivo de Cuenta"));
    const bloqueEjecutivo = elemento("#propuesta-contacto-ejecutivo-nombre").parentElement;
    let telefono = bloqueEjecutivo.querySelector(".documento-ejecutivo-telefono");
    if (!telefono) {
      telefono = crearNodo("span", "documento-ejecutivo-telefono");
      const icono = crearIconoLineal("telefono"); icono.classList.add("documento-telefono-icono");
      telefono.append(icono, document.createElement("span")); bloqueEjecutivo.appendChild(telefono);
    }
    telefono.querySelector("span").textContent = valorCampo("asesorWhatsapp", "WhatsApp / celular");
  }

  function actualizarDatosPersonales() {
    if (!cotizacion) return;
    texto("#propuesta-cliente", valorCampo("clienteNombre", "Nombre del cliente"));
    texto("#propuesta-asesor", valorCampo("asesorNombre", "Tu asesor Smart"));
    texto("#propuesta-contacto-asesor", valorCampo("asesorWhatsapp", ""));
    renderizarContactos();
  }

  function renderizar() {
    if (!cotizacion) return;
    const registro = cotizacion.registro;
    const pagina = elemento(".propuesta-pagina");
    const financiado = registro.formaPago === "FINANCIADO";
    pagina.classList.toggle("pago-financiado", financiado);
    pagina.classList.toggle("pago-unico", !financiado);
    pagina.classList.toggle("con-amortizacion", financiado);
    pagina.classList.toggle("sin-amortizacion", !financiado);
    pagina.classList.toggle("linea-flex", registro.linea === "SMART_FLEX");
    pagina.classList.toggle("linea-online", registro.linea === "SMART_ONLINE");
    const beneficiosVisibles = beneficiosPresentables(cotizacion);
    pagina.classList.toggle("con-beneficios", beneficiosVisibles.length > 0);
    pagina.classList.toggle("sin-beneficios", beneficiosVisibles.length === 0);
    pagina.classList.toggle("amortizacion-larga", financiado && cotizacion.planPagos.length > 10);
    pagina.classList.toggle("amortizacion-corta", financiado && cotizacion.planPagos.length <= 10);
    const cantidadCuotas = financiado ? cotizacion.planPagos.length : 0;
    const cantidadBeneficios = beneficiosVisibles.length;
    aplicarDensidadImpresion(pagina, cotizacion);
    pagina.dataset.cuotas = String(cantidadCuotas);
    pagina.dataset.beneficios = String(cantidadBeneficios);
    pagina.dataset.nombreArchivo = buildPdfFilename(valorCampo("clienteNombre", "Cliente"));
    texto("#propuesta-fecha", fechaLegible(cotizacion.fechaPago));
    const referencia = "Referencia SMART-2026-" + registro.id.slice(0, 8).toUpperCase(); texto("#propuesta-referencia-pie", referencia);
    texto(".documento-saludo", "UNA PROPUESTA PENSADA PARA TI");
    renderizarPrograma(cotizacion); renderizarBeneficios(cotizacion); renderizarInversion(cotizacion); renderizarIndicadores(cotizacion); renderizarPagos(cotizacion); renderizarDetalles(cotizacion); renderizarCierreInstitucional(cotizacion); actualizarDatosPersonales(); configurarLogo();
  }

  function abrir() {
    if (!cotizacion) return;
    renderizar(); dialogo.showModal(); elemento("#cliente-nombre").focus();
  }
  function cerrar() { dialogo.close(); }
  function prepararImpresion() {
    document.body.classList.add("imprimiendo-propuesta");
  }
  function abrirVistaImpresion() {
    prepararImpresion();
    const documento = obtenerDocumentoImpresion();
    if (!documento) return;
    const destino = new URL("print.html", window.location.href);

    // Google Sites y otros contenedores cargan la aplicacion dentro de un
    // iframe que puede bloquear window.print(). En ese caso abrimos la vista
    // de impresion como pagina de nivel superior y transportamos el documento
    // en el fragmento (el fragmento nunca se envia al servidor).
    let embebida = false;
    try {
      embebida = window.self !== window.top;
    } catch (error) {
      embebida = true;
    }

    if (embebida) {
      destino.hash = "documento=" + encodeURIComponent(documento);
      const enlaceImpresion = document.createElement("a");
      enlaceImpresion.href = destino.href;
      enlaceImpresion.target = "_blank";
      enlaceImpresion.rel = "noopener noreferrer";
      enlaceImpresion.hidden = true;
      document.body.appendChild(enlaceImpresion);
      enlaceImpresion.click();
      enlaceImpresion.remove();
      document.body.classList.remove("imprimiendo-propuesta");
      return;
    }

    try {
      window.sessionStorage.setItem("smart.propuesta.impresion", documento);
    } catch (error) {
      destino.hash = "documento=" + encodeURIComponent(documento);
    }
    window.location.assign(destino.href);
  }
  function obtenerDocumentoImpresion() {
    const pagina = elemento(".propuesta-pagina");
    if (pagina) pagina.dataset.nombreArchivo = buildPdfFilename(valorCampo("clienteNombre", "Cliente"));
    return pagina ? pagina.outerHTML : "";
  }
  document.addEventListener("smart:cotizacion", function (evento) { cotizacion = evento.detail || null; });
  elemento("#imprimir-propuesta").addEventListener("click", function () {
    abrirVistaImpresion();
  });
  formulario.addEventListener("input", actualizarDatosPersonales);
  elemento("#cerrar-propuesta").addEventListener("click", cerrar);
  dialogo.addEventListener("cancel", function (evento) { evento.preventDefault(); cerrar(); });
  window.addEventListener("beforeprint", function () {
    if (dialogo.open) prepararImpresion();
  });
  window.addEventListener("afterprint", function () {
    document.body.classList.remove("imprimiendo-propuesta");
  });

  window.SmartPropuesta = Object.freeze({ abrir: abrir, obtenerDocumentoImpresion: obtenerDocumentoImpresion, getPrintDensity: getPrintDensity });
})();
