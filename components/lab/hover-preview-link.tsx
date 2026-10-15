// Adapted from ui lab by Yash Bavadiya (MIT, see THIRD_PARTY_NOTICES.md):
// https://github.com/xevrion/ui-lab/blob/main/src/lab/components/hover-preview-link.tsx
// Changes: no demo pointer simulation, Tailwind v3 classes and the site's
// colour variables. The article thumbnail is the original's ArticleThumb.
import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity
} from 'motion/react';
import { useReducedMotion } from '@/utils/use-reduced-motion';
import { cn } from '@/utils/cn';

const CARD_W = 232;
const GAP = 10;
const GUTTER = 8;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
// Loose enough that the card visibly trails the cursor, tight enough that it
// never feels like it's swimming.
const FOLLOW = { stiffness: 260, damping: 26, mass: 0.6 } as const;
// A card dragged sideways leans into the motion; 7deg at a brisk flick is
// noticeable without looking like it'll fall off.
const MAX_TILT = 7;
const TILT_AT_SPEED = 1400;
// Holds the card up after a touch press ends, so it can actually be read.
const TOUCH_LINGER = 1400;

type Mode = 'cursor' | 'anchored';

export function HoverPreviewLink({
  href,
  title,
  domain,
  image,
  children,
  className
}: {
  href: string;
  title: string;
  domain: string;
  image: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const wrap = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState<Mode | null>(null);
  const [below, setBelow] = useState(false);
  const linger = useRef<ReturnType<typeof setTimeout>>();

  // x is the card's left edge relative to the link, raw from the pointer;
  // the spring gives it lag and its velocity drives the lean.
  const targetX = useMotionValue(0);
  const x = useSpring(targetX, FOLLOW);
  const speed = useVelocity(x);
  const tilt = useSpring(
    useTransform(
      speed,
      [-TILT_AT_SPEED, TILT_AT_SPEED],
      [MAX_TILT, -MAX_TILT],
      { clamp: true }
    ),
    { stiffness: 400, damping: 30 }
  );

  useEffect(() => () => clearTimeout(linger.current), []);

  // Screen pixels per layout pixel: not 1 when an ancestor is scaled, and x
  // is in layout pixels.
  const scaleOf = (el: HTMLElement, r: DOMRect) =>
    el.offsetWidth ? r.width / el.offsetWidth : 1;

  // Keeps the card inside the viewport so it can't widen a phone page.
  const clampLeft = (left: number) => {
    const el = wrap.current;
    if (!el) return left;
    const r = el.getBoundingClientRect();
    const s = scaleOf(el, r);
    const vw = document.documentElement.clientWidth;
    const min = (GUTTER - r.left) / s;
    const max = (vw - GUTTER - r.left) / s - CARD_W;
    return Math.round(Math.min(Math.max(left, min), Math.max(min, max)));
  };

  const place = (mode: Mode, clientX?: number) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const centre =
      mode === 'cursor' && clientX !== undefined
        ? (clientX - r.left) / scaleOf(el, r)
        : el.offsetWidth / 2;
    return clampLeft(centre - CARD_W / 2);
  };

  const show = (mode: Mode, clientX?: number) => {
    const el = wrap.current;
    const left = place(mode, clientX);
    if (!el || left === undefined) return;
    clearTimeout(linger.current);
    // Flip below when there isn't room above in the viewport.
    setBelow(el.getBoundingClientRect().top < 200);
    if (!open) {
      // Appears where the pointer is, rather than sliding from the last spot.
      targetX.jump(left);
      x.jump(left);
      tilt.jump(0);
    } else {
      targetX.set(left);
    }
    setOpen(mode);
  };

  const hide = () => {
    clearTimeout(linger.current);
    setOpen(null);
  };

  return (
    <span ref={wrap} className="relative inline-block">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onPointerEnter={(e) => {
          if (e.pointerType !== 'touch') show('cursor', e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.pointerType === 'touch' || !open) return;
          if (reduceMotion) return;
          targetX.set(place('cursor', e.clientX) ?? 0);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== 'touch') hide();
        }}
        onPointerDown={(e) => {
          if (e.pointerType === 'touch') show('anchored');
        }}
        onPointerUp={(e) => {
          if (e.pointerType !== 'touch') return;
          clearTimeout(linger.current);
          linger.current = setTimeout(hide, TOUCH_LINGER);
        }}
        onPointerCancel={hide}
        onFocus={(e) => {
          if (e.currentTarget.matches(':focus-visible')) show('anchored');
        }}
        onBlur={hide}
        onKeyDown={(e) => {
          if (e.key === 'Escape') hide();
        }}
        className={cn(
          'rounded-[2px] text-[var(--fg)] underline decoration-[var(--line-strong)] decoration-1 underline-offset-4 outline-none transition-[text-decoration-color] duration-150 ease-out hover:decoration-[var(--fg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]',
          className
        )}
      >
        {children}
      </a>

      <AnimatePresence>
        {open ? (
          <motion.span
            aria-hidden
            className={cn(
              'pointer-events-none absolute left-0 z-20 block',
              below ? 'top-full' : 'bottom-full'
            )}
            style={{
              x,
              rotate: reduceMotion ? 0 : tilt,
              width: CARD_W,
              paddingTop: below ? GAP : 0,
              paddingBottom: below ? 0 : GAP,
              // Pivots at the edge nearest the link, like it's held there.
              transformOrigin: below ? '50% 0%' : '50% 100%'
            }}
          >
            <motion.span
              className="block overflow-hidden rounded-xl bg-[var(--bg)] p-1 shadow-xl ring-1 ring-[var(--line)]"
              style={{ transformOrigin: below ? '50% 0%' : '50% 100%' }}
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      scale: 0.88,
                      y: below ? -6 : 6,
                      filter: 'blur(4px)'
                    }
              }
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.18, ease: EASE_OUT }
              }}
              exit={{
                opacity: 0,
                scale: reduceMotion ? 1 : 0.96,
                filter: reduceMotion ? 'blur(0px)' : 'blur(2px)',
                transition: { duration: 0.12, ease: EASE_OUT }
              }}
            >
              {/* Concentric: 12px card = 8px image + 4px padding */}
              <span className="block h-[104px] overflow-hidden rounded-lg bg-[var(--card)] outline outline-1 -outline-offset-1 outline-[var(--line)]">
                {image}
              </span>
              <span className="block px-2 pb-1.5 pt-2">
                <span className="block truncate text-[13px] font-medium text-[var(--fg)]">
                  {title}
                </span>
                <span className="block truncate text-xs text-[var(--fg-muted)]">
                  {domain}
                </span>
              </span>
            </motion.span>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}

// An article page sketch, drawn from theme colours so it sits right in both
// themes (the original's ArticleThumb).
export function ArticleThumb() {
  const fg = (pct: number) =>
    `color-mix(in srgb, var(--fg) ${pct}%, transparent)`;
  return (
    <svg viewBox="0 0 224 104" className="h-full w-full" aria-hidden>
      <rect x="20" y="22" width="92" height="9" rx="2" fill={fg(80)} />
      <rect x="20" y="38" width="64" height="9" rx="2" fill={fg(80)} />
      <rect x="20" y="60" width="104" height="4" rx="2" fill={fg(30)} />
      <rect x="20" y="70" width="96" height="4" rx="2" fill={fg(30)} />
      <rect x="20" y="80" width="72" height="4" rx="2" fill={fg(30)} />
      <circle cx="170" cy="52" r="30" fill="var(--bg)" />
      <path
        d="M146 62c10-2 16-14 26-14s14 10 22 10"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        stroke="var(--fg)"
      />
      <circle cx="172" cy="48" r="3" fill="var(--fg)" />
    </svg>
  );
}
