(function (global) {
  'use strict';

  const matrix = (id, category, label, triggers, responses, questions, route, cells) => ({
    id, category, label, triggers, responses, questions, route, source: 'MATRIX', matrixSource: cells
  });
  const complementary = (id, category, label, triggers, responses, questions, route) => ({
    id, category, label, triggers, responses, questions, route, source: 'TMK_COMPLEMENTARY', matrixSource: null
  });

  global.JORGE_KNOWLEDGE = Object.freeze({
    version: '3.0.0',
    appointmentPriority: ['PRESENCIAL', 'GOOGLE_MEET', 'TELEFONICA'],
    records: [
      matrix('time', 'TIEMPO', 'No tiene tiempo', ['no tengo tiempo', 'no tiene tiempo', 'sin tiempo', 'poco tiempo', 'falta de tiempo', 'tienpo', 'ocupado', 'ocupada', 'muy ocupado', 'ando ocupado', 'agenda llena', 'agenda apretada', 'no tengo espacio', 'no tiene espacio', 'horario complicado', 'no puedo sacar tiempo', 'casi no tengo tiempo'], [
        { style: 'DIRECTA', text: 'Entiendo. Vale la pena sacar un espacio breve para conocer el proyecto y revisar qué alternativa puede ajustarse a tu disponibilidad.' },
        { style: 'EMPÁTICA', text: 'Te entiendo; cuando el tiempo es limitado, una asesoría corta puede ayudarte a aclarar opciones sin tomar una decisión ahora.' },
        { style: 'CONSULTIVA', text: 'Para orientarte mejor, primero revisemos qué momento te funciona. La asesoría puede ser presencial, por Meet o telefónica.' }
      ], ['¿Te queda mejor un espacio en la mañana o en la tarde?', '¿Qué disponibilidad tienes esta semana?'], 'PRESENCIAL', 'Objeciones!I6:J6; Chat!B98:B117'),
      matrix('budget', 'PRESUPUESTO', 'Precio, valor o presupuesto', ['precio', 'precios', 'presio', 'presios', 'valor', 'valores', 'costo', 'costos', 'cuanto cuesta', 'cuanto vale', 'que precio tiene', 'tarifa', 'tarifas', 'inversion', 'presupuesto', 'no hay presupuesto', 'sin presupuesto', 'no tengo presupuesto', 'no tiene presupuesto', 'no tengo dinero', 'no tiene dinero', 'sin dinero', 'no tengo plata', 'no tiene plata', 'sin plata', 'anda corto de dinero', 'ando corto de dinero', 'anda sin plata', 'mi cliente anda sin plata', 'no le alcanza', 'no me alcanza', 'se sale del presupuesto', 'muy caro', 'esta muy caro', 'se le hace caro', 'costoso', 'precio primero', 'saber el precio', 'solo quiere precios', 'pregunta cuanto vale', 'quiere saber el valor', 'pregunta por tarifas', 'quiere conocer la inversion', 'primero digame el precio'], [
        { style: 'DIRECTA', text: 'Te entiendo. Para no darte información incompleta, uno de nuestros ejecutivos puede revisar contigo las alternativas según lo que estás buscando.' },
        { style: 'EMPÁTICA', text: 'Es totalmente válido. La asesoría te permite conocer las opciones antes de tomar cualquier decisión.' },
        { style: 'CONSULTIVA', text: 'Antes de descartar la posibilidad por presupuesto, vale la pena conocer qué alternativa puede ajustarse mejor a tu necesidad.' }
      ], ['¿Te puedo ayudar a dejar una asesoría programada?', '¿Qué te queda mejor: acercarte a una sede o conectarte por Google Meet?'], 'PRESENCIAL', 'Objeciones!I16:J16; Llamadas!B89'),
      matrix('think', 'DECISIÓN', 'Quiere pensarlo o dejarlo para después', ['quiero pensarlo', 'quiero penzarlo', 'lo voy a pensar', 'lo va a pensar', 'lo quiere pensar', 'dejeme pensarlo', 'tengo que pensarlo', 'mas adelante', 'despues', 'luego miro', 'voy a revisarlo', 'debo revisarlo', 'necesito analizarlo'], [
        { style: 'DIRECTA', text: 'Claro. ¿Hay algo específico que quieras revisar antes: tiempo, modalidad, inversión o disponibilidad?' },
        { style: 'EMPÁTICA', text: 'Es válido querer pensarlo. La asesoría puede ayudarte a resolver esas preguntas sin compromiso.' },
        { style: 'CONSULTIVA', text: 'Para que puedas decidir con información completa, podemos programar un espacio breve con un ejecutivo.' }
      ], ['¿Qué aspecto necesitas revisar primero?', '¿Te queda mejor recibir la asesoría hoy o mañana?'], 'PRESENCIAL', 'Objeciones!B28:C28'),
      matrix('minor', 'EDAD', 'Menor de edad o decisión con acudiente', ['menor de edad', 'es menor', 'soy menor', 'tengo 17', 'tengo 16', 'tiene 17', 'tiene 16', 'hablar con mis padres', 'hablar con los papas', 'debo hablar con mis padres', 'debe hablar con los papas', 'consultar con mis padres', 'preguntarle a mis papas', 'permiso de mis padres', 'hablar con el acudiente'], [
        { style: 'DIRECTA', text: 'Como eres menor de edad, necesitamos tener un espacio con tu padre, madre o acudiente para explicarle todo en detalle.' },
        { style: 'EMPÁTICA', text: 'Perfecto, podemos organizar la asesoría con uno de tus padres para que juntos reciban la información.' }
      ], ['¿Cuál es el nombre de tu padre, madre o acudiente?', '¿En qué horario podrían recibir la asesoría juntos?'], 'PRESENCIAL', 'Objeciones!B6:C6'),
      matrix('virtual', 'MODALIDAD', 'Prefiere modalidad virtual', ['virtual', 'virtal', 'birtual', 'solo virtual', 'unicamente virtual', 'prefiere virtual', 'quiero virtual', 'quiere virtual', 'estudiar virtual', 'clases virtuales', 'por internet', 'estudiar por internet', 'quiere estudiar por internet', 'en linea', 'online', 'desde casa', 'remoto', 'no puedo presencial', 'no puede presencial', 'no quiere ir presencial', 'no quiero ir presencial', 'no me sirve presencial', 'no quiere ir a la sede', 'sin desplazarse'], [
        { style: 'DIRECTA', text: 'Contamos con opciones virtuales. Un ejecutivo puede ayudarte a identificar cuál corresponde mejor a tu necesidad.' },
        { style: 'CONSULTIVA', text: 'Podemos programar la asesoría por Google Meet para que conozcas las modalidades virtuales sin desplazarte.' }
      ], ['¿Cuentas con computador, cámara, micrófono y conexión a internet?', '¿Qué horario te funciona para una asesoría por Google Meet?'], 'GOOGLE_MEET', 'Chat!B50:B52; Llamadas!I36:P38'),
      matrix('presential', 'MODALIDAD', 'Prefiere presencial', ['presencial', 'presensial', 'precensial', 'prefiero presencial', 'prefiere presencial', 'quiero presencial', 'quiere presencial', 'conocer una sede', 'clases presenciales', 'ir a la sede', 'en persona', 'quiero ir personalmente'], [
        { style: 'DIRECTA', text: 'Excelente. El paso por seguir es programar una asesoría presencial para que conozcas la sede y vivas la experiencia Smart.' },
        { style: 'CONSULTIVA', text: 'Podemos ubicar la sede más conveniente y reservar un espacio exclusivo con un ejecutivo.' }
      ], ['¿En qué ciudad te encuentras?', '¿La programamos para hoy o mañana?'], 'PRESENCIAL', 'Chat!B22:B24; Chat!B75:B82; Llamadas!B59'),
      matrix('meet', 'AGENDAMIENTO', 'Solicita Google Meet', ['google meet', 'por meet', 'reunion por meet', 'videollamada', 'video llamada', 'cita virtual', 'asesoria virtual', 'reunion virtual'], [
        { style: 'DIRECTA', text: 'Podemos asesorarte por Google Meet con atención personalizada.' },
        { style: 'EMPÁTICA', text: 'Entendemos que tu tiempo es valioso; Meet te permite recibir la asesoría sin desplazarte.' }
      ], ['¿Cuál horario te funciona mejor: 11:00 a. m., 4:00 p. m. o 6:30 p. m.?'], 'GOOGLE_MEET', 'Chat!B98:B106; Llamadas!B64:B66'),
      matrix('phone', 'AGENDAMIENTO', 'Solicita asesoría telefónica', ['telefonica', 'telefónica', 'por telefono', 'por celular', 'llamada telefonica', 'solo llamada', 'llamame', 'mejor por llamada', 'hablar por telefono'], [
        { style: 'DIRECTA', text: 'Podemos realizar una llamada telefónica con la misma atención personalizada.' },
        { style: 'CONSULTIVA', text: 'Si presencial o Meet no son viables, reservemos una asesoría telefónica.' }
      ], ['¿Cuál horario te funciona mejor: 10:00 a. m., 3:30 p. m. o 6:00 p. m.?'], 'TELEFONICA', 'Chat!B115:B123; Llamadas!B71:B73'),
      matrix('location', 'UBICACIÓN', 'Ubicación, sede o distancia', ['donde queda', 'donde estan', 'ubicacion', 'ubicasion', 'direccion', 'sede', 'sedes', 'sede cercana', 'cual sede', 'queda lejos', 'vive lejos', 'vive muy lejos', 'vivo lejos', 'lejos de la sede', 'distancia', 'otra ciudad', 'fuera de bogota', 'no puedo desplazarme'], [
        { style: 'DIRECTA', text: 'Podemos revisar la sede más conveniente según tu ciudad.' },
        { style: 'CONSULTIVA', text: 'Si el desplazamiento no es viable, podemos programar la asesoría por Google Meet.' }
      ], ['¿En qué ciudad y sector te encuentras?', '¿Prefieres revisar una sede cercana o conectarte por Meet?'], 'GOOGLE_MEET', 'Sedes Smart!A18:D91; Llamadas!B41'),
      matrix('schedule', 'HORARIOS', 'Necesita otro horario', ['horario', 'horarios', 'orario', 'orarios', 'no sirven los horarios', 'no le sirven los horarios', 'los horarios no le cuadran', 'no me cuadran los horarios', 'otro horario', 'horario diferente', 'solo sabados', 'solo puede los sabados', 'unicamente sabados', 'fin de semana', 'solo en la noche', 'puede en la noche', 'despues del trabajo', 'disponibilidad limitada'], [
        { style: 'DIRECTA', text: 'Revisemos un espacio que sí se ajuste a tu disponibilidad.' },
        { style: 'CONSULTIVA', text: 'Podemos validar una excepción de horario con uno de nuestros ejecutivos.' }
      ], ['¿Qué día y hora te funcionan?', '¿Ese espacio lo prefieres presencial, por Meet o por teléfono?'], 'PRESENCIAL', 'Chat!B105:C106; Chat!B122:C123'),
      complementary('partner', 'DECISIÓN COMPARTIDA', 'Debe consultarlo con su pareja', ['hablar con mi pareja', 'hablar con la pareja', 'preguntarle al esposo', 'preguntarle a la esposa', 'consultarlo con mi pareja', 'consultar con la pareja', 'hablar con el esposo', 'hablar con la esposa', 'primero debe hablar con el esposo', 'primero debe hablar con la esposa', 'decision con mi pareja'], [
        { style: 'EMPÁTICA', text: 'Claro, es una decisión que pueden revisar juntos. Podemos programar la asesoría para que ambos reciban la misma información.' },
        { style: 'CONSULTIVA', text: 'Así evitan trasladar información incompleta. Invitemos a tu pareja al espacio con el ejecutivo.' }
      ], ['¿Qué horario les funciona a los dos?', '¿Prefieren asistir a una sede o conectarse por Meet?'], 'PRESENCIAL'),
      complementary('information', 'INFORMACIÓN', 'Solo quiere información', ['solo quiero informacion', 'solo quiere informacion', 'solo informacion', 'informasion', 'quiero saber', 'mandame informacion', 'mandeme informacion', 'enviame informacion', 'envieme informacion', 'envíeme todo por whatsapp', 'envieme todo por whatsapp', 'mandeme todo por whatsapp', 'quiere que le mande todo', 'mande todo y despues mira', 'informacion por whatsapp', 'pase la informacion', 'solo estoy averiguando', 'solo estaba mirando'], [
        { style: 'DIRECTA', text: 'Claro. Para entregarte información correcta según lo que necesitas, primero quisiera conocer un poco mejor tu interés.' },
        { style: 'CONSULTIVA', text: 'La asesoría es justamente el espacio para recibir información completa sin compromiso.' }
      ], ['¿El programa es para ti?', '¿Te interesa inglés o francés?', '¿Prefieres una modalidad presencial o virtual?'], 'PRESENCIAL'),
      complementary('not-interested', 'DESINTERÉS', 'No está interesado', ['no me interesa', 'no le interesa', 'no estoy interesado', 'no estoy interesada', 'no quiere', 'no quiero', 'sin interes', 'cero interes', 'definitivamente no', 'no gracias'], [
        { style: 'EMPÁTICA', text: 'Entiendo. Antes de cerrar, ¿me permites saber si no te interesa por tiempo, modalidad o porque ya estás estudiando?' },
        { style: 'DIRECTA', text: 'Gracias por decírmelo. Si tu decisión es definitiva, respetamos tu respuesta y cerramos la gestión.' }
      ], ['¿Hay una razón específica que debamos registrar?'], 'NONE'),
      complementary('do-not-contact', 'NO CONTACTAR', 'Solicita no ser contactado', ['no me llamen', 'no me llamen mas', 'no volver a llamar', 'no vuelva a llamar', 'no quiero que me llamen', 'no quiero que ustedes vuelvan a llamarme', 'no me contacten', 'no me escriban', 'eliminar mis datos', 'borren mis datos', 'no contactar', 'no contacto', 'solicita no contacto', 'procedimiento no contacto', 'dejen de llamar'], [
        { style: 'RESPETUOSA', text: 'Entendido. Ofrece una disculpa, confirma que registrarás la solicitud y finaliza la gestión sin insistir.' },
        { style: 'DIRECTA', text: 'Respeta su decisión: confirma que gestionarás la solicitud de no contacto y cierra la llamada de forma cordial.' }
      ], ['Registra la solicitud de no contacto según la política operativa.'], 'NONE'),
      complementary('already-studying', 'SITUACIÓN ACTUAL', 'Ya estudia en otro lugar o ya tiene curso', ['ya estoy estudiando', 'ya estudia', 'estudio en otro lugar', 'estudio en otra academia', 'ya estudio en otra academia', 'ya tengo curso', 'ya tiene curso', 'tengo otro curso', 'otra academia', 'ya estoy inscrito', 'ya estoy matriculado'], [
        { style: 'CONSULTIVA', text: 'Qué bueno que ya estés avanzando. ¿Hay algo que hoy no estés encontrando en tu programa actual?' },
        { style: 'EMPÁTICA', text: 'No buscamos que decidas ahora. Una asesoría puede ayudarte a comparar metodologías y resolver dudas.' }
      ], ['¿Qué idioma y modalidad estás estudiando?', '¿Qué te gustaría mejorar de tu experiencia actual?'], 'PRESENCIAL'),
      complementary('no-need', 'NECESIDAD', 'No considera necesario aprender inglés', ['no necesito ingles', 'no necesita ingles', 'no me hace falta ingles', 'no le hace falta ingles', 'para que ingles', 'no creo necesitarlo', 'no cree necesitarlo', 'no creo necesitar ingles', 'no cree que necesite ingles', 'no veo la necesidad', 'ingles no es necesario'], [
        { style: 'CONSULTIVA', text: 'Entiendo. ¿En qué situaciones profesionales, académicas o personales crees que un idioma podría abrirte oportunidades?' },
        { style: 'EMPÁTICA', text: 'Es válido. La asesoría puede ayudarte a evaluar si realmente existe una necesidad para ti, sin compromiso.' }
      ], ['¿Tu interés sería laboral, académico, de viaje o personal?'], 'PRESENCIAL'),
      complementary('trust', 'CONFIANZA', 'No conoce o no confía en Smart', ['no confio', 'no confia', 'no me da confianza', 'no conozco smart', 'no conoce smart', 'quienes son', 'es confiable', 'sera confiable', 'nunca he escuchado', 'no tengo referencias', 'es una estafa'], [
        { style: 'DIRECTA', text: 'Es normal querer validar la institución. En una sede puedes conocer nuestras instalaciones y recibir información directamente.' },
        { style: 'CONSULTIVA', text: 'Podemos programar una asesoría para que conozcas la metodología, resuelvas preguntas y tomes tu propia decisión.' }
      ], ['¿En qué ciudad te encuentras para revisar una sede?', '¿Prefieres conocerla presencialmente o iniciar por Meet?'], 'PRESENCIAL'),
      complementary('work', 'TRABAJO', 'El trabajo limita su disponibilidad', ['trabajo todo el dia', 'trabaja todo el dia', 'travajo todo el dia', 'por mi trabajo', 'por el trabajo', 'turnos de trabajo', 'trabaja por turnos', 'salgo tarde', 'sale tarde', 'trabajo mucho', 'jornada larga', 'estoy trabajando', 'no puedo por trabajo'], [
        { style: 'EMPÁTICA', text: 'Te entiendo. Precisamente podemos buscar una asesoría breve que se acomode a tu jornada.' },
        { style: 'CONSULTIVA', text: 'Revisemos primero tu disponibilidad; si desplazarte es difícil, podemos usar Google Meet.' }
      ], ['¿A qué hora terminas tu jornada?', '¿Qué día tienes mayor disponibilidad?'], 'GOOGLE_MEET'),
      complementary('study', 'ESTUDIO', 'Sus estudios limitan la disponibilidad', ['estudio todo el dia', 'estudia todo el dia', 'por la universidad', 'por el colegio', 'tengo clases', 'tiene clases', 'horario de estudio', 'horario de universidad', 'carga academica', 'no puedo por clases'], [
        { style: 'EMPÁTICA', text: 'Entiendo. Busquemos un espacio que no interfiera con tus clases.' },
        { style: 'CONSULTIVA', text: 'Una asesoría breve puede ayudarte a conocer las alternativas según tu disponibilidad académica.' }
      ], ['¿Qué días tienes menos carga académica?', '¿Te funciona mejor Meet o una visita a sede?'], 'GOOGLE_MEET'),
      complementary('callback', 'SEGUIMIENTO', 'Solicita que lo contacten después', ['llamame despues', 'llámame después', 'llame mas tarde', 'llámeme más tarde', 'hablamos despues', 'quiero hablar despues', 'otro dia', 'ahora no puedo hablar', 'estoy ocupado', 'estoy ocupada', 'despues me llama', 'vuelva a llamar', 'marque luego'], [
        { style: 'DIRECTA', text: 'Claro. Confirmemos un momento concreto para no interrumpirte nuevamente.' },
        { style: 'EMPÁTICA', text: 'Sin problema; respeto tu tiempo. Dejemos acordados el día y la hora.' }
      ], ['¿Qué día y hora te funcionan para retomar la conversación?'], 'TELEFONICA'),
      complementary('uncertain', 'DUDA', 'No está seguro', ['no se', 'no sabe', 'no estoy seguro', 'no esta seguro', 'no estoy segura', 'tengo dudas', 'tiene dudas', 'no estoy convencido', 'no estoy convencida', 'no lo tengo claro', 'tengo que revisar'], [
        { style: 'CONSULTIVA', text: 'Es normal tener dudas. ¿Qué necesitas aclarar primero: modalidad, horarios, proceso o inversión?' },
        { style: 'EMPÁTICA', text: 'No tienes que decidir ahora. La asesoría está para ayudarte a resolver esas preguntas.' }
      ], ['¿Cuál es tu principal duda?', '¿Quieres revisarla en sede o por Google Meet?'], 'PRESENCIAL'),
      complementary('language', 'PERFILAMIENTO', 'Idioma de interés', ['ingles o frances', 'inges o franses', 'inglés o francés', 'quiero ingles', 'quiere ingles', 'quiero frances', 'quiere frances', 'otro idioma', 'que idiomas', 'cual idioma', 'curso de ingles', 'curso de frances'], [
        { style: 'DIRECTA', text: 'Perfecto. Para orientarte bien, confirmemos el idioma y para quién sería el programa.' },
        { style: 'CONSULTIVA', text: 'Claro. Cuéntame qué idioma te interesa y qué objetivo te gustaría alcanzar para preparar mejor la asesoría.' }
      ], ['¿Te interesa inglés o francés?', '¿El programa es para ti y qué edad tiene el estudiante?'], 'PRESENCIAL'),
      complementary('data-origin', 'ORIGEN DEL DATO', 'Pregunta por el origen de sus datos', ['nunca deje mis datos', 'nunca dejó sus datos', 'yo no envie mis datos', 'de donde sacaron mi numero', 'de dónde sacamos su telefono', 'quien les dio mi telefono', 'no recuerdo dejar mis datos', 'no entiende por que lo llamamos', 'llenó algo pero no recuerda dónde', 'lleno algo pero no recuerda donde', 'origen del dato', 'de donde tienen mis datos'], [
        { style: 'EMPÁTICA', text: 'Entiendo, gracias por indicármelo. No quiero darte información incorrecta sobre el origen del registro; permíteme validarlo internamente.' },
        { style: 'DIRECTA', text: 'Comprendo la inquietud. Voy a revisar internamente el origen del dato antes de darte una respuesta que no esté verificada.' }
      ], ['¿Deseas que validemos el origen del registro?', '¿Estás solicitando también que no volvamos a contactarte?'], 'NONE'),
      complementary('privacy-authorization', 'PRIVACIDAD', 'Cuestiona la autorización de contacto', ['yo no autorice esto', 'nunca autorice', 'no di autorizacion', 'no autorizó que lo contactaran', 'sin autorizacion', 'por que tienen mi numero', 'tratamiento de datos', 'uso de mis datos'], [
        { style: 'RESPETUOSA', text: 'Entiendo tu preocupación. No voy a afirmar algo que no pueda verificar; registraré la inquietud para aplicar el procedimiento interno correspondiente.' },
        { style: 'DIRECTA', text: 'Gracias por informarlo. Debemos validar internamente la autorización y evitar cualquier afirmación sin soporte.' }
      ], ['¿Deseas que registremos una solicitud formal sobre el uso de tus datos?', '¿También solicitas que no volvamos a contactarte?'], 'NONE'),
      complementary('contact-fatigue', 'MOLESTIA', 'Está molesto por la frecuencia de contacto', ['cansado de que lo llamen', 'cansada de que lo llamen', 'mamado de que lo llamemos', 'lo llamaron cinco veces', 'ya lo llamaron varias veces', 'ya me llamaron muchas veces', 'esta bravo', 'está bravo', 'esta molesto', 'está molesto', 'dejen de insistir', 'ya les dije que no'], [
        { style: 'EMPÁTICA', text: 'Entiendo la molestia y lamento que la frecuencia del contacto haya resultado incómoda. Permíteme confirmar qué deseas que hagamos.' },
        { style: 'RESPETUOSA', text: 'Gracias por decirlo. No voy a discutir ni insistir; primero confirmemos si deseas cerrar esta conversación o solicitar no contacto.' }
      ], ['¿Prefieres finalizar esta llamada o solicitar que no volvamos a contactarte?', '¿Deseas que registremos formalmente tu solicitud?'], 'NONE'),
      complementary('personal-situation', 'SITUACIÓN PERSONAL', 'Está atravesando una situación personal', ['problemas personales', 'problema familiar', 'otros problemas', 'muchas cosas en este momento', 'otras prioridades', 'momento dificil', 'situacion personal', 'no es buen momento', 'ahora tiene otras prioridades'], [
        { style: 'EMPÁTICA', text: 'Entiendo. Espero que puedas resolverlo pronto; para no incomodarte, podemos retomar la conversación en otro momento.' },
        { style: 'RESPETUOSA', text: 'Claro, no quiero presionarte. Si te parece, dejamos la conversación aquí y acordamos si deseas retomarla después.' }
      ], ['¿Prefieres que no retomemos el contacto o que acordemos otro momento?', '¿Qué día sería más conveniente para hablar nuevamente?'], 'NONE'),
      complementary('competitor', 'COMPETENCIA', 'Compara con otra institución', ['otra academia es mas barata', 'otra academia ofrece algo mejor', 'otra academia parece mejor', 'otra academia le parece mejor', 'comparar academias', 'la competencia', 'en otra institucion', 'que tienen que no tengan los demas'], [
        { style: 'CONSULTIVA', text: 'Es válido comparar. ¿Qué aspecto de la otra alternativa te resulta más importante: modalidad, horario, acompañamiento o inversión?' },
        { style: 'EMPÁTICA', text: 'Qué bueno que estés revisando opciones. Conozcamos primero qué necesidad quieres resolver, sin descalificar a ninguna institución.' }
      ], ['¿Qué valoras más de la alternativa que estás revisando?', '¿Hay algo que todavía no encuentres resuelto?'], 'PRESENCIAL'),
      complementary('smart-differentiators', 'DIFERENCIADORES', 'Pregunta qué diferencia a Smart', ['que diferencia a smart', 'qué tiene smart', 'que tiene smart que no tengan los demas', 'por que smart', 'por qué smart', 'diferenciadores smart', 'ventajas de smart', 'que ofrecen diferente'], [
        { style: 'CONSULTIVA', text: 'Smart cuenta con alternativas presenciales y virtuales. Lo importante es identificar cuál se ajusta mejor a tu objetivo y disponibilidad.' },
        { style: 'DIRECTA', text: 'Más que darte una comparación general, un ejecutivo puede mostrarte las modalidades disponibles y ayudarte a revisar cuál corresponde a lo que buscas.' }
      ], ['¿Buscas una experiencia presencial o virtual?', '¿Qué objetivo quieres alcanzar con el idioma?'], 'PRESENCIAL'),
      complementary('why-listen', 'APERTURA', 'Pregunta por qué debería escuchar la propuesta', ['por que deberia escucharme', 'por qué debería escuchar', 'por que escuchar la propuesta', 'no quiere hablar conmigo', 'para que me llama', 'que me va a ofrecer'], [
        { style: 'NATURAL', text: 'Te llamo para entender si aprender un idioma está dentro de tus planes y, solo si tiene sentido para ti, ayudarte a recibir una asesoría.' },
        { style: 'DIRECTA', text: 'Seré breve: quiero conocer tu objetivo y confirmar si vale la pena que un ejecutivo te oriente. Si no es relevante, respetamos tu decisión.' }
      ], ['¿Aprender un idioma está dentro de tus planes actuales?', '¿Te puedo hacer una pregunta breve para saber si esta información es relevante para ti?'], 'PRESENCIAL'),
      complementary('appointment', 'AGENDAMIENTO', 'Existe oportunidad de programar asesoría', ['programar asesoria', 'agendar cita', 'buscar oportunidad de cita', 'programar una cita', 'quiere una asesoria', 'acepta la cita'], [
        { style: 'DIRECTA', text: 'Perfecto. Confirmemos el día, la hora y la modalidad para dejar la asesoría correctamente programada.' },
        { style: 'NATURAL', text: 'Excelente, dejemos reservado un espacio con el ejecutivo. Primero revisemos si puedes asistir presencialmente.' }
      ], ['¿Qué día y hora te funcionan?', '¿La cita puede ser presencial o prefieres Google Meet?'], 'PRESENCIAL')
    ],
    profiles: Object.freeze({
      'already-studying': { why: 'Primero reconocemos su avance y después buscamos una necesidad no cubierta, sin atacar a la competencia.', actions: [['Explorar satisfacción', 'ya estudia y quiero explorar su satisfacción'], ['Identificar necesidad', 'ya estudia pero quiero identificar una necesidad no cubierta'], ['Comparar sin atacar', 'quiere comparar con otra academia'], ['Buscar oportunidad de cita', 'buscar oportunidad de cita']] },
      'data-origin': { why: 'Validamos antes de afirmar. Así protegemos al cliente y evitamos inventar el origen del registro.', actions: [['Origen del dato', 'quiere validar el origen del dato'], ['Cliente molesto', 'está molesto por las llamadas'], ['No autoriza contacto', 'dice que no autorizó el contacto'], ['Qué debo hacer', 'pregunta qué hacer con el origen de los datos']] },
      'privacy-authorization': { why: 'No asumimos que existe autorización: registramos la inquietud y aplicamos el procedimiento interno.', actions: [['Validar internamente', 'quiere validar el origen del dato'], ['Confirmar solicitud', 'quiere confirmar si solicita no contacto'], ['No contacto', 'no quiere que lo llamen más']] },
      'contact-fatigue': { why: 'Primero bajamos la tensión y confirmamos qué solicita el cliente; no intentamos recuperar la cita a la fuerza.', actions: [['Responder con empatía', 'está molesto por las llamadas'], ['Confirmar solicitud', 'quiere confirmar si solicita no contacto'], ['No contacto', 'no quiere que lo llamen más'], ['Procedimiento', 'pregunta qué hacer con una solicitud de no contacto']] },
      'do-not-contact': { why: 'Una solicitud expresa de no contacto se respeta sin insistencia, recuperación comercial ni agendamiento.', actions: [['Confirmar registro', 'pregunta qué hacer con una solicitud de no contacto'], ['Aplicar procedimiento', 'solicita no contacto y debe aplicarse el procedimiento interno']] },
      'competitor': { why: 'Comprendemos qué valora el cliente antes de comparar y nunca descalificamos a otra institución.', actions: [['Explorar satisfacción', 'ya estudia y quiero explorar su satisfacción'], ['Identificar necesidad', 'quiero identificar una necesidad no cubierta'], ['Diferenciadores', 'pregunta qué diferencia a Smart'], ['Programar asesoría', 'buscar oportunidad de cita']] },
      'smart-differentiators': { why: 'Usamos únicamente hechos disponibles y dejamos la explicación detallada al ejecutivo.', actions: [['Diferenciadores', 'pregunta qué diferencia a Smart'], ['Modalidades', 'quiere conocer modalidades presencial y virtual'], ['Objetivo académico', 'quiere definir su objetivo con el idioma'], ['Programar asesoría', 'buscar oportunidad de cita']] },
      'personal-situation': { why: 'Una situación personal requiere empatía y permiso para retomar; no presión comercial.', actions: [['Dar espacio', 'tiene una situación personal y no es buen momento'], ['Acordar seguimiento', 'quiere hablar después'], ['Cerrar contacto', 'no quiere que lo contacten']] },
      'uncertain': { why: 'Aclaramos la preocupación con preguntas abiertas, sin obligar al cliente a escoger una categoría.', actions: [['Profundizar la duda', 'no sabe qué hacer y necesita aclarar su preocupación'], ['Revisar modalidad', 'tiene dudas sobre la modalidad'], ['Revisar disponibilidad', 'tiene dudas por los horarios']] },
      'information': { why: 'Convertimos una solicitud general en una conversación breve para entregar información pertinente.', actions: [['Perfilar interés', 'quiere definir el idioma de interés'], ['Revisar modalidad', 'quiere conocer modalidad'], ['Programar asesoría', 'buscar oportunidad de cita']] },
      'default': { why: 'Primero comprendemos la situación y después definimos si corresponde orientar, hacer seguimiento o agendar.', actions: [['Profundizar', 'no sabe qué hacer y necesita aclarar su preocupación'], ['Consultar fuente oficial', 'necesita un dato factual que debe validarse en la fuente oficial'], ['Definir seguimiento', 'quiere hablar después']] }
    })
  });
})(window);
