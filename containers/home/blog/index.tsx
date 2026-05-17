import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface MediumPost {
  title: string;
  link: string;
  content?: string;
  pubDate: string;
  thumbnail?: string;
  categories?: string[];
}

const MEDIUM_URL = 'https://medium.com/@bawantharathnayaka';

const fetchPosts = async (): Promise<MediumPost[]> => {
  const res = await fetch(
    `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@bawantharathnayaka`
  );
  const data = await res.json();
  return data.items || [];
};

const ArrowDiag = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

const ArrowRight = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

const Blog = () => {
  const { data: posts = [] } = useQuery<MediumPost[]>({
    queryKey: ['medium-posts'],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 10
  });

  const featured = posts[0] || {
    title:
      'The quiet art of deleting code: how shipping less made our team faster',
    link: MEDIUM_URL,
    pubDate: '2026-05-01'
  };
  const mini =
    posts.slice(1, 3).length > 0
      ? posts.slice(1, 3)
      : [
          {
            title: "Designing APIs you'd actually want to consume",
            link: MEDIUM_URL,
            pubDate: '2026-04-01'
          },
          {
            title: 'A small case for boring databases',
            link: MEDIUM_URL,
            pubDate: '2026-03-01'
          }
        ];

  const extractFirstImage = (html: any): any | null => {
    if (typeof window === 'undefined') return null;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.querySelector('img')?.getAttribute('src') || null;
  };

  const thumbnail = extractFirstImage(featured?.content || '');

  const formatDate = (dateStr: string) => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    try {
      const d = new Date(dateStr);
      return `${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="writing" className="port-wrap port-section">
      <div className="section-head">
        <span className="section-num">08 / writing</span>
        <h2 className="section-title">Latest from the blog</h2>
        <span className="section-kicker">also on medium</span>
      </div>

      <div className="blog-grid">
        {/* Featured post */}
        <a
          className="blog-feature-card"
          href={featured.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* Cover placeholder */}
          <div className="relative aspect-[16/8] rounded-[10px] hatch-bg border border-[var(--line-strong)] overflow-hidden grid place-items-center">
            <span className="bg-[var(--bg-elev)] px-2.5 py-1.5 rounded-[6px] font-mono text-[11px] text-[var(--fg-muted)] border border-[var(--line)]">
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                '[ cover · latest ]'
              )}
            </span>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 font-mono text-[11.5px] text-[var(--fg-subtle)]">
            <span className="text-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-2 py-[3px] rounded-full text-[10.5px] uppercase tracking-[0.06em]">
              latest
            </span>
            <span>{formatDate(featured.pubDate)}</span>
            <span>·</span>
            <span>8 min read</span>
          </div>

          <h3 className="text-2xl font-medium tracking-[-0.02em] leading-[1.25] text-[var(--fg)]">
            {featured.title}
          </h3>

          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--fg)]">
              Read on Medium <ArrowRight />
            </span>
            <div className="blog-arrow w-[30px] h-[30px] rounded-lg bg-[var(--bg)] border border-[var(--line)] grid place-items-center text-[var(--fg)]">
              <ArrowDiag />
            </div>
          </div>
        </a>

        {/* Side column */}
        <div className="flex flex-col gap-3.5">
          {/* Medium CTA */}
          <a
            href={MEDIUM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[var(--fg)] text-[var(--bg)] rounded-2xl p-7 flex flex-col justify-between no-underline relative overflow-hidden min-h-[200px] transition-opacity duration-150 hover:opacity-[0.92]"
          >
            <span className="absolute bottom-[-30px] right-[-20px] font-serif italic text-[200px] leading-none opacity-[0.08] pointer-events-none text-[var(--bg)]">
              M
            </span>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.08em] opacity-60 mb-3.5">
                Find me on
              </div>
              <div className="text-[22px] font-medium tracking-[-0.015em] leading-[1.25]">
                All my essays, notes & long-form writing live on Medium.
              </div>
            </div>
            <div className="flex items-center justify-between mt-[18px] font-mono text-xs opacity-85 relative z-[1]">
              <span>medium.com/@bawantharathnayaka</span>
              <ArrowDiag />
            </div>
          </a>

          {/* Mini posts */}
          {mini.map((post, i) => (
            <a
              key={i}
              className="blog-mini-card"
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="font-mono text-[11px] text-[var(--fg-subtle)]">
                {formatDate(post.pubDate)} · 5 min
              </div>
              <div className="text-[14.5px] font-medium tracking-[-0.01em] text-[var(--fg)]">
                {post.title}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
