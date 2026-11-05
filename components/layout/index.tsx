import React, { useEffect } from 'react';
import Navbar from '@/components/v3/navbar';
import Footer from '@/components/v3/footer';
import Dock from '@/components/v3/dock';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { MotionConfig } from 'framer-motion';
import { startSmoothScroll } from '@/utils/smooth-scroll';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  useEffect(startSmoothScroll, []);

  return (
    // reducedMotion="user": drop transform animations, keep fades, when the
    // visitor has asked their OS for less motion.
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[var(--bg)]" suppressHydrationWarning>
        <Navbar />
        <main className="mx-auto max-w-[672px] px-4">{children}</main>
        <Footer />
        <Dock />
        <SpeedInsights />
      </div>
    </MotionConfig>
  );
};

export default Layout;
