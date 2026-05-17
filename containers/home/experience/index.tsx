import React from 'react';
import useSupabaseBrowser from '@/utils/supabase-browser';
import { getWorkData } from '@/queries';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';

function calcDuration(start: string | null, end: string | null): string {
  if (!start) return '';
  const startY = parseInt(start, 10);
  const endY =
    end && end !== 'Current' && end !== 'Now'
      ? parseInt(end, 10)
      : new Date().getFullYear();
  if (isNaN(startY) || isNaN(endY)) return '';
  const diff = endY - startY;
  if (diff <= 0) return '< 1 yr';
  return `${diff} yr${diff > 1 ? 's' : ''}`;
}

const Experience = () => {
  const supabase = useSupabaseBrowser();
  const { data: workData, isLoading } = useQuery(getWorkData(supabase));

  const items =
    workData?.map((w: any) => ({
      period:
        w.startYear && w.endYear
          ? `${w.startYear} — ${w.endYear}`
          : w.startYear
            ? `${w.startYear} — Now`
            : '',
      title: w.Company_name || '',
      desc: w.Desc || '',
      isCurrent: !w.endYear || w.endYear === 'Current' || w.endYear === 'Now',
      duration: calcDuration(w.startYear, w.endYear)
    })) ?? [];

  return (
    <section id="experience" className="port-wrap port-section">
      <div className="section-head">
        <span className="section-num">05 / experience</span>
        <h2 className="section-title">Where I&apos;ve worked</h2>
        <span className="section-kicker">
          {isLoading
            ? '…'
            : `${items.length} stop${items.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {isLoading ? (
        <div className="font-mono text-[13px] text-[var(--fg-muted)] py-6">
          Loading…
        </div>
      ) : (
        <div className="relative pl-7 mt-2">
          {/* Vertical line */}
          <span
            className="absolute left-[10px] top-[6px] bottom-[6px] w-[2px]"
            style={{
              background:
                'linear-gradient(to bottom, transparent 0%, var(--line-strong) 6%, var(--line-strong) 94%, transparent 100%)'
            }}
          />

          {items.map((exp, i) => (
            <div key={i} className="group relative pl-7 pb-9 last:pb-0">
              {/* Timeline dot */}
              <span
                className={[
                  'absolute left-[-22px] top-[6px] w-[14px] h-[14px] rounded-full z-10',
                  'border-2 transition-all duration-200',
                  exp.isCurrent
                    ? 'border-[var(--accent)] bg-[var(--accent)]'
                    : 'border-[var(--line-strong)] bg-[var(--bg)] group-hover:border-[var(--fg)]'
                ].join(' ')}
                style={
                  exp.isCurrent
                    ? {
                        boxShadow:
                          '0 0 0 4px color-mix(in srgb, var(--accent) 18%, transparent)'
                      }
                    : undefined
                }
              >
                {exp.isCurrent && (
                  <span className="absolute inset-[-6px] rounded-full border border-[var(--accent)] animate-tl-pulse opacity-0" />
                )}
              </span>

              {/* Card */}
              <div className="bg-[var(--bg-elev)] border border-[var(--line)] rounded-[14px] p-5 transition-all duration-200 group-hover:border-[var(--line-strong)] group-hover:translate-x-1 group-hover:shadow-[var(--shadow)]">
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-[10px] mb-[10px]">
                  <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--fg-subtle)]">
                    {exp.period}
                  </span>
                  {exp.isCurrent && (
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.07em] font-medium px-[7px] py-[2px] rounded-full"
                      style={{
                        background:
                          'color-mix(in srgb, var(--accent) 14%, transparent)',
                        color: 'var(--accent)'
                      }}
                    >
                      Current
                    </span>
                  )}
                  {exp.duration && (
                    <span className="font-mono text-[10.5px] text-[var(--fg-subtle)] ml-auto">
                      {exp.duration}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="text-[17px] font-medium tracking-[-0.01em] leading-[1.3] text-[var(--fg)] m-0 mb-3">
                  {exp.title}
                </h4>

                {/* Description */}
                {exp.desc && (
                  <p className="text-[var(--fg-muted)] text-[14px] leading-[1.55] m-0">
                    {exp.desc}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Experience;
