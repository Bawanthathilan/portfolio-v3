import React, { useState } from 'react';
import Link from 'next/link';
import { profile } from '@/data/profile';

const Footer = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <footer className="mx-auto mt-28 max-w-[672px] px-4 pb-32 text-[13px] text-[var(--fg-muted)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-serif text-xl italic text-[var(--fg)]">
            {profile.handle}
          </span>
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
        </div>
        <span className="hidden items-center gap-2 sm:flex">
          Press
          <kbd className="rounded-md bg-[var(--card)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--fg)]">
            /
          </kbd>
          to open the dock
        </span>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        {Object.entries(profile.socials).map(([label, href]) => (
          <Link
            key={label}
            href={href}
            target="_blank"
            className="capitalize transition-colors hover:text-[var(--fg)]"
          >
            {label === 'x' ? 'X' : label}
          </Link>
        ))}
        <button
          type="button"
          onClick={copyEmail}
          className="ml-auto transition-colors hover:text-[var(--fg)]"
        >
          {copied ? 'Copied!' : 'Copy email'}
        </button>
      </div>
    </footer>
  );
};

export default Footer;
