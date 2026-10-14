import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Section } from '@/components/v3';
import { profile } from '@/data/profile';

interface MediumPost {
  title: string;
  link: string;
  pubDate: string;
}

const fetchPosts = async (): Promise<MediumPost[]> => {
  const res = await fetch(
    `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${profile.medium}`
  );
  const data = await res.json();
  return data.items || [];
};

const Writing = () => {
  const { data: posts = [] } = useQuery<MediumPost[]>({
    queryKey: ['medium-posts'],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 10
  });

  if (!posts.length) return null;

  return (
    <Section
      id="writing"
      title="writing"
      meta={String(posts.length).padStart(2, '0')}
      action={{ label: 'All writing', href: profile.socials.medium }}
    >
      <ul>
        {posts.slice(0, 5).map((post) => {
          // rss2json returns "YYYY-MM-DD HH:mm:ss"; make it ISO-parsable.
          const date = new Date(post.pubDate.replace(' ', 'T'));
          return (
            <li key={post.link}>
              <Link
                href={post.link}
                target="_blank"
                className="group flex items-baseline gap-6 py-2"
              >
                <span className="w-14 shrink-0 font-mono text-[11px] text-[var(--fg-muted)]">
                  {date.toLocaleDateString('en-US', { month: 'short' })} &apos;
                  {String(date.getFullYear()).slice(2)}
                </span>
                <span className="text-sm text-[var(--fg)] decoration-[var(--line-strong)] underline-offset-[5px] group-hover:underline">
                  {post.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
};

export default Writing;
