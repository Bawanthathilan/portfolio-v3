// Adapted from ui lab by Yash Bavadiya (MIT, see THIRD_PARTY_NOTICES.md):
// https://github.com/xevrion/ui-lab/blob/main/src/lab/components/dialog.tsx
// Changes: just the dialog (no demo, no nested dialogs), Tailwind v3 classes
// and the site's colour variables, a close button, and a panel that scrolls
// its body when the content is taller than the screen.
import React, { useEffect, useId, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useIsPresent } from 'motion/react';
import { useReducedMotion } from '@/utils/use-reduced-motion';
import { cn } from '@/utils/cn';

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const OPEN = { duration: 0.2, ease: EASE_OUT };
// Leaving is quicker than arriving: once dismissed, it should get out of the way.
const CLOSE = { duration: 0.15, ease: EASE_OUT };

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let savedBody = { overflow: '', paddingRight: '' };

function lockScroll() {
  const body = document.body;
  // Hiding overflow removes the scrollbar; padding by its width keeps the
  // page from sliding sideways under the backdrop.
  const gap = window.innerWidth - document.documentElement.clientWidth;
  const padding = parseFloat(getComputedStyle(body).paddingRight) || 0;
  savedBody = {
    overflow: body.style.overflow,
    paddingRight: body.style.paddingRight
  };
  body.style.overflow = 'hidden';
  if (gap > 0) body.style.paddingRight = `${padding + gap}px`;
}

function unlockScroll() {
  document.body.style.overflow = savedBody.overflow;
  document.body.style.paddingRight = savedBody.paddingRight;
}

const subscribeNoop = () => () => {};
// The portal needs document.body, which only exists on the client.
function useIsClient() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  className,
  children
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  const isClient = useIsClient();
  const reduceMotion = useReducedMotion();
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const initial =
      panel?.querySelector<HTMLElement>('[data-autofocus]') ??
      panel?.querySelector<HTMLElement>(FOCUSABLE) ??
      panel;
    initial?.focus({ preventScroll: true });
    lockScroll();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      onOpenChange(false);
    };
    // Focus that escapes anyway (screen reader navigation, a click that lands
    // on the page behind) is pulled back in.
    const onFocusIn = (e: FocusEvent) => {
      if (panel && !panel.contains(e.target as Node))
        panel.focus({ preventScroll: true });
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocusIn);
      unlockScroll();
      previous?.focus({ preventScroll: true });
    };
  }, [open, onOpenChange]);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <Layer
          key="layer"
          panelRef={panelRef}
          id={id}
          title={title}
          description={description}
          reduceMotion={reduceMotion}
          onClose={() => onOpenChange(false)}
          className={className}
        >
          {children}
        </Layer>
      )}
    </AnimatePresence>,
    document.body
  );
}

function Layer({
  panelRef,
  id,
  title,
  description,
  reduceMotion,
  onClose,
  className,
  children
}: {
  panelRef: React.RefObject<HTMLDivElement>;
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  reduceMotion: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  // While it animates out, clicks and focus go straight through to the page,
  // so the exit never holds up the next interaction.
  const isPresent = useIsPresent();
  // Only a press that starts on the backdrop closes, so dragging a text
  // selection out of the panel doesn't dismiss it.
  const pressedBackdrop = useRef(false);

  // React 18's types don't know `inert`, so it's set on the element directly.
  useEffect(() => {
    panelRef.current?.toggleAttribute('inert', !isPresent);
  }, [isPresent, panelRef]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return;
    const items = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE)
    ).filter((el) => el.getClientRects().length > 0);
    if (!items.length) {
      e.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === e.currentTarget)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className={cn('fixed inset-0 z-50', !isPresent && 'pointer-events-none')}
    >
      {/* A grey wash in light, near black in dark */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--fg)_15%,transparent)] dark:bg-[color-mix(in_srgb,var(--bg)_70%,transparent)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: OPEN }}
        exit={{ opacity: 0, transition: CLOSE }}
        onPointerDown={(e) => {
          pressedBackdrop.current = e.target === e.currentTarget;
        }}
        onClick={(e) => {
          if (pressedBackdrop.current && e.target === e.currentTarget)
            onClose();
          pressedBackdrop.current = false;
        }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-title`}
          aria-describedby={description ? `${id}-description` : undefined}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          // Modals scale from the center: they belong to the viewport, not
          // to the button that opened them.
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1, transition: OPEN }}
          // Softer than the entrance: a smaller shrink, and faster.
          exit={
            reduceMotion
              ? { opacity: 0, transition: CLOSE }
              : { opacity: 0, scale: 0.98, transition: CLOSE }
          }
          className={cn(
            'pointer-events-auto relative flex max-h-[min(680px,100%)] w-[440px] max-w-full flex-col rounded-2xl bg-[var(--bg)] p-6 shadow-[0_0_0_1px_var(--line),0_16px_48px_-12px_rgb(0_0_0/0.35)] outline-none',
            className
          )}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-3 top-3 grid h-8 w-8 touch-manipulation place-items-center rounded-full text-[var(--fg-muted)] outline-none transition-[background-color,color,transform] duration-150 ease-out hover:bg-[var(--card)] hover:text-[var(--fg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--fg)] active:scale-[0.96]"
          >
            <svg
              aria-hidden
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <h2
            id={`${id}-title`}
            className="pr-8 text-lg font-semibold tracking-tight text-[var(--fg)]"
          >
            {title}
          </h2>
          {description && (
            <p
              id={`${id}-description`}
              className="mt-1.5 text-sm text-[var(--fg-muted)] [text-wrap:pretty]"
            >
              {description}
            </p>
          )}
          {children}
        </motion.div>
      </div>
    </div>
  );
}
