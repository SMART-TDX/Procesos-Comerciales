# Arquitectura del sistema

## Alcance

Smart Sales Experience es la capa guiada de diagnóstico y presentación comercial. Smart Sales Hub es la Calculadora Comercial que filtra el catálogo oficial, construye el plan de pagos y genera la cotización imprimible. Ambos son front-end estático: HTML, CSS y JavaScript ejecutados en el navegador. No existe backend, servidor de aplicación ni base de datos en este paquete.

## Conexión entre componentes

`SMART_SALES_EXPERIENCE/index.html` carga la calculadora en un `iframe` con la ruta hermana `../SMART_SALES_HUB_PRODUCCION_FINAL/index.html?embedded=1`. `js/integration.js` y `js/experience-bridge.js` intercambian mensajes mediante `window.postMessage` con los tipos `ready`, `init`, `state`, `quote`, `back`, `close` y `print-quote`.

El contexto enviado incluye cliente, ejecutivo, perfil, criterios de decisión, preferencias de presupuesto, programa recomendado/seleccionado y beneficios favoritos. La calculadora devuelve su estado y la cotización. La Experience conserva la cotización y presenta el cierre o el resumen.

## Estado y persistencia

`js/state.js` define el estado en memoria. `js/session.js` lo guarda en `sessionStorage` bajo `smartSalesExperience:v1:session`. El estado de la calculadora se conserva bajo `smartSalesExperience:hubState`. La persistencia es temporal por pestaña/sesión del navegador; no usa cookies, `localStorage`, base de datos ni sincronización remota.

Al volver desde Calculadora, el `iframe` recibe el estado guardado y el contexto. La opción de nueva asesoría limpia ambas claves, permite conservar opcionalmente el ejecutivo y reinicia la experiencia.

## Flujo técnico

1. `app.js`, `navigation.js` y `employment.js` recorren las escenas de cliente, ejecutivo, información institucional y diagnóstico.
2. `recommendation.js` calcula puntajes Online/Flex usando `data/recommendation-rules.js`. Si no se supera el umbral, no fuerza una recomendación; el ejecutivo selecciona el producto.
3. `data/products.js` controla módulos, beneficios, metodología, horarios y contenido de cada producto.
4. El precierre registra criterios, beneficios asociados y favoritos.
5. Al entrar a inversión, `integration.js` crea `salesContext` y activa el `iframe`.
6. En Hub, `aplicacion.js` filtra `tarifas.js`, valida una combinación única, aplica reglas de `motor-comercial.js` y genera pagos con `plan-pagos.js`.
7. `propuesta.js` compone la cotización. `print.js` recupera el documento desde `sessionStorage`, fragmento URL o ventana de origen y ejecuta `window.print()` para imprimir/guardar como PDF.
8. `summary.html` + `summary.js` representan el resumen de la experiencia conservada.

## Selección de productos

La recomendación suma pesos reales de `recommendation-rules.js`. Los programas válidos son `online` y `flex`. El resultado puede ser recomendado o mixto; la selección final queda en `selectedProgram` y se transmite a la calculadora como contexto, sin reemplazar la selección tarifaria que valida Hub.

## Archivos principales

- Experience JS: `app.js`, `state.js`, `session.js`, `navigation.js`, `employment.js`, `recommendation.js`, `certification-model.js`, `integration.js`, `summary.js`, `quick-navigation.js`.
- Experience datos: `products.js`, `recommendation-rules.js`, `discovery.js`, `employment-discovery.js`, `executives.js`, `institution.js`, ubicaciones y mapas.
- Hub JS: `aplicacion.js`, `tarifas.js`, `validaciones.js`, `plan-pagos.js`, `motor-comercial.js`, `configuracion-comercial.js`, `propuesta.js`, `print.js`, `experience-bridge.js`.
- CSS: hojas separadas de base, componentes, experiencia, recomendación, responsive, resumen, calculadora, propuesta, impresión y bridge.

## Datos comerciales

`tarifas.js` contiene el catálogo generado desde tres Excel oficiales. `plan-pagos.js` calcula fechas, centavos y ajuste de cuota final. `configuracion-comercial.js` declara beneficios y condiciones; `motor-comercial.js` decide disponibilidad y selección compatible.

## Dependencias

La aplicación no requiere Node.js para ejecutarse. Incluye localmente MapLibre GL en `vendor/maplibre-gl`; no depende de un CDN para esa biblioteca. Las fuentes del sistema y APIs estándar del navegador son los demás requisitos. Algunos enlaces voluntarios, como WhatsApp, requieren conectividad para abrir el servicio externo, pero no sostienen la lógica comercial.

## Compatibilidad conocida

Se diseñó para navegadores modernos con soporte de ES6+, `sessionStorage`, `postMessage`, `iframe`, `Intl`, `URLSearchParams`, CSS Grid/Flex y `window.print`. La ejecución por doble clic es posible; servir la carpeta por HTTP local ofrece un origen más consistente para iframes y mapas. No se declara compatibilidad con navegadores antiguos.
