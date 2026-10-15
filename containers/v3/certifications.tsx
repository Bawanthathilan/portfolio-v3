import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useSupabaseBrowser from '@/utils/supabase-browser';
import { getCertificationsData } from '@/queries';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { ArrowUpRight, Section } from '@/components/v3';

// Keep hyphenated codes like "AZ-900" on one line instead of splitting at
// the hyphen.
const keepHyphenated = (text: string) =>
  text.split(' ').map((word, i) => (
    <React.Fragment key={i}>
      {i > 0 && ' '}
      {word.includes('-') ? (
        <span className="whitespace-nowrap">{word}</span>
      ) : (
        word
      )}
    </React.Fragment>
  ));

const Certifications = () => {
  const supabase = useSupabaseBrowser();
  const { data } = useQuery(getCertificationsData(supabase));
  const certs = data ?? [];

  if (!certs.length) return null;

  return (
    <Section
      id="certifications"
      title="certifications"
      meta={String(certs.length).padStart(2, '0')}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        {certs.map((c) => {
          const meta = [c.issuer, c.year].filter(Boolean).join(' · ');
          return (
            <Link
              key={c.id}
              href={c.link ?? '#'}
              target="_blank"
              aria-label={`${c.name}${meta ? `, ${meta}` : ''}, verify on Credly`}
              className="group flex items-center gap-4 rounded-2xl bg-[var(--card)] p-3 transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--card-hover)] active:scale-[0.985]"
            >
              {/* Tilts in quickly on hover, springs back on leave */}
              <span className="relative h-14 w-14 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-6 group-hover:scale-105 group-hover:duration-200 group-hover:ease-out group-focus-visible:-rotate-6 group-focus-visible:scale-105">
                {c.badge && (
                  <Image
                    src={c.badge}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-contain"
                  />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium leading-snug text-[var(--fg)]">
                  {keepHyphenated(c.name)}
                </span>
                {meta && (
                  <span className="mt-0.5 block text-[13px] text-[var(--fg-muted)]">
                    {meta}
                  </span>
                )}
              </span>
              <ArrowUpRight className="shrink-0 self-start text-[var(--fg-muted)] transition-[transform,color] duration-150 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--fg)]" />
            </Link>
          );
        })}
      </div>
    </Section>
  );
};

export default Certifications;
