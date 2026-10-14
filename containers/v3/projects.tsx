import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useSupabaseBrowser from '@/utils/supabase-browser';
import { getProjectsData } from '@/queries';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { useRepoStars } from '@/queries/github';
import { ArrowUpRight, Section, Star } from '@/components/v3';
import { profile } from '@/data/profile';

// Soft top-left wash per card, cycled by index.
const TINTS = [
  'from-pink-500/[0.10]',
  'from-light-blue-500/[0.10]',
  'from-amber-500/[0.10]',
  'from-deep-purple-500/[0.10]',
  'from-green-500/[0.10]',
  'from-orange-500/[0.10]'
];

type Project = {
  id: number;
  name: string | null;
  desc: string | null;
  img: string | null;
  web: string | null;
  github: string | null;
};

const ProjectCard = ({ p, i }: { p: Project; i: number }) => {
  const { data: stars } = useRepoStars(p.github);
  const href = p.web && p.web !== '#' ? p.web : p.github ?? '#';

  return (
    <Link
      href={href}
      target="_blank"
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-[var(--card)] bg-gradient-to-br ${
        TINTS[i % TINTS.length]
      } to-transparent p-3 transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--card-hover)] active:scale-[0.98]`}
    >
      <div className="flex items-start justify-between">
        <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-[var(--bg)] text-sm font-semibold text-[var(--fg)]">
          {p.img ? (
            <Image
              src={p.img}
              alt=""
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            p.name?.charAt(0)
          )}
        </span>
        <span className="flex items-center gap-2 pr-1 pt-1 text-xs text-[var(--fg-muted)]">
          {!!stars && (
            <span className="flex items-center gap-1 tabular-nums">
              <Star className="text-amber-400" /> {stars.toLocaleString()}
            </span>
          )}
          <ArrowUpRight className="transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
      <div className="px-1 pb-1 pt-7">
        <h3 className="text-[15px] font-medium text-[var(--fg)]">{p.name}</h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-[1.55] text-[var(--fg-muted)]">
          {p.desc}
        </p>
      </div>
    </Link>
  );
};

const Projects = () => {
  const supabase = useSupabaseBrowser();
  const { data } = useQuery(getProjectsData(supabase));
  const projects = (data ?? []) as Project[];

  return (
    <Section
      id="projects"
      title="projects"
      meta={String(projects.length).padStart(2, '0')}
      action={{
        label: 'All projects',
        href: `${profile.socials.github}?tab=repositories`
      }}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        {projects.slice(0, 6).map((p, i) => (
          <ProjectCard key={p.id} p={p} i={i} />
        ))}
      </div>
    </Section>
  );
};

export default Projects;
