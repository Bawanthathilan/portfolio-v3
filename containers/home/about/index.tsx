import React from 'react';

const About = () => {
  const stats = [
    { k: 'role', v: 'Software Engineer' },
    { k: 'stack', v: 'TS · React · Node · Supabase' },
    { k: 'domains', v: 'Web, Cloud, DX' },
    { k: 'timezone', v: 'GMT+5:30 (IST)' },
    { k: 'availability', v: '● open', green: true }
  ];

  return (
    <section id="about" className="port-wrap port-section">
      <div className="section-head">
        <span className="section-num">01 / about</span>
        <h2 className="section-title">A bit about me</h2>
        <span className="section-kicker">~ 60 sec read</span>
      </div>

      <div className="about-grid">
        {/* Bio */}
        <div className="flex flex-col gap-4">
          <p className="text-[17px] leading-[1.65] text-[var(--fg)] m-0">
            I&apos;m Bawantha — a software engineer who likes the{' '}
            <em className="font-serif not-italic font-normal text-[1.08em] text-[var(--accent)]">
              quiet kind of complexity
            </em>
            : the systems behind the systems, the small details that make a
            product feel inevitable.
          </p>
          <p className="text-[17px] leading-[1.65] text-[var(--fg)] m-0">
            Most of my work lives at the seam between product and
            infrastructure. I write code that&apos;s easy to delete, ship in
            small honest pieces, and care about how things feel as much as how
            they perform.
          </p>
          <p className="text-[17px] leading-[1.65] text-[var(--fg-muted)] m-0">
            Outside of work I tinker with side projects, write on Medium, and
            create content on YouTube about software engineering and tech.
          </p>
        </div>

        {/* Stat card */}
        <div className="bg-[var(--bg-elev)] border border-[var(--line)] rounded-[14px] p-[22px] shadow-[var(--shadow)] self-start">
          {stats.map((s, i) => (
            <div
              key={s.k}
              className={`flex justify-between items-baseline py-3.5 ${i < stats.length - 1 ? 'border-b border-dashed border-[var(--line)]' : ''}`}
            >
              <span className="font-mono text-xs text-[var(--fg-subtle)]">
                {s.k}
              </span>
              <span
                className={`text-[15px] font-medium ${s.green ? 'text-[oklch(0.65_0.14_150)]' : 'text-[var(--fg)]'}`}
              >
                {s.v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
