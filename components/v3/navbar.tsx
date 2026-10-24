import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { profile } from '@/data/profile';
import { ThemeToggle } from '@/components/lab/theme-toggle';

// The new theme grows out of the toggle as a circle until it covers the page.
const REVEAL_MS = 750;
const EASE_IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)';

function switchTheme(
  next: boolean,
  apply: (next: boolean) => void,
  from: HTMLElement
) {
  const root = document.documentElement;
  const commit = () => {
    // Set the class straight away so the snapshot of the new page is already
    // in the new theme; next-themes then stores the choice.
    root.classList.toggle('dark', next);
    root.style.colorScheme = next ? 'dark' : 'light';
    flushSync(() => apply(next));
  };

  // No View Transitions support: switch instantly.
  if (!document.startViewTransition) return commit();

  // Reduced motion: keep the browser's default crossfade, drop the circle.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(commit);
    return;
  }

  const { left, top, width, height } = from.getBoundingClientRect();
  const x = left + width / 2;
  const y = top + height / 2;
  // Far enough to reach the corner furthest from the toggle.
  const r = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );

  root.dataset.themeReveal = '';
  const transition = document.startViewTransition(commit);
  transition.ready.then(() => {
    root.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${r}px at ${x}px ${y}px)`
        ]
      },
      {
        duration: REVEAL_MS,
        easing: EASE_IN_OUT,
        pseudoElement: '::view-transition-new(root)'
      }
    );
  });
  transition.finished.finally(() => delete root.dataset.themeReveal);
}

const Navbar = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => setMounted(true), []);

  const dark = resolvedTheme === 'dark';

  return (
    <header className="sticky top-0 z-30 bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-[672px] items-center justify-between px-4">
        <Link
          href="/"
          className="text-[13px] font-medium text-[var(--fg)] transition-opacity hover:opacity-70"
        >
          {profile.handle}
        </Link>
        {/* Same-size placeholder until the theme is known on the client */}
        {mounted ? (
          <ThemeToggle
            ref={toggle}
            size="sm"
            dark={dark}
            onChange={(next) =>
              switchTheme(
                next,
                (d) => setTheme(d ? 'dark' : 'light'),
                toggle.current!
              )
            }
            label="Dark mode"
          />
        ) : (
          <span className="h-8 w-8" aria-hidden />
        )}
      </nav>
    </header>
  );
};

export default Navbar;
