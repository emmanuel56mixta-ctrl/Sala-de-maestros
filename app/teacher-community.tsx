'use client';

import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Pause, Play, Quote } from 'lucide-react';
import { teacherVoices } from '@/lib/community';
import LearningPhoto from './learning-photo';

export default function TeacherCommunity() {
  const [paused, setPaused] = useState(false);
  const [reading, setReading] = useState(false);
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
        <p>Ejercicio de práctica · Sin registro</p>
      </div>
    </section>
    <section className="teacher-voices" aria-labelledby="voices-heading">
      <div className="voices-heading"><div><p className="eyebrow">VOCES DE LA DOCENCIA</p><h2 id="voices-heading">Aprender empieza con una inquietud.</h2><p>Comentarios públicos sobre formación docente. Cada voz conserva su contexto y su fuente; no son reseñas de Sala de Maestros.</p></div><button className="voices-pause" type="button" onClick={()=>{setPaused(!paused);setReading(false);}} aria-pressed={paused} aria-label={paused?'Reanudar desplazamiento de comentarios':'Pausar desplazamiento de comentarios'}>{paused?<Play size={17} aria-hidden="true"/>:<Pause size={17} aria-hidden="true"/>}<span>{paused?'Reanudar':'Pausar'}</span></button></div>
      <div className="voices-window" data-paused={paused} data-reading={reading} tabIndex={0} role="region" aria-label="Comentarios sobre formación docente; puedes detener el movimiento para leerlos" onTouchStart={()=>{setPaused(true);setReading(true);}} onFocusCapture={event=>{const target=event.target as HTMLElement;if(target.matches(':focus-visible')){setReading(true);requestAnimationFrame(()=>target.scrollIntoView({block:'nearest',inline:'nearest'}));}}} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setReading(false);}}>
        <div className="voices-track">
          {[false,true].map(duplicate=><ul className="voices-group" key={String(duplicate)} aria-hidden={duplicate||undefined}>{teacherVoices.map(voice=><li key={voice.id} className="voice-card"><div className="voice-top"><span>{voice.topic}</span><Quote size={23} aria-hidden="true"/></div><blockquote><p>“{voice.quote}”</p></blockquote><div className="voice-attribution"><strong>{voice.author}</strong><span>{voice.context}</span></div><a className="voice-source" href={voice.source} target="_blank" rel="noreferrer" tabIndex={duplicate?-1:undefined}>{voice.sourceLabel}<ArrowUpRight size={15} aria-hidden="true"/></a></li>)}</ul>)}
        </div>
      </div>
      <p className="voices-credit">Entrevistas: Sánchez-Anguiano, De la Torre-Díaz y Cordero-Arroyo, <em>Trayectorias de desarrollo profesional de docentes de primaria</em>, RMIE 29(102), 2024.</p>
    </section>
  </>;
}
