# Autoría Colombia

Biblioteca editorial sobre derecho de autor colombiano. Sitio estático de 28 páginas, con contenido disponible sin JavaScript y funciones interactivas que se cargan cuando hacen falta. HTML, CSS y módulos JavaScript nativos; sin dependencias de producción.

## Ejecutar

Requiere Node.js 20 o posterior. No hace falta `npm install`.

```sh
npm run dev
```

Abre **http://127.0.0.1:8000**. Los cambios en `src/`, `public/` y `tooling/` reconstruyen el sitio automáticamente; recarga el navegador para verlos. Si el puerto está ocupado, usa `PORT=8080 npm run dev`.

```sh
npm run build       # Genera únicamente dist/
npm start           # Sirve la compilación existente
npm run check       # Sintaxis, compilación y pruebas unitarias/de integración
npm run predeploy   # Comprobación previa a publicación
```

El servidor incluido es para desarrollo y validación local. Publica `dist/` en un hosting estático. No abras los HTML con `file://`: el navegador necesita HTTP para los módulos JavaScript. El `index.html` de la raíz es solo un acceso a la compilación para servidores locales que abren el proyecto completo.

## Organización

```text
src/
  config/           Contacto, sitio, rutas y claves de almacenamiento
  content/          Artículos, fuentes, glosario, FAQ y recursos educativos
  domain/           Búsqueda, cuestionarios, explorador y rutas; sin DOM
  shared/           Texto y URLs
  ui/               Componentes y renderizadores de HTML reutilizables
  client/           Arranque y funciones del navegador por página
  templates/        Layout, portada, artículos y plantillas secundarias
  styles/           Tokens, componentes, layouts y responsive
public/             Recursos que se copian sin transformación
tooling/            Validación, generación, servidor y cola de reconstrucción
scripts/            Entradas de los comandos npm
tests/              Pruebas unitarias, de integración y de navegador
docs/               Arquitectura, diseño, despliegue y evidencia de validación
dist/               Resultado generado; único directorio publicable
artifacts/          Informes, capturas, respaldo y paquete de entrega local
```

Edita `src/` y `public/`; no edites `dist/`. El build valida relaciones y configuración antes de generar, prepara una carpeta temporal y conserva la última compilación si falla el renderizado. Los archivos antiguos del proyecto se archivaron en `artifacts/architecture-baseline/`, fuera de la entrega.

## Contacto y dominio

El teléfono autorizado **+57 3122062892** está centralizado en [`src/config/contact.js`](src/config/contact.js). Las llamadas usan `tel:+573122062892` en cabecera, menú móvil, portada, artículos, contacto y pie. No se añadieron nombre, especialidad, horario ni credenciales sin confirmar.

El dominio se configura mediante `SITE_ORIGIN` durante la compilación o en [`src/config/site.js`](src/config/site.js). Cuando existe, se generan canonical, Open Graph URL y `sitemap.xml`. Mientras no se haya definido el dominio, estos enlaces absolutos se omiten.

## Verificación en navegador

Las pruebas opcionales utilizan Chrome, Playwright y axe. Sus dependencias pueden instalarse fuera del proyecto:

```sh
npm install --prefix /tmp/autoria-qa playwright axe-core
QA_MODULES=/tmp/autoria-qa/node_modules npm run test:e2e
```

El comando compila, inicia su propio servidor en un puerto libre y lo cierra al terminar. En macOS usa Chrome de `/Applications`; en otro entorno define `CHROME_PATH`. Los informes y capturas quedan en `artifacts/`.

## Publicación

Ejecuta `npm run predeploy` y publica **el contenido de `dist/`**. Configura HTTPS, archivos `.html` y respuesta 404 real con `404.html`; no se necesita una reescritura de SPA. El archivo `_headers` aporta cabeceras para alojamientos que acepten ese formato. Consulta la [guía de despliegue](docs/DESPLIEGUE.md) para configurar el dominio, validar el alojamiento y actualizar versiones.

## Documentación

- [Arquitectura y mantenimiento](docs/ARQUITECTURA.md)
- [Despliegue](docs/DESPLIEGUE.md)
- [Validación y alcance de las pruebas](docs/VALIDACION.md)
- [Sistema de diseño](docs/DESIGN-SYSTEM.md)
- [Diagnóstico del rediseño inicial](docs/DIAGNOSTICO.md)

El contenido es educativo y conserva su estado de revisión jurídica profesional pendiente. La preparación técnica del sitio no cambia ese estado editorial.
