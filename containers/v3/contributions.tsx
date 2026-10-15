import React, { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Section } from '@/components/v3';
import { Contribution, useContributions } from '@/queries/github';
import { profile } from '@/data/profile';

// GitHub's own scale, defined per theme in globals.scss.
const LEVELS = [
  'bg-[var(--heat-0)]',
  'bg-[var(--heat-1)]',
  'bg-[var(--heat-2)]',
  'bg-[var(--heat-3)]',
  'bg-[var(--heat-4)]'
];

// Pads the first week so every column is a Sun–Sat week.
function toWeeks(days: Contribution[]) {
  const padded: (Contribution | null)[] = [
    ...Array(new Date(days[0].date).getUTCDay()).fill(null),
    ...days
  ];
  const weeks: (Contribution | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));
  return weeks;
}

const Contributions = () => {
  const { data } = useContributions();

  const weeks = useMemo(() => (data ? toWeeks(data.days) : []), [data]);
  const scroller = useRef<HTMLDivElement>(null);

  // On narrow screens start scrolled to the most recent weeks, like GitHub.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [weeks]);

  if (!data) return null;

  // Label a column when its first real day starts a new month.
  let lastMonth = -1;
  const months = weeks.map((w) => {
    const first = w.find(Boolean);
    const m = first ? new Date(first.date).getUTCMonth() : -1;
    if (m === lastMonth) return '';
    lastMonth = m;
    return new Date(Date.UTC(2000, m, 1)).toLocaleString('en-US', {
      month: 'short',
      timeZone: 'UTC'
    });
  });

  return (
    <Section
      id="contributions"
      title="contributions"
      meta={`${data.total.toLocaleString()} in the last year`}
      action={{ label: 'GitHub', href: profile.socials.github }}
    >
      <div
        ref={scroller}
        className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
      >
        <div
          className="grid min-w-[600px] gap-[3px] text-[10px] leading-none text-[var(--fg-muted)]"
          style={{
            gridTemplateColumns: `28px repeat(${weeks.length}, minmax(0, 1fr))`,
            gridTemplateRows: '14px repeat(7, minmax(0, 1fr))',
            gridAutoFlow: 'column'
          }}
        >
          {/* Day-name column */}
          <span className="sticky left-0 z-10 bg-[var(--bg)]" />
          {/* Labels are absolutely placed so they can't stretch their row */}
          {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
            <span key={i} className="sticky left-0 z-10 bg-[var(--bg)]">
              <span className="absolute left-0 top-1/2 -translate-y-1/2">
                {d}
              </span>
            </span>
          ))}
          {weeks.map((week, wi) => (
            <React.Fragment key={wi}>
              <span className="relative">
                <span className="absolute left-0 top-0 whitespace-nowrap">
                  {/* Skip a label that would collide with the next one */}
                  {months[wi] && !months[wi + 1] ? months[wi] : ''}
                </span>
              </span>
              {Array.from({ length: 7 }, (_, di) => {
                const day = week[di];
                return (
                  <span
                    key={di}
                    title={
                      day
                        ? `${day.count} contribution${day.count === 1 ? '' : 's'} on ${day.date}`
                        : undefined
                    }
                    className={`aspect-square rounded-[2px] ${
                      day ? LEVELS[day.level] : ''
                    }`}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      <Link href={profile.socials.github} className="sr-only">
        GitHub profile
      </Link>
    </Section>
  );
};

export default Contributions;
