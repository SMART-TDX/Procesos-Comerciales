# CALCULADORA COMERCIAL SMART 2026

Aplicación web local para consultar tarifas oficiales de Smart Online y Smart Flex mediante un flujo comercial guiado.

## Uso

Conserva completa la carpeta y haz doble clic en `index.html`. La aplicación no requiere internet, servidor, base de datos, instalación ni Node.js.

## Flujo Smart Flex

1. Línea Smart Flex.
2. Nivel de ingreso.
3. `Tarifas Score` o `Tarifas MP`.
4. Tipo de plan compatible.
5. Condición comercial.
6. Forma de pago.
7. Número oficial de cuotas.
8. Primera cuota, si existe financiación.
9. Fecha del primer pago.
10. Fecha de la segunda cuota, entre 30 y 40 días después.
11. Cotización y plan de pagos.

Los nombres internos de hojas y bloques de Excel no se muestran. Todas las horas se presentan como “Horas de formación”, sin modificar sus cantidades.

## Flujo Smart Online

Smart Online conserva sus planes oficiales de 6, 9 y 12 meses. No solicita nivel de ingreso ni tipo de tarifa y no muestra horas. Incluye solamente las condiciones y cuotas existentes, incluidos Convenios cuando corresponda.

## Primera cuota y amortización

En financiación, la cuota inicial oficial es el mínimo. Si contiene fracciones de peso, el mínimo operativo se eleva al siguiente peso entero para nunca quedar por debajo del valor fuente. El asesor puede aumentarla hasta el total oficial.

El saldo se divide entre las cuotas pendientes. Las cuotas intermedias se expresan en pesos enteros y todo residuo de pesos o centavos queda exclusivamente en la última cuota. Los importes con centavos muestran hasta dos decimales y los enteros no muestran `,00`. La aplicación calcula en centavos enteros y comprueba que la suma coincida exactamente con el total oficial. Si la primera cuota cubre el total, no se generan pagos posteriores.

## Fechas e impresión

La fecha de cotización es también la fecha del primer pago y del inicio del servicio. Las cuotas posteriores conservan el día elegido para la segunda; si el mes no tiene ese día, usan el último día calendario.

El botón “Preparar propuesta comercial” abre una vista previa de dos páginas antes de imprimir o guardar como PDF. Solicita los datos aprobados del cliente y asesor, diferencia contado y financiación e incluye el mismo plan de pagos ya validado. Estos datos permanecen solo durante la sesión y no se almacenan.

Mientras no exista `assets/logo-smart.svg`, la propuesta utiliza exclusivamente el identificador temporal aprobado `SMART / Calculadora Comercial`.

“Copiar resumen” conserva el mismo formato monetario, incluido el ajuste de centavos de la cuota final.

## Datos y mantenimiento

`js/tarifas.js` se genera desde `datos/modelo_tarifas_normalizado.json` con `scripts/generar_tarifas_js.py`. El catálogo excluye cursos cortos, registros inválidos, los registros MP con `#REF!` y la preventa marcada como no activa. Conserva sin recalcular las 11 observaciones oficiales y toda su trazabilidad.

Los scripts son herramientas de mantenimiento y QA; no son necesarios para utilizar la aplicación. Los Excel de `ORIGINALES_NO_MODIFICAR/` son fuentes inmutables.

## Alcance

Incluye exclusivamente Smart Online y Smart Flex. No incluye comparador, historial, dashboard, exportación avanzada ni almacenamiento de datos de clientes.
