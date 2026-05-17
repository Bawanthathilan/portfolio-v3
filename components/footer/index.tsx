import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t border-[var(--line)] px-8 pt-7 pb-9 max-w-[1120px] mx-auto flex justify-between items-center font-mono text-[11.5px] text-[var(--fg-subtle)] flex-wrap gap-3 relative z-[1]">
      <div>© {new Date().getFullYear()} Bawantha Thilan</div>
      <div className="flex gap-[18px]">
        {[
          { label: 'github', href: 'https://github.com/Bawanthathilan' },
          {
            label: 'linkedin',
            href: 'https://www.linkedin.com/in/bawanthathilan/'
          },
          { label: 'x.com', href: 'https://twitter.com/ThilanBawantha' },
          { label: 'medium', href: 'https://medium.com/@bawantharathnayaka' }
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--fg-muted)] no-underline transition-colors duration-150 hover:text-[var(--fg)]"
          >
            {s.label}
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
