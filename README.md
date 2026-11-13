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
node tests/case-analysis.mjs
node tests/free-lesson.mjs
node scripts/check-design.mjs
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
| `DESIGN.md` | Reglas visuales y de interacción de la web pública |
| `docs/ux-ui-audit.md` | Auditoría de UX/UI, cambios y límites de verificación |

## Hosting y servicios

La portada, el catálogo completo, sus dos categorías, los detalles de los cuatro cursos y la lección gratuita se publican en **GitHub Pages**. Se generan HTML por ruta, recursos compilados y `.nojekyll` en la raíz de `main`; Pages debe usar **Deploy from a branch → main → / (root)**. Las rutas y los recursos incluyen el prefijo `/Sala-de-maestros/`, por lo que abrir o recargar una página de curso funciona directamente.

```sh
pnpm publish:pages
```

Este comando compila y copia la publicación estática a la raíz del repositorio. Hay que confirmar esos archivos junto con los cambios de fuente para actualizar Pages. `pnpm build:pages` permite compilar sin copiar la publicación. La compilación reutiliza los componentes del sitio y regenera únicamente los datos públicos de la lección gratuita.

Después de compilar Pages, `node tests/orientation.mjs --pages-build` comprueba las recomendaciones, los enlaces con prefijo, el HTML prerenderizado y que los cursos próximos sigan sin actividades habilitadas.

`node tests/course-sections.mjs --pages-build` verifica las dos categorías, sus tarjetas, la navegación y las fotografías publicadas. La portada permite elegir **Promoción docente** o **Herramientas digitales e IA**. El retrato elegido permanece en la categoría: el hombre a la izquierda y la mujer a la derecha, con un recuadro de presentación al lado opuesto y el catálogo debajo. En móvil el recuadro se coloca debajo del retrato y este conserva su alineación lateral. `lib/course-sections.ts` define la agrupación mediante identificadores estables; la disponibilidad sigue viniendo del catálogo original.

Los accesos son enlaces nativos sin espera ni capa superpuesta. Los navegadores compatibles animan el mismo retrato entre documentos mediante View Transitions; los demás abren directamente la categoría. La preferencia de movimiento reducido desactiva las transiciones y entradas animadas. `node tests/hero-transition.mjs --pages-build` verifica la continuidad de imágenes y nombres, el HTML de destino y las rutas de Worker y Pages. La posición y la animación se revisan en navegador.

La página del curso ofrece entradas directas a lectura, práctica y temario. La lección gratuita tiene tres etapas compactas: **Lectura → Práctica → Explicación**. Los enlaces `?paso=comprende` y `?paso=aplica` conservan su función. La lectura enseña un criterio con un ejemplo distinto de los dos casos: interpretación de gráficas y entrega de una grabación oral.

El análisis del primer caso avanza manualmente y muestra cada cita junto a su explicación completa. Solo ofrece Anterior, Siguiente, progreso y una alternativa para leer todo. El segundo caso se presenta tras responder el primero y no muestra su explicación antes de responder. El cierre distingue resultados del primer intento y correcciones con ayuda; después invita al curso con una sola acción. Las respuestas viven únicamente en memoria durante esa visita y se borran al recargar o salir.

El contenido público nuevo está en `lib/free-lesson.ts`; `lib/free-lesson-progress.ts` conserva el historial de intentos durante la visita. No se cambian las preguntas privadas ni sus claves. La duración de 15–20 minutos es orientativa; el protocolo pendiente con docentes está en `docs/free-lesson-validation.md`.

La navegación pública comparte el acceso «Entrar a mi curso», que inicia sesión y conserva `/asesor` como destino. La portada ofrece una lección gratuita sin registro. El método se explica en pestañas manuales **Lee → Responde → Revisa → Repasa**, con teclado y sin scroll forzado. La ficha distingue contenido incluido y actividades públicas; la inscripción pendiente se anuncia antes del botón. `DESIGN.md` documenta las reglas de lectura, espaciado, controles y estados.

La paleta compartida se define en `app/globals.css`: petróleo para acciones y selección, blanco cálido para el fondo y arena para detalles decorativos. Los textos usan tinta oscura; las respuestas correctas, los reintentos y los marcadores didácticos mantienen colores propios. `app/identity.css` conserva las tipografías Poppins y Aileron y la composición de la marca.

El asesor completo conserva su servidor **Cloudflare Workers**, la autenticación y la base de datos **D1** en el alojamiento actual. El enlace “Entrar a mi curso” dirige allí. GitHub Pages no ejecuta el servidor ni guarda el avance; no se incluyen sesiones ni datos de docentes en los archivos estáticos.

El hosting actual proporciona la autenticación. Para desplegar fuera de ese entorno hay que integrar autenticación confiable, configurar el binding `DB`, aplicar las migraciones de `drizzle/` y definir `COURSE_OWNER_EMAIL` como variable privada del servidor. No se deben aceptar como prueba de identidad cabeceras enviadas directamente por el cliente.

La configuración `.openai/hosting.json` es necesaria para la compilación actual y conserva la referencia al sitio existente. Las credenciales, sesiones y registros de docentes no se incluyen en este repositorio.

## Estado de la plataforma

- El curso de subdirección de secundaria está implementado; las demás ofertas del catálogo están identificadas como próximas.
- La integración de pagos está pendiente; los controles actuales no simulan cobros ni compras exitosas.
- La portada muestra una lección y un caso reales; el contador simulado de inscritos fue retirado.
- Las voces docentes conservan sus fuentes y contexto; no son testimonios de clientes de la plataforma.

Las licencias y procedencia de tipografías y recursos se conservan junto a sus archivos.
