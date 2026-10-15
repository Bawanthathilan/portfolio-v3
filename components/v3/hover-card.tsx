import React, { useEffect, useRef, useState } from 'react';

// Open/close state for a pill that expands into a card: opens on mouse hover
// (after a short intent delay), keyboard focus or tap; closes on leave, blur,
// a second tap, or Escape.
export function useHoverCard() {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const root = useRef<HTMLDivElement>(null);

  const show = (delay = 0) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), delay);
  };
  // Grace period so moving onto the card doesn't dismiss it.
  const hide = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(timer.current);
    };
  }, []);

  // A press anywhere outside closes it. Focus can't be relied on for this:
  // iOS Safari doesn't focus buttons on tap or blur them on an outside tap,
  // so a card opened by touch would otherwise stay stuck open.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) {
        clearTimeout(timer.current);
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Touch taps also fire pointerenter; only real mouse pointers should hover.
  const isMouse = (e: React.PointerEvent) => e.pointerType === 'mouse';

  return {
    open,
    toggle: () => setOpen((o) => !o),
    close: () => {
      clearTimeout(timer.current);
      setOpen(false);
    },
    wrapperProps: {
      ref: root,
      onPointerEnter: (e: React.PointerEvent) => isMouse(e) && show(100),
      onPointerLeave: (e: React.PointerEvent) => isMouse(e) && hide(),
      onFocus: () => show(),
      onBlur: hide
    }
  };
}

// Card motion shared by the hero pills: scales from the pill's corner, exits
// faster than it enters. Full transform strings stay on the compositor.
export const cardMotion = {
  initial: { opacity: 0, transform: 'scale(0.96)' },
  animate: {
    opacity: 1,
    transform: 'scale(1)',
    transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] }
  },
  exit: {
    opacity: 0,
    transform: 'scale(0.97)',
    transition: { duration: 0.12, ease: [0.23, 1, 0.32, 1] }
  },
  style: { transformOrigin: 'top left' }
} as const;
