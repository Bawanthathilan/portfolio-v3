// Adapted from ui lab by Yash Bavadiya (MIT, see THIRD_PARTY_NOTICES.md):
// https://github.com/xevrion/ui-lab/blob/main/src/lab/components/copy-email.tsx
// Changes: no demo autoplay or `display` override, Tailwind v3 classes and
// the site's colour variables, sized for the footer.
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/utils/use-reduced-motion';
import { cn } from '@/utils/cn';

type Status = 'idle' | 'copied' | 'failed';

// One letter's flip. Each letter starts a beat after its left neighbour, so
// the message reads as a wave running through the address.
const FLIP = { duration: 0.22, ease: [0.23, 1, 0.32, 1] } as const;
const STAGGER = 0.018;
// The box eases to its new width over the span the wave takes to cross it.
// Width (not scale) on purpose: neighbours should reflow.
const WIDTH_MS = 320;

export function CopyEmail({
  email,
  copiedText = 'Copied to clipboard',
  // Long enough to read the confirmation, short enough to feel returned.
  resetAfter = 1600,
  className
}: {
  email: string;
  copiedText?: string;
  resetAfter?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<Status>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const attempt = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const show = (next: Exclude<Status, 'idle'>) => {
    setStatus(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), resetAfter);
  };

  const copy = async () => {
    const id = ++attempt.current;
    // Confirm on press: the write is near instant, and waiting makes the
    // click feel ignored.
    show('copied');
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(email);
    } catch {
      if (id === attempt.current) show('failed');
    }
  };

  const shown =
    status === 'copied'
      ? copiedText
      : status === 'failed'
        ? "Couldn't copy"
        : email;
  // Every text shares these slots; extras sit blank at the tail and are
  // clipped by the animating width.
  const slots = Math.max(email.length, copiedText.length, 13);

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <span className="group/copy relative inline-flex">
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy email address ${email}`}
          className="relative flex h-8 touch-manipulation select-none items-center rounded-md px-1.5 font-mono text-xs text-[var(--fg-muted)] outline-none transition-[transform,background-color,color] duration-150 ease-out hover:bg-[var(--card)] hover:text-[var(--fg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)] active:scale-[0.96] motion-reduce:transition-[background-color]"
        >
          <span
            aria-hidden
            className="flex overflow-hidden transition-[width] ease-in-out motion-reduce:transition-none"
            style={{
              width: `${shown.length}ch`,
              transitionDuration: `${WIDTH_MS}ms`,
              // Room for the flip's perspective to read as depth
              perspective: 240
            }}
          >
            {Array.from({ length: slots }, (_, i) => (
              <Letter
                key={i}
                char={shown[i] ?? ' '}
                delay={i * STAGGER}
                reduceMotion={reduceMotion}
              />
            ))}
          </span>
        </button>

        {/* A hint of what the click does; hidden once the text itself is
            saying something. Hover-only devices, via hoverOnlyWhenSupported. */}
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 translate-y-0.5 whitespace-nowrap rounded-full bg-[var(--fg)] px-2 py-0.5 text-xs font-medium text-[var(--bg)] opacity-0',
            'transition-[opacity,transform] duration-100 ease-out group-hover/copy:translate-y-0 group-hover/copy:opacity-100 group-hover/copy:delay-300 group-hover/copy:duration-150',
            status !== 'idle' && 'invisible'
          )}
        >
          Click to copy
        </span>
      </span>

      <a
        href={`mailto:${email}`}
        aria-label={`Email ${email}`}
        className="relative flex h-7 w-7 touch-manipulation items-center justify-center rounded-md text-[var(--fg-muted)] outline-none transition-[transform,color,background-color] duration-150 ease-out after:absolute after:-inset-1.5 hover:bg-[var(--card)] hover:text-[var(--fg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--fg)] active:scale-[0.96]"
      >
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 11 11 5M6 5h5v5" />
        </svg>
      </a>

      <span className="sr-only" aria-live="polite">
        {status === 'copied'
          ? 'Copied to clipboard'
          : status === 'failed'
            ? "Couldn't copy"
            : ''}
      </span>
    </span>
  );
}

function Letter({
  char,
  delay,
  reduceMotion
}: {
  char: string;
  delay: number;
  reduceMotion: boolean;
}) {
  // Two faces: the letter on show and the one it's leaving. Keying the pair
  // on the char restarts the flip only for slots that change.
  const [faces, setFaces] = useState({ now: char, was: char });
  if (faces.now !== char) setFaces({ now: char, was: faces.now });

  const changed = faces.now !== faces.was;
  return (
    <span className="relative inline-block w-[1ch] shrink-0 whitespace-pre [transform-style:preserve-3d]">
      <motion.span
        key={`in-${faces.now}-${faces.was}`}
        className="block origin-[50%_50%_-0.5em] [backface-visibility:hidden]"
        initial={
          changed
            ? reduceMotion
              ? { opacity: 0 }
              : { rotateX: -90, opacity: 0 }
            : false
        }
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ ...FLIP, delay: reduceMotion ? 0 : delay }}
      >
        {faces.now}
      </motion.span>
      {changed ? (
        <motion.span
          key={`out-${faces.now}-${faces.was}`}
          aria-hidden
          className="absolute inset-0 block origin-[50%_50%_-0.5em] [backface-visibility:hidden]"
          initial={{ rotateX: 0, opacity: 1 }}
          animate={reduceMotion ? { opacity: 0 } : { rotateX: 90, opacity: 0 }}
          transition={{ ...FLIP, delay: reduceMotion ? 0 : delay }}
        >
          {faces.was}
        </motion.span>
      ) : null}
    </span>
  );
}
