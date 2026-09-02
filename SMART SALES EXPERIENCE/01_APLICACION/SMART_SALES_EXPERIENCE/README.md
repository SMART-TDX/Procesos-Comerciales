# SMART SALES EXPERIENCE

## Producto

SMART SALES EXPERIENCE

## Objetivo

Herramienta interactiva para venta relacional y cierre de Smart Online y Smart Flex.

## Regla crítica

Smart Sales Experience es un proyecto independiente de Smart Sales Hub. No debe modificar, reemplazar ni desplegar archivos sobre la aplicación productiva existente.

## Producción protegida

https://smart-sales-hub.vercel.app/

La producción anterior no debe modificarse desde este proyecto.

## Arquitectura

- `index.html`: shell accesible de la experiencia.
- `css/`: variables visuales temporales, base, componentes, escenas y responsive.
- `js/`: estado en memoria, sesión temporal, navegación y arranque.
- `data/`: contenido configurable y reglas futuras.
- `modules/`: espacios reservados para las etapas de la experiencia.
- `assets/`: recursos institucionales pendientes de aprobación.
- `vendor/smart-sales-engine/`: punto reservado para la futura integración controlada del motor económico.

## Estado

FASE 01 — shell inicial con tres escenas: bienvenida, ejecutivo y confianza Smart.

## Ejecución local

Abra `index.html` con doble clic en Chrome o Edge. No requiere instalación, servidor ni conexión a internet.

## Privacidad temporal

La sesión usa únicamente `sessionStorage`. No guarda historial permanente ni utiliza `localStorage`. El botón "Limpiar sesión" elimina toda la información temporal.
