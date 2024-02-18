import React from 'react';
import Navbar from '../navbar';
import Footer from '../footer';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useTheme } from 'next-themes';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  return (
    <div className="container">
      <Navbar />
      {currentTheme === 'dark' ? (
        <div className="h-full w-full bg-white">
          <div className="absolute z-[-1] bottom-0 left-0 right-0 top-0 bg-[radial-gradient(#4f4f4f2e_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>
      ) : (
        <div className="h-full w-full bg-white">
          <div className="absolute z-[-1] bottom-0 left-0 right-0 top-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>
      )}
      {children}
      <SpeedInsights />
      <Footer />
    </div>
  );
};

export default Layout;
