# WIREFRAMES OFICIALES
## SMART SALES HUB — Smart Sales Assistant

Estado: especificación visual, no implementación.

Alcance: recorrido completo desde Inicio hasta la propuesta comercial final.

Usuario principal: asesor comercial.

Fuentes rectoras:

- `AGENTS.md`.
- `PRODUCT_DECISIONS.md`.
- `ARQUITECTURA.md`.
- `SMART_SALES_ASSISTANT_UI.md`.
- `COMMERCIAL_ENGINE.md`.
- `PDF_DESIGN_SPEC.md`.

Este documento no activa beneficios, campañas ni reglas comerciales.

Las tarjetas de beneficios son contenedores previstos.

Solo se mostrarán cuando el motor comercial entregue opciones aprobadas y vigentes.

Los wireframes usan texto y diagramas ASCII.

No representan código ni dimensiones finales en píxeles.

---

# 1. PRINCIPIOS DE LECTURA

## 1.1. Convenciones ASCII

```text
┌──────────────┐  Contenedor, tarjeta o panel
│              │
└──────────────┘

[ Acción ]        Botón

(●) Selección     Opción seleccionada

(○) Selección     Opción disponible

[✓] Completado    Estado terminado

[!] Atención      Error o dato por revisar

[—] Pendiente     Dato todavía no seleccionado

⋮                 Contenido repetido o colapsado
```

## 1.2. Estructura persistente Desktop

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ SMART  | Calculadora Comercial        Paso X de Y        Nueva cotización│
├──────────────────────────────────────────────────────────────────────────┤
│ [✓ Paso anterior]──[● Paso actual]──[○ Pendiente]──[○ Pendiente]         │
├──────────────────────────────────────────────┬───────────────────────────┤
│                                              │ RESUMEN                   │
│ ÁREA PRINCIPAL                               │                           │
│                                              │ Programa                  │
│ Una decisión principal                       │ Inversión                 │
│                                              │ Beneficios                │
│                                              │                           │
│                                              │ Valor final siempre visible│
├──────────────────────────────────────────────┴───────────────────────────┤
│ Estado del sistema / ayuda contextual                                    │
└──────────────────────────────────────────────────────────────────────────┘
```

## 1.3. Estructura persistente Tablet

```text
┌──────────────────────────────────────────────────────┐
│ SMART                         Paso X de Y             │
│ [██████████░░░░░░░░] Nombre del paso                 │
├──────────────────────────────────────────────────────┤
│ RESUMEN COMPACTO                    Valor final       │
│ [Programa] [Pago] [Beneficios]      $ —              │
├──────────────────────────────────────────────────────┤
│                                                      │
│ ÁREA PRINCIPAL                                       │
│ Cuadrícula de una o dos columnas                     │
│                                                      │
├──────────────────────────────────────────────────────┤
│ [Atrás]                              [Acción principal]│
└──────────────────────────────────────────────────────┘
```

## 1.4. Estructura persistente Celular

```text
┌──────────────────────────────┐
│ SMART           Paso X de Y  │
│ [████████░░░░░░░░]           │
├──────────────────────────────┤
│ Valor final: $ —      [⌄]    │
├──────────────────────────────┤
│ Título del paso              │
│ Instrucción breve            │
│                              │
│ [ Tarjeta de ancho completo ]│
│ [ Tarjeta de ancho completo ]│
│                              │
├──────────────────────────────┤
│ [Atrás] [Acción principal]   │
└──────────────────────────────┘
```

## 1.5. Reglas compartidas

- La barra de progreso siempre permanece visible.
- El resumen siempre conserva visible el valor final.
- Solo existe una acción principal por pantalla.
- El paso actual tiene foco visual y semántico.
- El paso inmediatamente anterior aparece comprimido.
- Los demás pasos completados se consultan desde el progreso o el resumen.
- Una tarjeta válida de selección única puede avanzar automáticamente.
- Los datos compuestos requieren botón de continuación.
- Atrás conserva selecciones independientes.
- Editar limpia únicamente dependencias.
- Las opciones inválidas no aparecen.
- Los estados no dependen exclusivamente del color.
- Smart Online nunca muestra nivel, Score, MP u horas.
- Smart Flex nunca expone nombres internos del Excel.
- El valor final nunca se reconstruye visualmente.
- La interfaz no modifica ninguna regla financiera.

---

# 2. PANTALLA DE INICIO

## Objetivo

Iniciar una nueva cotización y comunicar que la herramienta guiará al asesor.

## Desktop

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ SMART                                      Calculadora Comercial         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                 Preparemos una cotización oficial                        │
│       Selecciona la línea de estudio para comenzar el recorrido.         │
│                                                                          │
│       ┌────────────────────────┐  ┌────────────────────────┐              │
│       │ SMART ONLINE           │  │ SMART FLEX             │              │
│       │ Programa por tiempo    │  │ Programa por niveles   │              │
│       │ de acceso.             │  │ y plan de formación.   │              │
│       │                        │  │                        │              │
│       │      [Comenzar]        │  │      [Comenzar]        │              │
│       └────────────────────────┘  └────────────────────────┘              │
│                                                                          │
│                 Información oficial · Funcionamiento local              │
└──────────────────────────────────────────────────────────────────────────┘
```

## Tablet

```text
┌──────────────────────────────────────────────┐
│ SMART                 Calculadora Comercial │
├──────────────────────────────────────────────┤
│ Preparemos una cotización oficial            │
│                                              │
│ ┌────────────────────┐ ┌────────────────────┐│
│ │ SMART ONLINE       │ │ SMART FLEX         ││
│ │ [Comenzar]         │ │ [Comenzar]         ││
│ └────────────────────┘ └────────────────────┘│
│                                              │
│ Información oficial · Funcionamiento local  │
└──────────────────────────────────────────────┘
```

## Celular

```text
┌──────────────────────────────┐
│ SMART                        │
│ Calculadora Comercial        │
├──────────────────────────────┤
│ Preparemos una cotización    │
│ oficial                      │
│                              │
│ ┌──────────────────────────┐ │
│ │ SMART ONLINE             │ │
│ │ [Comenzar]               │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ SMART FLEX               │ │
│ │ [Comenzar]               │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

## Componentes

- Identidad Smart autorizada.
- Título de bienvenida.
- Texto de orientación.
- Dos tarjetas de línea.
- Indicador de funcionamiento local.

## Botones

- `Comenzar` dentro de Smart Online.
- `Comenzar` dentro de Smart Flex.

## Tarjetas

- Smart Online.
- Smart Flex.

## Barra de progreso

- Todavía no se presenta como recorrido iniciado.
- La selección abre el Paso 1 con progreso activo.

## Resultado esperado

- Línea elegida.
- Recorrido correspondiente inicializado.
- Resumen lateral en estado pendiente.

## Acciones del usuario

- Elegir Smart Online.
- Elegir Smart Flex.

## Estado vacío

- Es el estado natural de inicio.
- No mostrar valores, descuentos ni beneficios vacíos.

## Estado de error

- Si los datos oficiales no pueden cargarse, sustituir las tarjetas por un mensaje bloqueante.
- Mensaje: `No fue posible cargar las tarifas oficiales.`
- Acción: `Reintentar`.
- No mostrar tarifas parciales.

## Estado completado

- La tarjeta elegida muestra confirmación breve.
- La interfaz avanza automáticamente.

---

# 3. PASO 1 — LÍNEA DE ESTUDIO

## Objetivo

Confirmar la línea de estudio dentro del Wizard.

## Desktop

```text
┌──────────────────────────────────────────────┬───────────────────────────┐
│ Paso 1 de 7/9  [● Línea]──[○ Siguiente]     │ RESUMEN                   │
├──────────────────────────────────────────────┤ Programa       Pendiente │
│ ¿Qué línea de estudio necesita el cliente?  │ Inversión      Pendiente │
│                                              │ Beneficios     Ninguno    │
│ ┌────────────────────┐ ┌────────────────────┐│                           │
│ │ SMART ONLINE       │ │ SMART FLEX         ││ Valor final          $ — │
│ │ Tiempo de acceso   │ │ Niveles y plan     ││                           │
│ └────────────────────┘ └────────────────────┘│                           │
└──────────────────────────────────────────────┴───────────────────────────┘
```

## Tablet

```text
┌──────────────────────────────────────────────┐
│ Paso 1 de 7/9  Línea de estudio             │
│ [██░░░░░░░░░░░░░░]                         │
├──────────────────────────────────────────────┤
│ Resumen: Programa pendiente        $ —       │
│                                              │
│ [ SMART ONLINE ]    [ SMART FLEX ]           │
└──────────────────────────────────────────────┘
```

## Celular

```text
┌──────────────────────────────┐
│ Paso 1 · Línea               │
│ [██░░░░░░░░░░░░]            │
├──────────────────────────────┤
│ Valor final: $ —             │
│                              │
│ ¿Qué línea necesita?         │
│ [ SMART ONLINE ]             │
│ [ SMART FLEX ]               │
└──────────────────────────────┘
```

## Componentes

- Cabecera del Wizard.
- Pregunta principal.
- Dos tarjetas.
- Resumen.

## Botones

- No requiere botón independiente.
- La tarjeta completa funciona como acción.

## Tarjetas

- Smart Online.
- Smart Flex.

## Barra de progreso

- Paso 1 activo.
- Total cambia a 7 para Smart Online o 9 para Smart Flex tras elegir.

## Resultado esperado

- Línea confirmada.
- Próximo paso determinado.

## Acciones del usuario

- Seleccionar una tarjeta.

## Estado vacío

- Ninguna tarjeta activa.
- Pregunta y opciones permanecen visibles.

## Estado de error

- Si una línea no tiene registros oficiales utilizables, no habilitarla.
- Explicar: `Esta línea no tiene tarifas disponibles en la fuente actual.`

## Estado completado

- Mostrar `[✓] Smart Online` o `[✓] Smart Flex` en el paso comprimido.

---

# 4. SMART ONLINE — PASO 2: DURACIÓN

## Objetivo

Elegir el tiempo de acceso oficial disponible.

## Desktop

```text
┌──────────────────────────────────────────────┬───────────────────────────┐
│ Paso 2 de 7  [✓ Línea]──[● Duración]──[○]  │ PROGRAMA                  │
├──────────────────────────────────────────────┤ Smart Online             │
│ [✓ Smart Online]                    Editar  │ Duración       Pendiente │
│                                              │                           │
│ ¿Durante cuánto tiempo tendrá acceso?       │ INVERSIÓN                 │
│                                              │ Valor final          $ — │
│ [ 6 meses ]   [ 9 meses ]   [ 12 meses ]   │                           │
│                                              │ BENEFICIOS                │
│ Solo aparecen opciones oficiales disponibles│ Ninguno                   │
└──────────────────────────────────────────────┴───────────────────────────┘
```

## Tablet

```text
┌──────────────────────────────────────────────┐
│ Paso 2 de 7 · Duración        [████░░░░░░]  │
├──────────────────────────────────────────────┤
│ Smart Online                         $ —     │
│                                              │
│ ¿Durante cuánto tiempo tendrá acceso?       │
│ [ 6 meses ] [ 9 meses ] [ 12 meses ]       │
└──────────────────────────────────────────────┘
```

## Celular

```text
┌──────────────────────────────┐
│ Paso 2 de 7 · Duración       │
│ [████░░░░░░░░░░]            │
├──────────────────────────────┤
│ Smart Online          $ —    │
│                              │
│ [ 6 meses ]                 │
│ [ 9 meses ]                 │
│ [ 12 meses ]                │
└──────────────────────────────┘
```

## Componentes

- Paso anterior comprimido.
- Pregunta principal.
- Tarjetas de duración.
- Resumen persistente.

## Botones

- `Editar` Smart Online.
- Sin botón Continuar para selección única.

## Tarjetas

- 6 meses, si existe oficialmente.
- 9 meses, si existe oficialmente.
- 12 meses, si existe oficialmente.

## Barra de progreso

- Paso 2 de 7 activo.

## Resultado esperado

- Duración confirmada.
- Condiciones comerciales filtradas.

## Acciones del usuario

- Elegir duración.
- Editar línea.

## Estado vacío

- Mostrar solo duraciones disponibles.
- Si no hay ninguna, usar estado bloqueante.

## Estado de error

- `No hay duraciones oficiales disponibles para Smart Online.`
- Acción secundaria: `Cambiar línea`.

## Estado completado

- Paso compacto: `[✓] Duración · 9 meses · Editar`.

---

# 5. SMART ONLINE — PASO 3: CONDICIÓN COMERCIAL

## Objetivo

Seleccionar una condición compatible con la duración.

## Desktop

```text
┌──────────────────────────────────────────────┬───────────────────────────┐
│ Paso 3 de 7  [✓ Línea]─[✓ Duración]─[● Condición]                       │
├──────────────────────────────────────────────┤ PROGRAMA                  │
│ [✓ Duración · 9 meses]              Editar  │ Smart Online · 9 meses   │
│                                              │                           │
│ Selecciona la condición comercial           │ INVERSIÓN                 │
│                                              │ Valor final          $ — │
│ [ Lanzamiento ] [ Alianza masiva ]          │                           │
│ [ Alianza empresarial ] [ Preventa ]        │ BENEFICIOS                │
│ [ Colaborador ] [ Convenios, si aplica ]    │ Ninguno                   │
└──────────────────────────────────────────────┴───────────────────────────┘
```

## Tablet

```text
┌──────────────────────────────────────────────┐
│ Paso 3 de 7 · Condición      [██████░░░░]   │
│ Smart Online · 9 meses              $ —     │
├──────────────────────────────────────────────┤
│ [ Lanzamiento ] [ Alianza masiva ]          │
│ [ Alianza empresarial ] [ Colaborador ]     │
│ [ Solo otras opciones oficiales válidas ]   │
└──────────────────────────────────────────────┘
```

## Celular

```text
┌──────────────────────────────┐
│ Paso 3 de 7 · Condición      │
│ [██████░░░░░░░░]            │
├──────────────────────────────┤
│ Smart Online · 9 meses $ —  │
│                              │
│ [ Lanzamiento ]             │
│ [ Alianza masiva ]          │
│ [ Alianza empresarial ]     │
│ [ Colaborador ]             │
└──────────────────────────────┘
```

## Componentes

- Tarjetas en orden comercial oficial.
- Resumen con programa.
- Texto de ayuda contextual.

## Botones

- `Editar` duración.
- Tarjetas autoavanzables.

## Tarjetas

- Solo condiciones encontradas para la combinación.
- Preventa únicamente si está activa.
- Convenios únicamente si corresponde.

## Barra de progreso

- Paso 3 de 7 activo.

## Resultado esperado

- Condición confirmada.
- Formas de pago filtradas.

## Acciones del usuario

- Elegir condición.
- Volver o editar duración.

## Estado vacío

- No usar una cuadrícula vacía.
- Mostrar explicación y permitir cambiar duración.

## Estado de error

- `No encontramos condiciones oficiales para esta duración.`

## Estado completado

- `[✓] Condición · Lanzamiento · Editar`.
- Inversión comienza a poblarse si los datos ya son inequívocos.

---

# 6. SMART ONLINE — PASO 4: FORMA DE PAGO

## Objetivo

Elegir la modalidad de pago y completar sus datos condicionales.

## Estado inicial Desktop

```text
┌──────────────────────────────────────────────┬───────────────────────────┐
│ Paso 4 de 7  [✓]─[✓]─[✓]─[● Forma de pago]│ PROGRAMA                  │
├──────────────────────────────────────────────┤ Smart Online · 9 meses   │
│ [✓ Condición · Lanzamiento]         Editar  │                           │
│                                              │ INVERSIÓN                 │
│ ¿Cómo realizará el pago?                    │ Valor oficial       $ —  │
│                                              │ Descuento           —    │
│ [ Pago único ]        [ Financiado ]        │ Valor final         $ —  │
│                                              │                           │
│ Solo se muestran modalidades oficiales      │ BENEFICIOS · Ninguno      │
└──────────────────────────────────────────────┴───────────────────────────┘
```

## Pago único Desktop

```text
┌──────────────────────────────────────────────┬───────────────────────────┐
│ Forma de pago · Pago único                  │ INVERSIÓN                 │
├──────────────────────────────────────────────┤ Valor oficial $1.000.000 │
│ ┌──────────────────────────────────────────┐ │ Descuento          10 % │
│ │ Pago único                               │ │ Ahorro          $100.000 │
│ │ Valor total oficial          $900.000    │ │ VALOR FINAL    $900.000 │
│ │ Fecha de cotización y pago   [dd/mm/aaaa]│ │                           │
│ └──────────────────────────────────────────┘ │                           │
│                                              │                           │
│ [Atrás]                         [Continuar]   │                           │
└──────────────────────────────────────────────┴───────────────────────────┘
```

## Financiado Desktop

```text
┌──────────────────────────────────────────────┬───────────────────────────┐
│ Forma de pago · Financiado                  │ INVERSIÓN                 │
├──────────────────────────────────────────────┤ Valor final       $ —    │
│ Número de cuotas                            │                           │
│ [ 2 cuotas ] [ 3 cuotas ] [ Solo válidas ] │ PLAN DE PAGOS             │
│                                              │ Primera cuota     $ —    │
│ Primera cuota        [$__________]           │ Saldo             $ —    │
│ Primer pago          [dd/mm/aaaa]            │ Reconciliación Pendiente  │
│ Segunda cuota        [dd/mm/aaaa]            │                           │
│                                              │                           │
│ [Atrás]                  [Ver plan de pagos] │                           │
└──────────────────────────────────────────────┴───────────────────────────┘
```

## Tablet

```text
┌──────────────────────────────────────────────┐
│ Paso 4 de 7 · Forma de pago  [████████░░]   │
│ Smart Online · 9 meses       Valor $ —      │
├──────────────────────────────────────────────┤
│ [ Pago único ]       [ Financiado ]          │
│                                              │
│ Datos condicionales ocupan ancho completo    │
│ [Número de cuotas] [Primera cuota]           │
│ [Primer pago]       [Segunda cuota]          │
│                                              │
│ [Atrás]                     [Ver plan]        │
└──────────────────────────────────────────────┘
```

## Celular

```text
┌──────────────────────────────┐
│ Paso 4 de 7 · Pago           │
│ [████████░░░░░░]            │
├──────────────────────────────┤
│ Valor final: $ —      [⌄]    │
│ [ Pago único ]              │
│ [ Financiado ]              │
│                              │
│ Al seleccionar financiado:  │
│ [ Cuotas válidas ]          │
│ [ Primera cuota ]           │
│ [ Primer pago ]             │
│ [ Segunda cuota ]           │
│                              │
│ [Atrás] [Ver plan]          │
└──────────────────────────────┘
```

## Componentes

- Tarjetas de modalidad.
- Cuotas oficiales.
- Campo de primera cuota cuando corresponda.
- Selectores locales de fecha.
- Resumen financiero.
- Acceso a plan visual.

## Botones

- `Atrás`.
- `Continuar` para pago único.
- `Ver plan de pagos` para financiación válida.

## Tarjetas

- Pago único.
- Financiado, cuando exista.
- Número de cuotas mediante tarjetas.

## Barra de progreso

- Paso 4 de 7 activo.
- No marcar completo hasta validar todos los datos condicionales.

## Resultado esperado

- Forma de pago completa.
- Importes reconciliados.
- Fechas válidas.

## Acciones del usuario

- Elegir forma de pago.
- Elegir cuotas.
- Definir primera cuota y fechas cuando aplique.
- Revisar plan.

## Estado vacío

- Solo mostrar las modalidades disponibles.
- Campos condicionales ocultos antes de seleccionar.

## Estado de error

- Primera cuota fuera de rango.
- Fecha requerida ausente.
- Segunda fecha incompatible.
- Importe no reconciliado.
- Cada mensaje aparece junto al dato y en el resumen si bloquea avance.

## Estado completado

- `[✓] Pago · Pago único`.
- O `[✓] Pago · 3 cuotas`.
- Resumen muestra valor final y forma de pago.

---

# 7. SMART FLEX — PASO 2: NIVEL DE INGRESO

## Objetivo

Registrar el nivel inicial que determina la oferta disponible.

## Desktop

```text
┌──────────────────────────────────────────────┬───────────────────────────┐
│ Paso 2 de 9  [✓ Línea]──[● Nivel]──[○ Tarifa]                           │
├──────────────────────────────────────────────┤ PROGRAMA                  │
│ [✓ Smart Flex]                      Editar  │ Smart Flex                │
│                                              │ Nivel          Pendiente │
│ ¿Cuál es el nivel de ingreso?               │ Plan           Pendiente │
│                                              │                           │
│ [ Nivel A1 ] [ Nivel A2 ] [ Nivel B1 ]     │ INVERSIÓN           $ —  │
│ [ Solo niveles oficiales disponibles ]      │ BENEFICIOS        Ninguno │
└──────────────────────────────────────────────┴───────────────────────────┘
```

## Tablet

```text
┌──────────────────────────────────────────────┐
│ Paso 2 de 9 · Nivel          [████░░░░░░░░] │
│ Smart Flex                           $ —     │
├──────────────────────────────────────────────┤
│ [ Nivel A1 ] [ Nivel A2 ]                   │
│ [ Nivel B1 ] [ Solo niveles válidos ]       │
└──────────────────────────────────────────────┘
```

## Celular

```text
┌──────────────────────────────┐
│ Paso 2 de 9 · Nivel          │
├──────────────────────────────┤
│ Smart Flex            $ —    │
│ [ Nivel A1 ]                 │
│ [ Nivel A2 ]                 │
│ [ Nivel B1 ]                 │
└──────────────────────────────┘
```

## Componentes

- Tarjetas de nivel.
- Contexto Smart Flex.
- Resumen pendiente.

## Botones

- `Editar` línea.
- Sin botón Continuar para selección única.

## Tarjetas

- Una por cada nivel oficial de ingreso disponible.

## Barra de progreso

- Paso 2 de 9 activo.

## Resultado esperado

- Nivel confirmado.
- Modalidades comerciales compatibles calculadas.

## Acciones del usuario

- Elegir nivel.
- Cambiar línea.

## Estado vacío

- Si no hay niveles, bloquear el paso y permitir cambiar línea.

## Estado de error

- `No encontramos niveles de ingreso disponibles en la fuente oficial.`

## Estado completado

- `[✓] Nivel de ingreso · A1 · Editar`.

---

# 8. SMART FLEX — PASO 3: TARIFA

## Objetivo

Elegir la modalidad comercial visible Score o MP.

## Desktop

```text
┌──────────────────────────────────────────────┬───────────────────────────┐
│ Paso 3 de 9  [✓ Línea]─[✓ Nivel]─[● Tarifa]│ PROGRAMA                  │
├──────────────────────────────────────────────┤ Smart Flex                │
│ [✓ Nivel de ingreso · A1]           Editar  │ Nivel A1                  │
│                                              │ Modalidad      Pendiente │
│ Selecciona la modalidad comercial           │                           │
│                                              │ INVERSIÓN           $ —  │
│ ┌──────────────────┐ ┌──────────────────┐    │ BENEFICIOS        Ninguno │
│ │ SCORE            │ │ MP               │    │                           │
│ └──────────────────┘ └──────────────────┘    │                           │
└──────────────────────────────────────────────┴───────────────────────────┘
```

## Tablet

```text
┌──────────────────────────────────────────────┐
│ Paso 3 de 9 · Tarifa         [██████░░░░░░]│
│ Smart Flex · Nivel A1                $ —    │
├──────────────────────────────────────────────┤
│ [ SCORE ]                  [ MP ]            │
└──────────────────────────────────────────────┘
```

## Celular

```text
┌──────────────────────────────┐
│ Paso 3 de 9 · Tarifa         │
├──────────────────────────────┤
│ Smart Flex · A1       $ —    │
│ [ SCORE ]                   │
│ [ MP ]                      │
└──────────────────────────────┘
```

## Componentes

- Dos tarjetas cuando ambas modalidades existan.
- Texto `Modalidad comercial` en contexto y resumen.

## Botones

- `Editar` nivel.
- Tarjetas autoavanzables.

## Tarjetas

- SCORE.
- MP.
- Nunca un combo para estas dos opciones.

## Barra de progreso

- Paso 3 de 9 activo.

## Resultado esperado

- Modalidad confirmada.
- Planes compatibles filtrados.

## Acciones del usuario

- Elegir SCORE.
- Elegir MP.

## Estado vacío

- Si solo una modalidad es válida, mostrar una única tarjeta con explicación neutral.

## Estado de error

- Si ninguna modalidad es válida: `No hay modalidades disponibles para este nivel.`
- Acción: `Cambiar nivel`.

## Estado completado

- Resumen: `Modalidad comercial · Score` o `Modalidad comercial · MP`.
- Nunca mostrar la modalidad como palabra aislada en el resumen final.

---

# 9. SMART FLEX — PASO 4: PLAN

## Objetivo

Elegir un plan compatible con nivel y modalidad.

## Desktop

```text
┌──────────────────────────────────────────────┬───────────────────────────┐
│ Paso 4 de 9  [✓]─[✓]─[✓]─[● Plan]         │ PROGRAMA                  │
├──────────────────────────────────────────────┤ Smart Flex                │
│ [✓ Modalidad comercial · Score]     Editar  │ Nivel A1 · Score          │
│                                              │ Plan           Pendiente │
│ Selecciona el plan                          │                           │
│                                              │ INVERSIÓN           $ —  │
│ ┌────────────────────┐ ┌────────────────────┐│ BENEFICIOS        Ninguno │
│ │ Plan oficial       │ │ Plan oficial       ││                           │
│ │ Niveles: A1–B1     │ │ Niveles: A1–B2     ││                           │
│ │ Horas: valor oficial│ │ Horas: valor oficial│                           │
│ └────────────────────┘ └────────────────────┘│                           │
└──────────────────────────────────────────────┴───────────────────────────┘
```

## Tablet

```text
┌──────────────────────────────────────────────┐
│ Paso 4 de 9 · Plan           [████████░░░░]│
│ Smart Flex · A1 · Score              $ —    │
├──────────────────────────────────────────────┤
│ [ Plan · Niveles · Horas ]                  │
│ [ Plan · Niveles · Horas ]                  │
└──────────────────────────────────────────────┘
```

## Celular

```text
┌──────────────────────────────┐
│ Paso 4 de 9 · Plan           │
├──────────────────────────────┤
│ Smart Flex · A1        $ —   │
│ [ Plan oficial             ] │
│ [ Niveles · Horas          ] │
│ [ Plan oficial             ] │
│ [ Niveles · Horas          ] │
└──────────────────────────────┘
```

## Componentes

- Tarjetas de plan.
- Niveles incluidos.
- Horas oficiales.
- Resumen del contexto.

## Botones

- `Editar` modalidad.
- Selección autoavanzable.

## Tarjetas

- Solo planes oficiales compatibles.
- No mostrar nombres internos.

## Barra de progreso

- Paso 4 de 9 activo.

## Resultado esperado

- Plan confirmado.
- Condiciones comerciales filtradas.

## Acciones del usuario

- Comparar tarjetas.
- Seleccionar plan.
- Volver a modalidad o nivel.

## Estado vacío

- Explicar ausencia y ofrecer `Cambiar modalidad`.

## Estado de error

- `No hay planes oficiales disponibles para esta combinación.`

## Estado completado

- `[✓] Plan · nombre oficial · Editar`.
- Resumen incorpora niveles y horas.

---

# 10. SMART FLEX — PASO 5: CONDICIÓN COMERCIAL

## Objetivo

Seleccionar la condición compatible con el plan.

## Desktop

```text
┌──────────────────────────────────────────────┬───────────────────────────┐
│ Paso 5 de 9       [✓][✓][✓][✓][● Condición]│ PROGRAMA                  │
├──────────────────────────────────────────────┤ Smart Flex · Score        │
│ [✓ Plan · selección oficial]        Editar  │ A1 · Plan seleccionado   │
│                                              │ Niveles · Horas           │
│ Selecciona la condición comercial           │                           │
│                                              │ INVERSIÓN           $ —  │
│ [ Lanzamiento ] [ Alianza masiva ]          │ BENEFICIOS        Ninguno │
│ [ Alianza empresarial ] [ Colaborador ]     │                           │
└──────────────────────────────────────────────┴───────────────────────────┘
```

## Tablet

```text
┌──────────────────────────────────────────────┐
│ Paso 5 de 9 · Condición      [██████████░░]│
│ Smart Flex · Plan                     $ —    │
├──────────────────────────────────────────────┤
│ [ Lanzamiento ] [ Alianza masiva ]          │
│ [ Alianza empresarial ] [ Colaborador ]     │
└──────────────────────────────────────────────┘
```

## Celular

```text
┌──────────────────────────────┐
│ Paso 5 de 9 · Condición      │
├──────────────────────────────┤
│ Valor final: $ —             │
│ [ Lanzamiento ]             │
│ [ Alianza masiva ]          │
│ [ Alianza empresarial ]     │
│ [ Colaborador ]             │
└──────────────────────────────┘
```

## Componentes

- Tarjetas ordenadas según decisión oficial.
- Resumen completo del programa.

## Botones

- `Editar` plan.
- Tarjetas autoavanzables.

## Tarjetas

- Solo condiciones válidas.
- MP no muestra Preventa.
- Preventa inactiva nunca aparece.

## Barra de progreso

- Paso 5 de 9 activo.

## Resultado esperado

- Condición confirmada.
- Formas de pago disponibles.

## Acciones del usuario

- Seleccionar condición.
- Editar plan.

## Estado vacío

- No presentar tarjetas deshabilitadas sin necesidad.

## Estado de error

- `No hay condiciones oficiales disponibles para este plan.`

## Estado completado

- Paso comprimido con condición elegida.
- Inversión actualizada.

---

# 11. SMART FLEX — PASO 6: FORMA DE PAGO

## Objetivo

Completar la decisión financiera sin alterar el motor existente.

## Desktop

```text
┌──────────────────────────────────────────────┬───────────────────────────┐
│ Paso 6 de 9          [✓][✓][✓][✓][✓][● Pago]                            │
├──────────────────────────────────────────────┤ PROGRAMA                  │
│ [✓ Condición · selección]           Editar  │ Smart Flex · Score        │
│                                              │ Plan · Niveles · Horas    │
│ ¿Cómo realizará el pago?                    │                           │
│ [ Pago único ] [ Financiado ]               │ INVERSIÓN                 │
│                                              │ Valor oficial             │
│ ┌ Datos financieros condicionales ─────────┐ │ Descuento                 │
│ │ Cuotas · Primera cuota · Fechas          │ │ Ahorro                    │
│ │ Vista del plan y reconciliación          │ │ VALOR FINAL               │
│ └──────────────────────────────────────────┘ │                           │
│ [Atrás]                         [Continuar]   │                           │
└──────────────────────────────────────────────┴───────────────────────────┘
```

## Tablet

```text
┌──────────────────────────────────────────────┐
│ Paso 6 de 9 · Pago           [███████████░]│
│ Smart Flex · Plan           Valor final     │
├──────────────────────────────────────────────┤
│ [ Pago único ] [ Financiado ]               │
│ [ Datos condicionales en dos columnas ]     │
│ [ Vista visual del plan de pagos ]          │
│ [Atrás]                        [Continuar]    │
└──────────────────────────────────────────────┘
```

## Celular

```text
┌──────────────────────────────┐
│ Paso 6 de 9 · Pago           │
├──────────────────────────────┤
│ Valor final: $ —      [⌄]    │
│ [ Pago único ]              │
│ [ Financiado ]              │
│ [ Cuotas ]                  │
│ [ Primera cuota ]           │
│ [ Fechas ]                  │
│ [ Ver plan de pagos ]       │
│ [Atrás] [Continuar]         │
└──────────────────────────────┘
```

## Componentes

- Los mismos componentes financieros definidos para Smart Online.
- Contexto Smart Flex visible.

## Botones

- `Atrás`.
- `Continuar`.
- `Ver plan de pagos` cuando aplique.

## Tarjetas

- Forma de pago.
- Cuotas oficiales.

## Barra de progreso

- Paso 6 de 9 activo.

## Resultado esperado

- Pago válido y reconciliado.
- Beneficios pueden evaluarse con contexto completo.

## Acciones del usuario

- Seleccionar y completar modalidad.
- Corregir fechas o primera cuota.

## Estado vacío

- Campos dependientes ocultos.

## Estado de error

- Mismos errores financieros oficiales.
- Nunca corregir silenciosamente un importe.

## Estado completado

- Paso comprimido.
- Resultado financiero visible.

---

# 12. PLAN DE PAGOS — VISTA VISUAL COMPARTIDA

## Objetivo

Permitir revisar la distribución exacta antes de continuar.

## Desktop

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Plan de pagos                                         Total $900.000,50 │
│ 3 cuotas · Financiado                         [✓ Total reconciliado]     │
├──────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐     ┌──────────────────┐     ┌────────────────────┐ │
│ │ PRIMERA CUOTA    │────▶│ CUOTA 2          │────▶│ ÚLTIMA CUOTA       │ │
│ │ 15 ene 2026      │     │ 15 feb 2026      │     │ 15 mar 2026       │ │
│ │ $300.000         │     │ $300.000         │     │ $300.000,50       │ │
│ │                  │     │                  │     │ Ajuste de cierre  │ │
│ └──────────────────┘     └──────────────────┘     └────────────────────┘ │
│                                                                          │
│ Amortización: [desglose oficial cuando corresponda]                     │
│                                                                          │
│ [Editar forma de pago]                         [Confirmar plan de pagos] │
└──────────────────────────────────────────────────────────────────────────┘
```

## Tablet

```text
┌──────────────────────────────────────────────┐
│ Plan de pagos        Total $900.000,50      │
│ [✓ Reconciliado]                            │
├──────────────────────────────────────────────┤
│ [ Primera cuota ]      [ Cuota 2 ]          │
│ [ fecha · importe ]    [ fecha · importe ]  │
│                                              │
│ [ Última cuota — ajuste de cierre ]         │
│ [ fecha · $300.000,50 ]                     │
│                                              │
│ [Editar]                    [Confirmar plan] │
└──────────────────────────────────────────────┘
```

## Celular

```text
┌──────────────────────────────┐
│ Plan de pagos                │
│ Total $900.000,50            │
│ [✓ Reconciliado]             │
├──────────────────────────────┤
│ ● Primera cuota             │
│ │ 15 ene · $300.000         │
│ ● Cuota 2                   │
│ │ 15 feb · $300.000         │
│ ● Última cuota              │
│   15 mar · $300.000,50      │
│   Ajuste de cierre          │
├──────────────────────────────┤
│ [Editar] [Confirmar plan]   │
└──────────────────────────────┘
```

## Componentes

- Total oficial.
- Indicador de reconciliación.
- Primera cuota destacada.
- Cuotas intermedias.
- Última cuota destacada.
- Fechas.
- Amortización cuando corresponda.

## Botones

- `Editar forma de pago`.
- `Confirmar plan de pagos`.

## Tarjetas

- Una tarjeta por cuota o grupo expandible sin ocultar valores.

## Barra de progreso

- Conserva el paso Forma de pago como activo.
- Esta vista no agrega un paso comercial nuevo.

## Resultado esperado

- Plan revisado.
- Suma exacta confirmada.

## Acciones del usuario

- Leer fechas e importes.
- Volver a editar.
- Confirmar.

## Estado vacío

- No se abre sin datos financieros completos.

## Estado de error

- Reconciliación fallida bloquea confirmación.
- Mensaje: `El plan no coincide con el valor total oficial.`
- No ofrecer ajuste automático.

## Estado completado

- Insignia `[✓ Total reconciliado]`.
- Forma de pago queda completa.

---

# 13. BENEFICIOS — ONLINE PASO 5 / FLEX PASO 7

## Objetivo

Permitir elegir únicamente valor agregado autorizado.

## Desktop con opciones

```text
┌──────────────────────────────────────────────┬───────────────────────────┐
│ Paso 5 de 7 / Paso 7 de 9   [● Beneficios] │ PROGRAMA                  │
├──────────────────────────────────────────────┤ Selección completa        │
│ [✓ Forma de pago · confirmada]      Editar  │                           │
│                                              │ INVERSIÓN                 │
│ Para esta negociación puedes ofrecer:       │ VALOR FINAL               │
│                                              │                           │
│ ┌────────────────────┐ ┌────────────────────┐│ BENEFICIOS                │
│ │ Examen autorizado  │ │ Ebooks autorizados││ [✓ Selección 1]          │
│ │ Descripción        │ │ Descripción        ││ [✓ Selección 2]          │
│ │ [Seleccionar]      │ │ [Seleccionar]      ││                           │
│ └────────────────────┘ └────────────────────┘│                           │
│ ┌────────────────────┐                       │                           │
│ │ Campaña vigente    │                       │                           │
│ │ [Seleccionar]      │                       │                           │
│ └────────────────────┘                       │                           │
│ [Atrás]             [Continuar con estos beneficios]                    │
└──────────────────────────────────────────────┴───────────────────────────┘
```

## Desktop sin opciones

```text
┌──────────────────────────────────────────────┬───────────────────────────┐
│ Beneficios disponibles                      │ RESUMEN                   │
├──────────────────────────────────────────────┤ Beneficios · Ninguno      │
│                                              │                           │
│ No hay beneficios adicionales autorizados   │ Valor final · visible     │
│ para esta selección.                        │                           │
│                                              │                           │
│ Puedes continuar con la propuesta oficial.  │                           │
│                                              │                           │
│ [Atrás]                    [Continuar al resumen]                         │
└──────────────────────────────────────────────┴───────────────────────────┘
```

## Tablet

```text
┌──────────────────────────────────────────────┐
│ Beneficios disponibles      [progreso]      │
│ Valor final                        $ —       │
├──────────────────────────────────────────────┤
│ Para esta negociación puedes ofrecer:       │
│ [ Beneficio 1 ] [ Beneficio 2 ]             │
│ [ Campaña vigente ]                         │
│                                              │
│ [Atrás]        [Continuar con seleccionados]│
└──────────────────────────────────────────────┘
```

## Celular

```text
┌──────────────────────────────┐
│ Beneficios · Paso X          │
├──────────────────────────────┤
│ Valor final: $ —      [⌄]    │
│ Para esta negociación       │
│ puedes ofrecer:             │
│                              │
│ [ Beneficio autorizado ]    │
│ [ Seleccionar ]             │
│                              │
│ [ Campaña vigente ]         │
│ [ Seleccionar ]             │
│                              │
│ [Atrás] [Continuar]         │
└──────────────────────────────┘
```

## Componentes

- Encabezado comercial.
- Tarjetas autorizadas.
- Estado de selección.
- Condiciones visibles bajo demanda.
- Resumen de elegidos.

## Botones

- `Seleccionar` / `Retirar`.
- `Ver condiciones`, si aplica.
- `Continuar con estos beneficios`.
- `Continuar al resumen` cuando no haya opciones.

## Tarjetas

- Linguaskill, solo si está autorizado.
- Ebooks, solo Smart Flex y únicamente si están autorizados.
- Cursos cortos, solo después de aprobación futura.
- Campaña del mes, solo activa, vigente y elegible.

## Barra de progreso

- Paso 5 de 7 para Smart Online.
- Paso 7 de 9 para Smart Flex.

## Resultado esperado

- Cero o más beneficios confirmados.
- Ningún cambio en el valor final.

## Acciones del usuario

- Revisar opciones.
- Ver condiciones.
- Seleccionar o retirar.
- Continuar.

## Estado vacío

- Estado neutral, no error.
- Continuación habilitada.

## Estado de error

- Si el motor no puede validar beneficios: ocultar opciones y bloquear su incorporación.
- Permitir continuar sin beneficios si la cotización permanece válida.
- Mensaje: `No fue posible validar beneficios en este momento.`

## Estado completado

- Resumen muestra solo elegidos.
- Paso compacto indica cantidad: `[✓] Beneficios · 2 seleccionados`.

---

# 14. RESUMEN — ONLINE PASO 6 / FLEX PASO 8

## Objetivo

Revisar toda la negociación antes de preparar la propuesta.

## Desktop Smart Online

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Paso 6 de 7 · Resumen                         [Todos los pasos completos]│
├────────────────────────────────────┬─────────────────────────────────────┤
│ PROGRAMA                           │ INVERSIÓN                           │
│ Smart Online              [Editar] │ Valor oficial          $1.000.000  │
│ Duración: 9 meses                  │ Descuento oficial             10 %  │
│                                    │ Ahorro                   $100.000  │
│ CONDICIÓN Y PAGO                   │ VALOR FINAL              $900.000  │
│ Lanzamiento               [Editar] │                                     │
│ Pago único                         │ BENEFICIOS                          │
│ Fecha: 15/01/2026                  │ Beneficio seleccionado      [Editar]│
├────────────────────────────────────┴─────────────────────────────────────┤
│ [Atrás]                              [Continuar a preparar propuesta]    │
└──────────────────────────────────────────────────────────────────────────┘
```

## Desktop Smart Flex

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Paso 8 de 9 · Resumen                                                  │
├────────────────────────────────────┬─────────────────────────────────────┤
│ PROGRAMA                           │ INVERSIÓN                           │
│ Smart Flex                [Editar] │ Valor oficial                      │
│ Modalidad comercial: Score         │ Descuento oficial                  │
│ Nivel de ingreso: A1               │ Ahorro                             │
│ Plan: nombre oficial               │ VALOR FINAL                        │
│ Niveles: rango oficial             │                                     │
│ Horas: valor oficial               │ BENEFICIOS                          │
│                                    │ Solo seleccionados          [Editar]│
│ CONDICIÓN Y PAGO          [Editar] │                                     │
│ Condición · Financiado · N cuotas  │ [Ver plan de pagos]                │
├────────────────────────────────────┴─────────────────────────────────────┤
│ [Atrás]                              [Continuar a preparar propuesta]    │
└──────────────────────────────────────────────────────────────────────────┘
```

## Tablet

```text
┌──────────────────────────────────────────────┐
│ Resumen · Paso final de revisión            │
├──────────────────────────────────────────────┤
│ [ PROGRAMA                         Editar ]  │
│ [ CONDICIÓN Y PAGO                Editar ]  │
│ [ INVERSIÓN · VALOR FINAL         Editar ]  │
│ [ BENEFICIOS                      Editar ]  │
│                                              │
│ [Atrás] [Continuar a preparar propuesta]    │
└──────────────────────────────────────────────┘
```

## Celular

```text
┌──────────────────────────────┐
│ Resumen                      │
├──────────────────────────────┤
│ VALOR FINAL                  │
│ $900.000                     │
│                              │
│ [ Programa          Editar ]│
│ [ Condición y pago  Editar ]│
│ [ Inversión         Detalle]│
│ [ Beneficios        Editar ]│
│                              │
│ [Atrás]                     │
│ [Continuar a propuesta]     │
└──────────────────────────────┘
```

## Componentes

- Bloques Programa, Condición y pago, Inversión y Beneficios.
- Valor final protagonista.
- Acciones Editar por dependencia.
- Enlace al plan de pagos.

## Botones

- `Editar` por bloque.
- `Ver plan de pagos`.
- `Atrás`.
- `Continuar a preparar propuesta`.

## Tarjetas

- Cada bloque funciona como tarjeta de revisión.
- No son controles de selección directa.

## Barra de progreso

- Paso 6 de 7 o 8 de 9 activo.
- Pasos previos completados.

## Resultado esperado

- Cotización completa, válida y reconciliada.

## Acciones del usuario

- Revisar.
- Editar un bloque.
- Consultar plan.
- Continuar.

## Estado vacío

- No debe alcanzarse con datos requeridos vacíos.
- Si ocurre por recuperación de estado, redirigir al primer paso incompleto.

## Estado de error

- Bloque afectado marcado `Requiere revisión`.
- Acción principal deshabilitada con causa visible.

## Estado completado

- Confirmación: `Cotización lista para preparar propuesta`.
- Acción principal habilitada.

---

# 15. PREPARAR PROPUESTA — ONLINE PASO 7 / FLEX PASO 9

## Objetivo

Capturar los datos autorizados para personalizar la propuesta.

## Desktop

```text
┌──────────────────────────────────────────────┬───────────────────────────┐
│ Paso final · Preparar propuesta             │ RESUMEN CONFIRMADO        │
├──────────────────────────────────────────────┤ Programa                  │
│ DATOS DEL CLIENTE                           │ Condición y pago          │
│ Nombre completo *  [____________________]   │ Beneficios seleccionados  │
│ Teléfono           [____________________]   │                           │
│ Correo electrónico [____________________]   │ VALOR FINAL               │
│                                              │ $ —                       │
│ DATOS DEL ASESOR                            │                           │
│ Nombre *            [____________________]   │ [Ver resumen completo]    │
│ Sede *              [____________________]   │                           │
│ Correo institucional*[____________________]  │                           │
│ Celular corporativo*[____________________]   │                           │
│                                              │                           │
│ [Atrás]              [Preparar Propuesta Comercial]                      │
└──────────────────────────────────────────────┴───────────────────────────┘
```

## Tablet

```text
┌──────────────────────────────────────────────┐
│ Preparar Propuesta Comercial                │
│ Resumen · Valor final $ —                   │
├──────────────────────────────────────────────┤
│ DATOS DEL CLIENTE                           │
│ [Nombre completo *]                         │
│ [Teléfono] [Correo electrónico]             │
│                                              │
│ DATOS DEL ASESOR                            │
│ [Nombre *] [Sede *]                         │
│ [Correo institucional *]                    │
│ [Celular corporativo *]                     │
│                                              │
│ [Atrás] [Preparar Propuesta Comercial]      │
└──────────────────────────────────────────────┘
```

## Celular

```text
┌──────────────────────────────┐
│ Preparar propuesta           │
├──────────────────────────────┤
│ Valor final: $ —      [⌄]    │
│ CLIENTE                      │
│ [Nombre completo *]         │
│ [Teléfono]                  │
│ [Correo]                    │
│                              │
│ ASESOR                       │
│ [Nombre *]                  │
│ [Sede *]                    │
│ [Correo institucional *]    │
│ [Celular corporativo *]     │
│                              │
│ [Preparar Propuesta         ]│
│ [Comercial                  ]│
└──────────────────────────────┘
```

## Componentes

- Sección Cliente.
- Sección Asesor.
- Resumen confirmado.
- Indicadores de obligatoriedad.
- Mensajes de privacidad y uso local si están aprobados.

## Botones

- `Atrás`.
- `Ver resumen completo`.
- `Preparar Propuesta Comercial`.

## Tarjetas

- Cliente y Asesor se agrupan en tarjetas de información.
- No convertir cada campo en una tarjeta.

## Barra de progreso

- Último paso activo.
- Todos los anteriores completados.

## Resultado esperado

- Datos obligatorios válidos.
- Vista previa generada localmente.

## Acciones del usuario

- Ingresar datos.
- Revisar resumen.
- Preparar propuesta.

## Estado vacío

- Campos en blanco con etiquetas persistentes.
- No utilizar el placeholder como única etiqueta.

## Estado de error

- Nombre de cliente requerido.
- Datos obligatorios de asesor requeridos.
- Formato de correo inválido.
- Mensajes en contexto y foco al primer error.

## Estado completado

- Todos los campos válidos.
- Botón principal habilitado.
- Transición a vista previa.

---

# 16. VISTA PREVIA DE PROPUESTA

## Objetivo

Permitir revisar el documento exacto antes de imprimir o guardar como PDF.

## Desktop

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Vista previa de la propuesta                         [Cerrar vista previa]│
├──────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────┐  ┌───────────────────────────────────────────────────┐ │
│ │ PÁGINAS       │  │                                                   │ │
│ │               │  │                 PÁGINA 1                          │ │
│ │ [● Página 1]  │  │     Propuesta Comercial Personalizada            │ │
│ │ [○ Página 2]  │  │                                                   │ │
│ │               │  │     Cliente · Asesor · Programa                  │ │
│ │ Validaciones  │  │                                                   │ │
│ │ [✓] Datos     │  │     VALOR FINAL                                  │ │
│ │ [✓] Importes  │  │                                                   │ │
│ │ [✓] Beneficios│  │     Beneficios · Mensaje · Acción                │ │
│ └───────────────┘  └───────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────┤
│ [Volver a editar]                [Imprimir o guardar como PDF]           │
└──────────────────────────────────────────────────────────────────────────┘
```

## Tablet

```text
┌──────────────────────────────────────────────┐
│ Vista previa                    [Cerrar]     │
│ [Página 1] [Página 2]                       │
├──────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────┐ │
│ │                                          │ │
│ │ Documento escalado al ancho             │ │
│ │ Página seleccionada                     │ │
│ │                                          │ │
│ └──────────────────────────────────────────┘ │
│ [✓ Datos] [✓ Importes] [✓ Beneficios]       │
│ [Editar]       [Imprimir o guardar como PDF]│
└──────────────────────────────────────────────┘
```

## Celular

```text
┌──────────────────────────────┐
│ Vista previa         [Cerrar]│
│ [1 de 2] [Página siguiente] │
├──────────────────────────────┤
│ ┌──────────────────────────┐ │
│ │ Propuesta escalada       │ │
│ │                          │ │
│ │ Lectura vertical         │ │
│ │ Ampliación disponible    │ │
│ └──────────────────────────┘ │
│ [✓ Documento validado]      │
│ [Volver a editar]           │
│ [Imprimir / guardar PDF]    │
└──────────────────────────────┘
```

## Componentes

- Navegador de páginas.
- Lienzo de vista previa.
- Estado de validación.
- Controles de edición y salida.

## Botones

- `Cerrar vista previa`.
- `Página anterior`.
- `Página siguiente`.
- `Volver a editar`.
- `Imprimir o guardar como PDF`.

## Tarjetas

- Miniaturas de páginas en Desktop.
- Indicadores de validación.

## Barra de progreso

- Wizard terminado.
- Mostrar `Propuesta lista` en vez de un paso adicional numerado.

## Resultado esperado

- Documento revisado.
- Datos coinciden con la cotización.
- Salida disponible.

## Acciones del usuario

- Navegar páginas.
- Revisar.
- Volver a editar.
- Abrir impresión.

## Estado vacío

- Mientras se compone, mostrar `Preparando vista previa…` solo si existe demora perceptible.
- No mostrar un documento parcialmente poblado.

## Estado de error

- `No fue posible preparar la vista previa.`
- Conservar todos los datos.
- Acciones: `Reintentar` y `Volver a editar`.

## Estado completado

- Indicadores de datos, importes y beneficios confirmados.
- Botón de salida habilitado.

---

# 17. DOCUMENTO FINAL — PÁGINA 1

## Objetivo

Comunicar la propuesta comercial con jerarquía, confianza y orientación al cierre.

## Wireframe de página

```text
┌──────────────────────────────────────────────────────────────┐
│ SMART                                      Fecha             │
│ Calculadora Comercial                                        │
├──────────────────────────────────────────────────────────────┤
│ PROPUESTA COMERCIAL PERSONALIZADA                            │
│ Gracias por confiar en Smart.                                │
│ Hemos preparado esta propuesta de acuerdo con la información│
│ compartida durante tu proceso de asesoría.                   │
├──────────────────────────────────────────────────────────────┤
│ CLIENTE                              ASESOR                   │
│ Nombre                               Nombre · Sede            │
├──────────────────────────────────────────────────────────────┤
│ PROGRAMA SELECCIONADO                                        │
│ Smart Online / Smart Flex                                   │
│ Plan o duración · Niveles y horas cuando corresponda        │
├──────────────────────────────────────────────────────────────┤
│ INVERSIÓN                                                    │
│ Valor de lista       Descuento       Ahorro                  │
│                                                              │
│                  VALOR FINAL                                 │
│                  $ valor oficial                             │
│                                                              │
│ Forma de pago                                                │
├──────────────────────────────────────────────────────────────┤
│ BENEFICIOS SELECCIONADOS                                     │
│ [ Beneficio confirmado ] [ Beneficio confirmado ]           │
├──────────────────────────────────────────────────────────────┤
│ Si tienes alguna inquietud sobre esta propuesta, tu asesor   │
│ estará disponible para acompañarte en el siguiente paso de   │
│ tu proceso de matrícula.                                    │
├──────────────────────────────────────────────────────────────┤
│ Datos de contacto del asesor                                 │
└──────────────────────────────────────────────────────────────┘
```

## Componentes

- Identidad autorizada.
- Título y subtítulo oficiales.
- Cliente y asesor.
- Programa.
- Inversión.
- Beneficios seleccionados.
- Llamado a la acción.
- Contacto.

## Botones

- Ninguno dentro del documento.
- Los controles pertenecen a la vista previa.

## Tarjetas

- Programa.
- Inversión.
- Beneficios confirmados.

## Barra de progreso

- No aparece en el documento final.

## Resultado esperado

- Primera página comercial legible en impresión y celular.

## Acciones del usuario

- El asesor revisa desde la vista previa.
- El cliente lee la propuesta.

## Estado vacío

- Campos opcionales ausentes no dejan etiquetas vacías.
- Secciones sin beneficios no inventan contenido.

## Estado de error

- La página no se genera si falta un dato obligatorio.

## Estado completado

- Contenido comercial completo y sin datos técnicos internos.

---

# 18. DOCUMENTO FINAL — PÁGINA 2

## Objetivo

Presentar el detalle técnico y financiero con claridad.

## Wireframe de página

```text
┌──────────────────────────────────────────────────────────────┐
│ SMART                         DETALLE DE LA PROPUESTA         │
├──────────────────────────────────────────────────────────────┤
│ INFORMACIÓN DEL PROGRAMA                                     │
│ Programa · Plan · Modalidad comercial · Nivel de ingreso     │
│ Solo los datos aplicables                                    │
├──────────────────────────────────────────────────────────────┤
│ CONDICIÓN COMERCIAL                                          │
│ Condición oficial · Forma de pago                            │
├──────────────────────────────────────────────────────────────┤
│ PLAN DE PAGOS                                                │
│                                                              │
│ [ Primera cuota ]  [ Cuotas siguientes ]  [ Última cuota ]  │
│ fecha · importe     fechas · importes      fecha · importe   │
│                                      ajuste de cierre        │
│                                                              │
│ Total reconciliado: valor oficial                            │
├──────────────────────────────────────────────────────────────┤
│ OBSERVACIONES                                                │
│ Solo observaciones autorizadas y relevantes                  │
├──────────────────────────────────────────────────────────────┤
│ NOTAS                                                        │
│ Alcance de propuesta · vigencia · condiciones autorizadas    │
├──────────────────────────────────────────────────────────────┤
│ Referencia interna discreta, no estructura del Excel         │
└──────────────────────────────────────────────────────────────┘
```

## Componentes

- Detalle del programa.
- Condición comercial.
- Plan de pagos visual.
- Observaciones.
- Notas.
- Trazabilidad permitida por la especificación editorial.

## Botones

- Ninguno dentro de la página.

## Tarjetas

- Primera cuota.
- Grupo de cuotas siguientes.
- Última cuota.

## Barra de progreso

- No aparece.

## Resultado esperado

- Detalle comprensible sin apariencia de Excel.

## Acciones del usuario

- Revisar importes y fechas.

## Estado vacío

- Para pago único, sustituir el plan por una tarjeta `Pago único`.
- No mostrar columnas, cuotas o fechas inexistentes.

## Estado de error

- Reconciliación fallida impide construir la página.

## Estado completado

- Todas las cuotas suman exactamente el total.
- Última cuota conserva centavos y ajuste cuando aplica.

---

# 19. SALIDA FINAL

## Objetivo

Cerrar el recorrido después de abrir la impresión o guardar mediante impresión.

## Desktop

```text
┌──────────────────────────────────────────────────────────────┐
│                         [✓]                                  │
│                 Propuesta preparada                          │
│                                                              │
│ Verifica en el diálogo del navegador si deseas imprimir      │
│ o guardar el documento como PDF.                             │
│                                                              │
│ [Volver a vista previa]       [Crear nueva cotización]       │
└──────────────────────────────────────────────────────────────┘
```

## Tablet

```text
┌──────────────────────────────────────────────┐
│ [✓] Propuesta preparada                     │
│ Revisa el diálogo de impresión.             │
│                                              │
│ [Volver a vista previa]                     │
│ [Crear nueva cotización]                    │
└──────────────────────────────────────────────┘
```

## Celular

```text
┌──────────────────────────────┐
│ [✓]                          │
│ Propuesta preparada          │
│                              │
│ Revisa las opciones de      │
│ impresión del dispositivo.  │
│                              │
│ [Volver a vista previa]     │
│ [Nueva cotización]          │
└──────────────────────────────┘
```

## Componentes

- Confirmación.
- Instrucción neutral.
- Regreso a vista previa.
- Nueva cotización.

## Botones

- `Volver a vista previa`.
- `Crear nueva cotización`.

## Tarjetas

- No se requieren tarjetas comerciales.

## Barra de progreso

- Estado completo.
- No mostrar un paso adicional ficticio.

## Resultado esperado

- El asesor comprende que la salida depende del diálogo local del navegador.

## Acciones del usuario

- Volver a revisar.
- Iniciar una nueva cotización.

## Estado vacío

- No aplica.

## Estado de error

- Si el diálogo no se abre, mantener la vista previa.
- Mensaje: `No fue posible abrir las opciones de impresión.`
- Acción: `Intentar nuevamente`.

## Estado completado

- Confirmación visual sin afirmar que un archivo se guardó cuando el navegador no puede verificarlo.

---

# 20. ESTADOS TRANSVERSALES

## 20.1. Paso pendiente

```text
┌────────────────────────────────────┐
│ [—] Forma de pago                  │
│ Completa la condición comercial    │
│ para ver las opciones disponibles. │
└────────────────────────────────────┘
```

- No es interactivo.
- No se presenta como error.
- Explica su dependencia.

## 20.2. Paso actual

```text
┌────────────────────────────────────┐
│ [●] Condición comercial            │
│ Selecciona una opción para avanzar.│
└────────────────────────────────────┘
```

- Recibe el foco.
- Contiene la única acción principal.

## 20.3. Paso completado

```text
┌────────────────────────────────────┐
│ [✓] Duración · 9 meses      Editar│
└────────────────────────────────────┘
```

- Compacto.
- Editable.
- Conserva el valor elegido.

## 20.4. Paso que requiere revisión

```text
┌────────────────────────────────────┐
│ [!] Beneficios                     │
│ Una selección dejó de estar        │
│ disponible.                 Revisar│
└────────────────────────────────────┘
```

- Bloquea únicamente etapas dependientes.
- Explica la causa sin exponer reglas internas.

## 20.5. Sin resultados oficiales

```text
┌────────────────────────────────────┐
│ No hay opciones disponibles        │
│ para esta combinación.             │
│                                    │
│ [Cambiar selección anterior]       │
└────────────────────────────────────┘
```

- No inventa una alternativa.
- Facilita corregir la dependencia inmediata.

## 20.6. Error de datos oficiales

```text
┌────────────────────────────────────┐
│ [!] No fue posible validar los     │
│ datos oficiales.                   │
│                                    │
│ [Reintentar] [Volver]              │
└────────────────────────────────────┘
```

- No muestra información parcial como definitiva.
- Preserva selecciones seguras.

## 20.7. Confirmación de cambio destructivo

```text
┌────────────────────────────────────┐
│ Cambiar esta selección actualizará │
│ el plan, el pago y los beneficios. │
│                                    │
│ [Conservar selección] [Cambiar]    │
└────────────────────────────────────┘
```

- Solo se usa cuando el cambio elimina trabajo significativo.
- Enumera las dependencias afectadas.

## 20.8. Reinicio

```text
┌────────────────────────────────────┐
│ ¿Crear una nueva cotización?       │
│ Se limpiarán las selecciones       │
│ actuales.                          │
│                                    │
│ [Cancelar] [Crear nueva]           │
└────────────────────────────────────┘
```

- Nunca reinicia sin confirmación cuando hay avance.

---

# 21. MAPA DE RECORRIDOS

## Smart Online

```text
INICIO
  │
  ▼
LÍNEA: SMART ONLINE
  │
  ▼
DURACIÓN
  │
  ▼
CONDICIÓN COMERCIAL
  │
  ▼
FORMA DE PAGO
  ├── Pago único ───────────────┐
  └── Financiado ─ Plan visual ─┤
                                ▼
BENEFICIOS AUTORIZADOS
  │
  ▼
RESUMEN
  │
  ▼
PREPARAR PROPUESTA
  │
  ▼
VISTA PREVIA
  │
  ▼
PÁGINA 1 + PÁGINA 2
  │
  ▼
IMPRESIÓN / GUARDADO COMO PDF
```

## Smart Flex

```text
INICIO
  │
  ▼
LÍNEA: SMART FLEX
  │
  ▼
NIVEL DE INGRESO
  │
  ▼
TARIFA: SCORE / MP
  │
  ▼
PLAN COMPATIBLE
  │
  ▼
CONDICIÓN COMERCIAL
  │
  ▼
FORMA DE PAGO
  ├── Pago único ───────────────┐
  └── Financiado ─ Plan visual ─┤
                                ▼
BENEFICIOS AUTORIZADOS
  │
  ▼
RESUMEN
  │
  ▼
PREPARAR PROPUESTA
  │
  ▼
VISTA PREVIA
  │
  ▼
PÁGINA 1 + PÁGINA 2
  │
  ▼
IMPRESIÓN / GUARDADO COMO PDF
```

---

# 22. MATRIZ DE ADAPTACIÓN RESPONSIVE

| Elemento | Desktop | Tablet | Celular |
|---|---|---|---|
| Navegación | Progreso completo | Contador y barra | Contador compacto |
| Área principal | Columna amplia | Una columna | Una columna |
| Resumen | Lateral persistente | Superior compacto | Plegable, valor visible |
| Dos tarjetas | Una fila | Una fila | Apiladas |
| Tres tarjetas | Tres columnas | Dos columnas | Apiladas |
| Acción principal | Pie del contenido | Pie del contenido | Inferior adherente segura |
| Paso anterior | Fila compacta | Fila compacta | Resumen mínimo |
| Plan de pagos | Línea o cuadrícula | Cuadrícula | Línea vertical |
| Vista previa | Página y miniaturas | Página y pestañas | Una página y paginador |
| PDF final | Tamaño de página | Escalado al ancho | Escalado y ampliable |

Reglas de decisión:

- El contenido determina el salto de columnas.
- Ninguna tarjeta reduce texto para conservar una fila.
- Ningún importe se trunca.
- Ninguna fecha se parte de forma ambigua.
- El teclado móvil no debe cubrir la acción ni el error activo.
- El resumen móvil se abre sin perder la posición del paso.
- La vista previa no exige desplazamiento horizontal para comprender su jerarquía.

---

# 23. MATRIZ DE ACCIONES PRINCIPALES

| Pantalla | Acción principal |
|---|---|
| Inicio | Comenzar en la tarjeta elegida |
| Línea | Seleccionar línea |
| Duración | Seleccionar duración |
| Nivel | Seleccionar nivel |
| Tarifa | Seleccionar SCORE o MP |
| Plan | Seleccionar plan |
| Condición | Seleccionar condición |
| Pago único | Continuar |
| Financiado | Ver o confirmar plan de pagos |
| Beneficios con opciones | Continuar con estos beneficios |
| Beneficios sin opciones | Continuar al resumen |
| Resumen | Continuar a preparar propuesta |
| Datos de propuesta | Preparar Propuesta Comercial |
| Vista previa | Imprimir o guardar como PDF |
| Salida | Crear nueva cotización |

No deberán coexistir dos botones con el mismo peso visual.

Editar, Atrás, Cerrar, Ver detalle y Reintentar son acciones secundarias.

---

# 24. CRITERIOS DE APROBACIÓN DEL WIREFRAME

- Todas las pantallas tienen un objetivo único.
- Todas las pantallas indican su acción principal.
- Inicio permite elegir únicamente Smart Online o Smart Flex.
- El Wizard diferencia correctamente los recorridos de 7 y 9 macroetapas.
- Los subpasos financieros no alteran la numeración comercial.
- Smart Online no expone variables de Smart Flex.
- Smart Flex solicita nivel antes de SCORE o MP.
- SCORE y MP utilizan tarjetas.
- Los planes dependen de nivel y modalidad.
- Las condiciones conservan el orden oficial.
- Las formas de pago muestran solo opciones válidas.
- Pago único no simula financiación.
- Financiación presenta primera cuota, cuotas siguientes y última cuota.
- Las fechas son visibles y comprensibles.
- El ajuste de cierre se identifica cuando corresponde.
- El plan reconcilia exactamente con el valor oficial.
- Los beneficios nunca cambian importes.
- Solo aparecen beneficios autorizados.
- Los beneficios no aprobados permanecen fuera de la interfaz.
- El resumen incluye solo beneficios seleccionados.
- El valor final es protagonista.
- El resumen permanece accesible en los tres tamaños.
- Cada dato editable conduce al paso que lo originó.
- Editar conserva datos independientes.
- Los vacíos tienen tratamiento explícito.
- Los errores explican cómo corregirlos.
- Los estados completados son compactos y editables.
- La propuesta se prepara antes de imprimirse.
- La vista previa siempre antecede a la impresión.
- La propuesta no se presenta como factura o contrato.
- El PDF final tiene dos páginas cuando el contenido definido lo requiere.
- Los controles de la aplicación no aparecen impresos.
- La versión móvil no tiene desplazamiento horizontal funcional.
- La versión Tablet mantiene acciones táctiles cómodas.
- La versión Desktop aprovecha el espacio sin saturación.
- El foco y los estados no dependen solo del color.
- Las etiquetas permanecen visibles al introducir datos.
- No se utilizan recursos remotos.
- No se expone la estructura del Excel.
- Ningún wireframe implica una nueva regla comercial.

---

# 25. RESULTADO DOCUMENTAL

Este plano define el sistema completo desde el inicio hasta la propuesta final.

La futura implementación deberá reproducir:

- la progresión por una decisión principal;
- la separación entre Smart Online y Smart Flex;
- el resumen persistente;
- el tratamiento visual del plan de pagos;
- la selección controlada de beneficios;
- la revisión final;
- la vista previa;
- la salida local mediante impresión.

Cualquier diferencia funcional deberá aprobarse primero en `PRODUCT_DECISIONS.md`.

Cualquier nueva regla de beneficios deberá aprobarse y configurarse según `COMMERCIAL_ENGINE.md`.

Cualquier cambio editorial de la propuesta deberá respetar `PDF_DESIGN_SPEC.md`.

Este documento no autoriza implementación ni modifica el comportamiento actual.
