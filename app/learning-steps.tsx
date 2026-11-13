/* eslint-disable @next/next/no-html-link-for-pages -- Shared by Worker and static Pages. */

import { ArrowRight, BookOpen, Lightbulb, ListChecks, Undo2 } from 'lucide-react';

const steps = [
  { title: 'Lee', icon: BookOpen, description: 'Conoce el criterio y las pistas de una situación escolar.' },
  { title: 'Responde', icon: ListChecks, description: 'Compara las opciones y decide antes de consultar la explicación.' },
  { title: 'Revisa', icon: Lightbulb, description: 'Descubre por qué una opción funciona y aprende de tu respuesta.' },
] as const;

export default function LearningSteps() {
  return <section className="method-scroll" aria-labelledby="method-title">
    <div className="method-stage">
      <header className="method-heading">
        <p className="method-eyebrow">ESTUDIO PASO A PASO</p>
        <h2 id="method-title">Cómo vas a estudiar</h2>
        <p>Una ruta para aprender con casos.</p>
      </header>
      <div className="method-diagram">
        <ol className="method-flow" role="list" aria-label="Metodología de estudio">
          {steps.map((step, index) => <li className="method-step" key={step.title}>
            <div className="method-node" aria-hidden="true">
              <span className="method-number">0{index + 1}</span>
              <step.icon size={50} strokeWidth={1.5} />
            </div>
            <div className="method-copy"><h3>{step.title}</h3><p>{step.description}</p></div>
            {index < steps.length - 1 && <span className="method-connector" aria-hidden="true"><ArrowRight size={20} /><i /></span>}
          </li>)}
        </ol>
        <div className="method-return">
          <svg className="method-return-path" viewBox="0 0 100 52" preserveAspectRatio="none" aria-hidden="true"><path d="M99 1V25Q99 43 94 43H6Q1 43 1 25V1" /></svg>
          <span><Undo2 size={18} aria-hidden="true" />Aplica lo aprendido en otro caso.</span>
        </div>
      </div>
      <div className="method-footer"><a className="primary" href="/cursos/subdireccion-secundaria/leccion-gratuita/">Probar la lección gratuita<ArrowRight size={18} aria-hidden="true" /></a></div>
    </div>
  </section>;
}
