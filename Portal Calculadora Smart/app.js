(() => {
  "use strict";

  const config = window.SMART_CONFIG || {};
  const definitions = {
    instituto: { key: "INSTITUTO_APP_URL", title: "Calculadora Instituto" },
    online: { key: "ONLINE_FLEX_APP_URL", title: "Calculadora Smart Online / Flex" },
    mix: { key: "SMART_MIX_APP_URL", title: "Calculadora Smart Mix" }
  };
  const view = document.getElementById("calculator-view");
  const title = document.getElementById("calculator-title");
  const home = document.getElementById("calculator-home");
  const loading = document.getElementById("calculator-loading");
  const viewerStatus = document.getElementById("calculator-status");
  const retry = document.getElementById("calculator-retry");
  const main = document.getElementById("contenido");
  const homeSections = Array.from(main.children).filter((section) => section !== view);
  const footer = document.querySelector(".site-footer");
  const skip = document.querySelector(".skip-link");
  const originalSkip = { text: skip.textContent, href: skip.getAttribute("href") };
  const instances = new Map();
  let active;
  let homeScroll = 0;

  function renderStatus(instance) {
    if (active !== instance) return;
    loading.hidden = !instance.message;
    viewerStatus.textContent = instance.message;
    retry.hidden = !instance.canRetry;
  }

  function loadCalculator(instance) {
    clearTimeout(instance.timer);
    instance.message = "Cargando " + instance.title + "…";
    instance.canRetry = false;
    renderStatus(instance);
    instance.frame.src = instance.url;
    instance.timer = setTimeout(() => {
      instance.message = "La carga está tardando más de lo esperado. Si la calculadora no aparece, puedes reintentar.";
      instance.canRetry = true;
      renderStatus(instance);
    }, 20000);
  }

  document.querySelectorAll("[data-calculator]").forEach((launch) => {
    const id = launch.dataset.calculator;
    const definition = definitions[id];
    const frame = document.getElementById(id + "-frame");
    const instance = { ...definition, frame, launch, message: "", canRetry: false };
    try {
      const parsed = new URL(config[definition.key]);
      if (parsed.protocol === "https:" && !parsed.username && !parsed.password) instance.url = parsed.href;
    } catch { /* A missing or invalid destination never leaves the portal. */ }
    instances.set(id, instance);

    launch.addEventListener("click", () => {
      if (!instance.url) {
        document.getElementById(launch.getAttribute("aria-describedby")).textContent = "URL DIRECTA PENDIENTE";
        return;
      }
      homeScroll = window.scrollY;
      active = instance;
      homeSections.forEach((section) => { section.hidden = true; });
      footer.hidden = true;
      view.hidden = false;
      instances.forEach((item) => { item.frame.hidden = item !== instance; });
      title.textContent = instance.title;
      skip.href = "#calculator-title";
      skip.textContent = "Saltar a " + instance.title;
      // Assign src only once. Hidden frames retain their independent sessions.
      if (!frame.hasAttribute("src")) loadCalculator(instance);
      else renderStatus(instance);
      title.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    });

    frame.addEventListener("load", () => {
      if (!frame.hasAttribute("src")) return;
      clearTimeout(instance.timer);
      instance.message = "";
      instance.canRetry = false;
      // Cross-origin load signals navigation, not successful application startup.
      renderStatus(instance);
    });
    frame.addEventListener("error", () => {
      clearTimeout(instance.timer);
      instance.message = "No se pudo cargar la calculadora. Revisa la conexión e inténtalo de nuevo.";
      instance.canRetry = true;
      renderStatus(instance);
    });
  });

  home.addEventListener("click", () => {
    view.hidden = true;
    homeSections.forEach((section) => { section.hidden = false; });
    footer.hidden = false;
    skip.setAttribute("href", originalSkip.href);
    skip.textContent = originalSkip.text;
    active.launch.focus({ preventScroll: true });
    active = undefined;
    window.scrollTo(0, homeScroll);
  });

  retry.addEventListener("click", () => { if (active) loadCalculator(active); });
})();

