import React from 'react';
import Title from '@/components/Title';
import Image from 'next/image';
import Link from 'next/link';

import useSupabaseBrowser from '@/utils/supabase-browser';
import { getAchievementsData } from '@/queries';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';

const Acheivement = () => {
  const supabase = useSupabaseBrowser();
  const {
    data: achievements,
    isLoading,
    isError
  } = useQuery(getAchievementsData(supabase));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !achievements) {
    return <div>Error</div>;
  }

  return (
    <div className="mt-20">
      <Title title="Acheivements" />

      <div className="card_container mt-10 flex flex-col gap-5">
        {achievements?.map((achievement: any, index: number) => (
          <Link
            aria-label="achievement"
            href={achievement.link}
            target="_blank"
            key={index}
          >
            <div className="card relative border border-grey-200 dark:border-[#27272a]  card bg-secondary p-10 rounded-2xl grid  grid-cols-1 sm:grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-10 dark:bg-darkBg items-center justify-center">
              <span className="absolute w-[40%] bottom-0 right-px h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0 dark:from-blue-400/0 dark:via-blue-400/40 dark:to-blue-400/0"></span>
              <span className="absolute w-px left-0 h-[40%] bg-gradient-to-b from-blue-500/0 via-blue-500/40 to-blue-500/0 dark:from-blue-400/0 dark:via-blue-400/40 dark:to-blue-400/0"></span>
              <div className="imgg  col-span-1 md:col-span-1">
                <Image
                  loading="lazy"
                  src={achievement?.image}
                  alt={achievement?.title}
                  width={300}
                  height={300}
                  className=" rounded-xl"
                />
              </div>

              <div className="contents_card flex flex-col gap-5 col-span-1 sm:col-span-1 md:col-span-4">
                <div className="title_card flex flex-col gap-5">
                  <h3 className="text-2xl font-bold">{achievement?.name}</h3>
                  <p className="text-md text-gray-500 dark:text-gray-400">
                    {achievement?.desc}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Acheivement;
