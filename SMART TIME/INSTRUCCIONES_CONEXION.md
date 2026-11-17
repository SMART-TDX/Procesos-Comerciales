# Conexión de SMART TIME con Google Sheets

## Archivos incluidos

- `index.html`: tablero SMART TIME preparado para recibir datos en línea.
- `configuracion_datos.js`: archivo donde se configura la URL del Apps Script.
- `conexion_sheets.gs`: servicio que consulta y transforma los dos Google Sheets.

## 1. Crear el Apps Script

1. Abre https://script.google.com/ con la cuenta autorizada para consultar ambos Sheets.
2. Crea un proyecto nuevo llamado `SMART TIME - Conexión de datos`.
3. Reemplaza el contenido de `Code.gs` por el contenido completo de `conexion_sheets.gs`.
4. Guarda el proyecto.
5. Selecciona y ejecuta la función `instalarActualizacionAutomatica`.
6. Autoriza los permisos solicitados. Esta primera ejecución genera los datos y crea una actualización automática cada hora.

## 2. Desplegar como aplicación web

1. En Apps Script selecciona **Implementar > Nueva implementación**.
2. Tipo: **Aplicación web**.
3. Ejecutar como: **Yo**.
4. Acceso recomendado: usuarios autorizados de la organización.
5. Implementa y copia la URL terminada en `/exec`.

No se recomienda habilitar acceso público porque el tablero contiene información personal y registros de asistencia.

## 3. Conectar el tablero

Abre `configuracion_datos.js` y pega la URL entre las comillas:

```javascript
global.SMART_TIME_DATA_ENDPOINT = "https://script.google.com/macros/s/ID_DEL_DESPLIEGUE/exec";
```

## 4. Publicar

Sube a la misma carpeta de GitHub Pages:

- `index.html`
- `configuracion_datos.js`

El archivo `conexion_sheets.gs` se queda en Apps Script y no necesita subirse a GitHub.

## Actualización de información

- Automática: cada hora.
- Manual inmediata: ejecuta `actualizarDatosSmartTime` desde Apps Script.
- Si el endpoint todavía está vacío, el tablero utiliza temporalmente los datos incrustados en el HTML como respaldo.

## Fuentes configuradas

- Asistencia: archivo `1cyfz2XAo2sX9mPFmhRxr1W1NqXyCrVsuMHFtEP5sNlk`, pestaña `Asistencia comercial`.
- Base de personas: archivo `1JbSlRH8aGPTdY7NJ9QMk7x6S_U9SXkm9oAv6tGZArSs`, pestaña `Hoja 1`.
