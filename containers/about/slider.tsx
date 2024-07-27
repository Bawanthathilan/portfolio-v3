import React from 'react';
import Title from '@/components/Title';
import Image from 'next/image';

const Slider = () => {
  return (
    <div className=" mt-20 mb-10">
      <Title title="Memories" />

      <div className="columns-2 sm:columns-3 gap-4 my-8">
        <div className="relative h-40 mb-4">
          <Image
            src="https://res.cloudinary.com/sliit123/image/upload/v1722056054/452512503_488795937180664_7271840043657978943_n_sonkaw.jpg"
            alt="img"
            loading="lazy"
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="relative h-80 mb-4 sm:mb-0">
          <Image
            src="https://res.cloudinary.com/sliit123/image/upload/v1657634530/274008021_4972833612755971_1080696660064803007_n_r21r7c.jpg"
            alt="img"
            loading="lazy"
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="relative h-40 sm:h-80 sm:mb-4">
          <Image
            src="https://res.cloudinary.com/sliit123/image/upload/v1689487370/316658694_430294279302760_1659755422825450540_n_uvjvum.jpg"
            alt="img"
            loading="lazy"
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="relative h-40 mb-4 sm:mb-0">
          <Image
            src="https://res.cloudinary.com/sliit123/image/upload/v1657634536/78390585_2506948399550696_6980378636998148096_n_vdocpq.jpg"
            alt="img"
            loading="lazy"
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="relative h-40 mb-4">
          <Image
            src="https://res.cloudinary.com/sliit123/image/upload/v1657634607/70194955_2480635875505990_7830033192324169728_n_pngnmx.jpg"
            alt="img"
            loading="lazy"
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="relative h-80">
          <Image
            src="https://res.cloudinary.com/sliit123/image/upload/v1657204392/269486241_4901193186586681_4737586760052715988_n_anphqo.jpg"
            alt="img"
            loading="lazy"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Slider;
