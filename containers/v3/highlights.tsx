import React from 'react';
import Link from 'next/link';
import useSupabaseBrowser from '@/utils/supabase-browser';
import { getAchievementsData } from '@/queries';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { Section } from '@/components/v3';

const Highlights = () => {
  const supabase = useSupabaseBrowser();
  const { data } = useQuery(getAchievementsData(supabase));
  const items = data ?? [];

  return (
    <Section
      id="highlights"
      title="highlights"
      meta={String(items.length).padStart(2, '0')}
    >
      <ul>
        {items.map((a) => (
          <li
            key={a.id}
            className="flex items-baseline justify-between gap-6 py-2.5"
          >
            {a.link ? (
              <Link
                href={a.link}
                target="_blank"
                className="text-sm text-[var(--fg)] underline decoration-[var(--line-strong)] underline-offset-[5px] transition-[text-decoration-color] hover:decoration-[var(--fg)]"
              >
                {a.name}
              </Link>
            ) : (
              <span className="text-sm text-[var(--fg)]">{a.name}</span>
            )}
            {a.desc && (
              <span className="hidden max-w-[40%] shrink-0 truncate text-right sm:block text-[13px] text-[var(--fg-muted)]">
                {a.desc}
              </span>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
};

export default Highlights;
