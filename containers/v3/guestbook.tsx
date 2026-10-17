import React from 'react';
import Link from 'next/link';
import useSupabaseBrowser from '@/utils/supabase-browser';
import { getGuestbookData } from '@/queries';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { Card, Pen, Section } from '@/components/v3';
import { comments } from '@/data';
import { Bone, SkeletonStatus } from '@/components/lab/skeleton';

const QUOTE_TINTS = [
  'text-pink-400',
  'text-deep-purple-400',
  'text-amber-400',
  'text-light-blue-400',
  'text-green-400'
];

// Note cards: three lines of text and the signer.
const NotesSkeleton = () => (
  <>
    {['w-3/4', 'w-1/2', 'w-2/3', 'w-3/5', 'w-1/2'].map((last, i) => (
      <Card key={i} className="flex min-h-[140px] flex-col p-4">
        <span className="space-y-2">
          <Bone className="h-2.5 w-full" />
          <Bone className="h-2.5 w-full" />
          <Bone className={`h-2.5 ${last}`} />
        </span>
        <span className="mt-auto flex items-center gap-2 pt-4">
          <Bone className="h-5 w-5 shrink-0" />
          <Bone className="h-2.5 w-16" />
        </span>
      </Card>
    ))}
  </>
);

const Guestbook = () => {
  const supabase = useSupabaseBrowser();
  const { data, count, isLoading } = useQuery(getGuestbookData(supabase));

  // Fall back to the static testimonials until the guestbook has entries.
  const notes = data?.length
    ? data.map((g) => ({ name: g.username ?? 'Anonymous', text: g.message }))
    : comments.map((c) => ({ name: c.name, text: c.comment }));

  return (
    <Section
      id="guestbook"
      title="guestbook"
      meta={isLoading ? '·· signed' : `${count ?? notes.length} signed`}
      action={{ label: 'Read them all', href: '/guestbook' }}
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {isLoading ? (
          <SkeletonStatus label="Loading guestbook" className="contents">
            <NotesSkeleton />
          </SkeletonStatus>
        ) : (
          notes.slice(0, 5).map((n, i) => (
            <Card key={i} className="flex min-h-[140px] flex-col p-4">
              <p className="line-clamp-3 text-[13px] leading-[1.6] text-[var(--fg)]">
                <span
                  className={`mr-0.5 ${QUOTE_TINTS[i % QUOTE_TINTS.length]}`}
                >
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
          ))
        )}
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
