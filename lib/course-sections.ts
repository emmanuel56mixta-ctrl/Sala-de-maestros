import { COURSE_ID } from './catalog';
import { courseOfferings, type CourseOffering } from './course-offerings';

export type CourseSectionSlug = 'promocion-docente' | 'herramientas-digitales';

export type CourseSection = {
  slug: CourseSectionSlug;
  title: string;
  description: string;
  memberIds: readonly string[];
  image: { src: string; alt: string };
};

export const promotionSection: CourseSection = {
  slug: 'promocion-docente',
  title: 'Promoción docente',
  description: 'Cursos para preparar la promoción vertical y estudiar situaciones propias de la función directiva en primaria y secundaria.',
  memberIds: [COURSE_ID, 'promocion-primaria'],
  image: {
    src: '/assets/learning/estudio-docente-joven.webp',
    alt: 'Un docente estudia con su computadora y toma apuntes sobre la mesa.',
  },
};

export const digitalSection: CourseSection = {
  slug: 'herramientas-digitales',
  title: 'Herramientas digitales e IA',
  description: 'Próximos cursos sobre herramientas digitales e inteligencia artificial para el trabajo docente. Puedes consultar los temas de cada propuesta.',
  memberIds: ['habilidades-digitales', 'ia-docente'],
  image: {
    src: '/assets/learning/colaboracion-docentes-jovenes.webp',
    alt: 'Dos docentes revisan juntos una computadora portátil y conversan sobre sus materiales de trabajo.',
  },
};

export const courseSections: readonly CourseSection[] = [promotionSection, digitalSection];

export function coursesForSection(section: CourseSection, offerings: readonly CourseOffering[] = courseOfferings) {
  return offerings.filter(course => section.memberIds.includes(course.id));
}
