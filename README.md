# Simulador permiso B - PWA preliminar

Proyecto preliminar funcional para registrar faltas de simulaciones del examen práctico del permiso B desde móvil, especialmente iPhone.

## Qué incluye

- App web mobile-first.
- Catálogo de faltas separado en `src/data/faltas.json`.
- Buscador y filtros por leve, deficiente y eliminatoria.
- Cálculo automático de APTO / NO APTO.
- Historial local con IndexedDB.
- Cronómetro general de examen.
- Cronómetro de maniobra, pensado para aparcamiento/cambio de sentido.
- Temporizador configurable para examen temporizado.
- Tiempos guardados dentro de cada simulación e incluidos en el PDF.
- Exportación de informe PDF.
- Exportación e importación de copias JSON.
- PWA con `manifest.webmanifest` y `service worker`.
- Preparado para despliegue con **Docker** y **Flask** (Python).

## Cambios de esta versión

- Corregido el problema por el que el campo Alumno/a perdía el foco al escribir.
- Añadidos cronómetros y temporizador en la pantalla Simulación.
- Añadidos tiempos al resumen y al PDF.

## Forma rápida de desplegar con Docker

Requisito: tener Docker instalado.

1. Entra en la carpeta del proyecto.
2. Ejecuta el siguiente comando para construir y levantar la aplicación:

```bash
docker compose up -d --build
```

3. Abre en tu navegador la siguiente dirección:

```text
http://localhost:8080
```

Para probar desde un iPhone u otro dispositivo de tu red local, conecta el dispositivo a la misma Wi-Fi y abre en el navegador la IP de tu equipo:

```text
http://192.168.x.x:8080
```

Nota: en red local por HTTP sirve para probar. Para instalación PWA completa y funcionamiento offline fiable en iPhone, se recomienda publicarla en HTTPS o utilizar túneles seguros.

## Forma de desarrollo

Si quieres modificar el código fuente:

```bash
npm.cmd install
npm.cmd run dev
```

En PowerShell, si `npm` da error por políticas de ejecución, usa siempre `npm.cmd`.

Para generar la versión publicable:

```bash
npm.cmd run build
```

La web final se genera en:

```text
dist/
```

## Ejecución local con Flask (sin Docker)

Requisitos: Tener instalado Python y Node.js.

1. Instala dependencias y compila la aplicación frontend:
   ```bash
   npm.cmd install
   npm.cmd run build
   ```
2. Instala los requerimientos de Python:
   ```bash
   pip install -r requirements.txt
   ```
3. Inicia el servidor de Flask:
   ```bash
   python app.py
   ```
   *Nota para Windows:* También puedes simplemente ejecutar el archivo `start.bat` haciendo doble clic sobre él.

4. Abre en tu navegador la dirección:
   ```text
   http://localhost:8080
   ```

## Publicar en web

La carpeta que hay que subir es `dist/`.

Opciones sencillas:

- Netlify Drop: arrastrar `dist/`.
- Vercel: conectar repositorio y usar `npm run build` con salida `dist`.
- Cloudflare Pages: build command `npm run build`, output directory `dist`.
- VPS propio: servir `dist/` con Nginx, Caddy o Apache.

## Instalar en iPhone como app

1. Publica la carpeta `dist/` en una URL HTTPS.
2. Abre la URL en Safari del iPhone.
3. Pulsa Compartir.
4. Pulsa Añadir a pantalla de inicio.
5. Activa Abrir como app web si aparece.
6. Pulsa Añadir.

La app quedará como un icono en la pantalla de inicio.

## Datos y privacidad

La versión actual guarda los datos localmente en el navegador/dispositivo mediante IndexedDB. Si borras los datos del sitio desde Safari/Chrome o limpias datos del navegador, puedes perder el historial. Usa Ajustes > Exportar todo para generar una copia JSON.

## Archivos principales

```text
src/main.js          Interfaz y navegación
src/db.js            IndexedDB
src/rules.js         Reglas de apto/no apto
src/pdf.js           Generación de PDF
src/data/faltas.json Catálogo de faltas
public/sw.js         Service worker
public/manifest.webmanifest Configuración PWA
dist/                Versión construida lista para publicar
```
