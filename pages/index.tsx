import React from 'react';
import Hero from '@/containers/home/hero';
import About from '@/containers/home/about';
import Work from '@/containers/home/work';
import Video from '@/containers/home/video';
import Stack from '@/containers/home/stack';
import Experience from '@/containers/home/experience';
import Certifications from '@/containers/home/certifications';
import Achievements from '@/containers/home/achievements';
import Gallery from '@/containers/home/gallery';
import Testimonials from '@/containers/home/testimonials';
import Blog from '@/containers/home/blog';
import Contact from '@/containers/home/contact';

export default function Home() {
  return (
    <main>
      <Hero />
      {/* <About /> */}
      <Work />
      <Video />
      <Stack />
      <Experience />
      <Certifications />
      <Achievements />
      <Testimonials />
      <Blog />
      <Gallery />
      <Contact />
    </main>
  );
}
