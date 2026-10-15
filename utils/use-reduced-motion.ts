// Adapted from ui lab by Yash Bavadiya (MIT, see THIRD_PARTY_NOTICES.md):
// https://github.com/xevrion/ui-lab/blob/main/src/lib/use-reduced-motion.ts
import { useSyncExternalStore } from 'react';

// Motion's own useReducedMotion reads the media query on the first client
// render, which the server can't know, so reduced-motion visitors hit a
// hydration mismatch. This reports false while hydrating, then the real
// preference, and follows it if it changes.
const query = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
