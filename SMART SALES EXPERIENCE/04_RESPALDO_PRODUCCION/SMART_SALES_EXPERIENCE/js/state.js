(function () {
  "use strict";

  const createInitialState = () => ({
    version: 1,
    currentScene: "welcome",
    profile: "",
    perfilPrincipal: "",
    rolActual: [],
    objetivos: [],
    realidadActual: [],
    recommendedProgram: null,
    selectedProgram: null,
    currentBenefitSlide: 0,
    certificationModelIndex: 0,
    certificationReturn: null,
    benefitsViewed: [],
    selectedExecutive: null,
    selectedScheduleSlots: [],
    decisionCriteria: [],
    budgetPreferences: [],
    associatedBenefits: [],
    favoriteBenefits: [],
    salesContext: null,
    commercialQuote: null,
    respuestasRolActual: [],
    objetivosProfesionales: [],
    oportunidadesIngles: [],
    prospect: {
      name: "",
      profile: "",
      company: "",
      role: "",
      englishRelationship: "",
      primaryGoal: "",
      secondaryGoals: [],
      detectedBarrier: "",
      previousExperience: "",
      needs: [],
      priorities: [],
      availability: ""
    },
    employment: {
      company: "",
      role: "",
      englishCurrentRole: "",
      professionalGoal: "",
      professionalGoalOther: "",
      currentBarrier: ""
    },
    recommendation: {
      systemRecommendation: null,
      executiveSelectedProduct: null,
      scoreOnline: 0,
      scoreFlex: 0,
      confidence: "mixed",
      reasons: [],
      precloseChoice: null
    },
    preclose: {
      agreements: [null, null, null, null, null]
    },
    commercialSelection: {
      academicPlan: null,
      paymentMethod: null,
      installmentCount: null,
      paymentChannel: null
    }
  });

  let state = createInitialState();

  function replace(nextState) {
    const fallback = createInitialState();
    const source = nextState && typeof nextState === "object" ? nextState : null;
    state = nextState && typeof nextState === "object" ? Object.assign(fallback, nextState) : fallback;
    state.employment = Object.assign(createInitialState().employment, state.employment || {});
    state.recommendation = Object.assign(createInitialState().recommendation, state.recommendation || {});
    state.recommendedProgram = source && Object.prototype.hasOwnProperty.call(source, "recommendedProgram") ? source.recommendedProgram : state.recommendation.systemRecommendation;
    state.selectedProgram = source && Object.prototype.hasOwnProperty.call(source, "selectedProgram") ? source.selectedProgram : state.recommendation.executiveSelectedProduct;
    state.currentBenefitSlide = Number.isInteger(state.currentBenefitSlide) && state.currentBenefitSlide >= 0 ? state.currentBenefitSlide : 0;
    state.certificationModelIndex = Number.isInteger(state.certificationModelIndex) && state.certificationModelIndex >= 0 ? state.certificationModelIndex : 0;
    state.certificationReturn = state.certificationReturn && typeof state.certificationReturn === "object" ? state.certificationReturn : null;
    state.benefitsViewed = Array.isArray(state.benefitsViewed) ? state.benefitsViewed : [];
    state.selectedScheduleSlots = Array.isArray(state.selectedScheduleSlots) ? state.selectedScheduleSlots : [];
    state.decisionCriteria = Array.isArray(state.decisionCriteria) ? state.decisionCriteria : [];
    state.budgetPreferences = Array.isArray(state.budgetPreferences) ? state.budgetPreferences : [];
    state.associatedBenefits = Array.isArray(state.associatedBenefits) ? state.associatedBenefits : [];
    state.favoriteBenefits = Array.isArray(state.favoriteBenefits) ? state.favoriteBenefits : [];
    state.commercialQuote = state.commercialQuote && typeof state.commercialQuote === "object" ? state.commercialQuote : null;
    if (!state.profile && state.prospect && state.prospect.profile) state.profile = state.prospect.profile;
    const canonicalProfiles = { employee: "trabajando", student: "estudiando", entrepreneur: "nuevas_oportunidades", job_seeker: "nuevas_oportunidades", life_change: "nuevas_oportunidades" };
    if (["negocio", "proyecto_personal"].includes(state.perfilPrincipal)) { state.perfilPrincipal = "nuevas_oportunidades"; state.profile = "job_seeker"; state.prospect.profile = "job_seeker"; }
    if (!state.perfilPrincipal) state.perfilPrincipal = canonicalProfiles[state.profile] || state.profile || "";
    if (canonicalProfiles[state.perfilPrincipal]) state.perfilPrincipal = canonicalProfiles[state.perfilPrincipal];
    if (!state.profile) state.profile = Object.keys(canonicalProfiles).find((key) => canonicalProfiles[key] === state.perfilPrincipal) || "";
    const legacy = state.employment || {};
    state.respuestasRolActual = source && Array.isArray(source.respuestasRolActual) ? source.respuestasRolActual : (legacy.englishCurrentRole ? [legacy.englishCurrentRole] : []);
    state.objetivosProfesionales = source && Array.isArray(source.objetivosProfesionales) ? source.objetivosProfesionales : (legacy.professionalGoal ? [legacy.professionalGoal] : []);
    state.oportunidadesIngles = source && Array.isArray(source.oportunidadesIngles) ? source.oportunidadesIngles : (legacy.currentBarrier ? [legacy.currentBarrier] : []);
    state.rolActual = source && Array.isArray(source.rolActual) ? source.rolActual : [...state.respuestasRolActual];
    state.objetivos = source && Array.isArray(source.objetivos) ? source.objetivos : [...state.objetivosProfesionales];
    state.realidadActual = source && Array.isArray(source.realidadActual) ? source.realidadActual : [...state.oportunidadesIngles];
    if (state.currentScene === "employment-world") state.currentScene = "employment-english";
    return state;
  }

  function update(mutator) {
    if (typeof mutator === "function") mutator(state);
    return state;
  }

  function reset() {
    state = createInitialState();
    return state;
  }

  window.SmartExperienceState = Object.freeze({ createInitialState, get: () => state, replace, update, reset });
})();
