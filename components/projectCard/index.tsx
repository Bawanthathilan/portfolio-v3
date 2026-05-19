import React, { useState, MouseEvent, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { BsArrowUpRightCircle } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';

interface ProjectCardProps {
  title: string;
  description: string;
  image: any;
  link: string;
  github: string;
  category?: string;
  tech?: string[];
}

function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
}

function Effect({ mouseX, mouseY, ...gridProps }: any) {
  let maskImage = useMotionTemplate`radial-gradient(300px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50"></div>
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#D7EDEA] to-[#F4FBDF] opacity-0 transition duration-300 group-hover:opacity-100 dark:from-[#202D2E] dark:to-[#303428]"
        style={style}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay transition duration-300 group-hover:opacity-100"
        style={style}
      ></motion.div>
    </div>
  );
}

const ProjectCard = ({
  title,
  description,
  image,
  link,
  github,
  category,
  tech
}: ProjectCardProps) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const data = {
    pattern: {
      y: 16,
      squares: [
        [0, 1],
        [1, 3]
      ]
    }
  };

  return (
    <div
      onMouseMove={onMouseMove}
      className=" group cursor-pointer border border-grey-200 dark:border-[#27272a] bg-secondary rounded-2xl h-[500px] max-h-[500px] p-10 flex flex-col gap-5 dark:bg-darkBg relative"
    >
      <span className="absolute w-[40%] bottom-0 right-px h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0 dark:from-blue-400/0 dark:via-blue-400/40 dark:to-blue-400/0"></span>
      <span className="absolute w-px left-0 h-[40%] bg-gradient-to-b from-blue-500/0 via-blue-500/40 to-blue-500/0 dark:from-blue-400/0 dark:via-blue-400/40 dark:to-blue-400/0"></span>
      <Effect {...data.pattern} mouseX={mouseX} mouseY={mouseY} />
      <div className="header flex flex-row justify-between gap-5 z-10">
        <div className="title flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-primary dark:text-white">
            {title}
          </h1>
          <p className="text-textPrimary font-medium text-lg">{description} </p>

          <div className="line w-full h-[1px] bg-textPrimary opacity-10"></div>
        </div>
        <div className="icons flex gap-5">
          {link && (
            <Link href={`${link}`} aria-label="up">
              <BsArrowUpRightCircle className=" text-3xl  md:text-5xl text-textPrimary group-hover:text-primary dark:group-hover:text-white" />
            </Link>
          )}

          {github && (
            <Link aria-label="github" href={`${github}`}>
              <FaGithub className="text-3xl  md:text-5xl text-textPrimary group-hover:text-primary dark:group-hover:text-white" />
            </Link>
          )}
        </div>
      </div>

      <div className="image relative h-[400px] transition-[all_400ms_cubic-bezier(0.03,0.98,0.52,0.99)_0s] will-change-transform">
        <Image
          loading="lazy"
          src={image}
          alt={`${title}`}
          fill
          className="object-cover rounded-2xl saturate-0 group-hover:saturate-100 transition-[transform,filter] duration-300 ease-out group-hover:scale-105"
        />
      </div>
    </div>
  );
};

export default ProjectCard;
