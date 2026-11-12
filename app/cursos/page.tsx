import type { Metadata } from 'next';
import CatalogShell from '../catalog-shell';
import CourseCards from '../course-cards';
import LearningPhoto from '../learning-photo';
export const metadata: Metadata = { title: 'Cursos · Sala de Maestros', description: 'Rutas de aprendizaje para la práctica docente, el desarrollo profesional y la preparación para promoción.' };
export default function CoursesPage() {
  return <CatalogShell>
    <section className="catalog-intro catalog-intro-with-photo">
      <div className="catalog-intro-copy">
        <p className="eyebrow">APRENDE A TU RITMO</p>
        <h1>Tu siguiente paso<br />empieza aquí.</h1>
        <p>Formación para tu práctica docente y tus metas profesionales. Conoce el enfoque y la ruta de cada curso.</p>
        <span>4 propuestas · 1 curso disponible</span>
      </div>
      <LearningPhoto className="catalog-learning-photo" src="/assets/learning/estudio-personal.webp" alt="Una docente lee y toma apuntes junto a su computadora, en un espacio de estudio con luz natural." />
    </section>
    <CourseCards/>
  </CatalogShell>;
}
