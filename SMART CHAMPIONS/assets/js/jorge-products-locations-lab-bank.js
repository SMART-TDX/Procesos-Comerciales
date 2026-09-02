(function (global) {
  'use strict';

  const SOURCE_SEDES = 'SEDES SMART ORGANIZADAS.xlsx';
  const rawRows = [[3,"BOGOTA","ZONAS ADMINISTRATIVAS BOGOTA","Administrativo","4120","TRAMITES AUXILIAR ADMINISTRATIVO","Calle 69 # 9 - 32"],[4,"BOGOTA","ZONAS ADMINISTRATIVAS BOGOTA","Administrativo","1172","TESORERIA","Calle 69 # 9 - 32"],[5,"BOGOTA","ZONAS ADMINISTRATIVAS BOGOTA","Administrativo","1156","CARTERA","Calle 69 # 9 - 32"],[6,"BOGOTA","ZONAS ADMINISTRATIVAS BOGOTA","Administrativo","993","COBRANZAS","Calle 69 # 9 - 32"],[7,"BOGOTA","ZONAS ADMINISTRATIVAS BOGOTA","Administrativo","1182","TECNOLOGIA","Calle 69 # 9 - 32"],[8,"BOGOTA","ZONAS ADMINISTRATIVAS BOGOTA","Administrativo Calidad","1140","CALIDAD","Calle 69 # 9 - 32"],[9,"BOGOTA","ZONAS ADMINISTRATIVAS BOGOTA","Administrativo Compras","1175","COMPRAS","Calle 69 # 9 - 32"],[10,"BOGOTA","ZONAS ADMINISTRATIVAS BOGOTA","Administrativo Examenes","1190","EXAMENES INTERNACIONALES","Calle 69 # 9 - 32"],[11,"BOGOTA","ZONAS ADMINISTRATIVAS BOGOTA","Administrativo Recepcion 1","1148","CORPORATIVO Y PERSONALIZADO","Calle 69 # 9 - 32"],[12,"BOGOTA","ZONAS ADMINISTRATIVAS BOGOTA","Administrativo Recepcion 2","1102","RECEPCI�N","Calle 69 # 9 - 32"],[13,"BOGOTA","ZONAS ADMINISTRATIVAS BOGOTA","Administrativo Recepcion 3","1103","RECEPCI�N","Calle 69 # 9 - 32"],[14,"BOGOTA","ZONAS ADMINISTRATIVAS BOGOTA","Administrativo Regionales","4109","CORDINACION ADMIN REGIONAL","Calle 69 # 9 - 32"],[15,"BOGOTA","ZONAS ADMINISTRATIVAS BOGOTA","Administrativo SAC","994","SERVICIO AL CLIENTE","Calle 69 # 9 - 32"],[16,"BOGOTA","ZONAS ADMINISTRATIVAS BOGOTA","Administrativo TH","1135-1139","TALENTO HUMANO","Calle 69 # 9 - 32"],[18,"ANTIOQUIA","ZONA NORTE MEDELLIN","Olaya","4702 - 4703","C.C. De Moda Outlet. Calle 16# 55 -129 � piso 3","Dentro del centro comercial 3er piso"],[19,"ANTIOQUIA","ZONA NORTE MEDELLIN","Tierragro","5301-5302","Diagonal 50 A. #38 - 20 Centro Empresarial Tierragro Local 801 Bello","Piso 8 de la torre Tierragro"],[20,"ANTIOQUIA","ZONA NORTE MEDELLIN","Bello","4402 - 4403","C.C Estaci�n Niquia, Diagonal 55 # 37-41 sede A en el piso 4 local 424 y sede B piso 13 locales 1305, 1306 y 1307.C.C Estaci�n Niquia, Diagonal 55 # 37-41 sede A en el piso 4 local 424","Dentro del centro comercial, estamos en los pisos 3 y 4"],[22,"ANTIOQUIA","ZONA OCCIDENTE MEDELLIN","Calasanz","4102 - 4103","Cra 80 49a-98","Por toda la 80 frente a la unidad robotica dental"],[23,"ANTIOQUIA","ZONA OCCIDENTE MEDELLIN","Laureles","5202 - 5203","Transversal 39 B # 3 - 6 Medell�n - Antioquia","A dos cuadras de la universidad pontificia Bolivariana"],[25,"ANTIOQUIA","ZONA CENTRO MEDELIN","Centro Medell�n Sede B","4302 - 4303","C.C. El Punto de la Oriental Carrera. 46 No. 47 � 66 Local 4035","Dentro del crento comercial punto de la oriental 5to piso"],[26,"ANTIOQUIA","ZONA CENTRO MEDELIN","La Central","4902 - 4903","C.C. La Central, Calle 49 B # 21-38, Medell�n Local 420A","Ubicada dentro del Centro Comercial La Central, piso 4 por el lado de Tostao"],[28,"ANTIOQUIA","ZONA SUR MEDELLIN","Arkadia","4602 - 4603","Carrera 70 # 1 � 141 � 5to piso","Frente a PriceSmart, por toda la 70 o la 80 tiene acceso, cerca a Campos de paz, en todo el romboy"],[29,"ANTIOQUIA","ZONA SUR MEDELLIN","Mall Gran V�a","5502","Diagonal 75 B # 5 - 106 Local 106","Medell�n / C.C. Mall Gran V�a ( Cerca a la Av 80)"],[30,"ANTIOQUIA","ZONA SUR MEDELLIN","Santaf� Medell�n","4202 - 4203","C.C. Santaf� Carrera 43A, Cl. 7 Sur # 170 local 41 -78b piso 4","Dentro del centro comercial en el 4to piso al lado del Dollarcity"],[31,"ANTIOQUIA","ZONA SUR MEDELLIN","Envigado","4802 - 4803","Carrera 43 No. 31 Sur � 12","Sobre toda la AV. poblado, diagonal a la iglesia de san marcos, a una cuadra de la calle de la buena mesa."],[32,"ANTIOQUIA","ZONA SUR MEDELLIN","Mayorca","5002 - 5003","Calle 52 Sur # 44 - 45","Al lado del C.C Mayorca. Ubicada al lado del Action Black de Sabaneta, en el piso 4 del Colsubsidio o justo arriba de la EPS SURA, al lado izquierdo queda Matelsa"],[33,"ANTIOQUIA","ZONA SUR MEDELLIN","Itag��","4502 - 4503","CC. Plaza Arrayanes, Carrera 50A # 36-90, Local 401","Dentro del centro comercial, estamos en los pisos 3 y 4"],[34,"ANTIOQUIA","ZONA SUR MEDELLIN","Itag�� sede B","4502 - 4503","C.C. Plaza Arrayanes, Carrera 50A # 36-90, Locales 314 a 321","Al frente de la estaci�n Niquia del metro, en todo el edificio de centro comercial estaci�n Niquia, piso 4 y 13"],[35,"ANTIOQUIA","ZONA SUR MEDELLIN","Castropol","5102-5103","Castropol Carrera 43 A #14-80","Sobre toda la AV. Poblado, queda a dos cuadras del parque del poblado, en todo el frente de la temporal NOVATEMPO"],[37,"ANTIOQUIA","ZONA ORIENTE MEDELLIN","Rionegro","5402 / 5409","Calle 41 # 50 BB - 65 Mall Plaza de Riogrande, Local 118 - 119","CC Mall Plaza Riogrande - Rionegro"],[39,"SANTANDER","ZONA SANTANDER","Floridablanca","7101 - 7102","Centro Comercial La Florida � Cl. 31 #26A-19 Local 108 - 110|","Frente al edificio Bulevar Del Parque"],[40,"SANTANDER","ZONA SANTANDER","Floridablanca","6102-6103","Calle 41 # 5 - 40 Barrio Restrepo","En el semaforo, frente a las piscinas olimpicas"],[41,"SANTANDER","ZONA SANTANDER","Cabecera","7402","Carrera 33 # 36 - 40","Frente al �xito de Cabecera"],[42,"SANTANDER","ZONA SANTANDER","Piedecuesta","7001 - 7002","Delacuesta Centro Comercial � Carrera 15 No. 3AN 10 Local 215","SEGUNDO PISO JUNTO AL GIMNASIO FITNESS PEOPLE"],[44,"EJE CAFETERO","ZONA CAFETRERA","Manizales","6202-6203","C.C. Fundadores, Calle 33 B #20 - 03 Piso 3","Centro Comercial Fundadores, 3 piso al lado de Cine Colombia"],[45,"EJE CAFETERO","ZONA CAFETRERA","Pereira","6302","Av 30 de agosto #74 � 09","Al lado del centro comercial Unicentro"],[46,"EJE CAFETERO","ZONA CAFETRERA","Armenia","","",""],[48,"REGIONALES","CIUDADADES SOLAS","Ibague","","Calle 42 # 5 - 40 Barrio Restrepo",""],[49,"REGIONALES","CIUDADADES SOLAS","Sincelejo","6408","Calle 28# 25B - 365 Parque Comercial Guacar�, locales 03301 y 02236","El centro comercial est� cerca del monumento a Las Vacas y la glorieta de la Avenida Sincelejito - Se encuentra cerca de la Gobernaci�n de Sucre"],[50,"REGIONALES","CIUDADADES SOLAS","Villavicencio","","Centro Comercial Unicentro, Barrio Nuevo, Av 40, Puente El Maizaro #26C - 10 Villavicencio Local 301","Ubicada por la Avenida 40, a 2 cuadras de las oficinas administrativas de Cofrem"],[51,"REGIONALES","CIUDADADES SOLAS","Cali","8002 - 8003","C.C. Cosmocentro, Cl. 5 #50 - 103 piso 4, local 412-422","Sobre la calle 5 y la avenida Roosevelt  frente al terminal de ca�averalejo"],[52,"REGIONALES","CIUDADADES SOLAS","BARRANQUILLA","7502 - 7503","C.C. Carnaval, Soledad Calle 30 Autopista, Autopista Aeropuerto # 13 - 65 local 01115","Soledad, Atl�ntico, espec�ficamente en la Calle 30 # 13 - 65, sobre la autopista al aeropuerto, en el �rea metropolitana de Barranquilla."],[54,"BOGOTA","ZONA SUR BOGOTA","Restrepo","2301 - 2302","Avenida Caracas No. 17- 22 sur","Salida norte de la estaci�n de Transmilenio Fucha"],[55,"BOGOTA","ZONA SUR BOGOTA","Sede Madelena A","2101 - 2103","C.C. Gran Plaza El Ensue�o, Calle 59c Sur # 51 � 21 Local 139 � 140","En el CC Gran Plaza el Ensue�o/ Avenida Villavicencio primer piso"],[56,"BOGOTA","ZONA SUR BOGOTA","Kennedy","3402 - 3403","Transversal 78 H # 41 � 73 sur","Esta sede est� ubicada de norte a sur despu�s del hospital de kennedy, antes de llegar a Compensar sobre la av 1 de Mayo, al lado del D1."],[57,"BOGOTA","ZONA SUR BOGOTA","Sede Madelena B","2112 - 2113","C.C. Gran Plaza El Ensue�o, Calle 59c Sur # 51 � 21 Local 139 � 140","En el CC Gran Plaza el Ensue�o/ Avenida Villavicencio primer piso"],[58,"BOGOTA","ZONA SUR BOGOTA","Bosa","3802 - 3803","Calle 65 Sur # 78L - 43 /53/65","Al frente del centro comercial Gran Plaza, por el parqueadero."],[59,"BOGOTA","ZONA SUR BOGOTA","Plaza de las Am�ricas","1403 - 1402","C.C. Plaza de las Am�ricas Carrera 71 D No. 6 � 94 Sur","Frente a la entrada principal de Mundo mundo aventura - 3 piso torre administrativa"],[60,"BOGOTA","ZONA SUR BOGOTA","Centro Mayor","1701 / 1702","Transversal 35 No. 38 B Sur � 69","Esta sede est� ubicada frente del centro comercial Centro Mayor por la Autopista Sur"],[61,"BOGOTA","ZONA SUR BOGOTA","Villa del R�o","3902 - 3903","C.C Paseo Villa del R�o Dg. 57c Sur #62-60, Locales 233 - 236","Estacion Transmilenio Paseo Villa del Rio/ al lado de Makro de la Autopista sur - 2 piso al frente de Ela"],[62,"BOGOTA","ZONA SUR BOGOTA","Tunal","1302 - 1303","C.C. Ciudad Tunal, calle 47 b sur # 24 b - 33 Local C C001","Al frende del �xito dentro del centro comercial"],[63,"BOGOTA","ZONA SUR BOGOTA","Soacha","2202 - 2203","C.C. Gran Plaza Soacha Carrera 7 No. 30 B � 139 Locales 132 a 135b","DENTRO DEL CENTRO COMECIAL"],[64,"BOGOTA","ZONA SUR BOGOTA","Soacha sede B","2211 - 2212","C.C. Gran Plaza Soacha Carrera 7 No. 30 B � 139 Local 1-121 B","Frente a estaci�n de Transmilenio San Mateo parte externa"],[66,"BOGOTA","ZONA OCCIDENTE BOGOTA","Unicentro de Occidente","2002 - 2003","C.C. Unicentro de Occidente � Cra. 111c #86-05 � local 1-51","Primer piso centro comercial al lado de Davivienda"],[67,"BOGOTA","ZONA OCCIDENTE BOGOTA","Unicentro de Occidente B","2012 - 2013- 2014","C.C. Unicentro de Occidente � Cra. 111c #86-05 � local 2-208","segundo piso frente al Famisanar de Colsubsidio"],[69,"BOGOTA","ZONA SUBA BOGOTA","Suba","1812 - 1813","C.C. Fiesta Suba, Calle 147 No. 101-56 Local 265,","C.C. Fiesta Suba, Calle 147 No. 101-56 Local 265,"],[70,"BOGOTA","ZONA SUBA BOGOTA","Suba Alpaso","3501 - 3502","Cll 145 Av. Cdad. de cali piso 2 y 5","Ubicada dentro del centro comercial Al paso (el cual esta en la esquina de la avenida suba con av ciudad de cali) frente al portal de suba. Piso 2 , pasando los torniquetes a mano derecha."],[71,"BOGOTA","ZONA SUBA BOGOTA","Suba sede B","1812 - 1813","C.C. Fiesta Suba, Calle 147 No. 101-56 Local 265,","CENTRO COMERCIAL FIESTA SUBA AL LADO DEL PORTAL DE TRANSMILENIO DE SUBA."],[72,"BOGOTA","ZONA SUBA BOGOTA","Hayuelos","3302 - 3303","C.C Hayuelos, Cl. 20 #82 - 52, Local 2-01 2-02","Centro comercial Hayuelos segundo piso al lado del D1"],[74,"BOGOTA","ZONA CENTRAL BOGOTA","Plaza central","2502 - 2503","Calle 13 con Cra 62, piso 3 � local 66","Dentro del centro comercial Plaza Central en el tercer piso al fondo queda la plazoleta de comidas\nEl Centro Comercial queda diagonal a RCN\""],[75,"BOGOTA","ZONA CENTRAL BOGOTA","Nuestro Bogot�","3002 - 3003","C.C. Nuestro Bogot�, Carrera 86 #52 A 75 - Engativ� L3 241","Dentro del C.C. Nuestro Bogot� piso 3 Frente a Cine Colombia"],[76,"BOGOTA","ZONA CENTRAL BOGOTA","Modelia","1512 - 1513","Carrera 74 A No. 23 F � 04 - Carrera 75 #23c 44 sobre la principal la nueva","frente al �xito de Modelia"],[77,"BOGOTA","ZONA CENTRAL BOGOTA","Multiplaza","2402 - 2403","AV Boyac� � Calle 13 � Local B -114","Avenida boyaca sentido norte sur antes de llegar a la 13"],[78,"BOGOTA","ZONA CENTRAL BOGOTA","Chapinero","2802 - 2803","Avenida calle 63 # 9 � 68","AL FRENTE DE LA UNIVERSIDAD KONRAD LORENZ, DETR�S DE LA IGLESIA DE LOURDES"],[79,"BOGOTA","ZONA CENTRAL BOGOTA","Chia","1902 - 1903","Centro hist�rico: C.C. La Libertad Calle 10 No. 11 � 36 Piso 2 Locales 2011 a 2020","Centro comercial la libertad donde esta ubicado claro segundo piso"],[80,"BOGOTA","ZONA CENTRAL BOGOTA","Mall Plaza - Calima","2602-2603","Avenida Carrera 30 #19, Local B04","Estacion de paloquemao sobre la 30 camina sentido norte y ubica el centro comercial 2 piso al frente de claro"],[81,"BOGOTA","ZONA CENTRAL BOGOTA","San Mart�n","3102 - 3103","C.C San Mart�n Carrera 7 # 32-84 piso 3","Dentro del centro comercial San Martin en el tercer piso al lado de Dolarcity"],[82,"BOGOTA","ZONA CENTRAL BOGOTA","Fontib�n","3702 - 3703","Carrera 100 #18 - 37","Ubicada sobre la Carrera 100 una cuadra antes del Parque Central de Fontibon, al aldo del local de Dollar City y Adidas"],[84,"BOGOTA","ZONA NORTE BOGOTA","Palatino","2902 - 2903","C.C Palatino Carrera 7 # 138-33 Piso 3","Al Lado de las Salas de Cine piso 3"],[85,"BOGOTA","ZONA NORTE BOGOTA","Multidrive","4002 - 4003","Calle 153 # 59 - 15 piso 3 Local 301","DETR�S DEL EDIFICIO DE ARTURO CALLE DE LA AVENIDA BOYAC� EN MAZUREN"],[86,"BOGOTA","ZONA NORTE BOGOTA","Santaf�","3202 - 3203","C.C. Santaf� Calle 185 # 45-03 Local 3-185","Zona MET tercer piso al lado del corral"],[88,"CUNDINAMARCA","ZONA CUNDINAMARCA BOGOTA","Mosquera","3602 - 3601","C.C. Novaterra, Carrera 3A #17 sur 96, Mosquera-La Mesa #Km 1, Mosquera. Locales 203, 204 y 205","segundo piso sobre tiendas Ol�mpica"],[89,"CUNDINAMARCA","ZONA CUNDINAMARCA BOGOTA","Cajica","","Carrera 6 #1-16 Cajica","Queda a la vuelta del paque principal"],[90,"CUNDINAMARCA","ZONA CUNDINAMARCA BOGOTA","Fontanar","2702 - 2703","C.C Fontanar V�a Ch�a Km 2.5 Cajic�, Local 3-05","Ubicado cerca a las universidades de la sabana y cundinamarca - tercer piso al frente de Adidas"]];

  const displayReplacements = [
    [/BOGOTA/g, 'BOGOTÁ'], [/MEDELIN/g, 'MEDELLÍN'], [/MEDELLIN/g, 'MEDELLÍN'],
    [/CAFETRERA/g, 'CAFETERA'], [/CIUDADADES/g, 'CIUDADES'],
    [/Estaci�n/g, 'Estación'], [/RECEPCI�N/g, 'RECEPCIÓN'], [/Medell�n/g, 'Medellín'],
    [/Santaf�/g, 'Santafé'], [/Itag��/g, 'Itagüí'], [/Gran V�a/g, 'Gran Vía'],
    [/V�a/g, 'Vía'], [/Bogot�/g, 'Bogotá'], [/Engativ�/g, 'Engativá'],
    [/Boyac�/g, 'Boyacá'], [/Mart�n/g, 'Martín'], [/Fontib�n/g, 'Fontibón'],
    [/Cajic�/g, 'Cajicá'], [/Ol�mpica/g, 'Olímpica'], [/Guacar�/g, 'Guacarí'],
    [/Atl�ntico/g, 'Atlántico'], [/ca�averalejo/g, 'cañaveralejo'],
    [/Am�ricas/g, 'Américas'], [/Ensue�o/g, 'Ensueño'], [/R�o/g, 'Río'],
    [/hist�rico/g, 'histórico'], [/Ch�a/g, 'Chía'], [/pa�s/g, 'país'],
    [/�xito/g, 'Éxito'], [/DETR�S/g, 'DETRÁS'], [/detr�s/g, 'detrás'],
    [/�rea/g, 'área'], [/� piso/g, ' – piso'], [/ � /g, ' – '], [/�/g, '–']
  ];

  function cleanDisplay(value) {
    let text = String(value || '').replace(/\s+/g, ' ').trim();
    displayReplacements.forEach(([pattern, replacement]) => { text = text.replace(pattern, replacement); });
    return text;
  }

  const inconsistencies = [
    {row:20,site:'Bello',field:'Dirección / indicaciones',reason:'La dirección menciona pisos 4 y 13; las indicaciones mencionan pisos 3 y 4.'},
    {row:34,site:'Itagüí sede B',field:'Indicaciones',reason:'La indicación hace referencia a la estación Niquía, mientras la dirección corresponde a Plaza Arrayanes en Itagüí.'},
    {row:40,site:'Floridablanca',field:'Dirección',reason:'La dirección “Calle 41 # 5 - 40 Barrio Restrepo” coincide con el registro de Ibagué de la fila 48.'},
    {row:46,site:'Armenia',field:'Extensión / dirección / indicaciones',reason:'Los tres campos están vacíos en la fuente.'},
    {row:48,site:'Ibagué',field:'Extensión / indicaciones',reason:'Los campos están vacíos en la fuente.'},
    {row:50,site:'Villavicencio',field:'Extensión',reason:'El campo está vacío en la fuente.'},
    {row:74,site:'Plaza central',field:'Indicaciones',reason:'La celda contiene un salto de línea y una comilla final en la fuente.'}
  ];

  const locations = rawRows.map((row) => ({
    row: row[0],
    city: cleanDisplay(row[1]),
    zone: cleanDisplay(row[2]),
    name: cleanDisplay(row[3]),
    extension: cleanDisplay(row[4]) || 'NO REGISTRADA EN LA FUENTE',
    address: cleanDisplay(row[5]) || 'NO REGISTRADA EN LA FUENTE',
    directions: cleanDisplay(row[6]) || 'NO REGISTRADAS EN LA FUENTE',
    raw: {city:row[1],zone:row[2],name:row[3],extension:row[4],address:row[5],directions:row[6]},
    status: inconsistencies.some((item) => item.row === row[0]) ? 'REVISAR FUENTE' : 'VIGENTE EN FUENTE',
    source: {file:SOURCE_SEDES,sheet:'Hoja1',cell:`A${row[0]}:F${row[0]}`}
  }));

  const products = [
    {
      id:'INSTITUTO', name:'Presencial', icon:'🏫',
      tagline:'Aprende inglés acompañado por un docente, practicando y avanzando de manera estructurada.',
      modality:'PRESENCIAL', language:'INGLÉS Y FRANCÉS',
      levels:['A1 · 162 horas','A2 · 162 horas','B1 · 178 horas','B2 · 202 horas','C1 · 202 horas'],
      accessPlans:[],
      tiles:[
        {icon:'🎓',title:'¿CÓMO ESTUDIA?',lines:['Asiste a clase en una sede física.','Recibe explicación del docente en tiempo real.','Grupos reducidos.']},
        {icon:'👨‍🏫',title:'CLASES EN VIVO',lines:['Docente en tiempo real.','Sede física, interacción directa y práctica permanente.']},
        {icon:'🗣️',title:'APRENDES HABLANDO',lines:['Enfoque comunicativo.','Speaking, conversaciones y ejercicios prácticos.','Simulación de situaciones reales.']},
        {icon:'👥',title:'GRUPOS REDUCIDOS',lines:['Máximo 6 estudiantes.']},
        {icon:'📚',title:'ESTRUCTURA ACADÉMICA',lines:['Contenido organizado por niveles.','Avance progresivo: A1, A2, B1, B2 y C1.','Modelo estructurado y disciplinado.']},
        {icon:'👨‍🏫',title:'ACOMPAÑAMIENTO',lines:['Corrección inmediata del docente.','Resolución de dudas en el momento y seguimiento del progreso.']},
        {icon:'🎯',title:'PARTICIPACIÓN ACTIVA',lines:['Trabajo en grupo.','Dinámicas en clase, práctica constante e interacción con compañeros.']},
        {icon:'🕐',title:'HORARIOS FLEXIBLES',lines:['Franjas y alternativas flexibles de horario.','Lunes a viernes: franjas entre 6:00 a. m. y 9:00 p. m.','Sábados: franjas entre 7:00 a. m. y 4:30 p. m.']},
        {icon:'📚',title:'RECURSOS DE APRENDIZAJE',lines:['Material didáctico y recursos virtuales de Cambridge.','Refuerzos, tutorías y Smart Zone.']}
      ],
      benefits:['👥 Atención en grupos reducidos.','🙋 Puede resolver dudas directamente durante su proceso.','🗣️ Practica el idioma, no solamente estudia teoría.','💬 Participa y utiliza el idioma durante las clases.'],
      quickArguments:[
        'Una de las ventajas es que trabajas en grupos de máximo 6 estudiantes, así tienes mayor oportunidad de participar y practicar.',
        'Las clases son con docente en tiempo real, por lo que puedes resolver dudas y recibir acompañamiento durante tu proceso.',
        'El enfoque es comunicativo: practicas speaking, conversaciones y situaciones reales durante las clases.',
        'Puedes revisar diferentes franjas de horario para organizar el estudio de acuerdo con tu disponibilidad.'
      ],
      phonePitch:'Es una experiencia presencial, guiada por un docente y con práctica constante en grupos reducidos. Puedes revisar las franjas disponibles para encontrar una alternativa que se adapte a tu rutina.',
      profilingQuestion:'¿Te ayuda más aprender asistiendo a una sede y practicando directamente con docente y compañeros?',
      nextStep:'Confirma la sede y la franja que le convienen; luego programa la cita.',
      comparison:{presence:'En sede física',platform:'Complementaria',live:'Presenciales con docente',support:'Directo en clase',flexibility:'Franjas disponibles',interaction:'Grupos reducidos y trabajo activo',profile:'Prefiere sede, estructura y acompañamiento cara a cara'},
      source:{file:'WhatsApp Image 2026-08-18 at 3.15.10 PM (2).jpeg',sheet:'Imagen completa',assets:'“Cómo funciona Instituto”'}
    },
    {
      id:'SMART_ONLINE', name:'Smart Online', icon:'💻',
      tagline:'Autonomía 24/7 con refuerzos en vivo y tutorías personalizadas.',
      modality:'VIRTUAL AUTÓNOMA', language:'INGLÉS',
      levels:['START','GO','FLOW','PLUS','PRO'],
      progression:[{name:'START'},{name:'GO'},{name:'FLOW'},{name:'PLUS'},{name:'PRO'}],
      accessPlans:['6 meses','9 meses','12 meses'],
      tiles:[
        {icon:'💻',title:'AUTOESTUDIO',lines:['Base del aprendizaje con plataforma disponible 24/7.','Gramática, listening, reading y writing.','Actividades prácticas y evaluativas.']},
        {icon:'🎥',title:'CLASES EN VIVO',lines:['Refuerzo semanal con sesiones de 60 minutos.','Enfocadas en el tema de la semana.','Grupos de máximo 20 estudiantes.']},
        {icon:'👨‍🏫',title:'TUTORÍAS',lines:['Sesiones privadas de hasta 20 minutos semanales.','Resolución de dudas.','Seguimiento constante y retroalimentación directa del docente.']},
        {icon:'💬',title:'PRÁCTICA',lines:['Foros y actividades colaborativas.','Espacios complementarios de conversación.']},
        {icon:'📊',title:'SEGUIMIENTO',lines:['Reportes de avance y actividades evaluativas.','Monitoreo por parte del docente.']},
        {icon:'🕐',title:'FLEXIBILIDAD',lines:['Acceso virtual y autonomía.','El estudiante organiza su avance con disponibilidad 24/7.']},
        {icon:'📚',title:'MÓDULOS SMART ONLINE',lines:['START · GO · FLOW · PLUS · PRO.']},
        {icon:'📅',title:'PLANES DE ACCESO',lines:['6 meses · 9 meses · 12 meses.']}
      ],
      phonePitch:'Es una ruta virtual con autoestudio disponible 24/7, reforzada con clases en vivo y tutorías personalizadas. El estudiante avanza con autonomía y acompañamiento.',
      profilingQuestion:'¿Buscas estudiar principalmente a tu ritmo y conectarte a refuerzos y tutorías cuando lo necesites?',
      nextStep:'Confirma el plan de acceso y la disponibilidad; luego programa la asesoría.',
      comparison:{presence:'100 % virtual',platform:'Base del aprendizaje 24/7',live:'Refuerzos de 60 minutos',support:'Tutorías privadas de hasta 20 minutos',flexibility:'Alta autonomía',interaction:'Foros, actividades y grupos de hasta 20',profile:'Prefiere autoestudio y acceso flexible'},
      source:{file:'WhatsApp Image 2026-08-18 at 3.15.10 PM (1).jpeg',sheet:'Imagen completa',assets:'“Cómo funciona SO”'}
    },
    {
      id:'SMART_FLEX', name:'Smart Flex', icon:'🔄',
      tagline:'Clases virtuales en vivo con grupos pequeños y horarios disponibles.',
      modality:'VIRTUAL EN VIVO', language:'INGLÉS',
      levels:['START','GO','FLOW','PLUS','PRO'],
      progression:[{name:'START',subtitle:'Primeros pasos'},{name:'GO',subtitle:'Confianza'},{name:'FLOW',subtitle:'Fluidez'},{name:'PLUS',subtitle:'Crecimiento'},{name:'PRO',subtitle:'Dominio'}],
      accessPlans:[],
      tiles:[
        {icon:'🎥',title:'CLASES EN VIVO',lines:['Eje principal con docente en tiempo real.','Grupos pequeños de máximo 8 estudiantes.','Alta participación y práctica de speaking.']},
        {icon:'💻',title:'PLATAFORMA',lines:['Acceso ilimitado 24/7 como refuerzo continuo.','Gramática, listening y vocabulario.','Material de apoyo tipo Cambridge.']},
        {icon:'👨‍🏫',title:'ACOMPAÑAMIENTO',lines:['Seguimiento constante.','Espacios de refuerzo en Smart Zone.','Resolución de dudas en tiempo real.']},
        {icon:'⏰',title:'FLEXIBILIDAD',lines:['El estudiante elige sus horarios de clase.','Adapta el estudio a su rutina y avanza según disponibilidad.']},
        {icon:'🗣️',title:'ENFOQUE COMUNICATIVO',lines:['Clases centradas en conversación.','Simulación de situaciones reales.','Participación activa obligatoria.']},
        {icon:'⭐',title:'LO QUE LO DIFERENCIA',lines:['La clase en vivo es el eje principal.','Grupos de máximo 8 estudiantes.']},
        {icon:'🎯',title:'IDEAL PARA...',lines:['Quien quiere estudiar virtualmente con docente en vivo y grupo pequeño.']}
      ],
      phonePitch:'Es una experiencia virtual guiada: las clases en vivo con docente son el eje principal y se complementan con plataforma y seguimiento. Puedes elegir entre los horarios disponibles.',
      profilingQuestion:'¿Prefieres conectarte a clases en vivo con docente y un grupo pequeño, manteniendo flexibilidad de horario?',
      nextStep:'Confirma disponibilidad y preferencia de horario; luego programa la cita.',
      comparison:{presence:'100 % virtual',platform:'Refuerzo continuo',live:'Eje principal con docente',support:'Seguimiento y refuerzos',flexibility:'Elección entre horarios disponibles',interaction:'Grupos pequeños, máximo 8',profile:'Prefiere guía en vivo y participación constante'},
      source:{file:'WhatsApp Image 2026-08-18 at 3.15.10 PM.jpeg',sheet:'Imagen completa',assets:'“Cómo funciona Flex”'}
    }
  ];

  function normalize(value) { return global.JorgeKnowledgeBankCore.normalize(value); }
  function searchLocations(query) {
    const normalized = normalize(query);
    const requestedCity = ['bogota','antioquia','santander','eje cafetero','cundinamarca','regionales'].find((city) => normalized.includes(city));
    const requestedZone = ['sur','norte','occidente','central','centro','suba','oriente','administrativas'].find((zone) => normalized.includes(zone));
    if (requestedCity && requestedZone) {
      const constrained = locations.filter((item) => normalize(item.city).includes(requestedCity) && normalize(item.zone).includes(requestedZone));
      if (constrained.length) return constrained;
    }
    const significant = normalized.split(' ').filter((word) => word.length > 2 && !['vive','cerca','esta','trabaja','sede','sedes','tenemos','donde','ubicada','ubicado','direccion','zona','ciudad','region','reportada','opciones','conviene','revisar'].includes(word));
    return locations.map((item) => {
      const fields = [item.name,item.city,item.zone,item.address,item.directions].map(normalize);
      let score = 0;
      significant.forEach((word) => {
        if (fields[0].includes(word)) score += 8;
        else if (fields[2].includes(word)) score += 5;
        else if (fields[1].includes(word)) score += 4;
        else if (fields[3].includes(word) || fields[4].includes(word)) score += 2;
      });
      if (normalized.includes(normalize(item.name))) score += 12;
      return {item,score};
    }).filter((entry) => entry.score > 0).sort((a,b) => b.score-a.score || a.item.name.localeCompare(b.item.name,'es')).map((entry) => entry.item);
  }

  function hierarchy() {
    const cities = {};
    locations.forEach((location) => {
      const city = cities[location.city] || (cities[location.city] = {});
      (city[location.zone] || (city[location.zone] = [])).push(location);
    });
    return cities;
  }

  const previous = global.JORGE_MASTER_EXCEL_BANK;
  global.JORGE_MASTER_EXCEL_BANK = Object.freeze({
    sources:Array.from(new Set([].concat(previous.sources || [], SOURCE_SEDES))),
    objections:previous.objections,
    locations,
    products,
    exams:previous.exams,
    operationalInventory:previous.operationalInventory,
    searchLocations,
    hierarchy,
    inconsistencies,
    metrics:Object.assign({},previous.metrics,{locations:locations.length,classified:locations.length,pendingClassification:0,products:products.length,locationInconsistencies:inconsistencies.length})
  });
})(typeof window !== 'undefined' ? window : globalThis);
