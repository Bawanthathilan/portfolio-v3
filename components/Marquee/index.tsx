import React, { ReactElement, ReactNode } from 'react';
import Marqueee from 'react-fast-marquee';

import { useTheme } from 'next-themes';

interface MarqueeProps {
  children: any;
  direction?: any;
}

const CustomMarquee = ({ children, direction = 'right' }: MarqueeProps) => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  return (
    <div className=" w-full relative">
      <div className="absolute left-0 w-10 h-[100%] bg-gradient-to-r  dark:from-[#121212] z-10" />
      <div className="absolute right-0 w-10 h-[100%] bg-gradient-to-l  dark:from-[#121212] z-10" />
      <Marqueee
        autoFill
        direction={direction}
        gradient={currentTheme === 'dark' ? false : true}
        gradientWidth={100}
        pauseOnHover={true}
        className="marq"
        speed={40}
      >
        {children}
      </Marqueee>
    </div>
  );
};

export default CustomMarquee;
