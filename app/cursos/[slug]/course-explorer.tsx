'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock3, ExternalLink, LockKeyhole, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { coursePrice, type CourseOffering } from '@/lib/course-offerings';
import type { Lesson } from '@/lib/course';
import './course-explorer.css';

type Props = {
  course: CourseOffering; lesson: Lesson;
  source: { title: string; url: string; detail: string };
  outline: { id: string; title: string; minutes: number }[];
  hasAccess: boolean;
};
type Step = 0 | 1 | 2;
const subscribeToEntry = () => () => {};
const serverEntryStep = (): Step | null => null;
function browserEntryStep(): Step | null {
  const requested = new URLSearchParams(window.location.search).get('paso');
  return requested === 'aplica' ? 1 : requested === 'comprende' ? 0 : null;
}
const steps = [
  { name: 'Comprende', title: 'Encuentra el criterio.', description: 'Lee la distinción y observa cómo orienta una decisión.' },
  { name: 'Aplica', title: 'Ahora decide tú.', description: 'Elige una respuesta antes de consultar su explicación. Puedes volver al criterio cuando lo necesites.' },
  { name: 'Revisa', title: 'Dale sentido a tu respuesta.', description: 'Compara tu elección con el fundamento y decide qué hacer después.' },
] as const;

export default function CourseExplorer({ course, lesson, source, outline, hasAccess }: Props) {
  // The server and hydration snapshot start with the reading. React then reads
  // the browser URL; manual navigation takes precedence for the rest of the visit.
  const entryStep = useSyncExternalStore(subscribeToEntry, browserEntryStep, serverEntryStep);
  const [selectedStep, setStep] = useState<Step | null>(null);
  const step = selectedStep ?? entryStep ?? 0;
  const [focusRequest, setFocusRequest] = useState(0);
  const [accessOpen, setAccessOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const lessonRef = useRef<HTMLElement>(null);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const returnToLesson = useRef(false);
  const correct = checked && selected === lesson.check.correct;

  useEffect(() => {
    if (!focusRequest && entryStep === null) return;
    const frame = window.requestAnimationFrame(() => {
      const heading = stepHeading.current;
      if (!heading) return;
      heading.focus({ preventScroll: true });
      heading.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [step, focusRequest, entryStep]);

  const goToStep = (next: Step) => {
    if (next === 2 && !checked) return;
    setStep(next);
    setFocusRequest(request => request + 1);
  };
  const focusLesson = () => {
    lessonRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    lessonRef.current?.focus({ preventScroll: true });
  };
  const showAccess = () => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    returnToLesson.current = false;
    setAccessOpen(true);
  };
  const explore = () => {
    if (accessOpen) { returnToLesson.current = true; setAccessOpen(false); }
    else focusLesson();
  };
  const checkAnswer = () => {
    if (selected === null) return;
    setChecked(true);
    setStep(2);
    setFocusRequest(request => request + 1);
  };

  return <>
    <section className="course-overview lesson-course-overview">
      <div><p className="eyebrow">{course.category} · {course.edition}</p><h1>{course.title}</h1><p>{course.description}</p>
        <div className="course-overview-actions"><button className="primary" onClick={explore}>Ir a la lección gratuita <ArrowRight size={18} /></button>{hasAccess && <a href="/asesor" className="secondary">Abrir mi curso</a>}</div>
      </div>
      <div className="lesson-session-card"><BookOpen size={26} aria-hidden="true" /><span>UNA SESIÓN, UN PROPÓSITO</span><strong>Comprende.<br />Aplica. Revisa.</strong><p>Prueba una lección completa, a tu ritmo y sin registro.</p><small><Clock3 size={15} aria-hidden="true" />{lesson.minutes} minutos estimados</small></div>
    </section>
    <div className="course-preview-layout">
      <article ref={lessonRef} tabIndex={-1} className="free-lesson guided-free-lesson" aria-labelledby="free-lesson-title">
        <div className="free-lesson-meta"><span>LECCIÓN GRATUITA</span><span><Clock3 size={15} aria-hidden="true" />{lesson.minutes} minutos estimados</span></div>
        <h2 id="free-lesson-title">{lesson.title}</h2><p className="free-lesson-goal">{lesson.goal}</p>
        <nav className="lesson-stage-nav" aria-label="Etapas de la lección">
          <ol>{steps.map((item, index) => <li key={item.name}><button type="button" aria-current={step === index ? 'step' : undefined} disabled={index === 2 && !checked} onClick={() => goToStep(index as Step)}><span aria-hidden="true">0{index + 1}</span><strong>{item.name}</strong></button></li>)}</ol>
          <p>Etapa {step + 1} de 3 · {step === 2 && !correct ? 'Una oportunidad para ajustar tu criterio' : steps[step].name}</p>
        </nav>
        <div className="lesson-source-access"><BookOpen size={18} aria-hidden="true" /><div><span>FUENTE DE CONSULTA</span><a href={source.url} target="_blank" rel="noreferrer">{source.title}<ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (abre en otra pestaña)</span></a><small>{lesson.reference}</small></div></div>
        <section className="lesson-stage" aria-labelledby="lesson-stage-title">
          <p className="eyebrow">{steps[step].name.toUpperCase()}</p><h3 id="lesson-stage-title" ref={stepHeading} tabIndex={-1}>{steps[step].title}</h3><p className="lesson-stage-description">{steps[step].description}</p>
          {step === 0 && <>
            <div className="free-lesson-reading"><strong>Antes de empezar</strong><p>{lesson.read}</p></div>
            {lesson.paragraphs.map((paragraph, index) => <p className="free-lesson-paragraph" key={index}>{paragraph}</p>)}
            <div className="free-lesson-contrast">{lesson.compare.map(([title, text]) => <div key={title}><h4>{title}</h4><p>{text}</p></div>)}</div>
            <section className="free-worked-case"><p className="eyebrow">UN CASO, PASO A PASO</p><h4>{lesson.example.case}</h4><p><strong>Dato decisivo.</strong> {lesson.example.analysis}</p><p><strong>Decisión fundamentada.</strong> {lesson.example.decision}</p></section>
            <div className="lesson-stage-actions lesson-stage-actions-forward"><button className="primary" onClick={() => goToStep(1)}>Continuar: aplicar al caso <ArrowRight size={18} /></button></div>
          </>}
          {step === 1 && <>
            <section className="free-lesson-check" aria-labelledby="check-title"><h4 id="check-title">{lesson.check.prompt}</h4>
              <fieldset><legend className="sr-only">Selecciona una respuesta</legend>{lesson.check.options.map((option, index) => <label key={option} className={selected === index ? 'selected' : ''}><input type="radio" name={`free-lesson-answer-${lesson.id}`} value={index} checked={selected === index} onChange={() => { setSelected(index); setChecked(false); }} /><span><b>{String.fromCharCode(65 + index)}.</b> {option}</span></label>)}</fieldset>
              <p className="lesson-answer-note">{selected === null ? 'Elige una opción para ver su explicación.' : 'Tu selección está lista. Comprueba el criterio antes de continuar.'}</p>
            </section>
            <div className="lesson-stage-actions"><button className="secondary" onClick={() => goToStep(0)}><ArrowLeft size={17} />Volver al criterio</button><button className="primary" disabled={selected === null} onClick={checkAnswer}>{checked ? 'Ver mi revisión' : 'Comprobar y revisar'}<ArrowRight size={18} /></button></div>
          </>}
          {step === 2 && checked && selected !== null && <>
            <div className="lesson-answer-summary"><span>TU ELECCIÓN</span><p><b>{String.fromCharCode(65 + selected)}.</b> {lesson.check.options[selected]}</p></div>
            <div role="status" className={`lesson-review-feedback ${correct ? 'feedback-good' : 'feedback-retry'}`}><strong>{correct ? 'Has identificado el criterio de este caso.' : 'Hay una distinción que conviene revisar.'}</strong><p>{lesson.check.feedback[selected]}</p></div>
            {correct ? <>
              <div className="lesson-takeaway"><p className="eyebrow">PARA TU PRÓXIMA DECISIÓN</p><h4>Conserva el fundamento.</h4><p>{lesson.example.decision}</p><small>Esta respuesta describe lo trabajado en este caso. Puedes volver a la lectura y consultar la fuente para ampliar tu comprensión.</small></div>
              <div className="lesson-stage-actions"><button className="secondary" onClick={() => goToStep(1)}><ArrowLeft size={17} />Volver al caso</button><button className="text-button" onClick={() => goToStep(0)}>Consultar el criterio <BookOpen size={17} /></button></div>
              <div className="free-lesson-next"><div><p className="eyebrow">TU SIGUIENTE PASO</p><h4>Sigue construyendo tu criterio.</h4><p>El curso completo reúne las lecciones, los talleres y el simulador en una misma ruta.</p></div>{hasAccess ? <a href="/asesor" className="primary">Continuar en mi curso <ArrowRight size={18} /></a> : <button className="primary" onClick={showAccess}>Conocer el acceso completo <ArrowRight size={18} /></button>}</div>
            </> : <>
              <div className="lesson-retry-guidance"><h4>Vuelve al dato que cambia la decisión.</h4><p>Revisa la distinción y el ejemplo. Después regresa al caso y contrasta las opciones; tu selección se conserva mientras consultas.</p></div>
              <div className="lesson-stage-actions"><button className="secondary" onClick={() => goToStep(1)}><ArrowLeft size={17} />Volver al caso</button><button className="primary" onClick={() => goToStep(0)}>Revisar el criterio <BookOpen size={17} /></button></div>
            </>}
          </>}
        </section>
        <p className="lesson-local-note">Puedes volver entre etapas sin perder tu selección. Esta exploración no registra avance en tu cuenta.</p>
      </article>
      <aside className="course-outline lesson-outline"><p className="eyebrow">TU RUTA DE APRENDIZAJE</p><h2>Una lección para empezar.</h2><p>Explora el criterio, intenta el caso y revisa su explicación. El resto del curso forma parte del acceso completo.</p>
        <details><summary>Consultar el contenido del curso</summary><ol>{outline.map((item, index) => <li key={item.id}>{item.id === lesson.id ? <button onClick={explore} className="open-lesson"><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{item.title}</strong><small>Estás explorando · {item.minutes} min</small></div><ArrowRight size={16} aria-hidden="true" /></button> : <div className="lesson-outline-locked"><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{item.title}</strong><small>Acceso completo · {item.minutes} min</small></div><LockKeyhole size={14} aria-hidden="true" /></div>}</li>)}</ol></details>
      </aside>
    </div>
    <Dialog open={accessOpen} onOpenChange={setAccessOpen}><DialogContent className="course-access-dialog" showCloseButton={false} onCloseAutoFocus={event => { event.preventDefault(); if (returnToLesson.current) { returnToLesson.current = false; focusLesson(); } else opener.current?.focus(); }}>
      <DialogClose className="access-close" aria-label="Cerrar ventana"><X size={20} /></DialogClose><DialogHeader><p className="eyebrow">SIGUE APRENDIENDO</p><DialogTitle>Tu siguiente paso está aquí</DialogTitle><DialogDescription>Accede al curso completo de {course.title.toLowerCase()} y continúa tu preparación.</DialogDescription></DialogHeader>
      <div className="access-price"><strong>{coursePrice(course)}</strong><span>Precio por curso</span></div><ul>{course.features.map(feature => <li key={feature}><Check size={17} aria-hidden="true" />{feature}</li>)}</ul>
      {hasAccess ? <><p className="access-message">Ya tienes acceso a este curso.</p><a href="/asesor" className="primary">Entrar al curso completo <ArrowRight size={18} /></a></> : <p className="access-message">El pago en línea aún no está habilitado. Puedes seguir explorando la lección gratuita.</p>}
      <button className="secondary" onClick={explore}>Seguir con la lección gratuita</button><small>Material de preparación independiente de SEP y USICAMM.</small>
    </DialogContent></Dialog>
  </>;
}
