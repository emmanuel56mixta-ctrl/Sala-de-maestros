import { courseOfferings } from '@/lib/course-offerings';
import { courseSections, coursesForSection, type CourseSection } from '@/lib/course-sections';
import CatalogShell from './catalog-shell';
import CourseCards from './course-cards';
import LearningPhoto from './learning-photo';

export default function CatalogPage({ section }: { section?: CourseSection }) {
  const courses = section ? coursesForSection(section) : courseOfferings;
  const availableCount = courses.filter(course => course.available).length;
  const image = section?.image ?? {
    src: '/assets/learning/estudio-personal.webp',
    alt: 'Una docente lee y toma apuntes junto a su computadora, en un espacio de estudio con luz natural.',
  };

  return <CatalogShell backTo={section ? '/cursos/' : '/'} backLabel={section ? 'Todos los cursos' : 'Sala de Maestros'}>
    <section className="catalog-intro catalog-intro-with-photo">
      <div className="catalog-intro-copy">
        <p className="eyebrow">{section ? 'CURSOS' : 'APRENDE A TU RITMO'}</p>
        <h1>{section ? section.title : <>Tu siguiente paso<br />empieza aquí.</>}</h1>
        <p>{section?.description ?? 'Formación para tu práctica docente y tus metas profesionales. Conoce el enfoque y la ruta de cada curso.'}</p>
        <span>{courses.length} {courses.length === 1 ? 'propuesta' : 'propuestas'} · {availableCount} {availableCount === 1 ? 'curso disponible' : 'cursos disponibles'}</span>
      </div>
      <LearningPhoto className="catalog-learning-photo" src={image.src} alt={image.alt} />
    </section>
    <nav className="catalog-sections" aria-label="Categorías de cursos">
      {/* Native links also serve this catalog in the static Pages build. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/cursos/" aria-current={section ? undefined : 'page'}>Todos</a>
      {courseSections.map(item => <a key={item.slug} href={`/cursos/${item.slug}/`} aria-current={section?.slug === item.slug ? 'page' : undefined}>{item.title}</a>)}
    </nav>
    <CourseCards courses={courses} />
  </CatalogShell>;
}
