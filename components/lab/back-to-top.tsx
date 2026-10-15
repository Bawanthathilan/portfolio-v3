// Adapted from ui lab by Yash Bavadiya (MIT, see THIRD_PARTY_NOTICES.md):
// https://github.com/xevrion/ui-lab/blob/main/src/lab/components/back-to-top.tsx
// Changes: page scroll only (no scroll-container target or external jump
// trigger), Tailwind v3 classes and site colour variables. Press and hover
// motion moved off the elements Motion animates, since Tailwind v3 shares
// one `transform` that Motion's inline style would override.
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion } from 'motion/react';
import { useReducedMotion } from '@/utils/use-reduced-motion';
import { cn } from '@/utils/cn';

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
// A gentle start that keeps accelerating, like something taking off.
const LIFT = [0.4, 0, 0.6, 1] as const;

export function BackToTop({
  showAfter = 0.12,
  className
}: {
  // How far through the page (0 to 1) before the button offers itself.
  showAfter?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  // Set once the arrow has lifted off: it stays gone while the page rises,
  // and only returns if the trip is cut short.
  const [launched, setLaunched] = useState(false);
  const ring = useRef<SVGCircleElement | null>(null);
  // Kept outside the ring (which only exists while shown), so a freshly
  // shown button starts at the right fill instead of empty.
  const progress = useRef(0);
  // True while heading up: the button stays to show the ring draining and
  // bows out only once you've arrived.
  const returning = useRef(false);
  const trip = useRef<ReturnType<typeof animate>>();
  const setRing = (el: SVGCircleElement | null) => {
    ring.current = el;
    el?.style.setProperty('stroke-dashoffset', String(1 - progress.current));
  };

  // The ring follows the scroll with one style write per frame at most, so
  // scrolling never re-renders anything; only crossing the threshold does.
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const room = document.documentElement.scrollHeight - window.innerHeight;
      const p = room > 0 ? Math.min(1, Math.max(0, window.scrollY / room)) : 0;
      progress.current = p;
      ring.current?.style.setProperty('stroke-dashoffset', String(1 - p));
      if (returning.current) {
        if (p > 0) return;
        returning.current = false;
      }
      setVisible(p > showAfter);
      // Hidden again: next time it shows, it brings its arrow back.
      if (p <= showAfter) setLaunched(false);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [showAfter]);

  // Driven here rather than by the browser's smooth scroll, whose speed
  // varies a lot: longer trips take a little longer, never more than 0.9s.
  // Any wheel or touch on the way hands control straight back.
  const go = () => {
    setLaunched(true);
    trip.current?.stop();
    const from = window.scrollY;
    const write = (v: number) => window.scrollTo(0, v);
    if (reduceMotion) return write(0);
    returning.current = true;
    const stop = () => {
      trip.current?.stop();
      returning.current = false;
      setLaunched(false);
    };
    window.addEventListener('wheel', stop, { once: true, passive: true });
    window.addEventListener('touchstart', stop, { once: true, passive: true });
    // The page has `scroll-behavior: smooth`; turn it off for the trip so
    // each frame's scrollTo lands immediately.
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    trip.current = animate(from, 0, {
      duration: Math.min(0.9, 0.45 + from / 4000),
      ease: [0.65, 0, 0.35, 1],
      onUpdate: write,
      onComplete: () => {
        root.style.scrollBehavior = previous;
        window.removeEventListener('wheel', stop);
        window.removeEventListener('touchstart', stop);
      }
    });
  };
  useEffect(() => () => trip.current?.stop(), []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={go}
          initial={{ opacity: 0, scale: 0.85, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{
            opacity: 0,
            scale: 0.85,
            filter: 'blur(4px)',
            transition: { duration: 0.15 }
          }}
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          transition={
            reduceMotion ? { duration: 0 } : { duration: 0.25, ease: EASE_OUT }
          }
          className={cn(
            'group/top relative grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-[var(--bg)] text-[var(--fg)] shadow-lg outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]',
            className
          )}
        >
          {/* How far you've read, drawn around the edge */}
          <svg
            viewBox="0 0 44 44"
            className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
            fill="none"
            aria-hidden
          >
            <circle
              cx="22"
              cy="22"
              r="20.5"
              strokeWidth="1.5"
              className="stroke-[var(--line-strong)]"
            />
            <circle
              ref={setRing}
              cx="22"
              cy="22"
              r="20.5"
              strokeWidth="1.5"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
              className="stroke-[var(--fg)]"
            />
          </svg>
          {/* Hover nudge lives on this wrapper; Motion owns the arrow's transform */}
          <span className="absolute grid h-4 w-4 place-items-center transition-transform duration-150 ease-out group-hover/top:-translate-y-0.5">
            <AnimatePresence initial={false}>
              {!launched && (
                <motion.svg
                  key="arrow"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  initial={{ y: 10, opacity: 0, filter: 'blur(2px)' }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                    transition: reduceMotion
                      ? { duration: 0 }
                      : { duration: 0.3, ease: EASE_OUT }
                  }}
                  // Lifts off the way you're about to go, softening as it leaves
                  exit={{
                    y: -20,
                    opacity: 0,
                    filter: 'blur(2px)',
                    transition: reduceMotion
                      ? { duration: 0 }
                      : { duration: 0.4, ease: LIFT }
                  }}
                  className="absolute h-4 w-4"
                >
                  <path d="M8 12.5v-9M4 7l4-4 4 4" />
                </motion.svg>
              )}
            </AnimatePresence>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
