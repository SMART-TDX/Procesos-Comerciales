# QA final disponible

Fecha de consolidación documental: 2026-09-02.

Resultados confirmados en el último ciclo de QA disponible antes de esta entrega:

- Smart Flex: flujo financiado y pago único revisados; selección mínima de E-Book validada.
- Smart Online: flujo de duración, condición y pago revisado.
- Navegación Experience → inversión → Calculadora → cierre/resumen: revisada.
- Modelo de certificación y valores Linguaskill: revisados contra el código vigente.
- Precierre y resumen: revisados.
- Calculadora, cotización y vista de impresión/PDF: revisadas.
- Catálogo: 415 tarifas (400 Flex, 15 Online).
- Planes de pago: 249 registros financiados, 747 escenarios, 0 diferencias de suma.
- Rastreo HTTP local del paquete de publicación: 68 rutas, 0 errores/404.
- Consola en recorridos revisados: 0 errores críticos.

No se registró una prueba automatizada específica de sesiones concurrentes entre usuarios; la arquitectura usa `sessionStorage`, que aísla el estado por pestaña/sesión del navegador. Esta afirmación arquitectónica no sustituye una prueba de concurrencia formal.

Los validadores copiados en esta carpeta permiten repetir las comprobaciones. Este documento no afirma pruebas distintas de las ejecutadas y registradas en el proyecto.
