import { ArrowRight, BookOpen, Monitor, Sparkles } from 'lucide-react';
import { COURSE_ID } from '@/lib/catalog';
import { courseOfferings, coursePrice, type CourseOffering } from '@/lib/course-offerings';

const courseIcons = {
  [COURSE_ID]: BookOpen,
  'promocion-primaria': BookOpen,
  'habilidades-digitales': Monitor,
  'ia-docente': Sparkles,
};

export default function CourseCards({ courses = courseOfferings }: { courses?: readonly CourseOffering[] }) {
  return <div className="course-catalog platform-catalog" data-course-count={courses.length}>{courses.map(course => {
    const Icon = courseIcons[course.id as keyof typeof courseIcons] ?? BookOpen;
    return <article className={`catalog-course cover-${course.accent || 'red'}${course.available ? ' is-available' : ' is-upcoming'}`} key={course.id}>
      <a className="catalog-cover" href={`/cursos/${course.slug}/`} aria-label={`Conocer ${course.title}`}><span>{course.category}</span><Icon size={42} strokeWidth={1.4} aria-hidden="true" /><strong>{course.edition}</strong></a>
      <div className="catalog-course-content"><p className={`eyebrow catalog-status ${course.available ? 'is-available' : 'is-upcoming'}`}>{course.available ? 'LECCIÓN GRATUITA DISPONIBLE' : 'PRÓXIMAMENTE'}</p><h2><a href={`/cursos/${course.slug}/`}>{course.title}</a></h2><p>{course.description}</p>{course.available ? <div className="catalog-price"><strong>{coursePrice(course)}</strong><span>por curso</span></div> : <div className="catalog-price catalog-price-upcoming"><span>Precio previsto: {coursePrice(course)}</span></div>}<a className={`landing-enter${course.available ? '' : ' landing-enter-secondary'}`} href={`/cursos/${course.slug}/`}>{course.available ? 'Ver curso' : 'Ver temario previsto'}<ArrowRight size={18} aria-hidden="true" /></a><small>{course.available ? 'Lección gratuita abierta. Inscripción aún no disponible.' : 'Consulta los temas de esta próxima propuesta.'}</small></div>
    </article>;
  })}</div>;
}
