(() => {
  "use strict";

  const config = window.SMART_CONFIG || {};
  const target = ["_self", "_top", "_blank"].includes(config.LINK_TARGET)
    ? config.LINK_TARGET : "_self";

  document.querySelectorAll("[data-destination]").forEach((link) => {
    const rawUrl = config[link.dataset.destination];
    const value = typeof rawUrl === "string" ? rawUrl.trim() : "";
    const status = document.getElementById(link.getAttribute("aria-describedby"));
    let destination;
    try {
      const parsed = new URL(value);
      if (["https:", "http:"].includes(parsed.protocol) && !parsed.username && !parsed.password) {
        destination = parsed.href;
      }
    } catch { /* Unconfigured and malformed URLs never navigate. */ }

    if (destination) {
      link.href = destination;
      link.target = target;
      link.removeAttribute("role");
      link.removeAttribute("tabindex");
      if (target === "_blank") {
        link.rel = "noopener noreferrer";
        status.textContent = "Se abre en una nueva pestaña.";
      }
      return;
    }

    // Until configured, the anchor behaves as a keyboard-operable status button.
    const message = value ? "Enlace no válido. Revisa la configuración." : "Enlace pendiente de configuración.";
    const showStatus = (event) => {
      event.preventDefault();
      status.textContent = message;
    };
    link.addEventListener("click", showStatus);
    link.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") showStatus(event);
    });
  });
})();
