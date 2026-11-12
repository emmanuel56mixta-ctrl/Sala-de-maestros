/** Public orientation only: no enrollment, scoring or learning-state mutations. */
export type StudyGoal = 'comprender' | 'aplicar' | 'organizar';
export type StudyTime = 'breve' | 'completa';

export const studyGoals: { value: StudyGoal; title: string; description: string; feedback: string }[] = [
  { value: 'comprender', title: 'Entender el criterio', description: 'Leer con una pregunta clara en mente.', feedback: 'Comenzaremos por distinguir qué criterio orienta una decisión.' },
  { value: 'aplicar', title: 'Resolver un caso', description: 'Poner a prueba cómo tomaría una decisión.', feedback: 'Podrás elegir una respuesta y contrastarla con su explicación.' },
  { value: 'organizar', title: 'Organizar mi estudio', description: 'Conocer la ruta y elegir por dónde empezar.', feedback: 'La ruta te ayudará a ubicar los bloques y sus lecciones.' },
];

export const studyTimes: { value: StudyTime; title: string; description: string }[] = [
  { value: 'breve', title: 'Un momento breve', description: 'Unos 5 minutos para una acción concreta.' },
  { value: 'completa', title: 'Una sesión con calma', description: 'Unos 20 minutos para leer y practicar.' },
];

export function recommendStart(goal: StudyGoal, time: StudyTime, slug: string, hasAccess: boolean) {
  const brief = time === 'breve';
  const preview = `/cursos/${slug}/leccion-gratuita`;
  if (goal === 'organizar') return {
    title: 'Encuentra tu primer bloque',
    reason: 'Quieres organizar tu preparación. Empieza por una decisión pequeña: qué tema vas a estudiar.',
    steps: brief
      ? ['Revisa los seis bloques de la ruta.', 'Elige una lección y reserva un momento para trabajarla.']
      : ['Revisa el propósito de los bloques.', 'Elige una lección.', 'Combina su lectura con la actividad que propone.'],
    href: '#hub-route-title', label: 'Elegir mi primer bloque',
    note: 'La ruta está debajo. Puedes explorarla sin completar ninguna actividad.',
  };
  if (goal === 'aplicar') return {
    title: brief ? 'Una decisión, una explicación' : 'Del caso al criterio',
    reason: 'Quieres practicar. Intenta una respuesta y usa la explicación para reconocer el dato decisivo.',
    steps: hasAccess
      ? brief
        ? ['Intenta el primer caso de tu recorrido guiado.', 'Revisa su explicación; puedes retomar el siguiente caso después.']
        : ['Intenta el primer caso sin consultar la explicación.', 'Reconoce el criterio al revisar tu respuesta.', 'Aplica lo aprendido en el segundo caso.']
      : brief
        ? ['Responde el caso de la lección gratuita.', 'Revisa por qué tu opción responde, o no, al encargo.']
        : ['Responde el caso por tu cuenta.', 'Contrasta tu decisión con la explicación.', 'Vuelve al criterio y consulta la fuente.'],
    href: hasAccess ? '/asesor?seccion=inicio' : `${preview}?paso=aplica`,
    label: hasAccess ? 'Abrir mi recorrido guiado' : 'Probar el caso gratuito',
    note: hasAccess ? 'Tu espacio de estudio conserva la prioridad de una sesión pendiente.' : 'Puedes volver a la lectura en cualquier momento. No necesitas registrarte.',
  };
  return {
    title: brief ? 'Empieza por una distinción' : 'Comprende, aplica y revisa',
    reason: 'Quieres comprender el fundamento. La primera lección conecta una idea con una decisión escolar.',
    steps: brief
      ? ['Lee el criterio y compara las dos ideas.', 'Deja el caso para cuando tengas más tiempo.']
      : ['Lee el criterio y consulta su fuente.', 'Observa cómo se aplica en el ejemplo.', 'Resuelve el caso y revisa tu respuesta.'],
    href: hasAccess ? '/asesor?seccion=ruta&leccion=d1' : `${preview}?paso=comprende`,
    label: hasAccess ? 'Estudiar la primera lección' : 'Leer la lección gratuita',
    note: 'El tiempo es orientativo: tú decides cuánto dedicar a la lectura y a la fuente.',
  };
}
