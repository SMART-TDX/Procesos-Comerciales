# UX DESIGN SPEC

## CALCULADORA COMERCIAL SMART 2026

Versión: Sprint 2 — Especificación de experiencia de producto  
Estado: Guía oficial previa a implementación

# 1. VISIÓN DEL PRODUCTO

La Calculadora Comercial Smart es una herramienta de apoyo a la venta consultiva. Su función no termina al localizar una tarifa: debe ayudar al asesor a conducir una conversación comercial, explicar el valor del programa y presentar una propuesta confiable con rapidez.

Existen dos destinatarios diferentes:

- El cliente de la aplicación es el asesor comercial. Necesita velocidad, control, prevención de errores y respuestas claras mientras conversa con una persona interesada.
- El cliente de la propuesta PDF es el posible estudiante. Necesita entender qué programa se le ofrece, qué obtiene, cuánto paga, cómo paga y cuál es el siguiente paso.

La experiencia debe transformar información tarifaria compleja en una decisión comercial sencilla sin ocultar condiciones relevantes ni alterar valores oficiales. Debe sentirse como una herramienta corporativa de Smart, no como una calculadora genérica, un formulario administrativo o una versión visual de Excel.

El resultado esperado es que el asesor pueda construir una cotización correcta durante una llamada, revisarla de un vistazo y convertirla en una propuesta que refuerce la confianza del posible estudiante.

## 1.1. Promesa de experiencia

“Encuentra la opción oficial correcta, explícala con seguridad y entrega una propuesta clara en pocos minutos.”

## 1.2. Criterios de éxito

- Un asesor nuevo entiende el flujo sin capacitación formal en menos de cinco minutos.
- Una combinación inválida no puede avanzar hasta convertirse en cotización.
- El asesor distingue en todo momento qué decisión está tomando y qué falta.
- Los importes principales pueden verificarse sin leer toda la pantalla.
- El posible estudiante comprende la propuesta sin conocer la estructura tarifaria interna.
- La aplicación y el PDF mantienen la misma información comercial validada.

# 2. PRINCIPIOS DE DISEÑO

## 2.1. Menos clics

Las decisiones frecuentes deben resolverse con controles directos. No se agregarán pantallas, confirmaciones o ventanas que no reduzcan riesgo. Una selección debe actualizar inmediatamente las opciones dependientes.

## 2.2. Menos errores

La interfaz no debe permitir elegir opciones inexistentes. Es preferible impedir el error mediante filtrado y estados deshabilitados que explicarlo después mediante una alerta.

## 2.3. Menos lectura

Los textos serán breves, orientados a la acción y ubicados junto a la decisión que explican. Se usará divulgación progresiva para detalles, condiciones y tablas extensas.

## 2.4. Más decisiones guiadas

Cada paso presentará solo las opciones válidas y explicará su consecuencia inmediata. El asesor nunca deberá interpretar nombres internos de Excel.

## 2.5. Más velocidad

La aplicación priorizará la selección, comparación visual dentro del paso actual y lectura inmediata del resultado. Los datos ya elegidos permanecerán visibles de forma compacta.

## 2.6. Más claridad

La jerarquía visual diferenciará entrada, resultado, ayuda, advertencia y error. Cada pantalla o estado tendrá un objetivo dominante y una acción principal.

## 2.7. Más confianza

Se mostrarán señales verificables: tarifa oficial 2026, valor final, ahorro, forma de pago y suma del plan. La confianza no dependerá de decoración, sino de consistencia, lenguaje preciso y ausencia de sorpresas.

## 2.8. Reglas transversales

- Nunca saturar la interfaz.
- No usar componentes decorativos sin función.
- No revelar hojas, bloques, modalidades o identificadores internos.
- No inventar beneficios, condiciones legales, vigencias ni mensajes comerciales.
- No depender solamente del color para comunicar estados.
- Mantener funcionamiento local, sin internet ni persistencia de datos personales.

# 3. FLUJO COMPLETO DE NAVEGACIÓN

## 3.1. Pantalla inicial

Objetivo: iniciar una cotización con seguridad.

Contenido esencial:

- identificación Smart;
- título orientado a la tarea;
- indicación discreta de funcionamiento local;
- selector dominante de línea de estudio;
- panel de resultado en estado vacío con una instrucción breve.

La primera decisión debe ser visible sin desplazamiento en desktop, tablet y celular.

## 3.2. Selección de línea

Opciones oficiales:

- Smart Online.
- Smart Flex.

La selección define el flujo completo. Al cambiarla, la aplicación debe limpiar decisiones posteriores, conservar solamente datos generales compatibles y explicar de forma breve que la configuración dependiente fue reiniciada.

## 3.3. Bifurcación

```text
Inicio
  ↓
Línea de estudio
  ├─ Smart Online
  │    └─ Duración → condición → pago → cuotas → fechas → resumen
  └─ Smart Flex
       └─ Nivel → Score/MP → plan → condición → pago → cuotas → primera cuota → fechas → plan de pagos → resumen
```

## 3.4. Patrón de avance

El flujo es progresivo dentro de una sola experiencia continua:

1. El paso actual está abierto y enfatizado.
2. Los pasos futuros permanecen ocultos hasta ser relevantes.
3. Los pasos completados se comprimen en un resumen editable.
4. El resultado se actualiza cuando la combinación es completa y válida.
5. Cambiar un paso anterior limpia solo sus dependencias, nunca valores independientes.
6. El foco se dirige al primer paso que requiere atención, sin saltos bruscos de pantalla.

## 3.5. Preparación de propuesta

Una vez validada la cotización, el asesor podrá preparar la propuesta. Los datos de cliente y asesor se considerarán información temporal de la sesión: no se guardarán, no se enviarán y desaparecerán al cerrar o recargar la página. Antes de implementar esta captura deben definirse los campos mínimos y aprobarse los textos institucionales.

# 4. EXPERIENCIA SMART FLEX

## Paso 1. Línea de estudio

El asesor elige Smart Flex. La interfaz confirma la línea y presenta el nivel de ingreso como siguiente decisión. No aparecen todavía planes, condiciones o pagos.

## Paso 2. Nivel de ingreso

Mostrar solo niveles presentes en el catálogo oficial y ordenarlos pedagógicamente: A1, A2, B1, B2, C1 y cualquier nivel futuro confirmado.

El control debe explicar que el nivel determina los planes disponibles. No debe sugerir que la herramienta reemplaza una prueba de clasificación.

Al cambiar el nivel:

- se conservan la línea y la información general de la propuesta;
- se limpian tipo de tarifa, plan, condición, pago, cuotas, primera cuota y fechas dependientes;
- se actualizan los tipos de tarifa realmente disponibles.

## Paso 3. Tipo de tarifa

Opciones visibles:

- Score.
- MP.

La etiqueta del campo será “Tipo de tarifa”. Los nombres internos Flex Pack, Nivel a Nivel y Modelo Actual quedan prohibidos en interfaz y propuesta.

La selección debe usar dos opciones claramente comparables, preferiblemente tarjetas de elección o un selector segmentado cuando ambas estén disponibles. No se debe explicar una diferencia comercial entre Score y MP hasta contar con contenido oficial aprobado.

Al cambiar el tipo de tarifa se limpian plan y decisiones posteriores.

## Paso 4. Tipo de plan

Mostrar exclusivamente planes compatibles con nivel y tipo de tarifa. Cada opción debe ofrecer una etiqueta primaria breve y metadatos secundarios:

- niveles incluidos;
- horas de formación;
- cantidad de niveles cuando aporte claridad.

Los textos largos provenientes del Excel deben transformarse en una presentación legible sin modificar cifras ni significado. El plan seleccionado genera una ficha compacta que permanece visible durante los pasos comerciales.

Al cambiar el plan se limpian condición, pago, cuotas, primera cuota y fechas.

## Paso 5. Condición comercial

Mostrar solo condiciones oficiales de la combinación y respetar la jerarquía comercial:

1. Público.
2. Alianza masiva.
3. Alianza empresarial.
4. Preventa, cuando esté oficialmente disponible.
5. Colaborador.

MP nunca mostrará Preventa. La interfaz no debe recomendar una condición sin evidencia de elegibilidad. Cuando existan descuentos, puede mostrarse su efecto después de seleccionar la condición, sin convertir la pantalla en un comparador.

Al cambiar la condición se limpian forma de pago y decisiones posteriores.

## Paso 6. Forma de pago

Opciones según tarifa:

- Pago único.
- Financiado.

El pago único debe comunicar simplicidad y valor total. Financiado debe anticipar que se solicitará número de cuotas y primera cuota. No mostrar alternativas inexistentes.

Al cambiar la forma de pago se limpian cuotas, primera cuota y segunda fecha.

## Paso 7. Número de cuotas

Mostrar solamente cantidades oficiales. Las opciones pueden presentarse como botones compactos cuando sean pocas; si son numerosas, usar selector nativo con etiquetas claras.

La elección debe actualizar inmediatamente el pago inicial mínimo y la proyección de pagos. No mostrar una “cuota estimada” que pueda confundirse con el plan exacto.

## Paso 8. Primera cuota

Visible solo en financiación. Debe incluir:

- valor mínimo oficial claramente identificado;
- campo monetario con formato comprensible;
- valor total como límite máximo;
- ayuda: “Puedes aumentar el pago inicial para reducir el valor de las siguientes cuotas.”;
- respuesta inmediata sobre cómo cambia el saldo y las cuotas posteriores.

Los errores deben aparecer junto al campo. Si el valor cubre el total, la interfaz debe confirmar “Contrato pagado completamente” y ocultar la segunda fecha y pagos posteriores.

## Paso 9. Fechas

La fecha principal se denomina “Fecha de cotización y primer pago” y se carga con la fecha actual. Debe explicar que también corresponde al inicio del servicio.

En financiación con saldo pendiente se muestra “Fecha de segunda cuota”. El calendario debe limitar visual y funcionalmente el rango de 30 a 40 días. Debajo se mostrará el intervalo permitido con fechas concretas, no solo la regla abstracta.

Al cambiar la primera fecha, la segunda debe revalidarse. Si deja de ser válida, se limpia o ajusta de forma visible y se solicita confirmación mediante el propio campo, no mediante una ventana modal.

## Paso 10. Plan de pagos

El plan aparece como vista previa después de validar importes y fechas. Debe mostrar:

- número de cuota;
- fecha;
- valor;
- tipo;
- total de control.

La primera y la última cuota requieren mayor jerarquía cuando difieran de las intermedias. Los ajustes de cierre deben nombrarse explícitamente. En pantalla pequeña, cada fila puede convertirse en una tarjeta; no debe depender de desplazamiento horizontal para comprender importes y fechas.

## Paso 11. Resumen

El resumen debe responder en este orden:

1. ¿Qué programa se ofrece?
2. ¿Qué incluye?
3. ¿Cuánto cuesta?
4. ¿Cuánto ahorra?
5. ¿Cómo se paga?
6. ¿Cuál es el siguiente pago?
7. ¿Qué puede hacer ahora el asesor?

Las acciones finales serán claramente diferenciadas: preparar propuesta, copiar resumen y comenzar una nueva cotización. La acción primaria debe ser la que más ayude al cierre comercial.

# 5. EXPERIENCIA SMART ONLINE

Smart Online debe ser un flujo más corto. Nunca mostrará nivel de ingreso, Score, MP ni horas de formación.

## 5.1. Secuencia

1. Línea Smart Online.
2. Duración del acceso: 6, 9 o 12 meses según disponibilidad oficial.
3. Condición comercial, incluidos Convenios cuando corresponda.
4. Forma de pago.
5. Número de cuotas oficial.
6. Primera cuota cuando exista financiación.
7. Fechas.
8. Plan de pagos cuando corresponda.
9. Resumen.

## 5.2. Presentación del plan

La decisión principal debe expresarse como duración de acceso a plataforma:

- 6 meses.
- 9 meses.
- 12 meses.

No utilizar nombres largos del Excel cuando “Acceso por 6 meses” comunique la misma decisión sin perder información. Cualquier nivel incluido puede aparecer en el resumen solo si es información oficial, relevante y no contradice la regla de no solicitar nivel de ingreso.

## 5.3. Cambios de selección

Cambiar la duración limpia condición y pagos. Cambiar condición limpia forma de pago y cuotas. Cambiar forma de pago limpia cuotas, primera cuota y fechas dependientes. Se conservan la línea y los datos temporales de cliente y asesor.

# 6. COMPONENTES VISUALES

## 6.1. Tarjeta de selección

Para decisiones con dos o tres opciones. Incluye título, descripción breve, estado seleccionado y foco. No contiene información promocional sin aprobar.

## 6.2. Selector nativo

Para listas extensas o variables. Incluye etiqueta persistente, opción inicial instructiva, ayuda opcional, error y estado deshabilitado explicable.

## 6.3. Indicador de progreso

Muestra etapa actual y avance significativo, no once números simultáneos. En desktop puede presentar grupos: Programa, Condiciones, Pagos y Propuesta. En celular usa una línea breve como “Paso 3 de 6” calculada según el flujo real.

## 6.4. Badge

Etiqueta compacta para “Tarifa oficial 2026”, “Smart Flex”, “Score”, “MP” o un estado verificado. No debe sustituir títulos ni comunicar errores.

## 6.5. Tooltip o ayuda contextual

Se reserva para aclaraciones secundarias. Toda información necesaria para completar el flujo debe ser visible sin depender de hover. En móvil, la ayuda debe abrirse mediante un control accesible.

## 6.6. Panel de configuración

Contiene el paso activo y el resumen compacto de pasos completados. Debe mantener una anchura de lectura cómoda y evitar formularios visualmente interminables.

## 6.7. Panel de resultado

Presenta programa, valor final, ahorro y pago. No debe usar un fondo tan intenso que dificulte leer tablas extensas. La jerarquía del precio no debe eclipsar condiciones relevantes.

## 6.8. Mensaje de estado

Explica qué falta o confirma una acción. Debe ser breve y cercano al contexto. No repetir instrucciones ya visibles.

## 6.9. Alerta

Se usa para errores de catálogo o condiciones que bloquean la cotización. Incluye causa, consecuencia y acción posible. Nunca muestra trazas técnicas.

## 6.10. Campo monetario

Incluye símbolo, formato local, mínimo, máximo, ayuda y error. No modifica el valor mientras el usuario escribe de manera que desplace inesperadamente el cursor.

## 6.11. Calendario

Utiliza el control local del navegador con etiquetas, intervalo permitido y mensaje de error. No depende de librerías externas.

## 6.12. Tabla de pagos

Usa encabezados semánticos, alineación numérica consistente, énfasis en primera y última cuota, total visible y alternativa responsive en tarjetas.

## 6.13. Resumen comercial

Agrupa información en Programa, Inversión y Pagos. Evita una lista plana de pares etiqueta-valor cuando existan más de seis datos.

## 6.14. Botones

- Primario: una acción dominante por estado.
- Secundario: acciones útiles que no completan el objetivo.
- Terciario: enlaces o acciones de baja prioridad.
- Destructivo: reinicio, siempre nombrado con claridad y sin usar solo un icono.

## 6.15. Estado vacío

Indica el siguiente paso y evita mensajes genéricos. No debe ocupar más espacio que el contenido que reemplaza.

# 7. PALETA DE COLORES

La paleta se basa en rojo Smart, blanco y neutros. Los valores finales deben validarse contra el manual oficial de marca antes de implementarse.

## 7.1. Roles cromáticos

- Rojo de marca: identidad, acción primaria y acentos controlados.
- Rojo oscuro: texto o fondos de alta jerarquía cuando alcance contraste suficiente.
- Blanco: superficies principales y respiración visual.
- Gris 50–100: fondo de aplicación y estados suaves.
- Gris 300–400: bordes y controles deshabilitados.
- Gris 600–700: texto secundario.
- Negro o gris 900: texto principal.
- Verde: confirmaciones y validaciones positivas exclusivamente.
- Amarillo: advertencias exclusivamente, acompañado por texto e icono.
- Rojo semántico: errores o información crítica, diferenciado del rojo de marca por contexto, icono y etiqueta.

## 7.2. Proporción recomendada

- 70 % superficies blancas o muy claras.
- 20 % neutros para estructura y jerarquía.
- 10 % rojo de marca y colores semánticos.

No usar degradados intensos detrás de grandes cantidades de texto o tablas. No utilizar verde como decoración, amarillo como promoción ni más de un color de acento por componente.

# 8. TIPOGRAFÍA

La aplicación usará una familia sans serif del sistema o una fuente local autorizada. No dependerá de fuentes descargadas de internet.

## 8.1. Escala recomendada

| Uso | Desktop | Móvil | Peso | Interlineado |
|---|---:|---:|---:|---:|
| Título principal | 40–48 px | 30–36 px | 700–800 | 1,05–1,15 |
| Título de sección | 24–30 px | 22–26 px | 700 | 1,15–1,25 |
| Título de componente | 18–22 px | 18–20 px | 650–700 | 1,25 |
| Cuerpo principal | 16–18 px | 16 px | 400–500 | 1,5–1,65 |
| Etiqueta de campo | 14–16 px | 15–16 px | 600–700 | 1,35 |
| Ayuda y metadato | 12–14 px | 13–14 px | 400–600 | 1,4–1,5 |
| Precio principal | 40–56 px | 34–42 px | 750–850 | 1 |

## 8.2. Reglas tipográficas

- No usar mayúsculas sostenidas en frases largas.
- Reservar peso 800 para títulos, precios o estados de alta prioridad.
- Mantener líneas de texto entre 45 y 75 caracteres cuando sea posible.
- Alinear importes para facilitar comparación.
- Usar espacio, tamaño y peso antes que color para establecer jerarquía.

# 9. EXPERIENCIA DEL PDF

## 9.1. Propósito

El PDF es una propuesta comercial premium dirigida al posible estudiante. No es una captura de la interfaz, una factura ni una impresión del formulario. Debe poder enviarse y comprenderse de forma independiente.

## 9.2. Arquitectura de contenido

### Encabezado de propuesta

- logo oficial Smart en alta calidad y almacenado localmente;
- título “Propuesta de formación”;
- identificación visual de Smart Online o Smart Flex;
- fecha de propuesta;
- nombre del posible estudiante;
- nombre del asesor.

El logo y cualquier activo de marca deben ser suministrados o aprobados oficialmente. No se reconstruirá el logo mediante texto.

### Resumen del programa

- programa;
- tipo de tarifa Score o MP solo cuando sea comercialmente pertinente para el estudiante;
- nivel de ingreso en Smart Flex;
- plan;
- niveles incluidos;
- horas de formación o meses de acceso, según la línea;
- descripción breve aprobada.

### Beneficios

Presentar entre tres y cinco beneficios verificables, en lenguaje orientado al estudiante. Estos textos deben provenir de contenido institucional aprobado; la aplicación no debe inferir beneficios desde el Excel.

### Inversión

Orden recomendado:

1. Valor de lista.
2. Descuento aplicable.
3. Ahorro.
4. Valor final oficial, con máxima jerarquía.

Si alguno no existe en la fuente, se omite; no se muestra cero ni “No informado” en la propuesta al estudiante sin una decisión comercial.

### Forma de pago

- Pago único o financiado.
- Número total de cuotas.
- Primera cuota seleccionada.
- Valor orientativo de cuotas posteriores.
- Última cuota cuando incluya ajuste.
- Próxima fecha de pago.

### Plan de pagos

Tabla limpia, legible y repetible en varias páginas. La primera cuota y la cuota final se distinguen mediante peso tipográfico y texto, no solo por color. Los centavos oficiales se conservan exactamente.

### Llamado a la acción

Una invitación concreta y aprobada comercialmente, por ejemplo avanzar con el proceso de matrícula o contactar al asesor. El texto definitivo, canal y vigencia deben ser proporcionados por Smart.

### Datos del asesor

- nombre;
- cargo o identificación comercial aprobada;
- teléfono;
- correo corporativo;
- sede o canal, cuando corresponda.

### Observaciones

Campo opcional, breve y controlado. No debe permitir que una nota manual contradiga valores, vigencias o condiciones oficiales.

### Notas legales

Incluir únicamente textos suministrados y aprobados por Smart: vigencia, sujeción a condiciones contractuales y aclaraciones de disponibilidad. Deben ser legibles y no reducirse a un tamaño que impida su lectura.

## 9.3. Composición visual

- Formato base A4 vertical.
- Primera página orientada a programa, beneficios e inversión.
- Segunda página cuando el plan de pagos sea extenso.
- Encabezado y pie consistentes, sin repetir información innecesaria.
- Amplio espacio blanco, alineación estricta y un solo foco visual por bloque.
- Sin fondos oscuros a sangre que consuman tinta o reduzcan legibilidad.
- Evitar cortes de filas, títulos huérfanos y llamados a la acción separados de los datos del asesor.

## 9.4. Datos personales y privacidad

Los datos de cliente y asesor existirán solo en memoria mientras la página permanezca abierta. No se guardarán en archivos, navegador, base de datos ni servicios externos. La interfaz debe advertir de forma discreta que al cerrar se perderán.

## 9.5. Validación previa

Antes de habilitar la propuesta:

- cotización completa y única;
- total y plan reconciliados;
- nombre del cliente y datos mínimos del asesor completos;
- contenido comercial y legal disponible;
- vista previa sin cortes críticos;
- formato monetario y fechas consistentes.

# 10. EXPERIENCIA RESPONSIVE

## 10.1. Desktop

- Configuración y resumen pueden convivir en dos columnas.
- El panel de resultado puede permanecer visible, pero no debe ser sticky si su altura supera la ventana y oculta contenido.
- Ancho máximo controlado para evitar líneas excesivas.
- Plan de pagos utiliza tabla completa.

## 10.2. Tablet

- Una columna principal con resumen compacto persistente o ubicación inmediatamente posterior al paso actual.
- Tarjetas de dos opciones pueden conservar dos columnas.
- Controles con objetivos táctiles amplios.
- La tabla puede reducir columnas secundarias o usar filas expandibles, sin ocultar fecha ni valor.

## 10.3. Celular

- Una sola columna.
- El paso activo aparece primero y el resultado después.
- Botón primario de ancho completo.
- Resumen por secciones plegables, manteniendo visible valor final.
- Plan de pagos en tarjetas verticales o tabla accesible sin depender de desplazamiento lateral.
- No usar paneles sticky altos; como máximo una barra compacta de acción que no cubra contenido.
- Campos de fecha y moneda deben activar teclados adecuados.

## 10.4. Puntos de adaptación

Los breakpoints se elegirán por comportamiento del contenido, no por modelos de dispositivo. Deben probarse como mínimo anchos de 320, 375, 768, 1024 y 1440 px.

# 11. ACCESIBILIDAD

- Contraste mínimo WCAG AA: 4,5:1 para texto normal y 3:1 para texto grande y componentes esenciales.
- Todos los controles deben funcionar con teclado y mostrar foco visible.
- El orden del foco debe seguir el orden comercial del flujo.
- Las etiquetas deben permanecer visibles; los placeholders no las sustituyen.
- Objetivos táctiles recomendados de al menos 44 × 44 px.
- Mensajes dinámicos anunciados mediante regiones apropiadas sin interrumpir cada selección.
- Errores asociados al campo y resumidos solo cuando existan varios bloqueos.
- Tablas con encabezados, título y lectura coherente.
- Iconos acompañados por texto o nombre accesible.
- Estados no comunicados únicamente mediante rojo, verde o amarillo.
- Soporte para ampliación de texto al 200 % sin pérdida funcional.
- Respeto a `prefers-reduced-motion`.
- PDF con orden de lectura lógico, tipografía legible y contraste suficiente; debe evaluarse la accesibilidad real de la salida generada por los navegadores compatibles.

# 12. MICROINTERACCIONES

## 12.1. Aparición de pasos

Transición breve de opacidad y desplazamiento mínimo, entre 120 y 200 ms. No animar grandes recorridos ni retrasar la interacción.

## 12.2. Actualización del resultado

Cuando cambia un importe, resaltar suavemente el bloque actualizado durante un instante. No hacer parpadear el precio ni animar cada dígito.

## 12.3. Carga

Como los datos son locales, la carga debe ser casi inmediata. Solo mostrar indicador si la validación inicial supera un umbral perceptible. Evitar spinners que simulen complejidad inexistente.

## 12.4. Confirmaciones

- Resumen copiado: confirmación discreta y temporal.
- Cotización completa: indicador positivo junto al resumen.
- Reinicio: si existen selecciones avanzadas o datos temporales de cliente, solicitar confirmación contextual; si no, reiniciar directamente.

## 12.5. Errores

El campo conserva el valor para permitir corrección. El mensaje explica límite y acción. No usar vibraciones visuales, modales o mensajes culpabilizantes.

## 12.6. Calendario y pagos

Al aumentar la primera cuota, actualizar saldo y cuotas posteriores sin retraso. La transición debe ayudar a identificar qué cambió, y el total oficial debe permanecer visualmente estable.

# 13. COMPONENTES REUTILIZABLES

| Componente | Reutilización prevista | Variantes |
|---|---|---|
| `AppHeader` | Aplicación y vista previa | normal, compacto |
| `StepContainer` | Cada decisión del flujo | activo, completado, bloqueado |
| `SelectionCard` | Línea, Score/MP, pago | normal, seleccionado, deshabilitado |
| `FieldControl` | Selectores, fechas y moneda | ayuda, error, correcto |
| `ProgressIndicator` | Smart Flex y Online | desktop, móvil |
| `PlanSummary` | Configuración y resultado | compacto, completo |
| `PriceBlock` | Pantalla y propuesta | valor final, ahorro, lista |
| `StatusMessage` | Guía y confirmaciones | informativo, positivo, advertencia, error |
| `PaymentSchedule` | Pantalla, copia y PDF | tabla, tarjetas, impreso |
| `CommercialBadge` | Línea, tarifa, vigencia | neutro, marca, verificado |
| `ActionGroup` | Resultado y propuesta | primario, secundario, terciario |
| `ProposalHeader` | PDF | primera página, continuación |
| `AdvisorCard` | PDF y vista previa | completa, compacta |
| `LegalNotes` | PDF | breve, extendida |
| `EmptyState` | Inicio y resultado incompleto | instrucción, sin disponibilidad |

La reutilización es conceptual y de arquitectura; no implica utilizar frameworks. Los componentes deberán implementarse con HTML, CSS y JavaScript locales, manteniendo responsabilidades claras.

# 14. RECOMENDACIONES DEL PRODUCT DESIGNER

## 14.1. Diagnóstico de la interfaz actual

La interfaz actual tiene buenas bases: flujo progresivo, controles nativos, funcionamiento local, resultado visible, prevención de combinaciones inválidas y una jerarquía inicial clara. Sin embargo, sigue optimizada para completar un formulario y consultar un precio. Todavía no acompaña suficientemente la conversación comercial ni transforma el resultado en una propuesta para el estudiante.

El formulario puede crecer hasta once pasos dentro de un panel continuo sin una visión global del progreso. El resultado usa una gran superficie roja adecuada para impacto inicial, pero menos apropiada para leer muchos datos y un plan de pagos extenso. La tabla, las acciones y el resumen compiten dentro del mismo panel. La salida impresa hereda la estructura operativa y carece de cliente, asesor, narrativa, beneficios, llamado a la acción e identidad oficial mediante logo.

## 14.2. Veinte mejoras prioritarias

1. **Separar cotización y propuesta.** La primera sirve al asesor; la segunda debe hablar al estudiante. Evita que el PDF parezca una captura del sistema.
2. **Convertir la línea de estudio en una elección visual directa.** Dos tarjetas reducen fricción frente a un desplegable de solo dos opciones.
3. **Agrupar el progreso en etapas.** Programa, Condiciones, Pagos y Propuesta ofrecen orientación sin mostrar once pasos simultáneos.
4. **Comprimir pasos completados.** Permite revisar y editar decisiones anteriores sin mantener todo el formulario expandido.
5. **Presentar Score y MP como opciones comparables.** Mejora velocidad y reduce errores de selección, sin inventar diferencias comerciales.
6. **Simplificar las etiquetas de planes.** Separar nombre, niveles y horas evita que textos heredados del Excel saturen el selector.
7. **Mostrar el efecto de la primera cuota en contexto.** Saldo y cuota posterior deben actualizarse junto al campo, no solo en el resumen distante.
8. **Mostrar fechas límite concretas.** “Entre 29/08/2026 y 08/09/2026” exige menos interpretación que una regla de 30–40 días aislada.
9. **Reorganizar el resultado en tres bloques.** Programa, Inversión y Pagos facilitan el escaneo frente a una lista plana.
10. **Reducir la superficie oscura del resultado.** Un fondo claro para detalles y tabla mejora legibilidad, impresión y percepción premium.
11. **Mantener el valor final como ancla estable.** Debe permanecer visible mientras cambian primera cuota y calendario, confirmando que el total oficial no cambia.
12. **Dar tratamiento especial a primera y última cuota.** Ayuda a explicar el pago inicial y cualquier ajuste de cierre sin revisar toda la tabla.
13. **Transformar la tabla en tarjetas en celular.** Evita desplazamiento horizontal y mantiene juntos número, fecha, valor y tipo.
14. **Jerarquizar las acciones finales.** “Preparar propuesta” debe dominar; copiar y reiniciar deben tener menor peso visual.
15. **Capturar datos de cliente y asesor solo al preparar la propuesta.** Evita fricción temprana y cumple la prohibición de almacenamiento.
16. **Diseñar una vista previa de propuesta.** Permite detectar nombres incompletos, cortes y textos faltantes antes de imprimir.
17. **Crear contenido institucional gobernado.** Beneficios, CTA y notas legales deben tener fuente, responsable y aprobación; nunca generarse desde tarifas.
18. **Usar el logo oficial como activo local.** La letra “S” actual funciona como marcador interno, pero no alcanza la calidad de una propuesta corporativa.
19. **Mejorar la confirmación de reinicio.** Solo debe solicitarse cuando se perderá trabajo significativo o información temporal.
20. **Medir el flujo antes de pulir animaciones.** Tiempo hasta cotización, correcciones por paso y comprensión del PDF deben validar el rediseño.

## 14.3. Dependencias antes de implementar

Se requieren decisiones o insumos oficiales para:

- archivo del logo Smart y reglas de uso;
- descripción aprobada de Smart Online y Smart Flex;
- beneficios institucionales por programa;
- texto de llamado a la acción;
- notas legales y vigencia de la propuesta;
- campos obligatorios del cliente;
- datos y firma comercial del asesor;
- criterio sobre si Score/MP debe aparecer en el PDF del estudiante;
- navegadores y configuraciones de impresión que deben soportarse oficialmente.

Sin estos insumos puede implementarse la estructura, pero no debe publicarse contenido comercial o legal provisional como si fuera oficial.

## 14.4. Criterio de aprobación para implementación

Antes de modificar la interfaz, Product, Comercial, Frontend y QA deben aprobar:

- flujo por línea;
- arquitectura de información;
- componentes y jerarquía visual;
- modelo de datos temporales para propuesta;
- contenido institucional;
- maqueta de pantalla en desktop y celular;
- maqueta A4 de propuesta con un plan corto y uno extenso;
- criterios de accesibilidad y pruebas de impresión.

Fin de la especificación.
