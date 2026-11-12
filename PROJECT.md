# Sala de Maestros · NEMC

## Corrección de lenguaje (12 de noviembre de 2026)

El usuario señaló que las terminologías de la nueva entrada se sentían falsas. Los controles ahora nombran acciones reconocibles: leer una lección, responder una pregunta y ver el temario. Las etapas visibles son Lectura, Pregunta y Explicación; los identificadores internos y enlaces existentes no cambian. Se eliminaron confirmaciones de relleno y frases de acompañamiento o personalización que no aportaban información. El feedback dice respuesta correcta o incorrecta, seguido de la explicación: un acierto no se presenta como prueba de comprensión. En botones y encabezados se evitan «construir tu criterio», «dar sentido a tu respuesta», «tu propósito» y fórmulas similares. Los términos académicos permanecen donde el contenido los requiere, no como adornos de navegación.

## Orientación y lección guiada (12 de noviembre de 2026)

- Se adapta la entrada progresiva observada en Headway al aprendizaje docente: dos preguntas opcionales sobre propósito y tiempo, una recomendación con acciones concretas y acceso directo para quien no necesita orientación. La portada, el catálogo y las páginas individuales conservan sus funciones.
- `app/course-start.tsx` y `lib/course-orientation.ts` solo se muestran en el curso disponible. La propuesta breve pide menos acciones que la completa; los tiempos son orientativos. No se recaban datos de contacto ni se crean inscripciones, resultados o preferencias guardadas.
- La lección gratuita conserva todos sus textos, fuente, ejemplo, opciones, clave y feedback en tres etapas: Comprende, Aplica y Revisa. La barra permanece visible durante la lectura. Una respuesta incorrecta lleva a revisar el criterio; una correcta muestra un cierre pedagógico y permite conocer el acceso completo. El modal conserva el precio y la indicación de que el pago no está habilitado.
- Los parámetros públicos `paso=comprende|aplica` se leen después del montaje. Valores desconocidos conservan la etapa inicial. La selección permanece al moverse entre etapas, pero no sobrevive una recarga ni se incorpora al avance de la cuenta. No cambia la autenticación, el banco, la persistencia D1 ni el simulador.
- Identidad adoptada: Poppins y Aileron existentes; bermellón para acciones; fondos cálidos para orientación; verde y ámbar solo para feedback de aprendizaje. Controles nativos de selección, estados deshabilitados, foco al cambiar de etapa, acceso a la fuente y adaptación móvil.
- Validación: regresiones de aprendizaje, TypeScript, compilaciones Worker y Pages, pruebas de recomendaciones y reescritura real de enlaces. Revisión local en navegador del propósito/tiempo, entradas al caso, error → lectura → reintento, selección con flechas, acierto y modal. La revisión pública no establece un nuevo ciclo autenticado de guardado en D1.

## Contract and current scope

A functional autonomous teacher-learning platform for multiple courses, with subdirección de secundaria as the currently enabled course. The current identity follows the owner’s October ASESOR PEDAGÓGICO PDF: Poppins display type, Aileron body type, vermilion and light gray. Retain the 30 original visual asset files; the current interface uses the new typographic identity. Do not label learner-facing surfaces as a demo, prototype or pilot. The owner's pilot concerns application with teachers, not the product's learner copy.

Only **subdirección de secundaria** is enabled. `lib/catalog.ts` defines future combinations of subdirección, dirección, supervisión and jefatura de sector with preescolar, primaria and secundaria, all disabled except the current course. A role must never silently inherit another course's active content or pending session. Pricing and subscription decisions are deferred.

## Delivered learning experience

- A plain-language preparation home with one next action and in-place section explanations. No clickable logo, duplicated journey cards or separate help access. Profile catalog is available from settings.
- 18 lessons in six official subareas, linked source reading, worked examples and comprehension checks. A sticky route bar keeps completed-lesson progress and the current block visible, with direct block selection.
- 8 interactive workshops: select sentence functions, identify a criterion, compare alternatives and justify a choice; save/resume each step.
- 126 current questions: 36 study questions and a reserved 90-question simulator; all with explanations, sources and clues.
- 12-question diagnosis; six-question practice with spaced-review priority.
- Three-part question analysis button in practice and assisted simulation. Hint exposure persists immediately and remains recorded if the panel is closed.
- Four-hour simulation. Unassisted mode prevents backward navigation; assisted mode permits review. Explanation after completion. The same reserved form is disclosed on repeat attempts.
- Last-response independent accuracy by subarea, first-attempt summary, detailed results and historical sessions. Results are practice evidence, not official scores or predictions.
- Scheduled review at 1/3/7 days according to error, assistance and confidence. These are product rules, not claimed optimal scientific intervals.

## Content and evidence

See `docs/fundamento-subdireccion-2026.md` and `docs/matriz-reactivos-subdireccion.csv` for sources, editorial decisions and PDF traceability. The uploaded compendium has a numbered matrix, repetitions and incomplete alternatives; do not describe it as 90 complete official questions. The new questions are editorial practice materials. Current bank source: `lib/subdirection-questions.ts`, `lib/bank/*`, and `lib/bank-builder.ts`. Historical `lib/revised-questions.ts` and `lib/legacy-questions.ts` remain unchanged.

## Persistence and migration

Authenticated progress remains in D1, keyed by ChatGPT identity. Preserve origin checks, optimistic revision checks and idempotent mutation IDs in `app/api/progress/route.ts`. Payload validation is in `lib/progress-schema.ts`. No table migration is needed for added JSON fields.

`normalizeState` defaults new course fields and moves any unfinished old-bank session to `archivedSessions`, preserving every answer without fabricating completion or a new score. Previous completed sessions and lesson markers remain available but do not enter current-course metrics. GET remains read-only with respect to migration until the user's next accepted save.

The platform has no AI tutor, human support flow or payment integration. Notes belong to the user and do not automatically send messages. Optional WebMCP tools read progress and notes only.

## Verification

`node tests/learning.mjs` checks bank integrity, source availability, uniqueness, subarea coverage, reserved-form separation, key distribution, superficial length bias, state validation, role gating, timed session configuration, scoring, omissions, spaced review, and preservation of old answer keys and unfinished sessions.

TypeScript and production build are required. Browser QA verified desktop navigation, the full four-step workshop including a wrong classification and correction, state rehydration, a lesson comprehension check, persistent assistance marking after closing the tip, and the mobile layout at a 388px viewport without horizontal overflow. Browser QA uses the internal Sites preview only. `tests/component-harness.tsx` mounts components with fictional in-memory state and no API/authentication modifications. The temporary route used to view that fixture must be removed before production build. This component test does not establish an authenticated D1 round trip: the internal browser has no ChatGPT session. Do not bypass authentication or represent component-fixture saving as backend persistence verification.

## Deployment

Reuse this project and private owner-only audience. `.openai/hosting.json` is authoritative. Publish edits using the Sites skills, exact committed/pushed source, production build and validated archive. Use `/tmp` for the deployment archive because prior archives written to scratch were truncated after packaging. Preserve existing D1 data.

Before commercial access: user account/access and payment decisions remain with the owner. Editorial application with teachers must assess ambiguity, difficulty, discrimination and transfer; do not promise approval or a placement.

## Navigation feedback (September 2026)

The owner’s video requests a simple operational start, familiar section names and persistent orientation in the study route. Learner labels are “Cómo resolver preguntas” and “Practica con explicación”. Keep question content, simulator behavior and progress calculations unchanged for this navigation revision.


## Guided learning correction (October 2026)

- The home now offers a single start/resume action into a roughly ten-minute guided session. Four explicit stages reuse existing persistence: initial answer, reasoned feedback, second case without in-attempt hints, and feedback with a next lesson.
- `lib/guided.ts` defines six editorial pairs from the 36 study questions, one per subarea, and explicit question-to-lesson links. No reserved simulator question or answer key was changed. These are near-transfer checks, not evidence of mastery; prior exposure to a second case is disclosed.
- Optional `Session.guidedTopic` is validated in the shared Zod schema and preserved through save/resume and history. Existing records need no migration. No authentication, API concurrency protection, hosting configuration or D1 records were reset.
- Diagnostic and practice results show the chosen distractor's explanation and direct lesson actions. The home carries forward a concrete learning need. Primary navigation is start, route and progress; other existing tools remain in an expandable menu.
- Progress distinguishes lesson activity completion, use of hints and answers without hints in that attempt. It explicitly notes repeated cases and does not certify mastery.
- Verification: `node tests/learning.mjs` includes every guided pair, reserved-bank separation, all 36 lesson mappings, schema round-trip, resume after the first answer, second-stage index and early-ending omissions. `tsc --noEmit` passed. Browser QA and production build are handled in the publishing review; authenticated D1 round-trip is not established by unit tests.
- Remaining editorial limitation: some study answers are longer than their distractors. Banks are deliberately preserved in this usability correction; success should not be read as validated exam performance.


## October identity and landing revision

- `/` is a brief explanatory landing page with a clear “Entrar al asesor” link and three preparation steps. `/asesor` holds the existing learning application. Sign-in returns to `/asesor`; the advisor has an explicit return-to-cover link.
- The owner's reference provides Poppins (700/800/900) and Aileron (400/600/700). Its original vermilion/gray palette was superseded by the November palette revision below. Long study text remains dark Aileron with comfortable line height.
- Full font files and license/provenance notes are in `public/fonts/`. The educator cutout is extracted from the owner's supplied PDF with its original alpha mask, stored at `public/assets/identity/docentes.png`.
- Guided learning, course content, all answer keys, session persistence, authentication and D1 bindings are preserved. Typography and the owner's imagery remain part of the identity; semantic feedback colors remain distinct.
- Current validation: TypeScript and production build are required. Browser QA is unavailable in this session because the supported browser-control capability is absent; this revision is not claimed to have live responsive or authenticated browser verification.


## Sala de Maestros brand and course scope

The platform name is **Sala de Maestros**, with the exact tagline **Un espacio propio para encontrarse, aprender y prepararse.** NEMC remains the provider. The platform supports a broader teacher-development offering, not exclusively promotion exams. Do not invent or enable courses whose materials are not implemented.

The landing presents the general platform, an available-course section and the learning process. USICAMM 2026, promotion details and 18-lesson/90-question counts belong to the subdirección de secundaria course card. `/asesor` continues serving that course and preserves its identifiers and progress. The internal role/profile catalog remains specific to promotion and is not the platform-wide course catalog. New name appears in landing, advisor sidebar and browser metadata. Typography from the previous reference is retained; the current colors are documented in the November palette revision.


## Course catalog, exploration and price

- `/cursos` lists available offerings from `lib/course-offerings.ts`; currently one course at $1,600 MXN. All landing course links navigate there rather than to an anchor. Future independent courses belong in this offerings model, not the promotion-role catalog.
- `/cursos/subdireccion-secundaria` serves a real free lesson (`d1`) with its comprehension check, source reading, worked example and feedback. Only that lesson and outline metadata are serialized to the interactive explorer. Free exploration is local component state and does not record invented completion in paid progress.
- A modal explains full access, price and included material. Locked outline items and the continuation button open it. Checkout is not connected: no card collection, transaction simulation, local-storage entitlement or claim of a successful payment. The owner's authenticated access is retained through a server-side email allowlist in the secret `COURSE_OWNER_EMAIL`; public user-owned records still use the stable Site-scoped user ID. The account ID from Sites access policy must NOT be compared with the Site-scoped identity header.
- `/asesor` and both `/api/progress` methods check full access server-side; authenticated users outside the current owner allowlist do not receive or modify course progress. No D1 record or table was reset. No commercial customer is enrolled until a real payment integration and verified enrollment persistence are added. Site audience remains owner-private.
- Remaining commercial work: choose/connect the payment provider; verify payment webhooks, create per-course customer entitlements, provide lifecycle/refund handling and serve paid content under that authorization. Do not call the present modal a complete ecommerce system or a production content-protection boundary.
- The home steps are selectable cards with a single sliding red panel. Automatic movement runs only in view, pauses on hover/focus or manual input, and respects reduced-motion preferences. Previous/next and pause controls are keyboard-operable.
- Verification for this change includes the existing learning regression suite, TypeScript and production build. Browser-control capability remains unavailable; responsive rendering and authenticated access round trips are not asserted as browser-verified.

- Owner annotation correction: remove the entire top header band on the landing `/` and its NEMC footer wordmark. Preserve the Sala de Maestros hero, course CTA, moving cards and navigation within the course pages.


## Layered scroll hero

The owner's new reference puts large centered educators in front of an oversized orange title. The landing now uses `DepthHero` with **Sala de Maestros** behind the original transparent portrait. A short sticky scene follows natural page scroll: the foreground moves down and toward the viewer while the title shifts slightly backward/up, becoming entirely uncovered before the scene exits. The course CTA stays actionable throughout. No wheel/touch interception or scroll locking is used.

`requestAnimationFrame` batches passive scroll updates and `ResizeObserver` keeps progress tied to actual scene geometry. Mobile uses a shorter scroll span. Reduced motion and no JavaScript show a static, readable title above the image; course links remain ordinary anchors. The tagline and brief introduction follow the scene. The removed top band and NEMC footer logo remain absent. Validate TypeScript/build; supported browser QA is still unavailable.


## Course platform revision (current)

Supersedes the sticky hero described above: the educators remain visible, with only 10px vertical motion, 18px depth and a slight scale change. The title is sized and placed above their heads; the scene is unpinned and no longer animates the portrait out of the frame. Reduced motion retains a static layout.

The homepage and `/cursos` display four offerings: secondary promotion (available), primary promotion, digital skills, and AI in teaching (three upcoming). Upcoming offerings have their own route overviews, no enabled lessons or invented enrollment. All offerings show the established $1,600 MXN price.

`/cursos/[slug]` now presents a course hub with an explicit next step, study sequence, expandable modules and recommendations. The secondary hub links authorized users to actual sections and specific lessons through validated query parameters. Its free explorer moved to `/cursos/subdireccion-secundaria/leccion-gratuita`; existing preview checks and access modal are preserved. Content banks, progress persistence, access checks, payment limitations and private audience remain unchanged.

Validation: learning regression suite, TypeScript and production build. Supported browser control is unavailable in this session; responsive appearance is not claimed as visually verified.


## Portada and navigation correction (authoritative, 12 October 2026)

The owner requires three distinct pages: `/` introduces Sala de Maestros, `/cursos` contains the four course cards, and `/cursos/[slug]` opens the chosen course overview. Do not insert a course catalog into the home page. The home has one primary course link in the hero; welcome and footer do not repeat that CTA. The three-step interactive explanation remains.

The hero keeps the original educators IN FRONT of the large orange title. Text and image overlap at rest and with reduced motion; do not shrink the portrait into a separate block below the heading. Bounded scroll motion moves the foreground by 18px and 32px depth, and the title back/up by at most 56px. No fade, long pinning or portrait exit. The stylesheet is now a single coherent composition rather than accumulated overrides. The user's supplied screenshot exposed the repeated nearby course invitations and drove this correction.

Validation scope: TypeScript and production build. Supported browser control is absent; live visual verification is unavailable. Course content and progress were not changed.


## Perceptible depth correction (12 October 2026)

The preceding 18px/56px motion was overwhelmed by the full page scroll. A short sticky interval now holds the composition in view for 300px desktop or 190px mobile. Progress is measured from the actual section height minus scene height. Foreground travel is limited to 26px (18px mobile) with Z=64; the title moves up by 104px (72px mobile) with Z=-76 and shared perspective1100px. Both layers remain opaque and inside the scene; the portrait has slightly more headroom. After the interval the entire section scrolls away normally.

Reduced motion and viewports shorter than 600px retain a static layered image without pinning. CSS determines initial geometry, so enabling JavaScript does not change section height. No library or animation dependency was added. The separate portada/catalog/course navigation is unchanged. TypeScript and build are the verification gates; supported live browser QA remains unavailable.

## Institutional references and community section (12 October 2026)

The owner requested official logos, a 1,230 enrollment figure and scrolling comments. Home retains one course CTA and no course cards; course catalog and individual pages are unchanged.

- `InstitutionResources` shows SEP, Jalisco, Nuevo León (the owner's Monterrey reference), Puebla and Estado de México as links to official educational portals. Logos come from official sites, retain original appearance, and are labeled as references rather than institutional affiliation or endorsement. Source provenance lives beside the assets.
- `enrollmentCount` is 1230, supplied by the owner on 12 October 2026. It is an editorial number, not a database aggregate. There is no fabricated live counter, random increase or simulated registration feed.
- `TeacherCommunity` uses three short verifiable external statements about professional learning, with context and links. They are explicitly not testimonials or reviews of Sala de Maestros. No ratings, fake students or outcomes were invented. The source study authors are credited. Actual platform testimonials can replace these only when supplied or collected.
- The comments scroll horizontally, can be paused, pause on hover/touch, and present a static scrollable list for keyboard focus and reduced motion. Duplicate visual items are hidden from screen readers and removed from tab order; all visible source links remain functional.
- Validation: TypeScript and production build. Browser-control capability remains unavailable, so live visual behavior is not asserted as browser-verified.


## Scroll choreography (authoritative, 12 October 2026)

This owner-requested sequence supersedes the earlier small-depth and short-pin treatments. The hero occupies 300svh with a 100svh sticky stage, providing two screen-heights of pinned travel. Passive scroll and requestAnimationFrame drive bounded smoothstep curves: the headline exits upward, two informational cards (Comprender / Practicar) rise from below, and the original educators and glossy spheres shrink into position above the cards. Portraits stay opaque. The newly requested slim top bar becomes cream as progress increases. One primary course CTA remains; the catalog is still exclusively at `/cursos` and individual courses at `/cursos/[slug]`.

Large editorial headings reveal word by word, with intact accessible text. Cómo funciona uses four scroll-synchronized stages (Leer, Vigilar, Dirigir, Hacer), crossfaded descriptions and corresponding right-hand panels; keyboard controls allow direct selection. Institutional references move horizontally in a repeating strip and sourced teacher mentions move vertically. Both loops expose pause controls, pause on hover, and switch to natural scrolling for keyboard/touch reading. Reduced-motion preferences disable nonessential motion; small-height viewports retain static hero content. The hero also includes a no-JavaScript fallback.

Only the landing experience changed. Course content, real progress, access checks, price, sources and hosting audience are preserved. Verification consists of TypeScript and production build; the supported browser-control capability is unavailable, so responsive animation is not represented as visually browser-verified.


## Independent owner-supplied portraits (12 October 2026)

The hero now uses the two new owner-provided portraits, processed with the built-in image tool solely to remove their chroma-green backgrounds while preserving their identities, poses and clothing. Project assets are `public/assets/identity/docente-hombre.png` (1024×1536) and `docente-mujer.png` (941×1672), with real alpha transparency. The shared `docentes.png` is retained but no longer used in this hero. The former half-image clip paths and half-center math are replaced by two independent elements with native aspect ratios, each moving toward its corresponding informational card using the existing smoothstep timeline. Both portraits also remain visible in reduced-motion and no-JavaScript layouts. No course content, routes, progress or access policy changed.


## Latest portrait replacement (12 October 2026, 11:02 local)

The owner supplied a new seated man in a blue suit and woman in a white shirt, both with crossed arms. These now replace the prior hero characters using `public/assets/identity/docente-hombre-v2.png` (937×1678) and `docente-mujer-v2.png` (939×1674). Their gray studio backgrounds were removed with the built-in image editor; both PNGs have verified alpha transparency. Original poses, clothing and visible framing are retained. Native dimensions and CSS aspect ratios match the new files. Existing smoothstep motion, two card destinations, fallback and page navigation remain unchanged.


## Enrollment counter animation (12 October 2026, 12:03 local)

The owner requested removal of “Y subiendo” and automatic numerical increments every five seconds. `EnrollmentCounter` starts at the owner-supplied 1,230 and increments by one every 5,000 ms while visible and the tab is active. It is visibly labeled “Cifra simulada”; these increments do not represent enrollment events and are not persisted or sent to any backend. It resets to the starting value on remount. A pause/resume button controls updates, timers clean up on unmount, screen readers are not interrupted by each tick, and reduced motion removes the digit transition. This explicitly supersedes the earlier static-counter instruction, while retaining honest attribution of the displayed figure.

## November palette revision

- At the owner's request, petroleum blue replaces the vermilion brand palette. `app/globals.css` is the single source of shared color tokens for both Pages and Worker; the duplicate root palettes were removed.
- Actions and selected states use `#1D5661`, with `#153F48` for hover and dark links. The main canvas is warm white `#F7F6F1`, reading cards are white, text is `#24363A`, and secondary text is `#546569`. Sand is decorative; small text does not rely on sand contrast.
- The palette covers the home, course catalog, course start, free lesson and advisor styles. Poppins/Aileron, portrait assets, institutional logos, content, layout and scroll choreography are preserved. The first-party favicon and public browser theme color match the new palette.
- Correct answers remain green, retries amber and destructive errors red. Annotation categories retain their distinct colors and labels. Answer hover styling no longer replaces a selected or graded answer's border.
- Calculated contrast: white on the primary button 8.22:1; petroleum on the warm canvas 7.59:1; secondary text on the warm canvas 5.64:1. These are specific color-pair checks, not a claim of a full accessibility audit.
- Verification: TypeScript, learning/orientation regressions, Pages prerender checks, CSS parsing and both builds pass. Local browser review covers home, catalog, course selection and free-lesson correct/retry feedback; course and lesson remain within the 390 px mobile viewport. No new authenticated D1 round-trip was tested.
