// Adapted from ui lab by Yash Bavadiya (MIT, see THIRD_PARTY_NOTICES.md):
// https://github.com/xevrion/ui-lab/blob/main/src/lab/components/loader-set.tsx
// Changes: just the Spinner, without its finish (the content it waits for
// fades in instead); the spin lives in globals.scss (`.loader-spin`), and it
// takes its colour from `currentColor`.
import React from 'react';
import { cn } from '@/utils/cn';

export function Spinner({
  label = 'Loading',
  className
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div role="status" aria-label={label} className={className}>
      <span className="sr-only">{label}</span>
      <svg
        viewBox="0 0 24 24"
        className={cn('loader-spin h-7 w-7')}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        aria-hidden
      >
        <circle cx="12" cy="12" r="9" className="opacity-15" />
        {/* A quarter of the 56.5px circumference, rounded at both ends */}
        <circle
          cx="12"
          cy="12"
          r="9"
          strokeLinecap="round"
          strokeDasharray="14 56.5"
        />
      </svg>
    </div>
  );
}
