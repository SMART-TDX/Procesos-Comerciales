# SMART SALES ASSISTANT
## Especificación oficial de experiencia UX/UI

Estado: plano de diseño, no implementación  
Usuario principal: asesor comercial  
Alcance: Smart Online y Smart Flex

Este documento define la experiencia futura del asistente comercial. No activa beneficios, campañas ni reglas; no modifica tarifas, descuentos, cálculos, financiación o datos oficiales. `PRODUCT_DECISIONS.md` conserva la autoridad sobre las decisiones de negocio y `COMMERCIAL_ENGINE.md` sobre la elegibilidad de activos comerciales.

## CAPÍTULO 1. FILOSOFÍA DE LA EXPERIENCIA

La aplicación debe comportarse como un asistente que conduce una conversación comercial, no como un formulario que exige interpretar campos. Cada pantalla responderá tres preguntas en menos de cinco segundos:

1. ¿Dónde estoy?
2. ¿Qué decisión debo tomar ahora?
3. ¿Qué ocurrirá después?

La experiencia debe transmitir:

- confianza, porque todos los resultados provienen de reglas oficiales;
- rapidez, porque cada pantalla concentra una sola decisión principal;
- orden, porque la información aparece progresivamente;
- profesionalismo, mediante una composición sobria y consistente;
- simplicidad, mediante lenguaje directo y opciones compatibles.

Principios rectores:

- Una acción principal por pantalla.
- Una decisión comercial por paso, salvo los datos condicionales que formen una unidad inseparable, como la configuración de una financiación.
- Mostrar solo lo necesario para decidir en el momento actual.
- Mantener visibles el contexto y el resultado sin repetir todos los controles.
- Avanzar automáticamente después de una selección válida cuando no se requiera información adicional.
- Preservar el control: toda selección anterior debe poder editarse.
- Recalcular únicamente las dependencias de una selección modificada.
- No exponer hojas, bloques, fórmulas, identificadores ni conceptos internos del Excel.
- No presentar una opción inválida para luego informar que no puede usarse.
- No utilizar patrones visuales, logotipos ni componentes copiados de Salesforce, HubSpot, Stripe, Notion, Linear o Microsoft 365. Estas referencias representan únicamente estándares de claridad, consistencia y madurez empresarial.

La interfaz debe sentirse calmada y deliberada. El espacio en blanco, la jerarquía y la redacción deben reemplazar la acumulación de bordes, campos y mensajes.

## CAPÍTULO 2. NAVEGACIÓN

### Modelo Wizard

La navegación será un Wizard adaptativo. La cabecera permanecerá visible y contendrá:

- identidad textual o logotipo oficial cuando exista;
- nombre de la experiencia;
- indicador `Paso X de Y`;
- progreso gráfico;
- acción secundaria para reiniciar, protegida por confirmación cuando exista trabajo avanzado.

El indicador representará estados claramente diferenciados:

- actual: círculo sólido y etiqueta visible;
- completado: marca de confirmación y acceso para editar;
- pendiente: círculo neutro;
- bloqueado: no interactivo hasta completar sus dependencias;
- requiere revisión: señal de atención sin usar el rojo como estado genérico.

En computador, la barra mostrará el nombre corto del paso cuando haya espacio. En tablet y celular mostrará `Paso X de Y`, el nombre del paso actual y una barra compacta. Nunca dependerá solo del color para comunicar estado.

### Composición persistente

En computador se utilizarán dos áreas:

- área principal, dedicada al paso actual y al paso inmediatamente anterior comprimido;
- resumen lateral, persistente y actualizado en tiempo real.

Los pasos anteriores se representarán como filas compactas con etiqueta, selección y acción `Editar`. Solo el paso inmediatamente anterior podrá permanecer expandido de forma resumida. Los demás estarán disponibles desde el progreso o el resumen.

### Comportamiento del avance

- Una tarjeta válida de selección única avanza automáticamente después de una confirmación visual breve.
- Los pasos con datos compuestos avanzan mediante un único botón principal, por ejemplo `Continuar al resumen`.
- El foco se trasladará al título del nuevo paso para lectores de pantalla.
- El cambio de un dato anterior conservará los datos independientes y limpiará solo los dependientes definidos por las reglas oficiales.
- Si una selección comercial deja de ser válida, se retirará con una explicación clara antes de continuar.
- El botón Atrás conservará los datos y no equivaldrá a reiniciar.
- El historial del navegador no será el mecanismo principal del Wizard local.

### Acción principal

La acción primaria deberá ser única, inequívoca y contextual: `Continuar`, `Ver resumen` o `Preparar Propuesta Comercial`. Las acciones secundarias tendrán menor peso visual y nunca competirán con ella.

## CAPÍTULO 3. FLUJO OFICIAL SMART ONLINE

Smart Online tendrá siete macroetapas visuales. Las decisiones financieras condicionales vivirán dentro de la etapa Forma de pago para preservar las reglas oficiales sin convertir el recorrido en una secuencia artificialmente extensa.

### Paso 1. Línea de estudio

- Mostrar dos tarjetas grandes: `Smart Online` y `Smart Flex`.
- Cada tarjeta incluirá nombre y descripción breve autorizada, sin comparaciones no aprobadas.
- Al seleccionar Smart Online, avanzar a Duración.

### Paso 2. Duración

- Pregunta principal: `¿Durante cuánto tiempo tendrá acceso el estudiante?`
- Mostrar tarjetas para `6 meses`, `9 meses` y `12 meses` únicamente cuando estén disponibles en los datos oficiales.
- Smart Online no mostrará nivel de ingreso, Score, MP ni horas de formación.

### Paso 3. Condición comercial

- Mostrar tarjetas en el orden comercial oficial.
- Incluir solo condiciones compatibles con la duración elegida.
- No ordenar alfabéticamente ni inferir disponibilidad.

### Paso 4. Forma de pago

- Presentar únicamente formas de pago oficiales disponibles.
- Usar `Pago único` como denominación visible cuando corresponda.
- Cuando exista financiación, revelar progresivamente dentro del mismo paso: número oficial de cuotas, primera cuota, fecha de cotización y primer pago, fecha de segunda cuota si existe saldo pendiente y vista visual del plan de pagos.
- No solicitar datos financieros que no correspondan al caso elegido.
- La etapa solo se considera completa cuando todas las validaciones financieras existentes estén satisfechas.

### Paso 5. Beneficios disponibles

- Mostrar exclusivamente activos autorizados y elegibles devueltos por el Motor Comercial Inteligente.
- Si todavía no existen beneficios activos, mostrar un estado neutral y permitir continuar sin inventar contenido.
- Las tarjetas elegidas pasarán al resumen lateral.

### Paso 6. Resumen

- Presentar programa, duración, condición, forma de pago, importes oficiales y beneficios seleccionados.
- Permitir editar cada bloque sin reiniciar el recorrido completo.
- Destacar el valor final como protagonista.
- Exigir reconciliación exacta antes de habilitar la siguiente etapa.

### Paso 7. Preparar propuesta

- Solicitar o confirmar los datos necesarios para la propuesta según las decisiones oficiales.
- La única acción principal será `Preparar Propuesta Comercial`.
- Abrir una vista previa antes de imprimir o guardar mediante impresión.

## CAPÍTULO 4. FLUJO OFICIAL SMART FLEX

Smart Flex tendrá nueve macroetapas visuales. La estructura interna de los Excel permanecerá completamente oculta.

### Paso 1. Línea

- Mostrar las tarjetas `Smart Online` y `Smart Flex`.
- Al seleccionar Smart Flex, avanzar a Nivel de ingreso.

### Paso 2. Nivel de ingreso

- Mostrar solo niveles oficiales disponibles.
- La selección es obligatoria porque determina las opciones posteriores.
- No preseleccionar un nivel ni sugerir uno sin información oficial.

### Paso 3. Tarifa

- Mostrar dos tarjetas cuando ambas sean compatibles: `SCORE` y `MP`.
- Si solo una modalidad comercial es válida, mostrarla como única alternativa explicando que corresponde a la selección actual; no fabricar la otra opción.
- En resúmenes y propuestas se utilizará la expresión completa `Modalidad comercial: Score` o `Modalidad comercial: MP`, nunca la palabra aislada.

### Paso 4. Plan

- Mostrar tarjetas de los planes compatibles simultáneamente con nivel de ingreso y modalidad comercial.
- Cada tarjeta podrá mostrar niveles incluidos y horas de formación oficiales cuando existan.
- No mostrar nombres internos como Flex Pack, Modelo Actual o Nivel a Nivel.

### Paso 5. Condición comercial

- Mantener el orden oficial.
- Ocultar condiciones incompatibles o no activas.
- Cambiar esta selección limpiará solamente forma de pago y etapas dependientes.

### Paso 6. Forma de pago

- Presentar solo modalidades válidas.
- Para financiación, revelar en el mismo paso número de cuotas, primera cuota, fechas aplicables y plan de pagos.
- Conservar valor total, descuento, cuotas y centavos exactamente según las reglas oficiales.

### Paso 7. Beneficios disponibles

- Mostrar exclusivamente beneficios autorizados por el motor comercial para la combinación vigente.
- Nunca asumir que un beneficio previsto en la arquitectura está activo.
- Retirar cualquier selección que pierda elegibilidad tras un cambio anterior e informar el motivo.

### Paso 8. Resumen

- Presentar programa, modalidad comercial, nivel de ingreso, plan, niveles, horas, condición, pago, importes y beneficios confirmados.
- El valor final será el elemento dominante.
- Cada bloque tendrá una acción secundaria `Editar`.

### Paso 9. Preparar propuesta

- Confirmar los datos de cliente y asesor requeridos por las decisiones oficiales.
- Usar el botón `Preparar Propuesta Comercial`.
- Mostrar la vista previa antes de cualquier impresión.

### Dependencias visibles

- Cambiar la línea reinicia el recorrido específico de la línea anterior.
- Cambiar el nivel limpia modalidad comercial, plan y etapas posteriores.
- Cambiar SCORE o MP limpia plan y etapas posteriores.
- Cambiar el plan limpia condición comercial y etapas posteriores.
- Cambiar la condición limpia forma de pago y etapas posteriores.
- Cambiar la forma de pago limpia únicamente sus datos financieros dependientes y etapas posteriores.

## CAPÍTULO 5. DISEÑO DE TARJETAS

Las decisiones importantes se presentarán mediante tarjetas seleccionables, no mediante listas tradicionales. Un selector desplegable se reservará para conjuntos extensos donde las tarjetas perjudiquen la exploración; nunca se utilizará cuando existan únicamente dos opciones.

### Anatomía

Cada tarjeta tendrá:

- área táctil completa;
- título breve;
- descripción de una línea cuando aporte contexto;
- dato secundario oficial cuando ayude a comparar;
- indicador de selección no dependiente solo del color;
- foco visible para teclado;
- altura y espaciado consistentes.

### Estados

- reposo: superficie blanca y borde gris suave;
- hover: elevación mínima o cambio de borde, sin desplazar el contenido;
- foco: contorno de alto contraste;
- activa: borde Smart rojo, fondo apenas matizado e icono de confirmación;
- completada: estado compacto con selección legible;
- deshabilitada: solo cuando sea indispensable explicar una dependencia; de preferencia, una opción inválida no se muestra;
- error: mensaje asociado y explicación accionable.

### Reglas de composición

- Dos opciones: dos tarjetas equivalentes en una fila; una columna en celular.
- Tres opciones: cuadrícula equilibrada; nunca reducir texto por hacerlas caber.
- Más opciones: cuadrícula responsiva con agrupación y búsqueda solo si el volumen lo justifica.
- No incluir iconos decorativos que sugieran ventajas no autorizadas.
- Toda la tarjeta debe poder activarse con teclado y toque.

## CAPÍTULO 6. RESULTADO

En computador, el resumen derecho será persistente y se dividirá en tres bloques. Permanecerá visible mientras el asesor avanza, sin ocultar el contenido principal.

### PROGRAMA

Mostrar según la línea:

- programa;
- plan o duración;
- horas de formación, solo para Smart Flex cuando existan;
- niveles, solo para Smart Flex;
- nivel de ingreso y modalidad comercial, cuando correspondan.

Los datos aún no seleccionados se mostrarán como `Pendiente`, sin guiones ambiguos ni ceros.

### INVERSIÓN

Mostrar:

- valor oficial o valor de lista cuando exista oficialmente;
- descuento oficial;
- valor final;
- ahorro calculado conforme a las reglas aprobadas.

El valor final será el dato de mayor jerarquía visual. Los importes conservarán centavos cuando existan y omitirán `,00` innecesarios. Ninguna etiqueta visual deberá alterar el significado financiero.

### BENEFICIOS

- Mostrar únicamente beneficios seleccionados y todavía elegibles.
- No mostrar beneficios disponibles pero no elegidos.
- No mostrar activos pendientes, vencidos, incompatibles o descartados.
- Permitir editar la selección desde este bloque cuando la etapa esté habilitada.
- Si no hay beneficios confirmados, usar `Sin beneficios seleccionados` en el entorno del asesor; esta frase no se trasladará automáticamente a la propuesta del cliente.

En tablet, el resumen se convertirá en un panel compacto adherente. En celular, será una tarjeta plegable con valor final siempre visible y acceso claro a su detalle.

## CAPÍTULO 7. ESTRATEGIA DE CIERRE

La pantalla Beneficios disponibles debe ayudar al asesor a comunicar valor sin ejercer presión ni inventar ventajas. Su encabezado será:

`Para esta negociación puedes ofrecer:`

### Contenido

El sistema podrá representar, únicamente cuando el motor comercial los autorice:

- Examen Linguaskill;
- cursos cortos;
- ebooks;
- campaña del mes;
- otros activos futuros aprobados.

La mención en esta especificación define el patrón visual, no su disponibilidad funcional. Los cursos cortos continúan fuera del alcance aprobado mientras `PRODUCT_DECISIONS.md` no indique lo contrario.

### Tarjeta de beneficio

Cada tarjeta incluirá:

- nombre oficial;
- descripción comercial autorizada;
- alcance o cantidad permitida;
- vigencia visible cuando sea relevante;
- control inequívoco para seleccionar o retirar;
- vínculo `Ver condiciones` cuando existan condiciones autorizadas que el asesor deba conocer.

No mostrará códigos de reglas, prioridades, fuentes técnicas ni motivos internos de elegibilidad.

### Orden y selección

- Primero: campaña vigente confirmada por el motor, si aplica.
- Segundo: beneficios directamente asociados al programa.
- Tercero: activos complementarios autorizados.
- El orden no implicará valor monetario.
- Ningún beneficio opcional se seleccionará automáticamente.
- Una sola acción principal, `Continuar con estos beneficios`.
- Si no hay beneficios disponibles, la acción será `Continuar al resumen`.

### Confianza comercial

La redacción será descriptiva y concreta. Se evitarán urgencias artificiales, superlativos, promesas de resultado y estimaciones económicas no aprobadas. La interfaz diferenciará con claridad entre `Disponible` y `Seleccionado`.

## CAPÍTULO 8. PLAN DE PAGOS

El plan de pagos será una secuencia visual, nunca una tabla tipo Excel. No cambiará el motor financiero; representará exactamente su resultado.

### Estructura

- Cabecera con valor final, forma de pago y número de cuotas.
- Tarjeta destacada `Primera cuota` con importe y fecha.
- Grupo `Cuotas siguientes` mediante una línea de tiempo o cuadrícula cronológica.
- Tarjeta destacada `Última cuota` con importe y fecha.
- Etiqueta `Cuota final — ajuste de cierre` cuando corresponda por centavos o redondeo autorizado.
- Resumen de amortización cuando exista oficialmente.

### Calendario y fechas

- Cada cuota mostrará número, fecha completa e importe.
- La secuencia cronológica será inequívoca.
- No depender únicamente de una línea horizontal, para conservar lectura en celular y accesibilidad.
- Las fechas inválidas o incompletas impedirán avanzar y señalarán el dato que debe corregirse.
- El calendario visual no podrá recalcular ni modificar fechas producidas por las reglas vigentes.

### Jerarquía

- Primera cuota: borde y encabezado de alta visibilidad porque inicia el compromiso.
- Cuotas intermedias: representación uniforme y compacta.
- Última cuota: énfasis equivalente a la primera, especialmente si contiene ajuste de cierre.
- Total reconciliado: confirmación visible al final de la secuencia.

### Casos

- Pago único: no mostrar línea de tiempo, amortización, segunda fecha ni falsas cuotas.
- Financiación sin saldo posterior: no mostrar fechas o cuotas inexistentes.
- Valores con centavos: conservar el total oficial y aplicar el residuo exclusivamente a la última cuota según la regla vigente.
- Muchas cuotas: agrupar visualmente sin ocultar importes ni fechas; permitir expandir el detalle completo.

## CAPÍTULO 9. PROPUESTA COMERCIAL

La etapa final se llamará `Preparar Propuesta Comercial`. No se utilizará `Imprimir` ni `Descargar PDF` como acción principal del recorrido.

### Antes de la vista previa

- Confirmar que la cotización continúa siendo válida.
- Reconciliar importes.
- Revalidar los beneficios seleccionados.
- Solicitar nombre completo obligatorio del cliente y teléfono y correo opcionales.
- Solicitar nombre, sede, correo institucional y celular corporativo del asesor.
- Presentar errores junto al dato correspondiente.

### Vista previa

La vista previa será una etapa deliberada, no una ventana técnica. Permitirá:

- revisar el documento completo;
- alternar visualmente entre sus páginas;
- verificar datos de cliente y asesor;
- volver a editar sin perder selecciones independientes;
- identificar claramente qué beneficios serán incluidos;
- ejecutar la acción secundaria de impresión o guardado mediante impresión.

El documento será una propuesta comercial personalizada, no una factura, contrato, reporte técnico o cotización tradicional. La vista previa respetará `PDF_DESIGN_SPEC.md` y no expondrá controles del Wizard dentro del documento.

## CAPÍTULO 10. RESPONSIVE

### Computador

- Área principal y resumen lateral en dos columnas.
- Resumen adherente dentro de la ventana, sin cubrir el pie ni los controles.
- Tarjetas en cuadrículas de dos o tres columnas según el contenido.
- Barra de progreso con pasos y etiquetas cortas.
- Botón principal alineado al final del área de decisión y siempre localizable.
- Plan de pagos en línea de tiempo horizontal solo cuando todas las cuotas sean legibles; de lo contrario, cuadrícula.

### Tablet

- Una columna principal con resumen compacto adherente en la parte superior o lateral según orientación.
- Progreso reducido a etapa actual, contador y barra.
- Tarjetas en dos columnas; una columna cuando el texto lo requiera.
- Botones con área táctil mínima de 44 por 44 píxeles.
- Plan de pagos en cuadrícula de dos columnas o línea vertical.

### Celular

- Una sola columna.
- Cabecera compacta que no consuma la primera pantalla completa.
- Resumen plegable con valor final siempre visible.
- Tarjetas apiladas de ancho completo.
- Acción principal adherente en la zona inferior cuando no tape contenido ni teclado.
- Botones secundarios separados para evitar activaciones accidentales.
- Plan de pagos en línea de tiempo vertical.
- Fechas, importes y etiquetas sin desplazamiento horizontal.
- Vista previa ajustada al ancho, con control de página y posibilidad de ampliar sin perder legibilidad.

### Reglas transversales

- No ocultar información crítica por tamaño de pantalla.
- No reducir tipografía por debajo de un tamaño legible para conservar columnas.
- No utilizar scroll horizontal para completar decisiones.
- Conservar orden lógico de lectura y navegación por teclado.
- Mantener el valor final visible sin convertirlo en un elemento invasivo.

## CAPÍTULO 11. MICROINTERACCIONES

Las microinteracciones confirmarán causa y efecto; nunca serán ornamentales.

### Animaciones y transiciones

- Cambio de paso: transición breve de opacidad y desplazamiento suave, entre 160 y 240 ms.
- Selección de tarjeta: confirmación visual inmediata, sin esperar a la transición.
- Compresión de paso completado: animación corta que preserve la ubicación mental del usuario.
- Actualización del resumen: resaltar únicamente los datos modificados durante un instante.
- Paneles desplegables: conservar altura predecible y evitar saltos abruptos.
- Respetar `prefers-reduced-motion`; con movimiento reducido, utilizar cambios instantáneos de estado.

### Carga

- Como la aplicación es local, evitar pantallas de carga artificiales.
- Si una evaluación requiere tiempo perceptible, mostrar un estado localizado con el texto `Validando opciones disponibles…`.
- Nunca presentar datos anteriores como si ya correspondieran a la nueva selección.

### Hover y foco

- Hover solo complementa; ninguna función dependerá de él.
- Foco de teclado siempre visible y con contraste suficiente.
- Los elementos no interactivos no deberán simular hover o clic.

### Estados activos y completados

- Activo: borde, icono y texto accesible.
- Completado: confirmación y valor elegido.
- Pendiente: instrucción concreta, no un error.
- Deshabilitado: explicación disponible cuando sea necesario comprender la dependencia.

### Errores

- Indicar qué ocurrió, dónde y cómo corregirlo.
- No borrar entradas válidas por un error localizado.
- Llevar el foco al primer error al intentar continuar.
- Mostrar un resumen de errores solo cuando existan varios y conservar mensajes en contexto.
- No usar el rojo Smart indistintamente para marca, selección y error dentro del mismo componente.

### Confirmaciones

- Confirmación breve al completar una etapa.
- Confirmación explícita antes de reiniciar una cotización avanzada.
- No usar ventanas de confirmación para acciones fácilmente reversibles.
- Informar cuando un cambio retire beneficios o datos dependientes antes de consolidar el nuevo estado.

## CAPÍTULO 12. PALETA

La interfaz utilizará exclusivamente:

- rojo Smart para identidad, acción principal y selección controlada;
- blanco como superficie dominante;
- grises para fondos, divisores, información secundaria y estados neutrales;
- negro o gris casi negro para texto principal;
- verde únicamente para éxito confirmado y reconciliación correcta.

Reglas:

- La pantalla tendrá predominio de blanco y amplio espacio negativo.
- El rojo no cubrirá grandes superficies ni se usará para todos los títulos.
- Los fondos grises separarán regiones sin crear cajas innecesarias.
- El verde no representará ahorro por defecto si puede confundirse con confirmación; su uso deberá ser consistente.
- Los estados nunca dependerán únicamente del color: incluirán texto, forma o icono.
- Todo par texto-fondo deberá cumplir contraste WCAG AA como mínimo.
- No se añadirán azules, degradados multicolor, amarillos decorativos ni sombras intensas.
- Los valores exactos del rojo y del logotipo deberán provenir de la identidad oficial; no se inventarán en esta fase.

## CAPÍTULO 13. TIPOGRAFÍA

La tipografía será de sistema para garantizar funcionamiento local, carga inmediata y consistencia. No dependerá de fuentes web ni recursos externos.

Jerarquía recomendada:

- título de pantalla: 28–32 px en computador, 24–28 px en celular;
- pregunta principal: 22–26 px;
- título de tarjeta: 16–18 px con peso seminegrita;
- texto de interfaz: 15–16 px;
- texto secundario: 13–14 px, nunca inferior a 12 px;
- valor final: 32–42 px en computador, 28–36 px en celular;
- valores financieros secundarios: 18–24 px;
- etiquetas: 12–13 px con contraste suficiente y sin abuso de mayúsculas.

Orden visual del resultado:

1. Valor final.
2. Beneficios seleccionados.
3. Programa.

Reglas de composición:

- Interlineado de 1.4 a 1.6 para texto corriente.
- Líneas cortas y frases directas.
- Alineación consistente de cifras financieras.
- Números tabulares cuando la fuente del sistema los soporte.
- No usar mayúsculas sostenidas en párrafos.
- No comunicar jerarquía únicamente mediante peso tipográfico.
- Mantener separaciones basadas en una escala uniforme de 4 u 8 píxeles.

## CAPÍTULO 14. ICONOGRAFÍA

Los iconos serán modernos, minimalistas y corporativos. Deberán pertenecer a una única familia visual y funcionar sin internet.

Características:

- trazos simples y consistentes;
- geometría reconocible;
- tamaño mínimo que mantenga legibilidad;
- apariencia sobria, sin ilustraciones caricaturescas;
- uso funcional para navegación, estado o comprensión;
- texto accesible o etiqueta visible cuando la interpretación pueda ser ambigua.

Usos apropiados:

- marca de paso completado;
- edición de una selección;
- calendario y fechas;
- estado de validación;
- expansión del resumen;
- advertencia o información;
- tipo de beneficio, siempre acompañado por su nombre.

Usos prohibidos:

- sustituir nombres oficiales por símbolos;
- utilizar emojis como iconografía principal;
- mezclar familias de iconos;
- decorar todas las tarjetas sin aportar significado;
- depender de iconos remotos, CDN o fuentes externas;
- usar un icono de descarga como acción principal de la propuesta.

Los recursos deberán integrarse localmente. No se crearán ni modificarán logotipos; se usará el archivo oficial previsto cuando exista y, hasta entonces, la identidad textual autorizada.

## CAPÍTULO 15. CHECKLIST UX

Antes de construir la interfaz deberán validarse, como mínimo, los siguientes criterios:

### Comprensión y orientación

- [ ] 1. Un asesor entiende el propósito de la pantalla sin capacitación.
- [ ] 2. El usuario identifica qué debe hacer en menos de cinco segundos.
- [ ] 3. El paso actual siempre es evidente.
- [ ] 4. El progreso total siempre es visible.
- [ ] 5. Los pasos completados se distinguen sin depender solo del color.
- [ ] 6. Los pasos pendientes no parecen errores.
- [ ] 7. Existe una única acción principal por pantalla.
- [ ] 8. La etiqueta de la acción principal describe su resultado.
- [ ] 9. El usuario puede volver a una selección anterior.
- [ ] 10. Volver no elimina datos independientes.

### Flujo y reglas comerciales

- [ ] 11. Smart Online y Smart Flex aparecen con sus nombres oficiales.
- [ ] 12. Smart Online no solicita nivel de ingreso.
- [ ] 13. Smart Online no muestra Score, MP ni horas.
- [ ] 14. Smart Flex solicita nivel de ingreso antes de la modalidad comercial.
- [ ] 15. SCORE y MP se presentan como tarjetas cuando ambas opciones existen.
- [ ] 16. Los planes Smart Flex dependen del nivel y de la modalidad comercial.
- [ ] 17. Nunca aparecen nombres internos del Excel.
- [ ] 18. Las condiciones comerciales conservan el orden oficial.
- [ ] 19. Nunca aparecen combinaciones inexistentes.
- [ ] 20. Cambiar una selección limpia únicamente sus dependencias.
- [ ] 21. No existe ninguna preselección que pueda alterar una decisión comercial.
- [ ] 22. Las opciones no disponibles no se inventan ni se sustituyen.
- [ ] 23. Los pasos financieros condicionales aparecen solo cuando corresponden.
- [ ] 24. Pago único no muestra segunda fecha ni amortización.
- [ ] 25. La financiación no permite continuar con datos incompletos o inválidos.

### Datos y resultados

- [ ] 26. El resumen lateral se actualiza en tiempo real.
- [ ] 27. El valor final permanece visible durante el recorrido.
- [ ] 28. El valor final es el elemento visual más importante.
- [ ] 29. Valor de lista, descuento, ahorro y valor final tienen etiquetas inequívocas.
- [ ] 30. Los importes conservan los centavos oficiales cuando existen.
- [ ] 31. No se muestran decimales `,00` innecesarios.
- [ ] 32. La suma del plan de pagos reconcilia exactamente con el total oficial.
- [ ] 33. La última cuota identifica el ajuste de cierre cuando corresponde.
- [ ] 34. Las fechas de las cuotas se muestran en orden cronológico.
- [ ] 35. No se presentan datos técnicos o trazabilidad interna al asesor.

### Beneficios y cierre

- [ ] 36. Nunca aparecen beneficios inválidos, vencidos o inactivos.
- [ ] 37. Un beneficio previsto pero no aprobado no se muestra.
- [ ] 38. Los beneficios opcionales no se seleccionan automáticamente.
- [ ] 39. Cada beneficio se representa como una tarjeta comprensible.
- [ ] 40. El asesor distingue entre beneficio disponible y seleccionado.
- [ ] 41. El resumen muestra únicamente beneficios seleccionados.
- [ ] 42. La propuesta incluye únicamente beneficios confirmados y vigentes.
- [ ] 43. El sistema permite continuar cuando no existen beneficios activos.
- [ ] 44. La redacción evita presión, promesas y exageraciones.
- [ ] 45. `Preparar Propuesta Comercial` reemplaza a imprimir o descargar como acción principal.
- [ ] 46. Siempre existe una vista previa antes de imprimir.
- [ ] 47. La vista previa diferencia la propuesta de una factura o contrato.
- [ ] 48. Los datos obligatorios de cliente y asesor se validan antes de preparar la propuesta.

### Diseño visual y responsive

- [ ] 49. No existen pantallas saturadas.
- [ ] 50. Las tarjetas mantienen una jerarquía consistente.
- [ ] 51. Cuando hay dos opciones no se utiliza un combo.
- [ ] 52. La interfaz conserva suficiente espacio en blanco.
- [ ] 53. El rojo Smart no domina superficies extensas.
- [ ] 54. El verde se reserva para éxito confirmado.
- [ ] 55. No se incorporan colores fuera de la paleta autorizada.
- [ ] 56. En celular no existe desplazamiento horizontal.
- [ ] 57. El resumen móvil mantiene visible el valor final.
- [ ] 58. Las tarjetas táctiles tienen un área mínima de 44 por 44 píxeles.
- [ ] 59. El plan de pagos es legible en computador, tablet y celular.
- [ ] 60. La vista previa puede leerse desde un celular sin perder jerarquía.

### Accesibilidad e interacción

- [ ] 61. Toda función puede operarse con teclado.
- [ ] 62. El foco siempre es visible.
- [ ] 63. El orden del foco coincide con el orden visual y lógico.
- [ ] 64. Cada control tiene nombre accesible.
- [ ] 65. Los estados no dependen únicamente del color.
- [ ] 66. El contraste de texto y controles cumple WCAG AA.
- [ ] 67. Los mensajes de error explican cómo corregir el problema.
- [ ] 68. El foco llega al primer error al intentar continuar.
- [ ] 69. El avance automático mueve el foco al nuevo título de manera controlada.
- [ ] 70. Las animaciones respetan la preferencia de movimiento reducido.
- [ ] 71. Hover no contiene información indispensable.
- [ ] 72. Los iconos significativos cuentan con texto o etiqueta accesible.

### Rendimiento, seguridad y calidad

- [ ] 73. La experiencia funciona completamente sin internet.
- [ ] 74. Ningún componente depende de CDN, API, servidor o fuente remota.
- [ ] 75. La aplicación abre mediante doble clic en `index.html`.
- [ ] 76. No se almacena información de clientes fuera del alcance autorizado.
- [ ] 77. Los datos introducidos se presentan como texto y no pueden inyectar contenido ejecutable.
- [ ] 78. Una reevaluación nunca muestra temporalmente una tarifa anterior como vigente.
- [ ] 79. Los errores del motor se comunican sin revelar estructuras internas.
- [ ] 80. El recorrido principal funciona en los navegadores objetivo definidos para el proyecto.
- [ ] 81. La navegación no requiere precisión de ratón ni gestos ocultos.
- [ ] 82. Las microinteracciones no retrasan el trabajo del asesor.
- [ ] 83. El diseño admite catálogos futuros sin perder claridad.
- [ ] 84. El resultado visual coincide con las reglas de `PRODUCT_DECISIONS.md`.
- [ ] 85. La elegibilidad de beneficios coincide con `COMMERCIAL_ENGINE.md`.
- [ ] 86. La propuesta coincide con `PDF_DESIGN_SPEC.md`.
- [ ] 87. No se modifican tarifas, descuentos ni cálculos por razones visuales.
- [ ] 88. QA valida casos válidos, inválidos, límites y cambios de dependencias.
- [ ] 89. No quedan hallazgos críticos antes de iniciar implementación.
- [ ] 90. Un asesor completa una cotización de prueba sin ayuda externa y sin perderse.
