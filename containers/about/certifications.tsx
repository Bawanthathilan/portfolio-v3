import React from 'react';
import Title from '@/components/Title';
import Image from 'next/image';
import Link from 'next/link';
import AZ900 from '@/assets/images/az_900.png';
import CNCF from '@/assets/images/cncf.png';

const Certifications = () => {
  return (
    <div className="mt-20">
      <Title title="Certifications / Badges" />

      <div className="card_container grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-5 mt-10">
        <Link
          aria-label="credly - Certificate"
          href="https://www.credly.com/badges/09b8c330-9401-48f7-927a-683a5b49df5d/public_url"
          target="_blank"
          className="group"
        >
          <div className="card bg-secondary p-10 rounded-xl flex justify-center relative dark:bg-darkBg">
            <div className="img relative w-[300px] h-[300px]">
              <Image
                loading="lazy"
                src={AZ900}
                alt="az_900"
                fill
                className=" object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
              />
            </div>
          </div>
        </Link>
        <Link
          aria-label="credly-badges"
          href="https://www.credly.com/badges/98030dab-8152-4ef9-93a4-ee6f7297530e/public_url"
          target="_blank"
          className=" group"
        >
          <div className="card bg-secondary p-10 rounded-xl flex justify-center  dark:bg-darkBg">
            <div className="img relative w-[300px] h-[300px]">
              <Image
                loading="lazy"
                src={CNCF}
                alt="az_900"
                fill
                className=" object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
              />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Certifications;
