// Render's free tier spins the backend down after inactivity — the
// first request after that can take up to ~30s to respond while it
// wakes back up. This tracks whether any in-flight request has been
// pending suspiciously long (SLOW_THRESHOLD_MS) and lets a React
// component subscribe to that, without api.ts (a plain module, not a
// component) needing to know React exists.

const SLOW_THRESHOLD_MS = 3000;

type Listener = (waking: boolean) => void;

let listeners: Listener[] = [];
let slowRequestCount = 0;

function notify(waking: boolean) {
  listeners.forEach((l) => l(waking));
}

export function subscribeWakeUp(listener: Listener): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

// Call at the start of a request; call the returned function when it
// finishes (success or failure) — mirrors a try/finally pattern.
export function trackRequest(): () => void {
  let firedSlow = false;

  const timer = setTimeout(() => {
    firedSlow = true;
    slowRequestCount++;
    if (slowRequestCount === 1) notify(true);
  }, SLOW_THRESHOLD_MS);

  return () => {
    clearTimeout(timer);
    if (firedSlow) {
      slowRequestCount--;
      if (slowRequestCount === 0) notify(false);
    }
  };
}
