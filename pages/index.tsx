import React from 'react';
import Hero from '@/containers/v3/hero';
import Work from '@/containers/v3/work';
import Projects from '@/containers/v3/projects';
import Highlights from '@/containers/v3/highlights';
import Certifications from '@/containers/v3/certifications';
import OpenSource from '@/containers/v3/open-source';
import Writing from '@/containers/v3/writing';
import OffTheClock from '@/containers/v3/off-the-clock';
import Contributions from '@/containers/v3/contributions';
import Guestbook from '@/containers/v3/guestbook';

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <Projects />
      <Highlights />
      <Certifications />
      <OpenSource />
      <Writing />
      <OffTheClock />
      <Contributions />
      <Guestbook />
    </>
  );
}
