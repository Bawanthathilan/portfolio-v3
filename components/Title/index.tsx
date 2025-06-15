import React from 'react';

interface TitleProps {
  title: string;
}

const Title = ({ title }: TitleProps) => {
  return (
    <div className="w-full flex-col sm:flex-col md:flex-row lg:flex justify-start items-center">
      <h1 className=" text-3xl sm:text-3xl md:text-5xl lg:text-5xl font-bold text-primary dark:text-white titleFont">
        {title}
      </h1>
      {/* line */}
      <div className="w-full h-[0.5px] bg-black dark:bg-gray-800  mt-2 ml-2"></div>
      {/* <div className="h-px border-b w-full border-slate-200 dark:border-slate-800 relative my-4">
        <span className="absolute w-[40%] -bottom-px left-px h-px bg-gradient-to-r from-blue-500/0 via-teal-500/40 to-teal-500/0 dark:from-teal-400/0 dark:via-teal-400/40 dark:to-teal-400/0"></span>
      </div> */}
    </div>
  );
};

export default Title;
