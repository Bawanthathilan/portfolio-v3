import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profile } from '@/data/profile';
import { cardMotion, useHoverCard } from '@/components/v3/hover-card';

// A typical visitor's working day, in their own local time.
const VISITOR_HOURS = { start: 9, end: 18 };

type Segment = [number, number];

const mod24 = (h: number) => ((h % 24) + 24) % 24;

// UTC offset (in hours) of `timeZone` at `date`, e.g. 5.5 for Asia/Colombo.
function tzOffset(timeZone: string, date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute')
  );
  return Math.round((asUtc - date.getTime()) / 900_000) / 4;
}

// A start/end window on a 24h track, split in two if it wraps midnight.
const toSegments = (start: number, end: number): Segment[] =>
  start < end
    ? [[start, end]]
    : [
        [start, 24],
        [0, end]
      ];

const inSegments = (h: number, segs: Segment[]) =>
  segs.some(([a, b]) => h >= a && h < b);

function formatHour(h: number) {
  const hour = Math.floor(mod24(h));
  const min = Math.round((mod24(h) - hour) * 60);
  const suffix = hour < 12 ? 'am' : 'pm';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}${min ? `:${String(min).padStart(2, '0')}` : ''}${suffix}`;
}

function formatGap(hours: number) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (!m) return `${h} hour${h === 1 ? '' : 's'}`;
  return h ? `${h}h ${m}m` : `${m} minutes`;
}

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

const SunIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
  </svg>
);

const Track = ({ segments, tone }: { segments: Segment[]; tone: string }) => (
  <div className="relative h-2 rounded-full bg-[var(--card-hover)]">
    {segments.map(([a, b]) => (
      <span
        key={a}
        className={`absolute inset-y-0 rounded-full ${tone}`}
        style={{
          left: `${(a / 24) * 100}%`,
          width: `${((b - a) / 24) * 100}%`
        }}
      />
    ))}
  </div>
);

const LocationPill = () => {
  const now = useNow();
  const { open, toggle, wrapperProps } = useHoverCard();

  const city = profile.location.split(',')[0];

  // Everything below is in the visitor's local time.
  const info = (() => {
    if (!now) return null;
    const mine = tzOffset(profile.timeZone, now);
    const theirs = -now.getTimezoneOffset() / 60;
    const diff = theirs - mine;

    const myHourNow = mod24(
      now.getUTCHours() + now.getUTCMinutes() / 60 + mine
    );
    const awake =
      myHourNow >= profile.hours.start && myHourNow < profile.hours.end;

    const me = toSegments(
      mod24(profile.hours.start + diff),
      mod24(profile.hours.end + diff)
    );
    const you = toSegments(VISITOR_HOURS.start, VISITOR_HOURS.end);

    // First stretch of the visitor's day where we're both around.
    let from: number | null = null;
    let to: number | null = null;
    for (let h = 0; h < 24; h += 0.25) {
      const both = inSegments(h, me) && inSegments(h, you);
      if (both && from === null) from = h;
      if (!both && from !== null) {
        to = h;
        break;
      }
    }
    if (from !== null && to === null) to = 24;

    const headline =
      from !== null
        ? `We overlap ${formatHour(from)} – ${formatHour(to!)} your time`
        : `Our days don't overlap. I'm on from ${formatHour(
            profile.hours.start + diff
          )} your time`;

    const relation =
      diff === 0
        ? `We're both on ${profile.timeZoneLabel} time`
        : `You're ${formatGap(Math.abs(diff))} ${diff > 0 ? 'ahead of' : 'behind'} me`;

    const time = now
      .toLocaleTimeString('en-US', {
        timeZone: profile.timeZone,
        hour: 'numeric',
        minute: '2-digit'
      })
      .toLowerCase()
      .replace(' ', '');

    const yourHourNow = now.getHours() + now.getMinutes() / 60;

    return { awake, me, you, headline, relation, time, yourHourNow };
  })();

  const pillRow = (
    <span className="flex items-center gap-2 text-xs text-[var(--fg)]">
      {/* Pings while I'm around; a still grey dot when I'm not */}
      <span
        className={`relative h-2 w-2 rounded-full ${
          info && !info.awake
            ? 'bg-[var(--fg-subtle)]'
            : 'sonar bg-green-400 text-green-400'
        }`}
      />
      {profile.location}
      {info && (
        <>
          <span className="text-[var(--fg-subtle)]">·</span>
          <span className="text-[var(--fg-muted)]">
            {info.awake ? <SunIcon /> : <MoonIcon />}
          </span>
          <span className="tabular-nums text-[var(--fg-muted)]">
            {info.time}
          </span>
        </>
      )}
    </span>
  );

  return (
    <div className="relative inline-block" {...wrapperProps}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={`${profile.location}, local time and availability`}
        className="rounded-full bg-[var(--card)] px-3 py-1.5 transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--card-hover)] active:scale-[0.96]"
      >
        {pillRow}
      </button>

      <AnimatePresence>
        {open && info && (
          <motion.div
            role="dialog"
            aria-label="Availability"
            {...cardMotion}
            className="absolute left-0 top-0 z-30 w-[360px] max-w-[calc(100vw-32px)] rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 shadow-2xl"
          >
            <div className="-mt-0.5">{pillRow}</div>

            <p className="mt-3 text-[13px] leading-[1.55] text-[var(--fg-muted)]">
              {info.awake
                ? `I'm around right now in ${city}. The dock at the bottom of the page is the quickest way to reach me.`
                : `It's late in ${city}, so I'm probably offline. Leave a message in the dock and I'll reply in the morning.`}
            </p>

            <div className="mt-4 grid grid-cols-[36px_1fr] items-center gap-x-3 gap-y-2 text-xs text-[var(--fg-muted)]">
              <span>Me</span>
              <div className="relative row-span-2 space-y-2.5">
                <Track segments={info.me} tone="bg-green-500" />
                <Track segments={info.you} tone="bg-[var(--fg-subtle)]" />
                {/* Where "now" falls on the visitor's day */}
                <span
                  className="absolute -bottom-1 -top-1 w-px bg-[var(--fg)]"
                  style={{ left: `${(info.yourHourNow / 24) * 100}%` }}
                />
              </div>
              <span>You</span>
              <span />
              <div className="relative mt-1 h-3 text-[11px]">
                {['12am', '6am', '12pm', '6pm'].map((t, i) => (
                  <span
                    key={t}
                    className="absolute"
                    style={{ left: `${i * 25}%` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-4 text-[13px] font-medium text-[var(--fg)]">
              {info.headline}
            </p>
            <p className="mt-0.5 text-xs text-[var(--fg-muted)]">
              {info.relation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationPill;
