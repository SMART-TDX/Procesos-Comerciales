(function () {
  "use strict";
  const rules = [
    { program:"online",values:["travel_barrier","migration_barrier","global_connections"],weight:2,reason:"Te permite avanzar desde distintos lugares y adaptarlo a tu realidad" },
    { program:"flex",values:["lost_jobs","blocked_promotion","work_communication","international_access","profile_potential"],weight:2,reason:"Te brinda acompañamiento y práctica para superar barreras profesionales" },
    { program:"flex",values:["academic_requirement","content_barrier","study_abroad_barrier","academic_performance","certification_barrier"],weight:2,reason:"Acompaña una preparación académica e internacional estructurada" },
    { program:"flex",values:["ascend","income","change_job","international","international_study","scholarship","academic_profile","future_career","work_abroad","better_opportunities"],weight:2,reason:"Te permite avanzar mediante un proceso guiado y progresivo" },
    { program:"online",values:["tools_content","international_content","academic_material"],weight:2,reason:"Aprovecha herramientas y contenidos digitales con autonomía" },
    { program:"online",values:["remote_work","outside_colombia","travel_confidence","independent_travel"],weight:2,reason:"Te permite avanzar desde distintos lugares y adaptarlo a tu realidad" },
    { program:"online",values:["international_communication","global_connections"],weight:1,reason:"Facilita una experiencia digital conectada con contextos internacionales" },
    { program:"flex",values:["role_level","academic_confidence","interview_confidence","secure_negotiation","english_confidence"],weight:2,reason:"Te brinda acompañamiento y práctica para ganar seguridad" },
    { program:"flex",values:["certification","certification_result","international_university","study_abroad","study_abroad_goal"],weight:3,reason:"Acompaña una preparación académica e internacional estructurada" },
    { program:"flex",values:["ascend","professional_growth","future_career","career_change","professional_profile","academic_profile"],weight:2,reason:"Te permite avanzar mediante un proceso guiado y progresivo" },
    { program:"flex",values:["communicate_confidently","academic_participation","english_interview","business_relations","negotiate"],weight:2,reason:"Potencia la interacción frecuente y la práctica comunicativa" },
    { program:"flex",values:["international","international_opportunities","global_application","global_pitch","international_study"],weight:1,reason:"Fortalece tu preparación para escenarios internacionales" }
  ];
  rules.forEach((rule) => { Object.freeze(rule.values); Object.freeze(rule); });
  window.SMART_EXPERIENCE_RECOMMENDATION_RULES = Object.freeze({ minimumScore: 2, RECOMMENDATION_THRESHOLD: 2, rules: Object.freeze(rules) });
})();
