import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

const SunIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const navLinks = [
  { label: 'about', href: '/#about' },
  { label: 'work', href: '/#work' },
  { label: 'certs', href: '/#certifications' },
  { label: 'awards', href: '/#achievements' },
  { label: 'gallery', href: '/#gallery' },
  { label: 'writing', href: '/#writing' },
  { label: 'guestbook', href: '/guestbook' }
];

const socials = [
  { label: 'GitHub', href: 'https://github.com/Bawanthathilan' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bawanthathilan/' },
  { label: 'X.com', href: 'https://twitter.com/ThilanBawantha' },
  { label: 'Medium', href: 'https://medium.com/@bawantharathnayaka' }
];

const Navbar = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  if (!mounted) return null;

  const toggleTheme = () =>
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  const close = () => setMobileOpen(false);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 backdrop-blur-md [backdrop-filter:blur(14px)_saturate(140%)] bg-[color-mix(in_srgb,var(--bg)_75%,transparent)] border-b transition-[border-color] duration-200 ${scrolled ? 'border-[var(--line)]' : 'border-transparent'}`}
      >
        <div className="max-w-[1120px] mx-auto px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            onClick={close}
            className="flex items-center gap-2.5 font-semibold text-sm tracking-[-0.01em] no-underline text-[var(--fg)]"
          >
            <span>bɔː.wæn.θə</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden-mobile flex gap-7 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-mono text-[12.5px] text-[var(--fg-muted)] no-underline transition-colors duration-150 hover:text-[var(--fg)]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              className="px-3.5 py-2 bg-[var(--fg)] text-[var(--bg)] rounded-[9px] font-sans text-[13px] font-medium no-underline transition-opacity duration-150 hover:opacity-[0.85]"
            >
              Get in touch
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 grid place-items-center bg-transparent border border-[var(--line)] rounded-[9px] text-[var(--fg)] cursor-pointer transition-all duration-150 hover:bg-[var(--chip)] hover:border-[var(--line-strong)]"
            >
              {currentTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="show-mobile w-9 h-9 hidden place-items-center bg-transparent border border-[var(--line)] rounded-[9px] text-[var(--fg)] cursor-pointer transition-colors duration-150 hover:bg-[var(--chip)]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {mobileOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Full-page mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-[var(--bg)] transition-[opacity,transform] duration-300 ease-in-out show-mobile ${
          mobileOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Top bar spacer (matches navbar height) */}
        <div className="h-[57px] flex-shrink-0 border-b border-[var(--line)]" />

        {/* Nav links */}
        <div className="flex-1 flex flex-col justify-center px-8 gap-1">
          {navLinks.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={close}
              className="group flex items-center justify-between py-4 border-b border-[var(--line)] no-underline"
              style={{ transitionDelay: mobileOpen ? `${i * 40}ms` : '0ms' }}
            >
              <span className="font-mono text-[13px] text-[var(--fg-subtle)] uppercase tracking-[0.08em]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[28px] font-medium tracking-[-0.02em] text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors duration-150">
                {link.label}
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="text-[var(--fg-subtle)] group-hover:text-[var(--accent)] transition-colors duration-150"
              >
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Bottom: CTA + socials */}
        <div className="px-8 pb-10 flex flex-col gap-5">
          <Link
            href="/#contact"
            onClick={close}
            className="w-full text-center py-4 bg-[var(--fg)] text-[var(--bg)] rounded-[12px] font-sans text-[15px] font-medium no-underline transition-opacity duration-150 hover:opacity-[0.88]"
          >
            Get in touch
          </Link>
          <div className="flex justify-center gap-7">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11.5px] text-[var(--fg-subtle)] no-underline hover:text-[var(--fg)] transition-colors duration-150"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
