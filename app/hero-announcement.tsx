'use client';

/* eslint-disable @next/next/no-html-link-for-pages -- Native links also serve Pages. */
import { useCallback, useEffect, useRef } from 'react';
import { ArrowRight, BookOpen, Clock3, X } from 'lucide-react';
import './hero-announcement.css';

const SEEN_KEY = 'sala-lesson-announcement-v1';

export default function HeroAnnouncement() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLAnchorElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const previousOverflow = useRef<string | null>(null);

  const unlockScroll = useCallback(() => {
    if (previousOverflow.current === null) return;
    document.documentElement.style.overflow = previousOverflow.current;
    previousOverflow.current = null;
  }, []);

  const openAnnouncement = useCallback(() => {
    const node = dialog.current;
    if (!node || typeof node.showModal !== 'function') return false;
    if (node.open) return true;
    node.showModal();
    previousOverflow.current = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    title.current?.focus({ preventScroll: true });
    // Storage is optional. A blocked storage API never blocks the lesson.
    try { sessionStorage.setItem(SEEN_KEY, 'seen'); } catch { /* Current visit still works. */ }
    return true;
  }, []);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const restoreFocus = () => {
      unlockScroll();
      const anchor = trigger.current;
      const rect = anchor?.getBoundingClientRect();
      if (anchor && !anchor.closest('[inert]') && rect && rect.top >= 0 && rect.bottom <= window.innerHeight) {
        anchor.focus({ preventScroll: true });
      } else {
        document.querySelector<HTMLAnchorElement>('.hero-topbar a[href$="/cursos/"]')?.focus({ preventScroll: true });
      }
    };
    const onPageHide = () => {
      if (node.open) node.close();
      unlockScroll();
    };
    node.addEventListener('close', restoreFocus);
    window.addEventListener('pagehide', onPageHide);
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === 'seen'; } catch { /* Use a dismissible first visit. */ }
    // Do not interrupt someone returning to a scrolled position in the page.
    if (!seen && window.scrollY < 80) openAnnouncement();
    return () => {
      node.removeEventListener('close', restoreFocus);
      window.removeEventListener('pagehide', onPageHide);
      if (node.open) node.close();
      unlockScroll();
    };
  }, [openAnnouncement, unlockScroll]);

  return <>
    <div className="hero-pitch hero-pitch-invitation">
      <span className="hero-invitation-label"><BookOpen size={16} aria-hidden="true" />TU PRIMERA LECCIÓN</span>
      <a ref={trigger} className="hero-pitch-cta" href="/cursos/subdireccion-secundaria/leccion-gratuita/" onClick={event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        if (openAnnouncement()) event.preventDefault();
      }}>Probar una lección gratuita<ArrowRight size={18} aria-hidden="true" /></a>
      <span className="hero-invitation-note">15–20 min · Sin registro</span>
    </div>
    <dialog ref={dialog} className="hero-announcement" aria-labelledby="hero-announcement-title" aria-describedby="hero-announcement-description" onClick={event => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.currentTarget.close();
    }}>
      <button className="hero-announcement-close" type="button" aria-label="Cerrar anuncio" onClick={() => dialog.current?.close()}><X size={20} aria-hidden="true" /></button>
      <div className="hero-announcement-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/learning/anuncio-leccion-docentes-v1.webp" alt="Dos docentes comparten una sesión de estudio con una computadora y un cuaderno." width={1536} height={1024} decoding="async" />
      </div>
      <div className="hero-announcement-copy">
        <p className="hero-announcement-badge"><BookOpen size={15} aria-hidden="true" />LECCIÓN GRATUITA</p>
        <h2 id="hero-announcement-title" ref={title} tabIndex={-1}>Prepárate con<br />casos reales.</h2>
        <p id="hero-announcement-description">Resuelve una situación escolar y descubre qué hace sólida una respuesta.</p>
        <a className="primary hero-announcement-cta" href="/cursos/subdireccion-secundaria/leccion-gratuita/">Probar una lección gratuita<ArrowRight size={18} aria-hidden="true" /></a>
        <p className="hero-announcement-meta"><Clock3 size={15} aria-hidden="true" />15–20 min estimados · Sin registro</p>
        <span className="hero-announcement-course">Subdirección de secundaria</span>
        <small className="hero-announcement-credit">Imagen ilustrativa generada con IA.</small>
      </div>
    </dialog>
  </>;
}
