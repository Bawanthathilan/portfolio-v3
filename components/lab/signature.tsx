// Drawing engine adapted from ui lab by Yash Bavadiya (MIT, see
// THIRD_PARTY_NOTICES.md):
// https://github.com/xevrion/ui-lab/blob/main/src/lab/components/footer-signature.tsx
// Changes: just the signature (no footer columns), stroke and nib scaled to
// the path's own size, and a "bawantha" path generated from the public-domain
// Hershey Script Simplex font instead of the original author's signature.
import React, { useEffect, useMemo, useRef } from 'react';
import { useReducedMotion } from '@/utils/use-reduced-motion';
import { cn } from '@/utils/cn';

/* The pen's speed comes from the path itself: the path is sampled once, each
   sample gets a cost from how sharply the line turns there, and time is spent
   in proportion to that cost. So the pen races down straight strokes and
   slows through loops, the way a hand does. The ink is three copies of the
   stroke nudged along a slanted nib, which makes strokes heavier in one
   direction than the other, like a broad-edged pen. */

// "bawantha" in Hershey Script Simplex (public domain), one subpath per pen
// stroke, generated with hersheytext and joined by each glyph's width.
export const BAWANTHA_SIGNATURE =
  'M0,17 L2,14 5,9 6,7 7,4 7,2 6,1 4,2 3,4 2,8 1,15 1,21 2,22 3,22 5,21 7,19 8,16 8,13 9,17 10,18 12,18 14,17 ' +
  'M18,16 L17,14 15,13 13,13 11,14 10,15 9,17 9,19 10,21 12,22 14,22 16,21 17,19 19,13 18,18 18,21 19,22 20,22 22,21 23,20 25,17 ' +
  'M22,13 L20,15 19,18 19,20 20,22 22,22 24,21 26,19 ' +
  'M28,13 L26,19 26,21 27,22 29,22 31,21 33,19 34,16 34,13 ' +
  'M34,13 L35,17 36,18 38,18 40,17 ' +
  'M40,16 L39,14 37,13 35,13 33,14 32,15 31,17 31,19 32,21 34,22 36,22 38,21 39,19 41,13 40,18 40,21 41,22 42,22 44,21 45,20 47,17 ' +
  'M41,17 L43,14 45,13 46,14 46,15 45,19 44,22 ' +
  'M45,19 L46,17 48,14 50,13 52,13 53,14 53,16 52,19 52,21 53,22 54,22 56,21 57,20 59,17 ' +
  'M51,17 L53,14 55,10 ' +
  'M58,1 L52,19 52,21 53,22 55,22 57,21 58,20 60,17 ' +
  'M52,9 L59,9 ' +
  'M57,17 L59,14 62,9 63,7 64,4 64,2 63,1 61,2 60,4 59,8 58,14 57,22 ' +
  'M57,22 L58,19 59,17 61,14 63,13 65,13 66,14 66,16 65,19 65,21 66,22 67,22 69,21 70,20 72,17 ' +
  'M76,16 L75,14 73,13 71,13 69,14 68,15 67,17 67,19 68,21 70,22 72,22 74,21 75,19 77,13 76,18 76,21 77,22 78,22 80,21 81,20 83,17';

const BAWANTHA_VIEWBOX = '-2 -1 87 26';

// A quick, practised signature. Past the usual 300ms UI budget on purpose:
// it's handwriting that plays once, and any faster the slowdown through
// loops stops reading.
const DURATION = 900;
// How strongly a turn slows the pen. At 0 the pen moves at constant speed.
const CURVE_DRAG = 10;
// Samples along the path; enough that the cost curve is smooth when zoomed.
const SAMPLES = 360;
const NIB_COPIES = 3;
// The original tuned stroke and nib for a 282-unit-wide signature; scale
// both to this path's width so the ink weight matches.
const REFERENCE_WIDTH = 282;
const REFERENCE_STROKE = 2.6;
const REFERENCE_NIB_STEP = 1.4;

type Timing = { lengths: Float32Array; times: Float32Array };

function buildTiming(path: SVGPathElement): Timing {
  const total = path.getTotalLength();
  const pts = Array.from({ length: SAMPLES + 1 }, (_, i) =>
    path.getPointAtLength((total * i) / SAMPLES)
  );
  const lengths = new Float32Array(SAMPLES + 1);
  const times = new Float32Array(SAMPLES + 1);
  let t = 0;
  for (let i = 1; i <= SAMPLES; i++) {
    lengths[i] = (total * i) / SAMPLES;
    const a = pts[Math.max(0, i - 2)];
    const b = pts[i - 1];
    const c = pts[i];
    const turn = Math.abs(
      Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(b.y - a.y, b.x - a.x)
    );
    // A jump to a new subpath reads as a sharp turn too, so each pen lift
    // gets a natural beat of stillness for free.
    const bend = Math.min(turn, 2 * Math.PI - turn);
    t += 1 + CURVE_DRAG * bend;
    times[i] = t;
  }
  for (let i = 0; i <= SAMPLES; i++) times[i] /= t;
  return { lengths, times };
}

// Time is normalised 0..1; returns the path length drawn by then.
function lengthAt({ lengths, times }: Timing, time: number) {
  let lo = 0;
  let hi = times.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (times[mid] < time) lo = mid;
    else hi = mid;
  }
  const span = times[hi] - times[lo] || 1;
  return (
    lengths[lo] + ((time - times[lo]) / span) * (lengths[hi] - lengths[lo])
  );
}

// A gentle start and a slightly quicker finish, like setting the pen down
// and flicking it off the page.
const penEase = (x: number) =>
  x < 0.08 ? (x / 0.08) ** 2 * 0.04 : 0.04 + (x - 0.08) * (0.96 / 0.92);

export function Signature({
  label,
  signature = BAWANTHA_SIGNATURE,
  viewBox = BAWANTHA_VIEWBOX,
  className
}: {
  label: string;
  // An SVG path. Extra subpaths are written in order, with a short pause
  // for each pen lift. Start every subpath with an absolute "M".
  signature?: string;
  viewBox?: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const root = useRef<SVGSVGElement>(null);
  const measure = useRef<SVGPathElement>(null);
  const strokes = useRef<(SVGPathElement | null)[]>([]);
  const subpaths = useMemo(
    () =>
      signature
        .split(/(?=M)/)
        .map((d) => d.trim())
        .filter(Boolean),
    [signature]
  );

  const scale = Number(viewBox.split(/\s+/)[2]) / REFERENCE_WIDTH;
  const strokeWidth = REFERENCE_STROKE * scale;
  const nibStep = REFERENCE_NIB_STEP * scale;

  useEffect(() => {
    const el = root.current;
    const path = measure.current;
    if (!el || !path) return;
    const total = path.getTotalLength();
    const parts = strokes.current
      .slice(0, subpaths.length)
      .map((s) => s?.getTotalLength() ?? 0);
    const starts = parts.map((_, k) =>
      parts.slice(0, k).reduce((a, b) => a + b, 0)
    );
    const setDrawn = (len: number) => {
      strokes.current.forEach((s, i) => {
        if (!s) return;
        const k = i % subpaths.length;
        const part = parts[k];
        const drawn = Math.min(part, Math.max(0, len - starts[k]));
        s.style.strokeDasharray = `${part} ${part + 1}`;
        s.style.strokeDashoffset = String(part - drawn);
      });
    };
    setDrawn(0);

    let frame = 0;
    let start = 0;
    let timing: Timing | null = null;
    let finished = false;
    let pausedAt = 0;

    const tick = (now: number) => {
      if (!timing) return;
      if (!start) start = now;
      const p = Math.min(1, (now - start) / DURATION);
      setDrawn(lengthAt(timing, penEase(p)));
      if (p < 1) frame = requestAnimationFrame(tick);
      else {
        finished = true;
        frame = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || finished || frame || pausedAt) return;
        if (reduceMotion) {
          finished = true;
          setDrawn(total);
          return;
        }
        timing ??= buildTiming(path);
        frame = requestAnimationFrame(tick);
      },
      // Most of it has to be on screen, or it'd be half written before
      // anyone looks.
      { threshold: 0.6 }
    );
    io.observe(el);

    // Pause with the tab; resume from the same point rather than skipping.
    const onVisibility = () => {
      if (!frame && !pausedAt) return;
      if (document.hidden && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
        pausedAt = performance.now();
      } else if (!document.hidden && pausedAt) {
        start += performance.now() - pausedAt;
        pausedAt = 0;
        frame = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [subpaths, reduceMotion]);

  return (
    <svg
      ref={root}
      viewBox={viewBox}
      role="img"
      aria-label={label}
      className={cn('h-8 w-auto overflow-visible text-[var(--fg)]', className)}
    >
      <path ref={measure} d={signature} fill="none" stroke="none" />
      {Array.from({ length: NIB_COPIES }, (_, copy) => (
        <g
          key={copy}
          transform={`translate(${copy * nibStep} ${-copy * nibStep})`}
        >
          {/* One element per subpath: browsers restart the dash at every
              moveto, so a single path would show later strokes too early. */}
          {subpaths.map((d, k) => (
            <path
              key={k}
              ref={(el) => {
                strokes.current[copy * subpaths.length + k] = el;
              }}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              // Hidden until the first frame sets the dash, so nothing
              // flashes fully drawn before JavaScript runs.
              style={{ strokeDasharray: '0 1e4' }}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
