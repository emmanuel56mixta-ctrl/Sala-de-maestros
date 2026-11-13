import { ArrowRight, ArrowUpRight, Quote } from 'lucide-react';
import { teacherVoices } from '@/lib/community';
import LearningPhoto from './learning-photo';

export default function TeacherCommunity() {
  return <>
    <section className="enrollment-section enrollment-with-photo" aria-labelledby="community-heading">
      <div className="community-intro"><p className="eyebrow">ESTUDIO DE UN CASO</p><h2 id="community-heading">Prueba cómo se explica una respuesta.</h2><p>En la lección de subdirección de secundaria puedes elegir una opción y ver qué frases del caso ayudan a justificarla.</p></div>
      <LearningPhoto
        className="community-learning-photo"
        src="/assets/learning/colaboracion-docentes-jovenes.webp"
        alt="Dos docentes jóvenes trabajan juntos con una computadora y un cuaderno durante un taller."
      />
      <div className="community-preview-action">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="welcome-primary" href="/cursos/subdireccion-secundaria/leccion-gratuita/?paso=aplica">Analizar una pregunta<ArrowRight size={18} aria-hidden="true" /></a>
      </div>
    </section>
    {/* Static cards: quotes are read, not chased. No auto-scrolling band. */}
    <section className="teacher-voices teacher-voices-static" aria-labelledby="voices-heading">
      <div className="voices-heading"><div><p className="eyebrow">VOCES DE LA DOCENCIA</p><h2 id="voices-heading">Aprender empieza con una inquietud.</h2><p>Comentarios públicos sobre formación docente. Cada voz conserva su contexto y su fuente; no son reseñas de Sala de Maestros.</p></div></div>
      <ul className="voices-grid">{teacherVoices.map(voice=><li key={voice.id} className="voice-card"><div className="voice-top"><span>{voice.topic}</span><Quote size={23} aria-hidden="true"/></div><blockquote><p>“{voice.quote}”</p></blockquote><div className="voice-attribution"><strong>{voice.author}</strong><span>{voice.context}</span></div><a className="voice-source" href={voice.source} target="_blank" rel="noreferrer">{voice.sourceLabel}<ArrowUpRight size={15} aria-hidden="true"/><span className="sr-only"> (abre en otra pestaña)</span></a></li>)}</ul>
      <p className="voices-credit">Entrevistas: Sánchez-Anguiano, De la Torre-Díaz y Cordero-Arroyo, <em>Trayectorias de desarrollo profesional de docentes de primaria</em>, RMIE 29(102), 2024.</p>
    </section>
  </>;
}
