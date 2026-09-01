(function () {
  "use strict";

  const State = window.SmartExperienceState;
  const Session = window.SmartExperienceSession;
  const Navigation = window.SmartExperienceNavigation;
  const profileConfig = (window.SMART_EXPERIENCE_DISCOVERY || {}).profiles || {};
  const canonicalProfiles = Object.freeze({
    employee: "trabajando",
    student: "estudiando",
    job_seeker: "nuevas_oportunidades"
  });
  let smartMap = null;
  let mapPopup = null;
  let mapLoaded = false;
  let cityMarkers = [];
  let clusterMarkers = [];

  function normalizeName(value) {
    return String(value || "").trim().replace(/\s+/g, " ").slice(0, 80);
  }

  function syncProspectName() {
    const name = State.get().prospect.name || "TU NOMBRE";
    document.getElementById("welcome-name").textContent = name.toLocaleUpperCase("es-CO");
    document.querySelectorAll("[data-prospect-name]").forEach((node) => { node.textContent = name; });
    document.getElementById("prospect-name").value = State.get().prospect.name;
  }

  function renderExecutive() {
    const executives = window.SMART_EXPERIENCE_EXECUTIVES || [];
    const selectedId = State.get().selectedExecutive?.id;
    const executive = executives.find((item) => item.id === selectedId);
    if (!executive) return;
    document.getElementById("executive-name").textContent = `${executive.firstName} ${executive.firstLastName}`;
    document.getElementById("executive-role").textContent = executive.role;
    document.getElementById("executive-phrase").textContent = executive.phrase;
    const image = document.querySelector(".executive-card__portrait--photo img");
    image.src = executive.photo;
    image.alt = executive.photoAlt;
  }

  function renderExecutiveOptions() {
    const selectedId = State.get().selectedExecutive?.id;
    document.getElementById("executive-options").innerHTML = (window.SMART_EXPERIENCE_EXECUTIVES || []).map((executive) => `<button class="executive-option${executive.id === selectedId ? " is-selected" : ""}" type="button" role="radio" aria-checked="${executive.id === selectedId}" data-executive-id="${executive.id}"><img src="${executive.photo}" alt="${executive.photoAlt}" loading="lazy" decoding="async"><span><strong>${executive.firstName}</strong><small>${executive.firstLastName}</small></span></button>`).join("");
    document.getElementById("executive-select-next").disabled = !selectedId;
  }

  function selectExecutive(id) {
    const executive = (window.SMART_EXPERIENCE_EXECUTIVES || []).find((item) => item.id === id);
    if (!executive) return;
    State.update((state) => { state.selectedExecutive = { id: executive.id, fullName: executive.fullName, firstName: executive.firstName, firstLastName: executive.firstLastName, photo: executive.photo, phone: executive.phone || "", whatsapp: executive.whatsapp || "" }; });
    Session.save(State.get());
    renderExecutiveOptions();
    renderExecutive();
  }

  function groupLocations() {
    const source = window.SMART_EXPERIENCE_SMART_LOCATIONS;
    if (!source) return [];
    const grouped = new Map();
    source.locations.forEach((location) => {
      if (!grouped.has(location.city)) grouped.set(location.city, { city: location.city, coordinates: [location.cityLongitude, location.cityLatitude], locations: [] });
      grouped.get(location.city).locations.push(location);
    });
    return Array.from(grouped.values()).sort((a, b) => b.locations.length - a.locations.length || a.city.localeCompare(b.city, "es"));
  }

  function renderLocationStats() {
    const source = window.SMART_EXPERIENCE_SMART_LOCATIONS;
    const cities = groupLocations();
    if (!source) return;
    document.getElementById("location-site-count").textContent = source.locations.length;
    document.getElementById("location-city-count").textContent = cities.length;
  }

  function createCityMarker(group) {
    const element = document.createElement("button");
    element.type = "button";
    element.className = "smart-city-marker";
    element.setAttribute("aria-label", `${group.city}: ${group.locations.length} ${group.locations.length === 1 ? "sede" : "sedes"}`);
    element.innerHTML = `<span>${group.locations.length}</span><strong>${group.city}<small>${group.locations.length} ${group.locations.length === 1 ? "sede" : "sedes"}</small></strong>`;
    element.addEventListener("click", (event) => { event.stopPropagation(); focusCity(group); });
    return { marker: new maplibregl.Marker({ element, anchor: "center" }).setLngLat(group.coordinates).addTo(smartMap), group, element };
  }

  function createClusterMarker(label, groups, coordinates) {
    const count = groups.reduce((sum, group) => sum + group.locations.length, 0);
    const element = document.createElement("button");
    element.type = "button";
    element.className = "smart-city-marker smart-city-marker--cluster";
    element.setAttribute("aria-label", `${label}: grupo de ${count} sedes`);
    element.innerHTML = `<span>${count}</span><strong>${label}</strong>`;
    element.addEventListener("click", (event) => { event.stopPropagation(); smartMap.flyTo({ center: coordinates, zoom: 8, duration: 1600, essential: true }); });
    return { marker: new maplibregl.Marker({ element }).setLngLat(coordinates).addTo(smartMap), groups, element };
  }

  function updateMapMarkerVisibility() {
    if (!smartMap) return;
    const clustered = smartMap.getZoom() < 7.5;
    cityMarkers.forEach(({ group, element }) => {
      const dense = ["Bogotá", "Soacha", "Chía", "Mosquera", "Cajicá", "Medellín", "Bello", "Envigado", "Sabaneta", "Itagüí", "Rionegro"].includes(group.city);
      element.classList.toggle("is-map-hidden", clustered && dense);
    });
    clusterMarkers.forEach(({ element }) => { element.classList.toggle("is-map-hidden", !clustered); });
  }

  function renderCityDetail(group) {
    const detail = document.getElementById("map-detail");
    const sedeButtons = group.locations.map((item) => `<button type="button" data-sede-id="${item.id}"><strong>${item.name}</strong>${item.zone ? `<span>${item.zone}</span>` : ""}</button>`).join("");
    detail.innerHTML = `<p>PRESENCIA SMART</p><h3>${group.city}</h3><span>${group.locations.length} ${group.locations.length === 1 ? "sede" : "sedes"}</span><div class="map-sede-list">${sedeButtons}</div>`;
    detail.classList.add("is-active");
  }

  function focusCity(group) {
    smartMap.flyTo({ center: group.coordinates, zoom: 9, duration: 1700, essential: true });
    document.getElementById("map-back").hidden = false;
    renderCityDetail(group);
  }

  function showSede(sedeId) {
    const source = window.SMART_EXPERIENCE_SMART_LOCATIONS;
    const sede = source && source.locations.find((item) => item.id === sedeId);
    if (!sede || !smartMap) return;
    const fields = [sede.address && `<p>${sede.address}</p>`, sede.zone && `<span>${sede.zone}</span>`].filter(Boolean).join("");
    mapPopup.setLngLat([sede.cityLongitude, sede.cityLatitude]).setHTML(`<article class="sede-popup"><small>SEDE SMART</small><h3>${sede.name}</h3><strong>${sede.city}</strong>${fields}</article>`).addTo(smartMap);
  }

  function resetMapCountry() {
    if (!smartMap) return;
    mapPopup.remove();
    smartMap.fitBounds([[-79.2, -4.4], [-66.6, 13.7]], { padding: 80, duration: 1700, essential: true });
    document.getElementById("map-back").hidden = true;
    const detail = document.getElementById("map-detail");
    detail.classList.remove("is-active");
    detail.innerHTML = "<p>EXPLORA NUESTRA PRESENCIA</p><h3>Selecciona una ciudad</h3><span>Acércate al mapa para conocer sus sedes.</span>";
  }

  function ensureMap() {
    if (smartMap) { smartMap.resize(); return; }
    const loading = document.getElementById("map-loading");
    if (!window.maplibregl || !window.SMART_EXPERIENCE_SMART_LOCATIONS) {
      loading.classList.add("is-error");
      return;
    }
    smartMap = new maplibregl.Map({
      container: "smart-map",
      center: [-73.6, 4.7],
      zoom: 4.45,
      minZoom: 3.5,
      maxZoom: 13,
      attributionControl: false,
      style: { version: 8, sources: { countries: { type: "geojson", data: window.SMART_MAP_COUNTRIES }, colombia: { type: "geojson", data: window.SMART_MAP_COLOMBIA } }, layers: [
        { id: "ocean", type: "background", paint: { "background-color": "#dfe8eb" } },
        { id: "countries-fill", type: "fill", source: "countries", paint: { "fill-color": "#f3f0e9", "fill-opacity": 1 } },
        { id: "countries-line", type: "line", source: "countries", paint: { "line-color": "#b8c0c1", "line-width": 0.85, "line-opacity": 0.78 } },
        { id: "colombia-shadow", type: "line", source: "colombia", paint: { "line-color": "#7d1027", "line-width": 8, "line-blur": 8, "line-opacity": 0.18 } },
        { id: "colombia-fill", type: "fill", source: "colombia", paint: { "fill-color": "#fffaf1", "fill-opacity": 1 } },
        { id: "colombia-line", type: "line", source: "colombia", paint: { "line-color": "#9b1730", "line-width": 2.2, "line-opacity": 0.88 } }
      ] }
    });
    window.SMART_EXPERIENCE_MAP = smartMap;
    const mapShell = document.querySelector(".smart-map-shell");
    if (window.ResizeObserver && mapShell) new ResizeObserver(() => smartMap?.resize()).observe(mapShell);
    window.addEventListener("resize", () => smartMap?.resize(), { passive: true });
    smartMap.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    mapPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, maxWidth: "340px" });
    smartMap.on("load", () => {
      mapLoaded = true;
      loading.hidden = true;
      const groups = groupLocations();
      cityMarkers = groups.map(createCityMarker);
      const bogota = groups.filter((group) => ["Bogotá", "Soacha", "Chía", "Mosquera", "Cajicá"].includes(group.city));
      const antioquia = groups.filter((group) => ["Medellín", "Bello", "Envigado", "Sabaneta", "Itagüí", "Rionegro"].includes(group.city));
      clusterMarkers = [createClusterMarker("Bogotá / Cundinamarca", bogota, [-74.08, 4.72]), createClusterMarker("Antioquia", antioquia, [-75.57, 6.22])];
      updateMapMarkerVisibility();
      smartMap.fitBounds([[-79.2, -4.4], [-66.6, 13.7]], { padding: 80, duration: 0 });
    });
    smartMap.on("zoom", updateMapMarkerVisibility);
    smartMap.on("error", () => { if (!mapLoaded) loading.classList.add("is-error"); });
  }

  function showGeoPanel(panelName) {
    document.querySelectorAll("[data-geo-panel]").forEach((panel) => {
      const active = panel.dataset.geoPanel === panelName;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    if (panelName === "colombia") window.setTimeout(() => { ensureMap(); smartMap?.resize(); }, 80);
  }

  function persistAndShow(sceneId, focus) {
    State.update((state) => { state.currentScene = sceneId; });
    Session.save(State.get());
    Navigation.show(sceneId, { focus });
    window.SmartEmploymentDiscovery?.sync(sceneId);
    if (sceneId === "presence") window.setTimeout(ensureMap, 100);
  }

  function start() {
    const input = document.getElementById("prospect-name");
    const error = document.getElementById("name-error");
    const name = normalizeName(input.value);
    if (!name) {
      error.hidden = false;
      input.setAttribute("aria-invalid", "true");
      input.focus();
      return;
    }
    error.hidden = true;
    input.removeAttribute("aria-invalid");
    State.update((state) => { state.prospect.name = name; });
    syncProspectName();
    renderExecutiveOptions();
    persistAndShow("executive-select", true);
  }

  function goNext() {
    persistAndShow(Navigation.next(State.get().currentScene), true);
  }

  function goPrevious() {
    const state = State.get();
    persistAndShow(Navigation.previous(state.currentScene), true);
  }

  function selectProfile(button) {
    const profile = button.dataset.profile;
    document.querySelectorAll("[data-profile]").forEach((option) => {
      const selected = option === button;
      option.classList.toggle("is-selected", selected);
      option.setAttribute("aria-checked", String(selected));
    });
    State.update((state) => {
      const nextProfile = canonicalProfiles[profile] || profile;
      if (state.perfilPrincipal && state.perfilPrincipal !== nextProfile) {
        state.rolActual = [];
        state.objetivos = [];
        state.realidadActual = [];
        state.respuestasRolActual = [];
        state.objetivosProfesionales = [];
        state.oportunidadesIngles = [];
        state.employment.professionalGoalOther = "";
        state.recommendedProgram = null;
        state.selectedProgram = null;
        state.recommendation.systemRecommendation = null;
        state.recommendation.executiveSelectedProduct = null;
        state.recommendation.reasons = [];
        state.recommendation.precloseChoice = null;
        state.currentBenefitSlide = 0;
        state.benefitsViewed = [];
      }
      state.profile = profile;
      state.perfilPrincipal = nextProfile;
      state.prospect.profile = profile;
    });
    document.getElementById("profile-error").hidden = true;
    updateProfileReaction(profile);
    Session.save(State.get());
  }

  function updateProfileReaction(profile) {
    const reaction = document.getElementById("profile-reaction");
    const reactionText = document.getElementById("profile-reaction-text");
    const continueButton = document.getElementById("profile-continue");
    const valid = Boolean(profileConfig[profile]?.reaction);
    reaction.hidden = !valid;
    reactionText.textContent = valid ? profileConfig[profile].reaction : "";
    continueButton.disabled = !valid;
    continueButton.textContent = valid ? "CONTINUEMOS CON TU HISTORIA" : "Selecciona una opción para continuar";
  }

  function syncProfile() {
    const profile = State.get().profile || State.get().prospect.profile;
    document.querySelectorAll("[data-profile]").forEach((option) => {
      const selected = option.dataset.profile === profile;
      option.classList.toggle("is-selected", selected);
      option.setAttribute("aria-checked", String(selected));
    });
    updateProfileReaction(profile);
  }

  function completeProfile() {
    if (!State.get().profile) {
      const error = document.getElementById("profile-error");
      error.hidden = false;
      document.querySelector("[data-profile]").focus();
      return;
    }
    persistAndShow(resolveNextStep(State.get().perfilPrincipal), true);
  }

  function resolveNextStep(perfilPrincipal) {
    const validProfiles = new Set(Object.values(canonicalProfiles));
    return validProfiles.has(perfilPrincipal) ? "employment-english" : "discovery-profile";
  }

  function resetSession() {
    Session.clear();
    State.reset();
    syncProspectName();
    syncProfile();
    window.SmartEmploymentDiscovery?.sync("welcome");
    persistAndShow("welcome", true);
    document.getElementById("prospect-name").focus();
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]")?.dataset.action;
      if (action === "start") start();
      if (action === "next") goNext();
      if (action === "previous") goPrevious();
      if (action === "change-executive") persistAndShow("executive-select", true);
      if (action === "complete-profile") completeProfile();
      if (action === "show-expansion") showGeoPanel("international");
      if (action === "show-colombia") showGeoPanel("colombia");
      if (action === "map-country") resetMapCountry();
      if (action === "reset") resetSession();
      if (action === "return-home") resetSession();
      const profileOption = event.target.closest("[data-profile]");
      if (profileOption) selectProfile(profileOption);
      const executiveOption = event.target.closest("[data-executive-id]");
      if (executiveOption) selectExecutive(executiveOption.dataset.executiveId);
      if (action === "confirm-executive" && State.get().selectedExecutive?.id) persistAndShow("executive", true);
      const sedeButton = event.target.closest("[data-sede-id]");
      if (sedeButton) showSede(sedeButton.dataset.sedeId);
    });
    document.getElementById("prospect-name").addEventListener("keydown", (event) => {
      if (event.key === "Enter") start();
    });
    document.getElementById("prospect-name").addEventListener("input", (event) => {
      const preview = normalizeName(event.target.value);
      document.getElementById("welcome-name").textContent = (preview || "TU NOMBRE").toLocaleUpperCase("es-CO");
    });
  }

  function init() {
    const restored = Session.restore();
    if (restored) State.replace(restored);
    if (!Navigation.sceneOrder.includes(State.get().currentScene)) {
      State.update((state) => { state.currentScene = "welcome"; });
      Session.save(State.get());
    }
    renderExecutiveOptions();
    renderExecutive();
    renderLocationStats();
    syncProspectName();
    syncProfile();
    bindEvents();
    Navigation.show(State.get().currentScene, { focus: false });
    window.SmartEmploymentDiscovery?.sync(State.get().currentScene);
    window.SmartExperienceRecommendation?.sync(State.get().currentScene);
    if (State.get().currentScene === "presence") window.setTimeout(ensureMap, 100);
  }

  window.SmartExperienceRouting = Object.freeze({ resolveNextStep });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
