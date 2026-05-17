import React from 'react';
import Image from 'next/image';
import az900 from '@/assets/images/az_900.png';
import cncf from '@/assets/images/cncf.png';

const certs = [
  {
    img: az900,
    alt: 'Microsoft Certified: Azure Fundamentals',
    link: 'https://www.credly.com/badges/09b8c330-9401-48f7-927a-683a5b49df5d/public_url'
  },
  {
    img: cncf,
    alt: 'CNCF Kubernetes Community Days — Program Committee Member 2022',
    link: 'https://www.credly.com/badges/98030dab-8152-4ef9-93a4-ee6f7297530e/public_url'
  }
];

const VerifyIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
  >
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

const Certifications = () => {
  return (
    <section id="certifications" className="port-wrap port-section">
      <div className="section-head">
        <span className="section-num">06 / certifications</span>
        <h2 className="section-title">Certifications</h2>
        <span className="section-kicker">verified credentials</span>
      </div>

      <div className="flex flex-wrap gap-6">
        {certs.map((cert, i) => (
          <a
            key={i}
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3"
          >
            <div className="w-32 h-32 relative transition-transform duration-200 group-hover:scale-105">
              <Image
                src={cert.img}
                alt={cert.alt}
                fill
                className="object-contain"
              />
            </div>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors duration-150">
              verify <VerifyIcon />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Certifications;
