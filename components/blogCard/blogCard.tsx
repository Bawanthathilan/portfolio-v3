import React, {useCallback , useRef} from 'react';
import Image from 'next/image';
import { useMousePosition } from '@/hooks/useMousePosition';

interface Props {
  post: any;
}

const BlogCard = ({ post }: Props) => {
  const divRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
 
  const update = useCallback(({ x, y }: { x: number; y: number }) => {
    // We need to offset the position to center the info div
    const offsetX = (infoRef.current?.offsetWidth || 0) / 2;
    const offsetY = (infoRef.current?.offsetHeight || 0) / 2;
 
    // Use CSS variables to position the info div instead of state to avoid re-renders
    infoRef.current?.style.setProperty("--x", `${x - offsetX}px`);
    infoRef.current?.style.setProperty("--y", `${y - offsetY}px`);
  }, []);
 
  useMousePosition(divRef, update);

  const ThumbnailImage = post?.description
    ?.toString()
    .match(/<img[^>]+src="([^">]+)"/)[1];

  return (
    <div className="bg-grid-secondary overflow-hidden bg-grid-slate-100 border border-grey-200 dark:border-[#27272a]  rounded-3xl dark:bg-grid-[#1f1f21] relative cursor-none group" ref={divRef}>
      <span className="absolute w-[40%] bottom-0 right-px h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0 dark:from-blue-400/0 dark:via-blue-400/40 dark:to-blue-400/0"></span>
      <span className="absolute w-px left-0 h-[40%] bg-gradient-to-b from-blue-500/0 via-blue-500/40 to-blue-500/0 dark:from-blue-400/0 dark:via-blue-400/40 dark:to-blue-400/0"></span>
      <div className="blog_content p-5 md:p-10 bg-gradient-to-bl from-transparent via-white to-white dark:via-darkBg dark:to-darkBg grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="blog_image relative col-span-5 sm:col-span-5 md:col-span-5 lg:col-span-2 h-[400px] sm:h-[400px] md:h-[400px] lg:h-auto">
          <Image
            loading="lazy"
            src={ThumbnailImage}
            alt="blog"
            fill
            className=" object-cover rounded-3xl"
          />
        </div>
        <div className="blog_info flex flex-col gap-5 col-span-3">
          <h1 className="text-4xl text-primary font-bold dark:text-white">
            {post['title']}
          </h1>
          <p className="text-textSecondary mt-5">
            {`${post.description?.substring(0, 500).replace(/<[^>]*>/g, '')} ....`}
          </p>
        </div>
      </div>

      {/* Cursor tracker */}
      <div
        ref={infoRef}
        style={{
          transform: "translate(var(--x), var(--y))",
        }}
        className="pointer-events-none absolute left-0 top-0 z-50 rounded-full bg-[#7043EC] px-4 py-2 text-sm font-bold text-white opacity-0 duration-0 group-hover:opacity-100"
      >
        Read more &rarr;
      </div>
    </div>
  );
};

export default BlogCard;
