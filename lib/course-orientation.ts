/** Public orientation only: no enrollment, scoring or learning-state mutations. */
export type StudyGoal = 'comprender' | 'aplicar' | 'organizar';
export type StudyTime = 'breve' | 'completa';

export const studyGoals: { value: StudyGoal; title: string; description: string }[] = [
  { value: 'comprender', title: 'Leer una lección', description: 'Una explicación sobre equidad e inclusión en la escuela.' },
  { value: 'aplicar', title: 'Responder una pregunta', description: 'Elige una respuesta y revisa su explicación.' },
  { value: 'organizar', title: 'Ver el temario', description: 'Consulta los seis bloques y sus lecciones.' },
];

export const studyTimes: { value: StudyTime; title: string; description: string }[] = [
  { value: 'breve', title: 'Tengo unos 5 minutos', description: 'Quiero empezar con algo corto.' },
  { value: 'completa', title: 'Tengo unos 20 minutos', description: 'Puedo dedicarle más tiempo.' },
];

export function recommendStart(goal: StudyGoal, time: StudyTime, slug: string, hasAccess: boolean) {
  const brief = time === 'breve';
  const preview = `/cursos/${slug}/leccion-gratuita`;
  if (goal === 'organizar') return {
    title: 'Estos son los temas del curso',
    reason: 'El temario reúne 18 lecciones en seis bloques. Cada lección indica de qué trata y su tiempo estimado.',
    steps: brief
      ? ['Revisa los temas de cada bloque.', 'Busca la lección que te interese.']
      : ['Revisa los temas de cada bloque.', 'Elige una lección.', 'Empieza a leer; la primera es gratuita.'],
    href: '#hub-route-title', label: 'Ver el temario',
    note: 'Puedes abrir cada bloque para consultar sus lecciones.',
  };
  if (goal === 'aplicar') return {
    title: hasAccess ? 'Empieza con una pregunta' : 'Prueba una pregunta de la primera lección',
    reason: 'Después de responder verás si acertaste y por qué. Si tienes dudas, puedes consultar la lectura.',
    steps: hasAccess
      ? brief
        ? ['Responde la primera pregunta.', 'Lee la explicación. Puedes continuar con la otra pregunta después.']
        : ['Responde la primera pregunta.', 'Lee por qué cada opción es correcta o incorrecta.', 'Responde la segunda pregunta.']
      : brief
        ? ['Elige una respuesta.', 'Comprueba si es correcta y lee la explicación.']
        : ['Elige una respuesta.', 'Comprueba si es correcta y lee la explicación.', 'Vuelve a la lectura y consulta el documento citado.'],
    href: hasAccess ? '/asesor?seccion=inicio' : `${preview}?paso=aplica`,
    label: hasAccess ? 'Entrar a practicar' : 'Responder la pregunta',
    note: hasAccess ? 'Si dejaste una sesión pendiente, puedes retomarla.' : 'La pregunta es gratuita y no necesitas registrarte.',
  };
  return {
    title: brief ? 'Lee la explicación de la primera lección' : 'Lee la lección y contesta la pregunta',
    reason: 'La primera lección trata sobre equidad, inclusión y no discriminación en la escuela.',
    steps: brief
      ? ['Lee la explicación y la comparación de conceptos.', 'Puedes dejar la pregunta para otro momento.']
      : ['Lee la explicación y el documento citado.', 'Revisa el ejemplo de una situación escolar.', 'Contesta la pregunta y comprueba tu respuesta.'],
    href: hasAccess ? '/asesor?seccion=ruta&leccion=d1' : `${preview}?paso=comprende`,
    label: hasAccess ? 'Leer la primera lección' : 'Leer la lección gratuita',
    note: 'La lectura del documento puede tomar más tiempo. No hay límite para esta actividad.',
  };
}
