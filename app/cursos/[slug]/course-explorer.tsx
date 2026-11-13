'use client';

/* eslint-disable @next/next/no-html-link-for-pages -- Shared by Worker and static Pages. */

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowRight, Check, Clock3, ExternalLink } from 'lucide-react';
import type { CourseOffering } from '@/lib/course-offerings';
import type { Lesson } from '@/lib/course';
import { analysisForAnswer, firstCase } from '@/lib/case-analysis';
import { freeLessonContent, transferCase } from '@/lib/free-lesson';
import { emptyAttempt, resultForAttempt, selectAnswer, submitAnswer } from '@/lib/free-lesson-progress';
import CaseAnalysis from '@/app/case-analysis';
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
const steps = ['Lectura', 'Práctica', 'Explicación'] as const;

export default function CourseExplorer({ course, lesson, source, hasAccess }: Props) {
  const entryStep = useSyncExternalStore(subscribeToEntry, browserEntryStep, serverEntryStep);
  const [selectedStep, setStep] = useState<Step | null>(null);
  const step = selectedStep ?? entryStep ?? 0;
  const [focusRequest, setFocusRequest] = useState(0);
  const [caseIndex, setCaseIndex] = useState(0);
  const [attempts, setAttempts] = useState([emptyAttempt(), emptyAttempt()]);
  const [showResult, setShowResult] = useState(false);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const isPublicCase = lesson.id === 'd1';
  const cases = isPublicCase ? [firstCase, transferCase] : [{ id: lesson.id, title: lesson.title, paragraphs: [], check: lesson.check }];
  const currentCase = cases[caseIndex];
  const exercise = currentCase.check;
  const attempt = attempts[caseIndex];
  const correct = attempt.checked && attempt.selected === exercise.correct;
  const analysis = useMemo(() => isPublicCase && caseIndex === 0 && attempt.checked
    ? analysisForAnswer(attempt.selected) : null, [isPublicCase, caseIndex, attempt.checked, attempt.selected]);
  const title = isPublicCase ? freeLessonContent.title : lesson.title;
  const goal = isPublicCase ? freeLessonContent.objective : lesson.goal;
  const reading = isPublicCase ? freeLessonContent.readingBlocks : lesson.paragraphs.map((text, index) => ({ title: `Criterio ${index + 1}`, text }));
  const example = isPublicCase ? freeLessonContent.example : { title: 'Una decisión escolar', situation: lesson.example.case, observation: lesson.example.analysis, action: lesson.example.decision };
  const totalCases = cases.length;
  const allChecked = cases.every((_, index) => attempts[index].checked);
  const heading = showResult ? 'Lo que te llevas de esta práctica' : step === 0 ? 'Antes de elegir un apoyo' : step === 1 ? currentCase.title : 'Revisa tu decisión';

  useEffect(() => {
    if (!focusRequest && entryStep === null) return;
    const frame = window.requestAnimationFrame(() => {
      stepHeading.current?.focus({ preventScroll: true });
      stepHeading.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [step, caseIndex, showResult, focusRequest, entryStep]);

  const goToStep = (next: Step) => {
    if (next === 2 && !attempt.checked) return;
    setShowResult(false);
    setStep(next);
    setFocusRequest(request => request + 1);
  };
  const chooseCase = (index: number) => {
    if (index > 0 && !attempts[0].attempts) return;
    setCaseIndex(index);
    setShowResult(false);
    setStep(1);
    setFocusRequest(request => request + 1);
  };
  const checkAnswer = () => {
    if (attempt.selected === null) return;
    setAttempts(previous => previous.map((value, index) => index === caseIndex ? submitAnswer(value) : value));
    setStep(2);
    setFocusRequest(request => request + 1);
  };

  return <div className="lesson-page">
    <header className="lesson-compact-header">
      <nav aria-label="Ruta de navegación"><ol className="lesson-breadcrumb">
        <li><a href="/cursos/">Cursos</a></li><li><a href={`/cursos/${course.slug}/`}>{course.title}</a></li><li aria-current="page">Lección gratuita</li>
      </ol></nav>
      <span className="lesson-compact-meta">Sin registro</span>
    </header>
    <article className="free-lesson guided-free-lesson" aria-labelledby="free-lesson-title">
      <div className="free-lesson-meta"><span>LECCIÓN GRATUITA</span><span><Clock3 size={16} aria-hidden="true" />{isPublicCase ? freeLessonContent.durationLabel : `${lesson.minutes} min estimados`}</span></div>
      <h1 id="free-lesson-title">{title}</h1>
      <p className="free-lesson-goal">{goal}</p>
      <nav className="lesson-stage-nav" aria-label="Etapas de la lección">
        <ol>{steps.map((name, index) => <li key={name}><button type="button" aria-current={step === index ? 'step' : undefined} disabled={index === 2 && !attempt.checked} onClick={() => goToStep(index as Step)}>{name}</button></li>)}</ol>
      </nav>
      <section className="lesson-stage" aria-labelledby="lesson-stage-title">
        {step !== 0 && <p className="lesson-context">{showResult ? 'Resultado de esta visita' : `Caso ${caseIndex + 1} de ${totalCases} · ${caseIndex === 0 ? 'Práctica acompañada' : 'Aplicación a otra situación'}`}</p>}
        <h2 id="lesson-stage-title" ref={stepHeading} tabIndex={-1}>{heading}</h2>
        {step === 0 && <div className="lesson-reading">
          {reading.map(block => <section className="lesson-reading-block" key={block.title}><h3>{block.title}</h3><p>{block.text}</p></section>)}
          <section className="lesson-worked-example" aria-labelledby="worked-example-title">
            <p className="eyebrow">EJEMPLO RESUELTO</p><h3 id="worked-example-title">{example.title}</h3>
            <p>{example.situation}</p><p><strong>La barrera.</strong> {example.observation}</p><p><strong>El ajuste.</strong> {example.action}</p>
          </section>
          <p className="lesson-source-inline">Para profundizar: <a href={source.url} target="_blank" rel="noreferrer">{source.title}<ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (abre en otra pestaña)</span></a>. {isPublicCase ? 'Arts. 61 y 62: barreras para la participación y el aprendizaje.' : lesson.reference}</p>
          {isPublicCase && <p className="lesson-duration-note">{freeLessonContent.durationNote}</p>}
          <div className="lesson-stage-actions"><button className="primary" onClick={() => goToStep(1)}>Ir a la práctica <ArrowRight size={18} aria-hidden="true" /></button></div>
        </div>}
        {step === 1 && <div className="lesson-practice">
          <p className="lesson-stage-description">{caseIndex === 0 ? 'Elige una respuesta. Después revisaremos las pistas que ayudan a decidir.' : attempt.attempts ? 'Ya consultaste la explicación. Si cambias tu respuesta, el siguiente intento será práctica con apoyo.' : 'Aplica el criterio a un caso nuevo. La explicación aparecerá después de responder.'}</p>
          <div className="lesson-case-stem">{currentCase.paragraphs.filter(paragraph => paragraph.id !== 'encargo').map(paragraph => <p key={paragraph.id}>{paragraph.text}</p>)}</div>
          <fieldset className="lesson-answers">
            <legend>{exercise.prompt}</legend>
            {exercise.options.map((option, index) => <label key={option} className={attempt.selected === index ? 'selected' : ''}>
              <input type="radio" name={`free-lesson-answer-${currentCase.id}`} value={index} checked={attempt.selected === index} onChange={() => setAttempts(previous => previous.map((value, current) => current === caseIndex ? selectAnswer(value, index, exercise.options.length) : value))} />
              <span><b>{String.fromCharCode(65 + index)}.</b> {option}{attempt.selected === index && <small className="lesson-selected" aria-hidden="true"><Check size={14} aria-hidden="true" /> Seleccionada</small>}</span>
            </label>)}
          </fieldset>
          <div className="lesson-stage-actions"><button className="primary" disabled={attempt.selected === null} onClick={checkAnswer}>{attempt.checked ? 'Ver la explicación' : 'Comprobar respuesta'}<ArrowRight size={18} aria-hidden="true" /></button><button className="text-button" onClick={() => goToStep(0)}>Volver a la lectura</button></div>
          <p className="lesson-editorial-note">Caso de práctica creado para esta lección.</p>
        </div>}
        {step === 2 && attempt.checked && attempt.selected !== null && !showResult && <>
          <div className={`lesson-review-feedback ${correct ? 'feedback-good' : 'feedback-retry'}`} role="status"><strong>{correct ? 'Respuesta correcta' : 'Revisa este punto'}</strong><p>{exercise.feedback[attempt.selected]}</p></div>
          <p className="lesson-answer-summary"><strong>Tu elección: {String.fromCharCode(65 + attempt.selected)}.</strong> {exercise.options[attempt.selected]}</p>
          {attempt.attempts > 1 && <p className="lesson-support-note">{resultForAttempt(attempt, exercise.correct)}. Tu primer intento fue {String.fromCharCode(65 + (attempt.firstAnswer ?? 0))}.</p>}
          {analysis && <CaseAnalysis key={analysis.id} plan={analysis} />}
          {caseIndex === 1 && <div className="lesson-transfer-explanation"><h3>El propósito decide qué puede cambiar</h3><p>{transferCase.takeaway}</p><p className="lesson-source-inline">Criterio general: <a href={transferCase.source.url} target="_blank" rel="noreferrer">{transferCase.source.title}<span className="sr-only"> (abre en otra pestaña)</span></a>, arts. 61 y 62. Este caso es una aplicación didáctica.</p></div>}
          <details className="lesson-option-review"><summary>Por qué funcionan o fallan las otras opciones</summary><ol>{exercise.options.map((option, index) => <li key={option}><strong>{String.fromCharCode(65 + index)} · {index === exercise.correct ? 'Conserva el aprendizaje' : 'No resuelve este caso'}{index === attempt.selected ? ' · Tu elección' : ''}</strong><p>{option}</p><p>{exercise.feedback[index]}</p></li>)}</ol></details>
          <div className="lesson-stage-actions">
            {caseIndex === 0 && totalCases > 1 ? <button className="primary" onClick={() => chooseCase(1)}>{attempts[1].attempts ? 'Volver al segundo caso' : 'Resolver un caso nuevo'}<ArrowRight size={18} aria-hidden="true" /></button>
              : <button className="primary" disabled={!allChecked} onClick={() => { setShowResult(true); setFocusRequest(request => request + 1); }}>Ver mi resultado<ArrowRight size={18} aria-hidden="true" /></button>}
            <button className="text-button" onClick={() => goToStep(1)}>{correct ? 'Volver a la pregunta' : 'Intentarlo con la explicación'}</button>
          </div>
        </>}
        {step === 2 && showResult && allChecked && <>
          <dl className="lesson-results">{cases.map((item, index) => <div key={item.id}>
            <dt>Caso {index + 1} · {index === 0 ? 'Práctica acompañada' : 'Aplicación a otra situación'}</dt>
            <dd><strong>{resultForAttempt(attempts[index], item.check.correct)}</strong><p>{index === 0 ? 'Este caso forma parte del recorrido guiado.' : attempts[index].attempts === 1 && attempts[index].selected === item.check.correct ? 'Resolviste esta situación antes de consultar su explicación.' : 'Ya conoces la explicación. Un nuevo intento será práctica con apoyo.'}</p></dd>
          </div>)}</dl>
          <div className="lesson-takeaway"><h3>Un criterio para tu siguiente decisión</h3><p>{isPublicCase ? freeLessonContent.takeaway : lesson.example.decision}</p><small>Este recorrido es una práctica breve, no una acreditación de dominio.</small></div>
          <div className="lesson-result-retries">{cases.map((item, index) => <button key={item.id} className="text-button" onClick={() => chooseCase(index)}>Revisar caso {index + 1}</button>)}</div>
          <section className="free-lesson-next" aria-labelledby="lesson-next-title"><h3 id="lesson-next-title">Continúa tu preparación</h3><p>Conoce la ruta de estudio, los talleres y la práctica del curso de {course.title.toLowerCase()}.</p><a className="primary" href={hasAccess ? '/asesor' : `/cursos/${course.slug}/`}>{hasAccess ? 'Continuar en mi curso' : 'Conocer el curso completo'}<ArrowRight size={18} aria-hidden="true" /></a></section>
        </>}
      </section>
      <p className="lesson-local-note">Tus respuestas se conservan mientras permanezcas en esta página. Se borran al recargar o salir y no se guardan en tu cuenta.</p>
    </article>
  </div>;
}
