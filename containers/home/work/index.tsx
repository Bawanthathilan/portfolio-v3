'use client';
import React, { useEffect } from 'react';
import Title from '@/components/Title';
import ProjectCard from '@/components/projectCard';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation, Pagination } from 'swiper';

import useSupabaseBrowser from '@/utils/supabase-browser';
import { getProjectsData } from '@/queries';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';

const Work = () => {
  const supabase = useSupabaseBrowser();
  const {
    data: projects,
    isLoading,
    isError
  } = useQuery(getProjectsData(supabase));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !projects) {
    return <div>Error</div>;
  }

  return (
    <section id="work" className="mt-20">
      <Title title="Work" />

      <div className="slider mt-10 md:mt-20 ">
        <Swiper
          navigation={true}
          className="mySwiper"
          slidesPerView={2}
          spaceBetween={30}
          pagination={{
            clickable: true
          }}
          modules={[Pagination, Navigation]}
          breakpoints={{
            // when window width is >= 320px
            320: {
              slidesPerView: 1,
              spaceBetween: 20
            },
            // when window width is >= 480px
            480: {
              slidesPerView: 1,
              spaceBetween: 30
            },
            // when window width is >= 640px
            640: {
              slidesPerView: 1,
              spaceBetween: 30
            },
            1000: {
              slidesPerView: 2,
              spaceBetween: 30
            },

            1900: {
              slidesPerView: 2,
              spaceBetween: 30
            }
          }}
        >
          {projects?.map((project: any, index: number) => (
            <SwiperSlide key={index}>
              <ProjectCard
                image={project.img}
                title={project.name}
                description={project.desc}
                link={project.web}
                github={project.github}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Work;
