import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="port-wrap port-section text-center">
      <h2 className="text-[clamp(44px,6vw,78px)] font-medium tracking-[-0.03em] leading-[1.05] mb-[22px] font-sans text-[var(--fg)]">
        Let's do something{' '}
        <em className="font-serif not-italic text-[var(--accent)] font-normal">
          amazing !
        </em>
      </h2>
      <a
        href="mailto:bawantharathnayaka@gmail.com"
        className="inline-flex items-center gap-2 px-[22px] py-[13px] rounded-[10px] text-[15px] font-medium no-underline bg-[var(--fg)] text-[var(--bg)] transition-opacity duration-150 hover:opacity-[0.85]"
      >
        bawantharathnayaka@gmail.com
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M7 17L17 7M9 7h8v8" />
        </svg>
      </a>
    </section>
  );
};

export default Contact;
