import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

const images = [
  {
    src: 'https://res.cloudinary.com/sliit123/image/upload/v1722056054/452512503_488795937180664_7271840043657978943_n_sonkaw.jpg',
    span: 'g-1'
  },
  {
    src: 'https://res.cloudinary.com/sliit123/image/upload/v1657634530/274008021_4972833612755971_1080696660064803007_n_r21r7c.jpg',
    span: 'g-2'
  },
  {
    src: 'https://res.cloudinary.com/sliit123/image/upload/v1657634536/78390585_2506948399550696_6980378636998148096_n_vdocpq.jpg',
    span: 'g-3'
  },
  {
    src: 'https://res.cloudinary.com/sliit123/image/upload/v1657634607/70194955_2480635875505990_7830033192324169728_n_pngnmx.jpg',
    span: 'g-4'
  },
  {
    src: 'https://res.cloudinary.com/sliit123/image/upload/v1657204392/269486241_4901193186586681_4737586760052715988_n_anphqo.jpg',
    span: 'g-5'
  }
];

const Gallery = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? null : (i - 1 + images.length) % images.length
      ),
    []
  );
  const next = useCallback(
    () =>
      setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length)),
    []
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, close, prev, next]);

  return (
    <>
      <section id="gallery" className="port-wrap port-section">
        <div className="section-head">
          <span className="section-num">08 / gallery</span>
          <h2 className="section-title">Behind the scenes</h2>
          <span className="section-kicker">moments · talks · travel</span>
        </div>

        <div className="gal-grid">
          {images.map((img, i) => (
            <button
              key={i}
              className={`gal-item ${img.span}`}
              onClick={() => setLightboxIndex(i)}
              aria-label={`Open image ${i + 1}`}
            >
              <Image
                src={img.src}
                alt=""
                fill
                sizes="(max-width: 760px) 50vw, 25vw"
                className="gal-img"
                loading="lazy"
              />
              <span className="gal-overlay" />
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="lb-backdrop"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          {/* Prevent click-inside from closing */}
          <div className="lb-inner" onClick={(e) => e.stopPropagation()}>
            <button className="lb-close" onClick={close} aria-label="Close">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <button
              className="lb-nav lb-prev"
              onClick={prev}
              aria-label="Previous"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              >
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>

            <div className="lb-img-wrap">
              <Image
                src={images[lightboxIndex].src}
                alt=""
                fill
                className="lb-img"
                sizes="90vw"
              />
            </div>

            <button className="lb-nav lb-next" onClick={next} aria-label="Next">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
