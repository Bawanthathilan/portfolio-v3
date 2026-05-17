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
