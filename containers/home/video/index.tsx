import React, { useState } from 'react';

const VIDEO_ID = '5ow7YhMKrs0';

const Video = () => {
  const [playing, setPlaying] = useState(false);

  const play = () => setPlaying(true);

  return (
    <section id="video" className="port-wrap port-section">
      <div className="section-head">
        <span className="section-num">03 / featured</span>
        <h2 className="section-title">Watch on YouTube</h2>
        <span className="section-kicker">talks · walkthroughs</span>
      </div>

      <div className="video-wrap">
        <div
          className="video-frame"
          onClick={!playing ? play : undefined}
          role={!playing ? 'button' : undefined}
          tabIndex={!playing ? 0 : undefined}
          aria-label={!playing ? 'Play video' : undefined}
          onKeyDown={
            !playing
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    play();
                  }
                }
              : undefined
          }
        >
          {playing ? (
            <iframe
              src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0 bg-black z-[5]"
            />
          ) : (
            <>
              {/* Badge */}
              <div className="absolute top-4 left-4 z-[2] inline-flex items-center gap-[7px] px-[11px] py-[6px] bg-black/60 backdrop-blur-sm border border-white/[0.18] rounded-full font-mono text-[11px] text-white tracking-[0.04em]">
                <span className="w-2 h-2 rounded-[2px] bg-[#ff0033] inline-block" />
                YouTube · Featured
              </div>

              {/* Thumbnail */}
              <img
                className="video-thumb"
                src={`https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
                alt="Featured YouTube video thumbnail"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`;
                }}
              />

              {/* Play button */}
              <div className="video-play-btn" aria-hidden="true">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="ml-1"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-6 px-[22px] py-[18px] border-t border-[var(--line)] bg-[var(--bg-elev)] flex-wrap">
          {[
            { k: 'Source', v: 'YouTube' },
            { k: 'Format', v: 'Walkthrough · Long-form' },
            { k: 'Status', v: '● Watch now', green: true }
          ].map((m) => (
            <div key={m.k} className="flex flex-col gap-0.5">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">
                {m.k}
              </span>
              <span
                className={`text-[13.5px] font-medium ${(m as any).green ? 'text-[oklch(0.65_0.14_150)]' : 'text-[var(--fg)]'}`}
              >
                {m.v}
              </span>
            </div>
          ))}

          <div className="ml-auto flex gap-2">
            <a
              href={`https://www.youtube.com/watch?v=${VIDEO_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[7px] px-3.5 py-[9px] rounded-[9px] bg-[var(--bg)] border border-[var(--line)] text-[var(--fg)] no-underline text-[13px] font-medium transition-all duration-150 hover:bg-[var(--chip)] hover:border-[var(--line-strong)]"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
              Open on YouTube
            </a>
            {!playing && (
              <button
                onClick={play}
                className="inline-flex items-center gap-[7px] px-3.5 py-[9px] rounded-[9px] bg-[var(--fg)] border border-[var(--fg)] text-[var(--bg)] text-[13px] font-medium transition-opacity duration-150 hover:opacity-90 cursor-pointer"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play here
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Video;
