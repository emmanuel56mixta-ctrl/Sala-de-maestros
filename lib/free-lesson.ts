import { firstCase, type CaseParagraph } from './case-analysis';

/** Public lesson copy. The duration is an editorial estimate, not a measured outcome. */
export const freeLessonContent = {
  title: 'Reconocer la barrera, conservar el aprendizaje',
  objective: 'Identificar una barrera y elegir un ajuste que conserve el aprendizaje y la evidencia que necesitas evaluar.',
  durationLabel: '15–20 min de lectura y práctica',
  durationNote: 'Tiempo orientativo. Consultar las fuentes completas puede ampliar el recorrido.',
  readingBlocks: [
    {
      title: 'Qué necesitas observar',
      text: 'Empieza por el propósito: ¿qué debe demostrar la persona? Después distingue el aprendizaje del formato usado para mostrarlo. Interpretar datos, escribir un argumento y leer en voz alta requieren evidencias diferentes. Un formato puede ser parte del aprendizaje o solo una condición de la actividad.',
    },
    {
      title: 'Dónde está la barrera',
      text: 'Busca un dato concreto: qué no puede hacer la persona y qué condición se lo impide. Puede estar en el acceso al material, en la forma de responder o en el canal de entrega. No deduzcas falta de comprensión a partir de una dificultad de acceso.',
    },
    {
      title: 'Cómo elegir el ajuste',
      text: 'En los casos de esta lección, el encargo pide conservar el aprendizaje. Compara cada opción con dos preguntas: ¿atiende la barrera descrita?, ¿permite obtener la evidencia prevista? Después aplica los criterios de evaluación. Facilitar una respuesta permite comprobar el aprendizaje; no lo da por demostrado.',
    },
  ],
  example: {
    title: 'Acceder al texto para poder interpretarlo',
    situation: 'Una actividad pide inferir la intención de un personaje y justificarla con dos pistas de un cuento. Una alumna puede leer el material cuando la letra se amplía, pero la ficha de evaluación solo está disponible en letra pequeña.',
    observation: 'Está en acceder al texto. La actividad evalúa una inferencia apoyada en evidencias; todavía hay que comprobar esa interpretación.',
    action: 'Ofrecer el mismo cuento y las mismas preguntas con letra ampliada, y valorar la inferencia con los criterios previstos. Cambiar las preguntas por una copia del texto no comprobaría el mismo aprendizaje.',
  },
  takeaway: 'Identifica qué debe demostrar la persona, elimina la barrera y conserva la evidencia necesaria para evaluarlo.',
};

/** A new context: oral performance is now the learning evidence, not an optional format. */
export const transferCase = {
  id: 'd1-caso-02',
  title: 'La dificultad está en la entrega',
  paragraphs: [
    {
      id: 'proposito',
      text: 'En Lenguajes, la actividad pide leer un texto en voz alta ajustando las pausas, la entonación y el volumen a su sentido. La rúbrica valora esos tres aspectos de la lectura oral.',
    },
    {
      id: 'barrera',
      text: 'La consigna exige subir una grabación a la plataforma desde casa. Un alumno puede grabar el audio sin conexión, pero en su hogar no dispone de internet. La escuela puede recibir el archivo directamente cuando asista a clase.',
    },
    {
      id: 'encargo',
      text: 'La docente y la subdirección acuerdan una forma de recibir la actividad. ¿Qué acuerdo atiende la barrera y permite evaluar el aprendizaje previsto?',
    },
  ] satisfies CaseParagraph[],
  check: {
    prompt: '¿Qué acuerdo atiende la barrera y permite evaluar el aprendizaje previsto?',
    options: [
      'Recibir en la escuela el audio grabado sin conexión y valorar pausas, entonación y volumen con la misma rúbrica.',
      'Recibir el texto con las pausas y la entonación marcadas por escrito, y usarlo para valorar su lectura oral.',
      'Ampliar el plazo de entrega y conservar la subida a la plataforma desde casa con la misma rúbrica.',
    ],
    correct: 0,
    feedback: [
      'Cambias el canal de entrega y conservas la lectura oral que necesitas escuchar. La escuela puede recibir el archivo; después la docente debe valorar la grabación con los mismos criterios.',
      'Las marcas escritas pueden ayudar a preparar la lectura, pero no permiten escuchar cómo realiza las pausas, la entonación y el volumen. Aquí la actuación oral sí forma parte del aprendizaje evaluado.',
      'Dar más tiempo conserva la exigencia de usar una conexión que el alumno no tiene en casa. El caso ofrece otra vía de entrega que mantiene la grabación y los criterios de evaluación.',
    ],
  },
  takeaway: 'En el primer caso podía cambiar el medio de respuesta. En este, debes conservar la actuación oral y cambiar la entrega. El ajuste depende del propósito y de la barrera de cada situación.',
  source: firstCase.source,
};
