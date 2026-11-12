import { ArrowDown } from 'lucide-react';
import type { CourseSection } from '@/lib/course-sections';
import './course-section-hero.css';

type CourseSectionHeroProps = {
  section: CourseSection;
  courseCount: number;
  availableCount: number;
};

export default function CourseSectionHero({ section, courseCount, availableCount }: CourseSectionHeroProps) {
  const headingId = `course-section-${section.slug}-title`;
  const { portrait } = section;

  return <section className="course-section-hero" data-portrait-side={portrait.side} aria-labelledby={headingId}>
    <div className="course-section-portrait" aria-hidden="true">
      {/* A native image shares the same transparent asset and transition name in both hosts. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="course-section-portrait-image"
        data-course-portrait={portrait.transitionName}
        style={{ viewTransitionName: portrait.transitionName }}
        src={portrait.src}
        width={portrait.width}
        height={portrait.height}
        alt=""
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
    </div>
    <div className="course-section-context">
      <p className="course-section-kicker">CURSOS</p>
      <h1 id={headingId}>{section.title}</h1>
      <p className="course-section-description">{section.description}</p>
      <dl className="course-section-counts">
        <div><dt>{courseCount === 1 ? 'Propuesta' : 'Propuestas'}</dt><dd>{courseCount}</dd></div>
        <div><dt>{availableCount === 1 ? 'Disponible' : 'Disponibles'}</dt><dd>{availableCount}</dd></div>
      </dl>
      <a className="course-section-enter" href="#section-courses">
        {availableCount > 0 ? 'Ver cursos' : 'Ver propuestas'}<ArrowDown size={18} aria-hidden="true"/>
      </a>
    </div>
  </section>;
}
