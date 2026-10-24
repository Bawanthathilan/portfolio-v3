// Adapted from ui lab by Yash Bavadiya (MIT, see THIRD_PARTY_NOTICES.md):
// https://github.com/xevrion/ui-lab/blob/main/src/lab/components/theme-toggle.tsx
// Changes: adds a small `sm` size and the navbar's flat style, Tailwind v3
// classes and the site's colour variables, a forwarded ref, no demo.
import React, { forwardRef, useId } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/utils/use-reduced-motion';
import { cn } from '@/utils/cn';

// No bounce: an icon that overshoots reads as a wobble, not a morph. The
// spring's tail settles invisibly, so it still feels quick.
const MORPH = { type: 'spring', visualDuration: 0.4, bounce: 0 } as const;
// Rays go around the dial one by one; 8 x 18ms keeps the sweep under 150ms.
const RAY_STAGGER = 0.018;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

// The sun's disc swells into the fuller moon disc.
const SUN_R = 4.5;
const MOON_R = 8;
// Out, the rays clear the disc by 3px; in, they tuck under the moon.
const RAY_OUT = { inner: 7.5, outer: 10 };
const RAY_IN = { inner: 3.5, outer: 5 };

// The bite circle slides along one straight line (5deg above 3 o'clock) so
// it reads as sliding in, not sweeping. Parked 20px out it never touches the
// sun; 7.5px out it leaves a crescent. The -40deg tilt then carries the bite
// round to the familiar top right.
const BITE_R = 7.5;
const biteAt = (d: number) => ({
  cx: 12 + d * Math.cos((-5 * Math.PI) / 180),
  cy: 12 + d * Math.sin((-5 * Math.PI) / 180)
});
const BITE_OUT = biteAt(20);
const BITE_IN = biteAt(7.5);
const MOON_TILT = -40;

const RAYS = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  return { cos: Math.cos(a), sin: Math.sin(a) };
});

const SIZES = {
  sm: { button: 'h-8 w-8', icon: 'h-4 w-4' },
  md: { button: 'h-10 w-10', icon: 'h-5 w-5' },
  lg: { button: 'h-14 w-14', icon: 'h-7 w-7' }
};

export const ThemeToggle = forwardRef<
  HTMLButtonElement,
  {
    dark: boolean;
    onChange: (dark: boolean) => void;
    size?: keyof typeof SIZES;
    label?: string;
    className?: string;
  }
>(function ThemeToggle(
  { dark, onChange, size = 'md', label = 'Dark mode', className },
  ref
) {
  const reduceMotion = useReducedMotion();
  // React's ids can carry characters that break inside url(#...).
  const maskId = `moon-${useId().replace(/[^\w-]/g, '')}`;
  // Reduced motion lands on each shape instantly; only the rays' opacity
  // still fades so the swap isn't a hard cut.
  const morph = reduceMotion ? { duration: 0 } : MORPH;

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      aria-pressed={dark}
      onClick={() => onChange(!dark)}
      className={cn(
        'relative flex touch-manipulation select-none items-center justify-center rounded-full text-[var(--fg-muted)] outline-none',
        'transition-[transform,background-color,color] duration-150 ease-out hover:bg-[var(--card)] hover:text-[var(--fg)] active:scale-[0.96] motion-reduce:transition-[background-color,color]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]',
        SIZES[size].button,
        className
      )}
    >
      <motion.svg
        aria-hidden
        viewBox="0 0 24 24"
        className={SIZES[size].icon}
        initial={false}
        animate={{ rotate: dark ? MOON_TILT : 0 }}
        transition={morph}
      >
        <defs>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="24"
            height="24"
          >
            <rect width="24" height="24" fill="white" />
            <motion.circle
              r={BITE_R}
              fill="black"
              initial={false}
              animate={dark ? BITE_IN : BITE_OUT}
              transition={morph}
            />
          </mask>
        </defs>
        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          mask={`url(#${maskId})`}
          initial={false}
          animate={{ r: dark ? MOON_R : SUN_R }}
          transition={morph}
        />
        <g stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          {RAYS.map((ray, i) => {
            const { inner, outer } = dark ? RAY_IN : RAY_OUT;
            // Retract in dial order; extend in reverse, 60ms late, once the
            // disc has shrunk enough to give them room.
            const delay = reduceMotion
              ? 0
              : dark
                ? i * RAY_STAGGER
                : 0.06 + (RAYS.length - 1 - i) * RAY_STAGGER;
            return (
              <motion.line
                key={i}
                initial={false}
                animate={{
                  x1: 12 + ray.cos * inner,
                  y1: 12 + ray.sin * inner,
                  x2: 12 + ray.cos * outer,
                  y2: 12 + ray.sin * outer,
                  opacity: dark ? 0 : 1
                }}
                transition={{
                  ...morph,
                  delay,
                  // Gone before they reach the disc going in; solid early
                  // going out, so they read as growing rather than fading.
                  opacity: {
                    duration: dark ? 0.12 : 0.18,
                    ease: EASE_OUT,
                    delay
                  }
                }}
              />
            );
          })}
        </g>
      </motion.svg>
    </button>
  );
});
