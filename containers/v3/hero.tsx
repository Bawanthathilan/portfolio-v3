import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaMedium } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { GoGitMerge, GoRepo, GoPeople, GoPulse } from 'react-icons/go';
import Avatar from '@/assets/images/my.webp';
import { profile } from '@/data/profile';
import { Card, Doc, Mail, Reveal } from '@/components/v3';
import LocationPill from '@/components/v3/location-pill';
import SpotifyPill from '@/components/v3/spotify-pill';
import {
  useContributions,
  useGithubUser,
  useMergedPrs
} from '@/queries/github';

const fmt = (n?: number) => (n === undefined ? '—' : n.toLocaleString());

const Hero = () => {
  const { data: user } = useGithubUser();
  const { data: prs } = useMergedPrs();
  const { data: contributions } = useContributions();

  const stats = [
    {
      icon: GoGitMerge,
      tint: 'text-deep-purple-400 bg-deep-purple-500/15',
      value: fmt(prs?.total),
      label: 'PRs merged upstream'
    },
    {
      icon: GoPulse,
      tint: 'text-green-400 bg-green-500/15',
      value: fmt(contributions?.total),
      label: 'GitHub contributions this year'
    },
    {
      icon: GoRepo,
      tint: 'text-light-blue-400 bg-light-blue-500/15',
      value: fmt(user?.public_repos),
      label: 'public repositories'
    },
    {
      icon: GoPeople,
      tint: 'text-amber-400 bg-amber-500/15',
      value: fmt(user?.followers),
      label: 'followers on GitHub'
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
        <LocationPill />
        <SpotifyPill />
      </Reveal>

      <Reveal
        delay={0.1}
        className="mt-6 space-y-4 text-sm leading-[1.6] text-[var(--fg-muted)] [&_a]:text-[var(--fg)] [&_a]:underline [&_a]:decoration-[var(--line-strong)] [&_a]:underline-offset-4 hover:[&_a]:decoration-[var(--fg)]"
      >
        <p>
          I&apos;m a Senior Software Engineer at OREL IT in Colombo, and a
          contributor to{' '}
          <Link href="https://github.com/openmrs" target="_blank">
            OpenMRS
          </Link>
          , the open source medical records platform used by health systems
          around the world.
        </p>
        <p>
          I build full-stack systems and developer tools, mostly with React,
          Next.js and TypeScript. I write about what I learn on{' '}
          <Link href={profile.socials.medium} target="_blank">
            Medium
          </Link>
          , and the rest of my experiments live on{' '}
          <Link href={profile.socials.github} target="_blank">
            GitHub
          </Link>
          .
        </p>
      </Reveal>

      <Reveal
        delay={0.15}
        className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {stats.map(({ icon: Icon, tint, value, label }) => (
          <Card key={label} className="p-3">
            <span
              className={`grid h-6 w-6 place-items-center rounded-md ${tint}`}
            >
              <Icon size={13} />
            </span>
            <div className="mt-3 text-lg font-medium tabular-nums text-[var(--fg)]">
              {value}
            </div>
            <div className="mt-0.5 text-[11px] leading-snug text-[var(--fg-muted)]">
              {label}
            </div>
          </Card>
        ))}
      </Reveal>

      <Reveal delay={0.2} className="mt-7 flex flex-wrap items-center gap-2">
        <Link
          href={profile.resume}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--fg)] px-4 py-2 text-xs font-medium text-[var(--bg)] transition-transform duration-150 ease-out active:scale-[0.97]"
        >
          <Doc /> Resume
        </Link>
        <Link
          href={`mailto:${profile.email}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--card)] px-4 py-2 text-xs font-medium text-[var(--fg)] transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--card-hover)] active:scale-[0.97]"
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
              className="grid h-8 w-8 place-items-center rounded-full text-[var(--fg-muted)] transition-[color,transform] duration-150 ease-out hover:text-[var(--fg)] active:scale-[0.95]"
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
