import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Card, Section } from '@/components/v3';

const CLOUDINARY = 'https://res.cloudinary.com/sliit123/image/upload';

// Photos from the old gallery section; the first two get their own tiles.
const PHOTOS = [
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
const GAMES = [
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

// Places I've been. Add `photo` (any image URL or /public path) to replace
// the illustration with a real picture.
const VISITED: { place: string; when: string; coords: string; photo?: string } =
  {
    place: 'Munich, Germany',
    when: 'October 2025',
    coords: '48.14° N · 11.58° E'
  };

// Original illustration: evening sky, the Alps, and Munich's twin-towered
// skyline in silhouette.
const MunichIllustration = () => (
  <svg
    viewBox="0 0 320 180"
    preserveAspectRatio="xMidYMax slice"
    className="absolute inset-0 h-full w-full"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="munich-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1e3a5f" />
        <stop offset="0.55" stopColor="#7c5c8a" />
        <stop offset="1" stopColor="#f2a65a" />
      </linearGradient>
    </defs>
    <rect width="320" height="180" fill="url(#munich-sky)" />
    <circle cx="268" cy="52" r="13" fill="#ffd9a0" opacity="0.85" />
    {/* Alps */}
    <path
      d="M0 128 L40 92 L62 108 L98 70 L130 104 L160 84 L196 116 L232 78 L262 102 L292 86 L320 104 V180 H0 Z"
      fill="#3b3a5c"
      opacity="0.7"
    />
    <path
      d="M98 70 L88 80 L98 77 L106 82 Z M232 78 L224 87 L233 84 L240 88 Z"
      fill="#e9e4f2"
      opacity="0.6"
    />
    {/* Skyline */}
    <path
      d="M0 150 H30 V138 H44 V146 H70 V132 H82 V146 H104
         V112 Q104 100 111 98 Q118 100 118 112 V146 H124
         V112 Q124 100 131 98 Q138 100 138 112 V146 H150
         V130 L160 122 L170 130 V146 H196 V136 H214 V122 H220 V136 H236 V146
         H262 V140 H284 V132 H296 V146 H320 V180 H0 Z"
      fill="#141322"
    />
  </svg>
);

const VisitedTile = () => (
  <Card className="flex flex-col p-1.5">
    <div className="relative min-h-[150px] flex-1 overflow-hidden rounded-xl">
      {VISITED.photo ? (
        <Image
          src={VISITED.photo}
          alt={VISITED.place}
          fill
          sizes="(max-width: 640px) 100vw, 260px"
          className="object-cover"
        />
      ) : (
        <MunichIllustration />
      )}
      <span className="absolute left-2 top-2 rounded-full bg-black/35 px-2 py-0.5 font-mono text-[10px] text-white/85 backdrop-blur-sm">
        {VISITED.coords}
      </span>
    </div>
    <Caption
      title={VISITED.place}
      sub={`Visited · ${VISITED.when}`}
      arrow={false}
    />
  </Card>
);

const Caption = ({
  title,
  sub,
  arrow = true
}: {
  title: string;
  sub: string;
  arrow?: boolean;
}) => (
  <div className="flex items-end justify-between gap-3 px-2 pb-1 pt-3">
    <div className="min-w-0">
      <h3 className="text-sm font-medium text-[var(--fg)]">{title}</h3>
      <p className="mt-0.5 truncate text-[13px] text-[var(--fg-muted)]">
        {sub}
      </p>
    </div>
    {arrow && (
      <ArrowUpRight className="mb-1 shrink-0 text-[var(--fg-muted)] transition-[transform,color] duration-150 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--fg)]" />
    )}
  </div>
);

const PhotoTile = ({
  index,
  title,
  sub,
  className,
  wide = false,
  onOpen
}: {
  index: number;
  title: string;
  sub: string;
  className?: string;
  wide?: boolean;
  onOpen: (i: number) => void;
}) => (
  <button
    type="button"
    onClick={() => onOpen(index)}
    className={`group flex flex-col ${
      wide ? 'sm:flex-row sm:items-center sm:gap-4' : ''
    } rounded-2xl bg-[var(--card)] p-1.5 text-left transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--card-hover)] active:scale-[0.985] ${className}`}
  >
    <div
      className={`relative min-h-[180px] w-full flex-1 overflow-hidden rounded-xl ${
        wide ? 'sm:min-h-[200px] sm:w-[55%] sm:flex-none' : ''
      }`}
    >
      <Image
        src={PHOTOS[index].src}
        alt={PHOTOS[index].alt}
        fill
        sizes="(max-width: 640px) 100vw, 420px"
        className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
      />
    </div>
    <Caption title={title} sub={sub} />
  </button>
);

const Lightbox = ({
  index,
  onClose,
  onStep
}: {
  index: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}) => {
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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/85 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      {/* Modals stay centred, so they scale from the centre */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="relative h-[min(75vh,720px)] w-full max-w-4xl"
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
        {/* Swapping photos is instant: arrow keys get used a lot here */}
        <Image
          key={index}
          src={PHOTOS[index].src}
          alt={PHOTOS[index].alt}
          fill
          sizes="90vw"
          className="object-contain"
          priority
        />
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
          {index + 1} / {PHOTOS.length}
        </span>
        <button
          type="button"
          aria-label="Next photo"
          onClick={() => onStep(1)}
          className={navButton}
        >
          <ArrowUpRight className="rotate-45" size={14} />
        </button>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={`${navButton} ml-3`}
        >
          <svg
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
      </div>
    </motion.div>
  );
};

const OffTheClock = () => {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpen((i) =>
        i === null ? null : (i + dir + PHOTOS.length) % PHOTOS.length
      ),
    []
  );

  return (
    <Section id="off-the-clock" title="off the clock">
      <div className="grid gap-2 sm:grid-cols-[1.6fr_1fr]">
        <PhotoTile
          index={0}
          title="Google I/O Extended Sri Lanka"
          sub={`GDG Sri Lanka · ${PHOTOS.length} photos`}
          className="sm:row-span-2 sm:min-h-[440px]"
          onOpen={setOpen}
        />

        <Card className="group flex flex-col justify-between p-1.5">
          <div className="grid grid-cols-3 gap-1.5">
            {GAMES.map((g, i) => (
              <div
                key={g.title}
                title={g.title}
                // Covers lift one after another on hover, then settle together
                style={{ '--d': `${i * 40}ms` } as React.CSSProperties}
                className={`relative flex aspect-[4/3] items-end sm:aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-br ${g.tile} p-2 transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:[transition-delay:var(--d)]`}
              >
                <span className="absolute right-1.5 top-1 text-[10px] font-medium uppercase tracking-wider text-white/60">
                  {g.mark}
                </span>
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
              </div>
            ))}
          </div>
          <Caption
            title="Playing now"
            sub="EA FC 26, GTA V & Horizon Zero Dawn"
            arrow={false}
          />
        </Card>

        <VisitedTile />

        <PhotoTile
          index={1}
          title="DevFest Sri Lanka 2019"
          sub="GDG Sri Lanka"
          wide
          className="sm:col-span-2"
          onOpen={setOpen}
        />
      </div>

      <AnimatePresence>
        {open !== null && (
          <Lightbox index={open} onClose={close} onStep={step} />
        )}
      </AnimatePresence>
    </Section>
  );
};

export default OffTheClock;
