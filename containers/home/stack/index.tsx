import React from 'react';

const row1 = [
  ['Ts', 'TypeScript'],
  ['Py', 'Python'],
  ['Nx', 'Next.js'],
  ['Re', 'React'],
  ['No', 'Node.js'],
  ['Sb', 'Supabase'],
  ['Pg', 'Postgres'],
  ['Dk', 'Docker']
];

const row2 = [
  ['Aw', 'AWS'],
  ['Vc', 'Vercel'],
  ['Tw', 'Tailwind'],
  ['Gh', 'GitHub'],
  ['Fg', 'Figma'],
  ['Vt', 'Vite'],
];

const Chip = ({ mark, name }: { mark: string; name: string }) => (
  <div className="stack-chip">
    <span className="stack-chip-mark">{mark}</span>
    <span className="stack-chip-name">{name}</span>
  </div>
);

const Stack = () => {
  return (
    <section id="stack" className="port-wrap port-section">
      <div className="section-head">
        <span className="section-num">04 / stack</span>
        <h2 className="section-title">Tools I reach for</h2>
        <span className="section-kicker">subject to change</span>
      </div>

      <div className="flex flex-col gap-3">
        {/* Row 1 — scrolls left */}
        <div className="stack-track">
          <div className="stack-track-inner">
            {[...row1, ...row1].map(([mark, name], i) => (
              <Chip key={i} mark={mark} name={name} />
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="stack-track">
          <div className="stack-track-inner reverse">
            {[...row2, ...row2].map(([mark, name], i) => (
              <Chip key={i} mark={mark} name={name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stack;
