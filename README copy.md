# Simulador permiso B - PWA preliminar

Proyecto preliminar funcional para registrar faltas de simulaciones del examen práctico del permiso B desde móvil, especialmente iPhone.

## Qué incluye

- App web mobile-first.
- Catálogo de faltas separado en `src/data/faltas.json`.
- Buscador y filtros por leve, deficiente y eliminatoria.
- Cálculo automático de APTO / NO APTO.
- Historial local con IndexedDB.
- Exportación de informe PDF.
- Exportación e importación de copias JSON.
- PWA con `manifest.webmanifest` y `service worker`.
- Carpeta `dist/` ya generada para publicar o probar sin instalar dependencias.
- Servidor local simple para Windows: `PROBAR-WINDOWS.cmd`.

## Forma rápida de probar en Windows

Requisito: tener Node.js instalado.

1. Descomprime el ZIP.
2. Entra en la carpeta `simulador-permiso-b-pwa`.
3. Haz doble clic en `PROBAR-WINDOWS.cmd`.
4. Abre en el PC la dirección que aparece:

```text
http://localhost:4173
```

Para probar desde iPhone, conecta el iPhone a la misma Wi-Fi y abre en Safari la dirección que aparece como:

```text
http://192.168.x.x:4173
```

Nota: en red local por HTTP sirve para probar. Para instalación PWA completa y funcionamiento offline fiable en iPhone, publícala en HTTPS.

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
