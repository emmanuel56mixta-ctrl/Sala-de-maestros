# Sala de Maestros

**Un espacio propio para encontrarse, aprender y prepararse.**

Plataforma de cursos de NEMC, con portada interactiva, catálogo, páginas de curso y asesor de estudio para subdirección de secundaria. Incluye ruta de estudio, reactivos explicados, talleres de análisis, simulador y seguimiento del avance.

[Sitio actual](https://ascenso-docente-laboratorio.mandrakker.chatgpt.site) · Su acceso conserva la configuración privada actual.

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
pnpm build
pnpm start
```

`pnpm start` permite revisar localmente el Worker compilado; no publica la aplicación.

## Organización

| Ruta o carpeta | Contenido |
| --- | --- |
| `/` | Portada de Sala de Maestros |
| `/cursos` | Catálogo de cursos |
| `/cursos/[slug]` | Presentación y secuencia de cada curso |
| `/asesor` | Espacio de estudio con acceso restringido |
| `app/api/progress` | Lectura y guardado del avance |
| `lib/` | Contenidos y lógica de aprendizaje |
| `drizzle/` | Migraciones de Cloudflare D1 |
| `public/` | Imágenes, tipografías y documentos públicos |
| `PROJECT.md` | Decisiones y registro técnico del proyecto |

## Hosting y servicios

Esta es una aplicación **React/Vinext con servidor Cloudflare Workers y base de datos D1**. GitHub aloja el código; **no es una exportación estática para GitHub Pages**.

El hosting actual proporciona la autenticación. Para desplegar fuera de ese entorno hay que integrar autenticación confiable, configurar el binding `DB`, aplicar las migraciones de `drizzle/` y definir `COURSE_OWNER_EMAIL` como variable privada del servidor. No se deben aceptar como prueba de identidad cabeceras enviadas directamente por el cliente.

La configuración `.openai/hosting.json` es necesaria para la compilación actual y conserva la referencia al sitio existente. Las credenciales, sesiones y registros de docentes no se incluyen en este repositorio.

## Estado de la plataforma

- El curso de subdirección de secundaria está implementado; las demás ofertas del catálogo están identificadas como próximas.
- La integración de pagos está pendiente; los controles actuales no simulan cobros ni compras exitosas.
- El contador animado de la portada está identificado como cifra simulada y no equivale a inscripciones verificadas.
- Las voces docentes conservan sus fuentes y contexto; no son testimonios de clientes de la plataforma.

Las licencias y procedencia de tipografías y recursos se conservan junto a sus archivos.
