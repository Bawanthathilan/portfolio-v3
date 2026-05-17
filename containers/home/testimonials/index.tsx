import React, { useEffect, useRef, useState } from 'react';
import { comments } from '@/data/index';

const defaultTestimonials = [
  {
    text: "Bawantha is the rare engineer who treats code review like product review. He pushes back where it matters and ships clean, considered work — the kind you don't have to revisit six months later.",
    name: 'Anika Silva',
    title: 'Engineering Lead · Northbound Labs',
    initials: 'AS'
  },
  {
    text: 'Working with Bawantha felt like adding two engineers, not one. He owned the entire backend rewrite end-to-end and was genuinely excited about the boring parts — migrations, observability, on-call.',
    name: 'Rohan Mendis',
    title: 'CTO · Cinder',
    initials: 'RM'
  },
  {
    text: 'The portfolio itself is the proof. The level of care in the details — the type, the motion, the tiny copy choices — is exactly what he brings to client work. We hired him within a week.',
    name: 'Jasmine Tao',
    title: 'Founder · Driftpost',
    initials: 'JT'
  },
  {
    text: "Honestly the cleanest engineer-portfolio I've seen this year. Calm, confident, nothing wasted. Sent it around the team as a reference.",
    name: 'Dilshan Karunaratne',
    title: 'Design Director · Greenroom',
    initials: 'DK'
  }
];

const buildTestimonials = () => {
  if (comments && comments.length > 0) {
    return comments.slice(0, 4).map((c) => ({
      text: c.comment,
      name: c.name,
      title: c.twitterHandle ? `@${c.twitterHandle}` : c.linkedin || '',
      initials: c.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    }));
  }
  return defaultTestimonials;
};

const Testimonials = () => {
  const testimonials = buildTestimonials();
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = testimonials.length;

  const go = (next: number) => setIdx(((next % total) + total) % total);
  const start = () => {
    timerRef.current = setInterval(() => setIdx((i) => (i + 1) % total), 5500);
  };
  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
  const restart = () => {
    stop();
    start();
  };

  useEffect(() => {
    start();
    return stop;
  }, []);

  return (
    <section id="testimonials" className="port-wrap port-section">
      <div className="section-head">
        <span className="section-num">07 / kind words</span>
        <h2 className="section-title">
          What people are saying about my portfolio
        </h2>
        <span className="section-kicker font-mono">
          {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      <div
        className="quote-wrap relative bg-[var(--bg-elev)] border border-[var(--line)] rounded-[18px] pt-14 px-12 pb-8 overflow-hidden"
        onMouseEnter={stop}
        onMouseLeave={start}
      >
        {/* Decorative quote glyph */}
        <div className="absolute -top-6 left-9 font-serif text-[200px] text-[var(--line-strong)] leading-none pointer-events-none select-none">
          &ldquo;
        </div>

        {/* Slides */}
        <div className="quote-track relative min-h-[220px]">
          {testimonials.map((t, i) => (
            <div key={i} className={`quote-slide${i === idx ? ' active' : ''}`}>
              <p className="text-[clamp(18px,2vw,22px)] leading-[1.5] tracking-[-0.01em] text-[var(--fg)] flex-1 m-0">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full hatch-bg-sm border border-[var(--line-strong)] grid place-items-center font-mono text-[13px] font-semibold text-[var(--fg)] shrink-0">
                  <span className="bg-[var(--bg-elev)] px-1.5 py-0.5 rounded-[4px]">
                    {t.initials}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="text-sm font-medium text-[var(--fg)]">
                    {t.name}
                  </div>
                  <div className="font-mono text-[11.5px] text-[var(--fg-muted)]">
                    {t.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mt-6 pt-5 border-t border-dashed border-[var(--line)]">
          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  go(i);
                  restart();
                }}
                aria-label={`Testimonial ${i + 1}`}
                className={`w-[22px] h-1 rounded-[2px] border-none p-0 cursor-pointer transition-colors duration-200 ${i === idx ? 'bg-[var(--fg)]' : 'bg-[var(--line-strong)]'}`}
              />
            ))}
          </div>

          {/* Prev / Next */}
          <div className="flex gap-1.5">
            {[
              { dir: -1, label: 'Previous', path: 'M15 6l-6 6 6 6' },
              { dir: 1, label: 'Next', path: 'M9 6l6 6-6 6' }
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => {
                  go(idx + btn.dir);
                  restart();
                }}
                aria-label={`${btn.label} testimonial`}
                className="w-8 h-8 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--fg)] cursor-pointer grid place-items-center transition-all duration-150 hover:bg-[var(--chip)] hover:border-[var(--line-strong)]"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d={btn.path} />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
