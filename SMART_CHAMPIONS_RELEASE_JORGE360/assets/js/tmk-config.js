(function (global) {
  'use strict';

  global.TMK_CONFIG = Object.freeze({
    mes: 'AGOSTO 2026',
    concepto: 'Cada llamada es una oportunidad. Cada cita acerca un sueño. Cada matrícula transforma una vida.',
    subtitulo: 'Cada gestión cuenta. Cada cita nos acerca a la meta.',
    meta: {
      principal: 1275,
      vigencia: '03 de agosto de 2026 al 01 de septiembre de 2026',
      diasHabiles: 20,
      proyeccionDatos: 20000,
      fuente: 'META AGOSTO 2026 TMK.xlsx · AGOSTO TMK!B24:C25'
    },
    skills: [
      { nombre: 'Canales en Vivo', participacion: '57 %', metaMatriculas: 726.75, personas: 8, metaIndividual: 90.84375, efectividad: '19 %', metaCitas: 3832, citasIndividuales: 479 },
      { nombre: 'Datos Nuevos Día', participacion: '19 %', metaMatriculas: 242.25, personas: 5, metaIndividual: 48.45, efectividad: '13 %', metaCitas: 1946, citasIndividuales: 324.3333333, nota: 'El archivo fuente calcula la meta individual de citas dividiendo entre 6, aunque registra 5 personas.' },
      { nombre: 'Datos Nuevos Noche', participacion: '19 %', metaMatriculas: 242.25, personas: 5, metaIndividual: 48.45, efectividad: '13 %', metaCitas: 1946, citasIndividuales: 324.3333333 },
      { nombre: 'Seguimientos', participacion: '6 %', metaMatriculas: 76.5, personas: 3, metaIndividual: 25.5, efectividad: '10 %', metaCitas: 780, citasIndividuales: 260 },
      { nombre: 'Correos Reingresos y Reingresos SF', participacion: '6 %', metaMatriculas: 76.5, personas: 2, metaIndividual: 38.25, efectividad: '10 %', metaCitas: 340, citasIndividuales: 340 }
    ],
    notasFuente: [
      'Las metas operacionales se redondean siempre hacia arriba para facilitar su seguimiento.',
      'Datos Nuevos Día conserva la meta individual de citas calculada en la fuente oficial dividiendo entre 6, aunque el archivo relaciona 5 integrantes.'
    ],
    personas: [
      { skill: 'Canales en Vivo', nombre: 'Yuri Guerrero González', meta: 90.84375 },
      { skill: 'Canales en Vivo', nombre: 'Maria Fernanda Herrera Valencia', meta: 90.84375 },
      { skill: 'Canales en Vivo', nombre: 'Catalina Hincapie Arango', meta: 90.84375 },
      { skill: 'Canales en Vivo', nombre: 'Ingrid Johanna Camacho Sanchez', meta: 90.84375 },
      { skill: 'Canales en Vivo', nombre: 'Chery Quintero Gutierrez', meta: 90.84375 },
      { skill: 'Canales en Vivo', nombre: 'Aira Ivann Quitian Sosa', meta: 90.84375 },
      { skill: 'Canales en Vivo', nombre: 'Mariana Cubillos Rivera', meta: 90.84375 },
      { skill: 'Canales en Vivo', nombre: 'Michell Molina', meta: 90.84375 },
      { skill: 'Datos Nuevos Día', nombre: 'Solanyi Reyes Amado', meta: 48.45 },
      { skill: 'Datos Nuevos Día', nombre: 'Nataly Camargo', meta: 48.45 },
      { skill: 'Datos Nuevos Día', nombre: 'Anyi Gaona Martinez', meta: 48.45 },
      { skill: 'Datos Nuevos Día', nombre: 'Ivone Gonzalez Gonzalez', meta: 48.45 },
      { skill: 'Datos Nuevos Día', nombre: 'Tatiana Jordan Garcia', meta: 48.45 },
      { skill: 'Datos Nuevos Noche', nombre: 'Carolayn Gomez Pacheco', meta: 48.45 },
      { skill: 'Datos Nuevos Noche', nombre: 'Sonia Bernal Arguello', meta: 48.45 },
      { skill: 'Datos Nuevos Noche', nombre: 'Ana Puentes Gomez', meta: 48.45 },
      { skill: 'Datos Nuevos Noche', nombre: 'Kelly Ramirez Martinez', meta: 48.45 },
      { skill: 'Datos Nuevos Noche', nombre: 'Janna Trilleras Mayorga', meta: 48.45 },
      { skill: 'Seguimientos', nombre: 'Mike Larrye Daza Forero', meta: 25.5 },
      { skill: 'Seguimientos', nombre: 'Lina Patricia Escobar', meta: 25.5 },
      { skill: 'Seguimientos', nombre: 'Johan Esteban Beltran', meta: 25.5 },
      { skill: 'Correos Reingresos y Reingresos SF', nombre: 'Maria Paula Morales Chavez', meta: 38.25 },
      { skill: 'Correos Reingresos y Reingresos SF', nombre: 'Jose Ricardo Pacanchique Bonilla', meta: 38.25 }
    ],
    bonos: [
      { nombre: 'Bono $300.000', factor: '101 %', valores: { 'Canales en Vivo': 91.7521875, 'Datos Nuevos Día': 48.9345, 'Datos Nuevos Noche': 48.9345, 'Seguimientos': 27, 'Correos Reingresos y Reingresos SF': 38.6325 } },
      { nombre: 'Bono $500.000', factor: '120 %', valores: { 'Canales en Vivo': 109.0125, 'Datos Nuevos Día': 58.14, 'Datos Nuevos Noche': 58.14, 'Seguimientos': 30.6, 'Correos Reingresos y Reingresos SF': 45.9 } },
      { nombre: 'Bono $700.000', factor: '130 %', valores: { 'Canales en Vivo': 118.096875, 'Datos Nuevos Día': 62.985, 'Datos Nuevos Noche': 62.985, 'Seguimientos': 33.15, 'Correos Reingresos y Reingresos SF': 49.725 } }
    ],
    aceleradores: [
      { periodo: 'Hasta el 13 de agosto', objetivo: '55 % de citas agendadas', condicion: 'Las dos primeras personas de cada Skill.', premio: 'Medio día el viernes' },
      { periodo: '14 al 20 de agosto', objetivo: '75 % de citas agendadas', condicion: 'Las dos primeras personas de cada Skill.', premio: 'Descanso el sábado' },
      { periodo: '21 al 27 de agosto', objetivo: '95 % de citas agendadas', condicion: 'Según el objetivo registrado por Skill.', premio: 'Medio día' }
    ],
    cultura: [
      { semana: 'Primera semana', periodo: '03 al 09 de agosto', objetivo: '45 %', imagen: 'assets/images/tmk/cultura-tmk-semana-1.png' },
      { semana: 'Segunda semana', periodo: '03 al 16 de agosto', objetivo: '80 %', imagen: 'assets/images/tmk/cultura-tmk-semana-2.png' }
    ],
    productividad: [
      { skill: 'Canales en Vivo', lunesViernes: 60, sabado: 30 },
      { skill: 'Datos Nuevos', lunesViernes: 165, sabado: 83 },
      { skill: 'Seguimientos', lunesViernes: 165, sabado: 83 },
      { skill: 'Reingresos', lunesViernes: 165, sabado: 83 }
    ],
    desempeno: {
      variables: [
        { nombre: 'Productividad', texto: 'Marcaciones realizadas durante la jornada.' },
        { nombre: 'Efectividad', texto: 'Citas efectivamente agendadas.' }
      ],
      escala: ['Por Impulsar', 'Buen Ritmo', 'Alto Desempeño', 'Máximo Impacto'],
      ciclo: [
        { periodo: 'Diario', texto: 'Actualización de resultados.' },
        { periodo: 'Semanal', texto: 'Consolidación del Score General.' },
        { periodo: 'Viernes', texto: 'Revisión oficial y acompañamiento.' },
        { periodo: 'Mensual', texto: 'Evolución, cumplimiento, reincidencias, reconocimientos y mejora.' }
      ]
    },
    acompanamiento: ['Indicadores', 'Auditorías de llamadas', 'Conversión', 'Discurso comercial', 'Manejo de objeciones', 'Uso del CRM', 'Administración del tiempo', 'Compromisos'],
    rutaCita: ['Cita presencial', 'Cita Google Meet', 'Cita telefónica'],
    whatsapp: [
      { titulo: 'Primer contacto', texto: 'Utiliza una plantilla cuando el cliente todavía no ha escrito.' },
      { titulo: 'Cliente no responde', texto: 'Solo envía otra plantilla después de 24 horas. No envíes mensajes adicionales antes de ese tiempo.' },
      { titulo: 'Cliente responde', texto: 'La conversación queda activa. Prioriza audios personalizados; no uses plantillas.' },
      { titulo: 'Seguimiento', texto: 'Si no hay actividad, espera 24 horas antes del mensaje de calidad.' }
    ],
    gestionDatos: [
      { titulo: 'No contesta', texto: 'Realiza dos intentos, registra ID de llamadas en Salesforce y envía WhatsApp según Chatwoot.' },
      { titulo: 'Cliente no interesado', texto: 'Registra evidencia con ID de llamada y clasifica como Cerrado Perdido / Sin interés.' },
      { titulo: 'Menor de edad', texto: 'Solicita datos del acudiente. Aplica la regla específica según el rango de edad y conserva evidencia.' },
      { titulo: 'Número fuera de servicio', texto: 'Envía WhatsApp o correo si están disponibles y realiza dos seguimientos antes del cierre correspondiente.' },
      { titulo: 'Error de aplicativo', texto: 'Reporta el error con evidencias al canal definido en la política para validación con TDX.' },
      { titulo: 'Seguimientos', texto: 'Registra toda la gestión en Salesforce y aplica la secuencia oficial de cinco seguimientos.' },
      { titulo: 'Cerrados perdidos', texto: 'Utiliza únicamente las categorías y tiempos definidos en la política oficial.' }
    ],
    matrizCategorias: [
      { nombre: 'Chat', detalle: 'Presentación, perfilamiento, modalidades, citas y confirmaciones.' },
      { nombre: 'Llamadas', detalle: 'Saludo, motivo, perfilamiento, beneficios, oferta y cierre.' },
      { nombre: 'Sedes Smart', detalle: 'Extensiones, direcciones e indicaciones de llegada.' },
      { nombre: 'Objeciones', detalle: 'Menor de edad, tiempo, empleo, costos y aplazamiento.' },
      { nombre: 'Exámenes y Preparación', detalle: 'Fechas, registro, inscripción y canales oficiales.' },
      { nombre: 'Smart Flex', detalle: 'Niveles, horarios, beneficios y estudiantes por clase.' },
      { nombre: 'Presencial Inglés', detalle: 'Niveles, horarios, beneficios y certificación.' },
      { nombre: 'Presencial Francés', detalle: 'Niveles, horarios, beneficios y certificación.' },
      { nombre: 'Smart Online', detalle: 'Módulos, horarios, beneficios y características.' },
      { nombre: 'Cita Virtual', detalle: 'Recordatorio y confirmación de asesoría virtual.' },
      { nombre: 'Información operativa / Varios', detalle: 'Códigos, costos, campañas y datos de operación.' }
    ],
    asistente: [
      { id: 'menor-edad', fase: 'Alineación', situacion: 'Menor de edad', respuesta: 'Mira como eres menor de edad, el paso a seguir es que tengamos un espacio con alguno de tus padres con el objetivo de que le pueda explicar todo en detalle, cual es el nombre de tu padre o madre y cual es su numero de contacto ?n', fuente: { hoja: 'Objeciones', celdas: 'B6:C6' } },
      { id: 'no-tiene-tiempo', fase: 'Gestión', situacion: 'NO TIENE TIEMPO', respuesta: 'Creo que si es importantes que puedas sacar algo de tiempo para este proyecto TAN IMPORTANTE en tu vida, has el esfuerzo porque yo se que va a valer la pena de acuerdo, te queda mejor el espacio en la mañana o en la tarde ?', fuente: { hoja: 'Objeciones', celdas: 'I6:J6' } },
      { id: 'sin-empleo', fase: 'Gestión', situacion: 'Sin Empleo', respuesta: 'Muchos de nuestros estudiantes empezaron sin empleo y usaron el inglés como impulso para mejorar su perfil y conseguir trabajo más rápido.”', refuerzos: ['Podemos revisar opciones que se ajusten a tu situación actual, para que puedas empezar sin que sea una carga.', 'Si tu objetivo es conseguir trabajo, el inglés puede marcar la diferencia frente a otros candidatos.', 'Precisamente con mas intencion debes ingresar a estudiar , este proyecto academico realmente impactara en tu estabilidad economica y laboral'], fuente: { hoja: 'Objeciones', celdas: 'B16:C16' } },
      { id: 'costos', fase: 'Gestión', situacion: 'COSTOS', respuesta: 'Bueno te cuento que nosotros manejamos mas de 18 portafolios diferentes, el costo depende de las necesidades y presupuesto de cada estudiante, lo que si te puedo decir es que nosotros somos la mejor opcion en terminos de calidad y precio.', refuerzos: ['Mira realmente los costos dependen de muchas variables pero no te preocupes, promedio las cuotas este mes estan entre 250 mil a 350 mil por mes, el paso a seguir es que agendemos.', 'Darte una tarifa de mi parte en este momento seria irresponsable porque cada estudiante tiene presupuestos y necesidades muy diferentes, pero no te preocuoes nosotros este mes te ayudaremos con la mejor tarifa econica, el paso a seguir es que nos agendemos.'], fuente: { hoja: 'Objeciones', celdas: 'I16:J16' } },
      { id: 'mas-adelante', fase: 'Gestión', situacion: 'PARA MAS ADELANTE', respuesta: 'Entiendo que mas adelante sin embargo siempre vas a tener los mismos compromisos de tiempo o economicos, creo que este es el mejor momento, date la oportunidadp para que te expliqen todo en detalle.', refuerzos: ['Mira , justo en esta semana la institucion ha sacado la promocion mas alta de todo el año, date la oportunidad y que te expliquen todo en detallle.', 'Mira mas adelante se te va a pasar el tiempo, de 1 mes a a 3 meses , despues 6 meses y despues pasa todo el año, te animo a que demos el paso y que por lo menos te des la oportunidad que te expliquen todo en detalle.'], fuente: { hoja: 'Objeciones', celdas: 'B28:C28' } },
      { id: 'programa-hibrido', fase: 'Alineación', situacion: 'UN PROGRAMA HIBIRDO', respuesta: 'Nosotros, como institución, tenemos dos opciones muy diferentes; combinarlas no es lo adecuado. Desde el punto de vista académico, no es recomendable. Lo mejor es que cada estudiante pueda enfocarse en una sola modalidad y especializarse en ella. De esta manera, verás que obtendrás los mejores resultados en tu proceso de aprendizaje.', fuente: { hoja: 'Objeciones', celdas: 'I28:J28' } },
      { id: 'smart-online', fase: 'Gestión', situacion: 'Smart Online', respuesta: 'Con esta plataforma podrás avanzar a tu ritmo 24/7\nPodrás tomar hasta dos clases en vivo por semana con el profesor\nEducación interactiva y dinámica', fuente: { hoja: 'Llamadas', celdas: 'I38' } },
      { id: 'smart-flex', fase: 'Gestión', situacion: 'Smart Flex', respuesta: 'Clases semipersonalizadas con profesor en vivo\nGrupos reducidos (máx. 8 estudiantes)\nContenido digital interactivo de nuestro aliado Cambridge English\nHorarios flexibles\nClases de 2 horas', fuente: { hoja: 'Llamadas', celdas: 'P38' } },
      { id: 'presencial-ingles', fase: 'Gestión', situacion: 'Presencial Inglés', respuesta: 'En Smart lograrás tu meta de aprender un nuevo idioma 🤩✈️ para Ingles contamos con:\n📖 Niveles desde A1 hasta C1 (Según el marco común de referencia europeo)\n🤓 Máximo 6 estudiantes por clase\n👨🏻‍🏫 Clases 100% Presenciales\n🕛 Horarios flexibles\n👨🏻‍🏫 Docentes altamente calificados.\n📖 Material exclusivo.\n\n¿Tienes alguna duda?', fuente: { hoja: 'Chat', celdas: 'B24' } },
      { id: 'cita-presencial', fase: 'Cierre', situacion: 'Cita Presencial', respuesta: 'El paso por seguir seria programar una Asesoría Presencial en una de nuestras Sedes, donde conoceras nuestras instalaciones y vivirás la experiencia Smart, ¿La programamos para hoy o mañana?', fuente: { hoja: 'Chat', celdas: 'B75:B77' } },
      { id: 'rechazo-cita-presencial', fase: 'Cierre', situacion: 'Dice que no a la cita presencial', respuesta: 'El día de hoy contamos con un código de descuento adicional sobre tu cotización, el cual podrás redimir durante tu asesoría en nuestra sede. ¿Tendrías disponibilidad para visitarnos hoy en la tarde?', fuente: { hoja: 'Chat', celdas: 'B90:C91' } },
      { id: 'cita-meet', fase: 'Cierre', situacion: 'Cita Meet', respuesta: 'Entendemos que tu tiempo es valioso. Podemos asesorarte de forma virtual por Meet, con la misma atención personalizada y en el horario de 11 am – 4 pm o 6:30 Pm. ¿Cuál te funciona mejor?', fuente: { hoja: 'Chat', celdas: 'B98:B100' } },
      { id: 'cita-llamada', fase: 'Cierre', situacion: 'Cita Llamada', respuesta: 'Entiendo que no puedas tomar la asesoría presencial ni virtual. Si te parece, podemos hacer una llamada telefónica con la misma atención personalizada. Tengo disponibilidad a las 10:00 a. m., 3:30 p. m. o 6:00 p. m. ¿Cuál te funciona mejor?', fuente: { hoja: 'Chat', celdas: 'B115:B117' } },
      { id: 'otro-horario', fase: 'Cierre', situacion: 'Dice Otro Horario', respuesta: 'Perfecto, haremos una excepción contigo y te libero un espacio a las ---------- con uno de nuestros ejecutivos, necesito que me compartas estos datos para programar tu asesoría\n📋 Nombre y apellido:\n📱 Número de celular:\n📧 Correo electrónico:\n🤓 Confírmame en qué empresa trabajas o dónde estudias para validar el convenio:', fuente: { hoja: 'Chat', celdas: 'B105:C106 / B122:C123' } },
      { id: 'deja-contestar', fase: 'Cierre', situacion: 'Deja de Contestar', respuesta: '¿Sigues en línea? 👀', refuerzos: ['✋¡Espera, no te vayas! ✋✨antes de cerrar, podemos llamarte para una asesoría personalizada, solo envíanos. 👀\n📋 Nombre completo:\n📱 Número de contacto:\n📧 Correo electrónico:\n🎂 Edad:\n🌍Ciudad:', '¡Convertirte en tu mejor versión! SMART podemos llamarte YA para una asesoría personalizada, por favor confírmanos:\n📋 Nombre completo:\n📱 Número de contacto:\n📧 Correo electrónico:\n🎂 Edad:\n🌍Ciudad:\n¡Este es el momento de brillar y cambiar tu futuro!'], fuente: { hoja: 'Chat', celdas: 'B164:B173' } },
      { id: 'confirmar-presencial', fase: 'Cierre', situacion: 'Confirmación de cita presencial', respuesta: '¡Tu cita está confirmada! 🙌\n📅 Día:\n⏰ Hora:\n📍 Sede:\n🧑‍💻Asesor:\n🌐Código de descuento:\n¡Ten en cuenta que este espacio es reservado solo para ti Te esperamos! ✨', fuente: { hoja: 'Chat', celdas: 'B134:C134' } },
      { id: 'confirmar-meet', fase: 'Cierre', situacion: 'Confirmación de cita Meet', respuesta: '¡Tu cita está confirmada! 🙌\n⚠️ Importante: Tu ejecutiv@ comercial te compartirá el link de conexión por WhatsApp/correo 5 minutos antes de nuestra hora acordada este espacio es exclusivo para ti. ⚠️\n📅 Fecha:\n⏰ Hora:\n🌐Código De Descuento:\n🏁Prepárate para dar un paso real hacia tus metas. Te esperamos para que vivas la experiencia Smart🏁', fuente: { hoja: 'Chat', celdas: 'B144:C144' } }
    ],
    reglasAsistente: [
      { nivel: 'alta', patrones: ['no tengo tiempo', 'no dispongo de tiempo', 'estoy muy ocupado', 'estoy muy ocupada'], opciones: ['no-tiene-tiempo'] },
      { nivel: 'alta', patrones: ['no tengo dinero', 'no tengo plata', 'esta muy caro', 'esta muy costoso', 'se me sale del presupuesto', 'precio', 'precios', 'costo', 'costos'], opciones: ['costos'] },
      { nivel: 'alta', patrones: ['quiero pensarlo', 'lo voy a pensar', 'para mas adelante', 'mas adelante'], opciones: ['mas-adelante'] },
      { nivel: 'alta', patrones: ['soy menor de edad', 'es menor de edad'], opciones: ['menor-edad'] },
      { nivel: 'alta', patrones: ['estoy sin empleo', 'no tengo empleo', 'estoy desempleado', 'estoy desempleada'], opciones: ['sin-empleo'] },
      { nivel: 'alta', patrones: ['quiero un programa hibrido', 'modalidad hibrida'], opciones: ['programa-hibrido'] },
      { nivel: 'alta', patrones: ['smart online'], opciones: ['smart-online'] },
      { nivel: 'alta', patrones: ['smart flex'], opciones: ['smart-flex'] },
      { nivel: 'alta', patrones: ['quiero una cita presencial', 'agendar cita presencial'], opciones: ['cita-presencial'] },
      { nivel: 'alta', patrones: ['no quiero la cita presencial', 'no quiero agendar cita presencial'], opciones: ['rechazo-cita-presencial'] },
      { nivel: 'alta', patrones: ['cita por meet', 'asesoria por meet'], opciones: ['cita-meet'] },
      { nivel: 'alta', patrones: ['cita telefonica', 'asesoria telefonica'], opciones: ['cita-llamada'] },
      { nivel: 'alta', patrones: ['necesito otro horario', 'quiero otro horario', 'otro horario'], opciones: ['otro-horario'] },
      { nivel: 'alta', patrones: ['dejo de contestar', 'no responde el chat'], opciones: ['deja-contestar'] },
      { nivel: 'media', patrones: ['virtual', 'quiero estudiar virtual', 'modalidad virtual', 'clases virtuales'], opciones: ['smart-online', 'smart-flex'] },
      { nivel: 'media', patrones: ['presencial', 'prefiero presencial', 'quiero estudiar presencial'], opciones: ['presencial-ingles', 'cita-presencial'] },
      { nivel: 'media', patrones: ['horario', 'horarios', 'los horarios no me sirven'], opciones: ['no-tiene-tiempo', 'otro-horario', 'cita-meet'] }
    ],
    documentos: [
      { nombre: 'Meta Comercial · Agosto 2026', tipo: 'XLSX', url: 'assets/documents/tmk/meta-agosto-2026-tmk.xlsx' },
      { nombre: 'Presentación Meta Agosto 2026', tipo: 'CANVA', url: 'https://canva.link/hmqpwbczizd0ckm' },
      { nombre: 'Matriz de Comunicación', tipo: 'XLSX', url: 'assets/documents/tmk/matriz-de-comunicacion.xlsx' },
      { nombre: 'Políticas de Operación Telemercadeo 2026', tipo: 'PDF', url: 'assets/documents/tmk/politicas-operacion-telemercadeo-2026.pdf' },
      { nombre: 'Política de Gestión y Medición del Desempeño', tipo: 'PDF', url: 'assets/documents/tmk/politica-gestion-medicion-desempeno-tmk.pdf' }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
