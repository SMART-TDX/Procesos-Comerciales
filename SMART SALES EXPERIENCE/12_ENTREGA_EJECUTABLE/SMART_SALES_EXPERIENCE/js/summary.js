(function () {
  "use strict";
  const key = "smartSalesExperience:v1:session";
  let state = {};
  try { state = JSON.parse(sessionStorage.getItem(key) || "{}"); } catch (error) { state = {}; }

  const line = state.commercialQuote?.registro?.linea || (state.selectedProgram === "online" ? "SMART_ONLINE" : "SMART_FLEX");
  const program = line === "SMART_ONLINE" ? "Smart Online" : "Smart Flex";
  const client = state.prospect?.name || "Cliente Smart";
  const safeClient = client.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "Cliente";
  document.title = `Resumen_Experiencia_Smart_${safeClient}`;

  const text = (id, value) => { document.getElementById(id).textContent = value || "Información por completar"; };
  const cards = (id, items) => {
    const clean = (items || []).filter(Boolean);
    document.getElementById(id).innerHTML = clean.map((item) => `<article><span>✓</span><strong>${typeof item === "string" ? item : (item.label || item.id || "")}</strong></article>`).join("") || "<p>Información por completar.</p>";
  };

  text("summary-program-title", `Tu experiencia ${program}`);
  text("summary-favorites-title", `Lo que más te gustó de ${program}`);
  text("summary-client", client);
  text("summary-executive", state.selectedExecutive?.fullName);
  const contact = state.selectedExecutive?.whatsapp || state.selectedExecutive?.phone || "";
  const contactNode = document.getElementById("summary-contact");
  if (contact) { contactNode.textContent = `WhatsApp / celular: ${contact}`; contactNode.hidden = false; }
  const photo = document.getElementById("summary-executive-photo");
  if (state.selectedExecutive?.photo) { photo.src = state.selectedExecutive.photo; photo.alt = `Fotografía de ${state.selectedExecutive.fullName}`; } else photo.hidden = true;

  const employment = window.SMART_EXPERIENCE_EMPLOYMENT;
  const profileData = employment?.profileFlows?.[state.perfilPrincipal] || {};
  const labelsFor = (field, sourceName) => (state[field] || []).map((id) => profileData[sourceName]?.find((item) => item.id === id)?.title || id.replaceAll("_", " "));
  const currentSituation = labelsFor("respuestasRolActual", "options");
  const goals = labelsFor("objetivosProfesionales", "goalOptions");
  const realities = labelsFor("oportunidadesIngles", "realityOptions");
  const needs = [...(state.prospect?.needs || []), ...(state.prospect?.priorities || []), ...currentSituation, ...realities, state.prospect?.detectedBarrier].filter(Boolean);

  cards("summary-profile", [profileData.title || String(state.perfilPrincipal || "").replaceAll("_", " ")]);
  cards("summary-goals", goals);
  cards("summary-needs", needs);
  cards("summary-products", [`Recomendado: ${state.recommendedProgram === "online" ? "Smart Online" : state.recommendedProgram === "flex" ? "Smart Flex" : "Por definir"}`, `Seleccionado: ${program}`]);
  cards("summary-criteria", state.decisionCriteria);
  cards("summary-preferences", [...(state.selectedScheduleSlots || []), ...(state.budgetPreferences || [])]);
  cards("summary-favorites", state.favoriteBenefits);

  const features = line === "SMART_ONLINE"
    ? ["Sesiones en vivo", "Tutorías personalizadas de 20 minutos", "Clases de 60 minutos", "Contenido interactivo 24/7", "Salas virtuales", "Grabación de clases", "App de autoestudio", "Posibilidad de certificación internacional"]
    : ["Metodología guiada", "Clases en vivo de 120 minutos", "Grupos de máximo 8", "Horarios flexibles", "Plataforma y autoestudio", "SmartZone", "Cambridge English", "Linguaskill Smart Flex"];
  document.getElementById("summary-features").innerHTML = features.map((item) => `<span>${item}</span>`).join("");
})();
