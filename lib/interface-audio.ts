export type UISound = 'select' | 'step' | 'confirm';

const sources: Record<UISound, string> = {
  select: '/assets/audio/ui-select.mp3',
  step: '/assets/audio/ui-step.mp3',
  confirm: '/assets/audio/ui-confirm.mp3',
};
const STORAGE_KEY = 'sala-ui-sound-enabled';
const DEFAULT_ENABLED = true;
const MIN_INTERVAL_MS = 100;
const listeners = new Set<() => void>();
let preferenceLoaded = false;
let enabled = DEFAULT_ENABLED;
let activeAudio: HTMLAudioElement | null = null;
let removePlaybackListeners: (() => void) | null = null;
let lastPlayedAt = -Infinity;

function loadPreference(refresh = false) {
  if (typeof window === 'undefined' || (preferenceLoaded && !refresh)) return;
  preferenceLoaded = true;
  try {
    enabled = window.localStorage.getItem(STORAGE_KEY) !== 'false';
  } catch {
    // A blocked storage area must not prevent in-memory sound controls.
  }
}

function stopActiveSound() {
  const audio = activeAudio;
  activeAudio = null;
  removePlaybackListeners?.();
  removePlaybackListeners = null;
  if (!audio) return;
  try {
    audio.pause();
    audio.currentTime = 0;
  } catch {
    // Media may already have been released during navigation.
  }
}

function updateEnabled(next: boolean) {
  if (!next) stopActiveSound();
  if (enabled === next) return;
  enabled = next;
  listeners.forEach(listener => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  updateEnabled(event.newValue !== 'false');
}

/** Stable snapshots for useSyncExternalStore; neither allocates audio. */
export function getUISoundEnabled(): boolean {
  if (typeof window === 'undefined') return DEFAULT_ENABLED;
  loadPreference();
  return enabled;
}

export function getUISoundServerSnapshot(): boolean {
  return DEFAULT_ENABLED;
}

export function setUISoundEnabled(next: boolean): void {
  if (typeof window === 'undefined') return;
  loadPreference();
  updateEnabled(next);
  try {
    window.localStorage.setItem(STORAGE_KEY, String(next));
  } catch {
    // The current page still honours the chosen setting without storage.
  }
}

export function subscribeUISound(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  // Catch changes made in another tab while no toggle was mounted here.
  loadPreference(listeners.size === 0);
  if (listeners.size === 0) window.addEventListener('storage', onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener('storage', onStorage);
  };
}

/** Call from a user gesture. Rejected/unsupported playback never blocks the UI. */
export function playUISound(kind: UISound): void {
  if (typeof window === 'undefined' || typeof document === 'undefined' || typeof Audio === 'undefined') return;
  if (!getUISoundEnabled() || document.visibilityState === 'hidden') return;
  if (window.navigator.userActivation && !window.navigator.userActivation.isActive) return;
  const now = performance.now();
  if (now - lastPlayedAt < MIN_INTERVAL_MS) return;
  lastPlayedAt = now;
  stopActiveSound();

  try {
    const audio = new Audio(sources[kind]);
    audio.preload = 'none';
    audio.volume = .5;
    activeAudio = audio;
    const finish = () => { if (activeAudio === audio) stopActiveSound(); };
    const onVisibility = () => { if (document.visibilityState === 'hidden') finish(); };
    audio.addEventListener('ended', finish);
    audio.addEventListener('error', finish);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', finish);
    removePlaybackListeners = () => {
      audio.removeEventListener('ended', finish);
      audio.removeEventListener('error', finish);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', finish);
    };
    void audio.play()?.catch(finish);
  } catch {
    stopActiveSound();
  }
}
