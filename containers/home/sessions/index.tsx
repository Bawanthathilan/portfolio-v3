import React from 'react';
import Title from '@/components/Title';
import BlogPosts from '@/components/blogCard/blogPost';

const Sessions = () => {
  return (
    <section className="mt-20">
      <Title title="Sessions" />

      <div className="blogCard mt-10 md:mt-10 mb-20">
        <iframe
          className=" rounded-md"
          width="100%"
          height="600"
          src="https://www.youtube.com/embed/5ow7YhMKrs0?si=dxl0bGsmQWIB7P6t"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
};

export default Sessions;
