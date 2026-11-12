/** Public, editorially authored example. No private question bank or saved score. */
export type CaseParagraph = { id: string; text: string };
export type AnalysisStep = {
  id: string; paragraphId: string; quote: string; title: string; explanation: string;
};
export type CaseAnalysisPlan = {
  id: string; title: string; paragraphs: CaseParagraph[]; steps: AnalysisStep[];
  takeaway: string; source: { title: string; url: string; reference: string };
};

export const firstCase = {
  id: 'd1-caso-01',
  title: 'Una barrera al responder',
  paragraphs: [
    { id: 'proposito', text: 'En una secundaria, el propósito de una actividad es interpretar gráficas y explicar las conclusiones. La rúbrica valora esos aprendizajes, no la destreza del trazado.' },
    { id: 'evidencia', text: 'Una alumna explica oralmente las relaciones entre los datos de las gráficas. Sin embargo, el formato de respuesta exige trazarlas a mano y la dificultad motriz le impide terminar. Ya se amplió el tiempo, pero el trazado manual sigue impidiéndole completar la actividad.' },
    { id: 'encargo', text: 'La subdirección y la docente revisan los apoyos. ¿Qué acuerdo atiende la barrera descrita sin cambiar el aprendizaje que se evalúa?' },
  ] satisfies CaseParagraph[],
  check: {
    prompt: '¿Qué acuerdo atiende la barrera descrita sin cambiar el aprendizaje que se evalúa?',
    options: [
      'Mantener el trazado a mano, ampliar de nuevo el plazo y valorar la interpretación con la misma rúbrica.',
      'Usar gráficas ya trazadas, permitir una explicación oral y verificar la interpretación con la misma rúbrica.',
      'Cambiar la interpretación por reconocimiento de imágenes, simplificar la actividad y valorar su entrega.',
    ],
    correct: 1,
    feedback: [
      'El caso indica que ampliar el tiempo no resolvió la dificultad. A vuelve a modificar el plazo, pero conserva el trazado manual que sigue impidiendo completar la actividad.',
      'Esta opción cambia el medio de respuesta y conserva lo que se evalúa: interpretar gráficas. La explicación oral permite recoger esa evidencia con los mismos criterios.',
      'Reconocer imágenes cambia el aprendizaje que se evalúa. El caso ya ofrece evidencia de interpretación oral; no justifica sustituirla por una tarea más sencilla.',
    ],
  },
  source: {
    title: 'Ley General de Educación',
    url: 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LGE.pdf#page=24',
    reference: 'Arts. 61 y 62, fracción V, pp. 24–25 · última reforma del texto consultado: DOF 15-01-2026. La solución del caso es una aplicación didáctica, no una respuesta oficial de examen.',
  },
};

const requestStep: AnalysisStep = {
  id: 'encargo', paragraphId: 'encargo',
  quote: '¿Qué acuerdo atiende la barrera descrita sin cambiar el aprendizaje que se evalúa?',
  title: 'Primero, identifica lo que te piden',
  explanation: 'La pregunta exige cumplir dos condiciones a la vez: atender la barrera y conservar el aprendizaje evaluado. Una medida de apoyo que solo cumpla una de ellas no resuelve este caso.',
};
const purposeStep: AnalysisStep = {
  id: 'proposito', paragraphId: 'proposito', quote: 'interpretar gráficas y explicar las conclusiones',
  title: 'Separa el aprendizaje del formato',
  explanation: 'El propósito es interpretar y explicar. Trazar a mano es el medio exigido por esta actividad; aquí no se presenta como el aprendizaje a evaluar. No los confundas al comparar opciones.',
};
const evidenceStep: AnalysisStep = {
  id: 'evidencia', paragraphId: 'evidencia', quote: 'explica oralmente las relaciones entre los datos de las gráficas',
  title: 'Busca la evidencia que sí aporta el caso',
  explanation: 'La alumna ya comunica relaciones entre datos. Esto respalda explorar una respuesta oral. No permite afirmar que domina todo el contenido: todavía hay que valorar su interpretación con los criterios previstos.',
};
const barrierStep: AnalysisStep = {
  id: 'barrera', paragraphId: 'evidencia', quote: 'el formato de respuesta exige trazarlas a mano y la dificultad motriz le impide terminar',
  title: 'Localiza la condición que impide responder',
  explanation: 'La dificultad descrita está en producir el trazado a mano. El ajuste debe actuar sobre esa condición: el caso dice que dar más tiempo no la resolvió. No hay datos que justifiquen sustituir la interpretación por otro aprendizaje.',
};
const decisionStep: AnalysisStep = {
  id: 'decision', paragraphId: 'encargo', quote: 'sin cambiar el aprendizaje que se evalúa',
  title: 'Comprueba la opción con las dos condiciones',
  explanation: 'B permite responder sin trazar a mano y mantiene la interpretación como criterio. Además, pide verificarla con la misma rúbrica. El apoyo se valora por la barrera que atiende y la evidencia que permite obtener.',
};

/** Invalid/unanswered values must never reveal a plan through accidental coercion. */
export function analysisForAnswer(selected: number | null): CaseAnalysisPlan | null {
  if (selected === null || !Number.isInteger(selected) || selected < 0 || selected >= firstCase.check.options.length) return null;
  let steps: AnalysisStep[];
  if (selected === 0) {
    steps = [requestStep, {
      ...barrierStep,
      quote: 'Ya se amplió el tiempo, pero el trazado manual sigue impidiéndole completar la actividad',
      title: 'Tu opción deja esta barrera en su lugar',
      explanation: 'Elegiste ampliar de nuevo el plazo. Esta frase señala que ese apoyo ya se probó y la barrera continuó. Más tiempo puede ser pertinente en otra situación; aquí necesitas un cambio que permita responder sin el trazado manual.',
    }, evidenceStep, purposeStep, decisionStep];
  } else if (selected === 1) {
    steps = [requestStep, purposeStep, {
      ...evidenceStep,
      title: 'Este dato respalda tu elección',
      explanation: 'Elegiste una explicación oral. El caso señala que la alumna ya utiliza ese medio para comunicar relaciones entre datos. Tu opción aprovecha esa evidencia y propone comprobarla con la rúbrica, en lugar de dar el aprendizaje por demostrado.',
    }, barrierStep, decisionStep];
  } else {
    steps = [requestStep, {
      ...evidenceStep,
      title: 'Este dato pide revisar tu elección',
      explanation: 'Elegiste una actividad de reconocimiento más sencilla. Pero aquí ya hay evidencia de interpretación oral. La dificultad para terminar el formato no demuestra que deba cambiarse el contenido por otro de menor exigencia.',
    }, {
      ...purposeStep,
      title: 'Tu opción cambia lo que se iba a evaluar',
      explanation: 'Reconocer imágenes no equivale a interpretar gráficas y explicar conclusiones. C cambia la tarea y valora su entrega, pero se aparta del propósito que la pregunta pide conservar.',
    }, barrierStep, decisionStep];
  }
  return {
    id: `${firstCase.id}-${selected}`, title: 'Analicemos tu respuesta',
    paragraphs: firstCase.paragraphs, steps,
    takeaway: 'En este caso, B relaciona la barrera, el medio de respuesta y el aprendizaje. En otra situación tendrás que volver a comprobar esos datos: una respuesta oral no es una solución universal.',
    source: firstCase.source,
  };
}
