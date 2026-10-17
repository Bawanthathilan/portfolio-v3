// Adapted from ui lab by Yash Bavadiya (MIT, see THIRD_PARTY_NOTICES.md):
// https://github.com/xevrion/ui-lab/blob/main/src/lab/components/loader-set.tsx
// Changes: just the skeleton bones, as reusable pieces; the shimmer lives in
// globals.scss (`.skeleton-bone`) with the site's colour variables.
import React from 'react';
import { cn } from '@/utils/cn';

// One placeholder shape. Size and rounding come from className, so each bone
// can sit exactly where its real content will appear.
export function Bone({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('skeleton-bone block rounded-full', className)}
    />
  );
}

// Announces the wait to screen readers; the bones themselves are decorative.
export function SkeletonStatus({
  label = 'Loading',
  className,
  children
}: {
  label?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div role="status" aria-label={label} className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
