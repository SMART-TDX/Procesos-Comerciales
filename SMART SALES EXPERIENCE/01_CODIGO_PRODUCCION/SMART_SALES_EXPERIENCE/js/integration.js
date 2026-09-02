(function () {
  "use strict";
  const State = window.SmartExperienceState;
  const Session = window.SmartExperienceSession;
  const Navigation = window.SmartExperienceNavigation;
  const hubStateKey = "smartSalesExperience:hubState";
  const frame = document.getElementById("sales-hub-frame");
  let frameReady = false;

  function persist() { Session.save(State.get()); }
  function context() {
    const state = State.get();
    return state.salesContext || { clientName: state.prospect.name, selectedExecutive: state.selectedExecutive, perfilPrincipal: state.perfilPrincipal, decisionCriteria: state.decisionCriteria, budgetPreferences: state.budgetPreferences, recommendedProgram: state.recommendedProgram, selectedProgram: state.selectedProgram, favoriteBenefits: state.favoriteBenefits };
  }
  function send(type, payload) {
    if (frame.contentWindow) frame.contentWindow.postMessage({ source: "smart-sales-experience", type: type, payload: payload || null }, window.location.origin === "null" ? "*" : window.location.origin);
  }
  function openInvestment() {
    try {
      if (frame.getAttribute("src") && frame.contentWindow.location.pathname.endsWith("/print.html")) {
        frameReady = false;
        frame.setAttribute("src", frame.dataset.src);
        return;
      }
    } catch (error) { frameReady = false; }
    if (!frame.getAttribute("src")) frame.setAttribute("src", frame.dataset.src);
    if (frameReady) send("init", context());
  }
  function show(scene) {
    State.update(function (state) { state.currentScene = scene; });
    persist();
    Navigation.show(scene, { focus: true });
    if (scene === "investment") openInvestment();
    if (scene === "commercial-close") renderClose();
  }
  function money(value) { return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(Number(value) || 0); }
  function renderClose() {
    const state = State.get();
    const quote = state.commercialQuote;
    if (!quote || !quote.registro) return;
    document.getElementById("close-client").textContent = state.prospect.name || "Cliente Smart";
    document.getElementById("close-program").textContent = quote.registro.linea === "SMART_FLEX" ? "Smart Flex" : "Smart Online";
    document.getElementById("close-investment").textContent = money(quote.registro.valorTotal);
    document.getElementById("close-payment").textContent = quote.registro.formaPago === "CONTADO" ? "Pago único" : "Financiado";
    document.getElementById("close-executive").textContent = state.selectedExecutive?.fullName || "Ejecutivo de Cuenta Smart";
    const phone = state.selectedExecutive?.whatsapp || state.selectedExecutive?.phone || "";
    const whatsapp = document.getElementById("close-whatsapp");
    whatsapp.hidden = !phone;
    if (phone) { whatsapp.href = "https://wa.me/" + phone.replace(/\D/g, ""); whatsapp.target = "_blank"; whatsapp.rel = "noopener"; }
  }
  function newAdvice() {
    const currentExecutive = State.get().selectedExecutive;
    const keepExecutive = currentExecutive ? window.confirm(`¿Deseas conservar a ${currentExecutive.fullName} como Ejecutivo de Cuenta para la nueva asesoría?`) : false;
    const executive = keepExecutive ? currentExecutive : null;
    Session.clear();
    sessionStorage.removeItem(hubStateKey);
    State.reset();
    State.update(function (state) { state.selectedExecutive = executive; state.currentScene = "welcome"; });
    persist();
    frameReady = false;
    frame.removeAttribute("src");
    show("welcome");
    document.getElementById("welcome-name").textContent = "TU NOMBRE";
    document.querySelectorAll("[data-prospect-name]").forEach(function (node) { node.textContent = "TU NOMBRE"; });
    const input = document.getElementById("prospect-name"); input.value = ""; input.focus();
  }

  window.addEventListener("message", function (event) {
    const message = event.data;
    if (event.source !== frame.contentWindow || !message || message.source !== "smart-sales-hub") return;
    if (message.type === "ready") { frameReady = true; send("init", context()); }
    if (message.type === "state") sessionStorage.setItem(hubStateKey, JSON.stringify(message.payload));
    if (message.type === "quote") { State.update(function (state) { state.commercialQuote = message.payload; state.selectedProgram = message.payload?.registro?.linea === "SMART_ONLINE" ? "online" : "flex"; if (state.salesContext) state.salesContext.selectedProgram = state.selectedProgram; }); persist(); }
    if (message.type === "back") show("program-favorites");
    if (message.type === "close") { State.update(function (state) { state.commercialQuote = message.payload; state.selectedProgram = message.payload?.registro?.linea === "SMART_ONLINE" ? "online" : "flex"; if (state.salesContext) state.salesContext.selectedProgram = state.selectedProgram; }); persist(); show("commercial-close"); }
  });
  document.addEventListener("smart:scenechange", function (event) { if (event.detail.sceneId === "investment") openInvestment(); if (event.detail.sceneId === "commercial-close") renderClose(); });
  document.addEventListener("click", function (event) {
    const action = event.target.closest("[data-close-action]")?.dataset.closeAction;
    if (action === "quote") { show("investment"); window.setTimeout(function () { send("print-quote"); }, 300); }
    if (action === "summary") { persist(); window.location.assign("summary.html"); }
    if (action === "decision") show("program-favorites");
    if (action === "new") newAdvice();
  });
  if (State.get().currentScene === "investment") openInvestment();
  if (State.get().currentScene === "commercial-close") renderClose();
})();
