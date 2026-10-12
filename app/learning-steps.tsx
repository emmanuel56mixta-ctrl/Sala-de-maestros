'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { BookOpen, Eye, Compass, PencilLine, ArrowDown, Check } from 'lucide-react';
import WordReveal from './word-reveal';

const steps = [
  { title: 'Leer', icon: BookOpen, label: 'COMPRENDE ANTES DE RESPONDER', heading: 'Encuentra lo que importa.', description: 'Separa el contexto, la situación y la decisión que te piden. Aprende a reconocer qué información cambia la respuesta.', panel: 'Desglosa una situación', note: 'Ejemplo de lectura', parts: [{ label: 'CONTEXTO', text: 'En una secundaria, el colectivo revisa los resultados de aprendizaje.' }, { label: 'SITUACIÓN', text: 'Algunos grupos necesitan apoyos diferentes para avanzar.' }, { label: 'DECISIÓN', text: '¿Qué información conviene analizar antes de acordar una acción?' }], takeaway: 'Primero comprende la pregunta. Después compara las opciones.' },
  { title: 'Vigilar', icon: Eye, label: 'OBSERVA TU APRENDIZAJE', heading: 'Haz visibles tus dudas.', description: 'Revisa cómo llegaste a una respuesta. Distingue entre lo que comprendes, lo que confundes y lo que necesitas volver a estudiar.', panel: 'Mira más allá del acierto', note: 'Preguntas para tu revisión', parts: [{ label: 'COMPRENSIÓN', text: '¿Identifiqué lo que la pregunta me pedía resolver?' }, { label: 'RAZONAMIENTO', text: '¿Puedo explicar por qué elegí esa respuesta?' }, { label: 'DUDA', text: '¿Qué concepto necesito revisar antes de continuar?' }], takeaway: 'Una duda concreta te ayuda a decidir qué estudiar después.' },
  { title: 'Dirigir', icon: Compass, label: 'ENFOCA TU SIGUIENTE PASO', heading: 'Dale dirección a tu estudio.', description: 'Utiliza tus dudas para elegir una lección, revisar su fundamento y regresar a una actividad. Avanza con un propósito claro.', panel: 'Prepara una sesión breve', note: 'Una secuencia para estudiar', parts: [{ label: '01 · ELIGE', text: 'Selecciona un concepto que quieras comprender mejor.' }, { label: '02 · REVISA', text: 'Consulta la lección y relaciona sus ideas con una situación escolar.' }, { label: '03 · CONTRASTA', text: 'Explica cómo ese concepto orienta una decisión profesional.' }], takeaway: 'Cierra cada sesión con una idea que ya puedas explicar.' },
  { title: 'Hacer', icon: PencilLine, label: 'LLEVA LO APRENDIDO A LA PRÁCTICA', heading: 'Decide, explica y vuelve a intentar.', description: 'Resuelve una actividad, compara tu razonamiento con la explicación y aplica lo aprendido en una nueva situación.', panel: 'Convierte el estudio en criterio', note: 'Tu ciclo de práctica', parts: [{ label: 'DECIDE', text: 'Elige una respuesta antes de consultar la explicación.' }, { label: 'EXPLICA', text: 'Compara las opciones y reconoce por qué una atiende mejor el caso.' }, { label: 'TRANSFIERE', text: 'Pon a prueba tu criterio frente a una situación diferente.' }], takeaway: 'Practicar es aprender a justificar una decisión, además de elegirla.' },
];
const smoothstep = (value: number) => value * value * (3 - 2 * value);

export default function LearningSteps() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const panes = useRef<(HTMLDivElement | null)[]>([]);
  const copies = useRef<(HTMLDivElement | null)[]>([]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const paint = (position: number) => {
    const from = Math.floor(position);
    const blend = smoothstep(position - from);
    const selected = Math.min(3, from + (blend >= .5 ? 1 : 0));
    setActive(current => current === selected ? current : selected);
    steps.forEach((_, index) => {
      const opacity = index === from ? 1 - blend : index === from + 1 ? blend : 0;
      [panes.current[index], copies.current[index]].forEach(element => {
        if (!element) return;
        element.style.opacity = String(opacity);
        element.style.transform = `translateY(${(1 - opacity) * (index > position ? 16 : -16)}px)`;
      });
    });
  };

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 720px), (max-height: 720px)');
    let frame = 0;
    let enabled = false;
    const update = () => {
      frame = 0;
      if (!enabled || !root.current || !stage.current) return;
      const range = Math.max(1, root.current.offsetHeight - stage.current.offsetHeight);
      paint(Math.max(0, Math.min(1, -root.current.getBoundingClientRect().top / range)) * 3);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const sync = () => {
      enabled = !media.matches;
      setPinned(enabled);
      if (root.current) root.current.dataset.motion = enabled ? 'on' : 'off';
      if (enabled) schedule();
      else paint(0);
    };
    sync();
    media.addEventListener('change', sync);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const observer = new ResizeObserver(schedule);
    if (root.current) observer.observe(root.current);
    if (stage.current) observer.observe(stage.current);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      media.removeEventListener('change', sync);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const choose = (index: number) => {
    if (pinned && root.current && stage.current) {
      const range = root.current.offsetHeight - stage.current.offsetHeight;
      window.scrollTo({ top: window.scrollY + root.current.getBoundingClientRect().top + range * index / 3, behavior: 'smooth' });
    } else paint(index);
  };
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % steps.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + steps.length - 1) % steps.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = steps.length - 1;
    else return;
    event.preventDefault();
    tabs.current[next]?.focus({ preventScroll: true });
    choose(next);
  };

  return <section ref={root} className="method-scroll" aria-labelledby="method-title">
    <div className="method-stage" ref={stage}>
      <div className="method-heading">
        <div><p className="eyebrow">APRENDER TIENE SU PROPIO RITMO</p><h2 id="method-title"><WordReveal text="Cómo funciona" /></h2></div>
        <p>Cuatro maneras de avanzar.<br />Una ruta que haces tuya.</p>
      </div>
      <div className="method-layout">
        <div className="method-story">
          <div className="method-tabs" role="tablist" aria-label="Etapas de aprendizaje">
            {steps.map((step, index) => <button key={step.title} ref={element => { tabs.current[index] = element; }} id={`method-tab-${index}`} role="tab" aria-selected={active === index} aria-controls={`method-panel-${index}`} tabIndex={active === index ? 0 : -1} onClick={() => choose(index)} onKeyDown={event => onKey(event, index)}><span>0{index + 1}</span>{step.title}</button>)}
          </div>
          <div className="method-copy-stack" aria-live="off">
            {steps.map((step, index) => <div key={step.title} ref={element => { copies.current[index] = element; }} className="method-copy" data-first={index === 0 ? 'true' : undefined} aria-hidden={active !== index}>
              <p className="method-kicker">{step.label}</p><h3>{step.heading}</h3><p>{step.description}</p>
            </div>)}
          </div>
          <p className="method-scroll-cue"><ArrowDown size={15} aria-hidden="true" /><span>{pinned ? 'Desplázate o elige una etapa' : 'Elige una etapa para conocerla'}</span><span className="method-current">0{active + 1} / 04</span></p>
        </div>
        <div className="method-panel-stack">
          {steps.map((step, index) => <div key={step.title} ref={element => { panes.current[index] = element; }} className={`method-panel method-panel-${index}`} data-first={index === 0 ? 'true' : undefined} role="tabpanel" id={`method-panel-${index}`} aria-labelledby={`method-tab-${index}`} aria-hidden={active !== index} tabIndex={active === index ? 0 : -1}>
            <div className="method-panel-top"><span>{step.note}</span><step.icon size={25} aria-hidden="true" /></div>
            <h4>{step.panel}</h4>
            <div className="method-example">{step.parts.map(part => <div key={part.label}><span>{part.label}</span><p>{part.text}</p></div>)}</div>
            <p className="method-takeaway"><Check size={18} aria-hidden="true" />{step.takeaway}</p>
          </div>)}
        </div>
      </div>
    </div>
  </section>;
}
