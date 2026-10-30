import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Section } from '@/components/v3';
import { usePlayedGames } from '@/queries/psn';
import type { PlayedGame } from '@/pages/api/psn/games';
import { Dialog } from '@/components/lab/dialog';
import { Spinner } from '@/components/lab/spinner';
import { cn } from '@/utils/cn';

const CLOUDINARY = 'https://res.cloudinary.com/sliit123/image/upload';

// Photos from the old gallery section; the first two get their own tiles.
type Photo = { src: string; alt: string; position?: string };

const PHOTOS: Photo[] = [
  {
    src: `${CLOUDINARY}/v1722056054/452512503_488795937180664_7271840043657978943_n_sonkaw.jpg`,
    alt: 'Group photo on stage at Google I/O Extended Sri Lanka'
  },
  {
    src: `${CLOUDINARY}/v1657634536/78390585_2506948399550696_6980378636998148096_n_vdocpq.jpg`,
    alt: 'Attendees of DevFest Sri Lanka 2019'
  },
  {
    src: `${CLOUDINARY}/v1657204392/269486241_4901193186586681_4737586760052715988_n_anphqo.jpg`,
    alt: 'NBQSA National ICT Awards 2021 merit award winners'
  },
  {
    src: `${CLOUDINARY}/v1657634530/274008021_4972833612755971_1080696660064803007_n_r21r7c.jpg`,
    alt: 'Newspaper coverage of SLIIT students at the NBQSA awards 2021'
  },
  {
    src: `${CLOUDINARY}/v1657634607/70194955_2480635875505990_7830033192324169728_n_pngnmx.jpg`,
    alt: 'Team photo at a developer event'
  }
];

// Official key art, loaded from the publishers' image hosts. The gradient
// shows while the image loads, or if it ever fails.
// GSoC Mentor Summit 2025, shown as the fanned card: [left, front, right].
const SUMMIT: Photo[] = [
  {
    src: `${CLOUDINARY}/v1792134396/IMG_9642_tezwj5.jpg`,
    alt: 'Presenting "What is OpenMRS?" at the Google Summer of Code Mentor Summit 2025',
    // Keep me (on the right of the stage) in the portrait crop
    position: '78% center'
  },
  {
    src: `${CLOUDINARY}/v1792134397/IMG_9600_mj493q.jpg`,
    alt: 'Outside the Google office in Munich in autumn'
  },
  {
    src: `${CLOUDINARY}/v1792134400/IMG_9656_yt1kzo.jpg`,
    alt: 'With fellow mentors at the Google Summer of Code Mentor Summit 2025'
  }
];

// Shown until PlayStation answers, and whenever it can't (no NPSSO, or it
// expired).
const FALLBACK_GAMES = [
  {
    title: 'EA FC 26',
    mark: 'FC',
    img: 'https://image.api.playstation.com/vulcan/ap/rnd/202608/0314/d0cc38456ebe67005ebea2709f52a3d2f6780985b6403219.png',
    tile: 'from-[#0f5132] via-[#15803d] to-[#4ade80]'
  },
  {
    title: 'GTA V',
    mark: 'V',
    img: 'https://media.rockstargames.com/rockstargames/img/global/news/upload/actual_1364906194.jpg',
    tile: 'from-[#7c2d12] via-[#ea580c] to-[#f472b6]'
  },
  {
    title: 'Horizon Zero Dawn',
    mark: 'HZD',
    img: 'https://image.api.playstation.com/vulcan/ap/rnd/202409/2716/47e9eab45f4d18d852d656b566aeb66cc8452f459acf6610.jpg',
    tile: 'from-[#134e4a] via-[#0e7490] to-[#f59e0b]'
  }
];

// Colour behind each cover while its image loads, cycled for fetched games.
const TILES = FALLBACK_GAMES.map((g) => g.tile);

// Covers: "45m" under an hour, then whole hours ("23h", "1,204h").
const shortPlayTime = (minutes: number) =>
  minutes < 60
    ? `${minutes}m`
    : `${Math.floor(minutes / 60).toLocaleString('en')}h`;

// The dialog has room for minutes too: "43h 53m".
const longPlayTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h.toLocaleString('en')}h ${m}m` : `${m}m`;
};

const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const DAY = 24 * 60 * 60 * 1000;

// "today", "yesterday", "5 days ago", "3 months ago"
function playedAgo(iso: string) {
  const days = Math.round((new Date(iso).getTime() - Date.now()) / DAY);
  if (days > -30) return relative.format(days, 'day');
  if (days > -365) return relative.format(Math.round(days / 30), 'month');
  return relative.format(Math.round(days / 365), 'year');
}

// "A, B & C"
const listNames = (names: string[]) =>
  names.length > 1
    ? `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`
    : names[0] ?? '';

const Caption = ({
  title,
  sub,
  arrow = true,
  hint
}: {
  title: string;
  sub: string;
  arrow?: boolean;
  // Text beside the title, e.g. "View all". It sits on the title's line so
  // the subtitle keeps the tile's full width.
  hint?: string;
}) => (
  <div className="flex items-end justify-between gap-3 px-2 pb-1 pt-3">
    <div className="min-w-0 flex-1">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="truncate text-sm font-medium text-[var(--fg)]">
          {title}
        </h3>
        {hint && (
          <span className="flex shrink-0 items-center gap-1 text-xs text-[var(--fg-muted)] transition-colors duration-150 group-hover:text-[var(--fg)]">
            {hint}
            <ArrowUpRight className="transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
      <p className="mt-0.5 truncate text-[13px] text-[var(--fg-muted)]">
        {sub}
      </p>
    </div>
    {arrow && !hint && (
      <ArrowUpRight className="mb-1 shrink-0 text-[var(--fg-muted)] transition-[transform,color] duration-150 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--fg)]" />
    )}
  </div>
);

const PhotoTile = ({
  photo,
  title,
  sub,
  className,
  wide = false,
  onOpen
}: {
  photo: Photo;
  title: string;
  sub: string;
  className?: string;
  wide?: boolean;
  onOpen: () => void;
}) => (
  <button
    type="button"
    onClick={onOpen}
    className={`group flex flex-col ${
      wide ? 'sm:flex-row sm:items-center sm:gap-4' : ''
    } rounded-2xl bg-[var(--card)] p-1.5 text-left transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--card-hover)] active:scale-[0.985] ${className}`}
  >
    <div
      className={`relative w-full flex-1 overflow-hidden rounded-xl ${
        wide
          ? 'min-h-[180px] sm:min-h-[200px] sm:w-[55%] sm:flex-none'
          : 'min-h-[110px] sm:min-h-[180px]'
      }`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(max-width: 640px) 100vw, 420px"
        className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
      />
    </div>
    <Caption title={title} sub={sub} />
  </button>
);

// Three photos fanned like prints on a table. On hover the side ones swing
// out and the front one lifts; plain CSS transitions, so they can be
// interrupted mid-way.
const FAN = [
  {
    rest: '-translate-x-[100%] -translate-y-1/2 -rotate-[8deg]',
    hover:
      'group-hover:-translate-x-[124%] group-hover:-rotate-[13deg] group-focus-visible:-translate-x-[124%] group-focus-visible:-rotate-[13deg]'
  },
  {
    rest: 'z-10 -translate-x-1/2 -translate-y-1/2',
    hover:
      'group-hover:-translate-y-[calc(50%+8px)] group-focus-visible:-translate-y-[calc(50%+8px)]'
  },
  {
    rest: '-translate-x-[0%] -translate-y-1/2 rotate-[8deg]',
    hover:
      'group-hover:translate-x-[24%] group-hover:rotate-[13deg] group-focus-visible:translate-x-[24%] group-focus-visible:rotate-[13deg]'
  }
];

const FanTile = ({
  photos,
  title,
  sub,
  className,
  onOpen
}: {
  photos: Photo[];
  title: string;
  sub: string;
  className?: string;
  onOpen: () => void;
}) => (
  <button
    type="button"
    onClick={onOpen}
    aria-label={`${title}, ${sub}`}
    className={`group flex flex-col rounded-2xl bg-[var(--card)] p-1.5 text-left transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--card-hover)] active:scale-[0.985] ${className}`}
  >
    <div className="relative min-h-[260px] w-full flex-1 overflow-hidden rounded-xl bg-[var(--card-hover)]">
      {/* A soft glow of the front photo behind the stack */}
      <Image
        src={photos[1].src}
        alt=""
        fill
        sizes="200px"
        className="scale-150 object-cover opacity-25 blur-3xl"
      />
      {photos.map((photo, i) => (
        <span
          key={photo.src}
          className={`absolute left-1/2 top-1/2 aspect-[3/4] w-[34%] overflow-hidden rounded-lg shadow-xl ring-1 ring-black/10 transition-transform duration-300 ease-out motion-reduce:transition-none ${FAN[i].rest} ${FAN[i].hover}`}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 640px) 34vw, 150px"
            className="object-cover"
            style={{ objectPosition: photo.position ?? 'center' }}
          />
        </span>
      ))}
    </div>
    <Caption title={title} sub={sub} />
  </button>
);

const Lightbox = ({
  photos,
  index,
  onClose,
  onStep
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}) => {
  // Photos that have finished loading in this lightbox; going back to one
  // shouldn't flash the spinner again.
  const [loaded, setLoaded] = useState<Set<string>>(() => new Set());
  const src = photos[index].src;
  const isLoaded = loaded.has(src);
  const markLoaded = (url: string) =>
    setLoaded((prev) => (prev.has(url) ? prev : new Set(prev).add(url)));
  // The photos either side load in the background, so stepping to them is
  // usually instant.
  const neighbours =
    photos.length > 1
      ? Array.from(
          new Set([
            photos[(index + 1) % photos.length].src,
            photos[(index - 1 + photos.length) % photos.length].src
          ])
        ).filter((url) => url !== src)
      : [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose, onStep]);

  const navButton =
    'grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition-[background-color,transform] duration-150 ease-out hover:bg-white/20 active:scale-[0.96]';

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Photos"
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/85 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      {/* Top right, clear of the notch: on phones the bottom bar can sit
          under the browser's own toolbar, so this one is always reachable */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className={`${navButton} absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-10`}
      >
        <svg
          aria-hidden
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      {/* Modals stay centred, so they scale from the centre */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="relative h-[min(75vh,720px)] w-full max-w-4xl supports-[height:100dvh]:h-[min(70dvh,720px)]"
        initial={{ transform: 'scale(0.96)' }}
        animate={{
          transform: 'scale(1)',
          transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] }
        }}
        exit={{
          transform: 'scale(0.98)',
          transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] }
        }}
      >
        {/* Shown until the photo arrives; the photo then fades in over it */}
        <div
          className={cn(
            'absolute inset-0 grid place-items-center text-white transition-opacity duration-200 ease-out',
            isLoaded && 'opacity-0'
          )}
        >
          {!isLoaded && <Spinner label="Loading photo" />}
        </div>
        {/* Swapping photos is instant: arrow keys get used a lot here */}
        <Image
          key={index}
          src={src}
          alt={photos[index].alt}
          fill
          sizes="90vw"
          onLoad={() => markLoaded(src)}
          className={cn(
            'object-contain transition-opacity duration-200 ease-out',
            !isLoaded && 'opacity-0'
          )}
          priority
        />
        {neighbours.map((url) => (
          <Image
            key={url}
            src={url}
            alt=""
            aria-hidden
            fill
            sizes="90vw"
            onLoad={() => markLoaded(url)}
            className="invisible"
            priority
          />
        ))}
      </motion.div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-3 text-[13px] text-white/70"
      >
        <button
          type="button"
          aria-label="Previous photo"
          onClick={() => onStep(-1)}
          className={navButton}
        >
          <ArrowUpRight className="-rotate-[135deg]" size={14} />
        </button>
        <span className="w-12 text-center tabular-nums">
          {index + 1} / {photos.length}
        </span>
        <button
          type="button"
          aria-label="Next photo"
          onClick={() => onStep(1)}
          className={navButton}
        >
          <ArrowUpRight className="rotate-45" size={14} />
        </button>
      </div>
    </motion.div>
  );
};

// Every game PSN knows I've played, most recent first.
const GamesDialog = ({
  games,
  open,
  onOpenChange
}: {
  games: PlayedGame[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const total = games.reduce((sum, g) => sum + (g.playMinutes ?? 0), 0);
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Games I've played"
      description={`${games.length} games on PlayStation · ${shortPlayTime(total)} in total`}
    >
      {/* Only the list scrolls; the title stays put */}
      <ul className="-mx-6 -mb-6 mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3">
        {games.map((g) => (
          <li
            key={`${g.name}|${g.platform}`}
            className="flex items-center gap-3 rounded-xl px-3 py-2"
          >
            <Image
              src={g.icon}
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-lg bg-[var(--card)] object-cover"
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-[var(--fg)]">
                {g.name}
              </span>
              <span className="block truncate text-xs text-[var(--fg-muted)]">
                {[g.platform, `played ${playedAgo(g.lastPlayed)}`]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            </span>
            {g.playMinutes !== null && (
              <span className="shrink-0 text-[13px] tabular-nums text-[var(--fg)]">
                {longPlayTime(g.playMinutes)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </Dialog>
  );
};

const OffTheClock = () => {
  const { data: played } = usePlayedGames();
  const games = played?.length
    ? played.map((g, i) => ({
        title: g.name,
        mark: '',
        img: g.image,
        tile: TILES[i % TILES.length],
        played: g.playMinutes ? shortPlayTime(g.playMinutes) : null
      }))
    : FALLBACK_GAMES.map((g) => ({ ...g, played: null }));
  // The full list only exists once PSN has answered.
  const [gamesOpen, setGamesOpen] = useState(false);
  const canOpenGames = !!played?.length;
  const [open, setOpen] = useState<{ photos: Photo[]; index: number } | null>(
    null
  );

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpen((o) =>
        o === null
          ? null
          : {
              ...o,
              index: (o.index + dir + o.photos.length) % o.photos.length
            }
      ),
    []
  );

  return (
    <Section id="off-the-clock" title="off the clock">
      {/* minmax(0, …): fr columns otherwise grow to fit their longest line,
          so a long list of game names would squeeze the summit tile */}
      <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-2 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <FanTile
          photos={SUMMIT}
          title="Google Summer of Code Mentor Summit 2025"
          sub={`Munich, Germany · ${SUMMIT.length} photos`}
          className="col-span-2 sm:col-span-1 sm:row-span-2 sm:min-h-[440px]"
          onOpen={() => setOpen({ photos: SUMMIT, index: 1 })}
        />

        <button
          type="button"
          disabled={!canOpenGames}
          aria-haspopup="dialog"
          onClick={() => setGamesOpen(true)}
          className="group flex flex-col justify-between rounded-2xl bg-[var(--card)] p-1.5 text-left transition-[background-color,transform] duration-150 ease-out enabled:hover:bg-[var(--card-hover)] enabled:active:scale-[0.985]"
        >
          {/* Phones: two covers fit the half-width tile; the third joins on wider screens */}
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {games.slice(0, 3).map((g, i) => (
              <div
                key={g.title}
                title={g.played ? `${g.title} · ${g.played} played` : g.title}
                // Covers lift one after another on hover, then settle together
                style={{ '--d': `${i * 40}ms` } as React.CSSProperties}
                className={`relative aspect-[3/4] items-end ${i > 1 ? 'hidden sm:flex' : 'flex'} overflow-hidden rounded-lg bg-gradient-to-br ${g.tile} p-2 transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:[transition-delay:var(--d)]`}
              >
                {g.mark && (
                  <span className="absolute right-1.5 top-1 text-[10px] font-medium uppercase tracking-wider text-white/60">
                    {g.mark}
                  </span>
                )}
                <span className="text-[11px] font-semibold leading-tight text-white">
                  {g.title}
                </span>
                <Image
                  src={g.img}
                  alt={g.title}
                  fill
                  sizes="(max-width: 640px) 33vw, 90px"
                  // Keep the title art (top of each cover) in the crop
                  className="object-cover object-top"
                />
                {g.played && (
                  <span className="absolute bottom-1.5 left-1.5 z-10 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-white backdrop-blur-sm">
                    {g.played}
                    <span className="sr-only"> played</span>
                  </span>
                )}
              </div>
            ))}
          </div>
          <Caption
            title="Playing now"
            sub={listNames(games.slice(0, 3).map((g) => g.title))}
            arrow={false}
            hint={canOpenGames ? 'View all' : undefined}
          />
        </button>

        <PhotoTile
          photo={PHOTOS[0]}
          title="Google I/O Extended"
          sub={`GDG Sri Lanka · ${PHOTOS.length} photos`}
          onOpen={() => setOpen({ photos: PHOTOS, index: 0 })}
        />

        <PhotoTile
          photo={PHOTOS[1]}
          title="DevFest Sri Lanka 2019"
          sub="GDG Sri Lanka"
          wide
          className="col-span-2"
          onOpen={() => setOpen({ photos: PHOTOS, index: 1 })}
        />
      </div>

      {played && (
        <GamesDialog
          games={played}
          open={gamesOpen}
          onOpenChange={setGamesOpen}
        />
      )}

      <AnimatePresence>
        {open !== null && (
          <Lightbox
            photos={open.photos}
            index={open.index}
            onClose={close}
            onStep={step}
          />
        )}
      </AnimatePresence>
    </Section>
  );
};

export default OffTheClock;
