'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { BookOpen, Check, MessageSquareText, PencilLine, RotateCcw } from 'lucide-react';

const steps = [
  {
    title: 'Lee', icon: BookOpen, label: 'LECTURA DEL CASO',
    heading: 'Identifica lo que te piden.',
    description: 'Lee la situación y distingue el propósito, la barrera y los datos que aporta el texto. Antes de comparar opciones, ubica la decisión que debes tomar.',
    panel: 'Antes de elegir una respuesta', note: 'Ejemplo de la lección gratuita',
    parts: [
      { label: 'PROPÓSITO', text: 'Interpretar gráficas y explicar las conclusiones.' },
      { label: 'BARRERA', text: 'El trazado manual impide que una alumna termine la actividad. Ampliar el tiempo ya se intentó y no resolvió la barrera.' },
      { label: 'PREGUNTA', text: '¿Qué acuerdo atiende esa barrera sin cambiar el aprendizaje evaluado?' },
    ],
    takeaway: 'En este caso, interpretar gráficas es el aprendizaje; trazarlas a mano es el medio de respuesta.',
  },
  {
    title: 'Responde', icon: PencilLine, label: 'ELECCIÓN DE RESPUESTA',
    heading: 'Elige una opción.',
    description: 'Compara las respuestas con lo que dice el caso. Decide antes de abrir la explicación y comprueba que tu opción atienda lo que pide la pregunta.',
    panel: 'Compara los acuerdos', note: 'Opciones del mismo caso',
    parts: [
      { label: 'A', text: 'Mantener el trazado a mano, ampliar de nuevo el plazo y valorar la interpretación con la misma rúbrica.' },
      { label: 'B', text: 'Usar gráficas ya trazadas, permitir una explicación oral y verificar la interpretación con la misma rúbrica.' },
      { label: 'C', text: 'Cambiar la interpretación por reconocimiento de imágenes, simplificar la actividad y valorar su entrega.' },
    ],
    takeaway: 'Elige la medida que atienda la barrera y conserve el aprendizaje que se evalúa.',
  },
  {
    title: 'Revisa', icon: MessageSquareText, label: 'EXPLICACIÓN DE LA RESPUESTA',
    heading: 'Revisa la opción que elegiste.',
    description: 'Comprueba tu respuesta y lee la explicación. Si te equivocaste, revisa qué dato del caso permite distinguir las opciones.',
    panel: 'Cambiar el medio, conservar el aprendizaje', note: 'Ejemplo de explicación',
    parts: [
      { label: 'EL DATO', text: 'Dar más tiempo ya se probó y no resolvió la dificultad para trazar a mano.' },
      { label: 'EL AJUSTE', text: 'Usar gráficas ya trazadas permite responder sin producir el trazo.' },
      { label: 'LA COMPROBACIÓN', text: 'Una explicación oral se valora con la misma rúbrica.' },
    ],
    takeaway: 'La explicación relaciona la opción elegida con los datos del caso.',
  },
  {
    title: 'Repasa', icon: RotateCcw, label: 'LECTURA Y NUEVO INTENTO',
    heading: 'Vuelve a lo que necesitas revisar.',
    description: 'Consulta la lectura o su fuente y vuelve a responder. Puedes repetir la actividad para comparar tu razonamiento.',
    panel: 'Qué revisar después de este caso', note: 'Una revisión concreta',
    parts: [
      { label: 'LECTURA', text: 'La diferencia entre el aprendizaje que se evalúa y el formato de respuesta.' },
      { label: 'FUENTE', text: 'Ley General de Educación: artículos 61 y 62.' },
      { label: 'OTRO INTENTO', text: 'Explica qué barrera atiende tu opción y qué criterio conserva.' },
    ],
    takeaway: 'Usa la lectura y el ejemplo cuando todavía tengas dudas.',
  },
];

export default function LearningSteps() {
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % steps.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + steps.length - 1) % steps.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = steps.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus({ preventScroll: true });
  };

  return <section className="method-scroll" aria-labelledby={`${id}-title`}>
    <div className="method-stage">
      <header className="method-heading">
        <p className="method-eyebrow">ESTUDIO PASO A PASO</p>
        <h2 id={`${id}-title`}>Cómo vas a estudiar</h2>
        <p>Lee un caso, responde y revisa la explicación.</p>
      </header>
      <div className="method-tabs" role="tablist" aria-label="Etapas de estudio">
        {steps.map((step, index) => <button
          key={step.title}
          ref={element => { tabs.current[index] = element; }}
          id={`${id}-tab-${index}`}
          type="button"
          role="tab"
          aria-selected={active === index}
          aria-controls={`${id}-panel-${index}`}
          tabIndex={active === index ? 0 : -1}
          onClick={() => setActive(index)}
          onKeyDown={event => onKey(event, index)}
        ><span aria-hidden="true">0{index + 1}</span>{step.title}</button>)}
      </div>
      <div className="method-panels">
        {steps.map((step, index) => <div
          key={step.title}
          className="method-tabpanel"
          role="tabpanel"
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          hidden={active !== index}
          tabIndex={0}
        >
          <div className="method-copy">
            <p className="method-kicker">{step.label}</p>
            <h3>{step.heading}</h3>
            <p>{step.description}</p>
          </div>
          <div className={`method-panel method-panel-${index}`}>
            <div className="method-panel-top"><span>{step.note}</span><step.icon size={24} aria-hidden="true"/></div>
            <h4>{step.panel}</h4>
            <div className="method-example">{step.parts.map(part => <div key={part.label}><span>{part.label}</span><p>{part.text}</p></div>)}</div>
            <p className="method-takeaway"><Check size={18} aria-hidden="true"/>{step.takeaway}</p>
          </div>
        </div>)}
      </div>
      <p className="method-current" aria-live="polite">Etapa {active + 1} de {steps.length}</p>
      {/* Native navigation keeps this no-JavaScript fallback usable on GitHub Pages. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <noscript><p className="method-noscript">Puedes leer el caso completo en la <a href="/cursos/subdireccion-secundaria/leccion-gratuita/">lección gratuita</a>.</p></noscript>
    </div>
  </section>;
}
