(function () {
  "use strict";

  const State = window.SmartExperienceState;
  const Session = window.SmartExperienceSession;
  const Navigation = window.SmartExperienceNavigation;
  const Config = window.SMART_EXPERIENCE_EMPLOYMENT || {};
  const sceneForField = Object.freeze({
    respuestasRolActual: "employment-english",
    objetivosProfesionales: "employment-goal",
    oportunidadesIngles: "employment-goal"
  });
  const stateAliases = Object.freeze({ respuestasRolActual: "rolActual", objetivosProfesionales: "objetivos", oportunidadesIngles: "realidadActual" });

  function optionsForField(field) {
    const flow = Config.profileFlows?.[State.get().perfilPrincipal || "trabajando"] || Config.profileFlows?.trabajando;
    const keys = { respuestasRolActual: "options", objetivosProfesionales: "goalOptions", oportunidadesIngles: "realityOptions" };
    return flow?.[keys[field]] || Config[field] || [];
  }

  function clean(value, maximum) {
    return String(value || "").trim().replace(/\s+/g, " ").slice(0, maximum || 140);
  }

  function optionById(field, id) {
    return optionsForField(field).find((option) => option.id === id) || null;
  }

  function renderOptionGroups() {
    document.querySelectorAll("[data-employment-options]").forEach((container) => {
      const field = container.dataset.employmentOptions;
      const signature = `${State.get().perfilPrincipal}:${field}`;
      if (container.dataset.renderSignature === signature) return;
      container.dataset.renderSignature = signature;
      container.innerHTML = optionsForField(field).map((option, index) => `
        <button class="employment-option" type="button" role="checkbox" aria-checked="false" data-employment-field="${field}" data-employment-value="${option.id}" style="--option-order:${index}">
          <span class="employment-option__icon" aria-hidden="true"><img src="${option.icon}" alt=""></span>
          <span class="employment-option__copy"><strong>${option.title}</strong></span>
          <i class="employment-option__check" aria-hidden="true">✓</i>
        </button>`).join("");
    });
  }

  function persist() {
    Session.save(State.get());
  }

  function isValid(field) {
    const state = State.get();
    if (field === "world") return Boolean(clean(state.employment.company, 90) && clean(state.employment.role, 90));
    const selected = (Array.isArray(state[field]) ? state[field] : []).filter((id) => optionById(field, id));
    if (field === "objetivosProfesionales" && selected.includes("other")) return Boolean(clean(state.employment.professionalGoalOther, 140));
    return selected.length > 0;
  }

  function syncWorld() {
    const employment = State.get().employment;
    const company = document.getElementById("employment-company");
    const role = document.getElementById("employment-role");
    if (company && company.value !== employment.company) company.value = employment.company;
    if (role && role.value !== employment.role) role.value = employment.role;
    const valid = isValid("world");
    document.getElementById("employment-world-reaction").hidden = !valid;
    document.getElementById("employment-world-next").disabled = !valid;
    document.querySelector(".employment-scene--world")?.classList.toggle("has-complete-origin", valid);
  }

  function syncOptionField(field) {
    const state = State.get();
    const selectedValues = Array.isArray(state[field]) ? state[field] : [];
    document.querySelectorAll(`[data-employment-field="${field}"]`).forEach((button) => {
      const selected = selectedValues.includes(button.dataset.employmentValue);
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-checked", String(selected));
    });

    const scene = document.querySelector(`[data-scene="${sceneForField[field]}"]`);
    const reaction = scene?.querySelector("[data-employment-reaction]");
    if (reaction) reaction.hidden = true;

    if (field === "objetivosProfesionales") {
      const other = document.getElementById("employment-other-wrap");
      const input = document.getElementById("employment-goal-other");
      const requiresText = selectedValues.includes("other");
      other.hidden = !requiresText;
      if (input.value !== state.employment.professionalGoalOther) input.value = state.employment.professionalGoalOther;
    }

    scene?.classList.toggle("has-selection", selectedValues.length > 0);
    const next = scene?.querySelector("[data-employment-next]");
    if (next) next.disabled = !isValid(field);
  }

  function syncPersonalization() {
    const role = clean(State.get().employment.role, 90);
    const node = document.getElementById("employment-personalization");
    if (!node) return;
    node.textContent = role ? `Pensando en tu crecimiento como ${role}, exploremos qué siguiente paso tendría más valor para ti.` : "";
    node.hidden = !role;
  }

  function syncContextCopy() {
    const profile = State.get().perfilPrincipal || "trabajando";
    const flow = Config.profileFlows?.[profile] || Config.profileFlows?.trabajando;
    if (!flow) return;
    document.getElementById("employment-english-title").textContent = flow.question;
    document.getElementById("employment-goal-title").textContent = flow.goalQuestion;
  }

  function sync() {
    renderOptionGroups();
    syncContextCopy();
    syncWorld();
    syncOptionField("respuestasRolActual");
    syncOptionField("objetivosProfesionales");
    syncPersonalization();
  }

  function navigate(sceneId) {
    if (sceneId === "next-phase") return nextPhase();
    State.update((state) => { state.currentScene = sceneId; });
    persist();
    Navigation.show(sceneId, { focus: true });
    sync(sceneId);
  }

  function nextPhase() {
    navigate("recommendation-transition");
  }

  function selectOption(button) {
    const field = button.dataset.employmentField;
    const value = button.dataset.employmentValue;
    if (!field || !optionById(field, value)) return;
    State.update((state) => {
      const selected = Array.isArray(state[field]) ? state[field] : [];
      state[field] = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value];
      state[stateAliases[field]] = [...state[field]];
      if (field === "objetivosProfesionales" && value === "other" && !state[field].includes("other")) state.employment.professionalGoalOther = "";
    });
    persist();
    syncOptionField(field);
  }

  function handleInput(input) {
    State.update((state) => {
      if (input.id === "employment-company") state.employment.company = clean(input.value, 90);
      if (input.id === "employment-role") state.employment.role = clean(input.value, 90);
      if (input.id === "employment-goal-other") state.employment.professionalGoalOther = clean(input.value, 140);
    });
    persist();
    if (input.id === "employment-goal-other") syncOptionField("objetivosProfesionales");
    else {
      syncWorld();
      syncPersonalization();
    }
  }

  function bind() {
    document.addEventListener("click", (event) => {
      const option = event.target.closest("[data-employment-field]");
      if (option) selectOption(option);
      const back = event.target.closest("[data-employment-back]");
      if (back) navigate(back.dataset.employmentBack);
      const next = event.target.closest("[data-employment-next]");
      if (next && !next.disabled) navigate(next.dataset.employmentNext);
    });
    document.addEventListener("input", (event) => {
      if (["employment-company", "employment-role", "employment-goal-other"].includes(event.target.id)) handleInput(event.target);
    });
  }

  renderOptionGroups();
  bind();
  sync();
  window.SmartEmploymentDiscovery = Object.freeze({ sync, nextPhase });
})();
