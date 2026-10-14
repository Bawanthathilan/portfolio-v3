import React from 'react';
import Link from 'next/link';
import useSupabaseBrowser from '@/utils/supabase-browser';
import { getGuestbookData } from '@/queries';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { Card, Pen, Section } from '@/components/v3';
import { comments } from '@/data';

const QUOTE_TINTS = [
  'text-pink-400',
  'text-deep-purple-400',
  'text-amber-400',
  'text-light-blue-400',
  'text-green-400'
];

const Guestbook = () => {
  const supabase = useSupabaseBrowser();
  const { data, count } = useQuery(getGuestbookData(supabase));

  // Fall back to the static testimonials until the guestbook has entries.
  const notes = data?.length
    ? data.map((g) => ({ name: g.username ?? 'Anonymous', text: g.message }))
    : comments.map((c) => ({ name: c.name, text: c.comment }));

  return (
    <Section
      id="guestbook"
      title="guestbook"
      meta={`${count ?? notes.length} signed`}
      action={{ label: 'Read them all', href: '/guestbook' }}
    >
      <div className="grid gap-2 sm:grid-cols-3">
        {notes.slice(0, 5).map((n, i) => (
          <Card key={i} className="flex min-h-[140px] flex-col p-4">
            <p className="line-clamp-3 text-[13px] leading-[1.6] text-[var(--fg)]">
              <span className={`mr-0.5 ${QUOTE_TINTS[i % QUOTE_TINTS.length]}`}>
                &ldquo;
              </span>
              {n.text}
            </p>
            <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-[var(--fg-muted)]">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--card-hover)] text-[10px] text-[var(--fg)]">
                {n.name.charAt(0)}
              </span>
              <span className="truncate">{n.name}</span>
            </div>
          </Card>
        ))}
        <Link
          href="/guestbook"
          className="group flex min-h-[140px] flex-col justify-between rounded-2xl border border-dashed border-[var(--line-strong)] p-4 text-[var(--fg-muted)] transition-colors hover:bg-[var(--card)] hover:text-[var(--fg)]"
        >
          <Pen size={16} />
          <span className="text-[13px]">Leave a note</span>
        </Link>
      </div>
    </Section>
  );
};

export default Guestbook;
