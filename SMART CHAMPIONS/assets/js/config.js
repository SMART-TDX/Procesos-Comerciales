(function (global) {
  'use strict';

  global.SMART_CONFIG = Object.freeze({
    version: '1.0.0',
    mes: 'SEPTIEMBRE 2026',
    plan: 'Meta y Estrategia Comercial',
    subtitulo: 'SEPTIEMBRE SE SIENTE QUE LLEGÓ DICIEMBRE… ¡Y EN SMART VAMOS CON TODA! 🚀',
    vigencia: '02 DE SEPTIEMBRE DE 2026 AL 01 DE OCTUBRE DE 2026',
    diasHabiles: 25,
    frasesChampions: {
      portada: 'Un equipo. Un objetivo.',
      meta: 'Vamos por la meta.',
      bonos: 'Supera tu propio resultado.',
      aceleradores: 'Cada cierre cuenta.',
      cultura: 'Desafiamos el status quo.'
    },
    director: {
      nombre: 'Dirección Comercial',
      cargo: 'Academia de Idiomas Smart',
      foto: 'assets/images/smart-logo.jpg',
      mensajeCorto: 'Septiembre exige enfoque, dominio de nuestras campañas y una ejecución comercial impecable.',
      mensajeFinal: 'Septiembre se siente que llegó diciembre… ¡y en Smart vamos con toda! Tenemos metas, campañas y herramientas oficiales para convertir cada oportunidad en un gran cierre.'
    },
    objetivoMes: {
      nombre: 'Objetivo Septiembre',
      valor: 469200000
    },
    campanasDestacadasIds: ['smart-online', 'smart-flex'],
    metaGeneral: {
      titulo: 'Nuestro reto de septiembre',
      ticketMedioReferencia: 2000000,
      responsabilidadSO: '5 %',
      niveles: [
        { nombre: 'Meta general', valor: 469200000 }
      ],
      sumaMetasIndividuales: 517058400,
      diferenciaAdministrativa: 47858400,
      validacionAdministrativa: 'La suma de las metas individuales del archivo oficial es $517.058.400 y supera la meta general de $469.200.000. No sustituir la meta general por esta suma.'
    },
    metasIndividuales: [
      { categoria: 'AA', ejecutivo: 'DANIEL ESTEBAN GALINDO FANDIÑO', matriculasAproximadas: 8.602, metaRecaudo: 17204000 },
      { categoria: 'AA', ejecutivo: 'JULIANA CAROLINA RODRIGUEZ', matriculasAproximadas: 8.602, metaRecaudo: 17204000 },
      { categoria: 'AA', ejecutivo: 'GIAN FRANCO CHINOME CALVO', matriculasAproximadas: 8.602, metaRecaudo: 17204000 },
      { categoria: 'AAA', ejecutivo: 'BRAYAN DAVID MANRIQUE LOPEZ', matriculasAproximadas: 14.5452, metaRecaudo: 29090400 },
      { categoria: 'AAA', ejecutivo: 'VIVIANA CASTAÑEDA LOZADA', matriculasAproximadas: 14.5452, metaRecaudo: 29090400 },
      { categoria: 'AAA', ejecutivo: 'ERICK JOHAN ROCHA BENITEZ', matriculasAproximadas: 14.5452, metaRecaudo: 29090400 },
      { categoria: 'AAA', ejecutivo: 'NICOLLE YURANI MURCIA AVILA', matriculasAproximadas: 14.5452, metaRecaudo: 29090400 },
      { categoria: 'AAA', ejecutivo: 'CRISTIAN JAVIER GARCIA BARRETO', matriculasAproximadas: 14.5452, metaRecaudo: 29090400 },
      { categoria: 'AAA', ejecutivo: 'ALISON ALDANA GARCIA', matriculasAproximadas: 14.5452, metaRecaudo: 29090400 },
      { categoria: 'AAA', ejecutivo: 'JUAN SEBASTIAN ROMERO LONDOÑO', matriculasAproximadas: 14.5452, metaRecaudo: 29090400 },
      { categoria: 'AAA', ejecutivo: 'YUDY PEREZ TORRES', matriculasAproximadas: 14.5452, metaRecaudo: 29090400 },
      { categoria: 'AAA', ejecutivo: 'ANGIE STHEFANY BRICEÑO GONZALEZ', matriculasAproximadas: 14.5452, metaRecaudo: 29090400 },
      { categoria: 'AAA', ejecutivo: 'PAOLA ANDREA RESTREPO TORRES', matriculasAproximadas: 14.5452, metaRecaudo: 29090400 },
      { categoria: 'AAA', ejecutivo: 'GERMAN ANDRES SIERRA ORTIZ', matriculasAproximadas: 14.5452, metaRecaudo: 29090400 },
      { categoria: 'AAA', ejecutivo: 'BRIGETH SAMANTA VARON ORTIZ', matriculasAproximadas: 14.5452, metaRecaudo: 29090400 },
      { categoria: 'AAA', ejecutivo: 'CLAUDIA LILIANA GONZALEZ LOPEZ', matriculasAproximadas: 14.5452, metaRecaudo: 29090400 },
      { categoria: 'AAA', ejecutivo: 'IVETTE TATIANA NIETO ARENAS', matriculasAproximadas: 14.5452, metaRecaudo: 29090400 },
      { categoria: 'AAA', ejecutivo: 'JHON ALEXANDER AVILA QUIROGA', matriculasAproximadas: 14.5452, metaRecaudo: 29090400 },
      { categoria: 'AAA', ejecutivo: 'LAURA SOFIA DAZA ZEA', matriculasAproximadas: 14.5452, metaRecaudo: 29090400 }
    ],
    bonos: [
      { cumplimiento: '120 %', nuevos: '1,5 %', antiguos: '2,5 %' },
      { cumplimiento: '130 %', nuevos: '2 %', antiguos: '4 %' },
      { cumplimiento: '140 %', nuevos: '3 %', antiguos: '6 %' },
      { cumplimiento: '150 %', nuevos: '4 %', antiguos: '8 %' }
    ],
    bonoGrupal: [
      { meta: 'Aspiracional', valor: 300000, condicion: 'El equipo Smart Online realiza su meta retadora y el comercial alcanza una meta igual o superior al 130 %.' }
    ],
    aceleradores: [
      { nombre: 'Home Office', beneficio: 'Home Office', condicion: 'Meta al 75 % al corte del 11 de septiembre, 85 % al corte del 18 de septiembre o 100 % al corte del 25 de septiembre.' },
      { nombre: 'Salida anticipada', beneficio: 'Media jornada el viernes 2 o sábado 3 de octubre', condicion: 'Meta al 150 % al cierre de septiembre.' },
      { nombre: 'Turno corto por día', beneficio: '5 horas laborales', condicion: 'Sostener y cumplir la meta al día del 120 %.' },
      { nombre: 'Tiempo adicional de break', beneficio: '15 minutos adicionales', condicion: 'Sostener y cumplir la meta al día del 120 %.' },
      { nombre: 'Efectividad del 20 % +', beneficio: 'Ingreso una hora más tarde al turno laboral una vez por semana, con corte los sábados', condicion: 'Mantener una efectividad del 20 % o superior.' }
    ],
    culturaChampions: [
      { semana: 'SEMANA 1', periodo: '02 AL 10 DE SEPTIEMBRE', objetivo: '45 %', pieza: 'assets/cultura-champions/septiembre-2026/smart-online-semana-1-45.png', premios: [{ categoria: 'A', valor: 25000, marcas: ['Popsy', 'Tostao'] }, { categoria: 'AA', valor: 40000, marcas: ['Crepes & Waffles', 'Éxito', 'Dollarcity'] }, { categoria: 'AAA', valor: 60000, marcas: ['Crepes & Waffles', 'Éxito', 'El Corral', 'KOAJ'] }] },
      { semana: 'SEMANA 2', periodo: '02 AL 17 DE SEPTIEMBRE', objetivo: '80 %', pieza: 'assets/cultura-champions/septiembre-2026/smart-online-semana-2-80.png', premios: [{ categoria: 'A', valor: 25000, marcas: ['Popsy', 'Tostao'] }, { categoria: 'AA', valor: 40000, marcas: ['Crepes & Waffles', 'Éxito', 'Dollarcity'] }, { categoria: 'AAA', valor: 60000, marcas: ['Crepes & Waffles', 'Éxito', 'El Corral', 'KOAJ'] }] }
    ],
    comisiones: [
      { cumplimiento: '100 % en adelante', contado: '7 %', cofae: '10 %' },
      { cumplimiento: '90 % – 99,9 %', contado: '5 %', cofae: '8 %' },
      { cumplimiento: '80,01 % – 89,9 %', contado: '3 %', cofae: '6 %' },
      { cumplimiento: '0 % – 75 %', contado: '0 %', cofae: '0 %' }
    ],
    rangoComisionPendiente: 'PENDIENTE_VALIDACION_RANGO_COMISION · Rango entre 75,01 % y 80 % no definido en la fuente oficial.',
    condicionesCumplimiento: {
      resumen: ['Cumplir el piso mínimo comisional definido para el periodo.', 'Mantener gestión comercial demostrable.', 'Registrar y dar seguimiento oportuno en CRM.', 'Formalizar correctamente las matrículas.', 'Cumplir el plan de trabajo y los procesos de mejora que correspondan.'],
      textoCompleto: 'El Ejecutivo Comercial deberá cumplir el piso mínimo comisional o meta mínima de ventas fijada por la institución para cada periodo, la cual constituye una obligación esencial del cargo y hace parte del plan de trabajo comercial. El incumplimiento injustificado de dicha meta se considerará falta al deber funcional y habilitará a la empresa para iniciar proceso disciplinario por bajo desempeño, conforme al Reglamento Interno de Trabajo y la normatividad laboral vigente, garantizando el debido proceso y el derecho de defensa. Para la evaluación se tendrá en cuenta no solo el resultado final, sino también la gestión comercial efectivamente realizada, incluyendo prospección, seguimiento en CRM, activaciones, atención de clientes asignados, formalización de matrículas, participación en eventos y cumplimiento del plan de trabajo. De acuerdo con la gravedad o reincidencia, la empresa podrá aplicar llamados de atención, planes de mejoramiento, seguimiento especial, limitación de incentivos no causados y demás medidas disciplinarias internas.'
    },
    presentacionMeta: {
      nombre: 'Presentación Oficial Meta Septiembre',
      url: 'https://canva.link/fxtthmhad0idrsg',
      fuente: 'META SMART ON LINE SEPTIEMBRE 2026.xlsx · pestaña PRESENTACION'
    },
    cambios: [
      { tipo: 'NUEVO', titulo: 'Campañas septiembre', texto: 'Smart Online Público y Convenios, y Smart Flex por Público, Alianza Masiva y Convenio Empresarial.' },
      { tipo: 'ACTUALIZACIÓN', titulo: 'Smart Flex Score y MP', texto: 'Consultar siempre la tabla oficial correspondiente al perfil comercial antes de presentar valores o cuotas.' },
      { tipo: 'IMPORTANTE', titulo: 'Financiación COFAE', texto: 'El Guion de Asentamiento Clientes COFAE es gestión obligatoria para culminar la matrícula.' }
    ],
    campanas: [
      { id: 'online-publico', linea: 'SMART ONLINE', nombre: 'Precio Público', estado: 'VIGENTE', objetivo: 'Planes virtuales de inglés o francés con descuentos por duración y forma de pago.', beneficio: 'Linguaskill de cuatro habilidades para el mismo beneficiario, sujeto a requisitos oficiales.', condiciones: ['Vigencia: 02/09/2026 al 01/10/2026.', '6 meses: contado 55 %; crédito 50 % a 2 meses.', '9 meses: contado 63 %; crédito 55 % a 3 meses o 45 % a 5 meses.', '12 meses: contado 70 %; crédito 60 % a 3 meses o 50 % a 5 meses.', 'Cuenta, beneficiario e idioma son personales y no pueden cambiarse después de la activación.'], documento: 'assets/documents/septiembre-2026/smart-online-publico-septiembre-2026.pdf', color: 'red' },
      { id: 'online-convenios', linea: 'SMART ONLINE', nombre: 'Convenios', estado: 'VIGENTE', objetivo: 'Condiciones diferenciadas para beneficiarios de convenios empresariales.', beneficio: 'Linguaskill de cuatro habilidades para el mismo beneficiario, sujeto a requisitos oficiales.', condiciones: ['Vigencia: 02/09/2026 al 01/10/2026.', '6 meses: contado 60 %; crédito 55 % a 2 meses.', '9 meses: contado 68 %; crédito 60 % a 3 meses o 50 % a 5 meses.', '12 meses: contado 75 %; crédito 65 % a 3 meses o 55 % a 5 meses.', 'No mezclar esta tabla con Precio Público.'], documento: 'assets/documents/septiembre-2026/smart-online-convenios-septiembre-2026.pdf', color: 'teal' },
      { id: 'flex-publico-score', linea: 'SMART FLEX', nombre: 'Público · Score', estado: 'VIGENTE', objetivo: 'Tarifa regular según niveles y forma de pago de la tabla Score.', beneficio: 'Con 5 niveles: Curso Corto Smart, Linguaskill y preparación; alternativa 4x5 autorizada.', condiciones: ['Vigencia: septiembre de 2026.', 'Campaña Salesforce: 701WP00000omCi5YAE.', 'Los descuentos y cuotas se consultan en la tabla Score oficial.', '4x5 aplica al mismo titular de inglés Smart Flex y requiere COM_VET-FOR-056.', 'Curso Corto requiere COM_VET-FOR-060; Linguaskill exige las condiciones académicas oficiales.'], documento: 'assets/documents/septiembre-2026/smart-flex-publico-score-septiembre-2026.pdf', color: 'teal' },
      { id: 'flex-publico-mp', linea: 'SMART FLEX', nombre: 'Público · MP', estado: 'VIGENTE', objetivo: 'Ruta orientada al recaudo según la tabla MP aprobada.', beneficio: 'Beneficios académicos y descuentos progresivos según niveles y forma de pago.', condiciones: ['Vigencia: septiembre de 2026.', 'Campaña Salesforce: 701WP00001KmkT7YAJ.', 'No ofrecer un porcentaje sin consultar la tabla MP vigente.', '4x5 aplica a cuatro niveles A1–B2 y otorga C1 al mismo titular.', 'Curso Corto y Linguaskill están sujetos a formatos y requisitos oficiales.'], documento: 'assets/documents/septiembre-2026/smart-flex-publico-mp-septiembre-2026.pdf', color: 'yellow' },
      { id: 'flex-alianza-score', linea: 'SMART FLEX', nombre: 'Alianza Masiva · Score', estado: 'VIGENTE', objetivo: 'Oferta exclusiva para la condición comercial Alianza Masiva.', beneficio: '4x5, Curso Corto Smart, Linguaskill y preparación según condiciones oficiales.', condiciones: ['Vigencia: septiembre de 2026.', 'Campaña Salesforce: 701WP00000sg3wrYAA.', 'No mezclar descuentos con Público, Convenio Empresarial o MP.', 'Linguaskill aplica desde dos niveles cuando el plan alcanza mínimo B1.', 'La activación del quinto nivel exige el formato institucional COM_VET-FOR-056.'], documento: 'assets/documents/septiembre-2026/smart-flex-alianza-masiva-score-septiembre-2026.pdf', color: 'green' },
      { id: 'flex-alianza-mp', linea: 'SMART FLEX', nombre: 'Alianza Masiva · MP', estado: 'VIGENTE', objetivo: 'Ruta MP exclusiva para la condición Alianza Masiva.', beneficio: 'Descuentos y beneficios progresivos según el documento oficial.', condiciones: ['Vigencia: septiembre de 2026.', 'Campaña Salesforce: 701WP00001Ko3GSYAZ.', 'Consultar la tabla MP oficial antes de ofrecer valores, porcentajes o cuotas.', 'No mezclar con Alianza Masiva Score ni con otras condiciones comerciales.', 'Formatos 056 y 060 obligatorios cuando aplique cada beneficio.'], documento: 'assets/documents/septiembre-2026/smart-flex-alianza-masiva-mp-septiembre-2026.pdf', color: 'yellow' },
      { id: 'flex-convenio-score', linea: 'SMART FLEX', nombre: 'Convenio Empresarial · Score', estado: 'VIGENTE', objetivo: 'Oferta Score exclusiva para Convenio o Alianza Empresarial.', beneficio: '4x5, Curso Corto Smart, Linguaskill y preparación según condiciones oficiales.', condiciones: ['Vigencia: septiembre de 2026.', 'Campaña Salesforce: 701WP00000pbBiNYAU.', 'No mezclar tarifas con Público o Alianza Masiva.', 'Los descuentos se determinan por niveles y forma de pago en la tabla oficial.', 'El quinto nivel es personal, intransferible y requiere COM_VET-FOR-056.'], documento: 'assets/documents/septiembre-2026/smart-flex-convenio-empresarial-score-septiembre-2026.pdf', color: 'green' },
      { id: 'flex-alianza-empresarial-mp', linea: 'SMART FLEX', nombre: 'Alianza Empresarial · MP', estado: 'VIGENTE', objetivo: 'Ruta MP exclusiva para Alianza Empresarial.', beneficio: '4x5, Curso Corto Smart, Linguaskill y preparación según condiciones oficiales.', condiciones: ['Vigencia: septiembre de 2026.', 'Campaña Salesforce: 701WP00001KoUBnYAN.', 'Consultar la tabla MP oficial antes de ofrecer valores, porcentajes o cuotas.', 'El 4x5 aplica exclusivamente a A1, A2, B1 y B2, otorgando C1 al mismo titular.', 'Formatos institucionales y paz y salvo son requisitos para redimir beneficios.'], documento: 'assets/documents/septiembre-2026/smart-flex-alianza-empresarial-mp-septiembre-2026.pdf', color: 'yellow' }
    ],
    medicion: [
      { icono: '◆', nombre: 'Matrículas', texto: 'Volumen total de matrículas logradas durante septiembre.' },
      { icono: '↗', nombre: 'Recaudo', texto: 'Valor efectivamente recaudado como resultado de la gestión.' },
      { icono: '●', nombre: 'Contado', texto: 'Participación de operaciones pagadas de contado.' },
      { icono: '✓', nombre: 'Calidad', texto: 'Procesos completos, soportes correctos y beneficios bien gestionados.' },
      { icono: '◎', nombre: 'Efectividad', texto: 'Capacidad de convertir oportunidades calificadas en cierres.' },
      { icono: '→', nombre: 'Seguimiento', texto: 'Disciplina para acompañar oportunidades y beneficios hasta el final.' }
    ],
    norte: [
      { icono: '↗', nombre: 'Incrementar recaudo' },
      { icono: '◉', nombre: 'Aprovechar las campañas' },
      { icono: '◇', nombre: 'Utilizar correctamente Score y MP' },
      { icono: '⚡', nombre: 'Mejorar conversión' },
      { icono: '✓', nombre: 'Garantizar excelente proceso de matrícula' },
      { icono: '♥', nombre: 'Aplicar correctamente los beneficios' },
      { icono: '→', nombre: 'Fortalecer seguimiento comercial' }
    ],
    argumentos: [
      { campana: 'Smart Online Público', presentar: 'Una ruta virtual con descuentos definidos por duración y forma de pago.', decir: 'Podemos revisar 6, 9 o 12 meses y elegir la alternativa pública autorizada.', evitar: 'No mezclar los descuentos de Público con Convenios.', objecion: '¿Cuál es el mayor descuento?', respuesta: 'En Público llega hasta 70 % para 12 meses de contado; las demás opciones dependen de duración y financiación.', cierre: 'Confirmemos duración y forma de pago en el documento oficial.' },
      { campana: 'Smart Online Convenios', presentar: 'Condiciones diferenciadas para beneficiarios de convenios empresariales.', decir: 'La tarifa de Convenios tiene porcentajes propios y requiere validar la condición del beneficiario.', evitar: 'No usar esta tabla sin confirmar el convenio.', objecion: '¿Aplica igual que Público?', respuesta: 'No. Convenios tiene una tabla separada y descuentos específicos.', cierre: 'Validemos el convenio y consultemos la condición exacta.' },
      { campana: 'Smart Flex Score', presentar: 'La ruta regular según nivel, condición comercial y forma de pago.', decir: 'Score dispone de tablas separadas para Público, Alianza Masiva y Convenio Empresarial.', evitar: 'No cruzar porcentajes entre condiciones comerciales.', objecion: '¿Qué beneficio obtengo?', respuesta: 'Con 5 niveles incluye Curso Corto, Linguaskill y preparación; la campaña 4x5 aplica bajo sus condiciones oficiales.', cierre: 'Identifiquemos primero la condición comercial y consultemos Score.' },
      { campana: 'Smart Flex MP', presentar: 'Una ruta enfocada en recaudo con tablas específicas por condición comercial.', decir: 'MP debe consultarse para Público, Alianza Masiva o Alianza Empresarial antes de cotizar.', evitar: 'No prometer el descuento máximo ni inventar cuotas.', objecion: '¿Cuál es el descuento exacto?', respuesta: 'Depende de la tabla MP vigente, los niveles y la forma de pago.', cierre: 'Abramos la tabla MP oficial correspondiente al perfil del cliente.' }
    ],
    errores: [
      { titulo: 'Campaña sin registrar', texto: 'Selecciona siempre la campaña correcta en Salesforce.' },
      { titulo: 'Formato incompleto', texto: 'No cargues soportes con información pendiente.' },
      { titulo: 'Beneficio no autorizado', texto: 'Ofrece únicamente lo aprobado para cada campaña.' },
      { titulo: 'COFAE omitido', texto: 'Envía el audio obligatorio cuando corresponda.' },
      { titulo: 'Tarifa incorrecta', texto: 'Consulta exclusivamente la tabla vigente y autorizada.' }
    ],
    recursos: [
      { icono: 'META', nombre: 'Meta Smart Online Septiembre', descripcion: 'Archivo oficial con metas, bonos, aceleradores y comisiones.', url: 'assets/documents/septiembre-2026/meta-smart-online-septiembre-2026.xlsx' },
      { icono: '↗', nombre: 'Meta Smart Online · Fuente institucional', descripcion: 'Acceso institucional indicado en el consolidado maestro.', url: 'https://docs.google.com/spreadsheets/d/1-4MOD1IxxrkIpD8CNon1l2iYcRG82y4q/edit?usp=sharing&ouid=115548286725619552601&rtpof=true&sd=true' },
      { icono: 'USD', nombre: 'Tarifas USD', descripcion: 'Carpeta institucional de tarifas USD.', url: 'https://drive.google.com/drive/folders/1E52oivJU-1CJHvY2p5Z4USeWLWwXcXwN?usp=sharing' },
      { icono: '＄', nombre: 'Tarifas Smart Online y Curso Corto 2026 V4', descripcion: 'Carpeta oficial con valores y condiciones vigentes.', url: 'https://drive.google.com/drive/folders/1Y1Mf4HT3ABOBlUZOycPdFoku6v-ISOhc?usp=drive_link' },
      { icono: '＄', nombre: 'Tarifas Smart Flex Score 2026', descripcion: 'Carpeta oficial con valores, descuentos y cuotas Score.', url: 'https://drive.google.com/drive/folders/1Y1Mf4HT3ABOBlUZOycPdFoku6v-ISOhc?usp=drive_link' },
      { icono: '＄', nombre: 'Tarifas Smart Flex MP 2026', descripcion: 'Carpeta oficial con valores, descuentos y cuotas MP.', url: 'https://drive.google.com/drive/folders/1Y1Mf4HT3ABOBlUZOycPdFoku6v-ISOhc?usp=drive_link' },
      { icono: 'CC', nombre: 'COM_VET-FOR-060 · Cursos Virtuales Smart Flex', descripcion: 'Formato oficial para Curso Corto y beneficios virtuales.', url: 'assets/documents/septiembre-2026/com-vet-for-060-cursos-virtuales-smart-flex.docx' },
      { icono: '4×5', nombre: 'COM_VET-FOR-056 · Registro Beca Smart Flex', descripcion: 'Formato oficial del quinto nivel de la campaña 4x5.', url: 'assets/documents/septiembre-2026/com-vet-for-056-beca-smart-flex.docx' },
      { icono: '§', nombre: 'Términos Smart Online · Público', descripcion: 'Documento oficial completo de septiembre.', url: 'assets/documents/septiembre-2026/smart-online-publico-septiembre-2026.pdf' },
      { icono: '§', nombre: 'Términos Smart Online · Convenios', descripcion: 'Documento oficial completo de septiembre.', url: 'assets/documents/septiembre-2026/smart-online-convenios-septiembre-2026.pdf' },
      { icono: '§', nombre: 'Términos Smart Flex · Score y MP', descripcion: 'Documentos oficiales segmentados por Público, Alianza Masiva y Convenio Empresarial.', url: '#smart-flex' },
      { icono: '✓', nombre: 'Políticas de operación', descripcion: 'PENDIENTE_VALIDACION · Documento pendiente de actualización.', url: 'assets/documents/documentos-no-suministrados.html#politicas' },
      { icono: 'COFAE', nombre: 'Guion de Asentamiento Clientes COFAE', descripcion: 'GESTIÓN OBLIGATORIA PARA CULMINAR UN PROCESO DE MATRÍCULA CON FINANCIACIÓN COFAE.', url: 'assets/documents/septiembre-2026/guion-asentamiento-clientes-cofae.pdf' },
      { icono: 'SF', nombre: 'Salesforce', descripcion: 'PENDIENTE_VALIDACION · Enlace institucional no suministrado.', url: 'assets/documents/documentos-no-suministrados.html#salesforce' }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
