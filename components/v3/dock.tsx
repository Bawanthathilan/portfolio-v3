import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Search } from '@/components/v3';
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

// Floating search pill. `/` focuses it; typing filters jump-to commands and
// anything that matches nothing can be sent as an email.
const Dock = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [placeholder, setPlaceholder] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key !== '/' || el.closest('input, textarea, [contenteditable]'))
        return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    const onScroll = () => setShowTop(window.scrollY > 600);
    const t = setInterval(
      () => setPlaceholder((p) => (p + 1) % PLACEHOLDERS.length),
      4000
    );
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearInterval(t);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
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
        <div className="relative w-full max-w-[360px]">
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
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              onBlur={() => setOpen(false)}
              onKeyDown={onKeyDown}
              placeholder={PLACEHOLDERS[placeholder]}
              aria-label="Search or send a message"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-[var(--fg)] outline-none placeholder:text-[var(--fg-muted)]"
            />
            <kbd className="grid h-6 w-6 place-items-center rounded-md bg-[var(--card)] font-mono text-[11px] text-[var(--fg-muted)]">
              /
            </kbd>
          </label>
        </div>
      </div>

      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            aria-label="Back to top"
            initial={{ opacity: 0, transform: 'scale(0.95)' }}
            animate={{
              opacity: 1,
              transform: 'scale(1)',
              transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] }
            }}
            exit={{
              opacity: 0,
              transform: 'scale(0.95)',
              transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] }
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-5 right-5 z-40 hidden h-11 w-11 place-items-center rounded-full border border-[var(--line)] bg-[var(--bg)] text-[var(--fg)] shadow-lg transition-transform duration-150 ease-out active:scale-[0.95] sm:grid"
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dock;
