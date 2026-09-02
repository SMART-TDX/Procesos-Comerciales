# SMART CHAMPIONS — SEPTIEMBRE 2026

- **Versión:** Septiembre 2026
- **Estado:** APROBADA Y PUBLICADA
- **Fecha de consolidación:** 1 de septiembre de 2026
- **URL oficial de producción:** https://smart-champions.vercel.app/
- **Repositorio de origen:** `smart-champions`
- **Rama oficial de origen:** `main`

## Contenido de esta copia maestra

Esta carpeta conserva una copia autónoma de la edición institucional aprobada de SMART CHAMPIONS — SEPTIEMBRE 2026. Incluye:

- Portal principal SMART CHAMPIONS.
- Módulos Smart Online y Telemercadeo.
- JORGE 360, su motor local, bancos comerciales y base de conocimiento.
- Campañas, metas, productividad, incentivos y Cultura Champions de septiembre.
- Productos Smart Online y Smart Flex con la ruta START → GO → FLOW → PLUS → PRO.
- Acceso a Alianzas y Convenios.
- Documentos oficiales y piezas gráficas utilizadas por el portal.
- Las cuatro piezas oficiales de Cultura Champions de septiembre: 45 % y 80 % para Telemercadeo; 45 % y 80 % para Smart Online.
- Componentes locales de API requeridos para restaurar la experiencia completa de JORGE 360.

## Estructura general

- `index.html`: entrada principal del portal.
- `asistente-tmk.html`: entrada de JORGE 360.
- `assets/css/`: estilos utilizados por el portal y JORGE 360.
- `assets/js/`: configuración mensual, interfaz y lógica local.
- `assets/campanas/`: piezas descargables de campañas de septiembre.
- `assets/cultura-champions/`: piezas oficiales activas de Cultura Champions.
- `assets/documents/`: documentos comerciales y operativos oficiales.
- `assets/images/`: identidad y recursos visuales referenciados.
- `knowledge/`: base de conocimiento de JORGE 360.
- `api/`: componentes locales del endpoint de JORGE 360 para despliegues compatibles.
- `01_INVENTARIO_ARCHIVOS_FINAL.txt`: inventario completo de la copia consolidada.

## Conservación y restauración

1. Conservar la carpeta completa, sin separar `index.html` de `assets`, `knowledge` o `api`.
2. Mantener intactos los nombres y las rutas relativas.
3. Para una revisión local, servir esta carpeta mediante un servidor HTTP estático y abrir `index.html`.
4. Para restaurar la plataforma completa, desplegar el contenido de esta carpeta en un proveedor compatible con sitios estáticos y funciones Node/Vercel.
5. Verificar después del despliegue `index.html`, `asistente-tmk.html`, documentos, imágenes y `/api/jorge`.
6. Configurar cualquier variable de entorno necesaria exclusivamente en el proveedor de despliegue; nunca escribir valores sensibles dentro de estos archivos.

## Seguridad

Esta copia no debe almacenar contraseñas, tokens, credenciales, claves API ni secretos. Si un despliegue futuro requiere credenciales, deben configurarse como variables de entorno protegidas en la plataforma de hosting.

