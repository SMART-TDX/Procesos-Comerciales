(function () {
  "use strict";
  const embedded = new URLSearchParams(window.location.search).get("embedded") === "1";
  if (!embedded) return;

  const stateKey = "smartSalesExperience:hubState";
  let salesContext = null;
  let latestQuote = null;
  document.body.classList.add("is-experience-embedded");

  const bar = document.createElement("aside");
  bar.className = "experience-bridge";
  bar.setAttribute("aria-label", "Integración con Smart Sales Experience");
  bar.innerHTML = '<div class="experience-bridge__copy"><strong>AHORA HABLEMOS DE TU INVERSIÓN</strong><span>Construyamos una alternativa que se ajuste a lo que quieres lograr.</span></div><div class="experience-bridge__actions"><button type="button" data-bridge-action="back">VOLVER A TU DECISIÓN</button><button type="button" data-bridge-action="close" disabled>CONTINUAR AL CIERRE</button></div>';
  document.body.prepend(bar);

  function parentMessage(type, payload) {
    window.parent.postMessage({ source: "smart-sales-hub", type: type, payload: payload || null }, window.location.origin === "null" ? "*" : window.location.origin);
  }

  function prefillProposal() {
    if (!salesContext) return;
    const values = {
      "cliente-nombre": salesContext.clientName || "",
      "asesor-nombre": salesContext.selectedExecutive && salesContext.selectedExecutive.fullName || "",
      "asesor-whatsapp": salesContext.selectedExecutive && (salesContext.selectedExecutive.whatsapp || salesContext.selectedExecutive.phone) || ""
    };
    Object.keys(values).forEach(function (id) {
      const input = document.getElementById(id);
      if (!input || input.value === values[id]) return;
      input.value = values[id];
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  function persistHubState() {
    if (!window.SmartSalesHubIntegration) return;
    const snapshot = window.SmartSalesHubIntegration.obtenerEstado();
    sessionStorage.setItem(stateKey, JSON.stringify(snapshot));
    parentMessage("state", snapshot);
  }

  function highlightBudget() {
    if (!salesContext || !Array.isArray(salesContext.budgetPreferences)) return;
    const ids = salesContext.budgetPreferences.map(function (item) { return typeof item === "string" ? item : item.id; });
    document.querySelectorAll(".opcion-card").forEach(function (card) {
      const payment = card.dataset.valor;
      const highlight = (ids.includes("financing_options") && payment === "FINANCIADO") || ((ids.includes("credit_card") || ids.includes("savings") || ids.includes("cesantias")) && payment === "CONTADO");
      card.classList.toggle("is-budget-suggested", highlight);
    });
  }

  function applyContext(context, restored) {
    salesContext = context || {};
    window.SmartSalesHubIntegration.iniciarDesdeExperience(salesContext, restored);
    latestQuote = restored && restored.cotizacion || null;
    bar.querySelector('[data-bridge-action="close"]').disabled = !latestQuote;
    prefillProposal();
    highlightBudget();
    persistHubState();
  }

  window.addEventListener("message", function (event) {
    const message = event.data;
    if (event.source !== window.parent || !message || message.source !== "smart-sales-experience") return;
    if (message.type === "print-quote" && latestQuote) {
      document.dispatchEvent(new CustomEvent("smart:cotizacion", { detail: latestQuote }));
      window.SmartPropuesta.abrir();
      window.setTimeout(function () { document.getElementById("imprimir-propuesta").click(); }, 80);
      return;
    }
    if (message.type !== "init") return;
    let restored = null;
    try { restored = JSON.parse(sessionStorage.getItem(stateKey) || "null"); } catch (error) { restored = null; }
    applyContext(message.payload, restored);
  });

  document.addEventListener("smart:cotizacion", function (event) {
    latestQuote = event.detail || latestQuote;
    if (latestQuote) {
      bar.querySelector('[data-bridge-action="close"]').disabled = false;
      parentMessage("quote", latestQuote);
    }
    persistHubState();
  });
  document.addEventListener("click", function () { window.setTimeout(function () { prefillProposal(); highlightBudget(); persistHubState(); }, 0); }, true);
  document.addEventListener("input", function () { window.setTimeout(persistHubState, 0); }, true);

  bar.addEventListener("click", function (event) {
    const action = event.target.closest("[data-bridge-action]");
    if (!action) return;
    if (action.dataset.bridgeAction === "back") parentMessage("back");
    if (action.dataset.bridgeAction === "close" && latestQuote) parentMessage("close", latestQuote);
  });

  parentMessage("ready");
})();
