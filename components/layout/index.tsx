import React, { useEffect, useRef } from 'react';
import Navbar from '../navbar';
import Footer from '../footer';
import SpotifyIsland from '../SpotifyIsland';
import { SpeedInsights } from '@vercel/speed-insights/next';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (spotRef.current) {
        spotRef.current.style.setProperty('--mx', e.clientX + 'px');
        spotRef.current.style.setProperty('--my', e.clientY + 'px');
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    const attach = () => {
      document
        .querySelectorAll('.port-section:not(.is-visible)')
        .forEach((s) => io.observe(s));
    };

    attach();

    // Re-scan when DOM changes (page navigation, async data renders)
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)]" suppressHydrationWarning>
      <div className="guides" />
      <div className="spotlight" ref={spotRef} />
      <Navbar />
      <main className="port-col">{children}</main>
      <SpeedInsights />
      <Footer />
      <SpotifyIsland />
    </div>
  );
};

export default Layout;
