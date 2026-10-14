import React, { useRef } from 'react';
import Link from 'next/link';
import { useInView } from 'framer-motion';
import { cn } from '@/utils/cn';

// Fades a block in the first time it scrolls into view. The motion itself is
// the `.reveal` CSS transition in globals.scss.
export const Reveal = ({
  children,
  className,
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: '-40px' });
  return (
    <div
      ref={ref}
      data-visible={visible}
      className={cn('reveal', className)}
      style={{ '--reveal-delay': `${delay * 1000}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

// `work / 04` style section header with an optional right-hand link.
export const Section = ({
  id,
  title,
  meta,
  action,
  children
}: {
  id: string;
  title: string;
  meta?: React.ReactNode;
  action?: { label: string; href: string };
  children: React.ReactNode;
}) => (
  <section id={id} className="mt-24 scroll-mt-20">
    <Reveal>
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="font-mono text-xs lowercase text-[var(--fg-muted)]">
          {title}
          {meta !== undefined && (
            <span className="text-[var(--fg-subtle)]">
              <span className="mx-2">/</span>
              {meta}
            </span>
          )}
        </h2>
        {action && (
          <Link
            href={action.href}
            target={action.href.startsWith('http') ? '_blank' : undefined}
            className="group flex items-center gap-1 text-[13px] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
          >
            {action.label}
            <ArrowRight className="transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </Reveal>
    <Reveal delay={0.05}>{children}</Reveal>
  </section>
);

export const Card = ({
  className,
  children
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <div className={cn('rounded-2xl bg-[var(--card)]', className)}>
    {children}
  </div>
);

type IconProps = { className?: string; size?: number };

const icon =
  (path: React.ReactNode, strokeWidth = 2) =>
  // eslint-disable-next-line react/display-name
  ({ className, size = 12 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  );

export const ArrowRight = icon(<path d="M5 12h14M13 5l7 7-7 7" />);
export const ArrowUpRight = icon(<path d="M7 17L17 7M8 7h9v9" />);
export const ArrowUp = icon(<path d="M12 19V5M5 12l7-7 7 7" />);
export const Chevron = icon(<path d="M6 9l6 6 6-6" />);
export const Search = icon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </>
);
export const Mail = icon(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </>,
  1.8
);
export const Doc = icon(
  <>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </>,
  1.8
);
export const Pen = icon(
  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />,
  1.6
);
export const Star = ({ className, size = 12 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
  </svg>
);
