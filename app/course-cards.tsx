import { ArrowRight, BookOpen, Monitor, Sparkles } from 'lucide-react';
import { courseOfferings, coursePrice } from '@/lib/course-offerings';

export default function CourseCards() {
  return <div className="course-catalog platform-catalog">{courseOfferings.map((course, index) => {
    const Icon = index === 2 ? Monitor : index === 3 ? Sparkles : BookOpen;
    return <article className={`catalog-course cover-${course.accent || 'red'}`} key={course.id}>
      <a className="catalog-cover" href={`/cursos/${course.slug}`} aria-label={`Conocer ${course.title}`}><span>{course.category}</span><Icon size={42} strokeWidth={1.4} aria-hidden="true" /><strong>{course.edition}</strong></a>
      <div className="catalog-course-content"><p className="eyebrow">{course.available ? 'DISPONIBLE · A TU RITMO' : 'PRÓXIMAMENTE'}</p><h2><a href={`/cursos/${course.slug}`}>{course.title}</a></h2><p>{course.description}</p><div className="catalog-price"><strong>{coursePrice(course)}</strong><span>por curso</span></div><a className="landing-enter" href={`/cursos/${course.slug}`}>{course.available ? 'Entrar al curso' : 'Conocer la ruta'}<ArrowRight size={18} aria-hidden="true" /></a><small>{course.available ? 'Explora una lección gratuita.' : 'Consulta los temas de esta próxima propuesta.'}</small></div>
    </article>;
  })}</div>;
}
