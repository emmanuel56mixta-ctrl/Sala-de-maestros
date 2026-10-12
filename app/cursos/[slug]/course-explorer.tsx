'use client';

import { useRef, useState } from 'react';
import { ArrowRight, Check, Clock3, ExternalLink, LockKeyhole, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { coursePrice, type CourseOffering } from '@/lib/course-offerings';
import type { Lesson } from '@/lib/course';

type Props = {
  course: CourseOffering; lesson: Lesson;
  source: { title: string; url: string; detail: string };
  outline: { id: string; title: string; minutes: number }[];
  hasAccess: boolean;
};

export default function CourseExplorer({ course, lesson, source, outline, hasAccess }: Props) {
  const [accessOpen, setAccessOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const lessonRef = useRef<HTMLElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const returnToLesson = useRef(false);
  const correct = checked && selected === lesson.check.correct;
  const focusLesson = () => { lessonRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); lessonRef.current?.focus({ preventScroll: true }); };
  const showAccess = () => { opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; returnToLesson.current = false; setAccessOpen(true); };
  const explore = () => { if (accessOpen) { returnToLesson.current = true; setAccessOpen(false); } else focusLesson(); };
  return <>
    <section className="course-overview"><div><p className="eyebrow">{course.category} · {course.edition}</p><h1>{course.title}</h1><p>{course.description}</p><div className="course-overview-actions"><button className="primary" onClick={explore}>Explorar lección gratuita <ArrowRight size={18} /></button>{hasAccess && <a href="/asesor" className="secondary">Abrir mi curso</a>}</div></div><div className="course-price-panel"><span>ACCESO COMPLETO</span><strong>{coursePrice(course)}</strong><p>Precio por curso</p><button className="secondary" onClick={showAccess}>Ver todo lo que incluye <ArrowRight size={16} /></button></div></section>
    <div className="course-preview-layout">
      <article ref={lessonRef} tabIndex={-1} className="free-lesson" aria-labelledby="free-lesson-title">
        <div className="free-lesson-meta"><span>LECCIÓN GRATUITA</span><span><Clock3 size={15} aria-hidden="true" />{lesson.minutes} minutos</span></div>
        <h2 id="free-lesson-title">{lesson.title}</h2><p className="free-lesson-goal">{lesson.goal}</p>
        <div className="free-lesson-reading"><strong>Antes de empezar</strong><p>{lesson.read}</p><a href={source.url} target="_blank" rel="noreferrer">{source.title}<ExternalLink size={14} aria-hidden="true" /></a><small>{lesson.reference}</small></div>
        {lesson.paragraphs.map((paragraph, index) => <p className="free-lesson-paragraph" key={index}>{paragraph}</p>)}
        <div className="free-lesson-contrast">{lesson.compare.map(([title, text]) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}</div>
        <section className="free-worked-case"><p className="eyebrow">UN CASO, PASO A PASO</p><h3>{lesson.example.case}</h3><p><strong>Dato decisivo.</strong> {lesson.example.analysis}</p><p><strong>Decisión fundamentada.</strong> {lesson.example.decision}</p></section>
        <section className="free-lesson-check" aria-labelledby="check-title"><p className="eyebrow">AHORA TE TOCA A TI</p><h3 id="check-title">{lesson.check.prompt}</h3><fieldset><legend className="sr-only">Selecciona una respuesta</legend>{lesson.check.options.map((option, index) => <label key={option} className={selected === index ? 'selected' : ''}><input type="radio" name="free-lesson-answer" value={index} checked={selected === index} onChange={() => { setSelected(index); setChecked(false); }} /><span><b>{String.fromCharCode(65 + index)}.</b> {option}</span></label>)}</fieldset>
          <button className="primary" disabled={selected === null || checked} onClick={() => setChecked(true)}>Comprobar respuesta</button>
          {checked && selected !== null && <div role="status" className={correct ? 'feedback-good' : 'feedback-retry'}><strong>{correct ? 'Has identificado el criterio.' : 'Revisa el criterio y vuelve a intentarlo.'}</strong><p>{lesson.check.feedback[selected]}</p></div>}
        </section>
        <div className="free-lesson-next"><div><h3>{correct ? 'Sigue construyendo tu criterio' : 'Continúa tu preparación'}</h3><p>El curso completo reúne las lecciones, los talleres y el simulador en una misma ruta.</p></div><button className="primary" onClick={showAccess}>Continuar con el curso <ArrowRight size={18} /></button></div>
      </article>
      <aside className="course-outline"><p className="eyebrow">TU RUTA DE APRENDIZAJE</p><h2>Contenido del curso</h2><p>Explora la primera lección. El resto forma parte del acceso completo.</p><ol>{outline.map((item, index) => <li key={item.id}><button onClick={item.id === lesson.id ? explore : showAccess} className={item.id === lesson.id ? 'open-lesson' : ''}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{item.title}</strong><small>{item.id === lesson.id ? 'Explorar gratis' : 'Acceso completo'} · {item.minutes} min</small></div>{item.id === lesson.id ? <ArrowRight size={16} /> : <LockKeyhole size={14} />}</button></li>)}</ol><button className="primary" onClick={showAccess}>Ver acceso completo</button></aside>
    </div>
    <Dialog open={accessOpen} onOpenChange={setAccessOpen}><DialogContent className="course-access-dialog" showCloseButton={false} onCloseAutoFocus={event => { event.preventDefault(); if (returnToLesson.current) { returnToLesson.current = false; focusLesson(); } else opener.current?.focus(); }}><DialogClose className="access-close" aria-label="Cerrar ventana"><X size={20} /></DialogClose><DialogHeader><p className="eyebrow">SIGUE APRENDIENDO</p><DialogTitle>Tu siguiente paso está aquí</DialogTitle><DialogDescription>Accede al curso completo de {course.title.toLowerCase()} y continúa tu preparación.</DialogDescription></DialogHeader><div className="access-price"><strong>{coursePrice(course)}</strong><span>Precio por curso</span></div><ul>{course.features.map(feature => <li key={feature}><Check size={17} aria-hidden="true" />{feature}</li>)}</ul>
      {hasAccess ? <><p className="access-message">Ya tienes acceso a este curso.</p><a href="/asesor" className="primary">Entrar al curso completo <ArrowRight size={18} /></a></> : <p className="access-message">El pago en línea aún no está habilitado. Puedes seguir explorando la lección gratuita.</p>}
      <button className="secondary" onClick={explore}>Seguir con la lección gratuita</button><small>Material de preparación independiente de SEP y USICAMM.</small>
    </DialogContent></Dialog>
  </>;
}
