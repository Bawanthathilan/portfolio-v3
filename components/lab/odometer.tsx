// Adapted from ui lab by Yash Bavadiya (MIT, see THIRD_PARTY_NOTICES.md):
// https://github.com/xevrion/ui-lab/blob/main/src/lab/components/odometer.tsx
// Changes: sized to inherit the surrounding font, no demo controls, rolls in
// from zero the first time a value arrives.
import React, { useEffect, useState } from 'react';
import {
  motion,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue
} from 'motion/react';
import { useReducedMotion } from '@/utils/use-reduced-motion';
import { cn } from '@/utils/cn';

const GLYPHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export function Odometer({
  value,
  className
}: {
  value: number;
  className?: string;
}) {
  // Start at zero and switch to the real value after mount, so the wheels
  // roll up to it instead of appearing already set.
  const [shown, setShown] = useState(0);
  useEffect(() => setShown(value), [value]);

  const digits = Math.max(String(Math.abs(Math.round(value))).length, 1);
  const separatorEvery = 3;

  return (
    <span className={cn('inline-flex items-center tabular-nums', className)}>
      <span className="sr-only">{value.toLocaleString()}</span>
      {Array.from({ length: digits }, (_, i) => {
        const placeIndex = digits - 1 - i;
        const place = 10 ** placeIndex;
        const comma =
          placeIndex > 0 && placeIndex % separatorEvery === 0 ? (
            <span aria-hidden className="pr-[0.02em]">
              ,
            </span>
          ) : null;
        return (
          <React.Fragment key={place}>
            <Wheel turns={Math.floor(shown / place)} />
            {comma}
          </React.Fragment>
        );
      })}
    </span>
  );
}

// `turns` never wraps, so a wheel going 9 to 10 keeps rolling forward onto 0
// instead of spinning back through every digit.
function Wheel({ turns }: { turns: number }) {
  const reduceMotion = useReducedMotion();
  const position = useSpring(turns, { visualDuration: 0.6, bounce: 0.15 });
  const velocity = useVelocity(position);
  // A touch of motion blur only while the wheel is spinning fast
  const filter = useTransform(velocity, (v) => {
    const blur = Math.min(Math.max((Math.abs(v) - 4) / 16, 0), 1) * 1.5;
    return blur > 0 ? `blur(${blur}px)` : 'none';
  });

  useEffect(() => {
    if (reduceMotion) position.jump(turns);
    else position.set(turns);
  }, [turns, reduceMotion, position]);

  return (
    <span
      aria-hidden
      className="relative inline-block h-[1.3em] w-[0.62em] overflow-hidden"
    >
      <motion.span
        className="absolute inset-0 [mask-image:linear-gradient(transparent,black_20%,black_80%,transparent)]"
        style={{ filter: reduceMotion ? 'none' : filter }}
      >
        {GLYPHS.map((digit) => (
          <Glyph key={digit} digit={digit} position={position} />
        ))}
      </motion.span>
    </span>
  );
}

function Glyph({
  digit,
  position
}: {
  digit: number;
  position: MotionValue<number>;
}) {
  // Each glyph stays within five slots of the current position, so the wheel
  // loops forever with ten nodes; the jump from +5 to -5 happens off view.
  const transform = useTransform(position, (p) => {
    const offset = ((((digit - p) % 10) + 15) % 10) - 5;
    return `translateY(${offset * 100}%)`;
  });

  return (
    <motion.span
      className="absolute inset-0 flex items-center justify-center"
      style={{ transform }}
    >
      {digit}
    </motion.span>
  );
}
