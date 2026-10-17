import React, { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import useSupabaseBrowser from '@/utils/supabase-browser';
import { getAchievementsData } from '@/queries';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { ArrowUpRight, Chevron, Section } from '@/components/v3';
import { cn } from '@/utils/cn';
import { Bone, SkeletonStatus } from '@/components/lab/skeleton';

// One line per highlight, like the collapsed rows.
const HighlightsSkeleton = () => (
  <SkeletonStatus label="Loading highlights">
    <ul>
      {['w-64', 'w-48', 'w-72', 'w-56', 'w-44'].map((width, i) => (
        <li key={i} className="flex items-center justify-between gap-4 py-3">
          <Bone className={`h-3 max-w-[80%] ${width}`} />
          <Bone className="h-2.5 w-2.5 shrink-0" />
        </li>
      ))}
    </ul>
  </SkeletonStatus>
);

const Highlights = () => {
  const supabase = useSupabaseBrowser();
  const { data, isLoading } = useQuery(getAchievementsData(supabase));
  const items = data ?? [];
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Section
      id="highlights"
      title="highlights"
      meta={isLoading ? '··' : String(items.length).padStart(2, '0')}
    >
      {isLoading ? (
        <HighlightsSkeleton />
      ) : (
        <ul className="dim-siblings">
          {items.map((a) => {
            // Rows with a description expand to show it in full; the rest are
            // plain links.
            if (!a.desc) {
              return (
                <li key={a.id} className="py-2.5">
                  {a.link ? (
                    <Link
                      href={a.link}
                      target="_blank"
                      className="text-sm text-[var(--fg)] underline decoration-[var(--line-strong)] underline-offset-[5px] transition-[text-decoration-color] duration-150 hover:decoration-[var(--fg)]"
                    >
                      {a.name}
                    </Link>
                  ) : (
                    <span className="text-sm text-[var(--fg)]">{a.name}</span>
                  )}
                </li>
              );
            }

            const expanded = open === a.id;
            return (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : a.id)}
                  aria-expanded={expanded}
                  className="group flex w-full items-start justify-between gap-4 py-2.5 text-left"
                >
                  <span className="text-sm text-[var(--fg)]">{a.name}</span>
                  <Chevron
                    className={cn(
                      'mt-1 shrink-0 text-[var(--fg-muted)] transition-[transform,color] duration-[250ms] ease-out group-hover:text-[var(--fg)]',
                      expanded && 'rotate-180'
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      // Same motion as the work rows: height morphs on screen,
                      // opacity leads on enter and finishes early on exit.
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: 'auto',
                        opacity: 1,
                        transition: {
                          height: { duration: 0.25, ease: [0.77, 0, 0.175, 1] },
                          opacity: {
                            duration: 0.2,
                            delay: 0.05,
                            ease: 'easeOut'
                          }
                        }
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.2, ease: [0.77, 0, 0.175, 1] },
                          opacity: { duration: 0.1 }
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pb-3 pr-6 text-sm leading-[1.65] text-[var(--fg-muted)]">
                        <p>{a.desc}</p>
                        {a.link && (
                          <Link
                            href={a.link}
                            target="_blank"
                            className="group/view mt-2 inline-flex items-center gap-1 text-[13px] text-[var(--fg)] underline decoration-[var(--line-strong)] underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-[var(--fg)]"
                          >
                            View
                            <ArrowUpRight className="transition-transform duration-150 ease-out group-hover/view:-translate-y-0.5 group-hover/view:translate-x-0.5" />
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
};

export default Highlights;
