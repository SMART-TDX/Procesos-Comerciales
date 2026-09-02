# ANÁLISIS Y NORMALIZACIÓN DE TARIFAS

## 1. Propósito y alcance

Este documento registra el análisis completo realizado durante la Fase 1 del motor de datos de CALCULADORA COMERCIAL SMART 2026.

El objetivo de esta fase fue leer los tres libros oficiales, reconocer sus estructuras comerciales, normalizar los registros vigentes en un único modelo, preservar su trazabilidad y documentar todo dato descartado o inconsistente.

No se generó `tarifas.js`, HTML, CSS ni JavaScript de la aplicación. Tampoco se desarrolló la interfaz.

Los Excel ubicados en `ORIGINALES_NO_MODIFICAR/` se abrieron exclusivamente para lectura. No fueron modificados, recalculados, guardados, sobrescritos ni eliminados.

## 2. Fuentes analizadas

Se analizaron los siguientes archivos protegidos:

| Archivo | SHA-256 |
|---|---|
| `Tarifas Smart Flex - 2026 - MP.xlsx` | `53c3ca13781a9a9afd64dd3dc57e048713b0a5233364efcd1f677ec3a78cf9ec` |
| `Tarifas Smart Flex - 2026 - Score.xlsx` | `8b689d0865d92b4878a09797a77f83039e0dc36bffd85d75eff02dc9bccd0e5c` |
| `Tarifas Smart Online.xlsx` | `4814f71d28c28fd059cc0c24dd403f3646138a2de534c2b15fa0de4f94df5d67` |

Los hashes permiten comprobar en futuras regeneraciones que se procesaron exactamente las mismas fuentes.

## 3. Resumen ejecutivo del análisis

| Métrica | Resultado |
|---|---:|
| Libros analizados | 3 |
| Hojas analizadas | 15 |
| Hojas comerciales activas o complementarias | 6 |
| Hojas auxiliares de soporte | 4 |
| Hojas históricas o no vigentes descartadas | 5 |
| Registros normalizados encontrados | 664 |
| Registros descartados | 258 |
| Inconsistencias comerciales | 193 |
| Registros válidos | 471 |
| Registros válidos con advertencia | 11 |
| Registros inválidos | 182 |

Los 664 registros encontrados incluyen todos los registros de las fuentes comerciales 2026 seleccionadas, incluso aquellos marcados como inválidos. Los registros inválidos se conservan para auditoría, pero su estado impide considerarlos aptos para publicación hasta que exista una corrección oficial.

## 4. Metodología aplicada

El proceso se ejecutó en las siguientes etapas:

1. Se localizaron exactamente tres archivos `.xlsx` dentro de `ORIGINALES_NO_MODIFICAR/`.
2. Se calculó el hash SHA-256 de cada archivo.
3. Cada libro se abrió dos veces en memoria: una lectura conservó las fórmulas y otra obtuvo los valores evaluados guardados por Excel.
4. Se recorrieron todas las hojas, incluidas las ocultas.
5. Se inventariaron dimensiones, celdas con contenido, combinaciones, fórmulas, filas vacías internas y columnas sin datos usadas como separadores.
6. Se identificaron títulos, encabezados repetidos y bloques comerciales mediante su contenido, no mediante posiciones asumidas globalmente.
7. Se clasificó cada hoja como fuente comercial activa, fuente complementaria, soporte de cálculo o fuente histórica/no vigente.
8. Se aplicó un extractor específico a cada patrón estructural detectado.
9. Los nombres, espacios y saltos de línea se normalizaron sin alterar su significado comercial.
10. Los registros se enriquecieron con dimensiones de producto, modalidad, variante, segmento, plan, niveles, horas y financiación.
11. Cada registro conservó archivo, hash, hoja, fila aproximada, bloque, celdas y fórmulas de origen.
12. Se validaron campos obligatorios, errores de fórmula, totales, descuentos, planes de pago, valores por hora y claves comerciales repetidas.
13. Se generaron un modelo JSON y un reporte de calidad JSON.

No se recalculó ninguna cifra faltante mediante aproximaciones. Cuando el Excel presentó un error, una celda vacía o una ambigüedad, el modelo conservó el problema y marcó el registro correspondiente.

## 5. Hallazgos estructurales globales

En las 15 hojas se detectaron:

- 641 rangos de celdas combinadas.
- 5.673 celdas con fórmulas.
- 208 filas completamente vacías dentro de los intervalos con información.
- 112 apariciones de columnas completamente vacías utilizadas como separadores dentro de las dimensiones declaradas de las hojas.
- 1.358 celdas de fórmula cuyo valor guardado por Excel es un error.
- encabezados de dos y tres niveles;
- bloques comerciales repetidos horizontal y verticalmente;
- títulos y nombres de planes repetidos entre segmentos;
- dimensiones de hoja infladas por formato aplicado a filas y columnas sin información comercial;
- hojas visibles de tarifas, hojas ocultas de soporte y hojas ocultas históricas.

Las repeticiones de nombres entre segmentos no se trataron como duplicados por sí solas. Una misma denominación puede aparecer legítimamente para público, alianza, convenio, preventa o colaborador. La clave normalizada incluye el bloque comercial, el segmento, la modalidad, la variante y el número de cuotas.

Después de incorporar esas dimensiones no se encontraron registros exactamente duplicados ni claves comerciales conflictivas dentro del modelo final.

## 6. Inventario y clasificación de hojas

### 6.1. Tarifas Smart Flex - 2026 - MP.xlsx

| Hoja | Estado | Dimensión declarada | Combinadas | Fórmulas | Clasificación | Registros normalizados |
|---|---|---:|---:|---:|---|---:|
| `Incre IPC 2025` | Oculta | 220 × 10 | 3 | 62 | Soporte de cálculo | 0 |
| `Tarifas Nuevas Ing Flex Pack` | Visible | 934 × 34 | 35 | 994 | Fuente comercial activa | 164 |
| `Tarifas Nuevas Flex Nivel-Nivel` | Visible | 1000 × 34 | 103 | 1.472 | Fuente comercial activa con bloque auxiliar descartado | 116 |
| `Modelo actual Smart Flex` | Visible | 1000 × 56 | 135 | 1.123 | Fuente comercial activa, afectada por referencias rotas | 180 |

`Incre IPC 2025` contiene parámetros y cálculos intermedios; no representa cotizaciones finales por sí misma.

`Tarifas Nuevas Ing Flex Pack` organiza planes verticalmente y cuatro segmentos horizontalmente: público, alianza masiva, convenio empresarial y colaborador.

`Tarifas Nuevas Flex Nivel-Nivel` contiene cinco bloques con encabezado comercial: inicio A1 a C1, inicio A2 a C1, inicio B1 a C1, inicio B2 a C1 e inicio C1. Después del bloque oficial existe otra zona en filas 109–154, separada por más de treinta filas vacías, sin título de campaña ni encabezados comerciales. Sus 34 filas candidatas se descartaron y quedaron trazadas.

`Modelo actual Smart Flex` organiza cada plan en un bloque vertical y repite cinco segmentos horizontalmente: público, alianza masiva, convenio empresarial, preventa y colaborador.

### 6.2. Tarifas Smart Flex - 2026 - Score.xlsx

| Hoja | Estado | Dimensión declarada | Combinadas | Fórmulas | Clasificación | Registros normalizados |
|---|---|---:|---:|---:|---|---:|
| `IPC 2025` | Oculta | 7 × 7 | 1 | 20 | Soporte de cálculo | 0 |
| `T. Smart Flex - Ing` | Visible | 977 × 56 | 150 | 1.123 | Fuente comercial activa | 180 |

`IPC 2025` es una hoja auxiliar. `T. Smart Flex - Ing` utiliza el mismo patrón amplio de planes y cinco segmentos, pero pertenece a la variante comercial `SCORE`. La variante se mantiene separada de `MP`; no se mezclaron tarifas entre ambos libros.

### 6.3. Tarifas Smart Online.xlsx

| Hoja | Estado | Dimensión declarada | Combinadas | Fórmulas | Clasificación | Registros normalizados |
|---|---|---:|---:|---:|---|---:|
| `Incre IPC 2025` | Oculta | 220 × 7 | 2 | 32 | Soporte de cálculo | 0 |
| `Resumen Inst` | Oculta | 5 × 15 | 4 | 32 | Soporte de cálculo | 0 |
| `Tarifas Instituto 2024` | Oculta | 273 × 45 | 108 | 585 | Histórica/no vigente | 0 |
| `Tarifas 2X1` | Oculta | 233 × 21 | 14 | 34 | Campaña histórica/no confirmada para 2026 | 0 |
| `Tarifas Rescate` | Oculta | 233 × 21 | 14 | 34 | Campaña histórica/no confirmada para 2026 | 0 |
| `Tarifas Smart Online 2026` | Visible | 223 × 29 | 35 | 60 | Fuente comercial activa | 19 |
| `Tarifas Cursos Cortos 2026` | Visible | 220 × 26 | 6 | 5 | Fuente comercial complementaria | 5 |
| `Tarifas Examenes 2024` | Oculta | 222 × 26 | 3 | 0 | Histórica/no vigente | 0 |
| `Tarifas Planes Examanes 2023 UD` | Oculta | 52 × 9 | 28 | 97 | Histórica/no vigente | 0 |

`Incre IPC 2025` y `Resumen Inst` son hojas auxiliares. Las hojas cuyo nombre y contenido indican 2023 o 2024 no se incorporaron a un catálogo oficial 2026.

Las campañas ocultas `Tarifas 2X1` y `Tarifas Rescate` contienen títulos 2024 y no existe una confirmación visible de vigencia 2026. Se preservaron como hallazgos descartados, sin asumir su activación.

`Tarifas Smart Online 2026` contiene tres segmentos: público contado, público financiado/Tu Plan Tus Cuotas y convenios.

`Tarifas Cursos Cortos 2026` se incluyó como fuente complementaria vigente porque es visible, está identificada explícitamente como 2026 y contiene valores comerciales. Se mantiene bajo el producto `CURSO_CORTO`, separado de Smart Online, para que el alcance de la interfaz pueda decidir posteriormente si lo presenta.

## 7. Patrones comerciales detectados

### 7.1. Matriz compacta Smart Flex

Usada por `Tarifas Nuevas Ing Flex Pack` y `Tarifas Nuevas Flex Nivel-Nivel`.

- El plan y el valor full plan aparecen a la izquierda.
- Los segmentos se repiten horizontalmente.
- Una celda de plan combinada puede cubrir varias filas de financiación.
- El nombre del plan debe propagarse únicamente dentro de su bloque.
- Las columnas C, K, S y AA actúan como separadores.
- Cada segmento contiene cuotas, descuento, cuota inicial, valor de cuotas, valor total, valor hora e intensidad máxima mensual.

### 7.2. Matriz amplia Smart Flex

Usada por `Modelo actual Smart Flex` y `T. Smart Flex - Ing`.

- Cada plan tiene una fila de título, una fila de encabezados y varias filas de financiación.
- Los segmentos comienzan en C, N, Y, AJ y AU.
- Existen grupos de columnas separadoras entre segmentos.
- El mismo plan se repite conceptualmente en los cinco segmentos.
- La variante `MP` o `SCORE` forma parte obligatoria de la clave.

### 7.3. Matriz Smart Online

Usada por `Tarifas Smart Online 2026`.

- Los planes de 6, 9 y 12 meses se organizan verticalmente.
- Los segmentos comienzan en C, L y U.
- El número de columnas cambia dentro del segmento público contado: los planes de 6 y 9 meses usan una estructura más corta que el plan de 12 meses.
- Los encabezados determinan la ubicación del valor total; no se asumió una columna fija para todos los planes.

### 7.4. Tabla simple de cursos cortos

Usada por `Tarifas Cursos Cortos 2026`.

- Una fila corresponde a un curso.
- Se conservaron valor, duración, horario, mínimo de estudiantes, nivel requerido y referencia de información.
- Los valores dependientes de fórmulas se tomaron del valor evaluado guardado por Excel.

## 8. Normalización aplicada

La normalización no cambia valores comerciales. Aplica únicamente reglas estructurales:

- elimina espacios duplicados y saltos de línea innecesarios en textos;
- conserva el nombre legible original del plan;
- crea identificadores técnicos estables y legibles;
- separa producto, modalidad, variante, segmento y bloque comercial;
- interpreta números como valores numéricos, no como textos formateados;
- extrae horas, niveles, cantidad de niveles o duración en meses cuando están explícitos en el nombre del plan;
- conserva valores nulos cuando la fuente no aporta un dato válido;
- mantiene las fórmulas de origen en la trazabilidad;
- conserva errores de evaluación como evidencia;
- asigna a cada registro un estado `VALIDO`, `CON_ADVERTENCIA` o `INVALIDO`.

No se corrigieron ortografía, nombres comerciales, fórmulas ni importes dentro de los Excel. Por ejemplo, textos como “Intemerdio” o “Bussines” permanecen como evidencia de origen y pueden documentarse posteriormente mediante etiquetas de presentación sin cambiar la fuente.

## 9. Estructura final del modelo de datos

El archivo `datos/modelo_tarifas_normalizado.json` contiene dos niveles principales:

### 9.1. Metadatos

- `version_modelo`
- `generado_desde`
- `archivos[]`
  - `archivo`
  - `sha256`
- `cantidad_hojas_analizadas`
- `cantidad_registros`
- `cantidad_descartados`
- `cantidad_inconsistencias`

### 9.2. Registros

Cada elemento de `registros[]` contiene:

- `id`: identificador técnico del registro.
- `producto`: `SMART_FLEX`, `SMART_ONLINE` o `CURSO_CORTO`.
- `modalidad`: tipo de estructura comercial, como `FLEX_PACK`, `NIVEL_A_NIVEL`, `MODELO_ACTUAL`, `PLAN_MENSUAL` o `CURSO_CORTO_2026`.
- `variante_fuente`: `MP`, `SCORE` u `ONLINE_2026`.
- `segmento`: público, alianza, convenio, preventa, colaborador o equivalente.
- `bloque_comercial`: título del bloque que contextualiza el registro.
- `plan`: nombre comercial normalizado en espacios, sin alterar su contenido.
- `horas_plan`: horas explícitas en el nombre, si existen.
- `niveles[]`: niveles explícitos detectados.
- `cantidad_niveles`: cantidad explícita, si existe.
- `duracion_meses`: duración explícita, si existe.
- `numero_cuotas`
- `descuento`
- `valor_full_plan`
- `cuota_inicial`
- `valor_cuota`
- `valor_total`
- `valor_hora`
- `intensidad_mensual`
- `atributos`: campos específicos de una modalidad, como duración o nivel requerido de cursos cortos.
- `estado_validacion`: `VALIDO`, `CON_ADVERTENCIA` o `INVALIDO`.
- `codigos_inconsistencia[]`: códigos que explican el estado.
- `trazabilidad`
  - `archivo`
  - `sha256_archivo`
  - `hoja`
  - `fila_aproximada`
  - `bloque`
  - `celdas`
  - `formulas`
  - `errores_evaluacion`

## 10. Distribución de los 664 registros encontrados

| Producto | Modalidad | Variante | Registros |
|---|---|---|---:|
| Smart Flex | Flex Pack | MP | 164 |
| Smart Flex | Nivel a nivel | MP | 116 |
| Smart Flex | Modelo actual | MP | 180 |
| Smart Flex | Modelo actual | Score | 180 |
| Smart Online | Plan mensual | Online 2026 | 19 |
| Curso corto | Curso corto 2026 | Online 2026 | 5 |
| **Total** |  |  | **664** |

Se identificaron 34 denominaciones únicas de planes Smart Flex, 3 planes Smart Online y 5 cursos cortos. La cantidad de registros es mayor porque cada plan puede tener varios segmentos y opciones de financiación.

## 11. Registros descartados

Se descartaron 258 candidatos. Todos aparecen individualmente en `datos/reporte_calidad_datos.json` con archivo, hoja, fila aproximada, celda indicadora y motivo.

| Origen | Descartados | Motivo |
|---|---:|---|
| `Tarifas Nuevas Flex Nivel-Nivel` | 34 | Bloque auxiliar de filas 109–154 sin título ni encabezado comercial, separado del bloque oficial. |
| `Tarifas Instituto 2024` | 104 | Hoja oculta con vigencia 2024. |
| `Tarifas 2X1` | 25 | Hoja oculta con títulos 2024 y vigencia 2026 no confirmada. |
| `Tarifas Rescate` | 25 | Hoja oculta con títulos 2024 y vigencia 2026 no confirmada. |
| `Tarifas Examenes 2024` | 25 | Hoja oculta con vigencia 2024. |
| `Tarifas Planes Examanes 2023 UD` | 45 | Hoja oculta con vigencia 2023. |
| **Total** | **258** |  |

Las hojas auxiliares de IPC y resumen no incrementan el conteo de descartes porque no contienen registros finales candidatos para cotización; son soporte de cálculo.

## 12. Inconsistencias encontradas

Se registraron 193 inconsistencias comerciales, una por registro afectado y regla incumplida.

| Código | Severidad | Cantidad | Descripción |
|---|---|---:|---|
| `FORMULA_CON_ERROR` | Error | 180 | Los registros de `Modelo actual Smart Flex` en MP dependen de fórmulas con `#REF!`. |
| `VALOR_HORA_NO_COINCIDE` | Advertencia | 11 | El valor por hora no coincide con valor total dividido por las horas explícitas del plan. |
| `PLAN_PAGOS_NO_COINCIDE` | Error | 1 | La suma de cuota inicial y cuotas restantes no coincide con el total. |
| `CAMPO_OBLIGATORIO_AUSENTE` | Error | 1 | El encabezado exige valor total, pero la celda correspondiente está vacía. |
| **Total** |  | **193** |  |

### 12.1. Referencias rotas en Modelo actual Smart Flex MP

La hoja `Modelo actual Smart Flex` contiene referencias como:

`='[2]IPC 2025'!E3`

La referencia apunta a un libro o vínculo externo no disponible y su valor guardado es `#REF!`. El error se propaga por los cálculos de valor full plan, descuento, cuota inicial, cuotas, total y valor hora.

Se detectaron 864 celdas con `#REF!` en esta hoja. Como consecuencia, sus 180 registros comerciales están marcados `INVALIDO`. No se usaron valores del libro Score ni de otras hojas para rellenarlos, porque hacerlo habría mezclado fuentes sin autorización oficial.

### 12.2. Errores de fórmula en hoja histórica

También se detectaron 494 celdas con `#ERROR!` en `Tarifas Instituto 2024`. Estas celdas forman parte de una hoja histórica ya descartada y no se suman como inconsistencias comerciales del modelo 2026. Sí quedan registradas en el inventario técnico para auditoría.

En total existen 1.358 celdas con error de fórmula guardado en los libros: 864 `#REF!` en una fuente activa y 494 `#ERROR!` en una fuente histórica.

### 12.3. Diferencias de valor por hora

Ocho advertencias se concentran en las filas 25 y 26 de `Tarifas Nuevas Flex Nivel-Nivel`. El plan se denomina “162 Horas Académicas Nivel A2”, pero la intensidad base de la fila 25 es 200. Los cuatro segmentos de ambas opciones heredan esa diferencia.

Tres advertencias adicionales aparecen en las filas 80, 81 y 82 de `T. Smart Flex - Ing` para registros de la variante Score. Sus valores por hora no reconcilian con el total dividido por las horas explícitas del plan.

Los once registros se conservan como `CON_ADVERTENCIA`; no se sustituyeron sus valores.

### 12.4. Plan de pagos que no reconcilia

En `Tarifas Smart Online 2026`, fila 14, segmento público financiado, la cuota inicial y las demás cuotas suman 1.159.900, mientras el valor total es 1.491.300. La fórmula de la celda correspondiente divide el saldo entre tres aunque el plan tiene tres cuotas totales, dejando una diferencia. El registro se marca `INVALIDO`.

### 12.5. Valor total ausente

En `Tarifas Smart Online 2026`, fila 19, segmento público contado del plan de 12 meses, el encabezado ubica `VALOR TOTAL` en H19, pero H19 está vacío. F19 contiene una fórmula bajo el encabezado `CUOTA INICIAL`. No se reasignó esa cifra al valor total por inferencia; el registro se marca `INVALIDO`.

### 12.6. Nombres repetidos

Se detectaron nombres repetidos en tres contextos legítimos:

- el mismo plan se presenta en varios segmentos;
- el mismo nivel aparece en diferentes bloques de inicio;
- el mismo plan existe en las variantes MP y Score.

La normalización incorpora segmento, bloque y variante en la clave. Con esta clave completa no quedaron duplicados exactos ni conflictos de clave sin resolver.

## 13. Validaciones aplicadas

Cada registro fue sometido a las siguientes comprobaciones:

- existencia de número de cuotas para productos financiables;
- existencia de valor total;
- valores totales no negativos;
- coincidencia entre valor full plan, descuento y valor total;
- reconciliación entre cuota inicial, cuotas restantes y valor total;
- coincidencia entre valor por hora, valor total y horas declaradas;
- ausencia de errores de Excel en campos extraídos;
- unicidad de la clave comercial completa;
- trazabilidad completa hasta archivo, hoja, fila y celdas;
- separación estricta entre variantes MP, Score y Online 2026.

Para una sola cuota se respetaron las dos convenciones observadas en los libros: algunas tablas depositan el total en `cuota_inicial` y otras en `valor_cuota`. La validación acepta cualquiera de las dos cuando su suma coincide con el total.

## 14. Archivos generados en la Fase 1

- `scripts/procesar_tarifas.py`: extractor, normalizador y auditor reproducible.
- `datos/modelo_tarifas_normalizado.json`: modelo único con los 664 registros y su trazabilidad.
- `datos/reporte_calidad_datos.json`: inventario estructural, clasificación de hojas, 258 descartes, 193 inconsistencias y errores de fórmula a nivel de celda.
- `ANALISIS_TARIFAS.md`: explicación integral del proceso y sus resultados.

No se generó `tarifas.js`.

## 15. Reproducción del proceso

Desde la raíz del proyecto, el proceso se reproduce con Python 3 y `openpyxl` mediante:

```text
python scripts/procesar_tarifas.py --modo generar
```

El script:

1. verifica que existan exactamente tres libros `.xlsx` en `ORIGINALES_NO_MODIFICAR/`;
2. lee las fuentes sin guardarlas;
3. regenera ambos archivos JSON;
4. imprime los conteos y hashes de la ejecución.

El asesor no necesitará Python ni `openpyxl` para ejecutar la aplicación final. Estas herramientas pertenecen únicamente al proceso de preparación y auditoría de datos.

## 16. Criterio para avanzar a la siguiente fase

La generación de `tarifas.js` debe permanecer bloqueada hasta recibir aprobación explícita sobre:

- el tratamiento de los 180 registros MP con referencias `#REF!`;
- la corrección oficial del plan de pagos de Smart Online en la fila 14;
- la definición oficial del valor total del registro de Smart Online en la fila 19;
- la aceptación o corrección de las 11 diferencias de valor por hora;
- la inclusión definitiva de cursos cortos dentro de la herramienta comercial.

No se debe completar ninguno de esos datos mediante estimaciones o copia desde otra fuente.
