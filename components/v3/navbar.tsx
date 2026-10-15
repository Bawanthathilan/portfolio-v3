import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { profile } from '@/data/profile';
import { ThemeToggle } from '@/components/lab/theme-toggle';

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
        {/* Same-size placeholder until the theme is known on the client */}
        {mounted ? (
          <ThemeToggle
            size="sm"
            dark={dark}
            onChange={(next) => setTheme(next ? 'dark' : 'light')}
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
