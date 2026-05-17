import React from 'react';
import useSupabaseBrowser from '@/utils/supabase-browser';
import { getAchievementsData } from '@/queries';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';

const ArrowDiag = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

const Achievements = () => {
  const supabase = useSupabaseBrowser();
  const { data: achievements, isLoading } = useQuery(
    getAchievementsData(supabase)
  );

  return (
    <section id="achievements" className="port-wrap port-section">
      <div className="section-head">
        <span className="section-num">07 / achievements</span>
        <h2 className="section-title">Awards &amp; recognition</h2>
        <span className="section-kicker">
          research · open source · industry
        </span>
      </div>

      {isLoading ? (
        <div className="text-[var(--fg-muted)] font-mono text-[13px] py-6">
          Loading…
        </div>
      ) : (
        <div className="ach-grid">
          {(achievements ?? []).map((a: any, i: number) => (
            <a
              key={i}
              className="ach-card"
              href={a.link || '#'}
              target={a.link ? '_blank' : undefined}
              rel={a.link ? 'noopener noreferrer' : undefined}
            >
              <div className="ach-img-wrap">
                {a.image ? (
                  <img
                    src={a.image}
                    alt={a.name || a.title || ''}
                    className="ach-img"
                    loading="lazy"
                  />
                ) : (
                  <span className="font-mono text-[18px] font-semibold text-[var(--fg-subtle)] bg-[var(--bg-elev)] px-2 py-1.5 rounded-[6px]">
                    ✦
                  </span>
                )}
              </div>

              <div className="ach-body">
                <div className="ach-meta">
                  <span className="ach-tag">{a.tag || a.year || 'Award'}</span>
                  <div className="ach-arrow">
                    <ArrowDiag />
                  </div>
                </div>
                <div className="ach-name">{a.name}</div>
                <p className="ach-desc">{a.desc}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
};

export default Achievements;
