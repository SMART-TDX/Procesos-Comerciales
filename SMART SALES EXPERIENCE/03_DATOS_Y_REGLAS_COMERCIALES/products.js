(function () {
  "use strict";
  const products = {
    online: {
      id: "online",
      name: "Smart Online",
      phrase: "Una experiencia digital flexible para avanzar desde cualquier lugar.",
      highlights: ["Salas virtuales interactivas", "Grabación de clases", "App de autoestudio"],
      benefits: [
        "Salas virtuales interactivas",
        "Interacción con otros estudiantes",
        "Grabación de clases",
        "Evaluación de pronunciación",
        "Clases grupales de explicación",
        "App de autoestudio",
        "Acompañamiento constante por parte del docente"
      ],
      benefitSlides: [
        { id: "online-trust", chapter: "SMART ONLINE", accent: "RESPALDO", title: "10.000 ESTUDIANTES HAN CONFIADO EN NOSOTROS", phrase: "Una experiencia digital respaldada por una comunidad que continúa creciendo.", image: "assets/smart-online/page-01.jpg", imageFit: "contain", textSafeArea: "right" },
        { id: "online-english-levels", type: "modules", language: "INGLÉS", chapter: "TU CAMINO", title: "TU CAMINO EN SMART ONLINE", modules: ["START", "GO", "FLOW", "PLUS", "PRO"] },
        { id: "online-english-packs", title: "PACKS INGLÉS", image: "assets/smart-online/page-03.jpg", imageFit: "contain", imageOnly: true },
        { id: "online-french-levels", type: "modules", language: "FRANCÉS", chapter: "TU CAMINO", title: "TU CAMINO EN SMART ONLINE", modules: ["START", "GO", "FLOW", "PLUS"] },
        { id: "online-french-packs", title: "PACKS FRANCÉS", image: "assets/smart-online/page-05.jpg", imageFit: "contain", imageOnly: true },
        { id: "online-benefits", type: "online-benefits", title: "BENEFICIOS SMART ONLINE" },
        { id: "decision-criteria", type: "decision-criteria", title: "CRITERIOS DE DECISIÓN" },
        { id: "online-accreditation", accent: "PREPARACIÓN", chapter: "TU RESPALDO", title: "PREPARACIÓN PARA\nEXAMEN INTERNACIONAL LINGUASKILL", phrase: "Conoce esta opción de certificación internacional y elige el número de habilidades que necesitas.", image: "assets/images/flex-benefits/preparacion-linguaskill.jpg", imageFit: "contain", imagePosition: "center" },
        { id: "online-linguaskill-pricing", type: "linguaskill-pricing", title: "EXAMEN LINGUASKILL", programLabel: "SMART ONLINE" },
        { id: "online-characteristics-intro", chapter: "EXPERIENCIA DEL PRODUCTO", accent: "CARACTERÍSTICAS", title: "CONOCE CÓMO VIVIRÁS SMART ONLINE", phrase: "Una introducción visual a las sesiones, herramientas y acompañamiento de la plataforma.", image: "assets/smart-online/page-09.jpg", imageFit: "contain", textSafeArea: "right" },
        { id: "online-platform", chapter: "PLATAFORMA", accent: "CARACTERÍSTICAS", title: "UNA EXPERIENCIA DIGITAL COMPLETA", phrase: "Sesiones virtuales, interacción con el docente y otros estudiantes, y acompañamiento constante.", image: "assets/smart-online/page-10.jpg", imageFit: "contain", textSafeArea: "left" },
        { id: "online-autostudy", chapter: "AUTOESTUDIO", accent: "CONTINUIDAD", title: "SESIÓN → ACTIVIDAD AUTÓNOMA → PROGRESO", phrase: "El avance depende del cumplimiento de las actividades autónomas programadas en la plataforma.", image: "assets/smart-online/page-11.jpg", imageFit: "contain", textSafeArea: "left" },
        { id: "online-requirements", chapter: "ANTES DE EMPEZAR", accent: "REQUISITOS", title: "TODO LISTO PARA APRENDER", phrase: "Test de clasificación, conexión estable, cámara y micrófono, y manejo básico de herramientas virtuales.", image: "assets/smart-online/page-12.jpg", imageFit: "contain", textSafeArea: "left" },
        { id: "budget-preferences", type: "budget-preferences", title: "FORMA DE INICIO" }
      ],
      packs: {
        english: [
          { name: "PACKAGE 1", levels: ["A1"], license: "6 meses / 24 semanas" },
          { name: "PACKAGE 2", levels: ["A1", "A2"], license: "6 meses / 24 semanas" },
          { name: "PACKAGE 3", levels: ["A1", "A2", "B1", "B2"], license: "9 meses / 36 semanas" },
          { name: "PACKAGE 4", levels: ["A1", "A2", "B1", "B2", "C1"], license: "12 meses / 48 semanas" }
        ],
        french: [
          { name: "MID PACK BASIC", levels: ["A1", "A2"], license: "6 meses / 24 semanas" },
          { name: "FULLPACK", levels: ["A1", "A2", "B1", "B2"], license: "12 meses / 48 semanas" }
        ]
      }
    },
    flex: {
      id: "flex",
      name: "Smart Flex",
      phrase: "Una experiencia guiada por niveles para avanzar de manera progresiva.",
      highlights: ["Clases en vivo con docentes calificados", "Contenido interactivo digital de Cambridge English", "Preparación para examen internacional Linguaskill"],
      benefits: [
        "Clases en vivo con docentes calificados",
        "Contenido interactivo digital de Cambridge English",
        "Clases en vivo de 120 minutos",
        "Preparación para examen internacional Linguaskill",
        "SmartZone: espacios socioculturales de práctica",
        "Constancia de asistencia",
        "Grupos de máximo 8 estudiantes",
        "Sesiones de autoestudio en plataforma"
      ],
      benefitSlides: [
        { id: "modules", type: "modules", chapter: "TU CAMINO", title: "TU CAMINO EN SMART FLEX" },
        { id: "methodology", type: "methodology", title: "METODOLOGÍA" },
        { id: "learning-cycle", type: "learning-cycle", title: "ASÍ AVANZAS EN SMART FLEX" },
        { id: "live-120", accent: "EN VIVO", title: "CLASES DE 120 MINUTOS", phrase: "Más tiempo para aprender, practicar y participar.", image: "assets/images/flex-benefits/clases-120-minutos.jpg", imageFit: "cover", imagePosition: "center" },
        { id: "decision-criteria", type: "decision-criteria", title: "CRITERIOS DE DECISIÓN" },
        { id: "small-groups", accent: "GRUPOS REDUCIDOS", title: "MÁXIMO 8 ESTUDIANTES", phrase: "Más participación, interacción y acompañamiento.", image: "assets/images/flex-benefits/grupos-maximo-8.png", imageFit: "contain", imagePosition: "center" },
        { id: "cambridge-content", accent: "CAMBRIDGE", chapter: "TU PRÁCTICA", title: "CONTENIDO INTERACTIVO DIGITAL\nDE CAMBRIDGE ENGLISH", phrase: "Recursos diseñados para acompañar tu aprendizaje dentro y fuera de clase.", image: "assets/images/flex-benefits/contenido-cambridge-english.webp", imageFit: "contain", imagePosition: "center" },
        { id: "self-study", accent: "A TU RITMO", title: "SESIONES DE AUTOESTUDIO\nEN LA PLATAFORMA", phrase: "Refuerza lo aprendido y continúa avanzando a tu ritmo.", image: "assets/images/flex-benefits/plataforma-autoestudio-oficial.png", imageFit: "contain", imagePosition: "center" },
        { id: "smartzone", accent: "SMARTZONE", title: "ESPACIOS DE PRÁCTICA", subtitle: "Y CONVERSACIÓN", phrase: "Practica el idioma en espacios creados para conversar y ganar confianza.", image: "assets/images/flex-benefits/SMART ZONE(1).png", imageFit: "contain", imagePosition: "center", textSafeArea: "left" },
        { id: "budget-preferences", type: "budget-preferences", title: "PREFERENCIAS DE INVERSIÓN" },
        { id: "schedules", type: "schedules", chapter: "TU RITMO", title: "HORARIOS" },
        { id: "attendance", accent: "TU PROCESO", title: "CONSTANCIA\nDE ASISTENCIA", phrase: "Un respaldo de tu proceso y participación.", image: "assets/images/flex-benefits/constancia-asistencia.webp", imageFit: "contain", imagePosition: "center", textSafeArea: "left" },
        { id: "linguaskill", accent: "PREPARACIÓN", chapter: "TU RESPALDO", title: "PREPARACIÓN PARA\nEXAMEN INTERNACIONAL LINGUASKILL", phrase: "Prepárate para demostrar tus habilidades con una evaluación internacional.", image: "assets/images/flex-benefits/preparacion-linguaskill.jpg", imageFit: "contain", imagePosition: "center" },
        { id: "linguaskill-pricing", type: "linguaskill-pricing", title: "EXAMEN LINGUASKILL" },
        { id: "linguaskill-final", accent: "TU META INTERNACIONAL", title: "", phrase: "", image: "assets/images/flex-benefits/EXAMEN LINGUASKILL APROBADO.png", imageFit: "contain", imagePosition: "center", textSafeArea: "top", microLabelOnly: true }
      ],
      modules: [
        { name: "START", reference: "A1", meaning: "Primeros pasos" },
        { name: "GO", reference: "A2", meaning: "Confianza" },
        { name: "FLOW", reference: "B1", meaning: "Fluidez" },
        { name: "PLUS", reference: "B2", meaning: "Crecimiento" },
        { name: "PRO", reference: "C1", meaning: "Dominio" }
      ],
      methodology: [
        { name: "ACERCAMIENTO", phrase: "Entramos en contexto y usamos el idioma de forma natural." },
        { name: "REFLEXIÓN Y CONCEPTUALIZACIÓN", phrase: "Descubrimos cómo funciona la lengua." },
        { name: "AFIANZAMIENTO", phrase: "Practicamos lo aprendido en contextos específicos." },
        { name: "APLICACIÓN", phrase: "Usamos el idioma en situaciones reales." }
      ],
      learningCycle: [{ name: "PROGRAMO", icon: "◷" }, { name: "CLASE EN VIVO", icon: "▶" }, { name: "AUTOESTUDIO", icon: "✎" }, { name: "SIGUIENTE CLASE HABILITADA", icon: "✓" }, { name: "CONTINÚO", icon: "→" }],
      schedules: {
        weekdays: ["06:00 – 08:00", "08:00 – 10:00", "10:00 – 12:00", "12:00 – 14:00", "13:00 – 15:00", "15:00 – 17:00", "17:00 – 19:00", "19:00 – 21:00"],
        saturday: ["07:00 – 09:00", "09:00 – 11:00", "11:00 – 13:00", "13:00 – 15:00", "15:00 – 17:00", "17:00 – 19:00"]
      }
    }
  };
  Object.values(products).forEach((product) => {
    Object.freeze(product.highlights);
    Object.freeze(product.benefits);
    if (product.benefitSlides) {
      product.benefitSlides.forEach(Object.freeze);
      Object.freeze(product.benefitSlides);
    }
    if (product.modules) {
      product.modules.forEach(Object.freeze);
      Object.freeze(product.modules);
    }
    if (product.methodology) {
      product.methodology.forEach(Object.freeze);
      Object.freeze(product.methodology);
    }
    if (product.learningCycle) Object.freeze(product.learningCycle);
    if (product.schedules) {
      Object.freeze(product.schedules.weekdays);
      Object.freeze(product.schedules.saturday);
      Object.freeze(product.schedules);
    }
    Object.freeze(product);
  });
  window.SMART_EXPERIENCE_PRODUCTS = Object.freeze(products);
})();
