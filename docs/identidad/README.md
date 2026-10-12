# Asesor para examen de USICAM 2026 · NEMC

Identidad aplicada al recorrido de supervisión de secundaria. Nombre comercial escrito exactamente como lo indicó el propietario. Las referencias oficiales conservan la sigla USICAMM. Proveedor visible: NEMC, sin expansión del nombre.

## Sistema visual

Azul tinta #162B48 para estructura y lectura; cobalto #2855D9 para acciones; amarillo #FFC851 para pequeños marcadores; fondos blancos y #F5F7FB. Ilustración editorial de papel y arquitectura escolar, sin escudos oficiales. El logo combina libro abierto y caminos ascendentes. El nombre se compone como texto HTML accesible junto al símbolo.

Botones primarios de 46 px o más, foco visible, estados deshabilitado, carga y respuesta. Los textos de los botones y banners son HTML; ninguna acción depende de leer texto dentro de una imagen. Ilustraciones decorativas con alt vacío. Las preguntas no incorporan ilustraciones que sugieran la respuesta.

## 30 imágenes originales

| Archivos | Cantidad | Uso |
|---|---:|---|
| 01-logo.png | 1 | Marca y favicon |
| 02–06-banner-*.png | 5 | Inicio, ruta, práctica, simulación y avance |
| 07–12-cover-*.png | 6 | Portadas de las seis unidades y recomendaciones del inicio |
| 13–18-icon-*.png | 6 | Identificación de temas en práctica |
| 19–24-concept-*.png | 6 | Ilustraciones de las lecturas |
| 25–30-state-*.png | 6 | Rutina de estudio, historial vacío, sesión completada, resultados, repaso y fuentes |
| **Total** | **30** | **Integradas en la interfaz** |

Todos los originales se generaron por separado con la herramienta integrada image_gen. Los tres manifiestos adyacentes documentan los prompts exactos y la procedencia. PNG originales en public/assets/nemc; rutas de uso en lib/visual-assets.ts. No se publican versiones con pagos ni se anuncian planes comerciales.

## Alcance funcional

La cuenta nueva inicia en supervisión. Al recuperar una cuenta existente se enfoca la siguiente sesión en supervisión, sin borrar historial ni recalificar preguntas. Una sesión de otro cargo ya iniciada se conserva y se explica cómo retomarla. El historial muestra todas las sesiones con su cargo; los indicadores temáticos se calculan solo para supervisión y el banco vigente.

Se mantiene la autenticación, el almacenamiento por cuenta, la revisión con fuentes y la separación entre práctica y simulación. El contenido actual de supervisión suma 24 preguntas (18 aprendizaje + 6 simulación) y seis lecturas; la renovación visual no equivale a cobertura completa ni a validación psicométrica.

## Verificación

Compilación de producción y TypeScript. Pruebas de selección por cargo, reservas de simulación, puntuación, omisiones, primeros intentos y preservación de resultados anteriores. Se verificaron 30 archivos distintos y las 30 rutas. Revisión en navegador del inicio, ruta y apertura de lectura; las imágenes visibles cargaron y no hubo desbordamiento horizontal a 1348 px. La vista previa interna no dispone de identidad del propietario, por lo que no se declara una nueva prueba autenticada de guardado de principio a fin.
