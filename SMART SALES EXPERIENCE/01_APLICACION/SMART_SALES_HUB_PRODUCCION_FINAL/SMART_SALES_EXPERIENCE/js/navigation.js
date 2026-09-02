(function () {
  "use strict";

  const sceneOrder = ["welcome", "executive-select", "executive", "trajectory", "presence", "students", "academic", "teachers", "discovery-profile", "employment-english", "employment-goal", "recommendation-transition", "program-recommendation", "program-benefits", "certification-model", "program-preclose", "program-favorites", "investment", "commercial-close"];

  function show(sceneId, options) {
    const requested = sceneOrder.includes(sceneId) ? sceneId : "welcome";
    const settings = Object.assign({ focus: true }, options);

    document.querySelectorAll("[data-scene]").forEach((scene) => {
      const active = scene.dataset.scene === requested;
      scene.hidden = !active;
      scene.classList.toggle("is-active", active);
    });
    document.dispatchEvent(new CustomEvent("smart:scenechange", { detail: { sceneId: requested } }));

    if (settings.focus) {
      const activeScene = document.querySelector(`[data-scene="${requested}"]`);
      const heading = activeScene && activeScene.querySelector("h1, h2");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
    }
    return requested;
  }

  function next(currentScene) {
    const index = sceneOrder.indexOf(currentScene);
    return sceneOrder[Math.min(index + 1, sceneOrder.length - 1)] || sceneOrder[0];
  }

  function previous(currentScene) {
    const index = sceneOrder.indexOf(currentScene);
    return sceneOrder[Math.max(index - 1, 0)] || sceneOrder[0];
  }

  window.SmartExperienceNavigation = Object.freeze({ sceneOrder: sceneOrder.slice(), show, next, previous });
})();
