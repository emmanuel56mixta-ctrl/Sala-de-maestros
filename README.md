# Sala de Maestros

**Un espacio propio para encontrarse, aprender y prepararse.**

Plataforma de cursos para docentes, con portada interactiva, catálogo, páginas de curso y asesor de estudio para subdirección de secundaria. Incluye ruta de estudio, reactivos explicados, talleres de análisis, simulador y seguimiento del avance.

[Abrir Sala de Maestros](https://emmanuel56mixta-ctrl.github.io/Sala-de-maestros/) · [Entrar al asesor](https://ascenso-docente-laboratorio.mandrakker.chatgpt.site/asesor)

## Desarrollo local

Requisitos: **Node.js >=22.13.0** y **pnpm 11.25.0**.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

El servidor local muestra su dirección al iniciar. Un clon limpio utiliza automáticamente el perfil portable. La simulación de inicio de sesión del entorno local se limita a loopback y no se incluye en producción.

## Validación y compilación

```sh
pnpm exec tsc --noEmit
node tests/learning.mjs
node tests/orientation.mjs
node tests/course-sections.mjs
node tests/hero-transition.mjs
pnpm build
pnpm start
```

`pnpm start` permite revisar localmente el Worker compilado; no publica la aplicación.

## Organización

| Ruta o carpeta | Contenido |
| --- | --- |
| `/` | Portada de Sala de Maestros |
| `/cursos` | Catálogo de cursos |
| `/cursos/promocion-docente` | Cursos de promoción docente |
| `/cursos/herramientas-digitales` | Cursos de herramientas digitales e IA |
| `/cursos/[slug]` | Presentación y secuencia de cada curso |
| `/asesor` | Espacio de estudio con acceso restringido |
| `app/api/progress` | Lectura y guardado del avance |
| `lib/` | Contenidos y lógica de aprendizaje |
| `drizzle/` | Migraciones de Cloudflare D1 |
| `public/` | Imágenes, tipografías y documentos públicos |
| `PROJECT.md` | Decisiones y registro técnico del proyecto |

## Hosting y servicios

La portada, el catálogo completo, sus dos categorías, los detalles de los cuatro cursos y la lección gratuita se publican en **GitHub Pages**. Se generan HTML por ruta, recursos compilados y `.nojekyll` en la raíz de `main`; Pages debe usar **Deploy from a branch → main → / (root)**. Las rutas y los recursos incluyen el prefijo `/Sala-de-maestros/`, por lo que abrir o recargar una página de curso funciona directamente.

```sh
pnpm publish:pages
```

Este comando compila y copia la publicación estática a la raíz del repositorio. Hay que confirmar esos archivos junto con los cambios de fuente para actualizar Pages. `pnpm build:pages` permite compilar sin copiar la publicación. La compilación reutiliza los componentes del sitio y regenera únicamente los datos públicos de la lección gratuita.

Después de compilar Pages, `node tests/orientation.mjs --pages-build` comprueba las recomendaciones, los enlaces con prefijo, el HTML prerenderizado y que los cursos próximos sigan sin actividades habilitadas.

`node tests/course-sections.mjs --pages-build` verifica las dos categorías, sus tarjetas, la navegación y las fotografías publicadas. La portada permite elegir **Promoción docente** o **Herramientas digitales e IA**; el retrato elegido crece durante 740 ms antes de abrir la categoría. Los enlaces conservan la navegación nativa sin JavaScript, con movimiento reducido, en ventanas bajas y al abrir otra pestaña. `lib/course-sections.ts` define la agrupación mediante identificadores estables; la disponibilidad sigue viniendo del catálogo original.

La página del curso disponible ofrece dos preguntas opcionales (actividad y tiempo), con acceso directo a la lección. La lección gratuita tiene tres etapas: **Lectura → Pregunta → Explicación**. Los enlaces `?paso=comprende` y `?paso=aplica` permiten empezar en la lectura o la pregunta. Las respuestas se conservan al cambiar de etapa durante esa visita; no se escriben en el avance de la cuenta.

La paleta compartida se define en `app/globals.css`: petróleo para acciones y selección, blanco cálido para el fondo y arena para detalles decorativos. Los textos usan tinta oscura; las respuestas correctas, los reintentos y los marcadores didácticos mantienen colores propios. `app/identity.css` conserva las tipografías Poppins y Aileron y la composición de la marca.

El asesor completo conserva su servidor **Cloudflare Workers**, la autenticación y la base de datos **D1** en el alojamiento actual. El enlace “Entrar a mi curso” dirige allí. GitHub Pages no ejecuta el servidor ni guarda el avance; no se incluyen sesiones ni datos de docentes en los archivos estáticos.

El hosting actual proporciona la autenticación. Para desplegar fuera de ese entorno hay que integrar autenticación confiable, configurar el binding `DB`, aplicar las migraciones de `drizzle/` y definir `COURSE_OWNER_EMAIL` como variable privada del servidor. No se deben aceptar como prueba de identidad cabeceras enviadas directamente por el cliente.

La configuración `.openai/hosting.json` es necesaria para la compilación actual y conserva la referencia al sitio existente. Las credenciales, sesiones y registros de docentes no se incluyen en este repositorio.

## Estado de la plataforma

- El curso de subdirección de secundaria está implementado; las demás ofertas del catálogo están identificadas como próximas.
- La integración de pagos está pendiente; los controles actuales no simulan cobros ni compras exitosas.
- El contador animado de la portada está identificado como cifra simulada y no equivale a inscripciones verificadas.
- Las voces docentes conservan sus fuentes y contexto; no son testimonios de clientes de la plataforma.

Las licencias y procedencia de tipografías y recursos se conservan junto a sus archivos.
