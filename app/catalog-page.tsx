import { courseOfferings } from '@/lib/course-offerings';
import { courseSections, coursesForSection, type CourseSection } from '@/lib/course-sections';
import CatalogShell from './catalog-shell';
import CourseCards from './course-cards';
import LearningPhoto from './learning-photo';
import CourseSectionHero from './course-section-hero';

export default function CatalogPage({ section }: { section?: CourseSection }) {
  const courses = section ? coursesForSection(section) : courseOfferings;
  const availableCount = courses.filter(course => course.available).length;
  const image = section?.image ?? {
    src: '/assets/learning/estudio-personal.webp',
    alt: 'Una docente lee y toma apuntes junto a su computadora, en un espacio de estudio con luz natural.',
  };

  return <CatalogShell backTo={section ? '/cursos/' : '/'} backLabel={section ? 'Todos los cursos' : 'Sala de Maestros'}>
    <div className={section ? 'course-section-arrival' : undefined}>
    {section ? <CourseSectionHero section={section} courseCount={courses.length} availableCount={availableCount} /> : <section className="catalog-intro catalog-intro-with-photo">
      <div className="catalog-intro-copy">
        <p className="eyebrow">APRENDE A TU RITMO</p>
        <h1>Tu siguiente paso<br />empieza aquí.</h1>
        <p>Formación para tu práctica docente y tus metas profesionales. Conoce el enfoque y la ruta de cada curso.</p>
        <span>{courses.length} {courses.length === 1 ? 'propuesta' : 'propuestas'} · {availableCount} {availableCount === 1 ? 'curso disponible' : 'cursos disponibles'}</span>
      </div>
      <LearningPhoto className="catalog-learning-photo" src={image.src} alt={image.alt} />
    </section>}
    <div id="section-courses" className={section ? 'section-catalog-content' : undefined}>
    <nav className="catalog-sections" aria-label="Categorías de cursos">
      {/* Native links also serve this catalog in the static Pages build. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/cursos/" aria-current={section ? undefined : 'page'}>Todos</a>
      {courseSections.map(item => <a key={item.slug} href={`/cursos/${item.slug}/`} aria-current={section?.slug === item.slug ? 'page' : undefined}>{item.title}</a>)}
    </nav>
    <CourseCards courses={courses} />
    {section && <section className="section-learning-context" aria-labelledby="section-learning-title">
      <LearningPhoto className="catalog-learning-photo" src={image.src} alt={image.alt} />
      <div><p className="eyebrow">SALA DE MAESTROS</p><h2 id="section-learning-title">Conoce el contenido antes de elegir.</h2><p>{section.slug === 'promocion-docente' ? 'Revisa los temas de cada curso. En subdirección de secundaria puedes empezar con una lección gratuita y analizar una primera pregunta.' : 'Consulta los temas de las propuestas de herramientas digitales e inteligencia artificial. Estos cursos están identificados como próximos.'}</p></div>
    </section>}
    </div>
    </div>
  </CatalogShell>;
}
