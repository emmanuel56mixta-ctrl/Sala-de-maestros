'use client';

import { useId, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import type { AnalysisStep, CaseAnalysisPlan } from '@/lib/case-analysis';
import './case-analysis.css';

export default function CaseAnalysis({ plan }: { plan: CaseAnalysisPlan }) {
  return <CaseAnalysisSession key={plan.id} plan={plan} />;
}

function EvidenceAndExplanation({ step, number, animate = false }: { step: AnalysisStep; number: number; animate?: boolean }) {
  return <div className={`case-analysis-step${animate ? ' lesson-motion-analysis-step' : ''}`}>
    <h4><span className="case-analysis-step-number">{String(number).padStart(2, '0')}</span>{step.title}</h4>
    <div className="case-analysis-grid">
      <blockquote className="case-analysis-quote">
        <span className="case-analysis-label">Fragmento del caso</span>
        <p>{step.quote}</p>
      </blockquote>
      <div className="case-analysis-explanation">
        <span className="case-analysis-label">Por qué importa</span>
        <p>{step.explanation}</p>
      </div>
    </div>
  </div>;
}

function CaseAnalysisSession({ plan }: { plan: CaseAnalysisPlan }) {
  const headingId = useId();
  const contentId = useId();
  const [index, setIndex] = useState(0);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const activeStep = plan.steps[index];
  const lastIndex = plan.steps.length - 1;

  if (!activeStep) return null;

  const visitStep = (next: number) => {
    setIndex(Math.max(0, Math.min(lastIndex, next)));
    setHasNavigated(true);
  };

  return <section className="case-analysis" aria-labelledby={headingId}>
    <header className="case-analysis-heading">
      <h3 id={headingId}>{plan.title}</h3>
      <p>Relaciona cada fragmento con la decisión. Avanza a tu ritmo.</p>
    </header>
    <div className="case-analysis-toolbar">
      <p className="case-analysis-status" role="status" aria-live="polite" aria-atomic="true">
        {completeOpen ? 'Análisis completo' : <>Paso {index + 1} de {plan.steps.length}<span className="case-analysis-sr-only">. {activeStep.title}</span></>}
      </p>
      {!completeOpen && <div className="case-analysis-controls" role="group" aria-label="Pasos del análisis">
        <button type="button" aria-controls={contentId} onClick={() => visitStep(index - 1)} disabled={index === 0}>
          <ArrowLeft size={18} aria-hidden="true" />Anterior
        </button>
        <button type="button" aria-controls={contentId} onClick={() => visitStep(index + 1)} disabled={index === lastIndex}>
          Siguiente<ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>}
    </div>
    <div id={contentId}>
      <details className="case-analysis-transcript" onToggle={event => setCompleteOpen(event.currentTarget.open)}>
        <summary>{completeOpen ? 'Volver al análisis por pasos' : 'Leer el análisis completo'}</summary>
        <ol>{plan.steps.map((step, stepIndex) => <li key={step.id}><EvidenceAndExplanation step={step} number={stepIndex + 1} /></li>)}</ol>
      </details>
      {!completeOpen && <EvidenceAndExplanation key={activeStep.id} step={activeStep} number={index + 1} animate={hasNavigated} />}
    </div>
    <footer className="case-analysis-source">
      <span>Fuente de este análisis</span>
      <a href={plan.source.url} target="_blank" rel="noreferrer">{plan.source.title}<ExternalLink size={15} aria-hidden="true" /><span className="case-analysis-sr-only"> (abre en otra pestaña)</span></a>
      <p>{plan.source.reference}</p>
    </footer>
    <aside className="case-analysis-takeaway">
      <h4>Un criterio para otra decisión</h4>
      <p>{plan.takeaway}</p>
    </aside>
  </section>;
}
