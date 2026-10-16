# Despliegue de Autoría Colombia

La entrega técnica es `dist/`. No requiere servidor Node en producción ni instalación de paquetes. El número publicado es **+57 3122062892**, enlazado como `tel:+573122062892`.

## Preparar la versión

1. Usa Node.js 20 o posterior.
2. Define `SITE_ORIGIN` con el origen HTTPS real que te entregue tu alojamiento, sin rutas, parámetros ni fragmentos. También puedes guardar ese valor en `src/config/site.js`.
3. Ejecuta `npm run predeploy` con esa variable disponible. El comando verifica sintaxis, genera `dist/` y ejecuta las pruebas.
4. Publica el contenido completo de `dist/` como una nueva versión del alojamiento.

La variable debe permanecer disponible si vuelves a generar: el build reemplaza todo `dist/`. Sin dominio configurado, el sitio funciona con URLs relativas; canonical, `og:url` y sitemap se omiten. Al definir el origen real se generan automáticamente. No introduzcas un dominio de ejemplo en producción.

El paquete local `artifacts/releases/autoria-colombia-2.1.0.zip` contiene la compilación preparada para esta entrega, sin dominio de producción porque aún no fue proporcionado. Se puede descomprimir directamente en la raíz pública. Si configuras el dominio después, utiliza el nuevo `dist/` y vuelve a crear el paquete para evitar publicar una versión anterior.

## Configuración del alojamiento

| Ajuste | Valor |
|---|---|
| Comando de build, si compila desde fuente | `npm run predeploy` |
| Directorio de publicación | `dist` |
| Documento de inicio | `index.html` |
| Documento de error | `404.html`, con estado HTTP 404 |
| Rutas | Archivos `.html` conservando su extensión |
| HTTPS | Activado con certificado del dominio |
| Compresión | Brotli o gzip, si el alojamiento los ofrece |
| Caché | Revalidar; los nombres de recursos no tienen hash |

No configures todas las rutas como `index.html`: los artículos tienen HTML propio y las rutas desconocidas deben devolver 404. Publica la carpeta como raíz del dominio; la configuración de canonical y sitemap asume ese montaje.

`dist/_headers` incluye CSP, bloqueo de marcos, `nosniff`, política de referente y permisos de cámara, micrófono y ubicación. Netlify y Cloudflare Pages reconocen este formato. En otros alojamientos hay que aplicar cabeceras equivalentes desde su configuración; subir el archivo no garantiza que se apliquen. La fuente de esos valores es `tooling/headers.mjs`.

La CSP permite scripts del mismo origen; los estilos admiten atributos inline utilizados por indicadores de progreso. No hay scripts de analítica, fuentes remotas, formularios ni cookies de la aplicación. No se configura HSTS antes de conocer y comprobar el dominio HTTPS.

## Comprobación tras publicar

- Abre portada, un artículo, búsqueda y contacto directamente desde sus URLs.
- Comprueba que una URL inexistente devuelve HTTP 404, con estilos y navegación operativos.
- Verifica el enlace telefónico desde un móvil. Las pruebas locales validan su destino, no una llamada real.
- Comprueba HTTPS, cabeceras, MIME de JavaScript y ausencia de errores de carga en el navegador.
- Si definiste el origen, abre `sitemap.xml` y revisa el canonical de un artículo.
- Prueba menú móvil, modo oscuro, un cuestionario y regreso a una página tras publicar una actualización.

Conserva la versión anterior del alojamiento para poder revertir. El ZIP y su archivo SHA-256 identifican la entrega local; los informes de prueba están fuera del directorio público.

## Estado de esta entrega

El sitio fue preparado y validado localmente. No se realizó una publicación externa ni se configuró DNS. El dominio y el proveedor siguen pendientes de definición. El contenido mantiene su estado visible de revisión jurídica; no se añadieron credenciales profesionales ni aprobaciones editoriales.
