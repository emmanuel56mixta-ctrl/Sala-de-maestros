'use client';

/* eslint-disable @next/next/no-html-link-for-pages -- These anchors also serve the static GitHub Pages build. */

import { useEffect, useRef } from 'react';
import { ArrowRight, ArrowDown, BookOpen, Monitor } from 'lucide-react';
import WordReveal from './word-reveal';

const STATIC_HERO_QUERY = '(prefers-reduced-motion: reduce), (max-height: 599px)';
const smoothstep = (value: number) => {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
};

export default function DepthHero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = root.current;
    const scene = stage.current;
    const title = heading.current;
    const grid = cards.current;
    if (!section || !scene || !title || !grid) return;

    const media = window.matchMedia(STATIC_HERO_QUERY);
    const portraits = Array.from(scene.querySelectorAll<HTMLElement>('.hero-person'));
    const spheres = Array.from(scene.querySelectorAll<HTMLElement>('.hero-sphere'));
    const courseLinks = Array.from(grid.querySelectorAll<HTMLAnchorElement>('a'));
    let frame = 0;
    let disposed = false;

    const update = () => {
      frame = 0;
      if (disposed) return;
      if (media.matches) {
        section.removeAttribute('data-motion');
        section.removeAttribute('style');
        portraits.forEach(node => node.removeAttribute('style'));
        spheres.forEach(node => node.removeAttribute('style'));
        grid.inert = false;
        return;
      }

      section.dataset.motion = 'on';
      const p = Math.min(1, Math.max(0, -section.getBoundingClientRect().top
        / Math.max(1, section.offsetHeight - scene.offsetHeight)));
      const morph = smoothstep((p - .12) / .68);
      const entrance = smoothstep((p - .28) / .42);
      const exit = smoothstep((p - .025) / .42);
      section.style.setProperty('--bar-fill', String(smoothstep(p / .4)));
      section.style.setProperty('--headline-y', `${-(title.offsetTop + title.offsetHeight + 80) * exit}px`);
      section.style.setProperty('--cards-y', `${(1 - entrance) * scene.offsetHeight * .82}px`);
      section.style.setProperty('--scroll-cue-opacity', String(1 - smoothstep(p / .12)));

      portraits.forEach((node, index) => {
        const card = grid.children[index] as HTMLElement;
        const scale = Math.min(.44, card.offsetWidth * .78 / node.offsetWidth,
          scene.offsetHeight * .30 / node.offsetHeight);
        const targetX = grid.offsetLeft + card.offsetLeft + card.offsetWidth / 2;
        const x = targetX - node.offsetLeft;
        const y = grid.offsetTop + 14 - scene.offsetHeight;
        node.style.setProperty('--person-x', `${x * morph}px`);
        node.style.setProperty('--person-y', `${y * morph}px`);
        node.style.setProperty('--person-scale', String(1 + (scale - 1) * morph));
      });
      spheres.forEach((node, index) => {
        const card = grid.children[index] as HTMLElement;
        const targetX = grid.offsetLeft + card.offsetLeft + card.offsetWidth * (index === 0 ? .75 : .25);
        const targetY = grid.offsetTop - 42;
        node.style.transform = `translate3d(${(targetX - node.offsetLeft - node.offsetWidth / 2) * morph}px,${(targetY - node.offsetTop - node.offsetHeight / 2) * morph}px,0) scale(${1 - .64 * morph})`;
      });

      // Transformed cards must not receive focus while clipped outside the scene.
      const sceneRect = scene.getBoundingClientRect();
      const visibleTop = Math.max(sceneRect.top, 0) + 64;
      const visibleBottom = Math.min(sceneRect.bottom, window.innerHeight);
      grid.inert = !courseLinks.every(link => {
        const rect = link.getBoundingClientRect();
        return rect.top >= visibleTop && rect.bottom <= visibleBottom - 8;
      });
    };

    const schedule = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(update);
    };

    const onPageHide = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const onPageShow = () => {
      update();
      schedule();
    };
    const resize = new ResizeObserver(schedule);
    [section, scene, grid].forEach(node => resize.observe(node));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('pageshow', onPageShow);
    media.addEventListener('change', schedule);
    void document.fonts.ready.then(schedule);
    update();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('pageshow', onPageShow);
      media.removeEventListener('change', schedule);
    };
  }, []);

  return <section ref={root} className="depth-hero" aria-labelledby="landing-title">
    <noscript><style>{`.depth-hero{height:auto!important;--bar-fill:1!important}.depth-stage{position:relative!important;height:auto!important;padding-top:80px}.depth-heading{position:relative!important;top:auto!important;transform:none!important}.hero-people{position:relative!important;inset:auto!important;display:flex;justify-content:center;align-items:flex-end;gap:12px;margin-top:20px}.hero-person{position:relative!important;bottom:auto!important;left:auto!important;width:min(44%,300px)!important;height:auto!important;margin:0!important;transform:none!important}.hero-sphere,.hero-scroll-cue{display:none!important}.hero-feature-cards{position:relative!important;left:auto!important;right:auto!important;bottom:auto!important;transform:none!important;visibility:visible!important;margin-bottom:24px}.depth-actions{position:relative!important;bottom:auto!important;justify-content:flex-end!important;padding-bottom:24px}`}</style></noscript>
    <header className="hero-topbar"><a href="/" aria-label="Sala de Maestros, inicio">SALA DE MAESTROS</a><span>UN ESPACIO PROPIO</span></header>
    <div ref={stage} className="depth-stage">
      <div ref={heading} className="depth-heading"><h1 id="landing-title"><WordReveal text="SALA DE"/><br/><WordReveal text="MAESTROS" start={2}/></h1></div>
      <div className="hero-sphere hero-sphere-one" aria-hidden="true"/>
      <div className="hero-sphere hero-sphere-two" aria-hidden="true"/>
      <div className="hero-people" aria-hidden="true">
        {/* These transparent portraits are shared unchanged with the static Pages build. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="hero-person hero-person-0"><img src="/assets/identity/docente-hombre-v2.png" width={937} height={1678} alt="" fetchPriority="high"/></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="hero-person hero-person-1"><img src="/assets/identity/docente-mujer-v2.png" width={939} height={1674} alt="" fetchPriority="high"/></div>
      </div>
      <div ref={cards} className="hero-feature-cards">
        <article>
          <span><BookOpen size={19} aria-hidden="true"/>01 · PROMOCIÓN</span>
          <h2>Promoción docente</h2>
          <p>Preparación para funciones directivas en secundaria y primaria.</p>
          <a className="hero-course-link" href="/cursos/promocion-docente/">
            Ver cursos de promoción<ArrowRight size={18} aria-hidden="true"/>
          </a>
        </article>
        <article>
          <span><Monitor size={19} aria-hidden="true"/>02 · HERRAMIENTAS</span>
          <h2>Herramientas digitales e IA</h2>
          <p>Recursos y actividades para tu práctica docente.</p>
          <a className="hero-course-link" href="/cursos/herramientas-digitales/">
            Ver cursos digitales<ArrowRight size={18} aria-hidden="true"/>
          </a>
        </article>
      </div>
      <div className="depth-actions">
        <span className="hero-scroll-cue"><ArrowDown size={17} aria-hidden="true"/>Desplázate</span>
        <a className="hero-all-courses" href="/cursos/">Ver todos los cursos<ArrowRight size={18} aria-hidden="true"/></a>
      </div>
    </div>
  </section>;
}
