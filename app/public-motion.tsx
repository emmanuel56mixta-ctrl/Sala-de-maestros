'use client';

import { useEffect } from 'react';

// These are independent public blocks. The scroll-driven hero, shared portraits,
// category arrival and lesson reading manage their own presentation.
const entranceTargets = [
  '.learning-photo-media',
  '.welcome-copy',
  '.method-heading',
  '.method-flow',
  '.community-intro',
  '.community-preview-action',
  '.enrollment-number',
  '.voices-heading',
  '.voice-card',
  '.institution-heading',
  '.institution-link-list > li',
  '.catalog-intro-copy',
  '.catalog-course',
  '.section-learning-context > div',
  '.hub-heading',
  '.course-start',
  '.hub-next',
  '.hub-course-contents',
  '.hub-modules > .section-title',
  '.hub-modules > details',
  '.hub-advice',
  '.course-price-panel',
].join(',');

const entranceClasses = ['public-motion-enter', 'public-motion-photo'];

/** Visible server content gains one brief entrance; no observer means no effect. */
export default function PublicMotion() {
  useEffect(() => {
    const root = document.querySelector('.landing');
    if (!root || typeof IntersectionObserver === 'undefined') return;

    const candidates = Array.from(root.querySelectorAll<HTMLElement>(entranceTargets));
    // Keep only the outer candidate if future markup nests two eligible blocks.
    // A photograph is observed at its frame; only its image receives the zoom.
    const targets = candidates.filter(target => !candidates.some(other => other !== target && other.contains(target)));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const entered = new Set<Element>();
    let disposed = false;
    const observer = new IntersectionObserver(entries => {
      if (disposed) return;
      entries.forEach(entry => {
        if (!entry.isIntersecting || entered.has(entry.target)) return;
        entered.add(entry.target);
        observer.unobserve(entry.target);
        if (reducedMotion.matches) return;
        entry.target.classList.add(entry.target.matches('.learning-photo-media') ? 'public-motion-photo' : 'public-motion-enter');
      });
    }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });

    const stopMotion = () => {
      if (reducedMotion.matches) targets.forEach(target => target.classList.remove(...entranceClasses));
    };
    // Continue observing while motion is reduced, recording viewed blocks so
    // changing the preference later never replays a block already encountered.
    targets.forEach(target => observer.observe(target));
    reducedMotion.addEventListener('change', stopMotion);

    return () => {
      disposed = true;
      observer.disconnect();
      reducedMotion.removeEventListener('change', stopMotion);
      targets.forEach(target => target.classList.remove(...entranceClasses));
    };
  }, []);

  return null;
}
