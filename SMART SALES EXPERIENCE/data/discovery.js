(function () {
  "use strict";
  window.SMART_EXPERIENCE_DISCOVERY = Object.freeze({
    status: "PENDIENTE_FASE_02",
    questions: Object.freeze([]),
    profiles: Object.freeze({
      employee: Object.freeze({ icon: "assets/icons/profile-work.svg", reaction: "Hablemos de lo que quieres conseguir profesionalmente." }),
      student: Object.freeze({ icon: "assets/icons/profile-study.svg", reaction: "Conozcamos lo que quieres lograr con tus estudios." }),
      entrepreneur: Object.freeze({ icon: "assets/icons/profile-business.svg", reaction: "Hablemos de hasta dónde quieres llevar tu negocio." }),
      job_seeker: Object.freeze({ icon: "assets/icons/profile-opportunity.svg", reaction: "Hablemos del próximo paso que quieres dar." }),
      life_change: Object.freeze({ icon: "assets/icons/profile-personal.svg", reaction: "Hablemos de ese proyecto que quieres hacer realidad." })
    })
  });
})();
