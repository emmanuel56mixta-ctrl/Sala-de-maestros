import { ArrowRight, BookOpen, Clock3, Compass, Lightbulb } from 'lucide-react';
import { recommendStart } from '@/lib/course-orientation';
import './course-start.css';

/* Three direct entries replace the former two-question wizard: the answers to
   "activity" and "time" led to the same destinations, so the choice is now one click. */
export default function CourseStart({ slug, hasAccess }: { slug: string; hasAccess: boolean }) {
  const preview = `/cursos/${slug}/leccion-gratuita/`;
  const practice = recommendStart('aplicar', 'breve', slug, hasAccess);
  const read = recommendStart('comprender', 'completa', slug, hasAccess);
  const entries = [
    {
      icon: Lightbulb,
      title: hasAccess ? 'Practicar con una pregunta' : 'Responder una pregunta',
      text: 'Elige una respuesta y revisa por qué es correcta o incorrecta.',
      time: 'Unos 5 minutos',
      href: practice.href,
      recommended: true,
    },
    {
      icon: BookOpen,
      title: hasAccess ? 'Leer la primera lección' : 'Leer la lección gratuita',
      text: 'Equidad, inclusión y no discriminación en una decisión escolar.',
      time: 'Unos 15 minutos',
      // Reading is the lesson's default stage, so the plain lesson URL is enough.
      href: hasAccess ? read.href : preview,
      recommended: false,
    },
    {
      icon: Compass,
      title: 'Ver el temario',
      text: 'Seis bloques y 18 lecciones, con su tiempo estimado.',
      time: 'Consulta rápida',
      href: '#hub-route-title',
      recommended: false,
    },
  ];

  return <section className="course-start" aria-labelledby="course-start-title">
    <div className="course-start-content">
      <p className="eyebrow">PARA EMPEZAR</p>
      <h2 id="course-start-title">¿Por dónde quieres empezar?</h2>
      <p className="course-start-intro">{hasAccess ? 'Elige una actividad de tu curso.' : 'La lección gratuita no requiere registro. Tus respuestas no se guardan.'}</p>
      <ul className="course-start-entries">
        {entries.map(entry => <li key={entry.title}>
          <a className={`course-start-entry${entry.recommended ? ' is-recommended' : ''}`} href={entry.href}>
            <entry.icon size={22} aria-hidden="true" />
            <span className="course-start-entry-copy">
              {entry.recommended && <span className="course-start-badge">Recomendado</span>}
              <strong>{entry.title}</strong>
              <small>{entry.text}</small>
              <span className="course-start-time"><Clock3 size={14} aria-hidden="true" />{entry.time}</span>
            </span>
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </li>)}
      </ul>
    </div>
  </section>;
}
