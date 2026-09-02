# ARQUITECTURA DEL PROYECTO

Este documento define la arquitectura oficial de CALCULADORA COMERCIAL SMART 2026. La solución será una aplicación web estática, ejecutable completamente de forma local mediante doble clic en `index.html`, sin servidores, bases de datos, APIs, servicios externos ni conexión a internet.

# 1. Estructura de carpetas

La organización prevista del proyecto será la siguiente:

```text
CALCULADORA_COMERCIAL_SMART_2026/
├── index.html
├── AGENTS.md
├── PRD.md
├── ARQUITECTURA.md
├── README.md
├── REPORTE_VALIDACION.md
├── css/
│   ├── estilos.css
│   ├── impresion.css
│   └── propuesta.css
├── js/
│   ├── tarifas.js
│   ├── aplicacion.js
│   ├── validaciones.js
│   ├── plan-pagos.js
│   ├── impresion.js
│   └── propuesta.js
├── assets/
│   ├── imagenes/
│   ├── iconos/
│   └── fuentes/
├── scripts/
│   ├── extraccion_tarifas.*
│   └── validacion_tarifas.*
├── docs/
│   ├── DICCIONARIO_DATOS.md
│   ├── REGLAS_COMERCIALES.md
│   └── HISTORIAL_CAMBIOS.md
└── ORIGINALES_NO_MODIFICAR/
    ├── Tarifas Smart Online.xlsx.xlsx
    ├── Tarifas Smart Flex - 2026 - MP.xlsx.xlsx
    └── Tarifas Smart Flex - 2026 - Score.xlsx.xlsx
```

La extensión definitiva de los archivos ubicados en `scripts/` se decidirá durante la fase de implementación, después de revisar las herramientas disponibles en el entorno. Estos scripts serán exclusivamente herramientas de preparación y validación; nunca serán necesarios para que el asesor ejecute la aplicación.

La carpeta `ORIGINALES_NO_MODIFICAR/` será una fuente protegida de consulta. Sus archivos no se modificarán, sobrescribirán ni eliminarán. La estructura podrá ampliarse con nuevos documentos o recursos cuando exista una necesidad confirmada, pero se mantendrá la separación entre aplicación, datos, recursos, herramientas y documentación.

# 2. Responsabilidad de cada archivo

## Archivos principales

- `index.html`: será el único punto de entrada de la aplicación. Definirá la estructura semántica de la interfaz, enlazará los estilos y cargará los archivos JavaScript locales en el orden requerido. No contendrá tarifas escritas manualmente ni lógica comercial compleja.
- `AGENTS.md`: conservará las reglas obligatorias y permanentes que deben seguirse durante todo el proyecto.
- `PRD.md`: contendrá los requisitos generales, el objetivo, los usuarios, los beneficios y el alcance del producto.
- `ARQUITECTURA.md`: será la guía oficial de organización, responsabilidades, flujos y decisiones estructurales del proyecto.
- `README.md`: explicará cómo abrir la aplicación, cómo usarla, qué navegadores locales son compatibles y cómo actualizar los datos de manera controlada.
- `REPORTE_VALIDACION.md`: registrará las pruebas realizadas contra los Excel originales, los conteos de registros, los resultados, las diferencias encontradas y las incidencias pendientes. Ninguna inconsistencia se resolverá inventando información.

## Estilos

- `css/estilos.css`: contendrá el sistema visual general, incluyendo colores, tipografía, espaciado, componentes, estados, diseño adaptable y reglas de accesibilidad visual.
- `css/impresion.css`: contendrá exclusivamente las reglas aplicadas al imprimir o guardar la cotización como PDF. Ocultará controles innecesarios y organizará el documento para papel.
- `css/propuesta.css`: define la vista previa responsive, las dos páginas editoriales A4 y sus reglas exclusivas de impresión.

## Lógica y datos

- `js/tarifas.js`: será el catálogo local y versionado de tarifas oficiales transformadas desde los Excel. Contendrá datos estructurados y metadatos de trazabilidad, pero no manejará eventos de la interfaz.
- `js/aplicacion.js`: coordinará el estado de la cotización, el flujo progresivo de selección, la actualización de la interfaz y la presentación del resultado. Consumirá los datos de `tarifas.js` y delegará validaciones e impresión.
- `js/validaciones.js`: centralizará las reglas que determinan si una selección o combinación existe en el catálogo oficial. Evitará que la interfaz y los cálculos mantengan reglas duplicadas.
- `js/plan-pagos.js`: contendrá las funciones puras de validación de primera cuota, rango de fechas, calendario mensual y amortización exacta en pesos. Aplicará el residuo de redondeo en la última cuota.
- `js/impresion.js`: preparará la vista imprimible, verificará que la cotización esté completa y solicitará al navegador la impresión o el guardado como PDF.
- `js/propuesta.js`: recibe la cotización ya validada, administra datos temporales de cliente y asesor, renderiza la vista previa y solicita la impresión sin recalcular importes.

## Recursos

- `assets/imagenes/`: almacenará únicamente imágenes locales necesarias para la experiencia o identidad visual.
- `assets/iconos/`: contendrá iconos locales y funcionales. No dependerá de bibliotecas o repositorios externos.
- `assets/fuentes/`: contendrá fuentes locales solamente si su uso está autorizado y resulta necesario. La aplicación tendrá alternativas tipográficas del sistema.

## Herramientas de preparación

- `scripts/extraccion_tarifas.*`: transformará los datos aprobados de los libros Excel en la estructura controlada de `js/tarifas.js`. No editará los archivos fuente.
- `scripts/validacion_tarifas.*`: comparará el resultado transformado con los datos de origen y producirá evidencia para `REPORTE_VALIDACION.md`.

Los scripts no formarán parte del flujo de ejecución del asesor. La aplicación publicada seguirá funcionando abriendo `index.html` sin instalar programas y sin ejecutar procesos adicionales.

## Documentación complementaria

- `docs/DICCIONARIO_DATOS.md`: describirá cada campo del catálogo, su significado, formato, obligatoriedad y procedencia.
- `docs/REGLAS_COMERCIALES.md`: documentará únicamente reglas comerciales confirmadas en las fuentes oficiales.
- `docs/HISTORIAL_CAMBIOS.md`: registrará actualizaciones de tarifas, campañas, estructura y versiones publicadas.
- `ORIGINALES_NO_MODIFICAR/`: conservará los Excel oficiales intactos como fuente de verdad y evidencia para las validaciones.

# 3. Flujo completo de la aplicación

1. El asesor abrirá `index.html` mediante doble clic.
2. El navegador cargará todos los archivos locales necesarios: estructura, estilos, catálogo de tarifas y lógica de la aplicación.
3. La aplicación realizará una verificación inicial del catálogo. Si los datos no están disponibles o su estructura es inválida, mostrará un mensaje claro y bloqueará la generación de cotizaciones.
4. El asesor iniciará una nueva cotización y seleccionará la línea de estudio: Smart Online o Smart Flex.
5. Para Smart Flex, el asesor seleccionará el nivel de ingreso del estudiante. Esta es una variable comercial necesaria para determinar correctamente los planes y tarifas disponibles.
6. Para Smart Flex, el asesor elegirá visiblemente `Tarifas Score` o `Tarifas MP`. La aplicación mostrará únicamente los planes compatibles con la línea, el nivel de ingreso y el tipo de tarifa.
7. El asesor seleccionará la condición comercial, la forma de pago y el número de cuotas entre las opciones válidas que ofrezca el catálogo. Si la opción es financiada, podrá aumentar la primera cuota desde el mínimo oficial expresado en pesos enteros.
8. Cada nueva selección filtrará automáticamente las opciones posteriores. Si una selección anterior deja de ser compatible, las dependencias posteriores se limpiarán para impedir combinaciones inexistentes.
9. Score y MP son tipos de tarifa visibles para Smart Flex. El archivo, la hoja, el bloque y la modalidad de origen continuarán siendo internos; conceptos como Flex Pack, Nivel a Nivel o Modelo Actual nunca se expondrán al asesor.
10. Cuando la combinación esté completa, la aplicación localizará un único registro oficial en el catálogo.
11. La fecha de cotización será también la fecha del primer pago y el inicio del servicio. En financiación, la segunda fecha deberá quedar entre 30 y 40 días después; las siguientes conservarán su día o usarán el último día de los meses cortos.
12. El motor restará la primera cuota seleccionada del total oficial y repartirá el saldo entre las cuotas pendientes. Trabajará internamente en centavos enteros, presentará las cuotas intermedias en pesos enteros y trasladará cualquier residuo a la última cuota, comprobando que la suma sea exactamente el total oficial.
13. Se presentará un resumen comercial y, cuando corresponda, una tabla completa de plan de pagos.
14. El asesor revisará la cotización. Los campos faltantes o inválidos estarán identificados y la acción de impresión permanecerá bloqueada mientras exista algún error.
15. El asesor activará la opción de imprimir o guardar como PDF.
16. La aplicación preparará una vista limpia de la cotización, incluido el plan de pagos, y abrirá el cuadro de impresión del navegador.
17. Desde ese cuadro, el asesor podrá seleccionar una impresora física o la opción local de guardar como PDF.
18. Al finalizar, la aplicación conservará la cotización visible mientras la página permanezca abierta. No almacenará información de clientes ni enviará datos fuera del equipo.

# 4. Arquitectura del frontend

La arquitectura del frontend seguirá una separación estricta de responsabilidades:

- HTML definirá el contenido, el orden de lectura, los formularios, los controles, las regiones de mensajes y el resumen de la cotización.
- CSS controlará la apariencia, la distribución, los estados visuales, la adaptación a distintos tamaños de pantalla y la presentación impresa.
- JavaScript administrará el catálogo, el estado temporal de la cotización, las dependencias entre opciones, las validaciones, el cálculo derivado de datos oficiales y la impresión.

La carga seguirá este orden lógico:

1. El navegador interpretará `index.html`.
2. `index.html` aplicará `css/estilos.css`, `css/impresion.css` y `css/propuesta.css` desde rutas locales.
3. `js/tarifas.js` expondrá el catálogo oficial ya preparado.
4. `js/validaciones.js`, `js/plan-pagos.js`, `js/impresion.js` y `js/propuesta.js` expondrán funciones especializadas sin iniciar por sí mismas la interfaz.
5. `js/aplicacion.js` iniciará la aplicación cuando el documento esté listo.

La aplicación mantendrá un único estado temporal de cotización. La interfaz se representará a partir de ese estado y nunca será considerada la fuente de verdad de las tarifas. La lógica principal consultará siempre el catálogo preparado en `tarifas.js`.

Para asegurar la ejecución mediante `file://`, la implementación evitará mecanismos que requieran un servidor local. Todos los recursos serán relativos al proyecto, estarán disponibles sin internet y serán compatibles con la apertura directa de `index.html`.

# 5. Arquitectura de los datos

El recorrido de los datos será controlado y unidireccional:

```text
Excel oficiales inmutables
        ↓
Extracción de solo lectura
        ↓
Normalización documentada
        ↓
Validaciones de integridad y consistencia
        ↓
Generación de js/tarifas.js
        ↓
Validación cruzada contra los Excel
        ↓
Consumo local por la aplicación
```

Los Excel ubicados en `ORIGINALES_NO_MODIFICAR/` serán la fuente de verdad. Antes de crear el catálogo se documentarán las hojas, columnas, tipos de valores, unidades, vigencias, categorías y relaciones encontradas. La extracción será de solo lectura.

La normalización convertirá las diferencias de formato en una estructura común sin cambiar el significado comercial. Cada tarifa deberá conservar suficiente trazabilidad para identificar su archivo, hoja y ubicación o referencia de origen. También incluirá identificadores estables, producto, dimensiones de selección, valores, vigencia, campaña y estado cuando esos datos existan y estén confirmados en los Excel.

`tarifas.js` será un artefacto generado y versionado, no una transcripción manual. Separará metadatos del catálogo, listas de opciones y registros de tarifas. La lógica no dependerá de posiciones visuales de filas o columnas de Excel.

Antes de publicar una actualización se comprobarán, como mínimo:

- cantidad de registros extraídos y generados;
- presencia de campos obligatorios;
- tipos y formatos esperados;
- duplicados de combinaciones comerciales;
- combinaciones sin tarifa o con más de una tarifa;
- valores no reconocidos;
- trazabilidad hasta el origen;
- coincidencia de importes y condiciones con los Excel.

Toda diferencia se registrará en `REPORTE_VALIDACION.md`. Una inconsistencia bloqueará la publicación de los registros afectados hasta contar con una definición oficial; nunca se completarán valores por suposición.

# 6. Arquitectura de la interfaz

La interfaz se organizará en secciones funcionales y progresivas:

## Encabezado

Identificará la herramienta y mostrará información breve de versión o vigencia del catálogo. No incluirá elementos decorativos que distraigan del proceso comercial.

## Inicio y selección de producto

Permitirá iniciar la cotización y elegir entre las líneas oficiales disponibles. Será el primer paso visible y evitará presentar simultáneamente opciones que todavía no corresponden.

## Configurador guiado

Contendrá los pasos de selección requeridos por el producto elegido. Cada paso aparecerá o se habilitará únicamente cuando sus dependencias estén completas. Las opciones se obtendrán del catálogo y no de listas independientes escritas en la interfaz.

El flujo oficial de Smart Flex será:

1. Línea de estudio.
2. Nivel de ingreso del estudiante.
3. Plan disponible para ese nivel.
4. Condición comercial.
5. Forma de pago.
6. Número de cuotas.
7. Resultado de la cotización.

El nivel de ingreso y el tipo de tarifa Score o MP son dimensiones comerciales públicas de Smart Flex. El archivo, la hoja, el bloque y la modalidad utilizados para resolver la tarifa son dimensiones técnicas privadas del motor de datos.

El flujo de Smart Online omitirá el nivel de ingreso y el tipo de tarifa, no mostrará horas y conservará sus planes de 6, 9 y 12 meses, condiciones, forma de pago y cuotas oficiales.

## Resumen dinámico

Mostrará de forma persistente y legible las decisiones actuales. Se actualizará inmediatamente después de cada cambio y permitirá al asesor detectar una selección equivocada antes de llegar al resultado.

## Resultado comercial

Presentará la combinación oficial encontrada, los importes y las condiciones pertinentes. Distinguirá claramente la información principal de los detalles y advertencias, sin mostrar datos técnicos internos.

## Acciones

Incluirá las acciones indispensables, como reiniciar, corregir e imprimir o guardar como PDF. Las acciones no disponibles tendrán una causa visible y comprensible.

## Mensajes y estados

Mostrará carga inicial, instrucciones, validaciones, ausencia de resultados e inconsistencias del catálogo. Los mensajes serán específicos, útiles y accesibles; no dependerán únicamente del color.

## Vista de impresión

Reorganizará el resumen y el resultado como una cotización profesional. Excluirá controles, ayudas de navegación y elementos que no aporten al documento final.

# 7. Arquitectura de validaciones

Las validaciones operarán en varias capas complementarias:

## Validación del catálogo al iniciar

Comprobará que el catálogo exista, tenga una versión identificable y contenga la estructura mínima requerida. Ante un error crítico, la aplicación se detendrá de forma segura y no mostrará cifras potencialmente incorrectas.

## Validación progresiva de selecciones

Cada control obtendrá sus opciones a partir de los registros compatibles con las selecciones anteriores. Esto impedirá elegir valores que no formen parte de una combinación oficial.

## Validación de dependencias

Cuando cambie una selección superior, se revisarán todas las selecciones dependientes. Las que hayan dejado de ser válidas se limpiarán y sus controles se actualizarán antes de calcular un resultado.

## Validación de combinación final

Una cotización completa deberá corresponder exactamente a un registro oficial. Cero coincidencias significará una combinación inexistente o un problema de datos. Más de una coincidencia significará una ambigüedad. En ambos casos se bloqueará la presentación de una tarifa como definitiva.

## Validación de valores

Los importes y demás datos numéricos deberán ser valores válidos provenientes del catálogo. El formato monetario será únicamente de presentación; la lógica no calculará a partir de textos formateados.

## Validación previa a impresión

Antes de imprimir se verificará nuevamente que todos los pasos obligatorios estén completos, que exista una única tarifa y que el resumen visible corresponda al estado actual.

## Manejo de errores

Los errores se expresarán en lenguaje claro y orientarán al asesor sobre cómo continuar. No se sustituirán tarifas faltantes por cero, valores anteriores, promedios ni estimaciones. Los errores de origen o ambigüedades se documentarán para revisión.

# 8. Arquitectura de impresión

La impresión utilizará las capacidades nativas del navegador y no requerirá librerías externas, servicios de generación de documentos ni conexión a internet.

El flujo será el siguiente:

1. El asesor solicitará imprimir la cotización.
2. `js/impresion.js` ejecutará la validación final.
3. La aplicación completará una sección imprimible con una copia coherente del resumen vigente.
4. `css/impresion.css` ocultará navegación, formularios y botones, y aplicará dimensiones, márgenes, jerarquías y saltos apropiados para papel.
5. El navegador abrirá su cuadro de impresión.
6. El asesor elegirá imprimir o guardar como PDF mediante la opción disponible en el sistema.

El documento incluirá solamente información comercial confirmada, la identificación del producto, las selecciones, la tarifa, las condiciones relevantes y los metadatos de vigencia necesarios. No incluirá datos técnicos ni información de clientes almacenada por la aplicación.

La vista en pantalla y la vista impresa compartirán la misma fuente de datos y el mismo estado validado. No habrá una segunda lógica de cálculo para impresión. Se realizarán pruebas específicas de legibilidad, recortes, saltos de página, orientación, tamaño de papel y salida PDF en los navegadores definidos como compatibles.

# 9. Escalabilidad

La arquitectura separará las reglas de navegación de los registros comerciales. Las campañas no se programarán mediante condiciones dispersas en `aplicacion.js`; se representarán como datos estructurados dentro del catálogo cuando estén respaldadas por una fuente oficial.

Para agregar una futura campaña se seguirá este proceso:

1. Incorporar o identificar el Excel oficial correspondiente sin alterar los originales existentes.
2. Revisar y documentar su estructura y sus reglas confirmadas.
3. Ejecutar el proceso de extracción y normalización.
4. Asignar identificadores, vigencia y dimensiones comerciales consistentes.
5. Regenerar `js/tarifas.js`.
6. Ejecutar las validaciones automáticas y la comparación contra las fuentes.
7. Registrar resultados e incidencias en `REPORTE_VALIDACION.md`.
8. Actualizar la versión y el historial del catálogo.
9. Publicar el conjunto estático validado.

Mientras la nueva campaña utilice dimensiones ya contempladas, su incorporación no requerirá cambios en la lógica principal. Si introduce una dimensión comercial nueva, esta se agregará mediante componentes y reglas centralizadas, evitando modificar cálculos o controles no relacionados.

El catálogo permitirá mantener varias campañas y vigencias de forma explícita. La aplicación filtrará únicamente las opciones autorizadas para el contexto seleccionado y no decidirá por sí sola cuál campaña sustituye a otra sin una regla oficial.

La separación entre `tarifas.js`, `validaciones.js`, `aplicacion.js` e `impresion.js` permitirá evolucionar datos, reglas, interacción y salida impresa de forma independiente. La documentación de datos, reglas y cambios asegurará que cada ampliación sea trazable, verificable y mantenible sin comprometer la operación local.
