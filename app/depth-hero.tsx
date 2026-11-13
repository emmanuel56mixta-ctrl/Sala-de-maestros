'use client';

/* eslint-disable @next/next/no-html-link-for-pages -- These anchors also serve the static GitHub Pages build. */

import { useEffect, useRef } from 'react';
import { preload } from 'react-dom';
import { ArrowRight, BookOpen, Monitor } from 'lucide-react';
import WordReveal from './word-reveal';
import HeroAnnouncement from './hero-announcement';

const STATIC_HERO_QUERY = '(prefers-reduced-motion: reduce), (max-height: 699px)';
const smoothstep = (value: number) => {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
};

// Each path is its own string literal so the Pages build can add its base path.
const portraitSources = [
  ['/assets/identity/docente-hombre-v2-480.webp', '/assets/identity/docente-hombre-v2.webp', 937],
  ['/assets/identity/docente-mujer-v2-480.webp', '/assets/identity/docente-mujer-v2.webp', 939],
].map(([small, large, width]) => `${small} 480w, ${large} ${width}w`);
const portraitSizes = '(max-width: 767px) 45vw, 30vw';

export default function DepthHero() {
  // The portraits are the largest first-screen element: preload the WebP candidates, not the PNG fallback.
  portraitSources.forEach(imageSrcSet => preload(imageSrcSet.split(' ')[0], { as: 'image', type: 'image/webp', imageSrcSet, imageSizes: portraitSizes, fetchPriority: 'high' }));
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLDivElement>(null);
  const choiceHeading = useRef<HTMLParagraphElement>(null);
  const cards = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = root.current;
    const scene = stage.current;
    const title = heading.current;
    const choiceTitle = choiceHeading.current;
    const grid = cards.current;
    if (!section || !scene || !title || !choiceTitle || !grid) return;

    const media = window.matchMedia(STATIC_HERO_QUERY);
    const portraits = Array.from(scene.querySelectorAll<HTMLElement>('.hero-person'));
    const spheres = Array.from(scene.querySelectorAll<HTMLElement>('.hero-sphere'));
    const courseLinks = Array.from(grid.querySelectorAll<HTMLAnchorElement>('a'));
    const topbar = section.querySelector<HTMLElement>('.hero-topbar');
    const actions = scene.querySelector<HTMLElement>('.depth-actions');
    const allCourses = scene.querySelector<HTMLElement>('.hero-all-courses');
    const pitch = scene.querySelector<HTMLElement>('.hero-pitch');
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
        if (pitch) pitch.inert = false;
        const rect = grid.getBoundingClientRect();
        section.dataset.choiceVisible = String(rect.bottom > 0 && rect.top < window.innerHeight && document.visibilityState === 'visible');
        return;
      }

      section.dataset.motion = 'on';
      // Keep keyboard-focused choices visible if the page is scrolled back up.
      const p = grid.contains(document.activeElement) ? 1 : Math.min(1, Math.max(0, -section.getBoundingClientRect().top
        / Math.max(1, section.offsetHeight - scene.offsetHeight)));
      const morph = smoothstep(p / .85);
      const entrance = smoothstep((p - .05) / .75);
      const exit = smoothstep(p / .45);
      section.style.setProperty('--bar-fill', String(smoothstep(p / .4)));
      section.style.setProperty('--headline-y', `${-(title.offsetTop + title.offsetHeight + 80) * exit}px`);
      section.style.setProperty('--cards-y', `${(1 - entrance) * scene.offsetHeight * .82}px`);
      // The value proposition and main action stay readable until the category choice takes over.
      const pitchOpacity = 1 - smoothstep(p / .35);
      section.style.setProperty('--pitch-opacity', String(pitchOpacity));
      if (pitch) pitch.inert = pitchOpacity < .5 && !pitch.contains(document.activeElement);
      section.style.setProperty('--choice-opacity', String(smoothstep((p - .45) / .4)));

      // Center the whole group between its heading and the footer, rather than
      // anchoring the cards to the bottom and leaving tall screens empty above.
      const top = choiceTitle.offsetTop + choiceTitle.offsetHeight + 20;
      // Once the invitation fades, only the catalogue link needs footer space.
      // Interpolate this allowance so the teachers grow into the released room.
      const footerHeight = allCourses?.offsetHeight ?? 44;
      const bottom = footerHeight + Math.max(0, (actions?.offsetHeight ?? footerHeight) - footerHeight) * pitchOpacity + 46;
      const availableHeight = Math.max(0, scene.offsetHeight - top - bottom);
      const portraitHeight = Math.max(0, Math.min(320,
        availableHeight - grid.offsetHeight + 14,
        ...portraits.map((node, index) => Math.min(node.offsetHeight * .58,
          (grid.children[index] as HTMLElement).offsetWidth * .78 * node.offsetHeight / node.offsetWidth))));
      const groupHeight = portraitHeight + grid.offsetHeight - 14;
      const groupTop = top + Math.max(0, (availableHeight - groupHeight) / 2);
      const cardsTop = groupTop + portraitHeight - 14;
      section.style.setProperty('--cards-top', `${cardsTop}px`);

      portraits.forEach((node, index) => {
        const card = grid.children[index] as HTMLElement;
        const scale = portraitHeight / node.offsetHeight;
        const targetX = grid.offsetLeft + card.offsetLeft + card.offsetWidth / 2;
        const x = targetX - node.offsetLeft;
        const y = cardsTop + 14 - scene.offsetHeight;
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
      section.dataset.choiceVisible = String(p > .8 && sceneRect.bottom > 80 && sceneRect.top < window.innerHeight && document.visibilityState === 'visible');
      const visibleTop = Math.max(sceneRect.top, 0) + (topbar?.offsetHeight ?? 64);
      const visibleBottom = Math.min(sceneRect.bottom, window.innerHeight);
      grid.inert = !grid.contains(document.activeElement) && !courseLinks.every(link => {
        const rect = link.getBoundingClientRect();
        return rect.top >= visibleTop && rect.bottom <= visibleBottom - 8;
      });
    };

    const schedule = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(update);
    };

    const onPageHide = () => {
      section.dataset.choiceVisible = 'false';
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const onPageShow = () => {
      update();
      schedule();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') section.dataset.choiceVisible = 'false';
      else schedule();
    };
    const resize = new ResizeObserver(schedule);
    [section, scene, grid, choiceTitle, ...(actions ? [actions] : [])].forEach(node => resize.observe(node));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('pageshow', onPageShow);
    document.addEventListener('visibilitychange', onVisibilityChange);
    grid.addEventListener('focusin', schedule);
    grid.addEventListener('focusout', schedule);
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
      document.removeEventListener('visibilitychange', onVisibilityChange);
      grid.removeEventListener('focusin', schedule);
      grid.removeEventListener('focusout', schedule);
      media.removeEventListener('change', schedule);
    };
  }, []);

  return <section ref={root} className="depth-hero" aria-labelledby="landing-title">
    <noscript><style>{`.depth-hero{height:auto!important;--bar-fill:1!important}.depth-stage{position:relative!important;height:auto!important;padding-top:80px}.depth-heading{position:relative!important;top:auto!important;transform:none!important}.hero-choice-heading{position:relative!important;top:auto!important;opacity:1!important;margin:24px 0 0!important}.hero-people{position:relative!important;inset:auto!important;display:flex;justify-content:center;align-items:flex-end;gap:12px;margin-top:20px}.hero-person{position:relative!important;bottom:auto!important;left:auto!important;width:min(44%,300px)!important;height:auto!important;margin:0!important;transform:none!important}.hero-sphere{display:none!important}.hero-pitch{opacity:1!important}.hero-feature-cards{position:relative!important;left:auto!important;right:auto!important;bottom:auto!important;transform:none!important;visibility:visible!important;margin-bottom:24px}.depth-actions{position:relative!important;bottom:auto!important;justify-content:flex-end!important;padding-bottom:24px}`}</style></noscript>
    <header className="hero-topbar">
      <a className="hero-home-wordmark" href="/" aria-label="Sala de Maestros, inicio"><span>SALA DE</span> <span>MAESTROS</span></a>
      <nav className="public-account-nav" aria-label="Navegación principal">
        <a href="/cursos/">Cursos</a>
        <a className="public-account-link" href="/signin-with-chatgpt?return_to=%2Fasesor" title="Abre el inicio de sesión del asesor con tu cuenta de ChatGPT">Ya tengo cuenta</a>
      </nav>
    </header>
    <div ref={stage} className="depth-stage">
      <div ref={heading} className="depth-heading"><h1 id="landing-title"><WordReveal text="SALA DE"/><br/><WordReveal text="MAESTROS" start={2}/></h1></div>
      <p ref={choiceHeading} className="hero-choice-heading">Elige qué quieres estudiar</p>
      <div className="hero-sphere hero-sphere-one" aria-hidden="true"/>
      <div className="hero-sphere hero-sphere-two" aria-hidden="true"/>
      <div className="hero-people" aria-hidden="true">
        {/* These transparent portraits are shared unchanged with the static Pages build. */}
        <div className="hero-person hero-person-0"><picture><source type="image/webp" srcSet={portraitSources[0]} sizes={portraitSizes}/><img src="/assets/identity/docente-hombre-v2.png" width={937} height={1678} alt="" fetchPriority="high"/></picture></div>
        <div className="hero-person hero-person-1"><picture><source type="image/webp" srcSet={portraitSources[1]} sizes={portraitSizes}/><img src="/assets/identity/docente-mujer-v2.png" width={939} height={1674} alt="" fetchPriority="high"/></picture></div>
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
        <HeroAnnouncement />
        <a className="hero-all-courses" href="/cursos/">Ver todos los cursos<ArrowRight size={18} aria-hidden="true"/></a>
      </div>
    </div>
  </section>;
}
