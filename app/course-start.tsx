'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock3, Compass, Lightbulb } from 'lucide-react';
import { recommendStart, studyGoals, studyTimes, type StudyGoal, type StudyTime } from '@/lib/course-orientation';
import './course-start.css';

export default function CourseStart({ slug, hasAccess }: { slug: string; hasAccess: boolean }) {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<StudyGoal | null>(null);
  const [time, setTime] = useState<StudyTime | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const section = useRef<HTMLElement>(null);
  const moveFocus = useRef(false);
  const go = (next: number) => { moveFocus.current = true; setStep(next); };
  useEffect(() => {
    if (moveFocus.current) {
      heading.current?.focus({ preventScroll: true });
      section.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
      moveFocus.current = false;
    }
  }, [step]);
  const result = goal && time ? recommendStart(goal, time, slug, hasAccess) : null;
  const selectedGoal = studyGoals.find(item => item.value === goal);
  const selectedTime = studyTimes.find(item => item.value === time);
  const preview = `/cursos/${slug}/leccion-gratuita`;
  const icons = [BookOpen, Lightbulb, Compass];

  return <section ref={section} className="course-start" aria-labelledby="course-start-title">
    <div className="course-start-top"><span className="eyebrow">TU PUNTO DE PARTIDA</span><span><Clock3 size={14} aria-hidden="true" />2 preguntas · opcional</span></div>
    <ol className="course-start-progress" aria-label="Pasos para elegir por dónde empezar">
      {['Tu propósito', 'Tu tiempo', 'Tu siguiente paso'].map((label, index) => <li key={label} aria-current={step === index ? 'step' : undefined} data-complete={step > index}><span aria-hidden="true">{step > index ? <Check size={13} /> : index + 1}</span>{label}</li>)}
    </ol>
    <div className="course-start-content">
      <h2 id="course-start-title" ref={heading} tabIndex={-1}>{step === 0 ? '¿Qué te gustaría lograr hoy?' : step === 1 ? '¿Cuánto tiempo quieres dedicarle?' : result?.title}</h2>
      <p className="course-start-intro">{step === 0 ? 'Elige un propósito y te sugerimos una forma de empezar.' : step === 1 ? 'Ajustemos la propuesta al espacio que tienes hoy.' : result?.reason}</p>
      {step === 0 && <>
        <fieldset className="course-start-options"><legend className="sr-only">Tu propósito de estudio</legend>{studyGoals.map((item, index) => { const Icon = icons[index]; return <label className="course-start-option" key={item.value}>
          <input type="radio" name="study-goal" value={item.value} checked={goal === item.value} onChange={() => setGoal(item.value)} />
          <Icon size={21} aria-hidden="true" /><span><strong>{item.title}</strong><small>{item.description}</small></span><span className="course-start-radio" aria-hidden="true" />
        </label>; })}</fieldset>
        <p className="course-start-feedback" role="status">{selectedGoal?.feedback ?? 'La elección orienta este inicio; podrás explorar el resto del curso.'}</p>
      </>}
      {step === 1 && <>
        <p className="course-start-context"><Check size={15} aria-hidden="true" />{selectedGoal?.title}</p>
        <fieldset className="course-start-options"><legend className="sr-only">Tiempo disponible para estudiar</legend>{studyTimes.map(item => <label className="course-start-option" key={item.value}>
          <input type="radio" name="study-time" value={item.value} checked={time === item.value} onChange={() => setTime(item.value)} />
          <Clock3 size={21} aria-hidden="true" /><span><strong>{item.title}</strong><small>{item.description}</small></span><span className="course-start-radio" aria-hidden="true" />
        </label>)}</fieldset>
        <p className="course-start-feedback">Sin cronómetro. Puedes avanzar a tu ritmo.</p>
      </>}
      {step === 2 && result && <>
        <div className="course-start-summary"><span>{selectedGoal?.title}</span><span>{selectedTime?.title}</span></div>
        <ol className="course-start-plan">{result.steps.map((text, index) => <li key={text}><span aria-hidden="true">{index + 1}</span>{text}</li>)}</ol>
        <p className="course-start-note">{result.note}</p>
      </>}
      <div className="course-start-actions">
        {step > 0 && <button className="text-button" onClick={() => go(step - 1)}><ArrowLeft size={16} aria-hidden="true" />Atrás</button>}
        {step < 2 ? <button className="primary" disabled={step === 0 ? !goal : !time} onClick={() => go(step + 1)}>{step === 0 ? 'Continuar' : 'Ver mi siguiente paso'}<ArrowRight size={18} aria-hidden="true" /></button> : result && <a className="primary" href={result.href}>{result.label}<ArrowRight size={18} aria-hidden="true" /></a>}
      </div>
    </div>
    <div className="course-start-shortcut"><a href={hasAccess ? '/asesor' : preview}>{hasAccess ? 'Ir directamente a mi curso' : 'Prefiero explorar directamente'}<ArrowRight size={15} aria-hidden="true" /></a>{step === 2 && <button onClick={() => go(0)}>Cambiar mis respuestas</button>}</div>
  </section>;
}
