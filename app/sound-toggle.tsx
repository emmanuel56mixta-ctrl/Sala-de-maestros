'use client';

import { useSyncExternalStore } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { getUISoundEnabled, getUISoundServerSnapshot, playUISound, setUISoundEnabled, subscribeUISound } from '@/lib/interface-audio';
import './sound-toggle.css';

export default function SoundToggle({ className = '' }: { className?: string }) {
  const enabled = useSyncExternalStore(subscribeUISound, getUISoundEnabled, getUISoundServerSnapshot);
  const Icon = enabled ? Volume2 : VolumeX;

  return <button
    type="button"
    className={`sound-toggle ${className}`.trim()}
    aria-label="Sonido de la interfaz"
    aria-pressed={enabled}
    title={enabled ? 'Desactivar sonidos de la interfaz' : 'Activar sonidos de la interfaz'}
    onClick={() => {
      const next = !getUISoundEnabled();
      setUISoundEnabled(next);
      if (next) playUISound('select');
    }}
  ><Icon size={18} aria-hidden="true" /><span>Sonido</span></button>;
}
