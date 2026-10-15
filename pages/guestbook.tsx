import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { AiOutlineGithub } from 'react-icons/ai';
import useSupabaseBrowser from '@/utils/supabase-browser';
import { ArrowRight, Card, Reveal } from '@/components/v3';
import { cn } from '@/utils/cn';

interface GuestEntry {
  id: string;
  username: string | null;
  message: string | null;
  created_at: string | null;
}

const MAX_LENGTH = 280;

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

const QUOTE_TINTS = [
  'text-pink-400',
  'text-deep-purple-400',
  'text-amber-400',
  'text-light-blue-400',
  'text-green-400'
];

const Guestbook = () => {
  const supabase = useSupabaseBrowser();
  const { data: session, status } = useSession();
  const [entries, setEntries] = useState<GuestEntry[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('guestbook')
      .select('id, username, message, created_at')
      .order('created_at', { ascending: false });
    if (error) setError('Could not load the guestbook. Try refreshing.');
    setEntries(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = message.trim();
    if (!text || !session?.user) return;
    setSubmitting(true);
    setError(null);
    const { error } = await supabase.from('guestbook').insert({
      message: text,
      username: session.user.name ?? session.user.email ?? 'Anonymous'
    });
    if (error) {
      setError('Your note did not go through. Please try again.');
    } else {
      setMessage('');
      await fetchEntries();
    }
    setSubmitting(false);
  };

  return (
    <>
      <Head>
        <title>Guestbook · Bawantha Thilan</title>
      </Head>

      <section className="pt-16 sm:pt-20">
        <Reveal>
          <Link
            href="/#guestbook"
            className="group mb-6 inline-flex items-center gap-1 text-[13px] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
          >
            <ArrowRight className="rotate-180 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
            Back home
          </Link>
          <h1 className="text-[26px] font-medium tracking-[-0.02em] text-[var(--fg)]">
            Guestbook
          </h1>
          <p className="mt-2 text-sm leading-[1.6] text-[var(--fg-muted)]">
            Leave a note for me and future visitors. A hello, some feedback, or
            just a wave.
          </p>
        </Reveal>

        <Reveal delay={0.05} className="mt-8">
          {status === 'loading' ? (
            <Card className="h-[120px] animate-pulse" />
          ) : session?.user ? (
            <Card className="p-4">
              <form onSubmit={handleSubmit}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    // ⌘/Ctrl + Enter submits, like most comment boxes.
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey))
                      handleSubmit(e);
                  }}
                  maxLength={MAX_LENGTH}
                  rows={3}
                  placeholder="Write something nice…"
                  aria-label="Your note"
                  className="w-full resize-none bg-transparent text-sm leading-[1.6] text-[var(--fg)] outline-none placeholder:text-[var(--fg-muted)]"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="truncate text-xs text-[var(--fg-muted)]">
                    Signing as{' '}
                    <span className="text-[var(--fg)]">
                      {session.user.name}
                    </span>
                    <span className="mx-1.5">·</span>
                    <button
                      type="button"
                      onClick={() => signOut({ redirect: false })}
                      className="underline underline-offset-2 transition-colors hover:text-[var(--fg)]"
                    >
                      sign out
                    </button>
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span
                      className={cn(
                        'text-xs tabular-nums text-[var(--fg-muted)]',
                        message.length > MAX_LENGTH - 20 && 'text-amber-400'
                      )}
                    >
                      {MAX_LENGTH - message.length}
                    </span>
                    <button
                      type="submit"
                      disabled={submitting || !message.trim()}
                      className="rounded-full bg-[var(--fg)] px-4 py-1.5 text-xs font-medium text-[var(--bg)] transition-[opacity,transform] duration-150 ease-out active:scale-[0.97] disabled:opacity-40"
                    >
                      {submitting ? 'Signing…' : 'Sign'}
                    </button>
                  </span>
                </div>
              </form>
            </Card>
          ) : (
            <Card className="flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[13px] text-[var(--fg-muted)]">
                Sign in with GitHub to leave a note. Only your name is shown.
              </p>
              <button
                type="button"
                onClick={() => signIn('github')}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--fg)] px-4 py-2 text-xs font-medium text-[var(--bg)] transition-transform duration-150 ease-out active:scale-[0.97]"
              >
                <AiOutlineGithub size={15} />
                Sign in with GitHub
              </button>
            </Card>
          )}
          {error && (
            <p role="alert" className="mt-3 text-[13px] text-pink-400">
              {error}
            </p>
          )}
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <h2 className="mb-5 font-mono text-xs text-[var(--fg-muted)]">
            notes
            <span className="text-[var(--fg-subtle)]">
              <span className="mx-2">/</span>
              {loading ? '…' : `${entries.length} signed`}
            </span>
          </h2>

          {loading ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <Card key={i} className="h-[120px] animate-pulse" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <Card className="p-8 text-center text-[13px] text-[var(--fg-muted)]">
              No notes yet. Be the first to sign.
            </Card>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {entries.map((entry, i) => (
                <Card key={entry.id} className="flex flex-col p-4">
                  <p className="whitespace-pre-line break-words text-[13px] leading-[1.6] text-[var(--fg)]">
                    <span
                      className={`mr-0.5 ${QUOTE_TINTS[i % QUOTE_TINTS.length]}`}
                    >
                      &ldquo;
                    </span>
                    {entry.message}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs text-[var(--fg-muted)]">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--card-hover)] text-[10px] text-[var(--fg)]">
                        {(entry.username ?? '?').charAt(0)}
                      </span>
                      <span className="truncate">{entry.username}</span>
                    </span>
                    <span className="shrink-0">
                      {formatDate(entry.created_at)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Reveal>
      </section>
    </>
  );
};

export default Guestbook;
