import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { profile } from '@/data/profile';

const Navbar = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
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
        <button
          type="button"
          aria-label="Toggle theme"
          onClick={() => setTheme(dark ? 'light' : 'dark')}
          className="grid h-8 w-8 place-items-center rounded-full text-[var(--fg-muted)] transition-[color,transform] duration-150 ease-out hover:text-[var(--fg)] active:scale-[0.95]"
        >
          {mounted && (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {dark ? (
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              ) : (
                <>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </>
              )}
            </svg>
          )}
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
