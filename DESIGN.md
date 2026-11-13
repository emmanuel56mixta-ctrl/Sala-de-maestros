# Sala de Maestros · Sistema de diseño

Reglas adoptadas el 12 de noviembre de 2026 para la web pública. La identidad existente sigue siendo la base: azul petróleo, blanco cálido, Poppins, Aileron y fotografía. No es una plantilla de otra marca.

## Propósito y jerarquía

Ayudar a un docente a elegir una formación, probar una lección y volver a su curso. Las dos entradas de portada son Promoción docente y Herramientas digitales e IA. Se conserva la continuidad de los retratos: hombre a la izquierda y mujer a la derecha, grandes en la categoría elegida.

1. Navegación estable: cursos o regreso al nivel anterior, seguido de Entrar a mi curso. Repetir el acceso en el pie. Pages conduce al asesor alojado; el Worker usa su ruta interna.
2. Presentación: decir qué se puede estudiar y ofrecer una prueba real.
3. Aprendizaje: mostrar el caso, la elección y la explicación sin competir con el contenido mediante decoración.
4. Disponibilidad: identificar cursos próximos y aclarar que la inscripción de pago aún no está habilitada. El precio procede del catálogo, no del diseño.

## Colores por función

Los valores viven en `app/globals.css`; no duplicarlos en componentes.

| Función | Token | Valor |
|---|---|---|
| Acción principal y selección | `--brand` | `#1d5661` |
| Enlace, foco, hover | `--brand-dark` | `#153f48` |
| Selección suave | `--brand-soft` | `#e8f0f1` |
| Texto principal | `--ink` | `#24363a` |
| Texto secundario | `--text-muted` | `#546569` |
| Fondo de página | `--canvas` | `#f7f6f1` |
| Superficie de lectura | `--surface` | `#ffffff` |
| Superficie secundaria | `--surface-alt` | `#efeee7` |
| Ejemplo o detalle cálido | `--sand-soft` | `#f1ebdd` |

El verde y el ámbar del feedback conservan su significado propio. El estado debe expresarse también con texto, nunca solo mediante color. La paleta no necesita más colores para distinguir secciones.

## Tipografía y lectura

- Poppins 700 para títulos de contenido. Reservar 800/900 al logotipo y al título de gran formato de la portada.
- Aileron 400/600/700 para lectura, botones, instrucciones y metadatos. No incorporar otra familia.
- Cuerpo principal de 16–18 px, interlineado 1.65–1.8; texto secundario de 13–14 px. Etiquetas breves: al menos 12 px en los componentes revisados.
- Títulos de tarjetas de 22–28 px; títulos de sección de 30–44 px. Mantener la jerarquía en móvil con saltos naturales, sin forzar una sola línea.
- Separación de títulos cercana a −.025em; evitar comprimir palabras para que quepan.
- Texto descriptivo de unas 45–65 letras por línea cuando el ancho lo permita. En ejercicios, priorizar párrafos y opciones completos.

## Espacio y componentes

Usar incrementos de 4/8 px. Secciones públicas: 48–72 px de separación; tarjetas: 24–32 px de relleno, reducido con cuidado en móvil. Evitar dos divisores consecutivos entre secciones.

Botones principales: alto mínimo de 48 px, radio de 6 px, texto explícito y una flecha opcional decorativa. Navegación e iconos: área de interacción de al menos 44 px como objetivo del producto. Tarjetas y paneles de lectura: radio de 12 px, borde discreto y sombra excepcional. Las pestañas son un patrón distinto y usan borde inferior para mostrar selección.

Un enlace debe ejecutar la acción que anuncia. Los elementos que describen funciones del curso completo no deben parecer botones si el visitante no puede abrirlas. Las tarjetas del catálogo comparten alineación y separan título, descripción, precio y acción.

## Movimiento y control

- Conservar el breve recorrido de 100–140 px de portada y las transiciones de retratos aprobadas; no bloquear rueda, gesto ni navegación nativa.
- Las pestañas de Cómo vas a estudiar cambian por elección del usuario y no desplazan la página. Flechas, Home y End deben funcionar; los paneles inactivos quedan fuera del foco y de la lectura asistida.
- Los títulos de contenido se leen de inmediato. El cursor explicativo del caso conserva pausa, pasos y lectura completa.
- Respetar movimiento reducido y conservar una presentación utilizable sin animación. Ningún acceso depende de un temporizador.

## Confianza y estados

- Usar datos verificables. El contador simulado de inscritos se retiró de la portada; mostrar la lección y el ejercicio reales.
- Identificar imágenes generadas y citas externas. No presentarlas como fotografías de estudiantes inscritos o testimonios de clientes.
- Foco: contorno visible de 3 px con separación, incluido teclado en pestañas y controles.
- Próximamente: explicar que el contenido está en preparación y no ofrecer actividades inexistentes.
- Carga: conservar la estructura y el nombre de la acción; no simular éxito antes de completar una operación.
- Vacío o error: explicar qué falta o qué ocurrió y ofrecer un siguiente paso real. No inventar progreso, inscripciones ni resultados.
- Autenticación, pagos, claves y progreso no se resuelven con estilos. La web pública no modifica los permisos del asesor.

## Referencias y comprobación

Se adopta de [getdesign.md](https://getdesign.md/) su enfoque de documentar un lenguaje visual reutilizable. El [análisis de Mintlify](https://getdesign.md/mintlify/design-md), consultado junto con la copia local de VoltAgent, orienta la jerarquía de lectura, el ritmo de espaciado y los estados visibles. Es una interpretación independiente de patrones públicos, no un sistema oficial de Mintlify. Sus logotipos, colores verdes, fuentes y botones tipo píldora no forman parte de Sala de Maestros.

Antes de cerrar una revisión: comprobar una pantalla representativa, navegación con teclado, móvil, URLs de Worker/Pages, estados de disponibilidad y contraste. La comprobación parcial no equivale a una certificación de accesibilidad. Referencias: [navegación consistente](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html), [contraste](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) y [tamaño de objetivos](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
