import React, { useState } from 'react';
import Link from 'next/link';
import { Card, Section } from '@/components/v3';
import { AvatarStack } from '@/components/lab/avatar-stack';
import { useMergedPrs } from '@/queries/github';

const monthYear = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit'
  });

const OpenSource = () => {
  const { data } = useMergedPrs();
  const [showAll, setShowAll] = useState(false);

  if (!data?.items.length) return null;

  const owners = Array.from(new Set(data.items.map((p) => p.owner)));
  const visible = showAll ? data.items : data.items.slice(0, 5);

  return (
    <Section id="open-source" title="open source" meta={`${data.total} merged`}>
      <div className="mb-4 flex items-center gap-3">
        <AvatarStack
          label="Organisations I've contributed to"
          max={6}
          people={owners.map((o) => ({
            name: o,
            avatar: `https://github.com/${o}.png?size=56`,
            href: `https://github.com/${o}`
          }))}
        />
        <p className="text-[13px] text-[var(--fg-muted)]">
          Shipped into{' '}
          <span className="text-[var(--fg)]">
            {owners.slice(0, 3).join(', ')}
          </span>
          {owners.length > 3 && ` and ${owners.length - 3} more`}
        </p>
      </div>

      <Card className="p-1.5">
        <ul>
          {visible.map((pr) => (
            <li key={pr.url}>
              <Link
                href={pr.url}
                target="_blank"
                className="group flex items-center gap-3 rounded-xl px-2.5 py-2.5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://github.com/${pr.owner}.png?size=56`}
                  alt=""
                  className="h-6 w-6 shrink-0 rounded-md"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] text-[var(--fg)] transition-colors duration-150 group-hover:text-[var(--fg-muted)]">
                    {pr.title}
                  </span>
                  <span className="block truncate font-mono text-[11px] text-[var(--fg-muted)]">
                    {pr.owner}/{pr.repo}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-[11px] text-[var(--fg-muted)]">
                  {monthYear(pr.closedAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      {data.items.length > 5 && (
        <button
          type="button"
          onClick={() => setShowAll((s) => !s)}
          className="mt-3 text-[13px] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
        >
          {showAll ? 'Show less' : `Show latest ${data.items.length}`}
        </button>
      )}
    </Section>
  );
};

export default OpenSource;
