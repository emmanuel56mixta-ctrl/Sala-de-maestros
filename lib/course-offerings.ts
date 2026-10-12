import { COURSE_ID } from './catalog';

export type CourseOffering = {
  id: string; slug: string; title: string; category: string; edition: string;
  description: string; price: number; currency: 'MXN'; previewLessonId: string;
  features: string[]; available: boolean; modules?: string[]; accent?: string;
};

export const courseOfferings: CourseOffering[] = [{
  id: COURSE_ID, slug: 'subdireccion-secundaria', title: 'Subdirección de secundaria',
  category: 'Promoción vertical', edition: 'USICAMM 2026',
  description: 'Comprende la lógica de las preguntas, compara alternativas y practica decisiones propias de la subdirección de secundaria.',
  price: 1600, currency: 'MXN', previewLessonId: 'd1', available: true,
  features: ['18 lecciones con ejemplos y actividades', '8 talleres para analizar preguntas', 'Práctica con explicaciones y pistas', 'Simulador de 90 reactivos', 'Ruta de estudio y seguimiento de avance'],
}, {
  id:'promocion-primaria', slug:'promocion-vertical-primaria', title:'Promoción vertical · Primaria', category:'Promoción vertical', edition:'EDUCACIÓN PRIMARIA',
  description:'Una ruta orientada a la función directiva y a las decisiones propias de la escuela primaria.', price:1600,currency:'MXN',previewLessonId:'',available:false,accent:'clay',
  features:['Función directiva en primaria','Análisis de situaciones escolares','Preparación y práctica'],modules:['Conoce la función directiva','Analiza la vida de la escuela','Acompaña la práctica docente','Prepárate con casos'],
}, {
  id:'habilidades-digitales',slug:'habilidades-digitales',title:'Habilidades digitales para docentes',category:'Tecnología educativa',edition:'TU PRÁCTICA DIGITAL',
  description:'Organiza tus materiales, trabaja con herramientas digitales y diseña actividades para tu grupo.',price:1600,currency:'MXN',previewLessonId:'',available:false,accent:'ink',
  features:['Organización de archivos y recursos','Herramientas para el aula','Actividades con estudiantes'],modules:['Organiza tu espacio digital','Crea y comparte materiales','Diseña una actividad','Cuida la información'],
}, {
  id:'ia-docente',slug:'inteligencia-artificial-docencia',title:'Inteligencia artificial en la docencia',category:'Tecnología educativa',edition:'IA CON SENTIDO PEDAGÓGICO',
  description:'Explora cómo incorporar la inteligencia artificial a tu trabajo con criterio pedagógico y revisión docente.',price:1600,currency:'MXN',previewLessonId:'',available:false,accent:'sand',
  features:['Instrucciones claras para la IA','Materiales y actividades','Revisión crítica de resultados'],modules:['Comprende qué puede aportar la IA','Formula instrucciones útiles','Diseña una actividad','Revisa y ajusta los resultados'],
}];

export function offeringBySlug(slug: string) { return courseOfferings.find(course => course.slug === slug); }
export function coursePrice(course: Pick<CourseOffering, 'price' | 'currency'>) { return `$${course.price.toLocaleString('es-MX')} ${course.currency}`; }
