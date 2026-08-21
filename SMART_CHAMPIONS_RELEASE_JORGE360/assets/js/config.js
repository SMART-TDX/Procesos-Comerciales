(function (global) {
  'use strict';

  global.SMART_CONFIG = Object.freeze({
    version: '1.0.0',
    mes: 'AGOSTO 2026',
    plan: 'Meta y Estrategia Comercial',
    subtitulo: 'Todo lo que necesitas conocer para cumplir nuestra meta este mes.',
    vigencia: '03 DE AGOSTO DE 2026 AL 01 DE SEPTIEMBRE DE 2026',
    diasHabiles: 20,
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
      mensajeCorto: 'Agosto exige enfoque, dominio de nuestras campañas y una ejecución comercial impecable.',
      mensajeFinal: 'Tenemos campañas, herramientas y condiciones comerciales muy competitivas. El resultado dependerá de nuestra capacidad para estudiarlas, comprenderlas y convertirlas en argumentos de valor. Agosto debe ser un mes de disciplina, recaudo, aprendizaje y grandes cierres.'
    },
    objetivoMes: {
      nombre: 'Objetivo Agosto',
      valor: 340000000
    },
    metaGeneral: {
      titulo: 'Nuestro reto de agosto',
      ticketMedioReferencia: 2000000,
      responsabilidadSO: '4 %',
      niveles: [
        { nombre: 'Alcanzable', valor: 300000000 },
        { nombre: 'Retadora', valor: 320000000 },
        { nombre: 'Aspiracional', valor: 340000000 }
      ],
      sumaMetasIndividuales: 353812499,
      diferenciaAdministrativa: 13812499,
      validacionAdministrativa: 'La suma de metas individuales supera la meta aspiracional. No utilizar esta suma como meta general.'
    },
    metasIndividuales: [
      { categoria: 'A', ejecutivo: 'DANIEL ESTEBAN GALINDO FANDIÑO', matriculasAproximadas: 5.6666665, metaRecaudo: 11333333 },
      { categoria: 'A', ejecutivo: 'JULIANA CAROLINA RODRIGUEZ', matriculasAproximadas: 5.6666665, metaRecaudo: 11333333 },
      { categoria: 'A', ejecutivo: 'GIAN FRANCO CHINOME CALVO', matriculasAproximadas: 5.6666665, metaRecaudo: 11333333 },
      { categoria: 'AA', ejecutivo: 'BRAYAN DAVID MANRIQUE LOPEZ', matriculasAproximadas: 8.5, metaRecaudo: 17000000 },
      { categoria: 'AAA', ejecutivo: 'FLOR VIVIANA CASTAÑEDA LOZADA', matriculasAproximadas: 10.09375, metaRecaudo: 20187500 },
      { categoria: 'AAA', ejecutivo: 'ANDRES SEBASTIAN RUIZ SUAREZ', matriculasAproximadas: 10.09375, metaRecaudo: 20187500 },
      { categoria: 'AAA', ejecutivo: 'ERICK JOHAN ROCHA BENITEZ', matriculasAproximadas: 10.09375, metaRecaudo: 20187500 },
      { categoria: 'AAA', ejecutivo: 'NICOLLE YURANI MURCIA AVILA', matriculasAproximadas: 10.09375, metaRecaudo: 20187500 },
      { categoria: 'AAA', ejecutivo: 'CRISTIAN JAVIER GARCIA BARRETO', matriculasAproximadas: 10.09375, metaRecaudo: 20187500 },
      { categoria: 'AAA', ejecutivo: 'ALISON ALDANA GARCIA', matriculasAproximadas: 10.09375, metaRecaudo: 20187500 },
      { categoria: 'AAA', ejecutivo: 'JUAN SEBASTIAN ROMERO LONDOÑO', matriculasAproximadas: 10.09375, metaRecaudo: 20187500 },
      { categoria: 'AAA', ejecutivo: 'ANGIE STHEFANY BRICEÑO GONZALEZ', matriculasAproximadas: 10.09375, metaRecaudo: 20187500 },
      { categoria: 'AAA', ejecutivo: 'PAOLA ANDREA RESTREPO TORRES', matriculasAproximadas: 10.09375, metaRecaudo: 20187500 },
      { categoria: 'AAA', ejecutivo: 'GERMAN ANDRES SIERRA ORTIZ', matriculasAproximadas: 10.09375, metaRecaudo: 20187500 },
      { categoria: 'AAA', ejecutivo: 'BRIGETH SAMANTA VARON ORTIZ', matriculasAproximadas: 10.09375, metaRecaudo: 20187500 },
      { categoria: 'AAA', ejecutivo: 'CLAUDIA LILIANA GONZALEZ LOPEZ', matriculasAproximadas: 10.09375, metaRecaudo: 20187500 },
      { categoria: 'AAA', ejecutivo: 'IVETTE TATIANA NIETO ARENAS', matriculasAproximadas: 10.09375, metaRecaudo: 20187500 },
      { categoria: 'AAA', ejecutivo: 'JHON ALEXANDER AVILA QUIROGA', matriculasAproximadas: 10.09375, metaRecaudo: 20187500 },
      { categoria: 'AAA', ejecutivo: 'LAURA SOFIA DAZA ZEA', matriculasAproximadas: 10.09375, metaRecaudo: 20187500 }
    ],
    bonos: [
      { cumplimiento: '120 %', nuevos: '1,5 %', antiguos: '2,5 %' },
      { cumplimiento: '130 %', nuevos: '2 %', antiguos: '4 %' },
      { cumplimiento: '140 %', nuevos: '3 %', antiguos: '6 %' },
      { cumplimiento: '150 %', nuevos: '4 %', antiguos: '8 %' }
    ],
    bonoGrupal: [
      { meta: 'Retadora', valor: 300000, condicion: 'El equipo Smart Online alcanza la meta Retadora y el comercial cumple una meta igual o superior al 120 %.' },
      { meta: 'Aspiracional', valor: 350000, condicion: 'El equipo Smart Online alcanza la meta Aspiracional y el comercial cumple una meta igual o superior al 120 %.' }
    ],
    aceleradores: [
      { nombre: 'Home Office', beneficio: 'Home Office', condicion: 'Meta al 75 % al corte del 14 de agosto, 85 % al corte del 18 de agosto o 100 % al corte del 25 de agosto.' },
      { nombre: 'Salida anticipada', beneficio: 'Media jornada el viernes 4 o sábado 5 de septiembre', condicion: 'Meta al 130 % al cierre de agosto.' },
      { nombre: 'Turno corto por día', beneficio: '5 horas laborales', condicion: 'Sostener y cumplir la meta al día del 120 %.' },
      { nombre: 'Tiempo adicional de break', beneficio: '15 minutos adicionales', condicion: 'Sostener y cumplir la meta al día del 120 %.' },
      { nombre: 'Efectividad del 20 % +', beneficio: 'Ingreso una hora más tarde al turno laboral una vez por semana, con corte los sábados', condicion: 'Mantener una efectividad del 20 % o superior.' }
    ],
    culturaChampions: [
      { semana: 'SEMANA 1', periodo: '03 AL 07 DE AGOSTO', objetivo: '45 %', pieza: 'assets/images/cultura-champions-semana-1.png', premios: [{ categoria: 'A', valor: 25000, marcas: ['Popsy', 'Tostao'] }, { categoria: 'AA', valor: 40000, marcas: ['Crepes & Waffles', 'Éxito', 'Dollarcity'] }, { categoria: 'AAA', valor: 60000, marcas: ['Crepes & Waffles', 'Éxito', 'El Corral', 'KOAJ'] }] },
      { semana: 'SEMANA 2', periodo: '10 AL 14 DE AGOSTO', objetivo: '80 %', pieza: 'assets/images/cultura-champions-semana-2.png', premios: [{ categoria: 'A', valor: 25000, marcas: ['Popsy', 'Tostao'] }, { categoria: 'AA', valor: 40000, marcas: ['Crepes & Waffles', 'Éxito', 'Dollarcity'] }, { categoria: 'AAA', valor: 60000, marcas: ['Crepes & Waffles', 'Éxito', 'El Corral', 'KOAJ'] }] }
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
      nombre: 'Presentación Oficial Meta Agosto',
      url: 'https://canva.link/hmqpwbczizd0ckm',
      fuente: 'META SMART ON LINE AGOSTO 2026 (1).xlsx · pestaña PRESENTACION'
    },
    cambios: [
      { tipo: 'NUEVO', titulo: 'Ruta Smart Flex MP', texto: 'Alternativa con foco en recaudo y mayor beneficio para pago de contado, según tabla aprobada.' },
      { tipo: 'ACTUALIZACIÓN', titulo: 'Tablas comerciales', texto: 'Validar siempre valores, descuentos y cuotas en las tablas vigentes antes de presentar la oferta.' },
      { tipo: 'IMPORTANTE', titulo: 'Smart Online 2x1', texto: 'La campaña exige curso titular de 12 meses y no aplica con pago mensual COFAE.' }
    ],
    campanas: [
      { id: 'online', linea: 'SMART ONLINE', nombre: '2x1 · Beca', estado: 'VIGENTE', objetivo: 'Extender la oportunidad de aprendizaje a un beneficiario.', beneficio: 'Segundo curso de 12, 9 o 6 meses por la compra titular de 12 meses.', condiciones: ['Vigencia: agosto de 2026.', 'Aplica para la compra titular de un curso Smart Online de 12 meses.', 'Hasta 5 módulos de inglés y 4 de francés.', 'Aplica con tarjeta crédito, tarjeta débito, cesantías, ADDI, Fincomercio y entidades financieras autorizadas.', 'No aplica con pago mensual COFAE.', 'Formato obligatorio COM_VET-FOR-007_Formato Beca 2x1 Smart OnLine_V3_30062026.', 'Salesforce: Smart Online - 2x1 - Beca · 701WP00001H1bXtYAJ.', 'Descuento de la beca: 100 %.', 'El ejecutivo debe seleccionar la campaña, diligenciar y cargar el formato, y garantizar la solicitud, seguimiento y activación de la beca.'], color: 'red' },
      { id: 'score', linea: 'SMART FLEX', nombre: 'Score', estado: 'VIGENTE', objetivo: 'Ofrecer condiciones habituales y mayor disponibilidad de cuotas.', beneficio: 'Con 5 niveles: Curso Corto Smart, Linguaskill y preparación.', condiciones: ['Vigencia oficial: 3 de agosto al 1 de septiembre de 2026.', 'Campaña Salesforce · 701WP00000omCi5YAE.', 'Aplicar descuentos, valores y cuotas según la tabla Score aprobada.', 'En contado, el descuento aprobado llega hasta 42 % para cinco niveles.', 'Curso Corto requiere COM_VET-FOR-060_Formato Beca Cursos Virtuales Smart Flex_V2_06052026.', 'Linguaskill aplica desde 2 niveles cuando el plan contratado alcanza mínimo B1.'], color: 'teal' },
      { id: 'mp', linea: 'SMART FLEX', nombre: 'MP', estado: 'VIGENTE', objetivo: 'Incrementar el recaudo y priorizar oportunidades de contado.', beneficio: 'Hasta 50 % de descuento, únicamente según la tabla aprobada.', condiciones: ['Vigencia oficial: 3 de agosto al 1 de septiembre de 2026.', 'Campaña Salesforce · 701WP00001KmkT7YAJ.', 'Mayor descuento para contado y menor cantidad de cuotas.', 'El descuento, valor y número de cuotas exactos se consultan en la tabla MP.', 'Los beneficios académicos se rigen por los términos oficiales de la campaña.'], color: 'yellow' },
      { id: '4x5', linea: 'SMART FLEX', nombre: '4x5', estado: 'VIGENTE', objetivo: 'Potenciar el cierre mediante beneficios académicos aprobados.', beneficio: 'Compra de cuatro niveles, quinto nivel como beca, Curso Corto Smart, Linguaskill y preparación.', condiciones: ['Aplica al mismo titular y exclusivamente para inglés Smart Flex virtual.', 'Quinto nivel requiere COM_VET-FOR-056_Formato Informe Registro Beca Smart Flex_V3_01032026.', 'Curso Corto requiere COM_VET-FOR-060_Formato Beca Cursos Virtuales Smart Flex_V2_06052026.', 'Curso Corto aplica al adquirir 4 o 5 niveles.', 'Linguaskill y preparación aplican cuando el plan contratado cumple las condiciones oficiales.', 'El ejecutivo debe diligenciar y cargar los formatos, realizar seguimiento y garantizar la correcta aplicación de los beneficios.'], color: 'green' }
    ],
    medicion: [
      { icono: '◆', nombre: 'Matrículas', texto: 'Volumen total de matrículas logradas durante agosto.' },
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
      { campana: 'Smart Online 2x1', presentar: 'Una oportunidad de aprendizaje para el titular y un beneficiario.', decir: 'El titular adquiere 12 meses y puede asignar una beca de 12, 9 o 6 meses.', evitar: 'No presentarla con COFAE ni prometer coberturas superiores.', objecion: '¿El beneficiario debe tomar el mismo tiempo?', respuesta: 'Puede recibir 12, 9 o 6 meses, sin superar el curso adquirido por el titular.', cierre: 'Confirmemos la opción autorizada y completemos correctamente el formato 007.' },
      { campana: 'Smart Flex Score', presentar: 'La ruta habitual para combinar niveles, cuotas y beneficios aprobados.', decir: 'La tabla Score permite consultar la alternativa vigente según niveles y forma autorizada de pago.', evitar: 'No modificar cuotas, descuentos ni valores.', objecion: '¿Qué beneficio obtengo con cinco niveles?', respuesta: 'Incluye Curso Corto, Linguaskill y preparación, sujeto a las condiciones aprobadas.', cierre: 'Revisemos la tabla Score vigente y dejemos definida la alternativa correcta.' },
      { campana: 'Smart Flex MP', presentar: 'Una ruta enfocada en recaudo, especialmente para clientes con capacidad de contado.', decir: 'Puede ofrecer descuentos de hasta 50 %, siempre según la tabla MP aprobada.', evitar: 'No ofrecer automáticamente el descuento máximo.', objecion: '¿Siempre aplica el 50 %?', respuesta: 'No. El porcentaje exacto depende de la tabla vigente y las condiciones aplicables.', cierre: 'Confirmemos en la tabla MP el valor y las cuotas exactas para avanzar.' },
      { campana: 'Smart Flex 4x5', presentar: 'Una alternativa que convierte cuatro niveles adquiridos en una ruta de cinco.', decir: 'El quinto nivel se asigna como beca e incluye los beneficios autorizados.', evitar: 'No omitir los formatos 056 y 060.', objecion: '¿Cómo se activa el quinto nivel?', respuesta: 'Debe diligenciarse y cargarse el formato correspondiente para gestionar la beca.', cierre: 'Completemos los soportes para asegurar correctamente todos los beneficios.' }
    ],
    errores: [
      { titulo: 'Campaña sin registrar', texto: 'Selecciona siempre la campaña correcta en Salesforce.' },
      { titulo: 'Formato incompleto', texto: 'No cargues soportes con información pendiente.' },
      { titulo: 'Beneficio no autorizado', texto: 'Ofrece únicamente lo aprobado para cada campaña.' },
      { titulo: 'COFAE omitido', texto: 'Envía el audio obligatorio cuando corresponda.' },
      { titulo: 'Tarifa incorrecta', texto: 'Consulta exclusivamente la tabla vigente y autorizada.' }
    ],
    recursos: [
      { icono: '◎', nombre: 'Presentación de meta', descripcion: 'Meta, prioridades y foco comercial del mes.', url: '#meta' },
      { icono: '＄', nombre: 'Tarifas Smart Online', descripcion: 'Tabla oficial suministrada para la línea Smart Online.', url: 'assets/documents/tarifas-smart-online-2026.xlsx' },
      { icono: '＄', nombre: 'Tarifas Flex Score', descripcion: 'Valores, descuentos y cuotas autorizadas.', url: 'assets/documents/tarifas-smart-flex-score-2026.xlsx' },
      { icono: '＄', nombre: 'Tarifas Flex MP', descripcion: 'Tabla vigente con enfoque de recaudo.', url: 'assets/documents/tarifas-smart-flex-mp-2026.xlsx' },
      { icono: '2×1', nombre: 'Formato Smart Online', descripcion: 'COM-FOR-007 · Beca 2x1.', url: 'assets/documents/formato-smart-online-2x1-com-for-007.pdf' },
      { icono: 'CC', nombre: 'Formato Curso Corto', descripcion: 'COM-FOR-060 · Cursos Virtuales.', url: 'assets/documents/formato-curso-corto-com-for-060.pdf' },
      { icono: '4×5', nombre: 'Formato quinto nivel', descripcion: 'COM-FOR-056 · Registro de beca.', url: 'assets/documents/formato-smart-flex-4x5-com-for-056.pdf' },
      { icono: '§', nombre: 'Términos Smart Online', descripcion: 'Condiciones oficiales de la campaña.', url: 'assets/documents/terminos-smart-online-agosto-2026.pdf' },
      { icono: '§', nombre: 'Términos Smart Flex', descripcion: 'Condiciones oficiales de Score, MP y 4x5.', url: 'assets/documents/terminos-smart-flex-agosto-2026.pdf' },
      { icono: '✓', nombre: 'Políticas de operación', descripcion: 'PENDIENTE_VALIDACION · Documento pendiente de actualización.', url: 'assets/documents/documentos-no-suministrados.html#politicas' },
      { icono: '◫', nombre: 'Matriz de comunicación', descripcion: 'PENDIENTE_VALIDACION · Documento oficial no suministrado.', url: 'assets/documents/documentos-no-suministrados.html#matriz' },
      { icono: 'COFAE', nombre: 'Guion de Asentamiento Clientes COFAE', descripcion: 'Modelo oficial que debe utilizarse como referencia para garantizar que el cliente con financiación COFAE reciba las indicaciones correspondientes sobre sus compromisos académicos y financieros.', url: 'assets/documents/guion-asentamiento-clientes-cofae.pdf' },
      { icono: 'SF', nombre: 'Salesforce', descripcion: 'PENDIENTE_VALIDACION · Enlace institucional no suministrado.', url: 'assets/documents/documentos-no-suministrados.html#salesforce' }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
