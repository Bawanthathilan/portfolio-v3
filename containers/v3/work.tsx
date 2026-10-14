import React, { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import useSupabaseBrowser from '@/utils/supabase-browser';
import { getWorkData } from '@/queries';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { Chevron, Section } from '@/components/v3';
import { cn } from '@/utils/cn';

// Company logos in /public/logos, keyed by lowercase `Company_name`.
const LOGOS: Record<string, string> = {
  'orel it': '/logos/orel-it.png',
  openmrs: '/logos/openmrs.png',
  'apium innovations': '/logos/apium.jpg'
};

// Short `Desc` values are job titles; longer ones are expandable details.
const isTitle = (desc: string | null) => !!desc && desc.length <= 80;

const isCurrent = (end: string | null) =>
  !end || ['current', 'now', 'present'].includes(end.toLowerCase());

const Work = () => {
  const supabase = useSupabaseBrowser();
  const { data } = useQuery(getWorkData(supabase));
  const [open, setOpen] = useState(0);

  const items = data ?? [];

  return (
    <Section
      id="work"
      title="work"
      meta={String(items.length).padStart(2, '0')}
    >
      <ul className="space-y-1">
        {items.map((w, i) => {
          const expandable = !!w.Desc && !isTitle(w.Desc);
          const expanded = expandable && open === i;
          const name = w.Company_name ?? '';
          const period = `${w.startYear ?? ''} – ${
            isCurrent(w.endYear) ? 'Present' : w.endYear
          }`;
          return (
            <li key={w.id}>
              <button
                type="button"
                onClick={() => expandable && setOpen(expanded ? -1 : i)}
                aria-expanded={expandable ? expanded : undefined}
                className="-mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-[var(--card)]"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-[var(--card-hover)] text-[13px] font-semibold text-[var(--fg)] ring-1 ring-inset ring-[var(--line)]">
                  {LOGOS[name.trim().toLowerCase()] ? (
                    <Image
                      src={LOGOS[name.trim().toLowerCase()]}
                      alt=""
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    name.charAt(0)
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-[var(--fg)]">
                    {name}
                  </span>
                  {isTitle(w.Desc) && (
                    <span className="block truncate text-[13px] text-[var(--fg-muted)]">
                      {w.Desc}
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-xs tabular-nums text-[var(--fg-muted)]">
                  {period}
                </span>
                <Chevron
                  className={cn(
                    'shrink-0 text-[var(--fg-muted)] transition-transform duration-200 ease-in-out',
                    expanded && 'rotate-180',
                    !expandable && 'invisible'
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    // Height morphs on screen (ease-in-out); opacity leads on
                    // enter and finishes early on the faster exit.
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: 'auto',
                      opacity: 1,
                      transition: {
                        height: { duration: 0.25, ease: [0.77, 0, 0.175, 1] },
                        opacity: { duration: 0.2, delay: 0.05, ease: 'easeOut' }
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
                    <p className="whitespace-pre-line pb-4 pl-11 pt-1 text-sm leading-[1.65] text-[var(--fg-muted)]">
                      {w.Desc}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </Section>
  );
};

export default Work;
