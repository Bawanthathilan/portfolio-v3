import Lenis from 'lenis';

// One Lenis instance for the page: wheel and trackpad scrolling glide to a
// stop instead of jumping in steps. Touch keeps the phone's own scrolling,
// which is already smooth, and Lenis stays off for visitors who ask their
// OS for reduced motion.
let lenis: Lenis | null = null;
// Popups each pause it while open; counted so a nested one closing doesn't
// unpause the page under the other.
let pauses = 0;

export function startSmoothScroll() {
  lenis = new Lenis({
    // How much of the remaining distance each frame covers: lower is
    // floatier. 0.1 settles in about half a second.
    lerp: 0.1,
    autoRaf: true,
    // In-page #links glide too, and land under the sticky navbar thanks to
    // each section's scroll-margin.
    anchors: true
  });
  if (pauses) lenis.stop();
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

// For modals: the page behind must not move. Their own scrolling areas need
// `data-lenis-prevent` so the wheel still reaches them.
export function pauseSmoothScroll() {
  if (pauses++ === 0) lenis?.stop();
}

export function resumeSmoothScroll() {
  if (pauses > 0 && --pauses === 0) lenis?.start();
}

export function getSmoothScroll() {
  return lenis;
}
