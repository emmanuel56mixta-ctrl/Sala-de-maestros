---
version: alpha
name: Sala de Maestros
description: Plataforma de formación para docentes en México. Un sistema sereno y de lectura larga, sobre blanco cálido, con tinta petróleo, Poppins para títulos y Aileron para leer. El color de marca se reserva para la acción y la selección; el verde y el ámbar solo dicen "correcto" y "revisa". La fotografía de docentes aporta la calidez; la interfaz se mantiene quieta para que el caso y la explicación sean lo importante.

colors:
  brand: "#1d5661"          # acción principal, selección, paso activo
  brand-dark: "#153f48"     # hover, foco, enlaces
  brand-soft: "#e8f0f1"     # fondo de opción seleccionada, chip neutro
  on-brand: "#ffffff"
  ink: "#24363a"            # texto principal (11.7:1 sobre canvas)
  ink-muted: "#546569"      # texto secundario (5.6:1 sobre canvas)
  canvas: "#f7f6f1"         # fondo de página
  surface: "#ffffff"        # lectura, tarjetas
  surface-alt: "#efeee7"    # paneles secundarios
  hairline: "#d8dedb"
  hairline-strong: "#788d8e"  # bordes de controles (3:1 mínimo)
  sand: "#cbb88f"           # solo decoración
  sand-soft: "#f1ebdd"      # ejemplos, citas de caso
  success: "#2e6b45"
  success-soft: "#edf5e6"
  warning: "#735920"
  warning-soft: "#fff3d4"
  danger: "#b42318"
  danger-soft: "#fce7de"

typography:
  display:   { fontFamily: Poppins, fontSize: 64px, fontWeight: 800, lineHeight: 1.0,  letterSpacing: -0.03em }   # solo marca en portada
  heading-1: { fontFamily: Poppins, fontSize: 44px, fontWeight: 700, lineHeight: 1.1,  letterSpacing: -0.025em }
  heading-2: { fontFamily: Poppins, fontSize: 32px, fontWeight: 700, lineHeight: 1.2,  letterSpacing: -0.025em }
  heading-3: { fontFamily: Poppins, fontSize: 24px, fontWeight: 700, lineHeight: 1.3,  letterSpacing: -0.02em }
  title:     { fontFamily: Aileron, fontSize: 18px, fontWeight: 700, lineHeight: 1.4,  letterSpacing: 0 }
  body-lg:   { fontFamily: Aileron, fontSize: 18px, fontWeight: 400, lineHeight: 1.7,  letterSpacing: 0 }        # lectura de lección
  body:      { fontFamily: Aileron, fontSize: 16px, fontWeight: 400, lineHeight: 1.65, letterSpacing: 0 }
  small:     { fontFamily: Aileron, fontSize: 14px, fontWeight: 400, lineHeight: 1.55, letterSpacing: 0 }
  label:     { fontFamily: Aileron, fontSize: 12px, fontWeight: 700, lineHeight: 1.4,  letterSpacing: 0.08em }   # mayúsculas; mínimo absoluto
  button:    { fontFamily: Aileron, fontSize: 16px, fontWeight: 700, lineHeight: 1.2,  letterSpacing: 0 }

rounded:
  sm: 6px     # botones, campos, opciones de respuesta
  md: 12px    # tarjetas, paneles de lectura, diálogos
  full: 999px # solo chips de estado

spacing:
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 24px
  6: 32px
  7: 48px
  8: 72px

breakpoints:
  sm: 480px
  md: 768px
  lg: 1100px
  container: 1180px
  reading: 68ch

motion:
  fast: 140ms
  base: 220ms
  page: 620ms        # transición de retratos entre documentos
  easing: cubic-bezier(.2,.7,.2,1)
  reduced: none      # con prefers-reduced-motion todo se muestra sin animar

components:
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    height: 64px
    borderBottom: "{colors.hairline}"
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    minHeight: 48px
    padding: 12px 20px
  button-primary-hover:
    backgroundColor: "{colors.brand-dark}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.brand-dark}"
    border: "1px {colors.hairline-strong}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    minHeight: 48px
  button-text:
    textColor: "{colors.brand-dark}"
    typography: "{typography.button}"
    minHeight: 44px
  chip-status:
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: 4px 10px
    variants:
      disponible:   { backgroundColor: "{colors.success-soft}", textColor: "{colors.success}" }
      proximamente: { backgroundColor: "{colors.surface-alt}",  textColor: "{colors.ink-muted}" }
      gratuita:     { backgroundColor: "{colors.brand-soft}",   textColor: "{colors.brand-dark}" }
  course-card:
    backgroundColor: "{colors.surface}"
    border: "1px {colors.hairline}"
    rounded: "{rounded.md}"
    padding: "{spacing.5}"
  lesson-stepper:
    stepActive: "{colors.brand}"
    stepDone: "{colors.brand-dark}"
    stepPending: "{colors.hairline-strong}"
    typography: "{typography.small}"
    sticky: true
  answer-option:
    backgroundColor: "{colors.surface}"
    border: "1px {colors.hairline-strong}"
    rounded: "{rounded.sm}"
    padding: "{spacing.4}"
    minHeight: 56px
    selected: { backgroundColor: "{colors.brand-soft}", border: "2px {colors.brand}" }
  feedback-callout:
    rounded: "{rounded.md}"
    padding: "{spacing.4} {spacing.5}"
    variants:
      correcta:   { backgroundColor: "{colors.success-soft}", textColor: "{colors.ink}", accent: "{colors.success}" }
      incorrecta: { backgroundColor: "{colors.warning-soft}", textColor: "{colors.ink}", accent: "{colors.warning}" }
  case-quote:
    backgroundColor: "{colors.sand-soft}"
    rounded: "{rounded.md}"
    padding: "{spacing.5}"
    typography: "{typography.body-lg}"
  source-card:
    backgroundColor: "{colors.surface-alt}"
    rounded: "{rounded.md}"
    padding: "{spacing.4}"
    typography: "{typography.small}"
  price-panel:
    backgroundColor: "{colors.surface}"
    border: "1px {colors.hairline}"
    rounded: "{rounded.md}"
    padding: "{spacing.5}"
  focus-ring:
    outline: "3px solid {colors.brand-dark}"
    outlineOffset: 3px
---

## Overview

Sala de Maestros es un cuarto tranquilo para estudiar: fondo de papel cálido (`{colors.canvas}`), tinta petróleo (`{colors.ink}`) y un único color de acción (`{colors.brand}`). La personalidad la ponen las personas, en los retratos de la portada y en la fotografía de docentes, nunca la interfaz. Cada pantalla tiene un trabajo: elegir un curso, probar una lección o continuar donde se quedó la persona. Todo lo demás es secundario.

El público son docentes de 25 a 60 años, a menudo en el teléfono, al final de la jornada y con poco tiempo. Por eso el sistema prefiere lectura cómoda (18 px en lecciones), botones grandes, estados explícitos con texto y cero movimiento que compita con el contenido.

## Colors

- **Acción**: `brand` es para el botón principal, la opción seleccionada y el paso activo. Si en una vista hay dos botones `brand`, uno sobra.
- **Superficies**: `canvas` es el fondo de página, `surface` es lo que se lee y `surface-alt` lo que acompaña. `sand-soft` marca el texto de un caso o ejemplo.
- **Semántica**: `success` y `warning` solo aparecen en retroalimentación de aprendizaje y en chips de estado. Siempre van con una palabra ("Respuesta correcta", "Revisa este punto").
- **Prohibido**: valores hex sueltos en componentes. Todo color sale de un token. Un lint (stylelint `color-no-hex` fuera de `globals.css`) lo vigila.

## Typography

- Poppins 700 para títulos de contenido; 800 solo para la marca en la portada (`display`). No se usa 900.
- Aileron para todo lo que se lee o se pulsa.
- **Nada por debajo de 12 px.** Etiquetas en mayúsculas con `label`; metadatos con `small` (14 px).
- Lecciones en `body-lg` con un ancho de 60–68 caracteres.
- Interletraje de títulos entre −0.02 y −0.03 em. No se comprimen palabras para que quepan.
- Fuentes servidas en WOFF2, con subconjunto latino y `font-display: swap`.

## Layout

- Rejilla de 12 columnas, contenedor de 1180 px, medianil de 16 px en móvil y 24 px en escritorio.
- Separación entre secciones: `spacing.8` en escritorio y `spacing.7` en móvil. Una sola línea divisoria como máximo entre secciones.
- Primera pantalla de la portada: propuesta de valor + acción principal visibles sin desplazarse a 375×667 y 1280×720.
- En las lecciones, el contenido empieza en la primera pantalla; la cabecera del curso se reduce a una miga de pan.

## Elevation & Depth

Planos y bordes finos. La sombra se reserva para diálogos y para el stepper fijo cuando se desplaza sobre el contenido (`0 2px 12px rgb(36 54 58 / .08)`).

## Shapes

Tres radios y nada más: `sm` 6 px (controles), `md` 12 px (contenedores), `full` (chips). Las fotografías usan `md`.

## Components

- **Navegación**: marca a la izquierda; "Cursos" y "Ya tengo cuenta" (botón secundario con borde) a la derecha. El acceso abre el inicio de sesión del asesor en otro dominio: el enlace lo indica en su `title` y el pie lo explica.
- **Botones**: principal sólido, secundario con borde y de texto. Altura mínima de 48 px (44 px los de texto). El texto dice qué pasa: "Responder la pregunta", no "Continuar".
- **Chips de estado**: Disponible, Próximamente y Lección gratuita. Un curso "Próximamente" no muestra el precio como dato principal ni usa un botón principal.
- **Stepper de lección**: Lectura → Pregunta → Explicación, fijo arriba y con estado textual ("Paso 2 de 3 · Pregunta"). Al cambiar de paso, el foco y el scroll van al título del paso.
- **Opción de respuesta**: toda la tarjeta es el área de clic, el radio es nativo y la letra (A, B, C) está siempre visible.
- **Retroalimentación**: callout con la palabra de estado en negrita, seguida de la razón en una frase. Nunca solo color.
- **Cierre de lección**: tras la explicación, acierte o no, aparece "Sigue con el curso completo" con el temario como acción principal y "Qué incluye y cuánto cuesta" como secundaria. Nunca un callejón sin salida.

## States

- **Cargando**: se conserva la estructura y el nombre de la acción ("Comprobando…").
- **Vacío**: se explica qué falta y se ofrece una acción real.
- **Error**: qué pasó, qué hacer y un botón para reintentar.
- **Próximamente**: qué incluirá y cuándo (si se sabe). El precio aparece como "Precio previsto", en texto secundario. Pendiente: lista de espera "Avísame cuando abra", que necesita un servicio para guardar correos.

## Motion

Las transiciones duran 140–220 ms. La transición de retratos de 620 ms se mantiene. No hay carruseles automáticos de contenido que haya que leer. Con `prefers-reduced-motion: reduce`, todo aparece en su sitio sin animar.

## Do's and Don'ts

**Sí**
- Un botón principal por vista.
- Escribir el estado con palabras.
- Citar la fuente de cada caso y marcar las imágenes generadas con IA.
- Probar cada pantalla a 320 px, a 200 % de zoom y con teclado.

**No**
- Precios grandes en cursos que aún no se pueden comprar.
- Logotipos de gobierno que parezcan un aval.
- Texto de menos de 12 px, radios fuera de la escala o hex sueltos.
- Animaciones que retrasen la lectura del título o del caso.

## Reglas propias de Sala de Maestros

Estas reglas vienen de la versión anterior de este documento y siguen vigentes.

### Propósito y jerarquía

Ayudar a un docente a elegir una formación, probar una lección y volver a su curso. Las dos entradas de la portada son Promoción docente y Herramientas digitales e IA. Se conserva la continuidad de los retratos: hombre a la izquierda y mujer a la derecha, grandes en la categoría elegida. La propuesta de valor y «Probar una lección gratuita» son visibles en el primer cuadro de la portada.

### Movimiento y control

- Conservar el breve recorrido de 100–140 px de portada y las transiciones de retratos aprobadas; no bloquear rueda, gesto ni navegación nativa.
- Las pestañas de Cómo vas a estudiar cambian por elección del usuario y no desplazan la página. Flechas, Home y End deben funcionar; los paneles inactivos quedan fuera del foco y de la lectura asistida.
- Los títulos de contenido se leen de inmediato. El cursor explicativo del caso conserva pausa, pasos y lectura completa.
- Respetar movimiento reducido y conservar una presentación utilizable sin animación. Ningún acceso depende de un temporizador.

### Confianza y estados

- Usar datos verificables. El contador simulado de inscritos se retiró de la portada; mostrar la lección y el ejercicio reales.
- Identificar imágenes generadas y citas externas. No presentarlas como fotografías de estudiantes inscritos o testimonios de clientes.
- Foco: contorno visible de 3 px con separación, incluido teclado en pestañas y controles.
- Próximamente: explicar que el contenido está en preparación y no ofrecer actividades inexistentes.
- Carga: conservar la estructura y el nombre de la acción; no simular éxito antes de completar una operación.
- Vacío o error: explicar qué falta o qué ocurrió y ofrecer un siguiente paso real. No inventar progreso, inscripciones ni resultados.
- Autenticación, pagos, claves y progreso no se resuelven con estilos. La web pública no modifica los permisos del asesor.

### Referencias y comprobación

Se adopta de [getdesign.md](https://getdesign.md/) su enfoque de documentar un lenguaje visual reutilizable. El [análisis de Mintlify](https://getdesign.md/mintlify/design-md), consultado junto con la copia local de VoltAgent, orienta la jerarquía de lectura, el ritmo de espaciado y los estados visibles. Es una interpretación independiente de patrones públicos, no un sistema oficial de Mintlify. Sus logotipos, colores verdes, fuentes y botones tipo píldora no forman parte de Sala de Maestros.

Antes de cerrar una revisión: comprobar una pantalla representativa, navegación con teclado, móvil, URLs de Worker/Pages, estados de disponibilidad y contraste. La comprobación parcial no equivale a una certificación de accesibilidad. Referencias: [navegación consistente](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html), [contraste](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) y [tamaño de objetivos](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

### Comprobación automática

`node scripts/check-design.mjs` revisa el CSS público: texto de menos de 12 px, radios fuera de la escala y colores hex fuera de `app/globals.css`. Los dos últimos se informan como deuda existente; con `--strict` cualquier hallazgo hace fallar el comando.
