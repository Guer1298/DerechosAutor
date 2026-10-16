# Sistema de diseño · Autoría Colombia

## Dirección editorial

Tipografía y espacio organizan la información. La asimetría de la portada se equilibra con una lámina SVG original. Los conceptos se presentan en columnas y listas con divisores; las superficies distinguen resúmenes, ejemplos y orientación. No hay fuentes remotas, imágenes de stock, animaciones continuas ni dependencias visuales externas.

## Tokens

La fuente de verdad es `src/styles/tokens.css`.

| Token | Claro | Función |
|---|---|---|
| `--color-background` | `#F8F6F1` | Fondo marfil |
| `--color-primary` | `#183C40` | Acciones, vínculos y contraste editorial |
| `--color-text` | `#202625` | Texto principal |
| `--color-accent` | `#A66B50` | Terracota decorativa |
| `--accent-text` | `#87513B` | Variante de terracota para texto pequeño con contraste |
| `--color-surface` | `#DFE7E2` | Resúmenes y registro |
| `--color-white` | `#FFFFFF` | Blanco disponible en el sistema |
| `--text-soft` | `#5B635F` | Texto secundario |
| `--line` | `#D7DBD2` | Divisores |
| `--line-strong` | `#89958B` | Contornos de controles |
| `--focus` | `#836043` | Foco con contorno de 2 px y separación |
| `--success` | `#246247` | Éxito |
| `--warning` | `#78530E` | Advertencia |
| `--error` | `#A03832` | Error |

El modo oscuro redefine los colores semánticos: fondo `#152323`, texto `#EDECE4`, secundario `#B9C4BC`, superficies `#263C37`, enlaces `#C0D7C8`. Las acciones conservan contraste mediante `--on-primary`. El estado se expresa también con texto, bordes y atributos ARIA.

## Tipografía y escala

- Titulares: Georgia, con Times New Roman y serif como alternativas locales.
- Interfaz y párrafos: tipografía de sistema (`-apple-system`, Segoe UI, Arial, sans-serif).
- H1: adaptable con `clamp()`, hasta aproximadamente 76 px; la portada usa tres líneas y una conclusión en cursiva.
- H2: 32–48 px según el espacio disponible.
- H3: 24–32 px; tamaños ajustados en índices y categorías.
- Texto extenso de artículos: 18–20 px, interlineado 1.85 y columna máxima de 670 px.
- Etiquetas de navegación, acciones, metadatos y pies de ilustración usan escalas subordinadas a los títulos y al contenido.

No se requiere descargar fuentes ni aceptar cookies para mostrar texto.

## Espaciado y cuadrícula

Escala: 4, 8, 12, 16, 24, 32, 48, 64 y 96 px. Contenedor máximo: 1280 px. Márgenes laterales: 56 px en escritorio, 36 px en tablet y 20 px en móvil.

- Portada: dos columnas asimétricas; lectura y lámina gráfica.
- Obras: cuatro columnas en escritorio, dos en móvil, separadas por líneas.
- Comparación de derechos: dos columnas que se apilan en móvil.
- Artículo: índice de 210 px, lectura de hasta 670 px y notas contextuales; se reorganiza a dos columnas y luego a una.
- Recursos: tres columnas en escritorio y una en móvil.
- Atlas: cuatro ramas, dos en móvil y una en pantallas estrechas. Su HTML es una lista estructurada usable sin representación gráfica.

## Componentes y estados

- Botones con borde de radio 3 px y altura mínima de 52 px; iconos de 44 × 44 px.
- Enlaces de texto con iconos SVG locales, subrayado en hover y foco visible.
- Navegación activa con `aria-current="page"` y línea inferior.
- Índice de artículo con `aria-current="location"` al desplazarse.
- FAQ mediante `details/summary` nativos, operativos sin JavaScript.
- Filtros y opciones con `aria-pressed`; selección marcada mediante borde y superficie.
- Progreso con `role="progressbar"`; resultados y mensajes con regiones de estado.
- Contacto: disponible solo con estado confirmado y teléfono válido; en caso contrario, enlace a una explicación de disponibilidad.
- Errores, resultados vacíos y botones deshabilitados incluyen texto comprensible.

## Responsive y movimiento

Puntos de ajuste: 1200, 1000, 760 y 380 px; se comprueba también el reflujo a 320 px. La navegación se transforma en un menú desplegable bajo 760 px. Escape lo cierra y devuelve el foco al control. El teléfono y la búsqueda mantienen controles identificables en móvil.

Transiciones de 160 ms en cambios de estado. `prefers-reduced-motion` elimina transiciones y desplazamiento animado. La versión impresa oculta navegación y controles para privilegiar el contenido.

El sistema se diseñó con objetivos WCAG 2.2 AA. Las comprobaciones automáticas no sustituyen una auditoría de conformidad ni pruebas con lectores de pantalla.
