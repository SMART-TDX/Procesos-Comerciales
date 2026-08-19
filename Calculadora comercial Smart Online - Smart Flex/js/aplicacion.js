(function () {
  "use strict";

  const catalogo = window.SMART_TARIFAS;
  const validaciones = window.SmartValidaciones;
  const pagos = window.SmartPlanPagos;
  const motorComercial = window.SmartMotorComercial;
  const configuracionComercial = window.SMART_COMMERCIAL_CONFIG;
  const moneda = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 2 });
  const porcentaje = new Intl.NumberFormat("es-CO", { style: "percent", maximumFractionDigits: 2 });
  const fechaVisible = new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" });
  const ordenNivel = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const ordenCondicion = ["Público", "Alianza masiva", "Alianza empresarial", "Preventa", "Colaborador", "Convenios"];
  const nombres = { SMART_ONLINE: "Smart Online", SMART_FLEX: "Smart Flex", SCORE: "Score", MP: "MP", CONTADO: "Pago único", FINANCIADO: "Financiado" };
  const definicionPasos = {
    linea: ["Comencemos", "Selecciona la línea de estudio", "Elige el programa que necesita el cliente."],
    duracion: ["Programa", "Selecciona la duración", "Elige el tiempo de acceso oficial de Smart Online."],
    nivel: ["Programa", "Selecciona el nivel de ingreso", "Esta información determina los planes que pueden ofrecerse."],
    tipoTarifa: ["Modalidad comercial", "Selecciona la tarifa", "Elige Score o MP según la negociación."],
    plan: ["Programa", "Selecciona el plan", "Solo aparecen planes compatibles con las decisiones anteriores."],
    condicion: ["Negociación", "Selecciona la condición comercial", "Las opciones conservan el orden comercial oficial."],
    pago: ["Inversión", "Define la forma de pago", "Completa únicamente los datos necesarios para esta modalidad."],
    beneficios: ["Valor agregado", "Beneficios disponibles", "Selecciona únicamente lo que entregarás al cliente."],
    resumen: ["Revisión", "Confirma la propuesta", "Verifica el programa, la inversión y los beneficios antes de continuar."],
    propuesta: ["Cierre", "Prepara la propuesta comercial", "Revisa la información y abre la vista previa personalizada."]
  };

  const $ = function (selector) { return document.querySelector(selector); };
  const estadoInicial = function () {
    return { linea: "", nivelIngreso: "", tipoTarifa: "", planId: "", condicion: "", formaPago: "", cuotas: "", primeraCuota: "", fechaPago: pagos.fechaIso(new Date()), segundaFecha: "", beneficios: [], paso: 0, cotizacion: null };
  };
  let estado = estadoInicial();
  let toastTemporizador = null;

  function flujo() {
    if (estado.linea === "SMART_FLEX") return ["linea", "nivel", "tipoTarifa", "plan", "condicion", "pago", "beneficios", "resumen", "propuesta"];
    return ["linea", "duracion", "condicion", "pago", "beneficios", "resumen", "propuesta"];
  }

  function registros(filtros) {
    return catalogo.registros.filter(function (registro) {
      return Object.keys(filtros).every(function (clave) { return filtros[clave] === "" || filtros[clave] === null || registro[clave] === filtros[clave]; });
    });
  }

  function contextoHasta(campo) {
    const contexto = {};
    const orden = ["linea", "nivelIngreso", "tipoTarifa", "planId", "condicion", "formaPago", "cuotas"];
    const limite = orden.indexOf(campo);
    orden.forEach(function (clave, indice) { if (indice <= limite && estado[clave] !== "") contexto[clave] = clave === "cuotas" ? Number(estado[clave]) : estado[clave]; });
    return contexto;
  }

  function unicos(lista) { return Array.from(new Set(lista.filter(function (valor) { return valor !== null && valor !== undefined && valor !== ""; }))); }
  function nombreBeneficio(beneficio) { return beneficio.nombrePresentacion || beneficio.nombre; }
  function valorComercialBeneficios(beneficios) {
    return beneficios.reduce(function (total, beneficio) {
      return total + (Number.isFinite(beneficio.valorComercial) ? beneficio.valorComercial : 0);
    }, 0);
  }
  function valorListaOficial(registro) {
    if (Number.isFinite(registro.valorFullPlan)) return registro.valorFullPlan;
    const referencia = catalogo.registros.find(function (candidato) {
      return candidato.linea === registro.linea && candidato.planId === registro.planId && Number.isFinite(candidato.valorFullPlan);
    });
    return referencia ? referencia.valorFullPlan : null;
  }
  function resumenBeneficio(beneficio) {
    const nombre = nombreBeneficio(beneficio);
    return Number.isFinite(beneficio.valorComercial) ? nombre + " · Valor comercial " + moneda.format(beneficio.valorComercial) : nombre;
  }
  function iconoBeneficio(beneficio) {
    return beneficio.tipo === "EXAMEN" ? "certificado" : beneficio.tipo === "EBOOK" ? "libro" : beneficio.tipo === "CURSO_CORTO" ? "formacion" : "regalo";
  }
  function ordenarCondiciones(a, b) { const ia = ordenCondicion.indexOf(a), ib = ordenCondicion.indexOf(b); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); }
  function registroActual() { const lista = registros(contextoHasta("cuotas")); return validaciones.cotizacionUnica(lista) ? lista[0] : null; }
  function planActual() { return registros(contextoHasta("planId"))[0] || null; }

  function limpiarDesde(nombre) {
    const dependencias = {
      linea: ["nivelIngreso", "tipoTarifa", "planId", "condicion", "formaPago", "cuotas", "primeraCuota", "segundaFecha", "beneficios", "cotizacion"],
      nivel: ["tipoTarifa", "planId", "condicion", "formaPago", "cuotas", "primeraCuota", "segundaFecha", "beneficios", "cotizacion"],
      tipoTarifa: ["planId", "condicion", "formaPago", "cuotas", "primeraCuota", "segundaFecha", "beneficios", "cotizacion"],
      plan: ["condicion", "formaPago", "cuotas", "primeraCuota", "segundaFecha", "beneficios", "cotizacion"],
      condicion: ["formaPago", "cuotas", "primeraCuota", "segundaFecha", "beneficios", "cotizacion"],
      pago: ["beneficios", "cotizacion"]
    };
    (dependencias[nombre] || []).forEach(function (clave) { estado[clave] = Array.isArray(estado[clave]) ? [] : clave === "cotizacion" ? null : ""; });
  }

  function mostrarVista(nombre) {
    ["dashboard", "asistente", "informacion"].forEach(function (vista) { $("#vista-" + vista).hidden = vista !== nombre; });
    window.scrollTo(0, 0);
  }

  function mostrarToast(texto) {
    const toast = $("#toast");
    toast.textContent = texto;
    toast.hidden = false;
    clearTimeout(toastTemporizador);
    toastTemporizador = setTimeout(function () { toast.hidden = true; }, 3200);
  }

  function crearBotonOpcion(opcion) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "opcion-card" + (opcion.seleccionada ? " opcion-card--activa" : "");
    boton.dataset.valor = opcion.valor;
    boton.dataset.accion = opcion.accion || "seleccionar";
    boton.setAttribute("aria-pressed", String(Boolean(opcion.seleccionada)));
    const icono = document.createElement("span"); icono.className = "opcion-card__icono"; icono.setAttribute("aria-hidden", "true");
    if (opcion.iconoTipo) { icono.classList.add("icono-css"); icono.dataset.icono = opcion.iconoTipo; } else { icono.textContent = opcion.icono || "◇"; }
    const contenido = document.createElement("span"); contenido.className = "opcion-card__contenido";
    const titulo = document.createElement("strong"); titulo.textContent = opcion.titulo;
    contenido.appendChild(titulo);
    if (opcion.descripcion) { const descripcion = document.createElement("small"); descripcion.textContent = opcion.descripcion; contenido.appendChild(descripcion); }
    const estadoOpcion = document.createElement("span"); estadoOpcion.className = "opcion-card__estado"; estadoOpcion.setAttribute("aria-hidden", "true"); estadoOpcion.textContent = opcion.seleccionada ? "✓" : "→";
    boton.append(icono, contenido, estadoOpcion);
    return boton;
  }

  function pintarOpciones(opciones, columnas) {
    const contenedor = $("#opciones-paso");
    contenedor.innerHTML = "";
    contenedor.className = "opciones-grid" + (columnas === 3 ? " opciones-grid--tres" : "");
    opciones.forEach(function (opcion) { contenedor.appendChild(crearBotonOpcion(opcion)); });
  }

  function accionSecundaria(texto, accion) {
    const boton = document.createElement("button"); boton.type = "button"; boton.className = "boton-secundario"; boton.dataset.accion = accion; boton.textContent = texto; return boton;
  }

  function accionPrincipal(texto, accion) {
    const boton = document.createElement("button"); boton.type = "button"; boton.className = "boton-principal"; boton.dataset.accion = accion; boton.textContent = texto; return boton;
  }

  function avanzar() {
    estado.paso = Math.min(estado.paso + 1, flujo().length - 1);
    renderizar();
    requestAnimationFrame(function () { $("#paso-actual").focus(); });
  }

  function irAPaso(indice) {
    if (indice < 0 || indice >= flujo().length) return;
    estado.paso = indice;
    renderizar();
    requestAnimationFrame(function () { $("#paso-actual").focus(); });
  }

  function configurarPaso() {
    const clave = flujo()[estado.paso] || "linea";
    const definicion = definicionPasos[clave];
    $("#paso-kicker").textContent = definicion[0];
    $("#paso-titulo").textContent = definicion[1];
    $("#paso-descripcion").textContent = definicion[2];
    $("#opciones-paso").innerHTML = "";
    $("#contenido-paso").innerHTML = "";
    $("#acciones-paso").innerHTML = "";
    $("#mensaje-paso").textContent = "";
    $("#mensaje-paso").className = "mensaje-paso";
    const anterior = $("#paso-anterior");
    if (estado.paso > 0) { anterior.hidden = false; anterior.innerHTML = ""; const texto = document.createElement("span"); texto.textContent = "✓ " + definicionPasos[flujo()[estado.paso - 1]][1]; const editar = document.createElement("button"); editar.type = "button"; editar.dataset.editarIndice = String(estado.paso - 1); editar.textContent = "Editar"; anterior.append(texto, editar); } else anterior.hidden = true;
    if (clave === "linea") renderLinea();
    if (clave === "duracion") renderDuracion();
    if (clave === "nivel") renderNivel();
    if (clave === "tipoTarifa") renderTipoTarifa();
    if (clave === "plan") renderPlan();
    if (clave === "condicion") renderCondicion();
    if (clave === "pago") renderPago();
    if (clave === "beneficios") renderBeneficios();
    if (clave === "resumen") renderResumenFinal();
    if (clave === "propuesta") renderPrepararPropuesta();
  }

  function renderLinea() {
    pintarOpciones([
      { valor: "SMART_ONLINE", titulo: "Smart Online", descripcion: "Programa por tiempo de acceso.", icono: "◉", seleccionada: estado.linea === "SMART_ONLINE", accion: "seleccionar-linea" },
      { valor: "SMART_FLEX", titulo: "Smart Flex", descripcion: "Programa flexible por niveles.", icono: "◆", seleccionada: estado.linea === "SMART_FLEX", accion: "seleccionar-linea" }
    ]);
  }

  function renderDuracion() {
    const mapa = new Map();
    registros({ linea: "SMART_ONLINE" }).forEach(function (r) { mapa.set(r.planId, { titulo: r.meses + " meses", descripcion: r.plan }); });
    pintarOpciones(Array.from(mapa, function (entrada) { return { valor: entrada[0], titulo: entrada[1].titulo, descripcion: entrada[1].descripcion, icono: "◷", seleccionada: estado.planId === entrada[0], accion: "seleccionar-plan" }; }).sort(function (a, b) { return Number(a.titulo.split(" ")[0]) - Number(b.titulo.split(" ")[0]); }), 3);
  }

  function renderNivel() {
    const niveles = unicos(registros({ linea: "SMART_FLEX" }).map(function (r) { return r.nivelIngreso; })).sort(function (a, b) { return ordenNivel.indexOf(a) - ordenNivel.indexOf(b); });
    pintarOpciones(niveles.map(function (nivel) { return { valor: nivel, titulo: "Nivel " + nivel, descripcion: "Nivel de ingreso del estudiante", icono: "◎", seleccionada: estado.nivelIngreso === nivel, accion: "seleccionar-nivel" }; }), 3);
  }

  function renderTipoTarifa() {
    const tipos = unicos(registros(contextoHasta("nivelIngreso")).map(function (r) { return r.tipoTarifa; })).sort();
    pintarOpciones(tipos.map(function (tipo) { return { valor: tipo, titulo: tipo, descripcion: "Modalidad comercial " + nombres[tipo], icono: tipo === "SCORE" ? "S" : "M", seleccionada: estado.tipoTarifa === tipo, accion: "seleccionar-tarifa" }; }));
  }

  function renderPlan() {
    const base = estado.linea === "SMART_FLEX" ? registros(contextoHasta("tipoTarifa")) : registros({ linea: "SMART_ONLINE" });
    const mapa = new Map();
    base.forEach(function (r) { if (!mapa.has(r.planId)) mapa.set(r.planId, r); });
    const opciones = Array.from(mapa.values()).sort(function (a, b) { return a.plan.localeCompare(b.plan, "es", { numeric: true }); }).map(function (r) {
      const detalle = r.linea === "SMART_FLEX" ? [r.niveles.join(" · "), r.horas + " horas de formación"].filter(Boolean).join(" · ") : r.meses + " meses de acceso";
      return { valor: r.planId, titulo: r.plan, descripcion: detalle, icono: "▤", seleccionada: estado.planId === r.planId, accion: "seleccionar-plan" };
    });
    pintarOpciones(opciones, opciones.length > 2 ? 3 : 2);
  }

  function renderCondicion() {
    const condiciones = unicos(registros(contextoHasta("planId")).map(function (r) { return r.condicion; })).sort(ordenarCondiciones);
    pintarOpciones(condiciones.map(function (condicion) { return { valor: condicion, titulo: condicion, descripcion: "Condición oficial disponible", icono: "◇", seleccionada: estado.condicion === condicion, accion: "seleccionar-condicion" }; }), condiciones.length > 2 ? 3 : 2);
  }

  function crearCampo(etiqueta, tipo, id, valor, ayuda) {
    const grupo = document.createElement("label"); grupo.className = "campo-hub"; grupo.htmlFor = id;
    const titulo = document.createElement("span"); titulo.textContent = etiqueta;
    const input = document.createElement("input"); input.type = tipo; input.id = id; input.value = valor || "";
    grupo.append(titulo, input);
    if (ayuda) { const small = document.createElement("small"); small.textContent = ayuda; grupo.appendChild(small); }
    return grupo;
  }

  function renderPago() {
    const contenido = $("#contenido-paso"), acciones = $("#acciones-paso");
    const formas = unicos(registros(contextoHasta("condicion")).map(function (r) { return r.formaPago; }));
    pintarOpciones(formas.map(function (forma) { return { valor: forma, titulo: nombres[forma], descripcion: forma === "CONTADO" ? "Un solo pago por el valor oficial" : "Distribución en cuotas oficiales", icono: forma === "CONTADO" ? "$" : "▦", seleccionada: estado.formaPago === forma, accion: "seleccionar-pago" }; }));
    if (!estado.formaPago) return;
    const panel = document.createElement("div"); panel.className = "pago-configuracion";
    const tituloCuotas = document.createElement("h3"); tituloCuotas.textContent = estado.formaPago === "CONTADO" ? "Detalle del pago" : "Número de cuotas"; panel.appendChild(tituloCuotas);
    const cuotas = unicos(registros(contextoHasta("formaPago")).map(function (r) { return r.cuotas; })).sort(function (a, b) { return a - b; });
    const cuotasGrid = document.createElement("div"); cuotasGrid.className = "chips-cuotas";
    cuotas.forEach(function (cantidad) { const boton = document.createElement("button"); boton.type = "button"; boton.className = "chip" + (Number(estado.cuotas) === cantidad ? " chip--activo" : ""); boton.dataset.accion = "seleccionar-cuotas"; boton.dataset.valor = String(cantidad); boton.textContent = cantidad === 1 ? "1 cuota" : cantidad + " cuotas"; cuotasGrid.appendChild(boton); });
    panel.appendChild(cuotasGrid);
    if (!estado.cuotas && cuotas.length === 1) estado.cuotas = String(cuotas[0]);
    const r = registroActual();
    if (r) {
      if (r.formaPago === "FINANCIADO") {
        const minimo = Math.ceil(r.cuotaInicial);
        if (!estado.primeraCuota) estado.primeraCuota = String(minimo);
        const grid = document.createElement("div"); grid.className = "campos-grid";
        const primera = crearCampo("Primera cuota", "number", "campo-primera-cuota", estado.primeraCuota, "Mínimo oficial: " + moneda.format(minimo)); primera.querySelector("input").min = String(minimo); primera.querySelector("input").max = String(r.valorTotal); primera.querySelector("input").step = "0.01"; grid.appendChild(primera);
        grid.appendChild(crearCampo("Fecha de cotización y primer pago", "date", "campo-fecha-pago", estado.fechaPago));
        if (Number(estado.primeraCuota) < r.valorTotal) { const segunda = crearCampo("Fecha de segunda cuota", "date", "campo-segunda-fecha", estado.segundaFecha, "Entre 30 y 40 días después del primer pago."); const input = segunda.querySelector("input"); input.min = pagos.sumarDias(estado.fechaPago, 30); input.max = pagos.sumarDias(estado.fechaPago, 40); grid.appendChild(segunda); }
        panel.appendChild(grid);
      } else {
        panel.appendChild(crearCampo("Fecha de cotización y pago", "date", "campo-fecha-pago", estado.fechaPago));
      }
      const evaluacion = evaluarPago(r);
      if (evaluacion.error) { const error = document.createElement("p"); error.className = "error-inline"; error.textContent = evaluacion.error; panel.appendChild(error); }
      if (evaluacion.plan.length) panel.appendChild(crearVistaPagos(evaluacion.plan, r.valorTotal));
      acciones.append(accionSecundaria("Atrás", "atras"), accionPrincipal("Continuar a beneficios", "confirmar-pago"));
      acciones.querySelector("[data-accion='confirmar-pago']").disabled = Boolean(evaluacion.error);
    }
    contenido.appendChild(panel);
  }

  function evaluarPago(registro) {
    try {
      const primera = registro.formaPago === "CONTADO" ? registro.valorTotal : Number(estado.primeraCuota);
      const errorPrimera = registro.formaPago === "FINANCIADO" ? pagos.validarPrimeraCuota(primera, Math.ceil(registro.cuotaInicial), registro.valorTotal) : "";
      if (errorPrimera) return { error: errorPrimera, plan: [] };
      if (!pagos.fechaDesdeIso(estado.fechaPago)) return { error: "Selecciona una fecha de pago válida.", plan: [] };
      const requiereSegunda = registro.formaPago === "FINANCIADO" && pagos.aCentavos(primera) < pagos.aCentavos(registro.valorTotal) && registro.cuotas > 1;
      if (requiereSegunda) { const errorFecha = pagos.validarSegundaFecha(estado.fechaPago, estado.segundaFecha); if (errorFecha) return { error: errorFecha, plan: [] }; }
      const plan = pagos.generarPlanPagos(registro.valorTotal, primera, registro.cuotas, estado.fechaPago, estado.segundaFecha);
      const suma = plan.reduce(function (total, cuota) { return total + pagos.aCentavos(cuota.valor); }, 0);
      if (suma !== pagos.aCentavos(registro.valorTotal)) return { error: "El plan no coincide con el valor total oficial.", plan: [] };
      return { error: "", plan: plan, primera: primera };
    } catch (error) { return { error: error.message, plan: [] }; }
  }

  function crearVistaPagos(plan, total) {
    const seccion = document.createElement("section"); seccion.className = "plan-visual";
    const cabecera = document.createElement("div"); cabecera.className = "plan-visual__cabecera"; const titulo = document.createElement("h3"); titulo.textContent = plan.length === 1 ? "Pago único" : "Plan de pagos"; const totalNodo = document.createElement("strong"); totalNodo.textContent = moneda.format(total); cabecera.append(titulo, totalNodo); seccion.appendChild(cabecera);
    const lista = document.createElement("div"); lista.className = "plan-visual__lista";
    plan.forEach(function (cuota, indice) { const tarjeta = document.createElement("article"); tarjeta.className = "cuota-card" + (indice === 0 || indice === plan.length - 1 ? " cuota-card--especial" : ""); const numero = document.createElement("span"); numero.textContent = plan.length === 1 ? "Pago único" : indice === 0 ? "Primera cuota" : indice === plan.length - 1 ? "Última cuota" : "Cuota " + cuota.numero; const valor = document.createElement("strong"); valor.textContent = moneda.format(cuota.valor); const fecha = document.createElement("small"); fecha.textContent = fechaVisible.format(pagos.fechaDesdeIso(cuota.fecha)); const tipo = document.createElement("em"); tipo.textContent = cuota.tipo; tarjeta.append(numero, valor, fecha, tipo); lista.appendChild(tarjeta); });
    seccion.appendChild(lista); const control = document.createElement("p"); control.className = "reconciliacion"; control.textContent = "✓ Total reconciliado exactamente"; seccion.appendChild(control); return seccion;
  }

  function construirCotizacion() {
    const r = registroActual();
    if (!r) return null;
    const evaluacion = evaluarPago(r);
    if (evaluacion.error) return null;
    const valorLista = valorListaOficial(r);
    const ahorro = Number.isFinite(valorLista) ? valorLista - r.valorTotal : null;
    const disponibles = motorComercial.beneficiosDisponibles(configuracionComercial, r);
    estado.beneficios = motorComercial.reconciliarSeleccion(estado.beneficios, disponibles);
    return { registro: r, valorListaOficial: valorLista, primeraCuota: evaluacion.primera, planPagos: evaluacion.plan, fechaPago: estado.fechaPago, segundaFecha: estado.segundaFecha, ahorro: ahorro, beneficios: disponibles.filter(function (b) { return estado.beneficios.includes(b.id); }), campana: motorComercial.campanaVigente(configuracionComercial, r) };
  }

  function renderBeneficios() {
    estado.cotizacion = construirCotizacion();
    if (!estado.cotizacion) { mostrarErrorPaso("La cotización requiere revisar la forma de pago."); $("#acciones-paso").append(accionSecundaria("Revisar pago", "atras")); return; }
    const disponibles = motorComercial.beneficiosDisponibles(configuracionComercial, estado.cotizacion.registro);
    if (!disponibles.length) {
      const vacio = document.createElement("div"); vacio.className = "estado-vacio"; vacio.innerHTML = "<span aria-hidden='true'>◇</span><h3>Sin beneficios disponibles</h3><p>Continúa con la propuesta oficial. No se agregarán beneficios no autorizados.</p>"; $("#contenido-paso").appendChild(vacio);
    } else {
      $("#paso-descripcion").textContent = "Para esta negociación puedes ofrecer:";
      pintarOpciones(disponibles.map(function (beneficio) { return { valor: beneficio.id, titulo: beneficio.nombre, descripcion: Number.isFinite(beneficio.valorComercial) && beneficio.valorComercial > 0 ? "Valor comercial " + moneda.format(beneficio.valorComercial) : beneficio.descripcion, iconoTipo: iconoBeneficio(beneficio), seleccionada: estado.beneficios.includes(beneficio.id), accion: "alternar-beneficio" }; }), disponibles.length > 2 ? 3 : 2);
    }
    $("#acciones-paso").append(accionSecundaria("Atrás", "atras"), accionPrincipal(disponibles.length ? "Continuar con estos beneficios" : "Continuar al resumen", "confirmar-beneficios"));
  }

  function renderResumenFinal() {
    estado.cotizacion = construirCotizacion();
    if (!estado.cotizacion) { mostrarErrorPaso("No fue posible consolidar la cotización."); return; }
    const c = estado.cotizacion, r = c.registro, contenido = $("#contenido-paso");
    const grid = document.createElement("div"); grid.className = "revision-grid";
    grid.append(crearBloqueRevision("Programa", resumenProgramaTexto(r), r.linea === "SMART_FLEX" ? 3 : 1));
    grid.append(crearBloqueRevision("Condición y pago", r.condicion + " · " + nombres[r.formaPago] + (r.formaPago === "FINANCIADO" ? " · " + r.cuotas + " cuotas" : ""), flujo().indexOf("condicion")));
    grid.append(crearBloqueRevision("Inversión", "Valor final " + moneda.format(r.valorTotal) + (r.descuento === null ? "" : " · Descuento " + porcentaje.format(r.descuento)), flujo().indexOf("pago")));
    grid.append(crearBloqueRevision("Beneficios", c.beneficios.length ? c.beneficios.map(resumenBeneficio).join(" · ") : "Sin beneficios seleccionados", flujo().indexOf("beneficios")));
    contenido.appendChild(grid);
    if (c.planPagos.length) contenido.appendChild(crearVistaPagos(c.planPagos, r.valorTotal));
    $("#acciones-paso").append(accionSecundaria("Copiar resumen", "copiar-resumen"), accionSecundaria("Atrás", "atras"), accionPrincipal("Continuar a preparar propuesta", "confirmar-resumen"));
  }

  function crearBloqueRevision(tituloTexto, contenidoTexto, indice) {
    const bloque = document.createElement("article"); bloque.className = "revision-card"; const cabecera = document.createElement("div"); const titulo = document.createElement("h3"); titulo.textContent = tituloTexto; const editar = document.createElement("button"); editar.type = "button"; editar.dataset.editarIndice = String(indice); editar.textContent = "Editar"; cabecera.append(titulo, editar); const p = document.createElement("p"); p.textContent = contenidoTexto; bloque.append(cabecera, p); return bloque;
  }

  function resumenProgramaTexto(r) {
    if (r.linea === "SMART_ONLINE") return "Smart Online · " + r.meses + " meses";
    return "Smart Flex · Modalidad comercial " + nombres[r.tipoTarifa] + " · Nivel " + r.nivelIngreso + " · " + r.plan;
  }

  function renderPrepararPropuesta() {
    estado.cotizacion = construirCotizacion();
    if (!estado.cotizacion) { mostrarErrorPaso("La cotización dejó de ser válida. Regresa al resumen."); return; }
    const contenido = $("#contenido-paso"), tarjeta = document.createElement("div"); tarjeta.className = "preparar-card";
    const icono = document.createElement("span"); icono.textContent = "✓"; icono.setAttribute("aria-hidden", "true"); const titulo = document.createElement("h3"); titulo.textContent = "Cotización lista"; const p = document.createElement("p"); p.textContent = "La vista previa solicitará los datos del cliente y del asesor antes de imprimir o guardar como PDF."; const valor = document.createElement("strong"); valor.textContent = moneda.format(estado.cotizacion.registro.valorTotal); tarjeta.append(icono, titulo, p, valor); contenido.appendChild(tarjeta);
    $("#acciones-paso").append(accionSecundaria("Volver al resumen", "atras"), accionPrincipal("Preparar Propuesta Comercial", "abrir-propuesta"));
  }

  function mostrarErrorPaso(texto) { const mensaje = $("#mensaje-paso"); mensaje.textContent = texto; mensaje.className = "mensaje-paso mensaje-paso--error"; }

  function actualizarProgreso() {
    const pasos = flujo(), actual = Math.min(estado.paso, pasos.length - 1), numero = actual + 1;
    $("#progreso-paso").textContent = "Paso " + numero + " de " + pasos.length;
    $("#progreso-etiqueta").textContent = definicionPasos[pasos[actual]][1];
    $("#progreso-barra").setAttribute("aria-valuemax", String(pasos.length)); $("#progreso-barra").setAttribute("aria-valuenow", String(numero)); $("#progreso-avance").style.width = (numero / pasos.length * 100) + "%";
    const lista = $("#progreso-pasos"); lista.innerHTML = "";
    pasos.forEach(function (paso, indice) { const li = document.createElement("li"); const boton = document.createElement("button"); boton.type = "button"; boton.dataset.editarIndice = String(indice); boton.disabled = indice > actual; boton.className = indice < actual ? "completo" : indice === actual ? "actual" : "pendiente"; const numeroPaso = document.createElement("span"); numeroPaso.textContent = indice < actual ? "✓" : String(indice + 1); const etiqueta = document.createElement("small"); etiqueta.textContent = definicionPasos[paso][1].replace("Selecciona la ", "").replace("Selecciona el ", "").replace("Define la ", ""); boton.append(numeroPaso, etiqueta); li.appendChild(boton); lista.appendChild(li); });
  }

  function agregarDato(resumen, etiqueta, valor, editarPaso) {
    if (valor === null || valor === undefined || valor === "") return;
    const fila = document.createElement("div"), dt = document.createElement("dt"), dd = document.createElement("dd"); dt.textContent = etiqueta; dd.textContent = valor; fila.append(dt, dd);
    if (Number.isInteger(editarPaso)) { const boton = document.createElement("button"); boton.type = "button"; boton.dataset.editarIndice = String(editarPaso); boton.setAttribute("aria-label", "Editar " + etiqueta); boton.textContent = "Editar"; fila.appendChild(boton); }
    resumen.appendChild(fila);
  }

  function actualizarResumen() {
    const programa = $("#resumen-programa"), inversion = $("#resumen-inversion"), beneficios = $("#resumen-beneficios"), pagosResumen = $("#resumen-pagos"); programa.innerHTML = ""; inversion.innerHTML = ""; beneficios.innerHTML = ""; pagosResumen.innerHTML = "";
    if (estado.linea) agregarDato(programa, "Programa", nombres[estado.linea], 0);
    if (estado.linea === "SMART_FLEX" && estado.nivelIngreso) agregarDato(programa, "Nivel de ingreso", estado.nivelIngreso, 1);
    if (estado.linea === "SMART_FLEX" && estado.tipoTarifa) agregarDato(programa, "Modalidad comercial", nombres[estado.tipoTarifa], 2);
    const rPlan = planActual();
    if (rPlan && estado.planId) { agregarDato(programa, estado.linea === "SMART_ONLINE" ? "Duración" : "Plan", estado.linea === "SMART_ONLINE" ? rPlan.meses + " meses" : rPlan.plan, estado.linea === "SMART_ONLINE" ? 1 : 3); if (estado.linea === "SMART_FLEX") { agregarDato(programa, "Niveles", rPlan.niveles.join(" · ")); agregarDato(programa, "Horas", rPlan.horas + " horas"); } }
    if (estado.condicion) agregarDato(programa, "Condición", estado.condicion, flujo().indexOf("condicion"));
    if (estado.formaPago) agregarDato(programa, "Forma de pago", nombres[estado.formaPago], flujo().indexOf("pago"));
    const c = construirCotizacion();
    if (c) {
      estado.cotizacion = c; const r = c.registro;
      agregarDato(inversion, "Precio oficial", Number.isFinite(c.valorListaOficial) ? moneda.format(c.valorListaOficial) : "No informado");
      agregarDato(inversion, "Descuento", r.descuento === null ? "No informado" : porcentaje.format(r.descuento));
      agregarDato(inversion, "Ahorro", Number.isFinite(c.ahorro) && c.ahorro >= 0 ? moneda.format(c.ahorro) : "No informado");
      const valorBeneficios = valorComercialBeneficios(c.beneficios);
      if (valorBeneficios > 0) agregarDato(inversion, "Valor comercial de beneficios", moneda.format(valorBeneficios));
      if (Number.isFinite(c.ahorro)) agregarDato(inversion, "Ahorro total", moneda.format(c.ahorro + valorBeneficios));
      $("#resumen-total").textContent = moneda.format(r.valorTotal);
      c.beneficios.forEach(function (b) { const badge = document.createElement("span"); badge.className = "beneficio-mini"; badge.textContent = resumenBeneficio(b); beneficios.appendChild(badge); });
      if (!c.beneficios.length) beneficios.textContent = "Sin beneficios seleccionados";
      $("#resumen-pagos-seccion").hidden = !c.planPagos.length;
      c.planPagos.slice(0, 3).forEach(function (cuota, indice) { const fila = document.createElement("div"); const etiqueta = document.createElement("span"); etiqueta.textContent = c.planPagos.length === 1 ? "Pago único" : indice === 0 ? "Primera cuota" : indice === c.planPagos.length - 1 ? "Última cuota" : "Cuota " + cuota.numero; const valor = document.createElement("strong"); valor.textContent = moneda.format(cuota.valor); fila.append(etiqueta, valor); pagosResumen.appendChild(fila); });
      if (c.planPagos.length > 3) { const mas = document.createElement("small"); mas.textContent = "+ " + (c.planPagos.length - 3) + " cuotas en el detalle"; pagosResumen.appendChild(mas); }
      document.dispatchEvent(new CustomEvent("smart:cotizacion", { detail: c }));
    } else { $("#resumen-total").textContent = "—"; beneficios.textContent = estado.beneficios.length ? estado.beneficios.length + " seleccionados" : "Sin beneficios seleccionados"; $("#resumen-pagos-seccion").hidden = true; document.dispatchEvent(new CustomEvent("smart:cotizacion", { detail: null })); }
    $("#resumen-estado").textContent = estado.paso === flujo().length - 1 && c ? "Lista" : "En proceso";
  }

  function renderizar() { actualizarProgreso(); configurarPaso(); actualizarResumen(); }

  function seleccionar(accion, valor) {
    if (accion === "seleccionar-linea") { const cambio = estado.linea && estado.linea !== valor; limpiarDesde("linea"); estado.linea = valor; estado.paso = 1; if (cambio) mostrarToast("Actualizamos los pasos para " + nombres[valor] + "."); }
    if (accion === "seleccionar-nivel") { if (estado.nivelIngreso !== valor) limpiarDesde("nivel"); estado.nivelIngreso = valor; avanzar(); return; }
    if (accion === "seleccionar-tarifa") { if (estado.tipoTarifa !== valor) limpiarDesde("tipoTarifa"); estado.tipoTarifa = valor; avanzar(); return; }
    if (accion === "seleccionar-plan") { if (estado.planId !== valor) limpiarDesde("plan"); estado.planId = valor; avanzar(); return; }
    if (accion === "seleccionar-condicion") { if (estado.condicion !== valor) limpiarDesde("condicion"); estado.condicion = valor; avanzar(); return; }
    if (accion === "seleccionar-pago") { const cambio = estado.formaPago !== valor; if (cambio) { estado.formaPago = valor; estado.cuotas = ""; estado.primeraCuota = ""; estado.segundaFecha = ""; estado.beneficios = []; estado.cotizacion = null; } renderizar(); return; }
    if (accion === "seleccionar-cuotas") { estado.cuotas = valor; estado.primeraCuota = ""; estado.segundaFecha = ""; estado.beneficios = []; renderizar(); return; }
    if (accion === "alternar-beneficio") { const disponibles = motorComercial.beneficiosDisponibles(configuracionComercial, estado.cotizacion.registro); const activo = disponibles.find(function (b) { return b.id === valor; }); if (activo) estado.beneficios = motorComercial.alternarSeleccion(estado.beneficios, activo, disponibles); renderizar(); return; }
    renderizar();
  }

  function confirmarPago() { const c = construirCotizacion(); if (!c) { mostrarErrorPaso("Completa una forma de pago válida."); return; } estado.cotizacion = c; avanzar(); }

  function copiarResumen() {
    if (!estado.cotizacion) return;
    const c = estado.cotizacion, r = c.registro;
    const lineas = [resumenProgramaTexto(r), "Condición comercial: " + r.condicion, "Forma de pago: " + nombres[r.formaPago], "Valor final: " + moneda.format(r.valorTotal)];
    if (c.beneficios.length) lineas.push("Beneficios: " + c.beneficios.map(resumenBeneficio).join(", "));
    if (c.planPagos.length > 1) { lineas.push("", "Plan de pagos"); c.planPagos.forEach(function (cuota) { lineas.push("Cuota " + cuota.numero + " · " + fechaVisible.format(pagos.fechaDesdeIso(cuota.fecha)) + " · " + moneda.format(cuota.valor) + " · " + cuota.tipo); }); }
    const texto = lineas.join("\n");
    function exito() { mostrarToast("Resumen copiado correctamente."); }
    function alternativa() { const area = document.createElement("textarea"); area.value = texto; area.setAttribute("readonly", ""); area.className = "portapapeles-auxiliar"; document.body.appendChild(area); area.select(); document.execCommand("copy"); area.remove(); exito(); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texto).then(exito).catch(alternativa); else alternativa();
  }

  function mostrarInformacion(tipo) {
    const contenidos = {
      buscar: ["Buscar Propuesta", "Privacidad local", "Las propuestas no se almacenan. Puedes volver a una propuesta mientras permanezca abierta en esta sesión; no existe un repositorio de datos de clientes.", "⌕"],
      campana: ["Campaña Vigente", "Configuración comercial", "La campaña activa se administra desde la configuración local y se valida por estado, aprobación y vigencia.", "◎"],
      beneficios: ["Beneficios Comerciales", "Activos autorizados", "El motor presenta Linguaskill, E-books, cursos cortos y campaña únicamente cuando sus reglas configuradas coinciden con la negociación.", "◇"],
      tarifas: ["Tarifas Oficiales", "Catálogo 2026", "Las tarifas de Smart Online y Smart Flex se consultan exclusivamente desde el catálogo local normalizado.", "$"],
      biblioteca: ["Biblioteca Comercial", "Espacio preparado", "Este módulo está listo para incorporar recursos comerciales oficiales sin depender de internet. Actualmente no contiene documentos adicionales.", "▤"]
    };
    const datos = contenidos[tipo]; $("#informacion-kicker").textContent = datos[1]; $("#informacion-titulo").textContent = datos[0]; $("#informacion-texto").textContent = datos[2]; $("#informacion-icono").textContent = datos[3]; $("#informacion-detalle").innerHTML = "";
    const accion = $("#informacion-accion"); accion.hidden = tipo !== "tarifas" && tipo !== "beneficios"; mostrarVista("informacion");
  }

  function actualizarDashboard() {
    const campana = motorComercial.campanaVigente(configuracionComercial, {});
    if (campana) { $("#campana-titulo").textContent = campana.nombre; $("#campana-descripcion").textContent = campana.descripcion; $("#campana-estado").textContent = "Activa"; $("#campana-estado").className = "badge badge--activa"; }
    else { $("#campana-titulo").textContent = "Sin campaña activa"; $("#campana-descripcion").textContent = "Cuando exista una campaña aprobada aparecerá aquí automáticamente."; $("#campana-estado").textContent = "Sin configurar"; $("#campana-estado").className = "badge badge--neutral"; }
  }

  function nuevaPropuesta() { estado = estadoInicial(); mostrarVista("asistente"); renderizar(); requestAnimationFrame(function () { $("#paso-actual").focus(); }); }

  function manejarClick(evento) {
    const dashboard = evento.target.closest("[data-accion-dashboard]"); if (dashboard) { const accion = dashboard.dataset.accionDashboard; if (accion === "nueva") nuevaPropuesta(); else mostrarInformacion(accion); return; }
    const opcion = evento.target.closest("[data-accion][data-valor]"); if (opcion) { seleccionar(opcion.dataset.accion, opcion.dataset.valor); return; }
    const editar = evento.target.closest("[data-editar-indice]"); if (editar) { irAPaso(Number(editar.dataset.editarIndice)); return; }
    const accion = evento.target.closest("[data-accion]"); if (!accion) return;
    if (accion.dataset.accion === "atras") irAPaso(estado.paso - 1);
    if (accion.dataset.accion === "confirmar-pago") confirmarPago();
    if (accion.dataset.accion === "confirmar-beneficios") avanzar();
    if (accion.dataset.accion === "confirmar-resumen") avanzar();
    if (accion.dataset.accion === "abrir-propuesta") { estado.cotizacion = construirCotizacion(); if (estado.cotizacion) { document.dispatchEvent(new CustomEvent("smart:cotizacion", { detail: estado.cotizacion })); window.SmartPropuesta.abrir(); } }
    if (accion.dataset.accion === "copiar-resumen") copiarResumen();
  }

  function iniciar() {
    const errores = validaciones.validarCatalogo(catalogo);
    if (errores.length) { document.body.classList.add("app-bloqueada"); $("#dashboard-titulo").textContent = "No fue posible validar el catálogo local"; return; }
    actualizarDashboard();
    document.addEventListener("click", manejarClick);
    document.addEventListener("input", function (evento) {
      if (evento.target.id === "campo-primera-cuota") estado.primeraCuota = evento.target.value;
      if (evento.target.id === "campo-fecha-pago") estado.fechaPago = evento.target.value;
      if (evento.target.id === "campo-segunda-fecha") estado.segundaFecha = evento.target.value;
      if (["campo-primera-cuota", "campo-fecha-pago", "campo-segunda-fecha"].includes(evento.target.id)) { estado.beneficios = []; actualizarResumen(); }
    });
    document.addEventListener("change", function (evento) { if (["campo-primera-cuota", "campo-fecha-pago", "campo-segunda-fecha"].includes(evento.target.id)) renderizar(); });
    $("#volver-dashboard").addEventListener("click", function () { mostrarVista("dashboard"); });
    $("#cerrar-informacion").addEventListener("click", function () { mostrarVista("dashboard"); });
    $("#informacion-accion").addEventListener("click", nuevaPropuesta);
    $("#ir-inicio").addEventListener("click", function (evento) { evento.preventDefault(); mostrarVista("dashboard"); });
    $("#nueva-cotizacion-global").addEventListener("click", nuevaPropuesta);
    $("#reiniciar").addEventListener("click", function () { if (estado.paso > 1) $("#confirmacion-dialog").showModal(); else nuevaPropuesta(); });
    $("#confirmar-reinicio").addEventListener("click", function () { setTimeout(nuevaPropuesta, 0); });
  }

  iniciar();
})();
