(function () {
  "use strict";
  const freezeOptions = (items) => Object.freeze(items.map((item) => Object.freeze(item)));
  const makeOptions = (items) => freezeOptions(items.map(([id, title, file]) => ({ id, title, icon: `assets/icons/${file}` })));
  const flows = {
    trabajando: {
      question: "¿EN QUÉ SITUACIÓN SIENTES QUE EL INGLÉS TE ESTÁ LIMITANDO HOY?",
      goalQuestion: "¿QUÉ TE GUSTARÍA CONSEGUIR APRENDIENDO INGLÉS?",
      options: makeOptions([["lost_jobs","HE PERDIDO OPORTUNIDADES LABORALES","barrier-lost.svg"],["blocked_promotion","UN ASCENSO SE ME HA DIFICULTADO","goal-ascend.svg"],["work_communication","ME LIMITA AL COMUNICARME EN MI TRABAJO","barrier-communication.svg"],["international_access","ME CUESTA ACCEDER A OPORTUNIDADES INTERNACIONALES","goal-global.svg"],["profile_potential","SIENTO QUE MI PERFIL PROFESIONAL PODRÍA LLEGAR MÁS LEJOS","goal-profile.svg"]]),
      goalOptions: makeOptions([["ascend","ASCENDER PROFESIONALMENTE","goal-ascend.svg"],["income","MEJORAR MIS INGRESOS","goal-income.svg"],["change_job","CAMBIAR A UN MEJOR EMPLEO","goal-job.svg"],["international","TRABAJAR CON EMPRESAS INTERNACIONALES","goal-global.svg"]])
    },
    estudiando: {
      question: "¿EN QUÉ SITUACIÓN SIENTES QUE EL INGLÉS ESTÁ LIMITANDO TU FORMACIÓN?",
      goalQuestion: "¿QUÉ TE GUSTARÍA CONSEGUIR APRENDIENDO INGLÉS?",
      options: makeOptions([["academic_requirement","NECESITO CUMPLIR UN REQUISITO ACADÉMICO","profile-study.svg"],["content_barrier","ME CUESTA APROVECHAR CONTENIDOS EN INGLÉS","academic-digital.svg"],["study_abroad_barrier","NO ME SIENTO LISTO PARA ESTUDIAR EN EL EXTERIOR","goal-global.svg"],["academic_performance","QUIERO MEJORAR MI DESEMPEÑO ACADÉMICO","goal-profile.svg"],["certification_barrier","NECESITO PREPARARME PARA UNA CERTIFICACIÓN","barrier-unclear.svg"]]),
      goalOptions: makeOptions([["international_study","ESTUDIAR EN EL EXTERIOR","goal-global.svg"],["scholarship","ACCEDER A BECAS U OPORTUNIDADES ACADÉMICAS","goal-ascend.svg"],["academic_profile","FORTALECER MI PERFIL ACADÉMICO","profile-study.svg"],["future_career","PREPARARME PARA MI FUTURO PROFESIONAL","employment-opportunity.svg"]])
    },
    nuevas_oportunidades: {
      question: "¿QUÉ NUEVA OPORTUNIDAD SIENTES QUE EL INGLÉS TE ESTÁ IMPIDIENDO VIVIR?",
      goalQuestion: "¿QUÉ TE GUSTARÍA CONSEGUIR APRENDIENDO INGLÉS?",
      options: makeOptions([["migration_barrier","QUIERO AVANZAR EN UN PROCESO DE MIGRACIÓN","goal-global.svg"],["travel_barrier","ME LIMITA AL VIAJAR Y COMUNICARME","barrier-communication.svg"],["international_process","QUIERO ACCEDER A PROCESOS INTERNACIONALES","employment-opportunity.svg"],["new_life_stage","QUIERO ABRIRME A UNA NUEVA ETAPA DE VIDA","goal-profile.svg"],["global_connections","ME CUESTA CONECTAR CON PERSONAS DE OTRAS CULTURAS","barrier-confidence.svg"]]),
      goalOptions: makeOptions([["work_abroad","TRABAJAR O VIVIR EN OTRO PAÍS","goal-global.svg"],["travel_confidence","VIAJAR Y COMUNICARME CON CONFIANZA","barrier-confidence.svg"],["better_opportunities","ACCEDER A MEJORES OPORTUNIDADES","goal-job.svg"],["personal_project","HACER REALIDAD UN PROYECTO PERSONAL","goal-ascend.svg"]])
    }
  };
  Object.values(flows).forEach((flow) => { flow.realityOptions = Object.freeze([]); Object.freeze(flow); });
  window.SMART_EXPERIENCE_EMPLOYMENT = Object.freeze({ profileFlows: Object.freeze(flows) });
})();
