import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import MyImg from '@/assets/images/ascii.png';
import Link from 'next/link';

const roles = [
  'full-stack systems',
  'developer tools',
  'API design',
  'TypeScript & React'
];

const Hero = () => {
  return (
    <section id="top" className="port-wrap py-[80px] pb-[100px] relative">
      {/* Portrait — floats top-right on desktop, stacks above on mobile */}
      <div className="hero-portrait" aria-hidden="true">
        {/* Rotating text ring */}
        <svg className="hp-ring" viewBox="0 0 200 200">
          <defs>
            <path
              id="hp-circle"
              d="M 100, 100 m -84, 0 a 84,84 0 1,1 168,0 a 84,84 0 1,1 -168,0"
            />
          </defs>
          <text
            fontFamily="Geist Mono, monospace"
            fontSize="10"
            letterSpacing="6"
            fill="currentColor"
          >
            <textPath href="#hp-circle" startOffset="0">
              SOFTWARE • ENGINEER • — • BUILDING • SHIPPING • — •{' '}
            </textPath>
          </text>
        </svg>

        {/* Photo frame */}
        <div className="hp-frame">
          <Image
            src={MyImg}
            alt="Bawantha Thilan"
            fill
            className="hp-img"
            sizes="(max-width: 960px) 200px, 260px"
            priority
          />
          <span className="hp-corner hp-tl" />
          <span className="hp-corner hp-tr" />
          <span className="hp-corner hp-bl" />
          <span className="hp-corner hp-br" />
          <div className="hp-tag">
            <span className="hp-tag-dot" />
            <span>that&apos;s me</span>
          </div>
        </div>

        {/* Caption */}
        <div className="hp-meta">
          <div className="hp-meta-k">No. 001</div>
        </div>
      </div>

      {/* Status badge */}
      <Link
        href="https://buymeacoffee.com/bawanthathilan"
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-elev)] border border-[var(--line)] rounded-full font-mono text-[11.5px] text-[var(--fg-muted)] mb-7 shadow-[var(--shadow)] opacity-0 [animation:rise_0.7s_0.05s_ease-out_forwards]"
      >
        <span className="pulse-dot" />
        <span>Buy NEXT JS Portfolio Templates & More</span>
      </Link>

      {/* Hero title */}
      <h1 className="hero-title-constrained text-[clamp(44px,7.2vw,92px)] font-medium leading-[1.02] tracking-[-0.035em] mb-[22px] font-sans text-[var(--fg)]">
        <span className="hero-word">
          <span style={{ animationDelay: '0s' }}>hey, I'm</span>
        </span>{' '}
        <span className="hero-word">
          <span style={{ animationDelay: '0.08s' }}>Bawantha Thilan.</span>
        </span>
      </h1>

      {/* Subtitle with role rotator */}
      <p className="hero-sub-constrained text-[clamp(18px,1.8vw,22px)] text-[var(--fg-muted)] mb-9 leading-[1.5] opacity-0 [animation:rise_0.7s_0.6s_ease-out_forwards]">
        Software Engineer, Tech Blogger and Traveller, opensource enthusiast,
        practicing minimalist, and Pop Music in search of flow. Working with my
        hands to make magic happen on the internet.
      </p>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap opacity-0 [animation:rise_0.7s_0.75s_ease-out_forwards]">
        {[
          {
            href: '#work',
            label: 'See selected work',
            primary: true,
            icon: (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            )
          },
          {
            href: 'mailto:bawantharathnayaka@gmail.com',
            label: 'Email me',
            primary: false,
            icon: (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 4h16v16H4zM4 4l8 8 8-8" />
              </svg>
            )
          },
          {
            href: 'https://drive.google.com/drive/folders/191j6y4c-BGXbQJD_Lp5nZW7JnGIe2NDS?usp=sharing',
            label: 'Résumé',
            primary: false,
            target: '_blank',
            icon: (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
            )
          }
        ].map((btn) => (
          <a
            key={btn.label}
            href={btn.href}
            target={(btn as any).target}
            rel={(btn as any).target ? 'noopener noreferrer' : undefined}
            className={`inline-flex items-center gap-2 px-[18px] py-[11px] rounded-[10px] text-sm font-medium no-underline transition-all duration-150 cursor-pointer ${
              btn.primary
                ? 'bg-[var(--fg)] text-[var(--bg)] border border-transparent hover:-translate-y-px'
                : 'bg-[var(--bg-elev)] text-[var(--fg)] border border-[var(--line)] hover:bg-[var(--chip)] hover:border-[var(--line-strong)]'
            }`}
          >
            {btn.icon} {btn.label}
          </a>
        ))}
      </div>

      {/* Meta strip */}
      <div className="flex gap-7 flex-wrap mt-11 pt-6 border-t border-[var(--line)] opacity-0 [animation:rise_0.7s_0.9s_ease-out_forwards]">
        {[
          { label: 'Location', value: 'Colombo, Sri Lanka · Hybrid' },
          { label: 'Focus', value: 'Web · Cloud · Developer Tools' },
          { label: 'Years shipping', value: '5+' },
          { label: 'Currently', value: 'Senior Software Engineer · OREL IT' }
        ].map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">
              {item.label}
            </div>
            <div className="text-sm text-[var(--fg)] font-medium">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
