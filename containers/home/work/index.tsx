import React from 'react';
import Image from 'next/image';
import useSupabaseBrowser from '@/utils/supabase-browser';
import { getProjectsData } from '@/queries';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { Project } from '@/utils/types';

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

const FALLBACK: Project[] = [
  {
    id: 1,
    name: 'Lumoz Studio',
    desc: 'Realtime AR based tool for Digital Media Creators',
    img: null,
    web: '#',
    github: null,
    category: 'apps',
    tech: ['React', 'Node', 'Threejs']
  },
  {
    id: 2,
    name: 'Portfolio v3',
    desc: 'This very site — a complete redesign focused on clarity, warmth, and memorable typography.',
    img: null,
    web: '#',
    github: null,
    category: 'Web',
    tech: ['Next.js', 'Supabase', 'Tailwind']
  },
  {
    id: 3,
    name: 'Dev Tools Collection',
    desc: 'Open source tooling for developers. CLI utilities and automation scripts.',
    img: null,
    web: '#',
    github: null,
    category: 'utils',
    tech: ['TypeScript', 'Node']
  },
  {
    id: 4,
    name: 'SaaS Analytics Platform',
    desc: 'Full analytics dashboard with real-time data and billing integration.',
    img: null,
    web: '#',
    github: null,
    category: 'apps',
    tech: ['React', 'Node', 'Postgres']
  },
  {
    id: 5,
    name: 'Cloud Infrastructure Setup',
    desc: 'Cloud-native infrastructure for a fast-growing startup, including CI/CD pipelines.',
    img: null,
    web: '#',
    github: null,
    category: 'infrastructure',
    tech: ['AWS', 'Docker', 'Kubernetes']
  },
  {
    id: 6,
    name: 'Blog Engine',
    desc: 'A minimal, fast blog engine — clean markdown and a tiny RSS feed.',
    img: null,
    web: '#',
    github: null,
    category: 'Web',
    tech: ['Next.js', 'Markdown']
  }
];

const Work = () => {
  const supabase = useSupabaseBrowser();
  const { data: projects, isLoading } = useQuery(getProjectsData(supabase));

  const items: Project[] =
    projects && projects.length > 0
      ? (projects as unknown as Project[])
      : FALLBACK;

  return (
    <section id="work" className="port-wrap port-section">
      <div className="section-head">
        <span className="section-num">02 / work</span>
        <h2 className="section-title">Selected projects</h2>
        <span className="section-kicker">2022 — 2026</span>
      </div>

      {isLoading ? (
        <div className="text-[var(--fg-muted)] font-mono text-[13px]">
          Loading projects…
        </div>
      ) : (
        <div className="proj-grid">
          {items.slice(0, 6).map((project: Project, i: number) => {
            const isFeatured = i === 0;
            const href = project.web || project.github || '#';
            const isExternal = !!href && href !== '#';

            return (
              <a
                key={project.id}
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className={`proj-card${isFeatured ? ' proj-feature' : ''} relative overflow-hidden`}
              >
                {/* Image overlay */}
                {project.img && (
                  <>
                    <Image
                      src={project.img}
                      alt={project.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/50 z-[1]" />
                  </>
                )}

                {isFeatured ? (
                  <div className="relative z-[2] grid grid-cols-[1fr_auto] gap-8 items-center">
                    <div className="flex flex-col gap-3.5">
                      <span
                        className={`font-mono text-[11px] uppercase tracking-[0.08em] ${project.img ? 'text-white/60' : 'text-[var(--fg-subtle)]'}`}
                      >
                        {project.category}
                      </span>
                      <h3
                        className={`text-2xl font-medium tracking-[-0.015em] ${project.img ? 'text-white' : 'text-[var(--fg)]'}`}
                      >
                        {project.name}
                      </h3>
                      <p
                        className={`text-[14.5px] leading-[1.55] -mt-1 ${project.img ? 'text-white/70' : 'text-[var(--fg-muted)]'}`}
                      >
                        {project.desc}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech.map((t: string) => (
                          <span key={t} className="port-chip">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="proj-arrow w-[30px] h-[30px] rounded-lg bg-[var(--bg)] border border-[var(--line)] grid place-items-center">
                      <ArrowDiag />
                    </div>
                  </div>
                ) : (
                  <div className="relative z-[2] flex flex-col gap-2.5 h-full">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-mono text-[11px] uppercase tracking-[0.08em] ${project.img ? 'text-white/60' : 'text-[var(--fg-subtle)]'}`}
                      >
                        {project.category}
                      </span>
                      <div className="proj-arrow w-[30px] h-[30px] rounded-lg bg-[var(--bg)] border border-[var(--line)] grid place-items-center">
                        <ArrowDiag />
                      </div>
                    </div>
                    <h3
                      className={`text-xl font-medium tracking-[-0.015em] ${project.img ? 'text-white' : 'text-[var(--fg)]'}`}
                    >
                      {project.name}
                    </h3>
                    <p
                      className={`text-[14.5px] leading-[1.55] -mt-1 ${project.img ? 'text-white/70' : 'text-[var(--fg-muted)]'}`}
                    >
                      {project.desc}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-1.5">
                      {project.tech.map((t: string) => (
                        <span key={t} className="port-chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Work;
