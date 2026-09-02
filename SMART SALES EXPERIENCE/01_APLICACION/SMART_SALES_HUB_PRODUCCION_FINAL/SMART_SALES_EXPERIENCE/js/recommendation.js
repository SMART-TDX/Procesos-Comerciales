(function () {
  "use strict";

  const State = window.SmartExperienceState;
  const Session = window.SmartExperienceSession;
  const Navigation = window.SmartExperienceNavigation;
  const Products = window.SMART_EXPERIENCE_PRODUCTS || {};
  const Rules = window.SMART_EXPERIENCE_RECOMMENDATION_RULES || { rules: [] };
  const validPrograms = new Set(["online", "flex"]);
  let benefitTransitioning = false;
  let revealedModules = 1;
  let activeModulesSlideId = null;
  let revealedMethodologyStages = 0;
  let revealedCycleSteps = 0;
  let activeOnlineBenefitId = "flexible_schedule";
  const decisionOptions = [
    { id: "certificacion", label: "CERTIFICACIÓN CON RESPALDO INTERNACIONAL", micro: "RESPALDO", icon: "◎" },
    { id: "metodologia", label: "METODOLOGÍA QUE REALMENTE ME AYUDE A APRENDER", micro: "APRENDIZAJE", icon: "↗" },
    { id: "acompanamiento", label: "ACOMPAÑAMIENTO DURANTE MI PROCESO", micro: "GUÍA", icon: "◇" },
    { id: "horarios", label: "FLEXIBILIDAD PARA ESTUDIAR SEGÚN MI RUTINA", micro: "FLEXIBILIDAD", icon: "◷" },
    { id: "presupuesto", label: "UNA INVERSIÓN QUE SE AJUSTE A MI PRESUPUESTO", micro: "INVERSIÓN", icon: "$" },
    { id: "practica", label: "PRACTICAR Y HABLAR INGLÉS CONSTANTEMENTE", micro: "PRÁCTICA", icon: "◌" },
    { id: "medir_avance", label: "VER CLARAMENTE MI AVANCE", micro: "PROGRESO", icon: "✓" }
  ];
  const budgetOptions = [
    { id: "monthly_500_plus", label: "CUOTAS DESDE $500.000 EN ADELANTE", micro: "CUOTAS / FINANCIACIÓN", images: ["assets/payment-options/cuotas de financiacion.png"] },
    { id: "cesantias", label: "FONDOS DE CESANTÍAS", micro: "CESANTÍAS", images: ["assets/payment-options/cesantias.png"] },
    { id: "credit_card", label: "CRÉDITO / DÉBITO", micro: "TARJETA", images: ["assets/payment-options/visaymaster.jpg"] },
    { id: "transfer", label: "TRANSFERENCIA / PSE", micro: "PAGO DIGITAL", images: ["assets/payment-options/pse.jpg", "assets/payment-options/bancolombia.png"] },
    { id: "financing_options", label: "ALTERNATIVAS DE FINANCIACIÓN", micro: "FINANCIACIÓN", images: ["assets/payment-options/fincomercio.jpg", "assets/payment-options/addi.jpg", "assets/payment-options/comultrasan.jpg", "assets/payment-options/PRAMI.png"] }
  ];
  const flexBenefitOptions = [
    ["modules", "MÓDULOS START → PRO"], ["methodology", "METODOLOGÍA"], ["learning_cycle", "CICLO DE APRENDIZAJE"], ["live_classes", "CLASES EN VIVO"], ["teachers_tkt", "DOCENTES TKT"], ["live_120", "120 MINUTOS"], ["max_8", "GRUPOS MÁXIMO 8"], ["cambridge", "CAMBRIDGE"], ["platform", "AUTOESTUDIO"], ["smartzone", "SMARTZONE"], ["flexible_schedule", "HORARIOS FLEXIBLES"], ["attendance", "CONSTANCIA"], ["linguaskill_preparation", "PREPARACIÓN LINGUASKILL"], ["linguaskill_final", "LINGUASKILL CAMBRIDGE"]
  ].map(([id, label]) => ({ id, label }));
  const onlineBenefitOptions = [
    ["flexible_schedule", "FLEXIBILIDAD DE HORARIOS"], ["online_schedule", "CLASES DE 60 MINUTOS"], ["online_tutoring", "TUTORÍAS PERSONALIZADAS"], ["online_teacher", "ACOMPAÑAMIENTO DOCENTE"], ["online_platform", "EXPERIENCIA DIGITAL"], ["online_resources", "RECURSOS DIGITALES"], ["online_recordings", "GRABACIÓN DE CLASES"], ["online_app", "APP DE AUTOESTUDIO"], ["online_forums", "FOROS DE INTERACCIÓN"], ["online_group", "CLASES GRUPALES"], ["online_autostudy", "APRENDIZAJE AUTÓNOMO"], ["online_certification", "POSIBILIDAD DE CERTIFICACIÓN INTERNACIONAL"]
  ].map(([id, label]) => ({ id, label }));
  const onlineInteractiveBenefits = [
    { id: "flexible_schedule", label: "HORARIOS FLEXIBLES", icon: "◷", description: "Clases de 60 minutos. Una o dos clases a la semana, dependiendo de la complejidad del tema." },
    { id: "online_forums", label: "FOROS DE INTERACCIÓN", icon: "◎", description: "Espacios para interactuar y participar durante el proceso de aprendizaje." },
    { id: "online_resources", label: "RECURSOS DIGITALES", icon: "◇", description: "Herramientas digitales para acompañar el proceso de aprendizaje." },
    { id: "online_tutoring", label: "TUTORÍAS PERSONALIZADAS", icon: "◌", description: "Sesiones de tutoría personalizada de 20 minutos." },
    { id: "online_teacher", label: "ACOMPAÑAMIENTO DOCENTE", icon: "✓", description: "Acompañamiento constante por parte del docente." },
    { id: "online_recordings", label: "GRABACIÓN DE CLASES", icon: "▶", description: "Grabación de las sesiones virtuales para acompañar tu proceso." },
    { id: "online_app", label: "APP DE AUTOESTUDIO", icon: "▣", description: "Una app de autoestudio para continuar practicando de forma autónoma." },
    { id: "online_group", label: "CLASES GRUPALES", icon: "✦", description: "Clases grupales de explicación para reforzar el aprendizaje." },
    { id: "online_live", label: "SESIONES EN VIVO", icon: "●", description: "Sesiones virtuales en vivo con herramientas de interacción." },
    { id: "online_rooms", label: "SALAS INTERACTIVAS", icon: "↗", description: "Salas virtuales interactivas para conectar con el docente y otros estudiantes." },
    { id: "online_pronunciation", label: "PRONUNCIACIÓN", icon: "◉", description: "Evaluación de pronunciación como parte de la experiencia digital." }
  ];
  const suggestedBenefits = { certificacion: ["linguaskill_preparation", "linguaskill_final"], metodologia: ["methodology", "learning_cycle"], acompanamiento: ["live_classes", "teachers_tkt", "max_8"], horarios: ["flexible_schedule"], presupuesto: ["investment_phase"], practica: ["smartzone", "live_classes"], medir_avance: ["modules", "platform"], adaptar_rutina: ["flexible_schedule", "platform", "learning_cycle"] };

  function currentBenefitOptions() {
    return State.get().selectedProgram === "online" ? onlineBenefitOptions : flexBenefitOptions;
  }

  function profileValues(profileState) {
    return new Set([...(profileState.rolActual || []), ...(profileState.objetivos || []), ...(profileState.realidadActual || [])]);
  }

  function recommendProgram(profileState) {
    const values = profileValues(profileState || {});
    const scores = { online: 0, flex: 0 };
    const reasons = { online: [], flex: [] };
    (Rules.rules || []).forEach((rule) => {
      if (!rule.values.some((value) => values.has(value))) return;
      scores[rule.program] += rule.weight;
      if (!reasons[rule.program].includes(rule.reason)) reasons[rule.program].push(rule.reason);
    });
    const winner = scores.online > scores.flex ? "online" : scores.flex > scores.online ? "flex" : null;
    const difference = winner ? Math.abs(scores.online - scores.flex) : 0;
    const threshold = Number(Rules.RECOMMENDATION_THRESHOLD) || 2;
    const recommended = winner && scores[winner] >= (Rules.minimumScore || 2) && difference >= threshold ? winner : null;
    const confidence = recommended ? (difference >= threshold + 3 ? "high" : "clear") : "mixed";
    return { recommended, scoreOnline: scores.online, scoreFlex: scores.flex, confidence, reasons: recommended ? reasons[recommended].slice(0, 3) : [] };
  }

  function persist() { Session.save(State.get()); }

  function calculateAndStore() {
    const result = recommendProgram(State.get());
    State.update((state) => {
      state.recommendedProgram = result.recommended;
      state.recommendation.systemRecommendation = result.recommended;
      state.recommendation.reasons = result.reasons.slice();
      state.recommendation.scoreOnline = result.scoreOnline;
      state.recommendation.scoreFlex = result.scoreFlex;
      state.recommendation.confidence = result.confidence;
      if (!validPrograms.has(state.selectedProgram)) state.selectedProgram = null;
      state.recommendation.executiveSelectedProduct = state.selectedProgram;
    });
    persist();
    return result;
  }

  function productCard(product, result) {
    const recommended = result.recommended === product.id;
    const selected = State.get().selectedProgram === product.id;
    const reasons = recommended ? result.reasons : [];
    return `<article class="program-card${recommended ? " is-recommended" : ""}${selected ? " is-selected" : ""}" data-program-card="${product.id}">
      ${recommended ? '<span class="program-card__badge">RECOMENDADA PARA TI</span>' : ""}
      <div class="program-card__brand"><span>SMART</span><strong>${product.id.toUpperCase()}</strong></div>
      <h3>${product.name}</h3><p>${product.phrase}</p>
      <ul>${product.highlights.map((item) => `<li><i aria-hidden="true">✓</i>${item}</li>`).join("")}</ul>
      ${reasons.length ? `<div class="program-card__reasons"><small>POR QUÉ PUEDE AJUSTARSE A TI</small>${reasons.map((reason) => `<span>✓ ${reason}</span>`).join("")}</div>` : ""}
      <button class="program-card__select" type="button" role="radio" aria-checked="${selected}" data-select-program="${product.id}">${selected ? "EXPERIENCIA SELECCIONADA" : `ELEGIR ${product.name.toUpperCase()}`}</button>
    </article>`;
  }

  function renderRecommendation() {
    const result = calculateAndStore();
    document.getElementById("recommendation-neutral").hidden = Boolean(result.recommended);
    document.getElementById("program-options").innerHTML = [Products.online, Products.flex].filter(Boolean).map((product) => productCard(product, result)).join("");
    const selected = State.get().selectedProgram;
    const button = document.getElementById("program-continue");
    button.disabled = !validPrograms.has(selected);
    button.textContent = validPrograms.has(selected) ? `CONTINUAR CON ${Products[selected].name.toUpperCase()}` : "SELECCIONA UNA EXPERIENCIA";
  }

  function renderBenefits() {
    const selected = State.get().selectedProgram;
    const product = Products[selected];
    if (!product) return;
    document.getElementById("benefits-program-name").textContent = product.name;
    const sliderMode = Array.isArray(product.benefitSlides);
    const layout = document.querySelector("[data-scene='program-benefits'] .benefits-layout");
    layout.classList.toggle("is-slider", sliderMode);
    document.getElementById("benefits-grid").hidden = sliderMode;
    document.getElementById("benefit-slider").hidden = !sliderMode;
    document.getElementById("benefits-standard-actions").hidden = sliderMode;
    document.getElementById("benefit-slider-actions").hidden = !sliderMode;
    if (sliderMode) renderBenefitSlide(State.get().currentBenefitSlide);
    else document.getElementById("benefits-grid").innerHTML = product.benefits.map((benefit, index) => `<article class="benefit-card" style="--benefit-order:${index}"><span aria-hidden="true">✓</span><p>${benefit}</p></article>`).join("");
    document.getElementById("preclose-program").textContent = product.name;
    const flex = selected === "flex";
    document.getElementById("program-preclose-title").textContent = flex ? "TODO LO QUE ME DIJISTE ENCAJA CON LO QUE ACABAMOS DE VER" : "¿ESTA EXPERIENCIA SE PARECE A LO QUE ESTÁS BUSCANDO?";
    const intro = document.getElementById("program-preclose-intro");
    intro.textContent = flex ? "¿SE PARECE A LA EXPERIENCIA QUE ESTÁS BUSCANDO?" : "";
    intro.hidden = !flex;
    renderPreclose();
  }

  function renderBenefitSlide(index) {
    const product = Products[State.get().selectedProgram];
    const slides = product?.benefitSlides || [];
    if (!slides.length) return;
    const safeIndex = Math.max(0, Math.min(Number(index) || 0, slides.length - 1));
    const slide = slides[safeIndex];
    State.update((state) => {
      state.currentBenefitSlide = safeIndex;
      if (!state.benefitsViewed.includes(slide.id)) state.benefitsViewed.push(slide.id);
    });
    persist();
    const modulesMode = slide.type === "modules";
    const methodologyMode = slide.type === "methodology";
    const schedulesMode = slide.type === "schedules";
    const cycleMode = slide.type === "learning-cycle";
    const criteriaMode = slide.type === "decision-criteria";
    const budgetMode = slide.type === "budget-preferences";
    const linguaskillPricingMode = slide.type === "linguaskill-pricing";
    const onlineBenefitsMode = slide.type === "online-benefits";
    const specialMode = modulesMode || methodologyMode || schedulesMode || cycleMode || criteriaMode || budgetMode || linguaskillPricingMode || onlineBenefitsMode;
    document.getElementById("benefit-slide-standard").hidden = specialMode;
    document.getElementById("flex-modules-experience").hidden = !modulesMode;
    document.getElementById("flex-methodology-experience").hidden = !methodologyMode;
    document.getElementById("flex-schedules-experience").hidden = !schedulesMode;
    document.getElementById("flex-learning-cycle-experience").hidden = !cycleMode;
    document.getElementById("flex-decision-criteria").hidden = !criteriaMode;
    document.getElementById("flex-budget-preferences").hidden = !budgetMode;
    document.getElementById("flex-linguaskill-pricing").hidden = !linguaskillPricingMode;
    document.getElementById("online-benefits-experience").hidden = !onlineBenefitsMode;
    const stage = document.getElementById("benefit-slider");
    stage.classList.toggle("is-image-only", Boolean(slide.imageOnly));
    const slideModules = modulesMode ? modulesForSlide(slide) : [];
    document.getElementById("benefit-next").hidden = (modulesMode && revealedModules < slideModules.length) || (methodologyMode && revealedMethodologyStages < (Products.flex?.methodology?.length || 0)) || (cycleMode && revealedCycleSteps < (Products.flex?.learningCycle?.length || 0));
    if (modulesMode) {
      if (activeModulesSlideId !== slide.id) {
        activeModulesSlideId = slide.id;
        revealedModules = 1;
      }
      renderModules(slide);
      stage.dataset.benefitId = slide.id;
      stage.style.removeProperty("--benefit-background");
      stage.classList.remove("is-revealing");
      window.requestAnimationFrame(() => stage.classList.add("is-revealing"));
      return;
    }
    if (methodologyMode) {
      renderMethodology();
      renderSpecialStage(slide);
      return;
    }
    if (schedulesMode) {
      renderSchedules();
      renderSpecialStage(slide);
      return;
    }
    if (cycleMode) {
      renderLearningCycle();
      renderSpecialStage(slide);
      return;
    }
    if (criteriaMode) { renderDialogueOptions("decision"); renderSpecialStage(slide); return; }
    if (budgetMode) { renderDialogueOptions("budget"); renderSpecialStage(slide); return; }
    if (linguaskillPricingMode) { renderSpecialStage(slide); return; }
    if (onlineBenefitsMode) { renderOnlineBenefits(); renderSpecialStage(slide); return; }
    const image = document.getElementById("benefit-slide-image");
    image.src = slide.image;
    image.alt = slide.title.replace(/\n/g, " ");
    image.style.objectFit = slide.imageFit || "contain";
    image.style.objectPosition = slide.imagePosition || "center";
    stage.dataset.benefitId = slide.id;
    stage.dataset.textSafeArea = slide.textSafeArea || "left";
    stage.style.setProperty("--benefit-background", `url("../${slide.image}")`);
    document.getElementById("benefit-slide-accent").textContent = [slide.chapter, slide.accent].filter(Boolean).join(" · ");
    document.getElementById("benefit-slide-title").textContent = slide.title || "";
    document.getElementById("benefit-slide-title").hidden = Boolean(slide.microLabelOnly);
    const subtitle = document.getElementById("benefit-slide-subtitle");
    subtitle.textContent = slide.subtitle || "";
    subtitle.hidden = !slide.subtitle;
    document.getElementById("benefit-slide-phrase").textContent = slide.phrase;
    document.querySelector("#benefit-slide-standard .benefit-slide__copy").hidden = Boolean(slide.imageOnly);
    stage.classList.remove("is-revealing");
    window.requestAnimationFrame(() => stage.classList.add("is-revealing"));
  }

  function renderSpecialStage(slide) {
    const stage = document.getElementById("benefit-slider");
    stage.dataset.benefitId = slide.id;
    stage.style.removeProperty("--benefit-background");
    stage.classList.remove("is-revealing");
    if (slide.type === "linguaskill-pricing") {
      const online = State.get().selectedProgram === "online";
      document.getElementById("linguaskill-program-label").textContent = `${online ? "SMART ONLINE" : "SMART FLEX"} · INFORMACIÓN COMERCIAL`;
      document.getElementById("linguaskill-pricing-note").textContent = online ? "No son botones de compra. Linguaskill es una opción de certificación y no está incluido automáticamente en Smart Online." : "No son botones de compra. Valores aplicables únicamente a Smart Flex.";
    }
    window.requestAnimationFrame(() => stage.classList.add("is-revealing"));
  }

  function renderOnlineBenefits() {
    const active = onlineInteractiveBenefits.find((item) => item.id === activeOnlineBenefitId) || onlineInteractiveBenefits[0];
    document.getElementById("online-benefits-options").innerHTML = onlineInteractiveBenefits.map((item) => `<button type="button" class="${item.id === active.id ? "is-active" : ""}" aria-pressed="${item.id === active.id}" data-online-benefit="${item.id}"><i aria-hidden="true">${item.icon}</i><span>${item.label}</span></button>`).join("");
    const detail = document.getElementById("online-benefit-detail");
    detail.innerHTML = `<small>BENEFICIO SELECCIONADO</small><i aria-hidden="true">${active.icon}</i><h4>${active.label}</h4><p>${active.description}</p>`;
    detail.classList.remove("is-revealing");
    window.requestAnimationFrame(() => detail.classList.add("is-revealing"));
  }

  function renderDialogueOptions(kind) {
    const criteria = kind === "decision";
    const options = criteria ? decisionOptions : budgetOptions;
    const selected = criteria ? State.get().decisionCriteria.map((item) => item.id) : State.get().budgetPreferences.map((item) => item.id);
    const target = document.getElementById(criteria ? "decision-criteria-options" : "budget-preferences-options");
    target.innerHTML = options.map((option) => `<button type="button" class="dialogue-option${selected.includes(option.id) ? " is-selected" : ""}" aria-pressed="${selected.includes(option.id)}" data-${criteria ? "criterion" : "budget"}-id="${option.id}">${option.images ? `<span class="payment-option__media">${option.images.map((src) => `<img src="${src}" alt="" loading="lazy" decoding="async">`).join("")}</span>` : `<i aria-hidden="true">${option.icon || "✓"}</i>`}<span class="dialogue-option__copy"><small>${option.micro || "PRIORIDAD"}</small><strong>${option.label}</strong></span><b aria-hidden="true">✓</b></button>`).join("");
    document.getElementById("benefit-next").hidden = selected.length === 0;
  }

  function toggleStructured(kind, id) {
    const options = kind === "decision" ? decisionOptions : budgetOptions;
    const key = kind === "decision" ? "decisionCriteria" : "budgetPreferences";
    const option = options.find((item) => item.id === id);
    if (!option) return;
    State.update((state) => { const current = state[key] || []; state[key] = current.some((item) => item.id === id) ? current.filter((item) => item.id !== id) : [...current, { id: option.id, label: option.label }]; });
    persist(); renderDialogueOptions(kind);
  }

  function renderMethodology() {
    const stages = Products.flex?.methodology || [];
    document.getElementById("flex-methodology-stages").innerHTML = stages.slice(0, revealedMethodologyStages).map((stage, index) => `<article class="flex-methodology__stage is-new" style="--method-index:${index}"><b>0${index + 1}</b><strong>${stage.name}</strong><span>${stage.phrase}</span></article>`).join("");
    const complete = revealedMethodologyStages >= stages.length;
    document.getElementById("flex-methodology-hint").textContent = complete ? "EL CICLO ESTÁ COMPLETO" : "Haz clic para descubrir cada momento";
    document.getElementById("benefit-next").hidden = !complete;
    document.getElementById("flex-methodology-experience").classList.toggle("is-complete", complete);
  }

  function revealNextMethodologyStage() {
    const stages = Products.flex?.methodology || [];
    if (benefitTransitioning || revealedMethodologyStages >= stages.length) return;
    benefitTransitioning = true;
    revealedMethodologyStages += 1;
    renderMethodology();
    window.setTimeout(() => { benefitTransitioning = false; }, 700);
  }

  function renderSchedules() {
    const schedules = Products.flex?.schedules;
    if (!schedules) return;
    const selected = State.get().selectedScheduleSlots || [];
    const zone = (title, times) => `<article><h4>${title}</h4><div>${times.map((time) => { const key = `${title}|${time}`; return `<button type="button" class="${selected.includes(key) ? "is-selected" : ""}" aria-pressed="${selected.includes(key)}" data-schedule-slot="${key}">${time}</button>`; }).join("")}</div></article>`;
    document.getElementById("flex-schedules-zones").innerHTML = zone("LUNES A VIERNES", schedules.weekdays) + zone("SÁBADOS", schedules.saturday);
    document.getElementById("flex-schedules-selection").hidden = selected.length === 0;
    document.getElementById("benefit-next").hidden = false;
  }

  function toggleScheduleSlot(key) {
    State.update((state) => { const selected = state.selectedScheduleSlots || []; state.selectedScheduleSlots = selected.includes(key) ? selected.filter((item) => item !== key) : [...selected, key]; });
    persist();
    renderSchedules();
  }

  function renderLearningCycle() {
    const steps = Products.flex?.learningCycle || [];
    document.getElementById("flex-learning-cycle-steps").innerHTML = steps.slice(0, revealedCycleSteps).map((step, index) => `<article class="flex-learning-cycle__step is-new is-active" style="--cycle-index:${index}"><i aria-hidden="true">${step.icon}</i><strong>${step.name}</strong></article>`).join("");
    const complete = revealedCycleSteps >= steps.length;
    document.getElementById("flex-learning-cycle-hint").textContent = complete ? "EL CICLO CONTINÚA" : "Haz clic para descubrir el ciclo";
    document.getElementById("benefit-next").hidden = !complete;
    document.getElementById("flex-learning-cycle-experience").classList.toggle("is-complete", complete);
  }

  function revealNextCycleStep() {
    const steps = Products.flex?.learningCycle || [];
    if (benefitTransitioning || revealedCycleSteps >= steps.length) return;
    benefitTransitioning = true;
    revealedCycleSteps += 1;
    renderLearningCycle();
    window.setTimeout(() => { benefitTransitioning = false; }, 500);
  }

  function modulesForSlide(slide) {
    if (Array.isArray(slide?.modules)) {
      const meanings = { START: "Primeros pasos", GO: "Confianza", FLOW: "Fluidez", PLUS: "Crecimiento", PRO: "Dominio" };
      return slide.modules.map((name) => ({ name, meaning: meanings[name] || "" }));
    }
    return Products.flex?.modules || [];
  }

  function currentModulesSlide() {
    const product = Products[State.get().selectedProgram];
    return product?.benefitSlides?.[State.get().currentBenefitSlide] || null;
  }

  function renderModules(slide = currentModulesSlide()) {
    const modules = modulesForSlide(slide);
    const visible = modules.slice(0, revealedModules);
    const heading = document.querySelector("#flex-modules-experience > h3");
    heading.textContent = slide?.title || "TU CAMINO EN SMART FLEX";
    const eyebrow = document.querySelector("#flex-modules-experience > .flex-modules__eyebrow");
    eyebrow.textContent = slide?.language ? `${slide.language} · AVANZA MÓDULO A MÓDULO` : "AVANZA MÓDULO A MÓDULO";
    document.getElementById("flex-modules-path").style.setProperty("--module-count", modules.length);
    document.getElementById("flex-modules-path").innerHTML = visible.map((module, index) => `<article class="flex-module${index === visible.length - 1 ? " is-new" : ""}${module.name === "PRO" ? " is-pro" : ""}" style="--module-index:${index}"><span>MÓDULO</span><strong>${module.name}</strong><em>${module.meaning}</em></article>`).join("");
    const complete = revealedModules >= modules.length;
    document.getElementById("flex-modules-hint").textContent = complete ? "TU TRAYECTORIA ESTÁ COMPLETA" : "Haz clic para avanzar";
    document.getElementById("benefit-next").hidden = !complete;
    document.getElementById("flex-modules-experience").classList.toggle("is-complete", complete);
  }

  function revealNextModule() {
    const slide = currentModulesSlide();
    const modules = modulesForSlide(slide);
    if (benefitTransitioning || revealedModules >= modules.length) return;
    benefitTransitioning = true;
    revealedModules += 1;
    renderModules(slide);
    window.setTimeout(() => { benefitTransitioning = false; }, 700);
  }

  function moveBenefit(direction) {
    const slides = Products[State.get().selectedProgram]?.benefitSlides || [];
    const current = State.get().currentBenefitSlide;
    if (direction === "previous") {
      if (current === 0) navigate("program-recommendation");
      else transitionBenefitSlide(current - 1);
      return;
    }
    if (current >= slides.length - 1) navigate("program-preclose");
    else transitionBenefitSlide(current + 1);
  }

  function transitionBenefitSlide(nextIndex) {
    if (benefitTransitioning) return;
    benefitTransitioning = true;
    const stage = document.getElementById("benefit-slider");
    stage.classList.add("is-leaving");
    window.setTimeout(() => {
      renderBenefitSlide(nextIndex);
      stage.classList.remove("is-leaving");
      window.setTimeout(() => { benefitTransitioning = false; }, 360);
    }, 220);
  }

  function selectProgram(program) {
    if (!validPrograms.has(program)) return;
    State.update((state) => {
      const changed = state.selectedProgram !== program;
      state.selectedProgram = program;
      state.recommendation.executiveSelectedProduct = program;
      state.recommendation.precloseChoice = null;
      if (changed) {
        state.currentBenefitSlide = 0;
        state.benefitsViewed = [];
        state.associatedBenefits = [];
        state.favoriteBenefits = [];
        state.selectedScheduleSlots = [];
        revealedModules = 1;
        activeModulesSlideId = null;
        revealedMethodologyStages = 0;
        revealedCycleSteps = 0;
      }
    });
    persist();
    renderRecommendation();
    document.dispatchEvent(new CustomEvent("smart:programchange", { detail: { program } }));
  }

  function navigate(sceneId) {
    if (sceneId === "program-benefits" && !validPrograms.has(State.get().selectedProgram)) return;
    State.update((state) => { state.currentScene = sceneId; });
    persist();
    Navigation.show(sceneId, { focus: true });
    if (sceneId === "program-recommendation") renderRecommendation();
    if (sceneId === "program-benefits" || sceneId === "program-preclose") renderBenefits();
    if (sceneId === "program-favorites") renderFavorites();
  }

  function goToInvestment() {
    State.update((state) => { state.recommendation.precloseChoice = "investment"; state.salesContext = { clientName: state.prospect.name, selectedExecutive: state.selectedExecutive, perfilPrincipal: state.perfilPrincipal, decisionCriteria: state.decisionCriteria.map((item) => ({ ...item })), budgetPreferences: state.budgetPreferences.map((item) => ({ ...item })), recommendedProgram: state.recommendedProgram, selectedProgram: state.selectedProgram, favoriteBenefits: state.favoriteBenefits.map((item) => ({ ...item })) }; window.SMART_EXPERIENCE_SALES_CONTEXT = state.salesContext; });
    persist();
    navigate("investment");
  }

  function reviewAlternative() {
    State.update((state) => { state.recommendation.precloseChoice = "review"; });
    persist();
    const slides = Products[State.get().selectedProgram]?.benefitSlides || [];
    if (slides.length) { State.update((state) => { state.currentBenefitSlide = Math.max(0, slides.length - 1); }); navigate("program-benefits"); } else navigate("program-recommendation");
  }

  function renderPreclose() {
    const flex = State.get().selectedProgram === "flex";
    document.getElementById("flex-preclose-content").hidden = false;
    document.getElementById("preclose-found-title").textContent = `LO QUE ENCONTRASTE EN ${flex ? "SMART FLEX" : "SMART ONLINE"}`;
    const state = State.get();
    document.getElementById("preclose-criteria").innerHTML = state.decisionCriteria.map((item) => `<article><span>✓</span><strong>${item.label}</strong></article>`).join("") || "<p>Aún no se han seleccionado criterios.</p>";
    const suggestions = new Set(state.decisionCriteria.flatMap((item) => suggestedBenefits[item.id] || []));
    const benefitOptions = currentBenefitOptions();
    if (!state.associatedBenefits.length && suggestions.size && flex) State.update((draft) => { draft.associatedBenefits = benefitOptions.filter((item) => suggestions.has(item.id)).map((item) => ({ ...item })); });
    const associated = State.get().associatedBenefits.map((item) => item.id);
    document.getElementById("preclose-benefits").innerHTML = benefitOptions.map((item) => `<button type="button" class="preclose-benefit${associated.includes(item.id) ? " is-selected" : ""}${suggestions.has(item.id) ? " is-suggested" : ""}" aria-pressed="${associated.includes(item.id)}" data-associated-benefit="${item.id}"><span>✓</span><strong>${item.label}</strong></button>`).join("");
    const matchNext = document.getElementById("preclose-match-next");
    if (matchNext) matchNext.disabled = !(state.decisionCriteria.length && associated.length);
    renderFavorites();
    persist();
  }

  function renderFavorites() {
    const target = document.getElementById("favorite-benefits-large"); if (!target) return;
    const benefitOptions = currentBenefitOptions();
    const favorites = State.get().favoriteBenefits.map((item) => item.id);
    const featured = benefitOptions.filter((item) => !["modules","learning_cycle","live_120","teachers_tkt","attendance","linguaskill_preparation"].includes(item.id));
    target.innerHTML = featured.map((item) => `<button type="button" class="favorite-benefit-card${favorites.includes(item.id) ? " is-selected" : ""}" aria-pressed="${favorites.includes(item.id)}" data-favorite-benefit="${item.id}"><i aria-hidden="true">${favoriteIcon(item.id)}</i><strong>${item.label}</strong><span aria-hidden="true">✓</span></button>`).join("");
    const investment = document.getElementById("preclose-investment"); if (investment) investment.disabled = favorites.length === 0;
  }

  function favoriteIcon(id) { return ({ live_classes:"▶", max_8:"8", flexible_schedule:"◷", methodology:"↗", cambridge:"C", smartzone:"◌", platform:"▣", linguaskill_final:"◎", accompaniment:"◇" })[id] || "✓"; }

  function toggleBenefitState(key, id) {
    const option = currentBenefitOptions().find((item) => item.id === id); if (!option) return;
    State.update((state) => { const current = state[key] || []; state[key] = current.some((item) => item.id === id) ? current.filter((item) => item.id !== id) : [...current, { ...option }]; });
    persist(); renderPreclose(); renderFavorites();
  }

  document.addEventListener("click", (event) => {
    const selection = event.target.closest("[data-select-program]");
    if (selection) selectProgram(selection.dataset.selectProgram);
    const next = event.target.closest("[data-recommendation-next]");
    if (next && !next.disabled) navigate(next.dataset.recommendationNext);
    const back = event.target.closest("[data-recommendation-back]");
    if (back) navigate(back.dataset.recommendationBack);
    const preclose = event.target.closest("[data-preclose]");
    if (preclose?.dataset.preclose === "investment") goToInvestment();
    if (preclose?.dataset.preclose === "review") reviewAlternative();
    const benefitAction = event.target.closest("[data-benefit-action]");
    if (benefitAction) moveBenefit(benefitAction.dataset.benefitAction);
    const modulesExperience = event.target.closest("#flex-modules-experience");
    if (modulesExperience && !event.target.closest("button")) revealNextModule();
    const methodologyExperience = event.target.closest("#flex-methodology-experience");
    if (methodologyExperience && !event.target.closest("button")) revealNextMethodologyStage();
    const cycleExperience = event.target.closest("#flex-learning-cycle-experience");
    if (cycleExperience && !event.target.closest("button")) revealNextCycleStep();
    const scheduleSlot = event.target.closest("[data-schedule-slot]");
    if (scheduleSlot) toggleScheduleSlot(scheduleSlot.dataset.scheduleSlot);
    const criterion = event.target.closest("[data-criterion-id]"); if (criterion) toggleStructured("decision", criterion.dataset.criterionId);
    const budget = event.target.closest("[data-budget-id]"); if (budget) toggleStructured("budget", budget.dataset.budgetId);
    const onlineBenefit = event.target.closest("[data-online-benefit]"); if (onlineBenefit) { activeOnlineBenefitId = onlineBenefit.dataset.onlineBenefit; renderOnlineBenefits(); }
    const associated = event.target.closest("[data-associated-benefit]"); if (associated) toggleBenefitState("associatedBenefits", associated.dataset.associatedBenefit);
    const favorite = event.target.closest("[data-favorite-benefit]"); if (favorite) toggleBenefitState("favoriteBenefits", favorite.dataset.favoriteBenefit);
    const summary = event.target.closest("[data-summary-action='generate']"); if (summary) { Session.save(State.get()); window.location.assign("summary.html"); }
  });

  function sync(sceneId) {
    const scene = sceneId || State.get().currentScene;
    if (scene === "program-recommendation") renderRecommendation();
    if (scene === "program-benefits" || scene === "program-preclose") renderBenefits();
    if (scene === "program-favorites") renderFavorites();
  }

  window.recommendProgram = recommendProgram;
  window.SmartExperienceRecommendation = Object.freeze({ recommendProgram, renderRecommendation, renderBenefitSlide, revealNextModule, revealNextMethodologyStage, revealNextCycleStep, goToInvestment, sync });
})();
