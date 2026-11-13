'use client';

/* eslint-disable @next/next/no-html-link-for-pages -- Shared by Worker and static Pages. */

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { BookOpen, Check, Lightbulb, MessageSquareText, PencilLine } from 'lucide-react';
import { playUISound } from '@/lib/interface-audio';
import SoundToggle from '@/app/sound-toggle';

const steps = [
  { title: 'Lee', icon: BookOpen },
  { title: 'Responde', icon: PencilLine },
  { title: 'Revisa', icon: MessageSquareText },
] as const;
const options = [
  'El número de ejercicios entregados.',
  'Las razones que dan para cada paso.',
] as const;

export default function LearningSteps() {
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const focusHeading = useRef(false);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const StepIcon = steps[active].icon;
  const correct = selected === 1;
  const FeedbackIcon = correct ? Check : Lightbulb;

  useEffect(() => {
    if (!focusHeading.current) return;
    focusHeading.current = false;
    heading.current?.focus({ preventScroll: true });
  }, [active]);

  const advance = (next: number, sound: 'step' | 'confirm' = 'step') => {
    playUISound(sound);
    focusHeading.current = true;
    setActive(next);
  };
  const activateTab = (next: number) => {
    if (next !== active) playUISound('step');
    focusHeading.current = false;
    setActive(next);
    tabs.current[next]?.focus({ preventScroll: true });
  };
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % steps.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + steps.length - 1) % steps.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = steps.length - 1;
    else return;
    event.preventDefault();
    activateTab(next);
  };

  return <section className="method-scroll" aria-labelledby={`${id}-title`}>
    <div className="method-stage">
      <header className="method-heading">
        <p className="method-eyebrow">ESTUDIO PASO A PASO</p>
        <h2 id={`${id}-title`}>Cómo vas a estudiar</h2>
        <p>Pruébalo con una decisión de aula.</p>
      </header>
      <div className="method-tabs" role="tablist" aria-label="Etapas de estudio">
        {steps.map((step, index) => <button
          key={step.title}
          ref={element => { tabs.current[index] = element; }}
          id={`${id}-tab-${index}`}
          type="button"
          role="tab"
          aria-selected={active === index}
          aria-controls={`${id}-panel`}
          tabIndex={active === index ? 0 : -1}
          onClick={() => activateTab(index)}
          onKeyDown={event => onKey(event, index)}
        ><span className="method-tab-number" aria-hidden="true">0{index + 1}</span><step.icon size={18} aria-hidden="true" /><span>{step.title}</span></button>)}
      </div>
      <div className="method-demo" key={active} role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`} tabIndex={0}>
        <div className="method-demo-top"><span>Ejemplo breve</span><div className="method-demo-tools"><span>0{active + 1} / 03</span><SoundToggle /></div></div>
        <div className="method-demo-body">
          <div className="method-demo-visual" aria-hidden="true"><StepIcon size={72} strokeWidth={1.5} /><div className="method-visual-lines"><i /><i /><i /></div></div>
          <div className="method-demo-content">
            {active === 0 && <>
              <h3 ref={heading} tabIndex={-1}>Una decisión de aula.</h3>
              <p>Todo el grupo entregó los ejercicios. La docente quiere comprobar si pueden justificar el procedimiento que usaron.</p>
              <button type="button" className="primary method-next" onClick={() => advance(1)}>Elegir evidencia</button>
            </>}
            {active === 1 && <>
              <h3 ref={heading} tabIndex={-1}>¿Qué evidencia le sirve más?</h3>
              <p className="method-case-reminder">Quieres comprobar si pueden justificar el procedimiento.</p>
              <fieldset className="method-demo-options">
                <legend className="sr-only">Selecciona la evidencia que permite valorar la justificación.</legend>
                {options.map((option, index) => <label key={option} className="method-demo-option" data-selected={selected === index}>
                  <input type="radio" name={`${id}-evidence`} value={index} checked={selected === index} onChange={() => { playUISound('select'); setSelected(index); }} />
                  <span className="method-option-letter" aria-hidden="true">{String.fromCharCode(65 + index)}.</span><span className="method-option-label">{option}</span>
                </label>)}
              </fieldset>
              <button type="button" className="primary method-next" disabled={selected === null} onClick={() => { if (selected !== null) advance(2, 'confirm'); }}>Ver explicación</button>
            </>}
            {active === 2 && (selected === null ? <>
              <h3 ref={heading} tabIndex={-1}>Cada respuesta tiene un porqué.</h3>
              <p>Elige una opción y descubre qué evidencia responde al propósito.</p>
              <button type="button" className="primary method-next" onClick={() => advance(1)}>Ver opciones</button>
            </> : <>
              <div className="method-demo-feedback" data-correct={correct}><FeedbackIcon size={24} aria-hidden="true" /><h3 ref={heading} tabIndex={-1}>{correct ? 'Esa evidencia responde al propósito.' : 'Falta observar el razonamiento.'}</h3></div>
              <p>{correct ? 'Las razones permiten valorar la justificación; el número de entregas no muestra ese razonamiento.' : 'Contar entregas no permite revisar la justificación; necesitas las razones de sus pasos.'}</p>
              <p className="method-demo-choice">Elegiste: {options[selected]}</p>
              <div className="method-demo-actions"><a className="primary" href="/cursos/subdireccion-secundaria/leccion-gratuita/">Probar la lección gratuita</a><button type="button" className="text-button" onClick={() => { setSelected(null); advance(1); }}>Intentar otra vez</button></div>
            </>)}
          </div>
        </div>
      </div>
      <noscript><p className="method-noscript">Puedes abrir la <a href="/cursos/subdireccion-secundaria/leccion-gratuita/">lección gratuita</a> para seguir estudiando.</p></noscript>
    </div>
  </section>;
}
