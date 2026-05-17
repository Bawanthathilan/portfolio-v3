import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/keys';
import { AiOutlineGithub } from 'react-icons/ai';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface GuestEntry {
  id: number;
  username: string;
  message: string;
  created_at: string;
}

const SendIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return iso;
  }
};

const Guestbook = () => {
  const { data: session }: any = useSession();
  const [entries, setEntries] = useState<GuestEntry[]>([]);
  const [userMsg, setUserMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('guestbook')
      .select()
      .order('created_at', { ascending: false });
    setEntries(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsg.trim()) return;
    setSubmitting(true);
    await supabase.from('guestbook').insert([
      {
        message: userMsg.trim(),
        user_id: session?.user?.id,
        username: session?.user?.name
      }
    ]);
    setUserMsg('');
    await fetchEntries();
    setSubmitting(false);
  };

  return (
    <div className="port-wrap port-section min-h-screen">
      {/* Header */}
      <div className="section-head">
        <span className="section-num">/ guestbook</span>
        <h2 className="section-title">Guestbook</h2>
        <span className="section-kicker">leave a note</span>
      </div>

      <p className="text-[var(--fg-muted)] text-[14.5px] leading-relaxed mb-10 max-w-lg">
        Write anything for future visitors — thoughts, hellos, or just a wave.
      </p>

      {/* Auth + compose */}
      {session ? (
        <div className="flex flex-col gap-4 mb-10">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[12px] text-[var(--fg-subtle)]">
              signed in as{' '}
              <span className="text-[var(--fg)]">{session.user.name}</span>
            </span>
            <button
              onClick={() => signOut()}
              className="font-mono text-[11.5px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150 underline underline-offset-2"
            >
              sign out
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              placeholder="Your message…"
              className="flex-1 bg-[var(--bg-elev)] border border-[var(--line)] rounded-[10px] px-4 py-2.5 text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] outline-none focus:border-[var(--line-strong)] transition-colors duration-150"
            />
            <button
              type="submit"
              disabled={submitting || !userMsg.trim()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--fg)] text-[var(--bg)] rounded-[10px] font-mono text-[12px] font-medium disabled:opacity-40 transition-opacity duration-150 hover:opacity-80"
            >
              {submitting ? (
                '…'
              ) : (
                <>
                  <span>Send</span>
                  <SendIcon />
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="mb-10">
          <button
            onClick={() => signIn('github')}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-[var(--fg)] text-[var(--bg)] rounded-[10px] font-mono text-[12.5px] font-medium hover:opacity-80 transition-opacity duration-150"
          >
            <AiOutlineGithub size={16} />
            Sign in with GitHub
          </button>
        </div>
      )}

      {/* Entries */}
      <div className="flex flex-col gap-px border border-[var(--line)] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center font-mono text-[12px] text-[var(--fg-subtle)]">
            Loading…
          </div>
        ) : entries.length === 0 ? (
          <div className="py-16 text-center font-mono text-[12px] text-[var(--fg-subtle)]">
            No entries yet — be the first.
          </div>
        ) : (
          entries.map((item, i) => (
            <div
              key={item.id ?? i}
              className="flex items-baseline justify-between gap-6 px-5 py-4 bg-[var(--bg-elev)] hover:bg-[var(--chip)] transition-colors duration-150"
            >
              <div className="flex items-baseline gap-3 min-w-0">
                <span className="font-mono text-[11.5px] text-[var(--accent)] shrink-0">
                  {item.username}
                </span>
                <span className="text-[14px] text-[var(--fg)] leading-relaxed truncate">
                  {item.message}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[var(--fg-subtle)] shrink-0">
                {formatDate(item.created_at)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Guestbook;
