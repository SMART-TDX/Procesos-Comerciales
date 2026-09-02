# Reglas comerciales implementadas

## Fuente de verdad

Las tarifas operativas están en `tarifas.js`, generado desde los Excel oficiales incluidos en esta carpeta. El catálogo validado contiene 415 registros: 400 Smart Flex y 15 Smart Online. No se deben editar valores manualmente.

## Selección

- Smart Flex filtra por nivel de ingreso, tipo de tarifa, plan, condición, forma de pago y cuotas.
- Smart Online filtra por duración/plan, condición, forma de pago y cuotas.
- La combinación debe resolver un único registro; `validaciones.js` impide cotizaciones ambiguas o inexistentes.
- Al cambiar una decisión anterior se limpian las selecciones dependientes para evitar combinaciones obsoletas.

## Pago único y financiación

Pago único usa el valor total oficial y una cuota. En financiación, la primera cuota debe ser numérica, no inferior al mínimo oficial ni superior al total. Cuando queda saldo, la segunda fecha debe estar entre 30 y 40 días calendario después del primer pago. Las siguientes fechas son mensuales y respetan el último día de cada mes. Los cálculos se realizan en centavos y la última cuota absorbe cualquier ajuste de cierre.

La validación automatizada disponible cubre 249 registros financiados y 747 escenarios de planes de pago, con suma exacta al total oficial.

## Descuentos

El descuento mostrado proviene del registro tarifario. La aplicación no inventa porcentajes. Cuando el dato es nulo se presenta como no informado; cuando existe se usa para el resumen y cálculo de ahorro frente al valor de lista disponible.

## Beneficios

`configuracion-comercial.js` declara beneficios; `motor-comercial.js` filtra por línea y requisitos. Las selecciones son exclusivas dentro del mismo tipo cuando así se declara. Las campañas sólo se consideran vigentes si la configuración mensual tiene una campaña ACTIVA con nombre.

### E-Books

Smart Flex ofrece de 1 a 5 E-Books, con valor informativo unitario de $152.000. No existe opción de cero E-Books en la configuración final. Antes del resumen, Smart Flex exige al menos un beneficio EBOOK válido. La cantidad disponible se restringe por los niveles del plan.

### Linguaskill

- 1 habilidad: $170.000
- 2 habilidades: $304.000
- 4 habilidades: $456.000

Aplican a Smart Flex y Smart Online sólo cuando se cumplen las reglas codificadas: en Flex, mínimo dos niveles e inclusión de B1; en Online, mínimo dos módulos y requisito intermedio. La selección es exclusiva por tipo.

El modelo de certificación de Experience contiene seis láminas: Smart Flex, constancias/certificación, referencias internacionales, Smart Online como educación informal, alcance de constancia Online y diplomas nivel a nivel. Es información presentada por la aplicación; las fuentes gráficas están en `assets/certification-model`.

## Cursos cortos

La configuración contempla Smart Business English, Smart Chef y Smart Office Suite Skills para Smart Flex, con valores comerciales definidos en código. Su disponibilidad se decide por las reglas activas, no por texto libre.

## Mapeo técnico de niveles

START = A1; GO = A2; FLOW = B1; PLUS = B2; PRO = C1. Es un mapeo técnico interno, no una sustitución de la nomenclatura comercial visible.

## Cotización, resumen y PDF

La cotización conserva el registro oficial, valor de lista, primera cuota, fechas, plan de pagos, ahorro y beneficios seleccionados. El resumen refleja esos datos. La vista PDF es HTML/CSS de impresión; `print.js` recupera el documento temporal y llama a `window.print()`.
