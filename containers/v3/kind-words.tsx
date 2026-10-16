import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Card, Section } from '@/components/v3';
import { recommendation } from '@/data/profile';

// One LinkedIn recommendation, with its key phrase marked by a highlighter
// stroke that sweeps in as the section reveals (`.marker` in globals.scss).
const KindWords = () => {
  const { quote, highlight, name, role, link, avatar, profile } =
    recommendation;
  const at = quote.indexOf(highlight);

  return (
    <Section id="kind-words" title="kind words">
      <Card className="p-5">
        <figure>
          <blockquote className="text-[15px] leading-[1.7] text-[var(--fg)] [text-wrap:pretty]">
            <span className="mr-0.5 text-amber-400" aria-hidden>
              &ldquo;
            </span>
            {at === -1 ? (
              quote
            ) : (
              <>
                {quote.slice(0, at)}
                <mark className="marker bg-transparent text-inherit">
                  {highlight}
                </mark>
                {quote.slice(at + highlight.length)}
              </>
            )}
            <span className="ml-0.5 text-amber-400" aria-hidden>
              &rdquo;
            </span>
          </blockquote>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <figcaption>
              {/* Photo and name link to the recommender's LinkedIn */}
              <Link
                href={profile}
                target="_blank"
                aria-label={`${name}, ${role}, on LinkedIn`}
                className="group/author flex items-center gap-3 rounded-full transition-transform duration-150 ease-out active:scale-[0.985]"
              >
                <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--card-hover)] text-sm font-medium text-[var(--fg)] ring-1 ring-[var(--line)]">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt=""
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  ) : (
                    name.charAt(0)
                  )}
                </span>
                <span>
                  <span className="block text-sm font-medium text-[var(--fg)] underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-150 group-hover/author:decoration-[var(--line-strong)]">
                    {name}
                  </span>
                  <span className="block text-[13px] text-[var(--fg-muted)]">
                    {role}
                  </span>
                </span>
              </Link>
            </figcaption>
            <Link
              href={link}
              target="_blank"
              className="group inline-flex items-center gap-1 text-[13px] text-[var(--fg-muted)] transition-colors duration-150 hover:text-[var(--fg)]"
            >
              Read on LinkedIn
              <ArrowUpRight className="transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </figure>
      </Card>
    </Section>
  );
};

export default KindWords;
