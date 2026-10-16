# Diagnóstico del proyecto y decisiones de rediseño

Este documento describe el rediseño inicial. La reorganización posterior y la preparación para despliegue se documentan en [Arquitectura](ARQUITECTURA.md) y [Despliegue](DESPLIEGUE.md). El teléfono autorizado +57 3122062892 ya está publicado en la configuración actual.

## Punto de partida

La versión recibida era una aplicación estática con rutas hash. Su navegación mostraba simultáneamente siete destinos educativos; la portada priorizaba el orientador, tarjetas repetidas y actividades de verdadero/falso. Los estilos azules, las sombras, los botones redondeados y los iconos emoji no diferenciaban una biblioteca jurídica de una aplicación educativa genérica.

Los artículos se insertaban mediante JavaScript y carecían de índice interno y referencias normativas enlazadas. La página de fuentes enlazaba principalmente portales institucionales. No existía una página de contacto ni configuración telefónica.

## Conservado

Se mantuvieron los doce temas con su desarrollo, objetivos, conceptos, ejemplos, resúmenes y relaciones; los veinte términos del glosario; los casos prácticos; todos los cuestionarios; el contenido del explorador; los mitos y la funcionalidad de búsqueda y tema oscuro. No se añadió un framework ni un backend.

Los enlaces antiguos por hash continúan funcionando mediante un adaptador. La preferencia de tema conserva su clave de almacenamiento anterior.

## Cambiado

- La navegación principal se centra en Inicio, Derecho de autor, Temas, Preguntas frecuentes y Contacto. Los recursos complementarios se agrupan en la biblioteca y el pie.
- La portada ofrece explicaciones completas antes de actividades opcionales: fundamentos, obras, derechos morales y patrimoniales, registro y preguntas frecuentes.
- Se creó una identidad de publicación contemporánea con marfil, verde petróleo, serif de sistema, cuadrícula y divisores. La ilustración central es un SVG original sobre expresión, obra y protección.
- Se generan páginas HTML independientes para todos los contenidos, con títulos y descripciones propios. El texto y los enlaces funcionan sin JavaScript; las interacciones se añaden como mejora progresiva.
- Se separaron plantillas, contenido, configuración, comportamiento y sistema visual. Cabecera, pie, contacto y plantilla de artículo tienen una sola definición.
- El contacto presenta explícitamente su falta de disponibilidad hasta recibir datos autorizados.

## Defectos funcionales corregidos

- El módulo de software carecía de `relatedTopics` y `sourceReferences`, aunque su plantilla invocaba `.map()` sobre ellos: se completaron sus datos.
- Las FAQ del buscador enlazaban al orientador, no a una respuesta. Ahora abren la pregunta exacta; los términos enlazan a su definición.
- Los filtros de búsqueda no se aplicaban a consultas vacías; ahora funcionan también sin texto.
- La consulta se interpolaba como HTML en el estado sin resultados. Ahora se escapa antes de mostrarla.
- El cuestionario deducía la pregunta actual de la primera respuesta vacía; esto impedía retroceder de forma fiable. Ahora mantiene un índice explícito, conserva respuestas y permite revisarlas.
- El almacenamiento local podía fallar y romper lecturas. Ahora solo se utiliza para mejoras opcionales y se controla su indisponibilidad o corrupción.
- La preferencia de color del sistema quedaba anulada por el valor por defecto. Ahora se respeta cuando no existe una elección guardada y el tema se aplica antes de los estilos.
- Los tiempos de lectura se calculaban desde recuentos declarados mayores que el texto existente. Se calculan desde el contenido disponible.

## Ajustes editoriales de precisión

Se aclararon las diferencias entre distribución y comunicación pública, plagio e infracción, y dominio público y respeto de derechos morales. La protección del software se vinculó al artículo 23 de la Decisión Andina 351. El artículo de IA incorporó los pronunciamientos de la DNDA y distinguió resultados generados de aportes creativos humanos asistidos por herramientas.

Fuentes consultadas para estas comprobaciones: [Ley 23 de 1982, texto con notas de vigencia](https://cancilleria.gov.co/normograma/compilacion/docs/ley_0023_1982.htm), [Decisión Andina 351](https://www.wipo.int/wipolex/es/legislation/details/9445), [pronunciamientos de la DNDA sobre IA](https://www.derechodeautor.gov.co/es/pronunciamientos-sobre-ia) y [sistema de registro de la DNDA](https://registro.derechodeautor.gov.co/).

Estos ajustes no constituyen una revisión profesional integral. El estado de revisión pendiente sigue visible en todos los artículos.
