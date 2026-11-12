'use client';

import { useState } from 'react';
import { ArrowUpRight, Pause, Play, Quote } from 'lucide-react';
import { teacherVoices } from '@/lib/community';
import WordReveal from './word-reveal';
import EnrollmentCounter from './enrollment-counter';
import LearningPhoto from './learning-photo';

export default function TeacherCommunity() {
  const [paused, setPaused] = useState(false);
  const [reading, setReading] = useState(false);
  return <>
    <section className="enrollment-section enrollment-with-photo" aria-labelledby="community-heading">
      <div className="community-intro"><p className="eyebrow">COMUNIDAD SALA DE MAESTROS</p><h2 id="community-heading"><WordReveal text="Crecer también es acompañarnos."/></h2><p>Cada docente llega con una historia, una meta y algo nuevo por aprender.</p></div>
      <LearningPhoto
        className="community-learning-photo"
        src="/assets/learning/taller-docente.webp"
        alt="Un grupo de docentes conversa y trabaja con sus computadoras durante un taller."
      />
      <EnrollmentCounter />
    </section>
    <section className="teacher-voices" aria-labelledby="voices-heading">
      <div className="voices-heading"><div><p className="eyebrow">VOCES DE LA DOCENCIA</p><h2 id="voices-heading"><WordReveal text="Aprender empieza con una inquietud."/></h2><p>Comentarios públicos sobre formación docente. Cada voz conserva su contexto y su fuente; no son reseñas de Sala de Maestros.</p></div><button className="voices-pause" type="button" onClick={()=>{setPaused(!paused);setReading(false);}} aria-pressed={paused} aria-label={paused?'Reanudar desplazamiento de comentarios':'Pausar desplazamiento de comentarios'}>{paused?<Play size={17} aria-hidden="true"/>:<Pause size={17} aria-hidden="true"/>}<span>{paused?'Reanudar':'Pausar'}</span></button></div>
      <div className="voices-window" data-paused={paused} data-reading={reading} tabIndex={0} role="region" aria-label="Comentarios sobre formación docente; puedes detener el movimiento para leerlos" onTouchStart={()=>{setPaused(true);setReading(true);}} onFocusCapture={event=>{const target=event.target as HTMLElement;if(target.matches(':focus-visible')){setReading(true);requestAnimationFrame(()=>target.scrollIntoView({block:'nearest',inline:'nearest'}));}}} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setReading(false);}}>
        <div className="voices-track">
          {[false,true].map(duplicate=><ul className="voices-group" key={String(duplicate)} aria-hidden={duplicate||undefined}>{teacherVoices.map(voice=><li key={voice.id} className="voice-card"><div className="voice-top"><span>{voice.topic}</span><Quote size={23} aria-hidden="true"/></div><blockquote><p>“{voice.quote}”</p></blockquote><div className="voice-attribution"><strong>{voice.author}</strong><span>{voice.context}</span></div><a className="voice-source" href={voice.source} target="_blank" rel="noreferrer" tabIndex={duplicate?-1:undefined}>{voice.sourceLabel}<ArrowUpRight size={15} aria-hidden="true"/></a></li>)}</ul>)}
        </div>
      </div>
      <p className="voices-credit">Entrevistas: Sánchez-Anguiano, De la Torre-Díaz y Cordero-Arroyo, <em>Trayectorias de desarrollo profesional de docentes de primaria</em>, RMIE 29(102), 2024.</p>
    </section>
  </>;
}
