(function () {
  "use strict";
  const stageSets = {
    flex: [["INICIO","welcome"],["TU HISTORIA","discovery-profile"],["SMART FLEX","program-benefits","modules"],["METODOLOGÍA","program-benefits","methodology"],["CLASES","program-benefits","live-120"],["HORARIOS","program-benefits","schedules"],["PLATAFORMA","program-benefits","self-study"],["BENEFICIOS","program-benefits","smartzone"],["CERTIFICACIÓN","program-benefits","linguaskill-pricing"],["MODELO DE CERTIFICACIÓN","certification-model"],["TU DECISIÓN","program-benefits","decision-criteria"],["INVERSIÓN","investment"]],
    online: [["INICIO","welcome"],["TU HISTORIA","discovery-profile"],["SMART ONLINE","program-benefits","online-trust"],["RUTA MODULAR","program-benefits","online-english-levels"],["BENEFICIOS","program-benefits","online-benefits"],["PLATAFORMA","program-benefits","online-platform"],["CERTIFICACIÓN","program-benefits","online-accreditation"],["MODELO DE CERTIFICACIÓN","certification-model"],["TU DECISIÓN","program-benefits","decision-criteria"],["INVERSIÓN","investment"]]
  };
  const track = document.getElementById("quick-navigation-track");
  const selectedProgram = () => window.SmartExperienceState?.get?.()?.selectedProgram === "online" ? "online" : "flex";

  function render() {
    track.innerHTML = stageSets[selectedProgram()].map(([label,scene,benefit]) => `<button type="button" data-quick-scene="${scene}"${benefit ? ` data-quick-benefit="${benefit}"` : ""}>${label}</button>`).join("");
    markActive();
  }

  function persistAndShow(scene, benefit) {
    const State = window.SmartExperienceState;
    if (scene === "certification-model") { document.dispatchEvent(new CustomEvent("smart:open-certification-model")); return; }
    if (benefit) {
      const program = selectedProgram();
      const slides = window.SMART_EXPERIENCE_PRODUCTS?.[program]?.benefitSlides || [];
      const index = slides.findIndex((item) => item.id === benefit);
      State.update((state) => { state.selectedProgram = program; state.recommendation.executiveSelectedProduct = program; if (index >= 0) state.currentBenefitSlide = index; });
    }
    State.update((state) => { state.currentScene = scene; });
    window.SmartExperienceSession.save(State.get());
    window.SmartExperienceNavigation.show(scene, { focus:true });
    window.SmartExperienceRecommendation?.sync(scene);
  }

  function markActive() {
    const state = window.SmartExperienceState?.get?.(); if (!state) return;
    const slides = window.SMART_EXPERIENCE_PRODUCTS?.[selectedProgram()]?.benefitSlides || [];
    const activeBenefitId = state.currentScene === "program-benefits" ? slides[state.currentBenefitSlide]?.id || "" : "";
    track.querySelectorAll("button").forEach((button) => { const matchesScene = button.dataset.quickScene === state.currentScene; const matchesBenefit = !button.dataset.quickBenefit || button.dataset.quickBenefit === activeBenefitId; button.classList.toggle("is-active", matchesScene && matchesBenefit); });
  }

  track.addEventListener("click", (event) => { const button = event.target.closest("[data-quick-scene]"); if (button) persistAndShow(button.dataset.quickScene, button.dataset.quickBenefit); });
  document.addEventListener("smart:scenechange", render);
  document.addEventListener("smart:programchange", render);
  render();
})();
