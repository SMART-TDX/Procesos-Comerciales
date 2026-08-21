(function (global) {
  'use strict';

  const source = (id, title, location, kind, status) => Object.freeze({ id, title, location, kind, status: status || 'VIGENTE_PARA_FASE_1' });

  global.JORGE_PHASE1_KNOWLEDGE = Object.freeze({
    version: '1.0.0',
    sources: Object.freeze({
      MATRIX: source('MATRIX', 'Matriz de Comunicación TMK', 'assets/documents/tmk/matriz-de-comunicacion.xlsx', 'BASE_DIRECCION'),
      TMK_POLICY: source('TMK_POLICY', 'Políticas de operación Telemercadeo 2026', 'assets/documents/tmk/politicas-operacion-telemercadeo-2026.pdf', 'POLITICA_OPERATIVA'),
      PERFORMANCE_POLICY: source('PERFORMANCE_POLICY', 'Política de gestión y medición TMK', 'assets/documents/tmk/politica-gestion-medicion-desempeno-tmk.pdf', 'POLITICA_OPERATIVA'),
      INSTITUTE_PORTFOLIO: source('INSTITUTE_PORTFOLIO', 'Anexo Portafolio Comercial Instituto', 'COM_MER-ANX-006 · versión 16/03/2026', 'DOCUMENTO_OFICIAL'),
      FLEX_PORTFOLIO: source('FLEX_PORTFOLIO', 'Portafolio Smart Flex', 'Portafolio Smart Flex (1).pdf', 'DOCUMENTO_OFICIAL'),
      ONLINE_PORTFOLIO: source('ONLINE_PORTFOLIO', 'Portafolio Smart Online', 'Portafolio Smart Online (1).pdf', 'DOCUMENTO_OFICIAL'),
      SAC: source('SAC', 'Consultas SAC · Proceso de Atención', 'Consultas_SAC_Proceso_Atencion.docx', 'PROCESO_OFICIAL')
      ,LOCATIONS: source('LOCATIONS', 'Base oficial de sedes Smart', 'SEDES SMART.xlsx · hoja Sedes Smart', 'BASE_DIRECCION')
      ,EXAMS: source('EXAMS', 'Base oficial de exámenes internacionales', 'examenes internacionales.xlsx', 'BASE_DIRECCION')
      ,OBJECTIONS: source('OBJECTIONS', 'Manejo oficial de objeciones', 'manejo de objeciones.xlsx', 'BASE_DIRECCION')
    }),
    concepts: Object.freeze({
      budget: ['precio', 'valor', 'tarifa', 'costo', 'cuesta', 'inversion', 'presupuesto', 'dinero', 'plata', 'luca', 'caro', 'costoso', 'economico', 'alcanza', 'bolsillo', 'pagar', 'corto', 'quebrado', 'cotizando', 'comparar'],
      time: ['tiempo', 'ocupado', 'agenda', 'espacio', 'disponibilidad', 'trabajando', 'reunion', 'turno', 'tarde', 'noche', 'sabado', 'semana', 'horario', 'hora', 'salgo', 'despues'],
      location: ['vive', 'vivo', 'trabaja', 'trabajo', 'sede', 'ubicacion', 'direccion', 'lejos', 'lejisimos', 'cerca', 'desplazar', 'porra', 'como ir', 'barrio', 'localidad'],
      presential: ['presencial', 'sede', 'persona', 'instalaciones'],
      virtual: ['virtual', 'online', 'internet', 'casa', 'remoto', 'meet', 'videollamada'],
      think: ['pensar', 'revisar', 'despues', 'luego', 'analizar', 'consultar'],
      competitor: ['academia', 'institucion', 'competencia', 'otro', 'comparar'],
      differentiator: ['diferencia', 'diferente', 'ventaja', 'porque smart', 'por que smart'],
      dataOrigin: ['datos', 'numero', 'telefono', 'registro', 'deje', 'dejado', 'sacaron', 'origen'],
      fatigue: ['cansado', 'mamado', 'molesto', 'bravo', 'insistir', 'varias', 'muchas'],
      noContact: ['no llamen', 'no contacten', 'no escriban', 'borrenme', 'borrar', 'eliminar datos', 'dejen llamar'],
      exam: ['b2', 'certificar', 'certificado', 'examen', 'graduar', 'universidad', 'linguaskill', 'ielts', 'toefl', 'migracion'],
      language: ['ingles', 'frances', 'idioma'],
      information: ['informacion', 'whatsapp', 'averiguando', 'averiguar', 'mirando', 'cotizando', 'comparando', 'envieme', 'mandeme'],
      interest: ['interes', 'quiero estudiar', 'aprender', 'necesito'],
      callback: ['llameme despues', 'llameme mas tarde', 'mas tarde', 'otro dia', 'ahora no', 'ahorita no', 'no puede hablar', 'no puedo hablar', 'llameme luego']
    }),
    compliance: Object.freeze({
      noContact: {
        title: 'Solicitud expresa de no contacto',
        response: 'Entiendo y lamento la molestia. Voy a registrar tu solicitud para que se gestione por el procedimiento correspondiente.',
        alternatives: ['Comprendo. Registraré tu solicitud y finalizaré la gestión sin insistir.'],
        question: 'No realices preguntas comerciales adicionales.',
        next: 'Finaliza respetuosamente y aplica el procedimiento institucional de no contacto.',
        objective: 'RESPETAR LA SOLICITUD · NO AGENDAR',
        avoid: 'No argumentes, no insistas y no programes seguimiento.',
        sourceIds: ['TMK_POLICY']
      },
      dataOrigin: {
        title: 'Inquietud sobre origen o autorización de datos',
        response: 'Entiendo tu inquietud. No quiero darte una información incorrecta sobre el origen del registro; voy a validarlo por el procedimiento interno.',
        alternatives: ['Gracias por indicarlo. Registraré la inquietud para que se valide correctamente.'],
        question: '¿También está solicitando que no volvamos a contactarlo?',
        next: 'Aclara si existe solicitud de no contacto y registra la inquietud sin especular.',
        objective: 'VALIDAR Y APLICAR EL PROCESO CORRECTO',
        avoid: 'No afirmes de dónde provino el dato si no tienes soporte verificable.',
        sourceIds: ['TMK_POLICY']
      },
      fatigue: {
        title: 'Molestia por frecuencia de contacto',
        response: 'Entiendo la molestia y lamento que la frecuencia del contacto haya resultado incómoda. Permíteme confirmar qué deseas que hagamos.',
        alternatives: ['Gracias por decírmelo. No voy a discutir ni insistir; primero confirmemos si deseas finalizar o solicitar no contacto.'],
        question: '¿Deseas finalizar esta llamada o solicitar que no volvamos a contactarte?',
        next: 'Baja la tensión y confirma la solicitud. Si pide no contacto, activa inmediatamente esa ruta.',
        objective: 'ACLARAR Y RESPETAR LA DECISIÓN',
        avoid: 'No intentes recuperar la cita mientras exista molestia o una posible solicitud de no contacto.',
        sourceIds: ['MATRIX', 'TMK_POLICY']
      }
    }),
    domainStrategies: Object.freeze({
      alreadyStudying: {
        title: 'Ya estudia en otra institución',
        happening: 'Ya reconoció la necesidad y tomó acción. Falta saber si está satisfecho y si existe una necesidad no cubierta.',
        response: 'Perfecto, qué bueno que ya estés trabajando en tu objetivo. ¿Cómo te ha ido con la experiencia hasta ahora?',
        alternatives: ['Qué bueno que ya empezaste. ¿Hay algo que te gustaría que funcionara diferente?', 'No busco que cambies ahora; quisiera entender si tu programa actual está cumpliendo lo que esperabas.'],
        alternativeStyles: ['EMPÁTICA', 'DIRECTA'],
        question: '¿Hay algo que quisieras mejorar: horarios, metodología, acompañamiento, modalidad o avance?',
        next: 'Si identifica una necesidad no cubierta, conecta únicamente un diferenciador Smart respaldado y pide permiso para agendar.',
        objective: 'IDENTIFICAR SI EXISTE UNA OPORTUNIDAD REAL',
        avoid: 'No ataques a la otra institución ni fuerces una cita si está satisfecho.',
        sourceIds: ['OBJECTIONS', 'MATRIX'], factual: true
      },
      differentiators: {
        title: 'Solicita diferenciadores Smart',
        happening: 'Quiere una razón verificable para escuchar la propuesta, no una afirmación de superioridad.',
        response: 'Smart cuenta con alternativas presenciales y virtuales y con portafolios diferenciados según la modalidad y el objetivo del estudiante. La clave es identificar cuál se ajusta a lo que necesitas.',
        alternatives: ['Es válido comparar. En Smart podemos revisar rutas distintas según si priorizas asistencia a sede, flexibilidad o acompañamiento.', 'No te diría que una opción sirve para todos; un ejecutivo puede mostrarte la metodología y modalidad que corresponden a tu objetivo.'],
        alternativeStyles: ['CONSULTIVA', 'DIRECTA'],
        question: '¿Qué es lo más importante para ti: flexibilidad, acompañamiento, metodología o modalidad?',
        next: 'Conecta su prioridad con una característica documentada del portafolio correspondiente y propone asesoría.',
        objective: 'GENERAR INTERÉS CON HECHOS VERIFICABLES',
        avoid: 'No digas “somos mejores”, no ataques competidores ni inventes beneficios.',
        sourceIds: ['INSTITUTE_PORTFOLIO', 'ONLINE_PORTFOLIO', 'FLEX_PORTFOLIO'], factual: true
      },
      exams: {
        title: 'Certificación o examen internacional',
        happening: 'Puede necesitar examen, preparación o programa de idioma; aún no se debe asumir cuál.',
        response: 'Antes de recomendarle un examen, pregúntale qué certificación acepta la institución y qué nivel o puntaje le exige.',
        alternatives: ['Primero confirma el requisito y la fecha límite; después definimos si necesita preparación, examen o ambas cosas.', 'No asumamos que necesita un programa completo: validemos exactamente qué debe presentar.'],
        alternativeStyles: ['CONSULTIVA', 'DIRECTA'],
        question: '¿Qué institución lo solicita, qué examen acepta, qué nivel o puntaje exige y para cuándo?',
        next: 'Completa finalidad, institución, habilidades, fecha, ciudad y necesidad de preparación; luego enruta correctamente.',
        objective: 'ENRUTAR CORRECTAMENTE · NO FORZAR CITA',
        avoid: 'No asegures que un examen será aceptado sin confirmar el requisito.',
        sourceIds: ['EXAMS', 'MATRIX'], factual: true
      },
      location: {
        title: 'Ubicación y sede por definir',
        happening: 'La conveniencia depende de casa, trabajo o estudio, horario, idioma y servicio. No basta con conocer un barrio.',
        response: 'Para revisar una sede conveniente necesito saber desde qué barrio se desplaza y si le sirve más estudiar cerca de su casa o de su trabajo.',
        alternatives: ['Cuéntame también dónde trabaja o estudia; así revisamos opciones reales en la base de sedes.', 'No quiero recomendar una sede solo por cercanía aparente. Primero confirmemos cuál es su recorrido habitual.'],
        alternativeStyles: ['CONSULTIVA', 'DIRECTA'],
        question: '¿Le conviene más estudiar cerca de su casa o cerca de donde trabaja o estudia?',
        next: 'Consultar la base oficial de sedes con ciudad, sector, idioma y servicio; solo después proponer sede y cita presencial.',
        objective: 'DEFINIR UNA SEDE CON INFORMACIÓN SUFICIENTE',
        avoid: 'No inventes distancias, tiempos ni disponibilidad de una sede.',
        sourceIds: ['LOCATIONS'], factual: true
      },
      priceOnly: {
        title: 'Solicita precio y rechaza asesoría',
        happening: 'El precio es importante, pero todavía no existe información suficiente para dar un valor aplicable.',
        response: 'Claro, entiendo que el precio es importante. Smart maneja alternativas distintas y darte un valor aislado podría no corresponder a lo que necesitas.',
        alternatives: ['Te ayudo a ubicar la opción correcta con una pregunta breve y luego decides si quieres ampliar la información.', 'Puedo orientarte sin compromiso; primero necesito saber si buscas una alternativa presencial o virtual.'],
        alternativeStyles: ['EMPÁTICA', 'DIRECTA'],
        question: '¿Estás buscando estudiar presencial o prefieres una alternativa virtual?',
        next: 'Perfila modalidad, idioma y objetivo. Después explica por qué el valor exacto debe revisarlo el ejecutivo y pide permiso para la asesoría.',
        objective: 'GENERAR UNA RAZÓN PARA ACEPTAR LA ASESORÍA',
        avoid: 'No inventes precios ni presiones una cita sin permiso.',
        sourceIds: ['OBJECTIONS', 'MATRIX'], factual: true
      },
      virtual: {
        title: 'Prefiere estudiar virtual y no desplazarse',
        happening: 'La condición virtual es explícita. Debe perfilarse la dinámica que necesita antes de diferenciar Online y Flex.',
        response: 'Perfecto, respetemos que buscas una opción virtual. Para orientarte, necesito saber si priorizas mayor autonomía o una dinámica de clases en vivo más estructurada.',
        alternatives: ['Podemos revisar Smart Online y Smart Flex según tu forma de aprender, sin obligarte a desplazarte.', 'La pregunta no es si debes ir a una sede, sino qué experiencia virtual se ajusta mejor a tu disponibilidad.'],
        alternativeStyles: ['CONSULTIVA', 'DIRECTA'],
        question: '¿Prefieres avanzar con mayor autonomía o tener clases en vivo con una dinámica más estructurada?',
        next: 'Perfila objetivo, disponibilidad y forma de aprendizaje; luego propone una cita por Google Meet.',
        objective: 'AGENDAR GOOGLE MEET CON LA RUTA VIRTUAL PERFILADA',
        avoid: 'No recomiendes presencial ni mezcles características de Online y Flex.',
        sourceIds: ['ONLINE_PORTFOLIO', 'FLEX_PORTFOLIO'], factual: true
      },
      priorBadExperience: {
        title: 'Mala experiencia previa',
        happening: 'Existe interés histórico, pero también una barrera de confianza que debe comprenderse antes de argumentar.',
        response: 'Entiendo que después de una mala experiencia quieras ser cuidadoso. ¿Qué fue exactamente lo que no funcionó para ti?',
        alternatives: ['Gracias por contarlo. Antes de hablarte de Smart, quiero entender qué esperabas y no recibiste.', 'No voy a decirte que aquí será diferente sin conocer primero qué ocurrió.'],
        alternativeStyles: ['EMPÁTICA', 'DIRECTA'],
        question: '¿La dificultad fue con horarios, metodología, acompañamiento, avance o servicio?',
        next: 'Identifica la falla concreta y consulta un diferenciador documentado que responda a esa necesidad; después evalúa si existe oportunidad de cita.',
        objective: 'RECUPERAR CONFIANZA ANTES DE AGENDAR',
        avoid: 'No descalifiques a la institución anterior ni prometas resultados.',
        sourceIds: ['OBJECTIONS', 'MATRIX'], factual: true
      },
      competitorPrice: {
        title: 'Otra institución ofrece menor precio',
        happening: 'Está comparando inversión. Falta saber si las alternativas que compara responden a la misma necesidad.',
        response: 'Es válido comparar precios. Antes de decidir, revisemos si ambas alternativas ofrecen la modalidad y el acompañamiento que realmente necesitas.',
        alternatives: ['Entiendo que el valor pesa en la decisión. ¿Qué incluye la opción que estás comparando y qué esperas obtener?', 'No voy a descalificar la otra oferta; quiero ayudarte a comparar con criterios que sí importen para tu objetivo.'],
        alternativeStyles: ['CONSULTIVA', 'DIRECTA'],
        question: 'Además del precio, ¿qué es indispensable para ti: horario, modalidad, acompañamiento o metodología?',
        next: 'Identifica el criterio principal y usa solo diferencias documentadas; si existe valor percibido, propone asesoría.',
        objective: 'COMPARAR SIN COMPETIR SOLO POR PRECIO',
        avoid: 'No afirmes que Smart es más barato o mejor sin evidencia.',
        sourceIds: ['OBJECTIONS', 'MATRIX'], factual: true
      },
      timeAndBudget: {
        title: 'Interés con barreras de tiempo y presupuesto',
        happening: 'Sí quiere aprender, pero dos barreras impiden avanzar. Conviene ordenar primero disponibilidad y después inversión.',
        response: 'Entiendo: sí quieres aprender, pero hoy te preocupan el tiempo y el presupuesto. Empecemos por identificar qué espacio sería realmente posible para ti.',
        alternatives: ['No tienes que resolver todo ahora. Primero encontremos una disponibilidad real y luego revisamos la alternativa aplicable.', 'Si no existe un horario viable, hablar de precio todavía no ayuda. Definamos primero cuándo podrías estudiar.'],
        alternativeStyles: ['EMPÁTICA', 'DIRECTA'],
        question: '¿Qué día o franja podrías reservar de forma realista para estudiar?',
        next: 'Confirma disponibilidad y modalidad; conserva presupuesto como segunda barrera y llévala a asesoría solo si existe viabilidad.',
        objective: 'CONSTRUIR VIABILIDAD ANTES DE PROPONER CITA',
        avoid: 'No minimices ninguna barrera ni prometas precios.',
        sourceIds: ['OBJECTIONS', 'MATRIX'], factual: true
      }
    }),
    factualPolicies: Object.freeze({
      unsupported: {
        title: 'Dato institucional que requiere validación vigente',
        happening: 'El cliente solicita un dato exacto que Jorge no puede confirmar con soporte vigente.',
        response: 'Ese dato puede variar según el programa. El ejecutivo de cuenta debe revisar el caso y entregar la información exacta.',
        alternatives: ['No quiero darte un dato impreciso; podemos dejar una cita para que el ejecutivo lo valide.', 'Primero confirmemos el programa y la condición aplicable antes de responder.'],
        question: '¿Qué programa, modalidad y objetivo necesita revisar el cliente?',
        next: 'Confirma la información en una fuente vigente y programa la asesoría adecuada.',
        objective: 'DAR INFORMACIÓN EXACTA MEDIANTE UNA CITA',
        avoid: 'No inventes ni estimes precios, promociones, descuentos, garantías, duraciones, horarios, distancias o disponibilidad.',
        sourceIds: []
      },
      exam: {
        response: 'Para orientarlo sin recomendar un examen incorrecto, primero debemos confirmar qué exige la institución y cuándo necesita el resultado.',
        alternatives: ['La certificación, la preparación y el programa de idioma son rutas distintas; primero identifiquemos cuál necesita.'],
        question: '¿La institución indicó qué examen acepta, qué nivel o puntaje exige y cuál es la fecha límite?',
        next: 'Identifica institución, examen aceptado, nivel o puntaje, habilidades, fecha límite, ciudad y si requiere preparación o solo examen.',
        objective: 'PERFILAR Y ENRUTAR A UNA ASESORÍA CORRECTA',
        avoid: 'No asegures que un examen será aceptado sin conocer el requisito de la institución.',
        sourceIds: ['MATRIX']
      },
      modality: {
        response: 'Ambas rutas pueden ser válidas. Antes de recomendar una, identifica cómo aprende mejor, su disponibilidad y qué tan viable es desplazarse.',
        alternatives: ['No elijas la modalidad por el cliente; ayúdalo a comparar según su realidad.', 'Primero descubre si prioriza acompañamiento presencial o flexibilidad de conexión.'],
        question: '¿Qué es más importante para él: asistir a una sede o poder conectarse con mayor flexibilidad?',
        next: 'Perfila disponibilidad, movilidad, objetivo y preferencia antes de programar la asesoría.',
        objective: 'AGENDAR EN LA MODALIDAD DE CITA MÁS VIABLE',
        avoid: 'No mezcles características de Instituto, Smart Online y Smart Flex.',
        sourceIds: ['MATRIX', 'INSTITUTE_PORTFOLIO', 'FLEX_PORTFOLIO', 'ONLINE_PORTFOLIO']
      },
      differentiator: {
        response: 'Es válido querer comparar. Primero identifica qué valora el cliente y luego permite que un ejecutivo le muestre la alternativa Smart que corresponda a su necesidad.',
        alternatives: ['Más que dar una comparación general, descubre si prioriza metodología, modalidad, acompañamiento u horario.', 'No descalifiques a otras instituciones; enfoca la conversación en lo que el cliente necesita resolver.'],
        question: '¿Qué aspecto es más importante para él al elegir dónde estudiar?',
        next: 'Identifica su criterio de decisión y prepara una asesoría enfocada en esa necesidad.',
        objective: 'GENERAR INTERÉS Y AGENDAR',
        avoid: 'No afirmes superioridad, precio o beneficios que no estén soportados en una fuente vigente.',
        sourceIds: ['MATRIX']
      }
    })
  });
})(typeof window !== 'undefined' ? window : globalThis);
