# SMART SALES HUB
## Arquitectura del Motor Comercial Inteligente

## 1. Visión del producto

SMART SALES HUB será una plataforma comercial local orientada a acompañar al asesor durante todo el proceso de negociación. Su primer módulo es la Calculadora Comercial Smart, encargada de consultar tarifas oficiales y preparar propuestas comerciales sin alterar la información proveniente de los Excel.

El Motor Comercial Inteligente ampliará esta capacidad para que la plataforma pueda:

- acompañar al asesor durante la negociación;
- prevenir combinaciones y ofrecimientos no autorizados;
- sugerir beneficios aplicables según el contexto de la propuesta;
- validar las reglas comerciales vigentes;
- identificar campañas disponibles;
- generar propuestas comerciales claras, consistentes y trazables.

El motor no reemplazará el criterio humano ni tomará decisiones autónomas sobre precios, descuentos o condiciones. Su función será presentar únicamente alternativas permitidas y ayudar al asesor a comunicarlas correctamente.

La arquitectura deberá mantener una separación estricta entre:

- el motor de tarifas, que conserva los valores oficiales;
- el motor financiero, que distribuye los pagos sin alterar el total oficial;
- el motor comercial, que determina beneficios, campañas, advertencias y contenidos permitidos;
- la experiencia de usuario, que presenta las opciones sin exponer estructuras internas;
- la propuesta comercial, que comunica exclusivamente lo confirmado por el asesor.

`PRODUCT_DECISIONS.md` continuará siendo la fuente oficial de las decisiones de negocio aprobadas. Este documento será la fuente oficial de la arquitectura del Motor Comercial Inteligente y del catálogo de reglas que llegue a aprobarse. Ninguna regla descrita como ejemplo, pendiente o futura podrá activarse hasta estar autorizada expresamente en `PRODUCT_DECISIONS.md`.

## 2. Objetivos del motor

El Motor Comercial Inteligente deberá determinar, sin modificar los datos económicos oficiales:

- qué tarifa puede consultarse para la combinación seleccionada;
- qué campañas están vigentes y son compatibles;
- qué beneficios pueden ofrecerse;
- qué beneficios no pueden ofrecerse;
- qué formatos o materiales comerciales están disponibles;
- qué advertencias debe ver el asesor antes de continuar;
- qué información comercial puede incluirse en la propuesta y en su versión imprimible o PDF.

El motor deberá operar con resultados explicables. Cada sugerencia, restricción o advertencia deberá conservar como mínimo:

- identificador estable;
- tipo de activo o regla;
- estado de aprobación;
- condiciones de aplicabilidad;
- motivo del resultado;
- vigencia cuando corresponda;
- fuente de la decisión;
- versión de la configuración.

El motor nunca deberá:

- inventar tarifas, descuentos, campañas o beneficios;
- recalcular un precio oficial para acomodar un beneficio;
- convertir un ejemplo en una regla activa;
- mostrar activos vencidos, inactivos o incompatibles;
- aplicar automáticamente un beneficio que requiera confirmación del asesor;
- modificar el motor de tarifas o el motor financiero;
- exponer al usuario estructuras internas de los Excel.

## 3. Definición de activos comerciales

Un activo comercial es un elemento autorizado que aporta valor a una negociación sin alterar por sí mismo la tarifa oficial. Puede ser un beneficio, examen, material, curso corto, campaña, formato de comunicación, advertencia o recurso futuro.

Todo activo deberá tener una definición configurable con estos campos conceptuales:

- identificador;
- nombre oficial;
- descripción comercial;
- tipo;
- estado: borrador, pendiente de aprobación, activo, inactivo o archivado;
- líneas de estudio compatibles;
- modalidades comerciales compatibles, cuando aplique;
- condiciones de elegibilidad;
- exclusiones e incompatibilidades;
- vigencia, cuando aplique;
- posibilidad de selección por el asesor;
- texto autorizado para la propuesta;
- fuente y fecha de aprobación;
- versión y trazabilidad de cambios.

Los activos se clasificarán así:

### Activos permanentes

Beneficios que pueden estar disponibles de manera continua mientras sus reglas oficiales permanezcan vigentes. Su permanencia no elimina la necesidad de validar elegibilidad.

### Activos mensuales

Beneficios o campañas sujetos a un período mensual definido. Solo pueden sugerirse dentro de su vigencia.

### Activos especiales

Elementos habilitados para una ocasión, segmento, convenio, sede, región o condición autorizada. Deben declarar expresamente sus restricciones.

### Activos futuros

Capacidades previstas por la arquitectura que todavía no están autorizadas para uso comercial. Permanecerán inactivas hasta que exista una decisión oficial y una configuración válida.

## 4. Beneficios permanentes

Los siguientes beneficios se documentan como categorías previstas para el Motor Comercial Inteligente. Esta definición no activa reglas de elegibilidad, no asigna precios y no modifica descuentos. Las condiciones que no hayan sido aprobadas deberán permanecer con estado `PENDIENTE_DEFINICION` y no podrán mostrarse como disponibles.

### Examen LINGUASKILL

- Opciones previstas: examen de 1, 2 o 4 habilidades.
- Líneas compatibles: Smart Online y Smart Flex.
- Su disponibilidad exacta dependerá de reglas oficiales aprobadas.
- No modifica el precio, el descuento, el número de cuotas ni ningún valor oficial.
- El motor deberá impedir la selección de una opción cuya regla no esté activa o cuyas condiciones no se cumplan.
- La propuesta solo podrá incluir la opción expresamente seleccionada y confirmada.

### EBOOKS

- Línea compatible: exclusivamente Smart Flex.
- Cantidades previstas: 1, 2, 3 o 5 ebooks.
- Su disponibilidad exacta dependerá de reglas oficiales aprobadas.
- No modifica precios ni descuentos.
- Smart Online no deberá presentar este activo como opción disponible.
- La propuesta deberá indicar únicamente la cantidad confirmada.

### Cursos cortos

Catálogo inicial previsto:

- Smart Business English;
- Smart Chef;
- Smart Office Suite Skills.

Reglas estructurales:

- solo podrá seleccionarse un curso corto por propuesta cuando una regla activa lo autorice;
- el catálogo deberá ser extensible mediante configuración;
- agregar o retirar cursos del catálogo no deberá requerir cambios en la lógica principal;
- la existencia de un curso en el catálogo no implica que esté disponible para todas las negociaciones;
- los cursos cortos continúan fuera del alcance funcional vigente hasta que una decisión oficial autorice su incorporación.

## 5. Campaña del mes

La campaña del mes deberá ser completamente configurable sin modificar la lógica principal de la aplicación. Su definición conceptual incluirá:

- identificador;
- nombre;
- descripción autorizada;
- estado activo o inactivo;
- fecha y hora de inicio;
- fecha y hora de finalización;
- beneficios asociados;
- líneas, modalidades, planes o segmentos compatibles;
- restricciones;
- incompatibilidades;
- prioridad de presentación;
- fuente de aprobación;
- texto autorizado para la propuesta.

Solo podrá existir una campaña marcada como campaña mensual vigente para una misma audiencia y período, salvo que una decisión oficial autorice convivencia explícita. El motor deberá validar simultáneamente estado, vigencia y elegibilidad.

Una campaña vencida, futura, inactiva, incompleta o no aprobada no deberá aparecer al asesor. Si dos configuraciones activas entran en conflicto, el motor deberá bloquear su aplicación, registrar la causa y mostrar una advertencia interna; nunca deberá elegir una por su cuenta.

El cambio mensual deberá realizarse mediante sustitución o actualización de la configuración autorizada, conservando historial y versión, sin reprogramar las reglas generales del motor.

## 6. Motor de reglas comerciales

Las reglas comerciales deberán almacenarse como datos configurables y no como condiciones dispersas o valores fijos dentro del código de interfaz.

Cada regla deberá expresar conceptualmente:

- identificador y versión;
- nombre y propósito;
- estado de aprobación y activación;
- prioridad;
- fecha de vigencia;
- condiciones de entrada;
- resultado permitido, sugerido, obligatorio o prohibido;
- incompatibilidades;
- mensaje explicativo para el asesor;
- fuente de aprobación;
- registro de cambios.

El proceso de evaluación será:

1. Recibir el contexto válido de la cotización sin modificarlo.
2. Cargar únicamente reglas aprobadas, activas y vigentes.
3. Evaluar condiciones de elegibilidad.
4. Resolver exclusiones e incompatibilidades.
5. Producir una lista explicable de activos disponibles, sugeridos y no permitidos.
6. Ocultar del selector las opciones inválidas.
7. Registrar qué reglas justificaron el resultado.

Los siguientes enunciados son únicamente ejemplos de diseño y no constituyen reglas aprobadas ni activas:

- una selección de cinco niveles podría habilitar un curso corto;
- un programa que incluya B1 podría habilitar una opción de Linguaskill;
- una combinación incompatible debería impedir que el beneficio aparezca.

Estos ejemplos deberán permanecer identificados como `EJEMPLO_NO_ACTIVO` hasta que `PRODUCT_DECISIONS.md` establezca las condiciones oficiales. No deberán implementarse como comportamiento funcional.

La resolución de conflictos deberá seguir esta jerarquía:

1. prohibiciones y restricciones oficiales;
2. elegibilidad obligatoria;
3. incompatibilidades;
4. vigencia y estado;
5. prioridades de sugerencia.

Una prioridad nunca podrá anular una prohibición ni una incompatibilidad.

## 7. Motor de sugerencias

El motor de sugerencias utilizará exclusivamente los resultados válidos del motor de reglas para orientar al asesor. No tendrá autoridad para crear beneficios ni cambiar condiciones comerciales.

Podrá sugerir, cuando existan reglas aprobadas:

- beneficios permanentes;
- campaña vigente;
- curso corto compatible;
- material de apoyo;
- cantidad de ebooks permitida;
- modalidad de examen autorizada;
- formatos comerciales disponibles.

La interfaz deberá introducir estas recomendaciones con el mensaje:

> Para esta negociación puedes ofrecer:

Cada sugerencia deberá mostrar un nombre claro y una explicación breve de por qué está disponible. Las opciones no elegibles no deberán mostrarse como seleccionables. Cuando no existan sugerencias aplicables, el sistema deberá comunicarlo de forma neutral, sin presentar la ausencia como un error.

El asesor conservará el control de la selección final. Los beneficios opcionales no deberán añadirse automáticamente a la propuesta. Si una selección anterior cambia, el motor reevaluará solo los activos dependientes y retirará cualquier selección que deje de ser válida, informando claramente el motivo.

## 8. Valor agregado de la propuesta

La arquitectura reservará un bloque futuro denominado `Valor agregado de la propuesta`. Su objetivo será comunicar de forma ordenada el valor comercial adicional que acompaña al programa seleccionado.

Este bloque podrá agrupar beneficios, campañas, materiales, ebooks, exámenes u otros activos confirmados. Deberá:

- utilizar textos aprobados;
- diferenciar lo incluido de lo simplemente disponible;
- evitar valoraciones monetarias no autorizadas;
- mantener trazabilidad hacia las reglas que habilitaron cada elemento;
- permanecer separado de valor de lista, descuento, ahorro y valor final.

El valor agregado nunca podrá modificar el precio oficial, el descuento, la financiación, el número de cuotas ni el plan de pagos. Su incorporación funcional queda pendiente de una decisión oficial futura.

## 9. Relación con la propuesta comercial y el PDF

El Motor Comercial Inteligente entregará a la propuesta comercial una lista estructurada de activos confirmados. La capa de presentación no deberá volver a evaluar reglas ni deducir beneficios.

La propuesta visual, la impresión y el PDF mediante impresión deberán incluir únicamente:

- beneficios elegibles que el asesor haya seleccionado y confirmado;
- campaña vigente confirmada, cuando aplique;
- textos comerciales autorizados;
- observaciones necesarias para comprender las condiciones del beneficio.

No deberán incluir:

- opciones sugeridas pero descartadas;
- beneficios incompatibles o vencidos;
- reglas internas;
- razones técnicas de descarte;
- estados de configuración;
- estructuras internas de los Excel;
- activos pendientes de aprobación.

Antes de preparar la propuesta, el sistema deberá revalidar que los activos seleccionados continúen vigentes y sean compatibles con la cotización. Si alguno deja de ser válido, deberá bloquear su inclusión y solicitar una nueva confirmación del asesor sin alterar la tarifa.

La trazabilidad técnica podrá conservar los identificadores y versiones de los activos incluidos, pero esos datos no deberán exponerse al cliente salvo que una decisión oficial determine lo contrario.

## 10. Escalabilidad

La arquitectura deberá permitir incorporar nuevas categorías sin modificar la lógica central de evaluación. Entre las capacidades futuras previstas se encuentran:

- bonos;
- obsequios;
- descuentos especiales, siempre que exista autorización y sin interferir con el motor financiero vigente;
- convenios empresariales o institucionales;
- eventos comerciales;
- campañas de Black Friday;
- campañas de Cyber Days;
- aniversarios;
- campañas regionales;
- activos diferenciados por sede o segmento.

Para soportar esta evolución, el motor deberá mantener:

- catálogos configurables y versionados;
- reglas desacopladas de la interfaz;
- estados de borrador, aprobación, activación y archivo;
- períodos de vigencia explícitos;
- validación de esquemas antes de activar configuraciones;
- historial de cambios y fuente de autorización;
- evaluación determinista y explicable;
- compatibilidad hacia atrás con propuestas ya generadas;
- pruebas de regresión para reglas comerciales y consistencia de datos.

La incorporación futura de un activo seguirá este ciclo de gobierno:

1. Registrar la decisión de negocio en `PRODUCT_DECISIONS.md`.
2. Definir el activo y sus reglas con fuente, vigencia y restricciones.
3. Revisar la configuración desde los roles de desarrollo y QA.
4. Probar casos válidos, inválidos, límites e incompatibilidades.
5. Activar una versión identificable.
6. Supervisar resultados sin modificar tarifas ni datos financieros.
7. Archivar la versión al terminar su vigencia, conservando trazabilidad.

Ninguna capacidad futura mencionada en este capítulo se considera implementada, aprobada o disponible por el solo hecho de aparecer en la arquitectura.
