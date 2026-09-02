(function () {
  "use strict";

  const State = window.SmartExperienceState;
  const Session = window.SmartExperienceSession;
  const Navigation = window.SmartExperienceNavigation;
  const slides = [
    { image: "assets/certification-model/page-1.jpg", heading: "SMART FLEX", description: "Modelo de certificación para el proceso de inglés Smart Flex." },
    { image: "assets/certification-model/page-2.jpg", heading: "CONSTANCIAS Y CERTIFICACIÓN", description: "Durante el proceso pueden solicitarse constancias con costo cuando corresponda. Al completar el nivel se obtiene la constancia definida y el certificado del examen internacional Linguaskill." },
    { image: "assets/certification-model/page-3.jpg", heading: "MODELO INTERNACIONAL", description: "Cambridge Assessment English, Michigan Language Assessment, Linguaskill y MET, exactamente como aparecen en el documento oficial." },
    { image: "assets/certification-model/page-4.jpg", heading: "SMART ONLINE", description: "Smart Online corresponde a un modelo de educación informal. Los diplomas se descargan desde la plataforma al terminar y cumplir los requisitos del nivel." },
    { image: "assets/certification-model/page-5.jpg", heading: "CONSTANCIA SMART ONLINE", description: "La constancia muestra el nivel y las fechas asociadas cuando corresponde. No certifica horas de estudio ni emite horarios, según el documento oficial." },
    { image: "assets/certification-model/page-6.jpg", heading: "DIPLOMAS NIVEL A NIVEL", description: "Los diplomas de Smart Online se obtienen nivel a nivel, una vez finalizado y cumplidos los requisitos correspondientes." }
  ];

  function persist() { Session.save(State.get()); }

  function render() {
    const state = State.get();
    const index = Math.max(0, Math.min(state.certificationModelIndex || 0, slides.length - 1));
    const slide = slides[index];
    document.getElementById("certification-model-image").src = slide.image;
    document.getElementById("certification-model-image").alt = slide.heading;
    document.getElementById("certification-model-heading").textContent = slide.heading;
    document.getElementById("certification-model-description").textContent = slide.description;
    document.getElementById("certification-model-counter").textContent = `${index + 1} / ${slides.length}`;
    const previous = document.querySelector('[data-certification-action="previous"]');
    const next = document.querySelector('[data-certification-action="next"]');
    previous.textContent = index === 0 ? "VOLVER" : "ANTERIOR";
    next.textContent = index === slides.length - 1 ? "VOLVER A LA EXPERIENCIA" : "CONTINUAR";
  }

  function open() {
    const state = State.get();
    if (state.currentScene !== "certification-model") {
      State.update((draft) => {
        draft.certificationReturn = { scene: state.currentScene, benefitIndex: state.currentBenefitSlide };
        draft.certificationModelIndex = draft.selectedProgram === "online" ? 3 : 0;
        draft.currentScene = "certification-model";
      });
    }
    persist();
    Navigation.show("certification-model", { focus: true });
    render();
  }

  function returnToExperience() {
    const destination = State.get().certificationReturn || { scene: "program-benefits", benefitIndex: State.get().currentBenefitSlide };
    State.update((draft) => {
      draft.currentScene = destination.scene || "program-benefits";
      if (Number.isInteger(destination.benefitIndex)) draft.currentBenefitSlide = destination.benefitIndex;
      draft.certificationReturn = null;
    });
    persist();
    Navigation.show(State.get().currentScene, { focus: true });
    window.SmartExperienceRecommendation?.sync(State.get().currentScene);
  }

  function move(direction) {
    const index = State.get().certificationModelIndex || 0;
    if ((direction === "previous" && index === 0) || (direction === "next" && index === slides.length - 1) || direction === "return") {
      returnToExperience();
      return;
    }
    State.update((draft) => { draft.certificationModelIndex = direction === "previous" ? index - 1 : index + 1; });
    persist();
    render();
  }

  document.addEventListener("smart:open-certification-model", open);
  document.addEventListener("click", (event) => {
    const action = event.target.closest("[data-certification-action]")?.dataset.certificationAction;
    if (action) move(action);
  });
  document.addEventListener("smart:scenechange", (event) => {
    if (event.detail.sceneId === "certification-model") render();
  });

  window.SmartCertificationModel = Object.freeze({ open, render, returnToExperience });
})();
