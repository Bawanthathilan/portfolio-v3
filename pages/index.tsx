import React from 'react';
import Hero from '@/containers/home/hero';
import Work from '@/containers/home/work';
import Blog from '@/containers/home/blog';
import Comments from '@/containers/home/comments';
import Contact from '@/containers/home/contact';
import Sessions from '@/containers/home/sessions';

export default function Home() {
  return (
    <main>
      <Hero />
      <Work />
      <Blog />
      <Sessions />
      <Comments />
      <Contact />
    </main>
  );
}
