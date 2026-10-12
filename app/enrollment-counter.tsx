'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, UsersRound } from 'lucide-react';
import { enrollmentCount } from '@/lib/community';

export default function EnrollmentCounter() {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(enrollmentCount);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let inView = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      if (timer !== undefined) clearInterval(timer);
      timer = undefined;
      if (!paused && inView && !document.hidden) {
        timer = setInterval(() => setCount(value => value + 1), 5000);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    }, { threshold: 0.15 });
    observer.observe(element);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      if (timer !== undefined) clearInterval(timer);
    };
  }, [paused]);

  return <div ref={root} className="enrollment-number">
    <span><UsersRound size={20} aria-hidden="true"/>Docentes inscritos</span>
    <strong aria-live="off" aria-describedby="enrollment-note"><span className="enrollment-tick" key={count}>{count.toLocaleString('en-US')}</span></strong>
    <div className="enrollment-counter-meta">
      <small id="enrollment-note">Cifra simulada</small>
      <button type="button" className="enrollment-counter-pause" aria-pressed={paused} aria-label={paused?'Reanudar contador':'Pausar contador'} title={paused?'Reanudar contador':'Pausar contador'} onClick={()=>setPaused(value=>!value)}>
        {paused?<Play size={15} aria-hidden="true"/>:<Pause size={15} aria-hidden="true"/>}
      </button>
    </div>
  </div>;
}
