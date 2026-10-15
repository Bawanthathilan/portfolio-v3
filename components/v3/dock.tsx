import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Search } from '@/components/v3';
import { BackToTop } from '@/components/lab/back-to-top';
import { profile, sections } from '@/data/profile';
import { cn } from '@/utils/cn';

// TS 5.0's DOM types predate 'instant'; browsers support it.
type Scroll = 'instant' | 'smooth';

type Command = {
  label: string;
  hint: string;
  run: (scroll: Scroll) => void;
};

const PLACEHOLDERS = [
  'Search, or say hi…',
  "hi, i'm from acme, are you open to…",
  'Jump to projects…'
];

// Types each phrase out, holds it, deletes it, then moves on. Paused while
// `active` is false; with reduced motion it just swaps whole phrases.
function useTypewriter(phrases: string[], active: boolean) {
  const [text, setText] = useState(phrases[0]);
  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    let i = 0;
    let chars = phrases[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (reduce) {
        i = (i + 1) % phrases.length;
        setText(phrases[i]);
        timer = setTimeout(tick, 4000);
        return;
      }
      if (deleting) {
        chars -= 1;
        if (chars <= 0) {
          deleting = false;
          i = (i + 1) % phrases.length;
        }
      } else {
        chars += 1;
      }
      setText(phrases[i].slice(0, Math.max(chars, 0)));
      const done = !deleting && chars >= phrases[i].length;
      if (done) deleting = true;
      timer = setTimeout(tick, done ? 2200 : deleting ? 22 : 45);
    };
    timer = setTimeout(tick, 2200);
    return () => clearTimeout(timer);
  }, [active, phrases]);
  return text;
}

// Floating search pill. `/` focuses it; typing filters jump-to commands and
// anything that matches nothing can be sent as an email.
const Dock = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const idle = !open && !query;
  const typed = useTypewriter(PLACEHOLDERS, idle);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key !== '/' || el.closest('input, textarea, [contenteditable]'))
        return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const commands = useMemo<Command[]>(() => {
    const go = (id: string) => (scroll: Scroll) =>
      router.pathname === '/'
        ? document
            .getElementById(id)
            ?.scrollIntoView({ behavior: scroll as ScrollBehavior })
        : router.push(`/#${id}`);
    const open = (url: string) => () => window.open(url, '_blank');
    const all: Command[] = [
      ...sections.map((s) => ({
        label: s.label,
        hint: 'Jump to',
        run: go(s.id)
      })),
      { label: 'Resume', hint: 'Open', run: open(profile.resume) },
      ...Object.entries(profile.socials).map(([k, url]) => ({
        label: k === 'x' ? 'X / Twitter' : k[0].toUpperCase() + k.slice(1),
        hint: 'Open',
        run: open(url)
      })),
      {
        label: 'Guestbook page',
        hint: 'Go to',
        run: () => router.push('/guestbook')
      }
    ];
    const q = query.trim().toLowerCase();
    const matches = q
      ? all.filter((c) => c.label.toLowerCase().includes(q))
      : all;
    if (q)
      matches.push({
        label: `“${query.trim()}”`,
        hint: 'Email Bawantha',
        run: () =>
          (window.location.href = `mailto:${profile.email}?body=${encodeURIComponent(
            query.trim()
          )}`)
      });
    return matches;
  }, [query, router]);

  useEffect(() => setActive(0), [query]);

  // Keyboard-driven jumps happen instantly; clicked ones scroll smoothly so
  // the visitor keeps their sense of where they are on the page.
  const run = (c: Command | undefined, scroll: Scroll) => {
    if (!c) return;
    c.run(scroll);
    setQuery('');
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, commands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      run(commands[active], 'instant');
    } else if (e.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  return (
    <>
      <div className="fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
        {/* Compact on phones, full width once tapped (and on larger screens) */}
        <div className="relative w-full max-w-[220px] transition-[max-width] duration-200 ease-out focus-within:max-w-[360px] sm:max-w-[360px]">
          {/* No open/close animation: this is summoned from the keyboard and
              should feel instant, like Raycast. */}
          {open && (
            <ul className="absolute inset-x-0 bottom-full mb-2 max-h-[320px] overflow-y-auto rounded-2xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_95%,transparent)] p-1.5 shadow-2xl backdrop-blur-xl">
              {commands.map((c, i) => (
                <li key={c.label + c.hint}>
                  <button
                    type="button"
                    // Keep focus in the input so blur doesn't close first.
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => run(c, 'smooth')}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[13px] text-[var(--fg)]',
                      i === active && 'bg-[var(--card)]'
                    )}
                  >
                    <span className="truncate">{c.label}</span>
                    <span className="shrink-0 text-xs text-[var(--fg-muted)]">
                      {c.hint}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <label className="flex h-11 items-center gap-2.5 rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_90%,transparent)] pl-4 pr-2 shadow-lg backdrop-blur-xl transition-colors focus-within:border-[var(--line-strong)]">
            <Search size={14} className="shrink-0 text-[var(--fg-muted)]" />
            <span className="relative flex min-w-0 flex-1 overflow-hidden">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                onKeyDown={onKeyDown}
                placeholder={idle ? '' : PLACEHOLDERS[0]}
                aria-label="Search or send a message"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-[var(--fg)] outline-none placeholder:text-[var(--fg-muted)]"
              />
              {/* Typed hint with a blinking caret while the dock is idle */}
              {idle && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 flex items-center whitespace-nowrap text-[13px] text-[var(--fg-muted)]"
                >
                  {typed}
                  <span className="caret ml-px inline-block h-[14px] w-px bg-[var(--fg-muted)]" />
                </span>
              )}
            </span>
            <kbd className="grid h-6 w-6 place-items-center rounded-md bg-[var(--card)] font-mono text-[11px] text-[var(--fg-muted)]">
              /
            </kbd>
          </label>
        </div>
      </div>

      {/* Reading-progress back-to-top, beside the compact dock on phones */}
      <div className="fixed bottom-5 right-4 z-40 sm:right-5">
        <BackToTop />
      </div>
    </>
  );
};

export default Dock;
