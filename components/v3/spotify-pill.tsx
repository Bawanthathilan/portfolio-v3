import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from '@/components/v3';
import { cardMotion, useHoverCard } from '@/components/v3/hover-card';

interface Track {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumImageUrl?: string;
  songUrl?: string;
  playedAt?: string;
}

const SPOTIFY_GREEN = '#1ed760';

const SpotifyLogo = ({ size = 13 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 168 168"
    fill={SPOTIFY_GREEN}
    aria-hidden="true"
  >
    <path d="M83.996.277C37.747.277.253 37.77.253 84.019c0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738zm38.404 120.78a5.217 5.217 0 01-7.18 1.73c-19.662-12.01-44.414-14.73-73.564-8.07a5.222 5.222 0 01-6.249-3.93 5.213 5.213 0 013.926-6.25c31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-.903-8.148-4.35-1.04-3.453.907-7.093 4.354-8.143 30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-.001zm.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219a7.835 7.835 0 015.221-9.771c29.581-8.98 78.756-7.245 109.83 11.202a7.823 7.823 0 012.74 10.733c-2.2 3.722-7.02 4.949-10.73 2.739z" />
  </svg>
);

// Equaliser bars (`.eq-bar` in globals.scss). The global reduced-motion rule
// stops them.
const Bars = () => (
  <span className="inline-flex h-[10px] items-end gap-[2px]" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="eq-bar h-full w-[2px] rounded-[1px]"
        style={{ background: SPOTIFY_GREEN }}
      />
    ))}
  </span>
);

function timeAgo(iso?: string) {
  if (!iso) return '';
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

const SpotifyPill = () => {
  const { open, toggle, wrapperProps } = useHoverCard();
  const { data } = useQuery<Track>({
    queryKey: ['spotify'],
    queryFn: async () => (await fetch('/api/spotify')).json(),
    // Polls only while the tab is visible (react-query's default).
    refetchInterval: 30_000
  });

  const hasTrack = !!data?.title;
  const live = !!data?.isPlaying && hasTrack;
  const status = live
    ? 'Listening now'
    : hasTrack
      ? `Last played ${timeAgo(data?.playedAt)}`.trim()
      : 'Not playing right now';

  const pillRow = (
    <span className="flex min-w-0 items-center gap-2 text-xs text-[var(--fg)]">
      <SpotifyLogo />
      {live && <Bars />}
      <span className="max-w-[180px] truncate sm:max-w-[220px]">
        {hasTrack ? data?.title : 'Spotify'}
      </span>
      {hasTrack && (
        <span className="hidden max-w-[120px] truncate text-[var(--fg-muted)] sm:inline">
          {data?.artist}
        </span>
      )}
    </span>
  );

  return (
    <div className="relative inline-block" {...wrapperProps}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={`Spotify: ${status}`}
        className="rounded-full bg-[var(--card)] px-3 py-1.5 transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--card-hover)] active:scale-[0.96]"
      >
        {pillRow}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Spotify"
            {...cardMotion}
            className="absolute left-0 top-0 z-30 w-[320px] max-w-[calc(100vw-32px)] rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 shadow-2xl"
          >
            <div className="-mt-0.5">{pillRow}</div>

            <div className="mt-4 flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[var(--card-hover)]">
                {data?.albumImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.albumImageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center">
                    <SpotifyLogo size={20} />
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[11px] text-[var(--fg-muted)]">
                  {live && <Bars />}
                  {status}
                </p>
                <p className="mt-0.5 truncate text-sm font-medium text-[var(--fg)]">
                  {hasTrack ? data?.title : 'Nothing on the speakers'}
                </p>
                <p className="truncate text-[13px] text-[var(--fg-muted)]">
                  {hasTrack ? data?.artist : 'Check back later'}
                </p>
              </div>
            </div>

            {data?.songUrl && (
              <a
                href={data.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-4 inline-flex items-center gap-1 text-[13px] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
              >
                Open in Spotify
                <ArrowUpRight className="transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpotifyPill;
