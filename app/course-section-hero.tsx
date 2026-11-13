import { ArrowDown } from 'lucide-react';
import type { CourseSection } from '@/lib/course-sections';
import './course-section-hero.css';

type CourseSectionHeroProps = {
  section: CourseSection;
  availableCount: number;
};

export default function CourseSectionHero({ section, availableCount }: CourseSectionHeroProps) {
  const headingId = `course-section-${section.slug}-title`;
  const { portrait } = section;

  return <section className="course-section-hero" data-portrait-side={portrait.side} aria-labelledby={headingId}>
    <div className="course-section-portrait" aria-hidden="true">
      {/* A native image shares the same transparent asset and transition name in both hosts. */}
      <picture>
      {/* WebP keeps the same transparent portrait at a fraction of the PNG weight; the PNG remains the fallback. */}
      <source type="image/webp" srcSet={`${portrait.src.replace(/\.png$/, '-480.webp')} 480w, ${portrait.src.replace(/\.png$/, '.webp')} ${portrait.width}w`} sizes="(max-width: 767px) 240px, 390px"/>
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
      </picture>
    </div>
    <div className="course-section-context">
      <p className="course-section-kicker">CURSOS</p>
      <h1 id={headingId}>{section.title}</h1>
      <p className="course-section-description">{section.description}</p>
      <a className="course-section-enter" href="#section-courses">
        {availableCount > 0 ? 'Ver cursos' : 'Ver propuestas'}<ArrowDown size={18} aria-hidden="true"/>
      </a>
    </div>
  </section>;
}
