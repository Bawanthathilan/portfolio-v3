import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaMedium } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { GoGitMerge, GoRepo, GoPeople, GoPulse } from 'react-icons/go';
import Avatar from '@/assets/images/my.webp';
import { profile } from '@/data/profile';
import { Doc, Mail, Reveal } from '@/components/v3';
import { AvailabilityBadge } from '@/components/lab/availability-badge';
import { Odometer } from '@/components/lab/odometer';
import SpotifyPill from '@/components/v3/spotify-pill';
import {
  ArticleThumb,
  HoverPreviewLink
} from '@/components/lab/hover-preview-link';
import OpenMrsLogo from '@/public/logos/openmrs.png';
import {
  useContributions,
  useGithubUser,
  useMergedPrs
} from '@/queries/github';

// Preview thumbnails for the bio links, from images already in the site
const OpenMrsThumb = () => (
  <span className="grid h-full w-full place-items-center bg-[color-mix(in_srgb,#e66d2c_10%,var(--card))]">
    <Image src={OpenMrsLogo} alt="" width={56} height={56} />
  </span>
);

// The /dev/3 stage as a badge beside the OpenMRS logo, for the Talk link
const OpenMrsTalkThumb = () => (
  <span className="flex h-full w-full items-center justify-center gap-3 bg-[color-mix(in_srgb,#e66d2c_10%,var(--card))]">
    <Image src={OpenMrsLogo} alt="" width={44} height={44} />
    <span>
      <span className="block font-mono text-lg font-medium text-[var(--fg)]">
        {profile.openmrsStage}
      </span>
      <span className="block text-xs text-[var(--fg-muted)]">
        OpenMRS developer stage
      </span>
    </span>
  </span>
);

const GithubThumb = ({ repos }: { repos?: number }) => (
  <span className="flex h-full w-full items-center gap-3 px-4">
    <Image
      src={Avatar}
      alt=""
      width={56}
      height={56}
      className="h-14 w-14 rounded-full object-cover ring-1 ring-[var(--line)]"
    />
    <span className="min-w-0">
      <span className="block truncate text-[13px] font-medium text-[var(--fg)]">
        @{profile.github}
      </span>
      {repos !== undefined && (
        <span className="block text-xs text-[var(--fg-muted)]">
          {repos} public repositories
        </span>
      )}
    </span>
  </span>
);

const Hero = () => {
  const { data: user } = useGithubUser();
  const { data: prs } = useMergedPrs();
  const { data: contributions } = useContributions();

  const stats = [
    {
      icon: GoGitMerge,
      tint: 'text-deep-purple-400 bg-deep-purple-500/15',
      value: prs?.total,
      label: 'PRs merged upstream',
      href: `https://github.com/search?q=author%3A${profile.github}+is%3Apr+is%3Amerged&type=pullrequests`
    },
    {
      icon: GoPulse,
      tint: 'text-green-400 bg-green-500/15',
      value: contributions?.total,
      label: 'GitHub contributions this year',
      href: profile.socials.github
    },
    {
      icon: GoRepo,
      tint: 'text-light-blue-400 bg-light-blue-500/15',
      value: user?.public_repos,
      label: 'public repositories',
      href: `${profile.socials.github}?tab=repositories`
    },
    {
      icon: GoPeople,
      tint: 'text-amber-400 bg-amber-500/15',
      value: user?.followers,
      label: 'followers on GitHub',
      href: `${profile.socials.github}?tab=followers`
    }
  ];

  const socials = [
    { href: profile.socials.github, label: 'GitHub', icon: FaGithub },
    { href: profile.socials.x, label: 'X', icon: FaXTwitter },
    { href: profile.socials.linkedin, label: 'LinkedIn', icon: FaLinkedin },
    { href: profile.socials.medium, label: 'Medium', icon: FaMedium }
  ];

  return (
    <section id="top" className="pt-16 sm:pt-20">
      <Reveal className="flex items-center gap-4">
        <Image
          src={Avatar}
          alt={profile.name}
          width={64}
          height={64}
          priority
          className="h-16 w-16 rounded-full object-cover ring-1 ring-[var(--line)]"
        />
        <div>
          <h1 className="text-[26px] font-medium leading-tight tracking-[-0.02em] text-[var(--fg)]">
            {profile.name}
          </h1>
          <p className="mt-1 text-[13px] text-[var(--fg-muted)]">
            {profile.role}
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05} className="mt-5 flex flex-wrap items-center gap-2">
        <AvailabilityBadge
          timeZone={profile.timeZone}
          hours={[profile.hours.start, profile.hours.end]}
          label={profile.location}
          place={profile.city}
          zoneName={profile.timeZoneLabel}
          replyHint="The dock below is the quickest way to reach me"
        />
        <SpotifyPill />
      </Reveal>

      <Reveal
        delay={0.1}
        className="mt-6 space-y-4 text-sm leading-[1.6] text-[var(--fg-muted)]"
      >
        <p>
          I&apos;m a Senior Software Engineer at OREL IT in Colombo, and a{' '}
          <HoverPreviewLink
            href={profile.openmrsTalk}
            title={`${profile.openmrsStage} developer on OpenMRS Talk`}
            domain="talk.openmrs.org/u/bawanthathilan"
            image={<OpenMrsTalkThumb />}
          >
            {profile.openmrsStage} developer
          </HoverPreviewLink>{' '}
          at{' '}
          <HoverPreviewLink
            href="https://github.com/openmrs"
            title="OpenMRS"
            domain="github.com/openmrs"
            image={<OpenMrsThumb />}
          >
            OpenMRS
          </HoverPreviewLink>
          , the open source medical records platform used by health systems
          around the world.
        </p>
        <p>
          I build full-stack systems and developer tools, mostly with React,
          Next.js and TypeScript. I write about what I learn on{' '}
          <HoverPreviewLink
            href={profile.socials.medium}
            title={`${profile.name} on Medium`}
            domain={`medium.com/@${profile.medium}`}
            image={<ArticleThumb />}
          >
            Medium
          </HoverPreviewLink>
          , and the rest of my experiments live on{' '}
          <HoverPreviewLink
            href={profile.socials.github}
            title={`${profile.name} on GitHub`}
            domain={`github.com/${profile.github}`}
            image={<GithubThumb repos={user?.public_repos} />}
          >
            GitHub
          </HoverPreviewLink>
          .
        </p>
      </Reveal>

      <Reveal
        delay={0.15}
        className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {stats.map(({ icon: Icon, tint, value, label, href }) => (
          <Link
            key={label}
            href={href}
            target="_blank"
            className="group rounded-2xl bg-[var(--card)] p-3 transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--card-hover)] active:scale-[0.985]"
          >
            {/* Tilts in quickly on hover, springs back on leave */}
            <span
              className={`grid h-6 w-6 place-items-center rounded-md ${tint} transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-[8deg] group-hover:scale-110 group-hover:duration-200 group-hover:ease-out group-focus-visible:-rotate-[8deg] group-focus-visible:scale-110`}
            >
              <Icon size={13} />
            </span>
            <div className="mt-3 text-lg font-medium tabular-nums text-[var(--fg)]">
              {value === undefined ? '—' : <Odometer value={value} />}
            </div>
            <div className="mt-0.5 text-[11px] leading-snug text-[var(--fg-muted)]">
              {label}
            </div>
          </Link>
        ))}
      </Reveal>

      <Reveal delay={0.2} className="mt-7 flex flex-wrap items-center gap-2">
        <Link
          href={profile.resume}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--fg)] px-4 py-2 text-xs font-medium text-[var(--bg)] transition-transform duration-150 ease-out active:scale-[0.96]"
        >
          <Doc /> Resume
        </Link>
        <Link
          href={`mailto:${profile.email}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--card)] px-4 py-2 text-xs font-medium text-[var(--fg)] transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--card-hover)] active:scale-[0.96]"
        >
          <Mail /> Say hi
        </Link>
        <div className="ml-2 flex items-center gap-1">
          {socials.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              aria-label={label}
              className="grid h-8 w-8 place-items-center rounded-full text-[var(--fg-muted)] transition-colors duration-150 hover:text-[var(--fg)]"
            >
              <Icon size={14} />
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
};

export default Hero;
