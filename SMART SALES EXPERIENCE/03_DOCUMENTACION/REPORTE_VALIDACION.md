# REPORTE DE VALIDACIÓN — MVP 2

## Resultado

**APROBADO POR QA PARA VALIDACIÓN FUNCIONAL DEL USUARIO**

No existen hallazgos críticos abiertos. El motor conserva exactamente los totales oficiales, incluidos los centavos, y todos los planes de pago probados reconciliaron sin diferencias.

## Datos publicados

| Control | Resultado |
|---|---:|
| Registros publicados | 454 |
| Smart Flex | 440 |
| Smart Online | 14 |
| Tarifas financiadas | 269 |
| Registros con observación interna | 11 |
| Trazabilidad incompleta | 0 |
| Cotizaciones ambiguas | 0 |

Los tres registros menos respecto al catálogo anterior corresponden a filas de una cuota del bloque público financiado de Smart Online que duplicaban la opción oficial de pago único. Permanecen en el modelo normalizado y en su trazabilidad; no fueron eliminados de los Excel.

## Pruebas del plan de pagos

Se probaron las 269 tarifas financiadas en tres escenarios cada una:

1. primera cuota mínima operativa;
2. primera cuota aumentada;
3. primera cuota igual al total.

Resultado: **807 planes verificados, 0 sumas inexactas**.

También se comprobaron los límites exactos de 30 y 40 días, el rechazo de 29 y 41 días, febrero no bisiesto, febrero bisiesto, conservación del día mensual y ausencia de cuotas posteriores cuando el contrato queda totalmente pagado.

## Casos especiales válidos con 50 centavos

Los siguientes registros de `Tarifas Smart Flex - 2026 - Score.xlsx`, hoja `T. Smart Flex - Ing`, son casos oficiales válidos:

| Fila | Plan | Condición | Cuotas | Total oficial |
|---:|---|---|---:|---:|
| 32 | Plan 2 Niveles, ingreso A2 | Alianza masiva | 7 | $2.975.542,50 |
| 57 | Plan 3 Niveles, ingreso A2 | Alianza masiva | 13 | $4.212.727,50 |
| 75 | Plan 4 Niveles, ingreso A2 | Alianza masiva | 15 | $5.085.112,50 |

En cada caso, las cuotas intermedias quedan en pesos enteros y los 50 centavos, junto con cualquier otro residuo de división, quedan exclusivamente en la `Cuota final — ajuste de cierre`. La suma se compara en centavos enteros con el total oficial. Estos registros no se consideran inconsistencias pendientes.

## Hallazgos y correcciones de desarrollo

- Se incorporó Score/MP a la clave comercial pública de Smart Flex para evitar resoluciones implícitas.
- Se centralizó el calendario y la amortización en `js/plan-pagos.js` para evitar reglas duplicadas.
- Se sustituyó la aritmética monetaria de punto flotante por unidades enteras de centavo.
- El formato monetario muestra decimales solo cuando existen; nunca agrega `,00` innecesarios.
- El resumen copiado, la vista, la impresión y el PDF mediante impresión comparten los mismos importes ya validados.
- Las denominaciones internas Flex Pack, Nivel a Nivel y Modelo Actual no aparecen en la interfaz.

## Revisión QA

- **Arquitectura y mantenibilidad:** aprobadas; datos, validación, amortización, presentación e impresión están separadas.
- **Experiencia de usuario:** aprobada para MVP; flujo progresivo, ayuda visible y opciones dependientes.
- **Rendimiento:** aprobado; procesamiento local de 454 registros sin red.
- **Claridad y accesibilidad:** aprobadas; controles nativos etiquetados, foco visible, mensajes de estado y tabla semántica.
- **Validaciones:** aprobadas; se impiden combinaciones, cuotas, importes y fechas inválidas.
- **Seguridad y privacidad:** aprobadas; sin red, APIs, servidores, almacenamiento de clientes ni recursos externos.
- **Consistencia de datos:** aprobada; 0 importes fuente alterados, 0 ambigüedades y trazabilidad completa.
- **Cumplimiento:** aprobado respecto a `AGENTS.md`, `PRD.md` y `ARQUITECTURA.md`.

## Riesgos pendientes no bloqueantes

- Los 180 registros MP afectados por `#REF!` continúan excluidos hasta recibir un Excel corregido.
- Las 11 diferencias de valor por hora permanecen como observaciones internas por decisión oficial.
- La automatización del navegador no admite rutas `file://`. La sintaxis, estructura, recursos y lógica se validaron automáticamente; la aceptación visual debe realizarse abriendo `index.html` mediante doble clic.

Los Excel originales permanecen intactos.

## Propuesta Comercial Premium

**APROBADO POR QA TÉCNICO PARA ACEPTACIÓN VISUAL DEL USUARIO**

Se verificaron: vista previa; dos páginas editoriales; contado y financiación; campos de cliente y asesor; contenido oficial; modalidad comercial contextualizada; fallback de marca; plan mediante tarjetas; impresión A4; responsive; ausencia de red y persistencia; consumo del plan validado; y sintaxis JavaScript.

`scripts/validar_propuesta.py` aprobó 15 grupos de controles. La auditoría general aprobó 22 grupos y conservó 454 tarifas, 0 ambigüedades y 0 registros sin trazabilidad. Se reconciliaron 807 planes financieros con 0 diferencias.

La automatización disponible no admite rutas `file://`. La aceptación visual final de la vista previa, los saltos A4 y el diálogo de impresión debe realizarse abriendo `index.html` mediante doble clic, que es el modo oficial de ejecución.
