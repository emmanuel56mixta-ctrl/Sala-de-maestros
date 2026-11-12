'use client';

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, List, Pause, Play, RotateCcw } from 'lucide-react';
import type { CaseAnalysisPlan } from '@/lib/case-analysis';
import './case-analysis.css';

const MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const ARRIVAL_MS = 700;
const LINE_TRAVEL = 76;
type Box = { left: number; top: number; width: number; height: number };
type Point = { x: number; y: number };
type Playback = { index: number; elapsed: number; mode: 'playing' | 'paused' | 'all' | 'complete' };
type Geometry = { width: number; steps: Box[][] };

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const ease = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };
const durationFor = (text: string) => Math.min(8000, Math.max(5200, text.length * 25 + 1400));
const rowPoint = (box: Box, progress = 0): Point => ({ x: box.left + box.width * progress, y: box.top + box.height * .64 });

function subscribeMotion(onChange: () => void) {
  const media = window.matchMedia(MOTION_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}
function subscribePageVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
}
const motionSnapshot = () => window.matchMedia(MOTION_QUERY).matches;
const pageSnapshot = () => document.visibilityState !== 'hidden';

/** Merge overlapping quotations into one persistent underline per text interval. */
function mergeBoxes(boxes: Box[]) {
  const merged: Box[] = [];
  for (const box of [...boxes].sort((a, b) => a.top - b.top || a.left - b.left)) {
    const previous = merged[merged.length - 1];
    if (previous && Math.abs(previous.top - box.top) < 2 && Math.abs(previous.height - box.height) < 2
      && box.left <= previous.left + previous.width + 2) {
      previous.width = Math.max(previous.left + previous.width, box.left + box.width) - previous.left;
    } else merged.push({ ...box });
  }
  return merged;
}

/** Follow actual rendered lines, including a short diagonal drag between lines. */
function dragAlongLines(boxes: Box[], progress: number): { boxes: Box[]; cursor: Point | null } {
  if (!boxes.length) return { boxes: [], cursor: null };
  const total = boxes.reduce((sum, box) => sum + box.width, 0) + (boxes.length - 1) * LINE_TRAVEL;
  let distance = clamp(progress) * total;
  const selected: Box[] = [];
  for (let index = 0; index < boxes.length; index += 1) {
    const box = boxes[index];
    if (distance <= box.width) {
      const width = Math.max(0, distance);
      if (width > 0) selected.push({ ...box, width });
      return { boxes: selected, cursor: rowPoint(box, width / box.width) };
    }
    selected.push(box);
    distance -= box.width;
    const next = boxes[index + 1];
    if (next) {
      if (distance <= LINE_TRAVEL) {
        const from = rowPoint(box, 1);
        const to = rowPoint(next);
        const t = ease(distance / LINE_TRAVEL);
        return { boxes: selected, cursor: { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t } };
      }
      distance -= LINE_TRAVEL;
    }
  }
  return { boxes, cursor: rowPoint(boxes[boxes.length - 1], 1) };
}

function approach(from: Point, to: Point, progress: number): Point {
  const t = ease(progress);
  const control = { x: (from.x + to.x) / 2 + 18, y: Math.min(from.y, to.y) - 28 };
  return {
    x: (1 - t) ** 2 * from.x + 2 * (1 - t) * t * control.x + t ** 2 * to.x,
    y: (1 - t) ** 2 * from.y + 2 * (1 - t) * t * control.y + t ** 2 * to.y,
  };
}

export default function CaseAnalysis({ plan }: { plan: CaseAnalysisPlan }) {
  return <CaseAnalysisSession key={plan.id} plan={plan} />;
}

function CaseAnalysisSession({ plan }: { plan: CaseAnalysisPlan }) {
  const headingId = useId();
  const readingTitleId = useId();
  const explanationTitleId = useId();
  const statusId = useId();
  const root = useRef<HTMLElement>(null);
  const reading = useRef<HTMLDivElement>(null);
  const toolbar = useRef<HTMLDivElement>(null);
  const paragraphSpans = useRef(new Map<string, HTMLSpanElement>());
  const [geometry, setGeometry] = useState<Geometry>({ width: 0, steps: [] });
  const [visibleParagraph, setVisibleParagraph] = useState<string | null>(null);
  const [playback, setPlayback] = useState<Playback>({ index: 0, elapsed: 0, mode: 'playing' });
  const reducedMotion = useSyncExternalStore(subscribeMotion, motionSnapshot, () => false);
  const pageVisible = useSyncExternalStore(subscribePageVisibility, pageSnapshot, () => true);
  const durations = useMemo(() => plan.steps.map(step => durationFor(step.explanation)), [plan.steps]);
  const letters = useMemo(() => plan.steps.map(step => Array.from(step.explanation)), [plan.steps]);
  const lastIndex = Math.max(0, plan.steps.length - 1);
  const activeIndex = Math.min(playback.index, lastIndex);
  const activeStep = plan.steps[activeIndex];
  const activeDuration = durations[activeIndex] || 5200;
  const showAll = reducedMotion || playback.mode === 'all' || playback.mode === 'complete';
  const automaticallyPaused = visibleParagraph !== activeStep?.paragraphId || !pageVisible;
  const canAnimate = playback.mode === 'playing' && !reducedMotion && !automaticallyPaused
    && Boolean(activeStep) && Boolean(geometry.steps[activeIndex]?.length);

  useEffect(() => {
    const paragraphId = activeStep?.paragraphId;
    const target = paragraphId ? paragraphSpans.current.get(paragraphId) : null;
    if (!target || !paragraphId) return;
    // A visible heading is not enough: wait until the paragraph being explained
    // can actually be read, including after changing to another part of the case.
    let observer: IntersectionObserver | undefined;
    const observe = () => {
      observer?.disconnect();
      const controls = toolbar.current;
      const coveredTop = Math.ceil((controls && getComputedStyle(controls).position === 'sticky' ? controls.offsetHeight : 0) + 12);
      observer = new IntersectionObserver(([entry]) => setVisibleParagraph(entry.isIntersecting && entry.intersectionRatio >= .6 ? paragraphId : null), {
        threshold: [0, .6], rootMargin: `-${coveredTop}px 0px -12px 0px`,
      });
      observer.observe(target);
    };
    const resize = new ResizeObserver(observe);
    if (toolbar.current) resize.observe(toolbar.current);
    observe();
    return () => { observer?.disconnect(); resize.disconnect(); };
  }, [activeStep?.paragraphId]);

  useEffect(() => {
    const pauseForSelection = () => {
      const selection = document.getSelection();
      if (!selection?.anchorNode || selection.isCollapsed || !root.current?.contains(selection.anchorNode)) return;
      // Keep a real selection intact; the animated cursor never changes it.
      setPlayback(current => current.mode === 'playing' ? { ...current, mode: 'paused' } : current);
    };
    document.addEventListener('selectionchange', pauseForSelection);
    return () => document.removeEventListener('selectionchange', pauseForSelection);
  }, []);

  useEffect(() => {
    const container = reading.current;
    if (!container) return;
    let frame = 0;
    let disposed = false;
    const measure = () => {
      frame = 0;
      if (disposed) return;
      const bounds = container.getBoundingClientRect();
      const left = bounds.left + container.clientLeft;
      const top = bounds.top + container.clientTop;
      const steps = plan.steps.map(step => {
        const span = paragraphSpans.current.get(step.paragraphId);
        const text = span?.firstChild;
        const start = span?.textContent?.indexOf(step.quote) ?? -1;
        if (!text || text.nodeType !== Node.TEXT_NODE || start < 0 || !step.quote) return [];
        const range = document.createRange();
        range.setStart(text, start);
        range.setEnd(text, start + step.quote.length);
        return Array.from(range.getClientRects())
          .filter(rect => rect.width > .5 && rect.height > .5)
          .map(rect => ({ left: rect.left - left, top: rect.top - top, width: rect.width, height: rect.height }));
      });
      setGeometry({ width: container.clientWidth, steps });
    };
    const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(measure); };
    const resize = new ResizeObserver(schedule);
    resize.observe(container);
    window.addEventListener('resize', schedule);
    document.fonts.addEventListener('loadingdone', schedule);
    void document.fonts.ready.then(schedule);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('resize', schedule);
      document.fonts.removeEventListener('loadingdone', schedule);
    };
  }, [plan]);

  useEffect(() => {
    if (!canAnimate) return;
    let frame = 0;
    let previousTime: number | undefined;
    const tick = (time: number) => {
      const delta = previousTime === undefined ? 0 : Math.min(80, time - previousTime);
      previousTime = time;
      setPlayback(current => {
        if (current.mode !== 'playing') return current;
        const duration = durations[current.index] || 5200;
        const elapsed = current.elapsed + delta;
        if (elapsed < duration) return { ...current, elapsed };
        if (current.index >= lastIndex) return { ...current, elapsed: duration, mode: 'complete' };
        return { index: current.index + 1, elapsed: 0, mode: 'playing' };
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [canAnimate, durations, lastIndex]);

  const activeBoxes = geometry.steps[activeIndex] || [];
  const dragProgress = clamp((playback.elapsed - ARRIVAL_MS) / Math.max(1, activeDuration - ARRIVAL_MS - 900));
  const drag = dragAlongLines(activeBoxes, dragProgress);
  const completedBoxes = mergeBoxes(showAll ? geometry.steps.flat() : geometry.steps.slice(0, activeIndex).flat());
  const previousBoxes = geometry.steps[activeIndex - 1] || [];
  const cursorFrom = previousBoxes.length ? rowPoint(previousBoxes[previousBoxes.length - 1], 1) : { x: Math.max(24, geometry.width - 56), y: 26 };
  const cursor = !showAll && activeBoxes.length
    ? playback.elapsed < ARRIVAL_MS
      ? approach(cursorFrom, rowPoint(activeBoxes[0]), playback.elapsed / ARRIVAL_MS)
      : drag.cursor
    : null;
  const typedProgress = clamp((playback.elapsed - ARRIVAL_MS) / Math.max(1, activeDuration - ARRIVAL_MS - 600));
  const visibleText = activeStep ? letters[activeIndex].slice(0, Math.floor(letters[activeIndex].length * typedProgress)).join('') : '';
  const stepStatus = showAll ? 'Análisis completo' : `${playback.mode === 'paused' || automaticallyPaused ? 'En pausa · ' : ''}Paso ${activeIndex + 1} de ${plan.steps.length}`;

  const visitStep = (index: number) => {
    const next = Math.max(0, Math.min(lastIndex, index));
    setPlayback({ index: next, elapsed: durations[next] || 5200, mode: 'paused' });
  };
  const togglePlayback = () => {
    setPlayback(current => {
      if (current.mode === 'playing') return { ...current, mode: 'paused' };
      if (current.mode !== 'paused') return current;
      if (current.elapsed >= (durations[current.index] || 5200)) {
        return current.index < lastIndex
          ? { index: current.index + 1, elapsed: 0, mode: 'playing' }
          : { ...current, mode: 'complete' };
      }
      return { ...current, mode: 'playing' };
    });
  };

  return <section ref={root} className="case-analysis" aria-labelledby={headingId}>
    <header className="case-analysis-heading">
      <div><p className="case-analysis-kicker">ANÁLISIS DEL CASO</p><h3 id={headingId}>{plan.title}</h3><p>Sigue el fragmento señalado y su explicación.</p></div>
      <p className="case-analysis-status" id={statusId} role="status" aria-live="polite" aria-atomic="true">{stepStatus}</p>
    </header>
    <div ref={toolbar} className="case-analysis-toolbar">
      <ol className="case-analysis-steps" aria-label="Pasos del análisis">
        {plan.steps.map((step, index) => <li key={step.id}>
          <button type="button" onClick={() => visitStep(index)} aria-label={`Paso ${index + 1}: ${step.title}`} aria-current={!showAll && index === activeIndex ? 'step' : undefined} data-complete={showAll || index < activeIndex || undefined} disabled={reducedMotion}>
            <span aria-hidden="true">{index + 1}</span>
          </button>
        </li>)}
      </ol>
      <div className="case-analysis-controls" role="group" aria-label="Controles del análisis">
        <button type="button" className="case-analysis-play" onClick={togglePlayback} disabled={reducedMotion || showAll} aria-describedby={statusId}>
          {playback.mode === 'playing' && !showAll ? <Pause size={16} aria-hidden="true"/> : <Play size={16} aria-hidden="true"/>}
          {playback.mode === 'playing' && !showAll ? 'Pausar' : 'Continuar'}
        </button>
        <button type="button" onClick={() => visitStep(activeIndex - 1)} disabled={reducedMotion || activeIndex === 0}><ArrowLeft size={16} aria-hidden="true"/>Anterior</button>
        <button type="button" onClick={() => visitStep(activeIndex + 1)} disabled={reducedMotion || activeIndex === lastIndex}>Siguiente<ArrowRight size={16} aria-hidden="true"/></button>
        <button type="button" onClick={() => setPlayback({ index: lastIndex, elapsed: durations[lastIndex] || 5200, mode: 'all' })} disabled={showAll}><List size={16} aria-hidden="true"/>Ver todo</button>
        <button type="button" onClick={() => setPlayback({ index: 0, elapsed: 0, mode: 'playing' })} disabled={reducedMotion}><RotateCcw size={16} aria-hidden="true"/>Repetir</button>
      </div>
    </div>
    <div className="case-analysis-grid">
      <div ref={reading} className="case-analysis-reading" role="region" aria-labelledby={readingTitleId}>
        <h4 id={readingTitleId}>El caso</h4>
        {plan.paragraphs.map(paragraph => <p key={paragraph.id} className="case-analysis-paragraph"><span ref={node => { if (node) paragraphSpans.current.set(paragraph.id, node); else paragraphSpans.current.delete(paragraph.id); }}>{paragraph.text}</span></p>)}
        <div className="case-analysis-overlays" aria-hidden="true">
          {completedBoxes.map((box, index) => <span className="case-analysis-underline" key={`done-${index}`} style={box}/>)}
          {!showAll && drag.boxes.map((box, index) => <span className="case-analysis-selection" key={`selection-${index}`} style={box}/>)}
          {cursor && <svg className="case-analysis-cursor" width="34" height="42" viewBox="-10 -10 46 58" style={{ transform: `translate3d(${cursor.x}px,${cursor.y}px,0)` }} focusable="false">
            {playback.elapsed >= ARRIVAL_MS && dragProgress < 1 && <circle className="case-analysis-press" cx="0" cy="0" r="9"/>}
            <path d="M0 0L1 31L9 23L16 38L23 34L16 20L29 19Z"/>
          </svg>}
        </div>
      </div>
      <div className="case-analysis-explanations" role="region" aria-labelledby={explanationTitleId}>
        <h4 className="case-analysis-column-title" id={explanationTitleId}>Por qué importa</h4>
        {(showAll ? plan.steps : activeStep ? [activeStep] : []).map(step => {
          const index = plan.steps.indexOf(step);
          return <article className="case-analysis-step" key={step.id} data-active={!showAll || undefined}>
            <span className="case-analysis-step-number">{String(index + 1).padStart(2, '0')}</span>
            <h5>{step.title}</h5>
            <blockquote>{step.quote}</blockquote>
            <p className="case-analysis-explanation">
              {showAll ? step.explanation : <><span aria-hidden="true">{visibleText}{typedProgress < 1 && <span className="case-analysis-type-caret"/>}</span><span className="case-analysis-sr-only">{step.explanation}</span></>}
            </p>
          </article>;
        })}
      </div>
    </div>
    {!showAll && <details className="case-analysis-transcript" onToggle={event => {
      if (event.currentTarget.open) setPlayback(current => current.mode === 'playing' ? { ...current, mode: 'paused' } : current);
    }}>
      <summary>Leer el análisis completo</summary>
      <ol>{plan.steps.map(step => <li key={step.id}><h4>{step.title}</h4><p>{step.explanation}</p></li>)}</ol>
      <p>{plan.takeaway}</p>
    </details>}
    {showAll && <aside className="case-analysis-takeaway"><h4>Qué puedes llevarte de este caso</h4><p>{plan.takeaway}</p></aside>}
    <footer className="case-analysis-source">
      <span>FUENTE DE CONSULTA</span>
      <a href={plan.source.url} target="_blank" rel="noreferrer">{plan.source.title}<ExternalLink size={14} aria-hidden="true"/><span className="case-analysis-sr-only"> (abre en otra pestaña)</span></a>
      <p>{plan.source.reference}</p>
    </footer>
  </section>;
}
