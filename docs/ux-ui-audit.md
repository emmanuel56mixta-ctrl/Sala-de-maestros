# Auditoría UX/UI · Sala de Maestros

12 de noviembre de 2026. Revisión experta de la web pública, con cambios implementados en la rama `codex/recorrido-docente-guiado`.

## Diagnóstico

La identidad ya tiene una base coherente: petróleo, blanco cálido, tipografía reconocible y fotografías de aprendizaje. La principal debilidad era el recorrido: faltaba un acceso estable para regresar al curso, varios enlaces anunciaban actividades diferentes pero abrían la misma lección y la inscripción pendiente se aclaraba demasiado tarde. El movimiento y algunos títulos competían con la lectura.

Se revisaron portada, categorías, catálogo, ficha y lección gratuita. Es una evaluación heurística y técnica, no un estudio con usuarios ni una medición de conversión.

## Hallazgos y cambios

| Prioridad | Evidencia anterior | Cambio aplicado | Beneficio esperado |
|---|---|---|---|
| Alta | La portada no ofrecía entrada a la cuenta; Pages usaba una barra distinta en páginas interiores. | Navegación y pie compartidos con Cursos y Entrar a mi curso. Este último usa el inicio de sesión existente con retorno al asesor. | Un camino reconocible para quien vuelve. |
| Alta | Las cuatro acciones del curso abrían la misma muestra pública aunque anunciaran práctica o simulador. | Para visitantes son una lista informativa de lo incluido; los enlaces privados permanecen para quienes tienen acceso. | La acción coincide con lo que promete. |
| Alta | El precio y las llamadas de entrada podían sugerir una inscripción disponible. | Aviso explícito de inscripción y pago pendientes antes del botón; CTA Probar lección gratuita y etiquetas de disponibilidad. | Entender el alcance antes de continuar. |
| Media | El contador de inscritos aumentaba automáticamente sobre una cifra simulada. | Se retiró de la portada y se sustituyó por acceso a un caso real de la muestra. | Sustentar la presentación en contenido comprobable. |
| Media | El método requería un recorrido de casi tres pantallas; Leer/Vigilar/Dirigir/Hacer resultaba abstracto. | Pestañas manuales Lee/Responde/Revisa/Repasa, con ejemplo concreto y manejo por teclado. | Comprender el método sin pelear con el desplazamiento. |
| Media | Títulos comprimidos, jerarquías variables y fotografía de bienvenida a todo el ancho. | Títulos de contenido en peso 700, lectura principal de 16 px, espaciado común y bienvenida en dos columnas con prueba gratuita. | Facilitar lectura y exploración. |
| Media | Los títulos de contenido aparecían palabra a palabra y podían estar incompletos al llegar a la sección. | Bienvenida, método y comunidad muestran los títulos de inmediato. | Evitar esperas para leer. |
| Media | Entrar al curso abría una ficha; las propuestas próximas tenían acciones poco específicas. | Ver curso y Ver temario previsto, con explicación de la disponibilidad. | Anticipar correctamente el destino. |

Se conservaron los retratos de las dos entradas y su continuidad lateral, el breve scroll inicial, las fotografías con aviso de IA, los precios, las fuentes de las voces docentes y el análisis animado del primer caso. No se alteraron claves, bancos privados, permisos ni persistencia.

## Cómo se utilizó getdesign.md

[getdesign.md](https://getdesign.md/) ofrece documentos que describen reglas de diseño de productos. Se tomó ese enfoque para crear un `DESIGN.md` propio y reutilizable. Del [análisis independiente de Mintlify](https://getdesign.md/mintlify/design-md) se adoptaron principios de jerarquía de lectura, ritmo de espacio y estados visibles. No se adoptó su identidad de marca.

Las decisiones de navegación, contraste y tamaño de interacción se contrastaron con las explicaciones del W3C sobre [navegación consistente](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html), [contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) y [tamaño mínimo de objetivos](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). Los 44–48 px son un objetivo del producto; no se presentan como el umbral exacto del criterio AA.

## Verificación

- Navegador: bienvenida en escritorio, pestañas con clic/flechas/Home/End, un solo panel activo, foco visible y sin desplazamiento al cambiar con teclado. Ambos accesos a la muestra abren la etapa anunciada: lectura o pregunta.
- Móvil: portada y método a 320 px; ficha del curso a 390 px. Sin desbordamiento horizontal en esas pantallas. Pestañas de 52 px de alto; encabezado y acceso de cuenta utilizables. En la ficha, el aviso de inscripción precede al botón.
- Se unificaron los enlaces a directorios estáticos con barra final, incluido Volver al curso y las entradas a la lección. Evita que la vista previa reciba la portada como fallback y produzca un aviso de hidratación al montar otra pantalla.
- Las pruebas SSR y de HTML generado comprueban los destinos de login en Worker y Pages, la separación entre actividades públicas y privadas, ausencia del contador simulado, categorías y disponibilidad. Se conservan las regresiones de orientación y continuidad de retratos.
- TypeScript, ESLint de archivos modificados y compilaciones Worker/Pages forman parte del cierre.

Contraste calculado sobre los tokens, sin transparencias:

| Combinación | Relación |
|---|---:|
| Texto principal / fondo cálido | 11.66:1 |
| Texto secundario / fondo cálido | 5.64:1 |
| Texto secundario / blanco | 6.10:1 |
| Blanco / petróleo | 8.22:1 |
| Petróleo oscuro / selección suave | 9.89:1 |
| Texto principal / arena suave | 10.62:1 |

Estos valores no auditan todos los estados ni los textos sobre imágenes. Movimiento reducido y ausencia de JavaScript se revisaron en código/SSR; no se cambió la preferencia del sistema. No se completó un inicio de sesión real ni un ciclo autenticado de guardado en D1 en esta revisión. No se afirma cumplimiento integral de WCAG, velocidad de carga en dispositivos reales ni incremento de ventas.

## Próxima validación recomendada

Hacer sesiones breves con docentes de distintas edades y familiaridad digital: encontrar un curso, identificar si está disponible, abrir la muestra, explicar una respuesta y localizar el acceso de cuenta. Observar errores y dudas antes de añadir más secciones. Cuando se defina la inscripción comercial, diseñar su recorrido completo con precio, condiciones, confirmación y recuperación de errores; el diseño actual no habilita cobros.

El registro técnico de cambios está en `PROJECT.md` y las reglas que deben conservar futuras revisiones están en `DESIGN.md`.

## Segunda revisión (12 de noviembre de 2026)

Una segunda auditoría detectó problemas que esta revisión no cubría: la portada no mostraba la propuesta de valor ni la acción principal en el primer cuadro, la lección gratuita terminaba sin siguiente paso tras una respuesta incorrecta, los retratos del hero pesaban 3,2 MB y el CSS no cumplía las reglas de `DESIGN.md` (texto de 8 a 11 px, decenas de colores y radios fuera de escala). Los cambios aplicados y su verificación están en `PROJECT.md`; `DESIGN.md` pasa al formato de tokens de getdesign.md.
