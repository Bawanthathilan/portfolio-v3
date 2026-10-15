// Adapted from ui lab by Yash Bavadiya (MIT, see THIRD_PARTY_NOTICES.md):
// https://github.com/xevrion/ui-lab/blob/main/src/lab/components/avatar-stack.tsx
// Changes: avatars are links, size is a prop (spacing scales with it),
// Tailwind v3 classes and the site's colour variables, no demo data.
import React, { useRef, useState } from 'react';
import {
  motion,
  useSpring,
  useTransform,
  type MotionValue
} from 'motion/react';
import { useReducedMotion } from '@/utils/use-reduced-motion';
import { cn } from '@/utils/cn';

export type Person = { name: string; avatar?: string; href?: string };

// A touch of bounce so the fan springs open rather than slides.
const FAN = { visualDuration: 0.3, bounce: 0.15 };

// Opaque tints for initials, so overlapping circles don't show through.
const TINTS = [
  'bg-[color-mix(in_oklab,var(--fg)_8%,var(--bg))]',
  'bg-[color-mix(in_oklab,var(--fg)_14%,var(--bg))]',
  'bg-[color-mix(in_oklab,var(--fg)_20%,var(--bg))]',
  'bg-[color-mix(in_oklab,var(--fg)_11%,var(--bg))]',
  'bg-[color-mix(in_oklab,var(--fg)_17%,var(--bg))]'
];

function initials(name: string) {
  return name
    .split(/[\s-]+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function listNames(names: string[]) {
  if (names.length < 2) return names.join('');
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

export function AvatarStack({
  people,
  max = 5,
  size = 28,
  label = 'Members',
  className
}: {
  people: Person[];
  max?: number;
  size?: number;
  label?: string;
  className?: string;
}) {
  // Stacked, each avatar hides about a third of the one before it; fanned,
  // they sit with a small gap so they still read as one group.
  const closedStep = Math.round(size * 0.68);
  const openStep = Math.round(size * 1.14);

  const reduceMotion = useReducedMotion();
  const shown = people.slice(0, max);
  const hidden = people.slice(max);
  const count = shown.length + (hidden.length > 0 ? 1 : 0);
  const mid = (count - 1) / 2;

  const step = useSpring(closedStep, FAN);
  // Refs, not state: fanning is one motion value, so hover and focus never
  // re-render the stack.
  const hovered = useRef(false);
  const focused = useRef(false);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  // Roving tabindex: the stack is one tab stop, arrow keys move within it.
  const [active, setActive] = useState(0);

  const update = () => {
    const target = hovered.current || focused.current ? openStep : closedStep;
    if (reduceMotion) step.jump(target);
    else step.set(target);
  };

  const move = (index: number) => {
    setActive(index);
    links.current[index]?.focus();
  };

  const items = [
    ...shown.map((person, i) => ({
      key: person.name,
      text: initials(person.name),
      avatar: person.avatar,
      href: person.href,
      name: person.name,
      tooltip: person.name,
      tint: TINTS[i % TINTS.length]
    })),
    ...(hidden.length > 0
      ? [
          {
            key: 'overflow',
            text: `+${hidden.length}`,
            avatar: undefined,
            href: undefined,
            name: `${hidden.length} more: ${listNames(hidden.map((p) => p.name))}`,
            tooltip: listNames(hidden.map((p) => p.name)),
            tint: 'bg-[var(--card)] text-[var(--fg-muted)]'
          }
        ]
      : [])
  ];

  return (
    <div
      role="toolbar"
      aria-label={label}
      // Sized for the fanned stack up front and laid out from the centre, so
      // fanning grows both ways and nothing around it shifts.
      style={{ width: (count - 1) * openStep + size, height: size }}
      className={cn('relative shrink-0', className)}
      onPointerEnter={(e) => {
        if (e.pointerType === 'touch') return;
        hovered.current = true;
        update();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'touch') return;
        hovered.current = false;
        update();
      }}
      onFocus={(e) => {
        // A click also focuses; only keyboard focus should hold it open.
        if (!e.target.matches(':focus-visible')) return;
        focused.current = true;
        update();
      }}
      onBlur={(e) => {
        if (e.currentTarget.contains(e.relatedTarget)) return;
        focused.current = false;
        update();
      }}
      onKeyDown={(e) => {
        const last = count - 1;
        const next =
          e.key === 'ArrowRight'
            ? Math.min(active + 1, last)
            : e.key === 'ArrowLeft'
              ? Math.max(active - 1, 0)
              : e.key === 'Home'
                ? 0
                : e.key === 'End'
                  ? last
                  : null;
        if (next === null) return;
        e.preventDefault();
        move(next);
      }}
    >
      {items.map((item, i) => {
        const Tag = item.href ? 'a' : 'span';
        return (
          <Slot key={item.key} step={step} offset={i - mid} size={size}>
            <Tag
              ref={(el: HTMLAnchorElement | null) => {
                links.current[i] = el;
              }}
              {...(item.href
                ? { href: item.href, target: '_blank', rel: 'noreferrer' }
                : { role: 'img' })}
              tabIndex={i === active ? 0 : -1}
              aria-label={item.name}
              onFocus={() => setActive(i)}
              className={cn(
                'group relative flex h-full w-full touch-manipulation select-none items-center justify-center rounded-full text-[10px] font-medium text-[var(--fg)] outline-none ring-2 ring-[var(--bg)]',
                'transition-transform duration-200 ease-out',
                'motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-105 motion-safe:focus-visible:-translate-y-0.5 motion-safe:focus-visible:scale-105',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)] active:scale-[0.96]',
                item.avatar ? 'bg-[var(--card)]' : item.tint
              )}
            >
              {item.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.avatar}
                  alt=""
                  width={size}
                  height={size}
                  draggable={false}
                  className="h-full w-full rounded-full"
                />
              ) : (
                <span aria-hidden>{item.text}</span>
              )}
              {/* Enters in 150ms, leaves in 100ms: the exit never holds the eye */}
              <span
                aria-hidden
                className={cn(
                  'pointer-events-none absolute bottom-full left-1/2 mb-2 origin-bottom -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--fg)] px-2.5 py-1 text-xs font-medium text-[var(--bg)]',
                  'invisible translate-y-0.5 scale-[0.97] opacity-0 transition-[opacity,transform,visibility] duration-100 ease-out',
                  'group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-hover:duration-150',
                  'group-focus-visible:visible group-focus-visible:translate-y-0 group-focus-visible:scale-100 group-focus-visible:opacity-100 group-focus-visible:duration-150',
                  'motion-reduce:translate-y-0 motion-reduce:scale-100'
                )}
              >
                {item.tooltip}
              </span>
            </Tag>
          </Slot>
        );
      })}
    </div>
  );
}

function Slot({
  step,
  offset,
  size,
  children
}: {
  step: MotionValue<number>;
  offset: number;
  size: number;
  children: React.ReactNode;
}) {
  const x = useTransform(step, (s) => offset * s);
  return (
    <motion.div
      style={{ x, width: size, marginLeft: -size / 2 }}
      // Lifts whichever avatar is in use above its neighbours and tooltips
      className="absolute left-1/2 top-0 h-full focus-within:z-10 hover:z-10"
    >
      {children}
    </motion.div>
  );
}
