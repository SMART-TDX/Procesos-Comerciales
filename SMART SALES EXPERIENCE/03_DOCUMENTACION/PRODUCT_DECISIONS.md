# PRODUCT DECISIONS

## CALCULADORA COMERCIAL SMART 2026

Estado: Fuente oficial de verdad para decisiones funcionales y comerciales  
Alcance: Smart Online y Smart Flex  
Regla de gobierno: ninguna regla comercial puede asumirse, inferirse o inventarse fuera de este documento

# 1. OBJETIVO DEL PRODUCTO

La Calculadora Comercial Smart resuelve el riesgo de consultar, interpretar y comunicar manualmente las tarifas comerciales contenidas en diferentes archivos Excel.

La herramienta permite que los asesores de la Academia de Idiomas Smart encuentren una tarifa oficial de forma rápida, precisa y guiada mientras atienden a un posible estudiante por llamada, videollamada o de manera presencial.

Sus objetivos oficiales son:

- eliminar errores humanos en la consulta de tarifas;
- evitar combinaciones comerciales inexistentes;
- reducir el tiempo necesario para preparar una cotización;
- centralizar la consulta de Smart Online y Smart Flex;
- facilitar la explicación del programa, su valor y su forma de pago;
- conservar trazabilidad completa hasta los Excel oficiales;
- apoyar al asesor en el cierre de una matrícula con claridad y confianza.

El usuario principal de la aplicación es el asesor comercial. El destinatario de una futura propuesta comercial es el posible estudiante, padre de familia, representante de empresa o responsable de la decisión.

# 2. PRINCIPIOS DEL PRODUCTO

## 2.1. Fuente oficial

- Los Excel oficiales son la fuente de verdad para tarifas, descuentos, cuotas y condiciones comerciales.
- Ningún dato comercial puede crearse por aproximación, conveniencia visual o inferencia.
- Los Excel originales no se modifican, sobrescriben ni eliminan.
- Todo dato publicado debe conservar trazabilidad hasta archivo, hoja y fila aproximada.
- Las inconsistencias de origen se documentan; nunca se corrigen silenciosamente.

## 2.2. Integridad financiera

- Nunca inventar tarifas.
- Nunca recalcular ni reemplazar el descuento oficial.
- Nunca modificar el valor total oficial para hacer coincidir una distribución de pagos.
- Nunca inventar cantidades de cuotas.
- Nunca mezclar valores entre Score, MP o Smart Online.
- Toda suma presentada debe reconciliar exactamente con el valor total oficial.

## 2.3. Experiencia

- La experiencia debe ser simple, progresiva, rápida y comprensible.
- La aplicación debe mostrar solamente opciones oficiales compatibles.
- El asesor no debe interpretar la estructura de los Excel.
- El asesor nunca debe ver archivos, hojas, bloques, fórmulas o identificadores internos.
- Cada cambio debe recalcular solo las decisiones dependientes.
- La interfaz debe minimizar lectura, clics y posibilidades de error.

## 2.4. Funcionamiento

- La aplicación funciona completamente de manera local.
- Debe abrir mediante doble clic en `index.html`.
- No requiere internet, servidores, bases de datos, APIs ni servicios externos.
- No almacena información de clientes.
- No puede depender de Node.js para su ejecución por el asesor.

# 3. DECISIONES OFICIALES

## 3.1. Líneas de estudio

Los únicos nombres oficiales incluidos en el alcance actual son:

- Smart Online.
- Smart Flex.

La exclusión general de cursos cortos del MVP fue sustituida. Los beneficios autorizados Business English, Smart Chef y Smart Office Suite Skills pueden seleccionarse únicamente en Smart Flex y no modifican la tarifa oficial.

## 3.2. Tipos de tarifa Smart Flex

Smart Flex utiliza exclusivamente los siguientes tipos de tarifa visibles:

- Score.
- MP.

La selección Score o MP es una decisión comercial visible para el asesor.

## 3.3. Conceptos internos

Los siguientes nombres son mecanismos internos del motor y nunca se muestran al asesor o al cliente:

- Flex Pack.
- Modelo Actual.
- Nivel a Nivel.
- Nombres de hojas de Excel.
- Nombres de bloques comerciales internos.

El motor puede utilizarlos para resolver el origen correcto, pero no forman parte del lenguaje del producto.

## 3.4. Terminología de horas

- La única expresión visible permitida es “Horas de formación”.
- No mostrar “Horas reloj”.
- No mostrar “Horas académicas”.
- El cambio de terminología es exclusivamente de presentación y nunca altera valores numéricos.
- Smart Online se expresa en meses de acceso y no muestra horas.

## 3.5. Tratamiento de registros especiales

- Los registros MP de Modelo Actual afectados por `#REF!` permanecen documentados, pero se excluyen de la aplicación hasta recibir un Excel oficial corregido.
- Los 11 registros cuyo valor por hora no coincide con el cálculo matemático se conservan exactamente como aparecen en el Excel.
- Los 11 casos anteriores no se recalculan, corrigen ni excluyen; conservan una observación técnica interna.
- Smart Flex MP no muestra Preventa.
- La Preventa marcada como no activa en la fuente no se publica.
- Smart Online conserva sus condiciones oficiales, incluidos Convenios cuando corresponda.

## 3.6. Condiciones comerciales

Las condiciones se muestran solamente cuando existen oficialmente para la combinación seleccionada.

El orden comercial general aprobado es:

1. Público.
2. Alianza masiva.
3. Alianza empresarial.
4. Preventa, cuando esté oficialmente disponible.
5. Colaborador.

No se ordenan alfabéticamente. Smart Online puede incluir Convenios según sus registros oficiales.

# 4. REGLAS DEL FLUJO

## 4.1. Navegación general

- La línea de estudio se selecciona mediante dos tarjetas: Smart Online y Smart Flex.
- La aplicación muestra un indicador de progreso.
- Solo permanecen visibles el paso actual, el inmediatamente anterior y el resumen lateral.
- Los pasos completados se comprimen y quedan editables desde el resumen.
- Una selección válida avanza al siguiente paso.
- Cambiar una selección anterior limpia y recalcula solamente sus dependencias.
- El resumen lateral permanece visible y se actualiza en tiempo real.
- La aplicación nunca presenta opciones incompatibles.

## 4.2. Flujo oficial Smart Online

El flujo oficial es:

1. Línea de estudio: Smart Online.
2. Plan por tiempo de acceso: 6, 9 o 12 meses, según disponibilidad oficial.
3. Condición comercial.
4. Forma de pago.
5. Número de cuotas oficial.
6. Primera cuota, solamente cuando exista financiación.
7. Fecha de cotización y primer pago.
8. Fecha de segunda cuota, solamente cuando exista financiación con saldo pendiente.
9. Plan de pagos, solamente cuando exista financiación con saldo pendiente.
10. Resultado de la cotización.

Smart Online nunca solicita ni muestra:

- nivel de ingreso;
- Score;
- MP;
- horas de formación.

## 4.3. Flujo oficial Smart Flex

El flujo oficial es:

1. Línea de estudio: Smart Flex.
2. Nivel de ingreso del estudiante.
3. Tipo de tarifa: Score o MP.
4. Tipo de plan compatible con nivel y tipo de tarifa.
5. Condición comercial.
6. Forma de pago.
7. Número de cuotas oficial.
8. Primera cuota, solamente cuando exista financiación.
9. Fecha de cotización y primer pago.
10. Fecha de segunda cuota, solamente cuando exista financiación con saldo pendiente.
11. Plan de pagos, solamente cuando exista financiación con saldo pendiente.
12. Resultado de la cotización.

El nivel de ingreso es una variable de negocio obligatoria. Los planes disponibles dependen simultáneamente del nivel de ingreso y de Score o MP.

## 4.4. Dependencias

- Cambiar la línea limpia todo el flujo específico de la línea anterior.
- Cambiar el nivel de Smart Flex limpia tipo de tarifa, plan y pasos posteriores.
- Cambiar Score o MP limpia plan y pasos posteriores.
- Cambiar el plan limpia condición comercial y pasos posteriores.
- Cambiar la condición limpia forma de pago y pasos posteriores.
- Cambiar la forma de pago limpia cuotas y pasos posteriores.
- Cambiar el número de cuotas recalcula primera cuota, fechas y resultado.
- Cambiar la primera cuota recalcula solamente saldo y cuotas posteriores.
- Cambiar la primera fecha revalida la segunda fecha y el calendario posterior.

# 5. REGLAS FINANCIERAS

## 5.1. Valor total y descuento

- El valor total oficial proviene del Excel.
- El valor total nunca se reconstruye desde las cuotas.
- El descuento oficial proviene del Excel y nunca se modifica.
- El ahorro es la diferencia entre valor de lista y valor total cuando ambos valores oficiales existen.
- Los formatos visuales no cambian el valor numérico oficial.

## 5.2. Contado

- La denominación visible es “Pago único”.
- El pago corresponde al valor total oficial.
- No solicitar fecha de segunda cuota.
- No mostrar amortización.
- No mostrar cuotas posteriores.
- No presentar “1 cuota” como financiación.

## 5.3. Financiado

- Mostrar únicamente cantidades de cuotas existentes en la tarifa oficial.
- La primera cuota forma parte del número total de cuotas.
- La primera cuota oficial registrada es el mínimo permitido.
- El asesor puede aumentar voluntariamente la primera cuota.
- La primera cuota no puede ser inferior al mínimo oficial.
- La primera cuota no puede superar el valor total oficial.
- Aumentar la primera cuota no cambia el total, descuento ni número oficial de cuotas.

## 5.4. Primera cuota y pesos enteros

Cuando una cuota inicial oficial contiene fracciones de peso, el mínimo operativo de captura se eleva al siguiente peso entero para impedir un pago inferior al valor fuente. Esta regla no altera la cuota inicial conservada en el modelo ni el valor total oficial.

El campo inicia con el mínimo operativo y muestra la ayuda:

“Puedes aumentar el pago inicial para reducir el valor de las siguientes cuotas.”

## 5.5. Amortización

La regla oficial es:

```text
saldo pendiente = valor total oficial - primera cuota seleccionada
cuotas posteriores = número total de cuotas - 1
```

- Las cuotas intermedias se presentan preferiblemente en pesos enteros.
- El saldo se distribuye entre las cuotas posteriores.
- Todo residuo de división o centavos se aplica exclusivamente en la última cuota.
- La suma de primera cuota, cuotas intermedias y última cuota debe coincidir exactamente con el valor total oficial.
- Si la primera cuota es igual al total, el contrato se presenta como pagado completamente y no se crean cuotas posteriores.

## 5.6. Centavos y última cuota

- El valor total conserva exactamente sus centavos cuando existen.
- No redondear el valor total al peso más cercano.
- Los valores sin centavos no muestran `,00`.
- Los valores con centavos muestran sus decimales, por ejemplo `$179.727,50`.
- La última cuota absorbe cualquier residuo, incluidos los 50 centavos oficiales.
- Cuando exista ajuste, la denominación permitida es “Cuota final — ajuste de cierre”.
- El ajuste de cierre no es un recargo, interés ni costo adicional.

Son casos especiales válidos, no inconsistencias pendientes, los tres registros financiados Score de Alianza masiva con totales terminados en 50 centavos ubicados aproximadamente en las filas 32, 57 y 75 de la fuente oficial correspondiente.

## 5.7. Fechas

- La fecha de cotización es también la fecha del primer pago y de inicio del servicio.
- Se carga inicialmente la fecha actual y el asesor puede cambiarla.
- La segunda cuota debe estar entre 30 y 40 días calendario después del primer pago.
- Las fechas posteriores conservan el día mensual elegido para la segunda cuota.
- Si un mes no contiene ese día, se utiliza su último día calendario.

## 5.8. Plan de pagos

El plan financiado muestra:

- número de cuota;
- fecha de pago;
- valor;
- tipo o estado.

Debe incluir el total de control y la nota:

“Las fechas están sujetas a las condiciones comerciales y contractuales vigentes.”

El plan mostrado, copiado o impreso debe provenir del mismo cálculo validado.

# 6. REGLAS DEL PDF

- El PDF es una propuesta comercial personalizada.
- No es una factura.
- No es un contrato.
- No es un comprobante de pago.
- No es un reporte técnico.
- Debe ayudar al asesor a explicar el programa y avanzar hacia una matrícula.
- Debe dirigirse al posible estudiante o responsable de la decisión.
- Debe utilizar lenguaje claro, elegante y no invasivo.
- No debe utilizar urgencia artificial, promesas de resultados ni mensajes exagerados.
- Debe conservar exactamente los importes y fechas validados por la aplicación.
- La versión enviada al cliente no muestra trazabilidad técnica, nombres de hojas ni estructura de datos.
- Cualquier beneficio, descripción institucional, mensaje comercial, llamado a la acción o nota legal requiere aprobación oficial antes de publicarse.
- La propuesta se implementa como un documento comercial continuo en formato Carta vertical, apto para impresión o guardado como PDF desde el navegador.

## 6.1. Contenido aprobado para la Propuesta Comercial Premium

- Título: “Propuesta Comercial Personalizada”.
- Subtítulo: “Gracias por confiar en Smart. Hemos preparado esta propuesta de acuerdo con la información compartida durante tu proceso de asesoría.”
- Beneficio Smart Online: “Aprende inglés con la flexibilidad que necesitas, accediendo a una plataforma disponible durante el tiempo contratado y acompañada por recursos diseñados para fortalecer tu proceso de aprendizaje.”
- Beneficio Smart Flex: “Disfruta de un programa flexible que combina formación, acompañamiento y una metodología diseñada para avanzar de manera progresiva según tus objetivos.”
- Llamado a la acción: “Si tienes alguna inquietud sobre esta propuesta, tu asesor estará disponible para acompañarte en el siguiente paso de tu proceso de matrícula.”
- Cliente: nombre completo obligatorio; teléfono y correo electrónico opcionales.
- Asesor: solicitar nombre, sede, correo institucional y celular corporativo.
- En Smart Flex, Score o MP se muestra siempre bajo la etiqueta `Modalidad comercial` y nunca de forma aislada.

## 6.2. Valor comercial de los beneficios

- Linguaskill de 1 habilidad tiene un valor comercial autorizado de `$170.000`.
- Linguaskill de 2 habilidades tiene un valor comercial autorizado de `$320.000`.
- Linguaskill de 4 habilidades tiene un valor comercial autorizado de `$480.000`.
- Los E-Books se presentan únicamente por su cantidad seleccionada: Sin E-Books, 1 E-Book, 2 E-Books, 3 E-Books, 4 E-Books o 5 E-Books.
- Los E-Books no tienen por ahora un valor económico autorizado y no se incluyen en ahorros ni totales económicos.
- Business English, Smart Chef y Smart Office Suite Skills se presentan únicamente como beneficios seleccionados de Smart Flex.
- Los cursos cortos no tienen por ahora un valor económico autorizado.
- La campaña del mes se presenta únicamente como beneficio vigente seleccionado y no tiene un valor económico fijo.
- Únicamente Linguaskill suma un valor económico visible dentro de los beneficios.
- El valor comercial de los beneficios es exclusivamente informativo y no modifica tarifa, descuento, valor final ni plan de pagos.
- Cada beneficio conserva el campo configurable `valorComercial`; mientras no exista un monto autorizado su valor es nulo y nunca se infiere o inventa.
- El valor total recibido se presenta como la suma del valor de lista oficial y los beneficios seleccionados que tengan un valor comercial autorizado.

# 7. REGLAS VISUALES

## 7.1. Color

- El rojo corporativo se usa como color principal de identidad y acento.
- El blanco debe dominar las superficies y el espacio visual.
- Los grises estructuran fondos, bordes y contenido secundario.
- El negro o gris muy oscuro se usa para texto principal.
- El verde se reserva para confirmaciones, beneficios o ahorro positivo.
- El amarillo se reserva para advertencias o decisiones pendientes y no debe aparecer en una propuesta final sin pendientes.
- No saturar la interfaz o propuesta con colores.
- Los estados nunca dependen únicamente del color.

## 7.2. Logo

- Solo se utiliza el logo oficial suministrado y aprobado por Smart.
- No reconstruir el logo mediante texto, CSS o formas aproximadas.
- No deformar, recortar, recolorear o agregar efectos no autorizados.
- El logo debe almacenarse localmente.
- La ruta oficial del activo es `assets/logo-smart.svg`.
- Hasta que el archivo exista, el único identificador temporal permitido es el texto `SMART` acompañado por `Calculadora Comercial`.

## 7.3. Nombres oficiales

- Escribir exactamente “Smart Online”.
- Escribir exactamente “Smart Flex”.
- Escribir exactamente “Score”.
- Escribir exactamente “MP”.
- No traducir, abreviar ni reinterpretar estos nombres.
- Score y MP no deben tratarse como submarcas sin lineamientos oficiales.
- En la propuesta de Smart Flex se presenta `Modalidad comercial` seguida de `Score` o `MP`. Score y MP nunca aparecen como palabras aisladas.

## 7.4. Jerarquía

- La experiencia debe sentirse como software empresarial, no como formulario HTML o Excel convertido.
- La información se presenta progresivamente.
- Cada pantalla o estado tiene un objetivo principal.
- La jerarquía se construye primero mediante espacio, tamaño y peso; el color actúa como apoyo.
- La legibilidad debe conservarse en desktop, tablet, celular, impresión y escala de grises.

# 8. REGLAS PARA FUTUROS DESARROLLOS

- Toda funcionalidad nueva debe revisarse contra `PRODUCT_DECISIONS.md` antes de diseñarse o implementarse.
- Ningún desarrollador puede asumir una regla comercial ausente.
- Una regla no documentada se considera pendiente, no autorizada.
- Cuando falte una decisión de negocio, el desarrollo afectado debe detenerse y solicitar definición oficial.
- Las decisiones aprobadas deben incorporarse primero a este documento y después al código.
- Todo cambio financiero requiere validación contra los Excel originales.
- Todo cambio debe conservar trazabilidad y compatibilidad con ejecución local.
- Las nuevas campañas se agregan mediante datos y reglas confirmadas, sin modificar innecesariamente la lógica principal.
- Las decisiones técnicas no pueden contradecir decisiones comerciales.
- Toda fase debe incluir revisión de desarrollo y QA conforme a `AGENTS.md`.
- Si este documento contradice una especificación de diseño anterior, prevalece la decisión comercial más reciente registrada aquí.
- Las decisiones históricas reemplazadas deben marcarse como sustituidas; no deben eliminarse sin dejar registro de la modificación.

# 9. ELEMENTOS PROHIBIDOS

Nunca implementar:

- tarifas inventadas, aproximadas o copiadas desde otra fuente sin autorización;
- descuentos recalculados o modificados;
- cuotas inexistentes;
- combinaciones comerciales sin registro oficial;
- mezcla de valores entre Score, MP y Smart Online;
- modificación, sobrescritura o eliminación de Excel originales;
- exposición de Flex Pack, Modelo Actual o Nivel a Nivel;
- exposición de nombres de hojas, filas, celdas, fórmulas o errores de Excel al asesor o cliente;
- “Horas reloj” o “Horas académicas” en contenido visible;
- horas para Smart Online;
- Preventa para Smart Flex MP;
- registros MP afectados por `#REF!` mientras no exista una fuente corregida;
- cursos cortos en Smart Online o cursos distintos de Business English, Smart Chef y Smart Office Suite Skills sin aprobación oficial;
- almacenamiento de información de clientes;
- dependencias de internet, servidores, bases de datos o APIs;
- React, Angular, Vue o Docker;
- Node.js como requisito para utilizar la aplicación;
- `fetch()` o recursos CDN;
- funcionalidades que requieran instalar software para consultar tarifas;
- redondeo del valor total oficial al peso entero;
- distribuciones de pago cuya suma no coincida exactamente con el total;
- centavos en cuotas intermedias cuando puedan concentrarse en la última cuota;
- presentación del ajuste de cierre como recargo o interés;
- PDF presentado como factura, contrato o reporte técnico;
- beneficios, textos legales, promesas o llamados a la acción no aprobados;
- urgencia artificial, escasez falsa o presión invasiva;
- logo reconstruido o modificado sin autorización;
- colores sin contraste suficiente o estados comunicados solo mediante color;
- exposición de trazabilidad técnica en la propuesta enviada al cliente.

# 10. LISTA DE DECISIONES PENDIENTES

Las siguientes cuestiones no tienen decisión oficial y no deben asumirse:

## 10.1. Marca y activos

- Incorporación efectiva del logo oficial en `assets/logo-smart.svg`.
- Códigos exactos de color corporativo.
- Tipografía institucional autorizada.
- Sistema de iconos permitido.
- Versión oficial del logo para blanco y negro.

## 10.2. Contenido comercial

- Evidencias institucionales, cifras, acreditaciones o testimonios que puedan utilizarse.

## 10.3. Propuesta comercial

- Firma visual o institucional del asesor, si llegara a requerirse.
- Tratamiento cuando cliente, estudiante y responsable de pago son personas diferentes.
- Variante oficial para empresas.
- Vigencia de la propuesta.
- Notas legales aprobadas.
- Información oficial sobre lo incluido y no incluido en la inversión.
- Condiciones oficiales de inicio o disponibilidad.
- Visibilidad y denominación de la condición comercial para el destinatario.
- Formato de la referencia pública de control.
- Mecanismo de relación entre referencia pública y trazabilidad interna.
- Confirmación de si la versión de contado puede ocupar una sola página.
- Nombre oficial del archivo PDF y política sobre datos personales en ese nombre.

## 10.4. Pruebas y compatibilidad

- Navegadores oficialmente compatibles.
- Visores móviles que integrarán la matriz de QA.
- Impresoras y configuraciones de papel que deben validarse.
- Criterios de peso máximo y calidad para envío por WhatsApp.

## 10.5. Registro de futuras decisiones

Toda nueva decisión debe agregarse con:

- identificador;
- fecha de aprobación;
- responsable que la aprueba;
- decisión exacta;
- alcance;
- motivo;
- documentos o fuentes relacionados;
- decisiones anteriores que reemplaza;
- estado: pendiente, aprobada, sustituida o descartada.

No existe autorización para implementar los puntos anteriores hasta que cambien de pendientes a aprobados dentro de este documento.


Fin del documento.
