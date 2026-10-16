# Validación de la entrega 2.1.0

Comprobación local: 15 de octubre de 2026, Colombia. Node.js 22.20.0 y Google Chrome en macOS. Los informes utilizan fecha UTC y pueden mostrar 16 de octubre. No se desplegó en un dominio externo.

## Compilación y pruebas

`npm run predeploy` ejecuta análisis de sintaxis, generación de **28 páginas HTML** y **23 pruebas unitarias y de integración**. Cubren:

- Límites entre capas y carga diferida de las colecciones de contenido.
- Contratos de contenido, relaciones, configuración y rutas de salida.
- Generación reproducible, eliminación de recursos obsoletos, bloqueo de builds concurrentes y conservación de la salida anterior si falla un render.
- Canonical y sitemap al proporcionar un origen; exclusión de 404 del sitemap.
- Metadatos, H1, IDs, enlaces, anclas y recursos locales.
- Teléfono autorizado `tel:+573122062892` en todas las páginas y número visible en contacto.
- Búsqueda, escape de consultas HTML, rutas históricas y recomendaciones.
- Transiciones de cuestionarios, corrección de respuestas y persistencia compatible con cambios de contenido.
- Almacenamiento bloqueado o corrupto y borrado limitado a claves propias.
- HTTP GET/HEAD, errores 404, métodos no admitidos, rutas malformadas y enlaces simbólicos fuera de la carpeta pública.
- Cabeceras de seguridad y base de la página 404 válida desde URLs anidadas.

Se verificó además `npm run dev` creando, modificando y eliminando un recurso: las tres operaciones se reflejaron automáticamente en `dist/`. Evidencia: `artifacts/watch-report.json`.

La comparación con el respaldo previo confirmó la conservación del contenido de **12 artículos, 6 casos, 5 cuestionarios, 10 FAQ y 20 términos**. Se normalizaron las relaciones entre registros. Evidencia: `artifacts/content-migration-report.json`.

## Chrome y accesibilidad automática

`npm run test:e2e` compila, inicia un servidor temporal, ejecuta las pruebas y cierra sus procesos. Se recorrieron **27 páginas de contenido** en anchos de **1440, 768, 390 y 320 px**.

Resultado: **0 errores JavaScript, 0 recursos fallidos, 0 violaciones CSP registradas, 0 desbordamientos horizontales**. Axe no detectó infracciones en las 27 páginas con tema claro ni en cinco páginas representativas con tema oscuro, utilizando reglas WCAG 2 A/AA, 2.1 AA y 2.2 AA.

Se comprobaron tema persistente; búsqueda y filtros; apertura de FAQ; explorador y reinicio; cuestionarios con avance, retroceso, corrección y recarga; casos y mitos; rutas antiguas; contacto telefónico; menú móvil con teclado y Escape; borrado de preferencias; lectura, navegación y FAQ sin JavaScript. También se verificó que la portada no descarga colecciones de contenido.

Evidencia: `artifacts/browser-report.json`, `artifacts/accessibility-report.json` y capturas de portada en escritorio/móvil y artículo en modo oscuro.

## Lighthouse móvil

Lighthouse **13.5.0**, portada local con perfil móvil y simulación predeterminada:

| Categoría | Puntuación |
|---|---:|
| Rendimiento | 100 |
| Accesibilidad | 100 |
| Buenas prácticas | 100 |
| SEO | 100 |

FCP: **1,5 s**. LCP: **1,5 s**. CLS: **0**. TBT: **0 ms**.

Informes: `artifacts/lighthouse-production.report.html` y `artifacts/lighthouse-production.report.json`. Corresponden a esta ejecución local de la portada; no garantizan los resultados del alojamiento ni de todas las páginas. Permanecen oportunidades de optimización del CSS compartido y de compresión de respuesta en el host. Los informes `lighthouse-mobile.*` anteriores se conservan como historial del rediseño inicial.

## Alcance y pendientes de publicación

- **Contacto:** número proporcionado por la usuaria y activado. Se comprobó su enlace, no una llamada real ni la titularidad de la línea. No se añadieron credenciales profesionales.
- **Dominio y alojamiento:** no proporcionados. La entrega está lista para publicar como archivos estáticos; DNS, HTTPS y cabeceras efectivas deben verificarse en el proveedor elegido. Canonical y sitemap se generan al definir `SITE_ORIGIN`.
- **Revisión jurídica:** el estado editorial pendiente permanece visible. La refactorización no representa una revisión jurídica integral.
- **Accesibilidad y compatibilidad:** no se realizó auditoría manual con lectores de pantalla ni pruebas en Safari, Firefox o dispositivos físicos. No se declara conformidad WCAG a partir de pruebas automáticas.
- **Fuentes externas:** el sitio conserva enlaces oficiales; no se garantiza su disponibilidad futura.

La guía operativa está en [Despliegue](DESPLIEGUE.md). Solo debe publicarse `dist/`; informes, respaldo, código de generación y pruebas quedan fuera.
