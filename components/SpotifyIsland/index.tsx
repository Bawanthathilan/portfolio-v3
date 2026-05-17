import React, { useEffect, useRef, useState } from 'react';

interface SpotifyData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

const SpotifyLogo = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 168 168" fill="currentColor">
    <path d="M83.996.277C37.747.277.253 37.77.253 84.019c0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738zm38.404 120.78a5.217 5.217 0 01-7.18 1.73c-19.662-12.01-44.414-14.73-73.564-8.07a5.222 5.222 0 01-6.249-3.93 5.213 5.213 0 013.926-6.25c31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-.903-8.148-4.35-1.04-3.453.907-7.093 4.354-8.143 30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-.001zm.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219a7.835 7.835 0 015.221-9.771c29.581-8.98 78.756-7.245 109.83 11.202a7.823 7.823 0 012.74 10.733c-2.2 3.722-7.02 4.949-10.73 2.739z" />
  </svg>
);

const WaveBar = () => (
  <span className="inline-flex items-end gap-[2px] h-[14px]">
    {[0, 1, 2, 3].map((i) => (
      <span
        key={i}
        className="inline-block w-[2.5px] rounded-[2px] bg-[#1ed760] origin-bottom h-full"
        style={{
          animation: 'wave-bar 0.9s ease-in-out infinite',
          animationDelay: `${i * 0.15}s`
        }}
      />
    ))}
  </span>
);

const PrevIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zM9.5 12l8.5 6V6z" />
  </svg>
);

const NextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" />
  </svg>
);

const PlayIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const ExternalIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

export const SpotifyIsland = () => {
  const [data, setData] = useState<SpotifyData>({ isPlaying: false });
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/spotify');
      const json = await res.json();
      setData(json);
    } catch {
      // silently fail — show "not playing" state
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
    intervalRef.current = setInterval(fetchData, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!mounted) return null;

  const handleIslandClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('a')
    )
      return;
    setExpanded((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement) !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setExpanded((p) => !p);
    }
    if (e.key === 'Escape') setExpanded(false);
  };

  const statusText = data.isPlaying
    ? 'Now playing'
    : 'Last played · Tap to view';
  const stateLabel = data.isPlaying ? 'Now playing' : 'Recently played';

  return (
    <div
      className={`spotify-island${expanded ? ' expanded' : ''}`}
      id="spotify-island"
      role="button"
      tabIndex={0}
      aria-label="Now playing on Spotify"
      onClick={handleIslandClick}
      onKeyDown={handleKeyDown}
    >
      {/* Logo / Album art */}
      <div className="island-logo-wrap">
        {data.albumImageUrl && expanded ? (
          <img src={data.albumImageUrl} alt="Album art" />
        ) : (
          <SpotifyLogo size={expanded ? 30 : 16} />
        )}
      </div>

      {/* Collapsed text */}
      <div className="island-collapsed-text">
        <span className="font-medium opacity-90">Spotify</span>
        <span className="text-white/35">·</span>
        {data.isPlaying && <WaveBar />}
        <span className="text-white/70 text-[12.5px]">
          {data.isPlaying && data.title ? data.title : statusText}
        </span>
      </div>

      {/* Expanded detail */}
      <div className="island-detail">
        <div className="island-row-top">
          <div className="island-track-info">
            <div className="island-track-meta">
              {data.isPlaying && <WaveBar />}
              <span>{stateLabel}</span>
            </div>
            <div className="island-track-title">
              {data.title || 'Nothing playing right now'}
            </div>
            <div className="island-track-artist">
              {data.artist || 'Spotify'}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="island-progress">
          <div
            className="island-progress-fill"
            style={{ width: data.isPlaying ? '38%' : '100%' }}
          />
        </div>
        <div className="island-times">
          <span>—:——</span>
          <span>—:——</span>
        </div>

        {/* Controls */}
        <div className="island-controls">
          <button aria-label="Previous">
            <PrevIcon />
          </button>
          <button
            className="island-play-btn"
            aria-label={data.isPlaying ? 'Pause' : 'Play'}
          >
            {data.isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button aria-label="Next">
            <NextIcon />
          </button>
        </div>

        {/* Open in Spotify */}
        {data.songUrl && (
          <a
            className="island-open-link"
            href={data.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Open in Spotify <ExternalIcon />
          </a>
        )}
      </div>
    </div>
  );
};

export default SpotifyIsland;
